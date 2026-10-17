/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { soundFX } from '../utils/audio';

export const LAB_STORAGE_KEY = 'portfolio_lab_config';

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
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Zero-G',
    label: 'Cyberpunk Zero-G',
    description: 'High agility, negative anti-gravity float, electric cyan stardust, and crisp high pitch.',
    cursorScale: 1.2,
    flightSpeed: 0.25,
    wingDynamics: 1.5,
    gravity: -25,
    trailEnabled: true,
    particleColor: '#00F2FE',
    soundEnabled: true,
    masterVolume: 0.85,
    audioPitch: 1.35
  },
  arcade: {
    id: 'arcade',
    name: 'Retro Arcade',
    label: 'Retro Arcade',
    description: 'Instant response, heavy arcade bounce, golden coin particles, and resonant retro pitch.',
    cursorScale: 1.15,
    flightSpeed: 0.20,
    wingDynamics: 1.3,
    gravity: 95,
    trailEnabled: true,
    particleColor: '#FFD700',
    soundEnabled: true,
    masterVolume: 0.9,
    audioPitch: 0.8
  },
  zen: {
    id: 'zen',
    name: 'Zen Minimalist',
    label: 'Zen Minimalist',
    description: 'Ultra-delicate float, slow fluid glide, zero gravity, and organic emerald calm.',
    cursorScale: 0.85,
    flightSpeed: 0.07,
    wingDynamics: 0.7,
    gravity: 0,
    trailEnabled: true,
    particleColor: '#10B981',
    soundEnabled: true,
    masterVolume: 0.6,
    audioPitch: 1.0
  },
  hyper: {
    id: 'hyper',
    name: 'Hyper Velocity',
    label: 'Hyper Velocity',
    description: 'Oversized supersonic tracking, buzzing wing frenzy, heavy dive gravity, and intense whistle.',
    cursorScale: 1.35,
    flightSpeed: 0.28,
    wingDynamics: 1.8,
    gravity: 45,
    trailEnabled: true,
    particleColor: '#FF4D6D',
    soundEnabled: true,
    masterVolume: 1.0,
    audioPitch: 1.75
  }
};

// Preset aliases for flexible naming across components and blueprints
LAB_PRESETS.cyberpunk_zerog = LAB_PRESETS.cyberpunk;
LAB_PRESETS['cyberpunk-zerog'] = LAB_PRESETS.cyberpunk;
LAB_PRESETS.retro_arcade = LAB_PRESETS.arcade;
LAB_PRESETS['retro-arcade'] = LAB_PRESETS.arcade;
LAB_PRESETS.zen_minimalist = LAB_PRESETS.zen;
LAB_PRESETS['zen-minimalist'] = LAB_PRESETS.zen;
LAB_PRESETS.hyper_velocity = LAB_PRESETS.hyper;
LAB_PRESETS['hyper-velocity'] = LAB_PRESETS.hyper;

// Clamping and validation utilities
function clamp(val, min, max, fallback) {
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num)) return fallback;
  return Math.min(Math.max(num, min), max);
}

function clampScale(val) {
  return parseFloat(clamp(val, 0.5, 2.0, 1.0).toFixed(2));
}

function clampFlightSpeed(val) {
  return parseFloat(clamp(val, 0.05, 0.35, 0.14).toFixed(2));
}

function clampWingDynamics(val) {
  return parseFloat(clamp(val, 0.5, 2.0, 1.0).toFixed(2));
}

function clampGravity(val) {
  return Math.round(clamp(val, -60, 140, 0));
}

function clampVolume(val) {
  return parseFloat(clamp(val, 0.0, 1.0, 0.8).toFixed(2));
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

function loadSavedConfig() {
  if (typeof window === 'undefined') return { ...DEFAULT_LAB_CONFIG };

  // 1. Try unified JSON key
  try {
    const raw = localStorage.getItem(LAB_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const cursorScale = clampScale(parsed.cursorScale ?? parsed.cursor?.scale ?? DEFAULT_LAB_CONFIG.cursorScale);
        const flightSpeed = clampFlightSpeed(parsed.flightSpeed ?? parsed.cursor?.speed ?? DEFAULT_LAB_CONFIG.flightSpeed);
        const wingDynamics = clampWingDynamics(parsed.wingDynamics ?? parsed.cursor?.wingDynamics ?? DEFAULT_LAB_CONFIG.wingDynamics);
        const gravity = clampGravity(parsed.gravity ?? parsed.physics?.gravity ?? DEFAULT_LAB_CONFIG.gravity);
        const trailEnabled = typeof parsed.trailEnabled === 'boolean'
          ? parsed.trailEnabled
          : (typeof parsed.physics?.trailEnabled === 'boolean' ? parsed.physics.trailEnabled : DEFAULT_LAB_CONFIG.trailEnabled);
        const particleColor = validateColor(parsed.particleColor ?? parsed.physics?.particleColor ?? DEFAULT_LAB_CONFIG.particleColor);
        const soundEnabled = typeof parsed.soundEnabled === 'boolean'
          ? parsed.soundEnabled
          : (typeof parsed.audio?.soundEnabled === 'boolean' ? parsed.audio.soundEnabled : DEFAULT_LAB_CONFIG.soundEnabled);
        const masterVolume = clampVolume(parsed.masterVolume ?? parsed.audio?.volume ?? DEFAULT_LAB_CONFIG.masterVolume);
        const audioPitch = clampPitch(parsed.audioPitch ?? parsed.audio?.pitch ?? DEFAULT_LAB_CONFIG.audioPitch);
        const activePreset = typeof parsed.activePreset === 'string' && LAB_PRESETS[parsed.activePreset]
          ? parsed.activePreset
          : 'default';

        return {
          cursorScale,
          flightSpeed,
          wingDynamics,
          gravity,
          trailEnabled,
          particleColor,
          soundEnabled,
          masterVolume,
          audioPitch,
          isDrawerOpen: false,
          activePreset
        };
      }
    }
  } catch {
    // Malformed JSON; proceed to legacy migration
  }

  // 2. Safe Migration from Legacy Keys
  try {
    const legacyColor = localStorage.getItem('physics_particle_color');
    const legacyGravity = localStorage.getItem('physics_gravity');
    const legacyPitch = localStorage.getItem('physics_audio_pitch');
    const legacySound = localStorage.getItem('soundEnabled') ?? localStorage.getItem('portfolio_sound_enabled');

    return {
      ...DEFAULT_LAB_CONFIG,
      particleColor: legacyColor ? validateColor(legacyColor) : DEFAULT_LAB_CONFIG.particleColor,
      gravity: legacyGravity !== null ? clampGravity(legacyGravity) : DEFAULT_LAB_CONFIG.gravity,
      audioPitch: legacyPitch !== null ? clampPitch(legacyPitch) : DEFAULT_LAB_CONFIG.audioPitch,
      soundEnabled: legacySound !== null ? legacySound === 'true' : DEFAULT_LAB_CONFIG.soundEnabled,
      isDrawerOpen: false
    };
  } catch {
    return { ...DEFAULT_LAB_CONFIG };
  }
}

export const LabContext = createContext(null);

export function LabProvider({ children, initialSoundEnabled }) {
  const [cursorScale, setCursorScaleState] = useState(() => loadSavedConfig().cursorScale);
  const [flightSpeed, setFlightSpeedState] = useState(() => loadSavedConfig().flightSpeed);
  const [wingDynamics, setWingDynamicsState] = useState(() => loadSavedConfig().wingDynamics);
  const [gravity, setGravityState] = useState(() => loadSavedConfig().gravity);
  const [trailEnabled, setTrailEnabledState] = useState(() => loadSavedConfig().trailEnabled);
  const [particleColor, setParticleColorState] = useState(() => loadSavedConfig().particleColor);
  const [soundEnabled, setSoundEnabledState] = useState(() => {
    if (typeof initialSoundEnabled === 'boolean') return initialSoundEnabled;
    return loadSavedConfig().soundEnabled;
  });
  const [masterVolume, setMasterVolumeState] = useState(() => loadSavedConfig().masterVolume);
  const [audioPitch, setAudioPitchState] = useState(() => loadSavedConfig().audioPitch);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activePreset, setActivePreset] = useState(() => loadSavedConfig().activePreset);

  const isInitialMount = useRef(true);

  // Sync Audio Engine on state change
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
          soundFX.setPitchMultiplier(audioPitch);
        }
      }
    } catch {
      // Ignore initial browser audio context restrictions
    }
  }, [soundEnabled, masterVolume, audioPitch]);

  // Persist to unified localStorage key and emit sync event
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const payload = {
      version: 1,
      cursorScale,
      flightSpeed,
      wingDynamics,
      gravity,
      trailEnabled,
      particleColor,
      soundEnabled,
      masterVolume,
      audioPitch,
      activePreset,
      cursor: {
        scale: cursorScale,
        speed: flightSpeed,
        wingDynamics
      },
      physics: {
        gravity,
        trailEnabled,
        particleColor
      },
      audio: {
        soundEnabled,
        volume: masterVolume,
        pitch: audioPitch
      },
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(LAB_STORAGE_KEY, JSON.stringify(payload));
      // Keep legacy keys updated for zero-regression backward compatibility
      localStorage.setItem('physics_particle_color', particleColor);
      localStorage.setItem('physics_gravity', gravity.toString());
      localStorage.setItem('physics_audio_pitch', audioPitch.toString());
    } catch {
      // Storage quota or sandboxed environment
    }

    // Skip dispatching outbound events on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    try {
      window.dispatchEvent(new CustomEvent('portfolio:lab-change', { detail: payload }));
    } catch {
      // Ignore
    }
  }, [
    cursorScale,
    flightSpeed,
    wingDynamics,
    gravity,
    trailEnabled,
    particleColor,
    soundEnabled,
    masterVolume,
    audioPitch,
    activePreset
  ]);

  // Actions
  const setCursorScale = useCallback((val) => {
    const clamped = clampScale(val);
    setCursorScaleState(clamped);
    setActivePreset('custom');
  }, []);

  const setFlightSpeed = useCallback((val) => {
    const clamped = clampFlightSpeed(val);
    setFlightSpeedState(clamped);
    setActivePreset('custom');
  }, []);

  const setWingDynamics = useCallback((val) => {
    const clamped = clampWingDynamics(val);
    setWingDynamicsState(clamped);
    setActivePreset('custom');
  }, []);

  const setGravity = useCallback((val) => {
    const clamped = clampGravity(val);
    setGravityState(clamped);
    setActivePreset('custom');
  }, []);

  const setTrailEnabled = useCallback((val) => {
    setTrailEnabledState(Boolean(val));
    setActivePreset('custom');
  }, []);

  const setParticleColor = useCallback((val) => {
    const validated = validateColor(val);
    setParticleColorState(validated);
    setActivePreset('custom');
  }, []);

  const setSoundEnabled = useCallback((val) => {
    const enabled = Boolean(val);
    setSoundEnabledState(enabled);
    try {
      if (soundFX && typeof soundFX.setEnabled === 'function') {
        soundFX.setEnabled(enabled);
      }
    } catch {
      // Ignore
    }
  }, []);

  const setMasterVolume = useCallback((val) => {
    const clamped = clampVolume(val);
    setMasterVolumeState(clamped);
    setActivePreset('custom');
    try {
      if (soundFX && typeof soundFX.setMasterVolume === 'function') {
        soundFX.setMasterVolume(clamped);
      }
    } catch {
      // Ignore
    }
  }, []);

  const setAudioPitch = useCallback((val) => {
    const clamped = clampPitch(val);
    setAudioPitchState(clamped);
    setActivePreset('custom');
    try {
      if (soundFX && typeof soundFX.setPitchMultiplier === 'function') {
        soundFX.setPitchMultiplier(clamped);
      }
    } catch {
      // Ignore
    }
  }, []);

  const applyPreset = useCallback((presetKey) => {
    const key = typeof presetKey === 'string' ? presetKey.toLowerCase() : '';
    const preset = LAB_PRESETS[key];
    if (!preset) return false;

    setCursorScaleState(preset.cursorScale);
    setFlightSpeedState(preset.flightSpeed);
    setWingDynamicsState(preset.wingDynamics);
    setGravityState(preset.gravity);
    setTrailEnabledState(preset.trailEnabled);
    setParticleColorState(preset.particleColor);
    setSoundEnabledState(preset.soundEnabled);
    setMasterVolumeState(preset.masterVolume);
    setAudioPitchState(preset.audioPitch);
    setActivePreset(preset.id || key);

    // Audio feedback on preset activation
    try {
      if (preset.soundEnabled && soundFX) {
        if (typeof soundFX.playSparkle === 'function') {
          soundFX.playSparkle();
        } else if (typeof soundFX.playCosmicSparkle === 'function') {
          soundFX.playCosmicSparkle();
        }
      }
    } catch {
      // Ignore
    }

    try {
      window.dispatchEvent(new CustomEvent('portfolio:preset-applied', { detail: { presetKey: key, preset } }));
    } catch {
      // Ignore
    }

    return true;
  }, []);

  const resetDefaults = useCallback(() => {
    const d = DEFAULT_LAB_CONFIG;
    setCursorScaleState(d.cursorScale);
    setFlightSpeedState(d.flightSpeed);
    setWingDynamicsState(d.wingDynamics);
    setGravityState(d.gravity);
    setTrailEnabledState(d.trailEnabled);
    setParticleColorState(d.particleColor);
    setSoundEnabledState(d.soundEnabled);
    setMasterVolumeState(d.masterVolume);
    setAudioPitchState(d.audioPitch);
    setActivePreset('default');

    try {
      if (soundFX) {
        if (typeof soundFX.resetAudioDefaults === 'function') {
          soundFX.resetAudioDefaults();
        }
        if (typeof soundFX.playPop === 'function') {
          soundFX.playPop();
        }
      }
    } catch {
      // Ignore
    }

    try {
      window.dispatchEvent(new CustomEvent('portfolio:lab-reset', { detail: d }));
    } catch {
      // Ignore
    }
  }, []);

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
    try {
      if (soundFX && typeof soundFX.playRibbonToggle === 'function') {
        soundFX.playRibbonToggle(true);
      }
    } catch {
      // Ignore
    }
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    try {
      if (soundFX && typeof soundFX.playRibbonToggle === 'function') {
        soundFX.playRibbonToggle(false);
      }
    } catch {
      // Ignore
    }
  }, []);

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => {
      const next = !prev;
      try {
        if (soundFX && typeof soundFX.playRibbonToggle === 'function') {
          soundFX.playRibbonToggle(next);
        }
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  // Custom Event Listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOpen = () => openDrawer();
    const handleClose = () => closeDrawer();
    const handleToggle = () => toggleDrawer();
    const handlePreset = (e) => {
      const key = e.detail?.presetKey || e.detail?.preset || e.detail;
      if (key) applyPreset(key);
    };

    // Support both namespaced and legacy event names
    window.addEventListener('portfolio:open-lab-drawer', handleOpen);
    window.addEventListener('open-lab-drawer', handleOpen);
    window.addEventListener('portfolio:close-lab-drawer', handleClose);
    window.addEventListener('close-lab-drawer', handleClose);
    window.addEventListener('portfolio:toggle-lab-drawer', handleToggle);
    window.addEventListener('toggle-lab-drawer', handleToggle);
    window.addEventListener('portfolio:apply-lab-preset', handlePreset);
    window.addEventListener('apply-lab-preset', handlePreset);

    // Multi-tab synchronization via storage event
    const handleStorage = (e) => {
      if (e.key === LAB_STORAGE_KEY && e.newValue) {
        try {
          const incoming = JSON.parse(e.newValue);
          if (incoming && typeof incoming === 'object') {
            if (incoming.cursorScale !== undefined) setCursorScaleState(clampScale(incoming.cursorScale));
            if (incoming.flightSpeed !== undefined) setFlightSpeedState(clampFlightSpeed(incoming.flightSpeed));
            if (incoming.wingDynamics !== undefined) setWingDynamicsState(clampWingDynamics(incoming.wingDynamics));
            if (incoming.gravity !== undefined) setGravityState(clampGravity(incoming.gravity));
            if (incoming.trailEnabled !== undefined) setTrailEnabledState(Boolean(incoming.trailEnabled));
            if (incoming.particleColor !== undefined) setParticleColorState(validateColor(incoming.particleColor));
            if (incoming.soundEnabled !== undefined) setSoundEnabledState(Boolean(incoming.soundEnabled));
            if (incoming.masterVolume !== undefined) setMasterVolumeState(clampVolume(incoming.masterVolume));
            if (incoming.audioPitch !== undefined) setAudioPitchState(clampPitch(incoming.audioPitch));
            if (incoming.activePreset !== undefined) setActivePreset(incoming.activePreset);
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
      window.removeEventListener('portfolio:apply-lab-preset', handlePreset);
      window.removeEventListener('apply-lab-preset', handlePreset);
      window.removeEventListener('storage', handleStorage);
    };
  }, [openDrawer, closeDrawer, toggleDrawer, applyPreset]);

  // Memoized Context Value
  const value = useMemo(() => ({
    // State values
    cursorScale,
    flightSpeed,
    wingDynamics,
    gravity,
    trailEnabled,
    particleColor,
    soundEnabled,
    masterVolume,
    audioPitch,
    isDrawerOpen,
    activePreset,

    // Preset Data
    presets: LAB_PRESETS,
    LAB_PRESETS,
    DEFAULT_LAB_CONFIG,

    // Actions
    setCursorScale,
    setFlightSpeed,
    setWingDynamics,
    setGravity,
    setTrailEnabled,
    setParticleColor,
    setSoundEnabled,
    setMasterVolume,
    setAudioPitch,
    applyPreset,
    resetDefaults,
    resetToDefaults: resetDefaults,
    openDrawer,
    closeDrawer,
    toggleDrawer,

    // Aliases for compatibility
    setCursorSpeed: setFlightSpeed,
    setAudioVolume: setMasterVolume,

    // Helper dynamic flags
    isZeroG: gravity === 0,
    isAntiGravity: gravity < 0,
    isHeavyGravity: gravity > 50
  }), [
    cursorScale,
    flightSpeed,
    wingDynamics,
    gravity,
    trailEnabled,
    particleColor,
    soundEnabled,
    masterVolume,
    audioPitch,
    isDrawerOpen,
    activePreset,
    setCursorScale,
    setFlightSpeed,
    setWingDynamics,
    setGravity,
    setTrailEnabled,
    setParticleColor,
    setSoundEnabled,
    setMasterVolume,
    setAudioPitch,
    applyPreset,
    resetDefaults,
    openDrawer,
    closeDrawer,
    toggleDrawer
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
