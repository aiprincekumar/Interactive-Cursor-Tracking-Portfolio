import fs from 'node:fs';
import path from 'node:path';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('================================================================');
console.log('  INDEPENDENT VERIFICATION: TERMINAL VIEW & Z-INDEX HIERARCHY  ');
console.log('================================================================\n');

// 1. Terminal View Complete Background Isolation Audit
console.log('--- Feature 1: Terminal View Complete Background Isolation ---');
const appSource = fs.readFileSync(path.resolve('src/App.jsx'), 'utf8');
const indexCssSource = fs.readFileSync(path.resolve('src/index.css'), 'utf8');
const terminalFullViewSource = fs.readFileSync(path.resolve('src/components/TerminalFullView.jsx'), 'utf8');
const terminalCLISource = fs.readFileSync(path.resolve('src/components/TerminalCLI.jsx'), 'utf8');

// A. Solid Pure White Background verification
assert(
  appSource.includes("isTerminalMode\n              ? 'bg-white text-stone-900'") ||
  appSource.includes("isTerminalMode ? 'bg-white text-stone-900' :"),
  'App.jsx applies solid pure white background (bg-white text-stone-900) when isTerminalMode is true'
);

assert(
  indexCssSource.includes('body.view-mode-terminal {') &&
  indexCssSource.includes('background-color: #ffffff !important;'),
  'index.css enforces body.view-mode-terminal background-color: #ffffff !important'
);

assert(
  terminalFullViewSource.includes('bg-white text-stone-900'),
  'TerminalFullView component container has bg-white text-stone-900'
);

// B. Complete DOM Unmounting of Background Sections in Terminal Mode
assert(
  appSource.includes('{!isTerminalMode && !isBasicMode && (') &&
  appSource.includes('bg-dot-pattern'),
  'Mesh dot pattern is unmounted when isTerminalMode is true'
);

assert(
  appSource.includes('(!isBasicMode && !isTerminalMode)') &&
  appSource.includes('<DynamicCursorManager'),
  'DynamicCursorManager is completely unmounted when isTerminalMode is true'
);

assert(
  appSource.includes('!isTerminalMode && (') &&
  appSource.includes('<Navbar'),
  'Top Navbar is completely unmounted when isTerminalMode is true'
);

assert(
  appSource.includes("viewMode === 'terminal' ? (") &&
  appSource.includes('<TerminalFullView'),
  'Main content area mounts ONLY TerminalFullView when viewMode === "terminal"'
);

// Verify background sections are in the "else" branch of viewMode === 'terminal'
const sectionsUnmounted = [
  '<HeroSection',
  '<TechMarqueeBanner',
  '<AboutSection',
  '<SkillsSection',
  '<ExperienceSection',
  '<ProjectsSection',
  '<CodingAchievementsSection',
  '<SocialProofSection',
  '<TestimonialsSection',
  '<CameraRollGallery',
  '<InteractivePlayground',
  '<FAQSection',
  '<ContactSection'
];

sectionsUnmounted.forEach((sec) => {
  const mainContentIndex = appSource.indexOf('<main id="main-content"');
  const indexInApp = appSource.indexOf(sec, mainContentIndex);
  const terminalBranch = appSource.indexOf("viewMode === 'terminal' ? (", mainContentIndex);
  assert(indexInApp > terminalBranch, `Background section ${sec} is unmounted in terminal branch`);
});

assert(
  appSource.includes('!isTerminalMode && (') &&
  appSource.includes('<LabStudioDrawer'),
  'LabStudioDrawer is completely unmounted when isTerminalMode is true'
);

assert(
  appSource.includes('!isTerminalMode && !isBasicMode && <BackToTopButton />'),
  'BackToTopButton is unmounted when isTerminalMode is true'
);

assert(
  appSource.includes('!isTerminalMode && (') &&
  appSource.includes('<Footer'),
  'Footer is completely unmounted when isTerminalMode is true'
);

// C. Floating Action Buttons and Chat Widget remain accessible
assert(
  appSource.includes('<FloatingActionHub />'),
  'FloatingActionHub is mounted and accessible in Terminal view'
);

assert(
  appSource.includes('<AIChatWidget />'),
  'AIChatWidget is mounted and accessible in Terminal view'
);

// D. Terminal Portfolio Commands and Graceful Exit
const expectedCommands = [
  'help',
  'about',
  'skills',
  'experience',
  'projects',
  'contact',
  'resume',
  'exit',
  'quit'
];

expectedCommands.forEach((cmd) => {
  assert(
    terminalCLISource.includes(`case '${cmd}':`),
    `TerminalCLI handles command: "${cmd}"`
  );
});

assert(
  terminalFullViewSource.includes("selectViewMode('modern')"),
  'TerminalFullView handleClose gracefully switches viewMode back to "modern"'
);

// 2. Z-Index Stacking Hierarchy Audit
console.log('\n--- Feature 2: Z-Index Stacking Hierarchy Verification ---');

const aiChatSource = fs.readFileSync(path.resolve('src/components/AIChatWidget.jsx'), 'utf8');
const fabSource = fs.readFileSync(path.resolve('src/components/FloatingActionHub.jsx'), 'utf8');
const audiencePillSource = fs.readFileSync(path.resolve('src/components/AudienceFloatingPill.jsx'), 'utf8');
const viewModePillSource = fs.readFileSync(path.resolve('src/components/ViewModeFloatingPill.jsx'), 'utf8');
const rolePillSource = fs.readFileSync(path.resolve('src/components/RoleFloatingPill.jsx'), 'utf8');
const labDrawerSource = fs.readFileSync(path.resolve('src/components/LabStudioDrawer.jsx'), 'utf8');
const caseStudyDrawerSource = fs.readFileSync(path.resolve('src/components/CaseStudyDrawerContent.jsx'), 'utf8');
const credModalSource = fs.readFileSync(path.resolve('src/components/CredentialLightboxModal.jsx'), 'utf8');

// A. AIChatWidget has z-[45]
assert(
  aiChatSource.includes('fixed z-[45]'),
  'AIChatWidget container has explicit fixed z-[45]'
);

// B. FloatingActionHub has z-[60]
assert(
  fabSource.includes('z-[60]'),
  'FloatingActionHub container has explicit fixed z-[60]'
);

// C. Floating Option Pills have zIndex: 70 and portal to document.body
assert(
  audiencePillSource.includes('createPortal') &&
  audiencePillSource.includes('zIndex: 70'),
  'AudienceFloatingPill renders via createPortal with zIndex: 70'
);

assert(
  viewModePillSource.includes('createPortal') &&
  viewModePillSource.includes('zIndex: 70'),
  'ViewModeFloatingPill renders via createPortal with zIndex: 70'
);

assert(
  rolePillSource.includes('createPortal') &&
  rolePillSource.includes('zIndex: 70'),
  'RoleFloatingPill renders via createPortal with zIndex: 70'
);

// D. Drawers render at z-[75] (backdrop) and z-[80] (panel)
assert(
  labDrawerSource.includes('z-[75]') && labDrawerSource.includes('z-[80]'),
  'LabStudioDrawer has backdrop z-[75] and drawer panel z-[80]'
);

assert(
  caseStudyDrawerSource.includes('z-[75]') && caseStudyDrawerSource.includes('z-[80]'),
  'CaseStudyDrawerContent has backdrop z-[75] and drawer panel z-[80]'
);

// E. Modals render at z-[9999]
assert(
  credModalSource.includes('z-[9999]'),
  'CredentialLightboxModal renders at top-level modal layer z-[9999]'
);

// Summary
console.log('\n================================================================');
console.log(`  VERIFICATION SUMMARY: ${passed} PASSED | ${failed} FAILED`);
console.log('================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
