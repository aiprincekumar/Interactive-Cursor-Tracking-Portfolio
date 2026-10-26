import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  VERIFY 3D TAB RUNTIME RENDER & REFERENCE INTEGRITY            ');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

async function runTest(name, fn) {
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

// -------------------------------------------------------------
// 1. Verify ControlCenterPanel.jsx Reference Fixes
// -------------------------------------------------------------
const ccpPath = path.join(rootDir, 'src/components/ControlCenterPanel.jsx');
assert(fs.existsSync(ccpPath), 'src/components/ControlCenterPanel.jsx must exist');
const ccpSrc = fs.readFileSync(ccpPath, 'utf8');

await runTest('ControlCenterPanel does not reference undefined threeDLighting', () => {
  assert(!ccpSrc.includes('threeDLighting.angle'), 'Must not reference undefined threeDLighting.angle');
  assert(!ccpSrc.includes('{threeDLighting'), 'Must not reference undefined threeDLighting');
});

await runTest('ControlCenterPanel uses lighting?.angle or lighting.angle in orientation readout', () => {
  assert(
    ccpSrc.includes('Light: {lighting?.angle ?? 45}°') ||
    ccpSrc.includes('Light: {lighting.angle ?? 45}°'),
    'Must display valid lighting angle in orientation readout'
  );
});

await runTest('ControlCenterPanel safely accesses autoScrollOnRefresh and setAutoScrollOnRefresh', () => {
  assert(!ccpSrc.includes('labAutoScrollOnRefresh'), 'Must not reference undeclared labAutoScrollOnRefresh');
  assert(!ccpSrc.includes('labSetAutoScrollOnRefresh'), 'Must not reference undeclared labSetAutoScrollOnRefresh');
  assert(
    ccpSrc.includes('labVisuals?.autoScrollOnRefresh ?? lab?.autoScrollOnRefresh ?? true'),
    'Must safely fallback to lab?.autoScrollOnRefresh'
  );
});

await runTest('ControlCenterPanel renders id="panel-threed" without unhandled variables', () => {
  const panelStart = ccpSrc.indexOf('id="panel-threed"');
  assert(panelStart !== -1, 'Must contain panel-threed tabpanel');
  const panelEnd = ccpSrc.indexOf('id="panel-preferences"');
  assert(panelEnd !== -1 && panelEnd > panelStart, 'Must contain panel-preferences after panel-threed');
  const panelSlice = ccpSrc.slice(panelStart, panelEnd);

  // Check key components mounted in panel-threed
  assert(panelSlice.includes('<UniversalMiniPortfolio'), 'Must mount UniversalMiniPortfolio');
  assert(panelSlice.includes('<StickySandboxColumn'), 'Must mount StickySandboxColumn');
  assert(panelSlice.includes('isComponentHighlighted'), 'Must wire isComponentHighlighted');
  assert(panelSlice.includes('highlightedComponent'), 'Must wire highlightedComponent');
  assert(panelSlice.includes('setHighlightedComponent'), 'Must wire setHighlightedComponent');
});

// -------------------------------------------------------------
// 2. Verify 3D Component Imports and Exports
// -------------------------------------------------------------
await runTest('UniversalMiniPortfolio exports valid default and named component', () => {
  const p = path.join(rootDir, 'src/components/3d-sandbox/UniversalMiniPortfolio.jsx');
  const src = fs.readFileSync(p, 'utf8');
  assert(src.includes('export function UniversalMiniPortfolio'), 'UniversalMiniPortfolio named export must exist');
  assert(src.includes('export default UniversalMiniPortfolio'), 'UniversalMiniPortfolio default export must exist');
  assert(src.includes('export function normalizeMiniKey'), 'normalizeMiniKey helper must be exported');
});

await runTest('StickySandboxColumn exports valid default and named component', () => {
  const p = path.join(rootDir, 'src/components/3d-sandbox/StickySandboxColumn.jsx');
  const src = fs.readFileSync(p, 'utf8');
  assert(src.includes('export function StickySandboxColumn'), 'StickySandboxColumn named export must exist');
  assert(src.includes('export default StickySandboxColumn'), 'StickySandboxColumn default export must exist');
  assert(src.includes('export const PREVIEW_TABS'), 'PREVIEW_TABS must be exported');
});

await runTest('SandboxViewportContainer exports valid default and named component', () => {
  const p = path.join(rootDir, 'src/components/3d-sandbox/SandboxViewportContainer.jsx');
  const src = fs.readFileSync(p, 'utf8');
  assert(src.includes('export function SandboxViewportContainer'), 'SandboxViewportContainer named export must exist');
  assert(src.includes('export default SandboxViewportContainer'), 'SandboxViewportContainer default export must exist');
});

await runTest('All 5 preview modules export valid preview components', () => {
  const previews = [
    'HeroCardPreview.jsx',
    'Navbar3DPreview.jsx',
    'Footer3DPreview.jsx',
    'FloatingDockPreview.jsx',
    'SectionShowcasePreview.jsx'
  ];
  for (const prev of previews) {
    const p = path.join(rootDir, 'src/components/3d-sandbox/previews', prev);
    assert(fs.existsSync(p), `${prev} must exist`);
    const src = fs.readFileSync(p, 'utf8');
    assert(src.includes('export default'), `${prev} must have default export`);
    assert(src.includes('isHighlighted'), `${prev} must accept isHighlighted prop`);
  }
});

// -------------------------------------------------------------
// 3. Verify useSandboxAutoSwitch Hook
// -------------------------------------------------------------
await runTest('useSandboxAutoSwitch exports hook and helpers', async () => {
  const mod = await import('../src/hooks/useSandboxAutoSwitch.js');
  assert(typeof mod.default === 'function', 'useSandboxAutoSwitch must be a function');
  assert(typeof mod.normalizePreviewTab === 'function', 'normalizePreviewTab must be a function');
  assert(typeof mod.getPreviewTabForAccordion === 'function', 'getPreviewTabForAccordion must be a function');
  assert.strictEqual(mod.normalizePreviewTab('nav'), 'navbar');
  assert.strictEqual(mod.normalizePreviewTab('card3d'), 'hero');
});

console.log('\n================================================================');
console.log(`  VERIFICATION: ${passCount} PASSED | ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
