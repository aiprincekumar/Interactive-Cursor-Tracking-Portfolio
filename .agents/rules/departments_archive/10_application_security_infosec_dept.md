# Department 10: Application Security & InfoSec

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/archive/universal_rules.md) (Archived canonical reference)

---

## 🛡️ 1. Mission & Department Scope

The Application Security & InfoSec Department (Dept 10) serves as the supreme authority for application fortification, credential sanitization, OWASP Top 10 mitigation, data-at-rest and data-in-transit encryption, and security policy enforcement.

This department enforces zero security defects, zero leaked credentials, and zero unauthorized access pathways.

---

## 🔑 2. Secret Scanning & Zero Hardcoded Secrets Policy

### 2.1 Absolute Zero Hardcoded Secrets Mandate
- Prohibit hardcoded API keys, passwords, database connection strings, JWT signing keys, or private certificates in source files, comments, tests, or git histories.
- Sensitive values must be injected strictly via environment variables (`.env`), and `.env` must be explicitly listed in `.gitignore`.
- Repositories must maintain a clean `.env.example` file populated exclusively with sanitized dummy values.

### 2.2 Automated Pre-Commit & Pre-Push Secret Scanning (`gitleaks`)
- **Primary Secret Audit Standard:** `gitleaks` (`gitleaks detect --redact --verbose`) is the non-negotiable pre-commit and pre-push gatekeeper.
- **Strict Pre-Push Gate:** Before any staged commit or remote git push operation is presented to the user for confirmation, `gitleaks` must execute with zero findings. If any secret or credential pattern is detected, the operation is immediately blocked.
- **Multi-Engine Audit Defense:** Combine `gitleaks` with secondary scanners (`trufflehog`, GitHub Secret Scanning) to ensure zero credential leaks across repository history.

### 2.3 Standalone Pre-Commit Secret Scanner Engine (`secret_scanner.py`)
- **Deterministic Static Secret Scanner:** `scripts/security/secret_scanner.py` provides high-speed, zero-token static credential and secret detection across git staged files, unstaged diffs, and tracked directories.
- **Multi-Provider Pattern Coverage:** Scans for AWS access/secret keys, GCP API keys, GitHub tokens, Slack webhooks, OpenAI/Anthropic/Gemini API keys, private RSA/EC keys, database connection URIs, and JWT secrets with regex classification.
- **False-Positive Suppression:** Automatically filters placeholder tokens (`YOUR_API_KEY`, `mock_*`, `dummy_*`) and redacts findings in terminal outputs.
- **1-Click Execution:** Run via `python scripts/security/secret_scanner.py` or `task audit` before staging commits or requesting Git operations. Exit code 0 certifies a clean scan; exit code 1 blocks execution.

---

## 🛑 3. OWASP Top 10 Mitigation Standards

| Vulnerability | Inherent Risk | Mandatory Engineering Defense |
| :--- | :--- | :--- |
| **A01: Broken Access Control** | Unauthorized data access / IDOR | Server-side object-level ownership checks (Object-Level Authorization) |
| **A02: Cryptographic Failures** | Plaintext credential exposure | `Argon2id` / `bcrypt` (cost >= 12); `AES-256-GCM` for database fields |
| **A03: Injection (SQL / NoSQL / OS)** | RCE or unauthorized exfiltration | 100% parameterized queries; prohibition of dynamic string interpolation |
| **A04: Insecure Design** | Architectural exploit surface | Threat modeling, fail-closed access barriers, rate-limiting gates |
| **A05: Security Misconfiguration** | Stack trace disclosure / default keys | Strip verbose errors in production; mandate `helmet` HTTP headers |
| **A07: Identification & Auth Failures** | Brute force / credential stuffing | Multi-Factor Authentication (MFA), `HttpOnly` session cookies, lockout thresholds |
| **A08: Software & Data Integrity** | Compromised upstream packages | Lockfile verification (`package-lock.json`), automated `npm audit` gates |

---

## 🌐 4. HTTP Security Headers & CORS Policy

Every server response must enforce baseline HTTP security headers:

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' },
  noSniff: true
}));
```

---

## 🧑‍💼 5. Departmental Roles & Dedicated Subagents

To enforce specialization of labor and enterprise rigor, 4 dedicated enterprise job roles and their corresponding subagent archetypes are established:

### 5.1 Application Security Engineer (AppSec Engineer)
- **Dedicated Subagent Role:** `AppSec Engineer`
- **Scope & Responsibilities:**
  - Execute Static Application Security Testing (SAST) and dependency vulnerability audits.
  - Enforce secure coding standards and eliminate injection and cross-site scripting (XSS) vectors.
  - Proactively identify and remediate Common Vulnerabilities and Exposures (CVEs) in dependencies.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "AppSec Engineer",
  "Prompt": "Conduct static application security testing (SAST), remediate vulnerable dependencies, enforce secure coding practices, and eliminate injection and XSS vectors."
}
```

### 5.2 Penetration Tester & Ethical Hacker (Penetration Tester)
- **Dedicated Subagent Role:** `Penetration Tester`
- **Scope & Responsibilities:**
  - Simulate adversarial attack vectors following OWASP Top 10 methodologies.
  - Probe authorization bypasses, privilege escalation vectors, and CSRF/SSRF vulnerabilities.
  - Verify defensive access controls, input sanitization boundaries, and security headers.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Penetration Tester",
  "Prompt": "Simulate adversarial cyber attacks following OWASP Top 10 methodologies, probe authorization bypasses, test for CSRF/SSRF vulnerabilities, and verify defensive controls."
}
```

### 5.3 Secrets, KMS & Credential Governance Officer (Secrets Governance Officer)
- **Dedicated Subagent Role:** `Secrets Governance Officer`
- **Scope & Responsibilities:**
  - Enforce zero hardcoded secrets policies with pre-commit and pre-push scanners (`gitleaks`, TruffleHog).
  - Architect AWS Secrets Manager, HashiCorp Vault, and KMS encryption layers.
  - Manage automated credential rotation, least-privilege service roles, and leak prevention.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Secrets Governance Officer",
  "Prompt": "Enforce zero hardcoded secrets policies, integrate pre-commit and pre-push secret scanners (gitleaks, TruffleHog), architect KMS and Vault secret management, and orchestrate automated key rotation."
}
```

### 5.4 Cloud Infrastructure Security & IAM Auditor (Cloud Security Auditor)
- **Dedicated Subagent Role:** `Cloud Security Auditor`
- **Scope & Responsibilities:**
  - Audit Cloud Security Posture Management (CSPM) and IAM least-privilege policies.
  - Inspect VPC security groups, subnets, and internet ingress exposure.
  - Detect and eliminate misconfigurations across cloud infrastructure.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Cloud Security Auditor",
  "Prompt": "Audit cloud infrastructure security baselines, enforce principle of least privilege in IAM policies, inspect VPC network configurations, and eliminate public cloud misconfigurations."
}
```

---

## 🚦 6. Department Handoff & Verification Gates

1. **Gate 10-A (Dependency Audit):** `npm audit --production` must show zero High or Critical vulnerabilities.
2. **Gate 10-B (Secret Hygiene & Gitleaks Audit):** `gitleaks detect` passes with zero plaintext credentials or active tokens detected across the working tree and commit history.
3. **Downstream Handoff:** Upon security clearance, deliverables pass to **Dept 11: Legal & Compliance** and **Dept 12: DevOps**.
