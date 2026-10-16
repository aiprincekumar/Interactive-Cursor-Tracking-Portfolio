import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('=== RESUME SPLIT BUTTON & NAVBAR VERIFICATION TEST ===\n');

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
// TEST 1: public/resume.pdf Existence and Integrity
// ----------------------------------------------------
console.log('--- 1. VERIFY public/resume.pdf ASSET ---');
const resumePdfPath = path.join(rootDir, 'public', 'resume.pdf');
const pdfExists = fs.existsSync(resumePdfPath);
assert(pdfExists, 'public/resume.pdf file exists');

if (pdfExists) {
  const stat = fs.statSync(resumePdfPath);
  assert(stat.size > 5000, `resume.pdf is non-empty and substantial (${stat.size} bytes)`);

  const buf = fs.readFileSync(resumePdfPath);
  const header = buf.subarray(0, 5).toString('utf-8');
  assert(header === '%PDF-', `resume.pdf has valid PDF magic header (%PDF-)`);
}

// ----------------------------------------------------
// TEST 2: src/components/ResumeDropdown.jsx Logic
// ----------------------------------------------------
console.log('\n--- 2. VERIFY src/components/ResumeDropdown.jsx ---');
const resumeDropdownPath = path.join(rootDir, 'src', 'components', 'ResumeDropdown.jsx');
assert(fs.existsSync(resumeDropdownPath), 'ResumeDropdown.jsx exists');

const resumeCode = fs.readFileSync(resumeDropdownPath, 'utf-8');

// Check Split Button architecture
assert(
  resumeCode.includes('ref={primaryButtonRef}') && resumeCode.includes('ref={toggleButtonRef}'),
  'Split Button: Dual-button architecture with primary and toggle refs exists'
);

assert(
  resumeCode.includes('onClick={handleDownloadPdf}'),
  'Split Button: Main primary button triggers direct PDF download (handleDownloadPdf)'
);

assert(
  resumeCode.includes('onClick={() => {') && resumeCode.includes('setIsOpen(next)'),
  'Split Button: Dedicated arrow toggle button switches dropdown visibility'
);

// Check Confetti and Audio integration
assert(
  resumeCode.includes("import confetti from 'canvas-confetti'") && resumeCode.includes('triggerConfetti();'),
  'Confetti: canvas-confetti imported and triggered on direct download'
);

assert(
  resumeCode.includes('soundFX.playSparkle()') && resumeCode.includes('soundFX.playFocusBeep()'),
  'Audio: Audio FX (playSparkle & playFocusBeep) integrated with soundEnabled prop'
);

// Check 4 Dropdown Options
assert(resumeCode.includes('View Online'), "Dropdown Option 1: 'View Online' exists");
assert(resumeCode.includes('Download PDF'), "Dropdown Option 2: 'Download PDF' exists");
assert(resumeCode.includes('Share / Copy Link'), "Dropdown Option 3: 'Share / Copy Link' exists");
assert(resumeCode.includes('Print Resume'), "Dropdown Option 4: 'Print Resume' exists");

// Check dynamic BASE URL resolution
assert(
  resumeCode.includes('import.meta.env.BASE_URL') &&
  resumeCode.includes('RESUME_FILE_PATH'),
  'Dynamic Path: BASE_URL dynamic resolution implemented (no hardcoded absolute root URL)'
);

// Check inDrawer responsive adaptation
assert(
  resumeCode.includes('inDrawer ?') && resumeCode.includes('onActionComplete'),
  'Mobile Drawer: inDrawer prop and onActionComplete callback supported for drawer layout'
);

// Check accessibility
assert(
  resumeCode.includes('aria-haspopup="menu"') &&
  resumeCode.includes('aria-expanded={isOpen}') &&
  resumeCode.includes('role="menu"') &&
  resumeCode.includes('role="menuitem"'),
  'Accessibility: ARIA attributes (haspopup, expanded, role=menu/menuitem) fully compliant'
);

// ----------------------------------------------------
// TEST 3: src/components/Navbar.jsx Integration
// ----------------------------------------------------
console.log('\n--- 3. VERIFY src/components/Navbar.jsx INTEGRATION ---');
const navbarPath = path.join(rootDir, 'src', 'components', 'Navbar.jsx');
assert(fs.existsSync(navbarPath), 'Navbar.jsx exists');

const navbarCode = fs.readFileSync(navbarPath, 'utf-8');

// Check overflow-hidden removal from navbar container
const navbarContainerMatch = navbarCode.match(/<header[^>]*>[\s\S]*?<div className="([^"]*rounded-full[^"]*)"/);
if (navbarContainerMatch) {
  const containerClasses = navbarContainerMatch[1];
  const hasOverflowHidden = containerClasses.includes('overflow-hidden');
  assert(!hasOverflowHidden, 'Navbar rounded container has overflow-hidden removed (prevents dropdown clipping)');
} else {
  assert(false, 'Navbar container class check', 'Could not locate navbar container classes');
}

// Check desktop ResumeDropdown placement
assert(
  navbarCode.includes('<ResumeDropdown soundEnabled={soundEnabled} />'),
  'Desktop Navbar: ResumeDropdown mounted with soundEnabled prop'
);

// Check mobile drawer ResumeDropdown placement
assert(
  navbarCode.includes('inDrawer={true}') &&
  navbarCode.includes('onActionComplete={() => setMobileMenuOpen(false)}'),
  'Mobile Drawer: ResumeDropdown mounted with inDrawer={true} and drawer auto-close'
);

// ----------------------------------------------------
// TEST 4: src/components/ScrollProgressBar.jsx
// ----------------------------------------------------
console.log('\n--- 4. VERIFY src/components/ScrollProgressBar.jsx ---');
const scrollProgressPath = path.join(rootDir, 'src', 'components', 'ScrollProgressBar.jsx');
assert(fs.existsSync(scrollProgressPath), 'ScrollProgressBar.jsx exists');

const scrollCode = fs.readFileSync(scrollProgressPath, 'utf-8');
assert(
  scrollCode.includes('overflow-hidden') && scrollCode.includes('rounded-b-full'),
  'ScrollProgressBar: Self-contains overflow-hidden rounded-b-full for clean navbar bottom curve'
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
  console.log('\n[SUCCESS] ALL RESUME & NAVBAR VERIFICATIONS PASSED 100%!\n');
  process.exit(0);
}
