/* oxlint-disable react/only-export-components */
import React from 'react';

/**
 * CameraCubePreview
 * Prominent 3D cube rendered in pure CSS 3D displaying the exact camera viewing angle.
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
      className={`w-24 h-20 sm:w-28 sm:h-24 flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ perspective: '280px' }}
      aria-hidden="true"
    >
      <div
        className="w-12 h-12 relative transition-transform duration-300 ease-out threed-preserve"
        style={{ transform }}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 dark:from-cyan-500 dark:to-blue-800 border-2 border-white/70 flex flex-col items-center justify-center shadow-md text-[8.5px] font-mono font-black text-white tracking-wider"
          style={{ transform: 'translateZ(24px)' }}
        >
          <span>{presetId === 'eye-level' ? 'EYE' : 'FRONT'}</span>
          <span className="text-[6.5px] font-mono font-medium opacity-80">Z+</span>
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 bg-blue-950 border border-blue-400/50 text-[8px] font-mono font-bold text-blue-200/70 flex items-center justify-center"
          style={{ transform: 'rotateY(180deg) translateZ(24px)' }}
        >
          BACK
        </div>

        {/* Top Face */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-cyan-200 via-cyan-300 to-cyan-500 dark:from-cyan-300 dark:to-cyan-600 border-2 border-white/80 flex flex-col items-center justify-center text-[8.5px] font-mono font-black text-cyan-950 shadow-inner"
          style={{ transform: 'rotateX(90deg) translateZ(24px)' }}
        >
          <span>{presetId === 'top-down' ? 'TOP-DOWN' : 'TOP'}</span>
          <span className="text-[6.5px] font-mono font-semibold opacity-70">Y+</span>
        </div>

        {/* Bottom Face */}
        <div
          className="absolute inset-0 bg-stone-900 border border-stone-700/60"
          style={{ transform: 'rotateX(-90deg) translateZ(24px)' }}
        />

        {/* Right Face */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 border border-white/50 text-[8px] font-mono font-bold text-white flex items-center justify-center"
          style={{ transform: 'rotateY(90deg) translateZ(24px)' }}
        >
          RIGHT
        </div>

        {/* Left Face */}
        <div
          className="absolute inset-0 bg-cyan-700 border border-cyan-400/50 text-[8px] font-mono font-bold text-white/90 flex items-center justify-center"
          style={{ transform: 'rotateY(-90deg) translateZ(24px)' }}
        >
          LEFT
        </div>

        {/* Ground Projection Shadow */}
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-black/35 dark:bg-black/60 blur-[6px]"
          style={{ transform: 'rotateX(90deg) translateZ(-28px)' }}
        />
      </div>
    </div>
  );
}

/**
 * MaterialShaderSphere
 * Prominent, photo-realistic 3D sphere displaying the exact material surface, specular reflections & refraction.
 * Matches realistic iron/aluminum chrome, pure refractive acrylic glass, velvety tactile clay, and sci-fi cyber wireframe.
 * Dynamically reacts in real-time to lighting angle, specular glow, and bevel sliders.
 */
export function MaterialShaderSphere({
  materialId = 'glass-acrylic',
  lightingAngle = 45,
  specularGlow = 0.6,
  bevelExtrusion = 3,
  className = ''
}) {
  const rad = ((lightingAngle ?? 45) * Math.PI) / 180;
  // Dynamic polar coordinates for highlight on a sphere (radius ~24% from center 50%)
  const specX = Math.round(50 + 26 * Math.cos(rad));
  const specY = Math.round(50 - 26 * Math.sin(rad));
  // Ground shadow is opposite to the light source
  const shadowOffsetX = Math.round(-18 * Math.cos(rad));
  const shadowOffsetY = Math.round(12 * Math.sin(rad));

  if (materialId === 'glass-acrylic') {
    return (
      <div className={`relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center select-none pointer-events-none ${className}`} aria-hidden="true">
        {/* Soft Ambient Caustic Underglow */}
        <div className="absolute inset-1 rounded-full bg-[#FF4D6D]/20 blur-md transition-all duration-150" />
        
        {/* Contact Drop Shadow moving opposite to light source */}
        <div
          className="absolute -bottom-1 w-16 h-3 rounded-full bg-black/25 dark:bg-black/50 blur-[3px] transition-all duration-150"
          style={{ transform: `translate(${shadowOffsetX}px, ${shadowOffsetY * 0.2}px)` }}
        />

        {/* Refractive Glass Sphere Base */}
        <div
          className="w-16 h-16 sm:w-18 sm:h-18 rounded-full relative overflow-hidden backdrop-blur-lg border-2 border-white/90 dark:border-white/50 shadow-[0_8px_20px_rgba(255,77,109,0.3),inset_0_0_20px_rgba(255,255,255,0.7),inset_0_-8px_16px_rgba(255,77,109,0.35)]"
          style={{
            background: `radial-gradient(circle at ${specX}% ${specY}%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 15%, rgba(255,77,109,0.3) 45%, rgba(168,85,247,0.25) 75%, rgba(30,10,50,0.4) 100%)`
          }}
        >
          {/* Primary Curved Specular Glint positioned dynamically */}
          <div
            className="absolute w-6 h-3.5 rounded-full bg-white/95 blur-[0.4px] shadow-sm transition-all duration-100"
            style={{
              left: `${specX - 12}%`,
              top: `${specY - 8}%`,
              transform: `rotate(${lightingAngle - 60}deg)`
            }}
          />
          
          {/* Secondary Pinpoint Reflection */}
          <div
            className="absolute w-1.5 h-1.5 rounded-full bg-white/90 blur-[0.2px] transition-all duration-100"
            style={{
              left: `${specX - 4}%`,
              top: `${specY + 12}%`
            }}
          />

          {/* Internal Fresnel Refraction Ring */}
          <div className="absolute inset-1.5 rounded-full border border-white/40 shadow-inner" />
          
          {/* Bottom Internal Caustic Rim */}
          <div className="absolute -bottom-2 inset-x-2 h-6 rounded-full bg-gradient-to-t from-white/60 to-transparent blur-[1px]" />
        </div>
      </div>
    );
  }

  if (materialId === 'metallic-gloss') {
    return (
      <div className={`relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center select-none pointer-events-none ${className}`} aria-hidden="true">
        {/* Contact Shadow */}
        <div
          className="absolute -bottom-1 w-16 h-3 rounded-full bg-black/40 dark:bg-black/70 blur-[3px] transition-all duration-150"
          style={{ transform: `translate(${shadowOffsetX}px, ${shadowOffsetY * 0.2}px)` }}
        />

        {/* Polished Metal / Aluminum Chrome Sphere Base with dynamic conic angle */}
        <div
          className="w-16 h-16 sm:w-18 sm:h-18 rounded-full relative overflow-hidden border border-slate-300 dark:border-slate-500 shadow-[0_8px_24px_rgba(0,0,0,0.35),inset_0_3px_6px_rgba(255,255,255,0.95),inset_0_-6px_12px_rgba(0,0,0,0.6)]"
          style={{
            background: `conic-gradient(from ${lightingAngle + 150}deg at 50% 50%, #e2e8f0 0deg, #94a3b8 45deg, #f8fafc 90deg, #475569 150deg, #1e293b 180deg, #94a3b8 220deg, #ffffff 270deg, #64748b 320deg, #e2e8f0 360deg)`
          }}
        >
          {/* Realistic Anisotropic Chrome Horizon Line rotating with lighting angle */}
          <div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-slate-900/60 to-transparent blur-[0.6px] transition-transform duration-100"
            style={{ transform: `translateY(-50%) rotate(${lightingAngle - 90}deg)` }}
          />
          
          {/* Sharp High-Gloss Specular Highlight Arc rotating with light */}
          <div
            className="absolute w-6 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] transition-all duration-100"
            style={{
              left: `${specX - 12}%`,
              top: `${specY - 6}%`,
              transform: `rotate(${lightingAngle - 60}deg)`
            }}
          />
          
          {/* Secondary Pinpoint Glint */}
          <div
            className="absolute w-2 h-2 rounded-full bg-white/95 transition-all duration-100"
            style={{
              left: `${specX - 3}%`,
              top: `${specY + 10}%`
            }}
          />

          {/* Deep Ambient Reflection Edge */}
          <div className="absolute inset-0 rounded-full shadow-[inset_0_-4px_8px_rgba(15,23,42,0.7)]" />
        </div>
      </div>
    );
  }

  if (materialId === 'neumorphic-clay') {
    return (
      <div className={`relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center select-none pointer-events-none ${className}`} aria-hidden="true">
        {/* Soft Diffuse Drop Shadow */}
        <div
          className="absolute -bottom-1 w-16 h-3 rounded-full bg-stone-900/20 dark:bg-black/50 blur-[4px] transition-all duration-150"
          style={{ transform: `translate(${shadowOffsetX}px, ${shadowOffsetY * 0.2}px)` }}
        />

        {/* Velvety Matte Clay Sphere with dynamic lighting source */}
        <div
          className="w-16 h-16 sm:w-18 sm:h-18 rounded-full relative border border-stone-200/70 dark:border-stone-700/70 shadow-[6px_8px_16px_rgba(0,0,0,0.14),-4px_-4px_12px_rgba(255,255,255,0.9),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-4px_-4px_8px_rgba(0,0,0,0.2)] dark:shadow-[6px_8px_16px_rgba(0,0,0,0.65),-4px_-4px_10px_rgba(255,255,255,0.08),inset_4px_4px_8px_rgba(255,255,255,0.2),inset_-4px_-4px_8px_rgba(0,0,0,0.5)]"
          style={{
            background: `radial-gradient(circle at ${specX}% ${specY}%, #fafaf9 0%, #e7e5e4 55%, #d6d3d1 85%, #a8a29e 100%)`
          }}
        >
          {/* Soft Velvet Diffuse Area following light */}
          <div
            className="absolute w-6 h-6 rounded-full bg-white/60 blur-[3px] transition-all duration-100"
            style={{
              left: `${specX - 10}%`,
              top: `${specY - 10}%`
            }}
          />
          {/* Deep Ambient Occlusion Rim opposite light */}
          <div
            className="absolute w-8 h-8 rounded-full bg-stone-900/15 dark:bg-black/30 blur-[4px] transition-all duration-100"
            style={{
              left: `${100 - specX - 10}%`,
              top: `${100 - specY - 10}%`
            }}
          />
        </div>
      </div>
    );
  }

  // cyber-wireframe
  return (
    <div className={`relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center select-none pointer-events-none ${className}`} aria-hidden="true">
      {/* Cyan Wireframe Glow Halo */}
      <div className="absolute inset-1 rounded-full bg-cyan-500/25 blur-md animate-pulse" />
      
      {/* Contact Shadow */}
      <div
        className="absolute -bottom-1 w-16 h-3 rounded-full bg-cyan-950/40 blur-[3px] transition-all duration-150"
        style={{ transform: `translate(${shadowOffsetX}px, ${shadowOffsetY * 0.2}px)` }}
      />

      {/* Cyber Substrate Sphere */}
      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full relative overflow-hidden bg-black/90 border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.5),inset_0_0_14px_rgba(0,242,254,0.4)] flex items-center justify-center">
        {/* Latitude Rings */}
        <div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-cyan-400 shadow-[0_0_6px_#00F2FE] transition-transform duration-100"
          style={{ transform: `translateY(-50%) rotate(${lightingAngle - 90}deg)` }}
        />
        <div className="absolute inset-x-2 top-3 h-[1px] bg-cyan-400/70" />
        <div className="absolute inset-x-2 bottom-3 h-[1px] bg-cyan-400/70" />
        
        {/* Longitude Ovals */}
        <div className="w-7 h-14 rounded-[50%] border-2 border-cyan-400 shadow-[0_0_6px_#00F2FE]" />
        <div className="absolute w-12 h-14 rounded-[50%] border border-cyan-400/50" />

        {/* Center Luminous Core */}
        <div className="absolute w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_10px_#00F2FE] animate-ping" />
      </div>
    </div>
  );
}

/**
 * ThemeExtrudedSlab
 * Prominent 3D isometric extruded slab displaying the theme's lighting, material and elevation.
 */
export function ThemeExtrudedSlab({
  themeId = 'apple-glass',
  lightingAngle = 45,
  depthIntensity = 1.0,
  bevelExtrusion = 3,
  className = ''
}) {
  const rimHeight = Math.max(2, Math.min(8, Math.round(2.5 * depthIntensity + bevelExtrusion * 0.3)));
  const themeVisuals = {
    'apple-glass': {
      top: 'bg-gradient-to-r from-pink-500/25 via-purple-500/25 to-cyan-500/25 backdrop-blur-md border-2 border-white/80 dark:border-white/40',
      edge: 'bg-pink-600/50 border-t border-pink-400/60',
      glow: 'shadow-[0_12px_24px_rgba(255,77,109,0.3)]',
      accent: 'bg-pink-400 shadow-[0_0_8px_#FF4D6D]'
    },
    'cyber-neon': {
      top: 'bg-[#0E0918] border-2 border-cyan-400 shadow-[inset_0_0_12px_rgba(0,242,254,0.5)]',
      edge: 'bg-cyan-600 border-t border-cyan-300',
      glow: 'shadow-[0_12px_24px_rgba(0,242,254,0.35)]',
      accent: 'bg-cyan-400 shadow-[0_0_10px_#00F2FE]'
    },
    'studio-matte': {
      top: 'bg-stone-100 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-600 shadow-inner',
      edge: 'bg-stone-400 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-700',
      glow: 'shadow-[0_8px_16px_rgba(0,0,0,0.18)]',
      accent: 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]'
    },
    'floating-hologram': {
      top: 'bg-gradient-to-tr from-blue-600/40 to-indigo-600/40 backdrop-blur-md border-2 border-blue-400',
      edge: 'bg-blue-700 border-t border-blue-300',
      glow: 'shadow-[0_14px_28px_rgba(59,130,246,0.4)]',
      accent: 'bg-blue-400 shadow-[0_0_10px_#3B82F6]'
    },
    'obsidian-gold': {
      top: 'bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border-2 border-amber-400/80 shadow-[inset_0_0_12px_rgba(245,158,11,0.3)]',
      edge: 'bg-amber-700 border-t border-amber-300',
      glow: 'shadow-[0_12px_24px_rgba(245,158,11,0.35)]',
      accent: 'bg-amber-400 shadow-[0_0_10px_#F59E0B]'
    },
    'retro-synthwave': {
      top: 'bg-gradient-to-tr from-fuchsia-950 via-purple-900/60 to-cyan-950 border-2 border-fuchsia-500 shadow-[inset_0_0_12px_rgba(217,70,239,0.5)]',
      edge: 'bg-fuchsia-700 border-t border-pink-400',
      glow: 'shadow-[0_12px_24px_rgba(217,70,239,0.4)]',
      accent: 'bg-pink-500 shadow-[0_0_10px_#EC4899]'
    },
    'tokyo-midnight': {
      top: 'bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 border-2 border-indigo-400 shadow-[inset_0_0_10px_rgba(99,102,241,0.4)]',
      edge: 'bg-indigo-700 border-t border-indigo-300',
      glow: 'shadow-[0_12px_24px_rgba(99,102,241,0.35)]',
      accent: 'bg-indigo-400 shadow-[0_0_8px_#818CF8]'
    },
    'emerald-matrix': {
      top: 'bg-[#04140D] border-2 border-emerald-400 shadow-[inset_0_0_14px_rgba(16,185,129,0.5)]',
      edge: 'bg-emerald-700 border-t border-emerald-300',
      glow: 'shadow-[0_12px_24px_rgba(16,185,129,0.4)]',
      accent: 'bg-emerald-400 shadow-[0_0_10px_#10B981]'
    },
    'sunset-bloom': {
      top: 'bg-gradient-to-r from-orange-500/30 via-rose-500/30 to-purple-600/30 backdrop-blur-md border-2 border-rose-300/80',
      edge: 'bg-rose-600/60 border-t border-rose-300',
      glow: 'shadow-[0_12px_24px_rgba(244,63,94,0.35)]',
      accent: 'bg-rose-400 shadow-[0_0_8px_#F43F5E]'
    },
    'nordic-frost': {
      top: 'bg-gradient-to-br from-sky-400/20 via-cyan-300/25 to-blue-500/20 backdrop-blur-md border-2 border-cyan-200/90',
      edge: 'bg-sky-600/50 border-t border-cyan-200',
      glow: 'shadow-[0_12px_24px_rgba(56,189,248,0.35)]',
      accent: 'bg-sky-300 shadow-[0_0_8px_#38BDF8]'
    },
    'crimson-stealth': {
      top: 'bg-stone-950 border-2 border-red-600 shadow-[inset_0_0_14px_rgba(239,68,68,0.45)]',
      edge: 'bg-red-800 border-t border-red-500',
      glow: 'shadow-[0_12px_24px_rgba(220,38,38,0.4)]',
      accent: 'bg-red-500 shadow-[0_0_10px_#EF4444]'
    },
    'champagne-quartz': {
      top: 'bg-gradient-to-tr from-amber-100/30 via-rose-100/25 to-amber-200/30 backdrop-blur-md border-2 border-amber-200/80',
      edge: 'bg-amber-600/50 border-t border-amber-200',
      glow: 'shadow-[0_12px_24px_rgba(251,191,36,0.3)]',
      accent: 'bg-amber-300 shadow-[0_0_8px_#FCD34D]'
    },
    'cosmic-void': {
      top: 'bg-[#05030A] border-2 border-violet-500/70 shadow-[inset_0_0_14px_rgba(139,92,246,0.4)]',
      edge: 'bg-violet-900 border-t border-violet-400',
      glow: 'shadow-[0_12px_24px_rgba(139,92,246,0.35)]',
      accent: 'bg-violet-400 shadow-[0_0_8px_#A78BFA]'
    },
    'solar-flare': {
      top: 'bg-gradient-to-r from-amber-500/40 via-orange-600/40 to-red-600/40 backdrop-blur-md border-2 border-orange-400',
      edge: 'bg-orange-700 border-t border-amber-300',
      glow: 'shadow-[0_12px_24px_rgba(249,115,22,0.4)]',
      accent: 'bg-amber-400 shadow-[0_0_10px_#F59E0B]'
    },
    'vaporwave-dream': {
      top: 'bg-gradient-to-tr from-teal-400/30 via-pink-400/30 to-purple-400/30 backdrop-blur-md border-2 border-pink-300/80',
      edge: 'bg-pink-500/60 border-t border-teal-200',
      glow: 'shadow-[0_12px_24px_rgba(236,72,153,0.35)]',
      accent: 'bg-teal-300 shadow-[0_0_8px_#2DD4BF]'
    },
    'liquid-titanium': {
      top: 'bg-gradient-to-r from-slate-300/40 via-zinc-200/50 to-slate-400/40 backdrop-blur-md border-2 border-slate-200 shadow-[inset_0_0_10px_rgba(255,255,255,0.7)]',
      edge: 'bg-slate-500 border-t border-slate-200',
      glow: 'shadow-[0_12px_24px_rgba(148,163,184,0.35)]',
      accent: 'bg-cyan-200 shadow-[0_0_8px_#A5F3FC]'
    }
  };

  const style = themeVisuals[themeId] || themeVisuals['apple-glass'];

  return (
    <div
      className={`w-28 h-20 sm:w-32 sm:h-22 flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ perspective: '260px' }}
      aria-hidden="true"
    >
      <div
        className="w-20 h-10 relative threed-preserve transition-transform duration-200"
        style={{ transform: 'rotateX(4deg) rotateY(0deg)' }}
      >
        {/* Top Surface */}
        <div
          className={`absolute inset-0 rounded-xl ${style.top} ${style.glow} flex items-center justify-center`}
          style={{
            transform: `translateZ(${rimHeight * 2}px)`,
            boxShadow: `0 ${rimHeight * 1.5}px ${rimHeight * 3}px rgba(0,0,0,0.18), inset 0 1px 2px rgba(255,255,255,0.7), inset 0 -1.5px 3px rgba(0,0,0,0.2)`
          }}
        >
          <span className={`w-3.5 h-3.5 rounded-full ${style.accent}`} />
        </div>

        {/* 3D Extruded Front/Bottom Rim scaling with depth and bevel */}
        <div
          className={`absolute inset-x-0 -bottom-1 rounded-b-xl ${style.edge} shadow-md`}
          style={{
            height: `${rimHeight + 2}px`,
            transform: `translateZ(${rimHeight * 0.8}px)`
          }}
        />

        {/* Cast Floor Shadow */}
        <div
          className="absolute -bottom-2 inset-x-1 h-7 rounded-xl bg-black/25 dark:bg-black/60 blur-[5px]"
          style={{ transform: 'translateZ(-6px)' }}
        />
      </div>
    </div>
  );
}

/**
 * LightingVectorPreview
 * Prominent 3D directional light source angle and real-time shadow projection on a mini pillar.
 * Dynamically orbits the sun and projects the floor shadow opposite to lightingAngle.
 */
export function LightingVectorPreview({
  presetId = 'studio-soft',
  lightingAngle = 45,
  className = ''
}) {
  const rad = ((lightingAngle ?? 45) * Math.PI) / 180;
  // Sun orbits around center (radius 36%)
  const sunX = Math.round(50 + 36 * Math.cos(rad));
  const sunY = Math.round(50 - 32 * Math.sin(rad));
  // Shadow projects opposite to sun
  const shadowX = Math.round(-24 * Math.cos(rad));
  const shadowY = Math.round(16 * Math.sin(rad));

  const configs = {
    'studio-soft': {
      sunColor: 'bg-amber-400 text-amber-500 shadow-[0_0_12px_rgba(251,191,36,0.8)]',
      shadowStyle: 'bg-black/25 blur-[2px]',
      pillarGrad: 'from-amber-100 via-stone-200 to-stone-400 dark:from-stone-600 dark:to-stone-800'
    },
    sunset: {
      sunColor: 'bg-orange-500 text-orange-600 shadow-[0_0_14px_rgba(249,115,22,0.9)]',
      shadowStyle: 'bg-orange-950/40 blur-[3px]',
      pillarGrad: 'from-orange-200 via-amber-300 to-stone-600 dark:from-orange-900/60 dark:to-stone-800'
    },
    'cyber-neon': {
      sunColor: 'bg-cyan-400 text-cyan-300 shadow-[0_0_16px_#00F2FE]',
      shadowStyle: 'bg-purple-900/50 blur-[2px]',
      pillarGrad: 'from-cyan-300 via-blue-500 to-indigo-800 dark:from-cyan-700 dark:to-indigo-950'
    }
  };

  const cfg = configs[presetId] || configs['studio-soft'];

  return (
    <div className={`w-24 h-20 sm:w-28 sm:h-22 relative flex items-center justify-center select-none pointer-events-none ${className}`} aria-hidden="true">
      {/* Light Source (Sun/Spotlight) dynamically positioned */}
      <div
        className={`absolute w-5 h-5 rounded-full ${cfg.sunColor} animate-pulse flex items-center justify-center transition-all duration-100`}
        style={{ left: `${sunX - 10}%`, top: `${sunY - 10}%` }}
      >
        <div className="w-2 h-2 rounded-full bg-white" />
      </div>

      {/* 3D Directional Light Ray towards center pillar */}
      <div
        className="absolute w-12 h-[1px] bg-gradient-to-l from-white/50 to-transparent pointer-events-none transition-all duration-100"
        style={{
          left: `${(sunX + 50) / 2 - 24}%`,
          top: `${(sunY + 50) / 2}%`,
          transform: `rotate(${lightingAngle - 180}deg)`
        }}
      />

      {/* 3D Central Pillar Object */}
      <div className={`w-6 h-10 rounded-md bg-gradient-to-r ${cfg.pillarGrad} border border-white/60 dark:border-stone-500 relative z-10 shadow-md`} />

      {/* Cast Shadow on Floor projecting opposite to sun */}
      <div
        className={`absolute w-12 h-4 ${cfg.shadowStyle} rounded-full pointer-events-none transition-all duration-100`}
        style={{
          left: '50%',
          bottom: '12%',
          transform: `translate(calc(-50% + ${shadowX}px), ${shadowY * 0.2}px) rotate(${lightingAngle - 90}deg)`
        }}
      />
    </div>
  );
}

export default CameraCubePreview;
