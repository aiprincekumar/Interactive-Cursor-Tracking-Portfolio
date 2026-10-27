import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Verifying Master 3D Tab UI Card & State Architecture...');

// 1. Verify LabContext.jsx
const labContextPath = path.join(rootDir, 'src', 'context', 'LabContext.jsx');
const labContextSource = fs.readFileSync(labContextPath, 'utf8');

assert(
  labContextSource.includes('tabUI3DMode: true'),
  'LabContext FACTORY_DEFAULTS.threeD must specify tabUI3DMode: true'
);
assert(
  labContextSource.includes('setTabUI3DMode'),
  'LabContext must declare and export setTabUI3DMode'
);
assert(
  labContextSource.includes('toggleTabUI3DMode'),
  'LabContext must declare and export toggleTabUI3DMode'
);
assert(
  labContextSource.includes('isTab3DModeOn'),
  'LabContext must expose isTab3DModeOn in context value'
);

// 2. Verify ControlCenterPanel.jsx
const cpcPath = path.join(rootDir, 'src', 'components', 'ControlCenterPanel.jsx');
const cpcSource = fs.readFileSync(cpcPath, 'utf8');

assert(
  cpcSource.includes('Master 3D Tab UI Mode'),
  'ControlCenterPanel must render the Master 3D Tab UI Mode Hero Card'
);
assert(
  cpcSource.includes('3D Visual Active (Zero-Text)'),
  'ControlCenterPanel must display 3D Visual Active (Zero-Text) status badge'
);
assert(
  cpcSource.includes('Classic 2D Text Active'),
  'ControlCenterPanel must display Classic 2D Text Active status badge'
);
assert(
  cpcSource.includes('isTab3DActive'),
  'ControlCenterPanel must compute isTab3DActive state flag'
);
assert(
  cpcSource.includes('toggleTabUI3DMode'),
  'ControlCenterPanel must wire toggleTabUI3DMode action'
);

console.log('✅ Phase 1 Verification Passed: Master 3D Tab UI Card & State correctly implemented.');
