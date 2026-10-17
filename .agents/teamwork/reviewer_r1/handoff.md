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
