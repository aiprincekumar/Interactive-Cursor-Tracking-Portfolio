# Task Dispatch: worker_engine_r2 (Engine Remediation Specialist)

## Mission
Apply the comprehensive, verified patches to `src/utils/portfolioAssistantEngine.js` and `src/data/faqConfig.js` to fix all Devanagari Unicode regex boundaries, missing Hindi keywords, dialect fallback copy, 5 adversarial bugs, prototype property protection, and search substring collisions per Iteration 2 explorer handoffs.

- **Authoritative Request**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md`
- **Working Directory**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_engine_r2`
- **Key Explorer Handoffs to Read**:
  1. `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_remediation_adversarial\handoff.md`
  2. `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_remediation_devanagari\handoff.md`
  3. `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_remediation_suite2\handoff.md`

## Exclusive Write Ownership
You EXCLUSIVELY own and may ONLY modify:
- `src/utils/portfolioAssistantEngine.js`
- `src/data/faqConfig.js` (only if adding location FAQ alias)
You MUST NOT edit any other project file.

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Detailed Patch Instructions
1. **Unicode Devanagari Boundaries**:
   - Use `makeBoundaryRegex = (patternStr) => new RegExp('(?<![\\p{L}\\p{N}\\p{M}])(?:' + patternStr + ')(?![\\p{L}\\p{N}\\p{M}])', 'iu')` for `INTENT_PATTERNS`.
   - Expand `HINDI_KEYWORD_MAP` per `explorer_remediation_devanagari` (include `भूमिकाएं`, `भूमिका`, `सेवाएं`, `उपलब्धियां`, `उपलब्धि`, `रिकॉर्ड`, `खर्च`, `प्रोजेक्ट`, `अकाउंटेंट`, `मोड`, `सुझाव`, `मदद`, `पूछ`, `जाएं`, `अनुभाग`, `स्थित`, `कहाँ`).
   - In `normalizeQuery`, sort `HINDI_KEYWORD_MAP` keys by length descending before replacement.
2. **Entity Extraction**:
   - In `classifyIntent`, test `combinedText = `${lowerRaw} ${normalized}`` with bilingual role/section regexes.
3. **Dialect Parity in `buildIntentText`**:
   - Add authentic Hindi and Hinglish responses for `fallback`, `suggestions`, `ambiguous`, and `client_info`.
4. **Adversarial Bug Fixes**:
   - Add `'react'`, `'tailwind'`, `'python'`, `'vite'`, `'javascript'` to `CANONICAL_VOCABULARY`.
   - Add `'drive'` to `COMMON_ENGLISH_WORDS` and `'liye'` to `HINGLISH_STOPWORDS`.
   - Harden `TECHNICAL_ALIASES[token]` with `Object.prototype.hasOwnProperty.call(TECHNICAL_ALIASES, token) && typeof TECHNICAL_ALIASES[token] === 'string'`.
   - In `INTENT_PATTERNS.filter_toggles`, add Latin Hinglish: `track badal|role badal|track change|role change|track badlo|role badlo`.
   - In `intentPrecedence`, order `availability` before `client_info`.
   - In `scoreItem`, prevent substantive query tokens from matching only generic category tokens (`case`, `study`, `project`).
   - In `queryAssistant`, if search finds a relaxed cross-track match, bypass generic Step 5 response so dynamic relaxation works.
5. **Search Substring Safety**:
   - In `scoreItem`, ensure tokens match as distinct words or boundaries (avoid `cons-ulta-nt` matching `ulta`).
6. **FAQ Intent**:
   - Ensure `matchAuthoritativeFAQ` matches return `intent: 'faq'` (or alias to `faq`).

When done, run `node scripts/test_challenger_adversarial_assistant.mjs` and `npm test`. Write `BRIEFING.md`, `progress.md`, and `handoff.md`, and notify orchestrator via `send_message`.

## 2026-10-23T06:15:08Z
[Message] timestamp=2026-10-23T06:15:08Z sender=d9b94e64-c3ce-47b0-9eeb-923492665270 priority=MESSAGE_PRIORITY_HIGH content=You are worker_engine_r2. Your role is Engine Remediation Specialist.
Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_engine_r2

Read the authoritative requirements at:
c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md
and your dispatch instructions at:
c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_engine_r2\DISPATCH.md
and the explorer handoffs at:
c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_remediation_adversarial\handoff.md
c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_remediation_devanagari\handoff.md
c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_remediation_suite2\handoff.md

Exclusive Write Ownership:
You EXCLUSIVELY own and may ONLY modify:
- src/utils/portfolioAssistantEngine.js
- src/data/faqConfig.js (only for location FAQ alias if needed)

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Apply all drop-in patches:
1. Devanagari Unicode regex boundaries: makeBoundaryRegex with (?<![\p{L}\p{N}\p{M}]) and (?![\p{L}\p{N}\p{M}])/iu.
2. Expand HINDI_KEYWORD_MAP with all missing terms and sort keys descending by length in normalizeQuery.
3. Bilingual entity extraction in classifyIntent.
4. Dialect parity in buildIntentText for fallback, suggestions, ambiguous, client_info.
5. All 5 adversarial fixes: CANONICAL_VOCABULARY additions, COMMON_ENGLISH_WORDS additions, availability precedence, Latin Hinglish track toggles, cross-track dynamic relaxation.
6. Prototype property protection on TECHNICAL_ALIASES[token].
7. Distinct token boundary matching in scoreItem to eliminate substring collisions (e.g. 'ulta' in 'consultant').
8. Map FAQ matches to intent: 'faq'.

Run node scripts/test_challenger_adversarial_assistant.mjs, verify all 5 bug checks pass, create handoff.md, and send a message to orchestrator when finished.
