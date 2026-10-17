# Dispatch to Orchestrator 4

- Task: Upgrade and modernize the 'Lab' section into a hybrid experimentation and customization studio per ORIGINAL_REQUEST.md (Follow-up 2026-10-17T18:44:05Z)
- Working Directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\orchestrator_4
- Project Root: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio
- Specification: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md

## 2026-10-17T18:45:00Z

You are the Project Orchestrator (teamwork_preview_orchestrator).
Your working directory is: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\orchestrator_4
Your project root is: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio
Read the user request in: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md (specifically the latest request under ## Follow-up — 2026-10-17T18:44:05Z).

Your task:
Upgrade and modernize the 'Lab' section of the Interactive Cursor-Tracking Portfolio into a hybrid experimentation and customization studio with an interactive physics testing sandbox, comprehensive cursor/physics/audio tuning controls, and 1-click presets.

Requirements Summary:
1. R1. Hybrid Lab Access & Quick Studio Drawer
   - Modernize the in-page `#playground` / `#lab` section with a glassmorphism lab studio layout.
   - Implement a persistent floating action button (FAB with flask icon) that slides out a compact, non-intrusive Quick Lab Drawer from the right edge, allowing users to tweak parameters and observe live cursor/physics changes on any page section without scrolling.
   - Connect Navbar explore links and Command Palette (`Cmd+K`) directly to the Lab surfaces.

2. R2. Interactive Physics Sandbox & Live Telemetry
   - Embed a dedicated 2D physics sandbox arena inside the Lab.
   - Features 5-8 elastic physics orbs that react dynamically to gravity, velocity damping, and direct cursor collisions/pushes.
   - Real-time Telemetry HUD displaying live cursor velocity (Speedometer in px/s), pointer coordinates (X, Y), and render frame rate (FPS monitor).
   - Interactive "Particle Burst" test trigger button and Zero-G / Anti-Gravity toggle demonstrating live orb floating behavior.

3. R3. Comprehensive Customization Controls Suite
   - Cursor Tuning: Global cursor scale multiplier (0.5x to 2.0x) affecting Butterfly and all 35 modular kinematic cursor styles, plus Butterfly flight lerp speed and wing-flap dynamics.
   - Physics & Gravity: Gravity slider (-60 px/s^2 Anti-G to +140 px/s^2 Heavy Earth), particle stardust trail toggle, and dynamic particle color palette customizer (presets + hex input).
   - Web Audio Synthesizer: Master volume slider (0% - 100%), pitch multiplier (0.5x - 2.0x), audio toggle, and an interactive 7-sound synthesizer soundboard (Polaroid Shutter, Cosmic Sparkle, Bubble Pop, Laser Focus, Crystal Chime, Ribbon Sweep, Haptic Click) for instant acoustic testing.

4. R4. Curated 1-Click Presets & State Persistence
   - Provide 1-click instant recipe buttons (*Cyberpunk Zero-G*, *Retro Arcade*, *Zen Minimalist*, *Hyper Velocity*).
   - Auto-persist all user customizations in `localStorage` under `portfolio_lab_config` with live state synchronization between the in-page section, floating drawer, and global runtime.
   - Provide a clear "Reset to Factory Defaults" action to instantly restore default physics and audio parameters.

Acceptance Criteria:
- Functionality & Interactivity:
  * Clicking the floating Lab button opens the slide-out Studio Drawer smoothly without layout shifts.
  * Adjusting the cursor scale slider visibly resizes the active cursor in real-time.
  * Moving the pointer inside the Sandbox accurately updates the px/s speedometer and deflects physics orbs.
  * Clicking any of the 7 soundboard buttons plays the synthesized Web Audio tone with the active pitch and volume applied.
  * Clicking a 1-click preset immediately applies its bundled cursor, gravity, color, and audio settings.
  * Refreshing the browser preserves the customized lab settings.
  * Clicking "Reset Defaults" restores original scale, gravity, color, and audio values.
- Code Quality & Build Verification:
  * Code passes static analysis without syntax errors (`npx oxlint`).
  * Project builds cleanly with zero errors (`npm run build`).

Adhere strictly to project conventions and rules:
- As Orchestrator, manage and decompose tasks into phases, delegate work to specialized subagents (explorers, implementers, reviewers).
- Maintain your BRIEFING.md, plan.md, and progress.md in your working directory (`.agents/teamwork/orchestrator_4/`).
- Report completion back to Sentinel when finished.
