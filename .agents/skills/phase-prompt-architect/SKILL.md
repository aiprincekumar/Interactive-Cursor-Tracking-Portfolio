---
name: phase-prompt-architect
description: Architect, structure, track, and safely clean up phase-wise prompt execution documents inside temp_prompt/ per Universal Rule 22.
---

# Phase Prompt Architect Skill (`phase-prompt-architect`)

> **Governing Protocol:** Universal Rule 22 (`temp_prompt/` Phase Execution & Cleanup Management)  
> **Master Operational Rules:** [`GEMINI.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/GEMINI.md)  
> **Technical Memory Dossier:** [`memory.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/memory.md)  
> **Dedicated Subagent:** `phase_prompt_architect`

---

## 1. Project Context & Architecture Overview

The **Interactive Cursor-Tracking Portfolio** is a high-performance web platform built for **Atul Verma** using React 19, Tailwind CSS v4, and Vite 8. The application unifies 16 architecture modules, 35 custom cursors across 7 thematic families, a zero-audio-asset procedural Web Audio synthesizer, an on-device neural LLM Web Worker (@huggingface/transformers with WebGPU/WASM), 5 career role tracks, and over 58 verification test harnesses.

Due to the architectural complexity and zero-regression standards of this ecosystem, complex multi-step initiatives (e.g., 3D Studio Split Sandbox, Multimodal Voice Synthesis, Hardware-tiered Local AI, Autonomous Spatial Radar) must **never** be executed as monolithic, unstructured edits. Instead, they must be decomposed into phased, granular, independently verifiable units managed under **Universal Rule 22**.

---

## 2. Directory Hierarchy: `temp_prompt/<task_or_feature_name>/`

All temporary execution blueprints, prompt decks, and phase-wise instruction sheets are stored exclusively in dedicated subfolders under `temp_prompt/`:

```
temp_prompt/
├── README.md                                # Permanent directory anchor & protocol guide
└── <task_or_feature_name>/                  # Scoped ephemeral workspace directory
    ├── INDEX.md                             # Master orchestration index & phase tracking board
    ├── phase_01_<descriptor>.md             # Phase 1 instruction deck & verification contract
    ├── phase_02_<descriptor>.md             # Phase 2 instruction deck & verification contract
    └── ...
```

### Naming Conventions:
- **Subfolder Name:** Lowercase alphanumeric with hyphens or underscores describing the specific task or feature (e.g., `temp_prompt/3d_studio_phase_execution/`, `temp_prompt/voice_agent_integration/`, `temp_prompt/webrtc_multi_cursor/`).
- **Phase Filenames:** `phase_<NN>_<step_name>.md` using zero-padded two-digit numbering (e.g., `phase_01_state_isolation.md`, `phase_02_mini_dom_replica.md`, `phase_03_sticky_split_column.md`).

---

## 3. Standards for `INDEX.md` and Phase Files

### 3.1 Standards for `INDEX.md`
Every feature subfolder **must** contain a master `INDEX.md` acting as the single source of truth for the initiative. It must include:
1. **Header Metadata:** Task name, target version, author/architect agent, creation timestamp (`YYYY-MM-DD HH:mm:ss`), and total phase count.
2. **Executive Architecture Summary:** High-level problem statement, design approach, and Mermaid architecture/flow diagram.
3. **Technical Contracts & Invariants:** Scoped CSS variables, state isolation boundaries, memory budgets, zero-layout-shift rules, and target file manifests.
4. **Phase Tracking Matrix:**
   | Phase # | Phase Descriptor | Target Files | Specialized Subagent | Verification Command | Status |
   | :---: | :--- | :--- | :--- | :--- | :---: |
   | 01 | Scoped CSS & State Isolation | `LabContext.jsx`, `...` | `css_styling_specialist` | `npm run test:phase1` | `[x] PASS` |
   | 02 | Viewport Container | `SandboxViewport.jsx` | `typescript_language_specialist` | `npm run test:phase2` | `[ ] PENDING` |
5. **Execution Order & Dependencies:** Strict sequencing rules and parallelization opportunities (Universal Rule 2).
6. **Acceptance Criteria & DoD:** Exhaustive checklist for Grade A+ completion.

### 3.2 Standards for `phase_01_<step>.md` Files
Each individual phase file is a self-contained, standalone prompt crafted for a scoped specialist subagent. It must contain:
1. **Phase Objectives & Scope:** Explicitly what will be created or modified, and what must NOT be touched.
2. **Exact Target Files:** Absolute and relative workspace paths.
3. **Step-by-Step Implementation Instructions:** Precise code blocks, props definitions, hook contracts, and styling tokens.
4. **Edge Cases & Invariants:** Reduced motion, dark/light contrast, mobile breakpoints, null/undefined safety.
5. **Automated Verification Harness:** Dedicated Node.js ESM verification script (`scripts/verify_*.mjs`) validating syntax, DOM attributes, exports, and state invariants.
6. **Rollback & Safety Instructions:** How to revert the phase cleanly if verification fails.

---

## 4. Integration with Subagent `phase_prompt_architect`

When an architectural feature, multi-step optimization, or complex refactor is initiated:
1. **CEO Delegation (Universal Rule 1):** The Main Agent (CEO) invokes `phase_prompt_architect` to analyze the scope and create the execution plan.
2. **Scaffold Directory & Files:** `phase_prompt_architect` creates `temp_prompt/<task_or_feature_name>/`, generates `INDEX.md`, and drafts the granular phase files (`phase_01_*.md`, etc.).
3. **Parallel Dispatch Optimization (Universal Rule 2):** Identifies phases that can run concurrently versus those requiring strict sequential execution.
4. **Specialist Subagent Assignment:** Maps each phase to its language/domain specialist (e.g., `javascript_language_specialist`, `css_styling_specialist`, `qa_verification_tester`).
5. **Status Tracking:** Updates `INDEX.md` as each phase completes and passes verification.

---

## 5. Safe Post-Verification Cleanup Protocol (Universal Rule 22)

The `temp_prompt/` directory is designed for **ephemeral execution** to prevent repository clutter. Once an initiative has successfully landed, it must be safely pruned according to the following protocol:

```
[Phased Development] ──► [Automated Test Suite Pass] ──► [QA Grade A+ Signoff]
                                                               │
                                                               ▼
[Safe Directory Pruning] ◄── [changes_log Recorded] ◄── [memory.md Updated]
```

### Mandatory Cleanup Checklist (All 5 gates must be verified before deletion):
1. **100% Phase Completion:** All phases listed in `INDEX.md` are marked `[x] PASS` or completed.
2. **Automated Verification:** All corresponding test scripts (`scripts/verify_*.mjs` or `npm test`) pass with zero errors and zero warnings.
3. **Documentation Sync:** Permanent architectural details, module updates, and feature changes have been synced into:
   - Project Technical Dossier: [`memory.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/memory.md)
   - Master Features Catalog: [`docs/FEATURES_MEMORY.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/docs/FEATURES_MEMORY.md)
4. **Audit Trail Logging (Universal Rule 6):** Complete change diffs, author stamps, and timestamps are recorded in `changes_log/`.
5. **Safe Pruning:** Only the completed subfolder `temp_prompt/<task_or_feature_name>/` is removed.
   - **PROTECTED:** Root `temp_prompt/README.md` must **NEVER** be deleted.
   - **PROTECTED:** Any ongoing or pending task subfolders in `temp_prompt/` must **NEVER** be touched.
