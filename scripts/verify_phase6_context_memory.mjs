/**
 * scripts/verify_phase6_context_memory.mjs
 *
 * Verification Suite for Phase 6: Portfolio Engine RAG, Context Memory & Multi-turn Conversation
 * Validates:
 * 1. Module architecture & public contract exports (src/utils/portfolioContextMemory.js)
 * 2. Multi-turn context tracking (lastIntent, lastTopic, lastCaseStudyId, entityStack)
 * 3. Coreference & anaphoric pronoun resolution ("that", "it", "this", "second one", "cost of this", etc.)
 * 4. Comparative query disambiguation (accountant vs vibe coder, Tally vs AI SaaS)
 * 5. Compound query synthesis (Case Study 01 + pricing)
 * 6. Dynamic contextual suggestion chips derivation with valid category tagging
 * 7. Session memory reset and clear integration
 * 8. Zero external network/SDK dependencies
 * 9. Strict file size budget protection (< 110,000 bytes for portfolioAssistantEngine.js)
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('RUNNING PHASE 6 PORTFOLIO ENGINE RAG & CONTEXT MEMORY VERIFICATION');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${description}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${description}`);
    console.error(`     ${err.message}`);
    failCount++;
  }
}

// ----------------------------------------------------------------
// Suite 1: File Existence & Contract Signatures
// ----------------------------------------------------------------
console.log('--- Suite 1: Modular Architecture & Contract Signatures ---');

const memoryPath = path.join(rootDir, 'src/utils/portfolioContextMemory.js');
const enginePath = path.join(rootDir, 'src/utils/portfolioAssistantEngine.js');
const widgetPath = path.join(rootDir, 'src/components/AIChatWidget.jsx');

test('src/utils/portfolioContextMemory.js exists on disk', () => {
  assert(fs.existsSync(memoryPath), 'portfolioContextMemory.js must exist');
});

test('src/utils/portfolioAssistantEngine.js exists on disk', () => {
  assert(fs.existsSync(enginePath), 'portfolioAssistantEngine.js must exist');
});

test('src/components/AIChatWidget.jsx exists on disk', () => {
  assert(fs.existsSync(widgetPath), 'AIChatWidget.jsx must exist');
});

const memoryModule = await import('../src/utils/portfolioContextMemory.js');
const engineModule = await import('../src/utils/portfolioAssistantEngine.js');

test('portfolioContextMemory exports all required context functions', () => {
  assert(typeof memoryModule.createSessionMemory === 'function', 'Must export createSessionMemory');
  assert(typeof memoryModule.getConversationalContext === 'function', 'Must export getConversationalContext');
  assert(typeof memoryModule.updateConversationalContext === 'function', 'Must export updateConversationalContext');
  assert(typeof memoryModule.resetConversationalContext === 'function', 'Must export resetConversationalContext');
  assert(typeof memoryModule.resolveAnaphoricReferences === 'function', 'Must export resolveAnaphoricReferences');
  assert(typeof memoryModule.detectComparativeQuery === 'function', 'Must export detectComparativeQuery');
  assert(typeof memoryModule.detectCompoundQuery === 'function', 'Must export detectCompoundQuery');
  assert(typeof memoryModule.getDynamicContextualChips === 'function', 'Must export getDynamicContextualChips');
  assert(typeof memoryModule.synthesizeContextualResponse === 'function', 'Must export synthesizeContextualResponse');
  assert(typeof memoryModule.QUOTATION_DATA === 'object' && memoryModule.QUOTATION_DATA !== null, 'Must export QUOTATION_DATA');
});

test('portfolioAssistantEngine exports Phase 6 context methods and QUOTATION_DATA', () => {
  assert(typeof engineModule.getConversationalContext === 'function', 'Engine must re-export getConversationalContext');
  assert(typeof engineModule.resetConversationalContext === 'function', 'Engine must re-export resetConversationalContext');
  assert(typeof engineModule.resolveAnaphoricReferences === 'function', 'Engine must re-export resolveAnaphoricReferences');
  assert(typeof engineModule.QUOTATION_DATA === 'object', 'Engine must re-export QUOTATION_DATA');
});

// ----------------------------------------------------------------
// Suite 2: Multi-Turn Context Tracking & Anaphora Resolution
// ----------------------------------------------------------------
console.log('\n--- Suite 2: Multi-Turn Context Tracking & Anaphoric Resolution ---');

test('Turn 1: "Tell me about Case Study 01" establishes active case study context', () => {
  engineModule.clearSessionMemory();
  const res = engineModule.queryAssistant('Tell me about Case Study 01', { role: 'overview', audience: 'all' });
  assert(res && res.text, 'Must return response');
  assert(res.text.includes('Case Study #01') || res.text.includes('GST'), 'Must mention Case Study 01');

  const ctx = engineModule.getConversationalContext();
  assert.strictEqual(ctx.lastCaseStudyId, '01', 'Context must record lastCaseStudyId as "01"');
  assert.strictEqual(ctx.lastTopic, 'gst', 'Context must record lastTopic as "gst"');
  assert(ctx.turnsCount >= 1, 'Turns count must increment');
  assert(ctx.entityStack.length >= 1, 'Entity stack must have at least 1 entry');
});

test('Turn 2: "How much do you charge for that?" resolves to Case Study 01 GST quotation pricing', () => {
  const res = engineModule.queryAssistant('How much do you charge for that?', { role: 'overview', audience: 'all' });
  assert(res && res.text, 'Must return response');
  assert(res.text.includes('₹2,500') || res.text.includes('GST Return Filing'), 'Must include GST quotation fees for Case Study 01');
  assert(res.actions.some(a => a.type === 'open-estimator'), 'Must include open-estimator action');

  const ctx = engineModule.getConversationalContext();
  assert.strictEqual(ctx.lastCaseStudyId, '01', 'Active case study must remain "01"');
});

test('Turn 3: "What was the outcome?" resolves to Case Study 01 verified metrics', () => {
  const res = engineModule.queryAssistant('What was the outcome?', { role: 'overview', audience: 'all' });
  assert(res && res.text, 'Must return response');
  assert(res.text.includes('500+') || res.text.includes('₹2.5Cr+'), 'Must return metrics for Case Study 01');
  assert(res.actions.some(a => a.type === 'open-case-study'), 'Must include open-case-study action');
});

test('Turn 4: "What tech stack was used?" resolves to Case Study 01 technologies', () => {
  const res = engineModule.queryAssistant('What tech stack was used in this?', { role: 'overview', audience: 'all' });
  assert(res && res.text, 'Must return response');
  assert(res.text.includes('GST Portal') || res.text.includes('Tally Prime') || res.text.includes('ITR'), 'Must return Case Study 01 tech stack');
});

test('Ordinal Reference: "Tell me about the second one" switches active entity to Case Study 02', () => {
  const res = engineModule.queryAssistant('Tell me about the second one', { role: 'overview', audience: 'all' });
  assert(res && res.text, 'Must return response');
  assert(res.text.includes('Case Study #02') || res.text.includes('Tally'), 'Must return Case Study 02');

  const ctx = engineModule.getConversationalContext();
  assert.strictEqual(ctx.lastCaseStudyId, '02', 'Context must switch to "02"');
});

// ----------------------------------------------------------------
// Suite 3: Dynamic Contextual Suggestion Chips & Category Taxonomy
// ----------------------------------------------------------------
console.log('\n--- Suite 3: Dynamic Contextual Suggestion Chips ---');

const ALLOWED_CATEGORIES = new Set(['projects', 'tax', 'tech', 'experience', 'hire']);

test('Case Study 01 produces dynamic contextual chips (GSTR-2B, Tax Filing Quote, Accountant Resume)', () => {
  const chips = memoryModule.getDynamicContextualChips('01');
  assert(Array.isArray(chips) && chips.length >= 4, 'Must return >= 4 chips');

  const chipLabels = chips.map(c => c.label);
  assert(chipLabels.some(l => l.includes('GSTR-2B')), 'Must include GSTR-2B Reconciliation chip');
  assert(chipLabels.some(l => l.includes('Tax Filing Quote') || l.includes('Quote')), 'Must include Tax Quote chip');
  assert(chipLabels.some(l => l.includes('Accountant Resume') || l.includes('Resume')), 'Must include Accountant Resume chip');

  for (const c of chips) {
    assert(ALLOWED_CATEGORIES.has(c.category), `Category ${c.category} must be valid`);
  }
});

test('Case Study 07 produces dynamic contextual chips (Live Prototype, Next.js AI SaaS, MVP Quote)', () => {
  const chips = memoryModule.getDynamicContextualChips('07');
  const chipLabels = chips.map(c => c.label);
  assert(chipLabels.some(l => l.includes('Live Prototype')), 'Must include Live Prototype chip');
  assert(chipLabels.some(l => l.includes('AI SaaS')), 'Must include AI SaaS chip');
  assert(chipLabels.some(l => l.includes('Quote')), 'Must include Quote chip');

  for (const c of chips) {
    assert(ALLOWED_CATEGORIES.has(c.category), `Category ${c.category} must be valid`);
  }
});

// ----------------------------------------------------------------
// Suite 4: Comparative & Compound Query Synthesis
// ----------------------------------------------------------------
console.log('\n--- Suite 4: Comparative & Compound Queries ---');

test('Comparative Query: "compare accountant vs vibe coder" returns structured comparison table and dual actions', () => {
  const res = engineModule.queryAssistant('compare accountant vs vibe coder', { role: 'overview', audience: 'all' });
  assert(res && res.text, 'Must return response');
  assert(res.intent === 'compare', 'Intent must be "compare"');
  assert(res.text.includes('|') && res.text.includes('Corporate Accountant'), 'Must contain markdown comparison table');
  assert(res.actions.length >= 2, 'Must provide actions to switch between tracks');
});

test('Comparative Query: "difference between Tally and AI SaaS" handles cross-domain comparison', () => {
  const res = engineModule.queryAssistant('difference between Tally and AI SaaS', { role: 'overview', audience: 'all' });
  assert(res && res.intent === 'compare', 'Must classify as comparative query');
  assert(res.text.includes('Comparative Analysis'), 'Must render comparative analysis header');
});

test('Compound Query: "Tell me about Case Study 01 and how much it costs" blends project dossier with fee rates', () => {
  const res = engineModule.queryAssistant('Tell me about Case Study 01 and how much it costs', { role: 'overview', audience: 'all' });
  assert(res && res.text, 'Must return response');
  assert(res.intent === 'compound_project_pricing', 'Intent must be compound_project_pricing');
  assert(res.text.includes('Case Study #01') || res.text.includes('GST'), 'Must include project details');
  assert(res.text.includes('₹2,500') || res.text.includes('Commercial Pricing'), 'Must include commercial pricing');
  assert(res.actions.some(a => a.type === 'open-estimator'), 'Must include quotation calculator action');
  assert(res.actions.some(a => a.type === 'open-case-study'), 'Must include case study drawer action');
});

// ----------------------------------------------------------------
// Suite 5: Session Reset & Widget Integration
// ----------------------------------------------------------------
console.log('\n--- Suite 5: Session Reset & AIChatWidget Integration ---');

test('resetConversationalContext clears conversational context state', () => {
  const ctx = memoryModule.resetConversationalContext();
  assert.strictEqual(ctx.turnsCount, 0, 'turnsCount must reset to 0');
  assert.strictEqual(ctx.lastCaseStudyId, null, 'lastCaseStudyId must reset to null');
  assert.strictEqual(ctx.lastTopic, null, 'lastTopic must reset to null');
  assert.strictEqual(ctx.entityStack.length, 0, 'entityStack must reset to empty');
});

test('clearSessionMemory triggers resetConversationalContext', () => {
  memoryModule.updateConversationalContext('projects', 'gst', '01', 'accountant', {});
  assert.strictEqual(memoryModule.getConversationalContext().lastCaseStudyId, '01', 'Active context established');

  engineModule.clearSessionMemory();
  assert.strictEqual(memoryModule.getConversationalContext().lastCaseStudyId, null, 'Context must be cleared');
});

test('AIChatWidget imports and invokes resetConversationalContext in handleClearChat', () => {
  const widgetSource = fs.readFileSync(widgetPath, 'utf8');
  assert(widgetSource.includes('resetConversationalContext'), 'AIChatWidget must import resetConversationalContext');
  assert(widgetSource.includes('resetConversationalContext()'), 'AIChatWidget must invoke resetConversationalContext in handleClearChat');
});

// ----------------------------------------------------------------
// Suite 6: Offline Safety & Production File Size Budget
// ----------------------------------------------------------------
console.log('\n--- Suite 6: Offline Safety & Strict File Size Budget ---');

test('portfolioContextMemory.js has ZERO external imports or network calls', () => {
  const memSource = fs.readFileSync(memoryPath, 'utf8');
  assert(!memSource.includes('fetch('), 'Must not call fetch');
  assert(!memSource.includes('http://') && !memSource.includes('https://api.'), 'Must not reference external API URLs');
  assert(!memSource.includes('openai') && !memSource.includes('anthropic'), 'Must not reference external AI SDKs');
});

test('portfolioAssistantEngine.js strictly respects < 110,000 bytes budget', () => {
  const stats = fs.statSync(enginePath);
  console.log(`     [Size Check] portfolioAssistantEngine.js = ${stats.size} bytes (Limit: < 110,000 bytes)`);
  assert(stats.size < 110000, `File size ${stats.size} exceeds strict budget of 110,000 bytes`);
});

// ----------------------------------------------------------------
// Summary
// ----------------------------------------------------------------
console.log('\n================================================================');
console.log(`PHASE 6 TEST RESULTS: PASSED: ${passCount}, FAILED: ${failCount}`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🌟 ALL PHASE 6 RAG & CONTEXT MEMORY VERIFICATIONS PASSED! 🌟\n');
}
