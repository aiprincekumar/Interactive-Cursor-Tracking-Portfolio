// Automated verification test for Web Audio Synthesizer & Soundboard
import assert from 'node:assert';

// 1. Mock minimal Web Audio API for Node.js environment
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

// Attach mock globals
globalThis.window = {
  AudioContext: MockAudioContext,
  webkitAudioContext: MockAudioContext,
  navigator: {
    vibrate: () => true,
  },
};

// 2. Import audio module
const { soundFX, SOUNDBOARD_SOUNDS, default: defaultSoundFX } = await import('../src/utils/audio.js');

console.log('--- Testing Web Audio Synthesizer & Soundboard ---');

// Test 1: Module Exports
assert.strictEqual(soundFX, defaultSoundFX, 'Default export should equal named soundFX export');
assert.ok(Array.isArray(SOUNDBOARD_SOUNDS), 'SOUNDBOARD_SOUNDS must be an array');
assert.strictEqual(SOUNDBOARD_SOUNDS.length, 7, 'SOUNDBOARD_SOUNDS must have exactly 7 effects');
console.log('✓ Test 1 Passed: Module exports verified');

// Test 2: Master Volume Controls & Clamping
soundFX.setMasterVolume(0.5);
assert.strictEqual(soundFX.getMasterVolume(), 0.5, 'Volume should be 0.5');

soundFX.setMasterVolume(-0.3);
assert.strictEqual(soundFX.getMasterVolume(), 0.0, 'Volume should clamp to 0.0 on negative');

soundFX.setMasterVolume(1.8);
assert.strictEqual(soundFX.getMasterVolume(), 1.0, 'Volume should clamp to 1.0 on overflow');

soundFX.setMasterVolume(0.8);
assert.strictEqual(soundFX.getMasterVolume(), 0.8, 'Volume reset to 0.8');
console.log('✓ Test 2 Passed: Master volume range clamping [0.0, 1.0] verified');

// Test 3: Pitch Multiplier Controls & Clamping
soundFX.setPitchMultiplier(1.5);
assert.strictEqual(soundFX.getPitchMultiplier(), 1.5, 'Pitch should be 1.5');

soundFX.setPitchMultiplier(0.1);
assert.strictEqual(soundFX.getPitchMultiplier(), 0.5, 'Pitch should clamp to 0.5 on underflow');

soundFX.setPitchMultiplier(3.5);
assert.strictEqual(soundFX.getPitchMultiplier(), 2.0, 'Pitch should clamp to 2.0 on overflow');

soundFX.setPitchMultiplier(1.0);
assert.strictEqual(soundFX.getPitchMultiplier(), 1.0, 'Pitch reset to 1.0');
console.log('✓ Test 3 Passed: Pitch multiplier range clamping [0.5, 2.0] verified');

// Test 4: Reset Audio Defaults
soundFX.setMasterVolume(0.2);
soundFX.setPitchMultiplier(1.8);
soundFX.setEnabled(false);
soundFX.resetAudioDefaults();
assert.strictEqual(soundFX.isEnabled(), true, 'Enabled should be reset to true');
assert.strictEqual(soundFX.getMasterVolume(), 0.8, 'Master volume should be reset to 0.8');
assert.strictEqual(soundFX.getPitchMultiplier(), 1.0, 'Pitch multiplier should be reset to 1.0');
console.log('✓ Test 4 Passed: resetAudioDefaults() verified');

// Test 5: Gain Smoothing with setTargetAtTime
soundFX.init();
assert.ok(soundFX.masterGain, 'masterGain must be initialized');
soundFX.setMasterVolume(0.65);
const lastEvent = soundFX.masterGain.gain.events[soundFX.masterGain.gain.events.length - 1];
assert.strictEqual(lastEvent.type, 'setTargetAtTime', 'Volume adjustment must use click-free setTargetAtTime');
assert.strictEqual(lastEvent.val, 0.65, 'Target gain must match volume');
assert.strictEqual(lastEvent.timeConstant, 0.015, 'Time constant must be 0.015 for click-free smoothing');
console.log('✓ Test 5 Passed: Click-free Web Audio gain smoothing verified');

// Test 6: 7 Soundboard Synthesizers Execution & Aliases
const methodsToTest = [
  { primary: 'playPolaroidShutter', alias: 'playShutter' },
  { primary: 'playCosmicSparkle', alias: 'playSparkle' },
  { primary: 'playBubblePop', alias: 'playPop' },
  { primary: 'playLaserFocus', alias: 'playFocusBeep' },
  { primary: 'playCrystalChime', alias: null },
  { primary: 'playRibbonSweep', alias: 'playRibbonToggle' },
  { primary: 'playHapticClick', alias: 'playChipHover' },
];

methodsToTest.forEach(({ primary, alias }) => {
  assert.strictEqual(typeof soundFX[primary], 'function', `Method ${primary} must exist`);
  // Call primary
  soundFX[primary]();
  if (alias) {
    assert.strictEqual(typeof soundFX[alias], 'function', `Alias method ${alias} must exist`);
    // Call alias
    soundFX[alias]();
  }
});
console.log('✓ Test 6 Passed: All 7 soundboard synthesizer methods and aliases verified');

// Test 7: playCursorSelect, playTonePreview, and playSound dispatcher
soundFX.playCursorSelect();
soundFX.playTonePreview(520, 'sine');

['shutter', 'sparkle', 'pop', 'focus', 'chime', 'ribbon', 'haptic'].forEach((id) => {
  soundFX.playSound(id);
});
console.log('✓ Test 7 Passed: playCursorSelect, playTonePreview, and playSound dispatcher verified');

// Test 8: SOUNDBOARD_SOUNDS Array Content
SOUNDBOARD_SOUNDS.forEach((item) => {
  assert.ok(item.id, 'Item must have id');
  assert.ok(item.name, 'Item must have name');
  assert.ok(item.icon, 'Item must have icon');
  assert.ok(item.category, 'Item must have category');
  assert.strictEqual(typeof item.play, 'function', 'Item must have play function');
  item.play(); // Execute play handler
});
console.log('✓ Test 8 Passed: SOUNDBOARD_SOUNDS descriptor array and callbacks verified');

console.log('\n=========================================');
console.log(' ALL WEB AUDIO SYNTHESIZER TESTS PASSED! ');
console.log('=========================================\n');
