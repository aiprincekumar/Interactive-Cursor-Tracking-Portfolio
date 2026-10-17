# Reviewer Round 2 Dispatch

## Working Directory
`c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\reviewer_r2`

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

<prior_attempt>
# Reviewer Round 1 Handoff Report

> [!WARNING] **Skepticism Disclaimer**
> I am confident that the code compiles cleanly, passes 21 automated regression and structural tests, and correctly implements tooltip counter-rotation, two-step touch interaction, tab synchronization, and retry-resilient scroll-and-pulse navigation, but physical touch gestures on actual hardware mobile devices and visual popover aesthetics during rapid window resizing remain verified via simulated DOM environments rather than physical human testing.

## 1. What I changed
- `src/components/TechMarqueeBanner.jsx`:
  - Hardened `scrollAndHighlight` with an 8-attempt retry mechanism (60ms intervals, up to 480ms buffer) to guarantee that when role tabs switch (e.g. from Accountant to MIS track or vice-versa), slow-rendering tabpanels on low-power devices never drop the scroll and pulse highlight action.
  - Hardened outside-pointerdown dismissal to guard against null references (`!activeEl || !activeEl.contains(e.target)`).
  - Added an `Escape` key event listener so pressing Escape instantly dismisses any active tooltip across desktop, mobile, and keyboard navigation.
  - Guarded `handleMouseLeave` with an identity check (`(current) => (itemKey ? (current === itemKey ? null : current) : null)`) preventing rapid cursor transitions across adjacent ribbon pills from inadvertently clearing newly activated tooltips.
  - Added keyboard accessibility handlers (`onFocus` and `onBlur`) on all ribbon items so keyboard Tab navigation reveals the rich tooltips and pauses the marquee, allowing keyboard-only users full interaction parity.
- `scripts/verify_marquee.mjs`:
  - Added 3 new deep automated verification assertions testing Escape key dismissal, retry resilience in `scrollAndHighlight`, and keyboard `onFocus`/`onBlur` handlers, bringing the test suite to 21 automated checks.

## 2. Why
- Addressed latent robustness risks identified during adversarial review:
  - In slower mobile environments or under device throttle, React's tabpanel unmount/mount cycle could exceed 180ms when switching between Accountant and MIS tracks; the retry loop prevents dropped navigation targets.
  - Full keyboard accessibility (WCAG 2.1 compliance) requires both Escape dismissal and focus/blur tooltip triggers on interactive marquee elements.
  - Rapid mouse transitions across crossed ribbons could cause race conditions in un-keyed leave handlers.

## 3. Verification Record
- **Deep Verification (ran actual tests):**
  - Ran `npm test` (`node scripts/verify_marquee.mjs`): All 21 automated checks passed with 0 failures.
  - Ran `npm run lint` (`oxlint`): Clean pass with 0 errors and 0 warnings across 64 files.
  - Ran `npm run build` (`vite build`): Clean production build in 688ms with 0 errors.
- **Shallow Verification (manual run only):**
  - Verified math on counter-rotations (-3.5deg top ribbon with +3.5deg tooltip, +2.8deg bottom ribbon with -2.8deg tooltip = 0.0deg horizontal).
  - Eyeballed mapping of all 19 unique skills/technologies and 2 featured project items (`DAY-NULM Skill Mission` -> `proj-day-nulm`, `Smart Card Operations` -> `proj-smart-card`) to verify DOM target IDs.
- **Unverified aspects:**
  - Physical multi-touch finger gestures on real iOS Safari and Android Chrome hardware were verified via synthetic event simulations, not on physical touch screens.
  - Visual rendering of dark glassmorphism blur filters on legacy GPU drivers or browsers with `backdrop-filter` disabled.

## 4. Known Issues
- `Shallow Verification`: Tooltip appearance on extreme ultra-wide displays (>2560px) relies on the 12x sequence repetition and parent container padding; not tested on physical 4K display.
- `Minor Robustness Risk`: On devices where user has disabled smooth scrolling in OS preferences (`prefers-reduced-motion: reduce`), `scrollIntoView({ behavior: 'smooth' })` will jump instantly rather than smoothly glide, though this is expected accessibility behavior.

## 5. Untested Edge Cases & Next Step
- Edge Case: Rapidly pressing Tab through 20+ ribbon items within 500ms while screen-reader is active.
- Next Step: Orchestrator / Sentinel can proceed to merge or final review verification.
</prior_attempt>

<additional_context>
Open Issues Ledger:
- Physical multi-touch finger gestures on real iOS Safari and Android Chrome hardware were verified via synthetic event simulations, not on physical touch screens.
- Visual aesthetics of the tooltip popover during extreme browser window resizing while marquee is actively animating.
- Tooltip appearance on extreme ultra-wide screens (>2560px) relies on the 12x sequence repetition and parent container padding; not tested on physical 4K display.
- Rapid alternating taps across top and bottom ribbons on a touch screen within less than 100ms.
- Visual rendering of dark glassmorphism blur filters on legacy GPU drivers or browsers with backdrop-filter disabled.
- Rapidly pressing Tab through 20+ ribbon items within 500ms while screen-reader is active.
</additional_context>
