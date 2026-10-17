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
import { soundFX } from './utils/audio';
import { useLab } from './context/LabContext';
import { RoleProvider } from './context/RoleContext';

export default function App() {
  const heroRef = useRef(null);
  const [isInsideHero, setIsInsideHero] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [forcedState, setForcedState] = useState(null);
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
    audioPitch,
    setCursorScale,
    setFlightSpeed,
    setGravity,
    setTrailEnabled,
    setParticleColor,
    setAudioPitch
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
    soundFX.playCursorSelect();
  };

  const handlePhotoCaptured = (newPhoto) => {
    setCapturedPhotos((prev) => [newPhoto, ...prev]);
  };

  return (
    <RoleProvider soundEnabled={soundEnabled}>
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0B0813] text-[#18181B] dark:text-[#F5F2F8] transition-colors duration-300 relative selection:bg-[#FF4D6D] selection:text-white overflow-x-hidden">
        {/* Background Subtle Mesh Dots */}
      <div className="fixed inset-0 bg-dot-pattern opacity-50 dark:opacity-30 pointer-events-none z-0 transition-opacity duration-300" />

      {/* Dynamic Multi-Variant Interactive Cursor Manager */}
      {!reducedMotion && (
        <DynamicCursorManager
          activeCursor={activeCursor}
          heroRef={heroRef}
          isInsideHero={isInsideHero}
          speed={flightSpeed}
          trailEnabled={trailEnabled}
          scale={cursorScale}
          reducedMotion={reducedMotion}
          gravity={gravity}
          particleColor={particleColor}
          wingDynamics={wingDynamics}
        />
      )}

      {/* Global Quick Lab Studio Slide-Out Drawer & Floating Action Button */}
      <LabStudioDrawer />

      {/* Top Navbar */}
      <Navbar
        soundEnabled={soundEnabled}
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
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          forcedState={forcedState}
          reducedMotion={reducedMotion}
        />

        {/* 2. Diagonal Crossed Marquee Ribbons with Butterfly Delimiters (Reel t=7.85s) */}
        <TechMarqueeBanner />

        {/* 3. "Who I am" / Personal Narrative & Education (Reel t=8.3s - 9.2s) */}
        <AboutSection soundEnabled={soundEnabled} />

        {/* 4. "What I work with" / Interactive Skill Matrix & Dark Card (Reel t=9.3s - 11.8s) */}
        <SkillsSection />

        {/* 5. "Journey & Experience" / Standalone Career & Production Milestones */}
        <ExperienceSection />

        {/* 6. "Selected work" / PolicyGuard AI & Payment Gateway System (Reel t=12.0s - 14.8s) */}
        <ProjectsSection />

        {/* 6. Competitive Programming & Coding Records (Reel t=15.0s - 16.0s) */}
        <CodingAchievementsSection />

        {/* 7. Interactive Polaroid Studio & Camera Roll Memories */}
        <CameraRollGallery
          capturedPhotos={capturedPhotos}
        />

        {/* 8. Real-Time Physics & Cursor Tuner Lab */}
        <InteractivePlayground
          butterflySpeed={flightSpeed}
          setButterflySpeed={setFlightSpeed}
          trailEnabled={trailEnabled}
          setTrailEnabled={setTrailEnabled}
          butterflyScale={cursorScale}
          setButterflyScale={setCursorScale}
          forcedState={forcedState}
          setForcedState={setForcedState}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          reducedMotion={reducedMotion}
          setReducedMotion={setReducedMotion}
          gravity={gravity}
          setGravity={setGravity}
          particleColor={particleColor}
          setParticleColor={setParticleColor}
          audioPitch={audioPitch}
          setAudioPitch={setAudioPitch}
        />

        {/* 9. Contact: "Let's build something meaningful." (Reel t=16.1s - 16.9s) */}
        <ContactSection />
      </main>

      {/* 10. Dark Plum Footer with Watermark Name (Reel t=16.8s) */}
      <Footer />
    </div>
  </RoleProvider>
  );
}
