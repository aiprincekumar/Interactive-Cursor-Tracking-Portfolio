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

---

## 🧠 3. Real-Time Working Memory Synchronization (Rule 23 Compliance)

- **Continuous Stage-by-Stage Memory Sync:** Update [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) in real time upon completing any milestone, feature, or architectural transition.
- **Zero-Scan State Preservation:** Immediately register new tools, project paths, and backup snapshots in `memory.md` so future sessions operate without recursive workspace scans.
- **Dedicated Subagent Oversight:** Enforced autonomously by `memory_sync_sentinel`.

---

## 🔤 4. UTF-8 with BOM Encoding Standard (Zero Mojibake)

- All backup documentation (`RESTORE_INSTRUCTIONS.md`, `PREREQUISITES_FRESH_OS.md`) and automation scripts must be saved in **UTF-8 with BOM (`0xEF, 0xBB, 0xBF`)** encoding to ensure clean parsing across Windows consoles and PowerShell environments.

---

## 🧑‍💼 5. Departmental Roles & Dedicated Subagents

To enforce specialization of labor and enterprise rigor, 5 dedicated enterprise job roles and their corresponding subagent archetypes are established:

### 5.1 Antigravity Backup Specialist (Antigravity Backup Specialist)
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

### 5.2 Site Reliability Engineer & Health Monitor (Site Reliability Engineer)
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

### 5.3 Disaster Recovery & Rollback Specialist (Disaster Recovery Specialist)
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

### 5.4 Global Working Memory Sentinel (Memory Sentinel)
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

### 5.5 Cloud FinOps & Cost Optimization Specialist (FinOps Cost Specialist)
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

---

## 🚦 6. Department Handoff & Verification Gates

1. **Gate 13-A (Backup Verification):** All 11 snapshot components verified in the backup manifest.
2. **Gate 13-B (Memory State Parity):** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) reflects current system state with 100% parity.
3. **Lifecycle Completion:** Upon SRE signoff, the operational release cycle is officially certified.
