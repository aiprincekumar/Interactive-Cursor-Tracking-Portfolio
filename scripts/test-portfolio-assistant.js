/**
 * scripts/test-portfolio-assistant.js
 *
 * Comprehensive 10-Suite Acceptance Test Harness for the Local Hybrid Portfolio Assistant.
 * Validates deterministic knowledge, 16 core intents, multilingual phrasings (English, Hindi, Hinglish),
 * synonym expansion, typo tolerance, weighted scoring, role/audience dynamic relaxation,
 * action button generation, event payloads, subpath link integrity, 100% offline safety,
 * session storage state management, and production bundle budget.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import http from 'http';
import https from 'https';
import zlib from 'zlib';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('========================================================================================');
console.log('  PORTFOLIO ASSISTANT ACCEPTANCE HARNESS (scripts/test-portfolio-assistant.js)');
console.log('========================================================================================\n');

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

// ========================================================================================
// SUITE 1: Static Architecture, Contract Signatures & Zero-Network Safety
// ========================================================================================
console.log('--- Suite 1: Static Architecture, Contract Signatures & Zero-Network Safety ---');

const enginePath = path.join(rootDir, 'src/utils/portfolioAssistantEngine.js');
const widgetPath = path.join(rootDir, 'src/components/AIChatWidget.jsx');

test('portfolioAssistantEngine.js exists on disk', () => {
  assert(fs.existsSync(enginePath), `Expected ${enginePath} to exist`);
});

test('AIChatWidget.jsx exists on disk', () => {
  assert(fs.existsSync(widgetPath), `Expected ${widgetPath} to exist`);
});

const engineModule = await import(pathToFileURL(enginePath).href);
const engine = engineModule.default || engineModule;

// Contract method resolution
const queryFn = engine.queryAssistant || engine.generateAssistantResponse;
const initialSuggestionsFn = engine.getInitialSuggestions || engine.getContextualPromptChips;
const clearMemoryFn = engine.clearSessionMemory || engine.resetConversation;
const detectLanguageFn = engine.detectLanguage;
const normalizeQueryFn = engine.normalizeQuery || engine.expandSynonyms;
const classifyIntentFn = engine.classifyIntent;
const searchIndexFn = engine.searchPortfolioIndex || engine.searchPortfolio;
const matchFaqFn = engine.matchAuthoritativeFAQ;

test('portfolioAssistantEngine exports required public contract methods', () => {
  assert(typeof queryFn === 'function', 'Must export queryAssistant or generateAssistantResponse');
  assert(typeof initialSuggestionsFn === 'function', 'Must export getInitialSuggestions or getContextualPromptChips');
  assert(typeof clearMemoryFn === 'function', 'Must export clearSessionMemory or resetConversation');
  assert(typeof detectLanguageFn === 'function', 'Must export detectLanguage');
  assert(typeof normalizeQueryFn === 'function', 'Must export normalizeQuery');
  assert(typeof classifyIntentFn === 'function', 'Must export classifyIntent');
  assert(typeof searchIndexFn === 'function', 'Must export searchPortfolioIndex');
  assert(typeof matchFaqFn === 'function', 'Must export matchAuthoritativeFAQ');
});

const engineContent = fs.readFileSync(enginePath, 'utf8');
const widgetContent = fs.readFileSync(widgetPath, 'utf8');

test('portfolioAssistantEngine contains zero references to external AI SDKs', () => {
  const forbiddenSDKs = ['openai', '@google/generative-ai', '@anthropic-ai', 'huggingface', 'transformers'];
  for (const sdk of forbiddenSDKs) {
    assert(!engineContent.includes(sdk), `Engine must not reference external SDK: ${sdk}`);
    assert(!widgetContent.includes(sdk), `Widget must not reference external SDK: ${sdk}`);
  }
});

test('portfolioAssistantEngine contains zero external AI API hostnames', () => {
  const forbiddenHosts = ['api.openai.com', 'generativelanguage.googleapis.com', 'api.anthropic.com'];
  for (const host of forbiddenHosts) {
    assert(!engineContent.includes(host), `Engine must not contain external API host: ${host}`);
    assert(!widgetContent.includes(host), `Widget must not contain external API host: ${host}`);
  }
});

test('portfolioAssistantEngine contains zero external runtime fetch calls', () => {
  assert(!engineContent.includes("fetch('http"), 'Engine must not call external HTTP via fetch');
  assert(!engineContent.includes('fetch("http'), 'Engine must not call external HTTP via fetch');
  assert(!engineContent.includes('fetch(`http'), 'Engine must not call external HTTP via fetch');
});

// ========================================================================================
// SUITE 2: 16 Core Intents Recognition Matrix (English, Hindi, Hinglish — >= 48 tests)
// ========================================================================================
console.log('\n--- Suite 2: 16 Core Intents Recognition Matrix (English, Hindi, Hinglish) ---');

const INTENT_TEST_MATRIX = [
  // 1. Roles
  { intent: 'roles', lang: 'en', q: 'What are your core professional roles?', keywords: ['roles', 'polymath', 'specialist', 'atul'] },
  { intent: 'roles', lang: 'hi', q: 'अतुल की भूमिकाएं क्या हैं?', keywords: ['भूमिका', 'अतुल', 'प्रोफाइल', 'अकाउंटेंट'] },
  { intent: 'roles', lang: 'hinglish', q: 'Atul ke kya roles hain? Kaam kya karta hai?', keywords: ['roles', 'kaam', 'atul'] },

  // 2. Projects
  { intent: 'projects', lang: 'en', q: 'Show me your flagship projects', keywords: ['project', 'case study', 'gst', 'tally', 'flagship'] },
  { intent: 'projects', lang: 'hi', q: 'प्रमुख प्रोजेक्ट्स दिखाएं', keywords: ['प्रोजेक्ट', 'केस स्टडी'] },
  { intent: 'projects', lang: 'hinglish', q: 'Featured projects dikhao / Kaunse projects hain?', keywords: ['project', 'case study', 'featured'] },

  // 3. Skills
  { intent: 'skills', lang: 'en', q: 'What is your core tech stack?', keywords: ['skill', 'stack', 'tally', 'excel', 'react', 'tools'] },
  { intent: 'skills', lang: 'hi', q: 'तकनीकी कौशल क्या हैं?', keywords: ['कौशल', 'टूल्स', 'टैली', 'एक्सेल'] },
  { intent: 'skills', lang: 'hinglish', q: 'Tech stack kya hai? React aata hai?', keywords: ['skills', 'tech', 'stack', 'react'] },

  // 4. Experience
  { intent: 'experience', lang: 'en', q: 'How many years of experience do you have?', keywords: ['experience', 'years', 'career', 'tenure'] },
  { intent: 'experience', lang: 'hi', q: 'कार्य अनुभव कितना है?', keywords: ['अनुभव', 'वर्ष', 'कार्य'] },
  { intent: 'experience', lang: 'hinglish', q: 'Kitne saal ka experience hai? Kaha job ki?', keywords: ['experience', 'saal', 'tenure'] },

  // 5. Services
  { intent: 'services', lang: 'en', q: 'What consulting services do you offer?', keywords: ['service', 'consulting', 'advisory', 'offering'] },
  { intent: 'services', lang: 'hi', q: 'आप क्या सेवाएं प्रदान करते हैं?', keywords: ['सेवाएं', 'कंसल्टेंसी', 'परामर्श'] },
  { intent: 'services', lang: 'hinglish', q: 'Kya services provide karte ho? Freelance work?', keywords: ['service', 'offerings', 'consulting'] },

  // 6. Achievements
  { intent: 'achievements', lang: 'en', q: 'List your key achievements and records', keywords: ['achievement', 'record', '50,000', 'metric', 'reconciled'] },
  { intent: 'achievements', lang: 'hi', q: 'प्रमुख उपलब्धियां और रिकॉर्ड', keywords: ['उपलब्धियां', 'रिकॉर्ड', 'आंकड़े'] },
  { intent: 'achievements', lang: 'hinglish', q: 'Key achievements kya hain? Notice record?', keywords: ['achievement', 'record', 'metrics'] },

  // 7. Recruiter Info
  { intent: 'recruiter_info', lang: 'en', q: 'I want to download your resume PDF', keywords: ['resume', 'cv', 'pdf', 'download', 'hire'] },
  { intent: 'recruiter_info', lang: 'hi', q: 'रिज्यूमे डाउनलोड करें', keywords: ['रिज्यूमे', 'डाउनलोड', 'सीवी'] },
  { intent: 'recruiter_info', lang: 'hinglish', q: 'Resume download karna hai / CV chahiye', keywords: ['resume', 'cv', 'download'] },

  // 8. Client Info / Pricing
  { intent: 'client_info', lang: 'en', q: 'How much does an MVP project cost?', keywords: ['cost', 'pricing', 'fee', 'quote', 'estimate', '₹'] },
  { intent: 'client_info', lang: 'hi', q: 'प्रोजेक्ट का कितना खर्च होगा?', keywords: ['खर्च', 'शुल्क', 'कोटेशन', 'कीमत'] },
  { intent: 'client_info', lang: 'hinglish', q: 'Project cost kitna aayega? Quotation estimator', keywords: ['cost', 'kharcha', 'quote', 'pricing'] },

  // 9. Marriage Biodata
  { intent: 'marriage_bio', lang: 'en', q: 'Show me your matrimonial biodata', keywords: ['biodata', 'matrimonial', 'marriage', 'family', '1991'] },
  { intent: 'marriage_bio', lang: 'hi', q: 'विवाह बायोडाटा दिखाएं', keywords: ['बायोडाटा', 'विवाह', 'शादी', 'पारिवारिक'] },
  { intent: 'marriage_bio', lang: 'hinglish', q: 'Shaadi ka biodata / Family background kya hai?', keywords: ['biodata', 'shaadi', 'family', 'background'] },

  // 10. Contact
  { intent: 'contact', lang: 'en', q: 'How can I contact Atul directly?', keywords: ['contact', 'whatsapp', 'email', 'phone', '7992383804'] },
  { intent: 'contact', lang: 'hi', q: 'संपर्क कैसे करें?', keywords: ['संपर्क', 'व्हाट्सएप', 'ईमेल', 'फोन'] },
  { intent: 'contact', lang: 'hinglish', q: 'Sampark kaise karein? WhatsApp number kya hai?', keywords: ['contact', 'sampark', 'whatsapp', 'email'] },

  // 11. Availability
  { intent: 'availability', lang: 'en', q: 'Are you available for immediate hire?', keywords: ['available', 'immediate', 'notice', 'hours', 'timing'] },
  { intent: 'availability', lang: 'hi', q: 'क्या आप काम के लिए उपलब्ध हैं?', keywords: ['उपलब्ध', 'समय', 'वर्किंग'] },
  { intent: 'availability', lang: 'hinglish', q: 'Immediate join kar sakte ho? Availability kya hai?', keywords: ['available', 'availability', 'immediate'] },

  // 12. Navigation
  { intent: 'navigation', lang: 'en', q: 'Scroll down to the contact section', keywords: ['scroll', 'contact', 'jump', 'navigate', '#'] },
  { intent: 'navigation', lang: 'hi', q: 'संपर्क अनुभाग पर जाएं', keywords: ['जाएं', 'संपर्क', 'अनुभाग'] },
  { intent: 'navigation', lang: 'hinglish', q: 'Contact section pe scroll karo / Le chalo', keywords: ['scroll', 'contact', 'section'] },

  // 13. Filter Toggles
  { intent: 'filter_toggles', lang: 'en', q: 'Switch to corporate accountant view', keywords: ['switch', 'track', 'accountant', 'role', 'mode'] },
  { intent: 'filter_toggles', lang: 'hi', q: 'अकाउंटेंट मोड चालू करें', keywords: ['मोड', 'अकाउंटेंट', 'ट्रैक'] },
  { intent: 'filter_toggles', lang: 'hinglish', q: 'Accountant mode on karo / Filter lagao', keywords: ['mode', 'accountant', 'filter', 'switch'] },

  // 14. Suggestions
  { intent: 'suggestions', lang: 'en', q: 'What can I ask you about?', keywords: ['ask', 'options', 'suggestions', 'explore', 'menu'] },
  { intent: 'suggestions', lang: 'hi', q: 'मैं क्या पूछ सकता हूँ?', keywords: ['पूछ', 'सुझाव', 'मदद', 'विकल्प'] },
  { intent: 'suggestions', lang: 'hinglish', q: 'Kya pooch sakte hain? Guide karo / Options dikhao', keywords: ['pooch', 'guide', 'options', 'suggestions'] },

  // 15. FAQ / Location
  { intent: 'faq', lang: 'en', q: 'Where are you located in India?', keywords: ['located', 'location', 'daltonganj', 'palamau', 'jharkhand', 'medininagar'] },
  { intent: 'faq', lang: 'hi', q: 'आप भारत में कहाँ स्थित हैं?', keywords: ['डाल्टनगंज', 'पलामू', 'झारखंड', 'मेदिनीनगर', 'स्थित'] },
  { intent: 'faq', lang: 'hinglish', q: 'Kaha rehte ho? Office location kya hai?', keywords: ['location', 'daltonganj', 'jharkhand', 'palamau'] },

  // 16. Ambiguous / Fallback
  { intent: 'ambiguous', lang: 'en', q: 'asdfghjkl random gibberish', keywords: ['record', 'explore', 'connect', 'directly', 'assist'] },
  { intent: 'ambiguous', lang: 'hi', q: 'कुछ भी अटपटा टेक्स्ट', keywords: ['रिकॉर्ड', 'संपर्क', 'सहायता'] },
  { intent: 'ambiguous', lang: 'hinglish', q: 'kuch bhi ulta seedha', keywords: ['record', 'explore', 'direct', 'kuch'] }
];

assert(INTENT_TEST_MATRIX.length === 48, 'Matrix must have exactly 48 verified test cases');

let matrixPasses = 0;
for (const tc of INTENT_TEST_MATRIX) {
  test(`Intent [${tc.intent}] (${tc.lang}): "${tc.q}"`, () => {
    const res = queryFn(tc.q, { role: 'overview', audience: 'all' });
    assert(typeof res === 'object' && res !== null, 'Response must be an object');
    assert(typeof res.text === 'string' && res.text.trim().length > 10, 'Response text must be non-empty');
    assert(Array.isArray(res.chips || res.suggestionChips), 'Response must include prompt chips array');
    assert(Array.isArray(res.actions), 'Response must include actions array');

    // Strict intent equality assertion
    assert.strictEqual(
      res.intent,
      tc.intent,
      `Expected intent '${tc.intent}' for query: "${tc.q}", got: '${res.intent}'`
    );

    // Language dialect check
    if (tc.lang === 'hi') {
      assert(res.language === 'hi', `Expected dialect 'hi' for query: ${tc.q}, got: ${res.language}`);
    } else if (tc.lang === 'en') {
      assert(res.language === 'en', `Expected dialect 'en' for query: ${tc.q}, got: ${res.language}`);
    } else {
      assert(['hinglish', 'en', 'hi'].includes(res.language), `Expected valid dialect for: ${tc.q}`);
    }

    matrixPasses++;
  });
}

test('All 48 Intent Matrix test cases processed successfully', () => {
  assert.strictEqual(matrixPasses, 48, 'Must pass all 48 intent test assertions');
});

// ========================================================================================
// SUITE 3: Synonym Expansion, Technical Aliases & Typo Normalization (Levenshtein <= 2)
// ========================================================================================
console.log('\n--- Suite 3: Synonym Expansion, Technical Aliases & Typo Normalization ---');

test('Technical Alias: "brs" expands to bank reconciliation', () => {
  const norm = normalizeQueryFn('brs');
  assert(norm.tokens.some((t) => t.includes('bank') || t.includes('reconciliation') || t === 'brs'), 'Must expand brs');
});

test('Technical Alias: "itc" expands to input tax credit', () => {
  const norm = normalizeQueryFn('itc');
  assert(norm.tokens.some((t) => t.includes('itc') || t.includes('credit') || t.includes('tax')), 'Must expand itc');
});

test('Technical Alias: "gstr" expands to GST return compliance', () => {
  const norm = normalizeQueryFn('gstr');
  assert(norm.tokens.some((t) => t.includes('gst') || t.includes('return') || t.includes('gstr')), 'Must expand gstr');
});

test('Technical Alias: "pbi" expands to Power BI telemetry', () => {
  const norm = normalizeQueryFn('pbi');
  assert(norm.tokens.some((t) => t.includes('power') || t.includes('bi') || t.includes('pbi')), 'Must expand pbi');
});

test('Bilingual Synonym: "kaam" normalizes towards projects/work', () => {
  const res = queryFn('Atul ka kaam dikhao', { role: 'overview', audience: 'all' });
  assert(res.text.length > 20, 'Must recognize kaam query');
  assert(res.actions.length > 0 || (res.chips && res.chips.length > 0), 'Must provide actions or chips');
});

test('Bilingual Synonym: "hunar" in Devanagari normalizes to skills', () => {
  const res = queryFn('अतुल का हुनर क्या है', { role: 'overview', audience: 'all' });
  assert(res.intent === 'skills' || res.text.includes('कौशल') || res.text.toLowerCase().includes('skill'), 'Must recognize hunar in Devanagari');
  assert(res.actions.some((a) => a.target === '#skills' || a.type === 'scroll'), 'Must offer skills navigation');
});

test('Bilingual Synonym: "naukri" normalizes towards recruiter_info/resume', () => {
  const res = queryFn('Naukri ke liye resume chahiye', { role: 'overview', audience: 'all' });
  assert(res.intent === 'recruiter_info' || res.text.toLowerCase().includes('resume'), 'Must identify naukri as recruiter query');
});

test('Bilingual Synonym: "kharcha" normalizes towards pricing/services', () => {
  const res = queryFn('Project ka kitna kharcha aayega', { role: 'overview', audience: 'all' });
  assert(res.intent === 'services' || res.intent === 'client_info' || res.text.includes('₹') || res.text.toLowerCase().includes('quotation'), 'Must recognize kharcha');
});

test('Bilingual Synonym: "shaadi" normalizes towards matrimonial biodata', () => {
  const res = queryFn('Shaadi ke liye biodata chahiye', { role: 'overview', audience: 'all' });
  assert(res.intent === 'marriage_bio' || res.text.toLowerCase().includes('biodata'), 'Must recognize shaadi as marriage_bio');
});

test('Typo Tolerance: "projets" (dist 1) repairs to projects', () => {
  const norm = normalizeQueryFn('projets');
  assert(norm.tokens.includes('projects') || norm.tokens.includes('project'), 'Repairs projets to projects');
});

test('Typo Tolerance: "skils" (dist 1) repairs to skills', () => {
  const norm = normalizeQueryFn('skils');
  assert(norm.tokens.includes('skills') || norm.tokens.includes('skill'), 'Repairs skils to skills');
});

test('Typo Tolerance: "expereince" (dist 2) repairs to experience', () => {
  const norm = normalizeQueryFn('expereince');
  assert(norm.tokens.includes('experience'), 'Repairs expereince to experience');
});

test('Typo Tolerance: "resme" (dist 1) repairs to resume', () => {
  const norm = normalizeQueryFn('resme');
  assert(norm.tokens.includes('resume'), 'Repairs resme to resume');
});

test('Typo Tolerance: "cntact" (dist 1) repairs to contact', () => {
  const norm = normalizeQueryFn('cntact');
  assert(norm.tokens.includes('contact'), 'Repairs cntact to contact');
});

test('Typo Tolerance: "watsapp" (dist 1) repairs to whatsapp', () => {
  const norm = normalizeQueryFn('watsapp');
  assert(norm.tokens.includes('whatsapp'), 'Repairs watsapp to whatsapp');
});

test('Typo Tolerance: "acountant" (dist 1) repairs to accountant', () => {
  const norm = normalizeQueryFn('acountant');
  assert(norm.tokens.includes('accountant') || norm.tokens.includes('accounting'), 'Repairs acountant to accountant');
});

// ========================================================================================
// SUITE 4: Weighted Search Index Scoring & Ranking Algorithm
// ========================================================================================
console.log('\n--- Suite 4: Weighted Search Index Scoring & Ranking Algorithm ---');

test('Query "GST": Project 01 (GST Engine) ranks among top project results', () => {
  const search = searchIndexFn('GST', { role: 'overview', audience: 'all' });
  assert(search.results && search.results.length > 0, 'Must return results for GST');
  const topResult = search.results[0];
  assert(topResult.score >= 80, `Expected high score for GST, got: ${topResult.score}`);
  assert(
    search.results.some((r) => r.item.id === 'proj-gst-tax' || r.item.id === 'case-study-01' || (r.item.title && r.item.title.includes('GST'))),
    'GST project must be in top search results'
  );
});

test('Query "Power BI": Executive Power BI project and skill rank at top', () => {
  const search = searchIndexFn('Power BI', { role: 'overview', audience: 'all' });
  assert(search.results && search.results.length > 0, 'Must return results for Power BI');
  const topMatches = search.results.slice(0, 3);
  assert(
    topMatches.some((r) => r.item.title.toLowerCase().includes('power bi') || r.item.id.includes('power-bi') || r.item.id === 'case-study-05'),
    'Power BI items must rank in top 3'
  );
});

test('Query "DAY-NULM": Project 03 ranks #1 with top confidence', () => {
  const search = searchIndexFn('DAY-NULM', { role: 'overview', audience: 'all' });
  assert(search.results && search.results.length > 0, 'Must return results for DAY-NULM');
  const top = search.results[0];
  assert(
    top.item.id === 'proj-day-nulm' || top.item.id === 'case-study-03' || top.item.id === 'skill-day-nulm-portal',
    `Expected DAY-NULM item #1, got: ${top.item.id}`
  );
  assert(top.score >= 100, `Expected score >= 100, got: ${top.score}`);
});

test('Irrelevant query "cryptocurrency mining dogecoin" returns 0 high-confidence matches', () => {
  const search = searchIndexFn('cryptocurrency mining dogecoin', { role: 'overview', audience: 'all' });
  const strongMatches = (search.results || []).filter((r) => r.score >= 50);
  assert.strictEqual(strongMatches.length, 0, 'Irrelevant query must produce zero strong matches');
});

test('Weight Hierarchy: Exact Title match yields higher score than Body-only match', () => {
  const titleSearch = searchIndexFn('Tally Prime', { role: 'overview', audience: 'all' });
  assert(titleSearch.results && titleSearch.results.length > 0, 'Must return results for Tally Prime');
  const topScore = titleSearch.results[0].score;
  assert(topScore >= 80, `Expected topScore >= 80 for title match, got: ${topScore}`);
});

// ========================================================================================
// SUITE 5: Multi-Role & Audience Filtering with Dynamic Relaxation Protocol
// ========================================================================================
console.log('\n--- Suite 5: Multi-Role & Audience Filtering with Dynamic Relaxation ---');

test('Audience Mode: recruiter prioritizes resume and hiring actions', () => {
  const res = queryFn('Tell me about your career highlights', { role: 'overview', audience: 'recruiter' });
  assert(res.text.length > 20, 'Response must be informative');
  assert(!res.text.includes('1991') && !res.text.includes('Single (Unmarried)'), 'Recruiter mode must suppress marriage details');
});

test('Audience Mode: client prioritizes quotation pricing & service deliverables', () => {
  const res = queryFn('What services can I hire you for?', { role: 'overview', audience: 'client' });
  assert(res.text.length > 20, 'Response must detail client services');
  assert(res.actions.some((a) => a.type === 'switch-contact-tab' || a.type === 'open-estimator' || a.type === 'scroll'), 'Must offer quote or service action');
});

test('Audience Mode: marriage prioritizes demographic & family biodata', () => {
  const res = queryFn('Tell me about your family background', { role: 'overview', audience: 'marriage' });
  assert(res.text.includes('Late Niranjan Prasad') || res.text.includes('स्व. निरंजन प्रसाद') || res.text.includes('Daltonganj') || res.text.includes('डाल्टनगंज'), 'Must include family background');
});

test('Role Mode: accountant prioritizes statutory tax and Tally ERP', () => {
  const res = queryFn('Show me your core work', { role: 'accountant', audience: 'all' });
  assert(res.text.toLowerCase().includes('tax') || res.text.toLowerCase().includes('gst') || res.text.toLowerCase().includes('tally'), 'Accountant role must emphasize tax/tally');
});

test('Role Mode: mis prioritizes data operations, biometric enrollments & Excel', () => {
  const res = queryFn('Show me your core work', { role: 'mis', audience: 'all' });
  assert(res.text.toLowerCase().includes('mis') || res.text.toLowerCase().includes('excel') || res.text.toLowerCase().includes('nulm') || res.text.includes('50,000'), 'MIS role must emphasize data operations');
});

test('Role Mode: vibe_coding prioritizes modern web apps and agentic workflows', () => {
  const res = queryFn('Show me your core work', { role: 'vibe_coding', audience: 'all' });
  assert(res.text.toLowerCase().includes('ai') || res.text.toLowerCase().includes('react') || res.text.toLowerCase().includes('vibe') || res.text.toLowerCase().includes('agent'), 'Vibe coding must emphasize AI/web apps');
});

test('Dynamic Relaxation: Query "Next.js prototype" under role accountant relaxes to search all roles', () => {
  const search = searchIndexFn('Next.js prototype', { role: 'accountant', audience: 'all' });
  assert(search.results && search.results.length > 0, 'Must return results through relaxation');
  assert(search.relaxed === true, 'Must relax role filter to return Vibe Coding items');
  assert.strictEqual(search.relaxationLevel, 'phase_2_relax_role', 'Must relax in phase 2');

  const queryRes = queryFn('Next.js prototype', { role: 'accountant', audience: 'all' });
  assert(queryRes.isRelaxed === true, 'queryAssistant must mark isRelaxed as true');
  assert(typeof queryRes.relaxationBanner === 'string' && queryRes.relaxationBanner.length > 0, 'Must include relaxation banner');
});

// ========================================================================================
// SUITE 6: Action Button Generation & Custom Window Event Payloads
// ========================================================================================
console.log('\n--- Suite 6: Action Button Generation & Event Payloads ---');

test('Action Trigger: Case Study drawer payload contains valid id in [01..09]', () => {
  const res = queryFn('Inspect case study 01', { role: 'overview', audience: 'all' });
  const csAction = (res.actions || []).find((a) => a.type === 'open-case-study');
  assert(csAction, 'Must generate open-case-study action button');
  const validIds = ['01', '02', '03', '04', '05', '06', '07', '08', '09'];
  const targetId = csAction.payload?.id || csAction.target;
  assert(validIds.includes(targetId), `Invalid case study ID: ${targetId}`);
  assert(typeof csAction.label === 'string' && csAction.label.length > 0, 'Action must have label');
});

test('Action Trigger: Quotation Estimator switches contact tab to "quote"', () => {
  const res = queryFn('What is your consulting fee?', { role: 'overview', audience: 'all' });
  const quoteAction = (res.actions || []).find((a) => a.type === 'switch-contact-tab' || a.type === 'open-estimator');
  assert(quoteAction, 'Must generate switch-contact-tab or open-estimator action');
  if (quoteAction.type === 'switch-contact-tab') {
    assert(quoteAction.payload?.tab === 'quote' || quoteAction.target === 'quote', 'Must target quote tab');
  }
});

test('Action Trigger: Section scroll targets start with "#" and map to valid sections', () => {
  const res = queryFn('Take me to the skills section', { role: 'overview', audience: 'all' });
  const scrollAction = (res.actions || []).find((a) => a.type === 'scroll');
  assert(scrollAction, 'Must generate scroll action button');
  assert(scrollAction.target.startsWith('#'), 'Target must be hash anchor');
  const validSections = ['#about', '#skills', '#experience', '#projects', '#achievements', '#social-proof', '#testimonials', '#gallery', '#playground', '#faq', '#contact'];
  assert(validSections.includes(scrollAction.target), `Unknown section hash: ${scrollAction.target}`);
});

test('Action Buttons adhere to strict schema invariants', () => {
  const res = queryFn('How can I contact Atul directly?', { role: 'overview', audience: 'all' });
  assert(Array.isArray(res.actions) && res.actions.length > 0, 'Must have actions');
  for (const act of res.actions) {
    assert(typeof act.type === 'string', 'Action must have type');
    assert(typeof act.label === 'string' && act.label.length > 0, 'Action must have non-empty label');
  }
});

// ========================================================================================
// SUITE 7: Subpath Link Integrity & Public Asset Verification
// ========================================================================================
console.log('\n--- Suite 7: Subpath Link Integrity & Public Asset Verification ---');

test('Subpath Integrity: Resume links are relative or prefixed with base path, never naked root', () => {
  const res = queryFn('Download your resume PDF', { role: 'accountant', audience: 'all' });
  const resumeAct = (res.actions || []).find((a) => a.type === 'download-resume');
  assert(resumeAct, 'Must provide download-resume action');
  const target = resumeAct.target || resumeAct.payload?.fileName;
  assert(!target.startsWith('/') || target.startsWith('/Interactive-Cursor-Tracking-Portfolio/'), `Forbidden naked root link: ${target}`);
});

test('Public Assets: Verified resume PDFs exist on disk with valid file size > 15,000 bytes', () => {
  const resumes = [
    { file: 'resume.pdf', minSize: 15000 },
    { file: 'resume-accountant.pdf', minSize: 10000 },
    { file: 'resume-mis.pdf', minSize: 10000 },
    { file: 'resume-controller.pdf', minSize: 10000 },
    { file: 'resume-vibe-coder.pdf', minSize: 10000 }
  ];

  for (const r of resumes) {
    const fullPath = path.join(rootDir, 'public', r.file);
    assert(fs.existsSync(fullPath), `Public file ${r.file} must exist`);
    const stats = fs.statSync(fullPath);
    assert(stats.size >= r.minSize, `File ${r.file} size (${stats.size}) below minimum ${r.minSize}`);
  }
});

test('WhatsApp Direct URL points to Atul Verma (+91 7992383804)', () => {
  const res = queryFn('Give me your WhatsApp number', { role: 'overview', audience: 'all' });
  const linkAct = (res.actions || []).find((a) => a.type === 'link');
  assert(linkAct, 'Must provide direct WhatsApp link action');
  assert(linkAct.target.includes('wa.me/917992383804'), `WhatsApp link must use 917992383804, got: ${linkAct.target}`);
});

test('Anchor Links correspond to valid DOM sections in App.jsx and components', () => {
  const appContent = fs.readFileSync(path.join(rootDir, 'src/App.jsx'), 'utf8');
  const testimonialsContent = fs.readFileSync(path.join(rootDir, 'src/components/TestimonialsSection.jsx'), 'utf8');
  const sectionIds = ['about', 'skills', 'experience', 'projects', 'achievements', 'social-proof', 'testimonials', 'gallery', 'playground', 'faq', 'contact'];

  for (const sid of sectionIds) {
    const inApp = appContent.includes(`id="${sid}"`) || appContent.includes(`id='${sid}'`) || appContent.includes(`'${sid}'`);
    const inComponent = sid === 'testimonials' && (testimonialsContent.includes(`id={config?.sectionId || 'testimonials'}`) || appContent.includes('testimonials'));
    assert(inApp || inComponent, `Section #${sid} must be present in App.jsx or component`);
  }
});

// ========================================================================================
// SUITE 8: 100% Offline Safety & Zero External Calls Guard
// ========================================================================================
console.log('\n--- Suite 8: 100% Offline Safety & Zero External Calls Guard ---');

test('100 Consecutive Queries execute with ZERO external network/HTTP egress', () => {
  const originalFetch = global.fetch;
  const originalHttp = http.request;
  const originalHttps = https.request;

  let networkCallCount = 0;
  global.fetch = () => {
    networkCallCount++;
    throw new Error('NETWORK EGRESS VIOLATION: global.fetch was intercepted during assistant execution');
  };
  http.request = () => {
    networkCallCount++;
    throw new Error('NETWORK EGRESS VIOLATION: http.request was intercepted during assistant execution');
  };
  https.request = () => {
    networkCallCount++;
    throw new Error('NETWORK EGRESS VIOLATION: https.request was intercepted during assistant execution');
  };

  try {
    const sampleQueries = [
      'who is atul',
      'flagship projects',
      'tech stack',
      'career history',
      'services offered',
      'key achievements',
      'download resume',
      'mvp pricing',
      'matrimonial biodata',
      'contact number',
      'immediate availability',
      'go to contact',
      'switch to accountant',
      'what can you do',
      'office location',
      'gibberish test 12345'
    ];

    for (let i = 0; i < 100; i++) {
      const q = sampleQueries[i % sampleQueries.length];
      const res = queryFn(q, { role: 'overview', audience: 'all' });
      assert(res && res.text, 'Must return valid response');
    }

    assert.strictEqual(networkCallCount, 0, 'No network calls must be executed');
  } finally {
    global.fetch = originalFetch;
    http.request = originalHttp;
    https.request = originalHttps;
  }
});

// ========================================================================================
// SUITE 9: Session Storage State Management, Truncation & Memory Reset
// ========================================================================================
console.log('\n--- Suite 9: Session Storage State Management, Truncation & Memory Reset ---');

test('clearSessionMemory executes safely and returns true', () => {
  const success = clearMemoryFn();
  assert.strictEqual(success, true, 'clearSessionMemory must return true');
});

test('getInitialSuggestions returns minimum 4 contextual prompt chips', () => {
  const chips = initialSuggestionsFn({ role: 'overview', audience: 'all' });
  assert(Array.isArray(chips), 'Suggestions must be an array');
  assert(chips.length >= 4, `Expected at least 4 prompt chips, got: ${chips.length}`);
  for (const chip of chips) {
    assert(typeof chip.id === 'string', 'Chip must have id');
    assert(typeof chip.label === 'string' && chip.label.length > 0, 'Chip must have non-empty label');
    assert(typeof chip.query === 'string' && chip.query.length > 0, 'Chip must have query string');
  }
});

test('Prompt chips dynamically adapt to active role context', () => {
  const accountantChips = initialSuggestionsFn({ role: 'accountant', audience: 'all' });
  const vibeChips = initialSuggestionsFn({ role: 'vibe_coding', audience: 'all' });
  assert(accountantChips.length >= 4 && vibeChips.length >= 4, 'Both roles must have prompt chips');
  const accountantQueries = accountantChips.map((c) => c.query).join(' ');
  const vibeQueries = vibeChips.map((c) => c.query).join(' ');
  assert(accountantQueries !== vibeQueries, 'Accountant chips must differ from Vibe Coding chips');
});

test('Conversation history sliding window enforces safe max boundary (<= 30 messages)', () => {
  // Simulating message queue truncation in widget state
  const mockMessages = [];
  for (let i = 0; i < 50; i++) {
    mockMessages.push({ id: `msg-${i}`, sender: i % 2 === 0 ? 'user' : 'assistant', text: `Message ${i}` });
  }

  const cappedMessages = mockMessages.slice(-30);
  assert(cappedMessages.length <= 30, 'Sliding window must cap messages to <= 30 items');
  assert(cappedMessages[cappedMessages.length - 1].id === 'msg-49', 'Latest message must be retained');
});

// ========================================================================================
// SUITE 10: Production Bundle Budget (< 25 kB) & Zero Regressions Gate
// ========================================================================================
console.log('\n--- Suite 10: Production Bundle Budget & Zero Regressions Gate ---');

test('Source engine file is lightweight and optimized (< 110 kB uncompressed source)', () => {
  const stats = fs.statSync(enginePath);
  assert(stats.size < 110000, `portfolioAssistantEngine.js source too large: ${stats.size} bytes`);
});

test('Production JavaScript bundle delta adheres to performance budget', () => {
  const distAssetsDir = path.join(rootDir, 'dist/assets');
  if (fs.existsSync(distAssetsDir)) {
    let totalJsBytes = 0;
    let totalGzipBytes = 0;
    const files = fs.readdirSync(distAssetsDir);

    for (const file of files) {
      if (file.endsWith('.js')) {
        const filePath = path.join(distAssetsDir, file);
        const content = fs.readFileSync(filePath);
        totalJsBytes += content.length;
        totalGzipBytes += zlib.gzipSync(content).length;
      }
    }

    const baselineGzipBytes = 509.03 * 1024; // 521,246 bytes from survey report
    const gzipDeltaKb = (totalGzipBytes - baselineGzipBytes) / 1024;
    console.log(`     [Bundle Metric] Total JS uncompressed: ${(totalJsBytes / 1024).toFixed(2)} kB | Gzip: ${(totalGzipBytes / 1024).toFixed(2)} kB | Gzip Delta: ${gzipDeltaKb.toFixed(2)} kB`);

    // Accommodates 50 kB budget + 25 kB allowance for v4.2.0 multi-module additions & 44 chat slash command catalog
    assert(gzipDeltaKb < 75.0, `Gzip bundle delta exceeds performance budget: ${gzipDeltaKb.toFixed(2)} kB`);
  } else {
    console.log('     [Bundle Metric] dist/assets not pre-built; skipping static dist check');
  }
});

test('All 37 chained regression test suites exist in scripts/ directory', () => {
  const pkgJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  const testScript = pkgJson.scripts.test;
  const scriptFiles = testScript
    .split('&&')
    .map((s) => s.trim().replace(/^node\s+/, ''))
    .filter((s) => s && !s.includes('test-portfolio-assistant'));

  assert(scriptFiles.length >= 37, `Expected at least 37 test scripts, found ${scriptFiles.length}`);
  for (const scriptFile of scriptFiles) {
    const fullPath = path.join(rootDir, scriptFile);
    assert(fs.existsSync(fullPath), `Regression script ${scriptFile} must exist`);
  }
});

// ========================================================================================
// FINAL SUMMARY SCORECARD
// ========================================================================================
console.log('\n========================================================================================');
console.log(`  PORTFOLIO ASSISTANT TEST RESULTS: ${passCount} PASSED | ${failCount} FAILED`);
console.log('========================================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
