/**
 * Phase 9 Master Verification Harness: Client-Side Session Export, Multi-Session History & Zero-Cloud Telemetry
 * Run via: node scripts/verify_phase9_chat_telemetry.mjs
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Import utilities
import {
  exportTranscript,
  copyTranscriptToClipboard,
  formatAsMarkdown,
  formatAsTxt,
  formatAsJson,
  formatAsHtml
} from '../src/utils/chatExportEngine.js';

import {
  listSessions,
  saveSession,
  loadSession,
  deleteSession,
  clearAllSessions,
  getCurrentSessionId,
  setCurrentSessionId,
  deriveSessionTitle
} from '../src/utils/chatSessionStorage.js';

import {
  recordMessageLatency,
  recordMessageFeedback,
  recordDomainInteraction,
  getAnalyticsSummary,
  formatAnalyticsScorecard,
  resetAnalytics
} from '../src/utils/chatAnalytics.js';

import {
  CHAT_SLASH_COMMANDS,
  handleSlashCommand
} from '../src/data/chatSlashCommands.js';

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

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
  }
}

console.log('================================================================');
console.log('  🔍 Phase 9 Master Verification: Session Export, History & Telemetry');
console.log('================================================================\n');

// -------------------------------------------------------------
// Suite 1: Pure ESM Export Engine Formats & Contracts
// -------------------------------------------------------------
console.log('Suite 1: Multi-Format Chat Export Engine (chatExportEngine.js)');

const sampleMessages = [
  {
    id: 'msg-1',
    sender: 'user',
    text: 'What is your core expertise in corporate taxation and GST reconciliation?',
    timestamp: '10:30 AM'
  },
  {
    id: 'msg-2',
    sender: 'assistant',
    text: 'Atul specializes in corporate tax audits, TDS filings, and automated GST reconciliation engines using Excel VBA and Python.',
    timestamp: '10:30 AM',
    modelShortcut: 'SmolLM2-360M',
    feedback: 'up'
  }
];

const sampleMetadata = {
  sessionId: 'test_session_101',
  title: 'Corporate Taxation Inquiry',
  role: 'Corporate Accountant',
  audience: 'Recruiter / Hiring',
  viewMode: 'Modern / Interactive',
  activeModel: 'SmolLM2-360M-Instruct'
};

runTest('Export format: Markdown (.md)', () => {
  const res = exportTranscript(sampleMessages, 'markdown', sampleMetadata);
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.format, 'markdown');
  assert.match(res.filename, /\.md$/);
  assert.strictEqual(res.mimeType, 'text/markdown;charset=utf-8');
  assert(res.content.includes('# 🤖 Atul Verma Portfolio Assistant — Chat Transcript'));
  assert(res.content.includes('Corporate Taxation Inquiry'));
  assert(res.content.includes('👤 User'));
  assert(res.content.includes('🤖 Assistant [SmolLM2-360M]'));
  assert(res.content.includes('👍 Helpful'));
});

runTest('Export format: Plain Text (.txt)', () => {
  const res = exportTranscript(sampleMessages, 'txt', sampleMetadata);
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.format, 'txt');
  assert.match(res.filename, /\.txt$/);
  assert.strictEqual(res.mimeType, 'text/plain;charset=utf-8');
  assert(res.content.includes('ATUL VERMA PORTFOLIO ASSISTANT - TRANSCRIPT'));
  assert(res.content.includes('[USER]'));
  assert(res.content.includes('[ASSISTANT - SmolLM2-360M]'));
  assert(res.content.includes('+1 (Helpful)'));
});

runTest('Export format: JSON (.json)', () => {
  const res = exportTranscript(sampleMessages, 'json', sampleMetadata);
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.format, 'json');
  assert.match(res.filename, /\.json$/);
  assert.strictEqual(res.mimeType, 'application/json;charset=utf-8');
  
  const parsed = JSON.parse(res.content);
  assert.strictEqual(parsed.schemaVersion, '1.0.0');
  assert.strictEqual(parsed.metadata.title, 'Corporate Taxation Inquiry');
  assert.strictEqual(parsed.metadata.totalMessages, 2);
  assert.strictEqual(parsed.messages.length, 2);
  assert.strictEqual(parsed.messages[0].sender, 'user');
  assert.strictEqual(parsed.messages[1].feedback, 'up');
});

runTest('Export format: Standalone HTML Print (.html)', () => {
  const res = exportTranscript(sampleMessages, 'html', sampleMetadata);
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.format, 'html');
  assert.match(res.filename, /\.html$/);
  assert.strictEqual(res.mimeType, 'text/html;charset=utf-8');
  assert(res.content.includes('<!DOCTYPE html>'));
  assert(res.content.includes('<html lang="en">'));
  assert(res.content.includes('@media print'));
  assert(res.content.includes('Corporate Taxation Inquiry'));
  assert(res.content.includes('message-card user-card'));
  assert(res.content.includes('message-card bot-card'));
  assert(res.content.includes('👍 Helpful'));
});

await runAsyncTest('Clipboard copy method execution', async () => {
  const res = await copyTranscriptToClipboard(sampleMessages, sampleMetadata);
  assert(typeof res === 'object');
  assert(typeof res.content === 'string');
  assert(res.content.includes('Atul Verma Portfolio Assistant'));
});

// -------------------------------------------------------------
// Suite 2: Multi-Session Persistence & 10-Session FIFO Quota Guard
// -------------------------------------------------------------
console.log('\nSuite 2: Multi-Session Storage & 10-Session FIFO Quota Guard (chatSessionStorage.js)');

runTest('Clear sessions store and verify empty state', () => {
  clearAllSessions();
  const sessions = listSessions();
  assert.strictEqual(Array.isArray(sessions), true);
  assert.strictEqual(sessions.length, 0);
});

runTest('deriveSessionTitle extracts readable first user query with truncation', () => {
  const title1 = deriveSessionTitle([{ sender: 'user', text: 'Can you show me Case Study 01 GST engine?' }]);
  assert.strictEqual(title1, 'Can you show me Case Study 01 GST en…');

  const title2 = deriveSessionTitle([{ sender: 'user', text: 'Hello' }]);
  assert.strictEqual(title2, 'Hello');

  const titleFallback = deriveSessionTitle([], 'Default Title');
  assert.strictEqual(titleFallback, 'Default Title');
});

runTest('Save and load single session with auto-derived title', () => {
  clearAllSessions();
  const saved = saveSession({
    id: 'test_sess_alpha',
    messages: [
      { sender: 'user', text: 'Tell me about Atul resume and skills' },
      { sender: 'assistant', text: 'Here is his ATS resume overview.' }
    ],
    metadata: { role: 'mis' }
  });

  assert.strictEqual(saved.id, 'test_sess_alpha');
  assert.strictEqual(saved.title, 'Tell me about Atul resume and skills');
  assert.strictEqual(saved.messages.length, 2);

  const loaded = loadSession('test_sess_alpha');
  assert.notStrictEqual(loaded, null);
  assert.strictEqual(loaded.id, 'test_sess_alpha');
  assert.strictEqual(loaded.metadata.role, 'mis');
});

runTest('FIFO Quota Guard: Enforces strict 10-session maximum by pruning oldest', () => {
  clearAllSessions();

  // Create 12 sequential sessions with increasing timestamps
  for (let i = 1; i <= 12; i++) {
    const timeOffset = new Date(Date.now() + i * 1000).toISOString();
    saveSession({
      id: `sess_${i.toString().padStart(2, '0')}`,
      title: `Session Number ${i}`,
      createdAt: timeOffset,
      updatedAt: timeOffset,
      messages: [{ sender: 'user', text: `Query for session ${i}` }]
    });
  }

  const sessions = listSessions();
  assert.strictEqual(sessions.length, 10, 'Total stored sessions must never exceed 10');

  // Verify oldest sessions (1 and 2) were pruned, newest (3 to 12) remain
  assert.strictEqual(loadSession('sess_01'), null, 'Oldest session sess_01 must be pruned');
  assert.strictEqual(loadSession('sess_02'), null, 'Oldest session sess_02 must be pruned');
  assert.notStrictEqual(loadSession('sess_03'), null, 'Session sess_03 must remain');
  assert.notStrictEqual(loadSession('sess_12'), null, 'Newest session sess_12 must remain');
  assert.strictEqual(sessions[0].id, 'sess_12', 'Sessions must be ordered by updatedAt descending');
});

runTest('Delete specific session & current session ID tracking', () => {
  setCurrentSessionId('sess_05');
  assert.strictEqual(getCurrentSessionId(), 'sess_05');

  const deleted = deleteSession('sess_05');
  assert.strictEqual(deleted, true);
  assert.strictEqual(loadSession('sess_05'), null);
  assert.strictEqual(getCurrentSessionId(), null, 'Current session ID cleared upon deletion');
});

// -------------------------------------------------------------
// Suite 3: Zero-Cloud On-Device Telemetry & Analytics
// -------------------------------------------------------------
console.log('\nSuite 3: Zero-Cloud On-Device Telemetry & Analytics (chatAnalytics.js)');

runTest('Reset and record latency, tokens, domains, and feedback', () => {
  resetAnalytics();
  
  recordMessageLatency(200, 'SmolLM2-360M', 40);
  recordMessageLatency(300, 'SmolLM2-360M', 60);
  recordMessageLatency(100, 'portfolio-engine', 20);

  recordMessageFeedback('msg_101', 'up');
  recordMessageFeedback('msg_102', 'up');
  recordMessageFeedback('msg_103', 'down');

  recordDomainInteraction('tax');
  recordDomainInteraction('tax');
  recordDomainInteraction('mis');
  recordDomainInteraction('ai');

  const summary = getAnalyticsSummary();
  assert.strictEqual(summary.totalInteractions, 3);
  assert.strictEqual(summary.totalTokens, 120);
  assert.strictEqual(summary.averageLatencyMs, 200); // (200 + 300 + 100) / 3
  assert(summary.tokensPerSecond > 0, 'Tokens per second should be computed');

  assert.strictEqual(summary.feedbackStats.positive, 2);
  assert.strictEqual(summary.feedbackStats.negative, 1);
  assert.strictEqual(summary.feedbackStats.total, 3);
  assert.strictEqual(summary.satisfactionRate, 67); // 2/3 = 66.6% -> 67%

  assert.strictEqual(summary.modelDistribution['SmolLM2-360M'], 2);
  assert.strictEqual(summary.modelDistribution['portfolio-engine'], 1);

  assert.strictEqual(summary.domainBreakdown.tax, 2);
  assert.strictEqual(summary.domainBreakdown.mis, 1);
  assert.strictEqual(summary.domainBreakdown.ai, 1);
});

runTest('formatAnalyticsScorecard returns human-readable report with all sections', () => {
  const scorecard = formatAnalyticsScorecard();
  assert(scorecard.includes('Client-Side AI Telemetry & Benchmark Scorecard'));
  assert(scorecard.includes('Throughput Rate'));
  assert(scorecard.includes('Model Routing Distribution'));
  assert(scorecard.includes('Domain Inquiry Breakdown'));
  assert(scorecard.includes('User Satisfaction'));
  assert(scorecard.includes('67% positive'));
});

// -------------------------------------------------------------
// Suite 4: Slash Commands Directory & Execution Handlers
// -------------------------------------------------------------
console.log('\nSuite 4: Slash Commands Catalog & Handlers (chatSlashCommands.js)');

runTest('Phase 9 slash commands are cataloged in CHAT_SLASH_COMMANDS', () => {
  const commandNames = CHAT_SLASH_COMMANDS.map((c) => c.command);
  assert(commandNames.includes('/export'), '/export must be registered');
  assert(commandNames.includes('/history'), '/history must be registered');
  assert(commandNames.includes('/analytics'), '/analytics must be registered');
  assert(commandNames.includes('/telemetry'), '/telemetry must be registered');
  assert(commandNames.includes('/benchmark'), '/benchmark must be registered');
});

runTest('/export command responds with format options and actions', () => {
  const res = handleSlashCommand('/export');
  assert.strictEqual(res.intent, 'slash_command');
  assert(res.text.includes('Export Conversation Transcript'));
  assert(Array.isArray(res.actions));
  const actionTypes = res.actions.map((a) => a.type);
  assert(actionTypes.includes('export-transcript-md'));
  assert(actionTypes.includes('export-transcript-json'));
  assert(actionTypes.includes('export-transcript-txt'));
  assert(actionTypes.includes('export-transcript-html'));
  assert(actionTypes.includes('copy-transcript'));
});

runTest('/history command responds with session management actions', () => {
  const res = handleSlashCommand('/history');
  assert.strictEqual(res.intent, 'slash_command');
  assert(res.text.includes('Multi-Session Conversation History'));
  const actionTypes = res.actions.map((a) => a.type);
  assert(actionTypes.includes('open-session-drawer'));
  assert(actionTypes.includes('new-session'));
});

runTest('/analytics and /benchmark return scorecard with throughput metrics', () => {
  const resAnalytics = handleSlashCommand('/analytics');
  assert(resAnalytics.text.includes('Client-Side AI Telemetry'));

  const resBenchmark = handleSlashCommand('/benchmark');
  assert(resBenchmark.text.includes('Throughput Rate'));
});

// -------------------------------------------------------------
// Suite 5: AIChatWidget Component Integration & UI Bindings
// -------------------------------------------------------------
console.log('\nSuite 5: AIChatWidget Component UI Integration (AIChatWidget.jsx)');

runTest('AIChatWidget imports Phase 9 engines and utilities', () => {
  const widgetCode = fs.readFileSync(path.join(projectRoot, 'src/components/AIChatWidget.jsx'), 'utf-8');
  assert(widgetCode.includes('chatExportEngine.js'), 'Must import chatExportEngine.js');
  assert(widgetCode.includes('chatSessionStorage.js'), 'Must import chatSessionStorage.js');
  assert(widgetCode.includes('chatAnalytics.js'), 'Must import chatAnalytics.js');
  assert(widgetCode.includes('ThumbsUp'), 'Must import ThumbsUp icon');
  assert(widgetCode.includes('ThumbsDown'), 'Must import ThumbsDown icon');
  assert(widgetCode.includes('History'), 'Must import History icon');
});

runTest('AIChatWidget binds Export popover picker and History drawer overlay', () => {
  const widgetCode = fs.readFileSync(path.join(projectRoot, 'src/components/AIChatWidget.jsx'), 'utf-8');
  assert(widgetCode.includes('showExportMenu'), 'Must track showExportMenu state');
  assert(widgetCode.includes('showHistoryDrawer'), 'Must track showHistoryDrawer state');
  assert(widgetCode.includes('handleExportFormat'), 'Must define handleExportFormat');
  assert(widgetCode.includes('handleRateMessage'), 'Must define handleRateMessage');
  assert(widgetCode.includes('handleLoadSession'), 'Must define handleLoadSession');
  assert(widgetCode.includes('Session Archive'), 'Must render Session Archive header');
  assert(widgetCode.includes('FIFO Quota: auto-pruned past 10 sessions'), 'Must display FIFO quota notice');
});

runTest('AIChatWidget instruments latency and domain telemetry on message streams', () => {
  const widgetCode = fs.readFileSync(path.join(projectRoot, 'src/components/AIChatWidget.jsx'), 'utf-8');
  assert(widgetCode.includes('recordMessageLatency'), 'Must record message latency');
  assert(widgetCode.includes('recordDomainInteraction'), 'Must record domain interaction');
  assert(widgetCode.includes('detectDomainFromQuery'), 'Must detect domain from query');
});

// -------------------------------------------------------------
// Summary Report
// -------------------------------------------------------------
console.log('\n================================================================');
console.log(`  Phase 9 Telemetry & Export Verification: ${passedTests}/${totalTests} tests passed`);
console.log('================================================================');

if (passedTests !== totalTests) {
  process.exit(1);
}
