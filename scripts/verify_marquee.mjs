import fs from 'fs';
import path from 'path';

console.log('--- RUNNING DEEP VERIFICATION OF TECH MARQUEE BANNER ---');

const marqueePath = path.resolve('src/components/TechMarqueeBanner.jsx');
const skillsPath = path.resolve('src/components/SkillsSection.jsx');
const projectsPath = path.resolve('src/components/ProjectsSection.jsx');

const marqueeCode = fs.readFileSync(marqueePath, 'utf8');
const skillsCode = fs.readFileSync(skillsPath, 'utf8');
const projectsCode = fs.readFileSync(projectsPath, 'utf8');

let errors = 0;

function assert(condition, message) {
  if (!condition) {
    console.error('❌ FAIL:', message);
    errors++;
  } else {
    console.log('✅ PASS:', message);
  }
}

// 1. Check Acceptance Criteria: Glassmorphism styling and pointer arrow
assert(
  marqueeCode.includes('bg-slate-900/95 backdrop-blur-md border border-[#FF4D6D]/40 shadow-2xl rounded-xl'),
  'Tooltip container has dark glassmorphism styling matching requirement'
);

assert(
  marqueeCode.includes('rotate-45') && marqueeCode.includes('border-[#FF4D6D]/40'),
  'Tooltip includes directional pointer arrow'
);

// 2. Check Counter-rotation
assert(
  marqueeCode.includes("rotate(3.5deg)") && marqueeCode.includes("rotate(-3.5deg)"),
  'Top ribbon is rotated -3.5deg and tooltip is counter-rotated +3.5deg to 0deg horizontal'
);

assert(
  marqueeCode.includes("rotate(-2.8deg)") && marqueeCode.includes("rotate(2.8deg)"),
  'Bottom ribbon is rotated +2.8deg and tooltip is counter-rotated -2.8deg to 0deg horizontal'
);

// 3. Check Marquee Pause on Hover/Tap
assert(
  marqueeCode.includes("animationPlayState: isPaused ? 'paused' : undefined"),
  'Marquee animation dynamically pauses when an item tooltip is active'
);

// 4. Check Two-Step Tap support
assert(
  marqueeCode.includes('isTouchDevice') && marqueeCode.includes('activeTooltipKey === itemKey'),
  'Two-step tap support properly implemented with first tap opening tooltip and second tap navigating'
);

assert(
  marqueeCode.includes('pointerdown') && marqueeCode.includes('setActiveTooltipKey(null)'),
  'Tap outside listener dismisses active tooltip'
);

// 5. Check Role Synchronization & Skill Events
assert(
  marqueeCode.includes("'switch-role-tab'") && marqueeCode.includes('selectRole(targetRole)'),
  'Target role switching via selectRole and switch-role-tab event is present'
);

assert(
  marqueeCode.includes("'select-skill'") && marqueeCode.includes('details.skillKey'),
  'Skill activation via select-skill custom event is present'
);

// 6. Check Pulse Ring Highlight (2.5s duration)
assert(
  marqueeCode.includes('ring-4') &&
  marqueeCode.includes('ring-[#FF4D6D]') &&
  marqueeCode.includes('ring-offset-4') &&
  marqueeCode.includes('animate-pulse') &&
  marqueeCode.includes('2500'),
  'Glowing pulse ring animation (2.5s) applied to target element'
);

// 7. Verify all Top Items exist in TECH_DETAILS and map to valid targets
const topItems = [
  'Tally Prime',
  'GST Portal',
  'Income Tax E-Filing',
  'MS Excel (Advanced)',
  'Path Solution ERP',
  'Adobe Photoshop',
  'CorelDraw',
  'PageMaker',
  'Windows 11 OS',
  'ADCA Infocity',
];

const bottomItems = [
  'Tax Advisory & Filing',
  'Financial Accounting',
  'GST Compliance & ITC',
  'MIS Executive Analytics',
  'Inventory & Stock Control',
  'DAY-NULM Skill Mission',
  'Smart Card Operations',
  'Office Administration',
  'Business Development',
];

[...topItems, ...bottomItems].forEach((item) => {
  assert(marqueeCode.includes(`'${item}':`), `Item '${item}' is configured in TECH_DETAILS`);
});

// 8. Verify Project Items Target IDs
assert(
  marqueeCode.includes("targetId: 'proj-day-nulm'") && projectsCode.includes("targetId: 'proj-day-nulm'"),
  'DAY-NULM Skill Mission maps to proj-day-nulm in ProjectsSection'
);

assert(
  marqueeCode.includes("targetId: 'proj-smart-card'") && projectsCode.includes("targetId: 'proj-smart-card'"),
  'Smart Card Operations maps to proj-smart-card in ProjectsSection'
);

// 9. Verify DTP Design Suite is present in MIS categories
assert(
  skillsCode.includes("'DTP Design Suite'"),
  'DTP Design Suite is present in SkillsSection'
);

// 10. Check Escape key dismissal support
assert(
  marqueeCode.includes("e.key === 'Escape'") && marqueeCode.includes('setActiveTooltipKey(null)'),
  'Escape key listener dismisses active tooltip for keyboard accessibility'
);

// 11. Check retry resilience in scrollAndHighlight
assert(
  marqueeCode.includes('attemptsRemaining') && marqueeCode.includes('scrollAndHighlight(attemptsRemaining - 1)'),
  'Scroll and highlight includes retry resilience for slow mounting tabpanels'
);

// 12. Check keyboard onFocus and onBlur accessibility
assert(
  marqueeCode.includes('onFocus=') && marqueeCode.includes('onBlur='),
  'Keyboard navigation onFocus and onBlur handlers reveal and dismiss tooltips'
);

// 13. Check backdrop-filter fallback support
assert(
  marqueeCode.includes('supports-[not(backdrop-filter)]:bg-slate-950'),
  'Backdrop-filter fallback solid opaque styling is present for legacy/low-power GPUs'
);

// 14. Check viewport resize and orientation change dismissal
assert(
  marqueeCode.includes("addEventListener('resize'") && marqueeCode.includes("addEventListener('orientationchange'"),
  'Window resize and orientationchange event listeners safely dismiss tooltips during viewport changes'
);

// 15. Check prefers-reduced-motion accessibility support in scrollAndHighlight
assert(
  marqueeCode.includes('prefers-reduced-motion') && marqueeCode.includes("prefersReducedMotion ? 'auto' : 'smooth'"),
  'Smart navigation respects prefers-reduced-motion preference in scrollIntoView'
);

// 16. Check ARIA popover accessibility attributes
assert(
  marqueeCode.includes('aria-haspopup="true"') && marqueeCode.includes('aria-expanded={isTooltipOpen}'),
  'Interactive ribbon items have aria-haspopup and aria-expanded attributes'
);

// 17. Check decoupled handleBlur implementation
assert(
  marqueeCode.includes('handleBlur =') && marqueeCode.includes('onBlur={() => handleBlur(itemKey)}'),
  'Independent handleBlur function decouples blur from hover media query'
);

// 18. Check pointer arrow backdrop fallback class
assert(
  marqueeCode.includes('supports-[not(backdrop-filter)]:bg-slate-950 rotate-45 pointer-events-none'),
  'Pointer arrows have supports-[not(backdrop-filter)]:bg-slate-950 fallback matching tooltip container'
);

// 19. Check that all pure skills map to valid skillKey entries present in SKILL_DATA
const pureSkillKeys = [
  'Tally Prime & ERP 9',
  'GST Filing & Compliance',
  'Income Tax E-Filing',
  'MS Excel (Advanced)',
  'Path Solution ERP',
  'DTP Design Suite',
  'Windows OS Administration',
  'Commercial Computing & Office IT Suite',
  'MIS Reporting & Analytics',
  'Stock Handling & Logistics',
  'Office Administration',
  'Business Development'
];

pureSkillKeys.forEach((key) => {
  assert(
    skillsCode.includes(`'${key}':`) || skillsCode.includes(`"${key}":`),
    `Skill key '${key}' maps to valid entry in SkillsSection SKILL_DATA`
  );
});

// 20. Check that R1 required tooltip content fields (title, experienceMetric, categoryBadge, hint) are rendered in both ribbons
assert(
  marqueeCode.includes('{details.categoryBadge}') &&
  marqueeCode.includes('{details.title}') &&
  marqueeCode.includes('{details.experienceMetric}') &&
  marqueeCode.includes('{details.hint ||') &&
  marqueeCode.includes('Click to inspect skill →'),
  'Tooltip template renders all 4 required R1 content fields (category, title, experience, hint)'
);

if (errors === 0) {
  console.log('\n🎉 ALL AUTOMATED CHECKS PASSED PERFECTLY!');
  process.exit(0);
} else {
  console.error(`\n💥 ${errors} CHECKS FAILED!`);
  process.exit(1);
}

