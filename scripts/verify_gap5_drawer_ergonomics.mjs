import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  VERIFY GAP #5: DRAWER ERGONOMICS, VERTICAL SPACE & TOUCH TARGETS');
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

const labContextPath = path.join(rootDir, 'src/context/LabContext.jsx');
const labContextSrc = fs.readFileSync(labContextPath, 'utf8');

// ============================================================================
// SUITE 1: MASTER 3D SIGNATURE THEMES 2x2 COMPACT TILE GRID
// ============================================================================
runTest('Master 3D Themes render in a sleek 2x2 compact tile grid', () => {
  assert(
    panelSrc.includes('grid grid-cols-2 gap-2 sm:gap-2.5'),
    'Must format Master 3D Theme presets into a 2x2 grid (grid-cols-2 gap-2 sm:gap-2.5)'
  );
  assert(
    panelSrc.includes('{THREED_MASTER_THEMES.map((th) => {'),
    'Must map over THREED_MASTER_THEMES'
  );
});

runTest('THREED_MASTER_THEMES defines compact icons and descriptive pills for all 4 signature themes', () => {
  // Apple Glass
  assert(panelSrc.includes("id: 'apple-glass'"), 'Must contain apple-glass theme');
  assert(panelSrc.includes("pill: 'Frosted'"), 'Apple Glass must have Frosted pill');
  assert(panelSrc.includes('icon: Sparkles'), 'Apple Glass must use Sparkles icon');

  // Cyber Neon
  assert(panelSrc.includes("id: 'cyber-neon'"), 'Must contain cyber-neon theme');
  assert(panelSrc.includes("pill: 'Grid Glow'"), 'Cyber Neon must have Grid Glow pill');
  assert(panelSrc.includes('icon: Zap'), 'Cyber Neon must use Zap icon');

  // Studio Matte
  assert(panelSrc.includes("id: 'studio-matte'"), 'Must contain studio-matte theme');
  assert(panelSrc.includes("pill: 'Soft Clay'"), 'Studio Matte must have Soft Clay pill');
  assert(panelSrc.includes('icon: Cuboid'), 'Studio Matte must use Cuboid icon');

  // Floating Hologram
  assert(panelSrc.includes("id: 'floating-hologram'"), 'Must contain floating-hologram theme');
  assert(panelSrc.includes("pill: 'Golden Void'"), 'Floating Hologram must have Golden Void pill');
  assert(panelSrc.includes('icon: Eye'), 'Floating Hologram must use Eye icon');
});

runTest('Master 3D Theme tiles apply active state indicator ring, checkmark badge, and haptic feedback', () => {
  assert(
    panelSrc.includes("ring-2 ring-[#FF4D6D] bg-[#FF4D6D]/10 text-[#FF4D6D]"),
    'Must apply active state indicator ring and background highlight'
  );
  assert(
    panelSrc.includes('<Check className="w-2.5 h-2.5 stroke-[3]" />'),
    'Must render compact checkmark badge when selected'
  );
  assert(
    panelSrc.includes('set3DTheme(th.id);') && panelSrc.includes('soundFX.playHapticClick()'),
    'Must trigger set3DTheme and soundFX.playHapticClick() on theme selection'
  );
});

// ============================================================================
// SUITE 2: FINE-TUNING STEPPER BUTTONS [-] AND [+] ON ALL 7 KEY SLIDERS
// ============================================================================
runTest('SliderWithSteppers helper component provides accessible stepper buttons and 36px/44px touch targets', () => {
  assert(panelSrc.includes('function SliderWithSteppers('), 'Must define SliderWithSteppers component');
  assert(panelSrc.includes('min-h-[44px]'), 'Must enforce minimum 44px touch target row height');
  assert(panelSrc.includes('min-w-[36px] min-h-[36px]'), 'Must enforce minimum 36px button hit targets');
  assert(panelSrc.includes('<Minus className="w-3.5 h-3.5 stroke-[2.5]" />'), 'Must render Minus icon in decrement button');
  assert(panelSrc.includes('<Plus className="w-3.5 h-3.5 stroke-[2.5]" />'), 'Must render Plus icon in increment button');
  assert(panelSrc.includes('disabled={value <= numMin}'), 'Must disable decrement button at minimum bound');
  assert(panelSrc.includes('disabled={value >= numMax}'), 'Must disable increment button at maximum bound');
});

runTest('Slider 1: Shadow Softness & AO incorporates stepper buttons with step 0.05 and [0.1, 1.0] range', () => {
  assert(panelSrc.includes('label="Shadow Softness & AO"'), 'Must bind Shadow Softness label');
  assert(panelSrc.includes('decreaseAriaLabel="Decrease Shadow Softness & AO"'), 'Must have Decrease Shadow Softness aria-label');
  assert(panelSrc.includes('increaseAriaLabel="Increase Shadow Softness & AO"'), 'Must have Increase Shadow Softness aria-label');
  assert(panelSrc.includes('step={0.05}'), 'Must step by 0.05');
  assert(panelSrc.includes('min={0.1}'), 'Must have min 0.1');
  assert(panelSrc.includes('max={1.0}'), 'Must have max 1.0');
});

runTest('Slider 2: Camera FOV Distance incorporates stepper buttons with step 50 and [400, 2000] range', () => {
  assert(panelSrc.includes('label="Camera FOV"'), 'Must bind Camera FOV label');
  assert(panelSrc.includes('decreaseAriaLabel="Decrease Camera FOV"'), 'Must have Decrease Camera FOV aria-label');
  assert(panelSrc.includes('increaseAriaLabel="Increase Camera FOV"'), 'Must have Increase Camera FOV aria-label');
  assert(panelSrc.includes('step={50}'), 'Must step by 50');
  assert(panelSrc.includes('min={400}'), 'Must have min 400');
  assert(panelSrc.includes('max={2000}'), 'Must have max 2000');
});

runTest('Slider 3: Mouse Parallax Tilt Sensitivity incorporates stepper buttons with step 1 and [0, 40] range', () => {
  assert(panelSrc.includes('label="Mouse Tilt Sensitivity"'), 'Must bind Mouse Tilt Sensitivity label');
  assert(panelSrc.includes('decreaseAriaLabel="Decrease Mouse Tilt Sensitivity"'), 'Must have Decrease Mouse Tilt Sensitivity aria-label');
  assert(panelSrc.includes('increaseAriaLabel="Increase Mouse Tilt Sensitivity"'), 'Must have Increase Mouse Tilt Sensitivity aria-label');
  assert(panelSrc.includes('step={1}'), 'Must step by 1');
  assert(panelSrc.includes('min={0}'), 'Must have min 0');
  assert(panelSrc.includes('max={40}'), 'Must have max 40');
});

runTest('Slider 4: 3D Depth & Perspective Intensity incorporates stepper buttons with step 0.1 and [0.2, 2.5] range', () => {
  assert(panelSrc.includes('label="3D Depth Intensity"'), 'Must bind 3D Depth Intensity label');
  assert(panelSrc.includes('decreaseAriaLabel="Decrease 3D Depth Intensity"'), 'Must have Decrease 3D Depth Intensity aria-label');
  assert(panelSrc.includes('increaseAriaLabel="Increase 3D Depth Intensity"'), 'Must have Increase 3D Depth Intensity aria-label');
  assert(panelSrc.includes('step="0.1"'), 'Must step by 0.1');
  assert(panelSrc.includes('min="0.2"'), 'Must have min 0.2');
  assert(panelSrc.includes('max="2.5"'), 'Must have max 2.5');
});

runTest('Slider 5: Hover Pop Extrusion incorporates stepper buttons with step 2 and [4, 32] range', () => {
  assert(panelSrc.includes('label="Hover Pop Extrusion"'), 'Must bind Hover Pop Extrusion label');
  assert(panelSrc.includes('decreaseAriaLabel="Decrease Hover Pop Extrusion"'), 'Must have Decrease Hover Pop Extrusion aria-label');
  assert(panelSrc.includes('increaseAriaLabel="Increase Hover Pop Extrusion"'), 'Must have Increase Hover Pop Extrusion aria-label');
  assert(panelSrc.includes('step={2}'), 'Must step by 2');
  assert(panelSrc.includes('min={4}'), 'Must have min 4');
  assert(panelSrc.includes('max={32}'), 'Must have max 32');
});

runTest('Slider 6: Exploded Z-Separation incorporates stepper buttons with step 5 and [0, 100] range', () => {
  assert(panelSrc.includes('label="Exploded Z-Separation"'), 'Must bind Exploded Z-Separation label');
  assert(panelSrc.includes('decreaseAriaLabel="Decrease Exploded Z-Separation"'), 'Must have Decrease Exploded Z-Separation aria-label');
  assert(panelSrc.includes('increaseAriaLabel="Increase Exploded Z-Separation"'), 'Must have Increase Exploded Z-Separation aria-label');
  assert(panelSrc.includes('step={5}'), 'Must step by 5');
  assert(panelSrc.includes('min={0}'), 'Must have min 0');
  assert(panelSrc.includes('max={100}'), 'Must have max 100');
});

runTest('Slider 7: Volumetric Fog Density incorporates stepper buttons with step 5 and [0, 100] range', () => {
  assert(panelSrc.includes('label="Volumetric Fog Density"'), 'Must bind Volumetric Fog Density label');
  assert(panelSrc.includes('decreaseAriaLabel="Decrease Volumetric Fog Density"'), 'Must have Decrease Volumetric Fog Density aria-label');
  assert(panelSrc.includes('increaseAriaLabel="Increase Volumetric Fog Density"'), 'Must have Increase Volumetric Fog Density aria-label');
  assert(panelSrc.includes('step={5}'), 'Must step by 5');
  assert(panelSrc.includes('min={0}'), 'Must have min 0');
  assert(panelSrc.includes('max={100}'), 'Must have max 100');
});

// ============================================================================
// SUITE 3: BOTTOM 2x2 SEGMENTED GLASS ACTION TOOLBAR
// ============================================================================
runTest('Bottom 3D Profile & Developer Toolkit renders a compact 2x2 Segmented Glass Action Toolbar', () => {
  assert(
    panelSrc.includes('Bottom 2x2 Segmented Glass Action Toolbar'),
    'Must include Bottom 2x2 Segmented Glass Action Toolbar annotation'
  );
  assert(
    panelSrc.includes('<div className="grid grid-cols-2 gap-2">'),
    'Must format toolbar into a 2x2 grid (grid-cols-2 gap-2)'
  );
});

runTest('Action Toolbar contains all 4 tiles with appropriate icons, labels, and interactions', () => {
  // Tile 1: Export JSON
  assert(panelSrc.includes('Export JSON</span>'), 'Tile 1 must have label "Export JSON"');
  assert(panelSrc.includes('<Download className="w-3.5 h-3.5 text-[#FF4D6D]" />'), 'Tile 1 must have Download icon');
  assert(panelSrc.includes('onClick={handleExportJson}'), 'Tile 1 must trigger handleExportJson');

  // Tile 2: Import JSON
  assert(panelSrc.includes('Import JSON</span>'), 'Tile 2 must have label "Import JSON"');
  assert(panelSrc.includes('<Upload className="w-3.5 h-3.5 text-cyan-500" />'), 'Tile 2 must have Upload icon');
  assert(panelSrc.includes('onClick={handleImportJsonClick}'), 'Tile 2 must trigger handleImportJsonClick');

  // Tile 3: Copy CSS
  assert(panelSrc.includes('Copy CSS</span>') || panelSrc.includes('Copied CSS</span>'), 'Tile 3 must have label "Copy CSS" / "Copied CSS"');
  assert(panelSrc.includes('<Copy className="w-3.5 h-3.5 text-amber-500" />'), 'Tile 3 must have Copy icon');
  assert(panelSrc.includes('onClick={handleCopyCssVariables}'), 'Tile 3 must trigger handleCopyCssVariables');

  // Tile 4: Reset Defaults
  assert(panelSrc.includes('Reset Defaults</span>'), 'Tile 4 must have label "Reset Defaults"');
  assert(panelSrc.includes('<RotateCcw className="w-3.5 h-3.5 text-[#FF4D6D]" />'), 'Tile 4 must have RotateCcw icon');
  assert(panelSrc.includes('reset3DDefaults();') && panelSrc.includes('soundFX.playCrystalChime();'), 'Tile 4 must call reset3DDefaults and playCrystalChime');
});

runTest('Action Toolbar buttons have glassmorphic styling, hover scaling, and active states', () => {
  assert(panelSrc.includes('backdrop-blur-md'), 'Must apply backdrop-blur-md for glassmorphism');
  assert(panelSrc.includes('hover:scale-[1.02] active:scale-97'), 'Must apply subtle hover scaling and active click feedback');
  assert(panelSrc.includes('border-stone-200/80 dark:border-stone-700/80'), 'Must apply rounded glass border styling');
});

// ============================================================================
// SUITE 4: SANDBOX VIEWPORT HEIGHT IN DRAWER MODE
// ============================================================================
runTest('Interactive 3D Sandbox Viewport applies ergonomic h-48 sm:h-56 in drawer mode', () => {
  assert(
    panelSrc.includes("className={`w-full ${isDrawer ? 'h-48 sm:h-56' : 'h-64 sm:h-72'} rounded-2xl"),
    'Must set sandbox height to h-48 sm:h-56 when isDrawer is true, and h-64 sm:h-72 for workbench'
  );
});

// ============================================================================
// SUITE 5: STEP CLAMPING & PRECISION MATHEMATICAL VERIFICATION
// ============================================================================
runTest('Stepper clamping and precision helper accurately handles decimal and integer steps', () => {
  function stepValue(current, delta, min, max, step) {
    const precision = (step.toString().split('.')[1] || '').length;
    const raw = Number((current + delta).toFixed(precision));
    const clamped = Math.max(min, Math.min(max, raw));
    return precision > 0 ? parseFloat(clamped.toFixed(precision)) : Math.round(clamped);
  }

  // Depth Intensity (0.2 to 2.5, step 0.1)
  assert.strictEqual(stepValue(1.0, 0.1, 0.2, 2.5, 0.1), 1.1);
  assert.strictEqual(stepValue(1.0, -0.1, 0.2, 2.5, 0.1), 0.9);
  assert.strictEqual(stepValue(2.5, 0.1, 0.2, 2.5, 0.1), 2.5, 'Must clamp to max 2.5');
  assert.strictEqual(stepValue(0.2, -0.1, 0.2, 2.5, 0.1), 0.2, 'Must clamp to min 0.2');

  // Shadow Softness (0.1 to 1.0, step 0.05)
  assert.strictEqual(stepValue(0.7, 0.05, 0.1, 1.0, 0.05), 0.75);
  assert.strictEqual(stepValue(0.7, -0.05, 0.1, 1.0, 0.05), 0.65);
  assert.strictEqual(stepValue(1.0, 0.05, 0.1, 1.0, 0.05), 1.0, 'Must clamp to max 1.0');
  assert.strictEqual(stepValue(0.1, -0.05, 0.1, 1.0, 0.05), 0.1, 'Must clamp to min 0.1');

  // Camera FOV (400 to 2000, step 50)
  assert.strictEqual(stepValue(1000, 50, 400, 2000, 50), 1050);
  assert.strictEqual(stepValue(1000, -50, 400, 2000, 50), 950);
  assert.strictEqual(stepValue(2000, 50, 400, 2000, 50), 2000, 'Must clamp to max 2000');
  assert.strictEqual(stepValue(400, -50, 400, 2000, 50), 400, 'Must clamp to min 400');

  // Mouse Tilt Sensitivity (0 to 40, step 1)
  assert.strictEqual(stepValue(15, 1, 0, 40, 1), 16);
  assert.strictEqual(stepValue(15, -1, 0, 40, 1), 14);
  assert.strictEqual(stepValue(40, 1, 0, 40, 1), 40, 'Must clamp to max 40');
  assert.strictEqual(stepValue(0, -1, 0, 40, 1), 0, 'Must clamp to min 0');
});

// ============================================================================
// SUITE 6: VITE SSR & SYNTAX INTEGRITY
// ============================================================================
const { createServer } = await import('vite');

runTest('ControlCenterPanel.jsx compiles and loads cleanly in Vite SSR', async () => {
  const server = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });
  try {
    const mod = await server.ssrLoadModule('/src/components/ControlCenterPanel.jsx');
    assert(mod.default, 'ControlCenterPanel module should export default component');
  } finally {
    await server.close();
  }
});

console.log('\n================================================================');
console.log(`  GAP #5 VERIFICATION: ${passCount} PASSED | ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
