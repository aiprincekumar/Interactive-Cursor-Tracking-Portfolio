import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  VERIFY CONTROL CENTER TAB NAVIGATION & SCROLL ENHANCEMENTS    ');
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

const panelPath = path.join(rootDir, 'src/components/ControlCenterPanel.jsx');
const panelSrc = fs.readFileSync(panelPath, 'utf8');

runTest('ControlCenterPanel imports ChevronLeft and ChevronRight icons', () => {
  assert(panelSrc.includes('ChevronLeft,'), 'Must import ChevronLeft');
  assert(panelSrc.includes('ChevronRight,'), 'Must import ChevronRight');
});

runTest('ControlCenterPanel imports required React hooks', () => {
  assert(panelSrc.includes('useRef'), 'Must import useRef');
  assert(panelSrc.includes('useEffect'), 'Must import useEffect');
  assert(panelSrc.includes('useCallback'), 'Must import useCallback');
});

runTest('ControlCenterPanel defines relative container with overflow-hidden', () => {
  assert(panelSrc.includes('relative w-full overflow-hidden rounded-2xl group/tabnav'), 'Must define relative overflow-hidden wrapper');
});

runTest('ControlCenterPanel provides accessible Chevron buttons with smooth scroll handlers', () => {
  assert(panelSrc.includes('aria-label="Scroll tabs left"'), 'Must have left scroll button with aria-label');
  assert(panelSrc.includes('aria-label="Scroll tabs right"'), 'Must have right scroll button with aria-label');
  assert(panelSrc.includes('scrollBy({ left: -160, behavior: \'smooth\' })'), 'Must scroll left by 160');
  assert(panelSrc.includes('scrollBy({ left: 160, behavior: \'smooth\' })'), 'Must scroll right by 160');
});

runTest('ControlCenterPanel provides left and right edge fade gradients', () => {
  assert(panelSrc.includes('bg-gradient-to-r from-[#FAF8F5] dark:from-[#181226] to-transparent'), 'Must have left fade gradient');
  assert(panelSrc.includes('bg-gradient-to-l from-[#FAF8F5] dark:from-[#181226] to-transparent'), 'Must have right fade gradient');
});

runTest('ControlCenterPanel tablist has ref, drag-to-scroll, wheel translation & smooth scroll classes', () => {
  assert(panelSrc.includes('ref={tablistRef}'), 'Must assign tablistRef to tablist container');
  assert(panelSrc.includes('onMouseDown={handleMouseDown}'), 'Must have onMouseDown drag handler');
  assert(panelSrc.includes('onMouseMove={handleMouseMove}'), 'Must have onMouseMove drag handler');
  assert(panelSrc.includes('onMouseUp={handleMouseUp}'), 'Must have onMouseUp drag handler');
  assert(panelSrc.includes('onMouseLeave={handleMouseLeave}'), 'Must have onMouseLeave drag handler');
  assert(panelSrc.includes('overflow-x-auto'), 'Must have overflow-x-auto');
  assert(panelSrc.includes('scroll-smooth'), 'Must have scroll-smooth');
  assert(panelSrc.includes('no-scrollbar'), 'Must have no-scrollbar');
});

runTest('ControlCenterPanel implements safe container-only auto-center active tab', () => {
  assert(panelSrc.includes('container.scrollTo({ left: Math.max(0, scrollLeft), behavior: \'smooth\' })'), 'Must center active tab using horizontal container scrollTo');
  assert(!panelSrc.includes('activeTabBtn.scrollIntoView'), 'Must not call scrollIntoView on activeTabBtn to avoid window scrolling bug');
});

runTest('ControlCenterPanel tab buttons have shrink-0, select-none, and drawer-safe badge formatting', () => {
  assert(panelSrc.includes('shrink-0 select-none'), 'Tab button must prevent squishing with shrink-0 and select-none');
  assert(panelSrc.includes("isDrawer ? 'max-w-[80px] truncate' : ''"), 'Must format drawer badge nicely');
});

console.log('\n================================================================');
console.log(`  VERIFICATION RESULTS: ${passCount} PASSED | ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
