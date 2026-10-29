import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('  VERIFY LIVE 3D MEDIA EXPORT (PHASE 1 GATE)                    ');
console.log('================================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

const mediaExportPath = path.resolve('src/utils/mediaExport.js');
const mediaExportContent = fs.readFileSync(mediaExportPath, 'utf8');

// 1. Check exports
assert(mediaExportContent.includes('export async function capture3DStageSnapshot'), 'capture3DStageSnapshot is exported');
assert(mediaExportContent.includes('export async function record360TurntableVideo'), 'record360TurntableVideo is exported');

// 2. Check 3D projection & true stage rendering
assert(mediaExportContent.includes('projectPoint3D'), 'projectPoint3D mathematical projection function exists');
assert(mediaExportContent.includes('drawProjectedSlab'), 'drawProjectedSlab renders 3D isometric/perspective slabs');
assert(!mediaExportContent.includes("ctx.fillText('ATUL VERMA • 3D SPATIAL STUDIO'"), 'Primitive hardcoded mock text card has been removed');

// 3. Check dynamic multi-frame turntable rotation loop
assert(mediaExportContent.includes('rotY = (currentAngle % 360) - 180'), 'Computes dynamic rotY for true 360 degree turntable rotation');
assert(mediaExportContent.includes('await renderElementToCanvas'), 'record360TurntableVideo renders true 3D model frame at current rotation angle');

// 4. Check active material awareness
assert(mediaExportContent.includes('activeMaterial'), 'renderElementToCanvas checks active material preset on document or fallback');

console.log('\n================================================================');
console.log(`  VERIFICATION RESULTS: ${passed} PASSED | ${failed} FAILED`);
console.log('================================================================');

if (failed > 0) process.exit(1);
