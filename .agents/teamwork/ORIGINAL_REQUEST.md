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
