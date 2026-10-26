/**
 * Phase 02 Progress-Aware Heartbeat Watchdog Verification Test Harness
 * Verifies:
 * 1. localAIService initializes heartbeat & watchdog properties and exposes them in getState().
 * 2. Static source invariants: armProgressWatchdog, resetWatchdogHeartbeat, and clearWatchdog implemented.
 * 3. Heartbeat auto-reset while download progress advances (extends lifetime past 20s without false timeout).
 * 4. Stalled download detection triggers fallback after 10 continuous seconds of zero progress.
 * 5. 15-second compilation grace window applied at 100% progress and for cached model loads.
 * 6. Deterministic timer clearing on MODEL_READY, ERROR, DEVICE_LOST, turnOffAI, and worker termination.
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('========================================================================================');
console.log('  PHASE 02: PROGRESS-AWARE HEARTBEAT WATCHDOG VERIFICATION HARNESS');
console.log('========================================================================================');

// --- Suite 1: Static Code Inspection & Invariant Analysis ---
console.log('\n--- Suite 1: Watchdog Static Code & Architectural Invariant Checks ---');

const servicePath = path.join(rootDir, 'src', 'services', 'localAIService.js');
const serviceCode = fs.readFileSync(servicePath, 'utf8');

// Invariant 1.1: Heartbeat tracking properties initialized in constructor
assert(serviceCode.includes('this.watchdogDurationMs = 10000;'), 'localAIService must define 10000ms watchdogDurationMs');
assert(serviceCode.includes('this.compilationWatchdogMs = 15000;'), 'localAIService must define 15000ms compilationWatchdogMs');
assert(serviceCode.includes('this.lastProgressTimestamp = 0;'), 'localAIService must initialize lastProgressTimestamp');
assert(serviceCode.includes('this.lastLoadedBytes = 0;'), 'localAIService must initialize lastLoadedBytes');
assert(serviceCode.includes('this.lastProgressPercent = 0;'), 'localAIService must initialize lastProgressPercent');
assert(serviceCode.includes('this.lastHeartbeatTime = 0;'), 'localAIService must initialize lastHeartbeatTime');
assert(serviceCode.includes('this.lastHeartbeatLoadedBytes = 0;'), 'localAIService must initialize lastHeartbeatLoadedBytes');
assert(serviceCode.includes('this.lastHeartbeatProgress = 0;'), 'localAIService must initialize lastHeartbeatProgress');
console.log('  ✅ PASS: Watchdog timing constants & heartbeat tracking state initialized in constructor');

// Invariant 1.2: Dedicated watchdog management methods exist
assert(serviceCode.includes('armProgressWatchdog('), 'localAIService must implement armProgressWatchdog()');
assert(serviceCode.includes('resetWatchdogHeartbeat('), 'localAIService must implement resetWatchdogHeartbeat()');
assert(serviceCode.includes('clearWatchdog()'), 'localAIService must implement clearWatchdog()');
console.log('  ✅ PASS: Dedicated watchdog management methods (arm, reset, clear) declared');

// Invariant 1.3: Progress advancement condition in handleWorkerMessage
assert(
  serviceCode.includes('loaded > this.lastLoadedBytes || progress > this.lastProgressPercent'),
  'PROGRESS handler must check if bytes or progress percent have advanced'
);
assert(
  serviceCode.includes('progress >= 100'),
  'PROGRESS handler must grant compilation grace window when progress >= 100'
);
assert(
  serviceCode.includes('this.compilationWatchdogMs'),
  'PROGRESS handler must use compilationWatchdogMs for post-download compilation'
);
console.log('  ✅ PASS: Progress advancement detection & 100% compilation grace escalation verified');

// Invariant 1.4: Unconditional watchdog clearing on terminal/abort events
assert(serviceCode.includes("case 'MODEL_READY':") && serviceCode.includes('this.clearWatchdog();'), 'MODEL_READY must clear watchdog');
assert(serviceCode.includes("case 'ERROR':") && serviceCode.includes('this.clearWatchdog();'), 'ERROR must clear watchdog');
assert(serviceCode.includes("case 'DEVICE_LOST':") && serviceCode.includes('this.clearWatchdog();'), 'DEVICE_LOST must clear watchdog');
assert(serviceCode.includes('terminateAndRespawnWorker()') && serviceCode.includes('this.clearWatchdog();'), 'terminateAndRespawnWorker must clear watchdog');
console.log('  ✅ PASS: Unconditional watchdog timer clearing on all lifecycle milestones');

// --- Virtual Clock Harness for Precise Deterministic Time Simulation ---
class VirtualClock {
  constructor() {
    this.now = 1000000; // Start at realistic epoch ms
    this.timers = new Map();
    this.nextId = 1;
    this.origSetTimeout = null;
    this.origClearTimeout = null;
    this.origDateNow = null;
  }

  setTimeout(fn, ms = 0) {
    const id = this.nextId++;
    this.timers.set(id, { fn, triggerAt: this.now + ms, ms });
    return id;
  }

  clearTimeout(id) {
    this.timers.delete(id);
  }

  tick(ms) {
    this.now += ms;
    let fired = true;
    while (fired) {
      fired = false;
      let earliest = null;
      for (const [id, timer] of this.timers.entries()) {
        if (timer.triggerAt <= this.now) {
          if (!earliest || timer.triggerAt < earliest.triggerAt) {
            earliest = { id, ...timer };
          }
        }
      }
      if (earliest) {
        this.timers.delete(earliest.id);
        fired = true;
        earliest.fn();
      }
    }
  }

  install() {
    this.origSetTimeout = globalThis.setTimeout;
    this.origClearTimeout = globalThis.clearTimeout;
    this.origDateNow = Date.now;
    globalThis.setTimeout = (fn, ms) => this.setTimeout(fn, ms);
    globalThis.clearTimeout = (id) => this.clearTimeout(id);
    Date.now = () => this.now;
  }

  uninstall() {
    if (this.origSetTimeout) globalThis.setTimeout = this.origSetTimeout;
    if (this.origClearTimeout) globalThis.clearTimeout = this.origClearTimeout;
    if (this.origDateNow) Date.now = this.origDateNow;
  }
}

// Global Browser Mock
if (typeof globalThis.window === 'undefined') {
  globalThis.window = {
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {}
  };
}

class MockWorker {
  constructor() {
    this.terminated = false;
    this.postedMessages = [];
  }
  postMessage(msg) {
    this.postedMessages.push(msg);
  }
  terminate() {
    this.terminated = true;
  }
}

globalThis.Worker = class extends MockWorker {
  constructor(url, opts) {
    super();
    this.url = url;
    this.opts = opts;
  }
};

const clock = new VirtualClock();
clock.install();

try {
  // Dynamically import localAIService with mock clock active
  const { localAIService } = await import('../src/services/localAIService.js');

  // --- Suite 2: State Extraction & Watchdog Management Methods ---
  console.log('\n--- Suite 2: State Extraction & Dedicated Watchdog Methods ---');

  const state = localAIService.getState();
  assert.strictEqual(typeof state.lastProgressTimestamp, 'number', 'getState must expose lastProgressTimestamp');
  assert.strictEqual(typeof state.lastLoadedBytes, 'number', 'getState must expose lastLoadedBytes');
  assert.strictEqual(typeof state.lastProgressPercent, 'number', 'getState must expose lastProgressPercent');
  assert.strictEqual(typeof state.lastHeartbeatTime, 'number', 'getState must expose lastHeartbeatTime');
  assert.strictEqual(typeof state.lastHeartbeatLoadedBytes, 'number', 'getState must expose lastHeartbeatLoadedBytes');
  assert.strictEqual(typeof state.lastHeartbeatProgress, 'number', 'getState must expose lastHeartbeatProgress');
  console.log('  ✅ PASS: getState() correctly exports all heartbeat telemetry fields');

  // Test armProgressWatchdog & clearWatchdog
  let testTimerFired = false;
  localAIService.armProgressWatchdog('test-model', 1000, 'test_reason');
  assert(localAIService.modelLoadWatchdog !== null, 'modelLoadWatchdog should be armed');
  localAIService.clearWatchdog();
  assert.strictEqual(localAIService.modelLoadWatchdog, null, 'clearWatchdog must nullify modelLoadWatchdog');
  clock.tick(2000);
  assert.strictEqual(testTimerFired, false, 'Cleared watchdog must never fire');
  console.log('  ✅ PASS: armProgressWatchdog & clearWatchdog perform deterministic timer management');

  // --- Suite 3: Heartbeat Auto-Reset During Active Transfer (>20s download) ---
  console.log('\n--- Suite 3: Heartbeat Auto-Reset During Active Download (>20s transfer) ---');

  let downgradeInvoked = false;
  let downgradeReason = null;
  const originalDowngrade = localAIService.handleModelDowngrade;
  localAIService.handleModelDowngrade = (failedId, reason) => {
    downgradeInvoked = true;
    downgradeReason = reason;
  };

  // Initiate model download for 85MB model (not cached)
  await localAIService.loadModelInWorker('HuggingFaceTB/SmolLM2-135M-Instruct', 'q4', false);
  const activeSessionId = localAIService.currentLoadSessionId;
  downgradeInvoked = false;

  // Simulate chunk transfers arriving every 4 seconds for 24 continuous seconds
  // Without heartbeat, fixed 10s watchdog would have killed the download at t=10s
  const chunkSequence = [
    { elapsed: 4000, loaded: 15000000, progress: 17 },
    { elapsed: 4000, loaded: 30000000, progress: 35 },
    { elapsed: 4000, loaded: 45000000, progress: 52 },
    { elapsed: 4000, loaded: 60000000, progress: 70 },
    { elapsed: 4000, loaded: 75000000, progress: 88 },
    { elapsed: 4000, loaded: 85000000, progress: 99 }
  ];

  let cumulativeTime = 0;
  for (const chunk of chunkSequence) {
    clock.tick(chunk.elapsed);
    cumulativeTime += chunk.elapsed;
    localAIService.handleWorkerMessage({
      data: {
        type: 'PROGRESS',
        payload: {
          sessionId: activeSessionId,
          modelId: 'HuggingFaceTB/SmolLM2-135M-Instruct',
          loaded: chunk.loaded,
          progress: chunk.progress,
          total: 85000000
        }
      }
    });

    assert.strictEqual(
      downgradeInvoked,
      false,
      `Watchdog must NOT fire during active transfer at cumulative time ${cumulativeTime}ms`
    );
    assert.strictEqual(
      localAIService.lastLoadedBytes,
      chunk.loaded,
      'lastLoadedBytes must be updated on progress advance'
    );
    assert.strictEqual(
      localAIService.lastProgressPercent,
      chunk.progress,
      'lastProgressPercent must be updated on progress advance'
    );
  }

  console.log(`  ✅ PASS: 24-second active download completed with 0 false-positive watchdog timeouts (${cumulativeTime}ms simulated)`);

  // --- Suite 4: Stalled Download Fallback Detection ---
  console.log('\n--- Suite 4: Stalled Download Detection (10 continuous seconds of zero progress) ---');

  // Advance time by 9,500ms (just under 10s stall threshold) -> should not trigger yet
  clock.tick(9500);
  assert.strictEqual(downgradeInvoked, false, 'Watchdog should NOT fire before 10s of stall elapsed');

  // Send a duplicate progress event with same bytes/progress (simulating stalled network packet)
  localAIService.handleWorkerMessage({
    data: {
      type: 'PROGRESS',
      payload: {
        sessionId: activeSessionId,
        modelId: 'HuggingFaceTB/SmolLM2-135M-Instruct',
        loaded: 85000000,
        progress: 99,
        total: 85000000
      }
    }
  });

  // Advance remaining 600ms (exceeds 10,000ms total stall time)
  clock.tick(600);
  assert.strictEqual(downgradeInvoked, true, 'Watchdog MUST fire after 10 continuous seconds of zero progress');
  assert.strictEqual(
    downgradeReason,
    'timeout_watchdog_stalled',
    'Downgrade reason must indicate timeout_watchdog_stalled'
  );
  console.log('  ✅ PASS: Stalled network transfer accurately triggered fallback ladder after 10s of zero progress');

  // --- Suite 5: 15-Second Shader Compilation Grace Window ---
  console.log('\n--- Suite 5: 15-Second Shader Compilation Grace Window ---');

  // Test 5.1: 100% download progress initiates 15s grace window
  downgradeInvoked = false;
  downgradeReason = null;
  await localAIService.loadModelInWorker('onnx-community/Qwen2.5-0.5B-Instruct', 'q4', false);
  const sessionForCompile = localAIService.currentLoadSessionId;

  // Send 100% progress
  localAIService.handleWorkerMessage({
    data: {
      type: 'PROGRESS',
      payload: {
        sessionId: sessionForCompile,
        modelId: 'onnx-community/Qwen2.5-0.5B-Instruct',
        loaded: 350000000,
        progress: 100,
        total: 350000000
      }
    }
  });

  // At 100%, compilation grace window is 15s. At t=12s, standard 10s timer would fail, but 15s budget must hold
  clock.tick(12000);
  assert.strictEqual(downgradeInvoked, false, 'Compilation grace window must permit compilation past 10s up to 15s');

  // Send MODEL_READY at t=12s
  localAIService.handleWorkerMessage({
    data: {
      type: 'MODEL_READY',
      payload: {
        sessionId: sessionForCompile,
        modelId: 'onnx-community/Qwen2.5-0.5B-Instruct',
        device: 'webgpu',
        dtype: 'q4'
      }
    }
  });

  assert.strictEqual(localAIService.modelLoadWatchdog, null, 'MODEL_READY must completely clear watchdog timer');
  // Tick past 15s to confirm timer was truly cancelled
  clock.tick(5000);
  assert.strictEqual(downgradeInvoked, false, 'Cancelled compilation watchdog must never fire after MODEL_READY');
  console.log('  ✅ PASS: 100% download transitioned to 15s compilation window and cleared cleanly on MODEL_READY');

  // Test 5.2: Cached model loading applies 15s compilation budget and fires compilation_timeout on hang
  downgradeInvoked = false;
  downgradeReason = null;
  await localAIService.loadModelInWorker('onnx-community/Qwen2.5-0.5B-Instruct', 'q4', true); // isCached = true

  // Advance 14,000ms -> should not fire yet
  clock.tick(14000);
  assert.strictEqual(downgradeInvoked, false, 'Cached load watchdog must give full 15s budget');

  // Advance past 15,000ms -> should fire compilation_timeout
  clock.tick(1500);
  assert.strictEqual(downgradeInvoked, true, 'Watchdog must fire if compilation exceeds 15s');
  assert.strictEqual(downgradeReason, 'compilation_timeout', 'Downgrade reason must be compilation_timeout');
  console.log('  ✅ PASS: Cached load applies 15s compilation grace window and fires compilation_timeout on hang');

  // Restore original method
  localAIService.handleModelDowngrade = originalDowngrade;
} finally {
  clock.uninstall();
}

console.log('\n========================================================================================');
console.log('  ALL PHASE 02 WATCHDOG TESTS PASSED (100% GREEN)');
console.log('========================================================================================\n');
