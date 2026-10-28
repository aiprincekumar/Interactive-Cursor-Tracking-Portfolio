/* oxlint-disable react/only-export-components */
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  User,
  Settings,
  RotateCcw,
  Check,
  Eye,
  Camera,
  CircleDot,
  Crosshair,
  Bell,
  Activity,
  Fingerprint,
  MousePointer,
  Briefcase,
  Layers,
  Palette,
  Sun,
  Moon,
  Gauge,
  LayoutGrid,
  Move,
  Footprints,
  Target,
  Compass,
  Mic,
  MicOff,
  Box,
  Cuboid,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Zap,
  Maximize2,
  Navigation,
  UserCheck,
  FileText,
  Frame,
  Grid,
  Image,
  ToggleLeft,
  ToggleRight,
  EyeOff,
  Sunset,
  Magnet,
  Lightbulb,
  Video,
  Split,
  CloudFog,
  Globe,
  Headphones,
  Radio,
  Cpu,
  Battery,
  Download,
  Upload,
  Copy,
  Code,
  Shield,
  BotMessageSquare,
  BrainCircuit,
  ShieldCheck,
  Trash2,
  Flame,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import UniversalMiniPortfolio from './3d-sandbox/UniversalMiniPortfolio';
import StickySandboxColumn from './3d-sandbox/StickySandboxColumn';
import { ThreeDPresetCard, ThreeDActionKeycap, ThreeDToggleKey } from './3d-sandbox/ThreeDButtonPrimitives';
import { CameraCubePreview, MaterialShaderSphere, ThemeExtrudedSlab, LightingVectorPreview } from './3d-sandbox/Visual3DPresets';
import { SpringElasticityVisual, ExplodedCADLayerVisual } from './3d-sandbox/PhysicsAndCADVisuals';
import useSandboxAutoSwitch from '../hooks/useSandboxAutoSwitch';
import { useLab, useLabVisuals, useLabChat, DEFAULT_AI_CHAT_SETTINGS, POSE_INDEX_MAP } from '../context/LabContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useHighContrast } from '../context/HighContrastContext';
import { useAnnounce } from '../context/AnnouncerContext';
import { soundFX, SOUNDBOARD_SOUNDS } from '../utils/audio';

const SOUND_ICONS = {
  shutter: Camera,
  sparkle: Sparkles,
  pop: CircleDot,
  focus: Crosshair,
  chime: Bell,
  ribbon: Activity,
  haptic: Fingerprint
};

const PRESET_COLORS = [
  { name: 'Coral Rose', hex: '#FF4D6D' },
  { name: 'Electric Cyan', hex: '#00F2FE' },
  { name: 'Solar Gold', hex: '#FFD700' },
  { name: 'Matrix Emerald', hex: '#10B981' },
  { name: 'Cyber Purple', hex: '#A855F7' },
  { name: 'Starlight White', hex: '#FFFFFF' }
];

const POSE_BUTTONS = [
  { label: 'Auto (Dynamic)', index: null, desc: 'Real-time gaze follow' },
  { label: '00 Rear', index: 0, desc: 'Resting back view' },
  { label: '01 Up', index: 1, desc: 'Upper center glance' },
  { label: '02 Down', index: 2, desc: 'Lower center glance' },
  { label: '03 Left', index: 3, desc: 'Left profile turn' },
  { label: '04 Right', index: 4, desc: 'Right profile turn' },
  { label: '05 Center', index: 5, desc: 'Signature front portrait' },
  { label: '06 Up-Left', index: 6, desc: 'Upper left corner glance' },
  { label: '07 Down-Left', index: 7, desc: 'Lower left corner glance' },
  { label: '08 Up-Right', index: 8, desc: 'Upper right corner glance' },
  { label: '09 Down-Right', index: 9, desc: 'Lower right corner glance' }
];

const ROLE_OPTIONS = [
  {
    id: 'accountant',
    title: 'Accountant & Tax Consultant',
    badge: 'Financial Track',
    accent: '#FF4D6D',
    desc: '4+ Yrs Tally Prime, GST filing, Income Tax compliance & ledgers'
  },
  {
    id: 'mis',
    title: 'MIS Executive',
    badge: 'Operations & Data Track',
    accent: '#3B82F6',
    desc: 'DAY-NULM Skill India trainee reporting, analytics & operations'
  },
  {
    id: 'other',
    title: 'Corporate Controller',
    badge: 'BI & AI Track',
    accent: '#8B5CF6',
    desc: 'Business intelligence, automated controls & financial modeling'
  }
];

const DENSITY_OPTIONS = [
  {
    id: 'compact',
    name: 'Compact',
    multiplier: '0.8x spacing',
    spacingValue: '0.82x',
    summary: 'Higher information density',
    desc: 'Compact (0.8x spacing, higher information density)',
    badge: '0.8x Compact'
  },
  {
    id: 'comfortable',
    name: 'Comfortable',
    multiplier: '1.0x spacing',
    spacingValue: '1.0x',
    summary: 'Balanced signature luxury',
    desc: 'Comfortable (1.0x spacing, balanced signature luxury)',
    badge: '1.0x Default'
  },
  {
    id: 'spacious',
    name: 'Spacious',
    multiplier: '1.25x spacing',
    spacingValue: '1.25x',
    summary: 'Airy editorial showcase',
    desc: 'Spacious (1.25x spacing, airy editorial showcase)',
    badge: '1.25x Spacious'
  }
];

const THREED_CATEGORIES = [
  {
    id: 'nav',
    title: 'Navigation & Floating Controls',
    num: '01',
    desc: 'Primary fixed controls & interactive floating trigger elements',
    items: [
      { key: 'floatingButton', title: 'Floating Lab Studio Orb', desc: 'Floating action launcher button in bottom-right corner', icon: Compass },
      { key: 'navbarItems', title: 'Top Navigation Links', desc: 'Main navigation bar item capsules with hover elevation', icon: Navigation },
      { key: 'navbarIcons', title: 'Interactive Navbar Icons', desc: 'Action icons inside top header bar (search, theme, audio)', icon: Sparkles },
      { key: 'resumeButton', title: 'Quick Resume CTA Pill', desc: 'Prominent header action button to download/view credentials', icon: FileText }
    ]
  },
  {
    id: 'hero',
    title: 'Hero & Identity',
    num: '02',
    desc: 'Core biographical character display and personal brand headers',
    items: [
      { key: 'profilePic', title: 'Character Portrait Avatar', desc: 'Primary gaze-tracking avatar frame with kinetic depth and tilt', icon: UserCheck },
      { key: 'header', title: 'Main Hero Name Display', desc: 'Primary name title header with deep 3D bevel and perspective extrusion', icon: Frame },
      { key: 'subHeader', title: 'Professional Title Subtitle', desc: 'Career track sub-header typography with subtle floating shadow', icon: Briefcase },
      { key: 'description', title: 'Biographical Intro Paragraph', desc: 'Introductory bio card with layered backdrop elevation', icon: FileText }
    ]
  },
  {
    id: 'containers',
    title: 'Containers & Content',
    num: '03',
    desc: 'Card modules, project showcases and content layout structures',
    items: [
      { key: 'container', title: 'Outer Card Container Frames', desc: 'Interactive feature cards, showcases and laboratory modules', icon: Grid },
      { key: 'containerContent', title: 'Inner Container Content', desc: 'Parallax floating layers inside cards and interactive modules', icon: Layers }
    ]
  }
];

const THREED_MASTER_THEMES = [
  {
    id: 'apple-glass',
    name: 'Apple Glass',
    desc: 'Frosted acrylic, soft ambient lighting & fluid depth',
    icon: Sparkles,
    badge: 'Frosted Glass'
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    desc: 'Wireframe glow, chromatic spotlights & snappy physics',
    icon: Zap,
    badge: 'Cyber Glow'
  },
  {
    id: 'studio-matte',
    name: 'Studio Matte',
    desc: 'Neumorphic clay, diffused softbox & tactile bevel',
    icon: Box,
    badge: 'Tactile Clay'
  },
  {
    id: 'floating-hologram',
    name: 'Floating Hologram',
    desc: 'Glass acrylic sheen, golden sunset grazing & deep parallax',
    icon: Maximize2,
    badge: 'Glass Hologram'
  }
];

const LIGHTING_PRESETS = [
  { id: 'studio-soft', name: 'Studio Soft', icon: Sun, desc: 'Balanced 3-point softbox studio illumination' },
  { id: 'sunset', name: 'Dramatic Sunset', icon: Sunset, desc: 'Warm golden hour low-angle grazing light' },
  { id: 'cyber-neon', name: 'Cyber Neon', icon: Zap, desc: 'High-contrast edge highlights & colored spotlights' }
];

const CAMERA_PRESETS = [
  { id: 'isometric', name: 'Isometric 3/4', desc: 'Classic 45° planar axonometric perspective' },
  { id: 'top-down', name: 'Top-Down', desc: 'Bird’s-eye overhead architectural orientation' },
  { id: 'eye-level', name: 'Eye-Level', desc: 'Direct face-to-face spatial depth' },
  { id: 'cinematic', name: 'Cinematic Tilt', desc: 'Dynamic low-angle high-depth perspective' }
];

const MATERIAL_PRESETS = [
  { id: 'glass-acrylic', name: 'Glass Acrylic', desc: 'Semi-transparent frosted glass with specular highlight' },
  { id: 'metallic-gloss', name: 'Metallic Gloss', desc: 'Reflective silver-chrome with sharp reflection sheen' },
  { id: 'neumorphic-clay', name: 'Neumorphic Clay', desc: 'Velvety matte clay with convex embossed edges' },
  { id: 'cyber-wireframe', name: 'Cyber Wireframe', desc: 'Deep transparent dark substrate with glowing wire contours' }
];

const ELASTICITY_PRESETS = [
  { id: 'rigid', name: 'Rigid', desc: 'Instant mechanical response, zero overshoot' },
  { id: 'snappy', name: 'Snappy', desc: 'Natural balanced spring with swift stabilization' },
  { id: 'bouncy', name: 'Bouncy', desc: 'Playful kinetic oscillation and rubbery recoil' }
];

const THREED_CLUSTERS = [
  { id: 'all', label: 'All (9)', count: 9 },
  { id: 'design', label: 'Design & Materials (3)', count: 3 },
  { id: 'physics', label: 'Physics & CAD (3)', count: 3 },
  { id: 'system', label: 'Environment & System (3)', count: 3 }
];

const SKYBOX_PRESETS = [
  { id: 'dark-studio', name: 'Dark Studio', desc: 'Deep neutral studio with subtle floor vignetting & clean lighting', badge: 'Studio' },
  { id: 'cyber-city', name: 'Cyber City', desc: 'Neon-lit cyberpunk metropolis with distant chromatic towers', badge: 'Cyber' },
  { id: 'cosmic-nebula', name: 'Cosmic Nebula', desc: 'Interstellar deep-space void with starry gas clouds', badge: 'Cosmic' },
  { id: 'sunset-horizon', name: 'Sunset Horizon', desc: 'Warm dusk twilight gradient with glowing horizon haze', badge: 'Sunset' }
];

const ROOM_SIZE_PRESETS = [
  { id: 'booth', name: 'Acoustic Booth', desc: 'Tight, ultra-dry sound stage with minimal acoustic bounce', badge: 'Dry' },
  { id: 'studio', name: 'Mastering Studio', desc: 'Warm, controlled natural reverberation and balanced stereo imaging', badge: 'Natural' },
  { id: 'cathedral', name: 'Grand Cathedral', desc: 'Expansive, cavernous acoustic space with lush lingering tail', badge: 'Wet' }
];

const FPS_PRESETS = [
  { id: 30, name: '30 FPS', badge: 'Battery Saver', desc: 'Optimized for low-power devices & extended battery lifespan' },
  { id: 60, name: '60 FPS', badge: 'Standard Smooth', desc: 'Buttery smooth 60hz standard gaming and motion graphics baseline' },
  { id: 120, name: '120 FPS', badge: 'ProMotion Ultra', desc: 'Uncapped ultra-high-refresh rate rendering for Pro displays' }
];

const AI_MODEL_CARDS = [
  {
    id: 'auto',
    name: 'Auto-Detect Hardware Tier',
    badge: 'Recommended',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    size: 'Auto Tier',
    desc: 'SmolLM-135M / Qwen-0.5B / Qwen-1.5B based on WebGPU & RAM.',
    spec: 'Adaptive Neural Engine'
  },
  {
    id: 'offline_rag',
    name: 'Deterministic Offline RAG Only',
    badge: '0 MB Instant',
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    size: '0 MB',
    desc: 'Instant keyword and pattern matcher without neural model weights.',
    spec: 'Zero Download Retrieval'
  },
  {
    id: 'onnx-community/SmolLM2-135M-Instruct-ONNX',
    name: 'SmolLM2-135M Instruct',
    badge: '~90 MB',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    size: '~90 MB',
    desc: 'Ultra-compact neural model for lightweight mobile devices and low RAM.',
    spec: 'Fastest Local Inference'
  },
  {
    id: 'onnx-community/Qwen2.5-0.5B-Instruct',
    name: 'Qwen2.5-0.5B Instruct',
    badge: '~350 MB',
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    size: '~350 MB',
    desc: 'Balanced precision model with fluent reasoning and low latency.',
    spec: 'Balanced Reasoning'
  },
  {
    id: 'onnx-community/Qwen2.5-1.5B-Instruct',
    name: 'Qwen2.5-1.5B Instruct',
    badge: '~950 MB',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    size: '~950 MB',
    desc: 'High-precision reasoning, complex code generation, and long context.',
    spec: 'High-Precision Neural'
  }
];

export default function ControlCenterPanel({ variant = 'workbench', isStandalone = false, mode = 'all', singleTab = null }) {
  const lab = useLab();
  const labVisuals = useLabVisuals();
  const { chatSettings, updateChatSettings, resetChatSettings } = useLabChat();

  const {
    // Audio
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

    // Cursor
    customCursorEnabled,
    cursorScale,
    flightLerpSpeed,
    stardustTrailEnabled,
    particleColor,
    setCustomCursorEnabled,
    setCursorScale,
    setFlightLerpSpeed,
    setStardustTrailEnabled,
    setParticleColor,

    // Hero
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

    // Preferences
    defaultStartupRole,
    defaultCursorEnabled,
    defaultAudioEnabled,
    reducedMotion,
    setDefaultStartupRole,
    setDefaultCursorEnabled,
    setDefaultAudioEnabled,
    setReducedMotion,

    // Visuals
    glassBlur,
    motionSpeed,
    accentColor,
    layoutDensity,
    setGlassBlur,
    setMotionSpeed,
    setAccentColor,
    setLayoutDensity,

    // 3D Controls
    threeD,
    tabUI3DMode,
    isTab3DModeOn,
    setTabUI3DMode,
    toggleTabUI3DMode,
    isVisual3DOnly: _contextVisual3DOnly,
    set3DVisualMode,
    toggle3DVisualMode,
    setMaster3D,
    toggle3DElement,
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
    applyToLivePortfolio,
    revertLivePortfolio,
    getScopedSandboxStyles,

    // State & Meta
    activeTab,
    setActiveTab,
    resetDefaults
  } = lab;

  const [expandedAccordion, setExpandedAccordion] = useState('elements');
  const {
    activePreviewTab,
    setActivePreviewTab: setPreviewTabDirect,
    handleManualTabSelect,
    isAutoSwitchPaused,
    resumeAutoSwitch,
    notifyAccordionChange
  } = useSandboxAutoSwitch({ initialTab: 'universal' });

  // Phase 5: Bi-Directional Visual Linking State & Normalizer
  const [highlightedComponent, setHighlightedComponent] = useState(null);

  const isComponentHighlighted = useCallback((key) => {
    if (!highlightedComponent || !key) return false;
    const k1 = String(highlightedComponent).toLowerCase().trim();
    const k2 = String(key).toLowerCase().trim();
    if (k1 === k2) return true;
    if ((k1 === 'nav' || k1 === 'navbar' || k1 === 'navigation') && (k2 === 'nav' || k2 === 'navbar' || k2 === 'navigation')) return true;
    if ((k1 === 'hero' || k1 === 'header' || k1 === 'card3d' || k1 === 'avatar' || k1 === 'profilepic') && (k2 === 'hero' || k2 === 'header' || k2 === 'card3d' || k2 === 'avatar' || k2 === 'profilepic')) return true;
    if ((k1 === 'showcase' || k1 === 'cards' || k1 === 'grid' || k1 === 'container' || k1 === 'containercontent' || k1 === 'containers') && (k2 === 'showcase' || k2 === 'cards' || k2 === 'grid' || k2 === 'container' || k2 === 'containercontent' || k2 === 'containers')) return true;
    if (k1 === 'dock' && (k2 === 'dock' || k2 === 'floatingbutton')) return true;
    if (k1 === 'footer' && k2 === 'footer') return true;
    return false;
  }, [highlightedComponent]);

  const setActivePreviewTab = useCallback((tabId) => {
    handleManualTabSelect(tabId);
  }, [handleManualTabSelect]);

  const toggleAccordionSection = useCallback((secKey) => {
    setExpandedAccordion((prev) => {
      const next = prev === secKey ? null : secKey;
      if (next) {
        notifyAccordionChange(next);
      }
      return next;
    });
    if (soundEnabled) soundFX.playHapticClick();
  }, [soundEnabled, notifyAccordionChange]);

  const [sandboxTilt, setSandboxTilt] = useState({ rotX: 0, rotY: 0 });
  const [isDraggingSandbox, setIsDraggingSandbox] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });
  const sandboxRafRef = useRef(null);

  const handleSandboxPointerDown = useCallback((e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDraggingSandbox(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: sandboxTilt.rotX,
      rotY: sandboxTilt.rotY
    };
  }, [sandboxTilt]);

  const handleSandboxPointerMove = useCallback((e) => {
    if (!isDraggingSandbox) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (sandboxRafRef.current) {
      cancelAnimationFrame(sandboxRafRef.current);
    }

    sandboxRafRef.current = requestAnimationFrame(() => {
      const dx = clientX - dragStartRef.current.x;
      const dy = clientY - dragStartRef.current.y;
      const sens = ((threeD?.camera?.tiltSensitivity ?? 15) / 15);
      const newRotX = Math.min(Math.max(dragStartRef.current.rotX - dy * 0.3 * sens, -18), 18);
      const newRotY = Math.min(Math.max(dragStartRef.current.rotY + dx * 0.3 * sens, -22), 22);
      setSandboxTilt({ rotX: Math.round(newRotX), rotY: Math.round(newRotY) });
      sandboxRafRef.current = null;
    });
  }, [isDraggingSandbox, threeD?.camera?.tiltSensitivity]);

  const handleSandboxPointerUp = useCallback((e) => {
    if (sandboxRafRef.current) {
      cancelAnimationFrame(sandboxRafRef.current);
      sandboxRafRef.current = null;
    }
    if (isDraggingSandbox) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe release
      }
      setIsDraggingSandbox(false);
    }
  }, [isDraggingSandbox]);

  useEffect(() => {
    return () => {
      if (sandboxRafRef.current) {
        cancelAnimationFrame(sandboxRafRef.current);
        sandboxRafRef.current = null;
      }
    };
  }, []);

  const resetSandboxView = useCallback(() => {
    setSandboxTilt({ rotX: 0, rotY: 0 });
    if (soundEnabled) soundFX.playHapticClick();
  }, [soundEnabled]);

  // Strict Single-Expanded Accordion Discipline for 3D Categories
  // By default only Section 1 Category 1 ('nav') is uncollapsed; clicking another category collapses all others.
  const [expandedCategory, setExpandedCategory] = useState('nav');

  const toggleCategory = useCallback((catKey) => {
    setExpandedCategory((prev) => (prev === catKey ? null : catKey));
    notifyAccordionChange(catKey);
    if (soundEnabled) soundFX.playHapticClick();
  }, [soundEnabled, notifyAccordionChange]);

  const expandedCategories = useMemo(() => ({
    nav: expandedCategory === 'nav',
    hero: expandedCategory === 'hero',
    containers: expandedCategory === 'containers'
  }), [expandedCategory]);

  const { theme, toggleTheme } = useTheme();

  let announcerContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    announcerContext = useAnnounce();
  } catch {
    // Graceful fallback
  }

  // Synchronized voice state across Lab Context and Announcer Context
  const isVoiceAnnouncementOn = Boolean(
    voiceAnnouncementEnabled ?? announcerContext?.voiceEnabled
  );

  const isVoiceFocusOn = Boolean(
    voiceFocusEnabled ?? announcerContext?.voiceFocusEnabled ?? true
  );

  const isVoiceHoverOn = Boolean(
    voiceHoverEnabled ?? announcerContext?.hoverVoiceEnabled ?? false
  );

  const handleToggleVoiceAnnouncement = (nextState) => {
    const val = typeof nextState === 'boolean' ? nextState : !isVoiceAnnouncementOn;
    if (setVoiceAnnouncementEnabled) {
      setVoiceAnnouncementEnabled(val);
    }
    if (announcerContext?.setVoiceEnabled) {
      announcerContext.setVoiceEnabled(val);
    }
    if (val && announcerContext?.speak) {
      announcerContext.speak('Voice announcement enabled');
    }
    try {
      soundFX.init();
      if (soundEnabled) {
        soundFX.playLaserFocus();
      }
    } catch {
      // Ignore
    }
  };

  const handleToggleVoiceFocus = (nextState) => {
    const val = typeof nextState === 'boolean' ? nextState : !isVoiceFocusOn;
    if (setVoiceFocusEnabled) {
      setVoiceFocusEnabled(val);
    }
    if (announcerContext?.setVoiceFocusEnabled) {
      announcerContext.setVoiceFocusEnabled(val);
    }
    if (val && announcerContext?.speak) {
      announcerContext.speak('Speak on keyboard focus enabled');
    }
    try {
      soundFX.init();
      if (soundEnabled) {
        soundFX.playLaserFocus();
      }
    } catch {
      // Ignore
    }
  };

  const handleToggleVoiceHover = (nextState) => {
    const val = typeof nextState === 'boolean' ? nextState : !isVoiceHoverOn;
    if (setVoiceHoverEnabled) {
      setVoiceHoverEnabled(val);
    }
    if (announcerContext?.setHoverVoiceEnabled) {
      announcerContext.setHoverVoiceEnabled(val);
    }
    if (val && announcerContext?.speak) {
      announcerContext.speak('Mouse hover narration enabled');
    }
    try {
      soundFX.init();
      if (soundEnabled) {
        soundFX.playLaserFocus();
      }
    } catch {
      // Ignore
    }
  };

  let highContrastContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    highContrastContext = useHighContrast();
  } catch {
    // Graceful fallback
  }
  const isHighContrast = Boolean(highContrastContext?.isHighContrast);
  const toggleHighContrast = highContrastContext?.toggleHighContrast;

  const { language } = useLanguage();
  const autoScrollOnRefresh = labVisuals?.autoScrollOnRefresh ?? lab?.autoScrollOnRefresh ?? true;
  const setAutoScrollOnRefresh = labVisuals?.setAutoScrollOnRefresh || lab?.setAutoScrollOnRefresh;
  const effectiveActiveTab = (mode === 'single' && singleTab) ? singleTab : activeTab;

  const handlePopoutTab = (targetTab, e) => {
    if (e) e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}?view=control&mode=single&tab=${targetTab}&theme=${theme}&lang=${language}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const isDrawer = variant === 'drawer';

  const handleSelectDensity = (densityId) => {
    setLayoutDensity(densityId);
    try {
      soundFX.init();
      if (soundEnabled) {
        soundFX.playLaserFocus();
      }
    } catch {
      // Handled silently
    }
  };

  const handleDensityKeyDown = (e, currentId) => {
    const order = ['compact', 'comfortable', 'spacious'];
    const currentIndex = order.indexOf(currentId);
    let targetIndex = -1;

    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      targetIndex = (safeIndex + 1) % order.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      targetIndex = (safeIndex - 1 + order.length) % order.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIndex = order.length - 1;
    }

    if (targetIndex !== -1) {
      const nextId = order[targetIndex];
      handleSelectDensity(nextId);
      const container = e.currentTarget.closest('[role="radiogroup"]');
      const nextRadio = container?.querySelector(`[data-density-id="${nextId}"]`);
      nextRadio?.focus();
    }
  };

  const handleSelectRole = (roleId) => {
    setDefaultStartupRole(roleId);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('portfolio_selected_role', roleId);
        window.dispatchEvent(new CustomEvent('switch-role-tab', { detail: { role: roleId } }));
      }
      if (soundEnabled) {
        soundFX.playLaserFocus();
      }
    } catch {
      // Ignore
    }
  };

  const getAccentName = (hex) => {
    const map = {
      '#FF4D6D': 'Rose',
      '#F59E0B': 'Amber',
      '#06B6D4': 'Cyan',
      '#10B981': 'Emerald'
    };
    return map[hex?.toUpperCase()] || 'Custom';
  };

  const threeDConfig = threeD || lab.threeDConfig || {
    master3D: false,
    depthIntensity: 1.0,
    stylePreset: 'subtle',
    masterTheme: 'apple-glass',
    showSandboxPreview: true,
    clusterFilter: 'all',
    elements: {},
    lighting: { preset: 'studio-soft', angle: 45, cursorLight: true, shadowSoftness: 0.7 },
    camera: { anglePreset: 'isometric', perspectiveFOV: 1000, tiltSensitivity: 15, autoOrbit: false, orbitSpeed: 1.0 },
    materials: { preset: 'glass-acrylic', specularGlow: 0.6, bevelExtrusion: 3 },
    physics: { hoverPop: 12, clickDepression: true, elasticity: 'snappy', magneticPull: false },
    exploded: { enabled: false, separationDistance: 45, blueprintMode: false, layerStagger: 15, ghostOpacity: 0.4 },
    environment: { skybox: 'dark-studio', fogDensity: 30, stardustParticles: true, particleCount: 50, depthOfFieldBlur: 0 },
    spatialAudio: { binauralPanning: true, roomSize: 'studio', reverbIntensity: 0.5, materialHaptics: true, dopplerShift: false },
    performance: { fpsTarget: 60, autoThrottleIdle: true, gpuAcceleration: 'standard', lowPowerThreshold: true }
  };
  const isMaster3DOn = Boolean(threeDConfig.master3D);
  const isTab3DActive = typeof isTab3DModeOn === 'boolean'
    ? isTab3DModeOn
    : (typeof tabUI3DMode === 'boolean' ? tabUI3DMode : (threeDConfig.tabUI3DMode ?? threeDConfig.isVisualOnly ?? true));
  const isVisual3DOnly = isTab3DActive;
  const current3DElements = threeDConfig.elements || {};
  const active3DCount = Object.values(current3DElements).filter(Boolean).length;
  const currentMasterTheme = threeDConfig.masterTheme || 'apple-glass';
  const showSandboxPreview = threeDConfig.showSandboxPreview !== false;
  const clusterFilter = threeDConfig.clusterFilter || 'all';
  const lighting = threeDConfig.lighting || { preset: 'studio-soft', angle: 45, cursorLight: true, shadowSoftness: 0.7 };
  const camera = threeDConfig.camera || { anglePreset: 'isometric', perspectiveFOV: 1000, tiltSensitivity: 15, autoOrbit: false, orbitSpeed: 1.0 };
  const materials = threeDConfig.materials || { preset: 'glass-acrylic', specularGlow: 0.6, bevelExtrusion: 3 };
  const physics = threeDConfig.physics || { hoverPop: 12, clickDepression: true, elasticity: 'snappy', magneticPull: false };
  const depthIntensity = threeDConfig.depthIntensity ?? 1.0;
  const stylePreset = threeDConfig.stylePreset || 'subtle';
  const exploded = threeDConfig.exploded || { enabled: false, separationDistance: 45, blueprintMode: false, layerStagger: 15, ghostOpacity: 0.4 };
  const environment = threeDConfig.environment || { skybox: 'dark-studio', fogDensity: 30, stardustParticles: true, particleCount: 50, depthOfFieldBlur: 0 };
  const spatialAudio = threeDConfig.spatialAudio || { binauralPanning: true, roomSize: 'studio', reverbIntensity: 0.5, materialHaptics: true, dopplerShift: false };
  const performanceConfig = threeDConfig.performance || { fpsTarget: 60, autoThrottleIdle: true, gpuAcceleration: 'standard', lowPowerThreshold: true };

  const isSectionVisible = (secKey) => {
    if (!clusterFilter || clusterFilter === 'all') return true;
    if (clusterFilter === 'design') return ['elements', 'materials', 'lighting'].includes(secKey);
    if (clusterFilter === 'physics') return ['camera', 'physics', 'exploded'].includes(secKey);
    if (clusterFilter === 'system') return ['environment', 'spatialAudio', 'performance'].includes(secKey);
    return true;
  };

  const [copiedCss, setCopiedCss] = useState(false);
  const [toolkitStatus, setToolkitStatus] = useState(null);
  const jsonFileInputRef = useRef(null);

  const handleCopyCssVariables = useCallback(() => {
    try {
      const vars = copy3DCSSVariables ? copy3DCSSVariables() : '';
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(vars);
      }
      setCopiedCss(true);
      if (soundEnabled) soundFX.playSnap();
      setTimeout(() => setCopiedCss(false), 2500);
    } catch {
      // Fallback
    }
  }, [copy3DCSSVariables, soundEnabled]);

  const handleExportJson = useCallback(() => {
    try {
      const jsonStr = export3DConfig ? export3DConfig() : JSON.stringify(threeDConfig, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `threed-portfolio-config-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setToolkitStatus({ type: 'success', message: '3D JSON configuration exported successfully!' });
      if (soundEnabled) soundFX.playLaserFocus();
      setTimeout(() => setToolkitStatus(null), 3500);
    } catch (err) {
      setToolkitStatus({ type: 'error', message: 'Failed to export: ' + err.message });
      setTimeout(() => setToolkitStatus(null), 3500);
    }
  }, [export3DConfig, soundEnabled, threeDConfig]);

  const handleImportJsonClick = useCallback(() => {
    jsonFileInputRef.current?.click();
  }, []);

  const handleJsonFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (import3DConfig) {
        const res = import3DConfig(text);
        if (res.success) {
          setToolkitStatus({ type: 'success', message: res.message || '3D JSON imported successfully!' });
          if (soundEnabled) soundFX.playLaserFocus();
        } else {
          setToolkitStatus({ type: 'error', message: res.message || 'Import error.' });
        }
        setTimeout(() => setToolkitStatus(null), 4000);
      }
    };
    reader.onerror = () => {
      setToolkitStatus({ type: 'error', message: 'Could not read JSON file.' });
      setTimeout(() => setToolkitStatus(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [import3DConfig, soundEnabled]);

  const [availableVoices, setAvailableVoices] = useState([]);
  const [purgeStatus, setPurgeStatus] = useState(null);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        try {
          const v = window.speechSynthesis.getVoices();
          if (v && v.length > 0) setAvailableVoices(v);
        } catch {}
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
      return () => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      };
    }
  }, []);

  const getModelTag = useCallback(() => {
    const mId = chatSettings?.modelId;
    if (mId === 'offline_rag') return '0MB RAG';
    if (mId === 'auto') return 'Auto Tier';
    if (mId && mId.includes('SmolLM2-135M')) return '135M';
    if (mId && mId.includes('Qwen2.5-0.5B')) return '0.5B';
    if (mId && mId.includes('Qwen2.5-1.5B')) return '1.5B';
    return 'Neural';
  }, [chatSettings?.modelId]);

  const handleTestVoice = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance("Hello! I am Atul's AI portfolio assistant.");
        utterance.rate = chatSettings?.voiceRate || 1.0;
        utterance.pitch = chatSettings?.voicePitch || 1.0;
        if (chatSettings?.voiceId && chatSettings?.voiceId !== 'default' && availableVoices.length > 0) {
          const selectedVoice = availableVoices.find(
            (v) => v.voiceURI === chatSettings.voiceId || v.name === chatSettings.voiceId
          );
          if (selectedVoice) utterance.voice = selectedVoice;
        }
        window.speechSynthesis.speak(utterance);
        if (soundEnabled) {
          try { soundFX.playCosmicSparkle?.(); } catch {}
        }
      } catch (err) {
        console.error('Speech synthesis test failed', err);
      }
    }
  }, [chatSettings, availableVoices, soundEnabled]);

  const handleClearModelCache = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && 'caches' in window) {
        const keys = await caches.keys();
        const modelKeys = keys.filter(
          (k) => k.includes('transformers') || k.includes('onnx') || k.includes('web-llm') || k.includes('model')
        );
        await Promise.all(modelKeys.map((k) => caches.delete(k)));
        setPurgeStatus('Model cache cleared successfully!');
        if (soundEnabled) {
          try { soundFX.playTerminalSuccess?.(); } catch {}
        }
        setTimeout(() => setPurgeStatus(null), 3500);
      }
    } catch {
      setPurgeStatus('Could not clear cache.');
      setTimeout(() => setPurgeStatus(null), 3500);
    }
  }, [soundEnabled]);

  const handlePurgeChatMemory = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('portfolio_ai_chat_history');
        localStorage.removeItem('portfolio_chat_messages');
        localStorage.removeItem('portfolio_ai_session_id');
        window.dispatchEvent(new CustomEvent('ai-chat-memory-purged'));
      }
      setShowPurgeConfirm(false);
      setPurgeStatus('Chat memory wiped clean.');
      if (soundEnabled) {
        try { soundFX.playTerminalSuccess?.(); } catch {}
      }
      setTimeout(() => setPurgeStatus(null), 3500);
    } catch {
      setShowPurgeConfirm(false);
    }
  }, [soundEnabled]);

  const handleExportChatHistory = useCallback((format = 'json') => {
    try {
      let history = [];
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('portfolio_ai_chat_history') || localStorage.getItem('portfolio_chat_messages');
        if (stored) {
          try {
            history = JSON.parse(stored);
          } catch {
            history = [];
          }
        }
      }
      if (!Array.isArray(history) || history.length === 0) {
        history = [
          { role: 'assistant', content: 'Welcome to Atul Verma’s AI Portfolio Assistant.' },
          { role: 'system', content: 'No recorded user messages in active session history.' }
        ];
      }
      let dataStr = '';
      let fileName = '';
      let mimeType = '';
      if (format === 'md') {
        dataStr = '# AI Chat Conversation Transcript\n\n' +
          history.map((m) => `**${m.role === 'user' ? 'User' : 'Assistant'}:**\n${m.content || m.text || ''}\n`).join('\n---\n\n');
        fileName = `chat-history-${Date.now()}.md`;
        mimeType = 'text/markdown';
      } else {
        dataStr = JSON.stringify(history, null, 2);
        fileName = `chat-history-${Date.now()}.json`;
        mimeType = 'application/json';
      }
      const blob = new Blob([dataStr], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      if (soundEnabled) {
        try { soundFX.playTerminalSuccess?.(); } catch {}
      }
    } catch (err) {
      console.error('Export failed', err);
    }
  }, [soundEnabled]);

  const getTemperatureBadge = (temp) => {
    const t = Number(temp ?? 0.7);
    if (t <= 0.2) return 'Deterministic / Code';
    if (t <= 0.8) return 'Balanced';
    return 'Highly Creative';
  };

  const tabs = [
    { id: 'audio', label: 'Audio Studio', icon: Volume2, tag: soundEnabled ? `${Math.round(masterVolume * 100)}%` : 'Muted' },
    { id: 'cursor', label: 'Cursor & Dynamics', icon: Sparkles, tag: customCursorEnabled ? `${cursorScale.toFixed(1)}x` : 'Native' },
    { id: 'hero', label: 'Hero & Character', icon: User, tag: gazeMode === 'fixed' ? 'Fixed' : 'Auto' },
    { id: 'threed', label: '3D Controls', icon: Box, tag: isMaster3DOn ? `${active3DCount}/10 On` : '2D Mode' },
    { id: 'preferences', label: 'Startup & Preferences', icon: Settings, tag: defaultStartupRole },
    { id: 'visuals', label: 'Display & Visuals', icon: Palette, tag: getAccentName(accentColor) },
    { id: 'chat', label: 'AI & Chat Studio', icon: BotMessageSquare, tag: getModelTag() }
  ];

  const tablistRef = useRef(null);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const [, setIsDragging] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollIndicator = useCallback(() => {
    if (!tablistRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = tablistRef.current;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = tablistRef.current;
    if (!el) return;
    updateScrollIndicator();
    const handleScroll = () => updateScrollIndicator();
    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [updateScrollIndicator]);

  useEffect(() => {
    const el = tablistRef.current;
    if (!el) return;
    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Auto-center active tab smoothly on change or mount
  useEffect(() => {
    if (!tablistRef.current) return;
    const activeTabBtn = tablistRef.current.querySelector(`#tab-${activeTab}`);
    if (activeTabBtn) {
      const container = tablistRef.current;
      const tabLeft = activeTabBtn.offsetLeft;
      const tabWidth = activeTabBtn.offsetWidth;
      const containerWidth = container.clientWidth;
      const scrollLeft = tabLeft - (containerWidth / 2) + (tabWidth / 2);
      container.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
    }
    const timer = setTimeout(() => {
      updateScrollIndicator();
    }, 350);
    return () => clearTimeout(timer);
  }, [activeTab, updateScrollIndicator]);

  const handleScrollLeft = () => {
    if (tablistRef.current) {
      tablistRef.current.scrollBy({ left: -160, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (tablistRef.current) {
      tablistRef.current.scrollBy({ left: 160, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX;
    scrollStartRef.current = tablistRef.current ? tablistRef.current.scrollLeft : 0;
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !tablistRef.current) return;
    const delta = e.pageX - startXRef.current;
    if (Math.abs(delta) > 5) {
      hasDraggedRef.current = true;
    }
    tablistRef.current.scrollLeft = scrollStartRef.current - delta;
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 50);
    }
  };

  const handleMouseLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 50);
    }
  };

  const handleTabKeyDown = (e, currentId) => {
    if (mode === 'single') return;
    const tabIds = tabs.map((t) => t.id);
    const currentIndex = tabIds.indexOf(currentId);
    let targetIndex = -1;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      targetIndex = (currentIndex + 1) % tabIds.length;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      targetIndex = (currentIndex - 1 + tabIds.length) % tabIds.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIndex = tabIds.length - 1;
    }

    if (targetIndex !== -1) {
      const nextId = tabIds[targetIndex];
      setActiveTab(nextId);
      if (soundEnabled) soundFX.playHapticClick();
      const tabObj = tabs.find((t) => t.id === nextId);
      if (typeof window !== 'undefined' && tabObj) {
        window.dispatchEvent(
          new CustomEvent('portfolio:announce', {
            detail: { message: `Switched to Control Center tab: ${tabObj.label}`, priority: 'polite' }
          })
        );
      }
      const nextTab = document.getElementById(`tab-${nextId}`);
      nextTab?.focus();
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Tab Navigation Header with Chevrons and Edge Fade Gradients */}
      {mode !== 'single' && !isStandalone && (
      <div className="relative w-full overflow-hidden rounded-2xl group/tabnav">
        {/* Left Edge Fade Gradient & Button */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pr-6 bg-gradient-to-r from-[#FAF8F5] dark:from-[#181226] to-transparent pointer-events-none">
            <button
              type="button"
              aria-label="Scroll tabs left"
              onClick={handleScrollLeft}
              className="p-1.5 rounded-full bg-white/90 dark:bg-[#1D162E]/90 border border-stone-200 dark:border-stone-700 shadow-md text-stone-700 dark:text-stone-300 pointer-events-auto hover:scale-105 active:scale-95 transition-all cursor-pointer ml-1"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tablist Container */}
        <div
          ref={tablistRef}
          role="tablist"
          aria-label="Control Center Tabs"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="flex items-center gap-1.5 overflow-x-auto scroll-smooth no-scrollbar p-1.5 rounded-2xl bg-stone-100/80 dark:bg-[#150F21]/80 border border-stone-200/80 dark:border-stone-800 backdrop-blur-md"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => {
                  if (!hasDraggedRef.current) {
                    setActiveTab(tab.id);
                    if (soundEnabled) soundFX.playHapticClick();
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(
                        new CustomEvent('portfolio:announce', {
                          detail: { message: `Switched to Control Center tab: ${tab.label}`, priority: 'polite' }
                        })
                      );
                    }
                  }
                }}
                onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 select-none cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-[#251B3D] text-[#18181B] dark:text-white shadow-xs border border-stone-200 dark:border-stone-700'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF4D6D]' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.tag && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isActive
                      ? 'bg-[#FF4D6D]/15 text-[#FF4D6D]'
                      : 'bg-stone-200/60 dark:bg-stone-800 text-stone-400'
                  } ${isDrawer ? 'max-w-[80px] truncate' : ''}`}>
                    {tab.tag}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Edge Fade Gradient & Button */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center pl-6 bg-gradient-to-l from-[#FAF8F5] dark:from-[#181226] to-transparent pointer-events-none">
            <button
              type="button"
              aria-label="Scroll tabs right"
              onClick={handleScrollRight}
              className="p-1.5 rounded-full bg-white/90 dark:bg-[#1D162E]/90 border border-stone-200 dark:border-stone-700 shadow-md text-stone-700 dark:text-stone-300 pointer-events-auto hover:scale-105 active:scale-95 transition-all cursor-pointer mr-1"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      )}

      {/* Active Tab Header Popout Banner */}
      {!isStandalone && mode !== 'single' && (
        <div className="flex items-center justify-end px-1 -mt-3 mb-1">
          <button
            type="button"
            onClick={(e) => handlePopoutTab(effectiveActiveTab, e)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Popout Tab to Standalone Window"
            title="Popout Tab to Standalone Window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Popout Tab</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: AUDIO STUDIO                                                       */}
      {/* ========================================================================= */}
      {(effectiveActiveTab === 'audio' || activeTab === 'audio') && (
        <div
          role="tabpanel"
          id="panel-audio"
          aria-labelledby="tab-audio"
          tabIndex={0}
          className="flex flex-col gap-6 focus:outline-none animate-fadeIn"
        >
          {/* Top Controls Card */}
          <div className={`grid ${isDrawer ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'} gap-4`}>
            {/* Master Sound Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${soundEnabled ? 'bg-[#FF4D6D]/10 text-[#FF4D6D]' : 'bg-stone-100 dark:bg-stone-800 text-stone-400'}`}>
                    {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#18181B] dark:text-white">Master Sound</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Zero-latency Web Audio engine</p>
                  </div>
                </div>
                <button
                  role="switch"
                  aria-checked={soundEnabled}
                  onClick={() => {
                    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                    }
                    setSoundEnabled(!soundEnabled);
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]/40 ${
                    soundEnabled ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                      soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800/80">
                <span>Output status:</span>
                <span className={`font-semibold ${soundEnabled ? 'text-emerald-500' : 'text-stone-400'}`}>
                  {soundEnabled ? 'Synthesizer Active' : 'Muted'}
                </span>
              </div>
            </div>

            {/* Volume Slider Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#18181B] dark:text-white">Master Volume</span>
                <span className="text-xs font-mono font-bold text-[#FF4D6D] bg-[#FF4D6D]/10 px-2 py-0.5 rounded-full">
                  {Math.round(masterVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={Math.round(masterVolume * 100)}
                onChange={(e) => setMasterVolume(parseFloat(e.target.value) / 100)}
                className="w-full accent-[#FF4D6D] cursor-pointer"
                aria-label="Master Volume"
              />
              <div className="flex justify-between text-[11px] text-stone-400 dark:text-stone-500">
                <span>0% (Silent)</span>
                <span>80% (Default)</span>
                <span>100%</span>
              </div>
            </div>

            {/* Pitch Multiplier Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-[#18181B] dark:text-white">Pitch Multiplier</span>
                  <p className="text-[11px] text-stone-400 dark:text-stone-500">Deep Bass to Sharp Treble</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#FF4D6D] bg-[#FF4D6D]/10 px-2 py-0.5 rounded-full">
                  {pitchMultiplier.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={pitchMultiplier}
                onChange={(e) => setPitchMultiplier(parseFloat(e.target.value))}
                className="w-full accent-[#FF4D6D] cursor-pointer"
                aria-label="Pitch Multiplier"
              />
              <div className="flex justify-between text-[11px] text-stone-400 dark:text-stone-500">
                <span>0.5x (Bass)</span>
                <span>1.0x (Baseline)</span>
                <span>2.0x (Treble)</span>
              </div>
            </div>
          </div>

          {/* Voice Announcement (Text-to-Speech) Toggle Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${isVoiceAnnouncementOn ? 'bg-[#FF4D6D]/10 text-[#FF4D6D]' : 'bg-stone-100 dark:bg-stone-800 text-stone-400'}`}>
                  {isVoiceAnnouncementOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#18181B] dark:text-white">Voice Announcement (Text-to-Speech)</h4>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                      isVoiceAnnouncementOn ? 'bg-[#FF4D6D]/10 text-[#FF4D6D]' : 'bg-stone-100 dark:bg-stone-800 text-stone-400'
                    }`}>
                      {isVoiceAnnouncementOn ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Speaks role switches, tab transitions, theme changes, keyboard focus (Tab navigation), and screen-reader alerts aloud via Web Speech API (window.speechSynthesis)
                  </p>
                </div>
              </div>
              <button
                role="switch"
                id="switch-voice-announcement"
                aria-checked={isVoiceAnnouncementOn}
                aria-label="Toggle Voice Announcement (Text-to-Speech)"
                onClick={() => handleToggleVoiceAnnouncement(!isVoiceAnnouncementOn)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]/40 ${
                  isVoiceAnnouncementOn ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
                }`}
              >
                <span
                  className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    isVoiceAnnouncementOn ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Sub-option 1: Speak on Keyboard Focus */}
            {isVoiceAnnouncementOn && (
              <div className="pt-3 border-t border-[#E7E2D8]/60 dark:border-[#2D2340]/60 flex items-center justify-between gap-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-semibold text-stone-700 dark:text-stone-300">Speak on Keyboard Focus (Tab / Shift+Tab)</span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">Announces buttons, links, inputs & tabs on focus</span>
                </div>
                <button
                  role="switch"
                  id="switch-voice-focus-announcement"
                  aria-checked={isVoiceFocusOn}
                  aria-label="Toggle Speak on Keyboard Focus"
                  onClick={() => handleToggleVoiceFocus(!isVoiceFocusOn)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]/40 ${
                    isVoiceFocusOn ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
                      isVoiceFocusOn ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Sub-option 2: Mouse Hover Narration */}
            {isVoiceAnnouncementOn && (
              <div className="pt-3 border-t border-[#E7E2D8]/60 dark:border-[#2D2340]/60 flex items-center justify-between gap-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-semibold text-stone-700 dark:text-stone-300">Mouse Hover Narration</span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">Speaks clean element labels when hovering with mouse pointer</span>
                </div>
                <button
                  role="switch"
                  id="switch-voice-hover-announcement"
                  aria-checked={isVoiceHoverOn}
                  aria-label="Toggle Mouse Hover Narration"
                  onClick={() => handleToggleVoiceHover(!isVoiceHoverOn)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]/40 ${
                    isVoiceHoverOn ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
                      isVoiceHoverOn ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            )}
          </div>

          {/* Sound Matching Mode Selector */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#FF4D6D]" />
                  <span>Sound Matching Mode</span>
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Choose how cursor selection and micro-interactions acoustic feedback are synthesized
                </p>
              </div>
              <div className="flex p-1 bg-stone-100 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700/80 gap-1">
                <button
                  type="button"
                  onClick={() => setSoundMatchingMode('dynamic')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    soundMatchingMode === 'dynamic'
                      ? 'bg-[#FF4D6D] text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-[#18181B] dark:hover:text-white'
                  }`}
                >
                  Dynamic Matching
                </button>
                <button
                  type="button"
                  onClick={() => setSoundMatchingMode('universal')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    soundMatchingMode === 'universal'
                      ? 'bg-[#FF4D6D] text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-[#18181B] dark:hover:text-white'
                  }`}
                >
                  Universal Voice
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#120D1D]/60 border border-stone-200/70 dark:border-stone-800/70 text-xs text-stone-600 dark:text-stone-400">
              {soundMatchingMode === 'dynamic' ? (
                <span>
                  <strong>Dynamic Matching:</strong> Distinct sound profiles per cursor variant (Camera = mechanical shutter, Laser = focus sweep, Butterfly = cosmic sparkle, Pop = bubble plop, Airplane = ribbon glide).
                </span>
              ) : (
                <span>
                  <strong>Universal Voice:</strong> Plays a consistent, subtle crystalline chime across every cursor interaction for a uniform, minimal sonic atmosphere.
                </span>
              )}
            </div>
          </div>

          {/* 7 Acoustic Preview Buttons */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#FF4D6D]" />
                  <span>Acoustic Preview Soundboard</span>
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Audition the 7 synthesized micro-tones with active master volume & pitch applied
                </p>
              </div>
              <span className="text-xs text-stone-400">7 Tones</span>
            </div>

            <div className={`grid ${isDrawer ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'} gap-3`}>
              {SOUNDBOARD_SOUNDS.map((snd) => {
                const Icon = SOUND_ICONS[snd.id] || Bell;
                return (
                  <button
                    key={snd.id}
                    type="button"
                    onClick={() => {
                      soundFX.init();
                      snd.play();
                    }}
                    className="flex flex-col items-start p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-[#201830]/60 hover:bg-[#FF4D6D]/10 hover:border-[#FF4D6D]/40 transition-all text-left group cursor-pointer active:scale-97"
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="p-2 rounded-lg bg-white dark:bg-stone-800 text-[#FF4D6D] group-hover:bg-[#FF4D6D] group-hover:text-white transition-colors shadow-2xs">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono text-stone-400 group-hover:text-[#FF4D6D]">
                        PLAY ▶
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#18181B] dark:text-white group-hover:text-[#FF4D6D]">
                      {snd.name}
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
                      {snd.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CURSOR & DYNAMICS                                                  */}
      {/* ========================================================================= */}
      {(effectiveActiveTab === 'cursor' || activeTab === 'cursor') && (
        <div
          role="tabpanel"
          id="panel-cursor"
          aria-labelledby="tab-cursor"
          tabIndex={0}
          className="flex flex-col gap-6 focus:outline-none animate-fadeIn"
        >
          {/* Custom Cursor On/Off Master Toggle Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${customCursorEnabled ? 'bg-[#FF4D6D]/10 text-[#FF4D6D]' : 'bg-stone-100 dark:bg-stone-800 text-stone-400'}`}>
                <MousePointer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#18181B] dark:text-white">Custom Interactive Cursor</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {customCursorEnabled
                    ? 'Kinematic 60-120 FPS cursor with stardust trail active'
                    : 'Unmounted cleanly; native browser OS pointer restored everywhere'}
                </p>
              </div>
            </div>
            <button
              role="switch"
              aria-checked={customCursorEnabled}
              onClick={() => setCustomCursorEnabled(!customCursorEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]/40 ${
                customCursorEnabled ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
              }`}
            >
              <span
                className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                  customCursorEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className={`grid ${isDrawer ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
            {/* Global Scale Multiplier */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#18181B] dark:text-white">Global Scale Multiplier</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">Applies across all 35 cursor variants</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#FF4D6D] bg-[#FF4D6D]/10 px-2 py-0.5 rounded-full">
                  {cursorScale.toFixed(2)}x ({Math.round(38 * cursorScale)}px)
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={cursorScale}
                onChange={(e) => setCursorScale(parseFloat(e.target.value))}
                className="w-full accent-[#FF4D6D] cursor-pointer"
                aria-label="Cursor Scale Multiplier"
              />
              <div className="flex justify-between text-[11px] text-stone-400 dark:text-stone-500">
                <span>0.5x (Delicate)</span>
                <span>1.0x (Default)</span>
                <span>2.0x (Grand)</span>
              </div>
            </div>

            {/* Flight Lerp Kinematics (Dreamy / Natural / Snappy) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-[#18181B] dark:text-white">Flight Lerp Kinematics</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">Exponential smoothing responsiveness</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'dreamy', label: 'Dreamy', sub: 'High inertia', icon: '🕊️' },
                  { key: 'natural', label: 'Natural', sub: 'Organic lerp', icon: '🦋' },
                  { key: 'snappy', label: 'Snappy', sub: 'Instant snap', icon: '⚡' }
                ].map((item) => {
                  const isActive = flightLerpSpeed === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        setFlightLerpSpeed(item.key);
                        if (soundEnabled) soundFX.playHapticClick();
                      }}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#FF4D6D]/10 border-[#FF4D6D] text-[#FF4D6D] shadow-xs'
                          : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <span className="text-base mb-1">{item.icon}</span>
                      <span className="text-xs font-bold">{item.label}</span>
                      <span className="text-[10px] opacity-70">{item.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stardust Particle Trail & Palette */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${stardustTrailEnabled ? 'bg-[#FF4D6D]/10 text-[#FF4D6D]' : 'bg-stone-100 dark:bg-stone-800 text-stone-400'}`}>
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#18181B] dark:text-white">Stardust Particle Trail</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Velocity-driven additive particle shimmer on pointer movement
                  </p>
                </div>
              </div>
              <button
                role="switch"
                aria-checked={stardustTrailEnabled}
                onClick={() => setStardustTrailEnabled(!stardustTrailEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]/40 ${
                  stardustTrailEnabled ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
                }`}
              >
                <span
                  className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    stardustTrailEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Particle Color Palette */}
            <div>
              <label className="text-xs font-bold text-stone-600 dark:text-stone-400 block mb-2">
                Stardust Color Palette
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {PRESET_COLORS.map((c) => {
                  const isSelected = particleColor.toLowerCase() === c.hex.toLowerCase();
                  return (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => {
                        setParticleColor(c.hex);
                        if (soundEnabled) soundFX.playSparkle();
                      }}
                      title={c.name}
                      className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#FF4D6D] bg-[#FF4D6D]/10 text-[#18181B] dark:text-white'
                          : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full shadow-xs border border-black/10 dark:border-white/20"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-xs font-medium">{c.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#FF4D6D]" />}
                    </button>
                  );
                })}

                {/* Custom Color Input */}
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
                  <input
                    type="color"
                    value={particleColor}
                    onChange={(e) => setParticleColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                    title="Custom Color Picker"
                  />
                  <input
                    type="text"
                    value={particleColor.toUpperCase()}
                    onChange={(e) => setParticleColor(e.target.value)}
                    maxLength={7}
                    className="w-18 text-xs font-mono font-bold bg-transparent text-[#18181B] dark:text-white uppercase focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: HERO & CHARACTER CONTROL                                           */}
      {/* ========================================================================= */}
      {(effectiveActiveTab === 'hero' || activeTab === 'hero') && (
        <div
          role="tabpanel"
          id="panel-hero"
          aria-labelledby="tab-hero"
          tabIndex={0}
          className="flex flex-col gap-6 focus:outline-none animate-fadeIn"
        >
          {/* Row 1: Gaze Tracking Mode & Parallax Tilt Dynamics */}
          <div className={`grid ${isDrawer ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
            {/* Gaze Tracking Mode */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#FF4D6D]" />
                  <span>2.5D Gaze Tracking Mode</span>
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Controls dynamic cursor and mobile gyroscope 3D tracking
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setGazeMode('auto');
                    if (soundEnabled) soundFX.playLaserFocus();
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    gazeMode === 'auto'
                      ? 'bg-[#FF4D6D]/10 border-[#FF4D6D] text-[#FF4D6D] font-bold shadow-xs'
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <Eye className="w-4 h-4 mb-0.5" />
                  <span className="text-xs">Auto Gaze Follow</span>
                  <span className="text-[10px] opacity-70">Tracks pointer & gyro</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGazeMode('fixed');
                    if (soundEnabled) soundFX.playLaserFocus();
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    gazeMode === 'fixed'
                      ? 'bg-[#FF4D6D]/10 border-[#FF4D6D] text-[#FF4D6D] font-bold shadow-xs'
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <Crosshair className="w-4 h-4 mb-0.5" />
                  <span className="text-xs">Static Fixed Gaze</span>
                  <span className="text-[10px] opacity-70">Pins to center/override</span>
                </button>
              </div>
            </div>

            {/* Parallax Tilt Dynamics Toggle */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${parallaxTiltEnabled ? 'bg-[#FF4D6D]/10 text-[#FF4D6D]' : 'bg-stone-100 dark:bg-stone-800 text-stone-400'}`}>
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#18181B] dark:text-white">Cursor Parallax & Tilt</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Physical stage shift & depth perspective</p>
                  </div>
                </div>
                <button
                  role="switch"
                  aria-checked={parallaxTiltEnabled}
                  onClick={() => {
                    setParallaxTiltEnabled(!parallaxTiltEnabled);
                    if (soundEnabled) soundFX.playHapticClick();
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]/40 ${
                    parallaxTiltEnabled ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                  aria-label="Toggle Cursor Parallax and Tilt"
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                      parallaxTiltEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800/80">
                {parallaxTiltEnabled
                  ? 'Active: Stage translates smoothly with cursor movement and mobile gyroscope for cinematic depth.'
                  : 'Locked: Stage and backdrop remain static at baseline position without directional displacement.'}
              </p>
            </div>
          </div>

          {/* Row 2: Character Zoom & Zoom Focus Anchor */}
          <div className={`grid ${isDrawer ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
            {/* Character Stage Zoom Slider */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#FF4D6D]" />
                    <span>Character Stage Zoom</span>
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Scale multiplier applied directly to the 2.5D character container
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#FF4D6D] bg-[#FF4D6D]/10 px-2 py-0.5 rounded-full">
                  {(characterZoom * 100).toFixed(0)}% ({characterZoom.toFixed(2)}x)
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={characterZoom}
                onChange={(e) => setCharacterZoom(parseFloat(e.target.value))}
                className="w-full accent-[#FF4D6D] cursor-pointer"
                aria-label="Character Stage Zoom"
              />
              <div className="flex justify-between text-[11px] text-stone-400 dark:text-stone-500">
                <span>50% (Wide View)</span>
                <span>100% (Default)</span>
                <span>200% (Close Portrait)</span>
              </div>
            </div>

            {/* Zoom Focus Anchor (Head / Center / Feet) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#FF4D6D]" />
                    <span>Zoom Focus Anchor</span>
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Pivot origin when scaling character in and out
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#FF4D6D] bg-[#FF4D6D]/10 px-2 py-0.5 rounded-full capitalize">
                  {zoomFocus === 'head' ? '50% 18%' : zoomFocus === 'feet' ? '50% 90%' : '50% 50%'}
                </span>
              </div>

              {/* 3-Button Segmented Control */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'head', label: 'Head', sub: 'Upper (50% 18%)', icon: User },
                  { id: 'center', label: 'Center', sub: 'Default (50% 50%)', icon: Crosshair },
                  { id: 'feet', label: 'Feet', sub: 'Ground (50% 90%)', icon: Footprints }
                ].map((item) => {
                  const isSelected = zoomFocus === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setZoomFocus(item.id);
                        if (soundEnabled) soundFX.playLaserFocus();
                      }}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FF4D6D]/10 border-[#FF4D6D] text-[#FF4D6D] font-bold shadow-xs'
                          : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                      title={`Scale anchor: ${item.sub}`}
                    >
                      <Icon className="w-4 h-4 mb-0.5" />
                      <div className="flex items-center gap-1">
                        <span className="text-xs">{item.label}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#FF4D6D]" />}
                      </div>
                      <span className="text-[9px] opacity-70 leading-none">{item.sub.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 3: Drag & Drop Physics Controls */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                  <Move className="w-4 h-4 text-[#FF4D6D]" />
                  <span>Character Drag & Drop Controls</span>
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Interactive physics, coordinate boundaries, and position manipulation
                </p>
              </div>

              {/* Recenter Action Button */}
              <button
                type="button"
                onClick={() => {
                  recenterCharacter();
                  if (soundEnabled) soundFX.playSnap();
                }}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#FF4D6D]/10 dark:bg-stone-800/80 dark:hover:bg-[#FF4D6D]/20 text-[#18181B] dark:text-stone-200 hover:text-[#FF4D6D] border border-stone-200 dark:border-stone-700 hover:border-[#FF4D6D]/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs"
                title="Reset character coordinates back to center (0, 0)"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#FF4D6D]" />
                <span>Recenter to (0, 0)</span>
              </button>
            </div>

            <div className={`grid ${isDrawer ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-3 pt-2 border-t border-stone-100 dark:border-stone-800/80`}>
              {/* 1. Drag Enabled Toggle */}
              <div className="p-3 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#18181B] dark:text-white">Enable Dragging</span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">Hold 250ms to lift & reposition</span>
                </div>
                <button
                  role="switch"
                  aria-checked={dragEnabled}
                  onClick={() => {
                    setDragEnabled(!dragEnabled);
                    if (soundEnabled) soundFX.playHapticClick();
                  }}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer focus:outline-none shrink-0 ${
                    dragEnabled ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                  aria-label="Toggle Character Dragging"
                >
                  <span
                    className={`block w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
                      dragEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* 2. Boundary Constrained Toggle */}
              <div className={`p-3 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 flex items-center justify-between gap-3 transition-opacity ${!dragEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#18181B] dark:text-white">Clamp to Viewport</span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    {dragBoundaryConstrained ? 'Constrained to stage' : 'Free unconstrained drag'}
                  </span>
                </div>
                <button
                  role="switch"
                  aria-checked={dragBoundaryConstrained}
                  disabled={!dragEnabled}
                  onClick={() => {
                    setDragBoundaryConstrained(!dragBoundaryConstrained);
                    if (soundEnabled) soundFX.playHapticClick();
                  }}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer focus:outline-none shrink-0 ${
                    dragBoundaryConstrained ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                  aria-label="Toggle Viewport Boundary Clamping"
                >
                  <span
                    className={`block w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
                      dragBoundaryConstrained ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* 3. Auto Snap Back on Drop Toggle */}
              <div className={`p-3 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 flex items-center justify-between gap-3 transition-opacity ${!dragEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#18181B] dark:text-white">Auto Snap Back</span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    {dragAutoSnapBack ? 'Springs to center on drop' : 'Stays where dropped'}
                  </span>
                </div>
                <button
                  role="switch"
                  aria-checked={dragAutoSnapBack}
                  disabled={!dragEnabled}
                  onClick={() => {
                    setDragAutoSnapBack(!dragAutoSnapBack);
                    if (soundEnabled) soundFX.playHapticClick();
                  }}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer focus:outline-none shrink-0 ${
                    dragAutoSnapBack ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                  aria-label="Toggle Auto Snap Back on Drop"
                >
                  <span
                    className={`block w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
                      dragAutoSnapBack ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Row 4: Polaroid Camera Flash & Confetti */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${flashConfettiEnabled ? 'bg-[#FF4D6D]/10 text-[#FF4D6D]' : 'bg-stone-100 dark:bg-stone-800 text-stone-400'}`}>
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#18181B] dark:text-white">Polaroid Flash & Particle Confetti</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">On Polaroid "Shoot a look 📸" button click</p>
                </div>
              </div>
              <button
                role="switch"
                aria-checked={flashConfettiEnabled}
                onClick={() => {
                  setFlashConfettiEnabled(!flashConfettiEnabled);
                  if (soundEnabled) soundFX.playHapticClick();
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]/40 ${
                  flashConfettiEnabled ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
                }`}
                aria-label="Toggle Camera Flash and Confetti"
              >
                <span
                  className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    flashConfettiEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800/80">
              {flashConfettiEnabled
                ? 'Captures snapshot with authentic Polaroid white flash burst and celebratory particle confetti.'
                : 'Captures snapshot quietly with audio shutter click only; suppresses bright screen flash and confetti.'}
            </p>
          </div>

          {/* 10 3D Head Pose Overrides */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#FF4D6D]" />
                  <span>3D Head Pose Overrides</span>
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Instantly preview or lock any of the 10 verified photorealistic character angles
                </p>
              </div>
              <span className="text-xs text-stone-400">
                {poseOverride !== null ? `Pose ${poseOverride}: ${POSE_INDEX_MAP[poseOverride]}` : 'Dynamic Auto'}
              </span>
            </div>

            <div className={`grid ${isDrawer ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'} gap-2.5`}>
              {POSE_BUTTONS.map((item) => {
                const isSelected = poseOverride === item.index;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setPoseOverride(item.index);
                      if (soundEnabled) soundFX.playLaserFocus();
                    }}
                    className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF4D6D]/10 border-[#FF4D6D] text-[#FF4D6D] shadow-xs font-bold'
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-semibold">{item.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#FF4D6D]" />}
                    </div>
                    <span className="text-[10px] text-stone-400 dark:text-stone-500 line-clamp-1">
                      {item.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* TAB 3D: NEXT-LEVEL 3D CONTROL SUITE (9 SECTIONS ACROSS 3 CLUSTERS)        */}
      {/* ========================================================================= */}
      {(effectiveActiveTab === 'threed' || activeTab === 'threed') && (
        <div
          role="tabpanel"
          id="panel-threed"
          aria-labelledby="tab-threed"
          tabIndex={0}
          style={{
            '--3d-lighting-angle': `${lighting?.angle ?? 45}deg`,
            '--3d-depth-intensity': `${depthIntensity ?? 1.0}`,
            '--3d-materials-bevel': `${materials?.bevelExtrusion ?? 3}px`,
            '--3d-specular-glow': `${materials?.specularGlow ?? 0.6}`
          }}
          className="flex flex-col gap-6 focus:outline-none animate-fadeIn"
        >
          {/* 3D Studio Architecture & State Isolation Bar (Phase 1) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-stone-50 to-white dark:from-[#181226] dark:to-[#1f1730] border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs">
            <div className="flex items-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                  isLive3DApplied
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-sm shadow-emerald-500/10'
                    : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                }`}
              >
                {isLive3DApplied ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Mode: Live Applied</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                    <span>Mode: Sandbox Isolated</span>
                  </>
                )}
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 hidden md:inline">
                {isLive3DApplied
                  ? '3D custom properties active on live portfolio DOM'
                  : '3D parameters isolated exclusively to sandbox previews'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ThreeDActionKeycap
                onClick={() => {
                  if (isLive3DApplied) {
                    revertLivePortfolio();
                    if (soundEnabled) soundFX.playHapticClick();
                  } else {
                    applyToLivePortfolio();
                    if (soundEnabled) soundFX.playCrystalChime();
                  }
                }}
                icon={Radio}
                label={isLive3DApplied ? 'Live Active (Click to Revert)' : 'Apply to Live Portfolio'}
                variant={isLive3DApplied ? 'emerald' : 'default'}
                active={isLive3DApplied}
                ariaLabel={isLive3DApplied ? 'Revert live portfolio 3D' : 'Apply 3D settings to live portfolio'}
                isVisualOnly={isTab3DActive}
              />

              <ThreeDActionKeycap
                onClick={() => {
                  reset3DDefaults();
                  if (soundEnabled) soundFX.playCrystalChime();
                }}
                icon={RotateCcw}
                label="Reset Sandbox"
                variant="default"
                ariaLabel="Reset Sandbox to defaults"
                isVisualOnly={isTab3DActive}
              />
            </div>
          </div>
          {/* 2. Interactive Mini 3D Sandbox Preview Card (Universal Top Mini-DOM Replica - Phase 2) */}
          <div className="rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] bg-white/70 dark:bg-[#181226]/70 backdrop-blur-md overflow-hidden shadow-xs transition-all w-full">
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#ECE7DF]/70 dark:border-[#2D2340]/70 bg-white/80 dark:bg-[#1D162E]/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center font-bold text-sm">
                  <Maximize2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h5 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white">
                      Interactive 3D Sandbox Preview
                    </h5>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                      Live Simulation
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                      Universal Portfolio Replica
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Universal interactive Mini-DOM replica demonstrating live 3D perspective, tilt, shadow falloff, atmosphere &amp; exploded layers
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShow3DSandbox(!showSandboxPreview);
                  if (soundEnabled) soundFX.playHapticClick();
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
                  showSandboxPreview
                    ? 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-600'
                    : 'bg-gradient-to-r from-cyan-500/15 via-[#FF4D6D]/15 to-purple-500/15 hover:from-cyan-500/25 hover:to-purple-500/25 text-[#18181B] dark:text-white border-cyan-500/40 shadow-cyan-500/10'
                }`}
                title={showSandboxPreview ? 'Hide Sandbox Viewport' : 'Show 3D Sandbox (Unhide)'}
                aria-label={showSandboxPreview ? 'Hide Sandbox' : 'Show Sandbox'}
              >
                {showSandboxPreview ? <EyeOff className="w-4 h-4 text-stone-500" /> : <Eye className="w-4 h-4 text-cyan-500 animate-pulse" />}
                <span>{showSandboxPreview ? 'Hide Sandbox' : 'Show 3D Sandbox (Unhide)'}</span>
              </button>
            </div>

            {showSandboxPreview && (
              <div className="p-4 sm:p-6 flex flex-col gap-4">
                {/* Top Toolbar Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-[#150F21]/80 border border-stone-200/70 dark:border-stone-800 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                      <Sparkles className="w-3 h-3 text-cyan-500 animate-pulse" />
                      <span>Universal Portfolio Replica</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Orientation Readout */}
                    <div className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 text-stone-600 dark:text-stone-300">
                      Rot: {sandboxTilt.rotX}°, {sandboxTilt.rotY}° | Light: {lighting?.angle ?? 45}°
                    </div>

                    {/* Wireframe / CAD Mode Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        set3DExploded({ blueprintMode: !exploded.blueprintMode });
                        if (soundEnabled) soundFX.playLaserFocus();
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-xs font-semibold border transition-all cursor-pointer shadow-2xs active:scale-95 ${
                        exploded.blueprintMode
                          ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-500/50 shadow-cyan-500/10'
                          : 'bg-white hover:bg-stone-50 text-stone-600 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700'
                      }`}
                      title={exploded.blueprintMode ? 'Disable CAD Blueprint' : 'Enable CAD Blueprint'}
                      aria-label="Toggle CAD Wireframe Mode"
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{exploded.blueprintMode ? 'CAD Active' : 'CAD Wireframe'}</span>
                    </button>

                    {/* Quick Reset Orientation */}
                    <button
                      type="button"
                      onClick={() => {
                        resetSandboxView();
                        if (soundEnabled) soundFX.playHapticClick();
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-stone-50 text-stone-600 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 font-mono text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
                      title="Reset Sandbox Orientation"
                      aria-label="Reset Orientation button"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
                      <span className="hidden sm:inline">Reset</span>
                    </button>
                  </div>
                </div>

                {/* Living Universal Mini-DOM Portfolio Sandbox */}
                <UniversalMiniPortfolio
                  className="w-full"
                  showControls={false}
                  sandboxTilt={sandboxTilt}
                  onPointerDown={handleSandboxPointerDown}
                  onPointerMove={handleSandboxPointerMove}
                  onPointerUp={handleSandboxPointerUp}
                  onResetOrientation={resetSandboxView}
                  wireframeActive={exploded.blueprintMode}
                  onToggleWireframe={(val) => set3DExploded({ blueprintMode: val })}
                  highlightedComponent={highlightedComponent}
                  onHighlightComponent={setHighlightedComponent}
                />

                {/* Sandbox Footer & Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                    <span className={`w-2 h-2 rounded-full ${isMaster3DOn ? 'bg-emerald-500 animate-ping' : 'bg-stone-400'}`} />
                    <span>{isMaster3DOn ? 'Active 3D Mode' : '2D Flat Mode'}</span>
                    {exploded.enabled && (
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded-md border border-cyan-500/20 hidden sm:inline">
                        BASE CHASSIS [STRATA -01]
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={resetSandboxView}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
                    <span>Reset Orientation</span>
                  </button>
                </div>
              </div>
            )}
          </div>

                    {/* Phase 3: Desktop 2-Column Responsive Split & Sticky Sandbox Container */}
          <div className={isDrawer ? "flex flex-col gap-4" : "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"}>
            {!isDrawer && (
              <div className="lg:col-span-5 xl:col-span-5 sticky top-6 self-start">
                <StickySandboxColumn
                  activePreviewTab={activePreviewTab}
                  onSelectTab={setActivePreviewTab}
                  interactive={true}
                  sandboxTilt={sandboxTilt}
                  onResetOrientation={resetSandboxView}
                  isAutoSwitchPaused={isAutoSwitchPaused}
                  onResumeAutoSwitch={resumeAutoSwitch}
                  highlightedComponent={highlightedComponent}
                  onHighlightComponent={setHighlightedComponent}
                  soundEnabled={soundEnabled}
                />
              </div>
            )}

            <div className={isDrawer ? "flex flex-col gap-4" : "lg:col-span-7 xl:col-span-7 flex flex-col gap-4"}>
              {/* TOP MASTER TOGGLES ROW (2 Columns in Desktop mode, No extra scrolling needed) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Column 1: Master 3D Mode (World/Portfolio 3D) */}
                <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex items-center justify-between gap-3 transition-all hover:border-[#FF4D6D]/30 min-h-[52px]">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Box className="w-4 h-4 text-[#FF4D6D] shrink-0" />
                      <h4 className="text-xs sm:text-sm font-bold text-[#18181B] dark:text-white truncate" title="Master 3D Mode">
                        <span>Master 3D Mode</span>
                      </h4>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 transition-all ${
                        isMaster3DOn
                          ? 'bg-[#FF4D6D]/15 text-[#FF4D6D] border-[#FF4D6D]/30'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-500 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {isMaster3DOn ? '3D Active' : 'Classic 2D'}
                    </span>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={isMaster3DOn}
                    aria-label="Master 3D Mode Toggle"
                    onClick={() => {
                      setMaster3D(!isMaster3DOn);
                      if (soundEnabled) soundFX.playShutterClick();
                    }}
                    className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]/40 shrink-0 self-center ${
                      isMaster3DOn ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                        isMaster3DOn ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Column 2: Master 3D Tab UI Mode (Zero-Text Visuals vs 2D Text) */}
                <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#FF4D6D]/10 via-white/95 to-[#FF4D6D]/5 dark:from-[#FF4D6D]/15 dark:via-[#181226]/95 dark:to-[#2A162B] border-2 border-[#FF4D6D]/40 shadow-xs flex items-center justify-between gap-3 transition-all hover:border-[#FF4D6D]/60 min-h-[52px]">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Sparkles className="w-4 h-4 text-[#FF4D6D] shrink-0 animate-pulse" />
                      <h4 className="text-xs sm:text-sm font-bold text-[#18181B] dark:text-white truncate" title="3D Visual Keycaps">
                        <span>3D Visual Keycaps</span>
                      </h4>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 transition-all ${
                        isTab3DActive
                          ? 'bg-[#FF4D6D] text-white border-[#FF4D6D] shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                      }`}
                    >
                      {isTab3DActive ? 'Visual 3D' : 'Classic 2D'}
                    </span>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={isTab3DActive}
                    aria-label="Master 3D Tab UI Mode Toggle"
                    onClick={() => {
                      if (typeof toggleTabUI3DMode === 'function') {
                        toggleTabUI3DMode();
                      } else if (typeof toggle3DVisualMode === 'function') {
                        toggle3DVisualMode();
                      } else if (typeof setTabUI3DMode === 'function') {
                        setTabUI3DMode(!isTab3DActive);
                      }
                      if (soundEnabled) soundFX.playShutterClick();
                    }}
                    className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]/50 shadow-inner shrink-0 self-center ${
                      isTab3DActive ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                        isTab3DActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* 1. Master 3D Actions & Global Theme Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col gap-4">

            {/* Quick Master Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-stone-100 dark:border-stone-800/80">
              <ThreeDActionKeycap
                onClick={() => {
                  enableAll3D();
                  if (soundEnabled) soundFX.playLaserFocus();
                }}
                icon={ToggleRight}
                label="Enable All 3D"
                variant="primary"
                ariaLabel="Enable 3D on all portfolio elements"
                isVisualOnly={isTab3DActive}
              />

              <ThreeDActionKeycap
                onClick={() => {
                  disableAll3D();
                  if (soundEnabled) soundFX.playHapticClick();
                }}
                icon={ToggleLeft}
                label="Disable All 2D"
                variant="default"
                ariaLabel="Revert all elements to 2D flat mode"
                isVisualOnly={isTab3DActive}
              />

              <ThreeDActionKeycap
                onClick={() => {
                  reset3DDefaults();
                  if (soundEnabled) soundFX.playCrystalChime();
                }}
                icon={RotateCcw}
                label="Reset Defaults"
                variant="default"
                ariaLabel="Reset 3D settings to defaults"
                isVisualOnly={isTab3DActive}
              />

              <div className="ml-auto flex items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-stone-500 font-medium">Active:</span>
                  <span className="text-xs font-mono font-bold text-[#FF4D6D] bg-[#FF4D6D]/10 px-2 py-0.5 rounded-full border border-[#FF4D6D]/20">
                    {active3DCount} / 10 Elements
                  </span>
                </div>
              </div>
            </div>

            {/* Master Theme Presets */}
            <div className="flex flex-col gap-2.5 pt-3 border-t border-stone-100 dark:border-stone-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF4D6D]" />
                    <span>3D Master Theme Architecture</span>
                  </h5>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Unified spatial aesthetic configuring materials, lighting &amp; shadows simultaneously
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {THREED_MASTER_THEMES.map((th) => {
                  const isSelected = currentMasterTheme === th.id;
                  const Icon = th.icon;
                  return (
                    <ThreeDPresetCard
                      key={th.id}
                      isSelected={isSelected}
                      isVisualOnly={isVisual3DOnly}
                      lightingAngle={lighting?.angle ?? 45}
                      depthIntensity={depthIntensity ?? 1.0}
                      bevelExtrusion={materials?.bevelExtrusion ?? 3}
                      onClick={() => {
                        set3DTheme(th.id);
                        if (soundEnabled) soundFX.playLaserFocus();
                      }}
                      title={th.name}
                      desc={th.desc}
                      badge={th.badge}
                      icon={Icon}
                      visualPreview={
                        <ThemeExtrudedSlab
                          themeId={th.id}
                          lightingAngle={lighting?.angle ?? 45}
                          depthIntensity={depthIntensity ?? 1.0}
                          bevelExtrusion={materials?.bevelExtrusion ?? 3}
                        />
                      }
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Top Cluster Filter Bar */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-stone-100/80 dark:bg-[#150F21]/80 border border-stone-200/80 dark:border-stone-800 backdrop-blur-md overflow-x-auto">
            {THREED_CLUSTERS.map((cluster) => {
              const isActive = (clusterFilter || 'all') === cluster.id;
              return (
                <button
                  key={cluster.id}
                  type="button"
                  onClick={() => {
                    set3DClusterFilter(cluster.id);
                    if (soundEnabled) soundFX.playHapticClick();
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-[#251B3D] text-[#18181B] dark:text-white shadow-xs border border-stone-200 dark:border-stone-700'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  <span>{cluster.label}</span>
                </button>
              );
            })}
          </div>

          {/* 4. The 9 Detailed Single-Accordion Sections */}
          <div className="flex flex-col gap-4">
            {/* ========================================================================= */}
            {/* ACCORDION SECTION 1: ELEMENT 3D CONVERSION TOGGLES (10 ELEMENTS)         */}
            {/* ========================================================================= */}
            {isSectionVisible('elements') && (
              <div className="rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] bg-white/70 dark:bg-[#181226]/70 backdrop-blur-md overflow-hidden shadow-xs transition-all">
                <button
                  type="button"
                  onClick={() => toggleAccordionSection('elements')}
                  aria-expanded={expandedAccordion === 'elements'}
                  className="w-full flex items-center justify-between p-4 sm:p-5 bg-white/85 dark:bg-[#1D162E]/85 hover:bg-stone-50 dark:hover:bg-[#251B3D] transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#FF4D6D]/15 text-[#FF4D6D] flex items-center justify-center font-bold text-sm">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white">
                        Element 3D Conversion Toggles (10 Elements)
                      </h5>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Granular control over 10 individual UI components across navigation, identity and layout
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      active3DCount > 0
                        ? 'bg-[#FF4D6D]/15 text-[#FF4D6D] border-[#FF4D6D]/30'
                        : 'bg-stone-200/60 dark:bg-stone-800 text-stone-400 border-stone-200 dark:border-stone-700'
                    }`}>
                      {active3DCount} of 10 Elements 3D
                    </span>
                    {expandedAccordion === 'elements' ? (
                      <ChevronUp className="w-5 h-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                </button>

                {expandedAccordion === 'elements' && (
                  <div className="p-4 sm:p-5 border-t border-[#ECE7DF] dark:border-[#2D2340] flex flex-col gap-6 animate-fadeIn">
                    {THREED_CATEGORIES.map((cat) => {
                      const activeCount = cat.items.filter((it) => current3DElements[it.key]).length;
                      const isCatOpen = Boolean(expandedCategories[cat.id]);
                      const isCategoryTargeted = isComponentHighlighted(cat.id);

                      return (
                        <div
                          key={cat.id}
                          className="rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/50 dark:bg-[#1D162E]/50 overflow-hidden"
                        >
                          <button
                            type="button"
                            onClick={() => toggleCategory(cat.id)}
                            onMouseEnter={() => setHighlightedComponent(cat.id)}
                            onMouseLeave={() => setHighlightedComponent(null)}
                            onFocus={() => setHighlightedComponent(cat.id)}
                            onBlur={() => setHighlightedComponent(null)}
                            aria-expanded={isCatOpen}
                            className={`w-full flex items-center justify-between p-3.5 bg-stone-50/80 dark:bg-[#231A38]/80 hover:bg-stone-100/80 dark:hover:bg-[#281D40] transition-colors cursor-pointer text-left ${
                              isCategoryTargeted ? 'ring-2 ring-[#FF4D6D]/60 ring-inset bg-[#FF4D6D]/5' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-lg bg-[#FF4D6D]/15 text-[#FF4D6D] flex items-center justify-center font-bold text-xs">
                                {cat.num}
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h6 className="text-xs sm:text-sm font-bold text-[#18181B] dark:text-white">
                                    {cat.title}
                                  </h6>
                                  {isCategoryTargeted && (
                                    <span
                                      data-testid="targeted-in-preview-badge"
                                      className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF4D6D]/15 text-[#FF4D6D] border border-[#FF4D6D]/30 animate-pulse shadow-xs"
                                    >
                                      [Targeted in Preview]
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                                  {cat.desc}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono text-stone-500">
                                {activeCount} / {cat.items.length} Active
                              </span>
                              {isCatOpen ? (
                                <ChevronUp className="w-4 h-4 text-stone-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-stone-400" />
                              )}
                            </div>
                          </button>

                          {isCatOpen && (
                            <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2.5 bg-stone-50/30 dark:bg-[#1A1329]/30">
                              {cat.items.map((item) => {
                                const isItemOn = Boolean(current3DElements[item.key]);
                                const ItemIcon = item.icon;

                                return (
                                  <div
                                    key={item.key}
                                    onMouseEnter={() => setHighlightedComponent(cat.id === 'containers' ? 'showcase' : cat.id)}
                                    onMouseLeave={() => setHighlightedComponent(null)}
                                    onFocus={() => setHighlightedComponent(cat.id === 'containers' ? 'showcase' : cat.id)}
                                    onBlur={() => setHighlightedComponent(null)}
                                    className={`p-2.5 sm:p-3 min-h-[58px] sm:min-h-[62px] h-[58px] sm:h-[62px] rounded-xl border transition-all flex items-center justify-between gap-3 active:translate-y-[1px] ${
                                      isCategoryTargeted ? 'ring-1 ring-[#FF4D6D]/40' : ''
                                    } ${
                                      isItemOn
                                        ? 'bg-[#FF4D6D]/10 border-[#FF4D6D]/40 text-[#18181B] dark:text-white shadow-[0_3px_0_0_#D93856]'
                                        : 'bg-white/60 dark:bg-[#1F1733]/60 border-stone-200/70 dark:border-stone-800 text-stone-600 dark:text-stone-400 shadow-[0_3px_0_0_#D1CBC1] dark:shadow-[0_3px_0_0_#140D20]'
                                    }`}
                                    title={`${item.title}: ${item.desc}`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div className={`${
                                        isVisual3DOnly ? 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl ring-1 ring-black/5 dark:ring-white/10' : 'w-7 h-7 rounded-lg'
                                      } flex items-center justify-center shrink-0 transition-transform ${
                                        isItemOn
                                          ? 'bg-[#FF4D6D] text-white shadow-[0_0_12px_rgba(255,77,109,0.45)]'
                                          : 'bg-stone-100 dark:bg-stone-800 text-stone-400'
                                      }`}>
                                        <ItemIcon className={isVisual3DOnly ? 'w-5 h-5' : 'w-3.5 h-3.5'} />
                                      </div>
                                      {!isVisual3DOnly && (
                                        <div className="min-w-0">
                                          <div className="text-xs font-bold truncate">
                                            {item.title}
                                          </div>
                                          {!isVisual3DOnly && item.desc && (
                                            <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                                              {item.desc}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                        isItemOn
                                          ? 'bg-[#FF4D6D]/20 text-[#FF4D6D]'
                                          : 'bg-stone-200/50 dark:bg-stone-800 text-stone-400'
                                      }`}>
                                        {isItemOn ? '3D' : '2D'}
                                      </span>

                                      <button
                                        type="button"
                                        role="switch"
                                        aria-checked={isItemOn}
                                        aria-label={`Toggle 3D for ${item.title}`}
                                        onClick={() => {
                                          toggle3DElement(item.key);
                                          if (soundEnabled) soundFX.playHapticClick();
                                        }}
                                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]/40 ${
                                          isItemOn ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
                                        }`}
                                      >
                                        <span
                                          className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                                            isItemOn ? 'translate-x-5' : 'translate-x-0.5'
                                          }`}
                                        />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* ACCORDION SECTION 2: LIGHTING & SHADOWS                                   */}
            {/* ========================================================================= */}
            {isSectionVisible('lighting') && (
              <div className="rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] bg-white/70 dark:bg-[#181226]/70 backdrop-blur-md overflow-hidden shadow-xs transition-all">
                <button
                  type="button"
                  onClick={() => toggleAccordionSection('lighting')}
                  aria-expanded={expandedAccordion === 'lighting'}
                  className="w-full flex items-center justify-between p-4 sm:p-5 bg-white/85 dark:bg-[#1D162E]/85 hover:bg-stone-50 dark:hover:bg-[#251B3D] transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold text-sm">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white">
                        Lighting &amp; Shadows
                      </h5>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Virtual directional illumination, dynamic cursor spotlight &amp; shadow falloff
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30">
                      {lighting.preset} • {lighting.angle}°
                    </span>
                    {expandedAccordion === 'lighting' ? (
                      <ChevronUp className="w-5 h-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                </button>

                {expandedAccordion === 'lighting' && (
                  <div className="p-4 sm:p-5 border-t border-[#ECE7DF] dark:border-[#2D2340] flex flex-col gap-6 animate-fadeIn">
                    {/* Lighting Presets */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                          <Sun className="w-4 h-4 text-amber-500" />
                          <span>Illumination Preset</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {LIGHTING_PRESETS.map((lp) => {
                          const isSelected = lighting.preset === lp.id;
                          const Icon = lp.icon;
                          return (
                            <ThreeDPresetCard
                              key={lp.id}
                              isSelected={isSelected}
                              isVisualOnly={isVisual3DOnly}
                              lightingAngle={lighting?.angle ?? 45}
                              depthIntensity={depthIntensity ?? 1.0}
                              bevelExtrusion={materials?.bevelExtrusion ?? 3}
                              onClick={() => {
                                set3DLightingPreset(lp.id);
                                if (soundEnabled) soundFX.playLaserFocus();
                              }}
                              title={lp.name}
                              desc={lp.desc}
                              icon={Icon}
                              visualPreview={
                                <LightingVectorPreview
                                  presetId={lp.id}
                                  lightingAngle={lighting?.angle ?? 45}
                                />
                              }
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Light Direction / Angle */}
                    <div className="flex flex-col gap-3 pt-4 border-t border-stone-200/60 dark:border-stone-800/80">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                            <Compass className="w-4 h-4 text-amber-500" />
                            <span>Light Direction &amp; Angle</span>
                          </span>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400">
                            Rotates virtual key light around the scene (0° to 360°)
                          </p>
                        </div>
                        <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                          {lighting.angle}°
                        </span>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="1"
                        value={lighting.angle}
                        onChange={(e) => set3DLightingAngle(parseInt(e.target.value, 10))}
                        className="w-full accent-amber-500 cursor-pointer"
                        aria-label="3D Lighting Angle"
                      />

                      <div className="flex items-center gap-2 flex-wrap pt-1">
                        {[
                          { label: '45° (Top-Right)', val: 45 },
                          { label: '135° (Bottom-Right)', val: 135 },
                          { label: '225° (Bottom-Left)', val: 225 },
                          { label: '315° (Top-Left)', val: 315 }
                        ].map((presetAngle) => (
                          <button
                            key={presetAngle.val}
                            type="button"
                            onClick={() => {
                              set3DLightingAngle(presetAngle.val);
                              if (soundEnabled) soundFX.playHapticClick();
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                              lighting.angle === presetAngle.val
                                ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                                : 'bg-white/60 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                            }`}
                          >
                            {presetAngle.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cursor Spotlight & Shadow Softness */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200/60 dark:border-stone-800/80">
                      {/* Cursor Spotlight */}
                      <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            <span>Cursor Spotlight</span>
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                            Follows mouse pointer with directional specular reflection
                          </p>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={lighting.cursorLight}
                          aria-label="Toggle Cursor Spotlight"
                          onClick={() => {
                            set3DCursorLight(!lighting.cursorLight);
                            if (soundEnabled) soundFX.playHapticClick();
                          }}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/40 shrink-0 ${
                            lighting.cursorLight ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-700'
                          }`}
                        >
                          <span
                            className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                              lighting.cursorLight ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Shadow Softness */}
                      <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex flex-col justify-between gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#18181B] dark:text-white">
                            Shadow Softness &amp; AO
                          </span>
                          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                            {Math.round(lighting.shadowSoftness * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.05"
                          value={lighting.shadowSoftness}
                          onChange={(e) => set3DShadowSoftness(parseFloat(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer"
                          aria-label="3D Shadow Softness"
                        />
                        <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                          <span>0.1 (Hard)</span>
                          <span>1.0 (Soft Ambient)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* ACCORDION SECTION 3: CAMERA & TILT PHYSICS                                */}
            {/* ========================================================================= */}
            {isSectionVisible('camera') && (
              <div className="rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] bg-white/70 dark:bg-[#181226]/70 backdrop-blur-md overflow-hidden shadow-xs transition-all">
                <button
                  type="button"
                  onClick={() => toggleAccordionSection('camera')}
                  aria-expanded={expandedAccordion === 'camera'}
                  className="w-full flex items-center justify-between p-4 sm:p-5 bg-white/85 dark:bg-[#1D162E]/85 hover:bg-stone-50 dark:hover:bg-[#251B3D] transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center font-bold text-sm">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white">
                        Camera &amp; Tilt Physics
                      </h5>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Focal perspective distance, gyroscope tilt sensitivity &amp; idle orbit dynamics
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30">
                      {camera.anglePreset} • {camera.perspectiveFOV}px
                    </span>
                    {expandedAccordion === 'camera' ? (
                      <ChevronUp className="w-5 h-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                </button>

                {expandedAccordion === 'camera' && (
                  <div className="p-4 sm:p-5 border-t border-[#ECE7DF] dark:border-[#2D2340] flex flex-col gap-6 animate-fadeIn">
                    {/* Camera Angle Presets */}
                    <div className="flex flex-col gap-3">
                      <span className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-cyan-500" />
                        <span>Viewing Angle Preset</span>
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                        {CAMERA_PRESETS.map((cp) => {
                          const isSelected = camera.anglePreset === cp.id;
                          return (
                            <ThreeDPresetCard
                              key={cp.id}
                              isSelected={isSelected}
                              isVisualOnly={isVisual3DOnly}
                              lightingAngle={lighting?.angle ?? 45}
                              depthIntensity={depthIntensity ?? 1.0}
                              bevelExtrusion={materials?.bevelExtrusion ?? 3}
                              onClick={() => {
                                set3DCameraAnglePreset(cp.id);
                                if (soundEnabled) soundFX.playLaserFocus();
                              }}
                              title={cp.name}
                              desc={cp.desc}
                              icon={Camera}
                              visualPreview={<CameraCubePreview presetId={cp.id} />}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Perspective FOV & Tilt Sensitivity Sliders */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200/60 dark:border-stone-800/80">
                      {/* FOV */}
                      <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex flex-col justify-between gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#18181B] dark:text-white">
                            Perspective FOV Distance
                          </span>
                          <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                            {camera.perspectiveFOV}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="400"
                          max="2000"
                          step="50"
                          value={camera.perspectiveFOV}
                          onChange={(e) => set3DPerspectiveFOV(parseInt(e.target.value, 10))}
                          className="w-full accent-cyan-500 cursor-pointer"
                          aria-label="3D Perspective FOV Distance"
                        />
                        <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                          <span>400px (Dramatic Fisheye)</span>
                          <span>2000px (Orthographic Flat)</span>
                        </div>
                      </div>

                      {/* Tilt Sensitivity */}
                      <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex flex-col justify-between gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#18181B] dark:text-white">
                            Mouse Parallax Tilt Sensitivity
                          </span>
                          <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                            {camera.tiltSensitivity}°
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="40"
                          step="1"
                          value={camera.tiltSensitivity}
                          onChange={(e) => set3DTiltSensitivity(parseInt(e.target.value, 10))}
                          className="w-full accent-cyan-500 cursor-pointer"
                          aria-label="3D Mouse Parallax Tilt Sensitivity"
                        />
                        <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                          <span>0° (Fixed Flat)</span>
                          <span>40° (Extreme Tilt)</span>
                        </div>
                      </div>
                    </div>

                    {/* Auto-Orbit Controls */}
                    <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                          <RotateCcw className="w-3.5 h-3.5 text-cyan-500" />
                          <span>Continuous Idle Orbit Rotation</span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                          Slowly orbits spatial elements when mouse is stationary
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        {camera.autoOrbit && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-cyan-500 font-bold">
                              {camera.orbitSpeed.toFixed(1)}x
                            </span>
                            <input
                              type="range"
                              min="0.2"
                              max="3.0"
                              step="0.1"
                              value={camera.orbitSpeed}
                              onChange={(e) => set3DOrbitSpeed(parseFloat(e.target.value))}
                              className="w-24 accent-cyan-500 cursor-pointer"
                              aria-label="3D Auto Orbit Speed"
                            />
                          </div>
                        )}

                        <button
                          type="button"
                          role="switch"
                          aria-checked={camera.autoOrbit}
                          aria-label="Toggle Continuous Idle Orbit Rotation"
                          onClick={() => {
                            set3DAutoOrbit(!camera.autoOrbit);
                            if (soundEnabled) soundFX.playHapticClick();
                          }}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/40 shrink-0 ${
                            camera.autoOrbit ? 'bg-cyan-500' : 'bg-stone-300 dark:bg-stone-700'
                          }`}
                        >
                          <span
                            className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                              camera.autoOrbit ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* 3D Depth & Perspective Intensity Slider */}
                    <div className="flex flex-col gap-2.5 pt-4 border-t border-stone-200/60 dark:border-stone-800/80">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                            <Sliders className="w-4 h-4 text-[#FF4D6D]" />
                            <span>3D Depth &amp; Perspective Intensity</span>
                          </h4>
                          <p className="text-xs text-stone-500 dark:text-stone-400">
                            Controls focal distance, extrusion depth, and Z-plane travel
                          </p>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#FF4D6D] bg-[#FF4D6D]/10 dark:bg-[#FF4D6D]/20 px-2.5 py-1 rounded-full border border-[#FF4D6D]/20">
                          {threeDConfig.depthIntensity.toFixed(1)}x
                        </span>
                      </div>

                      <input
                        type="range"
                        min="0.2"
                        max="2.5"
                        step="0.1"
                        value={threeDConfig.depthIntensity}
                        onChange={(e) => set3DDepthIntensity(parseFloat(e.target.value))}
                        className="w-full accent-[#FF4D6D] cursor-pointer"
                        aria-label="3D Depth and Perspective Intensity"
                      />

                      <div className="flex justify-between text-[11px] text-stone-400 dark:text-stone-500 font-mono">
                        <span>0.2x (Subtle Elevation)</span>
                        <span>1.0x (Balanced Studio)</span>
                        <span>2.5x (Intense 3D Depth)</span>
                      </div>
                    </div>

                    {/* 3D Style Presets */}
                    <div className="pt-4 border-t border-stone-100 dark:border-stone-800/80 flex flex-col gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                          <Compass className="w-4 h-4 text-[#FF4D6D]" />
                          <span>3D Style Presets</span>
                        </h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          Choose a signature spatial visual aesthetic
                        </p>
                      </div>

                      <div className={`grid ${isDrawer ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'} gap-3`}>
                        {[
                          {
                            id: 'subtle',
                            name: 'Subtle 3D',
                            desc: 'Clean elevation, soft tilt & ambient shadows',
                            badge: '1200px Cam'
                          },
                          {
                            id: 'isometric',
                            name: 'Isometric 3D',
                            desc: 'Geometric 45° planar angle & crisp edges',
                            badge: '800px Cam'
                          },
                          {
                            id: 'deep',
                            name: 'Deep Cinema 3D',
                            desc: 'Dramatic high-depth parallax & deep extrusion',
                            badge: '500px Cam'
                          }
                        ].map((preset) => {
                          const isSelected = threeDConfig.stylePreset === preset.id;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              role="radio"
                              aria-checked={isSelected}
                              title={`${preset.name}: ${preset.desc}`}
                              aria-label={`${preset.name}: ${preset.desc}`}
                              onClick={() => {
                                set3DStylePreset(preset.id);
                                if (soundEnabled) soundFX.playLaserFocus();
                              }}
                              className={`p-3.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer relative group ${
                                isSelected
                                  ? 'bg-[#FF4D6D]/10 border-[#FF4D6D] text-[#18181B] dark:text-white ring-2 ring-[#FF4D6D]/30 shadow-[0_0_15px_-3px_rgba(255,77,109,0.25)] scale-[1.01]'
                                  : 'bg-white/40 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full mb-1.5">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                                  isSelected
                                    ? 'bg-[#FF4D6D]/20 text-[#FF4D6D] border-[#FF4D6D]/30'
                                    : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200/60 dark:border-stone-700/60'
                                }`}>
                                  {preset.badge}
                                </span>
                                {isSelected && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#FF4D6D] text-white flex items-center gap-1 shadow-2xs">
                                    <Check className="w-3 h-3" />
                                    <span>Active</span>
                                  </span>
                                )}
                              </div>

                              {!isTab3DActive ? (
                                <div>
                                  <div className="text-xs font-bold text-[#18181B] dark:text-white">
                                    {preset.name}
                                  </div>
                                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                                    {preset.desc}
                                  </div>
                                </div>
                              ) : (
                                <div className="py-1 flex items-center justify-center">
                                  <Box className={`w-6 h-6 transition-transform ${isSelected ? 'text-[#FF4D6D] scale-110' : 'text-stone-400'}`} />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* ACCORDION SECTION 4: MATERIALS & SHADING                                  */}
            {/* ========================================================================= */}
            {isSectionVisible('materials') && (
              <div className="rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] bg-white/70 dark:bg-[#181226]/70 backdrop-blur-md overflow-hidden shadow-xs transition-all">
                <button
                  type="button"
                  onClick={() => toggleAccordionSection('materials')}
                  aria-expanded={expandedAccordion === 'materials'}
                  className="w-full flex items-center justify-between p-4 sm:p-5 bg-white/85 dark:bg-[#1D162E]/85 hover:bg-stone-50 dark:hover:bg-[#251B3D] transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center font-bold text-sm">
                      <Cuboid className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white">
                        Materials &amp; Shading
                      </h5>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Surface reflectance, glass acrylic opacity, metallic gloss &amp; edge beveling
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30">
                      {materials.preset} • {materials.bevelExtrusion}px bevel
                    </span>
                    {expandedAccordion === 'materials' ? (
                      <ChevronUp className="w-5 h-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                </button>

                {expandedAccordion === 'materials' && (
                  <div className="p-4 sm:p-5 border-t border-[#ECE7DF] dark:border-[#2D2340] flex flex-col gap-6 animate-fadeIn">
                    {/* Material Presets */}
                    <div className="flex flex-col gap-3">
                      <span className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                        <Cuboid className="w-4 h-4 text-purple-500" />
                        <span>Material Shading Preset</span>
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {MATERIAL_PRESETS.map((mat) => {
                          const isSelected = materials.preset === mat.id;
                          return (
                            <ThreeDPresetCard
                              key={mat.id}
                              isSelected={isSelected}
                              isVisualOnly={isVisual3DOnly}
                              lightingAngle={lighting?.angle ?? 45}
                              depthIntensity={depthIntensity ?? 1.0}
                              bevelExtrusion={materials?.bevelExtrusion ?? 3}
                              onClick={() => {
                                set3DMaterialPreset(mat.id);
                                if (soundEnabled) soundFX.playLaserFocus();
                              }}
                              title={mat.name}
                              desc={mat.desc}
                              icon={Cuboid}
                              visualPreview={
                                <MaterialShaderSphere
                                  materialId={mat.id}
                                  lightingAngle={lighting?.angle ?? 45}
                                  specularGlow={materials?.specularGlow ?? 0.6}
                                  bevelExtrusion={materials?.bevelExtrusion ?? 3}
                                />
                              }
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Specular Glow & Bevel Extrusion Sliders */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200/60 dark:border-stone-800/80">
                      {/* Specular Glow */}
                      <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex flex-col justify-between gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#18181B] dark:text-white">
                            Specular Highlight &amp; Glow
                          </span>
                          <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                            {Math.round(materials.specularGlow * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.0"
                          max="1.0"
                          step="0.05"
                          value={materials.specularGlow}
                          onChange={(e) => set3DSpecularGlow(parseFloat(e.target.value))}
                          className="w-full accent-purple-500 cursor-pointer"
                          aria-label="3D Specular Highlight & Glow"
                        />
                        <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                          <span>0% (Matte)</span>
                          <span>100% (High Sheen)</span>
                        </div>
                      </div>

                      {/* Bevel Extrusion */}
                      <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex flex-col justify-between gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#18181B] dark:text-white">
                            Bevel &amp; Edge Extrusion
                          </span>
                          <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                            {materials.bevelExtrusion}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="8"
                          step="1"
                          value={materials.bevelExtrusion}
                          onChange={(e) => set3DBevelExtrusion(parseInt(e.target.value, 10))}
                          className="w-full accent-purple-500 cursor-pointer"
                          aria-label="3D Bevel and Edge Extrusion"
                        />
                        <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                          <span>1px (Micro-Chamfer)</span>
                          <span>8px (Deep Tactile Bevel)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* ACCORDION SECTION 5: INTERACTION & PHYSICS                                */}
            {/* ========================================================================= */}
            {isSectionVisible('physics') && (
              <div className="rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] bg-white/70 dark:bg-[#181226]/70 backdrop-blur-md overflow-hidden shadow-xs transition-all">
                <button
                  type="button"
                  onClick={() => toggleAccordionSection('physics')}
                  aria-expanded={expandedAccordion === 'physics'}
                  className="w-full flex items-center justify-between p-4 sm:p-5 bg-white/85 dark:bg-[#1D162E]/85 hover:bg-stone-50 dark:hover:bg-[#251B3D] transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center font-bold text-sm">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white">
                        Interaction &amp; Physics
                      </h5>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Hover elevation pop, press depression, spring damping &amp; magnetic snap
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30">
                      {physics.elasticity} • +{physics.hoverPop}px
                    </span>
                    {expandedAccordion === 'physics' ? (
                      <ChevronUp className="w-5 h-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                </button>

                {expandedAccordion === 'physics' && (
                  <div className="p-4 sm:p-5 border-t border-[#ECE7DF] dark:border-[#2D2340] flex flex-col gap-6 animate-fadeIn">
                    {/* Hover Pop Extrusion Slider */}
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                            <Zap className="w-4 h-4 text-rose-500" />
                            <span>Hover Pop Extrusion</span>
                          </span>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400">
                            Z-plane elevation jump when hovering over interactive cards and buttons
                          </p>
                        </div>
                        <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                          +{physics.hoverPop}px
                        </span>
                      </div>

                      <input
                        type="range"
                        min="4"
                        max="32"
                        step="2"
                        value={physics.hoverPop}
                        onChange={(e) => set3DPhysicsHoverPop(parseInt(e.target.value, 10))}
                        className="w-full accent-rose-500 cursor-pointer"
                        aria-label="3D Hover Pop Extrusion"
                      />

                      <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                        <span>4px (Subtle Lift)</span>
                        <span>32px (Extreme 3D Jump)</span>
                      </div>
                    </div>

                    {/* Elasticity Spring Presets */}
                    <div className="pt-4 border-t border-stone-200/60 dark:border-stone-800/80 flex flex-col gap-3">
                      <span className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-rose-500" />
                        <span>Elasticity &amp; Spring Physics</span>
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {ELASTICITY_PRESETS.map((ep) => {
                          const isSelected = physics.elasticity === ep.id;
                          return (
                            <ThreeDPresetCard
                              key={ep.id}
                              isSelected={isSelected}
                              isVisualOnly={isVisual3DOnly}
                              lightingAngle={lighting?.angle ?? 45}
                              depthIntensity={depthIntensity ?? 1.0}
                              bevelExtrusion={materials?.bevelExtrusion ?? 3}
                              onClick={() => {
                                set3DElasticity(ep.id);
                                if (soundEnabled) soundFX.playLaserFocus();
                              }}
                              title={ep.name}
                              desc={ep.desc}
                              icon={Activity}
                              visualPreview={<SpringElasticityVisual presetId={ep.id} />}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Click Depression & Magnetic Pull Toggles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200/60 dark:border-stone-800/80">
                      {/* Click Depression Toggle */}
                      <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold text-[#18181B] dark:text-white">
                            3D Click Press Depression
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                            Depresses elements into negative Z-plane on click
                          </p>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={physics.clickDepression}
                          aria-label="Toggle 3D Click Press Depression"
                          onClick={() => {
                            set3DClickDepression(!physics.clickDepression);
                            if (soundEnabled) soundFX.playHapticClick();
                          }}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/40 shrink-0 ${
                            physics.clickDepression ? 'bg-rose-500' : 'bg-stone-300 dark:bg-stone-700'
                          }`}
                        >
                          <span
                            className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                              physics.clickDepression ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Magnetic Pull Toggle */}
                      <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                            <Magnet className="w-3.5 h-3.5 text-rose-500" />
                            <span>Magnetic Cursor Pull</span>
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                            Subtly gravitates element center towards cursor proximity
                          </p>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={physics.magneticPull}
                          aria-label="Toggle Magnetic Cursor Pull"
                          onClick={() => {
                            set3DMagneticPull(!physics.magneticPull);
                            if (soundEnabled) soundFX.playHapticClick();
                          }}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/40 shrink-0 ${
                            physics.magneticPull ? 'bg-rose-500' : 'bg-stone-300 dark:bg-stone-700'
                          }`}
                        >
                          <span
                            className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                              physics.magneticPull ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* ACCORDION SECTION 6: EXPLODED CAD & BLUEPRINT VIEW                        */}
            {/* ========================================================================= */}
            {isSectionVisible('exploded') && (
              <div className="rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] bg-white/70 dark:bg-[#181226]/70 backdrop-blur-md overflow-hidden shadow-xs transition-all">
                <button
                  type="button"
                  onClick={() => toggleAccordionSection('exploded')}
                  aria-expanded={expandedAccordion === 'exploded'}
                  className="w-full flex items-center justify-between p-4 sm:p-5 bg-white/85 dark:bg-[#1D162E]/85 hover:bg-stone-50 dark:hover:bg-[#251B3D] transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center font-bold text-sm">
                      <Split className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white">
                        Exploded CAD &amp; Blueprint View
                      </h5>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Multi-layer strata separation, schematic blueprint wireframes &amp; depth staging
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30">
                      {exploded.enabled ? `Exploded +${exploded.separationDistance}px` : 'Compact Assembled'}
                    </span>
                    {expandedAccordion === 'exploded' ? (
                      <ChevronUp className="w-5 h-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                </button>

                {expandedAccordion === 'exploded' && (
                  <div className="p-4 sm:p-5 border-t border-[#ECE7DF] dark:border-[#2D2340] flex flex-col gap-6 animate-fadeIn">
                    {/* Visual 3D Strata Stack Preview */}
                    <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-500/5 flex flex-col sm:flex-row items-center justify-between gap-3 threed-preserve">
                      <div className="flex items-center gap-3">
                        <ExplodedCADLayerVisual isExploded={exploded.enabled} isBlueprint={exploded.blueprintMode} />
                        <div>
                          <div className="text-xs font-bold text-[#18181B] dark:text-white">
                            {exploded.enabled ? '3D Strata Stack: Exploded' : '3D Strata Stack: Compact Assembled'}
                          </div>
                          <p className="text-[10.5px] text-stone-500 dark:text-stone-400">
                            {exploded.blueprintMode ? 'CAD Cyan Wireframe Matrix Active' : 'Solid Material Layers Separated along Z-Plane'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ThreeDActionKeycap
                          onClick={() => {
                            set3DExploded({ enabled: !exploded.enabled });
                            if (soundEnabled) soundFX.playHapticClick();
                          }}
                          icon={Split}
                          label={exploded.enabled ? 'Collapse' : 'Explode'}
                          variant={exploded.enabled ? 'primary' : 'default'}
                          active={exploded.enabled}
                          ariaLabel="Toggle 3D Layer Explosion"
                          isVisualOnly={isTab3DActive}
                        />
                        <ThreeDActionKeycap
                          onClick={() => {
                            set3DExploded({ blueprintMode: !exploded.blueprintMode });
                            if (soundEnabled) soundFX.playLaserFocus();
                          }}
                          icon={Grid}
                          label={exploded.blueprintMode ? 'Solid' : 'CAD'}
                          variant={exploded.blueprintMode ? 'primary' : 'default'}
                          active={exploded.blueprintMode}
                          ariaLabel="Toggle CAD Wireframe"
                          isVisualOnly={isTab3DActive}
                        />
                      </div>
                    </div>

                    {/* Exploded Mode Main Toggle */}
                    <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                          <Split className="w-4 h-4 text-cyan-500" />
                          <span>Exploded Layer Separation</span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                          Unfolds UI elements outward along the Z-axis to reveal underlying spatial architecture
                        </p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={exploded.enabled}
                        aria-label="Toggle Exploded Layer Separation"
                        onClick={() => {
                          set3DExploded({ enabled: !exploded.enabled });
                          if (soundEnabled) soundFX.playHapticClick();
                        }}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/40 shrink-0 ${
                          exploded.enabled ? 'bg-cyan-500' : 'bg-stone-300 dark:bg-stone-700'
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                            exploded.enabled ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Blueprint Mode Toggle */}
                    <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                          <Grid className="w-4 h-4 text-cyan-500" />
                          <span>Blueprint CAD Wireframe Mode</span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                          Renders neon wireframe drafting grids, isometric dimensions &amp; technical outlines
                        </p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={exploded.blueprintMode}
                        aria-label="Toggle Blueprint CAD Wireframe Mode"
                        onClick={() => {
                          set3DExploded({ blueprintMode: !exploded.blueprintMode });
                          if (soundEnabled) soundFX.playLaserFocus();
                        }}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/40 shrink-0 ${
                          exploded.blueprintMode ? 'bg-cyan-500' : 'bg-stone-300 dark:bg-stone-700'
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                            exploded.blueprintMode ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Sliders: Separation Distance & Layer Stagger */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200/60 dark:border-stone-800/80">
                      <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex flex-col justify-between gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#18181B] dark:text-white">
                            Separation Distance
                          </span>
                          <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                            {exploded.separationDistance}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="120"
                          step="5"
                          value={exploded.separationDistance}
                          onChange={(e) => set3DExploded({ separationDistance: parseInt(e.target.value, 10) })}
                          className="w-full accent-cyan-500 cursor-pointer"
                          aria-label="3D Exploded Separation Distance"
                        />
                        <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                          <span>0px (Flushed)</span>
                          <span>120px (Maximum Explosion)</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex flex-col justify-between gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#18181B] dark:text-white">
                            Strata Stagger Offset
                          </span>
                          <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                            {exploded.layerStagger}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          step="5"
                          value={exploded.layerStagger}
                          onChange={(e) => set3DExploded({ layerStagger: parseInt(e.target.value, 10) })}
                          className="w-full accent-cyan-500 cursor-pointer"
                          aria-label="3D Exploded Layer Stagger"
                        />
                        <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                          <span>0px (Uniform)</span>
                          <span>50px (Staggered Cascade)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* ACCORDION SECTION 7: ENVIRONMENT & VOLUMETRIC FOG                         */}
            {/* ========================================================================= */}
            {isSectionVisible('environment') && (
              <div className="rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] bg-white/70 dark:bg-[#181226]/70 backdrop-blur-md overflow-hidden shadow-xs transition-all">
                <button
                  type="button"
                  onClick={() => toggleAccordionSection('environment')}
                  aria-expanded={expandedAccordion === 'environment'}
                  className="w-full flex items-center justify-between p-4 sm:p-5 bg-white/85 dark:bg-[#1D162E]/85 hover:bg-stone-50 dark:hover:bg-[#251B3D] transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center font-bold text-sm">
                      <CloudFog className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white">
                        Environment &amp; Volumetric Fog
                      </h5>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Skybox atmosphere, stardust particles, depth of field &amp; volumetric mist
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30">
                      {environment.skybox} • {environment.fogDensity}% Fog
                    </span>
                    {expandedAccordion === 'environment' ? (
                      <ChevronUp className="w-5 h-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                </button>

                {expandedAccordion === 'environment' && (
                  <div className="p-4 sm:p-5 border-t border-[#ECE7DF] dark:border-[#2D2340] flex flex-col gap-6 animate-fadeIn">
                    {/* Skybox Selection */}
                    <div className="flex flex-col gap-3">
                      <span className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-indigo-500" />
                        <span>3D Atmosphere &amp; Skybox</span>
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {SKYBOX_PRESETS.map((sb) => {
                          const isSelected = environment.skybox === sb.id;
                          return (
                            <button
                              key={sb.id}
                              type="button"
                              onClick={() => {
                                set3DEnvironment({ skybox: sb.id });
                                if (soundEnabled) soundFX.playLaserFocus();
                              }}
                              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-500/10 border-indigo-500 ring-2 ring-indigo-500/30 shadow-xs text-[#18181B] dark:text-white'
                                  : 'bg-white/40 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <span className="text-xs font-bold">{sb.name}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                              </div>
                              <span className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                                {sb.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Stardust Particle Simulation Toggle */}
                    <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-indigo-500" />
                          <span>Stardust Particle Field</span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                          Floating luminescent particles reacting with subtle parallax floatation
                        </p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={environment.stardustParticles}
                        aria-label="Toggle Stardust Particle Field"
                        onClick={() => {
                          set3DEnvironment({ stardustParticles: !environment.stardustParticles });
                          if (soundEnabled) soundFX.playHapticClick();
                        }}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40 shrink-0 ${
                          environment.stardustParticles ? 'bg-indigo-500' : 'bg-stone-300 dark:bg-stone-700'
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                            environment.stardustParticles ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Sliders: Volumetric Fog & Depth of Field */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200/60 dark:border-stone-800/80">
                      <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex flex-col justify-between gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#18181B] dark:text-white">
                            Volumetric Fog Density
                          </span>
                          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {environment.fogDensity}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={environment.fogDensity}
                          onChange={(e) => set3DEnvironment({ fogDensity: parseInt(e.target.value, 10) })}
                          className="w-full accent-indigo-500 cursor-pointer"
                          aria-label="3D Volumetric Fog Density"
                        />
                        <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                          <span>0% (Crystal Clear)</span>
                          <span>100% (Dense Nebula)</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex flex-col justify-between gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#18181B] dark:text-white">
                            Depth-of-Field (DoF) Blur
                          </span>
                          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {environment.depthOfFieldBlur}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="1"
                          value={environment.depthOfFieldBlur}
                          onChange={(e) => set3DEnvironment({ depthOfFieldBlur: parseInt(e.target.value, 10) })}
                          className="w-full accent-indigo-500 cursor-pointer"
                          aria-label="3D Depth of Field Blur"
                        />
                        <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                          <span>0px (Infinite Focus)</span>
                          <span>10px (Cinematic Bokeh)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* ACCORDION SECTION 8: 3D SPATIAL AUDIO & REVERB                            */}
            {/* ========================================================================= */}
            {isSectionVisible('spatialAudio') && (
              <div className="rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] bg-white/70 dark:bg-[#181226]/70 backdrop-blur-md overflow-hidden shadow-xs transition-all">
                <button
                  type="button"
                  onClick={() => toggleAccordionSection('spatialAudio')}
                  aria-expanded={expandedAccordion === 'spatialAudio'}
                  className="w-full flex items-center justify-between p-4 sm:p-5 bg-white/85 dark:bg-[#1D162E]/85 hover:bg-stone-50 dark:hover:bg-[#251B3D] transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-bold text-sm">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white">
                        3D Spatial Audio &amp; Reverb
                      </h5>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Binaural HRTF panning, acoustic room simulation &amp; material impact resonance
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                      {spatialAudio.roomSize} • {Math.round(spatialAudio.reverbIntensity * 100)}% Reverb
                    </span>
                    {expandedAccordion === 'spatialAudio' ? (
                      <ChevronUp className="w-5 h-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                </button>

                {expandedAccordion === 'spatialAudio' && (
                  <div className="p-4 sm:p-5 border-t border-[#ECE7DF] dark:border-[#2D2340] flex flex-col gap-6 animate-fadeIn">
                    {/* Binaural Panning Toggle */}
                    <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                          <Radio className="w-4 h-4 text-emerald-500" />
                          <span>Binaural HRTF Spatial Panning</span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                          Pans UI click sound effects dynamically in 3D space based on mouse cursor position
                        </p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={spatialAudio.binauralPanning}
                        aria-label="Toggle Binaural HRTF Spatial Panning"
                        onClick={() => {
                          set3DSpatialAudio({ binauralPanning: !spatialAudio.binauralPanning });
                          if (soundEnabled) soundFX.playHapticClick();
                        }}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shrink-0 ${
                          spatialAudio.binauralPanning ? 'bg-emerald-500' : 'bg-stone-300 dark:bg-stone-700'
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                            spatialAudio.binauralPanning ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Room Size Presets */}
                    <div className="flex flex-col gap-3">
                      <span className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                        <Headphones className="w-4 h-4 text-emerald-500" />
                        <span>Acoustic Room Simulation</span>
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {ROOM_SIZE_PRESETS.map((rp) => {
                          const isSelected = spatialAudio.roomSize === rp.id;
                          return (
                            <button
                              key={rp.id}
                              type="button"
                              onClick={() => {
                                set3DSpatialAudio({ roomSize: rp.id });
                                if (soundEnabled) soundFX.playLaserFocus();
                              }}
                              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/30 shadow-xs text-[#18181B] dark:text-white'
                                  : 'bg-white/40 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <span className="text-xs font-bold">{rp.name}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                              </div>
                              <span className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                                {rp.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Reverb Intensity Slider */}
                    <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex flex-col justify-between gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#18181B] dark:text-white">
                          Acoustic Reverb Tail
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {Math.round(spatialAudio.reverbIntensity * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={spatialAudio.reverbIntensity}
                        onChange={(e) => set3DSpatialAudio({ reverbIntensity: parseFloat(e.target.value) })}
                        className="w-full accent-emerald-500 cursor-pointer"
                        aria-label="3D Acoustic Reverb Tail"
                      />
                      <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                        <span>0% (Dry Direct Sound)</span>
                        <span>100% (Lush Wet Diffusion)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* ACCORDION SECTION 9: PERFORMANCE & GPU ACCELERATION                       */}
            {/* ========================================================================= */}
            {isSectionVisible('performance') && (
              <div className="rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] bg-white/70 dark:bg-[#181226]/70 backdrop-blur-md overflow-hidden shadow-xs transition-all">
                <button
                  type="button"
                  onClick={() => toggleAccordionSection('performance')}
                  aria-expanded={expandedAccordion === 'performance'}
                  className="w-full flex items-center justify-between p-4 sm:p-5 bg-white/85 dark:bg-[#1D162E]/85 hover:bg-stone-50 dark:hover:bg-[#251B3D] transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/15 text-orange-500 flex items-center justify-center font-bold text-sm">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white">
                        Performance &amp; GPU Acceleration
                      </h5>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Frame rate limits, hardware transform3d pipelines &amp; idle power throttling
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30">
                      {performanceConfig.fpsTarget} FPS • {performanceConfig.gpuAcceleration}
                    </span>
                    {expandedAccordion === 'performance' ? (
                      <ChevronUp className="w-5 h-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                </button>

                {expandedAccordion === 'performance' && (
                  <div className="p-4 sm:p-5 border-t border-[#ECE7DF] dark:border-[#2D2340] flex flex-col gap-6 animate-fadeIn">
                    {/* Target FPS Presets */}
                    <div className="flex flex-col gap-3">
                      <span className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-orange-500" />
                        <span>Rendering Frame Rate Target</span>
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {FPS_PRESETS.map((fp) => {
                          const isSelected = performanceConfig.fpsTarget === fp.id;
                          return (
                            <button
                              key={fp.id}
                              type="button"
                              onClick={() => {
                                set3DPerformance({ fpsTarget: fp.id });
                                if (soundEnabled) soundFX.playLaserFocus();
                              }}
                              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-orange-500/10 border-orange-500 ring-2 ring-orange-500/30 shadow-xs text-[#18181B] dark:text-white'
                                  : 'bg-white/40 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <span className="text-xs font-bold">{fp.name}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-orange-500" />}
                              </div>
                              <span className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                                {fp.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Auto Throttle Idle & Battery Threshold Toggles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200/60 dark:border-stone-800/80">
                      <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                            <Gauge className="w-4 h-4 text-orange-500" />
                            <span>Idle Motion Throttling</span>
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                            Pauses active 3D transforms when cursor is dormant for &gt;3s
                          </p>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={performanceConfig.autoThrottleIdle}
                          aria-label="Toggle Idle Motion Throttling"
                          onClick={() => {
                            set3DPerformance({ autoThrottleIdle: !performanceConfig.autoThrottleIdle });
                            if (soundEnabled) soundFX.playHapticClick();
                          }}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/40 shrink-0 ${
                            performanceConfig.autoThrottleIdle ? 'bg-orange-500' : 'bg-stone-300 dark:bg-stone-700'
                          }`}
                        >
                          <span
                            className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                              performanceConfig.autoThrottleIdle ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                            <Battery className="w-4 h-4 text-orange-500" />
                            <span>Low Power Mode Detection</span>
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                            Automatically drops to 30 FPS when OS enters battery saver
                          </p>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={performanceConfig.lowPowerThreshold}
                          aria-label="Toggle Low Power Mode Detection"
                          onClick={() => {
                            set3DPerformance({ lowPowerThreshold: !performanceConfig.lowPowerThreshold });
                            if (soundEnabled) soundFX.playHapticClick();
                          }}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/40 shrink-0 ${
                            performanceConfig.lowPowerThreshold ? 'bg-orange-500' : 'bg-stone-300 dark:bg-stone-700'
                          }`}
                        >
                          <span
                            className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                              performanceConfig.lowPowerThreshold ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 5. 3D Profile, Export & Developer Toolkit Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#FF4D6D]" />
                  <span>3D Profile, Export &amp; Developer Toolkit</span>
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Export or restore full JSON profiles, copy CSS custom properties &amp; inspect real-time spatial tokens
                </p>
              </div>

              {toolkitStatus && (
                <div className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                  toolkitStatus.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                }`}>
                  <span>{toolkitStatus.message}</span>
                </div>
              )}
            </div>

            {/* Hidden file input for import */}
            <input
              ref={jsonFileInputRef}
              type="file"
              accept=".json"
              onChange={handleJsonFileChange}
              className="hidden"
              aria-label="Upload 3D JSON Configuration"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={handleExportJson}
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-97"
              >
                <Download className="w-4 h-4 text-[#FF4D6D]" />
                <span>Export 3D Profile (.json)</span>
              </button>

              <button
                type="button"
                onClick={handleImportJsonClick}
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-97"
              >
                <Upload className="w-4 h-4 text-cyan-500" />
                <span>Import Profile (.json)</span>
              </button>

              <button
                type="button"
                onClick={handleCopyCssVariables}
                className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-97 ${
                  copiedCss
                    ? 'bg-emerald-500 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200'
                }`}
              >
                {copiedCss ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied CSS Variables!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-500" />
                    <span>Copy CSS Custom Properties</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 6. 1-Click Reset 3D Controls to Default */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#FF4D6D]" />
                <span>Reset 3D Controls to Default</span>
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Restore Master 3D, depth intensity (1.0x), subtle preset &amp; all 10 component toggles to 2D defaults
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                reset3DDefaults();
                if (soundEnabled) soundFX.playCrystalChime();
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-[#FF4D6D] text-stone-700 hover:text-white dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-[#FF4D6D] dark:hover:text-white font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-97"
              aria-label="Reset 3D Controls to Default"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset 3D Defaults</span>
            </button>
          </div>
            </div>
          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* TAB 4: STARTUP & PREFERENCES                                              */}
      {/* ========================================================================= */}
      {(effectiveActiveTab === 'preferences' || activeTab === 'preferences') && (
        <div
          role="tabpanel"
          id="panel-preferences"
          aria-labelledby="tab-preferences"
          tabIndex={0}
          className="flex flex-col gap-6 focus:outline-none animate-fadeIn"
        >
          {/* Default Startup Role Track */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs">
            <div className="mb-4">
              <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#FF4D6D]" />
                <span>Default Startup Career Role Track</span>
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Sets the initial professional persona and active deliverables presented upon visiting the portfolio
              </p>
            </div>

            <div className={`grid ${isDrawer ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-3`}>
              {ROLE_OPTIONS.map((opt) => {
                const isSelected = defaultStartupRole === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectRole(opt.id)}
                    className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF4D6D]/10 border-[#FF4D6D] text-[#18181B] dark:text-white shadow-xs'
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${opt.accent}20`,
                          color: opt.accent
                        }}
                      >
                        {opt.badge}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[#FF4D6D]" />}
                    </div>
                    <span className="text-xs font-bold text-[#18181B] dark:text-white mb-1">
                      {opt.title}
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Startup Default States, Reduced Motion & High Contrast */}
          <div className={`grid ${isDrawer ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'} gap-4`}>
            {/* Default Cursor State */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-[#18181B] dark:text-white">Startup Cursor State</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">Default pointer experience on initial load</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDefaultCursorEnabled(true)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    defaultCursorEnabled
                      ? 'bg-[#FF4D6D]/10 border-[#FF4D6D] text-[#FF4D6D]'
                      : 'border-stone-200 dark:border-stone-800 text-stone-500'
                  }`}
                >
                  Custom Cursor
                </button>
                <button
                  type="button"
                  onClick={() => setDefaultCursorEnabled(false)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    !defaultCursorEnabled
                      ? 'bg-[#FF4D6D]/10 border-[#FF4D6D] text-[#FF4D6D]'
                      : 'border-stone-200 dark:border-stone-800 text-stone-500'
                  }`}
                >
                  Native Pointer
                </button>
              </div>
            </div>

            {/* Default Audio State */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-[#18181B] dark:text-white">Startup Audio State</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">Audio feedback enabled on session start</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDefaultAudioEnabled(true)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    defaultAudioEnabled
                      ? 'bg-[#FF4D6D]/10 border-[#FF4D6D] text-[#FF4D6D]'
                      : 'border-stone-200 dark:border-stone-800 text-stone-500'
                  }`}
                >
                  Sound Active
                </button>
                <button
                  type="button"
                  onClick={() => setDefaultAudioEnabled(false)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    !defaultAudioEnabled
                      ? 'bg-[#FF4D6D]/10 border-[#FF4D6D] text-[#FF4D6D]'
                      : 'border-stone-200 dark:border-stone-800 text-stone-500'
                  }`}
                >
                  Muted
                </button>
              </div>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#18181B] dark:text-white">Reduced Motion</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">Accessibility override</p>
                </div>
                <button
                  role="switch"
                  aria-checked={reducedMotion}
                  aria-label="Toggle Reduced Motion mode"
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]/40 ${
                    reducedMotion ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                      reducedMotion ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <p className="text-[11px] text-stone-400 dark:text-stone-500">
                Suppresses rapid movement, continuous head tracking, and photo flashes.
              </p>
            </div>

            {/* High-Contrast Mode Toggle (WCAG AAA) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                    <span>High Contrast</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-600 dark:text-yellow-300 border border-yellow-400/30 font-bold">AAA</span>
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">21:1 Ratio (Alt+H)</p>
                </div>
                <button
                  role="switch"
                  aria-checked={isHighContrast}
                  aria-label="Toggle High-Contrast Mode (WCAG AAA)"
                  onClick={() => {
                    if (toggleHighContrast) toggleHighContrast();
                    if (soundEnabled) soundFX.playHapticClick();
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]/40 ${
                    isHighContrast ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                      isHighContrast ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <p className="text-[11px] text-stone-400 dark:text-stone-500">
                Monochrome solid borders, zero glassmorphism, 21:1 ratio.
              </p>
            </div>
          </div>

          {/* 1-Click Reset to Factory Defaults */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#FF4D6D]" />
                <span>Reset to Factory Defaults</span>
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Atomically restore all Audio, Cursor, Hero, and Startup parameters to clean factory defaults
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                resetDefaults();
                if (soundEnabled) soundFX.playCrystalChime();
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-[#FF4D6D] text-stone-700 hover:text-white dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-[#FF4D6D] dark:hover:text-white font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-97"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Parameters</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: DISPLAY & VISUALS                                                  */}
      {/* ========================================================================= */}
      {(effectiveActiveTab === 'visuals' || activeTab === 'visuals') && (
        <div
          role="tabpanel"
          id="panel-visuals"
          aria-labelledby="tab-visuals"
          tabIndex={0}
          className="flex flex-col gap-6 focus:outline-none animate-fadeIn"
        >
          {/* Section Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/70 dark:bg-[#181226]/80 border border-[#E7E2D8] dark:border-[#2D2340]">
            <div>
              <h3 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-[var(--theme-accent,#FF4D6D)]" />
                <span>Display Optics & Visual Atmosphere</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Curate surface refraction, cinematic easing rhythms, and vibrant luxury accent palettes.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-stone-100 dark:bg-[#251A3A] text-stone-600 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700/60">
                Active: {theme === 'dark' ? 'Obsidian Dark' : 'Linen Light'} • {getAccentName(accentColor)} • {layoutDensity.charAt(0).toUpperCase() + layoutDensity.slice(1) + ' • ' + (autoScrollOnRefresh ? 'Auto-Scroll ON' : 'Top (0,0)')}
              </span>
            </div>
          </div>

          {/* 4 Responsive Control Cards */}
          <div className={`grid ${isDrawer ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
            {/* CARD 1: Theme Switcher Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                    {theme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    <span>Theme Surface Mode</span>
                  </h4>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                    {theme === 'dark' ? 'Dark #0B0813' : 'Light #FAF8F5'}
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Switch between deep luxury Obsidian Dark and warm Linen Light studio canvas.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Obsidian Dark Option */}
                <button
                  type="button"
                  aria-label="Switch to Obsidian Dark theme"
                  onClick={() => {
                    if (theme !== 'dark') toggleTheme();
                  }}
                  className={`p-3 rounded-xl border flex flex-col gap-2 text-left transition-all cursor-pointer relative ${
                    theme === 'dark'
                      ? 'bg-[#1D152D] border-purple-500 text-white shadow-xs ring-2 ring-purple-500/20'
                      : 'bg-[#181226]/20 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-purple-400/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="w-4 h-4 rounded-full bg-[#0B0813] border border-purple-400/60 inline-block" />
                    {theme === 'dark' && <Check className="w-3.5 h-3.5 text-purple-400" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Obsidian Dark</div>
                    <div className="text-[10px] text-stone-400">Deep Plum Canvas (#0B0813)</div>
                  </div>
                </button>

                {/* Linen Light Option */}
                <button
                  type="button"
                  aria-label="Switch to Linen Light theme"
                  onClick={() => {
                    if (theme !== 'light') toggleTheme();
                  }}
                  className={`p-3 rounded-xl border flex flex-col gap-2 text-left transition-all cursor-pointer relative ${
                    theme === 'light'
                      ? 'bg-[#F5F2EB] border-amber-500 text-[#18181B] shadow-xs ring-2 ring-amber-500/20'
                      : 'bg-[#FAF8F5]/50 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-amber-400/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="w-4 h-4 rounded-full bg-[#FAF8F5] border border-stone-300 inline-block" />
                    {theme === 'light' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#18181B]">Linen Light</div>
                    <div className="text-[10px] text-stone-500">Warm Natural Canvas (#FAF8F5)</div>
                  </div>
                </button>
              </div>
            </div>

            {/* CARD 2: Glassmorphism Blur Strength Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-500" />
                    <span>Glassmorphism Blur Strength</span>
                  </h4>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    {glassBlur === 'subtle' ? '8px' : glassBlur === 'deep' ? '24px' : '16px'}
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Control real-time surface backdrop diffusion on cards, modals, and drawers.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'subtle', label: 'Subtle', px: '8px', desc: 'Light blur' },
                  { id: 'balanced', label: 'Balanced', px: '16px', desc: 'Standard studio' },
                  { id: 'deep', label: 'Deep Frosted', px: '24px', desc: 'Heavy diffusion' }
                ].map((opt) => {
                  const isSelected = glassBlur === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      aria-label={`Select glassmorphism blur: ${opt.label}`}
                      onClick={() => {
                        setGlassBlur(opt.id);
                        if (soundEnabled) soundFX.playHapticClick();
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-500 text-cyan-700 dark:text-cyan-300 font-bold shadow-2xs'
                          : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-cyan-400/40'
                      }`}
                    >
                      <span className="text-xs">{opt.label}</span>
                      <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500">{opt.px}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CARD 3: UI Motion & Transition Speed Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-emerald-500" />
                    <span>Motion & Transition Rhythm</span>
                  </h4>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {motionSpeed.toFixed(1)}x
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Global transition timing multiplier for drawer slides, tabs, and micro-animations.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { speed: 0.7, label: 'Snappy', desc: '0.7x (Fast)' },
                  { speed: 1.0, label: 'Natural', desc: '1.0x (Organic)' },
                  { speed: 1.4, label: 'Cinematic', desc: '1.4x (Smooth)' }
                ].map((opt) => {
                  const isSelected = Math.abs(motionSpeed - opt.speed) < 0.15;
                  return (
                    <button
                      key={opt.speed}
                      type="button"
                      aria-label={`Select motion rhythm: ${opt.label}`}
                      onClick={() => {
                        setMotionSpeed(opt.speed);
                        if (soundEnabled) soundFX.playHapticClick();
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold shadow-2xs'
                          : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-emerald-400/40'
                      }`}
                    >
                      <span className="text-xs">{opt.label}</span>
                      <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CARD 4: Accent Theme Color Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FF4D6D]" />
                    <span>Accent Theme Color</span>
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full border border-black/20 dark:border-white/20"
                      style={{ backgroundColor: accentColor }}
                    />
                    <span className="text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300">
                      {accentColor.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Luxury dynamic brand swatches. Live updates CSS accents, particle trails, and laser focus.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { name: 'Electric Rose', hex: '#FF4D6D', rgb: '255, 77, 109' },
                  { name: 'Amber Gold', hex: '#F59E0B', rgb: '245, 158, 11' },
                  { name: 'Neon Cyan', hex: '#06B6D4', rgb: '6, 182, 212' },
                  { name: 'Emerald Green', hex: '#10B981', rgb: '16, 185, 129' }
                ].map((c) => {
                  const isSelected = accentColor.toUpperCase() === c.hex.toUpperCase();
                  return (
                    <button
                      key={c.hex}
                      type="button"
                      aria-label={`Select accent color: ${c.name}`}
                      onClick={() => {
                        setAccentColor(c.hex);
                        try {
                          soundFX.init();
                          if (soundEnabled) soundFX.playLaserFocus();
                        } catch {
                          // Handled silently
                        }
                      }}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-[var(--theme-accent,#FF4D6D)] bg-[var(--theme-accent,#FF4D6D)]/10 ring-2 ring-[var(--theme-accent,#FF4D6D)]/30 scale-102'
                          : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-white/40 dark:bg-stone-900/40'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-full shadow-sm flex items-center justify-center transition-transform"
                        style={{ backgroundColor: c.hex }}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white drop-shadow-sm" />}
                      </div>
                      <span className="text-[11px] font-bold text-[#18181B] dark:text-white truncate max-w-full">
                        {c.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CARD 5: Quick Layout Density Tuner Card */}
            <div className={`p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col justify-between gap-4 ${isDrawer ? '' : 'md:col-span-2'}`}>
              <div>
                <div className="flex items-center justify-between mb-1 gap-2">
                  <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-[var(--theme-accent,#FF4D6D)] shrink-0" />
                    <span>Layout Density</span>
                  </h4>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--theme-accent,#FF4D6D)]/10 text-[var(--theme-accent,#FF4D6D)] border border-[var(--theme-accent,#FF4D6D)]/20 shrink-0">
                    {layoutDensity === 'compact' ? 'Compact • 0.8x' : layoutDensity === 'spacious' ? 'Spacious • 1.25x' : 'Comfortable • 1.0x'}
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Real-time spacing, padding, and layout scale optimization across portfolio containers.
                </p>
              </div>

              <div
                role="radiogroup"
                aria-label="Layout Density Options"
                className={`grid ${isDrawer ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'} gap-3`}
              >
                {DENSITY_OPTIONS.map((opt) => {
                  const isSelected = layoutDensity === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      data-density-id={opt.id}
                      tabIndex={isSelected ? 0 : -1}
                      onKeyDown={(e) => handleDensityKeyDown(e, opt.id)}
                      aria-checked={isSelected}
                      aria-label={`${opt.name} layout density (${opt.multiplier})`}
                      onClick={() => handleSelectDensity(opt.id)}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer relative group ${
                        isSelected
                          ? 'bg-[var(--theme-accent,#FF4D6D)]/10 border-[var(--theme-accent,#FF4D6D)] text-[#18181B] dark:text-white ring-2 ring-[var(--theme-accent,#FF4D6D)]/30 shadow-[0_0_15px_-3px_rgba(255,77,109,0.25)] scale-[1.01]'
                          : 'bg-white/40 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                            isSelected
                              ? 'bg-[var(--theme-accent,#FF4D6D)]/20 text-[var(--theme-accent,#FF4D6D)] border-[var(--theme-accent,#FF4D6D)]/30'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200/60 dark:border-stone-700/60'
                          }`}
                        >
                          {opt.multiplier}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {isSelected && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[var(--theme-accent,#FF4D6D)] text-white flex items-center gap-1 shadow-2xs">
                              <Check className="w-3 h-3" />
                              <span>Active</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                          <span>{opt.name}</span>
                          <span className="text-[10px] font-normal text-stone-400 dark:text-stone-500 font-mono">({opt.spacingValue})</span>
                        </div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                          {opt.summary}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          
            {/* CARD 6: Auto-Scroll on Refresh Toggle Card */}
            <div className={`p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col justify-between gap-4 ${isDrawer ? '' : 'md:col-span-2'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-[var(--theme-accent,#FF4D6D)]" />
                      <span>Auto-Scroll on Refresh</span>
                      <span className="text-xs font-normal text-stone-500 dark:text-stone-400">/ रिफ्रेश ऑटो-स्क्रॉल</span>
                    </h4>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border transition-colors ${
                        autoScrollOnRefresh
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200/60 dark:border-stone-700/60'
                      }`}
                    >
                      {autoScrollOnRefresh ? 'Enabled / Active (X, Y)' : 'Disabled / Top (0, 0)'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    {language === 'hi'
                      ? 'पेज रीफ्रेश होने पर पिछली X/Y स्क्रॉल स्थिति, URL और एक्टिव सेक्शन को स्वतः रीस्टोर करें।'
                      : 'Automatically restore exact X & Y scroll position, browser location, and active section upon page refresh.'}
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  id="switch-auto-scroll-refresh"
                  aria-checked={autoScrollOnRefresh}
                  aria-label="Toggle Auto-Scroll on Refresh / रिफ्रेश ऑटो-स्क्रॉल"
                  onClick={() => {
                    const nextState = !autoScrollOnRefresh;
                    if (typeof setAutoScrollOnRefresh === 'function') {
                      setAutoScrollOnRefresh(nextState);
                    }
                    if (soundEnabled) {
                      try {
                        if (typeof soundFX.toggle === 'function') {
                          soundFX.toggle();
                        } else if (typeof soundFX.click === 'function') {
                          soundFX.click();
                        } else if (typeof soundFX.playHapticClick === 'function') {
                          soundFX.playHapticClick();
                        }
                      } catch {}
                    }
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent,#FF4D6D)]/40 ${
                    autoScrollOnRefresh ? 'bg-[var(--theme-accent,#FF4D6D)]' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                      autoScrollOnRefresh ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/80 text-[11px] text-stone-500 dark:text-stone-400">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${autoScrollOnRefresh ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
                  <span>
                    {autoScrollOnRefresh
                      ? 'Preserves scroll coordinates & restores exact viewport state on reload'
                      : 'Restores browser viewport to top (0, 0) Hero on reload'}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-stone-400 dark:text-stone-500">
                  Key: portfolio_auto_scroll_on_refresh
                </div>
              </div>
            </div>
          </div>

          {/* 1-Click Reset to Factory Defaults */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#FF4D6D]" />
                <span>Reset Visuals to Default</span>
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Atomically restore Audio, Cursor, Hero, Startup, and Display & Visual parameters to clean factory defaults
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                resetDefaults();
                if (soundEnabled) soundFX.playCrystalChime();
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-[#FF4D6D] text-stone-700 hover:text-white dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-[#FF4D6D] dark:hover:text-white font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-97"
              aria-label="Reset Visuals to Default"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Visuals to Default</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: AI & CHAT STUDIO                                                   */}
      {/* ========================================================================= */}
      {(effectiveActiveTab === 'chat' || activeTab === 'chat') && (
        <div
          role="tabpanel"
          id="panel-chat"
          aria-labelledby="tab-chat"
          tabIndex={0}
          className="flex flex-col gap-6 focus:outline-none animate-fadeIn"
        >
          {/* Tab Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                <BotMessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#18181B] dark:text-white">
                    AI & On-Device Chat Studio
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    {getModelTag()}
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Configure local neural models, trigger strategies, generation parameters, voice, and privacy.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (soundEnabled) {
                  try { soundFX.playReset?.(); } catch {}
                  try { soundFX.playCrystalChime?.(); } catch {}
                }
                resetChatSettings();
              }}
              className="self-start sm:self-center px-3 py-1.5 text-xs font-bold rounded-xl bg-stone-100 hover:bg-indigo-600 hover:text-white text-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-indigo-600 dark:hover:text-white transition-all flex items-center gap-1.5 border border-stone-200 dark:border-stone-700 cursor-pointer shadow-xs active:scale-95"
              title="Reset Chat Settings to Factory Defaults"
              aria-label="Reset AI Chat Settings to Default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Chat Settings</span>
            </button>
          </div>

          {/* CLUSTER 1: MODEL & EXECUTION ENGINE */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800/80">
              <div>
                <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-indigo-500" />
                  <span>Model & Execution Engine</span>
                  <span className="text-xs font-normal text-stone-500 dark:text-stone-400">/ मॉडल और निष्पादन इंजन</span>
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Choose between zero-download deterministic RAG, auto tier detection, or dedicated on-device neural weights.
                </p>
              </div>
              <div className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                Backend: {(chatSettings?.executionBackend || 'webgpu').toUpperCase()}
              </div>
            </div>

            {/* Model Selection Cards */}
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2.5 block">
                Model Selector & Hardware Tier:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {AI_MODEL_CARDS.map((card) => {
                  const isSelected = (chatSettings?.modelId || 'auto') === card.id;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => {
                        updateChatSettings({ modelId: card.id });
                        if (soundEnabled) soundFX.playHapticClick?.();
                      }}
                      className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer relative flex flex-col justify-between border ${
                        isSelected
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-500 ring-2 ring-indigo-500/30 shadow-xs'
                          : 'bg-white/60 dark:bg-white/[0.03] border-stone-200 dark:border-stone-800 hover:border-indigo-300 dark:hover:border-indigo-800 hover:bg-white dark:hover:bg-white/[0.05]'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className="text-xs font-bold text-[#18181B] dark:text-white leading-tight">
                            {card.name}
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${card.badgeColor}`}>
                            {card.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                          {card.desc}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-100 dark:border-stone-800/80 text-[10px]">
                        <span className="font-mono text-stone-400 dark:text-stone-500">{card.spec}</span>
                        <span className={`font-bold ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-stone-400'}`}>
                          {isSelected ? '✓ Selected' : card.size}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Load Trigger Strategy (Segmented Radio Bar) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Load Trigger Strategy:
                </label>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                  {(chatSettings?.loadTrigger || 'on_demand') === 'on_demand' && 'Smart fallback on 1st message'}
                  {chatSettings?.loadTrigger === 'on_page_load' && 'Pre-warms weights on page load'}
                  {chatSettings?.loadTrigger === 'on_open' && 'Starts loading on chat open'}
                  {chatSettings?.loadTrigger === 'manual' && 'Manual user trigger only'}
                </span>
              </div>
              <div
                className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-stone-100 dark:bg-black/40 rounded-xl border border-stone-200 dark:border-stone-800"
                role="radiogroup"
                aria-label="Load Trigger Strategy"
              >
                {[
                  { id: 'on_demand', label: 'On-Demand', subtitle: 'Smart Fallback' },
                  { id: 'on_page_load', label: 'On Page Load', subtitle: 'Pre-warm' },
                  { id: 'on_open', label: 'On Chat Open', subtitle: 'Window Open' },
                  { id: 'manual', label: 'Manual Only', subtitle: 'Explicit' }
                ].map((trig) => {
                  const isSelected = (chatSettings?.loadTrigger || 'on_demand') === trig.id;
                  return (
                    <button
                      key={trig.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => {
                        updateChatSettings({ loadTrigger: trig.id });
                        if (soundEnabled) soundFX.playHapticClick?.();
                      }}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                      }`}
                    >
                      <div>{trig.label}</div>
                      <div className={`text-[10px] font-normal ${isSelected ? 'text-indigo-200' : 'text-stone-400 dark:text-stone-500'}`}>
                        {trig.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Download Consent Policy & Hardware Acceleration Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-100 dark:border-stone-800/80">
              {/* Consent Policy */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">
                  Download Consent Policy:
                </label>
                <div
                  className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 dark:bg-black/40 rounded-xl border border-stone-200 dark:border-stone-800"
                  role="radiogroup"
                  aria-label="Download Consent Policy"
                >
                  {[
                    { id: 'always_ask', label: 'Always Ask' },
                    { id: 'auto_confirm', label: 'Auto-Confirm' },
                    { id: 'wifi_only', label: 'Wi-Fi Only' }
                  ].map((pol) => {
                    const isSelected = (chatSettings?.consentMode || 'always_ask') === pol.id;
                    return (
                      <button
                        key={pol.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => {
                          updateChatSettings({ consentMode: pol.id });
                          if (soundEnabled) soundFX.playHapticClick?.();
                        }}
                        className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                        }`}
                      >
                        {pol.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hardware Acceleration (WebGPU vs WASM) Switch */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-stone-200/70 dark:border-white/5">
                <div>
                  <div className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                    <span>WebGPU Acceleration</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {(chatSettings?.executionBackend || 'webgpu') === 'webgpu'
                      ? 'GPU Shader Pipeline Active'
                      : 'Fallback to CPU WASM / Int8'}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={(chatSettings?.executionBackend || 'webgpu') === 'webgpu'}
                  aria-label="Toggle WebGPU Hardware Acceleration"
                  onClick={() => {
                    const nextBackend = (chatSettings?.executionBackend || 'webgpu') === 'webgpu' ? 'wasm' : 'webgpu';
                    updateChatSettings({ executionBackend: nextBackend });
                    if (soundEnabled) soundFX.playHapticClick?.();
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
                    (chatSettings?.executionBackend || 'webgpu') === 'webgpu' ? 'bg-indigo-600' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                      (chatSettings?.executionBackend || 'webgpu') === 'webgpu' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Cache Management Info & Clear Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-100 dark:border-stone-800/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-stone-600 dark:text-stone-300">
                  Cache Retention: <strong className="font-mono text-stone-900 dark:text-white">{chatSettings?.cacheRetentionDays || 30} Days</strong> (Browser CacheStorage)
                </span>
                {purgeStatus && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-fadeIn">
                    • {purgeStatus}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleClearModelCache}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-all flex items-center gap-1.5 border border-stone-200 dark:border-stone-700 cursor-pointer shadow-xs active:scale-95"
                title="Clear cached ONNX / Web-LLM model weights from browser storage"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Clear Model Cache</span>
              </button>
            </div>
          </div>

          {/* CLUSTER 2: GENERATION & PERSONALITY CONTROLS */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800/80">
              <div>
                <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Generation & Personality Controls</span>
                  <span className="text-xs font-normal text-stone-500 dark:text-stone-400">/ जेनरेशन और व्यक्तित्व नियंत्रण</span>
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Fine-tune response streaming, creativity temperature, maximum output length, and assistant tone.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Response Streaming Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-stone-200/70 dark:border-white/5">
                <div>
                  <div className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                    <span>Response Streaming</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {(chatSettings?.streamResponse ?? true) ? 'Typewriter token-by-token effect' : 'Immediate full-block message output'}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={chatSettings?.streamResponse ?? true}
                  aria-label="Toggle Response Streaming"
                  onClick={() => {
                    updateChatSettings({ streamResponse: !(chatSettings?.streamResponse ?? true) });
                    if (soundEnabled) soundFX.playHapticClick?.();
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-500/40 ${
                    (chatSettings?.streamResponse ?? true) ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                      (chatSettings?.streamResponse ?? true) ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Max Tokens Slider */}
              <div className="flex flex-col justify-between p-3.5 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-stone-200/70 dark:border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="slider-max-tokens" className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-500" />
                    <span>Max Output Tokens:</span>
                  </label>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-stone-200/60 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                    {chatSettings?.maxTokens || 512} tokens
                  </span>
                </div>
                <input
                  id="slider-max-tokens"
                  type="range"
                  min={128}
                  max={1024}
                  step={64}
                  value={chatSettings?.maxTokens || 512}
                  onChange={(e) => {
                    updateChatSettings({ maxTokens: Number(e.target.value) });
                  }}
                  className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  aria-label="Max Output Tokens"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>128 (Snappy)</span>
                  <span>512 (Standard)</span>
                  <span>1024 (Deep)</span>
                </div>
              </div>
            </div>

            {/* Creativity / Temperature Slider */}
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-stone-200/70 dark:border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="slider-temperature" className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Creativity / Temperature:</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    {getTemperatureBadge(chatSettings?.temperature)}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-stone-200/60 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                    {(chatSettings?.temperature ?? 0.7).toFixed(2)}
                  </span>
                </div>
              </div>
              <input
                id="slider-temperature"
                type="range"
                min={0.0}
                max={1.2}
                step={0.05}
                value={chatSettings?.temperature ?? 0.7}
                onChange={(e) => {
                  updateChatSettings({ temperature: Number(e.target.value) });
                }}
                className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                aria-label="Creativity / Temperature"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>0.0 (Deterministic / Code)</span>
                <span>0.7 (Balanced)</span>
                <span>1.2 (Highly Creative)</span>
              </div>
            </div>

            {/* Tone & Persona Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">
                Tone & Persona Style:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'helpful_pro', label: 'Helpful Pro', desc: 'Polite, structured & concise' },
                  { id: 'concise_technical', label: 'Concise Technical', desc: 'Code-first & direct' },
                  { id: 'creative_mentor', label: 'Creative Mentor', desc: 'Insightful & pedagogical' },
                  { id: 'casual_peer', label: 'Casual Peer', desc: 'Friendly & conversational' }
                ].map((tone) => {
                  const isSelected = (chatSettings?.personaTone || 'helpful_pro') === tone.id;
                  return (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => {
                        updateChatSettings({ personaTone: tone.id });
                        if (soundEnabled) soundFX.playHapticClick?.();
                      }}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/40 text-[#18181B] dark:text-white'
                          : 'bg-white/40 dark:bg-white/[0.02] border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-white/80 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="text-xs font-bold">{tone.label}</div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">{tone.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CLUSTER 3: VOICE & SOUND STUDIO */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800/80">
              <div>
                <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-500" />
                  <span>Voice & Sound Studio</span>
                  <span className="text-xs font-normal text-stone-500 dark:text-stone-400">/ आवाज और ऑडियो स्टूडियो</span>
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Configure Web Speech API text-to-speech narration, voice timbre, speech rate, and chat sound effects.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Speech Synthesis (TTS) Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-stone-200/70 dark:border-white/5">
                <div>
                  <div className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Speech Synthesis (TTS)</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {chatSettings?.ttsEnabled ? 'Reads assistant replies aloud' : 'Text-only silent reading mode'}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={chatSettings?.ttsEnabled ?? false}
                  aria-label="Toggle Speech Synthesis"
                  onClick={() => {
                    updateChatSettings({ ttsEnabled: !(chatSettings?.ttsEnabled ?? false) });
                    if (soundEnabled) soundFX.playHapticClick?.();
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    chatSettings?.ttsEnabled ? 'bg-emerald-500' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                      chatSettings?.ttsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Chat Sound Effects Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-stone-200/70 dark:border-white/5">
                <div>
                  <div className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Chat Sound Effects</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {(chatSettings?.chatSoundEffects ?? true)
                      ? 'Synthesizer blips on send/receive/chips'
                      : 'Silent message interaction'}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={chatSettings?.chatSoundEffects ?? true}
                  aria-label="Toggle Chat Sound Effects"
                  onClick={() => {
                    updateChatSettings({ chatSoundEffects: !(chatSettings?.chatSoundEffects ?? true) });
                    if (soundEnabled) soundFX.playHapticClick?.();
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    (chatSettings?.chatSoundEffects ?? true) ? 'bg-emerald-500' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                      (chatSettings?.chatSoundEffects ?? true) ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Voice Selection & Test Button */}
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-stone-200/70 dark:border-white/5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label htmlFor="select-chat-voice" className="text-xs font-bold text-[#18181B] dark:text-white">
                  System Speech Voice:
                </label>
                <button
                  type="button"
                  onClick={handleTestVoice}
                  className="self-start sm:self-center px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-1.5 border border-emerald-500/30 cursor-pointer shadow-xs active:scale-95"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Test Voice Sample</span>
                </button>
              </div>
              <select
                id="select-chat-voice"
                value={chatSettings?.voiceId || 'default'}
                onChange={(e) => {
                  updateChatSettings({ voiceId: e.target.value });
                }}
                className="w-full text-xs p-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[#18181B] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="default">Default System Voice</option>
                {availableVoices.map((v, i) => (
                  <option key={v.voiceURI || `${v.name}-${i}`} value={v.voiceURI || v.name}>
                    {v.name} ({v.lang}) {v.default ? '★' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Pitch & Rate Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Voice Speed / Rate */}
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-stone-200/70 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="slider-voice-rate" className="text-xs font-bold text-[#18181B] dark:text-white">
                    Voice Speed:
                  </label>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-stone-200/60 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                    {(chatSettings?.voiceRate || 1.0).toFixed(2)}x
                  </span>
                </div>
                <input
                  id="slider-voice-rate"
                  type="range"
                  min={0.7}
                  max={1.5}
                  step={0.05}
                  value={chatSettings?.voiceRate || 1.0}
                  onChange={(e) => {
                    updateChatSettings({ voiceRate: Number(e.target.value) });
                  }}
                  className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  aria-label="Voice Speed"
                />
                <div className="flex justify-between text-[10px] text-stone-400">
                  <span>0.7x (Deliberate)</span>
                  <span>1.0x (Normal)</span>
                  <span>1.5x (Brisk)</span>
                </div>
              </div>

              {/* Voice Pitch */}
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-stone-200/70 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="slider-voice-pitch" className="text-xs font-bold text-[#18181B] dark:text-white">
                    Voice Pitch:
                  </label>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-stone-200/60 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                    {(chatSettings?.voicePitch || 1.0).toFixed(2)}x
                  </span>
                </div>
                <input
                  id="slider-voice-pitch"
                  type="range"
                  min={0.5}
                  max={1.5}
                  step={0.05}
                  value={chatSettings?.voicePitch || 1.0}
                  onChange={(e) => {
                    updateChatSettings({ voicePitch: Number(e.target.value) });
                  }}
                  className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  aria-label="Voice Pitch"
                />
                <div className="flex justify-between text-[10px] text-stone-400">
                  <span>0.5x (Deep)</span>
                  <span>1.0x (Balanced)</span>
                  <span>1.5x (Bright)</span>
                </div>
              </div>
            </div>
          </div>

          {/* CLUSTER 4: PRIVACY & STORAGE TOOLS */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800/80">
              <div>
                <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-500" />
                  <span>Privacy & Storage Tools</span>
                  <span className="text-xs font-normal text-stone-500 dark:text-stone-400">/ गोपनीयता और स्टोरेज टूल्स</span>
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Control conversation persistence, wipe local chat memory, or export transcripts as Markdown/JSON.
                </p>
              </div>
            </div>

            {/* Session Retention Strategy */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">
                Session History Retention:
              </label>
              <div
                className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-stone-100 dark:bg-black/40 rounded-xl border border-stone-200 dark:border-stone-800"
                role="radiogroup"
                aria-label="Session Retention Policy"
              >
                {[
                  { id: 'ephemeral', label: 'Ephemeral', sub: 'In-memory only' },
                  { id: 'until_closed', label: 'Until Tab Closed', sub: 'SessionStorage' },
                  { id: 'persistent_7d', label: '7 Days', sub: 'Auto-expires' },
                  { id: 'persistent_30d', label: '30 Days', sub: 'Extended' }
                ].map((ret) => {
                  const isSelected = (chatSettings?.sessionRetention || 'until_closed') === ret.id;
                  return (
                    <button
                      key={ret.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => {
                        updateChatSettings({ sessionRetention: ret.id });
                        if (soundEnabled) soundFX.playHapticClick?.();
                      }}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                      }`}
                    >
                      <div>{ret.label}</div>
                      <div className={`text-[10px] font-normal ${isSelected ? 'text-cyan-200' : 'text-stone-400 dark:text-stone-500'}`}>
                        {ret.sub}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Anonymize Telemetry Switch */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-stone-200/70 dark:border-white/5">
              <div>
                <div className="text-xs font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Anonymize Local Telemetry</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {(chatSettings?.anonymizeTelemetry ?? true)
                    ? 'Zero PII transmitted; queries processed strictly on-device'
                    : 'Standard diagnostic logs'}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={chatSettings?.anonymizeTelemetry ?? true}
                aria-label="Toggle Anonymize Telemetry"
                onClick={() => {
                  updateChatSettings({ anonymizeTelemetry: !(chatSettings?.anonymizeTelemetry ?? true) });
                  if (soundEnabled) soundFX.playHapticClick?.();
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 ${
                  (chatSettings?.anonymizeTelemetry ?? true) ? 'bg-cyan-600' : 'bg-stone-300 dark:bg-stone-700'
                }`}
              >
                <span
                  className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    (chatSettings?.anonymizeTelemetry ?? true) ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Actions: Purge Memory + Export Transcripts */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-stone-100 dark:border-stone-800/80">
              <div className="flex items-center gap-2">
                {showPurgeConfirm ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                      Confirm purge?
                    </span>
                    <button
                      type="button"
                      onClick={handlePurgeChatMemory}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-all cursor-pointer shadow-xs"
                    >
                      Yes, Wipe
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPurgeConfirm(false)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowPurgeConfirm(true)}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-1.5 border border-rose-500/20 cursor-pointer shadow-xs active:scale-95"
                    title="Permanently erase chat message history and embeddings"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Purge All Chat Memory</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 dark:text-stone-400 hidden sm:inline">Export:</span>
                <button
                  type="button"
                  onClick={() => handleExportChatHistory('md')}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-stone-100 hover:bg-cyan-600 hover:text-white text-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-cyan-600 dark:hover:text-white transition-all flex items-center gap-1.5 border border-stone-200 dark:border-stone-700 cursor-pointer shadow-xs active:scale-95"
                  title="Download conversation transcript as Markdown file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export (.md)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExportChatHistory('json')}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-stone-100 hover:bg-cyan-600 hover:text-white text-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-cyan-600 dark:hover:text-white transition-all flex items-center gap-1.5 border border-stone-200 dark:border-stone-700 cursor-pointer shadow-xs active:scale-95"
                  title="Download conversation data as structured JSON file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export (.json)</span>
                </button>
              </div>
            </div>
          </div>

          {/* CLUSTER 5: UI & ERGONOMICS */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800/80">
              <div>
                <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-purple-500" />
                  <span>UI & Ergonomics</span>
                  <span className="text-xs font-normal text-stone-500 dark:text-stone-400">/ यूजर इंटरफेस और एर्गोनॉमिक्स</span>
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Customize chat modal dimensions, greeting behaviors, interactive prompt chips, and slash command palette.
                </p>
              </div>
            </div>

            {/* Default Window Size Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">
                Default Window Size:
              </label>
              <div
                className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-stone-100 dark:bg-black/40 rounded-xl border border-stone-200 dark:border-stone-800"
                role="radiogroup"
                aria-label="Default Window Size"
              >
                {[
                  { id: 'compact', label: 'Compact', sub: '360px' },
                  { id: 'normal', label: 'Normal', sub: '420px (Default)' },
                  { id: 'expanded', label: 'Expanded 2-Col', sub: '640px' },
                  { id: 'fullscreen', label: 'Fullscreen', sub: 'Viewport' }
                ].map((size) => {
                  const isSelected = (chatSettings?.defaultWindowSize || 'normal') === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => {
                        updateChatSettings({ defaultWindowSize: size.id });
                        if (soundEnabled) soundFX.playHapticClick?.();
                      }}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                      }`}
                    >
                      <div>{size.label}</div>
                      <div className={`text-[10px] font-normal ${isSelected ? 'text-purple-200' : 'text-stone-400 dark:text-stone-500'}`}>
                        {size.sub}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3 Interactive Toggles: Auto-Greet, Suggestion Chips, Slash Commands */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Auto-Greet on Open */}
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-stone-200/70 dark:border-white/5 flex flex-col justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-[#18181B] dark:text-white">Auto-Greet on Open</div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                    Displays friendly greeting and contextual intro on open
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-200/50 dark:border-white/5">
                  <span className="text-[10px] font-mono text-stone-400">
                    {(chatSettings?.autoGreetOnOpen ?? true) ? 'Active' : 'Silent'}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={chatSettings?.autoGreetOnOpen ?? true}
                    aria-label="Toggle Auto-Greet on Open"
                    onClick={() => {
                      updateChatSettings({ autoGreetOnOpen: !(chatSettings?.autoGreetOnOpen ?? true) });
                      if (soundEnabled) soundFX.playHapticClick?.();
                    }}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/40 ${
                      (chatSettings?.autoGreetOnOpen ?? true) ? 'bg-purple-600' : 'bg-stone-300 dark:bg-stone-700'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                        (chatSettings?.autoGreetOnOpen ?? true) ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Suggestion Chips */}
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-stone-200/70 dark:border-white/5 flex flex-col justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-[#18181B] dark:text-white">Suggestion Chips</div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                    Quick prompt pills: Projects, Resume, Tech Stack, Hire
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-200/50 dark:border-white/5">
                  <span className="text-[10px] font-mono text-stone-400">
                    {(chatSettings?.suggestionChipsEnabled ?? true) ? 'Visible' : 'Hidden'}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={chatSettings?.suggestionChipsEnabled ?? true}
                    aria-label="Toggle Suggestion Chips"
                    onClick={() => {
                      updateChatSettings({ suggestionChipsEnabled: !(chatSettings?.suggestionChipsEnabled ?? true) });
                      if (soundEnabled) soundFX.playHapticClick?.();
                    }}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/40 ${
                      (chatSettings?.suggestionChipsEnabled ?? true) ? 'bg-purple-600' : 'bg-stone-300 dark:bg-stone-700'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                        (chatSettings?.suggestionChipsEnabled ?? true) ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Slash Commands */}
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-stone-200/70 dark:border-white/5 flex flex-col justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-[#18181B] dark:text-white">Slash Commands</div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                    Autocomplete palette on typing &apos;/&apos; (/help, /skills, /theme)
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-200/50 dark:border-white/5">
                  <span className="text-[10px] font-mono text-stone-400">
                    {(chatSettings?.slashCommandsEnabled ?? true) ? 'Enabled' : 'Disabled'}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={chatSettings?.slashCommandsEnabled ?? true}
                    aria-label="Toggle Slash Commands"
                    onClick={() => {
                      updateChatSettings({ slashCommandsEnabled: !(chatSettings?.slashCommandsEnabled ?? true) });
                      if (soundEnabled) soundFX.playHapticClick?.();
                    }}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/40 ${
                      (chatSettings?.slashCommandsEnabled ?? true) ? 'bg-purple-600' : 'bg-stone-300 dark:bg-stone-700'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                        (chatSettings?.slashCommandsEnabled ?? true) ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 1-Click Reset to Factory Defaults for AI & Chat Studio */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-indigo-500" />
                <span>Reset AI & Chat Studio to Default</span>
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Atomically restore all neural model, generation parameters, voice studio, privacy, and ergonomics to defaults
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                resetChatSettings();
                if (soundEnabled) {
                  try { soundFX.playCrystalChime?.(); } catch {}
                }
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-indigo-600 text-stone-700 hover:text-white dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-indigo-600 dark:hover:text-white font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-97"
              aria-label="Reset AI & Chat Studio to Default"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset AI & Chat Studio</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

