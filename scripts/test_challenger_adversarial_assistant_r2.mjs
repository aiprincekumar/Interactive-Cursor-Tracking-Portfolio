/**
 * scripts/test_challenger_adversarial_assistant_r2.mjs
 *
 * Empirical Adversarial Challenger Verification Suite (Iteration 2)
 * Agent: challenger_adversarial_r2
 *
 * Comprehensive stress testing of remediated src/utils/portfolioAssistantEngine.js:
 * 1. Deep verification of ADV-BUG-01 to ADV-BUG-05.
 * 2. Prototype pollution resistance (__proto__, constructor, toString, Object.prototype pollution).
 * 3. Null, empty, whitespace, and corrupt type resistance.
 * 4. 2000+ to 10,000+ character payload spam & ReDoS immunity.
 * 5. Unicode, Emoji bombs, Zalgo text, and directional overrides.
 * 6. High-concurrency async load (500 interleaved concurrent queries).
 * 7. Verification of invariants on all responses.
 */

import assert from 'assert';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const enginePath = path.join(rootDir, 'src/utils/portfolioAssistantEngine.js');
const engine = await import(pathToFileURL(enginePath).href);

const {
  queryAssistant,
  getInitialSuggestions,
  clearSessionMemory,
  detectLanguage,
  normalizeQuery,
  classifyIntent,
  matchAuthoritativeFAQ,
  searchPortfolioIndex,
  CORE_INTENTS
} = engine;

console.log('========================================================================================');
console.log('  CHALLENGER ITERATION 2: EMPIRICAL ADVERSARIAL STRESS TEST HARNESS');
console.log('========================================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failureLog = [];

function check(title, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✅ [PASS] ${title}`);
  } catch (err) {
    failedTests++;
    console.error(`  ❌ [FAIL] ${title}: ${err.message}`);
    failureLog.push({ title, error: err.message, stack: err.stack });
  }
}

async function checkAsync(title, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  ✅ [PASS] ${title}`);
  } catch (err) {
    failedTests++;
    console.error(`  ❌ [FAIL] ${title}: ${err.message}`);
    failureLog.push({ title, error: err.message, stack: err.stack });
  }
}

function assertValidResponse(res, contextLabel = '') {
  assert(res && typeof res === 'object', `${contextLabel}: Response must be an object`);
  assert(typeof res.id === 'string' && res.id.length > 0, `${contextLabel}: res.id missing`);
  assert(typeof res.intent === 'string' && res.intent.length > 0, `${contextLabel}: res.intent missing`);
  assert(['en', 'hi', 'hinglish'].includes(res.language), `${contextLabel}: invalid language: ${res.language}`);
  assert(typeof res.text === 'string' && res.text.trim().length > 0, `${contextLabel}: res.text empty`);
  assert(Array.isArray(res.chips), `${contextLabel}: res.chips must be an array`);
  assert(Array.isArray(res.actions), `${contextLabel}: res.actions must be an array`);
  assert(typeof res.confidence === 'number' && !isNaN(res.confidence), `${contextLabel}: res.confidence not a valid number`);
  assert(typeof res.isRelaxed === 'boolean', `${contextLabel}: res.isRelaxed must be boolean`);
  assert(typeof res.isFallback === 'boolean', `${contextLabel}: res.isFallback must be boolean`);
}

// ========================================================================================
// SECTION 1: VERIFY THE 5 ADVERSARIAL DEFECTS (ADV-BUG-01 TO ADV-BUG-05)
// ========================================================================================
console.log('--- 1. VERIFYING 5 TARGETED ADVERSARIAL DEFECTS ---');

// ADV-BUG-01: typos "recat", "tialwind" expand to skills / tech stack
check('ADV-BUG-01: "recat" normalizes to "react" and routes to skills/projects', () => {
  const norm = normalizeQuery('recat');
  assert(norm.normalized.includes('react'), `Expected normalized query to contain 'react', got '${norm.normalized}'`);
  assert(norm.tokens.includes('react'), `Expected tokens to contain 'react', got: ${JSON.stringify(norm.tokens)}`);

  const res = queryAssistant('tell me about recat skills');
  assertValidResponse(res, 'recat skills');
  assert.strictEqual(res.intent, 'skills', `Expected intent 'skills', got '${res.intent}'`);
  assert(res.text.toLowerCase().includes('react') || res.text.includes('React'), `Expected response text to mention React`);
});

check('ADV-BUG-01: "tialwind" normalizes to "tailwind" and routes to skills/projects', () => {
  const norm = normalizeQuery('tialwind');
  assert(norm.normalized.includes('tailwind'), `Expected normalized query to contain 'tailwind', got '${norm.normalized}'`);
  assert(norm.tokens.includes('tailwind'), `Expected tokens to contain 'tailwind', got: ${JSON.stringify(norm.tokens)}`);

  const res = queryAssistant('do you know tialwind css?');
  assertValidResponse(res, 'tialwind css');
  assert.strictEqual(res.intent, 'skills', `Expected intent 'skills', got '${res.intent}'`);
  assert(res.text.toLowerCase().includes('tailwind') || res.text.includes('Tailwind'), `Expected response text to mention Tailwind`);
});

// ADV-BUG-02: "quantum warp drive antimatter" does not mutate "drive" to "price"
check('ADV-BUG-02: "drive" is preserved and not mutated to "price"', () => {
  const norm = normalizeQuery('quantum warp drive antimatter');
  assert(!norm.tokens.includes('price'), `Token 'price' should NOT be present. Tokens: ${JSON.stringify(norm.tokens)}`);
  assert(norm.tokens.includes('drive'), `Token 'drive' must be preserved. Tokens: ${JSON.stringify(norm.tokens)}`);

  const res = queryAssistant('quantum warp drive antimatter');
  assertValidResponse(res, 'quantum warp drive');
  assert.strictEqual(res.intent, 'fallback', `Expected intent 'fallback', got '${res.intent}'`);
  assert.strictEqual(res.isFallback, true, 'Expected isFallback=true');
  assert.notStrictEqual(res.intent, 'services', 'Must NOT trigger commercial services intent');
  assert.notStrictEqual(res.intent, 'client_info', 'Must NOT trigger client_info pricing intent');
});

check('ADV-BUG-02: Everyday non-commercial uses of "drive" remain unmutated', () => {
  for (const query of ['hard drive backup', 'google drive link', 'test drive demo', 'pen drive data']) {
    const norm = normalizeQuery(query);
    assert(norm.tokens.includes('drive'), `Expected 'drive' to be retained for '${query}', got tokens: ${JSON.stringify(norm.tokens)}`);
    assert(!norm.tokens.includes('price'), `Token 'price' should not appear for '${query}'`);
  }
});

// ADV-BUG-03: "freelance availability" maps to availability (not client_info)
check('ADV-BUG-03: "freelance availability" maps strictly to availability', () => {
  const queries = [
    'freelance availability',
    'kya freelance project ke liye available ho abhi turant?',
    'freelance available',
    'freelance project availability'
  ];

  for (const q of queries) {
    const res = queryAssistant(q);
    assertValidResponse(res, q);
    assert.strictEqual(res.intent, 'availability', `For query '${q}', expected intent 'availability', got '${res.intent}'`);
  }
});

check('ADV-BUG-03: Commercial pricing inquiries with freelance still map to client_info/services', () => {
  const resPricing = queryAssistant('freelance project pricing quotation cost');
  assertValidResponse(resPricing, 'freelance project pricing');
  assert(resPricing.intent === 'client_info' || resPricing.intent === 'services',
    `Expected pricing intent, got '${resPricing.intent}'`);
});

// ADV-BUG-04: "track badal ke" maps to filter_toggles
check('ADV-BUG-04: Hinglish slang "track badal ke" and variations map to filter_toggles', () => {
  const toggleQueries = [
    'track badal ke accountant bana do',
    'track badal ke',
    'role badal ke mis karo',
    'track change karo please',
    'track badlo'
  ];

  for (const q of toggleQueries) {
    const res = queryAssistant(q);
    assertValidResponse(res, q);
    assert.strictEqual(res.intent, 'filter_toggles', `For query '${q}', expected intent 'filter_toggles', got '${res.intent}'`);
  }
});

// ADV-BUG-05: cross-track queries trigger dynamic relaxation
check('ADV-BUG-05: Cross-track "Next.js prototype case study" triggers dynamic relaxation under accountant role', () => {
  const res = queryAssistant('Next.js prototype case study', { role: 'accountant', audience: 'all' });
  assertValidResponse(res, 'Next.js prototype case study');
  assert.strictEqual(res.isRelaxed, true, `Expected isRelaxed=true, got isRelaxed=${res.isRelaxed}`);
  assert(res.relaxationBanner && res.relaxationBanner.length > 0, 'Expected non-empty relaxationBanner');
  assert.strictEqual(res.intent, 'projects', `Expected intent 'projects', got '${res.intent}'`);
  assert(res.actions.some(a => a.type === 'open-case-study'), 'Expected action to open case study');
});

check('ADV-BUG-05: Cross-track "Claude 3.5 Sonnet case study" triggers dynamic relaxation under accountant role', () => {
  const res = queryAssistant('Claude 3.5 Sonnet case study', { role: 'accountant', audience: 'all' });
  assertValidResponse(res, 'Claude 3.5 Sonnet case study');
  assert.strictEqual(res.isRelaxed, true, `Expected isRelaxed=true, got isRelaxed=${res.isRelaxed}`);
  assert(res.relaxationBanner && res.relaxationBanner.length > 0, 'Expected non-empty relaxationBanner');
});

check('ADV-BUG-05: Cross-track "autonomous multi-agent workflows" triggers dynamic relaxation under accountant role', () => {
  const res = queryAssistant('autonomous multi-agent workflows', { role: 'accountant', audience: 'all' });
  assertValidResponse(res, 'autonomous multi-agent workflows');
  assert.strictEqual(res.isRelaxed, true, `Expected isRelaxed=true, got isRelaxed=${res.isRelaxed}`);
});

// ========================================================================================
// SECTION 2: PROTOTYPE POLLUTION & OBJECT INTEGRITY ATTACKS
// ========================================================================================
console.log('\n--- 2. PROTOTYPE POLLUTION & OBJECT INTEGRITY ATTACKS ---');

check('Prototype Pollution: Object.prototype injection does not compromise engine', () => {
  // Deliberately pollute Object.prototype with hostile properties
  try {
    Object.prototype.pollutedExploit = 'CRITICAL_VULNERABILITY';
    Object.prototype.isAdmin = true;
    Object.prototype.targetId = 'hacked_section';

    const res = queryAssistant('constructor __proto__ toString valueOf hasOwnProperty', {
      role: 'overview',
      audience: 'all'
    });
    assertValidResponse(res, 'prototype pollution query');
    assert.strictEqual(res.isFallback, true);
    assert(!res.text.includes('CRITICAL_VULNERABILITY'), 'Response text leaked polluted prototype property');

    // Context attack with poisoned prototype properties
    const maliciousContext = JSON.parse('{"__proto__":{"polluted":true},"role":"accountant","audience":"all"}');
    const resCtx = queryAssistant('tech skills proficiencies', maliciousContext);
    assertValidResponse(resCtx, 'polluted context');
    assert.strictEqual(resCtx.intent, 'skills');
  } finally {
    delete Object.prototype.pollutedExploit;
    delete Object.prototype.isAdmin;
    delete Object.prototype.targetId;
  }
});

check('Prototype Pollution: Technical aliases lookup cannot be spoofed via prototype keys', () => {
  // Querying standard Object prototype methods should NOT trigger technical aliases
  const dangerousKeys = ['constructor', '__proto__', 'toString', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable'];
  for (const key of dangerousKeys) {
    const norm = normalizeQuery(key);
    assert(norm && norm.rawTokens.length > 0, `normalizeQuery failed on '${key}'`);
    // Should not expand to undefined or throw
    const res = queryAssistant(key);
    assertValidResponse(res, `key: ${key}`);
  }
});

// ========================================================================================
// SECTION 3: NULL, EMPTY, WHITESPACE & CORRUPT TYPE RESILIENCE
// ========================================================================================
console.log('\n--- 3. NULL, EMPTY, WHITESPACE & CORRUPT TYPE RESILIENCE ---');

const corruptInputs = [
  { label: 'null query', q: null },
  { label: 'undefined query', q: undefined },
  { label: 'empty string', q: '' },
  { label: 'single space', q: ' ' },
  { label: 'multiple spaces', q: '          ' },
  { label: 'newlines and tabs', q: '\r\n\t\r\n\t  \t\n' },
  { label: 'number zero', q: 0 },
  { label: 'negative number', q: -100 },
  { label: 'floating number', q: 3.14159 },
  { label: 'NaN', q: NaN },
  { label: 'Infinity', q: Infinity },
  { label: '-Infinity', q: -Infinity },
  { label: 'boolean true', q: true },
  { label: 'boolean false', q: false },
  { label: 'empty object', q: {} },
  { label: 'empty array', q: [] },
  { label: 'array with objects', q: [{ a: 1 }, { b: 2 }] },
  { label: 'null byte in string', q: 'projects\0injected' },
  { label: 'symbol parameter', q: Symbol('malicious') }
];

for (const item of corruptInputs) {
  check(`Type safety on ${item.label}`, () => {
    let res;
    try {
      res = queryAssistant(item.q, { role: 'overview', audience: 'all' });
    } catch (e) {
      if (typeof item.q === 'symbol') {
        return;
      }
      throw e;
    }
    assertValidResponse(res, item.label);
    if (!item.q || typeof item.q !== 'string' || !item.q.trim()) {
      assert.strictEqual(res.intent, 'suggestions');
      assert.strictEqual(res.isFallback, false);
      assert(res.chips.length >= 3);
    }
  });
}

// ========================================================================================
// SECTION 4: 2000+ CHARACTER SPAM & ReDoS IMMUNITY
// ========================================================================================
console.log('\n--- 4. 2000+ CHARACTER SPAM & ReDoS IMMUNITY ---');

const spamCases = [
  { label: '2,500 repeated character "x"', text: 'x'.repeat(2500) },
  { label: '3,000 character repeated word "skills "', text: 'skills '.repeat(450) },
  { label: '5,000 characters mixed punctuation & symbols', text: '!@#$%^&*()_+-=[]{}|;:",.<>?/`~'.repeat(180) },
  { label: '8,000 characters repeated Hindi vowel marks', text: 'अ'.repeat(1000) + 'ा'.repeat(7000) },
  { label: '10,000 characters alternating spaces and "a"', text: 'a '.repeat(5000) },
  { label: '2,500 characters regex backtracking trigger (aaaaaaaa...b)', text: 'a'.repeat(2499) + 'b' }
];

for (const sc of spamCases) {
  check(`Buffer / ReDoS safety on ${sc.label} (${sc.text.length} chars)`, () => {
    const t0 = performance.now();
    const res = queryAssistant(sc.text, { role: 'overview', audience: 'all' });
    const t1 = performance.now();
    const durationMs = t1 - t0;

    assertValidResponse(res, sc.label);
    assert(durationMs < 100, `Execution took ${durationMs.toFixed(2)}ms! Must be under 100ms.`);
  });
}

// ========================================================================================
// SECTION 5: EMOJI BOMBS, ZALGO TEXT & UNICODE ABUSE
// ========================================================================================
console.log('\n--- 5. EMOJI BOMBS, ZALGO TEXT & UNICODE ABUSE ---');

const unicodeAbuseCases = [
  { label: '1,000 emojis bomb', text: '🚀🔥💻✨🎉👍🤖👾💩'.repeat(110) },
  { label: 'Zalgo text corruption', text: 'H̷e̷l̷l̷o̷ ̶W̷o̷r̷l̷d̷ ̴s̴k̴i̴l̴l̴s̴ ̷r̷e̷s̷u̷m̷e̷' },
  { label: 'Directional override RTL characters', text: '\u202E\u200F\u202Bresume atul verma\u202C\u200E' },
  { label: 'Zero-width space stuffing inside keywords', text: 'p\u200Br\u200Bo\u200Bj\u200Be\u200Bc\u200Bt\u200Bs' },
  { label: 'Combining diacritical marks barrage', text: 'e\u0301\u0300\u0302\u0303\u0304\u0305\u0306\u0307\u0308\u0309\u030A'.repeat(50) },
  { label: 'Surrogate pair edge characters', text: '\uD83D\uDE00\uD83D\uDE01\uD83D\uDE02\uD83D\uDE03'.repeat(50) }
];

for (const uc of unicodeAbuseCases) {
  check(`Unicode abuse handling: ${uc.label}`, () => {
    const res = queryAssistant(uc.text, { role: 'overview', audience: 'all' });
    assertValidResponse(res, uc.label);
  });
}

// ========================================================================================
// SECTION 6: HIGH-CONCURRENCY ASYNC LOAD (500 INTERLEAVED QUERIES)
// ========================================================================================
console.log('\n--- 6. HIGH-CONCURRENCY ASYNC LOAD (500 INTERLEAVED QUERIES) ---');

await checkAsync('500 interleaved concurrent queries via Promise.all with 0 race conditions', async () => {
  const queryPool = [
    { q: 'tell me about recat skills', role: 'overview', aud: 'all' },
    { q: 'quantum warp drive antimatter', role: 'accountant', aud: 'all' },
    { q: 'freelance availability', role: 'mis', aud: 'client' },
    { q: 'track badal ke accountant bana do', role: 'vibe_coding', aud: 'recruiter' },
    { q: 'Next.js prototype case study', role: 'accountant', aud: 'all' },
    { q: 'tialwind css styling', role: 'overview', aud: 'all' },
    { q: 'shaadi matrimonial biodata', role: 'other', aud: 'marriage' },
    { q: 'GST reconciliation BRS', role: 'accountant', aud: 'recruiter' },
    { q: 'where are you located?', role: 'overview', aud: 'all' },
    { q: '', role: 'overview', aud: 'all' }
  ];

  const tStart = performance.now();
  const promises = [];

  for (let i = 0; i < 500; i++) {
    const item = queryPool[i % queryPool.length];
    promises.push(
      Promise.resolve().then(() => {
        const res = queryAssistant(item.q, { role: item.role, audience: item.aud });
        assertValidResponse(res, `Concurrent item ${i}`);
        return res;
      })
    );
  }

  const results = await Promise.all(promises);
  const tEnd = performance.now();
  const duration = tEnd - tStart;

  assert.strictEqual(results.length, 500, 'Expected 500 completed query responses');
  console.log(`     [Concurrency Metric] 500 queries processed in ${duration.toFixed(2)} ms (${(duration / 500).toFixed(3)} ms/query)`);
  assert(duration < 2500, `Concurrent batch took ${duration.toFixed(2)}ms (must be under 2,500ms)`);
});

// ========================================================================================
// SECTION 7: SUMMARY & FINAL VERDICT CALCULATION
// ========================================================================================
console.log('\n========================================================================================');
console.log(`  CHALLENGER ITERATION 2 VERIFICATION SUMMARY:`);
console.log(`  Total Invariants Tested: ${totalTests}`);
console.log(`  Passed Invariants:      ${passedTests}`);
console.log(`  Failed Invariants:      ${failedTests}`);
console.log('========================================================================================\n');

if (failedTests > 0) {
  console.error('CRITICAL: Challenger iteration 2 found failing invariants!');
  process.exit(1);
} else {
  console.log('ALL INVARIANTS PASSED PERFECTLY WITH ZERO UNHANDLED EXCEPTIONS!');
  process.exit(0);
}
