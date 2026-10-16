# Project: Synchronized Horizontal Role Tabs Architecture

## Architecture
Synchronized horizontal role tabs across the interactive portfolio cleanly separate and showcase two distinct career tracks of Atul Kant Verma:
- **Track 1 (`accountant`):** "Accountant & Tax" [Badge: "Financial Track", Accent: `#FF4D6D`]
- **Track 2 (`mis`):** "MIS & Analytics" [Badge: "Data & Operations Track", Accent: `#3B82F6`]

### Architectural Layers
1. **Core State Layer (`src/context/RoleContext.jsx`)**:
   - Centralized `RoleProvider` providing `activeRole`, `setActiveRole`, `selectRole`, `useRoleTab()`, and metadata constants (`ROLE_TRACKS`).
   - Deterministic precedence: URL query param (`?role=accountant` | `?role=mis`) -> `localStorage.getItem('portfolio_selected_role')` -> default `'accountant'`.
   - Dynamic URL synchronization via `window.history.replaceState` preserving current path, hashes (`#experience`), and queries without page reload.
   - Browser navigation support via `window.addEventListener('popstate', ...)`.
   - Window custom event bus: listens for `switch-role-tab` and dispatches `portfolio-role-change`.
2. **Component & Section Presentation Layer**:
   - `src/components/RoleTabsBar.jsx`: Reusable WAI-ARIA tab ribbon (`role="tablist"`, `role="tab"`, ArrowRight/Left keyboard navigation, `.animate-tab-fade`, sound effects).
   - `src/components/Navbar.jsx`: Header Quick Switcher pill (desktop pill before Search button, mobile in-header pill, and mobile drawer role selector).
   - `src/components/ExperienceSection.jsx`: 3 Accountant roles in Tab 1, 3 MIS roles in Tab 2.
   - `src/components/ProjectsSection.jsx`: 2 Accountant projects in Tab 1, 2 MIS projects in Tab 2.
   - `src/components/SkillsSection.jsx`: 8 Accounting skills in Tab 1, 8 MIS/Data/IT skills in Tab 2.
   - `src/components/AboutSection.jsx`: Dynamic executive story and core competencies adapt to active role tab.
3. **Deep Linking & Command Palette Layer**:
   - `src/utils/searchCatalog.js`: Mapped all 51 items with explicit `role: 'accountant' | 'mis' | 'both'`.
   - `src/components/CommandPalette.jsx`: Selecting an item dispatches role switch before smooth scroll with safe 160ms delay.

---

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Global Role State & Hook | `RoleContext.jsx` with activeRole, default 'accountant', localStorage, URL sync (`?role=`) & popstate | M1 | Survey (Explorer 1) |
| F2 | Reusable RoleTabsBar Component | Accessible horizontal tabbar (`#FAF8F5`, `#FF4D6D`, WAI-ARIA, arrow key navigation, audio FX) | M1 | Survey (Explorer 1 & 2) |
| F3 | Section Tabs: Experience | Filter 3 Accountant roles (Tab 1) and 3 MIS roles (Tab 2) with zero content loss | M1 | Survey (Explorer 2) |
| F4 | Section Tabs: Projects | Filter 2 Accountant projects (Tab 1) and 2 MIS projects (Tab 2) with interactive simulators | M1 | Survey (Explorer 2) |
| F5 | Section Tabs: Skills | Categorize 8 Accountant skills (Tab 1) and 8 MIS/Data skills (Tab 2) with active card inspector | M1 | Survey (Explorer 2) |
| F6 | Section Tabs: About | Dynamically adapt Story & Vision and 4 Core Competencies to active role | M1 | Survey (Explorer 2) |
| F7 | Header Quick Switcher | Compact role switcher pill in Navbar (desktop before Search, mobile header, and drawer) | M1 | Survey (Explorer 3) |
| F8 | Search Catalog & Command Palette Deep Linking | Role tagging on 51 search items, auto-switching role before scrolling to hidden items | M1 | Survey (Explorer 3) |

---

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Synchronized Horizontal Role Tabs | Full implementation of F1-F8, build compilation & lint verification | None | READY_FOR_DISPATCH |

---

## Interface Contracts
### Role State Contract (`src/context/RoleContext.jsx`)
```typescript
interface RoleTrack {
  id: 'accountant' | 'mis';
  label: string;
  shortLabel: string;
  badge: string;
  accent: string;
}

interface RoleContextValue {
  activeRole: 'accountant' | 'mis';
  setActiveRole: (role: 'accountant' | 'mis') => void;
  selectRole: (role: 'accountant' | 'mis', source?: string) => void;
  activeTrack: RoleTrack;
  isAccountant: boolean;
  isMIS: boolean;
  ROLE_TRACKS: RoleTrack[];
}
```

### Window Custom Event Contracts
- Inbound: `window.dispatchEvent(new CustomEvent('switch-role-tab', { detail: { role: 'accountant' | 'mis' } }))`
- Outbound: `window.dispatchEvent(new CustomEvent('portfolio-role-change', { detail: { role: 'accountant' | 'mis' } }))`

---

## Code Layout
- `src/context/RoleContext.jsx`: Global role provider and `useRoleTab()` hook.
- `src/components/RoleTabsBar.jsx`: Reusable horizontal tab bar component with WAI-ARIA compliance.
- `src/components/Navbar.jsx`: Integrated desktop & mobile quick switcher pill.
- `src/components/CommandPalette.jsx`: Deep-linking role switch before scroll.
- `src/utils/searchCatalog.js`: Role attributes added to all 51 search catalog items.
- `src/components/ExperienceSection.jsx`: Partitioned 3 accountant + 3 MIS roles.
- `src/components/ProjectsSection.jsx`: Partitioned 2 accountant + 2 MIS projects.
- `src/components/SkillsSection.jsx`: Partitioned 8 accountant + 8 MIS skills.
- `src/components/AboutSection.jsx`: Dynamic executive story & core competency adaptation.
- `src/App.jsx`: Wrapped with `<RoleProvider>`.
