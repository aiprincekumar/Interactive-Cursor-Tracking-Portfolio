/* oxlint-disable react/only-export-components */
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  RotateCcw,
  Sparkles,
  Layers,
  Sun,
  Moon,
  Home,
  Code,
  Cpu,
  Volume2,
  Terminal,
  Grid,
  Shield,
  Eye,
  EyeOff,
  Maximize2,
  Box
} from 'lucide-react';
import { useLab3D } from '../../context/LabContext';
import SandboxViewportContainer from './SandboxViewportContainer';

/**
 * 4 Master 3D Portfolio Themes Visual Styling Specification
 * (Apple Glass, Cyber Neon, Studio Matte, Floating Hologram)
 */
export const THEME_PORTFOLIO_STYLES = {
  'apple-glass': {
    id: 'apple-glass',
    name: 'Apple Glass',
    stageBg: 'radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.12) 0%, rgba(13, 9, 22, 0.96) 100%)',
    navbar: {
      bg: 'rgba(255, 255, 255, 0.78)',
      darkBg: 'rgba(26, 20, 42, 0.82)',
      border: 'border-white/40 dark:border-white/15',
      glow: 'inset 0 1px 1px rgba(255,255,255,0.7), 0 8px 24px rgba(0,0,0,0.12)',
      activeGlowRim: '0 0 14px rgba(255,77,109,0.35), inset 0 1px 2px rgba(255,255,255,0.8)',
      text: 'text-stone-800 dark:text-stone-100',
      badgeBg: 'bg-white/80 dark:bg-white/10 text-stone-700 dark:text-stone-200',
      accent: '#FF4D6D'
    },
    hero: {
      bg: 'rgba(255, 255, 255, 0.84)',
      darkBg: 'rgba(30, 23, 48, 0.88)',
      border: 'border-white/50 dark:border-white/20',
      glow: 'inset 0 1px 2px rgba(255,255,255,0.8), 0 12px 32px rgba(0,0,0,0.18)',
      activeGlowRim: '0 0 20px rgba(255,77,109,0.3), inset 0 1px 2px rgba(255,255,255,0.9)',
      text: 'text-stone-900 dark:text-white',
      avatarGradient: 'from-[#FF4D6D] to-[#00F2FE]',
      subText: 'text-stone-600 dark:text-stone-300',
      accent: '#FF4D6D'
    },
    gridItem: {
      bg: 'rgba(255, 255, 255, 0.72)',
      darkBg: 'rgba(24, 18, 38, 0.82)',
      border: 'border-white/40 dark:border-white/15',
      glow: 'inset 0 1px 1px rgba(255,255,255,0.5), 0 4px 12px rgba(0,0,0,0.1)',
      activeGlowRim: '0 0 12px rgba(255,77,109,0.25)',
      text: 'text-stone-800 dark:text-stone-200',
      accent: '#FF4D6D'
    },
    dock: {
      bg: 'rgba(255, 255, 255, 0.82)',
      darkBg: 'rgba(24, 18, 38, 0.9)',
      border: 'border-white/45 dark:border-white/20',
      glow: 'inset 0 1px 2px rgba(255,255,255,0.7), 0 10px 28px rgba(0,0,0,0.2)',
      activeGlowRim: '0 0 18px rgba(255,77,109,0.35)',
      btnBg: 'bg-white/90 dark:bg-stone-800/90 text-stone-700 dark:text-stone-200 hover:text-[#FF4D6D]',
      accent: '#FF4D6D'
    }
  },
  'cyber-neon': {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    stageBg: 'radial-gradient(circle at 50% 35%, rgba(0, 242, 254, 0.18) 0%, rgba(11, 8, 19, 0.98) 100%)',
    navbar: {
      bg: '#0B0813',
      darkBg: '#0B0813',
      border: 'border-[#00F2FE]/70',
      glow: '0 0 16px rgba(0, 242, 254, 0.4), inset 0 0 8px rgba(0, 242, 254, 0.2)',
      activeGlowRim: '0 0 20px rgba(0, 242, 254, 0.7), inset 0 0 12px rgba(255, 0, 122, 0.3)',
      text: 'text-cyan-300',
      badgeBg: 'bg-[#0B0813] text-cyan-300 border border-cyan-500/40',
      accent: '#00F2FE'
    },
    hero: {
      bg: '#0B0813',
      darkBg: '#0B0813',
      border: 'border-[#FF007A]/70',
      glow: '0 0 20px rgba(255, 0, 122, 0.4), inset 0 0 12px rgba(0, 242, 254, 0.25)',
      activeGlowRim: '0 0 24px rgba(255, 0, 122, 0.7), inset 0 0 16px rgba(0, 242, 254, 0.4)',
      text: 'text-white',
      avatarGradient: 'from-[#FF007A] via-[#9B00FF] to-[#00F2FE]',
      subText: 'text-cyan-200/90',
      accent: '#FF007A'
    },
    gridItem: {
      bg: '#0B0813',
      darkBg: '#0B0813',
      border: 'border-[#00F2FE]/50',
      glow: '0 0 12px rgba(0, 242, 254, 0.3)',
      activeGlowRim: '0 0 16px rgba(0, 242, 254, 0.55)',
      text: 'text-cyan-200',
      accent: '#00F2FE'
    },
    dock: {
      bg: '#0B0813',
      darkBg: '#0B0813',
      border: 'border-[#00F2FE]/80',
      glow: '0 0 20px rgba(0, 242, 254, 0.45), inset 0 0 10px rgba(255, 0, 122, 0.25)',
      activeGlowRim: '0 0 24px rgba(0, 242, 254, 0.7)',
      btnBg: 'bg-[#150F26] text-cyan-300 hover:text-[#FF007A] border border-cyan-500/40',
      accent: '#00F2FE'
    }
  },
  'studio-matte': {
    id: 'studio-matte',
    name: 'Studio Matte',
    stageBg: 'radial-gradient(circle at 50% 40%, rgba(226, 222, 214, 0.25) 0%, rgba(20, 18, 26, 0.98) 100%)',
    navbar: {
      bg: '#EEEAE4',
      darkBg: '#201C28',
      border: 'border-[#C8C3B9]/60 dark:border-[#3D354E]/70',
      glow: '0 4px 12px rgba(0, 0, 0, 0.12), inset 0 1px 2px rgba(255, 255, 255, 0.25)',
      activeGlowRim: '0 4px 18px rgba(245, 158, 11, 0.3), inset 0 1px 3px rgba(255, 255, 255, 0.4)',
      text: 'text-stone-800 dark:text-stone-200',
      badgeBg: 'bg-[#E2DED6] dark:bg-[#2A2436] text-stone-700 dark:text-stone-300',
      accent: '#F59E0B'
    },
    hero: {
      bg: '#EAE6DE',
      darkBg: '#24202E',
      border: 'border-[#BEB8AC]/60 dark:border-[#443B56]/70',
      glow: '0 8px 24px rgba(0, 0, 0, 0.16), inset 0 1px 3px rgba(255, 255, 255, 0.3)',
      activeGlowRim: '0 8px 28px rgba(245, 158, 11, 0.35), inset 0 1px 4px rgba(255, 255, 255, 0.5)',
      text: 'text-stone-900 dark:text-stone-100',
      avatarGradient: 'from-[#D97706] to-[#78350F]',
      subText: 'text-stone-600 dark:text-stone-300',
      accent: '#F59E0B'
    },
    gridItem: {
      bg: '#EEEAE4',
      darkBg: '#1E1A26',
      border: 'border-[#CDC8BE]/55 dark:border-[#383047]/60',
      glow: '0 3px 8px rgba(0, 0, 0, 0.1)',
      activeGlowRim: '0 4px 14px rgba(245, 158, 11, 0.25)',
      text: 'text-stone-800 dark:text-stone-200',
      accent: '#F59E0B'
    },
    dock: {
      bg: '#E8E3DB',
      darkBg: '#221E2C',
      border: 'border-[#C3BDB1]/65 dark:border-[#3E3550]/70',
      glow: '0 6px 20px rgba(0, 0, 0, 0.18), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
      activeGlowRim: '0 6px 22px rgba(245, 158, 11, 0.3)',
      btnBg: 'bg-[#E5E0D7] dark:bg-[#282233] text-stone-700 dark:text-stone-200 hover:text-amber-600',
      accent: '#F59E0B'
    }
  },
  'floating-hologram': {
    id: 'floating-hologram',
    name: 'Floating Hologram',
    stageBg: 'radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.22) 50%, rgba(6, 4, 15, 0.98) 100%)',
    navbar: {
      bg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.35) 100%)',
      darkBg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.35) 100%)',
      border: 'border-purple-400/60',
      glow: '0 0 18px rgba(168, 85, 247, 0.45), inset 0 0 10px rgba(99, 102, 241, 0.3)',
      activeGlowRim: '0 0 24px rgba(168, 85, 247, 0.75), inset 0 0 14px rgba(192, 132, 252, 0.5)',
      text: 'text-purple-200',
      badgeBg: 'bg-purple-900/60 text-purple-200 border border-purple-400/40',
      accent: '#A855F7'
    },
    hero: {
      bg: 'linear-gradient(135deg, rgba(79, 70, 229, 0.35) 0%, rgba(147, 51, 234, 0.4) 100%)',
      darkBg: 'linear-gradient(135deg, rgba(79, 70, 229, 0.35) 0%, rgba(147, 51, 234, 0.4) 100%)',
      border: 'border-purple-400/70',
      glow: '0 0 24px rgba(147, 51, 234, 0.5), inset 0 0 14px rgba(129, 140, 248, 0.35)',
      activeGlowRim: '0 0 30px rgba(168, 85, 247, 0.8), inset 0 0 18px rgba(192, 132, 252, 0.6)',
      text: 'text-white',
      avatarGradient: 'from-[#6366F1] via-[#A855F7] to-[#EC4899]',
      subText: 'text-purple-200/90',
      accent: '#C084FC'
    },
    gridItem: {
      bg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.28) 100%)',
      darkBg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.28) 100%)',
      border: 'border-purple-400/50',
      glow: '0 0 14px rgba(168, 85, 247, 0.38)',
      activeGlowRim: '0 0 18px rgba(168, 85, 247, 0.6)',
      text: 'text-purple-100',
      accent: '#A855F7'
    },
    dock: {
      bg: 'linear-gradient(135deg, rgba(79, 70, 229, 0.36) 0%, rgba(147, 51, 234, 0.42) 100%)',
      darkBg: 'linear-gradient(135deg, rgba(79, 70, 229, 0.36) 0%, rgba(147, 51, 234, 0.42) 100%)',
      border: 'border-purple-400/75',
      glow: '0 0 22px rgba(147, 51, 234, 0.55), inset 0 0 12px rgba(129, 140, 248, 0.4)',
      activeGlowRim: '0 0 28px rgba(168, 85, 247, 0.8)',
      btnBg: 'bg-indigo-950/70 text-purple-200 hover:text-pink-400 border border-purple-500/30',
      accent: '#A855F7'
    }
  }
};

/**
 * Skybox Gradient Definitions
 */
const SKYBOX_GRADIENTS = {
  'dark-studio': 'radial-gradient(circle at 50% 35%, rgba(30, 27, 46, 0.95) 0%, rgba(13, 9, 22, 0.98) 100%)',
  'cyber-city': 'radial-gradient(circle at 60% 30%, rgba(0, 242, 254, 0.22) 0%, rgba(255, 77, 109, 0.16) 45%, rgba(10, 6, 22, 0.98) 100%)',
  'cosmic-nebula': 'radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.25) 0%, rgba(59, 130, 246, 0.15) 50%, rgba(6, 4, 15, 0.98) 100%)',
  'sunset-horizon': 'radial-gradient(circle at 50% 60%, rgba(245, 158, 11, 0.22) 0%, rgba(244, 63, 94, 0.18) 45%, rgba(15, 10, 25, 0.98) 100%)'
};

/**
 * Helper to normalize component key for visual linking
 */
export function normalizeMiniKey(key) {
  if (!key) return null;
  const k = String(key).toLowerCase().trim();
  if (k === 'nav' || k === 'navbar' || k === 'navigation') return 'navbar';
  if (k === 'hero' || k === 'header' || k === 'avatar' || k === 'profilepic' || k === 'card3d') return 'hero';
  if (k === 'footer') return 'footer';
  if (k === 'dock' || k === 'floatingbutton') return 'dock';
  if (k === 'showcase' || k === 'cards' || k === 'grid' || k === 'container' || k === 'containercontent') return 'showcase';
  return k;
}

/**
 * UniversalMiniPortfolio
 *
 * Phase 2 & 5: Universal Top Mini-DOM Portfolio Sandbox with Bi-Directional Visual Linking
 *
 * A full-width, single-column Universal Sandbox rendering an interactive, living
 * Mini-DOM replica of the entire portfolio. Demonstrates real-time 3D tilt, dynamic
 * lighting angles, materials, stardust particles, volumetric fog, exploded strata,
 * and accent border halo pulse visual linking.
 */
export function UniversalMiniPortfolio({
  className = '',
  showControls = true,
  compact = false,
  defaultTilt = { rotX: 0, rotY: 0 },
  sandboxTilt,
  onPointerDown: externalPointerDown,
  onPointerMove: externalPointerMove,
  onPointerUp: externalPointerUp,
  onResetOrientation,
  wireframeActive,
  onToggleWireframe,
  highlightedComponent = null,
  onHighlightComponent
}) {
  const lab3D = useLab3D ? useLab3D() : null;
  const threeD = lab3D?.threeD || {};

  const isMaster3DOn = threeD.master3D ?? true;
  const masterTheme = threeD.masterTheme || 'apple-glass';
  const elements = threeD.elements || {};
  const lighting = threeD.lighting || { angle: 45, shadowSoftness: 0.6 };
  const camera = threeD.camera || { perspectiveFOV: 1000, tiltSensitivity: 1.0 };
  const materials = threeD.materials || { bevelExtrusion: 4, specularGlow: 0.5 };
  const exploded = threeD.exploded || { enabled: false, separationDistance: 40, ghostOpacity: 0.4, layerStagger: 15, blueprintMode: false };
  const environment = threeD.environment || { skybox: 'dark-studio', fogDensity: 20, stardustParticles: true, particleCount: 30 };

  const themeStyle = THEME_PORTFOLIO_STYLES[masterTheme] || THEME_PORTFOLIO_STYLES['apple-glass'];

  // Reactive Dark Mode Detector for theme styling
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark') || document.body.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // 10 Element Toggles state mapping (live 3D pop/flat response)
  const isNav3D = isMaster3DOn && (Boolean(elements.navbarItems) || Boolean(elements.navbarIcons));
  const isProfilePic3D = isMaster3DOn && Boolean(elements.profilePic);
  const isHeader3D = isMaster3DOn && Boolean(elements.header);
  const isSubHeader3D = isMaster3DOn && Boolean(elements.subHeader);
  const isDescription3D = isMaster3DOn && Boolean(elements.description);
  const isHeroAny3D = isProfilePic3D || isHeader3D || isSubHeader3D || isDescription3D;
  const isContainer3D = isMaster3DOn && Boolean(elements.container);
  const isContent3D = isMaster3DOn && Boolean(elements.containerContent);
  const isGrid3D = isContainer3D || isContent3D;
  const isFloatBtn3D = isMaster3DOn && Boolean(elements.floatingButton);
  const isResumeBtn3D = isMaster3DOn && Boolean(elements.resumeButton);
  const isDock3D = isFloatBtn3D || isResumeBtn3D;

  // Z-Elevation Calculations honoring 10 element toggles & exploded strata
  const zNav = isMaster3DOn
    ? (isNav3D ? (18 + 24) : 0) + (exploded.enabled ? exploded.layerStagger * 2 : 0)
    : 0;

  const zHero = isMaster3DOn
    ? (36 + (isHeroAny3D ? 16 : 0) + (exploded.enabled ? exploded.layerStagger * 3 : 0))
    : 0;

  const zGrid = isMaster3DOn
    ? ((isGrid3D ? (24 + 20) : 0) + (exploded.enabled ? exploded.layerStagger : 0))
    : 0;

  const zDock = isMaster3DOn
    ? ((isDock3D ? (42 + 40) : 0) + (exploded.enabled ? exploded.layerStagger * 4 : 0))
    : 0;

  const zFooter = isMaster3DOn ? (10 + (exploded.enabled ? 0 : 0)) : 0;

  const isCompact = compact || !showControls;
  const stageRef = useRef(null);

  // Internal rotation state with smooth damping (falls back to props.sandboxTilt if provided)
  const [internalTilt, setInternalTilt] = useState(defaultTilt);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredDockIcon, setHoveredDockIcon] = useState(null);
  const [internalWireframe, setInternalWireframe] = useState(false);

  const tilt = sandboxTilt || internalTilt;

  // Active wireframe state can be controlled via prop or internal toggle or exploded blueprint mode
  const isWireframe = wireframeActive !== undefined
    ? wireframeActive
    : (internalWireframe || exploded.blueprintMode);

  // Bi-directional visual linking states
  const isNavHighlighted = normalizeMiniKey(highlightedComponent) === 'navbar';
  const isHeroHighlighted = normalizeMiniKey(highlightedComponent) === 'hero';
  const isGridHighlighted = normalizeMiniKey(highlightedComponent) === 'showcase';
  const isDockHighlighted = normalizeMiniKey(highlightedComponent) === 'dock';
  const isFooterHighlighted = normalizeMiniKey(highlightedComponent) === 'footer';

  const dragStartRef = useRef({ x: 0, y: 0, startRotX: defaultTilt.rotX, startRotY: defaultTilt.rotY });
  const rafRef = useRef(null);

  // Pointer drag handlers for gyroscope & orbit rotation
  const handlePointerDown = useCallback((e) => {
    if (!isMaster3DOn) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Fallback if pointer capture is not supported
    }
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startRotX: tilt.rotX,
      startRotY: tilt.rotY
    };
    if (typeof externalPointerDown === 'function') {
      externalPointerDown(e);
    }
  }, [isMaster3DOn, tilt.rotX, tilt.rotY, externalPointerDown]);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging || !isMaster3DOn) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const deltaX = clientX - dragStartRef.current.x;
      const deltaY = clientY - dragStartRef.current.y;
      const sensitivity = (camera.tiltSensitivity ?? 1.0) * 0.22;

      // rotX maps to deltaY (vertical movement), clamped to [-25, 25]
      const rawRotX = dragStartRef.current.startRotX - deltaY * sensitivity;
      const clampedRotX = Math.max(-25, Math.min(25, Math.round(rawRotX)));

      // rotY maps to deltaX (horizontal movement), clamped to [-35, 35]
      const rawRotY = dragStartRef.current.startRotY + deltaX * sensitivity;
      const clampedRotY = Math.max(-35, Math.min(35, Math.round(rawRotY)));

      setInternalTilt({ rotX: clampedRotX, rotY: clampedRotY });
      rafRef.current = null;
    });

    if (typeof externalPointerMove === 'function') {
      externalPointerMove(e);
    }
  }, [isDragging, isMaster3DOn, camera.tiltSensitivity, externalPointerMove]);

  const handlePointerUp = useCallback((e) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (isDragging) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
      setIsDragging(false);
      if (typeof externalPointerUp === 'function') {
        externalPointerUp(e);
      }
    }
  }, [isDragging, externalPointerUp]);

  const handlePointerLeave = useCallback((e) => {
    if (isDragging) {
      handlePointerUp(e);
    }
  }, [isDragging, handlePointerUp]);

  const handleReset = useCallback(() => {
    setInternalTilt({ rotX: 0, rotY: 0 });
    if (typeof onResetOrientation === 'function') {
      onResetOrientation();
    }
  }, [onResetOrientation]);

  const handleWireframeToggle = useCallback(() => {
    if (typeof onToggleWireframe === 'function') {
      onToggleWireframe(!isWireframe);
    } else {
      setInternalWireframe((prev) => !prev);
    }
  }, [isWireframe, onToggleWireframe]);

  // Compute dynamic light directional shadow/highlight offset
  const lightRad = ((lighting.angle ?? 45) * Math.PI) / 180;
  const lightOffsetX = Math.round(Math.cos(lightRad) * 8);
  const lightOffsetY = Math.round(Math.sin(lightRad) * 8);

  const skyboxBg = SKYBOX_GRADIENTS[environment.skybox] || SKYBOX_GRADIENTS['dark-studio'];

  // Stardust particle positions (fixed pre-computed pool for CLS & zero allocation)
  const stardustPoints = useMemo(() => [
    { x: 8, y: 15, z: 20, delay: 0.1 },
    { x: 22, y: 65, z: -10, delay: 0.7 },
    { x: 35, y: 25, z: 35, delay: 1.2 },
    { x: 48, y: 80, z: 15, delay: 0.3 },
    { x: 62, y: 18, z: -25, delay: 1.5 },
    { x: 75, y: 70, z: 40, delay: 0.9 },
    { x: 88, y: 30, z: 10, delay: 0.4 },
    { x: 15, y: 45, z: 30, delay: 1.8 },
    { x: 82, y: 55, z: -15, delay: 1.1 },
    { x: 50, y: 40, z: 50, delay: 0.6 }
  ], []);

  const hasCustomHeight = /(?:^|\s)(?:h-|min-h-|max-h-)/.test(className);
  const heightClass = hasCustomHeight
    ? ''
    : isCompact
      ? 'h-auto min-h-0 max-h-fit py-2.5 sm:py-3'
      : 'min-h-[560px] sm:h-[600px]';

  const containerFrameClass = compact
    ? 'border-0 bg-transparent shadow-none p-0'
    : 'rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] shadow-inner';

  return (
    <div className={`universal-mini-portfolio w-full flex flex-col ${isCompact ? 'gap-0' : 'gap-3'} ${className}`}>
      {/* Top Toolbar Controls */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/70 dark:bg-[#181226]/80 border border-[#E7E2D8] dark:border-[#2D2340] backdrop-blur-md shadow-2xs text-xs">
          {/* Telemetry Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-3 h-3 animate-pulse text-cyan-500" />
              <span>Universal Portfolio Replica</span>
            </span>

            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800">
              Live CSS 3D
            </span>
          </div>

          {/* Orientation & Lighting Readout */}
          <div className="flex items-center gap-2">
            <div className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 text-stone-600 dark:text-stone-300">
              Rot: {tilt.rotX}°, {tilt.rotY}° | Light: {lighting.angle ?? 45}°
            </div>

            {/* Wireframe / CAD Mode Toggle */}
            <button
              type="button"
              onClick={handleWireframeToggle}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs font-semibold border transition-all cursor-pointer shadow-2xs active:scale-95 ${
                isWireframe
                  ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-500/50 shadow-cyan-500/10'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700'
              }`}
              title={isWireframe ? 'Disable Blueprint Wireframe' : 'Enable Blueprint Wireframe'}
              aria-label="Toggle CAD Wireframe Mode"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isWireframe ? 'CAD Active' : 'CAD Wireframe'}</span>
            </button>

            {/* Quick Reset Orientation */}
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 font-mono text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Reset Sandbox Orientation to 0°, 0°"
              aria-label="Reset Sandbox Orientation"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Sandbox Viewport Container */}
      <SandboxViewportContainer
        perspective={camera.perspectiveFOV || 1000}
        className={`w-full ${heightClass} ${containerFrameClass} relative flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none touch-none transition-colors duration-500 ${
          isWireframe && !compact ? 'bg-cyan-950/40' : ''
        }`}
        style={compact ? {} : {
          background: isWireframe
            ? 'radial-gradient(circle at center, rgba(0, 242, 254, 0.12) 0%, rgba(6, 15, 30, 0.98) 100%)'
            : (themeStyle?.stageBg || skyboxBg)
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerUp}
      >
        {/* CAD Blueprint Grid Overlay (when wireframe active) */}
        {isWireframe && (
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,242,254,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,242,254,0.3) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />
        )}

        {/* Volumetric Fog Overlay */}
        {environment.fogDensity > 0 && !isWireframe && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: `blur(${Math.round(environment.fogDensity * 0.06)}px)`,
              opacity: environment.fogDensity / 100
            }}
          />
        )}

        {/* Floating Stardust Particles */}
        {environment.stardustParticles && !isWireframe && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {stardustPoints.map((pt, idx) => (
              <div
                key={idx}
                className="absolute w-1 h-1 rounded-full bg-cyan-400/70 animate-pulse"
                style={{
                  left: `${pt.x}%`,
                  top: `${pt.y}%`,
                  animationDelay: `${pt.delay}s`,
                  transform: `translateZ(${pt.z}px)`,
                  boxShadow: '0 0 6px rgba(0,242,254,0.8)'
                }}
              />
            ))}
          </div>
        )}

        {/* 3D Master Orbit Stage */}
        <div
          ref={stageRef}
          className="relative w-80 sm:w-96 flex flex-col items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 transition-transform pointer-events-auto"
          style={{
            transform: isMaster3DOn
              ? `rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg) scale(1.02)`
              : 'none',
            transformStyle: 'preserve-3d',
            transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          {/* Exploded Strata Layer 1 (Base Chassis) */}
          {exploded.enabled && (
            <div
              className="absolute inset-0 rounded-2xl border border-cyan-500/40 bg-cyan-950/20 backdrop-blur-xs pointer-events-none"
              style={{
                transform: `translateZ(-${exploded.separationDistance}px)`,
                opacity: exploded.ghostOpacity || 0.4
              }}
            >
              <div className="p-2 text-[9px] font-mono text-cyan-400">
                BASE CHASSIS [STRATA -01]
              </div>
            </div>
          )}

          {/* Exploded Strata Layer 2 (Schematic Wireframe) */}
          {exploded.enabled && (exploded.blueprintMode || isWireframe) && (
            <div
              className="absolute inset-0 rounded-2xl border-2 border-dashed border-cyan-400/50 bg-cyan-900/10 pointer-events-none"
              style={{
                transform: `translateZ(-${Math.round(exploded.separationDistance * 0.5)}px)`
              }}
            >
              <div className="p-2 text-[9px] font-mono text-cyan-300">
                SCHEMATIC WIREFRAME [Z: -${Math.round(exploded.separationDistance * 0.5)}px]
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 1. MINI-NAVBAR (Z: +18px)                                 */}
          {/* Floating frosted glass bar with initials, dots, pill     */}
          {/* ======================================================== */}
          <div
            data-mini-element="navbar"
            onMouseEnter={() => onHighlightComponent?.('navbar')}
            onMouseLeave={() => onHighlightComponent?.(null)}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-full border transition-all duration-300 ${
              isNavHighlighted ? 'ring-2 ring-[#FF4D6D] ring-offset-2 shadow-[0_0_20px_rgba(255,77,109,0.35)]' : ''
            } ${
              isWireframe
                ? 'border-cyan-400 bg-cyan-950/70 text-cyan-300 font-mono shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                : `${themeStyle.navbar.border} ${themeStyle.navbar.text} backdrop-blur-md shadow-md`
            }`}
            style={{
              transform: isMaster3DOn ? `translateZ(${zNav}px)` : 'translateZ(0px)',
              background: isWireframe ? undefined : (isDark ? themeStyle.navbar.darkBg : themeStyle.navbar.bg),
              boxShadow: isMaster3DOn
                ? (isNav3D
                    ? `${themeStyle.navbar.activeGlowRim}, ${lightOffsetX * 0.5}px ${lightOffsetY * 0.5}px 14px rgba(0,0,0,0.22)`
                    : `${lightOffsetX * 0.5}px ${lightOffsetY * 0.5}px 10px rgba(0,0,0,0.18)`)
                : 'none',
              transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease, background 0.35s ease'
            }}
          >
            {/* Brand Monogram Initials */}
            <div
              className="flex items-center gap-1.5 font-bold text-xs tracking-tight"
              style={{
                transform: isNav3D && elements.navbarItems ? 'translateZ(12px)' : 'translateZ(0px)',
                transition: 'transform 0.3s ease'
              }}
            >
              <span className="font-mono text-[#FF4D6D]">[AV]</span>
              <span className="text-[10px] opacity-75 font-medium hidden sm:inline">Portfolio</span>
            </div>

            {/* Navigation Dots */}
            <div
              className="flex items-center gap-1.5"
              style={{
                transform: isNav3D && elements.navbarIcons ? 'translateZ(10px)' : 'translateZ(0px)',
                transition: 'transform 0.3s ease'
              }}
            >
              {['Home', 'Work', 'Skills', 'Lab'].map((dot, idx) => (
                <span
                  key={dot}
                  title={dot}
                  className={`w-1.5 h-1.5 rounded-full ${
                    idx === 0
                      ? 'bg-[#FF4D6D] ring-2 ring-[#FF4D6D]/30'
                      : isWireframe
                        ? 'bg-cyan-400/60'
                        : 'bg-stone-300 dark:bg-stone-600'
                  }`}
                />
              ))}
            </div>

            {/* Micro Theme Pill */}
            <div
              className="flex items-center gap-1 p-0.5 rounded-full bg-stone-200/60 dark:bg-stone-800/80 text-[10px]"
              style={{
                transform: isNav3D && (elements.navbarItems || elements.navbarIcons) ? 'translateZ(8px)' : 'translateZ(0px)',
                transition: 'transform 0.3s ease'
              }}
            >
              <Sun className="w-2.5 h-2.5 text-amber-500" />
              <Moon className="w-2.5 h-2.5 text-stone-400" />
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. MINI-HERO CARD (Z: +36px)                              */}
          {/* Central hero card with avatar orb, headline, badge       */}
          {/* ======================================================== */}
          <div
            data-mini-element="hero"
            onMouseEnter={() => onHighlightComponent?.('hero')}
            onMouseLeave={() => onHighlightComponent?.(null)}
            className={`w-full rounded-2xl p-3.5 flex items-center gap-3 border transition-all duration-300 ${
              isHeroHighlighted ? 'ring-2 ring-[#FF4D6D] ring-offset-2 shadow-[0_0_20px_rgba(255,77,109,0.35)]' : ''
            } ${
              isWireframe
                ? 'border-cyan-400 bg-cyan-950/80 text-cyan-200 shadow-[0_0_20px_rgba(0,242,254,0.35)]'
                : `${themeStyle.hero.border} backdrop-blur-xl shadow-xl`
            }`}
            style={{
              transform: isMaster3DOn ? `translateZ(${zHero}px)` : 'translateZ(0px)',
              background: isWireframe ? undefined : (isDark ? themeStyle.hero.darkBg : themeStyle.hero.bg),
              boxShadow: isMaster3DOn
                ? (isHeroAny3D
                    ? `${themeStyle.hero.activeGlowRim}, ${lightOffsetX}px ${lightOffsetY}px ${Math.round(materials.bevelExtrusion * 4)}px rgba(0,0,0,0.28)`
                    : `${lightOffsetX}px ${lightOffsetY}px ${Math.round(materials.bevelExtrusion * 4)}px rgba(0,0,0,0.25)`)
                : 'none',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease, background 0.35s ease'
            }}
          >
            {/* Avatar Orb */}
            <div
              className="relative shrink-0"
              style={{
                transform: isProfilePic3D ? 'translateZ(30px)' : 'translateZ(0px)',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${themeStyle.hero.avatarGradient} p-0.5 shadow-md flex items-center justify-center`}>
                <div className="w-full h-full rounded-full bg-[#181226] flex items-center justify-center text-[10px] font-bold text-white">
                  AV
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#181226] animate-pulse" />
            </div>

            {/* Headline Wireframe Skeleton & Status */}
            <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{ transformStyle: 'preserve-3d' }}>
              <div className="flex items-center justify-between gap-1">
                <span
                  className="text-[11px] font-bold truncate text-stone-800 dark:text-stone-100"
                  style={{
                    transform: isHeader3D ? 'translateZ(20px)' : 'translateZ(0px)',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  {isWireframe ? 'WIRE_FRAME // HERO_UNIT' : 'Atul Verma • 3D Systems'}
                </span>
                <span
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shrink-0"
                  style={{
                    transform: isSubHeader3D ? 'translateZ(16px)' : 'translateZ(0px)',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>{isMaster3DOn ? 'Active 3D' : 'Flat 2D'}</span>
                </span>
              </div>

              {/* Wireframe Skeletons */}
              <div
                className="space-y-1"
                style={{
                  transform: isDescription3D ? 'translateZ(12px)' : 'translateZ(0px)',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <div className={`h-1.5 w-4/5 rounded-full ${isWireframe ? 'bg-cyan-500/40' : 'bg-stone-300 dark:bg-stone-700'}`} />
                <div className={`h-1.5 w-3/5 rounded-full ${isWireframe ? 'bg-cyan-500/25' : 'bg-stone-200 dark:bg-stone-800'}`} />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 3. MINI-SKILLS & PROJECTS GRID (Z: +24px)                 */}
          {/* 4-card isometric grid responding to dynamic light/bevel  */}
          {/* ======================================================== */}
          <div
            data-mini-element="grid"
            onMouseEnter={() => onHighlightComponent?.('showcase')}
            onMouseLeave={() => onHighlightComponent?.(null)}
            className={`w-full grid grid-cols-2 gap-2 p-1 rounded-2xl transition-all duration-300 ${
              isGridHighlighted ? 'ring-2 ring-[#FF4D6D] ring-offset-2 shadow-[0_0_20px_rgba(255,77,109,0.35)]' : ''
            }`}
            style={{
              transform: isMaster3DOn ? `translateZ(${zGrid}px)` : 'translateZ(0px)',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {[
              { id: 'react', title: 'React 19 UI', icon: Code, tag: 'Frontend' },
              { id: 'webgl', title: 'Three.js 3D', icon: Box, tag: 'Spatial' },
              { id: 'dsp', title: 'Audio DSP', icon: Volume2, tag: 'Synthesizer' },
              { id: 'system', title: 'Core Systems', icon: Cpu, tag: 'Architect' }
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className={`p-2 rounded-xl border flex flex-col justify-between gap-1.5 transition-all ${
                    isWireframe
                      ? 'border-cyan-400/80 bg-cyan-950/60 text-cyan-300 font-mono shadow-[0_0_10px_rgba(0,242,254,0.2)]'
                      : `${themeStyle.gridItem.border} ${themeStyle.gridItem.text} backdrop-blur-md shadow-sm`
                  }`}
                  style={{
                    transform: isContent3D ? 'translateZ(14px)' : 'translateZ(0px)',
                    background: isWireframe ? undefined : (isDark ? themeStyle.gridItem.darkBg : themeStyle.gridItem.bg),
                    boxShadow: isMaster3DOn
                      ? (isGrid3D
                          ? `${lightOffsetX * 0.6}px ${lightOffsetY * 0.6}px ${Math.round(materials.bevelExtrusion * 3)}px rgba(0,0,0,0.24), ${themeStyle.gridItem.activeGlowRim}`
                          : `${lightOffsetX * 0.6}px ${lightOffsetY * 0.6}px ${Math.round(materials.bevelExtrusion * 2)}px rgba(0,0,0,0.18)`)
                      : 'none',
                    transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease, background 0.35s ease'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1 truncate">
                      <Icon className="w-3 h-3 text-[#FF4D6D]" />
                      <span>{card.title}</span>
                    </span>
                    <span className="text-[8px] font-mono opacity-60">
                      {card.tag}
                    </span>
                  </div>
                  <div className={`h-1 w-2/3 rounded-full ${isWireframe ? 'bg-cyan-500/40' : 'bg-stone-200 dark:bg-stone-700'}`} />
                </div>
              );
            })}
          </div>

          {/* ======================================================== */}
          {/* 4. MINI-FLOATING DOCK (Z: +42px)                          */}
          {/* Curved bottom dock with 5 micro circular icons (hover pop)*/}
          {/* ======================================================== */}
          <div
            data-mini-element="dock"
            onMouseEnter={() => onHighlightComponent?.('dock')}
            onMouseLeave={() => onHighlightComponent?.(null)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border transition-all duration-300 ${
              isDockHighlighted ? 'ring-2 ring-[#FF4D6D] ring-offset-2 shadow-[0_0_20px_rgba(255,77,109,0.35)]' : ''
            } ${
              isWireframe
                ? 'border-cyan-400 bg-cyan-950/90 text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                : `${themeStyle.dock.border} backdrop-blur-lg shadow-lg`
            }`}
            style={{
              transform: isMaster3DOn ? `translateZ(${zDock}px)` : 'translateZ(0px)',
              background: isWireframe ? undefined : (isDark ? themeStyle.dock.darkBg : themeStyle.dock.bg),
              boxShadow: isMaster3DOn
                ? (isDock3D
                    ? `${lightOffsetX}px ${lightOffsetY}px 24px rgba(0,0,0,0.32), ${themeStyle.dock.activeGlowRim}`
                    : `${lightOffsetX}px ${lightOffsetY}px 14px rgba(0,0,0,0.22)`)
                : 'none',
              transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease, background 0.35s ease'
            }}
          >
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'code', icon: Code, label: 'Projects' },
              { id: 'cpu', icon: Cpu, label: 'Skills' },
              { id: 'audio', icon: Volume2, label: 'Audio' },
              { id: 'term', icon: Terminal, label: 'Terminal' }
            ].map((item) => {
              const Icon = item.icon;
              const isHovered = hoveredDockIcon === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setHoveredDockIcon(item.id)}
                  onMouseLeave={() => setHoveredDockIcon(null)}
                  className={`w-6 h-6 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isHovered
                      ? 'scale-125 -translate-y-1 bg-[#FF4D6D] text-white shadow-md'
                      : isWireframe
                        ? 'bg-cyan-900/60 text-cyan-300'
                        : `${themeStyle.dock.btnBg}`
                  }`}
                  style={{
                    transform: isHovered
                      ? 'translateZ(10px) scale(1.2)'
                      : (isDock3D ? 'translateZ(8px)' : 'translateZ(0px)'),
                    transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                  title={item.label}
                  aria-label={item.label}
                >
                  <Icon className="w-3 h-3" />
                </button>
              );
            })}
          </div>

          {/* ======================================================== */}
          {/* 5. MINI-FOOTER (Z: +10px)                                 */}
          {/* Ground plane with soft drop shadow & copyright text      */}
          {/* ======================================================== */}
          <div
            data-mini-element="footer"
            onMouseEnter={() => onHighlightComponent?.('footer')}
            onMouseLeave={() => onHighlightComponent?.(null)}
            className={`w-full flex items-center justify-between text-[8px] font-mono text-stone-400 dark:text-stone-500 pt-1 border-t border-stone-200/40 dark:border-stone-800/40 transition-all duration-300 ${
              isFooterHighlighted ? 'ring-2 ring-[#FF4D6D] ring-offset-2 shadow-[0_0_20px_rgba(255,77,109,0.35)] rounded-lg px-2 py-1' : ''
            }`}
            style={{
              transform: isMaster3DOn ? `translateZ(${zFooter}px)` : 'translateZ(0px)',
              transition: 'transform 0.35s ease'
            }}
          >
            <span>© 2026 Atul Verma • All Systems Nominal</span>
            <span className="flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 text-emerald-500" />
              <span>{isMaster3DOn ? '3D Preserved' : '2D Preserved'}</span>
            </span>
          </div>
        </div>

        {/* Drag Guidance Toast Overlay */}
        {!compact && (
          <div className="absolute bottom-2.5 left-3 text-[10px] font-mono text-stone-400 dark:text-stone-500 bg-white/70 dark:bg-stone-900/70 px-2 py-0.5 rounded-md backdrop-blur-xs border border-stone-200/50 dark:border-stone-800/50 pointer-events-none">
            Drag to orbit 3D replica
          </div>
        )}
      </SandboxViewportContainer>
    </div>
  );
}

export default UniversalMiniPortfolio;
