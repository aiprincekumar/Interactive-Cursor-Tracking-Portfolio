import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { GripHorizontal, RotateCcw, Check, Filter } from 'lucide-react';
import { useAudience } from '../context/AudienceContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { soundFX } from '../utils/audio';

export const AUDIENCE_CARD_POS_STORAGE_KEY = 'portfolio_audience_card_pos';

/**
 * Validate card coordinate against current viewport boundaries.
 * Returns true if position is within safe, visible bounds.
 */
export const isValidCardPosition = (x, y, cardWidth = 320, cardHeight = 290) => {
  if (typeof window === 'undefined') return false;
  if (typeof x !== 'number' || typeof y !== 'number') return false;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
  const minPadding = 12;
  const maxX = window.innerWidth - cardWidth - minPadding;
  const maxY = window.innerHeight - cardHeight - minPadding;
  if (x < minPadding || x > maxX || y < minPadding || y > maxY) {
    return false;
  }
  return true;
};

/**
 * Clamp card coordinate to viewport with 12px safety padding on all 4 sides.
 */
export const clampCardPosition = (x, y, cardWidth = 320, cardHeight = 290) => {
  if (typeof window === 'undefined') return { x, y };
  const minPadding = 12;
  const maxX = Math.max(minPadding, window.innerWidth - cardWidth - 12);
  const maxY = Math.max(minPadding, window.innerHeight - cardHeight - 12);
  const clampedX = Math.min(Math.max(minPadding, x), maxX);
  const clampedY = Math.min(Math.max(minPadding, y), maxY);
  return { x: clampedX, y: clampedY };
};

/**
 * AudienceFloatingPill
 * 
 * Unified vertical glass card mounted via React Portal into document.body with z-[55] elevation.
 * 
 * Eliminates ancestor CSS transform containing block traps:
 * 1. DYNAMIC ANCHORED MODE (customPos === null):
 *    - Dynamically computes viewport position based on #audience-filter-trigger.
 *    - cardLeft = triggerRect.left - cardWidth - 14 (14px flyout margin to the left).
 *    - cardTop aligns near trigger button top while respecting 20px viewport boundaries.
 * 2. SEAMLESS DRAG & DROP ENGINE (customPos !== null):
 *    - Mounted directly in document.body so position: fixed coordinates match clientX/clientY 100%.
 *    - Micro-movement threshold (> 4px) prevents normal clicks on title bar from triggering drag.
 *    - Text selection prevention (e.preventDefault, removeAllRanges, body userSelect = 'none').
 *    - Lag-free dragging: transitions are disabled (transition: none) during active drag.
 *    - Reset button (RotateCcw) or double-clicking title bar snaps card back to anchored position.
 * 3. CLICK-OUTSIDE & ESCAPE PROTECTION:
 *    - Safe delayed registration (150ms) prevents opening tap from instantly dismissing.
 *    - Ignores clicks on #audience-filter-trigger or within Floating Action Hub.
 */
export default function AudienceFloatingPill({
  isOpen = true,
  onClose,
  soundEnabled = true,
  isDrawerOpen = false,
  className = ''
}) {
  const { audience, setAudience, modesList } = useAudience();
  const { isHindi } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardRef = useRef(null);

  // Spotlight shine state
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleCardMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setSpotlightPos({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top)
    });
  }, []);

  const handleCardMouseEnter = useCallback((e) => {
    setIsHovered(true);
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setSpotlightPos({
        x: Math.round(e.clientX - rect.left),
        y: Math.round(e.clientY - rect.top)
      });
    }
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Default customPos to null on fresh open so it always anchors cleanly beside the button
  const [customPos, setCustomPos] = useState(null);

  // Computed viewport position for anchored mode
  const [anchoredPos, setAnchoredPos] = useState(() => {
    if (typeof window !== 'undefined') {
      const defaultW = 320;
      const defaultH = 290;
      return {
        left: Math.max(12, window.innerWidth - defaultW - 70),
        top: Math.max(20, window.innerHeight - defaultH - 24)
      };
    }
    return { left: 0, top: 0 };
  });

  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ pointerX: 0, pointerY: 0, cardX: 0, cardY: 0, cardWidth: 320, cardHeight: 290 });
  const hasDraggedRef = useRef(false);
  const wasOpenRef = useRef(false);

  // Calculate anchored position directly from the trigger button's viewport bounding rect
  const updateAnchoredPosition = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const triggerEl =
        document.getElementById('audience-filter-trigger') ||
        document.querySelector('[data-audience-filter-trigger]');
      if (!triggerEl) return;

      const triggerRect = triggerEl.getBoundingClientRect();
      const cardEl = cardRef.current;
      const cardWidth = cardEl?.offsetWidth || 320;
      const cardHeight = cardEl?.offsetHeight || 290;
      const buttonHeight = triggerRect.height || 48;

      // Target shift to bring card top to near where button starts
      const targetShift = Math.max(0, cardHeight - buttonHeight);

      // Safe bounds: Keep at least 20px clearance from viewport bottom and top
      const minBottomSpacing = 20;
      const minTopSpacing = 20;
      const viewportHeight = window.innerHeight || 800;

      // Maximum downward shift allowed before card hits (viewport bottom - 20px)
      const maxShiftAllowed = Math.max(0, viewportHeight - minBottomSpacing - triggerRect.bottom);
      let safeShift = Math.min(targetShift, maxShiftAllowed);

      // Verify top clearance: ensure card top does not exceed above viewport top
      let cardTop = triggerRect.bottom - cardHeight + safeShift;
      if (cardTop < minTopSpacing) {
        const extraShift = minTopSpacing - cardTop;
        safeShift = Math.min(maxShiftAllowed, safeShift + extraShift);
        cardTop = triggerRect.bottom - cardHeight + safeShift;
      }
      cardTop = Math.max(12, Math.min(cardTop, window.innerHeight - cardHeight - 12));

      // Compute left coordinate with 14px clearance to the left of the button
      let cardLeft = triggerRect.left - cardWidth - 14;
      cardLeft = Math.max(12, Math.min(cardLeft, window.innerWidth - cardWidth - 12));

      setAnchoredPos({
        left: Math.round(cardLeft),
        top: Math.round(cardTop)
      });
    } catch {
      // ignore
    }
  }, []);

  // Clean stale/broken persisted coordinate on mount/open and update anchored position
  useEffect(() => {
    if (!isOpen) {
      wasOpenRef.current = false;
      return;
    }

    // Only on fresh open transition (false -> true), default customPos to null so it cleanly anchors beside button
    if (!wasOpenRef.current) {
      wasOpenRef.current = true;
      setCustomPos(null);
      updateAnchoredPosition();

      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem(AUDIENCE_CARD_POS_STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (!isValidCardPosition(parsed?.x, parsed?.y)) {
              localStorage.removeItem(AUDIENCE_CARD_POS_STORAGE_KEY);
            }
          }
        } catch {
          // ignore
        }
      }
    }
  }, [isOpen, updateAnchoredPosition]);

  // Continuously sync anchored position on resize, scroll, transitions, and layout shifts when in anchored mode
  useEffect(() => {
    if (!isOpen || customPos) return;
    updateAnchoredPosition();

    const triggerEl =
      document.getElementById('audience-filter-trigger') ||
      document.querySelector('[data-audience-filter-trigger]');
    const hubEl = document.querySelector('[data-floating-action-hub]');

    const handleTransition = () => {
      updateAnchoredPosition();
    };

    triggerEl?.addEventListener('transitionend', handleTransition);
    triggerEl?.addEventListener('transitionrun', handleTransition);
    hubEl?.addEventListener('transitionend', handleTransition);
    hubEl?.addEventListener('transitionrun', handleTransition);

    window.addEventListener('resize', updateAnchoredPosition);
    window.addEventListener('scroll', updateAnchoredPosition, true);

    // RAF tracking during layout shifts/glide transitions (450ms tracking window)
    let rafId = null;
    const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const trackShift = (now) => {
      updateAnchoredPosition();
      const current = now || (typeof performance !== 'undefined' ? performance.now() : Date.now());
      if (current - startTime < 450) {
        rafId = requestAnimationFrame(trackShift);
      }
    };
    rafId = requestAnimationFrame(trackShift);

    const timer1 = setTimeout(updateAnchoredPosition, 100);
    const timer2 = setTimeout(updateAnchoredPosition, 320);
    const timer3 = setTimeout(updateAnchoredPosition, 400);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      triggerEl?.removeEventListener('transitionend', handleTransition);
      triggerEl?.removeEventListener('transitionrun', handleTransition);
      hubEl?.removeEventListener('transitionend', handleTransition);
      hubEl?.removeEventListener('transitionrun', handleTransition);
      window.removeEventListener('resize', updateAnchoredPosition);
      window.removeEventListener('scroll', updateAnchoredPosition, true);
    };
  }, [isOpen, customPos, isDrawerOpen, updateAnchoredPosition]);

  // Clamp custom dragged coordinate on viewport resize so card never stays offscreen
  useEffect(() => {
    if (!isOpen || !customPos) return;

    const handleResize = () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setCustomPos((prevPos) => {
          if (!prevPos) return null;
          const clamped = clampCardPosition(prevPos.x, prevPos.y, rect.width, rect.height);
          if (clamped.x !== prevPos.x || clamped.y !== prevPos.y) {
            try {
              localStorage.setItem(AUDIENCE_CARD_POS_STORAGE_KEY, JSON.stringify(clamped));
            } catch {
              // ignore
            }
            return clamped;
          }
          return prevPos;
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, customPos !== null]);

  // Auto-close on click outside or Escape with safe 150ms delayed registration
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (hasDraggedRef.current || isDraggingRef.current) return;
      // Do not close if clicking the filter trigger button or within the floating action hub
      if (e.target?.closest) {
        if (
          e.target.closest('#audience-filter-trigger') ||
          e.target.closest('[data-audience-filter-trigger]') ||
          e.target.closest('[data-floating-action-hub]')
        ) {
          return;
        }
      }
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        if (onClose) onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (soundEnabled && soundFX?.playTap) soundFX.playTap();
        if (onClose) onClose();
      }
    };

    // Safe 150ms delay so opening click/tap does not immediately destroy the card
    const timerId = setTimeout(() => {
      document.addEventListener('pointerdown', handleClickOutside, true);
    }, 150);

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timerId);
      document.removeEventListener('pointerdown', handleClickOutside, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, soundEnabled]);

  // Reset custom position back to button anchor
  const handleResetPosition = useCallback((e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (soundEnabled) {
      if (soundFX?.playTap) {
        soundFX.playTap();
      } else if (soundFX?.playHapticClick) {
        soundFX.playHapticClick();
      }
    }
    setCustomPos(null);
    try {
      localStorage.removeItem(AUDIENCE_CARD_POS_STORAGE_KEY);
    } catch {
      // ignore
    }
    updateAnchoredPosition();
  }, [soundEnabled, updateAnchoredPosition]);

  // Pointer drag event handler with pointer capture, text selection prevention & micro-movement threshold
  const handlePointerDown = (e) => {
    // Ignore clicks on buttons inside the drag handle (like reset button)
    if (e.target.closest('button')) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    e.preventDefault();
    if (!cardRef.current) return;

    const cardEl = cardRef.current;
    const dragHandle = e.currentTarget;
    const pointerId = e.pointerId;

    // Prevent text selection across the page during drag
    window.getSelection()?.removeAllRanges();
    if (typeof document !== 'undefined') {
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
    }

    if (dragHandle?.setPointerCapture && pointerId !== undefined) {
      try {
        dragHandle.setPointerCapture(pointerId);
      } catch {
        // ignore
      }
    }

    const rect = cardEl.getBoundingClientRect();
    const currentX = customPos ? customPos.x : rect.left;
    const currentY = customPos ? customPos.y : rect.top;
    const cardW = rect.width || 320;
    const cardH = rect.height || 290;

    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      cardX: currentX,
      cardY: currentY,
      cardWidth: cardW,
      cardHeight: cardH
    };

    let latestClamped = { x: currentX, y: currentY };

    const onPointerMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      moveEvent.preventDefault();

      const deltaX = moveEvent.clientX - dragStartRef.current.pointerX;
      const deltaY = moveEvent.clientY - dragStartRef.current.pointerY;

      // Micro-movement threshold (> 4px) to distinguish intentional drag from a static click
      if (!hasDraggedRef.current) {
        if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
          hasDraggedRef.current = true;
          setIsDragging(true);
        } else {
          return;
        }
      }

      const rawX = dragStartRef.current.cardX + deltaX;
      const rawY = dragStartRef.current.cardY + deltaY;

      latestClamped = clampCardPosition(
        rawX,
        rawY,
        dragStartRef.current.cardWidth,
        dragStartRef.current.cardHeight
      );

      // Instantaneous DOM style update for silky-smooth 60/120fps dragging
      if (cardEl) {
        cardEl.style.left = `${latestClamped.x}px`;
        cardEl.style.top = `${latestClamped.y}px`;
      }

      setCustomPos(latestClamped);
    };

    const onPointerUp = (upEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);

      // Restore body user-select
      if (typeof document !== 'undefined') {
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
      }

      if (dragHandle?.releasePointerCapture && pointerId !== undefined) {
        try {
          dragHandle.releasePointerCapture(pointerId);
        } catch {
          // ignore
        }
      }

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      if (hasDraggedRef.current) {
        if (soundEnabled && soundFX?.playHapticClick) {
          soundFX.playHapticClick();
        }
        try {
          localStorage.setItem(AUDIENCE_CARD_POS_STORAGE_KEY, JSON.stringify(latestClamped));
        } catch {
          // ignore
        }
        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 150);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  const handleSelect = (modeId, e) => {
    e.stopPropagation();
    if (soundEnabled) {
      if (soundFX?.playFocusBeep) {
        soundFX.playFocusBeep();
      } else if (soundFX?.playHapticClick) {
        soundFX.playHapticClick();
      }
    }
    setAudience(modeId);
    if (onClose) onClose();
  };

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const isCustomDragged = customPos !== null;
  const activeLeft = isCustomDragged ? customPos.x : anchoredPos.left;
  const activeTop = isCustomDragged ? customPos.y : anchoredPos.top;

  const inlineStyle = {
    position: 'fixed',
    zIndex: 70,
    left: `${activeLeft}px`,
    top: `${activeTop}px`,
    touchAction: 'none',
    transition: isDragging ? 'none' : 'left 0.25s ease-out, top 0.25s ease-out'
  };

  const cardElement = (
    <div
      ref={cardRef}
      role="dialog"
      aria-label={isHindi ? 'ऑडियंस मोड चुनें' : 'Select Audience View'}
      style={inlineStyle}
      onMouseMove={handleCardMouseMove}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
      className={`overflow-hidden rounded-2xl p-3 border select-none backdrop-blur-xl shadow-2xl transition-shadow w-72 sm:w-80 max-w-[calc(100vw-5.5rem)] ${
        isDragging
          ? 'shadow-[#FF4D6D]/25 ring-2 ring-[#FF4D6D]/60 scale-[1.01] cursor-grabbing'
          : 'shadow-black/20 dark:shadow-purple-950/40 hover:shadow-2xl'
      } bg-[#FAF8F5]/98 dark:bg-[#161122]/98 border-[#E7E2D8] dark:border-[#2D2340] ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Interactive Cursor-Tracking Spotlight Shine */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: isDark
            ? `radial-gradient(circle 120px at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(255, 77, 109, 0.12), transparent 80%)`
            : `radial-gradient(circle 120px at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(255, 77, 109, 0.08), transparent 80%)`
        }}
        aria-hidden="true"
      />

      {/* Sleek Drag Handle Bar */}
      <div
        data-drag-handle="true"
        onPointerDown={handlePointerDown}
        onDoubleClick={handleResetPosition}
        style={{ touchAction: 'none' }}
        className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200/70 dark:border-stone-800 cursor-grab active:cursor-grabbing group select-none relative z-10"
        title={isHindi ? 'खींचकर स्थिति बदलें (डबल-क्लिक से रीसेट)' : 'Drag to reposition (Double-click to reset)'}
      >
        <div className="flex items-center gap-2 min-w-0 select-none">
          <div className="p-1 rounded-lg bg-[#FF4D6D]/10 text-[#FF4D6D] shrink-0">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 truncate select-none">
            {isHindi ? 'ऑडियंस फ़िल्टर' : 'Audience View'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 select-none">
          <span className="text-[9px] font-mono font-semibold text-[#FF4D6D] bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 px-2 py-0.5 rounded-full border border-[#FFD1DC] dark:border-[#FF4D6D]/30 select-none">
            {modesList.find((m) => m.id === audience)?.shortLabel || 'All'}
          </span>

          {isCustomDragged && (
            <button
              type="button"
              onClick={handleResetPosition}
              onPointerDown={(e) => e.stopPropagation()}
              title={isHindi ? 'फ़्लोटिंग बटन पर रीसेट करें' : 'Reset position'}
              aria-label={isHindi ? 'फ़्लोटिंग बटन पर स्थिति रीसेट करें' : 'Reset position'}
              className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
            </button>
          )}

          <div className="p-1 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
            <GripHorizontal className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* 4 Audience Mode Options */}
      <div className="flex flex-col gap-1 space-y-0.5 relative z-10" role="radiogroup" aria-label={isHindi ? 'ऑडियंस मोड चुनें' : 'Select Audience View'}>
        {modesList.map((mode, index) => {
          const isActive = audience === mode.id;
          const Icon = mode.icon;
          const label = isHindi && mode.label_hi ? mode.label_hi : mode.label;
          const description = isHindi && mode.description_hi ? mode.description_hi : mode.description;
          const badge = isHindi && mode.badge_hi ? mode.badge_hi : mode.badge;

          return (
            <button
              key={mode.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              data-audience-option={mode.id}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={(e) => handleSelect(mode.id, e)}
              onMouseEnter={() => {
                if (soundEnabled && soundFX?.playChipHover) soundFX.playChipHover();
              }}
              className={`animate-pill-row w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-400 dark:focus-visible:ring-purple-400 ${
                isActive
                  ? 'bg-linear-to-tr from-[#18181B] to-[#27272A] dark:from-stone-100 dark:to-white text-white dark:text-stone-900 border-[#18181B] dark:border-white shadow-md scale-[1.01] ring-1 ring-emerald-400/50 dark:ring-purple-400/50'
                  : 'bg-white/70 dark:bg-stone-900/60 hover:bg-white dark:hover:bg-stone-800/90 border-[#E7E2D8] dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-[#FF4D6D]/40'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm transition-colors ${
                    isActive
                      ? 'bg-white/20 dark:bg-stone-900/15 text-white dark:text-stone-900'
                      : 'bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 text-[#FF4D6D]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 pr-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{mode.emoji}</span>
                    <span className="text-xs font-bold font-mono tracking-tight">
                      {label}
                    </span>
                    {badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                          isActive
                            ? 'bg-white/20 dark:bg-stone-900/20 text-white dark:text-stone-900'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[10px] leading-tight truncate mt-0.5 ${
                      isActive ? 'text-stone-300 dark:text-stone-600' : 'text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    {description}
                  </p>
                </div>
              </div>

              {isActive && (
                <div className="w-5 h-5 rounded-full bg-[#FF4D6D] text-white flex items-center justify-center shrink-0 ml-1">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return createPortal(cardElement, document.body);
}
