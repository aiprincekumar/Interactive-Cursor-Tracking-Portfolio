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
  5. **Automated Test Suite:** `npm test`
- If any single verification gate fails, the release sequence is immediately **BLOCKED**.

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

---

## 🧑‍💼 5. Departmental Roles & Dedicated Subagents

To enforce specialization of labor and enterprise rigor, 4 dedicated enterprise job roles and their corresponding subagent archetypes are established:

### 5.1 CI/CD Automation Pipeline Engineer (CI/CD Pipeline Engineer)
- **Dedicated Subagent Role:** `CI/CD Pipeline Engineer`
- **Scope & Responsibilities:**
  - Architect robust GitHub Actions CI/CD workflows and deployment automations.
  - Configure build artifact caching and parallelize automated test matrices.
  - Engineer secure, automated zero-downtime deployment pipelines.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "CI/CD Pipeline Engineer",
  "Prompt": "Architect robust GitHub Actions CI/CD workflows, configure build artifact caching, parallelize automated test matrices, and engineer secure zero-downtime deployment pipelines."
}
```

### 5.2 Build System & Compiler Engineer (Build Systems Engineer)
- **Dedicated Subagent Role:** `Build Systems Engineer`
- **Scope & Responsibilities:**
  - Optimize build toolchain configurations (Vite, Turborepo, esbuild).
  - Enforce non-negotiable zero-error compilation gates (`npm run build`).
  - Implement incremental build caching and eliminate build-time degradation.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Build Systems Engineer",
  "Prompt": "Optimize build toolchain configurations (Vite/Turborepo), enforce zero-error compilation gates, implement incremental build caching, and eliminate build-time degradation."
}
```

### 5.3 Release Manager & Changes Log Gatekeeper (Release Manager)
- **Dedicated Subagent Role:** `Release Manager`
- **Scope & Responsibilities:**
  - Coordinate Semantic Versioning (SemVer) and Git Flow release branching.
  - Verify compliance with Universal Rule 6 `changes_log/` audit entries.
  - Authorize production releases strictly upon passing all verification suites.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Release Manager",
  "Prompt": "Orchestrate SemVer release workflows, maintain strict Git Flow release branching, gate releases on passing verification suites, and enforce Rule 6 changes_log audit records."
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

1. **Gate 12-A (Build & Test Pass):** Production build generated with zero warnings or errors.
2. **Gate 12-B (Changes Log Audit):** Verified audit record registered in `changes_log/`.
3. **Downstream Handoff:** Upon release packaging, ownership advances to **Dept 13: SRE & Backup** and **Dept 14: Telemetry**.
