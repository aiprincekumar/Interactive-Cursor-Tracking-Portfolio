import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Volume2, VolumeX, Menu, X, Search, LayoutGrid, Sun, Moon, Eye, Languages, Calculator, Filter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useSimpleMode } from '../context/SimpleModeContext.jsx';
import { soundFX } from '../utils/audio';
import { CURSOR_LIST } from '../utils/cursorConstants';
import CursorSelectorRibbon from './CursorSelectorRibbon';
import CursorIcon from './CursorIcon';
import { lazyWithRetry } from '../utils/lazyWithRetry';
import NavbarTooltip from './NavbarTooltip';
// import CommandPalette from './CommandPalette';
const CommandPalette = lazyWithRetry(() => import('./CommandPalette'), 'CommandPalette');
import ResumeDropdown from './ResumeDropdown';

const NAV_SUBTEXTS = {
  en: {
    hero: 'Jump to top & hero showcase',
    about: 'Background, education & story',
    skills: 'Accounting, ERP & software tools',
    experience: 'Career milestones & track record',
    projects: 'Flagship projects & live work',
    achievements: 'Certifications & recognitions',
    testimonials: 'Client reviews & recommendations',
    gallery: 'Camera roll & moments',
    playground: 'Interactive playground & tools',
    faq: 'Frequently asked questions',
    contact: 'Get in touch & instant quote'
  },
  hi: {
    hero: 'शीर्ष और हीरो परिचय',
    about: 'पृष्ठभूमि और शिक्षा',
    skills: 'अकाउंटिंग व तकनीकी कौशल',
    experience: 'कार्य अनुभव व उपलब्धियां',
    projects: 'प्रमुख प्रोजेक्ट्स व केस स्टडीज',
    achievements: 'प्रमाणपत्र व सम्मान',
    testimonials: 'प्रशंसापत्र व समीक्षाएं',
    gallery: 'कैमरा रोल व मोमेंट्स',
    playground: 'इंटरैक्टिव प्लेग्राउंड व टूल्स',
    faq: 'अक्सर पूछे जाने वाले सवाल',
    contact: 'संपर्क करें और कोटेशन पाएं'
  }
};
import ScrollProgressBar from './ScrollProgressBar';
import RoleTabsBar from './RoleTabsBar';
import ExploreSubBar from './ExploreSubBar';
import AudienceSubBar from './AudienceSubBar';
import ViewModeSubBar from './ViewModeSubBar';
import { useAudience } from '../context/AudienceContext';
import { useViewMode } from '../context/ViewModeContext';
import { useRoleTab, ROLE_DATA, DEFAULT_ROLE } from '../context/RoleContext';
import { useDesktopCursorSupport } from '../hooks/useDesktopCursorSupport';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useTheme } from '../context/ThemeContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { TESTIMONIALS_CONFIG } from '../data/testimonialsConfig';
import { useAnnounce } from '../context/AnnouncerContext';

export const NAV_SECTION_IDS = [
  'hero',
  'about',
  'skills',
  'experience',
  'projects',
  'achievements',
  'testimonials',
  'faq',
  'contact'
];

export function IndiaFlag({ className = "w-[18px] h-[18px]", ...props }) {
  return (
    <svg
      viewBox="0 0 30 30"
      className={`${className} shrink-0 rounded-full shadow-2xs`}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <clipPath id="in-flag-circle">
          <circle cx="15" cy="15" r="15" />
        </clipPath>
      </defs>
      <g clipPath="url(#in-flag-circle)">
        <rect x="0" y="0" width="30" height="10" fill="#FF9933" />
        <rect x="0" y="10" width="30" height="10" fill="#FFFFFF" />
        <rect x="0" y="20" width="30" height="10" fill="#138808" />
        <circle cx="15" cy="15" r="3.8" fill="none" stroke="#000080" strokeWidth="0.75" />
        <circle cx="15" cy="15" r="0.8" fill="#000080" />
        {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1="15"
              y1="15"
              x2={Number((15 + 3.8 * Math.cos(rad)).toFixed(2))}
              y2={Number((15 + 3.8 * Math.sin(rad)).toFixed(2))}
              stroke="#000080"
              strokeWidth="0.35"
            />
          );
        })}
      </g>
    </svg>
  );
}

export function UkFlag({ className = "w-[18px] h-[18px]", ...props }) {
  return (
    <svg
      viewBox="0 0 30 30"
      className={`${className} shrink-0 rounded-full shadow-2xs`}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <clipPath id="uk-flag-circle">
          <circle cx="15" cy="15" r="15" />
        </clipPath>
        <clipPath id="uk-flag-diag">
          <path d="M0,0 L15,15 H0 z M0,30 L15,15 V30 z M30,30 L15,15 H30 z M30,0 L15,15 V0 z" />
        </clipPath>
      </defs>
      <g clipPath="url(#uk-flag-circle)">
        <rect width="30" height="30" fill="#012169" />
        <path d="M-2,-2 L32,32 M32,-2 L-2,32" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="square" />
        <path d="M-2,-2 L32,32 M32,-2 L-2,32" stroke="#C8102E" strokeWidth="1.8" strokeLinecap="square" clipPath="url(#uk-flag-diag)" />
        <path d="M15,-2 V32 M-2,15 H32" stroke="#FFFFFF" strokeWidth="8" />
        <path d="M15,-2 V32 M-2,15 H32" stroke="#C8102E" strokeWidth="5" />
      </g>
    </svg>
  );
}

export default function Navbar({
  soundEnabled,
  setSoundEnabled,
  activeCursor = 'butterfly',
  onSelectCursor,
  activeRole: propActiveRole,
  onSelectRole: propOnSelectRole,
  isTerminalOpen = false,
  onOpenTerminal,
  onToggleTerminal
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
  const mobileMenuButtonRef = useRef(null);

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
  useBodyScrollLock(mobileMenuOpen);

  const mobileDrawerRef = useRef(null);
  const hamburgerButtonRef = useRef(null);

  // Focus trap for mobile navigation drawer
  useFocusTrap(mobileMenuOpen, mobileDrawerRef, {
    onEscape: () => setMobileMenuOpen(false),
    restoreFocus: true
  });
  let languageContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    languageContext = useLanguage();
  } catch {
    // In case Navbar is mounted outside LanguageProvider
  }
  const language = languageContext?.language ?? 'en';
  const isHindi = languageContext?.isHindi ?? (language === 'hi');
  const toggleLanguage = languageContext?.toggleLanguage ?? (() => {});
  const t = languageContext?.t ?? ((key, fallback) => fallback || key);

  const navLinks = React.useMemo(() => [
    { label: t('nav.home', 'Home'), href: '#hero', id: 'hero' },
    { label: t('nav.about', 'About'), href: '#about', id: 'about' },
    { label: t('nav.skills', 'Skills'), href: '#skills', id: 'skills' },
    { label: t('nav.experience', 'Experience'), href: '#experience', id: 'experience' },
    { label: t('nav.projects', 'Projects'), href: '#projects', id: 'projects' },
    { label: t('nav.achievements', 'Achievements'), href: '#achievements', id: 'achievements' },
    ...(TESTIMONIALS_CONFIG?.enabled ? [{
      label: t('nav.testimonials', 'Testimonials'),
      href: `#${TESTIMONIALS_CONFIG.sectionId || 'testimonials'}`,
      id: TESTIMONIALS_CONFIG.sectionId || 'testimonials'
    }] : []),
    { label: t('nav.faq', 'FAQ'), href: '#faq', id: 'faq' },
    { label: t('nav.contact', 'Contact'), href: '#contact', id: 'contact' }
  ], [t]);



  let simpleContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    simpleContext = useSimpleMode();
  } catch {
    // In case Navbar is mounted outside SimpleModeProvider
  }
  const isSimpleMode = simpleContext?.isSimpleMode ?? false;
  const toggleSimpleMode = simpleContext?.toggleSimpleMode ?? (() => {});

  let audienceContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    audienceContext = useAudience();
  } catch {
    // In case Navbar is mounted outside AudienceProvider
  }
  const audience = audienceContext?.audience ?? 'all';
  const isFilterActive = audienceContext?.isFilterActive ?? (audience !== 'all');
  const activeAudienceData = audienceContext?.activeModeData;

  let viewModeContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    viewModeContext = useViewMode();
  } catch {
    // In case Navbar is mounted outside ViewModeProvider
  }
  const viewMode = viewModeContext?.viewMode ?? 'modern';
  const activeViewModeData = viewModeContext?.activeModeData;
  const isViewModeModified = viewMode !== 'modern';

  // Unified active state for all horizontal sub-bars enforcing strict mutual exclusivity
  const [activeSubBar, setActiveSubBar] = useState(null); // 'role' | 'explore' | 'audience' | 'viewmode' | 'cursor' | null

  const isRoleBarOpen = activeSubBar === 'role';
  const isExploreOpen = activeSubBar === 'explore';
  const isAudienceOpen = activeSubBar === 'audience';
  const isViewModeOpen = activeSubBar === 'viewmode';
  const isRibbonOpen = activeSubBar === 'cursor';

  const setIsRoleBarOpen = (valOrFn) => {
    setActiveSubBar((prev) => {
      const prevVal = prev === 'role';
      const nextVal = typeof valOrFn === 'function' ? valOrFn(prevVal) : valOrFn;
      return nextVal ? 'role' : (prev === 'role' ? null : prev);
    });
  };

  const setIsExploreOpen = (valOrFn) => {
    setActiveSubBar((prev) => {
      const prevVal = prev === 'explore';
      const nextVal = typeof valOrFn === 'function' ? valOrFn(prevVal) : valOrFn;
      return nextVal ? 'explore' : (prev === 'explore' ? null : prev);
    });
  };

  const setIsAudienceOpen = (valOrFn) => {
    setActiveSubBar((prev) => {
      const prevVal = prev === 'audience';
      const nextVal = typeof valOrFn === 'function' ? valOrFn(prevVal) : valOrFn;
      return nextVal ? 'audience' : (prev === 'audience' ? null : prev);
    });
  };

  const setIsViewModeOpen = (valOrFn) => {
    setActiveSubBar((prev) => {
      const prevVal = prev === 'viewmode';
      const nextVal = typeof valOrFn === 'function' ? valOrFn(prevVal) : valOrFn;
      return nextVal ? 'viewmode' : (prev === 'viewmode' ? null : prev);
    });
  };

  const setIsRibbonOpen = (valOrFn) => {
    setActiveSubBar((prev) => {
      const prevVal = prev === 'cursor';
      const nextVal = typeof valOrFn === 'function' ? valOrFn(prevVal) : valOrFn;
      return nextVal ? 'cursor' : (prev === 'cursor' ? null : prev);
    });
  };

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
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window === 'undefined') return 'hero';
    try {
      const autoScrollEnabled =
        localStorage.getItem('portfolio_auto_scroll_on_refresh') !== 'false' &&
        sessionStorage.getItem('portfolio_auto_scroll_on_refresh') !== 'false';

      if (autoScrollEnabled) {
        // 1. Check window.location.hash
        const hash = window.location.hash.replace(/^#/, '').trim();
        if (hash && NAV_SECTION_IDS.includes(hash)) {
          return hash;
        }

        // 2. Check sessionStorage portfolio_last_active_section
        const sessActive = sessionStorage.getItem('portfolio_last_active_section');
        if (sessActive && NAV_SECTION_IDS.includes(sessActive)) {
          return sessActive;
        }

        // 3. Check localStorage portfolio_last_active_section
        const localActive = localStorage.getItem('portfolio_last_active_section');
        if (localActive && NAV_SECTION_IDS.includes(localActive)) {
          return localActive;
        }

        // 4. Check portfolio_last_url in localStorage
        const rawLastUrl = localStorage.getItem('portfolio_last_url');
        if (rawLastUrl) {
          try {
            const parsed = JSON.parse(rawLastUrl);
            const targetUrl = (parsed?.url || '').replace(/^#/, '').trim();
            if (targetUrl && NAV_SECTION_IDS.includes(targetUrl)) {
              return targetUrl;
            }
          } catch {}
        }
      }
    } catch {}
    return 'hero';
  });

  // Synchronize active section when URL hash or restored state changes
  useEffect(() => {
    const syncActiveFromUrlOrRestored = () => {
      try {
        const autoScrollEnabled =
          localStorage.getItem('portfolio_auto_scroll_on_refresh') !== 'false' &&
          sessionStorage.getItem('portfolio_auto_scroll_on_refresh') !== 'false';
        if (!autoScrollEnabled) return;

        const hash = window.location.hash.replace(/^#/, '').trim();
        const sessActive = sessionStorage.getItem('portfolio_last_active_section');
        const localActive = localStorage.getItem('portfolio_last_active_section');
        const target = (hash && NAV_SECTION_IDS.includes(hash))
          ? hash
          : (sessActive && NAV_SECTION_IDS.includes(sessActive))
          ? sessActive
          : (localActive && NAV_SECTION_IDS.includes(localActive))
          ? localActive
          : null;

        if (target && navLinks.some((l) => l.id === target)) {
          setActiveSection(target);
        }
      } catch {}
    };

    window.addEventListener('hashchange', syncActiveFromUrlOrRestored);
    window.addEventListener('popstate', syncActiveFromUrlOrRestored);
    return () => {
      window.removeEventListener('hashchange', syncActiveFromUrlOrRestored);
      window.removeEventListener('popstate', syncActiveFromUrlOrRestored);
    };
  }, [navLinks]);
  const navContainerRef = useRef(null);
  const isDesktopCursor = useDesktopCursorSupport();

  // Auto-close cursor ribbon if screen drops below 1024px or enters touch mode
  useEffect(() => {
    if (!isDesktopCursor && activeSubBar === 'cursor') {
      setActiveSubBar(null);
    }
  }, [isDesktopCursor, activeSubBar]);

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

  const { announce } = useAnnounce();
  const isClickNavigatingRef = useRef(false);
  const clickNavTimeoutRef = useRef(null);
  const prevActiveSectionRef = useRef(activeSection);
  const isFirstMountRef = useRef(true);

  // Clear click navigation timeout on unmount
  useEffect(() => {
    return () => {
      if (clickNavTimeoutRef.current) {
        clearTimeout(clickNavTimeoutRef.current);
      }
    };
  }, []);

  const toggleRoleBar = () => {
    setIsRoleBarOpen((prev) => {
      const next = !prev;
      if (next) {
        setIsExploreOpen(false);
        setIsRibbonOpen(false);
        setMobileMenuOpen(false);
        setIsSearchOpen(false);
        setIsAudienceOpen(false);
        setIsViewModeOpen(false);
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
      setIsAudienceOpen(false);
      setIsViewModeOpen(false);
      setIsRibbonOpen(false);
      setMobileMenuOpen(false);
      if (isSearchOpen) setIsSearchOpen(false);
    }
    if (soundEnabled) soundFX.playRibbonToggle(next);
  };

  const toggleAudienceBar = () => {
    const next = !isAudienceOpen;
    setIsAudienceOpen(next);
    if (next) {
      setIsRoleBarOpen(false);
      setIsExploreOpen(false);
      setIsViewModeOpen(false);
      setIsRibbonOpen(false);
      setMobileMenuOpen(false);
      if (isSearchOpen) setIsSearchOpen(false);
    }
    if (soundEnabled) soundFX.playRibbonToggle(next);
  };

  const toggleViewModeBar = () => {
    const next = !isViewModeOpen;
    setIsViewModeOpen(next);
    if (next) {
      setIsRoleBarOpen(false);
      setIsExploreOpen(false);
      setIsAudienceOpen(false);
      setIsRibbonOpen(false);
      setMobileMenuOpen(false);
      if (isSearchOpen) setIsSearchOpen(false);
    }
    if (soundEnabled) soundFX.playRibbonToggle(next);
  };

  const toggleCursorRibbon = () => {
    if (!isDesktopCursor) return;
    const next = !isRibbonOpen;
    setIsRibbonOpen(next);
    if (next) {
      setIsRoleBarOpen(false);
      setIsExploreOpen(false);
      setIsAudienceOpen(false);
      setIsViewModeOpen(false);
      setMobileMenuOpen(false);
      if (isSearchOpen) setIsSearchOpen(false);
    }
    soundFX.playRibbonToggle(next);
  };

  const handleToggleLanguage = () => {
    toggleLanguage();
    if (soundEnabled) soundFX.playFocusBeep();
    if (announce) {
      announce(
        isHindi
          ? 'Language switched to English • भाषा अंग्रेजी में बदली गई'
          : 'Language switched to Hindi • भाषा हिंदी में बदल दी गई',
        'polite'
      );
    }
  };



  const handleNavClick = (sectionId, sectionLabel) => {
    isClickNavigatingRef.current = true;
    if (clickNavTimeoutRef.current) clearTimeout(clickNavTimeoutRef.current);
    clickNavTimeoutRef.current = setTimeout(() => {
      isClickNavigatingRef.current = false;
      clickNavTimeoutRef.current = null;
    }, 1400);

    setActiveSection(sectionId);
    setActiveSubBar(null);
    try {
      if (typeof window !== 'undefined') {
        const url = (!sectionId || sectionId === 'hero') ? '#hero' : '#' + sectionId;
        if (window.localStorage) {
          localStorage.setItem('portfolio_last_url', JSON.stringify({
            url,
            timestamp: Date.now()
          }));
        }
        if (window.sessionStorage) {
          sessionStorage.setItem('portfolio_last_active_section', sectionId);
        }
      }
    } catch {
      // Ignore storage errors
    }
    if (soundEnabled) soundFX.playFocusBeep();
    if (announce) {
      announce(`Navigating to ${sectionLabel} section`, 'polite');
    }
  };

  const handleMobileNavClick = (sectionId, sectionLabel) => {
    isClickNavigatingRef.current = true;
    if (clickNavTimeoutRef.current) clearTimeout(clickNavTimeoutRef.current);
    clickNavTimeoutRef.current = setTimeout(() => {
      isClickNavigatingRef.current = false;
      clickNavTimeoutRef.current = null;
    }, 1400);

    setActiveSection(sectionId);
    setActiveSubBar(null);
    setMobileMenuOpen(false);
    try {
      if (typeof window !== 'undefined') {
        const url = (!sectionId || sectionId === 'hero') ? '#hero' : '#' + sectionId;
        if (window.localStorage) {
          localStorage.setItem('portfolio_last_url', JSON.stringify({
            url,
            timestamp: Date.now()
          }));
        }
        if (window.sessionStorage) {
          sessionStorage.setItem('portfolio_last_active_section', sectionId);
        }
      }
    } catch {
      // Ignore storage errors
    }
    if (soundEnabled) soundFX.playFocusBeep();
    if (announce) {
      announce(`Navigating to ${sectionLabel} section`, 'polite');
    }
  };

  const handleOpenEstimator = () => {
    handleNavClick('contact', 'Contact');
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    window.dispatchEvent(new CustomEvent('portfolio:switch-contact-tab', { detail: { tab: 'quote' } }));
  };

  useEffect(() => {
    const handleOpenEstimatorEvent = () => {
      handleOpenEstimator();
    };
    window.addEventListener('portfolio:open-estimator', handleOpenEstimatorEvent);
    return () => window.removeEventListener('portfolio:open-estimator', handleOpenEstimatorEvent);
  }, []);

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K (Disabled in Simple Mode)
  useEffect(() => {
    if (isSimpleMode) return;
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => {
          const next = !prev;
          if (next) {
            setIsRoleBarOpen(false);
            setIsExploreOpen(false);
            setIsAudienceOpen(false);
            setIsViewModeOpen(false);
            setIsRibbonOpen(false);
            setActiveSubBar(null);
            setMobileMenuOpen(false);
            if (soundEnabled) soundFX.playFocusBeep();
          }
          return next;
        });
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        if (soundEnabled && soundFX?.playSparkle) soundFX.playSparkle();
        window.dispatchEvent(new CustomEvent('portfolio:open-ai-chat'));
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isSimpleMode, soundEnabled]);

  // Auto-close open sub-bars when entering simple mode
  useEffect(() => {
    if (isSimpleMode) {
      setIsSearchOpen(false);
      setActiveSubBar(null);
    }
  }, [isSimpleMode]);

  // Outside click & Escape listener for any open horizontal sub-bar & mobile menu
  useEffect(() => {
    if (!activeSubBar && !mobileMenuOpen) return;

    const handleClickOutside = (event) => {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target)) {
        if (activeSubBar) {
          if (soundEnabled) soundFX.playRibbonToggle(false);
          setActiveSubBar(null);
        }
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
          mobileMenuButtonRef.current?.focus();
        }
        if (isRoleBarOpen) {
          setIsRoleBarOpen(false);
          if (soundEnabled) soundFX.playRibbonToggle(false);
          avatarButtonRef.current?.focus();
        }
        if (isRibbonOpen) {
          setIsRibbonOpen(false);
          soundFX.playRibbonToggle(false);
        }
        if (isExploreOpen) {
          setIsExploreOpen(false);
          if (soundEnabled) soundFX.playRibbonToggle(false);
        }
        if (isAudienceOpen) {
          setIsAudienceOpen(false);
          if (soundEnabled) soundFX.playRibbonToggle(false);
        }
        if (isViewModeOpen) {
          setIsViewModeOpen(false);
          if (soundEnabled) soundFX.playRibbonToggle(false);
        }
        if (activeSubBar) {
          setActiveSubBar(null);
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
  }, [activeSubBar, mobileMenuOpen, soundEnabled]);

  // ScrollSpy observer to highlight active section in Navbar without forced synchronous reflow
  useEffect(() => {
    const sectionIds = [
      'hero',
      'about',
      'skills',
      'experience',
      'projects',
      'achievements',
      ...(TESTIMONIALS_CONFIG?.enabled ? [TESTIMONIALS_CONFIG.sectionId || 'testimonials'] : []),
      'faq',
      'contact'
    ];

    let ticking = false;
    let cachedElements = null;
    let rafId = null;
    let lastScanTime = 0;
    const intersectingMap = new Map();
    const observedElements = new Set();

    const isElementConnected = (el) => {
      if (!el) return false;
      if (typeof el.isConnected === 'boolean') return el.isConnected;
      if (typeof document !== 'undefined' && document.body) return document.body.contains(el);
      return true;
    };

    const isSkeletonElement = (el) => {
      if (!el) return false;
      return (
        el.getAttribute?.('role') === 'status' ||
        el.getAttribute?.('aria-busy') === 'true' ||
        el.classList?.contains('animate-pulse') ||
        Boolean(el.querySelector && el.querySelector('[role="status"], [aria-busy="true"], .animate-pulse'))
      );
    };

    const getCachedElements = () => {
      const now = Date.now();
      const hasDetachedElements = cachedElements && cachedElements.some((item) => !isElementConnected(item.el));
      // Re-scan if elements haven't been cached, have detached nodes, or if lazy-loaded sections haven't all mounted yet (throttled to 250ms during scrolling)
      if (!cachedElements || hasDetachedElements || (cachedElements.length < sectionIds.length && now - lastScanTime > 250)) {
        lastScanTime = now;
        cachedElements = sectionIds
          .map((id) => ({ id, el: document.getElementById(id) }))
          .filter((item) => item.el !== null && isElementConnected(item.el));
      }
      return cachedElements;
    };

    const handleResize = () => {
      cachedElements = null;
    };

    const updateActiveSection = () => {
      // Guard: If navigation was triggered by a user click, lock the selection strictly until scroll arrives
      if (isClickNavigatingRef.current) {
        ticking = false;
        return;
      }

      // Filter/prune detached entries from intersectingMap so stale skeleton entries do not linger
      for (const [id, entry] of intersectingMap.entries()) {
        if (!entry.target || !isElementConnected(entry.target)) {
          intersectingMap.delete(id);
        }
      }

      const scrollY = window.scrollY || window.pageYOffset || 0;
      if (scrollY < 50) {
        setActiveSection((prev) => (prev !== 'hero' ? 'hero' : prev));
        ticking = false;
        return;
      }

      // Refine bottom / Contact detection: scrolled near bottom or contact element in viewport
      const contactEl = document.getElementById('contact');
      const isNearBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 180;
      const isContactInView = Boolean(
        contactEl &&
        isElementConnected(contactEl) &&
        contactEl.getBoundingClientRect().top <= window.innerHeight * 0.75 &&
        contactEl.getBoundingClientRect().bottom > 0
      );

      if (isNearBottom || isContactInView) {
        setActiveSection((prev) => (prev !== 'contact' ? 'contact' : prev));
        ticking = false;
        return;
      }

      let current = null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && isElementConnected(el)) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom > 100) {
            current = id;
          }
        }
      }

      if (current) {
        const isNavSection = navLinks.some((link) => link.id === current);
        if (isNavSection) {
          setActiveSection((prev) => (prev !== current ? current : prev));
        }
      }
      ticking = false;
    };

    const releaseClickLock = () => {
      if (isClickNavigatingRef.current) {
        isClickNavigatingRef.current = false;
        if (clickNavTimeoutRef.current) {
          clearTimeout(clickNavTimeoutRef.current);
          clickNavTimeoutRef.current = null;
        }
        updateActiveSection();
      }
    };

    const handleManualScrollInterrupt = () => {
      if (isClickNavigatingRef.current) {
        releaseClickLock();
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersectingMap.set(entry.target.id, entry);
          } else {
            intersectingMap.delete(entry.target.id);
          }
        }
        updateActiveSection();
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1.0]
      }
    );

    const observeSections = () => {
      // Clean up stale/disconnected elements from observedElements and intersectingMap
      for (const el of observedElements) {
        if (!isElementConnected(el)) {
          try {
            observer.unobserve(el);
          } catch {}
          observedElements.delete(el);
          if (el.id) {
            intersectingMap.delete(el.id);
          }
        }
      }

      cachedElements = null;
      const elements = getCachedElements();
      for (const { el } of elements) {
        if (!observedElements.has(el)) {
          observer.observe(el);
          observedElements.add(el);
        }
      }
      updateActiveSection();
    };

    // Lightweight scroll listener strictly for extreme top/bottom edges without element reflow
    const handleScroll = () => {
      if (isClickNavigatingRef.current) return;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      if (scrollY < 50 || window.innerHeight + scrollY >= document.documentElement.scrollHeight - 180) {
        if (!ticking) {
          ticking = true;
          rafId = window.requestAnimationFrame(updateActiveSection);
        }
      }
    };

    observeSections();
    // Schedule staggered updates to discover sections as React Suspense finishes mounting them
    const timer1 = setTimeout(updateActiveSection ? () => observeSections() : updateActiveSection, 400);
    const timer2 = setTimeout(updateActiveSection ? () => observeSections() : updateActiveSection, 1200);
    const timer3 = setTimeout(() => observeSections(), 2500);

    let mutationObserver = null;
    if (typeof MutationObserver !== 'undefined' && document.body) {
      mutationObserver = new MutationObserver(() => {
        observeSections();
        const allRealSectionsMounted = sectionIds.every((id) => {
          const el = document.getElementById(id);
          return el && isElementConnected(el) && !isSkeletonElement(el);
        });
        if (allRealSectionsMounted) {
          mutationObserver.disconnect();
          mutationObserver = null;
        }
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    const handleScrollRestorationSettle = (e) => {
      const targetId = e?.detail?.target || e?.detail?.section;
      if (!targetId || targetId === 'hero') {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        if (scrollY < 80) {
          setActiveSection('hero');
          return;
        }
      }
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el && isElementConnected(el)) {
          const rect = el.getBoundingClientRect();
          const inView = rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0;
          if (inView) {
            const isNavSection = navLinks.some((link) => link.id === targetId);
            if (isNavSection) {
              setActiveSection(targetId);
              return;
            }
          }
        }
        updateActiveSection();
      }
    };

    window.addEventListener('portfolio:scroll-restoration-settle', handleScrollRestorationSettle);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scrollend', releaseClickLock, { passive: true });
    window.addEventListener('wheel', handleManualScrollInterrupt, { passive: true });
    window.addEventListener('touchstart', handleManualScrollInterrupt, { passive: true });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      observer.disconnect();
      if (mutationObserver) {
        mutationObserver.disconnect();
        mutationObserver = null;
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scrollend', releaseClickLock);
      window.removeEventListener('wheel', handleManualScrollInterrupt);
      window.removeEventListener('touchstart', handleManualScrollInterrupt);
      window.removeEventListener('portfolio:scroll-restoration-settle', handleScrollRestorationSettle);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [navLinks]);

  // Announce active section change during user scrolling (guarded against initial render and click navigation)
  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      prevActiveSectionRef.current = activeSection;
      return;
    }

    if (prevActiveSectionRef.current !== activeSection) {
      prevActiveSectionRef.current = activeSection;
      if (!isClickNavigatingRef.current) {
        const matchingLink = navLinks.find((l) => l.id === activeSection);
        const sectionLabel = matchingLink?.label || (activeSection.charAt(0).toUpperCase() + activeSection.slice(1));
        if (announce) {
          announce(`Navigated to ${sectionLabel}`, 'polite');
        }
      }
    }
  }, [activeSection, announce, navLinks]);

  return (
    <>
      {mobileMenuOpen && (
        <div
          role="button"
          tabIndex={-1}
          aria-label="Close navigation menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs md:hidden z-30 transition-opacity duration-200"
        />
      )}
      <header ref={navContainerRef} className="fixed top-0 left-0 right-0 z-40 px-2 sm:px-3 md:px-8 py-3.5">
        <div className="relative max-w-7xl mx-auto bg-[#FAF8F5]/90 dark:bg-[#161122]/90 backdrop-blur-md rounded-full border border-[#E7E2D8] dark:border-[#2D2340] px-2.5 sm:px-4 md:px-5 py-2 shadow-xs flex items-center justify-between transition-colors">
          {/* Brand Group: Universal Role Switcher Avatar Button + Atul Verma Home Link */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Universal Avatar Role-Switcher Trigger */}
            <NavbarTooltip
              title={isRoleBarOpen ? (isHindi ? 'बंद करें' : 'Close switcher') : `${activeTrack?.label || activeRole} Profile`}
              subtext={isHindi ? 'ट्रैक बदलें' : 'Switch track'}
              align="left"
            >
              <button
                ref={avatarButtonRef}
                type="button"
                onClick={toggleRoleBar}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (!isRoleBarOpen) toggleRoleBar();
                    requestAnimationFrame(() => {
                      const activeTabEl = document.getElementById(`floating-role-tab-${activeRole}`) || document.querySelector('[id^="floating-role-tab-"]');
                      activeTabEl?.focus();
                    });
                  }
                }}
                onMouseEnter={() => { if (soundEnabled) soundFX.playChipHover(); }}
                aria-label={isRoleBarOpen ? 'Close career track switcher' : 'Switch career track'}
                aria-expanded={isRoleBarOpen}
                aria-haspopup="dialog"
                aria-controls="floating-career-track-bar"
                title={isRoleBarOpen ? 'Close career track switcher' : `${activeTrack?.label || activeRole} Profile • Atul Verma`}
                className={`relative w-8 h-8 rounded-full overflow-hidden border-2 bg-[#18181B] dark:bg-[#201830] flex items-center justify-center shrink-0 shadow-xs hover:scale-105 active:scale-95 transition-all duration-300 ease-out cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden ${isRoleBarOpen ? 'scale-105 ring-2 ring-[#FF4D6D]/40' : ''}`}
                style={{
                  borderColor: accentColor,
                  boxShadow: isRoleBarOpen ? `0 0 14px ${accentColor}80` : `0 0 10px ${accentColor}40`
                }}
              >
                {/* Fallback AV Monogram */}
                <div
                  className={`absolute inset-0 flex items-center justify-center text-white text-xs font-bold transition-opacity duration-300 ease-in-out ${imageLoaded && !imageError ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                  aria-hidden="true"
                >
                  <span className="font-mono text-[11px] text-[#FAF8F5] dark:text-[#F5F2F8]">AV</span>
                </div>

                {avatarSrc && !imageError && (
                  <img
                    ref={avatarImgRef}
                    key={avatarSrc}
                    src={avatarSrc}
                    alt={`${activeTrack?.label || activeRole} Profile • Atul Verma`}
                    className={`w-full h-full object-cover rounded-full transition-all duration-300 ease-out ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    loading="eager"
                    decoding="async"
                  />
                )}
              </button>
            </NavbarTooltip>

            {/* Brand Name Link navigating to #hero */}
            <NavbarTooltip title="Atul Verma" subtext={isHindi ? 'शीर्ष पर जाएं' : 'Scroll to top'} align="left">
              <a
                href="#hero"
                onClick={() => {
                  setActiveSection('hero');
                  setIsRoleBarOpen(false);
                  handleNavClick('hero', 'Home');
                }}
                className="hidden sm:block group cursor-pointer"
                title="Atul Verma"
                aria-label="Atul Verma"
              >
                <span className="font-extrabold text-[#18181B] dark:text-white text-xs lg:text-sm tracking-tight font-['Outfit',sans-serif] whitespace-nowrap group-hover:text-[#FF4D6D] dark:group-hover:text-[#FF4D6D] transition-colors">
                  Atul Verma
                </span>
              </a>
            </NavbarTooltip>
          </div>

          {/* Desktop Nav Links with ScrollSpy */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 bg-[#F0EBE1]/70 dark:bg-[#0B0813]/85 px-2 lg:px-3 py-1 rounded-full border border-[#E5DFD5] dark:border-[#2D2340]/80 shadow-xs" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <NavbarTooltip key={link.id} title={link.label} subtext={NAV_SUBTEXTS[language]?.[link.id]} align="center">
                  <a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    title={link.label}
                    onClick={() => {
                      setIsRoleBarOpen(false);
                      handleNavClick(link.id, link.label);
                    }}
                    className={`text-[11px] lg:text-xs font-semibold rounded-full px-2 lg:px-2.5 py-1 transition-all duration-200 select-none whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-white dark:bg-[#201830] text-[#18181B] dark:text-[#F5F2F8] shadow-xs font-bold scale-[1.02]'
                        : 'text-stone-600 dark:text-[#A99EBA] hover:text-[#18181B] dark:hover:text-[#F5F2F8] hover:bg-white/60 dark:hover:bg-[#201830]/60'
                    }`}
                  >
                    {link.label}
                  </a>
                </NavbarTooltip>
              );
            })}
          </nav>

          {/* Right Action Group - Order: [🔍 Search] -> [✨ Explore] -> [🦋 Cursor] -> [👁️ Simple] -> [🌓 Theme] -> [🔊 Sound] -> [📄 Resume] -> [☰ Menu] */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* 1. Global Search Trigger Button (Disabled in Simple Mode) */}
            {!isSimpleMode && (
              <NavbarTooltip
                title={isHindi ? 'पोर्टफोलियो खोजें' : 'Search Portfolio'}
                shortcut="⌘K"
                subtext={isHindi ? 'कौशल, प्रोजेक्ट्स व रोल्स तुरंत खोजें' : 'Quick jump to skills, projects & roles'}
                align="center"
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsRoleBarOpen(false);
                    setActiveSubBar(null);
                    if (mobileMenuOpen) setMobileMenuOpen(false);
                    if (soundEnabled) soundFX.playFocusBeep();
                  }}
                  data-testid="Search portfolio (Cmd+K)"
                  aria-label="Search"
                  aria-haspopup="dialog"
                  aria-expanded={isSearchOpen}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 hover:text-[#18181B] dark:hover:text-white border-[#E7E2D8] dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 shadow-2xs hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
                  title="Search portfolio (Cmd+K) / Ctrl+K"
                >
                  <Search className="w-4 h-4 transition-colors" />
                </button>
              </NavbarTooltip>
            )}

            {/* 2. Explore / Showcase & Lab SubBar Trigger Button (Disabled in Simple Mode) */}
            {!isSimpleMode && (
              <NavbarTooltip
                title={isExploreOpen ? (isHindi ? 'एक्सप्लोर बंद करें' : 'Close Explore') : (isHindi ? 'एक्सप्लोर और लैब' : 'Explore & Lab')}
                subtext={isHindi ? 'टर्मिनल सीएलआई, गैलरी और लैब' : 'Terminal CLI, gallery & interactive lab'}
                align="center"
              >
                <button
                  type="button"
                  onClick={toggleExploreBar}
                  aria-label={isExploreOpen ? 'Close Explore' : 'Explore'}
                  aria-expanded={isExploreOpen}
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer ${
                    isExploreOpen
                      ? 'bg-[#18181B] dark:bg-stone-100 text-white dark:text-stone-900 border-[#18181B] dark:border-white shadow-xs scale-105'
                      : 'bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 hover:text-[#18181B] dark:hover:text-white border-[#E7E2D8] dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 shadow-2xs hover:scale-105 active:scale-95'
                  }`}
                  title={isExploreOpen ? 'Close Explore' : 'Explore'}
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
              </NavbarTooltip>
            )}

            {/* 2b. Audience Filter SubBar Trigger Button */}
            <NavbarTooltip
              title={isAudienceOpen ? (isHindi ? 'ऑडियंस फ़िल्टर बंद करें' : 'Close Audience Filter') : (isHindi ? 'ऑडियंस व्यू' : 'Audience View')}
              subtext={`${activeAudienceData?.label || 'All'} • ${isHindi ? 'रिक्रूटर, क्लाइंट या सहकर्मियों अनुसार फ़िल्टर' : 'Tailor for Recruiters, Clients or Peers'}`}
              align="center"
            >
              <button
                type="button"
                onClick={toggleAudienceBar}
                aria-label={isAudienceOpen ? 'Close Audience Filter' : `Audience Filter (${activeAudienceData?.label || 'All'})`}
                aria-expanded={isAudienceOpen}
                className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer ${
                  isAudienceOpen
                    ? 'bg-[#18181B] dark:bg-stone-100 text-white dark:text-stone-900 border-[#18181B] dark:border-white shadow-xs scale-105'
                    : isFilterActive
                      ? 'bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 text-[#FF4D6D] border-[#FF4D6D]/40 shadow-xs'
                      : 'bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 hover:text-[#18181B] dark:hover:text-white border-[#E7E2D8] dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 shadow-2xs hover:scale-105 active:scale-95'
                }`}
                title={isAudienceOpen ? 'Close Audience Filter' : `Audience Filter: ${activeAudienceData?.label || 'All'}`}
              >
                <Filter
                  className="w-3.5 h-3.5 transition-transform duration-200"
                  style={{
                    color: isAudienceOpen
                      ? (isDark ? '#18181B' : '#FFFFFF')
                      : isFilterActive
                        ? '#FF4D6D'
                        : undefined
                  }}
                />
                {/* Subtle active indicator dot when audience !== 'all' */}
                {isFilterActive && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 pointer-events-none">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4D6D] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4D6D] ring-2 ring-white dark:ring-stone-900" />
                  </span>
                )}
              </button>
            </NavbarTooltip>

            {/* 2c. View Mode SubBar Trigger Button */}
            <NavbarTooltip
              title={isHindi ? 'व्यू मोड' : 'View Mode'}
              subtext={`${activeViewModeData?.label || 'Modern'} • ${isHindi ? 'स्टाइल बदलें' : 'Toggle view style'}`}
              align="center"
            >
              <button
                type="button"
                onClick={toggleViewModeBar}
                aria-label={isViewModeOpen ? 'Close View Mode' : `View Mode (${activeViewModeData?.label || 'Modern'})`}
                aria-expanded={isViewModeOpen}
                className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer ${isViewModeOpen ? 'bg-[#18181B] dark:bg-stone-100 text-white dark:text-stone-900 border-[#18181B] dark:border-white shadow-xs scale-105' : isViewModeModified ? 'bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 text-[#FF4D6D] border-[#FF4D6D]/40 shadow-xs' : 'bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 hover:text-[#18181B] dark:hover:text-white border-[#E7E2D8] dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 shadow-2xs hover:scale-105 active:scale-95'}`}
                title={isViewModeOpen ? 'Close View Mode' : `View Mode: ${activeViewModeData?.label || 'Modern'}`}
              >
                <Eye
                  className="w-3.5 h-3.5 transition-transform duration-200"
                  style={{
                    color: isViewModeOpen
                      ? (isDark ? '#18181B' : '#FFFFFF')
                      : isViewModeModified
                        ? '#FF4D6D'
                        : undefined
                  }}
                />
                {/* Subtle active indicator dot when mode !== 'modern' */}
                {isViewModeModified && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 pointer-events-none">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4D6D] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4D6D] ring-2 ring-white dark:ring-stone-900" />
                  </span>
                )}
              </button>
            </NavbarTooltip>

            {/* 3. Dynamic Cursor Variant Selector (Disabled in Simple Mode) */}
            {!isSimpleMode && isDesktopCursor && (
              <NavbarTooltip
                title={isRibbonOpen ? (isHindi ? 'कर्सर रिबन बंद करें' : 'Close Cursor Selector') : (isHindi ? 'कर्सर सुइट' : 'Cursor Suite')}
                subtext={`${activeCursorData.name} • ${isHindi ? '35 कर्सर शैलियों में से चुनें' : 'Switch dynamic 35-cursor suite'}`}
                align="center"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (!isDesktopCursor) return;
                    toggleCursorRibbon();
                  }}
                  aria-label={isRibbonOpen ? 'Close Cursor Selector' : `Cursor: ${activeCursorData.name}`}
                  aria-expanded={isRibbonOpen}
                  className={`desktop-cursor-only hidden lg:flex relative w-8 h-8 rounded-full items-center justify-center transition-all duration-200 border cursor-pointer ${
                    isRibbonOpen
                      ? 'bg-[#18181B] dark:bg-stone-100 text-white dark:text-stone-900 border-[#18181B] dark:border-white shadow-xs scale-105'
                      : 'bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 hover:text-[#18181B] dark:hover:text-white border-[#E7E2D8] dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 shadow-2xs hover:scale-105'
                  }`}
                  title={`Cursor: ${activeCursorData.name}`}
                >
                  <span className="text-sm leading-none select-none flex items-center justify-center" aria-label={activeCursorData.name}>
                    <CursorIcon cursorId={activeCursorData.id} size={15} />
                  </span>
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4D6D] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4D6D] ring-2 ring-white dark:ring-stone-900" />
                  </span>
                </button>
              </NavbarTooltip>
            )}

            {/* 4. Multilingual Language Switcher Icon Button */}
            <NavbarTooltip
              title={isHindi ? "Language / भाषा" : "भाषा / Language"}
              subtext={isHindi ? "English (UK) • Tap to switch to Hindi" : "हिंदी (भारत) • अंग्रेज़ी में बदलने के लिए टैप करें"}
              align="right"
            >
              <button
                type="button"
                onClick={handleToggleLanguage}
                aria-label={isHindi ? "Switch language to English" : "हिंदी में बदलें"}
                title={isHindi ? "Switch to English" : "हिंदी में बदलें"}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 hover:text-[#18181B] dark:hover:text-white border-[#E7E2D8] dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 shadow-2xs hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
              >
                {isHindi ? (
                  <IndiaFlag className="w-[18px] h-[18px]" />
                ) : (
                  <UkFlag className="w-[18px] h-[18px]" />
                )}
              </button>
            </NavbarTooltip>

            {/* 5. Theme Toggle Button (Light / Dark) */}
            <NavbarTooltip
              title={isHindi ? "थीम मोड" : "Theme Mode"}
              subtext={isDark ? (isHindi ? "लाइट मोड • डार्क थीम में बदलें ☀️" : "Light Mode • Switch to Light Theme ☀️") : (isHindi ? "डार्क मोड • डार्क थीम में बदलें 🌙" : "Dark Mode • Switch to Dark Theme 🌙")}
              align="right"
            >
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDark ? "Light mode" : "Dark mode"}
                title={isDark ? "Light mode" : "Dark mode"}
                className="group w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 hover:text-[#18181B] dark:hover:text-white border-[#E7E2D8] dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 shadow-2xs hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
                ) : (
                  <Moon className="w-4 h-4 text-stone-600 dark:text-stone-300 group-hover:-rotate-12 transition-transform duration-300" />
                )}
              </button>
            </NavbarTooltip>

            {/* 6. Audio Toggle Button (Hidden in Simple Mode) */}
            {!isSimpleMode && (
              <NavbarTooltip
                title={isHindi ? "परिवेशी संगीत" : "Ambient Audio"}
                subtext={soundEnabled ? (isHindi ? "परिवेशी संगीत • म्यूट करें 🔇" : "Ambient Audio • Mute sound effects 🔇") : (isHindi ? "परिवेशी संगीत • अनम्यूट करें 🔊" : "Ambient Audio • Unmute music & sound FX 🔊")}
                align="right"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                    }
                    const next = !soundEnabled;
                    setSoundEnabled(next);
                    soundFX.setEnabled(next);
                    if (next) soundFX.playSparkle();
                  }}
                  aria-label={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 hover:text-[#18181B] dark:hover:text-white border-[#E7E2D8] dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 shadow-2xs hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
                  title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-[#FF4D6D]" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-stone-400 dark:text-stone-500" />
                  )}
                </button>
              </NavbarTooltip>
            )}

            {/* 7. Smart Resume Action Dropdown */}
            <div className="hidden sm:block">
              <ResumeDropdown soundEnabled={soundEnabled} />
            </div>

            {/* 8. Mobile Menu Toggle */}
            <NavbarTooltip
              title={isHindi ? 'नेविगेशन मेनू' : 'Navigation Menu'}
              subtext={mobileMenuOpen ? (isHindi ? 'मेनू बंद करें' : 'Close navigation menu') : (isHindi ? 'मेनू खोलें' : 'Open mobile drawer')}
              align="right"
            >
              <button
                ref={hamburgerButtonRef}
                type="button"
                onClick={() => {
                  const next = !mobileMenuOpen;
                  setMobileMenuOpen(next);
                  if (next) {
                    setActiveSubBar(null);
                    if (isSearchOpen) setIsSearchOpen(false);
                  }
                }}
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                aria-expanded={mobileMenuOpen}
                className="p-2 rounded-xl md:hidden text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </NavbarTooltip>
          </div>

          {/* Isolated clipping container: preserves ResumeDropdown while perfectly clipping progress bar inside navbar capsule curvature */}
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-20">
            <ScrollProgressBar />
          </div>
        </div>

        {/* Floating Secondary Horizontal Sub-Bar for Detailed Role Selection */}
        {isRoleBarOpen && (
          <RoleTabsBar
            variant="floating-bar"
            activeRole={activeRole}
            onSelectRole={(role) => {
              if (onSelectRole) onSelectRole(role);
              setActiveSubBar(null);
              avatarButtonRef.current?.focus();
            }}
            onClose={() => {
              setActiveSubBar(null);
              if (soundEnabled) soundFX.playRibbonToggle(false);
              avatarButtonRef.current?.focus();
            }}
            soundEnabled={soundEnabled}
            className="max-w-7xl"
          />
        )}

        {/* Floating Secondary Horizontal Sub-Bar for Explore (Gallery & Lab - Hidden in Simple Mode) */}
        {!isSimpleMode && isExploreOpen && (
          <ExploreSubBar
            variant="floating-bar"
            isOpen={isExploreOpen}
            onClose={() => {
              setActiveSubBar(null);
              if (soundEnabled) soundFX.playRibbonToggle(false);
            }}
            soundEnabled={soundEnabled}
            onOpenTerminal={onOpenTerminal}
            onToggleTerminal={onToggleTerminal}
          />
        )}

        {/* Floating Secondary Horizontal Sub-Bar for Audience Filter */}
        {isAudienceOpen && (
          <AudienceSubBar
            variant="floating-bar"
            isOpen={isAudienceOpen}
            onClose={() => {
              setActiveSubBar(null);
              if (soundEnabled) soundFX.playRibbonToggle(false);
            }}
            soundEnabled={soundEnabled}
          />
        )}

        {/* Floating Secondary Horizontal Sub-Bar for View Mode */}
        {isViewModeOpen && (
          <ViewModeSubBar
            variant="floating-bar"
            isOpen={isViewModeOpen}
            onClose={() => {
              setActiveSubBar(null);
              if (soundEnabled) soundFX.playRibbonToggle(false);
            }}
            soundEnabled={soundEnabled}
          />
        )}

        {/* Expandable Cursor Selector Ribbon with Smooth Animation (Disabled in Simple Mode) */}
        {!isSimpleMode && isDesktopCursor && isRibbonOpen && (
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
                setActiveSubBar(null);
                soundFX.playRibbonToggle(false);
              }}
              className="max-w-7xl"
            />
          </div>
        )}

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div
            ref={mobileDrawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            className="md:hidden mt-2 max-w-7xl mx-auto bg-[#FAF8F5]/98 dark:bg-[#161122]/98 backdrop-blur-xl rounded-2xl border border-[#E7E2D8] dark:border-[#2D2340] p-4 shadow-xl flex flex-col gap-2.5 animate-in slide-in-from-top-2 max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain relative z-40 scroll-smooth"
          >
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

            {/* 2. Mobile In-Drawer Search Launchpad (Hidden in Simple Mode) */}
            {!isSimpleMode && (
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
            )}

            {/* 3. Mobile Explore Showcase & Lab Quick-Jump Card (Hidden in Simple Mode) */}
            {!isSimpleMode && (
              <ExploreSubBar
                variant="drawer-card"
                onClose={() => setMobileMenuOpen(false)}
                soundEnabled={soundEnabled}
                onOpenTerminal={onOpenTerminal}
                onToggleTerminal={onToggleTerminal}
              />
            )}

            {/* Mobile Audience View Filter Card */}
            <AudienceSubBar
              variant="drawer-card"
              onClose={() => setMobileMenuOpen(false)}
              soundEnabled={soundEnabled}
            />

            {/* Mobile View Mode Selection Card */}
            <ViewModeSubBar
              variant="drawer-card"
              onClose={() => setMobileMenuOpen(false)}
              soundEnabled={soundEnabled}
            />

            {/* Language Switcher in Mobile Drawer */}
            <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white dark:bg-stone-800 border border-[#E7E2D8] dark:border-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold">
              <span className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-[#FF4D6D]" />
                <span>{t('nav.language', 'Language')}</span>
              </span>
              <button
                type="button"
                onClick={handleToggleLanguage}
                aria-label={isHindi ? "Switch language to English" : "हिंदी में बदलें"}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-[11px] font-mono text-stone-700 dark:text-stone-200 font-bold transition-colors cursor-pointer"
              >
                {isHindi ? (
                  <>
                    <IndiaFlag className="w-3.5 h-3.5" />
                    <span>हिंदी (HI)</span>
                  </>
                ) : (
                  <>
                    <UkFlag className="w-3.5 h-3.5" />
                    <span>English (EN)</span>
                  </>
                )}
              </button>
            </div>

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
                  onClick={() => handleMobileNavClick(link.id, link.label)}
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
      <Suspense fallback={null}>
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
      </Suspense>
    </>
  );
}
