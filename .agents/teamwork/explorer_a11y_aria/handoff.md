# Technical Investigation Report: Pillar 2 — Screen Reader Semantics & ARIA Live Announcements

**Author:** `explorer_a11y_aria` (Read-Only Accessibility Exploration Agent)  
**Target Architecture:** WCAG 2.1 AA/AAA Compliant Landmark Semantics, Dynamic ARIA Live Regions, Accessible Labeling, and Decorative Isolation  
**Reference Dispatch:** `orchestrator_8/DISPATCH.md` | `ORIGINAL_REQUEST.md` (`2026-10-19T22:12:04Z`)  
**Date:** 2026-10-19T22:30:00Z  

---

## 1. Observation

### 1.1 Landmark Architecture & Structural Hierarchy
Direct inspection of landmark container tags across the application revealed:
1. **`<main>` without ID & Missing Skip Link:**
   - In `src/App.jsx:176`:
     ```jsx
     {/* Main Content Area - In Exact Instagram Reel Chronological Sequence */}
     <main className="relative z-10">
     ```
     The `<main>` element lacks `id="main-content"` and lacks `tabIndex={-1}`.
   - In `index.html:40-42` and `src/App.jsx:132-175`: There is zero skip-to-content anchor (`<a href="#main-content" className="sr-only focus:not-sr-only ...">`). Keyboard and screen reader users are forced to traverse all header navigation elements on every page load.
2. **Section Landmark Labeling Absence:**
   None of the 10 core portfolio section components provide an accessible name via `aria-labelledby` or `aria-label`:
   - `src/components/HeroSection.jsx:804`: `<section id="hero" ...>` — lacks `aria-label="Introduction"` or `aria-labelledby`.
   - `src/components/TechMarqueeBanner.jsx:495`: Rendered as a bare `<div ref={bannerRef}>` without a landmark or section tag.
   - `src/components/AboutSection.jsx:609`: `<section id="about" className="...">` — lacks `aria-labelledby="about-heading"`. (Heading `<h2>Who I am.</h2>` at line 626 has no `id`).
   - `src/components/SkillsSection.jsx:525`: `<section id="skills" className="...">` — lacks `aria-labelledby="skills-heading"`. (`<h2>What I work with.</h2>` at line 535 has no `id`).
   - `src/components/ExperienceSection.jsx:243`: `<section id="experience" className="...">` — lacks `aria-labelledby="experience-heading"`. (`<h2>Journey & Experience.</h2>` at line 253 has no `id`).
   - `src/components/ProjectsSection.jsx:1126`: `<section id="projects" className="...">` — lacks `aria-labelledby="projects-heading"`. (`<h2>Selected work.</h2>` at line 1139 has no `id`).
   - `src/components/CodingAchievementsSection.jsx:234`: `<section id="achievements" className="...">` — lacks `aria-labelledby="achievements-heading"`. (`<h2>Professional Milestones & Certifications.</h2>` at line 273 has no `id`).
   - `src/components/CameraRollGallery.jsx:107`: `<section id="gallery" className="...">` — lacks `aria-labelledby="gallery-heading"`. (`<h2>Captured Polaroid Studio.</h2>` at line 118 has no `id`).
   - `src/components/InteractivePlayground.jsx:28`: `<section id="playground" className="...">` — lacks `aria-labelledby="playground-heading"`. (`<h2>System Control & Live Calibration.</h2>` at line 58 has no `id`).
   - `src/components/ContactSection.jsx:652`: `<section id="contact" className="...">` — lacks `aria-labelledby="contact-heading"`. (`<h2>Let's build something meaningful.</h2>` has no `id`).
3. **Modal & Drawer Dialog Architecture:**
   - `src/components/LabStudioDrawer.jsx:93-101`:
     ```jsx
     <aside
       id="portfolio-control-center-drawer"
       role="dialog"
       aria-modal="true"
       aria-label="Portfolio Control Center Drawer"
       className={`fixed top-0 right-0 h-full ... will-change-transform ${
         isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
       }`}
     >
     ```
     When `isDrawerOpen === false`, the drawer is merely shifted off-screen with `translate-x-full`. It remains in the DOM accessibility tree, has no `aria-hidden="true"`, and lacks the `inert` attribute. Screen reader virtual cursors and keyboard Tab navigation can wander into hidden drawer controls.
   - `src/components/Navbar.jsx:629`: Mobile drawer is rendered as a standard `<div>` without `<nav aria-label="Mobile Navigation">` or `role="dialog" aria-modal="true"`.
   - `src/components/CommandPalette.jsx:446-452`: Renders `<div role="dialog" aria-modal="true" aria-label="Command Palette Search">`, but the search input and results list do not follow the W3C ARIA Combobox/Listbox pattern (`role="combobox"`, `role="listbox"`, `role="option"`, `aria-activedescendant`).

---

### 1.2 Dynamic Live Announcements System
Search across the entire codebase for `aria-live` returned only 4 isolated instances:
- `src/components/ContactSection.jsx:659`: Floating toast notification (`role="status" aria-live="polite"`).
- `src/components/HeroSection.jsx:1025`: Zoom HUD badge (`role="status" aria-live="polite"`).
- `src/components/RoleEmptyState.jsx:39`: Empty state announcement (`aria-live="polite"`).
- `src/components/AboutSection.jsx:1060`: Copy address button (`aria-live="polite"` placed directly on `<button>`, which screen readers ignore).

**Critical Missing Live Announcements Identified:**
1. **Career Track Switching:** In `src/context/RoleContext.jsx:150-210`, switching between `overview`, `accountant`, `mis`, `vibe_coding`, and `other` dynamically swaps page titles, credentials, projects, and skills. Screen readers receive zero announcement of the context transition (e.g. *"Switched to Accountant & Tax track (Financial Track)"*).
2. **Section Tab Switches:**
   - In `AboutSection.jsx:504-519`: Switching between "Story & Vision", "Qualifications", and "Official Bio-Data" updates active panel without an announcement.
   - In `ContactSection.jsx:710-745`: Switching between "Inquiry Form", "Direct Channel", and "HQ Location / Map".
   - In `ControlCenterPanel.jsx:270-310`: Switching between "Audio Studio", "Cursor & Dynamics", "Hero & Character", "Preferences", and "Display & Visuals".
3. **Animated Counter Completion:**
   - In `src/components/AnimatedCounter.jsx:233`:
     ```jsx
     <span ref={containerRef} className={`tabular-nums inline-block ${className}`}>
       {displayValue}
     </span>
     ```
     As `displayValue` counts from 0 up to target (e.g. 0 to 7 Years or 10x Speed over 1800ms), screen readers read out intermediate counting values or hear numeric churn. No completion announcement is made, and no static accessible label is provided for immediate consumption.
4. **Form Validation & Submission Status:**
   - In `src/components/ContactSection.jsx:788-793`:
     ```jsx
     {submitError && (
       <div className="mb-6 p-4 rounded-xl bg-rose-50 ...">
         <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
         <span className="font-medium">{submitError}</span>
       </div>
     )}
     ```
     The error alert container lacks `role="alert"` and lacks `aria-live="assertive"`. A screen reader user submitting an invalid form receives no vocal feedback about the error. Furthermore, input fields (`#field-name`, `#field-email`, `#field-whatsapp`) lack `aria-invalid` and `aria-describedby` referencing error messages.
5. **System Setting Toggles:**
   - Audio mute/unmute toggle (`Navbar.jsx:521`, `ControlCenterPanel.jsx:343`).
   - Custom cursor toggle (`ControlCenterPanel.jsx:548`).
   - Simple Mode toggle (`FloatingSimpleModeToggle.jsx:107`, `Navbar.jsx:677`).
   - High Contrast toggle (upcoming Pillar 4 integration).
   - "Copied to clipboard" feedback (`AboutSection.jsx:1060`, `ContactSection.jsx:1060`, `ResumeDropdown.jsx:435`).

---

### 1.3 Accessible Labeling Audit (Interactive Controls)
Direct audit of interactive buttons, toggles, and inputs revealed:
1. **ControlCenterPanel.jsx Missing Accessible Names:**
   - **Line 343 (Master Sound Switch):**
     ```jsx
     <button
       role="switch"
       aria-checked={soundEnabled}
       onClick={() => setSoundEnabled(!soundEnabled)}
       className={`w-12 h-6 rounded-full ...`}
     >
     ```
     Has `role="switch"` and `aria-checked`, but **zero accessible name** (no `aria-label="Master Sound"` or `aria-labelledby`).
   - **Line 548 (Custom Cursor Switch):**
     ```jsx
     <button
       role="switch"
       aria-checked={customCursorEnabled}
       onClick={() => setCustomCursorEnabled(!customCursorEnabled)}
       className={`w-12 h-6 rounded-full ...`}
     >
     ```
     Has `role="switch"`, but **zero accessible name** (missing `aria-label="Custom Interactive Cursor"`).
   - **Line 645 (Stardust Trail Switch):**
     ```jsx
     <button
       role="switch"
       aria-checked={stardustTrailEnabled}
       onClick={() => setStardustTrailEnabled(!stardustTrailEnabled)}
     >
     ```
     Missing `aria-label="Stardust Particle Trail"`.
   - **Line 696 & 703 (Particle Color Pickers):**
     ```jsx
     <input type="color" ... title="Custom Color Picker" />
     <input type="text" value={particleColor.toUpperCase()} ... />
     ```
     Both inputs lack `aria-label` (`aria-label="Custom particle color picker"` and `aria-label="Hex color code"`).
   - **Line 1245 (Reduced Motion Switch):**
     ```jsx
     <button
       role="switch"
       aria-checked={reducedMotion}
       onClick={() => setReducedMotion(!reducedMotion)}
     >
     ```
     Missing `aria-label="Reduced Motion"`.
2. **InteractivePlayground.jsx Nested Interactive Controls:**
   - In `src/components/InteractivePlayground.jsx:37-108`:
     The collapsible trigger header is wrapped with:
     ```jsx
     <div id="system-control-panel-trigger" role="button" tabIndex={0} aria-expanded={isExpanded} ...>
     ```
     Inside this `role="button"` container are two interactive `<button>` elements:
     - Line 69: `<button type="button" aria-label="Reset Defaults" ...>`
     - Line 87: `<button type="button" aria-label="Open Quick Drawer" ...>`
     **W3C ARIA Rule Violation:** Interactive elements cannot be nested inside an element with `role="button"`.
3. **ExperienceSection.jsx Div Click Handler:**
   - In `src/components/ExperienceSection.jsx:334`:
     ```jsx
     <div
       key={exp.id}
       id={exp.targetId || exp.id}
       onClick={() => handleCardClick(exp.id)}
       className={`scroll-mt-28 group cursor-pointer ...`}
     >
     ```
     An interactive selectable card is implemented as a plain `<div>` with `onClick`, without `role="button"`, `tabIndex={0}`, `onKeyDown`, or `aria-expanded` / `aria-pressed`. Keyboard and screen reader users cannot focus or activate this element.
4. **HeroSection.jsx Controls:**
   - Scale slider (`HeroSection.jsx:1340`): Has `aria-label="Character scale slider"`, but lacks `aria-valuemin="50"`, `aria-valuemax="200"`, `aria-valuenow={Math.round(userScale * 100)}`, and `aria-valuetext={`${Math.round(userScale * 100)}%`}`.
   - Re-center button (`HeroSection.jsx:1389`): `aria-label="Reset Character Position (🎯)"` contains a raw emoji that screen readers read phonetically as "direct hit"; should be `"Reset character position to center"`.
5. **Floating Action Buttons & Visual Tooltips:**
   - `BackToTopButton.jsx:156`: `aria-label={`Back to top (scrolled ${Math.round(scrollProgress)}%)`}` is good, but the child `<ArrowUp>` icon and the visual tooltip span at line 201 lack `aria-hidden="true"`.
   - `FloatingSimpleModeToggle.jsx:120`: Has dynamic `aria-label`, but child `<Sparkles>` / `<Eye>` icons and visual tooltip span at line 142 lack `aria-hidden="true"`.
   - `FloatingWhatsAppButton.jsx:106`: Has descriptive `aria-label`, but visual tooltip span at line 126 lacks `aria-hidden="true"`.

---

### 1.4 Decorative Isolation Audit
Direct scan of visual effects and non-content decoratives revealed:
1. **Canvases:**
   - `src/components/ButterflyCursor.jsx:428-438`: Both `<canvas ref={canvasRef}>` and the butterfly stage `<div>` properly include `aria-hidden="true"`.
   - `src/components/cursors/ModularKinematicCursor.jsx:439`: Outer container has `aria-hidden="true"`, but inner `<canvas>` should explicitly declare `aria-hidden="true"`.
2. **Background Textures & Ambient Gradient Blobs (Missing `aria-hidden="true"`):**
   - `src/App.jsx:136`: `<div className="fixed inset-0 bg-dot-pattern opacity-50 dark:opacity-30 pointer-events-none z-0 ..." />` — lacks `aria-hidden="true"`.
   - `src/components/TechMarqueeBanner.jsx:500`: `<div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />` — lacks `aria-hidden="true"`.
   - `src/components/AboutSection.jsx:714`: `<div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ..." />` — lacks `aria-hidden="true"`.
   - `src/components/CodingAchievementsSection.jsx:237 & 250`: Ambient blur blobs — lack `aria-hidden="true"`.
   - `src/components/ContactSection.jsx:758`: Ambient blur blob — lacks `aria-hidden="true"`.
   - `src/components/ExperienceSection.jsx:305`: Ambient blur blob — lacks `aria-hidden="true"`.
   - `src/components/HeroSection.jsx:857`: Stage backdrop `<img src={IMG_BG_HERO} alt="Studio Stage Backdrop" ...>` — read out by screen readers as a real content image; needs `alt=""` and `aria-hidden="true"`.
   - `src/components/HeroSection.jsx:1018-1019`: Ambient gradient overlays — lack `aria-hidden="true"`.
   - `src/components/HeroSection.jsx:1037`: Camera focus reticle — lacks `aria-hidden="true"`.
   - `src/components/Footer.jsx:14`: Giant Faint Watermark Text "ATUL VERMA" (`<div className="absolute inset-x-0 bottom-2 text-center pointer-events-none select-none overflow-hidden opacity-[0.06]">`) — read out redundantly; needs `aria-hidden="true"`.
   - `src/components/ProjectsSection.jsx:265`: Coloured terminal window dots (red, amber, green circles) — lack `aria-hidden="true"`.
3. **Decorative Glyphs & Emojis:**
   - `src/components/TechMarqueeBanner.jsx:547 & 651`: Butterfly emojis `<span>🦋</span>` repeat 108 times inside interactive buttons without `aria-hidden="true"`.
   - `src/components/Footer.jsx:24`: `<span className="text-base">🦋</span>` — lacks `aria-hidden="true"`.
   - `src/components/Footer.jsx:32 & 41`: Bullet `<span className="text-stone-600">•</span>` and `<Heart>` icon — lack `aria-hidden="true"`.
   - Marquee item sparkles `<span>✦</span>` (`TechMarqueeBanner.jsx:583 & 687`) — lack `aria-hidden="true"`.
   - All Lucide SVG icons sitting inside buttons or anchors with text or `aria-label` — must include `aria-hidden="true"`.

---

## 2. Logic Chain

```
Observation 1.1: <main> has no ID, no skip link exists, and sections lack aria-labelledby
  ↳ Logic Step 1: Keyboard and screen reader users cannot bypass navigation landmarks to jump directly to primary content, and screen reader rotor/landmarks menu displays generic unlabeled sections.
    ↳ Remediation: Add a standard Skip-to-Content link as the first focusable child of <App /> pointing to #main-content. Assign id="main-content" tabIndex={-1} to <main>. Add aria-labelledby="<section>-heading" to each of the 10 sections.

Observation 1.1: LabStudioDrawer stays in DOM with translate-x-full when closed
  ↳ Logic Step 2: Screen reader virtual cursor and keyboard Tab key navigate into offscreen controls inside the hidden drawer.
    ↳ Remediation: Apply inert={!isDrawerOpen} and aria-hidden={!isDrawerOpen} to the <aside id="portfolio-control-center-drawer"> element.

Observation 1.2: Zero centralized live announcer service; role track, tab, form error, and counter changes occur silently
  ↳ Logic Step 3: Screen reader users have no situational awareness when page content changes dramatically upon role switching or form submission.
    ↳ Remediation: Create a global AriaLiveAnnouncer component / useAnnounce hook managing polite (<div role="status" aria-live="polite">) and assertive (<div role="alert" aria-live="assertive">) announcements. Wire announcements to role changes in RoleContext, tab switches, and form errors in ContactSection.

Observation 1.3: Unlabeled toggle switches in ControlCenterPanel (Master Sound, Custom Cursor, Stardust Trail, Reduced Motion)
  ↳ Logic Step 4: Screen reader announces "switch, checked/unchecked" with no accessible name, leaving users unable to know what setting they are adjusting.
    ↳ Remediation: Add explicit aria-label attributes to each switch button matching its card heading.

Observation 1.3: InteractivePlayground nests buttons inside a role="button" container
  ↳ Logic Step 5: Screen readers fail to properly activate or describe nested interactive controls, violating W3C ARIA specifications.
    ↳ Remediation: Separate the accordion toggle button from the adjacent "Reset Defaults" and "Open Drawer" action buttons into distinct sibling elements.

Observation 1.4: 108 repeating butterfly emojis, dot meshes, ambient gradient blobs, and backdrop images lack aria-hidden="true"
  ↳ Logic Step 6: Screen readers read decorative noise ("butterfly", "Studio Stage Backdrop", "ATUL VERMA"), cluttering speech output.
    ↳ Remediation: Mark all non-content decorative visual elements, SVG icons, background meshes, and watermark text with aria-hidden="true", and set alt="" on purely decorative images.
```

---

## 3. Caveats

1. **Leaflet OpenStreetMap Integration:**
   `LeafletOfflineMap.jsx` uses a third-party Leaflet DOM container. Leaflet injects its own internal attribution and pane elements. The container already includes `aria-label="Offline OpenStreetMap of Medininagar (Daltonganj), Jharkhand"`, but internal SVG tile clipping should remain untouched to prevent Leaflet render glitches.
2. **Infinite Marquee Duplication:**
   `TechMarqueeBanner.jsx` duplicates the skill list 4 times for seamless infinite CSS animation. In reduced motion mode or when viewed via a screen reader, having 108 interactive buttons is overwhelming. While keeping the visual presentation intact, redundant loops should be marked with `aria-hidden="true"` so screen readers encounter each skill only once.
3. **No Direct Code Modifications in this Step:**
   As a read-only investigation agent, this report presents the verified facts, exact lines, and structural proposals. Implementation will be executed by the designated implementer subagent.

---

## 4. Conclusion & Actionable Remediation Proposals

### Proposal 1: Implement Global Skip-to-Content & Landmark Hierarchy
**Target Files:** `src/App.jsx`, `index.html`

```jsx
// In src/App.jsx (top of component return):
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:rounded-xl focus:bg-[#FF4D6D] focus:text-white focus:font-bold focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
>
  Skip to main content
</a>

// On <main>:
<main id="main-content" tabIndex={-1} className="relative z-10 focus:outline-none">
```

### Proposal 2: Standardize `aria-labelledby` Across All 10 Sections
| Component File | Section ID | Heading ID to Add | Target Section Attribute |
|---|---|---|---|
| `HeroSection.jsx:804` | `hero` | (None, hero has title/sub) | `aria-label="Introduction & Character Tracking"` |
| `TechMarqueeBanner.jsx:495` | `tech-marquee` | Change `<div>` to `<section>` | `aria-label="Technology and Core Skills Marquee"` |
| `AboutSection.jsx:609` | `about` | `id="about-heading"` on line 626 | `aria-labelledby="about-heading"` |
| `SkillsSection.jsx:525` | `skills` | `id="skills-heading"` on line 535 | `aria-labelledby="skills-heading"` |
| `ExperienceSection.jsx:243` | `experience` | `id="experience-heading"` on line 253 | `aria-labelledby="experience-heading"` |
| `ProjectsSection.jsx:1126` | `projects` | `id="projects-heading"` on line 1139 | `aria-labelledby="projects-heading"` |
| `CodingAchievementsSection.jsx:234` | `achievements` | `id="achievements-heading"` on line 273 | `aria-labelledby="achievements-heading"` |
| `CameraRollGallery.jsx:107` | `gallery` | `id="gallery-heading"` on line 118 | `aria-labelledby="gallery-heading"` |
| `InteractivePlayground.jsx:28` | `playground` | `id="playground-heading"` on line 58 | `aria-labelledby="playground-heading"` |
| `ContactSection.jsx:652` | `contact` | `id="contact-heading"` on line 690 | `aria-labelledby="contact-heading"` |

### Proposal 3: Create Dedicated `AriaLiveAnnouncer` Service
**Target File:** `src/components/AriaLiveAnnouncer.jsx` (New file) + Wire into `src/App.jsx` and `src/context/RoleContext.jsx`

```jsx
// Architectural Design:
import React, { createContext, useContext, useState, useCallback } from 'react';

const AnnounceContext = createContext(null);

export function AriaLiveAnnouncerProvider({ children }) {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');

  const announce = useCallback((message, priority = 'polite') => {
    if (!message) return;
    if (priority === 'assertive') {
      setAssertiveMessage('');
      requestAnimationFrame(() => setAssertiveMessage(message));
    } else {
      setPoliteMessage('');
      requestAnimationFrame(() => setPoliteMessage(message));
    }
  }, []);

  return (
    <AnnounceContext.Provider value={{ announce }}>
      {children}
      {/* Offscreen Accessible Live Regions */}
      <div className="sr-only">
        <div role="status" aria-live="polite" aria-atomic="true">
          {politeMessage}
        </div>
        <div role="alert" aria-live="assertive" aria-atomic="true">
          {assertiveMessage}
        </div>
      </div>
    </AnnounceContext.Provider>
  );
}

export function useAnnounce() {
  return useContext(AnnounceContext);
}
```

### Proposal 4: Remediate ControlCenterPanel.jsx Toggle Switches
Add explicit `aria-label` to switches:
- Line 343: `aria-label="Toggle Master Audio"`
- Line 548: `aria-label="Toggle Custom Interactive Cursor"`
- Line 645: `aria-label="Toggle Stardust Particle Trail"`
- Line 696: `aria-label="Custom particle color picker"`
- Line 703: `aria-label="Hex color code input"`
- Line 1245: `aria-label="Toggle Reduced Motion accessibility mode"`

### Proposal 5: Unnest Interactive Controls in `InteractivePlayground.jsx`
Replace the wrapper `role="button"` on the whole header row (`line 37-51`) with:
- A dedicated `<button type="button" aria-expanded={isExpanded} aria-controls="system-control-panel-content" onClick={toggleAccordion}>` enclosing the title & chevron.
- The action buttons (`Reset Defaults` and `Open Drawer`) placed outside the toggle button as clean siblings.

### Proposal 6: Inert Containment for `LabStudioDrawer.jsx`
In `src/components/LabStudioDrawer.jsx:93`:
```jsx
<aside
  id="portfolio-control-center-drawer"
  role="dialog"
  aria-modal="true"
  aria-label="Portfolio Control Center Drawer"
  aria-hidden={!isDrawerOpen}
  inert={!isDrawerOpen ? '' : undefined}
  className={`fixed top-0 right-0 ...`}
>
```

### Proposal 7: Decorative Isolation (`aria-hidden="true"`)
- Apply `aria-hidden="true"` to:
  - `src/App.jsx:136` (background dot pattern)
  - `src/components/TechMarqueeBanner.jsx:500` (marquee background pattern) and lines 547, 651 (`<span>🦋</span>`)
  - `src/components/Footer.jsx:14` (watermark text), line 24 (`<span>🦋</span>`), line 41 (`<Heart />`)
  - Ambient glow blobs in `AboutSection.jsx:714`, `CodingAchievementsSection.jsx:237, 250`, `ContactSection.jsx:758`, `ExperienceSection.jsx:305`
  - Decorative icons inside buttons with text or explicit `aria-label`s across all components.

---

## 5. Verification Method

To independently verify these findings and confirm post-implementation compliance:

1. **Automated Verification Script (`scripts/verify_accessibility.mjs`):**
   Run the accessibility audit script:
   ```powershell
   node scripts/verify_accessibility.mjs
   ```
   *Expected criteria:*
   - Verified presence of skip link (`#main-content`) in `App.jsx`
   - Verified `id="main-content"` on `<main>`
   - Verified `aria-labelledby` or `aria-label` on all 10 `<section>` tags
   - Verified `aria-live` polite and assertive regions exist
   - Verified zero unlabeled `role="switch"` or `<input type="color">` in `ControlCenterPanel.jsx`
   - Verified `inert` / `aria-hidden` attribute on `LabStudioDrawer.jsx` when closed
   - Verified `aria-hidden="true"` on dot pattern and background blur decorations

2. **Automated Test Suite Regression Gate:**
   ```powershell
   npm test
   ```
   *Expected result:* 100% of test suites pass with 0 regressions.

3. **Production Lint & Build Verification:**
   ```powershell
   npm run lint
   npm run build
   ```
   *Expected result:* Oxlint reports 0 errors; Vite produces production bundle with exit code 0.

4. **Screen Reader Verification (NVDA / VoiceOver / JAWS):**
   - Pressing `Tab` immediately upon page load moves focus to the "Skip to main content" link. Pressing `Enter` shifts focus to `#main-content`.
   - Opening Screen Reader Elements List (NVDA: `Insert+F7` -> Landmarks) displays 10 distinctly named landmarks (`Introduction`, `About`, `Skills`, `Experience`, `Selected work`, `Achievements`, `Gallery`, `Control Center`, `Contact`, `Footer`).
   - Triggering a role track change announces *"Switched to [Role Name] track"* politely.
   - Submitting an invalid contact form triggers an immediate assertive announcement of the validation error.
   - When `LabStudioDrawer` is closed, pressing `Tab` never focuses any control inside the drawer.
