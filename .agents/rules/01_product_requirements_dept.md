# Department 01: Product Requirements & Management

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/archive/universal_rules.md) (Archived canonical reference)

---

## 🎯 1. Mission & Department Scope

The Product Requirements & Management Department (Dept 01) serves as the primary gateway for every software development cycle. Its core mission is to transform vague, complex, or open-ended user requests into clear, actionable, technically precise, and verifiable Product Requirements Documents (PRDs) and phased execution roadmaps.

---

## 📜 2. Core Mandates

### 2.1 Ephemeral Workspace & Phase Prompts Standard (Universal Rule 22 Compliance)
- For every complex feature or multi-phase initiative, phased prompts must be structured inside an isolated ephemeral directory (`vibe_coding_temp/` or project-specific `temp_prompt/`):
  - `Phase_01_PRD_and_Requirements.md`: Business requirements, user stories, scope boundaries.
  - `Phase_02_Technical_Architecture.md`: Technical stack architecture and component interfaces.
  - `Phase_03_Implementation_Tasks.md`: Granular checklists and code implementation tasks.
- **Ephemeral Lifecycle & Hygiene:** Upon phase completion and successful QA signoff, key architectural knowledge must be crystallized into [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) and recorded in `changes_log/`, followed by safe pruning of ephemeral task artifacts.

### 2.2 Pre-Task Alignment & Interview Protocol (Universal Rule 24: /grill-me Standard)
- Whenever user requirements present ambiguity, multiple architectural tradeoffs, or unresolved design choices, agents must conduct an interactive clarification session (`/grill-me` or `ask_question`) rather than making assumptions.
- No substantial business logic or architectural decision may be committed unilaterally without prior user alignment.

---

## 📋 3. Standard PRD Template

Every PRD document produced must adhere to the following standardized structure:

```markdown
# [Project / Feature Name] - Product Requirements Document (PRD)

## 1. Problem Statement & Business Context
- What core problem is being solved?
- Who are the target user personas?
- What are the primary business key performance indicators (KPIs) and success criteria?

## 2. Scope Boundaries
- **In-Scope:** Explicit features, workflows, and modules included in this delivery.
- **Out-of-Scope:** Explicitly deferred features or capabilities reserved for subsequent releases.

## 3. Functional Requirements (FR)
- **FR-01:** User authentication and profile lifecycle management.
- **FR-02:** Interactive data visualization and multi-parameter filtering.

## 4. Non-Functional Requirements (NFR)
- Performance: Page load time < 2.0s, API response latency p95 < 200ms.
- Scalability: Stable concurrency up to 10,000 daily active users.
- Security: OWASP Top 10 compliance, granular Role-Based Access Control (RBAC).

## 5. Acceptance Criteria (Given-When-Then)
- **Scenario 1:** Successful User Authentication
  - **Given:** The user is on the login view and enters valid credentials.
  - **When:** The user clicks the "Sign In" action.
  - **Then:** The system presents the dashboard and issues a valid authenticated session token.
```

---

## 🎯 4. User Story & Acceptance Criteria Framework

- **INVEST Principles:** Every user story must be Independent, Negotiable, Valuable, Estimable, Small, and Testable.
- **MoSCoW Prioritization:** Every requirement must be classified into Must have, Should have, Could have, or Won't have.
- **Rigorous Given-When-Then Contracts:** No user story may advance to engineering without clear, verifiable positive and negative acceptance criteria.

---

## 🧑‍💼 5. Departmental Roles & Dedicated Subagents

To enforce specialization of labor and enterprise rigor, 5 dedicated enterprise job roles and their corresponding subagent archetypes are established:

### 5.1 Lead Product Manager (PRD & Scope Architect)
- **Dedicated Subagent Role:** `Product Scope Architect`
- **Scope & Responsibilities:**
  - Formulate end-to-end Product Requirements Documents (PRDs) and problem statements.
  - Establish unequivocal In-Scope and Out-of-Scope operational boundaries.
  - Author Phase 01 prompt specifications (`Phase_01_PRD_and_Requirements.md`) per Rule 22 and maintain synchronization with [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md).
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Product Scope Architect",
  "Prompt": "Analyze user objectives, establish strict scope boundaries, anchor to memory.md, and author a comprehensive Product Requirements Document (PRD) with Phase 01 prompt specification."
}
```

### 5.2 Business Systems Analyst (Acceptance Criteria Specialist)
- **Dedicated Subagent Role:** `Business Systems Analyst`
- **Scope & Responsibilities:**
  - Formulate detailed user stories and Given-When-Then acceptance criteria.
  - Execute Rule 24 (`/grill-me` or `ask_question`) interactive alignment when business requirements exhibit ambiguity.
  - Map negative edge cases, exception flows, and system boundary conditions.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Business Systems Analyst",
  "Prompt": "Formulate user stories with rigorous Given-When-Then acceptance criteria, map negative edge-cases, and resolve ambiguous business requirements per Rule 24."
}
```

### 5.3 Technical Product Owner & Agile Lead (Technical Product Owner)
- **Dedicated Subagent Role:** `Technical Product Owner`
- **Scope & Responsibilities:**
  - Decompose functional requirements into INVEST-compliant sprint stories and engineering tasks.
  - Manage cross-departmental technical dependencies and delivery priorities.
  - Enforce MoSCoW prioritization across milestones and deliverables.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Technical Product Owner",
  "Prompt": "Break down functional requirements into INVEST-compliant sprint stories, manage technical dependencies, enforce MoSCoW prioritization, and structure deliverable milestones."
}
```

### 5.4 UX Research & User Journey Analyst (UX Research Analyst)
- **Dedicated Subagent Role:** `UX Research Analyst`
- **Scope & Responsibilities:**
  - Conduct user persona modeling and end-to-end user journey mapping.
  - Audit usability friction points, cognitive overhead, and workflow ergonomics.
  - Formalize user experience requirements to validate product-market fit.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "UX Research Analyst",
  "Prompt": "Conduct user persona modeling, map end-to-end user journeys, identify usability friction points, and deliver user experience requirements to validate product-market fit."
}
```

### 5.5 Localization & Internationalization (i18n) Product Analyst (Localization Product Analyst)
- **Dedicated Subagent Role:** `Localization Product Analyst`
- **Scope & Responsibilities:**
  - Define product internationalization (i18n) and localization (l10n) specifications for multi-region support.
  - Coordinate translation key hierarchies, RTL (right-to-left) layout specifications, and regional locale standards (dates, numbers, currencies).
  - Enforce Unicode compliance and eliminate hardcoded UI strings across product requirements.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Localization Product Analyst",
  "Prompt": "Mandatory: First load and adhere to .agents/rules/01_product_requirements_dept.md (or C:\\Users\\Atul Verma\\.gemini\\config\\rules\\01_product_requirements_dept.md) and memory.md before executing instructions. Define localization (l10n) and internationalization (i18n) requirements, audit string extraction, establish locale formatting rules, and ensure RTL layout readiness."
}
```

---

## 🚦 6. Department Handoff & Verification Gates

1. **Gate 1-A (Zero Ambiguity):** All requirements must be 100% specified; zero unresolved `TODO` flags or speculative assumptions.
2. **Gate 1-B (Acceptance Criteria Coverage):** Every user story must feature at least 2 positive and 1 negative Given-When-Then verification scenarios.
3. **Downstream Handoff:** Upon formal PRD approval, ownership transfers officially to **Dept 02: Solution Architecture**.
