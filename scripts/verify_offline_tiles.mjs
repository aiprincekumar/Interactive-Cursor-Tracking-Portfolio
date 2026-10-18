import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const tilesBaseDir = path.join(rootDir, 'public', 'assets', 'tiles');

const PNG_HEADER = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

const expectedGrids = {
  12: {
    cx: 3004,
    cy: 1766,
    xRange: [3001, 3002, 3003, 3004, 3005, 3006, 3007],
    yRange: [1764, 1765, 1766, 1767, 1768]
  },
  13: {
    cx: 6009,
    cy: 3532,
    xRange: [6006, 6007, 6008, 6009, 6010, 6011, 6012],
    yRange: [3530, 3531, 3532, 3533, 3534]
  },
  14: {
    cx: 12018,
    cy: 7064,
    xRange: [12017, 12018, 12019],
    yRange: [7063, 7064, 7065]
  },
  15: {
    cx: 24036,
    cy: 14128,
    xRange: [24035, 24036, 24037],
    yRange: [14127, 14128, 14129]
  }
};

let passCount = 0;
let totalCount = 0;

console.log('=== Verifying Medininagar Offline OSM Tiles ===\n');

for (const [z, conf] of Object.entries(expectedGrids)) {
  console.log(`Zoom ${z} (Center: ${conf.cx}, ${conf.cy}):`);
  for (const x of conf.xRange) {
    for (const y of conf.yRange) {
      totalCount++;
      const p = path.join(tilesBaseDir, z, String(x), `${y}.png`);
      if (!fs.existsSync(p)) {
        console.error(`  FAIL: Missing tile ${p}`);
        continue;
      }
      const buf = fs.readFileSync(p);
      const isHeaderValid = buf.subarray(0, 8).equals(PNG_HEADER);
      const isSizeValid = buf.length > 5000;
      let decodes = false;
      try {
        const img = PNG.sync.read(buf);
        decodes = (img.width === 256 && img.height === 256);
      } catch (e) {
        decodes = false;
      }

      if (isHeaderValid && isSizeValid && decodes) {
        passCount++;
        console.log(`  PASS: [${z}/${x}/${y}.png] - ${buf.length} bytes (PNG 256x256)`);
      } else {
        console.error(`  FAIL: [${z}/${x}/${y}.png] - Header: ${isHeaderValid}, Size: ${buf.length}, Decodes: ${decodes}`);
      }
    }
  }
}

console.log(`\nResult: ${passCount}/${totalCount} tiles passed verification.`);
if (passCount === 88) {
  console.log('ALL 88 TILES READY FOR OFFLINE SERVING.');
  process.exit(0);
} else {
  console.error('VERIFICATION FAILED.');
  process.exit(1);
}
