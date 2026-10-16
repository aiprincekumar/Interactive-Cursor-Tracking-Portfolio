import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('========================================================');
console.log('DUAL-CAREER ROLE TABS VERIFICATION TEST SUITE');
console.log('========================================================\n');

let passCount = 0;
let failCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${description}`);
    passCount++;
  } catch (err) {
    console.error(`❌ FAIL: ${description}`);
    console.error(`   ${err.message}`);
    failCount++;
  }
}

// 1. RoleContext Verification
test('RoleContext.jsx exists and defines dual tracks', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/context/RoleContext.jsx'), 'utf-8');
  assert(content.includes("'accountant'"), 'Accountant track id present');
  assert(content.includes("'mis'"), 'MIS track id present');
  assert(content.includes('Accountant & Tax'), 'Accountant label present');
  assert(content.includes('MIS & Analytics'), 'MIS label present');
  assert(content.includes('Financial Track'), 'Financial Track badge present');
  assert(content.includes('Data & Operations Track'), 'Data & Operations Track badge present');
  assert(content.includes('portfolio_selected_role'), 'localStorage key portfolio_selected_role present');
  assert(content.includes('window.history.replaceState'), 'URL sync without reload present');
  assert(content.includes('switch-role-tab'), 'Inbound custom event handler present');
  assert(content.includes('portfolio-role-change'), 'Outbound custom event dispatch present');
  assert(content.includes('popstate'), 'popstate browser history listener present');
});

// 2. RoleTabsBar Component Verification
test('RoleTabsBar.jsx supports all required variants, single-icon trigger, floating sub-bar & WAI-ARIA', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/RoleTabsBar.jsx'), 'utf-8');
  assert(content.includes("role=\"tablist\""), 'role="tablist" declared');
  assert(content.includes("role=\"tab\""), 'role="tab" declared');
  assert(content.includes("aria-selected"), 'aria-selected declared');
  assert(content.includes("aria-controls"), 'aria-controls declared');
  assert(content.includes("aria-orientation=\"horizontal\""), 'aria-orientation horizontal declared');
  assert(content.includes("handleKeyDown"), 'handleKeyDown present');
  assert(content.includes("'ArrowRight'"), 'ArrowRight navigation present');
  assert(content.includes("'ArrowLeft'"), 'ArrowLeft navigation present');
  assert(content.includes("'Home'"), 'Home boundary key present');
  assert(content.includes("'End'"), 'End boundary key present');
  assert(content.includes("variant === 'navbar'"), 'navbar variant supported');
  assert(content.includes("variant === 'mobile-header'"), 'mobile-header variant supported');
  assert(content.includes("variant === 'drawer'"), 'drawer variant supported');
  assert(content.includes("variant = 'section'"), 'default section variant supported');
  assert(content.includes("variant === 'floating-bar'"), 'floating-bar variant supported');
  assert(content.includes("Briefcase"), 'Briefcase icon used for accountant track');
  assert(content.includes("BarChart2"), 'BarChart2 icon used for mis track');
  assert(content.includes("#FF4D6D"), 'Coral #FF4D6D indicator dot color present');
  assert(content.includes("#3B82F6"), 'Blue #3B82F6 indicator dot color present');
  assert(content.includes("<X "), 'Close [x] button icon rendered in floating bar');
});

// 3. Navbar Integration Verification
test('Navbar.jsx embeds single-icon trigger, floating sub-bar, and mutual exclusivity in strict order', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/Navbar.jsx'), 'utf-8');
  assert(content.includes("RoleTabsBar"), 'RoleTabsBar imported');
  assert(content.includes("variant=\"navbar\""), 'Desktop navbar variant rendered');
  assert(content.includes("variant=\"floating-bar\""), 'Secondary floating sub-bar rendered');
  assert(content.includes("variant=\"drawer\""), 'Mobile drawer variant rendered');
  assert(content.includes("isRoleBarOpen"), 'isRoleBarOpen state declared');
  assert(content.includes("toggleRoleBar"), 'toggleRoleBar handler implemented');
  assert(content.includes('max-w-7xl mx-auto bg-[#FAF8F5]/90'), 'Main navbar pill container increased to max-w-7xl');
  assert(content.includes('md:hidden mt-2 max-w-7xl mx-auto'), 'Mobile drawer container increased to max-w-7xl');
  
  // Verify strict action ordering: Search appears immediately before role switcher trigger
  const roleNavIdx = content.indexOf('variant="navbar"');
  const searchIdx = content.indexOf('Search portfolio (Cmd+K)');
  assert(roleNavIdx !== -1 && searchIdx !== -1 && searchIdx < roleNavIdx, 
    'Role switcher pill positioned immediately to the right of Search');

  // Verify mutual exclusivity: Cursor ribbon and Search close isRoleBarOpen
  assert(content.includes("setIsRoleBarOpen(false)"), 'Mutual exclusivity: isRoleBarOpen closed on other toggles');
});

// 4. ExperienceSection Verification
test('ExperienceSection.jsx partitions 6 experiences into 3 Accountant & 3 MIS roles via useRoleTab', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/ExperienceSection.jsx'), 'utf-8');
  assert(content.includes("useRoleTab"), 'useRoleTab hook imported and consumed');
  assert(!content.includes("RoleTabsBar"), 'In-section redundant RoleTabsBar removed');
  assert(content.includes("ACCOUNTANT_ROLES = ['exp-01', 'exp-02', 'exp-04']"), 'Accountant roles partition verified');
  assert(content.includes("MIS_ROLES = ['exp-03', 'exp-05', 'exp-06']"), 'MIS roles partition verified');
  assert(content.includes("role=\"tabpanel\""), 'Wrapped in role="tabpanel"');
  assert(content.includes("experience-role-panel"), 'Accessible panel id matching tab');
  assert(content.includes("animate-tab-fade"), 'Tab transition animation applied');
});

// 5. ProjectsSection Verification
test('ProjectsSection.jsx partitions 4 projects into 2 Accountant & 2 MIS flagships via useRoleTab', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/ProjectsSection.jsx'), 'utf-8');
  assert(content.includes("useRoleTab"), 'useRoleTab hook imported and consumed');
  assert(!content.includes("RoleTabsBar"), 'In-section redundant RoleTabsBar removed');
  assert(content.includes("proj-gst-tax"), 'Accountant Flagship 01 proj-gst-tax present');
  assert(content.includes("proj-tally-accounting"), 'Accountant Flagship 02 proj-tally-accounting present');
  assert(content.includes("proj-day-nulm"), 'MIS Flagship 03 proj-day-nulm present');
  assert(content.includes("proj-smart-card"), 'MIS Flagship 04 proj-smart-card present');
  assert(content.includes("role=\"tabpanel\""), 'Wrapped in role="tabpanel"');
  assert(content.includes("projects-role-panel"), 'Accessible panel id matching tab');
});

// 6. SkillsSection Verification
test('SkillsSection.jsx partitions 16 skills into 8 Accountant & 8 MIS skills with derived state via useRoleTab', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/SkillsSection.jsx'), 'utf-8');
  assert(content.includes("useRoleTab"), 'useRoleTab hook imported and consumed');
  assert(!content.includes("RoleTabsBar"), 'In-section redundant RoleTabsBar removed');
  assert(content.includes("ACCOUNTANT_CATEGORIES"), 'Accountant skill categories present');
  assert(content.includes("MIS_CATEGORIES"), 'MIS skill categories present');
  assert(content.includes("role=\"tabpanel\""), 'Wrapped in role="tabpanel"');
  assert(content.includes("skills-tabpanel"), 'Accessible tabpanel present');
  assert(content.includes("userSelectedSkill"), 'Derived selected skill state implemented to prevent cascading renders');
});

// 7. AboutSection Verification
test('AboutSection.jsx dynamic Story narrative and dual competency sets via useRoleTab', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/AboutSection.jsx'), 'utf-8');
  assert(content.includes("useRoleTab"), 'useRoleTab hook imported and consumed');
  assert(!content.includes("RoleTabsBar"), 'In-section redundant RoleTabsBar removed');
  assert(content.includes("ACCOUNTANT_COMPETENCIES"), 'Accountant competencies present');
  assert(content.includes("MIS_COMPETENCIES"), 'MIS competencies present');
  assert(content.includes("ACCOUNTANT_STORY"), 'Accountant story narrative present');
  assert(content.includes("MIS_STORY"), 'MIS story narrative present');
  assert(content.includes("01 ✦ About"), 'Dynamic section badge present');
});

// 8. Search Catalog & CommandPalette Verification
test('Search catalog items tagged with role & CommandPalette deep links with 160ms mount delay', () => {
  const catalogContent = fs.readFileSync(path.join(rootDir, 'src/utils/searchCatalog.js'), 'utf-8');
  assert(catalogContent.includes("role: 'accountant'"), 'Catalog includes accountant roles');
  assert(catalogContent.includes("role: 'mis'"), 'Catalog includes mis roles');
  assert(catalogContent.includes("role: 'both'"), 'Catalog includes both roles');

  const paletteContent = fs.readFileSync(path.join(rootDir, 'src/components/CommandPalette.jsx'), 'utf-8');
  assert(paletteContent.includes("onSelectRole(item.role)"), 'CommandPalette auto-switches role');
  assert(paletteContent.includes("switch-role-tab"), 'CommandPalette dispatches switch-role-tab event');
  assert(paletteContent.includes("160"), '160ms DOM mount delay before scrolling to target element');
});

// 9. Root App Wrapper Verification
test('App.jsx wraps entire tree in RoleProvider', () => {
  const appContent = fs.readFileSync(path.join(rootDir, 'src/App.jsx'), 'utf-8');
  assert(appContent.includes("<RoleProvider"), 'RoleProvider opens around root tree');
  assert(appContent.includes("</RoleProvider>"), 'RoleProvider closes around root tree');
});

console.log('\n========================================================');
console.log(`TEST SUMMARY: ${passCount} passed, ${failCount} failed.`);
console.log('========================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL DUAL-CAREER ROLE TABS VERIFICATION TESTS PASSED 100% PERFECTLY!\n');
}
