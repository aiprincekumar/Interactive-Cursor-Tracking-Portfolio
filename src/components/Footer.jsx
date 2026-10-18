import React from 'react';
import { Heart, ArrowUp } from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function Footer() {
  const scrollToTop = () => {
    soundFX.playSparkle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-purple-950/40 dark:border-[#2D2340] bg-[#161220] dark:bg-[#0B0813] text-stone-300 py-16 px-4 md:px-8 relative overflow-hidden select-none transition-colors duration-300">
      {/* Giant Faint Watermark Text matching Reel t=16.8s */}
      <div className="absolute inset-x-0 bottom-2 text-center pointer-events-none select-none overflow-hidden opacity-[0.06]">
        <span className="text-[14vw] font-black uppercase tracking-tighter text-white font-['Outfit',sans-serif] whitespace-nowrap">
          ATUL VERMA
        </span>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        {/* Brand & Attribution */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="w-9 h-9 rounded-full bg-[#FF4D6D] flex items-center justify-center text-white shadow-md shadow-pink-600/30">
            <span className="text-base">🦋</span>
          </div>
          <div>
            <div className="text-base font-extrabold text-white font-['Outfit',sans-serif] tracking-tight">
              Atul Verma • Interactive Portfolio
            </div>
            <div className="text-xs text-stone-400 flex items-center gap-1.5 justify-center sm:justify-start mt-0.5">
              <span>Accountant &amp; Tax Consultant</span>
              <span className="text-stone-600">•</span>
              <span>Business Development &amp; Office Administrator</span>
            </div>
          </div>
        </div>

        {/* Center Credits */}
        <div className="flex items-center gap-2 text-xs text-stone-400 font-medium">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 fill-[#FF4D6D] text-[#FF4D6D]" />
          <span>React 19, Tailwind CSS &amp; 120 FPS Kinematics</span>
        </div>

        {/* Right Links & Back to Top */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-stone-400 font-mono">© 2026 Atul Verma. All rights reserved.</span>
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll back to top of page"
            className="p-3 rounded-full bg-[#241E33] dark:bg-[#161122] hover:bg-[#FF4D6D] text-white border border-purple-800/40 dark:border-[#2D2340] transition-all duration-200 active:scale-95 shadow-md cursor-pointer"
            title="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
