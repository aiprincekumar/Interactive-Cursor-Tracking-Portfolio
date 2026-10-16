import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('====================================================================');
console.log('100% NATIVE SECTION CARDS & ZERO EMPTY STATE VERIFICATION SUITE');
console.log('====================================================================\n');

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

const sectionFiles = [
  'src/components/AboutSection.jsx',
  'src/components/SkillsSection.jsx',
  'src/components/ExperienceSection.jsx',
  'src/components/ProjectsSection.jsx',
  'src/components/CodingAchievementsSection.jsx'
];

// 1. Elimination of RoleEmptyState across all sections
test('1. RoleEmptyState is NOT imported or rendered in any of the 5 role-based sections', () => {
  for (const relPath of sectionFiles) {
    const content = fs.readFileSync(path.join(rootDir, relPath), 'utf-8');
    assert(!content.includes('RoleEmptyState'), `RoleEmptyState found in ${relPath}`);
    assert(!content.includes('./RoleEmptyState'), `RoleEmptyState import found in ${relPath}`);
  }
});

// 2. Global check for RoleEmptyState usages across src/
test('2. RoleEmptyState is NOT used anywhere in src/ (0 active usages)', () => {
  const srcDir = path.join(rootDir, 'src');
  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.jsx') || entry.name.endsWith('.js'))) {
        if (entry.name === 'RoleEmptyState.jsx') continue;
        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        assert(!fileContent.includes('RoleEmptyState'), `RoleEmptyState referenced in ${fullPath}`);
      }
    }
  }
  scanDir(srcDir);
});

// 3. AboutSection Native 'other' role implementation
test('3. AboutSection renders OTHER_STORY and OTHER_COMPETENCIES natively for "other" role with 4 capability cards', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/AboutSection.jsx'), 'utf-8');
  assert(content.includes('OTHER_COMPETENCIES'), 'OTHER_COMPETENCIES defined');
  assert(content.includes('OTHER_STORY'), 'OTHER_STORY defined');
  assert(content.includes('Cross-Functional Strategy'), 'Card 1: Cross-Functional Strategy present');
  assert(content.includes('Operations Governance'), 'Card 2: Operations Governance present');
  assert(content.includes('Stakeholder Management'), 'Card 3: Stakeholder Management present');
  assert(content.includes('Business Transformation'), 'Card 4: Business Transformation present');
  assert(content.includes("isOther ? OTHER_COMPETENCIES : (isMIS ? MIS_COMPETENCIES : ACCOUNTANT_COMPETENCIES)"), 'Competencies dynamically selected for role');
  assert(content.includes("isOther ? OTHER_STORY : (isMIS ? MIS_STORY : ACCOUNTANT_STORY)"), 'Story dynamically selected for role');
  assert(content.includes("Multidisciplinary Operations & Strategy Specialist"), 'BioData professional role handles isOther');
  assert(content.includes("isOther ? '#8B5CF6'"), 'Plum/purple accent color assigned for other role');
});

// 4. SkillsSection Native 'other' role implementation
test('4. SkillsSection renders OTHER_CATEGORIES and skills matrix natively for "other" role', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/SkillsSection.jsx'), 'utf-8');
  assert(content.includes('OTHER_CATEGORIES'), 'OTHER_CATEGORIES defined');
  assert(content.includes('Strategy & Leadership'), 'Category: Strategy & Leadership present');
  assert(content.includes('Operations Optimization'), 'Category: Operations Optimization present');
  assert(content.includes('Strategic Operations & Governance'), 'Skill: Strategic Operations & Governance present');
  assert(content.includes('Process Automation & Workflows'), 'Skill: Process Automation & Workflows present');
  assert(content.includes('Cross-Functional Consulting'), 'Skill: Cross-Functional Consulting present');
  assert(content.includes('Executive Problem Solving'), 'Skill: Executive Problem Solving present');
  assert(content.includes('Vendor & Stakeholder Relations'), 'Skill: Vendor & Stakeholder Relations present');
  assert(content.includes('Cost Optimization & Budgeting'), 'Skill: Cost Optimization & Budgeting present');
  assert(content.includes("isOther ? OTHER_CATEGORIES : (isMIS ? MIS_CATEGORIES : ACCOUNTANT_CATEGORIES)"), 'Categories dynamically mapped');
  assert(content.includes("defaultSkill = isOther ? 'Strategic Operations & Governance'"), 'defaultSkill properly set for other role');
});

// 5. ExperienceSection Native 'other' role implementation
test('5. ExperienceSection renders OTHER_ROLES natively for "other" role', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/ExperienceSection.jsx'), 'utf-8');
  assert(content.includes('OTHER_ROLES'), 'OTHER_ROLES defined');
  assert(content.includes('exp-other-01'), 'exp-other-01 defined');
  assert(content.includes('exp-other-02'), 'exp-other-02 defined');
  assert(content.includes('exp-other-03'), 'exp-other-03 defined');
  assert(content.includes('Multidisciplinary Business & Tax Consultant'), 'Role: Multidisciplinary Business & Tax Consultant present');
  assert(content.includes('Operations & Workflow Management Lead'), 'Role: Operations & Workflow Management Lead present');
  assert(content.includes('Executive Administrator & Public Programs Lead'), 'Role: Executive Administrator & Public Programs Lead present');
  assert(content.includes('OTHER_ROLES.includes(exp.id)'), 'Filter checks OTHER_ROLES for isOther');
});

// 6. ProjectsSection Native 'other' role implementation
test('6. ProjectsSection renders OTHER_PROJECTS natively with interactive mockups, metrics, tags for "other" role', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/ProjectsSection.jsx'), 'utf-8');
  assert(content.includes('OTHER_PROJECTS'), 'OTHER_PROJECTS defined');
  assert(content.includes('Enterprise Workflow Transformation Initiative'), 'Project 05 title present');
  assert(content.includes('Strategic Business Operations Advisory'), 'Project 06 title present');
  assert(content.includes('+45%'), 'Process efficiency metric present');
  assert(content.includes('₹35L+'), 'Cost optimization metric present');
  assert(content.includes('Workflow Automation'), 'Tag present');
  assert(content.includes('simulateSync') || content.includes('runWorkflowSimulation'), 'Interactive simulation capability present');
  assert(content.includes('cycleGovernanceState'), 'Interactive governance state capability present');
  assert(content.includes('isOther || activeRole === \'other\''), 'Condition for rendering other role projects present');
});

// 7. CodingAchievementsSection Native 'other' role implementation
test('7. CodingAchievementsSection renders OTHER_STATS, ticker items, and bottom banner for "other" role', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src/components/CodingAchievementsSection.jsx'), 'utf-8');
  assert(content.includes('OTHER_STATS'), 'OTHER_STATS defined');
  assert(content.includes('OTHER_TICKER_ITEMS'), 'OTHER_TICKER_ITEMS defined');
  assert(content.includes('100%'), '100% Governance stat present');
  assert(content.includes('15+'), '15+ Engagements stat present');
  assert(content.includes('99.5%'), '99.5% Delivery stat present');
  assert(content.includes('7+ Years'), '7+ Years Experience stat present');
  assert(content.includes('MULTIDISCIPLINARY LEADERSHIP'), 'Bottom banner header present');
  assert(content.includes('Multidisciplinary Lead'), 'Badge present');
  assert(content.includes("isOther ? OTHER_STATS : isMIS ? MIS_STATS : ACCOUNTANT_STATS"), 'Stats dynamically mapped');
  assert(content.includes("isOther ? OTHER_TICKER_ITEMS : isMIS ? MIS_TICKER_ITEMS : ACCOUNTANT_TICKER_ITEMS"), 'Ticker dynamically mapped');
});

// 8. Regression test: Accountant and MIS tracks remain 100% intact
test('8. Regression check: Accountant and MIS tracks retain all native datasets and functionality', () => {
  const about = fs.readFileSync(path.join(rootDir, 'src/components/AboutSection.jsx'), 'utf-8');
  assert(about.includes('ACCOUNTANT_COMPETENCIES') && about.includes('MIS_COMPETENCIES'), 'About retains Accountant & MIS competencies');
  assert(about.includes('ACCOUNTANT_STORY') && about.includes('MIS_STORY'), 'About retains Accountant & MIS stories');

  const skills = fs.readFileSync(path.join(rootDir, 'src/components/SkillsSection.jsx'), 'utf-8');
  assert(skills.includes('ACCOUNTANT_CATEGORIES') && skills.includes('MIS_CATEGORIES'), 'Skills retains Accountant & MIS categories');
  assert(skills.includes('Tally Prime & ERP 9') && skills.includes('MIS Reporting & Analytics'), 'Skills retains default skills');

  const exp = fs.readFileSync(path.join(rootDir, 'src/components/ExperienceSection.jsx'), 'utf-8');
  assert(exp.includes('ACCOUNTANT_ROLES') && exp.includes('MIS_ROLES'), 'Experience retains Accountant & MIS roles');
  assert(exp.includes('exp-01') && exp.includes('exp-03'), 'Experience retains original IDs');

  const proj = fs.readFileSync(path.join(rootDir, 'src/components/ProjectsSection.jsx'), 'utf-8');
  assert(proj.includes('COMPANION_PROJECTS'), 'Projects retains companion projects');
  assert(proj.includes('GST &amp; Income Tax Compliance') || proj.includes('GST & Income Tax Compliance'), 'Project 01 retained');
  assert(proj.includes('Tally Financial Accounting &amp; Inventory Management') || proj.includes('proj-tally-accounting'), 'Project 02 retained');

  const ach = fs.readFileSync(path.join(rootDir, 'src/components/CodingAchievementsSection.jsx'), 'utf-8');
  assert(ach.includes('ACCOUNTANT_STATS') && ach.includes('MIS_STATS'), 'Achievements retains Accountant & MIS stats');
  assert(ach.includes('ACCOUNTANT_TICKER_ITEMS') && ach.includes('MIS_TICKER_ITEMS'), 'Achievements retains Accountant & MIS ticker items');
});

console.log(`\nVerification complete: ${passCount} passed, ${failCount} failed.`);
if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
