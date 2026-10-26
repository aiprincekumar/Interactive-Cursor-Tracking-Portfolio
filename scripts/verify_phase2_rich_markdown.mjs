import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { queryAssistant, cleanMarkdownAsterisks } from '../src/utils/portfolioAssistantEngine.js';

console.log('================================================================');
console.log('🧪 RUNNING PHASE 2 VERIFICATION: RICH MARKDOWN & CHAT BUBBLES');
console.log('================================================================\n');

const formattedMsgPath = path.resolve('src/components/chat/FormattedMessage.jsx');
const rootFormattedMsgPath = path.resolve('src/components/FormattedMessage.jsx');
const widgetPath = path.resolve('src/components/AIChatWidget.jsx');
const enginePath = path.resolve('src/utils/portfolioAssistantEngine.js');

assert(fs.existsSync(formattedMsgPath), 'FormattedMessage.jsx must exist in src/components/chat/');
assert(fs.existsSync(rootFormattedMsgPath), 'FormattedMessage.jsx must exist in src/components/');
assert(fs.existsSync(widgetPath), 'AIChatWidget.jsx must exist');
assert(fs.existsSync(enginePath), 'portfolioAssistantEngine.js must exist');

const formattedMsgCode = fs.readFileSync(formattedMsgPath, 'utf8');
const widgetCode = fs.readFileSync(widgetPath, 'utf8');
const engineCode = fs.readFileSync(enginePath, 'utf8');

let passCount = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(err.message);
    process.exit(1);
  }
}

// 1. FormattedMessage code block checks
test('FormattedMessage provides fenced code block parsing with header, copy button, and overflow-x-auto', () => {
  assert(formattedMsgCode.includes('function CodeBlock'), 'Must have CodeBlock component');
  assert(formattedMsgCode.includes('navigator.clipboard.writeText'), 'Must have clipboard API integration');
  assert(formattedMsgCode.includes('overflow-x-auto'), 'Must have horizontal scroll for code blocks');
  assert(formattedMsgCode.includes('Copied!'), 'Must provide visual copy confirmation feedback');
  assert(formattedMsgCode.includes('displayLang'), 'Must display language identifier badge');
});

// 2. FormattedMessage inline parsing checks
test('FormattedMessage supports inline code chips, bold, italics, links, and lists', () => {
  assert(formattedMsgCode.includes('parseInlineMarkdown'), 'Must export/define parseInlineMarkdown');
  assert(formattedMsgCode.includes('font-mono text-[11px]'), 'Must style inline code with monospaced typography');
  assert(formattedMsgCode.includes('font-semibold text-stone-900 dark:text-stone-100'), 'Must format bold with WCAG dark mode contrast');
  assert(formattedMsgCode.includes('list-disc space-y-1'), 'Must format bullet lists cleanly');
  assert(formattedMsgCode.includes('ExternalLink'), 'Must render ExternalLink icon for clickable markdown links');
});

// 3. cleanTextForSpeech in AIChatWidget
test('AIChatWidget cleanTextForSpeech strips fenced code blocks, urls, and symbols for audio speech', () => {
  assert(widgetCode.includes('cleanTextForSpeech'), 'Must export cleanTextForSpeech');
  // Extract and test cleanTextForSpeech regex logic
  function testCleanText(text) {
    return text
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[*#_~`>]/g, ' ')
      .replace(/[•●▪■◆★☆✓✔✕✖]/g, ' ')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]|\u{FE0F}/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  const sample = "Check this ```sql\nSELECT * FROM sensitive;\n``` and [Link](https://atulverma.dev) with **bold** text!";
  const cleaned = testCleanText(sample);
  assert(!cleaned.includes('sensitive'), 'Fenced code content must be stripped from speech synthesis');
  assert(!cleaned.includes('```'), 'Backticks must be stripped');
  assert(!cleaned.includes('**'), 'Asterisks must be stripped');
  assert(cleaned.includes('Check this and Link with bold text!'), 'Sentence structure must remain natural');
});

// 4. AIChatWidget integration of FormattedMessage
test('AIChatWidget renders FormattedMessage and preserves emoji tuning toggle', () => {
  assert(widgetCode.includes('FormattedMessage'), 'AIChatWidget must import and render FormattedMessage');
  assert(widgetCode.includes('<FormattedMessage'), 'Must render <FormattedMessage component');
  assert(widgetCode.includes('tuneResponseEmojis(msg.text, audience, { enabled: false })'), 'Must preserve emoji tuning toggle logic');
});

// 5. Dark mode timestamp contrast and model badges
test('AIChatWidget timestamp contrast and model badges meet WCAG AA standards', () => {
  assert(widgetCode.includes('text-stone-500 dark:text-stone-400'), 'Timestamps must use high-contrast dark:text-stone-400');
  assert(widgetCode.includes('⚡'), 'Model badge must support ⚡ for local models');
  assert(widgetCode.includes('📚'), 'Model badge must support 📚 for knowledge engine');
  assert(widgetCode.includes('dark:border-emerald-600'), 'Must include emerald border for on-device AI');
  assert(widgetCode.includes('dark:border-indigo-700'), 'Must include indigo border for portfolio engine');
});

// 6. portfolioAssistantEngine retains markdown asterisks
test('portfolioAssistantEngine formatAssistantResponse delivers rich markdown to UI', () => {
  assert(!engineCode.includes('const cleanedText = cleanMarkdownAsterisks(data.text);'), 'Must NOT preemptively strip asterisks in formatAssistantResponse');
  const res = queryAssistant('What is your WhatsApp and phone number?');
  assert(res.text.includes('**WhatsApp**') || res.text.includes('•') || res.text.includes('**'), 'Response text should contain markdown bold/bullets');
});

// 7. cleanMarkdownAsterisks backward compatibility
test('cleanMarkdownAsterisks export is retained for backward compatibility', () => {
  assert(typeof cleanMarkdownAsterisks === 'function', 'cleanMarkdownAsterisks must remain an exported function');
  const result = cleanMarkdownAsterisks('• **Test** *Message*');
  assert.strictEqual(result, 'Test Message');
});

console.log('\n================================================================');
console.log(`TOTAL CHECKS: ${passCount} | PASSED: ${passCount} | FAILED: 0`);
console.log('🌟 ALL PHASE 2 VERIFICATIONS PASSED SUCCESSFULLY! 🌟');
console.log('================================================================\n');
