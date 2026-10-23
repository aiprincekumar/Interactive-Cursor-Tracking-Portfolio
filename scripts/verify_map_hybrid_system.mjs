#!/usr/bin/env node
/**
 * scripts/verify_map_hybrid_system.mjs
 * 
 * Comprehensive QA Test Suite for Hybrid Offline/Live Map Architecture
 * 
 * Verifies:
 * 1. Presence and validity of vector SVG map assets (light & dark)
 * 2. Presence and validity of authentic real map snapshot images (medininagar-real-light & medininagar-real-dark .png/.webp > 15KB)
 * 3. Presence and valid export of OfflineMapSnapshot component
 * 4. ContactSection.jsx implementation:
 *    - Instant 0ms cached snapshot layer rendered
 *    - Manual on-demand live map toggle with offline default (no auto-upgrade timer)
 *    - navigator.onLine and online/offline event listeners with cleanup
 *    - Sleek offline / live status indicator pill
 *    - Smooth crossfade transition classes
 *    - Robust offline fallback and snapshot preservation
 * 5. Preload trigger in src/App.jsx or index.html
 * 
 * Exit codes:
 * 0 = All tests passed
 * 1 = One or more tests failed
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// ANSI formatting helpers
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
};

console.log('\n' + colors.bold + colors.cyan + '========================================================================' + colors.reset);
console.log(colors.bold + colors.cyan + '       HYBRID MAP SYSTEM VERIFICATION & QA AUDIT HARNESS                ' + colors.reset);
console.log(colors.dim + '   Validating Offline-First Architecture, Real Images, SVGs & Transitions' + colors.reset);
console.log(colors.bold + colors.cyan + '========================================================================\n' + colors.reset);

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function suite(title) {
  console.log(`\n${colors.bold}${colors.magenta}▶ ${title}${colors.reset}`);
  console.log(colors.dim + '─'.repeat(68) + colors.reset);
}

function test(description, testFn) {
  totalTests++;
  try {
    testFn();
    console.log(`  ${colors.green}✔ PASS${colors.reset}  ${description}`);
    passedTests++;
  } catch (error) {
    console.error(`  ${colors.red}✖ FAIL${colors.reset}  ${description}`);
    console.error(`         ${colors.yellow}↳ ${error.message}${colors.reset}`);
    failedTests++;
    failures.push({ description, message: error.message });
  }
}

// ============================================================================
// SUITE 1: MAP ASSETS VALIDATION (SVGS & AUTHENTIC REAL SNAPSHOT IMAGES)
// ============================================================================
suite('1. Map Assets Validation (public/assets/maps/)');

const lightSvgPath = path.join(rootDir, 'public/assets/maps/medininagar-light.svg');
const darkSvgPath = path.join(rootDir, 'public/assets/maps/medininagar-dark.svg');

// Helper to locate authentic real image assets (.png or .webp)
function findAuthenticImage(baseName) {
  const extensions = ['.png', '.webp'];
  for (const ext of extensions) {
    const candidate = path.join(rootDir, 'public/assets/maps', `${baseName}${ext}`);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

// Helper to validate authentic non-empty image (>15KB with binary magic header)
function verifyAuthenticImageFile(filePath, expectedBaseName) {
  assert.ok(
    filePath && fs.existsSync(filePath),
    `Missing authentic map snapshot image: public/assets/maps/${expectedBaseName}.png (or .webp)`
  );

  const stat = fs.statSync(filePath);
  const minBytes = 15 * 1024; // > 15KB (15,360 bytes)
  assert.ok(
    stat.size > minBytes,
    `Image ${path.basename(filePath)} is too small (${stat.size} bytes). Expected authentic image > 15KB (${minBytes} bytes).`
  );

  // Validate binary magic header for authentic PNG or WebP image
  const buffer = Buffer.alloc(16);
  const fd = fs.openSync(filePath, 'r');
  fs.readSync(fd, buffer, 0, 16, 0);
  fs.closeSync(fd);

  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
  const isWebp = buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
  const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;

  assert.ok(
    isPng || isWebp || isJpeg,
    `Image ${path.basename(filePath)} must have a valid binary image header (PNG magic bytes, WebP RIFF header, or JPEG)`
  );
}

test('medininagar-light.svg exists on filesystem', () => {
  assert.ok(fs.existsSync(lightSvgPath), `Missing file at: ${path.relative(rootDir, lightSvgPath)}`);
});

test('medininagar-light.svg is non-empty and contains valid SVG root markup', () => {
  assert.ok(fs.existsSync(lightSvgPath), 'File does not exist');
  const stat = fs.statSync(lightSvgPath);
  assert.ok(stat.size > 200, `medininagar-light.svg is too small (${stat.size} bytes, expected > 200 bytes)`);
  
  const content = fs.readFileSync(lightSvgPath, 'utf8');
  assert.ok(/<svg[^>]*>/i.test(content), 'Missing opening <svg> tag');
  assert.ok(/<\/svg>/i.test(content), 'Missing closing </svg> tag');
  assert.ok(/viewBox=/i.test(content) || (content.includes('width=') && content.includes('height=')), 'Missing viewBox or dimensions');
});

test('medininagar-dark.svg exists on filesystem', () => {
  assert.ok(fs.existsSync(darkSvgPath), `Missing file at: ${path.relative(rootDir, darkSvgPath)}`);
});

test('medininagar-dark.svg is non-empty and contains valid SVG root markup', () => {
  assert.ok(fs.existsSync(darkSvgPath), 'File does not exist');
  const stat = fs.statSync(darkSvgPath);
  assert.ok(stat.size > 200, `medininagar-dark.svg is too small (${stat.size} bytes, expected > 200 bytes)`);
  
  const content = fs.readFileSync(darkSvgPath, 'utf8');
  assert.ok(/<svg[^>]*>/i.test(content), 'Missing opening <svg> tag');
  assert.ok(/<\/svg>/i.test(content), 'Missing closing </svg> tag');
  assert.ok(/viewBox=/i.test(content) || (content.includes('width=') && content.includes('height=')), 'Missing viewBox or dimensions');
});

test('SVG map assets contain geographic paths, landmarks, or markers', () => {
  const lightContent = fs.existsSync(lightSvgPath) ? fs.readFileSync(lightSvgPath, 'utf8') : '';
  const darkContent = fs.existsSync(darkSvgPath) ? fs.readFileSync(darkSvgPath, 'utf8') : '';

  const hasVectorElements = (content) => {
    return (
      content.includes('<path') ||
      content.includes('<polygon') ||
      content.includes('<polyline') ||
      content.includes('<rect') ||
      content.includes('<circle')
    );
  };

  assert.ok(hasVectorElements(lightContent), 'medininagar-light.svg must contain vector shapes (<path>, <circle>, <rect>, etc.)');
  assert.ok(hasVectorElements(darkContent), 'medininagar-dark.svg must contain vector shapes (<path>, <circle>, <rect>, etc.)');

  const hasGeoReference = (content) => {
    const lower = content.toLowerCase();
    return lower.includes('medininagar') || lower.includes('daltonganj') || lower.includes('palamau') || lower.includes('koel') || lower.includes('marker') || lower.includes('hq');
  };

  assert.ok(
    hasGeoReference(lightContent) || hasGeoReference(darkContent),
    'SVG map assets should reference Medininagar/Daltonganj geographic context or markers'
  );
});

test('Light and Dark map SVGs have differentiated theme palettes', () => {
  assert.ok(fs.existsSync(lightSvgPath) && fs.existsSync(darkSvgPath), 'Both SVG files must exist to verify theme contrast');
  const lightContent = fs.readFileSync(lightSvgPath, 'utf8');
  const darkContent = fs.readFileSync(darkSvgPath, 'utf8');
  assert.notStrictEqual(lightContent, darkContent, 'Light and Dark SVG map assets must not be identical copies');
});

test('medininagar-real-light.png (or .webp) exists and is an authentic non-empty image (>15KB)', () => {
  const filePath = findAuthenticImage('medininagar-real-light');
  verifyAuthenticImageFile(filePath, 'medininagar-real-light');
});

test('medininagar-real-dark.png (or .webp) exists and is an authentic non-empty image (>15KB)', () => {
  const filePath = findAuthenticImage('medininagar-real-dark');
  verifyAuthenticImageFile(filePath, 'medininagar-real-dark');
});

// ============================================================================
// SUITE 2: OFFLINEMAPSNAPSHOT COMPONENT PRESENCE & EXPORT
// ============================================================================
suite('2. OfflineMapSnapshot Component (src/components/OfflineMapSnapshot.jsx)');

const offlineMapPath = path.join(rootDir, 'src/components/OfflineMapSnapshot.jsx');

test('OfflineMapSnapshot.jsx exists on filesystem', () => {
  assert.ok(fs.existsSync(offlineMapPath), `Missing file at: ${path.relative(rootDir, offlineMapPath)}`);
});

test('OfflineMapSnapshot.jsx exports a valid React component', () => {
  assert.ok(fs.existsSync(offlineMapPath), 'OfflineMapSnapshot.jsx does not exist');
  const content = fs.readFileSync(offlineMapPath, 'utf8');
  const stat = fs.statSync(offlineMapPath);
  assert.ok(stat.size > 100, `File is too small (${stat.size} bytes)`);

  const hasValidExport = (
    /export\s+default\s+function\s+OfflineMapSnapshot/i.test(content) ||
    /export\s+const\s+OfflineMapSnapshot/i.test(content) ||
    /export\s+default\s+OfflineMapSnapshot/i.test(content) ||
    content.includes('export default')
  );
  assert.ok(hasValidExport, 'OfflineMapSnapshot.jsx must provide a valid export');
});

test('OfflineMapSnapshot references map assets or renders map graphic', () => {
  assert.ok(fs.existsSync(offlineMapPath), 'OfflineMapSnapshot.jsx does not exist');
  const content = fs.readFileSync(offlineMapPath, 'utf8');

  const referencesAssets = (
    content.includes('medininagar-light') ||
    content.includes('medininagar-dark') ||
    content.includes('medininagar-real') ||
    content.includes('/assets/maps/') ||
    content.includes('<svg')
  );
  assert.ok(referencesAssets, 'OfflineMapSnapshot must reference medininagar map assets or render an SVG snapshot layer');
});

test('OfflineMapSnapshot supports dark/light mode responsiveness', () => {
  assert.ok(fs.existsSync(offlineMapPath), 'OfflineMapSnapshot.jsx does not exist');
  const content = fs.readFileSync(offlineMapPath, 'utf8');
  
  const hasDarkSupport = (
    content.includes('dark:') ||
    content.includes('isDark') ||
    content.includes('theme') ||
    content.includes('medininagar-dark')
  );
  assert.ok(hasDarkSupport, 'OfflineMapSnapshot must handle light/dark mode presentation');
});

test('OfflineMapSnapshot includes accessible markup and geographic location info', () => {
  assert.ok(fs.existsSync(offlineMapPath), 'OfflineMapSnapshot.jsx does not exist');
  const content = fs.readFileSync(offlineMapPath, 'utf8');

  const hasA11y = (
    content.includes('aria-label') ||
    content.includes('alt=') ||
    content.includes('role=') ||
    content.includes('<title')
  );
  assert.ok(hasA11y, 'OfflineMapSnapshot must provide accessible labels (aria-label, alt, etc.)');

  const hasLocationLabel = (
    content.toLowerCase().includes('medininagar') ||
    content.toLowerCase().includes('daltonganj') ||
    content.toLowerCase().includes('822101') ||
    content.toLowerCase().includes('palamau')
  );
  assert.ok(hasLocationLabel, 'OfflineMapSnapshot should include Medininagar/Daltonganj location info');
});

test('OfflineMapSnapshot provides resilient 0ms offline fallback metadata', () => {
  assert.ok(fs.existsSync(offlineMapPath), 'OfflineMapSnapshot.jsx does not exist');
  const content = fs.readFileSync(offlineMapPath, 'utf8');

  const hasLocalData = (
    content.includes('LANDMARKS') ||
    content.includes('Medininagar') ||
    content.includes('Daltonganj')
  );
  assert.ok(hasLocalData, 'OfflineMapSnapshot must bundle local landmark / geographic metadata for instant offline fallback display');
});

// ============================================================================
// SUITE 3: CONTACTSECTION.JSX HYBRID IMPLEMENTATION
// ============================================================================
suite('3. ContactSection.jsx Hybrid Implementation Contracts');

const contactSectionPath = path.join(rootDir, 'src/components/ContactSection.jsx');

test('ContactSection.jsx exists and is readable', () => {
  assert.ok(fs.existsSync(contactSectionPath), 'src/components/ContactSection.jsx must exist');
});

test('ContactSection renders an instant 0ms cached snapshot layer', () => {
  const content = fs.readFileSync(contactSectionPath, 'utf8');

  const importsOrRendersSnapshot = (
    content.includes('LeafletOfflineMap') ||
    content.includes('OfflineMapSnapshot') ||
    content.includes('medininagar-light') ||
    content.includes('medininagar-dark')
  );
  assert.ok(
    importsOrRendersSnapshot,
    'ContactSection must import or integrate LeafletOfflineMap / OfflineMapSnapshot / vector map snapshot layer'
  );

  const rendersSnapshotComponent = (
    content.includes('<LeafletOfflineMap') ||
    content.includes('<OfflineMapSnapshot') ||
    content.includes('LeafletOfflineMap') ||
    content.includes('OfflineMapSnapshot')
  );
  assert.ok(
    rendersSnapshotComponent,
    'ContactSection must render the <LeafletOfflineMap /> or <OfflineMapSnapshot /> component for immediate 0ms display'
  );
});

test('ContactSection implements manual on-demand toggle with offline default (no auto-upgrade timer)', () => {
  const content = fs.readFileSync(contactSectionPath, 'utf8');

  // Verify offline is default mapMode
  const hasOfflineDefault = (
    /useState\(\s*['"]osm['"]\s*\)/.test(content) ||
    /mapMode === 'osm'/.test(content)
  );
  assert.ok(
    hasOfflineDefault,
    'ContactSection must default mapMode to offline OSM'
  );

  // Verify manual toggle handler exists and no auto-upgrade timer for map
  assert.ok(
    content.includes('handleToggleMapMode'),
    'ContactSection must provide handleToggleMapMode for manual on-demand live map toggling'
  );
  assert.ok(
    !content.includes('AUTO_UPGRADE_DELAY'),
    'ContactSection must not contain automatic AUTO_UPGRADE_DELAY timer (manual on-demand toggle approved contract)'
  );

  // Verify state tracking for live/upgraded map
  const tracksUpgradeState = (
    content.includes('mapMode') &&
    content.includes('iframeLoaded') &&
    content.includes('showIframe')
  );
  assert.ok(
    tracksUpgradeState,
    'ContactSection must manage manual toggle state between offline OSM and interactive live iframe'
  );
});

test('ContactSection tracks navigator.onLine & registers online/offline window listeners with cleanup', () => {
  const content = fs.readFileSync(contactSectionPath, 'utf8');

  // Verify navigator.onLine check
  assert.ok(
    content.includes('navigator.onLine') || content.includes('window.navigator.onLine'),
    'ContactSection must inspect navigator.onLine to detect network connectivity'
  );

  // Verify online and offline window event listeners
  const hasOnlineListener = /addEventListener\(\s*['"]online['"]/i.test(content);
  const hasOfflineListener = /addEventListener\(\s*['"]offline['"]/i.test(content);

  assert.ok(hasOnlineListener, "ContactSection must register window event listener for 'online'");
  assert.ok(hasOfflineListener, "ContactSection must register window event listener for 'offline'");

  // Verify cleanup in useEffect return
  const hasRemoveListener = (
    /removeEventListener\(\s*['"]online['"]/i.test(content) &&
    /removeEventListener\(\s*['"]offline['"]/i.test(content)
  );
  assert.ok(
    hasRemoveListener,
    "ContactSection must clean up 'online' and 'offline' listeners on unmount (removeEventListener)"
  );
});

test('ContactSection displays a sleek offline / live status indicator pill', () => {
  const content = fs.readFileSync(contactSectionPath, 'utf8');

  // Verify presence of indicator text or labels
  const hasStatusPill = (
    (content.includes('Live') || content.includes('Interactive') || content.includes('Online')) &&
    (content.includes('Offline') || content.includes('Snapshot') || content.includes('Cached'))
  );
  assert.ok(
    hasStatusPill,
    'ContactSection must render a status pill communicating Live vs Offline / Snapshot state'
  );

  // Verify presence of status visual styling (e.g. pulse dot, badge, emerald/amber indicators)
  const hasVisualPillStyling = (
    content.includes('rounded-full') ||
    content.includes('animate-pulse') ||
    content.includes('bg-emerald') ||
    content.includes('bg-green') ||
    content.includes('bg-amber')
  );
  assert.ok(
    hasVisualPillStyling,
    'Status indicator pill must include sleek visual styling (rounded pill, pulse indicator, or accent color)'
  );
});

test('ContactSection uses smooth crossfade transition classes between snapshot and live iframe', () => {
  const content = fs.readFileSync(contactSectionPath, 'utf8');

  // Crossfade requires opacity transitions
  const hasOpacityTransition = (
    content.includes('transition-opacity') ||
    (content.includes('transition') && content.includes('opacity'))
  );
  assert.ok(
    hasOpacityTransition,
    'ContactSection must apply transition-opacity for smooth crossfade between snapshot and iframe'
  );

  // Check for duration and opacity toggle classes
  const hasTransitionDuration = /duration-(300|500|700|1000)/.test(content);
  assert.ok(
    hasTransitionDuration,
    'ContactSection crossfade must specify transition duration (e.g., duration-500 or duration-700)'
  );

  const hasOpacityToggles = (
    content.includes('opacity-0') &&
    content.includes('opacity-100')
  );
  assert.ok(
    hasOpacityToggles,
    'ContactSection crossfade must toggle between opacity-0 and opacity-100'
  );
});

test('ContactSection provides robust fallback handling when offline or connection is disrupted', () => {
  const content = fs.readFileSync(contactSectionPath, 'utf8');

  const hasFallbackHandling = (
    (content.includes('Offline') || content.includes('Snapshot')) &&
    (content.includes('!isOnline') || content.includes('isOnline ?') || content.includes('handleOffline') || content.includes('handleRetryLive'))
  );
  assert.ok(
    hasFallbackHandling,
    'ContactSection must retain snapshot presentation and provide clear fallback feedback when offline'
  );
});

// ============================================================================
// SUITE 4: PRELOAD TRIGGER CONTRACT
// ============================================================================
suite('4. Preload Trigger Contract (src/App.jsx or index.html)');

const indexHtmlPath = path.join(rootDir, 'index.html');
const appJsxPath = path.join(rootDir, 'src/App.jsx');

test('Map preload trigger is declared in index.html or src/App.jsx', () => {
  const indexContent = fs.existsSync(indexHtmlPath) ? fs.readFileSync(indexHtmlPath, 'utf8') : '';
  const appContent = fs.existsSync(appJsxPath) ? fs.readFileSync(appJsxPath, 'utf8') : '';

  // Check in index.html: <link rel="preload" as="image" href="...maps..." /> or prefetch / preconnect
  const hasPreloadLink = (content) => {
    const links = content.match(/<link\b[^>]*>/gi) || [];
    return links.some((tag) => {
      const isPreloadOrPrefetch = /rel=["'](?:preload|prefetch|preconnect)["']/i.test(tag);
      const isMapRelated = /(?:maps|medininagar|google\.com\/maps)/i.test(tag);
      return isPreloadOrPrefetch && isMapRelated;
    });
  };

  const indexHasPreload = hasPreloadLink(indexContent);

  // Check in App.jsx: preloading map images via new Image() or preload script/link
  const appHasPreload = (
    appContent.includes('/assets/maps/') ||
    appContent.includes('medininagar-light') ||
    appContent.includes('medininagar-dark') ||
    appContent.includes('medininagar-real') ||
    (appContent.includes('new Image(') && /maps|medininagar/i.test(appContent)) ||
    (appContent.includes('preload') && /maps|medininagar/i.test(appContent))
  );

  assert.ok(
    indexHasPreload || appHasPreload,
    'Map preload trigger must be configured in index.html (<link rel="preload">) or in src/App.jsx'
  );
});

// ============================================================================
// SUITE 5: LEAFLET OFFLINE MAP & ZOOM CONTROLS CONTRACTS
// ============================================================================
suite('5. Leaflet Offline Map & Zoom Controls Contracts');

const leafletComponentPath = path.join(rootDir, 'src/components/LeafletOfflineMap.jsx');

test('LeafletOfflineMap configures minZoom: 12, maxZoom: 15, minNativeZoom: 12, and maxNativeZoom: 15', () => {
  const content = fs.readFileSync(leafletComponentPath, 'utf8');
  assert.ok(content.includes('minZoom: 12'), 'minZoom must be 12');
  assert.ok(content.includes('maxZoom: 15'), 'maxZoom must be 15');
  assert.ok(content.includes('minNativeZoom: 12'), 'minNativeZoom must be 12');
  assert.ok(content.includes('maxNativeZoom: 15'), 'maxNativeZoom must be 15');
});

test('LeafletOfflineMap maintains clean solid container styling without static background image', () => {
  const content = fs.readFileSync(leafletComponentPath, 'utf8');
  assert.ok(!content.includes('medininagar-real-light.png'), 'medininagar-real-light.png should not be in LeafletOfflineMap styles');
  assert.ok(!content.includes('medininagar-real-dark.png'), 'medininagar-real-dark.png should not be in LeafletOfflineMap styles');
  assert.ok(content.includes('background-color: #f2efe9'), 'Solid light background color missing');
  assert.ok(content.includes('background-color: #12161f'), 'Solid dark background color missing');
});

test('LeafletOfflineMap supports resetTrigger prop, flyTo recentering, and animate: true', () => {
  const content = fs.readFileSync(leafletComponentPath, 'utf8');
  assert.ok(content.includes('resetTrigger'), 'Missing resetTrigger prop');
  assert.ok(content.includes('flyTo'), 'Missing flyTo recentering call');
  assert.ok(content.includes('animate: true'), 'Missing animate: true for zoom changes');
});

test('ContactSection.jsx enforces zoom controls floor 12 and ceiling 15 for OSM mode', () => {
  const content = fs.readFileSync(contactSectionPath, 'utf8');
  assert.ok(content.includes("disabled={mapMode === 'osm' ? zoom >= 15 : zoom >= 18}"), 'Zoom in must ceiling at 15 for OSM');
  assert.ok(content.includes("disabled={mapMode === 'osm' ? zoom <= 12 : zoom <= 11}"), 'Zoom out must floor at 12 for OSM');
  assert.ok(content.includes('setResetTrigger') && content.includes('setZoom(13)'), 'handleResetZoom must increment resetTrigger and set zoom to 13');
});

// ============================================================================
// SUMMARY & EXIT CODE
// ============================================================================
console.log('\n' + colors.bold + colors.cyan + '========================================================================' + colors.reset);
console.log(colors.bold + '                         TEST RESULTS SUMMARY                           ' + colors.reset);
console.log(colors.bold + colors.cyan + '========================================================================' + colors.reset);
console.log(`  Total Checks:   ${colors.bold}${totalTests}${colors.reset}`);
console.log(`  Passed Checks:  ${colors.bold}${colors.green}${passedTests}${colors.reset}`);
console.log(`  Failed Checks:  ${colors.bold}${failedTests > 0 ? colors.red : colors.green}${failedTests}${colors.reset}`);

if (failedTests > 0) {
  console.log('\n' + colors.bold + colors.red + '❌ FAILURES DETECTED:' + colors.reset);
  failures.forEach((f, idx) => {
    console.log(`  ${idx + 1}. ${colors.bold}${f.description}${colors.reset}`);
    console.log(`     ${colors.yellow}↳ ${f.message}${colors.reset}`);
  });
  console.log('\n' + colors.bgRed + colors.bold + ' STATUS: FAILED ' + colors.reset + ' - Please fulfill all contracts above.\n');
  process.exit(1);
} else {
  console.log('\n' + colors.bgGreen + colors.bold + ' STATUS: ALL PASSED ' + colors.reset + ' - Hybrid map system contracts verified!\n');
  process.exit(0);
}
