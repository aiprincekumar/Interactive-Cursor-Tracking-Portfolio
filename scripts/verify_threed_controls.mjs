import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  VERIFY 3D CONTROLS TAB UI & STATE MANAGEMENT SPECIFICATION    ');
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

// 1. Verify LabContext exports & FACTORY_DEFAULTS
const labContextPath = path.join(rootDir, 'src/context/LabContext.jsx');
const labContextSrc = fs.readFileSync(labContextPath, 'utf8');

runTest('LabContext source defines FACTORY_DEFAULTS.threeD schema', () => {
  assert(labContextSrc.includes('threeD: {'), 'Must include threeD slice');
  assert(labContextSrc.includes('master3D: false'), 'Must default master3D to false');
  assert(labContextSrc.includes('depthIntensity: 1.0'), 'Must default depthIntensity to 1.0');
  assert(labContextSrc.includes("stylePreset: 'subtle'"), 'Must default stylePreset to subtle');
  
  const expectedElements = [
    'floatingButton',
    'navbarItems',
    'navbarIcons',
    'resumeButton',
    'profilePic',
    'header',
    'subHeader',
    'description',
    'container',
    'containerContent'
  ];
  
  for (const el of expectedElements) {
    assert(labContextSrc.includes(`${el}: false`), `Must include element key: ${el}`);
  }
});

runTest('LabContext exports normalizers and clamp functions', () => {
  assert(labContextSrc.includes('export function clampDepthIntensity'), 'Must export clampDepthIntensity');
  assert(labContextSrc.includes('export function normalizeStylePreset'), 'Must export normalizeStylePreset');
  assert(labContextSrc.includes('export function normalizeThreeDElements'), 'Must export normalizeThreeDElements');
  assert(labContextSrc.includes('export function normalize3DExploded'), 'Must export normalize3DExploded');
  assert(labContextSrc.includes('export function normalize3DEnvironment'), 'Must export normalize3DEnvironment');
  assert(labContextSrc.includes('export function normalize3DSpatialAudio'), 'Must export normalize3DSpatialAudio');
  assert(labContextSrc.includes('export function normalize3DPerformance'), 'Must export normalize3DPerformance');
  assert(labContextSrc.includes('export function normalize3DClusterFilter'), 'Must export normalize3DClusterFilter');
});

runTest('LabContext implements 3D helper functions', () => {
  assert(labContextSrc.includes('const setMaster3D = useCallback'), 'Must implement setMaster3D');
  assert(labContextSrc.includes('const toggle3DElement = useCallback'), 'Must implement toggle3DElement');
  assert(labContextSrc.includes('const enableAll3D = useCallback'), 'Must implement enableAll3D');
  assert(labContextSrc.includes('const disableAll3D = useCallback'), 'Must implement disableAll3D');
  assert(labContextSrc.includes('const reset3DDefaults = useCallback'), 'Must implement reset3DDefaults');
  assert(labContextSrc.includes('const set3DDepthIntensity = useCallback'), 'Must implement set3DDepthIntensity');
  assert(labContextSrc.includes('const set3DStylePreset = useCallback'), 'Must implement set3DStylePreset');
  assert(labContextSrc.includes('const set3DExploded = useCallback'), 'Must implement set3DExploded');
  assert(labContextSrc.includes('const set3DEnvironment = useCallback'), 'Must implement set3DEnvironment');
  assert(labContextSrc.includes('const set3DSpatialAudio = useCallback'), 'Must implement set3DSpatialAudio');
  assert(labContextSrc.includes('const set3DPerformance = useCallback'), 'Must implement set3DPerformance');
  assert(labContextSrc.includes('const set3DClusterFilter = useCallback'), 'Must implement set3DClusterFilter');
});

runTest('LabContext injects root CSS custom properties for 3D state', () => {
  assert(labContextSrc.includes('--3d-depth-intensity'), 'Must set --3d-depth-intensity');
  assert(labContextSrc.includes('--3d-style-preset'), 'Must set --3d-style-preset');
  assert(labContextSrc.includes('--3d-light-angle'), 'Must set --3d-light-angle');
  assert(labContextSrc.includes('--3d-perspective'), 'Must set --3d-perspective');
  assert(labContextSrc.includes('--3d-tilt-sensitivity'), 'Must set --3d-tilt-sensitivity');
  assert(labContextSrc.includes('--3d-bevel-extrusion'), 'Must set --3d-bevel-extrusion');
  assert(labContextSrc.includes('--3d-hover-pop'), 'Must set --3d-hover-pop');
  assert(labContextSrc.includes('--3d-explode-z'), 'Must set --3d-explode-z');
  assert(labContextSrc.includes('--3d-blueprint-mode'), 'Must set --3d-blueprint-mode');
  assert(labContextSrc.includes('--3d-fog-density'), 'Must set --3d-fog-density');
  assert(labContextSrc.includes('--3d-target-fps'), 'Must set --3d-target-fps');
  assert(labContextSrc.includes('dataset.threedMaster'), 'Must set data-threed-master');
  assert(labContextSrc.includes('threed-enabled'), 'Must set threed-enabled class');
});

runTest('LabContext exposes 3D slice in useLab() return value', () => {
  assert(labContextSrc.includes('threeD,'), 'Must expose threeD');
  assert(labContextSrc.includes('threeDConfig: threeD,'), 'Must expose threeDConfig alias');
  assert(labContextSrc.includes('master3D: threeD.master3D,'), 'Must expose master3D');
  assert(labContextSrc.includes('depthIntensity: threeD.depthIntensity,'), 'Must expose depthIntensity');
  assert(labContextSrc.includes('stylePreset: threeD.stylePreset,'), 'Must expose stylePreset');
  assert(labContextSrc.includes('masterTheme: threeD.masterTheme,'), 'Must expose masterTheme');
  assert(labContextSrc.includes('showSandboxPreview: threeD.showSandboxPreview,'), 'Must expose showSandboxPreview');
  assert(labContextSrc.includes('threeDElements: threeD.elements,'), 'Must expose threeDElements');
  assert(labContextSrc.includes('threeDLighting: threeD.lighting,'), 'Must expose threeDLighting');
  assert(labContextSrc.includes('threeDCamera: threeD.camera,'), 'Must expose threeDCamera');
  assert(labContextSrc.includes('threeDMaterials: threeD.materials,'), 'Must expose threeDMaterials');
  assert(labContextSrc.includes('threeDPhysics: threeD.physics,'), 'Must expose threeDPhysics');
  assert(labContextSrc.includes('set3DExploded,'), 'Must expose set3DExploded');
  assert(labContextSrc.includes('set3DEnvironment,'), 'Must expose set3DEnvironment');
  assert(labContextSrc.includes('set3DSpatialAudio,'), 'Must expose set3DSpatialAudio');
  assert(labContextSrc.includes('set3DPerformance,'), 'Must expose set3DPerformance');
  assert(labContextSrc.includes('export3DConfig,'), 'Must expose export3DConfig');
  assert(labContextSrc.includes('import3DConfig,'), 'Must expose import3DConfig');
  assert(labContextSrc.includes('copy3DCSSVariables,'), 'Must expose copy3DCSSVariables');
});

// 2. Verify ControlCenterPanel.jsx UI
const panelPath = path.join(rootDir, 'src/components/ControlCenterPanel.jsx');
const panelSrc = fs.readFileSync(panelPath, 'utf8');

runTest('ControlCenterPanel imports required Lucide icons', () => {
  const icons = [
    'Box',
    'Cuboid',
    'Sliders',
    'Sparkles',
    'Layers',
    'Compass',
    'ChevronDown',
    'ChevronUp',
    'RotateCcw',
    'Check',
    'Zap',
    'Maximize2',
    'Navigation',
    'UserCheck',
    'FileText',
    'Frame',
    'Grid',
    'Image',
    'ToggleLeft',
    'ToggleRight',
    'Split',
    'CloudFog',
    'Globe',
    'Headphones',
    'Radio',
    'Cpu',
    'Battery',
    'Download',
    'Upload',
    'Copy',
    'Code'
  ];
  for (const ic of icons) {
    assert(panelSrc.includes(ic), `Must import Lucide icon: ${ic}`);
  }
});

runTest('ControlCenterPanel configures threed tab in tabs array', () => {
  assert(panelSrc.includes("id: 'threed'"), "Must have tab with id: 'threed'");
  assert(panelSrc.includes("label: '3D Controls'"), "Must have tab with label: '3D Controls'");
  assert(panelSrc.includes("icon: Box"), "Must use Box icon for 3D tab");
  assert(panelSrc.includes("isMaster3DOn ? `${active3DCount}/10 On` : '2D Mode'"), "Must have dynamic tag");
});

runTest('ControlCenterPanel renders Master 3D Control card', () => {
  assert(panelSrc.includes('Master 3D Mode'), 'Must display Master 3D Mode title');
  assert(panelSrc.includes('3D Active') && panelSrc.includes('Classic 2D'), 'Must display status badges');
  assert(panelSrc.includes('role="switch"'), 'Must have switch role for accessibility');
  assert(panelSrc.includes('aria-label="Master 3D Mode Toggle"'), 'Must have aria-label for master toggle');
  assert(panelSrc.includes('Enable All 3D'), 'Must have Enable All 3D button');
  assert(panelSrc.includes('Disable All 2D'), 'Must have Disable All 2D button');
  assert(panelSrc.includes('Reset Defaults'), 'Must have Reset Defaults button');
});

runTest('ControlCenterPanel renders Depth Intensity slider and Style Presets', () => {
  assert(panelSrc.includes('3D Depth &amp; Perspective Intensity'), 'Must render intensity title');
  assert(panelSrc.includes('min="0.2"'), 'Must have min 0.2');
  assert(panelSrc.includes('max="2.5"'), 'Must have max 2.5');
  assert(panelSrc.includes('step="0.1"'), 'Must have step 0.1');
  assert(panelSrc.includes('3D Style Presets'), 'Must render style presets title');
  assert(panelSrc.includes('Subtle 3D'), 'Must render Subtle 3D preset');
  assert(panelSrc.includes('Isometric 3D'), 'Must render Isometric 3D preset');
  assert(panelSrc.includes('Deep Cinema 3D'), 'Must render Deep Cinema 3D preset');
});

runTest('ControlCenterPanel renders Interactive Mini 3D Sandbox Preview card', () => {
  assert(panelSrc.includes('Interactive 3D Sandbox Preview'), 'Must render sandbox title');
  assert(panelSrc.includes('Live Simulation'), 'Must render Live Simulation badge');
  assert(panelSrc.includes('Hide Sandbox') && panelSrc.includes('Show Sandbox'), 'Must render Show/Hide toggle button');
  assert(panelSrc.includes('onPointerDown={handleSandboxPointerDown}'), 'Must attach pointer down handler');
  assert(panelSrc.includes('onPointerMove={handleSandboxPointerMove}'), 'Must attach pointer move handler');
  assert(panelSrc.includes('Active 3D Mode') && panelSrc.includes('2D Flat Mode'), 'Must render active 3D mode badges');
  assert(panelSrc.includes('Reset Orientation'), 'Must render Reset Orientation button');
  assert(panelSrc.includes('BASE CHASSIS [STRATA -01]'), 'Must render exploded chassis layer');
});

runTest('ControlCenterPanel renders Top Cluster Filter Bar with 4 pills', () => {
  assert(panelSrc.includes('Top Cluster Filter Bar'), 'Must have cluster filter bar comment');
  assert(panelSrc.includes('THREED_CLUSTERS.map'), 'Must map over THREED_CLUSTERS');
  assert(panelSrc.includes('set3DClusterFilter'), 'Must call set3DClusterFilter on click');
});

runTest('ControlCenterPanel renders all 9 single-accordion sections', () => {
  // Section 1
  assert(panelSrc.includes('Element 3D Conversion Toggles (10 Elements)'), 'Must render Section 1');
  assert(panelSrc.includes("toggleAccordionSection('elements')"), 'Must toggle elements section');

  // Section 2
  assert(panelSrc.includes('Lighting &amp; Shadows'), 'Must render Section 2');
  assert(panelSrc.includes("toggleAccordionSection('lighting')"), 'Must toggle lighting section');
  assert(panelSrc.includes('Illumination Preset'), 'Must render Illumination Preset title');
  assert(panelSrc.includes('Light Direction &amp; Angle'), 'Must render Light Direction & Angle title');
  assert(panelSrc.includes('Cursor Spotlight'), 'Must render Cursor Spotlight toggle');
  assert(panelSrc.includes('Shadow Softness &amp; AO'), 'Must render Shadow Softness slider');

  // Section 3
  assert(panelSrc.includes('Camera &amp; Tilt Physics'), 'Must render Section 3');
  assert(panelSrc.includes("toggleAccordionSection('camera')"), 'Must toggle camera section');
  assert(panelSrc.includes('Viewing Angle Preset'), 'Must render Viewing Angle Preset title');
  assert(panelSrc.includes('Perspective FOV Distance'), 'Must render Perspective FOV slider');
  assert(panelSrc.includes('Mouse Parallax Tilt Sensitivity'), 'Must render Tilt Sensitivity slider');
  assert(panelSrc.includes('Continuous Idle Orbit Rotation'), 'Must render Auto Orbit toggle');

  // Section 4
  assert(panelSrc.includes('Materials &amp; Shading'), 'Must render Section 4');
  assert(panelSrc.includes("toggleAccordionSection('materials')"), 'Must toggle materials section');
  assert(panelSrc.includes('Material Shading Preset'), 'Must render Material Shading Preset title');
  assert(panelSrc.includes('Specular Highlight &amp; Glow'), 'Must render Specular Glow slider');
  assert(panelSrc.includes('Bevel &amp; Edge Extrusion'), 'Must render Bevel Extrusion slider');

  // Section 5
  assert(panelSrc.includes('Interaction &amp; Physics'), 'Must render Section 5');
  assert(panelSrc.includes("toggleAccordionSection('physics')"), 'Must toggle physics section');
  assert(panelSrc.includes('Hover Pop Extrusion'), 'Must render Hover Pop slider');
  assert(panelSrc.includes('Elasticity &amp; Spring Physics'), 'Must render Elasticity selector');
  assert(panelSrc.includes('3D Click Press Depression'), 'Must render Click Depression toggle');
  assert(panelSrc.includes('Magnetic Cursor Pull'), 'Must render Magnetic Pull toggle');

  // Section 6: Exploded CAD & Blueprint View
  assert(panelSrc.includes('Exploded CAD &amp; Blueprint View'), 'Must render Section 6');
  assert(panelSrc.includes("toggleAccordionSection('exploded')"), 'Must toggle exploded section');
  assert(panelSrc.includes('Exploded Layer Separation'), 'Must render Exploded Layer Separation switch');
  assert(panelSrc.includes('Blueprint CAD Wireframe Mode'), 'Must render Blueprint wireframe switch');

  // Section 7: Environment & Fog
  assert(panelSrc.includes('Environment &amp; Volumetric Fog'), 'Must render Section 7');
  assert(panelSrc.includes("toggleAccordionSection('environment')"), 'Must toggle environment section');
  assert(panelSrc.includes('3D Atmosphere &amp; Skybox'), 'Must render Skybox selector');
  assert(panelSrc.includes('Stardust Particle Field'), 'Must render Stardust particle switch');

  // Section 8: Spatial Audio & Reverb
  assert(panelSrc.includes('3D Spatial Audio &amp; Reverb'), 'Must render Section 8');
  assert(panelSrc.includes("toggleAccordionSection('spatialAudio')"), 'Must toggle spatialAudio section');
  assert(panelSrc.includes('Binaural HRTF Spatial Panning'), 'Must render Binaural HRTF switch');
  assert(panelSrc.includes('Acoustic Room Simulation'), 'Must render Acoustic Room presets');

  // Section 9: Performance & GPU
  assert(panelSrc.includes('Performance &amp; GPU Acceleration'), 'Must render Section 9');
  assert(panelSrc.includes("toggleAccordionSection('performance')"), 'Must toggle performance section');
  assert(panelSrc.includes('Rendering Frame Rate Target'), 'Must render FPS target presets');
  assert(panelSrc.includes('Idle Motion Throttling'), 'Must render Idle throttling switch');
});

runTest('ControlCenterPanel renders 3D Profile, Export & Developer Toolkit Card', () => {
  assert(panelSrc.includes('3D Profile, Export &amp; Developer Toolkit'), 'Must render toolkit title');
  assert(panelSrc.includes('Export 3D Profile (.json)'), 'Must render export button');
  assert(panelSrc.includes('Import Profile (.json)'), 'Must render import button');
  assert(panelSrc.includes('Copy CSS Custom Properties'), 'Must render copy CSS properties button');
});

runTest('ControlCenterPanel renders all 3 collapsible element categories with 10 toggles', () => {
  assert(panelSrc.includes('Navigation & Floating Controls'), 'Must have category 1');
  assert(panelSrc.includes('Hero & Identity'), 'Must have category 2');
  assert(panelSrc.includes('Containers & Content'), 'Must have category 3');
  
  const elementKeys = [
    'floatingButton',
    'navbarItems',
    'navbarIcons',
    'resumeButton',
    'profilePic',
    'header',
    'subHeader',
    'description',
    'container',
    'containerContent'
  ];
  for (const k of elementKeys) {
    assert(panelSrc.includes(`key: '${k}'`), `Must have category item key: ${k}`);
  }
});

// 3. Verify LabStudioDrawer.jsx
const drawerPath = path.join(rootDir, 'src/components/LabStudioDrawer.jsx');
const drawerSrc = fs.readFileSync(drawerPath, 'utf8');

runTest('LabStudioDrawer includes 3D in header subtitle', () => {
  assert(drawerSrc.includes('Audio, Cursors, Hero, 3D, Preferences & Visuals'), 'Must include 3D in drawer header');
});

// 4. Dynamic Runtime Tests for 3D state, clamps & normalizers
const { createServer } = await import('vite');
const vite = await createServer();
const labContextModule = await vite.ssrLoadModule('./src/context/LabContext.jsx');
await vite.close();

const {
  clampDepthIntensity,
  normalizeStylePreset,
  normalizeThreeDElements,
  normalize3DMasterTheme,
  normalize3DLighting,
  normalize3DCamera,
  normalize3DMaterials,
  normalize3DPhysics,
  normalize3DExploded,
  normalize3DEnvironment,
  normalize3DSpatialAudio,
  normalize3DPerformance,
  normalize3DClusterFilter,
  loadSavedControlCenterConfig,
  FACTORY_DEFAULTS
} = labContextModule;

runTest('clampDepthIntensity strictly clamps values between 0.2 and 2.5', () => {
  assert.strictEqual(clampDepthIntensity(1.0), 1.0);
  assert.strictEqual(clampDepthIntensity(0.2), 0.2);
  assert.strictEqual(clampDepthIntensity(2.5), 2.5);
  assert.strictEqual(clampDepthIntensity(0.05), 0.2, 'Underflow clamps to 0.2');
  assert.strictEqual(clampDepthIntensity(5.0), 2.5, 'Overflow clamps to 2.5');
  assert.strictEqual(clampDepthIntensity(-1), 0.2, 'Negative clamps to 0.2');
  assert.strictEqual(clampDepthIntensity('1.8'), 1.8, 'Numeric string parsed');
  assert.strictEqual(clampDepthIntensity(NaN), 1.0, 'NaN falls back to 1.0');
  assert.strictEqual(clampDepthIntensity(null), 1.0, 'null falls back to 1.0');
  assert.strictEqual(clampDepthIntensity('invalid'), 1.0, 'invalid string falls back to 1.0');
});

runTest('normalizeStylePreset validates presets with fallback to subtle', () => {
  assert.strictEqual(normalizeStylePreset('subtle'), 'subtle');
  assert.strictEqual(normalizeStylePreset('isometric'), 'isometric');
  assert.strictEqual(normalizeStylePreset('deep'), 'deep');
  assert.strictEqual(normalizeStylePreset('  ISOMETRIC  '), 'isometric', 'Case-insensitive trim');
  assert.strictEqual(normalizeStylePreset('unknown'), 'subtle', 'Unknown falls back to subtle');
  assert.strictEqual(normalizeStylePreset(null), 'subtle');
  assert.strictEqual(normalizeStylePreset(123), 'subtle');
});

runTest('normalizeThreeDElements normalizes corrupt or partial element objects', () => {
  const normalizedEmpty = normalizeThreeDElements({});
  assert.strictEqual(normalizedEmpty.floatingButton, false);
  assert.strictEqual(normalizedEmpty.navbarItems, false);
  assert.strictEqual(normalizedEmpty.containerContent, false);

  const partial = normalizeThreeDElements({ floatingButton: true, resumeButton: true, invalidKey: true });
  assert.strictEqual(partial.floatingButton, true);
  assert.strictEqual(partial.resumeButton, true);
  assert.strictEqual(partial.navbarItems, false);
  assert.strictEqual(partial.invalidKey, undefined);
});

runTest('loadSavedControlCenterConfig returns clean threeD slice on default environment', () => {
  const config = loadSavedControlCenterConfig();
  assert(config.threeD, 'Must have threeD slice');
  assert.strictEqual(config.threeD.master3D, false);
  assert.strictEqual(config.threeD.depthIntensity, 1.0);
  assert.strictEqual(config.threeD.stylePreset, 'subtle');
  assert.strictEqual(config.threeD.masterTheme, 'apple-glass');
  assert.strictEqual(config.threeD.showSandboxPreview, true);
  assert.strictEqual(Object.keys(config.threeD.elements).length, 10);
  assert.strictEqual(config.threeD.lighting.preset, 'studio-soft');
  assert.strictEqual(config.threeD.lighting.angle, 45);
  assert.strictEqual(config.threeD.camera.anglePreset, 'isometric');
  assert.strictEqual(config.threeD.camera.perspectiveFOV, 1000);
  assert.strictEqual(config.threeD.materials.preset, 'glass-acrylic');
  assert.strictEqual(config.threeD.materials.bevelExtrusion, 3);
  assert.strictEqual(config.threeD.physics.hoverPop, 12);
  assert.strictEqual(config.threeD.physics.elasticity, 'snappy');
  assert.strictEqual(config.threeD.exploded.enabled, false);
  assert.strictEqual(config.threeD.exploded.separationDistance, 45);
  assert.strictEqual(config.threeD.environment.skybox, 'dark-studio');
  assert.strictEqual(config.threeD.environment.fogDensity, 30);
  assert.strictEqual(config.threeD.spatialAudio.roomSize, 'studio');
  assert.strictEqual(config.threeD.performance.fpsTarget, 60);
});

runTest('normalize3DMasterTheme validates themes with fallback', () => {
  assert.strictEqual(normalize3DMasterTheme('apple-glass'), 'apple-glass');
  assert.strictEqual(normalize3DMasterTheme('cyber-neon'), 'cyber-neon');
  assert.strictEqual(normalize3DMasterTheme('studio-matte'), 'studio-matte');
  assert.strictEqual(normalize3DMasterTheme('floating-hologram'), 'floating-hologram');
  assert.strictEqual(normalize3DMasterTheme('invalid-theme'), 'apple-glass');
  assert.strictEqual(normalize3DMasterTheme(null), 'apple-glass');
});

runTest('normalize3DLighting clamps angles and validates presets', () => {
  const norm = normalize3DLighting({ preset: 'cyber-neon', angle: 500, shadowSoftness: 2.0 });
  assert.strictEqual(norm.preset, 'cyber-neon');
  assert.strictEqual(norm.angle, 360, 'Angle clamped to 360');
  assert.strictEqual(norm.shadowSoftness, 1.0, 'Shadow softness clamped to 1.0');
});

runTest('normalize3DCamera clamps perspective and tilt sensitivity', () => {
  const norm = normalize3DCamera({ anglePreset: 'cinematic', perspectiveFOV: 2500, tiltSensitivity: 80, orbitSpeed: 4.5 });
  assert.strictEqual(norm.anglePreset, 'cinematic');
  assert.strictEqual(norm.perspectiveFOV, 2000, 'FOV clamped to 2000');
  assert.strictEqual(norm.tiltSensitivity, 40, 'Tilt sensitivity clamped to 40');
  assert.strictEqual(norm.orbitSpeed, 3.0, 'Orbit speed clamped to 3.0');
});

runTest('normalize3DMaterials clamps glow and bevel', () => {
  const norm = normalize3DMaterials({ preset: 'metallic-gloss', specularGlow: 1.5, bevelExtrusion: 15 });
  assert.strictEqual(norm.preset, 'metallic-gloss');
  assert.strictEqual(norm.specularGlow, 1.0, 'Glow clamped to 1.0');
  assert.strictEqual(norm.bevelExtrusion, 8, 'Bevel clamped to 8');
});

runTest('normalize3DPhysics clamps hover pop and validates elasticity', () => {
  const norm = normalize3DPhysics({ hoverPop: 100, elasticity: 'bouncy', clickDepression: false, magneticPull: true });
  assert.strictEqual(norm.hoverPop, 32, 'Hover pop clamped to 32');
  assert.strictEqual(norm.elasticity, 'bouncy');
  assert.strictEqual(norm.clickDepression, false);
  assert.strictEqual(norm.magneticPull, true);
});

runTest('normalize3DExploded clamps separation distance and validates blueprint mode', () => {
  const norm = normalize3DExploded({ enabled: true, separationDistance: 250, blueprintMode: true, layerStagger: 80, ghostOpacity: 2.0 });
  assert.strictEqual(norm.enabled, true);
  assert.strictEqual(norm.separationDistance, 120, 'Clamped to 120');
  assert.strictEqual(norm.blueprintMode, true);
  assert.strictEqual(norm.layerStagger, 30, 'Clamped to 30');
  assert.strictEqual(norm.ghostOpacity, 1.0, 'Clamped to 1.0');
});

runTest('normalize3DEnvironment clamps fog density and validates skybox', () => {
  const norm = normalize3DEnvironment({ skybox: 'cyber-city', fogDensity: 150, stardustParticles: true, particleCount: 300, depthOfFieldBlur: 20 });
  assert.strictEqual(norm.skybox, 'cyber-city');
  assert.strictEqual(norm.fogDensity, 100, 'Clamped to 100');
  assert.strictEqual(norm.stardustParticles, true);
  assert.strictEqual(norm.particleCount, 150, 'Clamped to 150');
  assert.strictEqual(norm.depthOfFieldBlur, 10, 'Clamped to 10');
});

runTest('normalize3DSpatialAudio clamps reverb and validates room sizes', () => {
  const norm = normalize3DSpatialAudio({ binauralPanning: true, roomSize: 'cathedral', reverbIntensity: 3.5 });
  assert.strictEqual(norm.binauralPanning, true);
  assert.strictEqual(norm.roomSize, 'cathedral');
  assert.strictEqual(norm.reverbIntensity, 1.0, 'Clamped to 1.0');
});

runTest('normalize3DPerformance validates target FPS and flags', () => {
  const norm = normalize3DPerformance({ fpsTarget: 144, autoThrottleIdle: true, lowPowerThreshold: true });
  assert.strictEqual(norm.fpsTarget, 60, 'Invalid FPS falls back to 60');
  assert.strictEqual(norm.autoThrottleIdle, true);
  assert.strictEqual(norm.lowPowerThreshold, true);
  
  const norm120 = normalize3DPerformance({ fpsTarget: 120 });
  assert.strictEqual(norm120.fpsTarget, 120);
});

runTest('normalize3DClusterFilter validates filter values', () => {
  assert.strictEqual(normalize3DClusterFilter('all'), 'all');
  assert.strictEqual(normalize3DClusterFilter('design'), 'design');
  assert.strictEqual(normalize3DClusterFilter('physics'), 'physics');
  assert.strictEqual(normalize3DClusterFilter('system'), 'system');
  assert.strictEqual(normalize3DClusterFilter('unknown'), 'all');
  assert.strictEqual(normalize3DClusterFilter(null), 'all');
});

console.log('\n================================================================');
console.log(`  VERIFICATION RESULTS: ${passCount} PASSED | ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
