# Master Plan: Hybrid Portfolio Assistant (R1, R2, R3)

## Objective
Implement a complete, production-quality, local, rule-based, and search-driven Hybrid Portfolio Assistant inside the existing React 19 + Vite 8.3 + Tailwind v4 portfolio on GitHub Pages (`/Interactive-Cursor-Tracking-Portfolio/`).

## Architectural Phases

### Phase 0: Pre-Task Optimization & Audit (Rules 2, 3, 4)
- **Agent 1: `parallel_dispatch_optimizer` (Explorer)**
  - Assess parallelization feasibility, dependency graph, file boundaries, and race conditions.
- **Agent 2: `skill_requirement_scout` (Explorer)**
  - Audit required skills vs available skills; verify duplicate status.

### Phase 1: Deep Codebase Survey
- **Survey Explorer 1 (Architecture & Data Layer)**:
  - Examine data structures in `src/data/`, `RoleContext.jsx`, `AudienceContext.jsx`, catalog items (83+ items, 9 case studies, 37 skills, 10 experience positions, 40 bilingual FAQs, quotation services).
- **Survey Explorer 2 (UI & Interaction Layer)**:
  - Examine `src/components/AIChatWidget.jsx`, `FloatingActionHub.jsx`, custom window events (`portfolio:open-case-study`, `portfolio:switch-contact-tab`), focus management, WCAG 2.2 AA a11y.
- **Survey Explorer 3 (Test Infrastructure & Build Gate)**:
  - Survey existing 38 test suites, Vitest runner, build pipeline, bundle size constraints, and design `scripts/test-portfolio-assistant.js`.

### Phase 2: Implementation Track
- **M1: Engine Layer (R1)**:
  - Intent recognition (16 core intents: roles, projects, skills, experience, services, achievements, recruiter info, client info, marriage bio, contact, availability, navigation, filter toggles, suggestions, ambiguous).
  - Synonym & phrase dictionary (English, Hindi, Hinglish, technical aliases, typo tolerance).
  - Weighted search index (Layer C) covering all catalog items, skills, experience, bilingual FAQs.
  - Role-aware & audience-aware filtering (Layers D & E) with fallback relaxation.
  - Bilingual FAQ matching (Layer F) and disambiguation chips / truthful fallback (Layers G & H).
- **M2: UI/UX & Dynamic Island Chat Upgrade (R2)**:
  - Deep upgrade to `AIChatWidget.jsx`: glassmorphism, capsule styling, minimize/dock controls, Dynamic Island aesthetics.
  - Action trigger buttons for dossiers, quotation tab switching, smooth hash scrolling with focus.
  - Full WCAG 2.2 AA compliance: ARIA live regions, roving tabindex, visible focus rings, Escape-to-close, ≥44px touch targets, `prefers-reduced-motion`.
  - Session-scoped storage with instant clear.
- **M3: Data Taxonomy & Link Verification (R3)**:
  - Subpath link verification (`/Interactive-Cursor-Tracking-Portfolio/`).
  - 100% offline, zero external APIs/downloads.
  - Changes Log entries per Rule 6 (`changes_log/`).

### Phase 3: Testing & Verification Track
- **Test Writer**:
  - Implement and run `scripts/test-portfolio-assistant.js` covering intent classification, synonym expansion, search scoring, audience filtering, and link integrity.
  - Run full test suite (`npm test`) ensuring all 38 existing test suites pass.
  - Run production build (`npm run build`) ensuring zero errors, zero network requests, and total bundle increase under 25 kB.

### Phase 4: Review, Adversarial Challenge & Forensic Integrity Audit
- **Reviewers (2 parallel)**:
  - Review code quality, UI feel, accessibility, WCAG 2.2 AA.
- **Challengers (2 parallel)**:
  - Stress-test intent matching across English/Hindi/Hinglish, edge cases, rapid typing, session storage corruption, fallback handling.
- **Forensic Auditor**:
  - Verify authenticity, no hardcoding of test outputs, zero cheating, clean integrity verdict.

### Phase 5: Synthesis & Reporting
- Synthesize all findings and gate results.
- Report completion and readiness for Victory Audit to parent.
