import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('=== MULTI-ROLE RESUME DROPDOWN & CONFIG VERIFICATION TEST ===\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${testName}${details ? ` -> ${details}` : ''}`);
    failCount++;
  }
}

// ----------------------------------------------------
// TEST 1: Role-Specific PDF Assets in public/
// ----------------------------------------------------
console.log('--- 1. VERIFY ALL THREE ROLE PDF ASSETS ---');
const expectedPdfs = [
  { file: 'resume-accountant.pdf', minSize: 10000 },
  { file: 'resume-mis.pdf', minSize: 10000 },
  { file: 'resume.pdf', minSize: 10000 }
];

expectedPdfs.forEach(({ file, minSize }) => {
  const filePath = path.join(rootDir, 'public', file);
  const exists = fs.existsSync(filePath);
  assert(exists, `public/${file} exists`);

  if (exists) {
    const stat = fs.statSync(filePath);
    assert(stat.size >= minSize, `${file} size is valid (${stat.size} bytes >= ${minSize})`);
    const buf = fs.readFileSync(filePath);
    const header = buf.subarray(0, 5).toString('utf-8');
    assert(header === '%PDF-', `${file} has valid %PDF- magic header`);
  }
});

// ----------------------------------------------------
// TEST 2: Centralized Resume Config Helper (resumeConfig.js)
// ----------------------------------------------------
console.log('\n--- 2. VERIFY src/utils/resumeConfig.js ---');
const configPath = path.join(rootDir, 'src', 'utils', 'resumeConfig.js');
assert(fs.existsSync(configPath), 'src/utils/resumeConfig.js exists');

const configModule = await import('../src/utils/resumeConfig.js');
const { getResumeConfig, RESUME_ROLE_CONFIG } = configModule;

assert(typeof getResumeConfig === 'function', 'getResumeConfig is an exported function');
assert(Boolean(RESUME_ROLE_CONFIG), 'RESUME_ROLE_CONFIG is exported');

// Verify Accountant Config
const accConfig = getResumeConfig('accountant');
assert(accConfig.fileName === 'resume-accountant.pdf', 'Accountant fileName is resume-accountant.pdf');
assert(accConfig.downloadFilename === 'Atul_Verma_Accountant_Resume.pdf', 'Accountant downloadFilename is Atul_Verma_Accountant_Resume.pdf');
assert(accConfig.label === 'Accountant Resume', 'Accountant label is "Accountant Resume"');
assert(accConfig.badge === 'Accounting & Tax', 'Accountant badge is "Accounting & Tax"');
assert(accConfig.accent === '#FF4D6D', 'Accountant accent is #FF4D6D');
assert(typeof accConfig.getShareUrl === 'function', 'Accountant has getShareUrl function');
assert(accConfig.getShareUrl('https://atulverma.com').includes('role=accountant'), 'Accountant getShareUrl includes ?role=accountant');

// Verify MIS Config
const misConfig = getResumeConfig('mis');
assert(misConfig.fileName === 'resume-mis.pdf', 'MIS fileName is resume-mis.pdf');
assert(misConfig.downloadFilename === 'Atul_Verma_MIS_Resume.pdf', 'MIS downloadFilename is Atul_Verma_MIS_Resume.pdf');
assert(misConfig.label === 'MIS & Analytics Resume', 'MIS label is "MIS & Analytics Resume"');
assert(misConfig.badge === 'Data & Operations', 'MIS badge is "Data & Operations"');
assert(misConfig.accent === '#3B82F6', 'MIS accent is #3B82F6');
assert(misConfig.getShareUrl('https://atulverma.com').includes('role=mis'), 'MIS getShareUrl includes ?role=mis');

// Verify Other / Comprehensive Config
const otherConfig = getResumeConfig('other');
assert(otherConfig.fileName === 'resume.pdf', 'Other fileName is resume.pdf');
assert(otherConfig.downloadFilename === 'Atul_Verma_Resume.pdf', 'Other downloadFilename is Atul_Verma_Resume.pdf');
assert(otherConfig.label === 'Comprehensive Resume', 'Other label is "Comprehensive Resume"');
assert(otherConfig.badge === 'Multidisciplinary', 'Other badge is "Multidisciplinary"');
assert(otherConfig.accent === '#8B5CF6', 'Other accent is #8B5CF6');
assert(otherConfig.getShareUrl('https://atulverma.com').includes('role=other'), 'Other getShareUrl includes ?role=other');

// ----------------------------------------------------
// TEST 3: ResumeDropdown.jsx Multi-Role Integration
// ----------------------------------------------------
console.log('\n--- 3. VERIFY src/components/ResumeDropdown.jsx MULTI-ROLE HOOKS ---');
const resumeDropdownPath = path.join(rootDir, 'src', 'components', 'ResumeDropdown.jsx');
const dropdownCode = fs.readFileSync(resumeDropdownPath, 'utf-8');

assert(dropdownCode.includes("from '../context/RoleContext.jsx'"), 'ResumeDropdown imports useRoleTab');
assert(dropdownCode.includes("from '../utils/resumeConfig.js'"), 'ResumeDropdown imports getResumeConfig');
assert(dropdownCode.includes('getResumeConfig(activeRole)'), 'ResumeDropdown computes resumeConfig from activeRole');
assert(dropdownCode.includes('downloadFilename'), 'ResumeDropdown uses dynamic downloadFilename');
assert(dropdownCode.includes('getShareUrl'), 'ResumeDropdown uses getShareUrl with active role param');
assert(dropdownCode.includes('iframe.src = pdfPath'), 'ResumeDropdown prints active role pdfPath');

// ----------------------------------------------------
// TEST 4: CommandPalette.jsx Dynamic Role Resume Integration
// ----------------------------------------------------
console.log('\n--- 4. VERIFY src/components/CommandPalette.jsx RESUME COMMAND ---');
const cmdPalettePath = path.join(rootDir, 'src', 'components', 'CommandPalette.jsx');
const cmdCode = fs.readFileSync(cmdPalettePath, 'utf-8');

assert(cmdCode.includes("from '../utils/resumeConfig'"), 'CommandPalette imports getResumeConfig');
assert(
  cmdCode.includes("item.actionType === 'download-resume'") &&
  cmdCode.includes('getResumeConfig(activeRole)'),
  'CommandPalette downloads active role PDF using getResumeConfig'
);

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n=========================================');
console.log(`TOTAL TESTS: ${passCount + failCount}`);
console.log(`PASSED: ${passCount}`);
console.log(`FAILED: ${failCount}`);
console.log('=========================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('\n[SUCCESS] ALL MULTI-ROLE RESUME VERIFICATIONS PASSED 100%!\n');
  process.exit(0);
}
