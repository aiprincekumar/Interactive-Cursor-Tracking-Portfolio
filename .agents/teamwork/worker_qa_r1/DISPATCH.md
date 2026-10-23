# Task Dispatch: worker_qa_r1 (Test Suite & Verification Engineer)

## Mission
Create the comprehensive acceptance verification test harness (`scripts/test-portfolio-assistant.js`), integrate it into `package.json`, and verify that all test suites pass with zero regressions and bundle size increase < 25 kB per ORIGINAL_REQUEST.md.

- **Authoritative Request**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md`
- **Working Directory**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_qa_r1`
- **Survey Specification**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_tests\handoff.md`
- **Orchestrator Project Plan**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\orchestrator\PROJECT.md`

## Exclusive Write Ownership
You EXCLUSIVELY own and may ONLY modify/create:
- `scripts/test-portfolio-assistant.js`
- `package.json`
You MUST NOT edit any other project file.

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Technical Specifications for `scripts/test-portfolio-assistant.js`
Implement 10 comprehensive verification test suites:
1. **Suite 1: Architecture & Zero-Network Safety**:
   - Inspect `portfolioAssistantEngine.js` exports: `queryAssistant`, `getInitialSuggestions`, `clearSessionMemory`, `detectLanguage`.
   - Verify zero external HTTP/network/fetch/axios/ML calls.
2. **Suite 2: 16 Core Intents Matrix**:
   - Test each of the 16 core intents across English, Hindi, and Hinglish queries (>= 48 test assertions).
3. **Suite 3: Synonym Expansion & Typo Normalization**:
   - Test technical aliases (`brs`, `itc`, `gstr`, `tally`), bilingual terms, and Levenshtein distance <= 2 typo repair.
4. **Suite 4: Weighted Search Index Scoring**:
   - Test that title matches (+60) rank higher than tag (+40), category (+25), and description (+10).
5. **Suite 5: Role & Audience Filtering + Dynamic Relaxation**:
   - Test recruiter mode prioritization (resume, experience, skills).
   - Test client mode prioritization (quotation, pricing, case studies).
   - Test dynamic 4-phase relaxation when a role/audience query yields 0 results (`isRelaxed: true`).
6. **Suite 6: Action Button Generation & Event Payloads**:
   - Verify action triggers for `open-case-study` ('01'-'09'), `switch-contact-tab` ('quote'), and section scroll.
7. **Suite 7: Subpath Link Integrity**:
   - Verify that all generated URLs and file links validate against GitHub Pages base path (`/Interactive-Cursor-Tracking-Portfolio/`).
8. **Suite 8: 100% Offline Safety Guard**:
   - Runtime interception ensuring no network socket/fetch calls occur during queries.
9. **Suite 9: Session Storage & Memory Reset**:
   - Verify state isolation and `clearSessionMemory()` reset behavior.
10. **Suite 10: Bundle Budget & Zero Regressions Gate**:
    - Verify that `npm test` runs all test suites with 100% pass rate.
    - Verify that `npm run build` succeeds and JavaScript bundle size increase is strictly < 25 kB.

When done, execute `node scripts/test-portfolio-assistant.js`, `npm test`, `npm run lint`, and `npm run build`, document exact command outputs in `handoff.md`, and notify orchestrator via `send_message`.

## 2026-10-23T05:13:37Z
You are worker_qa_r1. Your role is Test Suite & Verification Engineer.
Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_qa_r1

Read the authoritative requirements at:
c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md
and your dispatch instructions at:
c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_qa_r1\DISPATCH.md
and the survey specification at:
c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_tests\handoff.md
and the orchestrator project plan at:
c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\orchestrator\PROJECT.md

Exclusive Write Ownership:
You EXCLUSIVELY own and may ONLY modify/create:
- scripts/test-portfolio-assistant.js
- package.json (to add test script to test runner)
You MUST NOT edit any other project file.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Key Requirements:
1. Implement the 10-suite acceptance test harness in scripts/test-portfolio-assistant.js per explorer_survey_tests handoff:
   - Suite 1: Architecture & Zero-Network Safety
   - Suite 2: 16 Core Intents Matrix (English, Hindi, Hinglish — >= 48 tests)
   - Suite 3: Synonym Expansion & Typo Normalization (Levenshtein <= 2)
   - Suite 4: Weighted Search Index Scoring (Title +60 > Tags +40 > Category +25 > Body +10)
   - Suite 5: Role & Audience Filtering + Dynamic Relaxation
   - Suite 6: Action Button Generation & Event Payloads ('portfolio:open-case-study', 'portfolio:switch-contact-tab')
   - Suite 7: Subpath Link Integrity (/Interactive-Cursor-Tracking-Portfolio/)
   - Suite 8: 100% Offline Safety Guard
   - Suite 9: Session Storage & Memory Reset
   - Suite 10: Production Bundle Budget (< 25 kB) & Zero Regressions Gate
2. Add "test:portfolio-assistant": "node scripts/test-portfolio-assistant.js" to package.json and chain it into "test".
3. Run the test suite: node scripts/test-portfolio-assistant.js and npm test.
4. Verify npm run lint and npm run build. Confirm bundle size increase < 25 kB.

Create BRIEFING.md and progress.md, author the test suite, run the verifications, create handoff.md, and send a message to orchestrator when finished.
