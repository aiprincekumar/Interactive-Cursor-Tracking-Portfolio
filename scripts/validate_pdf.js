import fs from 'fs';
import path from 'path';

const filesToValidate = [
  'public/resume-accountant.pdf',
  'public/resume-mis.pdf',
  'public/resume.pdf',
  'public/resume-controller.pdf'
];

// If a specific file is passed in CLI args, validate only that file
if (process.argv[2]) {
  filesToValidate.length = 0;
  filesToValidate.push(process.argv[2]);
}

let totalFailedFiles = 0;

console.log('=== MULTI-PDF INTEGRITY & STRUCTURE VALIDATION ===\n');

for (const relPath of filesToValidate) {
  const pdfPath = path.resolve(relPath);
  console.log(`Checking [${relPath}]...`);

  if (!fs.existsSync(pdfPath)) {
    console.error(`❌ File not found: ${pdfPath}`);
    totalFailedFiles++;
    continue;
  }

  const buf = fs.readFileSync(pdfPath);
  const content = buf.toString('binary');

  console.log('--- 1. BASIC INTEGRITY CHECKS ---');
  console.log('File size:', buf.length, 'bytes');
  const validHeader = content.startsWith('%PDF-1.4');
  const validFooter = content.trim().endsWith('%%EOF');
  const hasEmDash = buf.includes(Buffer.from('—', 'utf-8'));
  console.log('Starts with %PDF-1.4:', validHeader);
  console.log('Ends with %%EOF:', validFooter);
  console.log('Contains em-dash:', hasEmDash);

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

  const passed = offsetErrors === 0 && !malformedM && !mWithoutL && validHeader && validFooter && !hasEmDash;
  if (passed) {
    console.log(`\n🎉 [PASS] ${relPath} VALIDATION PASSED 100% PERFECTLY!\n`);
  } else {
    console.error(`\n❌ [FAIL] ${relPath} VALIDATION FAILED!\n`);
    totalFailedFiles++;
  }
}

if (totalFailedFiles === 0) {
  console.log('====================================================');
  console.log('🎉 ALL RESUME PDFS VALIDATED 100% SUCCESSFULLY!');
  console.log('====================================================');
  process.exit(0);
} else {
  console.error(`\n❌ ${totalFailedFiles} PDF file(s) failed validation!`);
  process.exit(1);
}
