﻿# Department 09: Performance Engineering & Web Vitals (परफॉर्मेंस एवं वेब वाइटल्स विभाग)

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/universal_rules.md)

---

## ⚡ 1. विभाग का मिशन एवं कार्यक्षेत्र (Mission & Department Scope)

परफॉर्मेंस इंजीनियरिंग एवं वेब वाइटल्स विभाग (Performance & Web Vitals Dept) एप्लिकेशन की गति, प्रतिक्रियाशीलता (Responsiveness), बंडल साइज़, मेमोरी प्रबंधन और Google Core Web Vitals के कड़े मानकों का संरक्षक है।

यह विभाग सुनिश्चित करता है कि सिस्टम कम बैंडविड्थ और सामान्य हार्डवेयर पर भी सहज, लैग-फ्री और त्वरित अनुभव प्रदान करे।

---

## 📊 2. कोर वेब वाइटल्स सीमाएं एवं मानक (Core Web Vitals Thresholds)

प्रत्येक फ्रंटएंड एप्लिकेशन को निम्नलिखित Google उद्योग मानकों को पूरा करना अनिवार्य है:

| मेट्रिक (Metric) | पूर्ण नाम (Full Name) | आदर्श सीमा (Good / Target) | सुधारात्मक सीमा (Needs Work) |
| :--- | :--- | :--- | :--- |
| **LCP** | Largest Contentful Paint (लोडिंग गति) | **< 2.5 सेकंड** | 2.5s - 4.0s |
| **INP** | Interaction to Next Paint (इंटरैक्शन रिस्पॉन्स) | **< 200 मिलीसेकंड** | 200ms - 500ms |
| **CLS** | Cumulative Layout Shift (दृश्य स्थिरता) | **< 0.1** | 0.1 - 0.25 |
| **TTFB** | Time to First Byte (सर्वर रिस्पॉन्स) | **< 800 मिलीसेकंड** | 800ms - 1800ms |

---

## 📦 3. बंडल साइज़ बजट एवं कोड-स्प्लिटिंग मानक (Bundle Budget & Optimization)

### 3.1 बंडल बजट सीमाएं (Bundle Size Budget)
- प्रारंभिक जावास्क्रिप्ट बंडल (Initial JS Chunk): अधिकतम **150 KB gzipped**।
- व्यक्तिगत पेजों के डायनामिक चंक्स: अधिकतम **50 KB gzipped**।
- भारी थर्ड-पार्टी लाइब्रेरीज़ (उदा. Lodash, Moment.js) के स्थान पर हल्के विकल्पों (उदा. `date-fns`, नेटिव ES6 फ़ंक्शन्स) का उपयोग करें।

### 3.2 एसेट ऑप्टिमाइजेशन
- सभी छवियों को आधुनिक फॉर्मेट्स (`WebP`, `AVIF`) में कंप्रेस करें।
- लेआउट शिफ्ट (CLS) से बचने के लिए प्रत्येक `<img>` और विडिओ पर स्पष्ट `width` और `height` या `aspect-ratio` गुण निर्दिष्ट करें।
- ऑफस्क्रीन छवियों के लिए `loading="lazy"` का अनिवार्य उपयोग।

---

## 🧠 4. हीप स्नैपशॉट एवं मेमोरी लीक डिबगिंग (Memory Leak Prevention & Heap Auditing)

### 4.1 मेमोरी लीक के प्रमुख कारण और समाधान
1. **डिटैच्ड DOM नोड्स (Detached DOM Nodes):** जावास्क्रिप्ट संदर्भों द्वारा हटाए गए DOM तत्वों को मेमोरी में रोके रखना।
2. **अनक्लीयरड ईवेंट लिसनर्स:** कंपोनेंट अनमाउंट होने के बाद भी ग्लोबल `window` या `document` ईवेंट्स का सक्रिय रहना।
3. **अबाधित टाइमर्स एवं बैकग्राउंड पोलर्स:** `setInterval` या अनसब्स्क्राइब्ड RxJS/WebSocket कनेक्शन।

### 4.2 3-स्नैपशॉट हीप ऑडिट प्रक्रिया
- **Snapshot 1 (Base):** पेज लोड होने के बाद।
- **Snapshot 2 (Action):** यूजर इंटरैक्शन (मोडल खोलना, डेटा ग्रिड लोड करना)।
- **Snapshot 3 (Clean):** मोडल बंद करना या पेज से बाहर जाना।
- **सत्यापन:** Snapshot 3 में ऑब्जेक्ट काउंट को Snapshot 1 के बराबर लौटना चाहिए। यदि ऑब्जेक्ट्स में निरंतर वृद्धि होती है, तो उसे मेमोरी लीक माना जाएगा।

---

## 🧑‍💼 5. विभागीय पद एवं समर्पित सब-एजेंट्स (Departmental Roles & Subagents)

विभागीय कार्य-विभाजन और उद्यम विशेषज्ञता (Specialization of Labor) सुनिश्चित करने के लिए 4 समर्पित पद (Enterprise Job Roles) और उनके अनुरूप सब-एजेंट्स परिभाषित हैं:

### 5.1 Core Web Vitals Specialist (Web Vitals Engineer)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Web Vitals Engineer`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - Google Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1) का कड़ा ऑडिट एवं अनुकूलन।
  - क्रिटिकल रेंडरिंग पाथ का अनुकूलन और रेंडर-ब्लॉकिंग रिसोर्सेज का उन्मूलन।
  - छवियों, फोंट्स और लेआउट शिफ्ट्स के लिए रिसोर्स प्रायरिटाइजेशन ट्यूनिंग।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Web Vitals Engineer",
  "Prompt": "Audit and optimize Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1), optimize critical rendering paths, and tune image and font resource prioritization."
}
```

### 5.2 Heap Snapshot & Memory Leak Specialist (Memory Leak Specialist)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Memory Leak Specialist`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - Chrome DevTools हीप स्नैपशॉट ऑडिट और मेमोरी प्रोफाइलिंग निष्पादित करना।
  - डिटेच्ड DOM एलिमेंट्स, अनक्लोज्ड इवेंट लिसनर्स और अनबाउंडेड कैशिंग का निवारण।
  - गारबेज कलेक्शन बॉटलनेक्स को समाप्त कर दीर्घकालिक मेमोरी लीक्स की रोकथाम करना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Memory Leak Specialist",
  "Prompt": "Perform Chrome DevTools heap snapshot audits, detect detached DOM elements and unclosed event listeners, resolve garbage collection bottlenecks, and prevent memory leaks."
}
```

### 5.3 Bundle Size, Code-Splitting & Asset Optimizer (Bundle Optimization Engineer)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Bundle Optimization Engineer`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - बंडल विज़ुअलाइज़र्स द्वारा बंडल संरचना का विश्लेषण और सख्त बजट सीमा (<200KB initial) लागू करना।
  - रूट-बेस्ड और कंपोनेंट-लेवल डायनामिक कोड-स्प्लिटिंग (`React.lazy`) और ट्री-शेकिंग।
  - आधुनिक इमेज फॉर्मेट्स (AVIF/WebP) और Gzip/Brotli एसेट कंप्रेशन का प्रबंधन।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Bundle Optimization Engineer",
  "Prompt": "Analyze bundle composition with bundle visualizers, enforce strict budget limits (<200KB), configure route-based code splitting and tree-shaking, and compress static assets."
}
```

### 5.4 Network Latency, CDN & Edge Caching Engineer (Latency Optimization Engineer)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Latency Optimization Engineer`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - CDN एज-कैशिंग हेडर (stale-while-revalidate, max-age) और इनवैलिडेशन नियम कॉन्फ़िगर करना।
  - HTTP/2 एवं HTTP/3 मल्टीप्लेक्सिंग और DNS प्री-कनेक्ट / प्रीलोड रिसोर्स हिंट्स लागू करना।
  - Time to First Byte (TTFB) को न्यूनतम करना और नेटवर्क राउंड-ट्रिप्स का अनुकूलन करना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Latency Optimization Engineer",
  "Prompt": "Configure CDN edge caching headers (stale-while-revalidate), optimize HTTP/2 & HTTP/3 multiplexing, implement resource prefetching, and minimize Time to First Byte (TTFB)."
}
```


---

## 🚦 6. विभाग हैंडऑफ एवं सत्यापन गेट्स (Department Handoff Gates)

1. **Gate 9-A (Lighthouse स्कोर):** परफॉर्मेंस स्कोर न्यूनतम **90/100** होना चाहिए।
2. **Gate 9-B (बंडल ऑडिट):** `npm run build` आउटपुट में कोई भी चंक बजट सीमा से अधिक न हो।
3. **अगले विभागों को हैंडऑफ:** परफॉर्मेंस प्रमाणित होने पर ➔ **Dept 10: Security** और **Dept 12: DevOps**।
