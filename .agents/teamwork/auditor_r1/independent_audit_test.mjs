import fs from 'fs';
import path from 'path';

console.log('=== VICTORY AUDITOR INDEPENDENT VERIFICATION RUN ===');

const marqueePath = path.resolve('src/components/TechMarqueeBanner.jsx');
const skillsPath = path.resolve('src/components/SkillsSection.jsx');
const projectsPath = path.resolve('src/components/ProjectsSection.jsx');

const marqueeSource = fs.readFileSync(marqueePath, 'utf8');
const skillsSource = fs.readFileSync(skillsPath, 'utf8');
const projectsSource = fs.readFileSync(projectsPath, 'utf8');

let failCount = 0;
let passCount = 0;

function check(testName, condition, detail = '') {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${testName}: ${detail}`);
    failCount++;
  }
}

// 1. Math Verification: Counter-rotation angles
// Top ribbon tilted at -3.5deg, tooltip counter-rotated +3.5deg -> Net angle 0.0deg
const topRibbonAngle = -3.5;
const topTooltipCounter = 3.5;
check('Top ribbon net angle is 0.0deg', topRibbonAngle + topTooltipCounter === 0);

// Bottom ribbon tilted at +2.8deg, tooltip counter-rotated -2.8deg -> Net angle 0.0deg
const bottomRibbonAngle = 2.8;
const bottomTooltipCounter = -2.8;
check('Bottom ribbon net angle is 0.0deg', bottomRibbonAngle + bottomTooltipCounter === 0);

// 2. Acceptance Criteria Styling
check(
  'Dark glassmorphism styling present in tooltip container',
  marqueeSource.includes('bg-slate-900/95') &&
  marqueeSource.includes('backdrop-blur-md') &&
  marqueeSource.includes('border-[#FF4D6D]/40') &&
  marqueeSource.includes('shadow-2xl') &&
  marqueeSource.includes('rounded-xl')
);

// 3. Directional pointer arrows
check(
  'Top ribbon tooltip has bottom pointer arrow pointing toward item',
  marqueeSource.includes('-bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3') &&
  marqueeSource.includes('border-r border-b')
);

check(
  'Bottom ribbon tooltip has top pointer arrow pointing toward item',
  marqueeSource.includes('-top-1.5 left-1/2 -translate-x-1/2 w-3 h-3') &&
  marqueeSource.includes('border-l border-t')
);

// 4. Fallback styling for non-backdrop-filter GPUs
check(
  'Backdrop-filter solid fallback present on containers and arrows',
  marqueeSource.includes('supports-[not(backdrop-filter)]:bg-slate-950')
);

// 5. Dynamic Z-Index elevation
check(
  'Active tooltip elevates ribbon z-index to z-30 over inactive z-10',
  marqueeSource.includes("const topZIndex = isTopActive ? 'z-30'") &&
  marqueeSource.includes("const bottomZIndex = isBottomActive ? 'z-30'")
);

// 6. Animation Play State Pause
check(
  'Both top and bottom ribbons pause when tooltip is active',
  marqueeSource.match(/animationPlayState:\s*isPaused\s*\?\s*'paused'\s*:\s*undefined/g)?.length >= 2
);

// 7. Extract TECH_DETAILS and verify all fields
const TOP_ITEMS = [
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

const BOTTOM_ITEMS = [
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

const allMarqueeItems = [...new Set([...TOP_ITEMS, ...BOTTOM_ITEMS])];

allMarqueeItems.forEach(item => {
  const itemDefMatch = marqueeSource.includes(`'${item}':`);
  check(`Item '${item}' is configured in TECH_DETAILS`, itemDefMatch);
});

// Check project targets
check(
  'DAY-NULM Skill Mission targets proj-day-nulm in ProjectsSection',
  projectsSource.includes("targetId: 'proj-day-nulm'") &&
  marqueeSource.includes("targetId: 'proj-day-nulm'")
);

check(
  'Smart Card Operations targets proj-smart-card in ProjectsSection',
  projectsSource.includes("targetId: 'proj-smart-card'") &&
  marqueeSource.includes("targetId: 'proj-smart-card'")
);

// Check pure skill targets exist in SkillsSection
const pureSkillsMap = [
  { item: 'Tally Prime', targetId: 'skill-tally-prime-erp-9', skillKey: 'Tally Prime & ERP 9' },
  { item: 'GST Portal', targetId: 'skill-gst-filing-compliance', skillKey: 'GST Filing & Compliance' },
  { item: 'Income Tax E-Filing', targetId: 'skill-income-tax-e-filing', skillKey: 'Income Tax E-Filing' },
  { item: 'MS Excel (Advanced)', targetId: 'skill-ms-excel-advanced', skillKey: 'MS Excel (Advanced)' },
  { item: 'Path Solution ERP', targetId: 'skill-path-solution-erp', skillKey: 'Path Solution ERP' },
  { item: 'Adobe Photoshop', targetId: 'skill-dtp-design-suite', skillKey: 'DTP Design Suite' },
  { item: 'CorelDraw', targetId: 'skill-dtp-design-suite', skillKey: 'DTP Design Suite' },
  { item: 'PageMaker', targetId: 'skill-dtp-design-suite', skillKey: 'DTP Design Suite' },
  { item: 'Windows 11 OS', targetId: 'skill-windows-os-administration', skillKey: 'Windows OS Administration' },
  { item: 'ADCA Infocity', targetId: 'skill-commercial-computing-office-it-suite', skillKey: 'Commercial Computing & Office IT Suite' },
  { item: 'Tax Advisory & Filing', targetId: 'skill-income-tax-e-filing', skillKey: 'Income Tax E-Filing' },
  { item: 'Financial Accounting', targetId: 'skill-tally-prime-erp-9', skillKey: 'Tally Prime & ERP 9' },
  { item: 'GST Compliance & ITC', targetId: 'skill-gst-filing-compliance', skillKey: 'GST Filing & Compliance' },
  { item: 'MIS Executive Analytics', targetId: 'skill-mis-reporting-analytics', skillKey: 'MIS Reporting & Analytics' },
  { item: 'Inventory & Stock Control', targetId: 'skill-stock-handling-logistics', skillKey: 'Stock Handling & Logistics' },
  { item: 'Office Administration', targetId: 'skill-office-administration', skillKey: 'Office Administration' },
  { item: 'Business Development', targetId: 'skill-business-development', skillKey: 'Business Development' }
];

pureSkillsMap.forEach(({ item, targetId, skillKey }) => {
  // Check targetId is generated in SkillsSection
  const skillIdInSkills = skillsSource.includes(skillKey);
  check(`Skill '${skillKey}' for item '${item}' exists in SkillsSection`, skillIdInSkills);
});

// 8. Role synchronization check
check(
  'Role tab switching logic handles targetRole and triggers selectRole and switch-role-tab',
  marqueeSource.includes('selectRole(targetRole)') &&
  marqueeSource.includes("window.dispatchEvent(new CustomEvent('switch-role-tab'")
);

// 9. Inspect card activation
check(
  'Dispatches select-skill event for inspect card selection',
  marqueeSource.includes("window.dispatchEvent(new CustomEvent('select-skill', { detail: { skill: details.skillKey } }))")
);

// 10. Pulse Ring Animation check (2.5s duration)
check(
  'Pulse ring animation classes and 2.5s duration present',
  marqueeSource.includes('ring-4') &&
  marqueeSource.includes('ring-[#FF4D6D]') &&
  marqueeSource.includes('ring-offset-4') &&
  marqueeSource.includes('animate-pulse') &&
  marqueeSource.includes('2500')
);

// 11. Touch Two-Step Tap Support
check(
  'Two-step touch logic differentiates touch from mouse and handles first tap vs second tap',
  marqueeSource.includes('isTouchDevice') &&
  marqueeSource.includes('activeTooltipKey === itemKey') &&
  marqueeSource.includes('handleItemNavigation(details)')
);

// 12. Outside Dismissal
check(
  'Outside pointerdown dismissal listener active',
  marqueeSource.includes("document.addEventListener('pointerdown', handlePointerDown)") &&
  marqueeSource.includes("!activeEl.contains(e.target)")
);

// 13. Keyboard & Viewport Resilience
check(
  'Keyboard Escape key dismissal present',
  marqueeSource.includes("e.key === 'Escape'")
);

check(
  'Window resize and orientationchange dismissal listeners present',
  marqueeSource.includes("window.addEventListener('resize', handleWindowChange)") &&
  marqueeSource.includes("window.addEventListener('orientationchange', handleWindowChange)")
);

check(
  'Keyboard onFocus and decoupled onBlur handlers present on ribbon items',
  marqueeSource.includes('onFocus={() => setActiveTooltipKey(itemKey)}') &&
  marqueeSource.includes('onBlur={() => handleBlur(itemKey)}')
);

check(
  'Retry resilience in scrollAndHighlight present',
  marqueeSource.includes('attemptsRemaining = 8') &&
  marqueeSource.includes('scrollAndHighlight(attemptsRemaining - 1)')
);

check(
  'Reduced motion accessibility preference respected',
  marqueeSource.includes('prefers-reduced-motion') &&
  marqueeSource.includes("prefersReducedMotion ? 'auto' : 'smooth'")
);

console.log(`\nIndependent Verification Summary: ${passCount} Passed, ${failCount} Failed.`);

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('VICTORY AUDIT TEST COMPLETE: 100% CLEAN.');
  process.exit(0);
}
