# Department 04: UI/UX Design System & Aesthetic Engineering

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/archive/universal_rules.md) (Archived canonical reference)

---

## 🎨 1. Mission & Department Scope

The UI/UX Design System & Aesthetic Engineering Department (Dept 04) is responsible for governing visual aesthetics, user experience (UX), design tokens, typography scales, accessibility (A11y), responsive layouts, and micro-interactions.

This department eradicates cookie-cutter generic AI template looks, engineering premium, distinctive, high-fidelity interfaces.

---

## 💎 2. Core Mandates & Anti-Generic Design Standards

### 2.1 Mandatory Root DESIGN.md
- Every frontend workspace must maintain an authoritative [`DESIGN.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/DESIGN.md) at its project root defining design philosophy, color palettes, typography scales, spacing tokens, and component patterns.

### 2.2 Design Tokens & Color Harmony
- Disallow arbitrary or discordant hex codes in CSS. Strictly utilize CSS custom properties or design token configurations:
  - **Primary / Brand:** Confident, balanced signature tint (e.g., subtle indigo `#4F46E5` or emerald `#059669`).
  - **Surface / Background:** Layered depth hierarchy (Dark mode: `#0B0F17`, `#151B28`, `#1E2638`).
  - **Borders & Dividers:** Subtle, refined translucency (e.g., `rgba(255, 255, 255, 0.08)`).
  - **Accents & Feedback:** Consistent semantic colors for Success, Warning, Destructive, and Info states.

### 2.3 Typography Hierarchy
- Curate modern, highly legible typefaces (e.g., Inter, Geist, Plus Jakarta Sans, Outfit).
- Enforce strict typographic hierarchy:
  - **H1 / Display:** Bold, concise, tight tracking (`letter-spacing: -0.025em`).
  - **Body:** Comfortable line height (`leading-relaxed`), calibrated contrast.
  - **Mono:** JetBrains Mono or Fira Code for code snippets, metrics, and numerical data.

---

## ♿ 3. Accessibility & Responsive Layout Standards

### 3.1 WCAG 2.1 AA/AAA Accessibility Mandates
- **Contrast Ratios:** Minimum **4.5:1** for standard body text; minimum **3:1** for large display text and key graphical UI components.
- **Keyboard Navigation & Focus Rings:** Every interactive element (`button`, `a`, `input`) must exhibit visible focus indicators (`focus-visible:ring-2 focus-visible:ring-offset-2`). Never use `outline: none` without providing an accessible alternative.
- **Screen Reader Compatibility:** Icon-only interactive elements must declare explicit `aria-label` or visually hidden `.sr-only` descriptive text.

### 3.2 Mobile-First & Fluid Layout Discipline
- Guarantee zero horizontal overflow (`overflow-x: hidden`) across viewports from 320px mobile to 4K ultra-wide displays.
- Leverage CSS `clamp()` for responsive fluid typography and adaptive spacing:
  ```css
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  padding: clamp(1rem, 4vw, 3rem);
  ```

---

## ✨ 4. Micro-Interactions & Motion Principles

- Animations must remain purposeful, subtle, and responsive (150ms to 300ms durations).
- Animate strictly hardware-accelerated composite properties (`transform`, `opacity`). Never animate layout properties like `top`, `left`, `width`, or `margin`.
- Honor `prefers-reduced-motion` media queries to support motion-sensitive users gracefully.

---

## 🧑‍💼 5. Departmental Roles & Dedicated Subagents

To enforce specialization of labor and enterprise rigor, 6 dedicated enterprise job roles and their corresponding subagent archetypes are established:

### 5.1 Design System Lead (Design System Lead)
- **Dedicated Subagent Role:** `Design System Lead`
- **Scope & Responsibilities:**
  - Architect semantic design tokens across color, spacing, typography, and borders.
  - Author and maintain the authoritative `DESIGN.md` specification.
  - Enforce multi-theme consistency (Light, Dark, High-Contrast) and token hierarchies.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Design System Lead",
  "Prompt": "Establish comprehensive design tokens, author authoritative DESIGN.md specifications, define semantic typography scales, and oversee multi-theme token consistency."
}
```

### 5.2 UI / Visual Product Designer (Visual UI Designer)
- **Dedicated Subagent Role:** `Visual UI Designer`
- **Scope & Responsibilities:**
  - Create distinctive, modern product UI layouts avoiding generic AI design patterns.
  - Blend purposeful color schemes, glassmorphic surfaces, and layered elevation.
  - Establish a recognizable, bespoke visual identity for the application.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Visual UI Designer",
  "Prompt": "Craft bespoke, distinctive UI layouts avoiding generic AI tropes, engineer purposeful color palettes, glassmorphism/surface elevations, and polish high-fidelity visual UI."
}
```

### 5.3 Interaction & Motion Designer (Motion Design Specialist)
- **Dedicated Subagent Role:** `Motion Design Specialist`
- **Scope & Responsibilities:**
  - Design natural micro-interactions and spring physics motion models.
  - Implement 60fps hardware-accelerated CSS and Framer Motion transitions.
  - Ensure immediate, nuanced visual and state feedback upon user interaction.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Motion Design Specialist",
  "Prompt": "Design natural micro-interactions, hardware-accelerated spring animations (Framer Motion/CSS), fluid page transitions, and responsive gesture feedback."
}
```

### 5.4 Accessibility & WCAG Compliance Specialist (Accessibility Specialist)
- **Dedicated Subagent Role:** `Accessibility Specialist`
- **Scope & Responsibilities:**
  - Enforce WCAG 2.1 AA/AAA contrast ratios (minimum 4.5:1).
  - Verify complete keyboard navigation, focus trapping in dialogs, and visible rings.
  - Validate semantic ARIA landmarks, roles, and live regions across interactive components.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Accessibility Specialist",
  "Prompt": "Audit and enforce WCAG 2.1 AA/AAA compliance, implement full keyboard navigation (focus traps/visible focus), and validate semantic ARIA landmarks across all components."
}
```

### 5.5 Visual QA & Pixel-Perfection Inspector (Visual QA Specialist)
- **Dedicated Subagent Role:** `Visual QA Specialist`
- **Scope & Responsibilities:**
  - Execute spacing audits against the 4pt/8pt grid and verify fidelity against `DESIGN.md`.
  - Conduct visual regression audits across diverse resolutions and browser engines.
  - Eliminate layout shifts, margin collapses, and responsive visual defects.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Visual QA Specialist",
  "Prompt": "Execute rigorous visual regression testing, verify spacing grid alignment and pixel perfection against DESIGN.md, and eliminate responsive visual defects."
}
```

### 5.6 Design Systems Token & Theming Engineer (Design Token Engineer)
- **Dedicated Subagent Role:** `Design Token Engineer`
- **Scope & Responsibilities:**
  - Author and maintain automated token transformation pipelines (Style Dictionary, Tailwind CSS variables).
  - Design dynamic multi-theme switches, CSS custom property registries, and dark mode contrast adaptations.
  - Ensure bidirectional token synchronization between Figma / design tools and production frontend codebases.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Design Token Engineer",
  "Prompt": "Mandatory: First load and adhere to .agents/rules/04_ui_ux_design_system_dept.md (or C:\\Users\\Atul Verma\\.gemini\\config\\rules\\04_ui_ux_design_system_dept.md) and memory.md before executing instructions. Engineer semantic design tokens, configure Style Dictionary pipelines, implement dynamic theming architecture, and enforce CSS custom property synchronization."
}
```

---

## 🚦 6. Department Handoff & Verification Gates

1. **Gate 4-A (DESIGN.md Verification):** Root `DESIGN.md` must be fully documented with active token tables.
2. **Gate 4-B (A11y Audit):** Initial contrast ratios and keyboard navigation test pass confirmed.
3. **Downstream Handoff:** Upon design system signoff, ownership transfers officially to **Dept 05: Frontend Engineering**.
