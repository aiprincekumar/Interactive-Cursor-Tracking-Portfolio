import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Verifying Sandbox Default Hidden State & Hero Height (560px-600px)...');

// 1. Verify LabContext showSandboxPreview default
const labContextPath = path.join(rootDir, 'src', 'context', 'LabContext.jsx');
const labContextSource = fs.readFileSync(labContextPath, 'utf8');

assert(
  labContextSource.includes('showSandboxPreview: false'),
  'LabContext FACTORY_DEFAULTS.threeD must specify showSandboxPreview: false (default hidden)'
);

// 2. Verify UniversalMiniPortfolio height
const miniPortPath = path.join(rootDir, 'src', 'components', '3d-sandbox', 'UniversalMiniPortfolio.jsx');
const miniPortSource = fs.readFileSync(miniPortPath, 'utf8');

assert(
  miniPortSource.includes('min-h-[560px]') && miniPortSource.includes('sm:h-[600px]'),
  'UniversalMiniPortfolio must configure expansive hero height min-h-[560px] sm:h-[600px]'
);

// 3. Verify ControlCenterPanel unhide CTA
const cpcPath = path.join(rootDir, 'src', 'components', 'ControlCenterPanel.jsx');
const cpcSource = fs.readFileSync(cpcPath, 'utf8');

assert(
  cpcSource.includes('Show 3D Sandbox (Unhide)') || cpcSource.includes('Show 3D Sandbox'),
  'ControlCenterPanel must provide clear Show 3D Sandbox unhide button'
);

console.log('✅ Phase 1 Verification Passed: Sandbox Default Hidden & Expansive Hero Height confirmed.');
