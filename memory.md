# Interactive Cursor-Tracking Portfolio — Project Memory & Architecture Dossier

> **Document Type:** Project-Level Technical Memory & Architecture Ledger (WHAT the System Is)  
> **Workspace Root:** [`c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/)  
> **Target Dossier File:** [`c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\memory.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/memory.md)  
> **Master Operational Rules:** [`c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\GEMINI.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/GEMINI.md)  
> **Granular Feature Specifications:** [`c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\docs\FEATURES_MEMORY.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/docs/FEATURES_MEMORY.md)  
> **Universal Standards Ledger:** [`C:\Users\Atul Verma\.gemini\memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) & [`C:\Users\Atul Verma\.gemini\GEMINI.md`](file:///C:/Users/Atul%20Verma/.gemini/GEMINI.md)  
> **Portfolio Owner:** Atul Verma (`aiprincekumar` / `aiprincekumar010100@gmail.com`)  
> **GitHub Profile:** [https://github.com/aiprincekumar](https://github.com/aiprincekumar)  
> **Repository:** [https://github.com/aiprincekumar/interactive-cursor-tracking-portfolio](https://github.com/aiprincekumar/interactive-cursor-tracking-portfolio)  
> **Architecture Version:** 4.5.2 (Enterprise Production Master — 4-Layer Executive Structure)  
> **Last Audit & Synchronization:** 2026-10-26  

---

## 🧭 0. Live Agent State & Stateful Handoff Ledger (एजेंट की लाइव मेमोरी व हैंडऑफ़ स्टेट)

> [!IMPORTANT]
> **Incoming Agent Zero-Scan Direct Instruction:** Any incoming AI agent (Gemini, Claude, GPT, etc.) must **NEVER** execute full workspace scans (`dir /s`, `find`, `glob`, recursive tree walks). Read this document ([`memory.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/memory.md)) top-to-bottom to immediately grasp 100% of the project's state in 5 seconds.

| State Dimension | Live Status & Forensic Value |
| :--- | :--- |
| **Current Active Milestone** | **Clean, Minimal & Informative Chat Redesign v2.4.2 (Production Master Sign-Off A+)** |
| **Where the Agent is Right Now (अभी तक कहाँ पहुँचा है एजेंट)** | • **All 16 Architecture Modules** fully developed, calibrated, and running in production.<br>• **Clean, Minimal & Informative Chat Redesign (All 4 Phases Fully Completed & Verified A+)**:<br>  - Phase 1: Header & Sub-Header Minimalism (`AIChatWidget.jsx`) — Consolidated 8 header icon buttons into single `•••` Quick Tools popover menu (`showQuickTools`), retained 3 essential sub-header pills (Audience, Role Track, AI Model), and removed the permanent 36px rainbow Meta-Prompt strip.<br>  - Phase 2: Message Bubbles & Inline Micro-Toolbar (`AIChatWidget.jsx`) — Excised in-bubble option button stacks and bulky banners. Introduced single-row micro-toolbar with monospace timestamp, Copy button, TTS speech button, Thumbs up/down buttons, and dynamic model attribution badge (`msg.modelShortcut || '[Portfolio-Engine]'`).<br>  - Phase 3: Single-Row Flex Carousel & Input Polish (`AIChatWidget.jsx`, `SuggestionChipsDrawer.jsx`) — Converted suggestion drawer into single-row horizontal flex carousel with category tabs (`CATEGORY_TABS`) and composite Set deduplication; input composer upgraded with Sparkles Prompt Studio launcher, focus glow ring, and WCAG AA 44px minimum touch targets.<br>  - Phase 4: Full-Suite Verification & Safe Pruning (`scripts/verify_clean_minimal_chat.mjs`, `changes_log/`, `memory.md`) — Automated verification harness (6/6 PASS, 100%), full 58-harness regression suite under `npm test` (58/58 PASS, 100% Green), 0 oxlint errors across 319 files, and 1.88s clean production build.<br>• **Chat UI Resilience & Suggestion Deduplication (All 3 Phases Fully Completed & Verified A+)**.<br>• **AI & Chat Studio Settings Tab (Tab 7: `id: 'chat'`) (All 4 Phases Fully Completed & Verified A+)**.<br>• **Single Model Memory Lock & Concurrency Preload Mutex (All 4 Phases Fully Completed & Verified A+)**.<br>• **3D Studio Split Sandbox Suite (All Phases 1–5 Fully Completed & Verified)**.<br>• **All 35 Custom Cursors** across 7 distinct families active.<br>• **Pure Procedural Web Audio Engine** (8 procedural sounds, zero external mp3/wav files) verified.<br>• **0 Oxlint errors** across entire codebase.<br>• **Production Build Passing** in 1.88s. |
| **Last Agent Action Completed** | **`CHG-20261026-082`** (2026-10-26 08:25:00 IST) — Clean, Minimal & Informative Chat Redesign (Phases 1 - 4): Consolidated 8 header icon buttons into a single minimalist `•••` Quick Tools popover menu (`showQuickTools`), streamlined message micro-toolbars, converted Suggestion Drawer into a single-row flex carousel with category tabs and composite Set deduplication, added Sparkles Prompt Studio launcher and 44px touch targets; verified 6/6 tests in `scripts/verify_clean_minimal_chat.mjs`, 58/58 master regression suite (100% green), 0 oxlint errors, and 1.88s clean build. |
| **Next Immediate Recommended Action (अगला तत्काल कार्य)** | Safe post-verification cleanup of `temp_prompt/clean_minimal_chat_redesign/` per Universal Rule 22 while preserving `temp_prompt/README.md`. |
| **Universal Protocol Adherence** | Full compliance with Rule 1 (CEO Model), Rule 2 (Atomic Parallel Aggregation), Rule 6 (Changes Log Ledger), Rule 16 (Git Metadata: `aiprincekumar`), Rule 21 (Zero-Scan Boot Protocol), Rule 22 (`temp_prompt/` Phase Execution & Cleanup Management), and Rule 23 (Mandatory Stage-by-Stage Memory Synchronization & Zero-Scan State Preservation via `memory-sync-sentinel`). |  

---

## 🏛️ Architectural Separation Boundary (HOW vs WHAT)

| Boundary Aspect | `GEMINI.md` (Operational Standard) | `memory.md` (Technical Dossier) |
| :--- | :--- | :--- |
| **Domain Scope** | **HOW the AI Agent behaves & operates** | **WHAT the software project contains & implements** |
| **Core Responsibilities** | CEO delegation model, Universal Rules 1–23 (including Rule 22 `temp_prompt/` & Rule 23 `memory-sync-sentinel`), Changes Log audit (Rule 6), Git commit standards, verification protocols. | Architecture modules 1–16, 35 cursors, audio synth, on-device AI worker, 42+ test suites, file entry points, roadmap. |
| **Governance Role** | Agent constitution & operational enforcement. | System blueprint, state of implementation, code inventory. |
| **Referenced Path** | [`GEMINI.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/GEMINI.md) | [`memory.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/memory.md) |

---

# ═════════════════════════════════════════════════════════════════════
# LAYER 1: PROJECT SNAPSHOT & TECH STACK BLUEPRINT
# ═════════════════════════════════════════════════════════════════════

## 1.1 Project Mission & Identity
The **Interactive Cursor-Tracking Portfolio** is a high-performance web platform built for **Atul Verma**. It unifies interactive 120 FPS physics, canvas kinematics, procedural sound synthesis, and on-device machine intelligence into a single showcase across **5 unified professional roles**:

1. **Overview / Executive Controller:** Broad-spectrum portfolio overview for executives, partners, and cross-functional teams.
2. **Accountant & Tax Consultant:** 7+ years accounting expertise (TallyPrime, Busy, GST, ITR, TDS, ROC, double-entry audit).
3. **MIS & Analytics Specialist:** Executive reporting, automated financial dashboards, Excel VBA/macros, Power BI pipelines.
4. **Vibe Coding & AI Engineer:** Modern full-stack development, agentic workflows, WebGPU local models, React 19, Vite 8.
5. **Other / AI Generalist:** Specialized multidisciplinary projects, prompt engineering, and hybrid enterprise solutions.

## 1.2 Core Technology Stack Blueprint

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT BROWSER (MAIN THREAD)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  React 19.2.8 + Tailwind CSS v4.3.3 + Vite 8.3.0 Bundler                    │
│  ├── Context Layer: RoleContext, LabContext, HighContrast, SimpleMode       │
│  ├── Presentation: 16 UI Architecture Modules, 5-Track Role Switcher        │
│  ├── 120 FPS Kinematics: RequestAnimationFrame loop (zero per-frame DOM reads)│
│  ├── Procedural Audio: Web Audio API (Oscillators, BiquadFilter, PannerNode)│
│  └── Offline GIS: Leaflet 1.9.4 with local tile cache & dark GPU shader      │
└───────────────┬─────────────────────────────────────────────┬───────────────┘
                │ MessageChannel / Web Worker API             │ Fallback RAG
                ▼                                             ▼
┌───────────────────────────────────────┐   ┌─────────────────────────────────┐
│     WEB WORKER (aiModelWorker.js)     │   │  portfolioAssistantEngine.js    │
├───────────────────────────────────────┤   ├─────────────────────────────────┤
│ @huggingface/transformers 4.3.1       │   │ Deterministic Offline Fallback  │
│ ├── WebGPU Pipeline (q4f16)           │   │ 450+ Knowledge Vectors          │
│ ├── WASM Pipeline Fallback            │   │ Multi-Turn Context Memory       │
│ └── Conservative 3-Tier Quantization  │   │ Zero Network Dependency         │
│     (SmolLM-135M / Qwen-0.5B / 1.5B)  │   │ Instant Sub-Millisecond Return  │
└───────────────────────────────────────┘   └─────────────────────────────────┘
```

| Technology | Version | Architectural Role | Key Capabilities & Justification |
| :--- | :--- | :--- | :--- |
| **React** | `19.2.8` | Core UI Library | Concurrent rendering, Suspense boundaries, strict state separation, zero-churn RAF hooks. |
| **Vite** | `8.3.0` | Build Tool & Bundler | Sub-second HMR, 6 isolated vendor chunks (`vendor-react`, `vendor-leaflet`, `vendor-jszip`, etc.). |
| **Tailwind CSS** | `4.3.3` | Styling Engine | Modern CSS engine, custom token variables, scoped modes (`simple-mode.css`, `high-contrast.css`). |
| **@huggingface/transformers** | `4.3.1` | On-Device Neural LLM | Browser ONNX transformer runtime, WebGPU acceleration, 3-tier quantization, zero cloud API costs. |
| **Web Audio API** | Native | Procedural Synthesizer | Zero-latency algorithmic audio generation, ADSR gain envelopes, spatial stereo panning, zero `.mp3` assets. |
| **Leaflet** | `1.9.4` | Offline Hybrid GIS | Medininagar, Jharkhand HQ map, offline tile caching, cyberpunk GPU canvas filter. |
| **JSZip** | `3.10.2` | Media Archiver | In-browser zero-server zip packing for Polaroid photo album downloads. |
| **Canvas-Confetti** | `1.9.4` | Visual Physics | Celebratory particle explosions upon photo captures and credential verification. |
| **Lucide React** | `1.54.0` | Vector Iconography | Tree-shaken SVG icon system across all navigation, studio, and HUD controls. |
| **Oxlint** | `1.81.0` | Static Analysis | Rust-based ultra-fast linter enforcing clean syntax and code hygiene across 70+ files. |
| **Playwright** | `1.64.1` | Headless Verification | End-to-end browser autoscroll testing validating 100% layout and interactive stability. |

---

# ═════════════════════════════════════════════════════════════════════
# LAYER 2: PRODUCTION INVENTORY STATUS (IMPLEMENTED VS PENDING) & QUICK FILE ENTRY POINTS
# ═════════════════════════════════════════════════════════════════════

## 2.1 Implemented Features Matrix (`[x]`)

- [x] **16 Complete Architecture Modules:** Modular UI ecosystem covering Layout, Hero 2.5D stage, Custom Cursors, Control Studio, Accessibility, State Hooks, Terminal CLI, Case Studies, Multilingual i18n, Audience Filter, FAB Hub, FAQ, vCard/QR, Standalone Studio, On-Device AI, and Integration Capstone.
- [x] **35 Custom Cursors Across 7 Thematic Families:** Living & Nature (5), Cosmic & Magic (5), Tech & Cyberpunk (5), Playful & Vehicles (5), Elemental & Forces (5), Precision & Design (5), Arcade & Retro (5).
- [x] **Procedural Web Audio API Synthesizer:** Real-time synthesis of 8 sound events (shutter clicks, sparkles, bubble pops, laser chirps, crystal chimes, ribbon sweeps, haptic clicks, spatial pings) with stereo panning and zero external audio files.
- [x] **On-Device Local LLM AI Worker:** Dedicated Web Worker (`aiModelWorker.js`) executing Transformers.js with WebGPU acceleration, automated WASM fallback, 3-tier quantization (SmolLM-135M, Qwen-0.5B, Qwen-1.5B), and deterministic RAG backup (`portfolioAssistantEngine.js`).
- [x] **7-Tab Studio Calibration Panel:** Full-featured Control Center (`ControlCenterPanel.jsx` / `LabStudioDrawer.jsx`) with 7 calibration tabs (Audio Studio, Cursor & Dynamics, Hero & Character, Startup & Preferences, Display & Visuals, 3D Spatial & Physical Studio, and Tab 7: AI & Chat Studio), 380px slide-out drawer, standalone URL boot (`?view=control`), and certified Phase 1–7 visual physical controls.
- [x] **Interactive Hybrid GIS Map:** Tile-cached Leaflet.js map centered on Medininagar, Jharkhand with cyberpunk GPU hardware dark filter and interactive office marker.
- [x] **WCAG 2.1 AAA Accessibility Engine:** High-Contrast Mode (`Alt+H`, luminance $\ge 7:1$, zero glassmorphism), Simple Reading Mode (`Alt+S`), dual ARIA Live polite/assertive announcers, and strict focus traps (`useFocusTrap`).
- [x] **Developer Terminal CLI:** Multi-OS developer console (`TerminalCLI.jsx`) supporting macOS Sonoma, Windows 11 Fluent, and Ubuntu Jammy themes with CRT scanlines, matrix rain, and 20+ interactive commands.
- [x] **42+ Verification Test Suites (58 Test Harnesses):** 100% automated test coverage in `scripts/` validating layout density, audio synthesis, kinematics, terminal commands, AI fallback cascades, and refresh resilience.
- [x] **Mandatory Rule 6 Changes Log Audit System:** Multi-tiered logging across summary, master index, daily ledgers, and granular entries with before/after diffs and rollback steps.
- [x] **5-Track Professional Role Engine:** Synchronized career tracks with URL query params (`?role=...`), `localStorage` persistence, and window event bus.
- [x] **Dynamic Polaroid Photo Roll & JSZip Export:** In-browser canvas photo captures with 1-click zipped archive downloads (`polaroidExport.js`).
- [x] **40-Item Bilingual FAQ System:** Searchable and category-filtered accordion FAQ with automated Schema.org `FAQPage` JSON-LD injection for rich search indexing.
- [x] **RFC 6350 vCard & Pure SVG QR Engine:** Client-side dynamic QR generation and contact card export (`vcardGenerator.js`) with zero network API reliance.
- [x] **Audience Persona Filter & View Mode Switcher:** 4 tailored visitor perspectives (All, Recruiter, Client, Matrimonial) and 4 presentation tiers (Basic/PDF, Simple, Modern, CLI).

## 2.2 Pending & Engineering Roadmap (`[ ]`)

- [ ] **ServiceWorker Offline PWA Pre-caching:** Register a service worker with CacheStorage strategy to cache static assets, icons, and map tiles for zero-connection offline PWA loading.
- [ ] **Ambient WebGL 2.0 Fragment Shader Stage:** Optional GPU canvas backdrop with fluid metaballs or starfield turbulence toggleable in Lab Studio.
- [ ] **Web Speech Voice Input (STT) for AI Chat:** Integrate browser SpeechRecognition API to permit two-way voice conversations with the on-device AI assistant.
- [ ] **Client-Side WASM Image EXIF Privacy Stripper:** Pure WASM image processing to scrub GPS and camera metadata prior to Polaroid photo packing.
- [ ] **WebRTC Collaborative Multi-Cursor Flocking:** Experimental peer-to-peer data channel mesh for collaborative real-time cursor presence between visitors.

---

## 2.3 Quick File Entry Points (Incoming Developer Directory)

| Subsystem Domain | Primary File(s) to Inspect / Edit | Secondary / Supporting Config | Architectural Responsibility |
| :--- | :--- | :--- | :--- |
| **Main App Shell** | [`src/App.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/App.jsx) | [`src/main.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/main.jsx) | Root mounting, context providers, layout structure, lazy loading |
| **Top Navigation** | [`src/components/Navbar.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/Navbar.jsx) | [`src/components/RoleTabsBar.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/RoleTabsBar.jsx) | Role switching, scroll progress bar, search modal, resume downloads |
| **Hero & 2.5D Stage** | [`src/components/HeroSection.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/HeroSection.jsx) | [`src/hooks/useDraggableCharacter.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/hooks/useDraggableCharacter.js) | Gaze tracking (10 poses), draggable avatar, camera flash, social dock |
| **Custom Cursors** | [`src/components/DynamicCursorManager.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/DynamicCursorManager.jsx) | [`src/components/cursors/kinematicProfiles.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/cursors/kinematicProfiles.js) | Active cursor lifecycle, 35 kinematic profiles, canvas particle pools |
| **Procedural Audio** | [`src/utils/audio.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/utils/audio.js) | [`src/utils/soundEffects.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/utils/soundEffects.js) | AudioContext synthesizer, ADSR gain envelopes, spatial stereo panner |
| **On-Device AI Worker** | [`src/workers/aiModelWorker.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/workers/aiModelWorker.js) | [`src/services/localAIService.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/services/localAIService.js) | Transformers.js WebGPU/WASM pipeline, hardware tiering, token stream |
| **AI Fallback RAG** | [`src/utils/portfolioAssistantEngine.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/utils/portfolioAssistantEngine.js) | [`src/utils/portfolioContextMemory.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/utils/portfolioContextMemory.js) | Deterministic keyword vector index, multi-turn chat memory, model attribution |
| **Chat Widget UI** | [`src/components/AIChatWidget.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/AIChatWidget.jsx) | [`src/utils/deviceProfiler.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/utils/deviceProfiler.js) | Docked bottom drawer, audio feedback, file drop, model indicator, header gear shortcut to Tab 7, download consent dialog |
| **Control Center** | [`src/components/ControlCenterPanel.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/ControlCenterPanel.jsx) | [`src/components/LabStudioDrawer.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/LabStudioDrawer.jsx) | 7 calibration tabs (including Tab 7 AI & Chat Studio), standalone view (`?view=control`), Phase 1–7 controls |
| **Terminal CLI** | [`src/components/TerminalCLI.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/TerminalCLI.jsx) | [`src/data/caseStudiesData.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/data/caseStudiesData.js) | macOS/Win11/Ubuntu OS switcher, CRT scanlines, 20+ executable commands |
| **Offline GIS Map** | [`src/components/LeafletOfflineMap.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/LeafletOfflineMap.jsx) | [`src/components/ContactSection.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/ContactSection.jsx) | Leaflet map container, local tile loading, cyberpunk GPU dark canvas filter |
| **Accessibility (A11y)**| [`src/context/HighContrastContext.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/context/HighContrastContext.jsx) | [`src/styles/high-contrast.css`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/styles/high-contrast.css) | WCAG AAA 7:1 contrast, Alt+H listener, zero glassmorphism, focus traps |
| **Simple Reading Mode** | [`src/context/SimpleModeContext.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/context/SimpleModeContext.jsx) | [`src/styles/simple-mode.css`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/styles/simple-mode.css) | Particle cursor unmounting, clean typography, Alt+S shortcut |
| **Role & Track State** | [`src/context/RoleContext.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/context/RoleContext.jsx) | [`src/data/testimonialsData.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/data/testimonialsData.js) | 5-role active state, URL search param resolution, track filtering |
| **Lab & Visual State** | [`src/context/LabContext.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/context/LabContext.jsx) | [`src/styles/index.css`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/styles/index.css) | Dynamic CSS variable injection, multi-tab sync, 3D spatial settings |
| **Phase Staging (Rule 22)** | [`temp_prompt/README.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/temp_prompt/README.md) | `temp_prompt/<task>/INDEX.md` | Ephemeral prompt execution staging, phase decomposition, auto-cleanup protocol |
| **Phase Architect Skill** | [`.agents/skills/phase-prompt-architect/SKILL.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/.agents/skills/phase-prompt-architect/SKILL.md) | `phase_prompt_architect` agent | Master skill protocol for structuring, tracking, and pruning phase prompt documents |
| **Memory Sentinel Skill (Rule 23)** | [`.agents/skills/memory-sync-sentinel/SKILL.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/.agents/skills/memory-sync-sentinel/SKILL.md) | `memory_sync_sentinel` agent | Continuous two-tier Section 0 sync, parallel aggregation, failure logging & zero-scan state preservation |
| **Verification & Tests**| [`scripts/run_all_tests.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/run_all_tests.mjs) | [`package.json`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/package.json) | 58 test harnesses, Oxlint linter, Playwright autoscroll |

---

# ═════════════════════════════════════════════════════════════════════
# LAYER 3: GRANULAR 16-MODULE INVENTORY & ASSET BREAKDOWN
# ═════════════════════════════════════════════════════════════════════

### 🏛️ Module 1: Core Layout, UI Sections & Navigation Matrix
- **Top Navbar ([`Navbar.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/Navbar.jsx)):** Responsive sticky navigation with 2.5px gradient `ScrollProgressBar`, role-aware avatar switcher (`Overview.jpg`, `Accountant.jpg`, `MIS.jpg`, `VibeCoder.jpg`, `Others.jpg`), dynamic `RolePill`, search trigger (`Ctrl+K`), cursor switcher pill, role-specific resume split-button, simple mode toggle, and mobile drawer with strict focus containment.
- **Hero Stage ([`HeroSection.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/HeroSection.jsx)):** 2.5D cursor-tracking character stage featuring 10 distinct gaze poses (00-Rear View to 09-Lower Right), Hermite spline pose crossfading, draggable character hook ([`useDraggableCharacter.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/hooks/useDraggableCharacter.js)) with harmonic oscillation decay, 0.5x–2.0x zoom HUD with anchor focus points (Head, Center, Feet), "Shoot a Look 📸" camera flash whiteout with confetti, and 7-brand social dock.
- **Tech Marquee Banner ([`TechMarqueeBanner.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/TechMarqueeBanner.jsx)):** Dual diagonal ribbons with animated butterfly delimiters (🦋), interactive tooltip chips with auto-scroll to skills, and `IntersectionObserver` pause culling to eliminate off-screen GPU compositing (>220 DOM nodes pruned).
- **About Section ([`AboutSection.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/AboutSection.jsx)):** 3 tabs ('Story & Vision', 'Qualifications', 'Official Bio-Data'), 4-track competency pillars, 1-click clipboard bio-data copy, and direct CV download triggers.
- **Skills Matrix ([`SkillsSection.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/SkillsSection.jsx)):** 5 domain categories (Accounting & Tax, Software & Applications, Operations & Management, Specialized Aptitudes, AI Engineering) with dark preview card and animated proficiency meters.
- **Experience Section ([`ExperienceSection.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/ExperienceSection.jsx)):** Chronological career milestones (2017–Present, 7+ years), dynamic track highlighting, and expandable deliverable cards.
- **Projects Section ([`ProjectsSection.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/ProjectsSection.jsx)):** 9 enterprise project showcases featuring interactive live simulators: `PolicyGuard AI` (GST & tax audit simulator) and `ApexPay` (BRS double-entry ledger reconciliation).
- **Achievements Section ([`CodingAchievementsSection.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/CodingAchievementsSection.jsx)):** Continuous running achievement tickers per role (7+ years, zero statutory penalties, 500+ returns).
- **Testimonials Section ([`TestimonialsSection.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/TestimonialsSection.jsx)):** Dynamic category tabs ('Accounting & Tax', 'MIS', 'Full-Stack'), star ratings, and verified stakeholder endorsement badges.
- **Explore Sub-Bar ([`ExploreSubBar.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/ExploreSubBar.jsx)):** 3 visual variants (`floating-bar`, `dock`, `pill-strip`), roving keyboard focus, and quick triggers for AI chat, case studies, quote calculator, and control center.
- **Role Tabs Bar ([`RoleTabsBar.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/RoleTabsBar.jsx)):** 6 layout styles (`section`, `navbar`, `mobile-header`, `drawer`, `floating-bar`, `sub-bar`) with automatic `scrollIntoView({ inline: 'center' })` on resize.
- **Contact Hub ([`ContactSection.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/ContactSection.jsx)):** 4 specialized tabs: 'Get in Touch' (validated inquiry form), 'Quotation Estimator' (cost/timeline calculator), 'Direct Details' (24-hour time-gated bot protection `portfolio_contact_unlocked`), and 'Location & Office' (Medininagar GIS map).
- **Footer ([`Footer.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/Footer.jsx)):** 14vw responsive 'ATUL VERMA' background watermark branding, social profile grid, and legal copyright metadata.
- **Credential Lightbox Modal ([`CredentialLightboxModal.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/CredentialLightboxModal.jsx)):** Forensic credential inspection for degrees and certifications with gold seal, 1-click verification ID copy, and WCAG AAA focus trap.
- **Section Skeleton ([`SectionSkeleton.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/SectionSkeleton.jsx)):** 5 zero-CLS layout placeholders preserving exact DOM geometry during async module chunk loading.

### 🦋 Module 2: Custom Cursor System & Kinematics Engine
- **Dynamic Cursor Manager ([`DynamicCursorManager.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/DynamicCursorManager.jsx)):** Single-active loop discipline (only the selected cursor is mounted; 34 remaining cursors unmount to guarantee 0% idle CPU/GPU overhead).
- **Pointer & Safety Guards:** Auto-deactivates on touch/coarse devices ([`useDesktopCursorSupport.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/hooks/useDesktopCursorSupport.js)) and `prefers-reduced-motion: reduce`. Automatically shut off in Simple Mode.
- **Kinematic Physics Equations:**
  - *Exponential Smoothing:* $P_{t} = P_{t-1} + (P_{\text{target}} - P_{t-1}) \cdot (1 - e^{-\lambda \cdot \Delta t})$ where $\lambda \in [0.15, 0.35]$.
  - *Shortest-Arc Heading:* $\theta = \text{atan2}(\Delta y, \Delta x)$, wrapped via $(\theta_{\text{target}} - \theta + \pi \pmod{2\pi}) - \pi$.
  - *Aerodynamic Banking Roll:* $\phi = \text{clamp}(v_x \cdot \kappa, -32^\circ, +32^\circ)$.
- **Additive Canvas Particle Pool:** HTML5 Canvas 2D with `'lighter'` compositing, fixed memory allocation (`MAX_PARTICLES = 60-70`), and zero garbage collection pauses.

### 🎛️ Module 3: Lab Studio Calibration & Certified Physical Controls
- **Control Center Studio ([`ControlCenterPanel.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/ControlCenterPanel.jsx) & [`LabStudioDrawer.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/LabStudioDrawer.jsx)):** 7 calibration tabs:
  1. *Audio Studio:* Master volume, pitch multiplier (0.5x–2.0x), sound mode toggle, and 7-button tactile soundboard.
  2. *Cursor & Dynamics:* Scale (0.5x–2.0x), flight speed (Dreamy 0.08, Natural 0.14, Snappy 0.24), trail switches, and particle color chips.
  3. *Hero & Character:* Gaze mode, pose overrides (10 poses), character zoom (0.5x–2.0x), focus anchors, draggable toggle, and parallax tilt.
  4. *Startup & Preferences:* Default role on boot, default cursor, default audio state, and motion controls.
  5. *Display & Visuals:* Dark/light mode, high-contrast switch, layout density (Compact 0.8x, Comfortable 1.0x, Spacious 1.25x), glassmorphism blur, and UI motion speed.
  6. *3D Spatial & Physical Studio:* 3D master switch, depth intensity (0.2x–2.5x), presets (Subtle, Dramatic, Isometric), and interactive 3D sandbox.
  7. *AI & Chat Studio (`id: 'chat'`):* 5 interactive feature clusters:
     - *Cluster 1 (Model & Engine):* Tier selector (Auto, 0MB Deterministic RAG, SmolLM-135M, Qwen-0.5B, Qwen-1.5B), Load trigger (On-Demand [Default], On Page Load, On Open, Manual), Download consent mode (Always Ask [Default], Auto Confirm, Wi-Fi Only), WebGPU/WASM override, and cache purge.
     - *Cluster 2 (Generation Controls):* Token streaming toggle, Temperature slider (0.0 to 1.2), Max tokens slider (128 to 1024), Persona tone chips.
     - *Cluster 3 (Voice & Sound Studio):* Speech synthesis (TTS) toggle, voice selector dropdown, pitch & rate sliders with reset button, audio haptics switch.
     - *Cluster 4 (Privacy & Storage Tools):* Session retention selector (Tab Session, 7 Days, 30 Days, Ephemeral), 1-click purge chat history modal, JSON/Markdown export trigger.
     - *Cluster 5 (UI & Ergonomics):* Docking size chips (compact, normal, expanded, fullscreen), auto-greet switch, suggestion chips switch, slash commands switch.
- **Certified Phase 1–7 Controls:**
  - *Phase 1:* 360° Circular Orbital Sun Compass with 8-point cardinal navigation and live inverted shadow vector.
  - *Phase 2:* 4 Photo-Realistic 3D Material Shader Orbs (Glass Acrylic, Metallic Gloss, Neumorphic Clay, Cyber Wireframe).
  - *Phase 3:* Interactive Mini Portfolio Layout 3D Blueprint Wireframe & Batch HUD chips.
  - *Phase 4:* 3D Isometric Strata Stack Diagram with exploded Z-axis separation and CAD depth callouts.
  - *Phase 5:* Spring Elasticity Oscillation Graph with real-time harmonic decay waveform ($x(t) = e^{-\zeta \omega_n t} \cos(\omega_d t)$) and tactile "Tap to Test" pad.
  - *Phase 6:* 3D Spatial Audio Soundfield Radar with polar acoustic reflections and dual-oscillator spatial pings.
  - *Phase 7:* 380px Drawer Ergonomics with touch steppers and 2x2 segmented glass action toolbar.

### ♿ Module 4: Accessibility, Theme & User Controls
- **WCAG 2.1 AAA Architecture:** Skip to Main Content link (`#main-content`), dual ARIA Live polite and assertive regions ([`AnnouncerContext.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/context/AnnouncerContext.jsx)), focus trapping ([`useFocusTrap.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/hooks/useFocusTrap.js)), and body scroll locking ([`useBodyScrollLock.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/hooks/useBodyScrollLock.js)).
- **High-Contrast Mode ([`HighContrastContext.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/context/HighContrastContext.jsx) & [`high-contrast.css`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/styles/high-contrast.css)):** Strict luminance ratio $\ge 7.0:1$ for text and $\ge 4.5:1$ for borders, zero glassmorphism blur, solid black/white palette, and global `Alt+H` shortcut.
- **Simple Reading Mode ([`SimpleModeContext.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/context/SimpleModeContext.jsx) & [`simple-mode.css`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/styles/simple-mode.css)):** Stripped-back reading experience deactivating canvas particles, marquee ribbons, 3D tilt, and heavy animations. Global `Alt+S` shortcut.
- **Spotlight Command Palette ([`CommandPalette.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/CommandPalette.jsx)):** `Ctrl+K` / `Cmd+K` trigger, Levenshtein fuzzy search with 60+ typo alias mappings ([`fuzzySearch.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/utils/fuzzySearch.js)), keyword highlighting, and recent query persistence.

### ⚙️ Module 5: State Management, Hooks, Audio Engine & Core Utilities
- **Role Context ([`RoleContext.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/context/RoleContext.jsx)):** 5 professional tracks, 3-tier resolution priority (URL query -> LocalStorage -> Control Center -> default), URL pushState/replaceState sync, and browser `popstate` support.
- **Lab Context ([`LabContext.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/context/LabContext.jsx)):** Master configuration store, dynamic CSS variable injector (`--glass-blur`, `--motion-speed-mult`, `--density-*`), self-healing MutationObserver, and multi-tab storage anti-echo synchronization.
- **Web Audio Procedural Engine ([`audio.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/utils/audio.js) / [`soundEffects.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/utils/soundEffects.js)):** Procedural sound generation without audio files:
  - Shutter click: 800Hz $\rightarrow$ 200Hz sweep + 60ms white-noise burst.
  - Cosmic sparkle: 4-note pentatonic scale arpeggio (1200Hz, 1500Hz, 1800Hz, 2400Hz).
  - Bubble pop: Fast downward frequency plunge (600Hz down to 120Hz over 45ms).
  - Laser focus: Dual-chirp digital pulse (880Hz to 1760Hz in 25ms).
  - Crystal chime: Harmonic chord (C5 523Hz, E5 659Hz, G5 783Hz, C6 1046Hz) with 450ms exponential decay.
  - Spatial ping: Dual harmonic ping (880Hz + 1320Hz) routed through `StereoPannerNode` with acoustic reverberation decay.
  - Haptic click: 120Hz sine pop (8ms) creating an authentic physical tactile sensation.

### 🚀 Module 6: Build, Performance & Z-Index Layer Hierarchy
- **Vite 8 & Rollup Code Splitting:** 6 isolated vendor chunks (`vendor-react`, `vendor-leaflet`, `vendor-jszip`, `vendor-confetti`, `vendor-lucide`, `data-case-studies`), keeping core bundle under 465 kB.
- **Dynamic Lazy Loading ([`lazyWithRetry.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/utils/lazyWithRetry.js)):** Automated chunk reload retry on network packet drops, paired with `SectionSkeleton` to guarantee Cumulative Layout Shift (CLS) = 0.
- **Z-Index Layer Hierarchy:**
  - `z-0` to `z-30`: Base page sections and backdrop decorations
  - `z-40`: Section headers and sticky navigation elements
  - `z-50`: Top Navbar and active role indicator
  - `z-[60]`: Centralized Floating Action Hub (container `pointer-events-none`, controls `pointer-events-auto`)
  - `z-[70]`: Back to Top Floating Button
  - `z-[80]`: Slide-out Drawers (Lab Studio, Case Studies) and Terminal CLI Modal
  - `z-[85]`: Docked AI Chat Station
  - `z-[90]`: Credential Lightbox Modal & Spotlight Command Palette
  - `z-[100]`: System Toast Notifications & Critical Safety Overlays

### 💻 Module 7: Developer Terminal CLI & Power Pack System
- **Multi-OS Terminal ([`TerminalCLI.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/TerminalCLI.jsx)):** Tri-OS desktop switcher (macOS Sonoma, Windows 11 Fluent, Ubuntu Jammy).
- **Visuals & Effects:** Authentic CRT scanlines, matrix digital rain background, adjustable console opacity, and 15+ terminal themes.
- **Command Power Pack:** 20+ executable interactive commands including `neofetch`, `skills`, `projects`, `exp`, `contact`, `whoami`, `cat`, `cowsay`, `weather`, `clear`, `help`, `mode`, `theme`, and `exit`.

### 📊 Module 8: Interactive Case Studies & Telemetry Simulators
- **5-Stage Storytelling Dossier ([`CaseStudyDrawer.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/CaseStudyDrawer.jsx)):** 9 enterprise project deep dives covering Context & Challenge, Architectural Solution, Implementation Blueprint, Measurable Impact & Telemetry, and Key Takeaways.
- **Visual Flowcharts & Simulators ([`CaseStudySimulator.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/CaseStudySimulator.jsx)):** 4-tier visual process flowcharts and interactive telemetry simulators with live metric adjustment sliders and JSON export.
- **URL Deep Linking:** Automatic `?project=<id>` URL sync allowing direct linking to specific project dossiers.

### 🌐 Module 9: Multilingual Localization & Translation System
- **Bilingual Dictionary ([`LanguageContext.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/context/LanguageContext.jsx)):** 450+ keys supporting seamless English (EN) and Hindi (HI) switching.
- **Screen Reader Coordination:** Integrated with WAI-ARIA live announcers to read localized updates.
- **Hybrid Keyword Preservation:** Preserves standard technical terminology (React, Tally, GST, API, WebGPU) during Hindi localization for clarity.

### 🎯 Module 10: Audience Persona Filter & View Mode Engine
- **Audience Persona Filter ([`AudienceFilterBar.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/AudienceFilterBar.jsx)):** 4 tailored visitor perspectives:
  1. *All:* Comprehensive balanced presentation
  2. *Recruiter:* Highlight qualifications, core skills, certifications, and resume downloads
  3. *Freelance Client:* Emphasize delivered projects, quotation calculator, and turnaround times
  4. *Marriage / Matrimonial:* Focused bio-data, academic pedigree, family background, and personal values
- **View Mode Presentation Switcher ([`ViewModeSwitcher.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/ViewModeSwitcher.jsx)):** 4 distinct portfolio display tiers:
  1. *Basic / PDF:* Printer-friendly, stripped-back layout for formal review
  2. *Simple / Classic:* Lightweight text-first mode with zero canvas particles or 3D tilt
  3. *Modern / Interactive:* Default flagship experience with 120 FPS kinematics and soundscapes
  4. *Terminal / Developer:* Hacker aesthetic with CRT console styling and CLI prompts

### 🛸 Module 11: Floating Action Hub & Master Speed-Dial FAB
- **Master Speed-Dial FAB ([`FloatingActionHub.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/FloatingActionHub.jsx)):** Radial speed-dial action menu providing access to Lab Studio, View Mode, Audience Persona, AI Chat, Simple Mode, and WhatsApp.
- **Collision Avoidance:** Automatic lateral gliding (`sm:right-[460px]`) when drawers expand to prevent UI collisions. Container uses `pointer-events-none` with interactive child elements on `pointer-events-auto`.

### ❓ Module 12: 40-Item FAQ System & Schema.org JSON-LD
- **40-Item FAQ Knowledgebase ([`FAQSection.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/FAQSection.jsx), [`faqConfig.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/data/faqConfig.js)):** 2-layer matrix filtering (Audience Persona & Role Track), live keyword search bar, category chips, and tactile accordion sounds.
- **Structured Data:** Injects Schema.org `FAQPage` JSON-LD structured metadata for rich Google search snippets.

### 💳 Module 13: Digital Business Card, vCard, QR & Quotation Estimator
- **Pure SVG Dynamic QR Engine ([`vcardGenerator.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/utils/vcardGenerator.js)):** Generates high-contrast dynamic QR codes entirely client-side without third-party network APIs.
- **RFC 6350 vCard Generator:** 1-click `.vcf` file generation containing complete contact details, social links, and skills.
- **In-Tab Quotation Estimator:** 3-track pricing estimator (Accounting, MIS, Web/AI) with project volume sliders, urgency multipliers, and direct WhatsApp pre-fill actions.

### 🖥️ Module 14: Standalone Fullscreen Control Center Studio & Deep Linking
- **Standalone Studio Architecture ([`ControlCenterPanel.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/ControlCenterPanel.jsx)):** Direct URL boot via `?view=control` or `?panel=control`. Unmounts heavy page sections (Hero stage, 3D particles, Project cards) for instantaneous studio loading in isolated environments.
- **Two-Tier Studio Modes:** Supports `mode=all` (full 6-tab calibration studio) and `mode=single` (isolated single subsystem view, e.g. 3D Spatial only).
- **Cross-Tab Synchronization:** Bidirectional sync using `localStorage` and `storage` event listeners.

### 🧠 Module 15: On-Device Local LLM AI Engine & Hardware Profiler
- **Client-Side Hardware Profiler ([`deviceProfiler.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/utils/deviceProfiler.js)):** Zero-permission hardware auditing (CPU logical cores, GPU vendor and renderer via WebGL, device memory in GB, touch capability). Runs a 50ms deterministic micro-benchmark ($10^6$ math iterations) to measure single-thread throughput.
- **Conservative 3-Tier Allocation Logic:**
  - *Tier 3 (High-End):* $\ge 8$ cores, $\ge 8$ GB RAM, WebGPU available $\rightarrow$ **Qwen-1.5B-Instruct** (`onnx-community/Qwen2.5-1.5B-Instruct`, q4f16)
  - *Tier 2 (Balanced):* 4–8 cores, 4–8 GB RAM $\rightarrow$ **Qwen-0.5B-Instruct** (`onnx-community/Qwen2.5-0.5B-Instruct`, q4)
  - *Tier 1 (Constrained/Mobile):* $< 4$ cores or $< 4$ GB RAM $\rightarrow$ **SmolLM-135M-Instruct** (`HuggingFaceTB/SmolLM-135M-Instruct`, q4)
- **Isolated Web Worker Pipeline ([`aiModelWorker.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/workers/aiModelWorker.js)):** Background model loading, token generation, and streaming with zero main-thread UI drops.
- **Single Model Memory Mutex & Immediate Preemption:**
  - *Monotonic Session Tracking:* Every load allocates `currentLoadSessionId++`. All worker messages carry `sessionId` and messages from superseded sessions are silently rejected.
  - *Immediate Worker Termination:* `terminateAndRespawnWorker()` immediately terminates active Web Worker threads on competing load commands or `turnOffAI()`, purging in-flight HTTP streams and WebGPU/WASM buffers.
  - *Strict Single Model In RAM Invariant:* Exactly ONE model pipeline exists in memory at any point; commands are never silently dropped (`if (isLoading) return` eradicated).
- **Progress-Aware Heartbeat Watchdog:**
  - *Adaptive Heartbeat:* Dedicated `armProgressWatchdog`, `resetWatchdogHeartbeat`, and `clearWatchdog` methods. As long as download bytes advance (`loaded > lastLoadedBytes` or `progress > lastProgressPercent`), the 10-second timer automatically resets, preventing false timeouts during large downloads (>15s).
  - *Stall Detection:* If transfer stalls for 10 continuous seconds with 0 progress, triggers cascading downgrade ladder (`handleModelDowngrade` with `'timeout_watchdog_stalled'`).
  - *Compilation Grace Window:* Grants an extended 15-second budget (`compilationWatchdogMs = 15000`) once download reaches 100% or when loading from IndexedDB cache to allow WebGPU shader compilation.
- **Trigger De-duplication & Coordination:**
  - *State Guards:* `App.jsx` background preload and `AIChatWidget.jsx` drawer open effects verify `status === 'idle'`, `!activeModel`, `!downloadingModel`, and `!isModelLoading` before triggering `initSilentDownload()`.
  - *Debounced Switcher:* Model switcher chips in `AIChatWidget.jsx` debounce clicks (250ms), cancel prior timers, ignore clicks on already active/downloading models, and render disabled states with accessible `aria-disabled`.
- **Model Attribution Badges:** Messages tagged with `[SmolLM-135M]`, `[Qwen-0.5B]`, `[Qwen-1.5B]`, or `[Portfolio-Engine]`.

### 🛡️ Module 16: Master AI Chat Enhancement & Capstone System Integration Suite
- **Phases 1 to 8 System Capabilities:**
  - *Phase 1:* Hardware Profiler & Tiering Matrix (`deviceProfiler.js`)
  - *Phase 2:* Dedicated On-Device Web Worker Pipeline (`aiModelWorker.js`)
  - *Phase 3:* Multimodal Vision & File Attachment Pipeline (drag-and-drop, PDF/text parsing)
  - *Phase 4:* Docked Chat Station UI & Ergonomics ([`AIChatWidget.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/AIChatWidget.jsx))
  - *Phase 5:* Text-to-Speech Voice Output & Audio Engine integration
  - *Phase 6:* Conversational Context Memory ([`portfolioContextMemory.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/utils/portfolioContextMemory.js)) & Local RAG ([`portfolioAssistantEngine.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/utils/portfolioAssistantEngine.js))
  - *Phase 7:* WebGPU Context Recovery Watchdog & Graceful Fallback Cascade
  - *Phase 8:* Master Capstone Integration & Verification Suite ([`scripts/verify_phase8_chat_integration.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_phase8_chat_integration.mjs))
  - *Phase 12: AI & Chat Studio Settings Tab & Download Consent Engine:*
    - 7th Tab in `ControlCenterPanel.jsx` / `LabStudioDrawer.jsx` (`id: 'chat'`).
    - 5 Feature Clusters: Model & Execution Engine, Generation Controls, Voice & Sound Studio, Privacy & Storage Tools, UI & Ergonomics.
    - Quick-Launch Gear Shortcut in `AIChatWidget.jsx` header.
    - Accessible On-Device Model Download Confirmation Modal (`role="dialog"`) with fallback to 0MB deterministic offline RAG engine.
    - Bi-directional state management in `LabContext.jsx` with storage key `portfolio_ai_chat_settings` and `ai-chat-settings-changed` CustomEvent broadcast.
    - Automated Verification Suite ([`scripts/verify_chat_settings_tab.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_chat_settings_tab.mjs)) passing 43/43 assertions (Grade A+).
  - *Phase 13: Chat UI Resilience, Streaming Parameter Fix, Error Boundary Self-Healing & Suggestion Drawer Deduplication:*
    - Parameter Scoping Invariant: Enforced `messages.map((msg, idx) => ...)` in `AIChatWidget.jsx`, ensuring `idx === messages.length - 1` is valid during token streaming and pulsing cursor rendering with zero ReferenceErrors.
    - Resilient Error Boundary Recovery: `ErrorBoundary.jsx` intercepts `name === 'AIChatWidget'` errors and presents an accessible floating recovery card (`role="alert"`) with a `"Reset / Reopen Chat (चैट रीसेट / पुनः खोलें)"` action button that invokes `handleReset()`, eliminating silent unmounting to `null`.
    - Single Source of Truth for Options: Redundant 1-column vertical button stacks removed from chat message bubbles; all interactive decision choices (audience selection, role switcher, view mode, consent prompts) piped exclusively to `<SuggestionChipsDrawer>`.
    - Composite Chip Deduplication: Handled in `<SuggestionChipsDrawer>` and `AIChatWidget` via composite fingerprint Set (`id || label.trim().toLowerCase()`).
    - Anti-Clipping Bottom Clearance: Enforced `pb-5` clearance on message history viewport preventing bubble collision with bottom composer.
    - Automated Certification: Verified via `scripts/test_reproduce_chat_bug.mjs` (0 errors, widget in DOM: true), `scripts/verify_chat_crash_fix.mjs` (3/3 PASS), `scripts/verify_chat_bubble_cleanup.mjs` (5/5 PASS), and master 58-harness regression suite under `npm test` (58/58 PASS, 100% GREEN).
  - *Phase 14: Clean, Minimal & Informative Chat Redesign (Phases 1 - 4):*
    - Quick Tools Popover Menu: Consolidated 8 scattered header icon buttons into a single minimalist `•••` icon button (`showQuickTools`), reclaiming 45px+ vertical viewport height while providing full accessible keyboard navigation (`Escape`, click outside).
    - Sub-Header Minimalism: Preserved 3 essential sub-header pills (Audience, Role Track, AI Model) with active tooltips and excised the permanent 36px rainbow Meta-Prompt strip.
    - Streamlined Inline Micro-Toolbar: Replaced bulky in-bubble option button stacks and attribution blocks with a single-row inline micro-toolbar containing formatted monospace timestamp, Copy button, TTS speech read-aloud button, Thumbs up/down rating buttons, and dynamic model badge (`msg.modelShortcut || '[Portfolio-Engine]'`).
    - Fixed Single-Row Carousel: Converted `<SuggestionChipsDrawer>` into a single-row horizontal flex carousel with category filtering tabs (`CATEGORY_TABS`) and composite Set deduplication.
    - Polished Input Dock: Integrated Sparkles Prompt Studio trigger, focus-within glow ring (`focus-within:ring-1 focus-within:ring-[#FF4D6D]/30`), and WCAG 2.1 AA 44px minimum mobile touch targets.
    - Automated Certification: Authored dedicated verification harness `scripts/verify_clean_minimal_chat.mjs` passing 6/6 tests (100% Green); full 58-harness regression suite under `npm test` passing 100% (58/58 PASS); 0 oxlint errors across 319 files; clean 1.88s production build.

---

## 🦋 3.1 All 35 Cursors Across 7 Thematic Families

| # | ID | Name | Family / Category | Emoji / Color | Kinematic Profile & Physics | Particle Trail Engine |
| :-: | :--- | :--- | :--- | :-: | :--- | :--- |
| 1 | `butterfly` | **Butterfly (तितली)** | Living & Nature | 🦋 `#FF4D6D` | Heading + 24° Bank + 3D Flutter | Pollen glow, 4-point sparkles |
| 2 | `firefly` | **Firefly (जुगनू)** | Living & Nature | ✨ `#10B981` | Organic Bob (2.5Hz) + Lissajous Drift | Bioluminescent warm embers |
| 3 | `dragonfly` | **Dragonfly** | Living & Nature | 🌿 `#06B6D4` | Heading (90° offset) + Inertia 18.0 | Water ripples, iridescent specks |
| 4 | `honeybee` | **Honeybee** | Living & Nature | 🐝 `#F59E0B` | Rapid Bob Buzz (4.8Hz) | Golden nectar droplets & pollen |
| 5 | `leaf` | **Autumn Leaf** | Living & Nature | 🍃 `#84CC16` | Pendulum Sway (2.0Hz, 28° Amp) | Floating autumn leaf fragments |
| 6 | `wand` | **Stardust Wand** | Cosmic & Magic | ⭐ `#A855F7` | Magic Tilt (-25°) + Micro-Wobble | 4-point purple & gold cosmic stars |
| 7 | `comet` | **Stellar Comet** | Cosmic & Magic | ☄️ `#EC4899` | Velocity Heading + Speed Scaling | Blazing astral tail & ion dust |
| 8 | `blackhole` | **Black Hole** | Cosmic & Magic | 🕳️ `#6366F1` | Orbital Spin (140°/s) | Gravitational vortex collapse |
| 9 | `prism` | **Crystal Prism** | Cosmic & Magic | 💎 `#8B5CF6` | Crystal Spin (45°/s) | Rainbow chromatic dispersion |
| 10 | `portal` | **Wormhole Portal** | Cosmic & Magic | 🌀 `#3B82F6` | Vortex Spin (180°/s) | Interdimensional plasma rings |
| 11 | `laser` | **Laser Pointer** | Tech & Cyberpunk | 🎯 `#DC2626` | Ultra-Snappy (Inertia 24.0) | Continuous neon laser beam ribbon |
| 12 | `matrix` | **Matrix Rain** | Tech & Cyberpunk | 💻 `#22C55E` | Fixed Cyber Terminal Grid | Cascading green binary '0'/'1' glyphs |
| 13 | `reticle` | **HUD Reticle** | Tech & Cyberpunk | 🔭 `#14B8A6` | Tactical Spin (25°/s) | Tactical HUD crosshairs & coordinates |
| 14 | `circuit` | **Nano Circuit** | Tech & Cyberpunk | ⚡ `#0EA5E9` | Conductive Vector Alignment | Microchip electrical pulse nodes |
| 15 | `drone` | **Cyber Drone** | Tech & Cyberpunk | 🛰️ `#64748B` | Tilt Heading + Aerodynamic Thrust | Quad-rotor thrust vapor trails |
| 16 | `airplane` | **Paper Airplane** | Playful & Vehicles | ✈️ `#0284C7` | Atan2 Heading + 32° Banking | Dual wingtip vapor trails |
| 17 | `rocket` | **Retro Rocket** | Playful & Vehicles | 🚀 `#EA580C` | Heading (45° offset) + Thruster Burn | Rocket exhaust flame & gray smoke |
| 18 | `ufo` | **Flying Saucer** | Playful & Vehicles | 🛸 `#10B981` | Anti-Gravity Wobble (3.2Hz, 14°) | Emerald abduction tractor beam |
| 19 | `speedster` | **Speedster Car** | Playful & Vehicles | 🏎️ `#EF4444` | Velocity Heading + 24° Drift Bank | Turbo burnout & tire skid smoke |
| 20 | `balloon` | **Hot Air Balloon** | Playful & Vehicles | 🎈 `#F43F5E` | Buoyant Thermal Bob (1.8Hz, 10px) | Burner sparks & warm embers |
| 21 | `flame` | **Fire Flame** | Elemental & Forces | 🔥 `#F97316` | Fixed Upward Burn + Velocity Stretch| Rising flame tongues & sparks |
| 22 | `frost` | **Frost Crystal** | Elemental & Forces | ❄️ `#38BDF8` | Snow Crystal Spin (30°/s) | Sub-zero blizzard snowflakes |
| 23 | `lightning` | **Lightning Bolt** | Elemental & Forces | ⚡ `#EAB308` | Ultra-Fast Snap (Inertia 25.0) | High-voltage electric arcs |
| 24 | `waterdrop` | **Water Drop** | Elemental & Forces | 💧 `#0EA5E9` | Liquid Heading + Surface Stretch | Fluid splash & concentric ripples |
| 25 | `tornado` | **Tornado Vortex** | Elemental & Forces | 🌪️ `#78716C` | Centrifugal Spin (240°/s) | Centrifugal wind vortex & dust |
| 26 | `camera` | **Camera Focus** | Precision & Design | 📷 `#D97706` | Viewfinder Panning Inertia (18.0) | Reticle brackets & golden bokeh flares|
| 27 | `minimal` | **Minimal Ring** | Precision & Design | ⚪ `#52525B` | Instant Center Dot + Spring Follower| Minimal geometric pulse rings |
| 28 | `quill` | **Quill Pen** | Precision & Design | 🪶 `#9333EA` | Calligraphic Pen Tilt (-45°) | Calligraphy ink droplets & splatters |
| 29 | `brush` | **Paint Brush** | Precision & Design | 🖌️ `#F43F5E` | Acrylic Painting Angle (-35°) | Vivid acrylic paint splatters |
| 30 | `compass` | **Drafting Compass** | Precision & Design | 📐 `#2563EB` | Radius Arc Spin (20°/s) | Engineering drafting arcs & lines |
| 31 | `ghost` | **Arcade Ghost** | Arcade & Retro | 👻 `#EC4899` | 8-Bit Floating Wavy Bob (3.0Hz) | Retro square pixel dust |
| 32 | `pacman` | **Pixel Chomp** | Arcade & Retro | 🟡 `#FACC15` | Directional Heading + Rapid Chomp | Yellow arcade pac-dots trail |
| 33 | `joystick` | **Retro Joystick** | Arcade & Retro | 🕹️ `#DC2626` | Joystick Tilt (22° Bank) | Arcade cabinet sparks & red flashes |
| 34 | `synthwave` | **Synthwave Sun** | Arcade & Retro | 🌅 `#D946EF` | 80s Retro Grid Horizon Hold | Neon purple-cyan synthwave grid lines |
| 35 | `sword` | **Pixel Sword** | Arcade & Retro | ⚔️ `#38BDF8` | Heroic Slash Heading (45° offset) | Luminous sword slash edge trail |

---

# ═════════════════════════════════════════════════════════════════════
# LAYER 4: VERIFICATION PROTOCOLS, COMMANDS & PERFORMANCE INVARIANTS
# ═════════════════════════════════════════════════════════════════════

## 4.1 Performance & Architectural Invariants

1. **Cumulative Layout Shift (CLS = 0.00):** Every asynchronously loaded chunk (`CaseStudyDrawer`, `TerminalCLI`, `LeafletOfflineMap`, `AIChatWidget`) must mount alongside a geometry-matched `SectionSkeleton` to guarantee zero layout shifts.
2. **High-Refresh Display Target (60 / 120 FPS):**
   - No `getBoundingClientRect()` calls inside `requestAnimationFrame`.
   - Kinematics engine uses delta-time normalized exponential lerp physics.
   - Fixed pre-allocated particle pools (`MAX_PARTICLES = 60-70`) eliminate garbage collection pauses.
3. **Strict Z-Index Hierarchy:**
   - `z-0` – `z-30`: Base sections & background canvas layers
   - `z-40`: Section headers & sticky navigation
   - `z-50`: Top Navbar & active role indicator
   - `z-[60]`: Centralized Floating Action Hub (container `pointer-events-none`)
   - `z-[70]`: Back to Top Floating Controller
   - `z-[80]`: Slide-out Drawers (Lab Studio, Case Studies) & Terminal CLI Modal
   - `z-[85]`: Docked AI Chat Station
   - `z-[90]`: Credential Lightbox Modal & Spotlight Command Palette
   - `z-[100]`: System Toast Alerts & Critical Safety Overlays
4. **Single-Row Section Headings (Universal Rule 19):** Section headings and eyebrow badges must strictly remain single-row on desktop and tablet viewports.

---

## 4.2 Automated Verification Pipeline (58 Test Harnesses)

Execute the full verification suite or targeted tests via the following npm commands:

```bash
# Start local development server
npm run dev

# Run comprehensive 42+ verification test suites (58 test harnesses)
npm test

# Run targeted on-device AI test suite
npm run test:on-device-ai

# Run master Phase 8 AI chat capstone integration suite
npm run test:chat-phase8

# Run Phase 9 AI chat telemetry & streaming latency suite
npm run test:chat-phase9

# Run Playwright headless browser autoscroll verification
npm run test:e2e-autoscroll

# Run Rust-based Oxlint fast linter
npm run lint

# Build production bundle with Rollup chunk splitting
npm run build

# Preview production build locally
npm run preview
```

### Key Verification Test Harnesses in `scripts/`:

| Test Suite Script | Primary Architectural Focus | Coverage & Invariants |
| :--- | :--- | :--- |
| [`verify_gap1_orbital_sun_compass.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_gap1_orbital_sun_compass.mjs) | Phase 1: 360° Circular orbital sun compass, 8-point cardinal nav, inverted shadow | 10/10 PASS |
| [`verify_gap2_material_shader_orbs.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_gap2_material_shader_orbs.mjs) | Phase 2: 4 material shader orbs (Glass, Metallic, Clay, Wireframe), bevel chamfer | 11/11 PASS |
| [`verify_gap3_sandbox_hud.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_gap3_sandbox_hud.mjs) | Phase 3: Interactive 3D cube sandbox HUD, A/B comparison slider, expand viewport | PASS |
| [`verify_gap4_blueprint_wireframe.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_gap4_blueprint_wireframe.mjs) | Phase 3: Mini portfolio layout blueprint wireframe, 10 element toggles, batch HUD | 15/15 PASS |
| [`verify_phase4_exploded_strata.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_phase4_exploded_strata.mjs) | Phase 4: Exploded Z-axis strata stack diagram, CAD depth callouts, solo stratum | 13/13 PASS |
| [`verify_phase5_physics_pad.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_phase5_physics_pad.mjs) | Phase 5: Spring elasticity oscillation graph, harmonic decay, "Tap to Test" pad | 13/13 PASS |
| [`verify_phase6_spatial_radar.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_phase6_spatial_radar.mjs) | Phase 6: 3D spatial audio soundfield radar visualizer, dual-oscillator spatial ping | 17/17 PASS |
| [`verify_gap5_drawer_ergonomics.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_gap5_drawer_ergonomics.mjs) | Phase 7: 380px drawer ergonomics, touch steppers, 2x2 segmented glass action toolbar| 17/17 PASS |
| [`verify_threed_controls.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_threed_controls.mjs) | Master 3D spatial physical controls suite across all 6 tabs | PASS |
| [`verify_multi_tab_anti_echo.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_multi_tab_anti_echo.mjs) | Multi-tab localStorage anti-echo loop prevention & reference stability | PASS |
| [`verify_control_center_standalone_view.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_control_center_standalone_view.mjs) | Standalone studio boot via `?view=control` and `?panel=control` | PASS |
| [`verify_control_center_tab_navigation.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_control_center_tab_navigation.mjs) | Carousel tab navigation, boundary sensing, chevron arrow controls | PASS |
| [`verify_on_device_ai.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_on_device_ai.mjs) | On-device Transformers.js pipeline, WebGPU worker, attribution badges | PASS |
| [`verify_chat_enhancements.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_chat_enhancements.mjs) | Multimodal attachments, prompt chips, onboarding decision tree | PASS |
| [`verify_phase8_chat_integration.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_phase8_chat_integration.mjs) | Phase 8 master capstone integration & fallback cascade | 25/25 PASS |
| [`verify_phase9_chat_telemetry.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_phase9_chat_telemetry.mjs) | Latency telemetry, streaming token rate, memory footprint logging | PASS |
| [`verify_terminal_cli.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_terminal_cli.mjs) | Multi-OS switcher (macOS/Win11/Ubuntu), CRT scanlines, 20+ commands | PASS |
| [`verify_case_studies.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_case_studies.mjs) | 9 case studies, 5-stage dossiers, visual flowcharts, URL deep linking | PASS |
| [`verify_floating_action_hub.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_floating_action_hub.mjs) | Centralized master speed-dial FAB, lateral drawer avoidance glide | PASS |
| [`verify_view_mode.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_view_mode.mjs) | 4-tier presentation switcher (Basic, Simple, Modern, Terminal) | PASS |
| [`verify_audience_filter.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_audience_filter.mjs) | 4 audience personas (All, Recruiter, Client, Matrimonial) | PASS |
| [`verify_faq_section.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_faq_section.mjs) | 40-item bilingual FAQ accordion, matrix filtering, Schema.org JSON-LD | PASS |
| [`verify_polaroid_jszip_dynamic.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_polaroid_jszip_dynamic.mjs) | Camera roll gallery, 1-click JSZip photo packing, canvas confetti | PASS |
| [`verify_leaflet_map.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_leaflet_map.mjs) | Offline GIS map tile loading, cyberpunk dark GPU filter, memory buffer | PASS |
| [`verify_contact_form.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_contact_form.mjs) | 4-tab contact hub, quotation calculator, 24h gated contact unlock | PASS |
| [`verify_simple_mode.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_simple_mode.mjs) | Low-resource reading mode, particle cursor unmounting, clean typography | PASS |
| [`verify_accessibility.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_accessibility.mjs) | WCAG 2.1 AAA skip link, polite/assertive ARIA live regions, focus trap | PASS |
| [`verify_e2e_browser_autoscroll.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_e2e_browser_autoscroll.mjs) | Playwright headless end-to-end full page autoscroll & render test | PASS |
| [`test_refresh_resilience.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/test_refresh_resilience.mjs) | Refresh resilience, URL search param recovery, scroll coordinate restoration | PASS |

---

## 4.3 Governance & Universal Rules Enforcement Reference

Operational rules governing AI agent behaviors, Git conventions, changes logging, and subagent orchestration are strictly enforced via [`GEMINI.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/GEMINI.md) and [`C:\Users\Atul Verma\.gemini\GEMINI.md`](file:///C:/Users/Atul%20Verma/.gemini/GEMINI.md).

### Universal Rule 22 Implementation:
- **Ephemeral Prompt Execution Staging:** Managed via [`temp_prompt/README.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/temp_prompt/README.md).
- **Dedicated Orchestration Skill:** [`phase-prompt-architect`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/.agents/skills/phase-prompt-architect/SKILL.md).
- **Execution & Cleanup Workflow:** Task folder scaffolding (`temp_prompt/<task_name>/`) ➔ `INDEX.md` orchestration ➔ Phased implementation via specialized subagents ➔ Automated verification pass (Grade A+) ➔ Memory/ledger synchronization ➔ Safe post-verification deletion of ephemeral task folder.

### Universal Rule 23 Implementation:
- **Continuous Stage-by-Stage Synchronization:** Governed via [`memory.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/memory.md) (Section 0 Live Agent State).
- **Dedicated Sentinel Skill:** [`memory-sync-sentinel`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/.agents/skills/memory-sync-sentinel/SKILL.md).
- **Dedicated Sentinel Subagent:** `memory_sync_sentinel`.
- **Operational Guarantees:**
  - *Tier 1 In-Flight Micro-Sync:* Section 0 updated before/after every subagent dispatch or atomic file edit.
  - *Tier 2 Milestone Macro-Sync:* Full Layers 1–4 audit upon milestone completion or major verification.
  - *Blocking Gatekeeper:* Task DoD is strictly invalid if Section 0 is stale.
  - *Atomic Aggregation:* Parallel subagent dispatch waves (Rule 2) aggregated and committed in one transaction.
  - *Immediate Failure Logging:* Diagnostic incident blocks registered immediately upon build/test errors.

