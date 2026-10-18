import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, Search, LayoutGrid, Sun, Moon } from 'lucide-react';
import { soundFX } from '../utils/audio';
import { CURSOR_LIST } from '../utils/cursorConstants';
import CursorSelectorRibbon from './CursorSelectorRibbon';
import CursorIcon from './CursorIcon';
import CommandPalette from './CommandPalette';
import ResumeDropdown from './ResumeDropdown';
import ScrollProgressBar from './ScrollProgressBar';
import RoleTabsBar from './RoleTabsBar';
import ExploreSubBar from './ExploreSubBar';
import { useRoleTab, ROLE_DATA, DEFAULT_ROLE } from '../context/RoleContext';
import { useDesktopCursorSupport } from '../hooks/useDesktopCursorSupport';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({
  soundEnabled,
  setSoundEnabled,
  activeCursor = 'butterfly',
  onSelectCursor,
  activeRole: propActiveRole,
  onSelectRole: propOnSelectRole
}) {
  let roleContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    roleContext = useRoleTab();
  } catch {
    // In case Navbar is mounted outside RoleProvider
  }
  const activeRole = propActiveRole ?? roleContext?.activeRole ?? DEFAULT_ROLE;
  const onSelectRole = propOnSelectRole ?? roleContext?.selectRole;
  const activeTrack = roleContext?.activeTrack || ROLE_DATA?.[activeRole] || ROLE_DATA?.[DEFAULT_ROLE];
  const avatarSrc = activeTrack?.avatar;
  const accentColor = activeTrack?.accentHex || activeTrack?.color || activeTrack?.accent || '#FF4D6D';

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const avatarImgRef = useRef(null);
  const avatarButtonRef = useRef(null);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    if (avatarImgRef.current && avatarImgRef.current.complete && avatarImgRef.current.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, [avatarSrc]);

  let themeContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    themeContext = useTheme();
  } catch {
    // In case Navbar is mounted outside ThemeProvider
  }
  const isDark = themeContext?.isDark ?? false;
  const toggleTheme = themeContext?.toggleTheme ?? (() => {});

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRibbonOpen, setIsRibbonOpen] = useState(false);
  const [isRoleBarOpen, setIsRoleBarOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
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
  const isDesktopCursor = useDesktopCursorSupport();

  // Auto-close cursor ribbon if screen drops below 1024px or enters touch mode
  useEffect(() => {
    if (!isDesktopCursor && isRibbonOpen) {
      setIsRibbonOpen(false);
    }
  }, [isDesktopCursor, isRibbonOpen]);

  // Auto-close mobile drawer on desktop resize or orientation change
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [mobileMenuOpen]);

  const activeCursorData = CURSOR_LIST.find((c) => c.id === activeCursor) || CURSOR_LIST[0];

  const toggleRoleBar = () => {
    setIsRoleBarOpen((prev) => {
      const next = !prev;
      if (next) {
        setIsExploreOpen(false);
        setIsRibbonOpen(false);
        setMobileMenuOpen(false);
        setIsSearchOpen(false);
      }
      if (soundEnabled) soundFX.playRibbonToggle(next);
      return next;
    });
  };

  const toggleExploreBar = () => {
    const next = !isExploreOpen;
    setIsExploreOpen(next);
    if (next) {
      setIsRoleBarOpen(false);
      setIsRibbonOpen(false);
      setMobileMenuOpen(false);
      if (isSearchOpen) setIsSearchOpen(false);
    }
    if (soundEnabled) soundFX.playRibbonToggle(next);
  };

  const navLinks = [
    { label: 'Home', href: '#hero', id: 'hero' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Achievements', href: '#achievements', id: 'achievements' },
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
            setIsExploreOpen(false);
            setIsRoleBarOpen(false);
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

  // Outside click & Escape listener for ribbon, role secondary bar & explore sub-bar
  useEffect(() => {
    if (!isRibbonOpen && !isRoleBarOpen && !isExploreOpen) return;

    const handleClickOutside = (event) => {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target)) {
        if (isRibbonOpen) {
          setIsRibbonOpen(false);
          soundFX.playRibbonToggle(false);
        }
        if (isRoleBarOpen) {
          setIsRoleBarOpen(false);
          if (soundEnabled) soundFX.playRibbonToggle(false);
        }
        if (isExploreOpen) {
          setIsExploreOpen(false);
          if (soundEnabled) soundFX.playRibbonToggle(false);
        }
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (isRibbonOpen) {
          setIsRibbonOpen(false);
          soundFX.playRibbonToggle(false);
        }
        if (isRoleBarOpen) {
          setIsRoleBarOpen(false);
          if (soundEnabled) soundFX.playRibbonToggle(false);
          avatarButtonRef.current?.focus();
        }
        if (isExploreOpen) {
          setIsExploreOpen(false);
          if (soundEnabled) soundFX.playRibbonToggle(false);
        }
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
  }, [isRibbonOpen, isRoleBarOpen, isExploreOpen, soundEnabled]);

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
      <header ref={navContainerRef} className="fixed top-0 left-0 right-0 z-40 px-2 sm:px-3 md:px-8 py-3.5">
        <div className="relative max-w-7xl mx-auto bg-[#FAF8F5]/90 dark:bg-[#161122]/90 backdrop-blur-md rounded-full border border-[#E7E2D8] dark:border-[#2D2340] px-2.5 sm:px-4 md:px-5 py-2 shadow-xs flex items-center justify-between transition-colors">
          {/* Brand Group: Universal Role Switcher Avatar Button + Atul Verma Home Link */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Universal Avatar Role-Switcher Trigger */}
            <button
              ref={avatarButtonRef}
              type="button"
              onClick={toggleRoleBar}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  if (!isRoleBarOpen) {
                    toggleRoleBar();
                  }
                  requestAnimationFrame(() => {
                    const activeTabEl = document.getElementById(`floating-role-tab-${activeRole}`) || document.querySelector('[id^="floating-role-tab-"]');
                    activeTabEl?.focus();
                  });
                }
              }}
              onMouseEnter={() => {
                if (soundEnabled) soundFX.playChipHover();
              }}
              aria-label={isRoleBarOpen ? 'Close career track switcher' : `Switch career track (current: ${activeTrack?.label || activeRole}) Profile • Atul Verma`}
              aria-expanded={isRoleBarOpen}
              aria-haspopup="dialog"
              aria-controls="floating-career-track-bar"
              title={`${activeTrack?.label || activeRole} Profile • Atul Verma - Click to switch career track`}
              className={`relative w-8 h-8 rounded-full overflow-hidden border-2 bg-[#18181B] dark:bg-[#201830] flex items-center justify-center shrink-0 shadow-xs hover:scale-105 active:scale-95 transition-all duration-300 ease-out cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden ${
                isRoleBarOpen ? 'scale-105 ring-2 ring-[#FF4D6D]/40' : ''
              }`}
              style={{
                borderColor: accentColor,
                boxShadow: isRoleBarOpen
                  ? `0 0 14px ${accentColor}80`
                  : `0 0 10px ${accentColor}40`
              }}
            >
              {/* Fallback AV Monogram (active during initial load or on image error) */}
              <div
                className={`absolute inset-0 flex items-center justify-center text-white text-xs font-bold transition-opacity duration-300 ease-in-out ${
                  imageLoaded && !imageError ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
                aria-hidden="true"
              >
                <span className="font-mono text-[11px] text-[#FAF8F5] dark:text-[#F5F2F8]">AV</span>
              </div>

              {/* Dynamic Role Profile Picture with cross-dissolve & scale transition */}
              {avatarSrc && !imageError && (
                <img
                  ref={avatarImgRef}
                  key={avatarSrc}
                  src={avatarSrc}
                  alt={`${activeTrack?.label || activeRole} Profile • Atul Verma`}
                  className={`w-full h-full object-cover rounded-full transition-all duration-300 ease-out ${
                    imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  loading="eager"
                  decoding="async"
                />
              )}
            </button>

            {/* Brand Name Link navigating to #hero */}
            <a
              href="#hero"
              onClick={() => {
                setActiveSection('hero');
                if (isRoleBarOpen) setIsRoleBarOpen(false);
                if (isExploreOpen) setIsExploreOpen(false);
                if (isRibbonOpen) setIsRibbonOpen(false);
                if (soundEnabled) soundFX.playFocusBeep();
              }}
              className="hidden sm:block group"
              title="Atul Verma • Home"
              aria-label="Atul Verma • Home"
            >
              <span className="font-extrabold text-[#18181B] dark:text-white text-xs lg:text-sm tracking-tight font-['Outfit',sans-serif] whitespace-nowrap group-hover:text-[#FF4D6D] dark:group-hover:text-[#FF4D6D] transition-colors">
                Atul Verma
              </span>
            </a>
          </div>

          {/* Desktop Nav Links with ScrollSpy */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 bg-[#F0EBE1]/70 dark:bg-[#0B0813]/85 px-2 lg:px-3 py-1 rounded-full border border-[#E5DFD5] dark:border-[#2D2340]/80 shadow-xs" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => {
                    setActiveSection(link.id);
                    if (isRoleBarOpen) setIsRoleBarOpen(false);
                    if (isExploreOpen) setIsExploreOpen(false);
                    if (isRibbonOpen) setIsRibbonOpen(false);
                    if (soundEnabled) soundFX.playFocusBeep();
                  }}
                  className={`text-[11px] lg:text-xs font-semibold rounded-full px-2 lg:px-2.5 py-1 transition-all duration-200 select-none whitespace-nowrap ${
                    isActive
                      ? 'bg-white dark:bg-[#201830] text-[#18181B] dark:text-[#F5F2F8] shadow-xs font-bold scale-[1.02]'
                      : 'text-stone-600 dark:text-[#A99EBA] hover:text-[#18181B] dark:hover:text-[#F5F2F8] hover:bg-white/60 dark:hover:bg-[#201830]/60'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Group - Order: [🔍 Search] -> [✨ Explore] -> [🦋 Cursor] -> [🌓 Theme] -> [🔊 Sound] -> [📄 Resume] -> [☰ Menu] */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* 1. Global Search Trigger Button */}
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(true);
                if (isExploreOpen) setIsExploreOpen(false);
                if (isRoleBarOpen) setIsRoleBarOpen(false);
                if (isRibbonOpen) setIsRibbonOpen(false);
                if (mobileMenuOpen) setMobileMenuOpen(false);
                if (soundEnabled) soundFX.playFocusBeep();
              }}
              aria-label="Search portfolio (Cmd+K)"
              aria-haspopup="dialog"
              aria-expanded={isSearchOpen}
              className="group relative h-8 w-8 sm:w-auto sm:px-2.5 sm:py-1 rounded-full flex items-center justify-center gap-1.5 bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 hover:text-[#18181B] dark:hover:text-white border border-[#E7E2D8] dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 shadow-2xs hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
              title="Search portfolio (Cmd+K or Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300 group-hover:text-[#18181B] dark:group-hover:text-white transition-colors" />
              <span className="hidden lg:inline-block text-[11px] font-semibold text-stone-600 dark:text-stone-300 group-hover:text-[#18181B] dark:group-hover:text-white">
                Search
              </span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono font-bold text-stone-500 dark:text-stone-400 bg-[#F0EBE1] dark:bg-stone-900 border border-[#E5DFD5] dark:border-stone-700 rounded shadow-2xs leading-none">
                ⌘K
              </kbd>
            </button>

            {/* 2. Explore / Showcase & Lab SubBar Trigger Button */}
            <button
              type="button"
              onClick={toggleExploreBar}
              aria-label="Explore Showcase & Lab (Gallery, Playground)"
              aria-expanded={isExploreOpen}
              className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer ${
                isExploreOpen
                  ? 'bg-[#18181B] dark:bg-stone-100 text-white dark:text-stone-900 border-[#18181B] dark:border-white shadow-xs scale-105'
                  : 'bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 hover:text-[#18181B] dark:hover:text-white border-[#E7E2D8] dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 shadow-2xs hover:scale-105 active:scale-95'
              }`}
              title="Explore Showcase & Lab (Gallery, Playground)"
            >
              <LayoutGrid
                className="w-4 h-4 transition-transform duration-200"
                style={{ color: isExploreOpen ? (isDark ? '#18181B' : '#FFFFFF') : '#FF4D6D' }}
              />
              {/* Dynamic Indicator Dot with ping animation */}
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 pointer-events-none">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4D6D] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4D6D] ring-2 ring-white dark:ring-stone-900" />
              </span>
            </button>

            {/* Standalone role-switcher button (formerly RoleTabsBar with variant="navbar") removed in favor of universal avatar trigger */}

            {/* 3. Dynamic Cursor Variant Selector (Desktop & Fine Pointer Only) */}
            {isDesktopCursor && (
              <button
                type="button"
                onClick={() => {
                  if (!isDesktopCursor) return;
                  const next = !isRibbonOpen;
                  setIsRibbonOpen(next);
                  if (next) {
                    setIsExploreOpen(false);
                    setIsRoleBarOpen(false);
                    if (mobileMenuOpen) setMobileMenuOpen(false);
                    if (isSearchOpen) setIsSearchOpen(false);
                  }
                  soundFX.playRibbonToggle(next);
                }}
                aria-label={isRibbonOpen ? 'Close Cursor Selector' : `Cursor: ${activeCursorData.name}`}
                aria-expanded={isRibbonOpen}
                className={`desktop-cursor-only hidden lg:flex relative w-8 h-8 rounded-full items-center justify-center transition-all duration-200 border cursor-pointer ${
                  isRibbonOpen
                    ? 'bg-[#18181B] dark:bg-stone-100 text-white dark:text-stone-900 border-[#18181B] dark:border-white shadow-xs scale-105'
                    : 'bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 hover:text-[#18181B] dark:hover:text-white border-[#E7E2D8] dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 shadow-2xs hover:scale-105'
                }`}
                title={`Active Cursor: ${activeCursorData.name} (Click to customize)`}
              >
                <span className="text-sm leading-none select-none flex items-center justify-center" aria-label={activeCursorData.name}>
                  <CursorIcon cursorId={activeCursorData.id} size={15} />
                </span>
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4D6D] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4D6D] ring-2 ring-white dark:ring-stone-900" />
                </span>
              </button>
            )}

            {/* Theme Toggle Button (Light / Dark) */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-full text-stone-600 dark:text-stone-300 hover:text-[#18181B] dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-800/60 transition-all cursor-pointer relative group"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-stone-600 hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* 5. Audio Toggle Button */}
            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                soundFX.setEnabled(next);
                if (next) soundFX.playSparkle();
              }}
              aria-label={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
              className="p-2 rounded-full text-stone-600 dark:text-stone-400 hover:text-[#18181B] dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-800/60 transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#FF4D6D]" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-400 dark:text-stone-500" />
              )}
            </button>

            {/* 6. Smart Resume Action Dropdown */}
            <div className="hidden sm:block">
              <ResumeDropdown soundEnabled={soundEnabled} />
            </div>

            {/* 7. Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = !mobileMenuOpen;
                setMobileMenuOpen(next);
                if (next) {
                  setIsExploreOpen(false);
                  setIsRoleBarOpen(false);
                  if (isRibbonOpen) setIsRibbonOpen(false);
                  if (isSearchOpen) setIsSearchOpen(false);
                }
              }}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-xl md:hidden text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* R3: 2.5px Micro Gradient Scroll Progress Bar along bottom edge */}
          <ScrollProgressBar />
        </div>

        {/* Floating Secondary Horizontal Sub-Bar for Detailed Role Selection */}
        {isRoleBarOpen && (
          <RoleTabsBar
            variant="floating-bar"
            activeRole={activeRole}
            onSelectRole={(role) => {
              if (onSelectRole) onSelectRole(role);
              setIsRoleBarOpen(false);
              avatarButtonRef.current?.focus();
            }}
            onClose={() => {
              setIsRoleBarOpen(false);
              if (soundEnabled) soundFX.playRibbonToggle(false);
              avatarButtonRef.current?.focus();
            }}
            soundEnabled={soundEnabled}
            className="max-w-7xl"
          />
        )}

        {/* Floating Secondary Horizontal Sub-Bar for Explore (Gallery & Lab) */}
        {isExploreOpen && (
          <ExploreSubBar
            variant="floating-bar"
            isOpen={isExploreOpen}
            onClose={() => {
              setIsExploreOpen(false);
              if (soundEnabled) soundFX.playRibbonToggle(false);
            }}
            soundEnabled={soundEnabled}
          />
        )}

        {/* Expandable Cursor Selector Ribbon with Smooth Animation (Desktop & Fine Pointer Only) */}
        {isDesktopCursor && isRibbonOpen && (
          <div className="desktop-cursor-only mt-2.5 max-w-7xl mx-auto animate-in fade-in slide-in-from-top-2 duration-200 transition-all">
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
              className="max-w-7xl"
            />
          </div>
        )}

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 max-w-7xl mx-auto bg-[#FAF8F5]/98 dark:bg-[#161122]/98 backdrop-blur-xl rounded-2xl border border-[#E7E2D8] dark:border-[#2D2340] p-4 shadow-xl flex flex-col gap-2.5 animate-in slide-in-from-top-2">
            {/* 1. Mobile Career Track Switcher Card */}
            <RoleTabsBar
              variant="drawer"
              activeRole={activeRole}
              onSelectRole={(role) => {
                if (onSelectRole) onSelectRole(role);
              }}
              soundEnabled={soundEnabled}
              className="mb-1"
            />

            {/* 2. Mobile In-Drawer Search Launchpad */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsSearchOpen(true);
                if (soundEnabled) soundFX.playFocusBeep();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-[#E7E2D8] dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:text-[#18181B] dark:hover:text-white shadow-2xs font-medium text-xs transition-colors mb-1 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#FF4D6D]" />
                <span>Search portfolio...</span>
              </span>
              <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-stone-500 dark:text-stone-400 bg-[#F0EBE1] dark:bg-stone-900 border border-[#E5DFD5] dark:border-stone-700 rounded shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* 3. Mobile Explore Showcase & Lab Quick-Jump Card */}
            <ExploreSubBar
              variant="drawer-card"
              onClose={() => setMobileMenuOpen(false)}
              soundEnabled={soundEnabled}
            />

            {/* Theme Toggle in Mobile Drawer */}
            <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white dark:bg-stone-800 border border-[#E7E2D8] dark:border-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold">
              <span className="flex items-center gap-2">
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-stone-600 dark:text-stone-300" />
                )}
                <span>Theme Mode</span>
              </span>
              <button
                type="button"
                onClick={toggleTheme}
                className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-[11px] font-mono text-stone-700 dark:text-stone-200 font-bold transition-colors cursor-pointer"
              >
                {isDark ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
              </button>
            </div>

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
                      ? 'bg-white dark:bg-stone-800 text-[#FF4D6D] font-bold shadow-2xs'
                      : 'text-stone-700 dark:text-stone-300 hover:text-[#FF4D6D] dark:hover:text-[#FF4D6D] hover:bg-stone-100 dark:hover:bg-stone-800/60'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />}
                </a>
              );
            })}

            {/* Mobile Resume Actions */}
            <div className="pt-2 mt-1 border-t border-[#E7E2D8] dark:border-stone-800 flex flex-col gap-1.5">
              <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-1 select-none">
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
        activeRole={activeRole}
        onSelectRole={onSelectRole}
        isDesktopCursor={isDesktopCursor}
      />
    </>
  );
}
