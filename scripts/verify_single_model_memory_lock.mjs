/**
 * Master Verification Harness: Single Model Memory Lock & Concurrent Preload Mutex Architecture
 * Phase 04 Production Sign-Off Harness
 *
 * Verifies:
 * - Suite 1: Static Code & Mutex Contracts (LocalAIService, aiModelWorker, App.jsx, AIChatWidget.jsx)
 * - Suite 2: Concurrent Load Preemption Simulation (Immediate abort, worker termination, monotonic session ID, stale message rejection)
 * - Suite 3: Progress-Aware Heartbeat Watchdog Simulation (>15s active transfer resilience, 10s stall detection, 15s compilation window)
 * - Suite 4: Memory Invariants & Single Active Model Lock (Strictly 1 model in RAM, rapid multi-turn race preemption, clean purge)
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('========================================================================================');
console.log('  SINGLE MODEL MEMORY LOCK & CONCURRENCY MUTEX HARNESS');
console.log('========================================================================================');

// ========================================================================================
// --- Suite 1: Static Code & Mutex Contracts ---
// ========================================================================================
console.log('\n--- Suite 1: Static Code & Mutex Contracts ---');

const servicePath = path.join(rootDir, 'src', 'services', 'localAIService.js');
const workerPath = path.join(rootDir, 'src', 'workers', 'aiModelWorker.js');
const appPath = path.join(rootDir, 'src', 'App.jsx');
const chatWidgetPath = path.join(rootDir, 'src', 'components', 'AIChatWidget.jsx');

const serviceCode = fs.readFileSync(servicePath, 'utf8');
const workerCode = fs.readFileSync(workerPath, 'utf8');
const appCode = fs.readFileSync(appPath, 'utf8');
const chatWidgetCode = fs.readFileSync(chatWidgetPath, 'utf8');

// 1.1: LocalAIService contract checks
assert(serviceCode.includes('this.currentLoadSessionId = 0;'), 'localAIService must initialize currentLoadSessionId');
assert(serviceCode.includes('this.isModelLoading = false;'), 'localAIService must initialize isModelLoading');
assert(serviceCode.includes('armProgressWatchdog('), 'localAIService must implement armProgressWatchdog');
assert(serviceCode.includes('clearWatchdog()'), 'localAIService must implement clearWatchdog');
assert(serviceCode.includes('terminateAndRespawnWorker()'), 'localAIService must implement terminateAndRespawnWorker');
assert(serviceCode.includes('msgSessionId !== this.currentLoadSessionId'), 'localAIService must filter stale messages by session ID');
console.log('  ✅ PASS: localAIService contains currentLoadSessionId & isModelLoading state');

// 1.2: aiModelWorker contract checks
assert(!workerCode.includes('if (isLoading) return;'), 'aiModelWorker must NOT contain silent drop (if (isLoading) return;)');
assert(!workerCode.includes("self.postMessage({ type: 'STATUS', message: 'Model load already in progress' });"), 'aiModelWorker must NOT drop commands with status message');
assert(workerCode.includes('sessionId: currentSessionId'), 'aiModelWorker must propagate sessionId in events');
assert(workerCode.includes("case 'ABORT_LOAD':"), 'aiModelWorker must implement ABORT_LOAD message handler');
console.log('  ✅ PASS: aiModelWorker does not drop commands and propagates sessionId');

// 1.3: App.jsx and AIChatWidget.jsx de-duplication guards
assert(appCode.includes('currentState.status === \'idle\''), 'App.jsx must check idle status');
assert(appCode.includes('!currentState.activeModel'), 'App.jsx must guard on !activeModel');
assert(appCode.includes('!currentState.downloadingModel'), 'App.jsx must guard on !downloadingModel');
assert(appCode.includes('!currentState.isModelLoading'), 'App.jsx must guard on !isModelLoading');

assert(chatWidgetCode.includes('currentState.status === \'idle\''), 'AIChatWidget.jsx must check idle status');
assert(chatWidgetCode.includes('!currentState.activeModel'), 'AIChatWidget.jsx must guard on !activeModel');
assert(chatWidgetCode.includes('!currentState.downloadingModel'), 'AIChatWidget.jsx must guard on !downloadingModel');
assert(chatWidgetCode.includes('!currentState.isModelLoading'), 'AIChatWidget.jsx must guard on !isModelLoading');
assert(chatWidgetCode.includes('disabled={isCurrentActive || isCurrentDownloading}'), 'AIChatWidget.jsx must disable buttons for active/downloading models');
console.log('  ✅ PASS: App.jsx and AIChatWidget.jsx have trigger de-duplication guards');

// ========================================================================================
// --- Setup Environment & Virtual Clock for Runtime Simulations ---
// ========================================================================================

class VirtualClock {
  constructor() {
    this.now = 1000000;
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
const storageStore = {};
const mockLocalStorage = {
  getItem(k) { return storageStore[k] !== undefined ? storageStore[k] : null; },
  setItem(k, v) { storageStore[k] = String(v); },
  removeItem(k) { delete storageStore[k]; },
  clear() { for (const k of Object.keys(storageStore)) delete storageStore[k]; }
};

if (typeof globalThis.window === 'undefined') {
  globalThis.window = {
    localStorage: mockLocalStorage,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {}
  };
}

try {
  Object.defineProperty(globalThis, 'localStorage', {
    value: mockLocalStorage,
    configurable: true,
    writable: true
  });
} catch {}

let spawnedWorkers = [];
class MockWorker {
  constructor(url, opts) {
    this.url = url;
    this.opts = opts;
    this.terminated = false;
    this.postedMessages = [];
    this.onmessage = null;
    this.onerror = null;
    spawnedWorkers.push(this);
  }
  postMessage(msg) {
    this.postedMessages.push(msg);
  }
  terminate() {
    this.terminated = true;
  }
}

globalThis.Worker = MockWorker;

// Import localAIService
const { localAIService } = await import('../src/services/localAIService.js');

// ========================================================================================
// --- Suite 2: Concurrent Load Preemption Simulation ---
// ========================================================================================
console.log('\n--- Suite 2: Concurrent Load Preemption Simulation ---');

localAIService.turnOffAI();
spawnedWorkers = [];

const sessionStart = localAIService.currentLoadSessionId;

// Request 1: Load Model A (SmolLM2-135M)
const loadPromise1 = localAIService.loadModelInWorker('HuggingFaceTB/SmolLM2-135M-Instruct', 'q4', false);
const session1 = localAIService.currentLoadSessionId;
assert.strictEqual(session1, sessionStart + 1, 'First load should increment session ID');
assert.strictEqual(localAIService.isModelLoading, true, 'isModelLoading must be true during load');
const worker1 = spawnedWorkers[0];
assert(worker1 && !worker1.terminated, 'Worker 1 should be active');

// Request 2: Preempt immediately with Model B (Qwen2.5-0.5B)
const loadPromise2 = localAIService.loadModelInWorker('onnx-community/Qwen2.5-0.5B-Instruct', 'q4', false);
const session2 = localAIService.currentLoadSessionId;
assert.strictEqual(session2, sessionStart + 2, 'Second load must increment session ID monotonically');
assert.strictEqual(worker1.terminated, true, 'Worker 1 must be immediately terminated upon preemption');
console.log('  ✅ PASS: Second load command immediately aborts first load session');

assert(spawnedWorkers.length >= 2, 'A fresh worker must be spawned for session 2');
const worker2 = spawnedWorkers[spawnedWorkers.length - 1];
assert.strictEqual(worker2.terminated, false, 'Worker 2 should be active');
assert.strictEqual(localAIService.downloadingModel.id, 'onnx-community/Qwen2.5-0.5B-Instruct', 'Active downloading model must be Model B');
console.log('  ✅ PASS: Worker thread terminated and cleanly respawned');

await Promise.all([loadPromise1, loadPromise2]);

// Test stale message rejection from Session 1
localAIService.handleWorkerMessage({
  data: {
    type: 'PROGRESS',
    payload: {
      sessionId: session1,
      modelId: 'HuggingFaceTB/SmolLM2-135M-Instruct',
      progress: 60,
      loaded: 60000000,
      total: 100000000
    }
  }
});
assert.notStrictEqual(localAIService.downloadProgress, 60, 'Stale progress message from session 1 must be discarded');

localAIService.handleWorkerMessage({
  data: {
    type: 'MODEL_READY',
    payload: {
      sessionId: session1,
      modelId: 'HuggingFaceTB/SmolLM2-135M-Instruct',
      device: 'wasm',
      dtype: 'q4'
    }
  }
});
assert.strictEqual(localAIService.status, 'downloading', 'Stale MODEL_READY from session 1 must NOT set status to ready');
assert.notStrictEqual(localAIService.activeModel?.id, 'HuggingFaceTB/SmolLM2-135M-Instruct', 'Stale MODEL_READY must not activate Model A');
console.log('  ✅ PASS: Stale messages from older sessions are safely dropped');

// ========================================================================================
// --- Suite 3: Progress-Aware Heartbeat Watchdog Simulation ---
// ========================================================================================
console.log('\n--- Suite 3: Progress-Aware Heartbeat Watchdog Simulation ---');

const clock = new VirtualClock();
clock.install();

try {
  let downgradeTriggered = false;
  let downgradeReason = null;
  const originalDowngrade = localAIService.handleModelDowngrade;
  localAIService.handleModelDowngrade = (failedId, reason) => {
    downgradeTriggered = true;
    downgradeReason = reason;
  };

  // 3.1: Active download > 15s with periodic progress
  downgradeTriggered = false;
  await localAIService.loadModelInWorker('HuggingFaceTB/SmolLM2-135M-Instruct', 'q4', false);
  const activeSession = localAIService.currentLoadSessionId;

  // 5 progress ticks every 3s = 15s total transfer duration (exceeds 10s flat timeout)
  const ticks = [
    { elapsed: 3000, loaded: 17000000, progress: 20 },
    { elapsed: 3000, loaded: 34000000, progress: 40 },
    { elapsed: 3000, loaded: 51000000, progress: 60 },
    { elapsed: 3000, loaded: 68000000, progress: 80 },
    { elapsed: 3000, loaded: 85000000, progress: 99 }
  ];

  for (const t of ticks) {
    clock.tick(t.elapsed);
    localAIService.handleWorkerMessage({
      data: {
        type: 'PROGRESS',
        payload: {
          sessionId: activeSession,
          modelId: 'HuggingFaceTB/SmolLM2-135M-Instruct',
          loaded: t.loaded,
          progress: t.progress,
          total: 85000000
        }
      }
    });
    assert.strictEqual(downgradeTriggered, false, `Watchdog must not fire during active progress at tick ${t.progress}%`);
  }
  console.log('  ✅ PASS: Active download >15s with periodic progress does not trigger false timeout');

  // 3.2: Stalled download (0 progress for 10 continuous seconds)
  clock.tick(9500); // 9.5s stall
  assert.strictEqual(downgradeTriggered, false, 'Watchdog must not trigger before 10s stall threshold');

  clock.tick(1000); // Exceeds 10s stall
  assert.strictEqual(downgradeTriggered, true, 'Watchdog MUST fire after 10 continuous seconds of zero progress');
  assert.strictEqual(downgradeReason, 'timeout_watchdog_stalled', 'Downgrade reason must be timeout_watchdog_stalled');
  console.log('  ✅ PASS: Stalled download (0 bytes for 10s) triggers fallback ladder cleanly');

  // 3.3: 15s compilation grace budget at 100% progress
  downgradeTriggered = false;
  downgradeReason = null;
  await localAIService.loadModelInWorker('onnx-community/Qwen2.5-0.5B-Instruct', 'q4', false);
  const compileSession = localAIService.currentLoadSessionId;

  // Send 100% download complete
  localAIService.handleWorkerMessage({
    data: {
      type: 'PROGRESS',
      payload: {
        sessionId: compileSession,
        modelId: 'onnx-community/Qwen2.5-0.5B-Instruct',
        loaded: 350000000,
        progress: 100,
        total: 350000000
      }
    }
  });

  // Advance clock by 12s (would fail standard 10s timer, but must survive 15s compilation window)
  clock.tick(12000);
  assert.strictEqual(downgradeTriggered, false, 'Compilation phase must survive past 10s under 15s compilation budget');

  // Advance clock past 15s to trigger compilation timeout
  clock.tick(3500);
  assert.strictEqual(downgradeTriggered, true, 'Compilation phase must time out if exceeding 15s');
  assert.strictEqual(downgradeReason, 'compilation_timeout', 'Reason must be compilation_timeout');
  console.log('  ✅ PASS: Compilation phase correctly receives 15s grace budget');

  // Restore method
  localAIService.handleModelDowngrade = originalDowngrade;
} finally {
  clock.uninstall();
}

// ========================================================================================
// --- Suite 4: Memory Invariants & Single Active Model Lock ---
// ========================================================================================
console.log('\n--- Suite 4: Memory Invariants & Single Active Model Lock ---');

localAIService.turnOffAI();
spawnedWorkers = [];

// Rapid multi-turn load spamming: 3 models back to back
const p1 = localAIService.loadModelInWorker('HuggingFaceTB/SmolLM2-135M-Instruct', 'q4', false);
const p2 = localAIService.loadModelInWorker('HuggingFaceTB/SmolLM2-360M-Instruct', 'q4', false);
const p3 = localAIService.loadModelInWorker('onnx-community/Qwen2.5-0.5B-Instruct', 'q4', false);

await Promise.all([p1, p2, p3]);

// Verify previous workers are strictly terminated
const nonTerminatedWorkers = spawnedWorkers.filter((w) => !w.terminated);
assert.strictEqual(nonTerminatedWorkers.length, 1, `Strictly ONE worker should remain alive; found ${nonTerminatedWorkers.length}`);

// Deliver MODEL_READY for active session
const finalSessionId = localAIService.currentLoadSessionId;
localAIService.handleWorkerMessage({
  data: {
    type: 'MODEL_READY',
    payload: {
      sessionId: finalSessionId,
      modelId: 'onnx-community/Qwen2.5-0.5B-Instruct',
      device: 'wasm',
      dtype: 'q4'
    }
  }
});

// Verify RAM and State Invariants
assert.strictEqual(localAIService.status, 'ready', 'Status must be ready');
assert.strictEqual(localAIService.isModelLoading, false, 'isModelLoading must be false when model is ready');
assert.strictEqual(localAIService.downloadingModel, null, 'downloadingModel must be null once ready');
assert.strictEqual(localAIService.activeModel.id, 'onnx-community/Qwen2.5-0.5B-Instruct', 'Active model must match final requested target');
assert.strictEqual(localAIService.modelLoadWatchdog, null, 'Watchdog must be cleared on MODEL_READY');

// Call turnOffAI and assert total cleanup
localAIService.turnOffAI();
assert.strictEqual(localAIService.status, 'idle', 'Status must be idle after turnOffAI');
assert.strictEqual(localAIService.activeModel, null, 'activeModel must be null after turnOffAI');
assert.strictEqual(localAIService.isModelLoading, false, 'isModelLoading must be false after turnOffAI');
assert.strictEqual(localAIService.worker, null, 'Worker reference must be null after turnOffAI');

console.log('  ✅ PASS: Strictly ONE active model in memory at all times');

console.log('\nAll test suites passed with 100% success! Grade: A+\n');
process.exit(0);
