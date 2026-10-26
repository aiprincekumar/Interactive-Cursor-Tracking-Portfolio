import React, { useEffect, useRef } from 'react';
import {
  Sliders,
  X,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { useLabDrawer, useLabAudio, useLab } from '../context/LabContext';
import { soundFX } from '../utils/audio';
import ControlCenterPanel from './ControlCenterPanel';
import { useFocusTrap } from '../hooks/useFocusTrap';

function LabStudioDrawer() {
  const {
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    activeTab
  } = useLabDrawer();
  const { soundEnabled } = useLabAudio();
  const { resetDefaults } = useLab();

  const drawerRef = useRef(null);

  // Trap focus when drawer is open and restore focus on close
  useFocusTrap(isDrawerOpen, drawerRef, {
    onEscape: closeDrawer,
    restoreFocus: true
  });

  // Drawer open/close/toggle state is managed cleanly via useLab() context (and its global window listeners in LabContext)

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
      {/* 1. Semi-Transparent Modal Backdrop */}
      {isDrawerOpen && (
        <div
          role="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={closeDrawer}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[75] transition-opacity duration-300 cursor-pointer"
        />
      )}

      {/* 3. Slide-Out Quick Drawer Panel (Zero Layout Shift via translateX) */}
      <aside
        ref={drawerRef}
        id="portfolio-control-center-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Portfolio Control Center Drawer"
        aria-hidden={!isDrawerOpen}
        inert={!isDrawerOpen ? true : undefined}
        className={`fixed top-0 right-0 h-full w-[380px] sm:w-[440px] max-w-[95vw] z-[80] bg-[#FAF8F5]/98 dark:bg-[#120D1D]/98 backdrop-blur-2xl border-l border-[#E7E2D8] dark:border-[#2D2340] shadow-2xl flex flex-col transition-transform duration-300 ease-out will-change-transform ${
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
                Audio, Cursors, Hero, 3D, Preferences & Visuals
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

        {/* Scrollable Drawer Body with 6-Tab Control Center */}
        <div className="flex-1 overflow-y-auto px-4 py-4 no-scrollbar">
          {isDrawerOpen ? <ControlCenterPanel variant="drawer" /> : null}
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

export default React.memo(LabStudioDrawer);
