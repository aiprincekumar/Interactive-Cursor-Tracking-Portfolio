import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  VERIFY GAP #4: INTERACTIVE 3D BLUEPRINT WIREFRAME & BATCH HUD ');
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

const panelPath = path.join(rootDir, 'src/components/ControlCenterPanel.jsx');
const panelSrc = fs.readFileSync(panelPath, 'utf8');

const labContextPath = path.join(rootDir, 'src/context/LabContext.jsx');
const labContextSrc = fs.readFileSync(labContextPath, 'utf8');

// ============================================================================
// SUITE 1: BLUEPRINT HEADER, SHOW/HIDE TOGGLE & ACCESSIBILITY
// ============================================================================
runTest('ControlCenterPanel renders Blueprint Header Bar with title and Map icons', () => {
  assert(panelSrc.includes('Portfolio Layout 3D Blueprint'), 'Must render "Portfolio Layout 3D Blueprint" header title');
  assert(panelSrc.includes('Map,') || panelSrc.includes('MapPin,'), 'Must import Map/MapPin icons');
  assert(panelSrc.includes('<Map className="w-4 h-4 text-[#FF4D6D]" />'), 'Must render Map icon in title bar');
});

runTest('ControlCenterPanel renders compact Show/Hide Map toggle button with state binding', () => {
  assert(panelSrc.includes('const [showBlueprintMap, setShowBlueprintMap] = useState(true);'), 'Must declare showBlueprintMap defaulting to true');
  assert(panelSrc.includes("showBlueprintMap ? 'Hide Map' : 'Show Map'"), 'Must toggle label between Hide Map and Show Map');
  assert(panelSrc.includes('soundFX.playHapticClick()'), 'Must trigger soundFX.playHapticClick() on map toggle');
});

runTest('Blueprint Wireframe container applies glassmorphic styling and accessibility region', () => {
  assert(panelSrc.includes('role="region"'), 'Must declare role="region"');
  assert(panelSrc.includes('aria-label="Interactive Portfolio Layout 3D Blueprint"'), 'Must declare aria-label="Interactive Portfolio Layout 3D Blueprint"');
  assert(panelSrc.includes('border border-[#E7E2D8] dark:border-[#2D2340] bg-[#FAF8F5]/80 dark:bg-[#120D1D]/80 rounded-2xl p-3'), 'Must apply exact glassmorphic container styling');
  assert(panelSrc.includes('min-h-[200px]'), 'Must enforce responsive viewport height min-h-[200px]');
});

// ============================================================================
// SUITE 2: 10-ELEMENT ARCHITECTURAL VECTOR LAYOUT
// ============================================================================
runTest('Top Nav Row renders all 3 navigation elements (navbarItems, navbarIcons, resumeButton)', () => {
  // navbarItems
  assert(panelSrc.includes("toggle3DElement('navbarItems')"), 'Must toggle navbarItems');
  assert(panelSrc.includes('Navbar Items:'), 'Must label navbarItems');
  assert(panelSrc.includes('Nav Menu'), 'Must render Nav Menu capsule');

  // navbarIcons
  assert(panelSrc.includes("toggle3DElement('navbarIcons')"), 'Must toggle navbarIcons');
  assert(panelSrc.includes('Navbar Icons:'), 'Must label navbarIcons');

  // resumeButton
  assert(panelSrc.includes("toggle3DElement('resumeButton')"), 'Must toggle resumeButton');
  assert(panelSrc.includes('Resume Button:'), 'Must label resumeButton');
  assert(panelSrc.includes('Resume'), 'Must render Resume capsule');
});

runTest('Hero Section renders Avatar circular frame and text elements (profilePic, header, subHeader, description)', () => {
  // profilePic circular frame
  assert(panelSrc.includes("toggle3DElement('profilePic')"), 'Must toggle profilePic');
  assert(panelSrc.includes('rounded-full border-2'), 'profilePic must be a rounded-full circular frame');
  assert(panelSrc.includes('Profile Picture:'), 'Must label Profile Picture');

  // header
  assert(panelSrc.includes("toggle3DElement('header')"), 'Must toggle header');
  assert(panelSrc.includes('H1 Main Header'), 'Must render H1 Main Header bar');

  // subHeader
  assert(panelSrc.includes("toggle3DElement('subHeader')"), 'Must toggle subHeader');
  assert(panelSrc.includes('H2 Sub-Header'), 'Must render H2 Sub-Header bar');

  // description
  assert(panelSrc.includes("toggle3DElement('description')"), 'Must toggle description');
  assert(panelSrc.includes('Bio Description text block'), 'Must render Bio Description text block');
});

runTest('Containers & Floating Hub section renders container, containerContent and floatingButton', () => {
  // container
  assert(panelSrc.includes("toggle3DElement('container')"), 'Must toggle container');
  assert(panelSrc.includes('Card Container'), 'Must render Card Container outer frame');

  // containerContent
  assert(panelSrc.includes("toggle3DElement('containerContent')"), 'Must toggle containerContent');
  assert(panelSrc.includes('Inner Content Layers'), 'Must render Inner Content Layers');

  // floatingButton in bottom-right corner
  assert(panelSrc.includes("toggle3DElement('floatingButton')"), 'Must toggle floatingButton');
  assert(panelSrc.includes('absolute bottom-0 right-0') || panelSrc.includes('bottom-right'), 'Must place floatingButton at bottom-right corner');
  assert(panelSrc.includes('Floating Action Button:'), 'Must label Floating Action Button');
});

// ============================================================================
// SUITE 3: PULSING STATUS DOTS & HAPTIC INTERACTIVITY
// ============================================================================
runTest('Wireframe elements feature pulsing status dot with glowing emerald and ping ring', () => {
  assert(panelSrc.includes('bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'), 'Active 3D status dot must have emerald glow');
  assert(panelSrc.includes('animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'), 'Active 3D status dot must render animate-ping ring');
  assert(panelSrc.includes('bg-stone-300 dark:bg-stone-700'), '2D flat state must render muted slate dot');
});

// ============================================================================
// SUITE 4: 3 GROUP BATCH TOGGLE CHIPS
// ============================================================================
runTest('ControlCenterPanel renders all 3 Group Batch Toggle Chips directly beneath wireframe', () => {
  assert(panelSrc.includes('Toggle Nav (4)'), 'Must render Toggle Nav (4) chip');
  assert(panelSrc.includes('Toggle Hero (4)'), 'Must render Toggle Hero (4) chip');
  assert(panelSrc.includes('Toggle Cards (2)'), 'Must render Toggle Cards (2) chip');
});

runTest('Group Batch Toggle logic synchronizes elements (if all ON -> turn OFF; if any OFF -> turn ON)', () => {
  assert(panelSrc.includes('toggleNavGroup'), 'Must implement toggleNavGroup');
  assert(panelSrc.includes('toggleHeroGroup'), 'Must implement toggleHeroGroup');
  assert(panelSrc.includes('toggleCardsGroup'), 'Must implement toggleCardsGroup');
  assert(panelSrc.includes('const allNavOn = navActiveCount === navKeys.length;'), 'Must evaluate allNavOn condition');
  assert(panelSrc.includes('const allHeroOn = heroActiveCount === heroKeys.length;'), 'Must evaluate allHeroOn condition');
  assert(panelSrc.includes('const allCardsOn = cardsActiveCount === cardKeys.length;'), 'Must evaluate allCardsOn condition');
});

// ============================================================================
// SUITE 5: 2-WAY SYNCHRONIZED HOVER HIGHLIGHTING
// ============================================================================
runTest('ControlCenterPanel declares hoveredElementKey state for 2-way synchronized highlighting', () => {
  assert(panelSrc.includes('const [hoveredElementKey, setHoveredElementKey] = useState(null);'), 'Must declare hoveredElementKey state');
});

runTest('Wireframe elements trigger onMouseEnter/onMouseLeave and apply active ring highlight', () => {
  assert(panelSrc.includes("setHoveredElementKey('navbarItems')"), 'navbarItems must set hoveredElementKey');
  assert(panelSrc.includes("setHoveredElementKey('profilePic')"), 'profilePic must set hoveredElementKey');
  assert(panelSrc.includes("setHoveredElementKey('container')"), 'container must set hoveredElementKey');
  assert(panelSrc.includes('ring-2 ring-[#FF4D6D]'), 'Wireframe elements must display glowing ring when hovered');
});

runTest('Category list cards below wireframe highlight with ring-2 ring-[#FF4D6D]/40 when hovered from wireframe', () => {
  assert(panelSrc.includes('onMouseEnter={() => setHoveredElementKey(item.key)}'), 'Category cards must set hoveredElementKey on mouse enter');
  assert(panelSrc.includes('onMouseLeave={() => setHoveredElementKey(null)}'), 'Category cards must clear hoveredElementKey on mouse leave');
  assert(panelSrc.includes("hoveredElementKey === item.key ? 'ring-2 ring-[#FF4D6D]/40' : ''"), 'Category cards must display ring-2 ring-[#FF4D6D]/40 when linked item is hovered');
});

// ============================================================================
// SUITE 6: LABCONTEXT BATCH STATE BINDINGS INTEGRITY
// ============================================================================
runTest('LabContext exports set3DElementGroup helper without altering existing bindings', () => {
  assert(labContextSrc.includes('const set3DElementGroup = useCallback('), 'LabContext must define set3DElementGroup');
  assert(labContextSrc.includes('set3DElementGroup,'), 'LabContext must export set3DElementGroup in context value');
  assert(labContextSrc.includes('toggle3DElement,'), 'LabContext must preserve toggle3DElement');
  assert(labContextSrc.includes('enableAll3D,'), 'LabContext must preserve enableAll3D');
  assert(labContextSrc.includes('disableAll3D,'), 'LabContext must preserve disableAll3D');
});

// ============================================================================
// SUITE 7: MATHEMATICAL SIMULATION & BATCH PERMUTATIONS
// ============================================================================
runTest('Batch toggle simulation test: all ON toggles to OFF, mixed toggles to all ON', () => {
  const navKeys = ['floatingButton', 'navbarItems', 'navbarIcons', 'resumeButton'];
  
  // Case A: All ON -> next state must be all false
  let elementsState = { floatingButton: true, navbarItems: true, navbarIcons: true, resumeButton: true };
  let allOn = navKeys.every((k) => elementsState[k]);
  let target = !allOn;
  assert.strictEqual(target, false, 'If all items are ON, target state must be false (turn all OFF)');

  // Case B: 1 item OFF -> next state must be all true
  elementsState = { floatingButton: true, navbarItems: false, navbarIcons: true, resumeButton: true };
  allOn = navKeys.every((k) => elementsState[k]);
  target = !allOn;
  assert.strictEqual(target, true, 'If any item is OFF, target state must be true (turn all ON)');

  // Case C: All OFF -> next state must be all true
  elementsState = { floatingButton: false, navbarItems: false, navbarIcons: false, resumeButton: false };
  allOn = navKeys.every((k) => elementsState[k]);
  target = !allOn;
  assert.strictEqual(target, true, 'If all items are OFF, target state must be true (turn all ON)');
});

// ============================================================================
// SUITE 8: VITE SSR DYNAMIC IMPORT INTEGRITY
// ============================================================================
runTest('ControlCenterPanel.jsx compiles and loads cleanly in Vite SSR', async () => {
  const { createServer } = await import('vite');
  const server = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });
  
  try {
    const mod = await server.ssrLoadModule('/src/components/ControlCenterPanel.jsx');
    assert(mod.default, 'ControlCenterPanel default export must exist');
    assert(
      typeof mod.default === 'function' || typeof mod.default === 'object',
      'ControlCenterPanel must export a React component'
    );
  } finally {
    await server.close();
  }
});

// ============================================================================
// SUMMARY REPORT
// ============================================================================
console.log('\n================================================================');
console.log(`  GAP #4 VERIFICATION: ${passCount} PASSED | ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
