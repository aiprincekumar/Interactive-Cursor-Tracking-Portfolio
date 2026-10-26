import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const isPhase1Only = process.argv.includes('--phase=1');
const isPhase2Only = process.argv.includes('--phase=2');

console.log('================================================================');
console.log('  VERIFY PURE ICON-ONLY HEADER & PURE SINGLE-ROW CHIPS CAROUSEL ');
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

// -------------------------------------------------------------
// PHASE 1 VERIFICATION: Pure Icon-Only Sub-Header
// -------------------------------------------------------------
runTest('Phase 1: Sub-header container possesses non-clipping horizontal scroll classes', () => {
  assert(
    chatWidgetSrc.includes('overflow-x-auto no-scrollbar'),
    'Sub-header must enforce non-clipping overflow-x-auto no-scrollbar classes'
  );
  assert(
    chatWidgetSrc.includes('Pure Icon-Only Sub-Header Strip'),
    'AIChatWidget must contain Pure Icon-Only Sub-Header Strip marker comment'
  );
});

runTest('Phase 1: Left Perspective Group contains 4 pure icon buttons', () => {
  assert(
    chatWidgetSrc.includes('<Users className="w-3.5 h-3.5" />'),
    'Left group must contain Users icon'
  );
  assert(
    chatWidgetSrc.includes('<Briefcase className="w-3.5 h-3.5" />'),
    'Left group must contain Briefcase icon'
  );
  assert(
    chatWidgetSrc.includes('<Monitor className="w-3.5 h-3.5" />'),
    'Left group must contain Monitor icon'
  );
  assert(
    chatWidgetSrc.includes('<Bot className="w-3.5 h-3.5" />'),
    'Left group must contain Bot icon'
  );
});

runTest('Phase 1: Right Quick Tools Group contains 6 pure icon buttons', () => {
  assert(
    chatWidgetSrc.includes('<Sparkles className="w-3.5 h-3.5 text-purple-500" />'),
    'Right group must contain Sparkles Prompt Studio icon'
  );
  assert(
    chatWidgetSrc.includes('<Zap className="w-3.5 h-3.5" />'),
    'Right group must contain Zap AI toggle icon'
  );
  assert(
    chatWidgetSrc.includes('<Smile className="w-3.5 h-3.5" />'),
    'Right group must contain Smile Emoji toggle icon'
  );
  assert(
    chatWidgetSrc.includes('<History className="w-3.5 h-3.5" />'),
    'Right group must contain History drawer icon'
  );
  assert(
    chatWidgetSrc.includes('<Download className="w-3.5 h-3.5" />'),
    'Right group must contain Download transcript icon'
  );
  assert(
    chatWidgetSrc.includes('<RotateCcw className="w-3.5 h-3.5" />'),
    'Right group must contain RotateCcw clear chat icon'
  );
});

runTest('Phase 1: Sub-header buttons contain 0 text spans / labels', () => {
  // Extract sub-header block between marker and voice settings modal
  const startMarker = 'Pure Icon-Only Sub-Header Strip (10 Direct Tools: 4 Perspective + 6 Quick Tools)';
  const endMarker = 'Voice Settings Studio Modal / Popover';
  const startIndex = chatWidgetSrc.indexOf(startMarker);
  const endIndex = chatWidgetSrc.indexOf(endMarker);

  assert(startIndex !== -1 && endIndex !== -1, 'Could not locate sub-header block in AIChatWidget.jsx');
  const subHeaderBlock = chatWidgetSrc.slice(startIndex, endIndex);

  // Check that no visible text spans exist inside button elements in the sub-header
  assert(
    !subHeaderBlock.includes('<span>Audience</span>') &&
    !subHeaderBlock.includes('<span>Role</span>') &&
    !subHeaderBlock.includes('<span>Tools</span>') &&
    !subHeaderBlock.includes('•••'),
    'Sub-header buttons must not render text labels or triple dots'
  );
});

if (!isPhase1Only) {
  const chipsDrawerPath = path.join(rootDir, 'src/components/chat/SuggestionChipsDrawer.jsx');
  const chipsDrawerSrc = fs.readFileSync(chipsDrawerPath, 'utf8');

  // PHASE 2 VERIFICATION: Pure Single-Row Chips Carousel
  runTest('Phase 2: CATEGORY_TABS is completely removed from SuggestionChipsDrawer', () => {
    assert(
      !chipsDrawerSrc.includes('CATEGORY_TABS'),
      'SuggestionChipsDrawer must not contain CATEGORY_TABS'
    );
  });

  runTest('Phase 2: SuggestionChipsDrawer uses pure single-row track with deduplication', () => {
    assert(
      chipsDrawerSrc.includes('flex items-center gap-1.5 overflow-x-auto'),
      'SuggestionChipsDrawer must render single-row flex carousel track'
    );
    assert(
      chipsDrawerSrc.includes('seen = new Set()'),
      'SuggestionChipsDrawer must maintain 100% chip deduplication'
    );
  });
}

console.log('\n================================================================');
console.log(`  RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('✨ VERIFIED WITH 100% SUCCESS!');
  process.exit(0);
}
