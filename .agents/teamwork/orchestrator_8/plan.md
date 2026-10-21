# Master Plan: WCAG 2.1 AA/AAA Accessibility Overhaul (Orchestrator 8)

## Objectives
Execute an end-to-end accessibility overhaul across 4 core pillars plus automated verification test suite:
1. **Keyboard Navigation & Focus Flow**: Skip link (`#main-content`), distinct `:focus-visible` rings, focus trapping/restoration in Command Palette, Lab Studio Drawer, Resume Dropdown, Lightbox, logical tab indexing.
2. **Screen Reader Semantics & ARIA Live Announcements**: Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<dialog>`), live regions (`aria-live="polite"` / `"assertive"`), comprehensive accessible names, `aria-hidden="true"` on decorative canvases.
3. **Sensory-Safe Reduced Motion & Cursor Fallback**: Honor `@media (prefers-reduced-motion: reduce)` and manual setting; pause particle/cursor canvas rAF loops and fall back cleanly to native OS pointer (`cursor: auto`); halt or freeze marquees.
4. **Independent High-Contrast Mode & Clean Simple Mode**: WCAG AAA contrast (≥ 7:1 for normal text, ≥ 4.5:1 for UI elements), crisp solid borders, zero translucent glassmorphism, co-existing seamlessly with Dark/Light and Simple modes.
5. **Automated Verification Test Suite**: Comprehensive script `scripts/verify_accessibility.mjs` running via Node/Playwright/JSDOM auditing DOM, attributes, ARIA roles, contrast ratios, and keyboard handlers. Ensure `npm test`, `npm run lint`, and `npm run build` pass with 0 errors.

## Phase Breakdown
- **Phase 1: Exploration & Architecture Analysis (Parallel Spawns)**
  - Dispatch Explorer 1: Keyboard navigation, focus traps, focus-visible indicators, skip link, modal/drawer handlers.
  - Dispatch Explorer 2: Screen reader landmarks, ARIA live announcements, labels, decorative canvas isolation.
  - Dispatch Explorer 3: Reduced-motion mechanisms, custom cursor rAF pause & native cursor fallback, High-Contrast design/styles, and test verification suite harness.
- **Phase 2: Scope Synthesis & Feature Inventory**
  - Synthesize explorer findings into `SCOPE.md`.
  - Finalize component-by-component action checklist and file boundaries.
- **Phase 3: Implementation via Specialized Worker(s)**
  - Worker: Implement changes across CSS/Tailwind, Context providers, UI components, modals, and test scripts.
  - Maintain project audit log in `changes_log/` adhering to Rule 6.
- **Phase 4: Independent Multi-Agent Verification**
  - Reviewer 1 & Reviewer 2: Conformance, code review, linting, build integrity.
  - Challenger 1 & Challenger 2: Adversarial edge cases (focus trap break, escape restoration, contrast checks, prefers-reduced-motion toggling).
  - Forensic Integrity Auditor: Authenticity verification (no mocks, no hardcoded cheating, genuine implementation).
- **Phase 5: Gate Verdict & Handoff**
  - Evaluate Gate Status.
  - Complete `handoff.md` and report to Sentinel.
