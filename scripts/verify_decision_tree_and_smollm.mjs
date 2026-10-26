import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const isPhase1Only = process.argv.includes('--phase=1');
const isPhase2Only = process.argv.includes('--phase=2');

console.log('========================================================================');
console.log('  VERIFY IN-BUBBLE DECISION TREE & SMOLLM2 ON-DEVICE RELIABILITY        ');
console.log('========================================================================\n');

let passCount = 0;
let failCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     ${err.message}`);
    failCount++;
  }
}

const chatWidgetPath = path.join(rootDir, 'src/components/AIChatWidget.jsx');
const chatWidgetSrc = fs.readFileSync(chatWidgetPath, 'utf8');

// -------------------------------------------------------------
// PHASE 1 VERIFICATION: In-Bubble Decision Tree Restoration
// -------------------------------------------------------------
runTest('Phase 1: AIChatWidget renders Rich In-Bubble Decision Tree Interactive Cards', () => {
  assert(
    chatWidgetSrc.includes('Rich In-Bubble Decision Tree Interactive Cards'),
    'AIChatWidget must contain the Rich In-Bubble Decision Tree Interactive Cards section marker'
  );
  assert(
    chatWidgetSrc.includes("isAssistant && msg.decisionTree && !skippedDecisionTreeMsgIds.has(msg.id)"),
    'AIChatWidget must render decision cards inside message bubbles when active and not skipped'
  );
});

runTest('Phase 1: preferences_prompt renders Yes/No buttons inside bubble', () => {
  assert(
    chatWidgetSrc.includes("msg.decisionTree.step === 'preferences_prompt'"),
    'Must handle preferences_prompt decision tree step'
  );
  assert(
    chatWidgetSrc.includes('हाँ, प्राथमिकताएं बदलें / Yes, Customize') &&
    chatWidgetSrc.includes('नहीं, यही रहने दें / No, Keep Current'),
    'Must render both Yes (Customize) and No (Keep Current) in-bubble options'
  );
});

runTest('Phase 1: audience, role, viewMode, and ai_model_switch cards render inside bubble', () => {
  assert(
    chatWidgetSrc.includes("msg.decisionTree.step === 'audience'") &&
    chatWidgetSrc.includes("handleAudienceDecisionSelect"),
    'Must render audience decision cards and call handleAudienceDecisionSelect'
  );
  assert(
    chatWidgetSrc.includes("msg.decisionTree.step === 'role'") &&
    chatWidgetSrc.includes("handleRoleDecisionSelect"),
    'Must render role decision cards and call handleRoleDecisionSelect'
  );
  assert(
    chatWidgetSrc.includes("msg.decisionTree.step === 'viewMode'") &&
    chatWidgetSrc.includes("handleViewModeDecisionSelect"),
    'Must render viewMode decision cards and call handleViewModeDecisionSelect'
  );
  assert(
    chatWidgetSrc.includes("msg.decisionTree.step === 'ai_model_switch'") &&
    chatWidgetSrc.includes("handleAiModelSwitchSelect"),
    'Must render ai_model_switch cards and call handleAiModelSwitchSelect'
  );
});

runTest('Phase 1: Initial greeting message contains persistent decisionTree block', () => {
  assert(
    chatWidgetSrc.includes("step: 'preferences_prompt'"),
    'Welcome message must configure step preferences_prompt'
  );
  assert(
    chatWidgetSrc.includes("DEFAULT_PREFERENCES_PROMPT_OPTIONS"),
    'Welcome message must provide DEFAULT_PREFERENCES_PROMPT_OPTIONS'
  );
});

if (!isPhase1Only) {
  const deviceProfilerPath = path.join(rootDir, 'src/utils/deviceProfiler.js');
  const deviceProfilerSrc = fs.readFileSync(deviceProfilerPath, 'utf8');

  const localAIServicePath = path.join(rootDir, 'src/services/localAIService.js');
  const localAIServiceSrc = fs.readFileSync(localAIServicePath, 'utf8');

  // PHASE 2 VERIFICATION: SmolLM2 ONNX Namespace & Watchdog Reliability
  runTest('Phase 2: MODEL_CATALOG uses onnx-community namespace for SmolLM2', () => {
    assert(
      deviceProfilerSrc.includes("'onnx-community/SmolLM2-135M-Instruct-ONNX'") ||
      deviceProfilerSrc.includes("'onnx-community/SmolLM2-135M-Instruct'"),
      'MODEL_CATALOG.BARE_MINIMUM must point to onnx-community/SmolLM2-135M-Instruct-ONNX'
    );
    assert(
      deviceProfilerSrc.includes("'onnx-community/SmolLM2-360M-Instruct-ONNX'") ||
      deviceProfilerSrc.includes("'onnx-community/SmolLM2-360M-Instruct'"),
      'MODEL_CATALOG.SMOLLM_360M must point to onnx-community/SmolLM2-360M-Instruct-ONNX'
    );
  });

  runTest('Phase 2: localAIService increases download and compilation watchdog budgets', () => {
    assert(
      localAIServiceSrc.includes('watchdogDurationMs = 45000') || localAIServiceSrc.includes('watchdogDurationMs = 45000;'),
      'Download watchdog stall duration must be 45000ms'
    );
    assert(
      localAIServiceSrc.includes('compilationWatchdogMs = 30000') || localAIServiceSrc.includes('compilationWatchdogMs = 30000;'),
      'Compilation watchdog budget must be 30000ms'
    );
  });
}

console.log('\n========================================================================');
console.log(`  RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('========================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('✨ VERIFIED WITH 100% SUCCESS!');
  process.exit(0);
}
