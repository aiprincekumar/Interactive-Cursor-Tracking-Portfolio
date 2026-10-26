/* oxlint-disable react/only-export-components */
import React from 'react';

/**
 * SpringElasticityVisual
 * Micro 3D spring cylinder displaying the damping and oscillation physics of the elasticity preset.
 */
export function SpringElasticityVisual({ presetId = 'rigid', className = '' }) {
  const configs = {
    rigid: {
      label: '0 OSC',
      barColor: 'bg-stone-500 dark:bg-stone-400',
      springAnimation: '',
      pistonTransform: 'translateY(0)'
    },
    snappy: {
      label: '1-2 OSC',
      barColor: 'bg-amber-500',
      springAnimation: 'animate-pulse duration-300',
      pistonTransform: 'translateY(-2px)'
    },
    fluid: {
      label: 'DAMPED',
      barColor: 'bg-cyan-500',
      springAnimation: 'animate-bounce duration-1000',
      pistonTransform: 'translateY(-4px)'
    },
    bouncy: {
      label: '4+ OSC',
      barColor: 'bg-[#FF4D6D]',
      springAnimation: 'animate-bounce duration-500',
      pistonTransform: 'translateY(-6px)'
    }
  };

  const cfg = configs[presetId] || configs.rigid;

  return (
    <div
      className={`w-16 h-11 flex flex-col items-center justify-center select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* 3D Piston Head */}
      <div
        className={`w-7 h-2 rounded-t-sm bg-gradient-to-r from-stone-300 to-stone-400 dark:from-stone-600 dark:to-stone-700 border border-white/60 shadow-xs transition-transform duration-200 ${cfg.springAnimation}`}
      />

      {/* Spring Coils */}
      <div className="w-4 h-5 flex flex-col justify-between items-center py-0.5">
        <div className={`w-3.5 h-[2px] rounded-full ${cfg.barColor}`} />
        <div className={`w-4 h-[2px] rounded-full ${cfg.barColor} ml-1`} />
        <div className={`w-4 h-[2px] rounded-full ${cfg.barColor} -ml-1`} />
        <div className={`w-3.5 h-[2px] rounded-full ${cfg.barColor}`} />
      </div>

      {/* 3D Base Pedestal */}
      <div className="w-8 h-2 rounded-b-sm bg-stone-400 dark:bg-stone-800 border-t border-stone-300 dark:border-stone-700 shadow-xs flex items-center justify-center">
        <span className="text-[7.5px] font-mono font-bold text-white/90 leading-none">
          {cfg.label}
        </span>
      </div>
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
