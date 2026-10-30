# Department 06: Backend & API Engineering

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/archive/universal_rules.md) (Archived canonical reference)

---

## ⚙️ 1. Mission & Department Scope

The Backend & API Engineering Department (Dept 06) designs, implements, and operates server-side business logic, REST and GraphQL APIs, middleware pipelines, authentication and authorization layers, input sanitization routines, and backend service resilience patterns.

---

## 🔌 2. RESTful API Standards & Conventions

### 2.1 Semantic HTTP Methods & Status Codes
- `GET`: Safe, idempotent retrieval (200 OK, 404 Not Found).
- `POST`: Creation of a new resource (201 Created with `Location` header).
- `PUT`: Complete resource replacement (200 OK / 204 No Content).
- `PATCH`: Partial resource mutation (200 OK).
- `DELETE`: Resource removal (204 No Content).

### 2.2 Standardized JSON Response Envelopes
Every API response must adhere to a predictable payload structure:

```json
// Success Response Envelope
{
  "success": true,
  "data": {
    "userId": "usr_98a72b",
    "name": "Atul Verma",
    "role": "ARCHITECT"
  },
  "meta": {
    "timestamp": "2026-10-29T07:15:00.000Z",
    "requestId": "req_84f912c"
  }
}

// Error Response Envelope
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The provided payload failed schema validation",
    "details": [
      { "field": "email", "issue": "Email format is invalid" }
    ]
  },
  "meta": {
    "timestamp": "2026-10-29T07:15:00.000Z",
    "requestId": "req_84f912c"
  }
}
```

---

## 🔒 3. Authentication, Authorization & Middleware Pipeline

### 3.1 Modern Authentication (JWT + Refresh Tokens)
- Short-lived Access Tokens (15-minute expiration) kept in memory or secure runtime state.
- Long-lived Refresh Tokens (7-30 days) stored exclusively in `HttpOnly`, `Secure`, `SameSite=Strict` cookies.
- Role-Based Access Control (`RBAC`): Enforce role verification middleware across all protected endpoints.

### 3.2 Canonical Middleware Execution Sequence
1. **Request ID Injection:** Inject a unique `x-request-id` header on every incoming request.
2. **Security Headers:** Enforce `helmet` or equivalent HTTP security headers.
3. **CORS Policy:** Whitelist explicit authorized origins.
4. **Rate Limiting:** Throttle requests by IP or user identity (Redis Token Bucket).
5. **Body Parser & DTO Validation:** Validate payloads strictly using `Zod` or `Pydantic`.
6. **Authentication & Authorization:** Verify cryptographic tokens and evaluate permissions.
7. **Business Route Handler:** Execute core domain service logic.
8. **Global Centralized Error Handler:** Intercept unhandled exceptions without leaking stack traces.

---

## 🛡️ 4. Input Sanitization & SQL Injection Defense

- Strictly prohibit string concatenation or interpolation when constructing database queries.
- Utilize parameterized statements, prepared queries, or validated ORMs (Prisma, Drizzle, SQLAlchemy).
- Sanitize and trim all string inputs to defend against stored and reflected cross-site scripting (XSS).

---

## 🧑‍💼 5. Departmental Roles & Dedicated Subagents

To enforce specialization of labor and enterprise rigor, 5 dedicated enterprise job roles and their corresponding subagent archetypes are established:

### 5.1 Senior REST & GraphQL API Engineer (Backend API Engineer)
- **Dedicated Subagent Role:** `Backend API Engineer`
- **Scope & Responsibilities:**
  - Build robust, scalable RESTful and GraphQL endpoints.
  - Implement clean service-layer business logic and repository design patterns.
  - Enforce strict DTO validation, input sanitization, and structured error responses.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Backend API Engineer",
  "Prompt": "Develop robust RESTful and GraphQL endpoints, implement clean service-layer business logic, enforce strict DTO validation, and integrate ORM repository patterns."
}
```

### 5.2 Distributed Systems & Microservices Engineer (Distributed Systems Engineer)
- **Dedicated Subagent Role:** `Distributed Systems Engineer`
- **Scope & Responsibilities:**
  - Architect distributed workflows and microservice topologies.
  - Implement circuit breakers and graceful degradation patterns.
  - Coordinate distributed Saga transactions and fault-tolerant service communication.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Distributed Systems Engineer",
  "Prompt": "Architect distributed microservice workflows, implement circuit breaker patterns, orchestrate Saga transactions, and design fault-tolerant service communication."
}
```

### 5.3 Auth, Identity & RBAC Security Engineer (Backend Security Engineer)
- **Dedicated Subagent Role:** `Backend Security Engineer`
- **Scope & Responsibilities:**
  - Implement enterprise OAuth2, OIDC, and JWT-based authentication.
  - Deploy fine-grained Role-Based Access Control (RBAC) guards.
  - Manage secure token revocation, session lifecycle, and Argon2 password hashing.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Backend Security Engineer",
  "Prompt": "Implement enterprise OAuth2/OIDC authentication, fine-grained Role-Based Access Control (RBAC), secure token revocation, and hardened cryptographic password hashing."
}
```

### 5.4 Caching, Queue & Asynchronous Systems Engineer (Queue Systems Specialist)
- **Dedicated Subagent Role:** `Queue Systems Specialist`
- **Scope & Responsibilities:**
  - Deploy high-throughput Redis caching layers and Redlock distributed locks.
  - Architect asynchronous job queues using BullMQ, RabbitMQ, or Kafka.
  - Configure Dead-Letter Queues (DLQ), retry policies, and race condition safeguards.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Queue Systems Specialist",
  "Prompt": "Engineer high-throughput Redis caching layers, configure BullMQ/Kafka asynchronous job queues with DLQ dead-letter retry policies, and prevent race conditions."
}
```

### 5.5 AI / LLM Integration & Prompt Engineer (AI Integration Engineer)
- **Dedicated Subagent Role:** `AI Integration Engineer`
- **Scope & Responsibilities:**
  - Integrate frontier LLM APIs (Gemini, Claude, OpenAI) into backend architectures.
  - Implement structured outputs (JSON schema enforcement) and tool-calling protocols.
  - Design performant Retrieval-Augmented Generation (RAG) pipelines and chunking strategies.
  - Harden prompt engineering guardrails against prompt injection and jailbreaking.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "AI Integration Engineer",
  "Prompt": "Architect backend LLM integrations, implement robust RAG pipelines, enforce structured outputs and tool calling workflows, and optimize prompt engineering guardrails."
}
```

---

## 🚦 6. Department Handoff & Verification Gates

1. **Gate 6-A (Contract Adherence):** All API responses must conform strictly to defined DTO schemas.
2. **Gate 6-B (Security Guardrails):** Unauthenticated and unauthorized requests must produce 401 and 403 responses.
3. **Downstream Handoff:**
   - API documentation generation ➔ **Dept 07: Technical Documentation**
   - Automated API integration testing ➔ **Dept 08: Quality Assurance & Testing**
