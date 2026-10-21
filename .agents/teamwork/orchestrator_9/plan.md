# Execution Plan — orchestrator_9: Production-Ready P1 Case Studies for 9 Projects

## Objective
Implement production-ready P1 Case Studies for all 9 projects in the Interactive Cursor-Tracking Portfolio with an accessible Slide-Over Drawer, 5-stage storytelling, live telemetry simulations, visual architecture diagrams, and metric highlights.

## Phases

### Phase 0: Survey & Codebase Exploration (Parallel)
Dispatch 3 specialized Explorers to survey the authoritative sources of truth:
1. `explorer_cs_projects`: Map all 9 projects across all tracks (Accountant, MIS, Corporate Controller/Other, Vibe Coding), their current structures, data models in `src/`, triggers in `ProjectsSection.jsx`, and tech tags.
2. `explorer_cs_drawer_ui`: Map the existing drawer and modal patterns (`LabStudioDrawer.jsx`, `CommandPalette.jsx`), accessibility utilities (focus trap, scroll lock, keyboard escape, ARIA landmarks), sound triggers (`audio.js`), and theming classes (Dark, Light, High Contrast, Simple mode).
3. `explorer_cs_sim_arch`: Investigate interactive simulation patterns and visual architecture diagram possibilities (live telemetry runner, SVG flowcharts, state visualizers) that integrate cleanly without horizontal scroll or layout regressions.

### Phase 1: Synthesis & SCOPE.md Definition
- Synthesize the 3 Explorer handoffs into a comprehensive feature inventory in `SCOPE.md`.
- Establish clear interface contracts for:
  - Case Study Data Schema (`src/data/caseStudiesData.js` or similar)
  - Slide-Over Drawer Component (`src/components/CaseStudyDrawer.jsx`)
  - Simulation Widget System (`src/components/CaseStudySimulator.jsx`)
  - Architecture Diagram System (`src/components/CaseStudyArchitecture.jsx`)
  - Integration with `ProjectsSection.jsx` and global A11y / Sound.

### Phase 2: Worker Implementation
- Dispatch `worker_case_studies` with strict write boundaries and integrity guidelines.
- Implement:
  1. Complete authentic 5-stage storytelling data for all 9 projects.
  2. Accessible Slide-Over Drawer with full keyboard trapping, Escape handling, ARIA announcements, and scroll lock.
  3. Interactive telemetry simulation widgets for each project with live state and feedback.
  4. Visual system architecture flowcharts for each project.
  5. UI triggers in `ProjectsSection.jsx` for opening each case study.
  6. Support for Dark/Light, High Contrast, and Simple mode.
  7. Rule 6 Changes Log records in `changes_log/`.

### Phase 3: Multi-Agent Review, Challenge & Audit
- Dispatch 2 independent Reviewers (`reviewer_cs_1`, `reviewer_cs_2`) to verify functional correctness, UX polish, A11y compliance, and code quality.
- Dispatch 2 independent Challengers (`challenger_cs_1`, `challenger_cs_2`) to adversarially test keyboard traps, focus return, mobile responsiveness, simulation telemetry performance, and edge cases.
- Dispatch 1 Forensic Auditor (`auditor_cs_1`) to verify that all 9 case studies, simulations, and diagrams are genuine, authentic, and free of placeholders or cheats.

### Phase 4: Gate Evaluation & Verification
- Compile all results into `GATE_STATUS.md`.
- Evaluate binary veto (Auditor CLEAN) + strict AND (All reviews APPROVE + Challengers pass + build clean).
- Ensure `npm run build` and linter pass with 0 errors.

### Phase 5: Synthesis & Handoff
- Generate final `handoff.md`.
- Send completion message to Sentinel/parent caller.
