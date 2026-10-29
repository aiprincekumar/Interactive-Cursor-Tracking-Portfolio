import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('  VERIFY MATERIAL & SHADING SPLIT + 16 MATERIALS (PHASES 2 & 3) ');
console.log('================================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

// 1. Check LabContext.jsx
const labContextPath = path.resolve('src/context/LabContext.jsx');
const labContextContent = fs.readFileSync(labContextPath, 'utf8');

assert(labContextContent.includes('export const VALID_MATERIAL_PRESETS'), 'VALID_MATERIAL_PRESETS array is exported');
assert(labContextContent.includes("'wood-oak'"), 'VALID_MATERIAL_PRESETS includes wood-oak');
assert(labContextContent.includes("'metal-gold'"), 'VALID_MATERIAL_PRESETS includes metal-gold');
assert(labContextContent.includes("'metal-iron'"), 'VALID_MATERIAL_PRESETS includes metal-iron');
assert(labContextContent.includes("'stone-marble'"), 'VALID_MATERIAL_PRESETS includes stone-marble');
assert(labContextContent.includes("'carbon-fiber'"), 'VALID_MATERIAL_PRESETS includes carbon-fiber');
assert(labContextContent.includes("'gem-emerald'"), 'VALID_MATERIAL_PRESETS includes gem-emerald');

assert(labContextContent.includes("root.style.setProperty('--3d-roughness'"), 'LabContext sets --3d-roughness on root.style');
assert(labContextContent.includes("root.style.setProperty('--3d-metalness'"), 'LabContext sets --3d-metalness on root.style');
assert(labContextContent.includes("root.style.setProperty('--3d-ior'"), 'LabContext sets --3d-ior on root.style');
assert(labContextContent.includes("root.style.setProperty('--3d-clearcoat'"), 'LabContext sets --3d-clearcoat on root.style');

// 2. Check ControlCenterPanel.jsx
const panelPath = path.resolve('src/components/ControlCenterPanel.jsx');
const panelContent = fs.readFileSync(panelPath, 'utf8');

assert(panelContent.includes('ACCORDION SECTION 4: MATERIALS LIBRARY'), 'Section 4 is dedicated Materials Library');
assert(panelContent.includes('ACCORDION SECTION 5: PBR SURFACE & SHADING ENGINE'), 'Section 5 is dedicated PBR Surface & Shading Engine');
assert(panelContent.includes("isSectionVisible('shading')"), 'isSectionVisible supports distinct shading section');
assert(panelContent.includes("clusterFilter === 'design'") && panelContent.includes("'shading'"), 'Design cluster filter includes shading section');

// Check 16 material presets in ControlCenterPanel
const requiredMaterials = [
  'wood-oak', 'wood-walnut', 'stone-marble', 'clay-terracotta',
  'metal-gold', 'metal-silver', 'metal-iron', 'metal-steel', 'metal-aluminium', 'metal-copper',
  'plastic-gloss', 'plastic-matte', 'carbon-fiber', 'glass-acrylic', 'gem-emerald', 'cyber-wireframe'
];
requiredMaterials.forEach((matId) => {
  assert(panelContent.includes(`id: '${matId}'`), `ControlCenterPanel MATERIAL_PRESETS includes ${matId}`);
});

// 3. Check Visual3DPresets.jsx
const presetsPath = path.resolve('src/components/3d-sandbox/Visual3DPresets.jsx');
const presetsContent = fs.readFileSync(presetsPath, 'utf8');

assert(presetsContent.includes("materialId === 'wood-oak'"), 'MaterialShaderSphere has procedural shader for wood-oak');
assert(presetsContent.includes("materialId === 'metal-gold'"), 'MaterialShaderSphere has procedural shader for metal-gold');
assert(presetsContent.includes("materialId === 'metal-silver'"), 'MaterialShaderSphere has procedural shader for metal-silver');
assert(presetsContent.includes("materialId === 'metal-iron'"), 'MaterialShaderSphere has procedural shader for metal-iron');
assert(presetsContent.includes("materialId === 'metal-steel'"), 'MaterialShaderSphere has procedural shader for metal-steel');
assert(presetsContent.includes("materialId === 'metal-aluminium'"), 'MaterialShaderSphere has procedural shader for metal-aluminium');
assert(presetsContent.includes("materialId === 'plastic-gloss'"), 'MaterialShaderSphere has procedural shader for plastic-gloss');
assert(presetsContent.includes("materialId === 'stone-marble'"), 'MaterialShaderSphere has procedural shader for stone-marble');
assert(presetsContent.includes("materialId === 'carbon-fiber'"), 'MaterialShaderSphere has procedural shader for carbon-fiber');
assert(presetsContent.includes("materialId === 'gem-emerald'"), 'MaterialShaderSphere has procedural shader for gem-emerald');

// 4. Check UniversalMiniPortfolio.jsx
const portfolioPath = path.resolve('src/components/3d-sandbox/UniversalMiniPortfolio.jsx');
const portfolioContent = fs.readFileSync(portfolioPath, 'utf8');

assert(portfolioContent.includes("case 'wood-oak':"), 'UniversalMiniPortfolio implements wood-oak surface style');
assert(portfolioContent.includes("case 'metal-gold':"), 'UniversalMiniPortfolio implements metal-gold surface style');
assert(portfolioContent.includes("case 'metal-silver':"), 'UniversalMiniPortfolio implements metal-silver surface style');
assert(portfolioContent.includes("case 'metal-iron':"), 'UniversalMiniPortfolio implements metal-iron surface style');
assert(portfolioContent.includes("case 'metal-copper':"), 'UniversalMiniPortfolio implements metal-copper surface style');
assert(portfolioContent.includes("case 'plastic-gloss':"), 'UniversalMiniPortfolio implements plastic-gloss surface style');
assert(portfolioContent.includes("case 'stone-marble':"), 'UniversalMiniPortfolio implements stone-marble surface style');
assert(portfolioContent.includes("case 'gem-emerald':"), 'UniversalMiniPortfolio implements gem-emerald surface style');

console.log('\n================================================================');
console.log(`  VERIFICATION RESULTS: ${passed} PASSED | ${failed} FAILED`);
console.log('================================================================');

if (failed > 0) process.exit(1);
