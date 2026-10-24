import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('========================================================================================');
console.log('  FOUR FIXES COMPREHENSIVE INDEPENDENT VERIFICATION SUITE');
console.log('========================================================================================\n');

let passCount = 0;
let failCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Reason: ${err.message}`);
    failCount++;
  }
}

// Read source files
const aiChatWidgetPath = path.join(rootDir, 'src/components/AIChatWidget.jsx');
const chatSlashCommandsPath = path.join(rootDir, 'src/data/chatSlashCommands.js');
const portfolioAssistantEnginePath = path.join(rootDir, 'src/utils/portfolioAssistantEngine.js');

const aiChatWidgetSrc = fs.readFileSync(aiChatWidgetPath, 'utf8');
const chatSlashCommandsSrc = fs.readFileSync(chatSlashCommandsPath, 'utf8');
const portfolioAssistantEngineSrc = fs.readFileSync(portfolioAssistantEnginePath, 'utf8');

// Dynamic imports
const { CHAT_SLASH_COMMANDS, handleSlashCommand } = await import('../src/data/chatSlashCommands.js');
const { queryAssistant, CHAT_SLASH_COMMANDS: ENGINE_SLASH_COMMANDS } = await import('../src/utils/portfolioAssistantEngine.js');

// Extract cleanTextForSpeech from AIChatWidget.jsx for runtime testing
const cleanTextMatch = aiChatWidgetSrc.match(/export function cleanTextForSpeech\(text\)\s*\{([\s\S]*?)\n\}/);
assert(cleanTextMatch, 'cleanTextForSpeech function must exist in AIChatWidget.jsx');
const cleanTextForSpeech = new Function('text', cleanTextMatch[1]);

// ========================================================================================
// ISSUE 1: Voice Dictation Auto-Send Bug Fix
// ========================================================================================
console.log('--- Verification 1: Voice Dictation Auto-Send Fix ---');

runTest('SpeechRecognition onresult NEVER calls handleSendMessage', () => {
  // Extract onresult handler block
  const onresultMatch = aiChatWidgetSrc.match(/recognition\.onresult\s*=\s*\(([^)]*)\)\s*=>\s*\{([\s\S]*?)\n\s*\};/);
  assert(onresultMatch, 'recognition.onresult handler must exist');
  // Strip comments to inspect actual statements
  const onresultBodyWithoutComments = onresultMatch[2].replace(/\/\/.*$/gm, '');
  
  // Must update input value
  assert(onresultBodyWithoutComments.includes('setInputValue'), 'onresult must update input value');
  // Must NOT invoke submission
  assert(!onresultBodyWithoutComments.includes('handleSendMessage'), 'onresult must NEVER invoke handleSendMessage');
  assert(!onresultBodyWithoutComments.includes('handleFormSubmit'), 'onresult must NEVER invoke handleFormSubmit');
});

runTest('SpeechRecognition onend and onerror safely reset listening state without auto-sending', () => {
  const onendMatch = aiChatWidgetSrc.match(/recognition\.onend\s*=\s*\(\)\s*=>\s*\{([\s\S]*?)\n\s*\};/);
  assert(onendMatch, 'recognition.onend handler must exist');
  const onendBody = onendMatch[1];
  assert(onendBody.includes('setIsListening(false)'), 'onend must call setIsListening(false)');
  assert(!onendBody.includes('handleSendMessage'), 'onend must NEVER call handleSendMessage');

  const onerrorMatch = aiChatWidgetSrc.match(/recognition\.onerror\s*=\s*\(([^)]*)\)\s*=>\s*\{([\s\S]*?)\n\s*\};/);
  assert(onerrorMatch, 'recognition.onerror handler must exist');
  const onerrorBody = onerrorMatch[2];
  assert(onerrorBody.includes('setIsListening(false)'), 'onerror must call setIsListening(false)');
  assert(!onerrorBody.includes('handleSendMessage'), 'onerror must NEVER call handleSendMessage');
});

// ========================================================================================
// ISSUE 2: TTS / Read-Aloud Audio & Chromium Freeze Fix
// ========================================================================================
console.log('\n--- Verification 2: TTS / Read-Aloud Sound Fix ---');

runTest('cleanTextForSpeech strips Markdown syntax, emojis, URLs, and code blocks', () => {
  const markdownText = 'Check out **Atul Verma** at [Portfolio](https://example.com/atul)! Here is `code snippet` and 🚀 emojis.';
  const cleaned = cleanTextForSpeech(markdownText);
  assert(!cleaned.includes('**'), 'Bold markdown should be stripped');
  assert(!cleaned.includes('https://'), 'URLs should be stripped');
  assert(!cleaned.includes('['), 'Bracket markup should be stripped');
  assert(!cleaned.includes('🚀'), 'Emojis should be stripped');
  assert(cleaned.includes('Atul Verma'), 'Text content should be preserved');
  assert(cleaned.includes('Portfolio'), 'Link anchor text should be preserved');
});

runTest('TTS handleToggleSpeech checks window.speechSynthesis and resumes if paused', () => {
  assert(aiChatWidgetSrc.includes('window.speechSynthesis.resume()'), 'Must include window.speechSynthesis.resume() call');
  assert(aiChatWidgetSrc.includes('cleanTextForSpeech(text)'), 'Must pass text through cleanTextForSpeech');
});

runTest('Utterance volume, rate, and pitch are explicitly configured', () => {
  assert(aiChatWidgetSrc.includes('utterance.volume = 1'), 'utterance.volume must be set');
  assert(aiChatWidgetSrc.includes('utterance.rate = 1'), 'utterance.rate must be set');
  assert(aiChatWidgetSrc.includes('utterance.pitch = 1'), 'utterance.pitch must be set');
});

runTest('Voice selection prioritizes en-IN, Natural/Online English, and default fallbacks', () => {
  assert(aiChatWidgetSrc.includes("v.lang === 'en-IN'"), 'Voice selection should prioritize Indian English');
  assert(aiChatWidgetSrc.includes("v.lang.startsWith('en')"), 'Voice selection should prioritize English');
  assert(aiChatWidgetSrc.includes('availableVoicesRef'), 'Voice selection should use availableVoicesRef cache');
});

// ========================================================================================
// ISSUE 3: 44 Slash Commands & Autocomplete Popup
// ========================================================================================
console.log('\n--- Verification 3: 44 Slash Commands & Autocomplete Popup ---');

runTest('chatSlashCommands.js exports exactly 44 commands', () => {
  assert.strictEqual(CHAT_SLASH_COMMANDS.length, 44, `Expected exactly 44 slash commands, got ${CHAT_SLASH_COMMANDS.length}`);
});

runTest('Every slash command starts with "/" and has valid command, label, category, description, and icon', () => {
  for (const cmd of CHAT_SLASH_COMMANDS) {
    assert(cmd.command.startsWith('/'), `Command ${cmd.command} must start with /`);
    assert(cmd.label && cmd.label.trim().length > 0, `Command ${cmd.command} missing label`);
    assert(cmd.category && cmd.category.trim().length > 0, `Command ${cmd.command} missing category`);
    assert(cmd.description && cmd.description.trim().length > 0, `Command ${cmd.command} missing description`);
    assert(cmd.icon && cmd.icon.trim().length > 0, `Command ${cmd.command} missing icon`);
  }
});

runTest('All 44 slash commands return a valid response from handleSlashCommand', () => {
  for (const cmd of CHAT_SLASH_COMMANDS) {
    const res = handleSlashCommand(cmd.command);
    assert(res, `handleSlashCommand returned null for ${cmd.command}`);
    assert(typeof res.text === 'string' && res.text.length > 10, `handleSlashCommand invalid text for ${cmd.command}`);
  }
});

runTest('All 44 slash commands return a valid response via queryAssistant engine', () => {
  for (const cmd of CHAT_SLASH_COMMANDS) {
    const res = queryAssistant(cmd.command, { role: 'overview', audience: 'all' });
    assert(res, `queryAssistant returned null for ${cmd.command}`);
    assert(typeof res.text === 'string' && res.text.length > 10, `queryAssistant invalid text for ${cmd.command}`);
  }
});

runTest('AIChatWidget.jsx renders autocomplete popup when input starts with "/"', () => {
  assert(aiChatWidgetSrc.includes("inputValue.startsWith('/')"), 'Widget must check inputValue.startsWith("/")');
  assert(aiChatWidgetSrc.includes('filteredSlashCommands'), 'Widget must compute filteredSlashCommands');
  assert(aiChatWidgetSrc.includes('executeSlashCommand'), 'Widget must implement executeSlashCommand');
  assert(aiChatWidgetSrc.includes('activeSlashIndex'), 'Widget must track activeSlashIndex for keyboard navigation');
});

runTest('Keyboard navigation supports ArrowDown, ArrowUp, Tab auto-fill, and Enter execution', () => {
  assert(aiChatWidgetSrc.includes("e.key === 'ArrowDown'"), 'Must handle ArrowDown');
  assert(aiChatWidgetSrc.includes("e.key === 'ArrowUp'"), 'Must handle ArrowUp');
  assert(aiChatWidgetSrc.includes("e.key === 'Tab'"), 'Must handle Tab auto-fill');
  assert(aiChatWidgetSrc.includes("e.key === 'Enter'"), 'Must handle Enter');
});

// ========================================================================================
// ISSUE 4: Escape Key Minimization at Window Capture Phase
// ========================================================================================
console.log('\n--- Verification 4: Escape Key Minimization at Window Capture Phase ---');

runTest('Global keydown listener uses window capture phase (true)', () => {
  assert(
    aiChatWidgetSrc.includes("window.addEventListener('keydown', handleGlobalKeydown, true)"),
    'Must register keydown listener on window with useCapture=true'
  );
  assert(
    aiChatWidgetSrc.includes("window.removeEventListener('keydown', handleGlobalKeydown, true)"),
    'Must unregister keydown listener on window with useCapture=true'
  );
});

runTest('Escape key minimizes chat when open and unminimized, and closes when minimized', () => {
  assert(aiChatWidgetSrc.includes("if (e.key === 'Escape')"), 'Must check e.key === "Escape"');
  assert(aiChatWidgetSrc.includes('setIsMinimized(true)'), 'Must call setIsMinimized(true) on Escape');
  assert(aiChatWidgetSrc.includes('setIsOpen(false)'), 'Must call setIsOpen(false) when already minimized');
  // Check exact block logic
  const escapeBlockMatch = aiChatWidgetSrc.match(/if\s*\(\s*e\.key\s*===\s*['"]Escape['"]\s*\)\s*\{([\s\S]*?)\n\s*\}\s*\n\s*\};/);
  assert(escapeBlockMatch, 'Escape handler block must exist inside handleGlobalKeydown');
  const body = escapeBlockMatch[1];
  assert(body.includes('if (isOpen && !isMinimized)'), 'Must check open and not minimized');
  assert(body.includes('setIsMinimized(true)'), 'Must minimize');
  assert(body.includes('else if (isOpen && isMinimized)'), 'Must check open and minimized');
  assert(body.includes('setIsOpen(false)'), 'Must close');
  assert(body.includes('e.preventDefault()'), 'Must call e.preventDefault() to prevent browser default');
});

// ========================================================================================
// Summary
// ========================================================================================
console.log('\n========================================================================================');
console.log(`  VERIFICATION RESULTS: ${passCount} PASSED | ${failCount} FAILED`);
console.log('========================================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
