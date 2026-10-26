/**
 * Phase 10 Master Verification Harness: Agentic Capabilities, Interactive Tour Engine,
 * Semantic Search Index, and In-Chat Action Cards.
 * Run via: node scripts/verify_phase10_chat_agent.mjs
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Import Phase 10 utilities
import {
  PORTFOLIO_TOURS,
  startTour,
  nextTourStep,
  prevTourStep,
  pauseTour,
  resumeTour,
  endTour,
  getActiveTourState,
  subscribeTourState,
  scrollToStepElement,
  listTours
} from '../src/utils/chatTourEngine.js';

import {
  buildSemanticCorpus,
  getSemanticIndex,
  tokenizeQuery,
  searchPortfolio
} from '../src/utils/portfolioSemanticIndex.js';

import {
  CHAT_SLASH_COMMANDS,
  handleSlashCommand
} from '../src/data/chatSlashCommands.js';

import {
  queryAssistant,
  classifyIntent
} from '../src/utils/portfolioAssistantEngine.js';

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
  }
}

console.log('================================================================');
console.log('  🔍 Phase 10 Master Verification: Agentic Tour, Search & Action Cards');
console.log('================================================================\n');

// -------------------------------------------------------------
// Suite 1: Interactive Tour Engine States, Step Transitions & API
// -------------------------------------------------------------
console.log('Suite 1: Tour Engine States & Step Transitions (chatTourEngine.js)');

runTest('All 4 curated tours defined with valid steps and DOM selectors', () => {
  const expectedTours = [
    'recruiter-fast-track',
    'corporate-tax-gst',
    'ai-vibe-coding',
    'executive-flash-tour'
  ];

  for (const tid of expectedTours) {
    assert(PORTFOLIO_TOURS[tid], `Tour ${tid} must be defined`);
    const tour = PORTFOLIO_TOURS[tid];
    assert(Array.isArray(tour.steps), `Tour ${tid} must have steps array`);
    assert(tour.steps.length >= 3, `Tour ${tid} must have at least 3 steps`);
    for (const step of tour.steps) {
      assert(step.selector && step.selector.startsWith('#'), `Step must have valid # selector: ${step.selector}`);
      assert(step.headline && step.headline.length > 5, `Step must have descriptive headline: ${step.headline}`);
      assert(step.commentary && step.commentary.length > 10, `Step must have commentary: ${step.commentary}`);
    }
  }

  const allTours = listTours();
  assert.strictEqual(allTours.length, 4, 'listTours should return all 4 tours');
});

runTest('startTour sets active tour state, current step index 0, and dispatches events', () => {
  let stateReceived = null;
  const unsub = subscribeTourState((state) => {
    stateReceived = state;
  });

  const started = startTour('recruiter-fast-track');
  assert.strictEqual(started, true);

  const active = getActiveTourState();
  assert.strictEqual(active.isActive, true);
  assert.strictEqual(active.isPaused, false);
  assert.strictEqual(active.tourId, 'recruiter-fast-track');
  assert.strictEqual(active.currentStepIndex, 0);
  assert.strictEqual(active.totalSteps, 4);
  assert.strictEqual(active.currentStep.selector, '#hero');
  assert.strictEqual(stateReceived.tourId, 'recruiter-fast-track');

  unsub();
});

runTest('nextTourStep advances step index and prevTourStep steps back', () => {
  startTour('corporate-tax-gst');
  assert.strictEqual(getActiveTourState().currentStepIndex, 0);

  const advanced1 = nextTourStep();
  assert.strictEqual(advanced1, true);
  assert.strictEqual(getActiveTourState().currentStepIndex, 1);
  assert.strictEqual(getActiveTourState().currentStep.selector, '#projects');

  const back1 = prevTourStep();
  assert.strictEqual(back1, true);
  assert.strictEqual(getActiveTourState().currentStepIndex, 0);
  assert.strictEqual(getActiveTourState().currentStep.selector, '#skills');

  // Stepping back from 0 should return false
  const backUnderflow = prevTourStep();
  assert.strictEqual(backUnderflow, false);
  assert.strictEqual(getActiveTourState().currentStepIndex, 0);
});

runTest('pauseTour, resumeTour, and endTour lifecycle', () => {
  startTour('ai-vibe-coding');
  assert.strictEqual(getActiveTourState().isActive, true);
  assert.strictEqual(getActiveTourState().isPaused, false);

  pauseTour();
  assert.strictEqual(getActiveTourState().isPaused, true);

  resumeTour();
  assert.strictEqual(getActiveTourState().isPaused, false);

  endTour();
  const endedState = getActiveTourState();
  assert.strictEqual(endedState.isActive, false);
  assert.strictEqual(endedState.tourId, null);
  assert.strictEqual(endedState.currentStepIndex, 0);
});

runTest('scrollToStepElement handles Node / SSR headless environments gracefully', () => {
  const scrolled = scrollToStepElement('#non-existent-selector');
  assert.strictEqual(typeof scrolled, 'boolean');
});

// -------------------------------------------------------------
// Suite 2: Semantic Search Index & Multi-Faceted Matching
// -------------------------------------------------------------
console.log('\nSuite 2: Semantic Search Index & Token Matching (portfolioSemanticIndex.js)');

runTest('buildSemanticCorpus indexes case studies, skills, catalog items, and FAQs', () => {
  const corpus = buildSemanticCorpus();
  assert(Array.isArray(corpus), 'Corpus must be an array');
  assert(corpus.length >= 25, `Corpus must index at least 25 items, got ${corpus.length}`);

  const hasCaseStudies = corpus.some(i => i.entityType === 'case_study');
  const hasSkills = corpus.some(i => i.entityType === 'skill');
  const hasFaqs = corpus.some(i => i.entityType === 'faq');
  const hasActions = corpus.some(i => i.entityType === 'action' || i.category === 'Actions');

  assert.strictEqual(hasCaseStudies, true, 'Corpus must include case studies');
  assert.strictEqual(hasSkills, true, 'Corpus must include skills');
  assert.strictEqual(hasFaqs, true, 'Corpus must include FAQs');
  assert.strictEqual(hasActions, true, 'Corpus must include actions');

  assert.strictEqual(getSemanticIndex(), corpus, 'getSemanticIndex should return cached corpus');
});

runTest('tokenizeQuery cleans punctuation, lowercases, and removes stop words', () => {
  const tokens = tokenizeQuery('What is the GST filing and reconciliation process for Atul?');
  assert(tokens.includes('gst'), 'Must include gst');
  assert(tokens.includes('filing'), 'Must include filing');
  assert(tokens.includes('reconciliation'), 'Must include reconciliation');
  assert(tokens.includes('atul'), 'Must include atul');
  assert(!tokens.includes('what'), 'Must remove what');
  assert(!tokens.includes('the'), 'Must remove the');
  assert(!tokens.includes('and'), 'Must remove and');
  assert(!tokens.includes('for'), 'Must remove for');
});

runTest('searchPortfolio returns high-relevance matches for domain keywords', () => {
  const gstResults = searchPortfolio('gst reconciliation itc', { limit: 5 });
  assert(gstResults.length > 0, 'Must return results for GST');
  assert(gstResults[0].score >= 30, `Top result score (${gstResults[0].score}) should be high`);
  assert(gstResults[0].title.toLowerCase().includes('gst'), 'Top title must match gst');
  assert(gstResults[0].action, 'Result must contain actionable 1-click jump');

  const tallyResults = searchPortfolio('tally prime erp', { limit: 5 });
  assert(tallyResults.length > 0, 'Must return results for Tally Prime');
  assert(tallyResults.some(r => r.title.toLowerCase().includes('tally')), 'Results must include Tally');

  const saasResults = searchPortfolio('prompt to saas generator', { limit: 5 });
  assert(saasResults.length > 0, 'Must return results for AI SaaS');
  assert(saasResults.some(r => r.caseStudyId === '07' || r.title.includes('SaaS')), 'Results must match case study 07');
});

runTest('searchPortfolio supports category and role filtering with empty fallbacks', () => {
  const skillResults = searchPortfolio('excel', { category: 'skills' });
  for (const item of skillResults) {
    assert.strictEqual(item.category.toLowerCase(), 'skills', 'Item must be in skills category');
  }

  const emptyResults = searchPortfolio('xyzzynonexistentquery12345');
  assert.deepStrictEqual(emptyResults, [], 'Non-matching query should return empty array');
});

// -------------------------------------------------------------
// Suite 3: Chat Action Cards Structure & Contracts
// -------------------------------------------------------------
console.log('\nSuite 3: Chat Action Cards Structure & Contracts (ChatActionCard.jsx)');

const cardComponentPath = path.join(projectRoot, 'src/components/chat/ChatActionCard.jsx');

runTest('ChatActionCard.jsx exists and has valid component structure', () => {
  assert(fs.existsSync(cardComponentPath), 'ChatActionCard.jsx file must exist');
  const src = fs.readFileSync(cardComponentPath, 'utf8');
  assert(src.includes('export default function ChatActionCard'), 'Must export default ChatActionCard');
  assert(src.includes('tour-controller') || src.includes('tour'), 'Must support tour controller card');
  assert(src.includes('quotation-estimator') || src.includes('fee-estimator'), 'Must support fee estimator card');
  assert(src.includes('search-results'), 'Must support search results card');
  assert(src.includes('hardware-benchmark') || src.includes('benchmark'), 'Must support hardware benchmark card');
  assert(src.includes('onExecuteAction'), 'Must forward user interactions to onExecuteAction');
});

// -------------------------------------------------------------
// Suite 4: Slash Commands Catalog & Handler Routing
// -------------------------------------------------------------
console.log('\nSuite 4: Slash Commands Catalog & Handlers (chatSlashCommands.js)');

runTest('Phase 10 commands (/tour, /search, /tools) are present in CHAT_SLASH_COMMANDS', () => {
  const commands = CHAT_SLASH_COMMANDS.map(c => c.command);
  assert(commands.includes('/tour'), 'Must include /tour');
  assert(commands.includes('/search'), 'Must include /search');
  assert(commands.includes('/tools'), 'Must include /tools');
  assert(commands.includes('/quote'), 'Must include /quote');
  assert(commands.includes('/benchmark'), 'Must include /benchmark');
});

runTest('/tour command responds with tour controller card and start actions', () => {
  const res = handleSlashCommand('/tour');
  assert.strictEqual(res.intent, 'slash_command');
  assert.strictEqual(res.command, '/tour');
  assert(res.card, 'Must contain card payload');
  assert.strictEqual(res.card.type, 'tour-controller');
  assert(Array.isArray(res.actions), 'Must have actions');
  assert(res.actions.some(a => a.type === 'start-tour'), 'Must have start-tour action');

  const recruiterTour = handleSlashCommand('/tour recruiter');
  assert.strictEqual(recruiterTour.card.tourId, 'recruiter-fast-track');
});

runTest('/search command returns fuzzy search results card and actionable links', () => {
  const res = handleSlashCommand('/search gst');
  assert.strictEqual(res.command, '/search');
  assert(res.card, 'Must contain card payload');
  assert.strictEqual(res.card.type, 'search-results');
  assert.strictEqual(res.card.query, 'gst');
  assert(Array.isArray(res.card.results) && res.card.results.length > 0, 'Results must contain matches');
});

runTest('/tools, /quote, and /benchmark handlers return rich payloads', () => {
  const toolsRes = handleSlashCommand('/tools');
  assert.strictEqual(toolsRes.command, '/tools');
  assert(toolsRes.text.includes('Tally Prime'), 'Tools text must include accounting stack');

  const quoteRes = handleSlashCommand('/quote');
  assert.strictEqual(quoteRes.card.type, 'quotation-estimator');

  const benchRes = handleSlashCommand('/benchmark');
  assert.strictEqual(benchRes.card.type, 'hardware-benchmark');
});

// -------------------------------------------------------------
// Suite 5: Assistant Engine Intent Detection & AIChatWidget Integration
// -------------------------------------------------------------
console.log('\nSuite 5: Assistant Engine Intents & AIChatWidget Integration');

runTest('classifyIntent detects tour and search intents accurately', () => {
  const tour1 = classifyIntent('give me a tour');
  assert.strictEqual(tour1.intent, 'tour');

  const tour2 = classifyIntent('start guided walkthrough');
  assert.strictEqual(tour2.intent, 'tour');

  const search1 = classifyIntent('search for gst filing');
  assert.strictEqual(search1.intent, 'search');

  const search2 = classifyIntent('find tally case studies');
  assert.strictEqual(search2.intent, 'search');
});

runTest('queryAssistant returns structured card and action payloads for tour & search', () => {
  const tourRes = queryAssistant('show me around');
  assert.strictEqual(tourRes.intent, 'tour');
  assert(tourRes.card, 'Must return card payload for tour');
  assert.strictEqual(tourRes.card.type, 'tour-controller');
  assert(tourRes.actions.some(a => a.type === 'start-tour'), 'Must provide start-tour action button');

  const searchRes = queryAssistant('search for react');
  assert.strictEqual(searchRes.intent, 'search');
  assert(searchRes.card, 'Must return card payload for search');
  assert.strictEqual(searchRes.card.type, 'search-results');
  assert(searchRes.card.results.length > 0, 'Must return matching results for react');
});

const widgetPath = path.join(projectRoot, 'src/components/AIChatWidget.jsx');

runTest('AIChatWidget.jsx mounts Tour HUD banner, renders ChatActionCard, and handles actions', () => {
  assert(fs.existsSync(widgetPath), 'AIChatWidget.jsx must exist');
  const src = fs.readFileSync(widgetPath, 'utf8');

  // Imports
  assert(src.includes('ChatActionCard'), 'Must import ChatActionCard');
  assert(src.includes('chatTourEngine.js'), 'Must import from chatTourEngine.js');
  assert(src.includes('getActiveTourState'), 'Must import getActiveTourState');

  // State
  assert(src.includes('activeTour') && src.includes('setActiveTour'), 'Must track activeTour state');

  // Tour HUD Banner
  assert(src.includes('activeTour.isActive') || src.includes('activeTour && activeTour.isActive'), 'Must render Tour HUD banner');

  // Action card rendering in messages
  assert(src.includes('<ChatActionCard'), 'Must render ChatActionCard component');

  // Action execution wiring
  assert(src.includes("type === 'start-tour'"), 'Must handle start-tour action');
  assert(src.includes("type === 'next-tour-step'"), 'Must handle next-tour-step action');
  assert(src.includes("type === 'prev-tour-step'"), 'Must handle prev-tour-step action');
  assert(src.includes("type === 'end-tour'"), 'Must handle end-tour action');
  assert(src.includes("type === 'open-quote'"), 'Must handle open-quote action');
});

// -------------------------------------------------------------
// Summary
// -------------------------------------------------------------
console.log('\n================================================================');
console.log(`  Phase 10 Agentic Verification: ${passedTests}/${totalTests} tests passed`);
console.log('================================================================');

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  console.log('\n🎉 ALL PHASE 10 AGENTIC CAPABILITY CHECKS PASSED (100% GREEN)\n');
}
