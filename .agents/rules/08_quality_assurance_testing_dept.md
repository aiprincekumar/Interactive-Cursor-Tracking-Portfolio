# Department 08: Quality Assurance, Testing & Verification

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/archive/universal_rules.md) (Archived canonical reference)

---

## 🧪 1. Mission & Department Scope

The Quality Assurance, Testing & Verification Department (Dept 08) serves as the primary guardian of functional correctness, system stability, regression prevention, and production-grade software quality. This department governs unit testing, integration testing, end-to-end (E2E) automation, Test-Driven Development (TDD), and the deployment of independent QA Verification Subagents.

---

## 🎯 2. Test-Driven Development & Test Pyramid Standards

### 2.1 The Test Pyramid Strategy
- **Unit Tests (70%):** Fast, isolated tests verifying algorithmic correctness, utilities, and core domain business logic (Vitest / Jest / pytest).
- **Integration Tests (20%):** Validating interactions across databases, HTTP routers, middleware, and third-party integrations (Supertest, Testcontainers).
- **E2E Tests (10%):** Validating critical user journeys end-to-end inside headless browsers (Playwright / Cypress).

### 2.2 TDD Methodology (Red-Green-Refactor)
1. **Red (Failing Test):** Author an intentionally failing test defining expected behavior before writing production logic.
2. **Green (Passing Code):** Implement the minimal code necessary to satisfy the test contract.
3. **Refactor (Clean & Optimize):** Refactor implementation and test code for clarity, performance, and maintainability without altering established behavior.

```typescript
// Example: Vitest / Jest Unit Test TDD Pattern
import { describe, it, expect } from 'vitest';
import { calculateOrderDiscount } from './pricing';

describe('calculateOrderDiscount', () => {
  it('should apply 10% discount for orders over $100', () => {
    const total = calculateOrderDiscount(120, 'STANDARD_USER');
    expect(total).toBe(108);
  });

  it('should apply 20% discount for VIP users regardless of amount', () => {
    const total = calculateOrderDiscount(50, 'VIP_USER');
    expect(total).toBe(40);
  });

  it('should throw error for negative order amount', () => {
    expect(() => calculateOrderDiscount(-10, 'STANDARD_USER')).toThrow('Invalid amount');
  });
});
```

---

## 🎭 3. Playwright E2E Automation Standards

- **Page Object Model (POM):** Encapsulate UI locators and user interactions into reusable page objects.
- **Resilient Selectors:** Prefer accessible roles (`getByRole('button', { name: /submit/i })`) or dedicated `data-testid` attributes over brittle CSS class selectors.
- **Zero-Flakiness Standard:** Strictly ban hardcoded timeouts (`sleep` or `waitForTimeout(5000)`); rely exclusively on web-first assertions (`await expect(locator).toBeVisible()`).

---

## 🕵️ 4. Mandatory Independent Verification Subagent Protocol (Rule 1 & Rule 13)

- **Independent Verification Mandate:** Prior to declaring any task complete, the Main Agent (CEO) must dispatch an independent QA/Verification subagent to validate output quality.
- **Verification Subagent Inspection Checklist:**
  - [ ] All unit, integration, and E2E test suites pass with 100% green status.
  - [ ] Branch code coverage meets or exceeds the required threshold (minimum 80-85%).
  - [ ] Typecheck (`tsc --noEmit`) and linter pass with zero errors and zero warnings.
  - [ ] Zero unhandled promise rejections, memory leaks, or console errors.

---

## 🧑‍💼 5. Departmental Roles & Dedicated Subagents

To enforce specialization of labor and enterprise rigor, 4 dedicated enterprise job roles and their corresponding subagent archetypes are established:

### 5.1 SDET Automation Test Lead (Automation Test Engineer)
- **Dedicated Subagent Role:** `Automation Test Engineer`
- **Scope & Responsibilities:**
  - Champion and enforce Test-Driven Development (TDD) methodologies.
  - Author and maintain unit and integration test suites using Vitest and Jest.
  - Enforce branch code coverage thresholds (>=85%) and manage test fixtures.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Automation Test Engineer",
  "Prompt": "Drive test-driven development (TDD), construct comprehensive unit and integration test suites using Vitest/Jest, enforce >=85% branch coverage, and build test fixtures."
}
```

### 5.2 E2E & Browser Automation Engineer (E2E QA Engineer)
- **Dedicated Subagent Role:** `E2E QA Engineer`
- **Scope & Responsibilities:**
  - Develop reliable Playwright end-to-end regression suites using the Page Object Model.
  - Validate user journeys across Chromium, Firefox, WebKit, and mobile viewports.
  - Capture trace artifacts, screenshots, and video recordings for failing test runs.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "E2E QA Engineer",
  "Prompt": "Develop reliable Playwright end-to-end regression suites using the Page Object Model, validate user journeys across browsers, and capture trace artifacts for failures."
}
```

### 5.3 Performance & Load Testing Specialist (Load Test Engineer)
- **Dedicated Subagent Role:** `Load Test Engineer`
- **Scope & Responsibilities:**
  - Author and run high-concurrency load and stress test scripts using k6 and Artillery.
  - Map latency distributions (p90, p95, p99) and system throughput thresholds.
  - Pinpoint system degradation limits and infrastructure bottlenecks.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Load Test Engineer",
  "Prompt": "Design and execute k6/Artillery load testing scripts, simulate high-concurrency peak traffic, measure latency percentiles (p95/p99), and identify system bottlenecks."
}
```

### 5.4 Exploratory & Edge-Case QA Analyst (Exploratory QA Specialist)
- **Dedicated Subagent Role:** `Exploratory QA Specialist`
- **Scope & Responsibilities:**
  - Conduct adversarial exploratory testing and inject boundary-value payloads.
  - Probe concurrency race conditions and unexpected asynchronous timing sequences.
  - Document reproducible defect reports and map negative acceptance scenarios.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Exploratory QA Specialist",
  "Prompt": "Conduct adversarial exploratory testing, inject malformed boundary payloads, probe concurrency race conditions, and document reproducible edge-case defect reports."
}
```

---

## 🚦 6. Department Handoff & Verification Gates

1. **Gate 8-A (Test Pass Rate):** 100% of automated tests must be passing green.
2. **Gate 8-B (Verification Signoff):** Independent Verification Subagent must submit a formal signoff report.
3. **Downstream Handoff:** Upon QA signoff, deliverables advance to **Dept 09: Performance** and **Dept 12: DevOps**.
