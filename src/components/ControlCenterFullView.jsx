import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import {
  ArrowLeft,
  Volume2,
  Sparkles,
  User,
  Box,
  Settings,
  Palette,
  ExternalLink,
  RotateCcw,
  Sliders,
  Check,
  ShieldCheck,
  Radio,
  Layers
} from 'lucide-react';
import { useLab } from '../context/LabContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import ControlCenterPanel from './ControlCenterPanel';
import { soundFX } from '../utils/audio';

export const VALID_TABS = ['audio', 'cursor', 'hero', 'threed', 'preferences', 'visuals'];

export const TAB_NORMALIZER = {
  audio: 'audio',
  sound: 'audio',
  cursor: 'cursor',
  dynamics: 'cursor',
  hero: 'hero',
  character: 'hero',
  avatar: 'hero',
  threed: 'threed',
  '3d': 'threed',
  spatial: 'threed',
  preferences: 'preferences',
  startup: 'preferences',
  settings: 'preferences',
  visuals: 'visuals',
  display: 'visuals',
  theme: 'visuals',
  displaybehavior: 'visuals',
  'display-behavior': 'visuals',
  'display_behavior': 'visuals',
  behavior: 'visuals'
};

export const TABS_CONFIG = [
  { id: 'audio', label: 'Audio Studio', icon: Volume2 },
  { id: 'cursor', label: 'Cursor Dynamics', icon: Sparkles },
  { id: 'hero', label: 'Hero Character', icon: User },
  { id: 'threed', label: '3D Spatial', icon: Box },
  { id: 'preferences', label: 'Preferences', icon: Settings },
  { id: 'visuals', label: 'Display & Visuals', icon: Palette }
];

export const TAB_LABELS = {
  en: {
    audio: 'Audio Studio',
    cursor: 'Cursor Dynamics',
    hero: 'Hero Character',
    threed: '3D Spatial',
    preferences: 'Preferences',
    visuals: 'Display & Visuals'
  },
  hi: {
    audio: 'ऑडियो स्टूडियो',
    cursor: 'कर्सर डायनामिक्स',
    hero: 'हीरो कैरेक्टर',
    threed: '3D स्थानिक',
    preferences: 'प्राथमिकताएं',
    visuals: 'डिस्प्ले और विज़ुअल्स'
  }
};

/**
 * ControlCenterFullView
 * 
 * Standalone Ultra-High-Performance Fullscreen Control Center Studio.
 * Renders in complete DOM isolation when `?view=control` or `?panel=control` is detected.
 * 
 * Features:
 * 1. Zero Background Bloat: Heavy portfolio modules (Hero, 3D Canvas, Particles, etc.)
 *    are never mounted, ensuring instantaneous boot and lightning responsiveness.
 * 2. URL Deep Linking: Parses `mode`, `tab`/`section`, `theme`, and `lang` dynamically.
 * 3. Two-Tier Mode Architecture:
 *    - `mode === 'single'`: Isolates a single subsystem tab, hides navigation strip, provides
 *      illuminated badge and an "Open Full Control Panel" deep-link CTA.
 *    - `mode === 'all'`: Full interactive studio with horizontal subsystem navigation strip.
 * 4. Responsive Light & Dark Glassmorphism: Seamless dynamic styling across light and dark modes.
 * 5. Full Bilingual (EN/HI) Localization Support.
 * 6. Bidirectional Sync: Changes sync in real-time with any open portfolio window via LocalStorage.
 */
export default function ControlCenterFullView() {
  const {
    activeTab,
    setActiveTab,
    soundEnabled,
    resetDefaults
  } = useLab();

  const { theme, setTheme } = useTheme();
  const { language, setLanguage, isHindi } = useLanguage();

  const [mode, setMode] = useState('all');
  const [justReset, setJustReset] = useState(false);
  const [syncPulse, setSyncPulse] = useState(false);
  const pulseTimerRef = useRef(null);
  const resetTimerRef = useRef(null);

  // Normalize and parse URL query params on initial mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Scroll to top for pristine studio presentation
    window.scrollTo(0, 0);

    const params = new URLSearchParams(window.location.search);

    // 1. Mode parsing: 'single' | 'all' (default 'all')
    const rawMode = params.get('mode')?.toLowerCase();
    if (rawMode === 'single') {
      setMode('single');
    } else {
      setMode('all');
    }

    // 2. Tab or section param
    const rawTab = params.get('tab') || params.get('section');
    if (rawTab) {
      const normalized = TAB_NORMALIZER[rawTab.toLowerCase()];
      if (normalized && VALID_TABS.includes(normalized)) {
        setActiveTab(normalized);
      }
    }

    // 3. Theme param ('light' | 'dark')
    const rawTheme = params.get('theme')?.toLowerCase();
    if (rawTheme === 'light' || rawTheme === 'dark') {
      if (rawTheme !== theme && typeof setTheme === 'function') {
        setTheme(rawTheme);
      }
    }

    // 4. Lang param ('en' | 'hi')
    const rawLang = params.get('lang')?.toLowerCase();
    if (rawLang === 'en' || rawLang === 'hi') {
      if (rawLang !== language && typeof setLanguage === 'function') {
        setLanguage(rawLang);
      }
    }
  }, [setActiveTab, setTheme, setLanguage]);

  // Keep URL search params in sync with activeTab
  const handleSelectTab = useCallback((tabId) => {
    if (tabId === activeTab) return;
    setActiveTab(tabId);
    if (soundEnabled && typeof soundFX?.playHapticClick === 'function') {
      soundFX.playHapticClick();
    }
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      url.searchParams.set('mode', mode);
      if (theme) url.searchParams.set('theme', theme);
      if (language) url.searchParams.set('lang', language);
      window.history.replaceState(null, '', url.toString());
    }
  }, [activeTab, setActiveTab, soundEnabled, mode, theme, language]);

  // Visual pulse on storage change from another window with debounce and throttle protection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e) => {
      if (e.key === 'portfolio_control_center' || e.key === 'portfolio_lab_config') {
        // Throttling/debouncing: only set syncPulse(true) if not already pulsing
        if (!pulseTimerRef.current) {
          setSyncPulse(true);
        } else {
          clearTimeout(pulseTimerRef.current);
        }

        pulseTimerRef.current = setTimeout(() => {
          setSyncPulse(false);
          pulseTimerRef.current = null;
        }, 800);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (pulseTimerRef.current) {
        clearTimeout(pulseTimerRef.current);
        pulseTimerRef.current = null;
      }
    };
  }, []);

  // Cleanup reset timer on unmount
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };
  }, []);

  const handleBackToPortfolio = () => {
    if (typeof window !== 'undefined') {
      // Navigate cleanly back to main portfolio without control view params
      const targetUrl = window.location.origin + window.location.pathname;
      window.location.href = targetUrl;
    }
  };

  const handleOpenPortfolioNewTab = () => {
    if (typeof window !== 'undefined') {
      window.open(window.location.origin + window.location.pathname, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenFullControlPanel = useCallback(() => {
    setMode('all');
    if (soundEnabled && typeof soundFX?.playHapticClick === 'function') {
      soundFX.playHapticClick();
    }
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('view', 'control');
      url.searchParams.set('mode', 'all');
      url.searchParams.set('tab', activeTab);
      if (theme) url.searchParams.set('theme', theme);
      if (language) url.searchParams.set('lang', language);
      window.history.replaceState(null, '', url.toString());
    }
  }, [activeTab, theme, language, soundEnabled]);

  const handleResetAll = () => {
    const confirmMsg = isHindi
      ? 'क्या आप सभी नियंत्रण कक्ष सेटिंग्स को फ़ैक्टरी डिफ़ॉल्ट पर रीसेट करना चाहते हैं?'
      : 'Reset all Control Center settings back to factory defaults?';
    if (typeof window !== 'undefined' && window.confirm(confirmMsg)) {
      resetDefaults?.();
      setJustReset(true);
      if (soundEnabled && typeof soundFX?.playPop === 'function') {
        soundFX.playPop();
      }
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
      resetTimerRef.current = setTimeout(() => {
        setJustReset(false);
        resetTimerRef.current = null;
      }, 2000);
    }
  };

  // Find active tab configuration and localized label
  const activeTabConfig = useMemo(() => {
    const base = TABS_CONFIG.find((t) => t.id === activeTab) || TABS_CONFIG[0];
    const localizedLabel = (TAB_LABELS[language] && TAB_LABELS[language][base.id]) || base.label;
    return { ...base, label: localizedLabel };
  }, [activeTab, language]);

  const fullControlUrl = useMemo(() => {
    if (typeof window === 'undefined') return '?view=control&mode=all';
    return `${window.location.origin}${window.location.pathname}?view=control&mode=all&tab=${activeTab}&theme=${theme}&lang=${language}`;
  }, [activeTab, theme, language]);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#07050C] text-stone-900 dark:text-[#F5F2F8] relative selection:bg-[#FF4D6D] selection:text-white flex flex-col font-sans transition-colors duration-200">
      {/* Background Subtle Ambient Glows */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 dark:opacity-100 transition-opacity"
      >
        <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-[#FF4D6D]/10 rounded-full blur-[130px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[350px] bg-[#8B5CF6]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/3 w-[600px] h-[300px] bg-[#00F2FE]/05 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-dot-pattern opacity-25" />
      </div>

      {/* Top Utility Sticky Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#0B0813]/85 border-b border-stone-200 dark:border-white/10 backdrop-blur-xl shadow-xs dark:shadow-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Left: Back button + Title & Status */}
          <div className="flex items-center gap-3.5 min-w-0 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={handleBackToPortfolio}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200/80 dark:bg-white/5 dark:hover:bg-white/10 border border-stone-300 dark:border-white/10 hover:border-[#FF4D6D]/40 text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white transition-all shadow-xs group active:scale-95 cursor-pointer"
              title={isHindi ? 'मुख्य इंटरैक्टिव पोर्टफोलियो अनुभव पर लौटें' : 'Return to the main interactive portfolio experience'}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#FF4D6D] group-hover:-translate-x-0.5 transition-transform" />
              <span>{isHindi ? 'पोर्टफोलियो पर वापस' : 'Back to Portfolio'}</span>
            </button>

            <div className="h-5 w-px bg-stone-200 dark:bg-white/10 hidden sm:block" />

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#FF4D6D]" />
                  <span>Portfolio Control Center</span>
                </h1>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FF4D6D]/15 text-[#FF4D6D] border border-[#FF4D6D]/30">
                  {isHindi ? 'स्वतंत्र स्टूडियो' : 'Standalone Studio'}
                </span>

                {/* Illuminated Badge when in single mode */}
                {mode === 'single' && (
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-300 border border-violet-500/30 shadow-xs inline-flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    <span>
                      {isHindi
                        ? `पृथक टैब: ${activeTabConfig?.label || 'सक्रिय टैब'}`
                        : `Isolated Tab: ${activeTabConfig?.label || 'Active Tab'}`}
                    </span>
                  </span>
                )}
              </div>

              {/* Real-time sync status indicator */}
              <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${
                      syncPulse ? 'scale-150 duration-300' : ''
                    }`}
                  />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400/90 font-medium truncate">
                  {isHindi
                    ? '🟢 मुख्य विंडो के साथ लाइव समन्वयित'
                    : '🟢 Live Synced with Main Window via LocalStorage'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick actions */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0 flex-wrap">
            {mode === 'single' && (
              <a
                href={fullControlUrl}
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenFullControlPanel();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FF4D6D] hover:bg-[#FF4D6D]/90 text-white shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                title={isHindi ? 'सभी टैब के साथ पूर्ण नियंत्रण कक्ष दृश्य खोलें' : 'Open full control panel view with all subsystem tabs'}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isHindi ? 'पूर्ण नियंत्रण कक्ष खोलें' : 'Open Full Control Panel'}</span>
              </a>
            )}

            <button
              type="button"
              onClick={handleOpenPortfolioNewTab}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white bg-stone-100 hover:bg-stone-200/80 dark:bg-white/5 dark:hover:bg-white/10 border border-stone-300 dark:border-white/10 transition-colors cursor-pointer"
              title={isHindi ? 'लाइव परिवर्तन देखने के लिए अलग विंडो में खोलें' : 'Open main portfolio in a new separate window/tab to preview live changes side-by-side'}
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#00F2FE]" />
              <span className="hidden sm:inline">{isHindi ? 'लाइव पूर्वावलोकन खोलें' : 'Open Live Preview'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetAll}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                justReset
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/40'
                  : 'bg-stone-100 hover:bg-rose-500/10 dark:bg-white/5 dark:hover:bg-rose-500/10 text-stone-600 hover:text-rose-600 dark:text-stone-300 dark:hover:text-rose-300 border-stone-300 hover:border-rose-500/30 dark:border-white/10 dark:hover:border-rose-500/30'
              }`}
              title={isHindi ? 'सभी नियंत्रणों को फ़ैक्टरी डिफ़ॉल्ट पर रीसेट करें' : 'Reset all studio controls to factory defaults'}
            >
              {justReset ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  <span>{isHindi ? 'रीसेट लागू' : 'Reset Applied'}</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                  <span className="hidden sm:inline">{isHindi ? 'डिफ़ॉल्ट रीसेट करें' : 'Reset Defaults'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Switcher Pills Strip (Only shown when mode === 'all') */}
        {mode === 'all' && (
          <div className="border-t border-stone-200 dark:border-white/5 bg-stone-100/80 dark:bg-[#080510]/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav
                role="tablist"
                aria-label="Studio Subsystems"
                className="flex items-center gap-1 sm:gap-2 py-2 overflow-x-auto no-scrollbar scroll-smooth"
              >
                {TABS_CONFIG.map((t) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  const label = (TAB_LABELS[language] && TAB_LABELS[language][t.id]) || t.label;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleSelectTab(t.id)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#FF4D6D] text-white shadow-lg shadow-[#FF4D6D]/25 ring-1 ring-[#FF4D6D]/40'
                          : 'bg-white/80 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white border border-stone-200 dark:border-white/5'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main Studio Workbench Container */}
      <main className="flex-1 relative z-10 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Studio Info Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#FF4D6D]/10 via-[#8B5CF6]/10 to-stone-100/50 dark:to-transparent border border-stone-200 dark:border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FF4D6D]/15 text-[#FF4D6D] border border-[#FF4D6D]/30 shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900 dark:text-white tracking-wide">
                {mode === 'single'
                  ? (isHindi ? `पृथक मोड: ${activeTabConfig?.label || 'सक्रिय सबसिस्टम'}` : `Isolated Mode: ${activeTabConfig?.label || 'Active Subsystem'}`)
                  : (isHindi ? 'पृथक स्टूडियो इंजन सक्रिय' : 'Isolated Studio Engine Active')}
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                {isHindi
                  ? 'प्रत्येक स्लाइडर, टॉगल और प्रीसेट तुरंत स्थायी स्टोरेज में सहेजा जाता है। रीयल-टाइम अपडेट देखने के लिए स्प्लिट विंडो में खोलें।'
                  : 'Every slider, toggle and preset writes immediately to persistent storage. Open the portfolio in a split window to observe real-time visual updates.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs text-stone-600 dark:text-stone-400 bg-stone-100/90 dark:bg-black/40 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-white/5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span>{isHindi ? 'उच्च गति सैंडबॉक्स रनटाइम' : 'High-Speed Sandboxed Runtime'}</span>
          </div>
        </div>

        {/* Embedded Core Control Center Panel with dynamic 2-Tier mode */}
        <div className="rounded-3xl border bg-white/85 dark:bg-[#0D091A]/85 border-stone-200 dark:border-white/10 backdrop-blur-2xl text-stone-900 dark:text-stone-100 shadow-xl dark:shadow-2xl p-3 sm:p-6 lg:p-8">
          {mode === 'single' ? (
            <ControlCenterPanel
              variant="workbench"
              isStandalone={true}
              mode="single"
              singleTab={activeTab}
            />
          ) : (
            <ControlCenterPanel
              variant="workbench"
              isStandalone={true}
              mode="all"
            />
          )}
        </div>
      </main>

      {/* Footer bar */}
      <footer className="relative z-10 border-t border-stone-200 dark:border-white/10 bg-white/80 dark:bg-[#07050C]/90 py-4 text-center text-xs text-stone-500 dark:text-stone-500 font-mono">
        <p>{isHindi ? 'पोर्टफोलियो नियंत्रण कक्ष स्टूडियो • शून्य पृष्ठभूमि विलंबता आर्किटेक्चर' : 'Portfolio Control Center Studio • Zero Background Latency Architecture'}</p>
      </footer>
    </div>
  );
}
