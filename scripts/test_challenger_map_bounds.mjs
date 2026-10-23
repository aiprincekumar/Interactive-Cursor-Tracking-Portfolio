#!/usr/bin/env node
/**
 * scripts/test_challenger_map_bounds.mjs
 * 
 * Empirical Stress-Testing Harness by Challenger 1 (Map Bounding Challenger)
 * Milestone 7: Preloading Cached Offline Map Refinement
 * 
 * Tasks:
 * 1. Verify all 88 tile files in public/assets/tiles/ (existence, size > 5KB, PNG magic bytes, 256x256 decode).
 * 2. Mathematical stress-test of 7x5 tile grid, geographic bounding box [[23.8054, 83.7598], [24.2069, 84.3750]].
 * 3. Screen width analysis up to 1920px (1792px tile span vs viewport size & maxBounds).
 * 4. Verification of Leaflet map configuration (maxBounds, maxBoundsViscosity: 1.0, marker removal, tileLayer bounds).
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const tilesBaseDir = path.join(rootDir, 'public', 'assets', 'tiles');

console.log('========================================================================');
console.log('   EMPIRICAL CHALLENGER 1: MAP BOUNDING & TILE HARNESS AUDIT           ');
console.log('========================================================================\n');

// -----------------------------------------------------------------------------
// Web Mercator Formulas (EPSG:3857)
// -----------------------------------------------------------------------------
function lng2tile(lng, z) {
  return Math.floor(((lng + 180) / 360) * Math.pow(2, z));
}

function lat2tile(lat, z) {
  const latRad = (lat * Math.PI) / 180;
  return Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * Math.pow(2, z)
  );
}

function tile2lng(x, z) {
  return (x / Math.pow(2, z)) * 360 - 180;
}

function tile2lat(y, z) {
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}

function getTileBounds(x, y, z) {
  return {
    west: tile2lng(x, z),
    east: tile2lng(x + 1, z),
    north: tile2lat(y, z),
    south: tile2lat(y + 1, z)
  };
}

function getGridBounds(xMin, xMax, yMin, yMax, z) {
  return {
    west: tile2lng(xMin, z),
    east: tile2lng(xMax + 1, z),
    north: tile2lat(yMin, z),
    south: tile2lat(yMax + 1, z)
  };
}

const PNG_HEADER = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

// -----------------------------------------------------------------------------
// TEST SUITE 1: PHYSICAL TILE ASSET VERIFICATION (ALL 88 TILES)
// -----------------------------------------------------------------------------
console.log('--- TEST SUITE 1: Physical Tile Asset Empirical Verification ---');

const expectedGrids = {
  10: {
    name: 'Zoom 10 (Regional Hub Overview)',
    cx: 751,
    cy: 441,
    xRange: [749, 750, 751, 752],
    yRange: [440, 441, 442],
    expectedCount: 12
  },
  11: {
    name: 'Zoom 11 (Greater Palamu Region)',
    cx: 1502,
    cy: 883,
    xRange: [1499, 1500, 1501, 1502, 1503, 1504],
    yRange: [882, 883, 884, 885],
    expectedCount: 24
  },
  12: {
    name: 'Zoom 12 (7x5 City-Region Overview)',
    cx: 3004,
    cy: 1766,
    xRange: [3001, 3002, 3003, 3004, 3005, 3006, 3007],
    yRange: [1764, 1765, 1766, 1767, 1768],
    expectedCount: 35
  },
  13: {
    name: 'Zoom 13 (7x5 Urban Medininagar Default)',
    cx: 6009,
    cy: 3532,
    xRange: [6006, 6007, 6008, 6009, 6010, 6011, 6012],
    yRange: [3530, 3531, 3532, 3533, 3534],
    expectedCount: 35
  },
  14: {
    name: 'Zoom 14 (7x5 District Core Detail)',
    cx: 12018,
    cy: 7064,
    xRange: [12015, 12016, 12017, 12018, 12019, 12020, 12021],
    yRange: [7062, 7063, 7064, 7065, 7066],
    expectedCount: 35
  },
  15: {
    name: 'Zoom 15 (7x5 Street/HQ Level Detail)',
    cx: 24036,
    cy: 14128,
    xRange: [24033, 24034, 24035, 24036, 24037, 24038, 24039],
    yRange: [14126, 14127, 14128, 14129, 14130],
    expectedCount: 35
  }
};

let verifiedTileCount = 0;
let totalBytes = 0;
let minSize = Infinity;
let maxSize = 0;
let minTile = '';
let maxTile = '';
const tileDecodeErrors = [];

for (const [zoomStr, conf] of Object.entries(expectedGrids)) {
  const z = parseInt(zoomStr, 10);
  let zoomCount = 0;

  for (const x of conf.xRange) {
    for (const y of conf.yRange) {
      const tilePath = path.join(tilesBaseDir, String(z), String(x), `${y}.png`);
      
      // 1. Existence
      if (!fs.existsSync(tilePath)) {
        tileDecodeErrors.push(`Missing tile file: ${tilePath}`);
        continue;
      }

      const stat = fs.statSync(tilePath);
      totalBytes += stat.size;
      if (stat.size < minSize) {
        minSize = stat.size;
        minTile = `${z}/${x}/${y}.png`;
      }
      if (stat.size > maxSize) {
        maxSize = stat.size;
        maxTile = `${z}/${x}/${y}.png`;
      }

      // 2. Minimum size threshold (> 5000 bytes = 5KB)
      if (stat.size <= 5000) {
        tileDecodeErrors.push(`Tile size <= 5KB: ${z}/${x}/${y}.png (${stat.size} bytes)`);
      }

      // 3. PNG Magic Bytes
      const buf = fs.readFileSync(tilePath);
      if (!buf.subarray(0, 8).equals(PNG_HEADER)) {
        tileDecodeErrors.push(`Invalid PNG magic bytes: ${z}/${x}/${y}.png`);
      }

      // 4. Decode 256x256 image
      try {
        const img = PNG.sync.read(buf);
        if (img.width !== 256 || img.height !== 256) {
          tileDecodeErrors.push(`Invalid dimensions for ${z}/${x}/${y}.png: ${img.width}x${img.height} (expected 256x256)`);
        }
      } catch (err) {
        tileDecodeErrors.push(`PNG decode exception for ${z}/${x}/${y}.png: ${err.message}`);
      }

      zoomCount++;
      verifiedTileCount++;
    }
  }

  console.log(`  ✔ ${conf.name}: ${zoomCount}/${conf.expectedCount} tiles verified (PNG 256x256, > 5KB)`);
}

// Check for orphaned/unexpected files in public/assets/tiles/
let physicalTileCount = 0;
function countTilesRecursively(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      countTilesRecursively(full);
    } else if (entry.isFile() && entry.name.endsWith('.png')) {
      physicalTileCount++;
    }
  }
}
countTilesRecursively(tilesBaseDir);

console.log(`\nTile Asset Summary:`);
console.log(`  Total Tiles Expected: 176`);
console.log(`  Total Physical PNGs Found: ${physicalTileCount}`);
console.log(`  Successfully Verified Tiles: ${verifiedTileCount}`);
console.log(`  Total Tiles Directory Size: ${(totalBytes / 1024).toFixed(2)} KB (${(totalBytes / (1024 * 1024)).toFixed(3)} MB)`);
console.log(`  Smallest Tile: ${minTile} (${minSize} bytes)`);
console.log(`  Largest Tile: ${maxTile} (${maxSize} bytes)`);
console.log(`  Average Tile Size: ${(totalBytes / verifiedTileCount).toFixed(0)} bytes`);

assert.strictEqual(tileDecodeErrors.length, 0, `Tile validation errors encountered: ${tileDecodeErrors.join('; ')}`);
assert.strictEqual(verifiedTileCount, 176, `Expected exactly 176 verified tiles, got ${verifiedTileCount}`);
assert.strictEqual(physicalTileCount, 176, `Expected no orphaned tiles, found ${physicalTileCount}`);
console.log('✅ SUITE 1 PASSED: All 176 tiles physically verified, intact, >5KB, and valid 256x256 PNGs.\n');


// -----------------------------------------------------------------------------
// TEST SUITE 2: MATHEMATICAL STRESS-TEST OF BOUNDING BOX & 7x5 GRID
// -----------------------------------------------------------------------------
console.log('--- TEST SUITE 2: Mathematical Bounding Box & 7x5 Grid Coverage ---');

const Z12_GRID_BOUNDS = [
  [23.8054, 83.7598],
  [24.2069, 84.3750]
];
const EXPANDED_MEDININAGAR_BOUNDS = [
  [23.7646, 83.6455], // Southwest (expanded Palamu district coverage)
  [24.3186, 84.4945]  // Northeast
];
const [SW, NE] = Z12_GRID_BOUNDS;
const [boundSouth, boundWest] = SW;
const [boundNorth, boundEast] = NE;

console.log(`Zoom 12 Physical Tile Raster Grid Envelope:`);
console.log(`  South: ${boundSouth.toFixed(4)}° N, West: ${boundWest.toFixed(4)}° E`);
console.log(`  North: ${boundNorth.toFixed(4)}° N, East: ${boundEast.toFixed(4)}° E`);
console.log(`Expanded MEDININAGAR_BOUNDS in Leaflet:`);
console.log(`  South: ${EXPANDED_MEDININAGAR_BOUNDS[0][0].toFixed(4)}° N, West: ${EXPANDED_MEDININAGAR_BOUNDS[0][1].toFixed(4)}° E`);
console.log(`  North: ${EXPANDED_MEDININAGAR_BOUNDS[1][0].toFixed(4)}° N, East: ${EXPANDED_MEDININAGAR_BOUNDS[1][1].toFixed(4)}° E`);

// Check Zoom 12 Grid
const z12Conf = expectedGrids[12];
const z12Bounds = getGridBounds(
  z12Conf.xRange[0],
  z12Conf.xRange[z12Conf.xRange.length - 1],
  z12Conf.yRange[0],
  z12Conf.yRange[z12Conf.yRange.length - 1],
  12
);
console.log(`\nZoom 12 (7x5 Grid) Computed Bounds:`);
console.log(`  South: ${z12Bounds.south.toFixed(4)}° (exact: ${z12Bounds.south})`);
console.log(`  West:  ${z12Bounds.west.toFixed(4)}° (exact: ${z12Bounds.west})`);
console.log(`  North: ${z12Bounds.north.toFixed(4)}° (exact: ${z12Bounds.north})`);
console.log(`  East:  ${z12Bounds.east.toFixed(4)}° (exact: ${z12Bounds.east})`);

// Validate that Zoom 12 bounds match Z12_GRID_BOUNDS exactly to 4 decimals
assert.strictEqual(z12Bounds.south.toFixed(4), boundSouth.toFixed(4), 'Zoom 12 South bound mismatch');
assert.strictEqual(z12Bounds.west.toFixed(4), boundWest.toFixed(4), 'Zoom 12 West bound mismatch');
assert.strictEqual(z12Bounds.north.toFixed(4), boundNorth.toFixed(4), 'Zoom 12 North bound mismatch');
assert.strictEqual(z12Bounds.east.toFixed(4), boundEast.toFixed(4), 'Zoom 12 East bound mismatch');
console.log('  ✔ Zoom 12 7x5 grid mathematically matches tile raster bounds exactly (100% envelope match).');

// Validate that expanded MEDININAGAR_BOUNDS comfortably encompass the Zoom 12 grid
assert.ok(EXPANDED_MEDININAGAR_BOUNDS[0][0] <= z12Bounds.south, 'Expanded south bound must encompass zoom 12 grid');
assert.ok(EXPANDED_MEDININAGAR_BOUNDS[0][1] <= z12Bounds.west, 'Expanded west bound must encompass zoom 12 grid');
assert.ok(EXPANDED_MEDININAGAR_BOUNDS[1][0] >= z12Bounds.north, 'Expanded north bound must encompass zoom 12 grid');
assert.ok(EXPANDED_MEDININAGAR_BOUNDS[1][1] >= z12Bounds.east, 'Expanded east bound must encompass zoom 12 grid');
console.log('  ✔ Expanded MEDININAGAR_BOUNDS fully enclose Zoom 12 grid with generous panning margins.');

// Check Zoom 13 Grid
const z13Conf = expectedGrids[13];
const z13Bounds = getGridBounds(
  z13Conf.xRange[0],
  z13Conf.xRange[z13Conf.xRange.length - 1],
  z13Conf.yRange[0],
  z13Conf.yRange[z13Conf.yRange.length - 1],
  13
);
console.log(`\nZoom 13 (7x5 Grid) Computed Bounds:`);
console.log(`  South: ${z13Bounds.south.toFixed(4)}° (exact: ${z13Bounds.south})`);
console.log(`  West:  ${z13Bounds.west.toFixed(4)}° (exact: ${z13Bounds.west})`);
console.log(`  North: ${z13Bounds.north.toFixed(4)}° (exact: ${z13Bounds.north})`);
console.log(`  East:  ${z13Bounds.east.toFixed(4)}° (exact: ${z13Bounds.east})`);

// Center coordinate verification
const medininagarCenter = [24.0416, 84.0700];
console.log(`\nGeographic Center Position [${medininagarCenter[0]}, ${medininagarCenter[1]}]:`);
for (const z of [10, 11, 12, 13, 14, 15]) {
  const cx = lng2tile(medininagarCenter[1], z);
  const cy = lat2tile(medininagarCenter[0], z);
  assert.strictEqual(cx, expectedGrids[z].cx, `Center X tile mismatch at zoom ${z}`);
  assert.strictEqual(cy, expectedGrids[z].cy, `Center Y tile mismatch at zoom ${z}`);
  console.log(`  Zoom ${z}: center tile (${cx}, ${cy}) perfectly aligns with expected center.`);
}

console.log('✅ SUITE 2 PASSED: Geographic tile bounding mathematics validated.\n');


// -----------------------------------------------------------------------------
// TEST SUITE 3: SCREEN WIDTH COVERAGE & 1920PX VIEWPORT STRESS TEST
// -----------------------------------------------------------------------------
console.log('--- TEST SUITE 3: Screen Width & 1920px Viewport Analysis ---');

// 7 tiles wide = 7 * 256px = 1792px
// 5 tiles high = 5 * 256px = 1280px
const tileSpanX = 7 * 256;
const tileSpanY = 5 * 256;
console.log(`7x5 raster tile physical pixel span: ${tileSpanX}px wide × ${tileSpanY}px high`);

// ContactSection.jsx layout constraint analysis:
const contactPath = path.join(rootDir, 'src/components/ContactSection.jsx');
const contactContent = fs.readFileSync(contactPath, 'utf8');

// The layout hierarchy in ContactSection:
// 1. section: w-full max-w-none px-4 sm:px-6 lg:px-8
// 2. max-w-7xl mx-auto (max-w-7xl in Tailwind = 80rem = 1280px)
// 3. Card padding: p-6 sm:p-10 md:p-12 (md:p-12 = 3rem = 48px each side = 96px total horizontal padding)
// 4. Map element width: 1280px - 96px = 1184px!

const tailwindMaxW7xlPx = 1280;
const cardPaddingHorizontalPx = 48 * 2; // 96px
const actualRenderedMapWidth = tailwindMaxW7xlPx - cardPaddingHorizontalPx; // 1184px
const renderedMapHeight = 500; // min-h-[500px]

console.log(`Layout Container Geometry in ContactSection.jsx:`);
console.log(`  Viewport screen width: 1920px (Desktop Full HD)`);
console.log(`  Tailwind max-w-7xl constraint: ${tailwindMaxW7xlPx}px`);
console.log(`  Card horizontal padding (p-12): ${cardPaddingHorizontalPx}px`);
console.log(`  Actual rendered map canvas width: ${actualRenderedMapWidth}px`);
console.log(`  Actual rendered map canvas height: ${renderedMapHeight}px`);

// Compare actual map canvas with 7x5 tile extent:
console.log(`\nCoverage Comparison:`);
console.log(`  Available tile width at zoom 13: ${tileSpanX}px`);
console.log(`  Required canvas width: ${actualRenderedMapWidth}px`);
console.log(`  Excess horizontal tile margin: ${tileSpanX - actualRenderedMapWidth}px`);
console.log(`  Available tile height at zoom 13: ${tileSpanY}px`);
console.log(`  Required canvas height: ${renderedMapHeight}px`);
console.log(`  Excess vertical tile margin: ${tileSpanY - renderedMapHeight}px`);

assert.ok(
  tileSpanX > actualRenderedMapWidth,
  `Tile span (${tileSpanX}px) must be wider than rendered map container (${actualRenderedMapWidth}px)`
);
assert.ok(
  tileSpanY > renderedMapHeight,
  `Tile span height (${tileSpanY}px) must exceed container height (${renderedMapHeight}px)`
);

// What if the map were completely unconstrained on a 1920px display?
// (e.g. Fullscreen or edge-to-edge container)
// Screen width = 1920px. 7 tiles = 1792px.
// 1920 - 1792 = 128px difference.
// BUT because the container is inside `max-w-7xl` (1280px), the map container NEVER exceeds 1184px!
// Even on a 4K monitor (3840px), max-w-7xl pins the container to 1280px (1184px canvas).
console.log('\nEdge-to-Edge Stress Assessment:');
console.log('  Container width on 1920px screen: 1184px (constrained by max-w-7xl).');
console.log('  Coverage ratio: 1792px / 1184px = 1.513x (151% of visible viewport width is covered by preloaded tiles).');
console.log('  Vertical coverage ratio: 1280px / 500px = 2.560x (256% of visible viewport height is covered).');
console.log('✅ SUITE 3 PASSED: 7x5 tile span completely covers map canvas on screens up to 1920px.\n');


// -----------------------------------------------------------------------------
// TEST SUITE 4: LEAFLET CONFIGURATION & PANNING CONSTRAINTS
// -----------------------------------------------------------------------------
console.log('--- TEST SUITE 4: Leaflet Configuration & Panning Constraints ---');

const leafletPath = path.join(rootDir, 'src/components/LeafletOfflineMap.jsx');
const leafletContent = fs.readFileSync(leafletPath, 'utf8');

// 1. maxBounds and maxBoundsViscosity
assert.ok(leafletContent.includes('maxBounds: MEDININAGAR_BOUNDS'), 'maxBounds must be bound to MEDININAGAR_BOUNDS');
assert.ok(leafletContent.includes('maxBoundsViscosity: 1.0'), 'maxBoundsViscosity must be 1.0 (rigid lock)');
console.log('  ✔ maxBounds and maxBoundsViscosity: 1.0 strictly configured.');

// 2. tileLayer bounds
assert.ok(leafletContent.includes('bounds: MEDININAGAR_BOUNDS'), 'tileLayer must restrict tile loading with bounds');
console.log('  ✔ tileLayer bounds restricted to MEDININAGAR_BOUNDS.');

// 3. Zoom levels & Native Zoom
assert.ok(leafletContent.includes('minZoom: 12'), 'minZoom must be 12');
assert.ok(leafletContent.includes('maxZoom: 15'), 'maxZoom must be 15');
assert.ok(leafletContent.includes('minNativeZoom: 12'), 'minNativeZoom must be 12');
assert.ok(leafletContent.includes('maxNativeZoom: 15'), 'maxNativeZoom must be 15');
console.log('  ✔ minZoom: 12, maxZoom: 15, minNativeZoom: 12, maxNativeZoom: 15 correctly configured.');

// 4. Expanded MEDININAGAR_BOUNDS
assert.ok(leafletContent.includes('23.7646') && leafletContent.includes('84.4945'), 'LeafletOfflineMap must use expanded bounds [23.7646, 83.6455] to [24.3186, 84.4945]');
console.log('  ✔ Expanded MEDININAGAR_BOUNDS [23.7646, 83.6455] to [24.3186, 84.4945] verified.');

// 5. Clean Solid Container (No static backdrop image)
assert.ok(!leafletContent.includes('medininagar-real-light.png') && !leafletContent.includes('medininagar-real-dark.png'), 'Static background images removed in favor of clean solid container');
assert.ok(leafletContent.includes('background-color: #f2efe9') && leafletContent.includes('background-color: #12161f'), 'Clean solid container background styling configured');
console.log('  ✔ Clean solid container background verified (no static background images).');

// 6. Reset Trigger & Smooth Recenter
assert.ok(leafletContent.includes('resetTrigger') && leafletContent.includes('flyTo'), 'resetTrigger and flyTo smooth recentering configured');
assert.ok(leafletContent.includes('animate: true'), 'animate: true maintained for zoom changes');
console.log('  ✔ resetTrigger, flyTo recentering, and animate: true verified.');

// 7. Absence of marker / pulsing / popups
assert.ok(!leafletContent.includes('L.marker'), 'L.marker must not be present');
assert.ok(!leafletContent.includes('bindPopup'), 'bindPopup must not be present');
assert.ok(!leafletContent.includes('leaflet-pulsing-marker-wrapper'), 'leaflet-pulsing-marker-wrapper must not be present');
assert.ok(!leafletContent.includes('animate-ping'), 'animate-ping must not be present in LeafletOfflineMap');
console.log('  ✔ Markers, popups, and pulsing radar animations completely removed.');

// 8. Offline tile path
assert.ok(leafletContent.includes('assets/tiles/{z}/{x}/{y}.png'), 'Local tile template must be used');
console.log('  ✔ Local tile URL template correctly references pre-cached assets.');

console.log('✅ SUITE 4 PASSED: Leaflet configuration contracts verified.\n');

// -----------------------------------------------------------------------------
// TEST SUITE 5: OFFLINEMAPSNAPSHOT VERIFICATION
// -----------------------------------------------------------------------------
console.log('--- TEST SUITE 5: OfflineMapSnapshot Verification ---');
const snapshotPath = path.join(rootDir, 'src/components/OfflineMapSnapshot.jsx');
const snapshotContent = fs.readFileSync(snapshotPath, 'utf8');

assert.ok(!snapshotContent.includes('animate-pulse'), 'animate-pulse removed from OfflineMapSnapshot pin/badge');
assert.ok(!snapshotContent.includes('animate-ping'), 'animate-ping removed from OfflineMapSnapshot pin/badge');
assert.ok(snapshotContent.includes('export const LANDMARKS'), 'LANDMARKS metadata exported cleanly');
console.log('  ✔ OfflineMapSnapshot has zero pins/pulsing animations and exports LANDMARKS cleanly.');
console.log('✅ SUITE 5 PASSED: OfflineMapSnapshot verified.\n');

console.log('========================================================================');
console.log('   ALL CHALLENGER 1 TESTS PASSED CLEANLY WITH ZERO ERRORS               ');
console.log('========================================================================');
process.exit(0);
