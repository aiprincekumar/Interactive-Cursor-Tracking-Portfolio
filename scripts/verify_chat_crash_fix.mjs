import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  VERIFY CHAT CRASH FIX & RESILIENT ERROR BOUNDARY RECOVERY     ');
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

// 1. Check AIChatWidget.jsx messages.map(msg, idx)
const chatWidgetPath = path.join(rootDir, 'src/components/AIChatWidget.jsx');
const chatWidgetSrc = fs.readFileSync(chatWidgetPath, 'utf8');

runTest('AIChatWidget declares (msg, idx) in messages.map loop', () => {
  assert(
    chatWidgetSrc.includes('messages.map((msg, idx) =>') ||
    chatWidgetSrc.includes('messages.map((msg, idx)=>'),
    'messages.map must declare both msg and idx parameters'
  );
  assert(
    chatWidgetSrc.includes('idx === messages.length - 1'),
    'Streaming cursor pulse must check idx === messages.length - 1'
  );
});

// 2. Check ErrorBoundary.jsx resilient fallback
const errorBoundaryPath = path.join(rootDir, 'src/components/ErrorBoundary.jsx');
const errorBoundarySrc = fs.readFileSync(errorBoundaryPath, 'utf8');

runTest('ErrorBoundary implements resilient fallback for AIChatWidget', () => {
  assert(
    errorBoundarySrc.includes("props.name === 'AIChatWidget'") ||
    errorBoundarySrc.includes('name === "AIChatWidget"'),
    'ErrorBoundary must support resilient recovery for AIChatWidget'
  );
  assert(
    errorBoundarySrc.includes('Reopen Chat') || errorBoundarySrc.includes('handleReset'),
    'ErrorBoundary must provide a reset/reopen trigger'
  );
});

// 3. Check LabStudioDrawer.jsx subtitle string
const drawerPath = path.join(rootDir, 'src/components/LabStudioDrawer.jsx');
const drawerSrc = fs.readFileSync(drawerPath, 'utf8');

runTest('LabStudioDrawer includes exact subtitle required by verify_threed_controls', () => {
  assert(
    drawerSrc.includes('Audio, Cursors, Hero, 3D, Preferences & Visuals'),
    'LabStudioDrawer must contain exact phrase: "Audio, Cursors, Hero, 3D, Preferences & Visuals"'
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
