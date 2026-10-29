﻿# Department 04: UI/UX Design System & Aesthetic Engineering (UI/UX डिज़ाइन सिस्टम विभाग)

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/universal_rules.md)

---

## 🎨 1. विभाग का मिशन एवं कार्यक्षेत्र (Mission & Department Scope)

UI/UX डिज़ाइन सिस्टम एवं एस्थेटिक इंजीनियरिंग विभाग (UI/UX Design System Dept) एप्लिकेशन के दृश्य सौंदर्य (Visual Aesthetics), उपयोगकर्ता अनुभव (UX), डिज़ाइन टोकन्स, टाइपोग्राफी पदानुक्रम, एक्सेसिबिलिटी (A11y), रिस्पॉन्सिव लेआउट और माइक्रो-इंटरैक्शन के मानकीकरण के लिए उत्तरदायी है।

यह विभाग सामान्य (generic) AI जनरेटेड टेम्प्लेट लुक को पूरी तरह समाप्त कर प्रीमियम, आधुनिक और आकर्षक इंटरफ़ेस का निर्माण सुनिश्चित करता है।

---

## 💎 2. मुख्य नियम एवं एंटी-जेनेरिक डिज़ाइन मानक (Anti-Generic Design Mandates)

### 2.1 प्रोजेक्ट रूट पर अनिवार्य DESIGN.md (Rule Compliance)
- प्रत्येक फ्रंटएंड प्रोजेक्ट के रूट में एक समर्पित [`DESIGN.md`](file:///DESIGN.md) फ़ाइल बनाई जाएगी जो प्रोजेक्ट के डिज़ाइन सिद्धांतों, कलर पैलेट, टाइपोग्राफी और कंपोनेंट शैलियों को परिभाषित करती है।

### 2.2 डिज़ाइन टोकन्स एवं रंग पैलेट मानक (Design Tokens & Color Harmony)
- कभी भी अप्रत्याशित या असंगत हेक्स कोड्स सीधे CSS में न लिखें। सदैव CSS वेरिएबल्स या Tailwind कॉन्फ़िग टोकन्स का उपयोग करें:
  - **Primary / Brand:** गहरा, आत्मविश्वासी मुख्य रंग (उदा. सटल इंडिगो `#4F46E5` या एमराल्ड `#059669`)
  - **Surface / Background:** गहराई और स्तरित संरचना (Dark mode: `#0B0F17`, `#151B28`, `#1E2638`)
  - **Borders & Dividers:** अत्यंत सूक्ष्म और परिष्कृत (उदा. `rgba(255, 255, 255, 0.08)`)
  - **Accents & Feedback:** सुसंगत सिमेंटिक कलर्स (Success, Warning, Destructive, Info)

### 2.3 टाइपोग्राफी पदानुक्रम (Typography Hierarchy)
- आधुनिक, पठनीय टाइपफेस का चयन (उदा. Inter, Geist, Plus Jakarta Sans, Outfit)।
- स्पष्ट और सख्त पदानुक्रम:
  - **H1 / Display:** बोल्ड, संक्षिप्त, ट्रैक-टाइट (`letter-spacing: -0.025em`)
  - **Body:** आरामदायक लाइन-हाइट (`leading-relaxed`), सुसंगत कंट्रास्ट।
  - **Mono:** कोड स्निपेट्स और संख्याओं के लिए JetBrains Mono या Fira Code।

---

## ♿ 3. एक्सेसिबिलिटी एवं रिस्पॉन्सिव लेआउट मानक (WCAG 2.1 & Responsiveness)

### 3.1 WCAG 2.1 AA/AAA एक्सेसिबिलिटी अनिवार्यता
- **कंट्रास्ट अनुपात (Contrast Ratio):** सामान्य टेक्स्ट के लिए न्यूनतम **4.5:1** और बड़े टेक्स्ट के लिए न्यूनतम **3:1** कंट्रास्ट होना अनिवार्य है।
- **कीबोर्ड नेविगेशन एवं फोकस स्टेट्स:** प्रत्येक इंटरैक्टिव एलिमेंट (`button`, `a`, `input`) पर स्पष्ट फोकस रिंग (`focus-visible:ring-2 focus-visible:ring-offset-2`) होना अनिवार्य है। कभी भी `outline: none` बिना सुदृढ़ ऑल्टर्नेटिव के न लगाएं।
- **स्क्रीन रीडर अनुपालन:** आइकन-ओनली बटनों में अनिवार्य `aria-label` या `sr-only` टेक्स्ट मौजूद होना चाहिए।

### 3.2 मोबाइल-फर्स्ट एवं फ्लूइड लेआउट (Fluid Responsive Layout)
- 320px से लेकर 4K अल्ट्रा-वाइड स्क्रीन्स तक किसी भी रिज़ॉल्यूशन पर हॉरिजॉन्टल स्क्रॉलबार (`overflow-x: hidden`) का न आना सुनिश्चित करें।
- फॉन्ट साइज और स्पेसिंग के लिए CSS `clamp()` का उपयोग:
  ```css
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  padding: clamp(1rem, 4vw, 3rem);
  ```

---

## ✨ 4. माइक्रो-इंटरैक्शन एवं एनिमेशन सिद्धांत (Micro-Interactions & Motion)

- एनिमेशन हमेशा उद्देश्यपूर्ण, सूक्ष्म और तेज़ (150ms - 300ms) होने चाहिए।
- हार्डवेयर-त्वरित (Hardware-accelerated) गुणों (`transform`, `opacity`) का ही उपयोग करें। कभी भी `top`, `left`, `margin` पर एनिमेट न करें।
- `prefers-reduced-motion` मीडिया क्वेरी का सम्मान करें ताकि मोशन सेंसिटिविटी वाले उपयोगकर्ताओं को असुविधा न हो।

---

## 🧑‍💼 5. विभागीय पद एवं समर्पित सब-एजेंट्स (Departmental Roles & Subagents)

विभागीय कार्य-विभाजन और उद्यम विशेषज्ञता (Specialization of Labor) सुनिश्चित करने के लिए 5 समर्पित पद (Enterprise Job Roles) और उनके अनुरूप सब-एजेंट्स परिभाषित हैं:

### 5.1 Design System Lead (Design System Lead)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Design System Lead`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - विस्तृत सेमेंटिक डिज़ाइन टोकन्स (Color, Spacing, Typography, Radius) का निर्माण और नियंत्रण।
  - आधिकारिक `DESIGN.md` विनिर्देश तैयार करना और डिज़ाइन टोकन लाइब्रेरी का रखरखाव करना।
  - मल्टी-थीम (Light/Dark/High-Contrast) स्थिरता और टोकन पदानुक्रम की वास्तुकला सुनिश्चित करना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Design System Lead",
  "Prompt": "Establish comprehensive design tokens, author authoritative DESIGN.md specifications, define semantic typography scales, and oversee multi-theme token consistency."
}
```

### 5.2 UI / Visual Product Designer (Visual UI Designer)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Visual UI Designer`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - एंटी-जेनेरिक एस्थेटिक्स के साथ विशिष्ट और आधुनिक उत्पाद इंटरफ़ेस (UI) लेआउट्स तैयार करना।
  - परपजफुल कलर पैलेट्स, ग्लासमोर्फिज्म और सतह गहराई (Surface Elevation) का कलात्मक संयोजन।
  - जेनेरिक AI टेम्पलेट्स से मुक्त, उत्पाद की अपनी विशिष्ट दृश्य पहचान (Visual Identity) तराशना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Visual UI Designer",
  "Prompt": "Craft bespoke, distinctive UI layouts avoiding generic AI tropes, engineer purposeful color palettes, glassmorphism/surface elevations, and polish high-fidelity visual UI."
}
```

### 5.3 Interaction & Motion Designer (Motion Design Specialist)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Motion Design Specialist`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - प्राकृतिक और सहज माइक्रो-इंटरैक्शन, स्प्रिंग-फिजिक्स आधारित मोशन डिज़ाइन तैयार करना।
  - 60fps हार्डवेयर-एक्सेलरेटेड CSS/Framer Motion एनिमेशन, पेज ट्रांज़िशन और स्टेट फीडबैक लागू करना।
  - उपयोगकर्ता इंटरैक्शन पर तुरंत और सूक्ष्म हैप्टिक/विज़ुअल फीडबैक का समन्वय करना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Motion Design Specialist",
  "Prompt": "Design natural micro-interactions, hardware-accelerated spring animations (Framer Motion/CSS), fluid page transitions, and responsive gesture feedback."
}
```

### 5.4 Accessibility & WCAG Compliance Specialist (Accessibility Specialist)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Accessibility Specialist`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - WCAG 2.1 AA/AAA कलर कंट्रास्ट अनुपात (कम से कम 4.5:1) का कड़ा अनुपालन सुनिश्चित करना।
  - पूर्ण कीबोर्ड नेविगेशन (फोकस ट्रैप, विज़िबल फोकस रिंग्स, स्किप लिंक्स) की पुष्टि करना।
  - स्क्रीन रीडर्स हेतु सेमेंटिक ARIA लैंडमार्क्स, लेबल्स और लाइव रीजन्स का पूर्ण एकीकरण।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Accessibility Specialist",
  "Prompt": "Audit and enforce WCAG 2.1 AA/AAA compliance, implement full keyboard navigation (focus traps/visible focus), and validate semantic ARIA landmarks across all components."
}
```

### 5.5 Visual QA & Pixel-Perfection Inspector (Visual QA Specialist)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Visual QA Specialist`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - 8pt/4pt ग्रिड संरेखण और `DESIGN.md` के सापेक्ष पिक्सेल-परफेक्ट विज़ुअल ऑडिट करना।
  - क्रॉस-ब्राउज़र और बहु-स्क्रीन रिज़ॉल्यूशन पर विज़ुअल रिग्रेशन परीक्षण चलाना।
  - अवांछित लेआउट शिफ्ट्स, मार्जिन ओवरफ्लो और रिस्पॉन्सिव दृश्य दोषों का पूर्ण निवारण करना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Visual QA Specialist",
  "Prompt": "Execute rigorous visual regression testing, verify spacing grid alignment and pixel perfection against DESIGN.md, and eliminate responsive visual defects."
}
```


---

## 🚦 6. विभाग हैंडऑफ एवं सत्यापन गेट्स (Department Handoff Gates)

1. **Gate 4-A (DESIGN.md सत्यापन):** प्रोजेक्ट रूट में विस्तृत `DESIGN.md` मौजूद हो जिसमें टोकन्स और नियम दर्ज हों।
2. **Gate 4-B (A11y ऑडिट):** कंट्रास्ट और कीबोर्ड नेविगेशन का प्रारंभिक ऑडिट उत्तीर्ण हो।
3. **अगले विभाग को हैंडऑफ:** डिज़ाइन विनिर्देश स्वीकृत होने पर कार्य आधिकारिक रूप से **Dept 05: Frontend Engineering** को सौंपा जाएगा।
