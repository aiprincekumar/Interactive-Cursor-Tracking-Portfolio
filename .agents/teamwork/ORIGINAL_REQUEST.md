# Original User Request

## Initial Request — 2026-10-23T04:56:10Z

Implement a complete, production-quality, local, rule-based, and search-driven Hybrid Portfolio Assistant inside the existing React 19 + Vite 8.3 + Tailwind v4 portfolio on GitHub Pages (`/Interactive-Cursor-Tracking-Portfolio/`).

Working directory: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio`
Integrity mode: development

## Architecture & Confirmed Decisions
1. **UI Presentation:** Deep upgrade of the existing embedded bottom-right floating widget (`AIChatWidget.jsx` in `FloatingActionHub.jsx`), retaining glassmorphism, capsule styling, minimize/dock controls, and Dynamic Island aesthetics.
2. **Conversation State:** Session-scoped storage (`sessionStorage` with memory cache) so refreshing the page preserves context, with an instant "Clear Chat" button and zero tracking.
3. **Multilingual Intelligence:** Natural language detection for English, Hindi, and Hinglish queries, returning responses in the matched dialect/language.
4. **Direct Action Triggers:** Interactive action buttons that dispatch native custom window events (`portfolio:open-case-study` for project dossiers, `portfolio:switch-contact-tab` for quotation estimator, and smooth hash scroll with focus for sections) without closing the chat.
5. **Multi-Role & Audience Alignment:** Seamless sync with `RoleContext` (`accountant`, `mis`, `vibe_coding`, `other`, `overview`) and `AudienceContext` (`recruiter`, `client`, `marriage`, `all`).

## Requirements

### R1. Deterministic Knowledge & Retrieval Engine (Layers A–H)
- Implement Layer A (Intent recognition for 16 core intents: roles, projects, skills, experience, services, achievements, recruiter info, client info, marriage bio, contact, availability, navigation, filter toggles, suggestions, and ambiguous queries).
- Implement Layer B (Synonym & phrase dictionary covering English, Hindi, Hinglish, technical aliases, and typo normalizations).
- Implement Layer C (Weighted local search index indexing 83+ catalog items, 9 case studies, 37 skills, 10 experience positions, 40 bilingual FAQs, and quotation services).
- Implement Layer D & E (Audience-aware and role-aware filtering with dynamic relaxation when queries produce zero results).
- Implement Layer F (Authoritative FAQ matching returning exact verified answers without hallucination).
- Implement Layer G & H (Interactive decision-tree disambiguation chips and truthful fallback with alternative queries).

### R2. UI/UX, Dynamic Island & Accessibility Integration
- Upgrade `src/components/AIChatWidget.jsx` with responsive drawer/card states, active filter badges, clickable suggestion chips, action buttons, and conversation reset.
- Adhere to WCAG 2.2 AA: semantic markup, roving keyboard navigation, Escape-to-close, visible focus rings, ARIA live region announcements for incoming messages, touch targets ≥ 44px, and `prefers-reduced-motion` compliance.

### R3. Data Taxonomy, Subpath Links & Offline Robustness
- Centralize portfolio facts without duplication, validating all links against the GitHub Pages subpath (`/Interactive-Cursor-Tracking-Portfolio/`).
- Prevent any fabricated metrics, experience dates, prices, or client names.
- Ensure 100% offline-friendly execution with zero external network requests, zero APIs, and zero ML downloads.

## Acceptance Criteria

### Functionality & Relevance
- [ ] Intent recognition accurately classifies 16+ core intents across exact, synonymous, and Hinglish phrasings.
- [ ] Recruiter mode prioritizes resumes, technical proficiencies, and experience; Client mode prioritizes quotation pricing, services, and case study deliverables.
- [ ] Role filters (`accountant`, `mis`, `vibe_coding`, `other`, `overview`) dynamically synchronize with the active portfolio state.
- [ ] Unknown or ambiguous queries provide helpful next steps without hallucinating facts.
- [ ] Direct action buttons successfully open the Case Study Drawer, switch Contact quotation tabs, and scroll smoothly.

### Verification & Performance
- [ ] All 38 existing test suites continue to pass (`npm test`).
- [ ] New dedicated test suite (`scripts/test-portfolio-assistant.js`) comprehensively verifies intent classification, synonym expansion, search scoring, audience filtering, and link integrity.
- [ ] Production build (`npm run build`) completes with zero errors, zero external network requests, and total bundle increase under 25 kB.

## Follow-up — 2026-10-23T13:36:16Z

This is a single self-contained fix; keep it small and focused.

Fix the Hybrid Portfolio Assistant's action execution pipeline and deep data retrieval in `AIChatWidget.jsx` and `portfolioAssistantEngine.js` within `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio`.

Working directory: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio`
Integrity mode: development

## Confirmed Architectural Decisions
1. **Case Study Drawer Minimization:** When a project action button is clicked, dispatch `portfolio:open-case-study` and auto-minimize the chat widget (`setIsMinimized(true)`) so the full 5-stage project dossier is immediately visible without obstruction.
2. **Role-Smart Project Buttons:** On general project queries ("Show me projects"), return the top 3 flagship Case Studies aligned with the active role (e.g. `#01 GST` & `#02 Tally` for Accountant; `#03 DAY-NULM` & `#04 Smart Card` for MIS; `#07 AI SaaS` & `#08 Multi-Agent` for Vibe Coder) with direct clickable "Open Case Study #0X" buttons, plus a "Browse All 9 Projects" scroll button.
3. **Exact Project Matching by Name:** Map project keywords ("GST", "Tally", "DAY-NULM", "Smart Card", "Power BI", "Corporate Audit", "SaaS Generator", "Multi-Agent", "Synthesizer") to their exact Case Study IDs (`01` through `09`) with their specific open button.
4. **Deep Data Retrieval:** Extract real metrics, percentages, tools, and descriptions from `skillsData.js`, `searchCatalog.js`, and `caseStudiesData.js` instead of generic static boilerplate.

## Requirements

### R1. Complete Action Dispatcher Fix in `AIChatWidget.jsx`
- Fix the `scroll` handler to extract section IDs from `action.target`, `payload.selector`, `payload.target`, `payload.sectionId`, or `action.sectionId`, strip `#` and invoke `handleScrollToSection`.
- Implement missing action handlers:
  - `download-resume`: Dynamically retrieve the current resume path (`resume-accountant.pdf`, `resume-mis.pdf`, etc.) and trigger an authentic download.
  - `open-estimator`: Smoothly scroll to `#contact`, dispatch `portfolio:switch-contact-tab` with `{ tab: 'quote' }`, and dispatch `portfolio:open-estimator`.
  - `switch-role-tab` & `set-role`: Support both action type names and invoke `selectRole`.
  - `open-case-study`: Extract case study ID (`01` through `09`) from `payload.id || action.target || action.payload.target`, dispatch `portfolio:open-case-study`, and auto-minimize the chat widget (`setIsMinimized(true)`).
  - `link`: Robust fallback for `payload.url || action.url || action.target`.

### R2. Deep Authentic Data Connection in `portfolioAssistantEngine.js`
- Eliminate the static boilerplate short-circuit that ignored indexed search results.
- Implement comprehensive Project Name to ID mapping directly to Case Studies `01` through `09`.
- When users ask about projects, dynamically generate clickable action buttons for relevant Case Studies with direct open buttons.
- Deeply synthesize answers for specific skill queries (e.g. Power BI, Excel VBA, GST, ITR, Tally, Multi-Agent) using real data points, metrics, and tools from `skillsData.js` and `searchCatalog.js`.
- Correct any historical dates in `AIChatWidget.jsx` fallback responses to align with authentic portfolio facts (2018–Present practice, 10+ years career).

## Acceptance Criteria

### Action Execution
- [ ] Clicking any action button (`scroll`, `open-case-study`, `download-resume`, `open-estimator`, `switch-role-tab`) executes its corresponding function immediately instead of only playing a click sound.
- [ ] Clicking a project action button successfully opens the Case Study Drawer and minimizes the chat widget.
- [ ] Clicking "Estimate Quotation" or a service button switches to the Contact section quotation estimator tab.
- [ ] Clicking "Download Resume" initiates the download for the active career track resume.

### Data Depth & Relevance
- [ ] Querying specific projects by name (e.g., "tell me about your GST project", "show me your Tally case study", "Power BI report") returns the exact case study with its matching action button.
- [ ] Querying specific skills (e.g., "Power BI", "Excel VBA", "DAY-NULM") returns detailed metrics and competencies from the authentic portfolio data rather than a generic boilerplate.
- [ ] All 38 existing test suites (`npm test`) and assistant test suites (`node scripts/test-portfolio-assistant.js`) pass 100%.
- [ ] Production build (`npm run build`) succeeds cleanly with zero errors.
