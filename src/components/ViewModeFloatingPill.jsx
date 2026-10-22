import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { GripHorizontal, RotateCcw, Check, Eye } from 'lucide-react';
import { useViewMode } from '../context/ViewModeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { soundFX } from '../utils/audio';

export const VIEW_MODE_CARD_POS_STORAGE_KEY = 'portfolio_view_mode_card_pos';

/**
 * Validate card coordinate against current viewport boundaries.
 */
export const isValidCardPosition = (x, y, cardWidth = 320, cardHeight = 310) => {
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
export const clampCardPosition = (x, y, cardWidth = 320, cardHeight = 310) => {
  if (typeof window === 'undefined') return { x, y };
  const minPadding = 12;
  const maxX = Math.max(minPadding, window.innerWidth - cardWidth - 12);
  const maxY = Math.max(minPadding, window.innerHeight - cardHeight - 12);
  const clampedX = Math.min(Math.max(minPadding, x), maxX);
  const clampedY = Math.min(Math.max(minPadding, y), maxY);
  return { x: clampedX, y: clampedY };
};

/**
 * ViewModeFloatingPill
 * 
 * Vertical glass card mounted via React Portal into document.body.
 * Zero tooltips, bottom-anchoring, draggable handle matching AudienceFloatingPill.
 * 
 * Four options in exact order:
 * 1. Basic / PDF (📄) - Clean document reading view
 * 2. Simple / Classic (🍃) - Minimalist fast layout
 * 3. Modern / Interactive (⚡) - Rich 3D interactive mode (default)
 * 4. Terminal / Developer (💻) - Developer CLI console
 */
export default function ViewModeFloatingPill({
  isOpen = true,
  onClose,
  soundEnabled = true,
  isDrawerOpen = false,
  className = ''
}) {
  const { viewMode, selectViewMode, modesList } = useViewMode();
  const { isHindi } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardRef = useRef(null);

  const [customPos, setCustomPos] = useState(null);
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

  const [anchoredPos, setAnchoredPos] = useState(() => {
    if (typeof window !== 'undefined') {
      const defaultW = 320;
      const defaultH = 310;
      return {
        left: Math.max(12, window.innerWidth - defaultW - 70),
        top: Math.max(20, window.innerHeight - defaultH - 24)
      };
    }
    return { left: 0, top: 0 };
  });

  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ pointerX: 0, pointerY: 0, cardX: 0, cardY: 0, cardWidth: 320, cardHeight: 310 });
  const hasDraggedRef = useRef(false);
  const wasOpenRef = useRef(false);

  // Calculate anchored position directly from the trigger button's viewport bounding rect
  const updateAnchoredPosition = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const triggerEl =
        document.getElementById('view-mode-trigger') ||
        document.querySelector('[data-view-mode-trigger]');
      if (!triggerEl) return;

      const triggerRect = triggerEl.getBoundingClientRect();
      const cardEl = cardRef.current;
      const cardWidth = cardEl?.offsetWidth || 320;
      const cardHeight = cardEl?.offsetHeight || 310;
      const buttonHeight = triggerRect.height || 48;

      const targetShift = Math.max(0, cardHeight - buttonHeight);

      const minBottomSpacing = 20;
      const minTopSpacing = 20;
      const viewportHeight = window.innerHeight || 800;

      const maxShiftAllowed = Math.max(0, viewportHeight - minBottomSpacing - triggerRect.bottom);
      let safeShift = Math.min(targetShift, maxShiftAllowed);

      let cardTop = triggerRect.bottom - cardHeight + safeShift;
      if (cardTop < minTopSpacing) {
        const extraShift = minTopSpacing - cardTop;
        safeShift = Math.min(maxShiftAllowed, safeShift + extraShift);
        cardTop = triggerRect.bottom - cardHeight + safeShift;
      }
      cardTop = Math.max(minTopSpacing, Math.min(cardTop, viewportHeight - cardHeight - minBottomSpacing));

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

  // Sync on open
  useEffect(() => {
    if (!isOpen) {
      wasOpenRef.current = false;
      return;
    }

    if (!wasOpenRef.current) {
      wasOpenRef.current = true;
      setCustomPos(null);
      updateAnchoredPosition();

      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem(VIEW_MODE_CARD_POS_STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (!isValidCardPosition(parsed?.x, parsed?.y)) {
              localStorage.removeItem(VIEW_MODE_CARD_POS_STORAGE_KEY);
            }
          }
        } catch {
          // ignore
        }
      }
    }
  }, [isOpen, updateAnchoredPosition]);

  // Continuously sync anchored position on resize, scroll, transitions
  useEffect(() => {
    if (!isOpen || customPos) return;
    updateAnchoredPosition();

    const triggerEl =
      document.getElementById('view-mode-trigger') ||
      document.querySelector('[data-view-mode-trigger]');
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

  // Clamp custom dragged coordinate on viewport resize
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
              localStorage.setItem(VIEW_MODE_CARD_POS_STORAGE_KEY, JSON.stringify(clamped));
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
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, customPos !== null]);

  // Auto-close on click outside or Escape with safe 150ms delayed registration
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (hasDraggedRef.current || isDraggingRef.current) return;
      if (e.target?.closest) {
        if (
          e.target.closest('#view-mode-trigger') ||
          e.target.closest('[data-view-mode-trigger]') ||
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
    setCustomPos(null);
    try {
      localStorage.removeItem(VIEW_MODE_CARD_POS_STORAGE_KEY);
    } catch {
      // ignore
    }
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    requestAnimationFrame(() => updateAnchoredPosition());
  }, [soundEnabled, updateAnchoredPosition]);

  // Pointer drag start handler
  const handlePointerDown = useCallback((e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (e.target.closest('button') && !e.target.closest('[data-drag-handle]')) return;

    const cardEl = cardRef.current;
    if (!cardEl) return;

    const rect = cardEl.getBoundingClientRect();
    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      cardX: rect.left,
      cardY: rect.top,
      cardWidth: rect.width,
      cardHeight: rect.height
    };

    hasDraggedRef.current = false;
    isDraggingRef.current = false;

    const handlePointerMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - dragStartRef.current.pointerX;
      const deltaY = moveEvent.clientY - dragStartRef.current.pointerY;

      if (!isDraggingRef.current) {
        if (Math.hypot(deltaX, deltaY) > 4) {
          isDraggingRef.current = true;
          hasDraggedRef.current = true;
          setIsDragging(true);
          try {
            document.body.style.userSelect = 'none';
          } catch {}
        } else {
          return;
        }
      }

      moveEvent.preventDefault();

      const rawX = dragStartRef.current.cardX + deltaX;
      const rawY = dragStartRef.current.cardY + deltaY;
      const clamped = clampCardPosition(
        rawX,
        rawY,
        dragStartRef.current.cardWidth,
        dragStartRef.current.cardHeight
      );

      setCustomPos(clamped);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);

      try {
        document.body.style.userSelect = '';
      } catch {}

      if (isDraggingRef.current) {
        setIsDragging(false);
        isDraggingRef.current = false;
        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 100);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  }, []);

  const handleSelectMode = (modeId) => {
    if (soundEnabled) {
      if (soundFX?.playFocusBeep) {
        soundFX.playFocusBeep();
      } else if (soundFX?.playHapticClick) {
        soundFX.playHapticClick();
      }
    }
    selectViewMode(modeId);
  };

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const currentPos = customPos || anchoredPos;

  const pillContent = (
    <div
      ref={cardRef}
      onMouseMove={handleCardMouseMove}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
      style={{
        position: 'fixed',
        left: `${currentPos.left ?? currentPos.x ?? 0}px`,
        top: `${currentPos.top ?? currentPos.y ?? 0}px`,
        width: '320px',
        zIndex: 51,
        touchAction: 'none',
        transition: isDragging ? 'none' : 'left 0.25s ease-out, top 0.25s ease-out'
      }}
      className={`relative overflow-hidden rounded-2xl p-3 border select-none backdrop-blur-xl shadow-2xl transition-shadow ${
        isDragging
          ? 'shadow-[#FF4D6D]/25 ring-2 ring-[#FF4D6D]/60 scale-[1.01] cursor-grabbing'
          : 'shadow-black/20 dark:shadow-purple-950/40 hover:shadow-2xl'
      } bg-[#FAF8F5]/98 dark:bg-[#161122]/98 border-[#E7E2D8] dark:border-[#2D2340] ${className}`}
      role="dialog"
      aria-modal="false"
      aria-label={isHindi ? 'व्यू मोड चयनकर्ता' : 'View Mode Selector'}
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

      {/* Title & Drag Bar */}
      <div
        data-drag-handle="true"
        onPointerDown={handlePointerDown}
        onDoubleClick={handleResetPosition}
        className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200/70 dark:border-stone-800 cursor-grab active:cursor-grabbing group relative z-10"
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-[#FF4D6D]/10 text-[#FF4D6D]">
            <Eye className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
            {isHindi ? 'व्यू मोड' : 'View Mode'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {customPos && (
            <button
              type="button"
              onClick={handleResetPosition}
              className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label={isHindi ? 'स्थिति रीसेट करें' : 'Reset Position'}
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
          <div className="p-1 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
            <GripHorizontal className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 4 View Mode Options */}
      <div className="space-y-1.5 relative z-10" role="radiogroup" aria-label="View mode choices">
        {modesList.map((mode, index) => {
          const isActive = viewMode === mode.id;
          const Icon = mode.icon;
          const label = isHindi && (mode.labelHi || mode.label_hi) ? (mode.labelHi || mode.label_hi) : mode.label;
          const description = isHindi && mode.description_hi ? mode.description_hi : mode.description;
          const badge = isHindi && mode.badge_hi ? mode.badge_hi : mode.badge;

          return (
            <button
              key={mode.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => handleSelectMode(mode.id)}
              onMouseEnter={() => {
                if (soundEnabled && soundFX?.playChipHover) soundFX.playChipHover();
              }}
              className={`animate-pill-row w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-linear-to-tr from-[#18181B] to-[#27272A] dark:from-stone-100 dark:to-white text-white dark:text-stone-900 border-[#18181B] dark:border-white shadow-md scale-[1.01]'
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
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 dark:bg-stone-900/20 text-white dark:text-stone-900'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                      }`}
                    >
                      {badge}
                    </span>
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

  return createPortal(pillContent, document.body);
}
