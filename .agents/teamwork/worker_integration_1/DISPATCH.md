# Task Assignment: Worker D (Lab Studio Integration, Drawer, Modernized In-Page Section & Global Wiring)

- Working Directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_integration_1
- Parent Orchestrator: 54634b41-b142-4755-aa5c-daaf424b3ab0
- Original Request: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md
- Blueprints:
  * Explorer 1 (Arena & Telemetry): c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_1\handoff.md
  * Explorer 2 (Audio & Soundboard): c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_2\handoff.md
  * Explorer 3 (Cursor Scale & Drawer): c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_3\handoff.md
  * Worker A (Audio Methods): c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_audio_1\handoff.md
  * Worker B (Lab Context): c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_context_1\handoff.md
  * Worker C (Physics Sandbox): c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_physics_1\handoff.md

Mandatory Integrity Warning:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Detailed Tasks:
1. Integrate `LabProvider` into `src/main.jsx` (wrapping `<App />` inside `<ThemeProvider>` and `<RoleProvider>`).
2. Integrate `LabContext` state into `src/App.jsx`:
   - Consume `useLab()`: `cursorScale`, `flightSpeed`, `wingDynamics`, `gravity`, `trailEnabled`, `particleColor`, `soundEnabled`, `masterVolume`, `audioPitch`, `activePreset`, etc.
   - Pass `scale={cursorScale}`, `speed={flightSpeed}`, `wingDynamics={wingDynamics}`, `gravity={gravity}`, `trailEnabled={trailEnabled}`, `particleColor={particleColor}` to `DynamicCursorManager`.
   - Render `<LabStudioDrawer />` so the Quick Studio Drawer is accessible globally across all sections.
3. Update `src/components/ButterflyCursor.jsx`:
   - Accept `wingDynamics` prop and dynamically scale wing flap frequency (`targetFlutter = baseFlutter / Math.max(0.2, wingDynamicsRef.current || 1.0)`).
4. Create `src/components/LabStudioDrawer.jsx`:
   - Persistent FAB button with `FlaskConical` icon at `fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40` with pulse ping, accessible label, and toggle handler.
   - Slide-out Quick Drawer at `fixed top-0 right-0 h-full w-[360px] sm:w-[420px] max-w-[92vw] z-[48]` with backdrop at `z-[47]`.
   - Zero layout shift: Drawer uses CSS `translate-x` transforms so page layout never shifts.
   - Drawer contents:
     * Header with close button, title, and "Reset Defaults" action.
     * 1-Click Presets (*Cyberpunk Zero-G*, *Retro Arcade*, *Zen Minimalist*, *Hyper Velocity*).
     * Cursor Tuning: Scale slider (0.5x to 2.0x), Flight lerp speed, Wing flap dynamics, Stardust trail switch.
     * Gravity & Particle Tuning: Gravity slider (-60 to +140 px/s²), Particle color palette customizer (preset colors + hex input).
     * Web Audio Synthesizer: Master volume slider (0% to 100%), Pitch multiplier slider (0.5x to 2.0x), Audio toggle switch.
     * 7-Sound Synthesizer Soundboard: Polaroid Shutter, Cosmic Sparkle, Bubble Pop, Laser Focus, Crystal Chime, Ribbon Sweep, Haptic Click.
5. Modernize `src/components/InteractivePlayground.jsx`:
   - Modern glassmorphism workbench layout.
   - Dual anchor support: `<section id="playground" className="relative ..."><span id="lab" className="scroll-mt-28" />...`.
   - Workbench split layout:
     * Left pane: Embeds `<PhysicsSandbox />` with Live Telemetry HUD (speedometer in px/s, pointer coordinates, FPS counter), Particle Burst button, and Zero-G toggle.
     * Right pane: Modular tuning controls suite, 1-click presets, and 7-sound soundboard.
6. Connect Navigation & Command Palette:
   - `src/components/Navbar.jsx` & `src/components/ExploreSubBar.jsx`: Ensure explore links point to `#playground` / `#lab` and can open the drawer.
   - `src/utils/searchCatalog.js` & `src/components/CommandPalette.jsx`: Add `act-lab-drawer` command to open Quick Lab Studio Drawer (`Cmd+K`).
7. Quality Verification:
   - Run `npx oxlint` to ensure 0 lint errors.
   - Run `npm run build` to verify production bundle compiles cleanly.
8. Write comprehensive handoff to `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_integration_1\handoff.md` and call send_message to notify orchestrator.
