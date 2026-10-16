import { useState, useEffect } from 'react';

/**
 * checkDesktopCursorSupport
 * 
 * Evaluates whether the current environment is a desktop or TV browser
 * with precise mouse/air-mouse pointing capabilities, or a mobile/tablet touch screen.
 * 
 * Criteria for desktop cursor support:
 * 1. Screen width >= 1024px (Tailwind 'lg' breakpoint).
 * 2. Primary pointer is NOT coarse (excludes phones, tablets in portrait or landscape, touch monitors).
 * 3. Primary hover is NOT none (excludes touch devices).
 * 4. Pointer is fine (mouse, trackpad, TV air-mouse/remote pointer) and supports hover.
 */
export function checkDesktopCursorSupport() {
  if (typeof window === 'undefined') return true; // SSR safe fallback

  // 1. Dual detection: Screen width must be at least 1024px (Tailwind lg breakpoint)
  const isLgScreen = typeof window.innerWidth === 'number' ? window.innerWidth >= 1024 : true;
  if (!isLgScreen) {
    return false;
  }

  // 2. Coarse pointer / touch-only check (catches phones, tablets in portrait and landscape)
  const isCoarse = typeof window.matchMedia === 'function' ? window.matchMedia('(pointer: coarse)').matches : false;
  const isHoverNone = typeof window.matchMedia === 'function' ? window.matchMedia('(hover: none)').matches : false;
  if (isCoarse || isHoverNone) {
    return false;
  }

  // 3. Fine pointer check for desktop mouse and TV air-mouse/remote pointers
  const hasFinePointer = typeof window.matchMedia === 'function' ? window.matchMedia('(pointer: fine)').matches : true;
  const hasHover = typeof window.matchMedia === 'function' ? window.matchMedia('(hover: hover)').matches : true;

  return hasFinePointer && hasHover;
}

/**
 * useDesktopCursorSupport
 * 
 * React hook that returns a reactive boolean indicating if desktop cursor
 * controls and custom cursor interactions should be active.
 * Automatically updates on resize, orientation change, or pointer device connection/disconnection.
 */
export function useDesktopCursorSupport() {
  const [isSupported, setIsSupported] = useState(() => checkDesktopCursorSupport());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateSupport = () => {
      setIsSupported(checkDesktopCursorSupport());
    };

    // Listen to resize and orientation changes
    window.addEventListener('resize', updateSupport);
    window.addEventListener('orientationchange', updateSupport);

    // Listen to media query changes if matchMedia is available
    const coarseQuery = typeof window.matchMedia === 'function' ? window.matchMedia('(pointer: coarse)') : null;
    const hoverNoneQuery = typeof window.matchMedia === 'function' ? window.matchMedia('(hover: none)') : null;
    const fineQuery = typeof window.matchMedia === 'function' ? window.matchMedia('(pointer: fine)') : null;
    const hoverQuery = typeof window.matchMedia === 'function' ? window.matchMedia('(hover: hover)') : null;

    if (coarseQuery?.addEventListener) {
      coarseQuery.addEventListener('change', updateSupport);
    }
    if (hoverNoneQuery?.addEventListener) {
      hoverNoneQuery.addEventListener('change', updateSupport);
    }
    if (fineQuery?.addEventListener) {
      fineQuery.addEventListener('change', updateSupport);
    }
    if (hoverQuery?.addEventListener) {
      hoverQuery.addEventListener('change', updateSupport);
    }

    // Trigger check once after mount to sync with hydrated DOM
    updateSupport();

    return () => {
      window.removeEventListener('resize', updateSupport);
      window.removeEventListener('orientationchange', updateSupport);
      if (coarseQuery?.removeEventListener) {
        coarseQuery.removeEventListener('change', updateSupport);
      }
      if (hoverNoneQuery?.removeEventListener) {
        hoverNoneQuery.removeEventListener('change', updateSupport);
      }
      if (fineQuery?.removeEventListener) {
        fineQuery.removeEventListener('change', updateSupport);
      }
      if (hoverQuery?.removeEventListener) {
        hoverQuery.removeEventListener('change', updateSupport);
      }
    };
  }, []);

  return isSupported;
}

export default useDesktopCursorSupport;
