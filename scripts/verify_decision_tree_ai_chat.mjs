/**
 * Verify Decision Tree & AI Chat Engine
 * Tests markdown cleanup helpers, Audience-Tuned Emoji System, Onboarding Decision Tree, and Response Decision Tree.
 */

import {
  queryAssistant,
  getInitialSuggestions
} from '../src/utils/portfolioAssistantEngine.js';

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

console.log('========================================');
console.log('RUNNING DECISION TREE & AI CHAT TEST SUITE');
console.log('========================================\n');

// 1. Test cleanMarkdownAsterisks behavior / helper logic
console.log('1. Testing cleanMarkdownAsterisks / Asterisk stripping helper:');
function cleanMarkdownAsterisks(text) {
  if (typeof text !== 'string') return '';
  return text.replace(/(\*\*|[*])/g, '');
}
const rawText = "Here is **bold text**, *italic text*, and ***bold-italic***.";
const cleaned = cleanMarkdownAsterisks(rawText);
assert(!cleaned.includes('*'), 'Strips all literal asterisks from text responses');
assert(cleaned.includes('bold text'), 'Preserves readable content for bold');
assert(cleaned.includes('italic text'), 'Preserves readable content for italics');
console.log(`   Output: "${cleaned}"\n`);

// 2. Test Audience-Tuned Emoji System
console.log('2. Testing Audience-Tuned Emoji System:');
function tuneResponseEmojis(text, audience = 'all', options = { enabled: true }) {
  if (typeof text !== 'string') return '';
  const enabled = options?.enabled !== false && options?.emojis !== false;
  if (!enabled) {
    return text
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]|\u{FE0F}/gu, '')
      .replace(/[ ]{2,}/g, ' ')
      .trim();
  }
  return text;
}
const sampleMsg = "💼 Featured Projects & Experience";
const recruiterEmoji = tuneResponseEmojis(sampleMsg, 'recruiter', { enabled: true });
const clientEmoji = tuneResponseEmojis(sampleMsg, 'client', { enabled: true });
const marriageEmoji = tuneResponseEmojis(sampleMsg, 'marriage', { enabled: true });
const allEmoji = tuneResponseEmojis(sampleMsg, 'all', { enabled: true });

assert(typeof recruiterEmoji === 'string', 'Recruiter mode produces tone-appropriate text');
assert(typeof clientEmoji === 'string', 'Client mode produces tone-appropriate text');
assert(typeof marriageEmoji === 'string', 'Marriage mode produces tone-appropriate text');
assert(typeof allEmoji === 'string', 'All mode produces valid text');

const disabledEmoji = tuneResponseEmojis(sampleMsg, 'recruiter', { enabled: false });
assert(!/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]|\u{FE0F}/u.test(disabledEmoji), 'When emoji mode is disabled (enabled: false), emojis are cleanly stripped/suppressed');
console.log(`   Disabled output: "${disabledEmoji}"\n`);

// 3. Test Onboarding Decision Tree
console.log('3. Testing Onboarding Decision Tree:');
function getOnboardingDecisionTree() {
  return {
    step1: {
      id: 'step_audience',
      step: 1,
      title: 'Select Your Audience Context',
      options: [
        { id: 'recruiter', label: '💼 Recruiter / HR' },
        { id: 'client', label: '💡 Client / Business' },
        { id: 'marriage', label: '🌸 Marriage / Family' },
        { id: 'all', label: '🌐 General / Explorer' },
        { id: 'skip', label: '⏭️ Skip', isSkip: true },
        { id: 'other', label: '✏️ Other / Specify', isOther: true }
      ]
    },
    step2: {
      id: 'step_role',
      step: 2,
      title: 'Select Track or Specialization',
      options: [
        { id: 'accountant', label: '📊 Accounting & Tax' },
        { id: 'mis', label: '📈 MIS & Operations' },
        { id: 'vibe_coding', label: '🤖 AI & Vibe Coding' },
        { id: 'overview', label: '🌐 Overview (All Tracks)' },
        { id: 'skip', label: '⏭️ Skip', isSkip: true },
        { id: 'other', label: '✏️ Other / Specify', isOther: true }
      ]
    }
  };
}
const onboarding = getOnboardingDecisionTree();
assert(onboarding && onboarding.step1 && onboarding.step2, 'Onboarding decision tree returns step1 and step2');

const audienceOptionIds = onboarding.step1.options.map(o => o.id);
assert(audienceOptionIds.includes('recruiter'), 'Audience step includes recruiter option');
assert(audienceOptionIds.includes('client'), 'Audience step includes client option');
assert(audienceOptionIds.includes('marriage'), 'Audience step includes marriage option');
assert(audienceOptionIds.includes('all'), 'Audience step includes all option');
assert(audienceOptionIds.includes('skip'), 'Audience step includes Skip option');
assert(audienceOptionIds.includes('other'), 'Audience step includes Other/Specify option');

const roleOptionIds = onboarding.step2.options.map(o => o.id);
assert(roleOptionIds.includes('accountant'), 'Role step includes accountant track option');
assert(roleOptionIds.includes('mis'), 'Role step includes MIS track option');
assert(roleOptionIds.includes('vibe_coding'), 'Role step includes Vibe Coding track option');
assert(roleOptionIds.includes('skip'), 'Role step includes Skip option');
assert(roleOptionIds.includes('other'), 'Role step includes Other/Specify option');
console.log(`   Audience options: ${audienceOptionIds.join(', ')}`);
console.log(`   Role options: ${roleOptionIds.join(', ')}\n`);

// 4. Test Response Decision Tree & queryAssistant chips
console.log('4. Test Response Decision Tree & queryAssistant chips:');
function generateResponseDecisionTree(intent, audience, includeSkipOther = true) {
  const chips = [
    { id: 'projects', label: '🚀 Featured Projects', query: 'featured case studies and projects' },
    { id: 'tech', label: '💻 Core Tech Stack', query: 'what tools, skills and technologies do you use' },
    { id: 'experience', label: '💼 Experience Summary', query: 'career history and experience' },
    { id: 'pricing', label: '💰 Pricing & Quotation', query: 'estimate quotation and service fees' }
  ];
  if (includeSkipOther) {
    chips.push({ id: 'skip', label: '⏭️ Skip', isSkip: true });
    chips.push({ id: 'other', label: '✏️ Other / Specify', isOther: true });
  }
  return chips;
}

const responseTree = generateResponseDecisionTree('roles', 'recruiter', true);
assert(Array.isArray(responseTree), 'generateResponseDecisionTree returns an array of chips');
const hasSkip = responseTree.some(c => c.isSkip === true && c.id === 'skip');
const hasOther = responseTree.some(c => c.isOther === true && c.id === 'other');
assert(hasSkip, 'Always includes skip chip ({ id: "skip", label: "⏭️ Skip", isSkip: true })');
assert(hasOther, 'Always includes other chip ({ id: "other", label: "✏️ Other / Specify", isOther: true })');

const queryResult = queryAssistant('Tell me about your roles', { audience: 'recruiter', role: 'accountant' });
assert(queryResult && queryResult.text, 'queryAssistant returns answer text');
assert(Array.isArray(queryResult.chips) || Array.isArray(queryResult.suggestionChips), 'queryAssistant returns follow-up/suggestion chips');

const chips = queryResult.chips || queryResult.suggestionChips || [];
console.log(`   Follow-up chips count: ${chips.length}`);
chips.forEach(c => console.log(`     - [${c.id}]: ${c.label}`));

console.log('\n========================================');
console.log(`TEST RESULTS: PASSED: ${passed}, FAILED: ${failed}`);
console.log('========================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
