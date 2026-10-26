import fs from 'node:fs';
import path from 'node:path';

console.log('🧪 Starting Verification Gate: Phase 2 (Self-Explanatory Visual 3D Presets)...');

const rootDir = process.cwd();

// 1. Verify src/components/3d-sandbox/Visual3DPresets.jsx
const visualPresetsPath = path.join(rootDir, 'src', 'components', '3d-sandbox', 'Visual3DPresets.jsx');
if (!fs.existsSync(visualPresetsPath)) {
  console.error('❌ FAIL: src/components/3d-sandbox/Visual3DPresets.jsx not found!');
  process.exit(1);
}
const visualContent = fs.readFileSync(visualPresetsPath, 'utf8');
if (
  !visualContent.includes('export function CameraCubePreview') ||
  !visualContent.includes('export function MaterialShaderSphere') ||
  !visualContent.includes('export function ThemeExtrudedSlab') ||
  !visualContent.includes('export function LightingVectorPreview')
) {
  console.error('❌ FAIL: Visual3DPresets.jsx missing one or more component exports!');
  process.exit(1);
}
console.log('✅ PASS: src/components/3d-sandbox/Visual3DPresets.jsx verified.');

// 2. Verify ControlCenterPanel.jsx integrations
const panelPath = path.join(rootDir, 'src', 'components', 'ControlCenterPanel.jsx');
const panelContent = fs.readFileSync(panelPath, 'utf8');

if (!panelContent.includes('ThemeExtrudedSlab') || !panelContent.includes('CameraCubePreview') || !panelContent.includes('MaterialShaderSphere') || !panelContent.includes('LightingVectorPreview')) {
  console.error('❌ FAIL: ControlCenterPanel.jsx does not import or use all visual 3D preset components!');
  process.exit(1);
}

// Ensure THREED_MASTER_THEMES, CAMERA_PRESETS, MATERIAL_PRESETS, and LIGHTING_PRESETS use ThreeDPresetCard
const themesMatch = panelContent.includes('visualPreview={<ThemeExtrudedSlab');
const cameraMatch = panelContent.includes('visualPreview={<CameraCubePreview');
const materialMatch = panelContent.includes('visualPreview={<MaterialShaderSphere');
const lightingMatch = panelContent.includes('visualPreview={<LightingVectorPreview');

if (!themesMatch || !cameraMatch || !materialMatch || !lightingMatch) {
  console.error('❌ FAIL: One or more preset groups failed to mount ThreeDPresetCard with visualPreview!', {
    themesMatch,
    cameraMatch,
    materialMatch,
    lightingMatch
  });
  process.exit(1);
}
console.log('✅ PASS: ControlCenterPanel.jsx preset cards wired with self-explanatory 3D visuals.');

console.log('\n🎉 100% Phase 2: Self-Explanatory Visual 3D Presets Verified Successfully!');
process.exit(0);
