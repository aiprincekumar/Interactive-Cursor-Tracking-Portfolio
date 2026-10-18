import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('================================================================');
console.log('  MILESTONE 2: PORTFOLIO CONTROL CENTER VERIFICATION HARNESS   ');
console.log('================================================================\n');

// 1. Verify PhysicsSandbox.jsx is completely removed
console.log('--- TEST 1: Elimination of PhysicsSandbox.jsx ---');
const physicsSandboxPath = path.resolve('src/components/PhysicsSandbox.jsx');
assert.strictEqual(
  fs.existsSync(physicsSandboxPath),
  false,
  'src/components/PhysicsSandbox.jsx must be deleted'
);
console.log('✓ TEST 1 PASSED: PhysicsSandbox.jsx is cleanly deleted.\n');

// 2. Verify LabContext.jsx exports and schema
console.log('--- TEST 2: LabContext 4-Tab Architecture & Storage Key ---');
const labContextSource = fs.readFileSync(path.resolve('src/context/LabContext.jsx'), 'utf8');

assert.ok(
  labContextSource.includes("export const CONTROL_CENTER_STORAGE_KEY = 'portfolio_control_center'"),
  'Must export CONTROL_CENTER_STORAGE_KEY'
);
assert.ok(labContextSource.includes('export const FACTORY_DEFAULTS = {'), 'Must export FACTORY_DEFAULTS');
assert.ok(labContextSource.includes('audio: {'), 'FACTORY_DEFAULTS must have audio namespace');
assert.ok(labContextSource.includes('cursor: {'), 'FACTORY_DEFAULTS must have cursor namespace');
assert.ok(labContextSource.includes('hero: {'), 'FACTORY_DEFAULTS must have hero namespace');
assert.ok(labContextSource.includes('preferences: {'), 'FACTORY_DEFAULTS must have preferences namespace');

// Check setters
assert.ok(labContextSource.includes('setSoundMatchingMode'), 'Must provide setSoundMatchingMode');
assert.ok(labContextSource.includes('setCustomCursorEnabled'), 'Must provide setCustomCursorEnabled');
assert.ok(labContextSource.includes('setFlightLerpSpeed'), 'Must provide setFlightLerpSpeed');
assert.ok(labContextSource.includes('setGazeMode'), 'Must provide setGazeMode');
assert.ok(labContextSource.includes('setPoseOverride'), 'Must provide setPoseOverride');
assert.ok(labContextSource.includes('setCharacterZoom'), 'Must provide setCharacterZoom');
assert.ok(labContextSource.includes('setFlashConfettiEnabled'), 'Must provide setFlashConfettiEnabled');
assert.ok(labContextSource.includes('setDefaultStartupRole'), 'Must provide setDefaultStartupRole');
assert.ok(labContextSource.includes('resetDefaults'), 'Must provide resetDefaults function');
console.log('✓ TEST 2 PASSED: LabContext 4-tab schema, storage key, and setters verified.\n');

// 3. Verify audio.js soundMatchingMode and dispatcher
console.log('--- TEST 3: Web Audio Synthesizer soundMatchingMode & Dispatcher ---');
const audioSource = fs.readFileSync(path.resolve('src/utils/audio.js'), 'utf8');

assert.ok(audioSource.includes("this.soundMatchingMode = 'dynamic'"), 'Default soundMatchingMode must be dynamic');
assert.ok(audioSource.includes('setSoundMatchingMode(mode)'), 'Must define setSoundMatchingMode');
assert.ok(audioSource.includes('getSoundMatchingMode()'), 'Must define getSoundMatchingMode');
assert.ok(
  audioSource.includes("if (this.soundMatchingMode === 'universal')"),
  'playCursorSelect must branch on universal mode'
);
assert.ok(audioSource.includes('this.playPolaroidShutter()'), 'Dynamic mode must support camera/shutter');
assert.ok(audioSource.includes('this.playLaserFocus()'), 'Dynamic mode must support laser/focus');
assert.ok(audioSource.includes('this.playCosmicSparkle()'), 'Dynamic mode must support butterfly/sparkle');
console.log('✓ TEST 3 PASSED: Web Audio soundMatchingMode and dynamic dispatcher verified.\n');

// 4. Verify DynamicCursorManager.jsx
console.log('--- TEST 4: DynamicCursorManager Fallback Engineering ---');
const cursorManagerSource = fs.readFileSync(path.resolve('src/components/DynamicCursorManager.jsx'), 'utf8');

assert.ok(cursorManagerSource.includes('customCursorEnabled'), 'Must accept customCursorEnabled');
assert.ok(cursorManagerSource.includes('custom-cursor-disabled'), 'Must toggle custom-cursor-disabled on document body');
assert.ok(
  cursorManagerSource.includes('if (!customCursorEnabled'),
  'Must return null when customCursorEnabled is false'
);
console.log('✓ TEST 4 PASSED: DynamicCursorManager system pointer fallback verified.\n');

// 5. Verify HeroSection.jsx
console.log('--- TEST 5: HeroSection useLab Wiring ---');
const heroSource = fs.readFileSync(path.resolve('src/components/HeroSection.jsx'), 'utf8');

assert.ok(heroSource.includes('useLab'), 'HeroSection must import useLab');
assert.ok(heroSource.includes('customCursorEnabled'), 'HeroSection must consume customCursorEnabled');
assert.ok(heroSource.includes('gazeMode'), 'HeroSection must consume gazeMode');
assert.ok(heroSource.includes('poseOverride'), 'HeroSection must consume poseOverride');
assert.ok(heroSource.includes('characterZoom'), 'HeroSection must consume characterZoom');
assert.ok(heroSource.includes('flashConfettiEnabled'), 'HeroSection must consume flashConfettiEnabled');
assert.ok(
  heroSource.includes('isInsideHero && !reducedMotion && customCursorEnabled ? \'cursor-none\' : \'\''),
  'HeroSection must suppress cursor-none when custom cursor is disabled'
);
assert.ok(
  heroSource.includes('if (!reducedMotion && flashConfettiEnabled)'),
  'HeroSection must guard camera flash & confetti with flashConfettiEnabled'
);
console.log('✓ TEST 5 PASSED: HeroSection gaze, pose, zoom, flash, and cursor-none wiring verified.\n');

// 6. Verify InteractivePlayground.jsx & LabStudioDrawer.jsx
console.log('--- TEST 6: 4-Tab Control Center Surfaces ---');
const playgroundSource = fs.readFileSync(path.resolve('src/components/InteractivePlayground.jsx'), 'utf8');
const drawerSource = fs.readFileSync(path.resolve('src/components/LabStudioDrawer.jsx'), 'utf8');
const panelSource = fs.readFileSync(path.resolve('src/components/ControlCenterPanel.jsx'), 'utf8');

// Ensure zero physics sandbox imports
assert.ok(!playgroundSource.includes('PhysicsSandbox'), 'InteractivePlayground must NOT import PhysicsSandbox');
assert.ok(!drawerSource.includes('PhysicsSandbox'), 'LabStudioDrawer must NOT import PhysicsSandbox');

// Ensure both surfaces mount ControlCenterPanel
assert.ok(playgroundSource.includes('<ControlCenterPanel'), 'InteractivePlayground must mount ControlCenterPanel');
assert.ok(drawerSource.includes('<ControlCenterPanel'), 'LabStudioDrawer must mount ControlCenterPanel');

// Ensure 4 tabs are present in ControlCenterPanel
assert.ok(panelSource.includes("id: 'audio'"), 'Panel must include Audio tab');
assert.ok(panelSource.includes("id: 'cursor'"), 'Panel must include Cursor tab');
assert.ok(panelSource.includes("id: 'hero'"), 'Panel must include Hero tab');
assert.ok(panelSource.includes("id: 'preferences'"), 'Panel must include Preferences tab');
assert.ok(panelSource.includes('resetDefaults()'), 'Panel must include 1-click factory reset');

console.log('✓ TEST 6 PASSED: 4-Tab Control Center workbench and drawer verified.\n');

console.log('================================================================');
console.log('        ALL MILESTONE 2 CONTROL CENTER TESTS PASSED!            ');
console.log('================================================================\n');
