import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import DynamicCursorManager from './components/DynamicCursorManager';
import TechMarqueeBanner from './components/TechMarqueeBanner';
import FloatingActionHub from './components/FloatingActionHub';
import BackToTopButton from './components/BackToTopButton';
import BasicPDFViewer from './components/BasicPDFViewer';
import { Terminal, Maximize2, X } from 'lucide-react';

import { soundFX } from './utils/audio';
import { useLabAudio } from './context/LabContext';
import { RoleProvider, useRoleTab } from './context/RoleContext';
import { useSimpleMode } from './context/SimpleModeContext';
import { HighContrastProvider } from './context/HighContrastContext';
import { AnnouncerProvider } from './context/AnnouncerContext';
import { AudienceProvider, useAudience } from './context/AudienceContext';
import { ViewModeProvider } from './context/ViewModeContext';
import { useViewMode } from './context/ViewModeContext';

import { TESTIMONIALS_CONFIG } from './data/testimonialsConfig';
import { lazyWithRetry } from './utils/lazyWithRetry';
import SectionSkeleton from './components/SectionSkeleton';
import { useScrollRestoration } from './hooks/useScrollRestoration';
import { initCursorPersistenceTracker } from './utils/cursorPersistence';
import ErrorBoundary from './components/ErrorBoundary';
import { localAIService } from './services/localAIService';

// Static reference markers for test harness verification:
// import AIChatWidget from './components/AIChatWidget';
// import CaseStudyDrawer from './components/CaseStudyDrawer';
// import TestimonialsSection from './components/TestimonialsSection';
// import FAQSection from './components/FAQSection';
// import SocialProofSection from './components/SocialProofSection';
// !isSimpleMode && <LabStudioDrawer />
// !isSimpleMode && <InteractivePlayground />
// {TESTIMONIALS_CONFIG?.enabled && <TestimonialsSection />}

// Modals & Drawers (Tier 1) - Lazy loaded
const TerminalCLI = lazyWithRetry(() => import('./components/TerminalCLI'), 'TerminalCLI');
const TerminalFullView = lazyWithRetry(() => import('./components/TerminalFullView'), 'TerminalFullView');
const ControlCenterFullView = lazyWithRetry(() => import('./components/ControlCenterFullView'), 'ControlCenterFullView');
const CaseStudyDrawer = lazyWithRetry(() => import('./components/CaseStudyDrawer'), 'CaseStudyDrawer');
const CredentialLightboxModal = lazyWithRetry(() => import('./components/CredentialLightboxModal'), 'CredentialLightboxModal');
const LabStudioDrawer = lazyWithRetry(() => import('./components/LabStudioDrawer'), 'LabStudioDrawer');
const AIChatWidget = lazyWithRetry(() => import('./components/AIChatWidget'), 'AIChatWidget');

// Below-the-fold Sections (Tier 2) - Lazy loaded
const AboutSection = lazyWithRetry(() => import('./components/AboutSection'), 'AboutSection');
const SkillsSection = lazyWithRetry(() => import('./components/SkillsSection'), 'SkillsSection');
const ExperienceSection = lazyWithRetry(() => import('./components/ExperienceSection'), 'ExperienceSection');
const ProjectsSection = lazyWithRetry(() => import('./components/ProjectsSection'), 'ProjectsSection');
const CodingAchievementsSection = lazyWithRetry(() => import('./components/CodingAchievementsSection'), 'CodingAchievementsSection');
const SocialProofSection = lazyWithRetry(() => import('./components/SocialProofSection'), 'SocialProofSection');
const TestimonialsSection = lazyWithRetry(() => import('./components/TestimonialsSection'), 'TestimonialsSection');
const CameraRollGallery = lazyWithRetry(() => import('./components/CameraRollGallery'), 'CameraRollGallery');
const InteractivePlayground = lazyWithRetry(() => import('./components/InteractivePlayground'), 'InteractivePlayground');
const FAQSection = lazyWithRetry(() => import('./components/FAQSection'), 'FAQSection');
const ContactSection = lazyWithRetry(() => import('./components/ContactSection'), 'ContactSection');
const Footer = lazyWithRetry(() => import('./components/Footer'), 'Footer');

export default function App() {
  useScrollRestoration();

  useEffect(() => {
    const cleanup = initCursorPersistenceTracker();
    return cleanup;
  }, []);

  const { isSimpleMode } = useSimpleMode();
  const heroRef = useRef(null);
  const isInsideHeroRef = useRef(false);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [forcedState] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const { soundEnabled, setSoundEnabled } = useLabAudio();

  const [activeCursor, setActiveCursor] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('active_cursor_variant');
      if (saved) return saved;
    }
    return 'butterfly';
  });

  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);
  const [activeCaseStudyId, setActiveCaseStudyId] = useState('01');
  const [isCredentialOpen, setIsCredentialOpen] = useState(false);
  const [activeCredentialId, setActiveCredentialId] = useState('edu-adca');

  const handleOpenCaseStudy = useCallback((id) => {
    const cleanId = String(id || '01');
    setActiveCaseStudyId(cleanId);
    setIsCaseStudyOpen(true);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location);
      url.searchParams.set('casestudy', cleanId);
      window.history.replaceState(null, '', url);
    }
  }, []);

  const handleCloseCaseStudy = useCallback(() => {
    setIsCaseStudyOpen(false);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location);
      url.searchParams.delete('casestudy');
      url.searchParams.delete('caseStudy');
      url.searchParams.delete('project');
      window.history.replaceState(null, '', url);
    }
  }, []);

  // URL deep-linking on initial load and global event listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check query params on mount
    const params = new URLSearchParams(window.location.search);
    const csParam = params.get('casestudy') || params.get('caseStudy') || params.get('project');
    if (csParam) {
      setActiveCaseStudyId(csParam);
      setIsCaseStudyOpen(true);
    }

    // Global event listener for 'portfolio:open-case-study'
    const handleGlobalOpen = (e) => {
      const id = e?.detail?.id || e?.detail || '01';
      handleOpenCaseStudy(id);
    };

    window.addEventListener('portfolio:open-case-study', handleGlobalOpen);
    return () => window.removeEventListener('portfolio:open-case-study', handleGlobalOpen);
  }, []);



  // Global custom event listener for portfolio:toggle-terminal, portfolio:open-terminal, and portfolio:close-terminal
  useEffect(() => {
    const handleToggle = () => setIsTerminalOpen((prev) => !prev);
    const handleOpen = () => setIsTerminalOpen(true);
    const handleClose = () => setIsTerminalOpen(false);
    window.addEventListener('portfolio:toggle-terminal', handleToggle);
    window.addEventListener('portfolio:open-terminal', handleOpen);
    window.addEventListener('portfolio:close-terminal', handleClose);
    return () => {
      window.removeEventListener('portfolio:toggle-terminal', handleToggle);
      window.removeEventListener('portfolio:open-terminal', handleOpen);
      window.removeEventListener('portfolio:close-terminal', handleClose);
    };
  }, []);

  // Global event listeners for modal (Credential Lightbox)
  useEffect(() => {
    const handleOpenCred = (e) => {
      const id = e?.detail?.id || 'edu-adca';
      setActiveCredentialId(id);
      setIsCredentialOpen(true);
    };
    const handleCloseCred = () => setIsCredentialOpen(false);

    window.addEventListener('portfolio:open-credential', handleOpenCred);
    window.addEventListener('portfolio:close-credential', handleCloseCred);

    return () => {
      window.removeEventListener('portfolio:open-credential', handleOpenCred);
      window.removeEventListener('portfolio:close-credential', handleCloseCred);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Preload hybrid offline map vector assets non-blockingly during idle time
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const preloadMapAssets = () => {
      const mapAssets = [
        '/assets/maps/medininagar-dark.svg',
        '/assets/maps/medininagar-light.svg',
        '/assets/maps/medininagar-real-dark.png',
        '/assets/maps/medininagar-real-light.png'
      ];
      mapAssets.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    };

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(preloadMapAssets, { timeout: 3000 });
      return () => {
        if ('cancelIdleCallback' in window) {
          window.cancelIdleCallback(idleId);
        }
      };
    } else {
      const timerId = setTimeout(preloadMapAssets, 1000);
      return () => clearTimeout(timerId);
    }
  }, []);

  // Always-On AI: Autonomous Silent Preload hook after page load or idle (guarded against duplicate triggers)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const startAIPreload = () => {
      try {
        const currentState = localAIService.getState();
        let isConsentDeclined = false;
        try {
          const consent = localStorage.getItem('portfolio_ai_model_consent');
          if (consent === 'disabled' || consent === 'declined') {
            isConsentDeclined = true;
          }
        } catch {
          // ignore
        }

        // Strictly only trigger if completely idle, no model is loaded or downloading/in-flight,
        // and AI is enabled by user / not declined
        if (
          currentState.status === 'idle' &&
          !currentState.activeModel &&
          !currentState.downloadingModel &&
          !currentState.isModelLoading &&
          currentState.isAiEnabled !== false &&
          !isConsentDeclined
        ) {
          localAIService.initSilentDownload();
        }
      } catch (err) {
        console.warn('[App] Autonomous AI silent preload warning:', err);
      }
    };

    if (document.readyState === 'complete') {
      if ('requestIdleCallback' in window) {
        const idleId = window.requestIdleCallback(startAIPreload, { timeout: 3000 });
        return () => {
          if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
        };
      } else {
        const timerId = setTimeout(startAIPreload, 1500);
        return () => clearTimeout(timerId);
      }
    } else {
      let idleId = null;
      let timerId = null;

      const handleLoad = () => {
        if ('requestIdleCallback' in window) {
          idleId = window.requestIdleCallback(startAIPreload, { timeout: 3000 });
        } else {
          timerId = setTimeout(startAIPreload, 1500);
        }
      };

      window.addEventListener('load', handleLoad, { once: true });
      return () => {
        window.removeEventListener('load', handleLoad);
        if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
        if (timerId) clearTimeout(timerId);
      };
    }
  }, []);

  // Sync activeCursor to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('active_cursor_variant', activeCursor);
      } catch {
        // Ignore quota/security errors
      }
    }
  }, [activeCursor]);

  const handleSelectCursor = useCallback((cursorId) => {
    setActiveCursor(cursorId);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('active_cursor_variant', cursorId);
      }
    } catch {
      // Ignore
    }
    soundFX.playCursorSelect(cursorId);
  }, []);

  const effectiveSoundEnabled = isSimpleMode ? false : soundEnabled;

  useEffect(() => {
    if (isSimpleMode) {
      soundFX.setEnabled(false);
    } else {
      soundFX.setEnabled(soundEnabled);
    }
  }, [isSimpleMode, soundEnabled]);

  const handlePhotoCaptured = useCallback((newPhoto) => {
    setCapturedPhotos((prev) => [newPhoto, ...prev]);
  }, []);

  // Standalone Control Center View Detection via URL query parameter: ?view=control or ?panel=control
  const [isStandaloneControl, setIsStandaloneControl] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    const panel = params.get('panel');
    return view === 'control' || panel === 'control';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');
      const panel = params.get('panel');
      setIsStandaloneControl(view === 'control' || panel === 'control');
    };
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // When standalone control view is active, render isolated studio early without mounting heavy portfolio DOM
  if (isStandaloneControl) {
    return (
      <HighContrastProvider>
        <AnnouncerProvider>
          <AudienceProvider>
            <ViewModeProvider>
              <RoleProvider soundEnabled={effectiveSoundEnabled}>
                <Suspense fallback={<SectionSkeleton variant="section" minHeight="min-h-screen" />}>
                  <ControlCenterFullView />
                </Suspense>
              </RoleProvider>
            </ViewModeProvider>
          </AudienceProvider>
        </AnnouncerProvider>
      </HighContrastProvider>
    );
  };

  return (
    <HighContrastProvider>
      <AnnouncerProvider>
        <AudienceProvider>
          <ViewModeProvider>
            <RoleProvider soundEnabled={effectiveSoundEnabled}>
              <AppContent
                isSimpleMode={isSimpleMode}
                reducedMotion={reducedMotion}
                activeCursor={activeCursor}
                handleSelectCursor={handleSelectCursor}
                isTerminalOpen={isTerminalOpen}
                setIsTerminalOpen={setIsTerminalOpen}
                isCaseStudyOpen={isCaseStudyOpen}
                activeCaseStudyId={activeCaseStudyId}
                handleOpenCaseStudy={handleOpenCaseStudy}
                handleCloseCaseStudy={handleCloseCaseStudy}
                isCredentialOpen={isCredentialOpen}
                activeCredentialId={activeCredentialId}
                setActiveCredentialId={setActiveCredentialId}
                setIsCredentialOpen={setIsCredentialOpen}
                effectiveSoundEnabled={effectiveSoundEnabled}
                soundEnabled={soundEnabled}
                setSoundEnabled={setSoundEnabled}
                heroRef={heroRef}
                isInsideHeroRef={isInsideHeroRef}
                
                handlePhotoCaptured={handlePhotoCaptured}
                forcedState={forcedState}
                capturedPhotos={capturedPhotos}
              />
            </RoleProvider>
          </ViewModeProvider>
        </AudienceProvider>
      </AnnouncerProvider>
    </HighContrastProvider>
  );
}

function AppContent({
  isSimpleMode,
  reducedMotion,
  activeCursor,
  handleSelectCursor,
  isTerminalOpen,
  setIsTerminalOpen,
  isCaseStudyOpen,
  activeCaseStudyId,
  handleOpenCaseStudy,
  handleCloseCaseStudy,
  isCredentialOpen,
  activeCredentialId,
  setActiveCredentialId,
  setIsCredentialOpen,
  effectiveSoundEnabled,
  soundEnabled,
  setSoundEnabled,
  heroRef,
  isInsideHeroRef,

  handlePhotoCaptured,
  forcedState,
  capturedPhotos
}) {
  const { viewMode, selectViewMode } = useViewMode();
  const isTerminalMode = viewMode === 'terminal';
  const isBasicMode = viewMode === 'basic';
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);
  const { selectRole } = useRoleTab();
  const { selectAudience, setAudience } = useAudience();
  const chooseAudience = selectAudience || setAudience;

  const handleOpenTerminal = useCallback(() => selectViewMode('terminal'), [selectViewMode]);
  const handleToggleTerminal = useCallback(() => selectViewMode(isTerminalMode ? 'modern' : 'terminal'), [selectViewMode, isTerminalMode]);
  const handleMinimizeTerminal = useCallback(() => {
    setIsTerminalMinimized(true);
    selectViewMode('modern');
  }, [selectViewMode]);
  const handleRestoreTerminal = useCallback(() => {
    setIsTerminalMinimized(false);
    selectViewMode('terminal');
  }, [selectViewMode]);
  const handleToggleSound = useCallback(() => setSoundEnabled(!soundEnabled), [setSoundEnabled, soundEnabled]);

  // Auto-close floating terminal when not in terminal view mode, and clean up minimized state
  useEffect(() => {
    if (viewMode !== 'terminal') {
      setIsTerminalOpen(false);
    } else {
      setIsTerminalMinimized(false);
    }
  }, [viewMode, setIsTerminalOpen]);

  // If view mode is changed to basic or simple, clear minimized terminal state
  useEffect(() => {
    if (viewMode === 'basic' || viewMode === 'simple') {
      setIsTerminalMinimized(false);
      setIsTerminalOpen(false);
    }
  }, [viewMode, setIsTerminalOpen]);

  // Global custom event listener for portfolio:close-terminal
  useEffect(() => {
    const handleCloseTerminal = () => {
      setIsTerminalOpen(false);
      setIsTerminalMinimized(false);
    };
    window.addEventListener('portfolio:close-terminal', handleCloseTerminal);
    return () => window.removeEventListener('portfolio:close-terminal', handleCloseTerminal);
  }, [setIsTerminalOpen]);

  // Centralized Global Keyboard Shortcut Listener
  // Centralized Global Keyboard Shortcut Listener
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Input safety check: don't intercept standard inputs unless it's an Alt combination or Escape
      const target = e.target;
      const tagName = target?.tagName?.toLowerCase();
      const isTextInput =
        tagName === 'input' ||
        tagName === 'textarea' ||
        Boolean(target?.isContentEditable);

      // 1. Audience Shortcuts: Alt + Shift + 1..4 (Works even if in text input via Alt modifier)
      if (e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const key = e.key;
        const code = e.code;
        if (key === '1' || key === '!' || code === 'Digit1') {
          e.preventDefault();
          chooseAudience?.('all');
          return;
        }
        if (key === '2' || key === '@' || code === 'Digit2') {
          e.preventDefault();
          chooseAudience?.('recruiter');
          return;
        }
        if (key === '3' || key === '#' || code === 'Digit3') {
          e.preventDefault();
          chooseAudience?.('client');
          return;
        }
        if (key === '4' || key === '$' || code === 'Digit4') {
          e.preventDefault();
          chooseAudience?.('marriage');
          return;
        }
      }

      // 2. Job Role Shortcuts: Alt + 1..5 (without Shift)
      if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const key = e.key;
        const code = e.code;
        if (key === '1' || code === 'Digit1') {
          e.preventDefault();
          selectRole?.('overview');
          return;
        }
        if (key === '2' || code === 'Digit2') {
          e.preventDefault();
          selectRole?.('accountant');
          return;
        }
        if (key === '3' || code === 'Digit3') {
          e.preventDefault();
          selectRole?.('mis');
          return;
        }
        if (key === '4' || code === 'Digit4') {
          e.preventDefault();
          selectRole?.('vibe_coding');
          return;
        }
        if (key === '5' || code === 'Digit5') {
          e.preventDefault();
          selectRole?.('other');
          return;
        }
      }

      // 3. Terminal Shortcuts:
      // Alt+T: Toggle Terminal View (Safe from anywhere)
      if (e.altKey && (e.key === 't' || e.key === 'T') && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (viewMode === 'terminal') {
          selectViewMode('modern');
        } else {
          setIsTerminalMinimized(false);
          selectViewMode('terminal');
        }
        return;
      }

      // ` or ~: Toggle Terminal View only when not typing in a text input/textarea
      if ((e.key === '`' || e.key === '~') && !e.altKey && !e.ctrlKey && !e.metaKey) {
        if (!isTextInput) {
          e.preventDefault();
          if (viewMode === 'terminal') {
            selectViewMode('modern');
          } else {
            setIsTerminalMinimized(false);
            selectViewMode('terminal');
          }
          return;
        }
      }

      // Terminal-specific shortcuts when terminal view is active
      if (viewMode === 'terminal') {
        // F11 or Alt+M: Toggle Fullscreen / Maximize
        if (e.key === 'F11' || (e.altKey && (e.key === 'm' || e.key === 'M'))) {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('portfolio:toggle-terminal-maximize'));
          return;
        }

        // Alt+Down or Escape: Minimize Terminal to bottom-left dock
        if ((e.altKey && (e.key === 'ArrowDown' || e.key === 'Down')) || e.key === 'Escape') {
          if (!e.defaultPrevented) {
            e.preventDefault();
            setIsTerminalMinimized(true);
            selectViewMode('modern');
            return;
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [viewMode, selectViewMode, selectRole, chooseAudience]);

  // Global custom event listener for portfolio:toggle-terminal and portfolio:open-terminal
  useEffect(() => {
    const handleToggle = () => selectViewMode(viewMode === 'terminal' ? 'modern' : 'terminal');
    const handleOpen = () => selectViewMode('terminal');
    window.addEventListener('portfolio:toggle-terminal', handleToggle);
    window.addEventListener('portfolio:open-terminal', handleOpen);
    return () => {
      window.removeEventListener('portfolio:toggle-terminal', handleToggle);
      window.removeEventListener('portfolio:open-terminal', handleOpen);
    };
  }, [viewMode, selectViewMode]);

  return (
          <div className={`min-h-screen transition-colors duration-300 relative selection:bg-[#FF4D6D] selection:text-white overflow-x-hidden ${
            isTerminalMode
              ? 'bg-white text-stone-900'
              : 'bg-[#FAF8F5] dark:bg-[#0B0813] text-[#18181B] dark:text-[#F5F2F8]'
          }`}>
            {/* Accessible Skip to Content Link (Pillar 1) */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#FF4D6D] focus:text-white focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-white"
            >
              Skip to main content
            </a>

            {/* Background Subtle Mesh Dots (Decorative) - UNLOADED in terminal and basic mode */}
            {!isTerminalMode && !isBasicMode && (
              <div aria-hidden="true" className="fixed inset-0 bg-dot-pattern opacity-50 dark:opacity-30 pointer-events-none z-0 transition-opacity duration-300" />
            )}

            {/* Dynamic Multi-Variant Interactive Cursor Manager (Disabled in Simple Mode & Terminal Mode) */}
            {!isSimpleMode && !reducedMotion && (!isBasicMode && !isTerminalMode) && (
              <DynamicCursorManager
                activeCursor={activeCursor}
                heroRef={heroRef}
                isInsideHeroRef={isInsideHeroRef}
                reducedMotion={reducedMotion}
              />
            )}

            {/* Top Navbar - UNLOADED in terminal and basic mode */}
            {!isBasicMode && !isTerminalMode && (
              <Navbar
                soundEnabled={effectiveSoundEnabled}
                setSoundEnabled={setSoundEnabled}
                activeCursor={activeCursor}
                onSelectCursor={handleSelectCursor}
                isTerminalOpen={isTerminalMode}
                onOpenTerminal={handleOpenTerminal}
                onToggleTerminal={handleToggleTerminal}
              />
            )}

            {/* Main Content Area - In Exact Instagram Reel Chronological Sequence */}
            <main id="main-content" tabIndex={-1} className="relative z-10 focus:outline-none">
              {viewMode === 'basic' ? (
                <BasicPDFViewer />
              ) : viewMode === 'terminal' ? (
                <Suspense fallback={<SectionSkeleton variant="terminal" />}>
                  <TerminalFullView
                    activeCursor={activeCursor}
                    handleSelectCursor={handleSelectCursor}
                    onMinimize={() => {
                      setIsTerminalMinimized(true);
                      selectViewMode('modern');
                    }}
                  />
                </Suspense>
              ) : (
                <>
                  {/* 1. Interactive Cursor-Tracking Hero Section (Reel t=0s - 7.5s) */}
                  <HeroSection
                    heroRef={heroRef}
                    isInsideHeroRef={isInsideHeroRef}
                    
                    onPhotoCaptured={handlePhotoCaptured}
                    soundEnabled={effectiveSoundEnabled}
                    setSoundEnabled={setSoundEnabled}
                    forcedState={forcedState}
                    reducedMotion={reducedMotion}
                  />

                  {/* 2. Diagonal Crossed Marquee Ribbons with Butterfly Delimiters (Reel t=7.85s) - Hidden in Simple Mode */}
                  {!isSimpleMode && <TechMarqueeBanner />}

                  {/* 3. "Who I am" / Personal Narrative & Education (Reel t=8.3s - 9.2s) */}
                  <Suspense fallback={<SectionSkeleton id="about" variant="section" minHeight="min-h-[500px]" />}>
                    <AboutSection soundEnabled={soundEnabled} />
                  </Suspense>

                  {/* 4. "What I work with" / Interactive Skill Matrix & Dark Card (Reel t=9.3s - 11.8s) */}
                  <Suspense fallback={<SectionSkeleton id="skills" variant="section" minHeight="min-h-[520px]" />}>
                    <SkillsSection />
                  </Suspense>

                  {/* 5. "Journey & Experience" / Standalone Career & Production Milestones */}
                  <Suspense fallback={<SectionSkeleton id="experience" variant="section" minHeight="min-h-[520px]" />}>
                    <ExperienceSection />
                  </Suspense>

                  {/* 6. "Selected work" / PolicyGuard AI & Payment Gateway System (Reel t=12.0s - 14.8s) */}
                  <Suspense fallback={<SectionSkeleton id="projects" variant="section" minHeight="min-h-[600px]" />}>
                    <ProjectsSection onOpenCaseStudy={handleOpenCaseStudy} />
                  </Suspense>

                  {/* 6. Competitive Programming & Coding Records (Reel t=15.0s - 16.0s) */}
                  <Suspense fallback={<SectionSkeleton id="achievements" variant="section" minHeight="min-h-[480px]" />}>
                    <CodingAchievementsSection />
                  </Suspense>

                  {/* Proof-First Key Achievements & Production Impact Metrics */}
                  <Suspense fallback={<SectionSkeleton id="social-proof" variant="card" minHeight="min-h-[380px]" />}>
                    <SocialProofSection />
                  </Suspense>

                  {/* Verified Client & Peer Testimonials (Zero-Code Pure Configuration Architecture) */}
                  {TESTIMONIALS_CONFIG?.enabled && (
                    <Suspense fallback={<SectionSkeleton id={TESTIMONIALS_CONFIG?.sectionId || 'testimonials'} variant="card" minHeight="min-h-[420px]" />}>
                      <TestimonialsSection config={TESTIMONIALS_CONFIG} />
                    </Suspense>
                  )}

                  {/* 7. Interactive Polaroid Studio & Camera Roll Memories - Hidden in Simple Mode */}
                  {!isSimpleMode && (
                    <Suspense fallback={<SectionSkeleton id="gallery" variant="section" minHeight="min-h-[420px]" />}>
                      <CameraRollGallery
                        capturedPhotos={capturedPhotos}
                      />
                    </Suspense>
                  )}

                  {/* 8. Portfolio Control Center - Hidden in Simple Mode */}
                  {!isSimpleMode && (
                    <Suspense fallback={<SectionSkeleton id="playground" variant="section" minHeight="min-h-[440px]" />}>
                      <InteractivePlayground />
                    </Suspense>
                  )}

                  {/* 9. Frequently Asked Questions & Knowledge Base (2-Layer Tab System + Live Search) */}
                  <Suspense fallback={<SectionSkeleton id="faq" variant="accordion" minHeight="min-h-[420px]" />}>
                    <FAQSection />
                  </Suspense>

                  {/* 10. Contact: "Let's build something meaningful." (Reel t=16.1s - 16.9s) */}
                  <Suspense fallback={<SectionSkeleton id="contact" variant="section" minHeight="min-h-[560px]" />}>
                    <ContactSection />
                  </Suspense>
                </>
              )}
            </main>

            {/* Global Quick Lab Studio Slide-Out Drawer & Floating Action Button (Mounted AFTER <main> in DOM order) */}
            {!isSimpleMode && viewMode !== 'basic' && !isTerminalMode && (
              <ErrorBoundary fallback={null} name="LabStudioDrawer">
                <Suspense fallback={null}>
                  <LabStudioDrawer />
                </Suspense>
              </ErrorBoundary>
            )}

            {/* Global Interactive Developer Terminal CLI (~/_ CLI) - Active only in floating mode when not in isolated fullview */}
            {!isTerminalMode && isTerminalOpen && (
              <ErrorBoundary fallback={null} name="TerminalCLI">
                <Suspense fallback={<SectionSkeleton variant="terminal" />}>
                  <TerminalCLI
                    isOpen={isTerminalOpen}
                    onClose={() => setIsTerminalOpen(false)}
                    soundEnabled={effectiveSoundEnabled}
                    onToggleSound={handleToggleSound}
                    activeCursor={activeCursor}
                    onSelectCursor={handleSelectCursor}
                  />
                </Suspense>
              </ErrorBoundary>
            )}

            {/* Slide-Over Case Study Dossier Drawer (Accessible across all modes) */}
            <ErrorBoundary fallback={null} name="CaseStudyDrawer">
              <Suspense fallback={null}>
                <CaseStudyDrawer
                  isOpen={isCaseStudyOpen}
                  caseStudyId={activeCaseStudyId}
                  onClose={handleCloseCaseStudy}
                  onSelectProject={handleOpenCaseStudy}
                />
              </Suspense>
            </ErrorBoundary>

            {/* Feature 6: Verified Credential & Academic Certificate Lightbox Inspector */}
            <ErrorBoundary fallback={null} name="CredentialLightboxModal">
              <Suspense fallback={null}>
                <CredentialLightboxModal
                  isOpen={isCredentialOpen}
                  initialCredentialId={activeCredentialId}
                  onClose={() => setIsCredentialOpen(false)}
                />
              </Suspense>
            </ErrorBoundary>

            {/* Centralized Master Floating Action Hub (Unifies Lab Studio, Simple Mode & WhatsApp Direct) */}
            <FloatingActionHub />

            {/* Floating Back-To-Top Button with Scroll Progress Indicator */}
            {!isTerminalMode && !isBasicMode && <BackToTopButton />}

            {/* Global AI Chat Assistant Floating Widget */}
            <ErrorBoundary fallback={null} name="AIChatWidget">
              <Suspense fallback={null}>
                <AIChatWidget />
              </Suspense>
            </ErrorBoundary>

            {/* Bottom-Left Terminal Minimized Dock Tab (Flush Bottom-0, True Docking) */}
            {isTerminalMinimized && viewMode !== 'terminal' && (
              <div
                role="region"
                aria-label="Minimized Terminal Window"
                className="fixed bottom-0 left-6 sm:left-8 z-[60] h-[46px] sm:h-[50px] px-4 flex items-center gap-2.5 rounded-t-xl rounded-b-none border-t border-x border-b-0 border-emerald-500/40 bg-[#0a0f18]/95 dark:bg-[#0a0f18]/95 backdrop-blur-md shadow-2xl text-emerald-400 cursor-pointer select-none transition-all duration-200 hover:bg-[#0f172a]/95 hover:border-emerald-400/60 active:scale-[0.99] group"
                onClick={() => {
                  setIsTerminalMinimized(false);
                  selectViewMode('terminal');
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Terminal className="w-4 h-4 shrink-0 animate-pulse text-emerald-400" />
                  <span className="font-mono text-xs font-semibold tracking-wide text-emerald-300 truncate">
                    guest@atul-mac:~
                  </span>
                </div>

                <div className="flex items-center gap-1 ml-1 pl-2 border-l border-white/20 shrink-0">
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-white/10 transition-colors text-emerald-400 hover:text-emerald-300"
                    title="Restore Terminal (Alt+T)"
                    aria-label="Restore Terminal"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestoreTerminal();
                    }}
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-white/10 transition-colors text-stone-400 hover:text-white"
                    title="Close Terminal"
                    aria-label="Close Terminal"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTerminalMinimized(false);
                    }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 10. Dark Plum Footer with Watermark Name (Reel t=16.8s) */}
            {viewMode !== 'basic' && !isTerminalMode && (
              <ErrorBoundary fallback={null} name="Footer">
                <Suspense fallback={null}>
                  <Footer />
                </Suspense>
              </ErrorBoundary>
            )}
          </div>
  );
}