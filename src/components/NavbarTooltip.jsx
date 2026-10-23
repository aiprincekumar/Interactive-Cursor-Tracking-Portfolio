import React, { useState, useRef, useEffect, useId, useCallback } from 'react';

/**
 * NavbarTooltip
 * Accessible, sleek floating dark/light pill tooltip anchored below navbar triggers.
 * - Desktop: 120ms hover debounce, immediate focus, dismiss on blur / escape / click
 * - Mobile: 400ms touch-and-hold (long press) with optional haptic feedback, auto-dismiss
 * - Suppresses erratic browser native tooltip delays
 */
export default function NavbarTooltip({
  title,
  subtext,
  shortcut,
  children,
  position = 'bottom',
  align = 'center',
  className = '',
  disabled = false
}) {
  const [isVisible, setIsVisible] = useState(false);
  const openTimerRef = useRef(null);
  const touchTimerRef = useRef(null);
  const autoDismissTimerRef = useRef(null);
  const touchStartPosRef = useRef({ x: 0, y: 0 });
  const isTouchTriggeredRef = useRef(false);
  const tooltipId = useId();

  // Position offset classes
  const positionClasses = {
    bottom: 'top-full mt-2.5',
    top: 'bottom-full mb-2.5'
  };

  // Alignment classes for horizontal anchoring
  const alignClasses = {
    center: 'left-1/2 -translate-x-1/2',
    left: 'left-0 translate-x-0',
    right: 'right-0 translate-x-0'
  };

  // Caret alignment classes
  const caretAlignClasses = {
    center: 'left-1/2 -translate-x-1/2',
    left: 'left-4',
    right: 'right-4'
  };

  const clearAllTimers = useCallback(() => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
  }, []);

  const hideTooltip = useCallback(() => {
    clearAllTimers();
    setIsVisible(false);
    isTouchTriggeredRef.current = false;
  }, [clearAllTimers]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  // Dismiss on window scroll or escape key
  useEffect(() => {
    if (!isVisible) return;

    const handleScroll = () => hideTooltip();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') hideTooltip();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, hideTooltip]);

  // Desktop Hover Handlers
  const handleMouseEnter = (e) => {
    if (disabled) return;
    // Suppress browser native tooltip
    const target = e.currentTarget;
    const innerWithTitle = target.querySelector('[title]');
    if (innerWithTitle) {
      const rawTitle = innerWithTitle.getAttribute('title');
      if (rawTitle) {
        innerWithTitle.setAttribute('data-suppressed-title', rawTitle);
        innerWithTitle.removeAttribute('title');
      }
    }

    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    openTimerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 120);
  };

  const handleMouseLeave = (e) => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    setIsVisible(false);

    // Restore native title attribute for accessibility if needed
    const target = e.currentTarget;
    const innerWithTitle = target.querySelector('[data-suppressed-title]');
    if (innerWithTitle) {
      const rawTitle = innerWithTitle.getAttribute('data-suppressed-title');
      if (rawTitle) {
        innerWithTitle.setAttribute('title', rawTitle);
        innerWithTitle.removeAttribute('data-suppressed-title');
      }
    }
  };

  // Keyboard Accessibility Handlers
  const handleFocus = () => {
    if (disabled) return;
    setIsVisible(true);
  };

  const handleBlur = () => {
    hideTooltip();
  };

  // Mobile Touch-and-Hold (400ms long-press) Handlers
  const handleTouchStart = (e) => {
    if (disabled) return;
    const touch = e.touches?.[0];
    if (!touch) return;

    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
    isTouchTriggeredRef.current = false;

    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    touchTimerRef.current = setTimeout(() => {
      isTouchTriggeredRef.current = true;
      setIsVisible(true);

      // Trigger soft haptic feedback on supported mobile devices
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        try {
          navigator.vibrate(25);
        } catch {}
      }

      // Auto dismiss after 2.5 seconds
      if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
      autoDismissTimerRef.current = setTimeout(() => {
        hideTooltip();
      }, 2500);
    }, 400);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches?.[0];
    if (!touch) return;

    const dx = Math.abs(touch.clientX - touchStartPosRef.current.x);
    const dy = Math.abs(touch.clientY - touchStartPosRef.current.y);

    // Cancel long press if user finger moves more than 10px (scrolling or dragging)
    if (dx > 10 || dy > 10) {
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
      if (isTouchTriggeredRef.current) {
        hideTooltip();
      }
    }
  };

  const handleTouchEnd = () => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    // If long press was not triggered, hide immediately
    if (!isTouchTriggeredRef.current) {
      hideTooltip();
    }
  };

  const handleTouchCancel = () => {
    hideTooltip();
  };

  // Close instantly on click
  const handleClickCapture = () => {
    hideTooltip();
  };

  if (!title && !subtext) {
    return children;
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center cursor-pointer ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onClickCapture={handleClickCapture}
      data-cursor-clickable="true"
    >
      {children}

      {/* Floating Dark/Light Pill Tooltip */}
      <div
        id={tooltipId}
        role="tooltip"
        aria-hidden={!isVisible}
        className={`absolute z-50 pointer-events-none transition-all duration-200 ease-out ${
          positionClasses[position] || positionClasses.bottom
        } ${alignClasses[align] || alignClasses.center} ${
          isVisible
            ? 'opacity-100 scale-100 translate-y-0 visible'
            : 'opacity-0 scale-95 -translate-y-1 invisible'
        }`}
      >
        <div className="relative px-2.5 py-1.5 rounded-xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-200/90 dark:border-stone-700/90 shadow-xl shadow-stone-900/10 dark:shadow-black/40 flex flex-col items-center gap-0.5 text-center min-w-[max-content] select-none">
          {/* Subtle directional caret */}
          <div
            className={`absolute -top-1 w-2 h-2 rotate-45 bg-white dark:bg-stone-900 border-t border-l border-stone-200/90 dark:border-stone-700/90 ${
              caretAlignClasses[align] || caretAlignClasses.center
            }`}
          />

          {/* Title Row with optional Shortcut badge */}
          <div className="flex items-center gap-1.5 whitespace-nowrap leading-tight">
            <span className="font-semibold text-xs text-stone-900 dark:text-stone-100 tracking-tight">
              {title}
            </span>
            {shortcut && (
              <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded border border-stone-200/80 dark:border-stone-700/80 shadow-2xs">
                {shortcut}
              </kbd>
            )}
          </div>

          {/* Informative Subtext / Action description */}
          {subtext && (
            <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium whitespace-nowrap leading-tight">
              {subtext}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
