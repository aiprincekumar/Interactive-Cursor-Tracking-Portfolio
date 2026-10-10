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
const IMG_CENTER = `${BASE_URL}assets/character-center.jpg`;
const IMG_LEFT = `${BASE_URL}assets/character-left.jpg`;
const IMG_RIGHT = `${BASE_URL}assets/character-right.jpg`;

export default function HeroSection({
  heroRef,
  isInsideHero,
  setIsInsideHero,
  onPhotoCaptured,
  soundEnabled,
  setSoundEnabled,
  forcedState,
  reducedMotion
}) {
  const [isFlashing, setIsFlashing] = useState(false);
  const [photosCount, setPhotosCount] = useState(0);

  // Direct DOM references for 120 FPS zero-render GPU updates
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const imgCenterRef = useRef(null);
  const imgLeftRef = useRef(null);
  const imgRightRef = useRef(null);
  const reticleRef = useRef(null);

  // Tracking state store
  const animStateRef = useRef({
    targetNormX: 0,
    targetNormY: 0,
    currentNormX: 0,
    currentNormY: 0,
    pointerX: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    pointerY: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
    activePose: 'center', // 'left' | 'center' | 'right'
    isHovered: false,
    rafId: null
  });

  // Preload high-res character pose assets immediately
  useEffect(() => {
    [IMG_CENTER, IMG_LEFT, IMG_RIGHT].forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Continuous 120 FPS rAF Animation Loop
  useEffect(() => {
    let active = true;

    const tick = () => {
      if (!active) return;
      const state = animStateRef.current;

      if (!reducedMotion) {
        // High-precision damping lerp (exponential decay for smooth inertia)
        const lerpRate = 0.085;
        state.currentNormX += (state.targetNormX - state.currentNormX) * lerpRate;
        state.currentNormY += (state.targetNormY - state.currentNormY) * lerpRate;

        const curX = state.currentNormX;
        const curY = state.currentNormY;

        // 1. Smooth 2.5D perspective tilt and subtle micro-parallax camera dolly
        if (stageRef.current) {
          const rotateY = (curX * 18).toFixed(2);   // -9 deg to +9 deg yaw
          const rotateX = (-curY * 12).toFixed(2);  // -6 deg to +6 deg pitch
          const transX = (curX * 14).toFixed(1);    // subtle horizontal shift
          const transY = (curY * 10).toFixed(1);    // subtle vertical shift
          
          stageRef.current.style.transform = `perspective(1200px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translate3d(${transX}px, ${transY}px, 0) scale(1.06)`;
        }

        // 2. Continuous Pose Crossfading with Cubic Hermite Smoothstep
        let centerOp = 1;
        let leftOp = 0;
        let rightOp = 0;

        if (forcedState) {
          // Explicit manual state override from physics playground
          centerOp = forcedState === 'center' ? 1 : 0;
          leftOp = forcedState === 'left' ? 1 : 0;
          rightOp = forcedState === 'right' ? 1 : 0;
          state.activePose = forcedState;
        } else {
          // Automatic cursor gaze zones:
          // Center deadband [-0.08, +0.08] keeps character smiling straight
          // Smoothstep transition in ranges [-0.28, -0.08] and [+0.08, +0.28]
          if (curX < -0.08) {
            // Turning left
            const t = Math.min(1, Math.max(0, (-curX - 0.08) / 0.20));
            const smooth = t * t * (3 - 2 * t);
            leftOp = smooth;
            centerOp = 1 - smooth;
            rightOp = 0;
          } else if (curX > 0.08) {
            // Turning right
            const t = Math.min(1, Math.max(0, (curX - 0.08) / 0.20));
            const smooth = t * t * (3 - 2 * t);
            rightOp = smooth;
            centerOp = 1 - smooth;
            leftOp = 0;
          } else {
            centerOp = 1;
            leftOp = 0;
            rightOp = 0;
          }

          // Hysteresis for dominant active pose tag
          if (leftOp > 0.6) {
            state.activePose = 'left';
          } else if (rightOp > 0.6) {
            state.activePose = 'right';
          } else if (centerOp > 0.6) {
            state.activePose = 'center';
          }
        }

        // Apply opacities directly to DOM (0 React re-renders)
        if (imgCenterRef.current) imgCenterRef.current.style.opacity = centerOp.toFixed(3);
        if (imgLeftRef.current) imgLeftRef.current.style.opacity = leftOp.toFixed(3);
        if (imgRightRef.current) imgRightRef.current.style.opacity = rightOp.toFixed(3);

        // 3. Smooth Viewfinder Reticle follow
        if (reticleRef.current && state.isHovered) {
          reticleRef.current.style.transform = `translate3d(${state.pointerX}px, ${state.pointerY}px, 0)`;
        }
      }

      state.rafId = requestAnimationFrame(tick);
    };

    animStateRef.current.rafId = requestAnimationFrame(tick);
    return () => {
      active = false;
      if (animStateRef.current.rafId) {
        cancelAnimationFrame(animStateRef.current.rafId);
      }
    };
  }, [reducedMotion, forcedState]);

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
      onPhotoCaptured({
        id: Date.now(),
        state: activePose,
        imageSrc: activePose === 'left'
          ? IMG_LEFT
          : activePose === 'right'
            ? IMG_RIGHT
            : IMG_CENTER,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        title: activePose === 'left'
          ? 'Candid Left Glance'
          : activePose === 'right'
            ? 'Right Framing Smile'
            : 'Signature Center Portrait',
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
          {/* Pose 1: Center (Smiling straight forward, full cover) */}
          <img
            ref={imgCenterRef}
            src={IMG_CENTER}
            alt="Sushmitha Dasari Center Pose"
            className="absolute inset-0 w-full h-full object-cover object-[center_32%] pointer-events-none filter contrast-[1.04] brightness-[1.02]"
            style={{ opacity: 1, willChange: 'opacity' }}
            loading="eager"
            decoding="async"
          />

          {/* Pose 2: Left (Aiming camera left, full cover) */}
          <img
            ref={imgLeftRef}
            src={IMG_LEFT}
            alt="Sushmitha Dasari Left Pose"
            className="absolute inset-0 w-full h-full object-cover object-[center_32%] pointer-events-none filter contrast-[1.04] brightness-[1.02]"
            style={{ opacity: 0, willChange: 'opacity' }}
            loading="eager"
            decoding="async"
          />

          {/* Pose 3: Right (Aiming camera right, full cover) */}
          <img
            ref={imgRightRef}
            src={IMG_RIGHT}
            alt="Sushmitha Dasari Right Pose"
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
