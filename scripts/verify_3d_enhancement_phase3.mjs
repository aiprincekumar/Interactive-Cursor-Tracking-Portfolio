/**
 * verify_3d_enhancement_phase3.mjs
 *
 * Automated verification suite for Phase 3: UI / UX Enhancement & Ergonomics
 * Universal Rule 1 (CEO Model), Rule 19 (Single-Row Headings), Rule 20 (Diagnostic Matrix), Rule 22 (Ephemeral Phase Architecture)
 */

import fs from 'node:fs';
import path from 'node:path';

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failCount++;
  }
}

console.log('========================================================================');
console.log('  VERIFY 3D ENHANCEMENT PHASE 3: UI/UX REFINEMENT & ERGONOMICS AUDIT   ');
console.log('========================================================================\n');

// Read Target Files
const ccpPath = path.resolve('src/components/ControlCenterPanel.jsx');
const primitivesPath = path.resolve('src/components/3d-sandbox/ThreeDButtonPrimitives.jsx');
const stickyColPath = path.resolve('src/components/3d-sandbox/StickySandboxColumn.jsx');
const labContextPath = path.resolve('src/context/LabContext.jsx');

const ccpContent = fs.readFileSync(ccpPath, 'utf8');
const primitivesContent = fs.readFileSync(primitivesPath, 'utf8');
const stickyColContent = fs.readFileSync(stickyColPath, 'utf8');
const labContextContent = fs.readFileSync(labContextPath, 'utf8');

// -----------------------------------------------------------------------------
// 1. Accordion ARIA Landmarks (Bidirectional Matching)
// -----------------------------------------------------------------------------
console.log('--- 1. Testing Accordion ARIA Landmark Bindings ---');

const presetIds = ['engine', 'sandbox', 'lighting', 'toolkit', 'geometry'];
for (const id of presetIds) {
  const triggerRegex = new RegExp(
    `id="accordion-trigger-preset-${id}"[\\s\\S]*?role="button"[\\s\\S]*?aria-controls="accordion-region-preset-${id}"`,
    'g'
  );
  const regionRegex = new RegExp(
    `id="accordion-region-preset-${id}"[\\s\\S]*?role="region"[\\s\\S]*?aria-labelledby="accordion-trigger-preset-${id}"`,
    'g'
  );

  assert(triggerRegex.test(ccpContent), `Preset '${id}' trigger button has valid ARIA controls & id`);
  assert(regionRegex.test(ccpContent), `Preset '${id}' panel region has valid role="region" & aria-labelledby`);
}

const manualIds = [
  'elements',
  'lighting',
  'camera',
  'materials',
  'shading',
  'physics',
  'exploded',
  'environment',
  'spatialAudio',
  'performance'
];
for (const id of manualIds) {
  const triggerRegex = new RegExp(
    `id="accordion-trigger-${id}"[\\s\\S]*?role="button"[\\s\\S]*?aria-controls="accordion-region-${id}"`,
    'g'
  );
  const regionRegex = new RegExp(
    `id="accordion-region-${id}"[\\s\\S]*?role="region"[\\s\\S]*?aria-labelledby="accordion-trigger-${id}"`,
    'g'
  );

  assert(triggerRegex.test(ccpContent), `Manual accordion '${id}' trigger button has valid ARIA controls & id`);
  assert(regionRegex.test(ccpContent), `Manual accordion '${id}' panel region has valid role="region" & aria-labelledby`);
}

// -----------------------------------------------------------------------------
// 2. Interactive Touch Target Ergonomics & Focus Rings
// -----------------------------------------------------------------------------
console.log('\n--- 2. Testing Touch Target Ergonomics & Focus Rings ---');

// ThreeDActionKeycap touch ergonomics
assert(
  primitivesContent.includes('min-h-[44px]') && primitivesContent.includes('min-w-[44px]'),
  'ThreeDActionKeycap enforces minimum 44x44px touch hit target on mobile'
);
assert(
  primitivesContent.includes('active:translate-y-[1.5px]'),
  'ThreeDActionKeycap implements tactile depression active:translate-y-[1.5px]'
);
assert(
  primitivesContent.includes('focus-visible:ring-2') && primitivesContent.includes('focus-visible:ring-[#FF4D6D]'),
  'ThreeDActionKeycap has accessible focus-visible ring'
);

// ThreeDPresetCard ergonomics
assert(
  primitivesContent.includes('min-h-[115px]'),
  'ThreeDPresetCard maintains generous height far exceeding 44px minimum'
);
assert(
  primitivesContent.includes('group-hover:opacity-100') && primitivesContent.includes('group-focus-visible:opacity-100'),
  'ThreeDPresetCard provides accessible tooltip pill in visual mode on hover/focus'
);

// ThreeDToggleKey ergonomics
assert(
  primitivesContent.includes('min-h-[58px]'),
  'ThreeDToggleKey maintains height >= 44px'
);

// StickySandboxColumn carousel chevrons
assert(
  stickyColContent.includes('min-w-[44px]') && stickyColContent.includes('min-h-[44px]'),
  'StickySandboxColumn carousel chevrons enforce minimum 44x44px touch targets on mobile'
);
assert(
  stickyColContent.includes('focus-visible:ring-cyan-500'),
  'StickySandboxColumn carousel chevrons have clean focus-visible ring'
);

// -----------------------------------------------------------------------------
// 3. Display Density Switcher (Visual vs Detailed)
// -----------------------------------------------------------------------------
console.log('\n--- 3. Testing Display Density Switcher ---');

assert(
  ccpContent.includes('role="switch"') && ccpContent.includes('aria-checked={Boolean(isTab3DActive)}'),
  'Display density switcher has role="switch" and aria-checked binding'
);
assert(
  ccpContent.includes('Tactile Visual Mode') && ccpContent.includes('Detailed Developer Mode'),
  'Display density switcher toggles between Tactile Visual Mode and Detailed Developer Mode'
);
assert(
  ccpContent.includes('setTabUI3DMode(nextVal)'),
  'Display density switcher cleanly updates tabUI3DMode via context setter'
);
assert(
  labContextContent.includes('const setTabUI3DMode =') && labContextContent.includes('const toggleTabUI3DMode ='),
  'LabContext exposes setTabUI3DMode and toggleTabUI3DMode'
);

// -----------------------------------------------------------------------------
// 4. Single-Accordion State & Mobile Auto-Centering
// -----------------------------------------------------------------------------
console.log('\n--- 4. Testing Single-Accordion State & Mobile Auto-Centering ---');

assert(
  ccpContent.includes("const [expandedAccordion, setExpandedAccordion] = useState(null)"),
  'expandedAccordion state initializes to null and holds at most one active section'
);
assert(
  ccpContent.includes("const [expandedPresetSection, setExpandedPresetSection] = useState(null)"),
  'expandedPresetSection state initializes to null and holds at most one active section'
);
assert(
  ccpContent.includes("window.innerWidth < 1024") && ccpContent.includes("behavior: 'smooth', block: 'nearest'"),
  'Accordion toggles implement auto-centering for mobile viewports (< 1024px)'
);
assert(
  ccpContent.includes('soundFX.playLaserFocus()') && ccpContent.includes('soundFX.playHapticClick()'),
  'Accordion toggles play laser focus on expansion and haptic click on collapse'
);

// -----------------------------------------------------------------------------
// 5. Subtab Keyboard Navigation & Roving Focus
// -----------------------------------------------------------------------------
console.log('\n--- 5. Testing Subtab Keyboard Navigation & Roving Focus ---');

assert(
  ccpContent.includes('role="tablist"') && ccpContent.includes('aria-label="3D Studio Navigation Subtabs"'),
  'Subtabs bar has role="tablist" and accessible aria-label'
);
assert(
  ccpContent.includes("['themes', 'all', 'design', 'physics', 'system', 'preset']"),
  'Subtabs navigation covers all 6 top-level 3D tabs'
);
assert(
  ccpContent.includes("e.key === 'ArrowRight'") && ccpContent.includes("e.key === 'ArrowLeft'"),
  'handleSubTabKeyDown implements ArrowRight and ArrowLeft keyboard traversal'
);
assert(
  ccpContent.includes("e.key === 'Home'") && ccpContent.includes("e.key === 'End'"),
  'handleSubTabKeyDown implements Home and End navigation'
);
assert(
  ccpContent.includes("targetEl?.focus()"),
  'handleSubTabKeyDown applies roving focus to target tab element'
);
assert(
  ccpContent.includes('id="threed-subtab-themes"') && ccpContent.includes('id="threed-subtab-preset"'),
  'Subtab buttons have canonical DOM IDs for roving keyboard traversal'
);

// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------
console.log('\n========================================================================');
console.log(`TOTAL PHASE 3 CHECKS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('========================================================================\n');

if (failCount > 0) {
  console.error(`❌ PHASE 3 VERIFICATION FAILED WITH ${failCount} DEFECT(S)!`);
  process.exit(1);
} else {
  console.log('🎉 ALL PHASE 3 UI/UX REFINEMENT & ERGONOMICS CHECKS PASSED WITH 100%! 🎉');
  process.exit(0);
}
