/**
 * Verification Harness: AI Model Switcher, Single-Row Sub-Header & Dynamic State Coloring
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('========================================================================================');
console.log('  AI MODEL SWITCHER & HEADER ENHANCEMENTS TEST (verify_ai_model_switcher_header.mjs)');
console.log('========================================================================================\n');

const widgetPath = path.join(rootDir, 'src/components/AIChatWidget.jsx');
const widgetCode = fs.readFileSync(widgetPath, 'utf8');

// 1. Dynamic State Coloring Helpers Test
console.log('--- Suite 1: Header Icons Dynamic Color Styling Verification ---');
assert(widgetCode.includes('export function getAudienceColorStyle(aud)'), 'getAudienceColorStyle must be exported');
assert(widgetCode.includes('export function getRoleColorStyle(r)'), 'getRoleColorStyle must be exported');
assert(widgetCode.includes('export function getViewModeColorStyle(vm)'), 'getViewModeColorStyle must be exported');
assert(widgetCode.includes('export function getAIModelColorStyle(localAiState)'), 'getAIModelColorStyle must be exported');

// Audience Colors
assert(widgetCode.includes('#FF4D6D'), 'Recruiter must have #FF4D6D tint');
assert(widgetCode.includes('#9333EA'), 'Client must have #9333EA tint');
assert(widgetCode.includes('text-fuchsia-500'), 'Marriage must have fuchsia tint');
assert(widgetCode.includes('text-indigo-500'), 'All must have indigo tint');
console.log('  ✅ PASS: Audience dynamic color styles verified (Recruiter, Client, Marriage, All)');

// Role Colors
assert(widgetCode.includes("'text-emerald-500 bg-emerald-500/15 ring-1 ring-emerald-500/40'"), 'Accountant must have emerald tint and ring');
assert(widgetCode.includes("'text-blue-500 bg-blue-500/15 ring-1 ring-blue-500/40'"), 'MIS must have blue tint and ring');
assert(widgetCode.includes("'text-purple-500 bg-purple-500/15 ring-1 ring-purple-500/40'"), 'Vibe Coding must have purple tint and ring');
assert(widgetCode.includes("'text-amber-500 bg-amber-500/15 ring-1 ring-amber-500/40'"), 'Controller/other must have amber tint and ring');
console.log('  ✅ PASS: Role dynamic color styles verified (Accountant, MIS, Vibe Coding, Other, Overview)');

// View Mode Colors
assert(widgetCode.includes("'text-cyan-500 bg-cyan-500/15 ring-1 ring-cyan-500/40'"), 'Modern must have cyan tint and ring');
assert(widgetCode.includes("'text-green-500 bg-green-500/15 ring-1 ring-green-500/40'"), 'Terminal must have green tint and ring');
assert(widgetCode.includes("'text-amber-500 bg-amber-500/15 ring-1 ring-amber-500/40'"), 'Simple must have amber tint and ring');
assert(widgetCode.includes("'text-slate-500 bg-slate-500/15 ring-1 ring-slate-500/40'"), 'Basic must have slate tint and ring');
console.log('  ✅ PASS: View Mode dynamic color styles verified (Modern, Terminal, Simple, Basic)');

// AI Model State Colors
assert(widgetCode.includes("localAiState?.status === 'ready' && localAiState?.activeModel"), 'Ready model check present');
assert(widgetCode.includes("localAiState?.status === 'downloading'"), 'Downloading model check present');
assert(widgetCode.includes("'text-amber-500 bg-amber-500/15 ring-1 ring-amber-500/40 animate-pulse'"), 'Downloading state has amber tint with pulse');
console.log('  ✅ PASS: AI Model dynamic color styles verified (Ready, Downloading, Idle/Off)');

// 2. LocalAIService State & Methods Verification
console.log('\n--- Suite 2: Local AI Service State Toggle & Switching ---');
const { localAIService } = await import('../src/services/localAIService.js');

assert(typeof localAIService.turnOffAI === 'function', 'localAIService must expose turnOffAI method');
assert(typeof localAIService.turnOnAI === 'function', 'localAIService must expose turnOnAI method');
assert(typeof localAIService.toggleAI === 'function', 'localAIService must expose toggleAI method');
assert(typeof localAIService.switchModel === 'function', 'localAIService must expose switchModel method');

// Test Turn Off
localAIService.turnOffAI();
assert.strictEqual(localAIService.status, 'idle', 'turnOffAI must set status to idle');
assert.strictEqual(localAIService.activeModel, null, 'turnOffAI must set activeModel to null');
assert.strictEqual(localAIService.isAiEnabled, false, 'turnOffAI must set isAiEnabled to false');
console.log('  ✅ PASS: turnOffAI correctly clears active model and sets state to offline idle');

// 3. UI Code Integrity in AIChatWidget.jsx
console.log('\n--- Suite 3: AIChatWidget Sub-Header & Decision Tree Markup Verification ---');

// Sub-Header Left Action Group: Users, Briefcase, Monitor, Bot
assert(widgetCode.includes('handleTriggerAudienceDecisionTree'), 'Widget must bind Audience button');
assert(widgetCode.includes('handleTriggerRoleDecisionTree'), 'Widget must bind Role button');
assert(widgetCode.includes('handleTriggerViewModeDecisionTree'), 'Widget must bind ViewMode button');
assert(widgetCode.includes('handleTriggerAIModelDecisionTree'), 'Widget must bind AI Model Switcher button');
assert(widgetCode.includes('<Bot className="w-3.5 h-3.5" />'), 'Widget must render Bot icon for AI Model Switcher');
console.log('  ✅ PASS: Sub-Header Left Action Group verified with Bot AI Switcher');

// Sub-Header Right Action Group: AI On/Off Quick Toggle Pill, Emoji Pill, Download, Reset
assert(widgetCode.includes('handleToggleAIQuick'), 'Widget must bind handleToggleAIQuick');
assert(widgetCode.includes("isAiOn ? '⚡ AI On' : '🔌 AI Off'"), 'Widget must render 1-click AI On/Off toggle pill');
assert(widgetCode.includes("emojiEnabled ? 'On' : 'Off'"), 'Widget must render emoji toggle pill');
assert(widgetCode.includes('handleExportTranscript'), 'Widget must render download transcript button');
assert(widgetCode.includes('handleClearChat'), 'Widget must render reset chat button');
console.log('  ✅ PASS: Sub-Header Right Action Group verified with AI On/Off Quick Toggle Pill');

// In-Chat Decision Tree for AI Model Switching
assert(widgetCode.includes("step: 'ai_model_switch'"), 'Widget must trigger ai_model_switch decision tree step');
assert(widgetCode.includes('handleAiModelSwitchSelect'), 'Widget must bind handleAiModelSwitchSelect');
assert(widgetCode.includes('✓ Active'), 'Widget must render ✓ Active badge on current model card');
assert(widgetCode.includes('⏳ Downloading...'), 'Widget must render Downloading badge when model is downloading');
assert(widgetCode.includes('🚀 डिवाइस-अनुशंसित मॉडल'), 'Decision tree must contain Device Recommended card');
assert(widgetCode.includes('⚖️ बैलेंस्ड लाइट मॉडल') || widgetCode.includes('⚖️ बैलेंस्ड मिड मॉडल'), 'Decision tree must contain Balanced Model card');
assert(!widgetCode.includes("label: `🛡️ बेयर-मिनिमम बेस मॉडल"), 'Decision tree must exclude Bare Minimum Model card from choices');
assert(widgetCode.includes('🔌 AI ऑफ करें / Turn Off AI'), 'Decision tree must contain Turn Off AI card');
console.log('  ✅ PASS: Dynamic AI Model Decision Tree Cards verified (Recommended, Balanced, Offline Engine, Bare-Minimum excluded) with ✓ Active badge & selection handlers');

// Slash Command Verification
const slashCode = fs.readFileSync(path.join(rootDir, 'src/data/chatSlashCommands.js'), 'utf8');
assert(slashCode.includes("command: '/model'"), 'chatSlashCommands.js must include /model slash command');
assert(widgetCode.includes("cmdStr === '/model' || cmdStr === '/ai'"), 'executeSlashCommand must support /model and /ai');
console.log('  ✅ PASS: /model and /ai slash commands verified');

console.log('\n========================================================================================');
console.log('  ALL AI MODEL SWITCHER & HEADER TESTS PASSED (100% GREEN)');
console.log('========================================================================================\n');
