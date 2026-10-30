# Department 07: Technical Documentation & API Specs

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/archive/universal_rules.md) (Archived canonical reference)

---

## 📚 1. Mission & Department Scope

The Technical Documentation & Knowledge Management Department (Dept 07) standardizes and maintains the technical knowledge repository, OpenAPI/Swagger specifications, Architecture Decision Records (ADRs), developer onboarding runbooks, and public API documentation.

This department ensures that zero codebase modules exist without documented context and that documentation remains synchronized with code changes at zero drift.

---

## 📜 2. OpenAPI / Swagger 3.0+ Specification Standards

### 2.1 Standardized API Contract Structure
Every backend API must publish and maintain a complete OpenAPI 3.x specification (`docs/openapi.yaml` or `openapi.json`):
- Explicit `summary`, `description`, and `tags` for every route.
- Clearly typed input parameters (path, query, headers) with validation rules and defaults.
- Exact HTTP status codes, schema definitions, and realistic JSON examples for every response payload.

```yaml
# Example: OpenAPI 3.0 Endpoint Contract
/api/v1/orders:
  post:
    summary: "Create a new customer order"
    tags: ["Orders"]
    security:
      - BearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/CreateOrderRequest'
    responses:
      '201':
        description: "Order created successfully"
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/OrderResponse'
      '400':
        $ref: '#/components/responses/ValidationError'
      '401':
        $ref: '#/components/responses/UnauthorizedError'
```

---

## 🛠️ 3. Developer Onboarding & Operational Runbooks

- **Standard Project README.md Structure:**
  1. **Overview:** Project purpose, technical stack overview, and key features.
  2. **Prerequisites:** Required Node/runtime versions, database engines, and tools.
  3. **Quick Start Execution:**
     ```bash
     git clone <repo-url>
     cp .env.example .env
     npm ci
     npm run dev
     ```
  4. **Environment Variables Dictionary:** Description, typing, and sample values for all `.env` keys.
  5. **Verification Commands:** Instructions for running unit tests (`npm test`) and E2E suites.

---

## 🔄 4. Living Documentation & Zero-Drift Policy

- **Zero-Drift Policy:** Whenever code changes alter an API signature, database schema, or configuration parameter, updating corresponding documentation within the same commit/PR is mandatory.
- Stale or misleading technical documentation must never persist within the repository.

---

## 🧑‍💼 5. Departmental Roles & Dedicated Subagents

To enforce specialization of labor and enterprise rigor, 4 dedicated enterprise job roles and their corresponding subagent archetypes are established:

### 5.1 Lead Technical Writer (Technical Documentation Writer)
- **Dedicated Subagent Role:** `Technical Documentation Writer`
- **Scope & Responsibilities:**
  - Author comprehensive, zero-drift technical documentation.
  - Maintain root guides, system overviews, and architecture walkthroughs.
  - Deliver clear, rigorous, and professional technical references for developers and users.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Technical Documentation Writer",
  "Prompt": "Author comprehensive, zero-drift technical documentation, maintain root and module guides, and produce clear developer explanations adhering to Rule 7."
}
```

### 5.2 OpenAPI & API Specification Architect (API Specification Specialist)
- **Dedicated Subagent Role:** `API Specification Specialist`
- **Scope & Responsibilities:**
  - Author authoritative OpenAPI 3.1 specifications in `docs/openapi.yaml`.
  - Maintain schema synchronization between backend DTOs and API specifications.
  - Generate and validate interactive Swagger UI and mock contract harnesses.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "API Specification Specialist",
  "Prompt": "Formulate rigorous OpenAPI 3.1 specifications in docs/openapi.yaml, synchronize schema definitions with backend DTOs, and generate interactive Swagger interfaces."
}
```

### 5.3 Developer Experience (DX) & Runbook Engineer (Developer Experience Engineer)
- **Dedicated Subagent Role:** `Developer Experience Engineer`
- **Scope & Responsibilities:**
  - Design friction-free onboarding flows and author setup runbooks (`README.md`).
  - Maintain standardized `.env.example` configurations and environment validation routines.
  - Compile troubleshooting playbooks for operational diagnostics and incident response.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Developer Experience Engineer",
  "Prompt": "Design friction-free developer onboarding workflows, author comprehensive README and setup runbooks, curate .env.example files, and compile operational playbooks."
}
```

### 5.4 Architecture Decision Record (ADR) Chronicler (ADR Documentation Specialist)
- **Dedicated Subagent Role:** `ADR Documentation Specialist`
- **Scope & Responsibilities:**
  - Chronicler architectural choices in `docs/adr/` using standard MADR conventions.
  - Record technical problem context, explored alternatives, rationale, and consequences.
  - Preserve an immutable audit trail of system design evolutions per Rule 2.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "ADR Documentation Specialist",
  "Prompt": "Record all architectural and design decisions in docs/adr/ following MADR conventions, capturing context, trade-offs, rationale, and consequences per Rule 2."
}
```

---

## 🚦 6. Department Handoff & Verification Gates

1. **Gate 7-A (OpenAPI Validation):** `npx @stoplight/spectral-cli lint docs/openapi.yaml` must pass without structural errors.
2. **Gate 7-B (Runbook Verification):** Clean execution of setup commands confirmed in a clean environment.
3. **Downstream Handoff:** Upon documentation signoff, deliverables pass to **Dept 08: QA** and **Dept 12: DevOps**.
