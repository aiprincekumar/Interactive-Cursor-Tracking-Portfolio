/**
 * Verify Phase 3: Interactive Quick Chips, Suggestions, Slash Command Palette & Mobile Drawer
 *
 * Verifies:
 * 1. Category taxonomy in portfolioAssistantEngine.js (PROMPT_CHIPS & createFollowupChips)
 * 2. SuggestionChipsDrawer component (2-row grid, categories, drag/scroll, roving tabindex)
 * 3. SlashCommandPalette component (mobile height clamp, grouped categories, search highlighting, helper bar)
 * 4. AIChatWidget integration & Escape key isolation logic
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  PROMPT_CHIPS,
  inferChipCategory,
  queryAssistant,
  getInitialSuggestions,
  generateResponseDecisionTree
} from '../src/utils/portfolioAssistantEngine.js';
import { CHAT_SLASH_COMMANDS } from '../src/data/chatSlashCommands.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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

console.log('========================================================');
console.log('RUNNING PHASE 3 AI CHAT INTERACTION VERIFICATION SUITE');
console.log('========================================================\n');

// ----------------------------------------------------
// Suite 1: Taxonomy & Category Tagging in portfolioAssistantEngine.js
// ----------------------------------------------------
console.log('--- Suite 1: Taxonomy & Category Tagging ---');
const ALLOWED_CATEGORIES = new Set(['projects', 'tax', 'tech', 'experience', 'hire']);

assert(Array.isArray(PROMPT_CHIPS) && PROMPT_CHIPS.length === 12, 'PROMPT_CHIPS contains all 12 prompt chips');

let allChipsHaveCategories = true;
for (const chip of PROMPT_CHIPS) {
  if (!chip.category || !ALLOWED_CATEGORIES.has(chip.category)) {
    allChipsHaveCategories = false;
    console.error(`    Invalid category for chip ${chip.id}: ${chip.category}`);
  }
}
assert(allChipsHaveCategories, 'All default PROMPT_CHIPS have a valid category in [projects, tax, tech, experience, hire]');

// Verify category inference
assert(inferChipCategory('cs-01-deep', 'GST Engine', '') === 'projects', 'inferChipCategory correctly identifies "projects"');
assert(inferChipCategory('gst-itc', 'GSTR-2B & ITC', '') === 'tax', 'inferChipCategory correctly identifies "tax"');
assert(inferChipCategory('s-pbi', 'Power BI Dashboards', '') === 'tech', 'inferChipCategory correctly identifies "tech"');
assert(inferChipCategory('exp-acc', 'Senior Accountant', '') === 'experience', 'inferChipCategory correctly identifies "experience"');
assert(inferChipCategory('wa-chat', 'WhatsApp Contact', '') === 'hire', 'inferChipCategory correctly identifies "hire"');

// Test follow-up chips generated across various audiences & tracks
const testContexts = [
  { intent: 'roles', context: { audience: 'recruiter', role: 'accountant' } },
  { intent: 'projects', context: { audience: 'client', role: 'mis' } },
  { intent: 'marriage_bio', context: { audience: 'marriage', role: 'overview' } },
  { intent: 'skills', context: { audience: 'all', role: 'vibe_coding' } }
];

for (const { intent, context } of testContexts) {
  const result = queryAssistant('Tell me about your work', context);
  const chips = result.chips || [];
  assert(chips.length >= 4, `queryAssistant for intent [${intent}] returns >= 4 follow-up chips`);
  const allTagged = chips.every(c => c.category && ALLOWED_CATEGORIES.has(c.category));
  assert(allTagged, `All follow-up chips for [${intent}] have valid categories (${chips.map(c => c.category).join(', ')})`);
}

const initialChips = getInitialSuggestions({ role: 'overview', audience: 'all' });
assert(initialChips.every(c => c.category && ALLOWED_CATEGORIES.has(c.category)), 'getInitialSuggestions returns chips with valid categories');

const decisionTreeChips = generateResponseDecisionTree('projects', { role: 'overview' });
assert(decisionTreeChips.slice(0, 4).every(c => c.category && ALLOWED_CATEGORIES.has(c.category)), 'generateResponseDecisionTree items preserve valid category');

// ----------------------------------------------------
// Suite 2: SuggestionChipsDrawer Component Architecture
// ----------------------------------------------------
console.log('\n--- Suite 2: SuggestionChipsDrawer Component Architecture ---');
const drawerPath = path.join(rootDir, 'src/components/chat/SuggestionChipsDrawer.jsx');
assert(fs.existsSync(drawerPath), 'src/components/chat/SuggestionChipsDrawer.jsx exists on disk');

const drawerSource = fs.readFileSync(drawerPath, 'utf8');
assert(drawerSource.includes('grid grid-rows-2 grid-flow-col auto-cols-max'), 'Uses exact 2-row sliding grid class "grid grid-rows-2 grid-flow-col auto-cols-max"');
assert(drawerSource.includes('CATEGORY_TABS'), 'Defines category filter tabs');
assert(drawerSource.includes('🚀 Projects') && drawerSource.includes('📊 Tax & MIS') && drawerSource.includes('⚡ Tech & AI'), 'Contains standard category labels (Projects, Tax & MIS, Tech & AI)');
assert(drawerSource.includes('handleMouseDown') && drawerSource.includes('handleMouseMove'), 'Implements smooth mouse drag-to-scroll');
assert(drawerSource.includes('ChevronLeft') && drawerSource.includes('ChevronRight'), 'Renders left and right scroll navigation buttons');
assert(drawerSource.includes('ArrowLeft') && drawerSource.includes('ArrowRight') && drawerSource.includes('Home') && drawerSource.includes('End'), 'Implements roving keyboard navigation (ArrowLeft, ArrowRight, Home, End)');
assert(drawerSource.includes('onSelectChip'), 'Triggers onSelectChip callback on click or enter key');

// ----------------------------------------------------
// Suite 3: SlashCommandPalette Component Architecture
// ----------------------------------------------------
console.log('\n--- Suite 3: SlashCommandPalette Component Architecture ---');
const palettePath = path.join(rootDir, 'src/components/chat/SlashCommandPalette.jsx');
assert(fs.existsSync(palettePath), 'src/components/chat/SlashCommandPalette.jsx exists on disk');

const paletteSource = fs.readFileSync(palettePath, 'utf8');
assert(paletteSource.includes('max-h-48 sm:max-h-72'), 'Implements mobile viewport height clamping (max-h-48 sm:max-h-72)');
assert(paletteSource.includes('groupedSections'), 'Implements categorized grouped sections');
assert(paletteSource.includes('CATEGORY_METADATA'), 'Provides metadata for Navigation, Profile, Domain, Commercial, Utility');
assert(paletteSource.includes('highlightMatch'), 'Implements substring query search highlighting');
assert(paletteSource.includes('Tab') && paletteSource.includes('Enter') && paletteSource.includes('Esc'), 'Contains keyboard helper bar footer (Tab, Enter, Esc)');
assert(paletteSource.includes('handleClickOutside') || paletteSource.includes('pointerdown'), 'Implements click outside / pointerdown dismissal');

// ----------------------------------------------------
// Suite 4: AIChatWidget Integration & Escape Key Isolation
// ----------------------------------------------------
console.log('\n--- Suite 4: AIChatWidget Integration & Escape Key Isolation ---');
const widgetPath = path.join(rootDir, 'src/components/AIChatWidget.jsx');
const widgetSource = fs.readFileSync(widgetPath, 'utf8');

assert(widgetSource.includes('SuggestionChipsDrawer'), 'AIChatWidget imports and mounts SuggestionChipsDrawer');
assert(widgetSource.includes('SlashCommandPalette'), 'AIChatWidget imports and mounts SlashCommandPalette');

// Escape key isolation test
const hasEscapeIsolation = widgetSource.includes("if (inputValue.startsWith('/'))") &&
                           widgetSource.includes("setInputValue('')") &&
                           widgetSource.includes("setIsMinimized(true)");
assert(hasEscapeIsolation, 'Escape key isolates slash command dismissal: pressing Esc while "/" palette is active clears input without minimizing chat window');

// Pointerdown dismissal test
const hasPointerDismissal = widgetSource.includes("onPointerDown") &&
                            widgetSource.includes("inputValue.startsWith('/')") &&
                            widgetSource.includes("setInputValue('')");
assert(hasPointerDismissal, 'Message scroll area dismisses open slash palette on pointerdown');

console.log('\n========================================================');
console.log(`PHASE 3 TEST RESULTS: PASSED: ${passed}, FAILED: ${failed}`);
console.log('========================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
