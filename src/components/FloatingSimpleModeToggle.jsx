import React, { useState, useEffect } from 'react';
import { Eye, Sparkles } from 'lucide-react';
import { useSimpleMode } from '../context/SimpleModeContext';
import { useLabAudio } from '../context/LabContext';
import { soundFX } from '../utils/audio';

/**
 * FloatingSimpleModeToggle
 * 
 * Persistent bottom-right Floating Action Button (FAB) that allows toggling
 * between Full Interactive Mode and Lightweight Simple Mode anywhere on the page.
 * 
 * Vertical Positioning Architecture (Strict Right-Rail Column: right-6 sm:right-8):
 * - In Normal/Interactive Mode: Sits vertically stacked ABOVE Lab FAB (`bottom-22 right-6 sm:bottom-25 sm:right-8`).
 * - In Simple Mode: Lab FAB is hidden, so this button smoothly glides to primary FAB spot (`bottom-6 right-6 sm:bottom-8 sm:right-8`).
 * - BackToTopButton sits vertically ABOVE this toggle with clean spacing.
 * - Zero horizontal offsets: all floating buttons share exact same right alignment.
 */
const UNLOCK_STORAGE_KEY = 'portfolio_contact_unlocked';

export default function FloatingSimpleModeToggle() {
  const { isSimpleMode, toggleSimpleMode } = useSimpleMode();
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem(UNLOCK_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.unlocked && parsed?.expiry && Date.now() < parsed.expiry) {
          return true;
        }
      }
    } catch {
      // Ignored
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkUnlocked = () => {
      try {
        const stored = localStorage.getItem(UNLOCK_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.unlocked && parsed?.expiry && Date.now() < parsed.expiry) {
            setIsUnlocked(true);
            return;
          }
        }
      } catch {
        // Ignored
      }
      setIsUnlocked(false);
    };

    const handleUnlocked = () => setIsUnlocked(true);
    const handleLocked = () => setIsUnlocked(false);

    window.addEventListener('storage', checkUnlocked);
    window.addEventListener('contact_channel_unlocked', handleUnlocked);
    window.addEventListener('contact_channel_locked', handleLocked);

    return () => {
      window.removeEventListener('storage', checkUnlocked);
      window.removeEventListener('contact_channel_unlocked', handleUnlocked);
      window.removeEventListener('contact_channel_locked', handleLocked);
    };
  }, []);

  let audioContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    audioContext = useLabAudio();
  } catch {
    // safe fallback
  }
  const soundEnabled = audioContext?.soundEnabled ?? true;

  const handleClick = () => {
    if (soundEnabled && soundFX?.playFocusBeep) {
      soundFX.playFocusBeep();
    }
    toggleSimpleMode();
  };

  // Determine vertical position:
  // In Normal Mode (Lab FAB is at bottom-6/bottom-8):
  //   - If WhatsApp unlocked: WhatsApp is at bottom-22/bottom-25 -> SimpleToggle is at bottom-38/bottom-42
  //   - If WhatsApp locked: SimpleToggle is at bottom-22/bottom-25
  // In Simple Mode (Lab FAB is hidden, WhatsApp is at bottom-6/bottom-8):
  //   - If WhatsApp unlocked: WhatsApp is at bottom-6/bottom-8 -> SimpleToggle is at bottom-22/bottom-25
  //   - If WhatsApp locked: SimpleToggle is at bottom-6/bottom-8
  const verticalPositionClass = isSimpleMode
    ? isUnlocked
      ? 'bottom-22 sm:bottom-25'
      : 'bottom-6 sm:bottom-8'
    : isUnlocked
      ? 'bottom-38 sm:bottom-42'
      : 'bottom-22 sm:bottom-25';

  return (
    <div
      className={`fixed right-6 sm:right-8 z-40 select-none transition-all duration-300 ease-out ${verticalPositionClass}`}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label={
          isSimpleMode
            ? 'Exit Simple Mode (Switch to Full Interactive View)'
            : 'Enable Simple Mode (Clean & Fast View)'
        }
        title={
          isSimpleMode
            ? 'Exit Simple Mode (Switch to Full Interactive View)'
            : 'Enable Simple Mode (Clean & Fast View)'
        }
        className={`group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full transition-all duration-300 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#FF4D6D] active:scale-95 hover:scale-105 ${
          isSimpleMode
            ? 'bg-linear-to-tr from-[#FF4D6D] to-[#FF758F] text-white shadow-xl shadow-[#FF4D6D]/30 border border-[#FF4D6D]'
            : 'bg-[#FAF8F5]/90 dark:bg-[#161122]/90 border border-[#E7E2D8] dark:border-[#2D2340] backdrop-blur-md text-stone-700 dark:text-stone-200 hover:text-[#18181B] dark:hover:text-white shadow-lg shadow-black/10 dark:shadow-purple-950/30 hover:border-[#FF4D6D]/60 hover:shadow-xl hover:shadow-[#FF4D6D]/20'
        }`}
      >
        {/* Subtle Ping Beacon on Active Simple Mode or Hover */}
        {isSimpleMode && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#FF4D6D]" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-white dark:border-[#120D1D] bg-emerald-400" />
          </span>
        )}

        {/* Icon toggle */}
        {isSimpleMode ? (
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
        ) : (
          <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF4D6D] group-hover:scale-110 transition-transform duration-300" />
        )}

        {/* Accessible Floating Tooltip */}
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl bg-stone-900/95 dark:bg-stone-950/95 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 hidden sm:block border border-stone-700/60 z-50">
          {isSimpleMode ? 'Exit Simple Mode (Interactive 🚀)' : 'Simple Mode (Clean 👁️)'}
        </span>
      </button>
    </div>
  );
}
