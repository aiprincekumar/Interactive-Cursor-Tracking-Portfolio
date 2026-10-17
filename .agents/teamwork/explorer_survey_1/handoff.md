# Explorer 1 Survey & Architectural Specification: Interactive Playground & In-Page Lab Studio

## 1. Observation

### 1.1 Existing Target Files & Code Architecture
We examined the relevant codebase files and runtime hooks:
1. `src/components/InteractivePlayground.jsx` (468 lines)
   - Mounted at line 202 in `src/App.jsx` with section anchor `<section id="playground">` (line 26).
   - Currently rendered as a 3-column static grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`) containing 9 small parameter cards:
     1. Flight Lerp Speed (Dreamy 0.07, Natural 0.14, Snappy 0.25)
     2. Camera Pose Override (Auto, Idle, Center, Left, Right, Up-Center, Down-Center, Up-Left, Down-Left, Up-Right, Down-Right)
     3. Butterfly Scale Slider (currently limited to 0.7x - 1.5x, step 0.05)
     4. Stardust Trail Switch (`trailEnabled`)
     5. Audio Shutter Switch (`soundEnabled`)
     6. Reduced Motion Switch (`reducedMotion`)
     7. Particle Hue Customizer (Cyberpunk, Neon Cyan, Solar Gold, Matrix Emerald + native color picker)
     8. Gravity Field Slider (-60 to +140 px/s²) with 3 presets (-30 Anti-G, 0 Zero-G, +75 Earth)
     9. Audio Frequency & Pitch Slider (0.5x to 2.0x) with single test tone button.
   - **Crucial Observation:** The current playground lacks an embedded visual testing arena. When users adjust sliders, they must look around the page or move the cursor outside the component to observe physical changes. There is no in-situ 2D physics simulation, no elastic orbs, no telemetry speedometer or FPS counter, no soundboard, and no 1-click presets.

2. `src/App.jsx` (233 lines)
   - Manages state variables individually via `useState`:
     - `soundEnabled` (default: `true`)
     - `butterflySpeed` (default: `0.14`)
     - `trailEnabled` (default: `true`)
     - `butterflyScale` (default: `1`)
     - `forcedState` (default: `null`)
     - `reducedMotion` (default: media query or `false`)
     - `particleColor` (default: `'#FF4D6D'`, synced to `localStorage.getItem('physics_particle_color')`)
     - `gravity` (default: `0`, synced to `localStorage.getItem('physics_gravity')`)
     - `audioPitch` (default: `1.0`, synced to `localStorage.getItem('physics_audio_pitch')`)
     - `activeCursor` (default: `'butterfly'`, synced to `localStorage.getItem('active_cursor_variant')`)
   - Passes all 10 props directly into `DynamicCursorManager` (lines 142-154) and `InteractivePlayground` (lines 202-221).
   - Props are currently drilled manually, and persistence is fragmented across separate `localStorage` keys rather than a unified configuration schema.

3. `src/components/DynamicCursorManager.jsx` & Kinematic Engines
   - `DynamicCursorManager.jsx` passes `speed`, `trailEnabled`, `scale`, `gravity`, and `particleColor` to both dedicated cursors (`ButterflyCursor`, etc.) and `ModularKinematicCursor`.
   - `ButterflyCursor.jsx` (lines 273-283) applies `scaleRef.current` directly to the 3D CSS transform:
     `b.style.transform = \`translate3d(${posX}px, ${posY}px, 0) rotate(${rotZ}deg) rotateY(${rollY}deg) scale(${scaleRef.current || 1})\`;`
   - `ModularKinematicCursor.jsx` (lines 311-318) also applies `scaleRef.current` to all 35 cursor styles.
   - The cursor scale slider range in `InteractivePlayground` (currently 0.7x - 1.5x) should be expanded to **0.5x - 2.0x** to satisfy Requirement R3.

4. `src/utils/audio.js` (294 lines)
   - Implements zero-latency Web Audio API synthesis without external audio files.
   - Existing synthesis methods:
     - `playShutter()` — Camera shutter mechanical snap & spring rewind.
     - `playFocusBeep()` — 1400 Hz focus pip.
     - `playSparkle()` — 4-tone celestial ascending arpeggio (1046, 1318, 1567, 2093 Hz).
     - `playPop()` — Bubble pop pitch-ramp tone (440 -> 880 Hz).
     - `playRibbonToggle(isOpen)` — Pitch chirp up/down.
     - `playCursorSelect()` — Resonant 2-tone chime (587.33, 880 Hz).
     - `playChipHover()` — 1760 Hz high micro pip.
     - `setPitchMultiplier(mult)` — Modulates frequency between 0.5x and 2.5x.
     - `setEnabled(state)` — Mutes/unmutes via `masterGain`.
   - Missing capabilities required by R3:
     - Master volume slider ($0\% - 100\%$) controlling `masterGain.gain.setValueAtTime(volume)`.
     - Explicit 7-sound soundboard methods corresponding to:
       1. Polaroid Shutter
       2. Cosmic Sparkle
       3. Bubble Pop
       4. Laser Focus
       5. Crystal Chime
       6. Ribbon Sweep
       7. Haptic Click

5. Navigation & Explore Integrations
   - `src/components/Navbar.jsx` (line 196) and `src/components/ExploreSubBar.jsx` (lines 23-28) link to `#playground` with label `"Lab"` / `"Interactive Playground"`.
   - `src/utils/searchCatalog.js` (lines 69, 187) indexes `act-cursor-playground` and `sec-playground` targeting anchor `#playground`.
   - `src/components/CommandPalette.jsx` (line 88) displays the `Sliders` icon when matching `#playground`.

---

## 2. Logic Chain

### 2.1 Studio Layout Modernization: The Glassmorphism Lab Workbench
To transform the section from an ordinary settings list into an authentic **Hybrid Experimentation & Customization Studio**, the layout should adopt a dual-pane workbench architecture:

```
+---------------------------------------------------------------------------------------------------+
|  [Flask Icon] PHYSICS & SENSORY LAB STUDIO  --  LIVE HYBRID WORKBENCH                             |
|  Interactive Physics & Kinematics Lab                                                             |
|  "Simulate 2D particle dynamics, tune real-time cursor kinematics, and synthesize audio feedback"|
|                                                                                                   |
|  [1-Click Presets: Cyberpunk Zero-G | Retro Arcade | Zen Minimalist | Hyper Velocity]   [Reset]   |
+---------------------------------------------------------------------------------------------------+
|                                                 |                                                 |
|  LEFT COLUMN: 2D PHYSICS SANDBOX ARENA          |  RIGHT COLUMN: MODULAR TUNING PANES             |
|  (Interactive Canvas Arena - 60% Width)         |  (Accordion / Tabbed Controls - 40% Width)     |
|                                                 |                                                 |
|  +-------------------------------------------+  |  [ TAB / SECTION 1: CURSOR KINEMATICS ]        |
|  | [HUD] 248 px/s | X: 412, Y: 185 | 60 FPS  |  |  - Global Cursor Scale (0.5x - 2.0x)            |
|  |                                           |  |  - Flight Lerp (Dreamy / Natural / Snappy)      |
|  |    (Orb 1)           (Orb 2)              |  |  - Stardust Trail Particle Switch               |
|  |            *Cursor*                       |  |                                                 |
|  |     (Orb 3)          (Orb 4)              |  |  [ TAB / SECTION 2: GRAVITY & FORCES ]          |
|  |               (Orb 5)                     |  |  - Gravity Slider (-60 to +140 px/s²)          |
|  |                                           |  |  - Particle Hue Customizer (Presets + Hex)      |
|  +-------------------------------------------+  |                                                 |
|  | [Particle Burst]  [Zero-G Drift Toggle]   |  |  [ TAB / SECTION 3: WEB AUDIO SYNTHESIZER ]     |
|  +-------------------------------------------+  |  - Master Volume Slider (0% - 100%)             |
|                                                 |  - Pitch Multiplier Slider (0.5x - 2.0x)        |
|                                                 |  - 7-Sound Synthesizer Soundboard Grid:         |
|                                                 |    [Shutter] [Sparkle] [Bubble] [Laser]         |
|                                                 |    [Chime]   [Sweep]   [Haptic]                 |
+---------------------------------------------------------------------------------------------------+
```

#### Glassmorphism Visual Design Tokens:
- **Container**: `bg-white/70 dark:bg-[#120D1D]/75 backdrop-blur-xl border border-[#E7E2D8]/80 dark:border-[#2D2340] shadow-2xl rounded-3xl p-6 md:p-8`
- **Sub-Panels & Cards**: `bg-[#FAF8F5]/80 dark:bg-[#1A1428]/80 backdrop-blur-md border border-[#ECE7DF] dark:border-[#2D2340] rounded-2xl p-5 shadow-xs`
- **Arena Stage**: `relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#FAF8F5] to-[#F3EEE7] dark:from-[#0E0A17] dark:to-[#161122] border border-stone-200 dark:border-stone-800 shadow-inner`
- **Telemetry HUD Overlay**: `bg-stone-900/85 dark:bg-black/75 backdrop-blur-md border border-white/10 text-white rounded-xl px-3 py-1.5 font-mono text-xs shadow-lg`

---

### 2.2 Dedicated 2D Physics Sandbox Arena Engine Design
The arena must be implemented as a dedicated React component (`PhysicsSandbox.jsx`) utilizing an HTML5 Canvas with High-DPI support (`devicePixelRatio` capped at 2x) and a responsive `ResizeObserver`.

#### 1. Entity Specifications (5 to 8 Elastic Orbs):
- **Orb Count**: 7 distinct elastic orbs with staggered radiuses ($r \in [18, 32]\text{px}$) and masses proportional to area ($m \propto r$).
- **Visual Styling**: Radiant radial gradient fills (`ctx.createRadialGradient`) matching neon accent colors:
  1. Orb 1: `#FF4D6D` (Neon Coral / Rose)
  2. Orb 2: `#00F2FE` (Cyan Laser)
  3. Orb 3: `#FFD700` (Solar Gold)
  4. Orb 4: `#10B981` (Matrix Emerald)
  5. Orb 5: `#A855F7` (Cyber Purple)
  6. Orb 6: `#F43F5E` (Ruby Crimson)
  7. Orb 7: `#38BDF8` (Sky Blue)
  Each orb has an inner specular highlight and a subtle glow drop-shadow.

#### 2. Physics & Kinematics Equations:
- **Delta-Time Normalization**:
  $$\Delta t = \min\left(\frac{t_{now} - t_{last}}{1000}, 0.05\right)$$
- **Gravity Force**:
  $$v_y \leftarrow v_y + g_{eff} \cdot \Delta t$$
  Where $g_{eff} = 0$ if Zero-G mode is toggled ON; otherwise $g_{eff} = \text{gravity}$ ($-60$ to $+140\text{ px/s}^2$).
- **Velocity Damping (Viscous Drag)**:
  $$v_x \leftarrow v_x \cdot (1 - 0.018 \cdot 60 \cdot \Delta t), \quad v_y \leftarrow v_y \cdot (1 - 0.018 \cdot 60 \cdot \Delta t)$$
- **Wall Bouncing (Restitution)**:
  Coefficient of restitution $e_{wall} = 0.85$.
  - Left: $x - r < 0 \implies x = r, \; v_x = -v_x \cdot e_{wall}$
  - Right: $x + r > W \implies x = W - r, \; v_x = -v_x \cdot e_{wall}$
  - Top: $y - r < 0 \implies y = r, \; v_y = -v_y \cdot e_{wall}$
  - Bottom: $y + r > H \implies y = H - r, \; v_y = -v_y \cdot e_{wall}$
- **Orb-to-Orb Elastic Collisions**:
  For every pair $(A, B)$ at distance $d = \sqrt{\Delta x^2 + \Delta y^2} < (r_A + r_B)$:
  - Normal vector: $\vec{n} = (\Delta x / d, \Delta y / d)$
  - Overlap separation: push each orb back by $(r_A + r_B - d) / 2$ along $\vec{n}$.
  - Relative normal velocity: $v_{rel} = (\vec{v}_A - \vec{v}_B) \cdot \vec{n}$
  - If $v_{rel} < 0$:
    $$J = \frac{-(1 + e) \cdot v_{rel}}{\frac{1}{m_A} + \frac{1}{m_B}}, \quad \vec{v}_A \leftarrow \vec{v}_A + \frac{J}{m_A}\vec{n}, \quad \vec{v}_B \leftarrow \vec{v}_B - \frac{J}{m_B}\vec{n}$$
- **Cursor Repulsion & Kinetic Push**:
  When cursor coordinates $(cx, cy)$ are inside the arena bounds:
  - Cursor velocity: $\vec{v}_{cur} = (cx - cx_{last}) / \Delta t, (cy - cy_{last}) / \Delta t$
  - Interaction radius: $R_{int} = r_{orb} + 65\text{px}$
  - Distance to orb: $d = \text{hypot}(orb.x - cx, orb.y - cy)$
  - If $d < R_{int}$:
    - Repulsion force: $F_{repel} = \frac{R_{int} - d}{R_{int}} \cdot 750\text{ px/s}^2$
    - Kinetic impulse transfer: $0.35 \cdot \vec{v}_{cur}$
    - Apply acceleration to orb:
      $$orb.v_x \leftarrow orb.v_x + \left(\frac{orb.x - cx}{d} \cdot F_{repel} + v_{cur, x} \cdot 0.35\right) \cdot \Delta t$$
      $$orb.v_y \leftarrow orb.v_y + \left(\frac{orb.y - cy}{d} \cdot F_{repel} + v_{cur, y} \cdot 0.35\right) \cdot \Delta t$$
- **Particle Burst Trigger**:
  Spawns 35-50 micro-sparks radiating from pointer (or arena center if pointer is inactive). Gives an explosive outward impulse $J_{burst} = 250 / (d + 20)$ to all orbs, while emitting decaying diamond particles in canvas lighter composite mode.
- **Zero-G Toggle**:
  Flips local gravity to $0\text{ px/s}^2$ with a gentle floating sinusoidal drift ($x \mathrel{+}= \sin(\text{time}) \cdot 0.3$), giving an authentic astronaut orbital float sensation.

---

### 2.3 Live Telemetry HUD Design & Zero-Cost React Update Mechanism

#### The Critical Performance Pitfall:
If telemetry state ($v$, $X, Y$, $FPS$) is stored in standard React `useState` hooks and updated every animation frame (60 to 120 times/sec), React will schedule 60-120 full component re-renders per second. This causes significant DOM layout thrashing, CPU spikes, and severe frame-rate drops.

#### The Optimal Low-Overhead Solution (Direct Ref DOM Mutation):
1. **Direct DOM Element References**:
   The telemetry HUD components are mounted once into the DOM with persistent `useRef` handles:
   ```jsx
   <div className="telemetry-hud absolute top-3 left-3 flex items-center gap-2 pointer-events-none z-20">
     <div className="bg-stone-900/90 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-3 text-xs font-mono">
       <span className="flex items-center gap-1.5 text-[#00F2FE]">
         <Gauge className="w-3.5 h-3.5" />
         <span ref={speedTextRef}>0</span> px/s
       </span>
       <span className="text-stone-400">|</span>
       <span className="flex items-center gap-1.5 text-stone-300">
         <Crosshair className="w-3.5 h-3.5 text-[#FF4D6D]" />
         <span ref={coordsTextRef}>X: 0, Y: 0</span>
       </span>
       <span className="text-stone-400">|</span>
       <span className="flex items-center gap-1.5 text-emerald-400">
         <Activity className="w-3.5 h-3.5" />
         <span ref={fpsTextRef}>60</span> FPS
       </span>
     </div>
   </div>
   ```
2. **High-Speed RAF Direct Mutation Loop**:
   Inside the physics `requestAnimationFrame` loop in `PhysicsSandbox.jsx`:
   - Cursor velocity is computed from instantaneous pointer displacement:
     $$v_{raw} = \frac{\sqrt{\Delta x^2 + \Delta y^2}}{\Delta t}$$
     $$v_{smooth} \leftarrow v_{smooth} + (v_{raw} - v_{smooth}) \cdot 0.25$$
   - FPS is calculated from rolling delta times over a 20-frame window.
   - Text updates are throttled to 12-15 Hz (every ~70ms) to ensure optimal legibility and zero layout thrashing:
     ```javascript
     if (now - lastHudUpdate > 65) {
       if (speedTextRef.current) speedTextRef.current.textContent = Math.round(vSmooth);
       if (coordsTextRef.current) coordsTextRef.current.textContent = `X: ${Math.round(pointerX)}, Y: ${Math.round(pointerY)}`;
       if (fpsTextRef.current) fpsTextRef.current.textContent = Math.round(fps);
       lastHudUpdate = now;
     }
     ```
3. **Speedometer Visual Bar / Circular Gauge**:
   A micro dynamic bar or radial arc updated via `transform: scaleX(...)` or `strokeDashoffset` provides instantaneous visual feedback of cursor acceleration.

---

### 2.4 Comprehensive Customization Controls Suite & Audio Soundboard

#### 1. Cursor Tuning Suite:
- **Global Scale Slider**: Range `0.5x` to `2.0x` (step `0.05x`, default `1.0x`). Subscribed directly by `ButterflyCursor` and `ModularKinematicCursor`.
- **Flight Lerp Presets**: Dreamy (`0.07`), Natural (`0.14`), Snappy (`0.25`).
- **Stardust Trail**: Boolean toggle enabling 120 FPS additive particle emitter.

#### 2. Gravity & Physics Suite:
- **Gravity Slider**: Range `-60 px/s²` (Anti-G) to `+140 px/s²` (Heavy Earth).
- **Particle Hue**: 4 Quick pills (Cyberpunk `#FF4D6D`, Neon Cyan `#00F2FE`, Solar Gold `#FFD700`, Matrix Emerald `#10B981`) + native HTML5 color picker.

#### 3. Web Audio Synthesizer Suite & 7-Sound Soundboard:
- **Master Volume**: `0%` to `100%` slider (step `5%`, default `80%`).
- **Pitch Multiplier**: `0.5x` (Deep Bass) to `2.0x` (Crystal), step `0.05x`.
- **Soundboard Grid (7 Synthesized Effects)**:
  | Sound Name | Key Audio Profile | Synthesis Implementation in `audio.js` |
  |---|---|---|
  | **Polaroid Shutter** | Snappy mechanical curtain snap + spring rewind | `soundFX.playShutter()` |
  | **Cosmic Sparkle** | 4-tone celestial ascending arpeggio | `soundFX.playSparkle()` |
  | **Bubble Pop** | Fast rubbery pitch envelope (440 -> 880 Hz) | `soundFX.playPop()` |
  | **Laser Focus** | High-energy swept sine chirp (1400 -> 2800 Hz) | `soundFX.playLaserFocus()` |
  | **Crystal Chime** | Dual resonant high harmonic bells (1760 + 2640 Hz) | `soundFX.playCrystalChime()` |
  | **Ribbon Sweep** | Modulated upward frequency sweep (320 -> 720 Hz) | `soundFX.playRibbonToggle(true)` |
  | **Haptic Click** | Ultra-short tactile micro-transient (6ms impulse) | `soundFX.playHapticClick()` |

---

### 2.5 Curated 1-Click Presets & State Persistence

#### 4 Preset Recipes:
1. **Cyberpunk Zero-G**:
   - `cursorScale`: `1.2`
   - `flightSpeed`: `0.25` (Snappy)
   - `gravity`: `-25` (Anti-Gravity Float)
   - `particleColor`: `'#00F2FE'` (Neon Cyan)
   - `masterVolume`: `0.85`
   - `audioPitch`: `1.35`
   - `activePreset`: `'cyberpunk'`
2. **Retro Arcade**:
   - `cursorScale`: `1.15`
   - `flightSpeed`: `0.20`
   - `gravity`: `95` (Bouncy Earth)
   - `particleColor`: `'#FFD700'` (Solar Gold)
   - `masterVolume`: `0.9`
   - `audioPitch`: `0.8` (8-bit Bass)
   - `activePreset`: `'arcade'`
3. **Zen Minimalist**:
   - `cursorScale`: `0.85`
   - `flightSpeed`: `0.07` (Dreamy)
   - `gravity`: `0` (Zero-G Drift)
   - `particleColor`: `'#10B981'` (Matrix Emerald)
   - `masterVolume`: `0.6`
   - `audioPitch`: `1.0` (Natural)
   - `activePreset`: `'zen'`
4. **Hyper Velocity**:
   - `cursorScale`: `1.35`
   - `flightSpeed`: `0.28` (Ultra Snappy)
   - `gravity`: `45`
   - `particleColor`: `'#FF4D6D'` (High Voltage Pink)
   - `masterVolume`: `1.0`
   - `audioPitch`: `1.75` (Crystal)
   - `activePreset`: `'hyper'`

#### Persistence Schema under `portfolio_lab_config`:
```json
{
  "cursorScale": 1.0,
  "flightSpeed": 0.14,
  "trailEnabled": true,
  "gravity": 0,
  "particleColor": "#FF4D6D",
  "soundEnabled": true,
  "masterVolume": 0.8,
  "audioPitch": 1.0,
  "activePreset": "natural"
}
```
All updates write synchronously to `localStorage['portfolio_lab_config']` and fire custom events (`portfolio:lab-config-updated`) to synchronize the in-page studio and the floating drawer.

---

### 2.6 Dual-Surface Access & Quick Studio Drawer
- **Persistent Floating Action Button (FAB)**:
  - Fixed at `bottom-6 right-6` (or `bottom-20 right-6` to avoid overlapping mobile dock).
  - Flask icon with subtle pulse ring: `bg-gradient-to-r from-[#FF4D6D] to-[#E03554] text-white shadow-xl hover:scale-105 active:scale-95 transition-all`.
  - Accessible label: `aria-label="Open Quick Lab Studio Drawer"`.
- **Slide-out Drawer (`LabStudioDrawer.jsx`)**:
  - Compact right-side drawer (`w-full sm:w-96 fixed top-0 right-0 h-full z-50 bg-white/95 dark:bg-[#120D1D]/95 backdrop-blur-2xl shadow-2xl border-l border-stone-200 dark:border-stone-800 p-6 overflow-y-auto`).
  - Contains full tuning controls, preset pills, and soundboard buttons so visitors can adjust physics and observe active cursor changes anywhere on the portfolio without scrolling.
  - Backdrop click and `Escape` key support to close smoothly.

---

## 3. Caveats

1. **Touch / Mobile Devices Pointer Behavior**:
   - Dynamic custom cursors (Butterfly, etc.) are intentionally disabled on mobile touch devices via `useDesktopCursorSupport` to respect native scrolling and tap UX.
   - However, the 2D Physics Sandbox Arena **must support touch events** (`pointerdown`, `pointermove`, `pointerup`, `touchmove`) inside its canvas element. Mobile users can touch and drag inside the arena to fling and push the orbs, with touch coordinate offsets mapped relative to the canvas bounding rect (`getBoundingClientRect()`).
2. **Canvas High-DPI Display Scaling**:
   - Device pixel ratios above 2 (such as 3x on high-end mobile phones) can cause GPU fill-rate exhaustion. We explicitly cap scaling to `dpr = Math.min(window.devicePixelRatio || 1, 2)` and scale canvas context (`ctx.scale(dpr, dpr)`).
3. **Audio Autoplay & Web Audio Context Suspended State**:
   - Modern browsers block unprompted Web Audio synthesis until a user gesture occurs. `audio.js` has silent resume logic (`this.ctx.resume()`), but triggering any soundboard button or preset must invoke `soundFX.init()` and resume if suspended.
4. **Anchor Compatibility**:
   - Both `#playground` and `#lab` must be supported. The wrapper section should retain `id="playground"` while also adding `id="lab"` (or a nested `<span id="lab" className="scroll-mt-28" />`) so any incoming link to either identifier lands smoothly at the studio.

---

## 4. Conclusion

The modernized Lab Studio architecture delivers a world-class hybrid experimentation workbench:
1. **Interactive Physics Sandbox Arena (`PhysicsSandbox.jsx`)**: An elastic 2D canvas simulation with 7 radiant orbs, gravity forces, damping, direct cursor kinetic repulsion, Particle Burst trigger, and Zero-G mode.
2. **Live Zero-Overhead Telemetry HUD**: Direct-ref DOM text mutations delivering real-time speedometer ($px/s$), pointer coordinates, and FPS tracking with **0 React re-renders per frame**.
3. **Glassmorphism Workbench Layout (`InteractivePlayground.jsx`)**: Dual-pane layout separating the interactive arena from modular tuning accordions/cards.
4. **Comprehensive Tuning Suite & 7-Sound Soundboard**: Global cursor scale ($0.5x - 2.0x$), flight speed, gravity, particle color picker, master volume ($0-100\%$), pitch multiplier, and 7 synthesized acoustic feedback triggers.
5. **1-Click Presets & Persistence**: 4 curated presets (*Cyberpunk Zero-G*, *Retro Arcade*, *Zen Minimalist*, *Hyper Velocity*) auto-persisted to `localStorage['portfolio_lab_config']`.
6. **Quick Studio Drawer & FAB (`LabStudioDrawer.jsx`)**: Floating flask button enabling parameter tuning across any section of the portfolio.

---

## 5. Verification Method

### 5.1 Automated Quality Gates
1. **Static Linting**:
   ```powershell
   npx oxlint
   ```
   Must pass with zero syntax or unused variable errors.
2. **Production Build**:
   ```powershell
   npm run build
   ```
   Must compile cleanly with zero TypeScript/Vite bundling errors.

### 5.2 Interactive & Visual Verification
1. **Arena Orb Physics**:
   - Navigate to `#playground` / `#lab`.
   - Move pointer inside the arena; observe the nearest orbs deflecting away smoothly from the cursor.
   - Sweep cursor rapidly through the arena; observe momentum transfer pushing orbs against canvas walls with elastic rebounds.
2. **Telemetry HUD**:
   - Keep cursor still inside the sandbox: verify speedometer displays `0 px/s`.
   - Move cursor rapidly: verify speedometer spikes to $400 - 800\text{ px/s}$ without dropped frames.
   - Verify coordinate readout tracks pointer position inside the arena.
   - Verify FPS counter displays consistent $60\text{ FPS}$ (or $120\text{ FPS}$ on high-refresh monitors).
3. **Zero-G Drift & Particle Burst**:
   - Click "Zero-G Drift": verify orbs float gracefully with no downward gravity pull.
   - Click "Particle Burst": verify 35-50 micro-sparks explode outward and fling nearby orbs in all directions.
4. **Customization Controls & Global Cursor Scaling**:
   - Adjust global cursor scale slider from `1.0x` down to `0.5x` and up to `2.0x`; observe both the active butterfly and kinematic cursors scaling instantaneously.
   - Adjust master volume slider and pitch multiplier.
   - Click each of the 7 soundboard buttons (*Polaroid Shutter*, *Cosmic Sparkle*, *Bubble Pop*, *Laser Focus*, *Crystal Chime*, *Ribbon Sweep*, *Haptic Click*): verify synthesized tones play with the exact pitch and volume applied.
5. **Presets & State Persistence**:
   - Click "Cyberpunk Zero-G": verify neon cyan color, snappy flight, anti-gravity float, and high pitch apply immediately.
   - Refresh the browser: verify `localStorage['portfolio_lab_config']` restores the exact customized settings.
   - Click "Reset Defaults": verify factory defaults ($1.0x$ scale, $0.14$ lerp, $0\text{ px/s}^2$ gravity, coral color `#FF4D6D`, $1.0x$ pitch) are restored.
6. **Quick Studio Drawer**:
   - Click the floating flask FAB from any page section: verify the slide-out drawer opens smoothly without layout shift.
   - Adjust a setting in the drawer: verify it synchronizes with the in-page studio and the active cursor runtime.
