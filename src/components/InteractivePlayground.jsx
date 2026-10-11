import React from 'react';
import { Sliders, Sparkles, Eye, Wind } from 'lucide-react';
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
  setReducedMotion
}) {
  return (
    <section id="playground" className="py-20 px-4 md:px-8 max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl p-8 md:p-12 border border-[#E7E2D8] shadow-xl shadow-stone-900/5">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#ECE7DF]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4D6D] uppercase tracking-wider mb-1">
              <Sliders className="w-3.5 h-3.5" />
              Real-Time Tuning
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#18181B] font-['Outfit',sans-serif]">
              Butterfly & Camera Physics Lab
            </h2>
            <p className="text-xs md:text-sm text-stone-600 mt-1 font-normal">
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
              soundFX.playSparkle();
            }}
            className="self-start md:self-auto text-xs font-bold px-4 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-[#18181B] border border-stone-200 shadow-xs transition-colors uppercase tracking-wider"
          >
            Reset Defaults
          </button>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* 1. Lerp Speed Preset */}
          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#ECE7DF] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
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
                      ? 'bg-[#18181B] text-white border-[#18181B] shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Character Pose Override */}
          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#ECE7DF] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
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
                      ? 'bg-[#18181B] text-white border-[#18181B] shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Butterfly Scale Slider */}
          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#ECE7DF] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
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
          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#ECE7DF] shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-stone-800">Stardust Trail</div>
              <div className="text-xs text-stone-500 mt-0.5">Canvas glow sparkles</div>
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
                trailEnabled ? 'bg-[#FF4D6D]' : 'bg-stone-300'
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
          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#ECE7DF] shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-stone-800">Audio Shutter</div>
              <div className="text-xs text-stone-500 mt-0.5">Synthesized shutter click</div>
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
                soundEnabled ? 'bg-[#FF4D6D]' : 'bg-stone-300'
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
          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#ECE7DF] shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-stone-800">Reduced Motion</div>
              <div className="text-xs text-stone-500 mt-0.5">Calm static mode (a11y)</div>
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
                reducedMotion ? 'bg-[#FF4D6D]' : 'bg-stone-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  reducedMotion ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
