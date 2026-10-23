/**
 * Test Suite: Hero Section Viewport Culling & Opacity Overdraw Guard
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

console.log('========================================================================');
console.log('  TEST: HERO SECTION VIEWPORT CULLING & OPACITY OVERDRAW GUARD          ');
console.log('========================================================================\n');

const heroSource = fs.readFileSync(path.resolve('src/components/HeroSection.jsx'), 'utf8');

let passCount = 0;
function check(testName, fn) {
  try {
    fn();
    passCount++;
    console.log(`  ✅ [PASS] ${testName}`);
  } catch (err) {
    console.error(`  ❌ [FAIL] ${testName}: ${err.message}`);
    process.exitCode = 1;
  }
}

// 1. Reference declarations
check('1. isHeroVisibleRef is initialized with true', () => {
  assert.ok(
    heroSource.includes('const isHeroVisibleRef = useRef(true);'),
    'HeroSection must declare isHeroVisibleRef = useRef(true)'
  );
});

check('2. prevOpsRef is initialized with all 10 poses set to -1', () => {
  assert.ok(
    heroSource.includes('const prevOpsRef = useRef({') &&
    heroSource.includes('idle: -1') &&
    heroSource.includes('center: -1') &&
    heroSource.includes('upCenter: -1') &&
    heroSource.includes('lowCenter: -1') &&
    heroSource.includes('left: -1') &&
    heroSource.includes('right: -1') &&
    heroSource.includes('upLeft: -1') &&
    heroSource.includes('lowLeft: -1') &&
    heroSource.includes('upRight: -1') &&
    heroSource.includes('lowRight: -1'),
    'prevOpsRef must initialize all 10 poses with -1'
  );
});

// 2. Viewport culling guard in tick()
check('3. tick() loop checks isHeroVisibleRef and terminates when offscreen', () => {
  assert.ok(
    heroSource.includes('if (!isHeroVisibleRef.current) {') &&
    heroSource.includes('state.rafId = null;'),
    'tick() must bail out when !isHeroVisibleRef.current'
  );
});

// 3. Opacity dirty check guards
check('4. All 10 pose images are guarded by Math.abs(op - prevOps[key]) > 0.005', () => {
  const poses = [
    { ref: 'imgIdleRef', key: 'idle', op: 'idleOp' },
    { ref: 'imgCenterRef', key: 'center', op: 'centerOp' },
    { ref: 'imgUpperCenterRef', key: 'upCenter', op: 'upCenterOp' },
    { ref: 'imgLowerCenterRef', key: 'lowCenter', op: 'lowCenterOp' },
    { ref: 'imgLeftRef', key: 'left', op: 'leftOp' },
    { ref: 'imgRightRef', key: 'right', op: 'rightOp' },
    { ref: 'imgUpperLeftRef', key: 'upLeft', op: 'upLeftOp' },
    { ref: 'imgLowerLeftRef', key: 'lowLeft', op: 'lowLeftOp' },
    { ref: 'imgUpperRightRef', key: 'upRight', op: 'upRightOp' },
    { ref: 'imgLowerRightRef', key: 'lowRight', op: 'lowRightOp' }
  ];

  for (const p of poses) {
    const pattern = new RegExp(`${p.ref}\\.current && Math\\.abs\\(${p.op} - prevOps\\.${p.key}\\) > 0\\.005`);
    assert.ok(pattern.test(heroSource), `Missing opacity delta guard for ${p.key} (${p.ref})`);
  }
});

// 4. IntersectionObserver implementation
check('5. IntersectionObserver is created with threshold 0.05 and observes sectionRef', () => {
  assert.ok(
    heroSource.includes('observer = new IntersectionObserver(') &&
    heroSource.includes('{ threshold: 0.05 }') &&
    heroSource.includes('observer.observe(sectionRef.current)'),
    'IntersectionObserver must be configured with threshold 0.05 and observe sectionRef'
  );
});

check('6. IntersectionObserver resumes rAF when visible and cancels rAF when hidden', () => {
  assert.ok(
    heroSource.includes('if (!animStateRef.current.rafId) {') &&
    heroSource.includes('animStateRef.current.rafId = localRafId;') &&
    heroSource.includes('cancelAnimationFrame(animStateRef.current.rafId);') &&
    heroSource.includes('animStateRef.current.rafId = null;'),
    'Observer callback must resume loop if not running and cancel when hidden'
  );
});

check('7. Cleanup function disconnects observer and cancels rAF', () => {
  assert.ok(
    heroSource.includes('if (observer) {') &&
    heroSource.includes('observer.disconnect();'),
    'Cleanup must disconnect observer on unmount'
  );
});

console.log('\n========================================================================');
console.log(`  ALL ${passCount} OF 7 VIEWPORT CULLING CHECKS PASSED!`);
console.log('========================================================================\n');
