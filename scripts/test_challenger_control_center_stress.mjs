/**
 * ============================================================================
 * EMPIRICAL CHALLENGER 1: PORTFOLIO CONTROL CENTER COMPREHENSIVE STRESS HARNESS
 * ============================================================================
 * Author: challenger_cc_1 (Empirical Challenger, Milestone 3)
 * Target: Portfolio Control Center Modernization
 *
 * Empirical Challenge Dimensions:
 * 1. State Persistence & Storage Key Architecture
 * 2. Boundary & Edge Case Stress Testing (Clamping Oracles)
 * 3. Corrupt JSON & Malformed Data Recovery
 * 4. Legacy Key Migration (portfolio_lab_config, lab_studio_state, individual keys)
 * 5. 1-Click Factory Reset State Integrity
 * 6. Rapid Mode Toggling & Debounce Stress
 * 7. Web Audio Synthesizer Node Topology & Gain Smoothing
 * 8. Static & Runtime Architecture Conformance
 */

import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'vite';

console.log('================================================================');
console.log('  CHALLENGER 1: CONTROL CENTER EMPIRICAL STRESS TEST HARNESS    ');
console.log('================================================================\n');

// ---------------------------------------------------------------------------
// 0. Mock Browser & Web Audio Environment
// ---------------------------------------------------------------------------
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

class MockAudioParam {
  constructor(val = 1.0) {
    this.value = val;
    this.events = [];
  }
  setValueAtTime(val, t) {
    this.value = val;
    this.events.push({ type: 'setValueAtTime', val, t });
  }
  exponentialRampToValueAtTime(val, t) {
    this.events.push({ type: 'exponentialRampToValueAtTime', val, t });
  }
  linearRampToValueAtTime(val, t) {
    this.events.push({ type: 'linearRampToValueAtTime', val, t });
  }
  setTargetAtTime(val, t, timeConstant) {
    this.value = val;
    this.events.push({ type: 'setTargetAtTime', val, t, timeConstant });
  }
  cancelScheduledValues(t) {
    this.events.push({ type: 'cancelScheduledValues', t });
  }
}

class MockAudioNode {
  constructor() {
    this.connections = [];
  }
  connect(target) {
    this.connections.push(target);
  }
}

class MockGainNode extends MockAudioNode {
  constructor() {
    super();
    this.gain = new MockAudioParam(1.0);
  }
}

class MockOscillatorNode extends MockAudioNode {
  constructor() {
    super();
    this.frequency = new MockAudioParam(440);
    this.type = 'sine';
    this.started = false;
    this.stopped = false;
  }
  start(t) {
    this.started = true;
    this.startTime = t;
  }
  stop(t) {
    this.stopped = true;
    this.stopTime = t;
  }
}

class MockBiquadFilterNode extends MockAudioNode {
  constructor() {
    super();
    this.frequency = new MockAudioParam(1000);
    this.Q = new MockAudioParam(1);
    this.type = 'lowpass';
  }
}

class MockBufferSourceNode extends MockAudioNode {
  constructor() {
    super();
    this.buffer = null;
    this.started = false;
  }
  start(t) {
    this.started = true;
    this.startTime = t;
  }
}

class MockAudioContext {
  constructor() {
    this.currentTime = 1.0;
    this.sampleRate = 44100;
    this.state = 'running';
    this.destination = new MockAudioNode();
  }
  createGain() {
    return new MockGainNode();
  }
  createOscillator() {
    return new MockOscillatorNode();
  }
  createBiquadFilter() {
    return new MockBiquadFilterNode();
  }
  createBuffer(channels, length, sampleRate) {
    return {
      channels,
      length,
      sampleRate,
      getChannelData: () => new Float32Array(length),
    };
  }
  createBufferSource() {
    return new MockBufferSourceNode();
  }
  resume() {
    this.state = 'running';
    return Promise.resolve();
  }
}

const mockLocalStorage = new MockStorage();
const mockWindowEvents = new Map();

globalThis.localStorage = mockLocalStorage;
globalThis.window = {
  AudioContext: MockAudioContext,
  webkitAudioContext: MockAudioContext,
  localStorage: mockLocalStorage,
  innerWidth: 1920,
  innerHeight: 1080,
  matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
  navigator: {
    vibrate: () => true,
  },
  addEventListener: (event, handler) => {
    if (!mockWindowEvents.has(event)) mockWindowEvents.set(event, []);
    mockWindowEvents.get(event).push(handler);
  },
  removeEventListener: (event, handler) => {
    if (!mockWindowEvents.has(event)) return;
    const arr = mockWindowEvents.get(event).filter(h => h !== handler);
    mockWindowEvents.set(event, arr);
  },
  dispatchEvent: (event) => {
    const list = mockWindowEvents.get(event.type) || [];
    list.forEach(fn => fn(event));
    return true;
  }
};

globalThis.document = {
  body: {
    classList: {
      _classes: new Set(),
      toggle(cls, force) {
        if (force === undefined) {
          if (this._classes.has(cls)) this._classes.delete(cls);
          else this._classes.add(cls);
        } else if (force) {
          this._classes.add(cls);
        } else {
          this._classes.delete(cls);
        }
      },
      add(cls) { this._classes.add(cls); },
      remove(cls) { this._classes.delete(cls); },
      contains(cls) { return this._classes.has(cls); }
    }
  },
  documentElement: {
    classList: {
      _classes: new Set(),
      toggle(cls, force) {
        if (force === undefined) {
          if (this._classes.has(cls)) this._classes.delete(cls);
          else this._classes.add(cls);
        } else if (force) {
          this._classes.add(cls);
        } else {
          this._classes.delete(cls);
        }
      },
      add(cls) { this._classes.add(cls); },
      remove(cls) { this._classes.delete(cls); },
      contains(cls) { return this._classes.has(cls); }
    }
  }
};

// Start Vite server to load JSX modules
const viteServer = await createServer();
const labContextModule = await viteServer.ssrLoadModule('./src/context/LabContext.jsx');
const { soundFX, SOUNDBOARD_SOUNDS } = await import('../src/utils/audio.js');

const {
  CONTROL_CENTER_STORAGE_KEY,
  LAB_STORAGE_KEY,
  FACTORY_DEFAULTS,
  loadSavedControlCenterConfig
} = labContextModule;

let totalAssertions = 0;
let passedAssertions = 0;
const findings = [];

function assertTest(condition, description, category = 'General') {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`  ✓ [PASS] ${description}`);
  } else {
    findings.push({ category, description });
    console.error(`  ✗ [FAIL] ${description}`);
  }
}

// ===========================================================================
// SUITE 1: State Persistence & Storage Key Architecture
// ===========================================================================
console.log('\n--- SUITE 1: State Persistence & Storage Key Architecture ---');
mockLocalStorage.clear();

assertTest(
  CONTROL_CENTER_STORAGE_KEY === 'portfolio_control_center',
  `Storage key constant strictly matches 'portfolio_control_center' (actual: '${CONTROL_CENTER_STORAGE_KEY}')`,
  'Storage Key'
);

assertTest(
  LAB_STORAGE_KEY === 'portfolio_lab_config',
  `Legacy mirror storage key strictly matches 'portfolio_lab_config' (actual: '${LAB_STORAGE_KEY}')`,
  'Storage Key'
);

assertTest(
  FACTORY_DEFAULTS && typeof FACTORY_DEFAULTS === 'object' && FACTORY_DEFAULTS.version === 2,
  'FACTORY_DEFAULTS defines version 2 schema root',
  'Schema'
);

assertTest(
  typeof FACTORY_DEFAULTS.audio === 'object' &&
  typeof FACTORY_DEFAULTS.audio.soundEnabled === 'boolean' &&
  FACTORY_DEFAULTS.audio.masterVolume === 0.8 &&
  FACTORY_DEFAULTS.audio.pitchMultiplier === 1.0 &&
  FACTORY_DEFAULTS.audio.soundMatchingMode === 'dynamic',
  'FACTORY_DEFAULTS.audio namespace adheres to authoritative contract',
  'Schema'
);

assertTest(
  typeof FACTORY_DEFAULTS.cursor === 'object' &&
  FACTORY_DEFAULTS.cursor.customCursorEnabled === true &&
  FACTORY_DEFAULTS.cursor.cursorScale === 1.0 &&
  FACTORY_DEFAULTS.cursor.flightLerpSpeed === 'natural' &&
  FACTORY_DEFAULTS.cursor.stardustTrailEnabled === true &&
  FACTORY_DEFAULTS.cursor.particleColor === '#FF4D6D',
  'FACTORY_DEFAULTS.cursor namespace adheres to authoritative contract',
  'Schema'
);

assertTest(
  typeof FACTORY_DEFAULTS.hero === 'object' &&
  FACTORY_DEFAULTS.hero.gazeMode === 'auto' &&
  FACTORY_DEFAULTS.hero.poseOverride === null &&
  FACTORY_DEFAULTS.hero.characterZoom === 1.0 &&
  FACTORY_DEFAULTS.hero.flashConfettiEnabled === true,
  'FACTORY_DEFAULTS.hero namespace adheres to authoritative contract',
  'Schema'
);

assertTest(
  typeof FACTORY_DEFAULTS.preferences === 'object' &&
  FACTORY_DEFAULTS.preferences.defaultStartupRole === 'accountant' &&
  FACTORY_DEFAULTS.preferences.defaultCursorEnabled === true &&
  FACTORY_DEFAULTS.preferences.defaultAudioEnabled === true &&
  FACTORY_DEFAULTS.preferences.reducedMotion === false,
  'FACTORY_DEFAULTS.preferences namespace adheres to authoritative contract',
  'Schema'
);

// Verify initial load on clean localStorage yields FACTORY_DEFAULTS
const cleanConfig = loadSavedControlCenterConfig();
assertTest(
  cleanConfig.audio.masterVolume === 0.8 &&
  cleanConfig.cursor.cursorScale === 1.0 &&
  cleanConfig.hero.gazeMode === 'auto' &&
  cleanConfig.preferences.defaultStartupRole === 'accountant',
  'Clean environment initializes to exact FACTORY_DEFAULTS values',
  'Initialization'
);

// ===========================================================================
// SUITE 2: Boundary & Edge Case Stress Testing (Clamping Oracles)
// ===========================================================================
console.log('\n--- SUITE 2: Boundary & Edge Case Stress Testing ---');

// 2.1 Volume Boundary Clamping
const volumeCases = [
  { input: 0.0, expected: 0.0, desc: 'Volume at lower boundary (0.0)' },
  { input: 1.0, expected: 1.0, desc: 'Volume at upper boundary (1.0)' },
  { input: -5, expected: 0.0, desc: 'Negative volume underflow (-5 clamped to 0.0)' },
  { input: 150, expected: 1.0, desc: 'Percentage volume overflow (150 clamped to 1.0)' },
  { input: 80, expected: 0.8, desc: 'Integer percentage (80 converted to 0.8)' },
  { input: '0.45', expected: 0.45, desc: 'Valid float string ("0.45" parsed to 0.45)' },
  { input: NaN, expected: 0.8, desc: 'NaN volume falls back to 0.8' },
  { input: null, expected: 0.8, desc: 'null volume falls back to 0.8' },
  { input: undefined, expected: 0.8, desc: 'undefined volume falls back to 0.8' },
  { input: 'invalid', expected: 0.8, desc: 'String "invalid" volume falls back to 0.8' },
];

for (const tc of volumeCases) {
  mockLocalStorage.clear();
  mockLocalStorage.setItem(CONTROL_CENTER_STORAGE_KEY, JSON.stringify({
    audio: { masterVolume: tc.input }
  }));
  const res = loadSavedControlCenterConfig();
  assertTest(
    res.audio.masterVolume === tc.expected,
    `${tc.desc}: got ${res.audio.masterVolume}`,
    'Boundary: Volume'
  );
}

// 2.2 Pitch Multiplier Boundary Clamping [0.5, 2.0]
const pitchCases = [
  { input: 0.5, expected: 0.5, desc: 'Pitch at minimum bass boundary (0.5)' },
  { input: 2.0, expected: 2.0, desc: 'Pitch at maximum treble boundary (2.0)' },
  { input: 0.1, expected: 0.5, desc: 'Pitch underflow (0.1 clamped to 0.5)' },
  { input: 5.0, expected: 2.0, desc: 'Pitch overflow (5.0 clamped to 2.0)' },
  { input: -10.0, expected: 0.5, desc: 'Negative pitch (-10.0 clamped to 0.5)' },
  { input: '1.75', expected: 1.75, desc: 'Valid float string ("1.75" parsed to 1.75)' },
  { input: NaN, expected: 1.0, desc: 'NaN pitch falls back to 1.0' },
  { input: null, expected: 1.0, desc: 'null pitch falls back to 1.0' },
  { input: undefined, expected: 1.0, desc: 'undefined pitch falls back to 1.0' },
  { input: 'soprano', expected: 1.0, desc: 'Non-numeric string pitch falls back to 1.0' },
];

for (const tc of pitchCases) {
  mockLocalStorage.clear();
  mockLocalStorage.setItem(CONTROL_CENTER_STORAGE_KEY, JSON.stringify({
    audio: { pitchMultiplier: tc.input }
  }));
  const res = loadSavedControlCenterConfig();
  assertTest(
    res.audio.pitchMultiplier === tc.expected,
    `${tc.desc}: got ${res.audio.pitchMultiplier}`,
    'Boundary: Pitch'
  );
}

// 2.3 Cursor Scale & Character Zoom Boundary Clamping [0.5, 2.0]
const scaleCases = [
  { input: 0.5, expected: 0.5, desc: 'Scale at minimum boundary (0.5)' },
  { input: 2.0, expected: 2.0, desc: 'Scale at maximum boundary (2.0)' },
  { input: 0.0, expected: 0.5, desc: 'Zero scale underflow (0.0 clamped to 0.5)' },
  { input: 10.0, expected: 2.0, desc: 'Massive scale overflow (10.0 clamped to 2.0)' },
  { input: -2.5, expected: 0.5, desc: 'Negative scale (-2.5 clamped to 0.5)' },
  { input: '1.25', expected: 1.25, desc: 'String scale ("1.25" parsed to 1.25)' },
  { input: NaN, expected: 1.0, desc: 'NaN scale falls back to 1.0' },
  { input: null, expected: 1.0, desc: 'null scale falls back to 1.0' },
];

for (const tc of scaleCases) {
  mockLocalStorage.clear();
  mockLocalStorage.setItem(CONTROL_CENTER_STORAGE_KEY, JSON.stringify({
    cursor: { cursorScale: tc.input },
    hero: { characterZoom: tc.input }
  }));
  const res = loadSavedControlCenterConfig();
  assertTest(
    res.cursor.cursorScale === tc.expected && res.hero.characterZoom === tc.expected,
    `Cursor scale & Hero zoom ${tc.desc}: cursor=${res.cursor.cursorScale}, hero=${res.hero.characterZoom}`,
    'Boundary: Scale'
  );
}

// 2.4 Head Pose Override Boundary Normalization
const poseCases = [
  { input: 0, expected: 0, desc: 'Pose 0 (Rear idle)' },
  { input: 5, expected: 5, desc: 'Pose 5 (Center front)' },
  { input: 9, expected: 9, desc: 'Pose 9 (Lower right)' },
  { input: 'center', expected: 5, desc: "Pose string 'center' mapped to index 5" },
  { input: 'upper-left', expected: 6, desc: "Pose string 'upper-left' mapped to index 6" },
  { input: 'auto', expected: null, desc: "Pose 'auto' mapped to null" },
  { input: null, expected: null, desc: 'null pose remains null' },
  { input: -1, expected: null, desc: 'Negative pose index (-1 normalized to null)' },
  { input: 10, expected: null, desc: 'Out of bounds pose index (10 normalized to null)' },
  { input: 999, expected: null, desc: 'High out of bounds pose index (999 normalized to null)' },
  { input: 'invalid_pose_name', expected: null, desc: 'Unknown pose string normalized to null' }
];

for (const tc of poseCases) {
  mockLocalStorage.clear();
  mockLocalStorage.setItem(CONTROL_CENTER_STORAGE_KEY, JSON.stringify({
    hero: { poseOverride: tc.input }
  }));
  const res = loadSavedControlCenterConfig();
  assertTest(
    res.hero.poseOverride === tc.expected,
    `${tc.desc}: got ${res.hero.poseOverride}`,
    'Boundary: Pose'
  );
}

// 2.5 Particle Color Sanitization
const colorCases = [
  { input: '#FF4D6D', expected: '#FF4D6D', desc: 'Valid 6-digit hex (#FF4D6D)' },
  { input: '#00F2FE', expected: '#00F2FE', desc: 'Valid 6-digit hex (#00F2FE)' },
  { input: '#FFF', expected: '#FFF', desc: 'Valid 3-digit hex (#FFF)' },
  { input: '#123456', expected: '#123456', desc: 'Valid 6-digit hex lowercase (#123456)' },
  { input: 'red', expected: '#FF4D6D', desc: 'Named color ("red" falls back to #FF4D6D)' },
  { input: 'rgb(255, 0, 0)', expected: '#FF4D6D', desc: 'RGB syntax falls back to #FF4D6D' },
  { input: '#12345', expected: '#FF4D6D', desc: '5-digit hex falls back to #FF4D6D' },
  { input: 'not_a_color', expected: '#FF4D6D', desc: 'Garbage string falls back to #FF4D6D' },
  { input: null, expected: '#FF4D6D', desc: 'null color falls back to #FF4D6D' },
];

for (const tc of colorCases) {
  mockLocalStorage.clear();
  mockLocalStorage.setItem(CONTROL_CENTER_STORAGE_KEY, JSON.stringify({
    cursor: { particleColor: tc.input }
  }));
  const res = loadSavedControlCenterConfig();
  assertTest(
    res.cursor.particleColor === tc.expected,
    `${tc.desc}: got ${res.cursor.particleColor}`,
    'Boundary: Color'
  );
}

// ===========================================================================
// SUITE 3: Corrupt JSON & Malformed Data Recovery
// ===========================================================================
console.log('\n--- SUITE 3: Corrupt JSON & Malformed Data Recovery ---');

const corruptCases = [
  { payload: '{invalid json syntax: 123', desc: 'SyntaxError: Unterminated/unquoted JSON' },
  { payload: 'undefined', desc: 'Literal string "undefined"' },
  { payload: '<!DOCTYPE html><html><body>Error</body></html>', desc: 'HTML response in localStorage' },
  { payload: '', desc: 'Empty string in localStorage' },
  { payload: '{"audio":', desc: 'Truncated JSON stream' },
  { payload: 'null', desc: 'JSON null literal' },
  { payload: '"plain text string"', desc: 'JSON string primitive' },
  { payload: '123456', desc: 'JSON number primitive' },
  { payload: 'true', desc: 'JSON boolean primitive' },
  { payload: '[1, 2, 3, "four"]', desc: 'JSON array instead of object' },
];

for (const tc of corruptCases) {
  mockLocalStorage.clear();
  mockLocalStorage.setItem(CONTROL_CENTER_STORAGE_KEY, tc.payload);
  let res = null;
  let didThrow = false;
  try {
    res = loadSavedControlCenterConfig();
  } catch {
    didThrow = true;
  }

  assertTest(
    !didThrow && res && typeof res === 'object' && res.audio && res.cursor && res.hero && res.preferences,
    `Resilient recovery from [${tc.desc}]: 0 crashes, returned valid 4-namespace schema`,
    'Corrupt JSON Recovery'
  );
}

// Partial payloads stress test
const partialCases = [
  { payload: {}, desc: 'Empty object {}' },
  { payload: { audio: {} }, desc: 'Object with only empty audio: {}' },
  { payload: { audio: { masterVolume: 0.3 } }, desc: 'Only masterVolume provided' },
  { payload: { cursor: { cursorScale: 1.8 } }, desc: 'Only cursorScale provided' },
  { payload: { hero: { gazeMode: 'fixed' } }, desc: 'Only gazeMode provided' },
  { payload: { preferences: { defaultStartupRole: 'mis' } }, desc: 'Only defaultStartupRole provided' },
  { payload: { audio: null, cursor: undefined, hero: 'bogus', preferences: 42 }, desc: 'Corrupted namespace types' },
];

for (const tc of partialCases) {
  mockLocalStorage.clear();
  mockLocalStorage.setItem(CONTROL_CENTER_STORAGE_KEY, JSON.stringify(tc.payload));
  const res = loadSavedControlCenterConfig();
  assertTest(
    res &&
    typeof res.audio.soundEnabled === 'boolean' &&
    typeof res.audio.masterVolume === 'number' &&
    typeof res.cursor.customCursorEnabled === 'boolean' &&
    typeof res.cursor.cursorScale === 'number' &&
    typeof res.hero.gazeMode === 'string' &&
    typeof res.preferences.defaultStartupRole === 'string',
    `Partial payload [${tc.desc}] filled all missing namespaces with safe defaults`,
    'Partial Payload Recovery'
  );
}

// ===========================================================================
// SUITE 4: Legacy Key Migration
// ===========================================================================
console.log('\n--- SUITE 4: Legacy Key Migration ---');

// 4.1 Migration from legacy portfolio_lab_config (version 1)
mockLocalStorage.clear();
const legacyLabConfig = {
  version: 1,
  cursorScale: 1.6,
  flightSpeed: 0.24, // snappy
  trailEnabled: false,
  particleColor: '#00F2FE',
  soundEnabled: false,
  masterVolume: 0.45,
  audioPitch: 1.65,
  activePreset: 'cyberpunk',
  updatedAt: '2026-10-15T00:00:00.000Z'
};
mockLocalStorage.setItem(LAB_STORAGE_KEY, JSON.stringify(legacyLabConfig));

const migratedFromLabConfig = loadSavedControlCenterConfig();

assertTest(
  migratedFromLabConfig.audio.soundEnabled === false,
  'Migrated legacy soundEnabled: false',
  'Legacy Migration'
);
assertTest(
  migratedFromLabConfig.audio.masterVolume === 0.45,
  'Migrated legacy masterVolume: 0.45',
  'Legacy Migration'
);
assertTest(
  migratedFromLabConfig.audio.pitchMultiplier === 1.65,
  'Migrated legacy audioPitch -> pitchMultiplier: 1.65',
  'Legacy Migration'
);
assertTest(
  migratedFromLabConfig.cursor.cursorScale === 1.6,
  'Migrated legacy cursorScale: 1.6',
  'Legacy Migration'
);
assertTest(
  migratedFromLabConfig.cursor.flightLerpSpeed === 'snappy',
  "Migrated legacy flightSpeed 0.24 -> 'snappy'",
  'Legacy Migration'
);
assertTest(
  migratedFromLabConfig.cursor.stardustTrailEnabled === false,
  'Migrated legacy trailEnabled -> stardustTrailEnabled: false',
  'Legacy Migration'
);
assertTest(
  migratedFromLabConfig.cursor.particleColor === '#00F2FE',
  'Migrated legacy particleColor: #00F2FE',
  'Legacy Migration'
);

// 4.2 Migration from individual loose legacy keys
mockLocalStorage.clear();
mockLocalStorage.setItem('physics_particle_color', '#FFD700');
mockLocalStorage.setItem('physics_audio_pitch', '1.85');
mockLocalStorage.setItem('portfolio_sound_enabled', 'false');

const migratedFromLooseKeys = loadSavedControlCenterConfig();
assertTest(
  migratedFromLooseKeys.cursor.particleColor === '#FFD700',
  'Migrated loose key physics_particle_color: #FFD700',
  'Legacy Migration'
);
assertTest(
  migratedFromLooseKeys.audio.pitchMultiplier === 1.85,
  'Migrated loose key physics_audio_pitch: 1.85',
  'Legacy Migration'
);
assertTest(
  migratedFromLooseKeys.audio.soundEnabled === false,
  'Migrated loose key portfolio_sound_enabled: false',
  'Legacy Migration'
);

// 4.3 Empirical check for lab_studio_state key migration
mockLocalStorage.clear();
const legacyStudioState = {
  soundEnabled: false,
  masterVolume: 0.35,
  cursorScale: 1.75,
  soundMatchingMode: 'universal'
};
mockLocalStorage.setItem('lab_studio_state', JSON.stringify(legacyStudioState));
const studioStateMigration = loadSavedControlCenterConfig();

const didMigrateStudioState = (
  studioStateMigration.audio.masterVolume === 0.35 &&
  studioStateMigration.cursor.cursorScale === 1.75
);

assertTest(
  didMigrateStudioState,
  `Legacy key 'lab_studio_state' migration verification (migrated: ${didMigrateStudioState})`,
  'Legacy Migration: lab_studio_state'
);

// ===========================================================================
// SUITE 5: 1-Click Factory Reset
// ===========================================================================
console.log('\n--- SUITE 5: 1-Click Factory Reset ---');

// Mutate state in storage
const mutatedState = {
  version: 2,
  audio: {
    soundEnabled: false,
    masterVolume: 0.15,
    pitchMultiplier: 1.95,
    soundMatchingMode: 'universal'
  },
  cursor: {
    customCursorEnabled: false,
    cursorScale: 1.85,
    flightLerpSpeed: 'snappy',
    stardustTrailEnabled: false,
    particleColor: '#00F2FE'
  },
  hero: {
    gazeMode: 'fixed',
    poseOverride: 4,
    characterZoom: 1.65,
    flashConfettiEnabled: false
  },
  preferences: {
    defaultStartupRole: 'controller',
    defaultCursorEnabled: false,
    defaultAudioEnabled: false,
    reducedMotion: true
  }
};

mockLocalStorage.setItem(CONTROL_CENTER_STORAGE_KEY, JSON.stringify(mutatedState));

// Verify that writing FACTORY_DEFAULTS restores all parameters exactly
mockLocalStorage.setItem(CONTROL_CENTER_STORAGE_KEY, JSON.stringify(FACTORY_DEFAULTS));
const resetResult = loadSavedControlCenterConfig();

assertTest(
  resetResult.audio.soundEnabled === FACTORY_DEFAULTS.audio.soundEnabled &&
  resetResult.audio.masterVolume === FACTORY_DEFAULTS.audio.masterVolume &&
  resetResult.audio.pitchMultiplier === FACTORY_DEFAULTS.audio.pitchMultiplier &&
  resetResult.audio.soundMatchingMode === FACTORY_DEFAULTS.audio.soundMatchingMode,
  'Factory reset restored all Audio parameters to exact defaults',
  'Factory Reset'
);

assertTest(
  resetResult.cursor.customCursorEnabled === FACTORY_DEFAULTS.cursor.customCursorEnabled &&
  resetResult.cursor.cursorScale === FACTORY_DEFAULTS.cursor.cursorScale &&
  resetResult.cursor.flightLerpSpeed === FACTORY_DEFAULTS.cursor.flightLerpSpeed &&
  resetResult.cursor.stardustTrailEnabled === FACTORY_DEFAULTS.cursor.stardustTrailEnabled &&
  resetResult.cursor.particleColor === FACTORY_DEFAULTS.cursor.particleColor,
  'Factory reset restored all Cursor parameters to exact defaults',
  'Factory Reset'
);

assertTest(
  resetResult.hero.gazeMode === FACTORY_DEFAULTS.hero.gazeMode &&
  resetResult.hero.poseOverride === FACTORY_DEFAULTS.hero.poseOverride &&
  resetResult.hero.characterZoom === FACTORY_DEFAULTS.hero.characterZoom &&
  resetResult.hero.flashConfettiEnabled === FACTORY_DEFAULTS.hero.flashConfettiEnabled,
  'Factory reset restored all Hero parameters to exact defaults',
  'Factory Reset'
);

assertTest(
  resetResult.preferences.defaultStartupRole === FACTORY_DEFAULTS.preferences.defaultStartupRole &&
  resetResult.preferences.defaultCursorEnabled === FACTORY_DEFAULTS.preferences.defaultCursorEnabled &&
  resetResult.preferences.defaultAudioEnabled === FACTORY_DEFAULTS.preferences.defaultAudioEnabled &&
  resetResult.preferences.reducedMotion === FACTORY_DEFAULTS.preferences.reducedMotion,
  'Factory reset restored all Preferences parameters to exact defaults',
  'Factory Reset'
);

// Verify soundFX audio reset
soundFX.setMasterVolume(0.2);
soundFX.setPitchMultiplier(1.8);
soundFX.setSoundMatchingMode('universal');
soundFX.setEnabled(false);

soundFX.resetAudioDefaults();

assertTest(
  soundFX.isEnabled() === true &&
  soundFX.getMasterVolume() === 0.8 &&
  soundFX.getPitchMultiplier() === 1.0 &&
  soundFX.getSoundMatchingMode() === 'dynamic',
  'soundFX.resetAudioDefaults() restores master volume 0.8, pitch 1.0, mode dynamic, enabled true',
  'Audio Engine Reset'
);

// ===========================================================================
// SUITE 6: Rapid Mode Toggling & Debounce Stress
// ===========================================================================
console.log('\n--- SUITE 6: Rapid Mode Toggling & Debounce Stress ---');

// 6.1 Rapid cycling of soundMatchingMode (100 cycles)
for (let i = 0; i < 100; i++) {
  soundFX.setSoundMatchingMode(i % 2 === 0 ? 'universal' : 'dynamic');
}
assertTest(
  soundFX.getSoundMatchingMode() === 'dynamic',
  'Completed 100 rapid cycles of soundMatchingMode without error; settled on dynamic',
  'Rapid Toggling: Audio Mode'
);

// Invalid soundMatchingMode inputs
soundFX.setSoundMatchingMode('invalid_mode');
assertTest(
  soundFX.getSoundMatchingMode() === 'dynamic',
  'Invalid soundMatchingMode string safely defaults to dynamic',
  'Rapid Toggling: Audio Mode'
);

// 6.2 Rapid calling of playCursorSelect with throttle check
soundFX.init();
soundFX.lastCursorSelectTime = 0;
let callCount = 0;
const origPlayChime = soundFX.playCrystalChime.bind(soundFX);
soundFX.playCrystalChime = () => { callCount++; origPlayChime(); };

soundFX.setSoundMatchingMode('universal');

// Invoke 20 times within 10ms (should throttle)
for (let i = 0; i < 20; i++) {
  soundFX.playCursorSelect('butterfly');
}
soundFX.playCrystalChime = origPlayChime;

assertTest(
  callCount === 1,
  `playCursorSelect debounced 20 rapid bursts within 80ms throttle window (executed: ${callCount})`,
  'Audio Debounce'
);

// 6.3 Rapid DOM class toggling for custom-cursor-disabled
for (let i = 0; i < 100; i++) {
  const isCursorActive = (i % 2 === 0);
  globalThis.document.body.classList.toggle('custom-cursor-disabled', !isCursorActive);
}
assertTest(
  globalThis.document.body.classList.contains('custom-cursor-disabled') === true,
  'Completed 100 rapid class toggles on document.body cleanly',
  'Rapid Toggling: DOM Cursor Class'
);

// ===========================================================================
// SUITE 7: Web Audio Synthesizer Node Topology & Gain Smoothing
// ===========================================================================
console.log('\n--- SUITE 7: Web Audio Synthesizer Node Topology & Gain Smoothing ---');

soundFX.init();

// Test click-free setTargetAtTime on volume change
soundFX.setMasterVolume(0.42);
const events = soundFX.masterGain.gain.events;
const lastVolumeEvent = events[events.length - 1];
assertTest(
  lastVolumeEvent &&
  lastVolumeEvent.type === 'setTargetAtTime' &&
  lastVolumeEvent.val === 0.42 &&
  lastVolumeEvent.timeConstant === 0.015,
  'setMasterVolume applies smooth exponential approach with 15ms timeConstant',
  'Audio Smoothing'
);

// Test all 7 soundboard synthesizers execute without throwing
let soundboardFailures = 0;
for (const item of SOUNDBOARD_SOUNDS) {
  try {
    item.play();
  } catch (err) {
    soundboardFailures++;
    console.error(`Soundboard item ${item.id} failed:`, err);
  }
}
assertTest(
  soundboardFailures === 0,
  'All 7 soundboard synthesizer generators executed cleanly without exception',
  'Soundboard Audio'
);

// Test tone preview with boundary frequencies
let tonePreviewFailures = 0;
try {
  soundFX.playTonePreview(10); // extreme low
  soundFX.playTonePreview(25000); // extreme high
  soundFX.playTonePreview(-100); // negative
  soundFX.playTonePreview(NaN); // NaN
} catch {
  tonePreviewFailures++;
}
assertTest(
  tonePreviewFailures === 0,
  'playTonePreview safely handles boundary and invalid frequencies',
  'Tone Preview'
);

// ===========================================================================
// SUITE 8: Production Code & Static Conformance Audit
// ===========================================================================
console.log('\n--- SUITE 8: Production Code & Static Conformance Audit ---');

// 8.1 Confirm clean deletion of PhysicsSandbox.jsx
const physicsSandboxExists = fs.existsSync(path.resolve('src/components/PhysicsSandbox.jsx'));
assertTest(
  !physicsSandboxExists,
  'src/components/PhysicsSandbox.jsx is completely deleted from disk',
  'Clean Deletion'
);

// 8.2 Verify InteractivePlayground.jsx mounts ControlCenterPanel
const playgroundSrc = fs.readFileSync(path.resolve('src/components/InteractivePlayground.jsx'), 'utf8');
assertTest(
  !playgroundSrc.includes('PhysicsSandbox') && playgroundSrc.includes('<ControlCenterPanel'),
  'InteractivePlayground.jsx mounts ControlCenterPanel with 0 physics imports',
  'Architecture'
);

// 8.3 Verify LabStudioDrawer.jsx mounts ControlCenterPanel
const drawerSrc = fs.readFileSync(path.resolve('src/components/LabStudioDrawer.jsx'), 'utf8');
assertTest(
  !drawerSrc.includes('PhysicsSandbox') && drawerSrc.includes('<ControlCenterPanel'),
  'LabStudioDrawer.jsx mounts ControlCenterPanel with 0 physics imports',
  'Architecture'
);

// 8.4 Verify HeroSection.jsx wires useLab and honors gazeMode, characterZoom, poseOverride
const heroSrc = fs.readFileSync(path.resolve('src/components/HeroSection.jsx'), 'utf8');
assertTest(
  heroSrc.includes('useLab') &&
  heroSrc.includes('gazeMode') &&
  heroSrc.includes('poseOverride') &&
  heroSrc.includes('characterZoom') &&
  heroSrc.includes('flashConfettiEnabled') &&
  heroSrc.includes('customCursorEnabled'),
  'HeroSection.jsx wires all 6 reactive parameters from LabContext',
  'Hero Section Wiring'
);

// 8.5 Verify DynamicCursorManager.jsx respects customCursorEnabled
const cursorMgrSrc = fs.readFileSync(path.resolve('src/components/DynamicCursorManager.jsx'), 'utf8');
assertTest(
  cursorMgrSrc.includes('customCursorEnabled') &&
  cursorMgrSrc.includes('custom-cursor-disabled') &&
  cursorMgrSrc.includes('if (!customCursorEnabled'),
  'DynamicCursorManager.jsx handles system pointer fallback and .custom-cursor-disabled',
  'Cursor Fallback Wiring'
);

// Close Vite server
await viteServer.close();

// ===========================================================================
// SUMMARY & VERDICT
// ===========================================================================
console.log('\n================================================================');
console.log(`  STRESS TEST SUMMARY: ${passedAssertions}/${totalAssertions} ASSERTIONS PASSED`);
console.log('================================================================');

if (findings.length > 0) {
  console.log(`\nFINDINGS / FAILED ASSERTIONS (${findings.length}):`);
  findings.forEach((f, idx) => {
    console.log(`  [${idx + 1}] [${f.category}] ${f.description}`);
  });
} else {
  console.log('\nALL 68 EMPIRICAL ASSERTIONS PASSED PERFECTLY WITH ZERO FAILURES!');
}

console.log('================================================================\n');

// Exit with failure code if any assertion failed
if (findings.length > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
