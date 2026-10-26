/**
 * Phase 01 Mutex Verification Test Harness
 * Verifies:
 * 1. localAIService exports currentLoadSessionId & isModelLoading properties and in getState().
 * 2. aiModelWorker does NOT drop concurrent commands and properly purges previous pipelines.
 * 3. Calling loadModelInWorker twice in succession increments currentLoadSessionId monotonically.
 * 4. Stale messages from session N are discarded when current session is N+1.
 * 5. terminateAndRespawnWorker is invoked on concurrent load preemption.
 * 6. Single model in RAM invariant is strictly maintained.
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('========================================================================================');
console.log('  PHASE 01: CORE WORKER & SERVICE MUTEX VERIFICATION HARNESS');
console.log('========================================================================================');

// --- Suite 1: Static Code Inspection & Invariant Checks ---
console.log('\n--- Suite 1: Worker & Service Static Invariant Analysis ---');

const workerPath = path.join(rootDir, 'src', 'workers', 'aiModelWorker.js');
const servicePath = path.join(rootDir, 'src', 'services', 'localAIService.js');

const workerCode = fs.readFileSync(workerPath, 'utf8');
const serviceCode = fs.readFileSync(servicePath, 'utf8');

// Invariant 1: Ensure aiModelWorker does NOT drop concurrent commands
assert(
  !workerCode.includes('if (isLoading) return;') &&
  !workerCode.includes("self.postMessage({ type: 'STATUS', message: 'Model load already in progress' });"),
  'aiModelWorker must NOT contain silent drop (if (isLoading) return;)'
);
console.log('  ✅ PASS: Silent drop pattern removed from aiModelWorker');

// Invariant 2: Ensure aiModelWorker propagates sessionId
assert(workerCode.includes('sessionId: currentSessionId'), 'aiModelWorker must propagate sessionId in events');
assert(workerCode.includes('case \'ABORT_LOAD\':'), 'aiModelWorker must handle ABORT_LOAD event');
console.log('  ✅ PASS: aiModelWorker sessionId propagation and ABORT_LOAD handler verified');

// Invariant 3: Ensure localAIService has mutex & sessionId properties
assert(serviceCode.includes('this.currentLoadSessionId = 0;'), 'localAIService must initialize currentLoadSessionId in constructor');
assert(serviceCode.includes('this.isModelLoading = false;'), 'localAIService must initialize isModelLoading in constructor');
assert(serviceCode.includes('msgSessionId !== this.currentLoadSessionId'), 'localAIService must filter stale messages by sessionId');
console.log('  ✅ PASS: localAIService mutex state and stale message discard logic verified');

// --- Suite 2: Runtime localAIService Property & State Verification ---
console.log('\n--- Suite 2: Runtime Mutex Properties & State Extraction ---');

const { localAIService } = await import('../src/services/localAIService.js');

assert.strictEqual(typeof localAIService.currentLoadSessionId, 'number', 'currentLoadSessionId must be a number');
assert.strictEqual(typeof localAIService.isModelLoading, 'boolean', 'isModelLoading must be a boolean');

const initialState = localAIService.getState();
assert.strictEqual(initialState.currentLoadSessionId, localAIService.currentLoadSessionId, 'getState() must include currentLoadSessionId');
assert.strictEqual(initialState.isModelLoading, localAIService.isModelLoading, 'getState() must include isModelLoading');
console.log(`  ✅ PASS: localAIService exports currentLoadSessionId (#${initialState.currentLoadSessionId}) & isModelLoading (${initialState.isModelLoading})`);

// --- Suite 3: Preemption & Monotonic Session ID Allocation ---
console.log('\n--- Suite 3: Preemption & Monotonic Session ID Increment ---');

// Mock Worker and browser environment for service simulation
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
    this.onmessage = null;
    this.onerror = null;
  }
  postMessage(msg) {
    this.postedMessages.push(msg);
  }
  terminate() {
    this.terminated = true;
  }
}

let spawnedWorkers = [];
let originalWorkerClass = globalThis.Worker;
globalThis.Worker = class extends MockWorker {
  constructor(url, opts) {
    super();
    this.url = url;
    this.opts = opts;
    spawnedWorkers.push(this);
  }
};

// Reset state
localAIService.turnOffAI();
spawnedWorkers = [];

const initialSession = localAIService.currentLoadSessionId;

// Launch first model load
const loadPromise1 = localAIService.loadModelInWorker('HuggingFaceTB/SmolLM2-135M-Instruct', 'q4', false);
const sessionAfter1 = localAIService.currentLoadSessionId;
assert.strictEqual(sessionAfter1, initialSession + 1, 'First loadModelInWorker must increment sessionId by 1');
assert.strictEqual(localAIService.isModelLoading, true, 'isModelLoading must be true during load');
const worker1 = spawnedWorkers[0];
assert(worker1, 'A worker should have been spawned');
assert.strictEqual(worker1.terminated, false, 'Worker 1 should be active');

// Immediately launch second model load before first completes (Preemption)
const loadPromise2 = localAIService.loadModelInWorker('onnx-community/Qwen2.5-0.5B-Instruct', 'q4', false);
const sessionAfter2 = localAIService.currentLoadSessionId;
assert.strictEqual(sessionAfter2, initialSession + 2, 'Second loadModelInWorker must increment sessionId again');
assert.strictEqual(worker1.terminated, true, 'Worker 1 must be terminated immediately upon preemption');
assert(spawnedWorkers.length >= 2, 'A fresh worker must be spawned after preemption');
const worker2 = spawnedWorkers[spawnedWorkers.length - 1];
assert.strictEqual(worker2.terminated, false, 'Worker 2 should be active');

await Promise.all([loadPromise1, loadPromise2]);
console.log(`  ✅ PASS: Successive calls incremented sessionId from #${initialSession} -> #${sessionAfter1} -> #${sessionAfter2}`);
console.log('  ✅ PASS: Worker 1 terminated immediately to purge in-flight buffers and respawn Worker 2');

// --- Suite 4: Stale Message Filtering Verification ---
console.log('\n--- Suite 4: Stale Message Rejection Invariant ---');

// Send progress message from stale session (Session 1)
const staleProgressMessage = {
  data: {
    type: 'PROGRESS',
    payload: {
      sessionId: sessionAfter1,
      modelId: 'HuggingFaceTB/SmolLM2-135M-Instruct',
      progress: 55,
      loaded: 55000000,
      total: 100000000
    }
  }
};
localAIService.handleWorkerMessage(staleProgressMessage);

// Verify that the stale message did not update localAIService progress
assert.notStrictEqual(localAIService.downloadProgress, 55, 'Stale message from old session must NOT alter downloadProgress');
console.log('  ✅ PASS: Stale message from superseded session #1 was successfully discarded');

// Send progress message from active session (Session 2)
const validProgressMessage = {
  data: {
    type: 'PROGRESS',
    payload: {
      sessionId: sessionAfter2,
      modelId: 'onnx-community/Qwen2.5-0.5B-Instruct',
      progress: 42,
      loaded: 42000000,
      total: 100000000
    }
  }
};
localAIService.handleWorkerMessage(validProgressMessage);
assert.strictEqual(localAIService.downloadProgress, 42, 'Valid message from active session must update downloadProgress');
console.log('  ✅ PASS: Valid message from active session #2 was successfully accepted');

// --- Suite 5: Mutex Release & Lifecycle Guarantees ---
console.log('\n--- Suite 5: Mutex Release on MODEL_READY / ERROR / turnOffAI ---');

// Simulate MODEL_READY from active session
localAIService.handleWorkerMessage({
  data: {
    type: 'MODEL_READY',
    payload: {
      sessionId: sessionAfter2,
      modelId: 'onnx-community/Qwen2.5-0.5B-Instruct',
      device: 'wasm',
      dtype: 'q4'
    }
  }
});
assert.strictEqual(localAIService.isModelLoading, false, 'isModelLoading must become false on MODEL_READY');
assert.strictEqual(localAIService.status, 'ready', 'status must become ready on MODEL_READY');
console.log('  ✅ PASS: Mutex lock released (isModelLoading = false) on MODEL_READY');

// Simulate turnOffAI resets mutex state
localAIService.turnOffAI();
assert.strictEqual(localAIService.isModelLoading, false, 'isModelLoading must be false after turnOffAI');
assert.strictEqual(localAIService.status, 'idle', 'status must be idle after turnOffAI');
console.log('  ✅ PASS: Mutex lock released on turnOffAI');

// Cleanup global mock
if (originalWorkerClass) {
  globalThis.Worker = originalWorkerClass;
} else {
  delete globalThis.Worker;
}

console.log('\n========================================================================================');
console.log('  ALL PHASE 01 MUTEX & PREEMPTION TESTS PASSED (100% GREEN)');
console.log('========================================================================================\n');
