/**
 * Master Verification Harness: Phase 11 Voice Agent & Multimodal Speech Synthesis Studio
 * Verifies:
 * 1. Voice State Machine lifecycle & transitions (IDLE, SPEAKING, PAUSED, LISTENING)
 * 2. Config clamping, sanitization, and persistence
 * 3. Multilingual voice resolver, text cleaner & Chrome TTS watchdog timer
 * 4. Waveform component & slash command action contracts
 * 5. AIChatWidget.jsx voice integration & hands-free auto-speak audit
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  \x1b[32m✔\x1b[0m ${message}`);
  } else {
    failedTests++;
    console.error(`  \x1b[31m✖\x1b[0m ${message}`);
  }
}

console.log('\n🎙️  Running Phase 11: Multimodal Voice Agent & Speech Synthesis Studio Master Verification\n');

// ---------------------------------------------------------------------------
// Suite 1: Voice State Machine Lifecycle & Transitions
// ---------------------------------------------------------------------------
console.log('\x1b[1mSuite 1: Voice State Machine Lifecycle & Transitions\x1b[0m');
try {
  const voiceEngine = await import('../src/utils/voiceAgentEngine.js');
  const {
    VOICE_STATES,
    getVoiceState,
    setVoiceState,
    getVoiceMetadata,
    subscribeVoiceState,
    resetVoiceConfig
  } = voiceEngine;

  assert(Boolean(VOICE_STATES), 'VOICE_STATES constant is exported');
  assert(VOICE_STATES.IDLE === 'idle', 'VOICE_STATES.IDLE is defined as "idle"');
  assert(VOICE_STATES.SPEAKING === 'speaking', 'VOICE_STATES.SPEAKING is defined as "speaking"');
  assert(VOICE_STATES.PAUSED === 'paused', 'VOICE_STATES.PAUSED is defined as "paused"');
  assert(VOICE_STATES.LISTENING === 'listening', 'VOICE_STATES.LISTENING is defined as "listening"');

  // Test state transitions and pub/sub subscriber
  let subscriberCalls = 0;
  let lastSubscriberState = null;
  const unsubscribe = subscribeVoiceState((snapshot) => {
    subscriberCalls++;
    lastSubscriberState = snapshot.state;
  });

  assert(subscriberCalls >= 1, 'subscribeVoiceState triggers immediate initial snapshot');

  // Transition to SPEAKING
  setVoiceState(VOICE_STATES.SPEAKING, { utteranceId: 'test_utt_01', text: 'Hello' });
  assert(getVoiceState() === VOICE_STATES.SPEAKING, 'State successfully transitions to SPEAKING');
  assert(lastSubscriberState === VOICE_STATES.SPEAKING, 'Subscriber receives SPEAKING state update');
  const meta = getVoiceMetadata();
  assert(meta.utteranceId === 'test_utt_01', 'Metadata includes utteranceId');

  // Transition to PAUSED
  setVoiceState(VOICE_STATES.PAUSED);
  assert(getVoiceState() === VOICE_STATES.PAUSED, 'State successfully transitions to PAUSED');

  // Transition back to IDLE
  setVoiceState(VOICE_STATES.IDLE);
  assert(getVoiceState() === VOICE_STATES.IDLE, 'State successfully transitions to IDLE');

  // Invalid state fallback
  setVoiceState('INVALID_UNKNOWN_STATE');
  assert(getVoiceState() === VOICE_STATES.IDLE, 'Invalid state safely falls back to IDLE');

  unsubscribe();
  const preUnsubCalls = subscriberCalls;
  setVoiceState(VOICE_STATES.LISTENING);
  assert(subscriberCalls === preUnsubCalls, 'Unsubscribe stops receiving further notifications');
  setVoiceState(VOICE_STATES.IDLE);
} catch (err) {
  assert(false, `Suite 1 encountered unexpected error: ${err.message}`);
}

// ---------------------------------------------------------------------------
// Suite 2: Config Clamping, Sanitization, and Persistence
// ---------------------------------------------------------------------------
console.log('\n\x1b[1mSuite 2: Config Clamping, Sanitization, and Persistence\x1b[0m');
try {
  const voiceEngine = await import('../src/utils/voiceAgentEngine.js');
  const {
    clampConfigValue,
    sanitizeVoiceConfig,
    getVoiceConfig,
    setVoiceConfig,
    resetVoiceConfig,
    DEFAULT_VOICE_CONFIG
  } = voiceEngine;

  // Rate clamping (0.75 - 1.5)
  assert(clampConfigValue('rate', 0.2) === 0.75, 'Rate below minimum clamps to 0.75');
  assert(clampConfigValue('rate', 2.0) === 1.5, 'Rate above maximum clamps to 1.5');
  assert(clampConfigValue('rate', 1.25) === 1.25, 'Rate within range remains intact (1.25)');
  assert(clampConfigValue('rate', NaN) === 1.0, 'NaN rate falls back to default 1.0');
  assert(clampConfigValue('rate', Infinity) === 1.0, 'Infinity rate falls back to default 1.0');

  // Pitch clamping (0.8 - 1.2)
  assert(clampConfigValue('pitch', 0.5) === 0.8, 'Pitch below minimum clamps to 0.8');
  assert(clampConfigValue('pitch', 1.8) === 1.2, 'Pitch above maximum clamps to 1.2');
  assert(clampConfigValue('pitch', 1.1) === 1.1, 'Pitch within range remains intact (1.1)');

  // Volume clamping (0.0 - 1.0)
  assert(clampConfigValue('volume', -0.5) === 0.0, 'Volume below 0 clamps to 0.0');
  assert(clampConfigValue('volume', 2.5) === 1.0, 'Volume above 1 clamps to 1.0');

  // Sanitization check
  const sanitized = sanitizeVoiceConfig({
    rate: 9.9,
    pitch: 0.1,
    volume: 5.0,
    voiceProfile: 'invalid-profile',
    autoSpeakResponses: true
  });
  assert(sanitized.rate === 1.5, 'Sanitized rate is clamped to 1.5');
  assert(sanitized.pitch === 0.8, 'Sanitized pitch is clamped to 0.8');
  assert(sanitized.volume === 1.0, 'Sanitized volume is clamped to 1.0');
  assert(sanitized.voiceProfile === DEFAULT_VOICE_CONFIG.voiceProfile, 'Invalid voiceProfile resets to default');
  assert(sanitized.autoSpeakResponses === true, 'Valid autoSpeakResponses boolean is preserved');

  // setVoiceConfig and resetVoiceConfig
  setVoiceConfig({ rate: 1.2, autoSpeakResponses: true, voiceProfile: 'hi-IN' });
  const updatedCfg = getVoiceConfig();
  assert(updatedCfg.rate === 1.2, 'setVoiceConfig correctly updates rate');
  assert(updatedCfg.autoSpeakResponses === true, 'setVoiceConfig correctly updates autoSpeakResponses');
  assert(updatedCfg.voiceProfile === 'hi-IN', 'setVoiceConfig correctly updates voiceProfile');

  const resetCfg = resetVoiceConfig();
  assert(resetCfg.rate === 1.0, 'resetVoiceConfig restores default rate');
  assert(resetCfg.autoSpeakResponses === false, 'resetVoiceConfig restores default autoSpeakResponses');
} catch (err) {
  assert(false, `Suite 2 encountered unexpected error: ${err.message}`);
}

// ---------------------------------------------------------------------------
// Suite 3: Multilingual Voice Resolver & Chrome Watchdog Timer
// ---------------------------------------------------------------------------
console.log('\n\x1b[1mSuite 3: Multilingual Voice Resolver & Chrome Watchdog Timer\x1b[0m');
try {
  const voiceEngine = await import('../src/utils/voiceAgentEngine.js');
  const {
    cleanTextForSpeech,
    resolveVoice,
    startChromeWatchdog,
    stopChromeWatchdog,
    isWatchdogActive
  } = voiceEngine;

  // Text cleaner tests
  const rawText = "Check this **bold project** and [Live Demo](https://example.com) with ```const code = 42;``` and emoji 🚀!";
  const cleaned = cleanTextForSpeech(rawText);
  assert(!cleaned.includes('**'), 'cleanTextForSpeech strips bold asterisks');
  assert(!cleaned.includes('https://example.com'), 'cleanTextForSpeech strips raw markdown URLs');
  assert(cleaned.includes('Live Demo'), 'cleanTextForSpeech preserves anchor link text');
  assert(cleaned.includes('[Code omitted]'), 'cleanTextForSpeech replaces fenced code with placeholder');
  assert(!cleaned.includes('🚀'), 'cleanTextForSpeech strips TTS-stutter emojis');

  // Mock voice list
  const mockVoices = [
    { name: 'Google Hindi', lang: 'hi-IN', default: false },
    { name: 'Google Indian English', lang: 'en-IN', default: false },
    { name: 'Microsoft Natural English (US)', lang: 'en-US', default: false },
    { name: 'Generic Default', lang: 'en-GB', default: true }
  ];

  // Auto Devanagari detection
  const hindiResolved = resolveVoice(mockVoices, 'auto', 'नमस्ते अतुल कैसे हो?');
  assert(hindiResolved && hindiResolved.lang === 'hi-IN', 'Auto profile selects hi-IN for Devanagari script');

  // Explicit profile resolution
  const enInResolved = resolveVoice(mockVoices, 'en-IN', 'Hello Atul');
  assert(enInResolved && enInResolved.lang === 'en-IN', 'Resolves Indian English voice for en-IN profile');

  const enUsResolved = resolveVoice(mockVoices, 'en-US', 'Hello world');
  assert(enUsResolved && enUsResolved.lang === 'en-US', 'Resolves US English voice for en-US profile');

  // Empty voice list fallback
  assert(resolveVoice([], 'auto') === null, 'Returns null safely when voices array is empty');

  // Chrome Watchdog tests
  startChromeWatchdog(100);
  assert(isWatchdogActive() === true, 'Watchdog marks active state on start');
  stopChromeWatchdog();
  assert(isWatchdogActive() === false, 'Watchdog marks inactive state on stop');
} catch (err) {
  assert(false, `Suite 3 encountered unexpected error: ${err.message}`);
}

// ---------------------------------------------------------------------------
// Suite 4: Waveform Component & Slash Command Action Contracts
// ---------------------------------------------------------------------------
console.log('\n\x1b[1mSuite 4: Waveform Component & Slash Command Action Contracts\x1b[0m');
try {
  const waveformPath = path.resolve(rootDir, 'src/components/chat/VoiceVisualizerWaveform.jsx');
  assert(fs.existsSync(waveformPath), 'VoiceVisualizerWaveform.jsx exists in src/components/chat/');

  const waveformContent = fs.readFileSync(waveformPath, 'utf8');
  assert(waveformContent.includes('canvasRef'), 'Waveform component implements canvas rendering');
  assert(waveformContent.includes('prefers-reduced-motion'), 'Waveform component observes prefers-reduced-motion');
  assert(waveformContent.includes('onPauseResume'), 'Waveform component handles play/pause action controls');
  assert(waveformContent.includes('onStop'), 'Waveform component handles stop audio action');
  assert(waveformContent.includes('border-amber-500/30') || waveformContent.includes('isPaused'), 'Waveform component supports paused amber state');

  // Verify chatSlashCommands.js
  const slashModule = await import('../src/data/chatSlashCommands.js');
  const { CHAT_SLASH_COMMANDS, handleSlashCommand } = slashModule;

  const voiceCmd = CHAT_SLASH_COMMANDS.find((c) => c.command === '/voice');
  const speakCmd = CHAT_SLASH_COMMANDS.find((c) => c.command === '/speak');
  const voiceSettingsCmd = CHAT_SLASH_COMMANDS.find((c) => c.command === '/voicesettings');
  const voiceConfigCmd = CHAT_SLASH_COMMANDS.find((c) => c.command === '/voiceconfig');

  assert(Boolean(voiceCmd), 'Slash command /voice is registered');
  assert(Boolean(speakCmd), 'Slash command /speak is registered');
  assert(Boolean(voiceSettingsCmd), 'Slash command /voicesettings is registered');
  assert(Boolean(voiceConfigCmd), 'Slash command /voiceconfig is registered');

  // Execute slash commands and test actions contract
  const voiceExec = handleSlashCommand('/voice');
  assert(voiceExec && voiceExec.actions?.some((a) => a.type === 'open-voice-settings'), '/voice provides open-voice-settings action');
  assert(voiceExec && voiceExec.actions?.some((a) => a.type === 'speak-last'), '/voice provides speak-last action');
  assert(voiceExec && voiceExec.actions?.some((a) => a.type === 'toggle-auto-speak'), '/voice provides toggle-auto-speak action');

  const speakExec = handleSlashCommand('/speak Test speech');
  assert(speakExec && speakExec.actions?.some((a) => a.type === 'speak-last'), '/speak provides speak-last action');

  const settingsExec = handleSlashCommand('/voicesettings');
  assert(settingsExec && settingsExec.actions?.some((a) => a.type === 'open-voice-settings'), '/voicesettings provides open-voice-settings action');
} catch (err) {
  assert(false, `Suite 4 encountered unexpected error: ${err.message}`);
}

// ---------------------------------------------------------------------------
// Suite 5: AIChatWidget.jsx Voice Integration Audit
// ---------------------------------------------------------------------------
console.log('\n\x1b[1mSuite 5: AIChatWidget.jsx Voice Integration Audit\x1b[0m');
try {
  const widgetPath = path.resolve(rootDir, 'src/components/AIChatWidget.jsx');
  assert(fs.existsSync(widgetPath), 'AIChatWidget.jsx exists');

  const widgetContent = fs.readFileSync(widgetPath, 'utf8');

  // Imports
  assert(widgetContent.includes('VoiceVisualizerWaveform'), 'Imports VoiceVisualizerWaveform component');
  assert(widgetContent.includes('speakText'), 'Imports speakText API');
  assert(widgetContent.includes('stopSpeaking'), 'Imports stopSpeaking API');
  assert(widgetContent.includes('pauseSpeech'), 'Imports pauseSpeech API');
  assert(widgetContent.includes('resumeSpeech'), 'Imports resumeSpeech API');

  // HUD Banner mounting
  assert(widgetContent.includes('voiceEngineState !== VOICE_STATES.IDLE'), 'Mounts VoiceVisualizerWaveform HUD when voice engine is active');

  // Voice Settings Studio Modal
  assert(widgetContent.includes('showVoiceSettings'), 'Implements showVoiceSettings modal/popover toggle');
  assert(widgetContent.includes('id="voice-profile-select"'), 'Implements Voice Profile select dropdown in Studio');
  assert(widgetContent.includes('aria-label="Speaking rate slider"'), 'Implements accessible Speaking Rate slider in Studio');
  assert(widgetContent.includes('aria-label="Pitch modulator slider"'), 'Implements accessible Pitch modulator slider in Studio');
  assert(widgetContent.includes('role="switch"') && widgetContent.includes('Auto-Speak'), 'Implements Hands-Free Auto-Speak toggle switch in Studio');
  assert(widgetContent.includes('Test Voice Sample'), 'Implements Test Voice Sample button in Studio');
  assert(widgetContent.includes('Reset to Default'), 'Implements Reset to Default button in Studio');

  // Hands-Free Auto-Speak
  assert(widgetContent.includes('triggerAutoSpeak'), 'Implements triggerAutoSpeak for incoming assistant messages');

  // Action execution wiring
  assert(widgetContent.includes("type === 'open-voice-settings'"), 'handleExecuteAction wires open-voice-settings');
  assert(widgetContent.includes("type === 'speak-last'"), 'handleExecuteAction wires speak-last');
  assert(widgetContent.includes("type === 'toggle-auto-speak'"), 'handleExecuteAction wires toggle-auto-speak');
  assert(widgetContent.includes("type === 'stop-speech'"), 'handleExecuteAction wires stop-speech');
  assert(widgetContent.includes("type === 'pause-speech'"), 'handleExecuteAction wires pause-speech');
  assert(widgetContent.includes("type === 'resume-speech'"), 'handleExecuteAction wires resume-speech');
} catch (err) {
  assert(false, `Suite 5 encountered unexpected error: ${err.message}`);
}

// ---------------------------------------------------------------------------
// Final Results
// ---------------------------------------------------------------------------
console.log('\n------------------------------------------------------------');
console.log(`Phase 11 Verification Summary:`);
console.log(`Total Assertions : ${totalTests}`);
console.log(`Passed           : \x1b[32m${passedTests}\x1b[0m`);
console.log(`Failed           : \x1b[31m${failedTests}\x1b[0m`);
console.log('------------------------------------------------------------');

if (failedTests > 0) {
  console.error('\x1b[31mPhase 11 Voice Agent Verification FAILED!\x1b[0m\n');
  process.exit(1);
} else {
  console.log('\x1b[32mPhase 11 Voice Agent Verification PASSED cleanly with 100% assertions green!\x1b[0m\n');
  process.exit(0);
}
