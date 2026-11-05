---
name: phase-prompt-architect
description: Architect, structure, track, and safely clean up phase-wise prompt execution documents inside temp_prompt/ per Universal Rule 22 and Level 3C Specialist governance.
---

# Phase-wise Prompt Generation Specialist Skill (`phase-prompt-architect`)

## 1. Core Purpose & Mission

Complex software engineering initiatives, large-scale refactorings, multi-agent workflows, and multi-step features easily suffer from context drift, missed criteria, or unverified intermediate states when executed in monolithic, single-pass prompts. 

The **`phase-prompt-architect`** skill provides the standardized framework and execution protocol for the **Level 3C: Phase-wise Prompt Generation Specialist** (`prompt_generation_specialist`), operating under the 4-Level Command Hierarchy:
- **Level 3 Specialist Authority:** Co-equal with Level 3A Skill Manager and Level 3B Grill-Me Specialist.
- **Reporting Hierarchy:** Receives directives exclusively from the Level 2 Manager; reports directly to the Level 2 Manager.
- **Strict Invariants:** Never communicates directly with Level 1 CEO or the human user; never assigns execution tasks directly to Level 4 Sub Agents.

---

## 2. Mandatory Prompt Requirement Assessment (Every Task)

On **EVERY** task delegated by the Manager, the Specialist conducts a mandatory assessment:
- **`PROMPT_FILES_REQUIRED` = `YES` or `NO`**

### Criteria for `PROMPT_FILES_REQUIRED = NO`:
- Small, routine, single-module, or low-complexity tasks (e.g., minor bugfix, localized CSS tweak, documentation typo, single test fix, dependency update).
- **Zero-Overhead Policy:** The Specialist certifies that no ephemeral prompt files or specifications are needed.
- The Manager directly assigns execution to Level 4 Sub Agents with zero prompt file overhead.

### Criteria for `PROMPT_FILES_REQUIRED = YES`:
- Complex, multi-module, long, high-risk, or multi-phase tasks requiring sequential coordination, cross-departmental handoffs, or persistent state tracking.
- The Specialist generates the complete phased execution dossier inside `temp_prompt/<task_or_feature_name>/`.

---

## 3. Standard Ephemeral Directory Architecture

When `PROMPT_FILES_REQUIRED = YES`, all temporary phase prompts and execution trackers MUST strictly reside in subdirectories beneath the project root's `temp_prompt/` folder:

```
<project_root>/
└── temp_prompt/
    ├── README.md                           # Permanent directory anchor
    └── <task_or_feature_name>/             # Scoped ephemeral workspace directory
        ├── INDEX.md                        # Master orchestration index, 7-column matrix & live status
        ├── SUMMARY.md                      # Architectural roadmap, module dependencies, file manifest
        ├── PRD.md                          # Product Requirements Document (or Phase 1 spec)
        ├── TRD.md                          # Technical Architecture & Interface Specification
        ├── DESIGN.md                       # Design System & token specs (if UI-facing)
        ├── phase_01_<step_name>.md         # Phase 1 Standalone Execution Prompt
        ├── phase_02_<step_name>.md         # Phase 2 Standalone Execution Prompt
        ├── phase_03_<step_name>.md         # Phase 3 Standalone Execution Prompt
        └── ...                             # Subsequent phases as required
```

### Directory Invariants:
1. **Isolated Task Namespaces:** Each distinct feature, refactoring, or audit has its own named folder under `temp_prompt/` (e.g., `temp_prompt/cursor_tracking_refactor/`, `temp_prompt/audio_synthesizer_v2/`).
2. **Never Pollute Project Root:** No standalone `phase_*.md` files are allowed directly in the root or arbitrary directories.
3. **Dedicated Scope:** `temp_prompt/` is strictly reserved for actionable phase execution instructions and tracker files.

---

## 4. Execution Gate During Prompt Generation

- **Strict Subagent Pause Gate:** When `PROMPT_FILES_REQUIRED = YES`, all Level 4 Execution Sub Agents remain strictly **PAUSED / UNASSIGNED** while prompt files, PRD, TRD, and `INDEX.md` are being generated.
- Sub Agents cannot commence execution until all prompt files and documentation are fully generated, validated, and evaluated by the Level 2 Manager.
- Any attempt by a Sub Agent to execute code before Manager certification triggers a gate violation and transitions to `BLOCKED`.

---

## 5. Execution Strategy Assessment

Once prompt files are generated and validated, the Specialist evaluates the implementation strategy among three standardized models:

### Strategy A: Fully Autonomous Phase-wise Execution
- **Mechanism:** Sequential autonomous execution from Phase 1 through the final Phase without pausing for intermediate user confirmation.
- **Applicability:** Well-specified, low-to-medium risk tasks with deterministic verification tests and unambiguous requirements.
- **Autonomy Score:** 1.0 (High)

### Strategy B: Single User Consultation
- **Mechanism:** Consult and obtain user approval once upfront (prior to Phase 1 start). Once approved, execute all phases autonomously to the end.
- **Applicability:** Moderate-to-high complexity tasks where the overarching architectural approach or major dependency choice requires explicit upfront alignment.
- **Autonomy Score:** 0.75 (Medium)

### Strategy C: Phase-by-Phase User Consultation
- **Mechanism:** Consult and obtain explicit user approval before executing each individual phase.
- **Applicability:** High-risk, destructive, or breaking architectural transformations where each intermediate milestone requires visual or functional verification.
- **Autonomy Score:** 0.35 (Low)

### Concrete Recommendation Delivery:
The Specialist delivers a formal recommendation to the Manager specifying:
1. Recommended Strategy (A, B, or C)
2. Concrete Rationale
3. Identified Risks and Mitigation Strategies
4. Critical Dependencies
5. Autonomy Score

---

## 6. Routing & Final Authority

- The Specialist reports its findings and recommendations directly to the **Level 2 Manager**.
- The Manager reviews, evaluates, and decides the final execution plan.
- **User Consultation Routing:** If Strategy B, Strategy C, or requirements clarification is required:
  - The Manager formulates the structured question payload.
  - The Manager forwards the payload to the Level 1 CEO.
  - The CEO presents it to the user via `ask_question`.
  - The Specialist NEVER contacts the CEO or User directly.

---

## 7. Standard File Conventions & Structure

### 7.1 `INDEX.md` (Live Central Control Ledger & Diagnostic Master)
The `INDEX.md` document acts as the single source of truth for the active task. It MUST include:
1. **Problem Summary & Detailed Bullet Points**
2. **Solution Summary & Detailed Bullet Points**
3. **Mandatory 7-Column Diagnostic Problem-Solution & Impact Matrix Table:**
   | S.No. / ID | Target File / Location | Root Cause & Failure Mechanism | Proposed Fix | Post-Fix Impact & System Value | Assigned Phase # | Verification Test Gate |
4. **Task Identity & Metadata:** Name, Initiator, Dedicated Specialist (`prompt_generation_specialist`), Start Timestamp, Current Overall Status.
5. **Phase Status Matrix:** Table tracking each phase's file name, assigned subagent/role, prerequisites, status (`Pending`, `In Progress`, `Completed`, `Blocked`), and completion timestamp.
6. **Handoff & Gate Criteria:** Explicit inputs, outputs, and requirements for advancing from phase $N$ to $N+1$.
7. **Independent QA Signoff State:** Formal evaluation record by `qa_verification_tester` or independent QA specialist, recording the final grade, checks executed, and clearance for cleanup.

### 7.2 Standalone Phase Prompt Documents (`phase_XX_<step_name>.md`)
Each phase file is completely self-contained with the 7 core sections:
1. **Objective:** Concise 1-2 sentence statement of what this phase accomplishes.
2. **Prerequisites & Dependencies:** Prior phases and packages required.
3. **Technical Context & Problem Context:** Problem context, affected symbols, and explicit clickable file links.
4. **Step-by-Step Surgical Instructions:** Precise code blocks, props definitions, hook contracts, and styling tokens.
5. **Constraints & Invariants:** Reduced motion, contrast, mobile breakpoints, null-safety, CLS = 0.00, 60+ FPS.
6. **Expected Outputs & Deliverables:** Concrete list of created/modified files.
7. **Verification Gate:** Dedicated test script or verification command.

---

## 8. Ephemeral Lifecycle & Safe Cleanup Protocol (Universal Rule 22)

```
[ Stage 1: Assessment & Drafting ] ──► [ Stage 2: Strategy Evaluation ]
              │                                      │
              ▼                                      ▼
[ PROMPT_FILES_REQUIRED Evaluation ]    [ Strategy A, B, or C Recommendation ]
              │                                      │
              ▼                                      ▼
[ Stage 3: Autonomous / Phased Execution ] ──► [ Stage 4: Independent QA Grade A+ ]
              │
              ▼
[ Stage 5: Safe Pruning & Clutter-Free Deletion ]
```

### Stage 1: Assessment & Drafting
- `prompt_generation_specialist` evaluates `PROMPT_FILES_REQUIRED`. If YES, generates `temp_prompt/<task_name>/INDEX.md`, `SUMMARY.md`, and all `phase_XX_*.md` files.

### Stage 2: Strategy Evaluation & Manager Gate
- Specialist delivers Strategy Recommendation (A, B, or C) to Manager. Manager approves or consults user via CEO -> `ask_question`.

### Stage 3: Phased Execution
- Subagents execute phases sequentially, verifying intermediate gates and updating `INDEX.md`.

### Stage 4: Independent QA Audit
- Independent QA specialist audits the completed implementation, verifying test passes and issuing **Grade A+** certification.

### Stage 5: Safe Pruning & Clutter-Free Deletion
- **STRICT MANDATE:** Only after 100% of phases in `INDEX.md` are marked `Completed` and QA certifies **Grade A+**:
- Ephemeral prompt folders are safely deleted or archived, leaving root `temp_prompt/README.md` intact.

---

## 9. Specialist Integration: `prompt_generation_specialist`

The **`prompt_generation_specialist`** (Level 3C Specialist) is the sole authority responsible for:
1. Assessing prompt requirements on every task (`PROMPT_FILES_REQUIRED` = YES/NO).
2. Decomposing complex initiatives into structured phase prompts inside `temp_prompt/<task_name>/`.
3. Maintaining `INDEX.md` (with the Diagnostic Problem-Solution 7-column matrix) and supporting specs (`SUMMARY.md`, `PRD.md`, `TRD.md`, `DESIGN.md`).
4. Evaluating execution strategies (Strategy A, B, C) and submitting recommendations directly to the Manager.
5. Enforcing the execution pause gate until prompt documentation is certified.
6. Safely executing post-QA cleanup to maintain absolute zero clutter across the developer's project repositories.
