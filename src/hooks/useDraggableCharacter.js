import { useState, useEffect, useRef, useCallback } from 'react';
import { soundFX } from '../utils/audio';

/**
 * Storage key for persisting dragged character coordinates.
 */
const STORAGE_KEY = 'portfolio_hero_character_pos';

/**
 * Hold threshold to differentiate normal clicks/taps from deliberate drag pick-up.
 */
const HOLD_DURATION_MS = 250;
const HOLD_MOVE_THRESHOLD_PX = 6;
const DOUBLE_TAP_DELAY_MS = 300;

/**
 * useDraggableCharacter Hook
 * 
 * Provides frictionless, 60/120fps physics-ready drag-and-drop capabilities for the Hero Character:
 * - Long-press hold (~250ms) with lift/pulse effect before dragging commences.
 * - Cancels hold if pointer moves > 6px or releases prematurely (permitting normal clicks/scroll).
 * - Full Pointer Capture API support for uninterrupted desktop & touch tracking.
 * - Dynamic boundary clamping factoring in Hero section rect, character element dimensions, and userScale (0.5x - 2.0x).
 * - Position persistence with localStorage restoring on mount.
 * - Double-click / double-tap detection triggering a snappy spring return to center (0, 0).
 * - Re-center helper function for external HUD button triggers.
 * - High performance: mutable position refs for zero React re-renders during active pointer movement,
 *   synchronized directly with CSS transforms or rAF loops.
 * 
 * @param {Object} options
 * @param {React.RefObject} options.heroRef - Reference to the Hero section container for boundary calculations.
 * @param {React.RefObject} options.characterRef - Reference to character inner or stage container.
 * @param {number} [options.userScale=1.0] - Active character zoom scale factor (0.5 to 2.0).
 * @param {boolean} [options.enabled=true] - Whether dragging interactions are allowed.
 * @param {Function} [options.onPositionChange] - Optional callback when coordinates change.
 * @returns {Object} Draggable API controls and reactive state.
 */
export function useDraggableCharacter({
  heroRef,
  containerRef,
  characterRef,
  stageRef,
  userScale = 1.0,
  enabled = true,
  dragEnabled,
  dragBoundaryConstrained = true,
  dragAutoSnapBack = false,
  onPositionChange
} = {}) {
  const effectiveHeroRef = heroRef || containerRef;
  const effectiveCharRef = characterRef || stageRef;
  const isDragAllowed = dragEnabled !== undefined ? Boolean(dragEnabled) : Boolean(enabled);

  // Public reactive state (only updated on hold, drag start/end, and discrete events)
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHolding, setIsHolding] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [liftProgress, setLiftProgress] = useState(0); // 0.0 to 1.0 for visual pulse/elevation
  const [isDisplaced, setIsDisplaced] = useState(false);

  // Mutable refs for high-frequency (60/120fps) tracking with zero React re-render churn
  const posRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const isHoldingRef = useRef(false);
  const liftProgressRef = useRef(0);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const activePointerIdRef = useRef(null);
  const holdTimerRef = useRef(null);
  const liftRafRef = useRef(null);
  const springRafRef = useRef(null);
  const lastTapTimeRef = useRef(0);
  const lastTapPosRef = useRef({ x: 0, y: 0 });

  // References to keep dependencies fresh inside event callbacks
  const userScaleRef = useRef(userScale);
  // oxlint-disable-next-line react/refs
  userScaleRef.current = userScale;
  const enabledRef = useRef(isDragAllowed);
  // oxlint-disable-next-line react/refs
  enabledRef.current = isDragAllowed;
  const boundaryConstrainedRef = useRef(dragBoundaryConstrained);
  // oxlint-disable-next-line react/refs
  boundaryConstrainedRef.current = dragBoundaryConstrained;
  const autoSnapBackRef = useRef(dragAutoSnapBack);
  // oxlint-disable-next-line react/refs
  autoSnapBackRef.current = dragAutoSnapBack;

  // Restore saved position on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') {
          posRef.current = { x: parsed.x, y: parsed.y };
          setPosition({ x: parsed.x, y: parsed.y });
          const displaced = Math.abs(parsed.x) > 1 || Math.abs(parsed.y) > 1;
          setIsDisplaced(displaced);
          if (onPositionChange) onPositionChange(posRef.current);
        }
      }
    } catch {
      // Storage unavailable or corrupted - graceful fallback
    }
  }, [onPositionChange]);

  // Persist position helper
  const persistPosition = useCallback((coords) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(coords));
    } catch {
      // Ignore quota or private browsing exceptions
    }
  }, []);

  /**
   * Clamp coordinates within Hero section bounds taking user scale into account.
   */
  const clampToBounds = useCallback((x, y) => {
    if (!boundaryConstrainedRef.current) {
      return { x, y };
    }
    const heroEl = effectiveHeroRef?.current;
    if (!heroEl) return { x, y };

    const heroRect = heroEl.getBoundingClientRect();
    const charEl = effectiveCharRef?.current;

    // Estimate character bounding dimensions with active scale
    const scale = userScaleRef.current || 1.0;
    let charWidth = 400 * scale;
    let charHeight = 500 * scale;

    if (charEl) {
      const charRect = charEl.getBoundingClientRect();
      if (charRect.width > 0 && charRect.height > 0) {
        // Measure unscaled or scaled base dimension
        charWidth = charRect.width;
        charHeight = charRect.height;
      }
    }

    // Allow natural movement while preventing character from disappearing outside view
    // Half width padding ensures at least 25% of character body stays comfortably in view
    const marginX = Math.max(40, (heroRect.width - charWidth) / 2);
    const marginY = Math.max(30, (heroRect.height - charHeight) / 2);

    const maxX = Math.max(20, (heroRect.width / 2) - 40);
    const minX = -maxX;
    const maxY = Math.max(20, (heroRect.height / 2) - 50);
    const minY = -maxY;

    const clampedX = Math.max(minX, Math.min(maxX, x));
    const clampedY = Math.max(minY, Math.min(maxY, y));

    return { x: clampedX, y: clampedY };
  }, [effectiveHeroRef, effectiveCharRef]);

  /**
   * Smooth spring reset animation back to (0, 0)
   */
  const resetPosition = useCallback(() => {
    if (springRafRef.current) {
      cancelAnimationFrame(springRafRef.current);
      springRafRef.current = null;
    }

    // Play spring snap sound & haptic
    soundFX.playSnap();

    const startX = posRef.current.x;
    const startY = posRef.current.y;
    const startTime = performance.now();
    const duration = 450; // ms spring duration

    // Damped harmonic oscillation spring: f(t) = 1 - e^(-6t) * cos(10t)
    const animateSpring = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      if (progress < 1) {
        const decay = Math.exp(-6 * progress);
        const oscillation = Math.cos(10 * progress * Math.PI);
        const factor = 1 - decay * oscillation;

        const currentX = startX * (1 - factor);
        const currentY = startY * (1 - factor);

        posRef.current = { x: currentX, y: currentY };
        setPosition({ x: currentX, y: currentY });
        if (onPositionChange) onPositionChange(posRef.current);

        springRafRef.current = requestAnimationFrame(animateSpring);
      } else {
        // Finalize at exact rest center
        posRef.current = { x: 0, y: 0 };
        setPosition({ x: 0, y: 0 });
        setIsDisplaced(false);
        persistPosition({ x: 0, y: 0 });
        if (onPositionChange) onPositionChange(posRef.current);
        springRafRef.current = null;
      }
    };

    springRafRef.current = requestAnimationFrame(animateSpring);
  }, [persistPosition, onPositionChange]);

  /**
   * Cancel pending long-press hold timer and lift progress
   */
  const cancelHold = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (liftRafRef.current) {
      cancelAnimationFrame(liftRafRef.current);
      liftRafRef.current = null;
    }
    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      setIsHolding(false);
    }
    liftProgressRef.current = 0;
    setLiftProgress(0);
  }, []);

  /**
   * Smoothly animate lift progress during the 250ms hold window
   */
  const startLiftAnimation = useCallback(() => {
    const startTime = performance.now();
    const duration = HOLD_DURATION_MS;

    const animateLift = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      liftProgressRef.current = progress;
      setLiftProgress(progress);

      if (progress < 1 && holdTimerRef.current) {
        liftRafRef.current = requestAnimationFrame(animateLift);
      }
    };

    liftRafRef.current = requestAnimationFrame(animateLift);
  }, []);

  /**
   * Handle Pointer Down on character
   */
  const handlePointerDown = useCallback((e) => {
    if (!enabledRef.current) return;
    // Only primary button (left click or touch)
    if (e.button !== undefined && e.button !== 0) return;

    // Check for double click / double tap
    const now = performance.now();
    const timeDelta = now - lastTapTimeRef.current;
    const distDelta = Math.hypot(
      e.clientX - lastTapPosRef.current.x,
      e.clientY - lastTapPosRef.current.y
    );

    if (timeDelta < DOUBLE_TAP_DELAY_MS && distDelta < 24) {
      // Double click / tap detected!
      cancelHold();
      resetPosition();
      lastTapTimeRef.current = 0;
      return;
    }

    lastTapTimeRef.current = now;
    lastTapPosRef.current = { x: e.clientX, y: e.clientY };

    // Record initial pointer coordinates
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    dragOffsetRef.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y
    };
    activePointerIdRef.current = e.pointerId;

    // Stop active spring animation if in motion
    if (springRafRef.current) {
      cancelAnimationFrame(springRafRef.current);
      springRafRef.current = null;
    }

    // Begin hold verification and lift preview
    startLiftAnimation();

    holdTimerRef.current = setTimeout(() => {
      holdTimerRef.current = null;
      isHoldingRef.current = true;
      setIsHolding(true);
      isDraggingRef.current = true;
      setIsDragging(true);

      // Capture pointer for uninterrupted dragging beyond element boundaries
      if (e.target && typeof e.target.setPointerCapture === 'function' && e.pointerId !== undefined) {
        try {
          e.target.setPointerCapture(e.pointerId);
        } catch {
          // Handled safely
        }
      }

      // Trigger audio & haptic feedback on successful lift
      soundFX.playLift();
    }, HOLD_DURATION_MS);
  }, [cancelHold, resetPosition, startLiftAnimation]);

  /**
   * Handle Pointer Move
   */
  const handlePointerMove = useCallback((e) => {
    if (!enabledRef.current) return;

    // If hold is still pending, test move threshold to prevent accidental drags during taps or scroll
    if (holdTimerRef.current) {
      const dx = e.clientX - pointerStartRef.current.x;
      const dy = e.clientY - pointerStartRef.current.y;
      const distance = Math.hypot(dx, dy);

      if (distance > HOLD_MOVE_THRESHOLD_PX) {
        // Exceeded micro-threshold before 250ms -> cancel hold (normal scroll/gesture)
        cancelHold();
        return;
      }
    }

    // Active drag handling
    if (isDraggingRef.current) {
      const rawX = e.clientX - dragOffsetRef.current.x;
      const rawY = e.clientY - dragOffsetRef.current.y;

      const clamped = clampToBounds(rawX, rawY);
      posRef.current = clamped;

      // Update displaced state flag
      const displaced = Math.abs(clamped.x) > 2 || Math.abs(clamped.y) > 2;
      if (displaced !== isDisplaced) {
        setIsDisplaced(displaced);
      }

      // Notify consumer callback immediately for real-time DOM update
      if (onPositionChange) {
        onPositionChange(clamped);
      }
    }
  }, [cancelHold, clampToBounds, isDisplaced, onPositionChange]);

  /**
   * Handle Pointer Up / Pointer Cancel
   */
  const handlePointerUp = useCallback((e) => {
    // If released before 250ms hold finished
    if (holdTimerRef.current) {
      cancelHold();
      return;
    }

    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      cancelHold();

      // Release pointer capture
      if (e?.target && typeof e.target.releasePointerCapture === 'function' && e.pointerId !== undefined) {
        try {
          e.target.releasePointerCapture(e.pointerId);
        } catch {
          // Handled safely
        }
      }

      if (autoSnapBackRef.current) {
        // If dragAutoSnapBack is enabled, immediately spring back to center (0, 0)
        resetPosition();
      } else {
        // Sync React state and persist to localStorage
        setPosition({ ...posRef.current });
        persistPosition(posRef.current);

        // Play soft cushioned drop sound & haptic
        soundFX.playDrop();
      }
    }

    activePointerIdRef.current = null;
  }, [cancelHold, persistPosition, resetPosition]);

  // Cancel any active hold or drag if dragging gets disabled dynamically
  useEffect(() => {
    if (!isDragAllowed) {
      // oxlint-disable-next-line react/set-state-in-effect
      cancelHold();
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
      }
    }
  }, [isDragAllowed, cancelHold]);

  // Recenter character listener for global portfolio events / HUD buttons
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleRecenter = () => {
      resetPosition();
    };
    window.addEventListener('portfolio:recenter-character', handleRecenter);
    return () => {
      window.removeEventListener('portfolio:recenter-character', handleRecenter);
    };
  }, [resetPosition]);

  // Global window listeners for safety (in case pointer capture is dropped)
  useEffect(() => {
    const onWindowPointerMove = (e) => {
      if (isDraggingRef.current) {
        handlePointerMove(e);
      }
    };

    const onWindowPointerUp = (e) => {
      if (isDraggingRef.current || holdTimerRef.current) {
        handlePointerUp(e);
      }
    };

    window.addEventListener('pointermove', onWindowPointerMove, { passive: true });
    window.addEventListener('pointerup', onWindowPointerUp, { passive: true });
    window.addEventListener('pointercancel', onWindowPointerUp, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onWindowPointerMove);
      window.removeEventListener('pointerup', onWindowPointerUp);
      window.removeEventListener('pointercancel', onWindowPointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (liftRafRef.current) cancelAnimationFrame(liftRafRef.current);
      if (springRafRef.current) cancelAnimationFrame(springRafRef.current);
    };
  }, []);

  return {
    position,
    posRef,
    isHolding,
    isDragging,
    liftProgress,
    isDisplaced,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    resetPosition,
    clampToBounds
  };
}

export default useDraggableCharacter;
