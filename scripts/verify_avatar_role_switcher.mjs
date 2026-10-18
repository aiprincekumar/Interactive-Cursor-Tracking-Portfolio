import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('========================================================');
console.log('VERIFICATION: NAVBAR AVATAR UNIVERSAL ROLE SWITCHER');
console.log('========================================================\n');

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

// ------------------------------------------------------------------
// 1. Universal Avatar Role Switcher Trigger (R1)
// ------------------------------------------------------------------
test('Avatar is rendered as a standalone <button type="button"> toggle', () => {
  assert(navContent.includes('type="button"'), 'Button element must have type="button"');
  assert(navContent.includes('onClick={toggleRoleBar}'), 'Avatar button must bind onClick to toggleRoleBar');
  assert(navContent.includes('aria-expanded={isRoleBarOpen}'), 'Avatar button must expose aria-expanded={isRoleBarOpen}');
  assert(navContent.includes('aria-haspopup="dialog"'), 'Avatar button must have aria-haspopup="dialog"');
  assert(navContent.includes('cursor-pointer'), 'Avatar button must have cursor-pointer styling');
});

test('Avatar maintains dynamic accent glow ring and hover zoom feedback', () => {
  assert(navContent.includes('borderColor: accentColor'), 'Avatar must have borderColor bound to accentColor');
  assert(navContent.includes('boxShadow:') && navContent.includes('accentColor'), 'Avatar must have dynamic boxShadow glow with accentColor');
  assert(navContent.includes('hover:scale-105'), 'Avatar button must have hover:scale-105 zoom');
  assert(navContent.includes('active:scale-95'), 'Avatar button must have active:scale-95 tactile press');
  assert(navContent.includes('transition-all duration-300'), 'Avatar button must have smooth 300ms transition');
});

test('Avatar preserves dynamic role tooltip and accessible labelling', () => {
  assert(navContent.includes('title=') && navContent.includes('Profile • Atul Verma'), 'Avatar tooltip title must reference Profile • Atul Verma');
  assert(navContent.includes('aria-label='), 'Avatar must include screen-reader accessible aria-label');
  assert(navContent.includes('Close career track switcher'), 'Avatar aria-label must support toggled closed state');
});

test('Avatar preserves fallback AV monogram and cross-dissolve transitions', () => {
  assert(navContent.includes('<span className="font-mono text-[11px] text-[#FAF8F5] dark:text-[#F5F2F8]">AV</span>'), 'Fallback AV monogram must be present');
  assert(navContent.includes('opacity-0 pointer-events-none'), 'Monogram must disappear when image loads cleanly');
  assert(navContent.includes('scale-100') && navContent.includes('scale-95'), 'Image cross-dissolve scale transitions must be present');
});

// ------------------------------------------------------------------
// 2. Clean Brand Link Separation (R2)
// ------------------------------------------------------------------
test('Brand name "Atul Verma" is an independent navigation link to #hero', () => {
  assert(navContent.includes('href="#hero"'), 'Brand link must navigate to #hero');
  assert(navContent.includes('>Atul Verma<') || navContent.includes('Atul Verma\n') || navContent.includes('Atul Verma'), 'Brand text Atul Verma must be present');
  
  // Verify avatar and brand link are siblings inside a container (no nested interactive tags)
  const brandGroupIdx = navContent.indexOf('Brand Group: Universal Role Switcher Avatar Button + Atul Verma Home Link');
  assert(brandGroupIdx !== -1, 'Brand group container comment must be present');
  
  // Ensure the anchor does not wrap the button
  const avatarButtonIdx = navContent.indexOf('onClick={toggleRoleBar}');
  const brandAnchorIdx = navContent.indexOf('href="#hero"');
  assert(avatarButtonIdx !== -1 && brandAnchorIdx !== -1, 'Both avatar button and brand anchor must be found');
  assert(avatarButtonIdx < brandAnchorIdx, 'Avatar button must precede brand anchor as clean sibling');
  
  // Verify brand anchor does not invoke toggleRoleBar
  const brandAnchorSubstring = navContent.slice(brandAnchorIdx, brandAnchorIdx + 300);
  assert(!brandAnchorSubstring.includes('toggleRoleBar'), 'Brand anchor must NOT call toggleRoleBar');
  assert(brandAnchorSubstring.includes("setActiveSection('hero')"), 'Brand anchor should set active section to hero');
});

// ------------------------------------------------------------------
// 3. De-clutter Navigation Bar (R3)
// ------------------------------------------------------------------
test('Old standalone <RoleTabsBar variant="navbar" /> button is completely removed from JSX render', () => {
  // Regex ensures no JSX tag <RoleTabsBar variant="navbar" exists
  const hasNavbarRoleTabsBar = /<RoleTabsBar\s+[^>]*variant=["']navbar["']/.test(navContent);
  assert(!hasNavbarRoleTabsBar, 'Old standalone <RoleTabsBar variant="navbar" /> JSX tag must be completely removed');
});

test('Navigation bar preserves all other actions and floating/drawer role bars', () => {
  assert(navContent.includes('variant="floating-bar"'), 'Floating horizontal role bar must remain');
  assert(navContent.includes('variant="drawer"'), 'Mobile drawer role bar must remain');
  assert(navContent.includes('Search portfolio (Cmd+K)'), 'Search trigger must remain');
  assert(navContent.includes('toggleExploreBar'), 'Explore trigger must remain');
  assert(navContent.includes('setSoundEnabled'), 'Audio toggle must remain');
  assert(navContent.includes('ResumeDropdown'), 'Resume dropdown must remain');
  assert(navContent.includes('setMobileMenuOpen'), 'Mobile menu toggle must remain');
});

// ------------------------------------------------------------------
// 4. Accessibility & Outside Dismissal Integrity
// ------------------------------------------------------------------
test('Outside click and Escape key listeners dismiss the floating role-switcher bar', () => {
  assert(navContent.includes('handleClickOutside'), 'Outside click handler must exist');
  assert(navContent.includes('handleKeyDown'), 'Keydown handler must exist');
  assert(navContent.includes("event.key === 'Escape'"), 'Escape key check must exist');
  assert(navContent.includes('setIsRoleBarOpen(false)'), 'Outside click & Escape must set isRoleBarOpen(false)');
});

// ------------------------------------------------------------------
// Summary Report
// ------------------------------------------------------------------
console.log('\n========================================================');
console.log(`TEST SUMMARY: ${passCount} passed, ${failCount} failed.`);
console.log('========================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL NAVBAR AVATAR UNIVERSAL ROLE SWITCHER VERIFICATIONS PASSED!\n');
}
