# Design System & Aesthetic Specification

> **Workspace:** Interactive Cursor-Tracking Portfolio  
> **Authority:** Department 04 (UI/UX Design System & Aesthetic Engineering)  
> **Status:** Production Standard  

---

## 🎨 1. Visual Philosophy & Core Aesthetics

The Interactive Cursor-Tracking Portfolio embodies a high-performance **Cyberpunk Obsidian** design aesthetic. It blends deep dark-mode obsidian surfaces with vibrant emerald and neon cyan highlights, hardware-accelerated canvas kinematics, and precise glassmorphic elevation.

### Core Aesthetic Principles:
1. **Kinetic Precision:** Fluid 60–120 FPS cursor tracking, spring physics, and zero layout thrashing.
2. **Deep Obsidian Hierarchy:** Layered dark surfaces avoiding flat pitch-black, creating natural atmospheric depth.
3. **Calibrated Neon Contrast:** Restrained, purposeful neon accents for interactive feedback, focus states, and spatial anchors.
4. **Anti-Generic Identity:** Distinctive bespoke styling rejecting cookie-cutter AI/SaaS template visuals.

---

## 🌈 2. Design Tokens & Color Palette

### 2.1 Surface & Background Tokens
- **Background Root (`--bg-primary`):** `#0B0F17` (Deep Obsidian Onyx)
- **Surface Elevation 1 (`--bg-surface-1`):** `#111827` (Card and container fill)
- **Surface Elevation 2 (`--bg-surface-2`):** `#1F2937` (Hover states and active drawers)
- **Surface Glass (`--bg-glass`):** `rgba(17, 24, 39, 0.75)` with `backdrop-filter: blur(12px)`

### 2.2 Accent & Brand Tokens
- **Primary Brand Tint (`--accent-primary`):** `#10B981` (Vibrant Emerald)
- **Primary Brand Deep (`--accent-primary-deep`):** `#059669` (Cyberpunk Emerald)
- **Secondary Accent (`--accent-secondary`):** `#00F0FF` (High-Voltage Neon Cyan)
- **Tertiary Accent (`--accent-tertiary`):** `#8B5CF6` (Electric Violet)

### 2.3 Borders & Outlines
- **Subtle Translucent Border (`--border-subtle`):** `rgba(255, 255, 255, 0.08)`
- **Accent Interactive Border (`--border-accent`):** `rgba(16, 185, 129, 0.30)`
- **Focus Indicator Ring (`--focus-ring`):** `rgba(0, 240, 255, 0.60)`

### 2.4 Typography & Text Tokens
- **Text Heading / Primary (`--text-primary`):** `#F9FAFB` (High contrast, clean white)
- **Text Body / Secondary (`--text-secondary`):** `#9CA3AF` (Muted cool gray)
- **Text Subtle / Disabled (`--text-tertiary`):** `#6B7280` (Soft neutral gray)

---

## ✍️ 3. Typography Scale & Hierarchy

- **Primary UI & Display Font:** `Outfit`, sans-serif
- **Body & Content Font:** `Inter`, system-ui, sans-serif
- **Code & Numerical Mono Font:** `JetBrains Mono`, `Fira Code`, monospace

### Typography Rules:
- **Display & Headings (H1/H2):** Tight tracking (`letter-spacing: -0.025em`), single-row desktop invariant (Universal Rule 19).
- **Body Text:** Relaxed line height (`line-height: 1.6`), fluid responsive scale via CSS `clamp(1rem, 0.95rem + 0.25vw, 1.125rem)`.
- **Labels & Badges:** Monospace, uppercase, tracking `+0.05em`.

---

## 🏃 4. Motion, Kinematics & Performance Invariants

1. **Refresh Rate Standard:** Animation and cursor loops locked at **60 to 120 FPS**.
2. **Zero Layout Thrashing:** Never invoke `getBoundingClientRect()`, `offsetWidth`, or `offsetHeight` within `requestAnimationFrame` loops.
3. **Particle Constraints:** Particle pools capped at **60–70 particles** with object recycling to prevent GC pressure.
4. **Cumulative Layout Shift (CLS):** Target CLS = `0.00`. All asynchronous drawers, maps, modals, and dynamic content must reserve layout dimensions using skeletons.

---

## 🏗️ 5. Z-Index Elevation Master Hierarchy

| Layer Name | Z-Index Token | Scope & Components |
| :--- | :--- | :--- |
| **Canvas Background** | `z-0` .. `z-30` | 2D/3D background canvas, particle field |
| **Section Content** | `z-30` | Cards, text blocks, grid layouts |
| **Sticky Headers** | `z-40` | Section sub-headers, sticky titlebars |
| **Global Navbar** | `z-50` | Primary desktop/mobile navigation bar |
| **Floating Action Hub** | `z-[60]` | Quick action radial/floating trigger hub |
| **Back to Top Button** | `z-[70]` | Smooth scroll-to-top floating button |
| **Drawers & Terminal** | `z-[80]` | Interactive terminal drawer, side panels |
| **AI Assistant Chat** | `z-[85]` | On-device AI chat floating widget & drawer |
| **Lightbox / Spotlight**| `z-[90]` | Portfolio gallery lightbox, modal backdrop |
| **System Toasts & Alerts** | `z-[100]` | High-priority notifications, network alerts |

---

## ♿ 6. Accessibility (A11y) & Usability

- **Contrast Compliance:** Minimum contrast ratio of 4.5:1 for standard body copy; 3:1 for large display text and UI icons.
- **Visible Focus States:** All interactive controls (`button`, `a`, `input`, tab items) must display high-visibility focus indicators (`outline: 2px solid var(--focus-ring)`).
- **ARIA Standards:** Icon-only buttons must provide explicit `aria-label` or visually hidden `.sr-only` descriptions.
- **Reduced Motion:** Honor `@media (prefers-reduced-motion: reduce)` by disabling high-velocity particles and transition animations.
