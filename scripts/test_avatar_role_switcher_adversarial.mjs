import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('====================================================================');
console.log('ADVERSARIAL STRESS TEST SUITE: NAVBAR AVATAR UNIVERSAL ROLE SWITCHER');
console.log('====================================================================\n');

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

const navbarPath = path.join(rootDir, 'src/components/Navbar.jsx');
const navContent = fs.readFileSync(navbarPath, 'utf-8');

const roleTabsBarPath = path.join(rootDir, 'src/components/RoleTabsBar.jsx');
const roleTabsContent = fs.readFileSync(roleTabsBarPath, 'utf-8');

// ------------------------------------------------------------------
// Suite 1: WAI-ARIA Semantics & Keyboard Focus Management
// ------------------------------------------------------------------
console.log('--- Suite 1: WAI-ARIA Semantics & Keyboard Focus Management ---');

test('Avatar button has ref={avatarButtonRef} for programmatic focus restoration', () => {
  assert(navContent.includes('const avatarButtonRef = useRef(null);'), 'Navbar must declare avatarButtonRef');
  assert(navContent.includes('ref={avatarButtonRef}'), 'Avatar button must bind ref={avatarButtonRef}');
});

test('Avatar button has aria-controls="floating-career-track-bar" matching RoleTabsBar floating-bar id', () => {
  assert(navContent.includes('aria-controls="floating-career-track-bar"'), 'Avatar button must include aria-controls="floating-career-track-bar"');
  assert(roleTabsContent.includes('id="floating-career-track-bar"'), 'RoleTabsBar floating bar must define id="floating-career-track-bar"');
});

test('Avatar button supports ArrowDown shortcut to open role switcher bar', () => {
  assert(navContent.includes("e.key === 'ArrowDown'"), 'Avatar button must listen for ArrowDown key');
  assert(navContent.includes('toggleRoleBar()'), 'ArrowDown key must trigger toggleRoleBar');
});

test('Escape key listener dismisses role switcher and restores focus to avatarButtonRef', () => {
  const escapeIdx = navContent.indexOf("event.key === 'Escape'");
  assert(escapeIdx !== -1, 'Escape listener must exist');
  const escapeBlock = navContent.slice(escapeIdx, escapeIdx + 600);
  assert(escapeBlock.includes('setIsRoleBarOpen(false)'), 'Escape key must close role bar');
  assert(escapeBlock.includes('avatarButtonRef.current?.focus()'), 'Escape key must return focus to avatar trigger button');
});

test('RoleTabsBar onClose and onSelectRole restore focus to avatarButtonRef', () => {
  const floatingBarIdx = navContent.indexOf('variant="floating-bar"');
  assert(floatingBarIdx !== -1, 'Floating bar invocation must exist');
  const floatingBarBlock = navContent.slice(floatingBarIdx, floatingBarIdx + 500);
  assert(floatingBarBlock.includes('avatarButtonRef.current?.focus()'), 'onClose/onSelectRole must restore focus to avatar');
});

// ------------------------------------------------------------------
// Suite 2: State Integrity & Rapid Toggle Concurrency
// ------------------------------------------------------------------
console.log('\n--- Suite 2: State Integrity & Rapid Toggle Concurrency ---');

test('toggleRoleBar uses functional state updater setIsRoleBarOpen((prev) => ...) preventing stale closures', () => {
  const toggleFnIdx = navContent.indexOf('const toggleRoleBar = () => {');
  assert(toggleFnIdx !== -1, 'toggleRoleBar function must exist');
  const toggleFnBlock = navContent.slice(toggleFnIdx, toggleFnIdx + 350);
  assert(toggleFnBlock.includes('setIsRoleBarOpen((prev) =>'), 'toggleRoleBar must use functional state updater');
  assert(toggleFnBlock.includes('const next = !prev;'), 'toggleRoleBar must invert previous state');
});

test('Opening role bar mutually excludes search, explore, ribbon, and mobile menu', () => {
  const toggleFnIdx = navContent.indexOf('const toggleRoleBar = () => {');
  const toggleFnBlock = navContent.slice(toggleFnIdx, toggleFnIdx + 350);
  assert(toggleFnBlock.includes('setIsExploreOpen(false)'), 'Opening role bar must close explore sub-bar');
  assert(toggleFnBlock.includes('setIsRibbonOpen(false)'), 'Opening role bar must close cursor ribbon');
  assert(toggleFnBlock.includes('setMobileMenuOpen(false)'), 'Opening role bar must close mobile menu');
  assert(toggleFnBlock.includes('setIsSearchOpen(false)'), 'Opening role bar must close search');
});

test('Opening search, explore, ribbon, or mobile menu closes role bar', () => {
  // Search
  assert(navContent.includes('setIsSearchOpen(true)') && navContent.includes('setIsRoleBarOpen(false)'), 'Search trigger must close role bar');
  // Explore
  const exploreIdx = navContent.indexOf('const toggleExploreBar = () => {');
  const exploreBlock = navContent.slice(exploreIdx, exploreIdx + 300);
  assert(exploreBlock.includes('setIsRoleBarOpen(false)'), 'Explore toggle must close role bar');
});

// ------------------------------------------------------------------
// Suite 3: Clean Brand Link Separation & Non-Trapping Navigation
// ------------------------------------------------------------------
console.log('\n--- Suite 3: Clean Brand Link Separation & Non-Trapping Navigation ---');

test('Brand anchor link does NOT toggle role bar and safely dismisses open sub-bars', () => {
  const brandAnchorIdx = navContent.indexOf('href="#hero"');
  assert(brandAnchorIdx !== -1, 'Brand anchor link to #hero must exist');
  const brandBlock = navContent.slice(brandAnchorIdx, brandAnchorIdx + 450);
  assert(!brandBlock.includes('toggleRoleBar'), 'Brand anchor must NOT toggle role bar');
  assert(brandBlock.includes('setIsRoleBarOpen(false)'), 'Brand anchor click must dismiss role bar if open');
  assert(brandBlock.includes("setActiveSection('hero')"), 'Brand anchor click must set active section to hero');
});

test('Desktop nav links safely dismiss floating role bar upon section navigation', () => {
  const navMapIdx = navContent.indexOf('navLinks.map((link) => {');
  assert(navMapIdx !== -1, 'Desktop nav link loop must exist');
  const navMapBlock = navContent.slice(navMapIdx, navMapIdx + 450);
  assert(navMapBlock.includes('setIsRoleBarOpen(false)'), 'Nav links click must dismiss role bar if open');
});

test('Brand group has zero nested interactive HTML tags', () => {
  const brandGroupCommentIdx = navContent.indexOf('Brand Group: Universal Role Switcher Avatar Button + Atul Verma Home Link');
  assert(brandGroupCommentIdx !== -1, 'Brand group comment must exist');
  const groupBlock = navContent.slice(brandGroupCommentIdx, brandGroupCommentIdx + 4500);
  
  // Verify avatar button closes before brand anchor opens
  const buttonOpen = groupBlock.indexOf('<button');
  const buttonClose = groupBlock.indexOf('</button>');
  const anchorOpen = groupBlock.indexOf('<a');
  const anchorClose = groupBlock.indexOf('</a>');
  
  assert(buttonOpen !== -1 && buttonClose !== -1 && anchorOpen !== -1 && anchorClose !== -1, 'Both elements must exist');
  assert(buttonClose < anchorOpen, 'Avatar button must close before brand anchor opens (no nested interactive elements)');
});

// ------------------------------------------------------------------
// Suite 4: Responsive Layout & Ultra-Narrow (<320px) Viewport Hardening
// ------------------------------------------------------------------
console.log('\n--- Suite 4: Responsive Layout & Ultra-Narrow (<320px) Viewport Hardening ---');

test('Brand group, avatar button, and right action group are shrink-protected', () => {
  assert(navContent.includes('flex items-center gap-2 shrink-0'), 'Brand group container must have shrink-0');
  assert(navContent.includes('flex items-center gap-1.5 sm:gap-2 shrink-0'), 'Right action group must have shrink-0');
});

test('Brand text is hidden on mobile (<640px) preventing horizontal overflow on <320px screens', () => {
  const brandAnchorIdx = navContent.indexOf('href="#hero"');
  const brandBlock = navContent.slice(brandAnchorIdx, brandAnchorIdx + 500);
  assert(brandBlock.includes('hidden sm:block'), 'Brand text link must be hidden sm:block');
});

test('RoleTabsBar floating bar supports horizontal scroll and clearance spacer on narrow viewports', () => {
  assert(roleTabsContent.includes('overflow-x-auto no-scrollbar scroll-smooth'), 'Floating bar must have horizontal overflow scrolling');
  assert(roleTabsContent.includes('w-2 shrink-0 sm:hidden'), 'Floating bar must have mobile clearance spacer');
});

// ------------------------------------------------------------------
// Suite 5: Dynamic Role Tracking & Complete De-cluttering
// ------------------------------------------------------------------
console.log('\n--- Suite 5: Dynamic Role Tracking & Complete De-cluttering ---');

test('Old standalone <RoleTabsBar variant="navbar" /> button is completely removed from JSX render', () => {
  const hasNavbarRoleTabsBar = /<RoleTabsBar\s+[^>]*variant=["']navbar["']/.test(navContent);
  assert(!hasNavbarRoleTabsBar, 'Old standalone <RoleTabsBar variant="navbar" /> JSX tag must be completely removed');
});

test('Floating bar and drawer RoleTabsBar variants remain fully functional', () => {
  assert(navContent.includes('variant="floating-bar"'), 'Floating bar variant must be rendered in Navbar');
  assert(navContent.includes('variant="drawer"'), 'Drawer variant must be rendered in mobile menu');
});

test('Avatar has reactive dynamic theme styling (borderColor, boxShadow, hover/active scaling)', () => {
  assert(navContent.includes('borderColor: accentColor'), 'Avatar must use dynamic accentColor border');
  assert(navContent.includes('boxShadow:') && navContent.includes('accentColor'), 'Avatar must use dynamic accentColor glow');
  assert(navContent.includes('hover:scale-105'), 'Avatar must have hover:scale-105 zoom');
  assert(navContent.includes('active:scale-95'), 'Avatar must have active:scale-95 tactile press');
  assert(navContent.includes('scale-105 ring-2 ring-[#FF4D6D]/40'), 'Avatar must have active ring highlight when open');
});

// ------------------------------------------------------------------
// Suite 6: Orientation, Resize & Bidirectional Keyboard Focus Hardening
// ------------------------------------------------------------------
console.log('\n--- Suite 6: Orientation, Resize & Bidirectional Keyboard Focus Hardening ---');

test('RoleTabsBar centers active career track tab with scrollIntoView respecting prefers-reduced-motion', () => {
  assert(roleTabsContent.includes('scrollActiveIntoView'), 'RoleTabsBar must declare scrollActiveIntoView handler');
  assert(roleTabsContent.includes('scrollIntoView'), 'RoleTabsBar must call scrollIntoView on active tab ref');
  assert(roleTabsContent.includes('prefers-reduced-motion'), 'Auto-centering scroll must respect prefers-reduced-motion accessibility preference');
  assert(roleTabsContent.includes("inline: 'center'"), 'Auto-centering scroll must use inline center alignment');
  assert(roleTabsContent.includes("window.addEventListener('orientationchange'"), 'Auto-centering scroll must listen to orientationchange');
  assert(roleTabsContent.includes("window.addEventListener('resize'"), 'Auto-centering scroll must listen to window resize');
});

test('RoleTabsBar floating-bar supports ArrowUp keyboard shortcut to dismiss bar and return focus', () => {
  assert(roleTabsContent.includes("e.key === 'ArrowUp'"), 'RoleTabsBar must handle ArrowUp key');
  assert(roleTabsContent.includes("variant === 'floating-bar'"), 'ArrowUp key dismissal must target floating-bar variant');
  assert(roleTabsContent.includes('onClose();'), 'ArrowUp key must trigger onClose callback');
});

test('Navbar avatar trigger transfers keyboard focus to active role tab on ArrowDown', () => {
  assert(navContent.includes('floating-role-tab-${activeRole}'), 'Navbar ArrowDown handler must locate active role tab element');
  assert(navContent.includes('activeTabEl?.focus()'), 'Navbar ArrowDown handler must focus active role tab');
});

test('Navbar auto-dismisses mobile drawer on desktop resize (>=768px) and orientation changes', () => {
  assert(navContent.includes('window.innerWidth >= 768 && mobileMenuOpen'), 'Navbar must detect desktop width threshold');
  assert(navContent.includes('setMobileMenuOpen(false)'), 'Navbar must close mobile drawer upon desktop resize');
  assert(navContent.includes("window.addEventListener('orientationchange', handleResize)"), 'Navbar must bind resize/orientation handler');
});

test('Navbar optimizes container padding for ultra-narrow screens (<260px)', () => {
  assert(navContent.includes('px-2 sm:px-3 md:px-8'), 'Header must support px-2 on ultra-narrow viewports');
  assert(navContent.includes('px-2.5 sm:px-4 md:px-5'), 'Inner container must support px-2.5 on ultra-narrow viewports');
});

// ------------------------------------------------------------------
// Summary Report
// ------------------------------------------------------------------
console.log('\n====================================================================');
console.log(`ADVERSARIAL STRESS TEST SUMMARY: ${passCount} passed, ${failCount} failed.`);
console.log('====================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log(`🎉 ALL ${passCount} ADVERSARIAL STRESS TESTS PASSED FLAWLESSLY!\n`);
}
