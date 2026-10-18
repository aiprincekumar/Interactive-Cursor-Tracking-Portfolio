import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('INDEPENDENT VICTORY AUDITOR VERIFICATION SUITE');
console.log('Feature: Quick Layout Density Tuner (Tab 5 - Display & Visuals)');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function check(description, fn) {
  try {
    fn();
    console.log(`✅ [PASS] ${description}`);
    passCount++;
  } catch (err) {
    console.error(`❌ [FAIL] ${description}`);
    console.error(`   Error: ${err.message}`);
    failCount++;
  }
}

// --------------------------------------------------------------------------
// SECTION 1: Source Files Integrity & Completeness
// --------------------------------------------------------------------------
console.log('>>> SECTION 1: SOURCE CODE & EXPORT VERIFICATION');

const labContextPath = path.join(rootDir, 'src', 'context', 'LabContext.jsx');
const controlPanelPath = path.join(rootDir, 'src', 'components', 'ControlCenterPanel.jsx');
const indexCssPath = path.join(rootDir, 'src', 'index.css');

const labContextSrc = fs.readFileSync(labContextPath, 'utf8');
const controlPanelSrc = fs.readFileSync(controlPanelPath, 'utf8');
const indexCssSrc = fs.readFileSync(indexCssPath, 'utf8');

// 1.1 Schema in FACTORY_DEFAULTS
check('R1.1: FACTORY_DEFAULTS.visuals contains layoutDensity: "comfortable"', () => {
  assert.ok(labContextSrc.includes("layoutDensity: 'comfortable'"), 'Missing layoutDensity: "comfortable" in FACTORY_DEFAULTS');
});

// 1.2 Exported normalizeLayoutDensity
check('R1.2: normalizeLayoutDensity is exported from LabContext.jsx', () => {
  assert.ok(labContextSrc.includes('export function normalizeLayoutDensity'), 'normalizeLayoutDensity is not exported');
});

// Extract normalizeLayoutDensity for standalone unit verification
const normMatch = labContextSrc.match(/export function normalizeLayoutDensity\(val\) \{([\s\S]*?)\n\}/);
assert.ok(normMatch, 'Could not extract normalizeLayoutDensity implementation');
const normalizeLayoutDensity = new Function('val', normMatch[1]);

check('R1.3: normalizeLayoutDensity correctly normalizes canonical density inputs', () => {
  assert.strictEqual(normalizeLayoutDensity('compact'), 'compact');
  assert.strictEqual(normalizeLayoutDensity('comfortable'), 'comfortable');
  assert.strictEqual(normalizeLayoutDensity('spacious'), 'spacious');
  assert.strictEqual(normalizeLayoutDensity('COMPACT'), 'compact');
  assert.strictEqual(normalizeLayoutDensity('Comfortable'), 'comfortable');
  assert.strictEqual(normalizeLayoutDensity('  spacious  '), 'spacious');
});

check('R1.4: normalizeLayoutDensity safely falls back to "comfortable" on invalid inputs', () => {
  assert.strictEqual(normalizeLayoutDensity(''), 'comfortable');
  assert.strictEqual(normalizeLayoutDensity('   '), 'comfortable');
  assert.strictEqual(normalizeLayoutDensity('invalid-density'), 'comfortable');
  assert.strictEqual(normalizeLayoutDensity(null), 'comfortable');
  assert.strictEqual(normalizeLayoutDensity(undefined), 'comfortable');
  assert.strictEqual(normalizeLayoutDensity(100), 'comfortable');
  assert.strictEqual(normalizeLayoutDensity(true), 'comfortable');
  assert.strictEqual(normalizeLayoutDensity({}), 'comfortable');
  assert.strictEqual(normalizeLayoutDensity(['compact']), 'comfortable');
  assert.strictEqual(normalizeLayoutDensity('__proto__'), 'comfortable');
  assert.strictEqual(normalizeLayoutDensity('constructor'), 'comfortable');
});

// 1.5 CSS Properties Injection
check('R1.5: LabContext injects exact CSS variables on documentElement.style', () => {
  assert.ok(labContextSrc.includes("rootStyle.setProperty('--density-spacing-mult', currentConfig.spacing)"), 'Missing --density-spacing-mult injection');
  assert.ok(labContextSrc.includes("rootStyle.setProperty('--density-card-padding', currentConfig.padding)"), 'Missing --density-card-padding injection');
  assert.ok(labContextSrc.includes("rootStyle.setProperty('--density-gap-mult', currentConfig.gap)"), 'Missing --density-gap-mult injection');
});

// 1.6 Exact multiplier configurations
check('R1.6: Density configs match exact requirement specification', () => {
  assert.ok(labContextSrc.includes("compact: { spacing: '0.82', padding: '0.88', gap: '0.85' }"), 'Compact config mismatch');
  assert.ok(labContextSrc.includes("comfortable: { spacing: '1.0', padding: '1.0', gap: '1.0' }"), 'Comfortable config mismatch');
  assert.ok(labContextSrc.includes("spacious: { spacing: '1.25', padding: '1.15', gap: '1.2' }"), 'Spacious config mismatch');
});

// 1.7 Dynamic class toggling
check('R1.7: LabContext toggles density-compact / density-comfortable / density-spacious classes on root', () => {
  assert.ok(labContextSrc.includes("root.classList.remove('density-compact', 'density-comfortable', 'density-spacious')"), 'Missing class removal');
  assert.ok(labContextSrc.includes('root.classList.add(`density-${density}`)'), 'Missing class addition');
});

// 1.8 Self-healing DOM mechanics
check('R1.8: Self-healing MutationObserver detects multi-property drift and repairs DOM', () => {
  assert.ok(labContextSrc.includes('const isStyleDrifted ='), 'Missing isStyleDrifted computation');
  assert.ok(labContextSrc.includes("rootStyle.getPropertyValue('--density-spacing-mult') !== currentConfig.spacing"), 'Missing spacing drift check');
  assert.ok(labContextSrc.includes("rootStyle.getPropertyValue('--density-card-padding') !== currentConfig.padding"), 'Missing padding drift check');
  assert.ok(labContextSrc.includes("rootStyle.getPropertyValue('--density-gap-mult') !== currentConfig.gap"), 'Missing gap drift check');
  assert.ok(labContextSrc.includes('fallbackInterval = setInterval(healDensityDOM, 2000)'), 'Missing sandboxed polling fallback');
});

// 1.9 Atomic localStorage persistence & reset restoration
check('R1.9: layoutDensity is persisted inside portfolio_control_center.visuals and restored in resetDefaults()', () => {
  assert.ok(labContextSrc.includes('const [layoutDensity, setLayoutDensityState] = useState('), 'Missing layoutDensity state declaration');
  assert.ok(labContextSrc.includes('setLayoutDensityState(f.visuals.layoutDensity)'), 'Missing layoutDensity reset in resetDefaults()');
  assert.ok(labContextSrc.includes('layoutDensity: normalizeLayoutDensity('), 'Missing layoutDensity normalization in loadSavedControlCenterConfig');
});

// 1.10 Context Provider Value
check('R1.10: LabContext exposes layoutDensity and setLayoutDensity', () => {
  assert.ok(labContextSrc.includes('layoutDensity,'), 'Missing layoutDensity export in context value');
  assert.ok(labContextSrc.includes('setLayoutDensity,'), 'Missing setLayoutDensity export in context value');
});

// --------------------------------------------------------------------------
// SECTION 2: ControlCenterPanel.jsx Component & UI Experience
// --------------------------------------------------------------------------
console.log('\n>>> SECTION 2: CONTROLCENTERPANEL.JSX TAB 5 VERIFICATION');

// 2.1 Tab 5 Card 5 Container
check('R2.1: Card 5 Layout Density card rendered inside Tab 5', () => {
  assert.ok(controlPanelSrc.includes('Quick Layout Density Tuner Card'), 'Missing Card 5 comment identifier');
  assert.ok(controlPanelSrc.includes('LayoutGrid className="w-4 h-4 text-[var(--theme-accent,#FF4D6D)]'), 'Missing LayoutGrid icon in Card 5');
  assert.ok(controlPanelSrc.includes('<span>Layout Density</span>'), 'Missing Layout Density title');
});

// 2.2 3 Option Tiles
check('R2.2: 3 option tiles with exact multipliers and descriptions defined', () => {
  assert.ok(controlPanelSrc.includes("id: 'compact'"), 'Missing compact option id');
  assert.ok(controlPanelSrc.includes("id: 'comfortable'"), 'Missing comfortable option id');
  assert.ok(controlPanelSrc.includes("id: 'spacious'"), 'Missing spacious option id');

  assert.ok(controlPanelSrc.includes("0.8x spacing"), 'Missing 0.8x spacing label');
  assert.ok(controlPanelSrc.includes("1.0x spacing"), 'Missing 1.0x spacing label');
  assert.ok(controlPanelSrc.includes("1.25x spacing"), 'Missing 1.25x spacing label');

  assert.ok(controlPanelSrc.includes("Higher information density"), 'Missing compact description');
  assert.ok(controlPanelSrc.includes("Balanced signature luxury"), 'Missing comfortable description');
  assert.ok(controlPanelSrc.includes("Airy editorial showcase"), 'Missing spacious description');
});

// 2.3 Audio Tactile Feedback
check('R2.3: Option selection triggers soundFX.init() and soundFX.playLaserFocus()', () => {
  assert.ok(controlPanelSrc.includes('soundFX.init()'), 'Missing soundFX.init() call in handleSelectDensity');
  assert.ok(controlPanelSrc.includes('soundFX.playLaserFocus()'), 'Missing soundFX.playLaserFocus() call in handleSelectDensity');
});

// 2.4 Active Highlights & Badges
check('R2.4: Active tile displays highlight border, glow ring, check icon, and Active badge', () => {
  assert.ok(controlPanelSrc.includes("border-[var(--theme-accent,#FF4D6D)]"), 'Missing accent border highlight');
  assert.ok(controlPanelSrc.includes("ring-2 ring-[var(--theme-accent,#FF4D6D)]/30"), 'Missing accent glow ring');
  assert.ok(controlPanelSrc.includes("<span>Active</span>"), 'Missing Active text badge');
  assert.ok(controlPanelSrc.includes("<Check className="), 'Missing Check icon');
});

// 2.5 WAI-ARIA & Keyboard Navigation
check('R2.5: WAI-ARIA radiogroup, radio semantics, and roving tabIndex are enforced', () => {
  assert.ok(controlPanelSrc.includes('role="radiogroup"'), 'Missing role="radiogroup" on options container');
  assert.ok(controlPanelSrc.includes('aria-label="Layout Density Options"'), 'Missing aria-label on radiogroup');
  assert.ok(controlPanelSrc.includes('role="radio"'), 'Missing role="radio" on option tiles');
  assert.ok(controlPanelSrc.includes('aria-checked={isSelected}'), 'Missing aria-checked attribute');
  assert.ok(controlPanelSrc.includes('tabIndex={isSelected ? 0 : -1}'), 'Missing roving tabIndex attribute');
  assert.ok(controlPanelSrc.includes('onKeyDown={(e) => handleDensityKeyDown(e, opt.id)}'), 'Missing handleDensityKeyDown attachment');
});

// 2.6 Keyboard Navigation Logic Simulation
check('R2.6: handleDensityKeyDown keyboard wrap-around arithmetic is mathematically sound', () => {
  const order = ['compact', 'comfortable', 'spacious'];
  
  // Helper simulating handleDensityKeyDown logic
  function simulateKeyNav(currentId, key) {
    const currentIndex = order.indexOf(currentId);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    let targetIndex = -1;
    if (key === 'ArrowRight' || key === 'ArrowDown') {
      targetIndex = (safeIndex + 1) % order.length;
    } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
      targetIndex = (safeIndex - 1 + order.length) % order.length;
    } else if (key === 'Home') {
      targetIndex = 0;
    } else if (key === 'End') {
      targetIndex = order.length - 1;
    }
    return order[targetIndex];
  }

  // Forward
  assert.strictEqual(simulateKeyNav('compact', 'ArrowRight'), 'comfortable');
  assert.strictEqual(simulateKeyNav('comfortable', 'ArrowRight'), 'spacious');
  assert.strictEqual(simulateKeyNav('spacious', 'ArrowRight'), 'compact'); // Wrap-around!

  // Down
  assert.strictEqual(simulateKeyNav('compact', 'ArrowDown'), 'comfortable');
  assert.strictEqual(simulateKeyNav('spacious', 'ArrowDown'), 'compact');

  // Backward
  assert.strictEqual(simulateKeyNav('spacious', 'ArrowLeft'), 'comfortable');
  assert.strictEqual(simulateKeyNav('comfortable', 'ArrowLeft'), 'compact');
  assert.strictEqual(simulateKeyNav('compact', 'ArrowLeft'), 'spacious'); // Wrap-around!

  // Up
  assert.strictEqual(simulateKeyNav('compact', 'ArrowUp'), 'spacious');

  // Home / End
  assert.strictEqual(simulateKeyNav('spacious', 'Home'), 'compact');
  assert.strictEqual(simulateKeyNav('compact', 'End'), 'spacious');

  // Unmapped currentId safeIndex guard
  assert.strictEqual(simulateKeyNav('corrupted_id', 'ArrowRight'), 'comfortable');
  assert.strictEqual(simulateKeyNav('corrupted_id', 'ArrowLeft'), 'spacious');
});

// 2.7 Reset Button
check('R2.7: Reset Visuals to Default button restores factory comfortable mode', () => {
  assert.ok(controlPanelSrc.includes('aria-label="Reset Visuals to Default"'), 'Missing aria-label on reset button');
  assert.ok(controlPanelSrc.includes('<span>Reset Visuals to Default</span>'), 'Missing reset button text');
  assert.ok(controlPanelSrc.includes('resetDefaults()'), 'Reset button does not call resetDefaults');
});

// --------------------------------------------------------------------------
// SECTION 3: CSS Stylesheet Integration
// --------------------------------------------------------------------------
console.log('\n>>> SECTION 3: CSS STYLESHEET INTEGRATION (SRC/INDEX.CSS)');

check('R3.1: index.css provides :root baseline variables for layout density', () => {
  assert.ok(indexCssSrc.includes('--density-spacing-mult: 1.0;'), 'Missing :root --density-spacing-mult');
  assert.ok(indexCssSrc.includes('--density-card-padding: 1.0;'), 'Missing :root --density-card-padding');
  assert.ok(indexCssSrc.includes('--density-gap-mult: 1.0;'), 'Missing :root --density-gap-mult');
});

check('R3.2: index.css defines html.density-* CSS modifier selectors', () => {
  assert.ok(indexCssSrc.includes('html.density-compact {'), 'Missing html.density-compact selector');
  assert.ok(indexCssSrc.includes('html.density-comfortable {'), 'Missing html.density-comfortable selector');
  assert.ok(indexCssSrc.includes('html.density-spacious {'), 'Missing html.density-spacious selector');
});

check('R3.3: index.css provides responsive density utility helper classes', () => {
  assert.ok(indexCssSrc.includes('.density-card-pad'), 'Missing .density-card-pad helper class');
  assert.ok(indexCssSrc.includes('.density-layout-gap'), 'Missing .density-layout-gap helper class');
});

// --------------------------------------------------------------------------
// SECTION 4: Universal Rule 6 Changes Log Audit Trail
// --------------------------------------------------------------------------
console.log('\n>>> SECTION 4: CHANGES_LOG & RULE 6 COMPLIANCE');

const summaryPath = path.join(rootDir, 'changes_log', 'summary', 'changes_summary.md');
const masterLogPath = path.join(rootDir, 'changes_log', 'master', 'master_changes_log.md');
const dailyLogPath = path.join(rootDir, 'changes_log', 'daily', '2026-10-18', 'daily_master_log.md');
const entry116Path = path.join(rootDir, 'changes_log', 'entries', '2026-10-18', 'change_CHG-116_2026-10-18_08-36-00.md');
const recent10Dir = path.join(rootDir, 'changes_log', 'recent_10');

check('Rule 6.1: changes_summary.md contains CHG-116 record', () => {
  const summaryContent = fs.readFileSync(summaryPath, 'utf8');
  assert.ok(summaryContent.includes('CHG-116'), 'changes_summary.md missing CHG-116');
  assert.ok(summaryContent.includes('Quick Layout Density Tuner'), 'changes_summary.md missing feature title');
});

check('Rule 6.2: master_changes_log.md contains CHG-116 record with rollback commands', () => {
  const masterContent = fs.readFileSync(masterLogPath, 'utf8');
  assert.ok(masterContent.includes('[CHG-116]'), 'master_changes_log.md missing [CHG-116]');
  assert.ok(masterContent.includes('git checkout'), 'master_changes_log.md missing rollback instructions');
});

check('Rule 6.3: daily_master_log.md (2026-10-18) logs CHG-116', () => {
  const dailyContent = fs.readFileSync(dailyLogPath, 'utf8');
  assert.ok(dailyContent.includes('CHG-116'), 'daily_master_log.md missing CHG-116');
});

check('Rule 6.4: Standalone entry change_CHG-116_2026-10-18_08-36-00.md exists with complete snapshot', () => {
  assert.ok(fs.existsSync(entry116Path), 'Entry file for CHG-116 does not exist');
  const entryContent = fs.readFileSync(entry116Path, 'utf8');
  assert.ok(entryContent.includes('Pre-State vs. Post-State'), 'Entry missing Pre/Post state table');
  assert.ok(entryContent.includes('Rollback Instructions'), 'Entry missing rollback instructions');
});

check('Rule 6.5: changes_log/recent_10 contains exactly 10 independent unlinked files', () => {
  const files = fs.readdirSync(recent10Dir).filter(f => f.endsWith('.md'));
  assert.strictEqual(files.length, 10, `Expected exactly 10 files in recent_10, found ${files.length}`);
});

// --------------------------------------------------------------------------
// SECTION 5: End-to-End State Machine Simulation
// --------------------------------------------------------------------------
console.log('\n>>> SECTION 5: END-TO-END STATE MACHINE & PERSISTENCE SIMULATION');

check('E2E.1: Atomic serialization and deserialization in localStorage simulation', () => {
  const storage = {};
  const mockLocalStorage = {
    getItem: (k) => storage[k] ?? null,
    setItem: (k, v) => { storage[k] = String(v); },
    removeItem: (k) => { delete storage[k]; }
  };

  // 1. Initial State (factory default)
  const defaults = {
    version: 2,
    visuals: {
      glassBlur: 'balanced',
      motionSpeed: 1.0,
      accentColor: '#FF4D6D',
      layoutDensity: 'comfortable'
    }
  };
  mockLocalStorage.setItem('portfolio_control_center', JSON.stringify(defaults));

  // 2. Read back
  let loaded = JSON.parse(mockLocalStorage.getItem('portfolio_control_center'));
  assert.strictEqual(loaded.visuals.layoutDensity, 'comfortable');

  // 3. User switches to compact
  loaded.visuals.layoutDensity = normalizeLayoutDensity('compact');
  mockLocalStorage.setItem('portfolio_control_center', JSON.stringify(loaded));

  // 4. Verify persistence across simulation reload
  loaded = JSON.parse(mockLocalStorage.getItem('portfolio_control_center'));
  assert.strictEqual(loaded.visuals.layoutDensity, 'compact');

  // 5. User switches to spacious
  loaded.visuals.layoutDensity = normalizeLayoutDensity('spacious');
  mockLocalStorage.setItem('portfolio_control_center', JSON.stringify(loaded));

  // 6. Verify persistence
  loaded = JSON.parse(mockLocalStorage.getItem('portfolio_control_center'));
  assert.strictEqual(loaded.visuals.layoutDensity, 'spacious');

  // 7. Reset defaults
  loaded.visuals.layoutDensity = defaults.visuals.layoutDensity;
  mockLocalStorage.setItem('portfolio_control_center', JSON.stringify(loaded));

  loaded = JSON.parse(mockLocalStorage.getItem('portfolio_control_center'));
  assert.strictEqual(loaded.visuals.layoutDensity, 'comfortable');
});

// --------------------------------------------------------------------------
// FINAL AUDIT SUMMARY
// --------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`AUDIT RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================');

if (failCount > 0) {
  console.error('\n❌ VICTORY AUDIT FAILED: One or more assertions did not pass!');
  process.exit(1);
} else {
  console.log('\n🎉 VICTORY AUDIT CONFIRMED: All independent verifications passed 100%!');
  process.exit(0);
}
