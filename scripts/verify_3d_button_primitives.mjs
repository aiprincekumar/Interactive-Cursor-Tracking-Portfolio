import fs from 'node:fs';
import path from 'node:path';

console.log('🧪 Starting Verification Gate: Phase 1 (3D Button Primitives & Physics Engine)...');

const rootDir = process.cwd();

// 1. Verify src/hooks/use3DMicroTilt.js
const hookPath = path.join(rootDir, 'src', 'hooks', 'use3DMicroTilt.js');
if (!fs.existsSync(hookPath)) {
  console.error('❌ FAIL: src/hooks/use3DMicroTilt.js not found!');
  process.exit(1);
}
const hookContent = fs.readFileSync(hookPath, 'utf8');
if (!hookContent.includes('export function use3DMicroTilt') || !hookContent.includes('rotX') || !hookContent.includes('rotY')) {
  console.error('❌ FAIL: use3DMicroTilt.js missing essential exports or rotX/rotY calculation!');
  process.exit(1);
}
console.log('✅ PASS: src/hooks/use3DMicroTilt.js verified.');

// 2. Verify src/components/3d-sandbox/ThreeDButtonPrimitives.jsx
const primitivesPath = path.join(rootDir, 'src', 'components', '3d-sandbox', 'ThreeDButtonPrimitives.jsx');
if (!fs.existsSync(primitivesPath)) {
  console.error('❌ FAIL: src/components/3d-sandbox/ThreeDButtonPrimitives.jsx not found!');
  process.exit(1);
}
const primitivesContent = fs.readFileSync(primitivesPath, 'utf8');
if (
  !primitivesContent.includes('export function ThreeDPresetCard') ||
  !primitivesContent.includes('export function ThreeDActionKeycap') ||
  !primitivesContent.includes('export function ThreeDToggleKey')
) {
  console.error('❌ FAIL: ThreeDButtonPrimitives.jsx missing expected component exports!');
  process.exit(1);
}
console.log('✅ PASS: src/components/3d-sandbox/ThreeDButtonPrimitives.jsx verified.');

// 3. Verify CSS classes in src/index.css
const cssPath = path.join(rootDir, 'src', 'index.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');
if (!cssContent.includes('.threed-preserve') || !cssContent.includes('.threed-keycap-surface')) {
  console.error('❌ FAIL: src/index.css missing .threed-preserve or .threed-keycap-surface!');
  process.exit(1);
}
console.log('✅ PASS: src/index.css 3D utility classes verified.');

console.log('\n🎉 100% Phase 1: 3D Button Primitives & Micro-Tilt Engine Verified Successfully!');
process.exit(0);
