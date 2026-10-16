# Worker Role 1 Dispatch
Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_role_1

## 2026-10-16T11:30:47Z
You are Worker 1 (teamwork_preview_worker).
Your working directory is: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_role_1
Project root is: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

You MUST read:
1. c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md (specifically ## Follow-up — 2026-10-16T11:10:18Z)
2. c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\orchestrator_3\PROJECT.md
3. c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_role_1\handoff.md
4. c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_role_2\handoff.md
5. c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_role_3\handoff.md
before beginning code changes.

Files exclusively owned by you for editing/creation:
- src/context/RoleContext.jsx (NEW)
- src/components/RoleTabsBar.jsx (NEW)
- src/components/Navbar.jsx
- src/components/CommandPalette.jsx
- src/utils/searchCatalog.js
- src/components/ExperienceSection.jsx
- src/components/ProjectsSection.jsx
- src/components/SkillsSection.jsx
- src/components/AboutSection.jsx
- src/App.jsx
- changes_log/

Tasks:
1. Implement `src/context/RoleContext.jsx`:
   - Global `RoleProvider` with `activeRole` ('accountant' | 'mis', default 'accountant').
   - `useRoleTab()` custom hook, exporting `activeRole`, `setActiveRole`, `selectRole`, `ROLE_TRACKS`, `isAccountant`, `isMIS`.
   - Initial state resolution: URL query param (?role=accountant or ?role=mis) -> localStorage.getItem('portfolio_selected_role') -> default 'accountant'.
   - Update URL query parameter without page reload via window.history.replaceState, preserving path and hashes.
   - Support browser back/forward navigation via window.addEventListener('popstate').
   - Support custom window events: 'switch-role-tab' (inbound) and 'portfolio-role-change' (outbound).
2. Implement `src/components/RoleTabsBar.jsx`:
   - Reusable horizontal tabs UI adhering to the design system (#FAF8F5, #FF4D6D coral accent, active pill, track badge).
   - WAI-ARIA tab semantics (role="tablist", role="tab", aria-selected, aria-controls, id, tabIndex).
   - Keyboard navigation with ArrowRight/ArrowLeft (circular wrapping), Home, End.
   - Audio feedback on click (soundFX.playFocusBeep()) and hover (soundFX.playChipHover()).
   - Transition: .animate-tab-fade.
3. Update `src/components/Navbar.jsx`:
   - Integrate compact role switcher pill:
     * Desktop: placed immediately to the left of [🔍 Search], preserving order [🔍 Search] -> [🦋 Cursor] -> [🔊 Sound] -> [📄 Resume].
     * Mobile: compact pill in the header center and 2-column track selector card in the mobile drawer.
4. Update `src/utils/searchCatalog.js`:
   - Add role tagging (role: 'accountant' | 'mis' | 'both') to all 51 search items.
5. Update `src/components/CommandPalette.jsx`:
   - In `handleSelect(item)`: if item has a role ('accountant' or 'mis'), switch the active role tab immediately prior to smooth scrolling to the target element (with a safe 160ms delay so DOM element mounts).
   - Display role badges in search results.
6. Update `src/components/ExperienceSection.jsx`:
   - Horizontal RoleTabsBar at the top of the section.
   - Tab 1 ("Accountant & Tax"): 3 roles (GST Consultant, Senior Tally Accountant, Junks Food FMCG).
   - Tab 2 ("MIS & Analytics"): 3 roles (DAY-NULM MIS Executive, Smart Card Operations, Computer Instructor).
   - Preserve all 6 roles, metrics, dates, and badges.
7. Update `src/components/ProjectsSection.jsx`:
   - Horizontal RoleTabsBar at the top of the section.
   - Tab 1 ("Accountant & Tax"): Flagship 01 (GST Compliance Engine) & 02 (Tally Accounting Architecture) with interactive simulators.
   - Tab 2 ("MIS & Analytics"): Project 03 (DAY-NULM MIS Reporting Portal) & 04 (Smart Card Operations Engine).
   - Preserve all 4 projects and interactive audit simulator / state machine.
8. Update `src/components/SkillsSection.jsx`:
   - Horizontal RoleTabsBar at the top of the section.
   - Tab 1 ("Accountant & Tax"): 8 accounting skills.
   - Tab 2 ("MIS & Analytics"): 8 MIS, Office IT, and hardware skills.
   - Preserve all 16 skills and interactive inspector card.
9. Update `src/components/AboutSection.jsx`:
   - Adapt executive narrative and 4 Core Competency pillars to match the active role tab.
   - Qualifications (ADCA, I.A., Matriculation) and Bio-Data Dossier remain accessible across both tracks.
10. Update `src/App.jsx`:
    - Wrap the application content in `<RoleProvider>`.
11. Build and Lint Verification:
    - Run `npm run build` and `npx oxlint` in the project root. Both commands must pass with zero errors.
12. Project Changes Log:
    - Log all changes into `changes_log/` following project rules (summary, master, daily, entries, recent_10).
13. Write detailed handoff report to:
    `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_role_1\handoff.md`
    Include: Observation, Logic Chain, Caveats, Conclusion, Verification Method, build/test output.
14. Send completion message back to orchestrator when finished.
