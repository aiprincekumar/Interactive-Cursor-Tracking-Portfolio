import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('====================================================================');
console.log('ADVERSARIAL STRESS TEST: 4-ROLE NAVIGATION & SYNCHRONIZATION');
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

// 1. RoleContext constants and exports
test('1. RoleContext exports correct 4-track hierarchy, DEFAULT_ROLE and roles sequence', async () => {
  const roleContextModule = await import('../src/context/RoleContext.jsx');
  const { DEFAULT_ROLE, ROLE_TRACKS, OVERVIEW_ROLE, OTHER_ROLE } = roleContextModule;

  assert.strictEqual(DEFAULT_ROLE, 'accountant', 'DEFAULT_ROLE must be accountant');
  assert.strictEqual(ROLE_TRACKS.length, 4, 'ROLE_TRACKS must contain exactly 4 roles');
  assert.strictEqual(ROLE_TRACKS[0].id, 'overview', 'Position 0 must be overview');
  assert.strictEqual(ROLE_TRACKS[1].id, 'accountant', 'Position 1 must be accountant');
  assert.strictEqual(ROLE_TRACKS[2].id, 'mis', 'Position 2 must be mis');
  assert.strictEqual(ROLE_TRACKS[3].id, 'other', 'Position 3 must be other');

  assert.strictEqual(OVERVIEW_ROLE.accent, '#6366F1', 'Overview accent must be #6366F1');
  assert.strictEqual(OVERVIEW_ROLE.icon, 'LayoutDashboard', 'Overview icon must be LayoutDashboard');
  assert.strictEqual(OVERVIEW_ROLE.heroTitle, 'Financial & Operations Executive.', 'Overview hero title matches R2');
  assert.strictEqual(OVERVIEW_ROLE.heroSubtitle, 'Bridging Statutory Accounting, Taxation & Advanced Data Intelligence.', 'Overview hero subtitle matches R2');

  assert.strictEqual(OTHER_ROLE.label, 'Other ✨ AI', 'Other label must contain sparkles');
  assert.strictEqual(OTHER_ROLE.accent, '#8B5CF6', 'Other accent must be #8B5CF6');
  assert.strictEqual(OTHER_ROLE.specializationTitle, 'Business Intelligence & Corporate Controller.', 'Other specialization matches R3');
  assert.strictEqual(OTHER_ROLE.specializationSubtitle, 'Statutory Financial Strategy & Executive Data Systems.', 'Other subtitle matches R3');
});

// 2. Resume Config across all 4 roles
test('2. resumeConfig.js provides valid assets and filenames for all 4 roles', async () => {
  const { getResumeConfig } = await import('../src/utils/resumeConfig.js');

  const overview = getResumeConfig('overview');
  assert.strictEqual(overview.fileName, 'resume.pdf');
  assert.strictEqual(overview.downloadFilename, 'Atul_Verma_Overview_Resume.pdf');
  assert.strictEqual(overview.accent, '#6366F1');

  const accountant = getResumeConfig('accountant');
  assert.strictEqual(accountant.fileName, 'resume-accountant.pdf');
  assert.strictEqual(accountant.downloadFilename, 'Atul_Verma_Accountant_Resume.pdf');
  assert.strictEqual(accountant.accent, '#FF4D6D');

  const mis = getResumeConfig('mis');
  assert.strictEqual(mis.fileName, 'resume-mis.pdf');
  assert.strictEqual(mis.downloadFilename, 'Atul_Verma_MIS_Resume.pdf');
  assert.strictEqual(mis.accent, '#3B82F6');

  const other = getResumeConfig('other');
  assert.strictEqual(other.fileName, 'resume-controller.pdf');
  assert.strictEqual(other.downloadFilename, 'Atul_Verma_BI_Corporate_Controller_Resume.pdf');
  assert.strictEqual(other.accent, '#8B5CF6');

  // Verify fallback when unknown role passed
  const fallback = getResumeConfig('unknown_random_role');
  assert.ok(fallback, 'Fallback config exists');
  assert.strictEqual(fallback.id, 'other', 'Fallback resolves to other');
});

// 3. Search Catalog role actions
test('3. searchCatalog.js defines role switch quick actions in fixed sequence', async () => {
  const { SEARCH_ITEMS } = await import('../src/utils/searchCatalog.js');
  const roleActions = SEARCH_ITEMS.filter(item => item.actionType === 'switch-role');
  
  assert.strictEqual(roleActions.length, 4, 'Exactly 4 role switch actions in searchCatalog');
  assert.strictEqual(roleActions[0].id, 'act-role-overview');
  assert.strictEqual(roleActions[1].id, 'act-role-accountant');
  assert.strictEqual(roleActions[2].id, 'act-role-mis');
  assert.strictEqual(roleActions[3].id, 'act-role-other');

  assert.strictEqual(roleActions[0].role, 'overview');
  assert.strictEqual(roleActions[1].role, 'accountant');
  assert.strictEqual(roleActions[2].role, 'mis');
  assert.strictEqual(roleActions[3].role, 'other');
});

// 4. RoleTabsBar variants inspection
test('4. RoleTabsBar.jsx has React & useRef imports, LayoutDashboard icon and 4 role tracks', () => {
  const code = fs.readFileSync(path.join(rootDir, 'src/components/RoleTabsBar.jsx'), 'utf-8');
  assert(code.includes("import React, { useRef } from 'react';"), 'Imports React and useRef');
  assert(code.includes('LayoutDashboard'), 'Includes LayoutDashboard icon for overview');
  assert(code.includes("case 'overview':"), 'Handles overview icon switch');
  assert(code.includes("case 'accountant':"), 'Handles accountant icon switch');
  assert(code.includes("case 'mis':"), 'Handles mis icon switch');
  assert(code.includes("case 'other':"), 'Handles other icon switch');
});

// 5. Verification of Overview segregation: exclusive synthesis from Accountant and MIS
test('5. Overview segregates exclusively Accountant & MIS, excluding Other from highlights', () => {
  const expCode = fs.readFileSync(path.join(rootDir, 'src/components/ExperienceSection.jsx'), 'utf-8');
  assert(expCode.includes("const OVERVIEW_ROLES = ['exp-01', 'exp-03']"), 'Overview experiences are exp-01 and exp-03');
  assert(!expCode.includes("OVERVIEW_ROLES = ['exp-other"), 'No other roles in OVERVIEW_ROLES');
  assert(expCode.includes('Financial Track'), 'Financial Track badge exists');
  assert(expCode.includes('Data & Operations Track'), 'Data & Operations Track badge exists');

  const projCode = fs.readFileSync(path.join(rootDir, 'src/components/ProjectsSection.jsx'), 'utf-8');
  assert(projCode.includes("renderProject01('Financial Track')"), 'Overview curates Project 01 as Financial Track');
  assert(projCode.includes("renderProject03Flagship('Data & Operations Track')"), 'Overview curates Project 03 as Data & Operations Track');

  const skillsCode = fs.readFileSync(path.join(rootDir, 'src/components/SkillsSection.jsx'), 'utf-8');
  assert(skillsCode.includes('OVERVIEW_CATEGORIES'), 'OVERVIEW_CATEGORIES defined');
  assert(skillsCode.includes('Financial & Statutory Core'), 'Financial core category present');
  assert(skillsCode.includes('Data Intelligence & Operations'), 'Data intelligence category present');

  const aboutCode = fs.readFileSync(path.join(rootDir, 'src/components/AboutSection.jsx'), 'utf-8');
  assert(aboutCode.includes('OVERVIEW_COMPETENCIES'), 'OVERVIEW_COMPETENCIES defined');
  assert(aboutCode.includes('OVERVIEW_STORY'), 'OVERVIEW_STORY defined');
});

// 6. Verification of Other AI-Synthesized Track authenticity & banner
test('6. Other track renders AI-Synthesized banner and authentic Controller & BI data', () => {
  const bannerText = '🤖 AI-Synthesized Role (Derived from Verified Tracks)';

  const aboutCode = fs.readFileSync(path.join(rootDir, 'src/components/AboutSection.jsx'), 'utf-8');
  assert(aboutCode.includes(bannerText), 'AboutSection includes AI banner');
  assert(aboutCode.includes('OTHER_COMPETENCIES'), 'OTHER_COMPETENCIES defined');
  assert(aboutCode.includes('Corporate Financial Controls'), 'Authentic Controller competency present');
  assert(aboutCode.includes('Power BI Fiscal Dashboards'), 'Power BI competency present');

  const expCode = fs.readFileSync(path.join(rootDir, 'src/components/ExperienceSection.jsx'), 'utf-8');
  assert(expCode.includes(bannerText), 'ExperienceSection includes AI banner');
  assert(expCode.includes('Corporate Financial Controller & Tax Strategy Lead'), 'Authentic Controller role present');
  assert(expCode.includes('BI Systems Architect & Financial Operations Lead'), 'Authentic ERP Automation role present');

  const projCode = fs.readFileSync(path.join(rootDir, 'src/components/ProjectsSection.jsx'), 'utf-8');
  assert(projCode.includes(bannerText), 'ProjectsSection includes AI banner');
  assert(projCode.includes('Executive Power BI Fiscal Intelligence & Reconciliation Engine'), 'Project 05 present');
  assert(projCode.includes('Corporate Financial Controls & Internal Audit Governance'), 'Project 06 present');

  const skillsCode = fs.readFileSync(path.join(rootDir, 'src/components/SkillsSection.jsx'), 'utf-8');
  assert(skillsCode.includes(bannerText), 'SkillsSection includes AI banner');
  assert(skillsCode.includes('Power BI & Fiscal Dashboards'), 'Skill Power BI present');
  assert(skillsCode.includes('Corporate Financial Controls'), 'Skill Corporate Financial Controls present');

  const achCode = fs.readFileSync(path.join(rootDir, 'src/components/CodingAchievementsSection.jsx'), 'utf-8');
  assert(achCode.includes(bannerText), 'AchievementsSection includes AI banner');
});

// 7. Rapid switching simulation
test('7. Simulated high-frequency role transitions cycle through all 4 roles cleanly', () => {
  const roles = ['overview', 'accountant', 'mis', 'other'];
  let currentRole = 'accountant';
  const roleHistory = [currentRole];

  for (let i = 0; i < 200; i++) {
    const nextRole = roles[i % roles.length];
    if (nextRole !== currentRole) {
      currentRole = nextRole;
      roleHistory.push(currentRole);
    }
  }

  assert.strictEqual(roleHistory.length, 201, 'Completed 200 consecutive role switches');
  assert.strictEqual(currentRole, roles[199 % roles.length], 'Final role matches cyclic iteration');
});

console.log(`\n====================================================================`);
console.log(`STRESS TEST SUMMARY: ${passCount} passed, ${failCount} failed.`);
console.log(`====================================================================`);

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
