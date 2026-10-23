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
const DRAG_START_THRESHOLD_PX = 5;
const DOUBLE_TAP_DELAY_MS = 300;

/**
 * useDraggableCharacter Hook
 * 
 * Provides frictionless, 60/120fps physics-ready drag-and-drop capabilities for the Hero Character:
 * - Immediate responsive drag initiation when pointer moves beyond threshold (> 5px), or upon 250ms hold.
 * - Long-press hold (~250ms) with lift/pulse elevation effect before movement starts.
 * - Photo snapshot click suppression when dragging occurs, while allowing single-clicks to capture photos.
 * - Dropped position persistence in localStorage with smooth restoration.
 * - Full Pointer Capture API support for uninterrupted desktop & touch tracking.
 * - Dynamic boundary clamping factoring in Hero section rect, character element dimensions, and userScale (0.5x - 2.0x).
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
  const isDisplacedRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const liftProgressRef = useRef(0);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const activePointerIdRef = useRef(null);
  const dragTargetRef = useRef(null);
  const holdTimerRef = useRef(null);
  const liftRafRef = useRef(null);
  const springRafRef = useRef(null);
  const lastTapTimeRef = useRef(0);
  const lastTapPosRef = useRef({ x: 0, y: 0 });

  // Bounds cache to eliminate forced layout thrashing / reflow on pointer movement
  const boundsCacheRef = useRef({
    heroWidth: 0,
    heroHeight: 0,
    charWidth: 0,
    charHeight: 0,
    maxX: 0,
    minX: 0,
    maxY: 0,
    minY: 0,
    isValid: false
  });

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
  const onPositionChangeRef = useRef(onPositionChange);
  // oxlint-disable-next-line react/refs
  onPositionChangeRef.current = onPositionChange;

  // Restore saved position on mount (isolated with [] to avoid re-running on parent renders)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') {
          posRef.current = { x: parsed.x, y: parsed.y };
          setPosition({ x: parsed.x, y: parsed.y });
          const displaced = Math.abs(parsed.x) > 1 || Math.abs(parsed.y) > 1;
          isDisplacedRef.current = displaced;
          setIsDisplaced(displaced);
          if (onPositionChangeRef.current) onPositionChangeRef.current(posRef.current);
        }
      }
    } catch {
      // Storage unavailable or corrupted - graceful fallback
    }
  }, []);

  // Persist position helper
  const persistPosition = useCallback((coords) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(coords));
    } catch {
      // Ignore quota or private browsing exceptions
    }
  }, []);

  /**
   * Calculate and cache boundary dimensions to avoid calling getBoundingClientRect
   * during high-frequency pointermove events (eliminating forced synchronous reflow / layout thrashing).
   */
  const updateBoundsCache = useCallback(() => {
    const heroEl = effectiveHeroRef?.current;
    if (!heroEl) {
      boundsCacheRef.current.isValid = false;
      return boundsCacheRef.current;
    }

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

    const heroWidth = heroRect.width;
    const heroHeight = heroRect.height;

    // Boundary constraints: allow natural movement while keeping character safely inside hero section
    const maxX = Math.max(20, (heroWidth / 2) - 40);
    const minX = -maxX;
    const maxY = Math.max(20, (heroHeight / 2) - 50);
    const minY = -maxY;

    boundsCacheRef.current = {
      heroWidth,
      heroHeight,
      charWidth,
      charHeight,
      maxX,
      minX,
      maxY,
      minY,
      isValid: true
    };

    return boundsCacheRef.current;
  }, [effectiveHeroRef, effectiveCharRef]);

  /**
   * Clamp coordinates within Hero section bounds using cached boundaries.
   */
  const clampToBounds = useCallback((x, y) => {
    if (!boundaryConstrainedRef.current) {
      return { x, y };
    }

    if (!boundsCacheRef.current.isValid) {
      updateBoundsCache();
    }

    if (!boundsCacheRef.current.isValid) {
      return { x, y };
    }

    const { maxX, minX, maxY, minY } = boundsCacheRef.current;

    const clampedX = Math.max(minX, Math.min(maxX, x));
    const clampedY = Math.max(minY, Math.min(maxY, y));

    return { x: clampedX, y: clampedY };
  }, [updateBoundsCache]);

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
        if (onPositionChangeRef.current) {
          onPositionChangeRef.current(posRef.current);
        } else if (effectiveCharRef?.current) {
          effectiveCharRef.current.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
        }

        springRafRef.current = requestAnimationFrame(animateSpring);
      } else {
        // Finalize at exact rest center
        posRef.current = { x: 0, y: 0 };
        setPosition({ x: 0, y: 0 });
        isDisplacedRef.current = false;
        setIsDisplaced(false);
        persistPosition({ x: 0, y: 0 });
        if (onPositionChangeRef.current) {
          onPositionChangeRef.current(posRef.current);
        } else if (effectiveCharRef?.current) {
          effectiveCharRef.current.style.transform = 'translate3d(0px, 0px, 0)';
        }
        springRafRef.current = null;
      }
    };

    springRafRef.current = requestAnimationFrame(animateSpring);
  }, [persistPosition, effectiveCharRef]);

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

      if (progress < 1 && holdTimerRef.current) {
        liftRafRef.current = requestAnimationFrame(animateLift);
      } else {
        liftProgressRef.current = 1;
        setLiftProgress(1);
        liftRafRef.current = null;
      }
    };

    liftRafRef.current = requestAnimationFrame(animateLift);
  }, []);

  /**
   * Activate drag state, elevation, pointer capture, and audio feedback
   */
  const activateDrag = useCallback((e) => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (liftRafRef.current) {
      cancelAnimationFrame(liftRafRef.current);
      liftRafRef.current = null;
    }
    isHoldingRef.current = true;
    setIsHolding(true);
    isDraggingRef.current = true;
    setIsDragging(true);
    hasDraggedRef.current = true;
    liftProgressRef.current = 1;
    setLiftProgress(1);

    const target = dragTargetRef.current || e?.target;
    const pointerId = activePointerIdRef.current ?? e?.pointerId;
    if (target && typeof target.setPointerCapture === 'function' && pointerId !== undefined && pointerId !== null) {
      try {
        target.setPointerCapture(pointerId);
      } catch {
        // Handled safely
      }
    }

    // Trigger audio & haptic feedback on successful lift
    soundFX.playLift();
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

      // Suppress subsequent click event resulting from double-click recenter
      hasDraggedRef.current = true;
      const suppressClick = (evt) => {
        evt.stopPropagation();
        evt.stopImmediatePropagation();
        evt.preventDefault();
      };
      window.addEventListener('click', suppressClick, { capture: true, once: true });
      setTimeout(() => {
        window.removeEventListener('click', suppressClick, { capture: true });
        hasDraggedRef.current = false;
      }, 100);
      return;
    }

    lastTapTimeRef.current = now;
    lastTapPosRef.current = { x: e.clientX, y: e.clientY };

    // Reset drag status for new pointer interaction
    hasDraggedRef.current = false;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    dragOffsetRef.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y
    };
    activePointerIdRef.current = e.pointerId;
    dragTargetRef.current = e.target;

    // Stop active spring animation if in motion
    if (springRafRef.current) {
      cancelAnimationFrame(springRafRef.current);
      springRafRef.current = null;
    }

    // Cache fresh bounds at pointer down so drag boundaries are ready without layout thrashing
    updateBoundsCache();

    // Begin hold verification and lift preview
    startLiftAnimation();

    holdTimerRef.current = setTimeout(() => {
      holdTimerRef.current = null;
      activateDrag(e);
    }, HOLD_DURATION_MS);
  }, [cancelHold, resetPosition, startLiftAnimation, updateBoundsCache, activateDrag]);

  /**
   * Handle Pointer Move
   */
  const handlePointerMove = useCallback((e) => {
    if (!enabledRef.current) return;
    if (activePointerIdRef.current !== null && e.pointerId !== undefined && e.pointerId !== activePointerIdRef.current) {
      return;
    }

    // If pointer is down but not dragging yet, check if movement exceeds threshold to initiate drag immediately
    if (!isDraggingRef.current && activePointerIdRef.current !== null) {
      const dx = e.clientX - pointerStartRef.current.x;
      const dy = e.clientY - pointerStartRef.current.y;
      const distance = Math.hypot(dx, dy);

      if (distance >= DRAG_START_THRESHOLD_PX) {
        activateDrag(e);
      }
    }

    // Active drag handling
    if (isDraggingRef.current) {
      hasDraggedRef.current = true;
      const rawX = e.clientX - dragOffsetRef.current.x;
      const rawY = e.clientY - dragOffsetRef.current.y;

      const clamped = clampToBounds(rawX, rawY);
      posRef.current = clamped;

      // Update displaced state flag only on change (no per-frame React state thrashing)
      const displaced = Math.abs(clamped.x) > 2 || Math.abs(clamped.y) > 2;
      if (displaced !== isDisplacedRef.current) {
        isDisplacedRef.current = displaced;
        setIsDisplaced(displaced);
      }

      // Notify consumer callback immediately for real-time DOM update
      if (onPositionChangeRef.current) {
        onPositionChangeRef.current(clamped);
      } else if (effectiveCharRef?.current) {
        effectiveCharRef.current.style.transform = `translate3d(${clamped.x.toFixed(2)}px, ${clamped.y.toFixed(2)}px, 0)`;
      }
    }
  }, [activateDrag, clampToBounds, effectiveCharRef]);

  /**
   * Handle Pointer Up / Pointer Cancel
   */
  const handlePointerUp = useCallback((e) => {
    const wasDragging = isDraggingRef.current || hasDraggedRef.current;

    // If released before 250ms hold finished and without dragging
    if (holdTimerRef.current) {
      cancelHold();
    }

    if (wasDragging) {
      isDraggingRef.current = false;
      setIsDragging(false);
      cancelHold();

      // Release pointer capture
      const target = dragTargetRef.current || e?.target;
      const pointerId = activePointerIdRef.current ?? e?.pointerId;
      if (target && typeof target.releasePointerCapture === 'function' && pointerId !== undefined && pointerId !== null) {
        try {
          target.releasePointerCapture(pointerId);
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
        const displaced = Math.abs(posRef.current.x) > 2 || Math.abs(posRef.current.y) > 2;
        isDisplacedRef.current = displaced;
        setIsDisplaced(displaced);

        // Play soft cushioned drop sound & haptic
        soundFX.playDrop();
      }

      // Suppress subsequent click event resulting from drag-and-drop
      const suppressClick = (clickEvent) => {
        clickEvent.stopPropagation();
        clickEvent.stopImmediatePropagation();
        clickEvent.preventDefault();
      };
      window.addEventListener('click', suppressClick, { capture: true, once: true });
      setTimeout(() => {
        window.removeEventListener('click', suppressClick, { capture: true });
        hasDraggedRef.current = false;
      }, 100);
    }

    activePointerIdRef.current = null;
    dragTargetRef.current = null;
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
      hasDraggedRef.current = false;
      activePointerIdRef.current = null;
      dragTargetRef.current = null;
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

  // Invalidate cached bounds on window resize or scale change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      boundsCacheRef.current.isValid = false;
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    boundsCacheRef.current.isValid = false;
  }, [userScale]);

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
    liftProgressRef,
    isDisplaced,
    hasDraggedRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    resetPosition,
    clampToBounds,
    updateBoundsCache
  };
}

export default useDraggableCharacter;
