# Department 14: Telemetry, Observability & Feature Flags

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/archive/universal_rules.md) (Archived canonical reference)

---

## 📡 1. Mission & Department Scope

The Telemetry, Observability & Feature Flags Department (Dept 14) directs real-time system health telemetry, distributed request tracing, structured logging, time-series metrics collection, error tracking, and progressive delivery via feature flags.

This department ensures every runtime event within the system is transparent, auditable, and controllable.

---

## 🔍 2. The Three Pillars of Observability

### 2.1 Structured JSON Logging Standards
- Prohibit unstructured plaintext logging (e.g., `console.log("user logged in")`).
- Mandate standardized, structured JSON payloads:

```json
{
  "timestamp": "2026-10-29T07:15:20.124Z",
  "level": "INFO",
  "service": "order-service",
  "traceId": "4bf92f3577b34da6a3ce929d0e0e4736",
  "spanId": "00f067aa0ba902b7",
  "userId": "usr_98a72b",
  "event": "ORDER_PLACED_SUCCESS",
  "context": {
    "orderId": "ord_10283",
    "amount": 249.99,
    "paymentMethod": "UPI"
  }
}
```

### 2.2 Distributed Tracing (OpenTelemetry Standards)
- Propagate `traceparent` headers across all inter-service network boundaries to correlate requests end-to-end under a unified trace ID.
- Instrument custom spans (`tracer.startActiveSpan`) around database queries, caching operations, and third-party API calls.

### 2.3 Core System Metrics (RED Method)
- **Rate:** Total throughput (Requests per second).
- **Errors:** Total error throughput (Failed requests per second).
- **Duration:** Request latency distributions (p95 and p99 latency percentiles).

---

## 🚩 3. Feature Flags & Progressive Delivery Architecture

### 3.1 Taxonomy of Feature Flags
1. **Release Flags:** Deploy new functionality dark in production while deactivated.
2. **Canary Rollouts:** Gradually shift traffic from 5% to 25%, 50%, and 100% of users while monitoring health metrics.
3. **Kill Switch:** Deactivate a failing production capability within 1 second without redeploying code.

```typescript
// Example: Safe feature flag branch execution
import { isFeatureEnabled } from './featureFlags';

export async function processCheckout(userId: string, cart: Cart) {
  const useV2CheckoutEngine = await isFeatureEnabled('checkout_engine_v2', userId);

  if (useV2CheckoutEngine) {
    return processCheckoutV2(userId, cart);
  }

  return processCheckoutV1(userId, cart);
}
```

---

## 🩺 4. Synthetic Health Check Probes

Every backend service must expose standardized health endpoints:
- `/healthz` (Liveness Probe): Verifies process vitality and HTTP responsiveness (200 OK).
- `/readyz` (Readiness Probe): Verifies that dependencies (database, cache, queues) are connected and ready to accept traffic (200 OK / 503 Service Unavailable).

---

## 🧑‍💼 5. Departmental Roles & Dedicated Subagents

To enforce specialization of labor and enterprise rigor, 3 dedicated enterprise job roles and their corresponding subagent archetypes are established:

### 5.1 Observability & Distributed Tracing Engineer (Telemetry Engineer)
- **Dedicated Subagent Role:** `Telemetry Engineer`
- **Scope & Responsibilities:**
  - Instrument application runtimes with the OpenTelemetry SDK.
  - Propagate distributed trace contexts (W3C TraceContext) across microservices.
  - Analyze latency flamegraphs and profile system bottlenecks.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Telemetry Engineer",
  "Prompt": "Instrument application runtimes with OpenTelemetry SDK, configure distributed trace context propagation across microservices, and design latency flamegraph tracing."
}
```

### 5.2 Feature Flag & Canary Rollout Manager (Feature Flag Manager)
- **Dedicated Subagent Role:** `Feature Flag Manager`
- **Scope & Responsibilities:**
  - Integrate dynamic feature toggle providers.
  - Coordinate percentage-based progressive canary rollouts (5% to 100%).
  - Activate instantaneous zero-downtime kill-switches upon error threshold breach.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Feature Flag Manager",
  "Prompt": "Implement feature toggles using LaunchDarkly/custom providers, orchestrate progressive percentage-based canary rollouts, and establish instant zero-downtime kill-switches."
}
```

### 5.3 Metrics, Logs & Alerting Dashboard Specialist (Metrics Dashboard Specialist)
- **Dedicated Subagent Role:** `Metrics Dashboard Specialist`
- **Scope & Responsibilities:**
  - Ingest RED and USE telemetry into Prometheus and time-series collectors.
  - Enforce structured JSON logging with correlation IDs (Winston / Pino).
  - Construct real-time Grafana monitoring dashboards and alert paging rules.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Metrics Dashboard Specialist",
  "Prompt": "Configure RED/USE metrics collection, implement structured correlation-ID JSON logging, design real-time Grafana dashboards, and establish high-fidelity alerting rules."
}
```

---

## 🚦 6. Department Handoff & Verification Gates

1. **Gate 14-A (Health Probes):** Both `/healthz` and `/readyz` probes returning valid health payloads.
2. **Gate 14-B (Telemetry Flow):** Spans, metrics, and structured logs confirmed streaming to telemetry collectors.
3. **Enterprise Architecture Certified:** Full system operational visibility, resilience, and security established.
