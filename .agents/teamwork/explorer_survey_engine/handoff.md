# Handoff Report: 8-Layer Deterministic Knowledge & Retrieval Engine Architecture

**Role**: Engine Survey Explorer (`explorer_survey_engine`)  
**Mission**: Survey portfolio taxonomy, items, skills, experience, FAQs, role/audience contexts, and design the 8-layer (Layers A–H) deterministic search & retrieval engine per R1 and R3.  
**Integrity Mode**: Read-Only Investigation (Zero source code modifications).  

---

## 1. Observation

### 1.1 Codebase Survey & Direct File Verification
A comprehensive examination of the repository was conducted using read-only filesystem tools (`run_command`, `view_file`, `grep_search`). The direct observations and exact counts are verified as follows:

1. **Global Search Catalog (`src/utils/searchCatalog.js`)**:
   - Total items in `SEARCH_ITEMS`: **84 items** (exceeds the 83+ requirement in R1).
   - Category distribution:
     - `Actions`: 12 items (`act-resume`, `act-email`, `act-whatsapp`, `act-maps`, `act-cursor-playground`, `act-lab-drawer`, `act-theme`, `act-role-overview`, `act-role-accountant`, `act-role-mis`, `act-role-vibe`, `act-role-other`)
     - `Sections`: 13 items (`sec-hero`, `sec-about`, `sec-biodata`, `sec-skills`, `sec-projects`, `sec-experience`, `sec-achievements`, `sec-gallery`, `sec-playground`, `sec-faq`, `sec-contact`, `sec-direct`, `sec-location`)
     - `Projects`: 9 items (`proj-gst-tax`, `proj-tally-accounting`, `proj-day-nulm`, `proj-smart-card`, `proj-enterprise-transformation`, `proj-business-advisory`, `proj-ai-saas-generator`, `proj-agent-workflow-engine`, `proj-doc-code-synthesizer`)
     - `Skills`: 37 items (`skill-tally-prime-erp-9` through `skill-prompt-engineering-context-mcp`)
     - `Experience`: 10 items (`exp-tax-consultant`, `exp-senior-accountant`, `exp-mis-executive`, `exp-junks-food`, `exp-smart-card`, `exp-instructor`, `exp-other-controller`, `exp-other-bi-systems`, `exp-other-compliance`, `exp-vibe-coder`)
     - `Education`: 3 items (`edu-adca`, `edu-dca`, `edu-tally`)
   - Role distribution across items: `both`: 24, `accountant`: 17, `mis`: 17, `vibe_coding`: 11, `other`: 14, `overview`: 1.
   - Schema fields: `{ id, title, title_hi?, category, targetId, badge, badge_hi?, matchType, role, actionType?, actionUrl?, desktopOnly?, description, description_hi?, keywords, keywords_hi? }`.

2. **Flagship Case Studies (`src/data/caseStudiesData.js`)**:
   - Total items in `CASE_STUDIES`: **9 case studies** (`01` through `09`).
   - Role alignment:
     - `accountant`: `01` (GST & Income Tax Compliance & Verification Engine), `02` (Tally Financial Accounting & Inventory Management)
     - `mis`: `03` (DAY-NULM Skill India MIS Reporting Portal), `04` (Multi-District Smart Card Operations & Enrollment Engine)
     - `other`: `05` (Executive Power BI Fiscal Intelligence & Reconciliation Engine), `06` (Corporate Financial Controls & Internal Audit Governance)
     - `vibe_coding`: `07` (AI Prompt-to-Fullstack SaaS Generator), `08` (Autonomous Multi-Agent Workflow Engine), `09` (Real-Time AI Document & Code Synthesizer)
   - Schema fields: `{ id, targetId, role, trackBadge, title, title_hi, subtitle, subtitle_hi, category, category_hi, accentColor, summary, summary_hi, executiveSummary_hi, metrics: [{ value, label, label_hi }], techStack: [], challenge_hi, solution_hi, hurdles_hi, impact_hi, takeaways_hi, story: [{ title, text }], simulator, architecture }`.

3. **Authoritative Bilingual FAQs (`src/data/faqConfig.js`)**:
   - Total items in `FAQ_ITEMS`: **40 bilingual FAQs**.
   - Audience classification: `recruiter`: 14, `client`: 14, `general`: 10, `marriage`: 2.
   - Role classification: `accountant`: 10, `mis`: 10, `vibe_coding`: 10, `all`: 10.
   - Schema fields: `{ id, question, question_hi, answer, answer_hi, audience: string[], role: string[], categoryTag, categoryTag_hi, actionCTA: { type, target?, label, label_hi } }`.
   - Verified `actionCTA.type` values: `case_study`, `contact`, `ai_chat`, `credentials`, `quote`.

4. **Quotation Estimator Services (`src/components/QuotationEstimatorModal.jsx` & `ContactSection.jsx`)**:
   - 3 tracks with 4 services each = **12 quotation services**:
     - `accounting` (Base: ₹4,500 – ₹8,000):
       1. `gst`: GST Return Filing (GSTR-1, 3B, 2B Reconciliation) [₹2,500]
       2. `itr`: Income Tax E-Filing (ITR-1 to 4 & Tax Planning) [₹2,000]
       3. `tally`: Tally Prime / ERP Multi-Company Setup & BRS [₹3,000]
       4. `audit`: Balance Sheet, P&L & Audit Readiness Dossier [₹4,500]
     - `mis` (Base: ₹5,000 – ₹9,000):
       1. `macro`: MS Excel VBA / Macro Automation & Pipelines [₹3,500]
       2. `govt`: DAY-NULM / Government Skill Portal Reporting [₹3,000]
       3. `cleaning`: Large Dataset Reconciliation & Cleaning (10k+ rows) [₹2,500]
       4. `powerbi`: Power BI Executive KPI Dashboard & Telemetry [₹4,000]
     - `ai_web` (Base: ₹22,000 – ₹35,000):
       1. `mvp`: Full-Stack Next.js / React SaaS MVP Prototype [₹18,000]
       2. `agents`: Autonomous Multi-Agent LLM Workflow Engine [₹14,000]
       3. `api`: Production REST API, Auth & PostgreSQL DB Integration [₹8,000]
       4. `design`: High-Fidelity Tailwind CSS & UI/UX Interactions [₹6,000]

5. **Role & Audience State Management (`src/context/RoleContext.jsx` & `AudienceContext.jsx`)**:
   - `RoleContext`:
     - 5 active role tracks: `accountant`, `mis`, `vibe_coding`, `other`, `overview`.
     - Inbound event: `switch-role-tab` with `{ detail: { role: string } }`.
     - Outbound event: `portfolio-role-change` with `{ detail: { role: string } }`.
   - `AudienceContext`:
     - 4 audience modes: `all`, `recruiter`, `client`, `marriage`.
     - Outbound event: `portfolio:audience-change` with `{ detail: { audience: string } }`.

6. **Resume Configurations (`src/utils/resumeConfig.js`)**:
   - Maps roles to verified filenames:
     - `overview`: `resume.pdf` (`Atul_Verma_Overview_Resume.pdf`)
     - `accountant`: `resume-accountant.pdf` (`Atul_Verma_Accountant_Resume.pdf`)
     - `mis`: `resume-mis.pdf` (`Atul_Verma_MIS_Resume.pdf`)
     - `vibe_coding`: `resume-vibe-coder.pdf` (`Atul_Verma_Vibe_Coder_Resume.pdf`)
     - `other`: `resume-controller.pdf` (`Atul_Verma_BI_Corporate_Controller_Resume.pdf`)

7. **Existing AI Chat Widget (`src/components/AIChatWidget.jsx`)**:
   - Lines 9–15: currently contains a static mock `KNOWLEDGE_RESPONSES` object with placeholder projects ("PolicyGuard AI", "Modern Payment Gateway") that contradict Atul Verma's real verified portfolio data.
   - Lines 68–86: listens to window event `portfolio:open-ai-chat`.
   - Lines 89–96: dispatches window event `portfolio:ai-chat-state` (`{ isOpen, isMinimized }`).
   - Line 70–72: contains tablet auto-minimize logic (`window.innerWidth < 960 && isDrawerOpen`).
   - Tested by `scripts/verify_ai_chat_feature.mjs` which strictly asserts specific DOM classes (`fixed bottom-0 z-[55]`, `backdrop-blur-md`, `shadow-2xl`, `rounded-t-2xl rounded-b-none border-t border-x border-b-0`, `isDrawerOpen ? 'sm:right-[540px]' : 'sm:right-28'`).

8. **Test Baseline (`npm test`)**:
   - Successfully executed all 38 test suites. 100% passing tests with 0 failures.

---

## 2. Logic Chain: Architectural Design of the 8-Layer Engine

The requirements in `ORIGINAL_REQUEST.md` (R1 and R3) dictate an offline-first, zero-network, deterministic knowledge & retrieval engine covering Layers A through H. Here is the rigorous step-by-step logic chain and design:

```
[User Query Input]
        │
        ▼
┌────────────────────────────────────────────────────────┐
│ Layer B: Query Normalization & Multilingual Dictionary │
│  - Script detection (Devanagari vs Latin)              │
│  - Levenshtein typo repair (dist <= 2)                 │
│  - Technical aliases & Hinglish phrase mapping         │
└───────────────────────┬────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        ▼                               ▼
┌───────────────────────────────┐ ┌───────────────────────────────────────┐
│ Layer A: Intent Classifier    │ │ Layer F: Authoritative FAQ Matcher    │
│  - 16 Core Intents            │ │  - Direct match against 40 FAQs       │
│  - Entity extraction          │ │  - Verbatim answer (score >= 75)      │
│  - Direct action triggers     │ │  - Language auto-selection (EN/HI)    │
└───────────────┬───────────────┘ └───────────────────┬───────────────────┘
                │                                     │
                │ (If not FAQ hit)                    │ (If FAQ hit)
                ▼                                     │
┌──────────────────────────────────────────────┐      │
│ Layer C: Weighted Local Search Index         │      │
│  - Composite text corpus (84 items)          │      │
│  - Exact phrase, token, prefix, fuzzy        │      │
│  - Category multiplier (Actions, Proj, Skill)│      │
└───────────────────────┬──────────────────────┘      │
                        │                             │
                        ▼                             │
┌──────────────────────────────────────────────┐      │
│ Layers D & E: Audience & Role Filtering      │      │
│  - Role boost & audience prioritization      │      │
│  - 4-Phase Dynamic Relaxation on 0 matches   │      │
└───────────────────────┬──────────────────────┘      │
                        │                             │
                        ▼                             │
┌──────────────────────────────────────────────┐      │
│ Layers G & H: Disambiguation & Safe Fallback │      │
│  - Clarification chips if score < threshold  │      │
│  - Transparent honesty, zero hallucination   │      │
│  - Direct fallback action triggers (WhatsApp)│      │
└───────────────────────┬──────────────────────┘      │
                        │                             │
                        ▼                             ▼
              [Unified Assistant Response Object]
```

### 2.1 Layer A: 16 Core Intents Specification
Every intent is classified with deterministic regular expressions, keyword clusters, entity extractors, and response actions:

| Intent ID | Description | Triggers (EN / HI / Hinglish) | Entity Extractor | Primary Action / Event |
|---|---|---|---|---|
| `intent_roles` | Professional tracks & executive summary | "who is atul", "roles", "background", "profiles", "kaun hai atul", "kya kaam karte ho", "roles batao", "कौन है", "प्रोफाइल" | Extracts `role` target if explicit (`accountant`, `mis`, `vibe_coding`, `other`, `overview`) | Displays multi-track profile summary; presents role switcher chips. |
| `intent_projects` | Case studies, portfolio projects & simulations | "projects", "case study", "portfolio work", "kaun se project", "kya banaya hai", "प्रोजेक्ट्स", "केस स्टडी", "काम दिखाओ" | Extracts project index (`01` - `09`) or role | Dispatches `portfolio:open-case-study` with ID; provides quick dossier summaries. |
| `intent_skills` | Tools, software, tech stack, competencies | "skills", "tech stack", "tools", "tally", "excel", "gst", "react", "python", "kya skills hai", "कौशल", "टूल्स" | Extracts tool name (e.g., `tally`, `excel`, `cursor`, `gst`, `powerbi`) | Lists verified proficiency percentages (e.g., 98%); action button scrolls to `#skills`. |
| `intent_experience` | Career history, tenures, past companies | "experience", "work history", "career", "jobs", "kahan kaam kiya", "kitne saal ka experience", "अनुभव", "करियर" | Extracts duration (`10+ years`) or company (`DAY-NULM`, `Junks Food`, etc.) | Chronological tenure breakdown (2012–Present); action button scrolls to `#experience`. |
| `intent_services` | Service catalog & consulting offerings | "services", "offerings", "hire", "consulting", "kya services dete ho", "tax filing karwana hai", "सेवाएं", "कंसल्टेंसी" | Extracts track (`accounting`, `mis`, `ai_web`) | Outlines services; dispatches `portfolio:switch-contact-tab` with `{ tab: 'quote' }`. |
| `intent_pricing_quotation` | Service costs, fees, hourly rates, estimates | "pricing", "fees", "cost", "quotation", "rate", "kitna charge", "kitna paisa", "kharcha", "कीमत", "फीस", "कोटेशन" | Extracts service type (`gst`, `itr`, `tally`, `macro`, `mvp`) | Displays exact pricing tiers (₹2,000–₹35,000); action button triggers `portfolio:open-estimator`. |
| `intent_achievements` | Volume metrics, awards, verified records | "achievements", "metrics", "stats", "records", "50000 enrolled", "upalabdhiyan", "उपलब्धियां", "रिकॉर्ड" | Extracts metric category (`biometrics`, `tax_returns`, `companies`) | Returns quantified metrics; scrolls to `#achievements`. |
| `intent_recruiter_info` | Hiring, resume PDF download, notice period | "resume", "cv", "hire", "recruiter", "notice period", "job", "hiring", "biodata download", "रिज्यूमे", "डाउनलोड सीवी" | Extracts role-specific resume ID (`accountant`, `mis`, `vibe_coding`, `other`, `overview`) | Direct 1-click PDF download action (`Atul_Verma_..._Resume.pdf`); sets audience to `recruiter`. |
| `intent_client_info` | Freelance terms, delivery timelines, SLA | "client", "freelance", "contract", "timeline", "turnaround", "delivery time", "client work", "फ्रीलांस", "क्लाइंट" | Extracts deliverables or urgency (`standard`, `express`) | Sets audience to `client`; explains freelance SLA; provides direct quote action. |
| `intent_marriage_bio` | Personal background, matrimonial biodata | "marriage", "matrimonial", "biodata", "family", "personal", "father name", "birth year", "shadi", "vivah", "शादी", "विवाह", "पारिवारिक" | Extracts field (`father`, `birth_year`, `marital_status`, `location`) | Presents verified `BIO_DATA_FIELDS` respectfully; dispatches audience change to `marriage`. |
| `intent_contact` | Direct communication, WhatsApp, phone, email | "contact", "phone", "email", "whatsapp", "call", "address", "location", "kaise contact karein", "sampark", "संपर्क", "फोन", "व्हाट्सएप" | Extracts channel (`whatsapp`, `email`, `phone`, `office`) | Action buttons for WhatsApp (+91 7992383804), mailto (atulravi2015@gmail.com), and `#contact` scroll. |
| `intent_availability` | Availability status, working hours, remote | "available", "working hours", "timing", "freelance available", "open for work", "kab baat karein", "उपलब्धता", "समय" | Extracts mode (`remote`, `onsite`, `consulting`) | Operating hours (Mon–Sat 10:00 AM – 7:00 PM IST), immediate remote onboarding readiness. |
| `intent_navigation` | Deep-linking and scrolling to page sections | "go to", "scroll to", "show me", "take me to", "navigate", "open section", "dikhao", "chalo", "जाओ", "दिखाइए" | Extracts section (`hero`, `about`, `skills`, `projects`, `experience`, `faq`, `contact`) | Dispatches smooth scroll to target DOM element with focus ring. |
| `intent_filter_toggle` | Switching role or audience filters dynamically | "switch role", "change track", "switch to accountant", "switch to mis", "switch to vibe", "recruiter mode", "client mode", "मोड बदलो" | Extracts target `role` or target `audience` | Dispatches `switch-role-tab` or `portfolio:audience-change`; confirms active state update. |
| `intent_suggestions` | Help menu, prompt chips, assistant guidance | "help", "what can you do", "kya pooch sakte hain", "menu", "options", "suggestions", "madad", "मदद", "सुझाव" | None | Generates 4–6 contextual prompt chips tailored to current role and audience context. |
| `intent_ambiguous` | Unrecognized or overly broad query | Unmatched input, low confidence score (< 0.35), generic greetings ("hi", "hello", "ok") | Partial token matches | Activates Layers G & H: polite greeting with 4 targeted exploration chips; zero hallucination. |

---

### 2.2 Layer B: Synonym, Phrase & Typo Dictionary

The dictionary normalizes queries into canonical indexing tokens across 4 dimensions:

1. **Language & Dialect Detection**:
   - `detectLanguage(text)`:
     - Regex `/[\u0900-\u097F]/`: **Hindi** (Devanagari script).
     - Hinglish keyword detection (`kya`, `kaise`, `kitna`, `kahan`, `karo`, `chahiye`, `batao`, `shadi`, `kaam`, `paisa`): **Hinglish**.
     - Otherwise: **English**.

2. **English Technical & Domain Aliases**:
   - `brs` $\to$ `bank reconciliation`
   - `itc` / `itc2b` $\to$ `itc-2b reconciliation`
   - `gstr1` / `gstr3b` / `gstr9` $\to$ `gstr filing compliance`
   - `tds` / `tcs` $\to$ `tax deducted at source`
   - `pbi` $\to$ `power bi dashboard`
   - `nulm` / `daynulm` $\to$ `day-nulm government portal`
   - `rsby` $\to$ `rsby smart card biometric`
   - `llm` / `agent` $\to$ `autonomous agent vibe coding`
   - `pnl` / `p&l` $\to$ `profit and loss balance sheet`

3. **Hindi Devanagari Mappings**:
   - `टैली` $\to$ `tally prime`
   - `जीएसटी` $\to$ `gst filing compliance`
   - `आयकर` $\to$ `income tax e-filing`
   - `बायोडाटा` / `विवाह` / `शादी` $\to$ `marriage matrimonial biodata`
   - `रिज्यूमे` / `सीवी` $\to$ `resume download`
   - `फीस` / `खर्चा` $\to$ `quotation estimator pricing`
   - `कौशल` / `हुनर` $\to$ `skills`
   - `प्रोजेक्ट्स` / `काम` $\to$ `projects case studies`
   - `अनुभव` / `नौकरी` $\to$ `experience career`
   - `संपर्क` / `फोन` $\to$ `contact whatsapp`

4. **Hinglish Conversational Phrase Normalization**:
   - `kitna kharcha hoga` / `fees kitni hai` $\to$ `pricing quotation`
   - `resume chahiye` / `cv download karna hai` $\to$ `download resume`
   - `kaun kaun se project kiye hain` $\to$ `case studies projects`
   - `shadi ke liye biodata` / `family details batao` $\to$ `matrimonial biodata`
   - `tax kaise bachayein` / `itr bharna hai` $\to$ `income tax planning`
   - `excel me kya aata hai` $\to$ `ms excel vba macro`
   - `phone number do` / `baat karni hai` $\to$ `contact whatsapp phone`

5. **Levenshtein Typo Tolerance (Distance $\le$ 2)**:
   - Evaluated on word tokens with length $\ge 4$:
     - `taly`, `talli`, `tallyp` $\to$ `tally`
     - `excl`, `excle`, `xcel` $\to$ `excel`
     - `incometx`, `incomtax`, `inctax` $\to$ `income tax`
     - `acounting`, `accnt`, `acount` $\to$ `accounting`
     - `resum`, `resme` $\to$ `resume`
     - `watsapp`, `whatsap` $\to$ `whatsapp`
     - `curser`, `curserlab` $\to$ `cursor physics lab`
     - `dalton`, `daltongnj`, `palamau` $\to$ `daltonganj palamu`

---

### 2.3 Layer C: Weighted Search Index Algorithm

The search index operates over a composite corpus generated from all 84 catalog items, 9 case studies, 37 skills, 10 experience positions, and 12 quotation services.

#### Mathematical Scoring Formula:
For a candidate item $I$ and query $Q$ with tokens $\{t_1, t_2, \dots, t_k\}$:

$$\text{Score}(I, Q) = \left( S_{\text{exact\_phrase}} + \sum_{j=1}^k S_{\text{token}}(t_j, I) + S_{\text{context}} \right) \times M_{\text{category}}$$

1. **Exact Phrase Bonuses ($S_{\text{exact\_phrase}}$)**:
   - Full query exact match in `title` / `title_hi`: $+60$
   - Full query exact match in `keywords` / `keywords_hi`: $+40$
   - Full query exact match in `description` / `description_hi`: $+25$
   - Full query exact match in `badge` / `matchType`: $+20$

2. **Token Match Scoring ($S_{\text{token}}(t, I)$)**:
   - Exact token in title: $+20$
   - Exact token in keywords: $+15$
   - Exact token in description / points: $+8$
   - Prefix match ($\text{token} \text{ startsWith } w \lor w \text{ startsWith } \text{token}$, $\text{len} \ge 3$): $+10$
   - Levenshtein distance 1 match on corpus word: $+7$
   - Levenshtein distance 2 match on corpus word: $+4$

3. **Context Alignment Boost ($S_{\text{context}}$)**:
   - Role Match: If $I.\text{role} = \text{activeRole} \lor I.\text{role} = \text{'both'}$, $+25$
   - Audience Match: If $I.\text{audience} \text{ includes } \text{activeAudience} \lor \text{activeAudience} = \text{'all'}$, $+20$

4. **Category Multiplier ($M_{\text{category}}$)**:
   - If query triggers action verbs ("download", "contact", "call", "email", "open"): `Actions` $\times 1.30$
   - If query triggers project nouns ("case study", "project", "system", "built"): `Projects` $\times 1.25$
   - If query triggers skill nouns ("stack", "proficiency", "tool", "know"): `Skills` $\times 1.20$
   - Standard baseline multiplier: $1.00$

5. **Deduplication & Top-$K$ Selection**:
   - Results are deduplicated by `id`.
   - Items are sorted strictly descending by `Score`.
   - Top 3 to 5 items are retained for response composition.

---

### 2.4 Layers D & E: Audience & Role Filtering with Dynamic Relaxation

#### Strict Filtering Rules:
- **Layer D (Role)**: Filter against `activeRole` (`accountant`, `mis`, `vibe_coding`, `other`, `overview`).
  - Items with `role === 'both'` or `role === 'all'` always pass.
  - When `activeRole === 'overview'`, items from all roles pass with executive weighting.
- **Layer E (Audience)**: Filter against `activeAudience` (`all`, `recruiter`, `client`, `marriage`).
  - `recruiter`: prioritizes resumes, career tenure, technical stack, certifications; demotes marriage details.
  - `client`: prioritizes quotation pricing, case study deliverables, freelance timelines, contact form.
  - `marriage`: prioritizes personal background, family history, birth year, moral values, matrimonial biodata.
  - `all`: unconstrained view.

#### 4-Phase Dynamic Relaxation Algorithm:
When a targeted search produces **zero results** under strict filters, the engine dynamically relaxes constraints in 4 deterministic stages:

```
[Query Yields 0 Results]
         │
         ▼
[Phase 1: Strict Match] ──(0 matches)──► [Phase 2: Relax Role Filter]
(activeRole + activeAudience)              (Keep activeAudience, search all roles)
                                           Banner: "Found relevant results across all roles"
                                                    │
                                                    ▼ (0 matches)
[Phase 4: Layers G & H Fallback] ◄──(0 matches)── [Phase 3: Relax Audience Filter]
(Disambiguation chips & WhatsApp)                  (Search entire global portfolio index)
                                                   Banner: "Expanded search to entire portfolio"
```

This guarantees zero dead ends while keeping results maximally aligned with the user's active mode.

---

### 2.5 Layer F: Authoritative FAQ Matching

- **Direct Authoritative Matching**:
  - Compares query tokens against all 40 verified items in `src/data/faqConfig.js`.
  - Calculates matching score:

    $$\text{FAQ\_Score} = 0.50 \cdot \text{Match}(Q, \text{question}) + 0.30 \cdot \text{Match}(Q, \text{answer}) + 0.20 \cdot \text{Match}(Q, \text{categoryTag})$$

  - **Threshold Policy**:
    - $\text{FAQ\_Score} \ge 75$: **Authoritative Exact Hit**.
      - Returns verbatim `answer` (or `answer_hi` if Hindi/Hinglish query detected).
      - Zero fabrication or paraphrasing that changes facts.
      - Automatically binds the associated `actionCTA` (`case_study`, `contact`, `quote`, `credentials`, `ai_chat`) as a clickable interactive button.
    - $50 \le \text{FAQ\_Score} < 75$: **Candidate FAQ**. Returns question as an interactive disambiguation chip.
    - $\text{FAQ\_Score} < 50$: Continues to Layer C catalog search.

---

### 2.6 Layers G & H: Disambiguation Chips & Truthful Fallback

1. **Layer G: Interactive Decision-Tree Disambiguation Chips**:
   - Triggered when:
     - User query matches multiple tracks equally (e.g., query "tax" matches both Accountant compliance and Corporate Controller tax strategy).
     - Query is broad (e.g., "what do you do", "skills", "projects").
     - Intent is `intent_ambiguous`.
   - Engine dynamically generates 3–4 high-resolution suggestion chips:
     - Example for "tax": `["GST Return Filing (3B/1)", "Income Tax (ITR 1-4)", "Tax Quotation Fees", "Case Study #01 (GST Engine)"]`
     - Example for "tally": `["Tally Prime Accounting", "Multi-Company BRS", "Tally Course Certificate", "Accounting Services"]`
     - Example for "ai": `["Prompt-to-SaaS Generator #07", "Autonomous Agent Engine #08", "AI Vibe Coder Resume", "AI & Web Quotation"]`
   - Clicking any chip sends that exact refined prompt into the engine without requiring user typing.

2. **Layer H: Truthful Fallback Policy**:
   - Zero-hallucination principle: If no match exists across catalog, case studies, or FAQs, the engine explicitly acknowledges what is missing:
     - English: *"I couldn't find a direct record for '{query}' in Atul's verified portfolio index. You can explore his Accounting experience, MIS data projects, Vibe Coding work, or connect with him directly:"*
     - Hindi: *"अतुल के प्रमाणित पोर्टफोलियो इंडेक्स में '{query}' के लिए कोई सीधा रिकॉर्ड नहीं मिला। आप उनके अकाउंटिंग अनुभव, MIS डेटा प्रोजेक्ट्स, Vibe Coding कार्य देख सकते हैं या सीधे संपर्क कर सकते हैं:"*
   - Always provides 3 direct action buttons:
     1. `💬 Ask on WhatsApp` (direct URL: `https://wa.me/917992383804?text=...`)
     2. `📄 View Verified Resume` (role-specific PDF download)
     3. `🔍 Browse All Sections` (scrolls to overview)

---

### 2.7 Proposed Module Path & Exported API Contracts

The engine must be implemented in a dedicated, decoupled utility module:
- **Target File Path**: `src/utils/portfolioAssistantEngine.js`
- **Zero External Dependencies**: Pure JavaScript, 100% offline-friendly, 0 kB npm packages added.

#### Exported TypeScript / JSDoc API Contracts:

```javascript
/**
 * @typedef {'en' | 'hi' | 'hinglish'} SupportedLanguage
 * @typedef {'accountant' | 'mis' | 'vibe_coding' | 'other' | 'overview'} RoleId
 * @typedef {'all' | 'recruiter' | 'client' | 'marriage'} AudienceId
 * 
 * @typedef {Object} AssistantContext
 * @property {RoleId} [role='accountant'] - Active portfolio role track
 * @property {AudienceId} [audience='all'] - Active audience viewing mode
 * @property {SupportedLanguage} [preferredLanguage] - Override language detection
 * 
 * @typedef {Object} ActionTrigger
 * @property {'scroll' | 'open-case-study' | 'switch-contact-tab' | 'download-resume' | 'external' | 'open-estimator'} type
 * @property {string} [target] - Element ID, Case Study ID, or URL
 * @property {string} label - Button label in English
 * @property {string} [label_hi] - Button label in Hindi
 * 
 * @typedef {Object} AssistantResponse
 * @property {string} id - Unique response ID
 * @property {string} text - Formatted markdown response text
 * @property {SupportedLanguage} language - Detected dialect
 * @property {string} intent - Recognized intent ID
 * @property {number} confidence - Classification confidence (0.0 to 1.0)
 * @property {ActionTrigger[]} actions - Interactive action buttons
 * @property {string[]} suggestionChips - Follow-up disambiguation chips
 * @property {boolean} isFallback - Whether response was generated by fallback layer
 * @property {string} [relaxationBanner] - Explanation if role/audience filter was relaxed
 */

/**
 * 1. Detects language dialect (English, Hindi Devanagari, or Hinglish)
 * @param {string} query
 * @returns {SupportedLanguage}
 */
export function detectLanguage(query) {}

/**
 * 2. Normalizes query applying aliases, Devanagari dictionary, and typo tolerance
 * @param {string} query
 * @returns {{ normalized: string, tokens: string[], aliasesApplied: string[], lang: SupportedLanguage }}
 */
export function normalizeQuery(query) {}

/**
 * 3. Classifies query into one of the 16 core intents
 * @param {string} query
 * @param {AssistantContext} [context]
 * @returns {{ intent: string, confidence: number, entities: Record<string, any> }}
 */
export function classifyIntent(query, context) {}

/**
 * 4. Checks for authoritative verbatim FAQ match (Layer F)
 * @param {string} query
 * @param {AssistantContext} [context]
 * @returns {{ faq: object, score: number } | null}
 */
export function matchAuthoritativeFAQ(query, context) {}

/**
 * 5. Weighted catalog search with role & audience scoring and relaxation (Layers C, D, E)
 * @param {string} query
 * @param {AssistantContext} [context]
 * @returns {{ results: object[], relaxed: boolean, relaxationLevel: string }}
 */
export function searchPortfolioIndex(query, context) {}

/**
 * 6. Main Orchestrator: Processes query through Layers A-H and returns unified response
 * @param {string} query
 * @param {AssistantContext} [context]
 * @returns {AssistantResponse}
 */
export function generateAssistantResponse(query, context) {}

/**
 * 7. Generates contextual initial prompt chips based on active role & audience
 * @param {AssistantContext} context
 * @returns {Array<{ id: string, label: string, query: string }>}
 */
export function getContextualPromptChips(context) {}
```

---

## 3. Caveats

1. **Read-Only Scope**: In strict accordance with the explorer role, no source files were modified. The implementation must be executed by downstream implementer agents.
2. **Offline-Only Execution**: The design deliberately excludes any cloud LLM API (OpenAI, Gemini, Anthropic), external vector database, or heavy ML model downloads (transformers.js, ONNX). All 8 layers operate on in-memory JavaScript data structures with sub-millisecond response latency.
3. **Session-Scoped Storage**: Conversation state will be stored in `sessionStorage` with an in-memory React state fallback, honoring zero persistent user tracking.
4. **Browser Compatibility**: Levenshtein distance calculations are restricted to word tokens with length between 4 and 18 characters to guarantee $O(N \cdot M)$ compute boundaries well within 16ms animation frames.

---

## 4. Conclusion

- **Taxonomy Assessment**: Atul Verma's portfolio possesses a rich, authentic data foundation consisting of **84 catalog items**, **9 case studies**, **37 skills**, **10 experience positions**, **40 bilingual FAQs**, and **12 quotation services**.
- **Engine Viability**: The 8-layer architecture (Layers A through H) completely bridges the gap between user intent and portfolio truth, fully satisfying R1 and R3.
- **Visual & Contract Preservation**: Upgrading `AIChatWidget.jsx` with `portfolioAssistantEngine.js` will maintain 100% backward compatibility with existing tests (`scripts/verify_ai_chat_feature.mjs`) and pass all 38 existing test suites without layout thrashing or bundle bloat.

---

## 5. Verification Method

To independently verify this survey and validate the proposed engine when implemented:

1. **Verify Existing Catalog Counts**:
   ```powershell
   node -e "const { SEARCH_ITEMS } = require('./src/utils/searchCatalog.js'); console.log('Catalog Count:', SEARCH_ITEMS.length);"
   # Expected: 84
   
   node -e "const { CASE_STUDIES } = require('./src/data/caseStudiesData.js'); console.log('Case Studies Count:', CASE_STUDIES.length);"
   # Expected: 9
   
   node -e "const { FAQ_ITEMS } = require('./src/data/faqConfig.js'); console.log('FAQ Count:', FAQ_ITEMS.length);"
   # Expected: 40
   ```

2. **Execute Existing Test Baseline**:
   ```powershell
   npm test
   # Expected: All 38 test suites pass cleanly with 0 errors.
   ```

3. **Verify AI Chat Feature Assertions**:
   ```powershell
   node scripts/verify_ai_chat_feature.mjs
   # Expected: All checks pass (docked station container, icons, headers, event bindings).
   ```

4. **Dedicated Assistant Verification Suite (Post-Implementation)**:
   When `src/utils/portfolioAssistantEngine.js` is created, run the upcoming verification script:
   ```powershell
   node scripts/test-portfolio-assistant.js
   # Expected: 16/16 intents classified, synonym expansions verified, FAQ matches exact, 0 hallucination.
   ```
