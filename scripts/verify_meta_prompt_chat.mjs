import assert from 'node:assert';
import { CHAT_SLASH_COMMANDS, handleSlashCommand } from '../src/data/chatSlashCommands.js';
import { generateMetaPrompt, META_PROMPT_TEMPLATES } from '../src/services/metaPromptEngine.js';

console.log('--- Testing Meta-Prompt & Chat Slash Commands ---');

// 1. Verify commands exist in CHAT_SLASH_COMMANDS
const engineerCmd = CHAT_SLASH_COMMANDS.find(c => c.command === '/engineer');
const promptCmd = CHAT_SLASH_COMMANDS.find(c => c.command === '/prompt');
const metapromptCmd = CHAT_SLASH_COMMANDS.find(c => c.command === '/metaprompt');

assert(engineerCmd, 'Command /engineer should exist in CHAT_SLASH_COMMANDS');
assert(promptCmd, 'Command /prompt should exist in CHAT_SLASH_COMMANDS');
assert(metapromptCmd, 'Command /metaprompt should exist in CHAT_SLASH_COMMANDS');

assert.strictEqual(engineerCmd.category, 'AI & Intelligence');
assert.strictEqual(engineerCmd.badge, '⚡ Meta-Prompt');
console.log('✓ CHAT_SLASH_COMMANDS metadata verified for /engineer, /prompt, /metaprompt');

// 2. Verify handleSlashCommand('/engineer') Studio Guide
const studioRes = handleSlashCommand('/engineer');
assert(studioRes, 'Studio response should exist');
assert.strictEqual(studioRes.card?.type, 'meta-prompt');
assert.strictEqual(studioRes.card?.isStudioGuide, true);
assert(Array.isArray(studioRes.card?.templates), 'Templates should be an array');
assert(studioRes.card.templates.length >= 4, 'Should have at least 4 templates');
console.log('✓ handleSlashCommand("/engineer") produces interactive studio guide');

// 3. Verify handleSlashCommand with specific task
const taskRes = handleSlashCommand('/engineer Build automated GST 2B vs purchase register reconciliation tool in Python');
assert(taskRes, 'Task response should exist');
assert.strictEqual(taskRes.card?.type, 'meta-prompt');
assert.strictEqual(taskRes.card?.isStudioGuide, false);
assert(taskRes.card?.shortCommand, 'Should have shortCommand');
assert(taskRes.card?.metaPrompt, 'Should have structured metaPrompt');
assert(Array.isArray(taskRes.card?.suggestions) && taskRes.card.suggestions.length > 0, 'Should have suggestions');
assert(taskRes.card.shortCommand.includes('reconcile') || taskRes.card.shortCommand.includes('python'), 'Short command should be relevant');
assert(taskRes.card.metaPrompt.includes('Role & Persona') || taskRes.card.metaPrompt.includes('Objective'), 'Meta-prompt should be structured');
console.log('✓ handleSlashCommand with tax task produces dual-card specification:');
console.log('  Short Command:', taskRes.card.shortCommand);
console.log('  Meta-Prompt length:', taskRes.card.metaPrompt.length, 'chars');
console.log('  Suggestions count:', taskRes.card.suggestions.length);

// 4. Verify /prompt with react task
const reactRes = handleSlashCommand('/prompt Build accessible virtualized table in React 19 with Tailwind');
assert.strictEqual(reactRes.card?.type, 'meta-prompt');
assert(reactRes.card.metaPrompt.includes('React 19'), 'Meta-prompt should mention React 19');
console.log('✓ handleSlashCommand("/prompt ...") works for frontend dev');

// 5. Verify /metaprompt with multi-agent task
const agentRes = handleSlashCommand('/metaprompt Orchestrate multi-agent task planner with Claude Code');
assert.strictEqual(agentRes.card?.type, 'meta-prompt');
assert(agentRes.card.metaPrompt.includes('Multi-Agent') || agentRes.card.metaPrompt.includes('Agent'), 'Meta-prompt should mention agents');
console.log('✓ handleSlashCommand("/metaprompt ...") works for AI multi-agents');

console.log('\n--- All Unit Tests Passed Successfully! ---');
