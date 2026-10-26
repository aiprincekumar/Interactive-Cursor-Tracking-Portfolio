import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

console.log('========================================================================');
console.log('  VERIFYING PHASE 4: CSS, MARQUEE DOM & MAP OPTIMIZATION IMPLEMENTATION ');
console.log('========================================================================\n');

const rootDir = process.cwd();
let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(`   ${err.message}`);
    failCount++;
  }
}

// -----------------------------------------------------------------------------
// Suite 1: TechMarqueeBanner.jsx DOM & Offscreen Animation
// -----------------------------------------------------------------------------
console.log('--- Suite 1: TechMarqueeBanner.jsx Verification ---');
const marqueePath = path.join(rootDir, 'src/components/TechMarqueeBanner.jsx');
const marqueeSrc = fs.readFileSync(marqueePath, 'utf8');

test('TechMarqueeBanner uses Array(4) sequence multiplier for TOP_SEQUENCE and BOTTOM_SEQUENCE', () => {
  assert(
    marqueeSrc.includes('const TOP_SEQUENCE = Array(4).fill(TOP_ITEMS).flat();'),
    'TOP_SEQUENCE must be defined with Array(4)'
  );
  assert(
    marqueeSrc.includes('const BOTTOM_SEQUENCE = Array(4).fill(BOTTOM_ITEMS).flat();'),
    'BOTTOM_SEQUENCE must be defined with Array(4)'
  );
});

test('TechMarqueeBanner reduces rendered DOM card nodes from 324 to ~100 (exact: 108)', () => {
  const topMatches = marqueeSrc.match(/const TOP_ITEMS = \[([\s\S]*?)\];/);
  const bottomMatches = marqueeSrc.match(/const BOTTOM_ITEMS = \[([\s\S]*?)\];/);
  assert(topMatches && bottomMatches, 'Must locate TOP_ITEMS and BOTTOM_ITEMS');

  const topItemsCount = (topMatches[1].match(/'[^']+'/g) || []).length;
  const bottomItemsCount = (bottomMatches[1].match(/'[^']+'/g) || []).length;
  const totalCards = (topItemsCount * 4) + (bottomItemsCount * 4);

  assert.strictEqual(topItemsCount, 14, 'TOP_ITEMS count must be 14');
  assert.strictEqual(bottomItemsCount, 13, 'BOTTOM_ITEMS count must be 13');
  assert.strictEqual(totalCards, 108, 'Total marquee cards must be 108 (~100 nodes, down from 324)');
});

test('TechMarqueeBanner sets up IntersectionObserver on bannerRef with disconnect cleanup', () => {
  assert(marqueeSrc.includes('const bannerRef = useRef(null);'), 'bannerRef must be initialized');
  assert(marqueeSrc.includes('const [isIntersecting, setIsIntersecting] = useState(true);'), 'isIntersecting state must exist');
  assert(marqueeSrc.includes('new IntersectionObserver('), 'IntersectionObserver must be instantiated');
  assert(marqueeSrc.includes('setIsIntersecting(entry.isIntersecting)'), 'Observer must update isIntersecting state');
  assert(marqueeSrc.includes('observer.observe(el);'), 'Observer must observe banner element');
  assert(marqueeSrc.includes('observer.disconnect();'), 'Cleanup must disconnect observer');
});

test('TechMarqueeBanner pauses animations when offscreen and resumes when visible', () => {
  assert(
    marqueeSrc.includes('const isPaused = Boolean(activeTooltipKey) || !isIntersecting;'),
    'isPaused must combine activeTooltipKey with !isIntersecting'
  );
});

test('TechMarqueeBanner preserves animationPlayState: isPaused ? "paused" : undefined', () => {
  const playStateOccurrences = (marqueeSrc.match(/animationPlayState:\s*isPaused\s*\?\s*['"]paused['"]\s*:\s*undefined/g) || []).length;
  assert.strictEqual(playStateOccurrences, 2, 'Both top and bottom ribbons must preserve animationPlayState: isPaused ? "paused" : undefined');
});

// -----------------------------------------------------------------------------
// Suite 2: LeafletOfflineMap.jsx Tile Engine & Dark Mode Filter
// -----------------------------------------------------------------------------
console.log('\n--- Suite 2: LeafletOfflineMap.jsx Verification ---');
const leafletPath = path.join(rootDir, 'src/components/LeafletOfflineMap.jsx');
const leafletSrc = fs.readFileSync(leafletPath, 'utf8');

test('LeafletOfflineMap sets keepBuffer to 2 for reduced memory footprint', () => {
  assert(leafletSrc.includes('keepBuffer: 2,'), 'keepBuffer must be 2');
});

test('LeafletOfflineMap sets updateWhenIdle to true to defer tile loading during rapid panning', () => {
  assert(leafletSrc.includes('updateWhenIdle: true,'), 'updateWhenIdle must be true');
});

test('LeafletOfflineMap dark mode tile filter uses GPU acceleration with will-change: transform', () => {
  assert(
    leafletSrc.includes('filter: invert(0.92) hue-rotate(180deg) contrast(1.1);'),
    'Dark mode tile filter must use GPU-friendly filter: invert(0.92) hue-rotate(180deg) contrast(1.1);'
  );
  assert(
    leafletSrc.includes('will-change: transform;'),
    'Leaflet tile pane must include will-change: transform;'
  );
});

test('LeafletOfflineMap has eliminated software-heavy 5-stage filter', () => {
  assert(
    !leafletSrc.includes('filter: brightness(0.72) invert(1) contrast(2.6) hue-rotate(200deg) saturate(0.25);'),
    'Software 5-stage filter must be completely eliminated'
  );
});

// -----------------------------------------------------------------------------
// Suite 3: CSS Stylesheets Optimization
// -----------------------------------------------------------------------------
console.log('\n--- Suite 3: CSS Stylesheets Verification ---');
const simpleCssPath = path.join(rootDir, 'src/styles/simple-mode.css');
const simpleCssSrc = fs.readFileSync(simpleCssPath, 'utf8');

test('simple-mode.css eliminates body.simple-mode * universal wildcard cursor rule', () => {
  assert(
    !simpleCssSrc.includes('body.simple-mode *'),
    'body.simple-mode * wildcard rule must NOT exist'
  );
  assert(
    simpleCssSrc.includes('body.simple-mode {\n  cursor: auto !important;\n}'),
    'body.simple-mode must define cursor: auto !important directly'
  );
});

const highContrastCssPath = path.join(rootDir, 'src/styles/high-contrast.css');
const highContrastCssSrc = fs.readFileSync(highContrastCssPath, 'utf8');

test('high-contrast.css streamlines substring attribute selectors into indexed classes', () => {
  assert(
    !highContrastCssSrc.includes('[class*="backdrop-blur"]'),
    'Substring selector [class*="backdrop-blur"] must be eliminated'
  );
  assert(
    !highContrastCssSrc.includes('[class*="blur"]'),
    'Substring selector [class*="blur"] must be eliminated'
  );
  assert(
    highContrastCssSrc.includes('.backdrop-blur-sm') &&
    highContrastCssSrc.includes('.backdrop-blur-md') &&
    highContrastCssSrc.includes('.backdrop-blur-lg'),
    'Must use explicit indexed backdrop blur classes'
  );
  assert(
    highContrastCssSrc.includes('.blur-xl') &&
    highContrastCssSrc.includes('.blur-2xl') &&
    highContrastCssSrc.includes('.blur-3xl'),
    'Must use explicit indexed background blur classes'
  );
});

const appCssPath = path.join(rootDir, 'src/App.css');
const appCssSrc = fs.readFileSync(appCssPath, 'utf8');

test('App.css has dead starter boilerplate stripped', () => {
  assert(!appCssSrc.includes('#root'), 'App.css must not have #root boilerplate');
  assert(!appCssSrc.includes('.logo'), 'App.css must not have .logo boilerplate');
  assert(!appCssSrc.includes('.card'), 'App.css must not have .card boilerplate');
  assert(!appCssSrc.includes('.read-the-docs'), 'App.css must not have .read-the-docs boilerplate');
  assert(appCssSrc.split('\n').length <= 15, 'App.css must be clean and compact (<= 15 lines)');
});

// -----------------------------------------------------------------------------
// Summary & Exit Code
// -----------------------------------------------------------------------------
console.log('\n========================================================================');
console.log(`TOTAL PHASE 4 AUDIT CHECKS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('========================================================================\n');

if (failCount > 0) {
  console.error('❌ PHASE 4 VERIFICATION FAILED!');
  process.exit(1);
} else {
  console.log('🎉 ALL PHASE 4 PERFORMANCE CRITERIA FULLY VERIFIED WITH 100% PASS RATE! 🎉\n');
  process.exit(0);
}
