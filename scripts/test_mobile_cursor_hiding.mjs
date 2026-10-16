import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

const rootDir = process.cwd();

console.log('=== MOBILE & TOUCH CURSOR HIDING VERIFICATION TEST ===\n');

// ---------------------------------------------------------
// 1. Static File Verification
// ---------------------------------------------------------
const hookPath = path.join(rootDir, 'src', 'hooks', 'useDesktopCursorSupport.js');
const navbarPath = path.join(rootDir, 'src', 'components', 'Navbar.jsx');
const commandPalettePath = path.join(rootDir, 'src', 'components', 'CommandPalette.jsx');
const indexCssPath = path.join(rootDir, 'src', 'index.css');
const searchCatalogPath = path.join(rootDir, 'src', 'utils', 'searchCatalog.js');
const playgroundPath = path.join(rootDir, 'src', 'components', 'InteractivePlayground.jsx');

assert(fs.existsSync(hookPath), 'src/hooks/useDesktopCursorSupport.js must exist');
assert(fs.existsSync(navbarPath), 'src/components/Navbar.jsx must exist');
assert(fs.existsSync(commandPalettePath), 'src/components/CommandPalette.jsx must exist');
assert(fs.existsSync(indexCssPath), 'src/index.css must exist');
assert(fs.existsSync(searchCatalogPath), 'src/utils/searchCatalog.js must exist');
assert(fs.existsSync(playgroundPath), 'src/components/InteractivePlayground.jsx must exist');
console.log('[PASS] All expected source files exist.');

// ---------------------------------------------------------
// 2. CSS Media Query Verification
// ---------------------------------------------------------
const cssContent = fs.readFileSync(indexCssPath, 'utf-8');
assert(cssContent.includes('.desktop-cursor-only'), 'CSS must define .desktop-cursor-only class');
assert(cssContent.includes('max-width: 1023px'), 'CSS must include max-width: 1023px media condition');
assert(cssContent.includes('pointer: coarse'), 'CSS must include pointer: coarse media condition');
assert(cssContent.includes('hover: none'), 'CSS must include hover: none media condition');
assert(cssContent.includes('display: none !important'), 'CSS must apply display: none !important for .desktop-cursor-only');
console.log('[PASS] index.css has robust dual-detection media queries (max-width: 1023px, pointer: coarse, hover: none).');

// ---------------------------------------------------------
// 3. checkDesktopCursorSupport Logic Simulation Tests
// ---------------------------------------------------------
const hookModule = await import('../src/hooks/useDesktopCursorSupport.js');
const { checkDesktopCursorSupport } = hookModule;

// Helper to simulate window and matchMedia environments
function simulateEnvironment({ width, isCoarse, isHoverNone, isFine, isHover }) {
  globalThis.window = {
    innerWidth: width,
    matchMedia: (query) => {
      let matches = false;
      if (query === '(pointer: coarse)') matches = Boolean(isCoarse);
      if (query === '(hover: none)') matches = Boolean(isHoverNone);
      if (query === '(pointer: fine)') matches = Boolean(isFine);
      if (query === '(hover: hover)') matches = Boolean(isHover);
      return { matches, addEventListener: () => {}, removeEventListener: () => {} };
    }
  };
  return checkDesktopCursorSupport();
}

// Case A: Mobile Phone Portrait (iPhone 14 / Pixel: 390px, coarse, hover: none)
const phonePortrait = simulateEnvironment({ width: 390, isCoarse: true, isHoverNone: true, isFine: false, isHover: false });
assert.strictEqual(phonePortrait, false, 'Mobile phone in portrait must return false');
console.log('[PASS] Mobile phone portrait (< 1024px, coarse) correctly detected as touch/no cursor.');

// Case B: Mobile Phone Landscape (iPhone landscape: 844px, coarse, hover: none)
const phoneLandscape = simulateEnvironment({ width: 844, isCoarse: true, isHoverNone: true, isFine: false, isHover: false });
assert.strictEqual(phoneLandscape, false, 'Mobile phone in landscape (< 1024px) must return false');
console.log('[PASS] Mobile phone landscape (< 1024px) correctly detected as touch/no cursor.');

// Case C: Tablet Portrait (iPad 10.2": 768px, coarse, hover: none)
const tabletPortrait = simulateEnvironment({ width: 768, isCoarse: true, isHoverNone: true, isFine: false, isHover: false });
assert.strictEqual(tabletPortrait, false, 'Tablet in portrait must return false');
console.log('[PASS] Tablet portrait (< 1024px, coarse) correctly detected as touch/no cursor.');

// Case D: Tablet Landscape (iPad Pro 12.9": 1366px >= 1024px, coarse, hover: none)
const tabletLandscape = simulateEnvironment({ width: 1366, isCoarse: true, isHoverNone: true, isFine: false, isHover: false });
assert.strictEqual(tabletLandscape, false, 'Tablet in landscape with coarse pointer must return false');
console.log('[PASS] Tablet landscape (>= 1024px with coarse/hover:none) correctly detected as touch/no cursor.');

// Case E: Desktop Browser with Mouse (1440px, pointer: fine, hover: hover, coarse: false)
const desktopBrowser = simulateEnvironment({ width: 1440, isCoarse: false, isHoverNone: false, isFine: true, isHover: true });
assert.strictEqual(desktopBrowser, true, 'Desktop browser with fine pointer & hover must return true');
console.log('[PASS] Desktop browser (>= 1024px, pointer: fine, hover: hover) correctly retains cursor controls.');

// Case F: Smart TV Browser with Air-Mouse / Pointer Remote (1920px, pointer: fine, hover: hover)
const tvBrowser = simulateEnvironment({ width: 1920, isCoarse: false, isHoverNone: false, isFine: true, isHover: true });
assert.strictEqual(tvBrowser, true, 'TV browser with air-mouse must return true');
console.log('[PASS] TV browser with air-mouse (1920px, pointer: fine, hover: hover) correctly retains cursor controls.');

// Cleanup simulated window
delete globalThis.window;

// ---------------------------------------------------------
// 4. Navbar Component Audit
// ---------------------------------------------------------
const navbarContent = fs.readFileSync(navbarPath, 'utf-8');
assert(navbarContent.includes('useDesktopCursorSupport'), 'Navbar must import and use useDesktopCursorSupport');
assert(navbarContent.includes('desktop-cursor-only'), 'Navbar must include desktop-cursor-only CSS class on cursor button');
assert(navbarContent.includes('hidden lg:flex'), 'Navbar cursor button must use hidden lg:flex for instant CLS-free hiding');
assert(navbarContent.includes('{isDesktopCursor && ('), 'Navbar cursor button must be conditionally guarded by isDesktopCursor');
assert(navbarContent.includes('{isDesktopCursor && isRibbonOpen && ('), 'CursorSelectorRibbon must be guarded by isDesktopCursor && isRibbonOpen');
assert(navbarContent.includes('isDesktopCursor={isDesktopCursor}'), 'Navbar must pass isDesktopCursor to CommandPalette');
console.log('[PASS] Navbar.jsx implements all required hybrid CSS & React guardrails for cursor selector & ribbon.');

// ---------------------------------------------------------
// 5. CommandPalette Component Audit
// ---------------------------------------------------------
const cpContent = fs.readFileSync(commandPalettePath, 'utf-8');
assert(cpContent.includes('useDesktopCursorSupport'), 'CommandPalette must import and use useDesktopCursorSupport');
assert(cpContent.includes('isDesktopCursor'), 'CommandPalette must handle isDesktopCursor prop or state');
assert(cpContent.includes('act-cursor-playground'), 'CommandPalette must filter out act-cursor-playground on touch devices');
assert(cpContent.includes('!item.desktopOnly'), 'CommandPalette must filter out desktopOnly tagged items on touch devices');
console.log('[PASS] CommandPalette.jsx filters cursor customization actions on touch/mobile devices.');

// ---------------------------------------------------------
// 6. Search Catalog & Sections Integrity
// ---------------------------------------------------------
const catalogModule = await import('../src/utils/searchCatalog.js');
const { SEARCH_ITEMS } = catalogModule;
const cursorAction = SEARCH_ITEMS.find((i) => i.id === 'act-cursor-playground');
const labSection = SEARCH_ITEMS.find((i) => i.id === 'sec-playground');

assert(cursorAction, 'act-cursor-playground must exist in searchCatalog');
assert.strictEqual(cursorAction.desktopOnly, true, 'act-cursor-playground must be tagged with desktopOnly: true');
assert(labSection, 'sec-playground (Physics Lab section) must exist in searchCatalog');
assert(labSection.targetId === 'playground', 'sec-playground must target playground');
assert(!labSection.desktopOnly, 'sec-playground must NOT be desktopOnly so it remains searchable');
console.log('[PASS] Search catalog metadata verified: act-cursor-playground is desktopOnly, sec-playground remains accessible.');

// ---------------------------------------------------------
// 7. InteractivePlayground Section Integrity
// ---------------------------------------------------------
const playgroundContent = fs.readFileSync(playgroundPath, 'utf-8');
assert(playgroundContent.includes('id="playground"'), 'InteractivePlayground must keep id="playground" intact');
assert(playgroundContent.includes('Butterfly & Camera Physics Lab'), 'InteractivePlayground title must remain intact');
console.log('[PASS] InteractivePlayground (Physics Lab) is preserved in place as agreed.');

console.log('\n=== ALL 7 MOBILE & TOUCH CURSOR HIDING VERIFICATION CHECKS PASSED (100%) ===');
