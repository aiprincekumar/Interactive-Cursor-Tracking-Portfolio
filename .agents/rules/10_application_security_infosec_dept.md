﻿# Department 10: Application Security & InfoSec (एप्लिकेशन सुरक्षा एवं इन्फोसेक विभाग)

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/universal_rules.md)

---

## 🛡️ 1. विभाग का मिशन एवं कार्यक्षेत्र (Mission & Department Scope)

एप्लिकेशन सुरक्षा एवं इन्फोसेक विभाग (AppSec & InfoSec Dept) सॉफ़्टवेयर की अभेद्य सुरक्षा, क्रेडेंशियल स्वच्छता, OWASP Top 10 कमज़ोरियों के उन्मूलन, डेटा एन्क्रिप्शन और सुरक्षा नीतियों के प्रवर्तन का सर्वोच्च संरक्षक है।

यह विभाग सुनिश्चित करता है कि सिस्टम में शून्य सुरक्षा दोष, शून्य लीक हुए सीक्रेट्स और शून्य अप्रमाणित पहुंच बिंदु हों।

---

## 🔑 2. सीक्रेट स्कैनिंग एवं क्रेडेंशियल स्वच्छता मानक (Zero Hardcoded Secrets Policy)

### 2.1 शून्य हार्डकोडेड सीक्रेट्स का पूर्ण नियम
- किसी भी परिस्थिति में API कीज, पासवर्ड, डेटाबेस कनेक्शन स्ट्रिंग्स, JWT सीक्रेट्स, या प्राइवेट कीज को कोड फाइलों, कमेंट्स या गिट कमिट्स में नहीं लिखा जाएगा।
- सभी संवेदनशील मान केवल `.env` पर्यावरण चर में रहेंगे और `.gitignore` में `.env` शामिल होना अनिवार्य है।
- प्रोजेक्ट में केवल एक सुरक्षित `.env.example` शामिल होगा जिसमें डमी प्लेसहोल्डर्स होंगे।

### 2.2 स्वचालित सीक्रेट स्कैनिंग
- प्रत्येक कमिट और बिल्ड से पहले रिपॉजिटरी में सीक्रेट स्कैनिंग (`gitleaks`, `trufflehog`, या GitHub Secret Scanning) चलाना अनिवार्य है।

---

## 🛑 3. OWASP Top 10 सुरक्षा नियंत्रण (OWASP Top 10 Mitigation Standards)

| भेद्यता (Vulnerability) | संभावित जोखिम (Risk) | अनिवार्य रक्षा उपाय (Mandatory Defense) |
| :--- | :--- | :--- |
| **A01: Broken Access Control** | अनधिकृत डेटा एक्सेस (IDOR) | सर्वर-साइड ऑब्जेक्ट-स्तरीय स्वामित्व जांच (Object-Level Authorization) |
| **A02: Cryptographic Failures** | प्लेनटेक्स्ट पासवर्ड या लीक डेटा | `Argon2id` / `bcrypt` (कॉस्ट >= 12), डेटाबेस स्तर पर `AES-256-GCM` |
| **A03: Injection (SQL / NoSQL / OS)** | रिमोट कोड निष्पादन, डेटा चोरी | 100% पैरामीटरयुक्त क्वेरीज़ (Parameterized Queries), कोई स्ट्रिंग कॉनकेट नहीं |
| **A04: Insecure Design** | आर्किटेक्चरल सुरक्षा चूक | थ्रेट मॉडलिंग, रेट लिमिटिंग, फेल-क्लोज्ड मैकेनिज्म |
| **A05: Security Misconfiguration** | डिफ़ॉल्ट क्रेडेंशियल्स, स्टैक ट्रेस लीक | प्रोडक्शन में विस्तृत एरर मैसेज छिपाना, `helmet` सुरक्षा हेडर |
| **A07: Identification & Auth Failures** | ब्रूट-फोर्स, सेशन हाईजैकिंग | मल्टी-फैक्टर ऑथेंटिकेशन (MFA), सुरक्षित HttpOnly कुकीज़, ब्रूट-फोर्स लॉकआउट |
| **A08: Software & Data Integrity** | दुर्भावनापूर्ण डिपेंडेंसीज | लॉकफाइल अखंडता (`package-lock.json`), डिपेंडेंसी ऑडिट (`npm audit`) |

---

## 🌐 4. HTTP सुरक्षा हेडर एवं CORS नीतियां (Security Headers & CORS)

प्रत्येक सर्वर प्रतिक्रिया में निम्नलिखित सुरक्षा हेडर शामिल होने चाहिए:

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' },
  noSniff: true
}));
```

---

## 🧑‍💼 5. विभागीय पद एवं समर्पित सब-एजेंट्स (Departmental Roles & Subagents)

विभागीय कार्य-विभाजन और उद्यम विशेषज्ञता (Specialization of Labor) सुनिश्चित करने के लिए 4 समर्पित पद (Enterprise Job Roles) और उनके अनुरूप सब-एजेंट्स परिभाषित हैं:

### 5.1 Application Security Engineer (AppSec Engineer)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `AppSec Engineer`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - स्टेटिक एप्लीकेशन सिक्योरिटी टेस्टिंग (SAST) और स्वचालित डिपेंडेंसी वल्नरेबिलिटी ऑडिट्स।
  - सुरक्षित कोडिंग मानकों का प्रवर्तन और इनपुट सैनिटाइजेशन द्वारा इंजेक्शन व XSS का उन्मूलन।
  - तीसरे पक्ष के पैकेजेस में ज्ञात CVEs की सक्रिय पहचान और त्वरित पैचिंग।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "AppSec Engineer",
  "Prompt": "Conduct static application security testing (SAST), remediate vulnerable dependencies, enforce secure coding practices, and eliminate injection and XSS vectors."
}
```

### 5.2 Penetration Tester & Ethical Hacker (Penetration Tester)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Penetration Tester`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - OWASP Top 10 पद्धतियों का पालन करते हुए सक्रिय पेनेट्रेशन परीक्षण का अनुकरण।
  - ऑथराइजेशन बाईपास, प्रिविलेज एस्केलेशन और CSRF/SSRF कमज़ोरियों की गहरी जांच।
  - डिफेंसिव सिक्योरिटी कंट्रोल्स, इनपुट फ़िल्टरिंग और सुरक्षा हेडर का व्यावहारिक परीक्षण।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Penetration Tester",
  "Prompt": "Simulate adversarial cyber attacks following OWASP Top 10 methodologies, probe authorization bypasses, test for CSRF/SSRF vulnerabilities, and verify defensive controls."
}
```

### 5.3 Secrets, KMS & Credential Governance Officer (Secrets Governance Officer)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Secrets Governance Officer`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - ज़ीरो हार्डकोडेड सीक्रेट्स नीति लागू करना और TruffleHog/Git-secrets प्री-कमिट स्कैनिंग।
  - AWS Secrets Manager, HashiCorp Vault और KMS एन्क्रिप्शन की वास्तुकला।
  - स्वचालित क्रेडेंशियल रोटेशन, लीस्ट-प्रिविलेज सर्विस एकाउंट्स और लीक प्रिवेंशन।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Secrets Governance Officer",
  "Prompt": "Enforce zero hardcoded secrets policies, integrate pre-commit secret scanners (TruffleHog), architect KMS and Vault secret management, and orchestrate automated key rotation."
}
```

### 5.4 Cloud Infrastructure Security & IAM Auditor (Cloud Security Auditor)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Cloud Security Auditor`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - क्लाउड सुरक्षा आधारभूत संरचना (CSPM) और IAM लीस्ट-प्रिविलेज नीतियों का विस्तृत ऑडिट।
  - VPC नेटवर्क सिक्योरिटी ग्रुप्स, सबनेट्स और सार्वजनिक एक्सपोज़र की जांच।
  - क्लाउड रिसोर्सेज में असुरक्षित मिसकॉन्फ़िगरेशन का पूर्ण उन्मूलन।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Cloud Security Auditor",
  "Prompt": "Audit cloud infrastructure security baselines, enforce principle of least privilege in IAM policies, inspect VPC network configurations, and eliminate public cloud misconfigurations."
}
```


---

## 🚦 6. विभाग हैंडऑफ एवं सत्यापन गेट्स (Department Handoff Gates)

1. **Gate 10-A (डिपेंडेंसी ऑडिट):** `npm audit --production` में शून्य `High` या `Critical` वल्नेरेबिलिटी होनी चाहिए।
2. **Gate 10-B (सीक्रेट स्कैन):** पूरे कोडबेस में कोई सक्रिय सीक्रेट या टोकन मौजूद न हो।
3. **अगले विभागों को हैंडऑफ:** सुरक्षा अनुमोदन के बाद ➔ **Dept 11: Legal & Compliance** और **Dept 12: DevOps**।
