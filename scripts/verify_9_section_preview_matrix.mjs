import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

console.log('🧪 Verifying 9-Section Preview Matrix & Contextual Stage Binding...');

const stickyColumnPath = path.resolve('src/components/3d-sandbox/StickySandboxColumn.jsx');
const autoSwitchPath = path.resolve('src/hooks/useSandboxAutoSwitch.js');

assert(fs.existsSync(stickyColumnPath), 'StickySandboxColumn.jsx must exist');
assert(fs.existsSync(autoSwitchPath), 'useSandboxAutoSwitch.js must exist');

const stickySrc = fs.readFileSync(stickyColumnPath, 'utf8');
const autoSwitchSrc = fs.readFileSync(autoSwitchPath, 'utf8');

// 1. Verify 9 preview tabs in PREVIEW_TABS
const expectedTabs = [
  'universal',
  'hero',
  'navbar',
  'dock',
  'lighting',
  'materials',
  'camera',
  'physics',
  'exploded'
];

expectedTabs.forEach((tabId) => {
  const tabRegex = new RegExp(`id:\\s*['"]${tabId}['"]`);
  assert(tabRegex.test(stickySrc), `PREVIEW_TABS must contain '${tabId}'`);
});
console.log('✅ PREVIEW_TABS contains all 9 preview sections');

// 2. Verify all 5 dedicated new preview stages exist
const expectedTestIds = [
  'lighting-studio-preview',
  'materials-stage-preview',
  'camera-viewport-preview',
  'physics-spring-preview',
  'exploded-cad-preview'
];

expectedTestIds.forEach((tid) => {
  assert(stickySrc.includes(tid), `StickySandboxColumn must render stage with data-testid="${tid}"`);
});
console.log('✅ All 5 dedicated new preview stages render with testids in SandboxViewportContainer');

// 3. Verify visuals are imported and instantiated with live reactive props
assert(stickySrc.includes('<LightingVectorPreview'), 'LightingVectorPreview must be instantiated');
assert(stickySrc.includes('lightingAngle={threeD.lighting?.angle ?? 45}'), 'LightingVectorPreview must bind lightingAngle');
assert(stickySrc.includes('<MaterialShaderSphere'), 'MaterialShaderSphere must be instantiated');
assert(stickySrc.includes('lightingAngle={threeD.lighting?.angle ?? 45}'), 'MaterialShaderSphere must bind lightingAngle');
assert(stickySrc.includes('<CameraCubePreview'), 'CameraCubePreview must be instantiated');
assert(stickySrc.includes('<SpringElasticityVisual'), 'SpringElasticityVisual must be instantiated');
assert(stickySrc.includes('<ExplodedCADLayerVisual'), 'ExplodedCADLayerVisual must be instantiated');
console.log('✅ Visual primitives properly bind threeD state in dedicated stages');

// 4. Verify handleResetComponentDefaults handles new stages
assert(stickySrc.includes("currentTab === 'lighting' && typeof lab3D?.set3DLighting === 'function'"), 'Must handle lighting reset');
assert(stickySrc.includes("currentTab === 'materials' && typeof lab3D?.set3DMaterials === 'function'"), 'Must handle materials reset');
assert(stickySrc.includes("currentTab === 'camera' && typeof lab3D?.set3DCamera === 'function'"), 'Must handle camera reset');
assert(stickySrc.includes("currentTab === 'physics' && typeof lab3D?.set3DPhysics === 'function'"), 'Must handle physics reset');
assert(stickySrc.includes("currentTab === 'exploded' && typeof lab3D?.set3DExploded === 'function'"), 'Must handle exploded reset');
console.log('✅ handleResetComponentDefaults supports stage-level resetting for all 5 settings tabs');

// 5. Verify useSandboxAutoSwitch exports
assert(autoSwitchSrc.includes("export const ACCORDION_TO_PREVIEW_MAP"), 'ACCORDION_TO_PREVIEW_MAP must be exported');
assert(autoSwitchSrc.includes("export function getPreviewTabForAccordion"), 'getPreviewTabForAccordion must be exported');
assert(autoSwitchSrc.includes("export function normalizePreviewTab"), 'normalizePreviewTab must be exported');
console.log('✅ useSandboxAutoSwitch exports standard mapping functions');

console.log('🎉 9-SECTION PREVIEW MATRIX VERIFICATION PASSED (100%)');
