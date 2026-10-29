import React, { useState } from 'react';
import {
  User,
  Sparkles,
  Check,
  Layers,
  Shield,
  Zap,
  Activity,
  Code,
  Box
} from 'lucide-react';
import { useLab3D } from '../../../context/LabContext';
import { soundFX } from '../../../utils/audio';
import { THEME_PORTFOLIO_STYLES, ELASTICITY_TRANSITIONS } from '../UniversalMiniPortfolio';
import { GemMeshVisual, CyberCubeMeshVisual } from '../Visual3DPresets';

/**
 * HeroCardPreview
 *
 * Phase 4: Dedicated 3D Hero Card Preview with avatar orb, animated online indicator,
 * holographic foil edge highlight, bevel depth, and multi-layer exploded strata
 * (BASE CHASSIS, AVATAR ORB, METRIC CHIPS).
 */
export function HeroCardPreview({
  tilt = { rotX: 0, rotY: 0 },
  interactive = true,
  className = '',
  explodedMode,
  separationDistance,
  isHighlighted = false,
  onHighlight
}) {
  const lab3D = useLab3D ? useLab3D() : null;
  const threeD = lab3D?.threeD || {};
  const isMaster3DOn = threeD.master3D ?? true;
  const masterTheme = threeD.masterTheme || 'apple-glass';
  const elements = threeD.elements || {};
  const lighting = threeD.lighting || { angle: 45, shadowSoftness: 0.6, intensity: 1 };
  const materials = threeD.materials || { preset: 'glass-acrylic', bevelExtrusion: 4, specularGlow: 0.7, roughness: 0.25, metalness: 0.20, ior: 1.50, clearcoat: 0.40 };
  const roughness = typeof materials.roughness === 'number' ? materials.roughness : 0.25;
  const metalness = typeof materials.metalness === 'number' ? materials.metalness : 0.20;
  const ior = typeof materials.ior === 'number' ? materials.ior : 1.50;
  const clearcoat = typeof materials.clearcoat === 'number' ? materials.clearcoat : 0.40;
  const physics = threeD.physics || { hoverPop: 12, elasticity: 'snappy', clickDepression: true };
  const hoverPop = typeof physics.hoverPop === 'number' ? physics.hoverPop : 12;
  const isClickDepressionEnabled = physics.clickDepression ?? true;
  const elasticityMode = physics.elasticity && ELASTICITY_TRANSITIONS[physics.elasticity] ? physics.elasticity : 'snappy';
  const activeElasticity = ELASTICITY_TRANSITIONS[elasticityMode] || ELASTICITY_TRANSITIONS.snappy;
  const explodedConfig = threeD.exploded || { enabled: false, separationDistance: 40, blueprintMode: false };

  const themeStyle = THEME_PORTFOLIO_STYLES[masterTheme] || THEME_PORTFOLIO_STYLES['apple-glass'];

  const isExploded = explodedMode ?? explodedConfig.enabled ?? false;
  const separation = separationDistance ?? explodedConfig.separationDistance ?? 40;
  const isBlueprint = explodedConfig.blueprintMode ?? false;

  const [isHovered, setIsHovered] = useState(false);
  const [isDepressed, setIsDepressed] = useState(false);

  // 10 Element Toggles state mapping for Hero preview
  const isProfilePic3D = isMaster3DOn && Boolean(elements.profilePic);
  const isHeader3D = isMaster3DOn && Boolean(elements.header);
  const isSubHeader3D = isMaster3DOn && Boolean(elements.subHeader);
  const isDescription3D = isMaster3DOn && Boolean(elements.description);

  // Dynamic bevel & light calculations
  const bevel = materials.bevelExtrusion ?? materials.bevelWidth ?? 4;
  const rad = ((lighting.angle ?? 45) * Math.PI) / 180;
  const lightOffsetX = Math.round(Math.cos(rad) * 16);
  const lightOffsetY = Math.round(Math.sin(rad) * 16);
  const shadowBlur = Math.round(24 * (lighting.shadowSoftness ?? 0.6)) + bevel;

  // Strata Z-offsets honoring master 3D, theme & 10 toggles
  const heroElevationZ = (isHovered ? hoverPop : 0) + (isDepressed && isClickDepressionEnabled ? -6 : 0);
  const zBase = !isMaster3DOn ? 0 : (isExploded ? 0 : 4) + heroElevationZ;
  const zAvatar = !isMaster3DOn ? 0 : (isExploded ? Math.round(separation * 0.9) : (isProfilePic3D ? 30 : 0));
  const zInfo = !isMaster3DOn ? 0 : (isExploded ? Math.round(separation * 1.25) : (isHeader3D || isSubHeader3D ? 20 : 0));
  const zMetrics = !isMaster3DOn ? 0 : (isExploded ? Math.round(separation * 1.6) : (isDescription3D ? 12 : 0));

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
      case 'metallic-gloss':
        return {
          background: `linear-gradient(135deg, rgba(${Math.round(220 - metalness * 40)}, ${Math.round(225 - metalness * 30)}, ${Math.round(235 - metalness * 20)}, 0.9) 0%, rgba(160, 170, 190, 0.85) 100%)`,
          borderColor: `rgba(255, 255, 255, ${0.7 + metalness * 0.25})`,
          boxShadow: `${lightOffsetX}px ${lightOffsetY}px ${shadowBlur}px rgba(0, 0, 0, 0.4), inset 0 1px ${bevel}px rgba(255, 255, 255, ${0.5 + metalness * 0.4}), 0 0 ${Math.round((ior - 1) * 10)}px rgba(255, 255, 255, 0.2)`
        };
      case 'clay':
      case 'neumorphic-clay':
        return {
          background: '#ECE8DF',
          borderColor: '#e2e8f0',
          boxShadow: `${lightOffsetX}px ${lightOffsetY}px ${shadowBlur}px rgba(100, 116, 139, 0.3), ${-lightOffsetX}px ${-lightOffsetY}px ${shadowBlur}px rgba(255, 255, 255, 0.7)`
        };
      case 'wireframe':
      case 'cyber-wireframe':
        return {
          background: 'rgba(5, 5, 12, 0.85)',
          borderColor: '#06b6d4',
          borderStyle: 'dashed',
          boxShadow: `0 0 20px rgba(6, 182, 212, 0.3), inset 0 0 10px rgba(6, 182, 212, 0.15)`
        };
      case 'glass':
      case 'glass-acrylic':
      default:
        if (masterTheme === 'cyber-neon') {
          return {
            background: '#0B0813',
            borderColor: '#FF007A',
            boxShadow: `0 0 20px rgba(255, 0, 122, 0.4), inset 0 0 12px rgba(0, 242, 254, 0.25)`
          };
        }
        if (masterTheme === 'studio-matte') {
          return {
            background: '#EAE6DE',
            borderColor: '#BEB8AC',
            boxShadow: `${lightOffsetX}px ${lightOffsetY}px ${shadowBlur}px rgba(0, 0, 0, 0.16), inset 0 1px 3px rgba(255, 255, 255, 0.3)`
          };
        }
        if (masterTheme === 'floating-hologram') {
          return {
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.35) 0%, rgba(147, 51, 234, 0.4) 100%)',
            borderColor: 'rgba(192, 132, 252, 0.65)',
            boxShadow: `0 0 24px rgba(147, 51, 234, 0.45), inset 0 0 14px rgba(129, 140, 248, 0.3)`
          };
        }
        return {
          background: 'rgba(255, 255, 255, 0.82)',
          borderColor: `rgba(255, 77, 109, ${0.25 + (ior - 1) * 0.15})`,
          boxShadow: `${lightOffsetX}px ${lightOffsetY}px ${shadowBlur}px rgba(0, 0, 0, 0.32), inset 0 0 ${Math.round(8 * (ior - 1))}px rgba(255, 255, 255, 0.3), 0 0 ${Math.round(clearcoat * 12)}px rgba(255, 255, 255, 0.25)`
        };
    }
  };

  const matStyle = getMaterialStyles();
  const customMesh = threeD.customMesh || { type: 'avatar', customName: 'Atul Verma Avatar', scale: 1.0 };

  const renderHeroAvatarGeometry = () => {
    const meshType = customMesh.type || 'avatar';
    const meshScale = customMesh.scale || 1.0;

    if (meshType === 'gem') {
      return (
        <div
          data-testid="hero-mesh-gem"
          className="w-20 h-20 rounded-full bg-[#181226] border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,242,254,0.5)] flex flex-col items-center justify-center relative overflow-hidden"
          style={{ transform: `scale(${meshScale})` }}
        >
          <GemMeshVisual scale={1.2} />
          <span className="text-[8px] font-mono font-bold text-cyan-300 mt-0.5">3D GEM</span>
        </div>
      );
    }

    if (meshType === 'cube') {
      return (
        <div
          data-testid="hero-mesh-cube"
          className="w-20 h-20 rounded-full bg-[#181226] border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,242,254,0.5)] flex flex-col items-center justify-center relative overflow-hidden"
          style={{ transform: `scale(${meshScale})` }}
        >
          <CyberCubeMeshVisual scale={1.3} />
          <span className="text-[8px] font-mono font-bold text-cyan-300 mt-0.5">CYBER CUBE</span>
        </div>
      );
    }

    if (meshType === 'custom') {
      return (
        <div
          data-testid="hero-mesh-custom"
          className="w-20 h-20 rounded-full bg-[#181226] border-2 border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.5)] flex flex-col items-center justify-center relative overflow-hidden p-2 text-center"
          style={{ transform: `scale(${meshScale})` }}
        >
          <Box className="w-6 h-6 text-purple-400 animate-pulse mb-1" />
          <span className="text-[8px] font-mono font-bold text-purple-200 truncate max-w-[65px]">
            {customMesh.customName || 'CUSTOM MESH'}
          </span>
          <span className="text-[7px] font-mono text-purple-400">
            {customMesh.scale?.toFixed(1) || '1.0'}x SCALE
          </span>
        </div>
      );
    }

    // Default 'avatar': Classic gaze-tracking developer portrait with dynamic 3D elevation
    return (
      <div
        data-testid="hero-mesh-avatar"
        className={`w-20 h-20 rounded-full bg-gradient-to-tr ${themeStyle.hero.avatarGradient || 'from-[#FF4D6D] via-[#7928CA] to-[#00F2FE]'} p-1 shadow-xl flex items-center justify-center`}
        style={{ transform: `scale(${meshScale})` }}
      >
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
    );
  };

  return (
    <div
      data-testid="hero-card-preview"
      onMouseEnter={() => {
        setIsHovered(true);
        onHighlight?.('hero');
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDepressed(false);
        onHighlight?.(null);
      }}
      onPointerDown={() => {
        if (isClickDepressionEnabled) {
          setIsDepressed(true);
          try {
            soundFX?.playHapticClick?.();
          } catch {
            // Audio fallback safe
          }
        }
      }}
      onPointerUp={() => setIsDepressed(false)}
      className={`relative w-full max-w-[310px] p-5 rounded-2xl select-none transition-all duration-300 ${
        isHighlighted ? 'ring-2 ring-[#FF4D6D] ring-offset-2 shadow-[0_0_20px_rgba(255,77,109,0.35)]' : ''
      } ${className}`}
      style={{
        transform: `rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg) translateZ(${zBase}px)`,
        transformStyle: 'preserve-3d',
        borderWidth: `${bevel}px`,
        transition: `transform ${activeElasticity.duration} ${activeElasticity.curve}, box-shadow ${activeElasticity.duration} ease`,
        '--3d-roughness': roughness,
        '--3d-metalness': metalness,
        '--3d-ior': ior,
        '--3d-clearcoat': clearcoat,
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

        {/* STRATUM 2: AVATAR ORB / 3D GEOMETRY */}
        <div
          className="relative group cursor-pointer transition-transform duration-200"
          style={{ transform: `translateZ(${zAvatar}px)`, transformStyle: 'preserve-3d' }}
        >
          {isExploded && (
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              [STRATUM 2: {customMesh.type === 'gem' ? 'GEM CRYSTAL' : customMesh.type === 'cube' ? 'CYBER CUBE' : customMesh.type === 'custom' ? 'CUSTOM MESH' : 'AVATAR ORB'}]
            </span>
          )}

          {renderHeroAvatarGeometry()}

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
