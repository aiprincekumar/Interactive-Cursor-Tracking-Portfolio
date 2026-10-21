# HANDOFF REPORT — explorer_cs_drawer_ui

**Target Deliverable**: Case Study Slide-Over Drawer UI Architecture, Accessibility, Theming, Sound & State Design  
**Author**: `explorer_cs_drawer_ui`  
**Date**: 2026-10-20T22:10:00Z  
**Working Directory**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_cs_drawer_ui`

---

## 1. Observation

Direct code observations from the project repository:

### 1.1 Existing Drawer & Modal Implementations
- **`src/components/LabStudioDrawer.jsx`** (lines 26–30, 88–110):
  - Slide-over drawer container:
    ```jsx
    <aside
      ref={drawerRef}
      id="portfolio-control-center-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio Control Center Drawer"
      aria-hidden={!isDrawerOpen}
      inert={!isDrawerOpen ? '' : undefined}
      className={`fixed top-0 right-0 h-full w-[380px] sm:w-[440px] max-w-[95vw] z-[48] bg-[#FAF8F5]/98 dark:bg-[#120D1D]/98 backdrop-blur-2xl border-l border-[#E7E2D8] dark:border-[#2D2340] shadow-2xl flex flex-col transition-transform duration-300 ease-out will-change-transform ${
        isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
    ```
  - Backdrop:
    ```jsx
    {isDrawerOpen && (
      <div
        role="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={closeDrawer}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[47] transition-opacity duration-300 cursor-pointer"
      />
    )}
    ```
  - Focus trap integration:
    ```jsx
    useFocusTrap(isDrawerOpen, drawerRef, {
      onEscape: closeDrawer,
      restoreFocus: true
    });
    ```
  - Escape keyboard listener:
    ```jsx
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape' && isDrawerOpen) closeDrawer();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isDrawerOpen, closeDrawer]);
    ```

- **`src/components/CommandPalette.jsx`** (lines 171–176, 246–261, 455–466):
  - Modal overlay:
    ```jsx
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette Search"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 pb-6 animate-in fade-in duration-200"
    >
    ```
  - Body scroll lock pattern:
    ```jsx
    useEffect(() => {
      if (!isOpen) return;
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 60);

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = originalOverflow;
      };
    }, [isOpen]);
    ```

- **`src/components/CameraRollGallery.jsx`** (lines 299–306):
  - Uses `useFocusTrap(Boolean(selectedPhoto), lightboxRef, { onEscape: () => setSelectedPhoto(null), restoreFocus: true })`.
  - Has `role="dialog"`, `aria-modal="true"`, and `aria-label`.

### 1.2 Focus Trapping Utility (`src/hooks/useFocusTrap.js`)
- Full implementation (lines 26–116):
  - Captures `previousActiveElementRef.current = document.activeElement;` on open.
  - Queries `FOCUSABLE_SELECTOR`: `'a[href]:not([tabindex="-1"])', 'input:not([disabled]):not([tabindex="-1"])', 'button:not([disabled]):not([tabindex="-1"])', '[tabindex]:not([tabindex="-1"])'`.
  - Sets focus to `initialFocusRef` or first focusable child after 40ms timeout.
  - Intercepts `Tab` and `Shift+Tab` to enforce circular focus within `containerRef`.
  - Intercepts `Escape` to trigger `onEscape()` callback.
  - In cleanup: defers focus restoration with `setTimeout(() => previousActiveElementRef.current?.focus(), 30)` to avoid race conditions with unmounting transitions.

### 1.3 Body Scroll Lock Hooks (`src/hooks/useBodyScrollLock.js`)
- Lines 21–71:
  - `export function useBodyScrollLock(isLocked, breakpoint = 768)`: Constrained to viewports `< breakpoint` (default 768px).
  - Note: For desktop slide-over modals, `breakpoint = Infinity` or direct scroll locking in the drawer is required to lock on all screen widths.

### 1.4 Web Audio Synthesizer (`src/utils/audio.js`)
- Synthesizer methods:
  - `playRibbonSweep('up')` / `playRibbonToggle(true)`: Dual oscillator sweep (300Hz -> 620Hz) over 90ms.
  - `playRibbonSweep('down')` / `playRibbonToggle(false)`: Dual oscillator sweep (620Hz -> 300Hz) over 90ms.
  - `playHapticClick()`: Micro-mechanical tick (3200Hz -> 500Hz) with 160Hz body damping over 15ms.
  - `playKeyClick()`: Tactile click with jittered pitch (2600Hz -> 420Hz).
  - `playLaserFocus()`: Swept chirp (2800Hz -> 1400Hz) + resonant lock ring (1400Hz) over 70ms.
  - `playTerminalSuccess()`: Dual ascending chime (D5 587Hz -> A5 880Hz).
  - `playTerminalError()`: Retro vintage Unix error buzzer (sawtooth 140Hz -> 110Hz).
  - `playCrystalChime()`: 3-partial harmonic bell resonance (880Hz, 1108Hz, 1760Hz).
  - `playCosmicSparkle()`: 4-tone celestial ascending arpeggio (C6, E6, G6, C7).
  - Safety check: `this.enabled` is checked internally before playing any tone.
  - Initialization: `soundFX.init()` initializes AudioContext on user interaction.

### 1.5 Theme Contexts & Styling Architecture
- **ThemeContext.jsx** (lines 42–48): Toggles `.dark` class on `document.documentElement` and sets `style.colorScheme = 'dark' | 'light'`.
- **HighContrastContext.jsx** (lines 27–34): Toggles `.high-contrast` on `document.documentElement` and `document.body`.
- **SimpleModeContext.jsx** (lines 26–34): Toggles `.simple-mode` on `document.body`.
- **AnnouncerContext.jsx** (lines 448–469): Exports `useAnnounce()` with `announce(message, priority = 'polite')` and renders `#portfolio-aria-live-polite` and `#portfolio-aria-live-assertive`.
- **`src/styles/high-contrast.css`** (lines 11–80): Enforces WCAG AAA compliance (`≥ 7:1` text, `≥ 4.5:1` UI borders), crisp 2px solid borders (`#000000` in light, `#FFFFFF` in dark), and zero glassmorphism (`backdrop-filter: none !important`).
- **`src/styles/simple-mode.css`** (lines 8–35): Enforces `cursor: auto !important`, suppresses custom cursor canvases, and silences non-essential audio.
- **`src/index.css`** (lines 7–96): Defines theme CSS variables `--bg-page`, `--text-primary`, `--card-bg`, `--card-border`, `--primary`, `--font-sans`, `--font-outfit`.

### 1.6 Projects & Triggers in `src/components/ProjectsSection.jsx`
- 9 Projects mapped across 4 tracks:
  1. `01` / `proj-gst-tax`: GST & Income Tax Automated Compliance Architecture (Accountant)
  2. `02` / `proj-tally-accounting`: Tally Financial Accounting & Inventory Management (Accountant)
  3. `03` / `proj-day-nulm`: DAY-NULM Skill India MIS Reporting Portal (MIS)
  4. `04` / `proj-smart-card`: Multi-District Smart Card Operations & Enrollment Engine (MIS)
  5. `05` / `proj-enterprise-transformation`: Executive Power BI Fiscal Intelligence & Reconciliation Engine (Corporate Controller / Other)
  6. `06` / `proj-business-advisory`: Corporate Financial Controls & Internal Audit Governance (Corporate Controller / Other)
  7. `07` / `proj-ai-saas-generator`: AI Prompt-to-Fullstack SaaS Generator (Vibe Coding)
  8. `08` / `proj-agent-workflow-engine`: Autonomous Multi-Agent Workflow Engine (Vibe Coding)
  9. `09` / `proj-doc-code-synthesizer`: Real-Time AI Document & Code Synthesizer (Vibe Coding)
- Each project card currently contains CTA buttons in its right column (e.g., `#contact`, `#experience`).

---

## 2. Logic Chain

From these direct observations, we derive the exact architecture for `CaseStudyDrawer.jsx`:

### 2.1 Slide-Over Shell & Backdrop
- **Observation**: `LabStudioDrawer.jsx` uses `fixed top-0 right-0 h-full ... z-[48]` with `translate-x-full` / `translate-x-0` and `backdrop-blur-2xl`.
- **Deduction**: `CaseStudyDrawer.jsx` should use an identical non-intrusive slide-over layout anchored to the right viewport edge.
- **Width Optimization**: A case study contains comprehensive 5-stage storytelling, telemetry simulator widgets, visual architecture blueprints, and before/after metrics. A narrow 380px drawer will cause horizontal scrolling or cramping.
  - Recommended dimensions: `w-full sm:w-[560px] md:w-[680px] lg:w-[760px] max-w-[100vw] sm:max-w-[95vw]`.
  - This provides sufficient room for side-by-side metric tiles, SVG flowchart nodes, and simulator controls while maintaining the background page context on desktop viewports (1024px+).
  - Layering: `z-[55]` for backdrop, `z-[56]` for drawer (higher than standard navbar `z-40` and LabStudioDrawer `z-[48]`, but below developer terminal if prioritized).

### 2.2 Focus Trapping and Restoration
- **Observation**: `src/hooks/useFocusTrap.js` records `previousActiveElementRef.current = document.activeElement` and focuses `initialFocusRef` or the first focusable element, restoring focus on unmount/close after a 30ms deferral.
- **Deduction**:
  - In `CaseStudyDrawer.jsx`, invoke `useFocusTrap(isOpen, drawerRef, { initialFocusRef: closeButtonRef, onEscape: onClose, restoreFocus: true })`.
  - When the user clicks "View Case Study" on any project card (e.g. Card 01), that button is `document.activeElement`.
  - On open: focus transitions to the drawer Close button (or primary stage tab).
  - Inside drawer: keyboard users can Tab through the header buttons, the 5 storytelling stage tabs, interactive simulator buttons, external links, and the footer pagination buttons. Tab loops circularly.
  - On close (`Escape` key, backdrop click, or Close button): `useFocusTrap` restores focus directly to the project card button that initiated the drawer.
  - If opened via URL query parameter (`?casestudy=01`) where no prior button was clicked, focus gracefully falls back to the project card container or `#main-content`.

### 2.3 Background Scroll Lock
- **Observation**: `useBodyScrollLock.js` restricts locking to `window.innerWidth < 768px`. However, the requirement R1 explicitly specifies: *"Keeps the portfolio anchored in the background while displaying the in-depth digital dossier... background scroll-locking, and restores scroll position."*
- **Deduction**: The drawer must lock scrolling on **all screen sizes**, with scrollbar width compensation to eliminate layout shift:
  ```javascript
  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalDocOverflow = document.documentElement.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalDocOverflow;
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);
  ```

### 2.4 ARIA Landmark, Dialog Semantics & Live Announcements
- **Observation**: `scripts/verify_accessibility.mjs` audits modal dialog semantics (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-hidden`, and `inert`).
- **Deduction**:
  - Drawer `<aside>` element attributes:
    - `role="dialog"`
    - `aria-modal="true"`
    - `aria-labelledby="casestudy-drawer-title"`
    - `aria-describedby="casestudy-drawer-subtitle"`
    - `aria-hidden={!isOpen}`
    - `inert={!isOpen ? '' : undefined}`
  - 5-Stage Storytelling Tablist semantics:
    - `<div role="tablist" aria-label="Case Study Storytelling Stages">`
    - Tabs: `role="tab"`, `id={`stage-tab-${stage.id}`}`, `aria-selected={activeStage === stage.id}`, `aria-controls={`stage-panel-${stage.id}`}`, `tabIndex={activeStage === stage.id ? 0 : -1}`.
    - Panels: `role="tabpanel"`, `id={`stage-panel-${stage.id}`}`, `aria-labelledby={`stage-tab-${stage.id}`}`, `tabIndex={0}`.
    - Arrow keys (`ArrowLeft`, `ArrowRight`, `Home`, `End`) navigate between the 5 stage tabs.
  - Live Announcements:
    - On drawer open: `announce(`Opened case study: ${project.title}. Showing Stage 1: The Challenge.`, 'polite')`
    - On stage tab switch: `announce(`Viewing Stage ${stage.number}: ${stage.title}`, 'polite')`
    - On simulation start: `announce(`Executing ${project.simTitle} simulation`, 'polite')`
    - On simulation complete: `announce(`Simulation complete. Reconciled in ${latency}ms with 100% accuracy`, 'polite')`
    - On drawer close: `announce('Closed case study drawer', 'polite')`

### 2.5 Audio FX Triggers
- **Observation**: `src/utils/audio.js` has methods for ribbon sweeps, haptics, laser focus, and chimes, with master volume, pitch multiplier, and mute controls.
- **Deduction**: Map sound triggers as follows:
  | Action | Method in `soundFX` | Acoustic Profile |
  |---|---|---|
  | Drawer Open | `soundFX.playRibbonSweep('up')` | Smooth ascending whoosh (300Hz → 620Hz) |
  | Drawer Close | `soundFX.playRibbonSweep('down')` | Soft descending whoosh (620Hz → 300Hz) |
  | 5-Stage Tab Switch | `soundFX.playHapticClick()` | Snappy micro-mechanical tick transient (3200Hz → 500Hz) |
  | Next / Prev Project | `soundFX.playKeyClick()` | Tactile clack with pitch jitter |
  | Start Simulator | `soundFX.playLaserFocus()` | Swept chirp (2800Hz → 1400Hz) + lock ring |
  | Simulator Complete | `soundFX.playTerminalSuccess()` | D5 → A5 crisp sci-fi confirmation arpeggio |
  | Simulator Reset | `soundFX.playCrystalChime()` | 3-partial harmonic bell resonance |

### 2.6 Theming Specifications across all 4 Modes
- **Linen Light Mode**:
  - Backdrop: `bg-stone-900/40 backdrop-blur-xs`
  - Drawer Panel: `bg-[#FAF8F5]/98 border-l border-[#E7E2D8] text-[#18181B]`
  - Sticky Headers & Footers: `bg-white/80 backdrop-blur-md border-[#ECE7DF]`
  - Content Cards: `bg-white border-[#E7E2D8] shadow-xs`
  - Stage Pills: Inactive `bg-white text-stone-600 border-[#E7E2D8] hover:bg-stone-100`, Active `bg-[#18181B] text-white shadow-xs`
- **Obsidian Dark Mode** (`.dark`):
  - Backdrop: `bg-black/60 backdrop-blur-xs`
  - Drawer Panel: `dark:bg-[#120D1D]/98 dark:border-[#2D2340] dark:text-[#F5F2F8]`
  - Sticky Headers & Footers: `dark:bg-[#161122]/85 dark:border-[#2D2340]`
  - Content Cards: `dark:bg-[#161122] dark:border-[#2D2340] dark:shadow-inner`
  - Stage Pills: Inactive `dark:bg-stone-900 dark:text-stone-300 dark:border-stone-800 hover:dark:bg-stone-800`, Active `dark:bg-white dark:text-[#18181B]`
- **High-Contrast Mode** (`html.high-contrast` / `body.high-contrast`):
  - In Light High Contrast: `bg-white border-2 border-black text-black`, zero backdrop-blur (`backdrop-filter: none !important`), opaque backgrounds, high-contrast solid focus rings (`outline: 3px solid #000000`).
  - In Dark High Contrast: `bg-black border-2 border-white text-white`, zero backdrop-blur (`backdrop-filter: none !important`), yellow accents (`#FFFF00`), solid focus rings (`outline: 3px solid #FFFF00`).
- **Simple Mode** (`body.simple-mode`):
  - Drawer renders cleanly with solid backgrounds and standard CSS opacity transitions.
  - Audio FX are muted (`soundFX.isEnabled() === false`).
  - Native cursor remains `cursor: auto` throughout.

### 2.7 Component State Management & Deep Linking
- **State Architecture**:
  - `isDrawerOpen` (`boolean`): drawer visibility.
  - `activeProjectId` (`string`): e.g. `'01'`, `'02'`, `'03'`, `'04'`, `'05'`, `'06'`, `'07'`, `'08'`, `'09'`.
  - `activeStage` (`number`): `1` to `5` (The Challenge, The Solution, Tech Stack & Obstacles, Results & Metrics, Lessons Learned).
- **Deep Linking & URL Sync**:
  - When opening project `'01'`: `window.history.replaceState(null, '', `?casestudy=01`)`.
  - On page load: read `new URLSearchParams(window.location.search).get('casestudy')` or `'project'`. If present, auto-open the corresponding case study!
  - When closing: restore clean URL without query parameter.
- **Cross-Component Triggers**:
  - `window.addEventListener('portfolio:open-case-study', (e) => { ... })` allows Command Palette, Tech Marquee tooltips, or any other section to invoke a case study effortlessly.

---

## 3. Caveats

- **Caveat 1 (Window Resize Handling)**: If a user resizes the browser window while the drawer is open, width styles (`w-full sm:w-[560px] md:w-[680px] lg:w-[760px]`) adapt responsively, and `scrollbarWidth` padding remains stable.
- **Caveat 2 (Simple Mode Co-existence)**: Unlike `LabStudioDrawer` (which is a customization studio that is suppressed in Simple Mode via `{!isSimpleMode && <LabStudioDrawer />}`), the Case Studies contain primary professional evidence and portfolio content. Therefore, `CaseStudyDrawer` **MUST NOT be suppressed** in Simple Mode; it must remain 100% available and functional with standard system cursors and zero audio.
- **Caveat 3 (9-Project Dataset Co-location)**: All 9 project case study data objects should be centralized in a dedicated configuration file (e.g. `src/data/caseStudiesData.js` or `caseStudyConfig.js`) rather than inlining hundreds of lines of text inside `ProjectsSection.jsx`, keeping components modular, testable, and maintainable.

---

## 4. Conclusion

The Slide-Over Drawer architecture for the P1 Case Studies integrates into the portfolio without modifying any existing visual assets, character gaze tracking, or layout density settings.

### Summary Blueprint:
1. **Component**: `src/components/CaseStudyDrawer.jsx` mounted in `App.jsx` (accessible across all sections and modes).
2. **Data Module**: `src/data/caseStudiesData.js` with structured 5-stage storytelling, metrics, blueprint flows, and simulation parameters for all 9 projects.
3. **Trigger**: Accessible "Read Case Study" / "View Case Study" button on each of the 9 project cards in `ProjectsSection.jsx`.
4. **Accessibility**:
   - `useFocusTrap(isOpen, drawerRef, { initialFocusRef, onEscape, restoreFocus: true })`.
   - `document.body.style.overflow = 'hidden'` with scrollbar compensation.
   - Dialog landmark attributes: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`, `inert={!isOpen ? '' : undefined}`.
   - WAI-ARIA `role="tablist"` with Arrow keys for the 5 storytelling stages.
   - Dynamic screen-reader announcements via `useAnnounce()`.
5. **Acoustic Experience**: Subtle Web Audio API feedback (`playRibbonSweep`, `playHapticClick`, `playLaserFocus`, `playTerminalSuccess`) honoring master sound toggle and Simple Mode mute.
6. **Themes**: 100% compliant with Linen Light, Obsidian Dark, High-Contrast (zero glassmorphism, WCAG AAA), and Simple Mode.

---

## 5. Verification Method

To independently verify the implementation when built:

1. **Accessibility & Focus Verification**:
   - Open any project case study using the keyboard (`Tab` to project card -> `Enter` on "View Case Study").
   - Confirm focus lands on the Close button or Stage 1 tab.
   - Press `Tab` and `Shift+Tab`: verify focus cycles strictly within the drawer and never escapes to the background page.
   - Press `Escape`: verify the drawer smoothly closes, and focus immediately returns to the triggering button on the project card.
   - Verify screen reader receives the announcement: *"Opened case study: GST & Income Tax Automated Compliance Architecture"*.

2. **Scroll Lock Verification**:
   - With the drawer open on both desktop (1440px) and mobile (375px), attempt to scroll using the mouse wheel, trackpad, or touch gesture on the backdrop or background page.
   - Confirm the background page stays completely anchored without any scroll jumping or layout shift.
   - Close the drawer and verify page scrolling is restored to the exact prior scroll position.

3. **Theme & Contrast Verification**:
   - Open the drawer in Light mode: verify warm Linen background (`#FAF8F5`) and coral accents (`#FF4D6D`).
   - Toggle Dark mode: verify Obsidian dark plum background (`#120D1D`) with dark violet card borders (`#2D2340`).
   - Toggle High-Contrast mode (`Alt+H`): verify solid black/white backgrounds, crisp 2px solid borders, and zero translucent glassmorphism (`backdrop-filter: none`).
   - Toggle Simple Mode: verify standard system cursor, clean typography, and zero unwanted audio.

4. **Automated Test & Build Execution**:
   ```bash
   # 1. Run Oxlint static analysis
   npx oxlint src/

   # 2. Run automated test suite
   npm test

   # 3. Run production build
   npm run build
   ```
   **Pass Condition**: 0 warnings, 0 errors, exit code 0.
