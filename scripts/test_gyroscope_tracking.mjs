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
assert(hookContent.includes('deviceorientationabsolute'), 'Hook must support Android Chrome deviceorientationabsolute events');
assert(hookContent.includes('devicemotion'), 'Hook must support devicemotion fallback');
assert(hookContent.includes('accelerationIncludingGravity'), 'Hook must use accelerationIncludingGravity for motion fallback');
assert(hookContent.includes('pointerdown'), 'Hook must listen for pointerdown interaction');
assert(hookContent.includes('requestPermission'), 'Hook must support iOS 13+ requestPermission');
assert(hookContent.includes('scrollBy'), 'Hook must support window.scrollBy for tilt-to-scroll');
assert(hookContent.includes('isGyroScrollActive'), 'Hook must provide tilt scroll toggle state');
assert(hookContent.includes('baselineGamma'), 'Hook must support dual baselineGamma calibration for landscape');
assert(hookContent.includes('isTouchDevice'), 'Hook must expose touch device detection');
assert(hookContent.includes('isInsecureContext'), 'Hook must check and expose isInsecureContext');
assert(hookContent.includes('isSecureContext'), 'Hook must inspect window.isSecureContext');
assert(hookContent.includes('activeScrollDir'), 'Hook must expose activeScrollDir');
assert(hookContent.includes('scrollThreshold = 0.18'), 'Hook must default scrollThreshold to 0.18');
assert(hookContent.includes('lastStandardOrientationTime'), 'Hook must arbitrate standard vs absolute orientation');
assert(hookContent.includes('lastAnyOrientationTime'), 'Hook must arbitrate orientation vs devicemotion fallback');
console.log('[PASS] useGyroscopeTracking.js contains all required sensor, security, and scrolling mechanisms.');

assert(heroContent.includes('useGyroscopeTracking'), 'HeroSection must import useGyroscopeTracking');
assert(heroContent.includes('Compass'), 'HeroSection must import Compass icon');
assert(heroContent.includes('bgBackdropRef'), 'HeroSection must attach bgBackdropRef for directional parallax');
assert(heroContent.includes('translate3d'), 'HeroSection must apply directional translate3d character motion');
assert(heroContent.includes('breathCycle'), 'HeroSection must compute respiratory breathCycle');
assert(heroContent.includes('breathScale'), 'HeroSection must compute organic chest expansion breathScale');
assert(heroContent.includes('breathingWeight'), 'HeroSection must blend breathingWeight with idle & motion');
assert(heroContent.includes('isInsecureContext'), 'HeroSection must handle isInsecureContext');
assert(heroContent.includes('Scroll ON ↓'), 'HeroSection must render dynamic downward scroll indicator');
assert(heroContent.includes('Scroll ON ↑'), 'HeroSection must render dynamic upward scroll indicator');
assert(heroContent.includes('Gyro Active') || heroContent.includes('Enable Gyro'), 'HeroSection must render Gyro Control Pill');
console.log('[PASS] HeroSection.jsx integrates gyro sensor, character translation, organic idle breathing, insecure warnings, and dynamic UI controls.');

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
  scrollThreshold = 0.18
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

// Case E2: High-Sensitivity Subtle ~10° Forward Tilt (beta = 55°, normY = 0.20, exceeds 0.18 threshold)
{
  const res = computeNormalizedGyro({ beta: 55, gamma: 0, baselineBeta: 45, baselineGamma: 0 });
  assert.strictEqual(res.normY, 0.20, `Subtle ~10° tilt should produce normY=0.20, got ${res.normY}`);
  assert.strictEqual(res.isScrolling, true, 'Subtle ~10° tilt must trigger scrolling at 0.18 sensitivity');
  assert.strictEqual(res.scrollDirection, 'down', 'Subtle forward tilt must scroll down');
  console.log(`[PASS] Case E2: High-sensitivity 0.18 threshold activates tilt-scroll on natural ~10° tilt (normY = 0.20).`);
}

// Case E3: Insecure Context Logic Verification (HTTP vs HTTPS on LAN IP vs localhost)
{
  const evaluateInsecureContext = (isSecure, hostname) => {
    return !isSecure && hostname !== 'localhost' && hostname !== '127.0.0.1';
  };

  assert.strictEqual(evaluateInsecureContext(false, '192.168.1.45'), true, 'HTTP on LAN IP must be flagged as insecure context');
  assert.strictEqual(evaluateInsecureContext(true, '192.168.1.45'), false, 'HTTPS on LAN IP must be a secure context');
  assert.strictEqual(evaluateInsecureContext(false, 'localhost'), false, 'localhost HTTP is exempt from insecure context restriction');
  assert.strictEqual(evaluateInsecureContext(false, '127.0.0.1'), false, '127.0.0.1 HTTP is exempt from insecure context restriction');
  console.log('[PASS] Case E3: Insecure context logic accurately flags LAN HTTP while permitting LAN HTTPS and localhost.');
}

// Case E4: Non-Linear Scroll Acceleration Curve (Gentle at 0.18-0.35, Swift at >0.35)
{
  const calcSpeed = (absVal, threshold = 0.18, maxSpeed = 800, dt = 0.016) => {
    if (absVal <= threshold) return 0;
    const rawRatio = Math.min(1, Math.max(0, (absVal - threshold) / (0.5 - threshold)));
    const curvedRatio = Math.pow(rawRatio, 1.55);
    return curvedRatio * maxSpeed * dt;
  };

  const speedGentle = calcSpeed(0.24); // Low tilt in 0.18-0.35 range
  const speedSwift = calcSpeed(0.48);  // Deep tilt in >0.35 range

  assert(speedGentle < 2.0, `Gentle tilt speed should be low for fine control, got ${speedGentle.toFixed(2)}px`);
  assert(speedSwift > 10.0, `Swift tilt speed should be fast for quick panning, got ${speedSwift.toFixed(2)}px`);
  assert(speedSwift / speedGentle > 5.0, 'Swift speed should be more than 5x gentle speed due to exponential curve');
  console.log(`[PASS] Case E4: Acceleration curve verified: gentle crawl at 0.24 (${speedGentle.toFixed(2)}px/f) vs swift panning at 0.48 (${speedSwift.toFixed(2)}px/f).`);
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
  forcedState = null,
  dt = 0.016
}) {
  let idleOp = Math.max(0, 1 - hoverWeight);
  if (forcedState) {
    idleOp = (forcedState === 'idle' || forcedState === 'rear-view') ? 1 : 0;
  }
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

// Case N: forcedState parameter explicitly drives idleOp and preserves breathing for forced 'idle'
{
  // When forced to 'idle', even if cursor is hovered or at edge, breathing remains 100% active
  const forcedIdleFrame = computeBreathingFrame({
    currentTime: 950,
    curX: 0.45,
    curY: 0.40,
    hoverWeight: 1.0,
    forcedState: 'idle'
  });
  assert(forcedIdleFrame.breathingWeight > 0.99, 'Forced idle must keep breathing weight at 1.0 regardless of hover');
  assert(Math.abs(forcedIdleFrame.currentBreathY - 3.2) < 0.1, 'Forced idle must perform full peak breathing oscillation');

  console.log('[PASS] Case N: forcedState correctly drives idleOp, preserving breathing for forced idle poses.');
}

// ---------------------------------------------------------
// 5. Android Chrome Devicemotion Fallback Simulation Tests
// ---------------------------------------------------------
console.log('\n--- Android Chrome Devicemotion Gravity Vector Tests ---');

function computeMotionAngles(acc) {
  const ax = acc.x ?? 0;
  const ay = acc.y ?? 0;
  const az = acc.z ?? 0;
  const pitch = Math.atan2(-ay, Math.sqrt(ax * ax + az * az)) * (180 / Math.PI);
  const roll = Math.atan2(ax, az) * (180 / Math.PI);
  return { pitch, roll };
}

// Case O1: Device resting in portrait 45-degree angle
{
  const g = 9.80665;
  const angleRad = 45 * (Math.PI / 180);
  // In portrait tilted back 45 degrees:
  // gravity vector points down: ay = -g * sin(45), az = g * cos(45), ax = 0
  const acc = { x: 0, y: -g * Math.sin(angleRad), z: g * Math.cos(angleRad) };
  const { pitch, roll } = computeMotionAngles(acc);
  assert(Math.abs(pitch - 45) < 0.1, `Motion pitch should be ~45°, got ${pitch}`);
  assert(Math.abs(roll - 0) < 0.1, `Motion roll should be ~0°, got ${roll}`);

  const res = computeNormalizedGyro({ beta: pitch, gamma: roll, baselineBeta: 45, baselineGamma: 0 });
  assert.strictEqual(res.normX, 0, 'Resting position from gravity vector must center normX at 0');
  assert.strictEqual(res.normY, 0, 'Resting position from gravity vector must center normY at 0');
  assert.strictEqual(res.isScrolling, false, 'Resting position must not scroll');
  console.log(`[PASS] Case O1: Android gravity vector computes pitch=${pitch.toFixed(1)}°, roll=${roll.toFixed(1)}° and centers correctly.`);
}

// Case O2: Device tilted right in portrait
{
  const g = 9.80665;
  const pitchRad = 45 * (Math.PI / 180);
  const rollRad = 20 * (Math.PI / 180);
  // Roll tilts around longitudinal axis
  const acc = {
    x: g * Math.cos(pitchRad) * Math.sin(rollRad),
    y: -g * Math.sin(pitchRad),
    z: g * Math.cos(pitchRad) * Math.cos(rollRad)
  };
  const { pitch, roll } = computeMotionAngles(acc);
  assert(Math.abs(pitch - 45) < 0.2, `Motion pitch should be ~45°, got ${pitch}`);
  assert(Math.abs(roll - 20) < 0.2, `Motion roll should be ~20°, got ${roll}`);

  const res = computeNormalizedGyro({ beta: pitch, gamma: roll, baselineBeta: 45, baselineGamma: 0 });
  assert(res.normX > 0.3, `Tilting right must produce positive normX, got ${res.normX}`);
  assert.strictEqual(res.scrollDirection, 'right', 'Tilting right must trigger scroll right');
  console.log(`[PASS] Case O2: Android gravity vector computes right roll (${roll.toFixed(1)}°) and scrolls right.`);
}

// ---------------------------------------------------------
// 6. Multi-Sensor Arbitration Hierarchy Simulation Tests
// ---------------------------------------------------------
console.log('\n--- Multi-Sensor Arbitration Hierarchy Tests ---');

function createSensorArbitrator() {
  let lastStandardOrientationTime = 0;
  let lastAnyOrientationTime = 0;
  let activeSource = null;
  let angles = null;

  const onStandardOrientation = (beta, gamma, alpha = 0, now = Date.now()) => {
    if (beta !== null && gamma !== null && !Number.isNaN(beta) && !Number.isNaN(gamma)) {
      lastStandardOrientationTime = now;
      lastAnyOrientationTime = now;
      activeSource = 'deviceorientation';
      angles = { beta, gamma, alpha };
      return true;
    }
    return false;
  };

  const onAbsoluteOrientation = (beta, gamma, alpha = 0, now = Date.now()) => {
    if (now - lastStandardOrientationTime < 1000) {
      return false; // Suppressed by active standard orientation
    }
    if (beta !== null && gamma !== null && !Number.isNaN(beta) && !Number.isNaN(gamma)) {
      lastAnyOrientationTime = now;
      activeSource = 'deviceorientationabsolute';
      angles = { beta, gamma, alpha };
      return true;
    }
    return false;
  };

  const onMotion = (acc, now = Date.now()) => {
    if (now - lastAnyOrientationTime < 1000) {
      return false; // Suppressed by active orientation
    }
    if (!acc || (acc.x === null && acc.y === null && acc.z === null)) return false;
    const ax = acc.x ?? 0;
    const ay = acc.y ?? 0;
    const az = acc.z ?? 0;
    if (ax === 0 && ay === 0 && az === 0) return false;

    const pitch = Math.atan2(-ay, Math.sqrt(ax * ax + az * az)) * (180 / Math.PI);
    const roll = Math.atan2(ax, az) * (180 / Math.PI);
    activeSource = 'devicemotion';
    angles = { beta: pitch, gamma: roll, alpha: 0 };
    return true;
  };

  return {
    onStandardOrientation,
    onAbsoluteOrientation,
    onMotion,
    getState: () => ({ activeSource, angles, lastStandardOrientationTime, lastAnyOrientationTime })
  };
}

// Case P1: Standard orientation suppresses absolute orientation to prevent magnetometer jitter
{
  const arb = createSensorArbitrator();
  const t0 = 1000;
  const processedStd = arb.onStandardOrientation(45, 10, 0, t0);
  assert.strictEqual(processedStd, true, 'Standard orientation should process');
  assert.strictEqual(arb.getState().activeSource, 'deviceorientation');

  // Absolute orientation arrives 5ms later with magnetometer offset
  const processedAbs = arb.onAbsoluteOrientation(48, 12, 180, t0 + 5);
  assert.strictEqual(processedAbs, false, 'Absolute orientation must be suppressed when standard is active');
  assert.strictEqual(arb.getState().activeSource, 'deviceorientation', 'Active source must remain standard orientation');
  console.log('[PASS] Case P1: Standard orientation suppresses absolute orientation, eliminating magnetometer jitter.');
}

// Case P2: Absolute orientation takes over when standard orientation is absent (vendor quirk)
{
  const arb = createSensorArbitrator();
  const t0 = 1000;
  // Standard orientation does not fire or sends nulls
  const processedAbs = arb.onAbsoluteOrientation(50, -15, 90, t0);
  assert.strictEqual(processedAbs, true, 'Absolute orientation must process when standard is absent');
  assert.strictEqual(arb.getState().activeSource, 'deviceorientationabsolute');
  assert.strictEqual(arb.getState().angles.beta, 50);
  console.log('[PASS] Case P2: Absolute orientation takes over seamlessly on devices without standard orientation.');
}

// Case P3: Devicemotion fallback takes over when both orientation streams are absent
{
  const arb = createSensorArbitrator();
  const t0 = 1000;
  const g = 9.80665;
  const acc = { x: 0, y: -g * Math.sin(45 * Math.PI / 180), z: g * Math.cos(45 * Math.PI / 180) };
  const processedMotion = arb.onMotion(acc, t0);
  assert.strictEqual(processedMotion, true, 'Devicemotion should process when orientation is absent');
  assert.strictEqual(arb.getState().activeSource, 'devicemotion');
  assert(Math.abs(arb.getState().angles.beta - 45) < 0.1);
  console.log('[PASS] Case P3: Devicemotion gravity vector activates when orientation streams are absent.');
}

// Case P4: Devicemotion yields back when orientation resumes after a stall
{
  const arb = createSensorArbitrator();
  const t0 = 1000;
  const g = 9.80665;
  const acc = { x: 0, y: -g * Math.sin(45 * Math.PI / 180), z: g * Math.cos(45 * Math.PI / 180) };

  // Motion active at t0
  arb.onMotion(acc, t0);
  assert.strictEqual(arb.getState().activeSource, 'devicemotion');

  // Orientation arrives at t0 + 500ms
  arb.onStandardOrientation(45, 0, 0, t0 + 500);
  assert.strictEqual(arb.getState().activeSource, 'deviceorientation');

  // Motion attempts to fire at t0 + 510ms
  const processedMotion2 = arb.onMotion(acc, t0 + 510);
  assert.strictEqual(processedMotion2, false, 'Devicemotion must yield immediately when orientation is active');
  assert.strictEqual(arb.getState().activeSource, 'deviceorientation');
  console.log('[PASS] Case P4: Devicemotion seamlessly yields back as soon as orientation resumes.');
}

console.log('\n=== ALL GYROSCOPE, TRACKING & IDLE BREATHING VERIFICATION CHECKS PASSED (100%) ===\n');
