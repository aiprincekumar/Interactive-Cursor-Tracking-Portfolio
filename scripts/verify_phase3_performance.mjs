import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

console.log('========================================================================');
console.log('  VERIFYING PHASE 3: CANVAS CURSORS & rAF IDLE POOLS IMPLEMENTATION     ');
console.log('========================================================================\n');

const rootDir = process.cwd();
let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(`   ${err.message}`);
    failCount++;
  }
}

// -----------------------------------------------------------------------------
// Suite 1: AirplaneCursor.jsx Static Pool & Idle Sleep Mode
// -----------------------------------------------------------------------------
console.log('--- Suite 1: AirplaneCursor.jsx Verification ---');
const airplanePath = path.join(rootDir, 'src/components/cursors/AirplaneCursor.jsx');
const airplaneSrc = fs.readFileSync(airplanePath, 'utf8');

test('AirplaneCursor declares MAX_PARTICLES = 75', () => {
  assert(airplaneSrc.includes('const MAX_PARTICLES = 75;'), 'MAX_PARTICLES must be 75');
});

test('AirplaneCursor initializes a static particle pool with active flags', () => {
  assert(airplaneSrc.includes('function createAirplaneParticlePool()'), 'createAirplaneParticlePool function must exist');
  assert(airplaneSrc.includes('pool[i] = {'), 'Pool must initialize static objects');
  assert(airplaneSrc.includes('active: false'), 'Pool objects must have active: false default');
});

test('AirplaneCursor frame loop contains ZERO push() or splice() calls', () => {
  // Extract loop function
  const loopMatch = airplaneSrc.match(/const loop = \([\s\S]*?\n    \};/);
  assert(loopMatch, 'loop function must be defined');
  const loopBody = loopMatch[0];
  assert(!loopBody.includes('.push('), 'loop body must not call push()');
  assert(!loopBody.includes('.splice('), 'loop body must not call splice()');
});

test('AirplaneCursor implements idle sleep mode and skips clearRect when stationary', () => {
  assert(airplaneSrc.includes('const isDirty = activeCount > 0 || isCanvasDirtyRef.current;'), 'isDirty check must gate clearRect');
  assert(airplaneSrc.includes('if (isDirty) {'), 'ctx.clearRect must be guarded by isDirty');
  assert(airplaneSrc.includes('distance < 0.2') && airplaneSrc.includes('activeCount === 0'), 'Idle sleep condition must check distance and activeCount');
  assert(airplaneSrc.includes('isRunning = false'), 'Sleep mode must set isRunning to false');
  assert(airplaneSrc.includes('animationFrameId = null'), 'Sleep mode must clear animationFrameId');
});

test('AirplaneCursor wakes up cleanly on pointermove, touchmove, pointerenter, and pointerdown', () => {
  assert(airplaneSrc.includes('startLoop();'), 'startLoop must be called to wake from idle');
  assert(airplaneSrc.includes("window.addEventListener('pointermove', handlePointerMove"), 'Must listen for pointermove');
  assert(airplaneSrc.includes("window.addEventListener('touchmove', handlePointerMove"), 'Must listen for touchmove');
  assert(airplaneSrc.includes("window.addEventListener('pointerdown', handlePointerDown"), 'Must listen for pointerdown');
  assert(airplaneSrc.includes("document.addEventListener('mouseenter', handlePointerEnter"), 'Must listen for mouseenter');
});

// -----------------------------------------------------------------------------
// Suite 2: StardustCursor.jsx Static Pool & Idle Sleep Mode
// -----------------------------------------------------------------------------
console.log('\n--- Suite 2: StardustCursor.jsx Verification ---');
const stardustPath = path.join(rootDir, 'src/components/cursors/StardustCursor.jsx');
const stardustSrc = fs.readFileSync(stardustPath, 'utf8');

test('StardustCursor declares MAX_PARTICLES = 75', () => {
  assert(stardustSrc.includes('const MAX_PARTICLES = 75;'), 'MAX_PARTICLES must be 75');
});

test('StardustCursor initializes a static particle pool with active flags', () => {
  assert(stardustSrc.includes('function createStardustParticlePool()'), 'createStardustParticlePool function must exist');
  assert(stardustSrc.includes('active: false'), 'Pool objects must have active: false default');
});

test('StardustCursor frame loop contains ZERO push() or splice() calls', () => {
  const loopMatch = stardustSrc.match(/const loop = \([\s\S]*?\n    \};/);
  assert(loopMatch, 'loop function must be defined');
  const loopBody = loopMatch[0];
  assert(!loopBody.includes('.push('), 'loop body must not call push()');
  assert(!loopBody.includes('.splice('), 'loop body must not call splice()');
});

test('StardustCursor implements idle sleep mode and skips clearRect when stationary', () => {
  assert(stardustSrc.includes('const isDirty = activeCount > 0 || isCanvasDirtyRef.current;'), 'isDirty check must gate clearRect');
  assert(stardustSrc.includes('if (isDirty) {'), 'ctx.clearRect must be guarded by isDirty');
  assert(stardustSrc.includes('distance < 0.2') && stardustSrc.includes('activeCount === 0'), 'Idle sleep condition must check distance and activeCount');
  assert(stardustSrc.includes('isRunning = false'), 'Sleep mode must set isRunning to false');
  assert(stardustSrc.includes('animationFrameId = null'), 'Sleep mode must clear animationFrameId');
});

test('StardustCursor wakes up cleanly on pointer events', () => {
  assert(stardustSrc.includes('startLoop();'), 'startLoop must be called to wake up');
  assert(stardustSrc.includes("window.addEventListener('pointermove', handlePointerMove"), 'Must listen for pointermove');
  assert(stardustSrc.includes("window.addEventListener('touchmove', handlePointerMove"), 'Must listen for touchmove');
  assert(stardustSrc.includes("window.addEventListener('pointerdown', handlePointerDown"), 'Must listen for pointerdown');
  assert(stardustSrc.includes("document.addEventListener('mouseenter', handlePointerEnter"), 'Must listen for mouseenter');
});

// -----------------------------------------------------------------------------
// Suite 3: LaserCursor.jsx Circular Ring Buffer
// -----------------------------------------------------------------------------
console.log('\n--- Suite 3: LaserCursor.jsx Verification ---');
const laserPath = path.join(rootDir, 'src/components/cursors/LaserCursor.jsx');
const laserSrc = fs.readFileSync(laserPath, 'utf8');

test('LaserCursor implements 24-slot circular ring buffer with modulo indexing', () => {
  assert(laserSrc.includes('const HISTORY_CAPACITY = 24;') || laserSrc.includes('24'), 'Ring buffer capacity must be 24');
  assert(laserSrc.includes('history: Array.from({ length: HISTORY_CAPACITY }') || laserSrc.includes('length: HISTORY_CAPACITY'), 'History array pre-allocated');
  assert(laserSrc.includes('% HISTORY_CAPACITY'), 'Must use modulo indexing for circular head');
});

test('LaserCursor eliminates unshift() and pop()', () => {
  assert(!laserSrc.includes('.unshift('), 'LaserCursor must never call unshift()');
  assert(!laserSrc.includes('.history.pop()'), 'LaserCursor must never call history.pop()');
  assert(!laserSrc.includes('state.history.unshift'), 'No history unshift');
});

// -----------------------------------------------------------------------------
// Suite 4: CameraCursor.jsx Cached Ref Optimization
// -----------------------------------------------------------------------------
console.log('\n--- Suite 4: CameraCursor.jsx Verification ---');
const cameraPath = path.join(rootDir, 'src/components/cursors/CameraCursor.jsx');
const cameraSrc = fs.readFileSync(cameraPath, 'utf8');

test('CameraCursor caches focusRingRef and avoids querySelector in frame loop', () => {
  assert(cameraSrc.includes('const focusRingRef = useRef(null);'), 'focusRingRef must be declared');
  assert(cameraSrc.includes('ref={focusRingRef}'), 'focusRingRef must be attached to focus ring JSX element');
  assert(!cameraSrc.includes("querySelector('.focus-ring')"), "querySelector('.focus-ring') must be completely removed");
  assert(cameraSrc.includes('focusRingRef.current'), 'focusRingRef.current must be referenced in frame updates');
});

// -----------------------------------------------------------------------------
// Suite 5: ButterflyCursor.jsx Flutter Deadband Check
// -----------------------------------------------------------------------------
console.log('\n--- Suite 5: ButterflyCursor.jsx Verification ---');
const butterflyPath = path.join(rootDir, 'src/components/ButterflyCursor.jsx');
const butterflySrc = fs.readFileSync(butterflyPath, 'utf8');

test('ButterflyCursor contains deadband check (> 0.015) for --flutter-duration', () => {
  assert(
    butterflySrc.includes('Math.abs(state.flutterDuration - state.lastFlutterDuration) > 0.015'),
    'Deadband check for flutter duration with 0.015 threshold must exist'
  );
  assert(butterflySrc.includes("b.style.setProperty('--flutter-duration'"), 'setProperty must be guarded inside deadband check');
  assert(butterflySrc.includes('state.lastFlutterDuration = state.flutterDuration;'), 'lastFlutterDuration must update inside deadband check');
});

// -----------------------------------------------------------------------------
// Suite 6: useGyroscopeTracking.js Desktop Hardware Guard
// -----------------------------------------------------------------------------
console.log('\n--- Suite 6: useGyroscopeTracking.js Verification ---');
const gyroPath = path.join(rootDir, 'src/hooks/useGyroscopeTracking.js');
const gyroSrc = fs.readFileSync(gyroPath, 'utf8');

test('useGyroscopeTracking halts or skips continuous scrollTick rAF when unsupported and simulation is inactive', () => {
  assert(
    gyroSrc.includes('if (!isSupported && !gyroStateRef.current.isSimulatedTracking) return;'),
    'Early return guard before starting scrollTick rAF loop must exist'
  );
  assert(
    gyroSrc.includes('if (!isSupported && !state.isSimulatedTracking) {') && gyroSrc.includes('rafId = null;') && gyroSrc.includes('return;'),
    'In-loop guard halting continuous rAF when unsupported and simulation inactive must exist'
  );
});

// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------
console.log('\n========================================================================');
console.log(`TOTAL AUDIT CHECKS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('========================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🌟 ALL PHASE 3 CANVAS CURSORS & rAF IDLE POOLS AUDIT CHECKS PASSED (100%)! 🌟\n');
}
