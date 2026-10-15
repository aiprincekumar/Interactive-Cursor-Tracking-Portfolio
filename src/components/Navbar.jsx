import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, FileText } from 'lucide-react';
import { soundFX } from '../utils/audio';
import { CURSOR_LIST } from '../utils/cursorConstants';
import CursorSelectorRibbon from './CursorSelectorRibbon';
import CursorIcon from './CursorIcon';

export default function Navbar({
  soundEnabled,
  setSoundEnabled,
  activeCursor = 'butterfly',
  onSelectCursor
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRibbonOpen, setIsRibbonOpen] = useState(false);
  const navContainerRef = useRef(null);

  const activeCursorData = CURSOR_LIST.find((c) => c.id === activeCursor) || CURSOR_LIST[0];

  // Outside click and Escape key listeners to close ribbon smoothly
  useEffect(() => {
    if (!isRibbonOpen) return;

    const handleClickOutside = (event) => {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target)) {
        setIsRibbonOpen(false);
        soundFX.playRibbonToggle(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsRibbonOpen(false);
        soundFX.playRibbonToggle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRibbonOpen]);

  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { label: 'Home', href: '#hero', id: 'hero' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Achievements', href: '#achievements', id: 'achievements' },
    { label: 'Gallery', href: '#gallery', id: 'gallery' },
    { label: 'Lab', href: '#playground', id: 'playground' },
    { label: 'Contact', href: '#contact', id: 'contact' }
  ];

  // ScrollSpy listener to highlight active section in Navbar
  useEffect(() => {
    const sectionIds = [
      'hero',
      'about',
      'skills',
      'experience',
      'projects',
      'achievements',
      'gallery',
      'playground',
      'contact'
    ];

    const handleScroll = () => {
      // If close to bottom, highlight the last section ('contact')
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveSection('contact');
        return;
      }

      let current = 'hero';
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 160) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header ref={navContainerRef} className="fixed top-0 left-0 right-0 z-40 px-3 md:px-8 py-3.5">
      <div className="max-w-6xl mx-auto bg-[#FAF8F5]/90 backdrop-blur-md rounded-full border border-[#E7E2D8] px-3 sm:px-4 md:px-5 py-2 shadow-xs flex items-center justify-between">
        {/* Brand Logo - Reel Accurate */}
        <a href="#hero" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#E7E2D8] bg-[#18181B] flex items-center justify-center text-white text-xs font-bold shadow-xs group-hover:scale-105 transition-transform">
            <span className="font-mono text-[11px] text-[#FAF8F5]">SD</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-extrabold text-[#18181B] text-xs lg:text-sm tracking-tight font-['Outfit',sans-serif] whitespace-nowrap">
              Sushmitha Dasari
            </span>
          </div>
        </a>

        {/* Desktop Nav Links - Center Pill matching Reel with ScrollSpy */}
        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 bg-[#F0EBE1]/70 px-2 lg:px-3 py-1 rounded-full border border-[#E5DFD5] shadow-xs" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  setActiveSection(link.id);
                  if (soundEnabled) soundFX.playFocusBeep();
                }}
                className={`text-[11px] lg:text-xs font-semibold rounded-full px-2 lg:px-2.5 py-1 transition-all duration-200 select-none whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-[#18181B] shadow-xs font-bold scale-[1.02]'
                    : 'text-stone-600 hover:text-[#18181B] hover:bg-white/60'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Dynamic Cursor Variant Toggle Button - Ultra-Compact Icon Only */}
          <button
            type="button"
            onClick={() => {
              const next = !isRibbonOpen;
              setIsRibbonOpen(next);
              if (next && mobileMenuOpen) setMobileMenuOpen(false);
              soundFX.playRibbonToggle(next);
            }}
            aria-label={isRibbonOpen ? 'Close Cursor Selector' : `Cursor: ${activeCursorData.name}`}
            aria-expanded={isRibbonOpen}
            className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer ${
              isRibbonOpen
                ? 'bg-[#18181B] text-white border-[#18181B] shadow-xs scale-105'
                : 'bg-white/80 hover:bg-white text-stone-700 hover:text-[#18181B] border-[#E7E2D8] hover:border-stone-300 shadow-2xs hover:scale-105'
            }`}
            title={`Active Cursor: ${activeCursorData.name} (Click to customize)`}
          >
            <span className="text-sm leading-none select-none flex items-center justify-center" aria-label={activeCursorData.name}>
              <CursorIcon cursorId={activeCursorData.id} size={15} />
            </span>
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4D6D] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4D6D] ring-2 ring-white" />
            </span>
          </button>

          {/* Audio Toggle Button */}
          <button
            type="button"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              soundFX.setEnabled(next);
              if (next) soundFX.playSparkle();
            }}
            aria-label={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
            className="p-2 rounded-full text-stone-600 hover:text-[#18181B] hover:bg-stone-200/50 transition-colors cursor-pointer"
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
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF4D6D] hover:bg-[#E03554] text-white text-xs font-bold shadow-xs transition-all duration-200 active:scale-95 whitespace-nowrap shrink-0"
          >
            <FileText className="w-3.5 h-3.5" />
            Resume
          </a>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => {
              const next = !mobileMenuOpen;
              setMobileMenuOpen(next);
              if (next && isRibbonOpen) setIsRibbonOpen(false);
            }}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
            className="p-2 rounded-xl md:hidden text-stone-700 hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expandable Cursor Selector Ribbon with Smooth Animation */}
      {isRibbonOpen && (
        <div className="mt-2.5 animate-in fade-in slide-in-from-top-2 duration-200 transition-all">
          <CursorSelectorRibbon
            activeCursor={activeCursor}
            onSelectCursor={(cursorId) => {
              if (onSelectCursor) {
                onSelectCursor(cursorId);
              }
            }}
            defaultExpanded={true}
            onClose={() => {
              setIsRibbonOpen(false);
              soundFX.playRibbonToggle(false);
            }}
          />
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-6xl mx-auto bg-[#FAF8F5]/98 backdrop-blur-xl rounded-2xl border border-[#E7E2D8] p-4 shadow-xl flex flex-col gap-1.5 animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  setActiveSection(link.id);
                  setMobileMenuOpen(false);
                  if (soundEnabled) soundFX.playFocusBeep();
                }}
                className={`text-sm font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-between ${
                  isActive
                    ? 'bg-white text-[#FF4D6D] font-bold shadow-2xs'
                    : 'text-stone-700 hover:text-[#FF4D6D] hover:bg-stone-100'
                }`}
              >
                <span>{link.label}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />}
              </a>
            );
          })}
          <a
            href="#contact"
            onClick={() => {
              setActiveSection('contact');
              setMobileMenuOpen(false);
              if (soundEnabled) soundFX.playSparkle();
            }}
            className="w-full text-center py-2.5 mt-2 rounded-xl bg-[#FF4D6D] text-white text-sm font-bold shadow-xs uppercase tracking-wider"
          >
            Get In Touch
          </a>
        </div>
      )}
    </header>
  );
}
