# Department 11: Legal, Licensing & Compliance

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/archive/universal_rules.md) (Archived canonical reference)

---

## ⚖️ 1. Mission & Department Scope

The Legal, Licensing & Compliance Department (Dept 11) is the supreme authority governing open-source software license compliance, intellectual property protection, SPDX identifier standardization, third-party attribution manifests, and global data privacy regulations (GDPR, CCPA, HIPAA).

This department ensures that every third-party dependency utilized within the ecosystem is legally compliant and free of copyleft contamination risks.

---

## 📜 2. Open-Source License Governance & Taxonomy

### 2.1 Permissive Licenses (Approved for Unrestricted Use)
- **MIT License:** Highly permissive, minimal constraints.
- **Apache 2.0:** Permissive license including explicit patent grants and trademark protections.
- **BSD 2-Clause / 3-Clause:** Permissive and approved.
- **ISC License:** Simplified permissive license approved across all modules.

### 2.2 Restricted Copyleft Licenses (Strict Prohibition)
- **GPL v2 / GPL v3 and AGPL:** Strictly prohibited in proprietary or commercial codebases unless an explicit directive mandates releasing the repository under GPL (as copyleft terms mandate open-sourcing derivative works).
- **LGPL:** Permitted only when consumed via dynamic linking without static compilation into application artifacts.

---

## 🏷️ 3. SPDX Headers & Attribution Manifests

### 3.1 Standardized SPDX Header Format
Every proprietary source code file must declare an SPDX identifier and copyright notice in its header:
```typescript
// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Atul Verma (aiprincekumar). All rights reserved.
```

### 3.2 Third-Party Attribution (`CREDITS.md` / `NOTICE`)
- Every project root must maintain a `CREDITS.md` or `NOTICE` file enumerating all production third-party libraries, their licenses, and upstream copyright holders.

---

## 🔒 4. Data Privacy & Regulatory Compliance (GDPR / CCPA)

- **Privacy by Design:** Collect and persist strictly the minimal Personally Identifiable Information (PII) required for core business transactions.
- **Data Minimization:** Never store sensitive identifiers (e.g., SSN, national ID numbers, raw payment card data) without strict regulatory architecture.
- **Right to Be Forgotten:** Implement programmatic mechanisms to export, anonymize, or permanently delete user personal records upon request.

---

## 🧑‍💼 5. Departmental Roles & Dedicated Subagents

To enforce specialization of labor and enterprise rigor, 4 dedicated enterprise job roles and their corresponding subagent archetypes are established:

### 5.1 Open Source License Compliance Auditor (Open Source License Auditor)
- **Dedicated Subagent Role:** `Open Source License Auditor`
- **Scope & Responsibilities:**
  - Audit open-source dependencies for license compatibility (MIT/Apache vs. GPL/AGPL).
  - Generate SPDX license header manifests and maintain `THIRD_PARTY_LICENSES.md`.
  - Prevent viral copyleft contamination and legal copyright infringement.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Open Source License Auditor",
  "Prompt": "Audit open-source dependencies for license compatibility (MIT/Apache vs GPL/AGPL), generate SPDX manifests, compile THIRD_PARTY_LICENSES.md, and prevent copyleft contamination."
}
```

### 5.2 Data Privacy & Regulatory Compliance Officer (Data Privacy Officer)
- **Dedicated Subagent Role:** `Data Privacy Officer`
- **Scope & Responsibilities:**
  - Audit data processing workflows for GDPR, CCPA, and privacy regulation compliance.
  - Enforce PII pseudonymization and encryption-at-rest/in-transit standards.
  - Define data retention schedules and oversee consent lifecycle architectures.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Data Privacy Officer",
  "Prompt": "Audit data flows for GDPR/CCPA compliance, enforce PII pseudonymization and encryption-at-rest, define data retention schedules, and manage user consent architectures."
}
```

### 5.3 Intellectual Property & Copyright Auditor (IP Compliance Specialist)
- **Dedicated Subagent Role:** `IP Compliance Specialist`
- **Scope & Responsibilities:**
  - Verify source code provenance and intellectual property ownership.
  - Audit copyright headers and attribution notices across all repository files.
  - Assess patent risks and protect proprietary trade secret codebases.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "IP Compliance Specialist",
  "Prompt": "Verify code provenance and IP ownership, validate intellectual property copyright notices across all source headers, and assess patent infringement risks."
}
```

### 5.4 Export Control & Regulatory Compliance Specialist (Regulatory Compliance Specialist)
- **Dedicated Subagent Role:** `Regulatory Compliance Specialist`
- **Scope & Responsibilities:**
  - Audit cryptographic implementations against international export controls (EAR / ECCN).
  - Enforce jurisdictional compliance and data sovereignty rules.
  - Verify adherence to global trade sanctions and restricted-party screening protocols.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Regulatory Compliance Specialist",
  "Prompt": "Audit cryptographic implementations for international export compliance (EAR/ECCN classifications), enforce jurisdictional compliance, and ensure sanctions screening."
}
```

---

## 🚦 6. Department Handoff & Verification Gates

1. **Gate 11-A (License Checker Gate):** `npx license-checker --onlyAllow "MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC"` must pass without policy violations.
2. **Gate 11-B (PII Hygiene):** Zero unencrypted or non-compliant PII persistence verified across data schemas.
3. **Downstream Handoff:** Upon legal and compliance signoff, deliverables advance to **Dept 12: DevOps, Build & Release**.
