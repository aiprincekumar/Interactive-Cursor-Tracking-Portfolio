import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const aboutSectionPath = path.join(projectRoot, 'src/components/AboutSection.jsx');
const appPath = path.join(projectRoot, 'src/App.jsx');
const indexCssPath = path.join(projectRoot, 'src/index.css');
const searchCatalogPath = path.join(projectRoot, 'src/utils/searchCatalog.js');

console.log('====================================================');
console.log('ABOUT SECTION 3-TAB REFACTOR VERIFICATION TEST SUITE');
console.log('====================================================\n');

let failedTests = 0;
let passedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failedTests++;
  }
}

const aboutCode = fs.readFileSync(aboutSectionPath, 'utf8');
const appCode = fs.readFileSync(appPath, 'utf8');
const indexCss = fs.readFileSync(indexCssPath, 'utf8');
const searchCatalogCode = fs.readFileSync(searchCatalogPath, 'utf8');

// --- 1. SECTION ANCHOR & REEL POSITIONING ---
console.log('--- 1. Section Anchor & Timeline Positioning ---');
assert(aboutCode.includes('id="about"'), 'About section has id="about" for anchor navigation');
assert(appCode.includes('<AboutSection soundEnabled={soundEnabled} />'), 'App.jsx passes soundEnabled prop to AboutSection');

// --- 2. MODULAR 3-TAB ARCHITECTURE ---
console.log('\n--- 2. Modular 3-Tab Interactive Architecture ---');
assert(aboutCode.includes("'story'"), 'Tab 1 ID "story" exists');
assert(aboutCode.includes("'qualifications'"), 'Tab 2 ID "qualifications" exists');
assert(aboutCode.includes("'biodata'"), 'Tab 3 ID "biodata" exists');

assert(aboutCode.includes("label: 'Story & Vision'"), 'Tab 1 label is "Story & Vision"');
assert(aboutCode.includes("label: 'Qualifications & Education'"), 'Tab 2 label is "Qualifications & Education"');
assert(aboutCode.includes("label: 'Official Bio-Data'"), 'Tab 3 label is "Official Bio-Data"');

assert(aboutCode.includes("const [activeTab, setActiveTab] = useState('story')"), 'Initial active tab defaults to "story" (Story & Vision)');

// --- 3. ACCESSIBILITY & KEYBOARD NAVIGATION ---
console.log('\n--- 3. Accessibility & Keyboard Navigation ---');
assert(aboutCode.includes('role="tablist"'), 'Tab container has role="tablist"');
assert(aboutCode.includes('role="tab"'), 'Tab buttons have role="tab"');
assert(aboutCode.includes('role="tabpanel"'), 'Tab content areas have role="tabpanel"');
assert(aboutCode.includes('aria-selected='), 'Tab buttons declare aria-selected');
assert(aboutCode.includes('aria-controls='), 'Tab buttons declare aria-controls');
assert(aboutCode.includes('onKeyDown={handleKeyDown}'), 'Tab list handles keyboard navigation (handleKeyDown)');
assert(aboutCode.includes('ArrowRight') && aboutCode.includes('ArrowLeft') && aboutCode.includes('Home') && aboutCode.includes('End'), 'Keyboard navigation handles ArrowRight, ArrowLeft, Home, and End');

// --- 4. SOUND FX & UI POLISH ---
console.log('\n--- 4. Sound FX & UI Polish ---');
assert(aboutCode.includes("import { soundFX } from '../utils/audio'"), 'Imports soundFX utility');
assert(aboutCode.includes('soundFX.playFocusBeep()'), 'Triggers playFocusBeep on tab switch');
assert(aboutCode.includes('soundFX.playChipHover()'), 'Triggers playChipHover on tab hover');
assert(aboutCode.includes('soundFX.playPop()'), 'Triggers playPop on copy address action');
assert(aboutCode.includes('soundEnabled'), 'Respects soundEnabled setting');
assert(indexCss.includes('animate-tab-fade'), 'index.css defines .animate-tab-fade for smooth transitions');
assert(aboutCode.includes('animate-tab-fade'), 'AboutSection utilizes animate-tab-fade');

// --- 5. CONTENT ALIGNMENT & CAREER OBJECTIVE ---
console.log('\n--- 5. Content Alignment & Career Objective ---');
assert(
  aboutCode.includes('Financial Accounting') && aboutCode.includes('Tax Governance') && 
  (aboutCode.includes('Business Development') || aboutCode.includes('Distribution')),
  'Career Objective aligns BOTH Senior Financial Accounting/Tax Compliance leadership AND Business Development/Strategic Growth'
);

// --- 6. REDUNDANCY ELIMINATION & 4 CORE COMPETENCY PILLARS ---
console.log('\n--- 6. Redundancy Elimination & 4 Core Competency Pillars ---');
assert(!aboutCode.includes('Office Administration and stock handling through Tally & Path Software'), 'Redundant operational bullet 1 eliminated from About');
assert(!aboutCode.includes('Ensuring a transparent working mechanism removing any feeling of favoritism'), 'Redundant operational bullet 2 eliminated from About');

assert(aboutCode.includes('Statutory Compliance & GST/ITR'), 'Pillar 1: "Statutory Compliance & GST/ITR" present');
assert(aboutCode.includes('Audit Readiness & Financial Reporting'), 'Pillar 2: "Audit Readiness & Financial Reporting" present');
assert(aboutCode.includes('Tally Prime & ERP Architecture'), 'Pillar 3: "Tally Prime & ERP Architecture" present');
assert(aboutCode.includes('Financial MIS & Operations'), 'Pillar 4: "Financial MIS & Operations" present');

// --- 7. ACADEMIC & TECHNICAL QUALIFICATIONS PRESERVATION ---
console.log('\n--- 7. Qualifications & Education Credentials Preservation ---');
assert(aboutCode.includes('Advance Diploma in Computer Application (ADCA)'), 'ADCA credential preserved');
assert(aboutCode.includes('Infocity Daltonganj'), 'Infocity Daltonganj institution preserved');
assert(aboutCode.includes('Intermediate of Arts (I.A.)'), 'Intermediate of Arts credential preserved');
assert(aboutCode.includes('Baba Nawbat Choudhry Surtapur Kundesar Ghazipur'), 'UP Board institution preserved');
assert(aboutCode.includes('UP Board'), 'UP Board badge preserved');
assert(aboutCode.includes('Matriculation (10th Standard)'), 'Matriculation credential preserved');
assert(aboutCode.includes('Radha Govind Public School Ramgarh Cant'), 'CBSE Board institution preserved');
assert(aboutCode.includes('CBSE Board'), 'CBSE Board badge preserved');

// --- 8. OFFICIAL BIO-DATA PRESERVATION ---
console.log('\n--- 8. Official Bio-Data Demographics Preservation ---');
assert(aboutCode.includes('Late Niranjan Prasad'), "Father's name 'Late Niranjan Prasad' preserved");
assert(aboutCode.includes('10.11.1991'), "Date of Birth '10.11.1991' preserved");
assert(aboutCode.includes('Indian • Single'), "Nationality & Status 'Indian • Single' preserved");
assert(aboutCode.includes('Hindi, Soft English'), "Languages Known 'Hindi, Soft English' preserved");
assert(aboutCode.includes('Daltonganj (Medininagar), Dist: Palamau, Pin: 822101, Jharkhand, India'), "Full address preserved");

// --- 9. ADVERSARIAL QA & ACCESSIBILITY HARDENING ---
console.log('\n--- 9. Adversarial QA, WAI-ARIA & Layout Stability ---');
assert(aboutCode.includes('tabIndex={0}'), 'Tabpanel declares tabIndex={0} for keyboard and screen reader accessibility');
assert(aboutCode.includes('tabButtonRefs'), 'Tab buttons maintain ref registry for keyboard focus management');
assert(aboutCode.includes('.focus()'), 'Keyboard navigation programmatically moves DOM focus to target tab button');
assert(aboutCode.includes('fallbackCopyText'), 'Copy address contains robust fallback when navigator.clipboard is unavailable');
assert(aboutCode.includes('min-h-[44px]'), 'Tab buttons satisfy WCAG 44px minimum touch target height');
assert(aboutCode.includes('min-h-[560px]'), 'Tab panels container has stabilized baseline min-height to eliminate layout shift');
assert(
  searchCatalogCode.includes('biodata') && searchCatalogCode.includes('qualifications') && searchCatalogCode.includes('vision'),
  'Command Palette search catalog indexes keywords for all 3 About tabs'
);

// --- 10. ADVERSARIAL EDGE CASES & BOUNDARY QA (ROUND 2) ---
console.log('\n--- 10. Adversarial Edge Cases & Boundary QA (Round 2) ---');
assert(aboutCode.includes('aria-orientation="horizontal"'), 'Tablist declares explicit aria-orientation="horizontal"');
assert(aboutCode.includes("e.key === 'ArrowDown'"), 'ArrowDown navigates focus directly from tablist into active tabpanel');
assert(aboutCode.includes('copyTimeoutRef'), 'Copy address feedback utilizes ref-based timer cleanup against memory leaks');
assert(aboutCode.includes('setSelectionRange'), 'Clipboard fallback utilizes setSelectionRange for WebKit/iOS compatibility');
assert(
  aboutCode.indexOf('if (moveFocus)') < aboutCode.indexOf('if (tabId === activeTab) return;'),
  'handleTabChange executes moveFocus before activeTab short-circuit so boundary keys (Home/End) always acquire focus'
);
assert(aboutCode.includes("'Marital Status & Nationality'"), 'Bio-data explicitly displays "Marital Status" in demographic label');

// --- 11. ADVERSARIAL EDGE CASES & BIDIRECTIONAL ARIA NAVIGATION (ROUND 3) ---
console.log('\n--- 11. Adversarial Edge Cases & Bidirectional ARIA Navigation (Round 3) ---');
assert(aboutCode.includes('handlePanelKeyDown'), 'handlePanelKeyDown implemented for bidirectional panel-to-tablist navigation');
assert(aboutCode.includes("e.key === 'ArrowUp'"), 'ArrowUp key on tabpanel returns focus directly to active tab button');
assert(aboutCode.includes('onKeyDown={handlePanelKeyDown}'), 'All tab panels wire onKeyDown for keyboard accessibility loop');
assert(aboutCode.includes('finally'), 'fallbackCopyText uses finally block to guarantee removal of temporary DOM elements');
assert(
  aboutCode.includes('hover:bg-[#FFF0F3]') && aboutCode.includes('border-[#FFD1DC]'),
  'Copy address button strictly adheres to warm coral design tokens (#FFF0F3, #FFD1DC)'
);

console.log('\n====================================================');
console.log(`TEST SUMMARY: ${passedTests} passed, ${failedTests} failed.`);
console.log('====================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

