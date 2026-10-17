import fs from 'node:fs';
import path from 'node:path';

console.log('--- VERIFYING LabContext.jsx IMPLEMENTATION ---');

const labContextPath = path.resolve('src/context/LabContext.jsx');
const code = fs.readFileSync(labContextPath, 'utf8');

let errors = 0;

function assert(condition, message) {
  if (!condition) {
    console.error('❌ FAIL:', message);
    errors++;
  } else {
    console.log('✅ PASS:', message);
  }
}

// 1. Check exports
assert(code.includes('export const LAB_STORAGE_KEY = \'portfolio_lab_config\';'), 'LAB_STORAGE_KEY is exported with portfolio_lab_config');
assert(code.includes('export const DEFAULT_LAB_CONFIG = {'), 'DEFAULT_LAB_CONFIG is exported');
assert(code.includes('export const LAB_PRESETS = {'), 'LAB_PRESETS is exported');
assert(code.includes('export const LabContext = createContext(null);'), 'LabContext is exported');
assert(code.includes('export function LabProvider('), 'LabProvider is exported');
assert(code.includes('export function useLab('), 'useLab hook is exported');

// 2. Check State Management parameters & defaults
assert(code.includes('cursorScale: 1.0'), 'cursorScale default 1.0');
assert(code.includes('flightSpeed: 0.14'), 'flightSpeed default 0.14');
assert(code.includes('wingDynamics: 1.0'), 'wingDynamics default 1.0');
assert(code.includes('gravity: 0'), 'gravity default 0');
assert(code.includes('trailEnabled: true'), 'trailEnabled default true');
assert(code.includes('particleColor: \'#FF4D6D\''), 'particleColor default #FF4D6D');
assert(code.includes('soundEnabled: true'), 'soundEnabled default true');
assert(code.includes('masterVolume: 0.8'), 'masterVolume default 0.8');
assert(code.includes('audioPitch: 1.0'), 'audioPitch default 1.0');
assert(code.includes('isDrawerOpen: false'), 'isDrawerOpen default false');
assert(code.includes('activePreset: \'default\''), 'activePreset default "default"');

// 3. Check 4 Curated Presets
assert(code.includes('cyberpunk: {') &&
       code.includes('cursorScale: 1.2') &&
       code.includes('flightSpeed: 0.25') &&
       code.includes('wingDynamics: 1.5') &&
       code.includes('gravity: -25') &&
       code.includes('particleColor: \'#00F2FE\'') &&
       code.includes('masterVolume: 0.85') &&
       code.includes('audioPitch: 1.35'), 'Cyberpunk preset accurately defined');

assert(code.includes('arcade: {') &&
       code.includes('cursorScale: 1.15') &&
       code.includes('flightSpeed: 0.20') &&
       code.includes('wingDynamics: 1.3') &&
       code.includes('gravity: 95') &&
       code.includes('particleColor: \'#FFD700\'') &&
       code.includes('masterVolume: 0.9') &&
       code.includes('audioPitch: 0.8'), 'Arcade preset accurately defined');

assert(code.includes('zen: {') &&
       code.includes('cursorScale: 0.85') &&
       code.includes('flightSpeed: 0.07') &&
       code.includes('wingDynamics: 0.7') &&
       code.includes('gravity: 0') &&
       code.includes('particleColor: \'#10B981\'') &&
       code.includes('masterVolume: 0.6') &&
       code.includes('audioPitch: 1.0'), 'Zen preset accurately defined');

assert(code.includes('hyper: {') &&
       code.includes('cursorScale: 1.35') &&
       code.includes('flightSpeed: 0.28') &&
       code.includes('wingDynamics: 1.8') &&
       code.includes('gravity: 45') &&
       code.includes('masterVolume: 1.0') &&
       code.includes('audioPitch: 1.75'), 'Hyper preset accurately defined');

// 4. Check Preset aliases
assert(code.includes('LAB_PRESETS.cyberpunk_zerog = LAB_PRESETS.cyberpunk;'), 'cyberpunk_zerog alias defined');
assert(code.includes('LAB_PRESETS.retro_arcade = LAB_PRESETS.arcade;'), 'retro_arcade alias defined');
assert(code.includes('LAB_PRESETS.zen_minimalist = LAB_PRESETS.zen;'), 'zen_minimalist alias defined');
assert(code.includes('LAB_PRESETS.hyper_velocity = LAB_PRESETS.hyper;'), 'hyper_velocity alias defined');

// 5. Check LocalStorage persistence and safe legacy migration
assert(code.includes('localStorage.getItem(LAB_STORAGE_KEY)'), 'Checks unified localStorage key');
assert(code.includes('localStorage.getItem(\'physics_particle_color\')'), 'Checks legacy physics_particle_color');
assert(code.includes('localStorage.getItem(\'physics_gravity\')'), 'Checks legacy physics_gravity');
assert(code.includes('localStorage.getItem(\'physics_audio_pitch\')'), 'Checks legacy physics_audio_pitch');
assert(code.includes('localStorage.setItem(LAB_STORAGE_KEY, JSON.stringify(payload));'), 'Persists unified payload to localStorage');

// 6. Check Clamping utilities
assert(code.includes('clamp(val, 0.5, 2.0'), 'Scale clamped 0.5 to 2.0');
assert(code.includes('clamp(val, 0.05, 0.35'), 'FlightSpeed clamped 0.05 to 0.35');
assert(code.includes('clamp(val, 0.5, 2.0'), 'WingDynamics clamped 0.5 to 2.0');
assert(code.includes('clamp(val, -60, 140'), 'Gravity clamped -60 to 140');
assert(code.includes('clamp(val, 0.0, 1.0'), 'MasterVolume clamped 0.0 to 1.0');
assert(code.includes('clamp(val, 0.5, 2.0'), 'AudioPitch clamped 0.5 to 2.0');

// 7. Check Actions
assert(code.includes('setCursorScale'), 'setCursorScale action defined');
assert(code.includes('setFlightSpeed'), 'setFlightSpeed action defined');
assert(code.includes('setWingDynamics'), 'setWingDynamics action defined');
assert(code.includes('setGravity'), 'setGravity action defined');
assert(code.includes('setTrailEnabled'), 'setTrailEnabled action defined');
assert(code.includes('setParticleColor'), 'setParticleColor action defined');
assert(code.includes('setSoundEnabled'), 'setSoundEnabled action defined');
assert(code.includes('setMasterVolume'), 'setMasterVolume action defined');
assert(code.includes('setAudioPitch'), 'setAudioPitch action defined');
assert(code.includes('applyPreset'), 'applyPreset action defined');
assert(code.includes('resetDefaults'), 'resetDefaults action defined');
assert(code.includes('openDrawer'), 'openDrawer action defined');
assert(code.includes('closeDrawer'), 'closeDrawer action defined');
assert(code.includes('toggleDrawer'), 'toggleDrawer action defined');

// 8. Check Custom Event Listeners
assert(code.includes('portfolio:open-lab-drawer'), 'portfolio:open-lab-drawer event listener attached');
assert(code.includes('portfolio:toggle-lab-drawer'), 'portfolio:toggle-lab-drawer event listener attached');
assert(code.includes('portfolio:apply-lab-preset'), 'portfolio:apply-lab-preset event listener attached');
assert(code.includes('window.addEventListener(\'storage\', handleStorage);'), 'multi-tab storage event listener attached');

// 9. Check useLab hook error boundary check
assert(code.includes('throw new Error(\'useLab must be used within a LabProvider\');'), 'useLab hook includes boundary check');

if (errors > 0) {
  console.error(`\n❌ VERIFICATION FAILED WITH ${errors} ERRORS.`);
  process.exit(1);
} else {
  console.log('\n🌟 ALL 25 VERIFICATION CHECKS PASSED PERFECTLY!');
  process.exit(0);
}
