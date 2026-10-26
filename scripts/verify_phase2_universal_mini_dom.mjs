import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  VERIFY PHASE 2: UNIVERSAL TOP MINI-DOM PORTFOLIO SANDBOX     ');
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

// -------------------------------------------------------------
// 1. Verify src/components/3d-sandbox/UniversalMiniPortfolio.jsx
// -------------------------------------------------------------
const miniPortfolioPath = path.join(rootDir, 'src/components/3d-sandbox/UniversalMiniPortfolio.jsx');
assert(fs.existsSync(miniPortfolioPath), 'src/components/3d-sandbox/UniversalMiniPortfolio.jsx must exist');
const miniPortfolioSrc = fs.readFileSync(miniPortfolioPath, 'utf8');

runTest('UniversalMiniPortfolio is wrapped in SandboxViewportContainer', () => {
  assert(miniPortfolioSrc.includes('import SandboxViewportContainer from \'./SandboxViewportContainer\';') ||
         miniPortfolioSrc.includes('SandboxViewportContainer'),
         'Must import SandboxViewportContainer');
  assert(miniPortfolioSrc.includes('<SandboxViewportContainer'), 'Must wrap sandbox in SandboxViewportContainer');
  assert(miniPortfolioSrc.includes('transformStyle: \'preserve-3d\''), 'Must configure transformStyle preserve-3d');
});

runTest('UniversalMiniPortfolio consumes 3D settings from LabContext', () => {
  assert(miniPortfolioSrc.includes('useLab3D'), 'Must consume useLab3D');
  assert(miniPortfolioSrc.includes('threeD.lighting') || miniPortfolioSrc.includes('lighting = threeD.lighting'), 'Must access 3D lighting');
  assert(miniPortfolioSrc.includes('threeD.camera') || miniPortfolioSrc.includes('camera = threeD.camera'), 'Must access 3D camera');
  assert(miniPortfolioSrc.includes('threeD.materials') || miniPortfolioSrc.includes('materials = threeD.materials'), 'Must access 3D materials');
  assert(miniPortfolioSrc.includes('threeD.environment') || miniPortfolioSrc.includes('environment = threeD.environment'), 'Must access 3D environment');
  assert(miniPortfolioSrc.includes('threeD.exploded') || miniPortfolioSrc.includes('exploded = threeD.exploded'), 'Must access 3D exploded configuration');
});

runTest('UniversalMiniPortfolio renders Mini-Navbar (Z: +18px) with brand, dots & theme pill', () => {
  assert(miniPortfolioSrc.includes('data-mini-element="navbar"') || miniPortfolioSrc.includes('mini-navbar'), 'Must render mini navbar');
  assert(miniPortfolioSrc.includes('18px') || miniPortfolioSrc.includes('translateZ(18px)') || miniPortfolioSrc.includes('18 +'), 'Must translate navbar to Z: +18px');
  assert(miniPortfolioSrc.includes('[AV]'), 'Must render brand monogram [AV]');
  assert(miniPortfolioSrc.includes('rounded-full'), 'Must render rounded navigation styling');
  assert(miniPortfolioSrc.includes('Sun') && miniPortfolioSrc.includes('Moon'), 'Must render theme pill with sun/moon');
});

runTest('UniversalMiniPortfolio renders Mini-Hero Card (Z: +36px) with avatar orb, headline & Active 3D badge', () => {
  assert(miniPortfolioSrc.includes('data-mini-element="hero"'), 'Must render mini hero card');
  assert(miniPortfolioSrc.includes('36px') || miniPortfolioSrc.includes('translateZ(36px)') || miniPortfolioSrc.includes('36 +'), 'Must translate hero card to Z: +36px');
  assert(miniPortfolioSrc.includes('Active 3D'), 'Must render Active 3D status badge');
  assert(miniPortfolioSrc.includes('rounded-full') && miniPortfolioSrc.includes('Avatar') || miniPortfolioSrc.includes('avatar') || miniPortfolioSrc.includes('AV'), 'Must render avatar orb');
});

runTest('UniversalMiniPortfolio renders Mini-Skills & Projects Grid (Z: +24px) responding to light angles', () => {
  assert(miniPortfolioSrc.includes('data-mini-element="grid"'), 'Must render mini skills grid');
  assert(miniPortfolioSrc.includes('24px') || miniPortfolioSrc.includes('translateZ(24px)') || miniPortfolioSrc.includes('24 +'), 'Must translate grid to Z: +24px');
  assert(miniPortfolioSrc.includes('grid-cols-2'), 'Must be a 2x2 4-card grid');
  assert(miniPortfolioSrc.includes('lightOffsetX') || miniPortfolioSrc.includes('lightOffsetY') || miniPortfolioSrc.includes('lighting.angle'), 'Must calculate dynamic light angle shadows');
});

runTest('UniversalMiniPortfolio renders Mini-Floating Dock (Z: +42px) with hover-pop elevation', () => {
  assert(miniPortfolioSrc.includes('data-mini-element="dock"'), 'Must render mini floating dock');
  assert(miniPortfolioSrc.includes('42px') || miniPortfolioSrc.includes('translateZ(42px)') || miniPortfolioSrc.includes('42 +'), 'Must translate dock to Z: +42px');
  assert(miniPortfolioSrc.includes('hoveredDockIcon') || miniPortfolioSrc.includes('onMouseEnter'), 'Must handle dock icon hover elevation');
  assert(miniPortfolioSrc.includes('translateZ(10px)') || miniPortfolioSrc.includes('scale-125') || miniPortfolioSrc.includes('scale(1.2)'), 'Must implement subtle hover-pop elevation');
});

runTest('UniversalMiniPortfolio renders Mini-Footer (Z: +10px) with ground plane shadow & copyright', () => {
  assert(miniPortfolioSrc.includes('data-mini-element="footer"'), 'Must render mini footer');
  assert(miniPortfolioSrc.includes('10px') || miniPortfolioSrc.includes('translateZ(10px)'), 'Must translate footer to Z: +10px');
  assert(miniPortfolioSrc.includes('Atul Verma') || miniPortfolioSrc.includes('All Systems Nominal'), 'Must render copyright info');
});

runTest('UniversalMiniPortfolio integrates dynamic Atmosphere Layer (Skybox, Stardust & Volumetric Fog)', () => {
  assert(miniPortfolioSrc.includes('dark-studio') && miniPortfolioSrc.includes('cyber-city') && miniPortfolioSrc.includes('cosmic-nebula') && miniPortfolioSrc.includes('sunset-horizon'),
    'Must define skybox presets');
  assert(miniPortfolioSrc.includes('environment.stardustParticles'), 'Must toggle stardust particles');
  assert(miniPortfolioSrc.includes('environment.fogDensity'), 'Must support volumetric fog density');
  assert(miniPortfolioSrc.includes('backdropFilter') || miniPortfolioSrc.includes('backdrop-filter') || miniPortfolioSrc.includes('blur'),
    'Must apply volumetric fog blur filter');
});

runTest('UniversalMiniPortfolio implements Interactive Pointer & Gyroscope Engine with spring release', () => {
  assert(miniPortfolioSrc.includes('handlePointerDown'), 'Must implement handlePointerDown');
  assert(miniPortfolioSrc.includes('handlePointerMove'), 'Must implement handlePointerMove');
  assert(miniPortfolioSrc.includes('handlePointerUp'), 'Must implement handlePointerUp');
  assert(miniPortfolioSrc.includes('setPointerCapture') || miniPortfolioSrc.includes('pointerId'), 'Must manage pointer capture');
  assert(miniPortfolioSrc.includes('-25') && miniPortfolioSrc.includes('25'), 'Must clamp rotX to [-25, 25]');
  assert(miniPortfolioSrc.includes('-35') && miniPortfolioSrc.includes('35'), 'Must clamp rotY to [-35, 35]');
  assert(miniPortfolioSrc.includes('cubic-bezier'), 'Must apply spring damping transition on release');
});

runTest('UniversalMiniPortfolio supports CAD Blueprint / Wireframe Mode', () => {
  assert(miniPortfolioSrc.includes('isWireframe') || miniPortfolioSrc.includes('blueprintMode'), 'Must support wireframe / CAD mode');
  assert(miniPortfolioSrc.includes('border-cyan-400') || miniPortfolioSrc.includes('text-cyan'), 'Must render technical cyan schematic styling');
  assert(miniPortfolioSrc.includes('SCHEMATIC WIREFRAME') || miniPortfolioSrc.includes('BASE CHASSIS'), 'Must support exploded strata layers');
});

// -------------------------------------------------------------
// 2. Verify ControlCenterPanel.jsx Top Section Integration
// -------------------------------------------------------------
const panelPath = path.join(rootDir, 'src/components/ControlCenterPanel.jsx');
const panelSrc = fs.readFileSync(panelPath, 'utf8');

runTest('ControlCenterPanel imports and embeds UniversalMiniPortfolio', () => {
  assert(panelSrc.includes('import UniversalMiniPortfolio from \'./3d-sandbox/UniversalMiniPortfolio\';'), 'Must import UniversalMiniPortfolio');
  assert(panelSrc.includes('<UniversalMiniPortfolio'), 'Must render UniversalMiniPortfolio component');
});

runTest('ControlCenterPanel renders Phase 2 top toolbar controls', () => {
  assert(panelSrc.includes('Universal Portfolio Replica'), 'Must render Universal Portfolio Replica badge');
  assert(panelSrc.includes('Rot:') && panelSrc.includes('Light:'), 'Must render Orientation and Light readout');
  assert(panelSrc.includes('CAD Wireframe') || panelSrc.includes('CAD Active'), 'Must render CAD Wireframe toggle');
  assert(panelSrc.includes('RotateCcw') && panelSrc.includes('Reset Orientation'), 'Must render Reset Orientation button');
});

runTest('ControlCenterPanel maintains full compatibility with verify_threed_controls requirements', () => {
  assert(panelSrc.includes('Interactive 3D Sandbox Preview'), 'Must render Interactive 3D Sandbox Preview title');
  assert(panelSrc.includes('Live Simulation'), 'Must render Live Simulation badge');
  assert(panelSrc.includes('Hide Sandbox') && panelSrc.includes('Show Sandbox'), 'Must render Hide/Show toggle button');
  assert(panelSrc.includes('onPointerDown={handleSandboxPointerDown}'), 'Must attach handleSandboxPointerDown');
  assert(panelSrc.includes('onPointerMove={handleSandboxPointerMove}'), 'Must attach handleSandboxPointerMove');
  assert(panelSrc.includes('Active 3D Mode') && panelSrc.includes('2D Flat Mode'), 'Must render Active 3D / 2D Flat Mode');
  assert(panelSrc.includes('BASE CHASSIS [STRATA -01]'), 'Must retain exploded chassis strata');
});

// -------------------------------------------------------------
// Summary
// -------------------------------------------------------------
console.log('\n================================================================');
console.log(`  PHASE 2 VERIFICATION: ${passCount} PASSED | ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
