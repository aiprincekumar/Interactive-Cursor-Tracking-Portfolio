// Web Audio API Synthesizer for Camera Shutter and Micro-interactions
// Requires no external audio files and loads instantly with zero latency.

class SoundFX {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.enabled ? 1.0 : 0.0, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {
        // Handled silently until next user gesture
      });
    }
  }

  setEnabled(state) {
    this.enabled = Boolean(state);
    if (this.ctx && this.masterGain) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(t);
      this.masterGain.gain.setValueAtTime(this.enabled ? 1.0 : 0.0, t);
    }
  }

  triggerHaptic(pattern) {
    if (typeof window !== 'undefined' && 'navigator' in window && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(pattern);
      } catch {
        // Ignore haptics if disabled or unsupported by browser policy
      }
    }
  }

  playShutter() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;

    // Trigger synchronized mechanical tactile feedback
    this.triggerHaptic([15, 30, 25]);

    // 1. Mechanical Shutter Click (High-frequency snappy transient)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(2200, t);
    osc1.frequency.exponentialRampToValueAtTime(140, t + 0.04);
    gain1.gain.setValueAtTime(0.4, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + 0.05);

    // 2. Mechanical Aperture Curtain Snap
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, t + 0.02);
    filter.Q.setValueAtTime(2.5, t + 0.02);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, t + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(t + 0.02);

    // 3. Shutter Re-arm Spring Click (Vintage rewind sound)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(800, t + 0.09);
    osc2.frequency.exponentialRampToValueAtTime(350, t + 0.15);
    gain2.gain.setValueAtTime(0.2, t + 0.09);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    osc2.start(t + 0.09);
    osc2.stop(t + 0.16);
  }

  playFocusBeep() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    this.triggerHaptic([8]);

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, t);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.06);
  }

  playSparkle() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    this.triggerHaptic([5, 20, 10]);

    const t = this.ctx.currentTime;
    [1046, 1318, 1567, 2093].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = t + idx * 0.04;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.05, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(startTime);
      osc.stop(startTime + 0.12);
    });
  }
}

export const soundFX = new SoundFX();
