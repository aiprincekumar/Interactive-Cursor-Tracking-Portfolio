# Handoff Report: Role State Architecture, Cross-Component Synchronization & URL/localStorage Integration

**Agent:** Explorer 1 (`teamwork_preview_explorer`)  
**Working Directory:** `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_role_1`  
**Target Milestone:** Role State & Cross-Component Synchronization Architecture  
**Status:** Investigation Complete & Strategy Ready for Implementation  

---

## 1. Observation

Direct observations from inspecting the codebase:

### 1.1 Project Structure & State Architecture
- **`src/main.jsx` (Lines 1–11):**
  ```jsx
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  ```
  *Observation:* No React Context Provider is currently mounted at the root level.
- **`src/context/` Directory:**
  *Observation:* Does not exist yet. No global state provider is currently configured in `src/`.
- **`src/App.jsx` (Lines 17–75):**
  *Observation:* State management for cursor variants (`activeCursor`), sound toggling (`soundEnabled`), and motion preferences (`reducedMotion`) is currently kept as local `useState` in `App.jsx` and manually threaded down through component props (e.g. `<Navbar soundEnabled={soundEnabled} ... />`, `<AboutSection soundEnabled={soundEnabled} />`).
  *LocalStorage handling in App.jsx (Lines 33–58):*
  ```javascript
  const [activeCursor, setActiveCursor] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('active_cursor_variant');
      if (saved) return saved;
    }
    return 'butterfly';
  });
  ```
  App.jsx uses lazy state initialization with `typeof window !== 'undefined'` and `try/catch` safety.
- **`src/App.jsx` Component Hierarchy (Lines 95–161):**
  *Observation:* `App.jsx` renders `<Navbar>`, `<HeroSection>`, `<TechMarqueeBanner>`, `<AboutSection>`, `<SkillsSection>`, `<ExperienceSection>`, `<ProjectsSection>`, `<CodingAchievementsSection>`, `<CameraRollGallery>`, `<InteractivePlayground>`, `<ContactSection>`, and `<Footer>`. Any global role context wrapped at the `App.jsx` level will automatically encompass all of these components and their subcomponents (including `<CommandPalette>` and `<ResumeDropdown>`).

### 1.2 Sound Effects System (`src/utils/audio.js`)
- **`src/utils/audio.js` (Lines 4–243):**
  *Observation:* Exports a singleton instance `export const soundFX = new SoundFX();`.
  *Key methods available:*
  - `soundFX.playFocusBeep()`: Clean 1400Hz resonant sine ping (60ms decay), ideal for tab selection.
  - `soundFX.playPop()`: 440Hz -> 880Hz ascending pop, used for clipboard & small confirmations.
  - `soundFX.playChipHover()`: Ultra-light 1760Hz tick (25ms), ideal for tab hover interactions (`onMouseEnter`).
  - `soundFX.playSparkle()`: Multi-tone celebratory arpeggio chime, used for milestones and actions.
  - `soundFX.setEnabled(state)`: Controls audio output. Every sound method internally guards `if (!this.enabled) return;`, ensuring zero unwanted noise when muted.

### 1.3 Existing Tab Implementation in `AboutSection.jsx`
- **`src/components/AboutSection.jsx` (Lines 201–254, 345–385):**
  *Observation:* `AboutSection` provides the benchmark pattern for WAI-ARIA tab semantics in this repository:
  ```jsx
  <div role="tablist" aria-label="About section tabs" aria-orientation="horizontal" onKeyDown={handleKeyDown}>
    {TABS.map((tab) => (
      <button
        key={tab.id}
        role="tab"
        id={`about-tab-${tab.id}`}
        aria-selected={isActive}
        aria-controls={`about-panel-${tab.id}`}
        tabIndex={isActive ? 0 : -1}
        onClick={() => handleTabChange(tab.id, false)}
        onMouseEnter={() => { if (soundEnabled) soundFX.playChipHover(); }}
      >
        ...
      </button>
    ))}
  </div>
  ```
  It handles `ArrowRight`, `ArrowLeft`, `Home`, and `End` keyboard navigation and listens for window custom events (`switch-about-tab`).
- **`src/index.css` (Lines 147–160, 223–225):**
  *Observation:* Defines `.animate-tab-fade`:
  ```css
  @keyframes tabFadeIn {
    0% { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-tab-fade {
    animation: tabFadeIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  ```
  This class is ready-to-use for smooth role-tab view transitions.

### 1.4 Command Palette & Search Catalog (`src/components/CommandPalette.jsx` & `src/utils/searchCatalog.js`)
- **`src/components/CommandPalette.jsx` (Lines 302–335):**
  *Observation:* Selecting a search item currently triggers custom events:
  ```javascript
  if (item.tab === 'qualifications' || item.targetId?.startsWith('edu-')) {
    window.dispatchEvent(new CustomEvent('switch-about-tab', { detail: { tab: 'qualifications' } }));
  }
  if (item.skillKey) {
    window.dispatchEvent(new CustomEvent('select-skill', { detail: { skill: item.skillKey } }));
  }
  if (item.targetId) {
    setTimeout(() => {
      const target = document.getElementById(item.targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        ...
      }
    }, 120);
  }
  ```
  `CommandPalette` is rendered inside `Navbar.jsx`, which is inside `App.jsx`. Adding role switching into `handleSelect` (or via custom events) will automatically switch tabs before the 120ms scroll executes!
- **`src/utils/searchCatalog.js`:**
  *Observation:* Contains all 6 experience items (`exp-tax-consultant`, `exp-senior-accountant`, `exp-mis-executive`, `exp-junks-food`, `exp-smart-card`, `exp-instructor`) and all 4 projects (`proj-gst-tax`, `proj-tally-accounting`, `proj-day-nulm`, `proj-smart-card`), but currently lacks an explicit `role: 'accountant' | 'mis'` attribute.

---

## 2. Logic Chain

1. **State Isolation vs Unified Context:**
   - *Premise:* 5 distinct components (`Navbar`, `AboutSection`, `SkillsSection`, `ExperienceSection`, `ProjectsSection`, plus `CommandPalette`) require synchronized role state.
   - *Inference:* Passing `activeRole` and `setActiveRole` via props through `App.jsx` to all 5 sections and sub-components produces brittle prop-drilling. A dedicated `RoleContext` in `src/context/RoleContext.jsx` ensures instantaneous, zero-cost state distribution without page reloads.

2. **Source of Truth & Synchronization Priority:**
   - *Priority Sequence:*
     1. **URL Query Param (`?role=...`):** Highest priority. Enables direct deep links (e.g. `portfolio.com/?role=mis`) shared with recruiters.
     2. **LocalStorage (`portfolio_selected_role`):** Second priority. Preserves user preference across page reloads when no explicit query parameter is provided.
     3. **Default Role (`accountant`):** Fallback. Ensures deterministic initial state.
   - *Validation Gate:* Any value outside `'accountant'` or `'mis'` must fail closed and fall back to `'accountant'`.

3. **URL Updates Without Page Reload:**
   - *Mechanism:* Use `window.history.replaceState({ role: newRole }, '', url.toString())`.
   - *Rationale:* `replaceState` modifies the address bar dynamically without pushing duplicate historical entries on every tab toggle, while preserving existing path, hash (`#experience`), and other query params.
   - *Browser Navigation (Back/Forward):* Adding a `popstate` event listener ensures that if the visitor navigates history, the React state immediately updates to match the URL query parameter.

4. **Bi-Directional Event Decoupling:**
   - *Mechanism:* In addition to the standard React hook `useRoleTab()`, `RoleProvider` will listen for `window.addEventListener('switch-role-tab', ...)` and dispatch `portfolio-role-change`.
   - *Rationale:* Enables non-React scripts, external modals, or deep links in `CommandPalette` to switch roles seamlessly.

5. **Audio & Micro-Interaction Feedback:**
   - *Mechanism:* Trigger `soundFX.playFocusBeep()` on tab switch and `soundFX.playChipHover()` on button hover.
   - *Rationale:* Matches the tactile feedback established in `AboutSection` and `Navbar`.

---

## 3. Implementation Strategy & Concrete Code Specifications

### 3.1 File Architecture
Create one new context module and one reusable tab component:
1. `src/context/RoleContext.jsx` — Core role state management, URL/localStorage sync, custom hook.
2. `src/components/RoleTabBar.jsx` — Universal horizontal tab ribbon adhering to WAI-ARIA standards.

### 3.2 Concrete Specification: `src/context/RoleContext.jsx`

```jsx
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { soundFX } from '../utils/audio';

export const STORAGE_KEY = 'portfolio_selected_role';
export const DEFAULT_ROLE = 'accountant';

export const ROLE_DATA = {
  accountant: {
    id: 'accountant',
    label: 'Accountant & Tax',
    shortLabel: 'Accountant',
    badge: 'Financial Track',
    description: 'Statutory compliance, Tally Prime ERP, GST & ITR e-filing, and audit readiness.',
    accent: '#FF4D6D',
    bgLight: 'bg-[#FFF0F3]',
    borderLight: 'border-[#FFD1DC]',
    tag: 'Financial Leadership'
  },
  mis: {
    id: 'mis',
    label: 'MIS & Analytics',
    shortLabel: 'MIS & Analytics',
    badge: 'Data & Operations Track',
    description: 'Executive database reporting, DAY-NULM Skill India, cross-district biometric ops, and data analytics.',
    accent: '#3B82F6',
    bgLight: 'bg-blue-50',
    borderLight: 'border-blue-200',
    tag: 'Data & Operations'
  }
};

export const ROLE_TABS = [ROLE_DATA.accountant, ROLE_DATA.mis];

export function isValidRole(role) {
  return role === 'accountant' || role === 'mis';
}

export const RoleContext = createContext(null);

export function RoleProvider({ children, soundEnabled = true }) {
  // 1. Initial State: URL Query Param -> LocalStorage -> Default
  const [activeRole, setActiveRoleState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlRole = params.get('role')?.toLowerCase();
        if (isValidRole(urlRole)) {
          return urlRole;
        }
      } catch {
        // Fallback to localStorage
      }

      try {
        const saved = localStorage.getItem(STORAGE_KEY)?.toLowerCase();
        if (isValidRole(saved)) {
          return saved;
        }
      } catch {
        // Fallback to default
      }
    }
    return DEFAULT_ROLE;
  });

  // 2. Select Role Handler with All Synchronizations
  const selectRole = useCallback((newRole, options = {}) => {
    const { playSound = true, updateUrl = true, force = false } = options;
    if (!isValidRole(newRole)) return;

    setActiveRoleState((currentRole) => {
      if (currentRole === newRole && !force) {
        return currentRole;
      }

      // Persist to localStorage
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, newRole);
        }
      } catch {
        // Ignore quota/security errors in sandboxed environments
      }

      // Synchronize URL query param cleanly without page reload
      if (updateUrl && typeof window !== 'undefined') {
        try {
          const url = new URL(window.location.href);
          url.searchParams.set('role', newRole);
          window.history.replaceState({ role: newRole }, '', url.toString());
        } catch {
          // Ignore
        }
      }

      // Audio feedback
      if (playSound && soundEnabled) {
        soundFX.playFocusBeep();
      }

      // Global window event notification
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('portfolio-role-change', { detail: { role: newRole } }));
      }

      return newRole;
    });
  }, [soundEnabled]);

  // 3. Browser History popstate listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlRole = params.get('role')?.toLowerCase();
        if (isValidRole(urlRole)) {
          selectRole(urlRole, { playSound: false, updateUrl: false, force: true });
        }
      } catch {
        // Ignore
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectRole]);

  // 4. External Custom Event listener (for CommandPalette deep linking)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleExternalSwitch = (e) => {
      const targetRole = e.detail?.role?.toLowerCase();
      if (isValidRole(targetRole)) {
        selectRole(targetRole, { playSound: e.detail?.playSound ?? true });
      }
    };

    window.addEventListener('switch-role-tab', handleExternalSwitch);
    return () => window.removeEventListener('switch-role-tab', handleExternalSwitch);
  }, [selectRole]);

  // 5. Memoized Context Value
  const value = useMemo(() => ({
    activeRole,
    setActiveRole: (role) => selectRole(role),
    selectRole,
    roleData: ROLE_DATA[activeRole],
    allRoles: ROLE_TABS,
    isAccountant: activeRole === 'accountant',
    isMis: activeRole === 'mis'
  }), [activeRole, selectRole]);

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRoleTab() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRoleTab must be used within a RoleProvider');
  }
  return context;
}
```

### 3.3 Reusable Component Specification: `src/components/RoleTabBar.jsx`

A reusable tab bar that implements WAI-ARIA tab semantics, keyboard navigation (`ArrowRight`/`ArrowLeft`/`Home`/`End`), sound FX, and the warm cream/coral visual style:

```jsx
import React, { useRef } from 'react';
import { Briefcase, BarChart3 } from 'lucide-react';
import { useRoleTab, ROLE_TABS } from '../context/RoleContext';
import { soundFX } from '../utils/audio';

const ROLE_ICONS = {
  accountant: Briefcase,
  mis: BarChart3
};

export default function RoleTabBar({ 
  sectionId = 'global', 
  className = '', 
  variant = 'section', // 'section' | 'navbar' | 'compact'
  soundEnabled = true 
}) {
  const { activeRole, selectRole } = useRoleTab();
  const tabButtonRefs = useRef({});

  const handleKeyDown = (e) => {
    const currentIndex = ROLE_TABS.findIndex((t) => t.id === activeRole);
    let nextIndex = -1;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % ROLE_TABS.length;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + ROLE_TABS.length) % ROLE_TABS.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = ROLE_TABS.length - 1;
    }

    if (nextIndex !== -1) {
      const nextRole = ROLE_TABS[nextIndex].id;
      selectRole(nextRole);
      requestAnimationFrame(() => {
        tabButtonRefs.current[nextRole]?.focus();
      });
    }
  };

  if (variant === 'navbar') {
    return (
      <div
        role="tablist"
        aria-label="Portfolio Career Track Switcher"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        className="flex items-center p-1 bg-[#F0EBE1]/80 rounded-full border border-[#E5DFD5] shadow-xs"
      >
        {ROLE_TABS.map((tab) => {
          const isActive = activeRole === tab.id;
          const Icon = ROLE_ICONS[tab.id];
          return (
            <button
              key={tab.id}
              ref={(el) => { tabButtonRefs.current[tab.id] = el; }}
              role="tab"
              id={`nav-role-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-role-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              type="button"
              onClick={() => selectRole(tab.id)}
              onMouseEnter={() => { if (soundEnabled) soundFX.playChipHover(); }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] whitespace-nowrap ${
                isActive
                  ? 'bg-white text-[#18181B] shadow-xs font-bold scale-[1.02]'
                  : 'text-stone-600 hover:text-[#18181B] hover:bg-white/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? (tab.id === 'accountant' ? 'text-[#FF4D6D]' : 'text-blue-500') : 'text-stone-400'}`} />
              <span>{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Default 'section' variant
  return (
    <div
      role="tablist"
      aria-label={`${sectionId} career track selection`}
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
      className={`flex p-1.5 bg-[#FAF8F5] rounded-2xl border border-[#ECE7DF] gap-1.5 max-w-xl mx-auto shadow-xs overflow-x-auto no-scrollbar ${className}`}
    >
      {ROLE_TABS.map((tab) => {
        const isActive = activeRole === tab.id;
        const Icon = ROLE_ICONS[tab.id];
        return (
          <button
            key={tab.id}
            ref={(el) => { tabButtonRefs.current[tab.id] = el; }}
            role="tab"
            id={`${sectionId}-role-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`${sectionId}-role-panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            type="button"
            onClick={() => selectRole(tab.id)}
            onMouseEnter={() => { if (soundEnabled) soundFX.playChipHover(); }}
            className={`flex-1 min-w-[160px] min-h-[44px] flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] whitespace-nowrap ${
              isActive
                ? 'bg-white text-[#18181B] shadow-sm border border-[#E7E2D8]'
                : 'text-stone-600 hover:text-[#18181B] hover:bg-white/60'
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? (tab.id === 'accountant' ? 'text-[#FF4D6D]' : 'text-blue-500') : 'text-stone-400'}`} />
            <span className="truncate">{tab.label}</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 border ${
              isActive
                ? (tab.id === 'accountant' ? 'bg-[#FFF0F3] border-[#FFD1DC] text-[#FF4D6D]' : 'bg-blue-50 border-blue-200 text-blue-600')
                : 'bg-stone-100 border-stone-200 text-stone-500'
            }`}>
              {tab.badge}
            </span>
          </button>
        );
      })}
    </div>
  );
}
```

### 3.4 Mounting in `src/App.jsx`

Wrap the application contents inside `<RoleProvider soundEnabled={soundEnabled}>`:

```jsx
import { RoleProvider } from './context/RoleContext';

export default function App() {
  // ... existing states ...

  return (
    <RoleProvider soundEnabled={soundEnabled}>
      <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] relative selection:bg-[#FF4D6D] selection:text-white overflow-x-hidden">
        {/* ... DynamicCursorManager, Navbar, Sections, Footer ... */}
      </div>
    </RoleProvider>
  );
}
```

### 3.5 Navbar Quick Switcher Integration (`src/components/Navbar.jsx`)
- **Desktop Header:** Place `<RoleTabBar variant="navbar" soundEnabled={soundEnabled} />` adjacent to the nav links or right action group so visitors can toggle tracks at any scroll position.
- **Mobile Drawer:** Place `<RoleTabBar variant="section" soundEnabled={soundEnabled} />` prominently at the top of the mobile drawer menu.

### 3.6 Section-Level Component Integration Guide

#### A. `ExperienceSection.jsx`
- Consume `const { activeRole } = useRoleTab();`
- Render `<RoleTabBar sectionId="experience" className="mb-10" />` right below the section heading.
- Filter the 6 experiences:
  - Tab 1 (`accountant`): `exp-tax-consultant`, `exp-senior-accountant`, `exp-junks-food`.
  - Tab 2 (`mis`): `exp-mis-executive`, `exp-smart-card`, `exp-instructor`.
- Wrap the timeline grid in a tabpanel:
  ```jsx
  <div
    role="tabpanel"
    id={`experience-role-panel-${activeRole}`}
    aria-labelledby={`experience-role-tab-${activeRole}`}
    className="animate-tab-fade"
    key={activeRole}
  >
    {/* 3 filtered experience cards */}
  </div>
  ```

#### B. `ProjectsSection.jsx`
- Consume `const { activeRole } = useRoleTab();`
- Render `<RoleTabBar sectionId="projects" className="mb-12" />`.
- When `activeRole === 'accountant'`:
  - Show Flagship Project 01 (GST & Tax Verification Engine) and Project 02 (Tally Accounting Architecture).
- When `activeRole === 'mis'`:
  - Show Project 03 (DAY-NULM Skill India Portal) and Project 04 (Multi-District Smart Card Operations).
- Wrap views in `.animate-tab-fade` with `key={activeRole}` to ensure fluid animated switching.

#### C. `SkillsSection.jsx`
- Consume `const { activeRole } = useRoleTab();`
- Render `<RoleTabBar sectionId="skills" className="mb-10" />`.
- Tab 1 displays Accounting & Tax stacks (Tally Prime, GST, ITR, Financial Audits, Path Solution ERP).
- Tab 2 displays MIS & Analytics stacks (Executive MIS, Advanced Excel, Government Portals, Hardware/LAN Support, Multi-District Operations).

#### D. `AboutSection.jsx`
- Consume `const { activeRole } = useRoleTab();`
- In Tab 1 ("Story & Vision"):
  - When `activeRole === 'accountant'`: Render the Senior Accountant & Tax narrative with 4 fiscal core competencies.
  - When `activeRole === 'mis'`: Render the MIS Executive & Data Systems narrative with 4 operational data competencies.

#### E. `CommandPalette.jsx` & `searchCatalog.js`
- In `searchCatalog.js`, tag each relevant item with `role: 'accountant'` or `role: 'mis'`.
- In `CommandPalette.jsx` `handleSelect`:
  ```javascript
  if (item.role) {
    window.dispatchEvent(new CustomEvent('switch-role-tab', { detail: { role: item.role, playSound: false } }));
  }
  ```
  This immediately switches the active role so the corresponding element is mounted in the DOM before `item.targetId` scrolls into view!

---

## 4. Caveats

1. **Storage Sandboxing:** In incognito windows or embedded cross-origin iframes, accessing `localStorage` can throw `SecurityError`. All `localStorage` reads and writes are safely enclosed in `try ... catch` blocks with graceful fallbacks.
2. **URL Search Parameter Persistence:** Updating `window.history.replaceState` must preserve existing pathnames and hash anchors (e.g. `/#experience`). The implementation constructs a clean URL object: `new URL(window.location.href)` to preserve all hash and path fragments.
3. **No Unwanted History Stacking:** Using `replaceState` rather than `pushState` avoids spamming the browser's Back button history on rapid tab toggles, while the `popstate` listener still correctly handles browser Back/Forward navigation if history points exist.
4. **Read-Only Scope Compliance:** This explorer agent has not modified any source code. Implementation must be performed by the designated Worker agent.

---

## 5. Conclusion

- A dedicated `RoleContext.jsx` and reusable `RoleTabBar.jsx` provide a 100% compliant, fully synchronized, accessible architecture.
- Default role is `'accountant'` ("Accountant & Tax" / "Financial Track").
- Full dual-way synchronization:
  - Reading `?role=accountant` or `?role=mis` on mount.
  - Persisting to `localStorage` under `portfolio_selected_role`.
  - Updating URL via `window.history.replaceState` cleanly without page reload.
  - Listening to browser `popstate` events.
  - Responding to external `switch-role-tab` custom events.
- All 6 experiences, 4 projects, and skills are seamlessly preserved and mapped across the two career tracks.

---

## 6. Verification Method

1. **Compile & Lint Verification:**
   ```bash
   npm run build
   npx oxlint
   ```
   Both commands must exit with code 0.

2. **State & Synchronization Verification:**
   - **Default Mount:** Open `http://localhost:5173/` in a clean browser. Active tab across all sections must be "Accountant & Tax" [Financial Track].
   - **Cross-Component Sync:** Click "MIS & Analytics" in Navbar. Verify:
     - AboutSection, SkillsSection, ExperienceSection, and ProjectsSection switch immediately to MIS content without page reload.
     - Browser URL updates to `http://localhost:5173/?role=mis`.
     - `localStorage.getItem('portfolio_selected_role')` evaluates to `"mis"`.
     - Tactile audio chime plays (if sound unmuted).
   - **Deep Link Mount:** Open `http://localhost:5173/?role=mis` directly. Verify initial load selects "MIS & Analytics".
   - **Command Palette Deep Link:** Press `Cmd+K`, search for "DAY-NULM" or "Smart Card", press Enter. Verify:
     - Active role switches to "MIS & Analytics".
     - Page smoothly scrolls to the corresponding project/experience card.
   - **Browser Navigation:** Click Back button. Verify role switches back to previous role without page reload.
