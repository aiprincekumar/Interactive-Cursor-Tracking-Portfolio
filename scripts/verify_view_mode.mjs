import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('========================================================================');
console.log('             VERIFYING VIEW MODE (व्यू मोड) FEATURE IMPLEMENTATION        ');
console.log('========================================================================\n');

let passCount = 0;
let failCount = 0;

function test(desc, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${desc}`);
    passCount++;
  } catch (err) {
    console.error(`❌ FAIL: ${desc}`);
    console.error(`   Error: ${err.message}`);
    failCount++;
  }
}

const root = process.cwd();
const contextPath = path.join(root, 'src', 'context', 'ViewModeContext.jsx');
const subBarPath = path.join(root, 'src', 'components', 'ViewModeSubBar.jsx');
const floatingPillPath = path.join(root, 'src', 'components', 'ViewModeFloatingPill.jsx');
const navbarPath = path.join(root, 'src', 'components', 'Navbar.jsx');
const hubPath = path.join(root, 'src', 'components', 'FloatingActionHub.jsx');
const explorePath = path.join(root, 'src', 'components', 'ExploreSubBar.jsx');
const appPath = path.join(root, 'src', 'App.jsx');

const contextCode = fs.readFileSync(contextPath, 'utf8');
const subBarCode = fs.readFileSync(subBarPath, 'utf8');
const floatingPillCode = fs.readFileSync(floatingPillPath, 'utf8');
const navbarCode = fs.readFileSync(navbarPath, 'utf8');
const hubCode = fs.readFileSync(hubPath, 'utf8');
const exploreCode = fs.readFileSync(explorePath, 'utf8');
const appCode = fs.readFileSync(appPath, 'utf8');

// -------------------------------------------------------------------------
// SUITE 1: ViewModeContext & State Management
// -------------------------------------------------------------------------
console.log('\n--- Suite 1: ViewModeContext & State Management ---');

test('ViewModeContext.jsx exists and exports required constants and hooks', () => {
  assert(fs.existsSync(contextPath), 'ViewModeContext.jsx must exist');
  assert(contextCode.includes('export const VIEW_MODE_STORAGE_KEY'), 'Must export VIEW_MODE_STORAGE_KEY');
  assert(contextCode.includes("'portfolio_view_mode'"), 'Key must be portfolio_view_mode');
  assert(contextCode.includes('export const DEFAULT_VIEW_MODE'), 'Must export DEFAULT_VIEW_MODE');
  assert(contextCode.includes('export const VIEW_MODES'), 'Must export VIEW_MODES');
  assert(contextCode.includes('export const VIEW_MODE_LIST'), 'Must export VIEW_MODE_LIST');
  assert(contextCode.includes('export function ViewModeProvider'), 'Must export ViewModeProvider');
  assert(contextCode.includes('export function useViewMode'), 'Must export useViewMode hook');
});

test('Four View Mode options in exact order: basic, simple, modern, terminal', () => {
  const listMatch = contextCode.match(/export const VIEW_MODE_LIST = \[([\s\S]*?)\];/);
  assert(listMatch, 'VIEW_MODE_LIST array must be defined');
  const items = listMatch[1];
  const basicIdx = items.indexOf('VIEW_MODES.basic');
  const simpleIdx = items.indexOf('VIEW_MODES.simple');
  const modernIdx = items.indexOf('VIEW_MODES.modern');
  const terminalIdx = items.indexOf('VIEW_MODES.terminal');

  assert(basicIdx !== -1, 'basic mode must be in list');
  assert(simpleIdx !== -1, 'simple mode must be in list');
  assert(modernIdx !== -1, 'modern mode must be in list');
  assert(terminalIdx !== -1, 'terminal mode must be in list');
  assert(basicIdx < simpleIdx, 'basic must precede simple');
  assert(simpleIdx < modernIdx, 'simple must precede modern');
  assert(modernIdx < terminalIdx, 'modern must precede terminal');
});

test('View Mode emojis and icons match specification', () => {
  // basic: 📄 / FileText
  assert(contextCode.includes("emoji: '📄'"), 'Basic mode emoji must be 📄');
  assert(contextCode.includes('icon: FileText'), 'Basic mode icon must be FileText');

  // simple: 🍃 / Sparkles
  assert(contextCode.includes("emoji: '🍃'"), 'Simple mode emoji must be 🍃');
  assert(contextCode.includes('icon: Sparkles'), 'Simple mode icon must be Sparkles');

  // modern: ⚡ / Layers
  assert(contextCode.includes("emoji: '⚡'"), 'Modern mode emoji must be ⚡');
  assert(contextCode.includes('icon: Layers'), 'Modern mode icon must be Layers');

  // terminal: 💻 / Terminal
  assert(contextCode.includes("emoji: '💻'"), 'Terminal mode emoji must be 💻');
  assert(contextCode.includes('icon: Terminal'), 'Terminal mode icon must be Terminal');
});

test('View Mode labels match aligned dual-descriptor format in English and Hindi', () => {
  // basic: Basic / PDF | बेसिक / PDF
  assert(contextCode.includes("label: 'Basic / PDF'"), 'Basic mode label must be Basic / PDF');
  assert(contextCode.includes("label_hi: 'बेसिक / PDF'") || contextCode.includes("labelHi: 'बेसिक / PDF'"), 'Basic mode Hindi label must be बेसिक / PDF');

  // simple: Simple / Classic | सिंपल / क्लासिक
  assert(contextCode.includes("label: 'Simple / Classic'"), 'Simple mode label must be Simple / Classic');
  assert(contextCode.includes("label_hi: 'सिंपल / क्लासिक'") || contextCode.includes("labelHi: 'सिंपल / क्लासिक'"), 'Simple mode Hindi label must be सिंपल / क्लासिक');

  // modern: Modern / Interactive | मॉडर्न / इंटरैक्टिव
  assert(contextCode.includes("label: 'Modern / Interactive'"), 'Modern mode label must be Modern / Interactive');
  assert(contextCode.includes("label_hi: 'मॉडर्न / इंटरैक्टिव'") || contextCode.includes("labelHi: 'मॉडर्न / इंटरैक्टिव'"), 'Modern mode Hindi label must be मॉडर्न / इंटरैक्टिव');

  // terminal: Terminal / Developer | टर्मिनल / डेवलपर
  assert(contextCode.includes("label: 'Terminal / Developer'"), 'Terminal mode label must be Terminal / Developer');
  assert(contextCode.includes("label_hi: 'टर्मिनल / डेवलपर'") || contextCode.includes("labelHi: 'टर्मिनल / डेवलपर'"), 'Terminal mode Hindi label must be टर्मिनल / डेवलपर');
});

test('ViewModeContext ties simple mode with SimpleModeContext and terminal with portfolio:open-terminal', () => {
  assert(contextCode.includes('useSimpleMode'), 'Must access useSimpleMode');
  assert(contextCode.includes("targetMode === 'simple'"), 'Must handle simple mode target');
  assert(contextCode.includes('setIsSimpleMode(true)'), 'Must enable simple mode when simple selected');
  assert(contextCode.includes('setIsSimpleMode(false)'), 'Must disable simple mode when modern selected');
  assert(contextCode.includes("window.dispatchEvent(new CustomEvent('portfolio:open-terminal'))"), 'Must dispatch portfolio:open-terminal when terminal selected');
});

// -------------------------------------------------------------------------
// SUITE 2: Navbar Integration
// -------------------------------------------------------------------------
console.log('\n--- Suite 2: Navbar Integration ---');

test('Navbar imports ViewModeSubBar and useViewMode', () => {
  assert(navbarCode.includes("import ViewModeSubBar from './ViewModeSubBar';"), 'Must import ViewModeSubBar');
  assert(navbarCode.includes("import { useViewMode } from '../context/ViewModeContext';"), 'Must import useViewMode');
});

test('Navbar right action group contains View Mode button with Eye icon adjacent to Audience Filter', () => {
  const audienceFilterBtnIdx = navbarCode.indexOf('{/* 2b. Audience Filter SubBar Trigger Button */}');
  const viewModeBtnIdx = navbarCode.indexOf('{/* 2c. View Mode SubBar Trigger Button */}');

  assert(audienceFilterBtnIdx !== -1, 'Audience filter trigger button must exist');
  assert(viewModeBtnIdx !== -1, 'View mode trigger button must exist');
  assert(viewModeBtnIdx > audienceFilterBtnIdx, 'View mode button must be positioned immediately adjacent to Audience Filter');

  const viewModeBlock = navbarCode.slice(viewModeBtnIdx, viewModeBtnIdx + 2500);
  assert(viewModeBlock.includes('onClick={toggleViewModeBar}'), 'Button must trigger toggleViewModeBar');
  assert(viewModeBlock.includes('<Eye'), 'Button must use Eye icon from lucide-react');
  assert(viewModeBlock.includes("aria-label={isViewModeOpen ? 'Close View Mode' : `View Mode (${activeViewModeData?.label || 'Modern'})`}"), 'Has accessible aria-label');
});

test('Navbar mounts ViewModeSubBar (floating-bar) beneath capsule and (drawer-card) in mobile drawer', () => {
  assert(navbarCode.includes('{isViewModeOpen && ('), 'Conditionally renders floating-bar subbar');
  assert(navbarCode.includes('<ViewModeSubBar\n            variant="floating-bar"'), 'Renders variant="floating-bar"');
  assert(navbarCode.includes('<ViewModeSubBar\n              variant="drawer-card"'), 'Renders variant="drawer-card" in mobile drawer');
});

// -------------------------------------------------------------------------
// SUITE 3: Floating Action Hub Integration
// -------------------------------------------------------------------------
console.log('\n--- Suite 3: Floating Action Hub Integration ---');

test('FloatingActionHub replaces simple-mode-toggle with view-mode button using Eye icon', () => {
  assert(!hubCode.includes("id: 'simple-mode-toggle'"), 'simple-mode-toggle must be replaced with view-mode');
  assert(hubCode.includes("id: 'view-mode'"), 'Must contain view-mode item');
  assert(hubCode.includes('<Eye'), 'Must use Eye icon');
});

test('FloatingActionHub places view-mode immediately after audience-filter in array (just above filter in flex-col-reverse)', () => {
  const filterIdx = hubCode.indexOf("id: 'audience-filter'");
  const viewModeIdx = hubCode.indexOf("id: 'view-mode'");

  assert(filterIdx !== -1, 'Must contain audience-filter');
  assert(viewModeIdx !== -1, 'Must contain view-mode');
  assert(viewModeIdx > filterIdx, 'view-mode must be positioned immediately after audience-filter in array');
});

test('FloatingActionHub renders tooltips for view-mode and audience-filter when flyout pill is not open', () => {
  assert(hubCode.includes('title: item.pill ? undefined : item.label'), 'Title must be undefined only when flyout pill is open');
  assert(hubCode.includes('!item.pill && ('), 'Hover tooltip span is rendered when flyout pill is not open');
});

test('FloatingActionHub mounts ViewModeFloatingPill with bottom anchoring and mutual exclusivity', () => {
  assert(hubCode.includes('<ViewModeFloatingPill'), 'Mounts ViewModeFloatingPill');
  assert(hubCode.includes('handleToggleViewMode'), 'Defines handleToggleViewMode');
  assert(hubCode.includes('setIsAudiencePillOpen(false)'), 'Closes audience pill when opening view mode');
});

// -------------------------------------------------------------------------
// SUITE 4: ExploreSubBar & App Integration
// -------------------------------------------------------------------------
console.log('\n--- Suite 4: ExploreSubBar & App Integration ---');

test('ExploreSubBar does NOT contain terminal-cli (removed in favor of exclusive View Mode)', () => {
  assert(!exploreCode.includes("id: 'terminal-cli'"), 'terminal-cli must NOT exist in ExploreSubBar');
  assert(!exploreCode.includes("action: 'toggle-terminal'"), 'toggle-terminal action must NOT exist in ExploreSubBar');
});

test('App.jsx imports and wraps ViewModeProvider', () => {
  assert(appCode.includes("import { ViewModeProvider } from './context/ViewModeContext';"), 'App.jsx must import ViewModeProvider');
  assert(appCode.includes('<ViewModeProvider>'), 'App.jsx must wrap ViewModeProvider');
  assert(appCode.includes('</ViewModeProvider>'), 'App.jsx must close ViewModeProvider');
});

// -------------------------------------------------------------------------
// SUITE 5: ViewModeFloatingPill & ViewModeSubBar Component Architecture
// -------------------------------------------------------------------------
console.log('\n--- Suite 5: ViewModeFloatingPill & ViewModeSubBar Component Architecture ---');

test('ViewModeFloatingPill implements React Portal, dynamic anchor, drag handle, and zero tooltips', () => {
  assert(floatingPillCode.includes('createPortal(pillContent, document.body)'), 'Must render via createPortal into document.body');
  assert(floatingPillCode.includes('view-mode-trigger'), 'Must calculate anchor from view-mode-trigger');
  assert(floatingPillCode.includes('data-drag-handle="true"'), 'Must provide draggable title handle');
  assert(floatingPillCode.includes('RotateCcw'), 'Must provide reset position button');
  assert(!floatingPillCode.includes('title='), 'Must enforce zero native title tooltips on buttons');
});

test('ViewModeSubBar implements accessible keyboard navigation and sound effects', () => {
  assert(subBarCode.includes("role=\"toolbar\""), 'Floating bar must have toolbar role');
  assert(subBarCode.includes("e.key === 'ArrowRight'"), 'Must support ArrowRight');
  assert(subBarCode.includes("e.key === 'ArrowLeft'"), 'Must support ArrowLeft');
  assert(subBarCode.includes("e.key === 'Escape'"), 'Must support Escape to dismiss');
  assert(subBarCode.includes('soundFX?.playChipHover'), 'Must provide chip hover sound');
  assert(subBarCode.includes('soundFX?.playFocusBeep'), 'Must provide selection beep sound');
});

console.log(`\n========================================================================`);
console.log(`TOTAL AUDIT CHECKS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log(`========================================================================`);

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🌟 ALL VIEW MODE INTEGRATION & BEHAVIOR TESTS PASSED 100%! 🌟\n');
}
