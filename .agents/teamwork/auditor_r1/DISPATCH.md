# Victory Auditor Dispatch

## Working Directory
`c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\auditor_r1`

## Parent Orchestrator
`teamwork_preview_swe_2` (Conversation ID: `8221fd4b-405b-42d4-a609-ec3847590231`)

<original_task>
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
</original_task>

## Instructions for Auditor
Conduct your 3-phase independent victory audit (timeline analysis, cheating/anti-pattern detection, independent test and build execution).
Write your audit report to `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\auditor_r1\audit_report.md` and report your structured verdict via `send_message` to parent orchestrator (Conversation ID: 8221fd4b-405b-42d4-a609-ec3847590231).
