# Skill Requirement & Pre-Audit Verification Report: Full-Project Exhaustive Performance Scan
**Agent**: `skill_requirement_scout` (Skill Requirement Scout & Duplicate Checker)  
**Caller / Recipient**: `parent` (`e086d8ce-c5a8-4fd6-ba53-35a128f9e01d`)  
**Scope**: Full-stack exhaustive performance scan across all components, listeners, loops, shaders, 3D controls, and render lifecycles (CPU/GPU load, layout thrashing, memory leaks, unthrottled event listeners, heavy re-renders).  
**Operating Rules**: Universal Rule 3 (Discovery & Sourcing Skip Mechanism) & Universal Rule 4 (Mandatory Duplicate Verification).  
**Status**: **100% SATISFIED — INSTALLATION SKIPPED**

---

## 1. Executive Summary & Verdict

- **Status**: **ALL REQUIRED SKILLS ARE PRESENT & VERIFIED.**
- **Universal Rule 3 Skip Condition**: **ACTIVATED**. All required skills for deep profiling, React performance optimization, memory leak inspection, event throttling, layout thrashing prevention, and code auditing are already installed locally. External searching or installing of new skills is **OFFICIALLY SKIPPED**.
- **Universal Rule 4 Duplicate Guard**: **CONFIRMED**. Zero new skills need to be created. No duplicates permitted.

---

## 2. Required Skill Domains vs. Installed Inventory

| Performance Domain | Required Capabilities | Installed Local Skill | Path / Location | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Comprehensive Performance Optimization** | Core Web Vitals, bottlenecks, layout thrashing, paint timings, CPU/GPU profiling | `performance-optimization` | `C:\Users\Atul Verma\.gemini\config\skills\performance-optimization` | **Present** |
| **React 19 Re-render & Lifecycle Profiling** | Excessive re-renders, unmemoized object/function props, hook dependency churn, context fan-out | `react-performance`<br>`react-best-practices`<br>`react-patterns` | `C:\Users\Atul Verma\.gemini\config\plugins\ecc-skills\skills\react-performance`<br>`C:\Users\Atul Verma\.gemini\config\skills\react-best-practices`<br>`C:\Users\Atul Verma\.gemini\config\plugins\ecc-skills\skills\react-patterns` | **Present** |
| **Cursor Tracking, Loops & Animation Latency** | Mousemove/pointermove throttling, RAF loops, GPU acceleration, 60/120 FPS frame budget | `latency-critical-systems`<br>`motion-advanced`<br>`motion-patterns`<br>`motion-foundations` | `C:\Users\Atul Verma\.gemini\config\plugins\ecc-skills\skills\latency-critical-systems`<br>`C:\Users\Atul Verma\.gemini\config\plugins\ecc-skills\skills\motion-advanced` | **Present** |
| **Memory Leaks & Event Listener Lifecycles** | Detached DOM nodes, dangling event listeners, uncleared timeouts/intervals, ResizeObserver/IntersectionObserver cleanup | `debugging-and-error-recovery`<br>`code-review-and-quality`<br>`production-audit` | `C:\Users\Atul Verma\.gemini\config\skills\debugging-and-error-recovery`<br>`C:\Users\Atul Verma\.gemini\config\skills\code-review-and-quality`<br>`C:\Users\Atul Verma\.gemini\config\plugins\ecc-skills\skills\production-audit` | **Present** |
| **Static & Dynamic Code Analysis** | Full workspace AST inspection, unthrottled handler scanning, Oxlint static analysis | `repo-scan`<br>`plankton-code-quality`<br>`verification-loop` | `C:\Users\Atul Verma\.gemini\config\plugins\ecc-skills\skills\repo-scan`<br>`C:\Users\Atul Verma\.gemini\config\plugins\ecc-skills\skills\plankton-code-quality` | **Present** |
| **Runtime & DevTools Validation** | Synthetic/RUM inspection, DevTools traces, automated test suites | `browser-testing-with-devtools`<br>`playwright-cli` | `C:\Users\Atul Verma\.gemini\config\skills\browser-testing-with-devtools`<br>`.agents/skills/playwright-cli` | **Present** |

---

## 3. Targeted Audit Surface for the Performance Scan

Based on the installed skills, the exhaustive scan should audit:
1. **High-Frequency Event Listeners**:
   - `mousemove`, `pointermove`, `wheel`, `scroll`, and `resize` listeners in `src/hooks/`, `src/components/` (specifically cursor tracking, radar, 3D compass, parallax).
   - Ensure throttling via `requestAnimationFrame` or passive event listeners (`{ passive: true }`).
2. **Layout Thrashing (Forced Synchronous Layout)**:
   - Interleaved reads (`getBoundingClientRect`, `offsetHeight`, `scrollTop`) and DOM/style mutations in loops or render paths.
3. **Memory Leaks & Disposals**:
   - `useEffect` cleanups: dangling `addEventListener`, `setInterval`, `setTimeout`, WebGL contexts, Web Audio nodes, or Leaflet map instances.
4. **React 19 Re-render Fan-Out**:
   - Unmemoized Context values (`LabContext`, theme context), inline arrow functions/objects in high-frequency child components, or missing `memo`/`useMemo`/`useCallback`.
5. **Heavy Computations & Transformers**:
   - `@huggingface/transformers` on-device AI model loading and inference memory management.
   - Large canvas calculations or unoptimized SVG/filter repaints.

---

## 4. Conclusion & Recommendation

All necessary tooling and knowledge runbooks are available locally. No downloads or installations are required. Proceed directly to executing the exhaustive project-wide performance scan.
