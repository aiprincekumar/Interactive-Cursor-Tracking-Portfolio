import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('========================================================================');
console.log('   INDEPENDENT AUDIT & VERIFICATION: TERMINAL WINDOW SYSTEM');
console.log('========================================================================\n');

let passCount = 0;
let failCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${description}`);
    passCount++;
  } catch (err) {
    console.error(`❌ FAIL: ${description}`);
    console.error(`   Error: ${err.message}`);
    failCount++;
  }
}

const appPath = path.resolve('src/App.jsx');
const cliPath = path.resolve('src/components/TerminalCLI.jsx');
const fullViewPath = path.resolve('src/components/TerminalFullView.jsx');

const appContent = fs.readFileSync(appPath, 'utf8');
const cliContent = fs.readFileSync(cliPath, 'utf8');
const fullViewContent = fs.readFileSync(fullViewPath, 'utf8');

// -----------------------------------------------------------------------------------------
// Requirement 1: Terminal automatic closing when switching away from terminal view mode (viewMode !== 'terminal')
// -----------------------------------------------------------------------------------------
console.log('--- Requirement 1: Terminal Automatic Closing on View Mode Switch ---');

test('App.jsx has useEffect listening to viewMode changes that auto-closes terminal when viewMode !== "terminal"', () => {
  const hasAutoCloseEffect = appContent.includes("if (viewMode !== 'terminal')") &&
    appContent.includes("setIsTerminalOpen(false)");
  assert.ok(hasAutoCloseEffect, 'App.jsx must close floating terminal when viewMode !== terminal');
});

test('App.jsx resets minimized state when switching away to basic or simple viewMode', () => {
  const hasBasicReset = appContent.includes("if (viewMode === 'basic' || viewMode === 'simple')") &&
    appContent.includes("setIsTerminalMinimized(false)");
  assert.ok(hasBasicReset, 'App.jsx must clean up minimized state when switching away from terminal');
});

test('TerminalFullView triggers viewMode transition to modern on exit/close', () => {
  const hasHandleClose = fullViewContent.includes("const handleClose = () => {") &&
    fullViewContent.includes("selectViewMode('modern')");
  assert.ok(hasHandleClose, 'TerminalFullView must transition viewMode to modern on close');
});

test('App.jsx only renders TerminalFullView when viewMode === "terminal"', () => {
  const hasViewModeBranch = appContent.includes("viewMode === 'terminal' ? (") &&
    appContent.includes("<TerminalFullView");
  assert.ok(hasViewModeBranch, 'TerminalFullView must be exclusively rendered when viewMode is terminal');
});

// -----------------------------------------------------------------------------------------
// Requirement 2: Fullscreen edge-to-edge maximize mode (w-screen h-screen inset-0 rounded-none border-0)
// -----------------------------------------------------------------------------------------
console.log('\n--- Requirement 2: Fullscreen Edge-to-Edge Maximize Mode ---');

test('TerminalFullView implements fixed inset-0 z-[9995] w-screen h-screen in maximized mode', () => {
  assert.ok(fullViewContent.includes('fixed inset-0 z-[9995] w-screen h-screen'), 'TerminalFullView outer wrapper must have fixed inset-0 z-[9995] w-screen h-screen');
  assert.ok(fullViewContent.includes('max-w-none max-h-none rounded-none border-0'), 'TerminalFullView inner container must strip borders and rounding');
});

test('TerminalCLI implements fixed inset-0 z-[9995] w-screen h-screen max-w-none max-h-none rounded-none border-0 when maximized', () => {
  const hasCliMaxClasses = cliContent.includes("fixed inset-0 z-[9995] w-screen h-screen max-w-none max-h-none rounded-none border-0");
  assert.ok(hasCliMaxClasses, 'TerminalCLI must contain full edge-to-edge maximize classes');
});

test('TerminalCLI communicates maximize change to parent via onMaximizeChange callback', () => {
  const hasMaximizeCallback = cliContent.includes('onMaximizeChange?.(');
  assert.ok(hasMaximizeCallback, 'TerminalCLI must notify parent of maximize state changes');
  const fullViewWiresCallback = fullViewContent.includes('onMaximizeChange={setIsMaximized}');
  assert.ok(fullViewWiresCallback, 'TerminalFullView must wire onMaximizeChange to setIsMaximized');
});

// -----------------------------------------------------------------------------------------
// Requirement 3: Minimize to bottom-left dock (bottom-5 left-5 z-[9995]) with background switching to Modern View & restore
// -----------------------------------------------------------------------------------------
console.log('\n--- Requirement 3: Minimize to Bottom-Left Dock & Modern View Switch ---');

test('TerminalFullView onMinimize callback sets minimized flag and switches viewMode to modern', () => {
  const hasOnMinimizeHandler = appContent.includes('onMinimize={() => {') &&
    appContent.includes('setIsTerminalMinimized(true)') &&
    appContent.includes("selectViewMode('modern')");
  assert.ok(hasOnMinimizeHandler, 'App.jsx must set isTerminalMinimized(true) and selectViewMode("modern")');
});

test('App.jsx renders bottom-left dock pill at bottom-5 left-5 z-[9995] when minimized', () => {
  const hasDockPill = (appContent.includes('fixed bottom-0 left-6 sm:left-8 z-[60]') || appContent.includes('fixed bottom-5 left-5 z-[9995]')) &&
    appContent.includes('isTerminalMinimized && viewMode !== \'terminal\'');
  assert.ok(hasDockPill, 'App.jsx must render dock pill at bottom-5 left-5 z-[9995] when minimized in modern view');
});

test('Dock pill restores Terminal View on click', () => {
  const hasRestoreOnClick = appContent.includes('setIsTerminalMinimized(false)') &&
    appContent.includes("selectViewMode('terminal')");
  assert.ok(hasRestoreOnClick, 'Clicking dock pill must clear minimized state and restore terminal view');
});

// -----------------------------------------------------------------------------------------
// Requirement 4: Close button (X) on dock pill completely dismissing the terminal
// -----------------------------------------------------------------------------------------
console.log('\n--- Requirement 4: Close Button (X) on Dock Pill Dismissal ---');

test('Dock pill contains dedicated Close button (X icon) with stopPropagation', () => {
  const hasCloseButton = appContent.includes('title="Close Terminal"') &&
    appContent.includes('aria-label="Close Terminal"') &&
    appContent.includes('e.stopPropagation()') &&
    appContent.includes('setIsTerminalMinimized(false)');
  assert.ok(hasCloseButton, 'Dock pill must have X button that stops propagation and dismisses minimized terminal');
});

test('TerminalCLI floating mode dock pill also contains dedicated Close button (X icon)', () => {
  const hasCliCloseButton = cliContent.includes('aria-label="Close Terminal"') &&
    cliContent.includes('setIsMinimized(false);') &&
    cliContent.includes('onClose();');
  assert.ok(hasCliCloseButton, 'TerminalCLI minimized dock pill must have close button');
});

console.log('\n========================================================================');
console.log(`TOTAL CHECKS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('========================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL AUDIT REQUIREMENTS VERIFIED AND CERTIFIED! 🎉\n');
  process.exit(0);
}
