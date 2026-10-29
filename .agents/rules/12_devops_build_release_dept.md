﻿# Department 12: DevOps, Build & Release Management (डेवऑप्स एवं रिलीज विभाग)

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/universal_rules.md)

---

## 🚀 1. विभाग का मिशन एवं कार्यक्षेत्र (Mission & Department Scope)

डेवऑप्स, बिल्ड इंजीनियरिंग एवं रिलीज प्रबंधन विभाग (DevOps, Build & Release Dept) सतत एकीकरण (CI), सतत वितरण (CD), डिटरमिनिस्टिक बिल्ड्स, रिलीज गेट्स, Git Flow ब्रांचिंग और प्रोजेक्ट-स्तरीय Changes Log के कड़े अनुपालन का प्रभारी है।

यह विभाग सुनिश्चित करता है कि उत्पादन में जाने वाला प्रत्येक आर्टिफैक्ट 100% संकलनीय (buildable), सत्यापित और ऑडिट योग्य हो।

---

## 🛑 2. अनिवार्य बिल्ड सत्यापन गेट्स (Mandatory Build Verification Gates)

### 2.1 शून्य-त्रुटि बिल्ड नियम (Strict Zero-Error Build Mandate)
- किसी भी कोड परिवर्तन को कमिट करने, मर्ज करने या रिलीज घोषित करने से पहले निम्नलिखित कमांड्स का स्थानीय स्तर पर 100% सफल होना अनिवार्य है:
  1. **डिपेंडेंसी संगति:** `npm ci` (लॉकफाइल अखंडता)
  2. **टाइपचेक:** `npm run typecheck` या `tsc --noEmit`
  3. **लिंटर पास:** `npm run lint`
  4. **कंपाइलर एवं बंडल बिल्ड:** `npm run build`
  5. **टेस्ट सूट रन:** `npm test`
- यदि इनमें से एक भी गेट असफल होता है, तो रिलीज प्रक्रिया तुरंत **BLOCK** कर दी जाएगी।

---

## 🐙 3. गिट फ्लो एवं सेमेंटिक वर्जनिंग मानक (Git Flow & SemVer Standards)

### 3.1 वैश्विक डेवलपर गिट प्रोफाइल (Rule 16 Compliance)
- रिपॉजिटरी में प्रत्येक कमिट Atul Verma (`aiprincekumar` / `aiprincekumar010100@gmail.com`) के रूप में ही ऑथर्ड होना चाहिए।

### 3.2 सेमेंटिक वर्जनिंग (SemVer 2.0.0)
- **MAJOR (X.0.0):** बैकवर्ड-इनकम्पैटिबल ब्रेकिंग बदलाव।
- **MINOR (0.X.0):** बैकवर्ड-कम्पैटिबल नए फीचर्स।
- **PATCH (0.0.X):** बैकवर्ड-कम्पैटिबल बग फिक्सेस।

### 3.3 कन्वेंशनल कमिट्स मानक (Conventional Commits)
- `feat(auth): add OAuth2 Google login flow`
- `fix(cart): resolve race condition in quantity update`
- `docs(api): update OpenAPI spec for orders endpoint`
- `refactor(db): optimize user query composite index`

---

## 📜 4. प्रोजेक्ट स्तर पर अनिवार्य Changes Log प्रबंधन (Rule 6 Compliance)

किसी भी प्रोजेक्ट में किए गए सभी बदलावों को प्रोजेक्ट रूट के `changes_log/` फोल्डर में व्यवस्थित रूप से दर्ज किया जाएगा:
```
changes_log/
  └── YYYY-MM-DD/
        └── HH-mm-ss_session_id/
              ├── changes_manifest.json     (परिवर्तन मेटाडेटा, ऑथर, फाइल्स सूची)
              ├── git_diff_summary.md       (विस्तृत गिट डिफ और संपादन का विवरण)
              └── verification_report.md    (बिल्ड, लिंट, टेस्ट सफलता प्रमाण)
```

---

## 🧑‍💼 5. विभागीय पद एवं समर्पित सब-एजेंट्स (Departmental Roles & Subagents)

विभागीय कार्य-विभाजन और उद्यम विशेषज्ञता (Specialization of Labor) सुनिश्चित करने के लिए 4 समर्पित पद (Enterprise Job Roles) और उनके अनुरूप सब-एजेंट्स परिभाषित हैं:

### 5.1 CI/CD Automation Pipeline Engineer (CI/CD Pipeline Engineer)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `CI/CD Pipeline Engineer`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - मजबूत और स्केलेबल GitHub Actions CI/CD वर्कफ़्लोज़ की वास्तुकला।
  - बिल्ड आर्टिफैक्ट कैशिंग और समानांतर टेस्ट मैट्रिसेस का विन्यास।
  - सुरक्षित और स्वचालित ज़ीरो-डाउनटाइम डिप्लॉयमेंट पाइपलाइन्स का निर्माण।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "CI/CD Pipeline Engineer",
  "Prompt": "Architect robust GitHub Actions CI/CD workflows, configure build artifact caching, parallelize automated test matrices, and engineer secure zero-downtime deployment pipelines."
}
```

### 5.2 Build System & Compiler Engineer (Build Systems Engineer)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Build Systems Engineer`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - बिल्ड टूलचेन (Vite/Turborepo/esbuild) का अनुकूलन और कंपाइलेशन गति सुधार।
  - नॉन-निगोशिएबल ज़ीरो-एरर बिल्ड गेट्स (`npm run build`) का कड़ा प्रवर्तन।
  - इंक्रीमेंटल बिल्ड कैशिंग और बिल्ड-टाइम परफॉर्मेंस डिग्रेडेशन का निवारण।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Build Systems Engineer",
  "Prompt": "Optimize build toolchain configurations (Vite/Turborepo), enforce zero-error compilation gates, implement incremental build caching, and eliminate build-time degradation."
}
```

### 5.3 Release Manager & Changes Log Gatekeeper (Release Manager)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Release Manager`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - सेमेंटिक वर्जनिंग (SemVer) और Git Flow रिलीज़ शाखाओं का समन्वय।
  - Rule 6 के तहत प्रोजेक्ट स्तर पर अनिवार्य `changes_log/` प्रविष्टियों का सत्यापन।
  - सत्यापन सूट्स उत्तीर्ण होने के पश्चात ही प्रोडक्शन रिलीज़ को अधिकृत करना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Release Manager",
  "Prompt": "Orchestrate SemVer release workflows, maintain strict Git Flow release branching, gate releases on passing verification suites, and enforce Rule 6 changes_log audit records."
}
```

### 5.4 Containerization & Artifact Registry Specialist (Containerization Specialist)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Containerization Specialist`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - सुरक्षित और न्यून पदचिह्न (Minimal Footprint) मल्टी-स्टेज Dockerfiles तैयार करना।
  - नॉन-रूट सुरक्षा संदर्भ और कंटेनर CVEs का पूर्ण उन्मूलन।
  - कंटेनर इमेजेस का आर्टिफैक्ट रजिस्ट्री में सुरक्षित पब्लिशिंग और टैगिंग।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Containerization Specialist",
  "Prompt": "Author hardened multi-stage Dockerfiles with non-root security contexts, minimize container image footprint, eliminate container CVEs, and configure artifact registry pushes."
}
```


---

## 🚦 6. विभाग हैंडऑफ एवं सत्यापन गेट्स (Department Handoff Gates)

1. **Gate 12-A (बिल्ड एवं टेस्ट पास):** उत्पादन बिल्ड शून्य चेतावनी/त्रुटि के साथ उत्पन्न हो।
2. **Gate 12-B (Changes Log प्रविष्टि):** `changes_log/` में सुव्यवस्थित प्रविष्टि दर्ज हो।
3. **अगले विभागों को हैंडऑफ:** रिलीज पैकेज तैयार होने पर ➔ **Dept 13: SRE & Backup** और **Dept 14: Telemetry**।
