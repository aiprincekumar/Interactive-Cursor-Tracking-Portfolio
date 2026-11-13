# Universal Engineering & Development Rules

> **Master Enterprise Architecture & Navigation Links:**
> - **Master Rules Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md) (Central Table of Contents & 14 Enterprise Departments Directory)
> - **Foundation & Special Operating Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md) (CEO Model, Zero-Scan, Identity, Subagents)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) (Global ecosystem topology & machine state)
> - **Primary Developer Profile:** Atul Verma (`aiprincekumar` / `aiprincekumar010100@gmail.com` / [GitHub Profile](https://github.com/aiprincekumar))

These rules apply universally and mandatorily across all projects, programming languages, and workspaces.

---

## 🏛️ 1. Supreme Architecture: Main Agent = CEO / Orchestrator (No Direct Work by Main Agent)

### ⚡ 0. Mandatory Zero-Scan Bootstrap Protocol
- **Mandatory Memory Anchoring:** Upon starting any new session or task, all incoming AI models, Main Agent, and subagents must immediately load and anchor to [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) as their active working memory.
- **Strict Prohibition on Blind Recursive Scans:** Agents are strictly forbidden from performing blind recursive scans (`dir /s`, `Get-ChildItem -Recurse`, `find`, `grep -r`, `glob`) across projects or workspaces.
- **Pre-Mapped Ecosystem Topology:** The complete developer environment, active repositories, technology stacks, backups, and tooling state are pre-mapped in [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md). All agents must utilize this existing topology.

- **Main Agent Role (CEO / Orchestrator):**
  - The Main Agent never directly writes application code, edits files, executes shell commands, or mutates repository state.
  - The Main Agent operates solely as a Strategic Planner, Team Leader, and Final Evaluator/Verifier.
- **Mandatory Subagent Delegation (`invoke_subagent` / `define_subagent`):**
  - Every task requested by the user must be delegated to specialized subagents.
  - Subagent fleet size scales dynamically to the problem scope (from 1 to 100+ subagents deployed sequentially or in parallel batches).
- **Custom Dynamic Subagents:**
  - If a suitable subagent does not exist for a specialized task, define one at the project level using `define_subagent` before dispatching work.
- **Independent QA Verification Subagent:**
  - Following task execution by engineering subagents, an independent QA/Verification subagent must verify code quality, test suites, and security posture.
- **CEO Final Review & Synthesis:**
  - The Main Agent (CEO) synthesizes and presents the final evaluation to the user only after receiving Grade A+ certification from the QA subagent.

---

## 🚀 2. Pre-Task Parallelization & Optimization
- **Pre-Task Evaluation:** Before starting any user task, evaluate whether the task can be safely decomposed into independent subtasks and dispatched to two or more subagents in parallel.
- **Parallel Dispatch Ordering:**
  - If tasks are decoupled (e.g., independent modules, concurrent research + coding, multi-file refactoring), dispatch multiple subagents (2, 5, 10+) in parallel.
  - If tasks are strictly sequential, enforce sequential handoffs between subagents.
- **Dedicated Subagent (`parallel_dispatch_optimizer`):** Responsible for decomposing tasks, assessing parallel feasibility, and planning subagent dispatch batches.

---

## 🔍 3. Skill Requirement Discovery & Sourcing
- **Pre-Task Skill Audit:** Before executing any instruction, verify whether all necessary skills and tools are already installed in the system.
  - **Skip Mechanism:** If all required skills are present, immediately skip discovery and proceed with task execution.
- **Search via Installed Tools:**
  - If a required skill is missing, search internal and marketplace libraries using installed discovery tools (`skill-scout` and `find-skills`).
- **Autonomous GitHub Discovery (Highest Stars):**
  - If internal discovery yields no match, search GitHub autonomously for the highest-starred, reputable skill repository matching the task requirements.
  - Select the best candidate and install it locally or globally.
- **Dedicated Subagent (`skill_requirement_scout`):** Audits required skills, discovers missing capabilities, and installs them autonomously.

---

## 🧩 4. Mandatory Skill Duplicate Verification
- **Mandatory Pre-Creation Check:** Before creating any new skill, verify whether that skill or capability already exists in the system or project.
- **Dedicated Subagent (`skill_duplicate_checker`):** Invoke `skill_duplicate_checker` to perform this duplication audit.
- **Skip & Report:** If the capability exists, skip duplicate creation and report existing capabilities.
- **Create Only Novel Skills:** Author a new skill only after receiving certification that no equivalent skill exists.

---

## 💾 5. Antigravity Full Backup & Restore System
- **Clutter-Free Dual Sub-Folder Architecture:**
  The desktop backup container `C:\Users\Atul Verma\Desktop\Antigravity Backup\` operates with 2 dedicated sub-folders:
  1. **`Manual_Backup/`:** Holds all manual backups and 1-click manual runner scripts.
     - Path: `C:\Users\Atul Verma\Desktop\Antigravity Backup\Manual_Backup\Manual_Backup_YYYY-MM-DD_HH-mm-ss\`
     - 1-Click Runners: `Manual_Backup\backup_manual.bat` and `Manual_Backup\backup_manual.ps1`
     - Retention: Permanent indefinite retention (never automatically deleted).
  2. **`Daily_Backup/`:** Holds daily automated backups with 10-day FIFO rotation.
     - Path: `C:\Users\Atul Verma\Desktop\Antigravity Backup\Daily_Backup\Daily_Backup_YYYY-MM-DD_HH-mm-ss\`
     - 1-Click Runners: `Daily_Backup\backup_daily.bat` and `Daily_Backup\backup_daily.ps1`
     - Retention: Strict 10-day FIFO automated pruning.
- **One-Click Standalone Backup Scripts:**
  - Standalone runner scripts invoke the master backup engine (`config\scripts\antigravity_daily_backup.ps1`) without requiring manual setup.
- **Identical Backup Interior Structure (100% Parity):**
  Every backup snapshot contains:
  - `memory.md` (Global ecosystem state at snapshot root)
  - `rules/` (All departmental and foundation rules)
  - `config/` (Core settings, `config.json`, `projects/`, and `scripts/`)
  - `skills/` (All 71+ custom and installed skills)
  - `plugins/` (Plugin definitions without node_modules)
  - `mcp/` (All MCP server definitions and schemas)
  - `sidecars/` (Automation sidecars)
  - `backup_manifest.json` (Snapshot metadata and hash registry)
  - `PREREQUISITES_FRESH_OS.md` (Fresh OS setup prerequisites)
  - `RESTORE_INSTRUCTIONS.md` (1-click and manual restore guide)
  - `restore.bat` and `restore.ps1` (1-click automated restore runners)
- **Mandatory memory.md & config\scripts Backup & Restore:**
  - `memory.md` is preserved at the root of every backup and restored directly to `$env:USERPROFILE\.gemini\memory.md`.
  - `config\scripts\` is backed up and restored directly to `$env:USERPROFILE\.gemini\config\scripts\`.
- **Mandatory UTF-8 with BOM Encoding Standard:**
  - Save all generated markdown files (`PREREQUISITES_FRESH_OS.md`, `RESTORE_INSTRUCTIONS.md`) and scripts in **UTF-8 with BOM (`0xEF, 0xBB, 0xBF`)** to prevent encoding corruption in Windows environments.
- **Mandatory PREREQUISITES_FRESH_OS.md Document:**
  - Persisted permanently in every snapshot and in the backup root container.

---

## 📜 6. Mandatory Project Changes Log & Audit Trail
- **Mandatory Directory Structure (`changes_log/`):**
  Every codebase change must be recorded across a structured 5-tier architecture:
  ```
  changes_log/
  ├── summary/
  │   └── changes_summary.md (Tabular ledger: Change ID, Timestamp, Author, Target File, Lines, Summary)
  ├── master/
  │   └── master_changes_log.md (Master index linking all individual entries and technical context)
  ├── daily/
  │   └── YYYY-MM-DD/
  │       └── daily_master_log.md (Consolidated daily ledger for that date)
  ├── entries/
  │   └── YYYY-MM-DD/
  │       └── change_<ID>_<YYYY-MM-DD_HH-mm-ss>.md (Granular entry with before/after diffs, rationale, and rollback plan)
  └── recent_10/
      ├── change_recent_01.md
      ├── change_recent_02.md
      └── ... (10 standalone files rotated via FIFO)
  ```
- **Logging Categories & Tiers:**
  1. **Summary Table (`changes_summary.md`):** High-density tabular metadata for rapid scanning.
  2. **Master Changes Log (`master_changes_log.md`):** Complete index linking to all individual log files.
  3. **Daily Master Log (`daily/YYYY-MM-DD/daily_master_log.md`):** Consolidated date-based log.
  4. **Granular Entry Files (`entries/...`):** Independent before/after diff, author, rationale, line numbers, and rollback steps.
  5. **Recent 10 Standalone Records (`recent_10/`):**
     - Retains the last 10 changes across 10 standalone files.
     - Not linked in master or summary logs; operates as an independent rolling FIFO buffer.
- **Mandatory Metadata Fields:** Change ID, Timestamp, Author/Agent, File Path, Exact Lines, Rationale, Pre-state, Post-state.
- **Dedicated Subagent (`changes_log_manager`):** Responsible for managing and updating all 5 tiers of the changes log.

---

## ⚡ 7. Function Auto-Feature & Autonomous Confirmation
- **Autonomous Local Execution (Zero User Interruption):** Execute local tool operations, file creations, refactorings, and automated tests autonomously without prompting the user.
- **Covered Autonomous Scopes:**
  - Package/tool installations (NPM, PNPM, Pip, Yarn).
  - Local Git operations (init, clone, status, branch, checkout — strictly excluding commit and remote push).
  - Skill creation and additions.
  - Terminal and development commands.
  - Local file mutations (create, edit, move, delete).
- **Strict Remote Git Exemption:**
  Universal Rule 7 autonomy is strictly bounded to local workspace operations. Git Commit and Remote GitHub Push are 100% exempt from autonomous execution. Performing remote git pushes without prior explicit user consent constitutes a critical protocol violation.
- **Auto-Confirmation Subagent (`auto_confirmation_manager`):** Automatically approves non-destructive local operations.

---

## 🕒 8. Date and Time Timestamp Standardization
- **High Readability Standard:** Prohibit unseparated or ambiguous raw epoch timestamps in filenames and documentation.
- **Standard Formatting Matrix:**
  1. **File Naming Format (Sortable & Safe):** `YYYY-MM-DD_HH-mm-ss` (e.g., `change_001_2026-10-10_06-25-30.md`).
  2. **Directory Naming Format:** `YYYY-MM-DD` (e.g., `daily/2026-10-10/`).
  3. **In-File Metadata & Logs:** `YYYY-MM-DD HH:mm:ss [Timezone]` (e.g., `2026-10-10 06:25:30 IST (+05:30)`).
- **Dedicated Subagent (`timestamp_format_specialist`):** Enforces timestamp format consistency across the project.

---

## 💻 9. Code Quality & Clean Architecture
- **SOLID and DRY Principles:** Code must remain modular, reusable, and single-responsibility oriented.
- **KISS Standard:** Prefer straightforward, self-explanatory implementations over gratuitous complexity.
- **Descriptive Naming:** Variables, functions, types, and files must carry clear, meaningful names; disallow ambiguous abbreviations.
- **Dedicated Subagent (`code_quality_architect`):** Audits code cleanliness, modularity, and structural design patterns.

---

## 🛡️ 10. Change & File Editing Safety
- **Respect Existing Codebase:** Preserve unrelated features, comments, and structure when editing files.
- **Minimal Invasiveness:** Apply targeted surgical edits strictly necessary for the assigned task. Avoid arbitrary refactoring.
- **Destructive Operation Safeguards:** Follow verification workflows prior to deleting or overwriting critical files.
- **Dedicated Subagent (`safe_editing_specialist`):** Safeguards against accidental regressions or destructive edits.

---

## ⚠️ 11. Error Handling & Logging
- **Graceful Error Handling:** Wrap external inputs, API calls, file I/O, and database queries in appropriate try-catch or error-handling constructs.
- **Secure Logging:** Never log sensitive credentials, passwords, session tokens, API keys, or Personally Identifiable Information (PII).
- **Dedicated Subagent (`error_handling_lead`):** Governs structured exception handling and prevents credential leakage.

---

## 🔒 12. Security & Best Practices
- **Credential Governance:** Never hardcode API keys, secrets, or passwords in source code. Inject values via `.env` files.
- **Input Validation & Sanitization:** Validate and sanitize all user and external inputs to eliminate SQL Injection, XSS, and CSRF vulnerabilities.
- **Principle of Least Privilege:** Request and maintain strictly the minimum necessary access permissions and dependencies.
- **Dedicated Subagent (`security_hardening_officer`):** Conducts security audits and enforces zero-hardcoded-secret standards.

---

## 🧪 13. Testing & Verification
- **Verification Before Completion:** Execute test suites, linter runs, and typechecks following every modification to confirm zero regressions.
- **Edge-Case Validation:** Test for null/undefined inputs, network failures, timeouts, and boundary conditions.
- **Dedicated Subagent (`qa_verification_tester`):** Executes automated test suites, syntax verification, and edge-case simulations.

---

## 📝 14. Documentation & Communication
- **Clear Operational Directives:** Provide clear setup, execution, and architectural instructions for every new module.
- **Transparent Reporting:** The CEO Agent provides a transparent summary detailing which subagents performed which tasks and the QA verification verdict.
- **Dedicated Subagent (`docs_reporting_officer`):** Maintains README documentation, API guides, and execution reports.

---

## 🐙 15. Dedicated GitHub Operations, Micro-Commit Cadence & Autonomous Remote Push Intelligence
- **1. Dedicated Specialist & 1-Click Runners:**
  - All GitHub and Git operations (staging, commits, pushes, branches, PRs, tags) are performed exclusively by `github_operations_specialist`. The Main Agent (CEO) never executes direct Git transactions.
  - Standardized runner scripts `scripts/git/git_sync.ps1` (and `git_sync.bat`) and `scripts/git/verify_git_sync.ps1` provide token-efficient, repeatable execution.
- **2. Autonomous Local Micro-Commit Cadence:**
  - On EVERY SINGLE change / logical modification (हर सिंगल चेंज/कमिट), autonomously perform a local `git commit` immediately without asking the user. Never prompt the user for local commits.
  - Immediately after committing locally, simply notify and inform the user with a concise status message: `"हाँ, लोकल में कमिट हो चुका है [hash/message]"`.
- **3. Smart Staging & Security Filters:**
  - Use `git status --short` for concise status inspection.
  - Strictly exclude `.env`, `.env.*`, API keys, secrets, passwords, and ephemeral workspaces (`vibe_coding_temp/`) from staging (`git add`).
- **4. Conventional Commit Generation:**
  - Generate commit messages in Conventional Commit format (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`) derived from the latest `changes_summary.md` entry.
- **5. Zero-Hallucination 3-Point Terminal Proof Mandate:**
  - No verbal claims of remote push completion are permitted without presenting raw terminal verification output:
    1. **`git log -1` raw commit hash and message.**
    2. **`git push` remote server response.**
    3. **`git status` showing clean working tree.**
- **6. Safe Rebase & Zero Data-Loss Conflict Policy:**
  - Always apply `git pull --rebase` when remote contains upstream changes. Never execute destructive `--force` pushes.
- **7. Standard Prompts & Runners:**
  - Universal 1-Line Prompt: `Execute 'powershell -ExecutionPolicy Bypass -File .\scripts\git\git_sync.ps1' per Universal Rule 15 to stage, commit, and push all changes to GitHub, and return the 3-point terminal verification proof.`
  - Direct 1-Click Manual Execution: `powershell -ExecutionPolicy Bypass -File .\scripts\git\git_sync.ps1`
- **8. Online GitHub Upstream & Existence Pre-Check:**
  - Verify whether the repository exists on GitHub online and has actually been pushed online at least once (`git remote -v`, `git branch -r`, `git ls-remote --exit-code origin` / GitHub MCP).
  - If the repository does NOT exist online on GitHub (or has never been pushed online): strictly keep changes local offline. Zero remote push attempts.
- **9. Autonomous Remote Push Intelligence (Zero User Interruption):**
  - **Elimination of Compulsory User Interruption:** Remove the requirement to prompt the user with `ask_question` regarding remote push. The AI agent itself autonomously evaluates change magnitude and decides whether to push:
    1. **Minor / Incremental / Single-File Changes (<= 2 files, bug fixes, typo corrections, local config tweaks, partial sub-steps):** Strictly keep offline local commit. DO NOT push to GitHub online.
    2. **Significant / Multi-File / Major Feature / Architectural Changes (>= 3 files, new features, rule updates, refactors, PRD milestones):** AI agent autonomously pushes to GitHub online without asking the user.
  - **Mandatory Pre-Push Secret Audit:** `gitleaks detect --redact` must pass cleanly with zero detected secrets before executing remote push.
  - **3-Point Terminal Proof Mandate:** Remote operations mandate raw terminal verification output before declaring completion: 1) `git log -1` raw commit hash and message, 2) `git push` remote server response, 3) `git status` confirming clean working tree.

---

## 👤 16. Developer Identity & Global Git Profile
- **Primary Developer Profile:**
  - **Git Username:** `aiprincekumar`
  - **Git Email:** `aiprincekumar010100@gmail.com`
  - **GitHub Profile:** `https://github.com/aiprincekumar`
- **Universal Recognition:** All Antigravity agents across all workspaces must configure and link commits using this author profile:
  ```bash
  git config --global user.name "Atul Verma"
  git config --global user.email "aiprincekumar010100@gmail.com"
  ```

---

## 🏗️ 17. Dedicated Specialized Subagent for Every Programming Language
- **Mandatory Subagent per Language:** Every programming, scripting, and markup language in a project is handled by an isolated language specialist subagent. No single subagent writes code across multiple language domains.
- **Language Specialists Roster:**
  - Python: `python_language_specialist`
  - JavaScript: `javascript_language_specialist`
  - TypeScript: `typescript_language_specialist`
  - HTML: `html_markup_specialist`
  - CSS: `css_styling_specialist`
  - C++: `cpp_language_specialist`
  - Rust: `rust_language_specialist`
  - Go: `golang_language_specialist`
  - Java: `java_language_specialist`
  - C#: `csharp_language_specialist`
  - PHP: `php_language_specialist`
  - SQL: `sql_database_specialist`
  - Shell / PowerShell: `shell_scripting_specialist`
  - Mobile (Kotlin, Swift, Dart): Dedicated `<language>_specialist`.
- **Strict Scoped Boundaries:** Each language subagent writes only code in its assigned language domain.
- **Parallel Execution & CEO Coordination:** When projects involve multiple languages, language specialists execute in parallel and the CEO orchestrates integration.

---

## 🔄 18. Mandatory Project-Level Rules Replication & Active Sync
- **First-Command Rule Replication:** Upon first initializing or accessing a project, copy global rule files into the project's local rules directory (`.agents/rules/`).
- **Active Synchronization:** Whenever global rules are modified, propagate updates to active project-level rules.
- **Dedicated Subagent (`rule_sync_quickfix_specialist`):** Audits rule presence, repairs missing rules, and maintains synchronization between global and local rules.

---

## 📐 19. Mandatory Single-Row Section Headings & Sub-Headings Standard
- **Single-Row Sub-Headings Rule:** Subheadings and eyebrow badges must never wrap to multiple rows. Apply `whitespace-nowrap`, `max-w-full`, and truncation or responsive scaling (`truncate sm:overflow-visible`).
- **Single-Row Main Section Headings:** Main section headings (`<h2>`) must be styled with responsive typography gradients (e.g., `text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] xl:text-5xl`) and `whitespace-normal sm:whitespace-nowrap` so they remain on a single line on desktop and tablet.
- **Automated Verification:** Retain automated test coverage confirming single-row heading invariants.

---

## 📌 20. Project Feature Memory Tracking
- Maintain an append-only `project_feature_memory.md` at the project root documenting features, modules, and changes.
- **Mandatory 3-Part Diagnostic Specification for Bugs & Refactoring:**
  1. **Problem Summary & Detailed Bullet Points**
  2. **Solution Summary & Detailed Bullet Points**
  3. **7-Column Diagnostic Matrix:**
     | S.No. / ID | Target File / Location | Root Cause & Failure Mechanism | Proposed Fix | Post-Fix Impact & System Value | Assigned Phase # | Verification Test Gate |
- Managed by `project_feature_memory_manager`.

---

## 🎨 22. vibe_coding_temp/ Ephemeral Workspace, Phase Prompts & Automation Scripts Standard
- **Root Ephemeral Container (`vibe_coding_temp/`):** Dedicated workspace for complex, multi-phase initiatives. Prevents clutter across project root.
- **Standard 6-Subfolder Architecture:**
  1. `prompts/`: Master orchestration `INDEX.md` and phased execution decks (`phase_*.md`).
  2. `scripts/`: Token-saving runners, one-off automation, and prototype scripts.
  3. `docs/`: Working notes, draft specs, and architecture scratchpads.
  4. `media/`: Wireframes, visual mockups, and screenshots.
  5. `sandbox/`: Isolated proofs-of-concept and exploratory prototypes.
  6. `benchmarks/`: Profiling logs, performance traces, and render benchmarks.
- **Hierarchical Subagent Architecture:** `vibe_coding_architect` oversees workspace hygiene; `phase_prompt_architect` drafts phased prompt decks.
- **Mandatory 7 Core Sections per Phase Prompt:**
  1. Objective
  2. Prerequisites & Dependencies
  3. Technical Context & Clickable File Links
  4. Step-by-Step Surgical Instructions
  5. Constraints & Invariants
  6. Expected Deliverables
  7. Verification Gates
- **Git Protection & Safe Pruning:** Excluded via `.gitignore`. Upon Grade A+ QA signoff, architectural knowledge is crystallized into `memory.md`, followed by safe pruning of task prompt folders.

---

## 🧠 23. Universal Mandatory Stage-by-Stage Memory Synchronization & Real-Time State Preservation Rule
- **Mandatory Two-Tier Sync:**
  - **Tier 1 (Sub-phase updates):** Real-time update of [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) upon completing any subtask or test suite.
  - **Tier 2 (Final State Locking):** State locked and verified prior to presenting final report to user.
- **Zero-Scan Operational Guarantee:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) retains active focus, completed tasks, pending tasks, modified files, and test results so new AI models understand complete project state in under 5 seconds without directory scans.
- **Atomic Parallel Aggregation:** Outputs from concurrent subagents are aggregated and written atomically to prevent race conditions.
- **Dedicated Subagent (`memory_sync_sentinel`):** Governs memory synchronization and blocks completion if memory is stale.

---

## 🎯 24. Mandatory Default /grill-me & Dynamic /teamwork Protocols

### 24.1 Mandatory Default /grill-me Pre-Task Interview Protocol
- **100% Active by Default:** Active across all sessions without requiring the user to type `/grill-me`.
- **Direct CEO Execution:** The Main Agent (CEO) exclusively conducts user interviews using `ask_question`.
- **Interview Guidelines:** One question at a time via `ask_question`, recommended option first (`(Recommended)`), explore codebase before asking, iterate until complete shared understanding.
- **Read-Only Exception:** Quick factual queries can be answered directly; code mutations mandate interview alignment.

### 24.2 Dynamic /teamwork Protocol
- **Per-Task Autonomous Decision:** The CEO determines autonomously whether to engage multi-agent `/teamwork` based on task scope and complexity.
- **Multi-Agent Orchestration:** Decomposes complex projects across high-impact parallel subagents and orchestrates integration.

---

## ⚡ 25. Dynamic AI Model Selection & Thinking Budget Optimization Standard
- **3-Tier Complexity Matrix:**
  1. **Low Complexity (`flash_lite` / low thinking):** Scripts, copy tweaks, documentation, `changes_log/`, git operations.
  2. **Medium Complexity (`flash` / medium thinking):** Feature coding, UI components, test suites, bug fixes.
  3. **High Complexity (`pro` / high thinking):** Core architecture (HLD/LLD), cryptography, security audits, deep debugging.
- **Dedicated Subagent (`model_thinking_optimizer`):** Formulates routing recommendations prior to launching subagents.
- **User Explicit Override Supremacy:** Explicit user model instructions take precedence over automated tier selection.

---

## 🧹 26. Universal Mandatory Subagent Background Task Hygiene & Zero-Hang Termination Standard
- **Mandatory Pre-Handoff Task Audit:** Prior to reporting completion to the CEO, subagents must call `manage_task(Action: 'list')`.
- **Zero-Hang Invariant:** Terminate any stray or hung background processes using `manage_task(Action: 'kill', TaskId: ...)` unless explicitly marked as a persistent daemon (`IsDaemon=true`).
- **Instant Idle Transition:** Guarantees clean task termination and prevents misleading "Work in Progress" UI states.
