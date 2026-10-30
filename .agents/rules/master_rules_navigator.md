# Enterprise Architecture & Master Rules Navigator

> **Universal System Navigation Anchor:**
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) (Global ecosystem state & machine topology)
> - **Universal Canonical Rules Master:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/archive/universal_rules.md) (Archived canonical reference)
> - **Foundation & Special Operating Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Primary Developer Profile:** Atul Verma (`aiprincekumar` / `aiprincekumar010100@gmail.com` / [GitHub Profile](https://github.com/aiprincekumar))

---

## 🧭 1. Enterprise Departmental Architecture Overview

The Antigravity development ecosystem operates on a fully autonomous, modular enterprise architecture. The Main AI Agent acts strictly as the supreme **CEO / Orchestrator**, while all technical, analytical, coding, and operational tasks are executed by specialized subagents across 14 dedicated departments. This document serves as the single source of truth (SSOT) and rapid navigator.

---

## ⚖️ 2. Rule Precedence Hierarchy & Operating Boundary

- **Tier 1: Constitutional Governance (Universal Rules ALWAYS WIN):** CEO model & subagents (Rule 1), Zero-Scan memory anchoring (Rule 0/21), Atul Verma identity & Autonomous Local Commit / Git Push Gatekeeper (Rule 15/16), zero secrets & SAST (Rule 10/12), 10-day FIFO backup & Rule In Hindi (Rule 5), Changes Log 5 tiers (Rule 6), Rules health check `npm run rules:check` (Rule 27), and pre-task /grill-me discovery (Rule 24).
- **Tier 2: Technical Overrides (Project-Level Rules WIN):** Tech stack (React/Vue/Vite), design tokens (`DESIGN.md`), and business schema.
- **Conflict Resolution:** Governance & security ➔ Universal Rules prevail; Technical implementation ➔ Project rules prevail.

---

## 🏢 3. Department Directory & Quick Routing

| Department | Name | Core Scope | AI Model | Dedicated Rule Document |
| :--- | :--- | :--- | :--- | :--- |
| **Foundation** | **Foundation & Core Rules** | CEO model, Zero-Scan, ecosystem subagents | `pro` | [`foundation_and_special_rules.md`](foundation_and_special_rules.md) |
| **Dept 01** | **Product Requirements** | PRD, user stories, scope boundary, phase prompts | `flash` | [`01_product_requirements_dept.md`](01_product_requirements_dept.md) |
| **Dept 02** | **Solution Architecture** | HLD/LLD, system boundaries, ADRs, modularity | `pro` | [`02_solution_architecture_dept.md`](02_solution_architecture_dept.md) |
| **Dept 03** | **Data Architecture & DBA** | Schema design, indexing, migrations, query tuning | `pro` | [`03_data_architecture_dba_dept.md`](03_data_architecture_dba_dept.md) |
| **Dept 04** | **UI/UX Design System** | DESIGN.md, tokens, typography, WCAG A11y | `flash` | [`04_ui_ux_design_system_dept.md`](04_ui_ux_design_system_dept.md) |
| **Dept 05** | **Frontend Engineering** | React/Vue/Vite, state, V-DOM, SSR boundaries | `flash` | [`05_frontend_engineering_dept.md`](05_frontend_engineering_dept.md) |
| **Dept 06** | **Backend & API Engineering** | REST/GraphQL APIs, middleware, auth, queues | `flash` / `pro` | [`06_backend_api_engineering_dept.md`](06_backend_api_engineering_dept.md) |
| **Dept 07** | **Technical Documentation** | OpenAPI/Swagger, ADRs, runbooks, dev guides | `flash_lite` | [`07_technical_documentation_dept.md`](07_technical_documentation_dept.md) |
| **Dept 08** | **Quality Assurance & Testing** | Unit, integration, E2E (Playwright), TDD gates | `flash` | [`08_quality_assurance_testing_dept.md`](08_quality_assurance_testing_dept.md) |
| **Dept 09** | **Performance & Web Vitals** | LCP/INP/CLS, heap snapshots, bundle budgets | `pro` | [`09_performance_web_vitals_dept.md`](09_performance_web_vitals_dept.md) |
| **Dept 10** | **AppSec & InfoSec** | OWASP Top 10, secret scanning, token safety | `pro` | [`10_application_security_infosec_dept.md`](10_application_security_infosec_dept.md) |
| **Dept 11** | **Legal & License Compliance** | Open-source licenses (MIT/GPL), SPDX, GDPR | `flash_lite` | [`11_legal_license_compliance_dept.md`](11_legal_license_compliance_dept.md) |
| **Dept 12** | **DevOps, Build & Release** | CI/CD pipelines, build gates, Rule 6 changes log | `flash_lite` | [`12_devops_build_release_dept.md`](12_devops_build_release_dept.md) |
| **Dept 13** | **SRE & Backup Ops** | Rule 5 backup, 10-day FIFO, Rule 23 memory sync | `flash_lite` | [`13_sre_backup_disaster_recovery_dept.md`](13_sre_backup_disaster_recovery_dept.md) |
| **Dept 14** | **Telemetry & Flags** | OpenTelemetry, structured logging, feature flags | `flash` | [`14_telemetry_observability_feature_flags_dept.md`](14_telemetry_observability_feature_flags_dept.md) |

---

## 🔀 4. Task-Driven Routing Decision Matrix

- **Feature / Project Work:** Dept 01 (Scope/PRD) ➔ Dept 02 (Architecture) ➔ Dept 03/04 (DBA & UI/UX) ➔ Dept 05/06 (Implementation) ➔ Dept 08 (QA/TDD) ➔ Dept 10 (Security) ➔ Dept 12 (Build & Changes Log) ➔ Dept 13 (Memory Sync).
- **Bug Fix / Refactor:** Dept 08 (Repro QA) ➔ Dept 05/06 (Surgical Fix) ➔ Dept 10 (Security Audit) ➔ Dept 12 (Changes Log & Build Gate) ➔ Dept 13 (Memory Sync & Backup).

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

Antigravity operates a specialized 66-role enterprise division across 14 departments:

| Department | Key Enterprise Job Roles | Dedicated Subagent Roles | Core Responsibilities & Directives |
| :--- | :--- | :--- | :--- |
| **Dept 01: Product Requirements** | Lead Product Manager, Business Systems Analyst, Technical Product Owner, UX Research Analyst, Localization & Internationalization (i18n) Product Analyst | `Product Scope Architect`, `Business Systems Analyst`, `Technical Product Owner`, `UX Research Analyst`, `Localization Product Analyst` | PRD authoring, acceptance criteria, INVEST stories, MoSCoW prioritization, persona mapping, i18n/l10n specs. |
| **Dept 02: Solution Architecture** | Principal System Architect, Integration Architect, Domain Architecture Specialist, Code Standards Architect | `System Architect`, `Integration Architect`, `Domain Architecture Specialist`, `Code Standards Architect` | HLD/LLD architecture boundaries, MADR decision records, DDD bounded contexts, SOLID/DRY audits. |
| **Dept 03: Data Architecture & DBA** | Relational DBA, Vector DB Specialist, Data Migration Specialist, Query Performance Tuner | `Database Administrator`, `Vector Database Specialist`, `Data Migration Specialist`, `Query Performance Tuner` | 3NF/BCNF relational modeling, foreign keys, pgvector/Pinecone indexes, zero-downtime migrations, query tuning. |
| **Dept 04: UI/UX Design System** | Design System Lead, Visual UI Designer, Motion Design Specialist, Accessibility Specialist, Visual QA Specialist, Design Systems Token & Theming Engineer | `Design System Lead`, `Visual UI Designer`, `Motion Design Specialist`, `Accessibility Specialist`, `Visual QA Specialist`, `Design Token Engineer` | Semantic tokens, DESIGN.md specs, typography scales, 60fps spring motion, WCAG 2.1 AA/AAA, pixel audits, theming engine. |
| **Dept 05: Frontend Engineering** | Senior Frontend Core Engineer, Frontend State Architect, Canvas Motion Specialist, Responsive Web Specialist, Mobile Native Specialist, Micro-Frontend & Module Federation Architect | `Frontend Engineer`, `Frontend State Architect`, `Canvas Motion Specialist`, `Responsive Web Specialist`, `Mobile Native Specialist`, `Micro-Frontend Architect` | Modular React/TypeScript components, Zod validation, Zustand/TanStack caching, Three.js canvas, responsive, module federation. |
| **Dept 06: Backend & API Engineering** | Senior API Engineer, Distributed Systems Engineer, Backend Security Engineer, Queue Systems Specialist, AI Integration Engineer, GraphQL & Real-time WebSockets Specialist | `Backend API Engineer`, `Distributed Systems Engineer`, `Backend Security Engineer`, `Queue Systems Specialist`, `AI Integration Engineer`, `Real-time Systems Specialist` | REST/GraphQL APIs, circuit breakers, OAuth2 RBAC, Redis caching, BullMQ/Kafka queues, LLM prompt engineering, WebSockets & SSE. |
| **Dept 07: Technical Documentation** | Lead Technical Writer, API Specification Specialist, DX Engineer, ADR Chronicler | `Technical Documentation Writer`, `API Specification Specialist`, `Developer Experience Engineer`, `ADR Documentation Specialist` | Zero-drift technical documentation, OpenAPI 3.1 specs, Swagger UI synchronization, runbooks, onboarding. |
| **Dept 08: Quality Assurance & Testing** | SDET Automation Test Lead, E2E QA Engineer, Load Test Engineer, Exploratory QA Specialist, Security & Dynamic Application Security Testing (DAST) QA Engineer | `Automation Test Engineer`, `E2E QA Engineer`, `Load Test Engineer`, `Exploratory QA Specialist`, `DAST Security QA Engineer` | TDD test suites (Vitest/Jest, >=85% coverage), Playwright E2E automation, k6 stress tests, exploratory testing, DAST security scans. |
| **Dept 09: Performance & Web Vitals** | Core Web Vitals Specialist, Memory Leak Specialist, Bundle Optimization Engineer, Latency Optimization Engineer | `Web Vitals Engineer`, `Memory Leak Specialist`, `Bundle Optimization Engineer`, `Latency Optimization Engineer` | Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1), DevTools heap snapshots, bundle budgets, edge caching. |
| **Dept 10: AppSec & InfoSec** | AppSec Engineer, Penetration Tester, Secrets Governance Officer, Cloud Security Auditor | `AppSec Engineer`, `Penetration Tester`, `Secrets Governance Officer`, `Cloud Security Auditor` | SAST scans, OWASP Top 10 mitigation, CSRF/SSRF prevention, secret detection (gitleaks), cloud IAM audits. |
| **Dept 11: Legal & License Compliance** | Open Source License Auditor, Data Privacy Officer, IP Compliance Specialist, Regulatory Compliance Specialist | `Open Source License Auditor`, `Data Privacy Officer`, `IP Compliance Specialist`, `Regulatory Compliance Specialist` | Dependency license audits (MIT vs GPL), SPDX manifests, THIRD_PARTY_LICENSES.md, GDPR/CCPA PII privacy. |
| **Dept 12: DevOps, Build & Release** | CI/CD Pipeline Engineer, Build Systems Engineer, Release Manager, Containerization Specialist | `CI/CD Pipeline Engineer`, `Build Systems Engineer`, `Release Manager`, `Containerization Specialist` | GitHub Actions CI/CD, artifact caching, compiler gates (npm run build), SemVer releases, changes log auditing. |
| **Dept 13: SRE & Backup Ops** | Antigravity Backup Specialist, Site Reliability Engineer, Disaster Recovery Specialist, Memory Sentinel, FinOps Cost Specialist, Chaos Engineering & Resilience Specialist, Rule In Hindi Specialist | `Antigravity Backup Specialist`, `Site Reliability Engineer`, `Disaster Recovery Specialist`, `Memory Sentinel`, `FinOps Cost Specialist`, `Chaos Resilience Specialist`, `Rule In Hindi Specialist` | Rule 5 dual backup (Manual/Daily), 10-day FIFO rotation, chaos injection & resilience drills, 1-click Rule In Hindi engine (0 tokens), memory sync. |
| **Dept 14: Telemetry & Flags** | Telemetry Engineer, Feature Flag Manager, Metrics Dashboard Specialist, Incident Commander & RCA Lead | `Telemetry Engineer`, `Feature Flag Manager`, `Metrics Dashboard Specialist`, `Incident Commander` | OpenTelemetry SDK instrumentation, W3C TraceContext, dynamic canary rollouts, kill switches, Prometheus/Grafana, incident response & RCA. |

---

## 🛡️ 7. Universal Compliance Checklist for All Agents

Every subagent must verify and certify the following 7 requirements before completing any task:
- [ ] **Memory Anchoring:** Maintained continuous synchronization with [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) (Rule 23).
- [ ] **Zero-Scan Compliance:** Avoided blind recursive workspace scans (`dir /s`, `find`, `Get-ChildItem -Recurse`) (Rule 0 / 21).
- [ ] **Departmental Rule Adherence:** Fully complied with the dedicated rule document for the assigned department.
- [ ] **Quality Gate Certification:** Build (`npm run build`) and test suites (`npm test`) passed with zero errors (Rule 12/08).
- [ ] **Security Audit:** Certified zero hardcoded credentials, API keys, or unescaped injection vulnerabilities (Rule 10).
- [ ] **Changes Log Audit Entry:** Standardized audit record logged in project `changes_log/` across all 5 tiers (Rule 6).
- [ ] **Rules Health & Integrity Sentinel:** Whenever any rule, documentation, configuration, or structural change is made, `npm run rules:check` MUST be executed to verify zero truncation, 100% link validity, language purity, and binary sync before declaring completion (Rule 27).

---

## 📑 8. Canonical Universal Rules Directory (Rules 0–27 Index)

| Rule | Title | Domain | Dedicated Rule Document |
| :--- | :--- | :--- | :--- |
| **Rule 0** | Zero-Scan Bootstrap & Memory Anchoring | Architecture & State | [`foundation_and_special_rules.md`](foundation_and_special_rules.md) |
| **Rule 1** | Supreme CEO Orchestrator & Subagent Delegation | Delegation & Oversight | [`foundation_and_special_rules.md`](foundation_and_special_rules.md) |
| **Rule 2** | Pre-Task Parallel Dispatch Optimization | Parallel Orchestration | [`foundation_and_special_rules.md`](foundation_and_special_rules.md) |
| **Rule 3** | Skill Requirement Discovery & Sourcing | Capability Sourcing | [`foundation_and_special_rules.md`](foundation_and_special_rules.md) |
| **Rule 4** | Mandatory Skill Duplication Verification | Tooling Hygiene | [`foundation_and_special_rules.md`](foundation_and_special_rules.md) |
| **Rule 5** | Antigravity Backup, 10-Day FIFO & Rule In Hindi | SRE & DR Continuity | [`13_sre_backup_disaster_recovery_dept.md`](13_sre_backup_disaster_recovery_dept.md) |
| **Rule 6** | 5-Tier Changes Log & Token-Free git-cliff | Forensic Audit Trail | [`12_devops_build_release_dept.md`](12_devops_build_release_dept.md) |
| **Rule 7** | Autonomous Local Execution vs. Git Push Lock | Execution Autonomy | [`foundation_and_special_rules.md`](foundation_and_special_rules.md) |
| **Rule 8** | Timestamp Standardization & UTF-8 with BOM | Data & Text Hygiene | [`foundation_and_special_rules.md`](foundation_and_special_rules.md) |
| **Rule 9** | Code Quality & Clean Architecture (SOLID/DRY) | Code Craftsmanship | [`02_solution_architecture_dept.md`](02_solution_architecture_dept.md) |
| **Rule 10** | Surgical File Editing Safety & Regressions | Non-Destructive Edits | [`02_solution_architecture_dept.md`](02_solution_architecture_dept.md) |
| **Rule 11** | Error Handling & Credential-Free Logging | System Robustness | [`06_backend_api_engineering_dept.md`](06_backend_api_engineering_dept.md) |
| **Rule 12** | Security Best Practices, OWASP & Pre-Commit SAST | InfoSec Fortification | [`10_application_security_infosec_dept.md`](10_application_security_infosec_dept.md) |
| **Rule 13** | Test Verification Gates & Automated Quality | QA & Verification Gates | [`08_quality_assurance_testing_dept.md`](08_quality_assurance_testing_dept.md) |
| **Rule 14** | Technical Documentation & Transparent Reporting | Architecture & Docs | [`07_technical_documentation_dept.md`](07_technical_documentation_dept.md) |
| **Rule 15** | Dedicated Git Operations, Micro-Commits & Push Gate | Remote VCS Governance | [`12_devops_build_release_dept.md`](12_devops_build_release_dept.md) |
| **Rule 16** | Developer Identity: Atul Verma (aiprincekumar) | Author Identity | [`foundation_and_special_rules.md`](foundation_and_special_rules.md) |
| **Rule 17** | Dedicated Subagent per Programming Language | Language Purity | [`foundation_and_special_rules.md`](foundation_and_special_rules.md) |
| **Rule 18** | Mandatory Project Rules Replication & Active Sync | Rules Governance | [`master_rules_navigator.md`](master_rules_navigator.md) |
| **Rule 19** | Single-Row Section Headings Standard | UI/UX & Responsive | [`04_ui_ux_design_system_dept.md`](04_ui_ux_design_system_dept.md) |
| **Rule 20** | Feature Memory & 7-Column Diagnostic Matrix | Defect Forensics | [`01_product_requirements_dept.md`](01_product_requirements_dept.md) |
| **Rule 21** | Zero-Scan Ecosystem Discovery & Memory Anchor | Working Memory | [`foundation_and_special_rules.md`](foundation_and_special_rules.md) |
| **Rule 22** | vibe_coding_temp/ Ephemeral Workspace Standard | Staging Isolation | [`01_product_requirements_dept.md`](01_product_requirements_dept.md) |
| **Rule 23** | Stage-by-Stage Working Memory Synchronization | State Continuity | [`13_sre_backup_disaster_recovery_dept.md`](13_sre_backup_disaster_recovery_dept.md) |
| **Rule 24** | Default /grill-me & Dynamic /teamwork Protocol | Discovery & Fleets | [`foundation_and_special_rules.md`](foundation_and_special_rules.md) |
| **Rule 25** | Dynamic AI Model Selection & Thinking Budget | Cost & Model Tiers | [`foundation_and_special_rules.md`](foundation_and_special_rules.md) |
| **Rule 26** | Subagent Background Task Hygiene & Zero-Hang | Process Lifecycle | [`foundation_and_special_rules.md`](foundation_and_special_rules.md) |
| **Rule 27** | Rules Health & Integrity Sentinel Standard | Rules Governance | [`foundation_and_special_rules.md`](foundation_and_special_rules.md) |
