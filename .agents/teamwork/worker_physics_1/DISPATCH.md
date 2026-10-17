# Task Assignment: Worker C (2D Physics Sandbox Arena & Live Telemetry HUD)

- Working Directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_physics_1
- Parent Orchestrator: 54634b41-b142-4755-aa5c-daaf424b3ab0
- Original Request: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md
- Explorer 1 Blueprint: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_1\handoff.md
- Target File to create: `src/components/PhysicsSandbox.jsx` (Exclusive write ownership)

Mandatory Integrity Warning:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Detailed Instructions:
1. Read Explorer 1's handoff report in `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_1\handoff.md`.
2. Create `src/components/PhysicsSandbox.jsx`:
   - Interactive 2D canvas arena with High-DPI support (`devicePixelRatio` capped at 2x) and responsive `ResizeObserver`.
   - 7 Elastic Physics Orbs:
     * Radiuses 18px to 32px, masses proportional to radius/area.
     * Radiant radial gradients with neon accent colors (#FF4D6D, #00F2FE, #FFD700, #10B981, #A855F7, #F43F5E, #38BDF8), specular highlights, and glowing dropshadow.
     * Full elastic wall bounces (restitution e = 0.85).
     * Pairwise orb-to-orb elastic collisions with mass conservation and overlap separation.
     * Delta-time normalized physics loop with damping.
     * Real-time gravity force (from props/context `gravity`, $-60$ to $+140\text{ px/s}^2$).
   - Cursor Collision & Kinetic Push:
     * Pointer coordinates tracked within the arena canvas bounds.
     * Repulsion force when cursor is within radius (R = r + 65px).
     * Instantaneous cursor velocity $\vec{v}_{cur}$ transferred to orbs on contact/swipe.
     * Support touch drag/swipe events for mobile testing.
   - Interactive Triggers:
     * "Particle Burst" button: Spawns 40 radial spark particles in lighter blend mode and sends an explosive impulse outward to all orbs.
     * "Zero-G Drift" toggle: Sets effective gravity to 0 with gentle sinusoidal orbital floating.
   - Live Telemetry HUD:
     * Zero-overhead direct-ref DOM mutation: mounted once with `useRef` handles (`speedRef`, `coordsRef`, `fpsRef`).
     * Displays Speedometer in px/s, pointer coordinates $(X, Y)$, and render FPS counter.
     * Updates throttled to ~15 Hz (every 65ms) inside RAF for 0 React re-renders!
     * Compact, elegant dark glassmorphism badge positioned in top corner of arena.
   - Run `npx oxlint` to ensure zero lint errors.
3. Write your handoff report to `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_physics_1\handoff.md` and call send_message to notify the orchestrator.


## 2026-10-17T19:02:34Z
You are Worker C (2D Physics Sandbox & Telemetry HUD Specialist).
Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_physics_1
Read your dispatch: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_physics_1\DISPATCH.md
Read the user request: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md
Read the physics blueprint: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_1\handoff.md

Your exclusive write file is: `src/components/PhysicsSandbox.jsx`.
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Implement:
1. Create `src/components/PhysicsSandbox.jsx` with HTML5 Canvas, High-DPI support (`devicePixelRatio` capped at 2x), and responsive `ResizeObserver`.
2. 7 Elastic Physics Orbs with glowing radial gradients, specular highlights, restitution bouncing off walls ($e = 0.85$), pairwise orb-to-orb elastic collisions with mass conservation, and delta-time normalization.
3. Real-time gravity force supporting Anti-G ($-60$) to Heavy Earth ($+140$).
4. Cursor repulsion and velocity kinetic impulse transfer when mouse/touch moves in arena. Touch drag/swipe support for mobile.
5. Interactive Particle Burst button (spawns 40 radial sparks, explosive impulse to all orbs).
6. Zero-G Drift toggle (orbital sinusoidal float, zero gravity).
7. Live Telemetry HUD: Direct-ref DOM text mutations inside RAF loop for 0 React re-renders! Displays speedometer (px/s), pointer $(X, Y)$, and FPS counter.
8. Verify with `npx oxlint` (run via run_command) and ensure clean build.
9. Write your handoff to `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_physics_1\handoff.md` and call send_message to notify orchestrator (54634b41-b142-4755-aa5c-daaf424b3ab0).
