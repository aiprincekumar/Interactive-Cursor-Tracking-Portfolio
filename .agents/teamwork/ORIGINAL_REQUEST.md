# Original User Request

## Initial Request — 2026-10-15T19:21:33Z

Comprehensively update the interactive portfolio website with the complete and authentic resume data of **Atul Kant Verma** while strictly preserving 100% of all visual assets, 2.5D character poses, hero background, camera roll gallery photos, and interactive physics.

Working directory: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio`
Integrity mode: development

## Extracted Profile Data
- **Full Name:** Atul Kant Verma (Brand: Atul Verma | Initials: AV)
- **Hero Title:** Accountant & Tax Consultant.
- **Hero Subtitle:** Business Development & Office Administrator.
- **Contact:** +91-7004149900 | Atulravi2015@gmail.com
- **Location:** Daltonganj (Medininagar), Dist: Palamau, Jharkhand, Pin: 822101
- **Education & Certifications:**
  - Advance Diploma in Computer Application (ADCA) — Infocity Daltonganj
  - Intermediate of Arts (I.A.) — Baba Nawbat Choudhry Surtapur Kundesar Ghazipur, UP Board
  - Matriculation — Radha Govind Public School Ramgarh Cant, CBSE Board
- **Professional Experience (All 6 Roles to be Represented):**
  1. GST & Income Tax Filer (Last 3+ Years) — E-filing, compliance, reconciliation, client advisory.
  2. Tally Accountant (Last 4+ Years) — Comprehensive financial accounting, inventory, vouchers, balance sheet.
  3. MIS Executive — DAY-NULM Skill India — Trainee data reporting, portal management, progress analytics.
  4. Accountant — Junks Food Agency (Path Solution) — Stock handling, billing, franchise coordination.
  5. Smart Card Operations Specialist (4 Districts in Bihar & Jharkhand) — Field verification, data processing, rollout.
  6. Computer Instructor / Private Tutor — Teaching MS Office, Windows fundamentals, and DTP.
- **Technical & Operational Skills:**
  - Accounting & Tax: Tally ERP/Prime, GST Filing & Compliance, Income Tax E-Filing, Financial Auditing & Ledgers.
  - Software & Applications: MS Office (Advanced Excel, Word, PowerPoint), DTP (Photoshop / Corel / PageMaker), Path Solution.
  - IT Systems & Hardware: Windows OS, Computer Applications (ADCA), Hardware & Software Diagnosis & Maintenance.
  - Management & Operations: Office Administration, Stock Handling, MIS Reporting, Business Development.
- **Visual Assets Strict Invariance:**
  - The 3D character poses (`00-rear-view.png` through `09-lower-right.png`), hero background (`BgHero.jpg`), and `CameraRollGallery` photos must remain completely unchanged.
- **Social Media Links:**
  - Social icons remain visible in HeroSection and ContactSection with placeholder `#` links (GitHub to be provided later by user).

## Requirements

### R1. Brand Identity, Hero & Navigation Overhaul
Update `index.html`, `Navbar.jsx`, `HeroSection.jsx`, and `Footer.jsx` with Atul Kant Verma's name, brand logo initials (`AV`), title ("Accountant & Tax Consultant."), subtitle ("Business Development & Office Administrator."), and location/contact info, completely replacing all occurrences of previous individual ("Sushmita Tiwari", "Sushmitha Dasari").

### R2. About & Editorial Narrative Customization
Update `AboutSection.jsx` to narrate Atul's career story, reflecting his 4+ years in Accounting, 3+ years in GST/Income Tax, MIS operations at DAY-NULM Skill India, and education (ADCA Infocity Daltonganj, I.A., Matriculation) in Daltonganj, Jharkhand.

### R3. Skills & Technology Marquee Re-alignment
Update `SkillsSection.jsx` and `TechMarqueeBanner.jsx` to feature Atul's actual domain skills (Tally Prime, GST, Income Tax, Advanced Excel, DTP, ADCA, MIS, Hardware/Software Support) across properly structured categories.

### R4. Experience Section Transformation
Update `ExperienceSection.jsx` to feature Atul's comprehensive work history (GST/Tax Filer, Tally Accountant, DAY-NULM MIS, Junks Food Agency, Smart Card Multi-District, Computer Instructor) with realistic professional deliverables.

### R5. Projects & Milestones Re-purposing
Update `ProjectsSection.jsx` and `CodingAchievementsSection.jsx`:
- Project 01: GST & Income Tax Compliance & Verification Engine (preserving interactive audit simulator).
- Project 02: Tally Financial Accounting & Inventory Management (preserving interactive state machine).
- Project 03 & 04: DAY-NULM Skill India MIS Reporting & Multi-District Smart Card Operations.
- Achievements: Re-theme to "Professional Milestones & Certifications" highlighting 4+ Years Tally Accounting, 3+ Years Tax Filing, 4 Districts Smart Card Operations, and ADCA Certification.

### R6. Contact Section & Direct Communication
Update `ContactSection.jsx` with Atul's direct email (`Atulravi2015@gmail.com`), phone number (`+91 7004149900`), location (`Daltonganj, Jharkhand`), and active contact form triggers.

## Acceptance Criteria

### Data Cleansing & Veracity
- [ ] Zero instances of "Sushmita", "Dasari", "srii_tech_", or "Technical Hub" remain in any user-facing text or code strings.
- [ ] All contact details, location, and credentials accurately match Atul Kant Verma's resume.

### Visual & Functional Preservation
- [ ] All 10 character gaze poses, 2.5D head tracking, camera focus reticle, and photo capture remain 100% active.
- [ ] Interactive mockups (Audit simulator, Payment/accounting state machine, sound FX, cursor ribbon) remain fully working.
- [ ] `npm run build` succeeds with zero errors.


## Follow-up — 2026-10-15T19:22:48Z

Requested team: Full Team

Implement the Navbar All-in-One Power Pack in the Interactive Cursor-Tracking Portfolio: an interactive Command Palette search modal (⌘K), a multi-option Resume dropdown menu with confetti celebratory feedback, and a real-time scroll progress indicator bar.

Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio
Integrity mode: development

## Requirements

### R1. Command Palette / Global Search Modal (`Cmd+K`)
- Add a dedicated search button with a magnifying glass icon and `⌘K` badge to the navbar's right action group placed immediately before the cursor selector icon (`[🔍 Search] -> [🦋 Cursor] -> [🔊 Sound] -> [📄 Resume]`).
- Pressing the button or pressing `Cmd+K` / `Ctrl+K` globally anywhere on the page opens an interactive modal with subtle backdrop blur.
- The modal allows instant search/filtering across all portfolio sections (#hero, #about, #skills, #experience, #projects, #gallery, #playground, #contact), featured projects (*PolicyGuard AI*, *Payment Gateway State Machine*), and skills.
- Supports keyboard navigation (`ArrowUp`/`ArrowDown` to highlight, `Enter` to scroll to target, and `Escape` to close) as well as backdrop click-to-close.

### R2. Smart Resume Action Dropdown
- Replace the static `#contact` anchor on the coral Resume button with a toggleable dropdown menu.
- The dropdown offers three distinct actions:
  1. **View Online / Preview**: Opens/previews the resume in a new tab or modal.
  2. **Download PDF**: Triggers resume download along with a burst of celebratory canvas confetti (`canvas-confetti`) and sparkle audio chime.
  3. **Copy Resume Link**: Copies the resume link to clipboard with brief "Copied!" visual feedback.
- Includes outside-click and `Escape` key handling to close smoothly.

### R3. Scroll Progress Indicator Bar
- Add a 2.5px micro gradient progress bar (`#FF4D6D` to `#FFAA00`) smoothly integrated along the bottom edge of the floating navbar header.
- The bar dynamically and accurately tracks window scroll progress from 0% to 100% of the document.

## Acceptance Criteria

### Functionality & Polish
- [ ] Navbar right actions order strictly renders: `[🔍 Search] -> [🦋 Cursor] -> [🔊 Sound] -> [📄 Resume]`.
- [ ] Keyboard shortcut `Cmd+K` / `Ctrl+K` opens the search modal; `Escape` or backdrop click closes it.
- [ ] Selecting any search result smoothly scrolls to the target anchor without page reloads.
- [ ] Clicking the Resume button displays the dropdown with "View Online", "Download PDF", and "Copy Link" options.
- [ ] Triggering "Download PDF" fires a confetti burst and plays audio feedback if sound is unmuted.
- [ ] Scroll progress bar scales smoothly from 0% to 100% width across the bottom of the navbar as the page is scrolled.
- [ ] Mobile responsive layout preserves accessibility, drawer navigation, and touch targets.
- [ ] Build and lint pass cleanly with zero errors (`npm run build` and `npx oxlint` succeed).


## Follow-up — 2026-10-15T21:22:12Z

This is a single self-contained fix; keep it small and focused.
Refactor the 'About Us' section of the interactive cursor-tracking portfolio into a modular, decluttered 3-tab architecture (Story & Vision, Qualifications & Education, Official Bio-Data) with aligned career objectives and core competencies.

Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio
Integrity mode: development

## Requirements

### R1. Modular 3-Tab Interactive Architecture
The About section must provide smooth, interactive tab switching across three distinct views without page reload or layout shift:
1. **Executive Story & Vision:** 3-paragraph executive professional narrative, aligned career vision, and 4 high-level Core Competency pillars (replacing redundant task bullets).
2. **Academic & Technical Qualifications:** Visual timeline cards showcasing credentials (ADCA Diploma, Intermediate of Arts, Matriculation) with board badges and clean typography.
3. **Official Bio-Data Dossier:** Verified personal demographics (Father's Name, DOB, Marital Status, Languages, Full Address) structured in a neat credential card.

### R2. Content Alignment & Redundancy Elimination
- Align the Career Objective statement to reflect both Senior Financial Accounting / Tax Compliance leadership AND Business Development / Strategic Growth.
- Eliminate duplicated operational bullets (e.g. Tally stock handling, franchise oversight) that are already present in the Experience section, substituting them with high-impact Core Competency pillars (Statutory Compliance & GST/ITR, Audit Readiness & Financial Reporting, Tally Prime & ERP Architecture, Financial MIS & Operations).

### R3. UI Polish & Sound FX Integration
- Tab controls must match the design system (warm cream/coral aesthetic, smooth transitions, keyboard accessible, mobile responsive).
- Tab switches should trigger existing portfolio sound FX and micro-animations seamlessly.

## Acceptance Criteria

### Functional & Interactive
- [ ] Clicking any of the 3 tabs switches the active view immediately with smooth transition.
- [ ] Default active tab on initial load is 'Story & Vision'.
- [ ] Sound effects trigger properly on tab interaction if sound is enabled.

### Code Quality & Build
- [ ] Project builds cleanly via `npm run build` with zero errors.
- [ ] No regression or layout shifts in the Reel timeline or neighboring sections.
- [ ] All personal details and educational credentials are accurately preserved.


## Follow-up — 2026-10-16T11:10:18Z

Implement synchronized horizontal role tabs across the interactive portfolio to cleanly separate and showcase two distinct career tracks: "Accountant & Tax" (Financial Track) and "MIS & Analytics" (Data & Operations Track).

Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio
Integrity mode: development

## Requirements

### R1. Synchronized Role State & Navigation
Provide a global, synchronized role-selection state (Tab 1: "Accountant & Tax" [Badge: Financial Track], Tab 2: "MIS & Analytics" [Badge: Data & Operations Track]). Switching the role in any section or via the header switcher must immediately synchronize all sections across the portfolio. The active role must default to "Accountant & Tax", persist in `localStorage`, and reflect in/listen to URL query parameters (`?role=accountant` or `?role=mis`).

### R2. Section-Level Horizontal Tabs
Add horizontal tabs adhering to the existing design system (`#FAF8F5`, `#FF4D6D` coral accent, WAI-ARIA tab semantics, keyboard navigation, and `.animate-tab-fade` transitions) to:
- **ExperienceSection:** Filter/display 3 Accountant roles (GST Consultant, Senior Tally Accountant, Junks Food FMCG) under Tab 1, and 3 MIS roles (DAY-NULM MIS Executive, Smart Card Operations, Computer Instructor) under Tab 2.
- **ProjectsSection:** Display Accountant projects under Tab 1 (GST Compliance Engine, Tally Architecture) and MIS projects under Tab 2 (DAY-NULM MIS Portal, Smart Card Operations Engine).
- **SkillsSection:** Display Accounting skills under Tab 1 and MIS/Data/Office IT skills under Tab 2.
- **AboutSection:** Adapt narrative and competencies focus according to the active role tab.

### R3. Header / Navbar Quick Switcher
Add a compact, accessible role switcher pill in the navigation header allowing the visitor to toggle roles at any point without scrolling.

### R4. Command Palette & Search Catalog Deep Linking
Ensure searching for MIS or Accountant items in the search catalog / Command Palette automatically switches the active role to the corresponding tab and scrolls to the selected item.

## Acceptance Criteria

### Functional & State Sync
- [ ] Switching role in any section or navbar updates all sections instantaneously without page reload.
- [ ] Page reload preserves the chosen role from `localStorage`.
- [ ] Opening with `?role=mis` sets the initial role to MIS & Analytics.
- [ ] No role content is lost; all 6 experiences, projects, and skills are categorized under their proper track.

### Accessibility & Interaction
- [ ] Tab buttons follow WAI-ARIA tablist/tab/tabpanel pattern with ArrowRight/ArrowLeft keyboard navigation.
- [ ] Tab switching plays existing tactile audio sound FX and applies smooth tab-fade transition.
- [ ] Build compiles cleanly (`npm run build`) without errors or broken links.


## Follow-up — 2026-10-17T15:58:09Z

This is a single self-contained feature; keep it small and focused.

Enhance the Tech Marquee banner in the portfolio with interactive rich hover tooltips and smart jump navigation to corresponding skills and projects.

Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio
Integrity mode: development

## Requirements

### R1. Rich Floating Tooltips on Marquee Items
Each technology/skill item in both top and bottom ribbons of the marquee must display a rich, upright glassmorphism tooltip on hover (counter-rotated to 0deg so it stays horizontal regardless of the ribbon's tilt angle).
- The tooltip must show:
  1. Item title/technology name.
  2. Experience / mastery metric (e.g. "Tally Prime — 7+ Years Experience").
  3. Domain / Category badge (e.g. Statutory Accounting & Tax, MIS Analytics, Government Operations).
  4. Subtle interaction hint ("Click to inspect skill →").
- When hovered, the marquee animation pauses smoothly and resumes on mouse leave.

### R2. Smart Contextual Click & Jump Navigation
Clicking any marquee item triggers smart navigation to the corresponding skill or project:
- If the target skill belongs to a different role tab (`accountant` vs `mis`), auto-switch the role tab via the existing `switch-role-tab` event.
- Activate the skill's detailed inspect card via the existing `select-skill` event.
- Smoothly scroll the page to center the target skill pill (or project card) in view.
- Apply a temporary 2.5-second glowing pulse ring animation (`ring-4 ring-[#FF4D6D] ring-offset-4 animate-pulse`) to highlight the target element.
- Map pure skills (Tally, GST, Income Tax, MS Excel, Windows OS, etc.) to `#skills` pills, and project-oriented items (`DAY-NULM Skill Mission`, `Smart Card Operations`) to their respective project cards in `#projects`.

### R3. Mobile & Touch Screen Two-Step Tap Support
On touch devices where hover is unavailable:
- The first tap on a marquee item displays the floating tooltip.
- A second tap (or tapping on the tooltip itself) triggers the smart jump navigation.
- Tapping outside dismisses any open tooltip.

## Acceptance Criteria

### Tooltip Functionality & Visual Polish
- [ ] Hovering over any item in the top or bottom ribbon reveals the styled tooltip without layout shift or ribbon distortion.
- [ ] Tooltip remains horizontal (0deg) and readable regardless of ribbon rotation angle (-3.5deg or +2.8deg).
- [ ] Tooltip is styled with dark glassmorphism (`bg-slate-900/95 backdrop-blur-md border border-[#FF4D6D]/40 shadow-2xl rounded-xl`) with a directional pointer arrow.

### Navigation & Tab Synchronization
- [ ] Clicking a marquee item whose skill is under the MIS track automatically switches the role tab to MIS if currently on Accountant, and vice versa.
- [ ] Target skill is activated in the inspect card and visually highlighted with a 2.5-second pulse ring.
- [ ] Page scrolls smoothly to the target element.
- [ ] Project items (`DAY-NULM Skill Mission`, `Smart Card Operations`) correctly scroll to and highlight their respective project cards.

### Code Quality & Build Verification
- [ ] Project builds cleanly without errors (`npm run build`).
- [ ] No regression in marquee infinite scrolling animation or cursor tracking banner aesthetics.
- [ ] Mobile touch tap interaction functions as two-step tap without breaking marquee scroll.


## Follow-up — 2026-10-17T18:44:05Z

Upgrade and modernize the 'Lab' section of the Interactive Cursor-Tracking Portfolio into a hybrid experimentation and customization studio with an interactive physics testing sandbox, comprehensive cursor/physics/audio tuning controls, and 1-click presets.

Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio
Integrity mode: development

## Requirements

### R1. Hybrid Lab Access & Quick Studio Drawer
Provide dual-surface access to the Lab:
- Modernize the in-page `#playground` / `#lab` section with a glassmorphism lab studio layout.
- Implement a persistent floating action button (FAB with flask icon) that slides out a compact, non-intrusive Quick Lab Drawer from the right edge, allowing users to tweak parameters and observe live cursor/physics changes on any page section without scrolling.
- Connect Navbar explore links and Command Palette (`Cmd+K`) directly to the Lab surfaces.

### R2. Interactive Physics Sandbox & Live Telemetry
Embed a dedicated 2D physics sandbox arena inside the Lab:
- Features 5-8 elastic physics orbs that react dynamically to gravity, velocity damping, and direct cursor collisions/pushes.
- Real-time Telemetry HUD displaying live cursor velocity (Speedometer in px/s), pointer coordinates $(X, Y)$, and render frame rate (FPS monitor).
- Interactive "Particle Burst" test trigger button and Zero-G / Anti-Gravity toggle demonstrating live orb floating behavior.

### R3. Comprehensive Customization Controls Suite
- **Cursor Tuning:** Global cursor scale multiplier (0.5x to 2.0x) affecting Butterfly and all 35 modular kinematic cursor styles, plus Butterfly flight lerp speed and wing-flap dynamics.
- **Physics & Gravity:** Gravity slider ($-60\text{ px/s}^2$ Anti-G to $+140\text{ px/s}^2$ Heavy Earth), particle stardust trail toggle, and dynamic particle color palette customizer (presets + hex input).
- **Web Audio Synthesizer:** Master volume slider ($0\% - 100\%$), pitch multiplier ($0.5\times - 2.0\times$), audio toggle, and an interactive 7-sound synthesizer soundboard (Polaroid Shutter, Cosmic Sparkle, Bubble Pop, Laser Focus, Crystal Chime, Ribbon Sweep, Haptic Click) for instant acoustic testing.

### R4. Curated 1-Click Presets & State Persistence
- Provide 1-click instant recipe buttons (*Cyberpunk Zero-G*, *Retro Arcade*, *Zen Minimalist*, *Hyper Velocity*).
- Auto-persist all user customizations in `localStorage` under `portfolio_lab_config` with live state synchronization between the in-page section, floating drawer, and global runtime.
- Provide a clear "Reset to Factory Defaults" action to instantly restore default physics and audio parameters.

## Acceptance Criteria

### Functionality & Interactivity
- [ ] Clicking the floating Lab button opens the slide-out Studio Drawer smoothly without layout shifts.
- [ ] Adjusting the cursor scale slider visibly resizes the active cursor in real-time.
- [ ] Moving the pointer inside the Sandbox accurately updates the px/s speedometer and deflects physics orbs.
- [ ] Clicking any of the 7 soundboard buttons plays the synthesized Web Audio tone with the active pitch and volume applied.
- [ ] Clicking a 1-click preset immediately applies its bundled cursor, gravity, color, and audio settings.
- [ ] Refreshing the browser preserves the customized lab settings.
- [ ] Clicking "Reset Defaults" restores original scale, gravity, color, and audio values.

### Code Quality & Build Verification
- [ ] Code passes static analysis without syntax errors (`npx oxlint`).
- [ ] Project builds cleanly with zero errors (`npm run build`).


## 2026-10-17T21:04:04Z

This is a single self-contained fix; keep it small and focused.

Add an 'Overview' role track and synthesize an AI-derived 'Other ✨ AI' role track into the interactive cursor-tracking portfolio, establishing a 4-tab role navigation hierarchy with Accountant as default.

Working directory: c:/Users/Atul Verma/Desktop/AI Document/Interactive Cursor-Tracking Portfolio
Integrity mode: development
Requested team: small focused team

## Requirements

### R1. Four-Tab Role Hierarchy & Navigation
Establish a fixed role track sequence: `Overview`, `Accountant`, `MIS`, and `Other ✨ AI`.
- The `Overview` button must permanently occupy the first position in all role selection bars, ribbons, drawers, and command palettes.
- The default initial active role upon first visit must remain `Accountant` (`DEFAULT_ROLE = 'accountant'`).
- Support bidirectional URL query parameter synchronization (`?role=overview`, `?role=accountant`, `?role=mis`, `?role=other`), local storage persistence, sound effects, and keyboard navigation across all 4 roles.

### R2. 'Overview' Executive Highlights & Summary Track
Implement the `Overview` track (`LayoutDashboard` icon, Indigo `#6366F1` accent) aggregating and curating top highlights exclusively from the two verified tracks (`Accountant` and `MIS`).
- Exclude 'Other' entirely from Overview synthesis.
- Curate and display flagship experiences and projects tagged with their respective track badges (`Financial Track` vs `Data & Operations Track`).
- Hero copy: Title "Financial & Operations Executive.", Subtitle "Bridging Statutory Accounting, Taxation & Advanced Data Intelligence.".
- Resume action triggers the master comprehensive resume (`Atul_Verma_Overview_Resume.pdf` / `resume.pdf`).

### R3. 'Other ✨ AI' Synthesized Distinct Role Track
Define and implement the `Other ✨ AI` track as an emergent distinct specialization: Business Intelligence & Corporate Controller (Statutory Financial Strategy & Executive Data Systems).
- Tab label must display `Other ✨ AI` with an AI sparkles indicator.
- Inside sections, display a prominent badge/banner: `🤖 AI-Synthesized Role (Derived from Verified Tracks)` informing visitors that this role was synthesized by AI from accounting + MIS competencies.
- Replace all demo/random data with authentic, mature experience items, projects, and skills covering corporate financial controls, ERP automation, Power BI fiscal dashboards, and statutory auditing.
- Resume action triggers specialized controller resume (`Atul_Verma_BI_Corporate_Controller_Resume.pdf`).

## Verification Resources
- Project build script: `npm run build` (Vite production build)
- Project linter: `npm run lint` (Oxlint)

## Acceptance Criteria

### Navigation & State
- [ ] Tab order is strictly `Overview`, `Accountant`, `MIS`, `Other ✨ AI`.
- [ ] Initial page load without query params defaults to `Accountant`.
- [ ] Selecting each tab smoothly updates the active role state, URL parameter (`?role=...`), and UI components without runtime errors.

### Content & Data Segregation
- [ ] `Overview` displays curated flagship highlights exclusively from `Accountant` and `MIS`, with clear visual track badges.
- [ ] `Other ✨ AI` displays the complete 'Business Intelligence & Corporate Controller' profile with zero generic demo strings and a visible AI disclaimer banner.
- [ ] `npm run lint` and `npm run build` complete with zero errors.


## 2026-10-17T23:46:23Z

Transform the 'Lab' section of the Interactive Cursor-Tracking Portfolio into a clean, theme-matched (Obsidian Dark / Linen Light) all-rounder Portfolio Control Center with a structured 4-tab settings layout. Completely remove irrelevant toy/physics sandbox features (2D bouncing balls, Px/s speedometer, particle burst, arcade presets) and provide real, practical portfolio controls with localStorage persistence.

Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio
Integrity mode: development

## Requirements

### R1. Elimination of Irrelevant Toy/Experimental Physics Features
- Remove the 2D elastic orbs physics simulation canvas (`PhysicsSandbox.jsx`), collision bouncing balls, and gravity trampoline toy mechanics.
- Remove the Px/s cursor speedometer and telemetry HUD widget.
- Remove the Particle Burst trigger button and flashy gaming presets (Cyberpunk Zero-G, Arcade, Zen, Hyper).
- Clean up any unused files and imports cleanly.

### R2. 4-Tab Portfolio Control Center Architecture (In-Page & Floating Drawer)
Both the in-page `#playground` / `#lab` section and the slide-out `LabStudioDrawer.jsx` must present an identical, theme-matched (Obsidian Dark / Linen Light) 4-tab Control Center:
1. **🔊 Audio Studio:**
   - Master sound toggle (On/Off).
   - Master volume slider (0% to 100%).
   - Pitch multiplier slider (0.5x to 2.0x — Deep Bass to Sharp Treble).
   - Sound Matching Mode toggle: Dynamic cursor-sound matching (butterfly=sparkle, laser=focus, camera=shutter, etc.) vs. Universal Voice (consistent subtle chime for all interactions).
   - 7 acoustic preview buttons.
2. **✨ Cursor & Dynamics:**
   - Custom interactive cursor toggle (On/Off — fallback to native system pointer).
   - Cursor scale multiplier (0.5x to 2.0x) applied globally.
   - Flight lerp speed (Dreamy / Natural / Snappy).
   - Stardust particle trail toggle and theme color swatches.
3. **👤 Hero & Character Control:**
   - Character gaze tracking mode: Auto Gaze Follow vs. Static Fixed.
   - 10 3D head pose override selector buttons.
   - Character zoom/scale slider (0.5x to 2.0x).
   - Polaroid camera flash and confetti toggle (On/Off).
4. **⚙️ Startup & Preferences:**
   - Default startup role track selection (Accountant / MIS Executive / Controller).
   - Default cursor state on startup (Enabled/Disabled).
   - Default audio state on startup (Enabled/Disabled).
   - Reduced motion accessibility toggle.
   - 1-Click "Reset to Factory Defaults" button.

### R3. Reactive State Persistence & Wiring
- Centralize all Control Center parameters in `LabContext.jsx` with atomic persistence in `localStorage` (`portfolio_control_center`).
- Wire `DynamicCursorManager.jsx`, `HeroSection.jsx`, and `src/utils/audio.js` directly to these reactive parameters so tweaking any control immediately updates the live portfolio.

## Acceptance Criteria

### Functionality & Experience
- [ ] The irrelevant physics sandbox canvas (bouncing balls, speedometer, burst) is completely removed from both in-page Lab and the drawer.
- [ ] Both in-page `#playground` and the floating drawer render a consistent, elegant 4-tab Control Center matching the portfolio theme.
- [ ] Toggling "Custom Cursor" off reverts to the native browser pointer cleanly; toggling on restores the selected custom cursor.
- [ ] Audio volume, pitch (bass/treble), and dynamic sound-matching vs universal voice work cleanly.
- [ ] Hero character gaze tracking mode, zoom scale, and 10 pose overrides react in real-time from the Control Center.
- [ ] All settings persist across browser refresh in `localStorage`.
- [ ] 1-Click Reset restores default values.

### Code Quality & Build
- [ ] `npm run lint` (`oxlint`) passes with 0 errors.
- [ ] `npm run build` succeeds cleanly with 0 errors.


## 2026-10-18T02:52:47Z

This is a single self-contained feature; keep it small and focused. Implement the 'Quick Layout Density Tuner' inside Tab 5 ('Display & Visuals') of the Portfolio Control Center, allowing real-time switching between Compact (0.8x spacing), Comfortable (1.0x spacing, default), and Spacious (1.25x spacing) layouts with atomic localStorage persistence and CSS custom properties injection.

Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio
Integrity mode: development

## Requirements

### R1. State Management & Runtime CSS Injection
- Extend `portfolio_control_center.visuals` schema in `LabContext.jsx` with `layoutDensity: 'comfortable'`.
- Provide state and setters: `layoutDensity`, `setLayoutDensity`.
- Inject root CSS custom properties dynamically on `document.documentElement.style`:
  - `--density-spacing-mult`: `0.82` (compact), `1.0` (comfortable), `1.25` (spacious).
  - `--density-card-padding`: `0.88` (compact), `1.0` (comfortable), `1.15` (spacious).
  - `--density-gap-mult`: `0.85` (compact), `1.0` (comfortable), `1.2` (spacious).
- Toggle density root class on `document.documentElement`: `density-compact` / `density-comfortable` / `density-spacious`.
- Guarantee atomic localStorage persistence under `portfolio_control_center` and include in `resetDefaults()`.

### R2. Tab 5 Control Card in ControlCenterPanel.jsx
- Add a new "Layout Density" card inside Tab 5 ("Display & Visuals") in `ControlCenterPanel.jsx`.
- Present 3 selectable option tiles:
  - **Compact** (0.8x spacing, higher information density)
  - **Comfortable** (1.0x spacing, balanced signature luxury)
  - **Spacious** (1.25x spacing, airy editorial showcase)
- Provide tactile sound feedback on selection via `soundFX.playLaserFocus()` with `soundFX.init()`.
- Ensure clean visual integration matching the Obsidian Dark / Linen Light design system across both the in-page workbench and floating drawer surfaces.

### R3. Quality Gates & Verification
- Verify that `npx oxlint src/` passes with 0 warnings and 0 errors.
- Verify that `npm run build` succeeds cleanly with exit code 0.
- Update project changes log following Universal Rule 6 (`changes_log/`).

## Acceptance Criteria

### Functionality & Experience
- [ ] Switching between Compact, Comfortable, and Spacious immediately changes layout density variables.
- [ ] Active density selection is visually highlighted with border, glow, and badge indicator.
- [ ] Refreshing the browser preserves the chosen density setting.
- [ ] Clicking "Reset Visuals to Default" restores Comfortable mode.
- [ ] Works identically in both in-page workbench and floating quick drawer.

### Code Quality & Build
- [ ] `npx oxlint src/` passes with 0 warnings and 0 errors.
- [ ] `npm run build` succeeds cleanly with 0 errors.


## 2026-10-18T03:20:45Z

This is a single self-contained fix; keep it small and focused.

Convert the dynamic profile avatar in the Navbar into the primary universal role-switcher trigger that toggles the floating horizontal role bar on click, while separating the brand name link and removing the old redundant standalone role-switcher button.

Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio
Integrity mode: development

## Requirements

### R1. Universal Avatar Role Switcher Trigger
Transform the Navbar profile avatar into an interactive toggle button. Clicking the avatar must toggle open/closed the horizontal floating role-switcher sub-bar (isRoleBarOpen), maintaining active track accent glow ring, hover zoom (scale-105), active role tooltip, and smooth visual feedback.

### R2. Clean Brand Link Separation
Ensure the "Atul Verma" text remains an accessible navigation link navigating to #hero (home), while the avatar independently acts as the role switcher toggle, preventing nested interactive tags and ensuring clean accessibility (aria-expanded, aria-label).

### R3. De-clutter Navigation Bar
Remove the old standalone career track single-icon trigger (<RoleTabsBar variant="navbar" ... />) from the navigation bar, streamlining the header while preserving all existing menus (Search, Explore, Sound, Mobile Menu).

## Acceptance Criteria

### Functionality & Interactivity
- [ ] Clicking the Navbar profile avatar toggles the horizontal floating role-switcher bar open and closed.
- [ ] Clicking any role tab inside the opened horizontal bar updates the active role and dynamically changes the avatar image, theme glow, and portfolio content.
- [ ] Clicking the "Atul Verma" brand text navigates to #hero without toggling the role bar.
- [ ] The old standalone <RoleTabsBar variant="navbar" /> button is completely removed from the Navbar.

### Accessibility & State Integrity
- [ ] The avatar button has appropriate accessibility attributes (aria-expanded, aria-label, type="button").
- [ ] Outside click and Escape key still dismiss the floating role-switcher bar.

### Verification & Build Guardrails
- [ ] All automated tests pass: npm test runs cleanly.
- [ ] npx oxlint src/ reports 0 errors and 0 warnings.
- [ ] npm run build succeeds cleanly with exit code 0.
- [ ] Project audit trail is updated in changes_log/ adhering to Rule 6 and Rule 8.


## 2026-10-18T05:40:13Z

Add a new primary profile track "Vibe Coding" (Vibe Coder) to the Interactive Cursor-Tracking Portfolio, positioned between "MIS & Analytics" and "Other ✨ AI", with complete auto-generated section data (About, Skills, Projects, Experience with 6 months duration, Tech Stack, Achievements) and full UI integration.

Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio
Integrity mode: development

## Requirements

### R1. Profile Definition & Routing (`RoleContext.jsx`)
- Register the new profile `vibe_coding` (label: "Vibe Coding", shortLabel: "Vibe Coder", mobileLabel: "Vibe") positioned immediately after `mis` and before `other`.
- Visual Theme: Emerald / Cyber Green (`#10B981`), `bgLight: 'bg-emerald-50'`, `borderLight: 'border-emerald-200'`, with icon `Terminal` / `Cpu`.
- Hero Title: "Vibe Coder & AI Software Engineer."
- Hero Subtitle: "Rapid Full-Stack Prototyping, Autonomous Coding & SaaS Engineering."
- Avatar: `${cleanBase}/assets/Profile_Pic/VibeCoder.jpg` (duplicated from `Others.jpg`).

### R2. Comprehensive Section Content Population
- Automatically populate rich, role-specific content across all portfolio sections:
  - **AboutSection**: AI-native builder mindset, rapid prototyping philosophy, and prompt-driven architecture.
  - **SkillsSection**: AI coding environments (Cursor, Windsurf, Claude Code, GitHub Copilot, v0.dev), Fullstack SaaS frameworks (Next.js, React, Tailwind CSS, Supabase, Node.js), LLM APIs, and Autonomous Debugging.
  - **ProjectsSection**: 3 realistic AI & SaaS projects:
    1. AI Prompt-to-Fullstack SaaS Generator
    2. Autonomous Multi-Agent Workflow Engine
    3. Real-Time AI Document & Code Synthesizer
  - **ExperienceSection**: 6 months practical experience entry:
    - Role: "Independent AI Builder / Freelance Vibe Coder"
    - Organization: "Self-Employed / Stealth SaaS Studio"
    - Focus: Rapid prototype deployment, end-to-end fullstack AI apps, prompt architecture, and automated dev loops.
  - **TechMarqueeBanner & CodingAchievementsSection**: Tailored tech tags (Cursor, Next.js, Claude, Tailwind, Supabase, v0) and productivity metrics (10x Shipping Velocity, 50+ Rapid Prototypes, 100% AI-Assisted Workflows).

### R3. System & Navigation Coherence
- Update `resumeConfig.js`, `searchCatalog.js`, `CommandPalette.jsx`, `ResumeDropdown.jsx`, and `Overview` summaries so the new role is fully integrated, searchable, and exportable.

## Acceptance Criteria

### Functionality & Aesthetics
- [ ] Vibe Coding tab appears in the role navigation bar between "MIS & Analytics" and "Other ✨ AI".
- [ ] Clicking the Vibe Coding tab updates the entire portfolio theme, hero text, about section, skills, projects, and 6-month experience cleanly without errors.
- [ ] Overview role incorporates Vibe Coding highlights seamlessly into the multi-track executive view.
- [ ] Production build (`npm run build`) compiles cleanly without lint or syntax errors.


## 2026-10-18T19:01:39Z

Refining the preloading cached offline map: completely remove the location pointer pin and popup tooltip, expand offline tile coverage to a wide 7x5 grid across zooms 12 & 13 matching Google Maps's screen-filling view without grey borders on screens up to 1920px, and enforce strict maxBounds locking.

Working directory: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio`
Integrity mode: development

## Requirements

### R1. Complete Removal of Pointer Pin & Popups
Completely remove the marker pin, pulsing radar dot, and popup tooltips from `src/components/LeafletOfflineMap.jsx` and `src/components/OfflineMapSnapshot.jsx`. The cached map view must present a clean, uninterrupted cartographic map overview with zero pinpoint indicators.

### R2. Wide Full-Area Tile Coverage Matching Google Maps
Expand the pre-cached raster tile coverage for Medininagar (Lat 24.0416, Lng 84.0700) using a wide 7x5 tile grid (7 tiles wide horizontally, 5 tiles high vertically) for zooms 12 and 13 (and retain supporting zoom 14/15 center tiles). This ensures that on ultra-wide desktop monitors (up to 1920px) and mobile devices alike, the offline map seamlessly covers the full visible canvas with no clipped edges or empty grey blocks.

### R3. Strict maxBounds Panning Lock
Configure Leaflet `maxBounds` and `maxBoundsViscosity: 1.0` locked precisely to the cached tile coordinates. When the user interacts with or drags the offline map, it smoothly resists and prevents panning beyond the cached geography, preventing any exposure of grey or missing tiles.

### R4. Automated Verification & Rule Compliance
Update download and verification test scripts (`download_osm_tiles.mjs`, `verify_offline_tiles.mjs`, `verify_leaflet_map.mjs`, `verify_map_hybrid_system.mjs`) to validate the expanded tile grid, pointer absence, and maxBounds configuration. Ensure `npm test`, `npm run lint`, and `npm run build` pass with zero errors, and log all changes in `changes_log/` following Rule 6.

## Acceptance Criteria

### Visual & Interactive Criteria
- [ ] No marker pin, pulsing dot, or popup is visible anywhere on the offline map.
- [ ] On desktop screens up to 1920px wide, the offline map renders completely filled from edge to edge with valid cartography tiles and zero blank/grey margins.
- [ ] Dragging/panning the map is constrained within the cached bounds (`maxBoundsViscosity: 1.0`), preventing the user from dragging out into unrendered areas.
- [ ] Live Google Maps iframe remains 100% untouched and functional.

### Quality & Engineering Criteria
- [ ] All downloaded tiles are verified (>5KB, valid PNG magic bytes, 256x256 decode).
- [ ] `node scripts/verify_offline_tiles.mjs` and `node scripts/verify_leaflet_map.mjs` exit code 0.
- [ ] `npm test` passes 100% of test suites.
- [ ] `npm run lint` (`oxlint`) reports 0 errors.
- [ ] `npm run build` completes production build with 0 errors.
- [ ] Rule 6 changes log recorded under a new change ID (`CHG-MAP-005`).


## 2026-10-19T22:12:04Z

Implement a comprehensive, production-grade WCAG 2.1 AA/AAA compliant Accessibility (A11y) overhaul for the Interactive Cursor-Tracking Portfolio. The system must guarantee 100% barrier-free access across all 4 pillars: full keyboard navigation with focus management, complete screen reader semantic coverage with dynamic live announcements, sensory-safe reduced-motion with automatic native OS cursor fallback, and an independent High-Contrast mode alongside the lightweight Simple Mode.

Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio
Integrity mode: development

## Requirements

### R1. Complete Keyboard Navigation & Focus Flow
- Full page navigability using standard keyboard navigation keys (Tab, Shift+Tab, Enter, Space, Escape, arrow keys).
- Prominent and distinct :focus-visible outline rings with contrast compliance across all themes.
- Accessible skip-to-content mechanism (#main-content) that bypasses header/navigation when activated.
- Robust focus trapping and restoration for all modal overlays, drawers, and popups (Command Palette, Lab Studio Drawer, Resume Dropdown, Lightbox).
- Logical, predictable tab indexing across all interactive elements (Role tabs, Cursor selector ribbon, Project cards, Contact inputs).

### R2. Screen Reader Semantics & ARIA Landmarks
- Semantic landmark architecture (<header>, <nav>, <main>, <section>, <footer>, <dialog>).
- Dynamic announcements using aria-live (polite/assertive) for state updates, tab switches, animated counters completion, form validation messages, and feedback toasts.
- Explicit accessible labeling (aria-label, aria-labelledby, aria-describedby) for all icon-only buttons, floating action buttons (FABs), badge triggers, and interactive widgets.
- Decorative canvas visualizers and background animations marked with aria-hidden="true".

### R3. Sensory-Safe Reduced Motion & Cursor Fallback
- Full adherence to the OS media query @media (prefers-reduced-motion: reduce).
- When Reduced Motion is active or toggled:
  - Custom cursor canvas and continuous requestAnimationFrame loops must cleanly shut down and fall back to the native OS cursor (cursor: auto).
  - Aggressive continuous motion (marquees, 3D card tilt physics, particle explosions) must gracefully freeze or convert to static, readable, accessible presentations.
  - Page transitions must gracefully default to simple opacity fades.

### R4. Independent High-Contrast Mode & Clean Simple Mode
- Implement an independent High-Contrast toggle in the Control Center panel (and accessible keyboard shortcut) separate from the lightweight Simple Mode.
- High-Contrast styling must meet WCAG AAA color contrast ratios (≥ 7:1 for normal text, ≥ 4.5:1 for UI components and large text), with solid crisp borders and zero translucent low-contrast glassmorphism.
- Seamless co-existence with existing Dark, Light, and Simple Mode states.

### R5. Automated Accessibility Test Suite & Verification Script
- Provide an automated test verification script (e.g. scripts/verify_accessibility.mjs) that audits the DOM, component attributes, ARIA roles, contrast ratios, and keyboard event handlers.
- Ensure the full test suite runs cleanly via npm test and npm run build with 0 regressions.

## Acceptance Criteria

### Automated Verification
- [ ] Running npm run build completes successfully with zero compile or type errors.
- [ ] Running npm run lint passes without any lint errors.
- [ ] An automated verification script (scripts/verify_accessibility.mjs) executes and reports 0 accessibility violations across all pages and interactive components.

### Keyboard & Focus Criteria
- [ ] Navigating strictly via keyboard from page load reaches the skip-link first; pressing Enter moves focus immediately to #main-content.
- [ ] Every button, link, tab, and input element has a visible, high-contrast focus indicator when navigated via Tab.
- [ ] When the Command Palette or Lab Studio Drawer is opened via keyboard, focus is trapped inside the overlay; pressing Escape closes the overlay and restores focus to the invoking trigger.

### Screen Reader & ARIA Criteria
- [ ] All icon buttons (e.g. Floating Action Buttons, theme toggles, modal close buttons) have non-empty, localized or clear descriptive aria-labels.
- [ ] Custom interactive controls (e.g. Role tabs, custom accordions) utilize appropriate ARIA roles (role="tablist", role="tab", aria-selected, aria-controls).
- [ ] Canvas elements and decorative particle backgrounds have aria-hidden="true".

### Reduced Motion & Cursor Criteria
- [ ] In an environment with prefers-reduced-motion: reduce, the custom cursor canvas is hidden/stopped, the mouse pointer displays the system cursor, and animated marquees halt or remain static and fully readable.

### High-Contrast Criteria
- [ ] Toggling High-Contrast mode instantly switches the document into high-contrast mode with WCAG AAA color contrast, without breaking existing Simple Mode layout or standard Dark/Light themes.


## 2026-10-19T22:44:23Z

This is a single self-contained feature; keep it small and focused. Implement a hybrid "Proof-First Social Proof & Testimonials" module for the Interactive Cursor-Tracking Portfolio with active quantifiable impact metrics and a toggle-controlled testimonial system.

Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio
Integrity mode: development

## Requirements

### R1. Key Achievements & Impact Metrics (Active by default)
Display an interactive, visually compelling impact section showcasing quantifiable engineering metrics (such as latency reduction, full-stack features delivered, system uptime, and responsive standards) with cursor-tracking and hover reactive effects.

### R2. Dynamic Smart-Toggle Testimonials
Provide a fully designed testimonials sub-module (cards or carousel with reviewer name, role, quote, and social link) integrated with a central data configuration file. When `showTestimonials: false`, the section seamlessly displays only the Impact Metrics without any empty placeholders or broken layouts; when `true`, the testimonials reveal smoothly alongside or below the metrics.

## Acceptance Criteria

### Social Proof Verification
- [ ] Impact Metrics render dynamically from the configuration data without hardcoded values.
- [ ] Setting `showTestimonials: false` completely suppresses the testimonials component with zero visual awkwardness or empty space.
- [ ] Setting `showTestimonials: true` dynamically renders the testimonials cards/carousel with smooth entrance animation and interactive cursor reactivity.
- [ ] Cursor-tracking, hover states, and responsive layout behave cleanly across desktop and mobile screen viewports.


## 2026-10-20T21:51:13Z

Implement production-ready P1 Case Studies for all 9 projects in the Interactive Cursor-Tracking Portfolio using an accessible Slide-Over Drawer with 5-stage storytelling, live telemetry simulations, visual architecture diagrams, and metric highlights.

Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio
Integrity mode: development

## Requirements

### R1. Case Study Slide-over Drawer & Trigger Integration
- Clicking any project's case study trigger in `ProjectsSection.jsx` smoothly opens a dedicated Slide-over Drawer from the right side of the screen.
- Keeps the portfolio anchored in the background while displaying the in-depth digital dossier.
- Includes complete accessibility controls: keyboard focus trapping, `Escape` key dismissal, ARIA labels & live announcements, background scroll-locking, and toggleable subtle sound FX with mute support.

### R2. Comprehensive 5-Stage Storytelling for All 9 Projects
- Provide authentic, production-grade case study data for all 9 projects across all tracks (Accountant & Tax, MIS & Analytics, Corporate Controller, Vibe Coding).
- Each case study strictly follows the 5-stage storytelling structure:
  1. The Challenge (Enterprise context & regulatory / operational pain points)
  2. The Solution (Architecture & strategic engineering approach)
  3. Tech Stack & Obstacles (Overcoming technical latency, schema, or compliance hurdles)
  4. Measurable Results & Metrics (Before vs. After data, financial savings, reconciliation accuracy)
  5. Key Lessons Learned (Durable principles & governance takeaways)

### R3. Interactive Simulator, Architecture Blueprint & Evidence
- Inside each drawer:
  - Embed an interactive live simulation widget (e.g. 180ms reconciliation runner, prompt synthesis visualizer) with tactile feedback.
  - Render clear visual system architecture flowcharts for each project.
  - Provide verified metric badges, artifact excerpts, and live links / GitHub repository references.
- Supports both Light & Dark themes, High-Contrast mode, and Simple Mode without UI clipping or horizontal overflow.

## Acceptance Criteria

### Functionality & Experience
- [ ] Clicking any of the 9 projects opens the corresponding Case Study drawer smoothly without full-page navigation.
- [ ] Pressing `Escape` or clicking the overlay/close button immediately closes the drawer and restores scroll position.
- [ ] Keyboard navigation (`Tab`, `Shift+Tab`) is trapped inside the open drawer, and focus returns to the triggering card upon closing.
- [ ] All 9 projects feature non-placeholder, comprehensive 5-stage content, metrics, tech tags, and visual flowcharts.
- [ ] The interactive simulation in each drawer runs smoothly, updates telemetry, and announces status to screen readers.
- [ ] Production build succeeds cleanly (`npm run build`) with zero linting, TypeScript, or syntax errors.

## Verification
- Programmatic build verification via `npm run build`.
- Automated sanity test verifying all 9 project case study records are loaded and render without crashing or runtime console errors.
