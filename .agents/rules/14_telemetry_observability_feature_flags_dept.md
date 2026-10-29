﻿# Department 14: Telemetry, Observability & Feature Flags (टेलीमेट्री एवं अवलोकनीयता विभाग)

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/universal_rules.md)

---

## 📡 1. विभाग का मिशन एवं कार्यक्षेत्र (Mission & Department Scope)

टेलीमेट्री, अवलोकनीयता एवं फीचर फ्लैग्स विभाग (Telemetry & Observability Dept) सिस्टम के वास्तविक समय के स्वास्थ्य, डिस्ट्रीब्यूटेड ट्रेसिंग, स्ट्रक्चर्ड लॉगिंग, मेट्रिक्स कलेक्शन, एरर ट्रैकिंग और प्रगतिशील रोलआउट्स (Progressive Delivery via Feature Flags) का संचालन करता है।

यह विभाग सुनिश्चित करता है कि सिस्टम में होने वाली प्रत्येक घटना पारदर्शी, ट्रैक करने योग्य और नियंत्रित हो।

---

## 🔍 2. अवलोकनीयता के तीन स्तंभ (The Three Pillars of Observability)

### 2.1 स्ट्रक्चर्ड JSON लॉगिंग मानक (Structured JSON Logging)
- कभी भी प्लेन टेक्स्ट में अनस्ट्रक्चर्ड लॉग न लिखें (उदा. `console.log("user logged in")`)।
- सदैव मानकीकृत JSON लॉग फॉर्मेट का उपयोग करें:

```json
{
  "timestamp": "2026-10-29T07:15:20.124Z",
  "level": "INFO",
  "service": "order-service",
  "traceId": "4bf92f3577b34da6a3ce929d0e0e4736",
  "spanId": "00f067aa0ba902b7",
  "userId": "usr_98a72b",
  "event": "ORDER_PLACED_SUCCESS",
  "context": {
    "orderId": "ord_10283",
    "amount": 249.99,
    "paymentMethod": "UPI"
  }
}
```

### 2.2 डिस्ट्रीब्यूटेड ट्रेसिंग (OpenTelemetry Standards)
- सेवाओं के बीच प्रत्येक नेटवर्क कॉल पर `traceparent` हेडर पास करें ताकि संपूर्ण एंड-टू-एंड रिक्वेस्ट यात्रा को एक ही ट्रेस ID से ट्रैक किया जा सके।
- डेटाबेस क्वेरीज़ और बाहरी API कॉल्स पर कस्टम स्पैन (`tracer.startActiveSpan`) बनाएं।

### 2.3 कोर सिस्टम मेट्रिक्स (RED Method)
- **Rate:** प्रति सेकंड कुल रिक्वेस्ट्स संख्या (Requests / sec)।
- **Errors:** प्रति सेकंड असफल होने वाली रिक्वेस्ट्स संख्या (Failed requests / sec)।
- **Duration:** प्रत्येक रिक्वेस्ट में लगने वाला समय / लेटेंसी (Latency P95 / P99)।

---

## 🚩 3. फीचर फ्लैग्स एवं प्रगतिशील रोलआउट्स मानक (Feature Flags Architecture)

### 3.1 फीचर फ्लैग्स के प्रकार
1. **रिलीज़ फ्लैग्स (Release Flags):** नए कोड को प्रोडक्शन में निष्क्रिय अवस्था (Dark Launch) में डिप्लॉय करना।
2. **प्रतिशत रोलआउट्स (Percentage Rollout):** नए फीचर को पहले 5% उपयोगकर्ताओं को दिखाना, फिर स्थिरता जांचकर 25%, 50%, और 100% तक बढ़ाना।
3. **किल स्विच (Kill Switch):** उत्पादन में गंभीर बग आने पर बिना नया कोड डिप्लॉय किए फीचर को 1 सेकंड में तुरंत बंद करने की क्षमता।

```typescript
// उदाहरण: फीचर फ्लैग सुरक्षित उपयोग
import { isFeatureEnabled } from './featureFlags';

export async function processCheckout(userId: string, cart: Cart) {
  const useV2CheckoutEngine = await isFeatureEnabled('checkout_engine_v2', userId);

  if (useV2CheckoutEngine) {
    return processCheckoutV2(userId, cart);
  }

  return processCheckoutV1(userId, cart);
}
```

---

## 🩺 4. सिंथेटिक हेल्थ चेक प्रोब्स मानक (Health Check Probes)

प्रत्येक बैकएंड सेवा में दो अनिवार्य हेल्थ प्रोब्स होने चाहिए:
- `/healthz` (Liveness Probe): क्या सर्वर प्रोसेस जीवित है और रिक्वेस्ट्स स्वीकार कर रही है? (200 OK)
- `/readyz` (Readiness Probe): क्या डेटाबेस, कैश, और मैसेज क्यू से कनेक्शन सक्रिय है और सेवा ट्रैफिक संभालने के लिए पूरी तरह तैयार है? (200 OK / 503 Service Unavailable)

---

## 🧑‍💼 5. विभागीय पद एवं समर्पित सब-एजेंट्स (Departmental Roles & Subagents)

विभागीय कार्य-विभाजन और उद्यम विशेषज्ञता (Specialization of Labor) सुनिश्चित करने के लिए 3 समर्पित पद (Enterprise Job Roles) और उनके अनुरूप सब-एजेंट्स परिभाषित हैं:

### 5.1 Observability & Distributed Tracing Engineer (Telemetry Engineer)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Telemetry Engineer`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - OpenTelemetry SDK द्वारा एप्लीकेशन रनटाइम्स का व्यापक इंस्ट्रुमेंटेशन।
  - माइक्रोसर्विसेज के आर-पार डिस्ट्रीब्यूटेड ट्रेस कॉन्टेक्स्ट (W3C TraceContext) प्रोपेगेशन।
  - एंड-टू-एंड लेटेंसी फ्लेमग्राफ्स और बॉटलनेक प्रोफाइलिंग का प्रबंधन।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Telemetry Engineer",
  "Prompt": "Instrument application runtimes with OpenTelemetry SDK, configure distributed trace context propagation across microservices, and design latency flamegraph tracing."
}
```

### 5.2 Feature Flag & Canary Rollout Manager (Feature Flag Manager)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Feature Flag Manager`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - डायनामिक फीचर टॉगल्स (LaunchDarkly/कस्टम प्रोवाइडर) का सुरक्षित एकीकरण।
  - प्रगतिशील प्रतिशत-आधारित कैनरी रोलआउट्स (5% -> 25% -> 50% -> 100%) का संचालन।
  - विसंगति दिखने पर तत्काल ज़ीरो-डाउनटाइम इमरजेंसी किल-स्विच (Kill-Switch) सक्रिय करना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Feature Flag Manager",
  "Prompt": "Implement feature toggles using LaunchDarkly/custom providers, orchestrate progressive percentage-based canary rollouts, and establish instant zero-downtime kill-switches."
}
```

### 5.3 Metrics, Logs & Alerting Dashboard Specialist (Metrics Dashboard Specialist)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Metrics Dashboard Specialist`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - RED और USE पद्धतियों के अनुसार प्रोमीथियस मेट्रिक्स का संग्रह और एकत्रीकरण।
  - कोरिलेशन-आईडी युक्त स्ट्रक्चर्ड JSON लॉगिंग (Winston/Pino) का कड़ा प्रवर्तन।
  - रियल-टाइम Grafana डैशबोर्ड्स और उच्च-सटीकता पेजरड्यू अलर्टिंग नियमों की स्थापना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Metrics Dashboard Specialist",
  "Prompt": "Configure RED/USE metrics collection, implement structured correlation-ID JSON logging, design real-time Grafana dashboards, and establish high-fidelity alerting rules."
}
```


---

## 🚦 6. विभाग हैंडऑफ एवं सत्यापन गेट्स (Department Handoff Gates)

1. **Gate 14-A (हेल्थ चेक सत्यापन):** `/healthz` और `/readyz` दोनों सही स्थिति लौटा रहे हों।
2. **Gate 14-B (टेलीमेट्री सक्रियता):** ट्रेस और स्ट्रक्चर्ड लॉग्स सही प्रारूप में प्रवाहित हो रहे हों।
3. **सिस्टम जीवनचक्र पूर्ण:** संपूर्ण उद्यम वास्तुकला अवलोकनीयता के साथ सुरक्षित और स्थिर है।
