import fs from 'fs';
import path from 'path';

const pdfPath = path.resolve('public/resume.pdf');
const buf = fs.readFileSync(pdfPath);
const content = buf.toString('binary');

console.log('--- 1. BASIC INTEGRITY CHECKS ---');
console.log('File size:', buf.length, 'bytes');
console.log('Starts with %PDF-1.4:', content.startsWith('%PDF-1.4'));
console.log('Ends with %%EOF:', content.trim().endsWith('%%EOF'));
console.log('Contains em-dash:', buf.includes(Buffer.from('—', 'utf-8')));

console.log('\n--- 2. VECTOR PATH SYNTAX CHECKS ---');
const malformedM = content.match(/\d+(\.\d+)?\s+\d+(\.\d+)?\s+\d+(\.\d+)?\s+\d+(\.\d+)?\s+m/g);
console.log('4-number m operators:', malformedM ? malformedM.length : 0);
const mWithoutL = content.match(/m\s+S/g);
console.log('m directly followed by S without l:', mWithoutL ? mWithoutL.length : 0);

console.log('\n--- 3. XREF & OBJECT OFFSET VALIDATION ---');
const actualXrefIndex = content.indexOf('xref');
console.log('xref found at byte:', actualXrefIndex);

const startxrefMatch = content.match(/startxref\r?\n(\d+)\r?\n%%EOF/);
const startxref = parseInt(startxrefMatch ? startxrefMatch[1] : '0', 10);
console.log('startxref in trailer:', startxref, '| actual xref index in file:', actualXrefIndex);

let offsetErrors = 0;
if (startxref !== actualXrefIndex) {
  console.error('ERROR: startxref mismatch!');
  offsetErrors++;
}

// Split lines starting from xref
const lines = content.slice(actualXrefIndex).split(/\r?\n/);

for (let i = 1; i <= 7; i++) {
  const line = lines[2 + i];
  const actualOffset = parseInt(line.substring(0, 10), 10);
  const expectedPrefix = `${i} 0 obj`;
  const actualSlice = content.substring(actualOffset, actualOffset + expectedPrefix.length);
  if (actualSlice !== expectedPrefix) {
    console.error(`MISMATCH at object ${i}: expected "${expectedPrefix}" at byte ${actualOffset}, got "${actualSlice}"`);
    offsetErrors++;
  } else {
    console.log(`✅ Object ${i} (${expectedPrefix}) verified at byte ${actualOffset}`);
  }
}

console.log('\n--- SUMMARY ---');
console.log('Total validation errors:', offsetErrors);
if (offsetErrors === 0 && !malformedM && !mWithoutL) {
  console.log('🎉 ALL PDF VALIDATION TESTS PASSED 100% PERFECTLY!');
} else {
  console.error('❌ PDF VALIDATION FAILED!');
  process.exit(1);
}
