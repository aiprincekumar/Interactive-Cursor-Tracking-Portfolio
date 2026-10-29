# Department 06: Backend & API Engineering (बैकएंड एवं API इंजीनियरिंग विभाग)

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/universal_rules.md)

---

## ⚙️ 1. विभाग का मिशन एवं कार्यक्षेत्र (Mission & Department Scope)

बैकएंड एवं API इंजीनियरिंग विभाग (Backend & API Engineering Dept) सर्वर-साइड बिजनेस लॉजिक, REST एवं GraphQL APIs, मिडलवेयर पाइपलाइन, प्रमाणीकरण (Authentication), प्राधिकरण (Authorization), इनपुट सैनिटाइजेशन और बैकएंड सर्विस विश्वसनीयता का निर्माण व संचालन करता है।

---

## 🔌 2. RESTful API डिज़ाइन एवं मानकीकरण (REST API Standards)

### 2.1 सिमेंटिक HTTP विधियाँ एवं स्टेटस कोड्स
- `GET`: सुरक्षित और आइडम्पोटेंट डेटा पुनःप्राप्ति (200 OK, 404 Not Found)
- `POST`: नए संसाधन का निर्माण (201 Created के साथ `Location` हेडर)
- `PUT`: संपूर्ण संसाधन का प्रतिस्थापन (200 OK / 204 No Content)
- `PATCH`: आंशिक संशोधन (200 OK)
- `DELETE`: संसाधन हटाना (204 No Content)

### 2.2 मानकीकृत JSON रिस्पॉन्स संरचना
प्रत्येक API प्रतिक्रिया एक पूर्वानुमानित (predictable) संरचना में होनी चाहिए:

```json
// सफल प्रतिक्रिया (Success)
{
  "success": true,
  "data": {
    "userId": "usr_98a72b",
    "name": "Atul Verma",
    "role": "ARCHITECT"
  },
  "meta": {
    "timestamp": "2026-10-29T07:15:00.000Z",
    "requestId": "req_84f912c"
  }
}

// त्रुटि प्रतिक्रिया (Standardized Error)
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The provided payload failed schema validation",
    "details": [
      { "field": "email", "issue": "Email format is invalid" }
    ]
  },
  "meta": {
    "timestamp": "2026-10-29T07:15:00.000Z",
    "requestId": "req_84f912c"
  }
}
```

---

## 🔒 3. प्रमाणीकरण, प्राधिकरण एवं मिडलवेयर पाइपलाइन (Auth & Middleware Pipeline)

### 3.1 आधुनिक ऑथेंटिकेशन (JWT + Refresh Tokens)
- अल्पकालिक एक्सेस टोकन (Access Token: 15 मिनट एक्सपायरी) मेमोरी या सुरक्षित संदर्भ में।
- दीर्घकालिक रीफ्रेश टोकन (Refresh Token: 7-30 दिन) कड़े फ्लैग्स के साथ केवल `HttpOnly`, `Secure`, `SameSite=Strict` कुकीज़ में।
- रोल-बेस्ड एक्सेस कंट्रोल (`RBAC`): प्रत्येक प्रोटेक्टेड रूट पर रोल वेरिफिकेशन मिडलवेयर अनिवार्य है।

### 3.2 अनिवार्य मिडलवेयर क्रम (Middleware Execution Order)
1. **Request ID Injection:** प्रत्येक आने वाली रिक्वेस्ट को एक विशिष्ट `x-request-id` टैग दें।
2. **Security Headers:** `helmet` या समतुल्य सुरक्षा हेडर जोड़ना।
3. **CORS Policy:** केवल अधिकृत डोमेन को अनुमति।
4. **Rate Limiting:** IP/User आधारित थ्रॉटलिंग (उदा. `express-rate-limit` / Redis Token Bucket)।
5. **Body Parser & DTO Validation:** `Zod` या `Pydantic` द्वारा इनपुट का गहन सत्यापन।
6. **Authentication & Authorization:** टोकन डिकोडिंग और अनुमतियों की जांच।
7. **Business Route Handler:** कोर सर्विस लॉजिक का निष्पादन।
8. **Global Centralized Error Handler:** अप्रत्याशित अपवादों को पकड़ना और स्टैक ट्रेस लीक किए बिना सुरक्षित रिस्पॉन्स भेजना।

---

## 🛡️ 4. इनपुट सैनिटाइजेशन एवं SQL इंजेक्शन सुरक्षा (Input Safety)

- किसी भी परिस्थिति में रॉ SQL क्वेरी में यूजर इनपुट को स्ट्रिंग कॉन्कैटिनेशन द्वारा न जोड़ें।
- सदैव पैरामीटरयुक्त क्वेरीज़ (Parameterized Queries) या सिद्ध ORM/Query Builder (Prisma, Drizzle, SQLAlchemy) का उपयोग करें।
- सभी स्ट्रिंग इनपुट्स को ट्रिम और XSS-सुरक्षित करें।

---

## 🧑‍💼 5. विभागीय पद एवं समर्पित सब-एजेंट्स (Departmental Roles & Subagents)

विभागीय कार्य-विभाजन और उद्यम विशेषज्ञता (Specialization of Labor) सुनिश्चित करने के लिए 5 समर्पित पद (Enterprise Job Roles) और उनके अनुरूप सब-एजेंट्स परिभाषित हैं:

### 5.1 Senior REST & GraphQL API Engineer (Backend API Engineer)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Backend API Engineer`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - मजबूत और स्केलेबल RESTful एवं GraphQL एंडपॉइंट्स का विकास करना।
  - स्वच्छ सर्विस-लेयर बिज़नेस लॉजिक और ORM रिपॉजिटरी पैटर्न्स का एकीकरण।
  - सख्त DTO वैलिडेशन, इनपुट सैनिटाइजेशन और मानकीकृत एरर हैंडलिंग लागू करना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Backend API Engineer",
  "Prompt": "Develop robust RESTful and GraphQL endpoints, implement clean service-layer business logic, enforce strict DTO validation, and integrate ORM repository patterns."
}
```

### 5.2 Distributed Systems & Microservices Engineer (Distributed Systems Engineer)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Distributed Systems Engineer`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - माइक्रोसर्विसेज और डिस्ट्रीब्यूटेड वर्कफ़्लोज़ की वास्तुकला तैयार करना।
  - सर्किट ब्रेकर (Resilience4j / opossum) और ग्रेसफुल डिग्रेडेशन पैटर्न्स लागू करना।
  - डिस्ट्रीब्यूटेड Saga ट्रांज़ैक्शन्स और फॉल्ट-टॉलरेंट इंटर-सर्विस संचार का प्रबंधन।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Distributed Systems Engineer",
  "Prompt": "Architect distributed microservice workflows, implement circuit breaker patterns, orchestrate Saga transactions, and design fault-tolerant service communication."
}
```

### 5.3 Auth, Identity & RBAC Security Engineer (Backend Security Engineer)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Backend Security Engineer`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - एंटरप्राइज OAuth2, OIDC और JWT-आधारित प्रमाणीकरण प्रणालियाँ लागू करना।
  - बारीक रोल-बेस्ड एक्सेस कंट्रोल (RBAC) और परमिशन-आधारित गार्ड्स की स्थापना।
  - सुरक्षित टोकन निरस्तीकरण (Revocation), सेशन प्रबंधन और क्रिप्टोग्राफिक पासवर्ड हैशिंग (Argon2)।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Backend Security Engineer",
  "Prompt": "Implement enterprise OAuth2/OIDC authentication, fine-grained Role-Based Access Control (RBAC), secure token revocation, and hardened cryptographic password hashing."
}
```

### 5.4 Caching, Queue & Asynchronous Systems Engineer (Queue Systems Specialist)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Queue Systems Specialist`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - उच्च-थ्रूपुट Redis कैशिंग लेयर्स और डिस्ट्रिब्यूटेड लॉक (Redlock) रणनीतियाँ।
  - BullMQ, RabbitMQ या Kafka द्वारा असिंक्रोनस जॉब कतारों की वास्तुकला।
  - डेड-लेटर कतारें (DLQ), स्वचालित रिट्राई नीतियां और रेस कंडीशन रोकथाम।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Queue Systems Specialist",
  "Prompt": "Engineer high-throughput Redis caching layers, configure BullMQ/Kafka asynchronous job queues with DLQ dead-letter retry policies, and prevent race conditions."
}
```

### 5.5 AI / LLM Integration & Prompt Engineer (AI Integration Engineer)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `AI Integration Engineer`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - अत्याधुनिक LLM APIs (Gemini, Claude, OpenAI) और एम्बेडिंग्स पाइपलाइन्स का बैकएंड में सुदृढ़ एकीकरण।
  - स्ट्रक्चर्ड आउटपुट्स (JSON Mode, Pydantic/Zod स्कीमा एनफोर्समेंट) और फ़ंक्शन/टूल कॉलिंग (Tool Calling) वास्तुकला।
  - Retrieval-Augmented Generation (RAG), हाइब्रिड सर्च, री-रैंकिंग और चंकिंग रणनीतियों का डिज़ाइन एवं परफॉर्मेंस ऑप्टिमाइजेशन।
  - सिस्टम प्रॉम्प्ट इंजीनियरिंग, कॉन्टेक्स्ट विंडो एफिशिएंसी और सुरक्षा गार्डरेल्स (Prompt Injection Defense)।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "AI Integration Engineer",
  "Prompt": "Architect backend LLM integrations, implement robust RAG pipelines, enforce structured outputs and tool calling workflows, and optimize prompt engineering guardrails."
}
```


---

## 🚦 6. विभाग हैंडऑफ एवं सत्यापन गेट्स (Department Handoff Gates)

1. **Gate 6-A (API अनुबंध पास):** सभी एंडपॉइंट्स परिभाषित DTOs का कड़ाई से पालन करते हों।
2. **Gate 6-B (सुरक्षा जांच):** अप्रमाणित या असुरक्षित एंडपॉइंट्स पर उचित 401/403 सुरक्षा अवरोध लगे हों।
3. **अगले विभागों को हैंडऑफ:**
   - API दस्तावेज़ीकरण के लिए ➔ **Dept 07: Technical Documentation**
   - ऑटोमेटेड API टेस्टिंग के लिए ➔ **Dept 08: Quality Assurance & Testing**
