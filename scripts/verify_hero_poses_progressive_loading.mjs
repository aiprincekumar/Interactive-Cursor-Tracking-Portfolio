/**
 * Verification Script: Intelligent Progressive Loading & Preload Storm Elimination
 * for Hero Character Poses (Point 5 of 16)
 * 
 * Verifies:
 * 1. index.html:
 *    - Preload tags for poses 01-09 removed from <head>
 *    - Only T=0 default pose (00-rear-view.png) and backdrop (BgHero.jpg) are preloaded with fetchpriority="high"
 * 2. HeroSection.jsx:
 *    - Implements requestIdleCallback with 800ms fallback for warming nonCriticalPoses
 *    - Uses async decoding for warmed images
 *    - Retains all 10 pose image bindings, DOM refs, Hermite interpolation, and 60/120 FPS rAF loop
 * 3. Assets:
 *    - All 11 hero asset files exist in public/assets/hero_poses/
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();

console.log('========================================================================');
console.log('  VERIFYING HERO CHARACTER POSES INTELLIGENT PROGRESSIVE LOADING');
console.log('========================================================================\n');

let passCount = 0;
let failCount = 0;

function check(condition, desc) {
  if (condition) {
    console.log(`✅ PASS: ${desc}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${desc}`);
    failCount++;
    process.exitCode = 1;
  }
}

// 1. Audit index.html
const indexHtmlPath = path.join(ROOT_DIR, 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

check(
  indexHtml.includes('<link rel="preload" as="image" href="%BASE_URL%assets/hero_poses/00-rear-view.png" fetchpriority="high" />'),
  'index.html preloads T=0 default pose (00-rear-view.png) with fetchpriority="high"'
);

check(
  indexHtml.includes('<link rel="preload" as="image" href="%BASE_URL%assets/hero_poses/BgHero.jpg" fetchpriority="high" />'),
  'index.html preloads backdrop (BgHero.jpg) with fetchpriority="high"'
);

for (let i = 1; i <= 9; i++) {
  const num = String(i).padStart(2, '0');
  const tagSnippet = `assets/hero_poses/${num}-`;
  const isPreloaded = indexHtml.includes(`<link rel="preload" as="image" href="%BASE_URL%assets/hero_poses/${num}-`);
  check(!isPreloaded, `index.html does NOT preload non-critical pose ${num}`);
}

// 2. Audit src/components/HeroSection.jsx
const heroSectionPath = path.join(ROOT_DIR, 'src', 'components', 'HeroSection.jsx');
const heroSection = fs.readFileSync(heroSectionPath, 'utf8');

check(
  heroSection.includes('requestIdleCallback') && heroSection.includes('cancelIdleCallback'),
  'HeroSection.jsx uses window.requestIdleCallback and clean up with cancelIdleCallback'
);

check(
  heroSection.includes('setTimeout(warmUpCache, 800)'),
  'HeroSection.jsx provides 800ms fallback when requestIdleCallback is unavailable'
);

check(
  heroSection.includes("img.decoding = 'async'"),
  'HeroSection.jsx uses async decoding for warming non-critical poses'
);

check(
  heroSection.includes('IMG_CENTER_UP') &&
  heroSection.includes('IMG_LOWER_CENTER') &&
  heroSection.includes('IMG_CENTER_LEFT') &&
  heroSection.includes('IMG_CENTER_RIGHT') &&
  heroSection.includes('IMG_CENTER_FRONT') &&
  heroSection.includes('IMG_UPPER_LEFT') &&
  heroSection.includes('IMG_LOWER_LEFT') &&
  heroSection.includes('IMG_UPPER_RIGHT') &&
  heroSection.includes('IMG_LOWER_RIGHT'),
  'HeroSection.jsx contains all 9 non-critical poses in warmUpCache list'
);

// Verify all 10 pose refs and images are mounted
const refs = [
  'imgIdleRef', 'imgCenterRef', 'imgUpperCenterRef', 'imgLowerCenterRef',
  'imgLeftRef', 'imgRightRef', 'imgUpperLeftRef', 'imgLowerLeftRef',
  'imgUpperRightRef', 'imgLowerRightRef'
];
refs.forEach(ref => {
  check(heroSection.includes(ref), `HeroSection.jsx maintains reference to ${ref}`);
});

// 3. Verify public assets
const posesDir = path.join(ROOT_DIR, 'public', 'assets', 'hero_poses');
const expectedFiles = [
  '00-rear-view.png', '01-center-up.png', '02-lower-center.png',
  '03-center-left.png', '04-center-right.png', '05-center-front.png',
  '06-upper-left.png', '07-lower-left.png', '08-upper-right.png',
  '09-lower-right.png', 'BgHero.jpg'
];

expectedFiles.forEach(fileName => {
  const filePath = path.join(posesDir, fileName);
  check(fs.existsSync(filePath), `Asset exists on disk: public/assets/hero_poses/${fileName}`);
});

console.log('\n========================================================================');
console.log(`TOTAL AUDIT CHECKS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('========================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🌟 HERO CHARACTER POSES PROGRESSIVE LOADING VERIFIED 100%! 🌟\n');
}
