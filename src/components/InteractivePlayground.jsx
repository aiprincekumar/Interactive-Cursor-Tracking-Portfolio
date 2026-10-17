import React, { useState, useId } from 'react';
import {
  Sliders,
  Sparkles,
  Eye,
  Wind,
  Palette,
  Orbit,
  Volume2,
  VolumeX,
  RotateCcw,
  FlaskConical,
  Check,
  Activity,
  Camera,
  CircleDot,
  Crosshair,
  Bell,
  Fingerprint
} from 'lucide-react';
import { useLab, LAB_PRESETS } from '../context/LabContext';
import { soundFX } from '../utils/audio';
import PhysicsSandbox from './PhysicsSandbox';

const PRESET_CARDS = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Zero-G',
    tag: '-25 G • Cyan',
    desc: 'Electric agility & zero-g float',
    color: '#00F2FE'
  },
  {
    id: 'arcade',
    name: 'Retro Arcade',
    tag: '+95 G • Gold',
    desc: 'Instant snap & heavy coin bounce',
    color: '#FFD700'
  },
  {
    id: 'zen',
    name: 'Zen Minimalist',
    tag: '0 G • Emerald',
    desc: 'Delicate glide & organic calm',
    color: '#10B981'
  },
  {
    id: 'hyper',
    name: 'Hyper Velocity',
    tag: '+45 G • Coral',
    desc: 'Supersonic frenzy & dive gravity',
    color: '#FF4D6D'
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

const POSE_BUTTONS = [
  { label: 'Auto', val: null },
  { label: 'Idle', val: 'idle' },
  { label: 'Center', val: 'center' },
  { label: 'Left', val: 'left' },
  { label: 'Right', val: 'right' },
  { label: 'Up-Center', val: 'upper-center' },
  { label: 'Down-Center', val: 'lower-center' },
  { label: 'Up-Left', val: 'upper-left' },
  { label: 'Down-Left', val: 'lower-left' },
  { label: 'Up-Right', val: 'upper-right' },
  { label: 'Down-Right', val: 'lower-right' }
];

export default function InteractivePlayground(props = {}) {
  const lab = useLab();

  // Dual-source parameter resolution (LabContext with fallback to props)
  const cursorScale = props.butterflyScale ?? lab.cursorScale;
  const setCursorScale = props.setButterflyScale ?? lab.setCursorScale;

  const flightSpeed = props.butterflySpeed ?? lab.flightSpeed;
  const setFlightSpeed = props.setButterflySpeed ?? lab.setFlightSpeed;

  const wingDynamics = lab.wingDynamics;
  const setWingDynamics = lab.setWingDynamics;

  const gravity = props.gravity ?? lab.gravity;
  const setGravity = props.setGravity ?? lab.setGravity;

  const trailEnabled = props.trailEnabled ?? lab.trailEnabled;
  const setTrailEnabled = props.setTrailEnabled ?? lab.setTrailEnabled;

  const particleColor = props.particleColor ?? lab.particleColor;
  const setParticleColor = props.setParticleColor ?? lab.setParticleColor;

  const soundEnabled = props.soundEnabled ?? lab.soundEnabled;
  const setSoundEnabled = props.setSoundEnabled ?? lab.setSoundEnabled;

  const masterVolume = lab.masterVolume;
  const setMasterVolume = lab.setMasterVolume;

  const audioPitch = props.audioPitch ?? lab.audioPitch;
  const setAudioPitch = props.setAudioPitch ?? lab.setAudioPitch;

  const activePreset = lab.activePreset;
  const applyPreset = lab.applyPreset;
  const resetDefaults = lab.resetDefaults;
  const openDrawer = lab.openDrawer;

  const forcedState = props.forcedState ?? null;
  const setForcedState = props.setForcedState ?? (() => {});

  const [activeSoundId, setActiveSoundId] = useState(null);
  const scaleInputId = useId();
  const speedInputId = useId();
  const wingInputId = useId();
  const gravityInputId = useId();
  const colorInputId = useId();
  const volumeInputId = useId();
  const pitchInputId = useId();

  const handleSoundboardPlay = (id, playFn) => {
    setActiveSoundId(id);
    try {
      playFn();
    } catch {
      // Ignore
    }
    setTimeout(() => {
      setActiveSoundId((curr) => (curr === id ? null : curr));
    }, 280);
  };

  const handleReset = () => {
    resetDefaults();
    setForcedState(null);
    if (props.setReducedMotion) {
      props.setReducedMotion(false);
    }
    soundFX.playSparkle();
  };

  return (
    <section
      id="playground"
      className="py-20 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-28 relative select-none"
    >
      {/* Dual anchor support for #lab and #playground */}
      <span id="lab" className="absolute -top-28 pointer-events-none" aria-hidden="true" />

      {/* Main Glassmorphism Workbench Card */}
      <div className="bg-[#FAF8F5]/90 dark:bg-[#120D1D]/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 md:p-10 border border-[#E7E2D8] dark:border-[#2D2340] shadow-2xl shadow-stone-900/5 transition-colors duration-300">
        {/* Workbench Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#ECE7DF] dark:border-[#2D2340]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF4D6D] uppercase tracking-wider mb-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 border border-[#FFD1DC] dark:border-[#FF4D6D]/30">
              <FlaskConical className="w-3.5 h-3.5" />
              Hybrid Physics & Kinematics Studio
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#18181B] dark:text-white font-['Outfit',sans-serif] tracking-tight">
              Interactive Lab Studio &bull; Butterfly & Camera Physics Lab
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl font-normal leading-relaxed">
              Test and tune real-time 2D physics collisions, calibrate cursor kinematics across all 35 styles, modulate Web Audio synthesis frequencies, and test 1-click presets live.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
            {/* Quick Drawer Launcher Button */}
            <button
              type="button"
              onClick={openDrawer}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold font-mono rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:border-[#FF4D6D]/40 hover:text-[#FF4D6D] dark:hover:text-[#FF4D6D] shadow-2xs transition-all cursor-pointer"
              title="Open Quick Lab Studio Drawer anywhere on screen"
            >
              <Sliders className="w-3.5 h-3.5 text-[#FF4D6D]" />
              <span>Quick Drawer</span>
            </button>

            {/* Reset Defaults */}
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold font-mono rounded-xl bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 text-[#FF4D6D] border border-[#FFD1DC] dark:border-[#FF4D6D]/30 hover:bg-[#FF4D6D] hover:text-white transition-all shadow-2xs cursor-pointer uppercase tracking-wider"
              title="Restore all factory defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Workbench Split Layout: Left Pane (Physics Arena & Telemetry) + Right Pane (Modular Tuning Controls) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================= */}
          {/* LEFT PANE: 2D Physics Sandbox Arena & Live Telemetry HUD */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-[#161122] rounded-3xl p-5 border border-[#ECE7DF] dark:border-[#2D2340] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
                  <Orbit className="w-4 h-4 text-[#00F2FE]" />
                  2D Kinetic Physics Sandbox
                </span>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                  7 Elastic Orbs
                </span>
              </div>

              {/* Embedded Physics Sandbox Arena with Live Telemetry HUD */}
              <PhysicsSandbox
                gravity={gravity}
                particleColor={particleColor}
                soundEnabled={soundEnabled}
              />

              {/* Pro-Tip Bar */}
              <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 font-medium px-1">
                <span>Move cursor swiftly inside to deflect orbs & transfer kinetic energy.</span>
                <span className="font-mono text-[#00F2FE]">Proportional Impulse</span>
              </div>
            </div>

            {/* Character Camera Pose Override Section */}
            <div className="bg-white dark:bg-[#161122] p-5 rounded-3xl border border-[#ECE7DF] dark:border-[#2D2340] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#FF4D6D]" /> Hero 2.5D Camera Gaze Override
                </span>
                <span className="text-xs font-mono font-bold text-[#FF4D6D] capitalize">
                  {forcedState || 'Auto-Track'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Test the 10 distinct 3D head poses of the character gaze tracking model.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {POSE_BUTTONS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setForcedState(item.val);
                      soundFX.playLaserFocus();
                    }}
                    className={`py-1.5 px-3 text-xs font-bold font-mono rounded-xl border transition-all cursor-pointer ${
                      forcedState === item.val
                        ? 'bg-[#18181B] dark:bg-white text-white dark:text-[#18181B] border-[#18181B] dark:border-white shadow-2xs'
                        : 'bg-stone-50 dark:bg-stone-850 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT PANE: Modular Tuning Controls Suite, Presets & Audio */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-5">
            {/* 1. 1-Click Presets */}
            <div className="bg-white dark:bg-[#161122] p-5 rounded-3xl border border-[#ECE7DF] dark:border-[#2D2340] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF4D6D]" /> 1-Click Studio Presets
                </span>
                <span className="text-[10px] font-mono text-stone-400 dark:text-stone-400 uppercase">
                  Active: {LAB_PRESETS[activePreset]?.name || 'Custom'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {PRESET_CARDS.map((preset) => {
                  const isSelected = activePreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset.id)}
                      className={`p-3 rounded-2xl border text-left transition-all duration-200 select-none cursor-pointer relative group ${
                        isSelected
                          ? 'bg-[#FAF8F5] dark:bg-stone-850 border-[#FF4D6D] shadow-xs ring-2 ring-[#FF4D6D]/40'
                          : 'bg-stone-50/60 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 hover:bg-white dark:hover:bg-stone-850'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#18181B] dark:text-white truncate">
                          {preset.name}
                        </span>
                        {isSelected && (
                          <span className="w-3.5 h-3.5 rounded-full bg-[#FF4D6D] text-white flex items-center justify-center shrink-0">
                            <Check className="w-2 h-2" />
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate mb-1">
                        {preset.desc}
                      </p>
                      <span className="inline-block text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {preset.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Cursor Kinematics Tuning */}
            <div className="bg-white dark:bg-[#161122] p-5 rounded-3xl border border-[#ECE7DF] dark:border-[#2D2340] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#FF4D6D]" /> Cursor Kinematics
                </span>
                <span className="text-xs font-mono font-bold text-[#FF4D6D]">
                  {cursorScale.toFixed(2)}x ({Math.round(cursorScale * 38)}px)
                </span>
              </div>

              {/* Cursor Scale Slider */}
              <div>
                <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                  <label htmlFor={scaleInputId} className="cursor-pointer">Global Scale (35 Variants)</label>
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
                  <span>0.5x (19px)</span>
                  <span>1.0x (38px)</span>
                  <span>2.0x (76px)</span>
                </div>
              </div>

              {/* Flight Lerp Speed */}
              <div>
                <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400 mb-1.5">
                  <label htmlFor={speedInputId} className="flex items-center gap-1 cursor-pointer">
                    <Wind className="w-3.5 h-3.5 text-stone-400" /> Flight Lerp Speed
                  </label>
                  <span className="font-mono font-bold text-stone-700 dark:text-stone-300">
                    {flightSpeed === 0.25 ? 'Snappy (0.25)' : flightSpeed === 0.07 ? 'Dreamy (0.07)' : `Natural (${flightSpeed.toFixed(2)})`}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[
                    { label: 'Dreamy', val: 0.07 },
                    { label: 'Natural', val: 0.14 },
                    { label: 'Snappy', val: 0.25 }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFlightSpeed(preset.val)}
                      className={`py-1.5 text-xs font-bold font-mono rounded-xl border transition-all cursor-pointer ${
                        Math.abs(flightSpeed - preset.val) < 0.02
                          ? 'bg-[#18181B] dark:bg-white text-white dark:text-[#18181B] border-[#18181B] dark:border-white shadow-2xs'
                          : 'bg-stone-50 dark:bg-stone-850 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      {preset.label}
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

              {/* Butterfly Wing Flutter Dynamics */}
              <div>
                <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                  <label htmlFor={wingInputId} className="cursor-pointer">Butterfly Wing Flutter Frequency</label>
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
                  <span>0.5x (Calm Glide)</span>
                  <span>1.0x (Organic)</span>
                  <span>2.0x (Hyper Frenzy)</span>
                </div>
              </div>

              {/* Stardust Trail Switch */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="text-xs font-bold text-stone-800 dark:text-stone-200">Stardust Canvas Trail</div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">Particle emission stream</div>
                </div>
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

            {/* 3. Physics Gravity & Particle Color */}
            <div className="bg-white dark:bg-[#161122] p-5 rounded-3xl border border-[#ECE7DF] dark:border-[#2D2340] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
                  <Orbit className="w-4 h-4 text-[#00F2FE]" /> Physics Gravity & Trail Palette
                </span>
                <span className="text-xs font-mono font-bold text-[#00F2FE]">
                  {gravity > 0 ? `+${gravity}` : gravity} px/s²
                </span>
              </div>

              {/* Gravity Slider */}
              <div>
                <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                  <label htmlFor={gravityInputId} className="cursor-pointer">Gravitational Acceleration</label>
                  <span className="font-mono font-semibold">
                    {gravity < 0 ? 'Anti-G Float' : gravity === 0 ? 'Zero-G Orbital' : 'Earth Gravity'}
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
                  <span>+140 (Heavy Earth)</span>
                </div>
              </div>

              {/* Color Customizer */}
              <div>
                <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
                  <label htmlFor={colorInputId} className="flex items-center gap-1 cursor-pointer">
                    <Palette className="w-3.5 h-3.5 text-stone-400" /> Particle Palette
                  </label>
                  <span className="font-mono font-bold" style={{ color: particleColor }}>
                    {particleColor}
                  </span>
                </div>

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
                    className="flex-1 px-3 py-1.5 text-xs font-mono rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 text-[#18181B] dark:text-white uppercase"
                  />
                </div>
              </div>
            </div>

            {/* 4. Web Audio Synthesizer Controls */}
            <div className="bg-white dark:bg-[#161122] p-5 rounded-3xl border border-[#ECE7DF] dark:border-[#2D2340] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-amber-500" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-stone-400" />
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
                <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
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
                <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                  <label htmlFor={pitchInputId} className="cursor-pointer">Pitch Multiplier (0.5x - 2.0x)</label>
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

            {/* 5. 7-Sound Synthesizer Soundboard */}
            <div className="bg-white dark:bg-[#161122] p-5 rounded-3xl border border-[#ECE7DF] dark:border-[#2D2340] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#FF4D6D]" /> 7-Sound Acoustic Soundboard
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
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold font-mono transition-all select-none cursor-pointer ${
                        sound.fullWidth ? 'col-span-2' : ''
                      } ${
                        isPlaying
                          ? 'bg-[#FF4D6D] text-white border-[#FF4D6D] scale-[0.98] shadow-sm'
                          : 'bg-stone-50 dark:bg-stone-850 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-[#FF4D6D]/40 hover:bg-white dark:hover:bg-stone-800'
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 shrink-0 ${isPlaying ? 'text-white' : 'text-[#FF4D6D]'}`} />
                      <span className="truncate">{sound.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
