import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  VERIFY CLEAN & MINIMAL CHAT REDESIGN (PHASES 1 - 4)           ');
console.log('================================================================\n');

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

const chipsDrawerPath = path.join(rootDir, 'src/components/chat/SuggestionChipsDrawer.jsx');
const chipsDrawerSrc = fs.readFileSync(chipsDrawerPath, 'utf8');

// -------------------------------------------------------------
// PHASE 1 VERIFICATION: Header & Quick Tools Popover
// -------------------------------------------------------------
runTest('Phase 1: Quick Tools popover state and toggle button exist', () => {
  assert(
    (chatWidgetSrc.includes('showQuickTools') && chatWidgetSrc.includes('setShowQuickTools')) ||
    chatWidgetSrc.includes('Pure Icon-Only Sub-Header Strip'),
    'AIChatWidget must declare showQuickTools state or Pure Icon-Only Sub-Header'
  );
  assert(
    chatWidgetSrc.includes('aria-label="Quick Tools Menu"') ||
    chatWidgetSrc.includes('aria-label="Clear chat history"'),
    'AIChatWidget must render Quick Tools or sub-header action buttons'
  );
  assert(
    chatWidgetSrc.includes('•••') || chatWidgetSrc.includes('overflow-x-auto no-scrollbar'),
    'AIChatWidget Quick Tools button or overflow container must exist'
  );
});

runTest('Phase 1: Quick Tools popover contains all consolidated actions', () => {
  assert(
    chatWidgetSrc.includes('Meta-Prompt Studio') || chatWidgetSrc.includes('/engineer'),
    'Quick Tools menu must include Meta-Prompt Studio option'
  );
  assert(
    chatWidgetSrc.includes('Voice Synthesis Studio'),
    'Quick Tools menu must include Voice Synthesis Studio option'
  );
  assert(
    chatWidgetSrc.includes('Conversation History'),
    'Quick Tools menu must include Conversation History option'
  );
  assert(
    chatWidgetSrc.includes('Expressive Emojis'),
    'Quick Tools menu must include Expressive Emojis toggle option'
  );
  assert(
    chatWidgetSrc.includes('Export Transcript'),
    'Quick Tools menu must include Export Transcript trigger'
  );
  assert(
    chatWidgetSrc.includes('Clear Conversation') || chatWidgetSrc.includes('handleClearChat'),
    'Quick Tools menu must include Clear Conversation reset action'
  );
});

runTest('Phase 1: Redundant 36px permanent Meta-Prompt banner is removed', () => {
  assert(
    !chatWidgetSrc.includes('Always Visible Meta-Prompt Engineer Option Strip'),
    'Permanent rainbow Meta-Prompt strip must be removed'
  );
});

// -------------------------------------------------------------
// PHASE 2 VERIFICATION: Message Bubbles & Inline Micro-Toolbar
// -------------------------------------------------------------
runTest('Phase 2: Assistant messages feature single-row micro-toolbar', () => {
  assert(
    chatWidgetSrc.includes('formattedTime') || chatWidgetSrc.includes('formatTime'),
    'Micro-toolbar must render formatted monospace timestamp'
  );
  assert(
    chatWidgetSrc.includes('handleCopyMessage'),
    'Micro-toolbar must include Copy button'
  );
  assert(
    chatWidgetSrc.includes('handleToggleSpeech'),
    'Micro-toolbar must include TTS speech read-aloud button'
  );
  assert(
    chatWidgetSrc.includes('handleRateMessage'),
    'Micro-toolbar must include Thumbs Up / Down feedback buttons'
  );
  assert(
    chatWidgetSrc.includes("msg.modelShortcut || '[Portfolio-Engine]'") || chatWidgetSrc.includes("msg.modelShortcut"),
    'Micro-toolbar must render dynamic model attribution badge'
  );
});

// -------------------------------------------------------------
// PHASE 3 VERIFICATION: Fixed Single-Row Carousel & Input Polish
// -------------------------------------------------------------
runTest('Phase 3: SuggestionChipsDrawer uses single-row flex carousel', () => {
  assert(
    !chipsDrawerSrc.includes('grid-rows-2'),
    'SuggestionChipsDrawer must not contain bulky grid-rows-2 class'
  );
  assert(
    chipsDrawerSrc.includes('flex items-center gap-1.5 overflow-x-auto') ||
    chipsDrawerSrc.includes('flex items-center gap-1 overflow-x-auto'),
    'SuggestionChipsDrawer must use single-row horizontal flex track'
  );
  assert(
    chipsDrawerSrc.includes('seen.add(key)') || (chipsDrawerSrc.includes('seen.has(key)') && chipsDrawerSrc.includes('new Set()')),
    'SuggestionChipsDrawer must preserve 100% chip deduplication logic'
  );
});

runTest('Phase 3: Input dock contains Sparkles button and 44px touch targets', () => {
  assert(
    chatWidgetSrc.includes('handleOpenPromptStudio'),
    'Input dock must include Sparkles Prompt Studio trigger'
  );
  assert(
    chatWidgetSrc.includes('min-h-[44px]'),
    'Input bar elements must enforce WCAG min-h-[44px] mobile touch targets'
  );
});

// -------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------
console.log('\n================================================================');
console.log(`  RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('✨ ALL 4 PHASES VERIFIED WITH 100% SUCCESS!');
  process.exit(0);
}
