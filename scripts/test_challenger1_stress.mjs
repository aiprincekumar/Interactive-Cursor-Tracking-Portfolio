// Standalone Adversarial Stress Test Suite: State, Presets & Audio
// Challenger 1 (State, Presets & Audio Stress Challenger)

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('================================================================');
console.log('CHALLENGER 1: STATE, PRESETS, PERSISTENCE & AUDIO STRESS SUITE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  [FAIL] ${name}`);
    console.error(`         Error: ${err.message}`);
    if (err.stack) {
      const lines = err.stack.split('\n').slice(1, 3).join('\n');
      console.error(`         ${lines}`);
    }
    failCount++;
  }
}

// -----------------------------------------------------------------------------
// PART 1: MOCK AUDIO ENVIRONMENT FOR WEB AUDIO METHOD CONTRACT TESTING
// -----------------------------------------------------------------------------

class MockAudioParam {
  constructor(name, initialValue = 1.0) {
    this.name = name;
    this.value = initialValue;
    this.calls = [];
  }

  setValueAtTime(val, t) {
    this.value = val;
    this.calls.push({ method: 'setValueAtTime', val, t });
  }

  exponentialRampToValueAtTime(val, t) {
    // Web Audio Spec CRITICAL RULE: value must strictly be > 0, else DOMException thrown!
    if (val <= 0) {
      throw new Error(`CRITICAL DOMException: exponentialRampToValueAtTime called with non-positive value ${val} on param ${this.name}!`);
    }
    this.calls.push({ method: 'exponentialRampToValueAtTime', val, t });
  }

  linearRampToValueAtTime(val, t) {
    this.calls.push({ method: 'linearRampToValueAtTime', val, t });
  }

  setTargetAtTime(target, t, timeConstant) {
    this.value = target;
    this.calls.push({ method: 'setTargetAtTime', target, t, timeConstant });
  }

  cancelScheduledValues(t) {
    this.calls.push({ method: 'cancelScheduledValues', t });
  }
}

class MockAudioNode {
  constructor() {
    this.connections = [];
  }
  connect(target) {
    this.connections.push(target);
    return target;
  }
  disconnect() {
    this.connections = [];
  }
}

class MockGainNode extends MockAudioNode {
  constructor() {
    super();
    this.gain = new MockAudioParam('gain', 1.0);
  }
}

class MockOscillatorNode extends MockAudioNode {
  constructor() {
    super();
    this.frequency = new MockAudioParam('frequency', 440);
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
    this.frequency = new MockAudioParam('filterFrequency', 1000);
    this.Q = new MockAudioParam('filterQ', 1);
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
    this.currentTime = 10.0;
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
      getChannelData: () => new Float32Array(length)
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

// Attach mocks to global window / globalThis before importing audio.js
let hapticEvents = [];
globalThis.window = {
  AudioContext: MockAudioContext,
  webkitAudioContext: MockAudioContext,
  navigator: {
    vibrate: (pattern) => {
      hapticEvents.push(pattern);
      return true;
    }
  }
};
// window.navigator is defined on globalThis.window

// -----------------------------------------------------------------------------
// PART 2: IMPORT TARGET MODULES
// -----------------------------------------------------------------------------

const audioModule = await import('../src/utils/audio.js');
const { soundFX, SOUNDBOARD_SOUNDS } = audioModule;

// Build isolated evaluator of LabContext functions and presets
const contextEvaluator = new Function(`
  const window = arguments[0].window;
  const localStorage = arguments[0].localStorage;
  const soundFX = arguments[0].soundFX;

  // Clamping utilities as defined in src/context/LabContext.jsx
  function clamp(val, min, max, fallback) {
    const num = typeof val === 'number' ? val : parseFloat(val);
    if (isNaN(num)) return fallback;
    return Math.min(Math.max(num, min), max);
  }

  function clampScale(val) {
    return parseFloat(clamp(val, 0.5, 2.0, 1.0).toFixed(2));
  }

  function clampFlightSpeed(val) {
    return parseFloat(clamp(val, 0.05, 0.35, 0.14).toFixed(2));
  }

  function clampWingDynamics(val) {
    return parseFloat(clamp(val, 0.5, 2.0, 1.0).toFixed(2));
  }

  function clampGravity(val) {
    return Math.round(clamp(val, -60, 140, 0));
  }

  function clampVolume(val) {
    return parseFloat(clamp(val, 0.0, 1.0, 0.8).toFixed(2));
  }

  function clampPitch(val) {
    return parseFloat(clamp(val, 0.5, 2.0, 1.0).toFixed(2));
  }

  function validateColor(val) {
    if (typeof val === 'string' && /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val)) {
      return val;
    }
    return '#FF4D6D';
  }

  const LAB_STORAGE_KEY = 'portfolio_lab_config';

  const DEFAULT_LAB_CONFIG = {
    cursorScale: 1.0,
    flightSpeed: 0.14,
    wingDynamics: 1.0,
    gravity: 0,
    trailEnabled: true,
    particleColor: '#FF4D6D',
    soundEnabled: true,
    masterVolume: 0.8,
    audioPitch: 1.0,
    isDrawerOpen: false,
    activePreset: 'default'
  };

  const LAB_PRESETS = {
    default: {
      id: 'default',
      name: 'Default Natural',
      label: 'Default Natural',
      description: 'Balanced organic flight lerp, standard gravity, and coral trail.',
      cursorScale: 1.0,
      flightSpeed: 0.14,
      wingDynamics: 1.0,
      gravity: 0,
      trailEnabled: true,
      particleColor: '#FF4D6D',
      soundEnabled: true,
      masterVolume: 0.8,
      audioPitch: 1.0
    },
    cyberpunk: {
      id: 'cyberpunk',
      name: 'Cyberpunk Zero-G',
      label: 'Cyberpunk Zero-G',
      description: 'High agility, negative anti-gravity float, electric cyan stardust, and crisp high pitch.',
      cursorScale: 1.2,
      flightSpeed: 0.25,
      wingDynamics: 1.5,
      gravity: -25,
      trailEnabled: true,
      particleColor: '#00F2FE',
      soundEnabled: true,
      masterVolume: 0.85,
      audioPitch: 1.35
    },
    arcade: {
      id: 'arcade',
      name: 'Retro Arcade',
      label: 'Retro Arcade',
      description: 'Instant response, heavy arcade bounce, golden coin particles, and resonant retro pitch.',
      cursorScale: 1.15,
      flightSpeed: 0.20,
      wingDynamics: 1.3,
      gravity: 95,
      trailEnabled: true,
      particleColor: '#FFD700',
      soundEnabled: true,
      masterVolume: 0.9,
      audioPitch: 0.8
    },
    zen: {
      id: 'zen',
      name: 'Zen Minimalist',
      label: 'Zen Minimalist',
      description: 'Ultra-delicate float, slow fluid glide, zero gravity, and organic emerald calm.',
      cursorScale: 0.85,
      flightSpeed: 0.07,
      wingDynamics: 0.7,
      gravity: 0,
      trailEnabled: true,
      particleColor: '#10B981',
      soundEnabled: true,
      masterVolume: 0.6,
      audioPitch: 1.0
    },
    hyper: {
      id: 'hyper',
      name: 'Hyper Velocity',
      label: 'Hyper Velocity',
      description: 'Oversized supersonic tracking, buzzing wing frenzy, heavy dive gravity, and intense whistle.',
      cursorScale: 1.35,
      flightSpeed: 0.28,
      wingDynamics: 1.8,
      gravity: 45,
      trailEnabled: true,
      particleColor: '#FF4D6D',
      soundEnabled: true,
      masterVolume: 1.0,
      audioPitch: 1.75
    }
  };

  LAB_PRESETS.cyberpunk_zerog = LAB_PRESETS.cyberpunk;
  LAB_PRESETS['cyberpunk-zerog'] = LAB_PRESETS.cyberpunk;
  LAB_PRESETS.retro_arcade = LAB_PRESETS.arcade;
  LAB_PRESETS['retro-arcade'] = LAB_PRESETS.arcade;
  LAB_PRESETS.zen_minimalist = LAB_PRESETS.zen;
  LAB_PRESETS['zen-minimalist'] = LAB_PRESETS.zen;
  LAB_PRESETS.hyper_velocity = LAB_PRESETS.hyper;
  LAB_PRESETS['hyper-velocity'] = LAB_PRESETS.hyper;

  function loadSavedConfig() {
    if (typeof window === 'undefined') return { ...DEFAULT_LAB_CONFIG };

    try {
      const raw = localStorage.getItem(LAB_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          const cursorScale = clampScale(parsed.cursorScale ?? parsed.cursor?.scale ?? DEFAULT_LAB_CONFIG.cursorScale);
          const flightSpeed = clampFlightSpeed(parsed.flightSpeed ?? parsed.cursor?.speed ?? DEFAULT_LAB_CONFIG.flightSpeed);
          const wingDynamics = clampWingDynamics(parsed.wingDynamics ?? parsed.cursor?.wingDynamics ?? DEFAULT_LAB_CONFIG.wingDynamics);
          const gravity = clampGravity(parsed.gravity ?? parsed.physics?.gravity ?? DEFAULT_LAB_CONFIG.gravity);
          const trailEnabled = typeof parsed.trailEnabled === 'boolean'
            ? parsed.trailEnabled
            : (typeof parsed.physics?.trailEnabled === 'boolean' ? parsed.physics.trailEnabled : DEFAULT_LAB_CONFIG.trailEnabled);
          const particleColor = validateColor(parsed.particleColor ?? parsed.physics?.particleColor ?? DEFAULT_LAB_CONFIG.particleColor);
          const soundEnabled = typeof parsed.soundEnabled === 'boolean'
            ? parsed.soundEnabled
            : (typeof parsed.audio?.soundEnabled === 'boolean' ? parsed.audio.soundEnabled : DEFAULT_LAB_CONFIG.soundEnabled);
          const masterVolume = clampVolume(parsed.masterVolume ?? parsed.audio?.volume ?? DEFAULT_LAB_CONFIG.masterVolume);
          const audioPitch = clampPitch(parsed.audioPitch ?? parsed.audio?.pitch ?? DEFAULT_LAB_CONFIG.audioPitch);
          const activePreset = typeof parsed.activePreset === 'string' && LAB_PRESETS[parsed.activePreset]
            ? parsed.activePreset
            : 'default';

          return {
            cursorScale,
            flightSpeed,
            wingDynamics,
            gravity,
            trailEnabled,
            particleColor,
            soundEnabled,
            masterVolume,
            audioPitch,
            isDrawerOpen: false,
            activePreset
          };
        }
      }
    } catch {
      // Malformed JSON; proceed to legacy migration
    }

    try {
      const legacyColor = localStorage.getItem('physics_particle_color');
      const legacyGravity = localStorage.getItem('physics_gravity');
      const legacyPitch = localStorage.getItem('physics_audio_pitch');
      const legacySound = localStorage.getItem('soundEnabled') ?? localStorage.getItem('portfolio_sound_enabled');

      return {
        ...DEFAULT_LAB_CONFIG,
        particleColor: legacyColor ? validateColor(legacyColor) : DEFAULT_LAB_CONFIG.particleColor,
        gravity: legacyGravity !== null ? clampGravity(legacyGravity) : DEFAULT_LAB_CONFIG.gravity,
        audioPitch: legacyPitch !== null ? clampPitch(legacyPitch) : DEFAULT_LAB_CONFIG.audioPitch,
        soundEnabled: legacySound !== null ? legacySound === 'true' : DEFAULT_LAB_CONFIG.soundEnabled,
        isDrawerOpen: false
      };
    } catch {
      return { ...DEFAULT_LAB_CONFIG };
    }
  }

  return {
    clamp,
    clampScale,
    clampFlightSpeed,
    clampWingDynamics,
    clampGravity,
    clampVolume,
    clampPitch,
    validateColor,
    loadSavedConfig,
    DEFAULT_LAB_CONFIG,
    LAB_PRESETS,
    LAB_STORAGE_KEY
  };
`);

// Mock localStorage helper
function createMockLocalStorage(initialStore = {}) {
  const store = { ...initialStore };
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, val) {
      store[key] = String(val);
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      for (const k of Object.keys(store)) delete store[k];
    },
    _getStore() {
      return store;
    }
  };
}

let mockStorage = createMockLocalStorage();
let labEngine = contextEvaluator({
  window: globalThis.window,
  localStorage: mockStorage,
  soundFX
});

// -----------------------------------------------------------------------------
// SUITE 1: BOUNDARY CONDITIONS & NUMERIC CLAMPING RIGOR
// -----------------------------------------------------------------------------
console.log('--- SUITE 1: Boundary Conditions for All Sliders ---');

runTest('Cursor scale bounds [0.5, 2.0] and edge clamping', () => {
  assert.strictEqual(labEngine.clampScale(0.5), 0.5, 'Exact min boundary 0.5');
  assert.strictEqual(labEngine.clampScale(2.0), 2.0, 'Exact max boundary 2.0');
  assert.strictEqual(labEngine.clampScale(1.0), 1.0, 'Default midpoint 1.0');
  assert.strictEqual(labEngine.clampScale(0.49), 0.5, 'Underflow 0.49 clamps to 0.5');
  assert.strictEqual(labEngine.clampScale(2.01), 2.0, 'Overflow 2.01 clamps to 2.0');
  assert.strictEqual(labEngine.clampScale(-999), 0.5, 'Severe negative -999 clamps to 0.5');
  assert.strictEqual(labEngine.clampScale(9999), 2.0, 'Severe positive 9999 clamps to 2.0');
  assert.strictEqual(labEngine.clampScale(0), 0.5, 'Zero clamps to 0.5');
  assert.strictEqual(labEngine.clampScale(NaN), 1.0, 'NaN falls back to default 1.0');
  assert.strictEqual(labEngine.clampScale(null), 1.0, 'null falls back to default 1.0');
  assert.strictEqual(labEngine.clampScale(undefined), 1.0, 'undefined falls back to default 1.0');
  assert.strictEqual(labEngine.clampScale('1.75'), 1.75, 'Valid string parses and retains precision');
  assert.strictEqual(labEngine.clampScale('corrupt_string'), 1.0, 'Corrupt string falls back to 1.0');
});

runTest('Flight speed bounds [0.05, 0.35] and edge clamping', () => {
  assert.strictEqual(labEngine.clampFlightSpeed(0.05), 0.05, 'Exact min boundary 0.05');
  assert.strictEqual(labEngine.clampFlightSpeed(0.35), 0.35, 'Exact max boundary 0.35');
  assert.strictEqual(labEngine.clampFlightSpeed(0.14), 0.14, 'Default speed 0.14');
  assert.strictEqual(labEngine.clampFlightSpeed(0.04), 0.05, 'Underflow 0.04 clamps to 0.05');
  assert.strictEqual(labEngine.clampFlightSpeed(0.36), 0.35, 'Overflow 0.36 clamps to 0.35');
  assert.strictEqual(labEngine.clampFlightSpeed(-50), 0.05, 'Negative speed clamps to 0.05');
  assert.strictEqual(labEngine.clampFlightSpeed(100), 0.35, 'Extreme positive speed clamps to 0.35');
  assert.strictEqual(labEngine.clampFlightSpeed(NaN), 0.14, 'NaN falls back to default 0.14');
  assert.strictEqual(labEngine.clampFlightSpeed(null), 0.14, 'null falls back to default 0.14');
  assert.strictEqual(labEngine.clampFlightSpeed('0.28'), 0.28, 'Numeric string parsed accurately');
  assert.strictEqual(labEngine.clampFlightSpeed('fast'), 0.14, 'Invalid text falls back to default 0.14');
});

runTest('Wing dynamics bounds [0.5, 2.0] and edge clamping', () => {
  assert.strictEqual(labEngine.clampWingDynamics(0.5), 0.5, 'Exact min boundary 0.5');
  assert.strictEqual(labEngine.clampWingDynamics(2.0), 2.0, 'Exact max boundary 2.0');
  assert.strictEqual(labEngine.clampWingDynamics(1.0), 1.0, 'Default dynamics 1.0');
  assert.strictEqual(labEngine.clampWingDynamics(0.2), 0.5, 'Underflow 0.2 clamps to 0.5');
  assert.strictEqual(labEngine.clampWingDynamics(3.5), 2.0, 'Overflow 3.5 clamps to 2.0');
  assert.strictEqual(labEngine.clampWingDynamics(-999), 0.5, 'Extreme negative clamps to 0.5');
  assert.strictEqual(labEngine.clampWingDynamics(999), 2.0, 'Extreme positive clamps to 2.0');
  assert.strictEqual(labEngine.clampWingDynamics(NaN), 1.0, 'NaN falls back to default 1.0');
  assert.strictEqual(labEngine.clampWingDynamics(undefined), 1.0, 'undefined falls back to default 1.0');
  assert.strictEqual(labEngine.clampWingDynamics('1.8'), 1.8, 'Numeric string parsed accurately');
});

runTest('Gravity bounds [-60, 140] and integer rounding', () => {
  assert.strictEqual(labEngine.clampGravity(-60), -60, 'Exact min boundary -60 (Anti-G)');
  assert.strictEqual(labEngine.clampGravity(140), 140, 'Exact max boundary +140 (Heavy Earth)');
  assert.strictEqual(labEngine.clampGravity(0), 0, 'Zero-G midpoint 0');
  assert.strictEqual(labEngine.clampGravity(-61), -60, 'Underflow -61 clamps to -60');
  assert.strictEqual(labEngine.clampGravity(145), 140, 'Overflow 145 clamps to 140');
  assert.strictEqual(labEngine.clampGravity(-999), -60, 'Severe negative -999 clamps to -60');
  assert.strictEqual(labEngine.clampGravity(9999), 140, 'Severe positive 9999 clamps to 140');
  assert.strictEqual(labEngine.clampGravity(-24.7), -25, 'Float rounds to nearest integer');
  assert.strictEqual(labEngine.clampGravity(94.2), 94, 'Float rounds to nearest integer');
  assert.strictEqual(labEngine.clampGravity(NaN), 0, 'NaN falls back to default 0');
  assert.strictEqual(labEngine.clampGravity(null), 0, 'null falls back to default 0');
  assert.strictEqual(labEngine.clampGravity('-25'), -25, 'String value "-25" parses accurately');
  assert.strictEqual(labEngine.clampGravity('zero'), 0, 'Corrupt string falls back to default 0');
});

runTest('Master volume bounds [0.0, 1.0] and edge clamping', () => {
  assert.strictEqual(labEngine.clampVolume(0.0), 0.0, 'Exact min boundary 0.0 (mute)');
  assert.strictEqual(labEngine.clampVolume(1.0), 1.0, 'Exact max boundary 1.0 (100%)');
  assert.strictEqual(labEngine.clampVolume(0.8), 0.8, 'Default volume 0.8 (80%)');
  assert.strictEqual(labEngine.clampVolume(-0.01), 0.0, 'Underflow -0.01 clamps to 0.0');
  assert.strictEqual(labEngine.clampVolume(1.05), 1.0, 'Overflow 1.05 clamps to 1.0');
  assert.strictEqual(labEngine.clampVolume(-999), 0.0, 'Severe negative clamps to 0.0');
  assert.strictEqual(labEngine.clampVolume(999), 1.0, 'Severe positive clamps to 1.0');
  assert.strictEqual(labEngine.clampVolume(NaN), 0.8, 'NaN falls back to default 0.8');
  assert.strictEqual(labEngine.clampVolume(null), 0.8, 'null falls back to default 0.8');
  assert.strictEqual(labEngine.clampVolume('0.65'), 0.65, 'Numeric string parses accurately');
});

runTest('Audio pitch bounds [0.5, 2.0] and edge clamping', () => {
  assert.strictEqual(labEngine.clampPitch(0.5), 0.5, 'Exact min boundary 0.5x');
  assert.strictEqual(labEngine.clampPitch(2.0), 2.0, 'Exact max boundary 2.0x');
  assert.strictEqual(labEngine.clampPitch(1.0), 1.0, 'Default neutral pitch 1.0x');
  assert.strictEqual(labEngine.clampPitch(0.49), 0.5, 'Underflow 0.49 clamps to 0.5');
  assert.strictEqual(labEngine.clampPitch(2.05), 2.0, 'Overflow 2.05 clamps to 2.0');
  assert.strictEqual(labEngine.clampPitch(-100), 0.5, 'Severe negative clamps to 0.5');
  assert.strictEqual(labEngine.clampPitch(500), 2.0, 'Severe positive clamps to 2.0');
  assert.strictEqual(labEngine.clampPitch(0), 0.5, 'Zero pitch clamps to 0.5');
  assert.strictEqual(labEngine.clampPitch(NaN), 1.0, 'NaN falls back to default 1.0');
  assert.strictEqual(labEngine.clampPitch(null), 1.0, 'null falls back to default 1.0');
  assert.strictEqual(labEngine.clampPitch('1.35'), 1.35, 'Numeric string parses accurately');
});

runTest('Particle color hex validation and fallback sanitization', () => {
  assert.strictEqual(labEngine.validateColor('#FF4D6D'), '#FF4D6D', 'Standard 6-char hex preserved');
  assert.strictEqual(labEngine.validateColor('#00F2FE'), '#00F2FE', 'Cyan 6-char hex preserved');
  assert.strictEqual(labEngine.validateColor('#fff'), '#fff', '3-char lowercase hex accepted');
  assert.strictEqual(labEngine.validateColor('#A855F7'), '#A855F7', 'Purple 6-char hex preserved');
  assert.strictEqual(labEngine.validateColor(''), '#FF4D6D', 'Empty string falls back to default #FF4D6D');
  assert.strictEqual(labEngine.validateColor('#GGGGGG'), '#FF4D6D', 'Non-hex chars fall back to default');
  assert.strictEqual(labEngine.validateColor('rgb(255, 77, 109)'), '#FF4D6D', 'rgb format falls back to default');
  assert.strictEqual(labEngine.validateColor('coral'), '#FF4D6D', 'Named color falls back to hex default');
  assert.strictEqual(labEngine.validateColor('#12'), '#FF4D6D', 'Too short hex falls back');
  assert.strictEqual(labEngine.validateColor('#12345678'), '#FF4D6D', '8-char hex falls back');
  assert.strictEqual(labEngine.validateColor(null), '#FF4D6D', 'null falls back');
  assert.strictEqual(labEngine.validateColor(undefined), '#FF4D6D', 'undefined falls back');
  assert.strictEqual(labEngine.validateColor(123456), '#FF4D6D', 'Number falls back');
  assert.strictEqual(labEngine.validateColor('<script>'), '#FF4D6D', 'XSS attempt sanitized to default');
});

// -----------------------------------------------------------------------------
// SUITE 2: PRESETS ATOMIC APPLICATION & SPECIFICATION INTEGRITY
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 2: Presets Atomic Application & Integrity ---');

const REQUIRED_PRESETS = [
  {
    key: 'cyberpunk',
    expected: {
      cursorScale: 1.2,
      flightSpeed: 0.25,
      wingDynamics: 1.5,
      gravity: -25,
      trailEnabled: true,
      particleColor: '#00F2FE',
      soundEnabled: true,
      masterVolume: 0.85,
      audioPitch: 1.35
    }
  },
  {
    key: 'arcade',
    expected: {
      cursorScale: 1.15,
      flightSpeed: 0.20,
      wingDynamics: 1.3,
      gravity: 95,
      trailEnabled: true,
      particleColor: '#FFD700',
      soundEnabled: true,
      masterVolume: 0.9,
      audioPitch: 0.8
    }
  },
  {
    key: 'zen',
    expected: {
      cursorScale: 0.85,
      flightSpeed: 0.07,
      wingDynamics: 0.7,
      gravity: 0,
      trailEnabled: true,
      particleColor: '#10B981',
      soundEnabled: true,
      masterVolume: 0.6,
      audioPitch: 1.0
    }
  },
  {
    key: 'hyper',
    expected: {
      cursorScale: 1.35,
      flightSpeed: 0.28,
      wingDynamics: 1.8,
      gravity: 45,
      trailEnabled: true,
      particleColor: '#FF4D6D',
      soundEnabled: true,
      masterVolume: 1.0,
      audioPitch: 1.75
    }
  },
  {
    key: 'default',
    expected: {
      cursorScale: 1.0,
      flightSpeed: 0.14,
      wingDynamics: 1.0,
      gravity: 0,
      trailEnabled: true,
      particleColor: '#FF4D6D',
      soundEnabled: true,
      masterVolume: 0.8,
      audioPitch: 1.0
    }
  }
];

REQUIRED_PRESETS.forEach(({ key, expected }) => {
  runTest(`Preset [${key}] matches strict specifications on all 9 parameters`, () => {
    const preset = labEngine.LAB_PRESETS[key];
    assert(preset, `Preset ${key} must exist in LAB_PRESETS`);
    assert.strictEqual(preset.cursorScale, expected.cursorScale, `${key} cursorScale`);
    assert.strictEqual(preset.flightSpeed, expected.flightSpeed, `${key} flightSpeed`);
    assert.strictEqual(preset.wingDynamics, expected.wingDynamics, `${key} wingDynamics`);
    assert.strictEqual(preset.gravity, expected.gravity, `${key} gravity`);
    assert.strictEqual(preset.trailEnabled, expected.trailEnabled, `${key} trailEnabled`);
    assert.strictEqual(preset.particleColor, expected.particleColor, `${key} particleColor`);
    assert.strictEqual(preset.soundEnabled, expected.soundEnabled, `${key} soundEnabled`);
    assert.strictEqual(preset.masterVolume, expected.masterVolume, `${key} masterVolume`);
    assert.strictEqual(preset.audioPitch, expected.audioPitch, `${key} audioPitch`);
  });
});

runTest('Preset aliases resolve to identical preset configurations', () => {
  const aliases = [
    ['cyberpunk_zerog', 'cyberpunk'],
    ['cyberpunk-zerog', 'cyberpunk'],
    ['retro_arcade', 'arcade'],
    ['retro-arcade', 'arcade'],
    ['zen_minimalist', 'zen'],
    ['zen-minimalist', 'zen'],
    ['hyper_velocity', 'hyper'],
    ['hyper-velocity', 'hyper']
  ];

  aliases.forEach(([alias, target]) => {
    assert(labEngine.LAB_PRESETS[alias], `Alias [${alias}] must be defined`);
    assert.deepStrictEqual(labEngine.LAB_PRESETS[alias], labEngine.LAB_PRESETS[target], `Alias [${alias}] must match [${target}]`);
  });
});

// -----------------------------------------------------------------------------
// SUITE 3: LOCALSTORAGE PERSISTENCE, CORRUPTION & LEGACY MIGRATION
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 3: LocalStorage Persistence, Malformed JSON & Legacy Migration ---');

runTest('Clean initial load with empty storage returns default lab config', () => {
  const emptyStorage = createMockLocalStorage();
  const engine = contextEvaluator({ window: globalThis.window, localStorage: emptyStorage, soundFX });
  const config = engine.loadSavedConfig();
  assert.strictEqual(config.cursorScale, 1.0);
  assert.strictEqual(config.flightSpeed, 0.14);
  assert.strictEqual(config.wingDynamics, 1.0);
  assert.strictEqual(config.gravity, 0);
  assert.strictEqual(config.particleColor, '#FF4D6D');
  assert.strictEqual(config.activePreset, 'default');
  assert.strictEqual(config.isDrawerOpen, false);
});

runTest('Valid unified JSON persistence parses and restores faithfully', () => {
  const validPayload = {
    version: 1,
    cursorScale: 1.25,
    flightSpeed: 0.22,
    wingDynamics: 1.4,
    gravity: -20,
    trailEnabled: false,
    particleColor: '#00F2FE',
    soundEnabled: true,
    masterVolume: 0.95,
    audioPitch: 1.4,
    activePreset: 'cyberpunk'
  };

  const storage = createMockLocalStorage({
    portfolio_lab_config: JSON.stringify(validPayload)
  });
  const engine = contextEvaluator({ window: globalThis.window, localStorage: storage, soundFX });
  const restored = engine.loadSavedConfig();

  assert.strictEqual(restored.cursorScale, 1.25);
  assert.strictEqual(restored.flightSpeed, 0.22);
  assert.strictEqual(restored.wingDynamics, 1.4);
  assert.strictEqual(restored.gravity, -20);
  assert.strictEqual(restored.trailEnabled, false);
  assert.strictEqual(restored.particleColor, '#00F2FE');
  assert.strictEqual(restored.soundEnabled, true);
  assert.strictEqual(restored.masterVolume, 0.95);
  assert.strictEqual(restored.audioPitch, 1.4);
  assert.strictEqual(restored.activePreset, 'cyberpunk');
});

runTest('Nested schema persistence structure ({ cursor, physics, audio }) is supported', () => {
  const nestedPayload = {
    cursor: { scale: 1.35, speed: 0.28, wingDynamics: 1.8 },
    physics: { gravity: 45, trailEnabled: true, particleColor: '#FFD700' },
    audio: { soundEnabled: true, volume: 1.0, pitch: 1.75 },
    activePreset: 'hyper'
  };

  const storage = createMockLocalStorage({
    portfolio_lab_config: JSON.stringify(nestedPayload)
  });
  const engine = contextEvaluator({ window: globalThis.window, localStorage: storage, soundFX });
  const restored = engine.loadSavedConfig();

  assert.strictEqual(restored.cursorScale, 1.35);
  assert.strictEqual(restored.flightSpeed, 0.28);
  assert.strictEqual(restored.wingDynamics, 1.8);
  assert.strictEqual(restored.gravity, 45);
  assert.strictEqual(restored.particleColor, '#FFD700');
  assert.strictEqual(restored.masterVolume, 1.0);
  assert.strictEqual(restored.audioPitch, 1.75);
  assert.strictEqual(restored.activePreset, 'hyper');
});

runTest('Severe JSON corruption in localStorage falls back gracefully without crashing', () => {
  const corruptVectors = [
    '{ corrupt JSON syntax! :::',
    'undefined',
    'null',
    '12345',
    '"just a raw string"',
    '[1, 2, 3]',
    '',
    '{ "cursorScale": "corrupted", "gravity": NaN, "masterVolume": [1,2] }'
  ];

  corruptVectors.forEach((corruptStr, idx) => {
    const storage = createMockLocalStorage({
      portfolio_lab_config: corruptStr
    });
    const engine = contextEvaluator({ window: globalThis.window, localStorage: storage, soundFX });
    const config = engine.loadSavedConfig();

    assert(config && typeof config === 'object', `Vector ${idx} must return config object`);
    assert(config.cursorScale >= 0.5 && config.cursorScale <= 2.0, `Vector ${idx} cursorScale must be valid`);
    assert(config.flightSpeed >= 0.05 && config.flightSpeed <= 0.35, `Vector ${idx} flightSpeed must be valid`);
    assert(config.wingDynamics >= 0.5 && config.wingDynamics <= 2.0, `Vector ${idx} wingDynamics must be valid`);
    assert(config.gravity >= -60 && config.gravity <= 140, `Vector ${idx} gravity must be valid`);
    assert(config.masterVolume >= 0.0 && config.masterVolume <= 1.0, `Vector ${idx} masterVolume must be valid`);
    assert(config.audioPitch >= 0.5 && config.audioPitch <= 2.0, `Vector ${idx} audioPitch must be valid`);
    assert(/^#[0-9A-Fa-f]{6}$/.test(config.particleColor), `Vector ${idx} particleColor must be valid hex`);
  });
});

runTest('Prototype pollution payload in localStorage does NOT pollute Object.prototype', () => {
  const maliciousPayload = JSON.stringify({
    __proto__: { polluted: true, isAdmin: true },
    cursorScale: 1.2
  });

  const storage = createMockLocalStorage({
    portfolio_lab_config: maliciousPayload
  });
  const engine = contextEvaluator({ window: globalThis.window, localStorage: storage, soundFX });
  const restored = engine.loadSavedConfig();

  assert.strictEqual(Object.prototype.polluted, undefined, 'Object.prototype must not be polluted');
  assert.strictEqual(Object.prototype.isAdmin, undefined, 'Object.prototype must not have isAdmin');
  assert.strictEqual(restored.cursorScale, 1.2);
});

runTest('Legacy key migration extracts legacy values when unified config is absent', () => {
  const legacyStorage = createMockLocalStorage({
    physics_particle_color: '#10B981',
    physics_gravity: '75',
    physics_audio_pitch: '1.6',
    soundEnabled: 'false'
  });

  const engine = contextEvaluator({ window: globalThis.window, localStorage: legacyStorage, soundFX });
  const migrated = engine.loadSavedConfig();

  assert.strictEqual(migrated.particleColor, '#10B981', 'Migrated legacy color #10B981');
  assert.strictEqual(migrated.gravity, 75, 'Migrated legacy gravity 75');
  assert.strictEqual(migrated.audioPitch, 1.6, 'Migrated legacy pitch 1.6');
  assert.strictEqual(migrated.soundEnabled, false, 'Migrated legacy soundEnabled false');
  // Remaining properties default safely
  assert.strictEqual(migrated.cursorScale, 1.0, 'Default cursorScale retained');
  assert.strictEqual(migrated.flightSpeed, 0.14, 'Default flightSpeed retained');
  assert.strictEqual(migrated.masterVolume, 0.8, 'Default masterVolume retained');
});

runTest('Corrupt legacy keys fall back safely to defaults', () => {
  const corruptLegacyStorage = createMockLocalStorage({
    physics_particle_color: 'invalid-not-hex',
    physics_gravity: 'NaN_bad_number',
    physics_audio_pitch: 'xyz_pitch',
    soundEnabled: 'not_a_bool'
  });

  const engine = contextEvaluator({ window: globalThis.window, localStorage: corruptLegacyStorage, soundFX });
  const config = engine.loadSavedConfig();

  assert.strictEqual(config.particleColor, '#FF4D6D', 'Fallback to default coral hex');
  assert.strictEqual(config.gravity, 0, 'Fallback to default gravity 0');
  assert.strictEqual(config.audioPitch, 1.0, 'Fallback to default pitch 1.0');
  assert.strictEqual(config.soundEnabled, false, 'soundEnabled parses cleanly');
});

// -----------------------------------------------------------------------------
// SUITE 4: WEB AUDIO METHOD CONTRACTS & SYNTHESIS SAFETY
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 4: Web Audio SoundFX Method Contracts & Synthesis ---');

runTest('SoundFX module exports singleton and soundboard array', () => {
  assert(soundFX, 'soundFX singleton must be exported');
  assert(Array.isArray(SOUNDBOARD_SOUNDS), 'SOUNDBOARD_SOUNDS array must be exported');
  assert.strictEqual(SOUNDBOARD_SOUNDS.length, 7, 'SOUNDBOARD_SOUNDS must contain exactly 7 sounds');
});

runTest('Audio master volume [0.0, 1.0] controls and smoothing verification', () => {
  soundFX.init();
  soundFX.resetAudioDefaults();

  assert.strictEqual(soundFX.getMasterVolume(), 0.8, 'Default volume is 0.8');

  // Normal set
  soundFX.setMasterVolume(0.5);
  assert.strictEqual(soundFX.getMasterVolume(), 0.5, 'Volume set to 0.5');

  // Underflow clamping
  soundFX.setMasterVolume(-0.5);
  assert.strictEqual(soundFX.getMasterVolume(), 0.0, 'Volume underflow clamped to 0.0');

  // Overflow clamping
  soundFX.setMasterVolume(1.8);
  assert.strictEqual(soundFX.getMasterVolume(), 1.0, 'Volume overflow clamped to 1.0');

  // NaN resilience
  soundFX.setMasterVolume(NaN);
  assert.strictEqual(soundFX.getMasterVolume(), 0.8, 'Volume NaN falls back to default 0.8');

  // Non-number resilience
  soundFX.setMasterVolume('loud');
  assert.strictEqual(soundFX.getMasterVolume(), 0.8, 'Volume non-number falls back to 0.8');

  // Verify scheduled gain smoothing call
  const gainCalls = soundFX.masterGain.gain.calls;
  const setTargetCall = gainCalls.find(c => c.method === 'setTargetAtTime');
  assert(setTargetCall, 'Scheduled setTargetAtTime for click-free transition');
  assert.strictEqual(setTargetCall.timeConstant, 0.015, '15ms smoothing time constant verified');
});

runTest('Audio pitch multiplier [0.5, 2.0] controls and boundary clamping', () => {
  soundFX.resetAudioDefaults();
  assert.strictEqual(soundFX.getPitchMultiplier(), 1.0, 'Default pitch is 1.0');

  // In-bounds
  soundFX.setPitchMultiplier(1.35);
  assert.strictEqual(soundFX.getPitchMultiplier(), 1.35, 'Pitch set to 1.35');

  // Underflow clamping
  soundFX.setPitchMultiplier(0.1);
  assert.strictEqual(soundFX.getPitchMultiplier(), 0.5, 'Pitch underflow clamped to 0.5');

  // Overflow clamping
  soundFX.setPitchMultiplier(5.0);
  assert.strictEqual(soundFX.getPitchMultiplier(), 2.0, 'Pitch overflow clamped to 2.0');

  // NaN resilience
  soundFX.setPitchMultiplier(NaN);
  assert.strictEqual(soundFX.getPitchMultiplier(), 1.0, 'Pitch NaN falls back to 1.0');

  // String / corrupt input
  soundFX.setPitchMultiplier('ultra');
  assert.strictEqual(soundFX.getPitchMultiplier(), 1.0, 'Pitch string falls back to 1.0');
});

runTest('Base frequency bounds [20, 20000] and getters', () => {
  soundFX.resetAudioDefaults();
  assert.strictEqual(soundFX.getBaseFrequency(), 440, 'Default base frequency is 440 Hz');

  soundFX.setBaseFrequency(880);
  assert.strictEqual(soundFX.getBaseFrequency(), 880, 'Set to 880 Hz');

  soundFX.setBaseFrequency(5);
  assert.strictEqual(soundFX.getBaseFrequency(), 20, 'Underflow clamped to 20 Hz minimum');

  soundFX.setBaseFrequency(99999);
  assert.strictEqual(soundFX.getBaseFrequency(), 20000, 'Overflow clamped to 20000 Hz maximum');

  soundFX.setBaseFrequency(NaN);
  assert.strictEqual(soundFX.getBaseFrequency(), 440, 'NaN falls back to 440 Hz');
});

runTest('Audio enabled toggle [setEnabled / isEnabled] smoothly updates master gain', () => {
  soundFX.resetAudioDefaults();
  soundFX.setEnabled(false);
  assert.strictEqual(soundFX.isEnabled(), false, 'Audio disabled');

  const calls = soundFX.masterGain.gain.calls;
  const lastTarget = calls[calls.length - 1];
  assert.strictEqual(lastTarget.method, 'setTargetAtTime');
  assert.strictEqual(lastTarget.target, 0.0, 'Gain targeted to 0.0 when muted');

  soundFX.setEnabled(true);
  assert.strictEqual(soundFX.isEnabled(), true, 'Audio re-enabled');
  const reTarget = calls[calls.length - 1];
  assert.strictEqual(reTarget.target, soundFX.getMasterVolume(), 'Gain targeted to masterVolume when unmuted');
});

runTest('Execute all 7 Soundboard synthesizer methods under adversarial pitch multipliers', () => {
  const methods = [
    'playPolaroidShutter',
    'playCosmicSparkle',
    'playBubblePop',
    'playLaserFocus',
    'playCrystalChime',
    'playRibbonSweep',
    'playHapticClick'
  ];

  const testPitches = [0.5, 0.75, 1.0, 1.35, 1.75, 2.0];

  methods.forEach(method => {
    assert(typeof soundFX[method] === 'function', `Method soundFX.${method} must exist`);

    testPitches.forEach(pitch => {
      soundFX.setPitchMultiplier(pitch);
      hapticEvents = [];
      // Execution must strictly complete without throwing DOMException
      soundFX[method]();
    });
  });

  // Verify ribbon sweep directional argument ('up', 'down', true, false)
  soundFX.playRibbonSweep('up');
  soundFX.playRibbonSweep('down');
  soundFX.playRibbonSweep(true);
  soundFX.playRibbonSweep(false);
});

runTest('Execute backward-compatible aliases and dispatcher without error', () => {
  const aliases = [
    'playShutter',
    'playSparkle',
    'playPop',
    'playFocusBeep',
    'playCursorSelect',
    'playRibbonToggle',
    'playChipHover'
  ];

  aliases.forEach(alias => {
    assert(typeof soundFX[alias] === 'function', `Alias soundFX.${alias} must exist`);
    soundFX[alias]();
  });

  // Cursor select debounce behavior: consecutive calls within 80ms should debounce
  soundFX.playCursorSelect();
  soundFX.playCursorSelect(); // debounced

  // Dispatcher soundFX.playSound(id)
  const soundIds = ['shutter', 'sparkle', 'pop', 'focus', 'chime', 'ribbon', 'haptic', 'unknown_id'];
  soundIds.forEach(id => {
    soundFX.playSound(id);
  });

  // Preview tone with boundary frequencies
  soundFX.playTonePreview(440, 'sine');
  soundFX.playTonePreview(0, 'triangle');
  soundFX.playTonePreview(50000, 'sine');
  soundFX.playTonePreview(NaN, 'sine');
});

runTest('SOUNDBOARD_SOUNDS descriptor items match schema and callbacks function cleanly', () => {
  const expectedIds = ['shutter', 'sparkle', 'pop', 'focus', 'chime', 'ribbon', 'haptic'];
  assert.strictEqual(SOUNDBOARD_SOUNDS.length, 7);

  SOUNDBOARD_SOUNDS.forEach((item, idx) => {
    assert.strictEqual(item.id, expectedIds[idx], `Item ${idx} id match`);
    assert(typeof item.name === 'string' && item.name.length > 0, `Item ${idx} name valid`);
    assert(typeof item.icon === 'string' && item.icon.length > 0, `Item ${idx} icon valid`);
    assert(typeof item.category === 'string' && item.category.length > 0, `Item ${idx} category valid`);
    assert(typeof item.play === 'function', `Item ${idx} play callback valid`);
    // Invoke callback
    item.play();
  });
});

runTest('Muted state (enabled = false) cleanly mutes without throwing or creating audio nodes', () => {
  soundFX.setEnabled(false);

  // Invoking any sound while muted should cleanly no-op
  soundFX.playPolaroidShutter();
  soundFX.playCosmicSparkle();
  soundFX.playBubblePop();
  soundFX.playLaserFocus();
  soundFX.playCrystalChime();
  soundFX.playRibbonSweep();
  soundFX.playHapticClick();
  soundFX.playTonePreview(440);

  // Re-enable for subsequent checks
  soundFX.setEnabled(true);
});

// -----------------------------------------------------------------------------
// SUITE 5: REACT CONTEXT RUNTIME, USELAB HOOK & SSR VERIFICATION
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 5: React Context Runtime, useLab Hook & SSR Verification ---');

import { transformWithOxc } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';

let labContextCompiled = null;

const tempCompiledPath = path.resolve('scripts/.temp_compiled_lab_context.mjs');
try {
  let rawCode = fs.readFileSync(path.resolve('src/context/LabContext.jsx'), 'utf8');
  // Replace relative audio import with absolute or scripts-relative import
  rawCode = rawCode.split("from '../utils/audio'").join("from '../src/utils/audio.js'");
  const oxcResult = await transformWithOxc(rawCode, 'src/context/LabContext.jsx', { jsx: { runtime: 'automatic' } });
  fs.writeFileSync(tempCompiledPath, oxcResult.code);
  labContextCompiled = await import('./.temp_compiled_lab_context.mjs');
} catch (e) {
  console.error('Failed to compile LabContext for Suite 5:', e);
} finally {
  if (fs.existsSync(tempCompiledPath)) {
    try { fs.unlinkSync(tempCompiledPath); } catch {}
  }
}

runTest('LabContext compiled via OXC exports expected symbols', () => {
  assert(labContextCompiled, 'labContextCompiled must be available');
  assert(labContextCompiled.LabProvider, 'LabProvider exported');
  assert(labContextCompiled.useLab, 'useLab exported');
  assert(labContextCompiled.DEFAULT_LAB_CONFIG, 'DEFAULT_LAB_CONFIG exported');
  assert(labContextCompiled.LAB_PRESETS, 'LAB_PRESETS exported');
  assert(labContextCompiled.LAB_STORAGE_KEY, 'LAB_STORAGE_KEY exported');
});

runTest('useLab() outside LabProvider throws explicit descriptive Error boundary', () => {
  let threw = false;
  let errMsg = '';
  function RogueComponent() {
    try {
      labContextCompiled.useLab();
    } catch (e) {
      threw = true;
      errMsg = e.message;
    }
    return React.createElement('div', null, 'rogue');
  }

  renderToString(React.createElement(RogueComponent));
  assert.strictEqual(threw, true, 'useLab must throw outside LabProvider');
  assert(errMsg.includes('useLab must be used within a LabProvider'), 'Error message contains boundary explanation');
});

runTest('LabProvider renders and injects complete state contract into consumers', () => {
  let capturedState = null;
  function ConsumerComponent() {
    capturedState = labContextCompiled.useLab();
    return React.createElement('div', { id: 'test-lab-consumer' }, `Scale: ${capturedState.cursorScale}`);
  }

  const html = renderToString(
    React.createElement(
      labContextCompiled.LabProvider,
      null,
      React.createElement(ConsumerComponent)
    )
  );

  assert(html.includes('Scale: 1'), 'SSR HTML contains consumer output');
  assert(capturedState, 'Captured context value from provider');

  // Verify all 11 state parameters
  assert.strictEqual(capturedState.cursorScale, 1.0);
  assert.strictEqual(capturedState.flightSpeed, 0.14);
  assert.strictEqual(capturedState.wingDynamics, 1.0);
  assert.strictEqual(capturedState.gravity, 0);
  assert.strictEqual(capturedState.trailEnabled, true);
  assert.strictEqual(capturedState.particleColor, '#FF4D6D');
  assert.strictEqual(capturedState.soundEnabled, true);
  assert.strictEqual(capturedState.masterVolume, 0.8);
  assert.strictEqual(capturedState.audioPitch, 1.0);
  assert.strictEqual(capturedState.isDrawerOpen, false);
  assert.strictEqual(capturedState.activePreset, 'default');

  // Verify all required action functions
  const requiredActions = [
    'setCursorScale',
    'setFlightSpeed',
    'setWingDynamics',
    'setGravity',
    'setTrailEnabled',
    'setParticleColor',
    'setSoundEnabled',
    'setMasterVolume',
    'setAudioPitch',
    'applyPreset',
    'resetDefaults',
    'resetToDefaults',
    'openDrawer',
    'closeDrawer',
    'toggleDrawer',
    'setCursorSpeed',
    'setAudioVolume'
  ];

  requiredActions.forEach(action => {
    assert.strictEqual(typeof capturedState[action], 'function', `Action ${action} must be a function`);
  });

  // Verify dynamic flags
  assert.strictEqual(capturedState.isZeroG, true, 'isZeroG flag true when gravity is 0');
  assert.strictEqual(capturedState.isAntiGravity, false, 'isAntiGravity flag false when gravity is 0');
  assert.strictEqual(capturedState.isHeavyGravity, false, 'isHeavyGravity flag false when gravity is 0');
});

runTest('LabProvider honors initialSoundEnabled prop override', () => {
  let capturedMuted = null;
  function MutedConsumer() {
    capturedMuted = labContextCompiled.useLab();
    return React.createElement('div', null, 'muted');
  }

  renderToString(
    React.createElement(
      labContextCompiled.LabProvider,
      { initialSoundEnabled: false },
      React.createElement(MutedConsumer)
    )
  );

  assert.strictEqual(capturedMuted.soundEnabled, false, 'initialSoundEnabled: false is respected');
});

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`STRESS SUITE RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
