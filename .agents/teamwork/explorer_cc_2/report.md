# Milestone 1: Technical Investigation & Architecture Report
## Control Center State Management & Cursor Dynamics Architecture

- **Author**: Explorer 2 (`explorer_cc_2`)
- **Date**: 2026-10-18
- **Workspace**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio`
- **Scope**: LabContext Refactoring, Unified Control Center Schema (`portfolio_control_center`), Cursor Dynamics & Fallback Engineering

---

## 1. Executive Summary

This investigation analyzes the transition of the legacy "Lab" experimentation studio into a professional, theme-matched **Portfolio Control Center** with a structured 4-tab settings layout (Audio Studio, Cursor & Dynamics, Hero & Character Control, Startup & Preferences).

Key Findings & Architectural Decisions:
1. **State Centralization**: The current `LabContext.jsx` relies on legacy toy physics states (`gravity`, `isZeroG`, gaming presets `cyberpunk`, `arcade`, `zen`, `hyper`) stored under `portfolio_lab_config`. We specify the new atomic storage schema under key `portfolio_control_center` with a structured 4-namespace schema, automatic backward-compatible migration from legacy configurations, and an instantaneous "Reset to Factory Defaults" action.
2. **Cursor Fallback Engineering**: When "Custom Cursor" is disabled, `DynamicCursorManager` returns `null`, cleanly unmounting `ButterflyCursor` / `ModularKinematicCursor`, cancelling active `requestAnimationFrame` loops, and cleaning up window event listeners. In conjunction, any `cursor-none` classes on `#hero` must be suppressed and `cursor: auto !important` guaranteed, providing an instantaneous, flicker-free return to the native OS cursor.
3. **Kinematic Precision**: The 3 lerp flight speeds (`dreamy`, `natural`, `snappy`) map directly to exponential decay lambdas ($\lambda = 6.0, 10.5, 18.0$) for frame-rate independent physics across 60Hz, 120Hz, and 240Hz displays.
4. **Hero & Audio Consumers**: The Hero section already possesses pose-override handling (`forcedState`) and character scale (`userScale`), requiring only direct reactive wiring to `gazeMode`, `poseOverride`, `characterZoom`, and `flashConfettiEnabled`. The Web Audio API synthesizer (`soundFX`) requires the addition of `soundMatchingMode` ('dynamic' vs 'universal') to toggle between cursor-tailored audio signatures and a unified subtle chime.

---

## 2. Deep Dive: Current `LabContext.jsx` Analysis

### 2.1 File Location & Imports
- **File**: `src/context/LabContext.jsx` (649 lines)
- **Imports**: `React`, `createContext`, `useContext`, `useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`, and `soundFX` from `../utils/audio`.

### 2.2 Storage Keys & Migration
- **Current Key**: `portfolio_lab_config` (exported as `LAB_STORAGE_KEY`).
- **Legacy Fallbacks Checked**: `physics_particle_color`, `physics_gravity`, `physics_audio_pitch`, `soundEnabled`, `portfolio_sound_enabled`.
- **Flaws in Current Implementation**:
  - Contains toy physics attributes (`gravity`, `wingDynamics`, `activePreset` with values `cyberpunk`, `arcade`, `zen`, `hyper`) that are slated for complete removal.
  - Does not store hero controls (`gazeMode`, `poseOverride`, `characterZoom`, `flashConfettiEnabled`).
  - Does not store startup preference controls (`defaultRole`, `defaultCursorEnabled`, `defaultAudioEnabled`, `reducedMotion`).
  - Lacks structured namespaces; properties are flat and unorganized.

### 2.3 Current State & Action Map
| Current Property | Type | Range / Options | Target in Control Center |
|---|---|---|---|
| `cursorScale` | Number | 0.5 - 2.0 | Retained in `cursor.cursorScale` |
| `flightSpeed` | Number | 0.05 - 0.35 | Retained & mapped to `cursor.flightLerpSpeed` |
| `wingDynamics` | Number | 0.5 - 2.0 | Retained as sub-parameter of cursor flight |
| `gravity` | Number | -60 to +140 | **Removed** (toy physics deleted) |
| `trailEnabled` | Boolean | true / false | Retained in `cursor.stardustTrailEnabled` |
| `particleColor` | String | Hex color | Retained in `cursor.particleColor` |
| `soundEnabled` | Boolean | true / false | Retained in `audio.soundEnabled` |
| `masterVolume` | Number | 0.0 - 1.0 | Retained in `audio.masterVolume` (0 - 100%) |
| `audioPitch` | Number | 0.5 - 2.0 | Retained in `audio.pitchMultiplier` |
| `activePreset` | String | 'default', 'cyberpunk', etc. | **Removed** (arcade presets removed) |
| `isDrawerOpen` | Boolean | true / false | Retained in runtime UI state |

### 2.4 Drawer Controls & Event System
`LabContext` provides:
- `openDrawer()`: sets `isDrawerOpen = true`, plays `soundFX.playRibbonToggle(true)`.
- `closeDrawer()`: sets `isDrawerOpen = false`, plays `soundFX.playRibbonToggle(false)`.
- `toggleDrawer()`: toggles `isDrawerOpen`.
- Window event listeners:
  - `portfolio:open-lab-drawer` / `open-lab-drawer`
  - `portfolio:close-lab-drawer` / `close-lab-drawer`
  - `portfolio:toggle-lab-drawer` / `toggle-lab-drawer`
- Outbound event: `portfolio:lab-change` dispatched on update.
- Storage sync: `window.addEventListener('storage', handleStorage)` for multi-tab synchronization.

---

## 3. New Unified Control Center State Schema (`portfolio_control_center`)

### 3.1 Primary Schema Architecture
The new state is organized into 4 semantic tabs, with versioning and timestamp metadata:

```typescript
export interface ControlCenterConfig {
  version: 2;
  updatedAt: string; // ISO 8601 string
  audio: {
    soundEnabled: boolean;       // Master sound toggle (On/Off)
    masterVolume: number;        // Master volume slider: 0 - 100 (%)
    pitchMultiplier: number;     // Pitch multiplier: 0.5 - 2.0 (x)
    soundMatchingMode: 'dynamic' | 'universal'; // Tone matching mode
  };
  cursor: {
    customCursorEnabled: boolean; // Custom interactive cursor toggle
    cursorScale: number;          // Cursor scale multiplier: 0.5 - 2.0 (x)
    flightLerpSpeed: 'dreamy' | 'natural' | 'snappy'; // Flight response
    stardustTrailEnabled: boolean;// Particle trail toggle
    particleColor: string;        // Hex string, e.g. '#FF4D6D'
  };
  hero: {
    gazeMode: 'auto' | 'fixed';  // 2.5D head/gaze tracking mode
    poseOverride: number | null;  // null = dynamic; 0-9 = fixed pose index
    characterZoom: number;        // Character zoom scale: 0.5 - 2.0 (x)
    flashConfettiEnabled: boolean;// Polaroid flash & celebratory confetti toggle
  };
  preferences: {
    defaultRole: 'accountant' | 'mis' | 'controller'; // Startup career track
    defaultCursorEnabled: boolean;// Startup default cursor state
    defaultAudioEnabled: boolean; // Startup default audio state
    reducedMotion: boolean;       // Accessibility reduced motion override
  };
}
```

### 3.2 Factory Defaults Object
```javascript
export const CONTROL_CENTER_STORAGE_KEY = 'portfolio_control_center';

export const FACTORY_DEFAULTS = {
  version: 2,
  audio: {
    soundEnabled: true,
    masterVolume: 80, // 80% default
    pitchMultiplier: 1.0, // 1.0x baseline pitch
    soundMatchingMode: 'dynamic' // Dynamic cursor-sound matching
  },
  cursor: {
    customCursorEnabled: true,
    cursorScale: 1.0, // 1.0x baseline
    flightLerpSpeed: 'natural', // Natural organic response
    stardustTrailEnabled: true,
    particleColor: '#FF4D6D' // Coral signature
  },
  hero: {
    gazeMode: 'auto', // Auto cursor tracking
    poseOverride: null, // No forced pose
    characterZoom: 1.0, // 1.0x standard zoom
    flashConfettiEnabled: true // Confetti active
  },
  preferences: {
    defaultRole: 'accountant', // Accountant is canonical default
    defaultCursorEnabled: true,
    defaultAudioEnabled: true,
    reducedMotion: false
  }
};
```

### 3.3 Seamless Legacy Migration Strategy
When reading `localStorage`, `loadSavedConfig()` executes a 3-tier cascade:
1. **Tier 1 (New Key)**: Look for `localStorage.getItem('portfolio_control_center')`. If found and valid JSON, deep-merge with `FACTORY_DEFAULTS` to ensure any missing fields receive factory values.
2. **Tier 2 (Legacy Migration)**: If not found, look for `localStorage.getItem('portfolio_lab_config')`.
   - Map `cursorScale` -> `cursor.cursorScale`
   - Map `flightSpeed` (numeric) -> `cursor.flightLerpSpeed`:
     - `< 0.11` => `'dreamy'`
     - `> 0.19` => `'snappy'`
     - else => `'natural'`
   - Map `trailEnabled` -> `cursor.stardustTrailEnabled`
   - Map `particleColor` -> `cursor.particleColor`
   - Map `soundEnabled` -> `audio.soundEnabled`
   - Map `masterVolume` (0.0-1.0) -> `audio.masterVolume` (0-100)
   - Map `audioPitch` -> `audio.pitchMultiplier`
3. **Tier 3 (Factory Fallback)**: Return deep copy of `FACTORY_DEFAULTS`.

---

## 4. Cursor System Dynamics & Fallback Engineering

### 4.1 "Custom Cursor" Off: System Pointer Fallback Architecture
Current behavior:
- `ButterflyCursor.jsx` and `ModularKinematicCursor.jsx` render fixed overlays with `pointer-events: none`.
- `HeroSection.jsx` (line 657) applies `cursor-none` when `isInsideHero && !reducedMotion`.

Deficiencies addressed in the new design:
1. When `customCursorEnabled = false`:
   - `DynamicCursorManager.jsx` must return `null`. This unmounts the cursor component, immediately executing the cleanup phase of `useEffect`:
     - `cancelAnimationFrame(animationFrameId)` terminates the 120 FPS kinematic loop.
     - Canvas overlay is removed from the DOM.
     - `pointermove`, `touchmove`, `pointerdown`, `mouseleave`, `resize` event listeners are detached.
2. Native Cursor Restoration:
   - In `HeroSection.jsx`:
     ```javascript
     // Update hero cursor-none condition:
     const shouldHideCursor = isInsideHero && !reducedMotion && customCursorEnabled;
     className={`... ${shouldHideCursor ? 'cursor-none' : 'cursor-pointer'}`}
     ```
   - Global HTML/Body Enforcement:
     When `customCursorEnabled` is `false`, add a CSS utility class or set `document.documentElement.classList.toggle('custom-cursor-disabled', !customCursorEnabled)`.
     In CSS:
     ```css
     .custom-cursor-disabled,
     .custom-cursor-disabled * {
       cursor: auto !important;
     }
     .custom-cursor-disabled a,
     .custom-cursor-disabled button,
     .custom-cursor-disabled [role="button"] {
       cursor: pointer !important;
     }
     ```
   - This guarantees that turning off the custom cursor immediately returns the OS system cursor without phantom invisible pointer states anywhere on the page.

### 4.2 Global Cursor Scale Multiplier (0.5x to 2.0x)
- **Butterfly Cursor**:
  - The DOM stage is sized `38px x 38px`.
  - In `ButterflyCursor.jsx` (line 288):
    ```javascript
    b.style.transform = `translate3d(${posX}px, ${posY}px, 0) rotate(${rotZ}deg) rotateY(${rollY}deg) scale(${scaleRef.current || 1})`;
    ```
  - Scaling is GPU-composited in 3D perspective without reflows or rasterization degradation.
- **Modular Kinematic Cursors (35 styles)**:
  - In `ModularKinematicCursor.jsx` (line 268):
    ```javascript
    avatarRef.current.style.transform = `translate3d(${posX}px, ${posY}px, 0) rotate(${rotZ}deg) scale(${scaleRef.current || 1})`;
    ```
  - Also strictly scales the active cursor icon cleanly.

### 4.3 Flight Lerp Speed ('dreamy' | 'natural' | 'snappy')
The cursor kinematics engine implements frame-rate independent exponential smoothing:
$$x_{t} = x_{t-1} + (x_{\text{target}} - x_{t-1}) \cdot (1 - e^{-\lambda \cdot \Delta t})$$

We define exact mappings between the user-facing preset and physical constants:
| Preset Key | UI Label | Physics Lambda ($\lambda$) | Numeric Speed Equiv. | Kinematic Feel |
|---|---|---|---|---|
| `'dreamy'` | Dreamy Float | `6.0` | `0.08` | Smooth, high inertia, ethereal drift |
| `'natural'` | Natural Flight | `10.5` | `0.14` | Organic butterfly fluttering, balanced |
| `'snappy'` | Snappy Agility | `18.0` | `0.24` | High responsiveness, minimal drag, instant snap |

Mathematical translation function in `LabContext`:
```javascript
export const FLIGHT_SPEED_MAP = {
  dreamy: 0.08,
  natural: 0.14,
  snappy: 0.24
};

export function getFlightSpeedValue(speedKeyOrNum) {
  if (typeof speedKeyOrNum === 'number') return clamp(speedKeyOrNum, 0.05, 0.35, 0.14);
  return FLIGHT_SPEED_MAP[speedKeyOrNum] || 0.14;
}
```

### 4.4 Stardust Trail & Color Swatch System
- **Stardust Trail Toggle (`stardustTrailEnabled`)**:
  - In both `ButterflyCursor.jsx` and `ModularKinematicCursor.jsx`, `trailEnabled` controls whether the additive `<canvas>` is mounted and whether particle generation runs on pointermove and pointerdown.
  - When set to `false`, zero particles are created, freeing 100% of canvas draw calls for low-power devices.
- **Color Swatches & Palette Generation**:
  - The engine uses `getTintedPalette(baseColor)`:
    - Derives 4 harmonious tints: Primary Radiant (`r, g, b`), Pastel Glow (`r*0.75+64`), Cosmic Warm Shimmer (`r*0.9+25`), and Diamond White (`255, 255, 255`).
  - Swatch Presets:
    1. **Coral Rose**: `#FF4D6D` (Portfolio Accent)
    2. **Electric Cyan**: `#00F2FE` (Futuristic Cyan)
    3. **Solar Gold**: `#FFD700` (Prestige & Tax/Accounts)
    4. **Matrix Emerald**: `#10B981` (Data/MIS Analytics)
    5. **Cyber Purple**: `#A855F7` (Obsidian Theme Accent)
    6. **Diamond White**: `#FFFFFF` (Pure Starlight)
    + Custom Hex Color Picker input with regex validation `/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/`.

---

## 5. Consumer Wiring & Interface Contracts

### 5.1 LabContext Interface Contract (`useLab()`)
The revised `LabContext` exports atomic accessors and high-level setters for all 4 tabs:

```javascript
const {
  // --- Audio Tab ---
  soundEnabled,
  masterVolume,         // 0 - 100
  pitchMultiplier,      // 0.5 - 2.0
  soundMatchingMode,    // 'dynamic' | 'universal'
  setSoundEnabled,      // (boolean) => void
  setMasterVolume,      // (number: 0-100) => void
  setPitchMultiplier,   // (number: 0.5-2.0) => void
  setSoundMatchingMode, // ('dynamic' | 'universal') => void

  // --- Cursor Tab ---
  customCursorEnabled,  // boolean
  cursorScale,          // 0.5 - 2.0
  flightLerpSpeed,      // 'dreamy' | 'natural' | 'snappy'
  flightSpeed,          // Numeric value (e.g. 0.14) for kinematics
  stardustTrailEnabled, // boolean
  particleColor,        // hex string
  setCustomCursorEnabled, // (boolean) => void
  setCursorScale,       // (number: 0.5-2.0) => void
  setFlightLerpSpeed,   // ('dreamy' | 'natural' | 'snappy') => void
  setStardustTrailEnabled, // (boolean) => void
  setParticleColor,     // (hex: string) => void

  // --- Hero Tab ---
  gazeMode,             // 'auto' | 'fixed'
  poseOverride,         // null | 0-9
  characterZoom,        // 0.5 - 2.0
  flashConfettiEnabled, // boolean
  setGazeMode,          // ('auto' | 'fixed') => void
  setPoseOverride,      // (null | number 0-9) => void
  setCharacterZoom,     // (number: 0.5-2.0) => void
  setFlashConfettiEnabled, // (boolean) => void

  // --- Startup & Preferences Tab ---
  defaultRole,          // 'accountant' | 'mis' | 'controller'
  defaultCursorEnabled, // boolean
  defaultAudioEnabled,  // boolean
  reducedMotion,        // boolean
  setDefaultRole,       // ('accountant' | 'mis' | 'controller') => void
  setDefaultCursorEnabled, // (boolean) => void
  setDefaultAudioEnabled,  // (boolean) => void
  setReducedMotion,     // (boolean) => void

  // --- Global Actions & Drawer ---
  isDrawerOpen,
  activeTab,
  setActiveTab,         // ('audio' | 'cursor' | 'hero' | 'preferences') => void
  openDrawer,
  closeDrawer,
  toggleDrawer,
  resetToFactoryDefaults, // () => void
  resetDefaults,        // Alias for resetToFactoryDefaults

  // --- Legacy Compatibility Aliases ---
  trailEnabled,         // Alias for stardustTrailEnabled
  setTrailEnabled,      // Alias for setStardustTrailEnabled
  audioPitch,           // Alias for pitchMultiplier
  setAudioPitch         // Alias for setPitchMultiplier
} = useLab();
```

### 5.2 DynamicCursorManager Wiring Contract
In `src/App.jsx`:
```jsx
<DynamicCursorManager
  activeCursor={activeCursor}
  heroRef={heroRef}
  isInsideHero={isInsideHero}
  customCursorEnabled={customCursorEnabled}
  speed={flightSpeed}
  trailEnabled={stardustTrailEnabled}
  scale={cursorScale}
  particleColor={particleColor}
  reducedMotion={effectiveReducedMotion}
/>
```
Inside `DynamicCursorManager.jsx`:
```javascript
export default function DynamicCursorManager({
  activeCursor = 'butterfly',
  heroRef,
  isInsideHero = false,
  customCursorEnabled = true,
  speed = 0.14,
  trailEnabled = true,
  scale = 1,
  particleColor = '#FF4D6D',
  reducedMotion: propReducedMotion
}) {
  const isDesktopCursor = useDesktopCursorSupport();
  // ...
  const effectiveReducedMotion = propReducedMotion !== undefined ? propReducedMotion : prefersReducedMotion;

  // If custom cursor is disabled, or device is mobile/touch, or reduced motion is active, do not mount cursor
  if (!customCursorEnabled || !isDesktopCursor || effectiveReducedMotion) {
    return null;
  }
  // ...
}
```

### 5.3 HeroSection Wiring Contract
In `src/components/HeroSection.jsx`:
- **Gaze Mode**: When `gazeMode === 'fixed'`, pointer tracking is disabled (`targetNormX = 0`, `targetNormY = 0`).
- **Pose Override (0 - 9)**:
  Pose mapping:
  - `0`: `'idle'` (`00-rear-view.png`)
  - `1`: `'upper-center'` (`01-center-up.png`)
  - `2`: `'lower-center'` (`02-lower-center.png`)
  - `3`: `'left'` (`03-center-left.png`)
  - `4`: `'right'` (`04-center-right.png`)
  - `5`: `'center'` (`05-center-front.png`)
  - `6`: `'upper-left'` (`06-upper-left.png`)
  - `7`: `'lower-left'` (`07-lower-left.png`)
  - `8`: `'upper-right'` (`08-upper-right.png`)
  - `9`: `'lower-right'` (`09-lower-right.png`)
  When `poseOverride !== null`, set `forcedState = POSE_INDEX_MAP[poseOverride]`.
- **Character Zoom**:
  - Connect `userScale` state to `characterZoom` from `useLab()`.
  - When `characterZoom` changes, `effectiveScale = BASELINE_SCALE * characterZoom`.
- **Flash & Confetti**:
  - Inside `triggerCapture()`:
    ```javascript
    if (!reducedMotion && flashConfettiEnabled) {
      setIsFlashing(true);
      confetti({ ... });
    }
    ```

### 5.4 Audio Synthesizer Wiring Contract (`src/utils/audio.js`)
Add `soundMatchingMode` support to `SoundFX`:
```javascript
class SoundFX {
  constructor() {
    // ...
    this.soundMatchingMode = 'dynamic'; // 'dynamic' | 'universal'
  }

  setSoundMatchingMode(mode) {
    this.soundMatchingMode = (mode === 'universal') ? 'universal' : 'dynamic';
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

    // Dynamic Matching Mode based on cursor category / ID
    switch (cursorId) {
      case 'butterfly':
      case 'firefly':
      case 'stardust':
      case 'wand':
        this.playCosmicSparkle();
        break;
      case 'laser':
      case 'crosshair':
        this.playLaserFocus();
        break;
      case 'camera':
      case 'viewfinder':
        this.playPolaroidShutter();
        break;
      case 'bubble':
      case 'pop':
        this.playBubblePop();
        break;
      case 'airplane':
      case 'wind':
        this.playRibbonSweep('up');
        break;
      case 'haptic':
      case 'click':
        this.playHapticClick();
        break;
      default:
        this.playCrystalChime();
        break;
    }
  }
}
```

---

## 6. Implementation Plan for Milestone 2

### Phase 1: Core State Refactoring (`src/context/LabContext.jsx`)
1. Define `CONTROL_CENTER_STORAGE_KEY = 'portfolio_control_center'`.
2. Define `FACTORY_DEFAULTS` constant.
3. Implement `loadSavedConfig()` with 3-tier fallback (new key -> legacy `portfolio_lab_config` -> factory defaults).
4. Initialize React state hooks for the 4 tabs and runtime UI state.
5. Implement clamping and validation utilities for volume (0-100), pitch (0.5-2.0), scale (0.5-2.0), zoom (0.5-2.0).
6. Implement `resetToFactoryDefaults()`.
7. Maintain backward-compatible getters and event dispatches (`portfolio:control-center-change`).

### Phase 2: Dynamic Cursor & Pointer Fallback (`src/components/DynamicCursorManager.jsx`)
1. Add `customCursorEnabled` prop.
2. If `!customCursorEnabled`, return `null`.
3. In `HeroSection.jsx`, guard `cursor-none` with `customCursorEnabled`.
4. Ensure global `custom-cursor-disabled` class is added/removed on `<html>` when toggled.

### Phase 3: Web Audio Extensions (`src/utils/audio.js`)
1. Add `soundMatchingMode` ('dynamic' | 'universal') property and setter to `SoundFX`.
2. Update `playCursorSelect(cursorId)` to branch on `soundMatchingMode`.
3. Ensure volume input (0-100) maps smoothly to `gain.value` (0.0 to 1.0) and pitch multiplier (0.5 to 2.0).

### Phase 4: UI Components Modernization
1. **InteractivePlayground.jsx** (`#playground` / `#lab`):
   - Remove `PhysicsSandbox.jsx` import, canvas, speedometer, particle burst, arcade presets.
   - Implement the theme-matched (Obsidian Dark / Linen Light) 4-tab workbench:
     - Tab 1: Audio Studio (Master toggle, Volume slider, Pitch slider, Matching Mode segmented toggle, 7 preview buttons).
     - Tab 2: Cursor & Dynamics (Custom cursor toggle, Scale slider, Lerp speed segmented buttons [Dreamy, Natural, Snappy], Trail toggle, Swatch grid + Hex picker).
     - Tab 3: Hero & Character Control (Gaze mode toggle [Auto / Fixed], 10 Pose override pills, Zoom slider 0.5x-2.0x, Camera flash & Confetti toggle).
     - Tab 4: Startup & Preferences (Default Role selector, Default Cursor toggle, Default Audio toggle, Reduced Motion toggle, 1-Click Reset to Factory Defaults button).
2. **LabStudioDrawer.jsx**:
   - Replicate the exact identical 4-tab Control Center experience in the slide-out drawer.
3. Clean up / delete unused files (`src/components/PhysicsSandbox.jsx`).

---

## 7. Verification Method & Success Criteria

1. **State Persistence**:
   - Edit any setting in Tab 1, 2, 3, or 4. Verify `localStorage.getItem('portfolio_control_center')` is updated.
   - Refresh browser (`F5`). Verify all customized values are restored accurately.
   - Click "Reset to Factory Defaults". Verify all values restore to `FACTORY_DEFAULTS` and `localStorage` is updated.
2. **Cursor Fallback Verification**:
   - In Tab 2, toggle "Custom Interactive Cursor" to OFF.
   - Move pointer across entire page, including over `#hero`.
   - Verify native arrow cursor appears over text and background, and native hand pointer appears over links and buttons.
   - Verify 0 canvas or custom cursor DOM nodes are rendering in the inspector.
   - Toggle "Custom Interactive Cursor" to ON. Verify selected custom cursor immediately re-attaches and follows pointer at 60-120 FPS.
3. **Audio Verification**:
   - Adjust Volume slider from 0% to 100%. Verify tone loudness responds.
   - Adjust Pitch multiplier from 0.5x to 2.0x. Verify acoustic tone deepens or becomes sharp treble.
   - Toggle Sound Matching Mode to 'Universal'. Verify all cursors play Crystal Chime.
   - Toggle to 'Dynamic'. Select Butterfly (Cosmic Sparkle), Laser (Laser Focus), Camera (Polaroid Shutter).
4. **Hero Verification**:
   - Toggle Gaze Mode to 'Fixed'. Move pointer inside Hero; verify character head does not move.
   - Click Pose 0 (Rear-view), Pose 5 (Center), Pose 3 (Left), Pose 8 (Upper-Right). Verify exact character pose displays immediately.
   - Adjust Character Zoom slider (0.5x to 2.0x). Verify character smoothly resizes in stage.
   - Toggle Flash & Confetti off, take photo; verify snapshot captures without flash or confetti.
5. **Build and Lint Verification**:
   - `npm run lint` passes with 0 warnings, 0 errors.
   - `npm run build` succeeds cleanly with zero bundle errors.
