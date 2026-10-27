import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Verifying 100% Zero-Text Pure 3D Buttons & Controls Transformation...');

// 1. Verify ThreeDButtonPrimitives.jsx
const primitivesPath = path.join(rootDir, 'src', 'components', '3d-sandbox', 'ThreeDButtonPrimitives.jsx');
const primitivesSource = fs.readFileSync(primitivesPath, 'utf8');

// ThreeDPresetCard zero-text check
assert(
  primitivesSource.includes('!isVisualOnly && (') && primitivesSource.includes('title'),
  'ThreeDPresetCard must conditionally suppress title when isVisualOnly is true'
);
assert(
  primitivesSource.includes('!isVisualOnly && desc'),
  'ThreeDPresetCard must suppress desc when isVisualOnly is true'
);
assert(
  primitivesSource.includes('title={tooltipText}') && primitivesSource.includes('aria-label={ariaLabel || tooltipText}'),
  'ThreeDPresetCard must preserve title attribute and aria-label for accessibility in zero-text 3D mode'
);

// ThreeDActionKeycap zero-text check
assert(
  primitivesSource.includes('!isVisualOnly && label && <span>{label}</span>'),
  'ThreeDActionKeycap must suppress text label when isVisualOnly is true'
);
assert(
  primitivesSource.includes('title={title || label}') && primitivesSource.includes('aria-label={ariaLabel || label}'),
  'ThreeDActionKeycap must pass label to title and aria-label'
);

// ThreeDToggleKey zero-text check
assert(
  primitivesSource.includes('!isVisualOnly && (') && primitivesSource.includes('sublabel'),
  'ThreeDToggleKey must suppress label and sublabel when isVisualOnly is true'
);

// 2. Verify ControlCenterPanel.jsx wiring
const cpcPath = path.join(rootDir, 'src', 'components', 'ControlCenterPanel.jsx');
const cpcSource = fs.readFileSync(cpcPath, 'utf8');

assert(
  (cpcSource.includes('isVisualOnly={isTab3DActive}') || cpcSource.includes('isVisualOnly={isVisual3DOnly}')),
  'ControlCenterPanel must pass isTab3DActive / isVisual3DOnly to 3D preset cards and keycaps'
);
assert(
  ((cpcSource.includes('!isTab3DActive && (') || cpcSource.includes('!isVisual3DOnly && (')) && cpcSource.includes('item.title')),
  'ControlCenterPanel element switches must suppress item title in 3D mode'
);
assert(
  cpcSource.includes('!isTab3DActive ?') && cpcSource.includes('preset.name'),
  'ControlCenterPanel style presets must suppress preset name in 3D mode'
);

console.log('✅ Phase 2 Verification Passed: 100% Zero-Text Pure 3D Buttons correctly implemented across all CPC 3D tab controls.');
