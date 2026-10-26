import fs from 'node:fs';
import path from 'node:path';

console.log('🧪 Starting Verification Gate: Phase 3 (Physics, CAD & Tactile Action Controls)...');

const rootDir = process.cwd();

// 1. Verify src/components/3d-sandbox/PhysicsAndCADVisuals.jsx
const visualsPath = path.join(rootDir, 'src', 'components', '3d-sandbox', 'PhysicsAndCADVisuals.jsx');
if (!fs.existsSync(visualsPath)) {
  console.error('❌ FAIL: src/components/3d-sandbox/PhysicsAndCADVisuals.jsx not found!');
  process.exit(1);
}
const visualsContent = fs.readFileSync(visualsPath, 'utf8');
if (
  !visualsContent.includes('export function SpringElasticityVisual') ||
  !visualsContent.includes('export function ExplodedCADLayerVisual')
) {
  console.error('❌ FAIL: PhysicsAndCADVisuals.jsx missing expected component exports!');
  process.exit(1);
}
console.log('✅ PASS: src/components/3d-sandbox/PhysicsAndCADVisuals.jsx verified.');

// 2. Verify ControlCenterPanel.jsx integrations
const panelPath = path.join(rootDir, 'src', 'components', 'ControlCenterPanel.jsx');
const panelContent = fs.readFileSync(panelPath, 'utf8');

if (!panelContent.includes('SpringElasticityVisual') || !panelContent.includes('ExplodedCADLayerVisual')) {
  console.error('❌ FAIL: ControlCenterPanel.jsx does not import or use PhysicsAndCADVisuals!');
  process.exit(1);
}

const elasticityMatch = panelContent.includes('visualPreview={<SpringElasticityVisual');
const explodedLayerMatch = panelContent.includes('<ExplodedCADLayerVisual');
const actionKeycapsMatch = panelContent.includes('<ThreeDActionKeycap');

if (!elasticityMatch || !explodedLayerMatch || !actionKeycapsMatch) {
  console.error('❌ FAIL: One or more physics/CAD/action controls failed verification in ControlCenterPanel.jsx!', {
    elasticityMatch,
    explodedLayerMatch,
    actionKeycapsMatch
  });
  process.exit(1);
}
console.log('✅ PASS: ControlCenterPanel.jsx physics presets, CAD strata stack and action keycaps verified.');

console.log('\n🎉 100% Phase 3: Physics, CAD & Tactile Action Controls Verified Successfully!');
process.exit(0);
