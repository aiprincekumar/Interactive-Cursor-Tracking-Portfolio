# Special Operations & SRE Engineering Guide

> **Universal Special Operations Reference:**
> - **Master Navigator:** [`master_rules_navigator.md`](master_rules_navigator.md)
> - **Foundation Core:** [`foundation_core.md`](foundation_core.md)
> - **Dynamic Routing Matrix:** [`dynamic_departments_matrix.md`](dynamic_departments_matrix.md)
> - **Department Index & Archive:** [`dept_index.md`](dept_index.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Developer Profile:** Atul Verma (`aiprincekumar` / `aiprincekumar010100@gmail.com` / [GitHub Profile](https://github.com/aiprincekumar))

---

## 💾 1. Antigravity Backup & SRE Standard (Rule 5)

Antigravity operates a dedicated backup infrastructure to guarantee 100% preservation of all configurations, skills, rules, and manifests:

- **Master Container Path:** [`C:\Users\Atul Verma\Desktop\Antigravity Backup\`](file:///C:/Users/Atul%20Verma/Desktop/Antigravity%20Backup/)
- **Dual Sub-Folder Architecture:**
  1. **Manual Backup (`Manual_Backup/`):** Permanent indefinite protection. Created before major architectural mutations or refactoring operations. Standalone runners: `backup_manual.bat` and `backup_manual.ps1`.
  2. **Daily Backup (`Daily_Backup/`):** Automated routine snapshots with strict 10-day FIFO retention. On creation of the 11th daily snapshot, the oldest archive is automatically purged. Standalone runners: `backup_daily.bat` and `backup_daily.ps1`.
- **Automated Runner:** `scripts/backup/backup_manager.ps1` handles snapshot packaging, timestamping, and FIFO pruning.
- **1-Click Rule In Hindi Engine:** Standalone zero-token translation runner (`Run_Rule_In_Hindi.bat`) with incremental MD5 caching and 3-snapshot FIFO archiving in `Rule In Hindi/`.

---

## 📜 2. Project Changes Log Management & Token-Free Changelogs (Rule 6)

Every engineering change across the ecosystem is recorded in a standardized 5-tier audit architecture:

1. **`summary/changes_summary.md`:** Executive changelog overview with quick statistics.
2. **`master/master_changes_log.md`:** Comprehensive chronological master record.
3. **`daily/YYYY-MM-DD/`:** Daily consolidated activity snapshots.
4. **`entries/YYYY-MM-DD/change_<ID>_<Timestamp>.md`:** Granular forensic change entries.
5. **`recent_10/`:** Rolling 10 most recent change records for fast agent inspection.

- **Token-Free Changelog Automation (`git-cliff`):**
  Integrate `git-cliff` for instantaneous (0.02s) token-free Conventional Commit changelog generation:
  ```bash
  git-cliff --output CHANGELOG.md
  ```
- **Changes Log Engine:** Governed by `scripts/audit/changes_log_engine.py` for automated change recording, diff capture, and audit validation.

---

## 🔤 3. UTF-8 with BOM Standard & Windows Toolchain Resilience (Rule 5 & 8)

- **Byte Order Mark Requirement:** All rule documents, backup manifests, and system configurations must be encoded as UTF-8 with BOM (`0xEF, 0xBB, 0xBF`).
- **Rationale:** Windows PowerShell 5.1, cmd.exe, and native Windows APIs misinterpret UTF-8 files lacking BOM as Windows-1252 / ANSI, causing character corruption and mojibake.
- **Deterministic Application:** Automated self-healing via `node scripts/check-rules-health.js --fix` prepends missing BOM bytes automatically.

---

## 🔒 4. Secret Scanning & Credential Governance (Rule 10 & 12)

- **Mandatory Pre-Commit & Pre-Push Audits:**
  No commit or remote push is permitted without passing `gitleaks` secret detection:
  ```bash
  gitleaks detect --redact
  ```
- **Target Patterns:** GitHub tokens (`ghp_*`, `github_pat_*`), AWS access keys (`AKIA*`), private keys (`BEGIN PRIVATE KEY`), and provider API keys (`sk-*`, `AIzaSy*`).
- **Standalone Detector:** `scripts/security/secret_scanner.py` provides regex classification and false-positive suppression.

---

## 🧠 5. Feature Memory & Diagnostic Tracking (Rule 20)

Document defects, bugs, and architectural modifications using the standardized 7-column Diagnostic Matrix:

| S.No | File Path | Root Cause | Proposed Fix | Post-Fix Impact | Phase # | Test Gate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | `path/to/file` | Root cause description | Fix implementation details | Impact on ecosystem | Phase # | `npm test` exit code 0 |

Maintain active diagnostic records inside `project_feature_memory.md` and synchronize critical milestones into [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md).

---

## 🔄 6. Stage-by-Stage Memory Synchronization Protocol (Rule 23)

- **Live Dynamic State Ledger:** Persisted in `.agents/state/decision_gate_state.json`.
- **Synchronization Timing:** Section `0. Live Agent State & Stateful Handoff Ledger` in [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) must be updated in real time before and after every subagent dispatch or milestone transition.
- **Memory Sentinel:** `memory_sync_sentinel` audits cross-workspace state preservation.

---

## 🛠️ 7. Standalone Deterministic Automation Runners Manifest

- **Changes Log Automation:** `scripts/audit/changes_log_engine.py` (Rule 6 & Dept 12)
- **Antigravity Backup Automation:** `scripts/backup/backup_manager.ps1` (Rule 5 & Dept 13)
- **Pre-Commit Secret Scanner:** `scripts/security/secret_scanner.py` (Rule 10, 12, 15 & Dept 10)
- **Rules Health Sentinel:** `scripts/check-rules-health.js` (Rule 27)
- **Decision Gate Validator:** `scripts/test_decision_gate.mjs` (Rule 1 & Architecture)

---

## 🔄 8. SRE Operational Runbook: Server Restart Recovery & Port Hygiene (Rule 26)

Operational procedures for recovering from server restarts, system reloads, and background process interruptions:

### 8.1 Restart Detection & Diagnostics
1. **Notice Ingestion:** When the system emits a `[Notice]` indicating background tasks were stopped or disconnected, immediately execute `manage_task` with action `list`.
2. **Process Health Matrix:**
   - `waiting`: Process is idle on board (healthy; no action needed).
   - `working`: Active execution in turn (healthy).
   - `stopped`: Process not loaded due to restart; requires revival.
   - `killed`: Permanently terminated; do not attempt revival.

### 8.2 Zero-Scan State Reconstruction Procedure
- **Anchor Working Memory:** Immediately read Section 0 of [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) (`0. Live Agent State & Stateful Handoff Ledger`).
- **Load Gate Ledger:** Inspect `.agents/state/decision_gate_state.json` to identify:
  - Active `taskId` and milestone in progress.
  - State machine phase (`currentState`).
  - Active authorization token (`AUTH-MGR-*`).
- **Zero-Scan Prohibition:** Do NOT execute blind scans (`dir /s`, `find`) across the workspace.

### 8.3 Port Conflict Defense & Zombie Clearance
Before restarting any service or dev server (e.g., Vite on port 5173):
1. **Check Port State:** Verify whether target ports are occupied by orphaned PIDs.
2. **Clean Dead Locks:** Terminate stale server processes gracefully before re-binding to prevent `EADDRINUSE` failures.
3. **PID Lockfile Clearance:** Remove orphaned `.pid` files or lockfiles left in `.agents/state/` or project temp directories.

### 8.4 Deterministic Execution Resumption
1. **Token Re-Verification:** Verify if existing `AUTH-MGR-*` token remains valid for the uncompleted phase.
2. **Targeted Subagent Dispatch:** Re-dispatch only the specific subagent responsible for the interrupted phase milestone.
3. **No Duplicate Execution:** Never re-run already verified milestones or re-execute specialist gates if already recorded as clean.
