import assert from 'node:assert';
import {
  queryAssistant,
  classifyIntent,
  normalizeQuery,
  matchAuthoritativeFAQ,
  searchPortfolioIndex,
  findMatchedSkill,
  PROJECT_KEYWORD_MAP,
  SKILL_LOOKUP_MAP
} from '../src/utils/portfolioAssistantEngine.js';

console.log('========================================================================================');
console.log('  CHALLENGER ITERATION 3: EMPIRICAL ADVERSARIAL STRESS & EDGE-CASE HARNESS');
console.log('========================================================================================\n');

let passedCount = 0;
function testInvariant(name, fn) {
  try {
    fn();
    passedCount++;
    console.log(`  ✅ [PASS] ${name}`);
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
    throw err;
  }
}

// ----------------------------------------------------------------------------------------
// 1. CASE STUDY RESOLUTION FOR ALL VARIATIONS (1-9, Single Digits, Hashes, Devanagari)
// ----------------------------------------------------------------------------------------
console.log('--- 1. Case Study Resolution Matrix (ASCII, Devanagari, Punctuation) ---');

const caseStudyVariations = [
  { q: 'case study 1', expectedId: '01' },
  { q: 'case study 01', expectedId: '01' },
  { q: 'project 2', expectedId: '02' },
  { q: 'proj 3', expectedId: '03' },
  { q: 'cs 4', expectedId: '04' },
  { q: '#5', expectedId: '05' },
  { q: '#06', expectedId: '06' },
  { q: 'project #7', expectedId: '07' },
  { q: 'case study #8', expectedId: '08' },
  { q: 'cs 9', expectedId: '09' },
  { q: '#9', expectedId: '09' },
  { q: '#09', expectedId: '09' },
  { q: 'केस स्टडी 1', expectedId: '01' },
  { q: 'केस स्टडी #8', expectedId: '08' },
  { q: 'केस स्टडी ९', expectedId: '09' },
  { q: 'केस स्टडी #८', expectedId: '08' },
  { q: 'प्रोजेक्ट ३', expectedId: '03' },
  { q: 'केस स्टडी#8--tally prime!!', expectedId: '08' }
];

for (const tc of caseStudyVariations) {
  testInvariant(`Case study extraction: "${tc.q}" -> #${tc.expectedId}`, () => {
    const res = queryAssistant(tc.q);
    assert.strictEqual(res.intent, 'projects', `Query "${tc.q}" must have intent "projects"`);
    const action = res.actions?.find(a => a.type === 'open-case-study');
    assert(action, `Query "${tc.q}" must have open-case-study action`);
    assert.strictEqual(action.payload?.id, tc.expectedId, `Expected ID ${tc.expectedId}, got ${action.payload?.id}`);
  });
}

// ----------------------------------------------------------------------------------------
// 2. FALSE-POSITIVE MULTI-DIGIT EXCLUSION (10, 80, etc. must not resolve to 01, 08)
// ----------------------------------------------------------------------------------------
console.log('\n--- 2. Multi-Digit Boundary Invariants (10, 80 must NOT extract single digits) ---');

const multiDigitQueries = [
  { q: 'case study 10', unexpectedId: '01' },
  { q: 'project 10', unexpectedId: '01' },
  { q: '#80', unexpectedId: '08' },
  { q: 'case study 25', unexpectedId: '02' }
];

for (const tc of multiDigitQueries) {
  testInvariant(`Boundary safety: "${tc.q}" must NOT falsely resolve to #${tc.unexpectedId}`, () => {
    const classification = classifyIntent(tc.q);
    assert.notStrictEqual(classification.entities?.projectId, tc.unexpectedId, `Should not match single digit`);
  });
}

// ----------------------------------------------------------------------------------------
// 3. SKILLS DATA RETRIEVAL FOR ALL 14 INDEXED SKILLS (R2 Invariant)
// ----------------------------------------------------------------------------------------
console.log('\n--- 3. Skill Data Depth & Action Buttons for All Core Skills ---');

const skillQueries = [
  { q: 'Power BI', expectedCaseStudy: '05' },
  { q: 'Excel VBA', expectedCaseStudy: '03' },
  { q: 'GST', expectedCaseStudy: '01' },
  { q: 'ITR', expectedCaseStudy: '01' },
  { q: 'Tally', expectedCaseStudy: '02' },
  { q: 'Corporate Audit', expectedCaseStudy: '06' },
  { q: 'Multi-Agent', expectedCaseStudy: '08' },
  { q: 'React', expectedCaseStudy: '07' },
  { q: 'Tailwind', expectedCaseStudy: '07' },
  { q: 'DAY-NULM', expectedCaseStudy: '03' },
  { q: 'Smart Card', expectedCaseStudy: '04' }
];

for (const sq of skillQueries) {
  testInvariant(`Skill depth: "${sq.q}" resolves with Case Study #${sq.expectedCaseStudy}`, () => {
    const res = queryAssistant(sq.q);
    const action = res.actions?.find(a => a.type === 'open-case-study');
    assert(action, `Query "${sq.q}" must include an open-case-study action button`);
    assert.strictEqual(action.payload?.id, sq.expectedCaseStudy, `Expected case study #${sq.expectedCaseStudy}, got #${action.payload?.id}`);
    assert(res.text && res.text.length > 50, `Text must contain substantive content`);
  });
}

// ----------------------------------------------------------------------------------------
// 4. FAQ FALSE-POSITIVE IMMUNITY (Stopwords & Short Tokens must NOT trigger FAQ)
// ----------------------------------------------------------------------------------------
console.log('\n--- 4. FAQ False-Positive Immunity (Short tokens & question words) ---');

const nonFaqShortQueries = [
  'how',
  'what',
  'is',
  'at',
  'to',
  'do',
  'you',
  'in',
  'cs 9'
];

for (const q of nonFaqShortQueries) {
  testInvariant(`FAQ Immunity: Short query "${q}" must NOT match authoritative FAQ`, () => {
    const hit = matchAuthoritativeFAQ(q);
    assert(hit === null, `Query "${q}" should not match FAQ (score: ${hit?.score})`);
  });
}

// ----------------------------------------------------------------------------------------
// 5. LEGITIMATE FAQ QUESTIONS MATCH CLEANLY
// ----------------------------------------------------------------------------------------
console.log('\n--- 5. Legitimate FAQ Matching ---');

const legitimateFaqs = [
  'Where are you located in India?',
  'आप भारत में कहाँ स्थित हैं?',
  'Kaha rehte ho? Office location kya hai?',
  'What is your autonomous coding stack and AI agent development workflow?'
];

for (const q of legitimateFaqs) {
  testInvariant(`Legitimate FAQ: "${q}" resolves to FAQ intent`, () => {
    const res = queryAssistant(q);
    assert.strictEqual(res.intent, 'faq', `Query "${q}" must resolve to intent "faq", got "${res.intent}"`);
  });
}

// ----------------------------------------------------------------------------------------
// 6. COMPOUND & CROSS-TRACK INVARIANTS
// ----------------------------------------------------------------------------------------
console.log('\n--- 6. Compound & Cross-Track Invariants ---');

testInvariant('Compound: "tell me about your GST and Power BI case studies" routes cleanly to primary project', () => {
  const res = queryAssistant('tell me about your GST and Power BI case studies');
  assert.strictEqual(res.intent, 'projects');
  const action = res.actions?.find(a => a.type === 'open-case-study');
  assert(action?.payload?.id === '01' || action?.payload?.id === '05');
});

testInvariant('Cross-Track Relaxation: "Next.js prototype" under role "accountant" triggers dynamic relaxation', () => {
  const res = queryAssistant('Next.js prototype', { role: 'accountant', audience: 'all' });
  assert.strictEqual(res.isRelaxed, true, 'Should trigger dynamic relaxation');
  const action = res.actions?.find(a => a.type === 'open-case-study');
  assert.strictEqual(action?.payload?.id, '07', 'Should recommend Case Study #07');
});

console.log('\n========================================================================================');
console.log(`  CHALLENGER ITERATION 3 SUMMARY: ${passedCount} INVARIANTS TESTED`);
console.log('========================================================================================\n');
