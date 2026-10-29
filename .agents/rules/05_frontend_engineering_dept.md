# Department 05: Frontend Engineering & Client-Side Architecture (फ़्रंटएंड इंजीनियरिंग विभाग)

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/universal_rules.md)

---

## 💻 1. विभाग का मिशन एवं कार्यक्षेत्र (Mission & Department Scope)

फ़्रंटएंड इंजीनियरिंग विभाग (Frontend Engineering Dept) क्लाइंट-साइड एप्लिकेशन वास्तुकला, यूजर इंटरफ़ेस कार्यान्वयन, स्टेट मैनेजमेंट, रेंडरिंग परफॉर्मेंस, SSR/SSG बाउंड्रीज और रिएक्टिविटी सिस्टम का निर्माण करता है। यह विभाग सुनिश्चित करता है कि फ्रंटएंड कोड अत्यंत तेज़, बग-मुक्त, टाइप-सुरक्षित और आसानी से विस्तार योग्य हो।

---

## ⚛️ 2. मुख्य नियम एवं कंपोनेंट आर्किटेक्चर (Component Discipline & Principles)

### 2.1 शुद्ध कंपोनेंट पृथक्करण (UI vs Container Pattern)
- **प्रेजेंटेशनल कंपोनेंट्स (Dumb/Pure):** केवल `props` प्राप्त करते हैं और UI रेंडर करते हैं। कोई डायरेक्ट API कॉल या भारी साइड-इफेक्ट्स नहीं।
- **कंटेनर / हुक लेयर (Smart/Logic):** डेटा फेचिंग, स्टेट मैनेजमेंट और बिजनेस लॉजिक को कस्टम हुक्स (`useUserProfile`, `useOrderList`) में समाहित किया जाता है।

### 2.2 स्टेट मैनेजमेंट पदानुक्रम (State Management Hierarchy)
1. **Server State:** हमेशा `TanStack Query` (React Query) या `SWR` का उपयोग करें। कैशिंग, डिडुपिंग, और बैकग्राउंड रिफ्रेश सर्वर स्टेट लाइब्रेरी द्वारा संभाला जाए।
2. **Global Client State:** केवल सही मायने में ग्लोबल डेटा (उदा. करंट थीम, ऑथ सेशन, एक्टिव मॉडेल्स) के लिए `Zustand` या हल्का स्टोर उपयोग करें।
3. **Local UI State:** फॉर्म इनपुट, टॉगल, और स्थानीय ड्रॉपडाउन के लिए कंपोनेंट-लोकल स्टेट (`useState`, `useReducer`) का उपयोग करें।

---

## 🚀 3. रेंडरिंग परफॉर्मेंस एवं मेमोरी सुरक्षा (Rendering Performance & Memory Safety)

### 3.1 अनचाहे री-रेंडर्स की रोकथाम
- अत्यधिक भारी गणनाओं के लिए `useMemo` और कॉलबैक फ़ंक्शन्स के लिए `useCallback` का विवेकपूर्ण उपयोग करें।
- लंबी सूचियों (Lists > 100 items) के लिए अनिवार्य रूप से वर्चुअलाइजेशन (`@tanstack/react-virtual`) का उपयोग करें ताकि DOM नोड्स सीमित रहें।
- कोड-स्प्लिटिंग: भारी रूट्स और मॉड्यूल्स को `React.lazy()` और `Suspense` के साथ डायनामिकली लोड करें।

### 3.2 मेमोरी लीक रोकथाम (Leak Prevention)
- प्रत्येक `useEffect` में सब्सक्राइबर्स, वेबसॉकेट्स, ईवेंट लिसनर्स और टाइमर्स (`setInterval`, `setTimeout`) के लिए एक अनिवार्य क्लीनअप फ़ंक्शन (`return () => { ... }`) होना चाहिए।

```typescript
// उदाहरण: सुरक्षित कस्टम हुक एवं क्लीनअप
import { useEffect, useState } from 'react';

export function useWindowResize() {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // अनिवार्य क्लीनअप ताकि मेमोरी लीक न हो
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowWidth;
}
```

---

## 🛡️ 4. टाइप सुरक्षा एवं फॉर्म वैलिडेशन (TypeScript & Form Validation)

- **सख्त टाइपस्क्रिप्ट (Strict TypeScript):** कोई `any` प्रकार का उपयोग नहीं। सभी DTOs, API रिस्पॉन्स और कंपोनेंट प्रॉप्स स्पष्ट इंटरफेस या टाइप्स में परिभाषित होने चाहिए।
- **रनटाइम फॉर्म वैलिडेशन:** सभी यूजर फॉर्म्स को `Zod` स्कीमा और `react-hook-form` के संयोजन द्वारा मान्य किया जाएगा।

```typescript
import { z } from 'zod';

export const userRegistrationSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;
```

---

## 🧑‍💼 5. विभागीय पद एवं समर्पित सब-एजेंट्स (Departmental Roles & Subagents)

विभागीय कार्य-विभाजन और उद्यम विशेषज्ञता (Specialization of Labor) सुनिश्चित करने के लिए 5 समर्पित पद (Enterprise Job Roles) और उनके अनुरूप सब-एजेंट्स परिभाषित हैं:

### 5.1 Senior Frontend Core Engineer (Frontend Engineer)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Frontend Engineer`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - उत्पादन-स्तरीय मॉड्यूलर React/TypeScript कंपोनेंट्स का विकास करना।
  - सख्त TypeScript इंटरफेसेस, Zod स्कीमा फॉर्म वैलिडेशन और टाइप-सेफ्टी लागू करना।
  - सर्वर कंपोनेंट्स (RSC) और क्लाइंट कंपोनेंट्स के बीच स्पष्ट सीमाओं का प्रबंधन करना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Frontend Engineer",
  "Prompt": "Develop production-grade React/TypeScript components, enforce strict type-safety and Zod schema validations, and manage modular component architecture."
}
```

### 5.2 Client State & Cache Architect (Frontend State Architect)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Frontend State Architect`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - Zustand और TanStack Query द्वारा स्केलेबल क्लाइंट स्टेट एवं सर्वर-कैश वास्तुकला तैयार करना।
  - ऑप्टिमिस्टिक यूआई म्यूटेशन्स और स्वचालित रोलबैक तंत्र लागू करना।
  - Stale-while-revalidate कैशिंग रणनीतियाँ कॉन्फ़िगर करना और क्लाइंट स्टेट ड्रिफ्ट रोकना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Frontend State Architect",
  "Prompt": "Architect scalable client state using Zustand and TanStack Query, implement optimistic UI mutations, configure stale-while-revalidate caching, and eliminate state drift."
}
```

### 5.3 Motion, 3D WebGL & Canvas Specialist (Canvas Motion Specialist)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Canvas Motion Specialist`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - Three.js और WebGL द्वारा 3D ग्राफिक्स और इमर्सिव कैनवस अनुभव विकसित करना।
  - उच्च-प्रदर्शन HTML5 Canvas चार्ट्स, डेटा विज़ुअलाइज़ेशन और कस्टम GLSL शेडर्स बनाना।
  - 60fps GPU-एक्सेलरेटेड मोशन और रेंडर लूप्स का अनुकूलन करना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Canvas Motion Specialist",
  "Prompt": "Implement Three.js/WebGL 3D graphics, high-performance HTML5 Canvas visualizations, customized shader effects, and performant GPU-accelerated motion rendering."
}
```

### 5.4 Responsive & Cross-Browser Web Engineer (Responsive Web Specialist)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Responsive Web Specialist`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - CSS कंटेनर क्वेरीज और फ्लेक्स/ग्रिड प्रणालियों द्वारा फ्लूइड रिस्पॉन्सिव लेआउट्स तैयार करना।
  - क्रॉस-ब्राउज़र विसंगतियों (WebKit, Gecko, Chromium) और iOS Safari बग्स का समाधान करना।
  - मोबाइल टच जेस्चर्स, स्वाइप एक्शन्स और व्यूमार्जिन एर्गोनॉमिक्स सुनिश्चित करना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Responsive Web Specialist",
  "Prompt": "Engineer fluid responsive layouts using CSS container queries and flex/grid systems, resolve cross-browser quirks (WebKit/Gecko), and ensure mobile touch ergonomics."
}
```

### 5.5 Mobile Native & Cross-Platform Specialist (Mobile Native Specialist)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Mobile Native Specialist`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - iOS (Swift/SwiftUI) और Android (Kotlin/Jetpack Compose) नेटिव मोबाइल घटकों का निर्माण।
  - React Native, Expo, Capacitor और Tauri जैसे आधुनिक क्रॉस-प्लेटफॉर्म मोबाइल फ्रेमवर्क्स का एकीकरण।
  - मोबाइल-विशिष्ट हार्डवेयर फीचर्स (बायोमेट्रिक ऑथ, कैमरा, पुश नोटिफिकेशन्स, ऑफलाइन SQLite/WatermelonDB) का सुरक्षित क्रियान्वयन।
  - ऐप स्टोर व गूगल प्ले स्टोर के परफॉर्मेंस, मेमोरी फुटप्रिंट और गाइडलाइन मानकों का शत-प्रतिशत अनुपालन।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Mobile Native Specialist",
  "Prompt": "Architect and develop native and cross-platform mobile applications (React Native/Capacitor/Swift/Kotlin), implement device hardware integrations, and ensure strict mobile store performance compliance."
}
```


---

## 🚦 6. विभाग हैंडऑफ एवं सत्यापन गेट्स (Department Handoff Gates)

1. **Gate 5-A (टाइपचेक एवं लिंट पास):** `tsc --noEmit` और `npm run lint` बिना किसी चेतावनी या त्रुटि के सफल होने चाहिए।
2. **Gate 5-B (बिल्ड सफलता):** `npm run build` उत्पादन बंडल सफलतापूर्वक उत्पन्न करे।
3. **अगले विभागों को हैंडऑफ:**
   - स्वचालित टेस्टिंग के लिए ➔ **Dept 08: Quality Assurance & Testing**
   - परफॉरमेंस एवं वेब वाइटल्स ऑडिट के लिए ➔ **Dept 09: Performance & Web Vitals**
