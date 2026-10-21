/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { soundFX } from '../utils/audio';
import { LabContext } from './LabContext';
import { SimpleModeContext } from './SimpleModeContext';

export const VOICE_ANNOUNCEMENT_STORAGE_KEY = 'portfolio_voice_announcement_enabled';
export const VOICE_FOCUS_STORAGE_KEY = 'portfolio_voice_focus_enabled';
export const VOICE_HOVER_STORAGE_KEY = 'portfolio_voice_hover_enabled';

const INTERACTIVE_SELECTOR = 'button, a, [role="button"], input, select, textarea, [tabindex="0"], .interactive-card';

/**
 * Auto-select natural voice from window.speechSynthesis.getVoices()
 * Preference order:
 * 1. Google US English
 * 2. Microsoft Natural (Jenny/Guy/Aria) or David/Zira
 * 3. Apple Samantha / Ava / Allison / Alex
 * 4. High-quality en-US voice
 * 5. Any English voice
 */
export function selectBestVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || !Array.isArray(voices) || voices.length === 0) return null;

  // 1. Google US English
  const googleVoice = voices.find(
    (v) => (v.lang === 'en-US' || v.lang === 'en_US') && /google\s+us\s+english/i.test(v.name)
  ) || voices.find(
    (v) => (v.lang === 'en-US' || v.lang === 'en_US') && /google/i.test(v.name)
  );
  if (googleVoice) return googleVoice;

  // 2. Microsoft Natural
  const msNatural = voices.find(
    (v) => v.lang.startsWith('en') && /natural/i.test(v.name)
  );
  if (msNatural) return msNatural;

  // Microsoft David, Zira, Aria, Guy, Mark
  const msVoice = voices.find(
    (v) => (v.lang === 'en-US' || v.lang === 'en_US') && /david|zira|aria|guy|mark/i.test(v.name)
  ) || voices.find(
    (v) => (v.lang === 'en-US' || v.lang === 'en_US') && /microsoft/i.test(v.name)
  );
  if (msVoice) return msVoice;

  // 3. Apple Samantha, Ava, Allison, Alex, Siri
  const appleVoice = voices.find(
    (v) => (v.lang === 'en-US' || v.lang === 'en_US') && /samantha|ava|allison|alex|siri/i.test(v.name)
  );
  if (appleVoice) return appleVoice;

  // 4. Any en-US voice
  const enUsVoice = voices.find(
    (v) => v.lang === 'en-US' || v.lang === 'en_US'
  );
  if (enUsVoice) return enUsVoice;

  // 5. Any English voice
  const anyEnglish = voices.find(
    (v) => v.lang && v.lang.toLowerCase().startsWith('en')
  );
  if (anyEnglish) return anyEnglish;

  // 6. Default voice or first available
  return voices.find((v) => v.default) || voices[0] || null;
}

/**
 * Robust Accessible Name extractor for elements.
 * Pronounces CLEAN button/link/interactive text only without prefixes like "Link: " or "Button: "
 * or suffixes like ", Collapsed" / ", Expanded".
 * Priority: element textContent / visible text / button label / aria-label / title / img alt.
 */
export function getAccessibleElementDescription(el) {
  const isElement =
    (typeof Element !== 'undefined' && el instanceof Element) ||
    (el && typeof el.getAttribute === 'function' && typeof el.tagName === 'string');
  if (!el || !isElement) return null;

  // Ignore hidden or presentational elements
  if (
    el.getAttribute('aria-hidden') === 'true' ||
    (typeof el.closest === 'function' && el.closest('[aria-hidden="true"]')) ||
    el.getAttribute('role') === 'presentation' ||
    el.getAttribute('role') === 'none'
  ) {
    return null;
  }

  // 1. Direct custom TTS override via data-tts or data-speak
  const customTTS = el.getAttribute('data-tts') || el.getAttribute('data-speak');
  if (customTTS && customTTS.trim()) {
    let clean = customTTS.trim().replace(/\s+/g, ' ');
    clean = clean.replace(/^(button|link|switch|tab|genericinteractive|interactive\s+element)[:\s-]+/i, '').trim();
    clean = clean.replace(/,\s*(collapsed|expanded)$/i, '').trim();
    if (clean) return clean;
  }

  const tagName = el.tagName.toLowerCase();
  const explicitRole = el.getAttribute('role')?.toLowerCase();

  // If non-interactive container with tabIndex="-1" and no explicit role or label, skip
  const tabIndex = el.getAttribute('tabindex');
  const hasInteractiveTabIndex = tabIndex !== null && Number(tabIndex) >= 0;
  const isInteractiveTag = ['button', 'a', 'input', 'select', 'textarea', 'summary'].includes(tagName);
  const isInteractiveRole = ['button', 'link', 'switch', 'checkbox', 'radio', 'tab', 'combobox', 'menuitem'].includes(explicitRole);
  const hasDataBadge = el.getAttribute('data-badge') !== null;
  const hasDataCard = el.getAttribute('data-card') !== null;

  if (
    !isInteractiveTag &&
    !isInteractiveRole &&
    !hasInteractiveTabIndex &&
    !hasDataBadge &&
    !hasDataCard &&
    !el.classList?.contains('interactive-card')
  ) {
    // If it's a heading, paragraph, or article with explicit text, allow it only if it has content
    if (!['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'article'].includes(tagName)) {
      return null;
    }
  }

  // Extract Clean Text / Label according to priority:
  // Priority: element textContent / visible text / button label / aria-label / title / img alt.
  const ariaLabel = el.getAttribute('aria-label')?.trim();
  const titleAttr = el.getAttribute('title')?.trim();

  // Handle form controls
  if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
    let formLabel = '';
    if (el.labels && el.labels.length > 0) {
      formLabel = Array.from(el.labels).map((l) => l.textContent?.trim()).filter(Boolean).join(' ');
    } else if (el.id) {
      const labelEl = document.querySelector(`label[for="${el.id}"]`);
      if (labelEl?.textContent?.trim()) formLabel = labelEl.textContent.trim();
    }
    if (!formLabel && typeof el.closest === 'function') {
      const parentLabel = el.closest('label');
      if (parentLabel?.textContent?.trim()) formLabel = parentLabel.textContent.trim();
    }
    if (!formLabel && ariaLabel) formLabel = ariaLabel;
    if (!formLabel && el.getAttribute('placeholder')?.trim()) formLabel = el.getAttribute('placeholder').trim();
    if (!formLabel && el.value) formLabel = String(el.value).trim();
    if (formLabel) {
      return formLabel.replace(/\s+/g, ' ').trim();
    }
  }

  // Extract visible text (excluding aria-hidden sub-elements to prevent pronouncing hidden monograms or badges)
  let visibleText = '';
  if (el.querySelector && el.querySelector('[aria-hidden="true"]')) {
    const clone = el.cloneNode(true);
    clone.querySelectorAll('[aria-hidden="true"]').forEach((node) => node.remove());
    visibleText = (clone.innerText || clone.textContent || '').replace(/\s+/g, ' ').trim();
  } else {
    visibleText = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  }

  // If there's an aria-labelledby
  let ariaLabelledByText = '';
  if (el.hasAttribute('aria-labelledby')) {
    const ids = el.getAttribute('aria-labelledby').trim().split(/\s+/);
    const parts = ids
      .map((id) => document.getElementById(id)?.textContent?.trim())
      .filter(Boolean);
    if (parts.length > 0) {
      ariaLabelledByText = parts.join(' ');
    }
  }

  let raw = '';
  if (visibleText && visibleText.length > 0 && visibleText.length <= 160) {
    if (ariaLabel && visibleText.includes(ariaLabel)) {
      raw = ariaLabel;
    } else if (ariaLabel && visibleText.length <= 3 && ariaLabel.length > 3) {
      // e.g. "X" icon with aria-label="Close menu"
      raw = ariaLabel;
    } else {
      raw = visibleText;
    }
  } else if (ariaLabel) {
    raw = ariaLabel;
  } else if (ariaLabelledByText) {
    raw = ariaLabelledByText;
  } else if (titleAttr) {
    raw = titleAttr;
  } else {
    const imgChild = el.querySelector('img[alt]');
    if (imgChild && imgChild.getAttribute('alt')?.trim()) {
      raw = imgChild.getAttribute('alt').trim();
    } else if (visibleText) {
      raw = visibleText.length > 250 ? visibleText.slice(0, 247) + '...' : visibleText;
    }
  }

  if (!raw || !raw.trim()) return null;

  // Clean and normalize whitespace
  let clean = raw.replace(/\s+/g, ' ').trim();

  // Strip prefixes like "Button: ", "Link: ", "Switch: ", "Tab: ", etc.
  clean = clean.replace(/^(button|link|switch|tab|interactive\s+element|genericinteractive|subsection|heading|card|badge)[:\s-]+/i, '').trim();

  // Strip trailing status suffixes like ", Collapsed", ", Expanded"
  clean = clean.replace(/,\s*(collapsed|expanded)$/i, '').trim();

  // Strip leading/trailing bullet points or dashes
  clean = clean.replace(/^[•\-\s]+|[•\-\s]+$/g, '').trim();

  return clean || null;
}

/**
 * Checks if master audio is currently active (master sound ON and simple mode OFF)
 */
function isMasterAudioActive() {
  if (typeof window === 'undefined') return false;

  // Simple Mode check (DOM class and localStorage)
  if (
    document.body?.classList.contains('simple-mode') ||
    localStorage.getItem('portfolio_simple_mode') === 'true'
  ) {
    return false;
  }

  // SoundFX synthesizer engine check
  if (soundFX && typeof soundFX.isEnabled === 'function' && !soundFX.isEnabled()) {
    return false;
  }

  return true;
}

export const AnnouncerContext = createContext(null);

export function AnnouncerProvider({ children }) {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');

  // Consume LabContext & SimpleModeContext if available in hierarchy
  const labContext = useContext(LabContext);
  const simpleContext = useContext(SimpleModeContext);

  // Voice Announcement (TTS) state
  const [voiceEnabled, setVoiceEnabledState] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem(VOICE_ANNOUNCEMENT_STORAGE_KEY);
      if (stored !== null) {
        return stored === 'true';
      }
    } catch {
      // Ignore private browsing restrictions
    }
    return false;
  });

  const voiceEnabledRef = useRef(voiceEnabled);
  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
    try {
      localStorage.setItem(VOICE_ANNOUNCEMENT_STORAGE_KEY, String(voiceEnabled));
    } catch {
      // Ignore storage errors
    }
  }, [voiceEnabled]);

  const setVoiceEnabled = useCallback((val) => {
    setVoiceEnabledState(Boolean(val));
  }, []);

  // Voice on Keyboard Focus (Tab / Shift+Tab) state
  const [voiceFocusEnabled, setVoiceFocusEnabledState] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      const stored = localStorage.getItem(VOICE_FOCUS_STORAGE_KEY);
      if (stored !== null) {
        return stored === 'true';
      }
    } catch {
      // Ignore private browsing restrictions
    }
    return true;
  });

  const voiceFocusEnabledRef = useRef(voiceFocusEnabled);
  useEffect(() => {
    voiceFocusEnabledRef.current = voiceFocusEnabled;
    try {
      localStorage.setItem(VOICE_FOCUS_STORAGE_KEY, String(voiceFocusEnabled));
    } catch {
      // Ignore storage errors
    }
  }, [voiceFocusEnabled]);

  const setVoiceFocusEnabled = useCallback((val) => {
    setVoiceFocusEnabledState(Boolean(val));
  }, []);

  // Mouse Hover Narration state (persisted in localStorage, default: false)
  const [hoverVoiceEnabled, setHoverVoiceEnabledState] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem(VOICE_HOVER_STORAGE_KEY);
      if (stored !== null) {
        return stored === 'true';
      }
    } catch {
      // Ignore private browsing restrictions
    }
    return false;
  });

  const hoverVoiceEnabledRef = useRef(hoverVoiceEnabled);
  useEffect(() => {
    hoverVoiceEnabledRef.current = hoverVoiceEnabled;
    try {
      localStorage.setItem(VOICE_HOVER_STORAGE_KEY, String(hoverVoiceEnabled));
    } catch {
      // Ignore storage errors
    }
  }, [hoverVoiceEnabled]);

  const setHoverVoiceEnabled = useCallback((val) => {
    setHoverVoiceEnabledState(Boolean(val));
  }, []);

  // Auto-selected natural voice reference
  const selectedVoiceRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const updateVoice = () => {
      selectedVoiceRef.current = selectBestVoice();
    };
    updateVoice();
    window.speechSynthesis.addEventListener('voiceschanged', updateVoice);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', updateVoice);
    };
  }, []);

  // Last spoken utterance tracker for deduplication within 800ms
  const lastUtteranceRef = useRef({ text: '', timestamp: 0 });

  // Web Speech API synthesis function with master killswitch, volume synchronization and 800ms deduplication
  const speak = useCallback((text, priority = 'polite') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return;

    const trimmed = typeof text === 'string' ? text.replace(/\s+/g, ' ').trim() : '';
    if (!trimmed) return;

    // Deduplication: prevent duplicate back-to-back speech within 800ms for identical utterances
    const now = performance.now();
    if (
      lastUtteranceRef.current.text === trimmed &&
      now - lastUtteranceRef.current.timestamp < 800
    ) {
      return;
    }
    lastUtteranceRef.current = { text: trimmed, timestamp: now };

    // 1. Check whether master sound is enabled
    // If master sound is disabled OR simple mode is active, IMMEDIATELY return and do NOT speak.
    const isSimple =
      Boolean(simpleContext?.isSimpleMode) ||
      (typeof document !== 'undefined' && document.body?.classList.contains('simple-mode')) ||
      (typeof window !== 'undefined' && window.localStorage?.getItem('portfolio_simple_mode') === 'true');

    const isAudioSoundEnabled =
      labContext?.soundEnabled !== undefined
        ? labContext.soundEnabled
        : (soundFX && typeof soundFX.isEnabled === 'function' ? soundFX.isEnabled() : true);

    if (!isAudioSoundEnabled || isSimple || !isMasterAudioActive()) {
      return;
    }

    // 2. Also verify voiceEnabledRef.current
    if (!voiceEnabledRef.current) {
      return;
    }

    try {
      // Cancel previous pending/ongoing utterances to avoid overlapping
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(trimmed);

      // Volume synchronization with master volume
      const masterVol =
        labContext?.masterVolume !== undefined
          ? labContext.masterVolume
          : (soundFX && typeof soundFX.getMasterVolume === 'function' ? soundFX.getMasterVolume() : 1.0);
      utterance.volume = Math.max(0.0, Math.min(1.0, masterVol));

      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      // Auto-select natural voice
      if (!selectedVoiceRef.current) {
        selectedVoiceRef.current = selectBestVoice();
      }
      if (selectedVoiceRef.current) {
        utterance.voice = selectedVoiceRef.current;
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis playback failed:', err);
    }
  }, [labContext, simpleContext]);

  // Master mute & sound-toggle event listener (Immediate cancel)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleSoundToggle = (e) => {
      const enabled = e?.detail?.enabled;
      if (enabled === false && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };

    const handleAudioMute = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };

    window.addEventListener('portfolio:sound-toggle', handleSoundToggle);
    window.addEventListener('portfolio:audio-mute', handleAudioMute);
    window.addEventListener('portfolio:audio-state-change', handleSoundToggle);

    return () => {
      window.removeEventListener('portfolio:sound-toggle', handleSoundToggle);
      window.removeEventListener('portfolio:audio-mute', handleAudioMute);
      window.removeEventListener('portfolio:audio-state-change', handleSoundToggle);
    };
  }, []);

  // Announce method for ARIA Live Region and TTS
  const announce = useCallback((message, priority = 'polite') => {
    if (!message) return;

    // 1. ARIA Live Region update (Screen Readers)
    if (priority === 'assertive') {
      setAssertiveMessage('');
      requestAnimationFrame(() => {
        setAssertiveMessage(message);
      });
    } else {
      setPoliteMessage('');
      requestAnimationFrame(() => {
        setPoliteMessage(message);
      });
    }

    // 2. Web Speech API (Text-to-Speech) if Voice Announcement is active
    if (voiceEnabledRef.current && isMasterAudioActive()) {
      speak(message, priority);
    }
  }, [speak]);

  // Smart hover debounce (130ms) & click for interactive elements
  const hoverDebounceTimerRef = useRef(null);
  const currentHoveredElRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;

      const interactiveEl = target.closest(INTERACTIVE_SELECTOR);
      if (!interactiveEl) {
        if (hoverDebounceTimerRef.current) {
          clearTimeout(hoverDebounceTimerRef.current);
          hoverDebounceTimerRef.current = null;
        }
        currentHoveredElRef.current = null;
        return;
      }

      // If hovering within the same interactive element, do not restart debounce
      if (currentHoveredElRef.current === interactiveEl) {
        return;
      }

      // If moving to a new element before 130ms, clear previous timeout
      if (hoverDebounceTimerRef.current) {
        clearTimeout(hoverDebounceTimerRef.current);
        hoverDebounceTimerRef.current = null;
      }
      currentHoveredElRef.current = interactiveEl;

      // Set 130ms debounce timer
      hoverDebounceTimerRef.current = setTimeout(() => {
        if (isMasterAudioActive() && voiceEnabledRef.current && hoverVoiceEnabledRef.current) {
          const description = getAccessibleElementDescription(interactiveEl);
          if (description) {
            speak(description, 'polite');
          }
        }
        hoverDebounceTimerRef.current = null;
      }, 130);
    };

    const handleMouseOut = (e) => {
      const related = e.relatedTarget;
      if (currentHoveredElRef.current) {
        // If pointer left the element completely
        if (!related || (related instanceof Node && !currentHoveredElRef.current.contains(related))) {
          if (hoverDebounceTimerRef.current) {
            clearTimeout(hoverDebounceTimerRef.current);
            hoverDebounceTimerRef.current = null;
          }
          currentHoveredElRef.current = null;
        }
      }
    };

    const handleClick = (e) => {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;

      const interactiveEl = target.closest(INTERACTIVE_SELECTOR);
      if (!interactiveEl) return;

      // Clear any pending hover debounce
      if (hoverDebounceTimerRef.current) {
        clearTimeout(hoverDebounceTimerRef.current);
        hoverDebounceTimerRef.current = null;
      }
      currentHoveredElRef.current = interactiveEl;

      // On click, speak immediately with zero debounce and cancel previous utterances
      if (isMasterAudioActive() && voiceEnabledRef.current) {
        const description = getAccessibleElementDescription(interactiveEl);
        if (description) {
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
          speak(description, 'assertive');
        }
      }
    };

    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('mouseout', handleMouseOut, true);
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.removeEventListener('mouseout', handleMouseOut, true);
      document.removeEventListener('click', handleClick, true);
      if (hoverDebounceTimerRef.current) {
        clearTimeout(hoverDebounceTimerRef.current);
      }
    };
  }, [speak]);

  // Keyboard navigation tracking & focus announcement
  const isKeyboardNavRef = useRef(false);
  const lastKeyTimeRef = useRef(0);
  const focusDebounceTimerRef = useRef(null);
  const lastAnnouncedElRef = useRef(null);
  const lastAnnouncedTimeRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e) => {
      if (
        e.key === 'Tab' ||
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)
      ) {
        isKeyboardNavRef.current = true;
        lastKeyTimeRef.current = performance.now();
      }
    };

    const handlePointerDown = () => {
      isKeyboardNavRef.current = false;
    };

    const handleFocusIn = (e) => {
      if (!voiceEnabledRef.current || !voiceFocusEnabledRef.current) return;
      if (!isMasterAudioActive()) return;

      const target = e.target;
      if (!target || !(target instanceof Element)) return;
      if (target === document.body || target === document.documentElement) return;

      const isKeyboard =
        isKeyboardNavRef.current ||
        (typeof target.matches === 'function' && target.matches(':focus-visible')) ||
        (performance.now() - lastKeyTimeRef.current < 800);

      if (!isKeyboard) return;

      const description = getAccessibleElementDescription(target);
      if (!description) return;

      const now = performance.now();
      if (target === lastAnnouncedElRef.current && now - lastAnnouncedTimeRef.current < 400) {
        return;
      }
      lastAnnouncedElRef.current = target;
      lastAnnouncedTimeRef.current = now;

      if (focusDebounceTimerRef.current) {
        clearTimeout(focusDebounceTimerRef.current);
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      focusDebounceTimerRef.current = setTimeout(() => {
        speak(description, 'polite');
      }, 50);
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('pointerdown', handlePointerDown, true);
    window.addEventListener('mousedown', handlePointerDown, true);
    window.addEventListener('focusin', handleFocusIn, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('pointerdown', handlePointerDown, true);
      window.removeEventListener('mousedown', handlePointerDown, true);
      window.removeEventListener('focusin', handleFocusIn, true);
      if (focusDebounceTimerRef.current) {
        clearTimeout(focusDebounceTimerRef.current);
      }
    };
  }, [speak]);

  // Allow custom window events for decoupled announcements and setting changes
  useEffect(() => {
    const handleCustomAnnounce = (e) => {
      if (e?.detail?.message) {
        announce(e.detail.message, e.detail.priority || 'polite');
      }
    };

    const handleSetVoiceAnnouncement = (e) => {
      const nextVal = e?.detail?.enabled ?? e?.detail;
      if (typeof nextVal === 'boolean') {
        setVoiceEnabled(nextVal);
      }
    };

    const handleSetVoiceFocus = (e) => {
      const nextVal = e?.detail?.enabled ?? e?.detail;
      if (typeof nextVal === 'boolean') {
        setVoiceFocusEnabled(nextVal);
      }
    };

    const handleSetVoiceHover = (e) => {
      const nextVal = e?.detail?.enabled ?? e?.detail;
      if (typeof nextVal === 'boolean') {
        setHoverVoiceEnabled(nextVal);
      }
    };

    window.addEventListener('portfolio:announce', handleCustomAnnounce);
    window.addEventListener('portfolio:set-voice-announcement', handleSetVoiceAnnouncement);
    window.addEventListener('portfolio:set-voice-focus', handleSetVoiceFocus);
    window.addEventListener('portfolio:set-voice-hover', handleSetVoiceHover);
    return () => {
      window.removeEventListener('portfolio:announce', handleCustomAnnounce);
      window.removeEventListener('portfolio:set-voice-announcement', handleSetVoiceAnnouncement);
      window.removeEventListener('portfolio:set-voice-focus', handleSetVoiceFocus);
      window.removeEventListener('portfolio:set-voice-hover', handleSetVoiceHover);
    };
  }, [announce, setVoiceEnabled, setVoiceFocusEnabled, setHoverVoiceEnabled]);

  const contextValue = {
    announce,
    politeMessage,
    assertiveMessage,
    voiceEnabled,
    setVoiceEnabled,
    voiceFocusEnabled,
    setVoiceFocusEnabled,
    hoverVoiceEnabled,
    setHoverVoiceEnabled,
    speak,
    getAccessibleElementDescription
  };

  return (
    <AnnouncerContext.Provider value={contextValue}>
      {children}
      {/* Visually hidden dynamic ARIA live regions */}
      <div className="sr-only" aria-hidden="false">
        <div role="status" aria-live="polite" aria-atomic="true" id="portfolio-aria-live-polite">
          {politeMessage}
        </div>
        <div role="alert" aria-live="assertive" aria-atomic="true" id="portfolio-aria-live-assertive">
          {assertiveMessage}
        </div>
      </div>
    </AnnouncerContext.Provider>
  );
}

export function useAnnounce() {
  const context = useContext(AnnouncerContext);
  if (!context) {
    // Graceful fallback if outside provider: dispatch event
    return {
      announce: (message, priority = 'polite') => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('portfolio:announce', { detail: { message, priority } })
          );
        }
      },
      voiceEnabled: false,
      setVoiceEnabled: (val) => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('portfolio:set-voice-announcement', { detail: { enabled: Boolean(val) } })
          );
        }
      },
      voiceFocusEnabled: true,
      setVoiceFocusEnabled: (val) => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('portfolio:set-voice-focus', { detail: { enabled: Boolean(val) } })
          );
        }
      },
      hoverVoiceEnabled: false,
      setHoverVoiceEnabled: (val) => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('portfolio:set-voice-hover', { detail: { enabled: Boolean(val) } })
          );
        }
      },
      speak: (text) => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return;
        if (!isMasterAudioActive()) return;
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.volume = soundFX && typeof soundFX.getMasterVolume === 'function' ? soundFX.getMasterVolume() : 1.0;
          utterance.rate = 1.05;
          utterance.pitch = 1.0;
          utterance.lang = 'en-US';
          const voice = selectBestVoice();
          if (voice) utterance.voice = voice;
          window.speechSynthesis.speak(utterance);
        } catch {
          // Ignore
        }
      },
      getAccessibleElementDescription
    };
  }
  return context;
}

export default AnnouncerProvider;
