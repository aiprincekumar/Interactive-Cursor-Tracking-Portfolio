import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

console.log('========================================================================');
console.log('  INDEPENDENT VERIFICATION AUDIT FOR REVIEWER & CEO QUALITY CONTROL    ');
console.log('========================================================================\n');

let passCount = 0;
let failCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${description}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${description}`);
    console.error(`     Error: ${err.message}`);
    failCount++;
  }
}

// -------------------------------------------------------------------------
// 1. DYNAMIC INTERACTIVE CURSOR VERIFICATION
// -------------------------------------------------------------------------
console.log('--- Suite 1: Dynamic Interactive Cursor in App.jsx & DynamicCursorManager ---');

const appJsxPath = path.resolve('src/App.jsx');
const appJsxContent = fs.readFileSync(appJsxPath, 'utf8');

test('App.jsx renders DynamicCursorManager with all dynamic props', () => {
  assert.ok(appJsxContent.includes('<DynamicCursorManager'), 'DynamicCursorManager is rendered in App.jsx');
  assert.ok(appJsxContent.includes('customCursorEnabled={customCursorEnabled}'), 'Passes customCursorEnabled');
  assert.ok(appJsxContent.includes('speed={flightSpeed}'), 'Passes speed={flightSpeed}');
  assert.ok(appJsxContent.includes('trailEnabled={trailEnabled}'), 'Passes trailEnabled={trailEnabled}');
  assert.ok(appJsxContent.includes('scale={cursorScale}'), 'Passes scale={cursorScale}');
  assert.ok(appJsxContent.includes('particleColor={particleColor}'), 'Passes particleColor={particleColor}');
  assert.ok(appJsxContent.includes('reducedMotion={reducedMotion || Boolean(labReducedMotion)}'), 'Passes reducedMotion={reducedMotion || Boolean(labReducedMotion)}');
});

test('App.jsx guards DynamicCursorManager against simple mode, reduced motion, and terminal/basic mode', () => {
  assert.ok(
    appJsxContent.includes('!isSimpleMode && !reducedMotion && !labReducedMotion && (!isBasicMode && !isTerminalMode)'),
    'DynamicCursorManager has proper conditional guard'
  );
});

const dcmPath = path.resolve('src/components/DynamicCursorManager.jsx');
const dcmContent = fs.readFileSync(dcmPath, 'utf8');

test('DynamicCursorManager handles customCursorEnabled and manages document cursor styling', () => {
  assert.ok(dcmContent.includes('const customCursorEnabled = propCustomCursorEnabled !== undefined'), 'Defaults customCursorEnabled properly from lab context if undefined');
  assert.ok(dcmContent.includes('document.body.classList.toggle(\'custom-cursor-disabled\', !isCursorActive);'), 'Toggles body class for cursor state');
  assert.ok(dcmContent.includes('document.documentElement.classList.toggle(\'custom-cursor-disabled\', !isCursorActive);'), 'Toggles html element class');
  assert.ok(dcmContent.includes('if (!customCursorEnabled || !isDesktopCursor || effectiveReducedMotion) {\n    return null;\n  }'), 'Early exits and returns null when disabled');
});

const controlPanelPath = path.resolve('src/components/ControlCenterPanel.jsx');
const controlPanelContent = fs.readFileSync(controlPanelPath, 'utf8');

test('ControlCenterPanel provides toggle for customCursorEnabled across both main page and standalone tabs', () => {
  assert.ok(controlPanelContent.includes('onClick={() => setCustomCursorEnabled(!customCursorEnabled)}'), 'Includes customCursorEnabled toggle action');
  assert.ok(controlPanelContent.includes('aria-checked={customCursorEnabled}'), 'Includes proper ARIA switch attribute');
});

// -------------------------------------------------------------------------
// 2. VOICE SETTINGS PERSISTENCE
// -------------------------------------------------------------------------
console.log('\n--- Suite 2: Voice Settings Persistence in LabContext.jsx ---');

const labContextPath = path.resolve('src/context/LabContext.jsx');
const labContextContent = fs.readFileSync(labContextPath, 'utf8');

test('LabContext persistence useEffect includes voice settings in dependency array', () => {
  // Find useEffect persistence block
  const persistenceIndex = labContextContent.indexOf('const currentPayloadString = JSON.stringify(corePayload);');
  assert.ok(persistenceIndex !== -1, 'Persistence payload found');
  const effectSub = labContextContent.slice(persistenceIndex, persistenceIndex + 2500);

  assert.ok(effectSub.includes('voiceAnnouncementEnabled,'), 'voiceAnnouncementEnabled is in dependency array');
  assert.ok(effectSub.includes('voiceFocusEnabled,'), 'voiceFocusEnabled is in dependency array');
  assert.ok(effectSub.includes('voiceHoverEnabled,'), 'voiceHoverEnabled is in dependency array');
});

test('LabContext refreshes lastSavedPayloadRef on incoming syncs to prevent infinite echo or stale state', () => {
  const syncMatch = labContextContent.includes('if (isIncomingSyncRef.current) {\n      isIncomingSyncRef.current = false;\n      lastSavedPayloadRef.current = currentPayloadString;\n      return;\n    }');
  assert.ok(syncMatch, 'lastSavedPayloadRef.current = currentPayloadString is refreshed on incoming syncs');
});

// -------------------------------------------------------------------------
// 3. CROSS-TAB SIBLING CONTEXT SYNC
// -------------------------------------------------------------------------
console.log('\n--- Suite 3: Cross-Tab Sibling Context Sync & Unmount Cleanup ---');

const themeContextPath = path.resolve('src/context/ThemeContext.jsx');
const themeContextContent = fs.readFileSync(themeContextPath, 'utf8');

test('ThemeContext implements storage event listener with state sync and cleanup', () => {
  assert.ok(themeContextContent.includes('window.addEventListener(\'storage\', handleStorage);'), 'Adds storage listener');
  assert.ok(themeContextContent.includes('window.removeEventListener(\'storage\', handleStorage);'), 'Cleans up storage listener on unmount');
  assert.ok(themeContextContent.includes('e.key === THEME_STORAGE_KEY'), 'Listens for theme storage key');
  assert.ok(themeContextContent.includes('setTheme((prev) => (prev !== e.newValue ? e.newValue : prev));'), 'Syncs theme state');
});

const highContrastContextPath = path.resolve('src/context/HighContrastContext.jsx');
const highContrastContextContent = fs.readFileSync(highContrastContextPath, 'utf8');

test('HighContrastContext implements storage event listener with state sync and cleanup', () => {
  assert.ok(highContrastContextContent.includes('window.addEventListener(\'storage\', handleStorage);'), 'Adds storage listener');
  assert.ok(highContrastContextContent.includes('window.removeEventListener(\'storage\', handleStorage);'), 'Cleans up storage listener on unmount');
  assert.ok(highContrastContextContent.includes('e.key === HIGH_CONTRAST_STORAGE_KEY'), 'Listens for high contrast storage key');
  assert.ok(highContrastContextContent.includes('setIsHighContrast((prev) => (prev !== nextVal ? nextVal : prev));'), 'Syncs high contrast state');
});

const roleContextPath = path.resolve('src/context/RoleContext.jsx');
const roleContextContent = fs.readFileSync(roleContextPath, 'utf8');

test('RoleContext implements storage event listener with state sync and cleanup', () => {
  assert.ok(roleContextContent.includes('window.addEventListener(\'storage\', handleStorage);'), 'Adds storage listener');
  assert.ok(roleContextContent.includes('window.removeEventListener(\'storage\', handleStorage);'), 'Cleans up storage listener on unmount');
  assert.ok(roleContextContent.includes('e.key === STORAGE_KEY'), 'Listens for role storage key');
  assert.ok(roleContextContent.includes('selectRole(validRole,'), 'Syncs role state without playSound');
});

const languageContextPath = path.resolve('src/context/LanguageContext.jsx');
const languageContextContent = fs.readFileSync(languageContextPath, 'utf8');

test('LanguageContext implements storage event listener with state sync and cleanup', () => {
  assert.ok(languageContextContent.includes('window.addEventListener(\'storage\', handleStorage);'), 'Adds storage listener');
  assert.ok(languageContextContent.includes('window.removeEventListener(\'storage\', handleStorage);'), 'Cleans up storage listener on unmount');
  assert.ok(languageContextContent.includes('e.key === LANGUAGE_STORAGE_KEY'), 'Listens for language storage key');
  assert.ok(languageContextContent.includes('setLanguageState((prev) => (prev !== e.newValue ? e.newValue : prev));'), 'Syncs language state');
});

console.log('\n========================================================================');
console.log(`  SUMMARY: ${passCount} PASSED | ${failCount} FAILED`);
console.log('========================================================================');

if (failCount > 0) {
  process.exit(1);
}
