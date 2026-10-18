# DISPATCH — Orchestrator 5

## Working Directory
`c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\orchestrator_5\`

## Task Specification
Reference: `.agents/teamwork/ORIGINAL_REQUEST.md` (section `## 2026-10-17T23:46:23Z`)

### Objective
Transform the 'Lab' section of the Interactive Cursor-Tracking Portfolio into a clean, theme-matched (Obsidian Dark / Linen Light) all-rounder Portfolio Control Center with a structured 4-tab settings layout. Completely remove irrelevant toy/physics sandbox features (2D bouncing balls, Px/s speedometer, particle burst, arcade presets) and provide real, practical portfolio controls with localStorage persistence.

### Requirements Breakdown
1. **R1. Elimination of Irrelevant Toy/Experimental Physics Features:**
   - Remove 2D elastic orbs physics simulation canvas (`PhysicsSandbox.jsx`), collision bouncing balls, and gravity trampoline toy mechanics.
   - Remove Px/s cursor speedometer and telemetry HUD widget.
   - Remove Particle Burst trigger button and flashy gaming presets (Cyberpunk Zero-G, Arcade, Zen, Hyper).
   - Clean up any unused files and imports cleanly.

2. **R2. 4-Tab Portfolio Control Center Architecture (In-Page & Floating Drawer):**
   Both `#playground` / `#lab` and `LabStudioDrawer.jsx` must present an identical, theme-matched (Obsidian Dark / Linen Light) 4-tab Control Center:
   - **🔊 Audio Studio:** Master sound toggle, master volume slider (0-100%), pitch multiplier slider (0.5x to 2.0x), Sound Matching Mode toggle (Dynamic cursor-sound matching vs Universal Voice), 7 acoustic preview buttons.
   - **✨ Cursor & Dynamics:** Custom interactive cursor toggle (fallback to native system pointer), cursor scale multiplier (0.5x to 2.0x globally), flight lerp speed (Dreamy / Natural / Snappy), stardust particle trail toggle and theme color swatches.
   - **👤 Hero & Character Control:** Character gaze tracking mode (Auto Gaze Follow vs Static Fixed), 10 3D head pose override selector buttons, character zoom/scale slider (0.5x to 2.0x), Polaroid camera flash and confetti toggle.
   - **⚙️ Startup & Preferences:** Default startup role track selection (Accountant / MIS Executive / Controller), default cursor state on startup, default audio state on startup, reduced motion accessibility toggle, 1-Click "Reset to Factory Defaults" button.

3. **R3. Reactive State Persistence & Wiring:**
   - Centralize all parameters in `LabContext.jsx` with atomic persistence in `localStorage` (`portfolio_control_center`).
   - Wire `DynamicCursorManager.jsx`, `HeroSection.jsx`, and `src/utils/audio.js` directly to these reactive parameters so changes immediately reflect live.

### Quality & Verification Bar
- `npm run lint` (`oxlint`) passes with 0 errors.
- `npm run build` succeeds cleanly with 0 errors.
- Deliver `handoff.md` and `progress.md` in your working directory upon completion.
