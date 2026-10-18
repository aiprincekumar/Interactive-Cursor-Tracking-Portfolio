/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { soundFX } from '../utils/audio';

export const CONTROL_CENTER_STORAGE_KEY = 'portfolio_control_center';
export const LAB_STORAGE_KEY = 'portfolio_lab_config'; // Legacy mirror key
export const LEGACY_STUDIO_STORAGE_KEY = 'lab_studio_state'; // Legacy studio drawer state key

export const FACTORY_DEFAULTS = {
  version: 2,
  audio: {
    soundEnabled: true,
    masterVolume: 0.8, // 0.0 - 1.0 (80%)
    pitchMultiplier: 1.0, // 0.5x - 2.0x
    soundMatchingMode: 'dynamic' // 'dynamic' | 'universal'
  },
  cursor: {
    customCursorEnabled: true,
    cursorScale: 1.0, // 0.5x - 2.0x
    flightLerpSpeed: 'natural', // 'dreamy' | 'natural' | 'snappy'
    stardustTrailEnabled: true,
    particleColor: '#FF4D6D'
  },
  hero: {
    gazeMode: 'auto', // 'auto' | 'fixed'
    poseOverride: null, // null or number 0-9
    characterZoom: 1.0, // 0.5x - 2.0x
    zoomFocus: 'center', // 'head' | 'center' | 'feet'
    flashConfettiEnabled: true,
    dragEnabled: true,
    dragBoundaryConstrained: true,
    dragAutoSnapBack: false,
    parallaxTiltEnabled: true
  },
  preferences: {
    defaultStartupRole: 'accountant', // 'accountant' | 'mis' | 'controller'
    defaultCursorEnabled: true,
    defaultAudioEnabled: true,
    reducedMotion: false
  },
  visuals: {
    glassBlur: 'balanced', // 'subtle' (8px), 'balanced' (16px), 'deep' (24px)
    motionSpeed: 1.0,      // 0.7 (snappy), 1.0 (natural), 1.4 (cinematic)
    accentColor: '#FF4D6D', // '#FF4D6D' (Electric Rose), '#F59E0B' (Amber Gold), '#06B6D4' (Neon Cyan), '#10B981' (Emerald)
    layoutDensity: 'comfortable' // 'compact' | 'comfortable' | 'spacious'
  }
};

export const ZOOM_FOCUS_MAP = {
  head: '50% 18%',
  center: '50% 50%',
  feet: '50% 90%'
};

export const FLIGHT_SPEED_MAP = {
  dreamy: 0.08,
  natural: 0.14,
  snappy: 0.24
};

export const POSE_INDEX_MAP = [
  'idle',         // 0: 00-rear-view
  'upper-center', // 1: 01-center-up
  'lower-center', // 2: 02-lower-center
  'left',         // 3: 03-center-left
  'right',        // 4: 04-center-right
  'center',       // 5: 05-center-front
  'upper-left',   // 6: 06-upper-left
  'lower-left',   // 7: 07-lower-left
  'upper-right',  // 8: 08-upper-right
  'lower-right'   // 9: 09-lower-right
];

// Helper clamps & sanitizers
function clamp(val, min, max, fallback) {
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num)) return fallback;
  return Math.min(Math.max(num, min), max);
}

function clampScale(val) {
  return parseFloat(clamp(val, 0.5, 2.0, 1.0).toFixed(2));
}

function clampVolume(val) {
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num)) return 0.8;
  if (num > 1.0) {
    return parseFloat(clamp(num / 100, 0.0, 1.0, 0.8).toFixed(2));
  }
  return parseFloat(clamp(num, 0.0, 1.0, 0.8).toFixed(2));
}

function clampPitch(val) {
  return parseFloat(clamp(val, 0.5, 2.0, 1.0).toFixed(2));
}

function validateColor(val) {
  if (typeof val === 'string' && /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val)) {
    return val;
  }
  return '#FF4D6D';
}

function normalizeFlightSpeedKey(speedVal) {
  if (typeof speedVal === 'string') {
    const s = speedVal.toLowerCase();
    if (s === 'dreamy' || s === 'natural' || s === 'snappy') return s;
  }
  if (typeof speedVal === 'number') {
    if (speedVal <= 0.10) return 'dreamy';
    if (speedVal >= 0.19) return 'snappy';
    return 'natural';
  }
  return 'natural';
}

function normalizePoseOverride(val) {
  if (val === null || val === undefined || val === 'auto') return null;
  if (typeof val === 'number') {
    if (val >= 0 && val <= 9) return Math.floor(val);
    return null;
  }
  if (typeof val === 'string') {
    const idx = POSE_INDEX_MAP.indexOf(val.toLowerCase());
    if (idx !== -1) return idx;
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 0 && num <= 9) return num;
  }
  return null;
}

export function normalizeZoomFocus(val) {
  if (typeof val === 'string') {
    const s = val.trim().toLowerCase();
    if (s === 'head' || s === 'center' || s === 'feet') return s;
  }
  return 'center';
}

export function hexToRgb(hex) {
  if (typeof hex !== 'string') return '255, 77, 109';
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return `${r}, ${g}, ${b}`;
  } else if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return `${r}, ${g}, ${b}`;
  }
  return '255, 77, 109';
}

export function normalizeGlassBlur(val) {
  if (typeof val === 'string') {
    const s = val.toLowerCase();
    if (s === 'subtle' || s === 'balanced' || s === 'deep') return s;
  }
  return 'balanced';
}

export function normalizeMotionSpeed(val) {
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num)) return 1.0;
  if (Math.abs(num - 0.7) < 0.15) return 0.7;
  if (Math.abs(num - 1.4) < 0.2) return 1.4;
  return 1.0;
}

export function normalizeAccentColor(val) {
  return validateColor(val);
}

export function normalizeLayoutDensity(val) {
  if (typeof val === 'string') {
    const s = val.trim().toLowerCase();
    if (s === 'compact' || s === 'comfortable' || s === 'spacious') return s;
  }
  return 'comfortable';
}


export function loadSavedControlCenterConfig() {
  if (typeof window === 'undefined') {
    return JSON.parse(JSON.stringify(FACTORY_DEFAULTS));
  }

  // Tier 1: Look for current portfolio_control_center key
  try {
    const raw = localStorage.getItem(CONTROL_CENTER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const audio = parsed.audio || {};
        const cursor = parsed.cursor || {};
        const hero = parsed.hero || {};
        const preferences = parsed.preferences || {};

        return {
          version: 2,
          audio: {
            soundEnabled: typeof audio.soundEnabled === 'boolean'
              ? audio.soundEnabled
              : (typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : FACTORY_DEFAULTS.audio.soundEnabled),
            masterVolume: clampVolume(audio.masterVolume ?? parsed.masterVolume ?? FACTORY_DEFAULTS.audio.masterVolume),
            pitchMultiplier: clampPitch(audio.pitchMultiplier ?? parsed.pitchMultiplier ?? parsed.audioPitch ?? FACTORY_DEFAULTS.audio.pitchMultiplier),
            soundMatchingMode: (audio.soundMatchingMode === 'universal' || parsed.soundMatchingMode === 'universal') ? 'universal' : 'dynamic'
          },
          cursor: {
            customCursorEnabled: typeof cursor.customCursorEnabled === 'boolean'
              ? cursor.customCursorEnabled
              : (typeof parsed.customCursorEnabled === 'boolean' ? parsed.customCursorEnabled : FACTORY_DEFAULTS.cursor.customCursorEnabled),
            cursorScale: clampScale(cursor.cursorScale ?? parsed.cursorScale ?? FACTORY_DEFAULTS.cursor.cursorScale),
            flightLerpSpeed: normalizeFlightSpeedKey(cursor.flightLerpSpeed ?? parsed.flightLerpSpeed ?? parsed.flightSpeed),
            stardustTrailEnabled: typeof cursor.stardustTrailEnabled === 'boolean'
              ? cursor.stardustTrailEnabled
              : (typeof parsed.trailEnabled === 'boolean' ? parsed.trailEnabled : FACTORY_DEFAULTS.cursor.stardustTrailEnabled),
            particleColor: validateColor(cursor.particleColor ?? parsed.particleColor ?? FACTORY_DEFAULTS.cursor.particleColor)
          },
          hero: {
            gazeMode: (hero.gazeMode === 'fixed' || parsed.gazeMode === 'fixed' || parsed.heroGazeMode === 'fixed') ? 'fixed' : 'auto',
            poseOverride: normalizePoseOverride(hero.poseOverride ?? parsed.poseOverride ?? parsed.heroPoseOverride),
            characterZoom: clampScale(hero.characterZoom ?? parsed.characterZoom ?? parsed.characterScale ?? parsed.heroScale ?? FACTORY_DEFAULTS.hero.characterZoom),
            zoomFocus: normalizeZoomFocus(hero.zoomFocus ?? parsed.zoomFocus ?? FACTORY_DEFAULTS.hero.zoomFocus),
            flashConfettiEnabled: typeof hero.flashConfettiEnabled === 'boolean'
              ? hero.flashConfettiEnabled
              : (typeof parsed.flashConfettiEnabled === 'boolean'
                  ? parsed.flashConfettiEnabled
                  : (typeof parsed.cameraEffectsEnabled === 'boolean' ? parsed.cameraEffectsEnabled : FACTORY_DEFAULTS.hero.flashConfettiEnabled)),
            dragEnabled: typeof hero.dragEnabled === 'boolean'
              ? hero.dragEnabled
              : (typeof parsed.dragEnabled === 'boolean' ? parsed.dragEnabled : FACTORY_DEFAULTS.hero.dragEnabled),
            dragBoundaryConstrained: typeof hero.dragBoundaryConstrained === 'boolean'
              ? hero.dragBoundaryConstrained
              : (typeof parsed.dragBoundaryConstrained === 'boolean' ? parsed.dragBoundaryConstrained : FACTORY_DEFAULTS.hero.dragBoundaryConstrained),
            dragAutoSnapBack: typeof hero.dragAutoSnapBack === 'boolean'
              ? hero.dragAutoSnapBack
              : (typeof parsed.dragAutoSnapBack === 'boolean' ? parsed.dragAutoSnapBack : FACTORY_DEFAULTS.hero.dragAutoSnapBack),
            parallaxTiltEnabled: typeof hero.parallaxTiltEnabled === 'boolean'
              ? hero.parallaxTiltEnabled
              : (typeof parsed.parallaxTiltEnabled === 'boolean' ? parsed.parallaxTiltEnabled : FACTORY_DEFAULTS.hero.parallaxTiltEnabled)
          },
          preferences: {
            defaultStartupRole: (preferences.defaultStartupRole || parsed.defaultStartupRole || parsed.defaultRole || 'accountant'),
            defaultCursorEnabled: typeof preferences.defaultCursorEnabled === 'boolean'
              ? preferences.defaultCursorEnabled
              : (typeof parsed.defaultCursorEnabled === 'boolean' ? parsed.defaultCursorEnabled : FACTORY_DEFAULTS.preferences.defaultCursorEnabled),
            defaultAudioEnabled: typeof preferences.defaultAudioEnabled === 'boolean'
              ? preferences.defaultAudioEnabled
              : (typeof parsed.defaultAudioEnabled === 'boolean' ? parsed.defaultAudioEnabled : FACTORY_DEFAULTS.preferences.defaultAudioEnabled),
            reducedMotion: typeof preferences.reducedMotion === 'boolean'
              ? preferences.reducedMotion
              : (typeof parsed.reducedMotion === 'boolean' ? parsed.reducedMotion : FACTORY_DEFAULTS.preferences.reducedMotion)
          },
          visuals: {
            glassBlur: normalizeGlassBlur(parsed.visuals?.glassBlur ?? parsed.glassBlur ?? FACTORY_DEFAULTS.visuals.glassBlur),
            motionSpeed: normalizeMotionSpeed(parsed.visuals?.motionSpeed ?? parsed.motionSpeed ?? FACTORY_DEFAULTS.visuals.motionSpeed),
            accentColor: validateColor(parsed.visuals?.accentColor ?? parsed.accentColor ?? FACTORY_DEFAULTS.visuals.accentColor),
            layoutDensity: normalizeLayoutDensity(parsed.visuals?.layoutDensity ?? parsed.layoutDensity ?? FACTORY_DEFAULTS.visuals.layoutDensity)
          }
        };
      }
    }
  } catch {
    // Malformed JSON; proceed to legacy migration
  }

  // Tier 2: Migration from legacy portfolio_lab_config, lab_studio_state, and individual loose keys
  try {
    const rawLegacyLab = localStorage.getItem(LAB_STORAGE_KEY);
    const rawLegacyStudio = localStorage.getItem(LEGACY_STUDIO_STORAGE_KEY) ?? localStorage.getItem('lab_studio_state');

    let legacyLab = null;
    if (rawLegacyLab) {
      try {
        const p = JSON.parse(rawLegacyLab);
        if (p && typeof p === 'object') legacyLab = p;
      } catch {
        legacyLab = null;
      }
    }

    let legacyStudio = null;
    if (rawLegacyStudio) {
      try {
        const p = JSON.parse(rawLegacyStudio);
        if (p && typeof p === 'object') legacyStudio = p;
      } catch {
        legacyStudio = null;
      }
    }

    const legacyColor = localStorage.getItem('physics_particle_color');
    const legacyPitch = localStorage.getItem('physics_audio_pitch');
    const legacySound = localStorage.getItem('soundEnabled') ?? localStorage.getItem('portfolio_sound_enabled');

    // Helper for boolean resolution across nested and flat legacy representations
    const resolveBoolean = (candidates, fallback) => {
      for (const val of candidates) {
        if (typeof val === 'boolean') return val;
      }
      return fallback;
    };

    const soundEnabled = resolveBoolean(
      [
        legacyStudio?.audio?.soundEnabled,
        legacyStudio?.soundEnabled,
        legacyLab?.audio?.soundEnabled,
        legacyLab?.soundEnabled
      ],
      legacySound !== null ? legacySound === 'true' : FACTORY_DEFAULTS.audio.soundEnabled
    );

    const masterVolume = clampVolume(
      legacyStudio?.audio?.masterVolume ??
      legacyStudio?.masterVolume ??
      legacyLab?.audio?.masterVolume ??
      legacyLab?.masterVolume ??
      FACTORY_DEFAULTS.audio.masterVolume
    );

    const pitchMultiplier = clampPitch(
      legacyStudio?.audio?.pitchMultiplier ??
      legacyStudio?.audio?.audioPitch ??
      legacyStudio?.pitchMultiplier ??
      legacyStudio?.audioPitch ??
      legacyLab?.audio?.pitchMultiplier ??
      legacyLab?.audio?.audioPitch ??
      legacyLab?.pitchMultiplier ??
      legacyLab?.audioPitch ??
      (legacyPitch !== null ? parseFloat(legacyPitch) : FACTORY_DEFAULTS.audio.pitchMultiplier)
    );

    const soundMatchingMode = (
      legacyStudio?.audio?.soundMatchingMode === 'universal' ||
      legacyStudio?.soundMatchingMode === 'universal' ||
      legacyLab?.audio?.soundMatchingMode === 'universal' ||
      legacyLab?.soundMatchingMode === 'universal'
    ) ? 'universal' : 'dynamic';

    const customCursorEnabled = resolveBoolean(
      [
        legacyStudio?.cursor?.customCursorEnabled,
        legacyStudio?.customCursorEnabled,
        legacyLab?.cursor?.customCursorEnabled,
        legacyLab?.customCursorEnabled
      ],
      FACTORY_DEFAULTS.cursor.customCursorEnabled
    );

    const cursorScale = clampScale(
      legacyStudio?.cursor?.cursorScale ??
      legacyStudio?.cursorScale ??
      legacyLab?.cursor?.cursorScale ??
      legacyLab?.cursorScale ??
      FACTORY_DEFAULTS.cursor.cursorScale
    );

    const flightLerpSpeed = normalizeFlightSpeedKey(
      legacyStudio?.cursor?.flightLerpSpeed ??
      legacyStudio?.cursor?.flightSpeed ??
      legacyStudio?.flightLerpSpeed ??
      legacyStudio?.flightSpeed ??
      legacyLab?.cursor?.flightLerpSpeed ??
      legacyLab?.cursor?.flightSpeed ??
      legacyLab?.flightLerpSpeed ??
      legacyLab?.flightSpeed ??
      FACTORY_DEFAULTS.cursor.flightLerpSpeed
    );

    const stardustTrailEnabled = resolveBoolean(
      [
        legacyStudio?.cursor?.stardustTrailEnabled,
        legacyStudio?.cursor?.trailEnabled,
        legacyStudio?.stardustTrailEnabled,
        legacyStudio?.trailEnabled,
        legacyLab?.cursor?.stardustTrailEnabled,
        legacyLab?.cursor?.trailEnabled,
        legacyLab?.stardustTrailEnabled,
        legacyLab?.trailEnabled
      ],
      FACTORY_DEFAULTS.cursor.stardustTrailEnabled
    );

    const particleColor = validateColor(
      legacyStudio?.cursor?.particleColor ??
      legacyStudio?.particleColor ??
      legacyLab?.cursor?.particleColor ??
      legacyLab?.particleColor ??
      legacyColor ??
      FACTORY_DEFAULTS.cursor.particleColor
    );

    const gazeCandidate = legacyStudio?.hero?.gazeMode ??
      legacyStudio?.gazeMode ??
      legacyStudio?.heroGazeMode ??
      legacyLab?.hero?.gazeMode ??
      legacyLab?.gazeMode ??
      legacyLab?.heroGazeMode;
    const gazeMode = gazeCandidate === 'fixed' ? 'fixed' : 'auto';

    const poseCandidate = legacyStudio?.hero?.poseOverride ??
      legacyStudio?.poseOverride ??
      legacyStudio?.heroPoseOverride ??
      legacyLab?.hero?.poseOverride ??
      legacyLab?.poseOverride ??
      legacyLab?.heroPoseOverride;
    const poseOverride = normalizePoseOverride(poseCandidate);

    const characterZoom = clampScale(
      legacyStudio?.hero?.characterZoom ??
      legacyStudio?.hero?.characterScale ??
      legacyStudio?.characterZoom ??
      legacyStudio?.characterScale ??
      legacyStudio?.heroScale ??
      legacyLab?.hero?.characterZoom ??
      legacyLab?.hero?.characterScale ??
      legacyLab?.characterZoom ??
      legacyLab?.characterScale ??
      legacyLab?.heroScale ??
      FACTORY_DEFAULTS.hero.characterZoom
    );

    const flashConfettiEnabled = resolveBoolean(
      [
        legacyStudio?.hero?.flashConfettiEnabled,
        legacyStudio?.flashConfettiEnabled,
        legacyStudio?.cameraEffectsEnabled,
        legacyLab?.hero?.flashConfettiEnabled,
        legacyLab?.flashConfettiEnabled,
        legacyLab?.cameraEffectsEnabled
      ],
      FACTORY_DEFAULTS.hero.flashConfettiEnabled
    );

    const defaultStartupRole = (
      legacyStudio?.preferences?.defaultStartupRole ||
      legacyStudio?.defaultStartupRole ||
      legacyStudio?.defaultRole ||
      legacyLab?.preferences?.defaultStartupRole ||
      legacyLab?.defaultStartupRole ||
      legacyLab?.defaultRole ||
      FACTORY_DEFAULTS.preferences.defaultStartupRole
    );

    const defaultCursorEnabled = resolveBoolean(
      [
        legacyStudio?.preferences?.defaultCursorEnabled,
        legacyStudio?.defaultCursorEnabled,
        legacyLab?.preferences?.defaultCursorEnabled,
        legacyLab?.defaultCursorEnabled
      ],
      FACTORY_DEFAULTS.preferences.defaultCursorEnabled
    );

    const defaultAudioEnabled = resolveBoolean(
      [
        legacyStudio?.preferences?.defaultAudioEnabled,
        legacyStudio?.defaultAudioEnabled,
        legacyLab?.preferences?.defaultAudioEnabled,
        legacyLab?.defaultAudioEnabled
      ],
      FACTORY_DEFAULTS.preferences.defaultAudioEnabled
    );

    const reducedMotion = resolveBoolean(
      [
        legacyStudio?.preferences?.reducedMotion,
        legacyStudio?.reducedMotion,
        legacyLab?.preferences?.reducedMotion,
        legacyLab?.reducedMotion
      ],
      FACTORY_DEFAULTS.preferences.reducedMotion
    );

    return {
      version: 2,
      audio: {
        soundEnabled,
        masterVolume,
        pitchMultiplier,
        soundMatchingMode
      },
      cursor: {
        customCursorEnabled,
        cursorScale,
        flightLerpSpeed,
        stardustTrailEnabled,
        particleColor
      },
      hero: {
        gazeMode,
        poseOverride,
        characterZoom,
        zoomFocus: FACTORY_DEFAULTS.hero.zoomFocus,
        flashConfettiEnabled,
        dragEnabled: FACTORY_DEFAULTS.hero.dragEnabled,
        dragBoundaryConstrained: FACTORY_DEFAULTS.hero.dragBoundaryConstrained,
        dragAutoSnapBack: FACTORY_DEFAULTS.hero.dragAutoSnapBack,
        parallaxTiltEnabled: FACTORY_DEFAULTS.hero.parallaxTiltEnabled
      },
      preferences: {
        defaultStartupRole,
        defaultCursorEnabled,
        defaultAudioEnabled,
        reducedMotion
      },
      visuals: {
        glassBlur: FACTORY_DEFAULTS.visuals.glassBlur,
        motionSpeed: FACTORY_DEFAULTS.visuals.motionSpeed,
        accentColor: particleColor || FACTORY_DEFAULTS.visuals.accentColor,
        layoutDensity: normalizeLayoutDensity(
          legacyStudio?.visuals?.layoutDensity ??
          legacyStudio?.layoutDensity ??
          legacyLab?.visuals?.layoutDensity ??
          legacyLab?.layoutDensity ??
          (typeof window !== 'undefined' ? localStorage.getItem('portfolio_layout_density') : null) ??
          FACTORY_DEFAULTS.visuals.layoutDensity
        )
      }
    };
  } catch {
    return JSON.parse(JSON.stringify(FACTORY_DEFAULTS));
  }
}

// Backward-compatible exports
export const DEFAULT_LAB_CONFIG = {
  cursorScale: 1.0,
  flightSpeed: 0.14,
  wingDynamics: 1.0,
  gravity: 0,
  trailEnabled: true,
  particleColor: '#FF4D6D',
  soundEnabled: true,
  masterVolume: 0.8,
  audioPitch: 1.0,
  isDrawerOpen: false,
  activePreset: 'default'
};

export const LAB_PRESETS = {
  default: {
    id: 'default',
    name: 'Default Natural',
    label: 'Default Natural',
    description: 'Balanced organic flight lerp, standard gravity, and coral trail.',
    cursorScale: 1.0,
    flightSpeed: 0.14,
    wingDynamics: 1.0,
    gravity: 0,
    trailEnabled: true,
    particleColor: '#FF4D6D',
    soundEnabled: true,
    masterVolume: 0.8,
    audioPitch: 1.0
  }
};

export const LabContext = createContext(null);

export function LabProvider({ children, initialSoundEnabled }) {
  const initialConfig = useMemo(() => loadSavedControlCenterConfig(), []);

  // Audio Tab State
  const [soundEnabled, setSoundEnabledState] = useState(() => {
    if (typeof initialSoundEnabled === 'boolean') return initialSoundEnabled;
    return initialConfig.audio.soundEnabled;
  });
  const [masterVolume, setMasterVolumeState] = useState(initialConfig.audio.masterVolume);
  const [pitchMultiplier, setPitchMultiplierState] = useState(initialConfig.audio.pitchMultiplier);
  const [soundMatchingMode, setSoundMatchingModeState] = useState(initialConfig.audio.soundMatchingMode);

  // Cursor Tab State
  const [customCursorEnabled, setCustomCursorEnabledState] = useState(initialConfig.cursor.customCursorEnabled);
  const [cursorScale, setCursorScaleState] = useState(initialConfig.cursor.cursorScale);
  const [flightLerpSpeed, setFlightLerpSpeedState] = useState(initialConfig.cursor.flightLerpSpeed);
  const [stardustTrailEnabled, setStardustTrailEnabledState] = useState(initialConfig.cursor.stardustTrailEnabled);
  const [particleColor, setParticleColorState] = useState(initialConfig.cursor.particleColor);

  // Hero Tab State
  const [gazeMode, setGazeModeState] = useState(initialConfig.hero.gazeMode);
  const [poseOverride, setPoseOverrideState] = useState(initialConfig.hero.poseOverride);
  const [characterZoom, setCharacterZoomState] = useState(initialConfig.hero.characterZoom);
  const [zoomFocus, setZoomFocusState] = useState(initialConfig.hero.zoomFocus);
  const [flashConfettiEnabled, setFlashConfettiEnabledState] = useState(initialConfig.hero.flashConfettiEnabled);
  const [dragEnabled, setDragEnabledState] = useState(initialConfig.hero.dragEnabled);
  const [dragBoundaryConstrained, setDragBoundaryConstrainedState] = useState(initialConfig.hero.dragBoundaryConstrained);
  const [dragAutoSnapBack, setDragAutoSnapBackState] = useState(initialConfig.hero.dragAutoSnapBack);
  const [parallaxTiltEnabled, setParallaxTiltEnabledState] = useState(initialConfig.hero.parallaxTiltEnabled);

  // Preferences Tab State
  const [defaultStartupRole, setDefaultStartupRoleState] = useState(initialConfig.preferences.defaultStartupRole);
  const [defaultCursorEnabled, setDefaultCursorEnabledState] = useState(initialConfig.preferences.defaultCursorEnabled);
  const [defaultAudioEnabled, setDefaultAudioEnabledState] = useState(initialConfig.preferences.defaultAudioEnabled);
  const [reducedMotion, setReducedMotionState] = useState(initialConfig.preferences.reducedMotion);

  // Tab 5: Display & Visuals State
  const [glassBlur, setGlassBlurState] = useState(initialConfig.visuals.glassBlur);
  const [motionSpeed, setMotionSpeedState] = useState(initialConfig.visuals.motionSpeed);
  const [accentColor, setAccentColorState] = useState(initialConfig.visuals.accentColor);
  const [layoutDensity, setLayoutDensityState] = useState(initialConfig.visuals.layoutDensity);

  // Runtime UI State
  const [activeTab, setActiveTab] = useState('audio');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isInitialMount = useRef(true);

  // Inject Root CSS Custom Properties for Display & Visuals
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const rootStyle = root.style;

    // 1. Glass Blur: subtle (8px), balanced (16px), deep (24px)
    const blurPx = glassBlur === 'subtle' ? 8 : glassBlur === 'deep' ? 24 : 16;
    rootStyle.setProperty('--glass-blur', `${blurPx}px`);

    // 2. Motion Speed Multiplier: 0.7 (snappy), 1.0 (natural), 1.4 (cinematic)
    rootStyle.setProperty('--motion-speed-mult', `${motionSpeed}`);

    // 3. Accent Theme Color & RGB tuple
    rootStyle.setProperty('--theme-accent', accentColor);
    rootStyle.setProperty('--theme-accent-rgb', hexToRgb(accentColor));

    // 4. Layout Density CSS Custom Properties & Dynamic Root Classes
    const density = normalizeLayoutDensity(layoutDensity);
    const densityConfigs = {
      compact: { spacing: '0.82', padding: '0.88', gap: '0.85' },
      comfortable: { spacing: '1.0', padding: '1.0', gap: '1.0' },
      spacious: { spacing: '1.25', padding: '1.15', gap: '1.2' }
    };
    const currentConfig = densityConfigs[density] || densityConfigs.comfortable;
    rootStyle.setProperty('--density-spacing-mult', currentConfig.spacing);
    rootStyle.setProperty('--density-card-padding', currentConfig.padding);
    rootStyle.setProperty('--density-gap-mult', currentConfig.gap);

    // Toggle density root class on document.documentElement
    root.classList.remove('density-compact', 'density-comfortable', 'density-spacious');
    root.classList.add(`density-${density}`);

    // Self-healing DOM resilience against aggressive extensions or external DOM wipes
    let isHealing = false;
    const healDensityDOM = () => {
      if (isHealing) return;
      isHealing = true;
      try {
        const expectedClass = `density-${density}`;
        if (!root.classList.contains(expectedClass)) {
          root.classList.remove('density-compact', 'density-comfortable', 'density-spacious');
          root.classList.add(expectedClass);
        }
        if (rootStyle.getPropertyValue('--density-spacing-mult') !== currentConfig.spacing) {
          rootStyle.setProperty('--density-spacing-mult', currentConfig.spacing);
        }
        if (rootStyle.getPropertyValue('--density-card-padding') !== currentConfig.padding) {
          rootStyle.setProperty('--density-card-padding', currentConfig.padding);
        }
        if (rootStyle.getPropertyValue('--density-gap-mult') !== currentConfig.gap) {
          rootStyle.setProperty('--density-gap-mult', currentConfig.gap);
        }
      } finally {
        isHealing = false;
      }
    };

    let observer = null;
    let fallbackInterval = null;
    if (typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver((mutations) => {
        if (isHealing) return;
        for (const m of mutations) {
          if (m.type === 'attributes' && (m.attributeName === 'class' || m.attributeName === 'style')) {
            const expectedClass = `density-${density}`;
            const isStyleDrifted =
              rootStyle.getPropertyValue('--density-spacing-mult') !== currentConfig.spacing ||
              rootStyle.getPropertyValue('--density-card-padding') !== currentConfig.padding ||
              rootStyle.getPropertyValue('--density-gap-mult') !== currentConfig.gap;
            if (!root.classList.contains(expectedClass) || isStyleDrifted) {
              healDensityDOM();
            }
          }
        }
      });
      observer.observe(root, { attributes: true, attributeFilter: ['class', 'style'] });
    } else {
      // Periodic fallback for sandboxed or legacy environments without MutationObserver
      fallbackInterval = setInterval(healDensityDOM, 2000);
    }

    const handleWindowFocus = () => healDensityDOM();
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleWindowFocus);

    return () => {
      if (observer) {
        observer.disconnect();
      }
      if (fallbackInterval) {
        clearInterval(fallbackInterval);
      }
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleWindowFocus);
    };
  }, [glassBlur, motionSpeed, accentColor, layoutDensity]);

  // Synchronize audio engine live
  useEffect(() => {
    try {
      if (soundFX) {
        if (typeof soundFX.setEnabled === 'function') {
          soundFX.setEnabled(soundEnabled);
        }
        if (typeof soundFX.setMasterVolume === 'function') {
          soundFX.setMasterVolume(masterVolume);
        }
        if (typeof soundFX.setPitchMultiplier === 'function') {
          soundFX.setPitchMultiplier(pitchMultiplier);
        }
        if (typeof soundFX.setSoundMatchingMode === 'function') {
          soundFX.setSoundMatchingMode(soundMatchingMode);
        }
      }
    } catch {
      // Handled silently
    }
  }, [soundEnabled, masterVolume, pitchMultiplier, soundMatchingMode]);

  // Persist unified state to localStorage under CONTROL_CENTER_STORAGE_KEY & LAB_STORAGE_KEY
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const payload = {
      version: 2,
      audio: {
        soundEnabled,
        masterVolume,
        pitchMultiplier,
        soundMatchingMode
      },
      cursor: {
        customCursorEnabled,
        cursorScale,
        flightLerpSpeed,
        stardustTrailEnabled,
        particleColor
      },
      hero: {
        gazeMode,
        poseOverride,
        characterZoom,
        zoomFocus,
        flashConfettiEnabled,
        dragEnabled,
        dragBoundaryConstrained,
        dragAutoSnapBack,
        parallaxTiltEnabled
      },
      preferences: {
        defaultStartupRole,
        defaultCursorEnabled,
        defaultAudioEnabled,
        reducedMotion
      },
      visuals: {
        glassBlur,
        motionSpeed,
        accentColor,
        layoutDensity
      },
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(CONTROL_CENTER_STORAGE_KEY, JSON.stringify(payload));

      // Keep legacy keys updated for seamless fallback
      const legacyPayload = {
        version: 1,
        cursorScale,
        flightSpeed: FLIGHT_SPEED_MAP[flightLerpSpeed] || 0.14,
        wingDynamics: 1.0,
        gravity: 0,
        trailEnabled: stardustTrailEnabled,
        particleColor,
        soundEnabled,
        masterVolume,
        audioPitch: pitchMultiplier,
        activePreset: 'custom',
        updatedAt: payload.updatedAt
      };
      localStorage.setItem(LAB_STORAGE_KEY, JSON.stringify(legacyPayload));
      localStorage.setItem('physics_particle_color', particleColor);
      localStorage.setItem('physics_audio_pitch', pitchMultiplier.toString());
    } catch {
      // Storage quota or sandboxed environment
    }

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    try {
      window.dispatchEvent(new CustomEvent('portfolio:control-center-change', { detail: payload }));
      window.dispatchEvent(new CustomEvent('portfolio:lab-change', { detail: payload }));
    } catch {
      // Ignore
    }
  }, [
    soundEnabled,
    masterVolume,
    pitchMultiplier,
    soundMatchingMode,
    customCursorEnabled,
    cursorScale,
    flightLerpSpeed,
    stardustTrailEnabled,
    particleColor,
    gazeMode,
    poseOverride,
    characterZoom,
    zoomFocus,
    flashConfettiEnabled,
    dragEnabled,
    dragBoundaryConstrained,
    dragAutoSnapBack,
    parallaxTiltEnabled,
    defaultStartupRole,
    defaultCursorEnabled,
    defaultAudioEnabled,
    reducedMotion,
    glassBlur,
    motionSpeed,
    accentColor,
    layoutDensity
  ]);

  // --- Audio Setters ---
  const setSoundEnabled = useCallback((val) => {
    const enabled = Boolean(val);
    setSoundEnabledState(enabled);
    if (soundFX && typeof soundFX.setEnabled === 'function') {
      soundFX.setEnabled(enabled);
    }
  }, []);

  const setMasterVolume = useCallback((val) => {
    const clamped = clampVolume(val);
    setMasterVolumeState(clamped);
    if (soundFX && typeof soundFX.setMasterVolume === 'function') {
      soundFX.setMasterVolume(clamped);
    }
  }, []);

  const setPitchMultiplier = useCallback((val) => {
    const clamped = clampPitch(val);
    setPitchMultiplierState(clamped);
    if (soundFX && typeof soundFX.setPitchMultiplier === 'function') {
      soundFX.setPitchMultiplier(clamped);
    }
  }, []);

  const setSoundMatchingMode = useCallback((mode) => {
    const validMode = mode === 'universal' ? 'universal' : 'dynamic';
    setSoundMatchingModeState(validMode);
    if (soundFX && typeof soundFX.setSoundMatchingMode === 'function') {
      soundFX.setSoundMatchingMode(validMode);
    }
  }, []);

  // --- Cursor Setters ---
  const setCustomCursorEnabled = useCallback((val) => {
    setCustomCursorEnabledState(Boolean(val));
  }, []);

  const setCursorScale = useCallback((val) => {
    setCursorScaleState(clampScale(val));
  }, []);

  const setFlightLerpSpeed = useCallback((speedKeyOrNum) => {
    setFlightLerpSpeedState(normalizeFlightSpeedKey(speedKeyOrNum));
  }, []);

  const setStardustTrailEnabled = useCallback((val) => {
    setStardustTrailEnabledState(Boolean(val));
  }, []);

  const setParticleColor = useCallback((val) => {
    setParticleColorState(validateColor(val));
  }, []);

  // --- Hero Setters ---
  const setGazeMode = useCallback((mode) => {
    setGazeModeState(mode === 'fixed' ? 'fixed' : 'auto');
  }, []);

  const setPoseOverride = useCallback((pose) => {
    setPoseOverrideState(normalizePoseOverride(pose));
  }, []);

  const setCharacterZoom = useCallback((zoom) => {
    setCharacterZoomState(clampScale(zoom));
  }, []);

  const setZoomFocus = useCallback((focus) => {
    setZoomFocusState(normalizeZoomFocus(focus));
  }, []);

  const setFlashConfettiEnabled = useCallback((val) => {
    setFlashConfettiEnabledState(Boolean(val));
  }, []);

  const setDragEnabled = useCallback((val) => {
    setDragEnabledState(Boolean(val));
  }, []);

  const setDragBoundaryConstrained = useCallback((val) => {
    setDragBoundaryConstrainedState(Boolean(val));
  }, []);

  const setDragAutoSnapBack = useCallback((val) => {
    setDragAutoSnapBackState(Boolean(val));
  }, []);

  const setParallaxTiltEnabled = useCallback((val) => {
    setParallaxTiltEnabledState(Boolean(val));
  }, []);

  const recenterCharacter = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('portfolio:recenter-character'));
        if (soundFX && typeof soundFX.playSnap === 'function') {
          soundFX.playSnap();
        }
      } catch {
        // Handled safely
      }
    }
  }, []);

  // --- Preferences Setters ---
  const setDefaultStartupRole = useCallback((role) => {
    const cleanRole = typeof role === 'string' ? role.toLowerCase() : 'accountant';
    setDefaultStartupRoleState(cleanRole);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('portfolio_selected_role', cleanRole);
        window.dispatchEvent(new CustomEvent('switch-role-tab', { detail: { role: cleanRole, playSound: false } }));
      } catch {
        // Ignore
      }
    }
  }, []);

  const setDefaultCursorEnabled = useCallback((val) => {
    setDefaultCursorEnabledState(Boolean(val));
  }, []);

  const setDefaultAudioEnabled = useCallback((val) => {
    setDefaultAudioEnabledState(Boolean(val));
  }, []);

  const setReducedMotion = useCallback((val) => {
    setReducedMotionState(Boolean(val));
  }, []);

  // --- Display & Visuals Setters ---
  const setGlassBlur = useCallback((blur) => {
    setGlassBlurState(normalizeGlassBlur(blur));
  }, []);

  const setMotionSpeed = useCallback((speed) => {
    setMotionSpeedState(normalizeMotionSpeed(speed));
  }, []);

  const setAccentColor = useCallback((color) => {
    const valid = validateColor(color);
    setAccentColorState(valid);
    // Also harmonize with particleColor for visual cohesiveness
    setParticleColorState(valid);
  }, []);

  const setLayoutDensity = useCallback((density) => {
    const next = normalizeLayoutDensity(density);
    setLayoutDensityState((prev) => (prev === next ? prev : next));
  }, []);

  // --- 1-Click Factory Reset ---
  const resetDefaults = useCallback(() => {
    const f = FACTORY_DEFAULTS;

    // Audio
    setSoundEnabledState(f.audio.soundEnabled);
    setMasterVolumeState(f.audio.masterVolume);
    setPitchMultiplierState(f.audio.pitchMultiplier);
    setSoundMatchingModeState(f.audio.soundMatchingMode);

    // Cursor
    setCustomCursorEnabledState(f.cursor.customCursorEnabled);
    setCursorScaleState(f.cursor.cursorScale);
    setFlightLerpSpeedState(f.cursor.flightLerpSpeed);
    setStardustTrailEnabledState(f.cursor.stardustTrailEnabled);
    setParticleColorState(f.cursor.particleColor);

    // Hero
    setGazeModeState(f.hero.gazeMode);
    setPoseOverrideState(f.hero.poseOverride);
    setCharacterZoomState(f.hero.characterZoom);
    setZoomFocusState(f.hero.zoomFocus);
    setFlashConfettiEnabledState(f.hero.flashConfettiEnabled);
    setDragEnabledState(f.hero.dragEnabled);
    setDragBoundaryConstrainedState(f.hero.dragBoundaryConstrained);
    setDragAutoSnapBackState(f.hero.dragAutoSnapBack);
    setParallaxTiltEnabledState(f.hero.parallaxTiltEnabled);
    recenterCharacter();

    // Preferences
    setDefaultStartupRoleState(f.preferences.defaultStartupRole);
    setDefaultCursorEnabledState(f.preferences.defaultCursorEnabled);
    setDefaultAudioEnabledState(f.preferences.defaultAudioEnabled);
    setReducedMotionState(f.preferences.reducedMotion);

    // Visuals
    setGlassBlurState(f.visuals.glassBlur);
    setMotionSpeedState(f.visuals.motionSpeed);
    setAccentColorState(f.visuals.accentColor);
    setLayoutDensityState(f.visuals.layoutDensity);

    // Sync Audio Engine
    try {
      if (soundFX) {
        if (typeof soundFX.resetAudioDefaults === 'function') {
          soundFX.resetAudioDefaults();
        }
        if (typeof soundFX.playCrystalChime === 'function') {
          soundFX.playCrystalChime();
        }
      }
    } catch {
      // Ignore
    }

    try {
      localStorage.setItem(CONTROL_CENTER_STORAGE_KEY, JSON.stringify(f));
      window.dispatchEvent(new CustomEvent('portfolio:control-center-reset', { detail: f }));
    } catch {
      // Ignore
    }
  }, [recenterCharacter]);

  // --- Drawer Actions ---
  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
    try {
      if (soundEnabled && soundFX?.playRibbonSweep) {
        soundFX.playRibbonSweep('up');
      }
    } catch {
      // Ignore
    }
  }, [soundEnabled]);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    try {
      if (soundEnabled && soundFX?.playRibbonSweep) {
        soundFX.playRibbonSweep('down');
      }
    } catch {
      // Ignore
    }
  }, [soundEnabled]);

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => {
      const next = !prev;
      try {
        if (soundEnabled && soundFX?.playRibbonSweep) {
          soundFX.playRibbonSweep(next ? 'up' : 'down');
        }
      } catch {
        // Ignore
      }
      return next;
    });
  }, [soundEnabled]);

  // Global Window Event Listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOpen = () => openDrawer();
    const handleClose = () => closeDrawer();
    const handleToggle = () => toggleDrawer();
    const handleReset = () => resetDefaults();
    const handleSetDensity = (e) => {
      const d = e?.detail?.density ?? e?.detail;
      if (d !== undefined) {
        const next = normalizeLayoutDensity(d);
        setLayoutDensityState((prev) => (prev === next ? prev : next));
      }
    };

    window.addEventListener('portfolio:open-lab-drawer', handleOpen);
    window.addEventListener('open-lab-drawer', handleOpen);
    window.addEventListener('portfolio:close-lab-drawer', handleClose);
    window.addEventListener('close-lab-drawer', handleClose);
    window.addEventListener('portfolio:toggle-lab-drawer', handleToggle);
    window.addEventListener('toggle-lab-drawer', handleToggle);
    window.addEventListener('portfolio:reset-control-center', handleReset);
    window.addEventListener('portfolio:set-layout-density', handleSetDensity);

    // Multi-tab sync via storage event
    const handleStorage = (e) => {
      if (e.key === CONTROL_CENTER_STORAGE_KEY && e.newValue) {
        try {
          const inc = JSON.parse(e.newValue);
          if (inc && typeof inc === 'object') {
            if (inc.audio) {
              if (inc.audio.soundEnabled !== undefined) setSoundEnabledState(Boolean(inc.audio.soundEnabled));
              if (inc.audio.masterVolume !== undefined) setMasterVolumeState(clampVolume(inc.audio.masterVolume));
              if (inc.audio.pitchMultiplier !== undefined) setPitchMultiplierState(clampPitch(inc.audio.pitchMultiplier));
              if (inc.audio.soundMatchingMode !== undefined) setSoundMatchingModeState(inc.audio.soundMatchingMode);
            }
            if (inc.cursor) {
              if (inc.cursor.customCursorEnabled !== undefined) setCustomCursorEnabledState(Boolean(inc.cursor.customCursorEnabled));
              if (inc.cursor.cursorScale !== undefined) setCursorScaleState(clampScale(inc.cursor.cursorScale));
              if (inc.cursor.flightLerpSpeed !== undefined) setFlightLerpSpeedState(normalizeFlightSpeedKey(inc.cursor.flightLerpSpeed));
              if (inc.cursor.stardustTrailEnabled !== undefined) setStardustTrailEnabledState(Boolean(inc.cursor.stardustTrailEnabled));
              if (inc.cursor.particleColor !== undefined) setParticleColorState(validateColor(inc.cursor.particleColor));
            }
            if (inc.hero) {
              if (inc.hero.gazeMode !== undefined) setGazeModeState(inc.hero.gazeMode);
              if (inc.hero.poseOverride !== undefined) setPoseOverrideState(normalizePoseOverride(inc.hero.poseOverride));
              if (inc.hero.characterZoom !== undefined) setCharacterZoomState(clampScale(inc.hero.characterZoom));
              if (inc.hero.zoomFocus !== undefined) setZoomFocusState(normalizeZoomFocus(inc.hero.zoomFocus));
              if (inc.hero.flashConfettiEnabled !== undefined) setFlashConfettiEnabledState(Boolean(inc.hero.flashConfettiEnabled));
              if (inc.hero.dragEnabled !== undefined) setDragEnabledState(Boolean(inc.hero.dragEnabled));
              if (inc.hero.dragBoundaryConstrained !== undefined) setDragBoundaryConstrainedState(Boolean(inc.hero.dragBoundaryConstrained));
              if (inc.hero.dragAutoSnapBack !== undefined) setDragAutoSnapBackState(Boolean(inc.hero.dragAutoSnapBack));
              if (inc.hero.parallaxTiltEnabled !== undefined) setParallaxTiltEnabledState(Boolean(inc.hero.parallaxTiltEnabled));
            }
            if (inc.preferences) {
              if (inc.preferences.defaultStartupRole !== undefined) setDefaultStartupRoleState(inc.preferences.defaultStartupRole);
              if (inc.preferences.defaultCursorEnabled !== undefined) setDefaultCursorEnabledState(Boolean(inc.preferences.defaultCursorEnabled));
              if (inc.preferences.defaultAudioEnabled !== undefined) setDefaultAudioEnabledState(Boolean(inc.preferences.defaultAudioEnabled));
              if (inc.preferences.reducedMotion !== undefined) setReducedMotionState(Boolean(inc.preferences.reducedMotion));
            }
            if (inc.visuals) {
              if (inc.visuals.glassBlur !== undefined) setGlassBlurState(normalizeGlassBlur(inc.visuals.glassBlur));
              if (inc.visuals.motionSpeed !== undefined) setMotionSpeedState(normalizeMotionSpeed(inc.visuals.motionSpeed));
              if (inc.visuals.accentColor !== undefined) {
                const c = validateColor(inc.visuals.accentColor);
                setAccentColorState(c);
                setParticleColorState(c);
              }
              if (inc.visuals.layoutDensity !== undefined) {
                const next = normalizeLayoutDensity(inc.visuals.layoutDensity);
                setLayoutDensityState((prev) => (prev === next ? prev : next));
              }
            } else if (inc.layoutDensity !== undefined) {
              const next = normalizeLayoutDensity(inc.layoutDensity);
              setLayoutDensityState((prev) => (prev === next ? prev : next));
            }
          }
        } catch {
          // Ignore parse errors from other tabs
        }
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('portfolio:open-lab-drawer', handleOpen);
      window.removeEventListener('open-lab-drawer', handleOpen);
      window.removeEventListener('portfolio:close-lab-drawer', handleClose);
      window.removeEventListener('close-lab-drawer', handleClose);
      window.removeEventListener('portfolio:toggle-lab-drawer', handleToggle);
      window.removeEventListener('toggle-lab-drawer', handleToggle);
      window.removeEventListener('portfolio:reset-control-center', handleReset);
      window.removeEventListener('portfolio:set-layout-density', handleSetDensity);
      window.removeEventListener('storage', handleStorage);
    };
  }, [openDrawer, closeDrawer, toggleDrawer, resetDefaults]);

  // Derived kinematic speed number
  const flightSpeed = useMemo(() => {
    return FLIGHT_SPEED_MAP[flightLerpSpeed] || 0.14;
  }, [flightLerpSpeed]);

  // Memoized context value
  const value = useMemo(() => ({
    // Tab 1: Audio Studio
    soundEnabled,
    masterVolume,
    pitchMultiplier,
    soundMatchingMode,
    setSoundEnabled,
    setMasterVolume,
    setPitchMultiplier,
    setSoundMatchingMode,

    // Tab 2: Cursor & Dynamics
    customCursorEnabled,
    cursorScale,
    flightLerpSpeed,
    flightSpeed,
    stardustTrailEnabled,
    particleColor,
    setCustomCursorEnabled,
    setCursorScale,
    setFlightLerpSpeed,
    setFlightSpeed: setFlightLerpSpeed,
    setStardustTrailEnabled,
    setParticleColor,

    // Tab 3: Hero & Character Control
    gazeMode,
    poseOverride,
    characterZoom,
    zoomFocus,
    flashConfettiEnabled,
    dragEnabled,
    dragBoundaryConstrained,
    dragAutoSnapBack,
    parallaxTiltEnabled,
    setGazeMode,
    setPoseOverride,
    setCharacterZoom,
    setZoomFocus,
    setFlashConfettiEnabled,
    setDragEnabled,
    setDragBoundaryConstrained,
    setDragAutoSnapBack,
    setParallaxTiltEnabled,
    recenterCharacter,

    // Tab 4: Startup & Preferences
    defaultStartupRole,
    defaultCursorEnabled,
    defaultAudioEnabled,
    reducedMotion,
    setDefaultStartupRole,
    setDefaultCursorEnabled,
    setDefaultAudioEnabled,
    setReducedMotion,

    // Tab 5: Display & Visuals
    glassBlur,
    motionSpeed,
    accentColor,
    layoutDensity,
    setGlassBlur,
    setMotionSpeed,
    setAccentColor,
    setLayoutDensity,

    // Runtime UI State & Actions
    activeTab,
    setActiveTab,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    resetDefaults,
    resetToDefaults: resetDefaults,
    resetToFactoryDefaults: resetDefaults,

    // Legacy Aliases & Safety Fallbacks
    audioPitch: pitchMultiplier,
    setAudioPitch: setPitchMultiplier,
    setAudioVolume: setMasterVolume,
    trailEnabled: stardustTrailEnabled,
    setTrailEnabled: setStardustTrailEnabled,
    characterScale: characterZoom,
    setCharacterScale: setCharacterZoom,
    heroScale: characterZoom,
    setHeroScale: setCharacterZoom,
    heroGazeMode: gazeMode,
    setHeroGazeMode: setGazeMode,
    heroPoseOverride: poseOverride,
    setHeroPoseOverride: setPoseOverride,
    cameraEffectsEnabled: flashConfettiEnabled,
    setCameraEffectsEnabled: setFlashConfettiEnabled,
    defaultRole: defaultStartupRole,
    setDefaultRole: setDefaultStartupRole,
    startupRole: defaultStartupRole,
    setStartupRole: setDefaultStartupRole,
    startupCursorEnabled: defaultCursorEnabled,
    setStartupCursorEnabled: setDefaultCursorEnabled,
    startupAudioEnabled: defaultAudioEnabled,
    setStartupAudioEnabled: setDefaultAudioEnabled,
    gravity: 0,
    setGravity: () => {},
    isZeroG: true,
    isAntiGravity: false,
    isHeavyGravity: false,
    wingDynamics: 1.0,
    setWingDynamics: () => {},
    activePreset: 'custom',
    applyPreset: () => false,
    presets: LAB_PRESETS,
    LAB_PRESETS,
    DEFAULT_LAB_CONFIG
  }), [
    soundEnabled,
    masterVolume,
    pitchMultiplier,
    soundMatchingMode,
    setSoundEnabled,
    setMasterVolume,
    setPitchMultiplier,
    setSoundMatchingMode,
    customCursorEnabled,
    cursorScale,
    flightLerpSpeed,
    flightSpeed,
    stardustTrailEnabled,
    particleColor,
    setCustomCursorEnabled,
    setCursorScale,
    setFlightLerpSpeed,
    setStardustTrailEnabled,
    setParticleColor,
    gazeMode,
    poseOverride,
    characterZoom,
    zoomFocus,
    flashConfettiEnabled,
    dragEnabled,
    dragBoundaryConstrained,
    dragAutoSnapBack,
    parallaxTiltEnabled,
    setGazeMode,
    setPoseOverride,
    setCharacterZoom,
    setZoomFocus,
    setFlashConfettiEnabled,
    setDragEnabled,
    setDragBoundaryConstrained,
    setDragAutoSnapBack,
    setParallaxTiltEnabled,
    recenterCharacter,
    defaultStartupRole,
    defaultCursorEnabled,
    defaultAudioEnabled,
    reducedMotion,
    setDefaultStartupRole,
    setDefaultCursorEnabled,
    setDefaultAudioEnabled,
    setReducedMotion,
    glassBlur,
    motionSpeed,
    accentColor,
    layoutDensity,
    setGlassBlur,
    setMotionSpeed,
    setAccentColor,
    setLayoutDensity,
    activeTab,
    setActiveTab,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    resetDefaults
  ]);

  return (
    <LabContext.Provider value={value}>
      {children}
    </LabContext.Provider>
  );
}

export function useLab() {
  const context = useContext(LabContext);
  if (!context) {
    throw new Error('useLab must be used within a LabProvider');
  }
  return context;
}

export default LabProvider;
