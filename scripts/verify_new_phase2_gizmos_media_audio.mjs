// scripts/verify_new_phase2_gizmos_media_audio.mjs
// Verification suite for NEW PHASE 2: Interactive Gizmos, Audio & Media Specialist
// Features Tested:
// 1. Feature 2: Interactive On-Canvas 3D Sun & Light Arc Gizmo
// 2. Feature 4: Cinematic 360° Turntable Video & High-Res Snapshot Exporter
// 3. Feature 5: Real-Time Binaural 3D Spatial Audio Node & Coordinate Panner

import fs from 'fs';
import path from 'path';
import assert from 'assert';

const ROOT = process.cwd();
let passed = 0;
let failed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    failed++;
  }
}

console.log('================================================================');
console.log('  VERIFY NEW PHASE 2: GIZMOS, MEDIA EXPORT & BINAURAL AUDIO     ');
console.log('================================================================');

// 1. File existence checks
const audioSrcPath = path.join(ROOT, 'src/utils/audio.js');
const soundFXSrcPath = path.join(ROOT, 'src/utils/soundFX.js');
const mediaExportSrcPath = path.join(ROOT, 'src/utils/mediaExport.js');
const labContextSrcPath = path.join(ROOT, 'src/context/LabContext.jsx');
const miniPortfolioSrcPath = path.join(ROOT, 'src/components/3d-sandbox/UniversalMiniPortfolio.jsx');
const panelSrcPath = path.join(ROOT, 'src/components/ControlCenterPanel.jsx');

const audioSrc = fs.readFileSync(audioSrcPath, 'utf8');
const soundFXSrc = fs.readFileSync(soundFXSrcPath, 'utf8');
const mediaExportSrc = fs.readFileSync(mediaExportSrcPath, 'utf8');
const labContextSrc = fs.readFileSync(labContextSrcPath, 'utf8');
const miniPortfolioSrc = fs.readFileSync(miniPortfolioSrcPath, 'utf8');
const panelSrc = fs.readFileSync(panelSrcPath, 'utf8');

// --- Feature 5: Real-Time Binaural 3D Spatial Audio Node & Coordinate Panner ---

runTest('audio.js instantiates StereoPannerNode with fallback', () => {
  assert(audioSrc.includes('this.pannerNode = null'), 'SoundFX must initialize pannerNode reference');
  assert(audioSrc.includes('createStereoPanner'), 'SoundFX must check createStereoPanner');
  assert(audioSrc.includes('this.pannerNode.connect(this.masterGain)'), 'pannerNode must connect to masterGain');
});

runTest('audio.js implements setPanning(panValue) clamped to [-1.0, 1.0]', () => {
  assert(audioSrc.includes('setPanning(panValue)'), 'SoundFX must implement setPanning');
  assert(audioSrc.includes('Math.max(-1.0, Math.min(1.0'), 'setPanning must clamp value between -1.0 and 1.0');
  assert(audioSrc.includes('pannerNode.pan.setTargetAtTime'), 'pannerNode must smoothly schedule pan target');
});

runTest('soundFX.js exports setPanning and getPanning wrappers', () => {
  assert(soundFXSrc.includes('export const setPanning'), 'soundFX.js must export setPanning');
  assert(soundFXSrc.includes('export const getPanning'), 'soundFX.js must export getPanning');
});

runTest('audio.js routes micro-interactions through pannerNode', () => {
  assert(audioSrc.includes('const destNode = this.pannerNode || this.masterGain'), 'Haptic click and pop must route through destNode');
  assert(audioSrc.includes('playCameraShutter()') && audioSrc.includes('playShutterClick()'), 'audio.js must export camera shutter aliases');
});

runTest('UniversalMiniPortfolio calculates normalized coordinate panning on pointer move', () => {
  assert(miniPortfolioSrc.includes('threeD.spatialAudio?.binauralPanning'), 'Must check binauralPanning toggle in pointer move');
  assert(miniPortfolioSrc.includes('soundFX.setPanning('), 'Must call soundFX.setPanning in pointer move');
  assert(miniPortfolioSrc.includes('((clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1'), 'Must calculate normalized X in [-1, 1]');
});

// --- Feature 2: Interactive On-Canvas 3D Sun & Light Arc Gizmo ---

runTest('LabContext schema and normalizer support showSunGizmo toggle', () => {
  assert(labContextSrc.includes('showSunGizmo: true'), 'FACTORY_DEFAULTS.threeD.lighting must have showSunGizmo: true');
  assert(labContextSrc.includes('const showSunGizmo = typeof raw.showSunGizmo === \'boolean\''), 'normalize3DLighting must validate showSunGizmo');
  assert(labContextSrc.includes('set3DShowSunGizmo'), 'LabContext must provide set3DShowSunGizmo');
});

runTest('ControlCenterPanel renders On-Canvas Sun Gizmo toggle under Lighting Accordion', () => {
  assert(panelSrc.includes('On-Canvas Sun Gizmo'), 'Must render On-Canvas Sun Gizmo title');
  assert(panelSrc.includes('Toggle On-Canvas Sun Gizmo'), 'Must have accessible switch for Sun Gizmo');
  assert(panelSrc.includes('lighting.showSunGizmo !== false'), 'Must bind checked state correctly');
});

runTest('UniversalMiniPortfolio renders 3D Sun Arc Gizmo with orbital ring and draggable handle', () => {
  assert(miniPortfolioSrc.includes('data-testid="3d-sun-arc-gizmo"'), 'Must render 3D Sun Arc Gizmo container');
  assert(miniPortfolioSrc.includes('data-testid="sun-gizmo-handle"'), 'Must render draggable sun-gizmo-handle');
  assert(miniPortfolioSrc.includes('handleSunPointerDown'), 'Must attach handleSunPointerDown');
  assert(miniPortfolioSrc.includes('handleSunPointerMove'), 'Must attach handleSunPointerMove');
  assert(miniPortfolioSrc.includes('Math.atan2(dy, dx) * 180 / Math.PI'), 'Must compute azimuth angle from pointer delta');
  assert(miniPortfolioSrc.includes('lab3D.set3DLightingAngle(angleDeg)'), 'Must update lighting angle on drag');
});

// --- Feature 4: Cinematic 360° Turntable Video & High-Res Snapshot Exporter ---

runTest('mediaExport.js exports capture3DStageSnapshot and record360TurntableVideo', () => {
  assert(mediaExportSrc.includes('export async function capture3DStageSnapshot'), 'Must export capture3DStageSnapshot');
  assert(mediaExportSrc.includes('export async function record360TurntableVideo'), 'Must export record360TurntableVideo');
  assert(mediaExportSrc.includes('export function triggerFileDownload'), 'Must export triggerFileDownload');
  assert(mediaExportSrc.includes('portfolio-3d-snapshot'), 'Must generate portfolio-3d-snapshot filename');
  assert(mediaExportSrc.includes('portfolio-3d-turntable'), 'Must generate portfolio-3d-turntable filename');
});

runTest('UniversalMiniPortfolio renders Snapshot and Record 360° Spin buttons in top toolbar', () => {
  assert(miniPortfolioSrc.includes('Snapshot (.webp)'), 'Must render Snapshot (.webp) button in toolbar');
  assert(miniPortfolioSrc.includes('Record 360° Spin (.webm)'), 'Must render Record 360° Spin (.webm) button in toolbar');
  assert(miniPortfolioSrc.includes('handleTakeSnapshot'), 'Must bind handleTakeSnapshot');
  assert(miniPortfolioSrc.includes('handleRecordTurntable'), 'Must bind handleRecordTurntable');
  assert(miniPortfolioSrc.includes('data-testid="export-notice-toast"'), 'Must render export completion toast notice');
});

runTest('ControlCenterPanel renders Snapshot and Record 360° Exporter buttons in Developer Toolkit', () => {
  assert(panelSrc.includes('Cinematic Exporters:'), 'Must render Cinematic Exporters heading in Toolkit Card');
  assert(panelSrc.includes('handleToolkitSnapshot'), 'Must wire handleToolkitSnapshot in ControlCenterPanel');
  assert(panelSrc.includes('handleToolkitTurntable'), 'Must wire handleToolkitTurntable in ControlCenterPanel');
});

console.log('================================================================');
console.log(`  VERIFICATION RESULTS: ${passed} PASSED | ${failed} FAILED`);
console.log('================================================================');

if (failed > 0) {
  process.exit(1);
}
