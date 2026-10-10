import React, { useState } from 'react';
import { Camera, Volume2, VolumeX, Menu, X, Sparkles, FileText } from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function Navbar({ soundEnabled, setSoundEnabled }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-3.5">
      <div className="max-w-6xl mx-auto bg-[#FAF8F5]/90 backdrop-blur-md rounded-full border border-[#E7E2D8] px-4 md:px-6 py-2 shadow-xs flex items-center justify-between">
        {/* Brand Logo - Reel Accurate */}
        <a href="#hero" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#E7E2D8] bg-[#18181B] flex items-center justify-center text-white text-xs font-bold shadow-xs group-hover:scale-105 transition-transform">
            <span className="font-mono text-[11px] text-[#FAF8F5]">SD</span>
          </div>
          <div>
            <span className="font-extrabold text-[#18181B] text-sm sm:text-base tracking-tight font-['Outfit',sans-serif]">
              Sushmitha Dasari
            </span>
          </div>
        </a>

        {/* Desktop Nav Links - Center Pill matching Reel */}
        <nav className="hidden md:flex items-center gap-1 bg-[#F0EBE1]/60 px-3 py-1 rounded-full border border-[#E5DFD5]" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-semibold text-stone-700 hover:text-[#18181B] hover:bg-white/80 transition-all rounded-full px-3 py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              soundFX.setEnabled(next);
              if (next) soundFX.playSparkle();
            }}
            aria-label={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
            className="p-2 rounded-full text-stone-600 hover:text-[#18181B] hover:bg-stone-200/50 transition-colors"
            title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#FF4D6D]" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
          </button>

          {/* Reel element: Coral Resume Pill Button */}
          <a
            href="#contact"
            className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FF4D6D] hover:bg-[#E03554] text-white text-xs font-bold shadow-xs transition-all duration-200 active:scale-95"
          >
            <FileText className="w-3.5 h-3.5" />
            Resume
          </a>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
            className="p-2 rounded-xl md:hidden text-stone-700 hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-6xl mx-auto bg-[#FAF8F5]/98 backdrop-blur-xl rounded-2xl border border-[#E7E2D8] p-4 shadow-xl flex flex-col gap-3 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-stone-700 hover:text-[#FF4D6D] py-2 px-3 rounded-xl hover:bg-stone-100 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center py-2.5 rounded-xl bg-[#FF4D6D] text-white text-sm font-bold shadow-xs uppercase tracking-wider"
          >
            Get In Touch
          </a>
        </div>
      )}
    </header>
  );
}
