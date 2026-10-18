/**
 * ============================================================================
 * FORENSIC INTEGRITY AUDIT TEST: WORKER 2 LAB_STUDIO_STATE REMEDIATION
 * ============================================================================
 * Auditor: auditor_cc_2 (Forensic Auditor, Milestone 4)
 * Target: src/context/LabContext.jsx
 *
 * Objectives:
 * 1. Anti-Cheat & Facade Detection: Ensure migration logic dynamically parses
 *    JSON rather than returning hardcoded test constants (e.g., 0.35, 1.75).
 * 2. Mathematical Clamping & Validation: Verify genuine numeric clamping and
 *    sanitization functions on deserialized legacy payloads.
 * 3. Resilience & Defensive Degradation: Test corrupt JSON, primitive types,
 *    empty payloads, and extreme values.
 * 4. Architectural Hierarchy: Verify Tier 1 (portfolio_control_center) takes
 *    precedence over Tier 2 (lab_studio_state), and verify nested vs flat schemas.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'vite';

console.log('========================================================================');
console.log('  FORENSIC INTEGRITY AUDIT TEST HARNESS (auditor_cc_2)                  ');
console.log('  Remediation Verification for Milestone 4 (Worker 2)                   ');
console.log('========================================================================\n');

// 1. Mock Browser Environment
class MockStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
  get length() {
    return this.store.size;
  }
}

const mockLocalStorage = new MockStorage();
global.localStorage = mockLocalStorage;

global.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => true
};

global.document = {
  body: {
    classList: {
      toggle: () => {},
      add: () => {},
      remove: () => {},
      contains: () => false
    }
  },
  documentElement: {
    classList: {
      toggle: () => {},
      add: () => {},
      remove: () => {},
      contains: () => false
    }
  }
};

// Start Vite server to load LabContext module
const viteServer = await createServer();
const labContextModule = await viteServer.ssrLoadModule('./src/context/LabContext.jsx');

const {
  CONTROL_CENTER_STORAGE_KEY,
  LAB_STORAGE_KEY,
  LEGACY_STUDIO_STORAGE_KEY,
  FACTORY_DEFAULTS,
  loadSavedControlCenterConfig
} = labContextModule;

let testsTotal = 0;
let testsPassed = 0;
const violations = [];

function assertForensic(condition, description, detail = '') {
  testsTotal++;
  if (condition) {
    testsPassed++;
    console.log(`  ✅ [PASS] ${description}`);
  } else {
    violations.push({ description, detail });
    console.error(`  ❌ [INTEGRITY VIOLATION / FAIL] ${description} | Detail: ${detail}`);
  }
}

// ---------------------------------------------------------------------------
// CHECK 1: Dynamic Parsing & Anti-Hardcoding Verification
// ---------------------------------------------------------------------------
console.log('--- CHECK 1: Dynamic Deserialization (Anti-Hardcoding) ---');

// We use 5 arbitrary, randomized test vectors completely distinct from the
// values used in Challenger 1's stress test harness (0.35 and 1.75)
const dynamicVectors = [
  { volume: 0.22, scale: 0.85, pitch: 1.15, mode: 'universal', speed: 'dreamy', color: '#112233' },
  { volume: 0.67, scale: 1.45, pitch: 0.75, mode: 'dynamic', speed: 'snappy', color: '#445566' },
  { volume: 0.91, scale: 1.95, pitch: 1.85, mode: 'universal', speed: 'natural', color: '#778899' },
  { volume: 0.05, scale: 0.55, pitch: 0.55, mode: 'dynamic', speed: 'dreamy', color: '#AABBCC' },
  { volume: 0.50, scale: 1.20, pitch: 1.40, mode: 'universal', speed: 'snappy', color: '#DDEEFF' },
];

for (let i = 0; i < dynamicVectors.length; i++) {
  const v = dynamicVectors[i];
  mockLocalStorage.clear();
  mockLocalStorage.setItem('lab_studio_state', JSON.stringify({
    soundEnabled: true,
    masterVolume: v.volume,
    cursorScale: v.scale,
    pitchMultiplier: v.pitch,
    soundMatchingMode: v.mode,
    flightSpeed: v.speed,
    particleColor: v.color
  }));

  const config = loadSavedControlCenterConfig();
  assertForensic(
    Math.abs(config.audio.masterVolume - v.volume) < 0.001,
    `Vector ${i + 1}: Dynamically parsed volume ${v.volume}`,
    `Expected ${v.volume}, got ${config.audio.masterVolume}`
  );
  assertForensic(
    Math.abs(config.cursor.cursorScale - v.scale) < 0.001,
    `Vector ${i + 1}: Dynamically parsed cursorScale ${v.scale}`,
    `Expected ${v.scale}, got ${config.cursor.cursorScale}`
  );
  assertForensic(
    Math.abs(config.audio.pitchMultiplier - v.pitch) < 0.001,
    `Vector ${i + 1}: Dynamically parsed pitchMultiplier ${v.pitch}`,
    `Expected ${v.pitch}, got ${config.audio.pitchMultiplier}`
  );
  assertForensic(
    config.audio.soundMatchingMode === v.mode,
    `Vector ${i + 1}: Dynamically parsed soundMatchingMode '${v.mode}'`,
    `Expected '${v.mode}', got '${config.audio.soundMatchingMode}'`
  );
  assertForensic(
    config.cursor.flightLerpSpeed === v.speed,
    `Vector ${i + 1}: Dynamically parsed flightLerpSpeed '${v.speed}'`,
    `Expected '${v.speed}', got '${config.cursor.flightLerpSpeed}'`
  );
  assertForensic(
    config.cursor.particleColor === v.color,
    `Vector ${i + 1}: Dynamically parsed particleColor '${v.color}'`,
    `Expected '${v.color}', got '${config.cursor.particleColor}'`
  );
}

// ---------------------------------------------------------------------------
// CHECK 2: Mathematical Clamping & Sanitization Verification
// ---------------------------------------------------------------------------
console.log('\n--- CHECK 2: Mathematical Clamping & Value Sanitization ---');

const clampingVectors = [
  // Percentage volume conversion (e.g., 80 -> 0.8)
  {
    input: { masterVolume: 80 },
    test: (res) => Math.abs(res.audio.masterVolume - 0.8) < 0.001,
    desc: 'Percentage volume 80 converted to 0.8 (80% / 100)'
  },
  // Extreme percentage overflow > 100%
  {
    input: { masterVolume: 250 },
    test: (res) => res.audio.masterVolume === 1.0,
    desc: 'Percentage volume overflow 250 clamped to 1.0'
  },
  // Extreme low volume
  {
    input: { masterVolume: -4.2 },
    test: (res) => res.audio.masterVolume === 0.0,
    desc: 'Volume underflow -4.2 clamped to 0.0'
  },
  // Scale overflow
  {
    input: { cursorScale: 100 },
    test: (res) => res.cursor.cursorScale === 2.0,
    desc: 'Cursor scale 100 clamped to 2.0'
  },
  // Scale underflow
  {
    input: { cursorScale: 0.01 },
    test: (res) => res.cursor.cursorScale === 0.5,
    desc: 'Cursor scale 0.01 clamped to 0.5'
  },
  // Hero characterZoom overflow
  {
    input: { characterZoom: 8.5 },
    test: (res) => res.hero.characterZoom === 2.0,
    desc: 'Hero characterZoom 8.5 clamped to 2.0'
  },
  // Hero pose override out of bounds
  {
    input: { poseOverride: 42 },
    test: (res) => res.hero.poseOverride === null,
    desc: 'Pose override 42 normalized to null'
  },
  // Hero pose override valid
  {
    input: { poseOverride: 7 },
    test: (res) => res.hero.poseOverride === 7,
    desc: 'Pose override 7 preserved as 7'
  },
  // Particle color invalid hex
  {
    input: { particleColor: 'rgba(0,0,0,1)' },
    test: (res) => res.cursor.particleColor === '#FF4D6D',
    desc: 'Invalid color rgba(0,0,0,1) sanitized to #FF4D6D'
  },
  // Particle color valid 3-digit hex
  {
    input: { particleColor: '#0FA' },
    test: (res) => res.cursor.particleColor === '#0FA',
    desc: 'Valid 3-digit color #0FA accepted'
  }
];

for (const cv of clampingVectors) {
  mockLocalStorage.clear();
  mockLocalStorage.setItem('lab_studio_state', JSON.stringify(cv.input));
  const res = loadSavedControlCenterConfig();
  assertForensic(cv.test(res), cv.desc);
}

// ---------------------------------------------------------------------------
// CHECK 3: Corrupt JSON & Defensive Fallback Verification
// ---------------------------------------------------------------------------
console.log('\n--- CHECK 3: Corrupt JSON & Defensive Fallbacks ---');

const malformedPayloads = [
  '{ not valid json at all :::',
  'undefined',
  'null',
  '""',
  '12345',
  '[ "array", "not", "object" ]',
  '<!doctype html><html><body>Error 500</body></html>',
  '{"audio": { "masterVolume": ' // truncated
];

for (const payload of malformedPayloads) {
  mockLocalStorage.clear();
  mockLocalStorage.setItem('lab_studio_state', payload);
  let res = null;
  let error = null;
  try {
    res = loadSavedControlCenterConfig();
  } catch (err) {
    error = err;
  }

  assertForensic(
    error === null && res !== null && typeof res === 'object',
    `Safely handled malformed payload: ${payload.slice(0, 25)}...`,
    error ? error.message : ''
  );
  assertForensic(
    res.audio.masterVolume === FACTORY_DEFAULTS.audio.masterVolume &&
    res.cursor.cursorScale === FACTORY_DEFAULTS.cursor.cursorScale,
    `Fell back cleanly to FACTORY_DEFAULTS for malformed payload: ${payload.slice(0, 25)}...`
  );
}

// ---------------------------------------------------------------------------
// CHECK 4: Dual Schema Normalization (Nested vs Flat)
// ---------------------------------------------------------------------------
console.log('\n--- CHECK 4: Nested vs Flat Schema Normalization ---');

// Flat schema
mockLocalStorage.clear();
mockLocalStorage.setItem('lab_studio_state', JSON.stringify({
  masterVolume: 0.38,
  cursorScale: 1.18,
  pitchMultiplier: 1.35,
  gazeMode: 'fixed'
}));
const flatRes = loadSavedControlCenterConfig();
assertForensic(
  flatRes.audio.masterVolume === 0.38 &&
  flatRes.cursor.cursorScale === 1.18 &&
  flatRes.audio.pitchMultiplier === 1.35 &&
  flatRes.hero.gazeMode === 'fixed',
  'Flat schema legacy properties migrated cleanly'
);

// Nested schema
mockLocalStorage.clear();
mockLocalStorage.setItem('lab_studio_state', JSON.stringify({
  audio: { masterVolume: 0.44, pitchMultiplier: 0.95 },
  cursor: { cursorScale: 1.62 },
  hero: { gazeMode: 'fixed', poseOverride: 2 }
}));
const nestedRes = loadSavedControlCenterConfig();
assertForensic(
  nestedRes.audio.masterVolume === 0.44 &&
  nestedRes.cursor.cursorScale === 1.62 &&
  nestedRes.audio.pitchMultiplier === 0.95 &&
  nestedRes.hero.poseOverride === 2,
  'Nested schema legacy properties migrated cleanly'
);

// Nested priority over flat
mockLocalStorage.clear();
mockLocalStorage.setItem('lab_studio_state', JSON.stringify({
  audio: { masterVolume: 0.52 },
  masterVolume: 0.15, // flat candidate
  cursor: { cursorScale: 1.70 },
  cursorScale: 0.90   // flat candidate
}));
const priorityRes = loadSavedControlCenterConfig();
assertForensic(
  priorityRes.audio.masterVolume === 0.52 && priorityRes.cursor.cursorScale === 1.70,
  'Nested properties take precedence over flat properties within legacy payload'
);

// ---------------------------------------------------------------------------
// CHECK 5: Tier 1 Atomic Precedence over Tier 2 Legacy Migration
// ---------------------------------------------------------------------------
console.log('\n--- CHECK 5: Storage Tier Hierarchy (Tier 1 vs Tier 2) ---');

mockLocalStorage.clear();
// Store Tier 1 modern configuration
mockLocalStorage.setItem(CONTROL_CENTER_STORAGE_KEY, JSON.stringify({
  version: 2,
  audio: { soundEnabled: true, masterVolume: 0.99, pitchMultiplier: 1.99, soundMatchingMode: 'dynamic' },
  cursor: { customCursorEnabled: true, cursorScale: 1.99, flightLerpSpeed: 'snappy', stardustTrailEnabled: true, particleColor: '#FF4D6D' },
  hero: { gazeMode: 'auto', poseOverride: null, characterZoom: 1.99, flashConfettiEnabled: true },
  preferences: { defaultStartupRole: 'controller', defaultCursorEnabled: true, defaultAudioEnabled: true, reducedMotion: false }
}));

// Also store Tier 2 legacy configuration
mockLocalStorage.setItem('lab_studio_state', JSON.stringify({
  masterVolume: 0.11,
  cursorScale: 0.66
}));

const tierRes = loadSavedControlCenterConfig();
assertForensic(
  tierRes.audio.masterVolume === 0.99 && tierRes.cursor.cursorScale === 1.99,
  'Tier 1 (portfolio_control_center) strictly takes precedence over Tier 2 legacy keys'
);

// ---------------------------------------------------------------------------
// CHECK 6: Source Code Integrity & Facade Scan
// ---------------------------------------------------------------------------
console.log('\n--- CHECK 6: Source Code Integrity & Facade Scan ---');

const sourcePath = path.resolve(process.cwd(), 'src/context/LabContext.jsx');
const source = fs.readFileSync(sourcePath, 'utf8');

// Check that LEGACY_STUDIO_STORAGE_KEY is exported
assertForensic(
  source.includes('export const LEGACY_STUDIO_STORAGE_KEY ='),
  "LabContext.jsx exports LEGACY_STUDIO_STORAGE_KEY constant"
);

// Check that loadSavedControlCenterConfig queries both keys
assertForensic(
  source.includes('rawLegacyStudio') && source.includes('LEGACY_STUDIO_STORAGE_KEY'),
  "loadSavedControlCenterConfig queries LEGACY_STUDIO_STORAGE_KEY"
);

// Check that no test cheats exist
assertForensic(
  !source.includes('0.35') || source.includes('//') && !source.match(/return\s*\{[^}]*0\.35/),
  "Zero hardcoded test returns (0.35) found in LabContext"
);
assertForensic(
  !source.includes('1.75') || source.includes('//') && !source.match(/return\s*\{[^}]*1\.75/),
  "Zero hardcoded test returns (1.75) found in LabContext"
);
assertForensic(
  !source.includes('test_challenger') && !source.includes('isTesting'),
  "Zero test-runner or test-harness bypass conditionals found in LabContext"
);

console.log('\n========================================================================');
console.log(`  FORENSIC AUDIT SUMMARY: ${testsPassed} / ${testsTotal} CHECKS PASSED`);
if (violations.length === 0) {
  console.log('  VERDICT: CLEAN (No integrity violations detected)');
} else {
  console.log(`  VERDICT: INTEGRITY VIOLATION (${violations.length} violations detected)`);
}
console.log('========================================================================\n');

await viteServer.close();
process.exit(violations.length === 0 ? 0 : 1);
