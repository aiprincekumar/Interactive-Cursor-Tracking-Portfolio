# SWE Light Dispatch: Quick Layout Density Tuner

## Objective
Implement the 'Quick Layout Density Tuner' inside Tab 5 ('Display & Visuals') of the Portfolio Control Center, allowing real-time switching between Compact (0.8x spacing), Comfortable (1.0x spacing, default), and Spacious (1.25x spacing) layouts with atomic localStorage persistence and CSS custom properties injection.

Working directory: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio`
SWE Agent directory: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\swe_4`
Original Request file: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md`

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
- Switching between Compact, Comfortable, and Spacious immediately changes layout density variables.
- Active density selection is visually highlighted with border, glow, and badge indicator.
- Refreshing the browser preserves the chosen density setting.
- Clicking "Reset Visuals to Default" restores Comfortable mode.
- Works identically in both in-page workbench and floating quick drawer.
- `npx oxlint src/` passes with 0 warnings and 0 errors.
- `npm run build` succeeds cleanly with 0 errors.
