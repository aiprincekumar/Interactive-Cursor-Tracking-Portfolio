import fs from 'fs';
import path from 'path';

console.log('========================================================================');
console.log('     VERIFYING MOBILE DRAWER SCROLL & SCROLL-LOCK IMPLEMENTATION        ');
console.log('========================================================================\n');

let passed = 0;
let failed = 0;

function check(description, condition) {
  if (condition) {
    console.log(`  ✔ PASS: ${description}`);
    passed++;
  } else {
    console.error(`  ✖ FAIL: ${description}`);
    failed++;
  }
}

// 1. Audit src/hooks/useBodyScrollLock.js
const hookPath = path.resolve('src/hooks/useBodyScrollLock.js');
const hookExists = fs.existsSync(hookPath);
check('useBodyScrollLock.js exists in src/hooks/', hookExists);

let hookCode = '';
if (hookExists) {
  hookCode = fs.readFileSync(hookPath, 'utf8');

  check('Exports useBodyScrollLock hook', hookCode.includes('export function useBodyScrollLock') || hookCode.includes('export default useBodyScrollLock'));
  check('Includes SSR-safe window and document checks', hookCode.includes("typeof window === 'undefined'") || hookCode.includes("typeof window !== 'undefined'"));
  check('Caches original body and html overflow styles', hookCode.includes('document.body.style.overflow') && hookCode.includes('document.documentElement.style.overflow'));
  check('Applies overflow: hidden to document.body', hookCode.includes("document.body.style.overflow = 'hidden'"));
  check('Applies overscrollBehavior: none to document.body', hookCode.includes("document.body.style.overscrollBehavior = 'none'"));
  check('Restores original styles on unlock or unmount', hookCode.includes('restoreLock') || hookCode.includes('originalBodyOverflow'));
  check('Listens to resize and orientationchange events', hookCode.includes("'resize'") && hookCode.includes("'orientationchange'"));
  check('Supports customizable breakpoint (defaulting to 768)', hookCode.includes('breakpoint = 768'));
}

// 2. Audit src/components/Navbar.jsx
const navbarPath = path.resolve('src/components/Navbar.jsx');
const navbarExists = fs.existsSync(navbarPath);
check('Navbar.jsx exists in src/components/', navbarExists);

let navbarCode = '';
if (navbarExists) {
  navbarCode = fs.readFileSync(navbarPath, 'utf8');

  // Hook import & usage
  check('Navbar.jsx imports useBodyScrollLock', navbarCode.includes("from '../hooks/useBodyScrollLock'"));
  check('Navbar.jsx invokes useBodyScrollLock(mobileMenuOpen)', navbarCode.includes('useBodyScrollLock(mobileMenuOpen)'));

  // Backdrop overlay element
  const hasBackdrop = navbarCode.includes('mobileMenuOpen && (') &&
    navbarCode.includes('fixed inset-0') &&
    navbarCode.includes('z-30') &&
    navbarCode.includes('setMobileMenuOpen(false)');
  check('Backdrop overlay element exists with click dismissal and z-30 layering', hasBackdrop);

  // Drawer container constraints & scroll classes
  const hasMaxH = navbarCode.includes('max-h-[calc(100dvh-');
  const hasOverflowY = navbarCode.includes('overflow-y-auto');
  const hasOverscrollContain = navbarCode.includes('overscroll-contain');
  const hasZ40 = navbarCode.includes('relative z-40') || navbarCode.includes('z-40');
  check('Drawer container has dynamic max-height max-h-[calc(100dvh-...)]', hasMaxH);
  check('Drawer container has overflow-y-auto for vertical scrolling', hasOverflowY);
  check('Drawer container has overscroll-contain to isolate drawer scroll chaining', hasOverscrollContain);
  check('Drawer container has appropriate z-40 layering above backdrop', hasZ40);

  // Escape key and keyboard accessibility
  const hasEscapeDismissal = navbarCode.includes("event.key === 'Escape'") &&
    navbarCode.includes('if (mobileMenuOpen)') &&
    navbarCode.includes('setMobileMenuOpen(false)');
  check('Escape key listener dismisses mobileMenuOpen', hasEscapeDismissal);

  const hasMenuButtonRef = navbarCode.includes('mobileMenuButtonRef') &&
    navbarCode.includes('mobileMenuButtonRef.current?.focus()');
  check('Mobile menu button ref restores focus on Escape key dismissal', hasMenuButtonRef);

  // Click outside listener
  const hasOutsideClickDismissal = navbarCode.includes('handleClickOutside') &&
    navbarCode.includes('if (mobileMenuOpen)') &&
    navbarCode.includes('setMobileMenuOpen(false)');
  check('Click outside listener dismisses mobileMenuOpen', hasOutsideClickDismissal);
}

console.log('\n------------------------------------------------------------------------');
console.log(`TOTAL CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('------------------------------------------------------------------------\n');

if (failed > 0) {
  console.error(`Verification FAILED with ${failed} failure(s).`);
  process.exit(1);
} else {
  console.log('Verification PASSED! All mobile drawer scroll & scroll-lock checks succeeded.');
  process.exit(0);
}
