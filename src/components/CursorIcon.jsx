import React, { useId } from 'react';

/**
 * Helper hook to produce safe, collision-free SVG gradient & filter IDs
 */
function useSafeId(prefix) {
  const rawId = useId();
  const safeId = rawId.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `${prefix}_${safeId}`;
}

// ==========================================
// 1. LIVING & NATURE (5 CURSORS)
// ==========================================

/**
 * 1. ButterflyVector
 * Rich Sunset Gradient Wings (#FF007A Hot Pink -> #FF7A00 Sunset Orange -> #FACC15 Golden Yellow),
 * Deep Violet Body (#3B0764) and delicate wing sparkles.
 */
export function ButterflyVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('bf');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-wing-l`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF007A" />
          <stop offset="55%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#FACC15" />
        </linearGradient>
        <linearGradient id={`${id}-wing-r`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF007A" />
          <stop offset="55%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#FACC15" />
        </linearGradient>
        <linearGradient id={`${id}-body`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="50%" stopColor="#4C1D95" />
          <stop offset="100%" stopColor="#2E1065" />
        </linearGradient>
      </defs>

      <g>
        <path
          d="M11.8 7.2 C9.2 2.6 3.8 2.2 2.2 6 C0.8 9.2 2.6 13.2 6.8 13 C9.6 12.8 11.2 10.2 11.8 7.2 Z"
          fill={`url(#${id}-wing-l)`}
          stroke="#BE185D"
          strokeWidth="0.5"
        />
        <path
          d="M12.2 7.2 C14.8 2.6 20.2 2.2 21.8 6 C23.2 9.2 21.4 13.2 17.2 13 C14.4 12.8 12.8 10.2 12.2 7.2 Z"
          fill={`url(#${id}-wing-r)`}
          stroke="#BE185D"
          strokeWidth="0.5"
        />
        <path
          d="M11.5 12.5 C7.5 12.2 3.8 14.5 4.5 18.2 C5.2 21 9 20.8 11.5 16 Z"
          fill={`url(#${id}-wing-l)`}
          stroke="#E11D48"
          strokeWidth="0.5"
        />
        <path
          d="M12.5 12.5 C16.5 12.2 20.2 14.5 19.5 18.2 C18.8 21 15 20.8 12.5 16 Z"
          fill={`url(#${id}-wing-r)`}
          stroke="#E11D48"
          strokeWidth="0.5"
        />
      </g>

      <ellipse cx="6.5" cy="7.8" rx="2.2" ry="3.2" transform="rotate(-25 6.5 7.8)" fill="#FFFFFF" fillOpacity="0.35" />
      <ellipse cx="17.5" cy="7.8" rx="2.2" ry="3.2" transform="rotate(25 17.5 7.8)" fill="#FFFFFF" fillOpacity="0.35" />
      <circle cx="7.2" cy="17.2" r="1.3" fill="#FEF08A" fillOpacity="0.85" />
      <circle cx="16.8" cy="17.2" r="1.3" fill="#FEF08A" fillOpacity="0.85" />

      <ellipse cx="12" cy="12.5" rx="1.3" ry="4.5" fill={`url(#${id}-body)`} stroke="#1E1B4B" strokeWidth="0.4" />
      <circle cx="12" cy="6.2" r="1.5" fill="#3B0764" />

      <path d="M11.2 5.2 C10 3 8.5 2.5 7.8 2.9" stroke="#581C87" strokeWidth="0.8" strokeLinecap="round" />
      <circle cx="7.6" cy="3" r="0.8" fill="#FF007A" />
      <path d="M12.8 5.2 C14 3 15.5 2.5 16.2 2.9" stroke="#581C87" strokeWidth="0.8" strokeLinecap="round" />
      <circle cx="16.4" cy="3" r="0.8" fill="#FF007A" />
    </svg>
  );
}

/**
 * 2. FireflyVector
 * Bioluminescent pulsing emerald & amber abdomen, translucent cyan wings, glossy obsidian body.
 */
export function FireflyVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('ff');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#84CC16" stopOpacity="0.75" />
          <stop offset="80%" stopColor="#10B981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-wing`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={`${id}-body`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78350F" />
          <stop offset="60%" stopColor="#451A03" />
          <stop offset="100%" stopColor="#1C1917" />
        </linearGradient>
      </defs>

      <circle cx="12" cy="16.5" r="7" fill={`url(#${id}-glow)`} />

      <g>
        <path
          d="M11.5 9.5 C8.5 4.5 4.5 5 3.5 8 C2.5 11 6.5 14 11.5 11.5 Z"
          fill={`url(#${id}-wing)`}
          stroke="#059669"
          strokeWidth="0.5"
        />
        <path
          d="M12.5 9.5 C15.5 4.5 19.5 5 20.5 8 C21.5 11 17.5 14 12.5 11.5 Z"
          fill={`url(#${id}-wing)`}
          stroke="#059669"
          strokeWidth="0.5"
        />
      </g>

      <ellipse cx="7.5" cy="8.2" rx="1.5" ry="3" transform="rotate(-30 7.5 8.2)" fill="#FFFFFF" fillOpacity="0.4" />
      <ellipse cx="16.5" cy="8.2" rx="1.5" ry="3" transform="rotate(30 16.5 8.2)" fill="#FFFFFF" fillOpacity="0.4" />

      <ellipse cx="12" cy="11.5" rx="2" ry="2.5" fill={`url(#${id}-body)`} stroke="#1C1917" strokeWidth="0.4" />
      <circle cx="12" cy="6.8" r="1.6" fill="#451A03" />

      <ellipse cx="12" cy="16.5" rx="2.5" ry="3.5" fill="#FACC15" stroke="#EAB308" strokeWidth="0.6" />
      <circle cx="12" cy="16" r="1.6" fill="#FEF08A" />

      <path d="M11 5 C9.8 3.5 8 3.2 7 3.8" stroke="#78350F" strokeWidth="0.9" strokeLinecap="round" />
      <circle cx="6.8" cy="3.9" r="0.7" fill="#84CC16" />
      <path d="M13 5 C14.2 3.5 16 3.2 17 3.8" stroke="#78350F" strokeWidth="0.9" strokeLinecap="round" />
      <circle cx="17.2" cy="3.9" r="0.7" fill="#84CC16" />
    </svg>
  );
}

/**
 * 3. DragonflyVector
 * Dual iridescent cyan & turquoise wings, slender sapphire segmented abdomen, golden compound eyes.
 */
export function DragonflyVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('df');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-wing`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={`${id}-body`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>

      {/* Upper Wings (Wide) */}
      <path
        d="M11 8 C6.5 4 1.5 5 1.2 7.2 C1 9 5.5 10 11 9 Z"
        fill={`url(#${id}-wing)`}
        stroke="#0891B2"
        strokeWidth="0.4"
      />
      <path
        d="M13 8 C17.5 4 22.5 5 22.8 7.2 C23 9 18.5 10 13 9 Z"
        fill={`url(#${id}-wing)`}
        stroke="#0891B2"
        strokeWidth="0.4"
      />

      {/* Lower Wings (Angled) */}
      <path
        d="M11.2 10.5 C7.5 9 2.5 11 2.2 13 C2 14.5 6 14.5 11.2 11.8 Z"
        fill={`url(#${id}-wing)`}
        stroke="#0284C7"
        strokeWidth="0.4"
      />
      <path
        d="M12.8 10.5 C16.5 9 21.5 11 21.8 13 C22 14.5 18 14.5 12.8 11.8 Z"
        fill={`url(#${id}-wing)`}
        stroke="#0284C7"
        strokeWidth="0.4"
      />

      {/* Wing Specular Glares */}
      <ellipse cx="6" cy="7.2" rx="3.5" ry="0.8" transform="rotate(-15 6 7.2)" fill="#FFFFFF" fillOpacity="0.4" />
      <ellipse cx="18" cy="7.2" rx="3.5" ry="0.8" transform="rotate(15 18 7.2)" fill="#FFFFFF" fillOpacity="0.4" />

      {/* Slender Segmented Abdomen */}
      <line x1="12" y1="8" x2="12" y2="21" stroke={`url(#${id}-body)`} strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="12" cy="8.5" rx="1.3" ry="1.8" fill="#0284C7" />

      {/* Golden Compound Eyes */}
      <circle cx="10.8" cy="5.8" r="1.3" fill="#F59E0B" stroke="#B45309" strokeWidth="0.3" />
      <circle cx="13.2" cy="5.8" r="1.3" fill="#F59E0B" stroke="#B45309" strokeWidth="0.3" />
      <circle cx="10.5" cy="5.5" r="0.4" fill="#FEF08A" />
      <circle cx="12.9" cy="5.5" r="0.4" fill="#FEF08A" />
    </svg>
  );
}

/**
 * 4. HoneybeeVector
 * Golden-amber striped furry body, frosted baby-blue wings, pollen aura, and cute antennae.
 */
export function HoneybeeVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('hb');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-body`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <radialGradient id={`${id}-pollen`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Warm Pollen Glow */}
      <circle cx="12" cy="13" r="8" fill={`url(#${id}-pollen)`} />

      {/* Frosted Translucent Wings */}
      <ellipse cx="8" cy="8" rx="2.5" ry="4.8" transform="rotate(-30 8 8)" fill="#E0F2FE" fillOpacity="0.85" stroke="#38BDF8" strokeWidth="0.6" />
      <ellipse cx="16" cy="8" rx="2.5" ry="4.8" transform="rotate(30 16 8)" fill="#E0F2FE" fillOpacity="0.85" stroke="#38BDF8" strokeWidth="0.6" />
      <ellipse cx="7.2" cy="7.2" rx="1.2" ry="3" transform="rotate(-30 7.2 7.2)" fill="#FFFFFF" fillOpacity="0.6" />

      {/* Chubby Amber Abdomen */}
      <ellipse cx="12" cy="13.5" rx="4.5" ry="5.5" fill={`url(#${id}-body)`} stroke="#78350F" strokeWidth="0.6" />

      {/* Black Stripes */}
      <path d="M7.8 11.5 C9 12.5 15 12.5 16.2 11.5" stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 14.5 C9.2 15.5 14.8 15.5 16 14.5" stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9.5 17.2 C10.5 18 13.5 18 14.5 17.2" stroke="#1C1917" strokeWidth="1.4" strokeLinecap="round" />

      {/* Stinger */}
      <polygon points="11.4,19 12,21.5 12.6,19" fill="#1C1917" />

      {/* Head & Antennae */}
      <circle cx="12" cy="7" r="2.2" fill="#291B12" />
      <path d="M11 5.2 C10 3.5 8.5 3 7.5 3.5" stroke="#291B12" strokeWidth="0.8" strokeLinecap="round" />
      <circle cx="7.2" cy="3.8" r="0.6" fill="#F59E0B" />
      <path d="M13 5.2 C14 3.5 15.5 3 16.5 3.5" stroke="#291B12" strokeWidth="0.8" strokeLinecap="round" />
      <circle cx="16.8" cy="3.8" r="0.6" fill="#F59E0B" />
    </svg>
  );
}

/**
 * 5. LeafVector
 * Fresh spring emerald-to-lime leaf, glistening dewdrop reflection, golden veins.
 */
export function LeafVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('lf');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-leaf`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id={`${id}-dew`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#67E8F9" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
      </defs>

      {/* Organic Curved Leaf Body */}
      <path
        d="M4 20 C4 20 5 11 13 4 C18.5 1 20 2 20 2 C20 2 21 6.5 16.5 12.5 C12 18.5 4 20 4 20 Z"
        fill={`url(#${id}-leaf)`}
        stroke="#065F46"
        strokeWidth="0.6"
      />

      {/* Golden Center Stem & Veins */}
      <path d="M4 20 C6.5 16 10 11.5 19.5 2.5" stroke="#FEF08A" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M9 13.5 C12 14.5 15 13 16 11.5" stroke="#A7F3D0" strokeWidth="0.4" strokeLinecap="round" />
      <path d="M12 9.5 C14.5 10 16.5 8.5 17.5 7.5" stroke="#A7F3D0" strokeWidth="0.4" strokeLinecap="round" />

      {/* Glistening Dewdrop */}
      <ellipse cx="14" cy="8.5" rx="1.8" ry="1.5" fill={`url(#${id}-dew)`} stroke="#0284C7" strokeWidth="0.3" />
      <circle cx="13.4" cy="8" r="0.5" fill="#FFFFFF" />
    </svg>
  );
}

// ==========================================
// 2. COSMIC & MAGIC (5 CURSORS)
// ==========================================

/**
 * 6. WandVector (also Stardust)
 * Royal Purple Metallic Handle, Gold Ferrule, Brilliant 4-Point Gold Star with Pink & Cyan Sparkles.
 */
export function WandVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('wd');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-shaft`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4C1D95" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>
        <radialGradient id={`${id}-star`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#FEF08A" />
          <stop offset="70%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#EA580C" />
        </radialGradient>
      </defs>

      {/* Wand Shaft */}
      <line x1="4" y1="20" x2="13.5" y2="10.5" stroke={`url(#${id}-shaft)`} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="4.5" y1="19.5" x2="13" y2="11" stroke="#E9D5FF" strokeWidth="0.7" strokeLinecap="round" />
      {/* Ferrule / Cap */}
      <circle cx="13.5" cy="10.5" r="1.3" fill="#F59E0B" stroke="#B45309" strokeWidth="0.4" />

      {/* Main 4-Point Radiant Gold Star */}
      <path
        d="M17 1 C17 4.2 18 5.2 21.2 5.2 C18 5.2 17 6.2 17 9.4 C17 6.2 16 5.2 12.8 5.2 C16 5.2 17 4.2 17 1 Z"
        fill={`url(#${id}-star)`}
        stroke="#B45309"
        strokeWidth="0.4"
      />
      <circle cx="17" cy="5.2" r="1" fill="#FFFFFF" />

      {/* Cyan & Pink Orbiting Sparkles */}
      <path d="M8 3.5 C8 4.5 8.5 5 9.5 5 C8.5 5 8 5.5 8 6.5 C8 5.5 7.5 5 6.5 5 C7.5 5 8 4.5 8 3.5 Z" fill="#06B6D4" />
      <path d="M21 12 C21 13 21.4 13.4 22.4 13.4 C21.4 13.4 21 13.8 21 14.8 C21 13.8 20.6 13.4 19.6 13.4 C20.6 13.4 21 13 21 12 Z" fill="#EC4899" />
      <circle cx="14" cy="2" r="0.7" fill="#FDE047" />
    </svg>
  );
}

/**
 * 7. CometVector
 * White-hot core, blazing electric cyan-to-purple ion tail, trailing stardust specks.
 */
export function CometVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('cm');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-tail`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#8B5CF6" stopOpacity="0.75" />
          <stop offset="80%" stopColor="#F43F5E" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FB923C" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-head`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#A5F3FC" />
          <stop offset="80%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#2563EB" />
        </radialGradient>
      </defs>

      {/* Plasma Ionization Tail */}
      <path
        d="M16.5 7.5 C13 10 7 15 2 21 C6 18 12 14 17.5 8.5 Z"
        fill={`url(#${id}-tail)`}
      />
      <path
        d="M17.5 6.5 C14.5 9 10 13 4 19 C8 16 13 12 18.5 7.5 Z"
        fill="#FFFFFF"
        fillOpacity="0.4"
      />

      {/* Comet Nucleus & Glow */}
      <circle cx="17.5" cy="6.5" r="4.2" fill="#00F0FF" fillOpacity="0.3" />
      <circle cx="17.5" cy="6.5" r="2.8" fill={`url(#${id}-head)`} stroke="#E0F2FE" strokeWidth="0.5" />
      <circle cx="16.8" cy="5.8" r="0.9" fill="#FFFFFF" />

      {/* Trailing Micro-Stardust */}
      <circle cx="8" cy="14" r="0.8" fill="#FDE047" />
      <circle cx="4" cy="17" r="0.7" fill="#F43F5E" />
      <circle cx="12" cy="11" r="0.6" fill="#38BDF8" />
    </svg>
  );
}

/**
 * 8. BlackholeVector
 * Ultra-deep singularity void core, relativistic accretion disk with hot pink, orange & yellow glow.
 */
export function BlackholeVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('bh');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-disk`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF007A" />
          <stop offset="50%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#FACC15" />
        </linearGradient>
        <radialGradient id={`${id}-corona`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#09090B" />
          <stop offset="70%" stopColor="#3B0764" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Relativistic Accretion Halo */}
      <ellipse cx="12" cy="12" rx="9.5" ry="4.2" transform="rotate(-25 12 12)" stroke={`url(#${id}-disk)`} strokeWidth="2.2" strokeDasharray="14 3 7 2" />

      {/* Gravitational Lens Arc (Top Light Bend) */}
      <path d="M5.5 10 C8.5 5 15.5 5 18.5 10" stroke="#FDE047" strokeWidth="1.2" strokeLinecap="round" />

      {/* Void Core & Event Horizon */}
      <circle cx="12" cy="12" r="5" fill={`url(#${id}-corona)`} />
      <circle cx="12" cy="12" r="3.5" fill="#09090B" stroke="#C084FC" strokeWidth="0.8" />

      {/* Bright Photon Ring Sparkle */}
      <circle cx="14.5" cy="10" r="0.7" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * 9. PrismVector
 * Crystalline glass pyramid splitting incident white light into vibrant rainbow dispersion band.
 */
export function PrismVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('ps');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-glass`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Incident White Ray */}
      <line x1="2" y1="13.5" x2="8.5" y2="12" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />

      {/* Crystalline Prism Body */}
      <polygon points="12,4 4,18 20,18" fill={`url(#${id}-glass)`} stroke="#38BDF8" strokeWidth="0.8" />
      <line x1="12" y1="4" x2="14" y2="18" stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.7" />

      {/* Rainbow Dispersion Fan */}
      <line x1="14" y1="12" x2="22" y2="9.5" stroke="#EF4444" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="14.5" y1="13" x2="22.5" y2="12" stroke="#F59E0B" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="15" y1="14" x2="22.5" y2="14.5" stroke="#10B981" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="15.5" y1="15" x2="22" y2="17" stroke="#06B6D4" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="16" y1="16" x2="21.5" y2="19.5" stroke="#8B5CF6" strokeWidth="0.8" strokeLinecap="round" />

      {/* Peak Apex Glint */}
      <circle cx="12" cy="4" r="0.8" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * 10. PortalVector
 * Swirling interdimensional vortex stargate in neon cyan and cosmic violet with anchor chevrons.
 */
export function PortalVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('pt');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <radialGradient id={`${id}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#06B6D4" />
          <stop offset="75%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>
      </defs>

      {/* Outer Vortex Rings */}
      <circle cx="12" cy="12" r="9" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="6 3 4 2" />
      <circle cx="12" cy="12" r="7.2" stroke="#06B6D4" strokeWidth="1.2" strokeDasharray="8 4" />

      {/* Swirling Warp Core */}
      <circle cx="12" cy="12" r="5" fill={`url(#${id}-core)`} />

      {/* Stargate Chevrons */}
      <polygon points="12,2 10.8,3.5 13.2,3.5" fill="#38BDF8" />
      <polygon points="12,22 10.8,20.5 13.2,20.5" fill="#38BDF8" />
      <polygon points="2,12 3.5,10.8 3.5,13.2" fill="#A855F7" />
      <polygon points="22,12 20.5,10.8 20.5,13.2" fill="#A855F7" />

      {/* Central Singularity Glint */}
      <circle cx="12" cy="12" r="1.2" fill="#FFFFFF" />
    </svg>
  );
}

// ==========================================
// 3. TECH & CYBERPUNK (5 CURSORS)
// ==========================================

/**
 * 11. LaserVector
 * Neon Crimson Target Reticle, 4 Tactical Ticks, Ruby Core with White Specular Center.
 */
export function LaserVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('ls');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <radialGradient id={`${id}-bloom`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#F87171" />
          <stop offset="60%" stopColor="#EF4444" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-ring`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="50%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
      </defs>

      <circle cx="12" cy="12" r="8" fill={`url(#${id}-bloom)`} />
      <circle cx="12" cy="12" r="7.5" stroke={`url(#${id}-ring)`} strokeWidth="1.2" strokeDasharray="3.5 2" />

      <line x1="12" y1="2" x2="12" y2="6.5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="17.5" x2="12" y2="22" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="12" x2="6.5" y2="12" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="17.5" y1="12" x2="22" y2="12" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />

      <circle cx="12" cy="12" r="2.8" fill="#DC2626" stroke="#991B1B" strokeWidth="0.5" />
      <circle cx="12" cy="12" r="1.3" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * 12. MatrixVector
 * Terminal neon green rain, glowing phosphor character lead, cyber code brackets.
 */
export function MatrixVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('mx');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-stream`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#DCFCE7" />
          <stop offset="35%" stopColor="#4ADE80" />
          <stop offset="70%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#14532D" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Cyber Brackets */}
      <path d="M6 5 L3 5 L3 19 L6 19" stroke="#22C55E" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M18 5 L21 5 L21 19 L18 19" stroke="#22C55E" strokeWidth="1.4" strokeLinecap="round" />

      {/* Matrix Streams */}
      <line x1="8.5" y1="6" x2="8.5" y2="17" stroke={`url(#${id}-stream)`} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 1.5" />
      <line x1="12" y1="4" x2="12" y2="19" stroke={`url(#${id}-stream)`} strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2" />
      <line x1="15.5" y1="7" x2="15.5" y2="16" stroke={`url(#${id}-stream)`} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2.5 1.5" />

      {/* White-Hot Leading Phosphor Drops */}
      <circle cx="12" cy="5" r="1.2" fill="#FFFFFF" />
      <circle cx="8.5" cy="7.5" r="0.9" fill="#DCFCE7" />
      <circle cx="15.5" cy="8.5" r="0.9" fill="#DCFCE7" />
    </svg>
  );
}

/**
 * 13. ReticleVector
 * Modern Sci-Fi HUD tracking reticle, segmented corner brackets, amber target lock diamond.
 */
export function ReticleVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('rt');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-hud`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
      </defs>

      {/* 4 Corner HUD Brackets */}
      <path d="M4 8 L4 4 L8 4" stroke={`url(#${id}-hud)`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 4 L20 4 L20 8" stroke={`url(#${id}-hud)`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 16 L20 20 L16 20" stroke={`url(#${id}-hud)`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 20 L4 20 L4 16" stroke={`url(#${id}-hud)`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />

      {/* Center Target Lock Diamond */}
      <polygon points="12,8 16,12 12,16 8,12" stroke="#F59E0B" strokeWidth="1" fill="#FEF08A" fillOpacity="0.25" />
      <circle cx="12" cy="12" r="1.5" fill="#EF4444" />
      <circle cx="12" cy="12" r="0.6" fill="#FFFFFF" />

      {/* Azimuth Ticks */}
      <line x1="12" y1="4" x2="12" y2="6" stroke="#38BDF8" strokeWidth="1" strokeLinecap="round" />
      <line x1="12" y1="18" x2="12" y2="20" stroke="#38BDF8" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 14. CircuitVector
 * Cyberpunk PCB processor chip in matte navy, gold trace routes, glowing cyan solder nodes.
 */
export function CircuitVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('cc');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="60%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>

      {/* Central Microchip Box */}
      <rect x="7" y="7" width="10" height="10" rx="2" fill="#0F172A" stroke="#06B6D4" strokeWidth="0.8" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" fill={`url(#${id}-gold)`} />
      <circle cx="12" cy="12" r="1" fill="#FFFFFF" />

      {/* Gold/Cyan Circuit Traces & Solder Pads */}
      <path d="M7 9 L3.5 9" stroke="#F59E0B" strokeWidth="1" />
      <circle cx="2.8" cy="9" r="1" fill="#06B6D4" />

      <path d="M7 15 L4 15 L2.5 17.5" stroke="#F59E0B" strokeWidth="1" />
      <circle cx="2.5" cy="18.5" r="1" fill="#06B6D4" />

      <path d="M17 9 L20.5 9" stroke="#F59E0B" strokeWidth="1" />
      <circle cx="21.2" cy="9" r="1" fill="#06B6D4" />

      <path d="M17 15 L20 15 L21.5 12.5" stroke="#F59E0B" strokeWidth="1" />
      <circle cx="21.5" cy="11.5" r="1" fill="#06B6D4" />

      <path d="M12 7 L12 3.5" stroke="#F59E0B" strokeWidth="1" />
      <circle cx="12" cy="2.8" r="1" fill="#22C55E" />

      <path d="M12 17 L12 20.5" stroke="#F59E0B" strokeWidth="1" />
      <circle cx="12" cy="21.2" r="1" fill="#22C55E" />
    </svg>
  );
}

/**
 * 15. DroneVector
 * High-tech carbon quadcopter drone, 4 spinning cyan rotor arcs, navigation LEDs, camera eyeball.
 */
export function DroneVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('dr');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <radialGradient id={`${id}-cam`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#38BDF8" />
          <stop offset="80%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </radialGradient>
      </defs>

      {/* 4 Carbon Strut Arms */}
      <line x1="8" y1="9" x2="4.5" y2="5.5" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="16" y1="9" x2="19.5" y2="5.5" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="8" y1="15" x2="4.5" y2="18.5" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="16" y1="15" x2="19.5" y2="18.5" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />

      {/* 4 Spinning Rotor Discs */}
      <ellipse cx="4.5" cy="5.5" rx="3.5" ry="1.4" stroke="#00F0FF" strokeWidth="0.8" strokeDasharray="3.5 1.5" />
      <ellipse cx="19.5" cy="5.5" rx="3.5" ry="1.4" stroke="#00F0FF" strokeWidth="0.8" strokeDasharray="3.5 1.5" />
      <ellipse cx="4.5" cy="18.5" rx="3.5" ry="1.4" stroke="#00F0FF" strokeWidth="0.8" strokeDasharray="3.5 1.5" />
      <ellipse cx="19.5" cy="18.5" rx="3.5" ry="1.4" stroke="#00F0FF" strokeWidth="0.8" strokeDasharray="3.5 1.5" />

      {/* Nav LEDs */}
      <circle cx="19.5" cy="5.5" r="0.9" fill="#22C55E" />
      <circle cx="4.5" cy="18.5" r="0.9" fill="#EF4444" />

      {/* Central Fuselage */}
      <rect x="8" y="8" width="8" height="8" rx="2.5" fill="#1E293B" stroke="#64748B" strokeWidth="0.8" />
      <circle cx="12" cy="12" r="2.4" fill={`url(#${id}-cam)`} stroke="#0284C7" strokeWidth="0.5" />
      <circle cx="11.4" cy="11.4" r="0.7" fill="#FFFFFF" />
    </svg>
  );
}

// ==========================================
// 4. PLAYFUL & VEHICLES (5 CURSORS)
// ==========================================

/**
 * 16. AirplaneVector
 * 3D Origami Shaded Wings (Sky-Blue & Ocean-Blue), Cyan Fold Line, Vapor Trail.
 */
export function AirplaneVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('ap');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-top`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="60%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0C4A6E" />
        </linearGradient>
      </defs>

      <path d="M4 19 C6 18.5 8 18 10 16.5" stroke="#E0F2FE" strokeWidth="1" strokeLinecap="round" strokeDasharray="1.5 1.5" />
      <path d="M2.5 21 C4.5 20.5 7 19.5 9 18" stroke="#BAE6FD" strokeWidth="0.8" strokeLinecap="round" strokeDasharray="1.5 1.5" />

      <polygon points="21.5,2.5 10,13.5 12,21.5 15,16.5 21.5,2.5" fill={`url(#${id}-shade)`} stroke="#0369A1" strokeWidth="0.4" />
      <polygon points="21.5,2.5 2.5,10.5 10,13.5 21.5,2.5" fill={`url(#${id}-top)`} stroke="#0284C7" strokeWidth="0.4" />
      <line x1="21.5" y1="2.5" x2="10" y2="13.5" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
      <polygon points="10,13.5 11,18 13.5,15" fill="#0369A1" />
    </svg>
  );
}

/**
 * 17. RocketVector
 * Retro Apollo/Tintin rocket, crimson nosecone & fins, cyan porthole, fiery thruster exhaust.
 */
export function RocketVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('rk');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-hull`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id={`${id}-fire`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#FACC15" />
          <stop offset="75%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Thruster Plume Flame */}
      <polygon points="8,16 2,22 4,19 1,23 5,17 7,17" fill={`url(#${id}-fire)`} />

      {/* Fins */}
      <polygon points="8,16 4,17.5 5.5,14" fill="#DC2626" />
      <polygon points="11.5,19.5 10,23 13.5,21.5" fill="#DC2626" />

      {/* Fuselage */}
      <path
        d="M8.5 15.5 C9.5 11.5 13.5 7.5 18.5 5.5 C16.5 10.5 12.5 14.5 8.5 15.5 Z"
        fill={`url(#${id}-hull)`}
        stroke="#94A3B8"
        strokeWidth="0.5"
      />

      {/* Nosecone */}
      <path d="M16 8 C17.5 6.5 18.5 5.5 21 3 C18.5 5.5 17.5 6.5 16 8 Z" fill="#EF4444" />
      <polygon points="18.5,5.5 21,3 15.5,8.5" fill="#EF4444" />

      {/* Porthole */}
      <circle cx="14" cy="10" r="1.8" fill="#38BDF8" stroke="#1E293B" strokeWidth="0.5" />
      <circle cx="13.5" cy="9.5" r="0.6" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * 18. UfoVector
 * Retro flying saucer, emerald tractor beam, glowing cyan bubble dome, antenna orb.
 */
export function UfoVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('uf');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-beam`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-saucer`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="50%" stopColor="#64748B" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>

      {/* Emerald Tractor Beam */}
      <polygon points="9,13.5 15,13.5 19.5,22 4.5,22" fill={`url(#${id}-beam)`} />

      {/* Antenna */}
      <line x1="12" y1="7" x2="12" y2="4" stroke="#F59E0B" strokeWidth="0.8" />
      <circle cx="12" cy="3.5" r="1.2" fill="#FACC15" />

      {/* Cockpit Dome */}
      <path d="M8 11.5 C8 7.5 16 7.5 16 11.5 Z" fill="#67E8F9" stroke="#0891B2" strokeWidth="0.5" />
      <ellipse cx="10" cy="9.5" rx="1.5" ry="0.8" fill="#FFFFFF" fillOpacity="0.75" />

      {/* Saucer Hull */}
      <ellipse cx="12" cy="12.5" rx="9" ry="3" fill={`url(#${id}-saucer)`} stroke="#1E293B" strokeWidth="0.6" />

      {/* Perimeter Indicator Lights */}
      <circle cx="5" cy="12.5" r="0.9" fill="#FACC15" />
      <circle cx="8.5" cy="13.5" r="0.9" fill="#00F0FF" />
      <circle cx="12" cy="14" r="0.9" fill="#22C55E" />
      <circle cx="15.5" cy="13.5" r="0.9" fill="#00F0FF" />
      <circle cx="19" cy="12.5" r="0.9" fill="#FACC15" />
    </svg>
  );
}

/**
 * 19. SpeedsterVector
 * Aerodynamic hypercar silhouette, scarlet-crimson body, golden headlights, speed trails.
 */
export function SpeedsterVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('sp');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-body`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="50%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
      </defs>

      {/* Motion Streaks */}
      <line x1="2" y1="12" x2="5" y2="12" stroke="#FDA4AF" strokeWidth="1" strokeLinecap="round" />
      <line x1="1" y1="15" x2="6" y2="15" stroke="#FDA4AF" strokeWidth="1" strokeLinecap="round" />

      {/* Streamlined Body */}
      <path
        d="M5 14.5 C6.5 12 9 10 13 9.5 C16 9.5 19 11 21 13 L22 14.5 C22 15.5 21 16 20 16 L6 16 C5 16 4.5 15.5 5 14.5 Z"
        fill={`url(#${id}-body)`}
        stroke="#7F1D1D"
        strokeWidth="0.6"
      />

      {/* Windshield Cockpit */}
      <path d="M10 11.5 C12 10.5 15 10.5 17 11.8 L15.5 13 L9.5 13 Z" fill="#0F172A" />

      {/* Wheels */}
      <circle cx="8" cy="16.5" r="2" fill="#18181B" stroke="#94A3B8" strokeWidth="0.6" />
      <circle cx="8" cy="16.5" r="0.8" fill="#FACC15" />
      <circle cx="18" cy="16.5" r="2" fill="#18181B" stroke="#94A3B8" strokeWidth="0.6" />
      <circle cx="18" cy="16.5" r="0.8" fill="#FACC15" />

      {/* Projector Headlight Beam */}
      <polygon points="21,13.5 24,12.5 24,15" fill="#FEF08A" fillOpacity="0.75" />
    </svg>
  );
}

/**
 * 20. BalloonVector
 * Multi-stripe festival hot-air balloon, specular glare, woven amber wicker basket.
 */
export function BalloonVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('bl');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-stripe1`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF007A" />
          <stop offset="100%" stopColor="#BE185D" />
        </linearGradient>
        <linearGradient id={`${id}-stripe2`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id={`${id}-stripe3`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
      </defs>

      {/* Balloon Envelope */}
      <path
        d="M12 2 C7 2 4.5 5.5 5 10 C5.5 13.5 8.5 16.5 10 17.5 L14 17.5 C15.5 16.5 18.5 13.5 19 10 C19.5 5.5 17 2 12 2 Z"
        fill={`url(#${id}-stripe2)`}
        stroke="#B45309"
        strokeWidth="0.5"
      />
      {/* Side Color Bands */}
      <path
        d="M12 2 C9 2 6.5 5 7 10 C7.5 13.5 10 17.5 10 17.5 C10 17.5 8.5 16.5 5 10 C4.5 5.5 7 2 12 2 Z"
        fill={`url(#${id}-stripe1)`}
      />
      <path
        d="M12 2 C15 2 17.5 5 17 10 C16.5 13.5 14 17.5 14 17.5 C14 17.5 15.5 16.5 19 10 C19.5 5.5 17 2 12 2 Z"
        fill={`url(#${id}-stripe3)`}
      />

      {/* Specular Highlight Glare */}
      <ellipse cx="8.5" cy="6" rx="1.5" ry="3.5" transform="rotate(-20 8.5 6)" fill="#FFFFFF" fillOpacity="0.4" />

      {/* Rigging Lines */}
      <line x1="10" y1="17.5" x2="10.8" y2="20" stroke="#78350F" strokeWidth="0.6" />
      <line x1="14" y1="17.5" x2="13.2" y2="20" stroke="#78350F" strokeWidth="0.6" />

      {/* Basket */}
      <rect x="10.5" y="20" width="3" height="2.5" rx="0.5" fill="#B45309" stroke="#78350F" strokeWidth="0.5" />
    </svg>
  );
}

// ==========================================
// 5. ELEMENTAL & FORCES (5 CURSORS)
// ==========================================

/**
 * 21. FlameVector
 * Blazing dynamic fire tongue, white-hot inner core, saffron-yellow mid flame, crimson tips & embers.
 */
export function FlameVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('fl');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-outer`} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="50%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#FACC15" />
        </linearGradient>
        <linearGradient id={`${id}-mid`} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#EA580C" />
          <stop offset="60%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#FEF08A" />
        </linearGradient>
      </defs>

      {/* Outer Flame Tongue */}
      <path
        d="M12 2 C10 6 6 8.5 6 14.5 C6 18.5 9 22 13 22 C17.5 22 19.5 18 18.5 14 C18 12 16.5 11 16.5 9 C15 11 14 10 14 7 C14 5 13 3 12 2 Z"
        fill={`url(#${id}-outer)`}
      />

      {/* Mid Flame Layer */}
      <path
        d="M12 7 C10.5 10 8.5 12 8.5 15.5 C8.5 18.5 10.5 20.5 13 20.5 C15.5 20.5 17 18 16 15 C15.2 13 14 11.5 13 8.5 Z"
        fill={`url(#${id}-mid)`}
      />

      {/* White-Hot Core */}
      <path
        d="M12.5 13 C11.5 15 10.5 16.5 10.5 18.2 C10.5 19.5 11.5 20 12.8 20 C14 20 15 19 14.5 17.5 C14 16 13.2 14.8 12.5 13 Z"
        fill="#FFFFFF"
      />

      {/* Detached Ember Sparks */}
      <circle cx="14" cy="3" r="0.8" fill="#FACC15" />
      <circle cx="7.5" cy="7.5" r="0.6" fill="#F97316" />
    </svg>
  );
}

/**
 * 22. FrostVector
 * Crystalline 6-point dendritic snowflake, arctic ice-blue gradient, sparkling central facet.
 */
export function FrostVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('fr');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-ice`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#67E8F9" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>

      {/* Main 3 Crossed Beams */}
      <line x1="12" y1="2" x2="12" y2="22" stroke={`url(#${id}-ice)`} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="3.3" y1="7" x2="20.7" y2="17" stroke={`url(#${id}-ice)`} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="3.3" y1="17" x2="20.7" y2="7" stroke={`url(#${id}-ice)`} strokeWidth="1.6" strokeLinecap="round" />

      {/* Dendritic V-Branches */}
      <path d="M10 5 L12 3.5 L14 5" stroke="#E0F2FE" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 19 L12 20.5 L14 19" stroke="#E0F2FE" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 8 L4.5 6.5 L6.8 6.5" stroke="#E0F2FE" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 16 L19.5 17.5 L17.2 17.5" stroke="#E0F2FE" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 16 L4.5 17.5 L6.8 17.5" stroke="#E0F2FE" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 8 L19.5 6.5 L17.2 6.5" stroke="#E0F2FE" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />

      {/* Central Diamond Facet */}
      <polygon points="12,9.5 14.5,12 12,14.5 9.5,12" fill="#E0F2FE" stroke="#0284C7" strokeWidth="0.5" />
      <circle cx="12" cy="12" r="1" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * 23. LightningVector
 * High-voltage electric thunderbolt, blazing gold core, electric cyan corona fringe.
 */
export function LightningVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('lt');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-core`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#FEF08A" />
          <stop offset="70%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#38BDF8" floodOpacity="0.8" />
        </filter>
      </defs>

      {/* Electric Bolt Body */}
      <polygon
        points="13.5,2 5.5,12 11.5,12 8.5,22 18.5,10 12.5,10"
        fill={`url(#${id}-core)`}
        stroke="#EAB308"
        strokeWidth="0.8"
        strokeLinejoin="round"
        filter={`url(#${id}-glow)`}
      />

      {/* High-Voltage Corona Sparks */}
      <line x1="16" y1="5" x2="19" y2="4" stroke="#00F0FF" strokeWidth="1" strokeLinecap="round" />
      <line x1="5" y1="16" x2="3" y2="18" stroke="#00F0FF" strokeWidth="1" strokeLinecap="round" />
      <circle cx="12" cy="11" r="1" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * 24. WaterdropVector
 * Crystal clear aqua water droplet, ocean-to-cyan gradient, curved specular reflection.
 */
export function WaterdropVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('wdp');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-drop`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0C4A6E" />
        </linearGradient>
      </defs>

      {/* Teardrop Body */}
      <path
        d="M12 2 C12 2 4.5 12.5 4.5 16.5 C4.5 20.2 7.8 22.5 12 22.5 C16.2 22.5 19.5 20.2 19.5 16.5 C19.5 12.5 12 2 12 2 Z"
        fill={`url(#${id}-drop)`}
        stroke="#0284C7"
        strokeWidth="0.6"
      />

      {/* Specular Surface Glare Curve */}
      <path d="M8 14 C7.2 16 8 18.8 10 20" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.85" />
      <circle cx="10" cy="8" r="0.8" fill="#FFFFFF" fillOpacity="0.8" />

      {/* Internal Caustic Highlight */}
      <circle cx="15" cy="17" r="2" fill="#BAE6FD" fillOpacity="0.4" />
    </svg>
  );
}

/**
 * 25. TornadoVector
 * Dynamic tiered vortex whirlwind, cool slate & electric cyan storm bands, touchdown tip.
 */
export function TornadoVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('tn');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-storm`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
      </defs>

      {/* Tiered Swirl Bands */}
      <ellipse cx="12" cy="4.5" rx="8.5" ry="2" stroke={`url(#${id}-storm)`} strokeWidth="1.8" />
      <ellipse cx="12" cy="8.5" rx="6.8" ry="1.7" stroke={`url(#${id}-storm)`} strokeWidth="1.8" />
      <ellipse cx="12" cy="12.5" rx="5.2" ry="1.5" stroke={`url(#${id}-storm)`} strokeWidth="2" />
      <ellipse cx="12" cy="16.5" rx="3.5" ry="1.2" stroke={`url(#${id}-storm)`} strokeWidth="2" />
      <ellipse cx="12" cy="20" rx="1.8" ry="0.8" fill="#38BDF8" />

      {/* Swirling Air Debris Flecks */}
      <circle cx="4" cy="7" r="0.8" fill="#00F0FF" />
      <circle cx="19" cy="11" r="0.7" fill="#E2E8F0" />
      <circle cx="7" cy="15" r="0.6" fill="#38BDF8" />
    </svg>
  );
}

// ==========================================
// 6. PRECISION & DESIGN (5 CURSORS)
// ==========================================

/**
 * 26. CameraVector
 * Photography Viewfinder Reticle, Titanium Body, Multi-coated Sapphire/Emerald Glass Lens.
 */
export function CameraVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('cmr');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <radialGradient id={`${id}-lens`} cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="30%" stopColor="#2563EB" />
          <stop offset="70%" stopColor="#0891B2" />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>
        <linearGradient id={`${id}-chassis`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#64748B" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
      </defs>

      <path d="M4 6.5 L4 4 L6.5 4" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M17.5 4 L20 4 L20 6.5" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M20 17.5 L20 20 L17.5 20" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6.5 20 L4 20 L4 17.5" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />

      <circle cx="12" cy="12" r="7.5" fill={`url(#${id}-chassis)`} stroke="#475569" strokeWidth="0.8" />
      <circle cx="12" cy="12" r="5.5" fill={`url(#${id}-lens)`} stroke="#0284C7" strokeWidth="0.6" />
      <ellipse cx="10.2" cy="10" rx="1.8" ry="1" transform="rotate(-35 10.2 10)" fill="#FFFFFF" fillOpacity="0.55" />
      <circle cx="13.8" cy="13.8" r="0.8" fill="#10B981" fillOpacity="0.75" />

      <circle cx="18" cy="6" r="1.2" fill="#F59E0B" stroke="#B45309" strokeWidth="0.4" />
      <circle cx="17.7" cy="5.7" r="0.4" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * 27. MinimalVector
 * Fluid Magnetic Follower Ring, Dual-layer Graphite Track, Electric Indigo Center Dot.
 */
export function MinimalVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('mn');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-track`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="50%" stopColor="#64748B" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <radialGradient id={`${id}-indigo`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#A5B4FC" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4338CA" />
        </radialGradient>
      </defs>

      <circle cx="12" cy="12" r="8.5" stroke={`url(#${id}-track)`} strokeWidth="1.4" strokeDasharray="6 2.5" />
      <circle cx="12" cy="12" r="6" stroke="#CBD5E1" strokeWidth="0.6" strokeOpacity="0.5" />

      <circle cx="12" cy="12" r="3.2" fill={`url(#${id}-indigo)`} stroke="#312E81" strokeWidth="0.5" />
      <circle cx="11.2" cy="11.2" r="0.9" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
}

/**
 * 28. QuillVector
 * Calligraphy feather quill, royal purple-to-emerald peacock gradient, gold nib & ink drop.
 */
export function QuillVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('ql');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-feather`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <linearGradient id={`${id}-nib`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>

      {/* Feather Vane */}
      <path
        d="M20 2 C13 3 7 7.5 6 15 C7.5 13.5 10 13.5 12 11.5 C10 13.5 9 15.5 8 18 L10 18 C12.5 15 15 13.5 17 13.5 C15.5 14.5 14.5 16.5 13.5 18.5 L14.5 18.5 C17.5 14.5 19.5 9.5 20.5 4 C21 2.8 20.5 2 20 2 Z"
        fill={`url(#${id}-feather)`}
        stroke="#4C1D95"
        strokeWidth="0.4"
      />

      {/* Golden Quill Shaft */}
      <line x1="20" y1="2.5" x2="6.5" y2="18.5" stroke="#FEF08A" strokeWidth="0.8" strokeLinecap="round" />

      {/* Vintage Gold Nib */}
      <polygon points="6.5,18.5 3,22 5.5,21 7.5,19.5" fill={`url(#${id}-nib)`} stroke="#78350F" strokeWidth="0.4" />

      {/* Ink Drop */}
      <circle cx="2.5" cy="22.5" r="0.9" fill="#4338CA" />
    </svg>
  );
}

/**
 * 29. BrushVector
 * Fine art watercolor brush, mahogany handle, silver chrome ferrule, magenta/orange paint drip.
 */
export function BrushVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('br');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-handle`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9A3412" />
          <stop offset="100%" stopColor="#431407" />
        </linearGradient>
        <linearGradient id={`${id}-paint`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF007A" />
          <stop offset="60%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#FACC15" />
        </linearGradient>
      </defs>

      {/* Mahogany Handle */}
      <line x1="14" y1="10" x2="22" y2="2" stroke={`url(#${id}-handle)`} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="14.5" y1="9.5" x2="21.5" y2="2.5" stroke="#FDBA74" strokeWidth="0.6" strokeLinecap="round" />

      {/* Polished Chrome Ferrule */}
      <polygon points="12.5,8.5 15.5,11.5 13.5,13.5 10.5,10.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="0.4" />

      {/* Loaded Paint Bristles */}
      <path
        d="M10.5,10.5 C8.5,12.5 5.5,16.5 3,19.5 C4.5,20 7.5,19 10,16 C11.5,14 13.5,13.5 13.5,13.5 Z"
        fill={`url(#${id}-paint)`}
        stroke="#BE185D"
        strokeWidth="0.4"
      />

      {/* Droplet Splashes */}
      <circle cx="2" cy="21.5" r="1.1" fill="#FF007A" />
      <circle cx="5" cy="22.5" r="0.7" fill="#FF7A00" />
    </svg>
  );
}

/**
 * 30. CompassVector
 * Antique mariner's navigational compass rose, burnished brass bezel, red/blue magnetic needles.
 */
export function CompassVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('cp');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-brass`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
      </defs>

      {/* Brass Bezel & Dark Face */}
      <circle cx="12" cy="12" r="9" fill="#0F172A" stroke={`url(#${id}-brass)`} strokeWidth="1.6" />
      <circle cx="12" cy="12" r="7.2" stroke="#FDE047" strokeWidth="0.5" strokeDasharray="1 1" />

      {/* North Crimson Needle */}
      <polygon points="12,4.5 10,12 12,10.2 14,12" fill="#EF4444" stroke="#B91C1C" strokeWidth="0.4" />

      {/* South Sapphire Needle */}
      <polygon points="12,19.5 10,12 12,13.8 14,12" fill="#38BDF8" stroke="#0284C7" strokeWidth="0.4" />

      {/* Center Brass Rivet */}
      <circle cx="12" cy="12" r="1.6" fill="#F59E0B" stroke="#78350F" strokeWidth="0.4" />
      <circle cx="11.5" cy="11.5" r="0.5" fill="#FFFFFF" />
    </svg>
  );
}

// ==========================================
// 7. ARCADE & RETRO (5 CURSORS)
// ==========================================

/**
 * 31. GhostVector
 * 8-Bit Arcade Ghost (Blinky/Inky), scalloped tentacles, coral-pink gradient, expressive target eyes.
 */
export function GhostVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('gh');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-ghost`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="50%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#BE123C" />
        </linearGradient>
      </defs>

      {/* Scalloped Ghost Body */}
      <path
        d="M5 12 C5 6.5 8 3 12 3 C16 3 19 6.5 19 12 L19 19.5 L16.8 17.5 L14.5 19.5 L12 17.5 L9.5 19.5 L7.2 17.5 L5 19.5 Z"
        fill={`url(#${id}-ghost)`}
        stroke="#9F1239"
        strokeWidth="0.5"
      />

      {/* Big Expressive Cartoon Eyes */}
      <circle cx="9" cy="10" r="2.2" fill="#FFFFFF" />
      <circle cx="15" cy="10" r="2.2" fill="#FFFFFF" />

      {/* Deep Blue Pupils Tracking Cursor Right */}
      <circle cx="10" cy="10" r="1.2" fill="#1E3A8A" />
      <circle cx="16" cy="10" r="1.2" fill="#1E3A8A" />
      <circle cx="10.4" cy="9.5" r="0.4" fill="#FFFFFF" />
      <circle cx="16.4" cy="9.5" r="0.4" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * 32. PacmanVector
 * Iconic arcade chomper, rich golden gradient, specular gloss, trailing dots.
 */
export function PacmanVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('pm');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-pac`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#EAB308" />
        </linearGradient>
      </defs>

      {/* Pacman Chomper */}
      <path
        d="M11 12 L18.5 7.5 A8.5 8.5 0 1 0 18.5 16.5 Z"
        fill={`url(#${id}-pac)`}
        stroke="#CA8A04"
        strokeWidth="0.6"
      />
      <ellipse cx="9" cy="6.5" rx="2" ry="1" transform="rotate(-30 9 6.5)" fill="#FFFFFF" fillOpacity="0.5" />

      {/* Trailing Arcade Power Pellets */}
      <circle cx="17.5" cy="12" r="1.4" fill="#00F0FF" />
      <circle cx="21.5" cy="12" r="1.1" fill="#FEF08A" />
    </svg>
  );
}

/**
 * 33. JoystickVector
 * Classic arcade cabinet joystick, chrome shaft, candy-apple red glossy ball top, neon action buttons.
 */
export function JoystickVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('js');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-chrome`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="50%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <radialGradient id={`${id}-ball`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="40%" stopColor="#EF4444" />
          <stop offset="85%" stopColor="#991B1B" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </radialGradient>
      </defs>

      {/* Base Console & Rubber Bezel */}
      <ellipse cx="12" cy="18.5" rx="8" ry="3.5" fill="#1E293B" stroke="#475569" strokeWidth="0.6" />
      <ellipse cx="12" cy="17.8" rx="4" ry="1.6" fill="#09090B" />

      {/* Chrome Shaft */}
      <rect x="11.2" y="8" width="1.6" height="10" fill={`url(#${id}-chrome)`} stroke="#475569" strokeWidth="0.3" />

      {/* Glossy Candy Red Ball Top */}
      <circle cx="12" cy="7" r="4.2" fill={`url(#${id}-ball)`} stroke="#991B1B" strokeWidth="0.5" />
      <ellipse cx="10.5" cy="5.2" rx="1.5" ry="0.9" transform="rotate(-30 10.5 5.2)" fill="#FFFFFF" fillOpacity="0.85" />

      {/* Neon Action Buttons */}
      <circle cx="18" cy="17" r="1.1" fill="#22C55E" />
      <circle cx="6" cy="17" r="1.1" fill="#3B82F6" />
    </svg>
  );
}

/**
 * 34. SynthwaveVector
 * 80s Outrun Synthwave sun with horizontal blinds, glowing cyan perspective grid.
 */
export function SynthwaveVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('sw');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-sun`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF007A" />
          <stop offset="50%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#FACC15" />
        </linearGradient>
      </defs>

      {/* Neon Sun */}
      <circle cx="12" cy="10" r="7" fill={`url(#${id}-sun)`} />
      {/* Sun Blind Slices */}
      <rect x="5" y="8.5" width="14" height="0.8" fill="#0F172A" />
      <rect x="5.5" y="10.5" width="13" height="1.1" fill="#0F172A" />
      <rect x="6.5" y="12.8" width="11" height="1.4" fill="#0F172A" />

      {/* Cyber Grid Horizon */}
      <line x1="2" y1="16.5" x2="22" y2="16.5" stroke="#00F0FF" strokeWidth="1.2" />
      <line x1="2" y1="21.5" x2="10.5" y2="16.5" stroke="#06B6D4" strokeWidth="0.8" />
      <line x1="6.5" y1="21.5" x2="11.5" y2="16.5" stroke="#06B6D4" strokeWidth="0.8" />
      <line x1="12" y1="21.5" x2="12" y2="16.5" stroke="#06B6D4" strokeWidth="0.8" />
      <line x1="17.5" y1="21.5" x2="12.5" y2="16.5" stroke="#06B6D4" strokeWidth="0.8" />
      <line x1="22" y1="21.5" x2="13.5" y2="16.5" stroke="#06B6D4" strokeWidth="0.8" />
    </svg>
  );
}

/**
 * 35. SwordVector
 * Legendary enchanted hero sword, mithril silver-cyan blade, golden crossguard, ruby pommel.
 */
export function SwordVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('swd');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <linearGradient id={`${id}-blade`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#E0F2FE" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>

      {/* Mithril Blade */}
      <polygon points="15,4 20,4 20,9 9.5,19.5 7.5,17.5" fill={`url(#${id}-blade)`} stroke="#0284C7" strokeWidth="0.4" />
      <line x1="18" y1="6" x2="8.5" y2="15.5" stroke="#0284C7" strokeWidth="0.6" strokeLinecap="round" />

      {/* Ornate Gold Crossguard */}
      <polygon points="6,14.5 9.5,18 8.5,19.5 4.5,15.5" fill="#F59E0B" stroke="#B45309" strokeWidth="0.4" />

      {/* Hilt Grip */}
      <line x1="6.5" y1="16.5" x2="4.5" y2="18.5" stroke="#4338CA" strokeWidth="1.6" strokeLinecap="round" />

      {/* Ruby Pommel */}
      <circle cx="3.8" cy="19.2" r="1.3" fill="#EF4444" stroke="#991B1B" strokeWidth="0.4" />
      <circle cx="3.5" cy="18.8" r="0.4" fill="#FFFFFF" />

      {/* Blade Tip Sparkle */}
      <path d="M19 1.5 C19 2.5 19.5 3 20.5 3 C19.5 3 19 3.5 19 4.5 C19 3.5 18.5 3 17.5 3 C18.5 3 19 2.5 19 1.5 Z" fill="#FDE047" />
    </svg>
  );
}

// ==========================================
// FALLBACK / DEFAULT
// ==========================================

/**
 * StardustSparklesVector (Fallback / Default)
 * Multi-color Celestial Sparkle Cluster with glowing gold core star, cyan star, and ruby star.
 */
export function StardustSparklesVector({ className = "w-5 h-5", size, style = {}, ...props }) {
  const id = useSafeId('st');
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={{ ...sizeStyle, ...style }} {...props}>
      <defs>
        <radialGradient id={`${id}-gold`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#D97706" />
        </radialGradient>
      </defs>

      <path
        d="M12 2 C12 6.5 13.5 8 18 8 C13.5 8 12 9.5 12 14 C12 9.5 10.5 8 6 8 C10.5 8 12 6.5 12 2 Z"
        fill={`url(#${id}-gold)`}
        stroke="#B45309"
        strokeWidth="0.4"
      />
      <path d="M6 14 C6 16.5 7 17.5 9.5 17.5 C7 17.5 6 18.5 6 21 C6 18.5 5 17.5 2.5 17.5 C5 17.5 6 16.5 6 14 Z" fill="#06B6D4" />
      <path d="M18 13 C18 15 18.8 15.8 20.8 15.8 C18.8 15.8 18 16.6 18 18.6 C18 16.6 17.2 15.8 15.2 15.8 C17.2 15.8 18 15 18 13 Z" fill="#E11D48" />

      <circle cx="19.5" cy="4.5" r="0.8" fill="#FDE047" />
      <circle cx="4" cy="5" r="0.7" fill="#67E8F9" />
    </svg>
  );
}

// ==========================================
// CENTRAL ICON DISPATCHER
// ==========================================

/**
 * 100% Cross-Platform Rich Multi-Color Vector Cursor Icon Component
 * Guarantees ultra-crisp, vibrant, multi-layered icons across all 35 cursor styles.
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
    // 1. Living & Nature
    case 'butterfly':
      return <ButterflyVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'firefly':
      return <FireflyVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'dragonfly':
      return <DragonflyVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'honeybee':
      return <HoneybeeVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'leaf':
      return <LeafVector className={className} size={size} style={combinedStyle} {...props} />;

    // 2. Cosmic & Magic
    case 'wand':
    case 'stardust':
      return <WandVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'comet':
      return <CometVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'blackhole':
      return <BlackholeVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'prism':
      return <PrismVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'portal':
      return <PortalVector className={className} size={size} style={combinedStyle} {...props} />;

    // 3. Tech & Cyberpunk
    case 'laser':
      return <LaserVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'matrix':
      return <MatrixVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'reticle':
      return <ReticleVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'circuit':
      return <CircuitVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'drone':
      return <DroneVector className={className} size={size} style={combinedStyle} {...props} />;

    // 4. Playful & Vehicles
    case 'airplane':
      return <AirplaneVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'rocket':
      return <RocketVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'ufo':
      return <UfoVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'speedster':
      return <SpeedsterVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'balloon':
      return <BalloonVector className={className} size={size} style={combinedStyle} {...props} />;

    // 5. Elemental & Forces
    case 'flame':
      return <FlameVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'frost':
      return <FrostVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'lightning':
      return <LightningVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'waterdrop':
      return <WaterdropVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'tornado':
      return <TornadoVector className={className} size={size} style={combinedStyle} {...props} />;

    // 6. Precision & Design
    case 'camera':
      return <CameraVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'minimal':
      return <MinimalVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'quill':
      return <QuillVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'brush':
      return <BrushVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'compass':
      return <CompassVector className={className} size={size} style={combinedStyle} {...props} />;

    // 7. Arcade & Retro
    case 'ghost':
      return <GhostVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'pacman':
      return <PacmanVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'joystick':
      return <JoystickVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'synthwave':
      return <SynthwaveVector className={className} size={size} style={combinedStyle} {...props} />;
    case 'sword':
      return <SwordVector className={className} size={size} style={combinedStyle} {...props} />;

    default:
      return <StardustSparklesVector className={className} size={size} style={combinedStyle} {...props} />;
  }
}
