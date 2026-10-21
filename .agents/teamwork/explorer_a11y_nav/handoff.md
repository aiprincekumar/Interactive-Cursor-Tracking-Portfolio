# Accessibility Investigation Report: Pillar 1 — Keyboard Navigation, Focus Flow & Focus Trapping

**Agent**: `explorer_a11y_nav`  
**Milestone**: Comprehensive WCAG 2.1 AA/AAA Accessibility Audit & Hardening  
**Target Architecture**: Interactive Cursor-Tracking Portfolio  
**Working Directory**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_a11y_nav`  

---

## 1. Observation

A systematic static and dynamic code inspection was conducted across all files within Pillar 1 scope (`index.html`, `src/App.jsx`, `src/index.css`, `src/components/Navbar.jsx`, `src/components/CommandPalette.jsx`, `src/components/LabStudioDrawer.jsx`, `src/components/ResumeDropdown.jsx`, `src/components/CameraRollGallery.jsx`, `src/components/RoleTabsBar.jsx`, `src/components/CursorSelectorRibbon.jsx`, `src/components/ProjectsSection.jsx`, `src/components/ContactSection.jsx`, `src/components/AboutSection.jsx`, `src/components/SkillsSection.jsx`, `src/components/ExperienceSection.jsx`, `src/components/HeroSection.jsx`, `src/components/BackToTopButton.jsx`, `src/components/FloatingWhatsAppButton.jsx`, `src/components/FloatingSimpleModeToggle.jsx`, `src/components/ExploreSubBar.jsx`, `src/components/TechMarqueeBanner.jsx`, `src/components/InteractivePlayground.jsx`, `src/components/ControlCenterPanel.jsx`, `src/components/Footer.jsx`).

### O1. Skip-to-Content Mechanism (`#main-content`)
1. **`index.html` (Lines 40–43)**:
   ```html
   <body class="bg-[#FAF8F5] dark:bg-[#0B0813] text-[#18181B] dark:text-[#F5F2F8] antialiased selection:bg-[#FF4D6D] selection:text-white overflow-x-hidden font-['Plus_Jakarta_Sans',sans-serif]">
     <div id="root"></div>
     <script type="module" src="/src/main.jsx"></script>
   </body>
   ```
   No skip link `<a href="#main-content">` is present in `index.html`.
2. **`src/App.jsx` (Line 176)**:
   ```jsx
   {/* Main Content Area - In Exact Instagram Reel Chronological Sequence */}
   <main className="relative z-10">
   ```
   The `<main>` element lacks `id="main-content"` and lacks `tabIndex="-1"`.
3. **DOM Mounting Order in `src/App.jsx` (Lines 156–174)**:
   ```jsx
   {/* Global Quick Lab Studio Slide-Out Drawer & Floating Action Button */}
   {!isSimpleMode && <LabStudioDrawer />}

   {/* Floating Direct WhatsApp Channel Button */}
   <FloatingWhatsAppButton />

   {/* Floating Persistent Simple Mode Toggle FAB */}
   <FloatingSimpleModeToggle />

   {/* Floating Back-To-Top Button */}
   <BackToTopButton />

   {/* Top Navbar */}
   <Navbar ... />
   ```
   The four floating action buttons (Lab drawer FAB, WhatsApp FAB, Simple Mode FAB, Back-to-Top button) are rendered in the DOM *before* `<Navbar>` and *before* `<main>`, causing keyboard users to tab through bottom-right floating widgets before reaching the navigation header.

---

### O2. Global CSS & Focus Visible Outline Rings (`:focus-visible`)
1. **`src/index.css` (Lines 1–421)**:
   There is zero global `:focus-visible` or `:focus` styling defined. Tailwind v4 `@import "tailwindcss";` is used without custom focus rings configured in theme layers.
2. **Prevalence of `outline-none` and `focus:outline-none`**:
   `grep_search` found 25+ instances across components:
   - `src/components/ControlCenterPanel.jsx` (Lines 949, 978, 1007):
     ```jsx
     className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer focus:outline-none shrink-0 ${...}`}
     ```
     Removes focus outline completely with zero visual fallback.
   - `src/components/HeroSection.jsx` (Line 1352):
     ```jsx
     className="w-14 sm:w-20 h-1.5 bg-stone-200/80 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#18181B] dark:accent-[#FF4D6D] focus:outline-none shrink-1"
     ```
     Zoom range input strips outline with no focus indicator.
   - `src/components/ContactSection.jsx` (Lines 809, 825, 843, 861, 878, 898, 919, 939):
     ```jsx
     className="... text-xs outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 ..."
     ```
     Uses a 1px ring with only 30% opacity, failing WCAG 2.4.11 / 2.4.7 focus contrast criteria.
3. **Interactive elements completely missing focus styles**:
   - `Navbar.jsx` Theme Toggle button (Line 505–517)
   - `Navbar.jsx` Audio Toggle button (Line 521–539)
   - `Navbar.jsx` Desktop Nav Links (Lines 391–410)
   - `Navbar.jsx` Explore trigger button (Lines 445–467)
   - `Navbar.jsx` Cursor selector trigger button (Lines 471–502)
   - `HeroSection.jsx` Zoom buttons `[-]`, `[+]`, `100%`, `Center` (Lines 1324, 1356, 1371, 1388)
   - `HeroSection.jsx` Social media links (Lines 1076–1173)
   - `HeroSection.jsx` Photo capture button (Line 1407)
   - `ContactSection.jsx` Social media links (Lines 1130–1145)
   - `ContactSection.jsx` Map control buttons: ZoomIn, ZoomOut, Toggle Map (Lines 1508–1565)
   - `ProjectsSection.jsx` Interactive simulator buttons (Lines 268, 588, 738, 1009, 1232)
   - `ProjectsSection.jsx` Project CTA buttons (Lines 397, 405, etc.)
   - `SkillsSection.jsx` Skill selection pills (Lines 587–606)
   - `Footer.jsx` Scroll-to-top button (Line 52)

---

### O3. Focus Trapping & Restoration in Modals, Drawers & Popups
1. **`src/components/CommandPalette.jsx`**:
   - Focus on open: Lines 237–244 auto-focuses `inputRef.current`.
   - **Missing Focus Trap**: No Tab / Shift+Tab cycling handler is attached. When tabbing forward or backward, focus escapes the modal into the underlying page DOM.
   - **Missing Focus Restoration**: No record of `document.activeElement` prior to opening. On close, focus drops to `<body>` instead of returning to the search trigger or prior active element.
   - **Escape Key Limitation**: Line 468 attaches `onKeyDown={handleKeyDown}` strictly to the `<input>`. If user focuses category filter chips or recent search buttons, pressing `Escape` does not close the palette.
2. **`src/components/LabStudioDrawer.jsx`**:
   - Line 95 renders `<aside id="portfolio-control-center-drawer" role="dialog" aria-modal="true">`.
   - **Missing Initial Focus**: When `isDrawerOpen` becomes true, focus is never shifted inside the drawer.
   - **Backdrop Focus Leak**: Line 77 backdrop `<div>` has `tabIndex={0}`, creating an extraneous focus stop on the overlay.
   - **Missing Focus Trap**: Tabbing cycles out of the drawer into background sections.
   - **Missing Focus Restoration**: Escape key (Line 25) or close button closes drawer but does not return focus to the FAB button (Line 47).
3. **`src/components/ResumeDropdown.jsx`**:
   - Line 331 renders `role="menu"`.
   - Escape closes dropdown and returns focus to `toggleButtonRef` (Line 68–71).
   - **Missing Menu Navigation**: No `ArrowDown` / `ArrowUp` roving navigation between menu items. When opened via keyboard, initial focus is not moved to the first menu item (`View Online`).
4. **`src/components/CameraRollGallery.jsx` Lightbox Modal**:
   - Lines 270–350: `{selectedPhoto && (<div role="dialog" aria-modal="true">...)}`.
   - **Missing Initial Focus**: Focus remains on the polaroid card in the background grid.
   - **Missing Focus Trap**: Tab moves focus across background cards behind the backdrop.
   - **Missing Focus Restoration**: Closing modal does not return focus to the clicked polaroid card.
   - Action buttons (Download Frame, Share) lack `focus-visible:ring-2`.
5. **Mobile Menu Drawer in `src/components/Navbar.jsx`**:
   - Lines 628–746: `{mobileMenuOpen && (<div className="md:hidden ...">...</div>)}`.
   - Missing `role="dialog"`, `aria-modal="true"`, and `aria-label="Mobile Navigation Menu"`.
   - Backdrop (Line 291) has `role="button" tabIndex={-1}`.
   - **Missing Focus Trap**: Tabbing traverses drawer items and directly escapes into page elements beneath.
   - Initial focus is not shifted inside when opened.

---

### O4. Tab Indexing across Custom Interactive Components
1. **`src/components/CursorSelectorRibbon.jsx`**:
   - Line 183: `role="radiogroup" aria-label="Interactive Cursor Selection"`.
   - Line 192: Each cursor button has `role="radio"` and `aria-checked={isActive}`.
   - **Tab Index Barrier**: Does NOT implement roving `tabIndex={isActive ? 0 : -1}`. All 35+ cursor buttons have `tabIndex={0}`, forcing a keyboard user to tab 35+ times through the ribbon.
   - **Missing Arrow Keys**: No `ArrowLeft` / `ArrowRight` arrow key navigation across the radiogroup.
   - Inactive cursor buttons lack `focus-visible:ring-2` (Line 196 has `focus:outline-hidden`).
2. **`src/components/TechMarqueeBanner.jsx`**:
   - Lines 528 and 632: All items in both ribbons have `role="button" tabIndex={0}`.
   - With 4x repetition, there are 56 items in top ribbon + 52 items in bottom ribbon = **108 focusable buttons** inside an infinitely moving marquee!
   - This creates an extreme keyboard barrier and violation of WCAG 2.4.3 (Focus Order). Items lack focus rings.
3. **`src/components/ExperienceSection.jsx`**:
   - Lines 331–339: Cards have `onClick={() => handleCardClick(exp.id)}`, `cursor-pointer`, and hover state, but are plain `<div>` elements without `role="button"`, without `tabIndex={0}`, and without `onKeyDown` (`Enter`/`Space`). They are completely unreachable by keyboard.
4. **Tabpanels with `tabIndex={0}` and `focus:outline-none`**:
   - `ProjectsSection.jsx` (Line 1195): `<div role="tabpanel" ... tabIndex={0} className="animate-tab-fade focus:outline-none">`
   - `ContactSection.jsx` (Line 768): `<div role="tabpanel" ... tabIndex={0} className="animate-tab-fade focus:outline-none">`
   - `ExperienceSection.jsx` (Line 324): `<div role="tabpanel" ... tabIndex={0} className="animate-tab-fade ... focus:outline-none">`
   When tabbing into the panel, focus lands invisibly on the container wrapper before reaching actual content controls.
5. **`src/components/BackToTopButton.jsx`**:
   - Line 147: When `isVisible === false` (scroll < 400px), container has `opacity-0 pointer-events-none`.
   - Line 153: The `<button>` does NOT have `tabIndex={-1}` or conditional rendering!
   - Keyboard users at the top of the page tab into an invisible 0-opacity button.
6. **Nested Interactive Elements in `src/components/InteractivePlayground.jsx`**:
   - Lines 38–107: `<div role="button" id="system-control-panel-trigger" ...>` contains child `<button>` elements (Reset Defaults line 69, Quick Drawer line 88). This creates invalid nested interactive controls.
7. **`src/components/ControlCenterPanel.jsx`**:
   - Lines 278–316: 5-tab `role="tablist"` lacks `onKeyDown` for `ArrowLeft`/`ArrowRight` navigation, and lacks roving `tabIndex={isActive ? 0 : -1}`.

---

### O5. Missing Keyboard Listeners & Keyboard Traps
- **`Enter` & `Space`**:
  - Missing on `ExperienceSection.jsx` cards (plain divs with only `onClick`).
  - Missing on `ResumeDropdown.jsx` menuitems when navigated via keyboard.
- **`ArrowUp` / `ArrowDown` / `ArrowLeft` / `ArrowRight`**:
  - Missing on `ResumeDropdown.jsx` (cannot cycle menuitems with up/down arrows).
  - Missing on `CursorSelectorRibbon.jsx` (cannot cycle cursor radiogroup with left/right arrows).
  - Missing on `ControlCenterPanel.jsx` tablist (cannot cycle 5 tabs with left/right arrows).
- **`Escape` Key Traps**:
  - `CommandPalette.jsx`: Escape is only caught when `<input>` has focus; escape is dead when focus is on category chips or recent search buttons.
  - `LabStudioDrawer.jsx`: Backdrop has `tabIndex={0}`, catching focus on backwards Tab.
- **Marquee Keyboard Barrier**:
  - 108 tab stops in `TechMarqueeBanner.jsx` create a major keyboard bottleneck.

---

## 2. Logic Chain

```
[Observation O1: No #main-content id and no skip link in index.html / App.jsx]
  + [Observation O1.3: 4 floating action buttons mounted before <Navbar> in App.jsx]
  ---> Step 1: Keyboard users arriving on page cannot bypass the header or floating widgets to reach main content.
  ---> Step 2: Tab sequence first traverses floating buttons, then header, creating reverse-order visual dissonance.
  ===> Conclusion 1: A prominent skip-to-content anchor must be rendered as the very first DOM node in App.jsx, target #main-content on <main tabIndex="-1">, and DOM order of floating buttons must be aligned.

[Observation O2.1: Zero global :focus-visible in index.css]
  + [Observation O2.2: 25+ elements using outline-none or focus:outline-none without replacement]
  + [Observation O2.3: Faint focus:ring-1 focus:ring-[#FF4D6D]/30 with 30% opacity in ContactSection]
  + [Observation O2.4: 14+ interactive button/link categories lacking focus styling]
  ---> Step 3: Keyboard-only users have no visible cue indicating which element currently possesses focus.
  ---> Step 4: Low-contrast focus rings fail WCAG 2.1 SC 2.4.7 (Focus Visible) and WCAG 2.2 SC 2.4.11 (Focus Appearance).
  ===> Conclusion 2: A universal :focus-visible rule must be injected into index.css with high-contrast 2px outline and 2px offset (adapting across light #FF4D6D and dark #D946EF themes). Elements with outline-none must be replaced with solid, high-contrast focus rings.

[Observation O3.1: CommandPalette lacks focus trap and restoration]
  + [Observation O3.2: LabStudioDrawer lacks initial focus, trap, and restoration; backdrop has tabIndex=0]
  + [Observation O3.3: ResumeDropdown lacks arrow navigation and initial item focus]
  + [Observation O3.4: CameraRollGallery lightbox lacks initial focus, trap, and restoration]
  + [Observation O3.5: Navbar mobile drawer lacks dialog role, focus trap, and initial focus]
  ---> Step 5: Screen readers and keyboard users tabbing while an overlay is open leak focus into background elements behind the modal backdrop.
  ---> Step 6: When overlays close, keyboard focus is lost, resetting to <body> or undefined position.
  ===> Conclusion 3: Standardized focus trapping and focus restoration must be implemented across all 5 overlays (capturing document.activeElement on open, setting initial focus, trapping Tab/Shift+Tab cycles, and restoring focus to trigger on close).

[Observation O4.1: CursorSelectorRibbon has 35+ buttons with tabIndex=0 and no arrow navigation]
  + [Observation O4.2: TechMarqueeBanner has 108 animated buttons in tab order]
  + [Observation O4.3: ExperienceSection cards have onClick but are not focusable or keyboard-activatable]
  + [Observation O4.4: Tabpanels have tabIndex=0 with focus:outline-none]
  + [Observation O4.5: BackToTopButton is focusable while opacity=0 and scroll<400px]
  + [Observation O4.6: InteractivePlayground nests buttons inside role="button"]
  + [Observation O4.7: ControlCenterPanel tablist lacks arrow navigation and roving tabIndex]
  ---> Step 7: CursorSelectorRibbon and TechMarqueeBanner force 140+ redundant tab stops onto keyboard users.
  ---> Step 8: Interactive cards in ExperienceSection are completely inaccessible without a mouse.
  ---> Step 9: Hidden BackToTopButton traps focus invisibly at top of page.
  ---> Step 10: Nested buttons violate HTML accessibility specifications.
  ===> Conclusion 4: Roving tabIndex and arrow key navigation must be applied to CursorSelectorRibbon, ControlCenterPanel tablist, and ResumeDropdown. Marquee items should have tabIndex="-1". Experience cards must become accessible buttons. BackToTopButton must have tabIndex="-1" when hidden. Nested buttons in InteractivePlayground must be unnested.
```

---

## 3. Caveats

1. **Read-Only Scope**: In strict compliance with explorer instructions and user global rule 1, no source code files were edited during this investigation. All recommended changes are technical designs.
2. **Third-Party Canvas and Physics**: Canvas elements (`canvas-confetti`, `LeafletOfflineMap` tiles) are inherently non-DOM. Focus management must strictly wrap the host container buttons and controls.
3. **Tailwind v4 Setup**: The project uses `@tailwindcss/vite` and `@import "tailwindcss";` in `src/index.css` without a traditional `tailwind.config.js`. CSS rules must be applied directly in `src/index.css` under standard CSS layers (`@layer base` or root selectors).
4. **Reduced Motion Interdependence**: While reduced motion is primarily Pillar 3, keyboard navigation must function seamlessly whether reduced motion is active or inactive.

---

## 4. Conclusion

The portfolio has an exceptionally rich visual design, but Pillar 1 reveals **7 critical keyboard accessibility defects** that prevent WCAG 2.1 AA compliance:
1. **No Skip Link & Inverted DOM Order**: Missing `#main-content` and `<a href="#main-content">`; 4 floating buttons precede navigation in DOM.
2. **Missing Universal `:focus-visible`**: Over 25 components strip outlines or use sub-3:1 opacity rings, leaving many controls without visible focus.
3. **Leaking Focus in All 5 Modals/Drawers**: Command Palette, Lab Studio Drawer, Resume Dropdown, Camera Roll Lightbox, and Mobile Menu lack Tab traps and focus restoration.
4. **140+ Redundant Tab Stops**: 108 focusable animated marquee items and 35+ non-roving cursor buttons create severe navigation fatigue.
5. **Inaccessible Experience Cards**: Work history cards have `onClick` handlers but lack `tabIndex`, `role="button"`, and `Enter`/`Space` listeners.
6. **Phantom Focus Stop**: `BackToTopButton` remains focusable while completely invisible at the top of the page.
7. **Nested Interactive Elements**: `InteractivePlayground` nests action buttons inside a container `role="button"`.

### Concrete Proposed Code Changes

#### Change 1: Skip-to-Content Link & `<main id="main-content">` in `src/App.jsx`
```jsx
// Top of src/App.jsx return:
<RoleProvider soundEnabled={effectiveSoundEnabled}>
  <div className="...">
    {/* Accessible Skip to Content Link */}
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#18181B] focus:text-white dark:focus:bg-white dark:focus:text-[#18181B] focus:font-bold focus:rounded-xl focus:shadow-2xl focus:ring-4 focus:ring-[#FF4D6D] focus:outline-hidden transition-all"
    >
      Skip to main content
    </a>

    {/* Top Navbar */}
    <Navbar ... />

    {/* Main Content Area */}
    <main id="main-content" tabIndex={-1} className="relative z-10 focus:outline-hidden">
      ...
    </main>

    {/* Floating Action Buttons placed AFTER main content in DOM order */}
    {!isSimpleMode && <LabStudioDrawer />}
    <FloatingWhatsAppButton />
    <FloatingSimpleModeToggle />
    <BackToTopButton />
    <Footer />
  </div>
</RoleProvider>
```

#### Change 2: Universal High-Contrast `:focus-visible` in `src/index.css`
```css
/* Universal High-Contrast Focus Visible Rings */
:focus-visible {
  outline: 2px solid #FF4D6D !important;
  outline-offset: 2px !important;
}

.dark :focus-visible {
  outline: 2px solid #D946EF !important;
  outline-offset: 2px !important;
}

/* Ensure buttons and inputs with outline-none retain focus-visible */
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
[role="button"]:focus-visible,
[role="tab"]:focus-visible,
[role="radio"]:focus-visible {
  outline: 2px solid #FF4D6D !important;
  outline-offset: 2px !important;
}

.dark button:focus-visible,
.dark a:focus-visible,
.dark input:focus-visible,
.dark select:focus-visible,
.dark textarea:focus-visible,
.dark [role="button"]:focus-visible,
.dark [role="tab"]:focus-visible,
.dark [role="radio"]:focus-visible {
  outline: 2px solid #D946EF !important;
  outline-offset: 2px !important;
}
```

#### Change 3: Reusable Focus Trap Hook (`src/hooks/useFocusTrap.js`)
```javascript
import { useEffect, useRef } from 'react';

export function useFocusTrap(isOpen, containerRef, { initialFocusRef = null, onEscape = null } = {}) {
  const previousActiveElementRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElementRef.current = document.activeElement;

    const container = containerRef.current;
    if (!container) return;

    // Set initial focus
    const focusTimer = setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else {
        const focusable = container.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) {
          focusable[0].focus();
        }
      }
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (onEscape) {
          e.preventDefault();
          onEscape();
        }
        return;
      }

      if (e.key === 'Tab') {
        const focusable = Array.from(
          container.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null);

        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !container.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !container.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isOpen, containerRef, initialFocusRef, onEscape]);
}
```

#### Change 4: Connect Focus Trap to All 5 Overlays
- Wire `useFocusTrap` in `CommandPalette.jsx` with `initialFocusRef={inputRef}` and `onEscape={onClose}`.
- Wire `useFocusTrap` in `LabStudioDrawer.jsx` with `onEscape={closeDrawer}`; remove `tabIndex={0}` from backdrop `div` (set to `tabIndex={-1}`).
- Wire `useFocusTrap` in `CameraRollGallery.jsx` lightbox modal with `onEscape={() => setSelectedPhoto(null)}`.
- Wire `useFocusTrap` in `Navbar.jsx` mobile menu drawer with `onEscape={() => setMobileMenuOpen(false)}`; add `role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu"`.
- Implement `ArrowDown`/`ArrowUp` roving navigation in `ResumeDropdown.jsx`.

#### Change 5: Fix Tab Indexing & Keyboard Flow
- `TechMarqueeBanner.jsx`: Change marquee items from `tabIndex={0}` to `tabIndex={-1}`. The banner is an ambient decorative ticker; all items are already represented in `#skills` and `#projects` sections.
- `CursorSelectorRibbon.jsx`: Change cursor buttons from `tabIndex={0}` to `tabIndex={isActive ? 0 : -1}`, and add `ArrowLeft`/`ArrowRight` keydown listener to cycle selection.
- `BackToTopButton.jsx`: Add `tabIndex={isVisible ? 0 : -1}` and `aria-hidden={!isVisible}`.
- `ExperienceSection.jsx`: Change cards from plain divs to `<div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(exp.id); } }} aria-label={`Inspect experience: ${exp.role} at ${exp.company}`}>`.
- `InteractivePlayground.jsx`: Separate the accordion trigger button from the Reset & Drawer icon buttons.
- `ControlCenterPanel.jsx`: Add `ArrowLeft`/`ArrowRight` tab switching and `tabIndex={isActive ? 0 : -1}` to the 5-tab `role="tablist"`. Add visible focus rings to all toggle switches and range inputs.

---

## 5. Verification Method

To independently verify the observations, logic, and downstream implementation:

1. **Automated Verification**:
   - Run linter: `npm run lint` (`oxlint`). Must pass with 0 errors.
   - Run regression test suite: `npm test`. All 14 existing verification scripts must pass 100%.
   - Run production build: `npm run build` (`vite build`). Must compile with exit code 0.
   - Run newly created accessibility audit script: `node scripts/verify_accessibility.mjs` ensuring 0 violations for keyboard navigation, focus trap, and ARIA roles.

2. **Manual & Interactive Keyboard Verification**:
   - **Skip Link Test**: Load the root page `index.html`. Press `Tab` once. The skip link `"Skip to main content"` must appear prominently in the top-left corner with high-contrast ring. Press `Enter`. Focus must immediately land on `#main-content`, bypassing the navbar.
   - **Focus Indicator Audit**: Navigate with `Tab` across the entire page (Navbar -> Hero -> About -> Skills -> Experience -> Projects -> Contact -> Footer). Verify every interactive link, button, input, tab, and slider displays a high-contrast focus ring.
   - **Command Palette Trap Test**: Press `Cmd+K` / `Ctrl+K`. Focus enters the search input. Press `Shift+Tab`: focus wraps to the last focusable element inside the modal. Press `Tab` past the last element: focus wraps back to the input. Press `Escape`: palette closes and focus restores to the search button in the Navbar.
   - **Lab Drawer Trap Test**: Press `Enter` on the Lab FAB button. The drawer slides open and focus moves to the first control inside. Press `Tab` repeatedly: focus cycles strictly inside the drawer without escaping to the page behind. Press `Escape`: drawer closes and focus restores to the FAB button.
   - **Lightbox Trap Test**: Navigate to Polaroid Studio in `#gallery`. Press `Enter` on any polaroid card. Lightbox opens and focus moves inside. Press `Tab`: focus cycles between Close, Download Frame, and Share buttons. Press `Escape`: lightbox closes and focus restores to the exact polaroid card that opened it.
   - **Marquee Non-Interference**: Press `Tab` past HeroSection into TechMarqueeBanner. Verify the keyboard user is NOT forced to tab through 108 redundant moving chips, but proceeds smoothly to AboutSection.
   - **Experience Cards Test**: Navigate to `#experience`. Press `Tab`: each experience card receives focus. Press `Enter` or `Space`: the card activates and updates its inspection state.
   - **Back to Top Invisibility Test**: Scroll to top (`window.scrollY === 0`). Press `Tab` through the page: verify the hidden BackToTopButton is NOT focused.

3. **Invalidation Conditions**:
   - If any modal allows focus to escape into the background document while open, verification fails.
   - If any button or input has an invisible focus ring when navigated via keyboard, verification fails.
   - If pressing `Escape` in an overlay fails to restore focus to the opening trigger, verification fails.
