/**
 * Automated Verification Script for SmolLM Permanent Fix (Phases 1 & 2)
 */
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const localAIServicePath = path.join(rootDir, 'src', 'services', 'localAIService.js');
const aiModelWorkerPath = path.join(rootDir, 'src', 'workers', 'aiModelWorker.js');
const aiChatWidgetPath = path.join(rootDir, 'src', 'components', 'AIChatWidget.jsx');

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

console.log(`--- SmolLM Permanent Fix Verification ${selectedPhase ? `(Phase ${selectedPhase})` : '(All Phases)'} ---`);

const localAiContent = fs.readFileSync(localAIServicePath, 'utf-8');
const workerContent = fs.readFileSync(aiModelWorkerPath, 'utf-8');
const widgetContent = fs.readFileSync(aiChatWidgetPath, 'utf-8');

if (!selectedPhase || selectedPhase === '1') {
  // Phase 1 Checks
  console.log('\n[Phase 1: Checking src/services/localAIService.js]');
  assert(
    !localAiContent.includes('target = MODEL_CATALOG.MEDIUM') &&
    !localAiContent.includes('targetModel = MODEL_CATALOG.MEDIUM'),
    'Does not hardcode fallback or upgrade override to MODEL_CATALOG.MEDIUM'
  );

  assert(
    localAiContent.includes('let targetModel = MODEL_CATALOG.BARE_MINIMUM || getBareMinimumModel()'),
    'upgradeToRecommendedModel targets MODEL_CATALOG.BARE_MINIMUM'
  );

  assert(
    localAiContent.includes('(MODEL_CATALOG.BARE_MINIMUM || getBareMinimumModel())'),
    'turnOnAI targets MODEL_CATALOG.BARE_MINIMUM'
  );

  assert(
    localAiContent.includes("const isBareMinimum = modelId.includes('135M') || modelId.includes('SmolLM2-135M');") &&
    localAiContent.includes('!isBareMinimum && healthCheck && healthCheck.isSlow'),
    'Protects baseline bare-minimum SmolLM2-135M from slow kill-switch in MODEL_READY'
  );

  console.log('\n[Phase 1: Checking src/workers/aiModelWorker.js]');
  assert(
    workerContent.includes('isBareMinimumModel') &&
    workerContent.includes("includes('135m')") &&
    workerContent.includes('const isSlow = !isBareMinimumModel &&'),
    'Exempts SmolLM2-135M from isSlow calculation in probeModelPerformance'
  );

  console.log('\n[Phase 1: Checking src/components/AIChatWidget.jsx]');
  assert(
    widgetContent.includes("${localAiState.downloadProgress}%") &&
    widgetContent.includes(": '...%'"),
    'Subheader badge renders pure percentage (${localAiState.downloadProgress}% or ...%)'
  );

  assert(
    !widgetContent.includes("⬇ ${localAiState.downloadProgress}%") &&
    !widgetContent.includes("'⏳ Loading...'"),
    'Zero word labels ("Loading...") and zero prefix icons ("⬇", "⏳") in subheader badge'
  );
}

if (!selectedPhase || selectedPhase === '2') {
  // Phase 2 Checks
  console.log('\n[Phase 2: Checking AIChatWidget.jsx Event & Trigger Wiring]');

  assert(
    !widgetContent.includes("isAiOn &&\n      currentState.status === 'idle'") &&
    !widgetContent.includes("isAiOn && currentState.status === 'idle'"),
    'Removed contradictory isAiOn guard in isOpen useEffect'
  );

  assert(
    widgetContent.includes('localAIService.loadModel(bareModel, { silent: true })'),
    'isOpen effect triggers silent background warmup with { silent: true }'
  );

  const consentFnIndex = widgetContent.indexOf('const handleAiModelConsentSelect =');
  const consentBlock = consentFnIndex !== -1 ? widgetContent.slice(consentFnIndex, consentFnIndex + 2500) : '';
  assert(
    consentBlock.includes('localAIService.loadModel(bareModel)') &&
    !consentBlock.includes('upgradeToRecommendedModel'),
    'handleAiModelConsentSelect wires consent directly to loadModel(bareModel) (bypassing upgradeToRecommendedModel)'
  );

  const toggleFnIndex = widgetContent.indexOf('const handleToggleAIQuick =');
  const toggleBlock = toggleFnIndex !== -1 ? widgetContent.slice(toggleFnIndex, toggleFnIndex + 2500) : '';
  assert(
    toggleBlock.includes('localAIService.loadModel(bareModel)'),
    'handleToggleAIQuick directly invokes loadModel(bareModel)'
  );
}

console.log(`\nResults: ${passedTests}/${totalTests} tests passed.`);
if (passedTests === totalTests) {
  console.log('🎉 Verification passed successfully!');
  process.exit(0);
} else {
  console.error('⚠️ Some verification tests failed.');
  process.exit(1);
}
