import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useGyroscopeTracking
 * 
 * High-performance hook for Mobile & Gyro-enabled devices:
 * 1. Automatically detects DeviceOrientationEvent support and touch capability.
 * 2. Handles iOS 13+ DeviceOrientationEvent.requestPermission() user gestures seamlessly.
 * 3. Screen orientation aware (Portrait 0°, Landscape 90°, -90°/270°, 180°).
 * 4. Dual baseline angle calibration (Beta for portrait, Gamma for landscape) with auto-recalibration on screen rotation.
 * 5. Deadzone filtering & exponential smoothing for jitter-free 60-120 FPS kinematics.
 * 6. Dual Zero-Render Ref + React State API for ultra-low latency.
 * 7. Full 2D Directional Viewport & Container Scrolling (Tilt-to-scroll: up, down, left, right, and diagonals).
 * 8. User touch-pause protection to prevent fighting between finger gestures and tilt scroll.
 */
export function useGyroscopeTracking({
  enabled = true,
  scrollEnabled = true,
  baselinePitch = 45,
  maxTiltX = 25,
  maxTiltY = 25,
  deadzone = 2.0,
  scrollThreshold = 0.18,
  maxScrollSpeed = 800,
  reducedMotion = false
} = {}) {
  // Insecure context detection (HTTP on non-localhost, where Android Chrome blocks sensor access)
  const checkIsInsecureContext = () => {
    if (typeof window === 'undefined') return false;
    return (
      !window.isSecureContext &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
    );
  };

  // Safe initial detection
  const checkInitialSupport = () => {
    if (typeof window === 'undefined') return false;
    return (
      'DeviceOrientationEvent' in window ||
      'DeviceMotionEvent' in window ||
      'ondeviceorientationabsolute' in window
    );
  };

  const checkIsTouchDevice = () => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);
  };

  const checkInitialPermission = () => {
    if (typeof window === 'undefined') return 'unknown';
    if (!('DeviceOrientationEvent' in window) && !('DeviceMotionEvent' in window)) return 'unsupported';
    if (
      typeof window.DeviceOrientationEvent !== 'undefined' &&
      typeof window.DeviceOrientationEvent.requestPermission === 'function'
    ) {
      return 'prompt';
    }
    return 'granted';
  };

  const getScreenAngle = () => {
    if (typeof window === 'undefined') return 0;
    if (typeof window.screen !== 'undefined' && window.screen.orientation && typeof window.screen.orientation.angle === 'number') {
      return window.screen.orientation.angle;
    }
    if (typeof window.orientation === 'number') {
      return window.orientation;
    }
    return 0;
  };

  // High-frequency mutable tracking ref (zero React re-renders on sensor ticks)
  const gyroStateRef = useRef({
    supported: checkInitialSupport(),
    permission: checkInitialPermission(),
    isTouchDevice: checkIsTouchDevice(),
    isInsecureContext: checkIsInsecureContext(),
    isActive: false,
    rawBeta: 45,
    rawGamma: 0,
    rawAlpha: 0,
    tiltX: 0,
    tiltY: 0,
    normX: 0,
    normY: 0,
    smoothedNormX: 0,
    smoothedNormY: 0,
    baselineBeta: baselinePitch,
    baselineGamma: 0,
    isCalibrated: false,
    screenAngle: getScreenAngle(),
    scrollDirection: null, // null | 'up' | 'down' | 'left' | 'right' | 'down-right' ...
    isScrolling: false,
    isUserTouching: false,
    lastTouchTime: 0
  });

  // Reactive state for UI indicators & toggle buttons
  const [isSupported] = useState(checkInitialSupport);
  const [isTouchDevice] = useState(checkIsTouchDevice);
  const [isInsecureContext] = useState(checkIsInsecureContext);
  const [permissionState, setPermissionState] = useState(checkInitialPermission);
  const [isActive, setIsActive] = useState(false);
  const [isGyroScrollActive, setIsGyroScrollActive] = useState(scrollEnabled);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [activeScrollDir, setActiveScrollDir] = useState(null);
  const lastActiveScrollDirRef = useRef(null);

  const attachSensorsRef = useRef(null);

  // Recalibrate current resting angle
  const recalibrate = useCallback(() => {
    const state = gyroStateRef.current;
    const angle = getScreenAngle();
    state.screenAngle = angle;

    if (angle === 90 || angle === -90 || angle === 270) {
      // Landscape: resting pitch is along gamma
      state.baselineGamma = state.rawGamma || baselinePitch;
      state.baselineBeta = state.rawBeta || 0;
    } else {
      // Portrait: resting pitch is along beta
      state.baselineBeta = state.rawBeta || baselinePitch;
      state.baselineGamma = state.rawGamma || 0;
    }
    state.isCalibrated = true;
    setIsCalibrated(true);

    if (attachSensorsRef.current) {
      attachSensorsRef.current();
    }
  }, [baselinePitch]);

  // Request permission (Required for iOS 13+ on user tap)
  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined') return false;

    if (
      typeof window.DeviceOrientationEvent !== 'undefined' &&
      typeof window.DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        const response = await window.DeviceOrientationEvent.requestPermission();
        gyroStateRef.current.permission = response;
        setPermissionState(response);
        if (response === 'granted') {
          gyroStateRef.current.isActive = true;
          setIsActive(true);
          if (attachSensorsRef.current) attachSensorsRef.current();
          return true;
        }
        return false;
      } catch (err) {
        console.warn('DeviceOrientation permission error:', err);
        gyroStateRef.current.permission = 'denied';
        setPermissionState('denied');
        return false;
      }
    } else if (
      typeof window.DeviceMotionEvent !== 'undefined' &&
      typeof window.DeviceMotionEvent.requestPermission === 'function'
    ) {
      try {
        const response = await window.DeviceMotionEvent.requestPermission();
        gyroStateRef.current.permission = response;
        setPermissionState(response);
        if (response === 'granted') {
          gyroStateRef.current.isActive = true;
          setIsActive(true);
          if (attachSensorsRef.current) attachSensorsRef.current();
          return true;
        }
        return false;
      } catch (err) {
        console.warn('DeviceMotion permission error:', err);
        gyroStateRef.current.permission = 'denied';
        setPermissionState('denied');
        return false;
      }
    } else {
      // Non-iOS / Android Chrome: already granted
      gyroStateRef.current.permission = 'granted';
      gyroStateRef.current.isActive = true;
      setPermissionState('granted');
      setIsActive(true);
      if (attachSensorsRef.current) attachSensorsRef.current();
      return true;
    }
  }, []);

  // Handle device orientation events, Android absolute/motion fallbacks & auto-calibration
  useEffect(() => {
    if (typeof window === 'undefined' || !enabled || reducedMotion) {
      gyroStateRef.current.isActive = false;
      return;
    }

    // If on iOS and not yet granted, wait for user interaction
    if (permissionState === 'prompt' || permissionState === 'denied' || permissionState === 'unsupported') {
      return;
    }

    let lastStandardOrientationTime = 0;
    let lastAnyOrientationTime = 0;
    let hasReceivedValidReading = false;

    const processAngles = (beta, gamma, alpha = 0) => {
      if (beta === null || gamma === null || Number.isNaN(beta) || Number.isNaN(gamma)) return;

      const state = gyroStateRef.current;
      state.rawBeta = beta;
      state.rawGamma = gamma;
      state.rawAlpha = alpha || 0;

      const orientationAngle = getScreenAngle();
      state.screenAngle = orientationAngle;

      if (!hasReceivedValidReading) {
        hasReceivedValidReading = true;
        state.isActive = true;
        setIsActive(true);

        // Auto-calibrate baseline resting angle on first valid reading
        if (!state.isCalibrated) {
          if (orientationAngle === 90 || orientationAngle === -90 || orientationAngle === 270) {
            if (Math.abs(gamma) >= 10 && Math.abs(gamma) <= 85) {
              state.baselineGamma = gamma;
              state.baselineBeta = beta || 0;
              state.isCalibrated = true;
              setIsCalibrated(true);
            }
          } else {
            if (beta >= 10 && beta <= 85) {
              state.baselineBeta = beta;
              state.baselineGamma = gamma || 0;
              state.isCalibrated = true;
              setIsCalibrated(true);
            }
          }
        }
      }

      // Compute relative pitch and roll based on orientation
      const deltaBeta = beta - state.baselineBeta;
      const deltaGamma = gamma - state.baselineGamma;

      let tiltX = 0;
      let tiltY = 0;

      if (orientationAngle === 90) {
        tiltX = -deltaBeta;
        tiltY = deltaGamma;
      } else if (orientationAngle === -90 || orientationAngle === 270) {
        tiltX = deltaBeta;
        tiltY = -deltaGamma;
      } else if (orientationAngle === 180) {
        tiltX = -deltaGamma;
        tiltY = -deltaBeta;
      } else {
        // Portrait 0°
        tiltX = deltaGamma;
        tiltY = deltaBeta;
      }

      // Deadzone filtering to prevent micro hand tremors
      if (Math.abs(tiltX) < deadzone) tiltX = 0;
      if (Math.abs(tiltY) < deadzone) tiltY = 0;

      state.tiltX = tiltX;
      state.tiltY = tiltY;

      // Normalization to [-0.5, 0.5] range (matching HeroSection cursor coordinates exactly)
      state.normX = Math.max(-0.5, Math.min(0.5, (tiltX / maxTiltX) * 0.5));
      state.normY = Math.max(-0.5, Math.min(0.5, (tiltY / maxTiltY) * 0.5));
    };

    const handleOrientation = (e) => {
      if (e.beta !== null && e.gamma !== null && !Number.isNaN(e.beta) && !Number.isNaN(e.gamma)) {
        lastStandardOrientationTime = Date.now();
        lastAnyOrientationTime = Date.now();
        processAngles(e.beta, e.gamma, e.alpha || 0);
      }
    };

    const handleOrientationAbsolute = (e) => {
      // Prioritize standard orientation (Game Rotation Vector); only use absolute if standard is inactive
      if (Date.now() - lastStandardOrientationTime < 1000) return;

      if (e.beta !== null && e.gamma !== null && !Number.isNaN(e.beta) && !Number.isNaN(e.gamma)) {
        lastAnyOrientationTime = Date.now();
        processAngles(e.beta, e.gamma, e.alpha || 0);
      }
    };

    const handleMotion = (e) => {
      // Only fallback to devicemotion gravity vector if orientation events are not active
      if (Date.now() - lastAnyOrientationTime < 1000) return;

      const acc = e.accelerationIncludingGravity;
      if (!acc || (acc.x === null && acc.y === null && acc.z === null)) return;
      const ax = acc.x ?? 0;
      const ay = acc.y ?? 0;
      const az = acc.z ?? 0;
      if (ax === 0 && ay === 0 && az === 0) return;

      // Calculate pitch & roll from gravity vector
      const pitch = Math.atan2(-ay, Math.sqrt(ax * ax + az * az)) * (180 / Math.PI);
      const roll = Math.atan2(ax, az) * (180 / Math.PI);

      processAngles(pitch, roll, 0);
    };

    // Auto-recalibrate baseline when user rotates their device
    const handleOrientationChange = () => {
      setTimeout(() => {
        recalibrate();
      }, 150);
    };

    // Sensor attachment & touch interaction handling
    const attachSensors = () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('deviceorientationabsolute', handleOrientationAbsolute);
      window.removeEventListener('devicemotion', handleMotion);

      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
      window.addEventListener('deviceorientationabsolute', handleOrientationAbsolute, { passive: true });
      window.addEventListener('devicemotion', handleMotion, { passive: true });
    };

    attachSensorsRef.current = attachSensors;
    attachSensors();

    // User touch interaction listeners to pause tilt-scroll during manual finger swiping
    // and ensure high-frequency sensor streaming is unlocked on first user gesture.
    // Captured at top level to ensure first touch activates sensors even if child elements stop propagation.
    const handleTouchStart = () => {
      gyroStateRef.current.isUserTouching = true;
      gyroStateRef.current.lastTouchTime = Date.now();
      attachSensors();
    };

    const handleTouchEnd = () => {
      gyroStateRef.current.isUserTouching = false;
      gyroStateRef.current.lastTouchTime = Date.now();
    };

    const handlePointerDown = (e) => {
      const isTouchPointer = e.pointerType === 'touch' || e.pointerType === 'pen' || (!e.pointerType && gyroStateRef.current.isTouchDevice);
      if (isTouchPointer) {
        gyroStateRef.current.isUserTouching = true;
        gyroStateRef.current.lastTouchTime = Date.now();
      }
      attachSensors();
    };

    const handlePointerUp = (e) => {
      const isTouchPointer = e.pointerType === 'touch' || e.pointerType === 'pen' || (!e.pointerType && gyroStateRef.current.isTouchDevice);
      if (isTouchPointer) {
        gyroStateRef.current.isUserTouching = false;
        gyroStateRef.current.lastTouchTime = Date.now();
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true, capture: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true, capture: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true, capture: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true, capture: true });

    if (typeof window.screen !== 'undefined' && window.screen.orientation) {
      window.screen.orientation.addEventListener('change', handleOrientationChange);
    }
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      attachSensorsRef.current = null;
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('deviceorientationabsolute', handleOrientationAbsolute);
      window.removeEventListener('devicemotion', handleMotion);
      window.removeEventListener('touchstart', handleTouchStart, { capture: true });
      window.removeEventListener('touchend', handleTouchEnd, { capture: true });
      window.removeEventListener('touchcancel', handleTouchEnd, { capture: true });
      window.removeEventListener('pointerdown', handlePointerDown, { capture: true });
      window.removeEventListener('pointerup', handlePointerUp, { capture: true });

      if (typeof window.screen !== 'undefined' && window.screen.orientation) {
        window.screen.orientation.removeEventListener('change', handleOrientationChange);
      }
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [enabled, reducedMotion, permissionState, deadzone, maxTiltX, maxTiltY, recalibrate]);

  // Frame-rate independent rAF Loop for Gyro Multi-Directional Viewport Scrolling & Smoothing
  useEffect(() => {
    if (typeof window === 'undefined' || !enabled || reducedMotion) return;

    let rafId = null;
    let lastTime = performance.now();

    const scrollTick = (currentTime) => {
      const dt = Math.min(Math.max((currentTime - lastTime) / 1000, 0.001), 0.05);
      lastTime = currentTime;

      const state = gyroStateRef.current;

      // Exponential smoothing for normX and normY (lambda = 16.0)
      const lerpFactor = 1.0 - Math.exp(-16.0 * dt);
      state.smoothedNormX += (state.normX - state.smoothedNormX) * lerpFactor;
      state.smoothedNormY += (state.normY - state.smoothedNormY) * lerpFactor;

      // Check if tilt-based directional viewport scrolling is active
      const now = Date.now();
      const isTouchingRecently = state.isUserTouching || (now - state.lastTouchTime < 650);

      let currentScrollDir = null;

      if (state.isActive && isGyroScrollActive && !isTouchingRecently) {
        const normX = state.smoothedNormX;
        const normY = state.smoothedNormY;
        const absX = Math.abs(normX);
        const absY = Math.abs(normY);

        let scrollSpeedX = 0;
        let scrollSpeedY = 0;

        // Smooth non-linear scroll acceleration curve:
        // Gentle crawl at 0.18 - 0.35 tilt, swift acceleration at > 0.35 tilt
        const calcScrollSpeed = (val, absVal) => {
          if (absVal <= scrollThreshold) return 0;
          const rawRatio = Math.min(1, Math.max(0, (absVal - scrollThreshold) / (0.5 - scrollThreshold)));
          // Exponential power curve (1.55) gives gentle granular control on subtle tilt and swift panning on deep tilt
          const curvedRatio = Math.pow(rawRatio, 1.55);
          return Math.sign(val) * curvedRatio * maxScrollSpeed * dt;
        };

        if (absY > scrollThreshold) {
          scrollSpeedY = calcScrollSpeed(normY, absY);
        }

        if (absX > scrollThreshold) {
          scrollSpeedX = calcScrollSpeed(normX, absX);
        }

        if (absX > scrollThreshold || absY > scrollThreshold) {
          state.isScrolling = true;
          const dirY = absY > scrollThreshold ? (normY > 0 ? 'down' : 'up') : '';
          const dirX = absX > scrollThreshold ? (normX > 0 ? 'right' : 'left') : '';
          state.scrollDirection = dirY && dirX ? `${dirY}-${dirX}` : (dirY || dirX || null);
          currentScrollDir = state.scrollDirection;

          if (Math.abs(scrollSpeedY) > 0.05 || Math.abs(scrollSpeedX) > 0.05) {
            window.scrollBy({ top: scrollSpeedY, left: scrollSpeedX, behavior: 'auto' });

            // If horizontal container exists in view, scroll it proportionally
            if (Math.abs(scrollSpeedX) > 0.05) {
              try {
                const activeEl = document.activeElement;
                if (activeEl && activeEl.scrollWidth > activeEl.clientWidth) {
                  activeEl.scrollLeft += scrollSpeedX;
                } else {
                  const scrollable = document.querySelector('.overflow-x-auto');
                  if (scrollable && scrollable.scrollWidth > scrollable.clientWidth) {
                    scrollable.scrollLeft += scrollSpeedX;
                  }
                }
              } catch {
                // Ignore DOM errors
              }
            }
          }
        } else {
          state.isScrolling = false;
          state.scrollDirection = null;
          currentScrollDir = null;
        }
      } else {
        state.isScrolling = false;
        state.scrollDirection = null;
        currentScrollDir = null;
      }

      if (lastActiveScrollDirRef.current !== currentScrollDir) {
        lastActiveScrollDirRef.current = currentScrollDir;
        setActiveScrollDir(currentScrollDir);
      }

      rafId = requestAnimationFrame(scrollTick);
    };

    rafId = requestAnimationFrame(scrollTick);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lastActiveScrollDirRef.current !== null) {
        lastActiveScrollDirRef.current = null;
        setActiveScrollDir(null);
      }
    };
  }, [enabled, reducedMotion, isGyroScrollActive, scrollThreshold, maxScrollSpeed]);

  const toggleGyroScroll = useCallback(() => {
    setIsGyroScrollActive(prev => !prev);
  }, []);

  return {
    gyroStateRef,
    isSupported,
    isTouchDevice,
    isInsecureContext,
    permissionState,
    isActive,
    isGyroScrollActive,
    isCalibrated,
    scrollDirection: activeScrollDir,
    activeScrollDir,
    recalibrate,
    requestPermission,
    toggleGyroScroll
  };
}

export default useGyroscopeTracking;
