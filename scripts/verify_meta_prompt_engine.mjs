/**
 * Verification Test Harness: Meta-Prompt Engine & Always-On Autonomous AI Preload
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('========================================================================================');
console.log('  META-PROMPT ENGINE & AUTONOMOUS AI PRELOAD VERIFICATION (verify_meta_prompt_engine.mjs)');
console.log('========================================================================================\n');

// 1. Static File Verification
console.log('--- Suite 1: File Existence & Export Structure ---');
const enginePath = path.join(rootDir, 'src/utils/metaPromptEngine.js');
const servicePath = path.join(rootDir, 'src/services/localAIService.js');
const appPath = path.join(rootDir, 'src/App.jsx');
const profilerPath = path.join(rootDir, 'src/utils/deviceProfiler.js');

assert(fs.existsSync(enginePath), 'src/utils/metaPromptEngine.js must exist on disk');
assert(fs.existsSync(servicePath), 'src/services/localAIService.js must exist on disk');
assert(fs.existsSync(appPath), 'src/App.jsx must exist on disk');
assert(fs.existsSync(profilerPath), 'src/utils/deviceProfiler.js must exist on disk');

const metaEngine = await import('../src/utils/metaPromptEngine.js');
const {
  META_PROMPT_CATEGORIES,
  CATEGORY_DEFINITIONS,
  detectCategory,
  synthesizeExecutableCommand,
  buildEngineeredPrompt,
  generateIterationSuggestions,
  synthesizeMetaPrompt,
  getAvailableCategories,
  formatMetaPromptForClipboard
} = metaEngine;

assert(META_PROMPT_CATEGORIES, 'META_PROMPT_CATEGORIES must be exported');
assert(typeof detectCategory === 'function', 'detectCategory must be a function');
assert(typeof synthesizeExecutableCommand === 'function', 'synthesizeExecutableCommand must be a function');
assert(typeof buildEngineeredPrompt === 'function', 'buildEngineeredPrompt must be a function');
assert(typeof generateIterationSuggestions === 'function', 'generateIterationSuggestions must be a function');
assert(typeof synthesizeMetaPrompt === 'function', 'synthesizeMetaPrompt must be a function');
console.log('  ✅ PASS: All required exports verified in metaPromptEngine.js');

// 2. Pre-Built Categories Verification
console.log('\n--- Suite 2: Pre-Built Categories Completeness ---');
const expectedCategories = [
  'code_architecture',
  'technical_writing',
  'performance_optimization',
  'ui_ux_engineering',
  'data_tax_audit',
  'general_assistant'
];

expectedCategories.forEach((catKey) => {
  assert(CATEGORY_DEFINITIONS[catKey], `Category definition for '${catKey}' must exist`);
  const def = CATEGORY_DEFINITIONS[catKey];
  assert(def.id === catKey, `Category id must match key '${catKey}'`);
  assert(def.name && typeof def.name === 'string', `Category '${catKey}' must have a valid name`);
  assert(def.role && typeof def.role === 'string', `Category '${catKey}' must have a valid role`);
  assert(def.context && typeof def.context === 'string', `Category '${catKey}' must have a valid context`);
  assert(Array.isArray(def.constraints) && def.constraints.length >= 3, `Category '${catKey}' must have >= 3 constraints`);
  assert(Array.isArray(def.directives) && def.directives.length >= 3, `Category '${catKey}' must have >= 3 directives`);
  assert(def.outputFormat && def.outputFormat.includes('###'), `Category '${catKey}' must have structured outputFormat`);
  assert(Array.isArray(def.iterationTips) && def.iterationTips.length >= 2, `Category '${catKey}' must have >= 2 iterationTips`);
});
console.log('  ✅ PASS: All 6 required categories (Code Architecture, Technical Writing, Performance Optimization, UI/UX Engineering, Data/Tax Audit, General Assistant) are fully defined');

// 3. Category Auto-Detection Verification
console.log('\n--- Suite 3: Keyword Classifier & Category Auto-Detection ---');
const testCases = [
  { text: 'Refactor service layer to clean hexagonal architecture with dependency injection', expected: 'code_architecture' },
  { text: 'Optimize WebGPU shader buffer latency to achieve 60fps with zero-alloc hot loop', expected: 'performance_optimization' },
  { text: 'Design accessible modal dialog with responsive Tailwind and WCAG AAA keyboard navigation', expected: 'ui_ux_engineering' },
  { text: 'Draft comprehensive API reference guide and step-by-step tutorial documentation', expected: 'technical_writing' },
  { text: 'Reconcile GSTR-2B inward supplies against purchase ledger and verify TDS section 194Q', expected: 'data_tax_audit' },
  { text: 'What is the capital of France and what are the top tourist spots?', expected: 'general_assistant' }
];

testCases.forEach(({ text, expected }) => {
  const detected = detectCategory(text);
  assert.strictEqual(detected, expected, `Input "${text}" must be classified as "${expected}", got "${detected}"`);
});
console.log('  ✅ PASS: 6/6 test inquiries correctly auto-classified by offline keyword engine');

// 4. Executable Command Synthesis
console.log('\n--- Suite 4: Short Executable Command Synthesis ---');
const sampleTask = 'Refactor localAIService to support autonomous hardware tiering';
const cmd = synthesizeExecutableCommand(sampleTask, 'code_architecture', ['--test-vectors']);
assert(cmd.startsWith('/run'), 'Command should start with /run verb');
assert(cmd.includes('--task="Refactor localAIService to support autonomous hardware tiering"'), 'Command must contain task flag');
assert(cmd.includes('--role=architect'), 'Command must contain role flag');
assert(cmd.includes('--category=code-architecture'), 'Command must contain category flag');
assert(cmd.includes('--test-vectors'), 'Command must include custom flags');
console.log(`  ✅ PASS: Executable command synthesized cleanly: "${cmd.slice(0, 75)}..."`);

// 5. Engineered 5-Part Meta-Prompt Verification
console.log('\n--- Suite 5: 5-Part Engineered Meta-Prompt Structure ---');
const engineeredPrompt = buildEngineeredPrompt({
  task: 'Create zero-latency caching layer for LLM weights',
  categoryKey: 'performance_optimization',
  customContext: 'Target browser: Chrome 120+ with CacheStorage and WebGPU.',
  customConstraints: ['Cache size must never exceed 500MB.'],
  customDirectives: ['Verify cache hit ratio before returning response.']
});

assert(engineeredPrompt.includes('## [Role]'), 'Meta-prompt must include ## [Role]');
assert(engineeredPrompt.includes('## [Context]'), 'Meta-prompt must include ## [Context]');
assert(engineeredPrompt.includes('## [Task Constraints]'), 'Meta-prompt must include ## [Task Constraints]');
assert(engineeredPrompt.includes('## [Few-Shot / Directives]'), 'Meta-prompt must include ## [Few-Shot / Directives]');
assert(engineeredPrompt.includes('## [Output Format]'), 'Meta-prompt must include ## [Output Format]');
assert(engineeredPrompt.includes('Target browser: Chrome 120+'), 'Meta-prompt must include customContext');
assert(engineeredPrompt.includes('Cache size must never exceed 500MB.'), 'Meta-prompt must include customConstraints');
assert(engineeredPrompt.includes('Verify cache hit ratio'), 'Meta-prompt must include customDirectives');
console.log('  ✅ PASS: All 5 sections ([Role], [Context], [Task Constraints], [Few-Shot / Directives], [Output Format]) verified');

// 6. Actionable Engineering Iteration Suggestions Verification
console.log('\n--- Suite 6: Engineering Iteration Suggestions ---');
const suggestions = generateIterationSuggestions('data_tax_audit', 'Audit FY 2024-25 GST-TDS reconciliation with webgpu');
assert(Array.isArray(suggestions) && suggestions.length >= 3, 'Must return at least 3 iteration suggestions');
suggestions.forEach((tip) => {
  assert(tip.aspect && typeof tip.aspect === 'string', 'Tip must contain aspect');
  assert(tip.suggestion && typeof tip.suggestion === 'string', 'Tip must contain suggestion text');
  assert(tip.example && typeof tip.example === 'string', 'Tip must contain concrete copy-paste example');
});
console.log(`  ✅ PASS: Returned ${suggestions.length} high-signal iteration suggestions with concrete examples`);

// 7. Master One-Stop Pipeline (synthesizeMetaPrompt) Verification
console.log('\n--- Suite 7: Master Synthesis Pipeline ---');
const synthesisResult = synthesizeMetaPrompt('Design a high-contrast accessible switch component in React and Tailwind');
assert(synthesisResult.command, 'Result must contain command');
assert(synthesisResult.metaPrompt, 'Result must contain metaPrompt');
assert(Array.isArray(synthesisResult.iterationSuggestions), 'Result must contain iterationSuggestions');
assert.strictEqual(synthesisResult.category.id, 'ui_ux_engineering', 'Should detect UI/UX Engineering');
assert.strictEqual(synthesisResult.metadata.offlineReady, true, 'Metadata must flag offlineReady: true');

const clipboardText = formatMetaPromptForClipboard(synthesisResult);
assert(clipboardText.includes('### Executable Command:'), 'Clipboard format must include Executable Command header');
assert(clipboardText.includes('### Engineered Meta-Prompt:'), 'Clipboard format must include Engineered Meta-Prompt header');
assert(clipboardText.includes('### Engineering Iteration Suggestions:'), 'Clipboard format must include Iteration Suggestions header');
console.log('  ✅ PASS: Master synthesizeMetaPrompt and formatMetaPromptForClipboard validated');

// 8. Autonomous Hardware-Tier Selection in localAIService & deviceProfiler
console.log('\n--- Suite 8: Autonomous Hardware-Tier Selection ---');
const { getAutonomousTierModel } = await import('../src/utils/deviceProfiler.js');
assert(typeof getAutonomousTierModel === 'function', 'getAutonomousTierModel must be exported');

// Tier 1: WebGPU Capable Desktop
const tier1Dev = {
  deviceType: 'desktop',
  storage: { availableGB: 4.0 },
  webgpu: { supported: true },
  cpuCores: 8,
  benchmark: { score: 'high' }
};
const tier1Model = getAutonomousTierModel(tier1Dev);
assert.strictEqual(tier1Model.shortcut, '[Qwen-0.5B]', 'WebGPU capable desktop must resolve to Tier 1 ([Qwen-0.5B])');

// Tier 2: Mobile / Budget / WASM
const tier2Dev = {
  deviceType: 'mobile',
  storage: { availableGB: 0.8 },
  webgpu: { supported: false },
  cpuCores: 4,
  benchmark: { score: 'budget' }
};
const tier2Model = getAutonomousTierModel(tier2Dev);
assert.strictEqual(tier2Model.shortcut, '[SmolLM-135M]', 'Mobile/budget/WASM device must resolve to Tier 2 ([SmolLM-135M])');
console.log('  ✅ PASS: Autonomous Tier 1 ([Qwen-0.5B]) and Tier 2 ([SmolLM-135M]) resolution verified');

// 9. Always-On AI Silent Preload Hook in App.jsx
console.log('\n--- Suite 9: Silent Preload Hook in App.jsx ---');
const appCode = fs.readFileSync(appPath, 'utf8');
assert(appCode.includes('import { localAIService } from \'./services/localAIService\';'), 'App.jsx must import localAIService');
assert(appCode.includes('localAIService.initSilentDownload();'), 'App.jsx must call localAIService.initSilentDownload()');
assert(appCode.includes('requestIdleCallback') || appCode.includes('window.addEventListener(\'load\''), 'App.jsx must hook into window load or requestIdleCallback');
console.log('  ✅ PASS: App.jsx contains silent background AI preload hook upon page load/idle');

console.log('\n========================================================================================');
console.log('  ALL META-PROMPT & AUTONOMOUS AI PRELOAD CHECKS PASSED (100% GREEN)');
console.log('========================================================================================\n');
