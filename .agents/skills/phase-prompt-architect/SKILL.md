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
Every feature subfolder **must** contain a master `INDEX.md` acting as the single source of truth for the initiative. When creating `temp_prompt/<task_name>/INDEX.md` or any phase prompt suite, as well as documenting major issues/refactoring in memory files (`project_feature_memory.md` / `memory.md`), the top section MUST strictly include:
1. **Problem Summary (संक्षिप्त सारांश) & Problem Detailed Bullet Points (विस्तृत समस्या बिंदु):** Itemized symptom, trigger, and root failure mechanisms.
2. **Solution Summary (संक्षिप्त समाधान) & Solution Detailed Bullet Points (विस्तृत समाधान बिंदु):** Surgical fix strategy, invariant protections, and test gates.
3. **Mandatory 7-Column Diagnostic Problem-Solution & Impact Matrix Table:**
   | S.No. / ID | Target File / Location | Root Cause & Failure Mechanism (क्यों और कैसे) | Proposed Fix (दुरुस्त कैसे किया जाएगा) | Post-Fix Impact & System Value (इम्पैक्ट) | Assigned Phase # | Verification Test Gate |
4. **Header Metadata:** Task name, target version, author/architect agent, creation timestamp (`YYYY-MM-DD HH:mm:ss`), and total phase count.
5. **Phase Tracking Matrix:**
   | Phase # | Phase Descriptor | Target Files | Specialized Subagent | Verification Command | Status |
   | :---: | :--- | :--- | :--- | :--- | :---: |
   | 01 | Scoped CSS & State Isolation | `LabContext.jsx`, `...` | `css_styling_specialist` | `npm run test:phase1` | `[x] PASS` |
   | 02 | Viewport Container | `SandboxViewport.jsx` | `typescript_language_specialist` | `npm run test:phase2` | `[ ] PENDING` |
6. **Execution Order & Dependencies:** Strict sequencing rules and parallelization opportunities (Universal Rule 2).
7. **Acceptance Criteria & DoD:** Exhaustive checklist for Grade A+ completion.

### 3.2 Standards for `phase_01_<step>.md` Files (Self-Contained Granular Prompts)
Each individual phase file is a completely self-contained, standalone prompt crafted so that **ANY model (old/new, Gemini, Claude, GPT, local) in a fresh or existing session can execute it reliably from a single 1-line prompt**. It must contain the 7 core sections:
1. **Objective:** Explicit 1-2 sentence statement of what this phase accomplishes.
2. **Prerequisites & Dependencies:** Prior phases and packages required.
3. **Technical Context & Problem Context:** Problem context, affected symbols, and explicit clickable file links.
4. **Step-by-Step Surgical Instructions:** Precise code blocks, props definitions, hook contracts, and styling tokens.
5. **Constraints & Invariants:** Reduced motion, dark/light contrast, mobile breakpoints, null/undefined safety, CLS = 0.00, 60+ FPS.
6. **Expected Outputs & Deliverables:** Concrete list of created/modified files.
7. **Verification Gate:** Dedicated Node.js ESM verification script (`scripts/verify_*.mjs`) or test command.

---

## 4. User Execution Handoff & Autonomous Pipeline Protocol

Once all phase documents (`INDEX.md` and all `phase_*.md` files) are generated, the agent MUST:
1. **Prompt the User Interactively:**
   Prompt the user directly via `ask_question` modal or explicit interaction prompt:  
   *"क्या अब मैं फेज 1 से लेकर फेज [Last] तक का काम स्टार्ट कर दूं फेज-वाइज़ मैनर में?"*
2. **Provide Universal 1-Line Execution Prompt:**
   Provide a standardized, copy-pasteable execution command:
   ```text
   temp_prompt/<task_name>/INDEX.md और phase_*.md को पढ़कर फेज 1 से अंतिम फेज तक क्रमिक रूप से लागू (implement) और सत्यापित करो।
   ```
3. **Autonomous Sequential Execution Pipeline:**
   When the user confirms with "हाँ", "OK", "Proceed", or triggers the command, execute Phase 1 through the final Phase sequentially with intermediate test gates, concluding with independent QA Grade A+ signoff.

---

## 5. Integration with Subagent `phase_prompt_architect`

When an architectural feature, multi-step optimization, or complex refactor is initiated:
1. **CEO Delegation (Universal Rule 1):** The Main Agent (CEO) invokes `phase_prompt_architect` to analyze the scope and create the execution plan. No new subagents or rules are created.
2. **Scaffold Directory & Files:** `phase_prompt_architect` creates `temp_prompt/<task_or_feature_name>/`, generates `INDEX.md` with the 7-column diagnostic matrix, and drafts self-contained phase files (`phase_01_*.md`, etc.).
3. **Execution Handoff:** Executes the User Execution Handoff Protocol with interactive trigger and 1-line prompt.
4. **Parallel Dispatch Optimization (Universal Rule 2):** Identifies phases that can run concurrently versus those requiring strict sequential execution.
5. **Specialist Subagent Assignment:** Maps each phase to its language/domain specialist (e.g., `javascript_language_specialist`, `css_styling_specialist`, `qa_verification_tester`).
6. **Status Tracking:** Updates `INDEX.md` as each phase completes and passes verification.

---

## 6. Safe Post-Verification Cleanup Protocol (Universal Rule 22)

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
