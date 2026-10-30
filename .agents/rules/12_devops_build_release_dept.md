# Department 12: DevOps, Build & Release Management

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/archive/universal_rules.md) (Archived canonical reference)

---

## 🚀 1. Mission & Department Scope

The DevOps, Build & Release Management Department (Dept 12) governs Continuous Integration (CI), Continuous Delivery (CD), deterministic builds, release quality gates, Git Flow branching strategies, and strict compliance with the project-level Changes Log standard.

This department ensures every artifact advancing toward production is 100% buildable, verified, and audited.

---

## 🛑 2. Mandatory Build Verification Gates

### 2.1 Strict Zero-Error Build Mandate
- Prior to committing, merging, or releasing any codebase modifications, the following checks must succeed locally with zero errors:
  1. **Lockfile Integrity:** `npm ci`
  2. **Typecheck Gate:** `npm run typecheck` or `tsc --noEmit`
  3. **Linter Gate:** `npm run lint`
  4. **Compiler & Bundler Gate:** `npm run build`
  5. **Automated Test Suite:** `npm test` or `task test`
  6. **Secret Audit Gate (Rule 10 & 15):** `gitleaks detect --redact` (Zero secret leaks tolerated before commit/push)
  7. **Rules Health & Integrity Gate (Rule 27):** `npm run rules:check` or `task rules:check` (Whenever any rule, documentation, configuration, or structural change is made, `npm run rules:check` MUST be executed to verify zero truncation, 100% link validity, language purity, and binary sync before declaring completion.)
- If any single verification gate fails, the release sequence is immediately **BLOCKED**.

### 2.2 Deterministic Script-First & Taskfile Execution Standard
- Mandate 1-click script execution for builds, syncs, and verification tasks; eliminate manual file editing when deterministic scripts exist.
- **Taskfile / go-task Standard:** Standardize cross-platform operations via `Taskfile.yml` (`task`) alongside npm for one-word commands:
  - `task test` — run comprehensive automated test matrices
  - `task sync` — deterministic repository synchronization
  - `task rules:check` — verify rules health and binary synchronization
  - `task audit` — execute `gitleaks` secret audit and dependency scans

---

## 🐙 3. Git Flow & Semantic Versioning Standards

### 3.1 Developer Git Identity (Rule 16 Compliance)
- Every repository commit must be strictly authored as Atul Verma (`aiprincekumar` / `aiprincekumar010100@gmail.com`).

### 3.2 Semantic Versioning (SemVer 2.0.0)
- **MAJOR (X.0.0):** Backward-incompatible breaking changes.
- **MINOR (0.X.0):** Backward-compatible functional enhancements.
- **PATCH (0.0.X):** Backward-compatible bug fixes and patches.

### 3.3 Conventional Commits Standard
- `feat(auth): add OAuth2 Google login flow`
- `fix(cart): resolve race condition in quantity update`
- `docs(api): update OpenAPI spec for orders endpoint`
- `refactor(db): optimize user query composite index`

### 3.4 GitHub Operations, Micro-Commit Checkpoints & Remote Push Gatekeeper (Rule 15 Compliance)
- **Specialist Delegation:** All Git and GitHub operations are delegated strictly to `github_operations_specialist` (or executed via standardized deterministic scripts `git_sync.ps1`). The Supreme CEO never executes direct Git transactions.
- **Autonomous Local Micro-Commit Cadence:**
  - On EVERY SINGLE change or logical modification, autonomously perform a local `git commit` immediately without asking or interrupting the user. Never prompt the user for local commits.
  - Immediately after creating the local commit, notify and inform the user with a concise status update: `"Local commit created: [commit-hash] [commit-message]"` (e.g. Hindi status notification: `"Haan, local me commit ho chuka hai [hash/message]"`).
- **Strict Remote Git Gatekeeper (Hard Lock):**
  - Absolute prohibition on autonomous remote `git push`. Changes remain strictly local until explicit user permission is granted.
  - Mandatory `gitleaks detect --redact` secret scan must execute with zero detected leaks prior to presenting user confirmation options.
- **Task-Completion Interactive Gate (`ask_question`):**
  - At the completion of the entire task/workflow (all modifications complete, build verified, test suites passing), present an interactive 2-option choice via `ask_question` (exactly two options):
    1. `(Recommended) Push committed changes to GitHub online` (Push committed changes online to GitHub with pre-push gitleaks check and 3-point terminal proof; Hindi equivalent: `(Recommended) GitHub par commit changes push karna`).
    2. `Do not push yet because testing is pending` (Do not push to remote, keep changes local because testing and manual inspection are pending; Hindi equivalent: `Nahi, abhi rahne do kyonki testing pending hai`).
- **3-Point Terminal Proof Mandate:**
  - Remote operations mandate raw terminal verification output before declaring completion:
    1. `git log -1` raw commit hash and message.
    2. `git push` remote server response.
    3. `git status` confirming clean working tree.

---

## 📜 4. Project-Level Changes Log Management (Rule 6 Compliance)

Every codebase modification must be recorded across the 5 tiers of the project's `changes_log/` directory structure:
```
changes_log/
  ├── summary/changes_summary.md
  ├── master/master_changes_log.md
  ├── daily/YYYY-MM-DD/
  ├── entries/YYYY-MM-DD/change_<ID>_<Timestamp>.md
  └── recent_10/
```

### 4.1 Automated Token-Free Changelog Generation (`git-cliff`)
- Integrate `git-cliff` for instantaneous (0.02s), token-free Conventional Commit changelog generation.
- Generates structured, publication-ready markdown release notes and changelogs without consuming LLM context tokens or risking hallucinations.
- Bridges git history directly into `changes_log/` release documentation.

### 4.2 Automated 5-Tier Changes Log Engine (`changes_log_engine.py`)
- **Deterministic Changes Log Runner:** `scripts/audit/changes_log_engine.py` provides an automated engine for creating, synchronizing, and auditing the project's 5-tier changes log structure.
- **Granular Entry Creation & Rollback Plans:** Creates structured entries in `entries/YYYY-MM-DD/change_<ID>_<Timestamp>.md` with detailed before/after diffs, exact lines, rationale, and rollback plans.
- **Multi-Tier Cascade & FIFO Buffer:** Synchronizes `summary/changes_summary.md`, `master/master_changes_log.md`, `daily/YYYY-MM-DD/daily_master_log.md`, and maintains the 10-file rolling buffer in `recent_10/`.
- **UTF-8 with BOM Standard:** Writes all changes log markdown files with Byte Order Mark (`0xEF, 0xBB, 0xBF`) to ensure clean rendering in Windows environments.
- **CLI Commands:**
  - `python scripts/audit/changes_log_engine.py new --title "<Title>" --file "<File>" --summary "<Summary>"`
  - `python scripts/audit/changes_log_engine.py audit` (Verifies integrity across all 5 tiers)

### 4.3 Granular Atomic Micro-Entries Protocol (Approach 2 Compliance)
Whenever a task encompasses multiple distinct intents (e.g., UI styling, feature addition, and bug fixing), agents MUST decompose the changes into sequential atomic micro-entries rather than conflating them into a single monolithic log.
Each facet must be recorded with its own scoped Change ID using `python scripts/audit/changes_log_engine.py --files "<target_files>" -m "<type(scope): message>"` with optional Rule 20 diagnostic flags for fixes.
This ensures isolated rollback boundaries, pristine git blame clarity, and zero cognitive bloat.

---

## 🧑‍💼 5. Departmental Roles & Dedicated Subagents

To enforce specialization of labor and enterprise rigor, 4 dedicated enterprise job roles and their corresponding subagent archetypes are established:

### 5.1 CI/CD Automation Pipeline Engineer (CI/CD Pipeline Engineer)
- **Dedicated Subagent Role:** `CI/CD Pipeline Engineer`
- **Scope & Responsibilities:**
  - Architect robust GitHub Actions CI/CD workflows, configure `gitleaks` secret scanner gates, build artifact caching, parallelize automated test matrices via `task`, and engineer secure zero-downtime deployment pipelines.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "CI/CD Pipeline Engineer",
  "Prompt": "Architect robust GitHub Actions CI/CD workflows, integrate gitleaks security checks, parallelize automated test matrices via task, and engineer secure zero-downtime deployment pipelines."
}
```

### 5.2 Build System & Compiler Engineer (Build Systems Engineer)
- **Dedicated Subagent Role:** `Build Systems Engineer`
- **Scope & Responsibilities:**
  - Optimize build toolchain configurations (Vite, Turborepo, Taskfile, esbuild).
  - Enforce non-negotiable zero-error compilation gates (`npm run build`).
  - Implement incremental build caching and eliminate build-time degradation.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Build Systems Engineer",
  "Prompt": "Optimize build toolchain configurations (Vite/Turborepo/Taskfile), enforce zero-error compilation gates, implement incremental build caching, and eliminate build-time degradation."
}
```

### 5.3 Release Manager & Changes Log Gatekeeper (Release Manager)
- **Dedicated Subagent Role:** `Release Manager`
- **Scope & Responsibilities:**
  - Coordinate Semantic Versioning (SemVer) and Git Flow release branching.
  - Execute `git-cliff` for automated, zero-token conventional changelog generation.
  - Verify compliance with Universal Rule 6 `changes_log/` audit entries.
  - Authorize production releases strictly upon passing all verification suites.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Release Manager",
  "Prompt": "Orchestrate SemVer release workflows, generate changelogs using git-cliff, maintain strict Git Flow release branching, gate releases on passing verification suites, and enforce Rule 6 changes_log audit records."
}
```

### 5.4 Containerization & Artifact Registry Specialist (Containerization Specialist)
- **Dedicated Subagent Role:** `Containerization Specialist`
- **Scope & Responsibilities:**
  - Author hardened, minimal-footprint multi-stage Dockerfiles.
  - Enforce non-root security contexts and eliminate container base-image CVEs.
  - Configure secure container image artifact registry tagging and publication.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Containerization Specialist",
  "Prompt": "Author hardened multi-stage Dockerfiles with non-root security contexts, minimize container image footprint, eliminate container CVEs, and configure artifact registry pushes."
}
```

---

## 🚦 6. Department Handoff & Verification Gates

1. **Gate 12-A (Build & Test Pass):** Production build generated with zero warnings or errors (`npm run build` & `task test` / `npm test`).
2. **Gate 12-B (Security Audit Pass):** `gitleaks detect` clean exit with zero credentials or exposed keys.
3. **Gate 12-C (Changes Log & Changelog Audit):** Verified audit record registered in `changes_log/` and updated via `git-cliff`.
4. **Gate 12-D (Rules Health & Integrity Sentinel):** `npm run rules:check` certified with 100% PASS for all rules, documentation, and configuration updates (Rule 27).
5. **Downstream Handoff:** Upon release packaging, ownership advances to **Dept 13: SRE & Backup** and **Dept 14: Telemetry**.
