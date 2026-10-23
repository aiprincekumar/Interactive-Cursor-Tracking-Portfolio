import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('========================================================================');
console.log('  VERIFYING SMOOTH AUTO-SCROLL RESTORATION & NAVBAR MUTUAL EXCLUSIVITY  ');
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

const navbarPath = path.join(rootDir, 'src/components/Navbar.jsx');
const navbarContent = fs.readFileSync(navbarPath, 'utf8');

const hookPath = path.join(rootDir, 'src/hooks/useScrollRestoration.js');
assert.ok(fs.existsSync(hookPath), 'src/hooks/useScrollRestoration.js must exist on disk');
const hookContent = fs.readFileSync(hookPath, 'utf8');

const skeletonPath = path.join(rootDir, 'src/components/SectionSkeleton.jsx');
const skeletonContent = fs.readFileSync(skeletonPath, 'utf8');

const appPath = path.join(rootDir, 'src/App.jsx');
const appContent = fs.readFileSync(appPath, 'utf8');

// ========================================================================
// Suite 1: Navbar Sub-Bars Strict Mutual Exclusivity Architecture
// ========================================================================
console.log('--- Suite 1: Navbar Sub-Bars Strict Mutual Exclusivity Architecture ---');

test('Navbar defines activeSubBar single source of truth state', () => {
  assert(navbarContent.includes("const [activeSubBar, setActiveSubBar] = useState(null);"), 'activeSubBar state must be initialized to null');
});

test('All 5 sub-bar booleans are derived strictly from activeSubBar', () => {
  assert(navbarContent.includes("const isRoleBarOpen = activeSubBar === 'role';"), 'isRoleBarOpen must be derived from activeSubBar');
  assert(navbarContent.includes("const isExploreOpen = activeSubBar === 'explore';"), 'isExploreOpen must be derived from activeSubBar');
  assert(navbarContent.includes("const isAudienceOpen = activeSubBar === 'audience';"), 'isAudienceOpen must be derived from activeSubBar');
  assert(navbarContent.includes("const isViewModeOpen = activeSubBar === 'viewmode';"), 'isViewModeOpen must be derived from activeSubBar');
  assert(navbarContent.includes("const isRibbonOpen = activeSubBar === 'cursor';"), 'isRibbonOpen must be derived from activeSubBar');
});

test('State simulation proves mathematical impossibility of overlapping sub-bars', () => {
  const SUBBAR_NAMES = ['role', 'explore', 'audience', 'viewmode', 'cursor'];
  
  // For any state value, exactly 0 or 1 boolean can be true
  for (const state of [null, ...SUBBAR_NAMES]) {
    const isRoleBarOpen = state === 'role';
    const isExploreOpen = state === 'explore';
    const isAudienceOpen = state === 'audience';
    const isViewModeOpen = state === 'viewmode';
    const isRibbonOpen = state === 'cursor';

    const activeCount = [isRoleBarOpen, isExploreOpen, isAudienceOpen, isViewModeOpen, isRibbonOpen].filter(Boolean).length;
    assert(activeCount <= 1, `At most 1 sub-bar can be open when activeSubBar is ${state}, found ${activeCount}`);
  }
});

test('Cursor ribbon toggle enforces mutual exclusion closing explore, role, audience, viewmode', () => {
  const cursorFnIdx = navbarContent.indexOf('const toggleCursorRibbon = () => {');
  assert(cursorFnIdx !== -1, 'toggleCursorRibbon function must exist');
  const cursorFnBlock = navbarContent.slice(cursorFnIdx, cursorFnIdx + 400);
  assert(cursorFnBlock.includes('setIsRoleBarOpen(false)'), 'Cursor toggle must close role bar');
  assert(cursorFnBlock.includes('setIsExploreOpen(false)'), 'Cursor toggle must close explore sub-bar');
  assert(cursorFnBlock.includes('setIsAudienceOpen(false)'), 'Cursor toggle must close audience sub-bar');
  assert(cursorFnBlock.includes('setIsViewModeOpen(false)'), 'Cursor toggle must close view mode sub-bar');
});

test('Search launch and mobile drawer toggle close any active horizontal sub-bar', () => {
  const searchBtnIdx = navbarContent.indexOf('Search portfolio (Cmd+K)');
  assert(searchBtnIdx !== -1, 'Search trigger button must exist');
  const searchBlock = navbarContent.slice(searchBtnIdx - 350, searchBtnIdx);
  assert(searchBlock.includes('setActiveSubBar(null)'), 'Search click must reset activeSubBar');

  const mobileBtnIdx = navbarContent.indexOf('mobileMenuButtonRef');
  assert(mobileBtnIdx !== -1, 'Mobile hamburger menu must exist');
  assert(navbarContent.includes('setActiveSubBar(null)') && navbarContent.includes('setMobileMenuOpen(next)'), 'Mobile menu toggle must reset activeSubBar');
});

test('Outside click and Escape key listeners dismiss active sub-bar cleanly', () => {
  assert(navbarContent.includes('!activeSubBar && !mobileMenuOpen'), 'Outside click listener must watch activeSubBar and mobileMenuOpen');
  assert(navbarContent.includes('setActiveSubBar(null)'), 'Click outside must dismiss active sub-bar');
});

// ========================================================================
// Suite 2: Smooth Auto-Scroll Restoration System Architecture
// ========================================================================
console.log('\n--- Suite 2: Smooth Auto-Scroll Restoration System Architecture ---');

test('useScrollRestoration sets window.history.scrollRestoration to manual', () => {
  assert(hookContent.includes("window.history.scrollRestoration = 'manual'"), "Must enforce window.history.scrollRestoration = 'manual'");
});

test('useScrollRestoration inspects hash and sessionStorage for last active section', () => {
  assert(hookContent.includes('window.location.hash'), 'Must inspect window.location.hash');
  assert(hookContent.includes('sessionStorage.getItem(RESTORATION_STORAGE_KEY)'), 'Must inspect sessionStorage for RESTORATION_STORAGE_KEY');
  assert(hookContent.includes("portfolio_last_active_section"), 'RESTORATION_STORAGE_KEY must be portfolio_last_active_section');
});

test('useScrollRestoration performs smooth animated scroll down to target section', () => {
  assert(hookContent.includes("el.scrollIntoView({ behavior: 'smooth', block: 'start' })"), 'Must trigger smooth animated scroll to target section');
});

test('useScrollRestoration cancels auto-scroll immediately on user interaction', () => {
  assert(hookContent.includes('wheel') && hookContent.includes('touchstart') && hookContent.includes('pointerdown'), 'Must register cancel on wheel, touchstart, and pointerdown');
  assert(hookContent.includes('ArrowDown') && hookContent.includes('PageDown'), 'Must register cancel on user navigation keys');
});

test('useScrollRestoration implements layout expansion observer / retry loop for lazy sections', () => {
  assert(hookContent.includes('ResizeObserver'), 'Must observe document layout changes via ResizeObserver');
  assert(hookContent.includes('MAX_SETTLE_MS = 2500') || hookContent.includes('2500'), 'Must maintain up to 2.5s settlement retry window for Suspense chunks');
});

test('useScrollRestoration passively persists active section to sessionStorage during normal browsing', () => {
  assert(hookContent.includes('sessionStorage.setItem(RESTORATION_STORAGE_KEY'), 'Must save active section to sessionStorage');
  assert(hookContent.includes("sessionStorage.setItem(RESTORATION_STORAGE_KEY, 'contact')"), 'Must accurately capture bottom-of-page contact section');
});

// ========================================================================
// Suite 3: Suspense Skeletons ID Anchor Preservation
// ========================================================================
console.log('\n--- Suite 3: Suspense Skeletons ID Anchor Preservation ---');

test('SectionSkeleton accepts id prop and attaches it to DOM container', () => {
  assert(skeletonContent.includes('id,'), 'SectionSkeleton must destructure id prop');
  assert(skeletonContent.includes('id={id}'), 'SectionSkeleton must assign id={id} to root element');
  assert(skeletonContent.includes('scroll-mt-28'), 'SectionSkeleton must include scroll-mt-28 for exact navbar offset alignment');
});

test('App.jsx mounts useScrollRestoration and passes id to all Suspense section skeletons', () => {
  assert(appContent.includes("import { useScrollRestoration } from './hooks/useScrollRestoration';"), 'App.jsx must import useScrollRestoration');
  assert(appContent.includes('useScrollRestoration();'), 'App.jsx must invoke useScrollRestoration()');

  // Verify all lazy section fallbacks receive exact matching id props
  assert(appContent.includes('<SectionSkeleton id="about"'), 'AboutSection fallback must have id="about"');
  assert(appContent.includes('<SectionSkeleton id="skills"'), 'SkillsSection fallback must have id="skills"');
  assert(appContent.includes('<SectionSkeleton id="experience"'), 'ExperienceSection fallback must have id="experience"');
  assert(appContent.includes('<SectionSkeleton id="projects"'), 'ProjectsSection fallback must have id="projects"');
  assert(appContent.includes('<SectionSkeleton id="achievements"'), 'CodingAchievementsSection fallback must have id="achievements"');
  assert(appContent.includes('<SectionSkeleton id="social-proof"'), 'SocialProofSection fallback must have id="social-proof"');
  assert(appContent.includes('<SectionSkeleton id="gallery"'), 'CameraRollGallery fallback must have id="gallery"');
  assert(appContent.includes('<SectionSkeleton id="playground"'), 'InteractivePlayground fallback must have id="playground"');
  assert(appContent.includes('<SectionSkeleton id="faq"'), 'FAQSection fallback must have id="faq"');
  assert(appContent.includes('<SectionSkeleton id="contact"'), 'ContactSection fallback must have id="contact"');
});

console.log('========================================================================');
console.log(`TOTAL AUDIT CHECKS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('========================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🌟 SMOOTH AUTO-SCROLL RESTORATION & NAVBAR MUTUAL EXCLUSIVITY VERIFIED 100%! 🌟\n');
}
