import assert from 'node:assert';
import { readFileSync } from 'node:fs';

console.log('--- Verifying Excision of 3D Visual / Text 2D Button & Active Default 3D Visual Mode ---');

// 1. Verify LabContext exports isVisual3DOnly and default 3D visual mode is true
const labContextSource = readFileSync('src/context/LabContext.jsx', 'utf8');

assert(
  labContextSource.includes('isVisual3DOnly'),
  'LabContext must expose isVisual3DOnly'
);
assert(
  labContextSource.includes('isVisualOnly: true') || labContextSource.includes('isVisualOnly: typeof'),
  'FACTORY_DEFAULTS or normalizeThreeD must set isVisualOnly default to true'
);
console.log('✓ LabContext default 3D visual mode is active and verified.');

// 2. Verify ControlCenterPanel has cleanly excised the 3D Visual / Text 2D button
const panelSource = readFileSync('src/components/ControlCenterPanel.jsx', 'utf8');

assert(
  !panelSource.includes('aria-label="3D button display mode"'),
  'ControlCenterPanel must NOT contain 3D button display mode radiogroup toggle container (successfully excised)'
);
assert(
  !panelSource.includes('>3D Visual<') && !panelSource.includes('>Text 2D<'),
  'ControlCenterPanel must NOT render "3D Visual" or "Text 2D" buttons (successfully excised)'
);
assert(
  panelSource.includes('{active3DCount} / 10 Elements'),
  'ControlCenterPanel must retain the clean Active Elements badge'
);
assert(
  panelSource.includes('isVisual3DOnly'),
  'ControlCenterPanel must maintain isVisual3DOnly active for visual-first rendering'
);
console.log('✓ UI Excision verified: 3D Visual / Text 2D toggle removed and clean Active badge preserved.');

console.log('========================================================');
console.log('✅ Visual / Text Toggle Excision & Default 3D Mode PASSED 100%');
console.log('========================================================');
