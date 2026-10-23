# Project: Hybrid Portfolio Assistant (R1, R2, R3)

## Architecture
- Module & File Boundaries:
  - `src/utils/portfolioAssistantEngine.js`: Complete 8-layer (Layers A–H) deterministic knowledge, intent classification, synonym expansion, weighted search, dynamic relaxation, and authoritative FAQ matching engine.
  - `src/components/AIChatWidget.jsx`: Accessible, responsive floating chat assistant with Dynamic Island styling, active role/audience badges, action triggers, session persistence, and WCAG 2.2 AA compliance (preserving all 22 literal string invariants).
  - `scripts/test-portfolio-assistant.js`: 10-suite acceptance test harness validating 16 core intents, multilingual phrasings, scoring models, subpath link integrity, and offline safety.
  - `package.json`: Chained test script runner adding `test-portfolio-assistant.js` as the 38th verification suite.
  - `changes_log/`: Full audit trail per Universal Rule 6 (`summary/`, `master/`, `daily/`, `entries/`, `recent_10/`).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Centralized Data & Taxonomy | Full taxonomy indexing 84 catalog items, 9 case studies, 37 skills, 10 experience positions, 40 bilingual FAQs, 12 quotation services, 5 role resumes | M1 | Survey (`explorer_survey_engine`) |
| 2 | Layer A: 16 Core Intents | High-precision regex & keyword classifiers for roles, projects, skills, experience, services, achievements, recruiter info, client info, marriage bio, contact, availability, navigation, filter toggles, suggestions, ambiguous, fallback | M1 | Survey (`explorer_survey_engine`) |
| 3 | Layer B: Multilingual & Typo Dictionary | English aliases, Devanagari Hindi, Hinglish slang, technical aliases, and Levenshtein distance <= 2 typo tolerance | M1 | Survey (`explorer_survey_engine`) |
| 4 | Layer C: Weighted Local Search Index | Inverted index scoring: title +60, tags +40, category +25, body +10, exact phrase boost +50, prefix/fuzzy matching | M1 | Survey (`explorer_survey_engine`) |
| 5 | Layers D & E: Role & Audience Filter with Relaxation | Strict sync with `RoleContext` and `AudienceContext`, with 4-phase dynamic relaxation on zero results | M1 | Survey (`explorer_survey_engine`) |
| 6 | Layer F: Authoritative FAQ Matching | Exact verbatim answer retrieval (score >= 75) with direct action CTA binding and zero hallucination | M1 | Survey (`explorer_survey_engine`) |
| 7 | Layers G & H: Disambiguation & Truthful Fallback | Clarification chips for ambiguous queries and truthful fallback with 3 direct action triggers (WhatsApp, Resume, Sections) | M1 | Survey (`explorer_survey_engine`) |
| 8 | UI/UX & Dynamic Island Upgrade | Glassmorphism, capsule styling, minimize/dock controls, Dynamic Island header badges, 1-click Clear Chat, session-scoped storage | M2 | Survey (`explorer_survey_ui`) |
| 9 | Direct Action Event Triggers | Dispatch `portfolio:open-case-study` ('01'-'09'), `portfolio:switch-contact-tab` ('quote'), and smooth hash scroll with programmatic focus | M2 | Survey (`explorer_survey_ui`) |
| 10 | WCAG 2.2 AA Accessibility | Polite ARIA live regions, roving tabindex on suggestion chips, Escape-to-close with focus return, visible focus rings, >=44px touch targets | M2 | Survey (`explorer_survey_ui`) |
| 11 | 22 Literal Test Invariants | Strict preservation of classes, IDs, text strings, and prompt chips required by `scripts/verify_ai_chat_feature.mjs` | M2 | Survey (`explorer_survey_ui`) |
| 12 | Dedicated Acceptance Test Harness | `scripts/test-portfolio-assistant.js` with 10 test suites covering intents, synonyms, scoring, relaxation, events, links, offline safety | M3 | Survey (`explorer_survey_tests`) |
| 13 | Test Runner Integration & Zero Regressions | Update `package.json` test script, ensure all 38 test suites pass, zero errors in Oxlint, and bundle increase < 25 kB | M3 | Survey (`explorer_survey_tests`) |
| 14 | Universal Rule 6 Audit Trail | Create complete `changes_log/` records across `summary/`, `master/`, `daily/`, `entries/`, `recent_10/` with standardized timestamps | M4 | Universal Rule 6 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Knowledge & Retrieval Engine | `src/utils/portfolioAssistantEngine.js` implementing Layers A–H | None | DONE |
| M2 | UI/UX & Dynamic Island Widget | `src/components/AIChatWidget.jsx` with context sync, action buttons, WCAG 2.2 AA, invariant preservation | M1 (Contract defined) | DONE |
| M3 | QA & Acceptance Harness | `scripts/test-portfolio-assistant.js` and `package.json` | M1, M2 (Contract defined) | DONE |
| M4 | Audit Trail & Changes Log | `changes_log/` directory structure and entries | M1, M2, M3 | DONE |
| M5 | Quality Gates & Forensic Verification | Independent functional review, a11y review, adversarial challenge, forensic audit | M1, M2, M3, M4 | DONE |

## Interface Contracts
### Engine ↔ UI Contract (`src/utils/portfolioAssistantEngine.js`)
```javascript
export function queryAssistant(query, context = { role: 'overview', audience: 'all' })
// Returns:
// {
//   intent: string,
//   language: 'en' | 'hi' | 'hinglish',
//   text: string,
//   chips: Array<{ id: string, label: string, query: string }>,
//   actions: Array<{ type: 'open-case-study'|'switch-contact-tab'|'scroll'|'link', label: string, payload: any }>,
//   confidence: number,
//   isRelaxed?: boolean
// }

export function getInitialSuggestions(context = { role: 'overview', audience: 'all' })
// Returns Array<{ id: string, label: string, query: string }>

export function clearSessionMemory()
```

### Event Contracts
- Case Study Drawer: `window.dispatchEvent(new CustomEvent('portfolio:open-case-study', { detail: { id: string } }))`
- Contact Tab: `window.dispatchEvent(new CustomEvent('portfolio:switch-contact-tab', { detail: { tab: 'quote' } }))`
- Section Scroll: `element.scrollIntoView({ behavior: 'smooth' }); element.focus({ preventScroll: true });`

## Code Layout
- `src/utils/portfolioAssistantEngine.js` (Owned by `worker_engine_r1`)
- `src/components/AIChatWidget.jsx` (Owned by `worker_ui_r1`)
- `scripts/test-portfolio-assistant.js` (Owned by `worker_qa_r1`)
- `package.json` (Owned by `worker_qa_r1`)
- `changes_log/` (Owned by `changes_log_manager`)
