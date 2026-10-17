import React from 'react';
import { Sliders, Sparkles, Eye, Wind, Palette, ArrowDownUp, Volume2, Play } from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function InteractivePlayground({
  butterflySpeed,
  setButterflySpeed,
  trailEnabled,
  setTrailEnabled,
  butterflyScale,
  setButterflyScale,
  forcedState,
  setForcedState,
  soundEnabled,
  setSoundEnabled,
  reducedMotion,
  setReducedMotion,
  gravity = 0,
  setGravity = () => {},
  particleColor = '#FF4D6D',
  setParticleColor = () => {},
  audioPitch = 1.0,
  setAudioPitch = () => {}
}) {
  return (
    <section id="playground" className="py-20 px-4 md:px-8 max-w-5xl mx-auto scroll-mt-28">
      <div className="bg-white dark:bg-[#161122] rounded-3xl p-8 md:p-12 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xl shadow-stone-900/5">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#ECE7DF] dark:border-[#2D2340]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4D6D] uppercase tracking-wider mb-1">
              <Sliders className="w-3.5 h-3.5" />
              Real-Time Tuning
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#18181B] dark:text-white font-['Outfit',sans-serif]">
              Butterfly & Camera Physics Lab
            </h2>
            <p className="text-xs md:text-sm text-stone-600 dark:text-stone-400 mt-1 font-normal">
              Test and tune the cursor kinematics, character tracking zones, and audio-visual feedback in real time.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setButterflySpeed(0.14);
              setTrailEnabled(true);
              setButterflyScale(1);
              setForcedState(null);
              setSoundEnabled(true);
              soundFX.setEnabled(true);
              setReducedMotion(false);
              setParticleColor('#FF4D6D');
              setGravity(0);
              setAudioPitch(1.0);
              soundFX.resetAudioDefaults();
              soundFX.playSparkle();
            }}
            className="self-start md:self-auto text-xs font-bold px-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-[#18181B] dark:text-stone-200 border border-stone-200 dark:border-stone-700 shadow-xs transition-colors uppercase tracking-wider"
          >
            Reset Defaults
          </button>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* 1. Lerp Speed Preset */}
          <div className="bg-[#FAF8F5] dark:bg-[#100C1A]/80 p-5 rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-[#FF4D6D]" /> Flight Lerp
              </span>
              <span className="text-xs font-mono font-bold text-[#FF4D6D]">
                {butterflySpeed === 0.25 ? 'Snappy' : butterflySpeed === 0.07 ? 'Dreamy' : 'Natural (0.14)'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Dreamy', val: 0.07 },
                { label: 'Natural', val: 0.14 },
                { label: 'Snappy', val: 0.25 }
              ].map(preset => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setButterflySpeed(preset.val);
                    soundFX.playFocusBeep();
                  }}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    butterflySpeed === preset.val
                      ? 'bg-[#18181B] dark:bg-white text-white dark:text-[#18181B] border-[#18181B] dark:border-white shadow-xs'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Character Pose Override */}
          <div className="bg-[#FAF8F5] dark:bg-[#100C1A]/80 p-5 rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#FF4D6D]" /> Camera Pose
              </span>
              <span className="text-xs font-mono font-bold text-[#FF4D6D] capitalize">
                {forcedState || 'Auto-Track'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
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
              ].map(item => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setForcedState(item.val);
                    soundFX.playFocusBeep();
                  }}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    forcedState === item.val
                      ? 'bg-[#18181B] dark:bg-white text-white dark:text-[#18181B] border-[#18181B] dark:border-white shadow-xs'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Butterfly Scale Slider */}
          <div className="bg-[#FAF8F5] dark:bg-[#100C1A]/80 p-5 rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FF4D6D]" /> Butterfly Scale
              </span>
              <span className="text-xs font-mono font-bold text-[#FF4D6D]">
                {Math.round(butterflyScale * 38)}px ({butterflyScale}x)
              </span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.5"
              step="0.05"
              value={butterflyScale}
              onChange={(e) => setButterflyScale(parseFloat(e.target.value))}
              className="w-full accent-[#FF4D6D] cursor-pointer"
            />
          </div>

          {/* 4. Particle Stardust Trail Toggle */}
          <div className="bg-[#FAF8F5] dark:bg-[#100C1A]/80 p-5 rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">Stardust Trail</div>
              <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Canvas glow sparkles</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={trailEnabled}
              aria-label="Toggle stardust canvas particle trail"
              onClick={() => {
                setTrailEnabled(!trailEnabled);
                soundFX.playFocusBeep();
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden ${
                trailEnabled ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  trailEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 5. Mechanical Shutter Sound Toggle */}
          <div className="bg-[#FAF8F5] dark:bg-[#100C1A]/80 p-5 rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">Audio Shutter</div>
              <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Synthesized shutter click</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={soundEnabled}
              aria-label="Toggle audio shutter synthesis"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                soundFX.setEnabled(next);
                if (next) soundFX.playShutter();
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden ${
                soundEnabled ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 6. Reduced Motion Mode */}
          <div className="bg-[#FAF8F5] dark:bg-[#100C1A]/80 p-5 rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">Reduced Motion</div>
              <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Calm static mode (a11y)</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={reducedMotion}
              aria-label="Toggle prefers-reduced-motion calm static fallback"
              onClick={() => {
                setReducedMotion(!reducedMotion);
                soundFX.playFocusBeep();
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden ${
                reducedMotion ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  reducedMotion ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 7. Particle Color Customizer */}
          <div className="bg-[#FAF8F5] dark:bg-[#100C1A]/80 p-5 rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-[#FF4D6D]" /> Particle Hue
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-mono font-bold text-stone-800 dark:text-stone-200">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/10 dark:border-white/20 shrink-0"
                    style={{ backgroundColor: particleColor }}
                  />
                  {particleColor.toUpperCase()}
                </span>
              </div>

              {/* 4 Quick-preset theme pills */}
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                {[
                  { name: 'Cyberpunk', hex: '#FF4D6D' },
                  { name: 'Neon Cyan', hex: '#00F2FE' },
                  { name: 'Solar Gold', hex: '#FFD700' },
                  { name: 'Matrix Emerald', hex: '#10B981' }
                ].map((preset) => {
                  const isSelected = particleColor.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setParticleColor(preset.hex);
                        soundFX.playFocusBeep();
                      }}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        isSelected
                          ? 'bg-[#18181B] dark:bg-white text-white dark:text-[#18181B] border-[#18181B] dark:border-white shadow-xs'
                          : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full shrink-0 border border-black/15 shadow-2xs"
                        style={{ backgroundColor: preset.hex }}
                      />
                      <span className="truncate">{preset.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Native HTML5 Color Input + Custom Hex */}
            <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-stone-200/70 dark:border-stone-800">
              <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">Custom Picker</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={particleColor.length === 7 && particleColor.startsWith('#') ? particleColor : '#FF4D6D'}
                  onChange={(e) => setParticleColor(e.target.value)}
                  aria-label="Particle color picker"
                  className="w-8 h-8 rounded-lg cursor-pointer border border-stone-200 dark:border-stone-700 p-0.5 bg-white dark:bg-stone-800 hover:scale-105 transition-transform"
                />
                <input
                  type="text"
                  value={particleColor}
                  onChange={(e) => setParticleColor(e.target.value)}
                  placeholder="#FF4D6D"
                  maxLength={7}
                  aria-label="Hex color code"
                  className="w-20 px-2 py-1 text-xs font-mono font-bold rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-center uppercase focus:outline-hidden focus:border-[#FF4D6D]"
                />
              </div>
            </div>
          </div>

          {/* 8. Gravity Tuner */}
          <div className="bg-[#FAF8F5] dark:bg-[#100C1A]/80 p-5 rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <ArrowDownUp className="w-4 h-4 text-[#FF4D6D]" /> Gravity Field
                </span>
                <span className={`text-xs font-mono font-bold ${
                  gravity < -10
                    ? 'text-indigo-500 dark:text-indigo-400'
                    : gravity <= 10
                    ? 'text-amber-500 dark:text-amber-400'
                    : 'text-emerald-500 dark:text-emerald-400'
                }`}>
                  {gravity < -10
                    ? 'Anti-Gravity Float'
                    : gravity <= 10
                    ? 'Zero-G Drift'
                    : 'Earth Gravity'}{' '}
                  ({gravity > 0 ? `+${gravity}` : gravity} px/s²)
                </span>
              </div>

              {/* Range Slider from -60 to 140 step 5 */}
              <div className="space-y-1 mb-3">
                <input
                  type="range"
                  min="-60"
                  max="140"
                  step="5"
                  value={gravity}
                  onChange={(e) => setGravity(parseFloat(e.target.value))}
                  aria-label="Adjust gravity force in pixels per second squared"
                  className="w-full accent-[#FF4D6D] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-stone-400 dark:text-stone-500 px-0.5">
                  <span>-60 (Float)</span>
                  <span>0 (Zero-G)</span>
                  <span>+140 (Heavy)</span>
                </div>
              </div>
            </div>

            {/* 3 Quick preset buttons */}
            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-stone-200/70 dark:border-stone-800">
              {[
                { label: 'Anti-G (-30)', val: -30 },
                { label: 'Zero-G (0)', val: 0 },
                { label: 'Earth (+75)', val: 75 }
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setGravity(preset.val);
                    soundFX.playFocusBeep();
                  }}
                  className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    gravity === preset.val
                      ? 'bg-[#18181B] dark:bg-white text-white dark:text-[#18181B] border-[#18181B] dark:border-white shadow-xs'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 9. Audio Frequency & Pitch */}
          <div className="bg-[#FAF8F5] dark:bg-[#100C1A]/80 p-5 rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-[#FF4D6D]" /> Audio Pitch
                </span>
                <span className="text-xs font-mono font-bold text-[#FF4D6D]">
                  {audioPitch <= 0.75
                    ? `${Number(audioPitch).toFixed(2)}x Deep Bass`
                    : audioPitch < 1.25
                    ? `${Number(audioPitch).toFixed(2)}x Natural`
                    : audioPitch < 1.7
                    ? `${Number(audioPitch).toFixed(2)}x High Tone`
                    : `${Number(audioPitch).toFixed(2)}x High Crystal`}
                </span>
              </div>

              {/* Range Slider from 0.5 to 2.0 step 0.05 */}
              <div className="space-y-1 mb-3">
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={audioPitch}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setAudioPitch(val);
                    soundFX.setPitchMultiplier(val);
                  }}
                  aria-label="Adjust audio synthesizer pitch multiplier"
                  className="w-full accent-[#FF4D6D] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-stone-400 dark:text-stone-500 px-0.5">
                  <span>0.5x (Bass)</span>
                  <span>1.0x (Norm)</span>
                  <span>2.0x (Crystal)</span>
                </div>
              </div>
            </div>

            {/* Live Test Tone / Preview Pitch Button + Reset */}
            <div className="flex items-center gap-2 pt-2 border-t border-stone-200/70 dark:border-stone-800">
              <button
                type="button"
                onClick={() => {
                  soundFX.playTonePreview(440 * audioPitch);
                  soundFX.playFocusBeep();
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-bold rounded-xl bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 active:scale-95 transition-all shadow-xs"
              >
                <Play className="w-3 h-3 text-[#FF4D6D] fill-[#FF4D6D]" />
                Preview Pitch
              </button>
              <button
                type="button"
                onClick={() => {
                  setAudioPitch(1.0);
                  soundFX.setPitchMultiplier(1.0);
                  soundFX.playFocusBeep();
                }}
                title="Reset pitch to 1.0x Natural"
                className="py-1.5 px-2.5 text-xs font-mono font-bold rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              >
                1.0x
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
