## 2026-10-17T23:58:11Z
You are Worker 1 (worker_cc_1) for Milestone 2 (Portfolio Control Center Implementation).
Your dedicated working directory is:
c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_cc_1\

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Read authoritative specifications and investigation blueprints in:
1. c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md (under section '## 2026-10-17T23:46:23Z')
2. c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\orchestrator_5\SCOPE.md
3. c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_cc_1\report.md (UI layout & tab structure)
4. c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_cc_2\report.md (State persistence & cursor dynamics)
5. c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_cc_3\report.md (Audio studio & Hero controls)

Your Implementation Scope:
1. `src/context/LabContext.jsx`:
   - Replace legacy toy physics state (`gravity`, `isZeroG`, arcade presets) with the new 4-tab schema under `portfolio_control_center` localStorage key.
   - Support backward compatibility: read `portfolio_control_center`, migrate legacy keys if present, otherwise fall back to `FACTORY_DEFAULTS`.
   - Implement 1-click `resetDefaults()` function restoring all `FACTORY_DEFAULTS`.
   - Provide setters for all 4 tabs: Audio (`soundEnabled`, `masterVolume`, `pitchMultiplier`, `soundMatchingMode`), Cursor (`customCursorEnabled`, `cursorScale`, `flightLerpSpeed`, `stardustTrailEnabled`, `particleColor`), Hero (`gazeMode`, `poseOverride`, `characterZoom`, `flashConfettiEnabled`), Preferences (`defaultStartupRole`, `defaultCursorEnabled`, `defaultAudioEnabled`, `reducedMotion`).
2. `src/utils/audio.js`:
   - Add `soundMatchingMode` ('dynamic' | 'universal') property and `setSoundMatchingMode(mode)`.
   - In `playCursorSelect(cursorId)`: if `soundMatchingMode === 'universal'`, play crystal chime; if `'dynamic'`, play cursor-specific tone.
   - Ensure `setMasterVolume` and `setPitchMultiplier` are reactive.
3. `src/components/DynamicCursorManager.jsx`:
   - When `customCursorEnabled === false`, return `null` (unmounting cursor and canvas, cancelling rAF).
   - Ensure native cursor pointer is active everywhere (e.g. toggle `.custom-cursor-disabled` on document body).
4. `src/components/HeroSection.jsx`:
   - Wire `useLab()`:
     * When `customCursorEnabled === false`, do NOT add `cursor-none` to hero container.
     * Gaze tracking: when `gazeMode === 'fixed'`, bypass dynamic gaze interpolation and pin to `poseOverride !== null ? poseOverride : 0` (or center).
     * Pose override: when `poseOverride !== null`, pass to `forcedState`.
     * Character zoom: apply `characterZoom` multiplier to character container scale.
     * Flash & confetti: when `flashConfettiEnabled === false`, suppress camera flash white overlay and confetti burst on photo capture.
5. Delete `src/components/PhysicsSandbox.jsx` cleanly (or remove all 2D canvas, orbs, speedometer, particle burst).
6. `src/components/InteractivePlayground.jsx`:
   - Completely remove `PhysicsSandbox` import and usage, speedometer HUD, particle burst button, and arcade presets (Cyberpunk Zero-G, Arcade, Zen, Hyper).
   - Implement clean, theme-matched (Obsidian Dark / Linen Light) 4-Tab Control Center:
     * Tab 1: 🔊 Audio Studio (Master sound toggle, volume slider 0-100%, pitch slider 0.5x-2.0x [Deep Bass to Sharp Treble], sound matching mode toggle, 7 acoustic preview buttons).
     * Tab 2: ✨ Cursor & Dynamics (Custom cursor toggle on/off, global scale slider 0.5x-2.0x, flight lerp buttons [Dreamy, Natural, Snappy], stardust trail toggle, color swatches).
     * Tab 3: 👤 Hero & Character Control (Gaze tracking mode [Auto Gaze Follow / Static Fixed], 10 head pose override buttons [0-9], character zoom slider 0.5x-2.0x, camera flash & confetti toggle).
     * Tab 4: ⚙️ Startup & Preferences (Default startup role selector [Accountant, MIS Executive, Controller], default cursor state on startup, default audio state on startup, reduced motion toggle, 1-Click "Reset to Factory Defaults" button).
7. `src/components/LabStudioDrawer.jsx`:
   - Implement the identical 4-Tab Control Center layout matching `InteractivePlayground.jsx` inside the slide-out drawer.
8. If any legacy test script in `scripts/` imports `PhysicsSandbox.jsx`, update or archive it so `npm run lint` and `npm run build` succeed cleanly.
9. Verify with:
   `npm run lint` -> must pass with 0 errors (`oxlint`).
   `npm run build` -> must build cleanly with 0 errors.

Document all changes and test outputs in:
c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_cc_1\handoff.md
Send a completion message back to parent orchestrator when complete.
