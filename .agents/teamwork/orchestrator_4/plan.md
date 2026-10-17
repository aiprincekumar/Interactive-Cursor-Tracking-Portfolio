# Project Plan: Modernize & Upgrade Lab Section to Hybrid Studio

## Scope & Objective
Upgrade and modernize the 'Lab' section (`#playground` / `#lab`) of the Interactive Cursor-Tracking Portfolio into a hybrid experimentation and customization studio with an interactive 2D physics sandbox, live telemetry HUD, comprehensive cursor/physics/audio tuning suite, quick slide-out drawer, and 1-click presets with `localStorage` persistence.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Dual-Surface Access & Quick Drawer | Slide-out Quick Lab Drawer from right edge with FAB button (flask icon), accessible on any page section without scrolling. Connect Navbar and Command Palette (`Cmd+K`). | M2 | R1 |
| F2 | In-Page Lab Studio Glassmorphism Layout | Modernize `#playground` / `#lab` section with glassmorphism layout, modular panes for sandbox and controls. | M3 | R1 |
| F3 | 2D Interactive Physics Sandbox | Canvas/SVG/DOM 2D arena with 5-8 elastic physics orbs that react to gravity, damping, and direct cursor pushes/collisions. | M3 | R2 |
| F4 | Live Telemetry HUD | Speedometer in px/s, pointer coordinates (X, Y), render FPS monitor, Particle Burst trigger, and Zero-G toggle. | M3 | R2 |
| F5 | Cursor & Physics Tuning Controls | Global cursor scale multiplier (0.5x - 2.0x), Butterfly flight lerp speed & wing dynamics, gravity slider (-60 to +140 px/s^2), particle trail toggle, color palette customizer. | M2 | R3 |
| F6 | Web Audio Synthesizer Controls & Soundboard | Master volume (0%-100%), pitch multiplier (0.5x - 2.0x), audio toggle, 7-sound soundboard (Polaroid Shutter, Cosmic Sparkle, Bubble Pop, Laser Focus, Crystal Chime, Ribbon Sweep, Haptic Click). | M2 | R3 |
| F7 | 1-Click Presets & Persistence | Presets (*Cyberpunk Zero-G*, *Retro Arcade*, *Zen Minimalist*, *Hyper Velocity*), `localStorage` sync under `portfolio_lab_config`, Reset to Defaults. | M2 | R4 |
| F8 | Quality & Build Verification | Passes `npx oxlint` and `npm run build` cleanly with zero errors. All acceptance tests verified. | M4 | Quality Gates |

## Milestones & Work Breakdown
| Milestone | Name | Scope | Dependencies | Status |
|-----------|------|-------|--------------|--------|
| M1 | Survey & Architecture Specification | Detailed code inspection of `InteractivePlayground.jsx`, `ButterflyCursor.jsx`, `audio.js`, `cursorConstants.js`, `Navbar.jsx`, `CommandPalette.jsx`. Design state architecture (`LabContext` or config hook). | None | DONE |
| M2 | State Management, Tuning Suite & Audio Soundboard | Create `LabContext.jsx` with `portfolio_lab_config` persistence, hook up cursor scale to Butterfly and dynamic cursor manager, extend `audio.js` with pitch/volume/soundboard synth, build controls suite & preset actions. | M1 | DONE |
| M3 | Physics Sandbox, Telemetry HUD & In-Page Lab | Implement 2D elastic physics sandbox canvas/engine, real-time speedometer & FPS HUD, particle burst, Zero-G switch, and modernize in-page Lab section. | M2 | DONE |
| M4 | Quick Studio Drawer & Global Navigation Integration | Implement floating FAB and slide-out Quick Lab Drawer with synchronized controls. Connect Navbar link and Command Palette. | M3 | DONE |
| M5 | Quality Verification & Gating | Reviewer code inspection, static analysis verification (`npx oxlint`), build verification (`npm run build`), and final audit against all acceptance criteria. | M4 | DONE |

## Code Layout & Module Ownership
- `src/context/LabContext.jsx`: Central state store for lab settings (cursor scale, flight speed, gravity, stardust, particle colors, master volume, pitch multiplier, sound enabled, presets).
- `src/utils/audio.js`: Extended with synthesizer controls (volume, pitch multiplier, tone generator for 7 soundboard effects).
- `src/components/InteractivePlayground.jsx`: Modernized in-page Lab Studio combining the Physics Sandbox and Tuning Controls.
- `src/components/PhysicsSandbox.jsx`: Dedicated 2D physics canvas arena with 5-8 elastic orbs, collision physics, and live telemetry HUD.
- `src/components/LabStudioDrawer.jsx`: Floating action button (FAB) + slide-out quick drawer with synchronized tuning controls.
- `src/components/Navbar.jsx` & `src/components/CommandPalette.jsx`: Deep links to both in-page Lab and opening the Quick Studio Drawer.
- `src/components/ButterflyCursor.jsx` & `src/components/DynamicCursorManager.jsx`: Subscribed to global cursor scale and dynamics.

## Acceptance Criteria
- [x] Floating Lab FAB opens Quick Lab Drawer smoothly without layout shifts.
- [x] Adjusting cursor scale slider visibly resizes active cursor in real-time.
- [x] Pointer inside Sandbox updates px/s speedometer and deflects elastic orbs.
- [x] All 7 soundboard buttons trigger synthesized Web Audio tones with active pitch and volume.
- [x] 1-click presets instantly apply bundled cursor, gravity, color, and audio settings.
- [x] Browser refresh preserves customized settings via `localStorage`.
- [x] "Reset Defaults" restores original parameters.
- [x] Passes `npx oxlint` with zero errors.
- [x] Passes `npm run build` with zero errors.
