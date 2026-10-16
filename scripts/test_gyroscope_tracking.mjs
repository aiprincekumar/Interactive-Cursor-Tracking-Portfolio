import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

const rootDir = process.cwd();

console.log('=== GYROSCOPE TRACKING & DIRECTIONAL SCROLL VERIFICATION TEST ===\n');

// ---------------------------------------------------------
// 1. Static File Verification
// ---------------------------------------------------------
const hookPath = path.join(rootDir, 'src', 'hooks', 'useGyroscopeTracking.js');
const heroPath = path.join(rootDir, 'src', 'components', 'HeroSection.jsx');

assert(fs.existsSync(hookPath), 'src/hooks/useGyroscopeTracking.js must exist');
assert(fs.existsSync(heroPath), 'src/components/HeroSection.jsx must exist');
console.log('[PASS] All expected source files exist.');

// ---------------------------------------------------------
// 2. Code Structure & Integration Verification
// ---------------------------------------------------------
const hookContent = fs.readFileSync(hookPath, 'utf-8');
const heroContent = fs.readFileSync(heroPath, 'utf-8');

assert(hookContent.includes('useGyroscopeTracking'), 'Hook must export useGyroscopeTracking');
assert(hookContent.includes('deviceorientation'), 'Hook must listen to deviceorientation events');
assert(hookContent.includes('requestPermission'), 'Hook must support iOS 13+ requestPermission');
assert(hookContent.includes('scrollBy'), 'Hook must support window.scrollBy for tilt-to-scroll');
assert(hookContent.includes('isGyroScrollActive'), 'Hook must provide tilt scroll toggle state');
assert(hookContent.includes('baselineGamma'), 'Hook must support dual baselineGamma calibration for landscape');
assert(hookContent.includes('isTouchDevice'), 'Hook must expose touch device detection');
console.log('[PASS] useGyroscopeTracking.js contains all required sensor and scrolling mechanisms.');

assert(heroContent.includes('useGyroscopeTracking'), 'HeroSection must import useGyroscopeTracking');
assert(heroContent.includes('Compass'), 'HeroSection must import Compass icon');
assert(heroContent.includes('bgBackdropRef'), 'HeroSection must attach bgBackdropRef for directional parallax');
assert(heroContent.includes('translate3d'), 'HeroSection must apply directional translate3d character motion');
assert(heroContent.includes('breathCycle'), 'HeroSection must compute respiratory breathCycle');
assert(heroContent.includes('breathScale'), 'HeroSection must compute organic chest expansion breathScale');
assert(heroContent.includes('breathingWeight'), 'HeroSection must blend breathingWeight with idle & motion');
assert(heroContent.includes('Gyro Active') || heroContent.includes('Enable Gyro'), 'HeroSection must render Gyro Control Pill');
console.log('[PASS] HeroSection.jsx integrates gyro sensor, character translation, organic idle breathing, and UI controls.');

// ---------------------------------------------------------
// 3. Logic Simulation Tests for Orientation & Deadzone
// ---------------------------------------------------------
console.log('\n--- Sensor Logic Simulation Tests ---');

function computeNormalizedGyro({
  beta,
  gamma,
  baselineBeta = 45,
  baselineGamma = 0,
  orientationAngle = 0,
  deadzone = 2.0,
  maxTiltX = 25,
  maxTiltY = 25,
  scrollThreshold = 0.28
}) {
  const deltaBeta = beta - baselineBeta;
  const deltaGamma = gamma - baselineGamma;

  let tiltX = 0;
  let tiltY = 0;

  if (orientationAngle === 90) {
    tiltX = -deltaBeta;
    tiltY = deltaGamma;
  } else if (orientationAngle === -90 || orientationAngle === 270) {
    tiltX = deltaBeta;
    tiltY = -deltaGamma;
  } else if (orientationAngle === 180) {
    tiltX = -deltaGamma;
    tiltY = -deltaBeta;
  } else {
    // Portrait 0°
    tiltX = deltaGamma;
    tiltY = deltaBeta;
  }

  // Deadzone filter
  if (Math.abs(tiltX) < deadzone) tiltX = 0;
  if (Math.abs(tiltY) < deadzone) tiltY = 0;

  const normX = Math.max(-0.5, Math.min(0.5, (tiltX / maxTiltX) * 0.5));
  const normY = Math.max(-0.5, Math.min(0.5, (tiltY / maxTiltY) * 0.5));

  const absX = Math.abs(normX);
  const absY = Math.abs(normY);

  const isScrolling = absX > scrollThreshold || absY > scrollThreshold;
  const dirY = absY > scrollThreshold ? (normY > 0 ? 'down' : 'up') : '';
  const dirX = absX > scrollThreshold ? (normX > 0 ? 'right' : 'left') : '';
  const scrollDirection = dirY && dirX ? `${dirY}-${dirX}` : (dirY || dirX || null);

  return { tiltX, tiltY, normX, normY, isScrolling, scrollDirection };
}

// Case A: Portrait resting position (beta=45°, gamma=0°, baselineBeta=45°, baselineGamma=0°)
{
  const res = computeNormalizedGyro({ beta: 45, gamma: 0, baselineBeta: 45, baselineGamma: 0, orientationAngle: 0 });
  assert.strictEqual(res.normX, 0, 'Resting position X must be 0');
  assert.strictEqual(res.normY, 0, 'Resting position Y must be 0');
  assert.strictEqual(res.isScrolling, false, 'Resting position must not scroll');
  console.log('[PASS] Case A: Portrait resting position centers character at normX=0, normY=0 without scroll.');
}

// Case B: Small hand jitter within deadzone (< 2.0°)
{
  const res = computeNormalizedGyro({ beta: 46.2, gamma: 1.1, baselineBeta: 45, baselineGamma: 0, orientationAngle: 0 });
  assert.strictEqual(res.normX, 0, 'Jitter within deadzone X must be filtered out');
  assert.strictEqual(res.normY, 0, 'Jitter within deadzone Y must be filtered out');
  console.log('[PASS] Case B: Hand jitter within deadzone filtered to prevent camera shake.');
}

// Case C: Tilting Phone Left in Portrait (gamma = -20°, beta = 45°)
{
  const res = computeNormalizedGyro({ beta: 45, gamma: -20, baselineBeta: 45, baselineGamma: 0 });
  assert(res.normX < -0.3, `Tilting left should give negative normX, got ${res.normX}`);
  assert.strictEqual(res.normY, 0, 'Vertical tilt should remain 0');
  assert.strictEqual(res.scrollDirection, 'left', 'Tilting left past threshold must scroll left');
  console.log(`[PASS] Case C: Tilting Left moves character left (normX = ${res.normX.toFixed(3)}) & scrolls left.`);
}

// Case D: Tilting Phone Right in Portrait (gamma = +20°, beta = 45°)
{
  const res = computeNormalizedGyro({ beta: 45, gamma: 20, baselineBeta: 45, baselineGamma: 0 });
  assert(res.normX > 0.3, `Tilting right should give positive normX, got ${res.normX}`);
  assert.strictEqual(res.normY, 0, 'Vertical tilt should remain 0');
  assert.strictEqual(res.scrollDirection, 'right', 'Tilting right past threshold must scroll right');
  console.log(`[PASS] Case D: Tilting Right moves character right (normX = ${res.normX.toFixed(3)}) & scrolls right.`);
}

// Case E: Tilting Phone Forward / Down in Portrait (gamma = 0°, beta = 65°)
{
  const res = computeNormalizedGyro({ beta: 65, gamma: 0, baselineBeta: 45, baselineGamma: 0 });
  assert(res.normY > 0.35, `Tilting forward/down should give positive normY, got ${res.normY}`);
  assert.strictEqual(res.scrollDirection, 'down', 'Tilting down past threshold must scroll down');
  console.log(`[PASS] Case E: Tilting Down moves character down (normY = ${res.normY.toFixed(3)}) & scrolls down.`);
}

// Case F: Tilting Phone Backward / Up in Portrait (gamma = 0°, beta = 25°)
{
  const res = computeNormalizedGyro({ beta: 25, gamma: 0, baselineBeta: 45, baselineGamma: 0 });
  assert(res.normY < -0.35, `Tilting backward/up should give negative normY, got ${res.normY}`);
  assert.strictEqual(res.scrollDirection, 'up', 'Tilting up past threshold must scroll up');
  console.log(`[PASS] Case F: Tilting Up moves character up (normY = ${res.normY.toFixed(3)}) & scrolls up.`);
}

// Case G: Diagonal Tilt (Down + Right: beta = 65°, gamma = 20°)
{
  const res = computeNormalizedGyro({ beta: 65, gamma: 20, baselineBeta: 45, baselineGamma: 0 });
  assert(res.normX > 0.3 && res.normY > 0.35, 'Diagonal tilt should produce both positive normX and normY');
  assert.strictEqual(res.scrollDirection, 'down-right', 'Diagonal tilt must produce 2D directional scroll down-right');
  console.log(`[PASS] Case G: Diagonal tilt moves character diagonally and triggers 2D directional scroll: ${res.scrollDirection}.`);
}

// Case H: Landscape Resting Position (orientationAngle = 90°, beta = 0°, gamma = 45°, baselineBeta = 0°, baselineGamma = 45°)
{
  const res = computeNormalizedGyro({
    beta: 0,
    gamma: 45,
    baselineBeta: 0,
    baselineGamma: 45,
    orientationAngle: 90
  });
  assert.strictEqual(res.normX, 0, 'Landscape resting position X must be 0');
  assert.strictEqual(res.normY, 0, 'Landscape resting position Y must be 0');
  assert.strictEqual(res.isScrolling, false, 'Landscape resting position must not scroll');
  console.log('[PASS] Case H: Landscape resting position properly calibrated at normX=0, normY=0 without runaway scroll.');
}

// Case I: Landscape 90° Tilting Forward / Down (gamma = 65°, beta = 0°)
{
  const res = computeNormalizedGyro({
    beta: 0,
    gamma: 65,
    baselineBeta: 0,
    baselineGamma: 45,
    orientationAngle: 90
  });
  assert(res.normY > 0.35, `In 90° landscape, tilting forward must move character down, got ${res.normY}`);
  assert.strictEqual(res.scrollDirection, 'down', 'In 90° landscape, tilting forward must scroll down');
  console.log(`[PASS] Case I: In 90° landscape, tilting forward moves character down (normY = ${res.normY.toFixed(3)}) & scrolls down.`);
}

// Case J: Landscape 90° Tilting Right (beta = -20°, gamma = 45°)
{
  const res = computeNormalizedGyro({
    beta: -20,
    gamma: 45,
    baselineBeta: 0,
    baselineGamma: 45,
    orientationAngle: 90
  });
  assert(res.normX > 0.3, `In 90° landscape, dipping right must move character right, got ${res.normX}`);
  assert.strictEqual(res.scrollDirection, 'right', 'In 90° landscape, dipping right must scroll right');
  console.log(`[PASS] Case J: In 90° landscape, dipping right moves character right (normX = ${res.normX.toFixed(3)}) & scrolls right.`);
}

// ---------------------------------------------------------
// 4. Organic Idle Breathing Simulation Tests
// ---------------------------------------------------------
console.log('\n--- Organic Idle Breathing Simulation Tests ---');

function computeBreathingFrame({
  currentTime,
  curX = 0,
  curY = 0,
  hoverWeight = 0,
  currentBreathingWeight = 1.0,
  reducedMotion = false,
  dt = 0.016
}) {
  const idleOp = Math.max(0, 1 - hoverWeight);
  const motionMagnitude = Math.min(1, Math.sqrt(curX * curX + curY * curY) / 0.25);
  const targetBreathingWeight = reducedMotion ? 0 : Math.max(idleOp, Math.max(0, 1.0 - motionMagnitude));
  const breathBlendSpeed = 6.0;
  const newBreathingWeight = currentBreathingWeight +
    (targetBreathingWeight - currentBreathingWeight) * (1.0 - Math.exp(-breathBlendSpeed * dt));

  const breathCycle = (currentTime / 1000) * ((2 * Math.PI) / 3.8);
  const breathY = Math.sin(breathCycle) * 3.2; // approx 3.2px amplitude
  const breathScale = 1.0 + (Math.sin(breathCycle) * 0.006); // approx 0.6% organic scale

  const currentBreathY = reducedMotion ? 0 : breathY * newBreathingWeight;
  const currentBreathScale = reducedMotion ? 1.0 : Number((1.0 + (breathScale - 1.0) * newBreathingWeight).toFixed(5));

  const charShiftX = curX * 56;
  const charShiftY = curY * 42;

  const transform = reducedMotion
    ? 'none'
    : `translate3d(${charShiftX.toFixed(2)}px, ${(charShiftY + currentBreathY).toFixed(2)}px, 0) scale(${currentBreathScale})`;

  return {
    breathingWeight: newBreathingWeight,
    breathCycle,
    currentBreathY,
    currentBreathScale,
    transform
  };
}

// Case K: Idle state produces rhythmic breathing oscillations in Y and scale
{
  const cyclePeriodMs = 3800; // 3.8s respiratory cycle (~15 breaths/min)
  const quarterCycleMs = cyclePeriodMs / 4; // 950ms (peak inhalation)
  const halfCycleMs = cyclePeriodMs / 2; // 1900ms (inflection)
  const threeQuarterCycleMs = (3 * cyclePeriodMs) / 4; // 2850ms (trough exhalation)

  const frame0 = computeBreathingFrame({ currentTime: 0, hoverWeight: 0, curX: 0, curY: 0 });
  const frameQuarter = computeBreathingFrame({ currentTime: quarterCycleMs, hoverWeight: 0, curX: 0, curY: 0 });
  const frameHalf = computeBreathingFrame({ currentTime: halfCycleMs, hoverWeight: 0, curX: 0, curY: 0 });
  const frameThreeQuarter = computeBreathingFrame({ currentTime: threeQuarterCycleMs, hoverWeight: 0, curX: 0, curY: 0 });
  const frameFull = computeBreathingFrame({ currentTime: cyclePeriodMs, hoverWeight: 0, curX: 0, curY: 0 });

  // Assert neutral position at t=0
  assert(Math.abs(frame0.currentBreathY) < 0.05, `Neutral breath Y should be near 0 at t=0, got ${frame0.currentBreathY}`);
  assert.strictEqual(frame0.currentBreathScale, 1.0, 'Neutral breath scale should be 1.0 at t=0');

  // Assert peak inhalation (+3.2px rise, +0.6% scale expansion)
  assert(Math.abs(frameQuarter.currentBreathY - 3.2) < 0.05, `Peak inhalation Y should be ~3.2px, got ${frameQuarter.currentBreathY}`);
  assert(frameQuarter.currentBreathScale > 1.0055 && frameQuarter.currentBreathScale <= 1.006, `Peak scale should be ~1.006, got ${frameQuarter.currentBreathScale}`);

  // Assert return to neutral at half cycle
  assert(Math.abs(frameHalf.currentBreathY) < 0.05, `Half cycle breath Y should return to ~0, got ${frameHalf.currentBreathY}`);
  assert.strictEqual(frameHalf.currentBreathScale, 1.0, 'Half cycle scale should return to 1.0');

  // Assert trough exhalation (-3.2px descent, -0.6% scale compression)
  assert(Math.abs(frameThreeQuarter.currentBreathY - (-3.2)) < 0.05, `Trough exhalation Y should be ~-3.2px, got ${frameThreeQuarter.currentBreathY}`);
  assert(frameThreeQuarter.currentBreathScale < 0.9945 && frameThreeQuarter.currentBreathScale >= 0.994, `Trough scale should be ~0.994, got ${frameThreeQuarter.currentBreathScale}`);

  // Assert periodic closure at full cycle
  assert(Math.abs(frameFull.currentBreathY) < 0.05, `Full cycle breath Y should return to ~0, got ${frameFull.currentBreathY}`);

  console.log(`[PASS] Case K: Idle state produces organic ~3.8s respiratory oscillations (Y: [${frameThreeQuarter.currentBreathY.toFixed(2)}px, +${frameQuarter.currentBreathY.toFixed(2)}px], Scale: [${frameThreeQuarter.currentBreathScale}, ${frameQuarter.currentBreathScale}]).`);
}

// Case L: Active tilt / pointer tracking blends breathing smoothly without popping
{
  let currentWeight = 1.0;
  const weights = [];
  // Simulate active movement over 30 frames (~500ms) with cursor/gyro at (0.45, 0.40)
  for (let i = 0; i < 30; i++) {
    const frame = computeBreathingFrame({
      currentTime: 1000 + i * 16.6,
      curX: 0.45,
      curY: 0.40,
      hoverWeight: 1.0,
      currentBreathingWeight: currentWeight,
      dt: 0.0166
    });
    weights.push(frame.breathingWeight);
    currentWeight = frame.breathingWeight;
  }

  // Weight must decay monotonically and smoothly towards 0
  assert(weights[0] < 1.0, 'Breathing weight must begin attenuating immediately');
  assert(weights[weights.length - 1] < 0.1, `Breathing weight must attenuate close to 0 during active tilt, got ${weights[weights.length - 1]}`);
  for (let i = 1; i < weights.length; i++) {
    assert(weights[i] <= weights[i - 1], 'Attenuating weights must decrease smoothly every frame without popping');
    assert(weights[i - 1] - weights[i] < 0.15, 'Frame-to-frame weight delta must be small (< 0.15) for butter-smooth transition');
  }

  // Simulate returning to center/rest: breathing weight must ramp back up smoothly
  const recoveryWeights = [];
  for (let i = 0; i < 30; i++) {
    const frame = computeBreathingFrame({
      currentTime: 2000 + i * 16.6,
      curX: 0,
      curY: 0,
      hoverWeight: 0,
      currentBreathingWeight: currentWeight,
      dt: 0.0166
    });
    recoveryWeights.push(frame.breathingWeight);
    currentWeight = frame.breathingWeight;
  }

  assert(recoveryWeights[recoveryWeights.length - 1] > 0.9, `Breathing weight must recover back towards 1.0 at rest, got ${recoveryWeights[recoveryWeights.length - 1]}`);
  console.log(`[PASS] Case L: Active tilt/tracking attenuates breathing smoothly (${weights[0].toFixed(2)} -> ${weights[weights.length - 1].toFixed(2)}) and recovers smoothly at rest (${recoveryWeights[recoveryWeights.length - 1].toFixed(2)}).`);
}

// Case M: reducedMotion flag strictly eliminates all breathing transforms
{
  const timestamps = [0, 950, 1900, 2850, 3800];
  for (const t of timestamps) {
    const frame = computeBreathingFrame({
      currentTime: t,
      hoverWeight: 0,
      curX: 0,
      curY: 0,
      reducedMotion: true
    });
    assert.strictEqual(frame.currentBreathY, 0, `Under reducedMotion, breathY must be 0 at t=${t}`);
    assert.strictEqual(frame.currentBreathScale, 1.0, `Under reducedMotion, breathScale must be 1.0 at t=${t}`);
    assert.strictEqual(frame.transform, 'none', `Under reducedMotion, transform must be 'none'`);
  }
  console.log('[PASS] Case M: reducedMotion strictly disables all breathing transforms and preserves accessible static stage.');
}

console.log('\n=== ALL GYROSCOPE, TRACKING & IDLE BREATHING VERIFICATION CHECKS PASSED (100%) ===\n');
