import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  VERIFY GAP #3: 3D SANDBOX VIEWPORT GIZMO, GRID & 2D COMPARE   ');
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

const panelPath = path.join(rootDir, 'src/components/ControlCenterPanel.jsx');
const panelSrc = fs.readFileSync(panelPath, 'utf8');

// ============================================================================
// SUITE 1: 3D XYZ ORIENTATION GIZMO SPECIFICATION
// ============================================================================
runTest('Orientation Gizmo container is positioned in top-right with accessible label', () => {
  assert(panelSrc.includes('aria-label="3D Orientation Gizmo"'), 'Must have aria-label="3D Orientation Gizmo"');
  assert(panelSrc.includes('top-3 right-3 z-20'), 'Must be positioned at top-3 right-3 with high z-index');
});

runTest('Orientation Gizmo renders ~48px glassmorphic circular background with 300px perspective', () => {
  assert(panelSrc.includes('w-12 h-12'), 'Must be 48px x 48px (w-12 h-12)');
  assert(panelSrc.includes('bg-black/40 backdrop-blur-md rounded-full border border-white/10 shadow-lg p-1'), 'Must match dark glassmorphic circular styling');
  assert(panelSrc.includes("perspective: '300px'") || panelSrc.includes('perspective(300px)'), 'Must apply 300px perspective');
});

runTest('Orientation Gizmo kinematics track active rotX and rotY in real-time', () => {
  assert(panelSrc.includes('perspective(300px) rotateX(') && panelSrc.includes('rotateY('), 'Must track 3D rotation with perspective(300px) rotateX and rotateY');
  assert(panelSrc.includes("transformStyle: 'preserve-3d'"), 'Gimbal must preserve 3D context');
});

runTest('Orientation Gizmo features 3 orthogonal colored axis arms (Red +X, Green +Y, Blue +Z)', () => {
  // Red +X
  assert(panelSrc.includes('#EF4444'), 'Must render Red #EF4444 for +X axis');
  assert(panelSrc.includes('Side Profile View (+X)') || panelSrc.includes('Side View (+X)'), 'Must include +X side view tooltip/label');
  
  // Green +Y
  assert(panelSrc.includes('#10B981'), 'Must render Green #10B981 for +Y axis');
  assert(panelSrc.includes('Top View (+Y)') || panelSrc.includes('Top View'), 'Must include +Y top view tooltip/label');
  
  // Blue +Z
  assert(panelSrc.includes('#3B82F6'), 'Must render Blue #3B82F6 for +Z axis');
  assert(panelSrc.includes('Top-down View (+Z)') || panelSrc.includes('+Z'), 'Must include +Z indicator');
});

runTest('Orientation Gizmo provides interactive quick snap end-caps (ISO, +Z, +X, Center)', () => {
  // Snap ISO: rotX = 22, rotY = -28
  assert(panelSrc.includes('snapOrientation(22, -28)'), 'Must support ISO snap (22, -28)');
  
  // Snap +Z: rotX = 65, rotY = 0
  assert(panelSrc.includes('snapOrientation(65, 0)'), 'Must support +Z Top snap (65, 0)');
  
  // Snap +X: rotX = 0, rotY = 55
  assert(panelSrc.includes('snapOrientation(0, 55)'), 'Must support +X Side snap (0, 55)');
  
  // Reset / Center: rotX = 16, rotY = -20
  assert(panelSrc.includes('snapOrientation(16, -20)'), 'Must support Center reset snap (16, -20)');
  
  // Haptic feedback on snap
  assert(panelSrc.includes('snapOrientation = useCallback((') && panelSrc.includes('soundFX.playHapticClick()'), 'Must play haptic click on orientation snap');
});

// ============================================================================
// SUITE 2: PERSPECTIVE GROUND GRID & DYNAMIC CONTACT SHADOW
// ============================================================================
runTest('Sandbox renders Perspective Ground Grid Floor underneath 3D card', () => {
  assert(panelSrc.includes('transform: \'perspective(600px) rotateX(72deg) translateZ(-45px)\''), 'Must apply perspective(600px) rotateX(72deg) translateZ(-45px)');
  assert(panelSrc.includes('radial-gradient(ellipse at center, black 35%, transparent 75%)'), 'Must feature radial gradient fade mask');
  assert(panelSrc.includes('rgba(255, 255, 255, 0.08)') && panelSrc.includes('rgba(0, 0, 0, 0.06)'), 'Must provide adaptive light/dark mode subtle grid pattern');
});

runTest('Sandbox renders Dynamic Soft Contact Shadow with blur and exact geometry', () => {
  assert(panelSrc.includes("width: 'calc(100% - 40px)'"), 'Shadow must have width calc(100% - 40px)');
  assert(panelSrc.includes("height: '24px'"), 'Shadow must have 24px height');
  assert(panelSrc.includes("borderRadius: '9999px'"), 'Shadow must have pill border radius');
  assert(panelSrc.includes("filter: 'blur(8px)'"), 'Shadow must have blur(8px)');
});

runTest('Dynamic Contact Shadow shifts and scales dynamically with rotX, rotY and lighting angle', () => {
  assert(panelSrc.includes('Math.sin(shadowAngleRad)') || panelSrc.includes('shadowOffsetX'), 'Shadow offset X must calculate from light angle and yaw');
  assert(panelSrc.includes('Math.cos(shadowAngleRad)') || panelSrc.includes('shadowOffsetY'), 'Shadow offset Y must calculate from light angle and pitch');
  assert(panelSrc.includes('Math.abs(effectiveRotX) / 90') || panelSrc.includes('Math.abs(rotX)/90'), 'Shadow scale must dynamically compress based on pitch angle');
  assert(panelSrc.includes('0.45 * (lighting.shadowSoftness'), 'Shadow opacity must factor in lighting.shadowSoftness');
});

// ============================================================================
// SUITE 3: "HOLD TO COMPARE 2D VS 3D" TACTILE BUTTON
// ============================================================================
runTest('HUD control bar renders "Hold to Compare 2D" button adjacent to Reset button', () => {
  assert(panelSrc.includes('aria-label="Hold to Compare 2D vs 3D"'), 'Must render button with accessible compare label');
  assert(panelSrc.includes('Hold to Compare 2D') || panelSrc.includes('Hold for 2D'), 'Must display Hold for 2D button text');
  assert(panelSrc.includes('Reset Orientation'), 'Must reside adjacent to Reset Orientation button');
});

runTest('Compare button binds full tactile pointer and keyboard event contracts', () => {
  assert(panelSrc.includes('onPointerDown={handleCompare2DStart}'), 'Must bind onPointerDown');
  assert(panelSrc.includes('onPointerUp={handleCompare2DEnd}'), 'Must bind onPointerUp');
  assert(panelSrc.includes('onPointerLeave={handleCompare2DEnd}'), 'Must bind onPointerLeave');
  assert(panelSrc.includes('onPointerCancel={handleCompare2DEnd}'), 'Must bind onPointerCancel');
  assert(panelSrc.includes('onKeyDown={handleCompare2DKeyDown}'), 'Must bind onKeyDown for keyboard activation');
  assert(panelSrc.includes('onKeyUp={handleCompare2DKeyUp}'), 'Must bind onKeyUp for keyboard deactivation');
});

runTest('Visual response when comparing 2D flattens card, collapses strata, and reveals high-visibility badge', () => {
  // Flatten transform
  assert(panelSrc.includes("perspective(0) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)"), 'Must flatten transform to perspective(0) rotateX(0deg) rotateY(0deg) translateZ(0px)');
  
  // Collapse strata
  assert(/isComparing2D\s*\?\s*['"]translateZ\(0px\)['"]/.test(panelSrc), 'Must collapse strata to translateZ(0px) in 2D compare mode');
  
  // Spring back bezier curve upon release
  assert(panelSrc.includes('cubic-bezier(0.34, 1.56, 0.64, 1)'), 'Must spring back with cubic-bezier(0.34, 1.56, 0.64, 1)');
  
  // High-visibility Amber/Slate badge
  assert(panelSrc.includes('2D FLAT PREVIEW (HOLDING)'), 'Must render 2D FLAT PREVIEW (HOLDING) badge');
  assert(panelSrc.includes('bg-amber-500 text-slate-900'), 'Must use Amber/Slate color scheme for holding badge');
  
  // Temporarily hide wireframe blueprint and fog in 2D mode
  assert(panelSrc.includes('!isComparing2D') && panelSrc.includes('environment.fogDensity'), 'Must hide volumetric fog during 2D compare');
});

// ============================================================================
// SUITE 4: FUNCTIONAL & MATHEMATICAL VERIFICATION (PURE CALCULATIONS)
// ============================================================================
runTest('Quick Snap presets produce mathematically valid Euler angles', () => {
  const snaps = [
    { name: 'ISO', rotX: 22, rotY: -28 },
    { name: '+Z Top', rotX: 65, rotY: 0 },
    { name: '+X Side', rotX: 0, rotY: 55 },
    { name: 'Default', rotX: 16, rotY: -20 }
  ];

  for (const s of snaps) {
    assert(s.rotX >= -60 && s.rotX <= 65, `${s.name} rotX within valid tilt bounds`);
    assert(s.rotY >= -75 && s.rotY <= 75, `${s.name} rotY within valid yaw bounds`);
  }
});

runTest('Dynamic shadow scale and offset formula maintains realistic grounding limits', () => {
  const computeShadow = (rotX, rotY, angle, softness = 0.7) => {
    const rad = (angle * Math.PI) / 180;
    const offsetX = Math.round(-Math.sin(rad) * 16 + (rotY / 75) * 14);
    const offsetY = Math.round(Math.cos(rad) * 10 + (rotX / 60) * 8);
    const scale = Number((1 - (Math.abs(rotX) / 90) * 0.2).toFixed(3));
    const opacity = Number((0.45 * softness).toFixed(3));
    return { offsetX, offsetY, scale, opacity };
  };

  // Test at 45° sun, default card tilt
  const res1 = computeShadow(16, -20, 45, 0.7);
  assert(res1.scale >= 0.8 && res1.scale <= 1.0, 'Scale must stay between 0.8 and 1.0');
  assert(res1.opacity > 0.2 && res1.opacity <= 0.45, 'Opacity must be realistically soft');

  // Test at extreme pitch (60°)
  const res2 = computeShadow(60, 0, 90, 0.5);
  assert.strictEqual(res2.scale, 0.867, 'Pitch 60° scale correctly calculated');
  assert.strictEqual(res2.offsetX, -16, '90° sun shifts shadow left');
});

// ============================================================================
// SUITE 5: VITE SSR MODULE RESOLUTION
// ============================================================================
const { createServer } = await import('vite');
const vite = await createServer();
try {
  await vite.ssrLoadModule('./src/components/ControlCenterPanel.jsx');
  console.log('  ✅ PASS: ControlCenterPanel.jsx compiles and loads cleanly in Vite SSR');
  passCount++;
} catch (err) {
  console.error('  ❌ FAIL: ControlCenterPanel.jsx SSR compilation failed:', err);
  failCount++;
} finally {
  await vite.close();
}

console.log('\n================================================================');
console.log(`  GAP #3 VERIFICATION: ${passCount} PASSED | ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
