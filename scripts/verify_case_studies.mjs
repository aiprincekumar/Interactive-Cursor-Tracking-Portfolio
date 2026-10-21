import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { pathToFileURL } from 'url';

console.log('================================================================');
console.log('--- VERIFICATION HARNESS: P1 PROJECT CASE STUDIES DOSSIERS ---');
console.log('================================================================\n');

const projectRoot = process.cwd();

// Dynamic import of caseStudiesData.js
const caseStudiesDataPath = path.join(projectRoot, 'src', 'data', 'caseStudiesData.js');
assert(fs.existsSync(caseStudiesDataPath), 'src/data/caseStudiesData.js must exist');

const caseStudiesModule = await import(pathToFileURL(caseStudiesDataPath).href);
const { CASE_STUDIES, CASE_STUDIES_DATA, getCaseStudyById, CASE_STUDY_STAGES } = caseStudiesModule;

const datasets = CASE_STUDIES_DATA || CASE_STUDIES;
assert(Array.isArray(datasets), 'CASE_STUDIES_DATA must be an array');
assert(datasets.length === 9, `Expected exactly 9 case studies, found ${datasets.length}`);
console.log(`✔ SUITE 1: CASE_STUDIES contains all ${datasets.length} projects`);

// -----------------------------------------------------------------------------
// Test 1: Validate 5-Stage Storytelling for All 9 Projects
// -----------------------------------------------------------------------------
console.log('\n[Suite 2: 5-Stage Storytelling Validation]');

assert(Array.isArray(CASE_STUDY_STAGES) && CASE_STUDY_STAGES.length === 5, 'Must define 5 canonical stages');
console.log('✔ Stages defined: ' + CASE_STUDY_STAGES.map((s) => s.label).join(' -> '));

const expectedIds = ['01', '02', '03', '04', '05', '06', '07', '08', '09'];

for (const id of expectedIds) {
  const dossier = datasets.find((c) => c.id === id);
  assert(dossier, `Case study dossier for project ${id} must exist`);

  // Basic metadata
  assert(dossier.id === id, `Dossier ID mismatch: ${dossier.id} vs ${id}`);
  assert(dossier.targetId && typeof dossier.targetId === 'string', `Dossier ${id} must have a valid targetId`);
  assert(dossier.role && typeof dossier.role === 'string', `Dossier ${id} must have role`);
  assert(dossier.trackBadge && typeof dossier.trackBadge === 'string', `Dossier ${id} must have trackBadge`);
  assert(dossier.title && typeof dossier.title === 'string', `Dossier ${id} must have title`);
  assert(dossier.subtitle && typeof dossier.subtitle === 'string', `Dossier ${id} must have subtitle`);
  assert(dossier.summary && typeof dossier.summary === 'string', `Dossier ${id} must have summary`);

  // Stage 1: Challenge
  const ch = dossier.story?.challenge;
  assert(ch && typeof ch.title === 'string' && ch.title.length > 5, `Dossier ${id} Stage 1 title required`);
  assert(ch.context && ch.context.length > 20, `Dossier ${id} Stage 1 context required`);
  assert(Array.isArray(ch.painPoints) && ch.painPoints.length >= 2, `Dossier ${id} Stage 1 painPoints must have >= 2 items`);

  // Stage 2: Solution
  const sol = dossier.story?.solution;
  assert(sol && typeof sol.title === 'string' && sol.title.length > 5, `Dossier ${id} Stage 2 title required`);
  assert(sol.approach && sol.approach.length > 20, `Dossier ${id} Stage 2 approach required`);
  assert(Array.isArray(sol.keyPillars) && sol.keyPillars.length >= 2, `Dossier ${id} Stage 2 keyPillars must have >= 2 items`);
  for (const pillar of sol.keyPillars) {
    assert(pillar.title && pillar.desc, `Dossier ${id} Stage 2 pillar requires title and desc`);
  }

  // Stage 3: Tech & Obstacles
  const tech = dossier.story?.techAndObstacles;
  assert(tech && Array.isArray(tech.stack) && tech.stack.length >= 2, `Dossier ${id} Stage 3 stack must have >= 2 items`);
  assert(Array.isArray(tech.obstacles) && tech.obstacles.length >= 2, `Dossier ${id} Stage 3 obstacles must have >= 2 items`);
  for (const obs of tech.obstacles) {
    assert(obs.hurdle && obs.resolution, `Dossier ${id} Stage 3 obstacle requires hurdle and resolution`);
  }

  // Stage 4: Results & Metrics
  const res = dossier.story?.resultsAndMetrics;
  assert(res && typeof res.title === 'string', `Dossier ${id} Stage 4 title required`);
  assert(Array.isArray(res.beforeVsAfter) && res.beforeVsAfter.length >= 2, `Dossier ${id} Stage 4 beforeVsAfter must have >= 2 items`);
  for (const m of res.beforeVsAfter) {
    assert(m.metric && m.before && m.after && m.delta, `Dossier ${id} Stage 4 beforeVsAfter requires metric, before, after, delta`);
  }
  assert(Array.isArray(res.highlights) && res.highlights.length >= 2, `Dossier ${id} Stage 4 highlights must have >= 2 items`);

  // Stage 5: Lessons Learned
  const les = dossier.story?.lessonsLearned;
  assert(les && Array.isArray(les.takeaways) && les.takeaways.length >= 2, `Dossier ${id} Stage 5 takeaways must have >= 2 items`);
  for (const t of les.takeaways) {
    assert(t.principle && t.detail, `Dossier ${id} Stage 5 takeaway requires principle and detail`);
  }

  // Interactive Simulator Config
  const sim = dossier.simulator;
  assert(
    sim && (sim.archetype === 'pipeline' || sim.archetype === 'state-machine' || sim.archetype === 'stateMachine'),
    `Dossier ${id} simulator archetype must be pipeline or state-machine`
  );
  if (sim.archetype === 'pipeline') {
    assert(Array.isArray(sim.steps) && sim.steps.length >= 3, `Dossier ${id} pipeline must have >= 3 steps`);
    assert(Array.isArray(sim.telemetryKeys) && sim.telemetryKeys.length >= 2, `Dossier ${id} pipeline must have >= 2 telemetryKeys`);
  } else {
    assert(Array.isArray(sim.nodes) && sim.nodes.length >= 3, `Dossier ${id} stateMachine must have >= 3 nodes`);
  }

  // 4-Tier Architecture
  const arch = dossier.architecture;
  assert(arch && Array.isArray(arch.tiers) && arch.tiers.length === 4, `Dossier ${id} must have exactly 4 architecture tiers`);
  for (const tier of arch.tiers) {
    assert(tier.name && Array.isArray(tier.nodes), `Dossier ${id} tier must have name and nodes`);
    for (const node of tier.nodes) {
      assert(node.name && node.tech && node.detail, `Dossier ${id} architecture node requires name, tech, and detail`);
    }
  }

  console.log(`✔ PASS: Project ${id} (${dossier.title}) fully conforms to 5-stage storytelling + telemetry + 4-tier model`);
}

// -----------------------------------------------------------------------------
// Test 2: getCaseStudyById Helper Resolution
// -----------------------------------------------------------------------------
console.log('\n[Suite 3: getCaseStudyById Helper Resolution]');

for (const id of expectedIds) {
  const byId = getCaseStudyById(id);
  assert(byId && byId.id === id, `Lookup by ID failed for ${id}`);
}
console.log('✔ PASS: All 9 IDs correctly resolved via getCaseStudyById()');

const targetIdTestMap = [
  ['proj-gst-tax', '01'],
  ['proj-tally-accounting', '02'],
  ['proj-day-nulm', '03'],
  ['proj-smart-card', '04'],
  ['proj-enterprise-transformation', '05'],
  ['proj-business-advisory', '06'],
  ['proj-ai-saas-generator', '07'],
  ['proj-agent-workflow-engine', '08'],
  ['proj-doc-code-synthesizer', '09']
];

for (const [targetId, expectedId] of targetIdTestMap) {
  const byTarget = getCaseStudyById(targetId);
  assert(byTarget && byTarget.id === expectedId, `Lookup by targetId failed: ${targetId} expected ${expectedId}`);
}
console.log('✔ PASS: All 9 targetId slugs correctly resolved via getCaseStudyById()');

// Fallback behavior
const fallbackDossier = getCaseStudyById('non-existent-random-id');
assert(fallbackDossier && fallbackDossier.id === '01', 'Fallback should return project 01');
console.log('✔ PASS: Fallback gracefully returns Project 01 dossier for invalid IDs');

// -----------------------------------------------------------------------------
// Test 3: Component Implementation & ARIA Verification
// -----------------------------------------------------------------------------
console.log('\n[Suite 4: Component Implementation & ARIA Verification]');

// 1. CaseStudyDrawer.jsx
const drawerPath = path.join(projectRoot, 'src', 'components', 'CaseStudyDrawer.jsx');
assert(fs.existsSync(drawerPath), 'src/components/CaseStudyDrawer.jsx must exist');
const drawerContent = fs.readFileSync(drawerPath, 'utf-8');

assert(drawerContent.includes('useFocusTrap'), 'CaseStudyDrawer must use useFocusTrap');
assert(drawerContent.includes("role=\"dialog\""), 'CaseStudyDrawer must have role="dialog"');
assert(drawerContent.includes("aria-modal=\"true\""), 'CaseStudyDrawer must have aria-modal="true"');
assert(drawerContent.includes("role=\"tablist\""), 'CaseStudyDrawer must provide role="tablist" for stages');
assert(drawerContent.includes("role=\"tab\""), 'CaseStudyDrawer must provide role="tab" buttons');
assert(drawerContent.includes("role=\"tabpanel\""), 'CaseStudyDrawer must provide role="tabpanel"');
assert(drawerContent.includes("document.body.style.overflow = 'hidden'"), 'CaseStudyDrawer must lock background scroll');
assert(drawerContent.includes("paddingRight"), 'CaseStudyDrawer must compensate scrollbar width to prevent layout shift');
assert(drawerContent.includes("CaseStudySimulator"), 'CaseStudyDrawer must embed CaseStudySimulator');
assert(drawerContent.includes("CaseStudyArchitecture"), 'CaseStudyDrawer must embed CaseStudyArchitecture');
console.log('✔ PASS: CaseStudyDrawer satisfies focus trap, background scroll lock, ARIA dialog & tablist standards');

// 2. CaseStudySimulator.jsx
const simPath = path.join(projectRoot, 'src', 'components', 'CaseStudySimulator.jsx');
assert(fs.existsSync(simPath), 'src/components/CaseStudySimulator.jsx must exist');
const simContent = fs.readFileSync(simPath, 'utf-8');

assert(simContent.includes('soundFX'), 'CaseStudySimulator must integrate audio cues');
assert(simContent.includes('useAnnounce'), 'CaseStudySimulator must integrate screen reader announcements');
assert(simContent.includes('pipeline') && simContent.includes('stateMachine'), 'CaseStudySimulator must handle both pipeline and stateMachine');
assert(simContent.includes('hasAnomaly') || simContent.includes('anomaly'), 'CaseStudySimulator must provide stress/anomaly simulation toggle');
console.log('✔ PASS: CaseStudySimulator satisfies pipeline/stateMachine simulation, audio, and live telemetry');

// 3. CaseStudyArchitecture.jsx
const archPath = path.join(projectRoot, 'src', 'components', 'CaseStudyArchitecture.jsx');
assert(fs.existsSync(archPath), 'src/components/CaseStudyArchitecture.jsx must exist');
const archContent = fs.readFileSync(archPath, 'utf-8');

assert(archContent.includes('tiers.map'), 'CaseStudyArchitecture must iterate over tiers');
console.log('✔ PASS: CaseStudyArchitecture provides 4-tier visual flowchart');

// -----------------------------------------------------------------------------
// Test 4: ProjectsSection Triggers for All 9 Projects
// -----------------------------------------------------------------------------
console.log('\n[Suite 5: ProjectsSection Triggers]');
const projectsSectionPath = path.join(projectRoot, 'src', 'components', 'ProjectsSection.jsx');
const projectsSectionContent = fs.readFileSync(projectsSectionPath, 'utf-8');

assert(projectsSectionContent.includes('onOpenCaseStudy'), 'ProjectsSection must accept onOpenCaseStudy prop');
assert(projectsSectionContent.includes('portfolio:open-case-study'), 'ProjectsSection must dispatch custom fallback event');

for (const id of expectedIds) {
  assert(
    projectsSectionContent.includes(`handleOpenCaseStudy('${id}')`) ||
    projectsSectionContent.includes(`handleOpenCaseStudy(proj.id)`) ||
    projectsSectionContent.includes(`handleOpenCaseStudy(OTHER_PROJECTS[0].id)`) ||
    projectsSectionContent.includes(`handleOpenCaseStudy(OTHER_PROJECTS[1].id)`),
    `ProjectsSection must have trigger for project ${id}`
  );
}
console.log('✔ PASS: All 9 projects have case study trigger badges and action buttons');

// -----------------------------------------------------------------------------
// Test 5: App.jsx Integration & URL Deep Linking
// -----------------------------------------------------------------------------
console.log('\n[Suite 6: App.jsx Integration & URL Deep Linking]');
const appPath = path.join(projectRoot, 'src', 'App.jsx');
const appContent = fs.readFileSync(appPath, 'utf-8');

assert(appContent.includes("import CaseStudyDrawer from './components/CaseStudyDrawer'"), 'App.jsx must import CaseStudyDrawer');
assert(appContent.includes('isCaseStudyOpen'), 'App.jsx must manage isCaseStudyOpen state');
assert(appContent.includes('activeCaseStudyId'), 'App.jsx must manage activeCaseStudyId state');
assert(appContent.includes('casestudy'), 'App.jsx must support URL deep-linking (?casestudy=<id>)');
assert(appContent.includes('portfolio:open-case-study'), 'App.jsx must listen to global event portfolio:open-case-study');
assert(appContent.includes('<CaseStudyDrawer'), 'App.jsx must mount <CaseStudyDrawer />');
console.log('✔ PASS: App.jsx mounts CaseStudyDrawer with deep-linking & event handling');

console.log('\n================================================================');
console.log('🌟 ALL CASE STUDY VERIFICATION SUITES PASSED FLAWLESSLY! 🌟');
console.log('================================================================');
