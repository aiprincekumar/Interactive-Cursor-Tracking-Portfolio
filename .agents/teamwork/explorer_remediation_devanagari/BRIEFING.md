# BRIEFING — 2026-10-23T06:13:00Z

## Mission
Analyze and recommend concrete fix strategies for Devanagari regex boundaries (\b failure), missing Hindi keywords, and Hindi fallback dialect parity in portfolioAssistantEngine.js.

## 🔒 My Identity
- Archetype: explorer
- Roles: Devanagari & Dialect Remediation Explorer, Synthesizer
- Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_remediation_devanagari
- Original parent: d9b94e64-c3ce-47b0-9eeb-923492665270
- Milestone: Remediation Planning - Devanagari & Hindi Parity

## 🔒 Key Constraints
- Read-only investigation — do NOT implement directly in project source
- Do NOT modify project source files directly
- Deliver structured findings and concrete fix recommendations in handoff.md

## Current Parent
- Conversation ID: d9b94e64-c3ce-47b0-9eeb-923492665270
- Updated: not yet

## Investigation State
- **Explored paths**:
  - `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md`
  - `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\reviewer_functional_r1\handoff.md`
  - `src/utils/portfolioAssistantEngine.js` (lines 130-1480: normalization, regex patterns, intent classification, search scoring, response synthesis)
  - `src/data/faqConfig.js` (FAQ items and location gap)
  - `scripts/test-portfolio-assistant.js` (48-test intent matrix)
- **Key findings**:
  1. `\b` is strictly ASCII `[A-Za-z0-9_]`. In Devanagari, all characters are `\W`, so `\b` fails on all Hindi words unless pre-normalized to ASCII.
  2. Standard Unicode word boundary must include combining marks: `(?<![\p{L}\p{N}\p{M}])(?:...)(?![\p{L}\p{N}\p{M}])/iu`. Omitting `\p{M}` results in false positive suffix matches on matras (e.g. `काम` matching `कामी`).
  3. `HINDI_KEYWORD_MAP` was missing 40+ core conversational and technical terms, and `normalizeQuery` did not sort replacement keys by length descending, risking prefix truncation.
  4. Entity extraction (`entities.role`, `entities.section`) tested only `lowerRaw` with ASCII `\b`, causing Hindi queries like `अकाउंटेंट मोड चालू करें` to lose entity metadata.
  5. `buildIntentText` completely lacked Hindi and Hinglish cases for `fallback`, `suggestions`, and `ambiguous`, resulting in English copy returned to Hindi users.
  6. `Where are you located in India?` / `आप भारत में कहाँ स्थित हैं?` failed FAQ matching because no dedicated location question exists in `FAQ_ITEMS`.
  7. Gibberish queries like `kuch bhi ulta seedha` matched in search due to unstemmed stopword hits in Hindi descriptions (`score > 15`).
- **Unexplored areas**: None within the Devanagari and dialect remediation boundary.

## Key Decisions Made
- Formulate concrete code replacement snippets and a drop-in architectural patch in `handoff.md`.
- Propose `(?<![\p{L}\p{N}\p{M}])` boundary pattern for unified ASCII/Devanagari matching.
- Provide comprehensive `HINDI_KEYWORD_MAP` (70+ terms) sorted by length descending.
- Provide authentic Hindi and Hinglish copies for `fallback`, `suggestions`, `ambiguous`, and `client_info`.

## Artifact Index
- DISPATCH.md — Task dispatch instructions
- BRIEFING.md — Situational awareness
- progress.md — Liveness heartbeat
- handoff.md — Comprehensive 5-component remediation report
