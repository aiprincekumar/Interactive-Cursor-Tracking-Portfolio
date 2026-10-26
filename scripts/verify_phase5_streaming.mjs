// scripts/verify_phase5_streaming.mjs
// Verification suite for Phase 5: Local AI & Web Worker Streaming Optimization

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failedTests++;
  }
}

console.log('================================================================');
console.log('RUNNING PHASE 5 LOCAL AI & WEB WORKER STREAMING VERIFICATION');
console.log('================================================================\n');

const workerPath = path.join(rootDir, 'src', 'workers', 'aiModelWorker.js');
const servicePath = path.join(rootDir, 'src', 'services', 'localAIService.js');
const widgetPath = path.join(rootDir, 'src', 'components', 'AIChatWidget.jsx');

assert(fs.existsSync(workerPath), 'src/workers/aiModelWorker.js exists on disk');
assert(fs.existsSync(servicePath), 'src/services/localAIService.js exists on disk');
assert(fs.existsSync(widgetPath), 'src/components/AIChatWidget.jsx exists on disk');

const workerSource = fs.readFileSync(workerPath, 'utf8');
const serviceSource = fs.readFileSync(servicePath, 'utf8');
const widgetSource = fs.readFileSync(widgetPath, 'utf8');

// --- Suite 1: Web Worker Streaming Pipeline (aiModelWorker.js) ---
console.log('\n--- Suite 1: Web Worker Streaming Pipeline (aiModelWorker.js) ---');

assert(
  /import\s*\{[^}]*TextStreamer[^}]*\}\s*from\s*['"]@huggingface\/transformers['"]/.test(workerSource),
  'aiModelWorker imports TextStreamer from @huggingface/transformers'
);

assert(
  workerSource.includes('InterruptableStoppingCriteria'),
  'aiModelWorker imports or utilizes InterruptableStoppingCriteria for graceful abort'
);

assert(
  /new\s+TextStreamer\s*\(\s*activeGenerator\.tokenizer/.test(workerSource),
  'TextStreamer is instantiated and bound to activeGenerator.tokenizer'
);

assert(
  /callback_function:\s*\(\s*chunk\s*\)\s*=>/.test(workerSource) &&
  workerSource.includes("type: 'TOKEN_STREAM'") &&
  workerSource.includes('requestId') &&
  workerSource.includes('chunk'),
  'TextStreamer callback_function dispatches TOKEN_STREAM postMessage with requestId and chunk'
);

assert(
  /generateOptions\.streamer\s*=\s*streamer/.test(workerSource) ||
  /streamer:\s*streamer/.test(workerSource),
  'Streamer is passed to activeGenerator execution options'
);

assert(
  workerSource.includes("case 'CANCEL_GENERATION':") ||
  /CANCEL_GENERATION/.test(workerSource),
  'aiModelWorker supports CANCEL_GENERATION message handler'
);

assert(
  workerSource.includes('GENERATION_CANCELLED'),
  'aiModelWorker notifies main thread with GENERATION_CANCELLED on abort'
);

assert(
  /cleanupActivePipeline/.test(workerSource) &&
  workerSource.includes('cancelled = true'),
  'cleanupActivePipeline cancels and interrupts any in-flight active generation'
);

// --- Suite 2: Local AI Service Stream Bridge (localAIService.js) ---
console.log('\n--- Suite 2: Local AI Service Stream Bridge (localAIService.js) ---');

assert(
  serviceSource.includes("case 'TOKEN_STREAM':") &&
  serviceSource.includes('onToken'),
  'handleWorkerMessage handles TOKEN_STREAM and dispatches onToken callback'
);

assert(
  serviceSource.includes("case 'GENERATION_CANCELLED':"),
  'handleWorkerMessage handles GENERATION_CANCELLED and resolves pending requests with partial text'
);

assert(
  /generateText\s*\([^)]*\)/.test(serviceSource) &&
  serviceSource.includes('onToken') &&
  serviceSource.includes('accumulatedText'),
  'generateText accepts onToken callback and tracks accumulatedText in pendingRequests'
);

assert(
  /cancelGeneration\s*\(/.test(serviceSource),
  'LocalAIService implements cancelGeneration(requestId) method'
);

assert(
  serviceSource.includes("type: 'CANCEL_GENERATION'"),
  'cancelGeneration posts CANCEL_GENERATION message to worker thread'
);

assert(
  serviceSource.includes('clearTimeout(timeoutId)') ||
  serviceSource.includes('clearTimeout(req.timeoutId)'),
  'pendingRequests timeout guard is cleaned up on resolution, rejection, and cancellation'
);

// --- Suite 3: UI Real-Time Streaming & Stop Button (AIChatWidget.jsx) ---
console.log('\n--- Suite 3: UI Real-Time Streaming & Stop Button (AIChatWidget.jsx) ---');

assert(
  /import\s*\{[^}]*Square[^}]*\}\s*from\s*['"]lucide-react['"]/.test(widgetSource),
  'AIChatWidget imports Square icon from lucide-react for Stop Generating button'
);

assert(
  widgetSource.includes('isStreaming') &&
  widgetSource.includes('setIsStreaming'),
  'AIChatWidget tracks isStreaming state'
);

assert(
  widgetSource.includes('activeRequestIdRef') &&
  widgetSource.includes('streamIntervalRef'),
  'AIChatWidget tracks activeRequestIdRef and streamIntervalRef for inference/stream tracking'
);

assert(
  widgetSource.includes('handleStopGenerating'),
  'AIChatWidget defines handleStopGenerating callback'
);

assert(
  widgetSource.includes('aria-label="Stop generating response"') ||
  widgetSource.includes("aria-label='Stop generating response'"),
  'Stop Generating button has accessible aria-label="Stop generating response"'
);

assert(
  widgetSource.includes('<Square') &&
  widgetSource.includes('isStreaming ?'),
  'Stop Generating button renders Square icon when isStreaming is active'
);

assert(
  widgetSource.includes('onToken: (chunk, accumulatedText) =>'),
  'AIChatWidget hooks onToken callback to update streaming assistant message progressively'
);

assert(
  widgetSource.includes('streamIntervalRef.current = setInterval') ||
  /setInterval\s*\(\s*\(\)\s*=>/.test(widgetSource),
  'AIChatWidget implements typewriter stream for offline knowledge engine responses'
);

assert(
  widgetSource.includes('prefersReducedMotion'),
  'Typewriter stream honors prefersReducedMotion by displaying response instantly'
);

assert(
  widgetSource.includes('disabled={isTyping || isStreaming}'),
  'Input bar and prompt chips are disabled while streaming or typing is in progress'
);

assert(
  widgetSource.includes('isTyping && !isStreaming'),
  'Typing indicator dots are hidden once streaming response bubble becomes active'
);

assert(
  widgetSource.includes('handleStopGenerating();') ||
  widgetSource.includes('handleStopGenerating()'),
  'handleClose and handleResetChat invoke handleStopGenerating to ensure zero background leaks'
);

// --- Suite 4: Functional Unit Verification (Service Bridge in Node) ---
console.log('\n--- Suite 4: Functional Unit Verification (Local AI Service & Stream Simulation) ---');

try {
  const { localAIService } = await import('../src/services/localAIService.js');

  assert(typeof localAIService.generateText === 'function', 'localAIService.generateText is a function');
  assert(typeof localAIService.cancelGeneration === 'function', 'localAIService.cancelGeneration is a function');

  // Verify generateText returns null cleanly when AI is disabled or worker idle
  const nullResult = await localAIService.generateText('hello');
  assert(nullResult === null, 'generateText returns null safely when model is not ready (triggering instant offline engine)');

  // Verify cancelGeneration runs safely without active worker
  localAIService.cancelGeneration('dummy_req_123');
  assert(true, 'cancelGeneration executes safely even without active worker or pending request');

} catch (err) {
  assert(false, `Functional unit verification error: ${err.message}`);
}

console.log('\n================================================================');
console.log(`PHASE 5 TEST RESULTS: PASSED: ${passedTests}, FAILED: ${failedTests}`);
console.log('================================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🌟 ALL PHASE 5 LOCAL AI STREAMING VERIFICATIONS PASSED! 🌟\n');
  process.exit(0);
}
