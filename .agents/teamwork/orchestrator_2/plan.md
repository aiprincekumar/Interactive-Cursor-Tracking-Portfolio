# Execution Plan: Navbar All-in-One Power Pack

## Objective
Implement the Navbar All-in-One Power Pack in the Interactive Cursor-Tracking Portfolio:
1. Command Palette / Global Search Modal (`Cmd+K` / `Ctrl+K`) with keyboard navigation (ArrowUp/Down, Enter, Esc, backdrop click) and fuzzy/token filtering across sections, featured projects, and skills.
2. Smart Resume Action Dropdown with View Online, Download PDF (with celebratory canvas-confetti and sparkle audio chime), and Copy Resume Link with 'Copied!' toast/badge.
3. Scroll Progress Indicator Bar (2.5px micro gradient `#FF4D6D` to `#FFAA00`) at the bottom of the floating navbar.
4. Mobile responsiveness, drawer navigation preservation, and touch targets.
5. Strict verification with zero errors on `npm run build` and `npx oxlint`.

## Phases

### Phase 0: Parallel Exploration (3 Explorers)
- **Explorer 1 (Navbar & Layout Architecture)**:
  - Inspect `src/components/Navbar.jsx`, `src/App.jsx`, navbar styles, mobile drawer, sound/cursor toggles.
  - Analyze placement of Search button in right action group: `[🔍 Search] -> [🦋 Cursor] -> [🔊 Sound] -> [📄 Resume]`.
- **Explorer 2 (Command Palette & Search Index Mapping)**:
  - Inventory all target anchors: `#hero`, `#about`, `#skills`, `#experience`, `#projects`, `#gallery`, `#playground`, `#contact`.
  - Inventory featured projects (e.g. GST & Income Tax Compliance / PolicyGuard AI, Tally State Machine, etc.) and skills.
  - Plan search modal UI, keyboard event listeners (`keydown` for Cmd+K/Ctrl+K, ArrowUp, ArrowDown, Enter, Escape), smooth scrolling logic, and backdrop blur.
- **Explorer 3 (Resume Dropdown, Confetti, Audio & Scroll Progress)**:
  - Inspect audio system in `src/` (sound context / SoundEffects / Web Audio synth or sound files).
  - Inspect `canvas-confetti` package availability or dependency in `package.json`.
  - Design Resume dropdown trigger, menu actions (View Online, Download PDF, Copy Link), outside click / Escape dismiss, and scroll progress calculation logic.

### Phase 1: Implementation (Worker)
- Dispatch Worker with consolidated Explorer findings.
- Worker implements modular code, updates `Navbar.jsx`, adds/integrates `CommandPalette.jsx`, `ResumeDropdown.jsx`, `ScrollProgressBar.jsx` (or clean components).
- Worker runs `npm run build` and `npx oxlint` and ensures 0 errors.
- Worker records changes in `changes_log/`.

### Phase 2: Independent Review & Challenge
- **2 Reviewers (`teamwork_preview_reviewer`)**: Code quality, accessibility, responsive design, component isolation, keyboard handling.
- **2 Challengers (`teamwork_preview_challenger`)**: Edge cases, keyboard shortcut collisions, scroll boundary math, canvas-confetti invocation, mobile drawer compatibility.

### Phase 3: Forensic Integrity Audit (`teamwork_preview_auditor`)
- Verify authentic implementations, no mock bypasses, actual smooth scrolling, actual confetti and audio triggering, real scroll math.

### Phase 4: Gate & Sentinel Handoff
- Check all gate criteria in `GATE_STATUS.md`.
- Send final completion report to parent Sentinel (`1a7380fe-682c-436e-a80a-839c8da18386`).
