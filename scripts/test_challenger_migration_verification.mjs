/**
 * ============================================================================
 * CHALLENGER 3: DEEP EMPIRICAL VERIFICATION OF LAB_STUDIO_STATE MIGRATION
 * ============================================================================
 * Target: src/context/LabContext.jsx (loadSavedControlCenterConfig)
 */

import { createServer } from 'vite';

console.log('================================================================');
console.log('  CHALLENGER 3: LAB_STUDIO_STATE MIGRATION EMPIRICAL HARNESS    ');
console.log('================================================================\n');

class MockStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
  get length() {
    return this.store.size;
  }
}

const mockLocalStorage = new MockStorage();
globalThis.localStorage = mockLocalStorage;
globalThis.window = {
  localStorage: mockLocalStorage,
  matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
};

const viteServer = await createServer();
const labContextModule = await viteServer.ssrLoadModule('./src/context/LabContext.jsx');

const {
  CONTROL_CENTER_STORAGE_KEY,
  LAB_STORAGE_KEY,
  LEGACY_STUDIO_STORAGE_KEY,
  FACTORY_DEFAULTS,
  loadSavedControlCenterConfig
} = labContextModule;

let passed = 0;
let total = 0;

function assert(condition, desc) {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✓ [PASS] ${desc}`);
  } else {
    console.error(`  ✗ [FAIL] ${desc}`);
  }
}

// 1. Verify Export Constants
console.log('--- TEST GROUP 1: Storage Key Export Constants ---');
assert(CONTROL_CENTER_STORAGE_KEY === 'portfolio_control_center', "CONTROL_CENTER_STORAGE_KEY === 'portfolio_control_center'");
assert(LAB_STORAGE_KEY === 'portfolio_lab_config', "LAB_STORAGE_KEY === 'portfolio_lab_config'");
assert(LEGACY_STUDIO_STORAGE_KEY === 'lab_studio_state', "LEGACY_STUDIO_STORAGE_KEY === 'lab_studio_state'");

// 2. Nested lab_studio_state Migration
console.log('\n--- TEST GROUP 2: Nested Schema Migration ---');
mockLocalStorage.clear();
mockLocalStorage.setItem('lab_studio_state', JSON.stringify({
  audio: {
    soundEnabled: false,
    masterVolume: 0.22,
    pitchMultiplier: 1.8,
    soundMatchingMode: 'universal'
  },
  cursor: {
    customCursorEnabled: false,
    cursorScale: 1.4,
    flightLerpSpeed: 'dreamy',
    stardustTrailEnabled: false,
    particleColor: '#123456'
  },
  hero: {
    gazeMode: 'fixed',
    poseOverride: 7,
    characterZoom: 1.25,
    flashConfettiEnabled: false
  },
  preferences: {
    defaultStartupRole: 'controller',
    defaultCursorEnabled: false,
    defaultAudioEnabled: false,
    reducedMotion: true
  }
}));

const nestedResult = loadSavedControlCenterConfig();
assert(nestedResult.audio.soundEnabled === false, 'Audio soundEnabled parsed false');
assert(nestedResult.audio.masterVolume === 0.22, 'Audio masterVolume parsed 0.22');
assert(nestedResult.audio.pitchMultiplier === 1.8, 'Audio pitchMultiplier parsed 1.8');
assert(nestedResult.audio.soundMatchingMode === 'universal', 'Audio soundMatchingMode parsed universal');
assert(nestedResult.cursor.customCursorEnabled === false, 'Cursor customCursorEnabled parsed false');
assert(nestedResult.cursor.cursorScale === 1.4, 'Cursor cursorScale parsed 1.4');
assert(nestedResult.cursor.flightLerpSpeed === 'dreamy', 'Cursor flightLerpSpeed parsed dreamy');
assert(nestedResult.cursor.stardustTrailEnabled === false, 'Cursor stardustTrailEnabled parsed false');
assert(nestedResult.cursor.particleColor === '#123456', 'Cursor particleColor parsed #123456');
assert(nestedResult.hero.gazeMode === 'fixed', 'Hero gazeMode parsed fixed');
assert(nestedResult.hero.poseOverride === 7, 'Hero poseOverride parsed 7');
assert(nestedResult.hero.characterZoom === 1.25, 'Hero characterZoom parsed 1.25');
assert(nestedResult.hero.flashConfettiEnabled === false, 'Hero flashConfettiEnabled parsed false');
assert(nestedResult.preferences.defaultStartupRole === 'controller', 'Preferences defaultStartupRole parsed controller');
assert(nestedResult.preferences.defaultCursorEnabled === false, 'Preferences defaultCursorEnabled parsed false');
assert(nestedResult.preferences.defaultAudioEnabled === false, 'Preferences defaultAudioEnabled parsed false');
assert(nestedResult.preferences.reducedMotion === true, 'Preferences reducedMotion parsed true');

// 3. Flat lab_studio_state Migration
console.log('\n--- TEST GROUP 3: Flat Schema Migration ---');
mockLocalStorage.clear();
mockLocalStorage.setItem('lab_studio_state', JSON.stringify({
  soundEnabled: false,
  masterVolume: 0.15,
  pitchMultiplier: 0.75,
  soundMatchingMode: 'universal',
  customCursorEnabled: false,
  cursorScale: 0.9,
  flightSpeed: 0.08, // maps to dreamy
  trailEnabled: false, // maps to stardustTrailEnabled
  particleColor: '#AABBCC',
  heroGazeMode: 'fixed',
  heroPoseOverride: 3,
  heroScale: 1.5,
  cameraEffectsEnabled: false,
  defaultRole: 'mis',
  defaultCursorEnabled: false,
  defaultAudioEnabled: false,
  reducedMotion: true
}));

const flatResult = loadSavedControlCenterConfig();
assert(flatResult.audio.soundEnabled === false, 'Flat soundEnabled parsed false');
assert(flatResult.audio.masterVolume === 0.15, 'Flat masterVolume parsed 0.15');
assert(flatResult.audio.pitchMultiplier === 0.75, 'Flat pitchMultiplier parsed 0.75');
assert(flatResult.audio.soundMatchingMode === 'universal', 'Flat soundMatchingMode parsed universal');
assert(flatResult.cursor.customCursorEnabled === false, 'Flat customCursorEnabled parsed false');
assert(flatResult.cursor.cursorScale === 0.9, 'Flat cursorScale parsed 0.9');
assert(flatResult.cursor.flightLerpSpeed === 'dreamy', 'Flat flightSpeed 0.08 normalized to dreamy');
assert(flatResult.cursor.stardustTrailEnabled === false, 'Flat trailEnabled mapped to stardustTrailEnabled false');
assert(flatResult.cursor.particleColor === '#AABBCC', 'Flat particleColor parsed #AABBCC');
assert(flatResult.hero.gazeMode === 'fixed', 'Flat heroGazeMode parsed fixed');
assert(flatResult.hero.poseOverride === 3, 'Flat heroPoseOverride parsed 3');
assert(flatResult.hero.characterZoom === 1.5, 'Flat heroScale parsed 1.5');
assert(flatResult.hero.flashConfettiEnabled === false, 'Flat cameraEffectsEnabled parsed false');
assert(flatResult.preferences.defaultStartupRole === 'mis', 'Flat defaultRole parsed mis');
assert(flatResult.preferences.defaultCursorEnabled === false, 'Flat defaultCursorEnabled parsed false');
assert(flatResult.preferences.defaultAudioEnabled === false, 'Flat defaultAudioEnabled parsed false');
assert(flatResult.preferences.reducedMotion === true, 'Flat reducedMotion parsed true');

// 4. Clamping and Sanitization in lab_studio_state
console.log('\n--- TEST GROUP 4: Clamping & Sanitization ---');
mockLocalStorage.clear();
mockLocalStorage.setItem('lab_studio_state', JSON.stringify({
  masterVolume: -10, // clamp to 0.0
  audioPitch: 50,    // clamp to 2.0
  cursorScale: 100,  // clamp to 2.0
  heroScale: -5,     // clamp to 0.5
  heroPoseOverride: 999, // out of range -> null
  particleColor: 'not-a-color', // fallback to FACTORY_DEFAULTS.cursor.particleColor (#FF4D6D)
}));

const clampResult = loadSavedControlCenterConfig();
assert(clampResult.audio.masterVolume === 0.0, 'Volume underflow -10 clamped to 0.0');
assert(clampResult.audio.pitchMultiplier === 2.0, 'Pitch overflow 50 clamped to 2.0');
assert(clampResult.cursor.cursorScale === 2.0, 'Cursor scale overflow 100 clamped to 2.0');
assert(clampResult.hero.characterZoom === 0.5, 'Hero scale underflow -5 clamped to 0.5');
assert(clampResult.hero.poseOverride === null, 'Out-of-range pose 999 normalized to null');
assert(clampResult.cursor.particleColor === '#FF4D6D', 'Invalid color sanitized to #FF4D6D');

// 5. Tier 1 Precedence over Tier 2
console.log('\n--- TEST GROUP 5: Tier 1 Atomic Precedence ---');
mockLocalStorage.clear();
mockLocalStorage.setItem('portfolio_control_center', JSON.stringify({
  version: 2,
  audio: { masterVolume: 0.95 },
  cursor: { cursorScale: 1.1 }
}));
mockLocalStorage.setItem('lab_studio_state', JSON.stringify({
  masterVolume: 0.2,
  cursorScale: 1.9
}));

const precedenceResult = loadSavedControlCenterConfig();
assert(precedenceResult.audio.masterVolume === 0.95, 'Tier 1 volume 0.95 overrides legacy lab_studio_state volume 0.2');
assert(precedenceResult.cursor.cursorScale === 1.1, 'Tier 1 cursor scale 1.1 overrides legacy lab_studio_state scale 1.9');

// 6. Corrupt JSON in lab_studio_state
console.log('\n--- TEST GROUP 6: Corrupt lab_studio_state Recovery ---');
mockLocalStorage.clear();
mockLocalStorage.setItem('lab_studio_state', '{"broken json: missing end');
const corruptResult = loadSavedControlCenterConfig();
assert(corruptResult.audio.masterVolume === FACTORY_DEFAULTS.audio.masterVolume, 'Corrupt JSON safely recovers audio defaults');
assert(corruptResult.cursor.cursorScale === FACTORY_DEFAULTS.cursor.cursorScale, 'Corrupt JSON safely recovers cursor defaults');
assert(corruptResult.hero.gazeMode === FACTORY_DEFAULTS.hero.gazeMode, 'Corrupt JSON safely recovers hero defaults');
assert(corruptResult.preferences.defaultStartupRole === FACTORY_DEFAULTS.preferences.defaultStartupRole, 'Corrupt JSON safely recovers preferences defaults');

await viteServer.close();

console.log('\n================================================================');
console.log(`  VERIFICATION RESULT: ${passed}/${total} ASSERTIONS PASSED`);
console.log('================================================================');

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
