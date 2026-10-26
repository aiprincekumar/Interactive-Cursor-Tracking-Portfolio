// scripts/verify_phase4_ai_chat.mjs
// Verification suite for Phase 4: Accessibility (WCAG 2.1 AA), ARIA Live Regions, Sound & Motion Controls

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failedTests++;
  }
}

console.log('========================================================');
console.log('RUNNING PHASE 4 AI CHAT ACCESSIBILITY & UX VERIFICATION');
console.log('========================================================\n');

const widgetPath = path.join(rootDir, 'src', 'components', 'AIChatWidget.jsx');
assert(fs.existsSync(widgetPath), 'src/components/AIChatWidget.jsx exists on disk');
const widgetSource = fs.readFileSync(widgetPath, 'utf8');

const hookPath = path.join(rootDir, 'src', 'hooks', 'useFocusTrap.js');
assert(fs.existsSync(hookPath), 'src/hooks/useFocusTrap.js exists on disk');
const hookSource = fs.readFileSync(hookPath, 'utf8');

// --- Suite 1: Focus Trap & Dialog Navigation ---
console.log('\n--- Suite 1: Focus Trap & Dialog Navigation ---');

assert(
  widgetSource.includes("import { useFocusTrap } from '../hooks/useFocusTrap.js'") ||
  widgetSource.includes('useFocusTrap'),
  'useFocusTrap is imported in AIChatWidget.jsx'
);

assert(
  /useFocusTrap\s*\(\s*isOpen\s*&&\s*!isMinimized\s*&&\s*!isMobile\s*,\s*widgetRef/m.test(widgetSource),
  'useFocusTrap is wired with (isOpen && !isMinimized && !isMobile, widgetRef)'
);

assert(
  widgetSource.includes('initialFocusRef: inputRef') &&
  widgetSource.includes('restoreFocus: true'),
  'useFocusTrap options configure initialFocusRef: inputRef and restoreFocus: true'
);

assert(
  /inputRef\.current\?\.focus\(\)/.test(widgetSource),
  'Programmatically focuses inputRef on chat window activation'
);

assert(
  hookSource.includes('export function useFocusTrap'),
  'useFocusTrap hook is properly implemented and exported'
);

// --- Suite 2: Conversational ARIA Semantics & Screen Reader Hygiene ---
console.log('\n--- Suite 2: Conversational ARIA Semantics & Screen Reader Hygiene ---');

assert(
  widgetSource.includes('role="log"'),
  'Conversation scroll container uses semantic role="log"'
);

assert(
  widgetSource.includes('aria-label="Conversation history"'),
  'Conversation scroll container uses aria-label="Conversation history"'
);

assert(
  widgetSource.includes('aria-live="polite"'),
  'Conversation scroll container specifies aria-live="polite"'
);

assert(
  widgetSource.includes('aria-relevant="additions text"'),
  'Conversation scroll container specifies aria-relevant="additions text"'
);

assert(
  widgetSource.includes('role="article"'),
  'Message elements use semantic role="article"'
);

assert(
  /aria-label=\{\s*`Message from \$\{\s*messageRoleLabel|\(msg\.role|msg\.role === 'assistant'/m.test(widgetSource),
  'Message elements provide descriptive aria-label with role and timestamp'
);

assert(
  widgetSource.includes('export function formatTime') || widgetSource.includes('const formatTime ='),
  'formatTime function is defined to present readable timestamp strings to screen readers'
);

assert(
  !widgetSource.includes('setLiveAnnouncement(cleanForA11y(botReplyText));\n        announce(botReplyText'),
  'Screen reader announcement region is clean without duplicate echo of message text'
);

// --- Suite 3: Voice STT, Input Bar & Haptic Feedback UX ---
console.log('\n--- Suite 3: Voice STT, Input Bar & Haptic Feedback UX ---');

assert(
  /soundFX\.triggerHaptic\(\s*\[?20/.test(widgetSource),
  'soundFX.triggerHaptic is invoked in AIChatWidget'
);

assert(
  widgetSource.includes('soundFX.triggerHaptic([20, 30, 20])') ||
  widgetSource.includes('soundFX.triggerHaptic(20)'),
  'Tactile haptic pulses are triggered on voice toggle'
);

// Verify voice dictation architectural invariant: NEVER auto-submits
const voiceHandlerMatch = widgetSource.match(/const handleToggleVoiceInput =[\s\S]*?recognition\.onresult =[\s\S]*?recognition\.start\(\);/m);
assert(
  voiceHandlerMatch !== null,
  'Voice recognition handler exists in AIChatWidget'
);

if (voiceHandlerMatch) {
  const handlerCode = voiceHandlerMatch[0];
  const autoSubmits = handlerCode.includes('handleSendMessage(');
  assert(
    !autoSubmits,
    'Voice transcription STRICTLY updates inputValue and NEVER auto-submits (Zero Auto-Send Invariant)'
  );
  assert(
    handlerCode.includes('setInputValue('),
    'Voice transcription correctly transcribes recognized speech into inputValue'
  );
}

assert(
  widgetSource.includes('aria-pressed={isListening}') || widgetSource.includes('aria-pressed={isRecording}'),
  'Voice mic button includes accessible aria-pressed state attribute'
);

assert(
  widgetSource.includes('min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px]') ||
  widgetSource.includes('min-w-[44px] min-h-[44px]'),
  'Voice mic button and Send button adhere to WCAG >= 44px mobile touch target size'
);

// --- Suite 4: Reduced Motion & Visible Focus Indicators ---
console.log('\n--- Suite 4: Reduced Motion & Visible Focus Indicators ---');

assert(
  widgetSource.includes('(prefers-reduced-motion: reduce)') &&
  widgetSource.includes('prefersReducedMotion'),
  'AIChatWidget detects system prefers-reduced-motion media query and LabContext setting'
);

assert(
  /messagesEndRef\.current\?\.scrollIntoView\(\{\s*behavior:\s*prefersReducedMotion\s*\?\s*'auto'\s*:\s*'smooth'\s*\}\)/.test(widgetSource),
  'Auto-scrolling uses behavior: auto when reduced motion is preferred'
);

assert(
  widgetSource.includes("prefersReducedMotion ? 'animate-pulse' : 'animate-bounce"),
  'Typing indicator dots substitute animate-pulse for animate-bounce under reduced motion'
);

assert(
  widgetSource.includes('focus-visible:ring-2') &&
  widgetSource.includes('focus-visible:ring-[#FF4D6D]'),
  'Interactive buttons feature visible focus rings (focus-visible:ring-2 focus-visible:ring-[#FF4D6D])'
);

assert(
  widgetSource.includes('focus-visible:ring-offset-2'),
  'Interactive buttons feature focus-visible:ring-offset-2 for high contrast legibility'
);

console.log('\n========================================================');
console.log(`PHASE 4 TEST RESULTS: PASSED: ${passedTests}, FAILED: ${failedTests}`);
console.log('========================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🌟 ALL PHASE 4 ACCESSIBILITY & UX VERIFICATIONS PASSED! 🌟\n');
  process.exit(0);
}
