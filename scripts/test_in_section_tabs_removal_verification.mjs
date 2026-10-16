import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('========================================================');
console.log('COMPLETE REMOVAL OF IN-SECTION ROLE TABS VERIFICATION');
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

// 1. In-section RoleTabsBar removal verification
const sectionFiles = [
  { name: 'AboutSection', file: 'src/components/AboutSection.jsx' },
  { name: 'SkillsSection', file: 'src/components/SkillsSection.jsx' },
  { name: 'ExperienceSection', file: 'src/components/ExperienceSection.jsx' },
  { name: 'ProjectsSection', file: 'src/components/ProjectsSection.jsx' },
  { name: 'CodingAchievementsSection', file: 'src/components/CodingAchievementsSection.jsx' },
  { name: 'HeroSection', file: 'src/components/HeroSection.jsx' }
];

sectionFiles.forEach(({ name, file }) => {
  test(`${name} does NOT import or render RoleTabsBar`, () => {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf-8');
    assert(!content.includes('RoleTabsBar'), `${name} must not contain RoleTabsBar`);
  });
});

// 2. Navbar single universal role switcher verification
test('Navbar.jsx remains the single universal role switcher', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/Navbar.jsx'), 'utf-8');
  assert(content.includes("import RoleTabsBar from './RoleTabsBar';"), 'Navbar imports RoleTabsBar');
  assert(content.includes('variant="navbar"'), 'Navbar has desktop switcher trigger');
  assert(content.includes('variant="floating-bar"'), 'Navbar has secondary floating sub-bar');
  assert(content.includes('variant="drawer"'), 'Navbar has mobile drawer switcher');
  assert(content.includes('isRoleBarOpen'), 'Navbar manages sub-bar state');
});

// 3. Reactivity across all sections
test('All sections consume useRoleTab and respond dynamically', () => {
  // HeroSection
  const heroContent = fs.readFileSync(path.join(rootDir, 'src/components/HeroSection.jsx'), 'utf-8');
  assert(heroContent.includes('useRoleTab'), 'HeroSection uses useRoleTab');
  assert(heroContent.includes('activeTrack?.heroTitle'), 'HeroSection binds dynamic heroTitle');
  assert(heroContent.includes('activeTrack?.heroSubtitle'), 'HeroSection binds dynamic heroSubtitle');

  // AboutSection
  const aboutContent = fs.readFileSync(path.join(rootDir, 'src/components/AboutSection.jsx'), 'utf-8');
  assert(aboutContent.includes('useRoleTab'), 'AboutSection uses useRoleTab');
  assert(aboutContent.includes('ACCOUNTANT_COMPETENCIES'), 'AboutSection has accountant competencies');
  assert(aboutContent.includes('MIS_COMPETENCIES'), 'AboutSection has MIS competencies');
  assert(aboutContent.includes('OTHER_COMPETENCIES'), 'AboutSection renders native OTHER_COMPETENCIES on other');

  // SkillsSection
  const skillsContent = fs.readFileSync(path.join(rootDir, 'src/components/SkillsSection.jsx'), 'utf-8');
  assert(skillsContent.includes('useRoleTab'), 'SkillsSection uses useRoleTab');
  assert(skillsContent.includes('ACCOUNTANT_CATEGORIES'), 'SkillsSection has accountant categories');
  assert(skillsContent.includes('MIS_CATEGORIES'), 'SkillsSection has MIS categories');
  assert(skillsContent.includes('OTHER_CATEGORIES'), 'SkillsSection renders native OTHER_CATEGORIES on other');

  // ExperienceSection
  const expContent = fs.readFileSync(path.join(rootDir, 'src/components/ExperienceSection.jsx'), 'utf-8');
  assert(expContent.includes('useRoleTab'), 'ExperienceSection uses useRoleTab');
  assert(expContent.includes('ACCOUNTANT_ROLES'), 'ExperienceSection filters accountant roles');
  assert(expContent.includes('MIS_ROLES'), 'ExperienceSection filters MIS roles');
  assert(expContent.includes('OTHER_ROLES'), 'ExperienceSection renders native OTHER_ROLES on other');

  // ProjectsSection
  const projContent = fs.readFileSync(path.join(rootDir, 'src/components/ProjectsSection.jsx'), 'utf-8');
  assert(projContent.includes('useRoleTab'), 'ProjectsSection uses useRoleTab');
  assert(projContent.includes("activeRole === 'accountant'"), 'ProjectsSection filters accountant projects');
  assert(projContent.includes("activeRole === 'mis'"), 'ProjectsSection filters MIS projects');
  assert(projContent.includes('OTHER_PROJECTS'), 'ProjectsSection renders native OTHER_PROJECTS on other');

  // CodingAchievementsSection
  const achContent = fs.readFileSync(path.join(rootDir, 'src/components/CodingAchievementsSection.jsx'), 'utf-8');
  assert(achContent.includes('useRoleTab'), 'CodingAchievementsSection uses useRoleTab');
  assert(achContent.includes('ACCOUNTANT_STATS'), 'CodingAchievementsSection has accountant stats');
  assert(achContent.includes('MIS_STATS'), 'CodingAchievementsSection has MIS stats');
  assert(achContent.includes('OTHER_STATS'), 'CodingAchievementsSection renders native OTHER_STATS on other');
});

// 4. RoleEmptyState pure informational guidance verification
test('RoleEmptyState.jsx contains no action buttons, only clear informational guidance', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/RoleEmptyState.jsx'), 'utf-8');
  assert(!content.includes('<button'), 'RoleEmptyState must not contain <button> elements');
  assert(!content.includes('onClick'), 'RoleEmptyState must not contain onClick handlers');
  assert(!content.includes('Switch to'), 'RoleEmptyState must not contain switch buttons');
  assert(content.includes('This custom role profile is currently being curated. Please select a defined role from the top navigation bar to explore detailed credentials.'),
    'RoleEmptyState contains clear informational guidance pointing to top navigation bar');
  assert(content.includes('Information Coming Soon'), 'RoleEmptyState contains informational heading');
});

console.log('\n========================================================');
console.log(`TEST SUMMARY: ${passCount} passed, ${failCount} failed.`);
console.log('========================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL IN-SECTION ROLE TABS REMOVAL VERIFICATION TESTS PASSED 100% PERFECTLY!\n');
}
