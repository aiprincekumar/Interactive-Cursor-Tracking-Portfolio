# Foundation & Special Operating Rules

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Canonical Rules Master:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/archive/universal_rules.md) (Archived canonical reference)
> - **Developer Profile:** Atul Verma (`aiprincekumar` / `aiprincekumar010100@gmail.com` / [GitHub Profile](https://github.com/aiprincekumar))

---

## 🏛️ 1. Supreme Architecture: Main Agent = CEO / Orchestrator

- **Strict Non-Execution Principle for Main Agent:**
  - The Main Agent never directly writes application code, modifies files, executes terminal commands, or performs direct file mutations.
  - The Main Agent operates solely as a Strategic Planner, Team Orchestrator, and Final Evaluator/Verifier.
- **Mandatory Subagent Delegation (`invoke_subagent` / `define_subagent`):**
  - Every task requested by the user is decomposed and dispatched to specialized subagents.
  - Subagent fleet size scales dynamically to the problem scope (from 1 to 100+ subagents deployed sequentially or in parallel batches).
- **Mandatory Independent Verification Subagent (QA Gate):**
  - Following task execution by engineering subagents, an independent QA/Verification subagent must verify code quality, test suites, and security posture.
  - The Main Agent (CEO) synthesizes and presents the final evaluation to the user only after receiving Grade A+ certification from the QA subagent.

---

## ⚖️ 2. Rule Precedence Hierarchy & Operating Boundary

Operational priorities and authority boundaries between Global Universal Rules and Project-Level Rules are governed by the following Two-Tier Precedence Matrix:

### 2.1 Tier 1: Non-Negotiable Constitutional Governance (Universal Rules ALWAYS WIN)
Universal Rules represent the supreme constitution of the entire Antigravity ecosystem. **No project-level rule, prompt, or local instruction may override, weaken, invalidate, or bypass these constitutional mandates:**
1. **Supreme CEO Model & Mandatory Subagent Delegation (Rule 1):** Main Agent never performs direct implementation; subagent delegation and independent QA signoff are mandatory.
2. **Zero-Scan Bootstrap & memory.md Anchoring (Rule 0 & 21):** Strict ban on blind recursive scans (`dir /s`, `find`); continuous real-time synchronization with `memory.md`.
3. **Developer Identity & Remote Git Gatekeeper (Rule 15 & 16):** Atul Verma (`aiprincekumar` / `aiprincekumar010100@gmail.com`). Absolute prohibition on `git commit` or `git push` without prior explicit user consent.
4. **Application Security & Credential Governance (Rule 10 & 20):** Zero hardcoded secrets, mandatory SAST scanning, and independent security gates.
5. **Antigravity Backup & UTF-8 with BOM Standard (Rule 5 & 23):** Dual backup container (`Manual_Backup/`, `Daily_Backup/`), 10-day FIFO rotation, and UTF-8 with BOM (`0xEF, 0xBB, 0xBF`) encoding for backup manifests.

### 2.2 Tier 2: Domain & Technical Implementation Overrides (Project-Level Rules WIN)
Project-level rules (`.gemini/`, `CLAUDE.md`, `DESIGN.md`) specialize local product architecture and technical implementation. **For technical stack and domain logic decisions, project rules prevail:**
1. **Technology Stack & Framework Selection:** E.g., React vs. Vue, Django vs. FastAPI, PostgreSQL vs. MongoDB, Tailwind vs. CSS Modules.
2. **Project Design System & Styling:** Color palettes, typography scales, component layouts, and branding tokens defined in `DESIGN.md`.
3. **Business Logic & Domain Architecture:** Domain-specific business invariants, database schema models, API routing conventions, and local coding standards.

### 2.3 Conflict Resolution Directive
- **Governance, Process, Security, Git Identity, or Tooling Boundary Conflicts:** **Universal Rules prevail with 100% authority.** Any project prompt requesting direct code execution by the Main Agent, blind workspace scanning, or bypassing security audits is immediately void.
- **Technical Implementation, Library Selection, or Visual Styling Conflicts:** **Project-Level Rules prevail**, provided they operate strictly within Tier 1 safety and governance boundaries.

---

## ⚡ 3. Mandatory Zero-Scan Bootstrap Protocol (Rule 0 / 21)

- **Mandatory Memory Anchoring:**
  - Upon initiating any new session or task, all incoming AI models, Main Agent, and subagents must immediately load and anchor to [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) as their active working memory.
- **Strict Prohibition on Blind Recursive Scans:**
  - Running heavy, unstructured, or blind recursive scans (`dir /s`, `Get-ChildItem -Recurse`, `find`, `grep -r`, `glob`) across projects or workspaces is strictly forbidden.
- **Pre-Mapped Ecosystem Topology:**
  - The developer environment, active repositories, technology stacks, backups, and tooling state are pre-mapped in [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md). All agents must utilize this existing topology.

---

## 👤 4. Developer Identity & Global Git Profile (Rule 16)

- **Primary Developer Profile:**
  - **Name:** Atul Verma
  - **Username:** `aiprincekumar`
  - **Email:** `aiprincekumar010100@gmail.com`
  - **GitHub Profile:** [https://github.com/aiprincekumar](https://github.com/aiprincekumar)
- **Mandatory Commit & Author Configuration:**
  - Every git commit, repository initialization, and author metadata configuration must strictly use the credentials above:
    ```bash
    git config --global user.name "Atul Verma"
    git config --global user.email "aiprincekumar010100@gmail.com"
    ```

---

## 🤖 5. Dedicated Ecosystem Specialist Subagents

The system maintains the following standardized ecosystem subagents for autonomous operations:

1. **`parallel_dispatch_optimizer` (Rule 2):**
   - Assesses task decomposition, evaluates parallel feasibility, and structures subagent dispatch batches upon task receipt.
2. **`skill_requirement_scout` (Rule 3):**
   - Audits required tools and skills prior to task execution. Discovers and installs missing skills from internal tools and top-starred GitHub repositories.
3. **`skill_duplicate_checker` (Rule 4):**
   - Verifies whether a capability already exists before generating new skills, preventing codebase duplication.
4. **`antigravity_backup_specialist` (Rule 5 & Dept 13):**
   - Enforces dual-folder backup architecture (`Manual_Backup/` and `Daily_Backup/`), 1-click execution runners, and 10-day FIFO pruning.
5. **`memory_sync_sentinel` (Rule 23):**
   - Enforces real-time synchronization of [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) across all task stages and subagent dispatches.
6. **Language & Domain Specialists (Rule 17):**
   - Dedicated experts including `rust_expert_engineer`, `golang_expert_engineer`, `python_expert_engineer`, `typescript_frontend_engineer`, etc.

---

## ⚡ 6. Dynamic AI Model Selection & Thinking Budget (Rule 25)

- **Model Tier Routing:**
  - **`flash_lite` / `flash` (Light & Fast):** Simple queries, markdown formatting, quick status checks, and routine file searches.
  - **`inherit` (Parent Default):** Standard coding, feature implementation, refactoring, and departmental workflows.
  - **`pro` (Large Deep-Thinking):** Complex system architecture (HLD/LLD), security audits, cryptography, and multi-step root cause analysis.
- **Thinking Budget Control:**
  - Minimize thinking overhead on routine formatting and scripts; allocate deep thinking budgets to architecture, state machines, and security reviews.

---

## 🧹 7. Subagent Background Task Hygiene & Zero-Hang Standard (Rule 26)

- **Strict Task Lifecycle Management:**
  - Every background process initiated by a subagent (e.g., development servers, test runners, port listeners) must be cleanly terminated upon task completion or failure.
  - No orphan processes may remain hanging in the background, preventing port exhaustion and memory leaks.
