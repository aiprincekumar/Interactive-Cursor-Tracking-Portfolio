import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('========================================================================');
console.log('  VERIFYING DUAL CACHE / STORAGE & EXACT X/Y SCROLL ENGINE             ');
console.log('========================================================================\n');

let passCount = 0;
let failCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${description}`);
    passCount++;
  } catch (err) {
    console.error(`❌ FAIL: ${description}`);
    console.error(`   ${err.message}`);
    failCount++;
  }
}

const labContextPath = path.join(rootDir, 'src/context/LabContext.jsx');
const hookPath = path.join(rootDir, 'src/hooks/useScrollRestoration.js');
const indexHtmlPath = path.join(rootDir, 'index.html');

const labContext = fs.readFileSync(labContextPath, 'utf8');
const hookContent = fs.readFileSync(hookPath, 'utf8');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// --- Suite 1: LabContext.jsx Visuals & Auto-Scroll Toggle ---
console.log('--- Suite 1: LabContext.jsx Visuals & Auto-Scroll Toggle ---');

test('FACTORY_DEFAULTS.visuals contains autoScrollOnRefresh: true', () => {
  assert(labContext.includes('autoScrollOnRefresh: true'), 'FACTORY_DEFAULTS.visuals must include autoScrollOnRefresh: true');
});

test('LabContext exports AUTO_SCROLL_STORAGE_KEY', () => {
  assert(labContext.includes("AUTO_SCROLL_STORAGE_KEY = 'portfolio_auto_scroll_on_refresh'"), 'Must export AUTO_SCROLL_STORAGE_KEY');
});

test('LabVisualsContext value provides autoScrollOnRefresh and setAutoScrollOnRefresh', () => {
  assert(labContext.includes('autoScrollOnRefresh,'), 'visualsValue must expose autoScrollOnRefresh');
  assert(labContext.includes('setAutoScrollOnRefresh'), 'visualsValue must expose setAutoScrollOnRefresh');
});

test('setAutoScrollOnRefresh updates both localStorage and sessionStorage and fires custom event', () => {
  assert(labContext.includes("localStorage.setItem('portfolio_auto_scroll_on_refresh'"), 'Must persist to localStorage');
  assert(labContext.includes("sessionStorage.setItem('portfolio_auto_scroll_on_refresh'"), 'Must persist to sessionStorage');
  assert(labContext.includes("'portfolio:auto-scroll-toggle'"), 'Must dispatch portfolio:auto-scroll-toggle event');
});

test('resetToFactoryDefaults resets autoScrollOnRefresh to true in both storages', () => {
  assert(labContext.includes("localStorage.setItem('portfolio_auto_scroll_on_refresh', 'true')"), 'Reset must update localStorage');
  assert(labContext.includes("sessionStorage.setItem('portfolio_auto_scroll_on_refresh', 'true')"), 'Reset must update sessionStorage');
});

// --- Suite 2: useScrollRestoration Dual Storage & Coordinate Engine ---
console.log('\n--- Suite 2: useScrollRestoration Dual Storage & Coordinate Engine ---');

test('useScrollRestoration exports PORTFOLIO_SCROLL_POS_KEY and AUTO_SCROLL_STORAGE_KEY', () => {
  assert(hookContent.includes("PORTFOLIO_SCROLL_POS_KEY = 'portfolio_scroll_position'"), 'Must export PORTFOLIO_SCROLL_POS_KEY');
  assert(hookContent.includes("AUTO_SCROLL_STORAGE_KEY = 'portfolio_auto_scroll_on_refresh'"), 'Must export AUTO_SCROLL_STORAGE_KEY');
});

test('useScrollRestoration checks toggle and exits immediately when explicitly false', () => {
  assert(hookContent.includes('AUTO_SCROLL_STORAGE_KEY'), 'Must inspect AUTO_SCROLL_STORAGE_KEY');
  assert(hookContent.includes('!isAutoScrollEnabled'), 'Must check if auto-scroll is disabled');
  assert(hookContent.includes('window.scrollTo(0, 0);'), 'Must reset to 0,0 when disabled');
});

test('useScrollRestoration reads savedPosition from sessionStorage or localStorage', () => {
  assert(hookContent.includes('sessionStorage.getItem(PORTFOLIO_SCROLL_POS_KEY)'), 'Must check sessionStorage for scroll position');
  assert(hookContent.includes('localStorage.getItem(PORTFOLIO_SCROLL_POS_KEY)'), 'Must check localStorage for scroll position');
});

test('useScrollRestoration restores exact X and Y coordinates with smooth behavior', () => {
  assert(hookContent.includes('window.scrollTo({ left: savedPosition.x, top: savedPosition.y, behavior: \'smooth\' })'), 'Must restore exact X and Y coordinates smoothly');
});

test('useScrollRestoration dispatches portfolio:scroll-restoration-settle with target section', () => {
  assert(hookContent.includes("'portfolio:scroll-restoration-settle'"), 'Must dispatch settle event');
  assert(hookContent.includes('detail: { target: targetDetail }'), 'Must send target in detail');
});

test('useScrollRestoration persists coordinates, URL and section on scroll and beforeunload to both storages', () => {
  assert(hookContent.includes('localStorage.setItem(PORTFOLIO_SCROLL_POS_KEY, scrollPosPayload)'), 'Must save scroll position to localStorage');
  assert(hookContent.includes('sessionStorage.setItem(PORTFOLIO_SCROLL_POS_KEY, scrollPosPayload)'), 'Must save scroll position to sessionStorage');
  assert(hookContent.includes('localStorage.setItem(PORTFOLIO_LAST_URL_KEY, lastUrlPayload)'), 'Must save last URL to localStorage');
  assert(hookContent.includes('sessionStorage.setItem(PORTFOLIO_LAST_URL_KEY, lastUrlPayload)'), 'Must save last URL to sessionStorage');
  assert(hookContent.includes('beforeunload') && hookContent.includes('pagehide'), 'Must listen to beforeunload and pagehide');
});

// --- Suite 3: index.html Early Head Shield ---
console.log('\n--- Suite 3: index.html Early Head Shield ---');

test('index.html checks portfolio_auto_scroll_on_refresh toggle', () => {
  assert(indexHtml.includes("sessionStorage.getItem('portfolio_auto_scroll_on_refresh')"), 'Must check sessionStorage for toggle');
  assert(indexHtml.includes("localStorage.getItem('portfolio_auto_scroll_on_refresh')"), 'Must check localStorage for toggle');
  assert(indexHtml.includes("autoScrollPref === 'false'"), 'Must handle toggle false branch');
});

test('index.html checks both sessionStorage and localStorage for portfolio_scroll_position and portfolio_last_url', () => {
  assert(indexHtml.includes("sessionStorage.getItem('portfolio_scroll_position')"), 'Must check sessionStorage for scroll position');
  assert(indexHtml.includes("localStorage.getItem('portfolio_scroll_position')"), 'Must check localStorage for scroll position');
  assert(indexHtml.includes("sessionStorage.getItem('portfolio_last_url')"), 'Must check sessionStorage for last url');
  assert(indexHtml.includes("localStorage.getItem('portfolio_last_url')"), 'Must check localStorage for last url');
});

console.log('========================================================================');
console.log(`TOTAL AUDIT CHECKS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('========================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🌟 DUAL CACHE / STORAGE & EXACT X/Y SCROLL ENGINE VERIFIED 100%! 🌟\n');
}
