# Task Dispatch: worker_qa_r2 (Test Rigor & Verification Specialist)

## Mission
Harden Suite 2 in `scripts/test-portfolio-assistant.js` with strict `assert.strictEqual(res.intent, tc.intent)` for all 48 matrix test cases and run full verification per ORIGINAL_REQUEST.md.

- **Authoritative Request**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md`
- **Working Directory**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_qa_r2`
- **Key Explorer Handoff to Read**:
  - `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_remediation_suite2\handoff.md`

## Exclusive Write Ownership
You EXCLUSIVELY own and may ONLY modify:
- `scripts/test-portfolio-assistant.js`
You MUST NOT edit any other project file.

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Detailed Instructions
1. Update Suite 2 in `scripts/test-portfolio-assistant.js` (lines 197–215):
   - Add explicit check: `assert.strictEqual(res.intent, tc.intent, `Expected intent '${tc.intent}' for query: "${tc.q}", got: '${res.intent}'`);`
2. Run `node scripts/test-portfolio-assistant.js` and ensure all 99+ tests pass 100%.
3. Run `npm test` and ensure all 38 test suites pass.
4. Run `npm run lint` and `npm run build`.

When done, write `BRIEFING.md`, `progress.md`, and `handoff.md`, and notify orchestrator via `send_message`.

## 2026-10-23T06:15:08Z
[Message] timestamp=2026-10-23T06:15:08Z sender=d9b94e64-c3ce-47b0-9eeb-923492665270 priority=MESSAGE_PRIORITY_HIGH content=You are worker_qa_r2. Your role is Test Rigor & Verification Specialist.
Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_qa_r2

Read the authoritative requirements at:
c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md
and your dispatch instructions at:
c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_qa_r2\DISPATCH.md
and the explorer handoff at:
c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_remediation_suite2\handoff.md

Exclusive Write Ownership:
You EXCLUSIVELY own and may ONLY modify:
- scripts/test-portfolio-assistant.js

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Key Requirements:
1. Harden Suite 2 in scripts/test-portfolio-assistant.js: add strict assert.strictEqual(res.intent, tc.intent) for all 48 matrix test cases.
2. Run node scripts/test-portfolio-assistant.js.
3. Run npm test, npm run lint, npm run build.
4. Document all results, create handoff.md, and send a message to orchestrator when finished.
