import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('========================================================================');
console.log('       CHALLENGER 2: MAP UI & PIN ABSENCE EMPIRICAL VERIFICATION        ');
console.log('========================================================================\n');

let passCount = 0;
let failCount = 0;

function check(title, fn) {
  try {
    fn();
    console.log(`  ✔ PASS: ${title}`);
    passCount++;
  } catch (err) {
    console.error(`  ✖ FAIL: ${title}`);
    console.error(`         Reason: ${err.message}`);
    failCount++;
  }
}

// -----------------------------------------------------------------------------
// SECTION 1: LeafletOfflineMap.jsx Static & Regex Absence Checks
// -----------------------------------------------------------------------------
console.log('--- 1. LeafletOfflineMap.jsx Pin & Popup Absence ---');
const leafletPath = path.join(rootDir, 'src/components/LeafletOfflineMap.jsx');
const leafletCode = fs.readFileSync(leafletPath, 'utf8');

check('No L.marker in LeafletOfflineMap.jsx', () => {
  assert.ok(!leafletCode.includes('L.marker'), 'Found L.marker in LeafletOfflineMap.jsx');
});

check('No .marker( in LeafletOfflineMap.jsx', () => {
  assert.ok(!/\.marker\s*\(/.test(leafletCode), 'Found .marker( invocation in LeafletOfflineMap.jsx');
});

check('No bindPopup in LeafletOfflineMap.jsx', () => {
  assert.ok(!leafletCode.includes('bindPopup'), 'Found bindPopup in LeafletOfflineMap.jsx');
});

check('No animate-ping in LeafletOfflineMap.jsx', () => {
  assert.ok(!leafletCode.includes('animate-ping'), 'Found animate-ping in LeafletOfflineMap.jsx');
});

check('No leaflet-pulsing-marker-wrapper in LeafletOfflineMap.jsx', () => {
  assert.ok(!leafletCode.includes('leaflet-pulsing-marker-wrapper'), 'Found pulsing marker wrapper in LeafletOfflineMap.jsx');
});

check('No pulsingIcon in LeafletOfflineMap.jsx', () => {
  assert.ok(!leafletCode.includes('pulsingIcon'), 'Found pulsingIcon in LeafletOfflineMap.jsx');
});

check('No custom popup CSS in LeafletOfflineMap.jsx style block', () => {
  assert.ok(!leafletCode.includes('.custom-leaflet-popup'), 'Found .custom-leaflet-popup in style block');
  assert.ok(!leafletCode.includes('.leaflet-popup'), 'Found .leaflet-popup in style block');
});

check('Presence of MEDININAGAR_BOUNDS and maxBounds config', () => {
  assert.ok(leafletCode.includes('MEDININAGAR_BOUNDS'), 'Missing MEDININAGAR_BOUNDS');
  assert.ok(leafletCode.includes('maxBounds: MEDININAGAR_BOUNDS'), 'Missing maxBounds: MEDININAGAR_BOUNDS');
  assert.ok(leafletCode.includes('maxBoundsViscosity: 1.0') || leafletCode.includes('maxBoundsViscosity: 1'), 'Missing maxBoundsViscosity');
});

check('LeafletOfflineMap has clean solid container styling without static background image', () => {
  assert.ok(!leafletCode.includes('medininagar-real-light.png'), 'Static light background image should not be present');
  assert.ok(!leafletCode.includes('medininagar-real-dark.png'), 'Static dark background image should not be present');
  assert.ok(leafletCode.includes('.leaflet-offline-map-container.leaflet-container'), 'Missing high-res cartographic container styling');
  assert.ok(leafletCode.includes('background-color: #f2efe9') && leafletCode.includes('background-color: #12161f'), 'Missing clean solid container background styling');
});

check('LeafletOfflineMap has keepBuffer: 2 or 6, updateWhenZooming: true, minZoom: 12, maxZoom: 15, minNativeZoom: 12', () => {
  assert.ok(leafletCode.includes('keepBuffer: 6') || leafletCode.includes('keepBuffer: 2'), 'Missing keepBuffer (2 or 6)');
  assert.ok(leafletCode.includes('updateWhenZooming: true'), 'Missing updateWhenZooming: true');
  assert.ok(leafletCode.includes('minZoom: 12'), 'Missing minZoom: 12');
  assert.ok(leafletCode.includes('maxZoom: 15'), 'Missing maxZoom: 15');
  assert.ok(leafletCode.includes('minNativeZoom: 12'), 'Missing minNativeZoom: 12');
  assert.ok(leafletCode.includes('maxNativeZoom: 15'), 'Missing maxNativeZoom: 15');
});

check('LeafletOfflineMap has resetTrigger prop and flyTo for smooth recentering', () => {
  assert.ok(leafletCode.includes('resetTrigger'), 'Missing resetTrigger prop');
  assert.ok(leafletCode.includes('flyTo'), 'Missing flyTo recentering');
  assert.ok(leafletCode.includes('animate: true'), 'Missing animate: true for zoom');
});

// -----------------------------------------------------------------------------
// SECTION 2: OfflineMapSnapshot.jsx Pin Absence Checks
// -----------------------------------------------------------------------------
console.log('\n--- 2. OfflineMapSnapshot.jsx Canvas Checks ---');
const snapshotPath = path.join(rootDir, 'src/components/OfflineMapSnapshot.jsx');
const snapshotCode = fs.readFileSync(snapshotPath, 'utf8');

check('No landmark overlay pin buttons rendered on canvas', () => {
  // In previous versions, LANDMARKS.map was mapped to overlay buttons
  assert.ok(!snapshotCode.includes('LANDMARKS.map('), 'Found LANDMARKS.map creating overlay markers');
});

check('No animate-ping in OfflineMapSnapshot.jsx', () => {
  assert.ok(!snapshotCode.includes('animate-ping'), 'Found animate-ping in OfflineMapSnapshot.jsx');
});

check('No animate-pulse on header MapPin in OfflineMapSnapshot.jsx', () => {
  // Check HUD header MapPin icon
  const headerMapPinMatch = snapshotCode.match(/<MapPin[^>]*\/>/);
  assert.ok(headerMapPinMatch, 'MapPin header icon exists');
  assert.ok(!headerMapPinMatch[0].includes('animate-pulse'), 'MapPin header icon has animate-pulse');
});

check('LANDMARKS export retained for backward compatibility contract', () => {
  assert.ok(snapshotCode.includes('export const LANDMARKS ='), 'LANDMARKS metadata constant not exported');
});

// -----------------------------------------------------------------------------
// SECTION 3: ContactSection.jsx Google Maps Iframe Integrity
// -----------------------------------------------------------------------------
console.log('\n--- 3. ContactSection.jsx Google Maps Iframe Integrity ---');
const contactPath = path.join(rootDir, 'src/components/ContactSection.jsx');
const contactCode = fs.readFileSync(contactPath, 'utf8');

check('Google Maps iframe element is present in ContactSection.jsx', () => {
  assert.ok(contactCode.includes('<iframe'), 'Missing <iframe in ContactSection.jsx');
  assert.ok(contactCode.includes('src={mapEmbedUrl}'), 'Missing src={mapEmbedUrl} on iframe');
});

check('mapEmbedUrl points to authentic Google Maps embed endpoint', () => {
  assert.ok(
    contactCode.includes('https://maps.google.com/maps?q=Daltonganj%2C%20Medininagar%2C%20Palamau%2C%20Jharkhand%20822101'),
    'mapEmbedUrl does not target Daltonganj / Medininagar coordinates'
  );
  assert.ok(contactCode.includes('&output=embed'), 'mapEmbedUrl missing output=embed');
});

check('Iframe has allowFullScreen and lazy loading', () => {
  assert.ok(contactCode.includes('allowFullScreen'), 'Missing allowFullScreen on iframe');
  assert.ok(contactCode.includes('loading="lazy"'), 'Missing loading="lazy" on iframe');
});

check('Iframe and Leaflet crossfade mechanism is intact', () => {
  assert.ok(contactCode.includes('transition-opacity duration-700 ease-in-out'), 'Missing crossfade transition class');
  assert.ok(contactCode.includes('opacity-100 pointer-events-auto z-10'), 'Missing visible iframe state');
  assert.ok(contactCode.includes('opacity-0 pointer-events-none z-0'), 'Missing hidden iframe state');
});

check('Google Maps / Offline OSM toggle button is present', () => {
  assert.ok(contactCode.includes('handleToggleMapMode'), 'Missing handleToggleMapMode');
  assert.ok(contactCode.includes('Google Maps / Offline OSM'), 'Missing toggle label');
});

check('On-demand silent loading state with spinner in ContactSection.jsx', () => {
  assert.ok(contactCode.includes('isLiveLoading'), 'Missing isLiveLoading state');
  assert.ok(contactCode.includes('Downloading Live Map in background'), 'Missing background download indication');
});

check('Iframe has no key attribute to prevent flash on zoom', () => {
  assert.ok(!contactCode.includes('key={`map-zoom-'), 'Iframe must NOT have key={`map-zoom-${zoom}`}');
  assert.ok(!contactCode.includes('key={`google-map-${zoom}'), 'Iframe must NOT key on zoom');
});

check('Zoom controls floor 12, ceiling 15 in OSM mode', () => {
  assert.ok(
    contactCode.includes("disabled={mapMode === 'osm' ? zoom >= 15 : zoom >= 18}"),
    'Zoom in must ceiling at 15 for OSM'
  );
  assert.ok(
    contactCode.includes("disabled={mapMode === 'osm' ? zoom <= 12 : zoom <= 11}"),
    'Zoom out must floor at 12 for OSM'
  );
  assert.ok(
    contactCode.includes('setResetTrigger((prev) => prev + 1)') || contactCode.includes('setResetTrigger'),
    'handleResetZoom must trigger resetTrigger'
  );
  assert.ok(
    contactCode.includes('setZoom(13)'),
    'handleResetZoom must set zoom to 13'
  );
});

console.log('\n========================================================================');
console.log(`Results: ${passCount} passed, ${failCount} failed`);
console.log('========================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
