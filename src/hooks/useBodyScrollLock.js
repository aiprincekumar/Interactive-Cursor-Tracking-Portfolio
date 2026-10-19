import { useEffect } from 'react';

/**
 * useBodyScrollLock
 *
 * Custom hook to lock body scrolling conditionally when a modal or mobile drawer is open,
 * specifically constrained to mobile viewports below the specified breakpoint (default: 768px).
 *
 * When isLocked is true and window.innerWidth < breakpoint:
 * - Caches original document.body.style.overflow and document.documentElement.style.overflow.
 * - Sets document.body.style.overflow = 'hidden'.
 * - Sets document.body.style.overscrollBehavior = 'none'.
 *
 * Handles window resize listener so if the viewport goes >= breakpoint, body scroll
 * is automatically restored. Always restores original styles when isLocked changes to false
 * or when the component unmounts. SSR-safe.
 *
 * @param {boolean} isLocked - Whether scroll lock should be active.
 * @param {number} [breakpoint=768] - Viewport width breakpoint in pixels below which locking applies.
 */
export function useBodyScrollLock(isLocked, breakpoint = 768) {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Cache original overflow & overscroll styles to guarantee full restoration
    const originalBodyOverflow = document.body.style.overflow;
    const originalDocOverflow = document.documentElement.style.overflow;
    const originalBodyOverscroll = document.body.style.overscrollBehavior;

    let applied = false;

    const applyLock = () => {
      if (!applied) {
        document.body.style.overflow = 'hidden';
        document.body.style.overscrollBehavior = 'none';
        applied = true;
      }
    };

    const restoreLock = () => {
      if (applied) {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalDocOverflow;
        document.body.style.overscrollBehavior = originalBodyOverscroll;
        applied = false;
      }
    };

    const handleResize = () => {
      if (isLocked && window.innerWidth < breakpoint) {
        applyLock();
      } else {
        restoreLock();
      }
    };

    if (isLocked && window.innerWidth < breakpoint) {
      applyLock();
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      restoreLock();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [isLocked, breakpoint]);
}

export default useBodyScrollLock;
