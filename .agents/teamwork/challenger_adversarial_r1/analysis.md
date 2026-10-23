# Adversarial Stress Test Analysis: portfolioAssistantEngine.js

**Date**: 2026-10-23T05:45:00Z  
**Agent**: `challenger_adversarial_r1` (Adversarial Robustness Challenger)  
**Target Module**: `src/utils/portfolioAssistantEngine.js`  
**Execution Harness**: `scripts/test_challenger_adversarial_assistant.mjs`

---

## 1. Executive Summary & Verdict

- **Overall Robustness Invariant Pass Rate**: 75 / 75 (100%)
- **Unhandled Exceptions**: 0
- **Undefined Response Fields**: 0
- **Buffer / ReDoS Execution Stability**: Clean (10,000 chars processed in < 3ms)
- **High-Frequency Concurrency Throughput**: 1,000 queries in 362.16 ms (0.362 ms/query avg)
- **Injection Safety (SQLi / XSS / HTML)**: Clean (no evaluation, safe text outputs)
- **Confirmed Functional Defects Discovered**: 5 Definite Behavioral Failures
- **Empirical Verdict**: **REJECT** (Requires narrow targeted fixes in `portfolioAssistantEngine.js`)

---

## 2. Invariant & Stress Test Results

| Test Category | Vectors Tested | Passed | Exceptions | Performance / Latency |
|---|---|---|---|---|
| **Falsy & Type Inversions** | `null`, `undefined`, `""`, whitespace, `0`, `-999`, `NaN`, `Infinity`, `true`, `false`, `{}`, `[]`, functions, malformed contexts | 26 / 26 | 0 | < 0.1 ms |
| **Buffer Flooding & ReDoS** | 1,000 chars, 2,500 words, 5,000 random noise, 10,000 symbols, 2,000 char prefix/suffix | 6 / 6 | 0 | 0.8 ms – 2.1 ms |
| **Injection Payloads** | SQLi (`' OR '1'='1`, `DROP TABLE`), XSS (`<script>`, `<img onerror>`, `<svg/onload>`), HTML (`<iframe>`), `${env}` | 12 / 12 | 0 | < 0.2 ms |
| **Unicode & Special Symbols** | Emoji clusters, mixed emojis, math symbols (`∑∏√`), Devanagari conjuncts, RTL overrides, zero-width chars, Zalgo | 9 / 9 | 0 | < 0.2 ms |
| **High-Frequency Burst** | 1,000 randomized queries across 5 roles and 4 audiences | 1,000 / 1,000 | 0 | 362.16 ms total (0.362 ms/query) |
| **State Memory Isolation** | `clearSessionMemory()` across Node and Browser mock environments | 2 / 2 | 0 | < 0.1 ms |

---

## 3. Discovered Defects & Failure Mode Details

### Defect 1: Missing "react" and "tailwind" in `CANONICAL_VOCABULARY` [ADV-BUG-01]
- **Severity**: High
- **Observation**:
  ```bash
  $ node -e "import('./src/utils/portfolioAssistantEngine.js').then(m => { console.log(m.normalizeQuery('recat frontend')); console.log(m.normalizeQuery('tialwind styling')); })"
  { normalized: 'recat frontend', ... }
  { normalized: 'tialwind styling', ... }
  ```
- **Root Cause**: `src/utils/portfolioAssistantEngine.js` line 173 lists `CANONICAL_VOCABULARY`, but omits `'react'`, `'tailwind'`, `'python'`, `'vite'`, and `'javascript'`. As a result, `repairTypo()` skips these words and fails to correct the exact typos mandated in DISPATCH (`recat` and `tialwind`).
- **Mitigation**: Add `'react'`, `'tailwind'`, `'python'`, `'vite'`, `'javascript'` to `CANONICAL_VOCABULARY`.

---

### Defect 2: Aggressive Levenshtein Collision: English Word "drive" Mutates to "price" [ADV-BUG-02]
- **Severity**: High
- **Observation**:
  ```bash
  $ node -e "import('./src/utils/portfolioAssistantEngine.js').then(m => console.log(m.queryAssistant('quantum warp drive antimatter')))"
  { intent: 'services', confidence: 0.85, ... }
  ```
- **Root Cause**: In `src/utils/portfolioAssistantEngine.js`:
  1. `COMMON_ENGLISH_WORDS` (line 316) does not contain `'drive'`.
  2. `CANONICAL_VOCABULARY` contains `'price'`.
  3. `levenshteinDistance('drive', 'price')` is exactly 2.
  4. `repairTypo('drive')` mutates `'drive'` to `'price'`.
  5. Line 516: `if (tokens.some(t => ['price', ...].includes(t)))` triggers `services` intent with 0.85 confidence.
- **Impact**: Any normal sentence containing "drive" (e.g., "Google Drive integration", "what drives your work", "pen drive backup") gets mutated into "price" and returns commercial fee quotations!
- **Mitigation**: Add `'drive'` to `COMMON_ENGLISH_WORDS` on line 316.

---

### Defect 3: Intent Classification Precedence Inversion (`client_info` Masks `availability`) [ADV-BUG-03]
- **Severity**: Medium
- **Observation**:
  ```bash
  $ node -e "import('./src/utils/portfolioAssistantEngine.js').then(m => console.log(m.queryAssistant('kya freelance project ke liye available ho abhi turant?').intent))"
  'client_info' # Expected: 'availability'
  ```
- **Root Cause**: In `src/utils/portfolioAssistantEngine.js` line 488 (`intentPrecedence`), `'client_info'` is ordered before `'availability'`. `INTENT_PATTERNS.client_info` matches `\bfreelance\b`. Even though the user asks "available ho abhi turant", `client_info` triggers first.
- **Mitigation**: Check `'availability'` before `'client_info'` in `intentPrecedence`, or refine `client_info` pattern so that "freelance available" / "available" takes precedence.

---

### Defect 4: Hinglish Slang Track Switch Missing in `filter_toggles` [ADV-BUG-04]
- **Severity**: Medium
- **Observation**:
  ```bash
  $ node -e "import('./src/utils/portfolioAssistantEngine.js').then(m => console.log(m.queryAssistant('track badal ke accountant bana do').intent))"
  'services' # Expected: 'filter_toggles'
  ```
- **Root Cause**: `INTENT_PATTERNS.filter_toggles` (line 419) includes `switch role`, `change track`, `मोड बदलो`, `ट्रैक बदलो`, but misses Latin-script Hinglish phrases like `track badal`, `role badal`, and `track change`.
- **Mitigation**: Add `\b(track badal|role badal|track change|badal do|badlo)\b` to `INTENT_PATTERNS.filter_toggles`.

---

### Defect 5: Generic Intent Interception Suppresses Phase 2 Dynamic Relaxation [ADV-BUG-05]
- **Severity**: High
- **Observation**:
  - `queryAssistant('Next.js prototype', { role: 'accountant' })` -> `isRelaxed: true` (Phase 2 relaxation triggers because `classifyIntent` returned `fallback`).
  - `queryAssistant('Next.js prototype case study', { role: 'accountant' })` -> `isRelaxed: false` (Because `'case study'` triggers `projects` intent with 0.90 confidence, bypassing search relaxation and returning accountant projects!).
- **Root Cause**: On line 1381 of `src/utils/portfolioAssistantEngine.js`:
  ```javascript
  if (confidence >= 0.75 && intent !== 'fallback') {
    const text = buildIntentText(intent, entities, safeContext, lang, [], safeQuery);
    ...
    return { ..., isRelaxed: false };
  }
  ```
  If a query contains a cross-track project name (like "Next.js prototype") together with a generic intent word ("case study" or "project"), `classifyIntent` assigns it to `projects` without checking if the specific project exists in the active role, suppressing the dynamic relaxation search entirely.
- **Mitigation**: When `intent === 'projects'` or `intent === 'skills'`, check whether the query matches a cross-track entity before early-exiting, or allow search index relaxation when entity/query keywords conflict with the active role.
