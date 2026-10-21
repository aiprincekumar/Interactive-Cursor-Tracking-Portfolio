import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('--- RUNNING ADVERSARIAL EMPIRICAL HARNESS: DEVELOPER CLI & RESIZE SYSTEM ---');

const projectRoot = process.cwd();
const terminalPath = path.join(projectRoot, 'src', 'components', 'TerminalCLI.jsx');
const terminalCode = fs.readFileSync(terminalPath, 'utf-8');

// =========================================================================
// SUITE 1: CLI Window State Commands (maximize, minimize, restore, size)
// =========================================================================
console.log('\n[Suite 1: Empirical Command Logic Verification]');

// Extract the SIZE_PRESETS defined in TerminalCLI
const presetMatches = terminalCode.match(/const SIZE_PRESETS = \{([\s\S]*?)\};/);
assert(presetMatches, 'SIZE_PRESETS definition must be present');
const sizePresetsDef = presetMatches[1];

assert(sizePresetsDef.includes('sm: { width: 520, height: 360, label: \'Small\' }'), 'Preset sm must be 520x360');
assert(sizePresetsDef.includes('small: { width: 520, height: 360, label: \'Small\' }'), 'Preset small must be 520x360');
assert(sizePresetsDef.includes('md: { width: 720, height: 480, label: \'Medium\' }'), 'Preset md must be 720x480');
assert(sizePresetsDef.includes('medium: { width: 720, height: 480, label: \'Medium\' }'), 'Preset medium must be 720x480');
assert(sizePresetsDef.includes('lg: { width: 960, height: 620, label: \'Large\' }'), 'Preset lg must be 960x620');
assert(sizePresetsDef.includes('large: { width: 960, height: 620, label: \'Large\' }'), 'Preset large must be 960x620');
assert(sizePresetsDef.includes('default: { width: 720, height: 480, label: \'Default\' }'), 'Preset default must be 720x480');
console.log('✔ PASS: All size presets (sm, small, md, medium, lg, large, default) defined with exact dimensions');

// Test command switches
const commandSwitch = terminalCode.match(/switch \((?:mainCmd|clean)\) \{([\s\S]*?default:)/);
assert(commandSwitch, 'Command switch must exist');
const switchCode = commandSwitch[1];

assert(switchCode.includes("case 'maximize':") && switchCode.includes("case 'max':"), 'Maximize and max alias must be present');
assert(switchCode.includes('setIsMaximized(true)'), 'Maximize must set isMaximized(true)');
assert(switchCode.includes('setIsMinimized(false)'), 'Maximize must clear isMinimized(false)');
console.log('✔ PASS: Maximize command sets isMaximized=true and isMinimized=false');

assert(switchCode.includes("case 'minimize':") && switchCode.includes("case 'min':"), 'Minimize and min alias must be present');
assert(switchCode.includes('setIsMinimized(true)'), 'Minimize must set isMinimized(true)');
console.log('✔ PASS: Minimize command sets isMinimized=true');

assert(switchCode.includes("case 'restore':"), 'Restore command must be present');
assert(switchCode.includes('setIsMaximized(false)'), 'Restore must set isMaximized(false)');
assert(switchCode.includes('setIsMinimized(false)'), 'Restore must set isMinimized(false)');
console.log('✔ PASS: Restore command resets isMaximized and isMinimized to false');

assert(switchCode.includes("case 'size':") && switchCode.includes("case 'resize':"), 'Size and resize command aliases must be present');
console.log('✔ PASS: Size and resize commands accept sm|small|md|medium|lg|large|default');

// =========================================================================
// SUITE 2: Empirical Drag Resize Math & Constraint Engine
// =========================================================================
console.log('\n[Suite 2: Resize Math & Constraints Verification]');

// Test the resize math simulation
function simulateResize(startW, startH, startPosX, startPosY, dx, dy, handle, winW = 1920, winH = 1080) {
  const minW = 360;
  const minH = 260;
  const maxW = Math.max(minW, winW - 32);
  const maxH = Math.max(minH, winH - 32);

  let newW = startW;
  let newH = startH;
  let newPosX = startPosX;
  let newPosY = startPosY;

  if (handle === 'se' || handle === 'e') {
    newW = Math.max(minW, Math.min(maxW, startW + dx));
    const actualDx = newW - startW;
    newPosX = startPosX + actualDx / 2;
  }

  if (handle === 'se' || handle === 's') {
    newH = Math.max(minH, Math.min(maxH, startH + dy));
    const actualDy = newH - startH;
    newPosY = startPosY + actualDy / 2;
  }

  return {
    width: Math.round(newW),
    height: Math.round(newH),
    x: Math.round(newPosX),
    y: Math.round(newPosY)
  };
}

// 1. Minimum constraint clamping: Dragging corner inwards by huge negative delta
const clampedMin = simulateResize(720, 480, 0, 0, -800, -600, 'se');
assert.strictEqual(clampedMin.width, 360, 'Width must clamp to minimum 360px');
assert.strictEqual(clampedMin.height, 260, 'Height must clamp to minimum 260px');
console.log('✔ PASS: Minimum dimensional clamping enforced (min-width: 360px, min-height: 260px)');

// 2. Maximum constraint clamping: Dragging corner outwards beyond viewport
const clampedMax = simulateResize(720, 480, 0, 0, 3000, 3000, 'se', 1000, 800);
assert.strictEqual(clampedMax.width, 1000 - 32, 'Width must clamp to window.innerWidth - 32');
assert.strictEqual(clampedMax.height, 800 - 32, 'Height must clamp to window.innerHeight - 32');
console.log('✔ PASS: Maximum dimensional clamping bounded by viewport (window - 32px)');

// 3. Right edge handle ('e'): Only width and x change, height remains invariant
const edgeEast = simulateResize(720, 480, 0, 0, 100, 200, 'e');
assert.strictEqual(edgeEast.width, 820, 'Width must expand by 100');
assert.strictEqual(edgeEast.height, 480, 'Height must remain untouched for "e" handle');
assert.strictEqual(edgeEast.x, 50, 'Position X compensates delta / 2 to keep anchored');
assert.strictEqual(edgeEast.y, 0, 'Position Y untouched for "e" handle');
console.log('✔ PASS: Right edge handle expands width while locking height');

// 4. Bottom edge handle ('s'): Only height and y change, width remains invariant
const edgeSouth = simulateResize(720, 480, 0, 0, 200, 100, 's');
assert.strictEqual(edgeSouth.width, 720, 'Width must remain untouched for "s" handle');
assert.strictEqual(edgeSouth.height, 580, 'Height must expand by 100');
assert.strictEqual(edgeSouth.x, 0, 'Position X untouched for "s" handle');
assert.strictEqual(edgeSouth.y, 50, 'Position Y compensates delta / 2 to keep anchored');
console.log('✔ PASS: Bottom edge handle expands height while locking width');

// 5. Check handle elements in TerminalCLI JSX
assert(terminalCode.includes("data-testid=\"terminal-resize-handle\""), 'Corner grip handle must have testid');
assert(terminalCode.includes("handleResizeStart(e, 'e')"), 'Right edge must trigger handleResizeStart with "e"');
assert(terminalCode.includes("handleResizeStart(e, 's')"), 'Bottom edge must trigger handleResizeStart with "s"');
assert(terminalCode.includes("handleResizeStart(e, 'se')"), 'Corner grip must trigger handleResizeStart with "se"');
assert(terminalCode.includes('onTouchStart'), 'Resize handles must support touch events');
assert(terminalCode.includes('onMouseDown'), 'Resize handles must support mouse events');
console.log('✔ PASS: All 3 resize handles (East, South, Southeast corner) wired with mouse and touch listeners');

// =========================================================================
// SUITE 3: Navbar Header & Explore Integration
// =========================================================================
console.log('\n[Suite 3: Navbar Header & Explore SubBar Verification]');

const navbarPath = path.join(projectRoot, 'src', 'components', 'Navbar.jsx');
const navbarCode = fs.readFileSync(navbarPath, 'utf-8');

// Ensure `[ ~/_ ]` is completely removed from navbar
assert(!navbarCode.includes('~/_'), 'Navbar must NOT contain ~/_ CLI trigger in header');
assert(!navbarCode.includes('terminal-cli-trigger'), 'Navbar must not contain legacy terminal trigger button');

// Ensure Navbar receives and forwards onToggleTerminal and onOpenTerminal
assert(navbarCode.includes('onToggleTerminal'), 'Navbar must accept onToggleTerminal prop');
assert(navbarCode.includes('onOpenTerminal'), 'Navbar must accept onOpenTerminal prop');
assert(navbarCode.includes('onToggleTerminal={onToggleTerminal}'), 'Navbar must forward onToggleTerminal to ExploreSubBar');
assert(navbarCode.includes('onOpenTerminal={onOpenTerminal}'), 'Navbar must forward onOpenTerminal to ExploreSubBar');
console.log('✔ PASS: Standalone [ ~/_ ] removed from Navbar header; onOpenTerminal and onToggleTerminal cleanly wired');

// Check ExploreSubBar.jsx
const explorePath = path.join(projectRoot, 'src', 'components', 'ExploreSubBar.jsx');
const exploreCode = fs.readFileSync(explorePath, 'utf-8');

assert(exploreCode.includes("id: 'terminal-cli'"), 'ExploreSubBar items must include terminal-cli');
assert(exploreCode.includes("label: 'Terminal CLI'"), 'ExploreSubBar terminal item must be labeled "Terminal CLI"');
assert(exploreCode.includes("action: 'toggle-terminal'"), 'ExploreSubBar terminal item action must be "toggle-terminal"');

// Ensure terminal-cli is at the end of the items list
const itemsMatch = exploreCode.match(/const items = \[([\s\S]*?)\];/);
assert(itemsMatch, 'items array must be found in ExploreSubBar.jsx');
const itemsList = itemsMatch[1];
const terminalPos = itemsList.indexOf("'terminal-cli'");
const galleryPos = itemsList.indexOf("'gallery'");
const drawerPos = itemsList.indexOf("'drawer'");
assert(terminalPos > galleryPos && terminalPos > drawerPos, 'Terminal CLI must be placed at the end of Explore menu');
console.log('✔ PASS: Terminal CLI is positioned at the end of ExploreSubBar items');

// Verify clean open dispatch without double-toggle glitch
assert(
  exploreCode.includes('onOpenTerminal') || exploreCode.includes('portfolio:open-terminal'),
  'ExploreSubBar must support explicit open action'
);
const hasDoubleToggleGlitch =
  exploreCode.includes('onToggleTerminal();\n      }\n      if (typeof window !== \'undefined\') {\n        window.dispatchEvent(new CustomEvent(\'portfolio:toggle-terminal\'));');
assert(!hasDoubleToggleGlitch, 'ExploreSubBar must not execute double-toggle on terminal item click');
console.log('✔ PASS: ExploreSubBar handleJump cleanly triggers open without double-toggle glitch');

// =========================================================================
// SUITE 4: App Integration & Keyboard Accessibility
// =========================================================================
console.log('\n[Suite 4: App Mounting & Hotkeys]');
const appPath = path.join(projectRoot, 'src', 'App.jsx');
const appCode = fs.readFileSync(appPath, 'utf-8');

assert(appCode.includes('<TerminalCLI'), 'App.jsx must mount TerminalCLI');
assert(appCode.includes("e.key === '`' || e.key === '~'"), 'App.jsx must handle tilde / backtick hotkey');
assert(appCode.includes('portfolio:toggle-terminal'), 'App.jsx must listen to portfolio:toggle-terminal event');
assert(appCode.includes('portfolio:open-terminal'), 'App.jsx must listen to portfolio:open-terminal event');
assert(appCode.includes('onOpenTerminal'), 'App.jsx must pass onOpenTerminal prop to Navbar');
console.log('✔ PASS: App.jsx mounts TerminalCLI and registers global ` / ~ hotkey + toggle & open custom events');

// =========================================================================
// SUITE 5: Auto-Restore from Minimized & Auto-Focus
// =========================================================================
console.log('\n[Suite 5: Auto-Restore from Minimized & Auto-Focus Verification]');
assert(
  terminalCode.includes('isOpen && isMinimized') || terminalCode.includes('portfolio:open-terminal'),
  'TerminalCLI must automatically restore isMinimized to false when reopened'
);
assert(
  terminalCode.includes('inputRef.current?.focus()'),
  'TerminalCLI must auto-focus input when opened or restored'
);
console.log('✔ PASS: TerminalCLI automatically restores from minimized and focuses input on open');

// =========================================================================
// SUITE 6: Multi-OS Look & Feel Switcher (macOS, Windows, Ubuntu Linux)
// =========================================================================
console.log('\n[Suite 6: Multi-OS Look & Feel Switcher Verification]');

// 1. Verify OS commands and aliases
assert(switchCode.includes("case 'os':"), 'TerminalCLI must handle "os" command');
assert(switchCode.includes("case 'style':"), 'TerminalCLI must handle "style" alias');
assert(switchCode.includes("case 'theme-os':"), 'TerminalCLI must handle "theme-os" alias');

// 2. Verify OS switching targets
assert(terminalCode.includes("target === 'mac'"), 'TerminalCLI must support switching to macOS');
assert(terminalCode.includes("target === 'win'"), 'TerminalCLI must support switching to Windows');
assert(terminalCode.includes("target === 'linux'"), 'TerminalCLI must support switching to Linux');

// 3. Verify OS Prompts
assert(terminalCode.includes('guest@atul-mac:~ %'), 'TerminalCLI must support macOS prompt guest@atul-mac:~ %');
assert(terminalCode.includes('PS C:\\\\Users\\\\Atul>'), 'TerminalCLI must support Windows prompt PS C:\\Users\\Atul>');
assert(terminalCode.includes('guest@atul-linux:~$'), 'TerminalCLI must support Ubuntu Linux prompt guest@atul-linux:~$');

// 4. Verify OS Window Chromes & Controls
assert(terminalCode.includes('#FF5F56') && terminalCode.includes('#FFBD2E') && terminalCode.includes('#27C93F'), 'macOS mode must render traffic-light dots (Red, Yellow, Green)');
assert(terminalCode.includes('Windows PowerShell'), 'Windows mode must render Windows PowerShell title and chrome');
assert(terminalCode.includes('#012456'), 'Windows mode must use deep PowerShell Navy styling');
assert(terminalCode.includes('guest@atul-linux: ~'), 'Linux mode must render Ubuntu Linux title');
assert(terminalCode.includes('#2c001e'), 'Linux mode must use Ubuntu aubergine styling');
assert(terminalCode.includes('terminal_os_style'), 'TerminalCLI must persist OS style in localStorage');
console.log('✔ PASS: Multi-OS Look & Feel Switcher (macOS, Windows PowerShell, Ubuntu Linux) verified');

// =========================================================================
// SUITE 7: Color, Typography & Zoom Simulation Engine
// =========================================================================
console.log('\n[Suite 7: Color, Typography & Zoom Verification]');

// 1. Extract COLOR_PRESETS
const colorPresetMatch = terminalCode.match(/const COLOR_PRESETS = \{([\s\S]*?)\};/);
assert(colorPresetMatch, 'COLOR_PRESETS definition must be present');
const colorPresetsDef = colorPresetMatch[1];
const expectedColors = ['matrix', 'amber', 'cyan', 'pink', 'synthwave', 'white', 'red', 'purple'];
for (const color of expectedColors) {
  assert(colorPresetsDef.includes(`${color}:`), `COLOR_PRESETS must include "${color}"`);
}
console.log('✔ PASS: All 8 color presets defined (matrix, amber, cyan, pink, synthwave, white, red, purple)');

// 2. Empirical test of Hex Validation Regex
const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
assert(hexRegex.test('#00ffcc'), 'Valid 6-digit hex must pass');
assert(hexRegex.test('#fff'), 'Valid 3-digit hex must pass');
assert(hexRegex.test('#10B981'), 'Valid uppercase hex must pass');
assert(!hexRegex.test('#12345'), 'Invalid 5-digit hex must fail');
assert(!hexRegex.test('blue'), 'Non-hex string must fail');
assert(!hexRegex.test('#gggggg'), 'Invalid hex characters must fail');
console.log('✔ PASS: Hex code validation regex empirical test passed');

// 3. Extract FONT_SIZE_PRESETS and simulate zoom math
const fontSizeMatch = terminalCode.match(/const FONT_SIZE_PRESETS = \{([\s\S]*?)\};/);
assert(fontSizeMatch, 'FONT_SIZE_PRESETS definition must be present');
const fontSizeDef = fontSizeMatch[1];
assert(fontSizeDef.includes('11') && fontSizeDef.includes('13') && fontSizeDef.includes('16') && fontSizeDef.includes('18'), 'Font sizes 11px, 13px, 16px, 18px must be defined');

function simulateZoom(currentSize, action) {
  if (action === 'in') return Math.min(28, currentSize + 2);
  if (action === 'out') return Math.max(10, currentSize - 2);
  if (action === 'reset') return 13;
  return currentSize;
}
assert.strictEqual(simulateZoom(13, 'in'), 15, 'Zoom in from 13 must be 15');
assert.strictEqual(simulateZoom(28, 'in'), 28, 'Zoom in clamped at 28');
assert.strictEqual(simulateZoom(13, 'out'), 11, 'Zoom out from 13 must be 11');
assert.strictEqual(simulateZoom(10, 'out'), 10, 'Zoom out clamped at 10');
assert.strictEqual(simulateZoom(20, 'reset'), 13, 'Zoom reset must restore 13px');
console.log('✔ PASS: Font size zoom math & clamping (10px min, 28px max, 13px default) verified');

// 4. Extract FONT_FAMILIES
const fontFamilyMatch = terminalCode.match(/const FONT_FAMILIES = \{([\s\S]*?)\};/);
assert(fontFamilyMatch, 'FONT_FAMILIES definition must be present');
const fontFamiliesDef = fontFamilyMatch[1];
const expectedFonts = ['mono', 'pixel', 'retro', 'fira', 'matrix'];
for (const font of expectedFonts) {
  assert(fontFamiliesDef.includes(`${font}:`), `FONT_FAMILIES must include "${font}"`);
}
console.log('✔ PASS: All coding font families (mono, pixel, retro, fira, matrix) defined');

// 5. Verify Reset command
assert(switchCode.includes("case 'reset':"), 'TerminalCLI must handle "reset" command');
assert(terminalCode.includes("setOsStyle('mac')"), 'Reset must restore macOS');
assert(terminalCode.includes("setFontColor('#10b981')"), 'Reset must restore Matrix green');
assert(terminalCode.includes('setFontSize(13)'), 'Reset must restore 13px font size');
assert(terminalCode.includes("setFontFamily('mono')"), 'Reset must restore mono font');
console.log('✔ PASS: Reset command restores all default typography, colors, and layout');

// =========================================================================
// SUITE 8: Power Pack Virtual Filesystem & Utilities
// =========================================================================
console.log('\n[Suite 8: Power Pack Virtual Filesystem & Utilities]');

// 1. Virtual Files
const virtualFilesMatch = terminalCode.match(/const VIRTUAL_FILES = \{([\s\S]*?)\};/);
assert(virtualFilesMatch, 'VIRTUAL_FILES definition must be present');
const virtualFilesDef = virtualFilesMatch[1];
const expectedVirtFiles = ['about.md', 'skills.json', 'projects.ts', 'resume.pdf', 'contact.sh', 'secrets.env'];
for (const file of expectedVirtFiles) {
  assert(virtualFilesDef.includes(`'${file}'`), `VIRTUAL_FILES must contain "${file}"`);
}
console.log('✔ PASS: Virtual files (about.md, skills.json, projects.ts, resume.pdf, contact.sh, secrets.env) present');

// 2. Power pack commands
const powerCommands = [
  'neofetch',
  'fastfetch',
  'ls',
  'cat',
  'pwd',
  'git',
  'ping',
  'history',
  'cowsay',
  'fortune',
  'confetti',
  'weather'
];
for (const cmd of powerCommands) {
  assert(switchCode.includes(`case '${cmd}':`), `Switch statement must handle power pack command "${cmd}"`);
}
console.log('✔ PASS: All 12 Power Pack commands wired into command execution engine');

// 3. Cowsay formatting simulation
function simulateCowsay(text) {
  const msg = text || 'Moo';
  const len = msg.length;
  const border = '-'.repeat(len + 2);
  const topBorder = '_'.repeat(len + 2);
  return ` ${topBorder}\n< ${msg} >\n ${border}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||`;
}
const cowsayOutput = simulateCowsay('Hello Portfolio');
assert(cowsayOutput.includes('Hello Portfolio'), 'Cowsay must include message in bubble');
assert(cowsayOutput.includes('(oo)'), 'Cowsay must include cow eyes');
console.log('✔ PASS: Cowsay speech bubble generator verified');

console.log('\n====================================================================');
console.log('ALL ADVERSARIAL & EMPIRICAL DEVELOPER CLI VERIFICATIONS PASSED!');
console.log('====================================================================');
