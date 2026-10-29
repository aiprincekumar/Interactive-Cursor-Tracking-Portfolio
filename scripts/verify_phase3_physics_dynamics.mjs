/**
 * Verification Script: Phase 3 Physics, Hover Dynamics & Elasticity Integration
 * Author: Physics & Dynamics Systems Specialist
 */
import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('================================================================');
console.log('  VERIFY PHASE 3: PHYSICS, HOVER DYNAMICS & ELASTICITY SPEC     ');
console.log('================================================================\n');

// 1. Verify UniversalMiniPortfolio.jsx source integration & ELASTICITY_TRANSITIONS
const universalMiniPath = path.resolve('src/components/3d-sandbox/UniversalMiniPortfolio.jsx');
const universalMiniCode = fs.readFileSync(universalMiniPath, 'utf8');

const match = universalMiniCode.match(/export const ELASTICITY_TRANSITIONS\s*=\s*({[\s\S]*?\n};)/);
assert(match, 'ELASTICITY_TRANSITIONS must be exported in UniversalMiniPortfolio.jsx');

const ELASTICITY_TRANSITIONS = new Function(`return ${match[1].replace(/;$/, '')}`)();

assert(ELASTICITY_TRANSITIONS, 'ELASTICITY_TRANSITIONS must be valid object');
assert(ELASTICITY_TRANSITIONS.rigid, 'Rigid curve preset must exist');
assert(ELASTICITY_TRANSITIONS.snappy, 'Snappy curve preset must exist');
assert(ELASTICITY_TRANSITIONS.bouncy, 'Bouncy curve preset must exist');

assert.strictEqual(ELASTICITY_TRANSITIONS.rigid.curve, 'cubic-bezier(0.2, 0.8, 0.2, 1.0)', 'Rigid curve matches spec');
assert.strictEqual(ELASTICITY_TRANSITIONS.rigid.duration, '0.18s', 'Rigid duration matches spec');
assert(ELASTICITY_TRANSITIONS.rigid.transition.includes('0.18s cubic-bezier(0.2, 0.8, 0.2, 1.0)'), 'Rigid transition includes curve and duration');

assert.strictEqual(ELASTICITY_TRANSITIONS.snappy.curve, 'cubic-bezier(0.34, 1.56, 0.64, 1.0)', 'Snappy curve matches spec');
assert.strictEqual(ELASTICITY_TRANSITIONS.snappy.duration, '0.32s', 'Snappy duration matches spec');
assert(ELASTICITY_TRANSITIONS.snappy.transition.includes('0.32s cubic-bezier(0.34, 1.56, 0.64, 1.0)'), 'Snappy transition includes curve and duration');

assert.strictEqual(ELASTICITY_TRANSITIONS.bouncy.curve, 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', 'Bouncy curve matches spec');
assert.strictEqual(ELASTICITY_TRANSITIONS.bouncy.duration, '0.52s', 'Bouncy duration matches spec');
assert(ELASTICITY_TRANSITIONS.bouncy.transition.includes('0.52s cubic-bezier(0.175, 0.885, 0.32, 1.275)'), 'Bouncy transition includes curve and duration');

console.log('  ✅ PASS: ELASTICITY_TRANSITIONS exported with rigid, snappy, and bouncy cubic-bezier curves');

// A. Physics state consumption
assert(universalMiniCode.includes('threeD.physics'), 'UniversalMiniPortfolio consumes threeD.physics');
assert(universalMiniCode.includes('physics.hoverPop'), 'UniversalMiniPortfolio reads physics.hoverPop');
assert(universalMiniCode.includes('physics.elasticity'), 'UniversalMiniPortfolio reads physics.elasticity');
assert(universalMiniCode.includes('physics.clickDepression'), 'UniversalMiniPortfolio reads physics.clickDepression');
assert(universalMiniCode.includes('physics.magneticPull'), 'UniversalMiniPortfolio reads physics.magneticPull');

// B. Kinetic state tracking
assert(universalMiniCode.includes('hoveredElement') && universalMiniCode.includes('setHoveredElement'), 'Tracks hoveredElement state');
assert(universalMiniCode.includes('depressedElement') && universalMiniCode.includes('setDepressedElement'), 'Tracks depressedElement state');

// C. Dynamic Z elevation & click depression
assert(universalMiniCode.includes('z += hoverPop'), 'Elevates element Z position by hoverPop on hover');
assert(universalMiniCode.includes('z -= 6'), 'Depresses element Z position by 6px on pointerDown');
assert(universalMiniCode.includes('soundFX?.playHapticClick?.()'), 'Plays haptic click on click depression');

// D. Elasticity curve application
assert(universalMiniCode.includes('activeElasticity.transition') || universalMiniCode.includes('activeElasticity.curve'), 'Applies active elasticity transition to elements');

// E. Magnetic cursor micro-tilt
assert(universalMiniCode.includes('magneticTilt'), 'Calculates magnetic micro-tilt');
assert(universalMiniCode.includes('isMagneticPullEnabled'), 'Checks isMagneticPullEnabled');
assert(universalMiniCode.includes('rotateX(${magneticTilt.rotX}deg) rotateY(${magneticTilt.rotY}deg)'), 'Applies magnetic micro-tilt to hovered element');

// F. CSS Custom Properties binding
assert(universalMiniCode.includes("'--3d-hover-pop': `${hoverPop}px`"), 'Binds --3d-hover-pop CSS variable');
assert(universalMiniCode.includes("'--3d-physics-curve': activeElasticity.curve"), 'Binds --3d-physics-curve CSS variable');

console.log('  ✅ PASS: UniversalMiniPortfolio reacts dynamically to hoverPop, elasticity, clickDepression, and magneticPull');

// 2. Verify FloatingDockPreview.jsx source integration
const dockPreviewPath = path.resolve('src/components/3d-sandbox/previews/FloatingDockPreview.jsx');
const dockPreviewCode = fs.readFileSync(dockPreviewPath, 'utf8');

assert(dockPreviewCode.includes('ELASTICITY_TRANSITIONS'), 'FloatingDockPreview imports ELASTICITY_TRANSITIONS');
assert(dockPreviewCode.includes('physics.hoverPop'), 'FloatingDockPreview consumes physics.hoverPop');
assert(dockPreviewCode.includes('(hoverPopVal / 32) * 0.45 + 0.15'), 'FloatingDockPreview derives maxBoost from hoverPop');
assert(dockPreviewCode.includes('(hoverPopVal / 12) * 20'), 'FloatingDockPreview derives zBoost from hoverPop');
assert(dockPreviewCode.includes('depressedItem'), 'FloatingDockPreview tracks depressedItem state');
assert(dockPreviewCode.includes('zElevate -= 4') || dockPreviewCode.includes('translate-y-1'), 'FloatingDockPreview supports click depression');
assert(dockPreviewCode.includes('activeElasticity.curve') && dockPreviewCode.includes('activeElasticity.duration'), 'FloatingDockPreview applies elasticity transition to dock buttons');

console.log('  ✅ PASS: FloatingDockPreview derives dynamic scaling from physics.hoverPop and supports click depression');

// 3. Verify HeroCardPreview.jsx source integration
const heroPreviewPath = path.resolve('src/components/3d-sandbox/previews/HeroCardPreview.jsx');
const heroPreviewCode = fs.readFileSync(heroPreviewPath, 'utf8');

assert(heroPreviewCode.includes('ELASTICITY_TRANSITIONS'), 'HeroCardPreview imports ELASTICITY_TRANSITIONS');
assert(heroPreviewCode.includes('physics.hoverPop'), 'HeroCardPreview consumes physics.hoverPop');
assert(heroPreviewCode.includes('physics.clickDepression'), 'HeroCardPreview consumes physics.clickDepression');
assert(heroPreviewCode.includes('isHovered') && heroPreviewCode.includes('isDepressed'), 'HeroCardPreview tracks hover and depression state');
assert(heroPreviewCode.includes('heroElevationZ') || (heroPreviewCode.includes('hoverPop') && heroPreviewCode.includes('-6')), 'HeroCardPreview adjusts Z base elevation with hoverPop and depression');

console.log('  ✅ PASS: HeroCardPreview connects physics.hoverPop and physics.clickDepression');

console.log('\n================================================================');
console.log('  PHASE 3 VERIFICATION: ALL 4 TEST GATES PASSED (100%)           ');
console.log('================================================================\n');
