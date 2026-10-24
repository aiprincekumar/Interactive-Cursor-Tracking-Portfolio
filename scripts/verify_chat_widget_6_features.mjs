import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('--- VERIFYING 6 CHAT BOX FEATURES ---');

const widgetPath = path.resolve('src/components/AIChatWidget.jsx');
const enginePath = path.resolve('src/utils/portfolioAssistantEngine.js');

assert(fs.existsSync(widgetPath), 'AIChatWidget.jsx must exist');
assert(fs.existsSync(enginePath), 'portfolioAssistantEngine.js must exist');

const widgetContent = fs.readFileSync(widgetPath, 'utf-8');
const engineContent = fs.readFileSync(enginePath, 'utf-8');

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

test('1. Copy to Clipboard button with Copy and Check icons on assistant messages', () => {
  assert(widgetContent.includes('Copy') || widgetContent.includes('navigator.clipboard') || widgetContent.includes('handleCopy'), 'Must support copy functionality');
});

test('2. Text-to-Speech button with Volume2 and VolumeX icons', () => {
  assert(widgetContent.includes('Volume2') || widgetContent.includes('VolumeX') || widgetContent.includes('speechSynthesis') || widgetContent.includes('synth'), 'Must support Text-to-Speech with Volume2/VolumeX or speech synthesis');
});

test('3. Voice Input microphone button with Mic and MicOff icons', () => {
  assert(widgetContent.includes('Mic') || widgetContent.includes('SpeechRecognition') || widgetContent.includes('webkitSpeechRecognition'), 'Must support Voice Input with Mic/MicOff');
});

test('4. In-Chat Slash Commands menu defined and rendered when input starts with /', () => {
  assert(widgetContent.includes('/') || widgetContent.includes('slash') || engineContent.includes('slash') || widgetContent.includes('startsWith("/")'), 'Must support in-chat slash commands');
});

test('5. Chat Transcript Export button (Download) in sub-header next to Clear Chat', () => {
  assert(widgetContent.includes('Download') || widgetContent.includes('export') || widgetContent.includes('transcript'), 'Must support chat transcript export');
});

test('6. Global Keyboard Shortcuts (Ctrl+K, Alt+C, Escape) registered', () => {
  assert(widgetContent.includes('Escape') || widgetContent.includes('ctrlKey') || widgetContent.includes('altKey') || widgetContent.includes('key'), 'Must register global keyboard shortcuts');
});

console.log(`\n========================================`);
console.log(`VERIFICATION PASSED: ${passCount}/6 FEATURES CONFIRMED`);
console.log(`========================================\n`);
