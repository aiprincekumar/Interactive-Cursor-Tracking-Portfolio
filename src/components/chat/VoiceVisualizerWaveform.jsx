import React, { useEffect, useRef, useState } from 'react';
import { Mic, Volume2, Square, Pause, Play, Sparkles } from 'lucide-react';
import { VOICE_STATES } from '../../utils/voiceAgentEngine';

/**
 * Procedural Multi-Sine Canvas Waveform Visualizer
 * Reacts dynamically to 'listening', 'speaking', 'processing', and 'paused' states.
 * Respects `prefers-reduced-motion`.
 */
export function VoiceVisualizerWaveform({
  state = VOICE_STATES.IDLE,
  onStop,
  onPauseResume,
  label,
  className = ''
}) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check user motion preferences
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);

    const listener = (e) => setPrefersReducedMotion(e.matches);
    if (mq.addEventListener) {
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
    mq.addListener(listener);
    return () => mq.removeListener(listener);
  }, []);

  // Main Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    let isActive = true;

    // Handle high DPI scaling
    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      canvas.width = Math.max(rect.width * dpr, 100);
      canvas.height = Math.max(rect.height * dpr, 40);
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    resize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', resize);
    }

    const render = () => {
      if (!isActive) return;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const midY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Reduced motion fallback: draw gentle static harmonic pills
      if (prefersReducedMotion) {
        const barCount = 16;
        const barWidth = Math.max(3, (width - (barCount * 4)) / barCount);
        const isSpeaking = state === VOICE_STATES.SPEAKING;
        const isListening = state === VOICE_STATES.LISTENING;
        const isPaused = state === VOICE_STATES.PAUSED;

        for (let i = 0; i < barCount; i++) {
          const x = i * (barWidth + 4) + 6;
          const barH = isSpeaking || isListening || isPaused ? Math.sin((i / barCount) * Math.PI) * (height * 0.5) + 6 : 4;
          const y = midY - barH / 2;

          ctx.fillStyle = isListening
            ? 'rgba(6, 182, 212, 0.7)'
            : isSpeaking
            ? 'rgba(16, 185, 129, 0.7)'
            : isPaused
            ? 'rgba(245, 158, 11, 0.7)'
            : 'rgba(148, 163, 184, 0.4)';
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(x, y, barWidth, barH, 2);
          } else {
            ctx.rect(x, y, barWidth, barH);
          }
          ctx.fill();
        }
        return;
      }

      // Dynamic Animated Waves
      const isListening = state === VOICE_STATES.LISTENING;
      const isSpeaking = state === VOICE_STATES.SPEAKING;
      const isPaused = state === VOICE_STATES.PAUSED;
      const isProcessing = state === VOICE_STATES.PROCESSING;

      // Base frequency and wave parameters
      phase += isPaused ? 0.005 : isSpeaking ? 0.08 : isListening ? 0.06 : isProcessing ? 0.04 : 0.01;
      const primaryAmp = isSpeaking ? height * 0.38 : isListening ? height * 0.32 : isProcessing ? height * 0.15 : isPaused ? height * 0.12 : 2;

      // Create glowing linear gradient
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      if (isListening) {
        // Neon cyan to violet glow
        grad.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
        grad.addColorStop(0.3, 'rgba(6, 182, 212, 0.9)');
        grad.addColorStop(0.7, 'rgba(168, 85, 247, 0.9)');
        grad.addColorStop(1, 'rgba(168, 85, 247, 0.15)');
      } else if (isSpeaking) {
        // Emerald to amber gradient
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
        grad.addColorStop(0.3, 'rgba(16, 185, 129, 0.95)');
        grad.addColorStop(0.7, 'rgba(245, 158, 11, 0.95)');
        grad.addColorStop(1, 'rgba(245, 158, 11, 0.15)');
      } else if (isPaused) {
        // Warm amber gradient for paused state
        grad.addColorStop(0, 'rgba(245, 158, 11, 0.15)');
        grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.9)');
        grad.addColorStop(1, 'rgba(245, 158, 11, 0.15)');
      } else if (isProcessing) {
        // Soft purple to indigo
        grad.addColorStop(0, 'rgba(139, 92, 246, 0.2)');
        grad.addColorStop(0.5, 'rgba(99, 102, 241, 0.8)');
        grad.addColorStop(1, 'rgba(139, 92, 246, 0.2)');
      } else {
        // Idle soft slate
        grad.addColorStop(0, 'rgba(148, 163, 184, 0.1)');
        grad.addColorStop(0.5, 'rgba(148, 163, 184, 0.4)');
        grad.addColorStop(1, 'rgba(148, 163, 184, 0.1)');
      }

      // Draw multi-layered sine harmonics
      const layers = [
        { freq: 0.018, speed: 1.0, amp: primaryAmp, width: 2.5, alpha: 1.0 },
        { freq: 0.028, speed: -1.2, amp: primaryAmp * 0.65, width: 1.5, alpha: 0.6 },
        { freq: 0.038, speed: 1.5, amp: primaryAmp * 0.4, width: 1.0, alpha: 0.4 }
      ];

      layers.forEach((layer) => {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = layer.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = layer.alpha;

        for (let x = 0; x <= width; x += 3) {
          const normalX = (x / width) * Math.PI;
          // Envelope window function so ends taper off to zero
          const envelope = Math.sin(normalX);
          const y =
            midY +
            Math.sin(x * layer.freq + phase * layer.speed) *
              layer.amp *
              envelope +
            Math.sin(x * 0.04 + phase * 0.5) * (layer.amp * 0.2 * envelope);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isActive = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', resize);
      }
    };
  }, [state, prefersReducedMotion]);

  const isSpeaking = state === VOICE_STATES.SPEAKING;
  const isListening = state === VOICE_STATES.LISTENING;
  const isPaused = state === VOICE_STATES.PAUSED;
  const isProcessing = state === VOICE_STATES.PROCESSING;

  const defaultLabel = isListening
    ? 'Listening to your voice...'
    : isSpeaking
    ? 'Speaking audio response...'
    : isPaused
    ? 'Voice playback paused'
    : isProcessing
    ? 'Processing audio query...'
    : 'Voice ready';

  const displayLabel = label || defaultLabel;

  return (
    <div
      role="region"
      aria-label="Voice waveform visualizer"
      className={`relative flex items-center justify-between gap-3 px-3 py-2 rounded-xl backdrop-blur-md transition-all border shadow-sm ${
        isListening
          ? 'bg-cyan-950/20 dark:bg-cyan-950/40 border-cyan-500/30'
          : isSpeaking
          ? 'bg-emerald-950/20 dark:bg-emerald-950/40 border-emerald-500/30'
          : isPaused
          ? 'bg-amber-950/20 dark:bg-amber-950/40 border-amber-500/30'
          : 'bg-stone-100/80 dark:bg-stone-900/80 border-stone-200 dark:border-stone-800'
      } ${className}`}
    >
      {/* Icon Badge */}
      <div className="flex items-center gap-2 shrink-0">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
            isListening
              ? 'bg-cyan-500/20 text-cyan-400 animate-pulse'
              : isSpeaking
              ? 'bg-emerald-500/20 text-emerald-400 animate-pulse'
              : isPaused
              ? 'bg-amber-500/20 text-amber-400'
              : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
          }`}
        >
          {isListening ? (
            <Mic className="w-3.5 h-3.5" />
          ) : isSpeaking ? (
            <Volume2 className="w-3.5 h-3.5" />
          ) : isPaused ? (
            <Pause className="w-3.5 h-3.5" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
        </div>
        <span className="text-[11px] font-medium text-stone-700 dark:text-stone-300 hidden sm:inline-block max-w-[130px] truncate">
          {displayLabel}
        </span>
      </div>

      {/* Procedural Wave Canvas */}
      <div className="flex-1 h-8 relative overflow-hidden flex items-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1 shrink-0">
        {onPauseResume && (isSpeaking || isPaused) && (
          <button
            type="button"
            onClick={onPauseResume}
            aria-label={isPaused ? 'Resume voice output' : 'Pause voice output'}
            title={isPaused ? 'Resume' : 'Pause'}
            className="p-1.5 rounded-lg bg-stone-200/60 dark:bg-stone-800/60 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        )}

        {onStop && (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop audio"
            title="Stop audio playback"
            className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 transition-colors"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        )}
      </div>
    </div>
  );
}

export default React.memo(VoiceVisualizerWaveform);
