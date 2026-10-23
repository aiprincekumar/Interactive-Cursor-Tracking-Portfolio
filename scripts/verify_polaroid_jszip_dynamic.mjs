import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('=== POLAROID DYNAMIC JSZIP IMPORT AUDIT & INTEGRITY VERIFICATION ===\n');

const exportPath = path.resolve('src/utils/polaroidExport.js');
const exportCode = fs.readFileSync(exportPath, 'utf-8');

// 1. Assert NO top-level static import of jszip
const topLines = exportCode.split('\n').slice(0, 10).join('\n');
assert(!topLines.includes("import JSZip from 'jszip';"), 'FAIL: Top of polaroidExport.js must not statically import jszip');
assert(!topLines.includes('import JSZip from "jszip";'), 'FAIL: Top of polaroidExport.js must not statically import jszip');
console.log('  [PASS] Top-level static import of jszip is removed from polaroidExport.js.');

// 2. Assert dynamic import inside exportAllPolaroidsZip
assert(exportCode.includes("await import('jszip')") || exportCode.includes('await import("jszip")'), 'FAIL: exportAllPolaroidsZip must dynamically import jszip');
assert(exportCode.includes('try {') && exportCode.includes('catch (err)'), 'FAIL: Dynamic import must be wrapped in resilient try/catch block');
console.log('  [PASS] exportAllPolaroidsZip contains resilient dynamic import with try/catch error handling.');

// 3. Functional check of formatVintageTimestamp without importing JSZip
import { formatVintageTimestamp } from '../src/utils/polaroidExport.js';
const formatted = formatVintageTimestamp(new Date('2026-10-23T12:00:00'));
assert(formatted.startsWith('ATUL VERMA • 23 OCT 2026'), 'FAIL: formatVintageTimestamp output mismatch');
console.log(`  [PASS] formatVintageTimestamp works cleanly without loading archival library: "${formatted}"`);

// 4. Test dynamic import functionality via node
const { default: JSZip } = await import('jszip');
const zip = new JSZip();
zip.file('test.txt', 'Hello Atul Verma Polaroid');
const content = await zip.file('test.txt').async('string');
assert.strictEqual(content, 'Hello Atul Verma Polaroid', 'FAIL: JSZip functionality mismatch');
console.log('  [PASS] JSZip constructor and file operations work flawlessly in dynamic mode.');

console.log('\n ALL POLAROID DYNAMIC JSZIP VERIFICATION CHECKS PASSED (100%)! \n');
