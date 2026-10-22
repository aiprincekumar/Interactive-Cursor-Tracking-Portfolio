import React, { useRef } from 'react';
import { X, Eye } from 'lucide-react';
import { useViewMode } from '../context/ViewModeContext';
import { useLanguage } from '../context/LanguageContext';
import { soundFX } from '../utils/audio';

/**
 * ViewModeSubBar
 * 
 * Floating horizontal sub-bar that appears directly under Navbar.jsx
 * when the View Mode button is active.
 * 
 * Displays the 4 view modes in exact order:
 * 1. 📄 Basic / PDF (बेसिक / PDF) - Clean document reading view
 * 2. 🍃 Simple / Classic (सिंपल / क्लासिक) - Minimalist fast layout
 * 3. ⚡ Modern / Interactive (मॉडर्न / इंटरैक्टिव) - Rich 3D interactive mode
 * 4. 💻 Terminal / Developer (टर्मिनल / डेवलपर) - Interactive command-line console
 * 
 * Variants:
 * - 'floating-bar' (default): floating horizontal pill bar under navbar capsule
 * - 'drawer-card': compact 4-column/grid card embedded in mobile drawer menu
 */
export default function ViewModeSubBar({
  variant = 'floating-bar',
  isOpen = true,
  onClose,
  soundEnabled = true,
  className = ''
}) {
  const { viewMode, selectViewMode, modesList, activeModeData } = useViewMode();
  const { isHindi } = useLanguage();
  const buttonRefs = useRef([]);

  // Keyboard navigation across view mode options
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (soundEnabled && soundFX?.playRibbonToggle) soundFX.playRibbonToggle(false);
      if (onClose) onClose();
      return;
    }

    const currentIndex = modesList.findIndex((m) => m.id === viewMode);
    let nextIndex = -1;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % modesList.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = currentIndex === -1 ? modesList.length - 1 : (currentIndex - 1 + modesList.length) % modesList.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = modesList.length - 1;
    }

    if (nextIndex !== -1) {
      const targetMode = modesList[nextIndex];
      handleSelectMode(targetMode.id);
      buttonRefs.current[nextIndex]?.focus();
    }
  };

  const handleSelectMode = (modeId) => {
    if (soundEnabled) {
      if (soundFX?.playFocusBeep) {
        soundFX.playFocusBeep();
      } else if (soundFX?.playHapticClick) {
        soundFX.playHapticClick();
      }
    }
    selectViewMode(modeId);
    if (onClose) onClose();
  };

  // ----------------------------------------------------
  // VARIANT 1: Mobile Drawer Card ('drawer-card')
  // ----------------------------------------------------
  if (variant === 'drawer-card') {
    return (
      <div className={`w-full bg-white dark:bg-stone-800 rounded-2xl border border-[#E7E2D8] dark:border-stone-700 p-2.5 shadow-2xs ${className}`}>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <Eye className="w-3 h-3 text-[#FF4D6D]" />
            {isHindi ? 'व्यू मोड' : 'View Mode'}
          </span>
          <span className="text-[10px] font-mono font-bold text-[#FF4D6D] bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 px-2 py-0.5 rounded-full border border-[#FFD1DC] dark:border-[#FF4D6D]/30 flex items-center gap-1">
            <span>{activeModeData?.emoji}</span>
            <span>{isHindi && (activeModeData?.labelHi || activeModeData?.label_hi) ? (activeModeData.labelHi || activeModeData.label_hi) : activeModeData?.label}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="group" aria-label="View mode options">
          {modesList.map((mode, index) => {
            const isActive = viewMode === mode.id;
            const Icon = mode.icon;
            const label = isHindi && (mode.labelHi || mode.label_hi) ? (mode.labelHi || mode.label_hi) : mode.label;

            return (
              <button
                key={mode.id}
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                type="button"
                onClick={() => handleSelectMode(mode.id)}
                onMouseEnter={() => {
                  if (soundEnabled && soundFX?.playChipHover) soundFX.playChipHover();
                }}
                className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-xl border transition-all duration-200 cursor-pointer select-none text-center focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden ${
                  isActive
                    ? 'bg-[#18181B] dark:bg-stone-100 text-white dark:text-stone-900 border-[#18181B] dark:border-white shadow-xs scale-[1.02]'
                    : 'border-[#E7E2D8] dark:border-stone-700 hover:border-[#FF4D6D]/40 bg-[#FAF8F5] dark:bg-stone-900/90 hover:bg-white dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200'
                }`}
                title={mode.description}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 transition-colors duration-200 ${
                    isActive
                      ? 'bg-white/20 dark:bg-stone-900/15 text-white dark:text-stone-900'
                      : 'bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 text-[#FF4D6D]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px]">{mode.emoji}</span>
                  <span className="text-[10px] sm:text-[11px] font-bold font-mono tracking-tight text-center leading-tight">
                    {label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VARIANT 2: Floating Horizontal Sub-Bar ('floating-bar')
  // ----------------------------------------------------
  if (!isOpen) return null;

  return (
    <div
      role="toolbar"
      aria-label={isHindi ? 'व्यू मोड बार' : 'View Mode Toolbar'}
      onKeyDown={handleKeyDown}
      className={`mt-2.5 max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl border border-[#E7E2D8] dark:border-stone-800 shadow-xl shadow-black/5 dark:shadow-purple-950/20 transition-all duration-300 animate-in fade-in slide-in-from-top-2 select-none ${className}`}
    >
      {/* Left Badge Indicator */}
      <div className="flex items-center gap-1.5 shrink-0 pr-1 border-r border-stone-200/60 dark:border-stone-800 hidden sm:flex">
        <Eye className="w-3.5 h-3.5 text-[#FF4D6D]" aria-hidden="true" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
          {isHindi ? 'व्यू मोड' : 'View Mode'}
        </span>
      </div>

      {/* Middle: 4 View Mode Options */}
      <div
        role="group"
        aria-label="View mode choices"
        className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5"
      >
        {modesList.map((mode, index) => {
          const isActive = viewMode === mode.id;
          const Icon = mode.icon;
          const label = isHindi && (mode.labelHi || mode.label_hi) ? (mode.labelHi || mode.label_hi) : mode.label;
          const badge = isHindi && mode.badge_hi ? mode.badge_hi : mode.badge;

          return (
            <button
              key={mode.id}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              type="button"
              role="button"
              aria-pressed={isActive}
              onClick={() => handleSelectMode(mode.id)}
              onMouseEnter={() => {
                if (soundEnabled && soundFX?.playChipHover) soundFX.playChipHover();
              }}
              className={`group relative flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full border text-xs font-bold font-mono transition-all duration-200 cursor-pointer select-none shrink-0 shadow-2xs hover:shadow-xs hover:scale-[1.02] active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden ${
                isActive
                  ? 'border-[#18181B] dark:border-white bg-[#18181B] dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs scale-[1.02]'
                  : 'border-[#E7E2D8] dark:border-stone-700 hover:border-[#FF4D6D]/40 bg-white/70 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 hover:text-[#18181B] dark:hover:text-white'
              }`}
              title={mode.description}
            >
              <div
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${
                  isActive
                    ? 'bg-white/20 dark:bg-stone-900/15 text-white dark:text-stone-900'
                    : 'bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 text-[#FF4D6D] group-hover:bg-[#FF4D6D] group-hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="tracking-tight whitespace-nowrap flex items-center gap-1.5">
                <span className="text-xs">{mode.emoji}</span>
                <span>{label}</span>
              </span>
              <span
                className={`hidden md:inline text-[10px] font-normal transition-colors ${
                  isActive
                    ? 'text-stone-300 dark:text-stone-600'
                    : 'text-stone-400 dark:text-stone-400 group-hover:text-stone-500 dark:group-hover:text-stone-300'
                }`}
              >
                {badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Close Button [×] */}
      {onClose && (
        <div className="flex items-center shrink-0 pl-1 pr-1 border-l border-stone-200/50 dark:border-stone-700 sm:border-transparent">
          <button
            type="button"
            onClick={() => {
              if (soundEnabled && soundFX?.playRibbonToggle) soundFX.playRibbonToggle(false);
              onClose();
            }}
            onMouseEnter={() => {
              if (soundEnabled && soundFX?.playChipHover) soundFX.playChipHover();
            }}
            aria-label={isHindi ? 'व्यू मोड बार बंद करें' : 'Close View Mode Bar'}
            title={isHindi ? 'बंद करें (Esc)' : 'Close (Esc)'}
            className="w-7 h-7 rounded-full flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-[#18181B] dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-800 border border-transparent hover:border-stone-300 dark:hover:border-stone-600 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
