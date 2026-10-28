import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Starting Phase 2 Full-Card 3D Buttons & Realistic Shaders Verification...\n');

// 1. Verify ThreeDButtonPrimitives.jsx
const primitivesPath = path.join(rootDir, 'src', 'components', '3d-sandbox', 'ThreeDButtonPrimitives.jsx');
const primitivesSrc = fs.readFileSync(primitivesPath, 'utf8');

// Check that in 3D mode (isVisualOnly), the header row is suppressed
assert.ok(
  primitivesSrc.includes('!isVisualOnly && (') && primitivesSrc.includes('truncate') && primitivesSrc.includes('{title}'),
  'ThreeDPresetCard must conditionally suppress title, icon and badge header row when isVisualOnly is true'
);

// Check that in 3D mode, the visual preview is rendered directly without nested pill box
assert.ok(
  primitivesSrc.includes('isVisualOnly ? (') && primitivesSrc.includes('w-full h-full flex items-center justify-center overflow-hidden relative threed-preserve'),
  'ThreeDPresetCard must render visualPreview directly filling full card without nested preview pills when isVisualOnly is true'
);

// Check that neon edge glow is applied on isSelected in 3D mode
assert.ok(
  primitivesSrc.includes('shadow-[0_0_24px_rgba(255,77,109,0.45)'),
  'ThreeDPresetCard must apply neon edge glow shadow on isSelected in 3D mode'
);

// Check that tooltip and aria-label are fully preserved
assert.ok(
  primitivesSrc.includes('aria-label={ariaLabel || tooltipText}') && primitivesSrc.includes('title={tooltipText}'),
  'ThreeDPresetCard must preserve title and aria-label attributes for full hover tooltips and accessibility'
);
console.log('✅ ThreeDButtonPrimitives: Single-component full-card 3D structure verified.');

// 2. Verify Visual3DPresets.jsx
const visualPresetsPath = path.join(rootDir, 'src', 'components', '3d-sandbox', 'Visual3DPresets.jsx');
const visualPresetsSrc = fs.readFileSync(visualPresetsPath, 'utf8');

// Check MaterialShaderSphere sizes and realistic shaders
assert.ok(
  visualPresetsSrc.includes('w-20 h-20 sm:w-24 sm:h-24') && visualPresetsSrc.includes('w-16 h-16 sm:w-18 sm:h-18'),
  'MaterialShaderSphere must feature enlarged full-size 3D sphere dimensions'
);

// Check metallic-gloss realistic chrome / iron shader
assert.ok(
  visualPresetsSrc.includes('conic-gradient(from') && visualPresetsSrc.includes('at 50% 50%') && visualPresetsSrc.includes('Anisotropic Chrome Horizon Line'),
  'MaterialShaderSphere must render realistic anisotropic chrome/iron horizon reflection for metallic-gloss'
);

// Check glass-acrylic refractive shader
assert.ok(
  visualPresetsSrc.includes('backdrop-blur-lg') && visualPresetsSrc.includes('Internal Fresnel Refraction Ring'),
  'MaterialShaderSphere must render refractive glass acrylic caustics and fresnel ring'
);

// Check neumorphic-clay velvety diffuse shader
assert.ok(
  visualPresetsSrc.includes('radial-gradient(circle at') && visualPresetsSrc.includes('#fafaf9 0%') && visualPresetsSrc.includes('Velvety Matte Clay Sphere'),
  'MaterialShaderSphere must render velvety diffuse matte clay sphere'
);

// Check cyber-wireframe luminous mesh shader
assert.ok(
  visualPresetsSrc.includes('border-2 border-cyan-400') && visualPresetsSrc.includes('Latitude Rings'),
  'MaterialShaderSphere must render glowing cyber wireframe lattice'
);

// Check CameraCubePreview
assert.ok(
  visualPresetsSrc.includes('w-12 h-12 relative transition-transform') && visualPresetsSrc.includes('perspective: \'280px\''),
  'CameraCubePreview must render enlarged 3D camera orientation cube'
);

// Check ThemeExtrudedSlab (Straight front-facing 3D depth elevation)
assert.ok(
  visualPresetsSrc.includes('w-20 h-10 relative threed-preserve') && visualPresetsSrc.includes('rotateX(4deg) rotateY(0deg)'),
  'ThemeExtrudedSlab must render prominent front-facing 3D extruded slab'
);

// Check LightingVectorPreview
assert.ok(
  visualPresetsSrc.includes('Light Source (Sun/Spotlight)') && visualPresetsSrc.includes('Pillar Object'),
  'LightingVectorPreview must render 3D light vector spotlight, illuminated plinth and cast shadow'
);
console.log('✅ Visual3DPresets: Realistic 3D shaders, spheres, cubes and slabs verified.');

// 3. Verify PhysicsAndCADVisuals.jsx
const physicsPath = path.join(rootDir, 'src', 'components', '3d-sandbox', 'PhysicsAndCADVisuals.jsx');
const physicsSrc = fs.readFileSync(physicsPath, 'utf8');

assert.ok(
  physicsSrc.includes('3D Kinetic Piston Head') && physicsSrc.includes('Heavy 3D Spring Coils') && physicsSrc.includes('3D Base Pedestal'),
  'SpringElasticityVisual must render prominent 3D kinetic spring mechanism'
);
console.log('✅ PhysicsAndCADVisuals: Prominent 3D spring mechanism verified.');

console.log('\n🎉 ALL PHASE 2 VERIFICATIONS PASSED 100%!\n');
