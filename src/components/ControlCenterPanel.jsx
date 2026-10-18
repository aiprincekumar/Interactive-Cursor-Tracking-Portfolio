/* oxlint-disable react/only-export-components */
import React from 'react';
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
  Palette
} from 'lucide-react';
import { useLab, POSE_INDEX_MAP } from '../context/LabContext';
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

export default function ControlCenterPanel({ variant = 'workbench' }) {
  const lab = useLab();

  const {
    // Audio
    soundEnabled,
    masterVolume,
    pitchMultiplier,
    soundMatchingMode,
    setSoundEnabled,
    setMasterVolume,
    setPitchMultiplier,
    setSoundMatchingMode,

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
    flashConfettiEnabled,
    setGazeMode,
    setPoseOverride,
    setCharacterZoom,
    setFlashConfettiEnabled,

    // Preferences
    defaultStartupRole,
    defaultCursorEnabled,
    defaultAudioEnabled,
    reducedMotion,
    setDefaultStartupRole,
    setDefaultCursorEnabled,
    setDefaultAudioEnabled,
    setReducedMotion,

    // State & Meta
    activeTab,
    setActiveTab,
    resetDefaults
  } = lab;

  const isDrawer = variant === 'drawer';

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

  const tabs = [
    { id: 'audio', label: 'Audio Studio', icon: Volume2, tag: soundEnabled ? `${Math.round(masterVolume * 100)}%` : 'Muted' },
    { id: 'cursor', label: 'Cursor & Dynamics', icon: Sparkles, tag: customCursorEnabled ? `${cursorScale.toFixed(1)}x` : 'Native' },
    { id: 'hero', label: 'Hero & Character', icon: User, tag: gazeMode === 'fixed' ? 'Fixed' : 'Auto' },
    { id: 'preferences', label: 'Startup & Preferences', icon: Settings, tag: defaultStartupRole }
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 4-Tab Navigation Bar */}
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="flex p-1.5 bg-[#FAF8F5] dark:bg-[#181226] rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] gap-1.5 overflow-x-auto no-scrollbar shadow-xs"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              onClick={() => {
                setActiveTab(tab.id);
                if (soundEnabled) soundFX.playHapticClick();
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-[#251A3A] text-[#18181B] dark:text-white shadow-xs border border-[#E7E2D8] dark:border-[#3D2C5A]'
                  : 'text-stone-600 dark:text-stone-400 hover:text-[#18181B] dark:hover:text-white hover:bg-stone-100/70 dark:hover:bg-[#251A3A]/50 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF4D6D]' : 'text-stone-400 dark:text-stone-500'}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                  isActive
                    ? 'bg-[#FF4D6D]/10 text-[#FF4D6D] dark:bg-[#FF4D6D]/20'
                    : 'bg-stone-200/60 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                }`}
              >
                {tab.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: AUDIO STUDIO                                                       */}
      {/* ========================================================================= */}
      {activeTab === 'audio' && (
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
                  onClick={() => setSoundEnabled(!soundEnabled)}
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
                onChange={(e) => setMasterVolume(parseInt(e.target.value, 10))}
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
      {activeTab === 'cursor' && (
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
      {activeTab === 'hero' && (
        <div
          role="tabpanel"
          id="panel-hero"
          aria-labelledby="tab-hero"
          tabIndex={0}
          className="flex flex-col gap-6 focus:outline-none animate-fadeIn"
        >
          {/* Gaze Tracking Mode & Confetti Toggle */}
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
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
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
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <Crosshair className="w-4 h-4 mb-0.5" />
                  <span className="text-xs">Static Fixed Gaze</span>
                  <span className="text-[10px] opacity-70">Pins to center/override</span>
                </button>
              </div>
            </div>

            {/* Polaroid Camera Flash & Confetti */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${flashConfettiEnabled ? 'bg-[#FF4D6D]/10 text-[#FF4D6D]' : 'bg-stone-100 dark:bg-stone-800 text-stone-400'}`}>
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#18181B] dark:text-white">Flash & Confetti</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">On Polaroid "Shoot a look 📸"</p>
                  </div>
                </div>
                <button
                  role="switch"
                  aria-checked={flashConfettiEnabled}
                  onClick={() => setFlashConfettiEnabled(!flashConfettiEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]/40 ${
                    flashConfettiEnabled ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
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
          </div>

          {/* Character Zoom / Scale Slider */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#181226]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#18181B] dark:text-white">Character Stage Zoom</h4>
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
      {/* TAB 4: STARTUP & PREFERENCES                                              */}
      {/* ========================================================================= */}
      {activeTab === 'preferences' && (
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

          {/* Startup Default States & Reduced Motion */}
          <div className={`grid ${isDrawer ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-4`}>
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
    </div>
  );
}
