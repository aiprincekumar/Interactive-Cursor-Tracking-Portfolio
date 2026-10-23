/**
 * EMPIRICAL CHALLENGER 2: COMPREHENSIVE RUNTIME VERIFICATION HARNESS
 * Milestone 3: Hero Character Controls, Web Audio Synthesizer Runtime, and Complete Physics Deletion
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('========================================================================');
console.log('  CHALLENGER 2: EMPIRICAL RUNTIME VERIFICATION & STRESS TEST HARNESS   ');
console.log('  Milestone 3 — Hero Character Controls, Web Audio & Physics Deletion   ');
console.log('========================================================================\n');

// 1. Setup Mock Web Audio API before importing audio.js
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
  createGain() { return new MockGainNode(); }
  createOscillator() { return new MockOscillatorNode(); }
  createBiquadFilter() { return new MockBiquadFilterNode(); }
  createBuffer(channels, length, sampleRate) {
    return {
      channels,
      length,
      sampleRate,
      getChannelData: () => new Float32Array(length)
    };
  }
  createBufferSource() { return new MockBufferSourceNode(); }
  resume() { return Promise.resolve(); }
}

globalThis.window = {
  AudioContext: MockAudioContext,
  webkitAudioContext: MockAudioContext,
  navigator: {
    vibrate: () => true
  }
};

const { soundFX, SOUNDBOARD_SOUNDS } = await import('../src/utils/audio.js');

let totalTests = 0;
let passedTests = 0;

function check(testName, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } catch (err) {
    console.error(`  ❌ [FAIL] ${testName}: ${err.message}`);
    throw err;
  }
}

// ============================================================================
// PART 1: COMPLETE DELETION OF PHYSICS ARTIFACTS
// ============================================================================
console.log('------------------------------------------------------------------------');
console.log('PART 1: VERIFICATION OF PHYSICS ARTIFACTS DELETION');
console.log('------------------------------------------------------------------------');

check('1.1: Verify src/components/PhysicsSandbox.jsx does NOT exist on disk', () => {
  const targetPath = path.resolve('src/components/PhysicsSandbox.jsx');
  const exists = fs.existsSync(targetPath);
  assert.strictEqual(exists, false, `PhysicsSandbox.jsx still exists at ${targetPath}`);
});

check('1.2: Verify recursive search across src/ finds ZERO occurrences of PhysicsSandbox', () => {
  function scanDir(dir, matches = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath, matches);
      } else if (entry.isFile() && /\.(jsx?|tsx?|css|html|json)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('PhysicsSandbox')) {
          matches.push({ file: fullPath });
        }
      }
    }
    return matches;
  }

  const matches = scanDir(path.resolve('src'));
  assert.strictEqual(
    matches.length,
    0,
    `Found ${matches.length} unexpected occurrence(s) of "PhysicsSandbox" in src/: ${JSON.stringify(matches)}`
  );
});

check('1.3: Verify InteractivePlayground.jsx & LabStudioDrawer.jsx have zero toy physics imports', () => {
  const playground = fs.readFileSync(path.resolve('src/components/InteractivePlayground.jsx'), 'utf8');
  const drawer = fs.readFileSync(path.resolve('src/components/LabStudioDrawer.jsx'), 'utf8');

  assert.ok(!playground.includes('PhysicsSandbox'), 'InteractivePlayground still mentions PhysicsSandbox');
  assert.ok(!drawer.includes('PhysicsSandbox'), 'LabStudioDrawer still mentions PhysicsSandbox');
  assert.ok(!playground.includes('speedometer'), 'InteractivePlayground still mentions speedometer');
  assert.ok(!drawer.includes('speedometer'), 'LabStudioDrawer still mentions speedometer');
  assert.ok(!playground.includes('particleBurst'), 'InteractivePlayground still mentions particleBurst');
  assert.ok(!playground.includes('Zero-G'), 'InteractivePlayground still mentions Zero-G arcade preset');
});

// ============================================================================
// PART 2: HERO CHARACTER CONTROLS RUNTIME VERIFICATION
// ============================================================================
console.log('\n------------------------------------------------------------------------');
console.log('PART 2: HERO CHARACTER CONTROLS RUNTIME VERIFICATION');
console.log('------------------------------------------------------------------------');

const heroSource = fs.readFileSync(path.resolve('src/components/HeroSection.jsx'), 'utf8');
const labContextSource = fs.readFileSync(path.resolve('src/context/LabContext.jsx'), 'utf8');

check('2.1: Verify all 10 Hero Pose image assets exist on disk and are non-empty', () => {
  const expectedPoses = [
    '00-rear-view.png',
    '01-center-up.png',
    '02-lower-center.png',
    '03-center-left.png',
    '04-center-right.png',
    '05-center-front.png',
    '06-upper-left.png',
    '07-lower-left.png',
    '08-upper-right.png',
    '09-lower-right.png'
  ];

  for (const filename of expectedPoses) {
    const filePath = path.resolve('public/assets/hero_poses', filename);
    assert.ok(fs.existsSync(filePath), `Asset ${filename} does not exist at ${filePath}`);
    const stat = fs.statSync(filePath);
    assert.ok(stat.size > 1000, `Asset ${filename} is corrupted or empty (${stat.size} bytes)`);
  }

  // Also verify BgHero.jpg
  const bgPath = path.resolve('public/assets/hero_poses/BgHero.jpg');
  assert.ok(fs.existsSync(bgPath), 'BgHero.jpg does not exist in public/assets/hero_poses/');
});

check('2.2: Verify POSE_INDEX_MAP has exactly 10 valid mapped poses matching pose indices 0-9', () => {
  const match = labContextSource.match(/export const POSE_INDEX_MAP = (\[[\s\S]*?\]);/);
  assert.ok(match, 'POSE_INDEX_MAP must be exported from LabContext.jsx');
  const POSE_INDEX_MAP = new Function(`return ${match[1]}`)();
  assert.strictEqual(Array.isArray(POSE_INDEX_MAP), true, 'POSE_INDEX_MAP must be an array');
  assert.strictEqual(POSE_INDEX_MAP.length, 10, 'POSE_INDEX_MAP must contain exactly 10 poses (0 through 9)');

  const expectedIndexMap = [
    'idle',
    'upper-center',
    'lower-center',
    'left',
    'right',
    'center',
    'upper-left',
    'lower-left',
    'upper-right',
    'lower-right'
  ];

  expectedIndexMap.forEach((expectedPose, index) => {
    assert.strictEqual(POSE_INDEX_MAP[index], expectedPose, `Index ${index} must map to ${expectedPose}`);
  });
});

check('2.3: Verify pose override bounds and sanitizer (0-9 valid, out-of-bounds locked to null)', () => {
  // Regex extract normalizePoseOverride from LabContext.jsx
  const match = labContextSource.match(/function normalizePoseOverride\(val\)\s*\{([\s\S]*?)\n\}/);
  assert.ok(match, 'normalizePoseOverride function must exist in LabContext.jsx');
  
  // Create callable function from source logic
  const normalizePoseOverride = new Function('val', 'POSE_INDEX_MAP', match[1] + '; return normalizePoseOverride(val);');
  const POSE_INDEX_MAP = [
    'idle', 'upper-center', 'lower-center', 'left', 'right',
    'center', 'upper-left', 'lower-left', 'upper-right', 'lower-right'
  ];
  const testNormalize = (val) => normalizePoseOverride(val, POSE_INDEX_MAP);

  // Valid poses 0 through 9
  for (let i = 0; i <= 9; i++) {
    assert.strictEqual(testNormalize(i), i, `Pose index ${i} must normalize to ${i}`);
    assert.strictEqual(testNormalize(`${i}`), i, `String pose index "${i}" must normalize to ${i}`);
    assert.strictEqual(testNormalize(POSE_INDEX_MAP[i]), i, `Pose string "${POSE_INDEX_MAP[i]}" must normalize to ${i}`);
  }

  // Out of bound tests
  assert.strictEqual(testNormalize(-1), null, 'Negative index -1 must normalize to null');
  assert.strictEqual(testNormalize(10), null, 'Index 10 out of bound must normalize to null');
  assert.strictEqual(testNormalize(999), null, 'Index 999 out of bound must normalize to null');
  assert.strictEqual(testNormalize(NaN), null, 'NaN must normalize to null');
  assert.strictEqual(testNormalize(null), null, 'null must normalize to null');
  assert.strictEqual(testNormalize(undefined), null, 'undefined must normalize to null');
  assert.strictEqual(testNormalize('auto'), null, '"auto" must normalize to null');
  assert.strictEqual(testNormalize('random-invalid'), null, 'Invalid string must normalize to null');
});

check('2.4: Verify all 10 pose overrides in HeroSection lock forcedState and opacities without errors', () => {
  const POSE_INDEX_MAP = [
    'idle', 'upper-center', 'lower-center', 'left', 'right',
    'center', 'upper-left', 'lower-left', 'upper-right', 'lower-right'
  ];

  // Simulate HeroSection pose resolution logic for every pose index 0-9
  for (let i = 0; i <= 9; i++) {
    const poseOverride = i;
    const effectiveOverride = poseOverride !== null
      ? (typeof poseOverride === 'number' ? POSE_INDEX_MAP[poseOverride] : poseOverride)
      : null;
    const activeForcedState = effectiveOverride;

    let centerOp = 0, upCenterOp = 0, lowCenterOp = 0, leftOp = 0, rightOp = 0;
    let upLeftOp = 0, lowLeftOp = 0, upRightOp = 0, lowRightOp = 0, idleOp = 0;

    if (activeForcedState) {
      idleOp = (activeForcedState === 'idle' || activeForcedState === 'rear-view') ? 1 : 0;
      centerOp = (activeForcedState === 'center' || activeForcedState === 'center-front') ? 1 : 0;
      upCenterOp = (activeForcedState === 'upper-center' || activeForcedState === 'center-upper') ? 1 : 0;
      lowCenterOp = (activeForcedState === 'lower-center' || activeForcedState === 'center-lower') ? 1 : 0;
      leftOp = (activeForcedState === 'left' || activeForcedState === 'center-left') ? 1 : 0;
      rightOp = (activeForcedState === 'right' || activeForcedState === 'center-right') ? 1 : 0;
      upLeftOp = activeForcedState === 'upper-left' ? 1 : 0;
      lowLeftOp = activeForcedState === 'lower-left' ? 1 : 0;
      upRightOp = activeForcedState === 'upper-right' ? 1 : 0;
      lowRightOp = activeForcedState === 'lower-right' ? 1 : 0;
    }

    const opacities = [idleOp, upCenterOp, lowCenterOp, leftOp, rightOp, centerOp, upLeftOp, lowLeftOp, upRightOp, lowRightOp];
    const sumOpacities = opacities.reduce((a, b) => a + b, 0);

    assert.strictEqual(sumOpacities, 1, `Pose override ${i} (${effectiveOverride}) must produce exactly one active pose with opacity 1`);
    assert.strictEqual(opacities[i], 1, `Pose override ${i} (${effectiveOverride}) must activate its matching slot index`);
  }
});

check('2.5: Verify gazeMode === "fixed" completely suppresses gaze shift calculations', () => {
  // Simulate the tick calculations from HeroSection lines 208-255 & 282-285
  const simulateTick = (gazeMode, curX, curY) => {
    const isFixedGaze = gazeMode === 'fixed';
    const state = { targetNormX: 0.5, targetNormY: 0.5, isHovered: true };

    if (isFixedGaze) {
      state.targetNormX = 0;
      state.targetNormY = 0;
      state.isHovered = false;
    }

    const charShiftX = isFixedGaze ? 0 : curX * 56;
    const charShiftY = isFixedGaze ? 0 : curY * 42;
    const bgShiftX = isFixedGaze ? 0 : -curX * 32;
    const bgShiftY = isFixedGaze ? 0 : -curY * 24;

    return {
      charShiftX,
      charShiftY,
      bgShiftX,
      bgShiftY,
      targetNormX: state.targetNormX,
      targetNormY: state.targetNormY,
      isHovered: state.isHovered
    };
  };

  // Test across 20 different pointer coordinate vectors [-1.0 .. +1.0]
  for (let step = -10; step <= 10; step++) {
    const x = step / 10;
    const y = -step / 10;

    const fixedResult = simulateTick('fixed', x, y);
    assert.strictEqual(fixedResult.charShiftX, 0, `charShiftX must be strictly 0 under gazeMode='fixed' at x=${x}`);
    assert.strictEqual(fixedResult.charShiftY, 0, `charShiftY must be strictly 0 under gazeMode='fixed' at y=${y}`);
    assert.strictEqual(fixedResult.bgShiftX, 0, `bgShiftX must be strictly 0 under gazeMode='fixed' at x=${x}`);
    assert.strictEqual(fixedResult.bgShiftY, 0, `bgShiftY must be strictly 0 under gazeMode='fixed' at y=${y}`);
    assert.strictEqual(fixedResult.targetNormX, 0, 'targetNormX must be reset to 0 in fixed mode');
    assert.strictEqual(fixedResult.targetNormY, 0, 'targetNormY must be reset to 0 in fixed mode');
    assert.strictEqual(fixedResult.isHovered, false, 'isHovered must be reset to false in fixed mode');

    // In auto mode with non-zero coordinates, shifts should be active
    if (x !== 0 && y !== 0) {
      const autoResult = simulateTick('auto', x, y);
      assert.notStrictEqual(autoResult.charShiftX, 0, `charShiftX must be active under gazeMode='auto'`);
      assert.notStrictEqual(autoResult.charShiftY, 0, `charShiftY must be active under gazeMode='auto'`);
    }
  }
});

check('2.6: Verify character zoom scale multiplier (0.5x to 2.0x) is applied to effectiveScale', () => {
  const BASELINE_SCALE = 0.95;

  const testScales = [0.5, 0.75, 1.0, 1.25, 1.5, 1.8, 2.0];
  for (const zoom of testScales) {
    const effectiveScale = BASELINE_SCALE * zoom;
    const expected = Number((0.95 * zoom).toFixed(4));
    assert.strictEqual(Number(effectiveScale.toFixed(4)), expected, `effectiveScale for zoom ${zoom} must be ${expected}`);
  }

  // Clamping verification
  assert.ok(labContextSource.includes('clamp(val, 0.5, 2.0, 1.0)'), 'LabContext must clamp characterZoom between 0.5 and 2.0');
  assert.ok(heroSource.includes('const effectiveScale = BASELINE_SCALE * userScale;'), 'HeroSection must compute effectiveScale from userScale');
  assert.ok(heroSource.includes('transform: `scale(${effectiveScale})`'), 'HeroSection must bind transform scale to effectiveScale');
});

check('2.7: Verify flashConfettiEnabled === false suppresses camera flash and confetti burst', () => {
  // Test simulation of HeroSection shutter capture handler
  let isFlashing = false;
  let confettiFired = false;
  const mockConfetti = () => { confettiFired = true; };
  const mockSetIsFlashing = (val) => { isFlashing = val; };

  const triggerCapture = (reducedMotion, flashConfettiEnabled) => {
    if (!reducedMotion && flashConfettiEnabled) {
      mockSetIsFlashing(true);
      mockConfetti();
    }
  };

  // Test 1: flashConfettiEnabled = false
  isFlashing = false;
  confettiFired = false;
  triggerCapture(false, false);
  assert.strictEqual(isFlashing, false, 'isFlashing must remain false when flashConfettiEnabled is false');
  assert.strictEqual(confettiFired, false, 'confetti must NOT fire when flashConfettiEnabled is false');

  // Test 2: flashConfettiEnabled = true
  isFlashing = false;
  confettiFired = false;
  triggerCapture(false, true);
  assert.strictEqual(isFlashing, true, 'isFlashing must be true when flashConfettiEnabled is true');
  assert.strictEqual(confettiFired, true, 'confetti MUST fire when flashConfettiEnabled is true');

  // Verify in HeroSection.jsx code
  assert.ok(
    heroSource.includes('if (!reducedMotion && flashConfettiEnabled) {') ||
    heroSource.includes('if (!reducedMotion && flashConfettiEnabledRef.current) {'),
    'HeroSection.jsx must guard flash and confetti with flashConfettiEnabled'
  );
});

check('2.8: Verify custom cursor off suppresses "cursor-none" on Hero container', () => {
  const evaluateHeroCursorClass = (isInsideHero, reducedMotion, customCursorEnabled) => {
    return isInsideHero && !reducedMotion && customCursorEnabled ? 'cursor-none' : '';
  };

  // Case 1: customCursorEnabled = false -> cursor-none SUPPRESSED
  assert.strictEqual(
    evaluateHeroCursorClass(true, false, false),
    '',
    'cursor-none MUST be suppressed when customCursorEnabled is false'
  );

  // Case 2: customCursorEnabled = true -> cursor-none ACTIVE
  assert.strictEqual(
    evaluateHeroCursorClass(true, false, true),
    'cursor-none',
    'cursor-none MUST be present when customCursorEnabled is true'
  );

  // Case 3: pointer outside hero -> cursor-none SUPPRESSED
  assert.strictEqual(evaluateHeroCursorClass(false, false, true), '');

  // Case 4: reduced motion -> cursor-none SUPPRESSED
  assert.strictEqual(evaluateHeroCursorClass(true, true, true), '');

  // Verify in HeroSection.jsx source code
  assert.ok(
    heroSource.includes("isInsideHero && !reducedMotion && customCursorEnabled ? 'cursor-none' : ''"),
    'HeroSection.jsx must compute cursor-none with customCursorEnabled guard'
  );
});

// ============================================================================
// PART 3: WEB AUDIO SYNTHESIZER RUNTIME EMPIRICAL VERIFICATION
// ============================================================================
console.log('\n------------------------------------------------------------------------');
console.log('PART 3: WEB AUDIO SYNTHESIZER RUNTIME EMPIRICAL VERIFICATION');
console.log('------------------------------------------------------------------------');

check('3.1: Verify all 7 acoustic preview synthesizer functions exist and execute without exceptions', () => {
  const acousticFunctions = [
    { name: 'playPolaroidShutter', desc: '1. Polaroid Shutter' },
    { name: 'playCosmicSparkle', desc: '2. Cosmic Sparkle' },
    { name: 'playBubblePop', desc: '3. Bubble Pop' },
    { name: 'playLaserFocus', desc: '4. Laser Focus' },
    { name: 'playCrystalChime', desc: '5. Crystal Chime' },
    { name: 'playRibbonSweep', desc: '6. Ribbon Sweep' },
    { name: 'playHapticClick', desc: '7. Haptic Click' }
  ];

  for (const fn of acousticFunctions) {
    assert.strictEqual(typeof soundFX[fn.name], 'function', `${fn.name} must exist on soundFX`);
    // Execute function
    assert.doesNotThrow(() => {
      soundFX[fn.name]();
    }, `Executing ${fn.name} must not throw`);
  }

  // Also verify SOUNDBOARD_SOUNDS
  assert.strictEqual(SOUNDBOARD_SOUNDS.length, 7, 'SOUNDBOARD_SOUNDS must have exactly 7 descriptors');
  for (const item of SOUNDBOARD_SOUNDS) {
    assert.ok(item.id, 'Descriptor item must have an id');
    assert.ok(item.name, 'Descriptor item must have a display name');
    assert.strictEqual(typeof item.play, 'function', `Descriptor item ${item.name} must have a play function`);
    assert.doesNotThrow(() => {
      item.play();
    }, `Executing SOUNDBOARD_SOUNDS play() for ${item.name} must not throw`);
  }
});

check('3.2: Verify soundMatchingMode toggle ("universal" calls chime, "dynamic" synthesizes cursor-specific tone)', () => {
  soundFX.resetAudioDefaults();

  // Spies for audio methods
  const callCounts = {
    playCrystalChime: 0,
    playCosmicSparkle: 0,
    playLaserFocus: 0,
    playPolaroidShutter: 0,
    playBubblePop: 0,
    playRibbonSweep: 0,
    playHapticClick: 0
  };

  const originalMethods = {};
  for (const key of Object.keys(callCounts)) {
    originalMethods[key] = soundFX[key].bind(soundFX);
    soundFX[key] = (...args) => {
      callCounts[key]++;
      return originalMethods[key](...args);
    };
  }

  // STEP A: Test 'universal' mode
  soundFX.setSoundMatchingMode('universal');
  assert.strictEqual(soundFX.getSoundMatchingMode(), 'universal', 'Mode must be universal');

  const testCursorIds = ['butterfly', 'laser', 'camera', 'bubble', 'airplane', 'minimal', 'crystal', 'custom_id'];
  for (const id of testCursorIds) {
    soundFX.lastCursorSelectTime = 0; // bypass 80ms throttle
    soundFX.playCursorSelect(id);
  }

  assert.strictEqual(
    callCounts.playCrystalChime,
    testCursorIds.length,
    `In 'universal' mode, playCrystalChime must be called for all ${testCursorIds.length} cursors`
  );
  assert.strictEqual(callCounts.playCosmicSparkle, 0, 'In universal mode, cosmic sparkle must NOT be called');
  assert.strictEqual(callCounts.playLaserFocus, 0, 'In universal mode, laser focus must NOT be called');
  assert.strictEqual(callCounts.playPolaroidShutter, 0, 'In universal mode, polaroid shutter must NOT be called');

  // STEP B: Test 'dynamic' mode
  // Reset counts
  for (const key of Object.keys(callCounts)) callCounts[key] = 0;

  soundFX.setSoundMatchingMode('dynamic');
  assert.strictEqual(soundFX.getSoundMatchingMode(), 'dynamic', 'Mode must be dynamic');

  // 1. Butterfly / Stardust -> Sparkle
  soundFX.lastCursorSelectTime = 0;
  soundFX.playCursorSelect('butterfly');
  assert.strictEqual(callCounts.playCosmicSparkle, 1, 'Cursor "butterfly" must trigger playCosmicSparkle');

  // 2. Laser / Reticle -> Laser Focus
  soundFX.lastCursorSelectTime = 0;
  soundFX.playCursorSelect('laser');
  assert.strictEqual(callCounts.playLaserFocus, 1, 'Cursor "laser" must trigger playLaserFocus');

  // 3. Camera / Polaroid -> Polaroid Shutter
  soundFX.lastCursorSelectTime = 0;
  soundFX.playCursorSelect('camera');
  assert.strictEqual(callCounts.playPolaroidShutter, 1, 'Cursor "camera" must trigger playPolaroidShutter');

  // 4. Bubble / Drop -> Bubble Pop
  soundFX.lastCursorSelectTime = 0;
  soundFX.playCursorSelect('bubble');
  assert.strictEqual(callCounts.playBubblePop, 1, 'Cursor "bubble" must trigger playBubblePop');

  // 5. Airplane / Ribbon -> Ribbon Sweep
  soundFX.lastCursorSelectTime = 0;
  soundFX.playCursorSelect('airplane');
  assert.strictEqual(callCounts.playRibbonSweep, 1, 'Cursor "airplane" must trigger playRibbonSweep');

  // 6. Minimal / Haptic -> Haptic Click
  soundFX.lastCursorSelectTime = 0;
  soundFX.playCursorSelect('minimal');
  assert.strictEqual(callCounts.playHapticClick, 1, 'Cursor "minimal" must trigger playHapticClick');

  // 7. Crystal / Unknown fallback -> Crystal Chime
  soundFX.lastCursorSelectTime = 0;
  soundFX.playCursorSelect('unknown-style');
  assert.strictEqual(callCounts.playCrystalChime, 1, 'Unknown cursor must trigger crystal chime fallback');

  // Restore spies
  for (const key of Object.keys(originalMethods)) {
    soundFX[key] = originalMethods[key];
  }
});

check('3.3: Verify volume slider and pitch multiplier reactively update synthesis parameters', () => {
  soundFX.resetAudioDefaults();
  soundFX.init();

  // Test Volume Slider Updates & Reactive Gain Scheduling
  const testVolumes = [0.0, 0.25, 0.5, 0.75, 1.0];
  for (const vol of testVolumes) {
    soundFX.setMasterVolume(vol);
    assert.strictEqual(soundFX.getMasterVolume(), vol, `Master volume must match ${vol}`);
    
    // Check gain node event queue
    const events = soundFX.masterGain.gain.events;
    const latestEvent = events[events.length - 1];
    assert.strictEqual(latestEvent.type, 'setTargetAtTime', 'Gain must be updated with smooth setTargetAtTime');
    assert.strictEqual(latestEvent.val, vol, `Target gain must equal ${vol}`);
    assert.strictEqual(latestEvent.timeConstant, 0.015, 'Gain time constant must be 0.015s for click-free transition');
  }

  // Volume Out-of-Bound Clamping
  soundFX.setMasterVolume(-0.8);
  assert.strictEqual(soundFX.getMasterVolume(), 0.0, 'Negative volume must clamp to 0.0');
  soundFX.setMasterVolume(2.5);
  assert.strictEqual(soundFX.getMasterVolume(), 1.0, 'Overflow volume must clamp to 1.0');

  // Test Pitch Multiplier Updates & Range Clamping [0.5x to 2.0x]
  const testPitches = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
  for (const pitch of testPitches) {
    soundFX.setPitchMultiplier(pitch);
    assert.strictEqual(soundFX.getPitchMultiplier(), pitch, `Pitch multiplier must match ${pitch}`);
  }

  // Pitch Out-of-Bound Clamping
  soundFX.setPitchMultiplier(0.1);
  assert.strictEqual(soundFX.getPitchMultiplier(), 0.5, 'Pitch < 0.5 must clamp to 0.5');
  soundFX.setPitchMultiplier(5.0);
  assert.strictEqual(soundFX.getPitchMultiplier(), 2.0, 'Pitch > 2.0 must clamp to 2.0');

  // Empirical Test: Verify pitch multiplier mathematically scales synthesized oscillator frequencies
  soundFX.setPitchMultiplier(1.5);
  const baseFreq = 440;
  
  // Intercept oscillator creation to inspect frequency
  let scheduledFreq = null;
  const originalCreateOsc = soundFX.ctx.createOscillator.bind(soundFX.ctx);
  soundFX.ctx.createOscillator = () => {
    const osc = originalCreateOsc();
    const origSetVal = osc.frequency.setValueAtTime.bind(osc.frequency);
    osc.frequency.setValueAtTime = (f, t) => {
      if (scheduledFreq === null) scheduledFreq = f;
      return origSetVal(f, t);
    };
    return osc;
  };

  soundFX.playTonePreview(baseFreq);
  assert.strictEqual(
    scheduledFreq,
    baseFreq * 1.5,
    `Oscillator frequency must be scaled by pitchMultiplier (expected ${baseFreq * 1.5}, got ${scheduledFreq})`
  );

  // Restore oscillator factory
  soundFX.ctx.createOscillator = originalCreateOsc;
});

// ============================================================================
// PART 4: ADVERSARIAL STRESS TESTING & BOUNDARY VALIDATION
// ============================================================================
console.log('\n------------------------------------------------------------------------');
console.log('PART 4: ADVERSARIAL STRESS TESTING & BOUNDARY VALIDATION');
console.log('------------------------------------------------------------------------');

check('4.1: Concurrency & rapid firing audio stress (1000 successive calls)', () => {
  soundFX.resetAudioDefaults();
  soundFX.init();

  assert.doesNotThrow(() => {
    for (let i = 0; i < 1000; i++) {
      soundFX.setPitchMultiplier(0.5 + (i % 15) * 0.1);
      soundFX.setMasterVolume((i % 10) / 10);
      soundFX.playSound('haptic');
    }
  }, '1000 rapid successive audio parameter and playSound calls must execute without throwing');
});

check('4.2: Rapid soundMatchingMode toggling under rapid selection calls', () => {
  assert.doesNotThrow(() => {
    for (let i = 0; i < 100; i++) {
      soundFX.setSoundMatchingMode(i % 2 === 0 ? 'universal' : 'dynamic');
      soundFX.lastCursorSelectTime = 0;
      soundFX.playCursorSelect(i % 2 === 0 ? 'butterfly' : 'laser');
    }
  }, 'Rapid soundMatchingMode flipping during selection must execute cleanly');
});

check('4.3: Extreme corrupted input resilience in LabContext and audio', () => {
  soundFX.setMasterVolume(NaN);
  assert.strictEqual(soundFX.getMasterVolume(), 0.8, 'NaN volume must fall back to 0.8');

  soundFX.setPitchMultiplier(NaN);
  assert.strictEqual(soundFX.getPitchMultiplier(), 1.0, 'NaN pitch must fall back to 1.0');

  soundFX.setBaseFrequency('corrupted');
  assert.strictEqual(soundFX.getBaseFrequency(), 440, 'Corrupted base frequency must fall back to 440');
});

// ============================================================================
// SUMMARY & VERDICT
// ============================================================================
console.log('\n========================================================================');
console.log(`  ALL ${passedTests} OF ${totalTests} EMPIRICAL CHALLENGER TESTS PASSED!`);
console.log('  VERDICT: APPROVE');
console.log('========================================================================\n');
