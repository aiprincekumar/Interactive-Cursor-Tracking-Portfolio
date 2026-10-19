import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import DynamicCursorManager from './components/DynamicCursorManager';
import TechMarqueeBanner from './components/TechMarqueeBanner';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import CodingAchievementsSection from './components/CodingAchievementsSection';
import CameraRollGallery from './components/CameraRollGallery';
import InteractivePlayground from './components/InteractivePlayground';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import LabStudioDrawer from './components/LabStudioDrawer';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';
import FloatingSimpleModeToggle from './components/FloatingSimpleModeToggle';
import BackToTopButton from './components/BackToTopButton';
import { soundFX } from './utils/audio';
import { useLab } from './context/LabContext';
import { RoleProvider } from './context/RoleContext';
import { useSimpleMode } from './context/SimpleModeContext';

export default function App() {
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
    customCursorEnabled
  } = useLab();

  const [activeCursor, setActiveCursor] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('active_cursor_variant');
      if (saved) return saved;
    }
    return 'butterfly';
  });

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
    <RoleProvider soundEnabled={effectiveSoundEnabled}>
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0B0813] text-[#18181B] dark:text-[#F5F2F8] transition-colors duration-300 relative selection:bg-[#FF4D6D] selection:text-white overflow-x-hidden">
        {/* Background Subtle Mesh Dots */}
      <div className="fixed inset-0 bg-dot-pattern opacity-50 dark:opacity-30 pointer-events-none z-0 transition-opacity duration-300" />

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

      {/* Global Quick Lab Studio Slide-Out Drawer & Floating Action Button (Disabled in Simple Mode) */}
      {!isSimpleMode && <LabStudioDrawer />}

      {/* Floating Direct WhatsApp Channel Button (Unlocked via Contact Section) */}
      <FloatingWhatsAppButton />

      {/* Floating Persistent Simple Mode Toggle FAB (Always Visible) */}
      <FloatingSimpleModeToggle />

      {/* Floating Back-To-Top Button with Scroll Progress Indicator */}
      <BackToTopButton />

      {/* Top Navbar */}
      <Navbar
        soundEnabled={effectiveSoundEnabled}
        setSoundEnabled={setSoundEnabled}
        activeCursor={activeCursor}
        onSelectCursor={handleSelectCursor}
      />

      {/* Main Content Area - In Exact Instagram Reel Chronological Sequence */}
      <main className="relative z-10">
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
        <AboutSection soundEnabled={effectiveSoundEnabled} />

        {/* 4. "What I work with" / Interactive Skill Matrix & Dark Card (Reel t=9.3s - 11.8s) */}
        <SkillsSection />

        {/* 5. "Journey & Experience" / Standalone Career & Production Milestones */}
        <ExperienceSection />

        {/* 6. "Selected work" / PolicyGuard AI & Payment Gateway System (Reel t=12.0s - 14.8s) */}
        <ProjectsSection />

        {/* 6. Competitive Programming & Coding Records (Reel t=15.0s - 16.0s) */}
        <CodingAchievementsSection />

        {/* 7. Interactive Polaroid Studio & Camera Roll Memories - Hidden in Simple Mode */}
        {!isSimpleMode && (
          <CameraRollGallery
            capturedPhotos={capturedPhotos}
          />
        )}

        {/* 8. Portfolio Control Center - Hidden in Simple Mode */}
        {!isSimpleMode && <InteractivePlayground />}

        {/* 9. Contact: "Let's build something meaningful." (Reel t=16.1s - 16.9s) */}
        <ContactSection />
      </main>

      {/* 10. Dark Plum Footer with Watermark Name (Reel t=16.8s) */}
      <Footer />
    </div>
  </RoleProvider>
  );
}
