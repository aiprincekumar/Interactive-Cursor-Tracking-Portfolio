// Web Audio API Synthesizer for Camera Shutter and Micro-interactions
// Requires no external audio files and loads instantly with zero latency.

class SoundFX {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.enabled = true;
    this.pitchMultiplier = 1.0;
    this.baseFrequency = 440;
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

  setPitchMultiplier(mult) {
    const val = typeof mult === 'number' && !isNaN(mult) ? mult : 1.0;
    this.pitchMultiplier = Math.max(0.5, Math.min(2.5, val));
  }

  getPitchMultiplier() {
    return this.pitchMultiplier;
  }

  setBaseFrequency(freq) {
    const val = typeof freq === 'number' && !isNaN(freq) ? freq : 440;
    this.baseFrequency = Math.max(20, Math.min(20000, val));
  }

  getBaseFrequency() {
    return this.baseFrequency;
  }

  resetAudioDefaults() {
    this.pitchMultiplier = 1.0;
    this.baseFrequency = 440;
  }

  playTonePreview(frequency = 440, type = 'sine') {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const freqVal = typeof frequency === 'number' && !isNaN(frequency) ? frequency : (this.baseFrequency || 440);
    const targetFreq = Math.max(20, freqVal * this.pitchMultiplier);
    osc.type = type;
    osc.frequency.setValueAtTime(targetFreq, t);

    // Smooth 120ms preview tone with attack and decay envelope
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.12);
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
    osc1.frequency.setValueAtTime(2200 * this.pitchMultiplier, t);
    osc1.frequency.exponentialRampToValueAtTime(Math.max(1, 140 * this.pitchMultiplier), t + 0.04);
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
    filter.frequency.setValueAtTime(3200 * this.pitchMultiplier, t + 0.02);
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
    osc2.frequency.setValueAtTime(800 * this.pitchMultiplier, t + 0.09);
    osc2.frequency.exponentialRampToValueAtTime(Math.max(1, 350 * this.pitchMultiplier), t + 0.15);
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
    osc.frequency.setValueAtTime(1400 * this.pitchMultiplier, t);
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
      osc.frequency.setValueAtTime(freq * this.pitchMultiplier, startTime);
      gain.gain.setValueAtTime(0.05, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(startTime);
      osc.stop(startTime + 0.12);
    });
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    this.triggerHaptic([6]);
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440 * this.pitchMultiplier, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, 880 * this.pitchMultiplier), t + 0.05);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.06);
  }

  playRibbonToggle(isOpen = true) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    this.triggerHaptic([6]);
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    if (isOpen) {
      osc.frequency.setValueAtTime(320 * this.pitchMultiplier, t);
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, 560 * this.pitchMultiplier), t + 0.08);
    } else {
      osc.frequency.setValueAtTime(560 * this.pitchMultiplier, t);
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, 320 * this.pitchMultiplier), t + 0.08);
    }
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  playCursorSelect() {
    if (!this.enabled) return;
    const now = Date.now();
    if (this.lastCursorSelectTime && now - this.lastCursorSelectTime < 80) return;
    this.lastCursorSelectTime = now;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    this.triggerHaptic([12, 20]);
    const t = this.ctx.currentTime;
    // Pleasant two-tone ascending resonant chime
    [587.33, 880].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = t + idx * 0.045;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * this.pitchMultiplier, startTime);
      gain.gain.setValueAtTime(0.09, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.14);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(startTime);
      osc.stop(startTime + 0.14);
    });
  }

  playChipHover() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1760 * this.pitchMultiplier, t);
    gain.gain.setValueAtTime(0.02, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.025);
  }
}

export const soundFX = new SoundFX();
