## 2026-10-23T13:37:48Z
You are the SWE Light orchestrator for this focused, single self-contained fix.

Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\swe_7
Project Root: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio
User Request: Refer to the latest request section in c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md (Timestamp 2026-10-23T13:36:16Z).

Task:
Fix the Hybrid Portfolio Assistant's action execution pipeline and deep data retrieval in `AIChatWidget.jsx` and `portfolioAssistantEngine.js`.

Requirements:
1. R1. Complete Action Dispatcher Fix in `src/components/AIChatWidget.jsx`:
- Fix the `scroll` handler to extract section IDs from `action.target`, `payload.selector`, `payload.target`, `payload.sectionId`, or `action.sectionId`, strip `#` and invoke `handleScrollToSection`.
- Implement missing action handlers:
  - `download-resume`: Dynamically retrieve the current resume path (`resume-accountant.pdf`, `resume-mis.pdf`, etc.) and trigger an authentic download.
  - `open-estimator`: Smoothly scroll to `#contact`, dispatch `portfolio:switch-contact-tab` with `{ tab: 'quote' }`, and dispatch `portfolio:open-estimator`.
  - `switch-role-tab` & `set-role`: Support both action type names and invoke `selectRole`.
  - `open-case-study`: Extract case study ID (`01` through `09`) from `payload.id || action.target || action.payload.target`, dispatch `portfolio:open-case-study`, and auto-minimize the chat widget (`setIsMinimized(true)`).
  - `link`: Robust fallback for `payload.url || action.url || action.target`.

2. R2. Deep Authentic Data Connection in `src/utils/portfolioAssistantEngine.js`:
- Eliminate the static boilerplate short-circuit that ignored indexed search results.
- Implement comprehensive Project Name to ID mapping directly to Case Studies `01` through `09`.
- When users ask about projects, dynamically generate clickable action buttons for relevant Case Studies with direct open buttons.
- Deeply synthesize answers for specific skill queries (e.g. Power BI, Excel VBA, GST, ITR, Tally, Multi-Agent) using real data points, metrics, and tools from `skillsData.js` and `searchCatalog.js`.
- Correct any historical dates in `AIChatWidget.jsx` fallback responses to align with authentic portfolio facts (2018–Present practice, 10+ years career).

Verification:
- Run `npm test` and ensure all 38 test suites pass 100%.
- Run `node scripts/test-portfolio-assistant.js` and ensure all assistant tests pass 100%.
- Run `npm run build` and ensure clean production build with zero errors.

Execute the SWE Light protocol (implementer -> reviewer loop), update your progress.md regularly, and report back when complete.
