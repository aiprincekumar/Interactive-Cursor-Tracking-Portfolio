/* oxlint-disable react/only-export-components */
import React from 'react';

/**
 * CameraCubePreview
 * Miniature 3D cube rendered in pure CSS 3D displaying the exact camera viewing angle.
 */
export function CameraCubePreview({ presetId = 'isometric', className = '' }) {
  // Preset rotation angles for the camera cube
  const cameraTransforms = {
    isometric: 'rotateX(60deg) rotateZ(-45deg)',
    'top-down': 'rotateX(85deg) rotateZ(0deg)',
    'eye-level': 'rotateX(0deg) rotateY(0deg)',
    cinematic: 'rotateX(25deg) rotateY(-28deg)'
  };

  const transform = cameraTransforms[presetId] || cameraTransforms.isometric;

  return (
    <div
      className={`w-16 h-12 flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ perspective: '220px' }}
      aria-hidden="true"
    >
      <div
        className="w-7 h-7 relative transition-transform duration-300 ease-out threed-preserve"
        style={{ transform }}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-cyan-400/80 to-blue-600/90 dark:from-cyan-500/80 dark:to-blue-700/90 border border-white/60 flex items-center justify-center shadow-xs text-[7px] font-mono font-bold text-white"
          style={{ transform: 'translateZ(14px)' }}
        >
          {presetId === 'eye-level' ? '🎯 EYE' : 'FRONT'}
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 bg-blue-900/80 border border-blue-400/40 text-[7px] font-mono text-blue-200/60 flex items-center justify-center"
          style={{ transform: 'rotateY(180deg) translateZ(14px)' }}
        >
          BACK
        </div>

        {/* Top Face */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-cyan-200 to-cyan-400 dark:from-cyan-300 dark:to-cyan-600 border border-white/70 flex items-center justify-center text-[7px] font-mono font-bold text-cyan-950 shadow-inner"
          style={{ transform: 'rotateX(90deg) translateZ(14px)' }}
        >
          {presetId === 'top-down' ? '👁️ TOP' : 'TOP'}
        </div>

        {/* Bottom Face */}
        <div
          className="absolute inset-0 bg-stone-800/80 border border-stone-600/40"
          style={{ transform: 'rotateX(-90deg) translateZ(14px)' }}
        />

        {/* Right Face */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-700 border border-white/40 text-[7px] font-mono text-white/90 flex items-center justify-center"
          style={{ transform: 'rotateY(90deg) translateZ(14px)' }}
        >
          R
        </div>

        {/* Left Face */}
        <div
          className="absolute inset-0 bg-cyan-600/80 border border-cyan-400/40 text-[7px] font-mono text-white/80 flex items-center justify-center"
          style={{ transform: 'rotateY(-90deg) translateZ(14px)' }}
        >
          L
        </div>

        {/* Ground Projection Shadow */}
        <div
          className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black/25 dark:bg-black/50 blur-[3px]"
          style={{ transform: 'rotateX(90deg) translateZ(-16px)' }}
        />
      </div>
    </div>
  );
}

/**
 * MaterialShaderSphere
 * Photo-realistic 3D sphere displaying the exact material surface, specular highlights & refraction.
 */
export function MaterialShaderSphere({ materialId = 'glass-acrylic', className = '' }) {
  if (materialId === 'glass-acrylic') {
    return (
      <div className={`relative w-11 h-11 flex items-center justify-center ${className}`} aria-hidden="true">
        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-[#FF4D6D]/15 blur-sm" />
        {/* Sphere Base */}
        <div
          className="w-9 h-9 rounded-full relative overflow-hidden backdrop-blur-md border border-white/80 dark:border-white/40 shadow-[0_4px_10px_rgba(255,77,109,0.2),inset_0_0_12px_rgba(255,255,255,0.6)]"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.85) 0%, rgba(255,77,109,0.25) 45%, rgba(168,85,247,0.2) 75%, rgba(0,0,0,0.15) 100%)'
          }}
        >
          {/* Specular Highlight Arc */}
          <div className="absolute top-1.5 left-2 w-3.5 h-2 rounded-full bg-white/90 rotate-[-25deg] blur-[0.4px]" />
          {/* Internal Refraction Ring */}
          <div className="absolute inset-1 rounded-full border border-white/30" />
        </div>
      </div>
    );
  }

  if (materialId === 'metallic-gloss') {
    return (
      <div className={`relative w-11 h-11 flex items-center justify-center ${className}`} aria-hidden="true">
        {/* Sphere Base */}
        <div
          className="w-9 h-9 rounded-full relative overflow-hidden border border-slate-300 dark:border-slate-500 shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_2px_4px_rgba(255,255,255,0.9)]"
          style={{
            background: 'conic-gradient(from 180deg at 50% 50%, #e2e8f0 0deg, #94a3b8 60deg, #f8fafc 120deg, #475569 180deg, #f8fafc 240deg, #64748b 300deg, #e2e8f0 360deg)'
          }}
        >
          {/* Chrome Horizon Line */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-black/40 blur-[0.5px]" />
          {/* Sharp High-Gloss Highlight */}
          <div className="absolute top-1.5 left-2 w-3.5 h-1.5 rounded-full bg-white shadow-xs rotate-[-30deg]" />
          {/* Metallic Rim Glow */}
          <div className="absolute inset-0 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.5)]" />
        </div>
      </div>
    );
  }

  if (materialId === 'neumorphic-clay') {
    return (
      <div className={`relative w-11 h-11 flex items-center justify-center ${className}`} aria-hidden="true">
        {/* Clay Sphere */}
        <div
          className="w-9 h-9 rounded-full relative border border-stone-200/60 dark:border-stone-700/60 shadow-[3px_4px_8px_rgba(0,0,0,0.12),-2px_-2px_6px_rgba(255,255,255,0.8),inset_2px_2px_4px_rgba(255,255,255,0.6),inset_-2px_-2px_4px_rgba(0,0,0,0.15)] dark:shadow-[3px_4px_8px_rgba(0,0,0,0.6),-2px_-2px_6px_rgba(255,255,255,0.06),inset_2px_2px_4px_rgba(255,255,255,0.15),inset_-2px_-2px_4px_rgba(0,0,0,0.4)]"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #fafaf9 0%, #e7e5e4 60%, #d6d3d1 100%)'
          }}
        >
          {/* Soft Velvet Diffuse */}
          <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-white/40 blur-[1px]" />
        </div>
      </div>
    );
  }

  // cyber-wireframe
  return (
    <div className={`relative w-11 h-11 flex items-center justify-center ${className}`} aria-hidden="true">
      {/* Cyan Wireframe Glow */}
      <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-sm animate-pulse" />
      <div className="w-9 h-9 rounded-full relative overflow-hidden bg-black/80 border border-cyan-400/80 shadow-[0_0_12px_rgba(0,242,254,0.4),inset_0_0_8px_rgba(0,242,254,0.3)] flex items-center justify-center">
        {/* Latitude Wireframe Rings */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-cyan-400 shadow-[0_0_4px_#00F2FE]" />
        <div className="absolute inset-x-1 top-2 h-[1px] bg-cyan-400/60" />
        <div className="absolute inset-x-1 bottom-2 h-[1px] bg-cyan-400/60" />
        {/* Longitude Oval */}
        <div className="w-4 h-8 rounded-[50%] border border-cyan-400 shadow-[0_0_4px_#00F2FE]" />
      </div>
    </div>
  );
}

/**
 * ThemeExtrudedSlab
 * 3D isometric extruded slab displaying the theme's lighting, material and elevation.
 */
export function ThemeExtrudedSlab({ themeId = 'apple-glass', className = '' }) {
  const themeVisuals = {
    'apple-glass': {
      top: 'bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 backdrop-blur-md border border-white/80 dark:border-white/30',
      edge: 'bg-pink-600/40',
      glow: 'shadow-[0_8px_16px_rgba(255,77,109,0.25)]'
    },
    'cyber-neon': {
      top: 'bg-[#0E0918] border border-cyan-400 shadow-[inset_0_0_8px_rgba(0,242,254,0.4)]',
      edge: 'bg-cyan-600',
      glow: 'shadow-[0_8px_16px_rgba(0,242,254,0.3)]'
    },
    'studio-matte': {
      top: 'bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 shadow-inner',
      edge: 'bg-stone-400 dark:bg-stone-900',
      glow: 'shadow-[0_6px_12px_rgba(0,0,0,0.15)]'
    },
    'floating-hologram': {
      top: 'bg-gradient-to-tr from-blue-600/40 to-indigo-600/40 backdrop-blur-md border border-blue-400',
      edge: 'bg-blue-700',
      glow: 'shadow-[0_10px_20px_rgba(59,130,246,0.35)]'
    }
  };

  const style = themeVisuals[themeId] || themeVisuals['apple-glass'];

  return (
    <div
      className={`w-20 h-11 flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ perspective: '220px' }}
      aria-hidden="true"
    >
      <div
        className="w-14 h-7 relative threed-preserve transition-transform duration-200"
        style={{ transform: 'rotateX(55deg) rotateZ(-30deg)' }}
      >
        {/* Top Surface */}
        <div
          className={`absolute inset-0 rounded-lg ${style.top} ${style.glow} flex items-center justify-center`}
          style={{ transform: 'translateZ(6px)' }}
        >
          <span className="w-2 h-2 rounded-full bg-white/70 shadow-xs" />
        </div>

        {/* 3D Extruded Front Rim */}
        <div
          className={`absolute inset-x-0 bottom-0 h-1.5 rounded-b-lg ${style.edge}`}
          style={{ transform: 'rotateX(-90deg) translateZ(3px)' }}
        />

        {/* Cast Shadow */}
        <div
          className="absolute -bottom-2 inset-x-1 h-6 rounded-lg bg-black/20 dark:bg-black/50 blur-[2px]"
          style={{ transform: 'translateZ(-4px)' }}
        />
      </div>
    </div>
  );
}

/**
 * LightingVectorPreview
 * 3D directional light source angle and real-time shadow projection on a mini pillar.
 */
export function LightingVectorPreview({ presetId = 'studio-soft', className = '' }) {
  const configs = {
    'studio-soft': {
      sunPos: 'top-1 right-2',
      sunColor: 'bg-amber-400 text-amber-500',
      shadowStyle: 'w-6 h-3 -bottom-1 -left-1 bg-black/20 blur-[1px]'
    },
    sunset: {
      sunPos: 'top-3 right-0',
      sunColor: 'bg-orange-500 text-orange-600',
      shadowStyle: 'w-10 h-2.5 -bottom-1 -left-3 bg-orange-950/30 blur-[2px]'
    },
    'cyber-neon': {
      sunPos: 'top-0 right-1',
      sunColor: 'bg-cyan-400 text-cyan-300 shadow-[0_0_6px_#00F2FE]',
      shadowStyle: 'w-7 h-2.5 -bottom-1 -left-2 bg-purple-900/40 blur-[1.5px]'
    }
  };

  const cfg = configs[presetId] || configs['studio-soft'];

  return (
    <div className={`w-14 h-10 relative flex items-center justify-center select-none ${className}`} aria-hidden="true">
      {/* Light Source (Sun/Spotlight) */}
      <div className={`absolute ${cfg.sunPos} w-3 h-3 rounded-full ${cfg.sunColor} animate-pulse`} />

      {/* 3D Pillar Object */}
      <div className="w-4 h-6 rounded-sm bg-gradient-to-r from-stone-200 to-stone-400 dark:from-stone-600 dark:to-stone-800 border border-white/50 dark:border-stone-500 relative z-10 shadow-xs" />

      {/* Cast Shadow on Floor */}
      <div className={`absolute ${cfg.shadowStyle} rounded-full rotate-[-15deg] pointer-events-none`} />
    </div>
  );
}

export default CameraCubePreview;
