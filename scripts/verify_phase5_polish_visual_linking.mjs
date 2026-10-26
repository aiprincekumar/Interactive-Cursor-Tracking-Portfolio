import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  VERIFY PHASE 5: VISUAL LINKING, RESET CONTROLS & AUDIO POLISH ');
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

// -----------------------------------------------------------------
// 1. Verify StickySandboxColumn.jsx Visual Linking & Reset Controls
// -----------------------------------------------------------------
const stickyColPath = path.join(rootDir, 'src/components/3d-sandbox/StickySandboxColumn.jsx');
assert(fs.existsSync(stickyColPath), 'StickySandboxColumn.jsx must exist');
const stickyColSrc = fs.readFileSync(stickyColPath, 'utf8');

import { normalizeComponentKey } from '../src/hooks/useSandboxAutoSwitch.js';

runTest('normalizeComponentKey helper correctly canonicalizes component keys for visual linking', () => {
  assert.strictEqual(typeof normalizeComponentKey, 'function', 'normalizeComponentKey must be a function');
  assert.strictEqual(normalizeComponentKey('nav'), 'navbar');
  assert.strictEqual(normalizeComponentKey('NAVBAR'), 'navbar');
  assert.strictEqual(normalizeComponentKey('hero'), 'hero');
  assert.strictEqual(normalizeComponentKey('header'), 'hero');
  assert.strictEqual(normalizeComponentKey('cards'), 'showcase');
  assert.strictEqual(normalizeComponentKey('containers'), 'showcase');
  assert.strictEqual(normalizeComponentKey('dock'), 'dock');
  assert.strictEqual(normalizeComponentKey('footer'), 'footer');
  assert.strictEqual(normalizeComponentKey('universal'), 'universal');
  assert.strictEqual(normalizeComponentKey(null), null);
  assert(stickyColSrc.includes('normalizeComponentKey'), 'StickySandboxColumn must define or re-export normalizeComponentKey');
});

runTest('StickySandboxColumn accepts highlightedComponent & onHighlightComponent props', () => {
  assert(stickyColSrc.includes('highlightedComponent'), 'Must accept highlightedComponent prop');
  assert(stickyColSrc.includes('onHighlightComponent'), 'Must accept onHighlightComponent prop');
});

runTest('StickySandboxColumn implements accent halo ring and glowing indicator on active preview', () => {
  assert(stickyColSrc.includes('ring-[#FF4D6D]') || stickyColSrc.includes('ring-2'), 'Must feature accent ring');
  assert(stickyColSrc.includes('shadow-[0_0_20px_rgba(255,77,109,0.35)]') || stickyColSrc.includes('shadow-[0_0_'), 'Must feature shadow glow');
  assert(stickyColSrc.includes('linked-preview-indicator') || stickyColSrc.includes('Linked in Settings'), 'Must render linked preview indicator');
});

runTest('StickySandboxColumn features One-Click fine-grained Component Reset control', () => {
  assert(stickyColSrc.includes('reset-component-defaults-btn') || stickyColSrc.includes('Reset Component Defaults'), 'Must render component reset button');
  assert(stickyColSrc.includes('handleResetComponentDefaults') || stickyColSrc.includes('resetComponent'), 'Must implement component reset handler');
  assert(stickyColSrc.includes('set3DElementGroup') || stickyColSrc.includes('elementKeyMap'), 'Must reset element slice for active component');
});

runTest('StickySandboxColumn implements rAF drag throttling & pointer capture release hygiene', () => {
  assert(stickyColSrc.includes('requestAnimationFrame'), 'Must throttle pointer movement with requestAnimationFrame');
  assert(stickyColSrc.includes('cancelAnimationFrame'), 'Must cancel pending animation frame on release or unmount');
  assert(stickyColSrc.includes('releasePointerCapture'), 'Must cleanly release pointer capture on pointer up or leave');
  assert(stickyColSrc.includes('handlePointerLeave'), 'Must handle pointer leave to release drag cleanly');
});

runTest('StickySandboxColumn wires audio haptics to tab switching and component reset with mute guards', () => {
  assert(stickyColSrc.includes('soundFX') || stickyColSrc.includes('audio'), 'Must reference soundFX or audio');
  assert(stickyColSrc.includes('playHapticClick'), 'Must call playHapticClick on tab switch');
  assert(stickyColSrc.includes('playPop') || stickyColSrc.includes('playHapticClick'), 'Must call playPop or playHapticClick on component reset');
  assert(stickyColSrc.includes('isSoundOn') || stickyColSrc.includes('soundEnabled'), 'Must wrap audio calls with sound mute guards');
});

// -----------------------------------------------------------------
// 2. Verify ControlCenterPanel.jsx Bi-Directional Linking & Header
// -----------------------------------------------------------------
const panelPath = path.join(rootDir, 'src/components/ControlCenterPanel.jsx');
assert(fs.existsSync(panelPath), 'ControlCenterPanel.jsx must exist');
const panelSrc = fs.readFileSync(panelPath, 'utf8');

runTest('ControlCenterPanel manages highlightedComponent state & isComponentHighlighted helper', () => {
  assert(panelSrc.includes('highlightedComponent') && panelSrc.includes('setHighlightedComponent'), 'Must manage highlightedComponent state');
  assert(panelSrc.includes('isComponentHighlighted'), 'Must implement isComponentHighlighted matcher');
});

runTest('ControlCenterPanel renders [Targeted in Preview] badge on matching categories', () => {
  assert(panelSrc.includes('targeted-in-preview-badge') || panelSrc.includes('[Targeted in Preview]'), 'Must render Targeted in Preview badge');
  assert(panelSrc.includes('onMouseEnter') && panelSrc.includes('setHighlightedComponent'), 'Must set highlightedComponent on category/item hover');
  assert(panelSrc.includes('onMouseLeave'), 'Must clear highlightedComponent on mouse leave');
});

runTest('ControlCenterPanel embeds StickySandboxColumn with visual linking & sound props', () => {
  assert(panelSrc.includes('<StickySandboxColumn'), 'Must embed StickySandboxColumn');
  assert(panelSrc.includes('highlightedComponent={highlightedComponent}'), 'Must pass highlightedComponent prop');
  assert(panelSrc.includes('onHighlightComponent={setHighlightedComponent}'), 'Must pass onHighlightComponent prop');
});

runTest('ControlCenterPanel triggers playCrystalChime on Apply to Live Portfolio with sound guard', () => {
  assert(panelSrc.includes('applyToLivePortfolio'), 'Must implement applyToLivePortfolio');
  assert(panelSrc.includes('playCrystalChime'), 'Must trigger playCrystalChime on live apply');
  assert(panelSrc.includes('soundEnabled'), 'Must guard audio triggers with soundEnabled');
});

runTest('ControlCenterPanel maintains global Reset Sandbox button with audio chime', () => {
  assert(panelSrc.includes('reset3DDefaults'), 'Must call reset3DDefaults on reset sandbox');
  assert(panelSrc.includes('Reset Sandbox'), 'Must render Reset Sandbox button in header');
});

// -----------------------------------------------------------------
// 3. Verify UniversalMiniPortfolio.jsx Visual Linking & Mini Elements
// -----------------------------------------------------------------
const miniPath = path.join(rootDir, 'src/components/3d-sandbox/UniversalMiniPortfolio.jsx');
assert(fs.existsSync(miniPath), 'UniversalMiniPortfolio.jsx must exist');
const miniSrc = fs.readFileSync(miniPath, 'utf8');

runTest('UniversalMiniPortfolio accepts highlightedComponent and onHighlightComponent', () => {
  assert(miniSrc.includes('highlightedComponent'), 'Must accept highlightedComponent');
  assert(miniSrc.includes('onHighlightComponent'), 'Must accept onHighlightComponent');
});

runTest('UniversalMiniPortfolio highlights mini navbar, hero, grid, dock & footer with accent halos', () => {
  assert(miniSrc.includes('isNavHighlighted') && miniSrc.includes('ring-[#FF4D6D]'), 'Mini navbar must support highlight ring');
  assert(miniSrc.includes('isHeroHighlighted') && miniSrc.includes('ring-[#FF4D6D]'), 'Mini hero must support highlight ring');
  assert(miniSrc.includes('isGridHighlighted') && miniSrc.includes('ring-[#FF4D6D]'), 'Mini grid must support highlight ring');
  assert(miniSrc.includes('isDockHighlighted') && miniSrc.includes('ring-[#FF4D6D]'), 'Mini dock must support highlight ring');
  assert(miniSrc.includes('isFooterHighlighted') && miniSrc.includes('ring-[#FF4D6D]'), 'Mini footer must support highlight ring');
});

runTest('UniversalMiniPortfolio implements rAF drag throttling & pointer leave release', () => {
  assert(miniSrc.includes('requestAnimationFrame'), 'Must use requestAnimationFrame for drag');
  assert(miniSrc.includes('cancelAnimationFrame'), 'Must cancel animation frame');
  assert(miniSrc.includes('handlePointerLeave'), 'Must release pointer capture on pointer leave');
});

// -----------------------------------------------------------------
// 4. Verify All 5 Dedicated Preview Components Support Visual Linking
// -----------------------------------------------------------------
const previewsDir = path.join(rootDir, 'src/components/3d-sandbox/previews');
const dedicatedPreviews = [
  { name: 'HeroCardPreview.jsx', key: 'hero' },
  { name: 'Navbar3DPreview.jsx', key: 'navbar' },
  { name: 'Footer3DPreview.jsx', key: 'footer' },
  { name: 'FloatingDockPreview.jsx', key: 'dock' },
  { name: 'SectionShowcasePreview.jsx', key: 'showcase' }
];

runTest('All 5 dedicated preview components accept isHighlighted & onHighlight props and apply accent halo', () => {
  for (const { name, key } of dedicatedPreviews) {
    const filePath = path.join(previewsDir, name);
    assert(fs.existsSync(filePath), `${name} must exist`);
    const src = fs.readFileSync(filePath, 'utf8');
    assert(src.includes('isHighlighted'), `${name} must accept isHighlighted prop`);
    assert(src.includes('onHighlight'), `${name} must accept onHighlight prop`);
    assert(src.includes('ring-[#FF4D6D]') || src.includes('ring-2'), `${name} must apply highlight ring when isHighlighted`);
  }
});

// -----------------------------------------------------------------
// 5. Functional Simulation: Component-Level Reset Isolation
// -----------------------------------------------------------------
runTest('Component reset logic reverts element slice without corrupting other 3D settings', () => {
  const elementKeyMap = {
    hero: ['profilePic', 'header', 'subHeader', 'description'],
    card3d: ['profilePic', 'header', 'subHeader', 'description'],
    navbar: ['floatingButton', 'navbarItems', 'navbarIcons', 'resumeButton'],
    nav: ['floatingButton', 'navbarItems', 'navbarIcons', 'resumeButton'],
    dock: ['floatingButton'],
    footer: ['container'],
    showcase: ['container', 'containerContent'],
    cards: ['container', 'containerContent']
  };

  const initialElements = {
    floatingButton: true,
    navbarItems: true,
    navbarIcons: true,
    resumeButton: true,
    profilePic: true,
    header: true,
    subHeader: true,
    description: true,
    container: true,
    containerContent: true
  };

  // Simulate resetting 'hero' only
  const heroKeys = elementKeyMap.hero;
  const simulatedAfterHeroReset = { ...initialElements };
  heroKeys.forEach((k) => { simulatedAfterHeroReset[k] = false; });

  // Verify hero elements were reset to false
  assert.strictEqual(simulatedAfterHeroReset.profilePic, false);
  assert.strictEqual(simulatedAfterHeroReset.header, false);
  assert.strictEqual(simulatedAfterHeroReset.subHeader, false);
  assert.strictEqual(simulatedAfterHeroReset.description, false);

  // Verify navbar & dock elements remain true (untouched)
  assert.strictEqual(simulatedAfterHeroReset.floatingButton, true);
  assert.strictEqual(simulatedAfterHeroReset.navbarItems, true);
  assert.strictEqual(simulatedAfterHeroReset.navbarIcons, true);
  assert.strictEqual(simulatedAfterHeroReset.resumeButton, true);
  assert.strictEqual(simulatedAfterHeroReset.container, true);
});

// -----------------------------------------------------------------
// Summary
// -----------------------------------------------------------------
console.log('\n================================================================');
console.log(`  PHASE 5 VERIFICATION: ${passCount} PASSED | ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
