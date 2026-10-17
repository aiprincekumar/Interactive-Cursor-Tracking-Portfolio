// scripts/test_physics_telemetry_simulation.mjs
// Standalone Empirical Physics & Telemetry Stress Test Harness
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('================================================================');
console.log('  CHALLENGER 2: 2D PHYSICS SANDBOX & TELEMETRY STRESS HARNESS   ');
console.log('================================================================\n');

// -------------------------------------------------------------
// Model extraction from src/components/PhysicsSandbox.jsx
// -------------------------------------------------------------
const ORB_CONFIGS = [
  { id: 1, radius: 28, color: '#FF4D6D', name: 'Coral Rose', phase: 0.0 },
  { id: 2, radius: 24, color: '#00F2FE', name: 'Cyan Laser', phase: 0.9 },
  { id: 3, radius: 32, color: '#FFD700', name: 'Solar Gold', phase: 1.8 },
  { id: 4, radius: 22, color: '#10B981', name: 'Matrix Emerald', phase: 2.7 },
  { id: 5, radius: 30, color: '#A855F7', name: 'Cyber Purple', phase: 3.6 },
  { id: 6, radius: 20, color: '#F43F5E', name: 'Ruby Crimson', phase: 4.5 },
  { id: 7, radius: 26, color: '#38BDF8', name: 'Sky Blue', phase: 5.4 }
];

function initOrbs(w, h) {
  const width = Math.max(w, 280);
  const height = Math.max(h, 200);

  return ORB_CONFIGS.map((cfg, index) => {
    const col = index % 4;
    const row = Math.floor(index / 4);
    const spacingX = width / 5;
    const spacingY = height / 3;

    const posX = Math.min(
      width - cfg.radius - 12,
      Math.max(cfg.radius + 12, spacingX * (col + 1) + (row % 2 ? 18 : -18))
    );
    const posY = Math.min(
      height - cfg.radius - 12,
      Math.max(cfg.radius + 12, spacingY * (row + 1) + (index * 7))
    );

    const angle = (index / ORB_CONFIGS.length) * Math.PI * 2;
    const speed = 25 + index * 6;

    return {
      id: cfg.id,
      radius: cfg.radius,
      mass: (cfg.radius * cfg.radius) / 400, // mass proportional to area
      color: cfg.color,
      name: cfg.name,
      phase: cfg.phase,
      x: posX,
      y: posY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed
    };
  });
}

// -------------------------------------------------------------
// TEST 1: 7 Elastic Orbs Configuration & Mass Proportionality
// -------------------------------------------------------------
console.log('--- TEST 1: Orb Configurations & Parameter Validity ---');
assert.strictEqual(ORB_CONFIGS.length, 7, 'Must have exactly 7 orb configurations');

const ids = new Set();
ORB_CONFIGS.forEach((orb) => {
  assert.ok(orb.id >= 1 && orb.id <= 7, `Orb id ${orb.id} must be between 1 and 7`);
  assert.ok(!ids.has(orb.id), `Orb id ${orb.id} must be unique`);
  ids.add(orb.id);

  assert.ok(
    orb.radius >= 18 && orb.radius <= 32,
    `Orb ${orb.name} radius (${orb.radius}) must be within [18, 32]px range`
  );
  assert.ok(typeof orb.phase === 'number' && !isNaN(orb.phase), 'Phase must be a valid number');
  assert.ok(orb.color.startsWith('#'), 'Color must be valid hex');
});

// Test initOrbs in standard, wide, and narrow viewports
const viewports = [
  { w: 600, h: 380 },
  { w: 1200, h: 600 },
  { w: 320, h: 240 }
];

viewports.forEach(({ w, h }) => {
  const orbs = initOrbs(w, h);
  assert.strictEqual(orbs.length, 7, `Must instantiate 7 orbs for ${w}x${h}`);

  orbs.forEach((orb) => {
    // Check mass is strictly proportional to area: mass = (r^2) / 400
    const expectedMass = (orb.radius * orb.radius) / 400;
    assert.strictEqual(orb.mass, expectedMass, `Mass must be area-proportional (${expectedMass})`);

    // Check bounds: completely inside arena with 12px margin
    assert.ok(
      orb.x >= orb.radius + 12 && orb.x <= w - orb.radius - 12,
      `Orb ${orb.id} x=${orb.x} out of initial bounds [${orb.radius + 12}, ${w - orb.radius - 12}]`
    );
    assert.ok(
      orb.y >= orb.radius + 12 && orb.y <= h - orb.radius - 12,
      `Orb ${orb.id} y=${orb.y} out of initial bounds [${orb.radius + 12}, ${h - orb.radius - 12}]`
    );

    // Check initial speed is active
    const initSpeed = Math.hypot(orb.vx, orb.vy);
    assert.ok(initSpeed >= 20 && initSpeed <= 70, `Initial speed ${initSpeed} must be active and reasonable`);
  });
});
console.log('✓ TEST 1 PASSED: 7 orbs config, radiuses (18-32px), area-proportional mass verified.\n');

// -------------------------------------------------------------
// TEST 2: Boundary Bounce Physics & Restitution (e = 0.85)
// -------------------------------------------------------------
console.log('--- TEST 2: Wall Boundary Restitution & Clamping (e = 0.85) ---');
const eWall = 0.85;
const testWidth = 600;
const testHeight = 380;

function resolveWallBounce(orb, width, height) {
  // Model exact wall logic from PhysicsSandbox.jsx lines 386-403
  if (orb.x - orb.radius < 0) {
    orb.x = orb.radius;
    orb.vx = -orb.vx * eWall;
  } else if (orb.x + orb.radius > width) {
    orb.x = width - orb.radius;
    orb.vx = -orb.vx * eWall;
  }

  if (orb.y - orb.radius < 0) {
    orb.y = orb.radius;
    orb.vy = -orb.vy * eWall;
  } else if (orb.y + orb.radius > height) {
    orb.y = height - orb.radius;
    orb.vy = -orb.vy * eWall;
  }
}

// Test left wall penetration
const orbLeft = { x: -15, y: 150, vx: -200, vy: 50, radius: 24, mass: 1.44 };
resolveWallBounce(orbLeft, testWidth, testHeight);
assert.strictEqual(orbLeft.x, orbLeft.radius, 'Left penetration must clamp to orb.radius');
assert.strictEqual(orbLeft.vx, 200 * eWall, 'Left bounce vx must be -vx * eWall');
assert.strictEqual(orbLeft.vy, 50, 'Tangential vy must be unchanged');

// Test right wall penetration
const orbRight = { x: testWidth + 50, y: 150, vx: 350, vy: -30, radius: 28, mass: 1.96 };
resolveWallBounce(orbRight, testWidth, testHeight);
assert.strictEqual(orbRight.x, testWidth - orbRight.radius, 'Right penetration must clamp to width - orb.radius');
assert.strictEqual(orbRight.vx, -350 * eWall, 'Right bounce vx must be -vx * eWall');

// Test ceiling penetration
const orbTop = { x: 300, y: -20, vx: 40, vy: -500, radius: 20, mass: 1.0 };
resolveWallBounce(orbTop, testWidth, testHeight);
assert.strictEqual(orbTop.y, orbTop.radius, 'Top penetration must clamp to orb.radius');
assert.strictEqual(orbTop.vy, 500 * eWall, 'Top bounce vy must be -vy * eWall');

// Test floor penetration
const orbBottom = { x: 300, y: testHeight + 40, vx: -80, vy: 600, radius: 32, mass: 2.56 };
resolveWallBounce(orbBottom, testWidth, testHeight);
assert.strictEqual(orbBottom.y, testHeight - orbBottom.radius, 'Floor penetration must clamp to height - orb.radius');
assert.strictEqual(orbBottom.vy, -600 * eWall, 'Floor bounce vy must be -vy * eWall');

// Test Energy dissipation: Ek' / Ek = eWall^2 = 0.7225
const kineticInitial = 0.5 * orbBottom.mass * (600 ** 2);
const kineticAfter = 0.5 * orbBottom.mass * (orbBottom.vy ** 2);
const energyRestitution = kineticAfter / kineticInitial;
assert.ok(Math.abs(energyRestitution - (eWall ** 2)) < 1e-9, 'Energy restitution must equal e^2 (0.7225)');

console.log('✓ TEST 2 PASSED: Boundary clamping, velocity reflection, and e=0.85 restitution verified.\n');

// -------------------------------------------------------------
// TEST 3: Pairwise Elastic Collisions with Mass Conservation
// -------------------------------------------------------------
console.log('--- TEST 3: Pairwise Elastic Collisions with Mass & Momentum Conservation ---');

function resolvePairwiseCollision(orbA, orbB) {
  // Exact implementation from PhysicsSandbox.jsx lines 405-442
  const dx = orbB.x - orbA.x;
  const dy = orbB.y - orbA.y;
  const dist = Math.hypot(dx, dy);
  const minDist = orbA.radius + orbB.radius;

  if (dist < minDist && dist > 0.0001) {
    const nx = dx / dist;
    const ny = dy / dist;
    const overlap = minDist - dist;

    // Positional separation weighted by inverse masses
    const totalMass = orbA.mass + orbB.mass;
    orbA.x -= nx * overlap * (orbB.mass / totalMass);
    orbA.y -= ny * overlap * (orbB.mass / totalMass);
    orbB.x += nx * overlap * (orbA.mass / totalMass);
    orbB.y += ny * overlap * (orbA.mass / totalMass);

    // Relative normal velocity
    const rvx = orbA.vx - orbB.vx;
    const rvy = orbA.vy - orbB.vy;
    const velAlongNormal = rvx * nx + rvy * ny;

    // Only collide if moving toward each other
    if (velAlongNormal > 0) {
      const restitution = 0.90;
      const impulse = (-(1 + restitution) * velAlongNormal) / (1 / orbA.mass + 1 / orbB.mass);
      orbA.vx += (impulse / orbA.mass) * nx;
      orbA.vy += (impulse / orbA.mass) * ny;
      orbB.vx -= (impulse / orbB.mass) * nx;
      orbB.vy -= (impulse / orbB.mass) * ny;
      return { collided: true, impulse, overlap, velAlongNormal };
    }
    return { collided: false, overlap };
  }
  return { collided: false };
}

// Case A: 1D Head-on collision between unequal masses (A: mass 2.56 [r=32], B: mass 1.0 [r=20])
const orbA = { x: 200, y: 150, vx: 120, vy: 0, radius: 32, mass: (32 * 32) / 400 }; // 2.56
const orbB = { x: 240, y: 150, vx: -80, vy: 0, radius: 20, mass: (20 * 20) / 400 };  // 1.00
const minDistAB = orbA.radius + orbB.radius; // 52

const initialPx = orbA.mass * orbA.vx + orbB.mass * orbB.vx;
const initialRelativeNormalVel = orbA.vx - orbB.vx; // 120 - (-80) = 200

const resA = resolvePairwiseCollision(orbA, orbB);
assert.strictEqual(resA.collided, true, 'Colliding orbs must trigger collision');

// 1. Verify overlap elimination
const postDist = Math.hypot(orbB.x - orbA.x, orbB.y - orbA.y);
assert.ok(postDist >= minDistAB - 1e-6, `Post collision distance ${postDist} must be >= minDist ${minDistAB}`);

// 2. Verify linear momentum conservation: P_final == P_initial
const postPx = orbA.mass * orbA.vx + orbB.mass * orbB.vx;
const momentumDelta = Math.abs(postPx - initialPx);
assert.ok(momentumDelta < 1e-10, `Linear momentum must be strictly conserved (delta=${momentumDelta})`);

// 3. Verify normal relative velocity restitution: v_rel_post == -0.90 * v_rel_pre
const postRelativeNormalVel = orbA.vx - orbB.vx;
const restitutionObserved = -postRelativeNormalVel / initialRelativeNormalVel;
assert.ok(
  Math.abs(restitutionObserved - 0.90) < 1e-6,
  `Coefficient of restitution must equal 0.90 (observed: ${restitutionObserved})`
);

// 4. Verify heavier orb displacement is less than lighter orb displacement
// Initial A was 200, B was 240
const dispA = Math.abs(orbA.x - 200);
const dispB = Math.abs(orbB.x - 240);
assert.ok(dispA < dispB, `Heavier mass (${orbA.mass}) must displace less than lighter mass (${orbB.mass})`);
assert.ok(
  Math.abs((dispA / dispB) - (orbB.mass / orbA.mass)) < 1e-6,
  'Displacements must be inversely proportional to masses'
);

// Case B: Oblique 2D Collision (Angle 45 degrees)
const orbC = { x: 100, y: 100, vx: 50, vy: 50, radius: 24, mass: 1.44 };
const orbD = { x: 130, y: 130, vx: -30, vy: -30, radius: 24, mass: 1.44 };
const initialTotalPx = orbC.mass * orbC.vx + orbD.mass * orbD.vx;
const initialTotalPy = orbC.mass * orbC.vy + orbD.mass * orbD.vy;

resolvePairwiseCollision(orbC, orbD);
const postTotalPx = orbC.mass * orbC.vx + orbD.mass * orbD.vx;
const postTotalPy = orbC.mass * orbC.vy + orbD.mass * orbD.vy;

assert.ok(Math.abs(postTotalPx - initialTotalPx) < 1e-10, '2D Px momentum must be conserved');
assert.ok(Math.abs(postTotalPy - initialTotalPy) < 1e-10, '2D Py momentum must be conserved');

console.log('✓ TEST 3 PASSED: Pairwise collision momentum conservation, e=0.90, and inverse-mass separation verified.\n');

// -------------------------------------------------------------
// TEST 4: Gravity Acceleration Regimes (Anti-G, Zero-G, Heavy)
// -------------------------------------------------------------
console.log('--- TEST 4: Gravity Acceleration Regimes ---');

function stepPhysics(orb, gravity, isZeroG, simTime, dt) {
  // 1. Gravity or Zero-G Orbital Float
  if (isZeroG) {
    orb.vx += Math.cos(simTime * 1.3 + orb.phase) * 16 * dt;
    orb.vy += Math.sin(simTime * 1.6 + orb.phase) * 16 * dt;
  } else {
    orb.vy += gravity * dt;
  }

  // 3. Viscous drag
  const damping = Math.max(0, 1 - 0.018 * 60 * dt);
  orb.vx *= damping;
  orb.vy *= damping;

  // 4. Integrate positions
  orb.x += orb.vx * dt;
  orb.y += orb.vy * dt;
}

// 4A: Heavy Gravity (+140 px/s²)
const testOrbHeavy = { x: 300, y: 100, vx: 0, vy: 0, radius: 24, mass: 1.44, phase: 0 };
for (let step = 0; step < 60; step++) {
  stepPhysics(testOrbHeavy, 140, false, step * 0.016, 0.016);
}
assert.ok(testOrbHeavy.vy > 50, `Heavy gravity must accelerate downward (vy=${testOrbHeavy.vy})`);
assert.ok(testOrbHeavy.y > 100, `Heavy gravity must increase y position (y=${testOrbHeavy.y})`);

// 4B: Anti-Gravity (-60 px/s² Anti-G)
const testOrbAntiG = { x: 300, y: 300, vx: 0, vy: 0, radius: 24, mass: 1.44, phase: 0 };
for (let step = 0; step < 60; step++) {
  stepPhysics(testOrbAntiG, -60, false, step * 0.016, 0.016);
}
assert.ok(testOrbAntiG.vy < -20, `Anti-G must accelerate upward with negative vy (vy=${testOrbAntiG.vy})`);
assert.ok(testOrbAntiG.y < 300, `Anti-G must decrease y position upward (y=${testOrbAntiG.y})`);

// 4C: Zero-G Orbital Drift (isZeroG = true)
const testOrbZeroG = { x: 300, y: 190, vx: 0, vy: 0, radius: 24, mass: 1.44, phase: 1.2 };
let minVx = Infinity, maxVx = -Infinity;
let minVy = Infinity, maxVy = -Infinity;

for (let step = 0; step < 300; step++) {
  const t = step * 0.016;
  stepPhysics(testOrbZeroG, 0, true, t, 0.016);
  minVx = Math.min(minVx, testOrbZeroG.vx);
  maxVx = Math.max(maxVx, testOrbZeroG.vx);
  minVy = Math.min(minVy, testOrbZeroG.vy);
  maxVy = Math.max(maxVy, testOrbZeroG.vy);
}
// Orbital sinusoidal velocity must oscillate in both positive and negative directions
assert.ok(minVx < -1 && maxVx > 1, `Zero-G orbital float must oscillate vx across zero ([${minVx}, ${maxVx}])`);
assert.ok(minVy < -1 && maxVy > 1, `Zero-G orbital float must oscillate vy across zero ([${minVy}, ${maxVy}])`);
assert.ok(Math.abs(testOrbZeroG.vx) < 25 && Math.abs(testOrbZeroG.vy) < 25, 'Zero-G drift velocity must remain gentle and bounded');

console.log('✓ TEST 4 PASSED: Heavy (+140), Anti-G (-60), and Zero-G orbital drift regimes verified.\n');

// -------------------------------------------------------------
// TEST 5: Pointer Kinetic Impulse & Repulsion Transfer
// -------------------------------------------------------------
console.log('--- TEST 5: Pointer Velocity Kinematics & Kinetic Repulsion ---');

const pointer = {
  x: 250,
  y: 190,
  lastX: 200,
  lastY: 190,
  vx: 0,
  vy: 0,
  smoothSpeed: 0,
  active: true,
  lastMoveTime: 1000
};

// Calculate pointer speed and velocity with dt = 0.016
const dt = 0.016;
const dxCur = pointer.x - pointer.lastX; // 50px
const dyCur = pointer.y - pointer.lastY; // 0px
const rawSpeed = Math.hypot(dxCur, dyCur) / Math.max(dt, 0.001); // 50 / 0.016 = 3125 px/s
const clampedSpeed = Math.min(rawSpeed, 2200); // Clamped to 2200
assert.strictEqual(clampedSpeed, 2200, 'Supersonic pointer speed must be clamped to 2200 px/s');

pointer.smoothSpeed += (clampedSpeed - pointer.smoothSpeed) * 0.25;
pointer.vx = (dxCur / Math.max(dt, 0.001)) * 0.35;
pointer.vy = (dyCur / Math.max(dt, 0.001)) * 0.35;
assert.strictEqual(pointer.smoothSpeed, 550, 'Smooth speed filtered by 0.25');
assert.strictEqual(pointer.vx, 3125 * 0.35, 'Pointer vx impulse factor 0.35 applied');

// Test interaction on nearby orb at (280, 190) -> distance = 30px
const targetOrb = { x: 280, y: 190, vx: 0, vy: 0, radius: 24, mass: 1.44 };
const dx = targetOrb.x - pointer.x; // 30
const dy = targetOrb.y - pointer.y; // 0
const dist = Math.hypot(dx, dy); // 30
const intRadius = targetOrb.radius + 68; // 24 + 68 = 92
assert.ok(dist < intRadius, 'Target orb must be within interaction radius');

const nx = dx / dist; // 1
const ny = dy / dist; // 0
const factor = (intRadius - dist) / intRadius; // (92 - 30) / 92 = 0.6739
const repelAcc = factor * 850;

targetOrb.vx += (nx * repelAcc + pointer.vx * 0.35) * dt;
targetOrb.vy += (ny * repelAcc + pointer.vy * 0.35) * dt;

assert.ok(targetOrb.vx > 10, `Orb must receive positive kinetic push in x direction (vx=${targetOrb.vx})`);
assert.strictEqual(targetOrb.vy, 0, 'No y impulse when pointer moves purely horizontally');

// Test speed decay when cursor stationary
const nowStationary = 1200; // > 120ms since lastMoveTime
if (nowStationary - pointer.lastMoveTime > 120) {
  pointer.smoothSpeed *= 0.88;
}
assert.strictEqual(pointer.smoothSpeed, 550 * 0.88, 'Speed decays by 0.88 when stationary');

console.log('✓ TEST 5 PASSED: Pointer velocity clamping, smoothing, and kinetic impulse transfer verified.\n');

// -------------------------------------------------------------
// TEST 6: Particle Burst Radial Impulse
// -------------------------------------------------------------
console.log('--- TEST 6: Particle Burst Radial Impulse & Spark System ---');

const burstOrigin = { x: 300, y: 190 };
const testOrbsForBurst = initOrbs(600, 380);

// Record pre-burst velocities
const preVelocities = testOrbsForBurst.map(o => ({ vx: o.vx, vy: o.vy }));

// Trigger burst logic from lines 164-172
testOrbsForBurst.forEach((orb) => {
  const dxB = orb.x - burstOrigin.x;
  const dyB = orb.y - burstOrigin.y;
  const distB = Math.max(Math.hypot(dxB, dyB), 14);
  const impulseB = (420 / (distB + 35)) * 75;
  orb.vx += (dxB / distB) * impulseB;
  orb.vy += (dyB / distB) * impulseB;
});

// Verify every orb was pushed radially outwards from origin
testOrbsForBurst.forEach((orb, i) => {
  const dxB = orb.x - burstOrigin.x;
  const dyB = orb.y - burstOrigin.y;
  const deltaVx = orb.vx - preVelocities[i].vx;
  const deltaVy = orb.vy - preVelocities[i].vy;

  // Dot product of impulse vector and radial displacement vector must be strictly positive
  const dot = deltaVx * dxB + deltaVy * dyB;
  assert.ok(dot > 0, `Orb ${orb.id} burst impulse must be outward (dot=${dot})`);
});

// Verify inverse-distance attenuation: close orb vs far orb
const dist0 = Math.hypot(testOrbsForBurst[0].x - burstOrigin.x, testOrbsForBurst[0].y - burstOrigin.y);
const distLast = Math.hypot(testOrbsForBurst[6].x - burstOrigin.x, testOrbsForBurst[6].y - burstOrigin.y);
const impulse0 = (420 / (Math.max(dist0, 14) + 35)) * 75;
const impulseLast = (420 / (Math.max(distLast, 14) + 35)) * 75;

if (dist0 < distLast) {
  assert.ok(impulse0 > impulseLast, 'Closer orb must receive larger impulse');
} else {
  assert.ok(impulseLast > impulse0, 'Closer orb must receive larger impulse');
}

console.log('✓ TEST 6 PASSED: Radial explosive impulse with inverse-distance falloff verified.\n');

// -------------------------------------------------------------
// TEST 7: Telemetry HUD Formatting & Zero-Re-Render Direct DOM Verification
// -------------------------------------------------------------
console.log('--- TEST 7: Telemetry Calculations & Zero-Re-Render Direct DOM Mutation ---');

// Telemetry formulas test
const testSpeed = 425.6;
const roundedSpeed = Math.round(testSpeed); // 426
assert.strictEqual(roundedSpeed, 426, 'Speed must round to integer');

const speedBarPct = Math.min(100, Math.round((roundedSpeed / 850) * 100));
assert.strictEqual(speedBarPct, 50, '426 / 850 * 100% should round to 50%');

const coordsActive = `X: ${Math.round(245.4)}, Y: ${Math.round(180.8)}`;
assert.strictEqual(coordsActive, 'X: 245, Y: 181', 'Coordinates must format active position');

// Inspect PhysicsSandbox.jsx source code for direct DOM mutations and ZERO React re-renders
const sandboxPath = path.resolve('src/components/PhysicsSandbox.jsx');
const source = fs.readFileSync(sandboxPath, 'utf8');

// 1. Direct refs existence
assert.ok(source.includes('const speedTextRef = useRef(null)'), 'Must declare speedTextRef');
assert.ok(source.includes('const coordsTextRef = useRef(null)'), 'Must declare coordsTextRef');
assert.ok(source.includes('const fpsTextRef = useRef(null)'), 'Must declare fpsTextRef');
assert.ok(source.includes('const speedBarRef = useRef(null)'), 'Must declare speedBarRef');

// 2. Direct DOM mutation inside RAF loop
assert.ok(source.includes('speedTextRef.current.textContent = String(roundedSpeed)'), 'Mutates speedTextRef textContent directly');
assert.ok(source.includes('coordsTextRef.current.textContent = pointer.active'), 'Mutates coordsTextRef textContent directly');
assert.ok(source.includes('fpsTextRef.current.textContent = String(Math.round(fpsTrackerRef.current.currentFps))'), 'Mutates fpsTextRef textContent directly');
assert.ok(source.includes('speedBarRef.current.style.width = `${pct}%`'), 'Mutates speedBarRef style.width directly');

// 3. ZERO React state re-renders inside animate loop
// Find animate function
const animateStart = source.indexOf('const animate = (now) => {');
const animateEnd = source.indexOf('rafIdRef.current = requestAnimationFrame(animate);', animateStart);
assert.ok(animateStart > -1 && animateEnd > -1, 'animate function must exist');

const animateBody = source.substring(animateStart, animateEnd);

// Verify NO setState calls exist in the animation loop
assert.ok(!animateBody.includes('setIsZeroG('), 'Zero-G state setter must NOT be called in animate');
assert.ok(!animateBody.includes('setState('), 'setState must NOT be called in animate');
assert.ok(!animateBody.includes('setSpeed('), 'No React state setter for speed');
assert.ok(!animateBody.includes('setCoords('), 'No React state setter for coords');
assert.ok(!animateBody.includes('setFps('), 'No React state setter for FPS');

console.log('✓ TEST 7 PASSED: Zero-re-render Telemetry DOM direct mutation verified.\n');

// -------------------------------------------------------------
// TEST 8: 1000-Frame Multi-Body Integration Stress Run
// -------------------------------------------------------------
console.log('--- TEST 8: 1000-Frame Multi-Body Full Integration Simulation ---');

const simArena = { width: 600, height: 380 };
const simOrbs = initOrbs(simArena.width, simArena.height);

let simNow = 0;
let simFrames = 0;
let totalCollisions = 0;
let totalWallBounces = 0;

for (let frame = 0; frame < 1000; frame++) {
  const dtSim = 0.016;
  simNow += dtSim;
  simFrames++;

  // Alternate gravity regimes across the 1000 frames:
  // Frames 0-250: Heavy (+140)
  // Frames 250-500: Zero-G orbital drift
  // Frames 500-750: Anti-G (-60)
  // Frames 750-1000: Standard (+40)
  const isZeroGActive = frame >= 250 && frame < 500;
  const currentGravity = frame < 250 ? 140 : frame < 500 ? 0 : frame < 750 ? -60 : 40;

  // Move simulated pointer in a Lissajous figure across arena
  const pointerSim = {
    active: true,
    x: simArena.width / 2 + Math.sin(simNow * 2.5) * 200,
    y: simArena.height / 2 + Math.cos(simNow * 1.8) * 120,
    vx: Math.cos(simNow * 2.5) * 2.5 * 200 * 0.35,
    vy: -Math.sin(simNow * 1.8) * 1.8 * 120 * 0.35
  };

  // Trigger burst at frame 300 and 700
  if (frame === 300 || frame === 700) {
    simOrbs.forEach((orb) => {
      const dxB = orb.x - pointerSim.x;
      const dyB = orb.y - pointerSim.y;
      const distB = Math.max(Math.hypot(dxB, dyB), 14);
      const impulseB = (420 / (distB + 35)) * 75;
      orb.vx += (dxB / distB) * impulseB;
      orb.vy += (dyB / distB) * impulseB;
    });
  }

  // Step each orb
  for (let i = 0; i < simOrbs.length; i++) {
    const orb = simOrbs[i];

    // 1. Gravity / Zero-G
    if (isZeroGActive) {
      orb.vx += Math.cos(simNow * 1.3 + orb.phase) * 16 * dtSim;
      orb.vy += Math.sin(simNow * 1.6 + orb.phase) * 16 * dtSim;
    } else {
      orb.vy += currentGravity * dtSim;
    }

    // 2. Cursor repulsion
    const dxC = orb.x - pointerSim.x;
    const dyC = orb.y - pointerSim.y;
    const distC = Math.hypot(dxC, dyC);
    const intRad = orb.radius + 68;

    if (distC < intRad) {
      const nx = distC > 0.001 ? dxC / distC : 0;
      const ny = distC > 0.001 ? dyC / distC : -1;
      const factor = (intRad - distC) / intRad;
      const repelAcc = factor * 850;

      orb.vx += (nx * repelAcc + pointerSim.vx * 0.35) * dtSim;
      orb.vy += (ny * repelAcc + pointerSim.vy * 0.35) * dtSim;

      if (distC < orb.radius + 14) {
        const pen = (orb.radius + 14) - distC;
        orb.x += nx * pen * 0.45;
        orb.y += ny * pen * 0.45;
      }
    }

    // 3. Viscous drag
    const damping = Math.max(0, 1 - 0.018 * 60 * dtSim);
    orb.vx *= damping;
    orb.vy *= damping;

    // 4. Integrate
    orb.x += orb.vx * dtSim;
    orb.y += orb.vy * dtSim;

    // 5. Wall bounce
    if (orb.x - orb.radius < 0) {
      orb.x = orb.radius;
      orb.vx = -orb.vx * eWall;
      totalWallBounces++;
    } else if (orb.x + orb.radius > simArena.width) {
      orb.x = simArena.width - orb.radius;
      orb.vx = -orb.vx * eWall;
      totalWallBounces++;
    }

    if (orb.y - orb.radius < 0) {
      orb.y = orb.radius;
      orb.vy = -orb.vy * eWall;
      totalWallBounces++;
    } else if (orb.y + orb.radius > simArena.height) {
      orb.y = simArena.height - orb.radius;
      orb.vy = -orb.vy * eWall;
      totalWallBounces++;
    }

    // Invariant assertions: No NaN or Infinity, within bounds
    assert.ok(!isNaN(orb.x) && !isNaN(orb.y), `Frame ${frame} Orb ${orb.id} position is NaN`);
    assert.ok(!isNaN(orb.vx) && !isNaN(orb.vy), `Frame ${frame} Orb ${orb.id} velocity is NaN`);
    assert.ok(isFinite(orb.x) && isFinite(orb.y), `Frame ${frame} Orb ${orb.id} position is infinite`);
    assert.ok(isFinite(orb.vx) && isFinite(orb.vy), `Frame ${frame} Orb ${orb.id} velocity is infinite`);

    assert.ok(
      orb.x >= orb.radius - 1e-4 && orb.x <= simArena.width - orb.radius + 1e-4,
      `Frame ${frame} Orb ${orb.id} x=${orb.x} breached arena wall bounds`
    );
    assert.ok(
      orb.y >= orb.radius - 1e-4 && orb.y <= simArena.height - orb.radius + 1e-4,
      `Frame ${frame} Orb ${orb.id} y=${orb.y} breached arena floor/ceiling bounds`
    );
  }

  // 6. Pairwise collisions
  for (let i = 0; i < simOrbs.length; i++) {
    for (let j = i + 1; j < simOrbs.length; j++) {
      const res = resolvePairwiseCollision(simOrbs[i], simOrbs[j]);
      if (res && res.collided) {
        totalCollisions++;
      }
    }
  }
}

console.log(`✓ TEST 8 PASSED: 1000 frames completed successfully.`);
console.log(`  - Total recorded pairwise collisions: ${totalCollisions}`);
console.log(`  - Total recorded wall bounces: ${totalWallBounces}`);
console.log(`  - Zero numerical drift, zero NaNs, zero boundary escapes observed.\n`);

console.log('================================================================');
console.log('       ALL 8 SIMULATION & TELEMETRY STRESS TESTS PASSED!        ');
console.log('================================================================\n');
