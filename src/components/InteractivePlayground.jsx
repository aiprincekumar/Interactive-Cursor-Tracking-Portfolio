import React, { useState, useEffect } from 'react';
import { Sliders, RotateCcw, ExternalLink, ChevronDown } from 'lucide-react';
import { useLabAudio, useLabDrawer, useLab } from '../context/LabContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { soundFX } from '../utils/audio';
import ControlCenterPanel from './ControlCenterPanel';

function InteractivePlayground() {
  const { soundEnabled } = useLabAudio();
  const { openDrawer } = useLabDrawer();
  const { resetDefaults } = useLab();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      if (typeof window !== 'undefined' && (window.location.hash === '#playground' || window.location.hash === '#lab')) {
        setIsExpanded(true);
        setHasOpened(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    if (isExpanded) {
      setHasOpened(true);
    }
  }, [isExpanded]);

  const toggleAccordion = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      if (next) setHasOpened(true);
      return next;
    });
    if (soundEnabled) soundFX.playHapticClick();
  };

  const handleOpenNewTab = (e) => {
    e.stopPropagation();
    if (soundEnabled) {
      if (typeof soundFX?.playBubblePop === 'function') {
        soundFX.playBubblePop();
      } else if (typeof soundFX?.playHapticClick === 'function') {
        soundFX.playHapticClick();
      }
    }
    if (typeof window !== 'undefined') {
      window.open(
        `${window.location.origin}${window.location.pathname}?view=control&mode=all&theme=${theme}&lang=${language}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  return (
    <section
      id="playground"
      aria-labelledby="playground-heading"
      className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] dark:bg-[#0B0813] transition-colors duration-300 border-t border-[#ECE7DF] dark:border-[#201830]"
    >
      {/* Anchor target for #lab */}
      <div id="lab" className="absolute -top-16 left-0 opacity-0 pointer-events-none" />

      <div className={`max-w-7xl mx-auto flex flex-col transition-all duration-300 ${isExpanded ? 'gap-8' : 'gap-0'}`}>
        {/* Section Header (100% Authentic Original Production Theme with Collapsible Trigger) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#ECE7DF] dark:border-[#201830]">
          <div
            id="system-control-panel-trigger"
            role="button"
            tabIndex={0}
            aria-expanded={isExpanded}
            aria-controls="system-control-panel-content"
            onClick={toggleAccordion}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleAccordion();
              }
            }}
            className="cursor-pointer group select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D]/60 rounded-xl"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#161122] border border-[#E7E2D8] dark:border-[#2D2340] text-[#18181B] dark:text-[#F5F2F8] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs whitespace-nowrap max-w-full overflow-x-auto">
              <span className="w-2 h-2 rounded-full bg-[#FF4D6D] shrink-0" />
              <Sliders className="w-3.5 h-3.5 text-[#FF4D6D] shrink-0" />
              <span className="truncate sm:overflow-visible">PORTFOLIO CONTROL CENTER</span>
            </div>
            <h2 id="playground-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#18181B] dark:text-white tracking-tight font-['Outfit',sans-serif] leading-[1.08] mb-3 group-hover:text-[#FF4D6D] transition-colors whitespace-normal sm:whitespace-nowrap">
              System Control &amp; <span className="text-[#FF4D6D]">Live Calibration</span>.
              <span className="sr-only">Butterfly & Camera Physics Lab</span>
            </h2>
            <div className="w-12 h-1 rounded-full bg-[#FF4D6D] mb-4" />
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-2xl leading-relaxed">
              Fine-tune Web Audio synthesizer acoustics, cursor kinematics, 2.5D hero tracking, career preferences, and luxury display &amp; visual optics with real-time reactive persistence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Reset Defaults Icon Button */}
            <button
              type="button"
              title="Reset Defaults"
              aria-label="Reset Defaults"
              onClick={(e) => {
                e.stopPropagation();
                resetDefaults();
                if (soundEnabled) soundFX.playCrystalChime();
              }}
              className="p-2.5 sm:px-3 sm:py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-[#181226]/80 text-stone-700 dark:text-stone-300 hover:border-[#FF4D6D]/50 hover:text-[#FF4D6D] transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D]"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Quick Drawer Icon Button */}
            <button
              type="button"
              title="Open Quick Drawer"
              aria-label="Open Quick Drawer"
              onClick={(e) => {
                e.stopPropagation();
                openDrawer();
              }}
              className="p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-[#FF4D6D] hover:bg-[#E03554] text-white transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D]"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            {/* Open in New Tab Launcher Button */}
            <button
              type="button"
              title="Open in New Tab"
              aria-label="Open in New Tab"
              onClick={handleOpenNewTab}
              className="p-2.5 sm:px-3 sm:py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-[#181226]/80 text-stone-700 dark:text-stone-300 hover:border-[#FF4D6D]/50 hover:text-[#FF4D6D] transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D]"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            {/* Chevron Toggle Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleAccordion();
              }}
              aria-label={isExpanded ? 'Collapse Control Center' : 'Expand Control Center'}
              className="p-2.5 sm:px-3 sm:py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-[#181226]/80 text-stone-600 dark:text-stone-300 hover:text-[#FF4D6D] hover:border-[#FF4D6D]/40 transition-all flex items-center justify-center shadow-2xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D]"
            >
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        <div
          id="system-control-panel-content"
          role="region"
          aria-labelledby="system-control-panel-trigger"
          aria-hidden={!isExpanded}
          className={`grid transition-all duration-300 ease-in-out ${
            isExpanded
              ? 'grid-rows-[1fr] opacity-100 visible'
              : 'grid-rows-[0fr] opacity-0 pointer-events-none invisible'
          }`}
        >
          <div className="overflow-hidden min-h-0">
            {hasOpened ? <ControlCenterPanel variant="workbench" /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default React.memo(InteractivePlayground);
