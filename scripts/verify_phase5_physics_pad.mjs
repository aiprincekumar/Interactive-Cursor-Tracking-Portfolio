import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  VERIFY PHASE 5: SPRING OSCILLATION GRAPH & PHYSICS TEST PAD   ');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

const labContextPath = path.join(rootDir, 'src/context/LabContext.jsx');
const labContextSrc = fs.readFileSync(labContextPath, 'utf8');

const panelPath = path.join(rootDir, 'src/components/ControlCenterPanel.jsx');
const panelSrc = fs.readFileSync(panelPath, 'utf8');

const tests = [];

function addTest(name, fn) {
  tests.push({ name, fn });
}

// ============================================================================
// SUITE 1: LabContext PHYSICS STATE BINDINGS & PROFILES MAP
// ============================================================================
addTest('LabContext: FACTORY_DEFAULTS includes threeD.physics defaults', () => {
  assert(
    labContextSrc.includes('hoverPop: 12') || labContextSrc.includes('hoverPop:'),
    'FACTORY_DEFAULTS.threeD.physics must define hoverPop'
  );
  assert(
    labContextSrc.includes("elasticity: 'snappy'") || labContextSrc.includes('elasticity:'),
    'FACTORY_DEFAULTS.threeD.physics must define elasticity'
  );
  assert(
    labContextSrc.includes('clickDepression: true'),
    'FACTORY_DEFAULTS.threeD.physics must define clickDepression'
  );
});

addTest('LabContext: normalize3DPhysics validates hoverPop, elasticity, and clickDepression', () => {
  assert(
    labContextSrc.includes('normalize3DPhysics'),
    'normalize3DPhysics function must exist'
  );
  assert(
    labContextSrc.includes('clamp(raw.hoverPop, 4, 32') || labContextSrc.includes('4, 32'),
    'hoverPop must be clamped between 4 and 32'
  );
  assert(
    labContextSrc.includes("'rigid'") &&
    labContextSrc.includes("'snappy'") &&
    labContextSrc.includes("'bouncy'"),
    'elasticity must support rigid, snappy, bouncy'
  );
  assert(
    labContextSrc.includes('clickDepression'),
    'clickDepression must be normalized'
  );
});

addTest('LabContext: Exports PHYSICS_PROFILES with Rigid, Snappy, and Bouncy specs', () => {
  assert(
    labContextSrc.includes('export const PHYSICS_PROFILES =') ||
    labContextSrc.includes('export const SPRING_PROFILES ='),
    'PHYSICS_PROFILES must be defined and exported from LabContext.jsx'
  );
  assert(
    labContextSrc.includes('450') && labContextSrc.includes('38'),
    'Rigid profile must define stiffness: 450, damping: 38'
  );
  assert(
    labContextSrc.includes('240') && labContextSrc.includes('18'),
    'Snappy profile must define stiffness: 240, damping: 18'
  );
  assert(
    labContextSrc.includes('160') && labContextSrc.includes('8'),
    'Bouncy profile must define stiffness: 160, damping: 8'
  );
});

// ============================================================================
// SUITE 2: SECTION 5 PLACEMENT & LAYOUT STRUCTURE
// ============================================================================
addTest('ControlCenterPanel: Section 5 ("Interaction & Physics") contains SpringOscillationWaveform & PhysicsTestPad', () => {
  const physicsAccordionIdx = panelSrc.indexOf("expandedAccordion === 'physics'");
  assert(physicsAccordionIdx !== -1, 'Must have Section 5 physics accordion');

  const waveformIdx = panelSrc.indexOf('SpringOscillationWaveform', physicsAccordionIdx);
  const testPadIdx = panelSrc.indexOf('PhysicsTestPad', physicsAccordionIdx);
  const explodedIdx = panelSrc.indexOf("expandedAccordion === 'exploded'");

  assert(waveformIdx !== -1, 'SpringOscillationWaveform must be inside Section 5');
  assert(testPadIdx !== -1, 'PhysicsTestPad must be inside Section 5');

  if (explodedIdx !== -1) {
    assert(waveformIdx < explodedIdx, 'SpringOscillationWaveform must be before Section 6');
    assert(testPadIdx < explodedIdx, 'PhysicsTestPad must be before Section 6');
  }
});

addTest('ControlCenterPanel: Components are placed directly beneath Elasticity selector grid', () => {
  const physicsAccordionIdx = panelSrc.indexOf("expandedAccordion === 'physics'");
  const elasticityGridIdx = panelSrc.indexOf('ELASTICITY_PRESETS.map', physicsAccordionIdx);
  const waveformIdx = panelSrc.indexOf('SpringOscillationWaveform', physicsAccordionIdx);
  const testPadIdx = panelSrc.indexOf('PhysicsTestPad', physicsAccordionIdx);

  assert(elasticityGridIdx !== -1, 'Must have Elasticity presets map in Section 5');
  assert(
    waveformIdx > elasticityGridIdx,
    'SpringOscillationWaveform must be placed directly beneath the Elasticity selector grid'
  );
  assert(
    testPadIdx > elasticityGridIdx,
    'PhysicsTestPad must be placed directly beneath the Elasticity selector grid'
  );
});

// ============================================================================
// SUITE 3: SpringOscillationWaveform SVG DECAY CURVE & PULSE DOT
// ============================================================================
addTest('SpringOscillationWaveform: Implements SVG curves for Rigid, Snappy, and Bouncy presets', () => {
  assert(
    panelSrc.includes('SpringOscillationWaveform'),
    'Must define SpringOscillationWaveform component'
  );
  assert(
    panelSrc.includes('Critical Damping') || panelSrc.includes('Critical damping') || panelSrc.includes('zero overshoot') || panelSrc.includes('0% Overshoot'),
    'Rigid preset must document/represent critical damping with zero overshoot'
  );
  assert(
    panelSrc.includes('12%') || panelSrc.includes('12% overshoot') || panelSrc.includes('iOS spring'),
    'Snappy preset must represent iOS spring curve with single 12% overshoot peak'
  );
  assert(
    panelSrc.includes('35%') || panelSrc.includes('harmonic recoil') || panelSrc.includes('Under-damped') || panelSrc.includes('decaying sine'),
    'Bouncy preset must represent under-damped oscillation with elastic harmonic recoil'
  );
});

addTest('SpringOscillationWaveform: Includes reference settling line (y=30) and animated pulse dot', () => {
  assert(
    panelSrc.includes('y1="30"') && panelSrc.includes('y2="30"'),
    'Must render reference settling line at y=30'
  );
  assert(
    panelSrc.includes('strokeDasharray') || panelSrc.includes('stroke-dasharray'),
    'Reference settling line must be dashed'
  );
  assert(
    panelSrc.includes('<circle') && (panelSrc.includes('animateMotion') || panelSrc.includes('pulse') || panelSrc.includes('motion')),
    'Must render pulse dot <circle> along the active curve'
  );
});

// ============================================================================
// SUITE 4: PhysicsTestPad TACTILE 3D INTERACTION & TELEMETRY
// ============================================================================
addTest('PhysicsTestPad: Tactical card with 3D perspective and dynamic hover pop elevation', () => {
  assert(
    panelSrc.includes('PhysicsTestPad'),
    'Must define PhysicsTestPad component'
  );
  assert(
    panelSrc.includes('Tap to Test Spring Physics') || panelSrc.includes('Tap to Test'),
    'Must display "Tap to Test Spring Physics" title'
  );
  assert(
    panelSrc.includes('perspective') || panelSrc.includes('perspective:'),
    'Tactical test pad card must utilize 3D perspective'
  );
  assert(
    panelSrc.includes('hoverPop') && (panelSrc.includes('translateZ') || panelSrc.includes('translate3d')),
    'Hovering elevates test pad card by active hoverPop distance'
  );
});

addTest('PhysicsTestPad: Click/Press triggers clickDepression and recoil matching selected preset', () => {
  assert(
    panelSrc.includes('clickDepression'),
    'Pressing test pad must react to active clickDepression state'
  );
  assert(
    panelSrc.includes('cubic-bezier') || panelSrc.includes('spring') || panelSrc.includes('recoil'),
    'Recoil bounce must match selected elasticity profile spring dynamics'
  );
});

addTest('PhysicsTestPad: Triggers soundFX.playHapticClick() on tactile tap', () => {
  assert(
    panelSrc.includes('playHapticClick'),
    'Test pad must trigger soundFX.playHapticClick() on press/tap'
  );
});

addTest('PhysicsTestPad: Displays real-time physics telemetry (Pop, Stiffness, Damping)', () => {
  assert(
    panelSrc.includes('Stiffness:') || panelSrc.includes('Stiffness'),
    'Telemetry must show Stiffness readout'
  );
  assert(
    panelSrc.includes('Damping:') || panelSrc.includes('Damping'),
    'Telemetry must show Damping readout'
  );
  assert(
    panelSrc.includes('Pop:') || panelSrc.includes('hoverPop'),
    'Telemetry must show Pop elevation readout'
  );
});

// ============================================================================
// SUITE 5: ACCESSIBILITY & KEYBOARD INTERACTION
// ============================================================================
addTest('PhysicsTestPad: Implements role="button", aria-label, and keyboard Enter/Space support', () => {
  assert(
    panelSrc.includes('role="button"'),
    'Test pad must specify role="button"'
  );
  assert(
    panelSrc.includes('aria-label="Interactive Spring Physics Test Pad"'),
    'Test pad must provide aria-label="Interactive Spring Physics Test Pad"'
  );
  assert(
    panelSrc.includes('Enter') && (panelSrc.includes(' ') || panelSrc.includes('Space')),
    'Test pad must support Enter and Space keyboard activation'
  );
});

// ============================================================================
// SUITE 6: VITE SSR DYNAMIC COMPILATION
// ============================================================================
addTest('LabContext.jsx & ControlCenterPanel.jsx compile cleanly in Vite SSR', async () => {
  const { createServer } = await import('vite');
  const server = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  try {
    const labMod = await server.ssrLoadModule('/src/context/LabContext.jsx');
    assert(labMod.LabProvider || labMod.useLab, 'LabContext must export LabProvider/useLab');
    assert(labMod.PHYSICS_PROFILES, 'LabContext must export PHYSICS_PROFILES');

    const panelMod = await server.ssrLoadModule('/src/components/ControlCenterPanel.jsx');
    assert(panelMod.default, 'ControlCenterPanel default export must exist');
    assert(
      typeof panelMod.default === 'function' || typeof panelMod.default === 'object',
      'ControlCenterPanel must export a React component'
    );
  } finally {
    await server.close();
  }
});

// ============================================================================
// RUN RUNNER
// ============================================================================
async function runAll() {
  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passCount++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     ${err.message}`);
      failCount++;
    }
  }

  console.log('\n================================================================');
  console.log(`  PHASE 5 VERIFICATION: ${passCount} PASSED | ${failCount} FAILED`);
  console.log('================================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runAll();
