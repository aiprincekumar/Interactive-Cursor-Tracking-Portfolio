# SCOPE: Production-Grade WCAG 2.1 AA/AAA Accessibility Overhaul

## Architecture Overview
This overhaul transforms the Interactive Cursor-Tracking Portfolio into a fully barrier-free, WCAG 2.1 AA/AAA compliant web application across 4 functional pillars and an automated verification test suite:
- **Pillar 1: Keyboard Navigation & Focus Flow** — Skip-to-content anchor, universal `:focus-visible` rings, robust focus trapping/restoration in all 5 modals/drawers, roving tabIndex, elimination of 290+ marquee tab traps.
- **Pillar 2: Screen Reader Semantics & ARIA Live Announcements** — Landmark architecture with labeled sections, centralized live announcer service (`AriaLiveAnnouncer.jsx` + `useAnnounce`), comprehensive `aria-label` coverage on all interactive controls, and `aria-hidden="true"` on decorative canvases/backgrounds.
- **Pillar 3: Sensory-Safe Reduced Motion & Cursor Fallback** — Synchronization between OS `@media (prefers-reduced-motion: reduce)` and UI toggle (`html.reduced-motion`), custom cursor canvas shutdown via `cancelAnimationFrame` and `DynamicCursorManager` null return, fallback to native OS cursor, static accessible marquee shelf, opacity-only page transitions, and sensory-safe confetti gating.
- **Pillar 4: Independent High-Contrast Mode & Clean Simple Mode** — Orthogonal `HighContrastContext.jsx` with `Alt+H` shortcut, `src/styles/high-contrast.css` delivering WCAG AAA contrast ratios (≥ 7:1 for normal text, ≥ 4.5:1 for UI elements), 2px solid crisp borders, zero translucent glassmorphism (`backdrop-filter: none !important`), and seamless co-existence with Dark, Light, and Simple modes.
- **Pillar 5: Automated Verification Test Suite** — `scripts/verify_accessibility.mjs` verifying landmark architecture, ARIA attributes, contrast ratios, reduced motion/cursor fallback, and keyboard handlers; integrated into `package.json` `"test"` script.

---

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Skip-to-Content Link & `#main-content` | Accessible skip link as first interactive DOM node, targeting `<main id="main-content" tabIndex="-1">` with corrected DOM mounting order | M1 | Survey P1 |
| 2 | Universal `:focus-visible` Rings | High-contrast 2px outline with 2px offset in `src/index.css`, replacing hidden outlines across all components | M1 | Survey P1 |
| 3 | Reusable `useFocusTrap` Hook | Custom hook managing focus retention, Escape key dismissal, and focus restoration to invoking trigger | M1 | Survey P1 |
| 4 | Modal & Drawer Focus Trapping | Integrate `useFocusTrap` into CommandPalette, LabStudioDrawer, ResumeDropdown, CameraRollGallery lightbox, and mobile nav | M1 | Survey P1 |
| 5 | Keyboard Tabindex & Navigation Optimization | Roving tabIndex in CursorSelectorRibbon and ControlCenterPanel; fix Marquee 324 tab traps; make Experience cards keyboard-accessible; fix BackToTopButton hidden tab stop; fix InteractivePlayground nested buttons | M1 | Survey P1 |
| 6 | Section Landmark & Semantic Naming | Accessible names via `aria-labelledby` linking to heading IDs or `aria-label` across all 10 sections; `<section>` tag for marquee | M2 | Survey P2 |
| 7 | Dynamic ARIA Live Announcer System | `AriaLiveAnnouncer.jsx` with polite and assertive regions; hooks for role switching, tab switching, counter completion, form validation alerts, and system toggles | M2 | Survey P2 |
| 8 | Accessible Control Labels & Dialog Semantics | Comprehensive `aria-label` on ControlCenterPanel switches, color inputs, FABs, map controls; combobox/listbox semantics in CommandPalette | M2 | Survey P2 |
| 9 | Decorative Isolation (`aria-hidden="true"`) | Isolate dynamic cursor canvas, particle stardust, background ambient blobs, decorative icons, and studio backdrop image | M2 | Survey P2 |
| 10 | Sensory-Safe Reduced Motion & Cursor Fallback | Check `lab?.reducedMotion || prefersReducedMotion` in DynamicCursorManager, unmount canvas, cancel rAF, apply `.custom-cursor-disabled` (`cursor: auto`); static marquee shelf; opacity-only page transitions; confetti gating | M3 | Survey P3 |
| 11 | Independent High-Contrast Mode (WCAG AAA) | `HighContrastContext.jsx` with `Alt+H` shortcut, localStorage persistence, `src/styles/high-contrast.css` (≥ 7:1 text, ≥ 4.5:1 UI components, zero glassmorphism, 2px solid borders) | M3 | Survey P3 |
| 12 | High-Contrast UI Controls | High-contrast toggle switches in `ControlCenterPanel.jsx` (Tab 5 and Tab 4) and quick switcher | M3 | Survey P3 |
| 13 | Automated Verification Script (`scripts/verify_accessibility.mjs`) | Node.js verification script auditing DOM landmarks, ARIA attributes, contrast ratios, reduced motion, and keyboard handlers | M4 | Survey P5 |
| 14 | Project Verification & Rule 6 Changes Log | Update `package.json` test script, run lint and build, log full audit in `changes_log/` (Rule 6 & Rule 8) | M4 | Rule 6 / R5 |

---

## Milestones & Execution Plan
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Keyboard Navigation & Focus Flow | Skip link, universal focus rings, `useFocusTrap` hook, modal/drawer traps, tabindex cleanup (Marquee, Ribbon, Experience cards, Playground) | None | DONE |
| M2 | Screen Reader Semantics & ARIA Live | Landmarks, `AriaLiveAnnouncer.jsx` + `useAnnounce`, section labels, control labeling, decorative `aria-hidden` isolation | M1 | DONE |
| M3 | Sensory Safety, Reduced Motion & High Contrast | Dynamic cursor shutdown to native pointer, static marquee, `HighContrastContext.jsx`, `high-contrast.css`, ControlCenter toggles | M1, M2 | DONE |
| M4 | Automated Verification & Rule 6 Audit Trail | `scripts/verify_accessibility.mjs`, `package.json` test integration, full test suite pass, lint/build pass, `changes_log/` logging | M1, M2, M3 | DONE |

---

## Code Layout & File Boundaries
- **New Core Utilities & Contexts**:
  - `src/hooks/useFocusTrap.js` — Focus trapping, Tab cycling, Escape handling, and focus restoration
  - `src/components/AriaLiveAnnouncer.jsx` — Centralized ARIA live regions (polite & assertive)
  - `src/context/AnnouncerContext.jsx` (or hook `src/hooks/useAnnounce.js`) — Trigger functions for screen reader announcements
  - `src/context/HighContrastContext.jsx` — Independent High-Contrast mode state, localStorage, and `Alt+H` listener
  - `src/styles/high-contrast.css` — WCAG AAA High-Contrast styling (dark & light variants)
  - `scripts/verify_accessibility.mjs` — Automated verification test runner
- **Modified Core Files**:
  - `src/App.jsx` — Skip-to-content link, `<main id="main-content" tabIndex="-1">`, corrected DOM mounting sequence, provider wiring (`HighContrastProvider`, `AriaLiveAnnouncer`)
  - `src/index.css` — Universal `:focus-visible` styling, `@keyframes simpleFadeIn`, import `high-contrast.css`
  - `src/components/Navbar.jsx` — Focus visible, mobile nav dialog/nav semantics, focus trap
  - `src/components/CommandPalette.jsx` — Focus trap, trigger focus restoration, combobox ARIA roles, global Escape handling
  - `src/components/LabStudioDrawer.jsx` — Remove backdrop tabIndex, focus trap, trigger restoration, `aria-hidden` and `inert` when closed
  - `src/components/ResumeDropdown.jsx` — Initial menuitem focus, ArrowUp/ArrowDown roving focus, Enter/Space/Escape
  - `src/components/CameraRollGallery.jsx` — Lightbox focus trap and restoration, section heading ID
  - `src/components/TechMarqueeBanner.jsx` — Section landmark, duplicate items `tabIndex={-1}` and `aria-hidden="true"`, static presentation under reduced motion
  - `src/components/CursorSelectorRibbon.jsx` — Roving tabIndex, ArrowLeft/ArrowRight navigation
  - `src/components/ExperienceSection.jsx` — Card keyboard activation (`role="button" tabIndex={0}` and Enter/Space handler), section heading ID
  - `src/components/InteractivePlayground.jsx` — Fix nested interactive buttons, section heading ID
  - `src/components/ControlCenterPanel.jsx` — Tablist roving tabIndex and arrow keys, accessible names on switches/inputs, High-Contrast toggle
  - `src/components/DynamicCursorManager.jsx` — Check `lab?.reducedMotion || prefersReducedMotion`, cancel rAF, unmount, native cursor fallback
  - `src/context/LabContext.jsx` — Toggle `html.reduced-motion` class on root
  - `src/components/AnimatedCounter.jsx` — Static accessible label (`aria-label`) so screen readers consume final count without churn
  - `src/components/ContactSection.jsx` — Form alert `role="alert" aria-live="assertive"`, `aria-invalid`, `aria-describedby`, reduced-motion confetti check
  - Section components (`HeroSection.jsx`, `AboutSection.jsx`, `SkillsSection.jsx`, `CodingAchievementsSection.jsx`, `Footer.jsx`) — Section `aria-labelledby`, decorative `aria-hidden="true"`, accessible control labels
  - `package.json` — Add `node scripts/verify_accessibility.mjs` to `"test"` script
  - `changes_log/` — Rule 6 compliant entries (`CHG-A11Y-001`)
