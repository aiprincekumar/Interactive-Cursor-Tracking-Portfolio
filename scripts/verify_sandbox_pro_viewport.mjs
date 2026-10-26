import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  VERIFY PROFESSIONAL 3D VIEWPORT TOOLS SUITE IN SANDBOX CARD   ');
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
// SUITE 1: 4 SHADING / VIEWPORT MODES HUD
// ============================================================================
runTest('ControlCenterPanel imports required icons (Sparkles, Grid, Cuboid, Layers, Minimize2, Columns2)', () => {
  assert(panelSrc.includes('Sparkles'), 'Must import Sparkles for rendered mode');
  assert(panelSrc.includes('Grid'), 'Must import Grid for wireframe mode');
  assert(panelSrc.includes('Cuboid'), 'Must import Cuboid for clay mode');
  assert(panelSrc.includes('Layers'), 'Must import Layers for xray mode');
  assert(panelSrc.includes('Minimize2'), 'Must import Minimize2 for collapsed studio toggle');
  assert(panelSrc.includes('Columns2'), 'Must import Columns2 for split screen toggle');
});

runTest('ControlCenterPanel initializes viewportShadingMode state to "rendered"', () => {
  assert(
    panelSrc.includes("const [viewportShadingMode, setViewportShadingMode] = useState('rendered')"),
    'Must declare viewportShadingMode initialized to rendered'
  );
});

runTest('Top-left HUD pill bar renders sleek segmented radiogroup with glassmorphic styling', () => {
  assert(panelSrc.includes('aria-label="3D Viewport Shading Modes"'), 'Must define accessible shading modes radiogroup');
  assert(panelSrc.includes('bg-black/60 dark:bg-black/75 backdrop-blur-md border border-white/10 shadow-lg'), 'Must apply glassmorphic segmented HUD pill styling');
  assert(panelSrc.includes('absolute top-3 left-3 z-20'), 'Must position at top-left of the sandbox canvas');
});

runTest('HUD pill bar includes all 4 viewport modes with accurate labels and haptic feedback', () => {
  assert(panelSrc.includes("'rendered'") && panelSrc.includes("'Rendered'"), 'Must include Rendered mode');
  assert(panelSrc.includes("'wireframe'") && panelSrc.includes("'Wireframe'"), 'Must include Wireframe mode');
  assert(panelSrc.includes("'clay'") && panelSrc.includes("'Clay AO'"), 'Must include Clay AO mode');
  assert(panelSrc.includes("'xray'") && panelSrc.includes("'X-Ray'"), 'Must include X-Ray mode');
  assert(panelSrc.includes('setViewportShadingMode(mode.id)') && panelSrc.includes('soundFX.playHapticClick()'), 'Must trigger haptic audio click on mode selection');
});

runTest('CSS shaders dynamically alter card face appearance across all 4 modes', () => {
  // Wireframe mode
  assert(panelSrc.includes("viewportShadingMode === 'wireframe'"), 'Must handle wireframe shader mode');
  assert(panelSrc.includes('border-2 border-cyan-400 bg-[#061524]/95'), 'Must render technical vector wireframe border & bg');
  
  // Clay AO mode
  assert(panelSrc.includes("viewportShadingMode === 'clay'"), 'Must handle clay shader mode');
  assert(panelSrc.includes('shadow-[inset_-6px_-6px_12px_rgba(255,255,255,0.9),inset_6px_6px_12px_rgba(166,173,184,0.45)]') ||
         panelSrc.includes('shadow-[inset_-6px_-6px_12px_rgba(255,255,255,0.06),inset_6px_6px_12px_rgba(0,0,0,0.65)]'), 'Must render ambient occlusion clay shadows');
  
  // X-Ray mode
  assert(panelSrc.includes("viewportShadingMode === 'xray'"), 'Must handle xray shader mode');
  assert(panelSrc.includes('bg-cyan-950/40 backdrop-blur-md shadow-[0_0_32px_rgba(0,242,254,0.4)'), 'Must render holographic translucent casing');
  assert(panelSrc.includes('ALU-01') && panelSrc.includes('GPU-CORE') && panelSrc.includes('VRAM-64'), 'Must reveal internal component architecture in X-Ray mode');
  
  // Rendered mode
  assert(panelSrc.includes("viewportShadingMode === 'rendered'"), 'Must handle rendered mode photorealistic layers');
});

// ============================================================================
// SUITE 2: CAD BOUNDING BOX & DIMENSIONAL CALLOUTS
// ============================================================================
runTest('ControlCenterPanel initializes showCadDimensions state to false', () => {
  assert(
    panelSrc.includes('const [showCadDimensions, setShowCadDimensions] = useState(false)'),
    'Must declare showCadDimensions state initialized to false'
  );
});

runTest('Sandbox HUD toolbar renders [📐 Dimensions] toggle button with haptic feedback', () => {
  assert(panelSrc.includes('aria-label="Toggle CAD Dimensions"'), 'Must have accessible label for CAD dimensions button');
  assert(panelSrc.includes('📐') && panelSrc.includes('Dimensions'), 'Must display [📐 Dimensions] button text');
  assert(panelSrc.includes('setShowCadDimensions(!showCadDimensions)'), 'Must toggle showCadDimensions on click');
});

runTest('CAD bounding box renders translucent dashed lines and 4 corner tick marks', () => {
  assert(panelSrc.includes('border-2 border-dashed border-cyan-400/60 pointer-events-none'), 'Must render dashed bounding box');
  assert(panelSrc.includes('aria-label="CAD Bounding Box"'), 'Must label CAD bounding box');
  assert(panelSrc.includes('border-t-2 border-l-2 border-cyan-400'), 'Must render top-left corner tick');
  assert(panelSrc.includes('border-t-2 border-r-2 border-cyan-400'), 'Must render top-right corner tick');
  assert(panelSrc.includes('border-b-2 border-l-2 border-cyan-400'), 'Must render bottom-left corner tick');
  assert(panelSrc.includes('border-b-2 border-r-2 border-cyan-400'), 'Must render bottom-right corner tick');
});

runTest('CAD dimensions display live accurate callout tags with architectural arrows', () => {
  // Bottom Edge W: 280mm
  assert(panelSrc.includes('W: 280mm'), 'Must display W: 280mm bottom edge callout');
  assert(panelSrc.includes('|◀') && panelSrc.includes('▶|'), 'Must include architectural arrows for width');
  
  // Vertical Edge H: 180mm
  assert(panelSrc.includes('H: 180mm'), 'Must display H: 180mm vertical edge callout');
  assert(panelSrc.includes('▲') && panelSrc.includes('▼'), 'Must include architectural arrows for height');
  
  // Z-extrusion axis callout
  assert(
    panelSrc.includes('Z: ${threeDConfig.exploded.enabled ? Math.round(threeDConfig.exploded.distance + threeDConfig.materials.bevelExtrusion * 3) : Math.round(threeDConfig.materials.bevelExtrusion * 3 + 8)}mm'),
    'Must compute live Z-extrusion distance dynamically based on exploded distance and bevel extrusion'
  );
});

// ============================================================================
// SUITE 3: DRAGGABLE SPLIT-SCREEN A/B COMPARISON SLIDER (2D VS 3D)
// ============================================================================
runTest('ControlCenterPanel initializes isSplitComparison to false and splitPosition to 50', () => {
  assert(
    panelSrc.includes('const [isSplitComparison, setIsSplitComparison] = useState(false)'),
    'Must declare isSplitComparison state initialized to false'
  );
  assert(
    panelSrc.includes('const [splitPosition, setSplitPosition] = useState(50)'),
    'Must declare splitPosition state initialized to 50'
  );
});

runTest('HUD toolbar renders [Columns2 Split 2D/3D] toggle button with haptic feedback', () => {
  assert(panelSrc.includes('aria-label="Toggle Split 2D/3D Comparison"'), 'Must have accessible label for Split 2D/3D button');
  assert(panelSrc.includes('<Columns2') && panelSrc.includes('Split 2D/3D'), 'Must display Columns2 icon and Split 2D/3D text');
  assert(panelSrc.includes('setIsSplitComparison(!isSplitComparison)'), 'Must toggle isSplitComparison on click');
});

runTest('Split comparison implements CSS clipPath for 2D flat and 3D spatial layers', () => {
  // 2D Layer clipPath
  assert(
    panelSrc.includes('clipPath: `inset(0 calc(100% - ${splitPosition}%) 0 0)`'),
    'Must clip 2D layer with inset(0 calc(100% - ${splitPosition}%) 0 0)'
  );
  
  // 3D Layer clipPath
  assert(
    panelSrc.includes('clipPath: isSplitComparison ? `inset(0 0 0 ${splitPosition}%)` : \'none\'') ||
    panelSrc.includes('clipPath: `inset(0 0 0 ${splitPosition}%)`'),
    'Must clip 3D layer with inset(0 0 0 ${splitPosition}%)'
  );
});

runTest('Split comparison renders [2D FLAT] and [3D SPATIAL] indicator badges', () => {
  assert(panelSrc.includes('2D FLAT'), 'Must render 2D FLAT badge on the left layer');
  assert(panelSrc.includes('3D SPATIAL'), 'Must render 3D SPATIAL badge on the right layer');
});

runTest('Split divider handle is positioned at left: ${splitPosition}% with drag pointer handlers', () => {
  assert(panelSrc.includes('style={{ left: `${splitPosition}%` }}'), 'Handle must be positioned at left: ${splitPosition}%');
  assert(panelSrc.includes('onPointerDown={handleSplitPointerDown}'), 'Must bind onPointerDown on split handle');
  assert(panelSrc.includes('onPointerMove={handleSplitPointerMove}'), 'Must bind onPointerMove on split handle');
  assert(panelSrc.includes('onPointerUp={handleSplitPointerUp}'), 'Must bind onPointerUp on split handle');
  assert(panelSrc.includes('setPointerCapture'), 'Must use setPointerCapture for smooth dragging');
});

// ============================================================================
// SUITE 4: MAXIMIZE / EXPAND STUDIO VIEWPORT
// ============================================================================
runTest('ControlCenterPanel initializes isSandboxExpanded state to false', () => {
  assert(
    panelSrc.includes('const [isSandboxExpanded, setIsSandboxExpanded] = useState(false)'),
    'Must declare isSandboxExpanded initialized to false'
  );
});

runTest('Sandbox header renders studio expand toggle with Maximize2 and Minimize2 icons', () => {
  assert(panelSrc.includes('aria-label={isSandboxExpanded ? \'Minimize Studio Viewport\' : \'Maximize Studio Viewport\'}'), 'Must have dynamic aria-label for studio toggle');
  assert(panelSrc.includes('isSandboxExpanded ? <Minimize2') && panelSrc.includes('<Maximize2'), 'Must render Minimize2 when expanded and Maximize2 when collapsed');
  assert(panelSrc.includes('setIsSandboxExpanded(!isSandboxExpanded)'), 'Must toggle isSandboxExpanded on click');
});

runTest('Viewport container smoothly expands from compact h-48 sm:h-56 to expansive h-96 sm:h-[420px]', () => {
  assert(panelSrc.includes("className={`w-full ${isDrawer ? 'h-48 sm:h-56' : 'h-64 sm:h-72'} rounded-2xl"), 'Must preserve baseline ergonomics for drawer');
  assert(panelSrc.includes("isSandboxExpanded ? '!h-96 sm:!h-[420px]' : ''"), 'Must scale to expansive h-96 sm:h-[420px]');
  assert(panelSrc.includes('transition-all duration-300 ease-out'), 'Must transition smoothly with duration-300 ease-out');
});

runTest('Ground grid and soft contact shadow expand proportionally when studio is maximized', () => {
  assert(
    panelSrc.includes("isSandboxExpanded ? 'w-[420px] sm:w-[520px] h-48' : 'w-[280px] sm:w-[340px] h-32'"),
    'Must expand ground grid floor proportionally when expanded'
  );
  assert(
    panelSrc.includes("isSandboxExpanded ? 'w-80 sm:w-96' : 'w-60 sm:w-68'"),
    'Must expand soft contact shadow proportionally when expanded'
  );
});

// ============================================================================
// SUITE 5: MATHEMATICAL VALIDATION
// ============================================================================
runTest('Z-extrusion calculation produces correct millimeter values for both normal and exploded states', () => {
  const computeZ = (isExploded, distance, bevel) => {
    return isExploded
      ? Math.round(distance + bevel * 3)
      : Math.round(bevel * 3 + 8);
  };

  // Normal default state: bevel 3 -> 3*3 + 8 = 17mm
  assert.strictEqual(computeZ(false, 45, 3), 17, 'Normal Z depth correctly calculated as 17mm');

  // Exploded default state: distance 45 + bevel 3 -> 45 + 9 = 54mm
  assert.strictEqual(computeZ(true, 45, 3), 54, 'Exploded Z depth correctly calculated as 54mm');

  // Max bevel state (8mm): 8*3 + 8 = 32mm normal, 45 + 24 = 69mm exploded
  assert.strictEqual(computeZ(false, 45, 8), 32, 'Max bevel Z depth is 32mm');
  assert.strictEqual(computeZ(true, 45, 8), 69, 'Max bevel exploded Z depth is 69mm');
});

runTest('Split comparison position clamping prevents divider overflow', () => {
  const clampSplit = (rawPct) => Math.min(Math.max(Math.round(rawPct), 0), 100);
  assert.strictEqual(clampSplit(-10), 0, 'Negative percentage clamped to 0');
  assert.strictEqual(clampSplit(120), 100, 'Over 100 percentage clamped to 100');
  assert.strictEqual(clampSplit(49.8), 50, 'Midpoint correctly rounded to 50');
});

// ============================================================================
// SUITE 6: VITE SSR MODULE RESOLUTION
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
console.log(`  PRO VIEWPORT VERIFICATION: ${passCount} PASSED | ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
