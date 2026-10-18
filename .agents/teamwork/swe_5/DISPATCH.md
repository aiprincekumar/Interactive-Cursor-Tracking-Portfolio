# DISPATCH — SWE Light: Universal Avatar Role Switcher & Navbar De-clutter

## Task Specification
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

## Reference Documents
- Authoritative requests: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md


## 2026-10-18T04:29:11Z
Server restarted. Please resume execution of the SWE Light loop: complete Review Round 2, execute Review Round 3, conduct personal verification (npm test, npx oxlint src/, npm run build), and proceed until ready for independent Victory Audit. Send your completion report once all review rounds and quality gates pass cleanly.
