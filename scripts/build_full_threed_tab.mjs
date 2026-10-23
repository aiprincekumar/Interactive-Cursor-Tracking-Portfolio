import fs from 'fs';
import path from 'path';

const panelPath = path.resolve('src/components/ControlCenterPanel.jsx');
let src = fs.readFileSync(panelPath, 'utf8');

// 1. Update imports
const importTarget = `  Mic,
  MicOff
} from 'lucide-react';`;

const importReplacement = `  Mic,
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
  Code
} from 'lucide-react';`;

if (!src.includes(importTarget)) {
  console.error('Import target not found!');
  process.exit(1);
}
src = src.replace(importTarget, importReplacement);

// 2. Add Constants before export default function ControlCenterPanel
const constTarget = `export default function ControlCenterPanel({ variant = 'workbench' }) {`;

const constReplacement = `const THREED_CATEGORIES = [
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

export default function ControlCenterPanel({ variant = 'workbench' }) {`;

src = src.replace(constTarget, constReplacement);

// 3. Add useLab destructuring & 3D state in ControlCenterPanel
const labDestructTarget = `    // State & Meta
    activeTab,
    setActiveTab,
    resetDefaults
  } = lab;`;

const labDestructReplacement = `    // 3D Controls
    threeD,
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

    // State & Meta
    activeTab,
    setActiveTab,
    resetDefaults
  } = lab;

  const [expandedAccordion, setExpandedAccordion] = useState('elements');
  const toggleAccordionSection = useCallback((secKey) => {
    setExpandedAccordion((prev) => (prev === secKey ? null : secKey));
    if (soundEnabled) soundFX.playHapticClick();
  }, [soundEnabled]);

  const [sandboxTilt, setSandboxTilt] = useState({ rotX: 16, rotY: -20 });
  const [isDraggingSandbox, setIsDraggingSandbox] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, rotX: 16, rotY: -20 });

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
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const sens = ((threeD?.camera?.tiltSensitivity ?? 15) / 15);
    const newRotX = Math.min(Math.max(dragStartRef.current.rotX - dy * 0.4 * sens, -60), 60);
    const newRotY = Math.min(Math.max(dragStartRef.current.rotY + dx * 0.4 * sens, -75), 75);
    setSandboxTilt({ rotX: Math.round(newRotX), rotY: Math.round(newRotY) });
  }, [isDraggingSandbox, threeD?.camera?.tiltSensitivity]);

  const handleSandboxPointerUp = useCallback((e) => {
    if (isDraggingSandbox) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe release
      }
      setIsDraggingSandbox(false);
    }
  }, [isDraggingSandbox]);

  const resetSandboxView = useCallback(() => {
    setSandboxTilt({ rotX: 16, rotY: -20 });
    if (soundEnabled) soundFX.playHapticClick();
  }, [soundEnabled]);

  const [expandedCategories, setExpandedCategories] = useState({
    nav: true,
    hero: true,
    containers: true
  });

  const toggleCategory = (catKey) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catKey]: !prev[catKey]
    }));
    if (soundEnabled) soundFX.playHapticClick();
  };`;

src = src.replace(labDestructTarget, labDestructReplacement);

// 4. Add 3D Tab to tabs array
const tabsTarget = `  const tabs = [
    { id: 'audio', label: 'Audio Studio', icon: Volume2, tag: soundEnabled ? \`\${Math.round(masterVolume * 100)}%\` : 'Muted' },
    { id: 'cursor', label: 'Cursor & Dynamics', icon: Sparkles, tag: customCursorEnabled ? \`\${cursorScale.toFixed(1)}x\` : 'Native' },
    { id: 'hero', label: 'Hero & Character', icon: User, tag: gazeMode === 'fixed' ? 'Fixed' : 'Auto' },
    { id: 'preferences', label: 'Startup & Preferences', icon: Settings, tag: defaultStartupRole },
    { id: 'visuals', label: 'Display & Visuals', icon: Palette, tag: getAccentName(accentColor) }
  ];`;

const tabsReplacement = `  const threeDConfig = threeD || lab.threeDConfig || {
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
  const current3DElements = threeDConfig.elements || {};
  const active3DCount = Object.values(current3DElements).filter(Boolean).length;
  const currentMasterTheme = threeDConfig.masterTheme || 'apple-glass';
  const showSandboxPreview = threeDConfig.showSandboxPreview !== false;
  const clusterFilter = threeDConfig.clusterFilter || 'all';
  const lighting = threeDConfig.lighting || { preset: 'studio-soft', angle: 45, cursorLight: true, shadowSoftness: 0.7 };
  const camera = threeDConfig.camera || { anglePreset: 'isometric', perspectiveFOV: 1000, tiltSensitivity: 15, autoOrbit: false, orbitSpeed: 1.0 };
  const materials = threeDConfig.materials || { preset: 'glass-acrylic', specularGlow: 0.6, bevelExtrusion: 3 };
  const physics = threeDConfig.physics || { hoverPop: 12, clickDepression: true, elasticity: 'snappy', magneticPull: false };
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
      link.download = \`threed-portfolio-config-\${new Date().toISOString().slice(0, 10)}.json\`;
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

  const tabs = [
    { id: 'audio', label: 'Audio Studio', icon: Volume2, tag: soundEnabled ? \`\${Math.round(masterVolume * 100)}%\` : 'Muted' },
    { id: 'cursor', label: 'Cursor & Dynamics', icon: Sparkles, tag: customCursorEnabled ? \`\${cursorScale.toFixed(1)}x\` : 'Native' },
    { id: 'hero', label: 'Hero & Character', icon: User, tag: gazeMode === 'fixed' ? 'Fixed' : 'Auto' },
    { id: 'threed', label: '3D Controls', icon: Box, tag: isMaster3DOn ? \`\${active3DCount}/10 On\` : '2D Mode' },
    { id: 'preferences', label: 'Startup & Preferences', icon: Settings, tag: defaultStartupRole },
    { id: 'visuals', label: 'Display & Visuals', icon: Palette, tag: getAccentName(accentColor) }
  ];`;

src = src.replace(tabsTarget, tabsReplacement);

// 5. Build and insert the entire 3D Tab JSX
const fullThreeDTabJsx = `
      {/* ========================================================================= */}
      {/* TAB 3D: NEXT-LEVEL 3D CONTROL SUITE (9 SECTIONS ACROSS 3 CLUSTERS)        */}
      {/* ========================================================================= */}
      {activeTab === 'threed' && (
        <div
          role="tabpanel"
          id="panel-threed"
          aria-labelledby="tab-threed"
          tabIndex={0}
          className="flex flex-col gap-6 focus:outline-none animate-fadeIn"
        >
          {/* 1. Master 3D Control & Global Theme Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-base font-bold text-[#18181B] dark:text-white flex items-center gap-2">
                    <Box className="w-5 h-5 text-[#FF4D6D]" />
                    <span>Master 3D Mode</span>
                  </h4>
                  <span
                    className={\`text-[11px] font-bold px-2 py-0.5 rounded-full border transition-all \${
                      isMaster3DOn
                        ? 'bg-[#FF4D6D]/15 text-[#FF4D6D] border-[#FF4D6D]/30'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-500 border-stone-200 dark:border-stone-700'
                    }\`}
                  >
                    {isMaster3DOn ? '3D Active' : 'Classic 2D'}
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Global switch to activate volumetric Z-plane extrusion, lighting, tilt &amp; spatial physics across the portfolio
                </p>
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
                className={\`w-14 h-8 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]/40 shrink-0 \${
                  isMaster3DOn ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
                }\`}
              >
                <span
                  className={\`block w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 \${
                    isMaster3DOn ? 'translate-x-7' : 'translate-x-1'
                  }\`}
                />
              </button>
            </div>

            {/* Quick Master Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-stone-100 dark:border-stone-800/80">
              <button
                type="button"
                onClick={() => {
                  enableAll3D();
                  if (soundEnabled) soundFX.playLaserFocus();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#FF4D6D]/15 text-stone-700 hover:text-[#FF4D6D] dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-[#FF4D6D]/20 dark:hover:text-[#FF4D6D] text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <ToggleRight className="w-3.5 h-3.5" />
                <span>Enable All 3D</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  disableAll3D();
                  if (soundEnabled) soundFX.playHapticClick();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <ToggleLeft className="w-3.5 h-3.5" />
                <span>Disable All 2D</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  reset3DDefaults();
                  if (soundEnabled) soundFX.playCrystalChime();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
                <span>Reset Defaults</span>
              </button>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-stone-500 font-medium">Active:</span>
                <span className="text-xs font-mono font-bold text-[#FF4D6D] bg-[#FF4D6D]/10 px-2 py-0.5 rounded-full border border-[#FF4D6D]/20">
                  {active3DCount} / 10 Elements
                </span>
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
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => {
                        set3DTheme(th.id);
                        if (soundEnabled) soundFX.playLaserFocus();
                      }}
                      className={\`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer \${
                        isSelected
                          ? 'bg-[#FF4D6D]/10 border-[#FF4D6D] ring-2 ring-[#FF4D6D]/30 shadow-xs text-[#18181B] dark:text-white'
                          : 'bg-white/40 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                      }\`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-xs font-bold flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-[#FF4D6D]" />
                          <span>{th.name}</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#FF4D6D]" />}
                      </div>
                      <span className="text-[10px] text-stone-400 leading-snug">
                        {th.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Interactive Mini 3D Sandbox Preview Card */}
          <div className="rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] bg-white/70 dark:bg-[#181226]/70 backdrop-blur-md overflow-hidden shadow-xs transition-all">
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#ECE7DF]/70 dark:border-[#2D2340]/70 bg-white/80 dark:bg-[#1D162E]/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center font-bold text-sm">
                  <Maximize2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white">
                      Interactive 3D Sandbox Preview
                    </h5>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                      Live Simulation
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Click &amp; drag card below to dynamically test live 3D perspective, tilt, shadow falloff &amp; exploded layers
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShow3DSandbox(!showSandboxPreview);
                  if (soundEnabled) soundFX.playHapticClick();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/80 dark:bg-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {showSandboxPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showSandboxPreview ? 'Hide Sandbox' : 'Show Sandbox'}</span>
              </button>
            </div>

            {showSandboxPreview && (
              <div className="p-4 sm:p-6 flex flex-col gap-4">
                <div
                  onPointerDown={handleSandboxPointerDown}
                  onPointerMove={handleSandboxPointerMove}
                  onPointerUp={handleSandboxPointerUp}
                  onPointerCancel={handleSandboxPointerUp}
                  className="w-full h-64 sm:h-72 rounded-2xl bg-gradient-to-br from-stone-100 via-stone-50 to-stone-200 dark:from-[#110B1D] dark:via-[#19112B] dark:to-[#0F0A1A] border border-stone-200/80 dark:border-stone-800 flex items-center justify-center relative overflow-hidden select-none cursor-grab active:cursor-grabbing touch-none"
                  style={{
                    perspective: \`\${threeDConfig.camera.perspectiveFOV || 1000}px\`
                  }}
                >
                  {/* Skybox & Atmosphere layer */}
                  <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_center,rgba(0,242,254,0.12)_0%,transparent_70%)]" />

                  {/* Volumetric Fog overlay */}
                  {environment.fogDensity > 0 && (
                    <div
                      className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.4)',
                        backdropFilter: \`blur(\${Math.round(environment.fogDensity * 0.08)}px)\`,
                        opacity: environment.fogDensity / 100
                      }}
                    />
                  )}

                  {/* Stardust particles simulation */}
                  {environment.stardustParticles && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      {[15, 30, 45, 60, 75, 90].map((leftPct, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 rounded-full bg-cyan-400/60 animate-pulse"
                          style={{
                            left: \`\${leftPct}%\`,
                            top: \`\${(i * 17) % 85 + 5}%\`,
                            animationDelay: \`\${i * 0.4}s\`,
                            transform: \`translateZ(\${(i % 3) * 15}px)\`
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* 3D Sandbox Object */}
                  <div
                    style={{
                      transform: isMaster3DOn
                        ? \`rotateX(\${sandboxTilt.rotX}deg) rotateY(\${sandboxTilt.rotY}deg) scale(1.04)\`
                        : 'none',
                      transformStyle: 'preserve-3d',
                      transition: isDraggingSandbox ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
                    }}
                    className="relative w-64 h-40 sm:w-72 sm:h-44 rounded-2xl flex flex-col justify-between p-4 shadow-2xl transition-shadow"
                  >
                    {/* Exploded Strata Layer 1 (Base Chassis) */}
                    {exploded.enabled && (
                      <div
                        className="absolute inset-0 rounded-2xl border border-cyan-500/40 bg-cyan-950/20 backdrop-blur-xs pointer-events-none"
                        style={{
                          transform: \`translateZ(-\${exploded.separationDistance}px)\`,
                          opacity: exploded.ghostOpacity || 0.4
                        }}
                      >
                        <div className="p-2 text-[9px] font-mono text-cyan-400">
                          BASE CHASSIS [STRATA -01]
                        </div>
                      </div>
                    )}

                    {/* Exploded Strata Layer 2 (CAD Logic & Blueprint Wireframe) */}
                    {exploded.enabled && exploded.blueprintMode && (
                      <div
                        className="absolute inset-0 rounded-2xl border-2 border-dashed border-cyan-400/50 bg-cyan-900/10 pointer-events-none"
                        style={{
                          transform: \`translateZ(-\${Math.round(exploded.separationDistance * 0.5)}px)\`
                        }}
                      >
                        <div className="p-2 text-[9px] font-mono text-cyan-300">
                          SCHEMATIC WIREFRAME [Z: -\${Math.round(exploded.separationDistance * 0.5)}px]
                        </div>
                      </div>
                    )}

                    {/* Main Interactive Card Face */}
                    <div
                      className={\`absolute inset-0 rounded-2xl border transition-all \${
                        exploded.blueprintMode
                          ? 'border-cyan-400 bg-cyan-950/70 shadow-[0_0_20px_rgba(0,242,254,0.3)]'
                          : isMaster3DOn
                            ? 'border-white/40 dark:border-white/20 bg-white/70 dark:bg-[#1E1730]/80 backdrop-blur-xl shadow-xl'
                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#181226]'
                      }\`}
                      style={{
                        transform: exploded.enabled ? \`translateZ(\${exploded.layerStagger}px)\` : 'translateZ(0px)',
                        boxShadow: isMaster3DOn
                          ? \`0 \${Math.round(materials.bevelExtrusion * 4)}px \${Math.round(materials.bevelExtrusion * 8)}px -4px rgba(0,0,0,0.3)\`
                          : 'none'
                      }}
                    >
                      <div className="p-4 flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#FF4D6D]/20 text-[#FF4D6D] flex items-center justify-center font-bold text-xs">
                              3D
                            </div>
                            <span className="text-xs font-bold text-stone-900 dark:text-white">
                              Spatial Card Preview
                            </span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-200/60 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                            Rot: {sandboxTilt.rotX}°, {sandboxTilt.rotY}°
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <div className="h-2 w-3/4 bg-stone-300/70 dark:bg-stone-700/70 rounded-full" />
                          <div className="h-2 w-1/2 bg-stone-200 dark:bg-stone-800 rounded-full" />
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 pt-2 border-t border-stone-200/50 dark:border-stone-700/50">
                          <span>Intensity: {threeDConfig.depthIntensity}x</span>
                          <span>Preset: {threeDConfig.stylePreset}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 text-[10px] font-mono text-stone-400 dark:text-stone-500 bg-white/70 dark:bg-stone-900/70 px-2.5 py-1 rounded-lg backdrop-blur-xs border border-stone-200/50 dark:border-stone-800/50">
                    Drag to inspect 3D Perspective
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                    <span className={\`w-2 h-2 rounded-full \${isMaster3DOn ? 'bg-emerald-500 animate-ping' : 'bg-stone-400'}\`} />
                    <span>{isMaster3DOn ? 'Active 3D Mode' : '2D Flat Mode'}</span>
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
                  className={\`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer \${
                    isActive
                      ? 'bg-white dark:bg-[#251B3D] text-[#18181B] dark:text-white shadow-xs border border-stone-200 dark:border-stone-700'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                  }\`}
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
                    <span className={\`text-xs font-bold px-2.5 py-0.5 rounded-full border \${
                      active3DCount > 0
                        ? 'bg-[#FF4D6D]/15 text-[#FF4D6D] border-[#FF4D6D]/30'
                        : 'bg-stone-200/60 dark:bg-stone-800 text-stone-400 border-stone-200 dark:border-stone-700'
                    }\`}>
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

                      return (
                        <div
                          key={cat.id}
                          className="rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/50 dark:bg-[#1D162E]/50 overflow-hidden"
                        >
                          <button
                            type="button"
                            onClick={() => toggleCategory(cat.id)}
                            aria-expanded={isCatOpen}
                            className="w-full flex items-center justify-between p-3.5 bg-stone-50/80 dark:bg-[#231A38]/80 hover:bg-stone-100/80 dark:hover:bg-[#281D40] transition-colors cursor-pointer text-left"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-lg bg-[#FF4D6D]/15 text-[#FF4D6D] flex items-center justify-center font-bold text-xs">
                                {cat.num}
                              </span>
                              <div>
                                <h6 className="text-xs sm:text-sm font-bold text-[#18181B] dark:text-white">
                                  {cat.title}
                                </h6>
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
                                    className={\`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 \${
                                      isItemOn
                                        ? 'bg-[#FF4D6D]/10 border-[#FF4D6D]/40 text-[#18181B] dark:text-white'
                                        : 'bg-white/60 dark:bg-[#1F1733]/60 border-stone-200/70 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                                    }\`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div className={\`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 \${
                                        isItemOn
                                          ? 'bg-[#FF4D6D] text-white shadow-2xs'
                                          : 'bg-stone-100 dark:bg-stone-800 text-stone-400'
                                      }\`}>
                                        <ItemIcon className="w-4 h-4" />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="text-xs font-bold truncate">
                                          {item.title}
                                        </div>
                                        <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                                          {item.desc}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                      <span className={\`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded \${
                                        isItemOn
                                          ? 'bg-[#FF4D6D]/20 text-[#FF4D6D]'
                                          : 'bg-stone-200/50 dark:bg-stone-800 text-stone-400'
                                      }\`}>
                                        {isItemOn ? '3D' : '2D'}
                                      </span>

                                      <button
                                        type="button"
                                        role="switch"
                                        aria-checked={isItemOn}
                                        aria-label={\`Toggle 3D for \${item.title}\`}
                                        onClick={() => {
                                          toggle3DElement(item.key);
                                          if (soundEnabled) soundFX.playHapticClick();
                                        }}
                                        className={\`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]/40 \${
                                          isItemOn ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
                                        }\`}
                                      >
                                        <span
                                          className={\`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 \${
                                            isItemOn ? 'translate-x-5' : 'translate-x-0.5'
                                          }\`}
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
                            <button
                              key={lp.id}
                              type="button"
                              onClick={() => {
                                set3DLightingPreset(lp.id);
                                if (soundEnabled) soundFX.playLaserFocus();
                              }}
                              className={\`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer \${
                                isSelected
                                  ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 shadow-xs text-[#18181B] dark:text-white'
                                  : 'bg-white/40 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                              }\`}
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <span className="text-xs font-bold flex items-center gap-1.5">
                                  <Icon className="w-3.5 h-3.5 text-amber-500" />
                                  <span>{lp.name}</span>
                                </span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-amber-500" />}
                              </div>
                              <span className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                                {lp.desc}
                              </span>
                            </button>
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
                            className={\`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer \${
                              lighting.angle === presetAngle.val
                                ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                                : 'bg-white/60 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                            }\`}
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
                          className={\`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/40 shrink-0 \${
                            lighting.cursorLight ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-700'
                          }\`}
                        >
                          <span
                            className={\`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 \${
                              lighting.cursorLight ? 'translate-x-5' : 'translate-x-0.5'
                            }\`}
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

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {CAMERA_PRESETS.map((cp) => {
                          const isSelected = camera.anglePreset === cp.id;
                          return (
                            <button
                              key={cp.id}
                              type="button"
                              onClick={() => {
                                set3DCameraAnglePreset(cp.id);
                                if (soundEnabled) soundFX.playLaserFocus();
                              }}
                              className={\`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer \${
                                isSelected
                                  ? 'bg-cyan-500/10 border-cyan-500 ring-2 ring-cyan-500/30 shadow-xs text-[#18181B] dark:text-white'
                                  : 'bg-white/40 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                              }\`}
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <span className="text-xs font-bold">{cp.name}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-cyan-500" />}
                              </div>
                              <span className="text-[10px] text-stone-400 leading-snug">
                                {cp.desc}
                              </span>
                            </button>
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
                          className={\`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/40 shrink-0 \${
                            camera.autoOrbit ? 'bg-cyan-500' : 'bg-stone-300 dark:bg-stone-700'
                          }\`}
                        >
                          <span
                            className={\`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 \${
                              camera.autoOrbit ? 'translate-x-5' : 'translate-x-0.5'
                            }\`}
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

                      <div className={\`grid \${isDrawer ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'} gap-3\`}>
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
                              onClick={() => {
                                set3DStylePreset(preset.id);
                                if (soundEnabled) soundFX.playLaserFocus();
                              }}
                              className={\`p-3.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer relative group \${
                                isSelected
                                  ? 'bg-[#FF4D6D]/10 border-[#FF4D6D] text-[#18181B] dark:text-white ring-2 ring-[#FF4D6D]/30 shadow-[0_0_15px_-3px_rgba(255,77,109,0.25)] scale-[1.01]'
                                  : 'bg-white/40 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
                              }\`}
                            >
                              <div className="flex items-center justify-between w-full mb-1.5">
                                <span className={\`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors \${
                                  isSelected
                                    ? 'bg-[#FF4D6D]/20 text-[#FF4D6D] border-[#FF4D6D]/30'
                                    : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200/60 dark:border-stone-700/60'
                                }\`}>
                                  {preset.badge}
                                </span>
                                {isSelected && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#FF4D6D] text-white flex items-center gap-1 shadow-2xs">
                                    <Check className="w-3 h-3" />
                                    <span>Active</span>
                                  </span>
                                )}
                              </div>

                              <div>
                                <div className="text-xs font-bold text-[#18181B] dark:text-white">
                                  {preset.name}
                                </div>
                                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                                  {preset.desc}
                                </div>
                              </div>
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
                            <button
                              key={mat.id}
                              type="button"
                              onClick={() => {
                                set3DMaterialPreset(mat.id);
                                if (soundEnabled) soundFX.playLaserFocus();
                              }}
                              className={\`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer \${
                                isSelected
                                  ? 'bg-purple-500/10 border-purple-500 ring-2 ring-purple-500/30 shadow-xs text-[#18181B] dark:text-white'
                                  : 'bg-white/40 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                              }\`}
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <span className="text-xs font-bold">{mat.name}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-purple-500" />}
                              </div>
                              <span className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                                {mat.desc}
                              </span>
                            </button>
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
                            <button
                              key={ep.id}
                              type="button"
                              onClick={() => {
                                set3DElasticity(ep.id);
                                if (soundEnabled) soundFX.playLaserFocus();
                              }}
                              className={\`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer \${
                                isSelected
                                  ? 'bg-rose-500/10 border-rose-500 ring-2 ring-rose-500/30 shadow-xs text-[#18181B] dark:text-white'
                                  : 'bg-white/40 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                              }\`}
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <span className="text-xs font-bold">{ep.name}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-rose-500" />}
                              </div>
                              <span className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                                {ep.desc}
                              </span>
                            </button>
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
                          className={\`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/40 shrink-0 \${
                            physics.clickDepression ? 'bg-rose-500' : 'bg-stone-300 dark:bg-stone-700'
                          }\`}
                        >
                          <span
                            className={\`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 \${
                              physics.clickDepression ? 'translate-x-5' : 'translate-x-0.5'
                            }\`}
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
                          className={\`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/40 shrink-0 \${
                            physics.magneticPull ? 'bg-rose-500' : 'bg-stone-300 dark:bg-stone-700'
                          }\`}
                        >
                          <span
                            className={\`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 \${
                              physics.magneticPull ? 'translate-x-5' : 'translate-x-0.5'
                            }\`}
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
                      {exploded.enabled ? \`Exploded +\${exploded.separationDistance}px\` : 'Compact Assembled'}
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
                        className={\`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/40 shrink-0 \${
                          exploded.enabled ? 'bg-cyan-500' : 'bg-stone-300 dark:bg-stone-700'
                        }\`}
                      >
                        <span
                          className={\`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 \${
                            exploded.enabled ? 'translate-x-5' : 'translate-x-0.5'
                          }\`}
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
                        className={\`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/40 shrink-0 \${
                          exploded.blueprintMode ? 'bg-cyan-500' : 'bg-stone-300 dark:bg-stone-700'
                        }\`}
                      >
                        <span
                          className={\`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 \${
                            exploded.blueprintMode ? 'translate-x-5' : 'translate-x-0.5'
                          }\`}
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
                              className={\`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer \${
                                isSelected
                                  ? 'bg-indigo-500/10 border-indigo-500 ring-2 ring-indigo-500/30 shadow-xs text-[#18181B] dark:text-white'
                                  : 'bg-white/40 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                              }\`}
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
                        className={\`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40 shrink-0 \${
                          environment.stardustParticles ? 'bg-indigo-500' : 'bg-stone-300 dark:bg-stone-700'
                        }\`}
                      >
                        <span
                          className={\`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 \${
                            environment.stardustParticles ? 'translate-x-5' : 'translate-x-0.5'
                          }\`}
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
                        className={\`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shrink-0 \${
                          spatialAudio.binauralPanning ? 'bg-emerald-500' : 'bg-stone-300 dark:bg-stone-700'
                        }\`}
                      >
                        <span
                          className={\`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 \${
                            spatialAudio.binauralPanning ? 'translate-x-5' : 'translate-x-0.5'
                          }\`}
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
                              className={\`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer \${
                                isSelected
                                  ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/30 shadow-xs text-[#18181B] dark:text-white'
                                  : 'bg-white/40 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                              }\`}
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
                              className={\`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer \${
                                isSelected
                                  ? 'bg-orange-500/10 border-orange-500 ring-2 ring-orange-500/30 shadow-xs text-[#18181B] dark:text-white'
                                  : 'bg-white/40 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                              }\`}
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
                          className={\`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/40 shrink-0 \${
                            performanceConfig.autoThrottleIdle ? 'bg-orange-500' : 'bg-stone-300 dark:bg-stone-700'
                          }\`}
                        >
                          <span
                            className={\`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 \${
                              performanceConfig.autoThrottleIdle ? 'translate-x-5' : 'translate-x-0.5'
                            }\`}
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
                          className={\`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/40 shrink-0 \${
                            performanceConfig.lowPowerThreshold ? 'bg-orange-500' : 'bg-stone-300 dark:bg-stone-700'
                          }\`}
                        >
                          <span
                            className={\`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 \${
                              performanceConfig.lowPowerThreshold ? 'translate-x-5' : 'translate-x-0.5'
                            }\`}
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
                <div className={\`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border \${
                  toolkitStatus.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                }\`}>
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
                className={\`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-97 \${
                  copiedCss
                    ? 'bg-emerald-500 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200'
                }\`}
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
      )}
`;

// Insert fullThreeDTabJsx right before activeTab === 'preferences'
const prefTarget = `      {/* ========================================================================= */}
      {/* TAB 4: STARTUP & PREFERENCES`;

if (!src.includes(prefTarget)) {
  console.error('Preferences panel target not found!');
  process.exit(1);
}

src = src.replace(prefTarget, fullThreeDTabJsx + '\n\n' + prefTarget);

fs.writeFileSync(panelPath, src, 'utf8');
console.log('Successfully built and updated ControlCenterPanel.jsx!');
