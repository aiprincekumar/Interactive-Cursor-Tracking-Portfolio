import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  ExternalLink,
  Cpu,
  Zap,
  CheckCircle2,
  Box
} from 'lucide-react';
import { useLab3D } from '../../../context/LabContext';
import { soundFX } from '../../../utils/audio';

const SHOWCASE_CARDS = [
  {
    id: 'studio',
    title: 'Spatial 3D Studio',
    category: 'Kinematics',
    badge: '60 FPS',
    accent: '#FF4D6D'
  },
  {
    id: 'shaders',
    title: 'WebGL Shaders',
    category: 'Graphics',
    badge: 'GLSL',
    accent: '#00F2FE'
  },
  {
    id: 'audio',
    title: 'Acoustics Graph',
    category: 'Spatial Sound',
    badge: 'WebAudio',
    accent: '#7928CA'
  },
  {
    id: 'agents',
    title: 'Autonomous AI',
    category: 'Agentic Core',
    badge: 'Neural',
    accent: '#10B981'
  }
];

/**
 * SectionShowcasePreview
 *
 * Phase 4: Perspective stack showing project cards popping outward from base plate
 * with bevel chamfers, specular glints, and exploded strata separation.
 */
export function SectionShowcasePreview({
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

  const [hoveredCard, setHoveredCard] = useState(null);

  // Dynamic light calculations
  const rad = ((lighting.angle ?? 45) * Math.PI) / 180;
  const lightOffsetX = Math.round(Math.cos(rad) * 16);
  const lightOffsetY = Math.round(Math.sin(rad) * 16);
  const shadowBlur = Math.round(24 * (lighting.shadowSoftness ?? 0.6));

  const zBase = isExploded ? 0 : 8;

  return (
    <div
      data-testid="section-showcase-preview"
      onMouseEnter={() => onHighlight?.('showcase')}
      onMouseLeave={() => onHighlight?.(null)}
      className={`relative w-full max-w-[330px] flex flex-col items-center gap-3 select-none ${className}`}
      style={{
        transform: `rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg)`,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* CAD Layer Label */}
      {isExploded && (
        <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
          [STRATUM: PERSPECTIVE PROJECT STACK]
        </span>
      )}

      {/* Planar Base Plate */}
      <div
        className={`w-full p-3.5 rounded-2xl border relative transition-all duration-300 backdrop-blur-md ${
          isHighlighted ? 'ring-2 ring-[#FF4D6D] ring-offset-2 shadow-[0_0_20px_rgba(255,77,109,0.35)]' : ''
        }`}
        style={{
          transform: `translateZ(${zBase}px)`,
          transformStyle: 'preserve-3d',
          background: isBlueprint
            ? 'rgba(6, 182, 212, 0.05)'
            : 'rgba(255, 255, 255, 0.75)',
          borderColor: isBlueprint
            ? 'rgba(6, 182, 212, 0.5)'
            : '#E5E7EB',
          boxShadow: `${lightOffsetX}px ${lightOffsetY}px ${shadowBlur}px rgba(0, 0, 0, 0.25)`
        }}
      >
        {/* Base Plate Chamfer Header */}
        <div
          className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200/60 dark:border-stone-800"
          style={{ transform: 'translateZ(10px)', transformStyle: 'preserve-3d' }}
        >
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-500" />
            <span className="text-xs font-bold text-stone-900 dark:text-white">
              Project Card Stack
            </span>
          </div>
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
            Isometric 3D
          </span>
        </div>

        {/* 2x2 Isometric Cards Grid */}
        <div
          className="grid grid-cols-2 gap-2.5"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {SHOWCASE_CARDS.map((card, idx) => {
            const isHovered = hoveredCard === card.id;
            const baseZ = isExploded ? Math.round(separation * (0.8 + idx * 0.3)) : (idx * 6 + 16);
            const zElevate = isHovered ? baseZ + 18 : baseZ;

            return (
              <div
                key={card.id}
                onMouseEnter={() => {
                  setHoveredCard(card.id);
                  try {
                    soundFX?.playPop?.();
                  } catch {
                    // Ignored
                  }
                }}
                onMouseLeave={() => setHoveredCard(null)}
                className={`p-2.5 rounded-xl border flex flex-col gap-1.5 transition-all duration-150 cursor-pointer relative overflow-hidden ${
                  isHovered
                    ? 'border-cyan-500/60 shadow-lg'
                    : 'border-stone-200/90 dark:border-stone-700/80 shadow-xs'
                }`}
                style={{
                  transform: `translateZ(${zElevate}px)`,
                  transformStyle: 'preserve-3d',
                  background: isBlueprint
                    ? 'rgba(6, 182, 212, 0.12)'
                    : isHovered
                      ? 'rgba(255, 255, 255, 0.95)'
                      : 'rgba(255, 255, 255, 0.85)',
                  boxShadow: isHovered
                    ? `0 12px 24px rgba(0, 0, 0, 0.25), 0 0 15px ${card.accent}33`
                    : `${lightOffsetX * 0.5}px ${lightOffsetY * 0.5}px ${shadowBlur * 0.5}px rgba(0, 0, 0, 0.15)`
                }}
              >
                {/* Chamfer Accent Line */}
                <div
                  className="w-full h-0.5 rounded-full"
                  style={{ background: card.accent }}
                />

                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-stone-500">
                    {card.category}
                  </span>
                  <span className="text-[8px] font-mono px-1 py-0.2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                    {card.badge}
                  </span>
                </div>

                <h6 className="text-[11px] font-bold text-stone-900 dark:text-white leading-tight">
                  {card.title}
                </h6>

                <div className="flex items-center justify-between pt-1 text-[9px] font-mono text-cyan-600 dark:text-cyan-400">
                  <span>Z: +{zElevate}px</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stack Telemetry */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-stone-500">
        <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
          Planar Stack (4 Cards)
        </span>
        <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 border border-cyan-500/20">
          Chamfers: Active
        </span>
      </div>
    </div>
  );
}

export default SectionShowcasePreview;
