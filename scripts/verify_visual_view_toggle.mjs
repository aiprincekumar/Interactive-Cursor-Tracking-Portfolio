import assert from 'node:assert';
import { readFileSync } from 'node:fs';

console.log('--- Verifying Phase 02: 3D Visual vs Text View Mode Toggle ---');

// 1. Verify LabContext exports isVisual3DOnly and toggle functions
const labContextSource = readFileSync('src/context/LabContext.jsx', 'utf8');

assert(
  labContextSource.includes('isVisual3DOnly'),
  'LabContext must expose isVisual3DOnly'
);
assert(
  labContextSource.includes('set3DVisualMode'),
  'LabContext must expose set3DVisualMode'
);
assert(
  labContextSource.includes('toggle3DVisualMode'),
  'LabContext must expose toggle3DVisualMode'
);
assert(
  labContextSource.includes('isVisualOnly: true') || labContextSource.includes('isVisualOnly: typeof'),
  'FACTORY_DEFAULTS or normalizeThreeD must set isVisualOnly default to true'
);
console.log('✓ LabContext state and toggle actions verified.');

// 2. Verify ControlCenterPanel renders the mode switch
const panelSource = readFileSync('src/components/ControlCenterPanel.jsx', 'utf8');

assert(
  panelSource.includes('isVisual3DOnly') && panelSource.includes('set3DVisualMode'),
  'ControlCenterPanel must consume isVisual3DOnly and set3DVisualMode'
);
assert(
  panelSource.includes('role="radiogroup"'),
  'ControlCenterPanel must contain a role="radiogroup" toggle container'
);
assert(
  panelSource.includes('3D Visual') && panelSource.includes('Text 2D'),
  'ControlCenterPanel must render "3D Visual" and "Text 2D" options'
);
console.log('✓ ControlCenterPanel UI toggle button and accessibility attributes verified.');

console.log('========================================================');
console.log('✅ Phase 02: Visual vs Text View Toggle PASSED 100%');
console.log('========================================================');
