﻿# Department 07: Technical Documentation & API Specs (तकनीकी दस्तावेज़ीकरण विभाग)

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/universal_rules.md)

---

## 📚 1. विभाग का मिशन एवं कार्यक्षेत्र (Mission & Department Scope)

तकनीकी दस्तावेज़ीकरण एवं ज्ञान प्रबंधन विभाग (Technical Documentation Dept) सिस्टम के संपूर्ण तकनीकी ज्ञान आधार, OpenAPI/Swagger विनिर्देशों, आर्किटेक्चरल डिसीजन रिकॉर्ड्स (ADRs), डेवलपर ऑनबोर्डिंग गाइड्स, रनबुक्स और API दस्तावेज़ीकरण के मानकीकरण के लिए उत्तरदायी है।

यह विभाग सुनिश्चित करता है कि कोडबेस का कोई भी हिस्सा बिना प्रलेखित संदर्भ के न रहे और दस्तावेज़ कोड के साथ 100% सिंक्रोनाइज़्ड रहें।

---

## 📜 2. OpenAPI / Swagger 3.0+ विनिर्देश मानक (OpenAPI Specification Standards)

### 2.1 अनिवार्य API विनिर्देश संरचना
प्रत्येक बैकएंड API के लिए एक संपूर्ण OpenAPI 3.x विनिर्देश (`docs/openapi.yaml` या `openapi.json`) बनाए रखा जाएगा:
- प्रत्येक एंडपॉइंट के लिए स्पष्ट `summary`, `description`, और `tags`।
- सभी इनपुट पैरामीटर्स (path, query, header) का स्पष्ट प्रकार, डिफ़ॉल्ट मान और सत्यापन नियम।
- प्रत्येक प्रतिक्रिया (Response) के लिए HTTP स्टेटस कोड, स्कीमा संदर्भ और यथार्थवादी JSON उदाहरण (Examples)।

```yaml
# उदाहरण: OpenAPI 3.0 एंडपॉइंट विनिर्देश
/api/v1/orders:
  post:
    summary: "Create a new customer order"
    tags: ["Orders"]
    security:
      - BearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/CreateOrderRequest'
    responses:
      '201':
        description: "Order created successfully"
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/OrderResponse'
      '400':
        $ref: '#/components/responses/ValidationError'
      '401':
        $ref: '#/components/responses/UnauthorizedError'
```

---

## 🛠️ 3. डेवलपर सेटअप गाइड एवं रनबुक्स मानक (Setup Runbooks & Onboarding)

- **प्रोजेक्ट README.md संरचना:**
  1. **प्रोजेक्ट अवलोकन:** उद्देश्य, तकनीकी स्टैक और प्रमुख फीचर्स।
  2. **पूर्वापेक्षाएं (Prerequisites):** नोड संस्करण, डेटाबेस, और आवश्यक टूल्स।
  3. **1-क्लिक त्वरित शुरुआत (Quick Start):**
     ```bash
     git clone <repo-url>
     cp .env.example .env
     npm ci
     npm run dev
     ```
  4. **पर्यावरण चर विवरण (Environment Variables):** प्रत्येक `.env` चर का उद्देश्य और नमूना मान।
  5. **टेस्ट रनर निर्देश:** `npm test` और `npm run test:e2e` चलाने की विधि।

---

## 🔄 4. सतत दस्तावेज़ समकालिकता मानक (Living Documentation & Zero-Drift)

- **शून्य-विचलन नियम (Zero-Drift Policy):** जब भी किसी API एंडपॉइंट, डेटाबेस मॉडल, या एनवायरनमेंट वेरिएबल में कोड-स्तरीय परिवर्तन किया जाता है, तो उसी कमिट/PR में संबंधित दस्तावेज़ों को अपडेट करना अनिवार्य है।
- कभी भी पुराना या भ्रामक दस्तावेज़ कोडबेस में नहीं छोड़ा जाएगा।

---

## 🧑‍💼 5. विभागीय पद एवं समर्पित सब-एजेंट्स (Departmental Roles & Subagents)

विभागीय कार्य-विभाजन और उद्यम विशेषज्ञता (Specialization of Labor) सुनिश्चित करने के लिए 4 समर्पित पद (Enterprise Job Roles) और उनके अनुरूप सब-एजेंट्स परिभाषित हैं:

### 5.1 Lead Technical Writer (Technical Documentation Writer)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Technical Documentation Writer`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - Rule 7 के तहत व्यापक, ज़ीरो-ड्रिफ्ट तकनीकी दस्तावेज़ीकरण तैयार करना।
  - सिस्टम ओवरव्यू, मॉड्यूल गाइड्स और आर्किटेक्चरल फ्लो का स्पष्ट प्रलेखन।
  - डेवलपर्स और एंड-यूजर्स के लिए सटीक, अद्यतन और पेशेवर तकनीकी सामग्री लिखना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Technical Documentation Writer",
  "Prompt": "Author comprehensive, zero-drift technical documentation, maintain root and module guides, and produce clear developer explanations adhering to Rule 7."
}
```

### 5.2 OpenAPI & API Specification Architect (API Specification Specialist)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `API Specification Specialist`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - `docs/openapi.yaml` में कठोर OpenAPI 3.1 विनिर्देश तैयार करना।
  - बैकएंड DTOs और एपीआई एंडपॉइंट्स के साथ स्कीमा डेफिनिशन्स का 100% समकालिकरण।
  - इंटरैक्टिव Swagger UI प्रलेखन और मॉक API कॉन्ट्रैक्ट्स का निर्माण।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "API Specification Specialist",
  "Prompt": "Formulate rigorous OpenAPI 3.1 specifications in docs/openapi.yaml, synchronize schema definitions with backend DTOs, and generate interactive Swagger interfaces."
}
```

### 5.3 Developer Experience (DX) & Runbook Engineer (Developer Experience Engineer)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Developer Experience Engineer`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - घर्षण-मुक्त डेवलपर ऑनबोर्डिंग वर्कफ़्लो और विस्तृत `README.md` तैयार करना।
  - मानकीकृत `.env.example` कॉन्फ़िगरेशन और स्थानीय वातावरण सेटअप गाइड्स।
  - उत्पादन संचालन और संकट प्रबंधन हेतु विस्तृत ट्रबलशूटिंग रनबुक्स का संकलन।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Developer Experience Engineer",
  "Prompt": "Design friction-free developer onboarding workflows, author comprehensive README and setup runbooks, curate .env.example files, and compile operational playbooks."
}
```

### 5.4 Architecture Decision Record (ADR) Chronicler (ADR Documentation Specialist)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `ADR Documentation Specialist`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - MADR प्रारूप का पालन करते हुए `docs/adr/` में सभी वास्तुकला निर्णयों का संलेखन।
  - निर्णय का संदर्भ, विचार किए गए विकल्प, तर्क और प्रभाव (Consequences) दर्ज करना।
  - Rule 2 के तहत वास्तुकला निर्णयों का स्थायी और अपरिवर्तनीय ऑडिट ट्रेल बनाए रखना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "ADR Documentation Specialist",
  "Prompt": "Record all architectural and design decisions in docs/adr/ following MADR conventions, capturing context, trade-offs, rationale, and consequences per Rule 2."
}
```


---

## 🚦 6. विभाग हैंडऑफ एवं सत्यापन गेट्स (Department Handoff Gates)

1. **Gate 7-A (OpenAPI वैलिडेशन):** `npx @stoplight/spectral-cli lint docs/openapi.yaml` बिना त्रुटि के पास होना चाहिए।
2. **Gate 7-B (रनबुक सत्यापन):** सेटअप रनबुक के सभी कमांड्स का परीक्षण स्वच्छ वातावरण में सफल होना चाहिए।
3. **अगले विभागों को हैंडऑफ:** दस्तावेज़ीकरण पूर्ण होने पर ➔ **Dept 08: QA** और **Dept 12: DevOps**।
