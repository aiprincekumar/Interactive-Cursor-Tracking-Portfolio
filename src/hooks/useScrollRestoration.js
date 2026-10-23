import { useEffect, useRef } from 'react';

export const RESTORATION_STORAGE_KEY = 'portfolio_last_active_section';

export const SECTION_IDS = [
  'hero',
  'about',
  'skills',
  'experience',
  'projects',
  'achievements',
  'social-proof',
  'testimonials',
  'gallery',
  'playground',
  'faq',
  'contact'
];

/**
 * useScrollRestoration
 *
 * Provides smooth animated scroll restoration to the last active section on refresh,
 * overcoming browser early scroll clamping caused by dynamic React.Suspense lazy-loaded sections.
 *
 * 1. Sets history.scrollRestoration = 'manual' to prevent premature browser jumping.
 * 2. Checks window.location.hash or sessionStorage('portfolio_last_active_section').
 * 3. Smoothly animates scrolling down from top to the target section once layout expands.
 * 4. Retries/re-anchors for up to 2.5s as lazy-loaded components finish expanding the layout.
 * 5. Instantly cancels auto-scroll if the user manually touches, scrolls, or interacts.
 * 6. Persists the active section to sessionStorage during normal browsing.
 */
export function useScrollRestoration() {
  const isRestoringRef = useRef(false);
  const userInterruptedRef = useRef(false);
  const targetSectionRef = useRef(null);
  const isSettledRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Enforce manual scroll restoration
    if ('scrollRestoration' in window.history) {
      try {
        window.history.scrollRestoration = 'manual';
      } catch {
        // Fallback for restricted environments
      }
    }

    // 2. Discover target section from hash or sessionStorage
    let target = '';
    try {
      if (window.location.hash && window.location.hash.length > 1) {
        target = window.location.hash.slice(1);
      }
      if (!target && window.sessionStorage) {
        target = sessionStorage.getItem(RESTORATION_STORAGE_KEY) || '';
      }
    } catch {
      target = '';
    }

    target = (target || '').trim();

    // If no target or target is 'hero', stay at top
    if (!target || target === 'hero') {
      isSettledRef.current = true;
      return;
    }

    // Guard against invalid or unrecognized section anchors
    const isValidTarget = SECTION_IDS.includes(target) || !!document.getElementById(target);
    if (!isValidTarget) {
      isSettledRef.current = true;
      return;
    }

    targetSectionRef.current = target;
    isRestoringRef.current = true;
    userInterruptedRef.current = false;

    // 3. Graceful cancellation on user interaction
    const cancelRestoration = () => {
      userInterruptedRef.current = true;
      isRestoringRef.current = false;
      isSettledRef.current = true;
    };

    const cancelEvents = ['wheel', 'touchstart', 'pointerdown'];
    cancelEvents.forEach((evt) => {
      window.addEventListener(evt, cancelRestoration, { passive: true, once: true });
    });

    const handleKeyCancel = (e) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Space', 'Home', 'End'].includes(e.code)) {
        cancelRestoration();
      }
    };
    window.addEventListener('keydown', handleKeyCancel, { passive: true });

    // 4. Smooth animated scroll loop
    const MAX_SETTLE_MS = 2500;
    const startTime = Date.now();
    let lastTargetY = -1;
    let observer = null;
    let rafSchedule = null;

    const performScroll = () => {
      if (userInterruptedRef.current) return;
      const targetId = targetSectionRef.current;
      if (!targetId) return;

      const el = document.getElementById(targetId);
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const currentScrollY = window.scrollY || window.pageYOffset || 0;
      const absoluteTop = rect.top + currentScrollY;

      // Anti-clamping safeguard: Ensure document has enough scrollable space before scrolling.
      // If layout hasn't expanded past viewport, wait for lazy chunks/images to render.
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const targetIndex = SECTION_IDS.indexOf(targetId);
      if (targetIndex > 2 && scrollableHeight < 200) {
        // Layout hasn't expanded sufficiently yet; defer scroll until content loads
        return;
      }

      // Only re-scroll if position drifted by more than 16px (e.g. lazy content above mounted)
      if (Math.abs(absoluteTop - lastTargetY) > 16) {
        lastTargetY = absoluteTop;
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const scheduleScroll = () => {
      if (userInterruptedRef.current || !isRestoringRef.current) return;
      if (rafSchedule) cancelAnimationFrame(rafSchedule);
      rafSchedule = requestAnimationFrame(() => {
        performScroll();
      });
    };

    // Initial smooth scroll after brief layout paint
    const initialTimer = setTimeout(() => {
      if (!userInterruptedRef.current) {
        performScroll();
      }
    }, 100);

    // Watch for document layout expansion as Suspense chunks resolve
    if (typeof ResizeObserver !== 'undefined' && document.body) {
      observer = new ResizeObserver(() => {
        if (!userInterruptedRef.current && isRestoringRef.current) {
          if (Date.now() - startTime <= MAX_SETTLE_MS) {
            scheduleScroll();
          }
        }
      });
      observer.observe(document.body);
    }

    // Interval safeguard checking for element arrival or layout expansion
    const pollInterval = setInterval(() => {
      if (userInterruptedRef.current || Date.now() - startTime > MAX_SETTLE_MS) {
        isRestoringRef.current = false;
        isSettledRef.current = true;
        clearInterval(pollInterval);
        return;
      }
      performScroll();
    }, 250);

    const endTimer = setTimeout(() => {
      isRestoringRef.current = false;
      isSettledRef.current = true;
      if (observer) observer.disconnect();
    }, MAX_SETTLE_MS);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(endTimer);
      clearInterval(pollInterval);
      if (rafSchedule) cancelAnimationFrame(rafSchedule);
      if (observer) observer.disconnect();
      cancelEvents.forEach((evt) => {
        window.removeEventListener(evt, cancelRestoration);
      });
      window.removeEventListener('keydown', handleKeyCancel);
    };
  }, []);

  // 5. Normal browsing scroll listener: update sessionStorage with current section
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let ticking = false;
    const handleScroll = () => {
      // Don't overwrite during initial restoration or before layout has settled
      if (isRestoringRef.current || !isSettledRef.current) return;

      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(() => {
          try {
            const scrollY = window.scrollY || window.pageYOffset || 0;
            const scrollHeight = document.documentElement.scrollHeight || 0;
            const innerHeight = window.innerHeight || 0;

            // Only capture bottom 'contact' if user has genuinely scrolled down and page is scrollable
            if (scrollY > 300 && innerHeight + scrollY >= scrollHeight - 60) {
              sessionStorage.setItem(RESTORATION_STORAGE_KEY, 'contact');
              ticking = false;
              return;
            }

            // Top of page safeguard
            if (scrollY < 80) {
              sessionStorage.setItem(RESTORATION_STORAGE_KEY, 'hero');
              ticking = false;
              return;
            }

            let current = 'hero';
            for (const id of SECTION_IDS) {
              const el = document.getElementById(id);
              if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= 180) {
                  current = id;
                }
              }
            }
            if (current) {
              sessionStorage.setItem(RESTORATION_STORAGE_KEY, current);
            }
          } catch {
            // Ignore restricted storage errors
          }
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}
