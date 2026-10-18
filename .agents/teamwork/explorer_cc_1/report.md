# Technical Investigation Report: Portfolio Control Center Modernization

**Explorer:** Explorer 1 (`explorer_cc_1`)  
**Milestone:** Milestone 1 (Survey & UI Architecture)  
**Target Surfaces:** `InteractivePlayground.jsx` (In-page `#playground` / `#lab`), `LabStudioDrawer.jsx` (Floating Quick Drawer), `PhysicsSandbox.jsx` (Removal / Cleanup)  
**Date:** 2026-10-18  

---

## 1. Executive Summary

This investigation provides the definitive architectural blueprint for transforming the legacy 'Lab' section of the Interactive Cursor-Tracking Portfolio into a theme-matched (**Obsidian Dark / Linen Light**), professional **Portfolio Control Center**.

### Key Findings:
1. **Toy/Physics Sandbox Elimination**:
   - `src/components/PhysicsSandbox.jsx` (722 lines) contains a 2D canvas simulation of 7 elastic orbs, gravity trampoline mechanics, a real-time px/s speedometer HUD, a particle burst trigger button, and zero-g toggles.
   - `PhysicsSandbox` is imported and mounted exclusively in `src/components/InteractivePlayground.jsx` (line 23 & line 226).
   - Gaming presets (*Cyberpunk Zero-G*, *Retro Arcade*, *Zen Minimalist*, *Hyper Velocity*) are hardcoded in `InteractivePlayground.jsx`, `LabStudioDrawer.jsx`, and `src/context/LabContext.jsx`.
   - All of these toy mechanics are irrelevant to Atul Kant Verma's authentic executive portfolio and will be cleanly excised without leaving orphaned imports or dead code.
2. **Current Layout Deficiencies**:
   - `InteractivePlayground.jsx` currently uses an asymmetrical 2-column layout (Left: Physics Canvas & Camera Poses; Right: Presets, Scale, Speed, Gravity, Audio, Soundboard). It has **zero tab architecture**.
   - `LabStudioDrawer.jsx` is a single long vertical scroll view with 5 stacked sections (A: Presets, B: Cursor Kinematics, C: Gravity & Colors, D: Audio, E: Soundboard). It also has **zero tab architecture**.
   - Neither surface conforms to the required structured 4-tab settings layout.
3. **Proposed 4-Tab Control Center Architecture**:
   - Both in-page `#playground` / `#lab` and the slide-out `LabStudioDrawer.jsx` will be refactored to share an **identical, theme-matched 4-tab Control Center**:
     - **Tab 1: 🔊 Audio Studio** (Master Sound Toggle, Volume Slider 0-100%, Pitch Multiplier 0.5x-2.0x, Sound Matching Mode: Dynamic vs. Universal Voice, 7 Acoustic Previews).
     - **Tab 2: ✨ Cursor & Dynamics** (Custom Cursor Toggle On/Off, Global Scale 0.5x-2.0x, Flight Lerp Speed Dreamy/Natural/Snappy, Stardust Trail Toggle & Theme Swatches).
     - **Tab 3: 👤 Hero & Character Control** (Gaze Tracking Mode: Auto Follow vs. Static Fixed, 10 3D Head Pose Overrides, Character Zoom Slider 0.5x-2.0x, Camera Flash & Confetti Toggle).
     - **Tab 4: ⚙️ Startup & Preferences** (Default Startup Role Track, Startup Cursor State, Startup Audio State, Reduced Motion Toggle, 1-Click Factory Reset).
4. **State & Storage Migration**:
   - Migrate `localStorage` key from `portfolio_lab_config` to `portfolio_control_center` in `LabContext.jsx` with full backward-compatible fallback parsing.
   - Wire all parameters directly to live consumers (`DynamicCursorManager.jsx`, `HeroSection.jsx`, `audio.js`, `RoleContext.jsx`).

---

## 2. Codebase Audit: Toy/Physics Feature Occurrences

A comprehensive grep across the entire codebase was conducted to identify all imports, references, and usages of the targeted features:

| Feature / Artifact | Files Located | Line References | Cleanup / Removal Action |
|---|---|---|---|
| `PhysicsSandbox` component | `src/components/PhysicsSandbox.jsx`<br>`src/components/InteractivePlayground.jsx` | `PhysicsSandbox.jsx:1-722`<br>`InteractivePlayground.jsx:23, 226` | Delete `PhysicsSandbox.jsx`. Remove import and JSX mount from `InteractivePlayground.jsx`. |
| 7 Elastic Orbs (`ORB_CONFIGS`) & Collisions | `src/components/PhysicsSandbox.jsx`<br>`src/components/InteractivePlayground.jsx` | `PhysicsSandbox.jsx:6-14, 405-442`<br>`InteractivePlayground.jsx:221` | Delete file and remove badge string `"7 Elastic Orbs"`. |
| Px/s Speedometer & Telemetry HUD | `src/components/PhysicsSandbox.jsx` | `PhysicsSandbox.jsx:36-40, 569-589, 624-658` | Remove entire DOM-ref telemetry HUD and `Gauge` / `Activity` speed meters. |
| Particle Burst Button (`triggerParticleBurst`) | `src/components/PhysicsSandbox.jsx` | `PhysicsSandbox.jsx:134-187, 665-674` | Remove button and radial spark canvas generator. |
| Gaming Presets (*Cyberpunk Zero-G*, *Retro Arcade*, *Zen*, *Hyper*) | `src/components/InteractivePlayground.jsx`<br>`src/components/LabStudioDrawer.jsx`<br>`src/context/LabContext.jsx` | `InteractivePlayground.jsx:25-54, 278-323`<br>`LabStudioDrawer.jsx:25-58, 266-307`<br>`LabContext.jsx:21-108, 393-430` | Remove gaming presets cards and preset grid from both UI surfaces. Clean up preset map in `LabContext.jsx`. |
| Gravitational Acceleration Slider (`gravity`) | `src/components/InteractivePlayground.jsx`<br>`src/components/LabStudioDrawer.jsx`<br>`src/context/LabContext.jsx`<br>`src/App.jsx` | `InteractivePlayground.jsx:449-484`<br>`LabStudioDrawer.jsx:430-465`<br>`LabContext.jsx:11, 127-130, 218`<br>`App.jsx:36, 109, 177-178` | Remove gravity slider from UI. In `LabContext.jsx`, decouple physics gravity from UI while retaining safe default 0 for cursor float. |
| Explore SubBar description | `src/components/ExploreSubBar.jsx` | `ExploreSubBar.jsx:27` | Update `desc: 'Physics Sandbox'` to `desc: 'Control Center'`. |

---

## 3. UI Layout & Dual-Surface Tab Architecture

Both the in-page section and the slide-out Quick Drawer must provide an identical, responsive, keyboard-navigable 4-tab structure.

### 3.1 Design System & Theme Conformance
- **Backgrounds**:
  - Light mode (Linen Light): `bg-[#FAF8F5]/90 backdrop-blur-2xl border-[#E7E2D8]`
  - Dark mode (Obsidian Dark): `dark:bg-[#120D1D]/90 backdrop-blur-2xl dark:border-[#2D2340]`
- **Accent**: Warm Coral `#FF4D6D` / `#E03554` for primary toggles, active rings, and highlights.
- **Tab Bar Styling**:
  - Container: `flex p-1.5 bg-[#FAF8F5] dark:bg-[#18181B] rounded-2xl border border-[#ECE7DF] dark:border-stone-800 gap-1.5 overflow-x-auto no-scrollbar`
  - Active Tab: `bg-white dark:bg-stone-800 text-[#18181B] dark:text-white shadow-xs border border-[#E7E2D8] dark:border-stone-700 font-bold`
  - Inactive Tab: `text-stone-600 dark:text-stone-400 hover:text-[#18181B] dark:hover:text-white hover:bg-stone-100/60 dark:hover:bg-stone-800/50 border border-transparent font-medium`
- **Accessibility & WAI-ARIA**:
  - `role="tablist"` with `aria-orientation="horizontal"`
  - `role="tab"`, `aria-selected={activeTab === id}`, `aria-controls={`panel-${id}`}`, `id={`tab-${id}`}`
  - Keyboard navigation: `ArrowRight`, `ArrowLeft`, `Home`, `End`
  - `role="tabpanel"`, `aria-labelledby={`tab-${id}`}`, `tabIndex={0}`

---

### 3.2 Specification of the 4 Tabs

#### Tab 1: 🔊 Audio Studio (`id: 'audio'`)
| Control | Semantic Type | Values / Range | Default | Purpose / Wiring |
|---|---|---|---|---|
| **Master Sound Toggle** | Switch (`role="switch"`) | On (`true`) / Off (`false`) | `true` | Calls `soundFX.setEnabled(bool)`. Mutes/unmutes all portfolio audio feedback. |
| **Master Volume** | Range Slider (`<input type="range">`) | `0.0` - `1.0` (step `0.05`, 0% - 100%) | `0.80` (80%) | Calls `soundFX.setMasterVolume(vol)`. Modulates output gain. |
| **Pitch Multiplier** | Range Slider | `0.5x` - `2.0x` (step `0.05`) | `1.00x` | Calls `soundFX.setPitchMultiplier(mult)`. Deep Bass (0.5x) to Sharp Treble (2.0x). |
| **Sound Matching Mode** | Segmented Button Group | `'dynamic'` vs `'universal'` | `'dynamic'` | **Dynamic Matching**: Sounds adapt to cursor variant (Butterfly=Sparkle, Laser=Focus, Camera=Shutter).<br>**Universal Voice**: Consistent subtle crystal chime across all interactions. |
| **Acoustic Previews (7)** | 7 Interactive Grid Buttons | Shutter, Sparkle, Pop, Focus, Chime, Ribbon, Haptic | N/A | Instant acoustic audition with active pitch and volume applied. |

#### Tab 2: ✨ Cursor & Dynamics (`id: 'cursor'`)
| Control | Semantic Type | Values / Range | Default | Purpose / Wiring |
|---|---|---|---|---|
| **Custom Cursor Toggle** | Switch (`role="switch"`) | On (`true`) / Off (`false`) | `true` | **Off**: Unmounts custom cursor and restores standard OS pointer cleanly.<br>**On**: Restores selected custom cursor with 60-120 FPS kinematics. |
| **Global Scale Multiplier** | Range Slider | `0.5x` - `2.0x` (step `0.05`) | `1.00x` (38px) | Applies to Butterfly and all 35 kinematic cursor variants. Visual indicator displays computed px. |
| **Flight Lerp Speed** | 3 Buttons + Range Slider | Dreamy (`0.07`), Natural (`0.14`), Snappy (`0.25`)<br>Slider: `0.05` - `0.35` | `0.14` | Adjusts exponential smoothing factor for cursor following. |
| **Stardust Trail Toggle** | Switch (`role="switch"`) | On (`true`) / Off (`false`) | `true` | Toggles canvas stardust particle emission on pointer movement. |
| **Particle Color Palette** | 6 Preset Swatches + Hex Input + Color Picker | `#FF4D6D`, `#00F2FE`, `#FFD700`, `#10B981`, `#A855F7`, `#FFFFFF` | `#FF4D6D` | Sets particle color stream and glow effect. |

#### Tab 3: 👤 Hero & Character Control (`id: 'hero'`)
| Control | Semantic Type | Values / Range | Default | Purpose / Wiring |
|---|---|---|---|---|
| **Gaze Tracking Mode** | Segmented Button Group | `'auto'` (Auto Gaze Follow) vs `'fixed'` (Static Fixed) | `'auto'` | **Auto Follow**: Character head tracks cursor and device gyroscope.<br>**Static Fixed**: Character gaze locks to selected pose override. |
| **10 3D Head Pose Overrides** | 11 Buttons (Auto + 10 Poses) | `Auto (null)`, `Idle`, `Center`, `Up-Center`, `Down-Center`, `Left`, `Right`, `Up-Left`, `Down-Left`, `Up-Right`, `Down-Right` | `Auto` | Selects exact 3D gaze angle from verified hero pose library (`00-rear-view` to `09-lower-right`). |
| **Character Zoom / Scale** | Range Slider | `0.5x` - `2.0x` (step `0.05`) | `1.00x` (100%) | Directly adjusts `HeroSection` character render scale (`effectiveScale = BASELINE_SCALE * userScale`). |
| **Camera Flash & Confetti** | Switch (`role="switch"`) | On (`true`) / Off (`false`) | `true` | Toggles Polaroid viewport white flash and `canvas-confetti` explosion when clicking "Shoot a look 📸". |

#### Tab 4: ⚙️ Startup & Preferences (`id: 'startup'`)
| Control | Semantic Type | Values / Range | Default | Purpose / Wiring |
|---|---|---|---|---|
| **Default Startup Role Track** | 4-Option Radio / Button Strip | `'accountant'` (Financial Track)<br>`'mis'` (Data & Ops Track)<br>`'other'` (BI & Controller Track)<br>`'overview'` (Executive Track) | `'accountant'` | Sets preferred career track applied upon fresh session or initial visit. |
| **Default Cursor on Startup** | Segmented Button Group | Enabled (`true`) / Disabled (`false`) | Enabled (`true`) | Persists startup cursor preference to `localStorage`. |
| **Default Audio on Startup** | Segmented Button Group | Enabled (`true`) / Disabled (`false`) | Enabled (`true`) | Persists startup sound preference to `localStorage`. |
| **Reduced Motion Override** | Switch (`role="switch"`) | On (`true`) / Off (`false`) | System Pref | Accessibility control that forces reduced motion, suppressing rapid movement and transitions. |
| **Reset to Factory Defaults** | Button with `RotateCcw` icon | Action trigger | N/A | Restores all Control Center settings to factory values and plays sparkle chime. |

---

### 3.3 Surface Layout Comparison: In-Page Workbench vs. Quick Drawer

```
+----------------------------------------------------------------------------------------------------+
| IN-PAGE WORKBENCH (#playground / #lab)                                                            |
| Max-width: 1280px (max-w-7xl), centered, spacious padding (p-6 to p-10)                            |
+----------------------------------------------------------------------------------------------------+
| [HEADER]: Pill Badge + "Portfolio Control Center" + Description          [Quick Drawer] [Reset]    |
| [TABLIST]: [ 🔊 Audio Studio ] [ ✨ Cursor & Dynamics ] [ 👤 Hero & Character ] [ ⚙️ Preferences ]  |
|                                                                                                    |
| [ACTIVE TABPANEL CONTENT]:                                                                         |
|   Responsive 2-column or 3-column sub-cards (e.g. Volume/Pitch Card + Soundboard Card)             |
|   Comfortable desktop spacing, clean visual groupings, obsidian/linen glassmorphic cards           |
+----------------------------------------------------------------------------------------------------+

+-------------------------------------------------------------+
| SLIDE-OUT QUICK DRAWER (LabStudioDrawer.jsx)                |
| Width: 380px - 440px (max-w-[95vw]), right-fixed overlay     |
+-------------------------------------------------------------+
| [HEADER]: Icon + "Control Center" + Tab Badge  [Reset] [X]  |
| [TAB STRIP]: [🔊 Audio] [✨ Cursor] [👤 Hero] [⚙️ Startup]  |
|                                                             |
| [SCROLLABLE BODY]:                                          |
|   Single-column vertically stacked controls for active tab  |
|   Compact sliders, buttons, and switches                    |
|                                                             |
| [FOOTER]: "Open Full Control Center" [↗]    "Auto-persists" |
+-------------------------------------------------------------+
```

---

## 4. State Architecture & Reactive Persistence

### 4.1 Schema Definition for `portfolio_control_center`

```typescript
interface ControlCenterConfig {
  version: 2;
  // Tab 1: Audio Studio
  soundEnabled: boolean;           // default: true
  masterVolume: number;           // default: 0.8 (0.0 to 1.0)
  audioPitch: number;             // default: 1.0 (0.5 to 2.0)
  soundMatchingMode: 'dynamic' | 'universal'; // default: 'dynamic'

  // Tab 2: Cursor & Dynamics
  customCursorEnabled: boolean;    // default: true
  cursorScale: number;            // default: 1.0 (0.5 to 2.0)
  flightSpeed: number;            // default: 0.14 (0.05 to 0.35)
  wingDynamics: number;           // default: 1.0 (0.5 to 2.0)
  trailEnabled: boolean;          // default: true
  particleColor: string;          // default: '#FF4D6D'

  // Tab 3: Hero & Character Control
  gazeTrackingMode: 'auto' | 'fixed'; // default: 'auto'
  heroPoseOverride: string | null;     // default: null
  heroScale: number;                  // default: 1.0 (0.5 to 2.0)
  cameraFlashConfettiEnabled: boolean;// default: true

  // Tab 4: Startup & Preferences
  startupRole: 'accountant' | 'mis' | 'other' | 'overview'; // default: 'accountant'
  startupCursorEnabled: boolean;      // default: true
  startupAudioEnabled: boolean;       // default: true
  reducedMotion: boolean;             // default: false (or prefers-reduced-motion)

  // Active UI Navigation Tab
  activeTab: 'audio' | 'cursor' | 'hero' | 'startup';

  updatedAt: string;
}
```

### 4.2 Migration Strategy
When reading `localStorage`:
1. Check `localStorage.getItem('portfolio_control_center')`. If present and valid JSON, use it.
2. If absent, fallback to parsing legacy `portfolio_lab_config`. Map legacy keys:
   - `cursorScale` -> `cursorScale`
   - `flightSpeed` -> `flightSpeed`
   - `wingDynamics` -> `wingDynamics`
   - `soundEnabled` -> `soundEnabled`
   - `masterVolume` -> `masterVolume`
   - `audioPitch` -> `audioPitch`
   - `particleColor` -> `particleColor`
   - `trailEnabled` -> `trailEnabled`
   - Initialize new fields (`customCursorEnabled: true`, `gazeTrackingMode: 'auto'`, `heroPoseOverride: null`, `heroScale: 1.0`, `cameraFlashConfettiEnabled: true`, `soundMatchingMode: 'dynamic'`, `startupRole: 'accountant'`).
3. Write back to `portfolio_control_center` and keep legacy keys updated as safe mirrors during the transition.

---

## 5. Concrete File Diff & Implementation Recommendations

### 5.1 Step 1: Remove `src/components/PhysicsSandbox.jsx`
- **Action**: Delete `src/components/PhysicsSandbox.jsx`.
- **Reason**: Contains all 2D elastic orbs, canvas simulation, bouncing balls, px/s speedometer HUD, particle burst button, and zero-g toggles.

### 5.2 Step 2: Refactor `src/components/InteractivePlayground.jsx`
- **Imports**:
  - Remove `import PhysicsSandbox from './PhysicsSandbox';`
  - Remove `LAB_PRESETS` and `PRESET_CARDS`
  - Add icons: `Volume2, VolumeX, Sliders, Sparkles, User, Settings, Camera, Eye, RotateCcw, Check, Sparkles, Zap, Shield`
- **State & Props**:
  - Consume all parameters from `useLab()`.
  - Maintain active tab state `activeTab` (`'audio'`, `'cursor'`, `'hero'`, `'startup'`).
- **JSX Structure**:
  - Header: Update title to "Portfolio Control Center", subtitle to reflect practical controls.
  - Tabs Strip: Horizontal tab bar with 4 tabs following WAI-ARIA tablist/tab pattern.
  - Tab Panels:
    - Panel 1: Audio Studio with Master Toggle, Volume Slider, Pitch Slider, Sound Matching Mode Switcher, and 7-Sound Soundboard.
    - Panel 2: Cursor & Dynamics with Custom Cursor Toggle, Scale Slider, Lerp Speed Buttons, Trail Toggle, and Theme Swatches.
    - Panel 3: Hero & Character Control with Gaze Tracking Mode (Auto/Fixed), 10 Head Pose Buttons, Character Zoom Slider, and Flash/Confetti Toggle.
    - Panel 4: Startup & Preferences with Startup Role selector, Default Cursor/Audio switches, Reduced Motion toggle, and 1-Click Factory Reset.

### 5.3 Step 3: Refactor `src/components/LabStudioDrawer.jsx`
- **Imports & Layout**:
  - Mirror the 4-tab structure from `InteractivePlayground.jsx`.
  - Add compact tab selector bar under the drawer header.
  - Switch panels conditionally based on `activeTab`.
  - Keep slide-out zero-layout-shift behavior (`fixed top-0 right-0 h-full w-[380px] sm:w-[420px]`).

### 5.4 Step 4: Expand `src/context/LabContext.jsx`
- Update storage key to `portfolio_control_center`.
- Implement new state items and getters/setters:
  - `customCursorEnabled`, `setCustomCursorEnabled`
  - `soundMatchingMode`, `setSoundMatchingMode`
  - `gazeTrackingMode`, `setGazeTrackingMode`
  - `heroPoseOverride`, `setHeroPoseOverride`
  - `heroScale`, `setHeroScale`
  - `cameraFlashConfettiEnabled`, `setCameraFlashConfettiEnabled`
  - `startupRole`, `setStartupRole`
  - `startupCursorEnabled`, `setStartupCursorEnabled`
  - `startupAudioEnabled`, `setStartupAudioEnabled`
  - `reducedMotion`, `setReducedMotion`
  - `activeTab`, `setActiveTab`
- Maintain safe fallback properties (`gravity: 0`) to prevent runtime exceptions in any third-party or residual callers.

### 5.5 Step 5: Wire Consumers
- **`src/App.jsx`**:
  - In `DynamicCursorManager` mount: add check for `customCursorEnabled`.
  - Pass `heroPoseOverride`, `heroScale`, `gazeTrackingMode`, `cameraFlashConfettiEnabled` into `HeroSection`.
- **`src/components/DynamicCursorManager.jsx`**:
  - If `!customCursorEnabled`, return `null`.
- **`src/components/HeroSection.jsx`**:
  - Support `gazeTrackingMode === 'fixed'` by locking pose to `heroPoseOverride || 'center'`.
  - Support `heroScale` to drive character zoom.
  - Condition `confetti()` and `setIsFlashing(true)` on `cameraFlashConfettiEnabled && !reducedMotion`.
- **`src/utils/audio.js`**:
  - Add `soundMatchingMode` property with `setSoundMatchingMode(mode)`.
  - When in `'universal'` mode, play crystal chime for cursor selection instead of varying per cursor.
- **`src/components/ExploreSubBar.jsx`**:
  - Update label/description to 'Control Center'.

---

## 6. Risk Assessment & Verification Plan

### 6.1 Risks & Mitigation

| Risk ID | Identified Risk | Severity | Mitigation Strategy |
|---|---|---|---|
| R-01 | Orphaned imports of `PhysicsSandbox` causing build failure | High | Verified grep: only `InteractivePlayground.jsx` imports `PhysicsSandbox`. Removing import alongside file deletion ensures clean build. |
| R-02 | Broken legacy test script `test_physics_telemetry_simulation.mjs` | Medium | Note that this script specifically inspected `PhysicsSandbox.jsx` for the deprecated toy mechanics. Milestone 3 will provide comprehensive tests for the 4-tab Control Center. |
| R-03 | Native cursor hidden when custom cursor is disabled | High | Ensure `cursor-none` in `HeroSection.jsx` is only active when `customCursorEnabled` is `true`. Toggling custom cursor off restores standard browser arrow. |
| R-04 | Mobile drawer overflow with 4 tabs | Medium | Tab strip uses `overflow-x-auto no-scrollbar` with compact icon+text pills, ensuring horizontal scrollability on viewports down to 320px. |
| R-05 | State desynchronization between Drawer and In-Page workbench | Low | Both components bind to the same atomic `LabContext.jsx` state and listen to `storage` events across browser tabs. |

### 6.2 Independent Verification Methods
1. **Linter & Build**:
   ```powershell
   npm run lint
   npm run build
   ```
2. **Visual Inspection**:
   - Inspect `#playground` / `#lab`: confirm 4 tabs are present, physics canvas is absent, speedometer is gone.
   - Inspect Quick Drawer: confirm 4 tabs are present and mirror in-page controls.
3. **Functional Verification**:
   - Audio Studio: Master sound toggle mutes audio, volume slider alters loudness, preview buttons play sounds.
   - Cursor & Dynamics: Toggling "Custom Cursor" off reverts to native pointer; scale slider resizes cursor; color swatches change trail.
   - Hero Control: Pose buttons immediately snap character gaze; scale slider zooms character; flash/confetti toggle controls photo flash.
   - Startup & Preferences: Role selection switches default role; reset button restores defaults.
   - Persistence: Changing any setting, refreshing browser (`F5`), and verifying values persist in `localStorage` under `portfolio_control_center`.
