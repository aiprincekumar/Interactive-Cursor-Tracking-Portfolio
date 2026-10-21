# Worker Dispatch Specification — Case Studies Implementation

## Objective
Implement production-ready P1 Case Studies for all 9 projects in the Interactive Cursor-Tracking Portfolio using an accessible Slide-Over Drawer with 5-stage storytelling, live telemetry simulations, visual architecture diagrams, and metric highlights.

## Mandatory Reading
Before writing any code, thoroughly read:
1. `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md` (header `## 2026-10-20T21:51:13Z`)
2. `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\orchestrator_9\SCOPE.md`
3. `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_cs_projects\handoff.md`
4. `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_cs_drawer_ui\handoff.md`
5. `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_cs_sim_arch\handoff.md`

## ⚠️ MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Detailed Tasks
1. **Master Data (`src/data/caseStudiesData.js`)**:
   - Provide authentic, production-grade 5-stage storytelling datasets for all 9 projects across all 4 tracks.
   - Strict 5-stage storytelling structure:
     1. The Challenge (Enterprise context & regulatory / operational pain points)
     2. The Solution (Architecture & strategic engineering approach)
     3. Tech Stack & Obstacles (Overcoming technical latency, schema, or compliance hurdles)
     4. Measurable Results & Metrics (Before vs. After data, financial savings, reconciliation accuracy)
     5. Key Lessons Learned (Durable principles & governance takeaways)
   - Include simulation configurations (pipeline runner or state machine) and 4-tier visual architecture specs for each project.
   - Exports: `CASE_STUDIES` array and `getCaseStudyById(id)` helper.

2. **Components (`src/components/CaseStudyDrawer.jsx`, `CaseStudySimulator.jsx`, `CaseStudyArchitecture.jsx`)**:
   - `CaseStudyDrawer.jsx`: Accessible right slide-over drawer (`z-[56]`) with backdrop overlay (`z-[55]`).
     - Integrated `useFocusTrap` from `src/hooks/useFocusTrap.js`.
     - `Escape` key dismissal and backdrop click dismissal.
     - Universal body scroll lock with scrollbar width compensation (`document.body.style.overflow = 'hidden'`).
     - Focus restoration to the trigger element on close.
     - 5-stage storytelling tabs with WAI-ARIA tablist semantics (`role="tablist"`, `role="tab"`, `role="tabpanel"`, keyboard arrow navigation, `aria-selected`, `aria-controls`).
     - Audio feedback via `src/utils/audio.js` (respecting mute).
     - ARIA live announcements via `useAnnounce()` from `src/context/AnnouncerContext.jsx`.
     - Theme compatibility: Obsidian Dark, Linen Light, High-Contrast mode, Simple mode.
     - Responsive layout without horizontal overflow.
   - `CaseStudySimulator.jsx`: Interactive live simulation widget.
     - Pipeline runner (Projects 01, 03, 04, 05, 07, 09) and State machine visualizer (Projects 02, 06, 08).
     - Run controls, latency calculation, step execution, telemetry HUD, audio cues, screen reader announcements.
   - `CaseStudyArchitecture.jsx`: Visual 4-tier system architecture diagrams.
     - Tiers: Ingestion -> Controller/Validation -> Core Engine -> Output/Storage/E-Filing.
     - Responsive SVG / CSS flowcharts with directional indicators and WCAG AAA contrast.

3. **Trigger Integration (`src/components/ProjectsSection.jsx` & `src/App.jsx`)**:
   - Add accessible "Inspect Case Study" trigger buttons on all 9 project cards in `ProjectsSection.jsx` (both single-column flagship cards and MIS 2-column cards).
   - In `App.jsx`, mount `CaseStudyDrawer`, manage open/close state, support URL deep-linking (`?casestudy=<id>`), and listen to global event `'portfolio:open-case-study'`.

4. **Automated Verification Script (`scripts/verify_case_studies.mjs`)**:
   - Write a Node.js verification script that validates:
     - All 9 case study records exist and match their IDs ('01' through '09').
     - Each record contains all 5 storytelling stages with non-empty content.
     - Each record contains metric arrays with before/after comparisons and highlights.
     - Each record contains valid simulator configuration and 4-tier architecture specs.
     - `getCaseStudyById` successfully retrieves each record.

5. **Build and Verification**:
   - Run `node scripts/verify_case_studies.mjs`.
   - Run `npm run build` and ensure 0 errors.

6. **Universal Rule 6 (`changes_log/`)**:
   - Record all changes in `changes_log/` complying with Universal Rule 6 (`summary/changes_summary.md`, `master/master_changes_log.md`, `daily/`, `entries/`, `recent_10/`).

7. **Handoff**:
   - Write detailed handoff report to `.agents/teamwork/worker_cs_impl/handoff.md`.


## 2026-10-20T22:13:28Z
Task received from parent orchestrator e1dfba96-2d11-4e79-b794-eefcb70c964a:
Implement Case Studies for all 9 projects with accessible slide-over drawer, 5-stage storytelling, live telemetry simulations, 4-tier visual architecture, triggers in ProjectsSection, App mounting with deep linking, and automated verification.

## 2026-10-20T23:31:08Z
User status inquiry received: "are you working". Currently concluding final handoff protocol, writing handoff.md, and notifying parent orchestrator.
