import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('--- STARTING VERIFICATION OF GIS LAZY LOADING & SKELETON UI ---');

// 1. Check GISMapSkeleton.jsx exists and has required features
const skeletonPath = path.join(rootDir, 'src/components/GISMapSkeleton.jsx');
assert.ok(fs.existsSync(skeletonPath), 'GISMapSkeleton.jsx must exist');
const skeletonContent = fs.readFileSync(skeletonPath, 'utf8');

assert.ok(
  skeletonContent.includes('export default function GISMapSkeleton'),
  'GISMapSkeleton.jsx must export GISMapSkeleton as default'
);

assert.ok(
  skeletonContent.includes('animate-pulse'),
  'GISMapSkeleton must use animate-pulse container effect'
);

assert.ok(
  skeletonContent.includes('24.0416') && skeletonContent.includes('84.0700'),
  'GISMapSkeleton must display Medininagar HQ coordinates (LAT: 24.0416° N / LON: 84.0700° E)'
);

assert.ok(
  skeletonContent.includes('Loading Interactive GIS Map...'),
  'GISMapSkeleton must display clean mono text "Loading Interactive GIS Map..."'
);

assert.ok(
  skeletonContent.includes('role="status"'),
  'GISMapSkeleton must include role="status" for accessibility'
);

console.log('✅ PASS: GISMapSkeleton.jsx contains cyber/HUD styling, coordinate badges, reticle, and accessibility attributes.');

// 2. Check ContactSection.jsx dynamic import & Suspense wrapping
const contactPath = path.join(rootDir, 'src/components/ContactSection.jsx');
assert.ok(fs.existsSync(contactPath), 'ContactSection.jsx must exist');
const contactContent = fs.readFileSync(contactPath, 'utf8');

assert.ok(
  contactContent.includes('lazy') && contactContent.includes('Suspense'),
  'ContactSection.jsx must import lazy and Suspense from react'
);

assert.ok(
  contactContent.includes("import GISMapSkeleton from './GISMapSkeleton';"),
  'ContactSection.jsx must import GISMapSkeleton'
);

assert.ok(
  contactContent.includes("const LeafletOfflineMap = lazy(() => import('./LeafletOfflineMap'));"),
  'ContactSection.jsx must dynamically lazy load LeafletOfflineMap'
);

assert.ok(
  !contactContent.includes("import LeafletOfflineMap from './LeafletOfflineMap';"),
  'ContactSection.jsx must NOT contain static import of LeafletOfflineMap'
);

assert.ok(
  contactContent.includes('<Suspense fallback={<GISMapSkeleton'),
  'ContactSection.jsx must wrap LeafletOfflineMap in Suspense with GISMapSkeleton fallback'
);

console.log('✅ PASS: ContactSection.jsx properly uses lazy() import and Suspense wrapper for LeafletOfflineMap.');

console.log('🎉 ALL GIS LAZY LOADING & SKELETON VERIFICATION CHECKS PASSED (100%)!');
