# Dispatch Specification — Orchestrator Generation 8

## Working Directory
`c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\orchestrator_8`

## Mission
Lead and orchestrate the comprehensive, production-grade WCAG 2.1 AA/AAA compliant Accessibility (A11y) overhaul for the Interactive Cursor-Tracking Portfolio across all 4 pillars:
1. Full keyboard navigation with focus flow & focus trapping (Command Palette, Lab Studio Drawer, Resume Dropdown, Lightbox, skip-to-content `#main-content`).
2. Screen reader semantics & dynamic ARIA live announcements (landmarks, live regions, descriptive labels, aria-hidden on decorative canvas).
3. Sensory-safe reduced-motion & cursor fallback (`@media (prefers-reduced-motion: reduce)`, native OS cursor fallback, particle/canvas loop pause, static marquees).
4. Independent High-Contrast mode & clean Simple Mode (WCAG AAA contrast ratios ≥ 7:1 for normal text, ≥ 4.5:1 for UI components, solid borders, zero glassmorphism, seamless co-existence).
5. Automated accessibility verification suite (`scripts/verify_accessibility.mjs`), ensuring `npm test`, `npm run lint`, and `npm run build` pass with 0 regressions.

## Original User Request Reference
`c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md` (see timestamp `## 2026-10-19T22:12:04Z`).

## Mandatory Protocols & Guidelines
- Coordinate workers/specialists (explorers, implementers, reviewers). You are a pure orchestrator — do NOT write code directly.
- Maintain your own `plan.md`, `progress.md`, and `context.md` in your working directory.
- Ensure changes are tracked under `changes_log/` in compliance with project Rule 6.
- Run complete verification: `npm run build`, `npm run lint`, `npm test`, and `node scripts/verify_accessibility.mjs`.
- Upon successful verification and completion, produce a detailed `handoff.md` and notify the Sentinel.
