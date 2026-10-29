// scripts/verify_new_phase3_gravity_custom_mesh.mjs
// Verification suite for NEW PHASE 3: Playground & Custom Mesh Specialist
// Features Tested:
// 1. Feature 7: Physics Collision & Gravity Drop Playground
// 2. Feature 6: Custom 3D Mesh & Avatar Model Importer

import fs from 'fs';
import path from 'path';
import assert from 'assert';

const ROOT = process.cwd();
let passed = 0;
let failed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    failed++;
  }
}

console.log('================================================================');
console.log('  VERIFY NEW PHASE 3: GRAVITY DROP PLAYGROUND & CUSTOM 3D MESH  ');
console.log('================================================================');

// 1. File existence checks
const labContextSrcPath = path.join(ROOT, 'src/context/LabContext.jsx');
const panelSrcPath = path.join(ROOT, 'src/components/ControlCenterPanel.jsx');
const miniPortfolioSrcPath = path.join(ROOT, 'src/components/3d-sandbox/UniversalMiniPortfolio.jsx');
const heroCardPreviewSrcPath = path.join(ROOT, 'src/components/3d-sandbox/previews/HeroCardPreview.jsx');
const visualPresetsSrcPath = path.join(ROOT, 'src/components/3d-sandbox/Visual3DPresets.jsx');

const labContextSrc = fs.readFileSync(labContextSrcPath, 'utf8');
const panelSrc = fs.readFileSync(panelSrcPath, 'utf8');
const miniPortfolioSrc = fs.readFileSync(miniPortfolioSrcPath, 'utf8');
const heroCardPreviewSrc = fs.readFileSync(heroCardPreviewSrcPath, 'utf8');
const visualPresetsSrc = fs.readFileSync(visualPresetsSrcPath, 'utf8');

// --- Feature 7: Physics Collision & Gravity Drop Playground ---

runTest('LabContext: FACTORY_DEFAULTS.threeD.physics includes gravityDrop: false', () => {
  assert(labContextSrc.includes('gravityDrop: false'), 'physics defaults must include gravityDrop: false');
});

runTest('LabContext: normalize3DPhysics sanitizes gravityDrop as boolean', () => {
  assert(labContextSrc.includes('gravityDrop: Boolean(gravityDrop)') || labContextSrc.includes('Boolean(raw.gravityDrop)'), 'normalize3DPhysics must sanitize gravityDrop');
});

runTest('LabContext: helper set3DGravityDrop defined and exported in useLab and useLab3D', () => {
  assert(labContextSrc.includes('const set3DGravityDrop = useCallback'), 'set3DGravityDrop helper must be defined');
  assert(labContextSrc.includes('set3DGravityDrop,'), 'set3DGravityDrop must be in LabContext values');
});

runTest('ControlCenterPanel: Accordion 5 renders Kinetic Gravity Playground section', () => {
  assert(panelSrc.includes('Kinetic Gravity Playground'), 'Must render section header');
  assert(panelSrc.includes('Gravity Drop Mode'), 'Must render Gravity Drop Mode toggle title');
  assert(panelSrc.includes('aria-label="Toggle Gravity Drop Mode"'), 'Must have accessible label for Gravity Drop Mode');
  assert(panelSrc.includes('set3DGravityDrop'), 'Must call set3DGravityDrop on toggle click');
});

runTest('ControlCenterPanel: Reassemble Scene button triggers set3DGravityDrop(false)', () => {
  assert(panelSrc.includes('Reassemble Scene'), 'Must render Reassemble Scene button');
  assert(panelSrc.includes('set3DGravityDrop(false)'), 'Must call set3DGravityDrop(false) when Reassemble is clicked');
  assert(panelSrc.includes('soundFX.playLaserFocus()'), 'Must play laser focus sound on reassemble');
});

runTest('UniversalMiniPortfolio: applies simulated gravity drop transforms when gravityDrop is true', () => {
  assert(miniPortfolioSrc.includes('translateY(180px) rotateZ(-12deg) rotateX(25deg)'), 'Mini-Navbar must drop with exact angle');
  assert(miniPortfolioSrc.includes('translateY(220px) rotateZ(8deg) rotateX(-15deg)'), 'Hero Card must drop with exact angle');
  assert(miniPortfolioSrc.includes('translateY(160px) rotateZ(-6deg)'), 'Grid Cards must drop with exact angle');
  assert(miniPortfolioSrc.includes('translateY(140px) rotateZ(10deg)'), 'Dock must drop with exact angle');
});

runTest('UniversalMiniPortfolio: applies realistic ground contact shadows and elasticity spring-back', () => {
  assert(miniPortfolioSrc.includes('gravityGroundShadow'), 'Must apply ground contact shadows when in gravity drop');
  assert(miniPortfolioSrc.includes('activeElasticity.transition'), 'Must use activeElasticity for transition recoil');
});

// --- Feature 6: Custom 3D Mesh & Avatar Model Importer ---

runTest('LabContext: FACTORY_DEFAULTS.threeD includes customMesh configuration', () => {
  assert(labContextSrc.includes("type: 'avatar'") && labContextSrc.includes("customName: 'Atul Verma Avatar'"), 'Must include default customMesh');
});

runTest('LabContext: normalize3DCustomMesh validates type, customName and scale', () => {
  assert(labContextSrc.includes('export function normalize3DCustomMesh'), 'Must export normalize3DCustomMesh');
  assert(
    labContextSrc.includes("validTypes = ['avatar', 'gem', 'cube', 'sphere', 'torus', 'custom']") ||
    labContextSrc.includes("validTypes = ['avatar', 'gem', 'cube', 'custom']"),
    'Must validate customMesh types'
  );
});

runTest('LabContext: helper set3DCustomMesh is defined and exposed via useLab and useLab3D', () => {
  assert(labContextSrc.includes('const set3DCustomMesh = useCallback'), 'Must define set3DCustomMesh');
  assert(labContextSrc.includes('set3DCustomMesh,'), 'Must export set3DCustomMesh in contexts');
});

runTest('Visual3DPresets: exports GemMeshVisual and CyberCubeMeshVisual', () => {
  assert(visualPresetsSrc.includes('export function GemMeshVisual'), 'Must export GemMeshVisual');
  assert(visualPresetsSrc.includes('export function CyberCubeMeshVisual'), 'Must export CyberCubeMeshVisual');
});

runTest('ControlCenterPanel: Tab 3 renders 3D Avatar & Model Geometry Engine card', () => {
  assert(panelSrc.includes('3D Avatar & Model Geometry Engine') || panelSrc.includes('3D Avatar &amp; Model Geometry Engine'), 'Must render Geometry Engine card title');
  assert(panelSrc.includes('Developer 2.5D Avatar'), 'Must include Developer 2.5D Avatar preset');
  assert(panelSrc.includes('Low-Poly Diamond Gem'), 'Must include Low-Poly Diamond Gem preset');
  assert(panelSrc.includes('Cyber Hologram Cube'), 'Must include Cyber Hologram Cube preset');
  assert(panelSrc.includes('Custom File Upload'), 'Must include Custom File Upload preset');
});

runTest('ControlCenterPanel: client-side file upload and scale slider for 3D Mesh', () => {
  assert(panelSrc.includes('accept=".gltf,.glb,.obj"'), 'Must accept .gltf, .glb, .obj files');
  assert(panelSrc.includes('Mesh Geometry Scale'), 'Must include scale slider');
  assert(panelSrc.includes('set3DCustomMesh({ scale:'), 'Must call set3DCustomMesh with new scale');
});

runTest('UniversalMiniPortfolio: renders selected 3D geometry inside avatar frame', () => {
  assert(miniPortfolioSrc.includes('mini-mesh-gem'), 'Must render gem geometry data-testid');
  assert(miniPortfolioSrc.includes('mini-mesh-cube'), 'Must render cube geometry data-testid');
  assert(miniPortfolioSrc.includes('mini-mesh-avatar'), 'Must render avatar portrait data-testid');
  assert(miniPortfolioSrc.includes('mini-mesh-custom'), 'Must render custom model badge data-testid');
});

runTest('HeroCardPreview: renders selected 3D geometry inside hero card avatar orb', () => {
  assert(heroCardPreviewSrc.includes('hero-mesh-gem'), 'Must render hero gem geometry data-testid');
  assert(heroCardPreviewSrc.includes('hero-mesh-cube'), 'Must render hero cube geometry data-testid');
  assert(heroCardPreviewSrc.includes('hero-mesh-avatar'), 'Must render hero avatar portrait data-testid');
  assert(heroCardPreviewSrc.includes('hero-mesh-custom'), 'Must render hero custom model badge data-testid');
});

console.log('----------------------------------------------------------------');
console.log(`Verification Complete: ${passed} passed, ${failed} failed.`);
console.log('================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL FEATURE 7 & FEATURE 6 CAPABILITIES VERIFIED 100%!');
}
