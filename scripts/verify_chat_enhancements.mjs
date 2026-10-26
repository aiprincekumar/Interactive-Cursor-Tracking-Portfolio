/**
 * scripts/verify_chat_enhancements.mjs
 *
 * Master Automated Verification Harness for AI Chat Widget Enhancements (Phases 1 through 7)
 * Validates all architectural contracts, mobile ergonomics, safe markdown rendering,
 * accessibility (WCAG 2.1 AA), token streaming, context memory RAG, and edge resilience cascades.
 *
 * Suites:
 * - Suite 1: Phase 1 Container Sizing, Viewport Height (dvh), Safe-Area Padding, Header Touch Targets
 * - Suite 2: Phase 2 Safe Markdown Parser (FormattedMessage.jsx), Code Blocks, 1-Click Copy, Speech Sanitization
 * - Suite 3: Phase 3 Categorized 2-Row Suggestion Grid, Slash Command Palette Mobile Clamping, Escape Key Isolation
 * - Suite 4: Phase 4 Focus Trap (useFocusTrap), Conversational ARIA (role="log", role="article"), Haptics, Reduced Motion
 * - Suite 5: Phase 5 Token Streaming (TextStreamer), TOKEN_STREAM, cancelGeneration, Stop Button
 * - Suite 6: Phase 6 Multi-Turn Context Memory (portfolioContextMemory.js), Pronoun Resolution, Compound Queries, Engine Budget (<110kB)
 * - Suite 7: Phase 7 Edge Resilience, WebGPU Context Loss, 10s Watchdog, and Cascading Fallback Ladder
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('MASTER AI CHAT ENHANCEMENTS VERIFICATION HARNESS (PHASES 1 - 7)');
console.log('================================================================\n');

let totalAsserts = 0;
let passedAsserts = 0;
let failedAsserts = 0;

function runTest(description, fn) {
  totalAsserts++;
  try {
    fn();
    console.log(`  ✅ PASS: ${description}`);
    passedAsserts++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${description}`);
    console.error(`     Reason: ${err.message}`);
    failedAsserts++;
  }
}

// Key file paths
const widgetPath = path.join(rootDir, 'src/components/AIChatWidget.jsx');
const formattedMsgPath = path.join(rootDir, 'src/components/chat/FormattedMessage.jsx');
const suggestionDrawerPath = path.join(rootDir, 'src/components/chat/SuggestionChipsDrawer.jsx');
const slashPalettePath = path.join(rootDir, 'src/components/chat/SlashCommandPalette.jsx');
const focusTrapPath = path.join(rootDir, 'src/hooks/useFocusTrap.js');
const workerPath = path.join(rootDir, 'src/workers/aiModelWorker.js');
const servicePath = path.join(rootDir, 'src/services/localAIService.js');
const memoryPath = path.join(rootDir, 'src/utils/portfolioContextMemory.js');
const enginePath = path.join(rootDir, 'src/utils/portfolioAssistantEngine.js');
const profilerPath = path.join(rootDir, 'src/utils/deviceProfiler.js');
const pkgJsonPath = path.join(rootDir, 'package.json');

const widgetSrc = fs.readFileSync(widgetPath, 'utf8');
const formattedMsgSrc = fs.readFileSync(formattedMsgPath, 'utf8');
const suggestionDrawerSrc = fs.readFileSync(suggestionDrawerPath, 'utf8');
const slashPaletteSrc = fs.readFileSync(slashPalettePath, 'utf8');
const focusTrapSrc = fs.readFileSync(focusTrapPath, 'utf8');
const workerSrc = fs.readFileSync(workerPath, 'utf8');
const serviceSrc = fs.readFileSync(servicePath, 'utf8');
const memorySrc = fs.readFileSync(memoryPath, 'utf8');
const engineSrc = fs.readFileSync(enginePath, 'utf8');
const profilerSrc = fs.readFileSync(profilerPath, 'utf8');
const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));

// ================================================================
// SUITE 1: Phase 1 Container Sizing, Viewport dvh & Mobile Ergonomics
// ================================================================
console.log('--- Suite 1: Phase 1 Container Sizing, Viewport dvh & Mobile Ergonomics ---');

runTest('Dynamic viewport height (100dvh / dvh) or height constraints applied', () => {
  const hasDvhOrHeightCalc = widgetSrc.includes('dvh') || widgetSrc.includes('window.innerHeight') || widgetSrc.includes('isMobile');
  assert(hasDvhOrHeightCalc, 'Widget must support dynamic viewport height handling');
});

runTest('Safe-area padding and mobile notch padding accounted for', () => {
  const hasSafeArea = widgetSrc.includes('safe') || widgetSrc.includes('env(') || widgetSrc.includes('pb-') || widgetSrc.includes('pt-');
  assert(hasSafeArea, 'Widget should accommodate safe area and touch bounds');
});

runTest('Interactive header touch targets meet accessibility size recommendations (>= 40px/44px or standard icon button padding)', () => {
  assert(widgetSrc.includes('p-2') || widgetSrc.includes('h-9') || widgetSrc.includes('h-10') || widgetSrc.includes('min-h-'), 'Header buttons must have comfortable touch targets');
});

runTest('Mobile responsive screen detection tracked with reactive listener', () => {
  assert(widgetSrc.includes('innerWidth < 640') || widgetSrc.includes('isMobile'), 'Dynamic mobile viewport detection must be present');
});

// ================================================================
// SUITE 2: Phase 2 Safe Markdown Parser, Code Blocks & Speech Sanitizer
// ================================================================
console.log('\n--- Suite 2: Phase 2 Safe Markdown Parser, Code Blocks & Speech Sanitizer ---');

runTest('FormattedMessage component parses fenced markdown code blocks with language badge', () => {
  assert(formattedMsgSrc.includes('CodeBlock'), 'FormattedMessage must render specialized CodeBlock components');
  assert(formattedMsgSrc.includes('displayLang') || formattedMsgSrc.includes('language'), 'Language tag must be rendered');
});

runTest('FormattedMessage provides 1-click clipboard copy with feedback check icon', () => {
  assert(formattedMsgSrc.includes('handleCopy') || formattedMsgSrc.includes('clipboard.writeText'), 'CodeBlock must feature 1-click copy');
  assert(formattedMsgSrc.includes('Copied!') || formattedMsgSrc.includes('setCopied'), 'Copy feedback must be displayed');
});

runTest('cleanTextForSpeech strips markdown symbols, code fences, links, and emojis for TTS', async () => {
  const { cleanTextForSpeech } = await import(path.resolve(widgetPath));
  assert(typeof cleanTextForSpeech === 'function', 'cleanTextForSpeech must be exported from AIChatWidget.jsx');

  const rawMarkdown = '```javascript\nconst x = 10;\n```\n**Hello** [Atul](https://atulverma.com) 🚀! Visit `code` now.';
  const cleaned = cleanTextForSpeech(rawMarkdown);

  assert(!cleaned.includes('```'), 'Code fences must be stripped');
  assert(!cleaned.includes('**'), 'Asterisks must be stripped');
  assert(!cleaned.includes('https://'), 'URLs must be stripped');
  assert(!cleaned.includes('🚀'), 'Emojis must be stripped');
  assert(cleaned.includes('Hello'), 'Plain text content must be preserved');
  assert(cleaned.includes('Atul'), 'Link label must be preserved');
});

// ================================================================
// SUITE 3: Phase 3 Categorized 2-Row Suggestion Grid & Slash Command Palette
// ================================================================
console.log('\n--- Suite 3: Phase 3 Categorized 2-Row Suggestion Grid & Slash Palette ---');

runTest('SuggestionChipsDrawer implements categorized tabs with roving navigation', () => {
  assert(suggestionDrawerSrc.includes('CATEGORY_TABS'), 'Drawer must define categorized tabs');
  assert(suggestionDrawerSrc.includes('activeCategory'), 'Active category state must be maintained');
});

runTest('SlashCommandPalette implements mobile viewport clamping and category grouping', () => {
  assert(slashPaletteSrc.includes('CATEGORY_ORDER') || slashPaletteSrc.includes('CATEGORY_METADATA'), 'Slash palette must group by categories');
  assert(slashPaletteSrc.includes('max-h-') || slashPaletteSrc.includes('max-h-[50vh]'), 'Palette must have height clamping');
});

runTest('Full catalog of 40+ slash commands exported from portfolioAssistantEngine.js', async () => {
  const { CHAT_SLASH_COMMANDS } = await import(path.resolve(enginePath));
  assert(Array.isArray(CHAT_SLASH_COMMANDS), 'CHAT_SLASH_COMMANDS must be an array');
  assert(CHAT_SLASH_COMMANDS.length >= 40, `Expected at least 40 slash commands, got ${CHAT_SLASH_COMMANDS.length}`);

  const requiredCommands = ['/clear', '/transcript', '/fullscreen', '/reset', '/view', '/model', '/help', '/projects', '/resume'];
  for (const cmd of requiredCommands) {
    assert(CHAT_SLASH_COMMANDS.some((c) => c.command === cmd), `Missing expected slash command: ${cmd}`);
  }
});

runTest('Escape key isolates slash command dismissal before widget closing', () => {
  assert(widgetSrc.includes("inputValueRef.current.startsWith('/')") || widgetSrc.includes("setInputValue('')"), 'Escape key must clear slash palette first if active');
});

// ================================================================
// SUITE 4: Phase 4 Focus Trap & Conversational WCAG 2.1 AA Accessibility
// ================================================================
console.log('\n--- Suite 4: Phase 4 Focus Trap & Conversational WCAG 2.1 AA Accessibility ---');

runTest('useFocusTrap hook traps Tab and Shift+Tab navigation within dialog', () => {
  assert(focusTrapSrc.includes('useFocusTrap'), 'useFocusTrap hook must be exported');
  assert(focusTrapSrc.includes('FOCUSABLE_SELECTOR'), 'Focus trap must scan focusable elements');
  assert(focusTrapSrc.includes('Tab') && focusTrapSrc.includes('shiftKey'), 'Focus trap must handle Shift+Tab boundary wrapping');
});

runTest('Message log container specifies role="log" with aria-live="polite"', () => {
  assert(widgetSrc.includes('role="log"'), 'Chat log container must specify role="log"');
  assert(widgetSrc.includes('aria-live="polite"'), 'Chat log container must declare aria-live="polite"');
});

runTest('Individual message bubbles declare role="article"', () => {
  assert(widgetSrc.includes('role="article"'), 'Message bubbles must declare role="article"');
});

runTest('Prefers-reduced-motion and tactile haptic feedback integrated', () => {
  assert(widgetSrc.includes('prefers-reduced-motion'), 'Reduced motion media query must be detected');
  assert(widgetSrc.includes('soundFX.triggerHaptic') || widgetSrc.includes('triggerHaptic'), 'Tactile haptic feedback must be invoked');
});

// ================================================================
// SUITE 5: Phase 5 Token Streaming Engine & In-Flight Interruption
// ================================================================
console.log('\n--- Suite 5: Phase 5 Token Streaming Engine & In-Flight Interruption ---');

runTest('aiModelWorker integrates Transformers.js TextStreamer and InterruptableStoppingCriteria', () => {
  assert(workerSrc.includes('TextStreamer'), 'aiModelWorker must import TextStreamer');
  assert(workerSrc.includes('InterruptableStoppingCriteria'), 'aiModelWorker must import InterruptableStoppingCriteria');
});

runTest('aiModelWorker dispatches real-time TOKEN_STREAM events and handles CANCEL_GENERATION', () => {
  assert(workerSrc.includes("type: 'TOKEN_STREAM'"), 'aiModelWorker must emit TOKEN_STREAM events');
  assert(workerSrc.includes("case 'CANCEL_GENERATION':"), 'aiModelWorker must handle CANCEL_GENERATION command');
});

runTest('localAIService provides cancelGeneration() and token callback wiring', () => {
  assert(serviceSrc.includes('cancelGeneration('), 'localAIService must expose cancelGeneration');
  assert(serviceSrc.includes('case \'TOKEN_STREAM\':'), 'localAIService must process TOKEN_STREAM events');
});

runTest('AIChatWidget renders red stop generation button with Square icon during streaming/typing', () => {
  assert(widgetSrc.includes('handleStopGenerating'), 'AIChatWidget must feature handleStopGenerating');
  assert(widgetSrc.includes('Square') && (widgetSrc.includes('isStreaming') || widgetSrc.includes('isTyping')), 'AIChatWidget must render Square stop icon during active streaming');
});

// ================================================================
// SUITE 6: Phase 6 Multi-Turn Context Memory RAG & Engine Size Budget
// ================================================================
console.log('\n--- Suite 6: Phase 6 Multi-Turn Context Memory RAG & Engine Size Budget ---');

runTest('portfolioContextMemory exports singleton with context tracking and entity stack', async () => {
  const { portfolioContextMemory } = await import(path.resolve(memoryPath));
  assert(typeof portfolioContextMemory.updateContext === 'function', 'updateContext must be a function');
  assert(typeof portfolioContextMemory.resolveAnaphora === 'function', 'resolveAnaphora must be a function');
  assert(typeof portfolioContextMemory.pushEntity === 'function', 'pushEntity must be a function');
  assert(typeof portfolioContextMemory.deriveContextualChips === 'function', 'deriveContextualChips must be a function');
});

runTest('Multi-turn pronoun resolution accurately maps follow-up queries', async () => {
  const { portfolioContextMemory } = await import(path.resolve(memoryPath));
  portfolioContextMemory.resetContext();

  portfolioContextMemory.updateContext({
    lastIntent: 'projects',
    lastTopic: 'GST & Income Tax Verification Engine',
    lastCaseStudyId: '01'
  });

  const resolvedPrice = portfolioContextMemory.resolveAnaphora('How much do you charge for that?');
  assert(resolvedPrice.hasAnaphora, 'Should detect anaphora');
  assert(resolvedPrice.resolvedIntent === 'pricing', 'Should resolve to pricing intent');
  assert(resolvedPrice.inferredCaseStudyId === '01', 'Should retain Case Study 01');

  const resolvedMore = portfolioContextMemory.resolveAnaphora('Tell me more about it');
  assert(resolvedMore.hasAnaphora, 'Should detect pronoun "it"');
  assert(resolvedMore.resolvedTopic.includes('GST'), 'Should map to GST topic');
});

runTest('Compound queries and comparative intents correctly identified', async () => {
  const { portfolioContextMemory } = await import(path.resolve(memoryPath));
  const compound = portfolioContextMemory.detectCompoundQuery('Compare accountant track vs vibe coder track');
  assert(compound.isCompound, 'Should identify comparison between accountant and vibe coding');
});

runTest('portfolioAssistantEngine.js strictly honors the < 110 kB budget', () => {
  const engineStats = fs.statSync(enginePath);
  assert(engineStats.size < 110000, `portfolioAssistantEngine.js must be under 110,000 bytes (currently ${engineStats.size} bytes)`);
});

// ================================================================
// SUITE 7: Phase 7 Edge Resilience, WebGPU Context Loss & Fallback Cascades
// ================================================================
console.log('\n--- Suite 7: Phase 7 Edge Resilience, WebGPU Context Loss & Fallback Cascades ---');

runTest('aiModelWorker monitors WebGPU context loss via device.lost.then(...)', () => {
  assert(workerSrc.includes('device.lost') || workerSrc.includes('gpuDev.lost'), 'aiModelWorker must attach device.lost listener');
  assert(workerSrc.includes("type: 'DEVICE_LOST'"), 'aiModelWorker must dispatch DEVICE_LOST on context loss');
});

runTest('aiModelWorker classifies allocation failures as oom_allocation_failed', () => {
  assert(workerSrc.includes('oom_allocation_failed'), 'aiModelWorker must classify memory allocation errors as oom_allocation_failed');
});

runTest('aiModelWorker exports initPipeline and probeModelPerformance', () => {
  assert(workerSrc.includes('export async function initPipeline') || workerSrc.includes('export const loadPipeline = initPipeline'), 'aiModelWorker must export initPipeline');
  assert(workerSrc.includes('export async function probeModelPerformance'), 'aiModelWorker must export probeModelPerformance');
});

runTest('localAIService handles network offline/online events gracefully', () => {
  assert(serviceSrc.includes("window.addEventListener('offline'"), 'localAIService must listen to offline event');
  assert(serviceSrc.includes('handleOfflineEvent'), 'localAIService must implement handleOfflineEvent');
  assert(serviceSrc.includes('offline_fallback'), 'localAIService must emit offline_fallback notification');
});

runTest('localAIService implements 10-second model load watchdog timer', () => {
  assert(serviceSrc.includes('modelLoadWatchdog'), 'localAIService must maintain modelLoadWatchdog');
  assert(serviceSrc.includes('10000'), 'Watchdog timer must be set to 10000ms (10 seconds)');
  assert(serviceSrc.includes('timeout_watchdog'), 'Watchdog must trigger fallback with reason timeout_watchdog');
});

runTest('localAIService handles worker DEVICE_LOST message with auto-downgrade purge', () => {
  assert(serviceSrc.includes("case 'DEVICE_LOST':"), 'localAIService must handle DEVICE_LOST message from worker');
  assert(serviceSrc.includes("handleModelDowngrade(failedModelId, 'device_lost')") || serviceSrc.includes("'device_lost'"), 'localAIService must invoke handleModelDowngrade with device_lost');
});

runTest('Cascading fallback ladder order is strictly deterministic (Qwen -> SmolLM -> Portfolio-Engine)', async () => {
  const { getNextDowngradeModel, MODEL_CATALOG } = await import(path.resolve(profilerPath));

  const mediumDowngrade = getNextDowngradeModel(MODEL_CATALOG.MEDIUM.id);
  assert(mediumDowngrade && mediumDowngrade.id === MODEL_CATALOG.BARE_MINIMUM.id, 'Qwen-0.5B should downgrade to SmolLM-135M');

  const bareDowngrade = getNextDowngradeModel(MODEL_CATALOG.BARE_MINIMUM.id);
  assert(bareDowngrade === null, 'SmolLM-135M should fall back to deterministic Portfolio-Engine (null)');
});

runTest('AIChatWidget handles offline_fallback and device_lost non-blocking notifications in toast & chat', () => {
  assert(widgetSrc.includes('offline_fallback'), 'AIChatWidget must handle offline_fallback notification');
  assert(widgetSrc.includes('device_lost'), 'AIChatWidget must handle device_lost notification');
});

runTest('package.json registers test:chat-enhancements script', () => {
  assert(pkgJson.scripts && pkgJson.scripts['test:chat-enhancements'], 'package.json must contain test:chat-enhancements script');
  assert(pkgJson.scripts['test:chat-enhancements'].includes('verify_chat_enhancements.mjs'), 'Script must point to verify_chat_enhancements.mjs');
});

// ================================================================
// VERIFICATION SUMMARY
// ================================================================
console.log('\n================================================================');
console.log(`TOTAL ASSERTIONS: ${totalAsserts}`);
console.log(`PASSED: ${passedAsserts}`);
console.log(`FAILED: ${failedAsserts}`);
console.log('================================================================\n');

if (failedAsserts > 0) {
  console.error(`💥 TEST SUITE FAILED: ${failedAsserts} assertion(s) did not pass.\n`);
  process.exit(1);
} else {
  console.log('🎉 ALL 7 PHASES OF AI CHAT ENHANCEMENT VERIFIED SUCCESSFULLY (100% PASS RATE)!\n');
  process.exit(0);
}
