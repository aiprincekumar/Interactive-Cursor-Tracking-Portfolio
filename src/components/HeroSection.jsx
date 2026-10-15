import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Minus, Plus, Images } from 'lucide-react';
import { soundFX } from '../utils/audio';
import { NotionIcon, GithubIcon, LinkedinIcon, YoutubeIcon, FacebookIcon, InstagramIcon, TwitterIcon } from './Icons';
import confetti from 'canvas-confetti';

/**
 * Full-Screen Reel-Accurate Character Hero Section
 * 
 * Features:
 * - 100vh / min-h-screen full viewport immersion (zero boxed 16:9 card)
 * - Seamless edge-to-edge character stage centered in viewport
 * - Continuous 2.5D head & gaze tracking with 60-120 FPS requestAnimationFrame loop
 * - Zero React re-renders on pointer movement
 * - Smooth cubic Hermite pose crossfading between Center, Left, and Right angles
 * - Clean Reel-matching typography & social icons in Bottom-Left
 * - Sleek dark pill "Shoot a look 📸" button in Bottom-Right
 */
const BASE_URL = import.meta.env.BASE_URL || './';
const BASELINE_SCALE = 0.95;
const IMG_BG_HERO = `${BASE_URL}assets/hero_poses/BgHero.jpg`;
const IMG_REAR = `${BASE_URL}assets/hero_poses/00-rear-view.png`;
const IMG_CENTER_UP = `${BASE_URL}assets/hero_poses/01-center-up.png`;
const IMG_LOWER_CENTER = `${BASE_URL}assets/hero_poses/02-lower-center.png`;
const IMG_CENTER_LEFT = `${BASE_URL}assets/hero_poses/03-center-left.png`;
const IMG_CENTER_RIGHT = `${BASE_URL}assets/hero_poses/04-center-right.png`;
const IMG_CENTER_FRONT = `${BASE_URL}assets/hero_poses/05-center-front.png`;
const IMG_UPPER_LEFT = `${BASE_URL}assets/hero_poses/06-upper-left.png`;
const IMG_LOWER_LEFT = `${BASE_URL}assets/hero_poses/07-lower-left.png`;
const IMG_UPPER_RIGHT = `${BASE_URL}assets/hero_poses/08-upper-right.png`;
const IMG_LOWER_RIGHT = `${BASE_URL}assets/hero_poses/09-lower-right.png`;

// Directional pose aliases
const IMG_IDLE = IMG_REAR;
const IMG_CENTER = IMG_CENTER_FRONT;
const IMG_UPPER_CENTER = IMG_CENTER_UP;
const IMG_LEFT = IMG_CENTER_LEFT;
const IMG_RIGHT = IMG_CENTER_RIGHT;

export default function HeroSection({
  heroRef,
  isInsideHero,
  setIsInsideHero,
  onPhotoCaptured,
  forcedState,
  reducedMotion
}) {
  const [isFlashing, setIsFlashing] = useState(false);
  const [photosCount, setPhotosCount] = useState(0);

  // Character Scaling System (Baseline 0.95 normalized to 100% / 1.0x, range 0.5 - 2.0)
  const [userScale, setUserScale] = useState(1.0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showHudBadge, setShowHudBadge] = useState(false);
  const hudTimerRef = useRef(null);
  const userScaleRef = useRef(userScale);
  const characterInnerRef = useRef(null);

  useEffect(() => {
    userScaleRef.current = userScale;
  }, [userScale]);

  const effectiveScale = BASELINE_SCALE * userScale;

  // Direct DOM references for 120 FPS zero-render GPU updates (10 Total: 9 Directions + 1 Idle)
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const imgIdleRef = useRef(null);
  const imgCenterRef = useRef(null);
  const imgUpperCenterRef = useRef(null);
  const imgLowerCenterRef = useRef(null);
  const imgLeftRef = useRef(null);
  const imgRightRef = useRef(null);
  const imgUpperLeftRef = useRef(null);
  const imgLowerLeftRef = useRef(null);
  const imgUpperRightRef = useRef(null);
  const imgLowerRightRef = useRef(null);
  const reticleRef = useRef(null);

  // Tracking state store
  const animStateRef = useRef({
    targetNormX: 0,
    targetNormY: 0,
    currentNormX: 0,
    currentNormY: 0,
    pointerX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    pointerY: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
    activePose: 'idle',
    isHovered: false,
    hoverWeight: 0,
    rafId: null
  });

  const isInsideHeroRef = useRef(isInsideHero);
  useEffect(() => {
    isInsideHeroRef.current = isInsideHero;
  }, [isInsideHero]);

  // Preload and immediately decode all assets (Background + 10 Character Poses) into GPU memory
  useEffect(() => {
    [
      IMG_BG_HERO,
      IMG_REAR,
      IMG_CENTER_FRONT,
      IMG_CENTER_UP,
      IMG_LOWER_CENTER,
      IMG_CENTER_LEFT,
      IMG_CENTER_RIGHT,
      IMG_UPPER_LEFT,
      IMG_LOWER_LEFT,
      IMG_UPPER_RIGHT,
      IMG_LOWER_RIGHT
    ].forEach(src => {
      const img = new Image();
      img.src = src;
      if (typeof img.decode === 'function') {
        img.decode().catch(() => {});
      }
    });
  }, []);

  // Continuous frame-rate independent rAF Animation Loop with delta time
  useEffect(() => {
    let active = true;
    let localRafId = null;
    let lastTime = performance.now();

    if (reducedMotion) {
      if (stageRef.current) {
        stageRef.current.style.transform = 'none';
      }
      const p = forcedState || (isInsideHeroRef.current ? 'center' : 'idle');
      if (imgIdleRef.current) imgIdleRef.current.style.opacity = (p === 'idle' || p === 'rear-view') ? '1' : '0';
      if (imgCenterRef.current) imgCenterRef.current.style.opacity = (p === 'center' || p === 'center-front') ? '1' : '0';
      if (imgUpperCenterRef.current) imgUpperCenterRef.current.style.opacity = (p === 'upper-center' || p === 'center-upper') ? '1' : '0';
      if (imgLowerCenterRef.current) imgLowerCenterRef.current.style.opacity = (p === 'lower-center' || p === 'center-lower') ? '1' : '0';
      if (imgLeftRef.current) imgLeftRef.current.style.opacity = (p === 'left' || p === 'center-left') ? '1' : '0';
      if (imgRightRef.current) imgRightRef.current.style.opacity = (p === 'right' || p === 'center-right') ? '1' : '0';
      if (imgUpperLeftRef.current) imgUpperLeftRef.current.style.opacity = p === 'upper-left' ? '1' : '0';
      if (imgLowerLeftRef.current) imgLowerLeftRef.current.style.opacity = p === 'lower-left' ? '1' : '0';
      if (imgUpperRightRef.current) imgUpperRightRef.current.style.opacity = p === 'upper-right' ? '1' : '0';
      if (imgLowerRightRef.current) imgLowerRightRef.current.style.opacity = p === 'lower-right' ? '1' : '0';
      animStateRef.current.activePose = p;
      return () => {
        active = false;
      };
    }

    const tick = (currentTime) => {
      if (!active) return;
      const state = animStateRef.current;

      // Delta time in seconds, clamped between 1ms and 50ms
      const dt = Math.min(Math.max((currentTime - lastTime) / 1000, 0.001), 0.05);
      lastTime = currentTime;

      // Frame-rate independent exponential damping (lambda = 15.0 for swift, buttery-smooth follow)
      const lerpFactor = 1.0 - Math.exp(-15.0 * dt);
      state.currentNormX += (state.targetNormX - state.currentNormX) * lerpFactor;
      state.currentNormY += (state.targetNormY - state.currentNormY) * lerpFactor;

      // Fast, responsive hover blend: 0 when cursor outside hero, 1 when inside
      const targetHover = state.isHovered ? 1 : 0;
      const hoverLerp = 1.0 - Math.exp(-18.0 * dt);
      state.hoverWeight += (targetHover - state.hoverWeight) * hoverLerp;

      const curX = state.currentNormX;
      const curY = state.currentNormY;

      // Flat 2D display - zero 3D perspective, tilt, pitch, yaw, or warping
      if (stageRef.current) {
        stageRef.current.style.transform = 'none';
      }

      // 2. Continuous 9-Direction Pose Crossfading with Cubic Hermite Smoothstep
      let idleOp = Math.max(0, 1 - state.hoverWeight);
      let centerOp = 0;
      let upCenterOp = 0;
      let lowCenterOp = 0;
      let leftOp = 0;
      let rightOp = 0;
      let upLeftOp = 0;
      let lowLeftOp = 0;
      let upRightOp = 0;
      let lowRightOp = 0;

      if (forcedState) {
        idleOp = (forcedState === 'idle' || forcedState === 'rear-view') ? 1 : 0;
        centerOp = (forcedState === 'center' || forcedState === 'center-front') ? 1 : 0;
        upCenterOp = (forcedState === 'upper-center' || forcedState === 'center-upper') ? 1 : 0;
        lowCenterOp = (forcedState === 'lower-center' || forcedState === 'center-lower') ? 1 : 0;
        leftOp = (forcedState === 'left' || forcedState === 'center-left') ? 1 : 0;
        rightOp = (forcedState === 'right' || forcedState === 'center-right') ? 1 : 0;
        upLeftOp = forcedState === 'upper-left' ? 1 : 0;
        lowLeftOp = forcedState === 'lower-left' ? 1 : 0;
        upRightOp = forcedState === 'upper-right' ? 1 : 0;
        lowRightOp = forcedState === 'lower-right' ? 1 : 0;
        state.activePose = forcedState;
      } else {
        const smoothstep = (min, max, value) => {
          const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
          return x * x * (3 - 2 * x);
        };

        // 3 Horizontal Zones (Left, Center, Right)
        const colLeft = smoothstep(-0.06, -0.22, curX);
        const colRight = smoothstep(0.06, 0.22, curX);
        const colCenter = Math.max(0, 1 - colLeft - colRight);

        // 3 Vertical Zones (Upper, Middle, Lower)
        const rowUp = smoothstep(-0.06, -0.22, curY);
        const rowDown = smoothstep(0.06, 0.22, curY);
        const rowMid = Math.max(0, 1 - rowUp - rowDown);

        const activeTrackingWeight = state.hoverWeight;

        // Top row
        upLeftOp = colLeft * rowUp * activeTrackingWeight;
        upCenterOp = colCenter * rowUp * activeTrackingWeight;
        upRightOp = colRight * rowUp * activeTrackingWeight;

        // Middle row
        leftOp = colLeft * rowMid * activeTrackingWeight;
        centerOp = colCenter * rowMid * activeTrackingWeight;
        rightOp = colRight * rowMid * activeTrackingWeight;

        // Bottom row
        lowLeftOp = colLeft * rowDown * activeTrackingWeight;
        lowCenterOp = colCenter * rowDown * activeTrackingWeight;
        lowRightOp = colRight * rowDown * activeTrackingWeight;

        const ops = {
          'idle': idleOp,
          'center': centerOp,
          'upper-center': upCenterOp,
          'lower-center': lowCenterOp,
          'left': leftOp,
          'right': rightOp,
          'upper-left': upLeftOp,
          'lower-left': lowLeftOp,
          'upper-right': upRightOp,
          'lower-right': lowRightOp
        };

        let maxOp = -1;
        let domPose = 'idle';
        for (const p in ops) {
          if (ops[p] > maxOp) {
            maxOp = ops[p];
            domPose = p;
          }
        }
        state.activePose = domPose;
      }

      // Apply opacities directly to DOM (0 React re-renders)
      if (imgIdleRef.current) imgIdleRef.current.style.opacity = idleOp.toFixed(3);
      if (imgCenterRef.current) imgCenterRef.current.style.opacity = centerOp.toFixed(3);
      if (imgUpperCenterRef.current) imgUpperCenterRef.current.style.opacity = upCenterOp.toFixed(3);
      if (imgLowerCenterRef.current) imgLowerCenterRef.current.style.opacity = lowCenterOp.toFixed(3);
      if (imgLeftRef.current) imgLeftRef.current.style.opacity = leftOp.toFixed(3);
      if (imgRightRef.current) imgRightRef.current.style.opacity = rightOp.toFixed(3);
      if (imgUpperLeftRef.current) imgUpperLeftRef.current.style.opacity = upLeftOp.toFixed(3);
      if (imgLowerLeftRef.current) imgLowerLeftRef.current.style.opacity = lowLeftOp.toFixed(3);
      if (imgUpperRightRef.current) imgUpperRightRef.current.style.opacity = upRightOp.toFixed(3);
      if (imgLowerRightRef.current) imgLowerRightRef.current.style.opacity = lowRightOp.toFixed(3);

      // 3. Smooth Viewfinder Reticle follow
      if (reticleRef.current && state.isHovered) {
        reticleRef.current.style.transform = `translate3d(${state.pointerX}px, ${state.pointerY}px, 0)`;
      }

      localRafId = requestAnimationFrame(tick);
      state.rafId = localRafId;
    };

    localRafId = requestAnimationFrame(tick);
    animStateRef.current.rafId = localRafId;
    return () => {
      active = false;
      if (localRafId) {
        cancelAnimationFrame(localRafId);
      }
    };
  }, [reducedMotion, forcedState]);

  // High-performance passive window pointer tracking (0ms input latency, no React event queue overhead)
  useEffect(() => {
    if (reducedMotion) return;

    const handleWindowPointer = (e) => {
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);
      if (clientX === undefined || clientY === undefined) return;

      const state = animStateRef.current;
      state.pointerX = clientX;
      state.pointerY = clientY;

      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const isInside = (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );

      if (isInside !== state.isHovered) {
        state.isHovered = isInside;
        setIsInsideHero(isInside);
      }

      if (isInside) {
        const w = rect.width || window.innerWidth || 1920;
        const h = rect.height || window.innerHeight || 1080;
        state.targetNormX = Math.max(-0.5, Math.min(0.5, (clientX - rect.left) / w - 0.5));
        state.targetNormY = Math.max(-0.5, Math.min(0.5, (clientY - rect.top) / h - 0.5));
      } else {
        state.targetNormX = 0;
        state.targetNormY = 0;
      }
    };

    window.addEventListener('pointermove', handleWindowPointer, { passive: true });
    window.addEventListener('touchmove', handleWindowPointer, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handleWindowPointer);
      window.removeEventListener('touchmove', handleWindowPointer);
    };
  }, [reducedMotion, setIsInsideHero]);

  // Floating HUD notification trigger
  const triggerHud = useCallback(() => {
    setShowHudBadge(true);
    if (hudTimerRef.current) {
      clearTimeout(hudTimerRef.current);
    }
    hudTimerRef.current = setTimeout(() => {
      setShowHudBadge(false);
    }, 1500);
  }, []);

  useEffect(() => {
    return () => {
      if (hudTimerRef.current) {
        clearTimeout(hudTimerRef.current);
      }
    };
  }, []);

  // Scale action buttons with smooth transition
  const handleZoomIn = useCallback(() => {
    setIsTransitioning(true);
    setUserScale(prev => Math.min(2.0, Math.round((prev + 0.10) * 100) / 100));
    triggerHud();
  }, [triggerHud]);

  const handleZoomOut = useCallback(() => {
    setIsTransitioning(true);
    setUserScale(prev => Math.max(0.5, Math.round((prev - 0.10) * 100) / 100));
    triggerHud();
  }, [triggerHud]);

  const handleReset = useCallback(() => {
    setIsTransitioning(true);
    setUserScale(1.0);
    triggerHud();
  }, [triggerHud]);

  // Instantaneous zero-lag slider response
  const handleSliderChange = useCallback((e) => {
    setIsTransitioning(false);
    const val = parseFloat(e.target.value);
    setUserScale(val / 100);
    triggerHud();
  }, [triggerHud]);

  // Non-passive wheel listener (Ctrl/Meta + Wheel) and 2-finger pinch gesture
  const isPinchingRef = useRef(false);
  const touchDistRef = useRef(null);
  const touchStartScaleRef = useRef(1.0);

  useEffect(() => {
    const heroEl = sectionRef.current;
    if (!heroEl) return;

    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setIsTransitioning(false);
        const delta = -e.deltaY;
        const zoomStep = Math.sign(delta) * Math.min(Math.abs(delta) * 0.002, 0.15);
        setUserScale(prev => {
          const next = Math.min(2.0, Math.max(0.5, Math.round((prev + zoomStep) * 100) / 100));
          return next;
        });
        triggerHud();
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        isPinchingRef.current = true;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchDistRef.current = Math.hypot(dx, dy);
        touchStartScaleRef.current = userScaleRef.current;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && touchDistRef.current) {
        e.preventDefault();
        setIsTransitioning(false);
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDist = Math.hypot(dx, dy);
        if (touchDistRef.current > 0) {
          const ratio = currentDist / touchDistRef.current;
          const targetScale = touchStartScaleRef.current * ratio;
          const clamped = Math.min(2.0, Math.max(0.5, Math.round(targetScale * 100) / 100));
          setUserScale(clamped);
          triggerHud();
        }
      }
    };

    const handleTouchEnd = (e) => {
      if (e.touches.length < 2) {
        touchDistRef.current = null;
        setTimeout(() => {
          isPinchingRef.current = false;
        }, 300);
      }
    };

    heroEl.addEventListener('wheel', handleWheel, { passive: false });
    heroEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    heroEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    heroEl.addEventListener('touchend', handleTouchEnd, { passive: true });
    heroEl.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      heroEl.removeEventListener('wheel', handleWheel);
      heroEl.removeEventListener('touchstart', handleTouchStart);
      heroEl.removeEventListener('touchmove', handleTouchMove);
      heroEl.removeEventListener('touchend', handleTouchEnd);
      heroEl.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [triggerHud]);

  // Trigger Shutter Snap Action
  const triggerCapture = useCallback(() => {
    if (isPinchingRef.current) return;
    soundFX.playShutter();

    if (!reducedMotion) {
      setIsFlashing(true);
      confetti({
        particleCount: 32,
        spread: 65,
        origin: { y: 0.55 },
        colors: ['#FF3F6C', '#FFA4B6', '#FFF0F3', '#FFD1DC', '#FFE4E8']
      });
    }

    setPhotosCount(prev => prev + 1);

    const activePose = animStateRef.current.activePose;
    if (onPhotoCaptured) {
      const poseMap = {
        'idle': { src: IMG_IDLE, title: 'Rear View (Idle)' },
        'rear-view': { src: IMG_IDLE, title: 'Rear View (Idle)' },
        'center': { src: IMG_CENTER, title: 'Signature Center Front' },
        'center-front': { src: IMG_CENTER, title: 'Signature Center Front' },
        'upper-center': { src: IMG_UPPER_CENTER, title: 'Upper Center Gaze' },
        'center-upper': { src: IMG_UPPER_CENTER, title: 'Upper Center Gaze' },
        'lower-center': { src: IMG_LOWER_CENTER, title: 'Lower Center Glance' },
        'center-lower': { src: IMG_LOWER_CENTER, title: 'Lower Center Glance' },
        'left': { src: IMG_LEFT, title: 'Profile Left Gaze' },
        'center-left': { src: IMG_LEFT, title: 'Profile Left Gaze' },
        'right': { src: IMG_RIGHT, title: 'Profile Right Gaze' },
        'center-right': { src: IMG_RIGHT, title: 'Profile Right Gaze' },
        'upper-left': { src: IMG_UPPER_LEFT, title: 'Upper Left Glance' },
        'lower-left': { src: IMG_LOWER_LEFT, title: 'Lower Left Glance' },
        'upper-right': { src: IMG_UPPER_RIGHT, title: 'Upper Right Glance' },
        'lower-right': { src: IMG_LOWER_RIGHT, title: 'Lower Right Glance' }
      };
      
      const poseData = poseMap[activePose] || poseMap['center'];
      
      onPhotoCaptured({
        id: Date.now(),
        state: activePose,
        imageSrc: poseData.src,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        title: poseData.title,
        likes: Math.floor(Math.random() * 25) + 10,
        scale: userScaleRef.current
      });
    }

    setTimeout(() => {
      setIsFlashing(false);
    }, 280);
  }, [reducedMotion, onPhotoCaptured]);

  return (
    <section
      ref={(el) => {
        sectionRef.current = el;
        if (heroRef) heroRef.current = el;
      }}
      id="hero"
      onPointerEnter={() => {
        setIsInsideHero(true);
        animStateRef.current.isHovered = true;
      }}
      onPointerLeave={() => {
        setIsInsideHero(false);
        const state = animStateRef.current;
        state.isHovered = false;
        state.targetNormX = 0;
        state.targetNormY = 0;
      }}
      onClick={triggerCapture}
      className={`relative w-full h-screen min-h-screen overflow-hidden select-none bg-[#FAF8F5] flex items-center justify-center cursor-pointer ${
        isInsideHero && !reducedMotion ? 'cursor-none' : ''
      }`}
      style={{ touchAction: 'pan-y' }}
    >
      {/* 1. Shutter Flash Overlay */}
      <div
        className={`fixed inset-0 bg-white z-50 pointer-events-none transition-opacity duration-200 ${
          isFlashing ? 'opacity-95' : 'opacity-0'
        }`}
      />

      {/* 2. Studio Stage Backdrop Background Layer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none">
        <img
          src={IMG_BG_HERO}
          alt="Studio Stage Backdrop"
          className="w-full h-full object-cover object-[center_32%] pointer-events-none select-none"
          loading="eager"
          decoding="sync"
        />
        {/* Soft atmospheric overlay for studio depth and contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
      </div>

      {/* 3. Full-Bleed Full-Width Character Flat 2D Stage (Covers entire Hero Viewport - 10 Total Poses) */}
      <div
        ref={stageRef}
        className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-10"
      >
        <div
          ref={characterInnerRef}
          className="relative h-[74vh] sm:h-[82vh] md:h-full aspect-[16/9] w-auto max-w-none flex items-center justify-center filter contrast-[1.04] brightness-[1.02] origin-[50%_90%] will-change-transform"
          style={{
            transform: `scale(${effectiveScale})`,
            transformOrigin: '50% 90%',
            transition: (isTransitioning && !reducedMotion) ? 'transform 350ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
          }}
          onTransitionEnd={() => setIsTransitioning(false)}
        >
          <img
            ref={imgIdleRef}
            src={IMG_REAR}
            alt="Rear View (Idle)"
            className="absolute inset-0 w-full h-full object-contain object-center pointer-events-none"
            style={{ opacity: 1, willChange: 'opacity', transform: 'translateZ(0)' }}
            loading="eager"
            decoding="sync"
          />
          <img
            ref={imgCenterRef}
            src={IMG_CENTER_FRONT}
            alt="Center Front Gaze"
            className="absolute inset-0 w-full h-full object-contain object-center pointer-events-none"
            style={{ opacity: 0, willChange: 'opacity', transform: 'translateZ(0)' }}
            loading="eager"
            decoding="sync"
          />
          <img
            ref={imgUpperCenterRef}
            src={IMG_CENTER_UP}
            alt="Upper Center Gaze"
            className="absolute inset-0 w-full h-full object-contain object-center pointer-events-none"
            style={{ opacity: 0, willChange: 'opacity', transform: 'translateZ(0)' }}
            loading="eager"
            decoding="sync"
          />
          <img
            ref={imgLowerCenterRef}
            src={IMG_LOWER_CENTER}
            alt="Lower Center Glance"
            className="absolute inset-0 w-full h-full object-contain object-center pointer-events-none"
            style={{ opacity: 0, willChange: 'opacity', transform: 'translateZ(0)' }}
            loading="eager"
            decoding="sync"
          />
          <img
            ref={imgLeftRef}
            src={IMG_CENTER_LEFT}
            alt="Profile Left Gaze"
            className="absolute inset-0 w-full h-full object-contain object-center pointer-events-none"
            style={{ opacity: 0, willChange: 'opacity', transform: 'translateZ(0)' }}
            loading="eager"
            decoding="sync"
          />
          <img
            ref={imgRightRef}
            src={IMG_CENTER_RIGHT}
            alt="Profile Right Gaze"
            className="absolute inset-0 w-full h-full object-contain object-center pointer-events-none"
            style={{ opacity: 0, willChange: 'opacity', transform: 'translateZ(0)' }}
            loading="eager"
            decoding="sync"
          />
          <img
            ref={imgUpperLeftRef}
            src={IMG_UPPER_LEFT}
            alt="Upper Left Glance"
            className="absolute inset-0 w-full h-full object-contain object-center pointer-events-none"
            style={{ opacity: 0, willChange: 'opacity', transform: 'translateZ(0)' }}
            loading="eager"
            decoding="sync"
          />
          <img
            ref={imgLowerLeftRef}
            src={IMG_LOWER_LEFT}
            alt="Lower Left Glance"
            className="absolute inset-0 w-full h-full object-contain object-center pointer-events-none"
            style={{ opacity: 0, willChange: 'opacity', transform: 'translateZ(0)' }}
            loading="eager"
            decoding="sync"
          />
          <img
            ref={imgUpperRightRef}
            src={IMG_UPPER_RIGHT}
            alt="Upper Right Glance"
            className="absolute inset-0 w-full h-full object-contain object-center pointer-events-none"
            style={{ opacity: 0, willChange: 'opacity', transform: 'translateZ(0)' }}
            loading="eager"
            decoding="sync"
          />
          <img
            ref={imgLowerRightRef}
            src={IMG_LOWER_RIGHT}
            alt="Lower Right Glance"
            className="absolute inset-0 w-full h-full object-contain object-center pointer-events-none"
            style={{ opacity: 0, willChange: 'opacity', transform: 'translateZ(0)' }}
            loading="eager"
            decoding="sync"
          />
        </div>
      </div>

      {/* 4. Subtle Ambient Light Blend & Seamless Transition to Marquee */}
      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.12)] pointer-events-none z-0" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/60 to-transparent pointer-events-none z-0" />

      {/* 4.5. Floating Zoom HUD Badge */}
      {showHudBadge && (
        <div
          role="status"
          aria-live="polite"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40 transition-all duration-200 animate-in fade-in zoom-in-95"
        >
          <div className="px-5 py-2.5 rounded-full bg-[#18181B]/85 backdrop-blur-xl border border-white/20 text-white font-mono text-xs sm:text-sm font-semibold shadow-2xl flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#FF4D6D] animate-ping" />
            <span>Zoom: {Math.round(userScale * 100)}%</span>
          </div>
        </div>
      )}

      {/* 5. Sleek Camera Focus Reticle (Follows Cursor Smoothly) */}
      <div
        ref={reticleRef}
        className="fixed top-0 left-0 pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 opacity-60 hidden md:block"
        style={{ willChange: 'transform' }}
      >
        <div className="w-12 h-12 border border-white/80 rounded-xl flex items-center justify-center shadow-xs backdrop-blur-[1px]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D]" />
        </div>
      </div>

      {/* 6. Reel Element: Bottom-Left Clean Typography & Social Icons */}
      <div className="absolute bottom-8 left-6 md:left-12 z-20 flex flex-col gap-3 pointer-events-auto">
        <div className="space-y-0.5">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#18181B] tracking-tight leading-tight font-['Outfit',sans-serif] drop-shadow-xs">
            Accountant &amp; Tax Consultant.
          </h1>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-[#27272A] tracking-tight drop-shadow-2xs">
            Business Development &amp; Office Administrator.
          </p>
        </div>

        {/* Small Circular Social Icons (Notion, GitHub, LinkedIn, YouTube, Facebook, Instagram, Twitter) */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          {/* Notion */}
          <a
            href="#"
            aria-label="Visit Notion Profile"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-8 h-8 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-[#E7E2D8] shadow-2xs hover:shadow-md flex items-center justify-center text-[#18181B] hover:text-[#FF3F6C] hover:scale-110 active:scale-95 transition-all"
            title="Notion"
          >
            <NotionIcon className="w-4 h-4" />
          </a>

          {/* GitHub */}
          <a
            href="#"
            aria-label="Visit GitHub Profile"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-8 h-8 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-[#E7E2D8] shadow-2xs hover:shadow-md flex items-center justify-center text-[#18181B] hover:text-[#FF3F6C] hover:scale-110 active:scale-95 transition-all"
            title="GitHub (Coming Soon)"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          {/* LinkedIn */}
          <a
            href="#"
            aria-label="Visit LinkedIn Profile"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-8 h-8 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-[#E7E2D8] shadow-2xs hover:shadow-md flex items-center justify-center text-[#18181B] hover:text-[#FF3F6C] hover:scale-110 active:scale-95 transition-all"
            title="LinkedIn"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>

          {/* YouTube */}
          <a
            href="#"
            aria-label="Visit YouTube Channel"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-8 h-8 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-[#E7E2D8] shadow-2xs hover:shadow-md flex items-center justify-center text-[#18181B] hover:text-[#FF3F6C] hover:scale-110 active:scale-95 transition-all"
            title="YouTube"
          >
            <YoutubeIcon className="w-4 h-4" />
          </a>

          {/* Facebook */}
          <a
            href="#"
            aria-label="Visit Facebook Profile"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-8 h-8 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-[#E7E2D8] shadow-2xs hover:shadow-md flex items-center justify-center text-[#18181B] hover:text-[#FF3F6C] hover:scale-110 active:scale-95 transition-all"
            title="Facebook"
          >
            <FacebookIcon className="w-4 h-4" />
          </a>

          {/* Instagram */}
          <a
            href="#"
            aria-label="Visit Instagram Profile"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-8 h-8 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-[#E7E2D8] shadow-2xs hover:shadow-md flex items-center justify-center text-[#18181B] hover:text-[#FF3F6C] hover:scale-110 active:scale-95 transition-all"
            title="Instagram"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>

          {/* X / Twitter */}
          <a
            href="#"
            aria-label="Visit X (formerly Twitter) Profile"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-8 h-8 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-[#E7E2D8] shadow-2xs hover:shadow-md flex items-center justify-center text-[#18181B] hover:text-[#FF3F6C] hover:scale-110 active:scale-95 transition-all"
            title="X (formerly Twitter)"
          >
            <TwitterIcon className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 7. Reel Element: Bottom-Right Controls & Sleek Scale Pill */}
      <div className="absolute bottom-8 right-4 sm:right-6 md:right-12 z-20 flex flex-wrap sm:flex-nowrap items-center justify-end gap-2.5 sm:gap-3 pointer-events-auto">
        {/* Sleek Frosted Glass Scale Pill */}
        <div
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-md rounded-full px-3 py-1.5 flex items-center gap-2 text-[#18181B]"
        >
          {/* [-] button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleZoomOut();
            }}
            disabled={userScale <= 0.5}
            aria-label="Decrease scale"
            title="Decrease scale (-10%)"
            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/5 active:scale-90 text-[#18181B] transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Custom slider */}
          <input
            type="range"
            min="50"
            max="200"
            step="5"
            value={Math.round(userScale * 100)}
            onChange={(e) => {
              e.stopPropagation();
              handleSliderChange(e);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            aria-label="Character scale slider"
            className="w-16 sm:w-20 h-1.5 bg-stone-200/80 rounded-lg appearance-none cursor-pointer accent-[#18181B] focus:outline-none"
          />

          {/* [+] button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleZoomIn();
            }}
            disabled={userScale >= 2.0}
            aria-label="Increase scale"
            title="Increase scale (+10%)"
            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/5 active:scale-90 text-[#18181B] transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          {/* '100%' Reset button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
            aria-label="Reset scale to 100%"
            title="Reset scale to 100%"
            className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-stone-100/90 hover:bg-stone-200/90 active:scale-95 text-[#18181B] transition-all border border-stone-200/60 cursor-pointer"
          >
            100%
          </button>
        </div>

        {/* 'Shoot a look' Icon-Only Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerCapture();
          }}
          aria-label="Shoot a look photo"
          title="Shoot a look"
          className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-[#18181B] hover:bg-black text-white backdrop-blur-xl shadow-lg shadow-black/15 hover:shadow-xl hover:scale-105 active:scale-95 transition-all group border border-white/20 cursor-pointer"
        >
          <Camera className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
          {photosCount === 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF4D6D] animate-pulse pointer-events-none" />
          )}
          {photosCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#FF4D6D] text-white text-[10px] font-mono font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center shadow-md border-2 border-[#FAF8F5] pointer-events-none">
              {photosCount}
            </span>
          )}
        </button>

        {/* 'View Moments' Icon-Only Button */}
        <a
          href="#gallery"
          onClick={(e) => e.stopPropagation()}
          aria-label="View Moments"
          title="View Moments"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-white/90 hover:bg-white text-[#18181B] backdrop-blur-xl border border-[#E7E2D8] shadow-xs hover:shadow-md hover:scale-105 active:scale-95 transition-all group cursor-pointer"
        >
          <Images className="w-5 h-5 text-[#FF4D6D] transition-transform group-hover:scale-110" />
        </a>
      </div>
    </section>
  );
}
