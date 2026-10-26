import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  VERIFY STREAM A: URL PARAMS, THEME/LANG & SINGLE TAB PANEL     ');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     ${err.message}`);
    failCount++;
  }
}

// 1. ThemeContext
const themeContextPath = path.join(rootDir, 'src/context/ThemeContext.jsx');
const themeContextSrc = fs.readFileSync(themeContextPath, 'utf8');

runTest('ThemeContext checks URL search params for theme (?theme=light | ?theme=dark)', () => {
  assert(themeContextSrc.includes('new URLSearchParams(window.location.search)'), 'Must parse URLSearchParams');
  assert(themeContextSrc.includes("params.get('theme')"), 'Must get theme query param');
  assert(themeContextSrc.includes("urlTheme === 'light' || urlTheme === 'dark'"), 'Must validate light or dark theme');
  assert(themeContextSrc.includes('localStorage.setItem(THEME_STORAGE_KEY, urlTheme)'), 'Must persist valid URL theme to localStorage');
});

// 2. LanguageContext
const langContextPath = path.join(rootDir, 'src/context/LanguageContext.jsx');
const langContextSrc = fs.readFileSync(langContextPath, 'utf8');

runTest('LanguageContext checks URL search params for lang (?lang=en | ?lang=hi)', () => {
  assert(langContextSrc.includes('new URLSearchParams(window.location.search)'), 'Must parse URLSearchParams');
  assert(langContextSrc.includes("params.get('lang')"), 'Must get lang query param');
  assert(langContextSrc.includes("urlLang === 'en' || urlLang === 'hi'"), 'Must validate en or hi lang');
  assert(langContextSrc.includes('localStorage.setItem(LANGUAGE_STORAGE_KEY, urlLang)'), 'Must persist valid URL lang to localStorage');
});

// 3. InteractivePlayground
const playgroundPath = path.join(rootDir, 'src/components/InteractivePlayground.jsx');
const playgroundSrc = fs.readFileSync(playgroundPath, 'utf8');

runTest('InteractivePlayground imports useTheme and useLanguage and constructs full URL', () => {
  assert(playgroundSrc.includes('useTheme'), 'Must import useTheme');
  assert(playgroundSrc.includes('useLanguage'), 'Must import useLanguage');
  assert(playgroundSrc.includes('theme='), 'Must include theme in URL');
  assert(playgroundSrc.includes('lang='), 'Must include lang in URL');
  assert(
    playgroundSrc.includes('?view=control&mode=all&theme=${theme}&lang=${language}'),
    'Must construct ?view=control&mode=all&theme=${theme}&lang=${language}'
  );
  assert(playgroundSrc.includes("'_blank'"), 'Must open in _blank');
  assert(playgroundSrc.includes("'noopener,noreferrer'"), 'Must specify noopener,noreferrer');
});

// 4. ControlCenterPanel
const panelPath = path.join(rootDir, 'src/components/ControlCenterPanel.jsx');
const panelSrc = fs.readFileSync(panelPath, 'utf8');

runTest('ControlCenterPanel accepts mode and singleTab props with defaults', () => {
  assert(panelSrc.includes("mode = 'all'"), 'Must accept mode prop defaulting to all');
  assert(panelSrc.includes('singleTab = null'), 'Must accept singleTab prop defaulting to null');
});

runTest('ControlCenterPanel handlePopoutTab reads theme, lang and constructs single tab popout URL', () => {
  assert(panelSrc.includes('useLanguage'), 'Must import and use useLanguage');
  assert(
    panelSrc.includes('?view=control&mode=single&tab=${targetTab}&theme=${theme}&lang=${language}'),
    'Must construct ?view=control&mode=single&tab=${targetTab}&theme=${theme}&lang=${language}'
  );
  assert(panelSrc.includes("'_blank'"), 'Must open in _blank');
  assert(panelSrc.includes("'noopener,noreferrer'"), 'Must specify noopener,noreferrer');
});

runTest('ControlCenterPanel mode === "single" hides main scrolling tablist header', () => {
  assert(
    panelSrc.includes("mode !== 'single' && (") || panelSrc.includes("mode !== 'single' &&"),
    'Must conditionally render tablist when mode !== single'
  );
});

runTest('ControlCenterPanel mode === "single" disables keyboard shortcut tab traversal', () => {
  assert(
    panelSrc.includes("if (mode === 'single') return;"),
    'handleTabKeyDown must return early when mode === single'
  );
});

runTest('ControlCenterPanel effectiveActiveTab resolves to singleTab when in single mode', () => {
  assert(
    panelSrc.includes("(mode === 'single' && singleTab) ? singleTab : activeTab"),
    'Must compute effective active tab with fallback to activeTab'
  );
  assert(
    panelSrc.includes("effectiveActiveTab === 'audio'") &&
    panelSrc.includes("effectiveActiveTab === 'cursor'") &&
    panelSrc.includes("effectiveActiveTab === 'hero'") &&
    panelSrc.includes("effectiveActiveTab === 'threed'") &&
    panelSrc.includes("effectiveActiveTab === 'preferences'") &&
    panelSrc.includes("effectiveActiveTab === 'visuals'"),
    'Must gate all 6 panels on effectiveActiveTab'
  );
});

console.log('\n================================================================');
console.log(`  VERIFICATION RESULTS: ${passCount} PASSED | ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
