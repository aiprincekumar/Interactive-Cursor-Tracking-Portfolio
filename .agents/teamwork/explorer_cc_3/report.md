# Technical Investigation Report: Audio Studio, Hero Character Controls & Startup Preferences

**Agent**: Explorer 3 (`explorer_cc_3`)  
**Milestone**: Milestone 1 (Audio Studio & Hero Controls Architecture)  
**Parent Orchestrator**: `fff4e97a-6fb0-42c8-bd4f-a692b9166535`  
**Timestamp**: 2026-10-18T05:25:00Z  
**Status**: COMPLETE (Read-Only Investigation)

---

## 1. Executive Summary

This report establishes the technical architecture, component mechanics, and interface contracts for **Tab 1 (Audio Studio)**, **Tab 3 (Hero & Character Control)**, and **Tab 4 (Startup & Preferences)** of the modernized Portfolio Control Center.

The investigation verified:
1. **Audio Synthesis (`src/utils/audio.js`)**: The existing pure Web Audio API zero-latency synthesizer contains all 7 soundboard acoustic profiles (`playPolaroidShutter`, `playCosmicSparkle`, `playBubblePop`, `playLaserFocus`, `playCrystalChime`, `playRibbonSweep`, `playHapticClick`). It already provides `masterVolume` (0.0-1.0) and `pitchMultiplier` (0.5x-2.0x) scaling on oscillators. To fulfill the spec, it requires the addition of a `soundMatchingMode` toggle (`'dynamic'` vs `'universal'`) and intelligent cursor-to-sound dispatching.
2. **Hero Character Mechanics (`src/components/HeroSection.jsx`)**: The 2.5D character stage uses a 60-120 FPS rAF loop with zero React re-renders, modulating 10 distinct 3D head poses (`00-rear-view.png` through `09-lower-right.png`) via cubic Hermite smoothstep opacities. The existing `forcedState` and internal `userScale` (0.5x to 2.0x on `characterInnerRef`) can be seamlessly exposed to `LabContext.jsx` to power the "Auto Gaze Follow vs Static Fixed" mode, 10 pose override buttons, real-time zoom slider, and Polaroid flash/confetti suppress toggle.
3. **Startup & Preferences (`src/context/RoleContext.jsx`, `LabContext.jsx`, `App.jsx`)**: Role hierarchy and default resolution (`?role=` -> `localStorage` -> `'accountant'`) cleanly support storing a configurable `defaultRole` (`accountant`, `mis`, `other`), default custom cursor state (enabled/disabled fallback to native pointer), default audio state, and reduced-motion accessibility override with a 1-click factory reset.

---

## 2. Audio Studio Architecture & Mechanics (`src/utils/audio.js`)

### 2.1 Current Implementation State
- Located at: `src/utils/audio.js` (466 lines).
- Singleton instance: `export const soundFX = new SoundFX();` and `export default soundFX;`.
- Implemented with the browser's native **Web Audio API** (`window.AudioContext || window.webkitAudioContext`).
- **Zero external asset dependencies**: All tones, clicks, chirps, and noise bursts are synthesized mathematically on the client.
- **Audio Routing Graph**:
  ```
  [Oscillator / BufferSource] -> [Envelope Gain] -> [Master Gain Node] -> [AudioContext Destination]
  ```

### 2.2 Master Sound Controls & Pitch Multiplier
- **Master Sound Toggle**:
  - `soundFX.setEnabled(state)` (lines 35-43): Clamps gain to `masterVolume` when enabled, or soft-mutes to `0.0` over 15ms (`setTargetAtTime(0.0, t, 0.015)`) to eliminate audio clicks/pops.
- **Master Volume Slider**:
  - Range: `0.0` to `1.0` (0% to 100%).
  - `soundFX.setMasterVolume(val)` (lines 49-58): Clamps to `[0.0, 1.0]`, dynamically updates `masterGain.gain.setTargetAtTime(targetGain, t, 0.015)`.
- **Pitch Multiplier Slider**:
  - Range: `0.5x` to `2.0x` (Deep Bass to Sharp Treble).
  - Default: `1.0x`.
  - `soundFX.setPitchMultiplier(mult)` (lines 64-67): Clamps to `[0.5, 2.0]`.
  - Applied to every oscillator frequency in the synthesizer:
    `const targetFreq = Math.max(20, Math.min(20000, baseFreq * this.pitchMultiplier));`
    - At `0.5x`: Low pitch, heavy mechanical resonance / deep bass.
    - At `2.0x`: High pitch, crisp crystalline treble.

### 2.3 The 7 Acoustic Preview Presets
The 7 soundboard presets specified in the requirements are already implemented in `src/utils/audio.js` (lines 129-386) and exported via `SOUNDBOARD_SOUNDS` (lines 457-465):

| # | Sound ID | Name | Synthesizer Architecture | Haptic Vibration Pattern | Primary Target Cursors |
|---|---|---|---|---|---|
| 1 | `shutter` | **Polaroid Shutter** | Triangle click (2200->140 Hz) + bandpass aperture curtain noise (3200 Hz) + spring rewind click (800->350 Hz) | `[15, 30, 25]` | Camera, Lens |
| 2 | `sparkle` | **Cosmic Sparkle** | 4-tone celestial ascending arpeggio: C6 (1046 Hz), E6 (1318 Hz), G6 (1567 Hz), C7 (2093 Hz) | `[5, 20, 10]` | Butterfly, Stardust, Wand, Fairy |
| 3 | `pop` | **Bubble Pop** | Ascending sine body chirp (380->960 Hz) + micro-transient triangle plop (1200->280 Hz) | `[6]` | Bubble, Waterdrop, Jelly, Balloon |
| 4 | `focus` | **Laser Focus** | Downsweep triangle chirp (2800->1400 Hz) + resonant lock ring sine tone (1400 Hz) | `[8]` | Laser, Crosshair, Radar, Target |
| 5 | `chime` | **Crystal Chime** | 3-partial harmonic bell resonance: 880 Hz (sine), 1108.7 Hz (triangle), 1760 Hz (sine) | `[10, 15, 8]` | Crystal, Bell, Diamond, Universal Mode |
| 6 | `ribbon` | **Ribbon Sweep** | Modulated dual-oscillator glide: Fundamental sine (300->620 Hz) + triangle overtone (600->1240 Hz) | `[6]` | Airplane, Comet, Ribbon, Swirl |
| 7 | `haptic` | **Haptic Click** | Snappy transient tick (3200->500 Hz) + low mechanical damping sine body (160 Hz) | `[4]` | Minimal, Dot, Pointer, Terminal |

### 2.4 Sound Matching Mode Specification
**Requirement**: Toggle between **Dynamic cursor-sound matching** vs. **Universal Voice** (consistent subtle chime for all interactions).

#### Current Gap
In `src/utils/audio.js`, `playCursorSelect()` (lines 436-442) currently always calls `this.playCrystalChime()`. There is no mode toggle or cursor-to-sound dispatching.

#### Proposed Architecture
Add to `SoundFX`:
```javascript
class SoundFX {
  constructor() {
    // ...existing properties...
    this.soundMatchingMode = 'dynamic'; // 'dynamic' | 'universal'
  }

  setSoundMatchingMode(mode) {
    this.soundMatchingMode = (mode === 'universal') ? 'universal' : 'dynamic';
  }

  getSoundMatchingMode() {
    return this.soundMatchingMode;
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

    // Dynamic Sound-Matching based on cursor variant ID or category
    switch (cursorId) {
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
}
```

In `App.jsx` and `CursorSelectorRibbon.jsx`:
Pass `cursorId` into `soundFX.playCursorSelect(cursorId)`.

---

## 3. Hero & Character Control Architecture (`src/components/HeroSection.jsx`)

### 3.1 3D Head Poses Inventory & Mapping
The character in `HeroSection.jsx` uses 10 pre-rendered photorealistic 3D head poses located in `public/assets/hero_poses/`:

| Index | File Name | Asset Constant | Pose Identifier | Physical Description |
|---|---|---|---|---|
| 0 | `00-rear-view.png` | `IMG_REAR` | `'idle'` / `'rear-view'` | Rear-view / Resting idle back view |
| 1 | `01-center-up.png` | `IMG_CENTER_UP` | `'upper-center'` / `'center-up'` | Looking directly upward |
| 2 | `02-lower-center.png` | `IMG_LOWER_CENTER` | `'lower-center'` | Looking down towards center/feet |
| 3 | `03-center-left.png` | `IMG_CENTER_LEFT` | `'left'` / `'center-left'` | Turning head horizontally left |
| 4 | `04-center-right.png` | `IMG_CENTER_RIGHT` | `'right'` / `'center-right'` | Turning head horizontally right |
| 5 | `05-center-front.png` | `IMG_CENTER_FRONT` | `'center'` / `'center-front'` | Signature front portrait looking into camera |
| 6 | `06-upper-left.png` | `IMG_UPPER_LEFT` | `'upper-left'` | Looking upward to the top-left corner |
| 7 | `07-lower-left.png` | `IMG_LOWER_LEFT` | `'lower-left'` | Looking downward to the bottom-left corner |
| 8 | `08-upper-right.png` | `IMG_UPPER_RIGHT` | `'upper-right'` | Looking upward to the top-right corner |
| 9 | `09-lower-right.png` | `IMG_LOWER_RIGHT` | `'lower-right'` | Looking downward to the bottom-right corner |

### 3.2 Real-Time Gaze Tracking Engine
Located in `HeroSection.jsx` lines 151-365:
- **rAF Loop**: Frame-rate independent loop with delta time (`dt = Math.min(Math.max((currentTime - lastTime) / 1000, 0.001), 0.05)`).
- **Exponential Damping Factor**: `lerpFactor = 1.0 - Math.exp(-15.0 * dt)`.
- **Coordinates Normalization**: `targetNormX` and `targetNormY` clamped in `[-0.5, 0.5]`.
- **Kinematic Shifts**:
  - Stage translation: `charShiftX = curX * 56`, `charShiftY = curY * 42`.
  - Organic breathing cycle: 3.8s period, `Math.sin(breathCycle) * 3.2px`.
  - Backdrop parallax: `bgShiftX = -curX * 32`, `bgShiftY = -curY * 24`.
- **Continuous 9-Direction Pose Blending (Cubic Hermite Smoothstep)**:
  - 3 column zones (`colLeft`, `colCenter`, `colRight`).
  - 3 row zones (`rowUp`, `rowMid`, `rowDown`).
  - Direct style opacity updates to `imgIdleRef.current`, `imgCenterRef.current`, etc., bypassing React virtual DOM diffing.

### 3.3 Character Gaze Tracking Mode (Auto vs Static Fixed)
**Requirement**: Character gaze tracking mode: Auto Gaze Follow vs Static Fixed (when Fixed, lock to center or pose override).

#### Mechanism
1. Introduce `heroGazeMode`: `'auto'` | `'fixed'` in `LabContext.jsx` (default `'auto'`).
2. Introduce `heroPoseOverride`: `string | null` in `LabContext.jsx` (default `null`).
3. In `HeroSection.jsx`:
   - Consume `heroGazeMode` and `heroPoseOverride` from `useLab()` (or props).
   - Compute `effectiveForcedState`:
     ```javascript
     const effectiveForcedState = (heroGazeMode === 'fixed')
       ? (heroPoseOverride || 'center')
       : heroPoseOverride; // if auto, only force if explicit preview button is pressed
     ```
   - In rAF loop:
     When `heroGazeMode === 'fixed'`:
     - `state.targetNormX = 0; state.targetNormY = 0;`
     - Stage shift `charShiftX = 0; charShiftY = 0;`
     - Opacities locked: `centerOp = 1` (or the selected pose op = 1), all other opacities = 0.
     - Pointer movements do not deflect the character.
     When `heroGazeMode === 'auto'`:
     - Normal dynamic pointer/gyro tracking runs.

### 3.4 10 3D Head Pose Override Selector Buttons
**Requirement**: 10 3D head pose override selector buttons (instant preview/locking of pose 0 to 9).
In the Control Center (both in-page and drawer):
Render a compact grid/flex row of 10 pose buttons (plus an "Auto" button):
```javascript
const HERO_POSES = [
  { index: 0, label: '00 Rear', key: 'idle', desc: 'Rear view' },
  { index: 1, label: '01 Up', key: 'upper-center', desc: 'Center up' },
  { index: 2, label: '02 Down', key: 'lower-center', desc: 'Lower center' },
  { index: 3, label: '03 Left', key: 'left', desc: 'Center left' },
  { index: 4, label: '04 Right', key: 'right', desc: 'Center right' },
  { index: 5, label: '05 Center', key: 'center', desc: 'Signature front' },
  { index: 6, label: '06 Up-Left', key: 'upper-left', desc: 'Upper left' },
  { index: 7, label: '07 Down-Left', key: 'lower-left', desc: 'Lower left' },
  { index: 8, label: '08 Up-Right', key: 'upper-right', desc: 'Upper right' },
  { index: 9, label: '09 Down-Right', key: 'lower-right', desc: 'Lower right' },
];
```
- Clicking a button sets `heroPoseOverride = item.key` (or toggles back to `null` if clicked again).
- Triggers acoustic feedback: `soundFX.playLaserFocus()`.

### 3.5 Character Zoom / Scale Slider (0.5x to 2.0x)
**Requirement**: Character zoom/scale slider (0.5x to 2.0x) applied to character visual container.

#### Current Code Analysis
In `HeroSection.jsx`:
- Line 23: `const BASELINE_SCALE = 0.95;`
- Line 68: `const [userScale, setUserScale] = useState(1.0);`
- Line 87: `const effectiveScale = BASELINE_SCALE * userScale;`
- Line 690-694:
  ```jsx
  <div
    ref={characterInnerRef}
    className="relative h-[74vh] sm:h-[82vh] md:h-full aspect-[16/9] w-auto max-w-none flex items-center justify-center filter contrast-[1.04] brightness-[1.02] origin-[50%_90%] will-change-transform"
    style={{
      transform: `scale(${effectiveScale})`,
      transformOrigin: '50% 90%',
      transition: (isTransitioning && !reducedMotion) ? 'transform 350ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
    }}
  >
  ```
- Also, in the bottom right corner of HeroSection (lines 1108-1122), there is a local slider.

#### Integration Architecture
- Centralize `characterScale` in `LabContext.jsx` with default `1.0`, range `0.5` to `2.0`, step `0.05`.
- In `HeroSection.jsx`, replace local `userScale` with `characterScale` from `useLab()`.
- Two-way binding:
  - Adjusting the slider in the Control Center Tab 3 immediately updates `characterScale` and triggers `characterInnerRef` CSS transform scale.
  - Using the HeroSection bottom-right Zoom HUD (or Ctrl+wheel / pinch gestures) also updates `characterScale` in `LabContext.jsx`.

### 3.6 Polaroid Flash & Confetti Suppression Toggle
**Requirement**: Polaroid camera flash and confetti toggle (On/Off) in HeroSection.

#### Current Code Analysis
In `HeroSection.jsx` lines 567-580:
```javascript
  const triggerCapture = useCallback(() => {
    if (isPinchingRef.current) return;
    soundFX.playShutter();

    if (!reducedMotion) {
      setIsFlashing(true);
      confetti({
        particleCount: 32,
        spread: 65,
        origin: { y: 0.55 },
        colors: ['#FF3F6C', '#FFA4B6', '#FFF0F3', '#FFD1DC', '#FFE4E8']
      });
    }
    // ...
```
And flash overlay (lines 661-666):
```jsx
  <div
    className={`fixed inset-0 bg-white z-50 pointer-events-none transition-opacity duration-200 ${
      isFlashing ? 'opacity-95' : 'opacity-0'
    }`}
  />
```

#### Integration Architecture
- Add `cameraEffectsEnabled: boolean` in `LabContext.jsx` (default `true`).
- In `HeroSection.jsx`:
  ```javascript
  const { cameraEffectsEnabled = true } = useLab();

  // In triggerCapture:
  if (!reducedMotion && cameraEffectsEnabled) {
    setIsFlashing(true);
    confetti({
      particleCount: 32,
      spread: 65,
      origin: { y: 0.55 },
      colors: ['#FF3F6C', '#FFA4B6', '#FFF0F3', '#FFD1DC', '#FFE4E8']
    });
  }
  ```
- When toggled Off: The Polaroid photograph is still captured and added to the gallery, shutter sound is played, but no white screen blinding flash and zero confetti bursts occur.

---

## 4. Startup & Preferences Wiring (`RoleContext.jsx`, `LabContext.jsx`, `App.jsx`)

### 4.1 Default Startup Role Track Selection
**Requirement**: Default startup role track selection (Accountant / MIS Executive / Controller).

#### Current Role Architecture (`src/context/RoleContext.jsx`)
- Canonical role keys:
  - `'accountant'`: Accountant & Tax (Financial Track)
  - `'mis'`: MIS & Analytics (Data & Operations Track)
  - `'other'`: Business Intelligence & Corporate Controller (`Other ✨ AI`)
  - `'overview'`: Executive Summary
- Current startup resolution order in `RoleProvider` (lines 98-120):
  1. URL query param `?role=...` (if present and valid, highest precedence).
  2. `localStorage.getItem('portfolio_selected_role')`.
  3. Hardcoded `DEFAULT_ROLE = 'accountant'`.

#### Control Center Architecture
- Add `defaultStartupRole`: `'accountant'` | `'mis'` | `'other'` in `LabContext.jsx` (default `'accountant'`).
- In Tab 4 (Startup & Preferences), provide a 3-button selector:
  1. `Accountant` (Badge: Financial Track, Accent: `#FF4D6D`)
  2. `MIS Executive` (Badge: Data & Operations, Accent: `#3B82F6`)
  3. `Controller` (Badge: BI & Corporate Control, Accent: `#8B5CF6`)
- When user clicks a role in Tab 4:
  1. Saves `defaultStartupRole` into `portfolio_control_center` localStorage.
  2. Immediately switches the active role via `window.dispatchEvent(new CustomEvent('switch-role-tab', { detail: { role: selectedRole } }))` or `selectRole(selectedRole)`.
  3. Updates `localStorage.setItem('portfolio_selected_role', selectedRole)`.

### 4.2 Default Cursor State on Startup
**Requirement**: Default cursor state on startup (Enabled/Disabled).

#### Integration Architecture
- Add `customCursorEnabled`: `boolean` in `LabContext.jsx` (default `true`).
- When `customCursorEnabled === false`:
  - `DynamicCursorManager.jsx` returns `null`.
  - Browser restores native mouse cursor across entire viewport (`document.body.classList.remove('cursor-none')`).
- When `customCursorEnabled === true`:
  - `DynamicCursorManager.jsx` renders selected cursor and hides native pointer over active sections.
- Persisted under `portfolio_control_center` so returning visitors immediately get their preferred pointer experience.

### 4.3 Default Audio State on Startup
**Requirement**: Default audio state on startup (Enabled/Disabled).

#### Integration Architecture
- `soundEnabled`: `boolean` in `LabContext.jsx` (default `true`).
- Persisted under `portfolio_control_center`.
- On startup, if `soundEnabled === false`, `soundFX.setEnabled(false)` is invoked immediately during mount.
- Both Tab 1 (Audio Studio master toggle) and Tab 4 (Startup default audio) control and reflect this synchronized state.

### 4.4 Reduced Motion Accessibility Toggle
**Requirement**: Reduced motion accessibility toggle.

#### Current State
In `App.jsx` lines 25-30:
```javascript
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
```
It only listens to OS-level `prefers-reduced-motion`. The user cannot manually toggle it in the portfolio UI.

#### Integration Architecture
- Lift `reducedMotion` into `LabContext.jsx`:
  - Initial value: `loadSavedConfig().reducedMotion ?? (system prefers-reduced-motion)`.
  - Provide `setReducedMotion(boolean)` in `LabContext`.
- When `reducedMotion === true`:
  - `DynamicCursorManager` renders `null`.
  - `HeroSection` disables rAF 2.5D tracking and disables camera flash / confetti.
  - CSS animations across cards, ribbons, and banners respect `prefers-reduced-motion`.
- Tab 4 provides an accessible toggle switch with an accessibility badge.

### 4.5 1-Click "Reset to Factory Defaults"
**Requirement**: 1-Click "Reset to Factory Defaults" button.

#### Exact Reset Specifications
Invoking `resetToDefaults()` in `LabContext.jsx` atomically resets all 4 tabs:
```javascript
const FACTORY_DEFAULTS = {
  // Tab 1: Audio Studio
  soundEnabled: true,
  masterVolume: 0.8,
  audioPitch: 1.0,
  soundMatchingMode: 'dynamic',

  // Tab 2: Cursor & Dynamics
  customCursorEnabled: true,
  cursorScale: 1.0,
  flightSpeed: 0.14,
  wingDynamics: 1.0,
  trailEnabled: true,
  particleColor: '#FF4D6D',

  // Tab 3: Hero & Character Control
  heroGazeMode: 'auto',
  heroPoseOverride: null,
  characterScale: 1.0,
  cameraEffectsEnabled: true,

  // Tab 4: Startup & Preferences
  defaultStartupRole: 'accountant',
  reducedMotion: false,
};
```
- Audio feedback: Plays `soundFX.playPop()` or `soundFX.playCrystalChime()`.
- Storage: Overwrites `localStorage.setItem('portfolio_control_center', JSON.stringify(FACTORY_DEFAULTS))`.
- Dispatches window event `portfolio:control-center-reset`.

---

## 5. Concrete Interface Contracts

### 5.1 `portfolio_control_center` LocalStorage Schema
```json
{
  "version": 2,
  "soundEnabled": true,
  "masterVolume": 0.8,
  "audioPitch": 1.0,
  "soundMatchingMode": "dynamic",
  "customCursorEnabled": true,
  "cursorScale": 1.0,
  "flightSpeed": 0.14,
  "wingDynamics": 1.0,
  "trailEnabled": true,
  "particleColor": "#FF4D6D",
  "heroGazeMode": "auto",
  "heroPoseOverride": null,
  "characterScale": 1.0,
  "cameraEffectsEnabled": true,
  "defaultStartupRole": "accountant",
  "reducedMotion": false,
  "updatedAt": "2026-10-18T05:25:00.000Z"
}
```

### 5.2 `LabContext` Value Contract
```typescript
interface LabContextValue {
  // Tab 1: Audio Studio
  soundEnabled: boolean;
  masterVolume: number; // 0.0 - 1.0
  audioPitch: number;   // 0.5 - 2.0
  soundMatchingMode: 'dynamic' | 'universal';
  setSoundEnabled: (val: boolean) => void;
  setMasterVolume: (val: number) => void;
  setAudioPitch: (val: number) => void;
  setSoundMatchingMode: (mode: 'dynamic' | 'universal') => void;

  // Tab 2: Cursor & Dynamics
  customCursorEnabled: boolean;
  cursorScale: number; // 0.5 - 2.0
  flightSpeed: number; // 0.07 (Dreamy) | 0.14 (Natural) | 0.28 (Snappy)
  wingDynamics: number;
  trailEnabled: boolean;
  particleColor: string;
  setCustomCursorEnabled: (val: boolean) => void;
  setCursorScale: (val: number) => void;
  setFlightSpeed: (val: number) => void;
  setWingDynamics: (val: number) => void;
  setTrailEnabled: (val: boolean) => void;
  setParticleColor: (val: string) => void;

  // Tab 3: Hero & Character Control
  heroGazeMode: 'auto' | 'fixed';
  heroPoseOverride: string | null;
  characterScale: number; // 0.5 - 2.0
  cameraEffectsEnabled: boolean;
  setHeroGazeMode: (mode: 'auto' | 'fixed') => void;
  setHeroPoseOverride: (pose: string | null) => void;
  setCharacterScale: (scale: number) => void;
  setCameraEffectsEnabled: (val: boolean) => void;

  // Tab 4: Startup & Preferences
  defaultStartupRole: 'accountant' | 'mis' | 'other';
  reducedMotion: boolean;
  setDefaultStartupRole: (role: 'accountant' | 'mis' | 'other') => void;
  setReducedMotion: (val: boolean) => void;

  // Drawer & Meta Actions
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  resetToDefaults: () => void;
}
```

### 5.3 `SoundFX` API Interface Contract
```typescript
interface SoundFXInterface {
  init(): void;
  setEnabled(state: boolean): void;
  isEnabled(): boolean;
  setMasterVolume(volume: number): void;
  getMasterVolume(): number;
  setPitchMultiplier(mult: number): void;
  getPitchMultiplier(): number;
  setSoundMatchingMode(mode: 'dynamic' | 'universal'): void;
  getSoundMatchingMode(): 'dynamic' | 'universal';
  resetAudioDefaults(): void;

  // 7 Soundboard Synthesizers
  playPolaroidShutter(): void;
  playCosmicSparkle(): void;
  playBubblePop(): void;
  playLaserFocus(): void;
  playCrystalChime(): void;
  playRibbonSweep(direction?: 'up' | 'down'): void;
  playHapticClick(): void;

  // Dispatcher & Micro-interactions
  playCursorSelect(cursorId?: string): void;
  playFocusBeep(): void;
  playRibbonToggle(isOpen?: boolean): void;
  playChipHover(): void;
}
```

### 5.4 `HeroSection.jsx` Consumer Contract
`HeroSection` will consume from `useLab()`:
- `heroGazeMode`: If `'fixed'`, stops tracking pointer/gyro and locks character to center or `heroPoseOverride`.
- `heroPoseOverride`: If string, forces the corresponding pose opacity to 1.0.
- `characterScale`: Directly sets `transform: scale(BASELINE_SCALE * characterScale)`.
- `cameraEffectsEnabled`: If false, bypasses `setIsFlashing(true)` and `confetti({...})`.

---

## 6. Implementation Action Plan for Milestone 2

1. **Step 1: Enhance `src/utils/audio.js`**:
   - Add `this.soundMatchingMode = 'dynamic'`.
   - Add `setSoundMatchingMode(mode)` and `getSoundMatchingMode()`.
   - Update `playCursorSelect(cursorId)` to dispatch to the corresponding synthesized sound or universal chime.
2. **Step 2: Update `src/context/LabContext.jsx`**:
   - Change storage key from `portfolio_lab_config` to unified `portfolio_control_center`.
   - Include automatic migration from `portfolio_lab_config` and legacy keys.
   - Add state and setters for all new parameters (`soundMatchingMode`, `customCursorEnabled`, `heroGazeMode`, `heroPoseOverride`, `characterScale`, `cameraEffectsEnabled`, `defaultStartupRole`, `reducedMotion`).
   - Sync all audio parameters live to `soundFX`.
3. **Step 3: Update `src/components/HeroSection.jsx`**:
   - Replace local `userScale` with `characterScale` from `useLab()`.
   - Support `heroGazeMode` ('auto' vs 'fixed') and `heroPoseOverride`.
   - Guard flash and confetti with `cameraEffectsEnabled`.
4. **Step 4: Update `src/components/DynamicCursorManager.jsx`**:
   - Add check for `customCursorEnabled`. When false, return `null` immediately.
5. **Step 5: Replace `InteractivePlayground.jsx` and Update `LabStudioDrawer.jsx`**:
   - Completely eliminate `PhysicsSandbox.jsx` import, canvas, orbs, speedometer, and particle burst.
   - Implement the identical theme-matched (Obsidian Dark / Linen Light) 4-Tab Control Center:
     - Tab 1: Audio Studio
     - Tab 2: Cursor & Dynamics
     - Tab 3: Hero & Character Control
     - Tab 4: Startup & Preferences
6. **Step 6: Build & Lint Verification**:
   - Verify zero errors with `npm run lint` (`oxlint`).
   - Verify clean production build with `npm run build`.

---

## 7. Conclusion

All mechanics and integration contracts for Tab 1 (Audio Studio), Tab 3 (Hero & Character Control), and Tab 4 (Startup & Preferences) are completely documented and verified against the live codebase. The proposed design preserves 100% backward compatibility, eliminates unnecessary re-renders, adheres to Obsidian Dark / Linen Light design aesthetics, and guarantees robust `localStorage` persistence.
