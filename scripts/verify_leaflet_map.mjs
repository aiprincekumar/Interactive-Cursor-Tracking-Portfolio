import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('--- RUNNING LEAFLET + LOCAL TILES VERIFICATION ---');

// 1. Check tile files
const tilesDir = path.join(rootDir, 'public/assets/tiles');
assert.ok(fs.existsSync(tilesDir), 'public/assets/tiles directory must exist');

const zoomLevels = ['10', '11', '12', '13', '14', '15'];
let totalTiles = 0;

for (const z of zoomLevels) {
  const zPath = path.join(tilesDir, z);
  assert.ok(fs.existsSync(zPath), `Zoom level directory ${z} must exist`);
  const xDirs = fs.readdirSync(zPath);
  assert.ok(xDirs.length >= 3, `Zoom level ${z} should contain at least 3 x-coordinate folders`);

  for (const x of xDirs) {
    const xPath = path.join(zPath, x);
    if (!fs.statSync(xPath).isDirectory()) continue;
    const yFiles = fs.readdirSync(xPath).filter(f => f.endsWith('.png'));
    for (const y of yFiles) {
      const tilePath = path.join(xPath, y);
      const stat = fs.statSync(tilePath);
      assert.ok(stat.size > 1000, `Tile ${z}/${x}/${y} is too small (${stat.size} bytes)`);
      totalTiles++;
    }
  }
}

assert.ok(totalTiles === 176, `Expected exactly 176 pre-cached tiles across zoom levels 10, 11, 12, 13, 14, 15, but found ${totalTiles}`);
console.log(`✅ PASS: Found all ${totalTiles} valid PNG tiles across zoom levels 10, 11, 12, 13, 14, 15.`);

// 2. Check LeafletOfflineMap.jsx
const leafletMapPath = path.join(rootDir, 'src/components/LeafletOfflineMap.jsx');
assert.ok(fs.existsSync(leafletMapPath), 'LeafletOfflineMap.jsx must exist');
const leafletContent = fs.readFileSync(leafletMapPath, 'utf8');

assert.ok(
  leafletContent.includes('export default function LeafletOfflineMap'),
  'LeafletOfflineMap.jsx must export LeafletOfflineMap as default'
);
assert.ok(
  leafletContent.includes('import.meta.env.BASE_URL'),
  'LeafletOfflineMap.jsx must resolve tile URL using import.meta.env.BASE_URL'
);
assert.ok(
  leafletContent.includes('assets/tiles/{z}/{x}/{y}.png'),
  'LeafletOfflineMap.jsx must use local tile URL template'
);
assert.ok(
  !leafletContent.includes('L.marker'),
  'LeafletOfflineMap.jsx must NOT include any marker pin indicators'
);
assert.ok(
  !leafletContent.includes('bindPopup'),
  'LeafletOfflineMap.jsx must NOT bind any popups'
);
assert.ok(
  !leafletContent.includes('leaflet-pulsing-marker-wrapper'),
  'LeafletOfflineMap.jsx must NOT contain pulsing marker wrapper'
);
assert.ok(
  !leafletContent.includes('animate-ping'),
  'LeafletOfflineMap.jsx must NOT contain animate-ping radar dot'
);
assert.ok(
  leafletContent.includes('maxBounds') && leafletContent.includes('maxBoundsViscosity'),
  'LeafletOfflineMap.jsx must configure strict maxBounds locking'
);
assert.ok(
  leafletContent.includes('maxBoundsViscosity: 1.0') || leafletContent.includes('maxBoundsViscosity: 1'),
  'LeafletOfflineMap.jsx must configure maxBoundsViscosity: 1.0'
);
assert.ok(
  leafletContent.includes('minZoom: 12') && leafletContent.includes('maxZoom: 15') && leafletContent.includes('minNativeZoom: 12') && leafletContent.includes('maxNativeZoom: 15'),
  'LeafletOfflineMap.jsx must configure zoom bounds [12, 15] with minNativeZoom: 12 and maxNativeZoom: 15'
);
assert.ok(
  (leafletContent.includes('keepBuffer: 6') || leafletContent.includes('keepBuffer: 2')) && leafletContent.includes('updateWhenZooming: true'),
  'LeafletOfflineMap.jsx must configure keepBuffer (2 or 6) and updateWhenZooming: true'
);
assert.ok(
  !leafletContent.includes('medininagar-real-light.png') && !leafletContent.includes('medininagar-real-dark.png'),
  'LeafletOfflineMap.jsx must NOT use static background images in styles (clean solid background)'
);
assert.ok(
  leafletContent.includes('background-color: #f2efe9') && leafletContent.includes('background-color: #12161f'),
  'LeafletOfflineMap.jsx must configure clean solid container styling for light and dark modes'
);
assert.ok(
  leafletContent.includes('resetTrigger') && leafletContent.includes('flyTo'),
  'LeafletOfflineMap.jsx must handle resetTrigger prop and invoke flyTo for smooth recentering'
);
assert.ok(
  leafletContent.includes('23.7646') && leafletContent.includes('84.4945'),
  'LeafletOfflineMap.jsx must configure expanded MEDININAGAR_BOUNDS [23.7646, 83.6455] to [24.3186, 84.4945]'
);
assert.ok(
  leafletContent.includes('zoom = 13') || leafletContent.includes('zoom: 13'),
  'LeafletOfflineMap.jsx must configure default city-level zoom 13'
);
assert.ok(
  leafletContent.includes('24.0416') && leafletContent.includes('84.07'),
  'LeafletOfflineMap.jsx must center on Medininagar coordinates'
);
assert.ok(
  leafletContent.includes('Medininagar (Daltonganj), Jharkhand'),
  'LeafletOfflineMap.jsx must feature clean city-level label in aria-label'
);
assert.ok(
  !leafletContent.includes('Atul Verma HQ'),
  'LeafletOfflineMap.jsx must NOT include personal HQ in offline map popup'
);
assert.ok(
  leafletContent.includes('animate: true'),
  'LeafletOfflineMap.jsx must maintain animate: true for smooth zoom changes'
);
console.log('✅ PASS: LeafletOfflineMap.jsx component export, base URL resolution, absence of markers/popups, maxBounds locking, and bounds verified.');

// 3. Check ContactSection.jsx integration
const contactSectionPath = path.join(rootDir, 'src/components/ContactSection.jsx');
assert.ok(fs.existsSync(contactSectionPath), 'ContactSection.jsx must exist');
const contactContent = fs.readFileSync(contactSectionPath, 'utf8');

const isLazyImport = contactContent.includes("import('./LeafletOfflineMap')");
const hasMapImport =
  contactContent.includes("from './LeafletOfflineMap'") || isLazyImport;
assert.ok(
  hasMapImport,
  'ContactSection must import LeafletOfflineMap (statically or via React.lazy)'
);

if (isLazyImport) {
  assert.ok(
    contactContent.includes('Suspense'),
    'ContactSection.jsx must import and use React Suspense when lazy loading LeafletOfflineMap'
  );
  const suspenseIndex = contactContent.indexOf('<Suspense');
  const leafletIndex = contactContent.indexOf('<LeafletOfflineMap');
  const suspenseCloseIndex = contactContent.indexOf('</Suspense>');
  assert.ok(
    suspenseIndex !== -1 &&
      leafletIndex !== -1 &&
      suspenseCloseIndex !== -1 &&
      suspenseIndex < leafletIndex &&
      leafletIndex < suspenseCloseIndex,
    'ContactSection.jsx must wrap <LeafletOfflineMap /> within <Suspense>...</Suspense>'
  );
}

assert.ok(
  contactContent.includes('<LeafletOfflineMap'),
  'ContactSection.jsx must render <LeafletOfflineMap />'
);
assert.ok(
  contactContent.includes('Google Maps / Offline OSM'),
  'ContactSection.jsx must feature Google Maps / Offline OSM toggle label'
);
assert.ok(
  contactContent.includes('handleToggleMapMode'),
  'ContactSection.jsx must provide handleToggleMapMode toggle handler'
);
assert.ok(
  contactContent.includes("disabled={mapMode === 'osm' ? zoom >= 15 : zoom >= 18}"),
  'ContactSection.jsx must configure zoom in ceiling at 15 for OSM mode'
);
assert.ok(
  contactContent.includes("disabled={mapMode === 'osm' ? zoom <= 12 : zoom <= 11}"),
  'ContactSection.jsx must configure zoom out floor at 12 for OSM mode'
);
assert.ok(
  contactContent.includes('setResetTrigger((prev) => prev + 1)') || contactContent.includes('setResetTrigger'),
  'ContactSection.jsx handleResetZoom must increment resetTrigger'
);
assert.ok(
  contactContent.includes('setZoom(13)'),
  'ContactSection.jsx handleResetZoom must set zoom to 13'
);
console.log(`✅ PASS: ContactSection.jsx imports LeafletOfflineMap (${isLazyImport ? 'lazy' : 'static'}), renders component, and provides toggle UI with zoom floor 12 and ceiling 15.`);

console.log('🎉 ALL LEAFLET OFFLINE MAP INTEGRATION VERIFICATION CHECKS PASSED!');
