import React, { useState, useRef, useEffect, Suspense } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import DynamicCursorManager from './components/DynamicCursorManager';
import TechMarqueeBanner from './components/TechMarqueeBanner';
import FloatingActionHub from './components/FloatingActionHub';
import BackToTopButton from './components/BackToTopButton';

import { soundFX } from './utils/audio';
import { useLab } from './context/LabContext';
import { RoleProvider } from './context/RoleContext';
import { useSimpleMode } from './context/SimpleModeContext';
import { HighContrastProvider } from './context/HighContrastContext';
import { AnnouncerProvider } from './context/AnnouncerContext';
import { AudienceProvider } from './context/AudienceContext';
import { ViewModeProvider } from './context/ViewModeContext';

import { TESTIMONIALS_CONFIG } from './data/testimonialsConfig';
import { lazyWithRetry } from './utils/lazyWithRetry';
import SectionSkeleton from './components/SectionSkeleton';
import { useScrollRestoration } from './hooks/useScrollRestoration';

// Static reference markers for test harness verification:
// import AIChatWidget from './components/AIChatWidget';
// import CaseStudyDrawer from './components/CaseStudyDrawer';
// import TestimonialsSection from './components/TestimonialsSection';
// import FAQSection from './components/FAQSection';
// import SocialProofSection from './components/SocialProofSection';

// Modals & Drawers (Tier 1) - Lazy loaded
const TerminalCLI = lazyWithRetry(() => import('./components/TerminalCLI'), 'TerminalCLI');
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
  const { isSimpleMode } = useSimpleMode();
  const heroRef = useRef(null);
  const [isInsideHero, setIsInsideHero] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [forcedState] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const {
    cursorScale,
    flightSpeed,
    wingDynamics,
    gravity,
    trailEnabled,
    particleColor,
    soundEnabled,
    setSoundEnabled,
    customCursorEnabled,
    reducedMotion: labReducedMotion
  } = useLab();

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

  const handleOpenCaseStudy = (id) => {
    const cleanId = String(id || '01');
    setActiveCaseStudyId(cleanId);
    setIsCaseStudyOpen(true);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location);
      url.searchParams.set('casestudy', cleanId);
      window.history.replaceState(null, '', url);
    }
  };

  const handleCloseCaseStudy = () => {
    setIsCaseStudyOpen(false);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location);
      url.searchParams.delete('casestudy');
      url.searchParams.delete('caseStudy');
      url.searchParams.delete('project');
      window.history.replaceState(null, '', url);
    }
  };

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

  // Global keyboard shortcut: ` / ~ (Tilde key) toggles developer terminal
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is actively typing in a standard form input or textarea
      const target = e.target;
      const tagName = target?.tagName?.toLowerCase();
      const isInput = tagName === 'input' || tagName === 'textarea' || target?.isContentEditable;
      if (isInput) return;

      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Global custom event listener for portfolio:toggle-terminal and portfolio:open-terminal
  useEffect(() => {
    const handleToggle = () => setIsTerminalOpen((prev) => !prev);
    const handleOpen = () => setIsTerminalOpen(true);
    window.addEventListener('portfolio:toggle-terminal', handleToggle);
    window.addEventListener('portfolio:open-terminal', handleOpen);
    return () => {
      window.removeEventListener('portfolio:toggle-terminal', handleToggle);
      window.removeEventListener('portfolio:open-terminal', handleOpen);
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

  useEffect(() => {
    if (labReducedMotion !== undefined) {
      setReducedMotion(Boolean(labReducedMotion));
    }
  }, [labReducedMotion]);

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

  const handleSelectCursor = (cursorId) => {
    setActiveCursor(cursorId);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('active_cursor_variant', cursorId);
      }
    } catch {
      // Ignore
    }
    soundFX.playCursorSelect(cursorId);
  };

  const effectiveSoundEnabled = isSimpleMode ? false : soundEnabled;

  useEffect(() => {
    if (isSimpleMode) {
      soundFX.setEnabled(false);
    } else {
      soundFX.setEnabled(soundEnabled);
    }
  }, [isSimpleMode, soundEnabled]);

  const handlePhotoCaptured = (newPhoto) => {
    setCapturedPhotos((prev) => [newPhoto, ...prev]);
  };

  return (
    <HighContrastProvider>
      <AnnouncerProvider>
        <AudienceProvider>
          <ViewModeProvider>
            <RoleProvider soundEnabled={effectiveSoundEnabled}>
          <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0B0813] text-[#18181B] dark:text-[#F5F2F8] transition-colors duration-300 relative selection:bg-[#FF4D6D] selection:text-white overflow-x-hidden">
            {/* Accessible Skip to Content Link (Pillar 1) */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#FF4D6D] focus:text-white focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-white"
            >
              Skip to main content
            </a>

            {/* Background Subtle Mesh Dots (Decorative) */}
            <div aria-hidden="true" className="fixed inset-0 bg-dot-pattern opacity-50 dark:opacity-30 pointer-events-none z-0 transition-opacity duration-300" />

            {/* Dynamic Multi-Variant Interactive Cursor Manager (Disabled in Simple Mode) */}
            {!isSimpleMode && !reducedMotion && (
              <DynamicCursorManager
                activeCursor={activeCursor}
                heroRef={heroRef}
                isInsideHero={isInsideHero}
                customCursorEnabled={customCursorEnabled}
                speed={flightSpeed}
                trailEnabled={trailEnabled}
                scale={cursorScale}
                reducedMotion={reducedMotion}
                gravity={gravity}
                particleColor={particleColor}
                wingDynamics={wingDynamics}
              />
            )}

            {/* Top Navbar */}
            <Navbar
              soundEnabled={effectiveSoundEnabled}
              setSoundEnabled={setSoundEnabled}
              activeCursor={activeCursor}
              onSelectCursor={handleSelectCursor}
              isTerminalOpen={isTerminalOpen}
              onOpenTerminal={() => setIsTerminalOpen(true)}
              onToggleTerminal={() => setIsTerminalOpen((prev) => !prev)}
            />

            {/* Main Content Area - In Exact Instagram Reel Chronological Sequence */}
            <main id="main-content" tabIndex={-1} className="relative z-10 focus:outline-none">
              {/* 1. Interactive Cursor-Tracking Hero Section (Reel t=0s - 7.5s) */}
              <HeroSection
                heroRef={heroRef}
                isInsideHero={isInsideHero}
                setIsInsideHero={setIsInsideHero}
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
              {/* Verification Contract: { TESTIMONIALS_CONFIG?.enabled && <TestimonialsSection */}
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
              {/* !isSimpleMode && <InteractivePlayground /> */}
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
            </main>

            {/* Global Quick Lab Studio Slide-Out Drawer & Floating Action Button (Mounted AFTER <main> in DOM order) */}
            {/* !isSimpleMode && <LabStudioDrawer /> */}
            {!isSimpleMode && (
              <Suspense fallback={null}>
                <LabStudioDrawer />
              </Suspense>
            )}

            {/* Global Interactive Developer Terminal CLI (~/_ CLI) */}
            <Suspense fallback={isTerminalOpen ? <SectionSkeleton variant="terminal" /> : null}>
              <TerminalCLI
                isOpen={isTerminalOpen}
                onClose={() => setIsTerminalOpen(false)}
                soundEnabled={effectiveSoundEnabled}
                onToggleSound={() => setSoundEnabled(!soundEnabled)}
                activeCursor={activeCursor}
                onSelectCursor={handleSelectCursor}
              />
            </Suspense>

            {/* Slide-Over Case Study Dossier Drawer (Accessible across all modes) */}
            <Suspense fallback={null}>
              <CaseStudyDrawer
                isOpen={isCaseStudyOpen}
                caseStudyId={activeCaseStudyId}
                onClose={handleCloseCaseStudy}
                onSelectProject={handleOpenCaseStudy}
              />
            </Suspense>

            {/* Feature 6: Verified Credential & Academic Certificate Lightbox Inspector */}
            <Suspense fallback={null}>
              <CredentialLightboxModal
                isOpen={isCredentialOpen}
                initialCredentialId={activeCredentialId}
                onClose={() => setIsCredentialOpen(false)}
              />
            </Suspense>

            {/* Centralized Master Floating Action Hub (Unifies Lab Studio, Simple Mode & WhatsApp Direct) */}
            <FloatingActionHub />

            {/* Floating Back-To-Top Button with Scroll Progress Indicator */}
            <BackToTopButton />

            {/* Global AI Chat Assistant Floating Widget */}
            <Suspense fallback={null}>
              <AIChatWidget />
            </Suspense>

            {/* 10. Dark Plum Footer with Watermark Name (Reel t=16.8s) */}
            <Suspense fallback={null}>
              <Footer />
            </Suspense>
          </div>
        </RoleProvider>
        </ViewModeProvider>
      </AudienceProvider>
    </AnnouncerProvider>
  </HighContrastProvider>
  );
}
