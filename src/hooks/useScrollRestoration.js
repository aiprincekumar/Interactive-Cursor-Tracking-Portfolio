import { useEffect, useRef } from 'react';

export const RESTORATION_STORAGE_KEY = 'portfolio_last_active_section';
export const PORTFOLIO_LAST_URL_KEY = 'portfolio_last_url';
export const PORTFOLIO_SCROLL_POS_KEY = 'portfolio_scroll_position';
export const AUTO_SCROLL_STORAGE_KEY = 'portfolio_auto_scroll_on_refresh';
export const SCROLL_RESTORATION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours TTL

export const SECTION_IDS = [
  'hero',
  'about',
  'skills',
  'experience',
  'projects',
  'achievements',
  'social-proof',
  'testimonials',
  'faq',
  'contact'
];

/**
 * useScrollRestoration
 *
 * Provides smooth animated scroll restoration to the last active section on refresh,
 * adhering to the strict Hero-by-default specification and 24-hour TTL validation.
 *
 * 1. Sets history.scrollRestoration = 'manual' to prevent premature browser native jump.
 * 2. Toggle Guard: Reads 'portfolio_auto_scroll_on_refresh' from sessionStorage / localStorage.
 *    If explicitly 'false', resets to top (window.scrollTo(0, 0)) and skips restoration.
 * 3. Hero by Default: If localStorage 'portfolio_last_url' is absent, expired (>24h), invalid,
 *    or points to '#hero', the page strictly stays at top (window.scrollTo(0, 0)) with zero
 *    auto-scroll and zero ResizeObserver layout loops.
 * 4. Verified restoration: Only if an unexpired (<=24h) and valid non-hero target exists,
 *    smoothly scrolls to that section / saved coordinates as lazy chunks expand layout.
 * 5. User interruption: Instantly cancels restoration if user touches, wheels, or presses navigation keys.
 * 6. Debounced persistence (300ms): Debounces scroll and navigation updates, saving active section
 *    and exact X/Y coordinates to both localStorage and sessionStorage under:
 *    - 'portfolio_scroll_position': { x, y, url, pathname, hash, section, timestamp }
 *    - 'portfolio_last_url': {"url": "#section", "timestamp": ...} (or '#hero' for Hero)
 *    - 'portfolio_last_active_section': sectionId
 * 7. Dynamic hash synchronization: Keeps URL hash cleanly in sync during browsing.
 */
export function useScrollRestoration() {
  const isRestoringRef = useRef(false);
  const userInterruptedRef = useRef(false);
  const targetSectionRef = useRef(null);
  const isSettledRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Enforce manual scroll restoration to neutralize native browser jumps
    if ('scrollRestoration' in window.history) {
      try {
        window.history.scrollRestoration = 'manual';
      } catch {
        // Fallback for restricted environments
      }
    }

    // 2. Toggle check: Read portfolio_auto_scroll_on_refresh from localStorage / sessionStorage.
    // If explicitly set to false, do NOT restore scroll: force window.scrollTo(0, 0) immediately, cancel all restoration, and return.
    let isAutoScrollEnabled = true;
    try {
      const sessionToggle = window.sessionStorage?.getItem(AUTO_SCROLL_STORAGE_KEY);
      if (sessionToggle !== null) {
        if (sessionToggle === 'false') isAutoScrollEnabled = false;
      } else {
        const localToggle = window.localStorage?.getItem(AUTO_SCROLL_STORAGE_KEY);
        if (localToggle !== null && localToggle === 'false') {
          isAutoScrollEnabled = false;
        }
      }
    } catch {}

    if (!isAutoScrollEnabled) {
      window.scrollTo(0, 0);
      isSettledRef.current = true;
      try {
        if (window.location.hash && window.location.hash !== '#hero') {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } catch {}
      return;
    }

    // 3. Dual Storage check for exact X/Y coordinate position (sessionStorage first, then localStorage)
    let savedPosition = null;
    try {
      if (window.sessionStorage) {
        const rawSess = sessionStorage.getItem(PORTFOLIO_SCROLL_POS_KEY);
        if (rawSess) {
          const parsed = JSON.parse(rawSess);
          if (parsed && typeof parsed === 'object' && typeof parsed.timestamp === 'number') {
            if (Date.now() - parsed.timestamp < SCROLL_RESTORATION_TTL_MS) {
              savedPosition = parsed;
            }
          }
        }
      }
      if (!savedPosition && window.localStorage) {
        const rawLoc = localStorage.getItem(PORTFOLIO_SCROLL_POS_KEY);
        if (rawLoc) {
          const parsed = JSON.parse(rawLoc);
          if (parsed && typeof parsed === 'object' && typeof parsed.timestamp === 'number') {
            if (Date.now() - parsed.timestamp < SCROLL_RESTORATION_TTL_MS) {
              savedPosition = parsed;
            }
          }
        }
      }
    } catch {
      savedPosition = null;
    }

    // 4. Validate localStorage 'portfolio_last_url' with 24-hour TTL
    let validatedTarget = null;
    try {
      if (window.localStorage) {
        const raw = localStorage.getItem(PORTFOLIO_LAST_URL_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (
            parsed &&
            typeof parsed === 'object' &&
            parsed.url &&
            typeof parsed.timestamp === 'number'
          ) {
            const cleanedId = parsed.url.replace(/^#/, '').trim();
            if (cleanedId === 'gallery' || cleanedId === 'playground') {
              const resetPayload = JSON.stringify({
                url: '#hero',
                timestamp: Date.now()
              });
              localStorage.setItem(PORTFOLIO_LAST_URL_KEY, resetPayload);
              if (window.sessionStorage) {
                sessionStorage.setItem(PORTFOLIO_LAST_URL_KEY, resetPayload);
                sessionStorage.setItem(RESTORATION_STORAGE_KEY, 'hero');
              }
            } else {
              const isFresh = Date.now() - parsed.timestamp < SCROLL_RESTORATION_TTL_MS;
              if (isFresh) {
                if (cleanedId && cleanedId !== 'hero' && SECTION_IDS.includes(cleanedId)) {
                  validatedTarget = cleanedId;
                }
              }
            }
          }
        }
      }
    } catch {
      validatedTarget = null;
    }

    // Fallback check for sessionStorage (compatibility audit)
    if (!validatedTarget) {
      try {
        if (window.sessionStorage) {
          const sessVal = sessionStorage.getItem(RESTORATION_STORAGE_KEY);
          if (sessVal && sessVal !== 'hero' && SECTION_IDS.includes(sessVal)) {
            validatedTarget = sessVal;
          }
        }
      } catch {}
    }

    // Check savedPosition section if not yet found
    if (!validatedTarget && savedPosition && savedPosition.section) {
      const sId = savedPosition.section.replace(/^#/, '').trim();
      if (sId && sId !== 'hero' && SECTION_IDS.includes(sId)) {
        validatedTarget = sId;
      }
    }

    // Fallback check for URL hash if present
    if (!validatedTarget && typeof window !== 'undefined' && window.location.hash) {
      const hashId = window.location.hash.replace(/^#/, '').trim();
      if (hashId && hashId !== 'hero' && SECTION_IDS.includes(hashId)) {
        validatedTarget = hashId;
      }
    }

    // 5. Strict Hero Guard:
    // If no valid unexpired section found, or user was at Hero:
    // Immediately anchor to (0, 0) and DO NOT start ResizeObserver, intervals, or auto-scroll loops.
    if (!validatedTarget) {
      window.scrollTo(0, 0);
      isSettledRef.current = true;
      try {
        if (window.location.hash && window.location.hash !== '#hero') {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } catch {}
      return;
    }

    // 6. Section & Coordinate restoration for valid non-hero target
    targetSectionRef.current = validatedTarget;
    isRestoringRef.current = true;
    userInterruptedRef.current = false;

    // Graceful cancellation on user interaction
    const cancelRestoration = () => {
      userInterruptedRef.current = true;
      isRestoringRef.current = false;
      isSettledRef.current = true;
    };

    const cancelEvents = ['wheel', 'touchstart', 'touchmove', 'pointerdown'];
    cancelEvents.forEach((evt) => {
      window.addEventListener(evt, cancelRestoration, { passive: true, once: true });
    });

    const handleKeyCancel = (e) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Space', 'Home', 'End'].includes(e.code)) {
        cancelRestoration();
      }
    };
    window.addEventListener('keydown', handleKeyCancel, { passive: true });

    // Listen to live auto-scroll toggle change events
    const handleToggleEvent = (e) => {
      if (e?.detail?.enabled === false) {
        cancelRestoration();
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('portfolio:auto-scroll-toggle', handleToggleEvent);

    // Smooth animated scroll loop
    const MAX_SETTLE_MS = 2500;
    const startTime = Date.now();
    let lastTargetY = -1;
    let observer = null;
    let rafSchedule = null;
    let hasDispatchedSettle = false;

    const dispatchSettleEvent = () => {
      if (hasDispatchedSettle) return;
      hasDispatchedSettle = true;
      const targetDetail = (savedPosition && savedPosition.section) ? savedPosition.section : targetSectionRef.current;
      if (
        typeof window !== 'undefined' &&
        typeof window.dispatchEvent === 'function' &&
        typeof CustomEvent !== 'undefined'
      ) {
        try {
          window.dispatchEvent(
            new CustomEvent('portfolio:scroll-restoration-settle', {
              detail: { section: targetDetail, target: targetDetail }
            })
          );
        } catch {}
      }
    };

    const performScroll = () => {
      if (userInterruptedRef.current) return;
      const targetId = targetSectionRef.current;
      if (!targetId) return;

      const el = document.getElementById(targetId);
      if (!el) {
        if (savedPosition && typeof savedPosition.x === 'number' && typeof savedPosition.y === 'number') {
          window.scrollTo({ left: savedPosition.x, top: savedPosition.y, behavior: 'smooth' });
        }
        return;
      }

      const rect = el.getBoundingClientRect();
      const currentScrollY = window.scrollY || window.pageYOffset || 0;
      const currentScrollX = window.scrollX || window.pageXOffset || 0;
      const absoluteTop = rect.top + currentScrollY;

      // Anti-clamping safeguard: Ensure document has enough scrollable space before scrolling.
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const targetIndex = SECTION_IDS.indexOf(targetId);
      if (targetIndex > 2 && scrollableHeight < 200) {
        return;
      }

      // If exact coordinates are available and section alignment is close, restore coordinates
      if (
        savedPosition &&
        typeof savedPosition.x === 'number' &&
        typeof savedPosition.y === 'number' &&
        Math.abs(absoluteTop - savedPosition.y) <= 40
      ) {
        if (Math.abs(currentScrollY - savedPosition.y) > 16 || Math.abs(currentScrollX - savedPosition.x) > 16) {
          window.scrollTo({ left: savedPosition.x, top: savedPosition.y, behavior: 'smooth' });
        }
      } else if (Math.abs(absoluteTop - lastTargetY) > 16) {
        // Only re-scroll if position drifted by more than 16px (e.g. lazy content above mounted)
        lastTargetY = absoluteTop;
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      try {
        const savedHash = (savedPosition && savedPosition.hash) ? savedPosition.hash : `#${targetId}`;
        const targetHash = savedHash.startsWith('#') ? savedHash : `#${savedHash}`;
        if (window.location.hash !== targetHash) {
          history.replaceState(null, '', targetHash);
        }
      } catch {}
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
        if (savedPosition && typeof savedPosition.x === 'number' && typeof savedPosition.y === 'number') {
          window.scrollTo({ left: savedPosition.x, top: savedPosition.y, behavior: 'smooth' });
        }
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
        if (!userInterruptedRef.current) {
          dispatchSettleEvent();
        }
        return;
      }
      performScroll();
    }, 250);

    const endTimer = setTimeout(() => {
      isRestoringRef.current = false;
      isSettledRef.current = true;
      if (observer) observer.disconnect();
      if (!userInterruptedRef.current) {
        dispatchSettleEvent();
      }
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
      window.removeEventListener('portfolio:auto-scroll-toggle', handleToggleEvent);
    };
  }, []);

  // 7. Normal browsing observer & scroll persistence: dual storage (localStorage + sessionStorage)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let scrollEndTimer = null;
    let activeSection = 'hero';
    let lastSyncedHash = null;
    const intersectingMap = new Map();

    const persistActiveSection = (sectionId) => {
      const cleanId = (sectionId || 'hero').replace(/^#/, '').trim() || 'hero';
      const url = cleanId === 'hero' ? '#hero' : `#${cleanId}`;
      const timestamp = Date.now();
      const lastUrlPayload = JSON.stringify({
        url,
        timestamp
      });

      const x = window.scrollX || window.pageXOffset || 0;
      const y = window.scrollY || window.pageYOffset || 0;
      const scrollPosPayload = JSON.stringify({
        x,
        y,
        url: window.location.href,
        pathname: window.location.pathname,
        hash: window.location.hash,
        section: cleanId,
        timestamp
      });

      // Save to BOTH localStorage and sessionStorage
      try {
        if (window.localStorage) {
          localStorage.setItem(PORTFOLIO_SCROLL_POS_KEY, scrollPosPayload);
          localStorage.setItem(PORTFOLIO_LAST_URL_KEY, lastUrlPayload);
          localStorage.setItem(RESTORATION_STORAGE_KEY, cleanId);
        }
      } catch {}

      try {
        if (window.sessionStorage) {
          sessionStorage.setItem(PORTFOLIO_SCROLL_POS_KEY, scrollPosPayload);
          sessionStorage.setItem(PORTFOLIO_LAST_URL_KEY, lastUrlPayload);
          sessionStorage.setItem(RESTORATION_STORAGE_KEY, cleanId);
        }
      } catch {}
    };

    const syncHash = (sectionId) => {
      try {
        if (sectionId === 'hero') {
          if (window.location.hash && lastSyncedHash !== '') {
            lastSyncedHash = '';
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        } else {
          const targetHash = `#${sectionId}`;
          if (window.location.hash !== targetHash && lastSyncedHash !== targetHash) {
            lastSyncedHash = targetHash;
            history.replaceState(null, '', targetHash);
          }
        }
      } catch {
        // Ignore restricted history errors
      }
    };

    const updateActiveSection = () => {
      // Don't overwrite during initial restoration or before layout has settled
      if (isRestoringRef.current || !isSettledRef.current) return;

      let current = null;

      const scrollY = window.scrollY || window.pageYOffset || 0;
      if (scrollY < 80) {
        current = 'hero';
        activeSection = 'hero';
        syncHash('hero');
        return;
      }

      const scrollHeight = document.documentElement.scrollHeight || 0;
      const innerHeight = window.innerHeight || 0;
      const contactEl = document.getElementById('contact');
      const isContactInView = Boolean(
        contactEl &&
        contactEl.getBoundingClientRect().top <= innerHeight * 0.75 &&
        contactEl.getBoundingClientRect().bottom > 0
      );

      if ((scrollY > 300 && innerHeight + scrollY >= scrollHeight - 180) || isContactInView) {
        current = 'contact';
        activeSection = 'contact';
        syncHash('contact');
        return;
      }

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom > 80) {
            current = id;
          }
        }
      }

      if (current) {
        activeSection = current;
        syncHash(current);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersectingMap.set(entry.target.id, entry);
          } else {
            intersectingMap.delete(entry.target.id);
          }
        }
        updateActiveSection();
        if (scrollEndTimer) clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(handleScrollEnd, 150);
      },
      {
        rootMargin: '-80px 0px -50% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1.0]
      }
    );

    const handleScrollEnd = () => {
      if (scrollEndTimer) {
        clearTimeout(scrollEndTimer);
        scrollEndTimer = null;
      }
      if (isRestoringRef.current || !isSettledRef.current) return;
      updateActiveSection();
      persistActiveSection(activeSection);
    };

    // Lightweight scroll listener: handles top/bottom edge checks without any layout queries
    const handleScroll = () => {
      if (isRestoringRef.current || !isSettledRef.current) return;

      const scrollY = window.scrollY || window.pageYOffset || 0;
      if (scrollY < 80) {
        if (activeSection !== 'hero') {
          activeSection = 'hero';
          syncHash('hero');
        }
      } else {
        const scrollHeight = document.documentElement.scrollHeight || 0;
        const innerHeight = window.innerHeight || 0;
        const contactEl = document.getElementById('contact');
        const isContactInView = Boolean(
          contactEl &&
          contactEl.getBoundingClientRect().top <= innerHeight * 0.75 &&
          contactEl.getBoundingClientRect().bottom > 0
        );

        if ((scrollY > 300 && innerHeight + scrollY >= scrollHeight - 180) || isContactInView) {
          if (activeSection !== 'contact') {
            activeSection = 'contact';
            syncHash('contact');
          }
        }
      }

      // Trailing debounce fallback (150ms) for browsers lacking 'scrollend'
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(handleScrollEnd, 150);
    };

    const observedElements = new Set();
    const observeAvailableSections = () => {
      for (const el of observedElements) {
        if (!el.isConnected) {
          try {
            observer.unobserve(el);
          } catch {}
          observedElements.delete(el);
          if (el.id) {
            intersectingMap.delete(el.id);
          }
        }
      }
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && !observedElements.has(el)) {
          observer.observe(el);
          observedElements.add(el);
        }
      });
      updateActiveSection();
    };

    observeAvailableSections();
    const timer1 = setTimeout(observeAvailableSections, 400);
    const timer2 = setTimeout(observeAvailableSections, 1200);
    const timer3 = setTimeout(observeAvailableSections, 2500);

    let mutationObserver = null;
    if (typeof MutationObserver !== 'undefined' && document.body) {
      mutationObserver = new MutationObserver(() => {
        observeAvailableSections();
        if (observedElements.size >= SECTION_IDS.length) {
          mutationObserver.disconnect();
          mutationObserver = null;
        }
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    // Save on beforeunload & pagehide to preserve exact exit coordinates
    const handleBeforeUnload = () => {
      persistActiveSection(activeSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scrollend', handleScrollEnd, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      observer.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scrollend', handleScrollEnd);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
    };
  }, []);

  // 8. Popstate / hashchange listener with 300ms debounce and dual storage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let hashDebounceTimer = null;
    const handleHashChange = () => {
      try {
        const hash = window.location.hash ? window.location.hash.slice(1) : '';
        const targetId = hash && SECTION_IDS.includes(hash) ? hash : 'hero';
        const url = targetId === 'hero' ? '#hero' : `#${targetId}`;

        if (hashDebounceTimer) clearTimeout(hashDebounceTimer);
        hashDebounceTimer = setTimeout(() => {
          const timestamp = Date.now();
          const lastUrlPayload = JSON.stringify({
            url,
            timestamp
          });
          const x = window.scrollX || window.pageXOffset || 0;
          const y = window.scrollY || window.pageYOffset || 0;
          const scrollPosPayload = JSON.stringify({
            x,
            y,
            url: window.location.href,
            pathname: window.location.pathname,
            hash: window.location.hash,
            section: targetId,
            timestamp
          });

          try {
            if (window.localStorage) {
              localStorage.setItem(PORTFOLIO_SCROLL_POS_KEY, scrollPosPayload);
              localStorage.setItem(PORTFOLIO_LAST_URL_KEY, lastUrlPayload);
              localStorage.setItem(RESTORATION_STORAGE_KEY, targetId);
            }
          } catch {}

          try {
            if (window.sessionStorage) {
              sessionStorage.setItem(PORTFOLIO_SCROLL_POS_KEY, scrollPosPayload);
              sessionStorage.setItem(PORTFOLIO_LAST_URL_KEY, lastUrlPayload);
              sessionStorage.setItem(RESTORATION_STORAGE_KEY, targetId);
            }
          } catch {}
        }, 300);
      } catch {}
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      if (hashDebounceTimer) clearTimeout(hashDebounceTimer);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);
}
