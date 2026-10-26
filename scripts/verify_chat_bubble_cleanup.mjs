import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  VERIFY IN-BUBBLE CLEANUP & SUGGESTION CHIP DEDUPLICATION       ');
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

// 1. Check AIChatWidget.jsx for removed in-bubble vertical option stacks
const chatWidgetPath = path.join(rootDir, 'src/components/AIChatWidget.jsx');
const chatWidgetSrc = fs.readFileSync(chatWidgetPath, 'utf8');

runTest('AIChatWidget does not render 1-Column Vertical Stack inside message bubble', () => {
  assert(
    !chatWidgetSrc.includes('1-Column Vertical Stack for Decision Options'),
    'Redundant 1-column vertical button stack must be removed from bubble'
  );
  assert(
    !chatWidgetSrc.includes('regularOptions.map'),
    'regularOptions.map must not be rendered inside bubble'
  );
});

runTest('AIChatWidget currentChips routes decision tree options to Suggestion Drawer', () => {
  assert(
    chatWidgetSrc.includes('latestAssistant?.decisionTree?.options') ||
    chatWidgetSrc.includes('decisionTree.options'),
    'currentChips must inspect decisionTree.options'
  );
  assert(
    chatWidgetSrc.includes('seen.has(key)'),
    'currentChips must deduplicate chips using seen set'
  );
});

runTest('AIChatWidget SuggestionChipsDrawer onSelectChip handles decision selections', () => {
  assert(
    chatWidgetSrc.includes('handleAudienceDecisionSelect') &&
    chatWidgetSrc.includes('handleRoleDecisionSelect'),
    'onSelectChip must dispatch audience/role selections'
  );
});

runTest('AIChatWidget messages scroll view has anti-clipping bottom padding', () => {
  assert(
    chatWidgetSrc.includes('pb-4') || chatWidgetSrc.includes('pb-5') || chatWidgetSrc.includes('pb-6'),
    'Message history container must specify pb-4 or greater bottom padding'
  );
});

// 2. Check SuggestionChipsDrawer.jsx for deduplication
const drawerPath = path.join(rootDir, 'src/components/chat/SuggestionChipsDrawer.jsx');
const drawerSrc = fs.readFileSync(drawerPath, 'utf8');

runTest('SuggestionChipsDrawer deduplicates visibleChips by key/label', () => {
  assert(
    drawerSrc.includes('seen.add(key)') || drawerSrc.includes('seen.has(key)'),
    'SuggestionChipsDrawer must deduplicate chips in visibleChips'
  );
});

console.log('\n================================================================');
console.log(`  VERIFICATION RESULTS: ${passCount} PASSED | ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
