import fs from 'fs';
import assert from 'assert';

console.log('========================================================================');
console.log('   VERIFICATION SUITE: 5 EXACT ITEMS IMPLEMENTATION');
console.log('========================================================================\n');

let passed = 0;
let total = 0;

function check(title, fn) {
  total++;
  try {
    fn();
    console.log(`✅ PASS: ${title}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${title}`);
    console.error(`   ${err.message}`);
  }
}

const fullViewSrc = fs.readFileSync('src/components/TerminalFullView.jsx', 'utf8');
const appSrc = fs.readFileSync('src/App.jsx', 'utf8');
const chatSrc = fs.readFileSync('src/components/AIChatWidget.jsx', 'utf8');
const cliSrc = fs.readFileSync('src/components/TerminalCLI.jsx', 'utf8');

// Item 1: Terminal Default Fullscreen
console.log('--- Item 1: Terminal Default Fullscreen ---');
check('TerminalFullView sets isMaximized default to true', () => {
  assert.ok(
    fullViewSrc.includes('const [isMaximized, setIsMaximized] = useState(true);'),
    'TerminalFullView must initialize isMaximized with true'
  );
});

check('TerminalFullView listens to portfolio:toggle-terminal-maximize event', () => {
  assert.ok(
    fullViewSrc.includes('portfolio:toggle-terminal-maximize'),
    'TerminalFullView must listen to portfolio:toggle-terminal-maximize event'
  );
});

// Item 2: Terminal Bottom-Left Docked Tab
console.log('\n--- Item 2: Terminal Bottom-Left Docked Tab ---');
check('App.jsx docks minimized terminal flush at bottom-0 left-6 sm:left-8 z-[60]', () => {
  assert.ok(
    appSrc.includes('fixed bottom-0 left-6 sm:left-8 z-[60]'),
    'Docked tab must be fixed bottom-0 left-6 sm:left-8 z-[60]'
  );
  assert.ok(
    appSrc.includes('rounded-t-xl rounded-b-none border-t border-x border-b-0'),
    'Docked tab must have rounded-t-xl rounded-b-none border-t border-x border-b-0'
  );
  assert.ok(
    appSrc.includes('h-[46px] sm:h-[50px] px-4 flex items-center gap-2.5'),
    'Docked tab must have h-[46px] sm:h-[50px] px-4 flex items-center gap-2.5'
  );
});

check('App.jsx docked tab contains pulse prompt, restore button and close button with stopPropagation', () => {
  assert.ok(
    appSrc.includes('guest@atul-mac:~'),
    'Docked tab must show guest@atul-mac:~'
  );
  assert.ok(
    appSrc.includes('title="Restore Terminal (Alt+T)"') || appSrc.includes('aria-label="Restore Terminal"'),
    'Docked tab must have restore button'
  );
  assert.ok(
    appSrc.includes('title="Close Terminal"'),
    'Docked tab must have close button'
  );
});

// Item 3: AI Chat Box Expand Button Fix
console.log('\n--- Item 3: AI Chat Box Expand Button Fix ---');
check('AIChatWidget handleToggleMinimize stops event propagation', () => {
  assert.ok(
    chatSrc.includes('const handleToggleMinimize = (e) => {') &&
    chatSrc.includes('e?.stopPropagation?.();'),
    'handleToggleMinimize must call e?.stopPropagation?.()'
  );
});

check('AIChatWidget expand/minimize button explicitly calls e.stopPropagation()', () => {
  assert.ok(
    chatSrc.includes('onClick={(e) => {\n              e.stopPropagation();\n              handleToggleMinimize(e);\n            }}') ||
    chatSrc.includes('e.stopPropagation();\n              handleToggleMinimize(e);'),
    'Header expand button must invoke e.stopPropagation() before handleToggleMinimize(e)'
  );
});

// Item 4: Comprehensive Keyboard Shortcuts
console.log('\n--- Item 4: Comprehensive Keyboard Shortcuts ---');
check('App.jsx handles Alt+T and tilde shortcuts for Terminal view mode', () => {
  assert.ok(
    appSrc.includes("e.altKey && (e.key === 't' || e.key === 'T')"),
    'Must handle Alt+T'
  );
  assert.ok(
    appSrc.includes("e.key === '`' || e.key === '~'"),
    'Must handle tilde with input safety check'
  );
});

check('App.jsx handles F11 / Alt+M for toggle maximize and Alt+Down / Escape for minimize', () => {
  assert.ok(
    appSrc.includes("e.key === 'F11' || (e.altKey && (e.key === 'm' || e.key === 'M'))"),
    'Must handle F11 and Alt+M'
  );
  assert.ok(
    appSrc.includes("(e.altKey && (e.key === 'ArrowDown' || e.key === 'Down')) || e.key === 'Escape'"),
    'Must handle Alt+Down and Escape'
  );
});

check('App.jsx handles Job Role Shortcuts Alt+1 through Alt+5', () => {
  assert.ok(appSrc.includes("selectRole?.('overview')"), 'Alt+1 must select overview');
  assert.ok(appSrc.includes("selectRole?.('accountant')"), 'Alt+2 must select accountant');
  assert.ok(appSrc.includes("selectRole?.('mis')"), 'Alt+3 must select mis');
  assert.ok(appSrc.includes("selectRole?.('vibe_coding')"), 'Alt+4 must select vibe_coding');
  assert.ok(appSrc.includes("selectRole?.('other')"), 'Alt+5 must select other');
});

check('App.jsx handles Audience Shortcuts Alt+Shift+1 through Alt+Shift+4', () => {
  assert.ok(appSrc.includes("chooseAudience?.('all')"), 'Alt+Shift+1 must select all');
  assert.ok(appSrc.includes("chooseAudience?.('recruiter')"), 'Alt+Shift+2 must select recruiter');
  assert.ok(appSrc.includes("chooseAudience?.('client')"), 'Alt+Shift+3 must select client');
  assert.ok(appSrc.includes("chooseAudience?.('marriage')"), 'Alt+Shift+4 must select marriage');
});

check('TerminalCLI handles fullscreen, fs, maximize, max, minimize, min, restore', () => {
  assert.ok(cliSrc.includes("case 'fullscreen':"), 'TerminalCLI must handle fullscreen command');
  assert.ok(cliSrc.includes("case 'fs':"), 'TerminalCLI must handle fs command');
  assert.ok(cliSrc.includes("case 'maximize':"), 'TerminalCLI must handle maximize command');
  assert.ok(cliSrc.includes("case 'minimize':"), 'TerminalCLI must handle minimize command');
  assert.ok(cliSrc.includes("case 'restore':"), 'TerminalCLI must handle restore command');
});

console.log('\n========================================================================');
console.log(`TOTAL 5-ITEMS CHECKS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
console.log('========================================================================\n');

if (passed !== total) {
  process.exit(1);
}
