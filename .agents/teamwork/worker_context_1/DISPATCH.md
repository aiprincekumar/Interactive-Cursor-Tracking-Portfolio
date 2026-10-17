# Task Assignment: Worker B (Lab Context, 1-Click Presets & Persistence Engine)

- Working Directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_context_1
- Parent Orchestrator: 54634b41-b142-4755-aa5c-daaf424b3ab0
- Original Request: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md
- Explorer 3 Blueprint: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_3\handoff.md
- Target File to create: `src/context/LabContext.jsx` (Exclusive write ownership)

Mandatory Integrity Warning:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Detailed Instructions:
1. Read Explorer 3's handoff report in `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_3\handoff.md`.
2. Create `src/context/LabContext.jsx`:
   - Store and manage global lab parameters:
     * `cursorScale` (default `1.0`, range `0.5` to `2.0`, step `0.05`)
     * `flightSpeed` (default `0.14`, range `0.05` to `0.35`, step `0.01`)
     * `wingDynamics` (default `1.0`, range `0.5` to `2.0`, step `0.05`)
     * `gravity` (default `0`, range `-60` to `+140`, step `5`)
     * `trailEnabled` (default `true`)
     * `particleColor` (default `'#FF4D6D'`)
     * `soundEnabled` (default `true`)
     * `masterVolume` (default `0.8`, range `0.0` to `1.0`, step `0.05`)
     * `audioPitch` (default `1.0`, range `0.5` to `2.0`, step `0.05`)
     * `isDrawerOpen` (boolean, default `false`)
     * `activePreset` (string, default `'default'`)
   - 1-Click Presets definition:
     * `cyberpunk`: { cursorScale: 1.2, flightSpeed: 0.25, wingDynamics: 1.5, gravity: -25, trailEnabled: true, particleColor: '#00F2FE', soundEnabled: true, masterVolume: 0.85, audioPitch: 1.35 }
     * `arcade`: { cursorScale: 1.15, flightSpeed: 0.20, wingDynamics: 1.3, gravity: 95, trailEnabled: true, particleColor: '#FFD700', soundEnabled: true, masterVolume: 0.9, audioPitch: 0.8 }
     * `zen`: { cursorScale: 0.85, flightSpeed: 0.07, wingDynamics: 0.7, gravity: 0, trailEnabled: true, particleColor: '#10B981', soundEnabled: true, masterVolume: 0.6, audioPitch: 1.0 }
     * `hyper`: { cursorScale: 1.35, flightSpeed: 0.28, wingDynamics: 1.8, gravity: 45, trailEnabled: true, particleColor: '#FF4D6D', soundEnabled: true, masterVolume: 1.0, audioPitch: 1.75 }
   - Persistence in `localStorage` under `portfolio_lab_config` JSON key. On load, safely parse and migrate any legacy keys (`physics_particle_color`, `physics_gravity`, etc.).
   - Provide actions:
     * `setCursorScale`, `setFlightSpeed`, `setWingDynamics`, `setGravity`, `setTrailEnabled`, `setParticleColor`, `setSoundEnabled`, `setMasterVolume`, `setAudioPitch`
     * `applyPreset(presetKey)`
     * `resetDefaults()` (restores 1.0 scale, 0.14 speed, 1.0 wing dynamics, 0 gravity, '#FF4D6D', 80% volume, 1.0 pitch)
     * `openDrawer()`, `closeDrawer()`, `toggleDrawer()`
   - Event listeners for `portfolio:open-lab-drawer`, `portfolio:toggle-lab-drawer`, `portfolio:apply-lab-preset`, and `storage` (for multi-tab sync).
   - Hook `useLab()` with error boundary check if used outside `LabProvider`.
   - Run `npx oxlint` to ensure zero lint errors.
3. Write your handoff report to `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_context_1\handoff.md` and call send_message to notify the orchestrator.

## 2026-10-17T19:02:34Z
You are Worker B (Lab Context, Presets & Persistence Specialist).
Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_context_1
Read your dispatch: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_context_1\DISPATCH.md
Read the user request: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md
Read the state blueprint: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_3\handoff.md

Your exclusive write file is: `src/context/LabContext.jsx`.
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Implement:
1. Create `src/context/LabContext.jsx` with full state management:
   - `cursorScale` (0.5 to 2.0, default 1.0)
   - `flightSpeed` (0.05 to 0.35, default 0.14)
   - `wingDynamics` (0.5 to 2.0, default 1.0)
   - `gravity` (-60 to +140, default 0)
   - `trailEnabled` (default true)
   - `particleColor` (default '#FF4D6D')
   - `soundEnabled` (default true)
   - `masterVolume` (0.0 to 1.0, default 0.8)
   - `audioPitch` (0.5 to 2.0, default 1.0)
   - `isDrawerOpen` (default false)
   - `activePreset` (default 'default')
2. 4 Curated 1-Click Presets: `cyberpunk`, `arcade`, `zen`, `hyper`.
3. `localStorage` persistence under `portfolio_lab_config` JSON key with safe migration from legacy keys.
4. Actions: `setCursorScale`, `setFlightSpeed`, `setWingDynamics`, `setGravity`, `setTrailEnabled`, `setParticleColor`, `setSoundEnabled`, `setMasterVolume`, `setAudioPitch`, `applyPreset`, `resetDefaults`, `openDrawer`, `closeDrawer`, `toggleDrawer`.
5. Custom event listeners (`portfolio:open-lab-drawer`, `portfolio:toggle-lab-drawer`, `portfolio:apply-lab-preset`, `storage`).
6. Export `LabProvider` and `useLab()`.
7. Verify with `npx oxlint` (run via run_command) and ensure clean build.
8. Write your handoff to `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_context_1\handoff.md` and call send_message to notify orchestrator (54634b41-b142-4755-aa5c-daaf424b3ab0).
