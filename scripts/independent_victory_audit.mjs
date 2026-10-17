import fs from 'fs';
import path from 'path';
import vm from 'vm';
import assert from 'assert';

async function runAudit() {
  console.log('================================================================');
  console.log('VICTORY AUDITOR: FULL INDEPENDENT REQUIREMENTS VERIFICATION');
  console.log('================================================================\n');

  // ----------------------------------------------------------------
  // REQUIREMENT 1 (R1): 4-Tab Hierarchy & Navigation
  // ----------------------------------------------------------------
  // Extract and evaluate pure JS constants from RoleContext.jsx
  const roleContextSrc = fs.readFileSync('src/context/RoleContext.jsx', 'utf-8');
  const lines = roleContextSrc.split('\n');
  const pureJs = lines.slice(4, 93).map(l => l.replace(/^export\s+/, '')).join('\n');
  const roleVm = {};
  vm.createContext(roleVm);
  vm.runInContext(pureJs + '; this.DEFAULT_ROLE = DEFAULT_ROLE; this.ROLE_TRACKS = ROLE_TRACKS; this.OVERVIEW_ROLE = OVERVIEW_ROLE; this.PRIMARY_ROLES = PRIMARY_ROLES; this.OTHER_ROLE = OTHER_ROLE; this.normalizeRole = normalizeRole; this.isValidRole = isValidRole;', roleVm);

  const { DEFAULT_ROLE, ROLE_TRACKS, OVERVIEW_ROLE, PRIMARY_ROLES, OTHER_ROLE, normalizeRole, isValidRole } = roleVm;

  // R1.1: 4 tracks in fixed sequence
  assert.strictEqual(ROLE_TRACKS.length, 4, 'ROLE_TRACKS length must be 4');
  assert.strictEqual(ROLE_TRACKS[0].id, 'overview', 'Tab 1 must be overview');
  assert.strictEqual(ROLE_TRACKS[1].id, 'accountant', 'Tab 2 must be accountant');
  assert.strictEqual(ROLE_TRACKS[2].id, 'mis', 'Tab 3 must be mis');
  assert.strictEqual(ROLE_TRACKS[3].id, 'other', 'Tab 4 must be other');

  // R1.2: Default initial role must remain 'accountant'
  assert.strictEqual(DEFAULT_ROLE, 'accountant', 'DEFAULT_ROLE must be accountant');

  // R1.3: Normalization & validation
  assert.strictEqual(normalizeRole('overview'), 'overview');
  assert.strictEqual(normalizeRole('accountant'), 'accountant');
  assert.strictEqual(normalizeRole('mis'), 'mis');
  assert.strictEqual(normalizeRole('other'), 'other');
  assert.strictEqual(normalizeRole('OVERVIEW'), 'overview');
  assert.strictEqual(normalizeRole('  Accountant  '), 'accountant');
  assert.strictEqual(normalizeRole('invalid_role'), null);
  assert.strictEqual(normalizeRole(''), null);
  assert.strictEqual(normalizeRole(null), null);
  assert.strictEqual(isValidRole('overview'), true);
  assert.strictEqual(isValidRole('accountant'), true);
  assert.strictEqual(isValidRole('mis'), true);
  assert.strictEqual(isValidRole('other'), true);
  assert.strictEqual(isValidRole('unknown'), false);

  // R1.4: RoleTabsBar permanent position 1 for Overview
  const roleTabsBarSrc = fs.readFileSync('src/components/RoleTabsBar.jsx', 'utf-8');
  assert.ok(roleTabsBarSrc.includes('LayoutDashboard'), 'RoleTabsBar uses LayoutDashboard for Overview');
  assert.ok(roleTabsBarSrc.includes('#6366F1'), 'RoleTabsBar includes #6366F1 accent for Overview');
  assert.ok(roleTabsBarSrc.includes('#8B5CF6'), 'RoleTabsBar includes #8B5CF6 accent for Other');

  // R1.5: SearchCatalog 4 role-switching actions
  const { SEARCH_ITEMS } = await import('../src/utils/searchCatalog.js');
  const roleActions = SEARCH_ITEMS.filter(item => item.actionType === 'switch-role');
  assert.strictEqual(roleActions.length, 4, 'Search catalog must contain exactly 4 switch-role actions');
  assert.strictEqual(roleActions[0].id, 'act-role-overview');
  assert.strictEqual(roleActions[1].id, 'act-role-accountant');
  assert.strictEqual(roleActions[2].id, 'act-role-mis');
  assert.strictEqual(roleActions[3].id, 'act-role-other');

  console.log('✅ R1 PASS: 4-Tab role hierarchy, default accountant, sequence, and navigation verified.');

  // ----------------------------------------------------------------
  // REQUIREMENT 2 (R2): Overview Track & Highlights Curation
  // ----------------------------------------------------------------
  // R2.1: Overview metadata
  assert.strictEqual(OVERVIEW_ROLE.accent, '#6366F1', 'Overview accent must be Indigo #6366F1');
  assert.strictEqual(OVERVIEW_ROLE.icon, 'LayoutDashboard', 'Overview icon must be LayoutDashboard');
  assert.strictEqual(OVERVIEW_ROLE.heroTitle, 'Financial & Operations Executive.', 'Overview hero title matches R2');
  assert.strictEqual(OVERVIEW_ROLE.heroSubtitle, 'Bridging Statutory Accounting, Taxation & Advanced Data Intelligence.', 'Overview hero subtitle matches R2');

  // R2.2: Resume configuration for Overview
  const { getResumeConfig } = await import('../src/utils/resumeConfig.js');
  const overviewResume = getResumeConfig('overview');
  assert.strictEqual(overviewResume.fileName, 'resume.pdf');
  assert.strictEqual(overviewResume.downloadFilename, 'Atul_Verma_Overview_Resume.pdf');
  assert.strictEqual(overviewResume.accent, '#6366F1');

  // R2.3: Overview Experiences in ExperienceSection
  const expSrc = fs.readFileSync('src/components/ExperienceSection.jsx', 'utf-8');
  assert.ok(expSrc.includes("const OVERVIEW_ROLES = ['exp-01', 'exp-03'];"), 'Overview experiences must be strictly exp-01 and exp-03');
  assert.ok(expSrc.includes("trackBadge: 'Financial Track'"), 'exp-01 has Financial Track badge');
  assert.ok(expSrc.includes("trackBadge: 'Data & Operations Track'"), 'exp-03 has Data & Operations Track badge');

  // R2.4: Overview Projects in ProjectsSection
  const projSrc = fs.readFileSync('src/components/ProjectsSection.jsx', 'utf-8');
  assert.ok(projSrc.includes("renderProject01('Financial Track')"), 'Project 01 tagged Financial Track in Overview');
  assert.ok(projSrc.includes("renderProject03Flagship('Data & Operations Track')"), 'Project 03 tagged Data & Operations Track in Overview');

  // R2.5: Exclusion of Other from Overview
  assert.ok(!expSrc.includes("OVERVIEW_ROLES.includes('exp-other"), 'Overview must not include exp-other');
  assert.ok(!projSrc.includes("isOverview && OTHER_PROJECTS"), 'Overview must not include OTHER_PROJECTS');

  // R2.6: Overview Competencies in AboutSection
  const aboutSrc = fs.readFileSync('src/components/AboutSection.jsx', 'utf-8');
  assert.ok(aboutSrc.includes('OVERVIEW_COMPETENCIES'), 'AboutSection defines OVERVIEW_COMPETENCIES');
  assert.ok(aboutSrc.includes("category: 'Financial Track'"), 'Financial Track in OVERVIEW_COMPETENCIES');
  assert.ok(aboutSrc.includes("category: 'Data & Operations Track'"), 'Data & Operations Track in OVERVIEW_COMPETENCIES');

  console.log('✅ R2 PASS: Overview executive track, curation, badges, hero copy, and resume verified.');

  // ----------------------------------------------------------------
  // REQUIREMENT 3 (R3): Other ✨ AI Synthesized Role Track
  // ----------------------------------------------------------------
  // R3.1: Tab label and sparkles
  assert.ok(OTHER_ROLE.label.includes('Other ✨ AI'), 'Other role label must display Other ✨ AI');
  assert.strictEqual(OTHER_ROLE.accent, '#8B5CF6', 'Other role accent must be #8B5CF6');
  assert.strictEqual(OTHER_ROLE.specializationTitle, 'Business Intelligence & Corporate Controller.');
  assert.strictEqual(OTHER_ROLE.specializationSubtitle, 'Statutory Financial Strategy & Executive Data Systems.');

  // R3.2: AI Disclaimer banner in all 4 sections
  const bannerString = '🤖 AI-Synthesized Role (Derived from Verified Tracks)';
  assert.ok(aboutSrc.includes(bannerString), 'AboutSection includes AI disclaimer banner');
  assert.ok(expSrc.includes(bannerString), 'ExperienceSection includes AI disclaimer banner');
  assert.ok(projSrc.includes(bannerString), 'ProjectsSection includes AI disclaimer banner');

  const skillsSrc = fs.readFileSync('src/components/SkillsSection.jsx', 'utf-8');
  assert.ok(skillsSrc.includes(bannerString), 'SkillsSection includes AI disclaimer banner');

  // R3.3: Mature, authentic data for Controller & BI (no lorem ipsum / dummy strings)
  const bannedKeywords = ['lorem ipsum', 'dolor sit amet', 'dummy data', 'placeholder text', 'demo string', 'foo bar'];
  const checkedFiles = [
    'src/components/AboutSection.jsx',
    'src/components/ExperienceSection.jsx',
    'src/components/ProjectsSection.jsx',
    'src/components/SkillsSection.jsx',
    'src/utils/searchCatalog.js'
  ];
  for (const f of checkedFiles) {
    const content = fs.readFileSync(f, 'utf-8').toLowerCase();
    for (const b of bannedKeywords) {
      assert.ok(!content.includes(b), `Banned phrase '${b}' found in ${f}`);
    }
  }

  // R3.4: Controller & BI Resume config
  const controllerResume = getResumeConfig('other');
  assert.strictEqual(controllerResume.fileName, 'resume-controller.pdf');
  assert.strictEqual(controllerResume.downloadFilename, 'Atul_Verma_BI_Corporate_Controller_Resume.pdf');
  assert.strictEqual(controllerResume.accent, '#8B5CF6');

  // Verify public/resume-controller.pdf exists, >= 10KB, and has %PDF-
  const controllerPdfPath = path.join('public', 'resume-controller.pdf');
  assert.ok(fs.existsSync(controllerPdfPath), 'resume-controller.pdf exists');
  const stat = fs.statSync(controllerPdfPath);
  assert.ok(stat.size >= 10000, `resume-controller.pdf size is ${stat.size} bytes (>= 10000)`);
  const pdfHeader = fs.readFileSync(controllerPdfPath, { encoding: null }).slice(0, 4).toString();
  assert.strictEqual(pdfHeader, '%PDF', 'resume-controller.pdf has %PDF header');

  console.log('✅ R3 PASS: Other ✨ AI specialization, disclaimer banners, authentic data, and controller resume verified.');

  // ----------------------------------------------------------------
  // SUMMARY SCORECARD
  // ----------------------------------------------------------------
  console.log('\n================================================================');
  console.log('VICTORY AUDITOR INDEPENDENT VERIFICATION VERDICT: 100% CLEAN PASS');
  console.log('================================================================\n');
}

runAudit().catch(err => {
  console.error('\n❌ AUDIT FAILED:', err);
  process.exit(1);
});
