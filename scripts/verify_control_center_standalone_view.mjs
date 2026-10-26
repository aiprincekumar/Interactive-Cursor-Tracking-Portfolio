import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

console.log('================================================================');
console.log('  VERIFY CONTROL CENTER STANDALONE VIEW SPECIFICATION           ');
console.log('================================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

const rootDir = process.cwd();
const fullViewPath = resolve(rootDir, 'src/components/ControlCenterFullView.jsx');
const appPath = resolve(rootDir, 'src/App.jsx');
const panelPath = resolve(rootDir, 'src/components/ControlCenterPanel.jsx');

// Check 1: File existence
assert(existsSync(fullViewPath), 'ControlCenterFullView.jsx exists on disk');
assert(existsSync(appPath), 'src/App.jsx exists on disk');

if (existsSync(fullViewPath)) {
  const fullViewCode = readFileSync(fullViewPath, 'utf8');

  // Check 2: Exports default function
  assert(
    fullViewCode.includes('export default function ControlCenterFullView'),
    'ControlCenterFullView exports default component'
  );

  // Check 3: Parses query parameters from window.location.search
  assert(
    fullViewCode.includes('URLSearchParams(window.location.search)') &&
      (fullViewCode.includes("params.get('tab')") || fullViewCode.includes('params.get("tab")')) &&
      (fullViewCode.includes("params.get('section')") || fullViewCode.includes('params.get("section")')),
    'Parses both tab and section query params from window.location.search'
  );

  // Check 4: Normalizer handles tabs and sets activeTab
  assert(
    fullViewCode.includes('setActiveTab') &&
      fullViewCode.includes('audio') &&
      fullViewCode.includes('cursor') &&
      fullViewCode.includes('hero') &&
      fullViewCode.includes('threed') &&
      fullViewCode.includes('preferences') &&
      fullViewCode.includes('visuals'),
    'Handles all 6 valid control tabs and calls setActiveTab'
  );

  // Check 5: Back to portfolio link/button
  assert(
    fullViewCode.includes('Back to Portfolio') &&
      fullViewCode.includes('window.location.origin + window.location.pathname'),
    'Provides "Back to Portfolio" navigation returning to root portfolio'
  );

  // Check 6: Title and Standalone Studio branding
  assert(
    fullViewCode.includes('Portfolio Control Center') &&
      fullViewCode.includes('Standalone Studio'),
    'Renders correct title and Standalone Studio badge'
  );

  // Check 7: Real-time Live Sync indicator
  assert(
    fullViewCode.includes('Live Synced with Main Window via LocalStorage'),
    'Displays "🟢 Live Synced with Main Window via LocalStorage" indicator'
  );

  // Check 8: Embeds ControlCenterPanel with workbench variant & isStandalone
  assert(
    fullViewCode.includes('<ControlCenterPanel') &&
      fullViewCode.includes('variant="workbench"') &&
      fullViewCode.includes('isStandalone={true}'),
    'Embeds <ControlCenterPanel variant="workbench" isStandalone={true} />'
  );

  // Check 9: Tab switcher pills
  assert(
    fullViewCode.includes('TABS_CONFIG') &&
      fullViewCode.includes('handleSelectTab'),
    'Provides direct tab switcher pill navigation in top utility bar'
  );

  // Check 10: Two-tier mode parsing and single mode lock
  assert(
    fullViewCode.includes("params.get('mode')") &&
      fullViewCode.includes("rawMode === 'single'") &&
      fullViewCode.includes("{mode === 'all' && ("),
    'Parses mode query param and hides top tab bar when in single mode'
  );

  // Check 11: CTA button in single mode
  assert(
    fullViewCode.includes("mode === 'single'") &&
      fullViewCode.includes('Open Full Control Panel') &&
      fullViewCode.includes('handleOpenFullControlPanel'),
    'Renders "Open Full Control Panel" CTA button in header during single mode'
  );

  // Check 12: Theme & Lang URL preservation in FullView
  assert(
    fullViewCode.includes("params.get('theme')") &&
      fullViewCode.includes('setTheme(rawTheme)') &&
      fullViewCode.includes("params.get('lang')") &&
      fullViewCode.includes('setLanguage(rawLang)'),
    'Parses and synchronizes theme and lang parameters in ControlCenterFullView'
  );

  // Check 13: Localized Hindi labels
  assert(
    fullViewCode.includes('TAB_LABELS') &&
      fullViewCode.includes('ऑडियो स्टूडियो') &&
      fullViewCode.includes('कर्सर डायनामिक्स'),
    'Contains localized Hindi labels for all control center tabs'
  );
}

// Check App.jsx integration
if (existsSync(appPath)) {
  const appCode = readFileSync(appPath, 'utf8');

  // Check 14: Imports ControlCenterFullView
  assert(
    appCode.includes('ControlCenterFullView'),
    'App.jsx imports ControlCenterFullView'
  );

  // Check 15: Detects ?view=control or ?panel=control
  assert(
    appCode.includes("view === 'control'") &&
      appCode.includes("panel === 'control'"),
    'App.jsx detects both ?view=control and ?panel=control'
  );

  // Check 16: Returns early with isolated providers without mounting heavy sections
  assert(
    appCode.includes('<ControlCenterFullView') &&
      appCode.includes('RoleProvider') &&
      appCode.includes('HighContrastProvider') &&
      appCode.includes('ViewModeProvider'),
    'App.jsx renders ControlCenterFullView inside context providers and returns early'
  );
}

// Check ControlCenterPanel.jsx isStandalone support and single-mode contracts
if (existsSync(panelPath)) {
  const panelCode = readFileSync(panelPath, 'utf8');
  assert(
    panelCode.includes('isStandalone'),
    'ControlCenterPanel accepts isStandalone prop'
  );

  assert(
    (panelCode.includes("{mode !== 'single' && (") || panelCode.includes("{mode !== 'single' && !isStandalone && (")) &&
      panelCode.includes("if (mode === 'single') return;"),
    'ControlCenterPanel hides tablist and disables arrow keys in single mode'
  );

  assert(
    panelCode.includes('view=control&mode=single&tab=${targetTab}&theme=${theme}&lang=${language}'),
    'ControlCenterPanel passes mode=single, tab, theme, and lang in popout URL'
  );
}

console.log('\n================================================================');
console.log(`  VERIFICATION RESULTS: ${passed} PASSED | ${failed} FAILED`);
console.log('================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
