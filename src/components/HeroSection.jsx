import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Sparkles } from 'lucide-react';
import { soundFX } from '../utils/audio';
import { NotionIcon, GithubIcon, LinkedinIcon } from './Icons';
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
const IMG_IDLE = `${BASE_URL}assets/character-idle.jpg`;
const IMG_CENTER = `${BASE_URL}assets/character-center.jpg`;
const IMG_UPPER_CENTER = `${BASE_URL}assets/character-upper-center.jpg`;
const IMG_LOWER_CENTER = `${BASE_URL}assets/character-lower-center.jpg`;
const IMG_UPPER_LEFT = `${BASE_URL}assets/character-upper-left.jpg`;
const IMG_LOWER_LEFT = `${BASE_URL}assets/character-lower-left.jpg`;
const IMG_UPPER_RIGHT = `${BASE_URL}assets/character-upper-right.jpg`;
const IMG_LOWER_RIGHT = `${BASE_URL}assets/character-lower-right.jpg`;

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

  // Direct DOM references for 120 FPS zero-render GPU updates
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const imgIdleRef = useRef(null);
  const imgCenterRef = useRef(null);
  const imgUpperCenterRef = useRef(null);
  const imgLowerCenterRef = useRef(null);
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

  // Preload high-res character pose assets immediately
  useEffect(() => {
    [
      IMG_IDLE,
      IMG_CENTER,
      IMG_UPPER_CENTER,
      IMG_LOWER_CENTER,
      IMG_UPPER_LEFT,
      IMG_LOWER_LEFT,
      IMG_UPPER_RIGHT,
      IMG_LOWER_RIGHT
    ].forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Continuous 120 FPS rAF Animation Loop
  useEffect(() => {
    let active = true;
    let localRafId = null;

    if (reducedMotion) {
      if (stageRef.current) {
        stageRef.current.style.transform = 'none';
      }
      const p = forcedState || (isInsideHero ? 'center' : 'idle');
      if (imgIdleRef.current) imgIdleRef.current.style.opacity = p === 'idle' ? '1' : '0';
      if (imgCenterRef.current) imgCenterRef.current.style.opacity = p === 'center' ? '1' : '0';
      if (imgUpperCenterRef.current) imgUpperCenterRef.current.style.opacity = p === 'upper-center' ? '1' : '0';
      if (imgLowerCenterRef.current) imgLowerCenterRef.current.style.opacity = p === 'lower-center' ? '1' : '0';
      if (imgUpperLeftRef.current) imgUpperLeftRef.current.style.opacity = p === 'upper-left' ? '1' : '0';
      if (imgLowerLeftRef.current) imgLowerLeftRef.current.style.opacity = p === 'lower-left' ? '1' : '0';
      if (imgUpperRightRef.current) imgUpperRightRef.current.style.opacity = p === 'upper-right' ? '1' : '0';
      if (imgLowerRightRef.current) imgLowerRightRef.current.style.opacity = p === 'lower-right' ? '1' : '0';
      animStateRef.current.activePose = p;
      return () => {
        active = false;
      };
    }

    const tick = () => {
      if (!active) return;
      const state = animStateRef.current;

      // High-precision damping lerp (exponential decay for smooth inertia)
      const lerpRate = 0.085;
      state.currentNormX += (state.targetNormX - state.currentNormX) * lerpRate;
      state.currentNormY += (state.targetNormY - state.currentNormY) * lerpRate;

      // Smooth hover blend: 0 when cursor is outside hero, 1 when inside hero
      const targetHover = state.isHovered ? 1 : 0;
      state.hoverWeight += (targetHover - state.hoverWeight) * 0.1;

      const curX = state.currentNormX;
      const curY = state.currentNormY;

      // 1. Smooth 2.5D perspective tilt and subtle micro-parallax camera dolly (damped by hoverWeight)
      if (stageRef.current) {
        const tiltIntensity = 0.25 + 0.75 * state.hoverWeight;
        const rotateY = (curX * 18 * tiltIntensity).toFixed(2);   // yaw
        const rotateX = (-curY * 12 * tiltIntensity).toFixed(2);  // pitch
        const transX = (curX * 14 * tiltIntensity).toFixed(1);    // horizontal shift
        const transY = (curY * 10 * tiltIntensity).toFixed(1);    // vertical shift
        
        stageRef.current.style.transform = `perspective(1200px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translate3d(${transX}px, ${transY}px, 0) scale(1.06)`;
      }

      // 2. Continuous Pose Crossfading with Cubic Hermite Smoothstep
      let idleOp = 1 - state.hoverWeight;
      let centerOp = 0;
      let upCenterOp = 0;
      let lowCenterOp = 0;
      let upLeftOp = 0;
      let lowLeftOp = 0;
      let upRightOp = 0;
      let lowRightOp = 0;

      if (forcedState) {
        idleOp = forcedState === 'idle' ? 1 : 0;
        centerOp = forcedState === 'center' ? 1 : 0;
        upCenterOp = forcedState === 'upper-center' ? 1 : 0;
        lowCenterOp = forcedState === 'lower-center' ? 1 : 0;
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

        // Horizontal weights
        const leftW = smoothstep(-0.05, -0.25, curX);
        const rightW = smoothstep(0.05, 0.25, curX);
        const centerHW = Math.max(0, 1 - leftW - rightW);

        // Side Vertical Weights (Up/Down split)
        const sideUpW = smoothstep(0.1, -0.1, curY);
        const sideDownW = 1 - sideUpW;

        // Center Column 3-Way Vertical Weights: Upper-Center, Center, Lower-Center
        // curY ranges from -0.5 (top) to +0.5 (bottom)
        const centerUp = smoothstep(-0.06, -0.24, curY);
        const centerDown = smoothstep(0.06, 0.24, curY);
        const centerMid = Math.max(0, 1 - centerUp - centerDown);

        const activeTrackingWeight = state.hoverWeight;

        upLeftOp = leftW * sideUpW * activeTrackingWeight;
        lowLeftOp = leftW * sideDownW * activeTrackingWeight;
        upRightOp = rightW * sideUpW * activeTrackingWeight;
        lowRightOp = rightW * sideDownW * activeTrackingWeight;

        upCenterOp = centerHW * centerUp * activeTrackingWeight;
        lowCenterOp = centerHW * centerDown * activeTrackingWeight;
        centerOp = centerHW * centerMid * activeTrackingWeight;

        const ops = {
          'idle': idleOp,
          'center': centerOp,
          'upper-center': upCenterOp,
          'lower-center': lowCenterOp,
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
  }, [reducedMotion, forcedState, isInsideHero]);

  // Pointer move handler with passive normalized calculation
  const handlePointerMove = useCallback((e) => {
    if (reducedMotion) return;
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);
    if (clientX === undefined || clientY === undefined) return;

    const state = animStateRef.current;
    state.pointerX = clientX;
    state.pointerY = clientY;

    const w = window.innerWidth || 1920;
    const h = window.innerHeight || 1080;

    // Normalized coordinates from -0.5 to +0.5
    state.targetNormX = Math.max(-0.5, Math.min(0.5, (clientX / w) - 0.5));
    state.targetNormY = Math.max(-0.5, Math.min(0.5, (clientY / h) - 0.5));
  }, [reducedMotion]);

  // Trigger Shutter Snap Action
  const triggerCapture = useCallback(() => {
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
        'idle': { src: IMG_IDLE, title: 'Relaxed Idle Portrait' },
        'center': { src: IMG_CENTER, title: 'Signature Center Portrait' },
        'upper-center': { src: IMG_UPPER_CENTER, title: 'Upper Center Gaze' },
        'lower-center': { src: IMG_LOWER_CENTER, title: 'Lower Center Glance' },
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
        likes: Math.floor(Math.random() * 25) + 10
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
      onPointerMove={handlePointerMove}
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

      {/* 2. Full-Bleed Full-Width Character 2.5D Stage (Covers entire Hero Viewport) */}
      <div
        ref={stageRef}
        className="absolute inset-0 w-full h-full flex items-center justify-center will-change-transform pointer-events-none z-10 overflow-hidden"
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center'
        }}
      >
        <div className="relative w-full h-full overflow-hidden">
          <img
            ref={imgIdleRef}
            src={IMG_IDLE}
            alt="Idle Pose"
            className="absolute inset-0 w-full h-full object-cover object-[center_32%] pointer-events-none filter contrast-[1.04] brightness-[1.02]"
            style={{ opacity: 1, willChange: 'opacity' }}
            loading="eager"
            decoding="async"
          />
          <img
            ref={imgCenterRef}
            src={IMG_CENTER}
            alt="Center Pose"
            className="absolute inset-0 w-full h-full object-cover object-[center_32%] pointer-events-none filter contrast-[1.04] brightness-[1.02]"
            style={{ opacity: 0, willChange: 'opacity' }}
            loading="eager"
            decoding="async"
          />
          <img
            ref={imgUpperCenterRef}
            src={IMG_UPPER_CENTER}
            alt="Upper Center Pose"
            className="absolute inset-0 w-full h-full object-cover object-[center_32%] pointer-events-none filter contrast-[1.04] brightness-[1.02]"
            style={{ opacity: 0, willChange: 'opacity' }}
            loading="eager"
            decoding="async"
          />
          <img
            ref={imgLowerCenterRef}
            src={IMG_LOWER_CENTER}
            alt="Lower Center Pose"
            className="absolute inset-0 w-full h-full object-cover object-[center_32%] pointer-events-none filter contrast-[1.04] brightness-[1.02]"
            style={{ opacity: 0, willChange: 'opacity' }}
            loading="eager"
            decoding="async"
          />
          <img
            ref={imgUpperLeftRef}
            src={IMG_UPPER_LEFT}
            alt="Upper Left Pose"
            className="absolute inset-0 w-full h-full object-cover object-[center_32%] pointer-events-none filter contrast-[1.04] brightness-[1.02]"
            style={{ opacity: 0, willChange: 'opacity' }}
            loading="eager"
            decoding="async"
          />
          <img
            ref={imgLowerLeftRef}
            src={IMG_LOWER_LEFT}
            alt="Lower Left Pose"
            className="absolute inset-0 w-full h-full object-cover object-[center_32%] pointer-events-none filter contrast-[1.04] brightness-[1.02]"
            style={{ opacity: 0, willChange: 'opacity' }}
            loading="eager"
            decoding="async"
          />
          <img
            ref={imgUpperRightRef}
            src={IMG_UPPER_RIGHT}
            alt="Upper Right Pose"
            className="absolute inset-0 w-full h-full object-cover object-[center_32%] pointer-events-none filter contrast-[1.04] brightness-[1.02]"
            style={{ opacity: 0, willChange: 'opacity' }}
            loading="eager"
            decoding="async"
          />
          <img
            ref={imgLowerRightRef}
            src={IMG_LOWER_RIGHT}
            alt="Lower Right Pose"
            className="absolute inset-0 w-full h-full object-cover object-[center_32%] pointer-events-none filter contrast-[1.04] brightness-[1.02]"
            style={{ opacity: 0, willChange: 'opacity' }}
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      {/* 3. Subtle Ambient Light Blend & Seamless Transition to Marquee */}
      <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(240,234,224,0.35)] pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/60 to-transparent pointer-events-none z-10" />

      {/* 4. Cinematic Viewfinder Framing Brackets (4 Corners) */}
      <div className="absolute top-20 left-6 sm:left-10 w-6 h-6 border-t-2 border-l-2 border-white/80 rounded-tl-md pointer-events-none z-20 shadow-xs" />
      <div className="absolute top-20 right-6 sm:right-10 w-6 h-6 border-t-2 border-r-2 border-white/80 rounded-tr-md pointer-events-none z-20 shadow-xs" />
      <div className="absolute bottom-24 left-6 sm:left-10 w-6 h-6 border-b-2 border-l-2 border-white/80 rounded-bl-md pointer-events-none z-20 shadow-xs" />
      <div className="absolute bottom-24 right-6 sm:right-10 w-6 h-6 border-b-2 border-r-2 border-white/80 rounded-br-md pointer-events-none z-20 shadow-xs" />

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
            Full-stack developer.
          </h1>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-[#27272A] tracking-tight drop-shadow-2xs">
            AI &amp; ML undergraduate.
          </p>
        </div>

        {/* Small Circular Social Icons (Notion, GitHub, LinkedIn) */}
        <div className="flex items-center gap-2.5 pt-1">
          {/* Notion */}
          <a
            href="https://notion.so"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Notion Profile"
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-full bg-white/85 backdrop-blur-md border border-white/90 shadow-2xs hover:shadow-md flex items-center justify-center text-slate-700 hover:text-[#FF3F6C] hover:scale-110 active:scale-95 transition-all"
            title="Notion"
          >
            <NotionIcon className="w-4 h-4" />
          </a>

          {/* GitHub */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit GitHub Profile"
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-full bg-white/85 backdrop-blur-md border border-white/90 shadow-2xs hover:shadow-md flex items-center justify-center text-slate-700 hover:text-[#FF3F6C] hover:scale-110 active:scale-95 transition-all"
            title="GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit LinkedIn Profile"
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-full bg-white/85 backdrop-blur-md border border-white/90 shadow-2xs hover:shadow-md flex items-center justify-center text-slate-700 hover:text-[#FF3F6C] hover:scale-110 active:scale-95 transition-all"
            title="LinkedIn"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>

          {/* Micro Helper Chip */}
          <span className="hidden sm:inline-flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-[11px] font-medium text-slate-600 shadow-2xs">
            <Sparkles className="w-3 h-3 text-[#FF3F6C]" />
            Move cursor to track gaze
          </span>
        </div>
      </div>

      {/* 7. Reel Element: Bottom-Right Sleek Dark Pill Button */}
      <div className="absolute bottom-8 right-6 md:right-12 z-20 flex items-center gap-3 pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerCapture();
          }}
          aria-label="Shoot a look photo"
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#18181B] hover:bg-black text-white font-medium text-xs sm:text-sm backdrop-blur-xl shadow-lg shadow-black/15 hover:shadow-xl hover:scale-105 active:scale-95 transition-all group border border-white/20"
        >
          <span className="w-2 h-2 rounded-full bg-[#FF4D6D] animate-pulse" />
          <span className="tracking-wide">Shoot a look 📸</span>
          {photosCount > 0 && (
            <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
              {photosCount}
            </span>
          )}
        </button>

        <a
          href="#gallery"
          onClick={(e) => e.stopPropagation()}
          className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/90 hover:bg-white text-[#18181B] font-semibold text-xs backdrop-blur-xl border border-[#E7E2D8] shadow-xs hover:shadow-md transition-all active:scale-95"
        >
          <Camera className="w-3.5 h-3.5 text-[#FF4D6D]" />
          <span>View Moments</span>
        </a>
      </div>
    </section>
  );
}
