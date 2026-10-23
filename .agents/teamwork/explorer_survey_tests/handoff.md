# Comprehensive Test Survey & Acceptance Verification Baseline Report

**Agent**: `explorer_survey_tests`  
**Role**: Test Survey Explorer  
**Date**: 2026-10-23  
**Integrity Mode**: Development / Read-Only Survey  

---

## 1. Observation

### 1.1 Existing Test Infrastructure & `npm test` Analysis
- **File**: `package.json` lines 14, 19–40
  ```json
  "scripts": {
    "test": "node scripts/verify_marquee.mjs && node scripts/verify_layout_density.mjs && node scripts/test_layout_density_adversarial.mjs && node scripts/verify_dynamic_avatar.cjs && node scripts/verify_avatar_role_switcher.mjs && node scripts/test_avatar_role_switcher_adversarial.mjs && node scripts/test_reviewer3_final_hardening.mjs && node scripts/verify_vibe_coder_integration.mjs && node scripts/test_multi_role_resume.mjs && node scripts/verify_map_hybrid_system.mjs && node scripts/verify_contact_form.mjs && node scripts/verify_leaflet_map.mjs && node scripts/verify_section_headers.mjs && node scripts/verify_simple_mode.mjs && node scripts/verify_social_proof.mjs && node scripts/verify_accessibility.mjs && node scripts/test_challenger_a11y_stress.mjs && node scripts/verify_voice_announcement.mjs && node scripts/verify_dynamic_testimonials.mjs && node scripts/verify_terminal_cli.mjs && node scripts/test_terminal_cli_adversarial.mjs && node scripts/verify_case_studies.mjs && node scripts/verify_fresh_features.mjs && node scripts/verify_floating_action_hub.mjs && node scripts/verify_view_mode.mjs && node scripts/verify_ai_chat_feature.mjs && node scripts/verify_faq_section.mjs && node scripts/verify_polaroid_jszip_dynamic.mjs && node scripts/verify_gis_lazy_load.mjs && node scripts/verify_hero_poses_progressive_loading.mjs && node scripts/test_sound_toggle_role_context.mjs && node scripts/test_marquee_render_optimization.mjs && node scripts/test_hero_viewport_culling.mjs && node scripts/verify_navbar_icons_styling.mjs && node scripts/verify_navbar_cursor_scrollspy_tooltips.mjs && node scripts/verify_scroll_restore_and_navbar_exclusivity.mjs && node scripts/verify_navbar_instant_selection_lock.mjs"
  }
  ```
- **Execution Command**: `npm test`
- **Runner Nature**: Pure Node.js ESM/CJS verification runners (`node <script_path>`). There is no Jest, Vitest, Cypress, or Playwright installed in `dependencies` or `devDependencies`.
- **Suite Count**: Exactly **37 test suites / verification scripts** chained with `&&` in `package.json`.
- **Execution Output & Pass Counts**:
  - `npm test` execution returned exit code `0`.
  - Every single one of the 37 test suites passed cleanly with 0 failures.
  - Across the 37 suites, there are over **806 individual assertion checks and empirical tests**.
  - Detailed suite breakdown:
    1. `scripts/verify_marquee.mjs`: 54 passing checks
    2. `scripts/verify_layout_density.mjs`: 14 passing checks
    3. `scripts/test_layout_density_adversarial.mjs`: 10 passing checks
    4. `scripts/verify_dynamic_avatar.cjs`: 7 passing checks
    5. `scripts/verify_avatar_role_switcher.mjs`: 8 passing checks
    6. `scripts/test_avatar_role_switcher_adversarial.mjs`: 22 passing checks
    7. `scripts/test_reviewer3_final_hardening.mjs`: 26 passing checks
    8. `scripts/verify_vibe_coder_integration.mjs`: 12 passing checks
    9. `scripts/test_multi_role_resume.mjs`: 74 passing checks
    10. `scripts/verify_map_hybrid_system.mjs`: 47 tests passed
    11. `scripts/verify_contact_form.mjs`: 1 suite passed (29 asserts)
    12. `scripts/verify_leaflet_map.mjs`: 3 passing checks
    13. `scripts/verify_section_headers.mjs`: 96 passing checks
    14. `scripts/verify_simple_mode.mjs`: 48 passing checks
    15. `scripts/verify_social_proof.mjs`: 44 passing checks
    16. `scripts/verify_accessibility.mjs`: 64 passing checks
    17. `scripts/test_challenger_a11y_stress.mjs`: 25 passing checks (112 asserts)
    18. `scripts/verify_voice_announcement.mjs`: 5 passing checks
    19. `scripts/verify_dynamic_testimonials.mjs`: 19 passing checks
    20. `scripts/verify_terminal_cli.mjs`: 1 suite passed (55 asserts)
    21. `scripts/test_terminal_cli_adversarial.mjs`: 6 tests passed (127 asserts)
    22. `scripts/verify_case_studies.mjs`: 1 suite passed (67 asserts)
    23. `scripts/verify_fresh_features.mjs`: 118 passing checks
    24. `scripts/verify_floating_action_hub.mjs`: 25 passing checks
    25. `scripts/verify_view_mode.mjs`: 16 passing checks
    26. `scripts/verify_ai_chat_feature.mjs`: 9 passing checks
    27. `scripts/verify_faq_section.mjs`: 14 passing checks
    28. `scripts/verify_polaroid_jszip_dynamic.mjs`: 1 suite passed
    29. `scripts/verify_gis_lazy_load.mjs`: 2 passing checks
    30. `scripts/verify_hero_poses_progressive_loading.mjs`: 36 passing checks
    31. `scripts/test_sound_toggle_role_context.mjs`: 6 passing checks
    32. `scripts/test_marquee_render_optimization.mjs`: 5 passing checks
    33. `scripts/test_hero_viewport_culling.mjs`: 7 passing checks
    34. `scripts/verify_navbar_icons_styling.mjs`: 5 passing checks
    35: `scripts/verify_navbar_cursor_scrollspy_tooltips.mjs`: 4 passing checks
    36. `scripts/verify_scroll_restore_and_navbar_exclusivity.mjs`: 14 passing checks
    37. `scripts/verify_navbar_instant_selection_lock.mjs`: 12 passing checks
  - Chaining `scripts/test-portfolio-assistant.js` as the final script in `npm test` will form the **38th test suite**.

### 1.2 Build System & Bundle Size Baseline
- **Build Command**: `npm run build`
  - Step 1: `prebuild` -> `node scripts/generate_resume.js` (generates 5 role PDF resumes into `public/`)
  - Step 2: `vite build` (Vite v8.3.4, `@tailwindcss/vite` v4.3.3, `@vitejs/plugin-react` v6.1.1)
  - Base URL configuration in `vite.config.js`: `base: '/Interactive-Cursor-Tracking-Portfolio/'`
- **Output Directory**: `dist/`
- **Exact Production Size Metrics (Measured 2026-10-23)**:
  - **Total `dist/assets` Size**: **2,265.91 kB** uncompressed | **549.11 kB** gzip
  - **Total JavaScript Chunks**: **1,998.15 kB** uncompressed | **509.03 kB** gzip
  - **Total CSS Chunks**: **267.75 kB** uncompressed | **40.09 kB** gzip
  - `dist/index.html`: 3.53 kB uncompressed | 1.24 kB gzip
- **Current `AIChatWidget` Code-Split Chunk**:
  - `dist/assets/AIChatWidget-CGfDdn2t.js`: **12.20 kB** uncompressed (12,492 bytes) | **4.22 kB** gzip
  - Code-splitting mechanism: In `src/App.jsx` line 35: `const AIChatWidget = lazyWithRetry(() => import('./components/AIChatWidget'), 'AIChatWidget');`
- **Bundle Increase Threshold Constraint**:
  - ORIGINAL_REQUEST.md requirement: **Total bundle increase < 25 kB** (25,600 bytes).
  - Upper limit for total JS assets post-assistant implementation: **<= 2,023.15 kB** uncompressed.
  - Upper limit for total production assets post-assistant implementation: **<= 2,290.91 kB** uncompressed.
  - Target size for updated `AIChatWidget` + Assistant Engine chunk: **<= 37.20 kB** uncompressed.

### 1.3 Existing Component Contracts & Events
- **Custom Event Handlers Observed**:
  - `portfolio:open-case-study`:
    - Receiver: `src/App.jsx` line 128: `const id = e?.detail?.id || e?.detail || '01'; handleOpenCaseStudy(id);`
    - Valid case study IDs in `src/data/caseStudiesData.js`: `'01'`, `'02'`, `'03'`, `'04'`, `'05'`, `'06'`, `'07'`, `'08'`, `'09'`.
  - `portfolio:switch-contact-tab`:
    - Receiver: `src/components/ContactSection.jsx` lines 444–449: `validTabs = ['touch', 'quote', 'direct', 'location']; if (validTabs.includes(e.detail?.tab)) setActiveTab(e.detail.tab);`
    - Also supported: `portfolio:open-estimator` which directly activates `quote` tab.
  - Navigation Hash Targets:
    - DOM Section IDs observed in `src/App.jsx`: `#about`, `#skills`, `#experience`, `#projects`, `#achievements`, `#social-proof`, `#testimonials`, `#gallery`, `#playground`, `#faq`, `#contact`.
- **Existing Strings in `scripts/verify_ai_chat_feature.mjs`**:
  - Lines 63–69:
    ```javascript
    test('AIChatWidget displays welcome message and 4 suggested prompt chips', () => {
      assert(widgetContent.includes("Hi there! 👋 I am Atul's AI Assistant preview"), 'Must include welcome message');
      assert(widgetContent.includes('🚀 Featured Projects'), 'Must include Projects chip');
      assert(widgetContent.includes('💻 Core Tech Stack'), 'Must include Tech Stack chip');
      assert(widgetContent.includes('💼 Experience Summary'), 'Must include Experience chip');
      assert(widgetContent.includes('📬 How to Contact'), 'Must include Contact chip');
    });
    ```
  - Lines 78–79:
    ```javascript
    test('App.jsx mounts AIChatWidget alongside global floating components', () => {
      assert(appContent.includes("import AIChatWidget from './components/AIChatWidget';"), 'Imports AIChatWidget');
      assert(appContent.includes('<AIChatWidget />'), 'Renders <AIChatWidget />');
    });
    ```

---

## 2. Logic Chain

1. **Step 1 — Test Runner Standardization**:
   - *Observation*: All tests in the repository use native Node.js scripts executed sequentially with `&&` in `npm test`. No external test framework is present.
   - *Inference*: `scripts/test-portfolio-assistant.js` must be implemented as a zero-dependency, self-contained Node.js ESM script (`"type": "module"` in `package.json`) utilizing native `assert`, `fs`, `path`, and pure algorithmic execution.
   - *Inference*: To preserve full CI/CD test automation, `scripts/test-portfolio-assistant.js` must be appended to `package.json`'s `scripts.test` command as the 38th verification suite.

2. **Step 2 — Code-Splitting & Bundle Budget Isolation**:
   - *Observation*: `AIChatWidget` is code-split in `App.jsx` via `lazyWithRetry`. Its baseline chunk is 12.20 kB. Total JS baseline is 1998.15 kB.
   - *Inference*: If all assistant knowledge, search indices, and regex dictionaries are imported only inside `AIChatWidget.jsx` (or a helper utility imported exclusively by it), Vite will naturally bundle them into the lazy chunk or a dedicated split chunk.
   - *Inference*: With a 25 kB budget, the new code (Layers A–H + UI upgrades) can consume up to 25,600 bytes uncompressed. Because a rule-based engine and concise JSON index can easily be authored in under 18–20 kB, the 25 kB ceiling is achievable provided no external heavy libraries (such as lunr, fuse.js, or mini-search) are added to `package.json`.

3. **Step 3 — Offline Integrity & Subpath Link Safety**:
   - *Observation*: The project is hosted on GitHub Pages under `/Interactive-Cursor-Tracking-Portfolio/`. Any route or PDF link lacking this base or using leading root slashes (`/resume.pdf`) fails in production.
   - *Inference*: The test harness must assert that every link generated by the assistant is either properly prepended with `/Interactive-Cursor-Tracking-Portfolio/` or structured as a safe hash `#section` or relative path, and that referenced files actually exist in `public/`.
   - *Observation*: The portfolio operates under 100% offline safety with zero external network calls.
   - *Inference*: The acceptance harness must mock/spy on `global.fetch`, `http.request`, and `https.request` to mathematically guarantee zero network egress.

4. **Step 4 — 16 Core Intents & Multilingual Matrix**:
   - *Observation*: Users may query in English, Hindi (Devanagari), or Hinglish (Latin transliteration).
   - *Inference*: The test harness must test each of the 16 intents across all three dialect modalities (minimum 48 explicit test cases).

5. **Step 5 — Action Button & Event Payloads**:
   - *Observation*: The existing application components respond to specific custom event names and payloads (`portfolio:open-case-study` with `{ id }`, `portfolio:switch-contact-tab` with `{ tab }`).
   - *Inference*: The test harness must validate that action buttons generated by the assistant match these exact payloads, preventing runtime event decoupling.

---

## 3. Comprehensive Test Plan for `scripts/test-portfolio-assistant.js`

The acceptance verification harness `scripts/test-portfolio-assistant.js` is structured into **10 distinct test suites**:

```
========================================================================================
  PORTFOLIO ASSISTANT ACCEPTANCE HARNESS (scripts/test-portfolio-assistant.js)
========================================================================================
  Suite 1: Static Architecture, Contract Signatures & Zero-Network Safety
  Suite 2: 16 Core Intents Recognition Matrix (English, Hindi, Hinglish)
  Suite 3: Synonym Expansion, Technical Aliases & Typo Normalization
  Suite 4: Weighted Search Index Scoring & Ranking Algorithm
  Suite 5: Multi-Role & Audience Filtering with Dynamic Relaxation Protocol
  Suite 6: Action Button Generation & Custom Window Event Payloads
  Suite 7: Subpath Link Integrity & Public Asset Verification
  Suite 8: 100% Offline Safety & Zero External Network Egress Interception
  Suite 9: Session Storage State Management, Truncation & Memory Cache
  Suite 10: Production Bundle Budget & Zero Regressions Gate
========================================================================================
```

### Suite 1: Static Architecture, Contract Signatures & Zero-Network Safety
- **Target Files**:
  - `src/utils/portfolioAssistant.js` (or `src/data/portfolioAssistantData.js`)
  - `src/components/AIChatWidget.jsx`
- **Verification Assertions**:
  1. `portfolioAssistant.js` exists and exports:
     - `classifyIntent(query, context)`
     - `expandSynonyms(tokens)`
     - `searchPortfolio(query, options)`
     - `generateAssistantResponse(query, context)`
     - `resetConversation()`
     - `INTENTS`, `CATALOG_ITEMS`, `SYNONYMS`
  2. `portfolioAssistant.js` source inspection:
     - Assert zero references to external AI SDKs (`openai`, `@google/generative-ai`, `@anthropic-ai`, `huggingface`, `transformers`).
     - Assert zero external API hostnames (`api.openai.com`, `googleapis.com`, `anthropic.com`).
     - Assert zero runtime `fetch(` calls directed at external URLs.

### Suite 2: 16 Core Intents Recognition Matrix (English, Hindi, Hinglish)
48 verified test cases across all 16 intents:

| Intent ID | English Query | Hindi Query (Devanagari) | Hinglish Query (Latin Script) | Expected Action / Event Trigger |
|---|---|---|---|---|
| `roles` | "What are your core professional roles?" | "अतुल की भूमिकाएं क्या हैं?" | "Atul ke kya roles hain? Kaam kya karta hai?" | Role overview + navigation |
| `projects` | "Show me your flagship projects" | "प्रमुख प्रोजेक्ट्स दिखाएं" | "Featured projects dikhao / Kaunse projects hain?" | Case study cards + action |
| `skills` | "What is your core tech stack?" | "तकनीकी कौशल क्या हैं?" | "Tech stack kya hai? React aata hai?" | Skills badges + #skills |
| `experience` | "How many years of experience do you have?" | "कार्य अनुभव कितना है?" | "Kitne saal ka experience hai? Kaha job ki?" | Experience summary + #experience |
| `services` | "What consulting services do you offer?" | "आप क्या सेवाएं प्रदान करते हैं?" | "Kya services provide karte ho? Freelance work?" | Services list + quote trigger |
| `achievements` | "List your key achievements and records" | "प्रमुख उपलब्धियां और रिकॉर्ड" | "Key achievements kya hain? Notice record?" | Metrics + #achievements |
| `recruiter_info` | "I want to download your resume PDF" | "रिज्यूमे डाउनलोड करें" | "Resume download karna hai / CV chahiye" | Resume PDF download button |
| `client_info` | "How much does an MVP project cost?" | "प्रोजेक्ट का कितना खर्च होगा?" | "Project cost kitna aayega? Quotation estimator" | Quotation tab trigger |
| `marriage_bio` | "Show me your matrimonial biodata" | "विवाह बायोडाटा दिखाएं" | "Shaadi ka biodata / Family background kya hai?" | Marriage bio card |
| `contact` | "How can I contact Atul directly?" | "संपर्क कैसे करें?" | "Sampark kaise karein? WhatsApp number kya hai?" | WhatsApp button + contact tab |
| `availability` | "Are you available for immediate hire?" | "क्या आप काम के लिए उपलब्ध हैं?" | "Immediate join kar sakte ho? Availability kya hai?" | Availability status pill |
| `navigation` | "Scroll down to the contact section" | "संपर्क अनुभाग पर जाएं" | "Contact section pe scroll karo / Le chalo" | Smooth scroll `#contact` |
| `filter_toggles` | "Switch to corporate accountant view" | "अकाउंटेंट मोड चालू करें" | "Accountant mode on karo / Filter lagao" | Role toggle trigger |
| `suggestions` | "What can I ask you about?" | "मैं क्या पूछ सकता हूँ?" | "Kya pooch sakte hain? Guide karo / Options dikhao" | Suggestion chips |
| `faq` | "Where are you located in India?" | "आप भारत में कहाँ स्थित हैं?" | "Kaha rehte ho? Office location kya hai?" | Exact location answer |
| `ambiguous` | "asdfghjkl random gibberish" | "कुछ भी अटपटा टेक्स्ट" | "kuch bhi ulta seedha" | Polite fallback + chips |

### Suite 3: Synonym Expansion, Technical Aliases & Typo Normalization
- **Technical Aliases**:
  - `"k8s"` expands to `"kubernetes"`
  - `"fe"` / `"frontend"` expands to `"react"`, `"next.js"`, `"tailwind css"`
  - `"be"` / `"backend"` expands to `"node.js"`, `"python"`, `"apis"`
  - `"bi"` expands to `"power bi"`, `"business intelligence"`
  - `"gst"` expands to `"gstr-1"`, `"gstr-3b"`, `"input tax credit"`, `"statutory tax"`
- **Bilingual Colloquial Synonyms**:
  - `"kaam"` -> `"projects"` / `"work"`
  - `"hunar"` / `"aata hai"` -> `"skills"`
  - `"naukri"` / `"chahiye"` -> `"recruiter_info"`
  - `"kharcha"` / `"daam"` / `"bhav"` -> `"client_info"` / `"quotation"`
  - `"rishta"` / `"shaadi"` -> `"marriage_bio"`
  - `"baat"` / `"sampark"` -> `"contact"`
- **Typo Tolerance (Levenshtein Distance <= 2)**:
  - `"projets"` -> `"projects"`
  - `"prject"` -> `"projects"`
  - `"skils"` -> `"skills"`
  - `"expereince"` -> `"experience"`
  - `"resme"` -> `"resume"`
  - `"cntact"` -> `"contact"`
  - `"watsapp"` -> `"whatsapp"`
  - `"acountant"` -> `"accountant"`

### Suite 4: Weighted Search Index Scoring & Ranking Algorithm
- **Scoring Weights Formula**:
  $$\text{Score} = (\text{TitleExact} \times 100) + (\text{TitlePrefix} \times 50) + (\text{TagMatch} \times 30) + (\text{CategoryMatch} \times 20) + (\text{BodyTextMatch} \times 10) + (\text{FuzzyMatch} \times 5)$$
- **Test Scenarios**:
  1. Query `"PolicyGuard"`: Project `07` (`PolicyGuard AI`) must rank #1 with score $\ge 80$.
  2. Query `"GST"`: Project `01` (`GST & Income Tax Compliance Engine`) must rank #1 among projects.
  3. Query `"Power BI"`: Executive Power BI project (`05`) and BI skills must rank at the top.
  4. Query `"Day Nulm"`: Project `03` (`DAY-NULM Skill India MIS Portal`) must rank #1.
  5. Irrelevant Query: `"cryptocurrency mining dogecoin"` must return 0 items passing score threshold ($\text{score} < 10$).

### Suite 5: Multi-Role & Audience Filtering with Dynamic Relaxation Protocol
- **Audience Mode Verification**:
  - `recruiter`: Multiplier $+30$ on resume downloads, career timeline, and core technical proficiencies. Suppresses marriage biodata.
  - `client`: Multiplier $+30$ on quotation pricing, service deliverables, and case study impact metrics.
  - `marriage`: Multiplier $+40$ on matrimonial biodata, family background, and personal values.
- **Role Mode Verification**:
  - `accountant`: Prioritizes financial compliance, tax audits, Tally Prime, and ERP workflows.
  - `mis`: Prioritizes data pipelines, Excel MIS, Python automation, and GIS mapping.
  - `vibe_coding`: Prioritizes React 19, Tailwind v4, Web Audio API, and agentic workflows.
- **Dynamic Relaxation Protocol**:
  - Test input: Query `"React Tailwind portfolio"` with active role set to `accountant`.
  - Condition: Strict filter returns 0 results for `role === 'accountant'`.
  - Relaxation Action: Automatically broadens search scope to `overview` / `all` roles.
  - Assertion: Returns Project `08` (`Dynamic Cursor Portfolio`) and `PolicyGuard AI`.
  - Assertion: Result metadata contains `relaxed: true` and polite notice (e.g., *"Showing results from Vibe Coding & Full-Stack engineering"*).

### Suite 6: Action Button Generation & Custom Window Event Payloads
- **Schema Validation**: Every generated action button must strictly conform to:
  ```ts
  interface ActionButton {
    id: string;
    label: string;
    icon?: string;
    actionType: 'event' | 'link' | 'scroll';
    eventName?: string;
    detail?: Record<string, any>;
    target?: string;
    ariaLabel: string;
  }
  ```
- **Event-Specific Payloads**:
  1. Case Study Drawer Trigger:
     - `actionType === 'event'`
     - `eventName === 'portfolio:open-case-study'`
     - `detail.id` MUST be in `['01', '02', '03', '04', '05', '06', '07', '08', '09']`.
  2. Quotation Estimator Trigger:
     - `actionType === 'event'`
     - `eventName === 'portfolio:switch-contact-tab'`
     - `detail.tab === 'quote'`
  3. Section Scroll Navigation:
     - `actionType === 'scroll'`
     - `target` MUST start with `#` and match one of:
       `['#about', '#skills', '#experience', '#projects', '#achievements', '#social-proof', '#testimonials', '#gallery', '#playground', '#faq', '#contact']`.

### Suite 7: Subpath Link Integrity & Public Asset Verification
- **GitHub Pages Subpath Base**: `/Interactive-Cursor-Tracking-Portfolio/`
- **Link Assertions**:
  1. Resume Download Links:
     - Must match `/Interactive-Cursor-Tracking-Portfolio/resume.pdf` or relative `resume.pdf`.
     - NEVER naked root `/resume.pdf`.
     - File existence: Verify `public/resume.pdf` exists and has size $> 15,000$ bytes.
     - Role resumes: Verify `public/resume-accountant.pdf`, `public/resume-mis.pdf`, `public/resume-controller.pdf`, `public/resume-vibe-coder.pdf` exist.
  2. WhatsApp Link:
     - Must match `https://wa.me/917992383804`.
  3. Anchor Links:
     - All section links start with `#` and correspond to actual `<section id="...">` elements in `src/App.jsx`.

### Suite 8: 100% Offline Safety & Zero External Calls Guard
- **Interception Mechanism**:
  ```javascript
  const originalFetch = global.fetch;
  const originalHttp = http.request;
  const originalHttps = https.request;
  let networkCallCount = 0;
  global.fetch = () => { networkCallCount++; throw new Error('Network call forbidden!'); };
  http.request = () => { networkCallCount++; throw new Error('HTTP call forbidden!'); };
  https.request = () => { networkCallCount++; throw new Error('HTTPS call forbidden!'); };
  ```
- **Stress Test**:
  - Run 100 consecutive queries across all 16 intents, fuzzy search, relaxation, and FAQ lookups.
  - Assert `networkCallCount === 0`.
  - Restore original network primitives.

### Suite 9: Session Storage State Management, Truncation & Memory Cache
- **State Integrity**:
  - Simulates browser `sessionStorage` interface (`getItem`, `setItem`, `removeItem`).
  - Verifies messages persist across simulated page reloads.
  - Verifies `resetConversation()` wipes storage key `portfolio_chat_history` and restores the standard initial welcome state.
  - Verifies sliding window truncation: conversation history is capped at 30 messages to guarantee `sessionStorage` 5MB quota is never exceeded.

### Suite 10: Production Bundle Budget & Zero Regressions Gate
- **Bundle Measurement**:
  - Runs `npm run build` or checks `dist/assets/`.
  - Measures total JS chunk sizes before and after assistant integration.
  - Asserts JS bundle increase is $< 25 \text{ kB}$ (25,600 bytes uncompressed).
- **Regression Audit**:
  - Re-executes all 37 existing test suites in `package.json`.
  - Asserts all 37 suites pass with exit code `0`.
  - Total passed suites: **38 / 38** (100%).

---

## 4. Caveats

1. **`scripts/verify_ai_chat_feature.mjs` String Regression**:
   - `scripts/verify_ai_chat_feature.mjs` lines 63–69 explicitly check:
     - `"Hi there! 👋 I am Atul's AI Assistant preview"`
     - `'🚀 Featured Projects'`
     - `'💻 Core Tech Stack'`
     - `'💼 Experience Summary'`
     - `'📬 How to Contact'`
   - *Mitigation for Implementer*: When upgrading `AIChatWidget.jsx`, ensure either these exact strings are maintained (e.g. as default welcome message and initial prompt chips) or that `scripts/verify_ai_chat_feature.mjs` is updated in sync to prevent test failure.
2. **`scripts/verify_audience_filter.mjs` (Unchained Test)**:
   - `scripts/verify_audience_filter.mjs` currently fails when run independently because of an outdated tooltip assertion in `FloatingActionHub.jsx`. However, it is **not** included in `package.json` `npm test`. The implementer must focus strictly on the 37 chained suites in `package.json`.
3. **Pure Standalone Node Testing**:
   - Because no DOM or headless browser (Playwright/Jest) is installed, UI interactions in `scripts/test-portfolio-assistant.js` must be tested using AST/regex source checks, state machine simulations, and mocked browser primitives (`sessionStorage`, `CustomEvent`).

---

## 5. Conclusion

1. **Test Infrastructure Ready**: The portfolio features a robust, ultra-fast test infrastructure consisting of 37 chained Node.js scripts executing in $< 5$ seconds with 806+ assertions and a 100% pass rate.
2. **Bundle Size Baseline Established**: Production bundle size is baseline-locked at **2,265.91 kB total assets** and **1,998.15 kB total JS**. The strict budget threshold allows a maximum increase of **$< 25 \text{ kB}$**.
3. **Acceptance Verification Harness Fully Designed**: `scripts/test-portfolio-assistant.js` is fully planned across 10 verification suites covering all 16 intents, trilingual queries (English, Hindi, Hinglish), synonym/typo tolerance, weighted scoring, role/audience relaxation, custom event dispatching, subpath link integrity, and 100% offline safety.
4. **Integration Path**: Appending `node scripts/test-portfolio-assistant.js` to `package.json`'s `scripts.test` will seamlessly elevate the test suite count from 37 to 38.

---

## 6. Verification Method

To independently verify all findings and baseline metrics in this report:

1. **Verify Existing 37 Test Suites Pass**:
   ```powershell
   npm test
   ```
   *Expected Result*: Exits with code `0`, outputs passing checks for all 37 verification scripts.

2. **Verify Production Build & Bundle Baseline**:
   ```powershell
   npm run build
   ```
   *Expected Result*: Completes with exit code `0`, generates `dist/` with JS chunks totaling $\approx 1,998.15 \text{ kB}$ and `AIChatWidget` chunk $\approx 12.20 \text{ kB}$.

3. **Verify Bundle Size Calculation**:
   ```powershell
   node -e "const fs = require('fs'), path = require('path'); const dir = 'dist/assets'; let js = 0; fs.readdirSync(dir).forEach(f => { if (f.endsWith('.js')) js += fs.statSync(path.join(dir, f)).size; }); console.log('Total JS kB:', (js/1024).toFixed(2));"
   ```
   *Expected Result*: Outputs `Total JS kB: 1998.15`.
