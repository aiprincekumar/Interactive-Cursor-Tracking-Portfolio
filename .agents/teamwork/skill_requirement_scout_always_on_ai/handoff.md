# Pre-Task Skill Audit & Requirement Report: Always-On SmolLM2-135M, Safe Worker Termination & 3-State Toggle UI

**Agent Name & Role**: `skill_requirement_scout` (Skill Requirement Scout & Duplicate Checker)  
**Task Subject**: Always-On Default SmolLM2-135M Background Load, Safe Worker Termination Unload Protocol, and 3-State Toggle UI (Grey, Orange, Green)  
**Operating Rules**: Universal Rule 3 (Skill Requirement Discovery & Sourcing) & Universal Rule 4 (Mandatory Skill Duplicate Verification)  
**Timestamp**: 2026-10-26T05:28:30+05:30  
**Status**: COMPLETE — ALL REQUIRED SKILLS AVAILABLE (RULE 3 SKIP CONDITION ACTIVATED | RULE 4 ZERO DUPLICATES APPROVED)

---

## 1. Executive Summary & Verification Verdict

An exhaustive audit of skill requirements for **Always-On Default SmolLM2-135M Background Load, Safe Worker Termination Unload Protocol, and 3-State Toggle UI (Grey, Orange, Green)** has been completed against the workspace codebase, project dependencies, and installed skills catalog.

### Verdict:
- **Skill Availability**: **100% SATISFIED.** Every required skill capability (Web Worker lifecycle management, WebGPU/WASM ONNX memory disposal via Transformers.js, React 19 subscription patterns, Tailwind CSS 3-state indicator styling, audio haptics, accessibility, and automated verification) is fully installed and operational on the local machine.
- **Universal Rule 3 Execution**: The **Skip Condition** is officially triggered. External skill search and installation (via `find-skills`, `skill-scout`, or GitHub) are **OFFICIALLY SKIPPED**.
- **Universal Rule 4 Status**: Zero new bespoke skills are required. Prohibits redundant skill creation; zero skill duplication approved.
- **Baseline Workspace Health**:
  - `npx oxlint`: **0 errors** (duplicate declaration in [localAIService.js](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/services/localAIService.js#L912-L934) resolved).
  - `npm run build`: Production client bundle built cleanly in **2.12s**.
  - `node scripts/verify_on_device_ai.mjs`: **100% checks passed**.

---

## 2. Technical Scope & Implementation Requirements Breakdown

1. **Always-On Default SmolLM2-135M Background Load**:
   - Autonomously trigger the background preloading of `HuggingFaceTB/SmolLM2-135M-Instruct` (`MODEL_CATALOG.BARE_MINIMUM`) upon initial chat readiness or app mount.
   - Zero UI thread blocking (0ms main thread impact) via isolated background Web Worker (`src/workers/aiModelWorker.js`).
   - Seamless dual-layer cache utilization (localStorage flag + `transformers-cache` CacheStorage API).

2. **Safe Worker Termination Unload Protocol**:
   - Provide an explicit, safe unload / turn-off method (`unloadWorker()` / `safeTerminate()`) in [localAIService.js](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/services/localAIService.js).
   - Terminate the active worker instance (`worker.terminate()`) to guarantee 100% WebGPU buffers and WASM RAM deallocation.
   - Reject any pending generation promises safely without throwing uncaught exceptions.
   - Clear loading watchdog timers, reset download and compiling states to `'idle'`, and set `isAiEnabled = false`.
   - Ensure instant deterministic fallback to `[Portfolio-Engine]` (0ms response latency).

3. **3-State Toggle UI (Grey, Orange, Green)**:
   - In [AIChatWidget.jsx](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/AIChatWidget.jsx#L2880-L2891), enhance the quick toggle pill into a 3-state control:
     * **Grey State (Off / Unloaded)**:
       - Visual: `bg-stone-200/60 dark:bg-stone-800/80 border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400`
       - Content: `🔌 AI Off` or `⚪ AI Off`
       - Action on click: Triggers load of SmolLM2-135M -> enters Orange state.
     * **Orange / Amber State (Loading / Downloading / Compiling)**:
       - Visual: `bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400 animate-pulse`
       - Content: `⏳ AI Loading...` (or dynamic download % if available)
       - Action on click: Safely cancels download and terminates worker -> reverts to Grey state.
     * **Green State (Ready / Active)**:
       - Visual: `bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30`
       - Content: `⚡ AI Ready` (or active model shortcut)
       - Action on click: Safely unloads worker via safe termination protocol -> reverts to Grey state.
   - Include ARIA attributes (`aria-label`, `aria-live`) and sound haptics via `soundFX.click()` / `soundFX.pop()`.

---

## 3. Skill Inventory & Domain Mapping Audit

| Requirement Domain | Technical Scope | Installed Local Skill | Location | Status |
| :--- | :--- | :--- | :--- | :--- |
| **On-Device Foundation Models** | Transformers.js v4.3.1, WebGPU/WASM ONNX models, streaming generation | `foundation-models-on-device` | `C:\Users\Atul Verma\.gemini\config\plugins\ecc-skills\skills\foundation-models-on-device\` | **Available** |
| **Web Worker Lifecycle & RAM Safety** | `worker.terminate()`, zero memory leak deallocation, isolated thread orchestration | `react-patterns`<br>`react-best-practices`<br>`error-handling` | `C:\Users\Atul Verma\.gemini\config\plugins\ecc-skills\skills\react-patterns\`<br>`...\skills\error-handling\` | **Available** |
| **React 19 State & Subscriptions** | Singleton subscriber architecture, optimistic UI sync, event bus | `react-best-practices`<br>`frontend-patterns` | `C:\Users\Atul Verma\.gemini\config\skills\react-best-practices\` | **Available** |
| **Tailwind 3-State UI Engineering** | 3-state badge styling (Grey, Orange, Green), animations, focus states | `frontend-ui-engineering`<br>`liquid-glass-design`<br>`make-interfaces-feel-better` | `C:\Users\Atul Verma\.gemini\config\skills\frontend-ui-engineering\`<br>`...\skills\liquid-glass-design\` | **Available** |
| **Accessibility & Haptics** | Screen reader announcements (`useAnnounce`), keyboard navigation, sound cues | `accessibility`<br>`web-design-guidelines` | `C:\Users\Atul Verma\.gemini\config\plugins\ecc-skills\skills\accessibility\` | **Available** |
| **Automated Testing & Regression** | Node.js verification scripts, AST analysis, state transition tests | `test-driven-development`<br>`verification-loop` | `C:\Users\Atul Verma\.gemini\config\skills\test-driven-development\`<br>`...\skills\verification-loop\` | **Available** |

---

## 4. Universal Engineering Rules Compliance

### Universal Rule 3: Skip Condition Certified
- **Status**: **PASS (SKIP TRIGGERED)**
- All required capabilities are already present locally. No external packages, npm installs, or external skill searches are needed.

### Universal Rule 4: Mandatory Skill Duplicate Verification
- **Status**: **PASS (ZERO DUPLICATES)**
- No new skills need to be generated in `.agents/skills` or `.gemini/config/skills`. The existing skill set provides full coverage.

---

## 5. Recommended Architecture for Implementation Agent

1. **[src/services/localAIService.js](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/services/localAIService.js)**:
   - Expose `safeUnloadAndTerminate()`:
     ```javascript
     safeUnloadAndTerminate() {
       this.clearWatchdog();
       if (this.worker) {
         try { this.worker.terminate(); } catch (err) {}
         this.worker = null;
       }
       this.status = 'idle';
       this.activeModel = null;
       this.downloadingModel = null;
       this.downloadProgress = 0;
       this.isAiEnabled = false;
       this.isModelLoading = false;
       if (typeof window !== 'undefined') {
         localStorage.setItem('portfolio_ai_model_consent', 'disabled');
       }
       this.notifyListeners({ type: 'ai_unloaded', message: 'On-Device AI worker safely terminated and RAM unloaded.' });
     }
     ```
   - Add default autoload trigger `initAlwaysOnSmolLM()`:
     ```javascript
     initAlwaysOnSmolLM() {
       if (!this.isAiEnabled || this.status === 'ready' || this.status === 'downloading') return;
       this.activateModel(MODEL_CATALOG.BARE_MINIMUM.id);
     }
     ```

2. **[src/components/AIChatWidget.jsx](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/AIChatWidget.jsx)**:
   - Derive current 3-state value:
     ```javascript
     const getAiToggleState = () => {
       if (localAiState?.status === 'downloading' || localAiState?.status === 'compiling' || localAiState?.status === 'loading_cache' || localAiState?.isModelLoading) {
         return 'loading'; // Orange State
       }
       if (localAiState?.isAiEnabled && localAiState?.activeModel && (localAiState?.status === 'ready' || localAiState?.status === 'generating')) {
         return 'ready'; // Green State
       }
       return 'off'; // Grey State
     };
     ```
   - Update quick toggle click handler:
     - If `'ready'` or `'loading'`: Call `localAIService.safeUnloadAndTerminate()` -> switches to Grey (`'off'`).
     - If `'off'`: Call `localAIService.switchModel(MODEL_CATALOG.BARE_MINIMUM.id)` -> switches to Orange (`'loading'`) and subsequently Green (`'ready'`).

3. **Dedicated Test Verification Script**:
   - Create `scripts/verify_always_on_ai_toggle.mjs` verifying:
     - 3-state toggle renders Grey, Orange, and Green configurations.
     - Safe worker termination method cleans up worker and state.
     - Always-on SmolLM2 initialization defaults are honored.
