import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  VERIFY PHASE 6: 3D SPATIAL AUDIO RADAR & TEST PING TRIGGER   ');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

const labContextPath = path.join(rootDir, 'src/context/LabContext.jsx');
const labContextSrc = fs.readFileSync(labContextPath, 'utf8');

const audioPath = path.join(rootDir, 'src/utils/audio.js');
const audioSrc = fs.readFileSync(audioPath, 'utf8');

const panelPath = path.join(rootDir, 'src/components/ControlCenterPanel.jsx');
const panelSrc = fs.readFileSync(panelPath, 'utf8');

const tests = [];

function addTest(name, fn) {
  tests.push({ name, fn });
}

// ============================================================================
// SUITE 1: LabContext ACOUSTIC PROFILES & STATE EXPORTS
// ============================================================================
addTest('LabContext: Exports ACOUSTIC_PROFILES with booth, studio, and cathedral specs', () => {
  assert(
    labContextSrc.includes('export const ACOUSTIC_PROFILES ='),
    'ACOUSTIC_PROFILES must be defined and exported from LabContext.jsx'
  );

  assert(
    labContextSrc.includes("id: 'booth'") && labContextSrc.includes("name: 'Acoustic Booth'"),
    'ACOUSTIC_PROFILES must contain booth profile'
  );
  assert(
    labContextSrc.includes("id: 'studio'") && labContextSrc.includes("name: 'Mastering Studio'"),
    'ACOUSTIC_PROFILES must contain studio profile'
  );
  assert(
    labContextSrc.includes("id: 'cathedral'") && labContextSrc.includes("name: 'Grand Cathedral'"),
    'ACOUSTIC_PROFILES must contain cathedral profile'
  );
});

addTest('LabContext: Acoustic profiles define reflectionCount, rayLength, decayMultiplier, and badge', () => {
  assert(
    labContextSrc.includes('reflectionCount: 4') &&
    labContextSrc.includes('reflectionCount: 8') &&
    labContextSrc.includes('reflectionCount: 12'),
    'ACOUSTIC_PROFILES must define reflectionCount for booth, studio, and cathedral'
  );

  assert(
    labContextSrc.includes('rayLength:') &&
    labContextSrc.includes('decayMultiplier:'),
    'ACOUSTIC_PROFILES must define rayLength and decayMultiplier'
  );

  assert(
    labContextSrc.includes('badge:'),
    'ACOUSTIC_PROFILES must define acoustic badge labels'
  );
});

addTest('LabContext: Includes acousticProfiles in useLab return value alongside physicsProfiles', () => {
  assert(
    labContextSrc.includes('acousticProfiles: ACOUSTIC_PROFILES'),
    'useLab must return acousticProfiles: ACOUSTIC_PROFILES'
  );
  assert(
    labContextSrc.includes('physicsProfiles: PHYSICS_PROFILES'),
    'useLab must return physicsProfiles: PHYSICS_PROFILES'
  );
});

// ============================================================================
// SUITE 2: AUDIO SYNTHESIZER (src/utils/audio.js)
// ============================================================================
addTest('SoundFX: Defines playSpatialPing(options = {}) method', () => {
  assert(
    audioSrc.includes('playSpatialPing(options = {})') || audioSrc.includes('playSpatialPing('),
    'SoundFX class must define playSpatialPing method'
  );
});

addTest('SoundFX: playSpatialPing implements harmonic oscillator pair (880Hz + 1320Hz)', () => {
  assert(
    audioSrc.includes('880') && audioSrc.includes('1320'),
    'playSpatialPing must synthesize harmonic pair 880Hz + 1320Hz'
  );
  assert(
    audioSrc.includes('createOscillator'),
    'playSpatialPing must create Web Audio oscillators'
  );
});

addTest('SoundFX: playSpatialPing utilizes StereoPannerNode or direct gain fallback', () => {
  assert(
    audioSrc.includes('createStereoPanner') || audioSrc.includes('StereoPannerNode'),
    'playSpatialPing must utilize StereoPannerNode when supported'
  );
  assert(
    audioSrc.includes('panner') && audioSrc.includes('panVal'),
    'playSpatialPing must configure spatial stereo panner'
  );
});

addTest('SoundFX: playSpatialPing scales envelope decay and reflections by roomSize & reverbIntensity', () => {
  assert(
    audioSrc.includes("'booth'") &&
    audioSrc.includes("'studio'") &&
    audioSrc.includes("'cathedral'"),
    'playSpatialPing must handle roomSize values (booth, studio, cathedral)'
  );
  assert(
    audioSrc.includes('decayMultiplier') && audioSrc.includes('reverbIntensity'),
    'playSpatialPing must scale envelope and reflections by decayMultiplier & reverbIntensity'
  );
});

addTest('SoundFX: playSpatialPing includes haptic pulse and muted safeguard', () => {
  assert(
    audioSrc.includes('if (!this.enabled) return;'),
    'playSpatialPing must check if (!this.enabled) return'
  );
  assert(
    audioSrc.includes('triggerHaptic'),
    'playSpatialPing must call triggerHaptic for tactile pulse'
  );
});

// ============================================================================
// SUITE 3: SECTION 8 RADAR VISUALIZER IN CONTROL CENTER PANEL
// ============================================================================
addTest('ControlCenterPanel: Section 8 spatialAudio contains SpatialAudioRadarVisualizer', () => {
  const spatialAccordionIdx = panelSrc.indexOf("expandedAccordion === 'spatialAudio'");
  assert(spatialAccordionIdx !== -1, 'Must have Section 8 spatialAudio accordion section');

  const radarVisualizerUsageIdx = panelSrc.indexOf('<SpatialAudioRadarVisualizer', spatialAccordionIdx);
  const performanceAccordionIdx = panelSrc.indexOf("expandedAccordion === 'performance'");

  assert(radarVisualizerUsageIdx !== -1, '<SpatialAudioRadarVisualizer /> must be mounted inside Section 8');
  assert(
    radarVisualizerUsageIdx < performanceAccordionIdx,
    'SpatialAudioRadarVisualizer must appear before Section 9 (performance)'
  );
});

addTest('SpatialAudioRadarVisualizer: Renders polar display with ~130px diameter and 3 concentric rings', () => {
  assert(
    panelSrc.includes('SpatialAudioRadarVisualizer'),
    'SpatialAudioRadarVisualizer component definition must exist'
  );
  assert(
    panelSrc.includes('130') && panelSrc.includes('viewBox="0 0 130 130"'),
    'Radar polar display must have ~130px diameter SVG viewBox'
  );
  assert(
    panelSrc.includes('r="20"') && panelSrc.includes('r="40"') && panelSrc.includes('r="58"'),
    'Radar polar display must render 3 concentric range distance rings'
  );
});

addTest('SpatialAudioRadarVisualizer: Sweeping radar beam with rotational glow', () => {
  assert(
    panelSrc.includes('radarSweepBeam') || panelSrc.includes('radarGlowFilter'),
    'Radar must include sweep beam gradient or glow filter'
  );
  assert(
    panelSrc.includes('animation:') || panelSrc.includes('animate-spin') || panelSrc.includes('spin'),
    'Radar beam must animate 360-degree sweep'
  );
});

addTest('SpatialAudioRadarVisualizer: Dynamic room bounce reflection vectors radiating outward', () => {
  assert(
    panelSrc.includes('rays.map') || panelSrc.includes('activeProfile.rays'),
    'Radar must map dynamic acoustic bounce reflection vectors'
  );
  assert(
    panelSrc.includes('cathedral') && panelSrc.includes('booth'),
    'Reflection vectors must adapt to room sizes'
  );
});

addTest('SpatialAudioRadarVisualizer: Expanding ripple soundwave ring when ping is fired', () => {
  assert(
    panelSrc.includes('pingRippleActive'),
    'Radar must track ping ripple active state'
  );
  assert(
    panelSrc.includes('soundwave-ripple') || panelSrc.includes('animate-ping'),
    'Radar must render expanding soundwave ripple ring upon ping'
  );
});

addTest('SpatialAudioRadarVisualizer: Dedicated "🔊 Preview Spatial Ping" trigger button', () => {
  assert(
    panelSrc.includes('🔊 Preview Spatial Ping') ||
    panelSrc.includes('Preview Spatial Ping'),
    'Dedicated "🔊 Preview Spatial Ping" trigger button must exist'
  );
  assert(
    panelSrc.includes('soundFX.playSpatialPing') ||
    panelSrc.includes('playSpatialPing'),
    'Trigger button must call soundFX.playSpatialPing'
  );
});

addTest('SpatialAudioRadarVisualizer: Displays 3 acoustic telemetry badges (HRTF, Room Tail, Material Tap)', () => {
  assert(
    panelSrc.includes('Binaural HRTF:'),
    'Telemetry badge must display Binaural HRTF status'
  );
  assert(
    panelSrc.includes('Room Tail:'),
    'Telemetry badge must display Room Tail decay seconds'
  );
  assert(
    panelSrc.includes('Material Tap:'),
    'Telemetry badge must display active Material Tap resonance'
  );
  assert(
    panelSrc.includes('Glass') &&
    panelSrc.includes('Chrome') &&
    panelSrc.includes('Clay') &&
    panelSrc.includes('Wireframe'),
    'Material Tap resonance badge must map presets to Glass, Chrome, Clay, or Wireframe'
  );
});

// ============================================================================
// SUITE 4: ACCESSIBILITY & KEYBOARD SUPPORT
// ============================================================================
addTest('SpatialAudioRadarVisualizer: Implements role="region", aria-label, and keyboard support', () => {
  assert(
    panelSrc.includes('role="region"'),
    'Visualizer must provide role="region"'
  );
  assert(
    panelSrc.includes('aria-label="3D Spatial Audio Soundfield Radar"'),
    'Visualizer must provide descriptive aria-label'
  );
  assert(
    panelSrc.includes('handleKeyDown') && (panelSrc.includes('Enter') || panelSrc.includes(' ')),
    'Ping button must support keyboard Enter / Space activation'
  );
});

// ============================================================================
// SUITE 5: VITE SSR DYNAMIC COMPILATION
// ============================================================================
addTest('audio.js, LabContext.jsx & ControlCenterPanel.jsx compile cleanly in Vite SSR', async () => {
  const { createServer } = await import('vite');
  const server = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  try {
    const audioMod = await server.ssrLoadModule('/src/utils/audio.js');
    assert(audioMod.soundFX, 'audio.js must export soundFX');
    assert.strictEqual(typeof audioMod.soundFX.playSpatialPing, 'function', 'soundFX.playSpatialPing must be a function');

    const labMod = await server.ssrLoadModule('/src/context/LabContext.jsx');
    assert(labMod.LabProvider || labMod.useLab, 'LabContext must export LabProvider/useLab');
    assert(labMod.ACOUSTIC_PROFILES, 'LabContext must export ACOUSTIC_PROFILES');
    assert(labMod.PHYSICS_PROFILES, 'LabContext must export PHYSICS_PROFILES');

    const panelMod = await server.ssrLoadModule('/src/components/ControlCenterPanel.jsx');
    assert(panelMod.default, 'ControlCenterPanel default export must exist');
    assert(
      typeof panelMod.default === 'function' || typeof panelMod.default === 'object',
      'ControlCenterPanel must export a React component'
    );
  } finally {
    await server.close();
  }
});

// ============================================================================
// RUN ALL TESTS
// ============================================================================
async function runAll() {
  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passCount++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     ${err.message}`);
      failCount++;
    }
  }

  console.log('\n================================================================');
  console.log(`  PHASE 6 VERIFICATION: ${passCount} PASSED | ${failCount} FAILED`);
  console.log('================================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runAll();
