﻿# Department 01: Product Requirements & Management (उत्पाद आवश्यकताएं एवं प्रबंधन विभाग)

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/universal_rules.md)

---

## 🎯 1. विभाग का मिशन एवं कार्यक्षेत्र (Mission & Department Scope)

उत्पाद आवश्यकताएं एवं प्रबंधन विभाग (Product Requirements Dept) किसी भी सॉफ्टवेयर विकास चक्र का प्रथम प्रवेश द्वार है। इसका मुख्य उद्देश्य उपयोगकर्ता की अस्पष्ट या जटिल आवश्यकताओं को स्पष्ट, क्रियान्वयन योग्य, तकनीकी रूप से सटीक और सत्यापन योग्य उत्पाद आवश्यकताओं (PRD) और चरणबद्ध कार्ययोजना में रूपांतरित करना है।

---

## 📜 2. मुख्य नियम एवं अनिवार्यताएं (Core Mandates)

### 2.1 वाइब कोडिंग अल्पकालिक कार्यक्षेत्र एवं फेज़ प्रॉम्प्ट्स मानक (Rule 22 Compliance)
- किसी भी जटिल फ़ीचर या प्रोजेक्ट हेतु अल्पकालिक डायरेक्टरी (`vibe_coding_temp/` या प्रोजेक्ट विशिष्ट `temp_prompt/`) में चरणबद्ध प्रॉम्प्ट्स तैयार किए जाएंगे:
  - `Phase_01_PRD_and_Requirements.md`: व्यावसायिक आवश्यकताएं, यूजर स्टोरीज, स्कोप सीमाएं।
  - `Phase_02_Technical_Architecture.md`: तकनीकी रूपरेखा व घटक संबंध।
  - `Phase_03_Implementation_Tasks.md`: विस्तृत चेकलिस्ट व कोड टास्क।
- **अल्पकालिकता एवं स्वच्छता (Ephemeral Lifecycle):** कार्य पूर्ण होते ही इन अस्थायी प्रॉम्प्ट्स की मुख्य जानकारियाँ [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) और `changes_log/` में सिंक करके अस्थायी फाइलों को स्वतः स्वच्छ (clean) किया जाएगा।

### 2.2 अनिवार्य प्री-टास्क अलाइनमेंट एवं इंटरव्यू प्रोटोकॉल (Rule 24: /grill-me Standard)
- जब भी यूजर की आवश्यकता में अस्पष्टता, बहु-विकल्पीय डिज़ाइन निर्णय, या संभावित तकनीकी असमंजस हो, तो अनुमान लगाने के बजाय इंटरैक्टिव प्रश्नोत्तरी (`/grill-me` या `ask_question`) के माध्यम से यूजर से तुरंत स्पष्टीकरण प्राप्त किया जाएगा।
- स्पष्टीकरण के बिना कोई भी महत्वपूर्ण व्यावसायिक या आर्किटेक्चरल निर्णय स्वतः लागू नहीं किया जाएगा।

---

## 📋 3. उत्पाद आवश्यकता दस्तावेज़ संरचना (Standard PRD Template)

प्रत्येक PRD दस्तावेज़ निम्नलिखित मानकीकृत संरचना में तैयार किया जाएगा:

```markdown
# [प्रोजेक्ट/फीचर नाम] - उत्पाद आवश्यकता दस्तावेज़ (PRD)

## 1. व्यावसायिक पृष्ठभूमि एवं समस्या विवरण (Problem Statement & Context)
- हल की जाने वाली मुख्य समस्या क्या है?
- लक्षित उपयोगकर्ता (Target Audience / Personas) कौन हैं?
- सफलता के मुख्य व्यावसायिक मेट्रिक्स (KPIs) क्या होंगे?

## 2. स्कोप सीमाएं (Scope Boundaries)
- **In-Scope (क्या सम्मिलित है):** इस रिलीज में जोड़े जाने वाले निश्चित फीचर्स।
- **Out-of-Scope (क्या सम्मिलित नहीं है):** भविष्य के लिए छोड़े गए या जानबूझकर छोड़े गए विषय।

## 3. कार्यात्मक आवश्यकताएं (Functional Requirements - FR)
- **FR-01:** उपयोगकर्ता प्रमाणीकरण एवं प्रोफाइल प्रबंधन।
- **FR-02:** डेटा विज़ुअलाइज़ेशन एवं फ़िल्टरिंग।

## 4. गैर-कार्यात्मक आवश्यकताएं (Non-Functional Requirements - NFR)
- परफॉरमेंस: पेज लोड समय < 2.0s, API रिस्पॉन्स < 200ms।
- स्केलेबिलिटी: 10,000 दैनिक सक्रिय उपयोगकर्ताओं तक सुचारू संचालन।
- सुरक्षा: OWASP टॉप 10 अनुपालन, रोल-बेस्ड एक्सेस कंट्रोल (RBAC)।

## 5. स्वीकृति मानदंड (Acceptance Criteria - Given/When/Then)
- **Scenario 1:** सफल यूजर लॉगिन
  - **Given:** उपयोगकर्ता लॉगिन पेज पर है और वैध क्रेडेंशियल्स दर्ज करता है।
  - **When:** उपयोगकर्ता "Login" बटन पर क्लिक करता है।
  - **Then:** सिस्टम डैशबोर्ड प्रदर्शित करता है और वैध JWT टोकन जारी करता है।
```

---

---

## 🎯 4. यूजर स्टोरी एवं स्वीकृति मानदंड ढांचा (User Story & Acceptance Framework)

- **INVEST सिद्धांत:** प्रत्येक यूजर स्टोरी Independent (स्वतंत्र), Negotiable (परक्राम्य), Valuable (मूल्यवान), Estimable (अनुमान योग्य), Small (लघु), और Testable (परीक्षण योग्य) होनी चाहिए।
- **MoSCoW प्राथमिकता निर्धारण:** प्रत्येक आवश्यकता को Must have (अनिवार्य), Should have (महत्वपूर्ण), Could have (वैकल्पिक), या Won't have (भविष्य के लिए) के रूप में स्पष्ट वर्गीकृत किया जाएगा।
- **कठोर Given-When-Then अनुबंध:** बिना सत्यापन योग्य स्वीकृति मानदंडों के कोई भी यूजर स्टोरी विकास चरण में नहीं भेजी जाएगी।

---

## 🧑‍💼 5. विभागीय पद एवं समर्पित सब-एजेंट्स (Departmental Roles & Subagents)

विभागीय कार्य-विभाजन और उद्यम विशेषज्ञता (Specialization of Labor) सुनिश्चित करने के लिए 4 समर्पित पद (Enterprise Job Roles) और उनके अनुरूप सब-एजेंट्स परिभाषित हैं:

### 5.1 Lead Product Manager (PRD & Scope Architect)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Product Scope Architect`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - संपूर्ण उत्पाद आवश्यकता दस्तावेज़ (PRD) और व्यावसायिक समस्या विवरण का निरूपण करना।
  - इन-स्कोप (In-Scope) और आउट-ऑफ-स्कोप (Out-of-Scope) सीमाओं को 100% स्पष्टता के साथ तय करना।
  - Rule 22 के तहत चरणबद्ध प्रॉम्प्ट्स (`Phase_01_PRD_and_Requirements.md`) तैयार करना और [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) के साथ समकालिक रखना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Product Scope Architect",
  "Prompt": "Analyze user objectives, establish strict scope boundaries, anchor to memory.md, and author a comprehensive Product Requirements Document (PRD) with Phase 01 prompt specification."
}
```

### 5.2 Business Systems Analyst (Acceptance Criteria Specialist)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Business Systems Analyst`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - विस्तृत यूजर स्टोरीज और Given-When-Then स्वीकृति मानदंड (Acceptance Criteria) तैयार करना।
  - व्यावसायिक आवश्यकताओं में अस्पष्टता होने पर Rule 24 (`/grill-me` या `ask_question`) इंटरैक्टिव अलाइनमेंट चलाना।
  - नकारात्मक परिदृश्यों (Negative Edge-Cases) और सिस्टम सीमा स्थितियों का विश्लेषण करना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Business Systems Analyst",
  "Prompt": "Formulate user stories with rigorous Given-When-Then acceptance criteria, map negative edge-cases, and resolve ambiguous business requirements per Rule 24."
}
```

### 5.3 Technical Product Owner & Agile Lead (Technical Product Owner)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Technical Product Owner`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - कार्यात्मक आवश्यकताओं को INVEST-अनुरूप स्प्रिंट स्टोरीज और तकनीकी कार्यों में विभाजित करना।
  - तकनीकी निर्भरताओं (Dependencies) और क्रॉस-डिपार्टमेंट प्राथमिकताओं का प्रबंधन करना।
  - MoSCoW प्राथमिकता निर्धारण (Must, Should, Could, Won't have) को सख्ती से लागू करना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Technical Product Owner",
  "Prompt": "Break down functional requirements into INVEST-compliant sprint stories, manage technical dependencies, enforce MoSCoW prioritization, and structure deliverable milestones."
}
```

### 5.4 UX Research & User Journey Analyst (UX Research Analyst)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `UX Research Analyst`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - उपयोगकर्ता अनुसंधान, पर्सोना मैपिंग (Persona Modeling) और संपूर्ण उपयोगकर्ता यात्रा मानचित्र (User Journey Maps) तैयार करना।
  - उपयोगकर्ता घर्षण बिंदुओं (Usability Friction Points) और कॉग्निटिव लोड का विश्लेषण करना।
  - उत्पाद-बाजार उपयुक्तता (Product-Market Fit) को प्रमाणित करने हेतु उपयोगकर्ता अनुभव आवश्यकताओं को औपचारिक रूप देना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "UX Research Analyst",
  "Prompt": "Conduct user persona modeling, map end-to-end user journeys, identify usability friction points, and deliver user experience requirements to validate product-market fit."
}
```


---

## 🚦 6. विभाग हैंडऑफ एवं सत्यापन गेट्स (Department Handoff Gates)

1. **Gate 1-A (अस्पष्टता शून्य):** सभी आवश्यकताएं 100% स्पष्ट होनी चाहिए। कोई `TODO` या अस्पष्ट धारणा शेष न रहे।
2. **Gate 1-B (स्वीकृति मानदंड):** प्रत्येक यूजर स्टोरी के लिए कम से कम 2 सकारात्मक और 1 नकारात्मक स्वीकृति परिदृश्य (Given-When-Then) अनिवार्य हैं।
3. **अगले विभाग को हैंडऑफ:** PRD के सफल अनुमोदन के पश्चात कार्य आधिकारिक रूप से **Dept 02: Solution Architecture** को सौंपा जाएगा।
