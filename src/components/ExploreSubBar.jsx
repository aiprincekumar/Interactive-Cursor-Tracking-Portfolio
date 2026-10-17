import React, { useRef } from 'react';
import { Image, FlaskConical, X } from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function ExploreSubBar({
  variant = 'floating-bar',
  isOpen = true,
  onClose,
  soundEnabled = true,
  className = ''
}) {
  const buttonRefs = useRef([]);

  const items = [
    {
      id: 'gallery',
      label: 'Gallery',
      href: '#gallery',
      icon: Image,
      desc: 'Visual Showcase'
    },
    {
      id: 'playground',
      label: 'Lab',
      href: '#playground',
      icon: FlaskConical,
      desc: 'Interactive Playground'
    }
  ];

  const handleJump = (targetId) => {
    if (soundEnabled) soundFX.playFocusBeep();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    if (onClose) onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (onClose) onClose();
      return;
    }

    const currentIndex = buttonRefs.current.findIndex((btn) => btn === document.activeElement);
    let nextIndex = -1;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % items.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = currentIndex === -1 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = items.length - 1;
    }

    if (nextIndex !== -1 && buttonRefs.current[nextIndex]) {
      buttonRefs.current[nextIndex].focus();
    }
  };

  // ----------------------------------------------------
  // VARIANT 1: Mobile Drawer Card ('drawer-card')
  // ----------------------------------------------------
  if (variant === 'drawer-card') {
    return (
      <div className={`w-full bg-white dark:bg-stone-800 rounded-2xl border border-[#E7E2D8] dark:border-stone-700 p-2.5 shadow-2xs ${className}`}>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Showcase & Lab
          </span>
          <span className="text-[10px] font-mono font-bold text-[#FF4D6D] bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 px-2 py-0.5 rounded-full border border-[#FFD1DC] dark:border-[#FF4D6D]/30">
            Explore
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Showcase and Lab quick links">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                type="button"
                onClick={() => handleJump(item.id)}
                onMouseEnter={() => {
                  if (soundEnabled) soundFX.playChipHover();
                }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-[#E7E2D8] dark:border-stone-700 hover:border-[#FF4D6D]/40 bg-[#FAF8F5] dark:bg-stone-900/90 hover:bg-white dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 hover:text-[#18181B] dark:hover:text-white transition-all duration-200 cursor-pointer select-none shadow-2xs group text-left focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
                title={`Jump to ${item.label}`}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 text-[#FF4D6D] group-hover:bg-[#FF4D6D] group-hover:text-white transition-colors duration-200">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold font-mono tracking-tight text-[#18181B] dark:text-white">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                    {item.desc}
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
  if (variant === 'floating-bar') {
    if (!isOpen) return null;

    return (
      <div
        role="region"
        aria-label="Explore Showcase & Lab Bar"
        onKeyDown={handleKeyDown}
        className={`mt-2 max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-4 py-1.5 sm:py-2 bg-[#FAF8F5]/95 dark:bg-[#18181B]/95 backdrop-blur-md rounded-full border border-[#E7E2D8] dark:border-stone-800 shadow-md animate-in fade-in slide-in-from-top-2 duration-200 gap-2 sm:gap-4 select-none ${className}`}
      >
        {/* Left Side Label / Badge */}
        <div className="hidden sm:flex items-center gap-1.5 pl-1 shrink-0">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            EXPLORE
          </span>
          <span className="text-[10px] font-mono font-bold text-[#FF4D6D] bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 px-2 py-0.5 rounded-full border border-[#FFD1DC] dark:border-[#FF4D6D]/30">
            SHOWCASE & LAB
          </span>
        </div>

        {/* Center: Quick Jump Buttons */}
        <div
          role="group"
          aria-label="Showcase and Lab Buttons"
          className="flex items-center gap-2 sm:gap-3 flex-1 justify-start sm:justify-center overflow-x-auto no-scrollbar scroll-smooth px-1 sm:px-2"
        >
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                type="button"
                onClick={() => handleJump(item.id)}
                onMouseEnter={() => {
                  if (soundEnabled) soundFX.playChipHover();
                }}
                className="group relative flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full border border-[#E7E2D8] dark:border-stone-700 hover:border-[#FF4D6D]/40 bg-white/70 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 hover:text-[#18181B] dark:hover:text-white transition-all duration-200 cursor-pointer select-none shrink-0 text-xs font-bold font-mono shadow-2xs hover:shadow-xs hover:scale-[1.02] active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
                title={`Jump to ${item.label}`}
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0 bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 text-[#FF4D6D] group-hover:bg-[#FF4D6D] group-hover:text-white transition-colors duration-200">
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                <span className="tracking-tight whitespace-nowrap">{item.label}</span>
                <span className="hidden md:inline text-[10px] font-normal text-stone-400 dark:text-stone-400 group-hover:text-stone-500 dark:group-hover:text-stone-300">
                  {item.id === 'gallery' ? 'Showcase' : 'Playground'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Close Button [×] */}
        <div className="flex items-center shrink-0 pl-1 pr-1 border-l border-stone-200/50 dark:border-stone-700 sm:border-transparent">
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
            }}
            onMouseEnter={() => {
              if (soundEnabled) soundFX.playChipHover();
            }}
            aria-label="Close Explore Bar"
            title="Close (Esc)"
            className="w-7 h-7 rounded-full flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-[#18181B] dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-800 border border-transparent hover:border-stone-300 dark:hover:border-stone-600 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
