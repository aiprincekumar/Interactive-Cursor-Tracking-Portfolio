import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

console.log('================================================================');
console.log('  TEST: THEME & LANGUAGE PRESERVATION + TWO-TIER CONTROL AUDIT  ');
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
const panelPath = resolve(rootDir, 'src/components/ControlCenterPanel.jsx');
const playgroundPath = resolve(rootDir, 'src/components/InteractivePlayground.jsx');
const themeContextPath = resolve(rootDir, 'src/context/ThemeContext.jsx');
const langContextPath = resolve(rootDir, 'src/context/LanguageContext.jsx');
const appPath = resolve(rootDir, 'src/App.jsx');

// Read files
const fullViewCode = readFileSync(fullViewPath, 'utf8');
const panelCode = readFileSync(panelPath, 'utf8');
const playgroundCode = readFileSync(playgroundPath, 'utf8');
const themeCode = readFileSync(themeContextPath, 'utf8');
const langCode = readFileSync(langContextPath, 'utf8');
const appCode = readFileSync(appPath, 'utf8');

// --- Section 1: URL Parameter Propagation & Persistence ---
console.log('\n--- Section 1: URL Parameter Propagation & Deep Linking ---');

assert(
  playgroundCode.includes('view=control&mode=all&theme=${theme}&lang=${language}'),
  'InteractivePlayground launches full control view passing mode=all, theme, and lang'
);

assert(
  panelCode.includes('view=control&mode=single&tab=${targetTab}&theme=${theme}&lang=${language}'),
  'ControlCenterPanel popout tab launches single view passing mode=single, targetTab, theme, and lang'
);

assert(
  panelCode.includes('handlePopoutTab(effectiveActiveTab, e)'),
  'Active tab header banner provides popout trigger invoking handlePopoutTab with active tab'
);

assert(
  fullViewCode.includes("params.get('mode')") &&
    fullViewCode.includes("rawMode === 'single'"),
  'ControlCenterFullView inspects and parses mode query parameter'
);

assert(
  fullViewCode.includes("params.get('theme')") &&
    fullViewCode.includes('setTheme(rawTheme)'),
  'ControlCenterFullView extracts theme query param and updates ThemeContext'
);

assert(
  fullViewCode.includes("params.get('lang')") &&
    fullViewCode.includes('setLanguage(rawLang)'),
  'ControlCenterFullView extracts lang query param and updates LanguageContext'
);

assert(
  fullViewCode.includes('url.searchParams.set(\'tab\', tabId)') &&
    fullViewCode.includes('url.searchParams.set(\'mode\', mode)') &&
    fullViewCode.includes('url.searchParams.set(\'theme\', theme)') &&
    fullViewCode.includes('url.searchParams.set(\'lang\', language)'),
  'handleSelectTab updates history state preserving tab, mode, theme, and lang'
);

// --- Section 2: Two-Tier Mode Architecture: Single Mode Lock & Tab Hiding ---
console.log('\n--- Section 2: Single Mode Isolation & Tab Lock ---');

assert(
  fullViewCode.includes("{mode === 'all' && (") &&
    fullViewCode.includes('aria-label="Studio Subsystems"'),
  'ControlCenterFullView hides the top navigation pill strip when mode !== "all"'
);

assert(
  (panelCode.includes('{mode !== \'single\' && (') || panelCode.includes('{mode !== \'single\' && !isStandalone && (')) &&
    panelCode.includes('role="tablist"'),
  'ControlCenterPanel completely omits the tablist strip when mode === "single"'
);

assert(
  panelCode.includes("if (mode === 'single') return;") &&
    panelCode.includes('handleTabKeyDown'),
  'handleTabKeyDown disables keyboard arrow keys when mode === "single"'
);

assert(
  fullViewCode.includes('mode === \'single\'') &&
    fullViewCode.includes('Open Full Control Panel') &&
    fullViewCode.includes('handleOpenFullControlPanel'),
  'ControlCenterFullView renders "Open Full Control Panel" CTA button when in single mode'
);

assert(
  fullViewCode.includes('handleOpenFullControlPanel') &&
    fullViewCode.includes("url.searchParams.set('mode', 'all')") &&
    fullViewCode.includes("setMode('all')"),
  'handleOpenFullControlPanel elevates mode to "all" and updates browser URL'
);

assert(
  panelCode.includes("effectiveActiveTab = (mode === 'single' && singleTab) ? singleTab : activeTab"),
  'ControlCenterPanel enforces singleTab as effectiveActiveTab when in single mode'
);

// --- Section 3: Theme Preservation (Light & Dark) ---
console.log('\n--- Section 3: Theme Preservation (Light & Dark) ---');

assert(
  themeCode.includes("params.get('theme')") &&
    themeCode.includes("urlTheme === 'light' || urlTheme === 'dark'"),
  'ThemeContext initializes directly from URL search parameter theme'
);

assert(
  themeCode.includes("root.classList.add('dark')") &&
    themeCode.includes("root.classList.remove('dark')") &&
    themeCode.includes("root.style.colorScheme"),
  'ThemeContext toggles dark class and sets colorScheme on document root'
);

assert(
  fullViewCode.includes('bg-stone-50 dark:bg-[#07050C]') &&
    fullViewCode.includes('text-stone-900 dark:text-[#F5F2F8]'),
  'ControlCenterFullView uses responsive Tailwind classes for clean light and dark modes'
);

assert(
  fullViewCode.includes('bg-white/80 dark:bg-[#0B0813]/85') &&
    fullViewCode.includes('border-stone-200 dark:border-white/10'),
  'ControlCenterFullView header uses light background in light theme without forced dark backdrop'
);

assert(
  fullViewCode.includes('bg-white/85 dark:bg-[#0D091A]/85'),
  'Main panel container adapts to light background in light theme'
);

// --- Section 4: Language Preservation (English & Hindi) ---
console.log('\n--- Section 4: Language Preservation (English & Hindi) ---');

assert(
  langCode.includes("params.get('lang')") &&
    langCode.includes("urlLang === 'en' || urlLang === 'hi'"),
  'LanguageContext initializes directly from URL search parameter lang'
);

assert(
  langCode.includes("document.documentElement.lang = language"),
  'LanguageContext binds HTML lang attribute to current language'
);

assert(
  fullViewCode.includes('TAB_LABELS = {') &&
    fullViewCode.includes('ऑडियो स्टूडियो') &&
    fullViewCode.includes('कर्सर डायनामिक्स') &&
    fullViewCode.includes('हीरो कैरेक्टर') &&
    fullViewCode.includes('3D स्थानिक') &&
    fullViewCode.includes('प्राथमिकताएं') &&
    fullViewCode.includes('डिस्प्ले और विज़ुअल्स'),
  'ControlCenterFullView defines bilingual Hindi labels for all 6 tabs'
);

assert(
  fullViewCode.includes('isHindi ? \'पोर्टफोलियो पर वापस\' : \'Back to Portfolio\'') &&
    fullViewCode.includes('isHindi ? \'स्वतंत्र स्टूडियो\' : \'Standalone Studio\'') &&
    fullViewCode.includes('isHindi ? \'पूर्ण नियंत्रण कक्ष खोलें\' : \'Open Full Control Panel\''),
  'ControlCenterFullView translates navigation, badges, and CTA buttons into Hindi'
);

// --- Section 5: App Integration & Isolation ---
console.log('\n--- Section 5: App Integration & Clean DOM Isolation ---');

assert(
  appCode.includes("view === 'control' || panel === 'control'") &&
    appCode.includes('<ControlCenterFullView />'),
  'App.jsx renders ControlCenterFullView in isolation on ?view=control or ?panel=control'
);

assert(
  appCode.includes('if (isStandaloneControl) {') &&
    !appCode.slice(appCode.indexOf('if (isStandaloneControl) {'), appCode.indexOf('return (', appCode.indexOf('if (isStandaloneControl) {') + 50)).includes('<HeroSection') &&
    !appCode.slice(appCode.indexOf('if (isStandaloneControl) {'), appCode.indexOf('return (', appCode.indexOf('if (isStandaloneControl) {') + 50)).includes('<ProjectsSection'),
  'Heavy portfolio sections (Hero, Projects, Canvas) are completely skipped in standalone view'
);

console.log('\n================================================================');
console.log(`  AUDIT RESULTS: ${passed} PASSED | ${failed} FAILED`);
console.log('================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
