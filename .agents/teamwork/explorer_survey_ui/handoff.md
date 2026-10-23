# UI Survey & R2 Architecture Handoff Report

**Agent**: `explorer_survey_ui` (UI Survey Explorer)  
**Parent**: `d9b94e64-c3ce-47b0-9eeb-923492665270`  
**Date**: 2026-10-23T05:10:00Z  
**Scope**: Full UI/UX audit, existing component state, event interfaces, styling system, WCAG 2.2 AA compliance, and implementation blueprint for R2.

---

## 1. Observation

### 1.1 Existing Component: `AIChatWidget.jsx`
- **Location**: `src/components/AIChatWidget.jsx` (Lines 1–397).
- **Mounting**: Lazy-loaded in `src/App.jsx` at line 35 (`const AIChatWidget = lazyWithRetry(() => import('./components/AIChatWidget'), 'AIChatWidget')`) and rendered as `<AIChatWidget />` at line 441 with **zero props**.
- **Internal State**:
  - `isOpen` (boolean, initial: `false`): Lines 25, 216 (`if (!isOpen) return null`).
  - `isMinimized` (boolean, initial: `false`): Lines 26, 226–231.
  - `messages` (array): Lines 27–34 initialized with welcome message:
    ```javascript
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hi there! 👋 I am Atul's AI Assistant preview. Feel free to ask about Atul's projects, experience, or tech stack!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    ```
  - `inputValue` (string, initial: `''`): Line 35.
  - `isTyping` (boolean, initial: `false`): Line 36 (600ms simulated timeout in `typingTimeoutRef`).
- **Context Consumption**:
  - `useLab()`: Lines 43–52 extracting `soundEnabled` (default `true`) and `isDrawerOpen` (default `false`).
- **Event Listeners & Dispatchers**:
  - Inbound listener on `window`: `'portfolio:open-ai-chat'` (Line 84). Opens widget, handles tablet auto-minimize, plays sound FX (`soundFX.playSparkle()` or `soundFX.playFocusBeep()`), focuses `inputRef.current` after 150ms.
  - Outbound dispatch on `window`: `'portfolio:ai-chat-state'` (Line 92) with detail `{ isOpen, isMinimized }`.
- **Layout & Positioning Constraints**:
  - Container classes (Lines 223–231):
    ```css
    fixed bottom-0 z-[55] select-none transition-all duration-300 ease-out flex flex-col overflow-hidden 
    bg-[#FAF8F5]/95 dark:bg-[#161122]/95 backdrop-blur-md shadow-2xl border-[#E7E2D8] dark:border-[#2D2340] 
    left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0
    ${isDrawerOpen ? 'sm:right-[540px]' : 'sm:right-28'}
    ```
  - Minimized dimensions: `w-[280px] sm:w-[320px] ${isDrawerOpen ? 'sm:max-w-[calc(100vw-560px)]' : ''} h-13 rounded-t-xl rounded-b-none border-t border-x border-b-0`
  - Expanded dimensions: `w-[95vw] sm:w-[380px] max-w-[400px] ${isDrawerOpen ? 'sm:max-w-[calc(100vw-560px)] sm:min-w-[260px]' : ''} h-[500px] max-h-[82vh] rounded-t-2xl rounded-b-none border-t border-x border-b-0`
  - Tablet auto-minimize rule (Lines 102–105, 112–115): `if (isDrawerOpen && window.innerWidth < 960) setIsMinimized(true)`.

### 1.2 Existing Test Assertions in `scripts/verify_ai_chat_feature.mjs`
Direct examination of `scripts/verify_ai_chat_feature.mjs` reveals 22 strict literal assertions in suite 1:
1. `fixed bottom-0 z-[55]` (Line 40)
2. `backdrop-blur-md` (Line 41)
3. `shadow-2xl` (Line 42)
4. `rounded-t-2xl rounded-b-none border-t border-x border-b-0` (Line 43)
5. `isDrawerOpen ? 'sm:right-[540px]' : 'sm:right-28'` (Line 44)
6. `sm:max-w-[calc(100vw-560px)]` (Line 45)
7. `window.innerWidth < 960` (Line 46)
8. `h-[500px] max-h-[82vh]` (Line 47)
9. `BotMessageSquare` (Line 51)
10. `animate-ping` (Line 52)
11. `Atul AI Assistant` (Line 53)
12. `Copilot Ready` (Line 54)
13. `handleToggleMinimize` (Line 58)
14. `handleClose` (Line 59)
15. `h-13 rounded-t-xl rounded-b-none border-t border-x border-b-0` (Line 60)
16. `Hi there! 👋 I am Atul's AI Assistant preview` (Line 64)
17. `🚀 Featured Projects` (Line 65)
18. `💻 Core Tech Stack` (Line 66)
19. `💼 Experience Summary` (Line 67)
20. `📬 How to Contact` (Line 68)
21. `window.addEventListener('portfolio:open-ai-chat'` (Line 72)
22. `new CustomEvent('portfolio:ai-chat-state'` (Line 73)

All existing 38 test suites (`npm test`) currently pass with code 0.

### 1.3 Floating Action Hub: `src/components/FloatingActionHub.jsx`
- **Location**: `src/components/FloatingActionHub.jsx` (Lines 1–604).
- **Speed-Dial Array Ordering** (Lines 304–441):
  - Renders child items in `flex-col-reverse` with staggered animation.
  - Item 0 (bottom-most speed-dial child, directly above Master FAB):
    - `id: 'ai-chat'`, `label: 'AI Chat (असिस्टेंट)'`, icon `<BotMessageSquare ... />`, onClick dispatches `'portfolio:open-ai-chat'`.
  - Item 1: `whatsapp-direct` (visible when contact unlocked).
  - Item 2: `lab-studio` (Control Center, hidden in Simple Mode).
  - Item 3: `audience-filter` (toggles `AudienceFloatingPill`).
  - Item 4: `view-mode` (toggles `ViewModeFloatingPill`).
- **State Emitted**: Dispatches `'floating_hub_state'` with `{ isOpen, itemCount }` (Line 465).

### 1.4 Context System
1. **`RoleContext.jsx`** (`src/context/RoleContext.jsx`):
   - Hook: `useRole()` or `useRoleTab()`.
   - Exported Roles: `ROLE_TRACKS` containing `overview`, `accountant` (default), `mis`, `vibe_coding`, `other`.
   - State: `activeRole` ('accountant' | 'mis' | 'vibe_coding' | 'other' | 'overview').
   - Track Object: `activeTrack` / `roleData` with `id`, `label`, `shortLabel`, `accent`, `badge`, `heroTitle`, `heroSubtitle`.
   - Action: `selectRole(newRole, { playSound: true, updateUrl: true })`.
   - Dispatches: `'portfolio-role-change'` and `'portfolio:announce'`.
   - Listens: `'switch-role-tab'`.
2. **`AudienceContext.jsx`** (`src/context/AudienceContext.jsx`):
   - Hook: `useAudience()`.
   - Exported Modes: `AUDIENCE_MODES` (`all`, `recruiter`, `client`, `marriage`).
   - State: `audience` (default `'all'`).
   - Active Mode Object: `activeModeData` with `id`, `label`, `shortLabel`, `icon`, `emoji`, `badge`, `accent`.
   - Action: `setAudience(mode)`.
   - Dispatches: `'portfolio:audience-change'`.
3. **`AnnouncerContext.jsx`** (`src/context/AnnouncerContext.jsx`):
   - Hook: `useAnnounce()`.
   - Provides `announce(message, priority = 'polite' | 'assertive')` updating hidden dynamic live regions (`#portfolio-aria-live-polite`, `#portfolio-aria-live-assertive`) and Web Speech API.

### 1.5 Custom Event Dispatch & Smooth Scrolling
1. **`'portfolio:open-case-study'`**:
   - Registered in `src/App.jsx` (Lines 126–134):
     ```javascript
     const handleGlobalOpen = (e) => {
       const id = e?.detail?.id || e?.detail || '01';
       handleOpenCaseStudy(id);
     };
     window.addEventListener('portfolio:open-case-study', handleGlobalOpen);
     ```
   - Opens `CaseStudyDrawerContent.jsx` slide-over modal for case studies `01` through `09` and updates URL query param `?casestudy=01`.
2. **`'portfolio:switch-contact-tab'`**:
   - Registered in `src/components/ContactSection.jsx` (Lines 443–469):
     ```javascript
     const validTabs = ['touch', 'quote', 'direct', 'location'];
     const handleSwitchTab = (e) => {
       const targetTab = e.detail?.tab;
       if (targetTab && validTabs.includes(targetTab)) {
         setActiveTab(targetTab);
       }
     };
     window.addEventListener('portfolio:switch-contact-tab', handleSwitchTab);
     ```
3. **Smooth Scrolling with Accessibility**:
   - Section IDs: `hero`, `about`, `skills`, `experience`, `projects`, `achievements`, `testimonials`, `gallery`, `playground`, `faq`, `contact`.
   - Smooth scroll standard pattern in `Navbar.jsx` / `ExploreSubBar.jsx`:
     ```javascript
     const el = document.getElementById(targetSectionId);
     if (el) {
       const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
       el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
       el.setAttribute('tabindex', '-1');
       el.focus({ preventScroll: true });
     }
     ```

### 1.6 Styling & Design System in `src/index.css`
- Tailwind v4 with theme colors: `--color-brand-primary: #FF4D6D`, `--color-brand-bg: #FAF8F5`, dark mode background `--bg-page: #0B0813`, card background `rgba(22, 17, 34, 0.85)`, borders `#E7E2D8` / `#2D2340`.
- Glassmorphism classes: `.glass-panel`, `.glass-card`, `.obsidian-card`.
- Focus visibility (Lines 456–490):
  ```css
  :focus-visible {
    outline: 2px solid var(--theme-accent, #FF4D6D) !important;
    outline-offset: 2px !important;
  }
  .dark :focus-visible {
    outline: 2px solid var(--theme-accent, #D946EF) !important;
    outline-offset: 2px !important;
  }
  ```
- Reduced motion (Lines 400–451): `@media (prefers-reduced-motion: reduce)` and `html.reduced-motion` with `scroll-behavior: auto !important` and zero animation duration.

---

## 2. Logic Chain

### Step 2.1: Architectural Preservation & Compatibility
- **Premise (Obs 1.1, 1.2)**: `scripts/verify_ai_chat_feature.mjs` checks 22 verbatim strings within `AIChatWidget.jsx`.
- **Deduction**: The upgraded `AIChatWidget.jsx` must preserve all exact CSS classes (`fixed bottom-0 z-[55]`, `backdrop-blur-md`, `shadow-2xl`, `rounded-t-2xl rounded-b-none border-t border-x border-b-0`, `h-[500px] max-h-[82vh]`), layout offsets (`isDrawerOpen ? 'sm:right-[540px]' : 'sm:right-28'`), event bindings (`portfolio:open-ai-chat`, `portfolio:ai-chat-state`), and default initial prompt chips (`🚀 Featured Projects`, `💻 Core Tech Stack`, `💼 Experience Summary`, `📬 How to Contact`).
- **Outcome**: The enhanced feature set (Dynamic Island capsule, rich markdown bubbles, action buttons, filter badges) must be built strictly additive to the existing component without breaking any verified contracts.

### Step 2.2: Context Synchronization (RoleContext & AudienceContext)
- **Premise (Obs 1.4)**: `RoleContext` manages active role track (`accountant`, `mis`, `vibe_coding`, `other`, `overview`), while `AudienceContext` manages mode (`all`, `recruiter`, `client`, `marriage`).
- **Deduction**: The chat assistant can provide superior relevance by:
  1. Displaying an active context capsule strip right beneath the header (e.g., `[⚡ Vibe Coder]` + `[💼 Recruiter]`).
  2. Passing `activeRole` and `audience` into the hybrid query engine so results prioritize role-specific projects and audience-focused answers.
  3. Allowing users to tap a role or audience badge inside the chat header to quickly switch modes or execute suggestion chips that switch modes.

### Step 2.3: Direct Action Triggers Without Closing Chat
- **Premise (Obs 1.5)**: Window events `portfolio:open-case-study` and `portfolio:switch-contact-tab` operate globally and decouple UI components.
- **Deduction**:
  - When the assistant mentions a case study (e.g., "01" GST Engine or "07" AI SaaS Generator), it can render an interactive capsule button:
    `<button onClick={() => window.dispatchEvent(new CustomEvent('portfolio:open-case-study', { detail: { id: '01' } }))}>Open Case Study 01</button>`.
  - When the assistant discusses quotation or pricing, it can render:
    `<button onClick={() => { handleScrollToSection('contact'); window.dispatchEvent(new CustomEvent('portfolio:switch-contact-tab', { detail: { tab: 'quote' } })); }}>Open Fee Estimator</button>`.
  - Crucially, neither of these actions closes the chat widget (`isOpen` remains `true`), satisfying R2.

### Step 2.4: Dynamic Island Aesthetics & Capsule Styling
- **Premise (Obs 1.1, 1.6)**: The portfolio's design language features rounded pills, glassmorphism (`backdrop-blur-md`, `bg-white/95 dark:bg-[#161122]/95`), delicate borders, and vibrant accent gradients.
- **Deduction**:
  - The chat widget header should incorporate an interactive "Dynamic Island" sub-bar:
    - Left: Active Role pill with role accent color.
    - Center: Active Audience pill with mode emoji.
    - Right: Clear Chat button (`RotateCcw` icon) with accessible tooltip.
  - When minimized, the entire widget collapses into a floating rounded capsule (`h-13 w-[280px] sm:w-[320px] rounded-t-xl`) displaying "Copilot Ready" with pulsing indicator.

### Step 2.5: WCAG 2.2 AA Compliance Implementation
- **Premise (Obs 1.1, 1.4, 1.6)**: WCAG 2.2 AA requires visible focus rings (SC 2.4.7/2.4.11), Escape dismissal, roving tabindex on interactive sets, live region announcements (SC 4.1.3), 44px touch targets (SC 2.5.8), and reduced motion compliance (SC 2.3.3).
- **Deduction**:
  - **Focus Rings**: Rely on universal `:focus-visible` in `index.css` plus explicit `focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden`.
  - **Escape Key**: An Escape keydown listener in `AIChatWidget.jsx` closes or minimizes the chat and returns focus to the trigger button in `FloatingActionHub`.
  - **Live Region**: Hook into `useAnnounce()` to broadcast incoming assistant responses politely to screen readers: `announce(botText, 'polite')`.
  - **Roving Tabindex**: Implement ArrowLeft / ArrowRight / Home / End roving navigation on suggestion chips so only the active chip has `tabIndex={0}` and others have `tabIndex={-1}`.
  - **Touch Targets**: All header control buttons, send button, suggestion chips, and action buttons must have minimum dimensions of 44×44px (`min-h-[44px] min-w-[44px]` or padded hit areas).
  - **Reduced Motion**: Check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` for smooth scroll behavior (`'auto'` instead of `'smooth'`) and disable bounce animations.

### Step 2.6: Session Storage Persistence & Cache Architecture
- **Premise (Obs 1.1)**: Messages are currently stored only in component React state (`useState`), lost on page refresh.
- **Deduction**:
  - Store conversation history in `window.sessionStorage.getItem('portfolio_ai_chat_session')`.
  - Maintain a module-level in-memory cache `let inMemoryMessages = null` so component mounts immediately read synchronous state without layout flash.
  - Add a dedicated "Clear Chat" function that wipes `sessionStorage`, resets in-memory cache, restores default welcome message, announces to screen reader, and plays audio feedback (`soundFX.playTap()`).

---

## 3. Caveats

1. **No Backend API or ML Downloads**: The UI component must operate 100% locally and offline. It should not make any `fetch` calls to OpenAI, Claude, or Gemini endpoints, nor download client-side ONNX/WASM weights.
2. **Search Logic Separation**: The UI survey focuses on presentation, event orchestration, accessibility, and state persistence. The underlying retrieval algorithms (Layers A–H: intent classifier, token scoring, typo normalization, synonym expansion) will be provided by the dedicated search engine module (`src/utils/portfolioAssistantEngine.js` or equivalent).
3. **Drawer Offset Synchronization**: When `LabStudioDrawer` opens, `AIChatWidget` smoothly shifts rightward from `sm:right-28` to `sm:right-[540px]`. This exact Tailwind class must remain intact to prevent visual overlap.
4. **Mobile Screen Width**: On mobile screens (< 640px), the widget uses `left-1/2 -translate-x-1/2 w-[95vw]` to center itself horizontally while docked flush to the bottom.

---

## 4. Conclusion & Upgrade Blueprint

The survey confirms that `AIChatWidget.jsx` can be upgraded into a full production-quality Hybrid Assistant without disturbing existing tests or architecture.

### Detailed Component Upgrade Blueprint

#### 1. State & Storage Architecture
```javascript
const SESSION_STORAGE_KEY = 'portfolio_ai_chat_session';
let inMemoryMessageCache = null;

const DEFAULT_WELCOME_MESSAGE = {
  id: 'welcome',
  sender: 'assistant',
  text: "Hi there! 👋 I am Atul's AI Assistant preview. Feel free to ask about Atul's projects, experience, or tech stack!",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  chips: [
    { id: 'projects', label: '🚀 Featured Projects' },
    { id: 'tech', label: '💻 Core Tech Stack' },
    { id: 'experience', label: '💼 Experience Summary' },
    { id: 'contact', label: '📬 How to Contact' }
  ]
};
```

#### 2. Dynamic Island Capsule Sub-Header
Rendered directly beneath the header:
```jsx
<div className="px-3 py-1.5 bg-stone-100/70 dark:bg-[#181224]/70 border-b border-[#E7E2D8]/60 dark:border-[#2D2340]/60 flex items-center justify-between gap-2 shrink-0">
  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
    {/* Active Role Capsule */}
    <span 
      className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border"
      style={{ borderColor: `${roleData.accent}40`, backgroundColor: `${roleData.accent}15`, color: roleData.accent }}
      title={`Active Role: ${roleData.label}`}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: roleData.accent }} />
      {roleData.shortLabel}
    </span>

    {/* Active Audience Capsule */}
    <span 
      className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border border-stone-300 dark:border-stone-700 bg-white/60 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300"
      title={`Audience Mode: ${activeAudienceData?.label || 'All'}`}
    >
      <span>{activeAudienceData?.emoji || '🌐'}</span>
      <span>{activeAudienceData?.shortLabel || 'All'}</span>
    </span>
  </div>

  {/* Clear Chat Button */}
  <button
    type="button"
    onClick={handleClearChat}
    aria-label="Clear chat history"
    title="Clear conversation"
    className="min-w-[44px] min-h-[44px] flex items-center justify-center p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D]"
  >
    <RotateCcw className="w-3.5 h-3.5" />
  </button>
</div>
```

#### 3. Action Buttons & Rich Markdown Bubble
In assistant bubbles, render interactive capsules when `msg.actions` are present:
```jsx
{msg.actions && msg.actions.length > 0 && (
  <div className="mt-2.5 pt-2 border-t border-stone-200/60 dark:border-stone-700/60 flex flex-wrap gap-1.5">
    {msg.actions.map((act, idx) => (
      <button
        key={idx}
        type="button"
        onClick={() => handleExecuteAction(act)}
        className="min-h-[44px] px-3 py-1.5 rounded-xl text-xs font-medium font-mono flex items-center gap-1.5 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 active:scale-95 transition-all cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-[#FF4D6D]"
      >
        {act.icon}
        <span>{act.label}</span>
      </button>
    ))}
  </div>
)}
```

#### 4. Action Dispatch Handler
```javascript
const handleExecuteAction = (action) => {
  if (soundEnabled && soundFX?.playTap) soundFX.playTap();
  
  if (action.type === 'case-study') {
    window.dispatchEvent(new CustomEvent('portfolio:open-case-study', { detail: { id: action.id } }));
  } else if (action.type === 'quote-tab') {
    handleScrollToSection('contact');
    window.dispatchEvent(new CustomEvent('portfolio:switch-contact-tab', { detail: { tab: 'quote' } }));
  } else if (action.type === 'scroll') {
    handleScrollToSection(action.sectionId);
  } else if (action.type === 'set-role') {
    if (selectRole) selectRole(action.role);
  } else if (action.type === 'set-audience') {
    if (setAudience) setAudience(action.audience);
  }
};
```

#### 5. Accessible Roving Tabindex Suggestion Chips
```javascript
const [focusedChipIndex, setFocusedChipIndex] = useState(0);

const handleChipKeyDown = (e, index) => {
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    const next = (index + 1) % currentChips.length;
    setFocusedChipIndex(next);
    chipButtonRefs.current[next]?.focus();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    const prev = (index - 1 + currentChips.length) % currentChips.length;
    setFocusedChipIndex(prev);
    chipButtonRefs.current[prev]?.focus();
  } else if (e.key === 'Home') {
    e.preventDefault();
    setFocusedChipIndex(0);
    chipButtonRefs.current[0]?.focus();
  } else if (e.key === 'End') {
    e.preventDefault();
    setFocusedChipIndex(currentChips.length - 1);
    chipButtonRefs.current[currentChips.length - 1]?.focus();
  }
};
```

---

## 5. Verification Method

To independently verify the survey and resulting implementation:

1. **Test Suite Integrity**:
   Run full test command:
   ```powershell
   npm test
   ```
   **Pass Condition**: All 38 existing test suites pass with 0 failures, especially `scripts/verify_ai_chat_feature.mjs` and `scripts/verify_accessibility.mjs`.

2. **Dedicated Assistant Test Verification**:
   Execute the dedicated assistant verification test:
   ```powershell
   node scripts/verify_ai_chat_feature.mjs
   ```
   Ensure total checks: 12+, passed: 12+, failed: 0.

3. **Production Build & Bundle Size**:
   ```powershell
   npm run build
   ```
   **Pass Condition**: Build completes with code 0; `AIChatWidget` chunk remains under 25 kB compressed.

4. **Invalidation Conditions**:
   - Modifying or removing any of the 22 required strings verified by `scripts/verify_ai_chat_feature.mjs`.
   - Introducing external HTTP network requests (e.g., fetch to third-party AI APIs).
   - Touch targets for interactive buttons below 44×44px on mobile viewport.
   - Closing chat on section smooth scrolling or case study action buttons.
