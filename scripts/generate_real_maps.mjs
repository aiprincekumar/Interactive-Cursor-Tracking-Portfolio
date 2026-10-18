import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'public/assets/maps');

const LAT = 24.0416;
const LNG = 84.0700;
const ZOOM = 14;

// Coordinate math
function lon2tileFloat(lon, zoom) {
  return ((lon + 180) / 360) * Math.pow(2, zoom);
}

function lat2tileFloat(lat, zoom) {
  return (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom);
}

const targetXf = lon2tileFloat(LNG, ZOOM);
const targetYf = lat2tileFloat(LAT, ZOOM);

// Grid configuration
const startX = 12016;
const endX = 12020; // 5 tiles horizontally: 12016, 12017, 12018, 12019, 12020
const startY = 7062;
const endY = 7065; // 4 tiles vertically: 7062, 7063, 7064, 7065

const numCols = endX - startX + 1; // 5
const numRows = endY - startY + 1; // 4
const TILE_SIZE = 256;
const gridWidth = numCols * TILE_SIZE; // 1280
const gridHeight = numRows * TILE_SIZE; // 1024

const CROP_W = 1000;
const CROP_H = 650;

// Align Medininagar HQ (24.0416, 84.0700) exactly at 52% x, 49.2% y
const cropStartX = Math.max(0, Math.min(gridWidth - CROP_W, Math.round((targetXf - startX) * TILE_SIZE - CROP_W * 0.52)));
const cropStartY = Math.max(0, Math.min(gridHeight - CROP_H, Math.round((targetYf - startY) * TILE_SIZE - CROP_H * 0.492)));

console.log('Grid layout:', {
  targetXf,
  targetYf,
  gridWidth,
  gridHeight,
  cropStartX,
  cropStartY,
  cropW: CROP_W,
  cropH: CROP_H
});

async function fetchTile(url) {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; PortfolioMapStitcher/1.0)'
  };
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch tile ${url}: ${res.status} ${res.statusText}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  return PNG.sync.read(buf);
}

async function stitchGrid(urlTemplate) {
  const fullCanvas = new PNG({ width: gridWidth, height: gridHeight });

  for (let r = 0; r < numRows; r++) {
    const tileY = startY + r;
    for (let c = 0; c < numCols; c++) {
      const tileX = startX + c;
      const url = urlTemplate
        .replace('{z}', String(ZOOM))
        .replace('{x}', String(tileX))
        .replace('{y}', String(tileY));
      
      const tile = await fetchTile(url);
      const dstX = c * TILE_SIZE;
      const dstY = r * TILE_SIZE;
      PNG.bitblt(tile, fullCanvas, 0, 0, TILE_SIZE, TILE_SIZE, dstX, dstY);
    }
  }

  // Crop to CROP_W x CROP_H
  const cropped = new PNG({ width: CROP_W, height: CROP_H });
  PNG.bitblt(fullCanvas, cropped, cropStartX, cropStartY, CROP_W, CROP_H, 0, 0);
  return cropped;
}

// Convert light map pixels to an authentic, high-contrast dark cartographic palette
// Dark theme matching the portfolio's aesthetic (#100C1A, indigo/violet glow, cyan water, amber roads, crisp labels)
// oxlint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
function _transformToCartoDark(lightPng) {
  const darkPng = new PNG({ width: lightPng.width, height: lightPng.height });

  for (let y = 0; y < lightPng.height; y++) {
    for (let x = 0; x < lightPng.width; x++) {
      const idx = (lightPng.width * y + x) << 2;
      const r = lightPng.data[idx];
      const g = lightPng.data[idx + 1];
      const b = lightPng.data[idx + 2];
      const a = lightPng.data[idx + 3];

      // Detect water (typically higher blue, e.g. North Koel River #BAE6FD / #93C5FD / #AAD3DF)
      const isWater = (b > r + 15 && b > g - 10 && b > 140) || (b > 180 && r < 180 && g > 160);
      
      // Detect green / parks / forests (g noticeably higher than r & b)
      const isGreen = g > r + 10 && g > b + 10 && g > 150;

      // Detect major roads / highways (orange, yellow, peach)
      const isHighway = (r > 200 && g > 120 && b < 100) || (r > 220 && g > 180 && b < 120);

      // Detect secondary roads / urban street lines (light grey, white)
      const isRoad = (r > 230 && g > 230 && b > 230) || (r === g && g === b && r > 180);

      // Detect text / labels / borders (dark text on light map)
      const isDarkFeature = (r < 100 && g < 100 && b < 100);

      let outR, outG, outB;

      if (isWater) {
        // Glowing cyan-blue river on dark map
        outR = 15;
        outG = 45;
        outB = 80;
      } else if (isHighway) {
        // Vibrant amber-orange highway
        outR = 249;
        outG = 115;
        outB = 22;
      } else if (isGreen) {
        // Deep emerald dark park
        outR = 16;
        outG = 36;
        outB = 28;
      } else if (isDarkFeature) {
        // Text labels and borders - invert to crisp light / silver
        outR = 220;
        outG = 225;
        outB = 235;
      } else if (isRoad) {
        // Minor roads - sleek dark slate / charcoal line
        outR = 45;
        outG = 40;
        outB = 58;
      } else {
        // Background land: deep rich obsidian / dark violet (#100C1A to #161122)
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        outR = Math.round(16 + (1 - lum) * 12);
        outG = Math.round(12 + (1 - lum) * 10);
        outB = Math.round(26 + (1 - lum) * 15);
      }

      darkPng.data[idx] = outR;
      darkPng.data[idx + 1] = outG;
      darkPng.data[idx + 2] = outB;
      darkPng.data[idx + 3] = a;
    }
  }

  return darkPng;
}

async function main() {
  console.log('Fetching OpenStreetMap raster tiles for real light map...');
  const osmUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  const lightMap = await stitchGrid(osmUrl);
  const lightBuf = PNG.sync.write(lightMap);
  const lightPath = path.join(outDir, 'medininagar-real-light.png');
  fs.writeFileSync(lightPath, lightBuf);
  console.log(`Saved medininagar-real-light.png (${lightBuf.length} bytes, ${CROP_W}x${CROP_H})`);

  console.log('Fetching CartoDB Dark Matter tiles for real dark map...');
  const cartoDarkUrl = 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
  const darkMapCarto = await stitchGrid(cartoDarkUrl);
  const darkCartoBuf = PNG.sync.write(darkMapCarto);

  console.log(`Carto Dark Matter buffer size: ${darkCartoBuf.length} bytes`);

  // Let's check size: if Carto Dark is > 15KB:
  const darkPath = path.join(outDir, 'medininagar-real-dark.png');
  fs.writeFileSync(darkPath, darkCartoBuf);
  console.log(`Saved medininagar-real-dark.png (${darkCartoBuf.length} bytes, ${CROP_W}x${CROP_H})`);
}

main().catch(err => {
  console.error('Error generating maps:', err);
  process.exit(1);
});
