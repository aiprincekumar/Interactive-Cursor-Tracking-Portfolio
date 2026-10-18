# Handoff Report: Explorer 1 (explorer_cc_1)

**Milestone:** Milestone 1 (Survey & UI Architecture)  
**Task:** Survey UI Layout, Tab Architecture, and Sandbox Cleanup across `InteractivePlayground.jsx`, `LabStudioDrawer.jsx`, and `PhysicsSandbox.jsx`  
**Agent:** Explorer 1 (`explorer_cc_1`)  
**Status:** Complete (Hard Handoff)  
**Date:** 2026-10-18  

---

## 1. Observation

1. **`src/components/PhysicsSandbox.jsx` (Lines 1-722)**:
   - Full 2D canvas simulation containing:
     - `ORB_CONFIGS` (lines 6-14): 7 elastic physics orbs (`Coral Rose`, `Cyan Laser`, `Solar Gold`, `Matrix Emerald`, `Cyber Purple`, `Ruby Crimson`, `Sky Blue`).
     - Physics simulation loop (lines 304-457): gravity integration, cursor repulsion, wall collisions with restitution (`e=0.85`), pairwise elastic collisions with mass conservation.
     - Telemetry HUD with direct DOM mutation refs (lines 36-40, lines 624-658): `speedTextRef` (`0 px/s`), `coordsTextRef` (`X: ..., Y: ...`), `fpsTextRef` (`60 FPS`), and `speedBarRef`.
     - Interactive controls toolbar (lines 663-718): `Particle Burst` button (`triggerParticleBurst`), `Zero-G Drift` toggle (`toggleZeroG`), `Reset Orbs` button (`resetOrbs`).
2. **`src/components/InteractivePlayground.jsx` (Lines 1-660)**:
   - Line 23: `import PhysicsSandbox from './PhysicsSandbox';`
   - Lines 25-54: `PRESET_CARDS` hardcoding 4 arcade gaming presets (`Cyberpunk Zero-G`, `Retro Arcade`, `Zen Minimalist`, `Hyper Velocity`).
   - Lines 208-272: Left pane currently dedicated to mounting `<PhysicsSandbox gravity={gravity} particleColor={particleColor} soundEnabled={soundEnabled} />` and camera gaze buttons (`POSE_BUTTONS`).
   - Lines 274-654: Right pane currently rendering Presets, Scale, Lerp Speed, Butterfly Wing Dynamics, Trail Toggle, Gravity Slider, Color Picker, Master Volume, Pitch Slider, and 7-Sound Soundboard in an un-tabbed vertical stack.
   - The in-page workbench has **zero tab architecture** at present.
3. **`src/components/LabStudioDrawer.jsx` (Lines 1-657)**:
   - Lines 25-58: `PRESET_CARDS` hardcoded.
   - Lines 266-637: Single vertical scrolling pane with 5 stacked sections: Section A (1-Click Presets), Section B (Cursor Kinematics), Section C (Gravity & Colors), Section D (Web Audio), Section E (7-Sound Soundboard).
   - The drawer has **zero tab architecture** at present.
4. **Codebase-Wide Grep for Physics References**:
   - `grep_search "PhysicsSandbox"` returned exactly two occurrences in source code: `src/components/PhysicsSandbox.jsx:25` and `src/components/InteractivePlayground.jsx:23, 226`.
   - `grep_search "speedometer"` returned one occurrence: `src/components/PhysicsSandbox.jsx:625`.
   - `grep_search "Particle Burst"` returned one UI button occurrence: `src/components/PhysicsSandbox.jsx:664-672`.
   - `grep_search "cyberpunk"` returned occurrences only in `LabContext.jsx:37`, `InteractivePlayground.jsx:27`, and `LabStudioDrawer.jsx:27`.
5. **Project Baseline Verification**:
   - `npm run lint` exited with code 0 (`Found 0 warnings and 0 errors. Finished in 93ms on 83 files`).
   - `npm run build` exited with code 0 (`built in 723ms`).

---

## 2. Logic Chain

1. **Step 1 (Observation 1, 4)**: Because `PhysicsSandbox.jsx` is exclusively imported in `InteractivePlayground.jsx`, deleting `PhysicsSandbox.jsx` and removing its import and JSX usage from `InteractivePlayground.jsx` completely eliminates the 2D canvas, elastic bouncing balls, gravity trampoline, telemetry HUD, px/s speedometer, and particle burst trigger with zero breaking changes to other components.
2. **Step 2 (Observation 2, 3)**: Both `InteractivePlayground.jsx` and `LabStudioDrawer.jsx` currently lack any tabbed layout. The user request (R2) mandates an identical, theme-matched 4-tab layout across both surfaces:
   - Tab 1: 🔊 Audio Studio (Master sound toggle, volume slider, pitch slider, Sound Matching Mode toggle: Dynamic vs. Universal Voice, 7 preview buttons).
   - Tab 2: ✨ Cursor & Dynamics (Custom cursor toggle on/off, global scale slider, flight lerp speed buttons, stardust trail toggle & color swatches).
   - Tab 3: 👤 Hero & Character Control (Gaze tracking mode: Auto vs. Static, 10 head pose override buttons, character zoom slider, camera flash & confetti toggle).
   - Tab 4: ⚙️ Startup & Preferences (Startup role track selector, startup cursor state, startup audio state, reduced motion toggle, 1-click factory reset).
3. **Step 3 (Observation 2, 3, 5)**: Implementing this 4-tab structure with WAI-ARIA semantics (`role="tablist"`, `role="tab"`, `role="tabpanel"`) and shared styling (`bg-[#FAF8F5]/90 dark:bg-[#120D1D]/90`, warm coral accent `#FF4D6D`) will replace the cluttered 2-pane layout and vertical drawer stream with a clean, unified, executive Control Center.
4. **Step 4 (Observation 4)**: Presets like *Cyberpunk Zero-G* and *Retro Arcade* are toy arcade presets that belong to the discarded physics simulation. Removing them and refocusing Tab 4 on real portfolio preferences (Startup role, default audio/cursor states, factory reset) fulfills R1 and R2.4.

---

## 3. Caveats

1. **Legacy Test Script**: `scripts/test_physics_telemetry_simulation.mjs` was an empirical test script created in a prior milestone specifically testing `PhysicsSandbox.jsx`. Once `PhysicsSandbox.jsx` is deleted, running that specific script directly will fail unless it is updated or archived. The primary verification commands (`npm run lint` and `npm run build`) are completely unaffected.
2. **Custom Cursor Disabled Behavior**: When custom cursor is disabled via Tab 2, `HeroSection.jsx` must not unconditionally add `cursor-none`. A check for `customCursorEnabled` must be included in `HeroSection.jsx` line 657 so that the native cursor is visible everywhere.
3. **No Code Edits Performed**: As an Explorer agent, no source files were modified. All proposals are documented in `report.md` for Implementer agents in Milestone 2.

---

## 4. Conclusion

The technical survey and UI architecture design for the Portfolio Control Center are complete.
- `src/components/PhysicsSandbox.jsx` can be safely removed, with its import cleanly excised from `InteractivePlayground.jsx`.
- Both `InteractivePlayground.jsx` and `LabStudioDrawer.jsx` should be refactored into an identical 4-tab layout (Audio Studio, Cursor & Dynamics, Hero & Character Control, Startup & Preferences).
- Central state in `src/context/LabContext.jsx` should be updated with new reactive parameters (`portfolio_control_center` storage key, `customCursorEnabled`, `soundMatchingMode`, `gazeTrackingMode`, `heroPoseOverride`, `heroScale`, `cameraFlashConfettiEnabled`, `startupRole`, `startupCursorEnabled`, `startupAudioEnabled`).
- All specifications, mockups, tab definitions, and file diff recommendations are documented in `report.md`.

---

## 5. Verification Method

1. **Verify Static Code Quality**:
   ```powershell
   npm run lint
   ```
   *Expected output*: 0 errors, 0 warnings.
2. **Verify Production Build**:
   ```powershell
   npm run build
   ```
   *Expected output*: Vite build completes with code 0.
3. **Verify Removal of Physics Artifacts**:
   ```powershell
   # Confirm PhysicsSandbox is no longer referenced in src/
   npx ripgrep "PhysicsSandbox" src/
   ```
   *Expected output*: No matches found.
4. **Verify Tab Semantics & Structure**:
   - Inspect `InteractivePlayground.jsx`: Check for `role="tablist"` and 4 tabs with IDs `audio`, `cursor`, `hero`, `startup`.
   - Inspect `LabStudioDrawer.jsx`: Check for identical 4 tabs and state synchronization.
   - Invalidation conditions: Any syntax errors, unresolved imports, or broken build.
