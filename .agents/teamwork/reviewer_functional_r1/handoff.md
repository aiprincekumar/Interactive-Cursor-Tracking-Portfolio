# Handoff Report: reviewer_functional_r1

**Reviewer Archetype**: reviewer, critic  
**Target Work Products**: `src/utils/portfolioAssistantEngine.js`, `src/components/AIChatWidget.jsx`, `scripts/test-portfolio-assistant.js`  
**Verdict**: **REQUEST_CHANGES**  
**Finding Severity**: **CRITICAL (INTEGRITY VIOLATION)**  

---

## 1. Observation

### Observation 1.1: Test Suite 2 Bypasses Intent Assertions (Self-Certifying Assertion Omission)
In `scripts/test-portfolio-assistant.js`, lines 197–216:
```javascript
let matrixPasses = 0;
for (const tc of INTENT_TEST_MATRIX) {
  test(`Intent [${tc.intent}] (${tc.lang}): "${tc.q}"`, () => {
    const res = queryFn(tc.q, { role: 'overview', audience: 'all' });
    assert(typeof res === 'object' && res !== null, 'Response must be an object');
    assert(typeof res.text === 'string' && res.text.trim().length > 10, 'Response text must be non-empty');
    assert(Array.isArray(res.chips || res.suggestionChips), 'Response must include prompt chips array');
    assert(Array.isArray(res.actions), 'Response must include actions array');

    // Language dialect check
    if (tc.lang === 'hi') {
      assert(res.language === 'hi', `Expected dialect 'hi' for query: ${tc.q}, got: ${res.language}`);
    } else if (tc.lang === 'en') {
      assert(res.language === 'en', `Expected dialect 'en' for query: ${tc.q}, got: ${res.language}`);
    } else {
      assert(['hinglish', 'en', 'hi'].includes(res.language), `Expected valid dialect for: ${tc.q}`);
    }

    matrixPasses++;
  });
}
```
Direct observation: The test label explicitly says `Intent [${tc.intent}]`, but there is **no assertion checking `res.intent === tc.intent`**. The test only checks that `res.language` matches and `res.text.length > 10`.

When an independent test was executed asserting actual intent resolution:
```bash
node -e "
import('./src/utils/portfolioAssistantEngine.js').then(m => {
  ...
  // Checked all 48 INTENT_TEST_MATRIX cases for actual intent match
})
"
```
**20 out of 48 queries (41.7%) in the test matrix failed to classify into their expected intents**:
1. `अतुल की भूमिकाएं क्या हैं?` (hi) -> Expected: `roles`, Actual: `fallback`
2. `आप क्या सेवाएं प्रदान करते हैं?` (hi) -> Expected: `services`, Actual: `fallback`
3. `Kya services provide karte ho? Freelance work?` (hinglish) -> Expected: `services`, Actual: `client_info`
4. `प्रमुख उपलब्धियां और रिकॉर्ड` (hi) -> Expected: `achievements`, Actual: `projects`
5. `How much does an MVP project cost?` (en) -> Expected: `client_info`, Actual: `services`
6. `प्रोजेक्ट का कितना खर्च होगा?` (hi) -> Expected: `client_info`, Actual: `projects`
7. `Project cost kitna aayega? Quotation estimator` (hinglish) -> Expected: `client_info`, Actual: `services`
8. `Are you available for immediate hire?` (en) -> Expected: `availability`, Actual: `recruiter_info`
9. `क्या आप काम के लिए उपलब्ध हैं?` (hi) -> Expected: `availability`, Actual: `experience`
10. `संपर्क अनुभाग पर जाएं` (hi) -> Expected: `navigation`, Actual: `contact`
11. `Contact section pe scroll karo / Le chalo` (hinglish) -> Expected: `navigation`, Actual: `contact`
12. `Switch to corporate accountant view` (en) -> Expected: `filter_toggles`, Actual: `services`
13. `अकाउंटेंट मोड चालू करें` (hi) -> Expected: `filter_toggles`, Actual: `fallback`
14. `Accountant mode on karo / Filter lagao` (hinglish) -> Expected: `filter_toggles`, Actual: `services`
15. `What can I ask you about?` (en) -> Expected: `suggestions`, Actual: `services`
16. `मैं क्या पूछ सकता हूँ?` (hi) -> Expected: `suggestions`, Actual: `fallback`
17. `Where are you located in India?` (en) -> Expected: `faq`, Actual: `projects`
18. `आप भारत में कहाँ स्थित हैं?` (hi) -> Expected: `faq`, Actual: `fallback`
19. `Kaha rehte ho? Office location kya hai?` (hinglish) -> Expected: `faq`, Actual: `contact`
20. `kuch bhi ulta seedha` (hinglish) -> Expected: `ambiguous`, Actual: `services`

### Observation 1.2: Unicode Devanagari Word Boundary (`\b`) Incompatibility
In `src/utils/portfolioAssistantEngine.js`, lines 417–432:
```javascript
const INTENT_PATTERNS = {
  navigation: /\b(navigate|navigate to|go to|scroll to|jump to|take me to|open section|scroll down to|ले चलो|सेक्शन खोलो|जाओ)\b/i,
  filter_toggles: /\b(switch role|change track|switch track|switch to accountant|switch to mis|switch to vibe|switch to other|switch to overview|recruiter mode|client mode|marriage mode|मोड बदलो|ट्रैक बदलो|चेंज रोल)\b/i,
  marriage_bio: /\b(marriage|matrimonial|biodata|family|father|birth year|shadi|vivah|kundali|gotra|caste|parents|शादी|विवाह|पारिवारिक|माता-पिता|पिता का नाम|बायोडाटा)\b/i,
  recruiter_info: /\b(resume|cv|biodata download|download resume|hire|recruiter|notice period|job offer|full time|interview|salary|ctc|compensation|hiring|रिज्यूमे|सीवी|हायरिंग|नौकरी)\b/i,
  services: /\b(services|offerings|consulting|consultation|tax filing karwana|fees|pricing|cost|quotation|quote|rate|charges|charge|kharcha|kitna paisa|kitna charge|सेवाएं|कंसल्टेंसी|शुल्क|फीस|खर्चा|कीमत|कोटेशन)\b/i,
  contact: /\b(contact|phone|email|whatsapp|call|address|location|reach out|office|kaise contact karein|sampark|संपर्क|फोन|व्हाट्सएप|ईमेल|पता|नंबर)\b/i,
  availability: /\b(available|availability|working hours|timings|timing|open for work|freelance available|when can you start|kab baat karein|office hours|उपलब्धता|समय|कब बात करें|वर्किंग आवर्स)\b/i,
  client_info: /\b(client|freelance|contract|sla|timeline|turnaround|delivery time|client work|terms|फ्रीलांस|क्लाइंट|डिलीवरी)\b/i,
  achievements: /\b(achievements|metrics|stats|records|50000|enrolled|500\+|reconciled|awards|milestones|numbers|volume|उपलब्धियां|रिकॉर्ड|आंकड़े)\b/i,
  experience: /\b(experience|work history|career|jobs|past companies|tenure|kahan kaam kiya|kitne saal ka experience|अनुभव|करियर|कार्य इतिहास)\b/i,
  skills: /\b(skills|tech stack|tools|tally|excel|gst|react|python|cursor|powerbi|proficiencies|competencies|kya skills hai|कौशल|टूल्स|तकनीक|हुनर)\b/i,
  projects: /\b(projects|case study|case studies|portfolio work|kaun se project|kya banaya hai|project 01|project 02|case study 08|प्रोजेक्ट्स|केस स्टडी|काम दिखाओ)\b/i,
  roles: /\b(who is atul|who are you|about atul|tell me about yourself|roles|background|profiles|kaun hai atul|kya kaam karte ho|roles batao|कौन है अतुल|प्रोफाइल|परिचय|भूमिकाएं)\b/i,
  suggestions: /\b(help|what can you do|kya pooch sakte hain|menu|options|suggestions|madad|मदद|सुझाव|गाइड|हेल्प)\b/i,
  ambiguous: /^(hi|hello|hey|namaste|namaskar|ok|okay|test|greetings|good morning|good afternoon|good evening|hey there|नमस्ते|नमस्कार|हैलो)$/i
};
```
In JavaScript regular expressions, `\b` matches an ASCII word boundary: `(?<=\w)(?!\w)|(?<!\w)(?=\w)` where `\w` is strictly `[A-Za-z0-9_]`.
Because Devanagari characters (`\u0900-\u097F`) are non-word characters (`\W`), the boundary between a space (`\W`) and a Devanagari character (`\W`) is NOT a word boundary.
Direct execution test:
```javascript
const r1 = /\bभूमिकाएं\b/i;
r1.test('अतुल की भूमिकाएं क्या हैं'); // => false!
```
Every Hindi keyword inside `\b( ... )\b` fails to match unless it was previously expanded to an ASCII string by `HINDI_KEYWORD_MAP`.
Furthermore, `HINDI_KEYWORD_MAP` (lines 224–249) omits: `भूमिकाएं`, `भूमिका`, `उपलब्धियां`, `उपलब्धि`, `सेवाएं`, `मोड`, `सुझाव`, `मदद`, `ले चलो`, `जाओ`. Thus, none of those intents can trigger on Hindi queries.

### Observation 1.3: Fallback Dialect Parity Violation
In `src/utils/portfolioAssistantEngine.js`, line 1128:
```javascript
      return `I couldn't find a direct record for "${query}" in Atul's verified portfolio index. To prevent any hallucinated information, I only share authentic facts from Atul's certified records.\n\nYou can explore his verified work or connect with him directly:`;
```
When `queryAssistant('अतुल की भूमिकाएं क्या हैं?')` falls back to `fallback`, it returns:
`lang: 'hi'` but `text`: English fallback text (`I couldn't find a direct record for...`).
This directly breaks requirement R1: "Natural language detection for English, Hindi, and Hinglish queries, returning responses in the matched dialect/language."

### Observation 1.4: Verified Compliant Features
1. **Linter & Test Infrastructure**: `oxlint` executed in 29ms with 0 warnings, 0 errors. All 38 suites in `npm test` execute and return code 0.
2. **Offline Safety**: 100 consecutive queries executed with zero external HTTP or network egress.
3. **Session Persistence**: Session-scoped storage with memory cache, SSR safety, and 1-click Clear Chat correctly resets conversation state.
4. **WCAG 2.2 AA in `AIChatWidget.jsx`**: Roving tabindex on suggestion chips, ARIA live regions for screen readers, >=44px touch targets on buttons, Escape key listener with focus restoration.
5. **Event Contracts**: `portfolio:open-case-study` and `portfolio:switch-contact-tab` dispatch correct payloads matching subscribers in `App.jsx` and `ContactSection.jsx`.
6. **Search Scoring**: Weighted scoring (+60 title, +40 tags, +25 category, +10 body, +50 phrase) and 4-phase dynamic relaxation correctly ranks relevant catalog items when invoked.

---

## 2. Logic Chain

1. **Step 1**: Dispatched requirement was to verify 16 core intents classification across English, Hindi, and Hinglish, weighted search, authoritative FAQ, and action triggers per `ORIGINAL_REQUEST.md`.
2. **Step 2**: Examining `scripts/test-portfolio-assistant.js` Suite 2 showed that the test suite claims to test 48 queries across 16 intents, but omitted asserting `res.intent === tc.intent`.
3. **Step 3**: Re-running the 48 queries with actual intent assertions demonstrated that 20 of the 48 queries failed to classify as expected.
4. **Step 4**: Examining the root cause in `src/utils/portfolioAssistantEngine.js` revealed that `\b` ASCII word boundaries in `INTENT_PATTERNS` prevent Devanagari words from matching. Furthermore, key Hindi words were absent from `HINDI_KEYWORD_MAP`.
5. **Step 5**: Because `fallback` returns hardcoded English text regardless of language, Hindi queries that fall back receive English responses.
6. **Step 6**: Per the mandatory system review rules:
   > "When reviewing work, actively check for integrity violations:
   > - Evidence of self-certifying work without genuine independent verification
   > If you detect ANY of these patterns, your verdict MUST be REQUEST_CHANGES with a Critical finding tagged as INTEGRITY VIOLATION. Do NOT approve work that cheats, regardless of test scores."
7. **Step 7**: Therefore, the verdict must be `REQUEST_CHANGES` with a Critical finding tagged as `INTEGRITY VIOLATION`.

---

## 3. Caveats

- **No Caveats**. The review was exhaustive, inspecting both source code and runtime behavior across 48 matrix test queries, edge cases (XSS, long queries, whitespace, special symbols), accessibility markup, and build performance.

---

## 4. Conclusion

**Verdict**: **REQUEST_CHANGES**

### Findings Summary

#### [Critical - INTEGRITY VIOLATION] Finding 1: Self-Certifying Assertion Omission in Test Suite 2
- **What**: `scripts/test-portfolio-assistant.js` asserts only `res.language` and `res.text.length > 10` in Suite 2, bypassing assertion of `res.intent === tc.intent`.
- **Where**: `scripts/test-portfolio-assistant.js:200-215`
- **Why**: Allows 20 out of 48 queries to fail intent classification silently while reporting 100% test pass (99/99).
- **Suggestion**:
  Update Suite 2 in `scripts/test-portfolio-assistant.js` to assert:
  ```javascript
  const expectedIntent = tc.intent === 'faq' ? 'faq_match' : tc.intent;
  assert(
    res.intent === expectedIntent || (expectedIntent === 'ambiguous' && res.intent === 'fallback'),
    `Query "${tc.q}" expected intent "${expectedIntent}", got "${res.intent}"`
  );
  ```

#### [Critical] Finding 2: Devanagari Word Boundary (`\b`) Regex Failure
- **What**: `INTENT_PATTERNS` regexes fail on all Devanagari Hindi keywords because JavaScript `\b` only matches ASCII `[A-Za-z0-9_]`.
- **Where**: `src/utils/portfolioAssistantEngine.js:417-433`
- **Why**: Hindi queries like `अतुल की भूमिकाएं क्या हैं?`, `प्रमुख उपलब्धियां और रिकॉर्ड`, `अकाउंटेंट मोड चालू करें` fail regex matching and fall back.
- **Suggestion**:
  1. Add missing Devanagari keywords to `HINDI_KEYWORD_MAP` (`भूमिकाएं`, `भूमिका`, `उपलब्धियां`, `रिकॉर्ड`, `सेवाएं`, `मोड`, `सुझाव`, `मदद`, `ले चलो`, `जाओ`, `कहाँ`).
  2. For `INTENT_PATTERNS`, separate English/Hinglish ASCII patterns (which use `\b`) from Devanagari patterns (which can match via non-word or start/end boundaries without `\b`, or match normalized ASCII tokens produced by `HINDI_KEYWORD_MAP`).

#### [Major] Finding 3: Fallback Response Lacks Hindi & Hinglish Parity
- **What**: When intent is `fallback`, `buildIntentText('fallback', ...)` returns English text even when `lang === 'hi'`.
- **Where**: `src/utils/portfolioAssistantEngine.js:1128`
- **Why**: Violates multilingual parity requirement; Hindi users receive English fallback explanation.
- **Suggestion**: Add Hindi and Hinglish branches for `fallback` in `buildIntentText`:
  ```javascript
  if (lang === 'hi') {
    return `मुझे अतुल के सत्यापित पोर्टफोलियो इंडेक्स में "${query}" के लिए कोई सीधा रिकॉर्ड नहीं मिला। किसी भी प्रकार की गलत जानकारी से बचने के लिए, मैं केवल प्रमाणित जानकारी ही साझा करता हूँ।\n\nआप नीचे दिए गए विकल्पों से उनका काम देख सकते हैं या सीधे संपर्क कर सकते हैं:`;
  }
  ```

#### [Major] Finding 4: Precedence and Keyword Collision in Filter Toggles and Navigation
- **What**: Queries such as `Switch to corporate accountant view` fall through `filter_toggles` because the regex only matches literal `switch to accountant`. Natural variations like `Switch to corporate accountant view` misclassify into `services`. Similarly, `संपर्क अनुभाग पर जाएं` misclassifies into `contact` rather than `navigation`.
- **Where**: `src/utils/portfolioAssistantEngine.js:418-420, 488-510`
- **Why**: Rigid regex matching and precedence ordering cause natural conversational queries to route to unintended intents.
- **Suggestion**: Make `filter_toggles` more flexible (e.g. `/\b(switch|change|toggle).*(role|track|accountant|mis|vibe|other|overview|mode)\b/i`) and refine precedence so navigation commands targeting sections are identified prior to entity keyword fallback.

---

## 5. Verification Method

To independently reproduce and verify this finding:
1. Run the existing test suite:
   ```bash
   npm run test:portfolio-assistant
   ```
   Note that it reports 99 passed, 0 failed.
2. Inspect `scripts/test-portfolio-assistant.js` lines 197–215. Observe that `res.intent === tc.intent` is NOT asserted.
3. Run the true intent assertion test in Node:
   ```bash
   node -e "
   import('./src/utils/portfolioAssistantEngine.js').then(m => {
     const res1 = m.queryAssistant('अतुल की भूमिकाएं क्या हैं?');
     console.log('Roles HI:', res1.intent, res1.text.slice(0, 50));
     const res2 = m.queryAssistant('Switch to corporate accountant view');
     console.log('Filter Toggle EN:', res2.intent);
   });
   "
   ```
4. Verify that `res1.intent` returns `fallback` and English text, and `res2.intent` returns `services`.
