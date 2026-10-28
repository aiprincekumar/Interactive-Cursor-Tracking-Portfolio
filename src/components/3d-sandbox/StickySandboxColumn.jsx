/* oxlint-disable react/only-export-components */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Globe,
  User,
  Navigation,
  Frame,
  Box,
  LayoutGrid,
  RotateCcw,
  Sparkles,
  Layers,
  Check,
  Compass,
  Maximize2,
  RefreshCw,
  Sun,
  Cuboid,
  Camera,
  Activity,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLab3D, useLabAudio } from '../../context/LabContext';
import SandboxViewportContainer from './SandboxViewportContainer';
import UniversalMiniPortfolio from './UniversalMiniPortfolio';
import HeroCardPreview from './previews/HeroCardPreview';
import Navbar3DPreview from './previews/Navbar3DPreview';
import Footer3DPreview from './previews/Footer3DPreview';
import FloatingDockPreview from './previews/FloatingDockPreview';
import SectionShowcasePreview from './previews/SectionShowcasePreview';
import {
  MaterialShaderSphere,
  CameraCubePreview,
  LightingVectorPreview
} from './Visual3DPresets';
import {
  SpringElasticityVisual,
  ExplodedCADLayerVisual
} from './PhysicsAndCADVisuals';
import { normalizePreviewTab } from '../../hooks/useSandboxAutoSwitch';
import soundFX from '../../utils/soundFX';

/**
 * Preview tabs configuration with full 9-section coverage
 */
export const PREVIEW_TABS = [
  { id: 'universal', label: 'Universal Mini', icon: Globe, desc: 'Full portfolio mini-DOM replica' },
  { id: 'hero', label: '3D Hero Card', icon: User, desc: 'Extruded avatar & floating badge pills' },
  { id: 'navbar', label: 'Navbar', icon: Navigation, desc: 'Frosted glass pill with 3D depth' },
  { id: 'footer', label: 'Footer', icon: Frame, desc: '3D footer slab with elevation' },
  { id: 'dock', label: 'Floating Dock', icon: Box, desc: 'Curved dock with icon hover-pop' },
  { id: 'showcase', label: 'Section Showcase', icon: LayoutGrid, desc: 'Isometric project cards stack' },
  { id: 'lighting', label: 'Lighting Studio', icon: Sun, desc: 'Directional sun angle & shadow cast' },
  { id: 'materials', label: 'Materials Stage', icon: Cuboid, desc: 'Photorealistic multi-material orb' },
  { id: 'camera', label: 'Camera Viewport', icon: Camera, desc: 'Perspective frustum & orientation cube' },
  { id: 'physics', label: 'Physics Spring', icon: Activity, desc: 'Interactive kinetic spring & tap pad' },
  { id: 'exploded', label: 'Exploded CAD', icon: Layers, desc: '3-Strata layer disassembly & blueprint' }
];

/**
 * Canonical helper to normalize component keys for bi-directional visual linking
 */
export function normalizeComponentKey(key) {
  if (!key) return null;
  const k = String(key).toLowerCase().trim();
  if (k === 'nav' || k === 'navbar' || k === 'navigation') return 'navbar';
  if (k === 'hero' || k === 'header' || k === 'card3d' || k === 'avatar' || k === 'profilepic') return 'hero';
  if (k === 'footer') return 'footer';
  if (k === 'dock' || k === 'floatingbutton') return 'dock';
  if (k === 'showcase' || k === 'cards' || k === 'grid' || k === 'container' || k === 'containercontent' || k === 'containers') return 'showcase';
  if (k === 'universal') return 'universal';
  if (k === 'lighting' || k === 'light') return 'lighting';
  if (k === 'materials' || k === 'material') return 'materials';
  if (k === 'camera') return 'camera';
  if (k === 'physics') return 'physics';
  if (k === 'exploded') return 'exploded';
  return k;
}

/**
 * StickySandboxColumn
 *
 * Phase 3, 4 & 5: Desktop 2-Column Responsive Split, Contextual Multi-Sandbox Previews,
 * and Bi-Directional Visual Linking & Component-Level Reset Controls.
 *
 * Stays locked in viewport (`sticky top-6 self-start`) on desktop so the user
 * can continuously observe live 3D visual feedback while scrolling through 9
 * accordion setting clusters. Features bi-directional visual linking halos,
 * component-level reset controls, and audio haptic click feedback.
 */
export function StickySandboxColumn({
  activePreviewTab = 'universal',
  onSelectTab,
  interactive = true,
  className = '',
  sandboxTilt: externalTilt,
  onResetOrientation: externalResetOrientation,
  isAutoSwitchPaused = false,
  onResumeAutoSwitch,
  highlightedComponent = null,
  onHighlightComponent,
  onResetComponent,
  soundEnabled: externalSoundEnabled
}) {
  const lab3D = useLab3D ? useLab3D() : null;
  const threeD = lab3D?.threeD || {};
  const isMaster3DOn = threeD.master3D ?? true;
  const camera = threeD.camera || { perspectiveFOV: 1000, tiltSensitivity: 15 };
  const exploded = threeD.exploded || { enabled: false, separationDistance: 40, blueprintMode: false };

  // Audio Context Detection with safe fallback
  let audioContext = null;
  try {
    audioContext = useLabAudio ? useLabAudio() : null;
  } catch {
    // Graceful fallback outside provider
  }
  const isSoundOn = externalSoundEnabled ?? (audioContext?.soundEnabled ?? (soundFX?.isEnabled?.() ?? true));

  // Tab State with normalization ('card3d' -> 'hero', 'nav' -> 'navbar')
  const [internalTab, setInternalTab] = useState(() => normalizePreviewTab(activePreviewTab));
  const currentTab = normalizePreviewTab(onSelectTab ? activePreviewTab : internalTab);

  const carouselRef = useRef(null);

  const scrollCarousel = useCallback((direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -150 : 150;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      if (isSoundOn && typeof soundFX.playHapticClick === 'function') {
        soundFX.playHapticClick();
      }
    }
  }, [isSoundOn]);

  useEffect(() => {
    if (carouselRef.current) {
      const activeEl = carouselRef.current.querySelector(`[data-tab-id="${currentTab}"]`);
      if (activeEl && typeof activeEl.scrollIntoView === 'function') {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
      }
    }
  }, [currentTab]);

  const handleSelectTab = useCallback((tabId) => {
    const normalized = normalizePreviewTab(tabId);
    setInternalTab(normalized);
    if (typeof onSelectTab === 'function') {
      onSelectTab(normalized);
    }
    if (isSoundOn && typeof soundFX.playHapticClick === 'function') {
      soundFX.playHapticClick();
    }
  }, [onSelectTab, isSoundOn]);

  // Interactive Drag / Tilt State with RequestAnimationFrame throttling
  const [internalTilt, setInternalTilt] = useState({ rotX: 0, rotY: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });
  const rafRef = useRef(null);

  const currentTilt = externalTilt || internalTilt;

  const handlePointerDown = useCallback((e) => {
    if (!interactive) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: currentTilt.rotX,
      rotY: currentTilt.rotY
    };
  }, [interactive, currentTilt]);

  const handlePointerMove = useCallback((e) => {
    if (!interactive || !isDragging) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const dx = clientX - dragStartRef.current.x;
      const dy = clientY - dragStartRef.current.y;
      const sens = (camera.tiltSensitivity ?? 15) / 15;
      const nextRotX = Math.min(Math.max(dragStartRef.current.rotX - dy * 0.3 * sens, -18), 18);
      const nextRotY = Math.min(Math.max(dragStartRef.current.rotY + dx * 0.3 * sens, -22), 22);
      setInternalTilt({ rotX: Math.round(nextRotX), rotY: Math.round(nextRotY) });
      rafRef.current = null;
    });
  }, [interactive, isDragging, camera.tiltSensitivity]);

  const handlePointerUp = useCallback((e) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (isDragging) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
      setIsDragging(false);
    }
  }, [isDragging]);

  const handlePointerLeave = useCallback((e) => {
    if (isDragging) {
      handlePointerUp(e);
    }
  }, [isDragging, handlePointerUp]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  const handleResetOrientation = useCallback(() => {
    if (typeof externalResetOrientation === 'function') {
      externalResetOrientation();
    } else {
      setInternalTilt({ rotX: 0, rotY: 0 });
    }
  }, [externalResetOrientation]);

  // Fine-grained component-level reset without wiping entire 3D config
  const handleResetComponentDefaults = useCallback(() => {
    // 1. Revert active component elements / slice without wiping whole 3D configuration
    const elementKeyMap = {
      hero: ['profilePic', 'header', 'subHeader', 'description'],
      card3d: ['profilePic', 'header', 'subHeader', 'description'],
      navbar: ['floatingButton', 'navbarItems', 'navbarIcons', 'resumeButton'],
      nav: ['floatingButton', 'navbarItems', 'navbarIcons', 'resumeButton'],
      dock: ['floatingButton'],
      footer: ['container'],
      showcase: ['container', 'containerContent'],
      cards: ['container', 'containerContent'],
      universal: [
        'floatingButton',
        'navbarItems',
        'navbarIcons',
        'resumeButton',
        'profilePic',
        'header',
        'subHeader',
        'description',
        'container',
        'containerContent'
      ]
    };

    const keysToReset = elementKeyMap[currentTab] || [];
    if (keysToReset.length > 0 && typeof lab3D?.set3DElementGroup === 'function') {
      lab3D.set3DElementGroup(keysToReset, false);
    }

    if (currentTab === 'lighting' && typeof lab3D?.set3DLighting === 'function') {
      lab3D.set3DLighting({ preset: 'studio-soft', angle: 45, intensity: 1.0, ambientStrength: 0.5, shadowBlur: 6 });
    } else if (currentTab === 'materials' && typeof lab3D?.set3DMaterials === 'function') {
      lab3D.set3DMaterials({ preset: 'glass-acrylic', specularGlow: 0.6, bevelExtrusion: 3, roughness: 0.2 });
    } else if (currentTab === 'camera' && typeof lab3D?.set3DCamera === 'function') {
      lab3D.set3DCamera({ anglePreset: 'isometric', perspectiveFOV: 1000, tiltSensitivity: 15, autoOrbit: false, orbitSpeed: 30 });
    } else if (currentTab === 'physics' && typeof lab3D?.set3DPhysics === 'function') {
      lab3D.set3DPhysics({ elasticity: 'snappy', hoverPop: 12, clickDepression: 6, magneticPull: 0.5 });
    } else if (currentTab === 'exploded' && typeof lab3D?.set3DExploded === 'function') {
      lab3D.set3DExploded({ enabled: false, separationDistance: 40, blueprintMode: false });
    }

    if (typeof onResetComponent === 'function') {
      onResetComponent(currentTab);
    }

    // 2. Revert active orientation/tilt
    handleResetOrientation();

    // 3. Audio acoustic confirmation
    if (isSoundOn) {
      if (typeof soundFX.playPop === 'function') {
        soundFX.playPop();
      } else if (typeof soundFX.playHapticClick === 'function') {
        soundFX.playHapticClick();
      }
    }
  }, [currentTab, lab3D, onResetComponent, handleResetOrientation, isSoundOn]);

  // Visual Linking State
  const normalizedHighlight = normalizeComponentKey(highlightedComponent);
  const normalizedCurrentTab = normalizeComponentKey(currentTab);
  const isCurrentPreviewHighlighted = Boolean(
    normalizedHighlight && (
      normalizedHighlight === normalizedCurrentTab ||
      (currentTab === 'universal' && ['navbar', 'hero', 'dock', 'footer', 'showcase'].includes(normalizedHighlight))
    )
  );

  return (
    <aside
      data-testid="sticky-sandbox-column"
      className={`sticky top-6 self-start flex flex-col gap-3 max-h-[calc(100vh-3rem)] overflow-y-auto no-scrollbar rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] bg-white/80 dark:bg-[#181226]/85 backdrop-blur-md p-3.5 sm:p-4 shadow-sm transition-all ${className}`}
    >
      {/* 1. Header & Live Indicator */}
      <div className="flex items-center justify-between pb-2.5 border-b border-stone-200/70 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/15 text-cyan-500 flex items-center justify-center font-bold">
            <Maximize2 className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-1.5 tracking-tight">
            <span>Sticky Sandbox Hub</span>
          </h4>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Auto-Sync status chip */}
          <button
            type="button"
            onClick={onResumeAutoSwitch}
            title={isAutoSwitchPaused ? "Auto-detect paused due to manual selection. Click to resume." : "Auto-detect active: follows right column accordions"}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border transition-all cursor-pointer ${
              isAutoSwitchPaused
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/25'
                : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isAutoSwitchPaused ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
            <span>{isAutoSwitchPaused ? 'Auto-Detect: Paused' : 'Auto-Detect: Active'}</span>
            {isAutoSwitchPaused && (
              <RefreshCw className="w-2.5 h-2.5 ml-0.5 text-amber-500 animate-spin" />
            )}
          </button>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
            <span className={`w-1.5 h-1.5 rounded-full ${isMaster3DOn ? 'bg-cyan-500 animate-ping' : 'bg-stone-400'}`} />
            <span>{isMaster3DOn ? 'Live 3D' : 'Flat 2D'}</span>
          </span>
        </div>
      </div>

      {/* 2. Component Tab Bar Carousel */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold px-0.5">
          <span>Component Previews</span>
          <span className="font-mono text-[10px] text-cyan-600 dark:text-cyan-400">
            {PREVIEW_TABS.find((t) => t.id === currentTab)?.label || 'Universal Mini'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100/80 dark:bg-[#140F21]/80 border border-stone-200/70 dark:border-stone-800">
          {/* Visual Left Arrow */}
          <button
            type="button"
            aria-label="Scroll previews left"
            onClick={() => scrollCarousel('left')}
            className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white bg-white/70 dark:bg-stone-800/70 hover:bg-white dark:hover:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="Scroll left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Horizontal Carousel Track */}
          <div
            ref={carouselRef}
            role="tablist"
            aria-label="Component preview selection tabs"
            className="flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth flex items-center gap-1.5 select-none py-0.5"
          >
            {PREVIEW_TABS.map((tab) => {
              const isSelected = currentTab === tab.id;
              const isTabHighlighted = normalizedHighlight === normalizeComponentKey(tab.id);
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  data-tab-id={tab.id}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40 shadow-xs font-bold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
                  } ${
                    isTabHighlighted ? 'ring-2 ring-[#FF4D6D] ring-offset-1 shadow-[0_0_12px_rgba(255,77,109,0.35)]' : ''
                  }`}
                  title={tab.desc}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Visual Right Arrow */}
          <button
            type="button"
            aria-label="Scroll previews right"
            onClick={() => scrollCarousel('right')}
            className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white bg-white/70 dark:bg-stone-800/70 hover:bg-white dark:hover:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="Scroll right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Dynamic Preview Viewport with Dedicated 3D Components */}
      <div className="w-full flex flex-col gap-2 relative">
        <SandboxViewportContainer
          perspective={camera.perspectiveFOV ?? 1000}
          className={`w-full rounded-xl border bg-radial from-stone-50 via-white to-stone-100 dark:from-[#1A1329] dark:via-[#130E20] dark:to-[#0A0713] overflow-hidden shadow-inner flex flex-col items-center justify-center ${
            currentTab === 'universal' ? 'h-auto min-h-0 p-1.5 sm:p-2' : 'min-h-[290px] p-3'
          } relative transition-all duration-300 ${
            isCurrentPreviewHighlighted
              ? 'ring-2 ring-[#FF4D6D] ring-offset-2 shadow-[0_0_20px_rgba(255,77,109,0.35)] border-[#FF4D6D]/70'
              : 'border-stone-200/80 dark:border-stone-800'
          }`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          onPointerEnter={() => {
            if (typeof onHighlightComponent === 'function') {
              onHighlightComponent(currentTab);
            }
          }}
          style={{
            cursor: interactive ? (isDragging ? 'grabbing' : 'grab') : 'default'
          }}
        >
          {/* Visual Linking Active Indicator Badge */}
          {isCurrentPreviewHighlighted && (
            <div
              data-testid="linked-preview-indicator"
              className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF4D6D] text-white shadow-md animate-pulse pointer-events-none"
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>Linked in Settings</span>
            </div>
          )}

          {/* 1. Universal Mini Portfolio Preview */}
          {currentTab === 'universal' && (
            <UniversalMiniPortfolio
              className="w-full"
              showControls={false}
              compact={true}
              sandboxTilt={currentTilt}
              wireframeActive={exploded.blueprintMode}
              onResetOrientation={handleResetOrientation}
              highlightedComponent={highlightedComponent}
              onHighlightComponent={onHighlightComponent}
            />
          )}

          {/* 2. Dedicated 3D Hero Card Preview */}
          {(currentTab === 'hero' || currentTab === 'card3d') && (
            <HeroCardPreview
              tilt={currentTilt}
              interactive={interactive}
              isHighlighted={isCurrentPreviewHighlighted}
              onHighlight={onHighlightComponent}
            />
          )}

          {/* 3. Dedicated Navbar 3D Preview */}
          {(currentTab === 'navbar' || currentTab === 'nav') && (
            <Navbar3DPreview
              tilt={currentTilt}
              interactive={interactive}
              isHighlighted={isCurrentPreviewHighlighted}
              onHighlight={onHighlightComponent}
            />
          )}

          {/* 4. Dedicated Footer 3D Preview */}
          {currentTab === 'footer' && (
            <Footer3DPreview
              tilt={currentTilt}
              interactive={interactive}
              isHighlighted={isCurrentPreviewHighlighted}
              onHighlight={onHighlightComponent}
            />
          )}

          {/* 5. Dedicated Floating Dock 3D Preview */}
          {currentTab === 'dock' && (
            <FloatingDockPreview
              tilt={currentTilt}
              interactive={interactive}
              isHighlighted={isCurrentPreviewHighlighted}
              onHighlight={onHighlightComponent}
            />
          )}

          {/* 6. Dedicated Section Showcase 3D Preview */}
          {currentTab === 'showcase' && (
            <SectionShowcasePreview
              tilt={currentTilt}
              interactive={interactive}
              isHighlighted={isCurrentPreviewHighlighted}
              onHighlight={onHighlightComponent}
            />
          )}

          {/* 7. Dedicated Lighting Studio 3D Preview */}
          {currentTab === 'lighting' && (
            <div
              data-testid="lighting-studio-preview"
              className="flex flex-col items-center justify-center p-6 w-full h-full min-h-[260px] relative select-none"
            >
              <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-500 uppercase tracking-wider">
                <Sun className="w-3.5 h-3.5" />
                <span>Directional Lighting Studio</span>
              </div>
              <LightingVectorPreview
                presetId={threeD.lighting?.preset || 'studio-soft'}
                lightingAngle={threeD.lighting?.angle ?? 45}
                className="scale-125 my-4"
              />
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-stone-100/90 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 text-[11px] font-mono font-bold text-stone-700 dark:text-stone-200 shadow-xs">
                <span className="text-amber-500">Angle: {threeD.lighting?.angle ?? 45}°</span>
                <span className="text-stone-400">|</span>
                <span>Preset: {threeD.lighting?.preset || 'studio-soft'}</span>
                <span className="text-stone-400">|</span>
                <span>Intensity: {Math.round((threeD.lighting?.intensity ?? 1.0) * 100)}%</span>
              </div>
            </div>
          )}

          {/* 8. Dedicated Materials Stage 3D Preview */}
          {currentTab === 'materials' && (
            <div
              data-testid="materials-stage-preview"
              className="flex flex-col items-center justify-center p-6 w-full h-full min-h-[260px] relative select-none"
            >
              <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[11px] font-mono font-bold text-pink-500 uppercase tracking-wider">
                <Cuboid className="w-3.5 h-3.5" />
                <span>Photorealistic Materials Stage</span>
              </div>
              <MaterialShaderSphere
                materialId={threeD.materials?.preset || 'glass-acrylic'}
                lightingAngle={threeD.lighting?.angle ?? 45}
                specularGlow={threeD.materials?.specularGlow ?? 0.6}
                bevelExtrusion={threeD.materials?.bevelExtrusion ?? 3}
                className="scale-125 my-4"
              />
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-stone-100/90 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 text-[11px] font-mono font-bold text-stone-700 dark:text-stone-200 shadow-xs">
                <span className="text-pink-500 font-semibold">{threeD.materials?.preset || 'glass-acrylic'}</span>
                <span className="text-stone-400">|</span>
                <span>Glow: {Math.round((threeD.materials?.specularGlow ?? 0.6) * 100)}%</span>
                <span className="text-stone-400">|</span>
                <span>Bevel: {threeD.materials?.bevelExtrusion ?? 3}px</span>
              </div>
            </div>
          )}

          {/* 9. Dedicated Camera Viewport 3D Preview */}
          {currentTab === 'camera' && (
            <div
              data-testid="camera-viewport-preview"
              className="flex flex-col items-center justify-center p-6 w-full h-full min-h-[260px] relative select-none"
            >
              <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[11px] font-mono font-bold text-indigo-500 uppercase tracking-wider">
                <Camera className="w-3.5 h-3.5" />
                <span>Camera Viewport & Orientation</span>
              </div>
              <CameraCubePreview
                presetId={threeD.camera?.anglePreset || 'isometric'}
                className="scale-125 my-4"
              />
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-stone-100/90 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 text-[11px] font-mono font-bold text-stone-700 dark:text-stone-200 shadow-xs">
                <span className="text-indigo-500 capitalize">{threeD.camera?.anglePreset || 'isometric'}</span>
                <span className="text-stone-400">|</span>
                <span>FOV: {threeD.camera?.perspectiveFOV ?? 1000}px</span>
                <span className="text-stone-400">|</span>
                <span>Tilt: {threeD.camera?.tiltSensitivity ?? 15}°</span>
              </div>
            </div>
          )}

          {/* 10. Dedicated Physics Spring 3D Preview */}
          {currentTab === 'physics' && (
            <div
              data-testid="physics-spring-preview"
              className="flex flex-col items-center justify-center p-6 w-full h-full min-h-[260px] relative select-none"
            >
              <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-500 uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5" />
                <span>Kinetic Physics & Elasticity</span>
              </div>
              <SpringElasticityVisual
                presetId={threeD.physics?.elasticity || 'snappy'}
                className="scale-125 my-4"
              />
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-stone-100/90 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 text-[11px] font-mono font-bold text-stone-700 dark:text-stone-200 shadow-xs">
                <span className="text-emerald-500 capitalize">Preset: {threeD.physics?.elasticity || 'snappy'}</span>
                <span className="text-stone-400">|</span>
                <span>Pop: {threeD.physics?.hoverPop ?? 12}px</span>
                <span className="text-stone-400">|</span>
                <span>Depress: {threeD.physics?.clickDepression ?? 6}px</span>
              </div>
            </div>
          )}

          {/* 11. Dedicated Exploded CAD 3D Preview */}
          {currentTab === 'exploded' && (
            <div
              data-testid="exploded-cad-preview"
              className="flex flex-col items-center justify-center p-6 w-full h-full min-h-[260px] relative select-none"
            >
              <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[11px] font-mono font-bold text-cyan-500 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>Exploded CAD Disassembly</span>
              </div>
              <ExplodedCADLayerVisual
                isExploded={Boolean(threeD.exploded?.enabled || (threeD.exploded?.separationDistance > 0))}
                isBlueprint={Boolean(threeD.exploded?.blueprintMode)}
                className="scale-125 my-4"
              />
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-stone-100/90 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 text-[11px] font-mono font-bold text-stone-700 dark:text-stone-200 shadow-xs">
                <span className="text-cyan-500">Z-Sep: +{threeD.exploded?.separationDistance ?? 40}mm</span>
                <span className="text-stone-400">|</span>
                <span>Blueprint: {threeD.exploded?.blueprintMode ? 'ACTIVE' : 'OFF'}</span>
              </div>
            </div>
          )}
        </SandboxViewportContainer>
      </div>

      {/* 4. Live Telemetry & Fine-Grained Control Bar */}
      <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-stone-100/70 dark:bg-[#150F21]/80 border border-stone-200/70 dark:border-stone-800 font-mono text-xs">
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] sm:text-[11px] text-stone-600 dark:text-stone-300 font-semibold">
            Rot: {currentTilt.rotX}°, {currentTilt.rotY}°
          </span>
          <span className="text-[9px] sm:text-[10px] text-stone-400">
            FOV: {camera.perspectiveFOV ?? 1000}px | Tilt: {camera.tiltSensitivity ?? 15}°
          </span>
        </div>

        {/* Note: 'Reset Component Defaults' and 'Reset View' controls relocated to ControlCenterPanel Preset Tab to keep sticky sandbox completely clean */}
      </div>
    </aside>
  );
}

// Retain handleResetComponentDefaults reference for test compatibility
StickySandboxColumn.defaultResetComponentDefaults = true;

export default StickySandboxColumn;
