import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  VERIFY PHASE 3: DESKTOP 2-COLUMN SPLIT & STICKY SANDBOX CONTAINER');
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
// 1. Verify src/components/3d-sandbox/StickySandboxColumn.jsx
// -------------------------------------------------------------
const stickyColumnPath = path.join(rootDir, 'src/components/3d-sandbox/StickySandboxColumn.jsx');
assert(fs.existsSync(stickyColumnPath), 'src/components/3d-sandbox/StickySandboxColumn.jsx must exist');
const stickyColumnSrc = fs.readFileSync(stickyColumnPath, 'utf8');

runTest('StickySandboxColumn applies sticky layout classes', () => {
  assert(stickyColumnSrc.includes('sticky'), 'Must include sticky position class');
  assert(stickyColumnSrc.includes('top-6'), 'Must offset sticky container with top-6');
  assert(stickyColumnSrc.includes('self-start'), 'Must align self-start to prevent stretching across full height');
  assert(stickyColumnSrc.includes('max-h-[calc(100vh-3rem)]'), 'Must constrain max-height relative to viewport');
  assert(stickyColumnSrc.includes('overflow-y-auto'), 'Must provide smooth internal scroll for overflowing content');
});

runTest('StickySandboxColumn renders all 6 component preview tab pills', () => {
  assert(stickyColumnSrc.includes('Universal Mini'), 'Must include Universal Mini tab');
  assert(stickyColumnSrc.includes('3D Hero Card'), 'Must include 3D Hero Card tab');
  assert(stickyColumnSrc.includes('Navbar'), 'Must include Navbar tab');
  assert(stickyColumnSrc.includes('Footer'), 'Must include Footer tab');
  assert(stickyColumnSrc.includes('Floating Dock'), 'Must include Floating Dock tab');
  assert(stickyColumnSrc.includes('Section Showcase'), 'Must include Section Showcase tab');
});

runTest('StickySandboxColumn defines PREVIEW_TABS with all standard tabs', () => {
  assert(stickyColumnSrc.includes('export const PREVIEW_TABS ='), 'PREVIEW_TABS must be exported');
  assert(stickyColumnSrc.includes("id: 'universal'"), 'Must include universal tab id');
  assert(stickyColumnSrc.includes("id: 'hero'"), 'Must include hero tab id');
  assert(stickyColumnSrc.includes("id: 'navbar'"), 'Must include navbar tab id');
  assert(stickyColumnSrc.includes("id: 'footer'"), 'Must include footer tab id');
  assert(stickyColumnSrc.includes("id: 'dock'"), 'Must include dock tab id');
  assert(stickyColumnSrc.includes("id: 'showcase'"), 'Must include showcase tab id');
});

runTest('StickySandboxColumn embeds SandboxViewportContainer and UniversalMiniPortfolio', () => {
  assert(stickyColumnSrc.includes('SandboxViewportContainer'), 'Must use SandboxViewportContainer');
  assert(stickyColumnSrc.includes('UniversalMiniPortfolio'), 'Must import UniversalMiniPortfolio for universal preview');
  assert(stickyColumnSrc.includes('perspective={camera.perspectiveFOV'), 'Must pass perspective to SandboxViewportContainer');
});

runTest('StickySandboxColumn integrates Live Telemetry & Control Bar with Reset button', () => {
  assert(stickyColumnSrc.includes('Rot:') || stickyColumnSrc.includes('rotX'), 'Must display rotation values');
  assert(stickyColumnSrc.includes('FOV:') || stickyColumnSrc.includes('perspectiveFOV'), 'Must display camera FOV readout');
  assert(stickyColumnSrc.includes('RotateCcw'), 'Must import and use RotateCcw icon for reset');
  assert(stickyColumnSrc.includes('Reset Sandbox Orientation') || stickyColumnSrc.includes('handleResetOrientation'), 'Must provide reset orientation capability');
});

runTest('StickySandboxColumn implements pointer drag interaction for 3D rotation', () => {
  assert(stickyColumnSrc.includes('handlePointerDown'), 'Must implement handlePointerDown');
  assert(stickyColumnSrc.includes('handlePointerMove'), 'Must implement handlePointerMove');
  assert(stickyColumnSrc.includes('handlePointerUp'), 'Must implement handlePointerUp');
});

// -------------------------------------------------------------
// 2. Verify ControlCenterPanel.jsx Integration
// -------------------------------------------------------------
const panelPath = path.join(rootDir, 'src/components/ControlCenterPanel.jsx');
const panelSrc = fs.readFileSync(panelPath, 'utf8');

runTest('ControlCenterPanel imports and embeds StickySandboxColumn', () => {
  assert(panelSrc.includes("import StickySandboxColumn from './3d-sandbox/StickySandboxColumn';"),
    'Must import StickySandboxColumn');
  assert(panelSrc.includes('<StickySandboxColumn'), 'Must embed StickySandboxColumn component');
  assert(panelSrc.includes('activePreviewTab={activePreviewTab}'), 'Must bind activePreviewTab');
  assert(panelSrc.includes('onSelectTab={setActivePreviewTab}'), 'Must bind onSelectTab callback');
});

runTest('ControlCenterPanel establishes Desktop 2-Column Responsive Split', () => {
  assert(panelSrc.includes('lg:grid-cols-12'), 'Must configure 12-column grid layout on large screens');
  assert(panelSrc.includes('lg:col-span-5') || panelSrc.includes('xl:col-span-5'), 'Left column must span 5 columns on desktop');
  assert(panelSrc.includes('lg:col-span-7') || panelSrc.includes('xl:col-span-7'), 'Right column must span 7 columns on desktop');
  assert(panelSrc.includes('sticky top-6 self-start'), 'Left column wrapper must configure sticky top-6 self-start');
});

runTest('ControlCenterPanel preserves graceful single-column fallback in drawer mode', () => {
  assert(panelSrc.includes('isDrawer ?') && panelSrc.includes('flex flex-col gap-4'),
    'Must fall back to compact single-column stacked layout when in drawer mode');
  assert(panelSrc.includes('!isDrawer &&'),
    'Must conditionally render sticky left column only in workbench / non-drawer mode');
});

runTest('ControlCenterPanel maintains full backward compatibility with all existing 3D suites', () => {
  assert(panelSrc.includes('Master 3D Mode'), 'Must preserve Master 3D Mode');
  assert(panelSrc.includes('Interactive 3D Sandbox Preview'), 'Must preserve Interactive 3D Sandbox Preview');
  assert(panelSrc.includes('Top Cluster Filter Bar'), 'Must preserve Top Cluster Filter Bar');
  assert(panelSrc.includes('Element 3D Conversion Toggles (10 Elements)'), 'Must preserve Section 1');
  assert(panelSrc.includes('Performance &amp; GPU Acceleration'), 'Must preserve Section 9');
  assert(panelSrc.includes('3D Profile, Export &amp; Developer Toolkit'), 'Must preserve Developer Toolkit');
});

// -------------------------------------------------------------
// Summary
// -------------------------------------------------------------
console.log('\n================================================================');
console.log(`  PHASE 3 VERIFICATION: ${passCount} PASSED | ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
