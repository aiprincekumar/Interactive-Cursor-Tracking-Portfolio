/* oxlint-disable react/only-export-components */
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  RotateCcw,
  Sparkles,
  Layers,
  Sun,
  Moon,
  Home,
  Code,
  Cpu,
  Volume2,
  Terminal,
  Grid,
  Shield,
  Eye,
  EyeOff,
  Maximize2,
  Box,
  Camera,
  Film
} from 'lucide-react';
import { useLab3D } from '../../context/LabContext';
import { soundFX } from '../../utils/audio';
import { capture3DStageSnapshot, record360TurntableVideo } from '../../utils/mediaExport';
import SandboxViewportContainer from './SandboxViewportContainer';
import { GemMeshVisual, CyberCubeMeshVisual } from './Visual3DPresets';

/**
 * Kinetic Spring Elasticity Transitions & Curves Specification
 */
export const ELASTICITY_TRANSITIONS = {
  rigid: {
    transition: 'transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1.0), box-shadow 0.18s ease',
    curve: 'cubic-bezier(0.2, 0.8, 0.2, 1.0)',
    duration: '0.18s'
  },
  snappy: {
    transition: 'transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1.0), box-shadow 0.32s ease',
    curve: 'cubic-bezier(0.34, 1.56, 0.64, 1.0)',
    duration: '0.32s'
  },
  bouncy: {
    transition: 'transform 0.52s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.52s ease',
    curve: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    duration: '0.52s'
  }
};

/**
 * 16 Master 3D Portfolio Themes Visual Styling Specification
 * (Apple Glass, Cyber Neon, Studio Matte, Floating Hologram, Obsidian Gold,
 *  Retro Synthwave, Tokyo Midnight, Emerald Matrix, Sunset Bloom, Nordic Frost,
 *  Crimson Stealth, Champagne Quartz, Cosmic Void, Solar Flare, Vaporwave Dream,
 *  Liquid Titanium)
 */
export const THEME_PORTFOLIO_STYLES = {
  'apple-glass': {
    id: 'apple-glass',
    name: 'Apple Glass',
    stageBg: 'radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.12) 0%, rgba(13, 9, 22, 0.96) 100%)',
    navbar: {
      bg: 'rgba(255, 255, 255, 0.78)',
      darkBg: 'rgba(26, 20, 42, 0.82)',
      border: 'border-white/40 dark:border-white/15',
      glow: 'inset 0 1px 1px rgba(255,255,255,0.7), 0 8px 24px rgba(0,0,0,0.12)',
      activeGlowRim: '0 0 14px rgba(255,77,109,0.35), inset 0 1px 2px rgba(255,255,255,0.8)',
      text: 'text-stone-800 dark:text-stone-100',
      badgeBg: 'bg-white/80 dark:bg-white/10 text-stone-700 dark:text-stone-200',
      accent: '#FF4D6D'
    },
    hero: {
      bg: 'rgba(255, 255, 255, 0.84)',
      darkBg: 'rgba(30, 23, 48, 0.88)',
      border: 'border-white/50 dark:border-white/20',
      glow: 'inset 0 1px 2px rgba(255,255,255,0.8), 0 12px 32px rgba(0,0,0,0.18)',
      activeGlowRim: '0 0 20px rgba(255,77,109,0.3), inset 0 1px 2px rgba(255,255,255,0.9)',
      text: 'text-stone-900 dark:text-white',
      avatarGradient: 'from-[#FF4D6D] to-[#00F2FE]',
      subText: 'text-stone-600 dark:text-stone-300',
      accent: '#FF4D6D'
    },
    gridItem: {
      bg: 'rgba(255, 255, 255, 0.72)',
      darkBg: 'rgba(24, 18, 38, 0.82)',
      border: 'border-white/40 dark:border-white/15',
      glow: 'inset 0 1px 1px rgba(255,255,255,0.5), 0 4px 12px rgba(0,0,0,0.1)',
      activeGlowRim: '0 0 12px rgba(255,77,109,0.25)',
      text: 'text-stone-800 dark:text-stone-200',
      accent: '#FF4D6D'
    },
    dock: {
      bg: 'rgba(255, 255, 255, 0.82)',
      darkBg: 'rgba(24, 18, 38, 0.9)',
      border: 'border-white/45 dark:border-white/20',
      glow: 'inset 0 1px 2px rgba(255,255,255,0.7), 0 10px 28px rgba(0,0,0,0.2)',
      activeGlowRim: '0 0 18px rgba(255,77,109,0.35)',
      btnBg: 'bg-white/90 dark:bg-stone-800/90 text-stone-700 dark:text-stone-200 hover:text-[#FF4D6D]',
      accent: '#FF4D6D'
    }
  },
  'cyber-neon': {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    stageBg: 'radial-gradient(circle at 50% 35%, rgba(0, 242, 254, 0.18) 0%, rgba(11, 8, 19, 0.98) 100%)',
    navbar: {
      bg: '#0B0813',
      darkBg: '#0B0813',
      border: 'border-[#00F2FE]/70',
      glow: '0 0 16px rgba(0, 242, 254, 0.4), inset 0 0 8px rgba(0, 242, 254, 0.2)',
      activeGlowRim: '0 0 20px rgba(0, 242, 254, 0.7), inset 0 0 12px rgba(255, 0, 122, 0.3)',
      text: 'text-cyan-300',
      badgeBg: 'bg-[#0B0813] text-cyan-300 border border-cyan-500/40',
      accent: '#00F2FE'
    },
    hero: {
      bg: '#0B0813',
      darkBg: '#0B0813',
      border: 'border-[#FF007A]/70',
      glow: '0 0 20px rgba(255, 0, 122, 0.4), inset 0 0 12px rgba(0, 242, 254, 0.25)',
      activeGlowRim: '0 0 24px rgba(255, 0, 122, 0.7), inset 0 0 16px rgba(0, 242, 254, 0.4)',
      text: 'text-white',
      avatarGradient: 'from-[#FF007A] via-[#9B00FF] to-[#00F2FE]',
      subText: 'text-cyan-200/90',
      accent: '#FF007A'
    },
    gridItem: {
      bg: '#0B0813',
      darkBg: '#0B0813',
      border: 'border-[#00F2FE]/50',
      glow: '0 0 12px rgba(0, 242, 254, 0.3)',
      activeGlowRim: '0 0 16px rgba(0, 242, 254, 0.55)',
      text: 'text-cyan-200',
      accent: '#00F2FE'
    },
    dock: {
      bg: '#0B0813',
      darkBg: '#0B0813',
      border: 'border-[#00F2FE]/80',
      glow: '0 0 20px rgba(0, 242, 254, 0.45), inset 0 0 10px rgba(255, 0, 122, 0.25)',
      activeGlowRim: '0 0 24px rgba(0, 242, 254, 0.7)',
      btnBg: 'bg-[#150F26] text-cyan-300 hover:text-[#FF007A] border border-cyan-500/40',
      accent: '#00F2FE'
    }
  },
  'studio-matte': {
    id: 'studio-matte',
    name: 'Studio Matte',
    stageBg: 'radial-gradient(circle at 50% 40%, rgba(226, 222, 214, 0.25) 0%, rgba(20, 18, 26, 0.98) 100%)',
    navbar: {
      bg: '#EEEAE4',
      darkBg: '#201C28',
      border: 'border-[#C8C3B9]/60 dark:border-[#3D354E]/70',
      glow: '0 4px 12px rgba(0, 0, 0, 0.12), inset 0 1px 2px rgba(255, 255, 255, 0.25)',
      activeGlowRim: '0 4px 18px rgba(245, 158, 11, 0.3), inset 0 1px 3px rgba(255, 255, 255, 0.4)',
      text: 'text-stone-800 dark:text-stone-200',
      badgeBg: 'bg-[#E2DED6] dark:bg-[#2A2436] text-stone-700 dark:text-stone-300',
      accent: '#F59E0B'
    },
    hero: {
      bg: '#EAE6DE',
      darkBg: '#24202E',
      border: 'border-[#BEB8AC]/60 dark:border-[#443B56]/70',
      glow: '0 8px 24px rgba(0, 0, 0, 0.16), inset 0 1px 3px rgba(255, 255, 255, 0.3)',
      activeGlowRim: '0 8px 28px rgba(245, 158, 11, 0.35), inset 0 1px 4px rgba(255, 255, 255, 0.5)',
      text: 'text-stone-900 dark:text-stone-100',
      avatarGradient: 'from-[#D97706] to-[#78350F]',
      subText: 'text-stone-600 dark:text-stone-300',
      accent: '#F59E0B'
    },
    gridItem: {
      bg: '#EEEAE4',
      darkBg: '#1E1A26',
      border: 'border-[#CDC8BE]/55 dark:border-[#383047]/60',
      glow: '0 3px 8px rgba(0, 0, 0, 0.1)',
      activeGlowRim: '0 4px 14px rgba(245, 158, 11, 0.25)',
      text: 'text-stone-800 dark:text-stone-200',
      accent: '#F59E0B'
    },
    dock: {
      bg: '#E8E3DB',
      darkBg: '#221E2C',
      border: 'border-[#C3BDB1]/65 dark:border-[#3E3550]/70',
      glow: '0 6px 20px rgba(0, 0, 0, 0.18), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
      activeGlowRim: '0 6px 22px rgba(245, 158, 11, 0.3)',
      btnBg: 'bg-[#E5E0D7] dark:bg-[#282233] text-stone-700 dark:text-stone-200 hover:text-amber-600',
      accent: '#F59E0B'
    }
  },
  'floating-hologram': {
    id: 'floating-hologram',
    name: 'Floating Hologram',
    stageBg: 'radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.22) 50%, rgba(6, 4, 15, 0.98) 100%)',
    navbar: {
      bg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.35) 100%)',
      darkBg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.35) 100%)',
      border: 'border-purple-400/60',
      glow: '0 0 18px rgba(168, 85, 247, 0.45), inset 0 0 10px rgba(99, 102, 241, 0.3)',
      activeGlowRim: '0 0 24px rgba(168, 85, 247, 0.75), inset 0 0 14px rgba(192, 132, 252, 0.5)',
      text: 'text-purple-200',
      badgeBg: 'bg-purple-900/60 text-purple-200 border border-purple-400/40',
      accent: '#A855F7'
    },
    hero: {
      bg: 'linear-gradient(135deg, rgba(79, 70, 229, 0.35) 0%, rgba(147, 51, 234, 0.4) 100%)',
      darkBg: 'linear-gradient(135deg, rgba(79, 70, 229, 0.35) 0%, rgba(147, 51, 234, 0.4) 100%)',
      border: 'border-purple-400/70',
      glow: '0 0 24px rgba(147, 51, 234, 0.5), inset 0 0 14px rgba(129, 140, 248, 0.35)',
      activeGlowRim: '0 0 30px rgba(168, 85, 247, 0.8), inset 0 0 18px rgba(192, 132, 252, 0.6)',
      text: 'text-white',
      avatarGradient: 'from-[#6366F1] via-[#A855F7] to-[#EC4899]',
      subText: 'text-purple-200/90',
      accent: '#C084FC'
    },
    gridItem: {
      bg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.28) 100%)',
      darkBg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.28) 100%)',
      border: 'border-purple-400/50',
      glow: '0 0 14px rgba(168, 85, 247, 0.38)',
      activeGlowRim: '0 0 18px rgba(168, 85, 247, 0.6)',
      text: 'text-purple-100',
      accent: '#A855F7'
    },
    dock: {
      bg: 'linear-gradient(135deg, rgba(79, 70, 229, 0.36) 0%, rgba(147, 51, 234, 0.42) 100%)',
      darkBg: 'linear-gradient(135deg, rgba(79, 70, 229, 0.36) 0%, rgba(147, 51, 234, 0.42) 100%)',
      border: 'border-purple-400/75',
      glow: '0 0 22px rgba(147, 51, 234, 0.55), inset 0 0 12px rgba(129, 140, 248, 0.4)',
      activeGlowRim: '0 0 28px rgba(168, 85, 247, 0.8)',
      btnBg: 'bg-indigo-950/70 text-purple-200 hover:text-pink-400 border border-purple-500/30',
      accent: '#A855F7'
    }
  },
  'obsidian-gold': {
    id: 'obsidian-gold',
    name: 'Obsidian Gold',
    stageBg: 'radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.15) 0%, rgba(20, 16, 12, 0.98) 100%)',
    navbar: {
      bg: 'rgba(25, 20, 16, 0.92)',
      darkBg: 'rgba(18, 14, 10, 0.95)',
      border: 'border-amber-400/50',
      glow: '0 0 16px rgba(245, 158, 11, 0.35), inset 0 1px 1px rgba(251, 191, 36, 0.4)',
      activeGlowRim: '0 0 20px rgba(245, 158, 11, 0.6), inset 0 0 10px rgba(251, 191, 36, 0.4)',
      text: 'text-amber-100',
      badgeBg: 'bg-amber-950/70 text-amber-300 border border-amber-500/40',
      accent: '#F59E0B'
    },
    hero: {
      bg: 'rgba(28, 22, 17, 0.94)',
      darkBg: 'rgba(18, 14, 10, 0.96)',
      border: 'border-amber-400/60',
      glow: '0 0 24px rgba(245, 158, 11, 0.4), inset 0 1px 2px rgba(251, 191, 36, 0.45)',
      activeGlowRim: '0 0 28px rgba(245, 158, 11, 0.7), inset 0 0 14px rgba(251, 191, 36, 0.5)',
      text: 'text-amber-50',
      avatarGradient: 'from-[#F59E0B] via-[#D97706] to-[#78350F]',
      subText: 'text-amber-200/80',
      accent: '#F59E0B'
    },
    gridItem: {
      bg: 'rgba(25, 20, 16, 0.88)',
      darkBg: 'rgba(16, 12, 8, 0.92)',
      border: 'border-amber-400/35',
      glow: '0 0 12px rgba(245, 158, 11, 0.25)',
      activeGlowRim: '0 0 16px rgba(245, 158, 11, 0.5)',
      text: 'text-amber-100',
      accent: '#F59E0B'
    },
    dock: {
      bg: 'rgba(24, 18, 14, 0.92)',
      darkBg: 'rgba(14, 10, 8, 0.95)',
      border: 'border-amber-400/60',
      glow: '0 0 20px rgba(245, 158, 11, 0.4), inset 0 1px 2px rgba(251, 191, 36, 0.35)',
      activeGlowRim: '0 0 24px rgba(245, 158, 11, 0.65)',
      btnBg: 'bg-amber-950/60 text-amber-200 hover:text-amber-400 border border-amber-500/40',
      accent: '#F59E0B'
    }
  },
  'retro-synthwave': {
    id: 'retro-synthwave',
    name: 'Retro Synthwave',
    stageBg: 'radial-gradient(circle at 50% 30%, rgba(217, 70, 239, 0.22) 0%, rgba(13, 8, 28, 0.98) 100%)',
    navbar: {
      bg: 'rgba(22, 10, 36, 0.88)',
      darkBg: 'rgba(16, 6, 28, 0.94)',
      border: 'border-fuchsia-500/60',
      glow: '0 0 16px rgba(217, 70, 239, 0.45), inset 0 0 8px rgba(0, 242, 254, 0.25)',
      activeGlowRim: '0 0 22px rgba(217, 70, 239, 0.75), inset 0 0 10px rgba(236, 72, 153, 0.5)',
      text: 'text-fuchsia-200',
      badgeBg: 'bg-fuchsia-950/70 text-fuchsia-300 border border-fuchsia-500/40',
      accent: '#D946EF'
    },
    hero: {
      bg: 'rgba(24, 10, 42, 0.92)',
      darkBg: 'rgba(16, 6, 30, 0.95)',
      border: 'border-fuchsia-400/70',
      glow: '0 0 24px rgba(217, 70, 239, 0.5), inset 0 0 12px rgba(0, 242, 254, 0.3)',
      activeGlowRim: '0 0 28px rgba(236, 72, 153, 0.8), inset 0 0 16px rgba(217, 70, 239, 0.5)',
      text: 'text-white',
      avatarGradient: 'from-[#D946EF] via-[#EC4899] to-[#00F2FE]',
      subText: 'text-fuchsia-200/90',
      accent: '#EC4899'
    },
    gridItem: {
      bg: 'rgba(24, 10, 40, 0.82)',
      darkBg: 'rgba(18, 6, 30, 0.88)',
      border: 'border-fuchsia-500/40',
      glow: '0 0 12px rgba(217, 70, 239, 0.3)',
      activeGlowRim: '0 0 16px rgba(217, 70, 239, 0.6)',
      text: 'text-fuchsia-100',
      accent: '#D946EF'
    },
    dock: {
      bg: 'rgba(22, 10, 36, 0.9)',
      darkBg: 'rgba(14, 5, 26, 0.95)',
      border: 'border-fuchsia-500/70',
      glow: '0 0 20px rgba(217, 70, 239, 0.5), inset 0 0 10px rgba(0, 242, 254, 0.3)',
      activeGlowRim: '0 0 26px rgba(236, 72, 153, 0.75)',
      btnBg: 'bg-fuchsia-950/60 text-fuchsia-200 hover:text-cyan-300 border border-fuchsia-500/40',
      accent: '#EC4899'
    }
  },
  'tokyo-midnight': {
    id: 'tokyo-midnight',
    name: 'Tokyo Midnight',
    stageBg: 'radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.2) 0%, rgba(8, 6, 20, 0.98) 100%)',
    navbar: {
      bg: 'rgba(16, 14, 34, 0.88)',
      darkBg: 'rgba(10, 8, 24, 0.94)',
      border: 'border-indigo-400/50',
      glow: '0 0 16px rgba(99, 102, 241, 0.4), inset 0 0 8px rgba(129, 140, 248, 0.25)',
      activeGlowRim: '0 0 20px rgba(99, 102, 241, 0.7), inset 0 0 10px rgba(165, 180, 252, 0.4)',
      text: 'text-indigo-200',
      badgeBg: 'bg-indigo-950/70 text-indigo-300 border border-indigo-400/30',
      accent: '#6366F1'
    },
    hero: {
      bg: 'rgba(18, 15, 38, 0.9)',
      darkBg: 'rgba(12, 9, 26, 0.95)',
      border: 'border-indigo-400/60',
      glow: '0 0 22px rgba(99, 102, 241, 0.45), inset 0 0 12px rgba(147, 51, 234, 0.3)',
      activeGlowRim: '0 0 26px rgba(129, 140, 248, 0.75), inset 0 0 14px rgba(165, 180, 252, 0.45)',
      text: 'text-white',
      avatarGradient: 'from-[#4338CA] via-[#6366F1] to-[#818CF8]',
      subText: 'text-indigo-200/90',
      accent: '#818CF8'
    },
    gridItem: {
      bg: 'rgba(16, 13, 34, 0.8)',
      darkBg: 'rgba(10, 8, 22, 0.88)',
      border: 'border-indigo-400/35',
      glow: '0 0 12px rgba(99, 102, 241, 0.25)',
      activeGlowRim: '0 0 16px rgba(99, 102, 241, 0.5)',
      text: 'text-indigo-100',
      accent: '#6366F1'
    },
    dock: {
      bg: 'rgba(15, 12, 32, 0.9)',
      darkBg: 'rgba(9, 7, 22, 0.95)',
      border: 'border-indigo-400/60',
      glow: '0 0 18px rgba(99, 102, 241, 0.4), inset 0 0 8px rgba(147, 51, 234, 0.25)',
      activeGlowRim: '0 0 22px rgba(99, 102, 241, 0.7)',
      btnBg: 'bg-indigo-950/60 text-indigo-200 hover:text-white border border-indigo-400/30',
      accent: '#818CF8'
    }
  },
  'emerald-matrix': {
    id: 'emerald-matrix',
    name: 'Emerald Matrix',
    stageBg: 'radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.2) 0%, rgba(4, 16, 11, 0.98) 100%)',
    navbar: {
      bg: '#051810',
      darkBg: '#03100B',
      border: 'border-emerald-500/70',
      glow: '0 0 16px rgba(16, 185, 129, 0.45), inset 0 0 8px rgba(52, 211, 153, 0.25)',
      activeGlowRim: '0 0 22px rgba(16, 185, 129, 0.75), inset 0 0 10px rgba(52, 211, 153, 0.4)',
      text: 'text-emerald-300',
      badgeBg: 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40',
      accent: '#10B981'
    },
    hero: {
      bg: '#071C13',
      darkBg: '#04120C',
      border: 'border-emerald-400/80',
      glow: '0 0 22px rgba(16, 185, 129, 0.5), inset 0 0 12px rgba(52, 211, 153, 0.3)',
      activeGlowRim: '0 0 26px rgba(16, 185, 129, 0.8), inset 0 0 14px rgba(52, 211, 153, 0.5)',
      text: 'text-white',
      avatarGradient: 'from-[#059669] via-[#10B981] to-[#34D399]',
      subText: 'text-emerald-200/90',
      accent: '#34D399'
    },
    gridItem: {
      bg: '#061911',
      darkBg: '#04120C',
      border: 'border-emerald-500/45',
      glow: '0 0 12px rgba(16, 185, 129, 0.3)',
      activeGlowRim: '0 0 16px rgba(16, 185, 129, 0.6)',
      text: 'text-emerald-200',
      accent: '#10B981'
    },
    dock: {
      bg: '#061A12',
      darkBg: '#03100B',
      border: 'border-emerald-500/70',
      glow: '0 0 18px rgba(16, 185, 129, 0.45), inset 0 0 8px rgba(52, 211, 153, 0.25)',
      activeGlowRim: '0 0 24px rgba(16, 185, 129, 0.75)',
      btnBg: 'bg-emerald-950/70 text-emerald-300 hover:text-emerald-100 border border-emerald-500/40',
      accent: '#10B981'
    }
  },
  'sunset-bloom': {
    id: 'sunset-bloom',
    name: 'Sunset Bloom',
    stageBg: 'radial-gradient(circle at 50% 30%, rgba(244, 63, 94, 0.2) 0%, rgba(249, 115, 22, 0.15) 50%, rgba(24, 12, 20, 0.98) 100%)',
    navbar: {
      bg: 'rgba(255, 240, 243, 0.82)',
      darkBg: 'rgba(34, 16, 26, 0.88)',
      border: 'border-rose-400/50',
      glow: '0 0 14px rgba(244, 63, 94, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.6)',
      activeGlowRim: '0 0 18px rgba(244, 63, 94, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.7)',
      text: 'text-rose-900 dark:text-rose-100',
      badgeBg: 'bg-rose-100/80 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200',
      accent: '#F43F5E'
    },
    hero: {
      bg: 'rgba(255, 242, 245, 0.86)',
      darkBg: 'rgba(38, 18, 30, 0.92)',
      border: 'border-rose-400/60',
      glow: '0 0 20px rgba(244, 63, 94, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.7)',
      activeGlowRim: '0 0 24px rgba(244, 63, 94, 0.65), inset 0 1px 3px rgba(255, 255, 255, 0.8)',
      text: 'text-stone-900 dark:text-white',
      avatarGradient: 'from-[#F43F5E] via-[#FB7185] to-[#F97316]',
      subText: 'text-rose-700/80 dark:text-rose-200/80',
      accent: '#F43F5E'
    },
    gridItem: {
      bg: 'rgba(255, 242, 245, 0.76)',
      darkBg: 'rgba(32, 14, 24, 0.84)',
      border: 'border-rose-400/35',
      glow: '0 0 10px rgba(244, 63, 94, 0.2)',
      activeGlowRim: '0 0 14px rgba(244, 63, 94, 0.45)',
      text: 'text-rose-900 dark:text-rose-100',
      accent: '#F43F5E'
    },
    dock: {
      bg: 'rgba(255, 240, 244, 0.84)',
      darkBg: 'rgba(32, 14, 24, 0.92)',
      border: 'border-rose-400/55',
      glow: '0 0 16px rgba(244, 63, 94, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
      activeGlowRim: '0 0 20px rgba(244, 63, 94, 0.6)',
      btnBg: 'bg-rose-100/90 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200 hover:text-rose-600',
      accent: '#F43F5E'
    }
  },
  'nordic-frost': {
    id: 'nordic-frost',
    name: 'Nordic Frost',
    stageBg: 'radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.22) 0%, rgba(8, 20, 32, 0.98) 100%)',
    navbar: {
      bg: 'rgba(235, 248, 255, 0.8)',
      darkBg: 'rgba(12, 24, 38, 0.88)',
      border: 'border-sky-300/60 dark:border-sky-400/40',
      glow: '0 0 14px rgba(56, 189, 248, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.7)',
      activeGlowRim: '0 0 18px rgba(56, 189, 248, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
      text: 'text-sky-900 dark:text-sky-100',
      badgeBg: 'bg-sky-100/80 dark:bg-sky-950/60 text-sky-800 dark:text-sky-200',
      accent: '#38BDF8'
    },
    hero: {
      bg: 'rgba(240, 249, 255, 0.84)',
      darkBg: 'rgba(14, 28, 44, 0.92)',
      border: 'border-sky-300/70 dark:border-sky-400/50',
      glow: '0 0 20px rgba(56, 189, 248, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
      activeGlowRim: '0 0 24px rgba(56, 189, 248, 0.65), inset 0 1px 3px rgba(255, 255, 255, 0.9)',
      text: 'text-stone-900 dark:text-white',
      avatarGradient: 'from-[#0284C7] via-[#38BDF8] to-[#BAE6FD]',
      subText: 'text-sky-700/80 dark:text-sky-200/80',
      accent: '#38BDF8'
    },
    gridItem: {
      bg: 'rgba(240, 249, 255, 0.74)',
      darkBg: 'rgba(12, 24, 38, 0.84)',
      border: 'border-sky-300/40 dark:border-sky-400/30',
      glow: '0 0 10px rgba(56, 189, 248, 0.2)',
      activeGlowRim: '0 0 14px rgba(56, 189, 248, 0.45)',
      text: 'text-sky-900 dark:text-sky-100',
      accent: '#38BDF8'
    },
    dock: {
      bg: 'rgba(235, 248, 255, 0.82)',
      darkBg: 'rgba(12, 24, 38, 0.92)',
      border: 'border-sky-300/60 dark:border-sky-400/45',
      glow: '0 0 16px rgba(56, 189, 248, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.7)',
      activeGlowRim: '0 0 20px rgba(56, 189, 248, 0.6)',
      btnBg: 'bg-sky-100/90 dark:bg-sky-900/50 text-sky-800 dark:text-sky-200 hover:text-sky-500',
      accent: '#38BDF8'
    }
  },
  'crimson-stealth': {
    id: 'crimson-stealth',
    name: 'Crimson Stealth',
    stageBg: 'radial-gradient(circle at 50% 30%, rgba(220, 38, 38, 0.2) 0%, rgba(15, 6, 8, 0.98) 100%)',
    navbar: {
      bg: '#12080A',
      darkBg: '#0E0507',
      border: 'border-red-600/70',
      glow: '0 0 16px rgba(220, 38, 38, 0.4), inset 0 0 8px rgba(239, 68, 68, 0.25)',
      activeGlowRim: '0 0 20px rgba(239, 68, 68, 0.75), inset 0 0 10px rgba(248, 113, 113, 0.4)',
      text: 'text-red-200',
      badgeBg: 'bg-red-950/80 text-red-300 border border-red-600/40',
      accent: '#EF4444'
    },
    hero: {
      bg: '#160A0D',
      darkBg: '#100608',
      border: 'border-red-600/80',
      glow: '0 0 22px rgba(220, 38, 38, 0.5), inset 0 0 12px rgba(239, 68, 68, 0.3)',
      activeGlowRim: '0 0 26px rgba(239, 68, 68, 0.8), inset 0 0 14px rgba(248, 113, 113, 0.5)',
      text: 'text-white',
      avatarGradient: 'from-[#991B1B] via-[#DC2626] to-[#EF4444]',
      subText: 'text-red-200/90',
      accent: '#EF4444'
    },
    gridItem: {
      bg: '#14090B',
      darkBg: '#0F0608',
      border: 'border-red-600/45',
      glow: '0 0 12px rgba(220, 38, 38, 0.25)',
      activeGlowRim: '0 0 16px rgba(220, 38, 38, 0.55)',
      text: 'text-red-100',
      accent: '#EF4444'
    },
    dock: {
      bg: '#13080A',
      darkBg: '#0D0507',
      border: 'border-red-600/70',
      glow: '0 0 18px rgba(220, 38, 38, 0.45), inset 0 0 8px rgba(239, 68, 68, 0.25)',
      activeGlowRim: '0 0 22px rgba(239, 68, 68, 0.75)',
      btnBg: 'bg-red-950/70 text-red-200 hover:text-white border border-red-600/40',
      accent: '#EF4444'
    }
  },
  'champagne-quartz': {
    id: 'champagne-quartz',
    name: 'Champagne Quartz',
    stageBg: 'radial-gradient(circle at 50% 30%, rgba(251, 191, 36, 0.16) 0%, rgba(253, 230, 138, 0.1) 50%, rgba(26, 22, 18, 0.98) 100%)',
    navbar: {
      bg: 'rgba(254, 250, 242, 0.82)',
      darkBg: 'rgba(28, 24, 20, 0.88)',
      border: 'border-amber-300/50 dark:border-amber-400/35',
      glow: '0 0 14px rgba(251, 191, 36, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.7)',
      activeGlowRim: '0 0 18px rgba(251, 191, 36, 0.55), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
      text: 'text-stone-800 dark:text-amber-100',
      badgeBg: 'bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200',
      accent: '#F59E0B'
    },
    hero: {
      bg: 'rgba(254, 252, 246, 0.86)',
      darkBg: 'rgba(32, 28, 22, 0.92)',
      border: 'border-amber-300/60 dark:border-amber-400/45',
      glow: '0 0 20px rgba(251, 191, 36, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
      activeGlowRim: '0 0 24px rgba(251, 191, 36, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.9)',
      text: 'text-stone-900 dark:text-white',
      avatarGradient: 'from-[#F59E0B] via-[#FDE68A] to-[#F59E0B]',
      subText: 'text-amber-800/80 dark:text-amber-200/80',
      accent: '#F59E0B'
    },
    gridItem: {
      bg: 'rgba(254, 250, 242, 0.76)',
      darkBg: 'rgba(26, 22, 18, 0.84)',
      border: 'border-amber-300/35 dark:border-amber-400/25',
      glow: '0 0 10px rgba(251, 191, 36, 0.18)',
      activeGlowRim: '0 0 14px rgba(251, 191, 36, 0.4)',
      text: 'text-stone-800 dark:text-amber-100',
      accent: '#F59E0B'
    },
    dock: {
      bg: 'rgba(254, 250, 242, 0.84)',
      darkBg: 'rgba(26, 22, 18, 0.92)',
      border: 'border-amber-300/55 dark:border-amber-400/40',
      glow: '0 0 16px rgba(251, 191, 36, 0.28), inset 0 1px 2px rgba(255, 255, 255, 0.7)',
      activeGlowRim: '0 0 20px rgba(251, 191, 36, 0.55)',
      btnBg: 'bg-amber-100/90 dark:bg-amber-900/50 text-stone-800 dark:text-amber-200 hover:text-amber-600',
      accent: '#F59E0B'
    }
  },
  'cosmic-void': {
    id: 'cosmic-void',
    name: 'Cosmic Void',
    stageBg: 'radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.2) 0%, rgba(76, 29, 149, 0.12) 50%, rgba(5, 3, 10, 0.98) 100%)',
    navbar: {
      bg: '#0B0714',
      darkBg: '#07040D',
      border: 'border-violet-500/60',
      glow: '0 0 16px rgba(139, 92, 246, 0.4), inset 0 0 8px rgba(167, 139, 250, 0.25)',
      activeGlowRim: '0 0 20px rgba(139, 92, 246, 0.7), inset 0 0 10px rgba(196, 181, 253, 0.4)',
      text: 'text-violet-200',
      badgeBg: 'bg-violet-950/70 text-violet-300 border border-violet-500/35',
      accent: '#8B5CF6'
    },
    hero: {
      bg: '#0E091A',
      darkBg: '#080510',
      border: 'border-violet-500/70',
      glow: '0 0 22px rgba(139, 92, 246, 0.45), inset 0 0 12px rgba(167, 139, 250, 0.3)',
      activeGlowRim: '0 0 26px rgba(139, 92, 246, 0.75), inset 0 0 14px rgba(196, 181, 253, 0.45)',
      text: 'text-white',
      avatarGradient: 'from-[#4C1D95] via-[#7C3AED] to-[#A78BFA]',
      subText: 'text-violet-200/90',
      accent: '#A78BFA'
    },
    gridItem: {
      bg: '#0D0818',
      darkBg: '#07040F',
      border: 'border-violet-500/40',
      glow: '0 0 12px rgba(139, 92, 246, 0.25)',
      activeGlowRim: '0 0 16px rgba(139, 92, 246, 0.5)',
      text: 'text-violet-100',
      accent: '#8B5CF6'
    },
    dock: {
      bg: '#0C0716',
      darkBg: '#06040E',
      border: 'border-violet-500/60',
      glow: '0 0 18px rgba(139, 92, 246, 0.4), inset 0 0 8px rgba(167, 139, 250, 0.25)',
      activeGlowRim: '0 0 22px rgba(139, 92, 246, 0.65)',
      btnBg: 'bg-violet-950/60 text-violet-200 hover:text-white border border-violet-500/35',
      accent: '#8B5CF6'
    }
  },
  'solar-flare': {
    id: 'solar-flare',
    name: 'Solar Flare',
    stageBg: 'radial-gradient(circle at 50% 30%, rgba(249, 115, 22, 0.25) 0%, rgba(239, 68, 68, 0.18) 50%, rgba(20, 8, 4, 0.98) 100%)',
    navbar: {
      bg: 'rgba(34, 14, 8, 0.9)',
      darkBg: 'rgba(22, 8, 4, 0.95)',
      border: 'border-orange-500/60',
      glow: '0 0 16px rgba(249, 115, 22, 0.4), inset 0 0 8px rgba(251, 146, 60, 0.3)',
      activeGlowRim: '0 0 22px rgba(249, 115, 22, 0.75), inset 0 0 10px rgba(253, 186, 116, 0.45)',
      text: 'text-orange-200',
      badgeBg: 'bg-orange-950/80 text-orange-300 border border-orange-500/40',
      accent: '#F97316'
    },
    hero: {
      bg: 'rgba(40, 16, 10, 0.94)',
      darkBg: 'rgba(26, 10, 5, 0.96)',
      border: 'border-orange-500/75',
      glow: '0 0 24px rgba(249, 115, 22, 0.45), inset 0 0 12px rgba(251, 146, 60, 0.35)',
      activeGlowRim: '0 0 28px rgba(249, 115, 22, 0.8), inset 0 0 16px rgba(253, 186, 116, 0.5)',
      text: 'text-white',
      avatarGradient: 'from-[#EA580C] via-[#F97316] to-[#FBBF24]',
      subText: 'text-orange-200/90',
      accent: '#FBBF24'
    },
    gridItem: {
      bg: 'rgba(32, 12, 7, 0.84)',
      darkBg: 'rgba(20, 7, 4, 0.9)',
      border: 'border-orange-500/40',
      glow: '0 0 12px rgba(249, 115, 22, 0.28)',
      activeGlowRim: '0 0 16px rgba(249, 115, 22, 0.55)',
      text: 'text-orange-100',
      accent: '#F97316'
    },
    dock: {
      bg: 'rgba(30, 12, 6, 0.92)',
      darkBg: 'rgba(18, 7, 3, 0.95)',
      border: 'border-orange-500/65',
      glow: '0 0 20px rgba(249, 115, 22, 0.45), inset 0 0 10px rgba(251, 146, 60, 0.3)',
      activeGlowRim: '0 0 24px rgba(249, 115, 22, 0.7)',
      btnBg: 'bg-orange-950/70 text-orange-200 hover:text-amber-300 border border-orange-500/40',
      accent: '#F97316'
    }
  },
  'vaporwave-dream': {
    id: 'vaporwave-dream',
    name: 'Vaporwave Dream',
    stageBg: 'radial-gradient(circle at 50% 30%, rgba(244, 114, 182, 0.22) 0%, rgba(45, 212, 191, 0.16) 50%, rgba(18, 10, 26, 0.98) 100%)',
    navbar: {
      bg: 'rgba(245, 235, 255, 0.8)',
      darkBg: 'rgba(28, 16, 38, 0.88)',
      border: 'border-pink-300/60 dark:border-pink-400/40',
      glow: '0 0 14px rgba(244, 114, 182, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.7)',
      activeGlowRim: '0 0 18px rgba(244, 114, 182, 0.65), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
      text: 'text-purple-900 dark:text-pink-100',
      badgeBg: 'bg-pink-100/80 dark:bg-pink-950/60 text-pink-800 dark:text-pink-200',
      accent: '#F472B6'
    },
    hero: {
      bg: 'rgba(248, 238, 255, 0.84)',
      darkBg: 'rgba(32, 18, 44, 0.92)',
      border: 'border-pink-300/70 dark:border-pink-400/50',
      glow: '0 0 20px rgba(244, 114, 182, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
      activeGlowRim: '0 0 24px rgba(244, 114, 182, 0.7), inset 0 1px 3px rgba(255, 255, 255, 0.9)',
      text: 'text-stone-900 dark:text-white',
      avatarGradient: 'from-[#F472B6] via-[#C084FC] to-[#2DD4BF]',
      subText: 'text-purple-700/80 dark:text-pink-200/80',
      accent: '#2DD4BF'
    },
    gridItem: {
      bg: 'rgba(248, 238, 255, 0.74)',
      darkBg: 'rgba(26, 14, 36, 0.84)',
      border: 'border-pink-300/40 dark:border-pink-400/30',
      glow: '0 0 10px rgba(244, 114, 182, 0.22)',
      activeGlowRim: '0 0 14px rgba(244, 114, 182, 0.5)',
      text: 'text-purple-900 dark:text-pink-100',
      accent: '#F472B6'
    },
    dock: {
      bg: 'rgba(245, 235, 255, 0.82)',
      darkBg: 'rgba(26, 14, 36, 0.92)',
      border: 'border-pink-300/60 dark:border-pink-400/45',
      glow: '0 0 16px rgba(244, 114, 182, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.7)',
      activeGlowRim: '0 0 20px rgba(244, 114, 182, 0.6)',
      btnBg: 'bg-pink-100/90 dark:bg-pink-900/50 text-purple-800 dark:text-pink-200 hover:text-teal-400',
      accent: '#F472B6'
    }
  },
  'liquid-titanium': {
    id: 'liquid-titanium',
    name: 'Liquid Titanium',
    stageBg: 'radial-gradient(circle at 50% 30%, rgba(148, 163, 184, 0.2) 0%, rgba(15, 23, 42, 0.98) 100%)',
    navbar: {
      bg: 'rgba(226, 232, 240, 0.82)',
      darkBg: 'rgba(30, 41, 59, 0.88)',
      border: 'border-slate-300/60 dark:border-slate-400/40',
      glow: '0 0 14px rgba(148, 163, 184, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.7)',
      activeGlowRim: '0 0 18px rgba(148, 163, 184, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
      text: 'text-slate-800 dark:text-slate-100',
      badgeBg: 'bg-slate-200/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300',
      accent: '#94A3B8'
    },
    hero: {
      bg: 'rgba(241, 245, 249, 0.86)',
      darkBg: 'rgba(30, 41, 59, 0.92)',
      border: 'border-slate-300/70 dark:border-slate-400/50',
      glow: '0 0 20px rgba(148, 163, 184, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
      activeGlowRim: '0 0 24px rgba(148, 163, 184, 0.65), inset 0 1px 3px rgba(255, 255, 255, 0.9)',
      text: 'text-stone-900 dark:text-white',
      avatarGradient: 'from-[#475569] via-[#94A3B8] to-[#E2E8F0]',
      subText: 'text-slate-600 dark:text-slate-300',
      accent: '#CBD5E1'
    },
    gridItem: {
      bg: 'rgba(241, 245, 249, 0.76)',
      darkBg: 'rgba(24, 32, 47, 0.84)',
      border: 'border-slate-300/40 dark:border-slate-400/30',
      glow: '0 0 10px rgba(148, 163, 184, 0.2)',
      activeGlowRim: '0 0 14px rgba(148, 163, 184, 0.45)',
      text: 'text-slate-800 dark:text-slate-200',
      accent: '#94A3B8'
    },
    dock: {
      bg: 'rgba(226, 232, 240, 0.84)',
      darkBg: 'rgba(24, 32, 47, 0.92)',
      border: 'border-slate-300/60 dark:border-slate-400/45',
      glow: '0 0 16px rgba(148, 163, 184, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.7)',
      activeGlowRim: '0 0 20px rgba(148, 163, 184, 0.6)',
      btnBg: 'bg-slate-200/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-cyan-400',
      accent: '#94A3B8'
    }
  }
};

/**
 * Skybox Gradient Definitions
 */
const SKYBOX_GRADIENTS = {
  'dark-studio': 'radial-gradient(circle at 50% 35%, rgba(30, 27, 46, 0.95) 0%, rgba(13, 9, 22, 0.98) 100%)',
  'cyber-city': 'radial-gradient(circle at 60% 30%, rgba(0, 242, 254, 0.22) 0%, rgba(255, 77, 109, 0.16) 45%, rgba(10, 6, 22, 0.98) 100%)',
  'cosmic-nebula': 'radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.25) 0%, rgba(59, 130, 246, 0.15) 50%, rgba(6, 4, 15, 0.98) 100%)',
  'sunset-horizon': 'radial-gradient(circle at 50% 60%, rgba(245, 158, 11, 0.22) 0%, rgba(244, 63, 94, 0.18) 45%, rgba(15, 10, 25, 0.98) 100%)'
};

/**
 * Camera Viewing Angle Presets (RotX, RotY)
 */
export const CAMERA_PRESET_ANGLES = {
  'isometric': { rotX: 18, rotY: -22 },
  'top-down': { rotX: 25, rotY: 0 },
  'dramatic-low': { rotX: -18, rotY: 20 },
  'flat-ortho': { rotX: 0, rotY: 0 },
  'eye-level': { rotX: 0, rotY: 0 },
  'cinematic': { rotX: 12, rotY: -15 }
};

/**
 * Helper to normalize component key for visual linking
 */
export function normalizeMiniKey(key) {
  if (!key) return null;
  const k = String(key).toLowerCase().trim();
  if (k === 'nav' || k === 'navbar' || k === 'navigation') return 'navbar';
  if (k === 'hero' || k === 'header' || k === 'avatar' || k === 'profilepic' || k === 'card3d') return 'hero';
  if (k === 'footer') return 'footer';
  if (k === 'dock' || k === 'floatingbutton') return 'dock';
  if (k === 'showcase' || k === 'cards' || k === 'grid' || k === 'container' || k === 'containercontent') return 'showcase';
  return k;
}

/**
 * UniversalMiniPortfolio
 *
 * Phase 2 & 5: Universal Top Mini-DOM Portfolio Sandbox with Bi-Directional Visual Linking
 *
 * A full-width, single-column Universal Sandbox rendering an interactive, living
 * Mini-DOM replica of the entire portfolio. Demonstrates real-time 3D tilt, dynamic
 * lighting angles, materials, stardust particles, volumetric fog, exploded strata,
 * and accent border halo pulse visual linking.
 */
export function UniversalMiniPortfolio({
  className = '',
  showControls = true,
  compact = false,
  defaultTilt = { rotX: 0, rotY: 0 },
  sandboxTilt,
  onPointerDown: externalPointerDown,
  onPointerMove: externalPointerMove,
  onPointerUp: externalPointerUp,
  onResetOrientation,
  wireframeActive,
  onToggleWireframe,
  highlightedComponent = null,
  onHighlightComponent
}) {
  const lab3D = useLab3D ? useLab3D() : null;
  const threeD = lab3D?.threeD || {};

  const isMaster3DOn = threeD.master3D ?? true;
  const masterTheme = threeD.masterTheme || 'apple-glass';
  const elements = threeD.elements || {};
  const lighting = threeD.lighting || { angle: 45, shadowSoftness: 0.6 };
  const camera = threeD.camera || { perspectiveFOV: 1000, tiltSensitivity: 1.0 };
  const materials = threeD.materials || { preset: 'glass-acrylic', bevelExtrusion: 4, specularGlow: 0.5 };
  const physics = threeD.physics || { hoverPop: 12, elasticity: 'snappy', clickDepression: true, magneticPull: false, gravityDrop: false };
  const exploded = threeD.exploded || { enabled: false, separationDistance: 40, ghostOpacity: 0.4, layerStagger: 15, blueprintMode: false };
  const environment = threeD.environment || { skybox: 'dark-studio', fogDensity: 20, stardustParticles: true, particleCount: 30 };
  const performanceConfig = threeD.performance || { fpsTarget: 60, autoThrottleIdle: true, gpuAcceleration: 'standard', lowPowerThreshold: true, showTelemetryHud: true };
  const customMesh = threeD.customMesh || { type: 'avatar', customName: 'Atul Verma Avatar', scale: 1.0 };

  const hoverPop = typeof physics.hoverPop === 'number' ? physics.hoverPop : 12;
  const elasticityMode = physics.elasticity && ELASTICITY_TRANSITIONS[physics.elasticity] ? physics.elasticity : 'snappy';
  const activeElasticity = ELASTICITY_TRANSITIONS[elasticityMode] || ELASTICITY_TRANSITIONS.snappy;
  const isClickDepressionEnabled = physics.clickDepression ?? true;
  const isMagneticPullEnabled = Boolean(physics.magneticPull);
  const isGravityDrop = Boolean(physics.gravityDrop);

  // Kinetic state for hover elevation pop & click depression
  const [hoveredElement, setHoveredElement] = useState(null);
  const [depressedElement, setDepressedElement] = useState(null);

  const themeStyle = THEME_PORTFOLIO_STYLES[masterTheme] || THEME_PORTFOLIO_STYLES['apple-glass'];

  // Stratum Isolation & Solo Mode logic (Feature 3)
  const isExplodedActive = Boolean(exploded?.enabled);
  const rawSolo = exploded?.soloStrata;
  const soloMode = (!isExplodedActive || !rawSolo || rawSolo === 'none') ? null : rawSolo;
  const isChassisSolo = soloMode === 'chassis' || soloMode === 'strata-01';
  const isContentSolo = soloMode === 'content' || soloMode === 'strata-02';
  const isDockSolo = soloMode === 'dock' || soloMode === 'strata-03';

  const getStrataDimStyle = (stratumKey) => {
    if (!soloMode) return {};
    let isTarget = false;
    if (stratumKey === 'chassis' && isChassisSolo) isTarget = true;
    if (stratumKey === 'content' && isContentSolo) isTarget = true;
    if (stratumKey === 'dock' && isDockSolo) isTarget = true;

    if (isTarget) {
      return {
        opacity: 1,
        filter: 'none',
        boxShadow: '0 0 24px rgba(6, 182, 212, 0.45)'
      };
    }
    return {
      opacity: 0.15,
      filter: 'grayscale(80%)',
      pointerEvents: 'none'
    };
  };

  // Reactive Dark Mode Detector for theme styling
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark') || document.body.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // 10 Element Toggles state mapping (live 3D pop/flat response)
  const isNav3D = isMaster3DOn && (Boolean(elements.navbarItems) || Boolean(elements.navbarIcons));
  const isProfilePic3D = isMaster3DOn && Boolean(elements.profilePic);
  const isHeader3D = isMaster3DOn && Boolean(elements.header);
  const isSubHeader3D = isMaster3DOn && Boolean(elements.subHeader);
  const isDescription3D = isMaster3DOn && Boolean(elements.description);
  const isHeroAny3D = isProfilePic3D || isHeader3D || isSubHeader3D || isDescription3D;
  const isContainer3D = isMaster3DOn && Boolean(elements.container);
  const isContent3D = isMaster3DOn && Boolean(elements.containerContent);
  const isGrid3D = isContainer3D || isContent3D;
  const isFloatBtn3D = isMaster3DOn && Boolean(elements.floatingButton);
  const isResumeBtn3D = isMaster3DOn && Boolean(elements.resumeButton);
  const isDock3D = isFloatBtn3D || isResumeBtn3D;

  // Z-Elevation Calculations honoring 10 element toggles & exploded strata
  const zNav = isMaster3DOn
    ? (isNav3D ? (18 + 24) : 0) + (exploded.enabled ? exploded.layerStagger * 2 : 0)
    : 0;

  const zHero = isMaster3DOn
    ? (36 + (isHeroAny3D ? 16 : 0) + (exploded.enabled ? exploded.layerStagger * 3 : 0))
    : 0;

  const zGrid = isMaster3DOn
    ? ((isGrid3D ? (24 + 20) : 0) + (exploded.enabled ? exploded.layerStagger : 0))
    : 0;

  const zDock = isMaster3DOn
    ? ((isDock3D ? (42 + 40) : 0) + (exploded.enabled ? exploded.layerStagger * 4 : 0))
    : 0;

  const zFooter = isMaster3DOn ? (10 + (exploded.enabled ? 0 : 0)) : 0;

  const isCompact = compact || !showControls;
  const stageRef = useRef(null);

  // Internal rotation state with smooth damping (falls back to props.sandboxTilt if provided)
  const [internalTilt, setInternalTilt] = useState(defaultTilt);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredDockIcon, setHoveredDockIcon] = useState(null);
  const [internalWireframe, setInternalWireframe] = useState(false);

  // Exporter progress & recording state (Feature 4)
  const [isRecordingTurntable, setIsRecordingTurntable] = useState(false);
  const [turntableProgress, setTurntableProgress] = useState(0);
  const [isCapturingSnapshot, setIsCapturingSnapshot] = useState(false);
  const [exportNotice, setExportNotice] = useState(null);

  // Interactive Sun Handle Gizmo Dragging State (Feature 2)
  const [isDraggingSun, setIsDraggingSun] = useState(false);
  const sunLastClickDegRef = useRef(lighting.angle ?? 45);

  // Real-Time FPS and Frame Latency Telemetry (Feature 8)
  const [telemetry, setTelemetry] = useState({ fps: 60, latency: 16.6 });
  const telemetryFrameCount = useRef(0);
  const telemetryLastTime = useRef(typeof performance !== 'undefined' ? performance.now() : Date.now());

  useEffect(() => {
    let animId;
    const tick = (now) => {
      telemetryFrameCount.current += 1;
      const delta = now - telemetryLastTime.current;
      if (delta >= 500) {
        const computedFps = Math.min(120, Math.round((telemetryFrameCount.current * 1000) / delta));
        const computedLatency = (1000 / Math.max(1, computedFps)).toFixed(1);
        setTelemetry({ fps: computedFps, latency: parseFloat(computedLatency) });
        telemetryFrameCount.current = 0;
        telemetryLastTime.current = now;
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Camera Angle Presets Listener
  const prevAnglePresetRef = useRef(camera.anglePreset);
  useEffect(() => {
    if (camera.anglePreset && camera.anglePreset !== prevAnglePresetRef.current) {
      prevAnglePresetRef.current = camera.anglePreset;
      if (!isDragging) {
        const targetAngle = CAMERA_PRESET_ANGLES[camera.anglePreset] || { rotX: 0, rotY: 0 };
        setInternalTilt(targetAngle);
      }
    }
  }, [camera.anglePreset, isDragging]);

  // Turntable Auto-Orbit Animation Loop
  useEffect(() => {
    if (!camera.autoOrbit || isDragging) return;

    let animId;
    const speed = typeof camera.orbitSpeed === 'number' ? camera.orbitSpeed : 1.0;
    const step = speed * 0.35;

    const orbitLoop = () => {
      setInternalTilt((prev) => {
        let nextRotY = prev.rotY + step;
        if (nextRotY > 180) nextRotY -= 360;
        else if (nextRotY < -180) nextRotY += 360;
        return {
          rotX: prev.rotX,
          rotY: Math.round(nextRotY * 10) / 10
        };
      });
      animId = requestAnimationFrame(orbitLoop);
    };

    animId = requestAnimationFrame(orbitLoop);

    return () => {
      if (animId) {
        cancelAnimationFrame(animId);
      }
    };
  }, [camera.autoOrbit, camera.orbitSpeed, isDragging]);

  const containerRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: 190, y: 280 });

  // Initialize cursorPos to center of container
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setCursorPos({
          x: Math.round(rect.width / 2),
          y: Math.round(rect.height / 2)
        });
      }
    }
  }, []);

  const tilt = sandboxTilt || internalTilt;

  // Active wireframe state can be controlled via prop or internal toggle or exploded blueprint mode
  const isWireframe = wireframeActive !== undefined
    ? wireframeActive
    : (internalWireframe || exploded.blueprintMode);

  // Bi-directional visual linking states
  const isNavHighlighted = normalizeMiniKey(highlightedComponent) === 'navbar';
  const isHeroHighlighted = normalizeMiniKey(highlightedComponent) === 'hero';
  const isGridHighlighted = normalizeMiniKey(highlightedComponent) === 'showcase';
  const isDockHighlighted = normalizeMiniKey(highlightedComponent) === 'dock';
  const isFooterHighlighted = normalizeMiniKey(highlightedComponent) === 'footer';

  // Kinetic interaction handlers for mini elements (Hover Pop & Click Depression)
  const handleElementMouseEnter = useCallback((elementKey) => {
    setHoveredElement(elementKey);
    onHighlightComponent?.(elementKey === 'grid' ? 'showcase' : elementKey);
  }, [onHighlightComponent]);

  const handleElementMouseLeave = useCallback((elementKey) => {
    setHoveredElement((prev) => (prev === elementKey ? null : prev));
    setDepressedElement((prev) => (prev === elementKey ? null : prev));
    onHighlightComponent?.(null);
  }, [onHighlightComponent]);

  const handleElementPointerDown = useCallback((elementKey) => {
    if (isClickDepressionEnabled) {
      setDepressedElement(elementKey);
      try {
        soundFX?.playHapticClick?.();
      } catch {
        // Safe audio fallback
      }
    }
  }, [isClickDepressionEnabled]);

  const handleElementPointerUp = useCallback((elementKey) => {
    setDepressedElement((prev) => (prev === elementKey ? null : prev));
  }, []);

  // Magnetic micro-tilt calculation for hovered element
  const magneticTilt = useMemo(() => {
    if (!isMagneticPullEnabled || !hoveredElement || !containerRef.current) {
      return { rotX: 0, rotY: 0 };
    }
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width || 384;
    const height = rect.height || 560;
    const relX = (cursorPos.x - width / 2) / (width / 2);
    const relY = (cursorPos.y - height / 2) / (height / 2);
    const clampedX = Math.max(-1, Math.min(1, relX));
    const clampedY = Math.max(-1, Math.min(1, relY));
    return {
      rotX: Math.round(-clampedY * 8 * 10) / 10,
      rotY: Math.round(clampedX * 10 * 10) / 10
    };
  }, [isMagneticPullEnabled, hoveredElement, cursorPos]);

  // Dynamic Z elevation factoring hover pop and click depression
  const getElementZ = useCallback((elementKey, baseZ) => {
    if (!isMaster3DOn) return 0;
    let z = baseZ;
    if (hoveredElement === elementKey) {
      z += hoverPop;
    }
    if (isClickDepressionEnabled && depressedElement === elementKey) {
      z -= 6;
    }
    return z;
  }, [isMaster3DOn, hoveredElement, hoverPop, isClickDepressionEnabled, depressedElement]);

  const getGravityDropTransform = useCallback((elementKey) => {
    switch (elementKey) {
      case 'navbar':
        return 'translateY(180px) rotateZ(-12deg) rotateX(25deg)';
      case 'hero':
        return 'translateY(220px) rotateZ(8deg) rotateX(-15deg)';
      case 'grid':
      case 'grid-0':
      case 'grid-1':
        return 'translateY(160px) rotateZ(-6deg)';
      case 'dock':
        return 'translateY(140px) rotateZ(10deg)';
      case 'footer':
        return 'translateY(90px) rotateZ(4deg)';
      default:
        return 'translateY(160px) rotateZ(-6deg)';
    }
  }, []);

  // Combined 3D transform incorporating base Z, hover pop, click depression, gravity drop and magnetic micro-tilt
  const getElementTransform = useCallback((elementKey, baseZ) => {
    if (!isMaster3DOn) return 'translateZ(0px)';
    const z = getElementZ(elementKey, baseZ);
    if (isGravityDrop) {
      return `translateZ(${z}px) ${getGravityDropTransform(elementKey)}`;
    }
    if (isMagneticPullEnabled && hoveredElement === elementKey) {
      return `translateZ(${z}px) rotateX(${magneticTilt.rotX}deg) rotateY(${magneticTilt.rotY}deg)`;
    }
    return `translateZ(${z}px)`;
  }, [isMaster3DOn, getElementZ, isGravityDrop, getGravityDropTransform, isMagneticPullEnabled, hoveredElement, magneticTilt]);

  const gravityGroundShadow = '0 30px 45px -10px rgba(0, 0, 0, 0.75), 0 15px 20px -8px rgba(0, 0, 0, 0.6)';

  const renderAvatarGeometry = () => {
    const meshType = customMesh.type || 'avatar';
    const meshScale = customMesh.scale || 1.0;

    if (meshType === 'gem') {
      return (
        <div
          data-testid="mini-mesh-gem"
          className="w-9 h-9 rounded-full bg-[#181226] border border-cyan-400/50 shadow-lg flex items-center justify-center overflow-hidden"
          style={{ transform: `scale(${meshScale})` }}
        >
          <GemMeshVisual scale={0.7} />
        </div>
      );
    }

    if (meshType === 'cube') {
      return (
        <div
          data-testid="mini-mesh-cube"
          className="w-9 h-9 rounded-full bg-[#181226] border border-cyan-400/60 shadow-[0_0_15px_rgba(0,242,254,0.4)] flex items-center justify-center overflow-hidden"
          style={{ transform: `scale(${meshScale})` }}
        >
          <CyberCubeMeshVisual scale={0.75} />
        </div>
      );
    }

    if (meshType === 'custom') {
      return (
        <div
          data-testid="mini-mesh-custom"
          className="w-9 h-9 rounded-full bg-[#181226] border border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.4)] flex flex-col items-center justify-center text-center p-0.5"
          style={{ transform: `scale(${meshScale})` }}
          title={customMesh.customName || 'Custom Model'}
        >
          <Box className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span className="text-[6.5px] font-mono font-bold text-purple-200 truncate max-w-[30px]">
            {customMesh.customName ? customMesh.customName.slice(0, 4) : 'OBJ'}
          </span>
        </div>
      );
    }

    // Default 'avatar': Classic gaze-tracking developer portrait with dynamic 3D elevation
    return (
      <div
        data-testid="mini-mesh-avatar"
        className={`w-9 h-9 rounded-full bg-gradient-to-tr ${themeStyle.hero.avatarGradient} p-0.5 shadow-md flex items-center justify-center`}
        style={{ transform: `scale(${meshScale})` }}
      >
        <div className="w-full h-full rounded-full bg-[#181226] flex items-center justify-center text-[10px] font-bold text-white">
          AV
        </div>
      </div>
    );
  };

  const dragStartRef = useRef({ x: 0, y: 0, startRotX: defaultTilt.rotX, startRotY: defaultTilt.rotY });
  const rafRef = useRef(null);

  // Pointer drag handlers for gyroscope & orbit rotation
  const handlePointerDown = useCallback((e) => {
    if (!isMaster3DOn) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Fallback if pointer capture is not supported
    }
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startRotX: tilt.rotX,
      startRotY: tilt.rotY
    };
    if (typeof externalPointerDown === 'function') {
      externalPointerDown(e);
    }
  }, [isMaster3DOn, tilt.rotX, tilt.rotY, externalPointerDown]);

  const handlePointerMove = useCallback((e) => {
    const containerEl = containerRef.current || e.currentTarget;
    if (containerEl) {
      const rect = containerEl.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;
      setCursorPos({
        x: Math.round(clientX - rect.left),
        y: Math.round(clientY - rect.top)
      });

      // Feature 5: Real-Time Binaural 3D Spatial Audio Node & Coordinate Panner
      if (threeD.spatialAudio?.binauralPanning) {
        const normX = ((clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
        soundFX.setPanning(Math.max(-1.0, Math.min(1.0, normX)));
      }
    }

    if (typeof externalPointerMove === 'function') {
      externalPointerMove(e);
    }

    if (!isDragging || !isMaster3DOn) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const deltaX = clientX - dragStartRef.current.x;
      const deltaY = clientY - dragStartRef.current.y;
      const sensitivity = (camera.tiltSensitivity ?? 1.0) * 0.22;

      // rotX maps to deltaY (vertical movement), clamped to [-25, 25]
      const rawRotX = dragStartRef.current.startRotX - deltaY * sensitivity;
      const clampedRotX = Math.max(-25, Math.min(25, Math.round(rawRotX)));

      // rotY maps to deltaX (horizontal movement), clamped to [-35, 35]
      const rawRotY = dragStartRef.current.startRotY + deltaX * sensitivity;
      const clampedRotY = Math.max(-35, Math.min(35, Math.round(rawRotY)));

      setInternalTilt({ rotX: clampedRotX, rotY: clampedRotY });
      rafRef.current = null;
    });
  }, [isDragging, isMaster3DOn, camera.tiltSensitivity, externalPointerMove]);

  const handlePointerUp = useCallback((e) => {
    setDepressedElement(null);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (isDragging) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
      setIsDragging(false);
      if (typeof externalPointerUp === 'function') {
        externalPointerUp(e);
      }
    }
  }, [isDragging, externalPointerUp]);

  const handlePointerLeave = useCallback((e) => {
    setHoveredElement(null);
    setDepressedElement(null);
    if (isDragging) {
      handlePointerUp(e);
    }
  }, [isDragging, handlePointerUp]);

  const handleReset = useCallback(() => {
    setInternalTilt({ rotX: 0, rotY: 0 });
    if (typeof onResetOrientation === 'function') {
      onResetOrientation();
    }
  }, [onResetOrientation]);

  const handleWireframeToggle = useCallback(() => {
    if (typeof onToggleWireframe === 'function') {
      onToggleWireframe(!isWireframe);
    } else {
      setInternalWireframe((prev) => !prev);
    }
  }, [isWireframe, onToggleWireframe]);

  // Feature 4: Snapshot and Turntable Video Export Handlers
  const handleTakeSnapshot = useCallback(async () => {
    if (isCapturingSnapshot) return;
    setIsCapturingSnapshot(true);
    try {
      soundFX.playPolaroidShutter();
      const el = containerRef.current;
      const filename = await capture3DStageSnapshot(el, 'portfolio-3d-snapshot');
      setExportNotice({ type: 'success', message: `Saved ${filename}` });
      setTimeout(() => setExportNotice(null), 3500);
    } catch (err) {
      setExportNotice({ type: 'error', message: err.message || 'Snapshot failed' });
      setTimeout(() => setExportNotice(null), 3500);
    } finally {
      setIsCapturingSnapshot(false);
    }
  }, [isCapturingSnapshot]);

  const handleRecordTurntable = useCallback(async () => {
    if (isRecordingTurntable) return;
    setIsRecordingTurntable(true);
    setTurntableProgress(0);
    soundFX.playLaserFocus();
    try {
      const el = containerRef.current;
      const filename = await record360TurntableVideo(el, {
        durationMs: 5000,
        fps: 60,
        onRotate: (deg) => {
          setInternalTilt({ rotX: 18, rotY: (deg % 360) - 180 });
        },
        onProgress: (p) => {
          setTurntableProgress(Math.round(p * 100));
        }
      });
      soundFX.playCrystalChime();
      setExportNotice({ type: 'success', message: `Recorded ${filename}` });
      setTimeout(() => setExportNotice(null), 4000);
    } catch (err) {
      setExportNotice({ type: 'error', message: err.message || 'Turntable recording failed' });
      setTimeout(() => setExportNotice(null), 4000);
    } finally {
      setIsRecordingTurntable(false);
      setTurntableProgress(0);
    }
  }, [isRecordingTurntable]);

  // Feature 2: Interactive Sun Handle Pointer Handlers
  const handleSunPointerDown = useCallback((e) => {
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Safe fallback
    }
    setIsDraggingSun(true);
    soundFX.playHapticClick();
  }, []);

  const handleSunPointerMove = useCallback((e) => {
    if (!isDraggingSun) return;
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const angleDeg = Math.round((Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360);

    if (Math.abs(angleDeg - sunLastClickDegRef.current) >= 15) {
      soundFX.playHapticClick();
      sunLastClickDegRef.current = angleDeg;
    }

    if (lab3D && typeof lab3D.set3DLightingAngle === 'function') {
      lab3D.set3DLightingAngle(angleDeg);
    } else if (lab3D && typeof lab3D.set3DLighting === 'function') {
      lab3D.set3DLighting({ angle: angleDeg });
    }
  }, [isDraggingSun, lab3D]);

  const handleSunPointerUp = useCallback((e) => {
    if (!isDraggingSun) return;
    e.stopPropagation();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Safe fallback
    }
    setIsDraggingSun(false);
    soundFX.playHapticClick();
  }, [isDraggingSun]);

  // Compute dynamic light directional shadow/highlight offset
  const lightRad = ((lighting.angle ?? 45) * Math.PI) / 180;
  const lightOffsetX = Math.round(Math.cos(lightRad) * 8);
  const lightOffsetY = Math.round(Math.sin(lightRad) * 8);

  const skyboxBg = SKYBOX_GRADIENTS[environment.skybox] || SKYBOX_GRADIENTS['dark-studio'];

  // Stardust particle positions (fixed pre-computed pool for CLS & zero allocation)
  const stardustPoints = useMemo(() => [
    { x: 8, y: 15, z: 20, delay: 0.1 },
    { x: 22, y: 65, z: -10, delay: 0.7 },
    { x: 35, y: 25, z: 35, delay: 1.2 },
    { x: 48, y: 80, z: 15, delay: 0.3 },
    { x: 62, y: 18, z: -25, delay: 1.5 },
    { x: 75, y: 70, z: 40, delay: 0.9 },
    { x: 88, y: 30, z: 10, delay: 0.4 },
    { x: 15, y: 45, z: 30, delay: 1.8 },
    { x: 82, y: 55, z: -15, delay: 1.1 },
    { x: 50, y: 40, z: 50, delay: 0.6 }
  ], []);

  // Materials Presets & Visual Surface Engine (Phase 1)
  const matPreset = materials.preset || 'glass-acrylic';
  const specularGlow = typeof materials.specularGlow === 'number' ? materials.specularGlow : 0.5;
  const bevelExtrusion = typeof materials.bevelExtrusion === 'number' ? materials.bevelExtrusion : 4;
  const roughness = typeof materials.roughness === 'number' ? materials.roughness : 0.25;
  const metalness = typeof materials.metalness === 'number' ? materials.metalness : 0.20;
  const ior = typeof materials.ior === 'number' ? materials.ior : 1.50;
  const clearcoat = typeof materials.clearcoat === 'number' ? materials.clearcoat : 0.40;

  const normalizedMaterialPreset = matPreset || 'glass-acrylic';

  const getMaterialSurfaceStyle = useCallback((elementKey, isElem3DActive = false) => {
    if (isWireframe) {
      return {};
    }

    const themeSection = elementKey === 'grid' ? themeStyle.gridItem : themeStyle[elementKey];
    const scale = elementKey === 'navbar' ? 0.5 : (elementKey === 'grid' ? 0.6 : 1.0);
    const activeGlow = isElem3DActive && themeSection?.activeGlowRim;
    const lightingPreset = lighting?.preset || 'studio-soft';

    // Compute illumination preset specific shadow tint and highlight intensity
    const getLightingPresetEffects = (baseBlur) => {
      switch (lightingPreset) {
        case 'sunset': {
          const warmShadow = `${lightOffsetX * scale}px ${lightOffsetY * scale}px ${baseBlur}px rgba(245, 158, 11, 0.25)`;
          const ambientWarmth = `0 ${Math.round(baseBlur * 0.8)}px ${Math.round(baseBlur * 1.5)}px rgba(180, 83, 9, ${isDark ? 0.35 : 0.2})`;
          const warmHighlight = specularGlow > 0 ? `inset 0 1px 2px rgba(254, 243, 199, ${0.4 + specularGlow * 0.4})` : '';
          return { shadow: `${warmShadow}, ${ambientWarmth}`, highlight: warmHighlight };
        }
        case 'cyber-neon':
        case 'cyber-spotlight': {
          const cyanGlow = `0 0 ${Math.round(baseBlur * 1.4)}px rgba(6, 182, 212, 0.45)`;
          const magentaRim = `inset 0 0 ${Math.round(baseBlur * 0.8)}px rgba(236, 72, 153, 0.35)`;
          const directionalShadow = `${lightOffsetX * scale}px ${lightOffsetY * scale}px ${baseBlur}px rgba(0, 0, 0, 0.55)`;
          return { shadow: `${directionalShadow}, ${cyanGlow}`, highlight: magentaRim };
        }
        case 'dramatic-side': {
          const hardShadow = `${Math.round(lightOffsetX * scale * 1.6)}px ${Math.round(lightOffsetY * scale * 1.6)}px ${Math.round(baseBlur * 0.8)}px rgba(0, 0, 0, ${isDark ? 0.6 : 0.45})`;
          const sharpHighlight = specularGlow > 0 ? `inset 0 1px 1px rgba(255, 255, 255, ${0.5 + specularGlow * 0.45})` : '';
          return { shadow: hardShadow, highlight: sharpHighlight };
        }
        case 'studio-soft':
        default: {
          const softShadow = `${lightOffsetX * scale}px ${lightOffsetY * scale}px ${baseBlur}px rgba(0, 0, 0, ${isDark ? 0.35 : 0.22})`;
          const softHighlight = specularGlow > 0 ? `inset 0 1px 1.5px rgba(255, 255, 255, ${0.3 + specularGlow * 0.45})` : '';
          return { shadow: softShadow, highlight: softHighlight };
        }
      }
    };

    switch (normalizedMaterialPreset) {
      // 1. POLISHED OAK WOOD
      case 'wood-oak': {
        const bg = isDark
          ? 'linear-gradient(135deg, #451a03 0%, #78350f 50%, #290e02 100%)'
          : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 45%, #d97706 85%, #b45309 100%)';
        const borderColor = isDark ? 'rgba(217, 119, 6, 0.55)' : 'rgba(180, 83, 9, 0.6)';
        const shadowBlur = Math.round(bevelExtrusion * (2.8 + roughness * 1.5));
        const { shadow: presetShadow, highlight: presetHighlight } = getLightingPresetEffects(shadowBlur);
        const satinSheen = `inset 0 1px 3px rgba(254, 243, 199, ${0.3 + specularGlow * 0.3})`;
        const shadow = isMaster3DOn ? [presetHighlight, satinSheen, presetShadow, activeGlow].filter(Boolean).join(', ') : 'none';
        return {
          background: bg,
          borderColor,
          boxShadow: shadow,
          backdropFilter: 'none'
        };
      }

      // 2. DARK WALNUT WOOD
      case 'wood-walnut': {
        const bg = isDark
          ? 'linear-gradient(135deg, #1c0f06 0%, #2e1a0b 50%, #150a04 100%)'
          : 'linear-gradient(135deg, #5c3a21 0%, #3d2314 60%, #26160c 100%)';
        const borderColor = isDark ? 'rgba(120, 53, 15, 0.6)' : 'rgba(69, 26, 3, 0.8)';
        const shadowBlur = Math.round(bevelExtrusion * (3.0 + roughness * 1.8));
        const { shadow: presetShadow, highlight: presetHighlight } = getLightingPresetEffects(shadowBlur);
        const shadow = isMaster3DOn ? [presetHighlight, presetShadow, activeGlow].filter(Boolean).join(', ') : 'none';
        return {
          background: bg,
          borderColor,
          boxShadow: shadow,
          backdropFilter: 'none'
        };
      }

      // 3. 24K POLISHED GOLD
      case 'metal-gold': {
        const bg = isDark
          ? 'linear-gradient(135deg, rgba(88, 55, 12, 0.96) 0%, rgba(146, 64, 14, 0.92) 48%, rgba(245, 158, 11, 0.98) 52%, rgba(55, 30, 5, 0.98) 100%)'
          : 'linear-gradient(135deg, rgba(254, 240, 138, 0.98) 0%, rgba(250, 204, 21, 0.94) 48%, rgba(255, 255, 255, 1) 52%, rgba(217, 119, 6, 0.95) 100%)';
        const borderColor = isDark ? 'rgba(250, 204, 21, 0.75)' : 'rgba(217, 119, 6, 0.85)';
        const shadowBlur = Math.round(bevelExtrusion * (3.0 + roughness * 2.0));
        const { shadow: presetShadow, highlight: presetHighlight } = getLightingPresetEffects(shadowBlur);
        const goldSheen = `inset 0 0 ${Math.round(14 * (1 - roughness))}px rgba(254, 240, 138, ${0.4 + metalness * 0.4})`;
        const shadow = isMaster3DOn ? [presetHighlight, goldSheen, presetShadow, activeGlow].filter(Boolean).join(', ') : 'none';
        return {
          background: bg,
          borderColor,
          boxShadow: shadow,
          backdropFilter: 'none'
        };
      }

      // 4. STERLING SILVER
      case 'metal-silver': {
        const bg = isDark
          ? 'linear-gradient(135deg, rgba(71, 85, 105, 0.95) 0%, rgba(30, 41, 59, 0.92) 48%, rgba(148, 163, 184, 0.98) 52%, rgba(15, 23, 42, 0.96) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(226, 232, 240, 0.95) 48%, rgba(255, 255, 255, 1) 52%, rgba(203, 213, 225, 0.94) 100%)';
        const borderColor = isDark ? 'rgba(226, 232, 240, 0.7)' : 'rgba(255, 255, 255, 0.9)';
        const shadowBlur = Math.round(bevelExtrusion * 3.0);
        const { shadow: presetShadow, highlight: presetHighlight } = getLightingPresetEffects(shadowBlur);
        const silverSheen = `inset 0 0 12px rgba(255, 255, 255, ${0.3 + metalness * 0.4})`;
        const shadow = isMaster3DOn ? [presetHighlight, silverSheen, presetShadow, activeGlow].filter(Boolean).join(', ') : 'none';
        return {
          background: bg,
          borderColor,
          boxShadow: shadow,
          backdropFilter: 'none'
        };
      }

      // 5. CAST INDUSTRIAL IRON
      case 'metal-iron': {
        const bg = isDark
          ? 'linear-gradient(135deg, #18191c 0%, #292a30 50%, #0f1012 100%)'
          : 'linear-gradient(135deg, #475569 0%, #334155 50%, #1e293b 100%)';
        const borderColor = isDark ? 'rgba(100, 116, 139, 0.5)' : 'rgba(30, 41, 59, 0.7)';
        const shadowBlur = Math.round(bevelExtrusion * 3.5);
        const { shadow: presetShadow, highlight: presetHighlight } = getLightingPresetEffects(shadowBlur);
        const shadow = isMaster3DOn ? [presetHighlight, presetShadow, activeGlow].filter(Boolean).join(', ') : 'none';
        return {
          background: bg,
          borderColor,
          boxShadow: shadow,
          backdropFilter: 'none'
        };
      }

      // 6. POLISHED STAINLESS STEEL
      case 'metal-steel':
      case 'metallic-gloss': {
        const bg = isDark
          ? `linear-gradient(135deg, rgba(${Math.round(65 + metalness * 40)}, ${Math.round(72 + metalness * 40)}, ${Math.round(88 + metalness * 50)}, 0.95) 0%, rgba(35, 40, 52, 0.92) 48%, rgba(${Math.round(90 + metalness * 50)}, ${Math.round(98 + metalness * 50)}, ${Math.round(118 + metalness * 60)}, 0.95) 52%, rgba(24, 28, 38, 0.95) 100%)`
          : `linear-gradient(135deg, rgba(238, 242, 248, 0.96) 0%, rgba(${Math.round(198 - metalness * 30)}, ${Math.round(208 - metalness * 30)}, ${Math.round(222 - metalness * 25)}, 0.92) 48%, rgba(255, 255, 255, 0.98) 52%, rgba(170, 182, 200, 0.94) 100%)`;
        const borderColor = isDark ? `rgba(200, 215, 235, ${0.5 + metalness * 0.4})` : `rgba(255, 255, 255, ${0.8 + metalness * 0.18})`;
        const shadowBlur = Math.round(bevelExtrusion * (3.0 + roughness * 2.0));
        const { shadow: presetShadow, highlight: presetHighlight } = getLightingPresetEffects(shadowBlur);
        const metallicSheen = `inset 0 0 ${Math.round(12 * (1 - roughness))}px rgba(255, 255, 255, ${0.2 + metalness * 0.4})`;
        const fresnelGlare = ior > 1.3 ? `0 0 ${Math.round((ior - 1) * 8)}px rgba(255, 255, 255, ${0.15 + (ior - 1) * 0.2})` : '';
        const shadow = isMaster3DOn ? [presetHighlight, metallicSheen, presetShadow, fresnelGlare, activeGlow].filter(Boolean).join(', ') : 'none';
        return {
          background: bg,
          borderColor,
          boxShadow: shadow,
          backdropFilter: roughness > 0.05 ? `blur(${Math.round(roughness * 12)}px)` : 'none'
        };
      }

      // 7. BRUSHED ALUMINIUM
      case 'metal-aluminium': {
        const bg = isDark
          ? 'linear-gradient(135deg, #334155 0%, #1e293b 50%, #0f172a 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)';
        const borderColor = isDark ? 'rgba(148, 163, 184, 0.5)' : 'rgba(203, 213, 225, 0.8)';
        const shadowBlur = Math.round(bevelExtrusion * 2.8);
        const { shadow: presetShadow, highlight: presetHighlight } = getLightingPresetEffects(shadowBlur);
        const shadow = isMaster3DOn ? [presetHighlight, presetShadow, activeGlow].filter(Boolean).join(', ') : 'none';
        return {
          background: bg,
          borderColor,
          boxShadow: shadow,
          backdropFilter: 'none'
        };
      }

      // 8. ANTIQUE BURNISHED COPPER
      case 'metal-copper': {
        const bg = isDark
          ? 'linear-gradient(135deg, #431407 0%, #7c2d12 48%, #ea580c 52%, #270b04 100%)'
          : 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 48%, #ffffff 52%, #ea580c 100%)';
        const borderColor = isDark ? 'rgba(234, 88, 12, 0.65)' : 'rgba(194, 65, 12, 0.8)';
        const shadowBlur = Math.round(bevelExtrusion * 3.0);
        const { shadow: presetShadow, highlight: presetHighlight } = getLightingPresetEffects(shadowBlur);
        const copperSheen = `inset 0 0 10px rgba(254, 215, 170, ${0.3 + metalness * 0.35})`;
        const shadow = isMaster3DOn ? [presetHighlight, copperSheen, presetShadow, activeGlow].filter(Boolean).join(', ') : 'none';
        return {
          background: bg,
          borderColor,
          boxShadow: shadow,
          backdropFilter: 'none'
        };
      }

      // 9. HIGH-GLOSS DIELECTRIC PLASTIC
      case 'plastic-gloss': {
        const bg = isDark
          ? 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 45%, #2563eb 70%, #1e40af 100%)'
          : 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 45%, #3b82f6 85%, #1d4ed8 100%)';
        const borderColor = isDark ? 'rgba(96, 165, 250, 0.7)' : 'rgba(37, 99, 235, 0.6)';
        const shadowBlur = Math.round(bevelExtrusion * 2.5);
        const { shadow: presetShadow, highlight: presetHighlight } = getLightingPresetEffects(shadowBlur);
        const glossyDot = 'inset 0 1.5px 2px rgba(255, 255, 255, 0.8)';
        const shadow = isMaster3DOn ? [glossyDot, presetHighlight, presetShadow, activeGlow].filter(Boolean).join(', ') : 'none';
        return {
          background: bg,
          borderColor,
          boxShadow: shadow,
          backdropFilter: 'none'
        };
      }

      // 10. MATTE POLYCARBONATE
      case 'plastic-matte': {
        const bg = isDark ? '#1e293b' : '#f1f5f9';
        const borderColor = isDark ? 'rgba(71, 85, 105, 0.6)' : 'rgba(203, 213, 225, 0.8)';
        const shadowBlur = Math.round(bevelExtrusion * 3.5);
        const { shadow: presetShadow } = getLightingPresetEffects(shadowBlur);
        const shadow = isMaster3DOn ? [presetShadow, activeGlow].filter(Boolean).join(', ') : 'none';
        return {
          background: bg,
          borderColor,
          boxShadow: shadow,
          backdropFilter: 'none'
        };
      }

      // 11. ITALIAN CARRARA MARBLE
      case 'stone-marble': {
        const bg = isDark
          ? 'linear-gradient(135deg, #334155 0%, #1e293b 60%, #0f172a 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)';
        const borderColor = isDark ? 'rgba(148, 163, 184, 0.4)' : 'rgba(203, 213, 225, 0.9)';
        const shadowBlur = Math.round(bevelExtrusion * 3.0);
        const { shadow: presetShadow, highlight: presetHighlight } = getLightingPresetEffects(shadowBlur);
        const porcelainSheen = 'inset 0 1px 3px rgba(255, 255, 255, 0.85)';
        const shadow = isMaster3DOn ? [porcelainSheen, presetHighlight, presetShadow, activeGlow].filter(Boolean).join(', ') : 'none';
        return {
          background: bg,
          borderColor,
          boxShadow: shadow,
          backdropFilter: 'none'
        };
      }

      // 12. DUAL-AXIS CARBON FIBER
      case 'carbon-fiber': {
        const bg = isDark
          ? 'linear-gradient(135deg, #171717 0%, #262626 50%, #0a0a0a 100%)'
          : 'linear-gradient(135deg, #404040 0%, #525252 50%, #262626 100%)';
        const borderColor = isDark ? 'rgba(115, 115, 115, 0.5)' : 'rgba(82, 82, 82, 0.8)';
        const shadowBlur = Math.round(bevelExtrusion * 3.0);
        const { shadow: presetShadow, highlight: presetHighlight } = getLightingPresetEffects(shadowBlur);
        const weaveSheen = 'inset 0 0 10px rgba(255, 255, 255, 0.2)';
        const shadow = isMaster3DOn ? [weaveSheen, presetHighlight, presetShadow, activeGlow].filter(Boolean).join(', ') : 'none';
        return {
          background: bg,
          borderColor,
          boxShadow: shadow,
          backdropFilter: 'none'
        };
      }

      // 13. EMERALD CRYSTAL GEMSTONE
      case 'gem-emerald': {
        const bg = isDark
          ? 'linear-gradient(135deg, #064e3b 0%, #047857 45%, #10b981 70%, #022c22 100%)'
          : 'linear-gradient(135deg, #d1fae5 0%, #6ee7b7 45%, #10b981 85%, #047857 100%)';
        const borderColor = isDark ? 'rgba(52, 211, 153, 0.7)' : 'rgba(16, 185, 129, 0.8)';
        const shadowBlur = Math.round(bevelExtrusion * 3.5);
        const { shadow: presetShadow, highlight: presetHighlight } = getLightingPresetEffects(shadowBlur);
        const crystalSheen = '0 0 14px rgba(16, 185, 129, 0.4), inset 0 0 10px rgba(167, 243, 208, 0.5)';
        const shadow = isMaster3DOn ? [crystalSheen, presetHighlight, presetShadow, activeGlow].filter(Boolean).join(', ') : 'none';
        return {
          background: bg,
          borderColor,
          boxShadow: shadow,
          backdropFilter: 'none'
        };
      }

      // 14. NEUMORPHIC / TERRACOTTA CLAY
      case 'clay-terracotta':
      case 'neumorphic-clay': {
        const isTerracotta = normalizedMaterialPreset === 'clay-terracotta';
        const bg = isTerracotta
          ? (isDark ? '#431407' : '#ea580c')
          : (isDark ? '#221B2E' : '#ECE8DF');
        const borderColor = isTerracotta
          ? (isDark ? 'rgba(194, 65, 12, 0.6)' : 'rgba(251, 146, 60, 0.7)')
          : (isDark ? 'rgba(47, 37, 64, 0.85)' : 'rgba(222, 215, 203, 0.85)');
        const blurAmt = Math.round(bevelExtrusion * (2.5 + roughness * 2.5) + 4);
        const { shadow: presetShadow, highlight: presetHighlight } = getLightingPresetEffects(blurAmt);
        const darkShadow = `${lightOffsetX * scale}px ${lightOffsetY * scale}px ${blurAmt}px ${isDark ? 'rgba(10, 8, 16, 0.65)' : 'rgba(175, 166, 152, 0.55)'}`;
        const lightHighlight = `${-lightOffsetX * scale}px ${-lightOffsetY * scale}px ${blurAmt}px ${isDark ? 'rgba(58, 48, 78, 0.5)' : 'rgba(255, 255, 255, 0.9)'}`;
        const shadow = isMaster3DOn
          ? [darkShadow, lightHighlight, presetShadow, presetHighlight, activeGlow].filter(Boolean).join(', ')
          : 'none';
        return {
          background: bg,
          borderColor,
          boxShadow: shadow,
          backdropFilter: 'none'
        };
      }

      // 15. CYBER WIREFRAME
      case 'cyber-wireframe': {
        const bg = 'rgba(8, 6, 17, 0.92)';
        const borderColor = 'rgba(6, 182, 212, 0.85)';
        const glowOuter = Math.round((10 + specularGlow * 15) * (1.2 - roughness * 0.4));
        const glowInner = Math.round((6 + specularGlow * 10) * (1.2 - roughness * 0.4));
        const { shadow: presetShadow, highlight: presetHighlight } = getLightingPresetEffects(glowOuter);
        const baseShadow = `0 0 ${glowOuter}px rgba(6, 182, 212, ${0.3 + specularGlow * 0.35}), inset 0 0 ${glowInner}px rgba(255, 0, 122, ${0.2 + specularGlow * 0.25})`;
        const shadow = isMaster3DOn
          ? [baseShadow, presetShadow, presetHighlight, activeGlow].filter(Boolean).join(', ')
          : 'none';
        return {
          background: bg,
          borderColor,
          boxShadow: shadow,
          backdropFilter: 'blur(8px)'
        };
      }

      // 16. GLASS ACRYLIC (DEFAULT)
      case 'glass-acrylic':
      default: {
        const bg = isDark
          ? (themeSection?.darkBg || 'rgba(24, 18, 38, 0.72)')
          : (themeSection?.bg || 'rgba(255, 255, 255, 0.78)');
        const borderColor = isDark ? `rgba(255, 255, 255, ${0.12 + (ior - 1) * 0.08})` : `rgba(255, 255, 255, ${0.4 + (ior - 1) * 0.15})`;
        const shadowBlur = Math.round(bevelExtrusion * (elementKey === 'hero' ? 4 : (elementKey === 'grid' ? 3 : 3.5)) * (0.8 + roughness * 0.5));
        const { shadow: presetShadow, highlight: presetHighlight } = getLightingPresetEffects(shadowBlur);
        const fresnelGlare = ior > 1.2 ? `inset 0 0 ${Math.round(8 * (ior - 1))}px rgba(255, 255, 255, ${0.2 + (ior - 1) * 0.25})` : '';
        const clearcoatSheen = clearcoat > 0 ? `0 0 ${Math.round(clearcoat * 10)}px rgba(255, 255, 255, ${clearcoat * 0.25})` : '';
        const shadow = isMaster3DOn
          ? [presetHighlight, fresnelGlare, clearcoatSheen, presetShadow, activeGlow].filter(Boolean).join(', ')
          : 'none';
        return {
          background: bg,
          borderColor,
          boxShadow: shadow,
          backdropFilter: `blur(${Math.max(4, Math.round(16 + roughness * 16))}px)`
        };
      }
    }
  }, [isWireframe, themeStyle, normalizedMaterialPreset, isDark, bevelExtrusion, isMaster3DOn, specularGlow, lightOffsetX, lightOffsetY, lighting?.preset, roughness, metalness, ior, clearcoat]);

  const matNavStyle = getMaterialSurfaceStyle('navbar', isNav3D);
  const matHeroStyle = getMaterialSurfaceStyle('hero', isHeroAny3D);
  const matGridStyle = getMaterialSurfaceStyle('grid', isGrid3D);
  const matDockStyle = getMaterialSurfaceStyle('dock', isDock3D);

  const hasCustomHeight = /(?:^|\s)(?:h-|min-h-|max-h-)/.test(className);
  const heightClass = hasCustomHeight
    ? ''
    : isCompact
      ? 'h-auto min-h-0 max-h-fit py-2.5 sm:py-3'
      : 'min-h-[560px] sm:h-[600px]';

  const containerFrameClass = compact
    ? 'border-0 bg-transparent shadow-none p-0'
    : 'rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] shadow-inner';

  return (
    <div className={`universal-mini-portfolio w-full flex flex-col ${isCompact ? 'gap-0' : 'gap-3'} ${className}`}>
      {/* Top Toolbar Controls */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/70 dark:bg-[#181226]/80 border border-[#E7E2D8] dark:border-[#2D2340] backdrop-blur-md shadow-2xs text-xs">
          {/* Telemetry Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-3 h-3 animate-pulse text-cyan-500" />
              <span>Universal Portfolio Replica</span>
            </span>

            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800">
              Live CSS 3D
            </span>
          </div>

          {/* Orientation & Lighting Readout */}
          <div className="flex items-center gap-2">
            <div className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 text-stone-600 dark:text-stone-300">
              Rot: {tilt.rotX}°, {tilt.rotY}° | Light: {lighting.angle ?? 45}°
            </div>

            {/* Snapshot (.webp) Button */}
            <button
              type="button"
              onClick={handleTakeSnapshot}
              disabled={isCapturingSnapshot}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 font-mono text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
              title="Snapshot (.webp) — Capture 3D Stage"
              aria-label="Snapshot (.webp)"
            >
              <Camera className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">{isCapturingSnapshot ? 'Capturing...' : 'Snapshot (.webp)'}</span>
            </button>

            {/* Record 360° Spin (.webm) Button */}
            <button
              type="button"
              onClick={handleRecordTurntable}
              disabled={isRecordingTurntable}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 font-mono text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
              title="Record 360° Spin (.webm) — Cinematic Turntable Loop"
              aria-label="Record 360° Spin (.webm)"
            >
              <Film className={`w-3.5 h-3.5 ${isRecordingTurntable ? 'text-rose-500 animate-pulse' : 'text-cyan-500'}`} />
              <span className="hidden sm:inline">
                {isRecordingTurntable ? `Recording ${turntableProgress}%` : 'Record 360° Spin (.webm)'}
              </span>
            </button>

            {/* Wireframe / CAD Mode Toggle */}
            <button
              type="button"
              onClick={handleWireframeToggle}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs font-semibold border transition-all cursor-pointer shadow-2xs active:scale-95 ${
                isWireframe
                  ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-500/50 shadow-cyan-500/10'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700'
              }`}
              title={isWireframe ? 'Disable Blueprint Wireframe' : 'Enable Blueprint Wireframe'}
              aria-label="Toggle CAD Wireframe Mode"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isWireframe ? 'CAD Active' : 'CAD Wireframe'}</span>
            </button>

            {/* Quick Reset Orientation */}
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 font-mono text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Reset Sandbox Orientation to 0°, 0°"
              aria-label="Reset Sandbox Orientation"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Sandbox Viewport Container */}
      <SandboxViewportContainer
        ref={containerRef}
        perspective={camera.perspectiveFOV || 1000}
        className={`w-full ${heightClass} ${containerFrameClass} relative flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none touch-none transition-colors duration-500 ${
          isWireframe && !compact ? 'bg-cyan-950/40' : ''
        }`}
        style={{
          ...(compact ? {} : {
            background: isWireframe
              ? 'radial-gradient(circle at center, rgba(0, 242, 254, 0.12) 0%, rgba(6, 15, 30, 0.98) 100%)'
              : (themeStyle?.stageBg || skyboxBg)
          }),
          '--3d-materials-preset': normalizedMaterialPreset,
          '--3d-specular-glow': specularGlow,
          '--3d-materials-bevel': `${bevelExtrusion}px`,
          '--3d-roughness': roughness,
          '--3d-metalness': metalness,
          '--3d-ior': ior,
          '--3d-clearcoat': clearcoat,
          '--3d-hover-pop': `${hoverPop}px`,
          '--3d-physics-curve': activeElasticity.curve
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerUp}
      >
        {/* Illumination Atmosphere Preset Overlay */}
        {lighting.preset === 'sunset' && !isWireframe && (
          <div
            className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.14) 0%, rgba(239, 68, 68, 0.08) 50%, transparent 100%)',
              mixBlendMode: 'color-dodge'
            }}
          />
        )}
        {(lighting.preset === 'cyber-neon' || lighting.preset === 'cyber-spotlight') && !isWireframe && (
          <div
            className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500"
            style={{
              background: 'radial-gradient(ellipse at 80% 20%, rgba(6, 182, 212, 0.14) 0%, rgba(236, 72, 153, 0.1) 60%, transparent 100%)',
              mixBlendMode: 'screen'
            }}
          />
        )}
        {lighting.preset === 'dramatic-side' && !isWireframe && (
          <div
            className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500"
            style={{
              background: `linear-gradient(${lighting.angle ?? 45}deg, rgba(255, 255, 255, 0.08) 0%, transparent 40%, rgba(0, 0, 0, 0.28) 100%)`,
              mixBlendMode: 'overlay'
            }}
          />
        )}

        {/* Cursor Spotlight Overlay */}
        {lighting.cursorLight && (
          <div
            className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 220px at ${cursorPos.x}px ${cursorPos.y}px, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.04) 45%, transparent 75%)`,
              mixBlendMode: 'screen'
            }}
          />
        )}

        {/* CAD Blueprint Grid Overlay (when wireframe active) */}
        {isWireframe && (
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,242,254,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,242,254,0.3) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />
        )}

        {/* Volumetric Fog Overlay */}
        {environment.fogDensity > 0 && !isWireframe && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: `blur(${Math.round(environment.fogDensity * 0.06)}px)`,
              opacity: environment.fogDensity / 100
            }}
          />
        )}

        {/* Floating Stardust Particles */}
        {environment.stardustParticles && !isWireframe && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {stardustPoints.map((pt, idx) => (
              <div
                key={idx}
                className="absolute w-1 h-1 rounded-full bg-cyan-400/70 animate-pulse"
                style={{
                  left: `${pt.x}%`,
                  top: `${pt.y}%`,
                  animationDelay: `${pt.delay}s`,
                  transform: `translateZ(${pt.z}px)`,
                  boxShadow: '0 0 6px rgba(0,242,254,0.8)'
                }}
              />
            ))}
          </div>
        )}

        {/* 3D Master Orbit Stage */}
        <div
          ref={stageRef}
          className="relative w-80 sm:w-96 flex flex-col items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 transition-transform pointer-events-auto"
          style={{
            transform: isMaster3DOn
              ? `rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg) scale(1.02)`
              : 'none',
            transformStyle: 'preserve-3d',
            transition: isDragging ? 'none' : `transform ${activeElasticity.duration} ${activeElasticity.curve}`,
            '--3d-materials-preset': normalizedMaterialPreset,
            '--3d-specular-glow': specularGlow,
            '--3d-materials-bevel': `${bevelExtrusion}px`,
            '--3d-roughness': roughness,
            '--3d-metalness': metalness,
            '--3d-ior': ior,
            '--3d-clearcoat': clearcoat,
            '--3d-hover-pop': `${hoverPop}px`,
            '--3d-physics-curve': activeElasticity.curve,
            '--3d-physics-duration': activeElasticity.duration
          }}
        >
          {/* Exploded Strata Layer 1 (Base Chassis) */}
          {exploded.enabled && (
            <div
              className={`absolute inset-0 rounded-2xl border transition-all duration-300 pointer-events-none ${
                isChassisSolo
                  ? 'border-cyan-400 bg-cyan-950/40 ring-2 ring-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.5)]'
                  : 'border-cyan-500/40 bg-cyan-950/20 backdrop-blur-xs'
              }`}
              style={{
                transform: `translateZ(-${exploded.separationDistance}px)`,
                opacity: isChassisSolo ? 1 : (soloMode ? 0.15 : (exploded.ghostOpacity || 0.4)),
                filter: !isChassisSolo && soloMode ? 'grayscale(80%)' : 'none'
              }}
            >
              <div className="flex items-center justify-between p-2 text-[9px] font-mono text-cyan-400">
                <span>BASE CHASSIS [STRATA -01]</span>
                {isChassisSolo && (
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 font-bold">
                    SOLO ACTIVE
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Exploded Strata Layer 2 (Schematic Wireframe) */}
          {exploded.enabled && (exploded.blueprintMode || isWireframe) && (
            <div
              className="absolute inset-0 rounded-2xl border-2 border-dashed border-cyan-400/50 bg-cyan-900/10 pointer-events-none"
              style={{
                transform: `translateZ(-${Math.round(exploded.separationDistance * 0.5)}px)`
              }}
            >
              <div className="p-2 text-[9px] font-mono text-cyan-300">
                SCHEMATIC WIREFRAME [Z: -${Math.round(exploded.separationDistance * 0.5)}px]
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 1. MINI-NAVBAR (Z: +18px)                                 */}
          {/* Floating frosted glass bar with initials, dots, pill     */}
          {/* ======================================================== */}
          <div
            data-mini-element="navbar"
            onMouseEnter={() => handleElementMouseEnter('navbar')}
            onMouseLeave={() => handleElementMouseLeave('navbar')}
            onPointerDown={() => handleElementPointerDown('navbar')}
            onPointerUp={() => handleElementPointerUp('navbar')}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-full border transition-all duration-300 ${
              isNavHighlighted ? 'ring-2 ring-[#FF4D6D] ring-offset-2 shadow-[0_0_20px_rgba(255,77,109,0.35)]' : ''
            } ${
              isWireframe
                ? 'border-cyan-400 bg-cyan-950/70 text-cyan-300 font-mono shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                : `${themeStyle.navbar.border} ${themeStyle.navbar.text} ${normalizedMaterialPreset === 'glass-acrylic' ? 'backdrop-blur-md' : ''} shadow-md`
            }`}
            style={{
              transform: getElementTransform('navbar', zNav),
              background: isWireframe ? undefined : (matNavStyle.background || (isDark ? themeStyle.navbar.darkBg : themeStyle.navbar.bg)),
              borderColor: isWireframe ? undefined : matNavStyle.borderColor,
              boxShadow: isGravityDrop ? gravityGroundShadow : (isWireframe ? undefined : matNavStyle.boxShadow),
              backdropFilter: isWireframe ? undefined : matNavStyle.backdropFilter,
              borderWidth: isWireframe ? undefined : `${Math.max(1, Math.round(bevelExtrusion * 0.4))}px`,
              transition: isDragging ? 'none' : `${activeElasticity.transition}, background 0.35s ease, border-color 0.35s ease`,
              ...getStrataDimStyle('dock')
            }}
          >
            {/* Brand Monogram Initials */}
            <div
              className="flex items-center gap-1.5 font-bold text-xs tracking-tight"
              style={{
                transform: isNav3D && elements.navbarItems ? 'translateZ(12px)' : 'translateZ(0px)',
                transition: 'transform 0.3s ease'
              }}
            >
              <span className="font-mono text-[#FF4D6D]">[AV]</span>
              <span className="text-[10px] opacity-75 font-medium hidden sm:inline">Portfolio</span>
            </div>

            {/* Navigation Dots */}
            <div
              className="flex items-center gap-1.5"
              style={{
                transform: isNav3D && elements.navbarIcons ? 'translateZ(10px)' : 'translateZ(0px)',
                transition: 'transform 0.3s ease'
              }}
            >
              {['Home', 'Work', 'Skills', 'Lab'].map((dot, idx) => (
                <span
                  key={dot}
                  title={dot}
                  className={`w-1.5 h-1.5 rounded-full ${
                    idx === 0
                      ? 'bg-[#FF4D6D] ring-2 ring-[#FF4D6D]/30'
                      : isWireframe
                        ? 'bg-cyan-400/60'
                        : 'bg-stone-300 dark:bg-stone-600'
                  }`}
                />
              ))}
            </div>

            {/* Micro Theme Pill */}
            <div
              className="flex items-center gap-1 p-0.5 rounded-full bg-stone-200/60 dark:bg-stone-800/80 text-[10px]"
              style={{
                transform: isNav3D && (elements.navbarItems || elements.navbarIcons) ? 'translateZ(8px)' : 'translateZ(0px)',
                transition: 'transform 0.3s ease'
              }}
            >
              <Sun className="w-2.5 h-2.5 text-amber-500" />
              <Moon className="w-2.5 h-2.5 text-stone-400" />
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. MINI-HERO CARD (Z: +36px)                              */}
          {/* Central hero card with avatar orb, headline, badge       */}
          {/* ======================================================== */}
          <div
            data-mini-element="hero"
            onMouseEnter={() => handleElementMouseEnter('hero')}
            onMouseLeave={() => handleElementMouseLeave('hero')}
            onPointerDown={() => handleElementPointerDown('hero')}
            onPointerUp={() => handleElementPointerUp('hero')}
            className={`w-full rounded-2xl p-3.5 flex items-center gap-3 border transition-all duration-300 ${
              isHeroHighlighted ? 'ring-2 ring-[#FF4D6D] ring-offset-2 shadow-[0_0_20px_rgba(255,77,109,0.35)]' : ''
            } ${
              isWireframe
                ? 'border-cyan-400 bg-cyan-950/80 text-cyan-200 shadow-[0_0_20px_rgba(0,242,254,0.35)]'
                : `${themeStyle.hero.border} ${normalizedMaterialPreset === 'glass-acrylic' ? 'backdrop-blur-xl' : ''} shadow-xl`
            }`}
            style={{
              transform: getElementTransform('hero', zHero),
              background: isWireframe ? undefined : (matHeroStyle.background || (isDark ? themeStyle.hero.darkBg : themeStyle.hero.bg)),
              borderColor: isWireframe ? undefined : matHeroStyle.borderColor,
              boxShadow: isGravityDrop ? '0 35px 50px -10px rgba(0, 0, 0, 0.8), 0 20px 25px -8px rgba(0, 0, 0, 0.65)' : (isWireframe ? undefined : matHeroStyle.boxShadow),
              backdropFilter: isWireframe ? undefined : matHeroStyle.backdropFilter,
              borderWidth: isWireframe ? undefined : `${Math.max(1, Math.round(bevelExtrusion * 0.5))}px`,
              transformStyle: 'preserve-3d',
              transition: isDragging ? 'none' : `${activeElasticity.transition}, background 0.35s ease, border-color 0.35s ease`,
              ...getStrataDimStyle('content')
            }}
          >
            {/* Avatar Orb / 3D Custom Mesh Geometry (Feature 6) */}
            <div
              className="relative shrink-0"
              style={{
                transform: isProfilePic3D ? 'translateZ(30px)' : 'translateZ(0px)',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              {renderAvatarGeometry()}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#181226] animate-pulse" />
            </div>

            {/* Headline Wireframe Skeleton & Status */}
            <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{ transformStyle: 'preserve-3d' }}>
              <div className="flex items-center justify-between gap-1">
                <span
                  className="text-[11px] font-bold truncate text-stone-800 dark:text-stone-100"
                  style={{
                    transform: isHeader3D ? 'translateZ(20px)' : 'translateZ(0px)',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  {isWireframe ? 'WIRE_FRAME // HERO_UNIT' : 'Atul Verma • 3D Systems'}
                </span>
                <span
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shrink-0"
                  style={{
                    transform: isSubHeader3D ? 'translateZ(16px)' : 'translateZ(0px)',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>{isMaster3DOn ? 'Active 3D' : 'Flat 2D'}</span>
                </span>
              </div>

              {/* Wireframe Skeletons */}
              <div
                className="space-y-1"
                style={{
                  transform: isDescription3D ? 'translateZ(12px)' : 'translateZ(0px)',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <div className={`h-1.5 w-4/5 rounded-full ${isWireframe ? 'bg-cyan-500/40' : 'bg-stone-300 dark:bg-stone-700'}`} />
                <div className={`h-1.5 w-3/5 rounded-full ${isWireframe ? 'bg-cyan-500/25' : 'bg-stone-200 dark:bg-stone-800'}`} />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 3. MINI-SKILLS & PROJECTS GRID (Z: +24px)                 */}
          {/* 4-card isometric grid responding to dynamic light/bevel  */}
          {/* ======================================================== */}
          <div
            data-mini-element="grid"
            onMouseEnter={() => handleElementMouseEnter('grid')}
            onMouseLeave={() => handleElementMouseLeave('grid')}
            onPointerDown={() => handleElementPointerDown('grid')}
            onPointerUp={() => handleElementPointerUp('grid')}
            className={`w-full grid grid-cols-2 gap-2 p-1 rounded-2xl transition-all duration-300 ${
              isGridHighlighted ? 'ring-2 ring-[#FF4D6D] ring-offset-2 shadow-[0_0_20px_rgba(255,77,109,0.35)]' : ''
            }`}
            style={{
              transform: getElementTransform('grid', zGrid),
              transformStyle: 'preserve-3d',
              boxShadow: isGravityDrop ? gravityGroundShadow : undefined,
              transition: isDragging ? 'none' : activeElasticity.transition,
              ...getStrataDimStyle('content')
            }}
          >
            {[
              { id: 'react', title: 'React 19 UI', icon: Code, tag: 'Frontend' },
              { id: 'webgl', title: 'Three.js 3D', icon: Box, tag: 'Spatial' },
              { id: 'dsp', title: 'Audio DSP', icon: Volume2, tag: 'Synthesizer' },
              { id: 'system', title: 'Core Systems', icon: Cpu, tag: 'Architect' }
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className={`p-2 rounded-xl border flex flex-col justify-between gap-1.5 transition-all ${
                    isWireframe
                      ? 'border-cyan-400/80 bg-cyan-950/60 text-cyan-300 font-mono shadow-[0_0_10px_rgba(0,242,254,0.2)]'
                      : `${themeStyle.gridItem.border} ${themeStyle.gridItem.text} ${normalizedMaterialPreset === 'glass-acrylic' ? 'backdrop-blur-md' : ''} shadow-sm`
                  }`}
                  style={{
                    transform: isContent3D ? 'translateZ(14px)' : 'translateZ(0px)',
                    background: isWireframe ? undefined : (matGridStyle.background || (isDark ? themeStyle.gridItem.darkBg : themeStyle.gridItem.bg)),
                    borderColor: isWireframe ? undefined : matGridStyle.borderColor,
                    boxShadow: isWireframe ? undefined : matGridStyle.boxShadow,
                    backdropFilter: isWireframe ? undefined : matGridStyle.backdropFilter,
                    borderWidth: isWireframe ? undefined : `${Math.max(1, Math.round(bevelExtrusion * 0.35))}px`,
                    transition: isDragging ? 'none' : `${activeElasticity.transition}, background 0.35s ease, border-color 0.35s ease`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1 truncate">
                      <Icon className="w-3 h-3 text-[#FF4D6D]" />
                      <span>{card.title}</span>
                    </span>
                    <span className="text-[8px] font-mono opacity-60">
                      {card.tag}
                    </span>
                  </div>
                  <div className={`h-1 w-2/3 rounded-full ${isWireframe ? 'bg-cyan-500/40' : 'bg-stone-200 dark:bg-stone-700'}`} />
                </div>
              );
            })}
          </div>

          {/* ======================================================== */}
          {/* 4. MINI-FLOATING DOCK (Z: +42px)                          */}
          {/* Curved bottom dock with 5 micro circular icons (hover pop)*/}
          {/* ======================================================== */}
          <div
            data-mini-element="dock"
            onMouseEnter={() => handleElementMouseEnter('dock')}
            onMouseLeave={() => handleElementMouseLeave('dock')}
            onPointerDown={() => handleElementPointerDown('dock')}
            onPointerUp={() => handleElementPointerUp('dock')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border transition-all duration-300 ${
              isDockHighlighted ? 'ring-2 ring-[#FF4D6D] ring-offset-2 shadow-[0_0_20px_rgba(255,77,109,0.35)]' : ''
            } ${
              isWireframe
                ? 'border-cyan-400 bg-cyan-950/90 text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                : `${themeStyle.dock.border} ${normalizedMaterialPreset === 'glass-acrylic' ? 'backdrop-blur-lg' : ''} shadow-lg`
            }`}
            style={{
              transform: getElementTransform('dock', zDock),
              background: isWireframe ? undefined : (matDockStyle.background || (isDark ? themeStyle.dock.darkBg : themeStyle.dock.bg)),
              borderColor: isWireframe ? undefined : matDockStyle.borderColor,
              boxShadow: isGravityDrop ? gravityGroundShadow : (isWireframe ? undefined : matDockStyle.boxShadow),
              backdropFilter: isWireframe ? undefined : matDockStyle.backdropFilter,
              borderWidth: isWireframe ? undefined : `${Math.max(1, Math.round(bevelExtrusion * 0.4))}px`,
              transition: isDragging ? 'none' : `${activeElasticity.transition}, background 0.35s ease, border-color 0.35s ease`,
              ...getStrataDimStyle('dock')
            }}
          >
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'code', icon: Code, label: 'Projects' },
              { id: 'cpu', icon: Cpu, label: 'Skills' },
              { id: 'audio', icon: Volume2, label: 'Audio' },
              { id: 'term', icon: Terminal, label: 'Terminal' }
            ].map((item) => {
              const Icon = item.icon;
              const isHovered = hoveredDockIcon === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setHoveredDockIcon(item.id)}
                  onMouseLeave={() => setHoveredDockIcon(null)}
                  className={`w-6 h-6 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isHovered
                      ? 'scale-125 -translate-y-1 bg-[#FF4D6D] text-white shadow-md'
                      : isWireframe
                        ? 'bg-cyan-900/60 text-cyan-300'
                        : `${themeStyle.dock.btnBg}`
                  }`}
                  style={{
                    transform: isHovered
                      ? `translateZ(${10 + (hoverPop - 12) * 0.5}px) scale(1.2)`
                      : (isDock3D ? 'translateZ(8px)' : 'translateZ(0px)'),
                    transition: `transform ${activeElasticity.duration} ${activeElasticity.curve}`
                  }}
                  title={item.label}
                  aria-label={item.label}
                >
                  <Icon className="w-3 h-3" />
                </button>
              );
            })}
          </div>

          {/* ======================================================== */}
          {/* 5. MINI-FOOTER (Z: +10px)                                 */}
          {/* Ground plane with soft drop shadow & copyright text      */}
          {/* ======================================================== */}
          <div
            data-mini-element="footer"
            onMouseEnter={() => handleElementMouseEnter('footer')}
            onMouseLeave={() => handleElementMouseLeave('footer')}
            onPointerDown={() => handleElementPointerDown('footer')}
            onPointerUp={() => handleElementPointerUp('footer')}
            className={`w-full flex items-center justify-between text-[8px] font-mono text-stone-400 dark:text-stone-500 pt-1 border-t border-stone-200/40 dark:border-stone-800/40 transition-all duration-300 ${
              isFooterHighlighted ? 'ring-2 ring-[#FF4D6D] ring-offset-2 shadow-[0_0_20px_rgba(255,77,109,0.35)] rounded-lg px-2 py-1' : ''
            }`}
            style={{
              transform: getElementTransform('footer', zFooter),
              transition: isDragging ? 'none' : activeElasticity.transition
            }}
          >
            <span>© 2026 Atul Verma • All Systems Nominal</span>
            <span className="flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 text-emerald-500" />
              <span>{isMaster3DOn ? '3D Preserved' : '2D Preserved'}</span>
            </span>
          </div>
        </div>

        {/* Real-Time Performance & GPU Telemetry HUD Pill (Feature 8) */}
        {(performanceConfig.showTelemetryHud ?? true) && (
          <div
            data-testid="telemetry-hud"
            className="absolute top-2.5 right-2.5 z-30 flex items-center gap-2 px-2.5 py-1 rounded-full bg-stone-900/85 text-white border border-stone-700/80 backdrop-blur-md shadow-lg pointer-events-none select-none font-mono text-[10px]"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]" />
            <span className="font-bold text-emerald-400">{telemetry.fps} FPS</span>
            <span className="text-stone-400">•</span>
            <span className="text-stone-300">{telemetry.latency}ms</span>
            <span className="text-stone-400">•</span>
            <span className="text-cyan-300 font-semibold tracking-wide">
              {performanceConfig.gpuAcceleration === 'webgl-boost' ? 'WebGL Boost' : 'GPU Accelerated'}
            </span>
          </div>
        )}

        {/* Feature 2: Interactive On-Canvas 3D Sun & Light Arc Gizmo */}
        {lighting.showSunGizmo !== false && (
          <div
            data-testid="3d-sun-arc-gizmo"
            className="absolute inset-0 pointer-events-none z-25 flex items-center justify-center overflow-hidden"
          >
            {/* Orbital Ring Arc */}
            <div
              className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] rounded-full border border-dashed border-amber-400/25 dark:border-amber-400/35 relative pointer-events-none"
              style={{
                boxShadow: '0 0 25px rgba(245, 158, 11, 0.05)'
              }}
            >
              {/* Radial Light Ray projecting to center */}
              <div
                className="absolute top-1/2 left-1/2 w-1/2 h-[1px] origin-left pointer-events-none opacity-40"
                style={{
                  transform: `rotate(${lighting.angle ?? 45}deg)`,
                  background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.8) 0%, transparent 100%)'
                }}
              />

              {/* Draggable Sun Handle Orb */}
              {(() => {
                const angleRad = ((lighting.angle ?? 45) * Math.PI) / 180;
                // Center is at 50% 50%, orbital radius = 50%
                const orbLeft = `calc(50% + ${Math.cos(angleRad) * 50}% - 14px)`;
                const orbTop = `calc(50% + ${Math.sin(angleRad) * 50}% - 14px)`;

                return (
                  <button
                    type="button"
                    data-testid="sun-gizmo-handle"
                    onPointerDown={handleSunPointerDown}
                    onPointerMove={handleSunPointerMove}
                    onPointerUp={handleSunPointerUp}
                    onPointerCancel={handleSunPointerUp}
                    aria-label={`3D Sun Light Vector (${lighting.angle ?? 45}°)`}
                    title={`Drag to rotate Sun Angle: ${lighting.angle ?? 45}°`}
                    className={`absolute w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-amber-950 flex items-center justify-center shadow-[0_0_18px_rgba(245,158,11,0.7)] pointer-events-auto cursor-grab active:cursor-grabbing z-30 transition-transform ${
                      isDraggingSun ? 'scale-125 ring-2 ring-amber-300 ring-offset-1' : 'hover:scale-115'
                    }`}
                    style={{
                      left: orbLeft,
                      top: orbTop,
                      touchAction: 'none'
                    }}
                  >
                    <Sun className="w-4 h-4 text-amber-950 animate-[spin_12s_linear_infinite]" />
                  </button>
                );
              })()}
            </div>
          </div>
        )}

        {/* Export Notification Toast */}
        {exportNotice && (
          <div
            data-testid="export-notice-toast"
            className={`absolute bottom-3 right-3 z-30 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold shadow-lg border backdrop-blur-md animate-fadeIn pointer-events-none ${
              exportNotice.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-600 dark:text-emerald-300'
                : 'bg-rose-500/15 border-rose-500/35 text-rose-600 dark:text-rose-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{exportNotice.message}</span>
          </div>
        )}

        {/* Drag Guidance Toast Overlay */}
        {!compact && (
          <div className="absolute bottom-2.5 left-3 text-[10px] font-mono text-stone-400 dark:text-stone-500 bg-white/70 dark:bg-stone-900/70 px-2 py-0.5 rounded-md backdrop-blur-xs border border-stone-200/50 dark:border-stone-800/50 pointer-events-none">
            Drag to orbit 3D replica
          </div>
        )}
      </SandboxViewportContainer>
    </div>
  );
}

export default UniversalMiniPortfolio;
