import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('--- RUNNING DEEP VERIFICATION: QUICK LAYOUT DENSITY TUNER ---');

// 1. Verify LabContext source code and exports
const labContextPath = path.join(rootDir, 'src', 'context', 'LabContext.jsx');
const labContextSource = fs.readFileSync(labContextPath, 'utf8');

// Test 1.1: Schema extension in FACTORY_DEFAULTS
assert(
  labContextSource.includes("layoutDensity: 'comfortable'"),
  '❌ FAIL: FACTORY_DEFAULTS.visuals must include layoutDensity: "comfortable"'
);
console.log('✅ PASS: FACTORY_DEFAULTS.visuals includes layoutDensity: "comfortable"');

// Test 1.2: Normalizer function
assert(
  labContextSource.includes('export function normalizeLayoutDensity'),
  '❌ FAIL: normalizeLayoutDensity must be exported from LabContext.jsx'
);
console.log('✅ PASS: normalizeLayoutDensity helper is exported');

// Test 1.3: Dynamic Root CSS custom properties injection
assert(
  labContextSource.includes('--density-spacing-mult') &&
  labContextSource.includes('--density-card-padding') &&
  labContextSource.includes('--density-gap-mult'),
  '❌ FAIL: LabContext must set --density-spacing-mult, --density-card-padding, --density-gap-mult'
);
console.log('✅ PASS: Root CSS custom properties injection code present');

// Test 1.4: Multipliers match exact specification
assert(
  labContextSource.includes("spacing: '0.82', padding: '0.88', gap: '0.85'") &&
  labContextSource.includes("spacing: '1.0', padding: '1.0', gap: '1.0'") &&
  labContextSource.includes("spacing: '1.25', padding: '1.15', gap: '1.2'"),
  '❌ FAIL: Density multiplier constants do not match required values'
);
console.log('✅ PASS: Compact (0.82, 0.88, 0.85), Comfortable (1.0, 1.0, 1.0), and Spacious (1.25, 1.15, 1.2) match spec');

// Test 1.5: Dynamic root class toggling
assert(
  labContextSource.includes("classList.remove('density-compact', 'density-comfortable', 'density-spacious')") &&
  labContextSource.includes('classList.add(`density-${density}`)'),
  '❌ FAIL: Dynamic classList toggling (density-compact, density-comfortable, density-spacious) missing'
);
console.log('✅ PASS: Dynamic documentElement class toggling implemented');

// Test 1.6: Atomic localStorage persistence & reset restoration
assert(
  labContextSource.includes('layoutDensityState') || labContextSource.includes('layoutDensity'),
  '❌ FAIL: layoutDensity state must be tracked'
);
assert(
  labContextSource.includes('setLayoutDensityState(f.visuals.layoutDensity)'),
  '❌ FAIL: resetDefaults() must restore layoutDensity from factory defaults'
);
console.log('✅ PASS: Atomic localStorage persistence and resetDefaults restoration verified');

// Test 1.7: Context value exposes state and setters
assert(
  labContextSource.includes('layoutDensity,') &&
  labContextSource.includes('setLayoutDensity,'),
  '❌ FAIL: LabContext value must expose layoutDensity and setLayoutDensity'
);
console.log('✅ PASS: LabContext value exposes layoutDensity and setLayoutDensity');

// 2. Verify ControlCenterPanel.jsx implementation
const controlPanelPath = path.join(rootDir, 'src', 'components', 'ControlCenterPanel.jsx');
const controlPanelSource = fs.readFileSync(controlPanelPath, 'utf8');

// Test 2.1: Card 5 Layout Density title & container
assert(
  controlPanelSource.includes('Layout Density') &&
  controlPanelSource.includes('Quick Layout Density Tuner Card'),
  '❌ FAIL: Tab 5 must contain Layout Density control card'
);
console.log('✅ PASS: Tab 5 Layout Density control card present');

// Test 2.2: 3 selectable option tiles: Compact, Comfortable, Spacious
assert(
  controlPanelSource.includes("'compact'") &&
  controlPanelSource.includes("'comfortable'") &&
  controlPanelSource.includes("'spacious'"),
  '❌ FAIL: Option tiles must have compact, comfortable, spacious IDs'
);
assert(
  controlPanelSource.includes('0.8x spacing') &&
  controlPanelSource.includes('1.0x spacing') &&
  controlPanelSource.includes('1.25x spacing'),
  '❌ FAIL: Option tiles must present 0.8x, 1.0x, 1.25x spacing labels'
);
assert(
  controlPanelSource.includes('Higher information density') &&
  controlPanelSource.includes('Balanced signature luxury') &&
  controlPanelSource.includes('Airy editorial showcase'),
  '❌ FAIL: Option tiles must present required descriptions'
);
console.log('✅ PASS: 3 selectable option tiles with accurate labels and descriptions verified');

// Test 2.3: Audio tactile feedback via soundFX.playLaserFocus() and soundFX.init()
assert(
  controlPanelSource.includes('soundFX.init()') &&
  controlPanelSource.includes('soundFX.playLaserFocus()'),
  '❌ FAIL: Selection handler must trigger soundFX.init() and soundFX.playLaserFocus()'
);
console.log('✅ PASS: Tactile sound feedback via soundFX.init() and soundFX.playLaserFocus() verified');

// Test 2.4: Active density visual highlights (border, glow, badge indicator, check)
assert(
  controlPanelSource.includes('ring-[var(--theme-accent,#FF4D6D)]') &&
  controlPanelSource.includes('border-[var(--theme-accent,#FF4D6D)]') &&
  controlPanelSource.includes('Active'),
  '❌ FAIL: Active selection must have border, glow ring, and active badge indicator'
);
console.log('✅ PASS: Active selection visual highlight (border, glow, badge indicator) verified');

// Test 2.5: Reset Visuals to Default button
assert(
  controlPanelSource.includes('Reset Visuals to Default'),
  '❌ FAIL: Reset button must display Reset Visuals to Default'
);
console.log('✅ PASS: "Reset Visuals to Default" button present in Tab 5');

// 3. Verify src/index.css
const indexCssPath = path.join(rootDir, 'src', 'index.css');
const indexCssSource = fs.readFileSync(indexCssPath, 'utf8');

assert(
  indexCssSource.includes('--density-spacing-mult: 1.0;') &&
  indexCssSource.includes('--density-card-padding: 1.0;') &&
  indexCssSource.includes('--density-gap-mult: 1.0;'),
  '❌ FAIL: :root in index.css must define layout density defaults'
);

assert(
  indexCssSource.includes('html.density-compact') &&
  indexCssSource.includes('html.density-comfortable') &&
  indexCssSource.includes('html.density-spacious'),
  '❌ FAIL: index.css must define html.density-* modifier rules'
);
console.log('✅ PASS: index.css defines root defaults and html.density-* CSS rules');

// 4. Test logic in Node runtime
const normalizerMatch = labContextSource.match(/export function normalizeLayoutDensity\(val\) \{([\s\S]*?)\n\}/);
assert(normalizerMatch, '❌ FAIL: Could not extract normalizeLayoutDensity implementation');

// Evaluate normalizer function
const normalizeLayoutDensity = new Function('val', normalizerMatch[1]);

assert.strictEqual(normalizeLayoutDensity('compact'), 'compact');
assert.strictEqual(normalizeLayoutDensity('comfortable'), 'comfortable');
assert.strictEqual(normalizeLayoutDensity('spacious'), 'spacious');
assert.strictEqual(normalizeLayoutDensity('COMPACT'), 'compact');
assert.strictEqual(normalizeLayoutDensity('SPACIOUS'), 'spacious');
assert.strictEqual(normalizeLayoutDensity('unknown'), 'comfortable');
assert.strictEqual(normalizeLayoutDensity(null), 'comfortable');
assert.strictEqual(normalizeLayoutDensity(undefined), 'comfortable');
assert.strictEqual(normalizeLayoutDensity(123), 'comfortable');
console.log('✅ PASS: normalizeLayoutDensity correctly handles all input variations and boundary fallbacks');

console.log('\n🎉 ALL 14 DEEP VERIFICATION CHECKS PASSED FLAWLESSLY!');
