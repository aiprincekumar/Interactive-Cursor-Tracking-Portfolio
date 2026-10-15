/**
 * Kinematic Physics & Particle Profiles for all 35 Custom Cursors
 * 
 * Provides ultra-optimized physics constants, particle behaviors, trail renderers,
 * and click burst reactions ensuring 60-120+ FPS performance with 0ms frame drops.
 */

export const KINEMATIC_PROFILES = {
  // ==========================================
  // Category 1: Living & Nature
  // ==========================================
  butterfly: {
    id: 'butterfly',
    name: 'Butterfly',
    inertia: 12.0,
    rotationMode: 'heading_smooth',
    rotationOffset: 90,
    maxBank: 24,
    scaleWithSpeed: false,
    glow: 'rgba(255, 77, 109, 0.45)',
    trail: {
      type: 'pollen',
      colors: ['rgba(255, 77, 109,', 'rgba(255, 182, 193,', 'rgba(255, 215, 0,', 'rgba(255, 105, 180,'],
      maxParticles: 45,
      size: [1.5, 3.2],
      decay: 1.1,
      composite: 'lighter',
      emitThreshold: 7
    },
    clickBurst: { count: 14, speed: 85, color: '#FF4D6D' }
  },

  firefly: {
    id: 'firefly',
    name: 'Firefly',
    inertia: 10.0,
    rotationMode: 'bob',
    bobFrequency: 2.5,
    bobAmplitude: 7,
    scaleWithSpeed: false,
    glow: 'rgba(16, 185, 129, 0.55)',
    trail: {
      type: 'embers',
      colors: ['rgba(255, 230, 100,', 'rgba(16, 185, 129,', 'rgba(52, 211, 153,', 'rgba(255, 255, 180,'],
      maxParticles: 40,
      size: [1.8, 3.8],
      decay: 0.9,
      composite: 'lighter',
      emitThreshold: 8
    },
    clickBurst: { count: 12, speed: 70, color: '#10B981' }
  },

  dragonfly: {
    id: 'dragonfly',
    name: 'Dragonfly',
    inertia: 18.0,
    rotationMode: 'heading',
    rotationOffset: 90,
    maxBank: 28,
    scaleWithSpeed: true,
    glow: 'rgba(6, 182, 212, 0.5)',
    trail: {
      type: 'water_ripples',
      colors: ['rgba(6, 182, 212,', 'rgba(34, 211, 238,', 'rgba(165, 243, 252,', 'rgba(59, 130, 246,'],
      maxParticles: 40,
      size: [2.0, 4.0],
      decay: 1.3,
      composite: 'lighter',
      emitThreshold: 6
    },
    clickBurst: { count: 15, speed: 90, color: '#06B6D4' }
  },

  honeybee: {
    id: 'honeybee',
    name: 'Honeybee',
    inertia: 14.0,
    rotationMode: 'bob_buzz',
    bobFrequency: 4.8,
    bobAmplitude: 5,
    scaleWithSpeed: false,
    glow: 'rgba(234, 179, 8, 0.5)',
    trail: {
      type: 'honey_droplets',
      colors: ['rgba(234, 179, 8,', 'rgba(250, 204, 21,', 'rgba(254, 240, 138,', 'rgba(245, 158, 11,'],
      maxParticles: 35,
      size: [2.0, 3.5],
      decay: 1.2,
      composite: 'source-over',
      emitThreshold: 7
    },
    clickBurst: { count: 12, speed: 75, color: '#EAB308' }
  },

  leaf: {
    id: 'leaf',
    name: 'Autumn Leaf',
    inertia: 8.5,
    rotationMode: 'sway',
    swayFrequency: 2.0,
    swayAmplitude: 28,
    scaleWithSpeed: false,
    glow: 'rgba(249, 115, 22, 0.4)',
    trail: {
      type: 'floating_leaves',
      colors: ['rgba(249, 115, 22,', 'rgba(234, 88, 12,', 'rgba(251, 146, 60,', 'rgba(217, 119, 6,'],
      maxParticles: 35,
      size: [2.2, 4.2],
      decay: 0.95,
      composite: 'source-over',
      emitThreshold: 9
    },
    clickBurst: { count: 14, speed: 65, color: '#F97316' }
  },

  // ==========================================
  // Category 2: Cosmic & Magic
  // ==========================================
  wand: {
    id: 'wand',
    name: 'Stardust Wand',
    inertia: 15.0,
    rotationMode: 'fixed_tilt',
    tiltAngle: -25,
    scaleWithSpeed: false,
    glow: 'rgba(168, 85, 247, 0.55)',
    trail: {
      type: 'stars',
      colors: ['rgba(168, 85, 247,', 'rgba(216, 180, 254,', 'rgba(255, 255, 255,', 'rgba(236, 72, 153,'],
      maxParticles: 45,
      size: [2.0, 4.5],
      decay: 1.2,
      composite: 'lighter',
      emitThreshold: 6
    },
    clickBurst: { count: 18, speed: 95, color: '#A855F7' }
  },

  stardust: {
    id: 'stardust',
    name: 'Stardust Wand',
    inertia: 15.0,
    rotationMode: 'fixed_tilt',
    tiltAngle: -25,
    scaleWithSpeed: false,
    glow: 'rgba(168, 85, 247, 0.55)',
    trail: {
      type: 'stars',
      colors: ['rgba(168, 85, 247,', 'rgba(216, 180, 254,', 'rgba(255, 255, 255,', 'rgba(236, 72, 153,'],
      maxParticles: 45,
      size: [2.0, 4.5],
      decay: 1.2,
      composite: 'lighter',
      emitThreshold: 6
    },
    clickBurst: { count: 18, speed: 95, color: '#A855F7' }
  },

  comet: {
    id: 'comet',
    name: 'Stellar Comet',
    inertia: 15.0,
    rotationMode: 'heading',
    rotationOffset: 90,
    maxBank: 22,
    scaleWithSpeed: true,
    glow: 'rgba(56, 189, 248, 0.6)',
    trail: {
      type: 'comet_tail',
      colors: ['rgba(56, 189, 248,', 'rgba(147, 197, 253,', 'rgba(255, 255, 255,', 'rgba(99, 102, 241,'],
      maxParticles: 55,
      size: [1.8, 4.0],
      decay: 1.4,
      composite: 'lighter',
      emitThreshold: 5
    },
    clickBurst: { count: 20, speed: 110, color: '#38BDF8' }
  },

  blackhole: {
    id: 'blackhole',
    name: 'Black Hole',
    inertia: 11.0,
    rotationMode: 'spin',
    spinSpeed: 140,
    scaleWithSpeed: false,
    glow: 'rgba(139, 92, 246, 0.6)',
    trail: {
      type: 'vortex',
      colors: ['rgba(139, 92, 246,', 'rgba(192, 132, 252,', 'rgba(76, 29, 149,', 'rgba(244, 114, 182,'],
      maxParticles: 50,
      size: [1.6, 3.6],
      decay: 1.1,
      composite: 'lighter',
      emitThreshold: 6
    },
    clickBurst: { count: 16, speed: -80, color: '#8B5CF6' } // Inward collapse then explosion
  },

  prism: {
    id: 'prism',
    name: 'Crystal Prism',
    inertia: 13.0,
    rotationMode: 'spin_subtle',
    spinSpeed: 45,
    scaleWithSpeed: false,
    glow: 'rgba(244, 63, 94, 0.45)',
    trail: {
      type: 'rainbow_dispersion',
      colors: [
        'rgba(244, 63, 94,',
        'rgba(249, 115, 22,',
        'rgba(234, 179, 8,',
        'rgba(16, 185, 129,',
        'rgba(6, 182, 212,',
        'rgba(99, 102, 241,',
        'rgba(168, 85, 247,'
      ],
      maxParticles: 45,
      size: [2.2, 4.0],
      decay: 1.25,
      composite: 'lighter',
      emitThreshold: 6
    },
    clickBurst: { count: 21, speed: 85, color: '#F43F5E' }
  },

  portal: {
    id: 'portal',
    name: 'Wormhole Portal',
    inertia: 12.0,
    rotationMode: 'spin',
    spinSpeed: 180,
    scaleWithSpeed: false,
    glow: 'rgba(14, 165, 233, 0.6)',
    trail: {
      type: 'portal_rings',
      colors: ['rgba(14, 165, 233,', 'rgba(56, 189, 248,', 'rgba(129, 140, 248,', 'rgba(192, 132, 252,'],
      maxParticles: 42,
      size: [2.0, 4.8],
      decay: 1.1,
      composite: 'lighter',
      emitThreshold: 7
    },
    clickBurst: { count: 18, speed: 95, color: '#0EA5E9' }
  },

  // ==========================================
  // Category 3: Tech & Cyberpunk
  // ==========================================
  laser: {
    id: 'laser',
    name: 'Laser Pointer',
    inertia: 24.0,
    rotationMode: 'fixed',
    scaleWithSpeed: false,
    glow: 'rgba(220, 38, 38, 0.65)',
    trail: {
      type: 'laser_beam',
      colors: ['rgba(239, 68, 68,', 'rgba(252, 165, 165,', 'rgba(255, 255, 255,', 'rgba(185, 28, 28,'],
      maxParticles: 35,
      size: [1.2, 2.8],
      decay: 1.8,
      composite: 'lighter',
      emitThreshold: 4
    },
    clickBurst: { count: 16, speed: 100, color: '#DC2626' }
  },

  matrix: {
    id: 'matrix',
    name: 'Matrix Rain',
    inertia: 16.0,
    rotationMode: 'fixed',
    scaleWithSpeed: false,
    glow: 'rgba(34, 197, 94, 0.55)',
    trail: {
      type: 'matrix_glyphs',
      colors: ['rgba(34, 197, 94,', 'rgba(74, 222, 128,', 'rgba(187, 247, 208,', 'rgba(22, 163, 74,'],
      maxParticles: 45,
      size: [8, 12],
      decay: 1.0,
      composite: 'source-over',
      emitThreshold: 7
    },
    clickBurst: { count: 16, speed: 70, color: '#22C55E' }
  },

  reticle: {
    id: 'reticle',
    name: 'HUD Reticle',
    inertia: 22.0,
    rotationMode: 'spin_subtle',
    spinSpeed: 25,
    scaleWithSpeed: false,
    glow: 'rgba(6, 182, 212, 0.55)',
    trail: {
      type: 'hud_coords',
      colors: ['rgba(6, 182, 212,', 'rgba(34, 211, 238,', 'rgba(103, 232, 249,', 'rgba(8, 145, 178,'],
      maxParticles: 30,
      size: [1.5, 3.0],
      decay: 1.5,
      composite: 'lighter',
      emitThreshold: 6
    },
    clickBurst: { count: 14, speed: 90, color: '#06B6D4' }
  },

  circuit: {
    id: 'circuit',
    name: 'Nano Circuit',
    inertia: 17.0,
    rotationMode: 'fixed',
    scaleWithSpeed: false,
    glow: 'rgba(59, 130, 246, 0.55)',
    trail: {
      type: 'circuit_pulses',
      colors: ['rgba(59, 130, 246,', 'rgba(96, 165, 250,', 'rgba(191, 219, 254,', 'rgba(37, 99, 235,'],
      maxParticles: 35,
      size: [2.0, 3.5],
      decay: 1.3,
      composite: 'lighter',
      emitThreshold: 6
    },
    clickBurst: { count: 15, speed: 85, color: '#3B82F6' }
  },

  drone: {
    id: 'drone',
    name: 'Cyber Drone',
    inertia: 14.0,
    rotationMode: 'tilt_heading',
    rotationOffset: 0,
    maxBank: 20,
    scaleWithSpeed: false,
    glow: 'rgba(99, 102, 241, 0.5)',
    trail: {
      type: 'thrust_vapor',
      colors: ['rgba(99, 102, 241,', 'rgba(129, 140, 248,', 'rgba(199, 210, 254,', 'rgba(79, 70, 229,'],
      maxParticles: 35,
      size: [1.8, 3.4],
      decay: 1.3,
      composite: 'lighter',
      emitThreshold: 7
    },
    clickBurst: { count: 14, speed: 80, color: '#6366F1' }
  },

  // ==========================================
  // Category 4: Playful & Vehicles
  // ==========================================
  airplane: {
    id: 'airplane',
    name: 'Paper Airplane',
    inertia: 15.0,
    rotationMode: 'heading',
    rotationOffset: 90,
    maxBank: 32,
    scaleWithSpeed: false,
    glow: 'rgba(2, 132, 199, 0.45)',
    trail: {
      type: 'dual_wingtip',
      colors: ['rgba(255, 255, 255,', 'rgba(224, 242, 254,', 'rgba(186, 230, 253,', 'rgba(125, 211, 252,'],
      maxParticles: 45,
      size: [1.4, 2.6],
      decay: 1.4,
      composite: 'source-over',
      emitThreshold: 7
    },
    clickBurst: { count: 12, speed: 75, color: '#0284C7' }
  },

  rocket: {
    id: 'rocket',
    name: 'Retro Rocket',
    inertia: 16.0,
    rotationMode: 'heading',
    rotationOffset: 45,
    maxBank: 18,
    scaleWithSpeed: false,
    glow: 'rgba(239, 68, 68, 0.55)',
    trail: {
      type: 'rocket_exhaust',
      colors: ['rgba(239, 68, 68,', 'rgba(249, 115, 22,', 'rgba(250, 204, 21,', 'rgba(156, 163, 175,'],
      maxParticles: 50,
      size: [2.0, 4.2],
      decay: 1.5,
      composite: 'lighter',
      emitThreshold: 5
    },
    clickBurst: { count: 18, speed: 100, color: '#EF4444' }
  },

  ufo: {
    id: 'ufo',
    name: 'Flying Saucer',
    inertia: 11.0,
    rotationMode: 'wobble',
    wobbleFreq: 3.2,
    wobbleAmp: 14,
    scaleWithSpeed: false,
    glow: 'rgba(16, 185, 129, 0.5)',
    trail: {
      type: 'tractor_beam',
      colors: ['rgba(16, 185, 129,', 'rgba(52, 211, 153,', 'rgba(167, 243, 208,', 'rgba(5, 150, 105,'],
      maxParticles: 40,
      size: [2.0, 4.5],
      decay: 1.1,
      composite: 'lighter',
      emitThreshold: 7
    },
    clickBurst: { count: 15, speed: 85, color: '#10B981' }
  },

  speedster: {
    id: 'speedster',
    name: 'Speedster Car',
    inertia: 17.0,
    rotationMode: 'heading',
    rotationOffset: 90,
    maxBank: 24,
    scaleWithSpeed: false,
    glow: 'rgba(245, 158, 11, 0.5)',
    trail: {
      type: 'tire_smoke',
      colors: ['rgba(245, 158, 11,', 'rgba(251, 191, 36,', 'rgba(209, 213, 219,', 'rgba(156, 163, 175,'],
      maxParticles: 40,
      size: [2.2, 4.8],
      decay: 1.4,
      composite: 'source-over',
      emitThreshold: 6
    },
    clickBurst: { count: 15, speed: 90, color: '#F59E0B' }
  },

  balloon: {
    id: 'balloon',
    name: 'Hot Air Balloon',
    inertia: 8.0,
    rotationMode: 'buoyant_bob',
    bobFrequency: 1.8,
    bobAmplitude: 10,
    scaleWithSpeed: false,
    glow: 'rgba(236, 72, 153, 0.4)',
    trail: {
      type: 'burner_sparks',
      colors: ['rgba(236, 72, 153,', 'rgba(244, 114, 182,', 'rgba(249, 115, 22,', 'rgba(253, 186, 116,'],
      maxParticles: 30,
      size: [1.8, 3.6],
      decay: 0.9,
      composite: 'lighter',
      emitThreshold: 8
    },
    clickBurst: { count: 12, speed: 65, color: '#EC4899' }
  },

  // ==========================================
  // Category 5: Elemental & Forces
  // ==========================================
  flame: {
    id: 'flame',
    name: 'Fire Flame',
    inertia: 15.0,
    rotationMode: 'fixed_upward',
    scaleWithSpeed: true,
    glow: 'rgba(234, 88, 12, 0.65)',
    trail: {
      type: 'rising_flames',
      colors: ['rgba(239, 68, 68,', 'rgba(249, 115, 22,', 'rgba(250, 204, 21,', 'rgba(254, 240, 138,'],
      maxParticles: 55,
      size: [2.4, 5.2],
      decay: 1.4,
      composite: 'lighter',
      emitThreshold: 5
    },
    clickBurst: { count: 20, speed: 95, color: '#EA580C' }
  },

  frost: {
    id: 'frost',
    name: 'Frost Crystal',
    inertia: 12.0,
    rotationMode: 'spin_subtle',
    spinSpeed: 30,
    scaleWithSpeed: false,
    glow: 'rgba(56, 189, 248, 0.55)',
    trail: {
      type: 'snow_blizzard',
      colors: ['rgba(255, 255, 255,', 'rgba(224, 242, 254,', 'rgba(186, 230, 253,', 'rgba(147, 197, 253,'],
      maxParticles: 45,
      size: [1.8, 3.8],
      decay: 1.0,
      composite: 'lighter',
      emitThreshold: 6
    },
    clickBurst: { count: 18, speed: 85, color: '#38BDF8' }
  },

  lightning: {
    id: 'lightning',
    name: 'Lightning Bolt',
    inertia: 25.0,
    rotationMode: 'fixed',
    scaleWithSpeed: false,
    glow: 'rgba(234, 179, 8, 0.7)',
    trail: {
      type: 'lightning_arcs',
      colors: ['rgba(250, 204, 21,', 'rgba(254, 240, 138,', 'rgba(255, 255, 255,', 'rgba(168, 85, 247,'],
      maxParticles: 35,
      size: [1.8, 3.2],
      decay: 1.8,
      composite: 'lighter',
      emitThreshold: 4
    },
    clickBurst: { count: 16, speed: 110, color: '#EAB308' }
  },

  waterdrop: {
    id: 'waterdrop',
    name: 'Water Drop',
    inertia: 13.0,
    rotationMode: 'heading',
    rotationOffset: 90,
    scaleWithSpeed: true,
    glow: 'rgba(14, 165, 233, 0.5)',
    trail: {
      type: 'fluid_splash',
      colors: ['rgba(14, 165, 233,', 'rgba(56, 189, 248,', 'rgba(186, 230, 253,', 'rgba(2, 132, 199,'],
      maxParticles: 40,
      size: [2.0, 4.2],
      decay: 1.2,
      composite: 'source-over',
      emitThreshold: 6
    },
    clickBurst: { count: 16, speed: 80, color: '#0EA5E9' }
  },

  tornado: {
    id: 'tornado',
    name: 'Tornado Vortex',
    inertia: 13.0,
    rotationMode: 'spin',
    spinSpeed: 240,
    scaleWithSpeed: false,
    glow: 'rgba(100, 116, 139, 0.5)',
    trail: {
      type: 'vortex_debris',
      colors: ['rgba(148, 163, 184,', 'rgba(203, 213, 225,', 'rgba(100, 116, 139,', 'rgba(71, 85, 105,'],
      maxParticles: 50,
      size: [1.6, 3.6],
      decay: 1.1,
      composite: 'source-over',
      emitThreshold: 6
    },
    clickBurst: { count: 18, speed: 90, color: '#64748B' }
  },

  // ==========================================
  // Category 6: Precision & Design
  // ==========================================
  camera: {
    id: 'camera',
    name: 'Camera Focus',
    inertia: 18.0,
    rotationMode: 'fixed',
    scaleWithSpeed: false,
    glow: 'rgba(217, 119, 6, 0.5)',
    trail: {
      type: 'viewfinder_marks',
      colors: ['rgba(217, 119, 6,', 'rgba(245, 158, 11,', 'rgba(251, 191, 36,', 'rgba(180, 83, 9,'],
      maxParticles: 30,
      size: [1.4, 2.8],
      decay: 1.4,
      composite: 'source-over',
      emitThreshold: 7
    },
    clickBurst: { count: 12, speed: 75, color: '#D97706' }
  },

  minimal: {
    id: 'minimal',
    name: 'Minimal Ring',
    inertia: 20.0,
    rotationMode: 'fixed',
    scaleWithSpeed: false,
    glow: 'rgba(82, 82, 91, 0.4)',
    trail: {
      type: 'geometric_dots',
      colors: ['rgba(82, 82, 91,', 'rgba(113, 113, 122,', 'rgba(161, 161, 170,', 'rgba(39, 39, 42,'],
      maxParticles: 25,
      size: [1.2, 2.5],
      decay: 1.6,
      composite: 'source-over',
      emitThreshold: 7
    },
    clickBurst: { count: 10, speed: 70, color: '#52525B' }
  },

  quill: {
    id: 'quill',
    name: 'Quill Pen',
    inertia: 15.0,
    rotationMode: 'fixed_tilt',
    tiltAngle: -45,
    scaleWithSpeed: false,
    glow: 'rgba(161, 98, 7, 0.45)',
    trail: {
      type: 'calligraphy_ink',
      colors: ['rgba(24, 24, 27,', 'rgba(63, 63, 70,', 'rgba(161, 98, 7,', 'rgba(113, 113, 122,'],
      maxParticles: 40,
      size: [1.5, 3.2],
      decay: 1.2,
      composite: 'source-over',
      emitThreshold: 5
    },
    clickBurst: { count: 14, speed: 70, color: '#A16207' }
  },

  brush: {
    id: 'brush',
    name: 'Paint Brush',
    inertia: 14.0,
    rotationMode: 'fixed_tilt',
    tiltAngle: -35,
    scaleWithSpeed: false,
    glow: 'rgba(219, 39, 119, 0.5)',
    trail: {
      type: 'paint_splatter',
      colors: ['rgba(219, 39, 119,', 'rgba(236, 72, 153,', 'rgba(244, 114, 182,', 'rgba(190, 24, 93,'],
      maxParticles: 42,
      size: [2.0, 4.5],
      decay: 1.1,
      composite: 'source-over',
      emitThreshold: 6
    },
    clickBurst: { count: 18, speed: 85, color: '#DB2777' }
  },

  compass: {
    id: 'compass',
    name: 'Drafting Compass',
    inertia: 16.0,
    rotationMode: 'spin_subtle',
    spinSpeed: 20,
    scaleWithSpeed: false,
    glow: 'rgba(13, 148, 136, 0.45)',
    trail: {
      type: 'drafting_arcs',
      colors: ['rgba(13, 148, 136,', 'rgba(20, 184, 166,', 'rgba(94, 234, 212,', 'rgba(15, 118, 110,'],
      maxParticles: 35,
      size: [1.4, 2.8],
      decay: 1.3,
      composite: 'source-over',
      emitThreshold: 6
    },
    clickBurst: { count: 14, speed: 75, color: '#0D9488' }
  },

  // ==========================================
  // Category 7: Arcade & Retro
  // ==========================================
  ghost: {
    id: 'ghost',
    name: 'Arcade Ghost',
    inertia: 11.0,
    rotationMode: 'wavy_float',
    bobFrequency: 3.0,
    bobAmplitude: 8,
    scaleWithSpeed: false,
    glow: 'rgba(239, 68, 68, 0.55)',
    trail: {
      type: 'pixel_dust',
      colors: ['rgba(239, 68, 68,', 'rgba(59, 130, 246,', 'rgba(236, 72, 153,', 'rgba(249, 115, 22,'],
      maxParticles: 40,
      size: [2.5, 4.5],
      decay: 1.2,
      composite: 'source-over',
      emitThreshold: 7
    },
    clickBurst: { count: 16, speed: 80, color: '#EF4444' }
  },

  pacman: {
    id: 'pacman',
    name: 'Pixel Chomp',
    inertia: 15.0,
    rotationMode: 'heading',
    rotationOffset: 0,
    scaleWithSpeed: false,
    glow: 'rgba(234, 179, 8, 0.6)',
    trail: {
      type: 'pac_dots',
      colors: ['rgba(250, 204, 21,', 'rgba(254, 240, 138,', 'rgba(255, 255, 255,', 'rgba(234, 179, 8,'],
      maxParticles: 35,
      size: [2.5, 4.0],
      decay: 1.3,
      composite: 'source-over',
      emitThreshold: 7
    },
    clickBurst: { count: 16, speed: 85, color: '#EAB308' }
  },

  joystick: {
    id: 'joystick',
    name: 'Retro Joystick',
    inertia: 16.0,
    rotationMode: 'velocity_tilt',
    maxBank: 22,
    scaleWithSpeed: false,
    glow: 'rgba(225, 29, 72, 0.5)',
    trail: {
      type: 'arcade_sparks',
      colors: ['rgba(225, 29, 72,', 'rgba(244, 63, 94,', 'rgba(251, 113, 133,', 'rgba(190, 18, 60,'],
      maxParticles: 35,
      size: [2.0, 3.8],
      decay: 1.4,
      composite: 'lighter',
      emitThreshold: 6
    },
    clickBurst: { count: 15, speed: 90, color: '#E11D48' }
  },

  synthwave: {
    id: 'synthwave',
    name: 'Synthwave Sun',
    inertia: 12.0,
    rotationMode: 'fixed',
    scaleWithSpeed: false,
    glow: 'rgba(168, 85, 247, 0.65)',
    trail: {
      type: 'synth_grid',
      colors: ['rgba(168, 85, 247,', 'rgba(236, 72, 153,', 'rgba(6, 182, 212,', 'rgba(244, 63, 94,'],
      maxParticles: 45,
      size: [2.0, 4.5],
      decay: 1.2,
      composite: 'lighter',
      emitThreshold: 6
    },
    clickBurst: { count: 20, speed: 95, color: '#A855F7' }
  },

  sword: {
    id: 'sword',
    name: 'Pixel Sword',
    inertia: 18.0,
    rotationMode: 'heading',
    rotationOffset: 45,
    maxBank: 25,
    scaleWithSpeed: false,
    glow: 'rgba(59, 130, 246, 0.6)',
    trail: {
      type: 'sword_slash',
      colors: ['rgba(59, 130, 246,', 'rgba(96, 165, 250,', 'rgba(255, 255, 255,', 'rgba(37, 99, 235,'],
      maxParticles: 45,
      size: [2.0, 4.0],
      decay: 1.6,
      composite: 'lighter',
      emitThreshold: 5
    },
    clickBurst: { count: 18, speed: 105, color: '#3B82F6' }
  }
};

/**
 * Returns the kinematic profile for a cursor ID with fallback to butterfly
 */
export function getKinematicProfile(cursorId) {
  return KINEMATIC_PROFILES[cursorId] || KINEMATIC_PROFILES.butterfly;
}
