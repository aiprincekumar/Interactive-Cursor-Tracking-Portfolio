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
  RefreshCw
} from 'lucide-react';
import { useLab3D, useLabAudio } from '../../context/LabContext';
import SandboxViewportContainer from './SandboxViewportContainer';
import UniversalMiniPortfolio from './UniversalMiniPortfolio';
import HeroCardPreview from './previews/HeroCardPreview';
import Navbar3DPreview from './previews/Navbar3DPreview';
import Footer3DPreview from './previews/Footer3DPreview';
import FloatingDockPreview from './previews/FloatingDockPreview';
import SectionShowcasePreview from './previews/SectionShowcasePreview';
import { normalizePreviewTab } from '../../hooks/useSandboxAutoSwitch';
import soundFX from '../../utils/soundFX';

/**
 * Preview tabs configuration
 */
export const PREVIEW_TABS = [
  { id: 'universal', label: 'Universal Mini', icon: Globe, desc: 'Full portfolio mini-DOM replica' },
  { id: 'hero', label: '3D Hero Card', icon: User, desc: 'Extruded avatar & floating badge pills' },
  { id: 'navbar', label: 'Navbar', icon: Navigation, desc: 'Frosted glass pill with 3D depth' },
  { id: 'footer', label: 'Footer', icon: Frame, desc: 'Ground plane shadow & metadata' },
  { id: 'dock', label: 'Floating Dock', icon: Box, desc: 'Curved dock with icon hover-pop' },
  { id: 'showcase', label: 'Section Showcase', icon: LayoutGrid, desc: 'Isometric project & skills card grid' }
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
  const [internalTilt, setInternalTilt] = useState({ rotX: 14, rotY: -18 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, rotX: 14, rotY: -18 });
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
      const nextRotX = Math.min(Math.max(dragStartRef.current.rotX - dy * 0.35 * sens, -55), 55);
      const nextRotY = Math.min(Math.max(dragStartRef.current.rotY + dx * 0.35 * sens, -65), 65);
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
      setInternalTilt({ rotX: 14, rotY: -18 });
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
      className={`sticky top-6 self-start flex flex-col gap-4 max-h-[calc(100vh-3rem)] overflow-y-auto no-scrollbar rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] bg-white/80 dark:bg-[#181226]/85 backdrop-blur-md p-4 sm:p-5 shadow-sm transition-all ${className}`}
    >
      {/* 1. Header & Live Indicator */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200/70 dark:border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center font-bold">
            <Maximize2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#18181B] dark:text-white flex items-center gap-1.5">
              <span>Sticky Sandbox Hub</span>
            </h4>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Live viewport locked in view during tuning
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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

          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
            <span className={`w-1.5 h-1.5 rounded-full ${isMaster3DOn ? 'bg-cyan-500 animate-ping' : 'bg-stone-400'}`} />
            <span>{isMaster3DOn ? 'Live 3D' : 'Flat 2D'}</span>
          </span>
        </div>
      </div>

      {/* 2. Component Tab Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold px-0.5">
          <span>Component Previews</span>
          <span className="font-mono text-[10px] text-cyan-600 dark:text-cyan-400">
            {PREVIEW_TABS.find((t) => t.id === currentTab)?.label || 'Universal Mini'}
          </span>
        </div>

        <div
          role="tablist"
          aria-label="Component preview selection tabs"
          className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-stone-100/80 dark:bg-[#140F21]/80 border border-stone-200/70 dark:border-stone-800"
        >
          {PREVIEW_TABS.map((tab) => {
            const isSelected = currentTab === tab.id;
            const isTabHighlighted = normalizedHighlight === normalizeComponentKey(tab.id);
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={isSelected}
                onClick={() => handleSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
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
      </div>

      {/* 3. Dynamic Preview Viewport with Dedicated 3D Components */}
      <div className="w-full flex flex-col gap-2 relative">
        <SandboxViewportContainer
          perspective={camera.perspectiveFOV ?? 1000}
          className={`w-full rounded-xl border bg-radial from-stone-50 via-white to-stone-100 dark:from-[#1A1329] dark:via-[#130E20] dark:to-[#0A0713] overflow-hidden shadow-inner flex flex-col items-center justify-center min-h-[290px] relative p-3 transition-all duration-300 ${
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
        </SandboxViewportContainer>
      </div>

      {/* 4. Live Telemetry & Fine-Grained Control Bar */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-[#150F21]/80 border border-stone-200/70 dark:border-stone-800 font-mono text-xs">
        <div className="flex flex-col">
          <span className="text-[11px] text-stone-600 dark:text-stone-300 font-semibold">
            Rot: {currentTilt.rotX}°, {currentTilt.rotY}°
          </span>
          <span className="text-[10px] text-stone-400">
            FOV: {camera.perspectiveFOV ?? 1000}px | Tilt: {camera.tiltSensitivity ?? 15}°
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Component-level reset action */}
          <button
            type="button"
            data-testid="reset-component-defaults-btn"
            onClick={handleResetComponentDefaults}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-stone-50 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
            title={`Reset ${PREVIEW_TABS.find((t) => t.id === currentTab)?.label || 'Component'} 3D Defaults`}
            aria-label="Reset Component Defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
            <span>Reset Component Defaults</span>
          </button>

          {/* Quick orientation reset */}
          <button
            type="button"
            data-testid="reset-sandbox-orientation-btn"
            onClick={handleResetOrientation}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800/80 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Reset Sandbox Orientation"
            aria-label="Reset Sandbox Orientation"
          >
            <RotateCcw className="w-3 h-3 text-stone-400" />
            <span>Reset View</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default StickySandboxColumn;
