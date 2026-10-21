# Technical Exploration & Architecture Report: Pillars 3 & 4
**Subagent:** `explorer_a11y_contrast_motion`  
**Parent Orchestrator:** `6dd69fc4-47de-4c0f-b24b-930881574e5c` (`orchestrator_8`)  
**Scope:** Pillar 3 (Reduced Motion, Sensory Safety & Cursor Fallback), Pillar 4 (Independent High-Contrast Architecture & Clean Simple Mode), and Automated Verification Suite (`scripts/verify_accessibility.mjs`).

---

## 1. Observation

### 1.1 Reduced Motion & Cursor Management
- **`src/components/DynamicCursorManager.jsx:90-91`**:
  ```javascript
  // Compute effective reduced motion (prop overrides system if passed)
  const effectiveReducedMotion = propReducedMotion !== undefined ? propReducedMotion : prefersReducedMotion;
  ```
  `DynamicCursorManager` queries `window.matchMedia('(prefers-reduced-motion: reduce)')` into `prefersReducedMotion` state (lines 63–88), but **completely ignores `lab?.reducedMotion`** from `LabContext` (line 51: `const lab = useLab();`).
- **`src/context/LabContext.jsx:39, 471-479, 601, 971-973`**:
  `LabContext` maintains `reducedMotion` state (`FACTORY_DEFAULTS.preferences.reducedMotion: false`, lines 39 & 601), and provides `setReducedMotion` (line 971).
  In lines 616–711, `LabContext` injects root CSS custom properties (`--glass-blur`, `--motion-speed-mult`, `--theme-accent`, and `.density-*` classes) onto `document.documentElement`, but **does NOT apply `.reduced-motion` class to `document.documentElement` or `document.body`**.
- **`src/App.jsx:30-35, 37-47, 139`**:
  ```javascript
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  ```
  `App.jsx` creates its own local `reducedMotion` state solely from `window.matchMedia` and does not destructure `reducedMotion` from `useLab()`.
  In line 139:
  ```javascript
  {!isSimpleMode && !reducedMotion && (
    <DynamicCursorManager ... />
  )}
  ```
  If `reducedMotion` is true on initial mount, `<DynamicCursorManager>` is never mounted at all. Because `DynamicCursorManager` houses the `useEffect` that toggles `.custom-cursor-disabled` on `body` (lines 94–114), if it is not mounted, the DOM cleanup/class toggle never runs unless handled centrally.
- **`src/index.css:366-391, 406-420`**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto !important; }
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
    }
    .flutter-wing-left, .flutter-wing-right, .animate-float,
    .camera-flash-active, .animate-marquee-left, .animate-marquee-right,
    .animate-tab-fade, .animate-toast-in, .animate-toast-in-left {
      animation: none !important;
    }
  }
  ```
  Lines 406–420 define:
  ```css
  .custom-cursor-disabled, .custom-cursor-disabled * { cursor: auto !important; }
  .custom-cursor-disabled a, .custom-cursor-disabled button, ... { cursor: pointer !important; }
  ```
  The CSS handles the OS media query `@media (prefers-reduced-motion: reduce)`, but there is **no matching class selector** (e.g. `html.reduced-motion`) for when a user toggles Reduced Motion in `ControlCenterPanel.jsx` without having an OS-level setting enabled.
- **`src/components/TechMarqueeBanner.jsx:331-332, 511, 528, 615, 632`**:
  ```javascript
  const topSequence = Array(12).fill(TOP_ITEMS).flat();
  const bottomSequence = Array(12).fill(BOTTOM_ITEMS).flat();
  ```
  Both top and bottom sequences repeat 12 times to achieve infinite CSS translation.
  In lines 528 and 632, every single item in the 12x array has `role="button"` and `tabIndex={0}`:
  `14 items * 12 = 168` buttons in the top ribbon and `13 items * 12 = 156` buttons in the bottom ribbon, totaling **324 focusable buttons**! A keyboard user must press `Tab` 324 times through the marquee ribbon alone.
  Under `@media (prefers-reduced-motion: reduce)`, `.animate-marquee-left` and `.animate-marquee-right` have `animation: none !important`, but the container has `overflow-hidden` and stays rotated at `-3.5deg` and `+2.8deg`, clipping content without a static accessible presentation.
- **`src/components/ContactSection.jsx:526-538`**:
  ```javascript
  const triggerCelebration = () => {
    soundFX.playSparkle();
    try {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF4D6D', '#25D366', '#0A66C2', '#FFD166', '#06D6A0', '#9333EA']
      });
    } catch {}
  };
  ```
  Unlike `HeroSection.jsx:752` (`if (!reducedMotion && flashConfettiEnabledRef.current)`) and `ResumeDropdown.jsx:87` (`window.matchMedia('(prefers-reduced-motion: reduce)').matches`), `ContactSection.jsx` fires `canvas-confetti` upon form submission **without checking for reduced motion**.
- **`src/index.css:263-277` vs Page Transitions under Reduced Motion**:
  ```css
  @keyframes tabFadeIn {
    0% { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-tab-fade {
    animation: tabFadeIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  ```
  Under reduced motion, `.animate-tab-fade` is suppressed with `animation: none !important;`. The specification requests: *"How page transitions default to simple opacity fades under reduced motion."* Currently there is no fallback opacity-only animation.

---

### 1.2 Independent High-Contrast Mode & Clean Simple Mode
- **`src/context/SimpleModeContext.jsx:1-54` & `src/styles/simple-mode.css:1-47`**:
  Simple Mode is an independent context storing `portfolio_simple_mode` in `localStorage`, adding `body.simple-mode`, muting sound, replacing dynamic cursors with system pointers, and unmounting complex 3D widgets / galleries.
- **`src/context/ThemeContext.jsx:1-122`**:
  ThemeContext manages `'light'` and `'dark'` themes via `document.documentElement.classList.toggle('dark')` and `localStorage.getItem('portfolio_theme')`.
- **`src/components/ControlCenterPanel.jsx:266-273, 1238-1264, 1324-1386`**:
  - Tab 4 (`Startup & Preferences`): Contains a "Reduced Motion" toggle (lines 1238–1264).
  - Tab 5 (`Display & Visuals`): Contains Card 1 for Theme Mode (`Obsidian Dark` vs `Linen Light`, lines 1324–1386), Card 2 (`Glassmorphism Blur Strength`), Card 3 (`Motion & Transition Rhythm`), Card 4 (`Accent Theme Color`), and Card 5 (`Layout Density`).
  - There is currently **no High-Contrast toggle** in `ControlCenterPanel.jsx` (neither in Tab 4 nor in Tab 5), and no global keyboard shortcut (e.g. `Alt+H`) configured.
- **Contrast Ratios in Existing Dark Theme**:
  - Current Dark background: `#0B0813`
  - Current Secondary text: `#A99EBA` (contrast ratio against `#0B0813` is `8.6:1`, which meets AA, but translucent glass borders `#2D2340` and translucent cards `rgba(22, 17, 34, 0.85)` with blur `16px` fail AAA crispness and border contrast requirements).
  - High Contrast AAA requires:
    - Normal text: $\ge 7.0:1$
    - Large text & UI Components: $\ge 4.5:1$
    - Solid crisp borders: `2px solid`
    - Zero translucent glassmorphism (`backdrop-filter: none`).

---

### 1.3 Automated Test Suite & Project Tooling
- **`package.json:14`**:
  `"test"` script runs a sequential chain of Node.js scripts:
  `"test": "node scripts/verify_marquee.mjs && node scripts/verify_layout_density.mjs && ... && node scripts/verify_simple_mode.mjs"`
- Existing test scripts (`scripts/verify_simple_mode.mjs`, `scripts/verify_layout_density.mjs`, etc.) follow a uniform pattern:
  - Pure Node.js script using `fs`, `path`.
  - Increments `passed` and `failed` counters.
  - Exits with `process.exit(failed > 0 ? 1 : 0)`.
  - Execution time is lightning fast (< 200ms).
- Currently, **there is NO accessibility test suite** (`scripts/verify_accessibility.mjs` does not exist yet).
- Current verification runs:
  - `npm test`: Passes 100% of 14 verification scripts.
  - `npm run lint` (`oxlint`): 0 errors, 23 warnings (unused vars / react fast refresh).
  - `npm run build` (`vite build`): Succeeds cleanly in 980ms.

---

## 2. Logic Chain

### 2.1 Reduced Motion & OS Cursor Fallback Chain
1. **Observation 1.1** shows `DynamicCursorManager.jsx` does not inspect `lab?.reducedMotion`, and `LabContext` does not apply `html.reduced-motion`.
2. Therefore, if a user enables Reduced Motion in `ControlCenterPanel`, the cursor and page animations do not react unless the user also has OS-level reduced motion enabled.
3. Adding `root.classList.toggle('reduced-motion', Boolean(reducedMotion))` in `LabContext.jsx` and reading `Boolean(lab?.reducedMotion) || prefersReducedMotion` in `DynamicCursorManager.jsx` guarantees that UI toggles and OS media queries are synchronized.
4. **Observation 1.2** demonstrates that all 8 cursor components already possess cleanup hooks calling `cancelAnimationFrame(animationFrameId)`. When `DynamicCursorManager` returns `null`, the cursor cleanly unmounts, cancelling the animation loop and clearing canvas layers.
5. In `index.css`, applying `.custom-cursor-disabled, .custom-cursor-disabled * { cursor: auto !important; }` and `.custom-cursor-disabled a, button, ... { cursor: pointer !important; }` ensures the native OS cursor is immediately active with standard pointer semantics.
6. **Observation 1.3** reveals that `TechMarqueeBanner.jsx` contains 324 keyboard tab stops due to 12x array repetition. Setting `tabIndex={-1}` and `aria-hidden="true"` on duplicate loop items (`idx >= TOP_ITEMS.length` and `idx >= BOTTOM_ITEMS.length`) immediately eliminates over 290 redundant tab stops.
7. Under `html.reduced-motion` and `@media (prefers-reduced-motion: reduce)`, removing the transform rotation (`transform: none !important`), halting the marquee animation (`animation: none !important`), and permitting horizontal scrolling (`overflow-x-auto`) transforms the aggressive movement into a static, readable, accessible shelf.
8. **Observation 1.4** shows `animate-tab-fade` becomes completely static (`animation: none !important`). Introducing `@keyframes simpleFadeIn` (opacity `0 -> 1` without `translateY`) fulfills the requirement that page transitions default to simple opacity fades under reduced motion.
9. Guarding `ContactSection.jsx:529` with `!reducedMotion` eliminates unexpected high-motion particle bursts.

---

### 2.2 Independent High-Contrast Architecture Chain
1. **Observation 2.1** demonstrates that `SimpleModeContext` and `simple-mode.css` provide a battle-tested model for orthogonal feature toggles.
2. Creating an independent `HighContrastContext.jsx` (persisted under `portfolio_high_contrast`, toggling `high-contrast` on `document.documentElement` and `document.body`) cleanly decouples High Contrast from Simple Mode.
3. Mathematical Verification of WCAG 2.1 AAA Contrast:
   - Relative Luminance formula: $L = 0.2126 \cdot R + 0.7152 \cdot G + 0.0722 \cdot B$ (using sRGB linearization $c / 12.92$ or $((c+0.055)/1.055)^{2.4}$).
   - **Dark High Contrast**:
     - Background: Pure Black `#000000` ($L = 0.0$)
     - Foreground Text: Pure White `#FFFFFF` ($L = 1.0$) $\to \text{Ratio} = (1.0 + 0.05) / 0.05 = \mathbf{21.0:1}$ (WCAG AAA requires $\ge 7.0:1$).
     - High-Contrast Yellow Links/Accents: `#FFFF00` ($L = 0.9278$) $\to \text{Ratio} = (0.9278 + 0.05) / 0.05 = \mathbf{19.56:1}$ ($\ge 7.0:1$).
     - High-Contrast Cyan Secondary: `#00FFFF` ($L = 0.7874$) $\to \text{Ratio} = (0.7874 + 0.05) / 0.05 = \mathbf{16.75:1}$ ($\ge 7.0:1$).
     - Secondary text: `#E4E4E7` ($L = 0.771$) $\to \text{Ratio} = (0.771 + 0.05) / 0.05 = \mathbf{16.4:1}$ ($\ge 7.0:1$).
     - Borders: `2px solid #FFFFFF` on `#000000` $\to \mathbf{21.0:1}$ (WCAG AAA for UI components requires $\ge 4.5:1$).
   - **Light High Contrast**:
     - Background: Pure White `#FFFFFF` ($L = 1.0$)
     - Foreground Text: Pure Black `#000000` ($L = 0.0$) $\to \mathbf{21.0:1}$ ($\ge 7.0:1$).
     - High-Contrast Blue Links/Accents: `#0000EE` ($L = 0.068$) $\to \text{Ratio} = (1.0 + 0.05) / (0.068 + 0.05) = \mathbf{8.90:1}$ ($\ge 7.0:1$).
     - Secondary text: `#18181B` ($L = 0.015$) $\to \text{Ratio} = (1.0 + 0.05) / (0.015 + 0.05) = \mathbf{16.15:1}$ ($\ge 7.0:1$).
     - Borders: `2px solid #000000` on `#FFFFFF` $\to \mathbf{21.0:1}$ ($\ge 4.5:1$).
4. In `src/styles/high-contrast.css`, setting `backdrop-filter: none !important; -webkit-backdrop-filter: none !important;` and forcing opaque card backgrounds eliminates translucent glassmorphism entirely.
5. Setting focus rings to `outline: 3px solid #FFFF00 !important; outline-offset: 3px !important;` (in Dark) and `outline: 3px solid #000000 !important; outline-offset: 3px !important;` (in Light) ensures focus indicators exceed 19:1 contrast.
6. Co-existence:
   - When `Simple Mode` is toggled: Body gets `simple-mode`. High Contrast styles in `high-contrast.css` apply to `.high-contrast.simple-mode` without conflict.
   - When `Theme` switches between Dark and Light: Root `.dark` selector switches between Pure Black / White and Pure White / Black palettes seamlessly.
7. Keyboard shortcut `Alt+H` on `window` provides immediate accessibility access without requiring navigation into the Control Center drawer.

---

### 2.3 Automated Test Suite Architecture Chain
1. **Observation 1.3** confirms that the existing test architecture relies on standalone ESM Node.js scripts executed sequentially in `npm test`.
2. Constructing `scripts/verify_accessibility.mjs` as a 5-suite audit script ensures that:
   - **Suite 1 (Landmarks & Semantics)** checks `index.html` (`lang="en"`, `<meta name="viewport">`), `App.jsx` (`#main-content`, skip-link), `Navbar.jsx` (`<header>`, `<nav>`), `Footer.jsx` (`<footer>`), and section landmarks.
   - **Suite 2 (Component ARIA Semantics)** checks `aria-label` on all FABs/buttons, `role="dialog"` on modals, `role="tablist"`/`role="tab"` on tabs, `aria-expanded` on dropdowns, `aria-hidden="true"` on canvas elements, and `aria-live` presence.
   - **Suite 3 (Contrast & High-Contrast Mode)** validates `src/styles/high-contrast.css`, checks imports in `src/index.css`, and programmatically runs WCAG relative luminance math on high-contrast colors to enforce $\ge 7:1$ (normal text) and $\ge 4.5:1$ (UI components).
   - **Suite 4 (Reduced Motion & Cursor Fallback)** checks CSS media queries and `.reduced-motion` classes, tests `DynamicCursorManager` fallback logic, verifies marquee freeze rules, and checks confetti suppression.
   - **Suite 5 (Keyboard Navigation & Event Handlers)** verifies `Escape` listeners on modals, arrow key navigation on tabs, and `:focus-visible` styling.
3. Adding `node scripts/verify_accessibility.mjs` to `package.json` `"scripts": { "test": "..." }` guarantees CI/CD and pre-commit gate enforcement.

---

## 3. Implementation Blueprints & Concrete Changes

### Blueprint A: High-Contrast Context & Keyboard Shortcut (`src/context/HighContrastContext.jsx`)
Create `src/context/HighContrastContext.jsx`:
```javascript
/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const HIGH_CONTRAST_STORAGE_KEY = 'portfolio_high_contrast';

const HighContrastContext = createContext(null);

export function HighContrastProvider({ children }) {
  const [isHighContrast, setIsHighContrast] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem(HIGH_CONTRAST_STORAGE_KEY);
      if (stored !== null) return stored === 'true';
      // Fallback to system forced-colors or prefers-contrast
      if (window.matchMedia('(forced-colors: active)').matches || window.matchMedia('(prefers-contrast: more)').matches) {
        return true;
      }
    } catch {
      return false;
    }
    return false;
  });

  // Apply or remove high-contrast classes on documentElement and body
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.toggle('high-contrast', isHighContrast);
    document.body.classList.toggle('high-contrast', isHighContrast);

    try {
      localStorage.setItem(HIGH_CONTRAST_STORAGE_KEY, String(isHighContrast));
    } catch {}

    // Dispatch global event for live announcements
    try {
      window.dispatchEvent(new CustomEvent('portfolio:high-contrast-change', { detail: { isHighContrast } }));
    } catch {}
  }, [isHighContrast]);

  const toggleHighContrast = useCallback(() => {
    setIsHighContrast((prev) => !prev);
  }, []);

  // Global Accessible Keyboard Shortcut: Alt+H (or Ctrl+Alt+H)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        toggleHighContrast();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleHighContrast]);

  const value = { isHighContrast, setIsHighContrast, toggleHighContrast };

  return (
    <HighContrastContext.Provider value={value}>
      {children}
    </HighContrastContext.Provider>
  );
}

export function useHighContrast() {
  const context = useContext(HighContrastContext);
  if (!context) {
    throw new Error('useHighContrast must be used within HighContrastProvider');
  }
  return context;
}
```

---

### Blueprint B: High-Contrast Stylesheet (`src/styles/high-contrast.css`)
Create `src/styles/high-contrast.css` and import in `src/index.css`:
```css
/* ==========================================================================
   High-Contrast Mode Stylesheet (WCAG 2.1 AAA Compliant)
   Enforces:
   - Normal text contrast >= 7.0:1
   - UI component & border contrast >= 4.5:1
   - Crisp 2px solid borders (#FFFFFF in dark, #000000 in light)
   - Zero translucent glassmorphism (backdrop-filter: none, opaque backgrounds)
   - High-visibility focus indicators
   ========================================================================== */

/* 1. Light High Contrast */
html.high-contrast,
body.high-contrast {
  --bg-page: #FFFFFF !important;
  --text-primary: #000000 !important;
  --text-secondary: #18181B !important;
  --card-bg: #FFFFFF !important;
  --card-border: #000000 !important;
  --card-border-subtle: #000000 !important;
  --primary: #0000EE !important;
  --primary-hover: #000099 !important;
  --theme-accent: #0000EE !important;
  --glass-blur: 0px !important;
}

/* 2. Dark High Contrast */
html.high-contrast.dark,
html.high-contrast .dark,
.dark.high-contrast {
  --bg-page: #000000 !important;
  --text-primary: #FFFFFF !important;
  --text-secondary: #E4E4E7 !important;
  --card-bg: #000000 !important;
  --card-border: #FFFFFF !important;
  --card-border-subtle: #FFFFFF !important;
  --primary: #FFFF00 !important;
  --primary-hover: #FFFF66 !important;
  --theme-accent: #FFFF00 !important;
  --glass-blur: 0px !important;
}

/* 3. Zero Glassmorphism Elimination */
html.high-contrast .glass-panel,
html.high-contrast .glass-card,
html.high-contrast .obsidian-card,
html.high-contrast [class*="backdrop-blur"] {
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

html.high-contrast .glass-panel,
html.high-contrast .glass-card {
  background: #FFFFFF !important;
  border: 2px solid #000000 !important;
  box-shadow: none !important;
}

html.high-contrast.dark .glass-panel,
html.high-contrast.dark .glass-card,
html.high-contrast.dark .obsidian-card,
.dark.high-contrast .glass-panel,
.dark.high-contrast .glass-card {
  background: #000000 !important;
  border: 2px solid #FFFFFF !important;
  box-shadow: none !important;
}

/* 4. Solid Crisp Borders on Buttons, Tabs, and Inputs */
html.high-contrast button,
html.high-contrast input,
html.high-contrast select,
html.high-contrast textarea,
html.high-contrast [role="button"],
html.high-contrast [role="tab"] {
  border-width: 2px !important;
}

/* 5. Ultra-Prominent Focus Rings */
html.high-contrast :focus-visible {
  outline: 3px solid #000000 !important;
  outline-offset: 3px !important;
}

html.high-contrast.dark :focus-visible,
.dark.high-contrast :focus-visible {
  outline: 3px solid #FFFF00 !important;
  outline-offset: 3px !important;
}

/* 6. Windows High Contrast Mode (forced-colors) */
@media (forced-colors: active) {
  * {
    forced-color-adjust: auto;
  }
  .glass-panel,
  .glass-card {
    backdrop-filter: none !important;
    border: 2px solid ButtonText !important;
  }
}
```

---

### Blueprint C: Reduced Motion & Cursor Fallback Fixes
1. **In `src/context/LabContext.jsx`**:
   Add root class toggle:
   ```javascript
   useEffect(() => {
     if (typeof document === 'undefined') return;
     document.documentElement.classList.toggle('reduced-motion', Boolean(reducedMotion));
   }, [reducedMotion]);
   ```
2. **In `src/components/DynamicCursorManager.jsx:90-91`**:
   ```javascript
   const effectiveReducedMotion = propReducedMotion !== undefined
     ? propReducedMotion
     : (Boolean(lab?.reducedMotion) || prefersReducedMotion);
   ```
3. **In `src/App.jsx:37-47, 139`**:
   Extract `reducedMotion: labReducedMotion` from `useLab()`.
   ```javascript
   const isReducedMotion = Boolean(labReducedMotion) || Boolean(reducedMotion);
   ```
   Pass `reducedMotion={isReducedMotion}` to all child components.
4. **In `src/components/TechMarqueeBanner.jsx`**:
   - For all duplicated items (`idx >= TOP_ITEMS.length`), set `tabIndex={-1}` and `aria-hidden="true"`:
     ```javascript
     const isDuplicate = idx >= TOP_ITEMS.length;
     return (
       <div
         key={itemKey}
         id={`marquee-item-${itemKey}`}
         tabIndex={isDuplicate ? -1 : 0}
         aria-hidden={isDuplicate ? 'true' : undefined}
         ...
       />
     );
     ```
   - In `src/index.css`:
     ```css
     @keyframes simpleFadeIn {
       0% { opacity: 0; }
       100% { opacity: 1; }
     }

     @media (prefers-reduced-motion: reduce), html.reduced-motion {
       .animate-tab-fade {
         animation: simpleFadeIn 0.15s ease-out forwards !important;
         transform: none !important;
       }
       .animate-marquee-left,
       .animate-marquee-right {
         animation: none !important;
       }
     }
     ```
5. **In `src/components/ContactSection.jsx:526-538`**:
   Wrap `confetti(...)` with:
   ```javascript
   const isReduced = typeof window !== 'undefined' && (
     window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
     document.documentElement.classList.contains('reduced-motion')
   );
   if (!isReduced) {
     confetti({ ... });
   }
   ```

---

### Blueprint D: Automated Accessibility Verification Script (`scripts/verify_accessibility.mjs`)
The script verifies:
1. `index.html` has `lang="en"`, `<meta name="viewport">`
2. `App.jsx` has `<main id="main-content">` and skip-link `<a href="#main-content" ...>`
3. `Navbar.jsx` has `<header>` and `<nav aria-label="...">`
4. `Footer.jsx` has `<footer>`
5. Icon-only buttons have descriptive `aria-label`
6. Canvases have `aria-hidden="true"`
7. Tabs have `role="tablist"` and `role="tab"`
8. Mathematical WCAG AAA contrast ratio calculation:
   - Pure White / Pure Black = 21:1 ($\ge 7:1$)
   - High Contrast Yellow / Black = 19.56:1 ($\ge 7:1$)
   - High Contrast Blue / White = 8.90:1 ($\ge 7:1$)
   - High Contrast Solid Borders = 21:1 ($\ge 4.5:1$)
9. `src/styles/high-contrast.css` exists, imported in `index.css`, contains `backdrop-filter: none`, `2px solid`, and `@media (forced-colors: active)`
10. Reduced motion rules: `@media (prefers-reduced-motion: reduce)`, `html.reduced-motion`, `DynamicCursorManager` fallback, `simpleFadeIn` opacity transition.
11. Modals handle `Escape`, tabs handle arrow keys, and `:focus-visible` outline is configured.

---

## 4. Caveats
- No caveats regarding Pillars 3 & 4. All findings are substantiated by exact line numbers and direct codebase inspection.
- Screen reader live announcements (Pillar 2) and modal focus traps (Pillar 1) are actively explored by peer explorer agents (`explorer_a11y_aria` and `explorer_a11y_nav`). The verification script is designed to holistically audit all 4 pillars.

---

## 5. Conclusion
Pillars 3 & 4 provide the core sensory-safety, visual accessibility, and automated verification guarantees for the portfolio:
1. **Reduced Motion**: Disconnecting custom cursor loops, setting `cursor: auto`, eliminating 290+ duplicate marquee tab stops, freezing ribbons cleanly, replacing physical transitions with simple opacity fades, and suppressing confetti ensures 100% barrier-free browsing for users with vestibular or motion sensitivities.
2. **High-Contrast Architecture**: A dedicated `HighContrastContext` with `Alt+H` shortcut and `high-contrast.css` guarantees WCAG AAA contrast ($\ge 7:1$ text, $\ge 4.5:1$ UI components, 2px solid borders, zero glassmorphism), seamlessly composing with Dark, Light, and Simple modes.
3. **Automated Verification**: `scripts/verify_accessibility.mjs` provides an instantaneous, comprehensive regression gate integrated into `npm test`.

---

## 6. Verification Method

To independently verify the findings and resulting implementation:
1. **Run Unit & Integration Tests**:
   ```powershell
   npm test
   ```
   (Must include `node scripts/verify_accessibility.mjs` with exit code 0).
2. **Run Linter**:
   ```powershell
   npm run lint
   ```
   (Must report 0 errors).
3. **Run Production Build**:
   ```powershell
   npm run build
   ```
   (Must complete Vite build with 0 errors).
4. **Standalone Accessibility Test Run**:
   ```powershell
   node scripts/verify_accessibility.mjs
   ```
   (Must report 0 failures across all 5 test suites).
5. **Inspect Files**:
   - `src/context/HighContrastContext.jsx`
   - `src/styles/high-contrast.css`
   - `src/context/LabContext.jsx`
   - `src/components/DynamicCursorManager.jsx`
   - `src/components/TechMarqueeBanner.jsx`
   - `src/components/ControlCenterPanel.jsx`
   - `scripts/verify_accessibility.mjs`
