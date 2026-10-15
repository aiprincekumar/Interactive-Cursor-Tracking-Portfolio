import React, { useId } from 'react';

/**
 * Helper hook to produce safe, collision-free SVG gradient & filter IDs
 */
function useSafeId(prefix) {
  const rawId = useId();
  const safeId = rawId.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `${prefix}_${safeId}`;
}

/**
 * 1. ButterflyVector
 * Rich Sunset Gradient Wings (#FF007A Hot Pink -> #FF7A00 Sunset Orange -> #FACC15 Golden Yellow),
 * Deep Violet Body (#3B0764) and delicate wing sparkles.
 */
export function ButterflyVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('bf');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ ...sizeStyle, ...style }}
      {...props}
    >
      <defs>
        {/* Left Wing Sunset Gradient */}
        <linearGradient id={`${id}-wing-l`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF007A" />
          <stop offset="55%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#FACC15" />
        </linearGradient>

        {/* Right Wing Sunset Gradient */}
        <linearGradient id={`${id}-wing-r`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF007A" />
          <stop offset="55%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#FACC15" />
        </linearGradient>

        {/* Deep Violet Body Gradient */}
        <linearGradient id={`${id}-body`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="50%" stopColor="#4C1D95" />
          <stop offset="100%" stopColor="#2E1065" />
        </linearGradient>
      </defs>

      <g>
        {/* Left Upper Wing */}
        <path
          d="M11.8 7.2 C9.2 2.6 3.8 2.2 2.2 6 C0.8 9.2 2.6 13.2 6.8 13 C9.6 12.8 11.2 10.2 11.8 7.2 Z"
          fill={`url(#${id}-wing-l)`}
          stroke="#BE185D"
          strokeWidth="0.5"
        />

        {/* Right Upper Wing */}
        <path
          d="M12.2 7.2 C14.8 2.6 20.2 2.2 21.8 6 C23.2 9.2 21.4 13.2 17.2 13 C14.4 12.8 12.8 10.2 12.2 7.2 Z"
          fill={`url(#${id}-wing-r)`}
          stroke="#BE185D"
          strokeWidth="0.5"
        />

        {/* Left Lower Wing */}
        <path
          d="M11.5 12.5 C7.5 12.2 3.8 14.5 4.5 18.2 C5.2 21 9 20.8 11.5 16 Z"
          fill={`url(#${id}-wing-l)`}
          stroke="#E11D48"
          strokeWidth="0.5"
        />

        {/* Right Lower Wing */}
        <path
          d="M12.5 12.5 C16.5 12.2 20.2 14.5 19.5 18.2 C18.8 21 15 20.8 12.5 16 Z"
          fill={`url(#${id}-wing-r)`}
          stroke="#E11D48"
          strokeWidth="0.5"
        />
      </g>

      {/* Wing Inner Highlights & Glow Patterns */}
      <ellipse cx="6.5" cy="7.8" rx="2.2" ry="3.2" transform="rotate(-25 6.5 7.8)" fill="#FFFFFF" fillOpacity="0.35" />
      <ellipse cx="17.5" cy="7.8" rx="2.2" ry="3.2" transform="rotate(25 17.5 7.8)" fill="#FFFFFF" fillOpacity="0.35" />
      <circle cx="7.2" cy="17.2" r="1.3" fill="#FEF08A" fillOpacity="0.85" />
      <circle cx="16.8" cy="17.2" r="1.3" fill="#FEF08A" fillOpacity="0.85" />

      {/* Deep Violet Body & Head */}
      <ellipse cx="12" cy="12.5" rx="1.3" ry="4.5" fill={`url(#${id}-body)`} stroke="#1E1B4B" strokeWidth="0.4" />
      <circle cx="12" cy="6.2" r="1.5" fill="#3B0764" />

      {/* Antennae with berry tips */}
      <path d="M11.2 5.2 C10 3 8.5 2.5 7.8 2.9" stroke="#581C87" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      <circle cx="7.6" cy="3" r="0.8" fill="#FF007A" />
      <path d="M12.8 5.2 C14 3 15.5 2.5 16.2 2.9" stroke="#581C87" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      <circle cx="16.4" cy="3" r="0.8" fill="#FF007A" />

      {/* Sparkles on wingtips */}
      <path d="M19.5 3.5 L20 4.8 L21.3 5.3 L20 5.8 L19.5 7.1 L19 5.8 L17.7 5.3 L19 4.8 Z" fill="#FFFFFF" />
      <circle cx="4.5" cy="5.2" r="0.6" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * 2. FireflyVector
 * Bioluminescent Neon Lime-Green ('#84CC16') & Warm Amber-Gold ('#FACC15') Glowing Abdomen,
 * Translucent Mint/Cyan Wings ('#2DD4BF') and glossy carapace body.
 */
export function FireflyVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('ff');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ ...sizeStyle, ...style }}
      {...props}
    >
      <defs>
        {/* Bioluminescent Lantern */}
        <radialGradient id={`${id}-lantern`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#FACC15" />
          <stop offset="65%" stopColor="#84CC16" />
          <stop offset="100%" stopColor="#4D7C0F" />
        </radialGradient>

        {/* Ambient Bioluminescent Glow Halo */}
        <radialGradient id={`${id}-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#84CC16" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#84CC16" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#84CC16" stopOpacity="0" />
        </radialGradient>

        {/* Glossy Carapace Gradient */}
        <linearGradient id={`${id}-carapace`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78350F" />
          <stop offset="60%" stopColor="#451A03" />
          <stop offset="100%" stopColor="#1C1917" />
        </linearGradient>

        {/* Translucent Mint / Cyan Wing Gradient */}
        <linearGradient id={`${id}-wing`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#0D9488" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      {/* Ambient Bioluminescent Glow Halo behind abdomen */}
      <circle cx="12" cy="16.2" r="7" fill={`url(#${id}-halo)`} />

      {/* Translucent Cyan / Mint Wings (Elytra extended) */}
      <path
        d="M10.5 10.2 C6.2 9.2 3.2 11.5 3.6 15 C4 18 6.5 17 10 12.8 Z"
        fill={`url(#${id}-wing)`}
        stroke="#14B8A6"
        strokeWidth="0.8"
      />
      <path d="M5.5 12.2 C7 13.2 8.5 13.6 9.8 12.6" stroke="#99F6E4" strokeWidth="0.65" strokeLinecap="round" fill="none" opacity="0.8" />

      <path
        d="M13.5 10.2 C17.8 9.2 20.8 11.5 20.4 15 C20 18 17.5 17 14 12.8 Z"
        fill={`url(#${id}-wing)`}
        stroke="#14B8A6"
        strokeWidth="0.8"
      />
      <path d="M18.5 12.2 C17 13.2 15.5 13.6 14.2 12.6" stroke="#99F6E4" strokeWidth="0.65" strokeLinecap="round" fill="none" opacity="0.8" />

      {/* Bioluminescent Glowing Abdomen */}
      <ellipse cx="12" cy="16.2" rx="3.8" ry="4.8" fill={`url(#${id}-lantern)`} stroke="#65A30D" strokeWidth="0.75" />
      {/* Abdomen light ribs */}
      <path d="M9.4 15.2 Q12 16.8 14.6 15.2" stroke="#4D7C0F" strokeWidth="0.75" fill="none" opacity="0.55" />
      <path d="M10 17.6 Q12 19 14 17.6" stroke="#4D7C0F" strokeWidth="0.75" fill="none" opacity="0.55" />

      {/* Glossy Carapace Thorax */}
      <path
        d="M9.5 9.5 C9.5 8 14.5 8 14.5 9.5 L15 12.4 C15 13 9 13 9 12.4 Z"
        fill={`url(#${id}-carapace)`}
        stroke="#292524"
        strokeWidth="0.6"
      />
      {/* Glossy specular highlight */}
      <path d="M10.4 9.2 Q12 8.6 13.6 9.2" stroke="#FDE68A" strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.7" />

      {/* Head & Emerald Eyes */}
      <circle cx="12" cy="6.6" r="2" fill="#1C1917" stroke="#451A03" strokeWidth="0.5" />
      <circle cx="10.8" cy="6.4" r="0.6" fill="#84CC16" />
      <circle cx="13.2" cy="6.4" r="0.6" fill="#84CC16" />

      {/* Curled Antennae with Gold glowing tips */}
      <path d="M11 5 C9.8 3.5 8 3.2 7 3.8" stroke="#78350F" strokeWidth="0.9" strokeLinecap="round" fill="none" />
      <circle cx="6.8" cy="3.9" r="0.75" fill="#FACC15" />
      <path d="M13 5 C14.2 3.5 16 3.2 17 3.8" stroke="#78350F" strokeWidth="0.9" strokeLinecap="round" fill="none" />
      <circle cx="17.2" cy="3.9" r="0.75" fill="#FACC15" />
    </svg>
  );
}

/**
 * 3. WandVector (Stardust)
 * Royal Purple ('#8B5CF6') to Magenta ('#C026D3') metallic wand,
 * radiant 4-pointed bright gold star ('#FBBF24'), and orbiting pink/cyan sparkles.
 */
export function WandVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('wd');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ ...sizeStyle, ...style }}
      {...props}
    >
      <defs>
        {/* Metallic Wand Gradient */}
        <linearGradient id={`${id}-metal`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6D28D9" />
          <stop offset="45%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#C026D3" />
        </linearGradient>

        {/* Radiant 4-Pointed Gold Star */}
        <radialGradient id={`${id}-star`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#FEF08A" />
          <stop offset="70%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </radialGradient>

        {/* Silver Pommel */}
        <linearGradient id={`${id}-pommel`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>

      {/* Wand Shaft */}
      <path
        d="M3.8 20.8 L13.8 10.8 L15.2 12.2 L5.2 22.2 Z"
        fill={`url(#${id}-metal)`}
        stroke="#581C87"
        strokeWidth="0.5"
      />
      {/* Specular Ridge Highlight */}
      <path d="M4.6 20 L13.4 11.2" stroke="#F5D0FE" strokeWidth="0.7" strokeLinecap="round" opacity="0.85" />

      {/* Silver Pommel */}
      <circle cx="3.6" cy="21.4" r="1.5" fill={`url(#${id}-pommel)`} stroke="#64748B" strokeWidth="0.4" />

      {/* Gold Collar */}
      <rect x="13.2" y="9.2" width="2.2" height="2.2" rx="0.4" transform="rotate(45 14.3 10.3)" fill="#F59E0B" />

      {/* Radiant 4-Pointed Bright Gold Star */}
      <path
        d="M17 1.6 C17 4.8 18.2 6 21.4 7 C18.2 8 17 9.2 17 12.4 C17 9.2 15.8 8 12.6 7 C15.8 6 17 4.8 17 1.6 Z"
        fill={`url(#${id}-star)`}
        stroke="#D97706"
        strokeWidth="0.5"
      />
      {/* White Star Cross Core */}
      <path d="M17 4.5 L17.7 7 L17 9.5 L16.3 7 Z" fill="#FFFFFF" />
      <path d="M14.5 7 L17 7.7 L19.5 7 L17 6.3 Z" fill="#FFFFFF" />

      {/* Magic Sparkles & Stardust */}
      {/* Cyan 4-Point Sparkle */}
      <path
        d="M6.5 2.5 C6.5 3.8 7.2 4.5 8.5 4.5 C7.2 4.5 6.5 5.2 6.5 6.5 C6.5 5.2 5.8 4.5 4.5 4.5 C5.8 4.5 6.5 3.8 6.5 2.5 Z"
        fill="#06B6D4"
      />
      {/* Pink Diamond Sparkle */}
      <path
        d="M20 12.8 C20 13.8 20.6 14.5 21.6 14.5 C20.6 14.5 20 15.2 20 16.2 C20 15.2 19.4 14.5 18.4 14.5 C19.4 14.5 20 13.8 20 12.8 Z"
        fill="#F43F5E"
      />

      {/* Micro Twinkle Dots */}
      <circle cx="11.5" cy="3.5" r="0.8" fill="#FDE047" />
      <circle cx="21" cy="3.5" r="0.75" fill="#FACC15" />
      <circle cx="10" cy="14" r="0.7" fill="#67E8F9" />
    </svg>
  );
}

/**
 * 4. AirplaneVector
 * 3D Origami Paper Glider Wings (Bright Sky-Blue '#38BDF8' & Deep Ocean-Blue '#0284C7')
 * with dynamic cyan vapor trails.
 */
export function AirplaneVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('ap');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ ...sizeStyle, ...style }}
      {...props}
    >
      <defs>
        {/* Bright Sky-Blue Top Wing */}
        <linearGradient id={`${id}-wing-top`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="50%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Deep Ocean-Blue Keel & Shade */}
        <linearGradient id={`${id}-wing-deep`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>

        {/* Underwing Shadow */}
        <linearGradient id={`${id}-wing-under`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>

        {/* Cyan Vapor Trail Gradient */}
        <linearGradient id={`${id}-trail`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Cyan Vapor Trail / Aerodynamic Speed Lines */}
      <path
        d="M2 17 C5 16 7.5 15.2 9.5 15.5"
        stroke={`url(#${id}-trail)`}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="3 2"
      />
      <path
        d="M1 20 C4 19.2 6.5 18.5 8.5 18.5"
        stroke="#38BDF8"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M4 22.5 C6.5 22 8 21.5 10 21"
        stroke="#06B6D4"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle cx="2" cy="17" r="1.2" fill="#A5F3FC" opacity="0.6" />

      {/* 3D Origami Plane Facets */}
      {/* Keel / Center Keel Fold */}
      <path
        d="M22 2 L9.5 14 L9 18.5 L12.5 15.5 Z"
        fill={`url(#${id}-wing-under)`}
        stroke="#0369A1"
        strokeWidth="0.5"
      />

      {/* Right Wing Flap */}
      <path
        d="M22 2 L12.5 15.5 L19 16.5 Z"
        fill={`url(#${id}-wing-deep)`}
        stroke="#0284C7"
        strokeWidth="0.5"
      />

      {/* Main Top Wing (Bright Sky-Blue) */}
      <path
        d="M22 2 L3.5 11.5 L9.5 14 Z"
        fill={`url(#${id}-wing-top)`}
        stroke="#0284C7"
        strokeWidth="0.6"
      />

      {/* Leading Edge Highlight */}
      <path d="M22 2 L3.5 11.5" stroke="#F0F9FF" strokeWidth="0.85" strokeLinecap="round" opacity="0.9" />
      {/* Center Crease Highlight */}
      <path d="M22 2 L9.5 14" stroke="#E0F2FE" strokeWidth="0.7" opacity="0.85" />
    </svg>
  );
}

/**
 * 5. LaserVector
 * Vibrant Neon Red/Crimson Target Reticle ('#EF4444'),
 * Ruby Red Bloom ('#DC2626') and blinding white-hot center core ('#FFFFFF').
 */
export function LaserVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('ls');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ ...sizeStyle, ...style }}
      {...props}
    >
      <defs>
        {/* Ruby Red Bloom */}
        <radialGradient id={`${id}-bloom`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#DC2626" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#991B1B" stopOpacity="0" />
        </radialGradient>

        {/* Reticle Brackets Gradient */}
        <linearGradient id={`${id}-bracket`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="50%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
      </defs>

      {/* Outer Tactical HUD Brackets (4 corners) */}
      <path d="M3.5 8 V4 H7.5" stroke={`url(#${id}-bracket)`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.5 4 H20.5 V8" stroke={`url(#${id}-bracket)`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 16 V20 H7.5" stroke={`url(#${id}-bracket)`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.5 20 H20.5 V16" stroke={`url(#${id}-bracket)`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />

      {/* Segmented Target Reticle Circle */}
      <circle cx="12" cy="12" r="7.5" stroke="#EF4444" strokeWidth="1.2" strokeDasharray="3 3.5" opacity="0.85" />

      {/* Precise Target Crosshairs */}
      <line x1="12" y1="2" x2="12" y2="6.5" stroke="#EF4444" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="12" y1="17.5" x2="12" y2="22" stroke="#EF4444" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="2" y1="12" x2="6.5" y2="12" stroke="#EF4444" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="17.5" y1="12" x2="22" y2="12" stroke="#EF4444" strokeWidth="1.4" strokeLinecap="round" />

      {/* Ruby Red Bloom */}
      <circle cx="12" cy="12" r="6" fill={`url(#${id}-bloom)`} />

      {/* Vibrant Crimson Laser Ring */}
      <circle cx="12" cy="12" r="3.2" fill="#DC2626" stroke="#EF4444" strokeWidth="1.2" />

      {/* Blinding White-Hot Core Pinpoint */}
      <circle cx="12" cy="12" r="1.4" fill="#FFFFFF" />
      <line x1="12" y1="9.8" x2="12" y2="14.2" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="9.8" y1="12" x2="14.2" y2="12" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 6. CameraVector
 * Titanium Slate ('#334155') Camera Body,
 * Optical Multi-Coated Lens ('#2563EB' to '#0D9488') with amber flash dot ('#F59E0B').
 */
export function CameraVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('cm');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ ...sizeStyle, ...style }}
      {...props}
    >
      <defs>
        {/* Titanium Slate Camera Body */}
        <linearGradient id={`${id}-body`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="35%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>

        {/* Optical Coating Lens Gradient: Sapphire Blue to Teal / Emerald */}
        <linearGradient id={`${id}-lens`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>

        {/* Amber Flash / AF Assist Emitter */}
        <radialGradient id={`${id}-flash`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </radialGradient>
      </defs>

      {/* Top Controls: Shutter Button & Mode Dial */}
      <rect x="5" y="3.5" width="3.5" height="2.5" rx="0.8" fill="#94A3B8" stroke="#475569" strokeWidth="0.4" />
      <rect x="15.5" y="3.5" width="4" height="2.5" rx="0.8" fill="#64748B" stroke="#334155" strokeWidth="0.4" />

      {/* Titanium Slate Body */}
      <rect x="2" y="5.5" width="20" height="15" rx="3.5" fill={`url(#${id}-body)`} stroke="#1E293B" strokeWidth="0.8" />

      {/* Brushed Metal Top Strip */}
      <path d="M2.5 9 H21.5 V7 C21.5 6 20.8 5.6 19.5 5.6 H4.5 C3.2 5.6 2.5 6 2.5 7 Z" fill="#64748B" opacity="0.65" />

      {/* Lens System */}
      {/* Outer Graphite Barrel */}
      <circle cx="12" cy="13.5" r="5.6" fill="#0F172A" stroke="#64748B" strokeWidth="0.9" />
      {/* Inner Lens Step */}
      <circle cx="12" cy="13.5" r="4.6" fill="#1E293B" stroke="#334155" strokeWidth="0.6" />
      {/* Optical Multi-Coated Glass Element */}
      <circle cx="12" cy="13.5" r="3.8" fill={`url(#${id}-lens)`} />

      {/* Specular Light Flare Arc */}
      <path
        d="M9.8 11.8 C10.4 11 11.2 10.6 12.3 10.6 C13.2 10.6 13.8 10.9 14.3 11.4"
        stroke="#FFFFFF"
        strokeWidth="0.85"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* Deep Center Aperture */}
      <circle cx="12" cy="13.5" r="1.4" fill="#090D16" />
      {/* Tiny Cyan Flare Glint */}
      <circle cx="13.2" cy="12.3" r="0.5" fill="#A5F3FC" />

      {/* Amber Flash / AF Assist Dot */}
      <circle cx="18" cy="8.5" r="1.6" fill={`url(#${id}-flash)`} stroke="#B45309" strokeWidth="0.4" />
      <circle cx="18" cy="8.5" r="0.6" fill="#FFFFFF" />

      {/* Red Recording / Tally Indicator Dot */}
      <circle cx="6" cy="8.5" r="0.9" fill="#EF4444" />
    </svg>
  );
}

/**
 * 7. MinimalVector
 * Metallic Liquid Silver/Graphite Outer Ring ('#64748B' to '#F8FAFC')
 * with vibrant electric indigo core dot ('#6366F1').
 */
export function MinimalVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('mn');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ ...sizeStyle, ...style }}
      {...props}
    >
      <defs>
        {/* Metallic Liquid Silver / Graphite Gradient */}
        <linearGradient id={`${id}-silver`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="30%" stopColor="#94A3B8" />
          <stop offset="75%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>

        {/* Electric Indigo Core Dot */}
        <radialGradient id={`${id}-indigo`} cx="38%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#C7D2FE" />
          <stop offset="40%" stopColor="#6366F1" />
          <stop offset="85%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#312E81" />
        </radialGradient>

        {/* Magnetic Glow Aura */}
        <radialGradient id={`${id}-aura`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#818CF8" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Subtle Outer Magnetic Track */}
      <circle cx="12" cy="12" r="9.5" stroke="#818CF8" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.4" />

      {/* Metallic Liquid Silver / Graphite Outer Ring */}
      <circle cx="12" cy="12" r="7.6" stroke={`url(#${id}-silver)`} strokeWidth="2.2" />

      {/* Specular Highlight Arc */}
      <path
        d="M6.8 9.5 C7.8 7.5 9.8 6.2 12 6.2"
        stroke="#FFFFFF"
        strokeWidth="0.85"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Satellite Fluid Micro-Pearl */}
      <circle cx="17.8" cy="7.2" r="1.3" fill="#E2E8F0" stroke="#64748B" strokeWidth="0.4" />
      <circle cx="17.5" cy="6.9" r="0.5" fill="#FFFFFF" />

      {/* Electric Indigo Core Dot */}
      <circle cx="12" cy="12" r="5" fill={`url(#${id}-aura)`} />
      <circle cx="12" cy="12" r="3.2" fill={`url(#${id}-indigo)`} stroke="#4338CA" strokeWidth="0.5" />
      <circle cx="11.1" cy="11.1" r="0.9" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
}

/**
 * 8. StardustSparklesVector (Fallback / Default)
 * Multi-color Celestial Sparkle Cluster with glowing gold core star,
 * vibrant cyan star, and ruby star.
 */
export function StardustSparklesVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('st');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ ...sizeStyle, ...style }}
      {...props}
    >
      <defs>
        <radialGradient id={`${id}-gold`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#D97706" />
        </radialGradient>
      </defs>

      {/* Main Gold 4-Point Star */}
      <path
        d="M12 2 C12 6.5 13.5 8 18 8 C13.5 8 12 9.5 12 14 C12 9.5 10.5 8 6 8 C10.5 8 12 6.5 12 2 Z"
        fill={`url(#${id}-gold)`}
        stroke="#B45309"
        strokeWidth="0.4"
      />

      {/* Cyan Secondary Star */}
      <path
        d="M6 14 C6 16.5 7 17.5 9.5 17.5 C7 17.5 6 18.5 6 21 C6 18.5 5 17.5 2.5 17.5 C5 17.5 6 16.5 6 14 Z"
        fill="#06B6D4"
      />

      {/* Magenta Tertiary Star */}
      <path
        d="M18 13 C18 15 18.8 15.8 20.8 15.8 C18.8 15.8 18 16.6 18 18.6 C18 16.6 17.2 15.8 15.2 15.8 C17.2 15.8 18 15 18 13 Z"
        fill="#E11D48"
      />

      {/* Tiny White Sparkles */}
      <circle cx="19.5" cy="4.5" r="0.8" fill="#FDE047" />
      <circle cx="4" cy="5" r="0.7" fill="#67E8F9" />
    </svg>
  );
}

/**
 * 100% Cross-Platform Rich Multi-Color Vector Cursor Icon Component
 * Guarantees ultra-crisp, vibrant, multi-layered icons across all browsers & platforms.
 */
export default function CursorIcon({ 
  cursorId, 
  className = "w-5 h-5", 
  size, 
  color,
  style = {},
  ...props
}) {
  const combinedStyle = color ? { color, ...style } : style;

  switch (cursorId) {
    case 'butterfly':
      return <ButterflyVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'firefly':
      return <FireflyVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'wand':
    case 'stardust':
      return <WandVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'airplane':
      return <AirplaneVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'laser':
      return <LaserVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'camera':
      return <CameraVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'minimal':
      return <MinimalVector className={className} size={size} style={combinedStyle} {...props} />;
    default:
      return <StardustSparklesVector className={className} size={size} style={combinedStyle} {...props} />;
  }
}
