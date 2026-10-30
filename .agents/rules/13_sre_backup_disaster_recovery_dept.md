# Department 13: SRE, Backup & Disaster Recovery

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/archive/universal_rules.md) (Archived canonical reference)

---

## 💾 1. Mission & Department Scope

The Site Reliability Engineering (SRE), Backup & Disaster Recovery Department (Dept 13) is the supreme guardian of development environment stability, project snapshots, AI configuration integrity, backup and restore runbooks, and real-time working memory synchronization.

This department guarantees Zero Data Loss, rapid recovery capabilities, and uninterrupted state preservation.

---

## 🛡️ 2. Dual Sub-Folder Backup Architecture (Rule 5 Compliance)

The primary desktop backup container `C:\Users\Atul Verma\Desktop\Antigravity Backup\` operates with 2 dedicated sub-folders:

```
C:\Users\Atul Verma\Desktop\Antigravity Backup\
  ├── PREREQUISITES_FRESH_OS.md       (Clean OS prerequisites)
  ├── Manual_Backup\                  (Permanent indefinite retention)
  │     ├── backup_manual.bat         (1-click manual runner)
  │     ├── backup_manual.ps1
  │     └── Manual_Backup_YYYY-MM-DD_HH-mm-ss\
  └── Daily_Backup\                   (10-day FIFO rotation)
        ├── backup_daily.bat          (1-click automated runner)
        ├── backup_daily.ps1
        └── Daily_Backup_YYYY-MM-DD_HH-mm-ss\
```

### 2.1 Identical Backup Interior Standards
Every backup snapshot preserves the following 11 components:
1. `memory.md` (Global working memory preserved at snapshot root)
2. `rules/` (All departmental and foundation rules)
3. `config/` (Core settings and `scripts/` automation engines)
4. `skills/` (All 71+ custom and installed skills)
5. `plugins/` (Plugin definitions excluding node_modules)
6. `mcp/` (MCP server schemas and configuration)
7. `sidecars/` (Automation sidecars)
8. `backup_manifest.json` (Snapshot metadata and hash registry)
9. `PREREQUISITES_FRESH_OS.md`
10. `RESTORE_INSTRUCTIONS.md`
11. `restore.bat` and `restore.ps1` (1-click automated restore runners)

### 2.2 10-Day FIFO Pruning Policy
- `Daily_Backup/` retains a maximum of 10 daily snapshots.
- Upon creation of an 11th daily backup, the oldest snapshot directory is automatically purged via FIFO rotation.
- `Manual_Backup/` snapshots are preserved indefinitely and never pruned automatically.

### 2.3 Standalone Antigravity Backup Automation Engine (`backup_manager.ps1`)
- **Deterministic PowerShell Runner:** `scripts/backup/backup_manager.ps1` provides an automated, standalone backup and FIFO pruning engine for workspaces and the Antigravity ecosystem.
- **Dual Container Routing:** Directly creates snapshots in `Manual_Backup/` (permanent retention) or `Daily_Backup/` (10-day FIFO rotation) under `C:\Users\Atul Verma\Desktop\Antigravity Backup\`.
- **Snapshot Manifest & Integrity Hash:** Generates `backup_manifest.json` with SHA-256 hashes for all preserved files, encoded in UTF-8 with BOM (`0xEF, 0xBB, 0xBF`).
- **Bloat Filtering & FIFO Pruning:** Excludes transient directories (`node_modules`, `.git`, `dist`, `.cache`, `tmp`, `vibe_coding_temp`) and automatically prunes the oldest daily backups beyond 10 snapshots.
- **Execution Syntax:**
  - `powershell -ExecutionPolicy Bypass -File .\scripts\backup\backup_manager.ps1 -BackupType Daily`
  - `powershell -ExecutionPolicy Bypass -File .\scripts\backup\backup_manager.ps1 -BackupType Manual`
  - `powershell -ExecutionPolicy Bypass -File .\scripts\backup\backup_manager.ps1 -DryRun` (Simulate without copying/deleting)

---

## 🇮🇳 3. 'Rule In Hindi' 1-Click Translation & Mirror Engine (Zero-Token Protocol)

The 'Rule In Hindi' engine autonomously mirrors all global master rules and project rules into Hindi with zero AI token cost, 1-click execution, and strict snapshot hygiene.

### 3.1 Master Execution Paths & Runners
- **Master Root Container:** [`C:\Users\Atul Verma\Desktop\Antigravity Backup\Rule In Hindi\`](file:///C:/Users/Atul%20Verma/Desktop/Antigravity%20Backup/Rule%20In%20Hindi/)
- **Desktop 1-Click Runner:** [`C:\Users\Atul Verma\Desktop\Run_Rule_In_Hindi.bat`](file:///C:/Users/Atul%20Verma/Desktop/Run_Rule_In_Hindi.bat)
- **Backup Container Batch Runner:** [`C:\Users\Atul Verma\Desktop\Antigravity Backup\Rule In Hindi\run_rule_in_hindi.bat`](file:///C:/Users/Atul%20Verma/Desktop/Antigravity%20Backup/Rule%20In%20Hindi/run_rule_in_hindi.bat)
- **PowerShell Engine Runner:** [`C:\Users\Atul Verma\Desktop\Antigravity Backup\Rule In Hindi\run_rule_in_hindi.ps1`](file:///C:/Users/Atul%20Verma/Desktop/Antigravity%20Backup/Rule%20In%20Hindi/run_rule_in_hindi.ps1)
- **Python Automation Engine:** [`scripts/translate_engine.py`](file:///C:/Users/Atul%20Verma/Desktop/Antigravity%20Backup/Rule%20In%20Hindi/scripts/translate_engine.py)

### 3.2 Zero-Token Cost & Incremental Caching Architecture
1. **Zero LLM Token Cost:** Uses Google Translate via `deep-translator` and high-speed GTX endpoints. Never spends Gemini, OpenAI, Claude, or any LLM tokens (100% free, deterministic execution).
2. **Incremental MD5 Caching (`translation_cache.json`):** Tracks MD5 hashes of all English source rules. Unchanged files bypass network calls in 0.01 seconds. Only new or modified files are re-translated.
3. **Markdown Masking & Whitelist:** Masks code fences, inline backticks, file URIs, and 45+ technical vocabulary keywords (`technical_glossary.json`) to preserve technical syntax and terms in pristine English.
4. **Devanagari UTF-8 with BOM Standard:** Generates Markdown files with Byte Order Mark (`0xEF, 0xBB, 0xBF`), guaranteeing zero Mojibake across Windows Command Prompt (`chcp 65001`), PowerShell, and editors.
5. **Strict 3-Snapshot FIFO Retention:** Generates timestamped archives in `Snapshots/Snapshot_YYYY-MM-DD_HH-mm-ss/` with `snapshot_manifest.json`. Automatically retains a maximum of 3 snapshots, pruning the oldest once the 4th snapshot is generated. Live mirror is maintained under `Latest/` (`Global/` and `Project/`).

### 3.3 Natural Language Triggers & Mandatory Subagent Delegation
Whenever the user issues any translation request, such as:
- Hindi Language Intent Triggers: "convert all rules to Hindi", "translate all rules to Hindi"
- Transliterated / Hinglish Triggers: `"isko hindi me convert kar do sabhi rule ko"`, `"rules ko hindi me badlo"`, `"sabhi rules ko hindi me translate karo"`
- English Triggers: `"translate rules to hindi"`, `"convert all rules to hindi"`, `"run rule in hindi"`

**Supreme CEO / Main Agent Delegation Mandate:**
- The Main Agent must **NEVER** spend LLM tokens manually translating rules line by line.
- The Main Agent must **IMMEDIATELY** delegate the task to the specialized subagent `rule_in_hindi_specialist` to run the 1-click batch runner (`C:\Users\Atul Verma\Desktop\Antigravity Backup\Rule In Hindi\run_rule_in_hindi.bat` or `C:\Users\Atul Verma\Desktop\Run_Rule_In_Hindi.bat`).

---

## 🧠 4. Real-Time Working Memory Synchronization (Rule 23 Compliance)

- **Continuous Stage-by-Stage Memory Sync:** Update [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) in real time upon completing any milestone, feature, or architectural transition.
- **Zero-Scan State Preservation:** Immediately register new tools, project paths, and backup snapshots in `memory.md` so future sessions operate without recursive workspace scans.
- **Dedicated Subagent Oversight:** Enforced autonomously by `memory_sync_sentinel`.

---

## 🔤 5. UTF-8 with BOM Encoding Standard (Zero Mojibake)

- All backup documentation (`RESTORE_INSTRUCTIONS.md`, `PREREQUISITES_FRESH_OS.md`) and automation scripts must be saved in **UTF-8 with BOM (`0xEF, 0xBB, 0xBF`)** encoding to ensure clean parsing across Windows consoles and PowerShell environments.

---

## 🧑‍💼 6. Departmental Roles & Dedicated Subagents

To enforce specialization of labor and enterprise rigor, 7 dedicated enterprise job roles and their corresponding subagent archetypes are established:

### 6.1 Antigravity Backup Specialist (Antigravity Backup Specialist)
- **Dedicated Subagent Role:** `Antigravity Backup Specialist`
- **Scope & Responsibilities:**
  - Enforce Rule 5 dual-folder backup architecture (`Manual_Backup/`, `Daily_Backup/`).
  - Oversee strict 10-day FIFO pruning on `Daily_Backup/`.
  - Maintain 1-click restore runners (`restore.bat`/`.ps1`) and UTF-8 with BOM encoding standards.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Antigravity Backup Specialist",
  "Prompt": "Execute Rule 5 dual-folder backup architecture, manage strict 10-day FIFO pruning on Daily_Backup, generate 1-click restore scripts, and enforce UTF-8 with BOM encoding."
}
```

### 6.2 Site Reliability Engineer & Health Monitor (Site Reliability Engineer)
- **Dedicated Subagent Role:** `Site Reliability Engineer`
- **Scope & Responsibilities:**
  - Define and monitor Service Level Indicators (SLIs), Service Level Objectives (SLOs), and error budgets.
  - Implement synthetic automated health probes ensuring 99.99% availability targets.
  - Architect automated self-healing triggers and notification cascades during system faults.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Site Reliability Engineer",
  "Prompt": "Define and track SLI/SLO metrics, manage error budgets, implement automated synthetic health probes, and architect self-healing infrastructure components."
}
```

### 6.3 Disaster Recovery & Rollback Specialist (Disaster Recovery Specialist)
- **Dedicated Subagent Role:** `Disaster Recovery Specialist`
- **Scope & Responsibilities:**
  - Formulate disaster recovery playbooks satisfying RTO < 15m and RPO < 1m thresholds.
  - Schedule automated snapshot restore drills to verify backup archive integrity.
  - Guarantee blue-green zero-downtime rollback readiness across all environments.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Disaster Recovery Specialist",
  "Prompt": "Design disaster recovery playbooks meeting RTO < 15m and RPO < 1m thresholds, test automated snapshot restore procedures, and validate blue-green instant rollback readiness."
}
```

### 6.4 Global Working Memory Sentinel (Memory Sentinel)
- **Dedicated Subagent Role:** `Memory Sentinel`
- **Scope & Responsibilities:**
  - Enforce continuous micro-synchronization of [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) per Rule 23.
  - Perform atomic aggregation of outputs from parallel subagents.
  - Safeguard the integrity of the pre-mapped environment topology and zero-scan state.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Memory Sentinel",
  "Prompt": "Enforce continuous stage-by-stage synchronization of memory.md, aggregate parallel subagent outputs atomically, and preserve zero-scan state integrity per Rule 23."
}
```

### 6.5 Cloud FinOps & Cost Optimization Specialist (FinOps Cost Specialist)
- **Dedicated Subagent Role:** `FinOps Cost Specialist`
- **Scope & Responsibilities:**
  - Audit and right-size cloud compute, serverless invocations, and storage tiers.
  - Manage LLM API token budgets, prompt caching economics, and model tier routing.
  - Prevent cost anomalies and resource leaks via automated budget alerts.
  - Track unit economics per feature and deliver cost forecasting models.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "FinOps Cost Specialist",
  "Prompt": "Conduct cloud infrastructure right-sizing, manage LLM token budgets and prompt caching economics, prevent compute wastage, and enforce FinOps cost optimization governance."
}
```

### 6.6 Chaos Engineering & Resilience Specialist (Chaos Resilience Specialist)
- **Dedicated Subagent Role:** `Chaos Resilience Specialist`
- **Scope & Responsibilities:**
  - Design and orchestrate proactive chaos engineering experiments (Chaos Mesh, Gremlin, LitmusChaos).
  - Simulate infrastructure failures (network latency, packet drop, disk pressure, node eviction, cascading service outages).
  - Verify system self-healing, automatic failover mechanisms, circuit-breaker tripping, and degradation resilience.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Chaos Resilience Specialist",
  "Prompt": "Mandatory: First load and adhere to .agents/rules/13_sre_backup_disaster_recovery_dept.md (or C:\\Users\\Atul Verma\\.gemini\\config\\rules\\13_sre_backup_disaster_recovery_dept.md) and memory.md before executing instructions. Design and execute chaos engineering experiments, simulate latency spikes and service outages, test automated failovers, and certify system self-healing capabilities."
}
```

### 6.7 Rule In Hindi Specialist (Rule In Hindi Specialist)
- **Dedicated Subagent Role:** `Rule In Hindi Specialist`
- **Subagent Identifier:** `rule_in_hindi_specialist`
- **Scope & Responsibilities:**
  - Execute the 1-click batch runner `C:\Users\Atul Verma\Desktop\Antigravity Backup\Rule In Hindi\run_rule_in_hindi.bat` (or `Run_Rule_In_Hindi.bat`).
  - Guarantee zero LLM token consumption by utilizing the local translation automation engine.
  - Validate incremental MD5 cache skips, UTF-8 with BOM Devanagari encoding, and 3-snapshot FIFO rotation.
  - Audit execution status in `scripts/engine.log` and verify `snapshot_manifest.json` generation.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "rule_in_hindi_specialist",
  "Role": "Rule In Hindi Specialist",
  "Prompt": "Mandatory: First load and adhere to .agents/rules/13_sre_backup_disaster_recovery_dept.md (or C:\\Users\\Atul Verma\\.gemini\\config\\rules\\13_sre_backup_disaster_recovery_dept.md) and memory.md before executing instructions. Execute the 1-Click Rule In Hindi Translation & Backup Engine via run_rule_in_hindi.bat, verify MD5 cache and 3-snapshot FIFO rotation, confirm zero token expenditure, and report snapshot status."
}
```

---

## 🚦 7. Department Handoff & Verification Gates

1. **Gate 13-A (Backup Verification):** All 11 snapshot components verified in the backup manifest.
2. **Gate 13-B (Memory State Parity):** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) reflects current system state with 100% parity.
3. **Gate 13-C (Rule In Hindi Parity):** All global and project rules mirrored under `Rule In Hindi\Latest\` with valid `snapshot_manifest.json` and 3-snapshot FIFO adherence.
4. **Lifecycle Completion:** Upon SRE signoff, the operational release cycle is officially certified.
