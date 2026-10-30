# Department 09: Performance Engineering & Web Vitals

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/archive/universal_rules.md) (Archived canonical reference)

---

## ⚡ 1. Mission & Department Scope

The Performance Engineering & Web Vitals Department (Dept 09) governs application runtime velocity, client responsiveness, bundle size budgets, memory leak prevention, and Google Core Web Vitals compliance.

This department ensures applications maintain fluid, jank-free, 60fps execution even under constrained CPU, memory, and network environments.

---

## 📊 2. Core Web Vitals Thresholds & Targets

Every frontend interface must satisfy the following industry benchmarks:

| Metric | Full Name | Target Threshold (Good) | Remediation Threshold (Needs Work) |
| :--- | :--- | :--- | :--- |
| **LCP** | Largest Contentful Paint | **< 2.5 seconds** | 2.5s - 4.0s |
| **INP** | Interaction to Next Paint | **< 200 milliseconds** | 200ms - 500ms |
| **CLS** | Cumulative Layout Shift | **< 0.1** | 0.1 - 0.25 |
| **TTFB** | Time to First Byte | **< 800 milliseconds** | 800ms - 1800ms |

---

## 📦 3. Bundle Budgets & Code-Splitting Standards

### 3.1 Bundle Size Budgets
- Initial Entry JavaScript Bundle: Maximum **150 KB gzipped**.
- Route-Level Dynamic Asynchronous Chunks: Maximum **50 KB gzipped**.
- Replace heavy legacy dependencies (e.g., Lodash, Moment.js) with modular alternatives (e.g., `date-fns`, native ES methods).

### 3.2 Asset Optimization
- Compress raster assets into modern formats (`WebP`, `AVIF`).
- Enforce explicit `width` and `height` attributes or CSS `aspect-ratio` on all `<img>` and `<video>` tags to eliminate layout shift (CLS = 0.00).
- Enforce `loading="lazy"` on below-the-fold media elements.

---

## 🧠 4. Heap Profiling & Memory Leak Prevention

### 4.1 Primary Memory Leak Antipatterns
1. **Detached DOM Nodes:** Retaining references to removed DOM elements in JavaScript memory.
2. **Uncollected Event Listeners:** Failing to unbind `window` or `document` listeners upon component unmount.
3. **Unbounded Timers & Pollers:** Active `setInterval` timers or unclosed WebSocket subscriptions.

### 4.2 Three-Snapshot Heap Profiling Protocol
- **Snapshot 1 (Baseline):** Idle state following initial view hydration.
- **Snapshot 2 (Action):** User interaction (e.g., drawer opened, 3D viewport engaged).
- **Snapshot 3 (Teardown):** Interaction dismissed, cache flushed.
- **Verification:** Snapshot 3 object count must return to Baseline. Residual retained heap growth constitutes a critical memory leak defect.

---

## 🧑‍💼 5. Departmental Roles & Dedicated Subagents

To enforce specialization of labor and enterprise rigor, 4 dedicated enterprise job roles and their corresponding subagent archetypes are established:

### 5.1 Core Web Vitals Specialist (Web Vitals Engineer)
- **Dedicated Subagent Role:** `Web Vitals Engineer`
- **Scope & Responsibilities:**
  - Audit and tune Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1).
  - Streamline the critical rendering path and eliminate render-blocking assets.
  - Optimize resource prioritization across fonts, hero images, and stylesheets.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Web Vitals Engineer",
  "Prompt": "Audit and optimize Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1), optimize critical rendering paths, and tune image and font resource prioritization."
}
```

### 5.2 Heap Snapshot & Memory Leak Specialist (Memory Leak Specialist)
- **Dedicated Subagent Role:** `Memory Leak Specialist`
- **Scope & Responsibilities:**
  - Execute Chrome DevTools heap profiling and retention path analysis.
  - Detect and eliminate detached DOM trees, lingering closures, and unclosed listeners.
  - Resolve garbage collection bottlenecks to prevent long-term memory bloat.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Memory Leak Specialist",
  "Prompt": "Perform Chrome DevTools heap snapshot audits, detect detached DOM elements and unclosed event listeners, resolve garbage collection bottlenecks, and prevent memory leaks."
}
```

### 5.3 Bundle Size, Code-Splitting & Asset Optimizer (Bundle Optimization Engineer)
- **Dedicated Subagent Role:** `Bundle Optimization Engineer`
- **Scope & Responsibilities:**
  - Analyze bundle composition using bundle visualizers and enforce budgets (<200KB).
  - Configure route-based code-splitting (`React.lazy`), tree-shaking, and minification.
  - Manage AVIF/WebP image pipelines and Brotli/Gzip compression ratios.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Bundle Optimization Engineer",
  "Prompt": "Analyze bundle composition with bundle visualizers, enforce strict budget limits (<200KB), configure route-based code splitting and tree-shaking, and compress static assets."
}
```

### 5.4 Network Latency, CDN & Edge Caching Engineer (Latency Optimization Engineer)
- **Dedicated Subagent Role:** `Latency Optimization Engineer`
- **Scope & Responsibilities:**
  - Configure CDN edge caching headers (`stale-while-revalidate`, `max-age`).
  - Tune HTTP/2 and HTTP/3 multiplexing and resource prefetch hints.
  - Minimize Time to First Byte (TTFB) and eliminate redundant network roundtrips.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Latency Optimization Engineer",
  "Prompt": "Configure CDN edge caching headers (stale-while-revalidate), optimize HTTP/2 & HTTP/3 multiplexing, implement resource prefetching, and minimize Time to First Byte (TTFB)."
}
```

---

## 🚦 6. Department Handoff & Verification Gates

1. **Gate 9-A (Lighthouse Score):** Minimum performance benchmark of **>= 90/100**.
2. **Gate 9-B (Bundle Budget):** Zero production chunks exceeding allocated size thresholds in `npm run build`.
3. **Downstream Handoff:** Upon performance signoff, deliverables pass to **Dept 10: AppSec** and **Dept 12: DevOps**.
