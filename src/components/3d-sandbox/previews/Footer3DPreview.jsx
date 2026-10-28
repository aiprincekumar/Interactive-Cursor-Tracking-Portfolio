import React, { useState } from 'react';
import {
  Mail,
  Check,
  Activity,
  Shield,
  Layers
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../../Icons';
import { useLab3D } from '../../../context/LabContext';
import { soundFX } from '../../../utils/audio';
import { THEME_PORTFOLIO_STYLES } from '../UniversalMiniPortfolio';

const SOCIAL_LINKS = [
  { id: 'github', label: 'GitHub', icon: GithubIcon, href: 'https://github.com/aiprincekumar' },
  { id: 'linkedin', label: 'LinkedIn', icon: LinkedinIcon, href: '#' },
  { id: 'twitter', label: 'X', icon: TwitterIcon, href: '#' },
  { id: 'email', label: 'Email', icon: Mail, href: 'mailto:aiprincekumar010100@gmail.com' }
];

/**
 * Footer3DPreview
 *
 * Phase 4: Grounded footer slab with social icons, bevel extrusion,
 * copyright telemetry, and ground shadow falloff.
 */
export function Footer3DPreview({
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
  const materials = threeD.materials || { preset: 'glass', bevelWidth: 2 };
  const explodedConfig = threeD.exploded || { enabled: false, separationDistance: 40, blueprintMode: false };

  const themeStyle = THEME_PORTFOLIO_STYLES[masterTheme] || THEME_PORTFOLIO_STYLES['apple-glass'];

  const isExploded = explodedMode ?? explodedConfig.enabled ?? false;
  const separation = separationDistance ?? explodedConfig.separationDistance ?? 40;
  const isBlueprint = explodedConfig.blueprintMode ?? false;

  const [hoveredIcon, setHoveredIcon] = useState(null);

  // Dynamic light calculations for ground plane shadow
  const rad = ((lighting.angle ?? 45) * Math.PI) / 180;
  const lightOffsetX = Math.round(Math.cos(rad) * 20);
  const lightOffsetY = Math.round(Math.sin(rad) * 20);
  const shadowBlur = Math.round(28 * (lighting.shadowSoftness ?? 0.6));

  const zBase = !isMaster3DOn ? 0 : (isExploded ? 0 : 8);
  const zSlab = !isMaster3DOn ? 0 : (isExploded ? Math.round(separation * 0.7) : 18);
  const zIcons = !isMaster3DOn ? 0 : (isExploded ? Math.round(separation * 1.3) : 28);

  return (
    <div
      data-testid="footer-3d-preview"
      onMouseEnter={() => onHighlight?.('footer')}
      onMouseLeave={() => onHighlight?.(null)}
      className={`relative w-full max-w-[340px] flex flex-col items-center gap-3 select-none ${className}`}
      style={{
        transform: `rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg)`,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* CAD Layer Label */}
      {isExploded && (
        <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
          [STRATUM: GROUNDED FOOTER SLAB]
        </span>
      )}

      {/* Ground plane shadow reflection */}
      <div
        className="absolute inset-x-4 -bottom-4 h-12 rounded-3xl pointer-events-none filter blur-md transition-all duration-150"
        style={{
          transform: `translate(${lightOffsetX}px, ${lightOffsetY}px) translateZ(0px)`,
          background: 'rgba(0, 0, 0, 0.35)',
          opacity: 0.4
        }}
      />

      {/* Main Grounded Slab */}
      <footer
        className={`w-full p-4 rounded-2xl border flex flex-col gap-3.5 relative overflow-hidden backdrop-blur-md transition-all duration-300 ${
          isHighlighted ? 'ring-2 ring-[#FF4D6D] ring-offset-2 shadow-[0_0_20px_rgba(255,77,109,0.35)]' : ''
        }`}
        style={{
          transform: `translateZ(${zSlab}px)`,
          transformStyle: 'preserve-3d',
          background: isBlueprint
            ? 'rgba(6, 182, 212, 0.08)'
            : 'rgba(255, 255, 255, 0.88)',
          borderColor: isBlueprint
            ? 'rgba(6, 182, 212, 0.6)'
            : '#E5E7EB',
          boxShadow: `${lightOffsetX}px ${lightOffsetY}px ${shadowBlur}px rgba(0, 0, 0, 0.25)`
        }}
      >
        {/* Top Telemetry & Status Row */}
        <div
          className="flex items-center justify-between border-b border-stone-200/70 dark:border-stone-800 pb-2.5"
          style={{ transform: `translateZ(${zIcons - zSlab}px)`, transformStyle: 'preserve-3d' }}
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-mono font-bold text-stone-700 dark:text-stone-300">
              ALL SYSTEMS NOMINAL
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
            <Activity className="w-2.5 h-2.5" />
            <span>LATENCY: 12ms</span>
          </div>
        </div>

        {/* Social Icons Interactive Row */}
        <div
          className="flex items-center justify-center gap-3 py-1"
          style={{ transform: `translateZ(${zIcons - zSlab}px)`, transformStyle: 'preserve-3d' }}
        >
          {SOCIAL_LINKS.map((link) => {
            const Icon = link.icon;
            const isHovered = hoveredIcon === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => {
                  setHoveredIcon(link.id);
                  try {
                    soundFX?.playPop?.();
                  } catch {
                    // Ignored
                  }
                }}
                onMouseLeave={() => setHoveredIcon(null)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer ${
                  isHovered
                    ? 'bg-gradient-to-tr from-[#FF4D6D] to-[#00F2FE] text-white shadow-md'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-900 border border-stone-200 dark:border-stone-700'
                }`}
                style={{
                  transform: isHovered ? 'translateZ(12px) scale(1.12)' : 'translateZ(0px)',
                  boxShadow: isHovered
                    ? '0 6px 16px rgba(255, 77, 109, 0.35)'
                    : '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
                title={link.label}
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>

        {/* Copyright & Telemetry */}
        <div
          className="flex flex-col items-center text-center gap-0.5 border-t border-stone-200/70 dark:border-stone-800 pt-2"
          style={{ transform: `translateZ(${zIcons - zSlab}px)` }}
        >
          <p className="text-[11px] font-bold text-stone-800 dark:text-stone-200">
            &copy; 2026 Atul Verma
          </p>
          <p className="text-[9px] font-mono text-stone-500 dark:text-stone-400">
            Spatial UI Architecture &bull; Preserved 3D Chassis
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Footer3DPreview;
