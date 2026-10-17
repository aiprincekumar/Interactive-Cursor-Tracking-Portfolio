import React, { useEffect, useState, useId } from 'react';
import {
  FlaskConical,
  X,
  RotateCcw,
  Sparkles,
  Wind,
  Sliders,
  Volume2,
  VolumeX,
  Palette,
  Orbit,
  ExternalLink,
  Camera,
  CircleDot,
  Crosshair,
  Bell,
  Activity,
  Fingerprint,
  Check
} from 'lucide-react';
import { useLab, LAB_PRESETS } from '../context/LabContext';
import { soundFX } from '../utils/audio';

const PRESET_CARDS = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Zero-G',
    tag: 'Anti-G • Cyan',
    color: '#00F2FE',
    border: 'border-[#00F2FE]/40',
    bg: 'bg-[#00F2FE]/10 text-[#00F2FE]'
  },
  {
    id: 'arcade',
    name: 'Retro Arcade',
    tag: '95 G • Gold',
    color: '#FFD700',
    border: 'border-[#FFD700]/40',
    bg: 'bg-[#FFD700]/10 text-[#FFD700]'
  },
  {
    id: 'zen',
    name: 'Zen Minimalist',
    tag: 'Zero-G • Emerald',
    color: '#10B981',
    border: 'border-[#10B981]/40',
    bg: 'bg-[#10B981]/10 text-[#10B981]'
  },
  {
    id: 'hyper',
    name: 'Hyper Velocity',
    tag: 'Heavy G • Coral',
    color: '#FF4D6D',
    border: 'border-[#FF4D6D]/40',
    bg: 'bg-[#FF4D6D]/10 text-[#FF4D6D]'
  }
];

const PRESET_COLORS = [
  { name: 'Coral Rose', hex: '#FF4D6D' },
  { name: 'Electric Cyan', hex: '#00F2FE' },
  { name: 'Solar Gold', hex: '#FFD700' },
  { name: 'Matrix Emerald', hex: '#10B981' },
  { name: 'Cyber Purple', hex: '#A855F7' },
  { name: 'Starlight White', hex: '#FFFFFF' }
];

const SOUNDBOARD_ICONS = {
  shutter: Camera,
  sparkle: Sparkles,
  pop: CircleDot,
  focus: Crosshair,
  chime: Bell,
  ribbon: Activity,
  haptic: Fingerprint
};

export default function LabStudioDrawer() {
  const {
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
    closeDrawer,
    toggleDrawer
  } = useLab();

  const [activeSoundId, setActiveSoundId] = useState(null);
  const scaleInputId = useId();
  const speedInputId = useId();
  const wingInputId = useId();
  const gravityInputId = useId();
  const colorInputId = useId();
  const volumeInputId = useId();
  const pitchInputId = useId();

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        e.preventDefault();
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  const handleSoundboardPlay = (id, playFn) => {
    setActiveSoundId(id);
    try {
      playFn();
    } catch {
      // Fallback
    }
    setTimeout(() => {
      setActiveSoundId((curr) => (curr === id ? null : curr));
    }, 280);
  };

  const handleJumpToWorkbench = () => {
    closeDrawer();
    const el = document.getElementById('playground') || document.getElementById('lab');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Check if current parameters differ from factory defaults
  const isCustomized =
    activePreset !== 'default' ||
    Math.abs(cursorScale - 1.0) > 0.01 ||
    Math.abs(gravity) > 1 ||
    particleColor !== '#FF4D6D';

  return (
    <>
      {/* 1. Persistent Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 select-none">
        <button
          type="button"
          onClick={toggleDrawer}
          aria-label={isDrawerOpen ? 'Close Quick Lab Studio Drawer' : 'Open Quick Lab Studio Drawer'}
          aria-expanded={isDrawerOpen}
          aria-controls="quick-lab-drawer"
          title="Quick Lab Studio (Tune Cursors, Physics & Audio)"
          className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#18181B]/95 dark:bg-[#120D1D]/95 text-[#FF4D6D] border border-[#FF4D6D]/40 shadow-2xl shadow-[#FF4D6D]/25 hover:border-[#FF4D6D] hover:scale-105 active:scale-95 transition-all duration-300 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#FF4D6D]"
        >
          {/* Subtle Pulse Beacon indicator */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isCustomized ? 'bg-[#00F2FE]' : 'bg-[#FF4D6D]'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-white dark:border-[#120D1D] ${
                isCustomized ? 'bg-[#00F2FE]' : 'bg-[#FF4D6D]'
              }`}
            />
          </span>

          <FlaskConical
            className={`w-6 h-6 transition-transform duration-300 ${
              isDrawerOpen ? 'rotate-45 scale-110 text-white' : 'group-hover:rotate-12'
            }`}
          />

          {/* Accessible Tooltip */}
          <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl bg-stone-900/95 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 hidden sm:block border border-stone-700/60">
            Quick Lab Studio
          </span>
        </button>
      </div>

      {/* 2. Semi-Transparent Modal Backdrop */}
      {isDrawerOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close Quick Lab Studio Drawer"
          onClick={closeDrawer}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              closeDrawer();
            }
          }}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[47] transition-opacity duration-300 animate-in fade-in"
        />
      )}

      {/* 3. Slide-Out Quick Drawer Panel (Zero Layout Shift via translateX) */}
      <aside
        id="quick-lab-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Quick Lab Customization Studio"
        className={`fixed top-0 right-0 h-full w-[360px] sm:w-[420px] max-w-[92vw] z-[48] bg-[#FAF8F5]/98 dark:bg-[#120D1D]/98 backdrop-blur-2xl border-l border-[#E7E2D8] dark:border-[#2D2340] shadow-2xl flex flex-col transition-transform duration-300 ease-out will-change-transform ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-[#ECE7DF] dark:border-[#2D2340] bg-white/70 dark:bg-[#161122]/70 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 text-[#FF4D6D] border border-[#FFD1DC] dark:border-[#FF4D6D]/30 shadow-2xs">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#18181B] dark:text-white font-['Outfit',sans-serif]">
                  Quick Lab Studio
                </h3>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 text-[#FF4D6D] border border-[#FFD1DC] dark:border-[#FF4D6D]/30">
                  {LAB_PRESETS[activePreset]?.name || 'Custom'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                Live Cursor, Physics & Audio Tuning
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={resetDefaults}
              title="Reset all settings to factory defaults"
              aria-label="Reset to Factory Defaults"
              className="p-1.5 rounded-xl text-stone-500 dark:text-stone-400 hover:text-[#18181B] dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Close drawer"
              className="p-1.5 rounded-xl text-stone-500 dark:text-stone-400 hover:text-[#18181B] dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6 text-[#18181B] dark:text-[#F5F2F8] custom-scrollbar">
          {/* Section A: 1-Click Presets */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF4D6D]" /> 1-Click Presets
              </span>
              <span className="text-[10px] font-mono text-stone-400 dark:text-stone-400">
                4 Recipes
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_CARDS.map((preset) => {
                const isSelected = activePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset.id)}
                    className={`p-2.5 rounded-2xl border text-left transition-all duration-200 select-none group relative ${
                      isSelected
                        ? `bg-white dark:bg-stone-900 border-[#FF4D6D] dark:border-[#FF4D6D] shadow-sm ring-2 ring-[#FF4D6D]/40`
                        : `bg-white/60 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 hover:bg-white dark:hover:bg-stone-900`
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold tracking-tight text-[#18181B] dark:text-white truncate">
                        {preset.name}
                      </span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-[#FF4D6D] text-white flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                    <span className="inline-block text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                      {preset.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section B: Cursor Kinematics Tuning */}
          <div className="bg-white dark:bg-[#161122] p-4 rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#FF4D6D]" /> Cursor Kinematics
              </span>
              <span className="text-[11px] font-mono font-bold text-[#FF4D6D]">
                {cursorScale.toFixed(2)}x ({Math.round(cursorScale * 38)}px)
              </span>
            </div>

            {/* Scale Slider */}
            <div>
              <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1">
                <label htmlFor={scaleInputId} className="cursor-pointer">Global Cursor Scale</label>
                <span className="font-mono">{cursorScale.toFixed(2)}x</span>
              </div>
              <input
                id={scaleInputId}
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={cursorScale}
                onChange={(e) => setCursorScale(parseFloat(e.target.value))}
                className="w-full accent-[#FF4D6D] h-2 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-stone-400 dark:text-stone-400 mt-0.5">
                <span>0.5x (Mini)</span>
                <span>1.0x (Standard)</span>
                <span>2.0x (Showcase)</span>
              </div>
            </div>

            {/* Flight Lerp Speed */}
            <div>
              <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1.5">
                <label htmlFor={speedInputId} className="flex items-center gap-1 cursor-pointer">
                  <Wind className="w-3 h-3 text-stone-400" /> Flight Lerp Speed
                </label>
                <span className="font-mono">{flightSpeed.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 mb-2">
                {[
                  { label: 'Dreamy', val: 0.07 },
                  { label: 'Natural', val: 0.14 },
                  { label: 'Snappy', val: 0.25 }
                ].map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setFlightSpeed(s.val)}
                    className={`py-1.5 text-[11px] font-bold rounded-xl border transition-all ${
                      Math.abs(flightSpeed - s.val) < 0.02
                        ? 'bg-[#18181B] dark:bg-white text-white dark:text-[#18181B] border-[#18181B] dark:border-white shadow-2xs'
                        : 'bg-stone-50 dark:bg-stone-850 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <input
                id={speedInputId}
                type="range"
                min="0.05"
                max="0.35"
                step="0.01"
                value={flightSpeed}
                onChange={(e) => setFlightSpeed(parseFloat(e.target.value))}
                className="w-full accent-[#FF4D6D] h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Wing Dynamics Slider */}
            <div>
              <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1">
                <label htmlFor={wingInputId} className="cursor-pointer">Butterfly Wing Flutter Dynamics</label>
                <span className="font-mono">{wingDynamics.toFixed(2)}x</span>
              </div>
              <input
                id={wingInputId}
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={wingDynamics}
                onChange={(e) => setWingDynamics(parseFloat(e.target.value))}
                className="w-full accent-[#FF4D6D] h-2 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-stone-400 dark:text-stone-400 mt-0.5">
                <span>0.5x (Gentle)</span>
                <span>1.0x (Natural)</span>
                <span>2.0x (Frenzy)</span>
              </div>
            </div>

            {/* Trail Toggle */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Stardust Particle Trail
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={trailEnabled}
                aria-label="Toggle Stardust Particle Trail"
                onClick={() => setTrailEnabled(!trailEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#FF4D6D] ${
                  trailEnabled ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    trailEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section C: Gravity Field & Particle Color */}
          <div className="bg-white dark:bg-[#161122] p-4 rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Orbit className="w-3.5 h-3.5 text-[#00F2FE]" /> Physics Gravity & Trail
              </span>
              <span className="text-[11px] font-mono font-bold text-[#00F2FE]">
                {gravity > 0 ? `+${gravity}` : gravity} px/s²
              </span>
            </div>

            {/* Gravity Slider */}
            <div>
              <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1">
                <label htmlFor={gravityInputId} className="cursor-pointer">Gravitational Acceleration</label>
                <span className="font-mono text-xs font-bold">
                  {gravity < 0 ? 'Anti-G Float' : gravity === 0 ? 'Zero-G Orbital' : 'Heavy Earth'}
                </span>
              </div>
              <input
                id={gravityInputId}
                type="range"
                min="-60"
                max="140"
                step="5"
                value={gravity}
                onChange={(e) => setGravity(parseInt(e.target.value, 10))}
                className="w-full accent-[#00F2FE] h-2 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-stone-400 dark:text-stone-400 mt-0.5">
                <span>-60 (Anti-G)</span>
                <span>0 (Zero-G)</span>
                <span>+140 (Heavy)</span>
              </div>
            </div>

            {/* Particle Color Palette */}
            <div>
              <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-2">
                <label htmlFor={colorInputId} className="flex items-center gap-1 cursor-pointer">
                  <Palette className="w-3 h-3 text-stone-400" /> Particle Stardust Color
                </label>
                <span className="font-mono font-bold" style={{ color: particleColor }}>
                  {particleColor}
                </span>
              </div>

              {/* Swatches */}
              <div className="flex items-center gap-2 flex-wrap mb-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    title={c.name}
                    aria-label={`Select color ${c.name}`}
                    onClick={() => setParticleColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 active:scale-95 cursor-pointer shadow-xs ${
                      particleColor.toLowerCase() === c.hex.toLowerCase()
                        ? 'border-[#18181B] dark:border-white scale-110 ring-2 ring-[#FF4D6D]/60'
                        : 'border-white/80 dark:border-stone-800'
                    }`}
                  />
                ))}
              </div>

              {/* Custom Hex Picker */}
              <div className="flex items-center gap-2">
                <input
                  id={colorInputId}
                  type="color"
                  value={particleColor}
                  onChange={(e) => setParticleColor(e.target.value)}
                  className="w-9 h-8 p-0 border border-stone-200 dark:border-stone-700 rounded-lg cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={particleColor}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                      setParticleColor(val);
                    }
                  }}
                  placeholder="#FF4D6D"
                  maxLength={7}
                  className="flex-1 px-2.5 py-1 text-xs font-mono rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 text-[#18181B] dark:text-white uppercase"
                />
              </div>
            </div>
          </div>

          {/* Section D: Web Audio Synthesizer */}
          <div className="bg-white dark:bg-[#161122] p-4 rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                )}
                Web Audio Synthesizer
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={soundEnabled}
                aria-label="Toggle Web Audio Synthesis"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500 ${
                  soundEnabled ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    soundEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Master Volume */}
            <div>
              <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1">
                <label htmlFor={volumeInputId} className="cursor-pointer">Master Volume</label>
                <span className="font-mono">{Math.round(masterVolume * 100)}%</span>
              </div>
              <input
                id={volumeInputId}
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={masterVolume}
                onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Pitch Multiplier */}
            <div>
              <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1">
                <label htmlFor={pitchInputId} className="cursor-pointer">Pitch Multiplier</label>
                <span className="font-mono">{audioPitch.toFixed(2)}x</span>
              </div>
              <input
                id={pitchInputId}
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={audioPitch}
                onChange={(e) => setAudioPitch(parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-stone-400 dark:text-stone-400 mt-0.5">
                <span>0.5x (Deep Bass)</span>
                <span>1.0x (Standard)</span>
                <span>2.0x (High Whistle)</span>
              </div>
            </div>
          </div>

          {/* Section E: 7-Sound Synthesizer Soundboard */}
          <div className="bg-white dark:bg-[#161122] p-4 rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#FF4D6D]" /> 7-Sound Soundboard
              </span>
              <span className="text-[10px] font-mono text-stone-400 dark:text-stone-400">
                Acoustic Test
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'shutter', name: 'Polaroid Shutter', icon: 'shutter', fn: () => soundFX.playPolaroidShutter() },
                { id: 'sparkle', name: 'Cosmic Sparkle', icon: 'sparkle', fn: () => soundFX.playCosmicSparkle() },
                { id: 'pop', name: 'Bubble Pop', icon: 'pop', fn: () => soundFX.playBubblePop() },
                { id: 'focus', name: 'Laser Focus', icon: 'focus', fn: () => soundFX.playLaserFocus() },
                { id: 'chime', name: 'Crystal Chime', icon: 'chime', fn: () => soundFX.playCrystalChime() },
                { id: 'ribbon', name: 'Ribbon Sweep', icon: 'ribbon', fn: () => soundFX.playRibbonSweep('up') },
                { id: 'haptic', name: 'Haptic Click', icon: 'haptic', fn: () => soundFX.playHapticClick(), fullWidth: true }
              ].map((sound) => {
                const IconComponent = SOUNDBOARD_ICONS[sound.icon] || Activity;
                const isPlaying = activeSoundId === sound.id;

                return (
                  <button
                    key={sound.id}
                    type="button"
                    onClick={() => handleSoundboardPlay(sound.id, sound.fn)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold transition-all select-none cursor-pointer ${
                      sound.fullWidth ? 'col-span-2' : ''
                    } ${
                      isPlaying
                        ? 'bg-[#FF4D6D] text-white border-[#FF4D6D] scale-[0.98] shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-850 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-[#FF4D6D]/40 hover:bg-white dark:hover:bg-stone-800'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 shrink-0 ${isPlaying ? 'text-white' : 'text-[#FF4D6D]'}`} />
                    <span className="truncate">{sound.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="shrink-0 px-5 py-3.5 border-t border-[#ECE7DF] dark:border-[#2D2340] bg-white/70 dark:bg-[#161122]/70 backdrop-blur-md flex items-center justify-between">
          <button
            type="button"
            onClick={handleJumpToWorkbench}
            className="flex items-center gap-1.5 text-xs font-bold text-[#FF4D6D] hover:underline"
          >
            <span>Open Full Workbench</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono text-stone-400 dark:text-stone-400">
            Auto-persists
          </span>
        </div>
      </aside>
    </>
  );
}
