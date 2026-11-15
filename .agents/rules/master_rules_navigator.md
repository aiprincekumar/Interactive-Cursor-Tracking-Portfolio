# Enterprise Architecture & Master Rules Navigator

> **Universal System Navigation Anchor:**
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) (Global ecosystem state & machine topology)
> - **Architecture Recommendation:** [`architecture_recommendation.md`](architecture_recommendation.md) (4-Level Command Hierarchy & Skill Architecture)
> - **Prompt Architecture:** [`PHASE_WISE_PROMPT_GENERATION_ARCHITECTURE.md`](PHASE_WISE_PROMPT_GENERATION_ARCHITECTURE.md) (Phase-wise Prompt Generation Specialist & Workflow)
> - **Foundation Core:** [`foundation_core.md`](foundation_core.md) (Constitutional rules & CEO Zero-Code Hard Lock)
> - **Special Operations Guide:** [`special_operations_guide.md`](special_operations_guide.md) (SRE backup, changes log & security)
> - **Dynamic Routing Matrix:** [`dynamic_departments_matrix.md`](dynamic_departments_matrix.md) (14 Enterprise Departments dynamic router)
> - **Department Index & Archive:** [`dept_index.md`](dept_index.md) (On-demand departmental playbooks directory)
> - **Universal Canonical Rules Master:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/archive/universal_rules.md) (Archived canonical reference)
> - **Primary Developer Profile:** Atul Verma (`aiprincekumar` / `aiprincekumar010100@gmail.com` / [GitHub Profile](https://github.com/aiprincekumar))

---

## 🧭 1. Enterprise Departmental Architecture Overview

The Antigravity development ecosystem operates on an autonomous, modular enterprise architecture governed by the **4-Level Command Hierarchy** codified in [`architecture_recommendation.md`](architecture_recommendation.md):
- **Level 1: CEO (Supreme Orchestrator):** Sole user interface; strategic planning and delegation exclusively to Level 2 Manager (Zero-Code Hard Lock).
- **Level 2: Manager (Parallel Sub-Agent Commander):** Tactical commander; enforces Level 2 Zero-Code Hard Lock, coordinates Specialist Decision Gate (Zero-Skip Level 3), and delegates code execution exclusively to Level 4 Sub Agents.
- **Level 3: Specialized Advisory Agents:** `Skill Manager`, `Grill-Me Specialist`, and `Phase-wise Prompt Generation Specialist` ([`PHASE_WISE_PROMPT_GENERATION_ARCHITECTURE.md`](PHASE_WISE_PROMPT_GENERATION_ARCHITECTURE.md); Rule 22). Mandatory advisory gate; cannot be bypassed.
- **Level 4: Execution Sub Agents:** Exclusive codebase mutation authority; departmental specialists executing tasks across 14 divisions (`01_` through `14_`). Level 1/2 direct edits are strictly prohibited. Mandatory independent QA verification.
- **Background Operational Role: Sub Manager (Monitor):** Passive monitor detecting task hangs, stalled processes, and port lockups.
- **Enforceable Specialist Decision Gate:** Governed by 10-state machine (`.agents/state/decision_gate_state.json`) and verified via `npm run test:decision-gate`.

---

## ⚖️ 2. Rule Precedence Hierarchy & Operating Boundary

Operational boundaries between Global Universal Rules and Project-Level Rules are governed by the Two-Tier Precedence Matrix in [`foundation_core.md`](foundation_core.md):
- **Tier 1: Constitutional Governance (Universal Rules ALWAYS WIN):** CEO model & subagent delegation (Rule 1), Level 3 Specialist Gate (Zero-Skip Level 3), Level 4 Subagents (Zero-Code for Level 1/2), Independent QA Gate, Zero-Scan memory anchoring (Rule 0/21), Developer profile Atul Verma & Autonomous Git Engine (Rule 15/16; <=2 files local, >=3 files online push), zero secrets & SAST (Rule 10/12), 10-day FIFO backup & Rule In Hindi (Rule 5), 5-Tier Changes Log (Rule 6), `npm run rules:check` (Rule 27), and `/grill-me` discovery (Rule 24).
- **Tier 2: Technical Overrides (Project-Level Rules WIN):** Tech stack (React/Vue), design tokens (`DESIGN.md`), and business schema.
- **Conflict Resolution:** Universal Rules prevail in governance and security. Project rules govern implementation choices within Tier 1 safety limits.

---

## 🏢 3. Department Directory & Quick Routing

| Department | Name | Core Scope | AI Model | Dedicated Rule Document |
| :--- | :--- | :--- | :--- | :--- |
| **Foundation** | **Foundation Core Rules** | CEO model, Zero-Scan, governance | `pro` | [`foundation_core.md`](foundation_core.md) |
| **Operations** | **Special Operations & SRE** | Rule 5 backup, changes log, BOM | `flash_lite` | [`special_operations_guide.md`](special_operations_guide.md) |
| **Architecture** | **System Architecture & Hierarchy** | 4-Level Command Hierarchy | `pro` | [`architecture_recommendation.md`](architecture_recommendation.md) |
| **Dynamic Matrix** | **14 Departments Dynamic Matrix** | Dynamic skill routing across 14 depts | `flash` | [`dynamic_departments_matrix.md`](dynamic_departments_matrix.md) |
| **Dept Index** | **Department Playbooks Index** | On-demand directory of 14 playbooks | `flash_lite` | [`dept_index.md`](dept_index.md) |
| **Dept 01** | **Product Requirements** | PRD authoring, user stories, specs | `flash` | [`departments_archive/01_product_requirements_dept.md`](departments_archive/01_product_requirements_dept.md) |
| **Dept 02** | **Solution Architecture** | HLD/LLD boundaries, ADRs, modularity | `pro` | [`departments_archive/02_solution_architecture_dept.md`](departments_archive/02_solution_architecture_dept.md) |
| **Dept 03** | **Data Architecture & DBA** | Schema design, indexing, migrations | `pro` | [`departments_archive/03_data_architecture_dba_dept.md`](departments_archive/03_data_architecture_dba_dept.md) |
| **Dept 04** | **UI/UX Design System** | DESIGN.md, tokens, typography, A11y | `flash` | [`departments_archive/04_ui_ux_design_system_dept.md`](departments_archive/04_ui_ux_design_system_dept.md) |
| **Dept 05** | **Frontend Engineering** | React/Vue/Vite, UI state, rendering | `flash` | [`departments_archive/05_frontend_engineering_dept.md`](departments_archive/05_frontend_engineering_dept.md) |
| **Dept 06** | **Backend & API Engineering** | REST/GraphQL APIs, auth, queues | `flash` / `pro` | [`departments_archive/06_backend_api_engineering_dept.md`](departments_archive/06_backend_api_engineering_dept.md) |
| **Dept 07** | **Technical Documentation** | OpenAPI specs, runbooks, dev guides | `flash_lite` | [`departments_archive/07_technical_documentation_dept.md`](departments_archive/07_technical_documentation_dept.md) |
| **Dept 08** | **Quality Assurance & Testing** | Unit, E2E (Playwright), TDD gates | `flash` | [`departments_archive/08_quality_assurance_testing_dept.md`](departments_archive/08_quality_assurance_testing_dept.md) |
| **Dept 09** | **Performance & Web Vitals** | Core Web Vitals, heap, bundles | `pro` | [`departments_archive/09_performance_web_vitals_dept.md`](departments_archive/09_performance_web_vitals_dept.md) |
| **Dept 10** | **AppSec & InfoSec** | OWASP Top 10, secret scanning, SAST | `pro` | [`departments_archive/10_application_security_infosec_dept.md`](departments_archive/10_application_security_infosec_dept.md) |
| **Dept 11** | **Legal & License Compliance** | Open-source licenses, SPDX, GDPR | `flash_lite` | [`departments_archive/11_legal_license_compliance_dept.md`](departments_archive/11_legal_license_compliance_dept.md) |
| **Dept 12** | **DevOps, Build & Release** | CI/CD pipelines, build gates, releases | `flash_lite` | [`departments_archive/12_devops_build_release_dept.md`](departments_archive/12_devops_build_release_dept.md) |
| **Dept 13** | **SRE & Backup Ops** | Dual backup, 10-day FIFO, memory sync | `flash_lite` | [`departments_archive/13_sre_backup_disaster_recovery_dept.md`](departments_archive/13_sre_backup_disaster_recovery_dept.md) |
| **Dept 14** | **Telemetry & Flags** | OpenTelemetry, logging, feature flags | `flash` | [`departments_archive/14_telemetry_observability_feature_flags_dept.md`](departments_archive/14_telemetry_observability_feature_flags_dept.md) |

---

## 🔀 4. Task-Driven Routing Decision Matrix

- **Feature Work:** Dept 01 (Scope) ➔ Dept 02 (Arch) ➔ Dept 03/04 (DBA & UI) ➔ Dept 05/06 (Build) ➔ Dept 08 (QA) ➔ Dept 10 (Security) ➔ Dept 12 (Release) ➔ Dept 13 (Sync).
- **Bug Fix / Refactor:** Dept 08 (Repro QA) ➔ Dept 05/06 (Surgical Fix) ➔ Dept 10 (Security Audit) ➔ Dept 12 (Changes Log) ➔ Dept 13 (Memory Sync).

---

## 🔄 5. Inter-Departmental Baton-Passing Lifecycle

1. **Scope:** Dept 01 (PRD) ➔ Dept 02 (Architecture)
2. **Design & Schema:** Dept 02 ➔ Dept 03 (DBA) + Dept 04 (UI/UX)
3. **Engineering:** Dept 03/04 ➔ Dept 05 (Frontend) + Dept 06 (Backend)
4. **Verification:** Dept 05/06 ➔ Dept 08 (QA & Verification Subagent)
5. **Hardening:** Dept 08 ➔ Dept 09 (Performance) + Dept 10 (Security)
6. **Documentation:** Dept 10 ➔ Dept 07 (Technical Docs) + Dept 11 (Legal)
7. **Release & Operations:** Dept 07/11 ➔ Dept 12 (DevOps) + Dept 13 (SRE/Memory Sync) + Dept 14 (Telemetry)

---

## 🧑‍💼 6. Master Enterprise Roles & Subagents Roster

Antigravity operates a specialized 67-role enterprise division across 14 departments:

| Department | Scope Focus | Dedicated Subagent Roles | Playbook Reference |
| :--- | :--- | :--- | :--- |
| **Dept 01: Product Requirements** | PRD, user stories, acceptance criteria, i18n specs. | `Product Scope Architect`, `Business Systems Analyst`, `Technical Product Owner`, `UX Research Analyst`, `Localization Product Analyst` | [`dept_index.md`](dept_index.md) |
| **Dept 02: Solution Architecture** | HLD/LLD boundaries, MADRs, DDD boundaries. | `System Architect`, `Integration Architect`, `Domain Architecture Specialist`, `Code Standards Architect` | [`dept_index.md`](dept_index.md) |
| **Dept 03: Data Architecture & DBA** | 3NF/BCNF schemas, migrations, vector indexing. | `Database Administrator`, `Vector Database Specialist`, `Data Migration Specialist`, `Query Performance Tuner` | [`dept_index.md`](dept_index.md) |
| **Dept 04: UI/UX Design System** | Design tokens, DESIGN.md, 60fps motion, A11y. | `Design System Lead`, `Visual UI Designer`, `Motion Design Specialist`, `Accessibility Specialist`, `Visual QA Specialist`, `Design Token Engineer` | [`dept_index.md`](dept_index.md) |
| **Dept 05: Frontend Engineering** | React/Vue components, UI state, Three.js canvas. | `Frontend Engineer`, `Frontend State Architect`, `Canvas Motion Specialist`, `Responsive Web Specialist`, `Mobile Native Specialist`, `Micro-Frontend Architect` | [`dept_index.md`](dept_index.md) |
| **Dept 06: Backend & API Engineering** | REST/GraphQL APIs, OAuth2 RBAC, Redis, WebSockets. | `Backend API Engineer`, `Distributed Systems Engineer`, `Backend Security Engineer`, `Queue Systems Specialist`, `AI Integration Engineer`, `Real-time Systems Specialist` | [`dept_index.md`](dept_index.md) |
| **Dept 07: Technical Documentation** | OpenAPI 3.1 specs, Swagger UI sync, runbooks. | `Technical Documentation Writer`, `API Specification Specialist`, `Developer Experience Engineer`, `ADR Documentation Specialist` | [`dept_index.md`](dept_index.md) |
| **Dept 08: Quality Assurance & Testing** | TDD test suites, Playwright E2E, k6 stress testing. | `Automation Test Engineer`, `E2E QA Engineer`, `Load Test Engineer`, `Exploratory QA Specialist`, `DAST Security QA Engineer` | [`dept_index.md`](dept_index.md) |
| **Dept 09: Performance & Web Vitals** | Web Vitals (LCP/INP/CLS), DevTools heap, bundles. | `Web Vitals Engineer`, `Memory Leak Specialist`, `Bundle Optimization Engineer`, `Latency Optimization Engineer` | [`dept_index.md`](dept_index.md) |
| **Dept 10: AppSec & InfoSec** | SAST scans, OWASP Top 10, gitleaks detection. | `AppSec Engineer`, `Penetration Tester`, `Secrets Governance Officer`, `Cloud Security Auditor` | [`dept_index.md`](dept_index.md) |
| **Dept 11: Legal & License Compliance** | License audits (MIT/GPL), SPDX, PII compliance. | `Open Source License Auditor`, `Data Privacy Officer`, `IP Compliance Specialist`, `Regulatory Compliance Specialist` | [`dept_index.md`](dept_index.md) |
| **Dept 12: DevOps, Build & Release** | GitHub Actions CI/CD, build gates, SemVer releases. | `CI/CD Pipeline Engineer`, `Build Systems Engineer`, `Release Manager`, `Containerization Specialist` | [`dept_index.md`](dept_index.md) |
| **Dept 13: SRE & Backup Ops** | Rule 5 backup, 10-day FIFO, Rule 23 memory sync. | `Antigravity Backup Specialist`, `Site Reliability Engineer`, `Disaster Recovery Specialist`, `Memory Sentinel`, `FinOps Cost Specialist`, `Chaos Resilience Specialist`, `Rule In Hindi Specialist` | [`dept_index.md`](dept_index.md) |
| **Dept 14: Telemetry & Flags** | OpenTelemetry, trace context, canary rollouts, flags. | `Telemetry Engineer`, `Feature Flag Manager`, `Metrics Dashboard Specialist`, `Incident Commander` | [`dept_index.md`](dept_index.md) |

---

## 🛡️ 7. Universal Compliance Checklist for All Agents

Every subagent must verify and certify the following 7 requirements before completing any task:
- [ ] **Memory Anchoring:** Continuous synchronization with [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) (Rule 23).
- [ ] **Zero-Scan Compliance:** Zero blind recursive workspace scans (`dir /s`, `find`) (Rule 0 / 21).
- [ ] **Dynamic Skill Adherence:** Full compliance with assigned departmental skill bindings.
- [ ] **Quality Gate Certification:** Build (`npm run build`) and test suites (`npm test`) passed with zero errors (Rule 12/08).
- [ ] **Security Audit:** Zero hardcoded credentials, API keys, or injection vulnerabilities (Rule 10).
- [ ] **Changes Log Audit Entry:** Standardized audit record logged in `changes_log/` across all 5 tiers (Rule 6).
- [ ] **Rules Health & Integrity Sentinel:** Mandatory `npm run rules:check` execution verifying zero truncation, valid links, language purity, and binary sync before completion (Rule 27).

---

## 📑 8. Canonical Universal Rules Directory (Rules 0–27 Index)

| Rule | Title | Domain | Dedicated Rule Document |
| :--- | :--- | :--- | :--- |
| **Rule 0** | Zero-Scan Bootstrap & Memory Anchoring | Architecture | [`foundation_core.md`](foundation_core.md) |
| **Rule 1** | CEO Orchestrator & Subagent Delegation | Delegation | [`foundation_core.md`](foundation_core.md) |
| **Rule 2** | Pre-Task Parallel Dispatch Optimization | Parallelism | [`foundation_core.md`](foundation_core.md) |
| **Rule 3** | Skill Requirement Discovery & Sourcing | Tooling | [`foundation_core.md`](foundation_core.md) |
| **Rule 4** | Mandatory Skill Duplication Verification | Tooling | [`foundation_core.md`](foundation_core.md) |
| **Rule 5** | Antigravity Backup, 10-Day FIFO & Rule In Hindi | SRE & DR | [`special_operations_guide.md`](special_operations_guide.md) |
| **Rule 6** | Project Changes Log (5-Tier Architecture) | Audit Log | [`special_operations_guide.md`](special_operations_guide.md) |
| **Rule 7** | Autonomous Local Execution vs Git Push Lock | Autonomy | [`foundation_core.md`](foundation_core.md) |
| **Rule 8** | Timestamp Standards & UTF-8 with BOM | Hygiene | [`special_operations_guide.md`](special_operations_guide.md) |
| **Rule 9** | Code Quality & Clean Architecture (SOLID/DRY) | Architecture | [`dynamic_departments_matrix.md`](dynamic_departments_matrix.md) |
| **Rule 10** | Surgical File Editing Safety & Regressions | Reliability | [`special_operations_guide.md`](special_operations_guide.md) |
| **Rule 11** | Error Handling & Credential-Free Logging | Robustness | [`dynamic_departments_matrix.md`](dynamic_departments_matrix.md) |
| **Rule 12** | Security Best Practices, OWASP & SAST | InfoSec | [`special_operations_guide.md`](special_operations_guide.md) |
| **Rule 13** | Test Verification Gates & Automated Quality | QA Gates | [`dynamic_departments_matrix.md`](dynamic_departments_matrix.md) |
| **Rule 14** | Technical Documentation & Reporting | Documentation | [`dynamic_departments_matrix.md`](dynamic_departments_matrix.md) |
| **Rule 15** | Git Operations & Autonomous Push Engine | VCS Governance | [`foundation_core.md`](foundation_core.md) |
| **Rule 16** | Developer Identity: Atul Verma (aiprincekumar) | Author Identity | [`foundation_core.md`](foundation_core.md) |
| **Rule 17** | Dedicated Subagent per Language | Language | [`foundation_core.md`](foundation_core.md) |
| **Rule 18** | Project Rules Replication & Active Sync | Governance | [`master_rules_navigator.md`](master_rules_navigator.md) |
| **Rule 19** | Single-Row Section Headings Standard | UI Design | [`dynamic_departments_matrix.md`](dynamic_departments_matrix.md) |
| **Rule 20** | Feature Memory & 7-Column Diagnostic Matrix | Forensics | [`special_operations_guide.md`](special_operations_guide.md) |
| **Rule 21** | Zero-Scan Discovery & Memory Anchor | Memory State | [`foundation_core.md`](foundation_core.md) |
| **Rule 22** | Phase-wise Prompt Architecture Standard | Prompt Arch | [`PHASE_WISE_PROMPT_GENERATION_ARCHITECTURE.md`](PHASE_WISE_PROMPT_GENERATION_ARCHITECTURE.md) |
| **Rule 23** | Stage-by-Stage Memory Synchronization | Continuity | [`special_operations_guide.md`](special_operations_guide.md) |
| **Rule 24** | Default /grill-me & Dynamic /teamwork | Discovery | [`foundation_core.md`](foundation_core.md) |
| **Rule 25** | Dynamic Model Selection & Thinking Budget | Cost & Model | [`foundation_core.md`](foundation_core.md) |
| **Rule 26** | Subagent Task Hygiene & Zero-Hang Standard | Lifecycle | [`foundation_core.md`](foundation_core.md) |
| **Rule 27** | Rules Health & Integrity Sentinel Standard | Governance | [`foundation_core.md`](foundation_core.md) |
