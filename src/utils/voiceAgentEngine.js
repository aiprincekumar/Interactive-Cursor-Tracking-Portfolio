/**
 * Voice Agent Engine (Phase 11)
 * Natural Voice Synthesis, Multilingual Voice Resolution, Chrome TTS Watchdog,
 * and Central Pub/Sub Lifecycle State Machine.
 */

export const VOICE_STATES = {
  IDLE: 'idle',
  LISTENING: 'listening',
  PROCESSING: 'processing',
  SPEAKING: 'speaking',
  PAUSED: 'paused'
};

export const SUPPORTED_VOICE_PROFILES = ['auto', 'en-IN', 'en-US', 'hi-IN'];

export const DEFAULT_VOICE_CONFIG = {
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
  voiceProfile: 'auto',
  autoSpeakResponses: false
};

const STORAGE_KEY = 'portfolio_voice_config_v1';

// Clamping bounds
const BOUNDS = {
  rate: { min: 0.75, max: 1.5, default: 1.0 },
  pitch: { min: 0.8, max: 1.2, default: 1.0 },
  volume: { min: 0.0, max: 1.0, default: 1.0 }
};

/**
 * Validate and clamp numerical config values
 */
export function clampConfigValue(key, value) {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    return BOUNDS[key] ? BOUNDS[key].default : value;
  }
  const bound = BOUNDS[key];
  if (!bound) return value;
  return Math.min(Math.max(value, bound.min), bound.max);
}

/**
 * Sanitizes voice config object with strict boundaries
 */
export function sanitizeVoiceConfig(config = {}) {
  const sanitized = { ...DEFAULT_VOICE_CONFIG };

  if (typeof config.rate === 'number') {
    sanitized.rate = clampConfigValue('rate', config.rate);
  }
  if (typeof config.pitch === 'number') {
    sanitized.pitch = clampConfigValue('pitch', config.pitch);
  }
  if (typeof config.volume === 'number') {
    sanitized.volume = clampConfigValue('volume', config.volume);
  }
  if (typeof config.voiceProfile === 'string' && SUPPORTED_VOICE_PROFILES.includes(config.voiceProfile)) {
    sanitized.voiceProfile = config.voiceProfile;
  }
  if (typeof config.autoSpeakResponses === 'boolean') {
    sanitized.autoSpeakResponses = config.autoSpeakResponses;
  }

  return sanitized;
}

// In-memory runtime state
let currentVoiceConfig = { ...DEFAULT_VOICE_CONFIG };
let currentVoiceState = VOICE_STATES.IDLE;
let currentVoiceMeta = { text: '', utteranceId: null, startTime: null };
const subscribers = new Set();
let watchdogTimer = null;
let watchdogActive = false;

// Initialize config from localStorage if available
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      currentVoiceConfig = sanitizeVoiceConfig(parsed);
    }
  }
} catch {
  currentVoiceConfig = { ...DEFAULT_VOICE_CONFIG };
}

/**
 * Notify all subscribers of state or config mutation
 */
function notifySubscribers() {
  const snapshot = {
    state: currentVoiceState,
    meta: { ...currentVoiceMeta },
    config: { ...currentVoiceConfig }
  };
  subscribers.forEach((cb) => {
    try {
      cb(snapshot);
    } catch (err) {
      console.warn('Voice subscriber error:', err);
    }
  });
}

/**
 * Get current voice configuration
 */
export function getVoiceConfig() {
  return { ...currentVoiceConfig };
}

/**
 * Update voice configuration partially with validation and persistence
 */
export function setVoiceConfig(partial = {}) {
  const updated = sanitizeVoiceConfig({
    ...currentVoiceConfig,
    ...partial
  });
  currentVoiceConfig = updated;

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentVoiceConfig));
    }
  } catch {}

  notifySubscribers();
  return { ...currentVoiceConfig };
}

/**
 * Reset voice configuration to default values
 */
export function resetVoiceConfig() {
  currentVoiceConfig = { ...DEFAULT_VOICE_CONFIG };
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
  notifySubscribers();
  return { ...currentVoiceConfig };
}

/**
 * Get current voice lifecycle state
 */
export function getVoiceState() {
  return currentVoiceState;
}

/**
 * Get current voice metadata
 */
export function getVoiceMetadata() {
  return { ...currentVoiceMeta };
}

/**
 * Set voice lifecycle state and optional metadata
 */
export function setVoiceState(nextState, meta = {}) {
  const validStates = Object.values(VOICE_STATES);
  if (!validStates.includes(nextState)) {
    console.warn(`Invalid voice state: ${nextState}. Falling back to idle.`);
    currentVoiceState = VOICE_STATES.IDLE;
  } else {
    currentVoiceState = nextState;
  }
  currentVoiceMeta = {
    ...currentVoiceMeta,
    ...meta,
    updatedAt: Date.now()
  };
  notifySubscribers();
  return currentVoiceState;
}

/**
 * Subscribe to voice lifecycle and config changes
 */
export function subscribeVoiceState(callback) {
  if (typeof callback !== 'function') return () => {};
  subscribers.add(callback);
  // Initial callback invocation
  try {
    callback({
      state: currentVoiceState,
      meta: { ...currentVoiceMeta },
      config: { ...currentVoiceConfig }
    });
  } catch {}

  return () => {
    subscribers.delete(callback);
  };
}

/**
 * Clean text for SpeechSynthesis: strip markdown, code blocks, URLs, and noisy symbols
 */
export function cleanTextForSpeech(text) {
  if (!text) return '';
  return String(text)
    // Remove fenced code blocks
    .replace(/```[\s\S]*?```/g, ' [Code omitted] ')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove Markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove image tags ![alt](url)
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove markdown headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove blockquotes
    .replace(/^\s*>\s+/gm, '')
    // Remove markdown bold / italic markers
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Remove bullets and numbers at line start
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Remove common emojis that cause TTS stutter
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    // Normalize excessive spaces and newlines
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Multilingual Voice Resolver:
 * Matches voices from window.speechSynthesis to profile ('auto' | 'hi-IN' | 'en-IN' | 'en-US')
 */
export function resolveVoice(voices = [], profile = 'auto', textHint = '') {
  if (!Array.isArray(voices) || voices.length === 0) return null;

  const hasDevanagari = /[\u0900-\u097F]/.test(textHint || '');
  const targetProfile = profile === 'auto' ? (hasDevanagari ? 'hi-IN' : 'en-IN') : profile;

  if (targetProfile === 'hi-IN') {
    const hindiVoice =
      voices.find((v) => v.lang === 'hi-IN' || v.lang === 'hi_IN' || v.lang.startsWith('hi')) ||
      voices.find((v) => (v.name || '').toLowerCase().includes('hindi'));
    if (hindiVoice) return hindiVoice;
  }

  if (targetProfile === 'en-IN' || targetProfile === 'hi-IN') {
    const indianVoice =
      voices.find((v) => (v.lang === 'en-IN' || v.lang === 'en_IN') && (v.name || '').includes('Google')) ||
      voices.find((v) => v.lang === 'en-IN' || v.lang === 'en_IN') ||
      voices.find((v) => (v.name || '').toLowerCase().includes('india'));
    if (indianVoice) return indianVoice;
  }

  if (targetProfile === 'en-US' || targetProfile === 'en-IN' || targetProfile === 'auto') {
    const usVoice =
      voices.find((v) => (v.lang === 'en-US' || v.lang === 'en_US') && ((v.name || '').includes('Natural') || (v.name || '').includes('Online'))) ||
      voices.find((v) => v.lang === 'en-US' || v.lang === 'en_US') ||
      voices.find((v) => v.lang.startsWith('en'));
    if (usVoice) return usVoice;
  }

  // Fallbacks: default voice or first available
  return voices.find((v) => v.default) || voices[0] || null;
}

/**
 * Chrome SpeechSynthesis keep-alive watchdog
 * Chromium pauses utterance garbage collection after ~14-15 seconds.
 * Periodic pause() and resume() cycles every 10s prevents playback lockups.
 */
export function startChromeWatchdog(intervalMs = 10000) {
  stopChromeWatchdog();
  watchdogActive = true;

  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return;
  }

  watchdogTimer = setInterval(() => {
    try {
      if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    } catch (err) {
      console.warn('Watchdog cycle error:', err);
    }
  }, intervalMs);
}

export function stopChromeWatchdog() {
  if (watchdogTimer) {
    clearInterval(watchdogTimer);
    watchdogTimer = null;
  }
  watchdogActive = false;
}

export function isWatchdogActive() {
  return watchdogActive;
}

/**
 * High-level Speak Text API with watchdog & state management
 */
export function speakText(text, options = {}) {
  const clean = cleanTextForSpeech(text);
  if (!clean) {
    setVoiceState(VOICE_STATES.IDLE);
    return false;
  }

  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('SpeechSynthesis is unavailable in this environment.');
    setVoiceState(VOICE_STATES.IDLE);
    return false;
  }

  try {
    // Cancel previous speech
    window.speechSynthesis.cancel();
    stopChromeWatchdog();

    // Chromium: resume if paused before speak
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(clean);
    const config = getVoiceConfig();

    utterance.rate = typeof options.rate === 'number' ? clampConfigValue('rate', options.rate) : config.rate;
    utterance.pitch = typeof options.pitch === 'number' ? clampConfigValue('pitch', options.pitch) : config.pitch;
    utterance.volume = typeof options.volume === 'number' ? clampConfigValue('volume', options.volume) : config.volume;

    const voices = options.voices || window.speechSynthesis.getVoices() || [];
    const profile = options.voiceProfile || config.voiceProfile;
    const selectedVoice =
      options.selectedVoice ||
      (options.voiceId && options.voiceId !== 'default'
        ? voices.find((v) => v.voiceURI === options.voiceId || v.name === options.voiceId)
        : null) ||
      resolveVoice(voices, profile, clean);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang || 'en-US';
    }

    const utteranceId = `utt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    utterance.onstart = () => {
      setVoiceState(VOICE_STATES.SPEAKING, { utteranceId, text: clean, startTime: Date.now() });
      startChromeWatchdog(10000);
      if (typeof options.onStart === 'function') options.onStart();
    };

    utterance.onend = () => {
      stopChromeWatchdog();
      setVoiceState(VOICE_STATES.IDLE, { utteranceId: null });
      if (typeof options.onEnd === 'function') options.onEnd();
    };

    utterance.onerror = (e) => {
      stopChromeWatchdog();
      setVoiceState(VOICE_STATES.IDLE, { utteranceId: null });
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('SpeechSynthesis error:', e.error);
      }
      if (typeof options.onError === 'function') options.onError(e);
    };

    window.speechSynthesis.speak(utterance);

    // Secondary resume safeguard for Chrome/Edge
    setTimeout(() => {
      try {
        if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch {}
    }, 50);

    return true;
  } catch (err) {
    console.warn('speakText execution error:', err);
    stopChromeWatchdog();
    setVoiceState(VOICE_STATES.IDLE);
    return false;
  }
}

/**
 * Stop active speech immediately
 */
export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
  stopChromeWatchdog();
  setVoiceState(VOICE_STATES.IDLE, { utteranceId: null });
}

/**
 * Pause active speech
 */
export function pauseSpeech() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
      }
    } catch {}
  }
  if (currentVoiceState === VOICE_STATES.SPEAKING) {
    setVoiceState(VOICE_STATES.PAUSED);
  }
}

/**
 * Resume paused speech
 */
export function resumeSpeech() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch {}
  }
  if (currentVoiceState === VOICE_STATES.PAUSED) {
    setVoiceState(VOICE_STATES.SPEAKING);
  }
}

export default {
  VOICE_STATES,
  SUPPORTED_VOICE_PROFILES,
  DEFAULT_VOICE_CONFIG,
  getVoiceConfig,
  setVoiceConfig,
  resetVoiceConfig,
  getVoiceState,
  getVoiceMetadata,
  setVoiceState,
  subscribeVoiceState,
  cleanTextForSpeech,
  resolveVoice,
  startChromeWatchdog,
  stopChromeWatchdog,
  isWatchdogActive,
  speakText,
  stopSpeaking,
  pauseSpeech,
  resumeSpeech
};
