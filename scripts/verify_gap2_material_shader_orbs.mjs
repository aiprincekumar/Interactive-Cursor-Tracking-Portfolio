import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  VERIFY GAP #2: 3D MATERIAL SHADER ORBS & BEVEL CHAMFER DIAGRAM ');
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

// 1. Check MATERIAL_PRESETS data structure
runTest('MATERIAL_PRESETS includes all 4 presets with names and pills', () => {
  const expectedPresets = [
    { id: 'glass-acrylic', name: 'Glass Acrylic', pill: 'Frosted Refractive' },
    { id: 'metallic-gloss', name: 'Metallic Gloss', pill: 'Mirror Chrome' },
    { id: 'neumorphic-clay', name: 'Neumorphic Clay', pill: 'Tactile Matte' },
    { id: 'cyber-wireframe', name: 'Cyber Wireframe', pill: 'Neon Vector Grid' }
  ];

  for (const preset of expectedPresets) {
    assert(panelSrc.includes(`id: '${preset.id}'`), `Must include preset id ${preset.id}`);
    assert(panelSrc.includes(`name: '${preset.name}'`), `Must include preset name ${preset.name}`);
    assert(panelSrc.includes(`pill: '${preset.pill}'`), `Must include preset pill ${preset.pill}`);
  }
});

// 2. Check 2x2 grid layout and responsive drawer design
runTest('Section 4 renders 2x2 responsive tactile grid', () => {
  assert(panelSrc.includes('role="radiogroup"'), 'Must have role="radiogroup"');
  assert(panelSrc.includes('aria-label="3D Material Shading Presets"'), 'Must have aria-label for radiogroup');
  assert(panelSrc.includes('grid grid-cols-2 gap-2.5 sm:gap-3'), 'Must be a 2x2 grid fitting in drawer');
});

// 3. Check 56px photorealistic 3D Material Spheres CSS & SVG
runTest('MaterialShaderOrb renders Glass Acrylic with frosted glass, caustics and glare', () => {
  assert(panelSrc.includes("preset === 'glass-acrylic'"), 'Must handle glass-acrylic');
  assert(panelSrc.includes('radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.85)'), 'Glass Acrylic base gradient');
  assert(panelSrc.includes('inset -4px -4px 8px rgba(0,0,0,0.2)'), 'Glass Acrylic inner shadow');
  assert(panelSrc.includes('backdrop-blur-md'), 'Glass Acrylic frosted blur');
});

runTest('MaterialShaderOrb renders Metallic Gloss with chrome reflection and horizon specular band', () => {
  assert(panelSrc.includes("preset === 'metallic-gloss'"), 'Must handle metallic-gloss');
  assert(panelSrc.includes('radial-gradient(circle at 30% 25%, #ffffff 0%'), 'Metallic Gloss chrome gradient');
  assert(panelSrc.includes('linear-gradient(165deg, transparent 42%'), 'Metallic Gloss sharp horizon band');
});

runTest('MaterialShaderOrb renders Neumorphic Clay with dual shadow embossing and adaptive theme', () => {
  assert(panelSrc.includes("preset === 'neumorphic-clay'"), 'Must handle neumorphic-clay');
  assert(panelSrc.includes('#f5f5f7 0%, #dcdfe4 60%, #a6adb8 100%'), 'Neumorphic Clay light gradient');
  assert(panelSrc.includes('#352d48 0%, #201730 60%, #100b1a 100%'), 'Neumorphic Clay dark gradient');
  assert(panelSrc.includes('inset 3px 3px 6px rgba(255,255,255,0.95)'), 'Neumorphic Clay dual shadow embossing');
});

runTest('MaterialShaderOrb renders Cyber Wireframe with glowing neon cyan vector grid and pulse', () => {
  assert(panelSrc.includes("preset === 'cyber-wireframe'"), 'Must handle cyber-wireframe');
  assert(panelSrc.includes('radial-gradient(circle at 50% 50%, #061524 0%, #020810 100%)'), 'Cyber Wireframe obsidian gradient');
  assert(panelSrc.includes('stroke="#00ffff"'), 'Cyber Wireframe cyan vector grid strokes');
  assert(panelSrc.includes('animate-pulse'), 'Cyber Wireframe center node pulse');
});

// 4. Glint sweep animation on hover
runTest('Spheres include glint sweep sheen animation on hover', () => {
  assert(panelSrc.includes('-translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out'), 'Must include glint sweep sheen');
  assert(panelSrc.includes('skew-x-[-25deg]'), 'Glint must be angled with skew-x-[-25deg]');
});

// 5. Active and Hover States
runTest('Material cards feature active accent ring, check badge, and haptic feedback', () => {
  assert(panelSrc.includes('ring-2 ring-[#FF4D6D] bg-[#FF4D6D]/5 dark:bg-[#FF4D6D]/10'), 'Active card accent ring');
  assert(panelSrc.includes('hover:scale-[1.03] transition-all duration-200'), 'Hover micro-interaction');
  assert(panelSrc.includes('set3DMaterials({ preset: mat.id })'), 'Click triggers set3DMaterials');
  assert(panelSrc.includes('soundFX.playHapticClick()'), 'Click triggers soundFX.playHapticClick');
});

// 6. Keyboard accessibility
runTest('Material radiogroup supports WAI-ARIA and arrow-key navigation', () => {
  assert(panelSrc.includes('role="radio"'), 'Cards have role="radio"');
  assert(panelSrc.includes('aria-checked={isSelected}'), 'Cards indicate aria-checked');
  assert(panelSrc.includes('handleMaterialKeyDown'), 'Supports arrow navigation');
  assert(panelSrc.includes("e.key === 'ArrowRight'"), 'ArrowRight navigates');
  assert(panelSrc.includes("e.key === 'ArrowLeft'"), 'ArrowLeft navigates');
  assert(panelSrc.includes("e.key === 'ArrowDown'"), 'ArrowDown navigates');
  assert(panelSrc.includes("e.key === 'ArrowUp'"), 'ArrowUp navigates');
});

// 7. Visual Bevel Chamfer Diagram
runTest('Bevel Extrusion slider features real-time SVG edge profile cross-section diagram', () => {
  assert(panelSrc.includes('bevelChamferGrad'), 'Must include gradient definition for chamfer diagram');
  assert(panelSrc.includes('Phantom Sharp 90° Corner Guide (Dashed)'), 'Includes dashed phantom corner guide');
  assert(panelSrc.includes('strokeDasharray="2 2"'), 'Phantom corner uses dashed stroke');
  assert(panelSrc.includes('Active Bevel Chamfer Facet Highlight'), 'Highlights active chamfer facet');
  assert(panelSrc.includes('stroke="#FF4D6D"'), 'Facet highlight uses accent pink');
  assert(panelSrc.includes('strokeWidth="2.5"'), 'Facet highlight has prominent 2.5px width');
  assert(panelSrc.includes('1px (Micro-Chamfer)'), 'Micro-chamfer label preserved');
  assert(panelSrc.includes('8px (Deep Tactile Bevel)'), 'Deep tactile bevel label preserved');
});

// 8. Top 3D Sandbox Card synchronization
runTest('Top 3D Sandbox Card dynamically reflects chosen material shader and textures', () => {
  assert(panelSrc.includes("materials.preset === 'cyber-wireframe'"), 'Sandbox renders cyber-wireframe');
  assert(panelSrc.includes("materials.preset === 'metallic-gloss'"), 'Sandbox renders metallic-gloss');
  assert(panelSrc.includes("materials.preset === 'neumorphic-clay'"), 'Sandbox renders neumorphic-clay');
  assert(panelSrc.includes("materials.preset === 'glass-acrylic'"), 'Sandbox renders glass-acrylic');
});

console.log(`\n================================================================`);
console.log(`  GAP #2 VERIFICATION: ${passCount} PASSED | ${failCount} FAILED`);
console.log(`================================================================\n`);

if (failCount > 0) {
  process.exit(1);
}
