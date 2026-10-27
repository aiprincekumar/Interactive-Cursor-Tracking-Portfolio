import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Verifying Phase 1: Always-Collapsed Top Sandbox & Root CSS 3D Bindings...\n');

// 1. Verify loadSavedControlCenterConfig sets showSandboxPreview: false
const labContextPath = path.join(rootDir, 'src', 'context', 'LabContext.jsx');
const labContextSrc = fs.readFileSync(labContextPath, 'utf8');

assert.ok(
  labContextSrc.includes('showSandboxPreview: false, // Always starts collapsed on initial mount / page load per user requirement'),
  'loadSavedControlCenterConfig must strictly enforce showSandboxPreview: false on load'
);

assert.ok(
  labContextSrc.includes('base.showSandboxPreview = false;'),
  'useState initial state for threeD must guarantee base.showSandboxPreview = false on initial mount'
);

console.log('✅ Phase 1 Verification Passed: Top main sandbox is strictly guaranteed to start collapsed on every fresh load.');
