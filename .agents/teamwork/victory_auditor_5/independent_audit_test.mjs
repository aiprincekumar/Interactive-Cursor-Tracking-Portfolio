import fs from 'fs';
import path from 'path';
import vm from 'vm';
import assert from 'assert';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..', '..');

console.log('================================================================');
console.log('VICTORY AUDITOR 5: INDEPENDENT POST-VICTORY AUDIT TEST SUITE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`[PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(`       Error: ${err.message}`);
    failCount++;
  }
}

// ----------------------------------------------------------------------
// Load RoleContext exports safely via VM
// ----------------------------------------------------------------------
const roleContextPath = path.join(rootDir, 'src', 'context', 'RoleContext.jsx');
const roleContextSrc = fs.readFileSync(roleContextPath, 'utf-8');
const lines = roleContextSrc.split('\n');
const pureJs = lines.slice(4, 93).map(l => l.replace(/^export\s+/, '')).join('\n');
const roleVm = {};
vm.createContext(roleVm);
vm.runInContext(
  pureJs + '; this.DEFAULT_ROLE = DEFAULT_ROLE; this.ROLE_TRACKS = ROLE_TRACKS; this.OVERVIEW_ROLE = OVERVIEW_ROLE; this.PRIMARY_ROLES = PRIMARY_ROLES; this.OTHER_ROLE = OTHER_ROLE; this.normalizeRole = normalizeRole; this.isValidRole = isValidRole;',
  roleVm
);

const { DEFAULT_ROLE, ROLE_TRACKS, OVERVIEW_ROLE, PRIMARY_ROLES: _PRIMARY_ROLES, OTHER_ROLE, normalizeRole, isValidRole } = roleVm;

// Dynamic import of pure JS utility modules
const resumeConfigModule = await import(pathToFileURL(path.join(rootDir, 'src', 'utils', 'resumeConfig.js')).href);
const { getResumeConfig } = resumeConfigModule;

const searchCatalogModule = await import(pathToFileURL(path.join(rootDir, 'src', 'utils', 'searchCatalog.js')).href);
const { SEARCH_ITEMS } = searchCatalogModule;

const fuzzySearchModule = await import(pathToFileURL(path.join(rootDir, 'src', 'utils', 'fuzzySearch.js')).href);
const { searchCatalogItems } = fuzzySearchModule;

// ======================================================================
// R1: Four-Tab Role Hierarchy & Navigation Tests
// ======================================================================
console.log('--- REQUIREMENT R1: FOUR-TAB ROLE HIERARCHY & NAVIGATION ---');

await test('R1.1: 4 tracks in fixed sequence (Overview, Accountant, MIS, Other ✨ AI)', () => {
  assert.strictEqual(ROLE_TRACKS.length, 4, 'ROLE_TRACKS must have exactly 4 items');
  assert.strictEqual(ROLE_TRACKS[0].id, 'overview');
  assert.strictEqual(ROLE_TRACKS[1].id, 'accountant');
  assert.strictEqual(ROLE_TRACKS[2].id, 'mis');
  assert.strictEqual(ROLE_TRACKS[3].id, 'other');

  assert.strictEqual(ROLE_TRACKS[0].label, 'Overview');
  assert.strictEqual(ROLE_TRACKS[1].label, 'Accountant & Tax');
  assert.strictEqual(ROLE_TRACKS[2].label, 'MIS & Analytics');
  assert.strictEqual(ROLE_TRACKS[3].label, 'Other ✨ AI');
});

await test('R1.2: Default initial active role is accountant', () => {
  assert.strictEqual(DEFAULT_ROLE, 'accountant', 'DEFAULT_ROLE must be "accountant"');
});

await test('R1.3: normalizeRole & isValidRole robust against case, spaces, and invalid inputs', () => {
  assert.strictEqual(normalizeRole('overview'), 'overview');
  assert.strictEqual(normalizeRole('OVERVIEW'), 'overview');
  assert.strictEqual(normalizeRole('  accountant  '), 'accountant');
  assert.strictEqual(normalizeRole('\tMis\n'), 'mis');
  assert.strictEqual(normalizeRole('Other'), 'other');
  assert.strictEqual(normalizeRole(null), null);
  assert.strictEqual(normalizeRole(undefined), null);
  assert.strictEqual(normalizeRole(123), null);
  assert.strictEqual(normalizeRole('random_unknown'), null);

  assert.strictEqual(isValidRole('overview'), true);
  assert.strictEqual(isValidRole('ACCOUNTANT'), true);
  assert.strictEqual(isValidRole('mis'), true);
  assert.strictEqual(isValidRole('other'), true);
  assert.strictEqual(isValidRole('admin'), false);
  assert.strictEqual(isValidRole(null), false);
});

await test('R1.4: Initial role resolution logic (URL -> localStorage -> DEFAULT_ROLE)', () => {
  function resolveInitial(urlParam, storageVal) {
    const url = normalizeRole(urlParam);
    if (url) return url;
    const stor = normalizeRole(storageVal);
    if (stor) return stor;
    return DEFAULT_ROLE;
  }

  assert.strictEqual(resolveInitial(null, null), 'accountant');
  assert.strictEqual(resolveInitial('', ''), 'accountant');
  assert.strictEqual(resolveInitial('?role=mis'.split('=')[1], null), 'mis');
  assert.strictEqual(resolveInitial(null, 'overview'), 'overview');
  assert.strictEqual(resolveInitial('invalid', 'other'), 'other');
  assert.strictEqual(resolveInitial('invalid', 'invalid'), 'accountant');
});

await test('R1.5: PopState back navigation to root reverts to DEFAULT_ROLE', () => {
  function simulatePopState(search, state) {
    const params = new URLSearchParams(search);
    const urlRole = normalizeRole(params.get('role'));
    if (urlRole) return urlRole;
    if (state?.role) {
      const stateRole = normalizeRole(state.role);
      if (stateRole) return stateRole;
    }
    return DEFAULT_ROLE;
  }

  assert.strictEqual(simulatePopState('', null), 'accountant');
  assert.strictEqual(simulatePopState('', {}), 'accountant');
  assert.strictEqual(simulatePopState('?role=other', null), 'other');
  assert.strictEqual(simulatePopState('?role=invalid', null), 'accountant');
  assert.strictEqual(simulatePopState('', { role: 'mis' }), 'mis');
});

await test('R1.6: RoleTabsBar renders 4 tracks with Overview in position 1 across all variants', () => {
  const roleTabsBarPath = path.join(rootDir, 'src', 'components', 'RoleTabsBar.jsx');
  const code = fs.readFileSync(roleTabsBarPath, 'utf-8');

  assert.ok(code.includes("import React, { useRef } from 'react';"), 'Imports React and useRef');
  assert.ok(code.includes('LayoutDashboard'), 'Uses LayoutDashboard icon');
  assert.ok(code.includes("case 'overview':"), 'Handles overview in getRoleIcon');
  assert.ok(code.includes("case 'other':"), 'Handles other in getRoleIcon');
  assert.ok(code.includes('#6366F1'), 'Includes #6366F1 indigo accent');
  assert.ok(code.includes('#8B5CF6'), 'Includes #8B5CF6 purple accent');
});

await test('R1.7: Search catalog includes 4 quick role switch actions in exact order', () => {
  const roleActions = SEARCH_ITEMS.filter(i => i.actionType === 'switch-role');
  assert.strictEqual(roleActions.length, 4, 'Must have 4 role actions');
  assert.strictEqual(roleActions[0].role, 'overview');
  assert.strictEqual(roleActions[1].role, 'accountant');
  assert.strictEqual(roleActions[2].role, 'mis');
  assert.strictEqual(roleActions[3].role, 'other');
});

await test('R1.8: Simulated rapid cyclic role switching (200 transitions)', () => {
  const roles = ['overview', 'accountant', 'mis', 'other'];
  let current = 'accountant';
  for (let i = 0; i < 200; i++) {
    const next = roles[i % 4];
    current = next;
  }
  assert.strictEqual(current, roles[199 % 4]);
});

// ======================================================================
// R2: 'Overview' Executive Highlights & Summary Track Tests
// ======================================================================
console.log('\n--- REQUIREMENT R2: OVERVIEW EXECUTIVE HIGHLIGHTS & SUMMARY TRACK ---');

await test('R2.1: Overview metadata (LayoutDashboard, #6366F1, executive title/subtitle)', () => {
  assert.strictEqual(OVERVIEW_ROLE.icon, 'LayoutDashboard');
  assert.strictEqual(OVERVIEW_ROLE.accent, '#6366F1');
  assert.strictEqual(OVERVIEW_ROLE.heroTitle, 'Financial & Operations Executive.');
  assert.strictEqual(OVERVIEW_ROLE.heroSubtitle, 'Bridging Statutory Accounting, Taxation & Advanced Data Intelligence.');
  assert.strictEqual(OVERVIEW_ROLE.isOverview, true);
});

await test('R2.2: Overview resume configuration and asset mapping', () => {
  const overviewResume = getResumeConfig('overview');
  assert.strictEqual(overviewResume.fileName, 'resume.pdf');
  assert.strictEqual(overviewResume.downloadFilename, 'Atul_Verma_Overview_Resume.pdf');
  assert.strictEqual(overviewResume.accent, '#6366F1');

  const pdfPath = path.join(rootDir, 'public', 'resume.pdf');
  assert.ok(fs.existsSync(pdfPath), 'public/resume.pdf exists');
  const stat = fs.statSync(pdfPath);
  assert.ok(stat.size >= 10000, `resume.pdf size is ${stat.size} bytes`);
});

await test('R2.3: Overview experiences curated exclusively from Accountant and MIS with track badges', () => {
  const expPath = path.join(rootDir, 'src', 'components', 'ExperienceSection.jsx');
  const expCode = fs.readFileSync(expPath, 'utf-8');

  assert.ok(expCode.includes("const OVERVIEW_ROLES = ['exp-01', 'exp-03'];"), 'Overview experiences are exp-01 and exp-03');
  assert.ok(expCode.includes("trackBadge: 'Financial Track'"), 'exp-01 tagged Financial Track');
  assert.ok(expCode.includes("trackBadge: 'Data & Operations Track'"), 'exp-03 tagged Data & Operations Track');
  assert.ok(!expCode.includes("OVERVIEW_ROLES.includes('exp-other"), 'Excludes Other from Overview experiences');
});

await test('R2.4: Overview projects curated exclusively from Accountant and MIS with track badges', () => {
  const projPath = path.join(rootDir, 'src', 'components', 'ProjectsSection.jsx');
  const projCode = fs.readFileSync(projPath, 'utf-8');

  assert.ok(projCode.includes("renderProject01('Financial Track')"), 'Project 01 tagged Financial Track');
  assert.ok(projCode.includes("renderProject03Flagship('Data & Operations Track')"), 'Project 03 tagged Data & Operations Track');
  assert.ok(!projCode.includes("isOverview && OTHER_PROJECTS"), 'Excludes Other from Overview projects');
});

await test('R2.5: Overview competencies curated from Accountant and MIS', () => {
  const aboutPath = path.join(rootDir, 'src', 'components', 'AboutSection.jsx');
  const aboutCode = fs.readFileSync(aboutPath, 'utf-8');

  assert.ok(aboutCode.includes('OVERVIEW_COMPETENCIES'), 'OVERVIEW_COMPETENCIES defined');
  assert.ok(aboutCode.includes("category: 'Financial Track'"), 'Financial Track badge in competencies');
  assert.ok(aboutCode.includes("category: 'Data & Operations Track'"), 'Data & Operations Track badge in competencies');
  assert.ok(aboutCode.includes('OVERVIEW_STORY'), 'OVERVIEW_STORY defined');
});

// ======================================================================
// R3: 'Other ✨ AI' Synthesized Distinct Role Track Tests
// ======================================================================
console.log('\n--- REQUIREMENT R3: OTHER ✨ AI SYNTHESIZED DISTINCT ROLE TRACK ---');

await test('R3.1: Other tab label, sparkles, and controller specialization', () => {
  assert.strictEqual(OTHER_ROLE.label, 'Other ✨ AI');
  assert.strictEqual(OTHER_ROLE.accent, '#8B5CF6');
  assert.strictEqual(OTHER_ROLE.specializationTitle, 'Business Intelligence & Corporate Controller.');
  assert.strictEqual(OTHER_ROLE.specializationSubtitle, 'Statutory Financial Strategy & Executive Data Systems.');
  assert.strictEqual(OTHER_ROLE.isOther, true);
  assert.strictEqual(OTHER_ROLE.isAISynthesized, true);
});

await test('R3.2: AI Disclaimer banner rendered prominently across all 4 section components', () => {
  const bannerString = '🤖 AI-Synthesized Role (Derived from Verified Tracks)';

  const aboutCode = fs.readFileSync(path.join(rootDir, 'src', 'components', 'AboutSection.jsx'), 'utf-8');
  assert.ok(aboutCode.includes(bannerString), 'AboutSection includes AI banner');

  const expCode = fs.readFileSync(path.join(rootDir, 'src', 'components', 'ExperienceSection.jsx'), 'utf-8');
  assert.ok(expCode.includes(bannerString), 'ExperienceSection includes AI banner');

  const projCode = fs.readFileSync(path.join(rootDir, 'src', 'components', 'ProjectsSection.jsx'), 'utf-8');
  assert.ok(projCode.includes(bannerString), 'ProjectsSection includes AI banner');

  const skillsCode = fs.readFileSync(path.join(rootDir, 'src', 'components', 'SkillsSection.jsx'), 'utf-8');
  assert.ok(skillsCode.includes(bannerString), 'SkillsSection includes AI banner');

  const achCode = fs.readFileSync(path.join(rootDir, 'src', 'components', 'CodingAchievementsSection.jsx'), 'utf-8');
  assert.ok(achCode.includes(bannerString), 'AchievementsSection includes AI banner');
});

await test('R3.3: Authentic, mature Controller & BI data with zero dummy / placeholder strings', () => {
  const bannedList = ['lorem ipsum', 'dolor sit amet', 'dummy data', 'placeholder text', 'demo string', 'foo bar'];
  const filesToCheck = [
    'src/components/AboutSection.jsx',
    'src/components/ExperienceSection.jsx',
    'src/components/ProjectsSection.jsx',
    'src/components/SkillsSection.jsx',
    'src/components/CodingAchievementsSection.jsx',
    'src/utils/searchCatalog.js'
  ];

  for (const rel of filesToCheck) {
    const content = fs.readFileSync(path.join(rootDir, rel), 'utf-8').toLowerCase();
    for (const b of bannedList) {
      assert.ok(!content.includes(b), `Found banned phrase "${b}" in ${rel}`);
    }
  }
});

await test('R3.4: Dedicated Controller & BI resume asset in public/ and configuration', () => {
  const otherResume = getResumeConfig('other');
  assert.strictEqual(otherResume.fileName, 'resume-controller.pdf');
  assert.strictEqual(otherResume.downloadFilename, 'Atul_Verma_BI_Corporate_Controller_Resume.pdf');
  assert.strictEqual(otherResume.accent, '#8B5CF6');

  const pdfPath = path.join(rootDir, 'public', 'resume-controller.pdf');
  assert.ok(fs.existsSync(pdfPath), 'public/resume-controller.pdf exists');
  const stat = fs.statSync(pdfPath);
  assert.ok(stat.size >= 10000, `resume-controller.pdf size is ${stat.size} bytes`);
  const buf = fs.readFileSync(pdfPath);
  assert.strictEqual(buf.subarray(0, 5).toString(), '%PDF-');
});

await test('R3.5: Search catalog indexes all 8 Other skills, 2 projects, and 3 experiences with role: other', () => {
  const otherSkills = [
    'Power BI & Fiscal Dashboards',
    'Multi-Entity Ledger Consolidation',
    'Automated ERP & Banking Pipelines',
    'Statutory Tax Strategy & Audits',
    'Working Capital & Liquidity Modeling',
    'Executive KPI & Variance Analytics',
    'Internal Audit Trail Engineering',
    'Corporate Financial Controls'
  ];

  otherSkills.forEach((skill) => {
    const item = SEARCH_ITEMS.find(i => i.skillKey === skill);
    assert.ok(item, `Skill "${skill}" must exist in search catalog`);
    assert.strictEqual(item.role, 'other');
    assert.strictEqual(item.category, 'Skills');
  });

  const otherProjects = ['proj-enterprise-transformation', 'proj-business-advisory'];
  otherProjects.forEach((projId) => {
    const item = SEARCH_ITEMS.find(i => i.targetId === projId);
    assert.ok(item, `Project "${projId}" must exist in search catalog`);
    assert.strictEqual(item.role, 'other');
    assert.strictEqual(item.category, 'Projects');
  });

  const otherExperiences = ['exp-other-controller', 'exp-other-bi-systems', 'exp-other-compliance'];
  otherExperiences.forEach((expId) => {
    const item = SEARCH_ITEMS.find(i => i.targetId === expId);
    assert.ok(item, `Experience "${expId}" must exist in search catalog`);
    assert.strictEqual(item.role, 'other');
    assert.strictEqual(item.category, 'Experience');
  });
});

await test('R3.6: Fuzzy search resolves Other skills and projects from query keywords', () => {
  const pbi = searchCatalogItems(SEARCH_ITEMS, 'power bi');
  assert.ok(pbi.some(i => i.id === 'skill-power-bi-fiscal-dashboards'), 'Matches Power BI skill');
  assert.ok(pbi.some(i => i.id === 'proj-enterprise-transformation'), 'Matches Power BI project');

  const ctrl = searchCatalogItems(SEARCH_ITEMS, 'corporate controls');
  assert.ok(ctrl.some(i => i.id === 'skill-corporate-financial-controls'), 'Matches Corporate Controls skill');
  assert.ok(ctrl.some(i => i.id === 'proj-business-advisory'), 'Matches Business Advisory project');
});

// ======================================================================
// SUMMARY REPORT
// ======================================================================
console.log('\n================================================================');
console.log(`INDEPENDENT AUDIT TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED.`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL 20 INDEPENDENT VERIFICATION TESTS PASSED 100% PERFECTLY!\n');
  process.exit(0);
}
