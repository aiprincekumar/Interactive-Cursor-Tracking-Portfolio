import React from 'react';
import {
  User,
  Sparkles,
  Check,
  Layers,
  Shield,
  Zap,
  Activity,
  Code
} from 'lucide-react';
import { useLab3D } from '../../../context/LabContext';

/**
 * HeroCardPreview
 *
 * Phase 4: Dedicated 3D Hero Card Preview with avatar orb, animated online indicator,
 * holographic foil edge highlight, bevel depth, and multi-layer exploded strata
 * (BASE CHASSIS, AVATAR ORB, METRIC CHIPS).
 */
export function HeroCardPreview({
  tilt = { rotX: 14, rotY: -18 },
  interactive = true,
  className = '',
  explodedMode,
  separationDistance,
  isHighlighted = false,
  onHighlight
}) {
  const lab3D = useLab3D ? useLab3D() : null;
  const threeD = lab3D?.threeD || {};
  const lighting = threeD.lighting || { angle: 45, shadowSoftness: 0.6, intensity: 1 };
  const materials = threeD.materials || { preset: 'glass', bevelWidth: 2, specularGlow: 0.7 };
  const explodedConfig = threeD.exploded || { enabled: false, separationDistance: 40, blueprintMode: false };

  const isExploded = explodedMode ?? explodedConfig.enabled ?? false;
  const separation = separationDistance ?? explodedConfig.separationDistance ?? 40;
  const isBlueprint = explodedConfig.blueprintMode ?? false;

  // Dynamic light calculations
  const rad = ((lighting.angle ?? 45) * Math.PI) / 180;
  const lightOffsetX = Math.round(Math.cos(rad) * 16);
  const lightOffsetY = Math.round(Math.sin(rad) * 16);
  const shadowBlur = Math.round(24 * (lighting.shadowSoftness ?? 0.6));

  // Strata Z-offsets
  const zBase = isExploded ? 0 : 4;
  const zAvatar = isExploded ? Math.round(separation * 0.9) : 26;
  const zInfo = isExploded ? Math.round(separation * 1.25) : 32;
  const zMetrics = isExploded ? Math.round(separation * 1.6) : 40;

  // Material style computation
  const getMaterialStyles = () => {
    if (isBlueprint) {
      return {
        background: 'rgba(6, 182, 212, 0.08)',
        borderColor: 'rgba(6, 182, 212, 0.6)',
        color: '#22d3ee',
        boxShadow: `0 0 25px rgba(6, 182, 212, 0.25), inset 0 0 15px rgba(6, 182, 212, 0.15)`
      };
    }
    switch (materials.preset) {
      case 'metallic':
        return {
          background: 'linear-gradient(135deg, rgba(220, 225, 235, 0.9) 0%, rgba(160, 170, 190, 0.85) 100%)',
          borderColor: 'rgba(255, 255, 255, 0.8)',
          boxShadow: `${lightOffsetX}px ${lightOffsetY}px ${shadowBlur}px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.7)`
        };
      case 'clay':
        return {
          background: '#f8fafc',
          borderColor: '#e2e8f0',
          boxShadow: `${lightOffsetX}px ${lightOffsetY}px ${shadowBlur}px rgba(100, 116, 139, 0.3)`
        };
      case 'wireframe':
        return {
          background: 'transparent',
          borderColor: '#06b6d4',
          borderStyle: 'dashed',
          boxShadow: `0 0 20px rgba(6, 182, 212, 0.3)`
        };
      case 'glass':
      default:
        return {
          background: 'rgba(255, 255, 255, 0.82)',
          borderColor: 'rgba(255, 77, 109, 0.35)',
          boxShadow: `${lightOffsetX}px ${lightOffsetY}px ${shadowBlur}px rgba(0, 0, 0, 0.32)`
        };
    }
  };

  const matStyle = getMaterialStyles();

  return (
    <div
      data-testid="hero-card-preview"
      onMouseEnter={() => onHighlight?.('hero')}
      onMouseLeave={() => onHighlight?.(null)}
      className={`relative w-full max-w-[310px] p-5 rounded-2xl select-none transition-all duration-300 ${
        isHighlighted ? 'ring-2 ring-[#FF4D6D] ring-offset-2 shadow-[0_0_20px_rgba(255,77,109,0.35)]' : ''
      } ${className}`}
      style={{
        transform: `rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg) translateZ(${zBase}px)`,
        transformStyle: 'preserve-3d',
        borderWidth: `${materials.bevelWidth ?? 2}px`,
        ...matStyle
      }}
    >
      {/* Holographic foil edge sheen */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-40 mix-blend-overlay transition-opacity"
        style={{
          background: `linear-gradient(${lighting.angle ?? 45}deg, transparent 20%, rgba(255, 77, 109, 0.5) 50%, rgba(0, 242, 254, 0.6) 75%, transparent 95%)`
        }}
      />

      {/* STRATUM 1: BASE CHASSIS */}
      <div
        className="relative z-10 flex flex-col items-center text-center gap-3.5"
        style={{ transform: `translateZ(${zBase}px)`, transformStyle: 'preserve-3d' }}
      >
        {isExploded && (
          <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
            [STRATUM 1: BASE CHASSIS]
          </span>
        )}

        {/* STRATUM 2: AVATAR ORB */}
        <div
          className="relative group cursor-pointer transition-transform duration-200"
          style={{ transform: `translateZ(${zAvatar}px)`, transformStyle: 'preserve-3d' }}
        >
          {isExploded && (
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              [STRATUM 2: AVATAR ORB]
            </span>
          )}

          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF4D6D] via-[#7928CA] to-[#00F2FE] p-1 shadow-xl flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#181226] text-white flex flex-col items-center justify-center relative overflow-hidden border border-white/20">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                AV
              </span>
              <span className="text-[9px] font-mono text-cyan-400 opacity-90">STUDIO</span>

              {/* Specular glint on avatar */}
              <div
                className="absolute inset-0 pointer-events-none rounded-full"
                style={{
                  background: `radial-gradient(circle at ${50 + lightOffsetX * 2}% ${50 - lightOffsetY * 2}%, rgba(255, 255, 255, 0.45) 0%, transparent 60%)`
                }}
              />
            </div>
          </div>

          {/* Animated online status indicator */}
          <div
            className="absolute bottom-0 right-0 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-stone-900/90 border border-emerald-500/50 shadow-md"
            style={{ transform: 'translateZ(12px)' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[8px] font-mono font-bold text-emerald-400">ONLINE</span>
          </div>
        </div>

        {/* Identity & Role Info */}
        <div
          className="flex flex-col items-center gap-0.5"
          style={{ transform: `translateZ(${zInfo}px)`, transformStyle: 'preserve-3d' }}
        >
          <div className="flex items-center gap-1.5">
            <h4 className="text-base font-extrabold text-stone-900 dark:text-white tracking-tight">
              Atul Verma
            </h4>
            <Shield className="w-3.5 h-3.5 text-cyan-500" />
          </div>
          <p className="text-xs font-medium text-stone-600 dark:text-stone-300">
            Creative Technologist &amp; 3D Architect
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-mono text-stone-500 flex items-center gap-1">
              <Code className="w-3 h-3 text-cyan-500" />
              <span>Full-Stack &bull; Three.js &bull; AI</span>
            </span>
          </div>
        </div>

        {/* STRATUM 3: METRIC CHIPS / BADGES */}
        <div
          className="w-full flex flex-col gap-2 pt-1 border-t border-stone-200/60 dark:border-stone-800"
          style={{ transform: `translateZ(${zMetrics}px)`, transformStyle: 'preserve-3d' }}
        >
          {isExploded && (
            <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 mx-auto">
              [STRATUM 3: METRIC CHIPS]
            </span>
          )}

          <div className="grid grid-cols-3 gap-1.5 w-full">
            <div className="flex flex-col items-center p-1.5 rounded-lg bg-stone-100/80 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 shadow-2xs">
              <span className="text-[9px] font-mono text-stone-400 flex items-center gap-0.5">
                <Activity className="w-2.5 h-2.5 text-emerald-500" />
                <span>FPS</span>
              </span>
              <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">120</span>
            </div>

            <div className="flex flex-col items-center p-1.5 rounded-lg bg-stone-100/80 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 shadow-2xs">
              <span className="text-[9px] font-mono text-stone-400 flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5 text-cyan-500" />
                <span>CLS</span>
              </span>
              <span className="text-xs font-bold font-mono text-cyan-600 dark:text-cyan-400">0.00</span>
            </div>

            <div className="flex flex-col items-center p-1.5 rounded-lg bg-stone-100/80 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 shadow-2xs">
              <span className="text-[9px] font-mono text-stone-400 flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                <span>DEPTH</span>
              </span>
              <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400">3D</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 dark:text-stone-400 px-1">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <Check className="w-3 h-3" />
              <span>Chassis Nominal</span>
            </span>
            <span>Z: +{zMetrics}px</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroCardPreview;
