// Web Audio API Synthesizer for Camera Shutter and Micro-interactions
// Requires no external audio files and loads instantly with zero latency.

class SoundFX {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.enabled = true;
    this.masterVolume = 0.8; // 0.0 to 1.0 (0% to 100%)
    this.pitchMultiplier = 1.0; // 0.5x to 2.0x
    this.soundMatchingMode = 'dynamic'; // 'dynamic' | 'universal'
    this.baseFrequency = 440;
    this.lastCursorSelectTime = 0;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        const initialGain = this.enabled ? this.masterVolume : 0.0;
        this.masterGain.gain.setValueAtTime(initialGain, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {
        // Handled silently until next user gesture
      });
    }
  }

  // --- Volume & Master Controls ---

  setEnabled(state) {
    this.enabled = Boolean(state);
    if (this.ctx && this.masterGain) {
      const t = this.ctx.currentTime;
      const targetGain = this.enabled ? this.masterVolume : 0.0;
      this.masterGain.gain.cancelScheduledValues(t);
      this.masterGain.gain.setTargetAtTime(targetGain, t, 0.015);
    }
  }

  isEnabled() {
    return this.enabled;
  }

  setMasterVolume(volume) {
    const val = typeof volume === 'number' && !isNaN(volume) ? volume : 0.8;
    this.masterVolume = Math.max(0.0, Math.min(1.0, val));
    if (this.ctx && this.masterGain) {
      const t = this.ctx.currentTime;
      const targetGain = this.enabled ? this.masterVolume : 0.0;
      this.masterGain.gain.cancelScheduledValues(t);
      this.masterGain.gain.setTargetAtTime(targetGain, t, 0.015);
    }
  }

  getMasterVolume() {
    return this.masterVolume;
  }

  setPitchMultiplier(mult) {
    const val = typeof mult === 'number' && !isNaN(mult) ? mult : 1.0;
    this.pitchMultiplier = Math.max(0.5, Math.min(2.0, val));
  }

  getPitchMultiplier() {
    return this.pitchMultiplier;
  }

  setSoundMatchingMode(mode) {
    this.soundMatchingMode = (mode === 'universal') ? 'universal' : 'dynamic';
  }

  getSoundMatchingMode() {
    return this.soundMatchingMode;
  }

  setBaseFrequency(freq) {
    const val = typeof freq === 'number' && !isNaN(freq) ? freq : 440;
    this.baseFrequency = Math.max(20, Math.min(20000, val));
  }

  getBaseFrequency() {
    return this.baseFrequency;
  }

  resetAudioDefaults() {
    this.enabled = true;
    this.masterVolume = 0.8;
    this.pitchMultiplier = 1.0;
    this.soundMatchingMode = 'dynamic';
    this.baseFrequency = 440;
    if (this.ctx && this.masterGain) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(t);
      this.masterGain.gain.setTargetAtTime(0.8, t, 0.015);
    }
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

  // --- 7 Soundboard Synthesizer Effects ---

  // 1. Polaroid Shutter (Camera shutter click, mechanical aperture noise, spring rewind)
  playPolaroidShutter() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    this.triggerHaptic([15, 30, 25]);

    // Click transient
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(2200 * this.pitchMultiplier, t);
    osc1.frequency.exponentialRampToValueAtTime(Math.max(20, 140 * this.pitchMultiplier), t + 0.04);
    gain1.gain.setValueAtTime(0.4, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + 0.05);

    // Aperture curtain friction noise
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(Math.min(20000, 3200 * this.pitchMultiplier), t + 0.02);
    filter.Q.setValueAtTime(2.5, t + 0.02);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, t + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(t + 0.02);

    // Re-arm spring rewind click
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(800 * this.pitchMultiplier, t + 0.09);
    osc2.frequency.exponentialRampToValueAtTime(Math.max(20, 350 * this.pitchMultiplier), t + 0.15);
    gain2.gain.setValueAtTime(0.2, t + 0.09);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    osc2.start(t + 0.09);
    osc2.stop(t + 0.16);
  }

  // 2. Cosmic Sparkle (4-tone celestial ascending arpeggio C6, E6, G6, C7)
  playCosmicSparkle() {
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
      osc.frequency.setValueAtTime(Math.min(20000, Math.max(20, freq * this.pitchMultiplier)), startTime);
      gain.gain.setValueAtTime(0.05, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(startTime);
      osc.stop(startTime + 0.12);
    });
  }

  // 3. Bubble Pop (Ascending pitch ramp 380 -> 960 Hz with micro-transient plop)
  playBubblePop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    this.triggerHaptic([6]);
    const t = this.ctx.currentTime;

    // Body Chirp
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(Math.max(20, 380 * this.pitchMultiplier), t);
    osc.frequency.exponentialRampToValueAtTime(Math.min(20000, Math.max(20, 960 * this.pitchMultiplier)), t + 0.05);
    gain.gain.setValueAtTime(0.09, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.065);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.065);

    // Micro-transient plop
    const transient = this.ctx.createOscillator();
    const transGain = this.ctx.createGain();
    transient.type = 'triangle';
    transient.frequency.setValueAtTime(Math.min(20000, Math.max(20, 1200 * this.pitchMultiplier)), t);
    transient.frequency.exponentialRampToValueAtTime(Math.max(20, 280 * this.pitchMultiplier), t + 0.008);
    transGain.gain.setValueAtTime(0.04, t);
    transGain.gain.exponentialRampToValueAtTime(0.001, t + 0.012);
    transient.connect(transGain);
    transGain.connect(this.masterGain);
    transient.start(t);
    transient.stop(t + 0.012);
  }

  // 4. Laser Focus (Swept chirp 2800 -> 1400 Hz + resonant lock ring)
  playLaserFocus() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    this.triggerHaptic([8]);
    const t = this.ctx.currentTime;

    // Laser downsweep transient
    const sweep = this.ctx.createOscillator();
    const sweepGain = this.ctx.createGain();
    sweep.type = 'triangle';
    sweep.frequency.setValueAtTime(Math.min(20000, Math.max(20, 2800 * this.pitchMultiplier)), t);
    sweep.frequency.exponentialRampToValueAtTime(Math.max(20, 1400 * this.pitchMultiplier), t + 0.025);
    sweepGain.gain.setValueAtTime(0.07, t);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
    sweep.connect(sweepGain);
    sweepGain.connect(this.masterGain);
    sweep.start(t);
    sweep.stop(t + 0.035);

    // Precision lock ring tone
    const lock = this.ctx.createOscillator();
    const lockGain = this.ctx.createGain();
    lock.type = 'sine';
    lock.frequency.setValueAtTime(Math.min(20000, Math.max(20, 1400 * this.pitchMultiplier)), t + 0.015);
    lockGain.gain.setValueAtTime(0.08, t + 0.015);
    lockGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    lock.connect(lockGain);
    lockGain.connect(this.masterGain);
    lock.start(t + 0.015);
    lock.stop(t + 0.07);
  }

  // 5. Crystal Chime (3-partial harmonic bell resonance 880, 1108.7, 1760 Hz)
  playCrystalChime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    this.triggerHaptic([10, 15, 8]);
    const t = this.ctx.currentTime;

    // 3 Harmonic partials with bell decay envelope
    const partials = [
      { freq: 880, type: 'sine', gain: 0.09, start: 0, dur: 0.22 },
      { freq: 1108.7, type: 'triangle', gain: 0.05, start: 0.02, dur: 0.18 },
      { freq: 1760, type: 'sine', gain: 0.04, start: 0.04, dur: 0.15 },
    ];

    partials.forEach(({ freq, type, gain: maxGain, start, dur }) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = t + start;
      osc.type = type;
      osc.frequency.setValueAtTime(Math.min(20000, Math.max(20, freq * this.pitchMultiplier)), startTime);
      gain.gain.setValueAtTime(maxGain, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(startTime);
      osc.stop(startTime + dur);
    });
  }

  // 6. Ribbon Sweep (Dual oscillator modulated frequency sweep)
  playRibbonSweep(direction = 'up') {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    this.triggerHaptic([6]);
    const t = this.ctx.currentTime;
    const isUp = direction === true || direction === 'up';

    // Fundamental Sine glide
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const startFreq = isUp ? 300 * this.pitchMultiplier : 620 * this.pitchMultiplier;
    const endFreq = isUp ? 620 * this.pitchMultiplier : 300 * this.pitchMultiplier;
    osc.frequency.setValueAtTime(Math.min(20000, Math.max(20, startFreq)), t);
    osc.frequency.exponentialRampToValueAtTime(Math.min(20000, Math.max(20, endFreq)), t + 0.09);
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.09);

    // Harmonic Triangle overtone
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(Math.min(20000, Math.max(20, startFreq * 2)), t);
    osc2.frequency.exponentialRampToValueAtTime(Math.min(20000, Math.max(20, endFreq * 2)), t + 0.09);
    gain2.gain.setValueAtTime(0.025, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    osc2.start(t);
    osc2.stop(t + 0.09);
  }

  // 7. Haptic Click (Micro-mechanical tick transient 3200 -> 500 Hz + 160 Hz damping body)
  playHapticClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    this.triggerHaptic([4]);
    const t = this.ctx.currentTime;

    // Snappy transient tick
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(Math.min(20000, Math.max(20, 3200 * this.pitchMultiplier)), t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, 500 * this.pitchMultiplier), t + 0.008);
    gain.gain.setValueAtTime(0.09, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.015);

    // Low mechanical damping body
    const body = this.ctx.createOscillator();
    const bodyGain = this.ctx.createGain();
    body.type = 'sine';
    body.frequency.setValueAtTime(Math.max(20, 160 * this.pitchMultiplier), t);
    bodyGain.gain.setValueAtTime(0.05, t);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.022);
    body.connect(bodyGain);
    bodyGain.connect(this.masterGain);
    body.start(t);
    body.stop(t + 0.022);
  }

  // --- Sound Dispatcher Helper ---
  playSound(soundId) {
    switch (soundId) {
      case 'shutter':
        this.playPolaroidShutter();
        break;
      case 'sparkle':
        this.playCosmicSparkle();
        break;
      case 'pop':
        this.playBubblePop();
        break;
      case 'focus':
        this.playLaserFocus();
        break;
      case 'chime':
        this.playCrystalChime();
        break;
      case 'ribbon':
        this.playRibbonSweep('up');
        break;
      case 'haptic':
        this.playHapticClick();
        break;
      default:
        this.playLaserFocus();
        break;
    }
  }

  // --- Backward-Compatible Aliases ---

  playShutter() {
    this.playPolaroidShutter();
  }

  playSparkle() {
    this.playCosmicSparkle();
  }

  playPop() {
    this.playBubblePop();
  }

  playFocusBeep() {
    this.playLaserFocus();
  }

  playCursorSelect(cursorId) {
    if (!this.enabled) return;
    const now = Date.now();
    if (this.lastCursorSelectTime && now - this.lastCursorSelectTime < 80) return;
    this.lastCursorSelectTime = now;

    if (this.soundMatchingMode === 'universal') {
      this.playCrystalChime();
      return;
    }

    // Dynamic Sound-Matching based on cursor variant ID or family
    const id = typeof cursorId === 'string' ? cursorId.toLowerCase() : '';
    switch (id) {
      case 'camera':
      case 'lens':
      case 'polaroid':
        this.playPolaroidShutter();
        break;
      case 'laser':
      case 'crosshair':
      case 'target':
      case 'sniper':
        this.playLaserFocus();
        break;
      case 'butterfly':
      case 'stardust':
      case 'wand':
      case 'firefly':
      case 'fairy':
        this.playCosmicSparkle();
        break;
      case 'bubble':
      case 'drop':
      case 'balloon':
        this.playBubblePop();
        break;
      case 'airplane':
      case 'comet':
      case 'ribbon':
      case 'swirl':
        this.playRibbonSweep('up');
        break;
      case 'minimal':
      case 'dot':
      case 'terminal':
      case 'code':
      case 'haptic':
      case 'click':
        this.playHapticClick();
        break;
      case 'crystal':
      case 'bell':
      case 'diamond':
      default:
        this.playCrystalChime();
        break;
    }
  }

  playRibbonToggle(isOpen = true) {
    this.playRibbonSweep(isOpen ? 'up' : 'down');
  }

  playChipHover() {
    this.playHapticClick();
  }
}

export const soundFX = new SoundFX();
export default soundFX;

// Soundboard descriptor array for UI rendering
export const SOUNDBOARD_SOUNDS = [
  { id: 'shutter', name: 'Polaroid Shutter', icon: 'Camera', category: 'Mechanical', play: () => soundFX.playPolaroidShutter() },
  { id: 'sparkle', name: 'Cosmic Sparkle', icon: 'Sparkles', category: 'Celestial', play: () => soundFX.playCosmicSparkle() },
  { id: 'pop', name: 'Bubble Pop', icon: 'CircleDot', category: 'Playful', play: () => soundFX.playBubblePop() },
  { id: 'focus', name: 'Laser Focus', icon: 'Crosshair', category: 'Sci-Fi', play: () => soundFX.playLaserFocus() },
  { id: 'chime', name: 'Crystal Chime', icon: 'Bell', category: 'Melodic', play: () => soundFX.playCrystalChime() },
  { id: 'ribbon', name: 'Ribbon Sweep', icon: 'Activity', category: 'Kinetic', play: () => soundFX.playRibbonSweep('up') },
  { id: 'haptic', name: 'Haptic Click', icon: 'Fingerprint', category: 'Tactile', play: () => soundFX.playHapticClick() },
];
