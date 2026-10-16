import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('========================================================');
console.log('EMPTY STATE & ROLE ISOLATION VERIFICATION SUITE');
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

// 1. RoleContext verification
test('RoleContext defines OTHER_ROLE with empty heroTitle/heroSubtitle and isOther flag', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/context/RoleContext.jsx'), 'utf-8');
  assert(content.includes("id: 'other'"), 'Role other defined');
  assert(content.includes("heroTitle: ''"), 'Hero title is empty');
  assert(content.includes("heroSubtitle: ''"), 'Hero subtitle is empty');
  assert(content.includes("isOther: true"), 'isOther flag is true');
  assert(content.includes("isOther: activeRole === 'other'"), 'context value provides isOther boolean');
});

// 2. RoleEmptyState component verified eliminated from all 5 main sections
test('RoleEmptyState component is completely eliminated from all 5 role-based sections', () => {
  const achContent = fs.readFileSync(path.join(rootDir, 'src/components/CodingAchievementsSection.jsx'), 'utf-8');
  assert(!achContent.includes('RoleEmptyState'), 'CodingAchievementsSection eliminated RoleEmptyState');

  const aboutContent = fs.readFileSync(path.join(rootDir, 'src/components/AboutSection.jsx'), 'utf-8');
  assert(!aboutContent.includes('RoleEmptyState'), 'AboutSection eliminated RoleEmptyState');

  const skillsContent = fs.readFileSync(path.join(rootDir, 'src/components/SkillsSection.jsx'), 'utf-8');
  assert(!skillsContent.includes('RoleEmptyState'), 'SkillsSection eliminated RoleEmptyState');

  const expContent = fs.readFileSync(path.join(rootDir, 'src/components/ExperienceSection.jsx'), 'utf-8');
  assert(!expContent.includes('RoleEmptyState'), 'ExperienceSection eliminated RoleEmptyState');

  const projContent = fs.readFileSync(path.join(rootDir, 'src/components/ProjectsSection.jsx'), 'utf-8');
  assert(!projContent.includes('RoleEmptyState'), 'ProjectsSection eliminated RoleEmptyState');
});

// 3. HeroSection verification when other is selected
test('HeroSection omits heroTitle and heroSubtitle when role is other (no text rendered)', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/HeroSection.jsx'), 'utf-8');
  assert(content.includes('Boolean(activeTrack?.heroTitle || activeTrack?.heroSubtitle)'), 'Guarded by Boolean check');
  assert(content.includes('activeTrack?.heroTitle &&'), 'heroTitle rendered conditionally');
  assert(content.includes('activeTrack?.heroSubtitle &&'), 'heroSubtitle rendered conditionally');
});

// 4. AboutSection renders 100% native OTHER_COMPETENCIES and OTHER_STORY when isOther
test('AboutSection renders 100% native OTHER_COMPETENCIES and OTHER_STORY when isOther', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/AboutSection.jsx'), 'utf-8');
  assert(content.includes('OTHER_COMPETENCIES'), 'OTHER_COMPETENCIES defined');
  assert(content.includes('OTHER_STORY'), 'OTHER_STORY defined');
  assert(!content.includes('RoleEmptyState'), 'No RoleEmptyState');
});

// 5. SkillsSection renders 100% native OTHER_CATEGORIES when isOther
test('SkillsSection renders 100% native OTHER_CATEGORIES when isOther', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/SkillsSection.jsx'), 'utf-8');
  assert(content.includes('OTHER_CATEGORIES'), 'OTHER_CATEGORIES defined');
  assert(content.includes('Strategy & Leadership'), 'Strategy & Leadership category present');
  assert(!content.includes('RoleEmptyState'), 'No RoleEmptyState');
});

// 6. ExperienceSection renders 100% native OTHER_ROLES when isOther
test('ExperienceSection renders 100% native OTHER_ROLES when isOther', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/ExperienceSection.jsx'), 'utf-8');
  assert(content.includes('OTHER_ROLES'), 'OTHER_ROLES defined');
  assert(content.includes('exp-other-01'), 'exp-other-01 defined');
  assert(!content.includes('RoleEmptyState'), 'No RoleEmptyState');
});

// 7. ProjectsSection renders 100% native OTHER_PROJECTS when isOther
test('ProjectsSection renders 100% native OTHER_PROJECTS when isOther', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/ProjectsSection.jsx'), 'utf-8');
  assert(content.includes('OTHER_PROJECTS'), 'OTHER_PROJECTS defined');
  assert(content.includes('Enterprise Workflow Transformation Initiative'), 'Project 05 defined');
  assert(!content.includes('RoleEmptyState'), 'No RoleEmptyState');
});

// 8. Common sections remain intact across all roles
test('Common components (Navbar, ResumeDropdown, ContactSection, Footer) remain intact and operational', () => {
  const appContent = fs.readFileSync(path.join(rootDir, 'src/App.jsx'), 'utf-8');
  assert(appContent.includes('<Navbar'), 'Navbar mounted in App.jsx');
  assert(appContent.includes('<ContactSection />'), 'ContactSection mounted in App.jsx');
  assert(appContent.includes('<Footer />'), 'Footer mounted in App.jsx');
  
  const navContent = fs.readFileSync(path.join(rootDir, 'src/components/Navbar.jsx'), 'utf-8');
  assert(navContent.includes('ResumeDropdown'), 'ResumeDropdown rendered inside Navbar');
  assert(navContent.includes('variant="navbar"'), 'RoleTabsBar embedded inside Navbar');
  assert(navContent.includes('CommandPalette'), 'CommandPalette accessible from Navbar');

  const contactContent = fs.readFileSync(path.join(rootDir, 'src/components/ContactSection.jsx'), 'utf-8');
  assert(contactContent.includes("Let's build"), 'Contact heading part 1 intact');
  assert(contactContent.includes('something'), 'Contact heading part 2 intact');
  assert(contactContent.includes('meaningful'), 'Contact heading part 3 intact');
});

// 9. Accountant and MIS data tracks load without regressions
test('Accountant and MIS data tracks preserve full dataset and partitions', () => {
  const expContent = fs.readFileSync(path.join(rootDir, 'src/components/ExperienceSection.jsx'), 'utf-8');
  assert(expContent.includes("ACCOUNTANT_ROLES = ['exp-01', 'exp-02', 'exp-04']"), 'Accountant roles partition verified');
  assert(expContent.includes("MIS_ROLES = ['exp-03', 'exp-05', 'exp-06']"), 'MIS roles partition verified');

  const projContent = fs.readFileSync(path.join(rootDir, 'src/components/ProjectsSection.jsx'), 'utf-8');
  assert(projContent.includes("activeRole === 'accountant'"), 'Accountant project view present');
  assert(projContent.includes("COMPANION_PROJECTS"), 'MIS projects array COMPANION_PROJECTS present');
  assert(projContent.includes("proj-gst-tax"), 'Accountant flagship 1 verified');
  assert(projContent.includes("proj-tally-accounting"), 'Accountant flagship 2 verified');
  assert(projContent.includes("proj-day-nulm"), 'MIS flagship 1 verified');
  assert(projContent.includes("proj-smart-card"), 'MIS flagship 2 verified');

  const skillsContent = fs.readFileSync(path.join(rootDir, 'src/components/SkillsSection.jsx'), 'utf-8');
  assert(skillsContent.includes("ACCOUNTANT_CATEGORIES"), 'Accountant skill categories present');
  assert(skillsContent.includes("MIS_CATEGORIES"), 'MIS skill categories present');

  const aboutContent = fs.readFileSync(path.join(rootDir, 'src/components/AboutSection.jsx'), 'utf-8');
  assert(aboutContent.includes("ACCOUNTANT_STORY"), 'Accountant story narrative present');
  assert(aboutContent.includes("MIS_STORY"), 'MIS story narrative present');
  assert(aboutContent.includes("ACCOUNTANT_COMPETENCIES"), 'Accountant competencies present');
  assert(aboutContent.includes("MIS_COMPETENCIES"), 'MIS competencies present');
});

console.log('\n========================================================');
console.log(`TEST SUMMARY: ${passCount} passed, ${failCount} failed.`);
console.log('========================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL EMPTY STATE & ROLE ISOLATION TESTS PASSED 100% PERFECTLY!\n');
}
