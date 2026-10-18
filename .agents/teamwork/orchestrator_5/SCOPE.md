# Scope: Portfolio Control Center Modernization

## Objective
Transform the 'Lab' section of the Interactive Cursor-Tracking Portfolio into a clean, theme-matched (Obsidian Dark / Linen Light) all-rounder Portfolio Control Center with a structured 4-tab settings layout. Completely remove irrelevant toy/physics sandbox features (2D bouncing balls, Px/s speedometer, particle burst, arcade presets) and provide real, practical portfolio controls with localStorage persistence.

## Architecture & Code Layout
- `src/context/LabContext.jsx`:
  - Storage key: `portfolio_control_center`
  - 4-tab state schema:
    * `audio`: `soundEnabled` (bool), `masterVolume` (0.0-1.0), `pitchMultiplier` (0.5-2.0), `soundMatchingMode` ('dynamic' | 'universal')
    * `cursor`: `customCursorEnabled` (bool), `cursorScale` (0.5-2.0), `flightLerpSpeed` ('dreamy' | 'natural' | 'snappy'), `stardustTrailEnabled` (bool), `particleColor` (hex)
    * `hero`: `gazeMode` ('auto' | 'fixed'), `poseOverride` (null or 0-9), `characterZoom` (0.5-2.0), `flashConfettiEnabled` (bool)
    * `preferences`: `defaultStartupRole` ('accountant' | 'mis' | 'controller'), `defaultCursorEnabled` (bool), `defaultAudioEnabled` (bool), `reducedMotion` (bool)
  - `FACTORY_DEFAULTS` constant
  - 1-click `resetDefaults()` function restoring `FACTORY_DEFAULTS`
  - Automatic migration from legacy `portfolio_lab_config` and `lab_studio_state` keys with multi-tier fallback
- `src/utils/audio.js`:
  - Added `soundMatchingMode` property ('dynamic' | 'universal') with setter `setSoundMatchingMode(mode)`
  - Updated `playCursorSelect(cursorId)` to check `soundMatchingMode`:
    * If `'universal'`: play subtle consistent chime (`playCrystalChime()`)
    * If `'dynamic'`: play cursor-specific acoustic sound (sparkle, focus, shutter, etc.)
  - Click-free exponential gain smoothing (`setTargetAtTime`), volume and pitch clamping
- `src/components/DynamicCursorManager.jsx`:
  - When `customCursorEnabled === false`, returns `null` (cancelling rAF, unmounting canvas)
  - Toggles `.custom-cursor-disabled` on document body/html to restore native system pointer
- `src/components/HeroSection.jsx`:
  - Gaze tracking: if `gazeMode === 'fixed'`, suppresses dynamic gaze and pins to `poseOverride !== null ? poseOverride : 0` (or center)
  - Pose override: if `poseOverride !== null`, forces specific pose 0-9
  - Character zoom: applies `characterZoom` multiplier to character container scale
  - Flash & confetti: if `!flashConfettiEnabled`, suppresses white flash overlay and confetti burst on photo capture
  - Suppresses `cursor-none` when `customCursorEnabled === false`
- `src/components/ControlCenterPanel.jsx`:
  - Theme-matched (Obsidian Plum Dark `#120D1D` and Linen Light `#FAF8F5`, warm coral accent `#FF4D6D`) 4-Tab Control Center component
  - Reusable across `workbench` and `drawer` variants
- `src/components/InteractivePlayground.jsx`:
  - Cleanly mounts `<ControlCenterPanel variant="workbench" />` at `#playground` and `#lab`
  - Zero toy sandbox artifacts, bouncing balls, or arcade presets
- `src/components/LabStudioDrawer.jsx`:
  - Cleanly mounts `<ControlCenterPanel variant="drawer" />` in slide-out drawer
- `src/components/PhysicsSandbox.jsx`:
  - Completely deleted from filesystem and git index

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Survey & Architecture Investigation | 3 parallel Explorers mapping files and exact interfaces | none | DONE |
| 2 | Control Center Implementation | Clean removal of physics sandbox + 4-tab implementation + consumer wiring | M1 | DONE |
| 3 | Multi-Agent Review & Adversarial Stress Tests | Reviewers + Challengers verification | M2 | DONE |
| 4 | Remediation of Legacy Migration | Fix `lab_studio_state` lookup in `LabContext.jsx` | M3 | DONE |
| 5 | Quality Gate & Parent Delivery | Quality Gate status and completion handoff | M4 | DONE |
