/**
 * Automated Verification Script for Model List Restructuring & Universal Browser Load Fix
 * Tests Phase 1 and Phase 2 contracts.
 */
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const aiChatWidgetPath = path.join(rootDir, 'src', 'components', 'AIChatWidget.jsx');
const aiModelWorkerPath = path.join(rootDir, 'src', 'workers', 'aiModelWorker.js');
const localAIServicePath = path.join(rootDir, 'src', 'services', 'localAIService.js');

const args = process.argv.slice(2);
const phaseArg = args.find((a) => a.startsWith('--phase='));
const selectedPhase = phaseArg ? phaseArg.split('=')[1] : null;

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log(`--- Model List & Universal Browser Load Verification ${selectedPhase ? `(Phase ${selectedPhase})` : '(All Phases)'} ---`);

const widgetContent = fs.readFileSync(aiChatWidgetPath, 'utf-8');
const workerContent = fs.readFileSync(aiModelWorkerPath, 'utf-8');
const serviceContent = fs.readFileSync(localAIServicePath, 'utf-8');

if (!selectedPhase || selectedPhase === '1') {
  console.log('\n[Phase 1: Checking AI Model Decision Tree Cards in AIChatWidget.jsx]');

  const treeFnIndex = widgetContent.indexOf('const handleTriggerAIModelDecisionTree =');
  const treeBlock = treeFnIndex !== -1 ? widgetContent.slice(treeFnIndex, treeFnIndex + 2200) : '';

  assert(
    treeBlock.includes('id: MODEL_CATALOG.BARE_MINIMUM.id') &&
    treeBlock.includes('isRecommended: true'),
    'Position #1 is SmolLM2-135M (MODEL_CATALOG.BARE_MINIMUM) with isRecommended: true'
  );

  const pos1Idx = treeBlock.indexOf('MODEL_CATALOG.BARE_MINIMUM.id');
  const pos2Idx = treeBlock.indexOf('MODEL_CATALOG.LIGHT.id');
  const pos3Idx = treeBlock.indexOf('MODEL_CATALOG.MEDIUM.id');

  assert(
    pos1Idx !== -1 && pos2Idx !== -1 && pos3Idx !== -1 && pos1Idx < pos2Idx && pos2Idx < pos3Idx,
    'Model cards are strictly ordered: #1 BARE_MINIMUM -> #2 LIGHT -> #3 MEDIUM'
  );

  assert(
    !treeBlock.includes("'portfolio-engine'") &&
    !treeBlock.includes('AI ऑफ करें / Turn Off AI') &&
    !treeBlock.includes('isTurnOff: true'),
    'Redundant portfolio-engine ("🔌 AI ऑफ करें") card is completely removed from decision tree'
  );
}

if (!selectedPhase || selectedPhase === '2') {
  console.log('\n[Phase 2: Checking Universal Browser WASM & WebGPU Fixes]');

  assert(
    workerContent.includes('env.backends.onnx.wasm.numThreads = 1;') &&
    workerContent.includes('env.backends.onnx.wasm.proxy = false;'),
    'aiModelWorker.js sets numThreads = 1 and proxy = false for single-threaded WASM execution'
  );

  assert(
    workerContent.includes("const secondaryDevice = device === 'webgpu' ? 'wasm' : 'webgpu';") &&
    workerContent.includes('canAttemptFallback'),
    'aiModelWorker.js implements bidirectional fallback between WebGPU and WASM'
  );

  assert(
    workerContent.includes("secondaryDevice === 'wasm' && env.backends?.onnx?.wasm") &&
    workerContent.includes('env.backends.onnx.wasm.numThreads = 1;'),
    'aiModelWorker.js enforces numThreads = 1 during fallback pipeline initialization'
  );

  assert(
    serviceContent.includes("(typeof navigator !== 'undefined' && !!navigator.gpu) || !!this.deviceProfile?.webgpu?.supported") &&
    serviceContent.includes("hasWebGpu ? 'webgpu' : 'wasm'"),
    'localAIService.js checks navigator.gpu directly for immediate WebGPU resolution'
  );
}

console.log(`\nResults: ${passedTests}/${totalTests} tests passed.`);
if (passedTests === totalTests) {
  console.log('🎉 All verification assertions passed successfully!');
  process.exit(0);
} else {
  console.error('⚠️ Verification failed.');
  process.exit(1);
}
