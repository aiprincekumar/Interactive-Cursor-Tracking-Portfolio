# Department 05: Frontend Engineering & Client-Side Architecture

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/archive/universal_rules.md) (Archived canonical reference)

---

## 💻 1. Mission & Department Scope

The Frontend Engineering & Client-Side Architecture Department (Dept 05) develops client-side application architecture, user interface implementation, state management, rendering performance, SSR/SSG boundaries, and reactivity systems. This department ensures frontend code is performant, bug-free, strictly type-safe, and readily extensible.

---

## ⚛️ 2. Component Discipline & Principles

### 2.1 Pure Component Separation (UI vs. Container Pattern)
- **Presentational Components (Dumb/Pure):** Accept strictly `props` and render UI. Prohibit direct API invocations or heavy unmanaged side effects.
- **Container / Hook Layer (Smart/Logic):** Encapsulate data fetching, state transitions, and business logic into dedicated custom hooks (`useUserProfile`, `useOrderList`).

### 2.2 State Management Hierarchy
1. **Server State:** Strictly manage server-originated data via `TanStack Query` (React Query) or `SWR`. Caching, deduplication, and background invalidation remain the domain of server-state libraries.
2. **Global Client State:** Restrict global stores (`Zustand` or lightweight atoms) to truly global data (e.g., active theme, session status, active modal queues).
3. **Local UI State:** Utilize local component state (`useState`, `useReducer`) for ephemeral form inputs, toggles, and dropdown open states.

---

## 🚀 3. Rendering Performance & Memory Safety

### 3.1 Preventing Unnecessary Re-Renders
- Apply `useMemo` for computationally demanding transformations and `useCallback` for event handlers passed to memoized children.
- Virtualize long lists (> 100 items) using `@tanstack/react-virtual` to keep the active DOM node footprint bounded.
- Code-Splitting: Lazy-load route definitions and heavy ancillary modules with `React.lazy()` and `Suspense`.

### 3.2 Memory Leak Prevention
- Every `useEffect` managing event listeners, WebSocket channels, external subscriptions, or timers (`setInterval`, `setTimeout`) must implement a strict cleanup function (`return () => { ... }`).

```typescript
// Example: Safe custom hook with lifecycle cleanup
import { useEffect, useState } from 'react';

export function useWindowResize() {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // Mandatory cleanup preventing detached event listeners
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowWidth;
}
```

---

## 🛡️ 4. Type Safety & Form Validation

- **Strict TypeScript:** Prohibit `any`. All DTOs, API payloads, and component props must define explicit TypeScript interfaces or types.
- **Runtime Form Validation:** Validate all form submissions at runtime combining `Zod` schemas with `react-hook-form`.

```typescript
import { z } from 'zod';

export const userRegistrationSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;
```

---

## 🧑‍💼 5. Departmental Roles & Dedicated Subagents

To enforce specialization of labor and enterprise rigor, 6 dedicated enterprise job roles and their corresponding subagent archetypes are established:

### 5.1 Senior Frontend Core Engineer (Frontend Engineer)
- **Dedicated Subagent Role:** `Frontend Engineer`
- **Scope & Responsibilities:**
  - Build production-grade modular React/TypeScript components.
  - Enforce strict TypeScript interfaces, Zod schema validations, and end-to-end type safety.
  - Govern boundaries between React Server Components (RSC) and Client Components.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Frontend Engineer",
  "Prompt": "Develop production-grade React/TypeScript components, enforce strict type-safety and Zod schema validations, and manage modular component architecture."
}
```

### 5.2 Client State & Cache Architect (Frontend State Architect)
- **Dedicated Subagent Role:** `Frontend State Architect`
- **Scope & Responsibilities:**
  - Architect scalable client state and server caches using Zustand and TanStack Query.
  - Implement optimistic UI updates paired with automatic rollback capabilities.
  - Configure stale-while-revalidate caching windows and eliminate state drift.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Frontend State Architect",
  "Prompt": "Architect scalable client state using Zustand and TanStack Query, implement optimistic UI mutations, configure stale-while-revalidate caching, and eliminate state drift."
}
```

### 5.3 Motion, 3D WebGL & Canvas Specialist (Canvas Motion Specialist)
- **Dedicated Subagent Role:** `Canvas Motion Specialist`
- **Scope & Responsibilities:**
  - Develop immersive 3D canvas environments using Three.js and WebGL.
  - Build high-performance HTML5 Canvas visualizations, animations, and custom GLSL shaders.
  - Optimize 60fps GPU-accelerated motion pipelines and render loops.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Canvas Motion Specialist",
  "Prompt": "Implement Three.js/WebGL 3D graphics, high-performance HTML5 Canvas visualizations, customized shader effects, and performant GPU-accelerated motion rendering."
}
```

### 5.4 Responsive & Cross-Browser Web Engineer (Responsive Web Specialist)
- **Dedicated Subagent Role:** `Responsive Web Specialist`
- **Scope & Responsibilities:**
  - Construct fluid responsive layouts using CSS container queries, flexbox, and grid systems.
  - Resolve cross-browser rendering quirks across Chromium, WebKit, Gecko, and mobile Safari.
  - Optimize touch gesture response, scrolling kinematics, and viewport ergonomics.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Responsive Web Specialist",
  "Prompt": "Engineer fluid responsive layouts using CSS container queries and flex/grid systems, resolve cross-browser quirks (WebKit/Gecko), and ensure mobile touch ergonomics."
}
```

### 5.5 Mobile Native & Cross-Platform Specialist (Mobile Native Specialist)
- **Dedicated Subagent Role:** `Mobile Native Specialist`
- **Scope & Responsibilities:**
  - Engineer native components for iOS (Swift/SwiftUI) and Android (Kotlin/Jetpack Compose).
  - Integrate cross-platform mobile frameworks including React Native, Expo, Capacitor, and Tauri.
  - Implement mobile hardware integrations (biometrics, camera, push notifications, offline SQLite).
  - Enforce Apple App Store and Google Play Store performance and guideline compliance.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Mobile Native Specialist",
  "Prompt": "Architect and develop native and cross-platform mobile applications (React Native/Capacitor/Swift/Kotlin), implement device hardware integrations, and ensure strict mobile store performance compliance."
}
```

### 5.6 Micro-Frontend & Module Federation Architect (Micro-Frontend Architect)
- **Dedicated Subagent Role:** `Micro-Frontend Architect`
- **Scope & Responsibilities:**
  - Design and govern decoupled micro-frontend architectures, host/remote boundaries, and shared dependency singletons.
  - Configure Webpack / Vite Module Federation plugins, runtime contract validation, and independent deployment topologies.
  - Guarantee cross-application state isolation, CSS style encapsulation, and resilient fallback boundaries during remote failures.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Micro-Frontend Architect",
  "Prompt": "Mandatory: First load and adhere to .agents/rules/05_frontend_engineering_dept.md (or C:\\Users\\Atul Verma\\.gemini\\config\\rules\\05_frontend_engineering_dept.md) and memory.md before executing instructions. Architect micro-frontend topologies, configure Module Federation (Webpack/Vite), enforce runtime contract boundaries, and ensure style/state isolation across remotes."
}
```

---

## 🚦 6. Department Handoff & Verification Gates

1. **Gate 5-A (Typecheck & Lint Pass):** `tsc --noEmit` and `npm run lint` must complete with zero errors and zero warnings.
2. **Gate 5-B (Build Gate):** `npm run build` must successfully compile the production bundle.
3. **Downstream Handoff:**
   - Automated testing suite ➔ **Dept 08: Quality Assurance & Testing**
   - Performance and Web Vitals audit ➔ **Dept 09: Performance & Web Vitals**
