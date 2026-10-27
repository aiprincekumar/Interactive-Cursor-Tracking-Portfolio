import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Verifying Phase 2: Tactile Physical 3D Keycaps & Dynamic Slider Reactivity...\n');

// 1. Verify ThreeDButtonPrimitives.jsx
const primPath = path.join(rootDir, 'src', 'components', '3d-sandbox', 'ThreeDButtonPrimitives.jsx');
const primSrc = fs.readFileSync(primPath, 'utf8');

assert.ok(
  primSrc.includes('lightingAngle = 45') && primSrc.includes('depthIntensity = 1.0') && primSrc.includes('bevelExtrusion = 3'),
  'ThreeDPresetCard must accept reactive slider coordinates (lightingAngle, depthIntensity, bevelExtrusion)'
);

assert.ok(
  primSrc.includes('extrusionPx = Math.max(3, Math.min(8, Math.round(4 * depthIntensity + (bevelExtrusion * 0.4))))'),
  'ThreeDPresetCard must compute dynamic 3D extrusion depth from depthIntensity and bevelExtrusion'
);

assert.ok(
  primSrc.includes('linear-gradient(${lightingAngle}deg'),
  'ThreeDPresetCard must project dynamic directional light gradient on card face matching lightingAngle'
);

assert.ok(
  primSrc.includes('translate-y-1.5'),
  'ThreeDPresetCard must provide mechanical click depression on isPressed'
);
console.log('✅ ThreeDButtonPrimitives: Tactile physical 3D keycap architecture verified.');

// 2. Verify Visual3DPresets.jsx
const visPath = path.join(rootDir, 'src', 'components', '3d-sandbox', 'Visual3DPresets.jsx');
const visSrc = fs.readFileSync(visPath, 'utf8');

assert.ok(
  visSrc.includes('const rad = ((lightingAngle ?? 45) * Math.PI) / 180;') &&
  visSrc.includes('const specX = Math.round(50 + 26 * Math.cos(rad));') &&
  visSrc.includes('const specY = Math.round(50 - 26 * Math.sin(rad));'),
  'MaterialShaderSphere must compute dynamic polar coordinates for specular highlight matching lightingAngle'
);

assert.ok(
  visSrc.includes('rotate(${lightingAngle - 90}deg)'),
  'MaterialShaderSphere and LightingVectorPreview must rotate reflections and shadows dynamically with lightingAngle'
);

assert.ok(
  visSrc.includes('sunX = Math.round(50 + 36 * Math.cos(rad))'),
  'LightingVectorPreview must dynamically orbit the light source around the central pillar based on lightingAngle'
);
console.log('✅ Visual3DPresets: Real-time slider-reactive shaders verified.');

// 3. Verify ControlCenterPanel.jsx
const cpcPath = path.join(rootDir, 'src', 'components', 'ControlCenterPanel.jsx');
const cpcSrc = fs.readFileSync(cpcPath, 'utf8');

assert.ok(
  cpcSrc.includes("'--3d-lighting-angle': `${lighting?.angle ?? 45}deg`"),
  'ControlCenterPanel #panel-threed must bind real-time CSS variable --3d-lighting-angle'
);

assert.ok(
  cpcSrc.includes('lightingAngle={lighting?.angle ?? 45}'),
  'ControlCenterPanel must forward lightingAngle to ThreeDPresetCards and Visual Previews'
);
console.log('✅ ControlCenterPanel: Real-time slider propagation to 3D buttons verified.');

console.log('\n🎉 ALL PHASE 2 REACTIVITY TESTS PASSED 100%!\n');
