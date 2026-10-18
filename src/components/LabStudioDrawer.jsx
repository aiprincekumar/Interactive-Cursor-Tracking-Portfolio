import React, { useEffect } from 'react';
import {
  Sliders,
  X,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { useLab } from '../context/LabContext';
import { soundFX } from '../utils/audio';
import ControlCenterPanel from './ControlCenterPanel';

export default function LabStudioDrawer() {
  const {
    isDrawerOpen,
    closeDrawer,
    toggleDrawer,
    resetDefaults,
    soundEnabled,
    activeTab
  } = useLab();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  const handleJumpToWorkbench = () => {
    closeDrawer();
    const el = document.getElementById('playground') || document.getElementById('lab');
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  return (
    <>
      {/* 1. Persistent Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 select-none">
        <button
          type="button"
          onClick={toggleDrawer}
          aria-label={isDrawerOpen ? 'Close Portfolio Control Center' : 'Open Portfolio Control Center'}
          aria-expanded={isDrawerOpen}
          aria-controls="portfolio-control-center-drawer"
          title="Portfolio Control Center (Audio, Cursors, Hero, Preferences)"
          className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#18181B]/95 dark:bg-[#120D1D]/95 text-[#FF4D6D] border border-[#FF4D6D]/40 shadow-2xl shadow-[#FF4D6D]/25 hover:border-[#FF4D6D] hover:scale-105 active:scale-95 transition-all duration-300 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#FF4D6D] cursor-pointer"
        >
          {/* Subtle Pulse Beacon indicator */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#FF4D6D]" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-white dark:border-[#120D1D] bg-[#FF4D6D]" />
          </span>

          <Sliders
            className={`w-6 h-6 transition-transform duration-300 ${
              isDrawerOpen ? 'rotate-90 scale-110 text-white' : 'group-hover:rotate-12'
            }`}
          />

          {/* Accessible Tooltip */}
          <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl bg-stone-900/95 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 hidden sm:block border border-stone-700/60">
            Control Center
          </span>
        </button>
      </div>

      {/* 2. Semi-Transparent Modal Backdrop */}
      {isDrawerOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close Control Center Drawer"
          onClick={closeDrawer}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              closeDrawer();
            }
          }}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[47] transition-opacity duration-300 cursor-pointer"
        />
      )}

      {/* 3. Slide-Out Quick Drawer Panel (Zero Layout Shift via translateX) */}
      <aside
        id="portfolio-control-center-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Portfolio Control Center Drawer"
        className={`fixed top-0 right-0 h-full w-[380px] sm:w-[440px] max-w-[95vw] z-[48] bg-[#FAF8F5]/98 dark:bg-[#120D1D]/98 backdrop-blur-2xl border-l border-[#E7E2D8] dark:border-[#2D2340] shadow-2xl flex flex-col transition-transform duration-300 ease-out will-change-transform ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-[#ECE7DF] dark:border-[#2D2340] bg-white/70 dark:bg-[#161122]/70 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 text-[#FF4D6D] border border-[#FFD1DC] dark:border-[#FF4D6D]/30 shadow-2xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-[#18181B] dark:text-white font-['Outfit',sans-serif]">
                  Control Center
                </h3>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF4D6D]/10 text-[#FF4D6D]">
                  {activeTab}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                Audio, Cursors, Hero & Preferences
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                resetDefaults();
                if (soundEnabled) soundFX.playCrystalChime();
              }}
              title="Reset all settings to factory defaults"
              aria-label="Reset to Factory Defaults"
              className="p-1.5 rounded-xl text-stone-500 dark:text-stone-400 hover:text-[#FF4D6D] hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Close drawer"
              className="p-1.5 rounded-xl text-stone-500 dark:text-stone-400 hover:text-[#18181B] dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Drawer Body with 4-Tab Control Center */}
        <div className="flex-1 overflow-y-auto px-4 py-4 no-scrollbar">
          <ControlCenterPanel variant="drawer" />
        </div>

        {/* Drawer Footer */}
        <div className="shrink-0 px-5 py-3.5 border-t border-[#ECE7DF] dark:border-[#2D2340] bg-white/70 dark:bg-[#161122]/70 backdrop-blur-md flex items-center justify-between">
          <button
            type="button"
            onClick={handleJumpToWorkbench}
            className="flex items-center gap-1.5 text-xs font-bold text-[#FF4D6D] hover:underline cursor-pointer"
          >
            <span>Open Full Control Center</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500">
            Auto-persists
          </span>
        </div>
      </aside>
    </>
  );
}
