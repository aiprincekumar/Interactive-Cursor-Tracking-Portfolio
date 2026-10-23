# Task Dispatch: worker_engine_r1 (Knowledge & Retrieval Engine Specialist)

## Mission
Implement the complete, production-quality, deterministic Knowledge & Retrieval Engine (Layers A–H) in `src/utils/portfolioAssistantEngine.js` per R1 and R3 in ORIGINAL_REQUEST.md.

- **Authoritative Request**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md`
- **Working Directory**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_engine_r1`
- **Survey Specification**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_engine\handoff.md`
- **Orchestrator Project Plan**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\orchestrator\PROJECT.md`

## Exclusive Write Ownership
You EXCLUSIVELY own and may ONLY modify/create:
- `src/utils/portfolioAssistantEngine.js`
You MUST NOT edit any other project file.

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Technical Specifications
1. **Centralize Authentic Facts**:
   - Index the 84 catalog items from `src/data/searchCatalog.js`.
   - Index the 9 case studies from `src/data/caseStudiesData.js`.
   - Index the 40 bilingual FAQs from `src/data/faqConfig.js`.
   - Index the 12 quotation services and pricing from `src/components/QuotationEstimatorModal.jsx`.
   - Index the 5 role resumes from `src/data/resumeConfig.js` and demographic data from `src/components/AboutSection.jsx`.
   - Prevent any fabricated metrics, experience dates, prices, or client names.
2. **Layer A: 16 Core Intents**:
   - `roles`, `projects`, `skills`, `experience`, `services`, `achievements`, `recruiter_info`, `client_info`, `marriage_bio`, `contact`, `availability`, `navigation`, `filter_toggles`, `suggestions`, `ambiguous`, `fallback`.
3. **Layer B: Multilingual & Typo Dictionary**:
   - Support English, Devanagari Hindi, and Hinglish queries.
   - Technical aliases (`brs`, `itc`, `gstr`, `tally`, `mis`, `react`, `tailwind`, etc.).
   - Levenshtein distance <= 2 typo repair.
4. **Layer C: Weighted Search Scoring**:
   - Title matches: +60, Tag matches: +40, Category matches: +25, Body/Description: +10. Exact phrase boost: +50.
5. **Layers D & E: Role & Audience Filtering + Dynamic Relaxation**:
   - Filter by active role (`accountant`, `mis`, `vibe_coding`, `other`, `overview`) and audience (`all`, `recruiter`, `client`, `marriage`).
   - If results are 0, dynamically relax filters in 4 phases (role match -> audience match -> global match -> fallback) with `isRelaxed: true`.
6. **Layer F: Authoritative FAQ Matcher**:
   - Match verified answers from `faqConfig.js` (score >= 75) returning exact verified answer and CTA action button.
7. **Layers G & H: Disambiguation & Truthful Fallback**:
   - Ambiguous queries return decision-tree clarification chips.
   - Unknown queries return truthful fallback with 3 direct action triggers (WhatsApp, Resume, Section navigation).
8. **Public Exported API**:
   - `export function queryAssistant(query, context)`
   - `export function getInitialSuggestions(context)`
   - `export function clearSessionMemory()`
   - `export function detectLanguage(text)`
9. **Execution Safety**:
   - 100% offline, pure native JavaScript, zero external network requests, zero ML downloads.

When done, write `BRIEFING.md`, `progress.md`, and `handoff.md` in your working directory and notify orchestrator via `send_message`.


## 2026-10-23T05:13:26Z
[Message] timestamp=2026-10-23T05:13:26Z sender=d9b94e64-c3ce-47b0-9eeb-923492665270 priority=MESSAGE_PRIORITY_HIGH content=You are worker_engine_r1. Your role is Knowledge & Retrieval Engine Specialist.
Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_engine_r1

Read the authoritative requirements at:
c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md
and your dispatch instructions at:
c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_engine_r1\DISPATCH.md
and the survey specification at:
c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_engine\handoff.md
and the orchestrator project plan at:
c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\orchestrator\PROJECT.md

Exclusive Write Ownership:
You EXCLUSIVELY own and may ONLY modify/create:
- src/utils/portfolioAssistantEngine.js
You MUST NOT edit any other project file.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Implement Layers A–H:
1. Index 84 catalog items, 9 case studies, 40 bilingual FAQs, 12 quotation services, 5 role resumes, and demographic bio.
2. Layer A: 16 core intents (roles, projects, skills, experience, services, achievements, recruiter_info, client_info, marriage_bio, contact, availability, navigation, filter_toggles, suggestions, ambiguous, fallback).
3. Layer B: Multilingual & typo dictionary (English, Devanagari Hindi, Hinglish, technical aliases, Levenshtein <= 2).
4. Layer C: Weighted search scoring (Title +60, Tags +40, Category +25, Body +10, phrase boost +50).
5. Layers D & E: Role & audience filtering with 4-phase dynamic relaxation on 0 matches.
6. Layer F: Authoritative verbatim FAQ matching (score >= 75) with direct action CTA binding.
7. Layers G & H: Disambiguation chips for ambiguous queries and truthful fallback with 3 direct action triggers.
8. Exported APIs: queryAssistant, getInitialSuggestions, clearSessionMemory, detectLanguage.
9. 100% offline, zero external network calls, zero ML dependencies.

Create BRIEFING.md and progress.md, implement the complete module, verify it, create handoff.md, and send a message to orchestrator when finished.
