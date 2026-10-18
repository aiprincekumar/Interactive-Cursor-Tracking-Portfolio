import React from 'react';
import { Sliders, RotateCcw, ExternalLink } from 'lucide-react';
import { useLab } from '../context/LabContext';
import { soundFX } from '../utils/audio';
import ControlCenterPanel from './ControlCenterPanel';

export default function InteractivePlayground() {
  const { soundEnabled, resetDefaults, openDrawer } = useLab();

  return (
    <section
      id="playground"
      className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] dark:bg-[#0B0813] transition-colors duration-300 border-t border-[#ECE7DF] dark:border-[#201830]"
    >
      {/* Anchor target for #lab */}
      <div id="lab" className="absolute -top-16 left-0 opacity-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#ECE7DF] dark:border-[#201830]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4D6D]/10 text-[#FF4D6D] dark:bg-[#FF4D6D]/20 text-xs font-bold uppercase tracking-wider mb-3">
              <Sliders className="w-3.5 h-3.5" />
              <span>PORTFOLIO CONTROL CENTER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#18181B] dark:text-[#F5F2F8] tracking-tight">
              System Control & Live Calibration
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 mt-2 max-w-2xl">
              Fine-tune Web Audio synthesizer acoustics, 60-120 FPS cursor kinematics, 2.5D hero character tracking, and startup career preferences with real-time reactive persistence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                resetDefaults();
                if (soundEnabled) soundFX.playCrystalChime();
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-[#181226]/80 text-xs font-bold text-stone-700 dark:text-stone-300 hover:border-[#FF4D6D]/50 hover:text-[#FF4D6D] transition-all cursor-pointer shadow-2xs active:scale-97"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={() => openDrawer()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF4D6D] hover:bg-[#E03554] text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-97"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Quick Drawer</span>
            </button>
          </div>
        </div>

        {/* 4-Tab Control Center Panel */}
        <ControlCenterPanel variant="workbench" />
      </div>
    </section>
  );
}
