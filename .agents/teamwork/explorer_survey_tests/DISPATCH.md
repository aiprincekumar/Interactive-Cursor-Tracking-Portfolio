# Task Dispatch: Survey Explorer — Test Suite & Verification Baseline

## 2026-10-23T05:00:31Z
You are explorer_survey_tests. Your role is Test Survey Explorer.
Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_tests

Read the authoritative requirements at:
c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md
and your dispatch instructions at:
c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_tests\DISPATCH.md

Your task is to survey existing test suites (38 suites), test infrastructure, package.json test scripts, bundle size baseline, and design the acceptance verification harness (scripts/test-portfolio-assistant.js).
You are read-only: do NOT modify any source code files. Write only to your working directory.
Create BRIEFING.md and progress.md immediately, then produce a comprehensive handoff.md detailing:
1. Existing test runner command and exact passing suite/test counts.
2. Build command and bundle size baseline.
3. Detailed test plan for scripts/test-portfolio-assistant.js covering:
   - 16 core intents across English, Hindi, Hinglish.
   - Synonym expansion and typo handling.
   - Weighted search scoring.
   - Audience and role filtering + relaxation.
   - Action buttons and event payload verification.
   - Link integrity against GitHub Pages subpath (/Interactive-Cursor-Tracking-Portfolio/).
   - 100% offline safety and zero external network calls.
4. Verification thresholds (< 25 kB bundle increase, zero regressions).
When finished, send a message to parent with your handoff summary.
