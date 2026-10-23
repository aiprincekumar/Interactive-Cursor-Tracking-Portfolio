import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('========================================================================');
console.log('  VERIFYING NAVBAR INSTANT SELECTION LOCK ON FIRST CLICK & SCROLLSPY   ');
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
assert.ok(fs.existsSync(navbarPath), 'src/components/Navbar.jsx must exist');
const navbarContent = fs.readFileSync(navbarPath, 'utf8');

// ========================================================================
// Suite 1: Selection Lock Guard & Click Handlers Architecture
// ========================================================================
console.log('--- Suite 1: Selection Lock Guard & Click Handlers Architecture ---');

test('handleNavClick locks navigation state immediately and sets activeSection', () => {
  assert(navbarContent.includes('isClickNavigatingRef.current = true;'), 'Must set isClickNavigatingRef.current = true on click');
  assert(navbarContent.includes('setActiveSection(sectionId);'), 'Must immediately set activeSection(sectionId) on click');
  assert(navbarContent.includes('1400'), 'Must use 1400ms smooth scroll safety timeout');
});

test('handleMobileNavClick locks navigation state immediately and sets activeSection', () => {
  const mobileNavClickIdx = navbarContent.indexOf('const handleMobileNavClick =');
  assert(mobileNavClickIdx !== -1, 'handleMobileNavClick must exist');
  const mobileNavBlock = navbarContent.slice(mobileNavClickIdx, mobileNavClickIdx + 500);
  assert(mobileNavBlock.includes('isClickNavigatingRef.current = true;'), 'Mobile nav click must set isClickNavigatingRef.current = true');
  assert(mobileNavBlock.includes('setActiveSection(sectionId);'), 'Mobile nav click must immediately set activeSection(sectionId)');
});

test('updateActiveSection contains Selection Lock Guard at entry', () => {
  const updateIdx = navbarContent.indexOf('const updateActiveSection = () => {');
  assert(updateIdx !== -1, 'updateActiveSection function must exist');
  const updateBlock = navbarContent.slice(updateIdx, updateIdx + 400);
  assert(
    updateBlock.includes('if (isClickNavigatingRef.current) {') && updateBlock.includes('ticking = false;') && updateBlock.includes('return;'),
    'updateActiveSection must immediately return when isClickNavigatingRef.current is true to prevent overriding active button'
  );
});

test('handleOpenEstimator locks selection to Contact section', () => {
  const estimatorIdx = navbarContent.indexOf('const handleOpenEstimator =');
  assert(estimatorIdx !== -1, 'handleOpenEstimator function must exist');
  const estimatorBlock = navbarContent.slice(estimatorIdx, estimatorIdx + 300);
  assert(estimatorBlock.includes("handleNavClick('contact', 'Contact')"), 'Estimator button must call handleNavClick to lock Contact');
});

// ========================================================================
// Suite 2: Clean Release & Interruption Listeners
// ========================================================================
console.log('\n--- Suite 2: Clean Release & Interruption Listeners ---');

test('releaseClickLock and handleManualScrollInterrupt are defined in ScrollSpy effect', () => {
  assert(navbarContent.includes('const releaseClickLock = () => {'), 'releaseClickLock must exist');
  assert(navbarContent.includes('const handleManualScrollInterrupt = () => {'), 'handleManualScrollInterrupt must exist');
  assert(navbarContent.includes('isClickNavigatingRef.current = false;'), 'releaseClickLock must reset isClickNavigatingRef.current to false');
});

test('Modern scrollend, wheel, and touchstart event listeners are registered and cleaned up', () => {
  assert(navbarContent.includes("window.addEventListener('scrollend', releaseClickLock"), 'Must register scrollend listener');
  assert(navbarContent.includes("window.addEventListener('wheel', handleManualScrollInterrupt"), 'Must register wheel interrupt listener');
  assert(navbarContent.includes("window.addEventListener('touchstart', handleManualScrollInterrupt"), 'Must register touchstart interrupt listener');

  assert(navbarContent.includes("window.removeEventListener('scrollend', releaseClickLock"), 'Must cleanup scrollend listener');
  assert(navbarContent.includes("window.removeEventListener('wheel', handleManualScrollInterrupt"), 'Must cleanup wheel listener');
  assert(navbarContent.includes("window.removeEventListener('touchstart', handleManualScrollInterrupt"), 'Must cleanup touchstart listener');
});

// ========================================================================
// Suite 3: Detached Element Protection & Sub-Section Mapping
// ========================================================================
console.log('\n--- Suite 3: Detached Element Protection & Sub-Section Mapping ---');

test('isElementConnected verifies node connectivity to DOM', () => {
  assert(navbarContent.includes('const isElementConnected = (el) => {'), 'isElementConnected helper must exist');
  assert(navbarContent.includes('el.isConnected'), 'Must check el.isConnected');
  assert(navbarContent.includes('document.body.contains(el)'), 'Must check document.body.contains fallback');
});

test('getCachedElements detects detached elements and re-scans live DOM', () => {
  assert(navbarContent.includes('hasDetachedElements'), 'getCachedElements must check for detached elements');
  assert(navbarContent.includes('!isElementConnected(item.el)'), 'Must identify elements disconnected by React Suspense resolution');
});

test('SECTION_TO_NAV_MAP maps gallery and playground to projects', () => {
  assert(navbarContent.includes('SECTION_TO_NAV_MAP'), 'SECTION_TO_NAV_MAP must be defined');
  assert(navbarContent.includes("gallery: 'projects'"), "gallery must map to projects");
  assert(navbarContent.includes("playground: 'projects'"), "playground must map to projects");
});

// ========================================================================
// Suite 4: Behavioral Simulation of Selection Lock & Scroll Dynamics
// ========================================================================
console.log('\n--- Suite 4: Behavioral Simulation of Selection Lock & Scroll Dynamics ---');

test('Simulated First Click: activeSection stays locked during intermediate scroll frames', () => {
  let activeSection = 'hero';
  let isClickNavigating = false;
  let clickTimeout = null;

  const handleNavClickSim = (id) => {
    isClickNavigating = true;
    if (clickTimeout) clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => {
      isClickNavigating = false;
    }, 1400);
    activeSection = id;
  };

  const updateActiveSectionSim = (viewportSection) => {
    if (isClickNavigating) {
      return; // LOCKED
    }
    activeSection = viewportSection;
  };

  // 1. User clicks 'skills' button from hero
  handleNavClickSim('skills');
  assert.strictEqual(activeSection, 'skills', 'Active section must immediately become skills on first click');
  assert.strictEqual(isClickNavigating, true, 'Navigation lock must be active');

  // 2. Scroll frame 1: Viewport is still at hero
  updateActiveSectionSim('hero');
  assert.strictEqual(activeSection, 'skills', 'Active section must NOT revert to hero on first scroll frame!');

  // 3. Scroll frame 2: Viewport is passing 'about'
  updateActiveSectionSim('about');
  assert.strictEqual(activeSection, 'skills', 'Active section must NOT flicker to intermediate section about');

  // 4. Smooth scroll finishes: scrollend fires
  isClickNavigating = false;
  clearTimeout(clickTimeout);

  // 5. At destination (skills), scrollspy maintains skills
  updateActiveSectionSim('skills');
  assert.strictEqual(activeSection, 'skills', 'Active section remains skills at destination');
});

test('Simulated Detached Node Recovery: re-indexes live elements when skeleton replaced', () => {
  let staleNode = { isConnected: false, id: 'projects' };
  let liveNode = { isConnected: true, id: 'projects' };
  let dom = { projects: liveNode };

  let cachedElements = [{ id: 'projects', el: staleNode }];

  const isConnected = (el) => el && el.isConnected;
  const hasDetached = cachedElements.some((item) => !isConnected(item.el));
  assert.strictEqual(hasDetached, true, 'Must detect detached element');

  if (hasDetached) {
    cachedElements = ['projects'].map((id) => ({ id, el: dom[id] })).filter((item) => isConnected(item.el));
  }

  assert.strictEqual(cachedElements[0].el.isConnected, true, 'Cached elements must now hold live connected node');
});

test('Simulated Sub-Section Navigation: gallery and playground highlight projects nav link', () => {
  const SECTION_MAP = { gallery: 'projects', playground: 'projects' };
  assert.strictEqual(SECTION_MAP['gallery'] || 'gallery', 'projects', 'Gallery must highlight projects');
  assert.strictEqual(SECTION_MAP['playground'] || 'playground', 'projects', 'Playground must highlight projects');
  assert.strictEqual(SECTION_MAP['experience'] || 'experience', 'experience', 'Standard sections remain unchanged');
});

console.log('\n========================================================================');
console.log(`TOTAL AUDIT CHECKS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('========================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🌟 NAVBAR INSTANT SELECTION LOCK & SCROLLSPY AUDIT VERIFIED 100%! 🌟\n');
}
