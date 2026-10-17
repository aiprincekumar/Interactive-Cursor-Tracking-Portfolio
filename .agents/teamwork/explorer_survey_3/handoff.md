# Explorer 3 Survey & Architectural Specification Report: Cursor Scaling, Presets, Drawer & Navigation Integration

- **Agent:** Explorer 3
- **Working Directory:** `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_3`
- **Target Systems:** `ButterflyCursor.jsx`, `DynamicCursorManager.jsx`, `cursorConstants.js`, `Navbar.jsx`, `ExploreSubBar.jsx`, `CommandPalette.jsx`, `App.jsx`, `LabContext.jsx`
- **Date/Timestamp:** 2026-10-17T18:55:00Z
- **Milestone:** Survey Cursor Scaling, Presets & Drawer Integration

---

## 1. Observation

Direct code examination of relevant source files revealed the following exact baseline structures and mechanisms:

### 1.1 `src/components/ButterflyCursor.jsx`
- **Current Props & Refs** (lines 62–79):
  ```javascript
  export default function ButterflyCursor({
    heroRef,
    isInsideHero,
    speed = 0.14,
    trailEnabled = true,
    scale = 1,
    gravity = 0,
    particleColor = '#FF4D6D'
  })
  ```
  `scale`, `speed`, `trailEnabled`, `gravity`, and `particleColor` are synced to React refs (`scaleRef`, `speedRef`, `gravityRef`, `particleColorRef`) inside `useEffect` blocks (lines 103–126), preventing animation loop teardown/restart upon slider adjustments.
- **Flight Lerp Calculation** (lines 216–223):
  ```javascript
  const lambda = Math.max(3.0, (speedRef.current || 0.14) * 75.0);
  const lerpFactor = 1.0 - Math.exp(-lambda * dt);
  state.currentX += dx * lerpFactor;
  state.currentY += dy * lerpFactor;
  ```
  `speed = 0.14` produces $\lambda = 10.5$, which yields smooth exponential decay at 60/120/144/240 FPS without hitching.
- **Wing Flutter Calculation & DOM Injection** (lines 269–270, 281–282):
  ```javascript
  const targetFlutter = state.speedPxPerSec > 220 ? 0.08 : state.speedPxPerSec > 50 ? 0.11 : 0.16;
  state.flutterDuration += (targetFlutter - state.flutterDuration) * (1.0 - Math.exp(-8.0 * dt));
  ...
  b.style.transform = `translate3d(${posX}px, ${posY}px, 0) rotate(${rotZ}deg) rotateY(${rollY}deg) scale(${scaleRef.current || 1})`;
  b.style.setProperty('--flutter-duration', `${state.flutterDuration.toFixed(2)}s`);
  ```
  The wing flap CSS animations in `src/index.css` (lines 208, 216) consume `--flutter-duration` with `infinite cubic-bezier(0.42, 0.05, 0.58, 0.95)`. Currently, there is no direct multiplier exposed for wing flap frequency or flapping amplitude.

### 1.2 `src/components/DynamicCursorManager.jsx` & All 35 Modular Cursors
- **Dynamic Cursor Switcher** (lines 36–46, 84–112):
  Accepts `scale = 1`, `speed = 0.14`, `gravity = 0`, `particleColor = '#FF4D6D'`, `trailEnabled = true`.
  Dispatches to either `DEDICATED_CURSOR_COMPONENTS` (Butterfly, Firefly, Stardust, Airplane, Laser, Camera, Minimal) or `ModularKinematicCursor` for all 28 other variants in `cursorConstants.js`.
- **ModularKinematicCursor.jsx Transform Scaling** (lines 311–320):
  ```javascript
  let dynamicScale = scaleRef.current || 1;
  if (profile.scaleWithSpeed) {
    const speedPx = Math.hypot(state.vx, state.vy);
    const stretch = Math.min(1.25, 1.0 + speedPx * 0.0003);
    dynamicScale *= stretch;
  }
  el.style.transform = `translate3d(${posX}px, ${posY}px, 0) rotate(${rotZ}deg) rotateY(${rollY}deg) scale(${dynamicScale.toFixed(3)})`;
  ```
  `scaleRef.current` is already multiplied into `dynamicScale`.
- **Dedicated Cursors**:
  All 7 dedicated cursor components (`AirplaneCursor.jsx:173`, `FireflyCursor.jsx:191`, `StardustCursor.jsx:233`, `LaserCursor.jsx:153`, `CameraCursor.jsx:172`, `MinimalCursor.jsx:271`) already accept `scale` and inject `scale(...)` into their root transform matrix.

### 1.3 `src/components/InteractivePlayground.jsx` (In-Page Lab Section)
- **Current Slider Limitation** (lines 147–165):
  Currently titles the control "Butterfly Scale" and sets range `min="0.7"` to `max="1.5"`.
  The user requirement demands: "Global cursor scale multiplier (0.5x to 2.0x) affecting Butterfly and all 35 modular kinematic cursor styles, plus Butterfly flight lerp speed and wing-flap dynamics."
- **Scattered Local Storage** (lines 36, 44, 52 of `App.jsx`):
  Currently persists individual parameters to fragmented localStorage keys:
  - `active_cursor_variant`
  - `physics_particle_color`
  - `physics_gravity`
  - `physics_audio_pitch`
  There is no unified `portfolio_lab_config` JSON key, and no 1-click preset definitions exist.

### 1.4 `src/components/Navbar.jsx` & `src/components/ExploreSubBar.jsx`
- **Right Action Group Order** (lines 264–420):
  Order is strictly maintained: `[🔍 Search] -> [✨ Explore] -> [Role Switcher] -> [🦋 Cursor] -> [🌓 Theme] -> [🔊 Sound] -> [📄 Resume] -> [☰ Menu]`.
- **Explore SubBar** (`src/components/ExploreSubBar.jsx` lines 14–29):
  Features quick jump buttons for `gallery` (`#gallery`) and `playground` (`#lab` / `#playground`).
  Does not yet trigger or link to the slide-out Quick Lab Drawer.

### 1.5 `src/components/CommandPalette.jsx`
- **Execution Handlers** (lines 307–400):
  Handles `toggle-theme`, `download-resume`, `mailto`, `external`, `switch-about-tab`, `select-skill`, and smooth scrolling to `item.targetId`.
  Contains `act-cursor-playground` (`targetId: 'playground'`) in `src/utils/searchCatalog.js:69-80`, but lacks a direct action to toggle the slide-out Quick Lab Drawer without scrolling.

### 1.6 Baseline Verification
- `npm run build`: Succeeded in 723ms with 0 errors.
- `npx oxlint`: Succeeded in 94ms with 0 errors (1 harmless warning in test script).

---

## 2. Logic Chain

From the above observations, the architectural path from problem to solution is established through these logical deductions:

### Step 1: Global Cursor Scale Multiplier (0.5x to 2.0x) Across All 35 Cursors
- **Observation:** `DynamicCursorManager` and all 35 cursor styles already accept `scale` and apply it to their GPU-accelerated transform matrices.
- **Inference:** The only reason scaling was previously restricted to Butterfly between 0.7x and 1.5x was because `App.jsx` passed `butterflyScale` and `InteractivePlayground.jsx` clamped the input range to `[0.7, 1.5]`.
- **Design:**
  1. Rename state variable from `butterflyScale` to `cursorScale` (or manage it inside `LabContext`).
  2. Set input range: `min="0.5"`, `max="2.0"`, `step="0.05"`, `defaultValue="1.0"`.
  3. Ensure `DynamicCursorManager` passes `scale={cursorScale}` to both `DedicatedComponent` and `ModularKinematicCursor`.
  4. At 0.5x, a 38px butterfly shrinks to 19px (ultra-delicate); at 2.0x, it expands to 76px (high-impact showcase). Because `transform-origin` is `center center`, the pivot hotspot remains centered on `(clientX, clientY)` with zero coordinate drift or hit-testing offset.

### Step 2: Butterfly Flight Lerp Speed & Wing Dynamics Modulation
- **Observation:**
  `ButterflyCursor.jsx` calculates lerp speed as $\lambda = (\text{speedRef.current} \times 75)$ and calculates wing flutter duration in seconds as `targetFlutter = speedPxPerSec > 220 ? 0.08 : 0.11 : 0.16`.
- **Inference:**
  - Flight lerp speed can be continuously tuned or stepped with presets:
    - *Dreamy Float:* `speed = 0.07` ($\lambda = 5.25$, slow fluid glide)
    - *Natural Flight:* `speed = 0.14` ($\lambda = 10.5$, balanced responsiveness)
    - *Snappy Pursuit:* `speed = 0.25` ($\lambda = 18.75$, instant tracking)
    - Range: `min="0.05"` to `max="0.35"`, step `0.01`.
  - Wing flap dynamics can be multiplied by introducing a `wingFlapRate` or `flutterMultiplier` prop (default `1.0`, range `0.5` to `2.0`):
    ```javascript
    // In ButterflyCursor.jsx loop:
    const baseFlutter = state.speedPxPerSec > 220 ? 0.08 : state.speedPxPerSec > 50 ? 0.11 : 0.16;
    const flapRate = wingFlapRateRef.current || 1.0;
    const targetFlutter = baseFlutter / flapRate;
    state.flutterDuration += (targetFlutter - state.flutterDuration) * (1.0 - Math.exp(-8.0 * dt));
    b.style.setProperty('--flutter-duration', `${state.flutterDuration.toFixed(3)}s`);
    ```
    At `wingFlapRate = 2.0`, the wing flutter frequency doubles (0.04s - 0.08s, buzzing frenzy). At `wingFlapRate = 0.5`, flapping is halved (0.16s - 0.32s, majestic slow gliding).

### Step 3: Zero-Layout-Shift Slide-Out Quick Lab Drawer & Persistent FAB
- **Observation:**
  Existing page sections are positioned in standard document flow within `<main className="relative z-10">`, with Navbar at `z-40` and Cursors at `z-50` / `z-[60]` / `z-[70]`.
- **Inference for Zero Layout Shift:**
  - The drawer must be mounted with `fixed top-0 right-0 h-full w-[360px] sm:w-[400px] max-w-[92vw] z-[48]`.
  - Because it is `fixed` with `right-0`, opening or closing the drawer changes ONLY its CSS `transform: translateX(...)`. It has zero impact on viewport width, document scroll height, or sibling DOM nodes.
  - Positioning at `z-[48]` places it above Navbar (`z-40`), but strictly below the interactive cursor (`z-[60]` / `z-[70]`). Consequently, users can hover and tweak sliders inside the drawer while their custom cursor remains 100% visible and interactive over the drawer surface!
  - Backdrop: `fixed inset-0 bg-black/30 backdrop-blur-xs z-[47] transition-opacity duration-300`. Clicking the backdrop dismisses the drawer smoothly.
- **Inference for Floating Action Button (FAB):**
  - Position: `fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8`.
  - Icon: `FlaskConical` (`lucide-react`).
  - Styling: Circular glassmorphic button with coral glow (`bg-[#18181B]/90 dark:bg-stone-900/95 text-[#FF4D6D] border border-[#FF4D6D]/40 shadow-xl shadow-[#FF4D6D]/20 hover:scale-110 active:scale-95`).
  - Pulsing beacon dot: When custom parameters differ from factory defaults, show a subtle coral status ping (`span className="animate-ping bg-[#FF4D6D]"`).
  - Hover tooltip: "Quick Lab Studio (Tune Cursors & Physics)".
  - When the drawer opens, the FAB can smoothly rotate its icon or cross-fade into a close trigger.

### Step 4: Unified LocalStorage Persistence (`portfolio_lab_config`) & Real-Time Sync
- **Observation:**
  Currently, settings are fragmented across individual keys (`physics_particle_color`, `physics_gravity`, etc.). There is no unified synchronization mechanism between an in-page section, a drawer, and the runtime.
- **Inference:**
  A single JSON key `portfolio_lab_config` will store the complete studio configuration.
  ```json
  {
    "version": 1,
    "activePreset": "default",
    "cursor": {
      "activeCursor": "butterfly",
      "scale": 1.0,
      "speed": 0.14,
      "wingDynamics": 1.0
    },
    "physics": {
      "gravity": 0,
      "trailEnabled": true,
      "particleColor": "#FF4D6D"
    },
    "audio": {
      "soundEnabled": true,
      "volume": 1.0,
      "pitch": 1.0
    }
  }
  ```
- **Real-Time Cross-Component Synchronization:**
  Creating `src/context/LabContext.jsx` patterned after `RoleContext.jsx` ensures:
  1. A single source of truth for both `InteractivePlayground.jsx` (in-page) and `LabStudioDrawer.jsx` (slide-out).
  2. Modifying a slider in either surface immediately updates the shared state, updates `DynamicCursorManager`, updates `soundFX`, and writes to `localStorage`.
  3. `window.addEventListener('storage', ...)` allows multi-tab synchronization.
  4. Custom events (`open-lab-drawer`, `close-lab-drawer`, `apply-lab-preset`) provide headless triggers for Command Palette and Navbar.

### Step 5: Curated 1-Click Presets & Factory Reset Specification
- **Design of 4 Curated Presets:**
  1. **Cyberpunk Zero-G:**
     - `activeCursor`: `'laser'` (or `'reticle'`)
     - `scale`: `1.25`
     - `speed`: `0.22` (Snappy)
     - `wingDynamics`: `1.5`
     - `gravity`: `0` (Zero-G Drift)
     - `trailEnabled`: `true`
     - `particleColor`: `'#00F2FE'` (Electric Cyan)
     - `audioPitch`: `1.45` (Crisp digital tone)
     - `audioVolume`: `0.9`
  2. **Retro Arcade:**
     - `activeCursor`: `'pacman'` (or `'ghost'`)
     - `scale`: `1.30`
     - `speed`: `0.25` (Instant arcade snap)
     - `wingDynamics`: `1.2`
     - `gravity`: `35` (Bouncy arcade gravity)
     - `trailEnabled`: `true`
     - `particleColor`: `'#FACC15'` (Arcade Yellow)
     - `audioPitch`: `1.65` (High chiptune frequency)
     - `audioVolume`: `0.95`
  3. **Zen Minimalist:**
     - `activeCursor`: `'minimal'` (or `'leaf'`)
     - `scale`: `0.85`
     - `speed`: `0.08` (Fluid dreamy drift)
     - `wingDynamics`: `0.6` (Calm slow float)
     - `gravity`: `-20` (Gentle anti-gravity float)
     - `trailEnabled`: `false`
     - `particleColor`: `'#84CC16'` (Organic Lime)
     - `audioPitch`: `0.75` (Deep resonant acoustic bass)
     - `audioVolume`: `0.6`
  4. **Hyper Velocity:**
     - `activeCursor`: `'rocket'` (or `'speedster'`)
     - `scale`: `1.15`
     - `speed`: `0.32` (Ultra-fast pursuit)
     - `wingDynamics`: `2.0` (Hyper frenzy)
     - `gravity`: `80` (Heavy earth pull)
     - `trailEnabled`: `true`
     - `particleColor`: `'#FF3B00'` (Blazing Rocket Flame)
     - `audioPitch`: `1.85` (Supersonic high whistle)
     - `audioVolume`: `1.0`
  5. **Reset to Factory Defaults:**
     - `activeCursor`: `'butterfly'`
     - `scale`: `1.0`
     - `speed`: `0.14`
     - `wingDynamics`: `1.0`
     - `gravity`: `0`
     - `trailEnabled`: `true`
     - `particleColor`: `'#FF4D6D'`
     - `audioPitch`: `1.0`
     - `audioVolume`: `1.0`
     - `soundEnabled`: `true`
     - `activePreset`: `'default'`

### Step 6: Navigation Integration (Navbar, ExploreSubBar & Command Palette)
- **In `CommandPalette.jsx` & `searchCatalog.js`:**
  - Add action entry `act-lab-drawer`:
    - Title: `"🧪 Open Quick Lab Studio Drawer"`
    - Action type: `"open-lab-drawer"`
    - Keywords: `"lab drawer quick studio controls sliders physics cursor tuning telemetry presets soundboard fab"`
  - When selected, it fires `window.dispatchEvent(new CustomEvent('open-lab-drawer'))`, immediately sliding out the drawer.
  - Update `act-cursor-playground` to jump to `#playground` / `#lab` with smooth scroll and pulse ring.
- **In `ExploreSubBar.jsx`:**
  - Currently has 2 items: Gallery and Lab.
  - Expand to include a dual action for Lab:
    - "Lab Studio" -> Scrolls to `#playground`.
    - "Quick Drawer" -> Opens slide-out drawer on any section.

---

## 3. Caveats

1. **Touch / Mobile Devices Limitation:**
   - As observed in `DynamicCursorManager.jsx:80`, custom cursors are automatically disabled on touch/coarse pointers (`!isDesktopCursor`) to preserve native iOS/Android mobile gestures.
   - *Mitigation:* The Quick Lab Drawer should remain accessible on mobile, but controls that only affect desktop cursors should show a subtle mobile badge: "Desktop Cursor Preview" or dynamically test within the embedded sandbox canvas.
2. **Backdrop Click vs Active Canvas Testing:**
   - If the drawer has an opaque or modal backdrop covering the entire screen, clicking the main document will close the drawer.
   - *Mitigation:* Use a semi-transparent dark backdrop (`bg-black/25`) with `backdrop-blur-xs` that allows users to close it by tapping outside or pressing `Esc`, but also render a compact mini-telemetry and live physics testing orb inside the drawer itself so users can immediately verify physics changes without closing the drawer.
3. **Web Audio API Gesture Requirement:**
   - Modern browsers (Chrome/Safari) suspend `AudioContext` until the user performs their first user gesture (click/keydown).
   - *Mitigation:* `soundFX.init()` already handles `this.ctx.resume()`. Soundboard buttons and preset clicks are direct user gestures, ensuring immediate synthesized audio output without warning.
4. **Transform Scaling vs Particle Canvas Coordinates:**
   - When cursor scale is adjusted (e.g., 2.0x), only the SVG/DOM avatar is scaled via `transform: scale(2)`. The canvas particle trail emitter originates at `state.currentX, state.currentY`.
   - *Mitigation:* Because `transform-origin` of the cursor element is centered (`center center`), the hot spot corresponds to the center of the scaled element. No coordinate offset adjustment is required.

---

## 4. Conclusion & Architecture Specification

### 4.1 State Management Contract (`src/context/LabContext.jsx`)

Create a dedicated React context provider `LabProvider` and hook `useLab()`:

```typescript
export interface LabConfig {
  version: 1;
  activePreset: 'default' | 'cyberpunk_zerog' | 'retro_arcade' | 'zen_minimalist' | 'hyper_velocity' | 'custom';
  cursor: {
    activeCursor: string;       // default 'butterfly'
    scale: number;              // 0.5 to 2.0, default 1.0
    speed: number;              // 0.05 to 0.35, default 0.14
    wingDynamics: number;       // 0.5 to 2.0, default 1.0
  };
  physics: {
    gravity: number;            // -60 to 140, default 0
    trailEnabled: boolean;      // default true
    particleColor: string;      // hex '#FF4D6D'
  };
  audio: {
    soundEnabled: boolean;      // default true
    volume: number;             // 0.0 to 1.0, default 1.0
    pitch: number;              // 0.5 to 2.0, default 1.0
  };
}
```

```javascript
// LocalStorage Key
export const LAB_STORAGE_KEY = 'portfolio_lab_config';

// Hook API Contract
export interface LabContextValue {
  config: LabConfig;
  updateConfig: (updater: Partial<LabConfig> | ((prev: LabConfig) => LabConfig)) => void;
  setCursorScale: (scale: number) => void;
  setCursorSpeed: (speed: number) => void;
  setWingDynamics: (dynamics: number) => void;
  setActiveCursor: (cursorId: string) => void;
  setGravity: (gravity: number) => void;
  setTrailEnabled: (enabled: boolean) => void;
  setParticleColor: (color: string) => void;
  setAudioVolume: (volume: number) => void;
  setAudioPitch: (pitch: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  applyPreset: (presetKey: string) => void;
  resetToDefaults: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}
```

### 4.2 Quick Lab Drawer Component (`src/components/LabStudioDrawer.jsx`)

The drawer component will encompass:
1. **Persistent Floating Action Button (FAB):**
   - Renders at `fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8`.
   - Tooltip: "Quick Lab Studio (Tune Cursors & Physics)".
   - Clicking toggles the drawer and plays `soundFX.playRibbonToggle(true)`.
2. **Slide-Out Drawer Container:**
   - Markup:
     ```jsx
     {/* Backdrop */}
     {isDrawerOpen && (
       <div
         className="fixed inset-0 bg-black/35 backdrop-blur-xs z-[47] transition-opacity duration-300"
         onClick={closeDrawer}
         aria-hidden="true"
       />
     )}

     {/* Drawer Panel */}
     <aside
       id="quick-lab-drawer"
       role="dialog"
       aria-modal="true"
       aria-label="Quick Lab Customization Studio"
       className={`fixed top-0 right-0 h-full w-[360px] sm:w-[420px] max-w-[92vw] z-[48] bg-[#FAF8F5]/98 dark:bg-[#120D1D]/98 backdrop-blur-xl border-l border-[#E7E2D8] dark:border-[#2D2340] shadow-2xl flex flex-col transition-transform duration-300 ease-out will-change-transform ${
         isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
       }`}
     >
       {/* Header with Title, Preset Badge, and Close Button */}
       {/* 1-Click Presets Ribbon */}
       {/* Live Telemetry HUD Strip */}
       {/* Scrollable Controls Body */}
       {/* Footer with Reset Defaults and Link to In-Page Sandbox */}
     </aside>
     ```
3. **Drawer Controls Content:**
   - **Preset Buttons:** 4 stylized recipe buttons (*Cyberpunk Zero-G*, *Retro Arcade*, *Zen Minimalist*, *Hyper Velocity*).
   - **Global Cursor Scale Slider:** Range 0.5x to 2.0x, step 0.05x, with live px readout (`${Math.round(scale * 38)}px`).
   - **Flight Lerp Speed Controls:** Dreamy (0.07), Natural (0.14), Snappy (0.25), or continuous slider.
   - **Butterfly Wing Dynamics Slider:** 0.5x (Calm Glide) to 2.0x (Hyper Flutter).
   - **Gravity Field Slider:** -60 px/s² (Anti-Gravity) to +140 px/s² (Heavy Earth).
   - **Particle Trail Toggle & Color Palette:** 4 preset theme pills + HTML5 color picker.
   - **Web Audio Controls & Soundboard:** Master volume slider, pitch multiplier slider, and 7-sound trigger grid:
     1. Polaroid Shutter (`soundFX.playShutter()`)
     2. Cosmic Sparkle (`soundFX.playSparkle()`)
     3. Bubble Pop (`soundFX.playPop()`)
     4. Laser Focus (`soundFX.playFocusBeep()`)
     5. Crystal Chime (`soundFX.playCursorSelect()`)
     6. Ribbon Sweep (`soundFX.playRibbonToggle(true)`)
     7. Haptic Click (`soundFX.playChipHover()`)

### 4.3 `ButterflyCursor.jsx` Implementation Modifications

Introduce `wingDynamics = 1.0` prop:
```javascript
export default function ButterflyCursor({
  heroRef,
  isInsideHero,
  speed = 0.14,
  trailEnabled = true,
  scale = 1,
  gravity = 0,
  particleColor = '#FF4D6D',
  wingDynamics = 1.0
}) {
  const wingDynamicsRef = useRef(wingDynamics);

  useEffect(() => {
    wingDynamicsRef.current = wingDynamics;
  }, [wingDynamics]);

  // Inside loop:
  const baseFlutter = state.speedPxPerSec > 220 ? 0.08 : state.speedPxPerSec > 50 ? 0.11 : 0.16;
  const dynamicsMult = Math.max(0.4, Math.min(2.5, wingDynamicsRef.current || 1.0));
  const targetFlutter = baseFlutter / dynamicsMult;
  state.flutterDuration += (targetFlutter - state.flutterDuration) * (1.0 - Math.exp(-8.0 * dt));

  b.style.transform = `translate3d(${posX}px, ${posY}px, 0) rotate(${rotZ}deg) rotateY(${rollY}deg) scale(${scaleRef.current || 1})`;
  b.style.setProperty('--flutter-duration', `${state.flutterDuration.toFixed(3)}s`);
}
```

### 4.4 Global Navigation & Command Palette Integration

1. In `src/utils/searchCatalog.js`:
   Add catalog item `act-lab-drawer`:
   ```javascript
   {
     id: 'act-lab-drawer',
     title: '🧪 Open Quick Lab Studio Drawer',
     category: 'Actions',
     badge: 'Studio Drawer',
     matchType: 'Interactive Tool',
     role: 'both',
     actionType: 'open-lab-drawer',
     description: 'Slide out the Quick Lab Studio Drawer from the right edge to adjust cursor scale, physics and audio in real-time.',
     keywords: 'open lab drawer quick studio controls sliders physics cursor tuning telemetry presets soundboard fab'
   }
   ```
2. In `src/components/CommandPalette.jsx`:
   In `handleSelect`:
   ```javascript
   if (item.actionType === 'open-lab-drawer' || item.id === 'act-lab-drawer') {
     window.dispatchEvent(new CustomEvent('open-lab-drawer'));
     return;
   }
   ```
3. In `src/components/ExploreSubBar.jsx`:
   Add a direct trigger item for Quick Studio Drawer alongside Gallery and Lab Studio.

---

## 5. Verification Method

To verify the implementation independently once developed:

1. **Static Analysis & Type Checking:**
   ```powershell
   npx oxlint
   ```
   Must exit with 0 errors.
2. **Production Bundle Compilation:**
   ```powershell
   npm run build
   ```
   Must succeed with 0 compilation or chunk generation errors.
3. **Functional Verification Checklist:**
   - **FAB Visibility & Click:** The floating action button with the flask icon is fixed at the bottom-right corner and clicking it slides out `#quick-lab-drawer` smoothly from the right edge.
   - **Zero Layout Shift:** Inspect document width and bounding boxes of `#hero` and `#about` before and after opening the drawer; verify 0px shift.
   - **Global Cursor Scaling:** Slide scale slider from 0.5x to 2.0x; observe instantaneous resizing of active cursor (both Butterfly and modular styles like Laser, Pacman, Rocket).
   - **Flight Lerp & Wing Dynamics:** Toggle between Dreamy (0.07) and Snappy (0.25); adjust wing dynamics from 0.5x to 2.0x; observe wing flutter frequency acceleration.
   - **1-Click Presets:** Click each of the 4 presets (*Cyberpunk Zero-G*, *Retro Arcade*, *Zen Minimalist*, *Hyper Velocity*); confirm atomic application of cursor, scale, gravity, particle color, audio pitch, and sound.
   - **Soundboard Verification:** Click all 7 sound buttons (Polaroid Shutter, Cosmic Sparkle, Bubble Pop, Laser Focus, Crystal Chime, Ribbon Sweep, Haptic Click); verify audible Web Audio synthesis with active pitch and volume applied.
   - **LocalStorage Persistence:** Refresh browser; verify `portfolio_lab_config` is retrieved and all customized slider values and active preset persist accurately.
   - **Reset to Defaults:** Click "Reset Defaults"; verify all values immediately revert to factory baseline (`scale = 1.0`, `gravity = 0`, `particleColor = '#FF4D6D'`).
   - **Command Palette (`Cmd+K`):** Type `drawer` or `lab`; press Enter on "Open Quick Lab Studio Drawer"; verify drawer slides out immediately.
