# Investigation Report: Section-Level Horizontal Tabs & Data Categorization

## 1. Observation

Direct code observations from source files:

1. **`src/components/ExperienceSection.jsx`**:
   - Lines 5-120: `EXPERIENCES` array contains 6 complete professional roles:
     * `exp-01` (`exp-tax-consultant`, lines 6-24): "GST & Income Tax Consultant", Independent Tax Consultancy Practice, 2023 — PRESENT. Accent: `#FF4D6D`.
     * `exp-02` (`exp-senior-accountant`, lines 26-43): "Senior Tally Accountant", Commercial & Retail Enterprises, 2022 — PRESENT. Accent: `#10B981`.
     * `exp-03` (`exp-mis-executive`, lines 45-62): "MIS Executive", DAY-NULM (National Urban Livelihoods Mission), 2021 — 2023. Accent: `#8B5CF6`.
     * `exp-04` (`exp-junks-food`, lines 64-81): "Accountant & Inventory Controller", Junks Food Agency, 2020 — 2022. Accent: `#F59E0B`.
     * `exp-05` (`exp-smart-card`, lines 83-100): "Smart Card Operations Specialist", Regional E-Governance & Citizen ID Project, 2019 — 2021. Accent: `#3B82F6`.
     * `exp-06` (`exp-instructor`, lines 102-119): "Computer Instructor & Academic Tutor", Computer Training Institute & Private Academy, 2018 — 2020. Accent: `#EC4899`.
   - Lines 143-161: Section header with title, subtitle, and static period badge (`2018 — 2026 • 7+ Years of Multifaceted Operations & Accounting`).
   - Lines 164-250: Direct mapping over all 6 experiences into a `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`.

2. **`src/components/ProjectsSection.jsx`**:
   - Lines 6-39: `COMPANION_PROJECTS` array contains:
     * `03` (`proj-day-nulm`): "DAY-NULM Skill India MIS Reporting Portal", Category: "Govt Operations & Analytics".
     * `04` (`proj-smart-card`): "Multi-District Smart Card Operations & Enrollment Engine", Category: "Field Operations & Data Systems".
   - Lines 97-251: Flagship Project 01 (`proj-gst-tax`): "GST & Income Tax Compliance & Verification Engine" with interactive statutory ITC reconciliation audit simulation (`runAuditSimulation`).
   - Lines 254-405: Flagship Project 02 (`proj-tally-accounting`): "Tally Financial Accounting & Inventory Management" with interactive double-entry circular state machine (`paymentState` cycles 'processing', 'success', 'failed').
   - Lines 408-479: Grid rendering companion projects 03 and 04 at the bottom.

3. **`src/components/SkillsSection.jsx`**:
   - Lines 4-205: `SKILL_DATA` dictionary contains 16 skills with `level`, `tag`, and `points` list:
     * Accounting & Tax (4): 'Tally Prime & ERP 9', 'GST Filing & Compliance', 'Income Tax E-Filing', 'Financial Auditing & Ledgers'.
     * Software & Applications (4): 'MS Excel (Advanced)', 'MS Office (Word & PPT)', 'DTP Design Suite', 'Path Solution ERP'.
     * IT Systems & Hardware (4): 'Windows OS Administration', 'Commercial Computing & Office IT Suite', 'Hardware Diagnosis & Maintenance', 'Network & Software Support'.
     * Management & Operations (4): 'Office Administration', 'Stock Handling & Logistics', 'MIS Reporting & Analytics', 'Business Development'.
   - Lines 207-224: `CATEGORIES` array groups skills into 4 categories.
   - Lines 230-244: State `selectedSkill` with custom event listener for `select-skill`.
   - Lines 265-300: Categorized pill matrix in left column.
   - Lines 303-347: Active skill inspection card in right column (dark charcoal `#18181B`).

4. **`src/components/AboutSection.jsx`**:
   - Lines 26-45: 3 internal tabs: `story` (Executive Narrative), `qualifications` (Academic Timeline), `biodata` (Verified Dossier).
   - Lines 48-89: `CORE_COMPETENCIES` array of 4 pillars:
     * Statutory Compliance & GST/ITR
     * Audit Readiness & Financial Reporting
     * Tally Prime & ERP Architecture
     * Financial MIS & Operations
   - Lines 346-385: Accessible tab ribbon with `role="tablist"`, `role="tab"`, Arrow key navigation (`handleKeyDown`), and `.animate-tab-fade` class on panels (lines 397, 489, 589).
   - Lines 401-412: 3-paragraph executive narrative.
   - Lines 415-428: Career Vision & Strategic Objective statement.

5. **`src/index.css`**:
   - Lines 147-160: `.animate-tab-fade` is already implemented:
     ```css
     @keyframes tabFadeIn {
       0% { opacity: 0; transform: translateY(8px); }
       100% { opacity: 1; transform: translateY(0); }
     }
     .animate-tab-fade {
       animation: tabFadeIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
     }
     ```
   - Lines 204-226: Accessibility reduced motion handler disables `.animate-tab-fade`.

6. **`src/utils/audio.js`**:
   - Synthesizer methods: `soundFX.playFocusBeep()`, `soundFX.playPop()`, `soundFX.playChipHover()`, `soundFX.playRibbonToggle()`, `soundFX.playSparkle()`.

---

## 2. Logic Chain

1. **Role Partitioning & Zero Data Loss Guarantee**:
   - From Observation 1: `ExperienceSection` has 6 roles. By assigning:
     * Tab 1 (`accountant`): `exp-01` (GST/Tax Consultant), `exp-02` (Senior Tally Accountant), `exp-04` (Junks Food FMCG Accountant).
     * Tab 2 (`mis`): `exp-03` (DAY-NULM MIS Executive), `exp-05` (Smart Card Operations Specialist), `exp-06` (Computer Instructor & Academic Tutor).
     -> Exactly 3 roles per track. Total: 6 roles. No role is omitted, duplicate, or misplaced.
   - From Observation 2: `ProjectsSection` has 4 projects. By assigning:
     * Tab 1 (`accountant`): Project 01 (GST & Income Tax Compliance & Verification Engine), Project 02 (Tally Financial Accounting & Inventory Management).
     * Tab 2 (`mis`): Project 03 (DAY-NULM Skill India MIS Reporting Portal), Project 04 (Multi-District Smart Card Operations & Enrollment Engine).
     -> Exactly 2 flagship projects per track. All 4 projects are retained and highlighted with their operational metrics.
   - From Observation 3: `SkillsSection` has 16 skills. By partitioning into 2 domain groups of 8:
     * Tab 1 (`accountant`): Tally Prime & ERP 9, GST Filing & Compliance, Income Tax E-Filing, Financial Auditing & Ledgers, Path Solution ERP, Stock Handling & Logistics, Office Administration, Business Development.
     * Tab 2 (`mis`): MS Excel (Advanced), MIS Reporting & Analytics, MS Office (Word & PPT), Commercial Computing & Office IT Suite (ADCA), Windows OS Administration, Hardware Diagnosis & Maintenance, Network & Software Support, DTP Design Suite.
     -> Exactly 8 skills per track. Total: 16 skills. Zero skill definitions are deleted.
   - From Observation 4: `AboutSection` contains Executive Story & Vision, Qualifications (ADCA, I.A., Matriculation), and Bio-Data Dossier. By retaining Qualifications and Bio-Data universally, and adapting the Story & Vision narrative + 4 Core Competency pillars dynamically based on active role:
     * Tab 1 (`accountant`): Focuses on 7+ years of statutory tax compliance, double-entry ledgers, and audit governance.
     * Tab 2 (`mis`): Focuses on 5+ years of public-sector MIS, SDMS portal synchronization, 4-district biometric logistics, and IT infrastructure administration.
     -> Career story matches the chosen track while all personal credentials remain verified.

2. **Horizontal Tabs UI Pattern Design**:
   - Reusable `RoleTabsBar` adheres to the established visual design system:
     * Warm background: `#FAF8F5`
     * Active pill indicator: `bg-white text-[#18181B] shadow-sm border border-[#E7E2D8]`
     * Inactive button: `text-stone-600 hover:text-[#18181B] hover:bg-white/60`
     * Track badge: `#FFF0F3` background with `#FF4D6D` text and `#FFD1DC` border
   - WAI-ARIA Semantics:
     * `role="tablist"`, `aria-label="Career track selector"`, `aria-orientation="horizontal"`
     * `role="tab"`, `aria-selected={activeRole === id}`, `aria-controls={`${sectionId}-panel-${id}`}`, `tabIndex={activeRole === id ? 0 : -1}`
     * `role="tabpanel"`, `id={`${sectionId}-panel-${activeRole}`}`, `tabIndex={0}`
   - Keyboard Navigation:
     * `ArrowRight` / `ArrowLeft` with circular modulo wrapping (`(idx +/- 1 + len) % len`).
     * `Home` / `End` jumping to boundary tabs.
     * Focus ring: `focus-visible:ring-2 focus-visible:ring-[#FF4D6D]`.
   - Animation & Audio:
     * Container triggers `.animate-tab-fade` via `key={activeRole}` on tabpanel element.
     * `soundFX.playFocusBeep()` on tab click, `soundFX.playChipHover()` on hover.

---

## 3. Caveats

1. **State Ownership**:
   Explorer 1 is designing the global `RoleContext` / `useRoleTab()` hook. The section components designed here should consume `activeRole` and `setRole` either via `useRoleTab()` or via props passed from `App.jsx`.
2. **Deep-Link Scrolling Order**:
   When deep linking to an item from the Command Palette or URL hash, the role tab MUST switch before or simultaneously with the scroll action, otherwise the target DOM element may not be mounted in the active tabpanel.
3. **Interactive Simulator Preservation**:
   In `ProjectsSection.jsx`, the Audit Simulator and Double-Entry State Machine must remain interactive in Tab 1, and in Tab 2, Project 03 and Project 04 should be rendered with equal visual quality and interactive status telemetry.

---

## 4. Conclusion

The data categorization and section-level horizontal tab architecture for all 4 sections is fully specified with 100% preservation of all 6 experiences, 4 projects, 16 skills, and verified About credentials.

### Detailed Implementation Blueprint

#### A. Reusable Component: `src/components/RoleTabsBar.jsx`
```jsx
import React, { useRef } from 'react';
import { Briefcase, BarChart2 } from 'lucide-react';
import { soundFX } from '../utils/audio';

export const ROLE_TRACKS = [
  {
    id: 'accountant',
    label: 'Accountant & Tax',
    badge: 'Financial Track',
    icon: Briefcase,
    accent: '#FF4D6D'
  },
  {
    id: 'mis',
    label: 'MIS & Analytics',
    badge: 'Data & Operations Track',
    icon: BarChart2,
    accent: '#3B82F6'
  }
];

export default function RoleTabsBar({
  activeRole = 'accountant',
  onSelectRole,
  soundEnabled = true,
  sectionId = 'section',
  className = ''
}) {
  const tabButtonRefs = useRef({});

  const handleTabClick = (roleId) => {
    if (roleId === activeRole) return;
    if (soundEnabled) soundFX.playFocusBeep();
    if (onSelectRole) onSelectRole(roleId);
  };

  const handleKeyDown = (e) => {
    const currentIndex = ROLE_TRACKS.findIndex((t) => t.id === activeRole);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % ROLE_TRACKS.length;
      const nextRole = ROLE_TRACKS[nextIndex].id;
      handleTabClick(nextRole);
      tabButtonRefs.current[nextRole]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + ROLE_TRACKS.length) % ROLE_TRACKS.length;
      const prevRole = ROLE_TRACKS[prevIndex].id;
      handleTabClick(prevRole);
      tabButtonRefs.current[prevRole]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      const firstRole = ROLE_TRACKS[0].id;
      handleTabClick(firstRole);
      tabButtonRefs.current[firstRole]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      const lastRole = ROLE_TRACKS[ROLE_TRACKS.length - 1].id;
      handleTabClick(lastRole);
      tabButtonRefs.current[lastRole]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Career track selector"
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
      className={`inline-flex items-center p-1.5 bg-[#FAF8F5] rounded-2xl border border-[#ECE7DF] gap-1.5 shadow-2xs select-none max-w-full overflow-x-auto no-scrollbar ${className}`}
    >
      {ROLE_TRACKS.map((track) => {
        const isActive = activeRole === track.id;
        const Icon = track.icon;
        return (
          <button
            key={track.id}
            ref={(el) => { tabButtonRefs.current[track.id] = el; }}
            role="tab"
            id={`${sectionId}-tab-${track.id}`}
            aria-selected={isActive}
            aria-controls={`${sectionId}-panel-${track.id}`}
            tabIndex={isActive ? 0 : -1}
            type="button"
            onClick={() => handleTabClick(track.id)}
            onMouseEnter={() => {
              if (soundEnabled) soundFX.playChipHover();
            }}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-1 whitespace-nowrap ${
              isActive
                ? 'bg-white text-[#18181B] shadow-sm border border-[#E7E2D8]'
                : 'text-stone-600 hover:text-[#18181B] hover:bg-white/60'
            }`}
          >
            <Icon className={`w-3.5 sm:w-4 h-3.5 sm:h-4 shrink-0 transition-colors ${isActive ? 'text-[#FF4D6D]' : 'text-stone-400'}`} />
            <span>{track.label}</span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold transition-colors ${
                isActive
                  ? 'bg-[#FFF0F3] border border-[#FFD1DC] text-[#FF4D6D]'
                  : 'bg-stone-100/70 border border-stone-200/50 text-stone-500'
              }`}
            >
              {track.badge}
            </span>
          </button>
        );
      })}
    </div>
  );
}
```

#### B. `ExperienceSection.jsx` Refactoring Blueprint
- **Categorization Logic**:
  ```javascript
  const ACCOUNTANT_EXPERIENCES = ['exp-01', 'exp-02', 'exp-04'];
  const MIS_EXPERIENCES = ['exp-03', 'exp-05', 'exp-06'];
  const filteredExperiences = EXPERIENCES.filter(exp => 
    activeRole === 'mis' ? MIS_EXPERIENCES.includes(exp.id) : ACCOUNTANT_EXPERIENCES.includes(exp.id)
  );
  ```
- **Header Badge Adaptation**:
  - `activeRole === 'accountant'`: `"2020 — 2026 • 4+ Years Core Accounting & 3+ Years Tax Practice"`
  - `activeRole === 'mis'`: `"2018 — 2023 • 5+ Years Public Sector MIS & Field Operations"`
- **Tab Panel Wrapper**:
  ```jsx
  <div
    role="tabpanel"
    id={`experience-panel-${activeRole}`}
    aria-labelledby={`experience-tab-${activeRole}`}
    tabIndex={0}
    key={activeRole}
    className="animate-tab-fade grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative focus:outline-none"
  >
    {filteredExperiences.map((exp) => ( ... ))}
  </div>
  ```

#### C. `ProjectsSection.jsx` Refactoring Blueprint
- **Categorization Logic**:
  - `activeRole === 'accountant'`:
    * Project 01: GST & Income Tax Compliance & Verification Engine (with live ITC audit simulator)
    * Project 02: Tally Financial Accounting & Inventory Management (with live double-entry state machine)
  - `activeRole === 'mis'`:
    * Project 03: DAY-NULM Skill India MIS Reporting & Analytics Portal (Candidate lifecycle, batch certification, SDMS sync telemetry)
    * Project 04: Multi-District Smart Card Operations & Enrollment Engine (4 districts, biometric verification, card chip encoding)
- **Header Standard Card**:
  - `activeRole === 'accountant'`: `"100% Statutory Adherence • Audit Ready"`
  - `activeRole === 'mis'`: `"99.8% Data Accuracy • 4-District Verification"`
- **Tab Panel Wrapper**:
  ```jsx
  <div
    role="tabpanel"
    id={`projects-panel-${activeRole}`}
    aria-labelledby={`projects-tab-${activeRole}`}
    tabIndex={0}
    key={activeRole}
    className="animate-tab-fade space-y-14 focus:outline-none"
  >
    {activeRole === 'accountant' ? (
      <>
        {/* Render Flagship 01 and Flagship 02 */}
      </>
    ) : (
      <>
        {/* Render Project 03 and Project 04 in flagship showcase cards */}
      </>
    )}
  </div>
  ```

#### D. `SkillsSection.jsx` Refactoring Blueprint
- **Categorization Logic**:
  ```javascript
  const ACCOUNTANT_CATEGORIES = [
    {
      name: 'Accounting & Statutory Tax',
      skills: ['Tally Prime & ERP 9', 'GST Filing & Compliance', 'Income Tax E-Filing', 'Financial Auditing & Ledgers']
    },
    {
      name: 'Commercial & Agency Operations',
      skills: ['Path Solution ERP', 'Stock Handling & Logistics', 'Office Administration', 'Business Development']
    }
  ];

  const MIS_CATEGORIES = [
    {
      name: 'Data Analytics & Software Suites',
      skills: ['MS Excel (Advanced)', 'MIS Reporting & Analytics', 'MS Office (Word & PPT)', 'Commercial Computing & Office IT Suite']
    },
    {
      name: 'IT Systems & Field Hardware',
      skills: ['Windows OS Administration', 'Hardware Diagnosis & Maintenance', 'Network & Software Support', 'DTP Design Suite']
    }
  ];
  ```
- **Auto-Sync Active Skill on Track Switch**:
  - If current `selectedSkill` is not in active category list:
    * Switching to `'mis'` sets `selectedSkill` to `'MS Excel (Advanced)'`.
    * Switching to `'accountant'` sets `selectedSkill` to `'Tally Prime & ERP 9'`.
- **Left Column Matrix Wrapper**:
  ```jsx
  <div key={activeRole} className="animate-tab-fade lg:col-span-7 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E2D8] shadow-md shadow-stone-900/5">
    {activeCategories.map((cat) => ( ... ))}
  </div>
  ```

#### E. `AboutSection.jsx` Refactoring Blueprint
- **Categorization Logic**:
  - Insert `RoleTabsBar` in AboutSection header.
  - When `activeRole === 'accountant'`:
    * Narrative Paragraphs highlight double-entry bookkeeping, Tally Prime, statutory GST returns, ITR filings, and audit readiness.
    * Strategic Objective: Leadership in Statutory Tax Governance & Financial Accounting.
    * 4 Core Competency Pillars:
      1. Statutory Compliance & GST/ITR (Direct & Indirect Tax, GSTR-1/3B/2B)
      2. Audit Readiness & Financial Reporting (Fiscal Governance, Trial Balance, P&L, Balance Sheet)
      3. Tally Prime & ERP Architecture (Multi-company master, BRS, Inventory Valuation)
      4. Commercial Tax Advisory & Client Retention (Client Acquisition, Notice mitigation)
  - When `activeRole === 'mis'`:
    * Narrative Paragraphs highlight government database management (DAY-NULM Skill India), biometric operations across 4 districts in Bihar & Jharkhand, Advanced Excel modeling, and ADCA computing infrastructure.
    * Strategic Objective: Leadership in Public/Corporate Sector MIS, Database Operations, and IT Systems Administration.
    * 4 Core Competency Pillars:
      1. Government MIS & SDMS Portal Administration (Skill India DAY-NULM, 2,500+ trainees)
      2. Advanced Excel & Financial Modeling (Executive KPI Dashboards, XLOOKUP, Arrays)
      3. Multi-District Biometric Field Operations (4 districts, 50,000+ cards issued)
      4. IT Infrastructure & Office Technology (ADCA credentials, Windows OS, Hardware triage)
  - Tabs 2 (`qualifications`) and 3 (`biodata`) remain constant and universally accessible.

---

## 5. Verification Method

To independently verify the categorization and tab pattern:

1. **Static Analysis & Data Audit**:
   - Count items in `ExperienceSection.jsx`: Tab 1 has 3 roles (`exp-01`, `exp-02`, `exp-04`), Tab 2 has 3 roles (`exp-03`, `exp-05`, `exp-06`). Sum = 6.
   - Count items in `ProjectsSection.jsx`: Tab 1 has Projects 01 & 02; Tab 2 has Projects 03 & 04. Sum = 4.
   - Count items in `SkillsSection.jsx`: Tab 1 has 8 skills; Tab 2 has 8 skills. Sum = 16.
   - In `AboutSection.jsx`: verify ADCA, I.A., and Matriculation are present in Qualifications; verify all 6 demographic items and permanent address are present in Bio-Data.

2. **Accessibility Inspection**:
   - Verify all tab buttons have `role="tab"`, valid `aria-selected`, `aria-controls`, and `tabIndex` (0 for active, -1 for inactive).
   - Verify tablist has `role="tablist"` and `aria-label`.
   - Verify panel has `role="tabpanel"` and matching `id`.

3. **Keyboard Navigation Verification**:
   - Focus on any tab button and press `ArrowRight` -> focus moves to adjacent tab.
   - Press `ArrowLeft` from the first tab -> focus wraps to the second tab.

4. **Build Verification**:
   - Run `npm run build` in the project root to guarantee clean compilation with zero syntax or lint errors.
