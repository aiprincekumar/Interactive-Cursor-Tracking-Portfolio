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
 */
export default function DynamicCursorManager({
  activeCursor = 'butterfly',
  heroRef,
  isInsideHero = false,
  speed = 0.14,
  trailEnabled = true,
  scale = 1,
  reducedMotion: propReducedMotion
}) {
  const isDesktopCursor = useDesktopCursorSupport();

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

  // Disable completely on mobile/touch screens (< 1024px or coarse pointer) or if reduced motion is requested
  if (!isDesktopCursor || effectiveReducedMotion) {
    return null;
  }

  // Check if cursor has a bespoke dedicated component
  const DedicatedComponent = DEDICATED_CURSOR_COMPONENTS[activeCursor];
  if (DedicatedComponent) {
    return (
      <DedicatedComponent
        heroRef={heroRef}
        isInsideHero={isInsideHero}
        speed={speed}
        trailEnabled={trailEnabled}
        scale={scale}
      />
    );
  }

  // All other styles in the 35-cursor suite render through the ModularKinematicCursor
  return (
    <ModularKinematicCursor
      cursorId={activeCursor}
      heroRef={heroRef}
      isInsideHero={isInsideHero}
      speed={speed}
      trailEnabled={trailEnabled}
      scale={scale}
    />
  );
}
