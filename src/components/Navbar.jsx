import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, Search } from 'lucide-react';
import { soundFX } from '../utils/audio';
import { CURSOR_LIST } from '../utils/cursorConstants';
import CursorSelectorRibbon from './CursorSelectorRibbon';
import CursorIcon from './CursorIcon';
import CommandPalette from './CommandPalette';
import ResumeDropdown from './ResumeDropdown';
import ScrollProgressBar from './ScrollProgressBar';

export default function Navbar({
  soundEnabled,
  setSoundEnabled,
  activeCursor = 'butterfly',
  onSelectCursor
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRibbonOpen, setIsRibbonOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const q = urlParams.get('q') || urlParams.get('search');
      return Boolean(q && q.trim());
    } catch {
      return false;
    }
  });
  const [initialSearchQuery, setInitialSearchQuery] = useState(() => {
    if (typeof window === 'undefined') return '';
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return (urlParams.get('q') || urlParams.get('search') || '').trim();
    } catch {
      return '';
    }
  });
  const [activeSection, setActiveSection] = useState('hero');
  const navContainerRef = useRef(null);

  const activeCursorData = CURSOR_LIST.find((c) => c.id === activeCursor) || CURSOR_LIST[0];

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

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => {
          const next = !prev;
          if (next) {
            setIsRibbonOpen(false);
            setMobileMenuOpen(false);
            if (soundEnabled) soundFX.playFocusBeep();
          }
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [soundEnabled]);

  // Outside click listener for ribbon
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
    <>
      <header ref={navContainerRef} className="fixed top-0 left-0 right-0 z-40 px-3 md:px-8 py-3.5">
        <div className="relative max-w-6xl mx-auto bg-[#FAF8F5]/90 backdrop-blur-md rounded-full border border-[#E7E2D8] px-3 sm:px-4 md:px-5 py-2 shadow-xs flex items-center justify-between overflow-hidden">
          {/* Brand Logo - Atul Verma (AV) */}
          <a href="#hero" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#E7E2D8] bg-[#18181B] flex items-center justify-center text-white text-xs font-bold shadow-xs group-hover:scale-105 transition-transform">
              <span className="font-mono text-[11px] text-[#FAF8F5]">AV</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-[#18181B] text-xs lg:text-sm tracking-tight font-['Outfit',sans-serif] whitespace-nowrap">
                Atul Verma
              </span>
            </div>
          </a>

          {/* Desktop Nav Links with ScrollSpy */}
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

          {/* Right Action Group - Strict Order: [🔍 Search] -> [🦋 Cursor] -> [🔊 Sound] -> [📄 Resume] -> [☰ Menu] */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 1. Global Search Trigger Button */}
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(true);
                if (isRibbonOpen) setIsRibbonOpen(false);
                if (mobileMenuOpen) setMobileMenuOpen(false);
                if (soundEnabled) soundFX.playFocusBeep();
              }}
              aria-label="Search portfolio (Cmd+K)"
              aria-haspopup="dialog"
              aria-expanded={isSearchOpen}
              className="group relative h-8 w-8 sm:w-auto sm:px-2.5 sm:py-1 rounded-full flex items-center justify-center gap-1.5 bg-white/80 hover:bg-white text-stone-700 hover:text-[#18181B] border border-[#E7E2D8] hover:border-stone-300 shadow-2xs hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
              title="Search portfolio (Cmd+K or Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-stone-600 group-hover:text-[#18181B] transition-colors" />
              <span className="hidden lg:inline-block text-[11px] font-semibold text-stone-600 group-hover:text-[#18181B]">
                Search
              </span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono font-bold text-stone-500 bg-[#F0EBE1] border border-[#E5DFD5] rounded shadow-2xs leading-none">
                ⌘K
              </kbd>
            </button>

            {/* 2. Dynamic Cursor Variant Selector */}
            <button
              type="button"
              onClick={() => {
                const next = !isRibbonOpen;
                setIsRibbonOpen(next);
                if (next) {
                  if (mobileMenuOpen) setMobileMenuOpen(false);
                  if (isSearchOpen) setIsSearchOpen(false);
                }
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

            {/* 3. Audio Toggle Button */}
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

            {/* 4. Smart Resume Action Dropdown */}
            <div className="hidden sm:block">
              <ResumeDropdown soundEnabled={soundEnabled} />
            </div>

            {/* 5. Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = !mobileMenuOpen;
                setMobileMenuOpen(next);
                if (next) {
                  if (isRibbonOpen) setIsRibbonOpen(false);
                  if (isSearchOpen) setIsSearchOpen(false);
                }
              }}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-xl md:hidden text-stone-700 hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* R3: 2.5px Micro Gradient Scroll Progress Bar along bottom edge */}
          <ScrollProgressBar />
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
            {/* Mobile In-Drawer Search Launchpad */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsSearchOpen(true);
                if (soundEnabled) soundFX.playFocusBeep();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-[#E7E2D8] text-stone-700 hover:text-[#18181B] shadow-2xs font-medium text-xs transition-colors mb-1 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#FF4D6D]" />
                <span>Search portfolio...</span>
              </span>
              <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-stone-500 bg-[#F0EBE1] border border-[#E5DFD5] rounded shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Navigation Links */}
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

            {/* Mobile Resume Actions */}
            <div className="pt-2 mt-1 border-t border-[#E7E2D8] flex flex-col gap-1.5">
              <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider px-1 select-none">
                Resume Options
              </div>
              <ResumeDropdown
                soundEnabled={soundEnabled}
                inDrawer={true}
                className="w-full"
                onActionComplete={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}
      </header>

      {/* R1: Global Command Palette Search Modal (⌘K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          setInitialSearchQuery('');
        }}
        initialQuery={initialSearchQuery}
        soundEnabled={soundEnabled}
      />
    </>
  );
}
