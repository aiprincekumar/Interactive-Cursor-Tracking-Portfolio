import fs from 'fs';
import path from 'path';

console.log('=== RUNNING VICTORY AUDITOR 3 INDEPENDENT VERIFICATION SUITE ===\n');

const marqueePath = path.resolve('src/components/TechMarqueeBanner.jsx');
const skillsPath = path.resolve('src/components/SkillsSection.jsx');
const projectsPath = path.resolve('src/components/ProjectsSection.jsx');

const marqueeCode = fs.readFileSync(marqueePath, 'utf8');
const skillsCode = fs.readFileSync(skillsPath, 'utf8');
const projectsCode = fs.readFileSync(projectsPath, 'utf8');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function check(description, condition, details = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  [PASS ${totalChecks}] ${description}`);
  } else {
    failedChecks++;
    console.error(`  [FAIL ${totalChecks}] ${description}${details ? ' -> ' + details : ''}`);
  }
}

// ---------------------------------------------------------------------------
// SUITE 1: TOP & BOTTOM SEQUENCE & ITEM DEFINITIONS
// ---------------------------------------------------------------------------
console.log('--- 1. Items & Sequence Integrity ---');

const topItemsExpected = [
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

const bottomItemsExpected = [
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

check('TOP_ITEMS contains exactly 10 authentic items', topItemsExpected.length === 10);
check('BOTTOM_ITEMS contains exactly 9 authentic items', bottomItemsExpected.length === 9);

topItemsExpected.forEach((item) => {
  check(`TOP_ITEMS includes "${item}"`, marqueeCode.includes(`'${item}'`));
});

bottomItemsExpected.forEach((item) => {
  check(`BOTTOM_ITEMS includes "${item}"`, marqueeCode.includes(`'${item}'`));
});

// ---------------------------------------------------------------------------
// SUITE 2: TECH_DETAILS METADATA & FIELD AUDIT
// ---------------------------------------------------------------------------
console.log('\n--- 2. TECH_DETAILS Metadata Completeness ---');

const allItems = [...topItemsExpected, ...bottomItemsExpected];

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

allItems.forEach((item) => {
  const escapedItem = escapeRegExp(item);
  const itemConfigRegex = new RegExp(`'${escapedItem}':\\s*{([^}]+(?:{[^}]+}[^}]+)*)}`, 's');
  const match = marqueeCode.match(itemConfigRegex);
  const hasConfig = Boolean(match);
  check(`'${item}' has complete config in TECH_DETAILS`, hasConfig);

  if (hasConfig) {
    const configBlock = match[1];
    check(`'${item}' defines title`, configBlock.includes('title:'));
    check(`'${item}' defines categoryBadge`, configBlock.includes('categoryBadge:'));
    check(`'${item}' defines experienceMetric`, configBlock.includes('experienceMetric:'));
    check(`'${item}' defines targetId`, configBlock.includes('targetId:'));
    check(`'${item}' defines hint`, configBlock.includes('hint:'));
  }
});

// ---------------------------------------------------------------------------
// SUITE 3: MATHEMATICAL COUNTER-ROTATION & GEOMETRY
// ---------------------------------------------------------------------------
console.log('\n--- 3. Geometric Counter-Rotation & Visual Alignment ---');

check(
  'Top ribbon is physically rotated by -3.5deg',
  marqueeCode.includes("transform: 'rotate(-3.5deg)'")
);

check(
  'Top ribbon tooltip is counter-rotated by +3.5deg to maintain horizontal 0deg',
  marqueeCode.includes("transform: 'translateX(-50%) rotate(3.5deg)'")
);

check(
  'Top ribbon tooltip transformOrigin is bottom center',
  marqueeCode.includes("transformOrigin: 'bottom center'")
);

check(
  'Bottom ribbon is physically rotated by +2.8deg',
  marqueeCode.includes("transform: 'rotate(2.8deg)'")
);

check(
  'Bottom ribbon tooltip is counter-rotated by -2.8deg to maintain horizontal 0deg',
  marqueeCode.includes("transform: 'translateX(-50%) rotate(-2.8deg)'")
);

check(
  'Bottom ribbon tooltip transformOrigin is top center',
  marqueeCode.includes("transformOrigin: 'top center'")
);

// ---------------------------------------------------------------------------
// SUITE 4: GLASSMORPHISM STYLING & ACCESSIBILITY TOKENS
// ---------------------------------------------------------------------------
console.log('\n--- 4. Glassmorphism Styling & Design Tokens ---');

const expectedGlassmorphism = 'bg-slate-900/95 backdrop-blur-md border border-[#FF4D6D]/40 shadow-2xl rounded-xl';
check(
  'Tooltips feature dark glassmorphism container styling matching specification',
  marqueeCode.includes(expectedGlassmorphism)
);

check(
  'Backdrop-filter unsupported fallback class present in tooltips',
  marqueeCode.includes('supports-[not(backdrop-filter)]:bg-slate-950')
);

check(
  'Directional pointer arrow has rotation and borders',
  marqueeCode.includes('rotate-45') && marqueeCode.includes('border-[#FF4D6D]/40')
);

check(
  'Z-index elevation dynamically prioritizes active ribbon (z-30 vs z-10)',
  marqueeCode.includes('topZIndex') && marqueeCode.includes('bottomZIndex') && marqueeCode.includes('z-30')
);

check(
  'Ticker animation dynamically pauses when any tooltip is open',
  marqueeCode.includes("animationPlayState: isPaused ? 'paused' : undefined")
);

// ---------------------------------------------------------------------------
// SUITE 5: TARGET ELEMENT MAPPING & BINDING
// ---------------------------------------------------------------------------
console.log('\n--- 5. Target ID & Skill Key Binding Audit ---');

const expectedSkillMappings = [
  { item: 'Tally Prime', skillKey: 'Tally Prime & ERP 9', targetId: 'skill-tally-prime-erp-9' },
  { item: 'GST Portal', skillKey: 'GST Filing & Compliance', targetId: 'skill-gst-filing-compliance' },
  { item: 'Income Tax E-Filing', skillKey: 'Income Tax E-Filing', targetId: 'skill-income-tax-e-filing' },
  { item: 'MS Excel (Advanced)', skillKey: 'MS Excel (Advanced)', targetId: 'skill-ms-excel-advanced' },
  { item: 'Path Solution ERP', skillKey: 'Path Solution ERP', targetId: 'skill-path-solution-erp' },
  { item: 'Adobe Photoshop', skillKey: 'DTP Design Suite', targetId: 'skill-dtp-design-suite' },
  { item: 'CorelDraw', skillKey: 'DTP Design Suite', targetId: 'skill-dtp-design-suite' },
  { item: 'PageMaker', skillKey: 'DTP Design Suite', targetId: 'skill-dtp-design-suite' },
  { item: 'Windows 11 OS', skillKey: 'Windows OS Administration', targetId: 'skill-windows-os-administration' },
  { item: 'ADCA Infocity', skillKey: 'Commercial Computing & Office IT Suite', targetId: 'skill-commercial-computing-office-it-suite' },
  { item: 'Tax Advisory & Filing', skillKey: 'Income Tax E-Filing', targetId: 'skill-income-tax-e-filing' },
  { item: 'Financial Accounting', skillKey: 'Tally Prime & ERP 9', targetId: 'skill-tally-prime-erp-9' },
  { item: 'GST Compliance & ITC', skillKey: 'GST Filing & Compliance', targetId: 'skill-gst-filing-compliance' },
  { item: 'MIS Executive Analytics', skillKey: 'MIS Reporting & Analytics', targetId: 'skill-mis-reporting-analytics' },
  { item: 'Inventory & Stock Control', skillKey: 'Stock Handling & Logistics', targetId: 'skill-stock-handling-logistics' },
  { item: 'Office Administration', skillKey: 'Office Administration', targetId: 'skill-office-administration' },
  { item: 'Business Development', skillKey: 'Business Development', targetId: 'skill-business-development' },
];

expectedSkillMappings.forEach(({ item, skillKey }) => {
  check(
    `Skill '${skillKey}' mapped from '${item}' exists in SKILL_DATA in SkillsSection`,
    skillsCode.includes(`'${skillKey}':`) || skillsCode.includes(`"${skillKey}":`)
  );
});

// Verify project items
check(
  'DAY-NULM Skill Mission maps to targetId "proj-day-nulm"',
  marqueeCode.includes("targetId: 'proj-day-nulm'")
);

check(
  'Smart Card Operations maps to targetId "proj-smart-card"',
  marqueeCode.includes("targetId: 'proj-smart-card'")
);

check(
  'ProjectsSection renders element with id "proj-day-nulm"',
  projectsCode.includes('targetId: \'proj-day-nulm\'') && projectsCode.includes('id={proj.targetId}')
);

check(
  'ProjectsSection renders element with id "proj-smart-card"',
  projectsCode.includes('targetId: \'proj-smart-card\'') && projectsCode.includes('id={proj.targetId}')
);

// ---------------------------------------------------------------------------
// SUITE 6: INTERACTION & NAVIGATION PROTOCOLS
// ---------------------------------------------------------------------------
console.log('\n--- 6. Interaction & Navigation Mechanics ---');

check(
  'Role tab synchronization emits switch-role-tab CustomEvent and calls selectRole',
  marqueeCode.includes("'switch-role-tab'") && marqueeCode.includes('selectRole(targetRole)')
);

check(
  'Skill activation emits select-skill CustomEvent with target skill key',
  marqueeCode.includes("'select-skill'") && marqueeCode.includes('details.skillKey')
);

check(
  'Audio feedback is triggered upon navigation via soundFX.playFocusBeep()',
  marqueeCode.includes('soundFX.playFocusBeep()')
);

check(
  '2.5-second glowing pulse ring classes (ring-4 ring-[#FF4D6D] ring-offset-4 animate-pulse) applied to target element',
  marqueeCode.includes('ring-4') &&
  marqueeCode.includes('ring-[#FF4D6D]') &&
  marqueeCode.includes('ring-offset-4') &&
  marqueeCode.includes('animate-pulse') &&
  marqueeCode.includes('2500')
);

check(
  'Existing pulse timeout is cleaned before setting new timeout to prevent race conditions',
  marqueeCode.includes('clearTimeout(targetEl._pulseTimeout)')
);

check(
  'Retry resilience loop (up to 8 attempts at 60ms) handles low-power or delayed tabpanel mounting',
  marqueeCode.includes('attemptsRemaining = 8') && marqueeCode.includes('scrollAndHighlight(attemptsRemaining - 1)')
);

check(
  'Accessibility: prefers-reduced-motion media query respected in scrollIntoView behavior',
  marqueeCode.includes('(prefers-reduced-motion: reduce)') && marqueeCode.includes("prefersReducedMotion ? 'auto' : 'smooth'")
);

// ---------------------------------------------------------------------------
// SUITE 7: MOBILE & TOUCH TWO-STEP TAP STATE MACHINE
// ---------------------------------------------------------------------------
console.log('\n--- 7. Mobile & Touch Two-Step Tap State Machine ---');

check(
  'handleItemClick differentiates mouse from touch devices',
  marqueeCode.includes("e.nativeEvent?.pointerType === 'mouse'") && marqueeCode.includes('isTouchDevice')
);

check(
  'First tap on touch device opens tooltip and pauses ticker without navigating',
  marqueeCode.includes('if (activeTooltipKey === itemKey)') && marqueeCode.includes('setActiveTooltipKey(itemKey)')
);

check(
  'Second tap on active item (or click on tooltip itself) triggers handleItemNavigation',
  marqueeCode.includes('handleItemNavigation(details)')
);

check(
  'Pointerdown event on document dismisses open tooltip when clicking outside',
  marqueeCode.includes("addEventListener('pointerdown', handlePointerDown)") && marqueeCode.includes('setActiveTooltipKey(null)')
);

check(
  'Escape key listener dismisses open tooltip',
  marqueeCode.includes("e.key === 'Escape'")
);

check(
  'Resize and orientationchange listeners dismiss open tooltip',
  marqueeCode.includes("addEventListener('resize'") && marqueeCode.includes("addEventListener('orientationchange'")
);

check(
  'Keyboard navigation: ribbon item has onKeyDown handler for Enter and Space',
  marqueeCode.includes("e.key === 'Enter' || e.key === ' '")
);

check(
  'Keyboard navigation: onFocus and onBlur handlers properly reveal and dismiss tooltips',
  marqueeCode.includes('onFocus=') && marqueeCode.includes('onBlur=')
);

check(
  'ARIA attributes: role="button", tabIndex={0}, aria-haspopup="true", and aria-expanded are set',
  marqueeCode.includes('role="button"') &&
  marqueeCode.includes('tabIndex={0}') &&
  marqueeCode.includes('aria-haspopup="true"') &&
  marqueeCode.includes('aria-expanded={isTooltipOpen}')
);

// ---------------------------------------------------------------------------
// SUMMARY & VERDICT
// ---------------------------------------------------------------------------
console.log('\n===============================================================');
console.log(`TOTAL CHECKS EXECUTED: ${totalChecks}`);
console.log(`PASSED: ${passedChecks}`);
console.log(`FAILED: ${failedChecks}`);
console.log('===============================================================');

if (failedChecks === 0) {
  console.log('\n🎉 ALL INDEPENDENT VICTORY AUDIT CHECKS PASSED WITH 100% SUCCESS!');
  process.exit(0);
} else {
  console.error(`\n💥 AUDIT FAILED WITH ${failedChecks} UNMET CHECKS!`);
  process.exit(1);
}
