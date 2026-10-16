# Execution Plan: Synchronized Horizontal Role Tabs

## Objective
Implement synchronized horizontal role tabs across the interactive portfolio to cleanly separate and showcase two distinct career tracks: "Accountant & Tax" (Financial Track) and "MIS & Analytics" (Data & Operations Track).

### Core Features to Deliver:
1. **R1. Synchronized Role State & Navigation**:
   - Shared global role state (`accountant` vs `mis`) via React Context or state hook.
   - Immediate cross-component synchronization without page reload.
   - `localStorage` persistence (key: `portfolio_selected_role` or standard key) with fallback default `accountant`.
   - URL query parameter reading and updating (`?role=accountant` | `?role=mis`) with `window.history.replaceState` or `pushState`.
2. **R2. Section-Level Horizontal Tabs**:
   - Adhere to design system (`#FAF8F5`, `#FF4D6D` coral accent, WAI-ARIA tablist/tab/tabpanel, ArrowRight/ArrowLeft keyboard navigation, `.animate-tab-fade` transitions, audio sound FX).
   - **ExperienceSection**: Tab 1 (3 Accountant roles: GST Consultant, Senior Tally Accountant, Junks Food FMCG), Tab 2 (3 MIS roles: DAY-NULM MIS Executive, Smart Card Operations, Computer Instructor).
   - **ProjectsSection**: Tab 1 (Accountant projects: GST Compliance Engine, Tally Architecture), Tab 2 (MIS projects: DAY-NULM MIS Portal, Smart Card Operations Engine).
   - **SkillsSection**: Tab 1 (Accounting skills), Tab 2 (MIS/Data/Office IT skills).
   - **AboutSection**: Adapt narrative and competencies focus according to the active role tab.
3. **R3. Header / Navbar Quick Switcher**:
   - Compact, accessible role switcher pill in floating Navbar, toggling roles instantly from any scroll position.
4. **R4. Command Palette & Search Catalog Deep Linking**:
   - Deep linking: selecting an Accountant or MIS item in search palette switches the active role tab to the appropriate track and scrolls smoothly to target.
5. **Quality & Acceptance Criteria**:
   - Zero lost content; all 6 experiences, projects, skills preserved.
   - Full accessibility (ARIA attributes `role="tab"`, `aria-selected`, `aria-controls`, `role="tabpanel"`, keyboard focus).
   - `npm run build` passes with zero errors; `npx oxlint` passes cleanly.

---

## Phases

### Phase 0: Parallel Exploration (3 Explorers)
- **Explorer 1 (Role State Architecture & Sync)**:
  - Investigate React architecture, state management patterns (`src/App.jsx`, contexts, hooks, sounds).
  - Design unified `RoleContext` or synchronized role hook with `localStorage` and URL query param (`?role=`) sync.
- **Explorer 2 (Section Tabs & Data Categorization)**:
  - Inspect `ExperienceSection.jsx`, `ProjectsSection.jsx`, `SkillsSection.jsx`, `AboutSection.jsx`.
  - Design horizontal tab headers, ARIA tab semantics, keyboard navigation (Left/Right arrow keys), animations (`.animate-tab-fade`), and sound effects.
  - Map exact data items for Tab 1 ("Accountant & Tax") vs Tab 2 ("MIS & Analytics").
- **Explorer 3 (Header Quick Switcher & Command Palette Deep Linking)**:
  - Inspect `Navbar.jsx`, `CommandPalette.jsx` and search index in `src/`.
  - Design compact role switcher pill in Navbar.
  - Update `CommandPalette.jsx` search catalog items with role tags and deep linking callbacks to switch role before scrolling.

### Phase 1: Implementation (Worker)
- Dispatch dedicated Worker with synthesized Explorer findings.
- Worker implements the unified role context/hook, updates `Navbar.jsx`, `CommandPalette.jsx`, `ExperienceSection.jsx`, `ProjectsSection.jsx`, `SkillsSection.jsx`, and `AboutSection.jsx`.
- Worker executes build tests (`npm run build`, `npx oxlint`) and records all modifications in `changes_log/`.

### Phase 2: Independent Review & Challenge
- **Reviewer 1 (`teamwork_preview_reviewer`)**: WAI-ARIA compliance, accessibility, keyboard navigation, tab semantics, design fidelity.
- **Reviewer 2 (`teamwork_preview_reviewer`)**: React state synchronization, URL query sync, localStorage persistence, cross-section consistency.
- **Challenger 1 (`teamwork_preview_challenger`)**: Command palette deep-linking verification, keyboard stress testing, edge-case URL query tests.
- **Challenger 2 (`teamwork_preview_challenger`)**: Mobile responsiveness, audio FX on tab switch, visual regression, complete data preservation.

### Phase 3: Forensic Integrity Audit (`teamwork_preview_auditor`)
- Verify authentic implementation with no mocked logic, verify all 6 experiences, projects, and skills exist and display properly under respective tabs.

### Phase 4: Gate Check & Final Delivery
- Evaluate `GATE_STATUS.md`.
- Send completion message to parent Sentinel.
