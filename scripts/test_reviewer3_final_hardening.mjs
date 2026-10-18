import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('====================================================================');
console.log('REVIEWER SPECIALIST 3: FINAL HARDENING & QUALITY GATE AUDIT');
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

const cmdPalettePath = path.join(rootDir, 'src/components/CommandPalette.jsx');
const cmdPaletteContent = fs.readFileSync(cmdPalettePath, 'utf-8');

const roleContextPath = path.join(rootDir, 'src/context/RoleContext.jsx');
const roleContextContent = fs.readFileSync(roleContextPath, 'utf-8');

// ------------------------------------------------------------------
// Audit Gate 1: Universal Profile Avatar Trigger (R1)
// ------------------------------------------------------------------
console.log('--- Gate 1: Universal Avatar Trigger & Interactive Feedback ---');

test('Navbar avatar is an interactive button with ref, type="button", and aria controls', () => {
  assert(navContent.includes('ref={avatarButtonRef}'), 'Must bind avatarButtonRef');
  assert(navContent.includes('type="button"'), 'Must have type="button"');
  assert(navContent.includes('onClick={toggleRoleBar}'), 'Must bind onClick to toggleRoleBar');
  assert(navContent.includes('aria-controls="floating-career-track-bar"'), 'Must control floating-career-track-bar');
  assert(navContent.includes('aria-haspopup="dialog"'), 'Must specify aria-haspopup="dialog"');
  assert(navContent.includes('aria-expanded={isRoleBarOpen}'), 'Must specify dynamic aria-expanded');
});

test('Avatar has reactive dynamic theme styling (glow ring, border color, hover zoom, active press)', () => {
  assert(navContent.includes('borderColor: accentColor'), 'Must bind border color to dynamic track accent');
  assert(navContent.includes('boxShadow:') && navContent.includes('accentColor'), 'Must compute dynamic shadow glow');
  assert(navContent.includes('hover:scale-105'), 'Must scale up to 105% on hover');
  assert(navContent.includes('active:scale-95'), 'Must scale down to 95% on tactile press');
  assert(navContent.includes('scale-105 ring-2 ring-[#FF4D6D]/40'), 'Must show prominent ring highlight when open');
});

test('Avatar provides fallback AV monogram and smooth image cross-dissolve', () => {
  assert(navContent.includes('<span className="font-mono text-[11px] text-[#FAF8F5] dark:text-[#F5F2F8]">AV</span>'), 'Must render fallback AV monogram');
  assert(navContent.includes('opacity-0 pointer-events-none'), 'Monogram must fade out when image loads');
  assert(navContent.includes('opacity-100 scale-100') && navContent.includes('opacity-0 scale-95'), 'Avatar image must transition opacity and scale');
});

// ------------------------------------------------------------------
// Audit Gate 2: Clean Brand Link Separation & Semantic DOM (R2)
// ------------------------------------------------------------------
console.log('\n--- Gate 2: Brand Link Separation & Semantic DOM Tree ---');

test('Brand name "Atul Verma" is an independent navigation anchor navigating to #hero', () => {
  const brandAnchorIdx = navContent.indexOf('href="#hero"');
  assert(brandAnchorIdx !== -1, 'Anchor to #hero must exist');
  const brandAnchorBlock = navContent.slice(brandAnchorIdx, brandAnchorIdx + 800);
  assert(brandAnchorBlock.includes('Atul Verma'), 'Must display Atul Verma brand text');
  assert(brandAnchorBlock.includes("setActiveSection('hero')"), 'Must update activeSection to hero on click');
  assert(!brandAnchorBlock.includes('toggleRoleBar'), 'Brand anchor must NOT trigger toggleRoleBar');
});

test('Avatar button and Brand link are siblings with zero nested interactive elements', () => {
  const brandGroupIdx = navContent.indexOf('Brand Group: Universal Role Switcher Avatar Button + Atul Verma Home Link');
  assert(brandGroupIdx !== -1, 'Brand group comment must exist');
  const groupBlock = navContent.slice(brandGroupIdx, brandGroupIdx + 5000);
  
  const buttonStart = groupBlock.indexOf('<button');
  const buttonEnd = groupBlock.indexOf('</button>');
  const anchorStart = groupBlock.indexOf('<a');
  const anchorEnd = groupBlock.indexOf('</a>');
  
  assert(buttonStart !== -1 && buttonEnd !== -1, 'Button element must exist');
  assert(anchorStart !== -1 && anchorEnd !== -1, 'Anchor element must exist');
  assert(buttonEnd < anchorStart, 'Button must cleanly close before Anchor begins (no nesting)');
});

// ------------------------------------------------------------------
// Audit Gate 3: Header De-cluttering & Menu Preservation (R3)
// ------------------------------------------------------------------
console.log('\n--- Gate 3: Header De-cluttering & Menu Preservation ---');

test('Standalone <RoleTabsBar variant="navbar" /> is completely removed from JSX render', () => {
  const hasNavbarRoleTabsBar = /<RoleTabsBar\s+[^>]*variant=["']navbar["']/.test(navContent);
  assert(!hasNavbarRoleTabsBar, 'Old standalone <RoleTabsBar variant="navbar" /> must NOT be in JSX');
});

test('Header preserves all essential interactive menus', () => {
  assert(navContent.includes('Search portfolio (Cmd+K)'), 'Search trigger must exist');
  assert(navContent.includes('Explore Showcase & Lab'), 'Explore trigger must exist');
  assert(navContent.includes('desktop-cursor-only'), 'Desktop cursor trigger must exist');
  assert(navContent.includes('toggleTheme'), 'Theme toggle trigger must exist');
  assert(navContent.includes('setSoundEnabled'), 'Audio toggle trigger must exist');
  assert(navContent.includes('ResumeDropdown'), 'Resume dropdown trigger must exist');
  assert(navContent.includes('setMobileMenuOpen'), 'Mobile menu trigger must exist');
  assert(navContent.includes('variant="floating-bar"'), 'Floating role bar must exist');
  assert(navContent.includes('variant="drawer"'), 'Mobile drawer role bar must exist');
});

// ------------------------------------------------------------------
// Audit Gate 4: Bidirectional Keyboard Focus & Navigation Flow
// ------------------------------------------------------------------
console.log('\n--- Gate 4: Bidirectional Keyboard Focus & WAI-ARIA APG ---');

test('ArrowDown on Avatar transfers focus to the active role tab in the floating bar', () => {
  const arrowDownIdx = navContent.indexOf("e.key === 'ArrowDown'");
  assert(arrowDownIdx !== -1, 'ArrowDown listener must exist on avatar button');
  const arrowDownBlock = navContent.slice(arrowDownIdx, arrowDownIdx + 600);
  assert(arrowDownBlock.includes('toggleRoleBar()'), 'ArrowDown must open the bar if closed');
  assert(arrowDownBlock.includes('floating-role-tab-${activeRole}'), 'ArrowDown must locate active role tab');
  assert(arrowDownBlock.includes('activeTabEl?.focus()'), 'ArrowDown must focus active role tab');
});

test('ArrowUp inside floating bar dismisses bar and restores focus to avatar trigger', () => {
  const arrowUpIdx = roleTabsContent.indexOf("e.key === 'ArrowUp'");
  assert(arrowUpIdx !== -1, 'ArrowUp listener must exist in RoleTabsBar');
  const arrowUpBlock = roleTabsContent.slice(arrowUpIdx - 50, arrowUpIdx + 200);
  assert(arrowUpBlock.includes("variant === 'floating-bar'"), 'ArrowUp must check variant is floating-bar');
  assert(arrowUpBlock.includes('onClose()'), 'ArrowUp must call onClose()');

  const floatingBarIdx = navContent.indexOf('variant="floating-bar"');
  const floatingBarBlock = navContent.slice(floatingBarIdx, floatingBarIdx + 400);
  assert(floatingBarBlock.includes('avatarButtonRef.current?.focus()'), 'Floating bar onClose must restore focus to avatar');
});

test('Escape key in Navbar dismisses role bar and restores focus to avatar trigger', () => {
  const escIdx = navContent.indexOf("event.key === 'Escape'");
  assert(escIdx !== -1, 'Escape listener must exist');
  const escBlock = navContent.slice(escIdx, escIdx + 450);
  assert(escBlock.includes('setIsRoleBarOpen(false)'), 'Escape must close role bar');
  assert(escBlock.includes('avatarButtonRef.current?.focus()'), 'Escape must return focus to avatar trigger');
});

test('ArrowLeft / ArrowRight / Home / End navigate among career track tabs in RoleTabsBar', () => {
  assert(roleTabsContent.includes("e.key === 'ArrowRight'"), 'ArrowRight must advance role');
  assert(roleTabsContent.includes("e.key === 'ArrowLeft'"), 'ArrowLeft must retreat role');
  assert(roleTabsContent.includes("e.key === 'Home'"), 'Home must navigate to first role');
  assert(roleTabsContent.includes("e.key === 'End'"), 'End must navigate to last role');
  assert(roleTabsContent.includes('tabButtonRefs.current[nextRole]?.focus()'), 'Keyboard navigation must set focus to selected tab');
});

// ------------------------------------------------------------------
// Audit Gate 5: Orientation, Resize & Prefers-Reduced-Motion
// ------------------------------------------------------------------
console.log('\n--- Gate 5: Orientation, Resize & Prefers-Reduced-Motion ---');

test('RoleTabsBar centers active tab on mount, role switch, resize, and orientationchange', () => {
  assert(roleTabsContent.includes('scrollActiveIntoView'), 'Must define scrollActiveIntoView handler');
  assert(roleTabsContent.includes("window.addEventListener('resize', scrollActiveIntoView)"), 'Must listen to window resize');
  assert(roleTabsContent.includes("window.addEventListener('orientationchange', scrollActiveIntoView)"), 'Must listen to orientationchange');
  assert(roleTabsContent.includes("inline: 'center'"), 'Must center tab horizontally');
  assert(roleTabsContent.includes('prefers-reduced-motion'), 'Must check prefers-reduced-motion');
});

test('Navbar auto-dismisses mobile drawer on desktop resize and orientation changes', () => {
  assert(navContent.includes('window.innerWidth >= 768 && mobileMenuOpen'), 'Must check desktop breakpoint >=768px');
  assert(navContent.includes('setMobileMenuOpen(false)'), 'Must close mobile drawer');
  assert(navContent.includes("window.addEventListener('orientationchange', handleResize)"), 'Must bind orientationchange');
  assert(navContent.includes("window.addEventListener('resize', handleResize)"), 'Must bind resize');
});

// ------------------------------------------------------------------
// Audit Gate 6: Mutual Exclusion & CommandPalette Interoperability
// ------------------------------------------------------------------
console.log('\n--- Gate 6: Mutual Exclusion & CommandPalette Interoperability ---');

test('Opening role bar closes search, explore, ribbon, and mobile drawer', () => {
  const toggleFnIdx = navContent.indexOf('const toggleRoleBar = () => {');
  assert(toggleFnIdx !== -1, 'toggleRoleBar must exist');
  const block = navContent.slice(toggleFnIdx, toggleFnIdx + 300);
  assert(block.includes('setIsExploreOpen(false)'), 'Closes explore');
  assert(block.includes('setIsRibbonOpen(false)'), 'Closes ribbon');
  assert(block.includes('setMobileMenuOpen(false)'), 'Closes mobile menu');
  assert(block.includes('setIsSearchOpen(false)'), 'Closes search');
});

test('Cmd+K shortcut and Search trigger mutually exclude role bar', () => {
  const searchShortcutIdx = navContent.indexOf("e.key.toLowerCase() === 'k'");
  assert(searchShortcutIdx !== -1, 'Cmd+K handler must exist');
  const shortcutBlock = navContent.slice(searchShortcutIdx, searchShortcutIdx + 300);
  assert(shortcutBlock.includes('setIsRoleBarOpen(false)'), 'Shortcut must close role bar');

  const searchBtnIdx = navContent.indexOf('Search portfolio (Cmd+K)');
  assert(searchBtnIdx !== -1, 'Search button must exist');
  const searchBtnBlock = navContent.slice(searchBtnIdx - 400, searchBtnIdx);
  assert(searchBtnBlock.includes('setIsRoleBarOpen(false)'), 'Search button click must close role bar');
});

test('CommandPalette passes role updates through onSelectRole prop & switch-role-tab event', () => {
  assert(cmdPaletteContent.includes('onSelectRole(item.role)'), 'CommandPalette must call onSelectRole');
  assert(cmdPaletteContent.includes("new CustomEvent('switch-role-tab', { detail: { role: item.role } })"), 'CommandPalette must dispatch switch-role-tab');
});

// ------------------------------------------------------------------
// Audit Gate 7: 4-Track Integrity & Asset Files Verification
// ------------------------------------------------------------------
console.log('\n--- Gate 7: 4-Track Integrity & Asset Files Verification ---');

const expectedTracks = [
  { id: 'overview', file: 'Overview.jpg', accent: '#6366F1' },
  { id: 'accountant', file: 'Accountant.jpg', accent: '#FF4D6D' },
  { id: 'mis', file: 'MIS.jpg', accent: '#3B82F6' },
  { id: 'other', file: 'Others.jpg', accent: '#8B5CF6' }
];

expectedTracks.forEach((track) => {
  test(`Track '${track.id}' profile picture exists and is non-empty`, () => {
    const assetPath = path.join(rootDir, 'public/assets/Profile_Pic', track.file);
    assert(fs.existsSync(assetPath), `Asset ${track.file} must exist at ${assetPath}`);
    const stat = fs.statSync(assetPath);
    assert(stat.size > 5000, `Asset ${track.file} must be a valid image file (>5KB), got ${stat.size} bytes`);
  });

  test(`Track '${track.id}' is configured in RoleContext with expected accent ${track.accent}`, () => {
    assert(roleContextContent.includes(`id: '${track.id}'`), `Track ${track.id} must be defined`);
    assert(roleContextContent.includes(track.accent), `Accent ${track.accent} must be configured for ${track.id}`);
  });
});

// ------------------------------------------------------------------
// Summary Report
// ------------------------------------------------------------------
console.log('\n====================================================================');
console.log(`FINAL HARDENING AUDIT SUMMARY: ${passCount} passed, ${failCount} failed.`);
console.log('====================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log(`🎉 ALL ${passCount} FINAL HARDENING AUDIT CHECKS PASSED FLAWLESSLY!\n`);
}
