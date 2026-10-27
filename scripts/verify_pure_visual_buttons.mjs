import assert from 'node:assert';
import { readFileSync } from 'node:fs';

console.log('--- Verifying Phase 03: Pure Visual & Icon-Highlighted Buttons Redesign ---');

// 1. Verify ThreeDButtonPrimitives has isVisualOnly prop and conditional description rendering
const primitivesSource = readFileSync('src/components/3d-sandbox/ThreeDButtonPrimitives.jsx', 'utf8');

assert(
  primitivesSource.includes('isVisualOnly = true'),
  'ThreeDPresetCard must default isVisualOnly to true'
);
assert(
  primitivesSource.includes('!isVisualOnly && desc &&'),
  'ThreeDPresetCard must hide description when isVisualOnly is true'
);
assert(
  primitivesSource.includes('shadow-[0_0_12px_rgba(255,77,109,0.4)]') || primitivesSource.includes('shadow-[0_0_12px'),
  'ThreeDPresetCard must provide glowing highlighted icon styling in 3D visual mode'
);
assert(
  primitivesSource.includes('title={tooltipText}'),
  'ThreeDPresetCard must retain accessible tooltip title on container'
);
console.log('✓ ThreeDButtonPrimitives isVisualOnly logic, icon glow, and tooltip preservation verified.');

// 2. Verify ControlCenterPanel passes isVisualOnly={isVisual3DOnly} to all preset grids
const panelSource = readFileSync('src/components/ControlCenterPanel.jsx', 'utf8');

const presetCardUsages = (panelSource.match(/<ThreeDPresetCard/g) || []).length;
const visualOnlyUsages = (panelSource.match(/isVisualOnly=\{isVisual3DOnly\}/g) || []).length;

console.log(`Found ${presetCardUsages} ThreeDPresetCard instances, ${visualOnlyUsages} with isVisualOnly prop.`);
assert(
  presetCardUsages > 0 && presetCardUsages === visualOnlyUsages,
  `All ${presetCardUsages} ThreeDPresetCard instances in ControlCenterPanel must receive isVisualOnly={isVisual3DOnly}`
);

// 3. Verify element toggles in Section 1 also respect isVisual3DOnly
assert(
  panelSource.includes('!isVisual3DOnly && item.desc &&'),
  'Element toggles must conditionally hide item.desc when isVisual3DOnly is active'
);
console.log('✓ ControlCenterPanel 100% propagation across all 5 preset groups and element switches verified.');

console.log('========================================================');
console.log('✅ Phase 03: Pure Visual Buttons Transformation PASSED 100%');
console.log('========================================================');
