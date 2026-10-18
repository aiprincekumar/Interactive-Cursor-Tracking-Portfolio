import React, { useState, useEffect } from 'react';
import ButterflyCursor from './ButterflyCursor';
import FireflyCursor from './cursors/FireflyCursor';
import StardustCursor from './cursors/StardustCursor';
import AirplaneCursor from './cursors/AirplaneCursor';
import LaserCursor from './cursors/LaserCursor';
import CameraCursor from './cursors/CameraCursor';
import MinimalCursor from './cursors/MinimalCursor';
import ModularKinematicCursor from './cursors/ModularKinematicCursor';
import { useDesktopCursorSupport } from '../hooks/useDesktopCursorSupport';
import { useLab } from '../context/LabContext';

/**
 * Dedicated bespoke cursor components that have specialized interactive mechanics
 */
const DEDICATED_CURSOR_COMPONENTS = {
  butterfly: ButterflyCursor,
  firefly: FireflyCursor,
  stardust: StardustCursor,
  wand: StardustCursor,
  airplane: AirplaneCursor,
  laser: LaserCursor,
  camera: CameraCursor,
  minimal: MinimalCursor
};

/**
 * DynamicCursorManager
 * 
 * Central high-performance controller for the 35-cursor suite:
 * - 60-120+ FPS Kinematics Engine with Zero Lag
 * - Strict single-active loop discipline: Only the currently selected cursor
 *   is mounted and running an animation loop; unmounted cursors clean up completely.
 * - Mobile / Tablet safety: Auto-disabled on touch / coarse pointer devices to preserve native touch UX.
 * - Accessibility: Fully respects the prefers-reduced-motion media query and user prop overrides.
 * - Fallback: When customCursorEnabled is false, returns null and cleanly restores system cursor.
 */
export default function DynamicCursorManager({
  activeCursor = 'butterfly',
  heroRef,
  isInsideHero = false,
  customCursorEnabled: propCustomCursorEnabled,
  speed,
  trailEnabled,
  scale,
  gravity = 0,
  particleColor,
  wingDynamics = 1.0,
  reducedMotion: propReducedMotion
}) {
  const lab = useLab();
  const isDesktopCursor = useDesktopCursorSupport();

  const customCursorEnabled = propCustomCursorEnabled !== undefined
    ? propCustomCursorEnabled
    : (lab?.customCursorEnabled ?? true);

  const effectiveSpeed = speed ?? lab?.flightSpeed ?? 0.14;
  const effectiveTrail = trailEnabled ?? lab?.stardustTrailEnabled ?? true;
  const effectiveScale = scale ?? lab?.cursorScale ?? 1.0;
  const effectiveParticleColor = particleColor ?? lab?.particleColor ?? '#FF4D6D';

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // Track prefers-reduced-motion changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', handleMotionChange);
    }

    return () => {
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener('change', handleMotionChange);
      }
    };
  }, []);

  // Compute effective reduced motion (prop overrides system if passed)
  const effectiveReducedMotion = propReducedMotion !== undefined ? propReducedMotion : prefersReducedMotion;

  // Manage .custom-cursor-disabled class and direct style cursor overrides on document body and html root
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const isCursorActive = customCursorEnabled && isDesktopCursor && !effectiveReducedMotion;
    document.body.classList.toggle('custom-cursor-disabled', !isCursorActive);
    document.documentElement.classList.toggle('custom-cursor-disabled', !isCursorActive);

    if (!isCursorActive) {
      document.documentElement.style.cursor = 'auto';
      document.body.style.cursor = 'auto';
    } else {
      document.documentElement.style.cursor = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.body.classList.remove('custom-cursor-disabled');
      document.documentElement.classList.remove('custom-cursor-disabled');
      document.documentElement.style.cursor = '';
      document.body.style.cursor = '';
    };
  }, [customCursorEnabled, isDesktopCursor, effectiveReducedMotion]);

  // Disable completely if custom cursor is disabled, or on mobile/touch screens, or if reduced motion is requested
  if (!customCursorEnabled || !isDesktopCursor || effectiveReducedMotion) {
    return null;
  }

  // Check if cursor has a bespoke dedicated component
  const DedicatedComponent = DEDICATED_CURSOR_COMPONENTS[activeCursor];
  if (DedicatedComponent) {
    return (
      <DedicatedComponent
        heroRef={heroRef}
        isInsideHero={isInsideHero}
        speed={effectiveSpeed}
        trailEnabled={effectiveTrail}
        scale={effectiveScale}
        gravity={gravity}
        particleColor={effectiveParticleColor}
        wingDynamics={wingDynamics}
      />
    );
  }

  // All other styles in the 35-cursor suite render through the ModularKinematicCursor
  return (
    <ModularKinematicCursor
      cursorId={activeCursor}
      heroRef={heroRef}
      isInsideHero={isInsideHero}
      speed={effectiveSpeed}
      trailEnabled={effectiveTrail}
      scale={effectiveScale}
      gravity={gravity}
      particleColor={effectiveParticleColor}
      wingDynamics={wingDynamics}
    />
  );
}
