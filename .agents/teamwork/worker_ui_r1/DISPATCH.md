# Task Dispatch: worker_ui_r1 (UI/UX & Accessibility Specialist)

## Mission
Upgrade `src/components/AIChatWidget.jsx` with responsive drawer/card states, Dynamic Island aesthetics, active role/audience badges, action triggers, session persistence, and WCAG 2.2 AA accessibility per R2 in ORIGINAL_REQUEST.md.

- **Authoritative Request**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md`
- **Working Directory**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_ui_r1`
- **Survey Specification**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_ui\handoff.md`
- **Orchestrator Project Plan**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\orchestrator\PROJECT.md`

## Exclusive Write Ownership
You EXCLUSIVELY own and may ONLY modify:
- `src/components/AIChatWidget.jsx`
You MUST NOT edit any other project file.

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Technical Specifications & Invariant Checklist
1. **Preserve ALL 22 Literal Test Invariants from `scripts/verify_ai_chat_feature.mjs`**:
   - `fixed bottom-0 z-[55]`
   - `backdrop-blur-md`
   - `shadow-2xl`
   - `rounded-t-2xl rounded-b-none border-t border-x border-b-0`
   - `h-[500px] max-h-[82vh]`
   - `isDrawerOpen ? 'sm:right-[540px]' : 'sm:right-28'`
   - Welcome message: `"Hi! I am Atul's AI Assistant. Ask me anything about his work, skills, or experience."`
   - Original prompt chips:
     - `"Tell me about your experience"`
     - `"Which projects use React & Tailwind?"`
     - `"Can I see your resume?"`
     - `"How can I contact you?"`
   - Header text: `"AI Assistant"` or `"Atul's AI Assistant"`
2. **Context Synchronization**:
   - Import and bind `useRole()` and `useAudience()` (with safe optional chaining / try-catch fallbacks).
   - Display active role capsule (with accent color) and active audience pill in the Dynamic Island header.
3. **Engine Integration**:
   - Import `{ queryAssistant, getInitialSuggestions, clearSessionMemory }` from `../utils/portfolioAssistantEngine.js`.
   - Pass user queries to `queryAssistant(query, { role: activeRole, audience })`.
   - Dynamic prompt chips: display initial suggestions tailored to role/audience when chat is clean, and display returned `chips` after each assistant response.
4. **Direct Action Triggers**:
   - Render interactive action buttons when `message.actions` are present:
     - `open-case-study`: dispatches `window.dispatchEvent(new CustomEvent('portfolio:open-case-study', { detail: { id: payload.id } }))`.
     - `switch-contact-tab`: dispatches `window.dispatchEvent(new CustomEvent('portfolio:switch-contact-tab', { detail: { tab: payload.tab || 'quote' } }))`.
     - `scroll`: smooth scroll to section `#` with programmatic `.focus({ preventScroll: true })`.
     - `link`: safe external link opening (`rel="noopener noreferrer"`).
   - Action buttons MUST NOT close the chat assistant.
5. **Session-Scoped Persistence & 1-Click Reset**:
   - Store conversation in `window.sessionStorage` backed by module memory cache.
   - Provide an instant "Clear Chat" button (`RotateCcw` icon) that clears storage, invokes `clearSessionMemory()`, resets to initial greeting, and triggers an audio haptic & screen reader announcement.
6. **WCAG 2.2 AA Accessibility**:
   - Polite ARIA live regions for assistant replies (`aria-live="polite"`).
   - Escape key dismisses or minimizes the chat and restores previous focus.
   - Visible focus rings with outline and offset (`focus-visible:ring-2 focus-visible:ring-cyan-400`).
   - Roving tabindex for prompt chips (`ArrowLeft`, `ArrowRight`, `Home`, `End`).
   - Touch targets for all interactive controls (minimize, close, send, chips, action buttons) strictly >= 44px.
   - Respect `prefers-reduced-motion`.

When done, run `node scripts/verify_ai_chat_feature.mjs`, write `BRIEFING.md`, `progress.md`, and `handoff.md` in your working directory, and notify orchestrator via `send_message`.
