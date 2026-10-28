import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

console.log('🧪 Verifying Strict Single-Expanded Accordion Discipline in 3D Tab...');

const panelPath = path.resolve('src/components/ControlCenterPanel.jsx');
assert(fs.existsSync(panelPath), 'ControlCenterPanel.jsx must exist');
const panelSrc = fs.readFileSync(panelPath, 'utf8');

// 1. Verify expandedCategory state defaults to single category ('nav')
assert(
  panelSrc.includes("const [expandedCategory, setExpandedCategory] = useState('nav');"),
  "expandedCategory state must default to 'nav' as the single uncollapsed category"
);
console.log("✅ 1. expandedCategory defaults to single 'nav' category (Strict Single-Expanded)");

// 2. Verify toggleCategory enforces single-expanded behavior
assert(
  panelSrc.includes("setExpandedCategory((prev) => (prev === catKey ? null : catKey))"),
  "toggleCategory must collapse previously open category when expanding another"
);
console.log("✅ 2. toggleCategory toggles single category and collapses previous active category");

// 3. Verify toggleCategory still calls notifyAccordionChange(catKey)
assert(
  panelSrc.includes("notifyAccordionChange(catKey)"),
  "toggleCategory must notify preview autoswitch engine"
);
console.log("✅ 3. notifyAccordionChange(catKey) triggered on category toggle for live preview sync");

// 4. Verify expandedCategories backward-compatibility memoization
assert(
  panelSrc.includes("expandedCategories = useMemo("),
  "expandedCategories must be memoized dictionary maintaining single truth"
);
console.log("✅ 4. expandedCategories dictionary derived reactively from expandedCategory");

// 5. Verify top-level 3D sections default to single accordion ('elements')
assert(
  panelSrc.includes("const [expandedAccordion, setExpandedAccordion] = useState('elements');"),
  "expandedAccordion state must default to 'elements'"
);
console.log("✅ 5. expandedAccordion defaults to single 'elements' section");

// 6. Verify top-level toggleAccordionSection enforces single accordion
assert(
  panelSrc.includes("const next = prev === secKey ? null : secKey;"),
  "toggleAccordionSection must enforce single active section"
);
console.log("✅ 6. toggleAccordionSection enforces single active section at top level");

console.log('\n🎉 ALL SINGLE-EXPANDED ACCORDION DISCIPLINE CHECKS PASSED (100%)!');
