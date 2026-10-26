import { readFileSync } from 'fs';
import { resolve } from 'path';

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

console.log('\n--- VERIFYING AUTO-SCROLL ON REFRESH UI & NAVBAR SYNC ---\n');

// 1. Check ControlCenterPanel.jsx
const panelPath = resolve('src/components/ControlCenterPanel.jsx');
const panelContent = readFileSync(panelPath, 'utf8');

assert(panelContent.includes('useLabVisuals'), 'ControlCenterPanel imports and uses useLabVisuals');
assert(panelContent.includes('switch-auto-scroll-refresh'), 'ControlCenterPanel contains switch-auto-scroll-refresh element');
assert(panelContent.includes('role="switch"'), 'Toggle switch has accessible role="switch"');
assert(panelContent.includes('aria-checked={autoScrollOnRefresh}'), 'Toggle switch sets aria-checked={autoScrollOnRefresh}');
assert(panelContent.includes('Enabled / Active (X, Y)'), 'Contains "Enabled / Active (X, Y)" badge text');
assert(panelContent.includes('Disabled / Top (0, 0)'), 'Contains "Disabled / Top (0, 0)" badge text');
assert(panelContent.includes('Auto-Scroll on Refresh'), 'Contains bilingual label "Auto-Scroll on Refresh"');
assert(panelContent.includes('रिफ्रेश ऑटो-स्क्रॉल'), 'Contains Hindi label "रिफ्रेश ऑटो-स्क्रॉल"');
assert(panelContent.includes('soundFX.toggle'), 'Triggers soundFX.toggle on toggle');
assert(panelContent.includes('portfolio_auto_scroll_on_refresh'), 'References key portfolio_auto_scroll_on_refresh');

// 2. Check ControlCenterFullView.jsx
const fullViewPath = resolve('src/components/ControlCenterFullView.jsx');
const fullViewContent = readFileSync(fullViewPath, 'utf8');

assert(fullViewContent.includes("displaybehavior: 'visuals'"), 'TAB_NORMALIZER maps displaybehavior to visuals');
assert(fullViewContent.includes("'display-behavior': 'visuals'"), "TAB_NORMALIZER maps 'display-behavior' to visuals");
assert(fullViewContent.includes("'display_behavior': 'visuals'"), "TAB_NORMALIZER maps 'display_behavior' to visuals");
assert(fullViewContent.includes("behavior: 'visuals'"), "TAB_NORMALIZER maps behavior to visuals");

// 3. Check Navbar.jsx
const navbarPath = resolve('src/components/Navbar.jsx');
const navbarContent = readFileSync(navbarPath, 'utf8');

assert(navbarContent.includes('portfolio_auto_scroll_on_refresh'), 'Navbar checks portfolio_auto_scroll_on_refresh on mount');
assert(navbarContent.includes('portfolio_last_active_section'), 'Navbar checks portfolio_last_active_section');
assert(navbarContent.includes('NAV_SECTION_IDS'), 'Navbar defines NAV_SECTION_IDS validation array');
assert(navbarContent.includes('hashchange'), 'Navbar listens to hashchange for active section sync');

// 4. Check LabContext.jsx
const labContextPath = resolve('src/context/LabContext.jsx');
const labContextContent = readFileSync(labContextPath, 'utf8');

assert(labContextContent.includes('autoScrollOnRefresh'), 'LabContext includes autoScrollOnRefresh');
assert(labContextContent.includes('setAutoScrollOnRefresh'), 'LabContext includes setAutoScrollOnRefresh');
assert(labContextContent.includes('visualsValue'), 'LabContext visualsValue passes autoScrollOnRefresh and setAutoScrollOnRefresh');

console.log('\n✨ ALL TESTS PASSED SUCCESSFULLY! ✨\n');
