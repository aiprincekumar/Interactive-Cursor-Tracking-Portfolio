﻿# Department 08: Quality Assurance, Testing & Verification (गुणवत्ता आश्वासन एवं परीक्षण विभाग)

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/universal_rules.md)

---

## 🧪 1. विभाग का मिशन एवं कार्यक्षेत्र (Mission & Department Scope)

गुणवत्ता आश्वासन, परीक्षण एवं सत्यापन विभाग (QA & Testing Dept) संपूर्ण सिस्टम की कार्यक्षमता, स्थिरता, रिग्रेशन रोकथाम और उत्पादन-स्तरीय गुणवत्ता का अंतिम पहरेदार है। यह विभाग यूनिट टेस्टिंग, इंटीग्रेशन टेस्टिंग, एंड-टू-एंड (E2E) ऑटोमेशन, TDD कार्यप्रणाली और स्वतंत्र सत्यापन सब-एजेंट्स (Verification Subagents) के संचालन का नेतृत्व करता है।

---

## 🎯 2. टेस्ट-ड्रिवेन डेवलपमेंट एवं टेस्ट पिरामिड मानक (TDD & Test Pyramid)

### 2.1 टेस्ट पिरामिड संरचना (The Test Pyramid)
- **यूनिट टेस्ट्स (70%):** तीव्र गति वाले, अलग-थलग (isolated) टेस्ट्स जो व्यक्तिगत फ़ंक्शन्स, यूटिलिटीज़ और शुद्ध बिजनेस लॉजिक की जांच करते हैं (Vitest / Jest / pytest)।
- **इंटीग्रेशन टेस्ट्स (20%):** डेटाबेस, API एंडपॉइंट्स और मिडलवेयर के अंतर्संबंधों की जांच (Supertest, Testcontainers)।
- **E2E टेस्ट्स (10%):** महत्वपूर्ण यूजर यात्राओं (Critical User Journeys) का वास्तविक ब्राउज़र में परीक्षण (Playwright / Cypress)।

### 2.2 TDD कार्यप्रणाली (Red-Green-Refactor)
1. **Red (असफल टेस्ट):** नया कोड लिखने से पहले एक स्पष्ट रूप से असफल होने वाला टेस्ट केस लिखें जो अपेक्षित व्यवहार को परिभाषित करता है।
2. **Green (सफल कोड):** टेस्ट को पास कराने के लिए केवल आवश्यक न्यूनतम कोड लिखें।
3. **Refactor (सफाई एवं संवर्धन):** कोड और टेस्ट को स्वच्छ, मॉड्यूलर और प्रदर्शन-अनुकूल बनाएं बिना किसी व्यवहार को तोड़े।

```typescript
// उदाहरण: Vitest / Jest यूनिट टेस्ट TDD पैटर्न
import { describe, it, expect } from 'vitest';
import { calculateOrderDiscount } from './pricing';

describe('calculateOrderDiscount', () => {
  it('should apply 10% discount for orders over $100', () => {
    const total = calculateOrderDiscount(120, 'STANDARD_USER');
    expect(total).toBe(108);
  });

  it('should apply 20% discount for VIP users regardless of amount', () => {
    const total = calculateOrderDiscount(50, 'VIP_USER');
    expect(total).toBe(40);
  });

  it('should throw error for negative order amount', () => {
    expect(() => calculateOrderDiscount(-10, 'STANDARD_USER')).toThrow('Invalid amount');
  });
});
```

---

## 🎭 3. Playwright E2E टेस्टिंग मानक (E2E Test Automation Standards)

- **Page Object Model (POM):** UI तत्वों और क्रियाओं को दोबारा इस्तेमाल योग्य पेज ऑब्जेक्ट्स में रखें।
- **मजबूत चयनकर्ता (Resilient Selectors):** अस्थिर CSS क्लासों के बजाय `data-testid` या एक्सेसिबल रोल्स (`getByRole('button', { name: /submit/i })`) का उपयोग करें।
- **शून्य-फ्लेकी नीति (Zero-Flakiness):** कभी भी हार्डकोडेड `sleep` या `waitForTimeout(5000)` न लिखें; सदैव वेब-फर्स्ट असर्शन्स (`await expect(locator).toBeVisible()`) का उपयोग करें।

---

## 🕵️ 4. अनिवार्य स्वतंत्र सत्यापन सब-एजेंट प्रोटोकॉल (Rule 1 & Rule 13 Compliance)

- **स्वतंत्र सत्यापन का नियम:** कार्य को पूरा घोषित करने से पहले, मेन एजेंट (CEO) अनिवार्य रूप से एक स्वतंत्र **QA/Verification Subagent** को तैनात करेगा।
- **सत्यापन सब-एजेंट की जांच चेकलिस्ट:**
  - [ ] सभी यूनिट, इंटीग्रेशन और E2E टेस्ट्स 100% पास हैं।
  - [ ] कोड कवरेज न्यूनतम 80% सीमा को पूरा करता है।
  - [ ] टाइपचेक (`tsc --noEmit`) और लिंट में शून्य त्रुटियां हैं।
  - [ ] कोई अप्रत्याशित कंसोल एरर या अनहैंडल्ड प्रॉमिस रिजेक्शन नहीं है।

---

## 🧑‍💼 5. विभागीय पद एवं समर्पित सब-एजेंट्स (Departmental Roles & Subagents)

विभागीय कार्य-विभाजन और उद्यम विशेषज्ञता (Specialization of Labor) सुनिश्चित करने के लिए 4 समर्पित पद (Enterprise Job Roles) और उनके अनुरूप सब-एजेंट्स परिभाषित हैं:

### 5.1 SDET Automation Test Lead (Automation Test Engineer)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Automation Test Engineer`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - टेस्ट-ड्रिवन डेवलपमेंट (TDD) कार्यप्रणाली का नेतृत्व और प्रवर्तन करना।
  - Vitest/Jest द्वारा यूनिट और इंटीग्रेशन टेस्ट सूट्स का निर्माण और रखरखाव।
  - कठोर >=85% शाखा कोड कवरेज सीमा लागू करना और टेस्ट फिक्स्चर्स तैयार करना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Automation Test Engineer",
  "Prompt": "Drive test-driven development (TDD), construct comprehensive unit and integration test suites using Vitest/Jest, enforce >=85% branch coverage, and build test fixtures."
}
```

### 5.2 E2E & Browser Automation Engineer (E2E QA Engineer)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `E2E QA Engineer`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - पेज ऑब्जेक्ट मॉडल (POM) का उपयोग कर विश्वसनीय Playwright E2E रिग्रेशन सूट्स बनाना।
  - क्रॉस-ब्राउज़र (Chromium, Firefox, WebKit) और मोबाइल व्यूपोर्ट्स पर यूजर जर्नी सत्यापन।
  - विफल टेस्ट्स के लिए वीडियो रिकॉर्डिंग, स्क्रीनशॉट और ट्रेस आर्टिफैक्ट्स कैप्चर करना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "E2E QA Engineer",
  "Prompt": "Develop reliable Playwright end-to-end regression suites using the Page Object Model, validate user journeys across browsers, and capture trace artifacts for failures."
}
```

### 5.3 Performance & Load Testing Specialist (Load Test Engineer)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Load Test Engineer`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - k6 और Artillery द्वारा उच्च-समवर्ती (High-Concurrency) लोड और स्ट्रेस टेस्ट्स तैयार करना।
  - लेटेंसी पर्सेंटाइल्स (p90, p95, p99) और सिस्टम थ्रूपुट की विस्तृत मैपिंग करना।
  - सिस्टम टूटने की सीमा और परफॉर्मेंस बॉटलनेक्स की सटीक पहचान व रिपोर्टिंग।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Load Test Engineer",
  "Prompt": "Design and execute k6/Artillery load testing scripts, simulate high-concurrency peak traffic, measure latency percentiles (p95/p99), and identify system bottlenecks."
}
```

### 5.4 Exploratory & Edge-Case QA Analyst (Exploratory QA Specialist)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Exploratory QA Specialist`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - एडवर्सरियल एक्सप्लोरेटरी टेस्टिंग और सीमा-मूल्य विसंगतियों (Boundary Injections) का परीक्षण।
  - समवर्ती परिस्थितियों में रेस कंडीशन्स और अनपेक्षित इनपुट्स की जांच करना।
  - पुनरुत्पादक (Reproducible) डिफेक्ट रिपोर्ट्स और नकारात्मक स्वीकृति परिदृश्यों का दस्तावेज़ीकरण।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Exploratory QA Specialist",
  "Prompt": "Conduct adversarial exploratory testing, inject malformed boundary payloads, probe concurrency race conditions, and document reproducible edge-case defect reports."
}
```


---

## 🚦 6. विभाग हैंडऑफ एवं सत्यापन गेट्स (Department Handoff Gates)

1. **Gate 8-A (टेस्ट पास दर):** सभी टेस्ट 100% ग्रीन होने चाहिए।
2. **Gate 8-B (सत्यापन रिपोर्ट):** स्वतंत्र सत्यापन सब-एजेंट की औपचारिक स्वीकृति रिपोर्ट प्रस्तुत हो।
3. **अगले विभागों को हैंडऑफ:** QA पास होने पर ➔ **Dept 09: Performance** और **Dept 12: DevOps**।
