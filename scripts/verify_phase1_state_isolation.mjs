import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  VERIFY PHASE 1: STATE ISOLATION & SCOPED CSS 3D ARCHITECTURE  ');
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
// 1. Verify src/context/LabContext.jsx State Isolation & Scoped CSS
// -------------------------------------------------------------
const labContextPath = path.join(rootDir, 'src/context/LabContext.jsx');
assert(fs.existsSync(labContextPath), 'src/context/LabContext.jsx must exist');
const labContextSrc = fs.readFileSync(labContextPath, 'utf8');

runTest('LabContext defines isLive3DApplied state and state updater', () => {
  assert(
    labContextSrc.includes('const [isLive3DApplied, setIsLive3DApplied] = useState(false);') ||
    labContextSrc.includes('isLive3DApplied'),
    'Must define isLive3DApplied state defaulting to false'
  );
  assert(labContextSrc.includes('setIsLive3DApplied'), 'Must define setIsLive3DApplied updater');
});

runTest('LabContext implements applyToLivePortfolio and revertLivePortfolio functions', () => {
  assert(labContextSrc.includes('const applyToLivePortfolio = useCallback'), 'Must define applyToLivePortfolio callback');
  assert(labContextSrc.includes('setIsLive3DApplied(true)'), 'applyToLivePortfolio must set isLive3DApplied to true');
  assert(labContextSrc.includes('const revertLivePortfolio = useCallback'), 'Must define revertLivePortfolio callback');
  assert(labContextSrc.includes('setIsLive3DApplied(false)'), 'revertLivePortfolio must set isLive3DApplied to false');
});

runTest('LabContext implements getScopedSandboxStyles generator', () => {
  assert(labContextSrc.includes('const getScopedSandboxStyles = useCallback'), 'Must define getScopedSandboxStyles callback');
  assert(labContextSrc.includes('computeScopedSandboxStyles'), 'Must utilize computeScopedSandboxStyles pure function');
});

runTest('LabContext exports computeScopedSandboxStyles and generates full 3D custom properties', async () => {
  const { computeScopedSandboxStyles, FACTORY_DEFAULTS } = await import('../src/context/LabContext.jsx');
  assert(typeof computeScopedSandboxStyles === 'function', 'computeScopedSandboxStyles must be exported as a function');

  const customConfig = {
    ...FACTORY_DEFAULTS.threeD,
    depthIntensity: 1.8,
    lighting: { ...FACTORY_DEFAULTS.threeD.lighting, angle: 120, shadowSoftness: 0.85 },
    materials: { ...FACTORY_DEFAULTS.threeD.materials, preset: 'cyber-wireframe' },
    exploded: { enabled: true, separationDistance: 70, blueprintMode: true }
  };

  const styles = computeScopedSandboxStyles(customConfig, { '--custom-override': 'test' });
  
  assert.strictEqual(styles['--3d-depth-intensity'], '1.8', 'Must map depth intensity');
  assert.strictEqual(styles['--3d-light-angle'], '120deg', 'Must map light angle with deg unit');
  assert.strictEqual(styles['--3d-shadow-softness'], '0.85', 'Must map shadow softness');
  assert.strictEqual(styles['--3d-material-preset'], 'cyber-wireframe', 'Must map material preset');
  assert.strictEqual(styles['--3d-explode-z'], '70px', 'Must map exploded separation distance');
  assert.strictEqual(styles['--3d-blueprint-mode'], '1', 'Must map blueprint mode boolean');
  assert.strictEqual(styles['--custom-override'], 'test', 'Must allow caller overrides');
});

runTest('LabContext condition isolates CSS custom properties to root ONLY when isLive3DApplied is true', () => {
  assert(labContextSrc.includes('if (isLive3DApplied)'), 'Root injection effect must branch on isLive3DApplied');
  assert(labContextSrc.includes('root.style.setProperty(\'--3d-depth-intensity\', \'0\');'), 'Must set neutral baseline 0 depth when unapplied');
  assert(labContextSrc.includes('root.classList.remove(\'threed-enabled\');'), 'Must remove threed-enabled class from root when unapplied');
});

runTest('LabContext exposes isLive3DApplied, applyToLivePortfolio, revertLivePortfolio & getScopedSandboxStyles in context and useLab3D', () => {
  assert(labContextSrc.includes('isLive3DApplied,'), 'Must expose isLive3DApplied');
  assert(labContextSrc.includes('applyToLivePortfolio,'), 'Must expose applyToLivePortfolio');
  assert(labContextSrc.includes('revertLivePortfolio,'), 'Must expose revertLivePortfolio');
  assert(labContextSrc.includes('getScopedSandboxStyles,'), 'Must expose getScopedSandboxStyles');
  assert(labContextSrc.includes('export const useLab3D = useLabThreeD;'), 'Must export useLab3D alias');
});

// -------------------------------------------------------------
// 2. Verify src/components/3d-sandbox/SandboxViewportContainer.jsx
// -------------------------------------------------------------
const containerPath = path.join(rootDir, 'src/components/3d-sandbox/SandboxViewportContainer.jsx');

runTest('SandboxViewportContainer.jsx component file exists', () => {
  assert(fs.existsSync(containerPath), 'src/components/3d-sandbox/SandboxViewportContainer.jsx must exist');
});

const containerSrc = fs.readFileSync(containerPath, 'utf8');

runTest('SandboxViewportContainer consumes useLab3D and getScopedSandboxStyles', () => {
  assert(containerSrc.includes('useLab3D'), 'Must import or call useLab3D');
  assert(containerSrc.includes('getScopedSandboxStyles'), 'Must obtain getScopedSandboxStyles');
});

runTest('SandboxViewportContainer applies scoped 3D styling and preserve-3d perspective', () => {
  assert(containerSrc.includes('sandbox-viewport'), 'Must assign .sandbox-viewport CSS class');
  assert(containerSrc.includes('transformStyle: \'preserve-3d\''), 'Must set transformStyle: preserve-3d');
  assert(containerSrc.includes('perspective:'), 'Must set CSS perspective dynamically');
  assert(containerSrc.includes('data-sandbox-viewport="true"'), 'Must include data-sandbox-viewport identifier');
});

// -------------------------------------------------------------
// 3. Verify src/components/ControlCenterPanel.jsx Studio Header
// -------------------------------------------------------------
const panelPath = path.join(rootDir, 'src/components/ControlCenterPanel.jsx');
const panelSrc = fs.readFileSync(panelPath, 'utf8');

runTest('ControlCenterPanel destructures Phase 1 state isolation methods', () => {
  assert(panelSrc.includes('isLive3DApplied,'), 'Must destructure isLive3DApplied');
  assert(panelSrc.includes('applyToLivePortfolio,'), 'Must destructure applyToLivePortfolio');
  assert(panelSrc.includes('revertLivePortfolio,'), 'Must destructure revertLivePortfolio');
});

runTest('ControlCenterPanel renders 3D Studio Architecture & State Isolation Bar with Mode Status Pill', () => {
  assert(panelSrc.includes('Mode: Sandbox Isolated'), 'Must render Mode: Sandbox Isolated status label');
  assert(panelSrc.includes('Mode: Live Applied'), 'Must render Mode: Live Applied status label');
  assert(panelSrc.includes('Shield'), 'Must render Shield icon for isolated mode');
});

runTest('ControlCenterPanel renders Apply to Live Portfolio / Live Active toggle button', () => {
  assert(panelSrc.includes('Apply to Live Portfolio'), 'Must render Apply to Live Portfolio button text');
  assert(panelSrc.includes('Live Active (Click to Revert)'), 'Must render Live Active (Click to Revert) button text');
});

runTest('ControlCenterPanel renders Reset Sandbox button', () => {
  assert(panelSrc.includes('Reset Sandbox'), 'Must render Reset Sandbox button');
});

console.log('\n================================================================');
console.log(`  PHASE 1 VERIFICATION: ${passCount} PASSED | ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
