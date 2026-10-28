import React, { useState, useCallback } from 'react';
import {
  Sparkles,
  Compass,
  Layers,
  Check,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useLab3D } from '../../../context/LabContext';
import { soundFX } from '../../../utils/audio';

const NAV_ITEMS = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'lab', label: '3D Lab' },
  { id: 'contact', label: 'Contact' }
];

/**
 * Navbar3DPreview
 *
 * Phase 4: Floating frosted glass navigation bar with initials [AV],
 * navigation items, 3D button depression on click, specular lighting sheen, and elevation.
 */
export function Navbar3DPreview({
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
  const lighting = threeD.lighting || { angle: 45, shadowSoftness: 0.6 };
  const materials = threeD.materials || { preset: 'glass', bevelWidth: 2 };
  const explodedConfig = threeD.exploded || { enabled: false, separationDistance: 40, blueprintMode: false };

  const isExploded = explodedMode ?? explodedConfig.enabled ?? false;
  const separation = separationDistance ?? explodedConfig.separationDistance ?? 40;
  const isBlueprint = explodedConfig.blueprintMode ?? false;

  const [activeItem, setActiveItem] = useState('lab');
  const [depressedItem, setDepressedItem] = useState(null);

  // Dynamic lighting
  const rad = ((lighting.angle ?? 45) * Math.PI) / 180;
  const lightOffsetX = Math.round(Math.cos(rad) * 16);
  const lightOffsetY = Math.round(Math.sin(rad) * 16);
  const shadowBlur = Math.round(24 * (lighting.shadowSoftness ?? 0.6));

  const zNav = isExploded ? Math.round(separation * 1.1) : 26;
  const zButtons = isExploded ? Math.round(separation * 1.5) : 34;

  const handleItemPress = useCallback((id) => {
    if (!interactive) return;
    setDepressedItem(id);
    setActiveItem(id);
    try {
      soundFX?.playHapticClick?.();
    } catch {
      // Audio fallback
    }
  }, [interactive]);

  const handleItemRelease = useCallback(() => {
    setDepressedItem(null);
  }, []);

  return (
    <div
      data-testid="navbar-3d-preview"
      onMouseEnter={() => onHighlight?.('navbar')}
      onMouseLeave={() => onHighlight?.(null)}
      className={`relative w-full max-w-[340px] flex flex-col items-center gap-4 select-none ${className}`}
      style={{
        transform: `rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg)`,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* CAD Stratum Indicator */}
      {isExploded && (
        <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
          [STRATUM: FLOATING GLASS CHASSIS]
        </span>
      )}

      {/* Main Frosted Glass Navigation Pill */}
      <nav
        className={`w-full p-2 rounded-full border flex items-center justify-between gap-2 backdrop-blur-xl transition-all duration-300 relative overflow-hidden ${
          isHighlighted ? 'ring-2 ring-[#FF4D6D] ring-offset-2 shadow-[0_0_20px_rgba(255,77,109,0.35)]' : ''
        }`}
        style={{
          transform: `translateZ(${zNav}px)`,
          transformStyle: 'preserve-3d',
          background: isBlueprint
            ? 'rgba(6, 182, 212, 0.12)'
            : 'rgba(255, 255, 255, 0.85)',
          borderColor: isBlueprint
            ? 'rgba(6, 182, 212, 0.6)'
            : 'rgba(255, 255, 255, 0.8)',
          boxShadow: isBlueprint
            ? `0 0 25px rgba(6, 182, 212, 0.3)`
            : `${lightOffsetX}px ${lightOffsetY}px ${shadowBlur}px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.8)`
        }}
      >
        {/* Dynamic Specular Sheen Layer */}
        <div
          className="absolute inset-0 pointer-events-none rounded-full opacity-50 mix-blend-overlay"
          style={{
            background: `linear-gradient(${lighting.angle ?? 45}deg, transparent 30%, rgba(255, 255, 255, 0.8) 50%, transparent 70%)`
          }}
        />

        {/* Brand Initial Badge [AV] */}
        <div
          className="flex items-center gap-2 pl-1"
          style={{ transform: `translateZ(${zButtons - zNav}px)` }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF4D6D] to-[#00F2FE] p-0.5 shadow-md flex items-center justify-center font-bold text-white text-xs cursor-pointer hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-stone-900 flex items-center justify-center text-white font-extrabold tracking-tighter">
              AV
            </div>
          </div>
          <span className="text-xs font-extrabold text-stone-900 dark:text-white tracking-tight hidden sm:inline">
            Atul Verma
          </span>
        </div>

        {/* Nav Items List */}
        <div
          className="flex items-center gap-1"
          style={{ transform: `translateZ(${zButtons - zNav}px)`, transformStyle: 'preserve-3d' }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeItem === item.id;
            const isDepressed = depressedItem === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onMouseDown={() => handleItemPress(item.id)}
                onMouseUp={handleItemRelease}
                onMouseLeave={handleItemRelease}
                className={`relative px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-75 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40 shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
                }`}
                style={{
                  transform: isDepressed ? 'translateZ(-4px) scale(0.96)' : 'translateZ(0px)',
                  boxShadow: isDepressed
                    ? 'inset 0 2px 4px rgba(0, 0, 0, 0.25)'
                    : isActive
                      ? '0 2px 6px rgba(6, 182, 212, 0.2)'
                      : 'none'
                }}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-xs" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Pill */}
        <div
          className="pr-1"
          style={{ transform: `translateZ(${zButtons - zNav}px)` }}
        >
          <div className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>
      </nav>

      {/* Telemetry pill */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-stone-500">
        <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
          Elevation: Z+{zNav}px
        </span>
        <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 border border-cyan-500/20">
          Sheen: {lighting.angle ?? 45}&deg;
        </span>
      </div>
    </div>
  );
}

export default Navbar3DPreview;
