/* oxlint-disable react/only-export-components */
import React from 'react';

/**
 * SpringElasticityVisual
 * Prominent 3D kinetic spring cylinder displaying the damping and oscillation physics of the elasticity preset.
 */
export function SpringElasticityVisual({ presetId = 'rigid', className = '' }) {
  const configs = {
    rigid: {
      label: '0 OSC (RIGID)',
      barColor: 'bg-stone-500 dark:bg-stone-400',
      springAnimation: '',
      glow: ''
    },
    snappy: {
      label: '1-2 OSC (SNAPPY)',
      barColor: 'bg-amber-500',
      springAnimation: 'animate-pulse duration-500',
      glow: 'shadow-[0_0_8px_rgba(245,158,11,0.5)]'
    },
    fluid: {
      label: 'DAMPED (FLUID)',
      barColor: 'bg-cyan-500',
      springAnimation: 'animate-bounce duration-1000',
      glow: 'shadow-[0_0_8px_rgba(6,182,212,0.5)]'
    },
    bouncy: {
      label: '4+ OSC (BOUNCY)',
      barColor: 'bg-[#FF4D6D]',
      springAnimation: 'animate-bounce duration-500',
      glow: 'shadow-[0_0_12px_rgba(255,77,109,0.7)]'
    }
  };

  const cfg = configs[presetId] || configs.rigid;

  return (
    <div
      className={`w-24 h-20 sm:w-28 sm:h-24 flex flex-col items-center justify-center select-none pointer-events-none relative ${className}`}
      aria-hidden="true"
    >
      {/* 3D Kinetic Piston Head */}
      <div
        className={`w-14 h-4 rounded-t-md bg-gradient-to-r from-stone-200 via-stone-300 to-stone-400 dark:from-stone-500 dark:via-stone-600 dark:to-stone-700 border-2 border-white/70 dark:border-stone-400 shadow-md flex items-center justify-center transition-transform duration-200 ${cfg.springAnimation}`}
      >
        <div className="w-8 h-1 rounded-full bg-white/80" />
      </div>

      {/* Heavy 3D Spring Coils */}
      <div className="w-8 h-8 flex flex-col justify-between items-center py-1 relative">
        <div className={`w-8 h-[3px] rounded-full ${cfg.barColor} ${cfg.glow} shadow-sm`} />
        <div className={`w-9 h-[3px] rounded-full ${cfg.barColor} ${cfg.glow} ml-1.5 shadow-sm`} />
        <div className={`w-9 h-[3px] rounded-full ${cfg.barColor} ${cfg.glow} -ml-1.5 shadow-sm`} />
        <div className={`w-8 h-[3px] rounded-full ${cfg.barColor} ${cfg.glow} shadow-sm`} />
      </div>

      {/* 3D Base Pedestal */}
      <div className="w-16 h-4 rounded-b-md bg-gradient-to-r from-stone-400 to-stone-500 dark:from-stone-700 dark:to-stone-800 border-t-2 border-stone-300 dark:border-stone-600 shadow-md flex items-center justify-center">
        <span className="text-[8px] font-mono font-black text-white tracking-wider leading-none">
          {cfg.label}
        </span>
      </div>

      {/* Floor Contact Shadow */}
      <div className="w-16 h-2 rounded-full bg-black/20 dark:bg-black/50 blur-[2px] mt-0.5" />
    </div>
  );
}

/**
 * ExplodedCADLayerVisual
 * 3D isometric strata stack showing layers separating into exploded space upon toggle.
 */
export function ExplodedCADLayerVisual({
  isExploded = false,
  isBlueprint = false,
  className = ''
}) {
  return (
    <div
      className={`w-20 h-14 flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ perspective: '240px' }}
      aria-hidden="true"
    >
      <div
        className="w-12 h-8 relative threed-preserve transition-transform duration-300"
        style={{ transform: 'rotateX(60deg) rotateZ(-35deg)' }}
      >
        {/* Layer 1: Top Navigation & Hero UI */}
        <div
          className={`absolute inset-0 rounded-md transition-all duration-300 flex items-center justify-center text-[7px] font-mono font-bold ${
            isBlueprint
              ? 'border border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_8px_rgba(0,242,254,0.4)]'
              : 'border border-pink-400 bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-white backdrop-blur-xs'
          }`}
          style={{
            transform: `translateZ(${isExploded ? 20 : 6}px)`
          }}
        >
          <span>UI LAYER</span>
        </div>

        {/* Layer 2: Interactive Showcase & Content */}
        <div
          className={`absolute inset-0 rounded-md transition-all duration-300 flex items-center justify-center text-[7px] font-mono font-bold ${
            isBlueprint
              ? 'border border-cyan-500/60 bg-cyan-950/20 text-cyan-400/80'
              : 'border border-purple-400/70 bg-purple-500/20 text-purple-200'
          }`}
          style={{
            transform: `translateZ(${isExploded ? 7 : 0}px)`
          }}
        >
          <span>CONTENT</span>
        </div>

        {/* Layer 3: Base Chassis Platform */}
        <div
          className={`absolute inset-0 rounded-md transition-all duration-300 flex items-center justify-center text-[7px] font-mono font-bold ${
            isBlueprint
              ? 'border border-stone-600 bg-stone-900/80 text-stone-400'
              : 'border border-stone-400 dark:border-stone-700 bg-stone-200/90 dark:bg-stone-800/90 text-stone-700 dark:text-stone-300 shadow-md'
          }`}
          style={{
            transform: `translateZ(${isExploded ? -6 : -6}px)`
          }}
        >
          <span>CHASSIS</span>
        </div>
      </div>
    </div>
  );
}

export default SpringElasticityVisual;
