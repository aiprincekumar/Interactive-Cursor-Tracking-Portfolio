import React, { useState, useEffect } from 'react';
import ButterflyCursor from './ButterflyCursor';
import FireflyCursor from './cursors/FireflyCursor';
import StardustCursor from './cursors/StardustCursor';
import AirplaneCursor from './cursors/AirplaneCursor';
import LaserCursor from './cursors/LaserCursor';
import CameraCursor from './cursors/CameraCursor';
import MinimalCursor from './cursors/MinimalCursor';

const CURSOR_COMPONENTS = {
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
 * Central controller that dynamically mounts and renders cursor variants:
 * - 'butterfly' (Default, realistic 3D fluttering wings & stardust)
 * - 'firefly' (Bioluminescent amber/lime pulsing aura & warm ember trail)
 * - 'stardust' (Celestial magic wand with sparkling diamond starbursts)
 * - 'airplane' (Origami paper plane with aerodynamic banking & vapor trail)
 * - 'laser' (Cyberpunk neon laser pointer reticle & glowing beam)
 * - 'camera' (Photography viewfinder, focus ring & shutter snap aperture)
 * - 'minimal' (Luxury dual-layer magnetic follower ring & precision center dot)
 * 
 * Responsive & Accessibility Discipline:
 * - Desktop-only enforcement: Auto-disabled on touch devices / coarse pointer to preserve native mobile UX
 * - Respects prefers-reduced-motion media query
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
  const [isDesktopFinePointer, setIsDesktopFinePointer] = useState(() => {
    if (typeof window === 'undefined') return true;
    const hasFinePointer = window.matchMedia ? window.matchMedia('(pointer: fine)').matches : true;
    const isTouchOnly = 'ontouchstart' in window && !hasFinePointer;
    return hasFinePointer && !isTouchOnly;
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // Track responsive screen pointer fine capabilities and reduced motion
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const pointerQuery = window.matchMedia('(pointer: fine)');
    const handlePointerChange = (e) => {
      setIsDesktopFinePointer(e.matches);
    };

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    if (pointerQuery.addEventListener) {
      pointerQuery.addEventListener('change', handlePointerChange);
      motionQuery.addEventListener('change', handleMotionChange);
    }

    return () => {
      if (pointerQuery.removeEventListener) {
        pointerQuery.removeEventListener('change', handlePointerChange);
        motionQuery.removeEventListener('change', handleMotionChange);
      }
    };
  }, []);

  // Compute effective reduced motion (prop overrides system if passed)
  const effectiveReducedMotion = propReducedMotion !== undefined ? propReducedMotion : prefersReducedMotion;

  // Disable completely on touch devices or if reduced motion is requested
  if (!isDesktopFinePointer || effectiveReducedMotion) {
    return null;
  }

  // Lookup target cursor component (fallback to Butterfly)
  const CursorComponent = CURSOR_COMPONENTS[activeCursor] || ButterflyCursor;

  return (
    <CursorComponent
      heroRef={heroRef}
      isInsideHero={isInsideHero}
      speed={speed}
      trailEnabled={trailEnabled}
      scale={scale}
    />
  );
}
