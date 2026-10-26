# Temporary Prompt & Phase Execution Directory (`temp_prompt/`)

> **Governing Protocol:** Universal Rule 22 (`temp_prompt/` Phase Execution & Cleanup Management)  
> **Master Operational Rules:** [`GEMINI.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/GEMINI.md)  
> **Technical Memory Dossier:** [`memory.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/memory.md)  
> **Dedicated Subagent:** `phase_prompt_architect`  
> **Dedicated Skill:** [`phase-prompt-architect`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/.agents/skills/phase-prompt-architect/SKILL.md)

---

## 1. Purpose of `temp_prompt/`

The `temp_prompt/` directory serves as the centralized, project-level staging ground for **ephemeral phase execution documents**, multi-stage architectural blueprints, and prompt decks. 

In complex software ecosystems with rigorous zero-regression requirements, large-scale feature developments or architectural refactors (such as 3D Viewport Sandboxes, Multimodal Audio Engines, On-Device Neural Model Workers, or Accessibility Sweeps) must never be performed blindly or as single massive changes. Instead, they are broken down into discrete, sequential, and testable phases.

Storing these phase instructions inside `temp_prompt/`:
- **Eliminates Workspace Clutter:** Prevents disposable execution plans and prompt scratchpads from cluttering the project root or source tree.
- **Enforces Structured Execution:** Provides clear subagent contracts, file targets, and automated test commands for each individual step.
- **Maintains Audit Readiness:** Allows easy tracking of multi-stage initiatives while they are active, with clean post-verification disposal once certified.

---

## 2. Subfolder Naming Convention

Every new initiative or feature task must be quarantined within its own dedicated subfolder under `temp_prompt/`:

```
temp_prompt/<task_or_feature_name>/
```

### Standards:
- **Format:** Lowercase alphanumeric strings with hyphens or underscores (e.g., `temp_prompt/3d_studio_phase_execution/`, `temp_prompt/chat_voice_synthesis/`, `temp_prompt/offline_gis_recalibration/`).
- **Isolation:** Multiple distinct initiatives must have separate subfolders so they can be executed in parallel or independently without conflicting.

---

## 3. Structure of `INDEX.md` and Phase Files

Inside each `<task_or_feature_name>/` subfolder, files must follow a standardized two-tier layout:

```
temp_prompt/<task_or_feature_name>/
├── INDEX.md                        # Master orchestration board & phase status matrix
├── phase_01_<step_descriptor>.md   # Granular prompt deck & technical contract for Phase 1
├── phase_02_<step_descriptor>.md   # Granular prompt deck & technical contract for Phase 2
└── phase_03_<step_descriptor>.md   # Granular prompt deck & technical contract for Phase 3
```

### 3.1 `INDEX.md` Structure
`INDEX.md` serves as the roadmap and live status board for the task. It contains:
- **Title & Metadata:** Task name, target version, author agent, timestamp.
- **Executive Summary:** Objective, scope, architectural impact, and Mermaid flow diagrams.
- **System Architecture & Technical Contracts:** Scoped CSS variables, state isolation boundaries, memory and performance budgets.
- **Phase Execution Matrix:**
  | Phase | Name / Focus | Target Files | Subagent Specialist | Verification Command | Status |
  | :---: | :--- | :--- | :--- | :--- | :---: |
  | 01 | Scoped CSS & State Isolation | `src/context/LabContext.jsx` | `css_styling_specialist` | `node scripts/verify_phase1.mjs` | `[x] PASS` |
  | 02 | Viewport Container Scaffold | `src/components/Sandbox.jsx` | `typescript_language_specialist` | `node scripts/verify_phase2.mjs` | `[ ] PENDING` |
- **Definition of Done (DoD):** Verification commands, linter checks, and acceptance invariants.

### 3.2 Phase File Structure (`phase_01_<step_descriptor>.md`)
Each phase file is an executable, standalone prompt for a designated worker subagent. It contains:
- **Phase Header:** Phase number, title, subagent specialization, target files, and pre-conditions.
- **Detailed Step Instructions:** Precise code modifications, props, interfaces, styling tokens, and invariants.
- **Automated Verification Harness:** Exact script path to validate code correctness (e.g., `node scripts/verify_phase_01.mjs`).
- **Rollback Procedure:** Precise instructions for reverting the phase if regression occurs.

---

## 4. Lifecycle & Auto-Cleanup Policy (Universal Rule 22)

Files in `temp_prompt/` are **strictly ephemeral**. They exist solely to guide the agent through multi-phase engineering tasks and must be safely pruned once verified:

```
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│ 1. Phase Scaffolding   │ ──►  │ 2. Phased Execution    │ ──►  │ 3. Automated QA Pass   │
│ `temp_prompt/<task>/`  │      │ Specialist Subagents   │      │ Grade A+ (0 errors)    │
└────────────────────────┘      └────────────────────────┘      └───────────┬────────────┘
                                                                            │
┌────────────────────────┐      ┌────────────────────────┐                  │
│ 5. Safe Pruning        │ ◄──  │ 4. Master Dossier Sync │ ◄────────────────┘
│ Remove `<task>/` only  │      │ Update `memory.md`     │
│ Keep `README.md` intact│      │ Update `changes_log/`  │
└────────────────────────┘      └────────────────────────┘
```

### Safe Pruning Protocol:
1. **Automated Verification:** All phase verification test scripts and overall test harness (`npm test`) must pass with 100% success.
2. **QA Grade A+ Signoff:** Independent QA subagent confirms zero regressions, valid styling, and clean syntax.
3. **Master Ledger Update:** Core architecture, features, and quick entry points are documented in:
   - [`memory.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/memory.md)
   - [`docs/FEATURES_MEMORY.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/docs/FEATURES_MEMORY.md)
4. **Changes Log Entry:** Change record is documented under `changes_log/` per Universal Rule 6.
5. **Deletion of Feature Subfolder:** The specific subfolder `temp_prompt/<task_or_feature_name>/` is permanently removed.
6. **Immutable Anchor:** This root file (`temp_prompt/README.md`) must **NEVER** be deleted; it permanently anchors the directory structure.
