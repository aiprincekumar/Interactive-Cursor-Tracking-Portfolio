# Dispatch to Orchestrator 3

- Task: Implement Synchronized Horizontal Role Tabs across the Interactive Portfolio per ORIGINAL_REQUEST.md (Follow-up 2026-10-16T11:10:18Z)
- Working Directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\orchestrator_3
- Project Root: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio
- Specification: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md

## 2026-10-16T11:15:00Z

You are the Project Orchestrator (teamwork_preview_orchestrator).
Your working directory is: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\orchestrator_3
Your project root is: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio
Read the user request in: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md (specifically the latest request under ## Follow-up — 2026-10-16T11:10:18Z).

Your task:
Implement synchronized horizontal role tabs across the interactive portfolio to cleanly separate and showcase two distinct career tracks: "Accountant & Tax" (Financial Track) and "MIS & Analytics" (Data & Operations Track).

Requirements Summary:
1. R1. Synchronized Role State & Navigation:
   - Global, synchronized role-selection state (Tab 1: "Accountant & Tax" [Badge: Financial Track], Tab 2: "MIS & Analytics" [Badge: Data & Operations Track]).
   - Switching role in any section or via the header switcher immediately synchronizes all sections across the portfolio.
   - Active role defaults to "Accountant & Tax", persists in `localStorage`, and reflects in/listens to URL query parameters (`?role=accountant` or `?role=mis`).
2. R2. Section-Level Horizontal Tabs:
   - Add horizontal tabs adhering to the existing design system (`#FAF8F5`, `#FF4D6D` coral accent, WAI-ARIA tab semantics, keyboard navigation, and `.animate-tab-fade` transitions) to:
     * ExperienceSection: Filter/display 3 Accountant roles (GST Consultant, Senior Tally Accountant, Junks Food FMCG) under Tab 1, and 3 MIS roles (DAY-NULM MIS Executive, Smart Card Operations, Computer Instructor) under Tab 2.
     * ProjectsSection: Display Accountant projects under Tab 1 (GST Compliance Engine, Tally Architecture) and MIS projects under Tab 2 (DAY-NULM MIS Portal, Smart Card Operations Engine).
     * SkillsSection: Display Accounting skills under Tab 1 and MIS/Data/Office IT skills under Tab 2.
     * AboutSection: Adapt narrative and competencies focus according to the active role tab.
3. R3. Header / Navbar Quick Switcher:
   - Add a compact, accessible role switcher pill in the navigation header allowing the visitor to toggle roles at any point without scrolling.
4. R4. Command Palette & Search Catalog Deep Linking:
   - Ensure searching for MIS or Accountant items in the search catalog / Command Palette automatically switches the active role to the corresponding tab and scrolls to the selected item.

Acceptance Criteria:
- Switching role in any section or navbar updates all sections instantaneously without page reload.
- Page reload preserves the chosen role from `localStorage`.
- Opening with `?role=mis` sets the initial role to MIS & Analytics.
- No role content is lost; all 6 experiences, projects, and skills are categorized under their proper track.
- Tab buttons follow WAI-ARIA tablist/tab/tabpanel pattern with ArrowRight/ArrowLeft keyboard navigation.
- Tab switching plays existing tactile audio sound FX and applies smooth tab-fade transition.
- Build compiles cleanly (`npm run build`) without errors or broken links.

Adhere strictly to project conventions and rules. Maintain your BRIEFING.md, plan.md, and progress.md in your working directory.
Report completion back to Sentinel when finished.
