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

---

## 4. Lifecycle & Auto-Cleanup Policy (Universal Rule 22)

Files in `temp_prompt/` are **strictly ephemeral**. They exist solely to guide the agent through multi-phase engineering tasks and must be safely pruned once verified:

### Mandatory Cleanup Checklist:
1. **Automated Verification:** All phase verification test scripts and overall test harness (`npm test`) must pass with 100% success.
2. **QA Grade A+ Signoff:** Independent QA subagent confirms zero regressions, valid styling, and clean syntax.
3. **Master Ledger Update:** Core architecture, features, and quick entry points are documented in `memory.md` and `docs/FEATURES_MEMORY.md`.
4. **Changes Log Entry:** Change record is documented under `changes_log/` per Universal Rule 6.
5. **Deletion of Feature Subfolder:** The specific subfolder `temp_prompt/<task_or_feature_name>/` is permanently removed.
6. **Immutable Anchor:** This root file (`temp_prompt/README.md`) must **NEVER** be deleted; it permanently anchors the directory structure.
