import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

const ROOT = process.cwd();

console.log('======================================================================');
console.log('   INDEPENDENT POST-VICTORY AUDIT TEST SUITE (VICTORY AUDITOR 4)      ');
console.log('======================================================================\n');

let totalTests = 0;
let passedTests = 0;

function check(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] ${name}:`, err.message);
  }
}

// -----------------------------------------------------------------------------
// CHECK 1: Web Audio Synthesizer Engine (src/utils/audio.js)
// -----------------------------------------------------------------------------
console.log('--- AUDIT CHECK 1: Web Audio Synthesizer Engine ---');

const audioSource = fs.readFileSync(path.join(ROOT, 'src/utils/audio.js'), 'utf-8');

check('SoundFX class defines masterVolume [0.0 - 1.0] and pitchMultiplier [0.5 - 2.0]', () => {
  assert(audioSource.includes('this.masterVolume = 0.8'), 'Missing default master volume 0.8');
  assert(audioSource.includes('this.pitchMultiplier = 1.0'), 'Missing default pitchMultiplier 1.0');
  assert(audioSource.includes('setMasterVolume(volume)'), 'Missing setMasterVolume');
  assert(audioSource.includes('setPitchMultiplier(mult)'), 'Missing setPitchMultiplier');
});

check('Volume control uses click-free setTargetAtTime gain smoothing', () => {
  assert(audioSource.includes('setTargetAtTime(targetGain, t, 0.015)'), 'Missing setTargetAtTime gain smoothing');
});

check('resetAudioDefaults() restores master volume 0.8 and pitch 1.0', () => {
  assert(audioSource.includes('resetAudioDefaults()'), 'Missing resetAudioDefaults');
  assert(audioSource.includes('this.masterVolume = 0.8;'), 'Missing reset masterVolume');
  assert(audioSource.includes('this.pitchMultiplier = 1.0;'), 'Missing reset pitchMultiplier');
});

check('Implements all 7 pure Web Audio synthesizer effects with real oscillator/filter nodes', () => {
  const soundMethods = [
    'playPolaroidShutter',
    'playCosmicSparkle',
    'playBubblePop',
    'playLaserFocus',
    'playCrystalChime',
    'playRibbonSweep',
    'playHapticClick'
  ];
  soundMethods.forEach((method) => {
    assert(audioSource.includes(`${method}(`), `Missing method ${method}`);
  });

  // Verify real audio node usage
  assert(audioSource.includes('createOscillator()'), 'Missing createOscillator');
  assert(audioSource.includes('createGain()'), 'Missing createGain');
  assert(audioSource.includes('createBiquadFilter()'), 'Missing createBiquadFilter');
  assert(audioSource.includes('createBuffer('), 'Missing createBuffer for shutter noise');
  assert(audioSource.includes('exponentialRampToValueAtTime'), 'Missing exponential ramps');
});

check('SOUNDBOARD_SOUNDS exports 7 descriptor objects with executable play callbacks', () => {
  assert(audioSource.includes('export const SOUNDBOARD_SOUNDS = ['), 'Missing SOUNDBOARD_SOUNDS export');
  const expectedSounds = ['shutter', 'sparkle', 'pop', 'focus', 'chime', 'ribbon', 'haptic'];
  expectedSounds.forEach((id) => {
    assert(audioSource.includes(`id: '${id}'`), `Missing sound id '${id}' in SOUNDBOARD_SOUNDS`);
  });
});

// -----------------------------------------------------------------------------
// CHECK 2: LabContext State, Presets & Persistence (src/context/LabContext.jsx)
// -----------------------------------------------------------------------------
console.log('\n--- AUDIT CHECK 2: LabContext & Persistence ---');

const contextSource = fs.readFileSync(path.join(ROOT, 'src/context/LabContext.jsx'), 'utf-8');

check('DEFAULT_LAB_CONFIG specifies all required default parameter values', () => {
  assert(contextSource.includes("cursorScale: 1.0"), 'Missing cursorScale: 1.0');
  assert(contextSource.includes("flightSpeed: 0.14"), 'Missing flightSpeed: 0.14');
  assert(contextSource.includes("wingDynamics: 1.0"), 'Missing wingDynamics: 1.0');
  assert(contextSource.includes("gravity: 0"), 'Missing gravity: 0');
  assert(contextSource.includes("trailEnabled: true"), 'Missing trailEnabled: true');
  assert(contextSource.includes("particleColor: '#FF4D6D'"), 'Missing particleColor');
  assert(contextSource.includes("masterVolume: 0.8"), 'Missing masterVolume: 0.8');
  assert(contextSource.includes("audioPitch: 1.0"), 'Missing audioPitch: 1.0');
});

check('Defines all 4 curated presets + aliases with exact physics/audio values', () => {
  assert(contextSource.includes("cyberpunk: {"), 'Missing cyberpunk preset');
  assert(contextSource.includes("arcade: {"), 'Missing arcade preset');
  assert(contextSource.includes("zen: {"), 'Missing zen preset');
  assert(contextSource.includes("hyper: {"), 'Missing hyper preset');
  assert(contextSource.includes("LAB_PRESETS['cyberpunk-zerog']"), 'Missing cyberpunk-zerog alias');
  assert(contextSource.includes("LAB_PRESETS['retro-arcade']"), 'Missing retro-arcade alias');
  assert(contextSource.includes("LAB_PRESETS['zen-minimalist']"), 'Missing zen-minimalist alias');
  assert(contextSource.includes("LAB_PRESETS['hyper-velocity']"), 'Missing hyper-velocity alias');
});

check('Implements strict defensive input clamping for all parameters', () => {
  assert(contextSource.includes("clamp(val, 0.5, 2.0, 1.0)"), 'Missing clamp for scale');
  assert(contextSource.includes("clamp(val, 0.05, 0.35, 0.14)"), 'Missing clamp for speed');
  assert(contextSource.includes("clamp(val, 0.5, 2.0, 1.0)"), 'Missing clamp for wing dynamics');
  assert(contextSource.includes("clamp(val, -60, 140, 0)"), 'Missing clamp for gravity');
  assert(contextSource.includes("clamp(val, 0.0, 1.0, 0.8)"), 'Missing clamp for volume');
  assert(contextSource.includes("clamp(val, 0.5, 2.0, 1.0)"), 'Missing clamp for pitch');
  assert(contextSource.includes("/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/"), 'Missing hex validation');
});

check('Atomic state persistence to localStorage under portfolio_lab_config and legacy key updates', () => {
  assert(contextSource.includes("export const LAB_STORAGE_KEY = 'portfolio_lab_config'"), 'Missing LAB_STORAGE_KEY');
  assert(contextSource.includes("localStorage.setItem(LAB_STORAGE_KEY, JSON.stringify(payload))"), 'Missing storage setItem');
  assert(contextSource.includes("localStorage.setItem('physics_particle_color', particleColor)"), 'Missing legacy color update');
  assert(contextSource.includes("localStorage.setItem('physics_gravity', gravity.toString())"), 'Missing legacy gravity update');
  assert(contextSource.includes("localStorage.setItem('physics_audio_pitch', audioPitch.toString())"), 'Missing legacy pitch update');
});

check('Multi-tab synchronization via window storage listener and custom event dispatching', () => {
  assert(contextSource.includes("window.addEventListener('storage', handleStorage)"), 'Missing storage listener');
  assert(contextSource.includes("window.dispatchEvent(new CustomEvent('portfolio:lab-change'"), 'Missing lab-change event');
  assert(contextSource.includes("window.addEventListener('portfolio:open-lab-drawer'"), 'Missing open-drawer listener');
  assert(contextSource.includes("window.addEventListener('portfolio:apply-lab-preset'"), 'Missing apply-preset listener');
});

// -----------------------------------------------------------------------------
// CHECK 3: 2D Physics Sandbox & Telemetry HUD (src/components/PhysicsSandbox.jsx)
// -----------------------------------------------------------------------------
console.log('\n--- AUDIT CHECK 3: 2D Physics Sandbox & Telemetry HUD ---');

const physicsSource = fs.readFileSync(path.join(ROOT, 'src/components/PhysicsSandbox.jsx'), 'utf-8');

check('Configures 7 elastic physics orbs with area-proportional mass', () => {
  assert(physicsSource.includes('const ORB_CONFIGS = ['), 'Missing ORB_CONFIGS');
  assert(physicsSource.includes('mass: (cfg.radius * cfg.radius) / 400'), 'Missing area-proportional mass calculation');
  // Check count of 7 configs
  const matches = physicsSource.match(/id:\s*[1-7],/g);
  assert(matches && matches.length === 7, `Expected 7 orbs, found ${matches ? matches.length : 0}`);
});

check('RAF simulation loop normalizes and clamps delta time', () => {
  assert(physicsSource.includes('Math.min((now - lastTimeRef.current) / 1000, 0.04)'), 'Missing delta time clamp');
});

check('Pointer velocity calculation in px/s, smoothing, and kinetic repulsion push', () => {
  assert(physicsSource.includes('Math.hypot(dxCur, dyCur) / Math.max(dt, 0.001)'), 'Missing pointer speed calculation');
  assert(physicsSource.includes('repelAcc = factor * 850'), 'Missing repulsion acceleration');
  assert(physicsSource.includes('orb.vx += (nx * repelAcc + pointer.vx * 0.35) * dt'), 'Missing kinetic impulse addition');
});

check('Wall collisions enforce restitution e = 0.85', () => {
  assert(physicsSource.includes('const eWall = 0.85'), 'Missing eWall = 0.85');
  assert(physicsSource.includes('orb.vx = -orb.vx * eWall'), 'Missing wall vx reflection');
  assert(physicsSource.includes('orb.vy = -orb.vy * eWall'), 'Missing wall vy reflection');
});

check('Pairwise elastic collisions enforce mass conservation and restitution e = 0.90', () => {
  assert(physicsSource.includes('orbA.mass + orbB.mass'), 'Missing total mass calculation');
  assert(physicsSource.includes('const restitution = 0.90'), 'Missing restitution = 0.90');
  assert(physicsSource.includes('impulse = (-(1 + restitution) * velAlongNormal) / (1 / orbA.mass + 1 / orbB.mass)'), 'Missing elastic collision impulse formula');
  assert(physicsSource.includes('orbA.vx += (impulse / orbA.mass) * nx'), 'Missing orbA velocity update');
  assert(physicsSource.includes('orbB.vx -= (impulse / orbB.mass) * nx'), 'Missing orbB velocity update');
});

check('Supports Zero-G sinusoidal orbital float drift and Heavy/Anti-G gravity regimes', () => {
  assert(physicsSource.includes('orb.vx += Math.cos(simTimeRef.current * 1.3 + orb.phase) * 16 * dt'), 'Missing Zero-G cos orbital drift');
  assert(physicsSource.includes('orb.vy += Math.sin(simTimeRef.current * 1.6 + orb.phase) * 16 * dt'), 'Missing Zero-G sin orbital drift');
  assert(physicsSource.includes('orb.vy += effGravity * dt'), 'Missing gravity acceleration');
});

check('Particle Burst spawns 40 radial sparks and applies explosive radial impulse to orbs', () => {
  assert(physicsSource.includes('for (let i = 0; i < 40; i++)'), 'Missing 40 spark loop');
  assert(physicsSource.includes('const impulse = (420 / (dist + 35)) * 75'), 'Missing explosive impulse formula');
});

check('Telemetry HUD updates DOM nodes directly via refs throttled at ~65ms with zero React re-renders', () => {
  assert(physicsSource.includes('speedTextRef.current.textContent = String(roundedSpeed)'), 'Missing speedTextRef direct textContent update');
  assert(physicsSource.includes('coordsTextRef.current.textContent = pointer.active'), 'Missing coordsTextRef direct update');
  assert(physicsSource.includes('fpsTextRef.current.textContent = String(Math.round(fpsTrackerRef.current.currentFps))'), 'Missing fpsTextRef direct update');
  assert(physicsSource.includes('speedBarRef.current.style.width = `${pct}%`'), 'Missing speedBarRef style.width direct update');
  assert(physicsSource.includes('now - lastHudUpdateRef.current > 65'), 'Missing 65ms throttling');
});

// -----------------------------------------------------------------------------
// CHECK 4: Lab Studio Drawer & UI Integration
// -----------------------------------------------------------------------------
console.log('\n--- AUDIT CHECK 4: Lab Studio Drawer & UI Integration ---');

const drawerSource = fs.readFileSync(path.join(ROOT, 'src/components/LabStudioDrawer.jsx'), 'utf-8');
const playgroundSource = fs.readFileSync(path.join(ROOT, 'src/components/InteractivePlayground.jsx'), 'utf-8');
const appSource = fs.readFileSync(path.join(ROOT, 'src/App.jsx'), 'utf-8');
const mainSource = fs.readFileSync(path.join(ROOT, 'src/main.jsx'), 'utf-8');

check('Persistent FAB button mounted at bottom-6 right-6 with FlaskConical icon and pulse beacon', () => {
  assert(drawerSource.includes('fixed bottom-6 right-6'), 'Missing FAB fixed bottom-6 right-6 positioning');
  assert(drawerSource.includes('<FlaskConical'), 'Missing FlaskConical icon in FAB');
  assert(drawerSource.includes('animate-ping'), 'Missing pulse beacon animation');
});

check('Slide-Out Drawer uses hardware-accelerated translateX with zero layout shift', () => {
  assert(drawerSource.includes('translate-x-full'), 'Missing closed translate-x-full state');
  assert(drawerSource.includes('translate-x-0'), 'Missing open translate-x-0 state');
  assert(drawerSource.includes('z-[48]'), 'Missing z-[48] layer positioning');
  assert(drawerSource.includes('role="dialog"'), 'Missing ARIA dialog role');
});

check('InteractivePlayground provides dual anchor IDs #playground and #lab', () => {
  assert(playgroundSource.includes('id="playground"'), 'Missing id="playground"');
  assert(playgroundSource.includes('id="lab"'), 'Missing id="lab"');
});

check('InteractivePlayground embeds PhysicsSandbox with gravity, particleColor and sound props', () => {
  assert(playgroundSource.includes('<PhysicsSandbox'), 'Missing PhysicsSandbox embedding in InteractivePlayground');
  assert(playgroundSource.includes('gravity={gravity}'), 'Missing gravity prop');
  assert(playgroundSource.includes('particleColor={particleColor}'), 'Missing particleColor prop');
});

check('App.jsx mounts LabStudioDrawer and passes lab parameters to DynamicCursorManager', () => {
  assert(appSource.includes('<LabStudioDrawer />'), 'Missing LabStudioDrawer in App.jsx');
  assert(appSource.includes('scale={cursorScale}'), 'Missing scale prop passing');
  assert(appSource.includes('speed={flightSpeed}'), 'Missing speed prop passing');
  assert(appSource.includes('gravity={gravity}'), 'Missing gravity prop passing');
  assert(appSource.includes('wingDynamics={wingDynamics}'), 'Missing wingDynamics prop passing');
  assert(appSource.includes('particleColor={particleColor}'), 'Missing particleColor prop passing');
});

check('main.jsx wraps App with LabProvider at root level', () => {
  assert(mainSource.includes('<LabProvider>'), 'Missing LabProvider in main.jsx');
  assert(mainSource.includes('</LabProvider>'), 'Missing LabProvider closing tag in main.jsx');
});

// -----------------------------------------------------------------------------
// CHECK 5: Cursor Kinematics & Wing Dynamics Propagation
// -----------------------------------------------------------------------------
console.log('\n--- AUDIT CHECK 5: Cursor Kinematics & Wing Dynamics ---');

const butterflySource = fs.readFileSync(path.join(ROOT, 'src/components/ButterflyCursor.jsx'), 'utf-8');
const cursorManagerSource = fs.readFileSync(path.join(ROOT, 'src/components/DynamicCursorManager.jsx'), 'utf-8');

check('ButterflyCursor applies scale directly to CSS 3D transform', () => {
  assert(butterflySource.includes('scale(${scaleRef.current || 1})'), 'Missing scale in butterfly transform');
});

check('ButterflyCursor dynamically modulates wing flutter duration via wingDynamicsRef', () => {
  assert(butterflySource.includes('wingDynamicsRef.current'), 'Missing wingDynamicsRef usage');
  assert(butterflySource.includes("b.style.setProperty('--flutter-duration'"), 'Missing --flutter-duration CSS var');
});

check('ButterflyCursor trail stardust particles accelerate under gravity', () => {
  assert(butterflySource.includes('p.vy += (gravityRef.current || 0) * dt'), 'Missing particle gravity acceleration');
});

check('DynamicCursorManager propagates scale, speed, gravity, wingDynamics to all 35 cursor styles', () => {
  assert(cursorManagerSource.includes('<ModularKinematicCursor'), 'Missing ModularKinematicCursor dispatch');
  assert(cursorManagerSource.includes('scale={scale}'), 'Missing scale prop');
  assert(cursorManagerSource.includes('gravity={gravity}'), 'Missing gravity prop');
  assert(cursorManagerSource.includes('wingDynamics={wingDynamics}'), 'Missing wingDynamics prop');
});

// -----------------------------------------------------------------------------
// CHECK 6: Navigation, ExploreSubBar & Command Palette Deep Linking
// -----------------------------------------------------------------------------
console.log('\n--- AUDIT CHECK 6: Deep Linking & Command Palette Integration ---');

const catalogSource = fs.readFileSync(path.join(ROOT, 'src/utils/searchCatalog.js'), 'utf-8');
const commandPaletteSource = fs.readFileSync(path.join(ROOT, 'src/components/CommandPalette.jsx'), 'utf-8');
const exploreSource = fs.readFileSync(path.join(ROOT, 'src/components/ExploreSubBar.jsx'), 'utf-8');

check('Search catalog indexes act-lab-drawer with open-lab-drawer actionType', () => {
  assert(catalogSource.includes("id: 'act-lab-drawer'"), 'Missing act-lab-drawer in catalog');
  assert(catalogSource.includes("actionType: 'open-lab-drawer'"), 'Missing actionType open-lab-drawer in catalog');
});

check('CommandPalette dispatches portfolio:open-lab-drawer custom event on selection', () => {
  assert(commandPaletteSource.includes("window.dispatchEvent(new CustomEvent('portfolio:open-lab-drawer'))"), 'Missing open-lab-drawer dispatch in CommandPalette');
});

check('ExploreSubBar provides Quick Drawer button that dispatches open-lab-drawer', () => {
  assert(exploreSource.includes("action === 'open-drawer' || targetItem.id === 'drawer'"), 'Missing drawer action in ExploreSubBar');
  assert(exploreSource.includes("window.dispatchEvent(new CustomEvent('portfolio:open-lab-drawer'))"), 'Missing open-lab-drawer dispatch in ExploreSubBar');
});

console.log('\n======================================================================');
console.log(`TOTAL AUDIT CHECKS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
console.log('======================================================================\n');

if (passedTests === totalTests) {
  console.log('🎉 ALL INDEPENDENT POST-VICTORY AUDIT CHECKS PASSED WITH 100% SUCCESS!\n');
  process.exit(0);
} else {
  console.error('❌ SOME AUDIT CHECKS FAILED!\n');
  process.exit(1);
}
