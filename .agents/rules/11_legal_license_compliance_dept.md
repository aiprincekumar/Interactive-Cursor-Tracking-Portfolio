﻿# Department 11: Legal, Licensing & Compliance (कानूनी, लाइसेंस एवं अनुपालन विभाग)

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/universal_rules.md)

---

## ⚖️ 1. विभाग का मिशन एवं कार्यक्षेत्र (Mission & Department Scope)

कानूनी, सॉफ्टवेयर लाइसेंस एवं विनियामक अनुपालन विभाग (Legal & Compliance Dept) ओपन-सोर्स लाइसेंसिंग अनुपालन, बौद्धिक संपदा सुरक्षा, SPDX पहचानकर्ताओं, थर्ड-पार्टी एट्रिब्यूशन और वैश्विक डेटा गोपनीयता नियमों (GDPR, CCPA, HIPAA) के पालन का सर्वोच्च संरक्षक है।

यह विभाग सुनिश्चित करता है कि सॉफ्टवेयर में उपयोग की जाने वाली प्रत्येक लाइब्रेरी कानूनी रूप से सुरक्षित, संगत और अनुपालन-मुक्त हो।

---

## 📜 2. ओपन-सोर्स लाइसेंसिंग नीति एवं वर्गीकरण (Open-Source License Governance)

### 2.1 स्वीकृत अनुमेय लाइसेंस (Permissive Licenses - Approved for All)
- **MIT License:** अत्यधिक अनुमेय, न्यूनतम प्रतिबंध।
- **Apache 2.0:** पेटेंट अनुदान और स्पष्ट ट्रेडमार्क सुरक्षा सहित उत्कृष्ट लाइसेंस।
- **BSD 2-Clause / 3-Clause:** अनुमेय एवं सुरक्षित।
- **ISC License:** सरल एवं स्वीकृत।

### 2.2 कड़ाई से प्रतिबंधित कॉपीलेफ्ट लाइसेंस (Copyleft Licenses - Restricted)
- **GPL v2 / GPL v3 एवं AGPL:** जब तक प्रोजेक्ट पूर्णतः ओपन-सोर्स GPL होने का स्पष्ट निर्णय न लिया गया हो, तब तक व्यावसायिक या प्रोप्राइटरी कोडबेस में GPL/AGPL लाइब्रेरीज़ को शामिल करना सख्त वर्जित है (क्योंकि वे संपूर्ण कोडबेस को ओपन-सोर्स करने के लिए बाध्य करते हैं)।
- **LGPL:** केवल तभी अनुमत जब डायनामिक लिंकिंग के रूप में उपयोग किया जाए।

---

## 🏷️ 3. SPDX हेडर एवं एट्रिब्यूशन मैनिफेस्ट (SPDX & Attribution Manifest)

### 3.1 अनिवार्य SPDX हेडर मानक
प्रत्येक मूल स्रोत कोड फ़ाइल के शीर्ष पर मानक SPDX पहचानकर्ता दर्ज होना चाहिए:
```typescript
// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Atul Verma (aiprincekumar). All rights reserved.
```

### 3.2 थर्ड-पार्टी एट्रिब्यूशन (`CREDITS.md` / `NOTICE`)
- प्रोजेक्ट रूट में एक `CREDITS.md` या `NOTICE` फ़ाइल रखी जाएगी जो उपयोग में आने वाली सभी प्रमुख थर्ड-पार्टी लाइब्रेरीज़, उनके लाइसेंस प्रकार और उनके कॉपीराइट धारकों को विधिवत सूचीबद्ध करती है।

---

## 🔒 4. डेटा गोपनीयता एवं नियामक अनुपालन मानक (Data Privacy - GDPR / CCPA)

- **गोपनीयता डिज़ाइन सिद्धांत (Privacy by Design):** उपयोगकर्ताओं का केवल वही व्यक्तिगत डेटा (PII) संग्रहीत करें जो व्यावसायिक कार्यप्रणाली के लिए अपरिहार्य हो।
- **डेटा न्यूनीकरण (Data Minimization):** कभी भी संवेदनशील पहचान (उदा. SSN, आधार, कच्चा क्रेडिट कार्ड डेटा) को बिना कड़े विनियामक अनुपालन के स्टोर न करें।
- **विस्मृति का अधिकार (Right to Be Forgotten):** उपयोगकर्ता के अनुरोध पर उसका संपूर्ण व्यक्तिगत डेटा हटाने या एनॉनिमाइज़ करने की सुगम व्यवस्था हो।

---

## 🧑‍💼 5. विभागीय पद एवं समर्पित सब-एजेंट्स (Departmental Roles & Subagents)

विभागीय कार्य-विभाजन और उद्यम विशेषज्ञता (Specialization of Labor) सुनिश्चित करने के लिए 4 समर्पित पद (Enterprise Job Roles) और उनके अनुरूप सब-एजेंट्स परिभाषित हैं:

### 5.1 Open Source License Compliance Auditor (Open Source License Auditor)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Open Source License Auditor`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - ओपन-सोर्स डिपेंडेंसीज का लाइसेंस संगतता ऑडिट (MIT/Apache बनाम GPL/AGPL)।
  - SPDX लाइसेंस हेडर मैनिफेस्ट और व्यापक `THIRD_PARTY_LICENSES.md` का संकलन।
  - कॉपीलेफ्ट (GPL/AGPL) वायरल संक्रमण और कानूनी मुकदमों की पूर्ण रोकथाम।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Open Source License Auditor",
  "Prompt": "Audit open-source dependencies for license compatibility (MIT/Apache vs GPL/AGPL), generate SPDX manifests, compile THIRD_PARTY_LICENSES.md, and prevent copyleft contamination."
}
```

### 5.2 Data Privacy & Regulatory Compliance Officer (Data Privacy Officer)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Data Privacy Officer`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - GDPR, CCPA और HIPAA के तहत डेटा प्रवाह और गोपनीयता का कानूनी ऑडिट।
  - व्यक्तिगत पहचान योग्य जानकारी (PII) का छद्मनामीकरण (Pseudonymization) और रेस्ट/ट्रांजिट एन्क्रिप्शन।
  - डेटा अवधारण समय-सारिणी (Data Retention) और उपयोगकर्ता सहमति वास्तुकला का प्रबंधन।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Data Privacy Officer",
  "Prompt": "Audit data flows for GDPR/CCPA compliance, enforce PII pseudonymization and encryption-at-rest, define data retention schedules, and manage user consent architectures."
}
```

### 5.3 Intellectual Property & Copyright Auditor (IP Compliance Specialist)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `IP Compliance Specialist`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - सोर्स कोड प्रोवेनेंस और बौद्धिक संपदा (IP) स्वामित्व का कठोर सत्यापन।
  - सभी सोर्स फ़ाइल हेडर्स में आधिकारिक कॉपीराइट नोटिस और एट्रिब्यूशन की पुष्टि।
  - पेटेंट उल्लंघन जोखिम मूल्यांकन और प्रोप्राइटरी सॉफ्टवेयर कोड का संरक्षण।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "IP Compliance Specialist",
  "Prompt": "Verify code provenance and IP ownership, validate intellectual property copyright notices across all source headers, and assess patent infringement risks."
}
```

### 5.4 Export Control & Regulatory Compliance Specialist (Regulatory Compliance Specialist)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Regulatory Compliance Specialist`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - अंतर्राष्ट्रीय सॉफ्टवेयर निर्यात नियंत्रण (EAR / ECCN) और क्रिप्टोग्राफिक वर्गीकरण का ऑडिट।
  - क्षेत्रीय डेटा संप्रभुता (Data Sovereignty) और अंतर्राष्ट्रीय सॉफ्टवेयर वितरण अनुपालन।
  - वैश्विक व्यापार प्रतिबंधों और सैंक्शन्स स्क्रीनिंग नियमों का कड़ा प्रवर्तन।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Regulatory Compliance Specialist",
  "Prompt": "Audit cryptographic implementations for international export compliance (EAR/ECCN classifications), enforce jurisdictional compliance, and ensure sanctions screening."
}
```


---

## 🚦 6. विभाग हैंडऑफ एवं सत्यापन गेट्स (Department Handoff Gates)

1. **Gate 11-A (लाइसेंस स्कैन):** `npx license-checker --onlyAllow "MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC"` बिना उल्लंघन के पास हो।
2. **Gate 11-B (PII ऑडिट):** कोडबेस में किसी भी अनधिकृत PII भंडारण की पुष्टि न हो।
3. **अगले विभाग को हैंडऑफ:** कानूनी अनुमोदन के बाद ➔ **Dept 12: DevOps, Build & Release**।
