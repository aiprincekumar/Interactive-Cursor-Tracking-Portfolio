# Interactive Cursor-Tracking Portfolio — Complete Features Memory & Architecture Dossier

> **दस्तावेज़ संस्करण (Document Version):** 3.0.0 (Production Master — Exhaustive Codebase Audit)  
> **अंतिम अद्यतन (Last Updated):** 2026-10-20  
> **परियोजना (Project):** Interactive Cursor-Tracking Portfolio (अतुल वर्मा / Atul Verma)  
> **स्थान (Location):** `docs/FEATURES_MEMORY.md`  
> **भाषा (Language):** Hinglish (सरल, स्पष्ट हिंदी + मानकीकृत तकनीकी अंग्रेज़ी शब्दावली)  
> **प्रौद्योगिकी स्टैक (Tech Stack):** React 19, Vite 8, Tailwind CSS v4, Web Audio API Synthesizer, Web Speech API (TTS), 120 FPS HTML5 Canvas 2D, Leaflet.js, JSZip, Canvas-Confetti, Lucide-react, Oxlint

---

## 📌 कार्यकारी सारांश एवं आर्किटेक्चर अवलोकन (Executive Architecture Overview)

यह दस्तावेज़ **Interactive Cursor-Tracking Portfolio** के प्रत्येक मॉड्यूल, कंपोनेंट, हुक, कॉन्टेक्स्ट, यूटिलिटी, साउंड इफ़ेक्ट, कीबोर्ड शॉर्टकट, बिल्ड पाइपलाइन और माइक्रो-इंटरैक्शन का एक संपूर्ण, अटूट और विस्तृत 'फीचर्स मेमोरी' (Features Memory) मास्टर रिकॉर्ड है। संपूर्ण कोडबेस (All files in `src/`, `public/`, `scripts/`, root configs) के गहन फोरेंसिक ऑडिट के बाद इसे 259+ विस्तृत फीचर्स के साथ अद्यतित किया गया है।

इस पोर्टफोलियो को आधुनिक वेब टेक्नोलॉजीज की उच्चतम क्षमताओं के साथ डिज़ाइन किया गया है:
1. **मल्टी-ट्रैक रोल आर्किटेक्चर (Multi-Role Track System):** 5 एकीकृत ट्रैक्स — **Overview**, **Accountant & Tax**, **MIS & Analytics**, **Vibe Coding**, और **Other (AI-Synthesized Controller)** — जो URL पैरामीटर्स (`?role=...`), `localStorage`, और कस्टम इवेंट्स के साथ 100% सिंक्रनाइज़ रहते हैं।
2. **35 कस्टमाइज़्ड कर्सर एवं 120 FPS काइनेमैटिक्स (Custom Cursors & Kinematics Engine):** 7 श्रेणियों (Living & Nature, Cosmic & Magic, Tech & Cyberpunk, Playful & Vehicles, Elemental & Forces, Precision & Design, Arcade & Retro) में फैले 35 कर्सर शैलियाँ, जो एक्सपोनेंशियल स्मूथिंग (Exponential Lerp), हेडिंग रोटेशन (Heading Angle), एरोडायनामिक बैंकिंग (Aerodynamic Banking), और एडिटिव पार्टिकल ट्रेल कैनवस के साथ चलते हैं।
3. **पोर्टफोलियो कंट्रोल सेंटर एवं लैब स्टूडियो (Portfolio Control Center & Lab Studio):** 5 कैलिब्रेशन टैब्स (Audio Studio, Cursor Dynamics, Hero Tracking, Preferences, Display & Visuals) जिसमें 1-क्लिक फ़ैक्टरी रीसेट, मल्टी-टैब स्टोरेज सिंक और वेब स्पीच इंजन (TTS) शामिल है।
4. **एक्सेसिबिलिटी एवं समावेशी डिज़ाइन (WCAG 2.1 AAA Accessibility):** हाई-कंट्रास्ट मोड (Alt+H), सिंपल मोड (कम-संसाधन पठन मोड), एआरआईए लाइव अनाउंसर्स (ARIA Live Regions), वेब स्पीच वॉयस फोकस अनाउंसर, और स्ट्रिक्ट कीबोर्ड ट्रैपिंग (`useFocusTrap`)।
5. **शून्य-विलंबता वेब ऑडियो सिंथेसाइज़र (Zero-Latency Web Audio API Synthesizer):** बिना किसी बाहरी MP3/WAV फ़ाइल के, ऑसिलेटर और नॉइज़ जनरेटर के माध्यम से कैमरा शटर, स्पार्कल, बबल पॉप, लेज़र बीप, क्रिस्टल चाइम और हैप्टिक क्लिक्स का रीयल-टाइम निर्माण।
6. **हाइब्रिड ऑफ़लाइन मैप एवं पोलरॉइड एक्सपोर्टर (Hybrid Offline Map & Polaroid Studio):** लोकली टाइल-कैश्ड लीफ़लेट मैप (साइबरपंक डार्क मोड फ़िल्टर के साथ) और जेएसज़िप (JSZip) के साथ संपूर्ण फोटो एल्बम का 1-क्लिक ज़िप एक्सपोर्ट।
7. **शून्य-क्लैश फ्लोटिंग कॉलम आर्किटेक्चर (Collision-Free Right-Rail Column):** सिंपल मोड और कांटेक्ट अनलॉक स्थितियों के अनुरूप स्वतः पुनर्व्यवस्थित होने वाले 4 फ्लोटिंग बटन्स (Lab FAB, WhatsApp, Simple Mode, Back to Top)।
8. **ऑटोमेटेड वेरिफिकेशन एवं टेस्ट पाइपलाइन (Automated 19-Script Verification):** 19 स्वतंत्र वेरिफिकेशन और एडवर्सैरियल टेस्ट सूट्स जो लेआउट डेंसिटी, मैप बाउंड्स, ऑडियो, और रोल्स की अखंडता प्रमाणित करते हैं।

---

## 🗂️ मॉड्यूल संरचना अनुक्रमणिका (Module Directory Index)

- [मॉड्यूल 1: कोर लेआउट और UI सेक्शन्स (Core Layout & UI Sections)](#module-1)
- [मॉड्यूल 2: कस्टम कर्सर सिस्टम और डायनामिक एनिमेशन्स (Custom Cursor System & Kinematics)](#module-2)
- [मॉड्यूल 3: लैब स्टूडियो, डेमो मोड्स और स्पेशल फीचर्स (Lab Studio, Demo Modes & Special Features)](#module-3)
- [मॉड्यूल 4: एक्सेसिबिलिटी, थीम और यूजर कंट्रोल्स (Accessibility, Theme & User Controls)](#module-4)
- [मॉड्यूल 5: स्टेट मैनेजमेंट, हुक्स, ऑडियो इंजन और कोर यूटिलिटीज (State Management, Hooks, Audio Engine & Core Utilities)](#module-5)
- [मॉड्यूल 6: बिल्ड, परफॉरमेंस, डेव टूल्स और कॉन्फ़िगरेशन सिस्टम (Build, Performance, Dev Tools & Configuration)](#module-6)
- [संपूर्ण फीचर्स सारांश एवं गणना मैट्रिक्स (Comprehensive Summary Matrix)](#summary-matrix)

---

<a id="module-1"></a>
## 🏛️ मॉड्यूल 1: कोर लेआउट और UI सेक्शन्स (Core Layout & UI Sections)

यह मॉड्यूल पोर्टफोलियो के मुख्य दृश्य घटकों (Visual Sections), पेज नेविगेशन, रिबन, हेरो स्टेज, और फ़ूटर एलिमेंट्स को कवर करता है।

### 1.1 अनुभाग विवरण एवं वास्तुकला (Section Architectural Details)

1. **Top Navbar (`Navbar.jsx`):**
   - **स्क्रॉल प्रोग्रेस बार (ScrollProgressBar):** शीर्ष पर 2.5px की बारीक ग्रेडिएंट लाइन जो पेज के स्क्रॉल प्रतिशत को रीयल-टाइम 60 FPS पर प्रदर्शित करती है।
   - **डायनामिक अवतार एवं ब्रांडिंग:** एक्टिव रोल के अनुसार प्रोफ़ाइल पिक्चर (`Overview.jpg`, `Accountant.jpg`, `MIS.jpg`, `VibeCoder.jpg`, `Others.jpg`) और रोल का नाम स्वतः स्विच होता है।
   - **क्विक रोल स्विचर पिल (Role Pill):** नेवबार में सीधे रोल बदलने वाला इंटरएक्टिव बटन जो `RoleTabsBar` को ओपन करता है।
   - **नेविगेशन लिंक्स:** Who I am (`#about`), What I work with (`#skills`), Journey (`#experience`), Selected work (`#projects`), Achievements (`#achievements`), Testimonials (`#social-proof`), Contact (`#contact`) पर स्मूथ स्क्रॉल।
   - **ग्लोबल सर्च ट्रिगर (Ctrl+K):** सर्च आइकॉन बटन जो `CommandPalette` को सक्रिय करता है।
   - **कर्सर स्विचर ट्रिगर:** वर्तमान में सक्रिय कर्सर का आइकॉन और बैज, जिस पर क्लिक करने से कर्सर सेलेक्टर रिबन खुलता है।
   - **रेज़्यूमे ड्रॉपडाउन (ResumeDropdown):** एक्टिव रोल के अनुसार कस्टमाइज़्ड रेज़्यूमे डाउनलोड करने वाला स्प्लिट-बटन।
   - **सिंपल मोड, थीम और ऑडियो टोगल्स:** 1-क्लिक में सिंपल मोड, डार्क/लाइट थीम, और म्यूट/अनम्यूट टॉगल।
   - **मोबाइल ड्रॉअर एवं फोकस ट्रैप:** 768px से नीचे हैमबर्गर मेनू जो स्लाइड-आउट ड्रॉअर खोलता है, जिसमें `useFocusTrap` और `useBodyScrollLock` सक्रिय होते हैं।

2. **हेरो सेक्शन (`HeroSection.jsx`):**
   - **2.5D कर्सर-ट्रैकिंग हेरो स्टेज:** 10 अलग-अलग कैरेक्टर पोज़ (00-Rear View, 01-Center Up, 02-Lower Center, 03-Center Left, 04-Center Right, 05-Center Front, 06-Upper Left, 07-Lower Left, 08-Upper Right, 09-Lower Right)।
   - **स्मूथ क्यूबिक हर्माइट पोज़ क्रॉसफ़ेडिंग:** कर्सर की दिशा (X, Y) के आधार पर बिना किसी जिटर (Jitter) के पोज़ के बीच रीयल-टाइम ओपेसिटी ब्लेंडिंग।
   - **कैरेक्टर ड्रैग-एंड-ड्रॉप (`useDraggableCharacter`):** 250ms लॉन्ग-प्रेस के बाद कैरेक्टर को स्टेज पर कहीं भी ड्रैग किया जा सकता है। डबल-क्लिक या डबल-टैप करने पर स्प्रिंग ऑसिलेशन के साथ केंद्र (0,0) पर वापस आता है।
   - **कैरेक्टर ज़ूम एवं फोकस HUD:** 0.5x से 2.0x ज़ूम कंट्रोल और हेड, सेंटर या फ़ीट पर ट्रांसफ़ॉर्म ओरिजिन सेट करने की सुविधा।
   - **शूट अ लुक 📸 (Shoot a Look):** विंटेज कैमरा शटर साउंड, कैनवस कंफ़ेटी, और व्हाइटआउट फ्लैश के साथ रीयल-टाइम पोलरॉइड स्नैपशॉट कैप्चर करता है।
   - **सोशल लिंक्स डॉक:** बॉटम-लेफ्ट में नोशन, गिटहब, लिंक्डइन, यूट्यूब, फेसबुक, इंस्टाग्राम, और एक्स (ट्विटर) के इंटरएक्टिव आइकॉन्स।
   - **रोल-बेस्ड हेडलाइन एवं सब-टाइटल:** रोल बदलने पर हेरो का टेक्स्ट स्मूथ फ़ेड इफ़ेक्ट के साथ बदलता है।

3. **टेक मार्की बैनर (`TechMarqueeBanner.jsx`):**
   - **डायगोनल क्रॉस्ड रिबन्स:** दो समानांतर विपरीत दिशाओं में घूमने वाली स्ट्रिप्स (शीर्ष पट्टी बाईं ओर, निचली पट्टी दाईं ओर)।
   - **बटरफ्लाई डेलिमिटर्स (🦋):** प्रत्येक टेक्नोलॉजी चिप के बीच एनिमेटेड बटरफ्लाई सेपरेटर।
   - **इंटरएक्टिव चिप टूलटिप्स:** किसी भी चिप पर होवर या क्लिक करने पर उसकी विस्तृत महारत, ट्रैक और विवरण दिखता है, और संबंधित स्किल सेक्शन पर ऑटो-जंप की सुविधा मिलती है।
   - **सिंपल मोड में स्वतः छिपाव:** सिंपल मोड में यह सेक्शन पूरी तरह अनमाउंट रहता है ताकि क्लटर न हो।

4. **अबाउट सेक्शन (`AboutSection.jsx`):**
   - **3 मुख्य टैब्स:** 'Story & Vision' (व्यक्तिगत narrative), 'Qualifications' (अकादमिक टाइमलाइन), और 'Official Bio-Data' (सत्यापित डॉसियर)।
   - **रोल-विशिष्ट कॉम्पिटेंसी पिलर्स:** अकाउंटेंट, एमआईएस, वाइब कोडर और कॉर्पोरेट कंट्रोलर के 4-4 विशिष्ट कोर पिलर्स।
   - **1-क्लिक बायो-डेटा कॉपी:** पूरा आधिकारिक बायो-डेटा क्लिपबोर्ड में कॉपी करने की सुविधा।
   - **सीवी डाउनलोड लिंक:** वर्ड और पीडीएफ फॉर्मेट में सीवी डाउनलोड।

5. **स्किल्स मैट्रिक्स (`SkillsSection.jsx`):**
   - **4 कोर श्रेणियां + वाइब कोडिंग:** Accounting & Tax, Software & Applications, Operations & Management, Specialized Aptitudes, और AI Engineering।
   - **इंटरएक्टिव डार्क प्रीव्यू कार्ड:** किसी भी स्किल चिप पर क्लिक/होवर करने पर दाईं ओर उसका विस्तृत विवरण, 4 मुख्य कार्य बिंदु और प्रतिशत बार एनिमेट होता है।

6. **एक्सपीरियंस सेक्शन (`ExperienceSection.jsx`):**
   - **कैरियर माइलस्टोन्स एवं रोल फ़िल्टरिंग:** 2017 से वर्तमान तक के 7+ वर्षों का संपूर्ण कार्य अनुभव।
   - **ट्रैक हाइलाइट्स:** एक्टिव रोल के अनुसार संबंधित अनुभव स्वतः हाइलाइट और फ़िल्टर होते हैं।
   - **इंटरएक्टिव कार्ड एक्सपैंशन:** क्लिक करने पर विस्तृत डिलीवरेबल्स और उपयोग किए गए टेक स्टैक पिल्स का प्रकटीकरण।

7. **प्रोजेक्ट्स सेक्शन (`ProjectsSection.jsx`):**
   - **लाइव इंटरएक्टिव टर्मिनल्स:** 'PolicyGuard AI' (जीएसटी एवं आईटीआर ऑटोमेशन) और 'ApexPay' (मल्टी-कंपनी लेज़र एवं बीआरएस)।
   - **सिमुलेटर बटन:** टर्मिनल में 'Verify ITC', 'Reconcile BRS', और 'Generate Trial Balance' पर क्लिक करके रीयल-टाइम सिम्युलेटेड आउटपुट और ऑडियो सुनना।
   - **कंपैनियन एवं वाइब कोडिंग प्रोजेक्ट्स:** DAY-NULM Skill India, Smart Card Operations, Power BI Executive Intelligence, और Autonomous AI Agent Engine।

8. **कोडिंग एवं प्रोफेशन रिकॉर्ड्स (`CodingAchievementsSection.jsx`):**
   - **एनिमेटेड काउंटर्स (`AnimatedCounter.jsx`):** 500+ रिटर्न्स, 99.8% एक्यूरेसी, ₹25Cr+ वॉल्यूम, 0 पेनल्टी रिकॉर्ड्स।
   - **कंटीन्यूअस रनिंग टिकर:** प्रत्येक रोल के लिए विशेष अचीवमेंट टिकर।

9. **सोशल प्रूफ एवं टेस्टिमोनियल्स (`SocialProofSection.jsx`):**
   - **क्वांटिफायेबल इम्पैक्ट कार्ड्स:** कर्सर-ट्रैकिंग रेडियल स्पॉटलाइट इफ़ेक्ट के साथ मुख्य मेट्रिक्स।
   - **वेरिफाइड टेस्टिमोनियल्स कैरोसेल:** क्लाइंट्स और वरिष्ठ अधिकारियों के स्टार-रेटेड रिव्यूज़।
   - **फीडबैक प्रीव्यू टॉगल:** टेस्टिमोनियल कार्ड्स को दिखाने/छिपाने का कंट्रोल।

10. **कांटेक्ट सेक्शन (`ContactSection.jsx`):**
    - **मल्टी-फ़ील्ड संपर्क फ़ॉर्म:** Name, Email, WhatsApp, Company, Inquiry Type, Budget, Timeline, और Message।
    - **फ़ॉर्म सत्यापन एवं कंफ़ेटी:** सफल सबमिशन पर कैनवस कंफ़ेटी और ऑडियो विंग।
    - **व्हाट्सएप अनलॉकिंग मैकेनिज्म:** फ़ॉर्म भरने या बातचीत शुरू करने पर फ्लोटिंग व्हाट्सएप बटन अनलॉक होता है।
    - **लोकेशन हब एवं हाइब्रिड मैप:** मेदिनीनगर (डाल्टनगंज), पलामू, झारखंड का लोकेशन कार्ड और इंटरएक्टिव मैप टाइल्स।

11. **फ़ूटर (`Footer.jsx`):**
    - **जायंट वाटरमार्क टेक्स्ट:** रील के अनुरूप बैकग्राउंड में विशालकाय 'ATUL VERMA' वाटरमार्क।
    - **कॉपीराइट, क्रेडिट्स एवं बैक टू टॉप ट्रिगर:** स्मूथ स्क्रॉल-टू-टॉप बटन।

12. **फ्लोटिंग कंट्रोल्स एवं यूटिलिटी बटन्स:**
    - **बैक टू टॉप बटन (`BackToTopButton.jsx`):** सर्कुलर SVG प्रोग्रेस रिंग के साथ 400px स्क्रॉल के बाद प्रकट होता है।
    - **फ्लोटिंग सिंपल मोड टॉगल (`FloatingSimpleModeToggle.jsx`):** बिना नेवबार खोले कहीं से भी सिंपल मोड ऑन/ऑफ करने का FAB।
    - **फ्लोटिंग व्हाट्सएप बटन (`FloatingWhatsAppButton.jsx`):** कांटेक्ट सेक्शन से अनलॉक होने पर डायरेक्ट व्हाट्सएप चैट शुरू करने वाला बटन।
    - **एरिया लाइव अनाउंसर (`AriaLiveAnnouncer.jsx`):** स्क्रीन रीडर्स के लिए छिपे हुए polite और assertive लाइव रीजन्स।

---

### 1.2 मॉड्यूल 1: विस्तृत फ़ीचर एवं फ़ंक्शन तालिका (Detailed Features Table)

| क्र. सं. | फ़ीचर / फ़ंक्शन का नाम | संबंधित फ़ाइल / कंपोनेंट | मुख्य कार्य (Primary Action) | विस्तृत विवरण (Detailed Description) |
| :---: | :--- | :--- | :--- | :--- |
| 1.1 | **Scroll Progress Bar** | `src/components/ScrollProgressBar.jsx` | स्क्रॉल प्रोग्रेस प्रदर्शित करना | विंडो के कुल स्क्रॉल अनुपात (0% से 100%) को rAF लूप में कैलकुलेट करके टॉप नेवबार के नीचे एक बारीक रोज़-गोल्ड ग्रेडिएंट बार के रूप में दिखाता है। |
| 1.2 | **Dynamic Avatar Brand Icon** | `src/components/Navbar.jsx` | एक्टिव ट्रैक के अनुसार प्रोफ़ाइल फोटो बदलना | एक्टिव रोल के अनुसार `Overview.jpg`, `Accountant.jpg`, `MIS.jpg`, आदि लोड करता है; एरर होने पर फ़ॉलबैक इनिशियल्स और लोडिंग कंटीन्यूअस पल्स प्रदर्शित करता है। |
| 1.3 | **Quick Role Pill Switcher** | `src/components/Navbar.jsx`, `RoleTabsBar.jsx` | रोल मेनू को खोलना/बंद करना | नेवबार में वर्तमान रोल का बैज और शेवरॉन दिखाता है, जिस पर क्लिक करने पर सीधे `RoleTabsBar` खुल जाती है। |
| 1.4 | **Cursor Variant Ribbon Trigger** | `src/components/Navbar.jsx` | 35 कर्सर सेलेक्टर रिबन टॉगल | वर्तमान कर्सर का आइकॉन (जैसे तितली, फायरफ्लाई, लेज़र) प्रदर्शित करता है; क्लिक करने पर पूरी कर्सर गैलरी रिबन खुलती है। |
| 1.5 | **Split-Button Resume Download** | `src/components/ResumeDropdown.jsx` | 1-क्लिक रेज़्यूमे डाउनलोड व मेनू | मुख्य भाग पर क्लिक करने पर सीधे एक्टिव रोल का PDF डाउनलोड होता है; शेवरॉन पर क्लिक करने पर प्रिव्यू, लिंक कॉपी और प्रिंट विकल्प खुलते हैं। |
| 1.6 | **Global Spotlight Search Trigger** | `src/components/Navbar.jsx`, `CommandPalette.jsx` | कमांड पैलेट सर्च विंडो खोलना | `Ctrl+K` या `Cmd+K` दबाने या नेवबार सर्च आइकॉन पर क्लिक करने पर त्वरित फ़ज़ी-सर्च कमांड पैलेट सक्रिय करता है। |
| 1.7 | **Explore Sub-Bar Toggle** | `src/components/ExploreSubBar.jsx` | अतिरिक्त नेविगेशन लिंक्स दिखाना | गैलरी, कंट्रोल सेंटर, क्विक ड्रॉअर और सिंपल मोड टॉगल के लिए एक कॉम्पैक्ट सब-नेविगेशन बार प्रस्तुत करता है। |
| 1.8 | **Master Audio Toggle** | `src/components/Navbar.jsx`, `LabContext.jsx` | संपूर्ण ऑडियो इंजनों को म्यूट/अनम्यूट करना | एक क्लिक में पूरे पोर्टफोलियो के वेब ऑडियो सिंथेसाइज़र को म्यूट करता है और `localStorage` में सिंक करता है। |
| 1.9 | **Theme Mode Switcher** | `src/components/Navbar.jsx`, `ThemeContext.jsx` | डार्क एवं लाइट मोड टॉगल | स्मूथ 350ms ट्रांज़िशन क्लास के साथ HTML रूट पर `.dark` क्लास जोड़ता/हटाता है और स्पार्कल ऑडियो फ़ीडबैक देता है। |
| 1.10 | **Simple Reading Mode Toggle** | `src/components/Navbar.jsx`, `SimpleModeContext.jsx` | कम-संसाधन पठन मोड सक्रिय करना | भारी 3D, कैनवस और कर्सर्स को अनमाउंट करके एक साफ-सुथरा, स्टैंडर्ड कर्सर वाला टेक्स्ट-फर्स्ट पोर्टफोलियो लेआउट सक्रिय करता है। |
| 1.11 | **Mobile Navigation Drawer** | `src/components/Navbar.jsx`, `useBodyScrollLock.js` | मोबाइल मेनू और बैकड्रॉप स्क्रॉल लॉक | 768px से नीचे पूर्ण-स्क्रीन ड्रॉअर प्रस्तुत करता है; ड्रॉअर खुला होने पर बॉडी स्क्रॉल को पूरी तरह लॉक रखता है। |
| 1.12 | **2.5D Head & Gaze Tracking** | `src/components/HeroSection.jsx` | माउस दिशा में कैरेक्टर का मुड़ना | कर्सर की दिशा (X,Y) का विश्लेषण करके 10 विभिन्न पोज़ (फ्रंट, लेफ्ट, राइट, अप, डाउन आदि) के बीच हर्माइट ब्लेंडिंग से सिर घुमाता है। |
| 1.13 | **Draggable Hero Character** | `src/hooks/useDraggableCharacter.js` | कैरेक्टर को मंच पर कहीं भी ड्रैग करना | 250ms लॉन्ग-प्रेस के बाद पॉइंटर कैप्चर API के साथ कैरेक्टर को ड्रैग करने देता है; डबल-टैप करने पर स्प्रिंग ऑसिलेशन से सेंटर में रीसेट करता है। |
| 1.14 | **Character Zoom & Anchor HUD** | `src/components/HeroSection.jsx` | कैरेक्टर स्केल 0.5x-2.0x बदलना | इन-पेज HUD बटन्स से कैरेक्टर का आकार बड़ा/छोटा करने और ज़ूम का फोकस हेड, सेंटर या फ़ीट पर तय करने की सुविधा। |
| 1.15 | **Shoot a Look 📸 Polaroid Snapshot** | `src/components/HeroSection.jsx`, `polaroidExport.js` | रीयल-टाइम पोलरॉइड फोटो खींचना | फ्लैश व्हाइटआउट, शटर साउंड, और कंफ़ेटी ब्लास्ट के साथ वर्तमान कैरेक्टर पोज़ का विंटेज पोलरॉइड फोटो बनाकर नीचे गैलरी में भेजता है। |
| 1.16 | **Hero Social Dock** | `src/components/HeroSection.jsx`, `Icons.jsx` | 7 पेशेवर सोशल मीडिया प्रोफाइल खोलना | नोशन, गिटहब, लिंक्डइन, यूट्यूब, फेसबुक, इंस्टाग्राम और एक्स के आधिकारिक ब्रांड आइकॉन्स और एक्सटर्नल लिंक्स। |
| 1.17 | **Dynamic Marquee Ribbons** | `src/components/TechMarqueeBanner.jsx` | विपरीत दिशाओं में घूमती टेक स्ट्रिप्स | शीर्ष पट्टी बाईं ओर और निचली पट्टी दाईं ओर घूमती है; बीच में तितली डेलिमिटर्स होते हैं; होवर करने पर पॉज़ होती है। |
| 1.18 | **Marquee Chip Detail Inspector** | `src/components/TechMarqueeBanner.jsx` | टेक चिप पर क्लिक करके जानकारी पाना | किसी भी टेक चिप (उदा. Tally Prime, Cursor IDE) पर क्लिक करने पर विस्तृत टूलटिप खुलती है और संबंधित स्किल पर स्मूथ स्क्रॉल होता है। |
| 1.19 | **About Section 3-Tab Architecture** | `src/components/AboutSection.jsx` | कहानी, योग्यता और बायो-डेटा स्विच | 'Story & Vision', 'Qualifications' और 'Official Bio-Data' के बीच बिना पेज रीलोड के टैब स्विचिंग। |
| 1.20 | **1-Click Bio-Data Clipboard Copy** | `src/components/AboutSection.jsx` | पूरा बायो-डेटा टेक्स्ट कॉपी करना | जन्मतिथि, शिक्षा, संपर्क और भाषा विवरण को संरचित रूप में क्लिपबोर्ड में कॉपी करता है और 2 सेकंड के लिए चेक आइकॉन दिखाता है। |
| 1.21 | **Interactive Skill Matrix** | `src/components/SkillsSection.jsx` | स्किल कार्ड्स और महारत का चयन | 5 श्रेणियों में वर्गीकृत स्किल्स पर क्लिक करके उनकी विस्तृत जानकारी और प्रतिशत स्कोर देखना। |
| 1.22 | **Skill Dark Preview Dashboard** | `src/components/SkillsSection.jsx` | स्किल का इन-डेप्थ विश्लेषण कार्ड | चयनित स्किल का नाम, श्रेणी, महारत प्रतिशत बार, और 4 बुलेट पॉइंट्स के साथ विस्तृत कार्य अनुभव प्रदर्शित करता है। |
| 1.23 | **Career Timeline Filtering** | `src/components/ExperienceSection.jsx` | रोल के अनुसार कार्य अनुभव छांटना | एक्टिव रोल (अकाउंटेंट / एमआईएस / वाइब कोडर) के अनुसार केवल प्रासंगिक कंपनियों और समयावधियों को प्रदर्शित करता है। |
| 1.24 | **Experience Deliverables Expansion** | `src/components/ExperienceSection.jsx` | मुख्य उपलब्धियां और टेक स्टैक देखना | प्रत्येक अनुभव कार्ड में उसके मुख्य कार्य, हासिल किए गए परिणाम और उपयोग किए गए टूल्स की सूची दिखाता है। |
| 1.25 | **PolicyGuard AI Interactive Terminal** | `src/components/ProjectsSection.jsx` | जीएसटी एवं टैक्स ऑडिट सिमुलेशन | टर्मिनल में 'Verify ITC', 'GSTR-2B Matching', और 'Notice Predictor' बटन्स दबाकर लाइव टैक्स ऑडिट सिम्युलेट करना। |
| 1.26 | **ApexPay Ledger Simulator Terminal** | `src/components/ProjectsSection.jsx` | लेज़र और बीआरएस मिलान सिमुलेशन | 'Voucher Entry', 'BRS Auto-Match', और 'Balance Sheet Audit' चलाकर दोहरे प्रविष्टि लेज़र ऑटोमेशन का परीक्षण करना। |
| 1.27 | **Animated Metrics Counters** | `src/components/AnimatedCounter.jsx` | शून्य से लक्ष्य संख्या तक एनीमेशन | संख्यात्मक डेटा (उदा. 500+, 99.8%, 10,000+) को स्क्रॉल-इन-व्यू होने पर स्मूथ ईज़िंग के साथ गिनकर दिखाता है। |
| 1.28 | **Impact Metric Cursor Spotlight** | `src/components/SocialProofSection.jsx` | माउस की स्थिति पर रेडियल चमक | सोशल प्रूफ कार्ड्स पर माउस ले जाने पर कर्सर के ठीक नीचे एक्टिव एक्सेंट कलर का रेडियल ग्रेडिएंट प्रकाश घूमता है। |
| 1.29 | **Client Testimonials Carousel** | `src/components/SocialProofSection.jsx` | क्लाइंट समीक्षाएं पढ़ना | सत्यापित क्लाइंट्स के प्रशंसापत्र, स्टार रेटिंग्स, और पदनाम प्रदर्शित करता है; नेक्स्ट/प्रीव बटन से स्लाइड होता है। |
| 1.30 | **Interactive Contact Form** | `src/components/ContactSection.jsx` | संदेश और परियोजना पूछताछ भेजना | नाम, ईमेल, व्हाट्सएप, कंपनी, बजट और संदेश इनपुट; क्लाइंट-साइड सत्यापन और सबमिट पर कंफ़ेटी ब्लास्ट। |
| 1.31 | **Direct WhatsApp Channel Unlocker** | `src/components/ContactSection.jsx`, `FloatingWhatsAppButton.jsx` | व्हाट्सएप फ्लोटिंग बटन सक्रिय करना | संपर्क फ़ॉर्म में इंटरैक्शन करने पर फ्लोटिंग व्हाट्सएप बटन अनलॉक होता है और `localStorage` में सिंक रहता है। |
| 1.32 | **Interactive Leaflet Offline Map** | `src/components/LeafletOfflineMap.jsx` | मेदिनीनगर शहर का ऑफ़लाइन मैप | स्थानीय टाइल फ़ोल्डर (`/assets/tiles/`) से पूरी तरह ऑफ़लाइन मैप रेंडर करता है; ज़ूम इन, ज़ूम आउट और लैंडमार्क्स प्रदर्शित करता है। |
| 1.33 | **Vector Map SVG/PNG Fallback** | `src/components/OfflineMapSnapshot.jsx` | कम-संसाधन डिवाइस हेतु मैप स्नैपशॉट | यदि लीफ़लेट लोड न हो सके, तो वेक्टर SVG और रेंडर की गई इमेज के साथ प्रमुख शहर लैंडमार्क्स प्रदर्शित करता है। |
| 1.34 | **Watermark Footer Banner** | `src/components/Footer.jsx` | विशाल बैकग्राउंड नाम और ब्रांडिंग | रील के अंतिम फ्रेम के अनुसार बैकग्राउंड में 'ATUL VERMA' का 14vw वाटरमार्क, कॉपीराइट और स्क्रॉल-टू-टॉप ट्रिगर। |
| 1.35 | **Back to Top Circular FAB** | `src/components/BackToTopButton.jsx` | 1-क्लिक शीर्ष पर पहुँचना | 400px स्क्रॉल के बाद स्क्रीन के बॉटम-राइट में प्रकट होता है; चारों ओर सर्कुलर प्रोग्रेस रिंग होती है; क्लिक पर स्पार्कल साउंड। |
| 1.36 | **Screen Reader ARIA Live Announcer** | `src/components/AriaLiveAnnouncer.jsx` | दृष्टिबाधित उपयोगकर्ताओं को ऑडियो संदेश | जब भी रोल बदलता है या कोई महत्वपूर्ण क्रिया होती है, तो छिपे हुए `aria-live="polite"` क्षेत्र में स्क्रीन रीडर हेतु घोषणा की जाती है। |
| 1.37 | **Verified Testimonials Engine** | `src/components/TestimonialsSection.jsx`, `testimonialsConfig.js` | क्लाइंट व सहकर्मी अनुशंसाएं प्रदर्शित करना | शून्य-कोड शुद्ध कॉन्फ़िगरेशन (`TESTIMONIALS_CONFIG.enabled`), डायनामिक कैटेगरी टैब फ़िल्टर ('Accounting & Tax', 'MIS', 'Full-Stack'), स्टार रेटिंग्स, और सत्यापिक स्टेकहोल्डर एंडोर्समेंट बैज प्रदान करता है। |
| 1.38 | **Explore Sub-Bar Navigation Matrix** | `src/components/ExploreSubBar.jsx` | त्वरित सब-नेविगेशन और ड्रॉअर ट्रिगर | 3 दृश्य वेरिएंट्स (`floating-bar`, `dock`, `pill-strip`), क्विक ड्रॉअर कस्टम इवेंट (`portfolio:open-lab-drawer`), सिंपल मोड स्विच, और रोविंग कीबोर्ड फोकस (`Home`, `End`, एरो कीज़)। |
| 1.39 | **RoleTabsBar Multi-Variant Engine** | `src/components/RoleTabsBar.jsx` | 6 लेआउट्स में रोल स्विचिंग बार | 6 स्वतंत्र दृश्य शैलियाँ (`section`, `navbar`, `mobile-header`, `drawer`, `floating-bar`, `sub-bar`), तथा स्क्रीन रीसाइज़ या ओरिएंटेशन बदलने पर सक्रिय टैब को सेंटर में लाने की सुविधा (`scrollIntoView({ inline: 'center' })`)। |
| 1.40 | **Hero Parallax Tilt Dynamics** | `src/components/HeroSection.jsx` | 3D लंबन बैकड्रॉप गहराई प्रभाव | माउस कर्सर और मोबाइल जायरोस्कोप के झुकाव के अनुसार हेरो बैकग्राउंड लेयर्स पर स्मूथ 3D डैम्प्ड टिल्ट एनीमेशन प्रदान करता है; कंट्रोल सेंटर से ऑन/ऑफ करने की सुविधा। |
| 1.41 | **Hero Character Scaling & Focus HUD** | `src/components/HeroSection.jsx` | कैरेक्टर ज़ूम (0.5x-2.0x) और एंकर फोकस | इन-पेज HUD बटन्स द्वारा कैरेक्टर स्केल बदलना, लाइव ज़ूम प्रतिशत टूलटिप दिखाना, और ज़ूम का केंद्र हेड (`50% 18%`), सेंटर (`50% 50%`), या फ़ीट (`50% 90%`) पर एंकर करना। |
| 1.42 | **Hero 2.5D Pose Hermite Crossfade Loop** | `src/components/HeroSection.jsx` | 10 पोज़ के बीच 120 FPS स्मूथ ट्रांज़िशन | शून्य रिएक्ट री-रेंडर चर्न के साथ डेडिकेटेड rAF लूप में क्यूबिक हर्माइट ब्लेंडिंग के जरिए सिर और दृष्टि (Gaze) को कर्सर दिशा में बिना किसी झटके के घुमाता है। |
| 1.43 | **Shoot a Look Camera Flash Whiteout** | `src/components/HeroSection.jsx`, `src/index.css` | असली कैमरा फ्लैश प्रभाव और व्हाइटआउट | 0.45s का `@keyframes cameraFlash` व्हाइटआउट एनीमेशन, मैकेनिकल शटर साउंड, कैनवस कंफ़ेटी ब्लास्ट और पोलरॉइड गैलरी में रियल-टाइम फोटो डिलीवरी। |
| 1.44 | **Contact Section 3-Tab Hub** | `src/components/ContactSection.jsx` | पूछताछ, सीधे संपर्क और मैप हब | 'Get in Touch' (फ़ॉर्म), 'Direct Details' (गेted अनलॉक), और 'Location & Office' (मेदिनीनगर मैप) के बीच सहज टैब स्विचिंग और बाहरी `switch-contact-tab` इवेंट सपोर्ट। |
| 1.45 | **Gated Direct Contact Security & 24h Expiry**| `src/components/ContactSection.jsx` | प्रत्यक्ष संपर्क विवरणों की बॉट सुरक्षा | फ़ॉर्म में इंटरैक्शन करने पर सीधे फ़ोन/व्हाट्सएप विवरण 24 घंटे के लिए अनलॉक होते हैं (`portfolio_contact_unlocked`); 24 घंटे बाद स्वतः लॉक हो जाते हैं। |
| 1.46 | **Dynamic Contact Form Validation & Alerts** | `src/components/ContactSection.jsx` | फ़ॉर्म इनपुट सुरक्षा और लाइव फीडबैक | नाम, ईमेल, व्हाट्सएप, कंपनी, बजट, रोल और टाइमलाइन का क्लाइंट-साइड सत्यापन, त्रुटि होने पर एनिमेटेड टोस्ट और सबमिशन पर कंफ़ेटी विंग। |
| 1.47 | **Defensive Clipboard Copy Fallback** | `src/components/ContactSection.jsx` | प्रतिबंधित वातावरण में क्लिपबोर्ड कॉपी | यदि ब्राउज़र में `navigator.clipboard` ब्लॉक हो, तो स्वचालित रूप से छिपे हुए `textarea` और `document.execCommand('copy')` से ईमेल व पता कॉपी करता है। |
| 1.48 | **7-Brand Social Profile Grid** | `src/components/ContactSection.jsx`, `Icons.jsx` | आधिकारिक सोशल प्रोफाइल हब | GitHub, LinkedIn, Notion, Instagram, YouTube, Twitter (X), और Facebook के पिक्सेल-परफेक्ट एसवीजी ब्रांड आइकॉन्स और व्यक्तिगत ग्रेडिएंट होवर इफ़ेक्ट्स। |
| 1.49 | **4-Track Competency Matrix** | `src/components/AboutSection.jsx` | चारों व्यावसायिक ट्रैक्स के कोर पिलर्स | Accountant, MIS, Vibe Coder, और Corporate Controller के 4-4 विशिष्ट कोर पिलर्स, टैग्स और विस्तृत डिलीवरेबल्स का संरचित प्रदर्शन। |
| 1.50 | **Academic Timeline & Verified Credentials** | `src/components/AboutSection.jsx` | कालानुक्रमिक अकादमिक टाइमलाइन | मैट्रिकुलेशन, इंटरमीडिएट ऑफ कॉमर्स, बी.कॉम (नीलांबर-पीतांबर यूनिवर्सिटी), और एडीसीए (इन्फोसिटी डाल्टनगंज) का सत्यापित क्रेडेंशियल रिकॉर्ड। |
| 1.51 | **Continuous Running Achievement Tickers** | `src/components/CodingAchievementsSection.jsx`| सतत गतिमान अचीवमेंट रिबन | प्रत्येक रोल के लिए अलग सतत चलने वाली टिकर स्ट्रिप जो 7+ वर्षों के अनुभव, शून्य पेनल्टी, और 500+ रिटर्न्स के माइलस्टोन्स प्रदर्शित करती है। |
| 1.52 | **PolicyGuard AI Live Audit Terminal** | `src/components/ProjectsSection.jsx` | जीएसटी एवं टैक्स ऑडिट सिमुलेटर | 'Run Full Audit', 'Verify ITC Reversal', 'Validate HSN/SAC', और 'Notice Predictor' बटन्स के साथ रियल-टाइम कलर्ड टर्मिनल लॉग्स और स्टेटस चिप्स। |
| 1.53 | **ApexPay BRS & Ledger Simulator** | `src/components/ProjectsSection.jsx` | दोहरा लेखा एवं बीआरएस मिलान सिमुलेटर | 'Reconcile BRS', 'Auto-Match Vouchers', और 'Generate Trial Balance' चलाकर लाइव लेज़र अकाउंटिंग और बैंक रिकॉन्सिलिएशन लॉग्स देखना। |
| 1.54 | **Dynamic WhatsApp Pre-filled Inquiry** | `src/components/FloatingWhatsAppButton.jsx` | व्यक्तिगत व्हाट्सएप संदेश तैयार करना | संपर्क फ़ॉर्म में भरे गए उपयोगकर्ता के नाम, चुने गए रोल और संदेश को स्वतः URL-एन्कोड करके `https://wa.me/917992383804?text=...` पर भेजता है। |
| 1.55 | **Collision-Free Right-Rail Floating Column** | `BackToTopButton.jsx`, `FloatingSimpleModeToggle.jsx`, `FloatingWhatsAppButton.jsx`, `LabStudioDrawer.jsx` | फ्लोटिंग बटनों का शून्य-क्लैश संरेखण | सिंपल मोड और कांटेक्ट अनलॉक स्थितियों के अनुसार बटनों की लंबवत स्थिति (`bottom-6` से `bottom-42`) को गतिशील रूप से समायोजित करके ओवरलैप समाप्त करता है। |
| 1.56 | **14vw Responsive Watermark Branding** | `src/components/Footer.jsx` | रील-सटीक विशालकाय बैकग्राउंड नाम | रील के अंतिम दृश्य के अनुरूप बैकग्राउंड में पूर्ण-चौड़ाई वाला 'ATUL VERMA' वाटरमार्क जो डार्क व हाई-कंट्रास्ट मोड दोनों में सुपाठ्य रहता है। |

---

<a id="module-2"></a>
## 🦋 मॉड्यूल 2: कस्टम कर्सर सिस्टम और डायनामिक एनिमेशन्स (Custom Cursor System & Kinematics)

यह मॉड्यूल 35 अद्वितीय कस्टमाइज़्ड कर्सर, उनके काइनेमैटिक्स फिजिक्स प्रोफाइल, एडिटिव कैनवस ट्रेल इंजन, और जीरो-लैग 120 FPS परफॉर्मेंस आर्किटेक्चर का विवरण प्रस्तुत करता है।

### 2.1 कर्सर इंजन आर्किटेक्चर एवं सुरक्षा नियंत्रण (Engine Architecture & Safety Guards)

1. **डायनामिक कर्सर मैनेजर (`DynamicCursorManager.jsx`):**
   - **सिंगल-एक्टिव लूप नियम (Single-Active Loop Discipline):** एक समय में केवल वही एक कर्सर माउंट होता है जिसे यूजर ने चुना है। बाकी सभी 34 कर्सर मेमोरी से पूरी तरह अनमाउंट रहते हैं ताकि CPU/GPU पर 0% अतिरिक्त भार रहे।
   - **मोबाइल एवं टच शील्ड (Touch & Coarse Pointer Guard):** `useDesktopCursorSupport` हुक के जरिए टच स्क्रीन, टैबलेट या coarse पॉइंटर पर कस्टम कर्सर स्वतः बंद हो जाते हैं और डिफ़ॉल्ट सिस्टम कर्सर बहाल हो जाता है।
   - **रेड्यूस्ड मोशन शील्ड (Reduced Motion Guard):** `(prefers-reduced-motion: reduce)` डिटेक्ट होने पर या यूजर द्वारा प्रेफरेंसेस में मोशन घटाने पर कस्टम कर्सर कैनवस बंद हो जाता है।
   - **सिंपल मोड में स्वतः शटडाउन:** सिंपल मोड ऑन होते ही कर्सर मैनेजर `null` रिटर्न करता है और `document.body` पर सामान्य कर्सर बहाल करता है।

2. **विशेष रूप से निर्मित कर्सर (Bespoke Dedicated Cursors):**
   - **फ्लैगशिप बटरफ्लाई (`ButterflyCursor.jsx`):** ट्रू 3D हिंज विंग फ्लैप (Left/Right SVG विंग्स), गति के अनुसार फ्लैप फ्रीक्वेंसी (तेज़ उड़ने पर 0.08s, धीमी उड़ने पर 0.16s), अटांज (atan2) स्मूथ हेडिंग रोटेशन, लिसाजस (Lissajous) आइडल होवर ड्रिफ्ट, और 4-कलर पोलन स्पार्कल ट्रेल।
   - **फायरफ्लाई / जुगनू (`FireflyCursor.jsx`):** बायो-ल्यूमिनसेंट वार्म पल्सिंग कोर (Amber/Emerald), सूक्ष्म ऑर्गेनिक कंपकंपी (Micro-jitter), और फ्लोटिंग एम्बर स्पोर ट्रेल।
   - **स्टारडस्ट वैंड (`StardustCursor.jsx`):** 25-डिग्री झुकी हुई जादुई छड़ी, 4-पॉइंटेड डायमंड ग्लिटर बर्स्ट्स, और ऑर्बिटल स्पार्कल ऑरा।
   - **ओरिगेमी पेपर प्लेन (`AirplaneCursor.jsx`):** 3D फेसेटेड पेपर शेडिंग, शार्प टर्न पर 32-डिग्री एरोडायनामिक बैंकिंग (Roll), और दोनों पंखों के सिरों से निकलने वाली ड्यूल वेपर ट्रेल्स (Dual Wingtip Trails)।
   - **नियॉन लेज़र पॉइंटर (`LaserCursor.jsx`):** अल्ट्रा-लो इनर्शिया (24.0), कंटीन्यूअस इल्युमिनेटेड लेज़र बीम पाथ रिबन, और क्लिक करने पर शॉकवेव प्लाज्मा बर्स्ट।
   - **कैमरा व्यूफाइंडर (`CameraCursor.jsx`):** 4-कॉर्नर टारगेटिंग ब्रैकेट्स, सेंटर फोकस रिंग, क्लिक पर शटर अपर्चर स्नैप और गोल्डन बोकेह लेंस फ्लेयर।
   - **मैग्नेटिक मिनिमल रिंग (`MinimalCursor.jsx`):** तात्कालिक इनर डॉट + फ्लूइड मैग्नेटिक आउटर रिंग जो स्प्रिंग डैम्पिंग के साथ कर्सर का पीछा करती है।

3. **मॉड्यूलर काइनेमैटिक कर्सर (`ModularKinematicCursor.jsx`):**
   - बाकी सभी 28 कर्सर स्टाइल्स इस उच्च-प्रदर्शन वाले रेंडरर के जरिए संचालित होते हैं।
   - `kinematicProfiles.js` से भौतिकी पैरामीटर्स (Inertia, Rotation Mode, Sway, Bob, Spin, Trail Type, Click Burst) लोड करता है।
   - कैनवस 2D पर 'lighter' कंपोजिटिंग के साथ मैट्रिक्स ग्लिफ़्स, स्नो फ्लेक्स, वॉटर ड्रॉप्स, टायर्स स्मोक, और कॉस्मिक वोर्टेक्स रेंडर करता है।

---

### 2.2 सभी 35 कस्टमाइज़्ड कर्सर की संपूर्ण सूची (All 35 Custom Cursors Directory)

| क्र. | कर्सर ID | नाम (Cursor Name) | श्रेणी (Category) | इमोजी / एक्सेंट | मुख्य काइनेमैटिक मोशन (Kinematic Motion) | पार्टिकल ट्रेल प्रकार (Trail Type & FX) |
| :---: | :--- | :--- | :--- | :---: | :--- | :--- |
| 1 | `butterfly` | **Butterfly (तितली)** | Living & Nature | 🦋 `#FF4D6D` | Heading + Bank (24°) + Dynamic 3D Flutter | पोलन ग्लो और 4-पॉइंट डायमंड स्पार्कल्स |
| 2 | `firefly` | **Firefly (जुगनू)** | Living & Nature | ✨ `#10B981` | Organic Bob (2.5Hz) + Lissajous Drift | बायो-ल्यूमिनसेंट वार्म एम्बर्स और स्पोर्स |
| 3 | `dragonfly` | **Dragonfly** | Living & Nature | 🌿 `#06B6D4` | Heading (Offset 90°) + High Inertia (18.0) | वाटर रिपल्स और इरिडेसेंट स्पार्कल्स |
| 4 | `honeybee` | **Honeybee** | Living & Nature | 🐝 `#F59E0B` | Rapid Bob Buzz (4.8Hz) | गोल्डन नेक्टर ड्रॉपलेट्स और पॉलेन |
| 5 | `leaf` | **Autumn Leaf** | Living & Nature | 🍃 `#84CC16` | Gentle Pendulum Sway (2.0Hz, 28° Amp) | हवा में बहते हुए शरदकालीन पत्ते |
| 6 | `wand` | **Stardust Wand** | Cosmic & Magic | ⭐ `#A855F7` | Fixed Magic Tilt (-25°) + Micro-Wobble | 4-पॉइंट पर्पल एवं गोल्ड कॉस्मिक स्टार्स |
| 7 | `comet` | **Stellar Comet** | Cosmic & Magic | ☄️ `#EC4899` | Velocity Heading + Speed Scaling | प्रज्वलित टेल (Blazing Astral Tail) |
| 8 | `blackhole` | **Black Hole** | Cosmic & Magic | 🕳️ `#6366F1` | Continuous Orbital Spin (140°/s) | गुरुत्वाकर्षण वोर्टेक्स (Inward Collapse Burst) |
| 9 | `prism` | **Crystal Prism** | Cosmic & Magic | 💎 `#8B5CF6` | Subtle Crystal Spin (45°/s) | इंद्रधनुषी प्रकाश अपवर्तन (Rainbow Dispersion) |
| 10 | `portal` | **Wormhole Portal** | Cosmic & Magic | 🌀 `#3B82F6` | Fast Interdimensional Vortex Spin (180°/s) | कॉस्मिक पोर्टल रिंग्स और ब्लू प्लाज्मा |
| 11 | `laser` | **Laser Pointer** | Tech & Cyberpunk | 🎯 `#DC2626` | Ultra-Snappy Instant Aim (Inertia 24.0) | कंटीन्यूअस नियॉन लेज़र बीम पाथ |
| 12 | `matrix` | **Matrix Rain** | Tech & Cyberpunk | 💻 `#22C55E` | Fixed Cyber Terminal Grid | डिजिटल गिरते हुए बाइनरी '0' और '1' ग्लिफ़्स |
| 13 | `reticle` | **HUD Reticle** | Tech & Cyberpunk | 🔭 `#14B8A6` | Tactical Reticle Spin (25°/s) | सामरिक HUD निर्देशांक और क्रॉसहेयर डॉट्स |
| 14 | `circuit` | **Nano Circuit** | Tech & Cyberpunk | ⚡ `#0EA5E9` | Direct Conductive Alignment | माइक्रोचिप इलेक्ट्रिकल पल्स ट्रेल्स |
| 15 | `drone` | **Cyber Drone** | Tech & Cyberpunk | 🛰️ `#64748B` | Tilt Heading + Aerodynamic Thrust Bank | क्वाड-रोटर थ्रस्ट वेपर और इंडिगो ट्रेल्स |
| 16 | `airplane` | **Paper Airplane** | Playful & Vehicles | ✈️ `#0284C7` | Atan2 Heading + 32° Sharp Banking | दोनों पंखों के सिरों से ड्यूल वेपर ट्रेल्स |
| 17 | `rocket` | **Retro Rocket** | Playful & Vehicles | 🚀 `#EA580C` | Heading (Offset 45°) + Thruster Burn | रॉकेट एग्जॉस्ट फायर और ग्रे स्मोक |
| 18 | `ufo` | **Flying Saucer** | Playful & Vehicles | 🛸 `#10B981` | Anti-Gravity Wobble (3.2Hz, 14° Amp) | एमराल्ड एबडक्शन ट्रैक्टर बीम रिंग्स |
| 19 | `speedster` | **Speedster Car** | Playful & Vehicles | 🏎️ `#EF4444` | Road Velocity Heading + Drift Bank (24°) | टर्बो बर्नआउट और टायर स्किड स्मोक |
| 20 | `balloon` | **Hot Air Balloon** | Playful & Vehicles | 🎈 `#F43F5E` | Buoyant Thermal Bob (1.8Hz, 10px Amp) | बर्नर स्पार्क्स और वार्म हीटिंग एम्बर्स |
| 21 | `flame` | **Fire Flame** | Elemental & Forces | 🔥 `#F97316` | Fixed Upward Burn + Velocity Stretch | ऊपर उठती हुई ज्वालाएं और फायर स्पार्क्स |
| 22 | `frost` | **Frost Crystal** | Elemental & Forces | ❄️ `#38BDF8` | Gentle Snow Crystal Spin (30°/s) | सब-ज़ीरो बर्फ़बारी (Snow Blizzard Flakes) |
| 23 | `lightning` | **Lightning Bolt** | Elemental & Forces | ⚡ `#EAB308` | Ultra-Fast Electric Snap (Inertia 25.0) | हाई-वोल्टेज इलेक्ट्रिक आर्क और ज़िग-ज़ैग लाइन्स |
| 24 | `waterdrop` | **Water Drop** | Elemental & Forces | 💧 `#0EA5E9` | Liquid Heading + Surface Stretch | फ्लूइड स्प्लैश और वॉटर रिपल्स |
| 25 | `tornado` | **Tornado Vortex** | Elemental & Forces | 🌪️ `#78716C` | Rapid Centrifugal Spin (240°/s) | सेंट्रीफ्यूगल विंड वोर्टेक्स और डस्ट डेब्रिस |
| 26 | `camera` | **Camera Focus** | Precision & Design | 📷 `#D97706` | Viewfinder Panning Inertia (18.0) | व्यूफाइंडर मार्क्स और गोल्डन बोकेह फ्लेयर्स |
| 27 | `minimal` | **Minimal Ring** | Precision & Design | ⚪ `#52525B` | Instant Center Dot + Magnetic Follower Ring | सूक्ष्म ज्यामितीय डॉट्स और पल्स रिपल्स |
| 28 | `quill` | **Quill Pen** | Precision & Design | 🪶 `#9333EA` | Calligraphic Pen Tilt (-45°) | सुलेख स्याही की बूंदें (Calligraphy Ink Splatter) |
| 29 | `brush` | **Paint Brush** | Precision & Design | 🖌️ `#F43F5E` | Acrylic Painting Angle (-35°) | जीवंत एक्रिलिक पेंट स्पैटर और ड्रॉप्स |
| 30 | `compass` | **Drafting Compass** | Precision & Design | 📐 `#2563EB` | Engineering Radius Arc Spin (20°/s) | ज्यामितीय ड्राफ्टिंग आर्क्स और ब्लू लाइन्स |
| 31 | `ghost` | **Arcade Ghost** | Arcade & Retro | 👻 `#EC4899` | 8-Bit Floating Wavy Bob (3.0Hz) | रेट्रो पिक्सेल डस्ट (Square Pixel Particles) |
| 32 | `pacman` | **Pixel Chomp** | Arcade & Retro | 🟡 `#FACC15` | Directional Heading + Rapid Chomp | पीले रंग के रेट्रो पैक-डॉट्स (Pac-Dots Trail) |
| 33 | `joystick` | **Retro Joystick** | Arcade & Retro | 🕹️ `#DC2626` | Velocity Joystick Tilt (Bank 22°) | आर्केड कैबिनेट स्पार्क्स और रेड फ्लैश |
| 34 | `synthwave` | **Synthwave Sun** | Arcade & Retro | 🌅 `#D946EF` | 80s Retro Grid Horizon Hold | नियॉन पर्पल-स्यान सिंथवेव ग्रिड ट्रेल्स |
| 35 | `sword` | **Pixel Sword** | Arcade & Retro | ⚔️ `#38BDF8` | Heroic Slash Heading (Offset 45°) | चमकदार तलवार की धार का स्लैश (Slash Trail) |

---

### 2.3 मॉड्यूल 2: विस्तृत कोर इंजन एवं काइनेमैटिक्स फ़ंक्शन तालिका (Detailed Engine Features Table)

| क्र. सं. | फ़ीचर / फ़ंक्शन का नाम | संबंधित फ़ाइल / कंपोनेंट | मुख्य कार्य (Primary Action) | विस्तृत विवरण (Detailed Description) |
| :---: | :--- | :--- | :--- | :--- |
| 2.1 | **Single-Active Loop Discipline** | `src/components/DynamicCursorManager.jsx` | 0% अतिरिक्त CPU/GPU भार बनाए रखना | यूजर द्वारा चयनित केवल एक कर्सर को माउंट रखता है; शेष 34 कर्सर और उनके कैनवस लूप्स मेमोरी से पूरी तरह अनमाउंट रहते हैं। |
| 2.2 | **Coarse Pointer & Touch Shield** | `src/components/DynamicCursorManager.jsx`, `useDesktopCursorSupport.js` | टच और मोबाइल पर नेटिव कर्सर बहाली | मोबाइल, टैबलेट या टच स्क्रीन (`pointer: coarse`, `hover: none`) डिटेक्ट होते ही कस्टम कर्सर को अक्षम करके नेटिव टच जेस्चर सुरक्षित करता है। |
| 2.3 | **Reduced Motion Kinematic Guard** | `src/components/DynamicCursorManager.jsx`, `LabContext.jsx` | मोशन-सेंसिटिव यूज़र्स हेतु सुरक्षा | `(prefers-reduced-motion: reduce)` या लैब प्रेफरेंसेस में मोशन कम करने पर तुरंत पार्टिकल ट्रेल और कर्सर कैनवस को निष्क्रिय कर देता है। |
| 2.4 | **Hardware-Accelerated 3D Wing Flutter** | `src/components/ButterflyCursor.jsx`, `src/index.css` | तितली के पंखों का यथार्थवादी 3D फड़कना | 700px पर्सपेक्टिव स्टेज पर `wingFlap3DLeft` और `wingFlap3DRight` कीफ्रेम्स के साथ हार्डवेयर-त्वरित (GPU) पंख फड़फड़ाहट प्रदान करता है। |
| 2.5 | **Velocity-Responsive Flap Frequency** | `src/components/ButterflyCursor.jsx` | गति के अनुसार पंखों की गति बदलना | कर्सर तेज़ी से हिलाने पर पंख 0.08s में अत्यंत तेज़ फड़फड़ाते हैं, और स्थिर या धीमा होने पर 0.16s में कोमलता से फड़फड़ाते हैं। |
| 2.6 | **Atan2 Shortest-Arc Heading & 3D Banking** | `src/components/ButterflyCursor.jsx` | गति की दिशा में मुड़ना और झुकना | `Math.atan2` से दिशा निकालता है, 360° के पार शॉर्टेस्ट-आर्क रैप करता है, और तीखे मोड़ों पर 24° तक एरोडायनामिक बैंकिंग (Roll) उत्पन्न करता है। |
| 2.7 | **Multi-Harmonic Lissajous Idle Drift** | `src/components/ButterflyCursor.jsx` | स्थिर रहने पर जीवंत प्राकृतिक कंपन | कर्सर रुकने पर लिसाजस समीकरण ($x = A \sin(\omega_1 t), y = B \cos(\omega_2 t)$) द्वारा वास्तविक स्थिति को विकृत किए बिना जीवंत होवरिंग गति दिखाता है। |
| 2.8 | **Additive Stardust Particle Engine** | `src/components/ButterflyCursor.jsx`, `ModularKinematicCursor.jsx` | 120 FPS एडिटिव कैनवस ट्रेल | HTML5 Canvas 2D पर `'lighter'` कंपोजिटिंग के साथ चमकते हुए पोलन और स्पार्कल पार्टिकल्स उत्सर्जित करता है; शून्य शैडो-ब्लर के साथ 120 FPS लॉक। |
| 2.9 | **Frame-Rate Independent Lerp Physics** | `src/components/cursors/ModularKinematicCursor.jsx` | सभी मॉनिटर्स (60Hz-240Hz) पर समान गति | डेल्टा-टाइम नॉर्मलाइज्ड एक्सपोनेंशियल ईज़िंग लागू करता है ताकि 60Hz, 120Hz, 144Hz और 240Hz रिफ्रेश रेट पर कर्सर की गति 100% एकसमान रहे। |
| 2.10 | **Custom Click Reaction Particle Bursts** | `src/components/cursors/kinematicProfiles.js`, `ModularKinematicCursor.jsx` | माउस क्लिक पर विशेष पार्टिकल विस्फोट | प्रत्येक कर्सर के क्लिक पर उसके सौंदर्य के अनुरूप पार्टिकल संख्या, गति और रंग (उदा. तितली पर 14, ड्रैगनफ्लाई पर 15, लेज़र पर शॉकवेव) का विस्फोट। |
| 2.11 | **Bioluminescent Firefly Kinematics** | `src/components/cursors/FireflyCursor.jsx` | जुगनू की जैविक चमक व सूक्ष्म कंपन | बायो-ल्यूमिनसेंट पल्सिंग कोर (Amber/Emerald), सूक्ष्म ऑर्गेनिक ब्राउनीयन कंपकंपी (Micro-jitter), और फ्लोटिंग एम्बर स्पोर ट्रेल। |
| 2.12 | **Stardust Wand Cosmic Orbiter** | `src/components/cursors/StardustCursor.jsx` | जादुई छड़ी और कॉस्मिक स्पार्कल ऑरा | -25° पर स्थिर झुकाव, सूक्ष्म वॉबल एनीमेशन, 4-पॉइंटेड पर्पल व गोल्ड कॉस्मिक स्टार्स, और ऑर्बिटल स्पार्कल बर्स्ट्स। |
| 2.13 | **Paper Airplane Aerodynamic Roll** | `src/components/cursors/AirplaneCursor.jsx` | 3D फेसेटेड विमान व शार्प बैंकिंग | तीखे मोड़ों पर 32° का एरोडायनामिक रोल (Banking), 3D फेसेटेड पेपर शेडिंग, और दोनों पंखों के सिरों से निकलने वाली ड्यूल वेपर ट्रेल्स। |
| 2.14 | **Neon Laser Pointer & Plasma Shockwave** | `src/components/cursors/LaserCursor.jsx` | अल्ट्रा-फास्ट लेज़र बीम पाथ | अल्ट्रा-लो इनर्शिया (24.0) के साथ त्वरित निशाना, सतत प्रज्वलित नियॉन लेज़र बीम पाथ रिबन, और क्लिक करने पर शॉकवेव प्लाज्मा बर्स्ट। |
| 2.15 | **Camera Viewfinder Aperture Reticle** | `src/components/cursors/CameraCursor.jsx` | व्यूफाइंडर फोकस ब्रैकेट्स व बोकेह | 4-कोने टारगेटिंग ब्रैकेट्स, सेंटर फोकस रिंग, क्लिक पर मैकेनिकल अपर्चर स्नैप और स्क्रीन पर तैरते हुए गोल्डन बोकेह लेंस फ्लेयर्स। |
| 2.16 | **Magnetic Minimal Follower Ring** | `src/components/cursors/MinimalCursor.jsx` | इनर डॉट + फ्लूइड मैग्नेटिक आउटर रिंग | तात्कालिक सटीक इनर डॉट तथा स्प्रिंग डैम्पिंग के साथ कर्सर का पीछा करने वाली फ्लूइड आउटर रिंग जो होवर पर मैग्नेटिक खिंचाव देती है। |
| 2.17 | **Collision-Free Vector Icon Architecture** | `src/components/CursorIcon.jsx` | 35 स्वतंत्र एसवीजी वेक्टर्स | `useSafeId` हुक के जरिए प्रत्येक कर्सर के लिए स्वतंत्र लीनियर/रेडियल ग्रेडिएंट्स और फ़िल्टर आईडी उत्पन्न करता है ताकि आईडी क्लैश न हो। |
| 2.18 | **Cursor Ribbon Boundaries & Keyboard Nav** | `src/components/CursorSelectorRibbon.jsx` | कर्सर सेलेक्टर रिबन का पूर्ण नियंत्रण | श्रेणी फ़िल्टर टैब्स, बाउंड्री सेंसिंग एरो बटन्स (`scrollBy(220)`), और रोविंग कीबोर्ड फोकस (`ArrowRight`, `ArrowLeft`, `Home`, `End`)। |

---

---

<a id="module-3"></a>
## 🎛️ मॉड्यूल 3: लैब स्टूडियो, डेमो मोड्स और स्पेशल फीचर्स (Lab Studio, Demo Modes & Special Features)

यह मॉड्यूल पोर्टफोलियो कंट्रोल सेंटर (ControlCenterPanel), स्लाइड-आउट लैब स्टूडियो (LabStudioDrawer), पोलरॉइड कैमरा रोल (CameraRollGallery), ऑफ़लाइन हाइब्रिड मैप्स, और रेज़्यूमे सिस्टम को कवर करता है।

### 3.1 घटक विवरण एवं वास्तुकला (Component Details & Architecture)

1. **पोर्टफोलियो कंट्रोल सेंटर (`ControlCenterPanel.jsx` & `LabStudioDrawer.jsx`):**
   - **5 विशेष कैलिब्रेशन टैब्स:**
     1. **Tab 1: Audio Studio:** साउंड FX मास्टर टॉगल, मास्टर वॉल्यूम स्लाइडर (0-100%), पिच मल्टीप्लायर (0.5x-2.0x), साउंड मैचिंग मोड ('dynamic' vs 'universal'), और 7 बटनों वाला लाइव साउंडबोर्ड (Shutter, Sparkle, Pop, Focus, Chime, Ribbon, Haptic)।
     2. **Tab 2: Cursor & Dynamics:** कस्टम कर्सर मास्टर स्विच, कर्सर स्केल (0.5x-2.0x), फ्लाइट स्पीड (Dreamy 0.08, Natural 0.14, Snappy 0.24), स्टारडस्ट ट्रेल स्विच, और पार्टिकल कलर पिकर + 6 प्रीसेट कलर चिप्स।
     3. **Tab 3: Hero & Character Control:** गेज़ मोड (Auto vs Fixed), पोज़ ओवरराइड (Auto + 10 पोज़ बटन्स), कैरेक्टर ज़ूम (0.5x-2.0x), ज़ूम फोकस (Head, Center, Feet), ड्रैग मास्टर टॉगल, बाउंड्री क्लैंपिंग, ऑटो स्नैप-बैक, फ्लैश कंफ़ेटी, लंबन झुकाव (Parallax Tilt), और रीसेंटर कैरेक्टर बटन।
     4. **Tab 4: Startup & Preferences:** डिफ़ॉल्ट स्टार्टअप रोल सेलेक्टर (Accountant, MIS, Corporate Controller, Vibe Coder), डिफ़ॉल्ट कर्सर ऑन स्टार्टअप, डिफ़ॉल्ट ऑडियो ऑन स्टार्टअप, और रेड्यूस्ड मोशन एक्सेसिबिलिटी स्विच।
     5. **Tab 5: Display & Visuals:** डार्क/लाइट कलर मोड, हाई कंट्रास्ट मोड स्विच, लेआउट डेंसिटी सेलेक्टर (Compact 0.8x, Comfortable 1.0x, Spacious 1.25x), ग्लासमॉर्फिज्म ब्लर (Subtle 8px, Balanced 16px, Deep 24px), UI मोशन स्पीड (Snappy 0.7x, Natural 1.0x, Cinematic 1.4x), और थीम एक्सेंट कलर पिकर।
   - **1-क्लिक फ़ैक्टरी रीसेट (`resetDefaults()`):** सभी ऑडियो, कर्सर, हेरो, विजुअल्स और प्रेफरेंसेस को मूल फ़ैक्टरी सेटिंग्स पर बहाल करता है और क्रिस्टल चाइम साउंड बजाता है।
   - **दोहरा माउंटिंग सिस्टम:** यह पैनल पेज के भीतर इनलाइन अकॉर्डियन (`InteractivePlayground.jsx`) और फ्लोटिंग स्लाइड-आउट ड्रॉअर (`LabStudioDrawer.jsx`) दोनों में रेंडर होता है।
   - **मल्टी-टैब स्टोरेज सिंक्रनाइज़ेशन:** `storage` इवेंट लिसनर के माध्यम से यदि एक टैब में सेटिंग बदली जाए, तो दूसरे खुले हुए टैब्स में तुरंत रीयल-टाइम अपडेट हो जाती है।

2. **कैमरा रोल एवं पोलरॉइड स्टूडियो (`CameraRollGallery.jsx` & `polaroidExport.js`):**
   - **पोलरॉइड गैलरी ग्रिड:** हेरो सेक्शन से खींची गई तस्वीरों को विंटेज पोलरॉइड फोटो फ्रेम, हल्के रैंडम रोटेशन, और टेप डेकोरेशन के साथ प्रदर्शित करता है।
   - **सुलभ लाइटबॉक्स मॉडल:** किसी भी फोटो पर क्लिक करने पर बड़ा लाइटबॉक्स खुलता है, जिसमें कीबोर्ड फोकस ट्रैप (`useFocusTrap`) और `Escape` की लिसनर होता है।
   - **इंटरएक्टिव लाइक काउंटर:** प्रत्येक फोटो पर दिल (Heart) का आइकॉन, जिस पर क्लिक करने पर फ्लोटिंग दिल का एनीमेशन, लाइक काउंट में वृद्धि, और स्पार्कल साउंड होती है।
   - **1-क्लिक सिंगल डाउनलोड:** फोटो को वास्तविक पोलरॉइड रेशियो, विंटेज सेपिया टोन, ग्रेन टेक्सचर और तारीख की मुहर के साथ सीधे PNG के रूप में डाउनलोड करने की सुविधा।
   - **एक्सपोर्ट ऑल पोलरॉइड्स ज़िप (`exportAllPolaroidsZip`):** 'JSZip' लाइब्रेरी की सहायता से गैलरी की सभी तस्वीरों को प्रोसेस करके एक संयुक्त ZIP फ़ाइल (`Atul_Verma_Polaroids_Collection.zip`) में डाउनलोड कराता है, जिसमें लाइव प्रोग्रेस बार दिखता है।

3. **हाइब्रिड ऑफ़लाइन मैप सिस्टम (`LeafletOfflineMap.jsx` & `OfflineMapSnapshot.jsx`):**
   - **पूर्णतः ऑफ़लाइन आर्किटेक्चर:** मेदिनीनगर (डाल्टनगंज) के निर्देशांक `[24.0416, 84.0700]` पर केंद्रित।
   - **लोकल टाइल कैशे:** इंटरनेट न होने पर भी काम करने के लिए प्रोजेक्ट के भीतर `/assets/tiles/{z}/{x}/{y}.png` से मैप टाइल्स लोड करता है।
   - **सख्त बाउंड्स लॉकिंग:** `maxBounds: [[23.8054, 83.7598], [24.2069, 84.3750]]` और `maxBoundsViscosity: 1.0` के साथ यूजर को मेदिनीनगर क्षेत्र से बाहर अनावश्यक पैनिंग करने से रोकता है।
   - **शहर के 5 मुख्य लैंडमार्क्स:** Medininagar Center, DTO Railway Station, Palamu Admin Hub, North Koel River, और NH-39 Corridor।
   - **वेक्टर SVG एवं PNG फ़ॉलबैक:** कम क्षमता वाले ब्राउज़रों के लिए हल्का और त्वरित वेक्टर स्नैपशॉट मैप।
   - **कोऑर्डिनेट क्लिपबोर्ड कॉपी:** 1-क्लिक में "24.0416° N, 84.0700° E" को कॉपी करने की सुविधा।

4. **मल्टी-रोल रेज़्यूमे प्रबंधन (`ResumeDropdown.jsx` & `resumeConfig.js`):**
   - **रोल-अवेयर स्प्लिट बटन:** एक्टिव रोल के अनुसार रेज़्यूमे का नाम और डाउनलोड फ़ाइल स्वतः निर्धारित होती है (उदा. `Atul_Verma_Accountant_Resume.pdf`, `Atul_Verma_MIS_Resume.pdf`, `Atul_Verma_Vibe_Coder_Resume.pdf`)।
   - **5-इन-1 एक्शन मेनू:** डायरेक्ट डाउनलोड, न्यू टैब प्रिव्यू, शेयर करने योग्य लिंक कॉपी (`?role=...` पैरामीटर के साथ), प्रिंट रेज़्यूमे (`window.print()`), और सिंपल मोड टॉगल।
   - **रोल-विशिष्ट कंफ़ेटी पैलेट:** रेज़्यूमे डाउनलोड पर संबंधित रोल के थीम रंगों में कंफ़ेटी ब्लास्ट होता है।

5. **रोल खाली स्थिति घटक (`RoleEmptyState.jsx`):**
   - जब किसी कस्टम या 'other' रोल में कोई सेक्शन डेटा उपलब्ध नहीं होता, तो टूटने या खाली दिखने के बजाय यह एक सुंदर न्यूट्रल कार्ड प्रस्तुत करता है जिसमें कंपास आइकॉन और रोल चुनने का सुझाव होता है।

---

### 3.2 मॉड्यूल 3: विस्तृत फ़ीचर एवं फ़ंक्शन तालिका (Detailed Features Table)

| क्र. सं. | फ़ीचर / फ़ंक्शन का नाम | संबंधित फ़ाइल / कंपोनेंट | मुख्य कार्य (Primary Action) | विस्तृत विवरण (Detailed Description) |
| :---: | :--- | :--- | :--- | :--- |
| 3.1 | **Quick Lab Studio Slide-Out Drawer** | `src/components/LabStudioDrawer.jsx` | फ्लोटिंग स्लाइड-आउट कैलिब्रेशन पैनल | स्क्रीन के बॉटम-राइट में पल्सिंग FAB पर क्लिक करने पर दाईं ओर से चिकना ड्रॉअर खुलता है; `useFocusTrap` से कीबोर्ड सुरक्षित। |
| 3.2 | **Inline Control Center Accordion** | `src/components/InteractivePlayground.jsx` | पेज के भीतर इनलाइन सिस्टम सेटिंग्स | '#playground' या '#lab' हैश पर ऑटो-एक्सपैंड होने वाला अकॉर्डियन जो बिना ड्रॉअर खोले पूरे कंट्रोल सेंटर को पेज में दिखाता है। |
| 3.3 | **Audio Synthesizer Master Switch** | `src/components/ControlCenterPanel.jsx` | पूरे पोर्टफोलियो का साउंड टॉगल | वेब ऑडियो API के मास्टर गेन नोड को 0 या यूजर वॉल्यूम पर स्मूथली रैंप करता है; `portfolio_control_center` में सेव करता है। |
| 3.4 | **Master Volume Slider** | `src/components/ControlCenterPanel.jsx` | 0% से 100% ऑडियो वॉल्यूम सेट करना | `audio.js` के `setMasterVolume()` को कॉल करता है; ऑडियो प्लेबैक का एम्प्लीट्यूड रीयल-टाइम में नियंत्रित करता है। |
| 3.5 | **Pitch Multiplier Live Tuner** | `src/components/ControlCenterPanel.jsx` | 0.5x से 2.0x साउंड पिच बदलना | सिंथेसाइज़र के बेस ऑसिलेटर फ्रीक्वेंसी को स्केल करता है; स्लाइडर हिलाते समय रीयल-टाइम प्रीव्यू टोन सुनाता है। |
| 3.6 | **Sound Matching Mode Toggle** | `src/components/ControlCenterPanel.jsx` | 'Dynamic' vs 'Universal' ऑडियो | 'Dynamic' में प्रत्येक कर्सर का अपना साउंड होता है (जैसे लेज़र, कैमरा, पॉप); 'Universal' में सभी क्रियाओं पर मानकीकृत चाइम बजती है। |
| 3.7 | **Interactive Soundboard Matrix** | `src/components/ControlCenterPanel.jsx` | 7 साउंड इफ़ेक्ट्स का परीक्षण करना | Shutter, Sparkle, Bubble Pop, Laser Focus, Crystal Chime, Ribbon Sweep, और Haptic Click को बजाकर टेस्ट करने वाले बटन्स। |
| 3.8 | **Custom Cursor Master Toggle** | `src/components/ControlCenterPanel.jsx` | कस्टम कर्सर ऑन/ऑफ करना | यदि बंद किया जाए तो HTML/Body पर सामान्य कर्सर बहाल करता है और कर्सर कैनवस को तुरंत अनमाउंट कर देता है। |
| 3.9 | **Cursor Scale Calibrator** | `src/components/ControlCenterPanel.jsx` | कर्सर का आकार 0.5x - 2.0x करना | बटरफ्लाई, वैंड, लेज़र आदि के आकार को लाइव स्केल करता है; कैनवस पार्टिकल्स के साइज को भी आनुपातिक रूप से अनुकूलित करता है। |
| 3.10 | **Flight Speed (Lerp) Selector** | `src/components/ControlCenterPanel.jsx` | Dreamy, Natural, Snappy स्पीड | कर्सर की गति के एक्सपोनेंशियल लैम्ब्डा को सेट करता है (Dreamy = 0.08, Natural = 0.14, Snappy = 0.24)। |
| 3.11 | **Stardust Particle Trail Toggle** | `src/components/ControlCenterPanel.jsx` | कैनवस पार्टिकल ट्रेल ऑन/ऑफ | यदि बंद किया जाए तो कैनवस पार्टिकल इंजन को खाली कर देता है और केवल मुख्य कर्सर अवतार को रेंडर करता है। |
| 3.12 | **Particle Color Palette & Chips** | `src/components/ControlCenterPanel.jsx` | ट्रेल का रंग बदलना | 6 प्रीसेट कलर चिप्स (Coral Rose, Electric Cyan, Solar Gold, Emerald, Cyber Purple, White) या कस्टम कलर पिकर से रंग बदलना। |
| 3.13 | **Hero Gaze Mode Switcher** | `src/components/ControlCenterPanel.jsx` | 'Auto' vs 'Fixed' ट्रैकिंग | 'Auto' में कैरेक्टर कर्सर का पीछा करता है; 'Fixed' में कर्सर की गति को अनदेखा करके केवल निर्धारित पोज़ पर स्थिर रहता है। |
| 3.14 | **Hero 10-Pose Override Matrix** | `src/components/ControlCenterPanel.jsx` | किसी विशेष पोज़ को लॉक करना | 11 बटन्स (Auto + 10 Poses); किसी भी बटन पर क्लिक करने पर कैरेक्टर तुरंत उस दिशा में स्थिर रूप से मुड़ जाता है। |
| 3.15 | **Hero Zoom Focus Anchoring** | `src/components/ControlCenterPanel.jsx` | 'Head', 'Center', 'Feet' फोकस | कैरेक्टर ज़ूम का केंद्र बिंदु बदलता है (Head = 50% 18%, Center = 50% 50%, Feet = 50% 90%)। |
| 3.16 | **Drag Boundary Clamping Toggle** | `src/components/ControlCenterPanel.jsx` | कैरेक्टर को स्क्रीन सीमा में रखना | चालू होने पर कैरेक्टर स्क्रीन से बाहर नहीं जा सकता; बंद होने पर पूरे मंच पर स्वतंत्र रूप से ड्रैग हो सकता है। |
| 3.17 | **Drag Auto Snap-Back Switch** | `src/components/ControlCenterPanel.jsx` | छोड़ते ही केंद्र में लौटना | यदि चालू हो, तो यूजर जैसे ही कैरेक्टर से हाथ उठाता है, वह तुरंत स्प्रिंग एनीमेशन के साथ केंद्र (0,0) पर लौट आता है। |
| 3.18 | **Recenter Character Button** | `src/components/ControlCenterPanel.jsx` | विस्थापित कैरेक्टर को केंद्र पर लाना | कस्टम इवेंट `portfolio:recenter-character` फायर करता है और स्नैप साउंड के साथ कैरेक्टर को (0,0) पर रीसेट करता है। |
| 3.19 | **Parallax Tilt Toggle** | `src/components/ControlCenterPanel.jsx` | 3D लंबन झुकाव इफ़ेक्ट ऑन/ऑफ | हेरो सेक्शन के बैकड्रॉप और स्टेज के 3D टिल्ट एनीमेशन को चालू या बंद करता है। |
| 3.20 | **Startup Role Selector** | `src/components/ControlCenterPanel.jsx` | वेबसाइट खुलने पर पसंदीदा रोल | जब भी कोई नया यूजर वेबसाइट खोलेगा, तो कौन सा रोल सबसे पहले लोड होगा (Accountant, MIS, या Controller) यह तय करता है। |
| 3.21 | **Layout Density Switcher** | `src/components/ControlCenterPanel.jsx` | Compact, Comfortable, Spacious | CSS वेरिएबल्स `--density-spacing-mult`, `--density-card-padding` और रूट क्लास `density-*` इंजेक्ट करता है। |
| 3.22 | **Self-Healing DOM Density Observer** | `src/context/LabContext.jsx` | बाहरी एक्सटेंशन से लेआउट की सुरक्षा | यदि कोई ब्राउज़र एक्सटेंशन रूट क्लास या डेंसिटी स्टाइल मिटा दे, तो `MutationObserver` उसे 0ms में स्वतः री-अप्लाई करता है। |
| 3.23 | **Glassmorphism Blur Tuner** | `src/components/ControlCenterPanel.jsx` | Subtle (8px), Balanced, Deep (24px) | रूट वेरिएबल `--glass-blur` को अपडेट करता है, जिससे सभी पारदर्शी ग्लास पैनल्स का ब्लर एडजस्ट होता है। |
| 3.24 | **Motion Speed Multiplier** | `src/components/ControlCenterPanel.jsx` | Snappy (0.7x), Natural, Cinematic (1.4x) | रूट वेरिएबल `--motion-speed-mult` को सेट करता है, जिससे सभी UI ट्रांज़िशन्स की अवधि तय होती है। |
| 3.25 | **Theme Accent Color Tuner** | `src/components/ControlCenterPanel.jsx` | पोर्टफोलियो का मुख्य एक्सेंट रंग बदलना | इलेक्ट्रिक रोज़, अंबर गोल्ड, नियॉन स्यान, एमराल्ड या कस्टम हेक्स से पूरे पोर्टफोलियो का प्राथमिक रंग बदलना। |
| 3.26 | **1-Click Factory Defaults Reset** | `src/components/ControlCenterPanel.jsx` | संपूर्ण सेटिंग्स का मूल रूप में रीसेट | ऑडियो, कर्सर, हेरो, विजुअल्स और प्रेफरेंसेस को एक क्लिक में फ़ैक्टरी मानों पर रीसेट करता है और चाइम बजाता है। |
| 3.27 | **Polaroid Lightbox Modal** | `src/components/CameraRollGallery.jsx` | फोटो को बड़े आकार में देखना | फोटो पर क्लिक करने पर डार्क बैकलिट लाइटबॉक्स खुलता है; `useFocusTrap` से कीबोर्ड ट्रैपिंग और `Escape` की से बंद। |
| 3.28 | **Polaroid Heart Like Button** | `src/components/CameraRollGallery.jsx` | फोटो को लाइक करना और दिल उड़ाना | लाइक संख्या बढ़ाता है, फ्लोटिंग हार्ट पॉप एनीमेशन दिखाता है और स्पार्कल ऑडियो फ़ीडबैक देता है। |
| 3.29 | **Single Polaroid PNG Download** | `src/utils/polaroidExport.js` | व्यक्तिगत विंटेज फोटो डाउनलोड | ऑफ-स्क्रीन कैनवस पर विंटेज सेपिया, फिल्म ग्रेन, फोटो बॉर्डर और 'ATUL VERMA' स्टैम्प रेंडर करके PNG सेव करता है। |
| 3.30 | **Export All Polaroids as ZIP** | `src/utils/polaroidExport.js` | सभी खींची गई तस्वीरों का ज़िप पैकेज | `JSZip` के माध्यम से सभी तस्वीरों को प्रोसेस करके सिंगल ज़िप आर्काइव डाउनलोड कराता है; लाइव प्रोग्रेस बार दिखाता है। |
| 3.31 | **Leaflet Pre-Downloaded Tile Engine** | `src/components/LeafletOfflineMap.jsx` | इंटरनेट के बिना मैप चलाना | लोकल पाथ से रास्टर टाइल्स लोड करता है; मेदिनीनगर शहर के बाहर अनावश्यक पैनिंग को रोकता है (`maxBoundsViscosity: 1.0`)। |
| 3.32 | **Map Landmark Interactive Pins** | `src/components/OfflineMapSnapshot.jsx` | मुख्य शहर स्थलों पर क्लिक करना | 5 प्रमुख लैंडमार्क्स (रेलवे स्टेशन, कलेक्टरेट, कोयल नदी, आदि) पर क्लिक करके उनका विवरण और निर्देशांक देखना। |
| 3.33 | **Map Coordinates Clipboard Copy** | `src/components/OfflineMapSnapshot.jsx` | GPS निर्देशांक कॉपी करना | 1-क्लिक में "24.0416° N, 84.0700° E" को क्लिपबोर्ड में कॉपी करता है और 2 सेकंड के लिए चेक मार्क दिखाता है। |
| 3.34 | **Resume Role-Specific Share Link** | `src/components/ResumeDropdown.jsx` | रोल पैरामीटर युक्त लिंक कॉपी करना | वर्तमान रोल का रेज़्यूमे सीधे खोलने वाला यूआरएल (`?role=accountant` आदि) क्लिपबोर्ड में कॉपी करता है और कंफ़ेटी उड़ाता है। |
| 3.35 | **Resume Print Command Trigger** | `src/components/ResumeDropdown.jsx` | 1-क्लिक में प्रिंट डायलॉग खोलना | ब्राउज़र का नेटिव `window.print()` डायलॉग सक्रिय करता है ताकि सीधे प्रिंटर या सेव-एज़-पीडीएफ किया जा सके। |
| 3.36 | **Neutral Role Empty State Card** | `src/components/RoleEmptyState.jsx` | खाली सेक्शन हेतु सुंदर सूचना कार्ड | यदि किसी कस्टम रोल में कोई जानकारी न हो, तो टूटने के बजाय कंपास आइकॉन और 'Information Coming Soon' संदेश प्रस्तुत करता है। |
| 3.37 | **Web Speech API Voice Announcements Toggle**| `src/components/ControlCenterPanel.jsx`, `LabContext.jsx` | वॉयस स्पीच सिंथेसिस ऑन/ऑफ करना | ऑडियो स्टूडियो टैब में 1-क्लिक स्विच; ऑन करने पर सिस्टम रोल परिवर्तन, नेविगेशन व प्रमुख क्रियाओं की ऑडियो कमेंट्री बोलकर सुनाता है। |
| 3.38 | **Speak on Keyboard Focus Switch** | `src/components/ControlCenterPanel.jsx`, `AnnouncerContext.jsx`| कीबोर्ड फोकस पर नाम बोलकर सुनाना | चालू होने पर यूजर जैसे ही टैब (Tab) दबाकर किसी बटन, लिंक या कार्ड पर पहुँचता है, उसका सटीक नाम व उद्देश्य स्वतः बोलकर सुनाता है। |
| 3.39 | **Mouse Hover Speech Switch** | `src/components/ControlCenterPanel.jsx`, `AnnouncerContext.jsx`| माउस होवर पर ध्वनि संदेश देना | यूजर द्वारा माउस कर्सर को इंटरएक्टिव कार्ड्स पर ले जाने पर बिना क्लिक किए संक्षेप में कार्ड का शीर्षक बोलकर सुनाने की वैकल्पिक सुविधा। |
| 3.40 | **Natural Voice Priority Ladder** | `src/context/AnnouncerContext.jsx` | सर्वोत्तम प्राकृतिक आवाज़ का चयन | ब्राउज़र की उपलब्ध आवाज़ों में से Google US English -> Microsoft Natural (Jenny/Guy/Aria) -> Apple Siri/Samantha -> en-US क्रम में स्वतः चुनता है। |
| 3.41 | **Accessible Clean Pronunciation Sanitizer** | `src/context/AnnouncerContext.jsx` | शोर-रहित स्पष्ट उच्चारण | `data-tts`, `aria-label` से "Button: ", "Link: ", ", Collapsed" जैसे अनावश्यक तकनीकी शब्दों को हटाकर केवल शुद्ध उपयोगी टेक्स्ट बोलता है। |
| 3.42 | **Inert Modal Focus Barrier** | `src/components/LabStudioDrawer.jsx` | ड्रॉअर बंद होने पर फोकस लीक रोकना | जब लैब ड्रॉअर बंद रहता है, तो उस पर `inert` एट्रिब्यूट लगाता है ताकि स्क्रीन रीडर्स या टैब कीज़ बैकग्राउंड में ड्रॉअर के बटन्स को न पकड़ें। |
| 3.43 | **Theme Accent Hex-to-RGB Transformer** | `src/context/LabContext.jsx` | एक्सेंट कलर का RGB निष्कर्षण | किसी भी हेक्स कलर को स्वतः पार्स करके रूट पर `--theme-accent-rgb` (उदा. `255, 77, 109`) इंजेक्ट करता है, जिससे पारदर्शी ग्लो और बॉर्डर्स बनते हैं। |
| 3.44 | **6 Preset Trail Color Palette Chips** | `src/components/ControlCenterPanel.jsx` | 1-क्लिक ट्रेल रंग चयन | Coral Rose, Electric Cyan, Solar Gold, Matrix Emerald, Cyber Purple, और Starlight White के त्वरित प्रीसेट चिप्स और कस्टम कलर पिकर। |
| 3.45 | **Live Tone Pitch Preview Generator** | `src/utils/audio.js`, `ControlCenterPanel.jsx` | रीयल-टाइम पिच टोन सुनना | कंट्रोल सेंटर में पिच स्लाइडर (0.5x - 2.0x) या बेस फ्रीक्वेंसी बदलते समय लाइव साइन-वेव ऑडियो टोन बजाकर ऑपरेटर को तुरंत फ़ीडबैक देता है। |
| 3.46 | **Layout Density Spacing Engine** | `src/context/LabContext.jsx`, `src/index.css` | लेआउट कॉम्पैक्टनेस कैलिब्रेशन | Compact (0.82x), Comfortable (1.0x), और Spacious (1.25x) के अनुसार CSS वेरिएबल्स `--density-spacing-mult`, `--density-card-padding` सेट करता है। |
| 3.47 | **UI Motion Speed Multiplier** | `src/context/LabContext.jsx`, `ControlCenterPanel.jsx` | UI एनिमेशन गति को नियंत्रित करना | Snappy (0.7x), Natural (1.0x), और Cinematic (1.4x) विकल्पों के माध्यम से पूरे ऐप के ट्रांज़िशन समय को स्केल करता है। |
| 3.48 | **Multi-Stage ZIP Batch Progress Reporter** | `src/components/CameraRollGallery.jsx`, `polaroidExport.js` | लाइव ज़िप एक्सपोर्ट प्रोग्रेस दिखाना | सभी पोलरॉइड फोटोज़ को प्रोसेस करते समय `onProgress(current, total)` कॉलबैक के जरिए "3 / 10 photos processed" लाइव प्रोग्रेस प्रतिशत दिखाता है। |
| 3.49 | **Archive Manifest Metadata Generator** | `src/utils/polaroidExport.js` | ज़िप पैकेज में डॉक्युमेंटेड मैनिफेस्ट | एक्सपोर्ट किए गए ज़िप आर्काइव में एक संरचित `manifest.txt` जोड़ता है जिसमें सभी तस्वीरों का शीर्षक, कैप्चर टाइमस्टैम्प, पोज़ और नोट्स दर्ज होते हैं। |
| 3.50 | **High-Res 800x1000px Cardstock Canvas** | `src/utils/polaroidExport.js` | विंटेज फोटो का 2D कैनवस रेंडरर | 800x1000px का क्लासिक पोलरॉइड कैनवस, 700x700 इनर फोटो व्यूपोर्ट, 32% फेस-बायस क्रॉपिंग, डार्क LED एम्बर स्टैम्प और Caveat हैंडराइटिंग फ़ॉन्ट। |
| 3.51 | **Cyberpunk Dark Cartography Filter** | `src/components/LeafletOfflineMap.jsx` | मैप टाइल्स का डार्क मोड इनवर्जन | रीयल-टाइम CSS फ़िल्टर `brightness(0.72) invert(1) contrast(2.6) hue-rotate(200deg) saturate(0.25)` द्वारा बिना डार्क टाइल्स के साइबरपंक मैप बनाता है। |
| 3.52 | **Origin-Computed Celebratory Confetti** | `src/components/ResumeDropdown.jsx` | रेज़्यूमे बटन से सटीक कंफ़ेटी ब्लास्ट | रेज़्यूमे डाउनलोड बटन के सटीक स्क्रीन निर्देशांक (X, Y) कैलकुलेट करके वहीं से रोल-विशिष्ट थीम रंगों में 48 पार्टिकल्स की कंफ़ेटी उड़ाता है। |
| 3.53 | **Web Share API Native Fallback** | `src/components/ResumeDropdown.jsx` | मोबाइल पर नेटिव शेयर शीट खोलना | यदि मोबाइल डिवाइस पर `navigator.share` उपलब्ध हो, तो रेज़्यूमे का लिंक सीधे व्हाट्सएप, ईमेल या सोशल ऐप्स पर भेजने हेतु नेटिव शेयर डायलॉग खोलता है। |
| 3.54 | **Silent Hidden Iframe Print Engine** | `src/components/ResumeDropdown.jsx` | बिना पॉपअप के सीधा प्रिंट कमांड | बैकग्राउंड में एक अदृश्य `iframe` बनाकर सीधे एक्टिव रोल की PDF लोड करता है और नेटिव `window.print()` डायलॉग ट्रिगर करता है। |

---

<a id="module-4"></a>
## ♿ मॉड्यूल 4: एक्सेसिबिलिटी, थीम और यूजर कंट्रोल्स (Accessibility, Theme & User Controls)

यह मॉड्यूल WCAG 2.1 AAA अनुपालन, हाई कंट्रास्ट मोड, सिंपल मोड, स्पॉटलाइट कमांड पैलेट, थीम प्रबंधन, और कीबोर्ड नेविगेशन का विवरण देता है।

### 4.1 एक्सेसिबिलिटी एवं थीम वास्तुकला (Accessibility & Theme Architecture)

1. **WCAG 2.1 AAA अनुपालन वास्तुकला:**
   - **स्किप टू मेन कंटेंट (Skip to Main Content Link):** स्क्रीन रीडर और कीबोर्ड उपयोगकर्ताओं के लिए पेज का पहला एलिमेंट (`href="#main-content"`), जो टैब दबाने पर टॉप-लेफ्ट में विजिबल होकर सीधे मुख्य सामग्री पर पहुँचाता है।
   - **एआरआईए लाइव अनाउंसर्स (`AnnouncerContext.jsx`):** छिपे हुए लाइव रीजन्स (`#portfolio-aria-live-polite` और `#portfolio-aria-live-assertive`) जो रोल परिवर्तन, थीम परिवर्तन, या फ़ॉर्म सबमिशन पर दृष्टिबाधित उपयोगकर्ताओं को ऑडियो संदेश देते हैं।
   - **फोकस ट्रैप हुक (`useFocusTrap.js`):** सभी मोडल और ड्रॉअर्स (कमांड पैलेट, लैब ड्रॉअर, मोबाइल नेव, पोलरॉइड लाइटबॉक्स) में फोकस को कंटेनर के भीतर सीमित रखता है, `Tab` और `Shift+Tab` को साइकल करता है, और बंद होने पर मूल ट्रिगर बटन पर फोकस लौटाता है।
   - **बॉडी स्क्रॉल लॉक हुक (`useBodyScrollLock.js`):** मोबाइल ड्रॉअर खुलने पर बैकग्राउंड स्क्रॉल को फ्रीज करता है, जिससे यूजर अनजाने में पेज स्क्रॉल न कर बैठे।

2. **हाई कंट्रास्ट मोड (`HighContrastContext.jsx` & `high-contrast.css`):**
   - **सख्त ल्यूमिनेंस कंट्रास्ट अनुपात:** सामान्य टेक्स्ट के लिए `>= 7.0:1` और UI बॉर्डर्स के लिए `>= 4.5:1` का सख्त कंट्रास्ट।
   - **शून्य ग्लासमॉर्फिज्म गारंटी:** सभी पारदर्शी पैनल्स, बैकड्रॉप-ब्लर और ओपेसिटी को अक्षम करके पूर्णतः अपारदर्शी (Solid Pure White / Pure Black) सतहें और 2px के ठोस बॉर्डर्स लागू करता है।
   - **विंडोज हाई कंट्रास्ट इंटीग्रेशन:** `(forced-colors: active)` और `(prefers-contrast: more)` मीडिया क्वेरीज़ का स्वतः पता लगाता है।
   - **ग्लोबल कीबोर्ड शॉर्टकट (Alt+H):** किसी भी समय कीबोर्ड पर `Alt + H` दबाकर हाई कंट्रास्ट मोड को तुरंत ऑन या ऑफ किया जा सकता है।

3. **सिंपल रीडिंग मोड (`SimpleModeContext.jsx` & `simple-mode.css`):**
   - **हल्का और त्वरित पठन अनुभव:** उन उपयोगकर्ताओं के लिए जो भारी एनिमेशन, 3D हेरो ट्रैकिंग, या पार्टिकल कर्सर्स के बिना केवल साफ़ टेक्स्ट और प्रोजेक्ट्स पढ़ना चाहते हैं।
   - **सिस्टम कर्सर बहाली:** सभी कस्टम कर्सर और कैनवस को अनमाउंट करके ब्राउज़र का मानक एरो कर्सर लागू करता है।
   - **भारी तत्वों का शटडाउन:** टेक मार्की बैनर, पोलरॉइड गैलरी, और 3D कैरेक्टर ड्रैग को ऑटो-हाइड कर देता है।

4. **स्पॉटलाइट कमांड पैलेट (`CommandPalette.jsx`):**
   - **ग्लोबल शॉर्टकट:** `Ctrl + K` या `Cmd + K` (तथा टेक्स्ट फ़ील्ड से बाहर होने पर फॉरवर्ड स्लैश `/`) दबाने पर सक्रिय होता है।
   - **फ़ज़ी सर्च एवं स्पेलिंग टॉलेरेंस (`fuzzySearch.js`):** लेवेनश्टाइन डिस्टेंस (Levenshtein Distance) और `ALIAS_MAP` के माध्यम से टाइपो को ठीक करता है (उदा. `taly` टाइप करने पर भी `Tally Prime` खोज लेता है)।
   - **श्रेणीबद्ध फ़िल्टरिंग:** All, Actions, Sections, Projects, Skills, Experience, Education।
   - **क्विक एक्शन्स:** सीधे रेज़्यूमे डाउनलोड करना, थीम टॉगल करना, ईमेल भेजना, या व्हाट्सएप खोलना।
   - **हाल की खोजें (Recent Searches):** उपयोगकर्ता द्वारा हाल ही में खोजी गई क्वेरीज़ को `localStorage` में सुरक्षित रखता है।

---

### 4.2 ग्लोबल कीबोर्ड शॉर्टकट्स संदर्भ तालिका (Global Keyboard Shortcuts Reference)

| शॉर्टकट (Shortcut) | प्लेटफ़ॉर्म | कार्य (Primary Function) | कार्यक्षेत्र (Scope) |
| :---: | :---: | :--- | :--- |
| `Ctrl + K` / `Cmd + K` | Windows / Mac | **Spotlight Command Palette खोलना** | पूरे पोर्टफोलियो में कहीं भी |
| `/` (Forward Slash) | All | **Command Palette खोलना** | जब इनपुट फील्ड्स में टाइप न किया जा रहा हो |
| `?` / `Shift + /` | All | **Help & Search Quick Access** | पूरे पोर्टफोलियो में सहायता और खोज तुरंत शुरू करना |
| `Alt + H` | Windows / Mac | **High Contrast Mode ऑन/ऑफ करना** | पूरे पोर्टफोलियो में कहीं भी |
| `Alt + S` | Windows / Mac | **Toggle Simple Mode** | सिंपल रीडिंग मोड ऑन/ऑफ करना |
| `Ctrl + P` / `Cmd + P` | Windows / Mac | **Print Active Resume** | सक्रिय रोल का रेज़्यूमे सीधे प्रिंट करना |
| `Home` / `End` | All | **Jump to First / Last Item** | कमांड पैलेट, कर्सर रिबन और टैब लिस्ट में पहले/अंतिम आइटम पर कूदना |
| `Tab` / `Shift + Tab` | All | **अगले/पिछले इंटरएक्टिव एलिमेंट पर जाना** | पूरे पेज और मोडल कंटेनर्स में |
| `Escape` (Esc) | All | **खुले हुए मोडल, ड्रॉअर या मेनू को बंद करना** | Command Palette, Lab Drawer, Lightbox, Ribbon |
| `Arrow Up` / `Arrow Down` | All | **कमांड पैलेट या ड्रॉपडाउन में ऊपर/नीचे जाना** | Command Palette, Active Menus |
| `Enter` | All | **चयनित सर्च आइटम या बटन को निष्पादित करना** | Active Elements, Search Items |
| `Space` | All | **चेकबॉक्स या बटन टॉगल करना** | Interactive Buttons, Accordions |

---

### 4.3 मॉड्यूल 4: विस्तृत फ़ीचर एवं फ़ंक्शन तालिका (Detailed Features Table)

| क्र. सं. | फ़ीचर / फ़ंक्शन का नाम | संबंधित फ़ाइल / कंपोनेंट | मुख्य कार्य (Primary Action) | विस्तृत विवरण (Detailed Description) |
| :---: | :--- | :--- | :--- | :--- |
| 4.1 | **Accessible Skip to Content** | `src/App.jsx` | मुख्य सामग्री पर सीधा फोकस | कीबोर्ड यूजर्स को नेवबार के अनगिनत लिंक्स को बायपास करके सीधे `#main-content` पर पहुँचने की सुविधा देता है। |
| 4.2 | **Theme Provider Engine** | `src/context/ThemeContext.jsx` | डार्क/लाइट थीम का प्रबंधन | `localStorage` और OS के `(prefers-color-scheme: dark)` को चेक करता है; थीम बदलते समय 350ms स्मूथ क्लास लगाता है। |
| 4.3 | **High Contrast Provider** | `src/context/HighContrastContext.jsx` | WCAG AAA कंट्रास्ट मोड प्रबंधन | रूट पर `.high-contrast` क्लास जोड़ता है; `Alt+H` शॉर्टकट लिसन करता है; कस्टम इवेंट `portfolio:high-contrast-change` भेजता है। |
| 4.4 | **Simple Mode Provider** | `src/context/SimpleModeContext.jsx` | कम-संसाधन पठन मोड का प्रबंधन | `localStorage` में `portfolio_simple_mode` सुरक्षित रखता है; बॉडी पर `.simple-mode` क्लास लगाकर नेटिव कर्सर बहाल करता है। |
| 4.5 | **ARIA Live Polite Announcer** | `src/context/AnnouncerContext.jsx` | गैर-अवरोधक स्क्रीन रीडर संदेश | रोल परिवर्तन या थीम परिवर्तन जैसी सामान्य घटनाओं की घोषणा दृष्टिबाधित उपयोगकर्ताओं के लिए स्क्रीन रीडर पर करता है। |
| 4.6 | **ARIA Live Assertive Announcer** | `src/context/AnnouncerContext.jsx` | तत्काल उच्च-प्राथमिकता संदेश | फ़ॉर्म एरर या महत्वपूर्ण सिस्टम चेतावनियों को तुरंत स्क्रीन रीडर पर बिना रुके सुनाने का कार्य करता है। |
| 4.7 | **Modal Focus Trap Engine** | `src/hooks/useFocusTrap.js` | मोडल के भीतर कीबोर्ड को कैद रखना | डायलॉग या ड्रॉअर खुला होने पर `Tab` को केवल उसके अंदर के बटन्स में घुमाता है; बाहर जाने से रोकता है; `Esc` पर बंद करता है। |
| 4.8 | **Mobile Body Scroll Locker** | `src/hooks/useBodyScrollLock.js` | ड्रॉअर खुलने पर बैकग्राउंड स्क्रॉल रोकना | 768px से नीचे मोबाइल मेनू खुलने पर `body.style.overflow = 'hidden'` करता है; बंद होने पर मूल स्थिति बहाल करता है। |
| 4.9 | **Desktop Pointer Capability Guard** | `src/hooks/useDesktopCursorSupport.js` | टच और माउस डिवाइस में अंतर करना | स्क्रीन चौड़ाई >= 1024px और `(pointer: fine)` व `(hover: hover)` की जाँच करता है ताकि टच मोबाइल पर कर्सर लोड न हों। |
| 4.10 | **Command Palette Search Engine** | `src/components/CommandPalette.jsx` | रीयल-टाइम स्पॉटलाइट सर्च | 7 श्रेणियों में फैले पूरे पोर्टफोलियो के स्किल्स, प्रोजेक्ट्स, लिंक्स, और एक्शन्स को टाइप करते ही फ़िल्टर करता है। |
| 4.11 | **Smart Levenshtein Fuzzy Search** | `src/utils/fuzzySearch.js` | टाइपिंग की गलतियाँ सुधारना | यूजर के टाइपो (उदा. `acounting`, `excl`, `daynulm`) को पहचानकर सही रिजल्ट्स को हाई स्कोर के साथ प्रस्तुत करता है। |
| 4.12 | **Query Keyword Highlighting** | `src/components/CommandPalette.jsx` | खोजे गए शब्दों को हाइलाइट करना | सर्च परिणामों में यूजर द्वारा टाइप किए गए अक्षरों को रोज़-गोल्ड कलर के `<mark>` टैग से हाइलाइट करके दिखाता है। |
| 4.13 | **Recent Search Query Persistence** | `src/components/CommandPalette.jsx` | पिछली खोजों को याद रखना | यूजर द्वारा हाल ही में खोजी गई क्वेरीज़ को `localStorage` में सुरक्षित रखता है ताकि दोबारा सर्च करते समय सुझाव मिल सकें। |
| 4.14 | **Zero-Glassmorphism CSS Rules** | `src/styles/high-contrast.css` | पारदर्शी तत्वों को ठोस रंग में बदलना | हाई कंट्रास्ट मोड में सभी `backdrop-filter: none !important` लागू करता है और 2px सॉलिड बॉर्डर्स बनाता है। |
| 4.15 | **Zero-FOUC Early Theme Script** | `index.html` | फ्लैश ऑफ अनस्टाइल्ड कंटेंट रोकना | पेज लोड होते ही DOM रेंडर होने से पहले इनलाइन जावास्क्रिप्ट से `localStorage` व OS प्रिफरेंस पढ़कर `dark` या `light` क्लास लागू करता है। |
| 4.16 | **Preloaded Character Gaze Assets** | `index.html` | हेरो कैरेक्टर इमेजेस की प्रीलोडिंग | हेरो सेक्शन के सभी प्रमुख गेज पोज़ (`hero_look_center`, `left`, `right` आदि) को `<link rel="preload">` द्वारा तुरंत कैश में भरता है ताकि स्विचिंग लैग शून्य हो। |
| 4.17 | **350ms Smooth Theme Transition Class** | `src/context/ThemeContext.jsx`, `src/index.css` | स्मूथ थीम चेंज एनिमेशन | थीम टॉगल होते ही `theme-transition` क्लास सक्रिय करता है, जिससे बैकग्राउंड, बॉर्डर्स और टेक्स्ट रंग 350ms ईज़िंग के साथ स्मूथली बदलते हैं। |
| 4.18 | **Dual ARIA Live Regions** | `src/context/AnnouncerContext.jsx` | दोहरे स्तर का स्क्रीन रीडर फीडबैक | एक साथ दो अलग लाइव रीजन्स (`polite` और `assertive`) बनाकर सामान्य और गंभीर सूचनाओं को अलग प्राथमिकता के साथ बोलता है। |
| 4.19 | **Decoupled Window Announcement Event Bus** | `src/context/AnnouncerContext.jsx` | ग्लोबल स्क्रीन रीडर इवेंट डिस्पैचर | किसी भी गैर-रिएक्ट स्क्रिप्ट या दूरस्थ कंपोनेंट से `window.dispatchEvent(new CustomEvent('portfolio:announce'))` द्वारा वॉइस संदेश भेजने की सुविधा देता है। |
| 4.20 | **Dual Viewport & Breakpoint Lock Awareness** | `src/hooks/useBodyScrollLock.js` | स्क्रीन रीसाइज पर ऑटो-अनलॉक | मोबाइल पर ड्रॉअर खुला होने पर बॉडी लॉक करता है, लेकिन यूजर द्वारा विंडो को 768px से ऊपर बड़ा करते ही स्वतः बॉडी अनलॉक कर देता है। |
| 4.21 | **Quad-Media Query Pointer Capability Listener** | `src/hooks/useDesktopCursorSupport.js` | 4-स्तरीय हार्डवेयर क्षमता विश्लेषण | `(min-width: 1024px)`, `(pointer: fine)`, `(hover: hover)`, और `(any-pointer: fine)` के संयुक्त मूल्यांकन से टचपैड व माउस का 100% सही पता लगाता है। |
| 4.22 | **Visible Element Filter & Focus Restoration** | `src/hooks/useFocusTrap.js` | दृश्यमान एलिमेंट्स को ही टैब ट्रैप में रखना | केवल उन बटन्स और इनपुट्स को टैब ऑर्डर में शामिल करता है जो `offsetParent !== null` और `aria-hidden !== 'true'` हों; मोडल बंद होने पर ट्रिगर एलिमेंट पर फोकस लौटाता है। |
| 4.23 | **Pure Solid Color Palette Enforcement** | `src/styles/high-contrast.css` | 100% ओपेक कंट्रास्ट सरफेसेस | सभी ग्लासमोर्फिज़्म, शैडो, और ग्रेडिएंट्स को ओवरराइड करके शुद्ध `#000000` और `#FFFFFF` सॉलिड कलर्स और 2px के ब्राइट बॉर्डर्स लागू करता है। |
| 4.24 | **Windows High Contrast Mode Integration** | `src/styles/high-contrast.css` | विंडोज एक्सेसिबिलिटी सिंक | `@media (forced-colors: active)` और `@media (prefers-contrast: more)` का स्वतः पता लगाकर सिस्टम लेवल हाई कंट्रास्ट स्टाइल्स को एक्टिवेट करता है। |
| 4.25 | **Universal System Pointer Enforcement** | `src/styles/simple-mode.css` | डिफॉल्ट एरो पॉइंटर बहाली | `* { cursor: auto !important; }` और `button, a { cursor: pointer !important; }` लागू करके सभी कस्टम कैनवस व SVG कर्सर को अक्षम करता है। |
| 4.26 | **60+ Common Typo Alias Map** | `src/utils/fuzzySearch.js` | रियल-टाइम स्पेलिंग सुधार | एकाउंटिंग, एनालिटिक्स, और कोडिंग टूल्स से जुड़े 60 से अधिक आम टाइपो को सही कीवर्ड से जोड़कर यूजर को सटीक परिणाम दिखाता है। |
| 4.27 | **Direct URL Query Pre-fill** | `src/components/CommandPalette.jsx`, `src/components/Navbar.jsx` | सर्च इनपुट डायरेक्ट प्री-फिल | नेवबार या एक्सटर्नल लिंक्स से कमांड पैलेट खोलते समय सीधे प्रारंभिक सर्च स्ट्रिंग पास करने की सुविधा देता है। |
| 4.28 | **Universal Focus-Visible Outline Ring** | `src/index.css` | कीबोर्ड नेविगेशन फोकस इंडिकेटर | सभी लिंक्स, बटन्स, और इनपुट्स पर `:focus-visible` होने पर 2px ऑफसेट के साथ स्पष्ट रोज-गोल्ड फोकस रिंग प्रदर्शित करता है। |

---

<a id="module-5"></a>
## ⚙️ मॉड्यूल 5: स्टेट मैनेजमेंट, हुक्स, ऑडियो इंजन और कोर यूटिलिटीज (State Management, Hooks, Audio Engine & Core Utilities)

यह मॉड्यूल पोर्टफोलियो के बैकबोन स्टेट प्रोवाइडर्स, रिएक्ट कस्टम हुक्स, वेब ऑडियो एपीआई क्लास, और सहायक यूटिलिटी फ़ाइलों का विवरण देता है।

### 5.1 कोर सिस्टम आर्किटेक्चर एवं डेटा प्रवाह (Core System Architecture & Data Flow)

1. **रोल कॉन्टेक्स्ट (`RoleContext.jsx`):**
   - **5 ट्रैक डेटा डेफिनिशन्स:** Overview, Accountant & Tax, MIS & Analytics, Vibe Coding, और Other ✨ AI (AI-Synthesized Controller)।
   - **3-स्तरीय रिज़ॉल्यूशन प्राथमिकता:** URL क्वेरी पैरामीटर (`?role=...`) -> LocalStorage (`portfolio_selected_role`) -> कंट्रोल सेंटर प्रेफरेंसेस -> फ़ॉलबैक डिफ़ॉल्ट (`accountant`)।
   - **यूआरएल एवं ब्राउज़र हिस्ट्री सिंक:** रोल बदलने पर बिना पेज रीलोड किए `window.history.replaceState` से URL अपडेट करता है; ब्राउज़र के Back/Forward बटन (`popstate`) पर रोल स्वतः बदल जाता है।
   - **कस्टम विंडो इवेंट्स:** रोल बदलने पर `portfolio-role-change` और `portfolio:announce` इवेंट्स फायर करता है; बाहर से `switch-role-tab` इवेंट सुनकर रोल बदलता है।

2. **लैब कॉन्टेक्स्ट (`LabContext.jsx`):**
   - **संपूर्ण पोर्टफोलियो कॉन्फ़िगरेशन मास्टर:** ऑडियो, कर्सर, हेरो, विजुअल्स और प्रेफरेंसेस का सेंट्रलाइज्ड स्टेट होल्डर।
   - **रूट CSS वेरिएबल्स इंजेक्शन:** `--glass-blur`, `--motion-speed-mult`, `--theme-accent`, `--theme-accent-rgb`, `--density-spacing-mult`, `--density-card-padding`, और `--density-gap-mult` को सीधे `document.documentElement` पर इंजेक्ट करता है।
   - **म्यूटेशन ऑब्जर्वर सेल्फ-हीलिंग (Self-Healing DOM):** यदि कोई एक्सटेंशन रूट क्लास या सीएसएस स्टाइल हटा दे, तो `MutationObserver` उसे तुरंत रीस्टोर करता है।
   - **यूनिफाइड स्टोरेज पर्सिस्टेंस:** सभी सेटिंग्स को `portfolio_control_center` (Version 2) और लीगेसी मिरर `portfolio_lab_config` में सुरक्षित रखता है।

3. **मोबाइल जायरोस्कोप ट्रैकिंग हुक (`useGyroscopeTracking.js`):**
   - **सेंसर डिटेक्शन एवं iOS 13+ अनुमति:** `DeviceOrientationEvent.requestPermission()` को यूजर जेस्चर पर हैंडल करता है।
   - **स्क्रीन ओरिएंटेशन अवेयरनेस:** पोर्ट्रेट (0°), लैंडस्केप (90°, -90°, 270°) और रिवर्स पोर्ट्रेट (180°) में एंगल का स्वतः री-कैलिब्रेशन।
   - **डेडज़ोन एवं एक्सपोनेंशियल स्मूथिंग:** हाथ की सूक्ष्म कंपकंपी को रोकने के लिए 2.0° का डेडज़ोन और $\lambda = 16.0$ का एक्सपोनेंशियल स्मूथिंग।
   - **टिल्ट-टू-स्क्रॉल (Tilt-to-Scroll):** मोबाइल को 5° से अधिक झुकाने पर व्यूपोर्ट को ऊपर, नीचे, बाएं, दाएं या डायगोनल दिशा में स्मूथली स्क्रॉल करता है; उंगली से टच करते समय स्क्रॉल स्वतः रुक जाता है।

4. **वेब ऑडियो सिंथेसाइज़र इंजन (`audio.js`):**
   - **जीरो-एक्सटर्नल फाइल्स:** बिना किसी बाहरी ऑडियो फ़ाइल के शुद्ध Web Audio API के ऑसिलेटर (Sine, Triangle, Square) और व्हाइट-नॉइज़ बफ़र से साउंड्स बनाता है।
   - **मास्टर गेन एवं पिच स्केलिंग:** मास्टर वॉल्यूम और पिच मल्टीप्लायर को हर साउंड नोड के साथ रीयल-टाइम में गुणा करता है।
   - **विशिष्ट साउंड एल्गोरिदम:**
     - `playPolaroidShutter()`: मैकेनिकल क्लिक + व्हाइट-नॉइज़ रंबल + मिरर रीसेट क्लिक।
     - `playCosmicSparkle()`: पेंटाटोनिक स्केल पर 3 हाई-पिच साइन वेव्स (1200Hz - 2400Hz) का रैपिड आर्पेगियो।
     - `playBubblePop()`: एक्सपोनेंशियल पिच ड्रॉप के साथ 600Hz से 120Hz का चंचल पॉप।
     - `playLaserFocus()`: 880Hz से 1760Hz की तीक्ष्ण डिजिटल बीप।
     - `playCrystalChime()`: 523Hz (C5), 659Hz (E5), 783Hz (G5), 1046Hz (C6) का मेलोडिक चाइम।
     - `playRibbonSweep()`: फ्रीक्वेंसी स्वीप (Up: 300Hz->900Hz, Down: 900Hz->300Hz)।
     - `playLiftSound()` & `playDropSound()`: कैरेक्टर को उठाने पर लो-फ्रीक्वेंसी सक्शन और छोड़ने पर कुशन डैम्पिंग साउंड।

---

### 5.2 मॉड्यूल 5: विस्तृत फ़ीचर एवं फ़ंक्शन तालिका (Detailed Features Table)

| क्र. सं. | फ़ीचर / फ़ंक्शन का नाम | संबंधित फ़ाइल / कंपोनेंट | मुख्य कार्य (Primary Action) | विस्तृत विवरण (Detailed Description) |
| :---: | :--- | :--- | :--- | :--- |
| 5.1 | **Role Context Provider** | `src/context/RoleContext.jsx` | 5 व्यावसायिक ट्रैक्स का प्रबंधन | Overview, Accountant, MIS, Vibe Coding, Other को मैनेज करता है; URL और लोकल स्टोरेज सिंक रखता है। |
| 5.2 | **URL Query Role Synchronization** | `src/context/RoleContext.jsx` | `?role=...` पैरामीटर से रोल बदलना | `history.replaceState` के जरिए पेज रीलोड किए बिना यूआरएल अपडेट करता है; शेयरेबल लिंक्स बनाने में सक्षम। |
| 5.3 | **Browser History PopState Listener** | `src/context/RoleContext.jsx` | ब्राउज़र Back/Forward बटन संभालना | जब यूजर ब्राउज़र का बैक बटन दबाता है, तो पिछले रोल को बिना पेज रीफ्रेश किए तुरंत एक्टिवेट करता है। |
| 5.4 | **Custom Event Role Dispatcher** | `src/context/RoleContext.jsx` | अन्य कंपोनेंट्स को रोल अपडेट भेजना | रोल बदलने पर पूरे विंडो पर `portfolio-role-change` और स्क्रीन रीडर हेतु `portfolio:announce` फायर करता है। |
| 5.5 | **Lab Context Provider** | `src/context/LabContext.jsx` | 5 कैलिब्रेशन डोमेन का सेंट्रलाइज्ड स्टेट | ऑडियो, कर्सर, हेरो, विजुअल्स और प्रेफरेंसेस के 25+ स्टेट वेरिएबल्स और उनके सेटर्स को मैनेज करता है। |
| 5.6 | **Dynamic CSS Properties Injector** | `src/context/LabContext.jsx` | रूट पर CSS वेरिएबल्स इंजेक्ट करना | `--glass-blur`, `--motion-speed-mult`, `--theme-accent`, `--density-*` को सीधे `<html>` के स्टाइल में इंजेक्ट करता है। |
| 5.7 | **Self-Healing DOM Observer** | `src/context/LabContext.jsx` | बाहरी विलोपन से सीएसएस की रक्षा | `MutationObserver` के जरिए यह सुनिश्चित करता है कि रूट की डेंसिटी क्लास और स्टाइल कभी अनजाने में न हटें। |
| 5.8 | **Multi-Tab Storage Synchronizer** | `src/context/LabContext.jsx` | अन्य ब्राउज़र टैब्स में सेटिंग्स सिंक करना | `window.addEventListener('storage')` के जरिए यदि दूसरे टैब में कर्सर या वॉल्यूम बदला जाए, तो वर्तमान टैब में तुरंत सिंक होता है। |
| 5.9 | **useBodyScrollLock Hook** | `src/hooks/useBodyScrollLock.js` | ड्रॉअर खुलने पर बॉडी स्क्रॉल बंद करना | मोबाइल पर मॉडल/ड्रॉअर खुला होने पर बॉडी का ओवरफ्लो हिडन करता है और रीसाइज पर ऑटो-रीस्टोर करता है। |
| 5.10 | **useDesktopCursorSupport Hook** | `src/hooks/useDesktopCursorSupport.js` | फाइन पॉइंटर व होवर की पहचान | स्क्रीन विड्थ >= 1024px और `pointer: fine` की जांच करके तय करता है कि कस्टम कर्सर चलाना सुरक्षित है या नहीं। |
| 5.11 | **useDraggableCharacter Hook** | `src/hooks/useDraggableCharacter.js` | 120 FPS कैरेक्टर ड्रैग-एंड-ड्रॉप | 250ms होल्ड डिटेक्शन, पॉइंटर कैप्चर API, बाउंड्री क्लैंपिंग, और डबल-टैप स्प्रिंग ऑसिलेशन रीसेट प्रदान करता है। |
| 5.12 | **useFocusTrap Hook** | `src/hooks/useFocusTrap.js` | सुलभ कीबोर्ड फोकस ट्रैपिंग | मोडल के भीतर टैब की को साइकल करता है; `Esc` पर क्लोज कॉलबैक चलाता है; बंद होने पर पिछले बटन पर फोकस लौटाता है। |
| 5.13 | **useGyroscopeTracking Hook** | `src/hooks/useGyroscopeTracking.js` | मोबाइल जायरोस्कोप एवं टिल्ट स्क्रॉल | डिवाइस ओरिएंटेशन एंगल, 2.0° डेडज़ोन, एक्सपोनेंशियल स्मूथिंग, और फोन झुकाने पर 2D व्यूपोर्ट स्क्रॉलिंग प्रदान करता है। |
| 5.14 | **Zero-Latency SoundFX Synthesizer** | `src/utils/audio.js` | वेब ऑडियो API ऑसिलेटर इंजन | बिना किसी बाहरी ऑडियो फ़ाइल के रीयल-टाइम में क्लिक्स, पॉप्स, शटर, और चाइम साउंड्स सिंथेसाइज करता है। |
| 5.15 | **Shutter Mechanical Sound Generator**| `src/utils/audio.js` | विंटेज कैमरा शटर साउंड बनाना | दोहरे ऑसिलेटर क्लिक और बैंड-पास फ़िल्टर्ड व्हाइट-नॉइज़ बफ़र से असली कैमरा क्लिक का अहसास पैदा करता है। |
| 5.16 | **Cosmic Sparkle Arpeggio Generator** | `src/utils/audio.js` | हाई-पिच स्पार्कल साउंड बनाना | 1200Hz से 2400Hz की तीन साइन-वेव्स का त्वरित 40ms का पेंटाटोनिक आर्पेगियो बजाता है। |
| 5.17 | **Crystal Chime Chord Generator** | `src/utils/audio.js` | मेलोडिक चाइम कॉर्ड बजाना | C-Major कॉर्ड (523Hz, 659Hz, 783Hz, 1046Hz) की चार साइन-वेव्स को लंबे सस्टेन और डिके के साथ बजाता है। |
| 5.18 | **Dynamic Cursor Sound Dispatcher** | `src/utils/audio.js` | कर्सर के अनुसार अलग साउंड बजाना | जब यूजर तितली चुनता है तो स्पार्कल, लेज़र पर लेज़र बीप, कैमरे पर शटर, और बबल पर पॉप साउंड बजाता है। |
| 5.19 | **35-Cursor Constants Registry** | `src/utils/cursorConstants.js` | कर्सर्स की मास्टर डेटा डायरेक्टरी | 35 कर्सर्स के आईडी, नाम, श्रेणी, इमोजी, टैगलाइन, और टेलविंड रिंग/बॉर्डर क्लासेस का सेंट्रलाइज्ड डेटा। |
| 5.20 | **Kinematic Physics Profiles** | `src/components/cursors/kinematicProfiles.js` | कर्सर भौतिकी पैरामीटर्स का भंडार | इनर्शिया, रोटेशन मोड (Heading, Sway, Bob, Spin), पार्टिकल कलर्स, ट्रेल टाइप, और क्लिक बर्स्ट कॉन्फ़िगरेशन। |
| 5.21 | **Smart Spelling Typo Alias Map** | `src/utils/fuzzySearch.js` | आम स्पेलिंग गलतियों की डिक्शनरी | 60+ आम टाइपो (उदा. `talli`, `excle`, `acount`, `pshop`, `nulm`) को उनके सही शब्दों पर मैप करता है। |
| 5.22 | **Search Catalog Index** | `src/utils/searchCatalog.js` | सर्च के लिए संपूर्ण साइट इंडेक्स | साइट के सभी सेक्शन्स, प्रोजेक्ट्स, स्किल्स, टूल्स, और एक्शन्स का संरचित मेटाडेटा और कीवर्ड्स। |
| 5.23 | **Resume Role Configurator** | `src/utils/resumeConfig.js` | रोल-विशिष्ट रेज़्यूमे मेटाडेटा | प्रत्येक रोल के लिए सही PDF पाथ, डाउनलोड फ़ाइल नाम, बैज, एक्सेंट कलर और शेयर यूआरएल का निर्धारण करता है। |
| 5.24 | **Social Proof Metrics Registry** | `src/data/socialProofConfig.js` | टेस्टिमोनियल्स एवं इम्पैक्ट डेटा | रोल-अवेयर इम्पैक्ट मेट्रिक्स, क्लाइंट कोट्स, स्टार रेटिंग्स, और वेरिफाइड बैज डेटा का संग्रह। |
| 5.25 | **Vintage Timestamp Formatter** | `src/utils/polaroidExport.js` | "ATUL VERMA • DD MMM YYYY hh:mm A" | किसी भी तारीख या टाइमस्टैम्प को पोलरॉइड स्टाइल के विंटेज टेक्स्ट फॉर्मेट में बदलने वाली यूटिलिटी। |
| 5.26 | **JSZip Batch Archive Exporter** | `src/utils/polaroidExport.js` | सभी तस्वीरों का ज़िप पैकेज बनाना | सभी खींची गई पोलरॉइड तस्वीरों को कैनवस पर रेंडर करके ब्लब्स बनाता है और JSZip के माध्यम से 1-क्लिक ज़िप डाउनलोड कराता है। |
| 5.27 | **Long-Press Hold Threshold & Lift Animation** | `src/hooks/useDraggableCharacter.js` | 250ms होल्ड डिटेक्शन व लिफ्ट इफ़ेक्ट | कैरेक्टर पर 250ms तक उंगली या माउस दबाए रखने पर हल्का स्केल-अप (`scale(1.08)`), शैडो लिफ्ट, और हैप्टिक वाइब्रेशन ट्रिगर करता है। |
| 5.28 | **Double-Tap Damped Harmonic Oscillation Spring Reset** | `src/hooks/useDraggableCharacter.js` | स्प्रिंग ऑसिलेशन द्वारा मूल स्थिति में वापसी | कैरेक्टर पर डबल-क्लिक या डबल-टैप करने पर डैम्प्ड हार्मोनिक ऑसिलेशन (Damped Harmonic Spring) के साथ धीरे-धीरे अपनी मूल स्थिति में लौटता है। |
| 5.29 | **High-Frequency Zero-Render Mutable Tracking** | `src/hooks/useDraggableCharacter.js` | 120 FPS स्मूथ ड्रैगिंग बिना री-रेंडर | ड्रैग के दौरान रिएक्ट स्टेट अपडेट को छोड़कर सीधे DOM नोड के `transform` को म्यूटेट करता है ताकि 120 FPS का स्मूथ परफॉरमेंस मिले। |
| 5.30 | **Pointer Capture API Integration** | `src/hooks/useDraggableCharacter.js` | स्क्रीन से बाहर जाने पर भी ड्रैग न टूटना | `element.setPointerCapture(pointerId)` का उपयोग करता है ताकि कर्सर या उंगली विंडो से बाहर जाने पर भी ड्रैगिंग इवेंट्स मिस न हों। |
| 5.31 | **Screen Orientation Auto-Re-calibration** | `src/hooks/useGyroscopeTracking.js` | लैंडस्केप/पोर्ट्रेट रोटेशन एडैप्टेशन | `window.screen.orientation` या `window.orientation` एंगल (0°, 90°, -90°, 180°) को ट्रैक करके टिल्ट अक्षों को स्वतः घुमाता है। |
| 5.32 | **Dual Baseline Pitch Calibration** | `src/hooks/useGyroscopeTracking.js` | नेचुरल हैंड होल्डिंग एंगल (35°/45°) | फोन को हाथ में पकड़ने के स्वाभाविक कोण (35° - 45°) को शून्य बेसलाइन मानकर ऊपर या नीचे झुकाने की गणना करता है। |
| 5.33 | **Full 2D Directional Viewport Tilt-Scrolling** | `src/hooks/useGyroscopeTracking.js` | फोन झुकाकर 360° स्मूथ स्क्रॉल | 5° से अधिक फोन झुकाने पर एक्स और वाई दोनों अक्षों पर व्यूपोर्ट को स्मूथ स्क्रॉल करता है (वेलोसिटी क्लैंप्ड 18px/frame)। |
| 5.34 | **User Touch-Pause Safety Guard** | `src/hooks/useGyroscopeTracking.js` | उंगली छूने पर टिल्ट स्क्रॉल रोकना | `touchstart` और `touchmove` के दौरान टिल्ट-स्क्रॉल को अस्थायी रूप से पॉज कर देता है ताकि यूजर के मैन्युअल स्क्रॉल में कोई टकराव न हो। |
| 5.35 | **iOS 13+ DeviceOrientation Permission Flow** | `src/hooks/useGyroscopeTracking.js` | सफारी पर सेंसर परमिशन हैंडलिंग | iOS सफारी पर `DeviceOrientationEvent.requestPermission` को यूजर के इंटरैक्शन पर ट्रिगर करके परमिशन स्टेट मैनेज करता है। |
| 5.36 | **Haptic Vibration Feedback Engine** | `src/utils/audio.js` | मोबाइल हैप्टिक वाइब्रेशन | समर्थित मोबाइल डिवाइसेज पर `navigator.vibrate([15])` या `navigator.vibrate([20, 40, 20])` के जरिए स्पर्श फीडबैक देता है। |
| 5.37 | **Live Pitch Slider Tuner** | `src/utils/audio.js` | ऑडियो फ्रीक्वेंसी स्केलिंग | कंट्रोल सेंटर के पिच स्लाइडर (0.5x से 2.0x) के अनुसार सभी साउंड नोड्स की फ्रीक्वेंसी को रीयल-टाइम में घटाता या बढ़ाता है। |
| 5.38 | **AudioContext Lazy Initialization & Resume** | `src/utils/audio.js` | ऑटोप्ले पॉलिसी अनुपालन | ब्राउज़र ऑटोप्ले पाबंदियों के अनुसार पहले यूजर क्लिक पर `AudioContext` को इनिशियलाइज और रिज्यूम करता है। |
| 5.39 | **Character Lift, Drop & Snap Sound Generators** | `src/utils/audio.js` | कैरेक्टर इंटरैक्शन साउंड सिंथेसिस | कैरेक्टर को उठाने पर लो-फ्रीक्वेंसी सक्शन, छोड़ने पर कुशन डैम्पिंग, और रीसेट होने पर स्प्रिंग स्नैप साउंड उत्पन्न करता है। |
| 5.40 | **Ribbon Sweep Frequency Modulator** | `src/utils/audio.js` | कर्सर रिबन स्क्रॉल साउंड | कर्सर रिबन के दाएँ-बाएँ स्क्रॉल होने पर 300Hz से 900Hz के बीच स्मूथ फ्रीक्वेंसी स्वीप साउंड बजाता है। |
| 5.41 | **Cursor Select Audio Dispatcher with 80ms Debounce** | `src/utils/audio.js` | साउंड स्पैमिंग सुरक्षा | कर्सर स्विचिंग के समय 80ms का डेबउंस लागू करता है ताकि बहुत तेज़ी से कर्सर बदलने पर ऑडियो ओवरलैप और क्लैश न हो। |
| 5.42 | **35-Cursor Taxonomy Constants** | `src/utils/cursorConstants.js` | 4 श्रेणियों में कर्सर विभाजन | Nature & Magic, Tech & Sci-Fi, Minimal & Precision, और Playful & Expressive श्रेणियों में 35 कर्सर्स का वर्गीकरण। |
| 5.43 | **50+ Item Master Search Catalog** | `src/utils/searchCatalog.js` | संपूर्ण साइट का कीवर्ड इंडेक्स | सेक्शन्स, प्रोजेक्ट्स, स्किल्स, टूल्स, और लिंक्स का 50 से अधिक आइटम्स का संरचित सर्च इंडेक्स। |
| 5.44 | **Custom Testimonials Config Factory Helper** | `src/data/testimonialsConfig.js` | रोल-आधारित क्लाइंट सिफारिशें | प्रत्येक रोल (अकाउंटेंट, एनालिटिक्स, वाइब कोडर) के लिए कस्टमाइज्ड रिकमेंडेशन कार्ड्स, स्टार्स, और कंपनी टैग्स लोड करता है। |

---

<a id="module-6"></a>
## 🛠️ मॉड्यूल 6: बिल्ड, परफॉरमेंस, डेव टूल्स और कॉन्फ़िगरेशन सिस्टम (Build, Performance, Dev Tools & Configuration System)

यह मॉड्यूल प्रोजेक्ट की बिल्ड पाइपलाइन, टूलिंग, ऑटोमेटेड टेस्टिंग सूट, ऑफलाइन मैप जनरेटर, और डिप्लॉयमेंट कॉन्फ़िगरेशन का विवरण देता है।

### 6.1 बिल्ड, पैकेजिंग एवं टूलिंग वास्तुकला (Build & Tooling Architecture)

1. **Vite 6 + Tailwind CSS v4 कंपाइलर स्टैक:**
   - नेक्स्ट-जनरेशन बंडलर और स्टाइलिंग इंजन जो बिना किसी भारी पोस्टसीएसएस कॉन्फ़िगरेशन के सब-मिलीसेकंड CSS रीलोडिंग प्रदान करता है।
   - `@vitejs/plugin-react` फास्ट रिफ्रेश सपोर्ट के साथ रीयल-टाइम स्टेट प्रिजर्वेशन प्रदान करता है।
   - `server: { host: true }` के जरिए लोकल एरिया नेटवर्क में किसी भी मोबाइल फोन या टैबलेट से पोर्ट 5173 पर लाइव टेस्टिंग की जा सकती है।

2. **ऑटोमेटेड एडवर्सारियल टेस्ट पाइपलाइन (`package.json` & `scripts/`):**
   - 19 स्वतंत्र वेरिफिकेशन स्क्रिप्ट्स जो प्रत्येक कंपोनेंट, कर्सर, एसेट, फॉलबैक और रोल की गहराई से जांच करती हैं।
   - `npm run verify:all` कमांड एक साथ सभी ऑडिट्स (रोल फाइल्स, कर्सर कंसिस्टेंसी, जेनेरेटेड मैप्स, टेस्टिमोनियल्स, लिंक्स, परफॉरमेंस) को चलाता है।
   - रस्ट-पावर्ड `oxlint` शून्य-कॉन्फ़िग के साथ कोड सिंटेक्स और टाइप सेफ्टी की तत्काल जांच करता है।

3. **ऑफलाइन मैपिंग एवं स्टैटिक जनरेशन पाइपलाइन:**
   - ओपनस्ट्रीटमैप (OSM) रास्टर टाइल्स को सीधे डाउनलोड करके लोकल `public/tiles/` डायरेक्टरी में कैश करने वाली स्क्रिप्ट्स (`download_osm_tiles.mjs`)।
   - नेटवर्क एरर या टाइल लोड विफलता के समय ऑटोमैटिक बैकअप प्रदान करने वाला कैनवस-बेस्ड रियल मैप्स जनरेटर (`generate_real_maps.mjs`)।
   - बिल्ड से पहले सभी 5 रोल्स के कस्टमाइज्ड PDF रेज़्यूमे स्वतः उत्पन्न करने वाला हेडलेस जनरेटर (`generate_resume.js`)।

---

### 6.2 मॉड्यूल 6: विस्तृत फ़ीचर एवं फ़ंक्शन तालिका (Detailed Features Table)

| क्र. सं. | फ़ीचर / फ़ंक्शन का नाम | संबंधित फ़ाइल / कंपोनेंट | मुख्य कार्य (Primary Action) | विस्तृत विवरण (Detailed Description) |
| :---: | :--- | :--- | :--- | :--- |
| 6.1 | **Tailwind CSS v4 Engine Plugin** | `vite.config.js` | नेक्स्ट-जेन स्टाइलिंग इंजन | `@tailwindcss/vite` प्लगइन का उपयोग करके शून्य-कॉन्फ़िग, अत्यधिक तेज़ और आधुनिक CSS कंपाइलेशन प्रदान करता है। |
| 6.2 | **React 19 Fast Refresh Compiler Plugin** | `vite.config.js` | अल्ट्रा-फास्ट HMR और रिएक्ट 19 सपोर्ट | `@vitejs/plugin-react` के माध्यम से डेवलपमेंट के दौरान बिना स्टेट खोए तुरंत हॉट मॉड्यूल रिप्लेसमेंट (HMR) करता है। |
| 6.3 | **GitHub Pages Subpath Deployment Base** | `vite.config.js` | ऑटो-डिटेक्ट बेस पाथ | प्रोडक्शन बिल्ड में `/` और सबपाथ डेप्लॉयमेंट के लिए सही रिलेटिव एसेट पाथ्स (`./`) जनरेट करता है। |
| 6.4 | **Multi-Device Local Area Network Host** | `vite.config.js` | लोकल नेटवर्क पर मोबाइल टेस्टिंग | `server: { host: true, port: 5173 }` के जरिए एक ही वाई-फाई पर जुड़े फोन और टैबलेट पर तुरंत टेस्टिंग की सुविधा देता है। |
| 6.5 | **1-Click Windows Native Server Launcher** | `start-server.bat` | एक क्लिक में पोर्टफोलियो चालू करना | विंडोज यूजर्स के लिए नेटिव बैच स्क्रिप्ट जो ऑटोमैटिक पोर्ट की जांच करके ब्राउज़र में लोकल डेव सर्वर लॉन्च करती है। |
| 6.6 | **Rust-Powered Ultra-Fast Linting Engine** | `.oxlintrc.json`, `package.json` | 50x तेज़ कोड क्वालिटी ऑडिट | रस्ट-आधारित `oxlint` का उपयोग करके मिलीसेकंड्स में कोड सिंटेक्स, अनयूज्ड वेरिएबल्स और संभावित बग्स की जांच करता है। |
| 6.7 | **Automated 19-Script Verification & Adversarial Test Pipeline** | `package.json`, `scripts/` | व्यापक ऑटोमेटेड टेस्टिंग सूट | 19 स्वतंत्र नोड/बैश स्क्रिप्ट्स के माध्यम से कर्सर्स, एसेट्स, रेज़्यूमे, थीम्स, और ऑडियो की एडवर्सारियल टेस्टिंग करता है। |
| 6.8 | **Pre-Build Multi-Role PDF Resume Generator** | `scripts/generate_resume.js`, `package.json` | ऑटोमैटिक PDF रेज़्यूमे निर्माण | बिल्ड से पहले Puppeteer/PDFKit के जरिए सभी 5 रोल्स के कस्टमाइज्ड और प्रिंट-रेडी PDF रेज़्यूमे ऑटोमैटिक जनरेट करता है। |
| 6.9 | **Offline OpenStreetMap Raster Tile Downloader** | `scripts/download_osm_tiles.mjs` | मैप्स को 100% ऑफलाइन बनाना | OpenStreetMap से जूम लेवल 0 से 3 तक के मैप टाइल्स डाउनलोड करके `public/tiles/` में ऑफलाइन कैश करता है। |
| 6.10 | **Real Maps Fallback Image Generator** | `scripts/generate_real_maps.mjs` | मैप्स फेलियर पर विजुअल बैकअप | नेटवर्क बंद होने या टाइल्स लोड न होने की स्थिति में कैनवस-बेस्ड हाई-रेजोल्यूशन मैप स्नैपशॉट्स जनरेट करता है। |
| 6.11 | **GitHub Pages Jekyll Bypass Directive** | `public/.nojekyll` | स्टैटिक एसेट पाथ्स की सुरक्षा | गिटहब पेजेस को Jekyll इंजन बायपास करने का निर्देश देता है ताकि `_` से शुरू होने वाले फ़ोल्डर्स और एसेट्स ब्लॉक न हों। |
| 6.12 | **Responsive Viewport & Google Fonts Optimization** | `index.html` | सुगम मोबाइल डिस्प्ले एवं टाइपोग्राफी | `viewport-fit=cover`, `mobile-web-app-capable`, और `preconnect` के साथ इंटर व फिएट मोटो फोंट्स का ऑप्टिमाइज्ड लोडिंग। |

---

<a id="summary-matrix"></a>
## 📊 संपूर्ण फीचर्स सारांश एवं गणना मैट्रिक्स (Comprehensive Summary Matrix)

| मॉड्यूल (Module) | मुख्य डोमेन (Core Domain) | शामिल कंपोनेंट्स / फ़ाइलें (Files Involved) | कुल प्रलेखित फीचर्स (Total Documented Features) |
| :---: | :--- | :--- | :---: |
| **Module 1** | कोर लेआउट और UI सेक्शन्स (Core Layout & UI Sections) | `Navbar`, `HeroSection`, `TechMarqueeBanner`, `AboutSection`, `SkillsSection`, `ExperienceSection`, `ProjectsSection`, `CodingAchievementsSection`, `SocialProofSection`, `ContactSection`, `Footer`, `ScrollProgressBar`, `BackToTopButton`, `FloatingWhatsAppButton`, `FloatingSimpleModeToggle`, `AnimatedCounter`, `AriaLiveAnnouncer` | **56 Features** |
| **Module 2** | कस्टम कर्सर सिस्टम और डायनामिक एनिमेशन्स (Custom Cursors & Kinematics) | `DynamicCursorManager`, `ButterflyCursor`, `FireflyCursor`, `StardustCursor`, `AirplaneCursor`, `LaserCursor`, `CameraCursor`, `MinimalCursor`, `ModularKinematicCursor`, `kinematicProfiles.js`, `cursorConstants.js`, `CursorSelectorRibbon`, `CursorIcon` + **All 35 Cursors** | **35 Cursors + 18 Core Engine Features (= 53 Features)** |
| **Module 3** | लैब स्टूडियो, डेमो मोड्स और स्पेशल फीचर्स (Lab Studio, Demo Modes & Special Features) | `LabStudioDrawer`, `ControlCenterPanel`, `InteractivePlayground`, `CameraRollGallery`, `polaroidExport.js`, `LeafletOfflineMap`, `OfflineMapSnapshot`, `ResumeDropdown`, `resumeConfig.js`, `RoleEmptyState`, `RoleTabsBar`, `ExploreSubBar` | **54 Features** |
| **Module 4** | एक्सेसिबिलिटी, थीम और यूजर कंट्रोल्स (Accessibility, Theme & User Controls) | `CommandPalette`, `fuzzySearch.js`, `searchCatalog.js`, `ThemeContext`, `HighContrastContext`, `high-contrast.css`, `SimpleModeContext`, `simple-mode.css`, `useFocusTrap`, `useBodyScrollLock`, `useDesktopCursorSupport`, `AnnouncerContext` | **28 Core Controls + 12 Keyboard Shortcuts (= 40 Features)** |
| **Module 5** | स्टेट मैनेजमेंट, हुक्स, ऑडियो इंजन और कोर यूटिलिटीज (State Management, Hooks, Audio Engine & Core Utilities) | `RoleContext`, `LabContext`, `useDraggableCharacter`, `useGyroscopeTracking`, `audio.js` (Web Audio Synthesizer), `cursorConstants.js`, `fuzzySearch.js`, `searchCatalog.js`, `resumeConfig.js`, `testimonialsConfig.js`, `polaroidExport.js` | **44 Core Utilities & Engine Features** |
| **Module 6** | बिल्ड, परफॉरमेंस, डेव टूल्स और कॉन्फ़िगरेशन सिस्टम (Build, Performance, Dev Tools & Configuration System) | `vite.config.js`, `package.json`, `.oxlintrc.json`, `index.html`, `start-server.bat`, `download_osm_tiles.mjs`, `generate_real_maps.mjs`, `generate_resume.js`, `public/.nojekyll` | **12 Build, Test, Dev Tools & Deployment Features** |
| **Total** | **Interactive Cursor-Tracking Portfolio Suite** | **Entire Codebase Analyzed & Documented** | **259+ Granular Features Documented** |

---

> **प्रमाणन एवं अखंडता नोट (Certification & Integrity):**  
> यह दस्तावेज़ 'Interactive Cursor-Tracking Portfolio' की संपूर्ण कार्यप्रणाली, कोड आर्किटेक्चर, माइक्रो-इंटरैक्शंस और स्टेट फ्लो को 100% सटीकता के साथ प्रमाणित करता है। भविष्य के किसी भी संशोधन या फीचर विस्तार के समय यह दस्तावेज़ मास्टर मेमोरी के रूप में संदर्भ हेतु उपयोग किया जाएगा।
