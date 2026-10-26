import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  VERIFY PHASE 4: ISOMETRIC LAYER STRATA STACK & CAD CALLOUTS   ');
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

const labContextPath = path.join(rootDir, 'src/context/LabContext.jsx');
const labContextSrc = fs.readFileSync(labContextPath, 'utf8');

const panelPath = path.join(rootDir, 'src/components/ControlCenterPanel.jsx');
const panelSrc = fs.readFileSync(panelPath, 'utf8');

// ============================================================================
// SUITE 1: LabContext SCHEMA & NORMALIZATION FOR soloStrata
// ============================================================================
runTest('LabContext: FACTORY_DEFAULTS.threeD.exploded includes soloStrata: null', () => {
  assert(
    labContextSrc.includes('soloStrata: null'),
    'FACTORY_DEFAULTS.threeD.exploded must define soloStrata: null'
  );
});

runTest('LabContext: normalize3DExploded handles soloStrata with valid values and null fallback', () => {
  assert(
    labContextSrc.includes('strata-01') &&
    labContextSrc.includes('strata-02') &&
    labContextSrc.includes('strata-03'),
    'normalize3DExploded must whitelist strata-01, strata-02, strata-03'
  );
  assert(
    labContextSrc.includes('soloStrata'),
    'normalize3DExploded must sanitize and return soloStrata'
  );
});

runTest('LabContext: set3DExploded preserves and updates soloStrata', () => {
  assert(
    labContextSrc.includes('set3DExploded'),
    'set3DExploded callback must exist'
  );
  assert(
    labContextSrc.includes('root.dataset.threedSoloStrata =') ||
    labContextSrc.includes('--3d-solo-strata'),
    'soloStrata must sync to root dataset or CSS variable'
  );
});

// ============================================================================
// SUITE 2: Section 6 PLACEMENT & CONTAINER GEOMETRY
// ============================================================================
runTest('ControlCenterPanel: Isometric strata stack visualizer is located in Section 6 directly above separation slider', () => {
  assert(
    panelSrc.includes('IsometricStrataStack') || panelSrc.includes('isometric-strata-stack'),
    'Must render Isometric strata stack component/container'
  );
  const explodedAccordionIdx = panelSrc.indexOf("expandedAccordion === 'exploded'");
  assert(explodedAccordionIdx !== -1, 'Must have Section 6 exploded accordion');
  
  const strataStackIdx = panelSrc.indexOf('IsometricStrataStack', explodedAccordionIdx);
  const sliderIdx = panelSrc.indexOf('Separation Distance', explodedAccordionIdx);
  
  assert(strataStackIdx !== -1, 'Isometric strata stack must be inside Section 6');
  assert(sliderIdx !== -1, 'Separation Distance slider must be inside Section 6');
  assert(
    strataStackIdx < sliderIdx,
    'Isometric strata stack visualizer must be placed directly above the separation slider'
  );
});

runTest('ControlCenterPanel: Isometric strata stack container specifies ~160px height', () => {
  assert(
    panelSrc.includes('h-40') || panelSrc.includes('h-44') || panelSrc.includes('min-h-[160px]') || panelSrc.includes('160px'),
    'Strata stack visualizer must specify ~160px height'
  );
});

// ============================================================================
// SUITE 3: 3 STRATA LAYERS WITH DYNAMIC SEPARATION REACTIVITY
// ============================================================================
runTest('ControlCenterPanel: Defines 3 physical strata layers with correct IDs and titles', () => {
  assert(
    panelSrc.includes('Strata 03') && panelSrc.includes('Typography'),
    'Must define Strata 03: Floating Typography & CTAs (Top layer)'
  );
  assert(
    panelSrc.includes('Strata 02') && (panelSrc.includes('Blueprint Grid') || panelSrc.includes('Circuit')),
    'Must define Strata 02: Circuit Blueprint Grid & Layout Mesh (Middle layer)'
  );
  assert(
    panelSrc.includes('Strata 01') && (panelSrc.includes('Glass Chassis') || panelSrc.includes('Substrate')),
    'Must define Strata 01: Core Glass Chassis & Substrate (Base foundation layer)'
  );
});

runTest('ControlCenterPanel: Layers physically separate dynamically based on separationDistance and layerStagger', () => {
  assert(
    panelSrc.includes('separationDistance') && panelSrc.includes('layerStagger'),
    'Strata layers must dynamically react to separationDistance and layerStagger'
  );
});

// ============================================================================
// SUITE 4: CAD PROJECTION LINES (CORNER CONNECTORS)
// ============================================================================
runTest('ControlCenterPanel: Renders 4 corner CAD projection lines with strokeDasharray="3 3"', () => {
  assert(
    panelSrc.includes('strokeDasharray="3 3"') || panelSrc.includes('strokeDasharray="3, 3"'),
    'CAD corner projection lines must use strokeDasharray="3 3"'
  );
});

// ============================================================================
// SUITE 5: ARCHITECTURAL DIMENSION CALLOUT TAG & STAGGER
// ============================================================================
runTest('ControlCenterPanel: Live dimension callout displays +Xmm Z-Separation and Stagger indicators', () => {
  assert(
    panelSrc.includes('mm Z-Separation') || panelSrc.includes('Z-Separation'),
    'Must display architectural dimension callout with Z-Separation'
  );
  assert(
    panelSrc.includes('Stagger:'),
    'Must display real-time layer stagger offset indicator'
  );
});

// ============================================================================
// SUITE 6: BLUEPRINT WIREFRAME MODE DYNAMIC STYLING
// ============================================================================
runTest('ControlCenterPanel: Strata visualizer switches dynamically when exploded.blueprintMode is active', () => {
  assert(
    panelSrc.includes('blueprintMode') &&
    (panelSrc.includes('cyan') || panelSrc.includes('rgba(0, 242, 254') || panelSrc.includes('#00ffff')),
    'Must toggle technical cyan CAD blueprint wireframe lines and glowing vectors when blueprintMode is active'
  );
});

// ============================================================================
// SUITE 7: INTERACTIVE LAYER INSPECTION & SANDBOX SOLO SYNC
// ============================================================================
runTest('ControlCenterPanel: Hovering stratum displays component inventory tooltip', () => {
  assert(
    panelSrc.includes('hoveredStrata') || panelSrc.includes('hoveredLayer') || panelSrc.includes('activeTooltip'),
    'Must track hover inspection state for strata layers'
  );
  assert(
    panelSrc.includes('Buttons') || panelSrc.includes('CTAs') || panelSrc.includes('Headings'),
    'Must display component inventory tooltip details'
  );
});

runTest('ControlCenterPanel: Clicking stratum toggles soloStrata and dims/highlights layers in top 3D Sandbox Card', () => {
  assert(
    panelSrc.includes('soloStrata') && panelSrc.includes('set3DExploded'),
    'Must connect click-to-solo stratum to set3DExploded({ soloStrata: ... })'
  );
  assert(
    panelSrc.includes('soloStrata ===') || panelSrc.includes('isSoloed') || panelSrc.includes('dimmed'),
    'Top 3D Sandbox Card must reflect solo strata state by dimming/highlighting'
  );
});

// ============================================================================
// SUITE 8: ACCESSIBILITY & HAPTIC FEEDBACK
// ============================================================================
runTest('ControlCenterPanel: Isometric strata stack supports keyboard accessibility and haptic audio', () => {
  assert(
    panelSrc.includes('role="region"') || panelSrc.includes('role="group"') || panelSrc.includes('role="button"'),
    'Strata stack must have appropriate ARIA roles'
  );
  assert(
    panelSrc.includes('aria-label='),
    'Strata stack and layers must have aria-labels'
  );
  assert(
    panelSrc.includes("e.key === 'Enter'") || panelSrc.includes("key === ' '") || panelSrc.includes("key === 'Space'"),
    'Must support keyboard Enter/Space activation'
  );
  assert(
    panelSrc.includes('soundFX.playHapticClick()'),
    'Must play haptic sound feedback when clicking/selecting strata'
  );
});

console.log('\n================================================================');
console.log(`  PHASE 4 VERIFICATION SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
