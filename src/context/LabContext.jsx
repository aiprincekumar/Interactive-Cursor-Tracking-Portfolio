/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { soundFX } from '../utils/audio';

export const CONTROL_CENTER_STORAGE_KEY = 'portfolio_control_center';
export const LAB_STORAGE_KEY = 'portfolio_lab_config'; // Legacy mirror key
export const LEGACY_STUDIO_STORAGE_KEY = 'lab_studio_state'; // Legacy studio drawer state key
export const AUTO_SCROLL_STORAGE_KEY = 'portfolio_auto_scroll_on_refresh';
export const STORAGE_KEY_AI_CHAT = 'portfolio_ai_chat_settings';

export const DEFAULT_AI_CHAT_SETTINGS = Object.freeze({
  // Cluster 1: Model & Execution Engine
  modelId: 'auto', // 'auto' | 'offline_rag' | 'onnx-community/SmolLM2-135M-Instruct-ONNX' | 'onnx-community/Qwen2.5-0.5B-Instruct' | 'onnx-community/Qwen2.5-1.5B-Instruct'
  loadTrigger: 'on_demand', // 'on_demand' (Default) | 'on_page_load' | 'on_open' | 'manual'
  consentMode: 'always_ask', // 'always_ask' (Default) | 'auto_confirm' | 'wifi_only'
  executionBackend: 'webgpu', // 'webgpu' (Default) | 'wasm'
  cacheRetentionDays: 30, // Retention period in days

  // Cluster 2: Generation & Personality Controls
  streamResponse: true, // Token streaming typewriter effect
  temperature: 0.7, // 0.0 (Strict/Deterministic) to 1.2 (Creative)
  maxTokens: 512, // Maximum output tokens (128 - 2048)
  personaTone: 'helpful_pro', // 'helpful_pro' | 'concise_technical' | 'creative_mentor' | 'casual_peer'

  // Cluster 3: Voice & Sound Studio
  ttsEnabled: false, // Speech synthesis enabled
  voicePitch: 1.0, // 0.5 to 1.5
  voiceRate: 1.0, // 0.7 to 1.5
  voiceId: 'default', // System speech voice URI or 'default'
  chatSoundEffects: true, // Zero-audio-asset procedural sound effects

  // Cluster 4: Privacy & Storage Tools
  sessionRetention: 'until_closed', // 'ephemeral' | 'until_closed' | 'persistent_7d' | 'persistent_30d'
  anonymizeTelemetry: true, // Keep telemetry anonymized

  // Cluster 5: UI & Ergonomics
  defaultWindowSize: 'normal', // 'compact' | 'normal' | 'expanded' | 'fullscreen'
  autoGreetOnOpen: true, // Greet on chat panel open
  suggestionChipsEnabled: true, // Display interactive quick suggestion chips
  slashCommandsEnabled: true // Display slash '/' command autocomplete palette
});

// Phase 1: 0ms Dual Real-Time Cross-Tab 3D IPC Channel & Storage Keys
export const PORTFOLIO_3D_CHANNEL_NAME = 'portfolio_3d_channel';
export const PORTFOLIO_3D_INSTANT_SYNC_KEY = 'portfolio_3d_instant_sync';

export const FACTORY_DEFAULTS = {
  version: 2,
  audio: {
    soundEnabled: true,
    masterVolume: 0.8, // 0.0 - 1.0 (80%)
    pitchMultiplier: 1.0, // 0.5x - 2.0x
    soundMatchingMode: 'dynamic', // 'dynamic' | 'universal'
    voiceAnnouncementEnabled: false, // Web Speech API Text-to-Speech
    voiceFocusEnabled: true, // Web Speech API Keyboard Focus Speech
    voiceHoverEnabled: false // Web Speech API Mouse Hover Speech
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
    layoutDensity: 'comfortable', // 'compact' | 'comfortable' | 'spacious'
    autoScrollOnRefresh: true
  },
  threeD: {
    master3D: false,
    depthIntensity: 1.0, // slider 0.2 to 2.5
    stylePreset: 'subtle', // 'subtle' | 'isometric' | 'deep'
    masterTheme: 'apple-glass', // All 16 Master Themes: 'apple-glass' | 'cyber-neon' | 'studio-matte' | 'floating-hologram' | 'obsidian-gold' | 'retro-synthwave' | 'tokyo-midnight' | 'emerald-matrix' | 'sunset-bloom' | 'nordic-frost' | 'crimson-stealth' | 'champagne-quartz' | 'cosmic-void' | 'solar-flare' | 'vaporwave-dream' | 'liquid-titanium'
    showSandboxPreview: false, // boolean toggle for mini 3D preview card (default hidden)
    tabUI3DMode: true, // true = CPC 3D Tab in 100% Pure 3D Zero-Text Mode, false = Classic 2D Text Mode
    isVisualOnly: true, // alias for tabUI3DMode
    clusterFilter: 'all', // 'all' | 'design' | 'physics' | 'system'
    elements: {
      floatingButton: false,
      navbarItems: false,
      navbarIcons: false,
      resumeButton: false,
      profilePic: false,
      header: false,
      subHeader: false,
      description: false,
      container: false,
      containerContent: false,
    },
    lighting: {
      preset: 'studio-soft', // 'studio-soft' | 'sunset' | 'cyber-neon'
      angle: 45, // 0 to 360 degrees
      cursorLight: true,
      shadowSoftness: 0.7, // 0.1 to 1.0
    },
    camera: {
      anglePreset: 'isometric', // 'isometric' | 'top-down' | 'eye-level' | 'cinematic'
      perspectiveFOV: 1000, // 400 to 2000 px
      tiltSensitivity: 15, // 0 to 40 degrees
      autoOrbit: false,
      orbitSpeed: 1.0, // 0.2 to 3.0
    },
    materials: {
      preset: 'glass-acrylic', // 'glass-acrylic' | 'metallic-gloss' | 'neumorphic-clay' | 'cyber-wireframe'
      specularGlow: 0.6, // 0 to 1.0
      bevelExtrusion: 3, // 1 to 8 px
    },
    physics: {
      hoverPop: 12, // 4 to 32 px
      clickDepression: true,
      elasticity: 'snappy', // 'rigid' | 'snappy' | 'bouncy'
      magneticPull: false,
    },
    // NEW SECTION 6: Exploded View & CAD Blueprint
    exploded: {
      enabled: false,
      separationDistance: 45, // 0 to 120 px
      blueprintMode: false,
      layerStagger: 15, // 0 to 30 px
      ghostOpacity: 0.4, // 0.1 to 1.0
      soloStrata: null, // null | 'strata-01' | 'strata-02' | 'strata-03'
    },
    // NEW SECTION 7: Atmosphere, Environment & Fog
    environment: {
      skybox: 'dark-studio', // 'dark-studio' | 'cyber-city' | 'cosmic-nebula' | 'sunset-horizon'
      fogDensity: 30, // 0 to 100%
      stardustParticles: true,
      particleCount: 50, // 10 to 150
      depthOfFieldBlur: 0, // 0 to 10 px
    },
    // NEW SECTION 8: 3D Spatial Audio & Acoustics
    spatialAudio: {
      binauralPanning: true,
      roomSize: 'studio', // 'booth' | 'studio' | 'cathedral'
      reverbIntensity: 0.5, // 0 to 1.0
      materialHaptics: true,
      dopplerShift: false,
    },
    // NEW SECTION 9: Performance & GPU Profiles
    performance: {
      fpsTarget: 60, // 30 | 60 | 120
      autoThrottleIdle: true,
      gpuAcceleration: 'standard', // 'standard' | 'webgl-boost'
      lowPowerThreshold: true,
    }
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

export const PHYSICS_PROFILES = {
  rigid: {
    id: 'rigid',
    name: 'Rigid',
    stiffness: 450,
    damping: 38,
    overshoot: 0,
    overshootPercent: '0%',
    badge: 'Critically Damped',
    desc: 'Instant mechanical response, zero overshoot',
    curveLabel: 'Critical Damping (0% Overshoot)',
    path: 'M 10 50 C 30 32, 50 30, 80 30 L 270 30'
  },
  snappy: {
    id: 'snappy',
    name: 'Snappy',
    stiffness: 240,
    damping: 18,
    overshoot: 12,
    overshootPercent: '12%',
    badge: 'iOS Spring',
    desc: 'Natural balanced spring with swift stabilization',
    curveLabel: 'iOS Spring Curve (12% Overshoot)',
    path: 'M 10 50 C 32 24, 48 27.6, 60 27.6 C 75 27.6, 85 30.8, 105 30 L 270 30'
  },
  bouncy: {
    id: 'bouncy',
    name: 'Bouncy',
    stiffness: 160,
    damping: 8,
    overshoot: 35,
    overshootPercent: '35%',
    badge: 'Under-Damped',
    desc: 'Playful kinetic oscillation and rubbery recoil',
    curveLabel: 'Under-Damped Oscillation (35% Overshoot, 3 Waves)',
    path: 'M 10 50 C 22 18, 35 23, 46 23 C 58 23, 67 35.5, 78 35.5 C 90 35.5, 99 26.5, 112 26.5 C 124 26.5, 134 32.5, 146 32.5 C 158 32.5, 168 29.0, 180 29.0 C 192 29.0, 202 30, 215 30 L 270 30'
  }
};

export const SPRING_PROFILES = PHYSICS_PROFILES;

export const ACOUSTIC_PROFILES = {
  booth: {
    id: 'booth',
    name: 'Acoustic Booth',
    reflectionCount: 4,
    rayLength: 26,
    decayMultiplier: 0.45,
    reverbTail: '0.4s',
    badge: 'Dry Booth',
    desc: 'Tight, ultra-dry sound stage with minimal acoustic bounce',
    rays: [
      { angle: 30, length: 24, opacity: 0.65 },
      { angle: 120, length: 26, opacity: 0.6 },
      { angle: 210, length: 22, opacity: 0.7 },
      { angle: 300, length: 25, opacity: 0.6 }
    ]
  },
  studio: {
    id: 'studio',
    name: 'Mastering Studio',
    reflectionCount: 8,
    rayLength: 46,
    decayMultiplier: 1.0,
    reverbTail: '1.2s',
    badge: 'Balanced Studio',
    desc: 'Warm, controlled natural reverberation and balanced stereo imaging',
    rays: [
      { angle: 0, length: 44, opacity: 0.7 },
      { angle: 45, length: 46, opacity: 0.8 },
      { angle: 90, length: 42, opacity: 0.65 },
      { angle: 135, length: 46, opacity: 0.75 },
      { angle: 180, length: 44, opacity: 0.7 },
      { angle: 225, length: 46, opacity: 0.8 },
      { angle: 270, length: 42, opacity: 0.65 },
      { angle: 315, length: 46, opacity: 0.75 }
    ]
  },
  cathedral: {
    id: 'cathedral',
    name: 'Grand Cathedral',
    reflectionCount: 12,
    rayLength: 62,
    decayMultiplier: 2.4,
    reverbTail: '3.5s',
    badge: 'Lush Cathedral',
    desc: 'Expansive, cavernous acoustic space with lush lingering tail',
    rays: [
      { angle: 0, length: 60, opacity: 0.85 },
      { angle: 30, length: 62, opacity: 0.9 },
      { angle: 60, length: 58, opacity: 0.75 },
      { angle: 90, length: 60, opacity: 0.85 },
      { angle: 120, length: 62, opacity: 0.9 },
      { angle: 150, length: 58, opacity: 0.75 },
      { angle: 180, length: 60, opacity: 0.85 },
      { angle: 210, length: 62, opacity: 0.9 },
      { angle: 240, length: 58, opacity: 0.75 },
      { angle: 270, length: 60, opacity: 0.85 },
      { angle: 300, length: 62, opacity: 0.9 },
      { angle: 330, length: 58, opacity: 0.75 }
    ]
  }
};

export const SPATIAL_ACOUSTIC_PROFILES = ACOUSTIC_PROFILES;

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

export function clampDepthIntensity(val) {
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num)) return 1.0;
  return parseFloat(clamp(num, 0.2, 2.5, 1.0).toFixed(2));
}

export function sanitizeChatSettings(raw) {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_AI_CHAT_SETTINGS };
  }

  const validModelIds = [
    'auto',
    'offline_rag',
    'onnx-community/SmolLM2-135M-Instruct-ONNX',
    'HuggingFaceTB/SmolLM2-135M-Instruct',
    'onnx-community/Qwen2.5-0.5B-Instruct',
    'onnx-community/Qwen2.5-1.5B-Instruct'
  ];
  const modelId = typeof raw.modelId === 'string' && (validModelIds.includes(raw.modelId) || raw.modelId.length > 0)
    ? raw.modelId
    : DEFAULT_AI_CHAT_SETTINGS.modelId;

  const validLoadTriggers = ['on_demand', 'on_page_load', 'on_open', 'manual'];
  const loadTrigger = typeof raw.loadTrigger === 'string' && validLoadTriggers.includes(raw.loadTrigger)
    ? raw.loadTrigger
    : DEFAULT_AI_CHAT_SETTINGS.loadTrigger;

  const validConsentModes = ['always_ask', 'auto_confirm', 'wifi_only'];
  const consentMode = typeof raw.consentMode === 'string' && validConsentModes.includes(raw.consentMode)
    ? raw.consentMode
    : DEFAULT_AI_CHAT_SETTINGS.consentMode;

  const validBackends = ['webgpu', 'wasm'];
  const executionBackend = typeof raw.executionBackend === 'string' && validBackends.includes(raw.executionBackend)
    ? raw.executionBackend
    : DEFAULT_AI_CHAT_SETTINGS.executionBackend;

  const cacheRetentionDays = typeof raw.cacheRetentionDays === 'number' && !isNaN(raw.cacheRetentionDays)
    ? Math.round(clamp(raw.cacheRetentionDays, 1, 365, DEFAULT_AI_CHAT_SETTINGS.cacheRetentionDays))
    : DEFAULT_AI_CHAT_SETTINGS.cacheRetentionDays;

  const streamResponse = typeof raw.streamResponse === 'boolean'
    ? raw.streamResponse
    : DEFAULT_AI_CHAT_SETTINGS.streamResponse;

  const temperature = typeof raw.temperature === 'number' && !isNaN(raw.temperature)
    ? parseFloat(clamp(raw.temperature, 0.0, 1.2, DEFAULT_AI_CHAT_SETTINGS.temperature).toFixed(2))
    : DEFAULT_AI_CHAT_SETTINGS.temperature;

  const maxTokens = typeof raw.maxTokens === 'number' && !isNaN(raw.maxTokens)
    ? Math.round(clamp(raw.maxTokens, 128, 2048, DEFAULT_AI_CHAT_SETTINGS.maxTokens))
    : DEFAULT_AI_CHAT_SETTINGS.maxTokens;

  const validTones = ['helpful_pro', 'concise_technical', 'creative_mentor', 'casual_peer'];
  const personaTone = typeof raw.personaTone === 'string' && validTones.includes(raw.personaTone)
    ? raw.personaTone
    : DEFAULT_AI_CHAT_SETTINGS.personaTone;

  const ttsEnabled = typeof raw.ttsEnabled === 'boolean'
    ? raw.ttsEnabled
    : DEFAULT_AI_CHAT_SETTINGS.ttsEnabled;

  const voicePitch = typeof raw.voicePitch === 'number' && !isNaN(raw.voicePitch)
    ? parseFloat(clamp(raw.voicePitch, 0.5, 1.5, DEFAULT_AI_CHAT_SETTINGS.voicePitch).toFixed(2))
    : DEFAULT_AI_CHAT_SETTINGS.voicePitch;

  const voiceRate = typeof raw.voiceRate === 'number' && !isNaN(raw.voiceRate)
    ? parseFloat(clamp(raw.voiceRate, 0.5, 1.5, DEFAULT_AI_CHAT_SETTINGS.voiceRate).toFixed(2))
    : DEFAULT_AI_CHAT_SETTINGS.voiceRate;

  const voiceId = typeof raw.voiceId === 'string' && raw.voiceId.trim().length > 0
    ? raw.voiceId
    : DEFAULT_AI_CHAT_SETTINGS.voiceId;

  const chatSoundEffects = typeof raw.chatSoundEffects === 'boolean'
    ? raw.chatSoundEffects
    : DEFAULT_AI_CHAT_SETTINGS.chatSoundEffects;

  const validRetentions = ['ephemeral', 'until_closed', 'persistent_7d', 'persistent_30d'];
  const sessionRetention = typeof raw.sessionRetention === 'string' && validRetentions.includes(raw.sessionRetention)
    ? raw.sessionRetention
    : DEFAULT_AI_CHAT_SETTINGS.sessionRetention;

  const anonymizeTelemetry = typeof raw.anonymizeTelemetry === 'boolean'
    ? raw.anonymizeTelemetry
    : DEFAULT_AI_CHAT_SETTINGS.anonymizeTelemetry;

  const validWindowSizes = ['compact', 'normal', 'expanded', 'fullscreen'];
  const defaultWindowSize = typeof raw.defaultWindowSize === 'string' && validWindowSizes.includes(raw.defaultWindowSize)
    ? raw.defaultWindowSize
    : DEFAULT_AI_CHAT_SETTINGS.defaultWindowSize;

  const autoGreetOnOpen = typeof raw.autoGreetOnOpen === 'boolean'
    ? raw.autoGreetOnOpen
    : DEFAULT_AI_CHAT_SETTINGS.autoGreetOnOpen;

  const suggestionChipsEnabled = typeof raw.suggestionChipsEnabled === 'boolean'
    ? raw.suggestionChipsEnabled
    : DEFAULT_AI_CHAT_SETTINGS.suggestionChipsEnabled;

  const slashCommandsEnabled = typeof raw.slashCommandsEnabled === 'boolean'
    ? raw.slashCommandsEnabled
    : DEFAULT_AI_CHAT_SETTINGS.slashCommandsEnabled;

  return {
    modelId,
    loadTrigger,
    consentMode,
    executionBackend,
    cacheRetentionDays,
    streamResponse,
    temperature,
    maxTokens,
    personaTone,
    ttsEnabled,
    voicePitch,
    voiceRate,
    voiceId,
    chatSoundEffects,
    sessionRetention,
    anonymizeTelemetry,
    defaultWindowSize,
    autoGreetOnOpen,
    suggestionChipsEnabled,
    slashCommandsEnabled
  };
}

export const getInitialChatSettings = () => {
  if (typeof window === 'undefined') return { ...DEFAULT_AI_CHAT_SETTINGS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AI_CHAT);
    if (!raw) return { ...DEFAULT_AI_CHAT_SETTINGS };
    const parsed = JSON.parse(raw);
    return sanitizeChatSettings({ ...DEFAULT_AI_CHAT_SETTINGS, ...parsed });
  } catch (err) {
    console.warn('[LabContext] Failed to parse chat settings, falling back to defaults:', err);
    return { ...DEFAULT_AI_CHAT_SETTINGS };
  }
};

export function normalizeStylePreset(val) {
  if (typeof val === 'string') {
    const s = val.trim().toLowerCase();
    if (s === 'subtle' || s === 'isometric' || s === 'deep') return s;
  }
  return 'subtle';
}

export function normalizeThreeDElements(rawElements) {
  const defaults = FACTORY_DEFAULTS.threeD.elements;
  if (!rawElements || typeof rawElements !== 'object') {
    return { ...defaults };
  }
  const result = {};
  for (const key of Object.keys(defaults)) {
    result[key] = typeof rawElements[key] === 'boolean' ? rawElements[key] : defaults[key];
  }
  return result;
}

export function normalize3DMasterTheme(val) {
  if (typeof val === 'string') {
    const s = val.trim().toLowerCase();
    const VALID_THEMES = [
      'apple-glass',
      'cyber-neon',
      'studio-matte',
      'floating-hologram',
      'obsidian-gold',
      'retro-synthwave',
      'tokyo-midnight',
      'emerald-matrix',
      'sunset-bloom',
      'nordic-frost',
      'crimson-stealth',
      'champagne-quartz',
      'cosmic-void',
      'solar-flare',
      'vaporwave-dream',
      'liquid-titanium'
    ];
    if (VALID_THEMES.includes(s)) {
      return s;
    }
  }
  return FACTORY_DEFAULTS.threeD.masterTheme;
}

export function normalize3DLighting(raw) {
  const defaults = FACTORY_DEFAULTS.threeD.lighting;
  if (!raw || typeof raw !== 'object') return { ...defaults };
  const preset = (raw.preset === 'sunset' || raw.preset === 'cyber-neon' || raw.preset === 'studio-soft')
    ? raw.preset
    : defaults.preset;
  const angle = typeof raw.angle === 'number' && !isNaN(raw.angle) ? clamp(raw.angle, 0, 360, defaults.angle) : defaults.angle;
  const cursorLight = typeof raw.cursorLight === 'boolean' ? raw.cursorLight : defaults.cursorLight;
  const shadowSoftness = typeof raw.shadowSoftness === 'number' && !isNaN(raw.shadowSoftness) ? clamp(raw.shadowSoftness, 0.1, 1.0, defaults.shadowSoftness) : defaults.shadowSoftness;
  return { preset, angle: Math.round(angle), cursorLight, shadowSoftness: parseFloat(shadowSoftness.toFixed(2)) };
}

export function normalize3DCamera(raw) {
  const defaults = FACTORY_DEFAULTS.threeD.camera;
  if (!raw || typeof raw !== 'object') return { ...defaults };
  const anglePreset = (raw.anglePreset === 'top-down' || raw.anglePreset === 'eye-level' || raw.anglePreset === 'cinematic' || raw.anglePreset === 'isometric')
    ? raw.anglePreset
    : defaults.anglePreset;
  const perspectiveFOV = typeof raw.perspectiveFOV === 'number' && !isNaN(raw.perspectiveFOV) ? clamp(raw.perspectiveFOV, 400, 2000, defaults.perspectiveFOV) : defaults.perspectiveFOV;
  const tiltSensitivity = typeof raw.tiltSensitivity === 'number' && !isNaN(raw.tiltSensitivity) ? clamp(raw.tiltSensitivity, 0, 40, defaults.tiltSensitivity) : defaults.tiltSensitivity;
  const autoOrbit = typeof raw.autoOrbit === 'boolean' ? raw.autoOrbit : defaults.autoOrbit;
  const orbitSpeed = typeof raw.orbitSpeed === 'number' && !isNaN(raw.orbitSpeed) ? clamp(raw.orbitSpeed, 0.2, 3.0, defaults.orbitSpeed) : defaults.orbitSpeed;
  return {
    anglePreset,
    perspectiveFOV: Math.round(perspectiveFOV),
    tiltSensitivity: Math.round(tiltSensitivity),
    autoOrbit,
    orbitSpeed: parseFloat(orbitSpeed.toFixed(1))
  };
}

export function normalize3DMaterials(raw) {
  const defaults = FACTORY_DEFAULTS.threeD.materials;
  if (!raw || typeof raw !== 'object') return { ...defaults };
  const preset = (raw.preset === 'metallic-gloss' || raw.preset === 'neumorphic-clay' || raw.preset === 'cyber-wireframe' || raw.preset === 'glass-acrylic')
    ? raw.preset
    : defaults.preset;
  const specularGlow = typeof raw.specularGlow === 'number' && !isNaN(raw.specularGlow) ? clamp(raw.specularGlow, 0.0, 1.0, defaults.specularGlow) : defaults.specularGlow;
  const bevelExtrusion = typeof raw.bevelExtrusion === 'number' && !isNaN(raw.bevelExtrusion) ? clamp(raw.bevelExtrusion, 1, 8, defaults.bevelExtrusion) : defaults.bevelExtrusion;
  return {
    preset,
    specularGlow: parseFloat(specularGlow.toFixed(2)),
    bevelExtrusion: Math.round(bevelExtrusion)
  };
}

export function normalize3DPhysics(raw) {
  const defaults = FACTORY_DEFAULTS.threeD.physics;
  if (!raw || typeof raw !== 'object') return { ...defaults };
  const hoverPop = typeof raw.hoverPop === 'number' && !isNaN(raw.hoverPop) ? clamp(raw.hoverPop, 4, 32, defaults.hoverPop) : defaults.hoverPop;
  const clickDepression = typeof raw.clickDepression === 'boolean' ? raw.clickDepression : defaults.clickDepression;
  const elasticity = (raw.elasticity === 'rigid' || raw.elasticity === 'bouncy' || raw.elasticity === 'snappy')
    ? raw.elasticity
    : defaults.elasticity;
  const magneticPull = typeof raw.magneticPull === 'boolean' ? raw.magneticPull : defaults.magneticPull;
  return {
    hoverPop: Math.round(hoverPop),
    clickDepression,
    elasticity,
    magneticPull
  };
}

export function normalize3DClusterFilter(val) {
  if (typeof val === 'string') {
    const s = val.trim().toLowerCase();
    if (s === 'all' || s === 'design' || s === 'physics' || s === 'system') {
      return s;
    }
  }
  return FACTORY_DEFAULTS.threeD.clusterFilter;
}

export function normalize3DExploded(raw) {
  const defaults = FACTORY_DEFAULTS.threeD.exploded;
  if (!raw || typeof raw !== 'object') return { ...defaults };
  const enabled = typeof raw.enabled === 'boolean' ? raw.enabled : defaults.enabled;
  const separationDistance = typeof raw.separationDistance === 'number' && !isNaN(raw.separationDistance)
    ? clamp(raw.separationDistance, 0, 120, defaults.separationDistance)
    : defaults.separationDistance;
  const blueprintMode = typeof raw.blueprintMode === 'boolean' ? raw.blueprintMode : defaults.blueprintMode;
  const layerStagger = typeof raw.layerStagger === 'number' && !isNaN(raw.layerStagger)
    ? clamp(raw.layerStagger, 0, 30, defaults.layerStagger)
    : defaults.layerStagger;
  const ghostOpacity = typeof raw.ghostOpacity === 'number' && !isNaN(raw.ghostOpacity)
    ? clamp(raw.ghostOpacity, 0.1, 1.0, defaults.ghostOpacity)
    : defaults.ghostOpacity;
  const validStrata = ['strata-01', 'strata-02', 'strata-03'];
  const soloStrata = (typeof raw.soloStrata === 'string' && validStrata.includes(raw.soloStrata.trim().toLowerCase()))
    ? raw.soloStrata.trim().toLowerCase()
    : null;
  return {
    enabled,
    separationDistance: Math.round(separationDistance),
    blueprintMode,
    layerStagger: Math.round(layerStagger),
    ghostOpacity: parseFloat(ghostOpacity.toFixed(2)),
    soloStrata
  };
}

export function normalize3DEnvironment(raw) {
  const defaults = FACTORY_DEFAULTS.threeD.environment;
  if (!raw || typeof raw !== 'object') return { ...defaults };
  const validSkyboxes = ['dark-studio', 'cyber-city', 'cosmic-nebula', 'sunset-horizon'];
  const skybox = (typeof raw.skybox === 'string' && validSkyboxes.includes(raw.skybox.trim().toLowerCase()))
    ? raw.skybox.trim().toLowerCase()
    : defaults.skybox;
  const fogDensity = typeof raw.fogDensity === 'number' && !isNaN(raw.fogDensity)
    ? clamp(raw.fogDensity, 0, 100, defaults.fogDensity)
    : defaults.fogDensity;
  const stardustParticles = typeof raw.stardustParticles === 'boolean' ? raw.stardustParticles : defaults.stardustParticles;
  const particleCount = typeof raw.particleCount === 'number' && !isNaN(raw.particleCount)
    ? clamp(raw.particleCount, 10, 150, defaults.particleCount)
    : defaults.particleCount;
  const depthOfFieldBlur = typeof raw.depthOfFieldBlur === 'number' && !isNaN(raw.depthOfFieldBlur)
    ? clamp(raw.depthOfFieldBlur, 0, 10, defaults.depthOfFieldBlur)
    : defaults.depthOfFieldBlur;
  return {
    skybox,
    fogDensity: Math.round(fogDensity),
    stardustParticles,
    particleCount: Math.round(particleCount),
    depthOfFieldBlur: parseFloat(depthOfFieldBlur.toFixed(1))
  };
}

export function normalize3DSpatialAudio(raw) {
  const defaults = FACTORY_DEFAULTS.threeD.spatialAudio;
  if (!raw || typeof raw !== 'object') return { ...defaults };
  const binauralPanning = typeof raw.binauralPanning === 'boolean' ? raw.binauralPanning : defaults.binauralPanning;
  const validRoomSizes = ['booth', 'studio', 'cathedral'];
  const roomSize = (typeof raw.roomSize === 'string' && validRoomSizes.includes(raw.roomSize.trim().toLowerCase()))
    ? raw.roomSize.trim().toLowerCase()
    : defaults.roomSize;
  const reverbIntensity = typeof raw.reverbIntensity === 'number' && !isNaN(raw.reverbIntensity)
    ? clamp(raw.reverbIntensity, 0.0, 1.0, defaults.reverbIntensity)
    : defaults.reverbIntensity;
  const materialHaptics = typeof raw.materialHaptics === 'boolean' ? raw.materialHaptics : defaults.materialHaptics;
  const dopplerShift = typeof raw.dopplerShift === 'boolean' ? raw.dopplerShift : defaults.dopplerShift;
  return {
    binauralPanning,
    roomSize,
    reverbIntensity: parseFloat(reverbIntensity.toFixed(2)),
    materialHaptics,
    dopplerShift
  };
}

export function normalize3DPerformance(raw) {
  const defaults = FACTORY_DEFAULTS.threeD.performance;
  if (!raw || typeof raw !== 'object') return { ...defaults };
  const validFps = [30, 60, 120];
  const fpsTarget = validFps.includes(Number(raw.fpsTarget)) ? Number(raw.fpsTarget) : defaults.fpsTarget;
  const autoThrottleIdle = typeof raw.autoThrottleIdle === 'boolean' ? raw.autoThrottleIdle : defaults.autoThrottleIdle;
  const gpuAcceleration = (raw.gpuAcceleration === 'webgl-boost' || raw.gpuAcceleration === 'standard')
    ? raw.gpuAcceleration
    : defaults.gpuAcceleration;
  const lowPowerThreshold = typeof raw.lowPowerThreshold === 'boolean' ? raw.lowPowerThreshold : defaults.lowPowerThreshold;
  return {
    fpsTarget,
    autoThrottleIdle,
    gpuAcceleration,
    lowPowerThreshold
  };
}

export function normalizeThreeD(raw) {
  if (!raw || typeof raw !== 'object') {
    return JSON.parse(JSON.stringify(FACTORY_DEFAULTS.threeD));
  }
  return {
    master3D: typeof raw.master3D === 'boolean' ? raw.master3D : FACTORY_DEFAULTS.threeD.master3D,
    depthIntensity: clampDepthIntensity(raw.depthIntensity ?? FACTORY_DEFAULTS.threeD.depthIntensity),
    stylePreset: normalizeStylePreset(raw.stylePreset ?? FACTORY_DEFAULTS.threeD.stylePreset),
    masterTheme: normalize3DMasterTheme(raw.masterTheme ?? FACTORY_DEFAULTS.threeD.masterTheme),
    showSandboxPreview: typeof raw.showSandboxPreview === 'boolean' ? raw.showSandboxPreview : FACTORY_DEFAULTS.threeD.showSandboxPreview,
    tabUI3DMode: typeof raw.tabUI3DMode === 'boolean' ? raw.tabUI3DMode : (typeof raw.isVisualOnly === 'boolean' ? raw.isVisualOnly : FACTORY_DEFAULTS.threeD.tabUI3DMode),
    isVisualOnly: typeof raw.tabUI3DMode === 'boolean' ? raw.tabUI3DMode : (typeof raw.isVisualOnly === 'boolean' ? raw.isVisualOnly : FACTORY_DEFAULTS.threeD.isVisualOnly),
    clusterFilter: normalize3DClusterFilter(raw.clusterFilter),
    elements: normalizeThreeDElements(raw.elements),
    lighting: normalize3DLighting(raw.lighting),
    camera: normalize3DCamera(raw.camera),
    materials: normalize3DMaterials(raw.materials),
    physics: normalize3DPhysics(raw.physics),
    exploded: normalize3DExploded(raw.exploded),
    environment: normalize3DEnvironment(raw.environment),
    spatialAudio: normalize3DSpatialAudio(raw.spatialAudio),
    performance: normalize3DPerformance(raw.performance)
  };
}

export function computeScopedSandboxStyles(threeD = FACTORY_DEFAULTS.threeD, overrides = {}) {
  const cfg = threeD || FACTORY_DEFAULTS.threeD;
  const explodeZ = cfg.exploded?.enabled ? (cfg.exploded?.separationDistance ?? 45) : 0;
  return {
    '--3d-master': cfg.master3D ? '1' : '0',
    '--3d-depth-intensity': `${cfg.depthIntensity ?? 1.0}`,
    '--3d-style-preset': cfg.stylePreset || 'subtle',
    '--3d-master-theme': cfg.masterTheme || 'apple-glass',
    '--3d-light-preset': cfg.lighting?.preset || 'studio-soft',
    '--3d-light-angle': `${cfg.lighting?.angle ?? 45}deg`,
    '--3d-shadow-softness': `${cfg.lighting?.shadowSoftness ?? 0.7}`,
    '--3d-cursor-light': cfg.lighting?.cursorLight ? '1' : '0',
    '--3d-camera-angle': cfg.camera?.anglePreset || 'isometric',
    '--3d-perspective': `${cfg.camera?.perspectiveFOV ?? 1000}px`,
    '--3d-tilt-sensitivity': `${cfg.camera?.tiltSensitivity ?? 15}deg`,
    '--3d-orbit-speed': `${cfg.camera?.orbitSpeed ?? 1.0}s`,
    '--3d-material-preset': cfg.materials?.preset || 'glass-acrylic',
    '--3d-specular-glow': `${cfg.materials?.specularGlow ?? 0.6}`,
    '--3d-bevel-extrusion': `${cfg.materials?.bevelExtrusion ?? 3}px`,
    '--3d-hover-pop': `${cfg.physics?.hoverPop ?? 12}px`,
    '--3d-elasticity': cfg.physics?.elasticity || 'snappy',
    '--3d-explode-z': `${explodeZ}px`,
    '--3d-blueprint-mode': cfg.exploded?.blueprintMode ? '1' : '0',
    '--3d-solo-strata': cfg.exploded?.soloStrata || 'none',
    '--3d-fog-density': `${(cfg.environment?.fogDensity ?? 30) / 100}`,
    '--3d-dof-blur': `${cfg.environment?.depthOfFieldBlur ?? 0}px`,
    '--3d-room-reverb': `${cfg.spatialAudio?.reverbIntensity ?? 0.5}`,
    '--3d-target-fps': `${cfg.performance?.fpsTarget ?? 60}`,
    '--3d-skybox': cfg.environment?.skybox || 'dark-studio',
    '--3d-gpu-accel': cfg.performance?.gpuAcceleration || 'standard',
    ...overrides
  };
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
        const threeDRaw = parsed.threeD || {};

        return {
          version: 2,
          audio: {
            soundEnabled: typeof audio.soundEnabled === 'boolean'
              ? audio.soundEnabled
              : (typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : FACTORY_DEFAULTS.audio.soundEnabled),
            masterVolume: clampVolume(audio.masterVolume ?? parsed.masterVolume ?? FACTORY_DEFAULTS.audio.masterVolume),
            pitchMultiplier: clampPitch(audio.pitchMultiplier ?? parsed.pitchMultiplier ?? parsed.audioPitch ?? FACTORY_DEFAULTS.audio.pitchMultiplier),
            soundMatchingMode: (audio.soundMatchingMode === 'universal' || parsed.soundMatchingMode === 'universal') ? 'universal' : 'dynamic',
            voiceAnnouncementEnabled: typeof audio.voiceAnnouncementEnabled === 'boolean'
              ? audio.voiceAnnouncementEnabled
              : (typeof parsed.voiceAnnouncementEnabled === 'boolean' ? parsed.voiceAnnouncementEnabled : FACTORY_DEFAULTS.audio.voiceAnnouncementEnabled),
            voiceFocusEnabled: typeof audio.voiceFocusEnabled === 'boolean'
              ? audio.voiceFocusEnabled
              : (typeof parsed.voiceFocusEnabled === 'boolean' ? parsed.voiceFocusEnabled : FACTORY_DEFAULTS.audio.voiceFocusEnabled),
            voiceHoverEnabled: typeof audio.voiceHoverEnabled === 'boolean'
              ? audio.voiceHoverEnabled
              : (typeof parsed.voiceHoverEnabled === 'boolean' ? parsed.voiceHoverEnabled : FACTORY_DEFAULTS.audio.voiceHoverEnabled)
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
            layoutDensity: normalizeLayoutDensity(parsed.visuals?.layoutDensity ?? parsed.layoutDensity ?? FACTORY_DEFAULTS.visuals.layoutDensity),
            autoScrollOnRefresh: typeof parsed.visuals?.autoScrollOnRefresh === 'boolean'
              ? parsed.visuals.autoScrollOnRefresh
              : (typeof window !== 'undefined' ? (localStorage.getItem('portfolio_auto_scroll_on_refresh') !== 'false' && sessionStorage.getItem('portfolio_auto_scroll_on_refresh') !== 'false') : true)
          },
          threeD: {
            master3D: typeof threeDRaw.master3D === 'boolean' ? threeDRaw.master3D : FACTORY_DEFAULTS.threeD.master3D,
            depthIntensity: clampDepthIntensity(threeDRaw.depthIntensity ?? FACTORY_DEFAULTS.threeD.depthIntensity),
            stylePreset: normalizeStylePreset(threeDRaw.stylePreset ?? FACTORY_DEFAULTS.threeD.stylePreset),
            masterTheme: normalize3DMasterTheme(threeDRaw.masterTheme ?? FACTORY_DEFAULTS.threeD.masterTheme),
            showSandboxPreview: false, // Always starts collapsed on initial mount / page load per user requirement
            clusterFilter: normalize3DClusterFilter(threeDRaw.clusterFilter),
            elements: normalizeThreeDElements(threeDRaw.elements),
            lighting: normalize3DLighting(threeDRaw.lighting),
            camera: normalize3DCamera(threeDRaw.camera),
            materials: normalize3DMaterials(threeDRaw.materials),
            physics: normalize3DPhysics(threeDRaw.physics),
            exploded: normalize3DExploded(threeDRaw.exploded),
            environment: normalize3DEnvironment(threeDRaw.environment),
            spatialAudio: normalize3DSpatialAudio(threeDRaw.spatialAudio),
            performance: normalize3DPerformance(threeDRaw.performance)
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

    const voiceAnnouncementEnabled = resolveBoolean(
      [
        legacyStudio?.audio?.voiceAnnouncementEnabled,
        legacyStudio?.voiceAnnouncementEnabled,
        legacyLab?.audio?.voiceAnnouncementEnabled,
        legacyLab?.voiceAnnouncementEnabled
      ],
      (() => {
        try {
          const directStored = localStorage.getItem('portfolio_voice_announcement_enabled');
          if (directStored !== null) return directStored === 'true';
        } catch {}
        return FACTORY_DEFAULTS.audio.voiceAnnouncementEnabled;
      })()
    );

    const voiceFocusEnabled = resolveBoolean(
      [
        legacyStudio?.audio?.voiceFocusEnabled,
        legacyStudio?.voiceFocusEnabled,
        legacyLab?.audio?.voiceFocusEnabled,
        legacyLab?.voiceFocusEnabled
      ],
      (() => {
        try {
          const directStored = localStorage.getItem('portfolio_voice_focus_enabled');
          if (directStored !== null) return directStored === 'true';
        } catch {}
        return FACTORY_DEFAULTS.audio.voiceFocusEnabled;
      })()
    );

    const voiceHoverEnabled = resolveBoolean(
      [
        legacyStudio?.audio?.voiceHoverEnabled,
        legacyStudio?.voiceHoverEnabled,
        legacyLab?.audio?.voiceHoverEnabled,
        legacyLab?.voiceHoverEnabled
      ],
      (() => {
        try {
          const directStored = localStorage.getItem('portfolio_voice_hover_enabled');
          if (directStored !== null) return directStored === 'true';
        } catch {}
        return FACTORY_DEFAULTS.audio.voiceHoverEnabled;
      })()
    );

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
        soundMatchingMode,
        voiceAnnouncementEnabled,
        voiceFocusEnabled,
        voiceHoverEnabled
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
        ),
        autoScrollOnRefresh: (typeof window !== 'undefined'
          ? (localStorage.getItem('portfolio_auto_scroll_on_refresh') !== 'false' && sessionStorage.getItem('portfolio_auto_scroll_on_refresh') !== 'false')
          : true)
      },
      threeD: JSON.parse(JSON.stringify(FACTORY_DEFAULTS.threeD))
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
export const LabCursorContext = createContext(null);
export const LabAudioContext = createContext(null);
export const LabHeroContext = createContext(null);
export const LabThreeDContext = createContext(null);
export const LabVisualsContext = createContext(null);
export const LabDrawerContext = createContext(null);
export const LabChatContext = createContext(null);

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
  const [voiceAnnouncementEnabled, setVoiceAnnouncementEnabledState] = useState(Boolean(initialConfig.audio.voiceAnnouncementEnabled));
  const [voiceFocusEnabled, setVoiceFocusEnabledState] = useState(Boolean(initialConfig.audio.voiceFocusEnabled));
  const [voiceHoverEnabled, setVoiceHoverEnabledState] = useState(Boolean(initialConfig.audio.voiceHoverEnabled));

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
  const [autoScrollOnRefresh, setAutoScrollOnRefreshState] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      const local = localStorage.getItem('portfolio_auto_scroll_on_refresh');
      const sess = sessionStorage.getItem('portfolio_auto_scroll_on_refresh');
      if (local !== null && local === 'false') return false;
      if (sess !== null && sess === 'false') return false;
      return initialConfig.visuals?.autoScrollOnRefresh !== false;
    } catch {
      return true;
    }
  });

  // Tab 6: 3D State
  const [threeD, setThreeDState] = useState(() => {
    const base = initialConfig.threeD
      ? normalizeThreeD(initialConfig.threeD)
      : JSON.parse(JSON.stringify(FACTORY_DEFAULTS.threeD));
    // Always start collapsed/hidden on initial mount / fresh session per user requirement
    base.showSandboxPreview = false;
    return base;
  });

  // Phase 1: State Isolation & Scoped CSS 3D Architecture
  // Controls whether 3D CSS variables and datasets bleed into live document root
  const [isLive3DApplied, setIsLive3DApplied] = useState(false);

  // Tab 7: AI & Chat Studio State
  const [chatSettings, setChatSettings] = useState(getInitialChatSettings);

  const updateChatSettings = useCallback((patch) => {
    setChatSettings((prev) => {
      const updated = sanitizeChatSettings(typeof patch === 'function' ? patch(prev) : { ...prev, ...patch });
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY_AI_CHAT, JSON.stringify(updated));
          window.dispatchEvent(
            new CustomEvent('ai-chat-settings-changed', {
              detail: { settings: updated, source: 'lab-context' }
            })
          );
        } catch (err) {
          console.error('[LabContext] Failed to persist chat settings:', err);
        }
      }
      return updated;
    });
  }, []);

  const resetChatSettings = useCallback(() => {
    updateChatSettings(DEFAULT_AI_CHAT_SETTINGS);
  }, [updateChatSettings]);

  // Runtime UI State
  const [activeTab, setActiveTab] = useState('audio');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isInitialMount = useRef(true);
  const isIncomingSyncRef = useRef(false);
  const lastSavedPayloadRef = useRef('');
  const saveTimeoutRef = useRef(null);
  const pendingSavePayloadRef = useRef(null);
  const threeDRef = useRef(threeD);
  threeDRef.current = threeD;

  // Phase 1: 0ms Cross-tab IPC instance identifier & BroadcastChannel ref
  const windowInstanceIdRef = useRef(
    typeof window !== 'undefined'
      ? `tab_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      : 'tab_server'
  );
  const broadcastChannelRef = useRef(null);
  const prevPersistedThreeDRef = useRef(JSON.stringify(threeD));

  const stateRef = useRef(null);
  stateRef.current = {
    soundEnabled,
    masterVolume,
    pitchMultiplier,
    soundMatchingMode,
    voiceAnnouncementEnabled,
    voiceFocusEnabled,
    voiceHoverEnabled,
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
    layoutDensity,
    autoScrollOnRefresh,
    threeD
  };

  // Inject Root CSS Custom Properties & data attributes for 3D state
  // Isolated by default: Only written to document.documentElement when isLive3DApplied is true
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    if (isLive3DApplied) {
      root.style.setProperty('--3d-depth-intensity', `${threeD.depthIntensity}`);
      root.style.setProperty('--3d-style-preset', threeD.stylePreset);
      root.style.setProperty('--3d-master-theme', threeD.masterTheme || 'apple-glass');
      root.style.setProperty('--3d-light-preset', threeD.lighting?.preset || 'studio-soft');
      root.style.setProperty('--3d-light-angle', `${threeD.lighting?.angle ?? 45}deg`);
      root.style.setProperty('--3d-shadow-softness', `${threeD.lighting?.shadowSoftness ?? 0.7}`);
      root.style.setProperty('--3d-cursor-light', threeD.lighting?.cursorLight ? '1' : '0');
      root.style.setProperty('--3d-camera-angle', threeD.camera?.anglePreset || 'isometric');
      root.style.setProperty('--3d-perspective', `${threeD.camera?.perspectiveFOV ?? 1000}px`);
      root.style.setProperty('--3d-tilt-sensitivity', `${threeD.camera?.tiltSensitivity ?? 15}deg`);
      root.style.setProperty('--3d-orbit-speed', `${threeD.camera?.orbitSpeed ?? 1.0}s`);
      root.style.setProperty('--3d-material-preset', threeD.materials?.preset || 'glass-acrylic');
      root.style.setProperty('--3d-specular-glow', `${threeD.materials?.specularGlow ?? 0.6}`);
      root.style.setProperty('--3d-bevel-extrusion', `${threeD.materials?.bevelExtrusion ?? 3}px`);
      root.style.setProperty('--3d-hover-pop', `${threeD.physics?.hoverPop ?? 12}px`);
      root.style.setProperty('--3d-elasticity', threeD.physics?.elasticity || 'snappy');

      // Exploded CAD, Atmosphere, Audio & Performance CSS custom properties
      const explodeZ = threeD.exploded?.enabled ? (threeD.exploded?.separationDistance ?? 45) : 0;
      root.style.setProperty('--3d-explode-z', `${explodeZ}px`);
      root.style.setProperty('--3d-blueprint-mode', threeD.exploded?.blueprintMode ? '1' : '0');
      root.style.setProperty('--3d-solo-strata', threeD.exploded?.soloStrata || 'none');
      root.style.setProperty('--3d-fog-density', `${(threeD.environment?.fogDensity ?? 30) / 100}`);
      root.style.setProperty('--3d-dof-blur', `${threeD.environment?.depthOfFieldBlur ?? 0}px`);
      root.style.setProperty('--3d-room-reverb', `${threeD.spatialAudio?.reverbIntensity ?? 0.5}`);
      root.style.setProperty('--3d-target-fps', `${threeD.performance?.fpsTarget ?? 60}`);
      root.style.setProperty('--3d-skybox', threeD.environment?.skybox || 'dark-studio');
      root.style.setProperty('--3d-gpu-accel', threeD.performance?.gpuAcceleration || 'standard');

      root.dataset.threedMaster = threeD.master3D ? 'true' : 'false';
      root.dataset.threedPreset = threeD.stylePreset;
      root.dataset.threedTheme = threeD.masterTheme || 'apple-glass';
      root.dataset.threedMaterial = threeD.materials?.preset || 'glass-acrylic';
      root.dataset.threedExploded = threeD.exploded?.enabled ? 'true' : 'false';
      root.dataset.threedBlueprint = threeD.exploded?.blueprintMode ? 'true' : 'false';
      root.dataset.threedSoloStrata = threeD.exploded?.soloStrata || 'none';
      root.classList.toggle('threed-enabled', Boolean(threeD.master3D));
    } else {
      // Neutral baseline / default 2D CSS custom properties
      root.style.setProperty('--3d-depth-intensity', '0');
      root.style.setProperty('--3d-style-preset', 'subtle');
      root.style.setProperty('--3d-master-theme', 'apple-glass');
      root.style.setProperty('--3d-light-preset', 'studio-soft');
      root.style.setProperty('--3d-light-angle', '45deg');
      root.style.setProperty('--3d-shadow-softness', '0.7');
      root.style.setProperty('--3d-cursor-light', '0');
      root.style.setProperty('--3d-camera-angle', 'isometric');
      root.style.setProperty('--3d-perspective', '1000px');
      root.style.setProperty('--3d-tilt-sensitivity', '0deg');
      root.style.setProperty('--3d-orbit-speed', '1s');
      root.style.setProperty('--3d-material-preset', 'glass-acrylic');
      root.style.setProperty('--3d-specular-glow', '0');
      root.style.setProperty('--3d-bevel-extrusion', '0px');
      root.style.setProperty('--3d-hover-pop', '0px');
      root.style.setProperty('--3d-elasticity', 'snappy');
      root.style.setProperty('--3d-explode-z', '0px');
      root.style.setProperty('--3d-blueprint-mode', '0');
      root.style.setProperty('--3d-solo-strata', 'none');
      root.style.setProperty('--3d-fog-density', '0');
      root.style.setProperty('--3d-dof-blur', '0px');
      root.style.setProperty('--3d-room-reverb', '0');
      root.style.setProperty('--3d-target-fps', '60');
      root.style.setProperty('--3d-skybox', 'dark-studio');
      root.style.setProperty('--3d-gpu-accel', 'standard');

      root.dataset.threedMaster = 'false';
      root.dataset.threedPreset = 'subtle';
      root.dataset.threedTheme = 'apple-glass';
      root.dataset.threedMaterial = 'glass-acrylic';
      root.dataset.threedExploded = 'false';
      root.dataset.threedBlueprint = 'false';
      root.dataset.threedSoloStrata = 'none';
      root.classList.remove('threed-enabled');
    }
  }, [threeD, isLive3DApplied]);

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
  }, [glassBlur, motionSpeed, accentColor, layoutDensity]);

  // Synchronize reduced-motion root class for accessibility
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('reduced-motion', Boolean(reducedMotion));
  }, [reducedMotion]);

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
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('portfolio:sound-toggle', {
            detail: { enabled: soundEnabled, masterVolume }
          })
        );
        if (!soundEnabled && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      }
    } catch {
      // Handled silently
    }
  }, [soundEnabled, masterVolume, pitchMultiplier, soundMatchingMode]);

  // Flush pending localStorage debounced writes immediately
  const flushPendingSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    if (pendingSavePayloadRef.current) {
      const { payload, legacyPayload, particleColorVal, pitchMultiplierVal } = pendingSavePayloadRef.current;
      pendingSavePayloadRef.current = null;
      try {
        localStorage.setItem(CONTROL_CENTER_STORAGE_KEY, JSON.stringify(payload));
        localStorage.setItem(LAB_STORAGE_KEY, JSON.stringify(legacyPayload));
        localStorage.setItem('physics_particle_color', particleColorVal);
        localStorage.setItem('physics_audio_pitch', pitchMultiplierVal.toString());
      } catch {
        // Storage quota or sandboxed environment
      }
    }
  }, []);

  // Immediate storage flush on window beforeunload and document visibilitychange (when hidden)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeUnload = () => {
      flushPendingSave();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushPendingSave();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      flushPendingSave();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [flushPendingSave]);

  // Persist unified state to localStorage under CONTROL_CENTER_STORAGE_KEY & LAB_STORAGE_KEY (400ms debounce)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const corePayload = {
      version: 2,
      audio: {
        soundEnabled,
        masterVolume,
        pitchMultiplier,
        soundMatchingMode,
        voiceAnnouncementEnabled,
        voiceFocusEnabled,
        voiceHoverEnabled
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
        autoScrollOnRefresh,
        layoutDensity
      },
      threeD
    };

    const currentPayloadString = JSON.stringify(corePayload);

    if (isIncomingSyncRef.current) {
      isIncomingSyncRef.current = false;
      lastSavedPayloadRef.current = currentPayloadString;
      return;
    }

    if (currentPayloadString === lastSavedPayloadRef.current) {
      return;
    }
    lastSavedPayloadRef.current = currentPayloadString;

    const payload = {
      ...corePayload,
      updatedAt: new Date().toISOString()
    };

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

    pendingSavePayloadRef.current = {
      payload,
      legacyPayload,
      particleColorVal: particleColor,
      pitchMultiplierVal: pitchMultiplier
    };

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      flushPendingSave();
    }, 400);

    // Phase 1: 0ms Dual Real-Time Broadcast & Instant Flush on any 3D mutation
    const currentThreeDStr = JSON.stringify(threeD);
    const threeDChanged = currentThreeDStr !== prevPersistedThreeDRef.current;
    prevPersistedThreeDRef.current = currentThreeDStr;

    if (threeDChanged && !isInitialMount.current) {
      if (typeof window !== 'undefined') {
        if (broadcastChannelRef.current) {
          try {
            broadcastChannelRef.current.postMessage({
              type: 'SYNC_3D_STATE',
              payload: threeD,
              sender: windowInstanceIdRef.current,
              timestamp: Date.now()
            });
          } catch {
            // BroadcastChannel failed or unsupported
          }
        }
        try {
          localStorage.setItem(
            PORTFOLIO_3D_INSTANT_SYNC_KEY,
            JSON.stringify({ threeD, sender: windowInstanceIdRef.current, timestamp: Date.now() })
          );
        } catch {
          // Storage quota
        }
        try {
          window.dispatchEvent(new CustomEvent('portfolio:3d-change', { detail: threeD }));
        } catch {
          // Ignore
        }
      }
      // Instant flush bypassing 400ms debounce for 3D settings
      flushPendingSave();
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
    voiceAnnouncementEnabled,
    voiceFocusEnabled,
    voiceHoverEnabled,
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
    layoutDensity,
    autoScrollOnRefresh,
    threeD,
    flushPendingSave
  ]);

  // --- Audio Setters ---
  const setSoundEnabled = useCallback((val) => {
    const enabled = Boolean(val);
    setSoundEnabledState(enabled);
    if (soundFX && typeof soundFX.setEnabled === 'function') {
      soundFX.setEnabled(enabled);
    }
    if (typeof window !== 'undefined') {
      try {
        const curVol = soundFX?.getMasterVolume ? soundFX.getMasterVolume() : masterVolume;
        window.dispatchEvent(
          new CustomEvent('portfolio:sound-toggle', {
            detail: { enabled, masterVolume: curVol }
          })
        );
        if (!enabled && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } catch {
        // Handled silently
      }
    }
  }, [masterVolume]);

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

  const setVoiceAnnouncementEnabled = useCallback((val) => {
    const enabled = Boolean(val);
    setVoiceAnnouncementEnabledState(enabled);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('portfolio:set-voice-announcement', { detail: { enabled } })
      );
    }
  }, []);

  const setVoiceFocusEnabled = useCallback((val) => {
    const enabled = Boolean(val);
    setVoiceFocusEnabledState(enabled);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('portfolio:set-voice-focus', { detail: { enabled } })
      );
    }
  }, []);

  const setVoiceHoverEnabled = useCallback((val) => {
    const enabled = Boolean(val);
    setVoiceHoverEnabledState(enabled);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('portfolio:set-voice-hover', { detail: { enabled } })
      );
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

  const setAutoScrollOnRefresh = useCallback((val) => {
    setAutoScrollOnRefreshState((prev) => {
      const nextVal = typeof val === 'function' ? val(prev) : Boolean(val);
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('portfolio_auto_scroll_on_refresh', String(nextVal));
          sessionStorage.setItem('portfolio_auto_scroll_on_refresh', String(nextVal));
          window.dispatchEvent(new CustomEvent('portfolio:auto-scroll-toggle', { detail: { enabled: nextVal } }));
        }
      } catch {}
      return nextVal;
    });
  }, []);

  // --- 3D Tab Setters ---
  const setMaster3D = useCallback((enabled) => {
    const isEn = Boolean(enabled);
    setThreeDState((prev) => {
      const updatedElements = {};
      for (const key of Object.keys(prev.elements)) {
        updatedElements[key] = isEn;
      }
      return {
        ...prev,
        master3D: isEn,
        elements: updatedElements
      };
    });
  }, []);

  const toggle3DElement = useCallback((elementKey) => {
    setThreeDState((prev) => {
      if (!prev.elements || !(elementKey in prev.elements)) return prev;
      const nextVal = !prev.elements[elementKey];
      const updatedElements = {
        ...prev.elements,
        [elementKey]: nextVal
      };
      const anyActive = Object.values(updatedElements).some(Boolean);
      return {
        ...prev,
        master3D: anyActive,
        elements: updatedElements
      };
    });
  }, []);

  const set3DElementGroup = useCallback((elementKeys, targetState) => {
    setThreeDState((prev) => {
      if (!prev.elements) return prev;
      const updatedElements = { ...prev.elements };
      elementKeys.forEach((key) => {
        if (key in updatedElements) {
          updatedElements[key] = Boolean(targetState);
        }
      });
      const anyActive = Object.values(updatedElements).some(Boolean);
      return {
        ...prev,
        master3D: anyActive,
        elements: updatedElements
      };
    });
  }, []);

  const enableAll3D = useCallback(() => {
    setThreeDState((prev) => {
      const updatedElements = {};
      for (const key of Object.keys(prev.elements)) {
        updatedElements[key] = true;
      }
      return {
        ...prev,
        master3D: true,
        elements: updatedElements
      };
    });
  }, []);

  const disableAll3D = useCallback(() => {
    setThreeDState((prev) => {
      const updatedElements = {};
      for (const key of Object.keys(prev.elements)) {
        updatedElements[key] = false;
      }
      return {
        ...prev,
        master3D: false,
        elements: updatedElements
      };
    });
  }, []);

  const reset3DDefaults = useCallback(() => {
    setThreeDState(JSON.parse(JSON.stringify(FACTORY_DEFAULTS.threeD)));
  }, []);

  const set3DDepthIntensity = useCallback((val) => {
    setThreeDState((prev) => ({
      ...prev,
      depthIntensity: clampDepthIntensity(val)
    }));
  }, []);

  const set3DStylePreset = useCallback((preset) => {
    setThreeDState((prev) => ({
      ...prev,
      stylePreset: normalizeStylePreset(preset)
    }));
  }, []);

  const set3DTheme = useCallback((themeKey) => {
    const validTheme = normalize3DMasterTheme(themeKey);
    setThreeDState((prev) => {
      let matchingMaterials = { ...prev.materials };
      let matchingLighting = { ...prev.lighting };
      let matchingCamera = { ...prev.camera };
      let matchingStylePreset = prev.stylePreset;

      if (validTheme === 'apple-glass') {
        matchingMaterials = { ...prev.materials, preset: 'glass-acrylic', specularGlow: 0.8, bevelExtrusion: 3 };
        matchingLighting = { ...prev.lighting, preset: 'studio-soft', shadowSoftness: 0.8 };
        matchingCamera = { ...prev.camera, anglePreset: 'isometric' };
        matchingStylePreset = 'subtle';
      } else if (validTheme === 'cyber-neon') {
        matchingMaterials = { ...prev.materials, preset: 'cyber-wireframe', specularGlow: 1.0, bevelExtrusion: 4 };
        matchingLighting = { ...prev.lighting, preset: 'cyber-neon', shadowSoftness: 0.5 };
        matchingCamera = { ...prev.camera, anglePreset: 'cinematic' };
        matchingStylePreset = 'isometric';
      } else if (validTheme === 'studio-matte') {
        matchingMaterials = { ...prev.materials, preset: 'neumorphic-clay', specularGlow: 0.2, bevelExtrusion: 5 };
        matchingLighting = { ...prev.lighting, preset: 'studio-soft', shadowSoftness: 0.9 };
        matchingCamera = { ...prev.camera, anglePreset: 'top-down' };
        matchingStylePreset = 'subtle';
      } else if (validTheme === 'floating-hologram') {
        matchingMaterials = { ...prev.materials, preset: 'glass-acrylic', specularGlow: 0.9, bevelExtrusion: 2 };
        matchingLighting = { ...prev.lighting, preset: 'sunset', shadowSoftness: 0.6 };
        matchingCamera = { ...prev.camera, anglePreset: 'eye-level' };
        matchingStylePreset = 'deep';
      } else if (validTheme === 'obsidian-gold') {
        matchingMaterials = { ...prev.materials, preset: 'metallic-gloss', specularGlow: 0.95, bevelExtrusion: 5 };
        matchingLighting = { ...prev.lighting, preset: 'sunset', shadowSoftness: 0.4 };
        matchingCamera = { ...prev.camera, anglePreset: 'cinematic' };
        matchingStylePreset = 'deep';
      } else if (validTheme === 'retro-synthwave') {
        matchingMaterials = { ...prev.materials, preset: 'cyber-wireframe', specularGlow: 1.0, bevelExtrusion: 4 };
        matchingLighting = { ...prev.lighting, preset: 'cyber-neon', shadowSoftness: 0.45 };
        matchingCamera = { ...prev.camera, anglePreset: 'cinematic' };
        matchingStylePreset = 'isometric';
      } else if (validTheme === 'tokyo-midnight') {
        matchingMaterials = { ...prev.materials, preset: 'metallic-gloss', specularGlow: 0.85, bevelExtrusion: 4 };
        matchingLighting = { ...prev.lighting, preset: 'cyber-neon', shadowSoftness: 0.6 };
        matchingCamera = { ...prev.camera, anglePreset: 'eye-level' };
        matchingStylePreset = 'subtle';
      } else if (validTheme === 'emerald-matrix') {
        matchingMaterials = { ...prev.materials, preset: 'cyber-wireframe', specularGlow: 0.9, bevelExtrusion: 3 };
        matchingLighting = { ...prev.lighting, preset: 'cyber-neon', shadowSoftness: 0.5 };
        matchingCamera = { ...prev.camera, anglePreset: 'isometric' };
        matchingStylePreset = 'subtle';
      } else if (validTheme === 'sunset-bloom') {
        matchingMaterials = { ...prev.materials, preset: 'glass-acrylic', specularGlow: 0.75, bevelExtrusion: 4 };
        matchingLighting = { ...prev.lighting, preset: 'sunset', shadowSoftness: 0.8 };
        matchingCamera = { ...prev.camera, anglePreset: 'eye-level' };
        matchingStylePreset = 'subtle';
      } else if (validTheme === 'nordic-frost') {
        matchingMaterials = { ...prev.materials, preset: 'glass-acrylic', specularGlow: 0.9, bevelExtrusion: 3 };
        matchingLighting = { ...prev.lighting, preset: 'studio-soft', shadowSoftness: 0.7 };
        matchingCamera = { ...prev.camera, anglePreset: 'isometric' };
        matchingStylePreset = 'subtle';
      } else if (validTheme === 'crimson-stealth') {
        matchingMaterials = { ...prev.materials, preset: 'metallic-gloss', specularGlow: 0.95, bevelExtrusion: 6 };
        matchingLighting = { ...prev.lighting, preset: 'cyber-neon', shadowSoftness: 0.35 };
        matchingCamera = { ...prev.camera, anglePreset: 'cinematic' };
        matchingStylePreset = 'deep';
      } else if (validTheme === 'champagne-quartz') {
        matchingMaterials = { ...prev.materials, preset: 'glass-acrylic', specularGlow: 0.85, bevelExtrusion: 4 };
        matchingLighting = { ...prev.lighting, preset: 'sunset', shadowSoftness: 0.85 };
        matchingCamera = { ...prev.camera, anglePreset: 'isometric' };
        matchingStylePreset = 'subtle';
      } else if (validTheme === 'cosmic-void') {
        matchingMaterials = { ...prev.materials, preset: 'cyber-wireframe', specularGlow: 0.9, bevelExtrusion: 3 };
        matchingLighting = { ...prev.lighting, preset: 'cyber-neon', shadowSoftness: 0.4 };
        matchingCamera = { ...prev.camera, anglePreset: 'eye-level' };
        matchingStylePreset = 'deep';
      } else if (validTheme === 'solar-flare') {
        matchingMaterials = { ...prev.materials, preset: 'metallic-gloss', specularGlow: 1.0, bevelExtrusion: 5 };
        matchingLighting = { ...prev.lighting, preset: 'sunset', shadowSoftness: 0.5 };
        matchingCamera = { ...prev.camera, anglePreset: 'cinematic' };
        matchingStylePreset = 'deep';
      } else if (validTheme === 'vaporwave-dream') {
        matchingMaterials = { ...prev.materials, preset: 'glass-acrylic', specularGlow: 0.8, bevelExtrusion: 3 };
        matchingLighting = { ...prev.lighting, preset: 'sunset', shadowSoftness: 0.75 };
        matchingCamera = { ...prev.camera, anglePreset: 'isometric' };
        matchingStylePreset = 'subtle';
      } else if (validTheme === 'liquid-titanium') {
        matchingMaterials = { ...prev.materials, preset: 'metallic-gloss', specularGlow: 1.0, bevelExtrusion: 5 };
        matchingLighting = { ...prev.lighting, preset: 'studio-soft', shadowSoftness: 0.6 };
        matchingCamera = { ...prev.camera, anglePreset: 'cinematic' };
        matchingStylePreset = 'isometric';
      }

      return {
        ...prev,
        masterTheme: validTheme,
        stylePreset: matchingStylePreset,
        materials: matchingMaterials,
        lighting: matchingLighting,
        camera: matchingCamera
      };
    });
  }, []);

  const setShow3DSandbox = useCallback((show) => {
    setThreeDState((prev) => ({
      ...prev,
      showSandboxPreview: typeof show === 'function' ? show(prev.showSandboxPreview) : Boolean(show)
    }));
  }, []);

  // Master 3D Tab UI Mode Toggle (Pure 3D Zero-Text vs Classic 2D Text)
  const setTabUI3DMode = useCallback((isVisual) => {
    setThreeDState((prev) => {
      const val = typeof isVisual === 'function' ? Boolean(isVisual(prev.tabUI3DMode ?? prev.isVisualOnly ?? true)) : Boolean(isVisual);
      return {
        ...prev,
        tabUI3DMode: val,
        isVisualOnly: val
      };
    });
  }, []);

  const toggleTabUI3DMode = useCallback(() => {
    setThreeDState((prev) => {
      const current = prev.tabUI3DMode ?? prev.isVisualOnly ?? true;
      return {
        ...prev,
        tabUI3DMode: !current,
        isVisualOnly: !current
      };
    });
  }, []);

  const set3DVisualMode = setTabUI3DMode;
  const toggle3DVisualMode = toggleTabUI3DMode;

  const set3DLighting = useCallback((patch) => {
    setThreeDState((prev) => ({
      ...prev,
      lighting: normalize3DLighting(typeof patch === 'function' ? patch(prev.lighting) : { ...prev.lighting, ...patch })
    }));
  }, []);

  const set3DLightingPreset = useCallback((preset) => {
    set3DLighting({ preset });
  }, [set3DLighting]);

  const set3DLightingAngle = useCallback((angle) => {
    set3DLighting({ angle });
  }, [set3DLighting]);

  const set3DCursorLight = useCallback((cursorLight) => {
    set3DLighting({ cursorLight: Boolean(cursorLight) });
  }, [set3DLighting]);

  const set3DShadowSoftness = useCallback((shadowSoftness) => {
    set3DLighting({ shadowSoftness });
  }, [set3DLighting]);

  const set3DCamera = useCallback((patch) => {
    setThreeDState((prev) => ({
      ...prev,
      camera: normalize3DCamera(typeof patch === 'function' ? patch(prev.camera) : { ...prev.camera, ...patch })
    }));
  }, []);

  const set3DCameraAnglePreset = useCallback((anglePreset) => {
    set3DCamera({ anglePreset });
  }, [set3DCamera]);

  const set3DPerspectiveFOV = useCallback((perspectiveFOV) => {
    set3DCamera({ perspectiveFOV });
  }, [set3DCamera]);

  const set3DTiltSensitivity = useCallback((tiltSensitivity) => {
    set3DCamera({ tiltSensitivity });
  }, [set3DCamera]);

  const set3DAutoOrbit = useCallback((autoOrbit) => {
    set3DCamera({ autoOrbit: Boolean(autoOrbit) });
  }, [set3DCamera]);

  const set3DOrbitSpeed = useCallback((orbitSpeed) => {
    set3DCamera({ orbitSpeed });
  }, [set3DCamera]);

  const set3DMaterials = useCallback((patch) => {
    setThreeDState((prev) => ({
      ...prev,
      materials: normalize3DMaterials(typeof patch === 'function' ? patch(prev.materials) : { ...prev.materials, ...patch })
    }));
  }, []);

  const set3DMaterialPreset = useCallback((preset) => {
    set3DMaterials({ preset });
  }, [set3DMaterials]);

  const set3DSpecularGlow = useCallback((specularGlow) => {
    set3DMaterials({ specularGlow });
  }, [set3DMaterials]);

  const set3DBevelExtrusion = useCallback((bevelExtrusion) => {
    set3DMaterials({ bevelExtrusion });
  }, [set3DMaterials]);

  const set3DPhysics = useCallback((patch) => {
    setThreeDState((prev) => ({
      ...prev,
      physics: normalize3DPhysics(typeof patch === 'function' ? patch(prev.physics) : { ...prev.physics, ...patch })
    }));
  }, []);

  const set3DPhysicsHoverPop = useCallback((hoverPop) => {
    set3DPhysics({ hoverPop });
  }, [set3DPhysics]);

  const set3DClickDepression = useCallback((clickDepression) => {
    set3DPhysics({ clickDepression: Boolean(clickDepression) });
  }, [set3DPhysics]);

  const set3DElasticity = useCallback((elasticity) => {
    set3DPhysics({ elasticity });
  }, [set3DPhysics]);

  const set3DMagneticPull = useCallback((magneticPull) => {
    set3DPhysics({ magneticPull: Boolean(magneticPull) });
  }, [set3DPhysics]);

  const set3DClusterFilter = useCallback((clusterFilter) => {
    setThreeDState((prev) => ({
      ...prev,
      clusterFilter: normalize3DClusterFilter(clusterFilter)
    }));
  }, []);

  const set3DExploded = useCallback((patch) => {
    setThreeDState((prev) => ({
      ...prev,
      exploded: normalize3DExploded(
        typeof patch === 'function' ? patch(prev.exploded) : { ...prev.exploded, ...patch }
      )
    }));
  }, []);

  const set3DEnvironment = useCallback((patch) => {
    setThreeDState((prev) => ({
      ...prev,
      environment: normalize3DEnvironment(
        typeof patch === 'function' ? patch(prev.environment) : { ...prev.environment, ...patch }
      )
    }));
  }, []);

  const set3DSpatialAudio = useCallback((patch) => {
    setThreeDState((prev) => ({
      ...prev,
      spatialAudio: normalize3DSpatialAudio(
        typeof patch === 'function' ? patch(prev.spatialAudio) : { ...prev.spatialAudio, ...patch }
      )
    }));
  }, []);

  const set3DPerformance = useCallback((patch) => {
    setThreeDState((prev) => ({
      ...prev,
      performance: normalize3DPerformance(
        typeof patch === 'function' ? patch(prev.performance) : { ...prev.performance, ...patch }
      )
    }));
  }, []);

  const import3DConfig = useCallback((jsonConfig) => {
    try {
      const parsed = typeof jsonConfig === 'string' ? JSON.parse(jsonConfig) : jsonConfig;
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'Invalid 3D configuration data.' };
      }
      const target = parsed.threeD ? parsed.threeD : parsed;
      const normalized = normalizeThreeD(target);
      setThreeDState(normalized);
      return { success: true, message: '3D configuration imported successfully!' };
    } catch (err) {
      return { success: false, message: err.message || 'Failed to parse JSON.' };
    }
  }, []);

  const export3DConfig = useCallback(() => {
    return JSON.stringify(threeD, null, 2);
  }, [threeD]);

  const copy3DCSSVariables = useCallback(() => {
    const explodeZ = threeD.exploded?.enabled ? (threeD.exploded?.separationDistance ?? 45) : 0;
    const vars = [
      `--3d-master: ${threeD.master3D ? '1' : '0'};`,
      `--3d-depth-intensity: ${threeD.depthIntensity};`,
      `--3d-style-preset: ${threeD.stylePreset};`,
      `--3d-master-theme: ${threeD.masterTheme || 'apple-glass'};`,
      `--3d-light-preset: ${threeD.lighting?.preset || 'studio-soft'};`,
      `--3d-light-angle: ${threeD.lighting?.angle ?? 45}deg;`,
      `--3d-shadow-softness: ${threeD.lighting?.shadowSoftness ?? 0.7};`,
      `--3d-cursor-light: ${threeD.lighting?.cursorLight ? '1' : '0'};`,
      `--3d-camera-angle: ${threeD.camera?.anglePreset || 'isometric'};`,
      `--3d-perspective: ${threeD.camera?.perspectiveFOV ?? 1000}px;`,
      `--3d-tilt-sensitivity: ${threeD.camera?.tiltSensitivity ?? 15}deg;`,
      `--3d-orbit-speed: ${threeD.camera?.orbitSpeed ?? 1.0}s;`,
      `--3d-material-preset: ${threeD.materials?.preset || 'glass-acrylic'};`,
      `--3d-specular-glow: ${threeD.materials?.specularGlow ?? 0.6};`,
      `--3d-bevel-extrusion: ${threeD.materials?.bevelExtrusion ?? 3}px;`,
      `--3d-hover-pop: ${threeD.physics?.hoverPop ?? 12}px;`,
      `--3d-elasticity: ${threeD.physics?.elasticity || 'snappy'};`,
      `--3d-explode-z: ${explodeZ}px;`,
      `--3d-blueprint-mode: ${threeD.exploded?.blueprintMode ? '1' : '0'};`,
      `--3d-solo-strata: ${threeD.exploded?.soloStrata || 'none'};`,
      `--3d-fog-density: ${(threeD.environment?.fogDensity ?? 30) / 100};`,
      `--3d-dof-blur: ${threeD.environment?.depthOfFieldBlur ?? 0}px;`,
      `--3d-room-reverb: ${threeD.spatialAudio?.reverbIntensity ?? 0.5};`,
      `--3d-target-fps: ${threeD.performance?.fpsTarget ?? 60};`,
      `--3d-skybox: ${threeD.environment?.skybox || 'dark-studio'};`,
      `--3d-gpu-accel: ${threeD.performance?.gpuAcceleration || 'standard'};`
    ];
    return vars.join('\n');
  }, [threeD]);

  // Phase 1: State Isolation & Live Portfolio Controls
  const applyToLivePortfolio = useCallback(() => {
    setIsLive3DApplied(true);
  }, []);

  const revertLivePortfolio = useCallback(() => {
    setIsLive3DApplied(false);
  }, []);

  const getScopedSandboxStyles = useCallback((overrides = {}) => {
    return computeScopedSandboxStyles(threeD, overrides);
  }, [threeD]);

  // --- 1-Click Factory Reset ---
  const resetDefaults = useCallback(() => {
    const f = FACTORY_DEFAULTS;

    // Audio
    setSoundEnabledState(f.audio.soundEnabled);
    setMasterVolumeState(f.audio.masterVolume);
    setPitchMultiplierState(f.audio.pitchMultiplier);
    setSoundMatchingModeState(f.audio.soundMatchingMode);
    setVoiceAnnouncementEnabledState(f.audio.voiceAnnouncementEnabled);
    setVoiceFocusEnabledState(f.audio.voiceFocusEnabled);
    setVoiceHoverEnabledState(f.audio.voiceHoverEnabled);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('portfolio:set-voice-announcement', { detail: { enabled: f.audio.voiceAnnouncementEnabled } })
      );
      window.dispatchEvent(
        new CustomEvent('portfolio:set-voice-focus', { detail: { enabled: f.audio.voiceFocusEnabled } })
      );
      window.dispatchEvent(
        new CustomEvent('portfolio:set-voice-hover', { detail: { enabled: f.audio.voiceHoverEnabled } })
      );
    }

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
    setAutoScrollOnRefreshState(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('portfolio_auto_scroll_on_refresh', 'true');
        sessionStorage.setItem('portfolio_auto_scroll_on_refresh', 'true');
      }
    } catch {}
    setAutoScrollOnRefreshState(f.visuals.autoScrollOnRefresh ?? true);
    try {
      localStorage.setItem('portfolio_auto_scroll_on_refresh', 'true');
      sessionStorage.setItem('portfolio_auto_scroll_on_refresh', 'true');
    } catch {}

    // 3D
    setThreeDState(JSON.parse(JSON.stringify(f.threeD)));

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

    // Cancel any pending debounced saves
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    pendingSavePayloadRef.current = null;

    try {
      localStorage.setItem(CONTROL_CENTER_STORAGE_KEY, JSON.stringify(f));
      window.dispatchEvent(new CustomEvent('portfolio:control-center-reset', { detail: f }));
    } catch {
      // Ignore
    }

    // Reset AI & Chat Studio Settings (Tab 7)
    resetChatSettings();
  }, [recenterCharacter, resetChatSettings]);

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
            isIncomingSyncRef.current = true;
            const current = stateRef.current || {};
            if (inc.audio) {
              if (inc.audio.soundEnabled !== undefined) {
                const nextVal = Boolean(inc.audio.soundEnabled);
                if (current.soundEnabled !== nextVal) setSoundEnabledState(nextVal);
              }
              if (inc.audio.masterVolume !== undefined) {
                const nextVal = clampVolume(inc.audio.masterVolume);
                if (current.masterVolume !== nextVal) setMasterVolumeState(nextVal);
              }
              if (inc.audio.pitchMultiplier !== undefined) {
                const nextVal = clampPitch(inc.audio.pitchMultiplier);
                if (current.pitchMultiplier !== nextVal) setPitchMultiplierState(nextVal);
              }
              if (inc.audio.soundMatchingMode !== undefined) {
                const nextVal = inc.audio.soundMatchingMode;
                if (current.soundMatchingMode !== nextVal) setSoundMatchingModeState(nextVal);
              }
              if (inc.audio.voiceAnnouncementEnabled !== undefined) {
                const nextVal = Boolean(inc.audio.voiceAnnouncementEnabled);
                if (current.voiceAnnouncementEnabled !== nextVal) setVoiceAnnouncementEnabledState(nextVal);
              }
              if (inc.audio.voiceFocusEnabled !== undefined) {
                const nextVal = Boolean(inc.audio.voiceFocusEnabled);
                if (current.voiceFocusEnabled !== nextVal) setVoiceFocusEnabledState(nextVal);
              }
              if (inc.audio.voiceHoverEnabled !== undefined) {
                const nextVal = Boolean(inc.audio.voiceHoverEnabled);
                if (current.voiceHoverEnabled !== nextVal) setVoiceHoverEnabledState(nextVal);
              }
            }
            if (inc.cursor) {
              if (inc.cursor.customCursorEnabled !== undefined) {
                const nextVal = Boolean(inc.cursor.customCursorEnabled);
                if (current.customCursorEnabled !== nextVal) setCustomCursorEnabledState(nextVal);
              }
              if (inc.cursor.cursorScale !== undefined) {
                const nextVal = clampScale(inc.cursor.cursorScale);
                if (current.cursorScale !== nextVal) setCursorScaleState(nextVal);
              }
              if (inc.cursor.flightLerpSpeed !== undefined) {
                const nextVal = normalizeFlightSpeedKey(inc.cursor.flightLerpSpeed);
                if (current.flightLerpSpeed !== nextVal) setFlightLerpSpeedState(nextVal);
              }
              if (inc.cursor.stardustTrailEnabled !== undefined) {
                const nextVal = Boolean(inc.cursor.stardustTrailEnabled);
                if (current.stardustTrailEnabled !== nextVal) setStardustTrailEnabledState(nextVal);
              }
              if (inc.cursor.particleColor !== undefined) {
                const nextVal = validateColor(inc.cursor.particleColor);
                if (current.particleColor !== nextVal) setParticleColorState(nextVal);
              }
            }
            if (inc.hero) {
              if (inc.hero.gazeMode !== undefined) {
                const nextVal = inc.hero.gazeMode;
                if (current.gazeMode !== nextVal) setGazeModeState(nextVal);
              }
              if (inc.hero.poseOverride !== undefined) {
                const nextVal = normalizePoseOverride(inc.hero.poseOverride);
                if (current.poseOverride !== nextVal) setPoseOverrideState(nextVal);
              }
              if (inc.hero.characterZoom !== undefined) {
                const nextVal = clampScale(inc.hero.characterZoom);
                if (current.characterZoom !== nextVal) setCharacterZoomState(nextVal);
              }
              if (inc.hero.zoomFocus !== undefined) {
                const nextVal = normalizeZoomFocus(inc.hero.zoomFocus);
                if (current.zoomFocus !== nextVal) setZoomFocusState(nextVal);
              }
              if (inc.hero.flashConfettiEnabled !== undefined) {
                const nextVal = Boolean(inc.hero.flashConfettiEnabled);
                if (current.flashConfettiEnabled !== nextVal) setFlashConfettiEnabledState(nextVal);
              }
              if (inc.hero.dragEnabled !== undefined) {
                const nextVal = Boolean(inc.hero.dragEnabled);
                if (current.dragEnabled !== nextVal) setDragEnabledState(nextVal);
              }
              if (inc.hero.dragBoundaryConstrained !== undefined) {
                const nextVal = Boolean(inc.hero.dragBoundaryConstrained);
                if (current.dragBoundaryConstrained !== nextVal) setDragBoundaryConstrainedState(nextVal);
              }
              if (inc.hero.dragAutoSnapBack !== undefined) {
                const nextVal = Boolean(inc.hero.dragAutoSnapBack);
                if (current.dragAutoSnapBack !== nextVal) setDragAutoSnapBackState(nextVal);
              }
              if (inc.hero.parallaxTiltEnabled !== undefined) {
                const nextVal = Boolean(inc.hero.parallaxTiltEnabled);
                if (current.parallaxTiltEnabled !== nextVal) setParallaxTiltEnabledState(nextVal);
              }
            }
            if (inc.preferences) {
              if (inc.preferences.defaultStartupRole !== undefined) {
                const nextVal = inc.preferences.defaultStartupRole;
                if (current.defaultStartupRole !== nextVal) setDefaultStartupRoleState(nextVal);
              }
              if (inc.preferences.defaultCursorEnabled !== undefined) {
                const nextVal = Boolean(inc.preferences.defaultCursorEnabled);
                if (current.defaultCursorEnabled !== nextVal) setDefaultCursorEnabledState(nextVal);
              }
              if (inc.preferences.defaultAudioEnabled !== undefined) {
                const nextVal = Boolean(inc.preferences.defaultAudioEnabled);
                if (current.defaultAudioEnabled !== nextVal) setDefaultAudioEnabledState(nextVal);
              }
              if (inc.preferences.reducedMotion !== undefined) {
                const nextVal = Boolean(inc.preferences.reducedMotion);
                if (current.reducedMotion !== nextVal) setReducedMotionState(nextVal);
              }
            }
            if (inc.visuals) {
              if (inc.visuals.glassBlur !== undefined) {
                const nextVal = normalizeGlassBlur(inc.visuals.glassBlur);
                if (current.glassBlur !== nextVal) setGlassBlurState(nextVal);
              }
              if (inc.visuals.motionSpeed !== undefined) {
                const nextVal = normalizeMotionSpeed(inc.visuals.motionSpeed);
                if (current.motionSpeed !== nextVal) setMotionSpeedState(nextVal);
              }
              if (inc.visuals.accentColor !== undefined) {
                const c = validateColor(inc.visuals.accentColor);
                if (current.accentColor !== c) setAccentColorState(c);
                if (current.particleColor !== c) setParticleColorState(c);
              }
              if (inc.visuals.layoutDensity !== undefined) {
                const next = normalizeLayoutDensity(inc.visuals.layoutDensity);
                if (current.layoutDensity !== next) setLayoutDensityState(next);
              }
              if (inc.visuals.autoScrollOnRefresh !== undefined) {
                const nextVal = Boolean(inc.visuals.autoScrollOnRefresh);
                if (current.autoScrollOnRefresh !== nextVal) setAutoScrollOnRefreshState(nextVal);
              }
            } else if (inc.layoutDensity !== undefined) {
              const next = normalizeLayoutDensity(inc.layoutDensity);
              if (current.layoutDensity !== next) setLayoutDensityState(next);
            }
            if (inc.threeD) {
              const normalizedThreeD = normalizeThreeD(inc.threeD);
              if (JSON.stringify(normalizedThreeD) !== JSON.stringify(threeDRef.current)) {
                setThreeDState(normalizedThreeD);
              }
            }
          }
        } catch {
          // Ignore parse errors from other tabs
        }
      }
      if (e.key === PORTFOLIO_3D_INSTANT_SYNC_KEY && e.newValue) {
        try {
          const inc = JSON.parse(e.newValue);
          if (inc && inc.sender !== windowInstanceIdRef.current && inc.threeD) {
            const normalizedThreeD = normalizeThreeD(inc.threeD);
            if (JSON.stringify(normalizedThreeD) !== JSON.stringify(threeDRef.current)) {
              isIncomingSyncRef.current = true;
              setThreeDState(normalizedThreeD);
            }
          }
        } catch {
          // Ignore
        }
      }
      if (e.key === 'portfolio_auto_scroll_on_refresh' && e.newValue !== null) {
        setAutoScrollOnRefreshState(e.newValue !== 'false');
      }
      if (e.key === STORAGE_KEY_AI_CHAT) {
        try {
          const newSettings = e.newValue ? JSON.parse(e.newValue) : DEFAULT_AI_CHAT_SETTINGS;
          setChatSettings(sanitizeChatSettings({ ...DEFAULT_AI_CHAT_SETTINGS, ...newSettings }));
        } catch {
          // Graceful fallback
        }
      }
    };

    window.addEventListener('storage', handleStorage);

    // Phase 1: Establish 0ms BroadcastChannel IPC for peer-to-peer 3D state sync
    let bc = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel(PORTFOLIO_3D_CHANNEL_NAME);
        broadcastChannelRef.current = bc;
        bc.onmessage = (event) => {
          if (!event?.data || event.data.sender === windowInstanceIdRef.current) return;
          if (event.data.type === 'SYNC_3D_STATE' && event.data.payload) {
            const incoming = normalizeThreeD(event.data.payload);
            if (JSON.stringify(incoming) !== JSON.stringify(threeDRef.current)) {
              isIncomingSyncRef.current = true;
              setThreeDState(incoming);
            }
          }
        };
      } catch {
        // Fallback to storage event
      }
    }

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

      if (bc) {
        try {
          bc.close();
        } catch {
          // Ignore
        }
        broadcastChannelRef.current = null;
      }
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
    voiceAnnouncementEnabled,
    voiceFocusEnabled,
    voiceHoverEnabled,
    setSoundEnabled,
    setMasterVolume,
    setPitchMultiplier,
    setSoundMatchingMode,
    setVoiceAnnouncementEnabled,
    setVoiceFocusEnabled,
    setVoiceHoverEnabled,

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
    setStardustTrail: setStardustTrailEnabled,
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
    setFlashConfetti: setFlashConfettiEnabled,
    setFlashConfettiEnabled,
    setDragEnabled,
    setDragBoundaryConstrained,
    setDragAutoSnapBack,
    setParallaxTilt: setParallaxTiltEnabled,
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
    autoScrollOnRefresh,
    setGlassBlur,
    setMotionSpeed,
    setAccentColor,
    setLayoutDensity,
    setAutoScrollOnRefresh,

    // Tab 6: 3D Controls
    threeD,
    threeDConfig: threeD,
    master3D: threeD.master3D,
    depthIntensity: threeD.depthIntensity,
    stylePreset: threeD.stylePreset,
    masterTheme: threeD.masterTheme,
    showSandboxPreview: threeD.showSandboxPreview,
    tabUI3DMode: threeD.tabUI3DMode ?? threeD.isVisualOnly ?? true,
    isTab3DModeOn: threeD.tabUI3DMode ?? threeD.isVisualOnly ?? true,
    isVisual3DOnly: threeD.isVisualOnly ?? true,
    setTabUI3DMode,
    toggleTabUI3DMode,
    set3DVisualMode,
    toggle3DVisualMode,
    threeDClusterFilter: threeD.clusterFilter,
    threeDElements: threeD.elements,
    threeDLighting: threeD.lighting,
    threeDCamera: threeD.camera,
    threeDMaterials: threeD.materials,
    threeDPhysics: threeD.physics,
    physicsProfiles: PHYSICS_PROFILES,
    acousticProfiles: ACOUSTIC_PROFILES,
    threeDExploded: threeD.exploded,
    threeDEnvironment: threeD.environment,
    threeDSpatialAudio: threeD.spatialAudio,
    threeDPerformance: threeD.performance,
    setMaster3D,
    toggle3DElement,
    set3DElementGroup,
    enableAll3D,
    disableAll3D,
    reset3DDefaults,
    set3DDepthIntensity,
    set3DStylePreset,
    set3DTheme,
    setShow3DSandbox,
    set3DLighting,
    set3DLightingPreset,
    set3DLightingAngle,
    set3DCursorLight,
    set3DShadowSoftness,
    set3DCamera,
    set3DCameraAnglePreset,
    set3DPerspectiveFOV,
    set3DTiltSensitivity,
    set3DAutoOrbit,
    set3DOrbitSpeed,
    set3DMaterials,
    set3DMaterialPreset,
    set3DSpecularGlow,
    set3DBevelExtrusion,
    set3DPhysics,
    set3DPhysicsHoverPop,
    set3DClickDepression,
    set3DElasticity,
    set3DMagneticPull,
    set3DClusterFilter,
    set3DExploded,
    set3DEnvironment,
    set3DSpatialAudio,
    set3DPerformance,
    import3DConfig,
    export3DConfig,
    copy3DCSSVariables,
    isLive3DApplied,
    setIsLive3DApplied,
    applyToLivePortfolio,
    revertLivePortfolio,
    getScopedSandboxStyles,

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

    // Tab 7: AI & Chat Studio State & Actions
    chatSettings,
    updateChatSettings,
    resetChatSettings,

    // Legacy Aliases & Safety Fallbacks
    audioPitch: pitchMultiplier,
    setAudioPitch: setPitchMultiplier,
    setAudioVolume: setMasterVolume,
    setCursorSpeed: setFlightLerpSpeed,
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
    activePreset: 'default',
    applyPreset: () => false,
    presets: LAB_PRESETS,
    LAB_PRESETS,
    DEFAULT_LAB_CONFIG
  }), [
    soundEnabled,
    masterVolume,
    pitchMultiplier,
    soundMatchingMode,
    voiceAnnouncementEnabled,
    voiceFocusEnabled,
    voiceHoverEnabled,
    setSoundEnabled,
    setMasterVolume,
    setPitchMultiplier,
    setSoundMatchingMode,
    setVoiceAnnouncementEnabled,
    setVoiceFocusEnabled,
    setVoiceHoverEnabled,
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
    autoScrollOnRefresh,
    setGlassBlur,
    setMotionSpeed,
    setAccentColor,
    setLayoutDensity,
    setAutoScrollOnRefresh,
    threeD,
    setMaster3D,
    toggle3DElement,
    set3DElementGroup,
    enableAll3D,
    disableAll3D,
    reset3DDefaults,
    set3DDepthIntensity,
    set3DStylePreset,
    set3DTheme,
    setShow3DSandbox,
    set3DLighting,
    set3DLightingPreset,
    set3DLightingAngle,
    set3DCursorLight,
    set3DShadowSoftness,
    set3DCamera,
    set3DCameraAnglePreset,
    set3DPerspectiveFOV,
    set3DTiltSensitivity,
    set3DAutoOrbit,
    set3DOrbitSpeed,
    set3DMaterials,
    set3DMaterialPreset,
    set3DSpecularGlow,
    set3DBevelExtrusion,
    set3DPhysics,
    set3DPhysicsHoverPop,
    set3DClickDepression,
    set3DElasticity,
    set3DMagneticPull,
    set3DClusterFilter,
    set3DExploded,
    set3DEnvironment,
    set3DSpatialAudio,
    set3DPerformance,
    import3DConfig,
    export3DConfig,
    copy3DCSSVariables,
    isLive3DApplied,
    setIsLive3DApplied,
    applyToLivePortfolio,
    revertLivePortfolio,
    getScopedSandboxStyles,
    activeTab,
    setActiveTab,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    resetDefaults,
    chatSettings,
    updateChatSettings,
    resetChatSettings
  ]);

  // Granular Slice Memoizations for Zero-Jank Isolated Subscriptions
  const cursorValue = useMemo(() => ({
    customCursorEnabled,
    cursorScale,
    flightLerpSpeed,
    flightSpeed,
    stardustTrailEnabled,
    particleColor,
    setCursorScale,
    setFlightSpeed: setFlightLerpSpeed,
    setFlightLerpSpeed,
    setStardustTrail: setStardustTrailEnabled,
    setStardustTrailEnabled,
    setParticleColor,
    setCustomCursorEnabled
  }), [
    customCursorEnabled,
    cursorScale,
    flightLerpSpeed,
    flightSpeed,
    stardustTrailEnabled,
    particleColor,
    setCursorScale,
    setFlightLerpSpeed,
    setStardustTrailEnabled,
    setParticleColor,
    setCustomCursorEnabled
  ]);

  const audioValue = useMemo(() => ({
    soundEnabled,
    masterVolume,
    pitchMultiplier,
    soundMatchingMode,
    voiceAnnouncementEnabled,
    voiceFocusEnabled,
    voiceHoverEnabled,
    setSoundEnabled,
    setMasterVolume,
    setPitchMultiplier,
    setSoundMatchingMode,
    setVoiceAnnouncementEnabled,
    setVoiceFocusEnabled,
    setVoiceHoverEnabled,
    audioPitch: pitchMultiplier,
    setAudioPitch: setPitchMultiplier,
    setAudioVolume: setMasterVolume
  }), [
    soundEnabled,
    masterVolume,
    pitchMultiplier,
    soundMatchingMode,
    voiceAnnouncementEnabled,
    voiceFocusEnabled,
    voiceHoverEnabled,
    setSoundEnabled,
    setMasterVolume,
    setPitchMultiplier,
    setSoundMatchingMode,
    setVoiceAnnouncementEnabled,
    setVoiceFocusEnabled,
    setVoiceHoverEnabled
  ]);

  const heroValue = useMemo(() => ({
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
    setFlashConfetti: setFlashConfettiEnabled,
    setFlashConfettiEnabled,
    setDragEnabled,
    setDragBoundaryConstrained,
    setDragAutoSnapBack,
    setParallaxTilt: setParallaxTiltEnabled,
    setParallaxTiltEnabled,
    recenterCharacter,
    characterScale: characterZoom,
    setCharacterScale: setCharacterZoom,
    heroScale: characterZoom,
    setHeroScale: setCharacterZoom,
    heroGazeMode: gazeMode,
    setHeroGazeMode: setGazeMode,
    heroPoseOverride: poseOverride,
    setHeroPoseOverride: setPoseOverride,
    cameraEffectsEnabled: flashConfettiEnabled,
    setCameraEffectsEnabled: setFlashConfettiEnabled
  }), [
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
    recenterCharacter
  ]);

  const threeDValue = useMemo(() => ({
    threeD,
    threeDConfig: threeD,
    isLive3DApplied,
    setIsLive3DApplied,
    applyToLivePortfolio,
    revertLivePortfolio,
    getScopedSandboxStyles,
    master3D: threeD.master3D,
    depthIntensity: threeD.depthIntensity,
    stylePreset: threeD.stylePreset,
    masterTheme: threeD.masterTheme,
    showSandboxPreview: threeD.showSandboxPreview,
    tabUI3DMode: threeD.tabUI3DMode ?? threeD.isVisualOnly ?? true,
    isTab3DModeOn: threeD.tabUI3DMode ?? threeD.isVisualOnly ?? true,
    isVisual3DOnly: threeD.isVisualOnly ?? true,
    setTabUI3DMode,
    toggleTabUI3DMode,
    set3DVisualMode,
    toggle3DVisualMode,
    threeDClusterFilter: threeD.clusterFilter,
    threeDElements: threeD.elements,
    threeDLighting: threeD.lighting,
    threeDCamera: threeD.camera,
    threeDMaterials: threeD.materials,
    threeDPhysics: threeD.physics,
    physicsProfiles: PHYSICS_PROFILES,
    acousticProfiles: ACOUSTIC_PROFILES,
    threeDExploded: threeD.exploded,
    threeDEnvironment: threeD.environment,
    threeDSpatialAudio: threeD.spatialAudio,
    threeDPerformance: threeD.performance,
    setMaster3D,
    toggle3DElement,
    set3DElementGroup,
    enableAll3D,
    disableAll3D,
    reset3DDefaults,
    set3DDepthIntensity,
    set3DStylePreset,
    set3DTheme,
    setShow3DSandbox,
    set3DLighting,
    set3DLightingPreset,
    set3DLightingAngle,
    set3DCursorLight,
    set3DShadowSoftness,
    set3DCamera,
    set3DCameraAnglePreset,
    set3DPerspectiveFOV,
    set3DTiltSensitivity,
    set3DAutoOrbit,
    set3DOrbitSpeed,
    set3DMaterials,
    set3DMaterialPreset,
    set3DSpecularGlow,
    set3DBevelExtrusion,
    set3DPhysics,
    set3DPhysicsHoverPop,
    set3DClickDepression,
    set3DElasticity,
    set3DMagneticPull,
    set3DClusterFilter,
    set3DExploded,
    set3DEnvironment,
    set3DSpatialAudio,
    set3DPerformance,
    import3DConfig,
    export3DConfig,
    copy3DCSSVariables
  }), [
    threeD,
    setMaster3D,
    toggle3DElement,
    set3DElementGroup,
    enableAll3D,
    disableAll3D,
    reset3DDefaults,
    set3DDepthIntensity,
    set3DStylePreset,
    set3DTheme,
    setShow3DSandbox,
    set3DLighting,
    set3DLightingPreset,
    set3DLightingAngle,
    set3DCursorLight,
    set3DShadowSoftness,
    set3DCamera,
    set3DCameraAnglePreset,
    set3DPerspectiveFOV,
    set3DTiltSensitivity,
    set3DAutoOrbit,
    set3DOrbitSpeed,
    set3DMaterials,
    set3DMaterialPreset,
    set3DSpecularGlow,
    set3DBevelExtrusion,
    set3DPhysics,
    set3DPhysicsHoverPop,
    set3DClickDepression,
    set3DElasticity,
    set3DMagneticPull,
    set3DClusterFilter,
    set3DExploded,
    set3DEnvironment,
    set3DSpatialAudio,
    set3DPerformance,
    import3DConfig,
    export3DConfig,
    copy3DCSSVariables,
    isLive3DApplied,
    setIsLive3DApplied,
    applyToLivePortfolio,
    revertLivePortfolio,
    getScopedSandboxStyles
  ]);

  const visualsValue = useMemo(() => ({
    glassBlur,
    motionSpeed,
    accentColor,
    layoutDensity,
    autoScrollOnRefresh,
    setGlassBlur,
    setMotionSpeed,
    setAccentColor,
    setLayoutDensity,
    setAutoScrollOnRefresh
  }), [
    glassBlur,
    motionSpeed,
    accentColor,
    layoutDensity,
    autoScrollOnRefresh,
    setGlassBlur,
    setMotionSpeed,
    setAccentColor,
    setLayoutDensity,
    setAutoScrollOnRefresh
  ]);

  const drawerValue = useMemo(() => ({
    activeTab,
    setActiveTab,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer
  }), [
    activeTab,
    setActiveTab,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer
  ]);

  const chatValue = useMemo(() => ({
    chatSettings,
    updateChatSettings,
    resetChatSettings
  }), [chatSettings, updateChatSettings, resetChatSettings]);

  return (
    <LabContext.Provider value={value}>
      <LabCursorContext.Provider value={cursorValue}>
        <LabAudioContext.Provider value={audioValue}>
          <LabHeroContext.Provider value={heroValue}>
            <LabThreeDContext.Provider value={threeDValue}>
              <LabVisualsContext.Provider value={visualsValue}>
                <LabDrawerContext.Provider value={drawerValue}>
                  <LabChatContext.Provider value={chatValue}>
                    {children}
                  </LabChatContext.Provider>
                </LabDrawerContext.Provider>
              </LabVisualsContext.Provider>
            </LabThreeDContext.Provider>
          </LabHeroContext.Provider>
        </LabAudioContext.Provider>
      </LabCursorContext.Provider>
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

export function useLabCursor() {
  const context = useContext(LabCursorContext);
  if (!context) {
    throw new Error('useLabCursor must be used within a LabProvider');
  }
  return context;
}

export function useLabAudio() {
  const context = useContext(LabAudioContext);
  if (!context) {
    throw new Error('useLabAudio must be used within a LabProvider');
  }
  return context;
}

export function useLabHero() {
  const context = useContext(LabHeroContext);
  if (!context) {
    throw new Error('useLabHero must be used within a LabProvider');
  }
  return context;
}

export function useLabThreeD() {
  const context = useContext(LabThreeDContext);
  if (!context) {
    throw new Error('useLabThreeD must be used within a LabProvider');
  }
  return context;
}

export const useLab3D = useLabThreeD;

export function useLabVisuals() {
  const context = useContext(LabVisualsContext);
  if (!context) {
    throw new Error('useLabVisuals must be used within a LabProvider');
  }
  return context;
}

export function useLabDrawer() {
  const context = useContext(LabDrawerContext);
  if (!context) {
    throw new Error('useLabDrawer must be used within a LabProvider');
  }
  return context;
}

export function useLabChat() {
  const context = useContext(LabChatContext);
  if (!context) {
    throw new Error('useLabChat must be used within a LabProvider');
  }
  return context;
}

export default LabProvider;
