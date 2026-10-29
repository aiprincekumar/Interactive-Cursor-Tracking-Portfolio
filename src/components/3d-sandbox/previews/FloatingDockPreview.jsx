import React, { useState, useCallback, useRef } from 'react';
import {
  Globe,
  User,
  LayoutGrid,
  Box,
  Sparkles,
  Terminal,
  Volume2
} from 'lucide-react';
import { useLab3D } from '../../../context/LabContext';
import { soundFX } from '../../../utils/audio';
import { THEME_PORTFOLIO_STYLES, ELASTICITY_TRANSITIONS } from '../UniversalMiniPortfolio';

const DOCK_ITEMS = [
  { id: 'globe', label: 'Home Portfolio', icon: Globe },
  { id: 'user', label: 'About & Bio', icon: User },
  { id: 'projects', label: 'Projects Grid', icon: LayoutGrid },
  { id: 'lab', label: '3D Studio', icon: Box },
  { id: 'terminal', label: 'CLI Console', icon: Terminal },
  { id: 'audio', label: 'Spatial Sound', icon: Volume2 }
];

/**
 * FloatingDockPreview
 *
 * Phase 4: Interactive floating dock with macOS magnification physics,
 * parabolic scaling, elastic spring hover pop (translateZ, scale), and audio feedback.
 */
export function FloatingDockPreview({
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
  const lighting = threeD.lighting || { angle: 45, shadowSoftness: 0.6 };
  const physics = threeD.physics || { hoverPop: 12, elasticity: 'snappy', clickDepression: true };
  const hoverPopVal = physics.hoverPop ?? 12;
  const elasticityMode = physics.elasticity && ELASTICITY_TRANSITIONS[physics.elasticity] ? physics.elasticity : 'snappy';
  const activeElasticity = ELASTICITY_TRANSITIONS[elasticityMode] || ELASTICITY_TRANSITIONS.snappy;
  const isClickDepressionEnabled = physics.clickDepression ?? true;
  const explodedConfig = threeD.exploded || { enabled: false, separationDistance: 40, blueprintMode: false };

  const themeStyle = THEME_PORTFOLIO_STYLES[masterTheme] || THEME_PORTFOLIO_STYLES['apple-glass'];

  const isExploded = explodedMode ?? explodedConfig.enabled ?? false;
  const separation = separationDistance ?? explodedConfig.separationDistance ?? 40;
  const isBlueprint = explodedConfig.blueprintMode ?? false;

  const isDock3D = isMaster3DOn && (Boolean(elements.floatingButton) || Boolean(elements.resumeButton));

  const [mouseIndex, setMouseIndex] = useState(null);
  const [activeItem, setActiveItem] = useState('lab');
  const [depressedItem, setDepressedItem] = useState(null);
  const lastSoundIndexRef = useRef(null);

  // Dynamic light calculations
  const rad = ((lighting.angle ?? 45) * Math.PI) / 180;
  const lightOffsetX = Math.round(Math.cos(rad) * 16);
  const lightOffsetY = Math.round(Math.sin(rad) * 16);
  const shadowBlur = Math.round(24 * (lighting.shadowSoftness ?? 0.6));

  const zBase = !isMaster3DOn ? 0 : (isExploded ? Math.round(separation * 0.8) : (isDock3D ? 68 : 0));

  const handlePointerMove = useCallback((e) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const itemWidth = rect.width / DOCK_ITEMS.length;
    const index = Math.min(Math.max(x / itemWidth, 0), DOCK_ITEMS.length - 1);
    setMouseIndex(index);

    const rounded = Math.round(index);
    if (lastSoundIndexRef.current !== rounded) {
      lastSoundIndexRef.current = rounded;
      try {
        soundFX?.playPop?.();
      } catch {
        // Ignored
      }
    }
  }, [interactive]);

  const handlePointerLeave = useCallback(() => {
    setMouseIndex(null);
    lastSoundIndexRef.current = null;
  }, []);

  const handleClickItem = useCallback((id) => {
    if (!interactive) return;
    setActiveItem(id);
    try {
      soundFX?.playHapticClick?.();
    } catch {
      // Ignored
    }
  }, [interactive]);

  return (
    <div
      data-testid="floating-dock-preview"
      onMouseEnter={() => onHighlight?.('dock')}
      onMouseLeave={() => {
        handlePointerLeave();
        onHighlight?.(null);
      }}
      className={`relative w-full max-w-[340px] flex flex-col items-center gap-4 select-none ${className}`}
      style={{
        transform: `rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg)`,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Stratum indicator */}
      {isExploded && (
        <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
          [STRATUM: CURVED DOCK CHASSIS &amp; ICONS]
        </span>
      )}

      {/* Dock Container */}
      <div
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
        className={`p-2.5 rounded-2xl border flex items-end gap-2.5 backdrop-blur-xl relative transition-all duration-300 ${
          isHighlighted ? 'ring-2 ring-[#FF4D6D] ring-offset-2 shadow-[0_0_20px_rgba(255,77,109,0.35)]' : ''
        }`}
        style={{
          transform: `translateZ(${zBase}px)`,
          transformStyle: 'preserve-3d',
          background: isBlueprint
            ? 'rgba(6, 182, 212, 0.1)'
            : masterTheme === 'cyber-neon'
              ? '#0B0813'
              : masterTheme === 'studio-matte'
                ? '#E8E3DB'
                : masterTheme === 'floating-hologram'
                  ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.36) 0%, rgba(147, 51, 234, 0.42) 100%)'
                  : 'rgba(255, 255, 255, 0.88)',
          borderColor: isBlueprint
            ? 'rgba(6, 182, 212, 0.6)'
            : masterTheme === 'cyber-neon'
              ? 'rgba(0, 242, 254, 0.8)'
              : masterTheme === 'studio-matte'
                ? '#C3BDB1'
                : masterTheme === 'floating-hologram'
                  ? 'rgba(192, 132, 252, 0.7)'
                  : 'rgba(255, 255, 255, 0.8)',
          boxShadow: isBlueprint
            ? `0 0 25px rgba(6, 182, 212, 0.3)`
            : !isMaster3DOn
              ? 'none'
              : masterTheme === 'cyber-neon'
                ? (isDock3D ? '0 0 24px rgba(0, 242, 254, 0.7), inset 0 0 10px rgba(255, 0, 122, 0.25)' : '0 0 20px rgba(0, 242, 254, 0.45)')
                : masterTheme === 'studio-matte'
                  ? `${lightOffsetX}px ${lightOffsetY}px ${shadowBlur}px rgba(0, 0, 0, 0.18), inset 0 1px 2px rgba(255, 255, 255, 0.2)`
                  : masterTheme === 'floating-hologram'
                    ? (isDock3D ? '0 0 28px rgba(168, 85, 247, 0.8), inset 0 0 12px rgba(129, 140, 248, 0.4)' : '0 0 22px rgba(147, 51, 234, 0.55)')
                    : `${lightOffsetX}px ${lightOffsetY}px ${shadowBlur}px rgba(0, 0, 0, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.8)`
        }}
      >
        {DOCK_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          // Parabolic macOS magnification curve
          let scale = 1;
          let zElevate = 6;
          if (mouseIndex !== null) {
            const distance = Math.abs(mouseIndex - (idx + 0.5));
            const maxDistance = 2.0;
            if (distance < maxDistance) {
              const factor = (1 - distance / maxDistance);
              const maxBoost = (hoverPopVal / 32) * 0.45 + 0.15;
              const zBoost = (hoverPopVal / 12) * 20;
              scale = 1 + factor * maxBoost;
              zElevate = 6 + factor * zBoost;
            }
          }

          if (isExploded) {
            zElevate += (idx % 2 === 0 ? 12 : 20);
          }

          if (isClickDepressionEnabled && depressedItem === item.id) {
            zElevate -= 4;
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleClickItem(item.id)}
              onPointerDown={() => {
                if (isClickDepressionEnabled) {
                  setDepressedItem(item.id);
                }
              }}
              onPointerUp={() => setDepressedItem(null)}
              onPointerLeave={() => setDepressedItem(null)}
              className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center cursor-pointer relative active:translate-y-1 ${
                isActive
                  ? 'bg-gradient-to-tr from-[#FF4D6D] to-[#00F2FE] text-white shadow-md'
                  : 'bg-stone-100/90 dark:bg-stone-800/90 text-stone-700 dark:text-stone-300 hover:text-stone-900 border border-stone-200/80 dark:border-stone-700'
              }`}
              style={{
                transform: `translateZ(${zElevate}px) scale(${scale})`,
                transition: `transform ${activeElasticity.duration} ${activeElasticity.curve}, box-shadow ${activeElasticity.duration} ease`,
                boxShadow: scale > 1.05
                  ? `0 ${Math.round(scale * 6)}px ${Math.round(scale * 12)}px rgba(0, 0, 0, 0.3)`
                  : 'none'
              }}
              title={item.label}
              aria-label={item.label}
            >
              <Icon className="w-4 h-4" />
              {isActive && (
                <span className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-cyan-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Physics Feedback telemetry */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-stone-500">
        <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
          Hover Pop: +{hoverPopVal}px
        </span>
        <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 border border-cyan-500/20">
          Elasticity: {elasticityMode}
        </span>
      </div>
    </div>
  );
}

export default FloatingDockPreview;
