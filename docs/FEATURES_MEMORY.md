# Interactive Cursor-Tracking Portfolio — Complete Features Memory & Architecture Dossier

> **दस्तावेज़ संस्करण (Document Version):** 5.0.0 (Production Master — Universal Voice Agent, 3D Sandbox Studio, Offline Meta-Prompt Engine & Complete Forensic 512 Features Ledger)  
> **अंतिम अद्यतन (Last Updated):** 2026-10-26  
> **परियोजना (Project):** Interactive Cursor-Tracking Portfolio (अतुल वर्मा / Atul Verma)  
> **स्थान (Location):** `docs/FEATURES_MEMORY.md`  
> **भाषा (Language):** Hinglish (सरल, स्पष्ट हिंदी + मानकीकृत तकनीकी अंग्रेज़ी शब्दावली)  
> **प्रौद्योगिकी स्टैक (Tech Stack):** React 19, Vite 8, Tailwind CSS v4, Web Audio API Synthesizer, Web Speech API (TTS), 120 FPS HTML5 Canvas 2D, Leaflet.js, JSZip, Canvas-Confetti, Lucide-react, RFC 6350 vCard Engine, Pure SVG Dynamic QR Generator, Schema.org FAQPage JSON-LD, Rollup Manual Chunks Code Splitting, Oxlint, @huggingface/transformers (On-Device LLM Web Worker), WebGPU / WASM Inference Backend, Client-Side Hardware & Storage Profiler

---

## 📌 कार्यकारी सारांश एवं आर्किटेक्चर अवलोकन (Executive Architecture Overview)

यह दस्तावेज़ **Interactive Cursor-Tracking Portfolio** के प्रत्येक मॉड्यूल, कंपोनेंट, हुक, कॉन्टेक्स्ट, यूटिलिटी, साउंड इफ़ेक्ट, कीबोर्ड शॉर्टकट, बिल्ड पाइपलाइन और माइक्रो-इंटरैक्शन का एक संपूर्ण, अटूट और विस्तृत 'फीचर्स मेमोरी' (Features Memory) मास्टर रिकॉर्ड है। संपूर्ण कोडबेस (All files in `src/`, `public/`, `scripts/`, root configs) के गहन फोरेंसिक ऑडिट के बाद इसे **525+ विस्तृत फीचर्स** एवं **16 विशिष्ट तकनीकी मॉड्यूल्स** (कुल 512 ग्रैन्युलर प्रोडक्शन फीचर्स) के साथ अद्यतित किया गया है।

इस पोर्टफोलियो को आधुनिक वेब टेक्नोलॉजीज की उच्चतम क्षमताओं के साथ डिज़ाइन किया गया है:
1. **मल्टी-ट्रैक रोल आर्किटेक्चर (Multi-Role Track System):** 5 एकीकृत ट्रैक्स — **Overview**, **Accountant & Tax**, **MIS & Analytics**, **Vibe Coding**, और **Other (AI-Synthesized Controller)** — जो URL पैरामीटर्स (`?role=...`), `localStorage`, और कस्टम इवेंट्स के साथ 100% सिंक्रनाइज़ रहते हैं।
2. **35 कस्टमाइज़्ड कर्सर एवं 120 FPS काइनेमैटिक्स (Custom Cursors & Kinematics Engine):** 7 श्रेणियों (Living & Nature, Cosmic & Magic, Tech & Cyberpunk, Playful & Vehicles, Elemental & Forces, Precision & Design, Arcade & Retro) में फैले 35 कर्सर शैलियाँ, जो एक्सपोनेंशियल स्मूथिंग (Exponential Lerp), हेडिंग रोटेशन (Heading Angle), एरोडायनामिक बैंकिंग (Aerodynamic Banking), और एडिटिव पार्टिकल ट्रेल कैनवस के साथ चलते हैं।
3. **पोर्टफोलियो कंट्रोल सेंटर एवं लैब स्टूडियो (Portfolio Control Center & Lab Studio):** 6 कैलिब्रेशन टैब्स (Audio Studio, Cursor Dynamics, Hero Tracking, Startup Preferences, Display & Visuals, तथा 3D Spatial & Physical Studio) जिसमें 1-क्लिक फ़ैक्टरी रीसेट, मल्टी-टैब स्टोरेज सिंक, 3D सैंडबॉक्स प्रीव्यू और वेब स्पीच इंजन (TTS) शामिल है।
4. **एक्सेसिबिलिटी एवं समावेशी डिज़ाइन (WCAG 2.1 AAA Accessibility):** हाई-कंट्रास्ट मोड (Alt+H), सिंपल मोड (कम-संसाधन पठन मोड), एआरआईए लाइव अनाउंसर्स (ARIA Live Regions), वेब स्पीच वॉयस फोकस अनाउंसर, और स्ट्रिक्ट कीबोर्ड ट्रैपिंग (`useFocusTrap`)।
5. **शून्य-विलंबता वेब ऑडियो सिंथेसाइज़र (Zero-Latency Web Audio API Synthesizer):** बिना किसी बाहरी MP3/WAV फ़ाइल के, ऑसिलेटर और नॉइज़ जनरेटर के माध्यम से कैमरा शटर, स्पार्कल, बबल पॉप, लेज़र बीप, क्रिस्टल चाइम, मैकेनिकल कीक्लिक्स और हैप्टिक फीडबैक का रीयल-टाइम निर्माण।
6. **हाइब्रिड ऑफ़लाइन मैप एवं पोलरॉइड एक्सपोर्टर (Hybrid Offline Map & Polaroid Studio):** लोकली टाइल-कैश्ड लीफ़लेट मैप (साइबरपंक डार्क मोड फ़िल्टर के साथ) और जेएसज़िप (JSZip) के साथ संपूर्ण फोटो एल्बम का 1-क्लिक ज़िप एक्सपोर्ट।
7. **शून्य-क्लैश फ्लोटिंग कॉलम आर्किटेक्चर (Collision-Free Right-Rail Column):** सिंपल मोड और कांटेक्ट अनलॉक स्थितियों के अनुरूप स्वतः पुनर्व्यवस्थित होने वाले फ्लोटिंग बटन्स और डायनामिक स्टैकिंग क्लीयरेंस।
8. **ऑटोमेटेड वेरिफिकेशन एवं टेस्ट पाइपलाइन (Automated 42-Suite / 95+ Verification Pipeline):** 42 स्वतंत्र वेरिफिकेशन और एडवर्सैरियल टेस्ट सूट्स जो लेआउट डेंसिटी, मैप बाउंड्स, ऑडियो, टर्मिनल सीएलआई, केस स्टडीज, व्यू मोड, ऑडियंस फ़िल्टर, रोल्स, स्क्रॉल रीस्टोरेशन, 3D कंट्रोल्स, और सीडीपी रिफ्रेश रेजिलिएंस की 100% अखंडता प्रमाणित करते हैं।
9. **इंटरएक्टिव डेवलपर टर्मिनल सीएलआई (~/_ Terminal CLI):** Multi-OS (macOS, Windows 11, Ubuntu Linux) डेस्कटॉप स्विचर, CRT स्कैनलाइन्स, मैट्रिक्स रेन, 20+ कमांड्स (neofetch, filesystem, cowsay, weather), 15+ बैकग्राउंड कलर्स और ओपेसिटी कंट्रोल्स।
10. **डीप-डाइव केस स्टडीज आर्किटेक्चर एवं लाइव टेलीमेट्री सिमुलेटर (9 Project Case Studies):** सभी 9 प्रोजेक्ट्स के लिए 5-स्टेज स्टोरीटेलिंग डॉसियर, 4-टियर विजुअल फ्लोचार्ट्स, लाइव टेलीमेट्री सिमुलेटर (`CaseStudySimulator.jsx`), और `?project=<id>` यूआरएल डीप लिंकिंग।
11. **एंड-टू-एंड बहुभाषी स्थानीयकरण (EN ⇄ HI Localization System):** 450+ कीज का द्विभाषी डिक्शनरी, WAI-ARIA वॉइस अनाउंसर कोऑर्डिनेशन, और तकनीकी शब्दों (React, Tally, GST, API) का हाइब्रिड प्रिजर्वेशन।
12. **सेंट्रलाइज्ड मास्टर स्पीड-डायल फ्लोटिंग एक्शन हब (Master Speed-Dial FAB):** लैब स्टूडियो, व्यू मोड, ऑडियंस फ़िल्टर, एआई चैट, सिंपल मोड, और व्हाट्सएप का एकीकृत स्पीड-डायल मेनू, आइसोलेटेड आइकॉन रोटेशन और ड्रॉअर के साथ ऑटोमैटिक स्पेसियल ग्लाइड (`sm:right-[460px]`)।
13. **ऑडियंस व्यक्तित्व फ़िल्टर (Audience Persona View Filter):** 4 आगंतुक व्यक्तित्वों (All, Recruiter, Freelance Client, Marriage/Matrimonial) के लिए पोर्टल-माउंटेड ड्रैगैबल ग्लासमॉर्फिक कार्ड, स्पॉटलाइट चमक, और URL/localStorage सिंक।
14. **4-स्तरीय व्यू मोड सिस्टम (View Mode 4-Tier Presentation Switcher):** Basic / PDF, Simple / Classic, Modern / Interactive, और Terminal / Developer मोड्स, द्विभाषी ड्यूल-डिस्क्रिप्टर लेबल्स और ड्रैगैबल फ्लोटिंग पिल।
15. **ग्लोबल एआई चैट असिस्टेंट एवं डॉक्ड स्टेशन (Global AI Chat Assistant):** बॉटम-डॉक्ड स्टेशन आर्किटेक्चर (`bottom-0`, `rounded-t-2xl`), तत्काल बायोग्राफी व प्रोजेक्ट ज्ञान, प्रॉम्ट चिप्स, ऑनबोर्डिंग डिसीजन ट्री, ऑडियंस-ट्यून्ड इमोजी कंट्रोल, और `BotMessageSquare` ब्रांडिंग।
16. **40-आइटम द्विभाषी FAQ सूचना प्रणाली (FAQ Information System):** 2-लेयर फ़िल्टरिंग मैट्रिक्स (Audience & Role), लाइव कीवर्ड सर्च, कैटेगरी चिप्स, और Schema.org FAQPage JSON-LD स्ट्रक्चर्ड मेटाडेटा।
17. **कांटेक्ट 4-टैब हब, इन-टैब कोटेशन कैलकुलेटर एवं डिजिटल बिजनेस कार्ड (vCard & Dynamic QR):** 4 समर्पित टैब्स ('touch', 'quote', 'direct', 'location'), इन-टैब 3-ट्रैक फीस व टाइमलाइन कैलकुलेटर, प्योर SVG डायनामिक QR कोड, और RFC 6350 `.vcf` डाउनलोड।
18. **सत्यापित अकादमिक क्रेडेंशियल एवं सर्टिफिकेट लाइटबॉक्स (Credential Lightbox Inspector):** गोल्ड सील, 1-क्लिक वेरिफिकेशन आईडी कॉपी, फुलस्क्रीन प्रीव्यू और WCAG 2.1 AAA फोकस ट्रैप।
19. **रोलअप वेंडर चंक स्प्लिटिंग एवं बिल्ड ऑप्टिमाइज़ेशन (Vite Production Code Splitting):** 6 स्वतंत्र वेंडर चंक्स (`vendor-react`, `vendor-leaflet`, `vendor-jszip`, `vendor-confetti`, `vendor-lucide`, `data-case-studies`) और 600 kB वार्निंग लिमिट।
20. **रिजिलिएंट लेज़ी लोडिंग, डायनामिक ऑन-डिमांड कोड स्प्लिटिंग एवं साइबर HUD स्केलेटन (Dynamic Code Splitting & CLS-Free Skeletons):** `lazyWithRetry` ऑटो-रीट्राई इंजन, 5-वैरिएंट `SectionSkeleton` (CLS=0), JSZip का ऑन-डिमांड एसिंक इम्पोर्ट, और मेदिनीनगर HQ जीआईएस निर्देशांकों वाला `GISMapSkeleton` (कोर बंडल 1,254 kB से घटकर 462 kB, -63.2% अनुकूलन)।
21. **120 FPS काइनेमैटिक्स, मेमोरी पूलिंग एवं ज़ीरो-रिफ्लो रेंडरिंग आर्किटेक्चर (High-Refresh Kinematics & Memory Pooling):** ड्रैगेबल कैरेक्टर स्प्रिंग लूप से प्रति-फ्रेम React स्टेट म्यूटेशन हटाना, `getBoundingClientRect` लेआउट थ्रैशिंग का उन्मूलन, 35 कर्सर्स में प्री-एलोकेटेड फिक्स्ड पार्टिकल पूल्स (`MAX_PARTICLES=70/60`), डर्टी-फ्लैग कैनवस ओवरड्रॉ प्रिवेंशन, और ड्रैग रिलीज पर अनपेक्षित फोटो क्लिक सप्रेसर।
22. **मल्टी-टियर वैश्विक ErrorBoundary एवं फॉल्ट आइसोलेशन आर्किटेक्चर (Global Crash-Resilient Fault Isolation):** पूरे एप्लिकेशन रूट (`AppRoot`) और भारी स्लाइड-आउट मॉड्यूल्स (`LabStudioDrawer`, `TerminalCLI`, `CaseStudyDrawer`, `CredentialLightboxModal`, `AIChatWidget`, `Footer`) पर स्वतंत्र `ErrorBoundary` बाउंड्रीज, जिससे किसी भी अप्रत्याशित रनटाइम एरर की स्थिति में शून्य-ब्लैंक-स्क्रीन रेजिलिएंस और 1-क्लिक रीलोड / ट्राई अगेन की सुविधा मिलती है।
23. **स्टैंडअलोन फुलस्क्रीन कंट्रोल सेंटर स्टूडियो एवं टू-टियर आर्किटेक्चर (Standalone Control Center Fullscreen Studio):** भारी पोर्टफोलियो मॉड्यूल्स (Hero, 3D Canvas, Particles, Projects) को अनमाउंट रखकर `?view=control` और `?panel=control` के जरिए शून्य-DOM-क्लटर के साथ अल्ट्रा-फास्ट स्टूडियो बूट, `mode=all` (फुल स्टूडियो) बनाम `mode=single` (आइसोलेटेड सिंगल सबसिस्टम लॉक) टू-टियर आर्किटेक्चर, यूआरएल डीप लिंकिंग, और मल्टी-टैब लोकलस्टोरेज रीयल-टाइम सिंक।
24. **ऑन-डिवाइस न्यूरल LLM एआई इंजन एवं हार्डवेयर प्रोफाइलर (On-Device Local AI & Transformers.js):** शून्य-अनुमति क्लाइंट-साइड हार्डवेयर प्रोफाइलर (`deviceProfiler.js`), 50ms डिटरमिनिस्टिक माइक्रो-बेंचमार्क, स्ट्रिक्ट कंजर्वेटिव टियरिंग लॉजिक (4B क्षमता -> 1.5B/Medium, 1B क्षमता -> 0.5B/Light, Mobile/Constrained -> 135M Bare-Minimum), 0ms मेन-थ्रेड ब्लॉकिंग वेब वर्कर (`aiModelWorker.js`), वेबजीपीयू से वास्म ऑटो-फ़ॉलबैक, और एआई चैट रिस्पॉन्स पर मॉडल एट्रिब्यूशन बैज (`[SmolLM-135M]`, `[Qwen-0.5B]`, `[Qwen-1.5B]`, `[Portfolio-Engine]`)।
25. **Phase 1 & Phase 2 Certified — 360° सर्कुलर ऑर्बिटल सन कंपास डायल एवं फोटो-यथार्थवादी 3D मटीरियल शेडर ओर्ब्स (Phases 1 & 2 Certified):** Phase 1: 140px सर्कुलर सन कंपास डायल, 8-पॉइंट कार्डिनल नेविगेशन (N, E, S, W), विपरीत दिशा में रेंडर होने वाला लाइव शैडो स्फीयर (36px, inverted drop shadow), ±4° मैग्नेटिक स्नैपिंग, 2x2 क्विक क्वाड्रेंट बटन्स, पूर्ण ARIA स्लाइडर कीबोर्ड एक्सेसिबिलिटी (+5°/-5°, PageUp/PageDown, Home/End), तथा `--3d-light-angle` रूट CSS वेरिएबल का रीयल-टाइम सैंडबॉक्स सिंक्रोनाइज़ेशन (`scripts/verify_gap1_orbital_sun_compass.mjs` पर 10/10 PASS प्रमाणित)। Phase 2: 4 फोटो-यथार्थवादी 3D मटीरियल शेडर ओर्ब्स (Glass Acrylic, Metallic Gloss, Neumorphic Clay, Cyber Wireframe) 56px वेक्टर्स व ग्लाइन्ट शीन, WAI-ARIA रेडियो-ग्रुप, और बेवेल एक्सट्रूज़न के साथ डायनामिक रूप से स्केल होने वाला एसवीजी बेवेल शैंफर प्रोफाइल डायग्राम (`scripts/verify_gap2_material_shader_orbs.mjs` पर 11/11 PASS प्रमाणित)।
26. **मल्टी-टैब एंटी-इको सिंक्रोनाइज़ेशन एवं सेटिंग्स रिवर्जन शील्ड (Multi-Tab Anti-Echo & Reference Stability):** `isIncomingSyncRef` और `lastSavedPayloadRef` के जरिए मल्टी-विंडो में सेटिंग्स सिंक करते समय इनफिनिट लूप, फ्लिकरिंग और सेटिंग्स रिवर्जन की पूर्ण रोकथाम, ऑडियो वॉयस सेटिंग्स पर्सिस्टेंस, और सिबलिंग कॉन्टेक्स्ट्स (`ThemeContext`, `LanguageContext`, `HighContrastContext`, `RoleContext`) का 100% क्रॉस-टैब स्टोरेज सिंक।
27. **Phase 3 Certified — इंटरएक्टिव मिनी पोर्टफोलियो लेआउट 3D ब्लूप्रिंट एवं बैच टॉगल चिप्स (Phase 3 Certified • Gap #4 Blueprint Wireframe & Batch HUD):** सेक्शन 1 ('Element 3D Conversion Toggles') में एम्बेडेड 200px आर्किटेक्चरल वेक्टर लेआउट, 10 पोर्टफोलियो एलिमेंट्स (Nav Menu, Icons, Resume, Avatar, Header, SubHeader, Description, Container, ContainerContent, Floating Button), पल्सिंग स्टेटस डॉट्स (3D एक्टिव पर एमराल्ड ग्लो + `animate-ping`, 2D पर म्यूटेड स्लेट), 3 ग्रुप बैच टॉगल चिप्स (`Toggle Nav (4)`, `Toggle Hero (4)`, `Toggle Cards (2)`) स्मार्ट सिंक्रोनस लॉजिक (सभी ON -> OFF, कोई भी OFF -> ON) व लाइव काउंटर्स (X/4, X/2), 2-वे सिंक्रोनाइज़्ड होवर हाइलाइटिंग (`ring-2 ring-[#FF4D6D]/40`), शो/हाइड मैप टॉगल बटन, WAI-ARIA रीज़न, तथा `LabContext` में `set3DElementGroup` (`scripts/verify_gap4_blueprint_wireframe.mjs` पर 15/15 PASS प्रमाणित)।
28. **प्रोफेशनल 3D व्यूपोर्ट टूल्स सुइट (Professional 3D Viewport Tools Suite on Interactive Sandbox):** 4 शेडिंग/व्यूपोर्ट मोड्स HUD पिल बार (`rendered`, `wireframe`, `clay`, `xray`) रीयल-टाइम CSS शेडर्स के साथ; सीएडी बाउंडिंग बॉक्स एवं लाइव डायमेंशन टैग्स (`W: 280mm`, `H: 180mm`, `Z: ...mm`); ड्रैगेबल स्प्लिट-स्क्रीन A/B स्लाइडर (`isSplitComparison`, `splitPosition`) CSS `clipPath` और `2D FLAT` / `3D SPATIAL` बैज के साथ; तथा मैक्सिमाइज/एक्सपैंड स्टूडियो व्यूपोर्ट टॉगल (`isSandboxExpanded`, Lucide `Maximize2` / `Minimize2`, `h-96 sm:h-[420px]`) ग्राउंड ग्रिड और शैडो के आनुपातिक विस्तार के साथ।
29. **Phase 4 Certified — 3D आइसोमेट्रिक लेयर स्ट्रैटा स्टैक डायग्राम एवं सीएडी डेप्थ कॉलआउट्स (Phase 4 Certified • Isometric Strata Stack & CAD Callouts):** सेक्शन 6 ('3D Exploded Layer Disassembly & Blueprint View') में सेपरेशन डिस्टेंस स्लाइडर के ऊपर ~160px का इंटरएक्टिव 3D आइसोमेट्रिक लेयर स्ट्रैटा विजुअलाइज़र — 3 भौतिक स्ट्रैटा स्लैब्स (`[Strata 01: Core Glass Chassis]`, `[Strata 02: Circuit Blueprint Grid]`, `[Strata 03: Floating Typography & CTAs]`), जो `separationDistance` (0px-100px) और `layerStagger` के अनुसार वास्तविक समय में Z-अक्ष पर अलग होते हैं; 4 कॉर्नर सीएडी प्रोजेक्शन लाइन्स (`strokeDasharray="3 3"`); लाइव डायमेंशन कॉलआउट बैज (`+Xmm Z-Separation`, `Stagger: Xms`); ब्लूप्रिंट मोड में ग्लोइंग नियॉन सियान सीएडी वेक्टर ग्रिड में स्वतः रूपांतरण; होवर कंपोनेंट इन्वेंटरी टूलटिप; 1-क्लिक सोलो स्ट्रैटम मोड (`soloStrata`) जो टॉप 3D सैंडबॉक्स कार्ड में गैर-सोलो परतों को 0.15 ओपेसिटी पर डिम और चयनित परत को सियान ग्लो व फ्लोटिंग HUD एग्जिट पिल के साथ हाइलाइट करता है (`scripts/verify_phase4_exploded_strata.mjs` पर 13/13 PASS प्रमाणित)।
30. **Phase 5 Certified — स्प्रिंग इलास्टिसिटी ऑसिलेशन वेवफॉर्म ग्राफ एवं इंटरएक्टिव 'टैप टू टेस्ट' पैड (Phase 5 Certified • Spring Elasticity Oscillation Graph & Interactive "Tap to Test" Pad):** सेक्शन 5 ('Physics & Interaction') में इलास्टिसिटी सेलेक्टर ग्रिड के ठीक नीचे एम्बेडेड रीयल-टाइम एनिमेटेड SVG हार्मोनिक डिके वेवफॉर्म ग्राफ (`SpringOscillationWaveform`) — 3 प्रीसेट्स: Rigid (क्रिटिकल डैम्पिंग, 0% ओवरशूट, तात्कालिक रेस्ट), Snappy (iOS-स्टाइल स्प्रिंग कर्व, सिंगल 12% ओवरशूट पीक), और Bouncy (अंडर-डैम्प्ड 3-वेव डिकेइंग साइन हार्मोनिक रिकॉइल, 35% ओवरशूट); `y=30` पर डैश्ड इक्विलिब्रियम रेफरेंस सेटलिंग लाइन; तथा लाइव ऑसिलेशन वेलोसिटी दर्शाने वाला SVG `<animateMotion>` पल्सिंग डॉट। साथ ही, ठीक बगल में 3D पर्सपेक्टिव 'टैप टू टेस्ट' पैड (`PhysicsTestPad`) — एक्टिव `hoverPop` दूरी (4-32px) पर हवा में उठने वाला 3D एलिवेशन व आनुपातिक सॉफ्ट शैडो, एक्टिव `clickDepression` पर मैकेनिकल पुश-इन (`translateZ(-6px)` / `scale(0.97)`), प्रीसेट-विशिष्ट क्यूबिक-बेजियर रिकॉइल टाइमिंग, `soundFX.playHapticClick()` ऑडियो फीडबैक, लाइव टेलीमेट्री रीडआउट बैज (`Pop: Xpx`, `Stiffness: K`, `Damping: D`), तथा `LabContext` में `PHYSICS_PROFILES` एक्सपोर्ट (`scripts/verify_phase5_physics_pad.mjs` पर 13/13 PASS प्रमाणित)।
31. **Phase 6 Certified — 3D स्थानिक ऑडियो साउंडफील्ड रडार एवं टेस्ट पिंग सर्टिफिकेशन (Phase 6 Certified • 3D Spatial Audio Soundfield Radar & Test Ping Certification):** सेक्शन 8 ('Spatial Audio & Acoustics') में रूम साइज सेलेक्टर के साथ ~130px पोलर डिस्प्ले वाला 3D एकॉस्टिक साउंडफील्ड रडार विजुअलाइज़र (`SpatialAudioRadarVisualizer`) — 3 कंसेंट्रिक रेंज रिंग्स (`r=20`, `38`, `56`), 360° निरंतर स्वीपिंग रडार बीम व रोटेशनल ग्लो, और चयनित रूम प्रीसेट के आधार पर रेडिएट होने वाले डायनामिक रूम बाउंस रिफ्लेक्शन वेक्टर्स (Booth: 4 टाइट रिफ्लेक्शन वेक्टर्स; Studio: 8 बैलेंस्ड वेक्टर्स; Cathedral: 12 एक्सटेंडेड रिवरबरेंट रेज़)। साथ ही टैक्टाइल "🔊 Preview Spatial Ping" ट्रिगर बटन जो `soundFX.playSpatialPing` चलाता है (ड्यूल हार्मोनिक ऑसिलेटर्स 880Hz + 1320Hz, Web Audio `StereoPannerNode` स्थानिक पैनिंग, तथा रूम साइज व रिवर्ब इंटेंसिटी पर आधारित डायनामिक एक्सपोनेंशियल गेन डिके एनवेलप), रडार पर एक्सपैंडिंग साउंडवेव रिपल एनीमेशन, 3 रियल-टाइम एकॉस्टिक टेलीमेट्री बैज (`Binaural HRTF: Active`, `Room Tail: Xs`, `Material Tap: Glass/Metal`), पूर्ण WAI-ARIA एक्सेसिबिलिटी, तथा `LabContext` में `ACOUSTIC_PROFILES` एक्सपोर्ट (`scripts/verify_phase6_spatial_radar.mjs` पर 17/17 PASS प्रमाणित)।
32. **Phase 7 Certified — 380px ड्रॉअर एर्गोनॉमिक्स, टच स्टेपर बटन्स एवं कॉम्पैक्ट एक्शन टूलबार सर्टिफिकेशन (Phase 7 Certified • 380px Drawer Ergonomics, Touch Steppers & Compact Action Toolbar):** Master 3D Themes 2x2 कॉम्पैक्ट टाइल ग्रिड (Apple Glass, Cyber Neon, Studio Matte, Floating Hologram) जो 380px ड्रॉअर में >160px वर्टिकल स्पेस बचाता है; सक्रिय चयन पर इंडिकेटर रिंग (`ring-2 ring-[#FF4D6D] bg-[#FF4D6D]/10`), चेकमार्क बैज व हैप्टिक क्लिक। 7 प्रमुख 3D स्लाइडर्स (Depth, Shadow, FOV, Tilt, Pop, Exploded, Fog) पर WAI-ARIA एक्सेसिबल `[-]` व `[+]` टच स्टेपर बटन्स (`SliderWithSteppers`), मोबाइल थंब्स के लिए 36px बटन्स व 44px कंटेनर टच हिटबॉक्स (WCAG 2.5.5 / 2.5.8), स्ट्रिंग डेसिमल आधारित सटीक फ्लोटिंग-पॉइंट मैथ, और हैप्टिक ऑडियो क्लिक। बॉटम 2x2 सेगमेंटेड ग्लास एक्शन टूलबार (`[ ⬇ Export JSON ]`, `[ ⬆ Import JSON ]`, `[ 📋 Copy CSS ]`, `[ 🔄 Reset Defaults ]` + क्रिस्टल चाइम)। ड्रॉअर मोड में एडाप्टिव सैंडबॉक्स व्यूपोर्ट हाइट (`isDrawer ? 'h-48 sm:h-56' : 'h-64 sm:h-72'`) (`scripts/verify_gap5_drawer_ergonomics.mjs` पर 17/17 PASS प्रमाणित)।
33. **Phase 4 Performance Certified — एसेट, फ़ॉन्ट, सीएसएस एवं मारकी DOM व लीफ़लेट टाइल इंजन ऑप्टिमाइज़ेशन (Phase 4 Performance Refactoring Certified • Marquee DOM & Leaflet Tile Engine Optimization):** `TechMarqueeBanner.jsx` में 12x एरे रेपिटेशन को 4x पर लाकर DOM एलिमेंट्स को 324 से घटाकर ~100 किया गया (>220 नोड्स की शुद्ध कमी), साथ ही `IntersectionObserver` (`rootMargin: '100px'`, `threshold: 0`) जोड़कर स्क्रीन से बाहर स्क्रॉल होने पर CSS रिबन एनीमेशन को पॉज (`(isPaused || !isIntersecting) ? 'paused' : 'running'`) करके ऑफ-स्क्रीन GPU कंपोजिटिंग ओवरहेड को शून्य किया; `LeafletOfflineMap.jsx` में मेमोरी ऑप्टिमाइज़ेशन हेतु `keepBuffer: 2` व `updateWhenIdle: true` सेट किया गया, 5-स्टेज सॉफ्टवेयर फ़िल्टर को हल्के GPU डार्क फ़िल्टर (`invert(0.92) hue-rotate(180deg) contrast(1.1)`) और `will-change: transform` से बदला; `simple-mode.css` से हानिकारक वाइल्डकार्ड `body.simple-mode *` सेलेक्टर हटाकर क्लीन बॉडी इनहेरिटेंस लागू किया; `high-contrast.css` से गैर-कुशल सबस्ट्रिंग वाइल्डकार्ड सेलेक्टर्स `[class*="backdrop-blur"]` को टार्गेटेड यूटिलिटी क्लासेज (`.backdrop-blur`, `.backdrop-blur-sm`, आदि) में बदला; तथा `App.css` से 185 लाइन पुरानी स्टार्टर बॉयलरप्लेट सीएसएस को पूरी तरह हटाया (`scripts/verify_leaflet_map.mjs` व `scripts/test_challenger_map_ui.mjs` पर 23/23 PASS प्रमाणित)।
34. **यूनिवर्सल वॉइस एजेंट एवं बहु-हार्मोनिक कैनवस ऑडियो विजुअलाइज़र (Phase 11 Voice Agent & Procedural Waveform Visualizer):** Web Speech API आधारित प्राकृतिक स्पीच सिंथेसिस, क्रोमियम 14-सेकंड कीप-अलाइव वॉचडॉग, रियल-टाइम पिच/रेट क्लैम्पिंग, 3-स्टेट बहु-हार्मोनिक कैनवस साइन-वेव ऑसिलेटर (VoiceVisualizerWaveform.jsx), वॉइस स्टूडियो मोडल, और हैंड्स-फ्री ऑटो-स्पीक।
35. **क्लाइंट-साइड ऑफलाइन मेटा-प्रॉम्ट सिंथेसाइज़र एवं 40+ स्लैश कमांड्स कैटलॉग (Offline Meta-Prompt Engine & Dynamic Slash Commands Directory):** 100% क्लाइंट-साइड 4-स्टेज प्रॉम्ट ऑप्टिमाइज़र (metaPromptEngine.js), रोल व पर्सोना कॉन्टेक्स्ट इंजेक्शन, 40+ इंटरैक्टिव स्लैश कमांड्स डायरेक्टरी (chatSlashCommands.js), और एंड-टू-एंड टेस्ट हार्नेस।
36. **सिंगल मॉडल मेमोरी लॉक एवं कॉन्करेंट प्रीलोड म्यूटेक्स आर्किटेक्चर (Single Model Memory Lock & Concurrent Preload Mutex Architecture):** `localAIService.js` व `aiModelWorker.js` में स्ट्रिक्ट सिंगल-मॉडल-इन-रैम (RAM) इनवेरिएंट — मोनोथोनिक `currentLoadSessionId` ट्रैकिंग, प्रीएम्पशन पर तात्कालिक वर्कर टर्मिनेशन व रिस्पॉन (`terminateAndRespawnWorker()`), पुराने सेशन्स से आने वाले स्टेल मैसेजेस का ऑटो-डिस्कार्ड, एक्टिव डाउनलोड्स पर बाइट्स प्रोग्रेस के साथ ऑटो-रीसेट होने वाला प्रोग्रेस-अवेयर हार्टबीट वॉचडॉग (`armProgressWatchdog`, >15s डाउनलोड्स पर शून्य फाल्स टाइमआउट), 10-सेकंड स्टाल डिटेक्शन फॉलबैक लैडर, 100% प्रोग्रेस व कैश्ड लोड्स पर 15-सेकंड शेडर कंपाइलेशन ग्रेस विंडो, तथा `App.jsx` व `AIChatWidget.jsx` के बीच 250ms डीबाउंस्ड व स्टेट-गार्डेड ट्रिगर डी-डुप्लिकेशन (`scripts/verify_single_model_memory_lock.mjs` पर 100% PASS Grade A+ प्रमाणित)।
37. **एआई और चैट स्टूडियो सेटिंग्स 7वां टैब एवं सहमति इंजन (AI & Chat Studio Settings Tab & Download Consent Engine):** `ControlCenterPanel.jsx` व `LabStudioDrawer.jsx` में 7वां टॉप-लेवल टैब (`id: 'chat'`), 5 इंटरैक्टिव फीचर्स क्लस्टर्स (मॉडल व इंजन, जेनरेशन व पर्सनैलिटी, वॉइस स्टूडियो, गोपनीयता व स्टोरेज, UI व एर्गोनॉमिक्स), `AIChatWidget.jsx` हेडर में त्वरित गियर शॉर्टकट, ऑन-डिमांड मॉडल ट्रिगर, ऑन-डिवाइस न्यूरल डाउनलोड सहमति मोडल (Consent Dialog) और 0MB डिटरमिनिस्टिक RAG फ़ॉलबैक (`scripts/verify_chat_settings_tab.mjs` पर 43/43 PASS Grade A+ प्रमाणित)।


---

## 🗂️ मॉड्यूल संरचना अनुक्रमणिका (Module Directory Index)

- [मॉड्यूल 1: कोर लेआउट और UI सेक्शन्स (Core Layout & UI Sections)](#module-1)
- [मॉड्यूल 2: कस्टम कर्सर सिस्टम और डायनामिक एनिमेशन्स (Custom Cursor System & Kinematics)](#module-2)
- [मॉड्यूल 3: लैब स्टूडियो, डेमो मोड्स और स्पेशल फीचर्स (Lab Studio, Demo Modes & Special Features)](#module-3)
- [मॉड्यूल 4: एक्सेसिबिलिटी, थीम और यूजर कंट्रोल्स (Accessibility, Theme & User Controls)](#module-4)
- [मॉड्यूल 5: स्टेट मैनेजमेंट, हुक्स, ऑडियो इंजन और कोर यूटिलिटीज (State Management, Hooks, Audio Engine & Core Utilities)](#module-5)
- [मॉड्यूल 6: बिल्ड, परफॉरमेंस, डेव टूल्स और कॉन्फ़िगरेशन सिस्टम (Build, Performance, Dev Tools & Configuration)](#module-6)
- [मॉड्यूल 7: डेवलपर टर्मिनल सीएलआई एवं पावर पैक सिस्टम (Developer Terminal CLI & Power Pack System)](#module-7)
- [मॉड्यूल 8: केस स्टडीज आर्किटेक्चर एवं लाइव टेलीमेट्री सिमुलेटर (Interactive Case Studies & Telemetry Simulators)](#module-8)
- [मॉड्यूल 9: बहुभाषी स्थानीयकरण एवं वॉइस कोऑर्डिनेशन (Multilingual Localization & Translation System)](#module-9)
- [मॉड्यूल 10: ऑडियंस व्यक्तित्व फ़िल्टर एवं व्यू मोड सिस्टम (Audience Persona Filter & View Mode Engine)](#module-10)
- [मॉड्यूल 11: सेंट्रलाइज्ड मास्टर फ्लोटिंग एक्शन हब एवं एआई चैट असिस्टेंट (Floating Action Hub & AI Chat Widget)](#module-11)
- [मॉड्यूल 12: 40-आइटम FAQ सूचना प्रणाली एवं एसईओ स्ट्रक्चर्ड डेटा (FAQ System & Schema.org JSON-LD)](#module-12)
- [मॉड्यूल 13: डिजिटल बिजनेस कार्ड, प्योर SVG डायनामिक QR एवं कोटेशन कैलकुलेटर (Digital Business Card, vCard, QR & Quotation Estimator)](#module-13)
- [मॉड्यूल 14: स्टैंडअलोन फुलस्क्रीन कंट्रोल सेंटर स्टूडियो एवं डीप-लिंकिंग आर्किटेक्चर (Standalone Fullscreen Control Center Studio & Deep Linking)](#module-14)
- [मॉड्यूल 15: ऑन-डिवाइस लोकल LLM न्यूरल एआई इंजन एवं हार्डवेयर प्रोफाइलर (On-Device Local LLM AI Engine & Hardware Profiler)](#module-15)
- [मॉड्यूल 16: एआई चैट संपूर्ण 11-चरणीय एन्हांसमेंट, एजेंटिक एवं वॉइस स्टूडियो सुइट (Master AI Chat Enhancement, Agentic & Voice Studio Suite - Phases 1 to 11)](#module-16)
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

10. **कांटेक्ट 4-टैब हब (`ContactSection.jsx`):**
    - **4 समर्पित टैब्स:** Tab 1 'Get in Touch' (`touch`), Tab 2 'Quotation & Pricing' (`quote`), Tab 3 'Direct Details & vCard' (`direct`), और Tab 4 'Location & Office' (`location`)।
    - **मल्टी-फ़ील्ड संपर्क फ़ॉर्म (Tab 1):** Name, Email, WhatsApp, Company, Inquiry Type, Budget, Timeline, और Message; क्लाइंट-साइड सत्यापन, 24 घंटे का गेted अनलॉक, और कंफ़ेटी विंग।
    - **इन-टैब कोटेशन एवं फीस एस्टीमेटर (Tab 2):** 3 विशिष्ट ट्रैक्स (Accounting & Tax, MIS & Analytics, Web & AI) में वॉल्यूम स्लाइडर्स, तात्कालिकता मल्टीप्लायर (Standard vs Express), और डायरेक्ट व्हाट्सएप / प्री-फिल एक्शन्स।
    - **डिजिटल बिजनेस कार्ड एवं प्योर SVG डायनामिक QR (Tab 3):** RFC 6350 मानकीकृत vCard 3.0 (`.vcf`) 1-क्लिक डाउनलोड और बिना किसी बाहरी एपीआई के शुद्ध क्लाइंट-साइड SVG डायनामिक QR कोड जनरेटर।
    - **लोकेशन हब एवं हाइब्रिड मैप (Tab 4):** मेदिनीनगर (डाल्टनगंज), पलामू, झारखंड का लोकेशन कार्ड, 1-क्लिक GPS निर्देशांक कॉपी और इंटरएक्टिव मैप टाइल्स।

11. **द्विभाषी FAQ एकॉर्डियन सेक्शन (`FAQSection.jsx` & `faqConfig.js`):**
    - **2-स्तरीय फ़िल्टरिंग मैट्रिक्स:** लेवल 1 ऑडियंस टैब्स (All, Recruiter, Client, Matrimonial) एवं लेवल 2 रोल सब-टैब्स (Senior Accountant, MIS Executive, Vibe Coder)।
    - **लाइव कीवर्ड सर्च एवं डायनामिक कैटेगरी चिप्स:** टाइप करते ही तत्काल प्रश्नों की छंटनी और रीयल-टाइम परिणाम काउंटर।
    - **एक्सेसिबल सिंगल-एक्सपैंड एकॉर्डियन:** एक समय में एक प्रश्न का सुगम विस्तार, वेब ऑडियो क्लिक फ़ीडबैक, प्रासंगिक एक्शन CTAs, और Schema.org `FAQPage` JSON-LD स्ट्रक्चर्ड डेटा।

12. **फ़ूटर (`Footer.jsx`):**
    - **जायंट वाटरमार्क टेक्स्ट:** रील के अनुरूप बैकग्राउंड में विशालकाय 'ATUL VERMA' वाटरमार्क।
    - **कॉपीराइट, क्रेडिट्स एवं बैक टू टॉप ट्रिगर:** स्मूथ स्क्रॉल-टू-टॉप बटन।

13. **फ्लोटिंग कंट्रोल्स एवं यूटिलिटी बटन्स:**
    - **बैक टू टॉप बटन (`BackToTopButton.jsx`):** सर्कुलर SVG प्रोग्रेस रिंग के साथ 400px स्क्रॉल के बाद प्रकट होता है और ओपन फ्लोटिंग पैनल्स के अनुसार गतिशील रूप से क्लीयरेंस बनाए रखता है।
    - **मास्टर फ्लोटिंग एक्शन हब (`FloatingActionHub.jsx`):** सभी कंट्रोल्स (लैब, व्यू मोड, ऑडियंस, चैट, सिंपल मोड, व्हाट्सएप) का एकीकृत 1-क्लिक स्पीड-डायल टॉगल।
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
| 1.57 | **Contact Section 4-Tab Hub Transformation** | `src/components/ContactSection.jsx` | संपर्क अनुभाग का 4 विशिष्ट कार्यक्षेत्रों में पुनर्गठन | पुराने 3-टैब मॉडल को बदलकर 4 विशेष टैब्स ('touch', 'quote', 'direct', 'location') में विभाजित किया; इन-टैब नेविगेशन और बाहरी `switch-contact-tab` इवेंट सपोर्ट। |
| 1.58 | **In-Tab Quotation Estimator Architecture** | `src/components/ContactSection.jsx` (Tab 2) | इन-टैब रीयल-टाइम लागत एवं समय सीमा कैलकुलेटर | Tab 2 में एम्बेडेड 3 ट्रैक्स (Accounting, MIS, Web/AI), वॉल्यूम स्लाइडर्स, तात्कालिकता मल्टीप्लायर, और तत्काल व्हाट्सएप / फॉर्म प्री-फिल एक्शन्स प्रदान करता है। |
| 1.59 | **In-Tab Digital Business Card & Pure SVG Dynamic QR** | `src/components/ContactSection.jsx`, `vcardGenerator.js` (Tab 3) | शुद्ध क्लाइंट-साइड डायनामिक QR एवं vCard | Tab 3 में बिना किसी बाहरी API के शुद्ध SVG से डायनामिक QR कोड रेंडर करता है; मोबाइल से स्कैन करने पर तुरंत संपर्क कार्ड खुलता है और 1-क्लिक में `.vcf` डाउनलोड होता है। |
| 1.60 | **Verified Credential & Certificate Lightbox Trigger** | `src/components/AboutSection.jsx`, `CredentialLightboxModal.jsx` | अकादमिक प्रमाणपत्रों का फोरेंसिक मुआयना | Qualifications टैब में प्रत्येक डिग्री के साथ 'Inspect Credential & Certificate 🔍' बटन, गोल्ड सील और 1-क्लिक वेरिफिकेशन आईडी कॉपी की सुविधा। |
| 1.61 | **40-Item Bilingual FAQ Accordion Section** | `src/components/FAQSection.jsx`, `src/data/faqConfig.js` | 2-स्तरीय फ़िल्टरिंग युक्त संपूर्ण ज्ञानकोश | पेज में कांटेक्ट से ठीक पहले 4 ऑडियंस और 3 रोल सब-टैब्स, लाइव कीवर्ड सर्च, ऑडियो क्लिक्स और Schema.org FAQPage स्ट्रक्चर्ड डेटा युक्त अकॉर्डियन प्रस्तुत करता है। |
| 1.62 | **Top Navbar Multilingual Language Switcher** | `src/components/Navbar.jsx`, `src/context/LanguageContext.jsx` | डेस्कटॉप एवं मोबाइल नेवबार में भाषा टॉगल | शीर्ष नेवबार में 1-क्लिक 'EN ⇄ HI' पिल बटन जो पूरे पोर्टफोलियो को तत्काल हिंदी या अंग्रेजी में अनुवादित करता है और वॉयस स्क्रीन रीडर को समन्वित करता है। |
| 1.63 | **Top Navbar View Mode & Audience Capsule Triggers** | `src/components/Navbar.jsx` | नेवबार में त्वरित कैप्सूल ट्रिगर्स | शीर्ष नेवबार के राइट एक्शन ग्रुप में Eye आइकॉन (View Mode) और Filter आइकॉन (Audience Filter) के साथ एकीकृत कैप्सूल ड्रॉपडाउन सब-बार्स प्रस्तुत करता है। |
| 1.64 | **Explore Sub-Bar Enhanced Action Slots** | `src/components/ExploreSubBar.jsx` | एआई चैट एवं केस स्टडीज का सीधा प्रवेश द्वार | 5-एक्शन ग्रिड जिसमें BotMessageSquare आइकॉन के साथ एआई चैट, केस स्टडीज डॉसियर, कोटेशन कैलकुलेटर, और कंट्रोल सेंटर के त्वरित शॉर्टकट्स शामिल हैं। |
| 1.65 | **Dynamic Multi-Stack BackToTop Offset Coordinator** | `src/components/BackToTopButton.jsx` | बहु-आइटम स्टैक में ओवरलैप सुरक्षा | FloatingActionHub के खुले होने पर या 4+ फ्लोटिंग आइटम्स सक्रिय होने पर स्वचालित रूप से शीर्ष पर ग्लाइड होकर पूर्ण दृश्यता व क्लिक योग्यता बनाए रखता है। |

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
| 2.19 | **Dynamic Interactive Cursor Runtime Wiring with Lab Studio Controls** | `src/App.jsx`, `src/components/DynamicCursorManager.jsx` | लैब स्टूडियो कंट्रोल्स का कर्सर से सीधा संबंध | `useLab()` से लाइव पैरामीटर्स (`customCursorEnabled`, `speed={flightSpeed}`, `trailEnabled={trailEnabled}`, `scale={cursorScale}`, `gravity`, `particleColor`, `wingDynamics`) को सीधे `DynamicCursorManager` में इंजेक्ट करता है, तथा ओएस मीडिया क्वेरी और लैब स्टूडियो टॉगल (`reducedMotion` / `Boolean(labReducedMotion)`) दोनों पर तत्काल कर्सर डिसेबल करता है। |
| 2.20 | **Dual-Storage Cursor Coordinate Persistence Engine with 24h TTL & Zero-Jump Gaze** | `src/utils/cursorPersistence.js`, `src/components/DynamicCursorManager.jsx`, `src/components/HeroSection.jsx` | कर्सर निर्देशांकों का पर्सिस्टेंस एवं स्मूथ रिस्टोर | `sessionStorage` (फास्टेस्ट टैब सेशन) एवं `localStorage` (24h TTL) आधारित ड्यूल-स्टोरेज कोऑर्डिनेट पर्सिस्टेंस, 100ms थ्रोटल्ड पॉइंटर मूव्स, `beforeunload`/`pagehide` इंस्टेंट कैप्चर, तथा पेज लोड या रिफ्रेश पर स्क्रीन सेंटर जंप से बचाकर हेरो टकटकी और कर्सर को सटीक अंतिम स्थिति से शुरू करने वाला इंजन। |

---

---

<a id="module-3"></a>
## 🎛️ मॉड्यूल 3: लैब स्टूडियो, डेमो मोड्स और स्पेशल फीचर्स (Lab Studio, Demo Modes & Special Features)

यह मॉड्यूल पोर्टफोलियो कंट्रोल सेंटर (ControlCenterPanel), स्लाइड-आउट लैब स्टूडियो (LabStudioDrawer), पोलरॉइड कैमरा रोल (CameraRollGallery), ऑफ़लाइन हाइब्रिड मैप्स, और रेज़्यूमे सिस्टम को कवर करता है।

### 3.1 घटक विवरण एवं वास्तुकला (Component Details & Architecture)

1. **पोर्टफोलियो कंट्रोल सेंटर (`ControlCenterPanel.jsx` & `LabStudioDrawer.jsx`):**
   - **7 विशेष कैलिब्रेशन टैब्स:**
     1. **Tab 1: Audio Studio:** साउंड FX मास्टर टॉगल, मास्टर वॉल्यूम स्लाइडर (0-100%), पिच मल्टीप्लायर (0.5x-2.0x), साउंड मैचिंग मोड ('dynamic' vs 'universal'), और 7 बटनों वाला लाइव साउंडबोर्ड (Shutter, Sparkle, Pop, Focus, Chime, Ribbon, Haptic)।
     2. **Tab 2: Cursor & Dynamics:** कस्टम कर्सर मास्टर स्विच, कर्सर स्केल (0.5x-2.0x), फ्लाइट स्पीड (Dreamy 0.08, Natural 0.14, Snappy 0.24), स्टारडस्ट ट्रेल स्विच, और पार्टिकल कलर पिकर + 6 प्रीसेट कलर चिप्स।
     3. **Tab 3: Hero & Character Control:** गेज़ मोड (Auto vs Fixed), पोज़ ओवरराइड (Auto + 10 पोज़ बटन्स), कैरेक्टर ज़ूम (0.5x-2.0x), ज़ूम फोकस (Head, Center, Feet), ड्रैग मास्टर टॉगल, बाउंड्री क्लैंपिंग, ऑटो स्नैप-बैक, फ्लैश कंफ़ेटी, लंबन झुकाव (Parallax Tilt), और रीसेंटर कैरेक्टर बटन।
     4. **Tab 4: Startup & Preferences:** डिफ़ॉल्ट स्टार्टअप रोल सेलेक्टर (Accountant, MIS, Corporate Controller, Vibe Coder), डिफ़ॉल्ट कर्सर ऑन स्टार्टअप, डिफ़ॉल्ट ऑडियो ऑन स्टार्टअप, और रेड्यूस्ड मोशन एक्सेसिबिलिटी स्विच।
     5. **Tab 5: Display & Visuals:** डार्क/लाइट कलर मोड, हाई कंट्रास्ट मोड स्विच, लेआउट डेंसिटी सेलेक्टर (Compact 0.8x, Comfortable 1.0x, Spacious 1.25x), ग्लासमॉर्फिज्म ब्लर (Subtle 8px, Balanced 16px, Deep 24px), UI मोशन स्पीड (Snappy 0.7x, Natural 1.0x, Cinematic 1.4x), और थीम एक्सेंट कलर पिकर।
     6. **Tab 6: 3D Spatial & Physical Studio:** मास्टर 3D स्विच, 0.2x से 2.5x डेप्थ इंटेंसिटी स्लाइडर, 3 स्टाइल प्रीसेट्स (Subtle, Dramatic, Isometric), लाइव माउस ऑर्बिट वाला इंटरएक्टिव 3D क्यूब सैंडबॉक्स, 4-क्लस्टर फ़िल्टर बार, 10 स्वतंत्र UI घटकों के 3D ट्रांसफ़ॉर्म टॉगल, और 9 सिंगल-एक्सपैंड एकॉर्डियन मॉड्यूल्स (Lighting, Camera, Materials, Physics, Exploded Blueprint, Fog Environment, Spatial Audio Reverb, Target FPS)।
     7. **Tab 7: AI & Chat Studio (`id: 'chat'`):** एआई और चैट असिस्टेंट का 5-क्लस्टर नियंत्रण केंद्र — क्लस्टर 1 (मॉडल व इंजन टीयर, ऑन-डिमांड ट्रिगर, सहमति प्रेफरेंस, कैशे क्लीन), क्लस्टर 2 (टोकन स्ट्रीमिंग, क्रिएटिविटी टेम्परेचर 0.0-1.2, मैक्स टोकन्स 128-1024, पर्सोना टोन), क्लस्टर 3 (TTS वॉयस, पिच/रेट स्लाइडर्स, हैप्टिक साउंड्स), क्लस्टर 4 (सत्र अवधारण नीति, 1-क्लिक मेमोरी पर्ज, चैट एक्सपोर्ट), क्लस्टर 5 (डॉकिंग साइज़, ऑटो-ग्रीट, प्रॉम्ट चिप्स, स्लैश कमांड्स)।
   - **हॉरिजॉन्टल टैब नेविगेशन कैरोसेल:** कंट्रोल सेंटर टैब बार में बाएँ व दाएँ स्मूथ स्क्रॉल बटन्स (`ChevronLeft`/`ChevronRight`), बाउंड्री डिटेक्शन और टच-ड्रैग सपोर्ट।
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
| 3.55 | **Control Center Tab Navigation Carousel with Touch & Click Chevrons** | `src/components/ControlCenterPanel.jsx` | टैब बार का क्षैतिज स्क्रॉल कैरोसेल | लैब कंट्रोल सेंटर के शीर्ष टैब बार में बाएँ व दाएँ स्मूथ स्क्रॉल बटन्स (`ChevronLeft`/`ChevronRight`), बाउंड्री डिटेक्शन (`canScrollLeft`, `canScrollRight`), और माउस/टच ड्रैग स्क्रॉलिंग प्रदान करता है जिससे 6 कैलिब्रेशन टैब्स किसी भी स्क्रीन पर बिना क्लटर दिखे आसानी से नेविगेट होते हैं। |
| 3.56 | **3D Spatial & Physical Studio Master Control & Depth Intensity Calibrator** | `src/components/ControlCenterPanel.jsx`, `src/context/LabContext.jsx` | 3D स्थानिक नियंत्रण एवं गहराई तीव्रता | लैब स्टूडियो का 6वाँ टैब ('3D Studio') — मास्टर 3D स्विच, 0.2x से 2.5x डेप्थ इंटेंसिटी स्लाइडर (`clampDepthIntensity`), और 3 प्राथमिक विजुअल स्टाइल्स (Subtle, Dramatic, Isometric) के साथ रूट CSS वेरिएबल्स (`--3d-depth-intensity`, `--3d-style-preset`) इंजेक्ट करता है। |
| 3.57 | **Interactive Mini 3D Sandbox Preview Card with Real-time Mouse Orbit** | `src/components/ControlCenterPanel.jsx` | लाइव इंटरएक्टिव 3D क्यूब सैंडबॉक्स | कंट्रोल सेंटर के अंदर एक रीयल-टाइम 3D प्रीव्यू बॉक्स जो यूजर के कर्सर ऑर्बिट और टिल्ट पर 60/120 FPS पर स्मूथली घूमता है, वर्तमान में चयनित लाइटिंग, मटीरियल, ग्लो और शैडोज़ का तत्काल लाइव विजुअल फीडबैक देता है। |
| 3.58 | **9-Accordion Deep 3D Spatial Physics, Lighting, Camera, Environment & Audio Engine** | `src/components/ControlCenterPanel.jsx`, `src/context/LabContext.jsx` | 9-स्तरीय गहरा स्थानिक 3D इंजन | 9 स्वतंत्र सिंगल-एक्सपैंड एकॉर्डियन मॉड्यूल्स: 1) Master Theme, 2) Lighting & Shadows (कोण व प्रीसेट्स), 3) Camera & Perspective (FOV, टिल्ट संवेदनशीलता), 4) Materials & Shaders (बेवेल, ग्लो), 5) Physics & Interaction (होवर पॉप, इलास्टिसिटी), 6) Exploded Blueprint Mode (पृथक्करण दूरी), 7) Fog Environment (वायुमंडलीय घनत्व), 8) Spatial Audio (रीवर्ब, रूम रिफ्लेक्शन), और 9) Performance & Target FPS (हार्डवेयर एक्सेलेरेशन)। |
| 3.59 | **Phase 3 Certified: Interactive Portfolio Layout Blueprint Wireframe & Batch HUD (10 Architectural Elements & Batch Toggles)** | `src/components/ControlCenterPanel.jsx`, `src/context/LabContext.jsx`, `scripts/verify_gap4_blueprint_wireframe.mjs` | 10-एलिमेंट 3D ब्लूप्रिंट वायरफ्रेम व बैच HUD (Phase 3 Certified) | सेक्शन 1 ('Element 3D Conversion Toggles') में एम्बेडेड 200px आर्किटेक्चरल वेक्टर लेआउट (Nav, Hero, Containers, Floating Hub), 10 तत्वों के पल्सिंग स्टेटस डॉट्स (3D एक्टिव पर एमराल्ड ग्लो + `animate-ping`, 2D पर म्यूटेड स्लेट), 3 ग्रुप बैच टॉगल चिप्स (`Toggle Nav (4)`, `Toggle Hero (4)`, `Toggle Cards (2)`) स्मार्ट सिंक्रोनस लॉजिक (सभी ON -> OFF, कोई भी OFF -> ON) व लाइव काउंटर्स (X/4, X/2), 2-वे सिंक्रोनाइज़्ड होवर हाइलाइटिंग (`ring-2 ring-[#FF4D6D]/40`), शो/हाइड मैप टॉगल बटन, WAI-ARIA रीज़न, तथा `LabContext` में `set3DElementGroup` (`scripts/verify_gap4_blueprint_wireframe.mjs` 15/15 PASS)। |
| 3.60 | **3D Profile JSON Export/Import Toolkit & 1-Click Root CSS Variables Copier** | `src/components/ControlCenterPanel.jsx`, `src/context/LabContext.jsx` | 3D प्रोफाइल JSON एक्सपोर्ट व CSS कॉपी | यूजर की संपूर्ण 3D स्थानिक सेटिंग्स को 1-क्लिक में JSON फ़ाइल (`3d-control-center-profile.json`) के रूप में डाउनलोड या अपलोड करने की सुविधा, और जनरेटेड CSS कस्टम वेरिएबल्स (`--3d-*`) को क्लिपबोर्ड में कॉपी करने का डेवलपर टूलकिट। |
| 3.61 | **Phase 1 Certified: 360° Interactive Orbital Sun Compass Dial with Cardinal Markers** | `src/components/ControlCenterPanel.jsx` | 360° सूर्य प्रकाश दिशा कंपास डायल (Phase 1 Certified) | Lighting & Shadows में 140px व्यास का सर्कुलर ऑर्बिटल डायल — कार्डिनल दिशा संकेत (N, E, S, W), त्रिकोणमितीय सौर स्थिति गणना (`70 + 52 * Math.sin(angleRad)`), WAI-ARIA `role="slider"` अनुपालन, ±4° मैग्नेटिक स्नैपिंग, और एरो कीज़ (+5°/-5°) व PageUp/PageDown (+45°/-45°) कीबोर्ड नेविगेशन (`scripts/verify_gap1_orbital_sun_compass.mjs` 10/10 PASS)। |
| 3.62 | **Central Live Shadow Sphere with Dynamic Inverse Shadow** | `src/components/ControlCenterPanel.jsx` | लाइव शैडो स्फीयर व विपरीत छाया | कंपास डायल के केंद्र में 36px का लाइव शैडो स्फीयर, जो प्रकाश कोण के ठीक विपरीत दिशा में डायनामिक शैडो ऑफ़सेट (`-Math.sin(angleRad) * 8px`, `Math.cos(angleRad) * 8px`) प्रस्तुत करता है और रीयल-टाइम 3D सैंडबॉक्स कार्ड से 100% सिंक्रनाइज़ रहता है। |
| 3.63 | **4 Quick Quadrant Buttons with Active Pill Highlight & Magnetic Snap** | `src/components/ControlCenterPanel.jsx` | 4 त्वरित चतुर्थांश बटन्स व चुंबकीय स्नैप | 2x2 ग्रिड में 4 त्वरित प्रकाश कोण बटन्स — High Noon (0°), Sunset (270°), Midnight (180°), Dawn Sun (90°) सक्रिय पिल हाइलाइट व हैप्टिक क्लिक के साथ; साथ ही डायल ड्रैग के दौरान 4° थ्रेशोल्ड के भीतर सटीक मैग्नेटिक स्नैपिंग। |
| 3.64 | **Phase 2 Certified: 3D Material Shader Orbs (4 Photorealistic Tactile Presets)** | `src/components/ControlCenterPanel.jsx` | 4 फोटो-यथार्थवादी 3D मटीरियल शेडर्स (Phase 2 Certified) | Materials & Shaders में 2x2 स्पर्श-सुलभ ग्रिड (`role="radiogroup"`) — 1) Glass Acrylic (फ्रॉस्टेड रिफ्रैक्टिव ब्लर व कॉस्टिक्स), 2) Metallic Gloss (मिरर क्रोम व 165° हॉरिजन स्पेक्युलर बैंड), 3) Neumorphic Clay (ड्यूल-शैडो एम्बोस्ड क्ले), 4) Cyber Wireframe (ऑब्सिडियन बैकग्राउंड व नियॉन सियान वेक्टर ग्रिड) 56px वेक्टर्स, ग्लाइन्ट शीन एनीमेशन, 2D एरो कीज़ चयन, और लाइव सैंडबॉक्स सिंक्रोनाइज़ेशन (`scripts/verify_gap2_material_shader_orbs.mjs` 11/11 PASS)। |
| 3.65 | **Phase 2 Certified: Real-Time Visual Bevel Chamfer Cross-Section Diagram** | `src/components/ControlCenterPanel.jsx` | रीयल-टाइम एसवीजी बेवेल शैंफर डायग्राम (Phase 2 Certified) | बेवेल एक्सट्रूज़न स्लाइडर के बगल में लाइव एसवीजी क्रॉस-सेक्शन डायग्राम — 90° का काल्पनिक शार्प कोना (Dashed गाइड) तथा 1px (माइक्रो-शैंफर) से 8px (डीप टैक्टाइल बेवेल) के बीच वास्तविक समय में गतिशील रूप से स्केल होने वाला हाइलाइटेड `#FF4D6D` 2.5px शैंफर पहलू (Facet) व रूट सीएसएस वेरिएबल सिंक। |
| 3.66 | **Interactive 3D XYZ Orientation Viewport Gizmo with Orthogonal Axes & Quick Snaps** | `src/components/ControlCenterPanel.jsx` | इंटरएक्टिव 3D XYZ व्यूफ़ोर्ट गिज़्मों | 3D सैंडबॉक्स व्यूपोर्ट के टॉप-राइट में 48px का ग्लासमोर्फिक गिज़्मों — रीयल-टाइम 300px पर्सपेक्टिव रोटेशन ट्रैकिंग, 3 ऑर्थोगोनल कलर्ड आर्म्स (Red +X साइड प्रोफाइल, Green +Y टॉप व्यू, Blue +Z), और 1-क्लिक क्विक स्नैप एंड-कैप्स (ISO snap `[22, -28]`, +Z Top `[65, 0]`, +X Side `[0, 55]`, Center `[16, -20]`) हैप्टिक साउंड फीडबैक के साथ। |
| 3.67 | **Perspective Ground Grid Floor & Dynamic Soft Contact Shadow** | `src/components/ControlCenterPanel.jsx` | पर्सपेक्टिव ग्राउंड ग्रिड व डायनामिक शैडो | 3D कार्ड के नीचे `perspective(600px) rotateX(72deg) translateZ(-45px)` पर स्थित रेडियल ग्रेडिएंट फ़ेड ग्रिड फ़्लोर, तथा 8px ब्लर वाला डायनामिक सॉफ्ट पिल कॉन्टैक्ट शैडो जो कार्ड के झुकाव कोण और सूर्य प्रकाश दिशा के अनुसार वास्तविक समय में स्केल और ऑफसेट होता है। |
| 3.68 | **Tactile "Hold to Compare 2D vs 3D" Mode Button & Layer Flattening Engine** | `src/components/ControlCenterPanel.jsx` | 2D बनाम 3D तुलना बटन व लेयर फ़्लैटनिंग | HUD कंट्रोल बार में "Hold to Compare 2D" टैक्टाइल बटन (माउस प्रेस व कीबोर्ड स्पेस/एंटर सपोर्ट) — दबाए रखने पर तात्कालिक रूप से कार्ड ट्रांसफॉर्म को `perspective(0) rotateX(0deg) rotateY(0deg) translateZ(0px)` पर फ़्लैट करता है, डेप्थ स्ट्रैटा को कोलैप्स करता है, और चमकीला "2D Flat Mode" बैज दिखाता है। |
| 3.69 | **Phase 4 Certified: Interactive Isometric Layer Strata Stack Diagram & CAD Depth Callouts** | `src/components/ControlCenterPanel.jsx`, `src/context/LabContext.jsx` | 3D आइसोमेट्रिक लेयर स्ट्रैटा डायग्राम व सीएडी कॉलआउट्स (Phase 4 Certified) | सेक्शन 6 ('3D Exploded Layer Disassembly & Blueprint View') में सेपरेशन डिस्टेंस स्लाइडर के ऊपर ~160px का इंटरएक्टिव 3D आइसोमेट्रिक लेयर स्ट्रैटा विजुअलाइज़र — 3 भौतिक स्ट्रैटा स्लैब्स (Strata 01 Core Glass Chassis, Strata 02 Circuit Blueprint Grid, Strata 03 Floating Typography), dynamic vertical separation responding to separationDistance (0-100px) and layerStagger, 4 कॉर्नर सीएडी प्रोजेक्शन लाइन्स (`strokeDasharray="3 3"`), लाइव डायमेंशन कॉलआउट बैज (+Xmm Z-Separation, Stagger: Xms), ब्लूप्रिंट मोड स्विचिंग पर ग्लोइंग नियॉन सियान सीएडी वेक्टर ग्रिड में रूपांतरण, होवर कंपोनेंट इन्वेंटरी टूलटिप, और 1-क्लिक सोलो स्ट्रैटम (`soloStrata`) जो टॉप 3D सैंडबॉक्स कार्ड में गैर-सोलो परतों को 0.15 ओपेसिटी पर डिम और चयनित परत को सियान ग्लो व फ्लोटिंग HUD एग्जिट पिल के साथ हाइलाइट करता है (`scripts/verify_phase4_exploded_strata.mjs` पर 13/13 PASS प्रमाणित)। |
| 3.70 | **Phase 5 Certified: Spring Elasticity Oscillation Graph & Interactive "Tap to Test" Pad** | `src/components/ControlCenterPanel.jsx`, `src/context/LabContext.jsx` | स्प्रिंग ऑसिलेशन ग्राफ व 'टैप टू टेस्ट' पैड (Phase 5 Certified) | सेक्शन 5 ('Physics & Interaction') में इलास्टिसिटी सेलेक्टर के नीचे एम्बेडेड SVG हार्मोनिक ऑसिलेशन डिके ग्राफ (`SpringOscillationWaveform`) — 3 प्रीसेट्स: Rigid (क्रिटिकल डैम्पिंग, 0% ओवरशूट), Snappy (12% iOS ओवरशूट पीक), और Bouncy (3-वेव साइन रिकॉइल, 35% ओवरशूट); `y=30` पर डैश्ड सेटलिंग लाइन, तथा एनिमेटेड पल्स डॉट (`<animateMotion>`)। साथ ही 3D पर्सपेक्टिव 'टैप टू टेस्ट' पैड (`PhysicsTestPad`) — डायनामिक होवर पॉप एलिवेशन (4-32px) व शैडो डाइल्यूशन, मैकेनिकल क्लिक डिप्रेशन (`translateZ(-6px)`), प्रीसेट-विशिष्ट क्यूबिक-बेजियर रिकॉइल स्प्रिंग, `soundFX.playHapticClick()` हैप्टिक ऑडियो, लाइव टेलीमेट्री रीडआउट बैज (Pop, Stiffness, Damping), WAI-ARIA `role="button"` व कीबोर्ड Enter/Space सपोर्ट, तथा `LabContext` में `PHYSICS_PROFILES` एक्सपोर्ट (`scripts/verify_phase5_physics_pad.mjs` पर 13/13 PASS प्रमाणित)। |
| 3.71 | **Phase 6 Certified: 3D Spatial Audio Soundfield Radar & Acoustic Test Stage** | `src/components/ControlCenterPanel.jsx`, `src/context/LabContext.jsx`, `src/utils/audio.js` | 3D स्थानिक ऑडियो रडार व टेस्ट पिंग (Phase 6 Certified) | सेक्शन 8 ('Spatial Audio & Acoustics') में ~130px पोलर रडार डिस्प्ले (`SpatialAudioRadarVisualizer`) — 3 कंसेंट्रिक रेंज रिंग्स (`r=20`, `38`, `56`), 360° स्वीपिंग रडार बीम, चयनित रूम प्रोफाइल (Booth, Studio, Cathedral) के अनुसार गतिशील 4/8/12 रूम बाउंस रिफ्लेक्शन वेक्टर्स, टैक्टाइल "🔊 Preview Spatial Ping" बटन (`soundFX.playSpatialPing` ड्यूल हार्मोनिक 880Hz+1320Hz व `StereoPannerNode`), लाइव साउंडवेव रिपल एनीमेशन, 3 टेलीमेट्री बैज (Binaural HRTF, Room Tail, Material Tap), WAI-ARIA `role="region"` व कीबोर्ड सपोर्ट, तथा `LabContext` में `ACOUSTIC_PROFILES` एक्सपोर्ट (`scripts/verify_phase6_spatial_radar.mjs` पर 17/17 PASS प्रमाणित)। |
| 3.72 | **Phase 7 Certified: 380px Drawer Ergonomics, Touch Stepper Buttons & Compact Action Toolbar** | `src/components/ControlCenterPanel.jsx`, `src/context/LabContext.jsx` | 380px ड्रॉअर एर्गोनॉमिक्स, टच स्टेपर्स व एक्शन टूलबार (Phase 7 Certified) | Master 3D Themes 2x2 कॉम्पैक्ट टाइल ग्रिड (>160px वर्टिकल बचत, 4 थीम्स: Apple Glass, Cyber Neon, Studio Matte, Floating Hologram, एक्टिव रिंग व चेकमार्क बैज); 7 मुख्य स्लाइडर्स पर WCAG 2.5.5/2.5.8 अनुरूप 36px/44px टच हिटबॉक्स वाले `[-]` व `[+]` स्टेपर बटन्स (`SliderWithSteppers`), फ्लोट राउंडिंग एरर मुक्त प्रिसिजन स्टेप मैथ, हैप्टिक क्लिक्स; बॉटम 2x2 सेगमेंटेड ग्लास एक्शन टूलबार (Export JSON, Import JSON, Copy CSS, Reset Defaults + क्रिस्टल चाइम); तथा ड्रॉअर में एडाप्टिव सैंडबॉक्स हाइट `h-48 sm:h-56` (`scripts/verify_gap5_drawer_ergonomics.mjs` 17/17 PASS)। |
| 3.73 | **Phase 1 Certified: Scoped CSS 3D Custom Property Isolation Architecture** | `src/components/3d-sandbox/SandboxViewportContainer.jsx`, `src/context/LabContext.jsx` | 3D सीएसएस प्रॉपर्टीज का व्यूपोर्ट कंटेनर आइसोलेशन | `--3d-*` रूट सीएसएस कस्टम प्रॉपर्टीज को केवल सैंडबॉक्स व्यूपोर्ट कंटेनर और उसके डिसेंडेंट डीओएम तक सीमित (स्कॉप) करता है, ताकि लाइव पोर्टफोलियो डीओएम में 3D एक्सपेरिमेंट्स का कोई भी अवांछित प्रभाव न फैले, साथ ही `isLive3DApplied` टॉगल द्वारा नियंत्रित करता है। |
| 3.74 | **Phase 2 Certified: Universal Top Mini-DOM Portfolio 3D Sandbox Replica** | `src/components/3d-sandbox/UniversalMiniPortfolio.jsx`, `src/components/ControlCenterPanel.jsx` | लाइव पोर्टफोलियो का सजीव 3D मिनिएचर रेप्लिका | संपूर्ण पोर्टफोलियो (मिनी नेवबार, मिनी हेरो कार्ड, मिनी स्किल्स व प्रोजेक्ट्स ग्रिड, मिनी फ्लोटिंग डॉक, मिनी फूटर) का लाइव इंटरएक्टिव मिनिएचर डीओएम रेप्लिका, रियल-टाइम ऑर्बिटल ड्रैग, जायरोस्कोप रोटेशन, 4 स्काईबॉक्स ग्रेडिएंट्स, स्टारडस्ट पार्टिकल फील्ड, तथा सीएडी वायरफ्रेम ब्लूप्रिंट टॉगल। |
| 3.75 | **Phase 3 Certified: Desktop 2-Column Responsive Split & Sticky Sandbox Container** | `src/components/3d-sandbox/StickySandboxColumn.jsx`, `src/components/ControlCenterPanel.jsx` | 6 प्रीव्यू टैब्स के साथ स्टिकी सैंडबॉक्स व्यूपोर्ट | डेस्कटॉप पर `sticky top-6 self-start` आधारित 2-कॉलम लेआउट जो 9 एकॉर्डियन सेक्शन्स को स्क्रॉल करते समय भी सैंडबॉक्स को स्क्रीन पर स्थिर रखता है, जिसमें 6 कस्टमाइजेबल प्रीव्यू टैब्स (Universal Mini, 3D Hero Card, Navbar, Footer, Floating Dock, Section Showcase) शामिल हैं। |



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
| 4.29 | **URL Search Parameter Theme & Language Direct Initialization** | `src/context/ThemeContext.jsx`, `src/context/LanguageContext.jsx` | URL क्वेरी से थीम व भाषा की सीधी शुरुआत | इनिशियलाइजेशन पर `window.location.search` से `?theme=light/dark` और `?lang=en/hi` को स्वतः पढ़कर प्राथमिकता के साथ लागू करता है और `localStorage` में सुरक्षित करता है। |
| 4.30 | **Cross-Tab Sibling Context Storage Event Synchronization** | `src/context/ThemeContext.jsx`, `src/context/LanguageContext.jsx`, `src/context/HighContrastContext.jsx` | अन्य ब्राउज़र टैब्स में थीम, भाषा व कंट्रास्ट सिंक | `storage` इवेंट लिसनर के माध्यम से दूसरे खुले हुए टैब्स में थीम, हिंदी/इंग्लिश भाषा और हाई-कंट्रास्ट मोड का रीयल-टाइम सिंक्रोनाइज़ेशन और अनमाउंट पर क्लीनअप। |

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
| 5.45 | **Smooth Auto-Scroll Restoration & Dynamic Layout Expansion Hook** | `src/hooks/useScrollRestoration.js`, `src/App.jsx` | रिफ्रेश पर स्मूथ स्क्रॉल रीस्टोरेशन | ब्राउज़र के समयपूर्व अनपेक्षित जंप को रोकने हेतु `history.scrollRestoration = 'manual'` एनफोर्स करता है, `ResizeObserver` के जरिए React.Suspense लेज़ी-लोडेड चंक्स के डोम विस्तार को 2.5s तक ट्रैक करके लक्षित सेक्शन पर री-एंकर करता है, और व्हील/टच/नेविगेशन कीज़ पर तत्काल 0ms में ऑटो-स्क्रॉल रद्द करता है। |
| 5.46 | **Autonomous Portfolio Assistant NLP Reasoning Engine** | `src/utils/portfolioAssistantEngine.js` | 100% ऑफलाइन स्वायत्त एआई इंजन | बिना किसी बाहरी सर्वर या एपीआई के, 48+ कोर इंटेंट टैक्सोनॉमी, टेक्निकल उपनाम विस्तार (`brs`, `itc`, `gstr`, `pbi`), लेवेनश्टीन दूरी टाइपो रिपेयर, मल्टी-रोल एवं ऑडियंस वेटिंग स्कोरिंग के साथ तत्काल सटीक उत्तर व इंटरएक्टिव एक्शन पेलोड्स प्रदान करता है। |
| 5.47 | **Session Storage Multi-Turn Conversation Memory & Pruning Engine** | `src/utils/portfolioAssistantEngine.js`, `src/components/AIChatWidget.jsx` | मल्टी-टर्न चैट मेमोरी एवं ऑटो-प्रूनिंग | चैट वार्तालाप इतिहास को `sessionStorage` में सुरक्षित रखता है, 30 संदेशों की सुरक्षित अधिकतम सीमा (FIFO sliding window) लागू करता है ताकि मेमोरी ओवरफ्लो न हो, और 1-क्लिक `clearSessionMemory()` द्वारा मेमोरी रीसेट प्रदान करता है। |
| 5.48 | **Multi-Tab Anti-Echo Guard & Infinite Loop Shield** | `src/context/LabContext.jsx` | मल्टी-टैब इको लूप व ब्लिंकिंग रोकथाम | `isIncomingSyncRef` म्यूटेबल रेफ़ गार्ड जो स्टोरेज इवेंट से डेटा आने पर पर्सिस्ट इफेक्ट को तुरंत बाईपास (Bailout) करता है, जिससे ब्राउज़र टैब्स के बीच इनफिनिट लूप और सेटिंग्स ओवरराइटिंग नहीं होती। |
| 5.49 | **Serialized Payload Deduplication Shield** | `src/context/LabContext.jsx` | व्यर्थ डिस्क लेखन व थ्रैशिंग रोकना | `lastSavedPayloadRef` द्वारा वर्तमान कोर पेलोड स्ट्रिंग की तुलना पिछले सेव्ड पेलोड से करता है; यदि कोई बदलाव न हो तो `localStorage.setItem` को स्किप करके डिस्क आई/ओ और सीपीयू बचाता है। |
| 5.50 | **Reference Stability Setter Verification across Subsystems** | `src/context/LabContext.jsx` | अनावश्यक स्टेट म्यूटेशन व फ्लिकरिंग का खात्मा | इनकमिंग सिंक के समय सभी ऑडियो, कर्सर, हेरो, प्रेफरेंसेस और विजुअल्स वेरिएबल्स की तुलना वर्तमान रेफ़ मान (`current.x !== nextVal`) से करने के बाद ही स्टेट सेटर कॉल करता है। |
| 5.51 | **Voice Announcement Settings Storage Persistence** | `src/context/LabContext.jsx` | वॉयस सेटिंग्स का स्थायी भंडारण | `voiceAnnouncementEnabled`, `voiceFocusEnabled`, और `voiceHoverEnabled` को पर्सिस्टेंस इफेक्ट की डिपेंडेंसी ऐरे और पेलोड में शामिल करता है, जिससे रीलोड या सिंक पर वॉयस टॉगल कभी रिवर्ट नहीं होता। |
| 5.52 | **Cross-Tab Role Context Storage Event Synchronization** | `src/context/RoleContext.jsx` | सक्रिय रोल का क्रॉस-टैब रीयल-टाइम सिंक | `window.addEventListener('storage')` द्वारा `portfolio_selected_role` कुंजी पर लिसन करता है; दूसरे टैब में रोल (Accountant, MIS, Vibe Coder आदि) बदलते ही वर्तमान विंडो में बिना रीलोड तुरंत सिंक करता है। |

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

4. **रिजिलिएंट डायनामिक इम्पोर्ट, लेज़ी कोड-स्प्लिटिंग एवं सीएलएस-मुक्त स्केलेटन आर्किटेक्चर:**
   - `lazyWithRetry.js` के माध्यम से एक्सपोनेंशियल बैकऑफ़ ऑटो-रीट्राई (`maxRetries = 1`) और `navigator.onLine` लिसनर के साथ 16 गैर-महत्वपूर्ण मॉड्यूल्स का कोड-स्प्लिटिंग, जिससे मुख्य बंडल 1,254.63 kB से घटकर 462.43 kB (-63.2%) रह गया।
   - 5 समर्पित ग्लासमॉर्फिक स्केलेटन वैरिएंट्स (`section`, `card`, `modal`, `accordion`, `terminal`) जो शून्य लेआउट शिफ्ट (CLS = 0) और WCAG AAA सुलभता सुनिश्चित करते हैं।
   - पोलरॉइड एक्सपोर्टर में JSZip का ऑन-डिमांड एसिंक्रोनस आयात (`await import('jszip')`), जिससे इनिशियल लोड से 95.93 kB का `vendor-jszip` पूरी तरह अलग हो गया।
   - लीफलेट जीआईएस मैप (`LeafletOfflineMap`) का ऑन-डिमांड लोड और मेदिनीनगर HQ निर्देशांक (`24.0416° N`, `84.0700° E`) वाला हाई-टेक साइबर HUD राडार पल्स स्केलेटन फ़ॉलबैक (`GISMapSkeleton.jsx`)।

5. **इंटेलिजेंट प्रोग्रेसिव लोडिंग, नॉन-रेंडर-ब्लॉकिंग फॉन्ट्स एवं केस स्टडी डॉक्युमेंट डिकपलिंग:**
   - `HeroSection.jsx` में 9 नॉन-क्रिटिकल पोज़ को फर्स्ट पेंट के बाद `requestIdleCallback` (800ms फ़ॉलबैक) और `img.decoding = 'async'` के साथ वॉर्म-अप किया, जिससे इनिशियल सीपीयू स्पाइक व रेंडर-स्टॉर्म समाप्त हुआ।
   - `index.html` में 9 भारी प्रीलोड टैग्स हटाकर केवल T=0 डिफ़ॉल्ट पोज़ (`00-rear-view.png`) और बैकग्राउंड (`BgHero.jpg`) को `fetchpriority="high"` के साथ रखा, तथा गूगल फॉन्ट्स को नॉन-रेंडर-ब्लॉकिंग (`media="print" onload="this.media='all'"`) बनाया।
   - `CaseStudyDrawer.jsx` को लाइटवेट लेज़ी शेल में बदलकर `CaseStudyDrawerContent.jsx` में विभाजित किया, जिससे 163+ kB का केस स्टडी डेटासेट व सिमुलेटर यूजर क्लिक से पहले लोड नहीं होता।
   - `package.json` टेस्ट पाइपलाइन को 34 स्वतंत्र वेरिफिकेशन व एडवर्सैरियल टेस्ट्स तक विस्तारित किया।

6. **कंपोजिटर स्क्रॉलिंग, rAF थ्रॉटल्ड स्क्रॉलस्पाय, रोल कॉन्टेक्स्ट डीकपलिंग एवं मार्की मेमोइज़ेशन:**
   - `HeroSection.jsx` में व्हील और टच लिसनर्स को पैसिव बनाकर और 2-फिंगर पिंच जेस्चर को केवल मल्टी-टच पहचान पर डायनामिक रूप से माउंट/अनमाउंट कर मोबाइल स्क्रॉलिंग को 100% कंपोजिटर-ड्रिवन बनाया गया।
   - `Navbar.jsx` में rAF टिकिंग गार्ड, डोम नोड लेज़ी कैशिंग और स्टेट अपडेट गार्ड लागू कर स्क्रॉलिंग के दौरान 1,300+ जबरन लेआउट रिफ्लो और गैर-जरूरी री-रेंडर्स को खत्म किया गया।
   - `RoleContext.jsx` में `soundEnabledRef` के जरिए साउंड प्रॉप को `selectRole` से अलग कर ऑडियो म्यूट/अनम्यूट पर 13 सेक्शंस के कैस्केडिंग री-रेंडर को शून्य किया गया।
   - `TechMarqueeBanner.jsx` में मॉड्यूल-लेवल सीक्वेंस होस्टिंग और `React.memo(MarqueeCard)` के जरिए 348 कार्ड्स के री-रेंडर थ्रैशिंग को 2 कार्ड्स तक सीमित किया गया।

7. **व्यूफ़ोर्ट कलिंग, मानकीकृत नेवबार आइकन्स एवं 0ms ऑफलाइन-डिफ़ॉल्ट हाइब्रिड मैप:**
   - `HeroSection.jsx` में `IntersectionObserver` व्यूफ़ोर्ट कलिंग (थ्रेशोल्ड 0.05) और DOM ओपेसिटी डर्टी-चेक लागू कर ऑफस्क्रीन 120 FPS ओवरड्रॉ को पूरी तरह समाप्त किया गया।
   - `Navbar.jsx` में 32x32px समरूप सर्कुलर एक्शन बटन्स, कॉम्पैक्ट सर्च बटन, और हैंडक्राफ्टेड शुद्ध वेक्टर SVG तिरंगा (24-स्पोक अशोक चक्र) व यूनियन जैक ध्वज जोड़े गए।
   - `ContactSection.jsx` और `LeafletOfflineMap.jsx` में ऑटो-अपग्रेड टाइमर को हटाकर 0ms ऑफलाइन मोड डिफ़ॉल्ट, 300ms डिबाउंस्ड लेयर्ड क्रॉसफ़ेड, ज़ूम लेवल 10–15 फ्लोर विस्तार, और विस्तृत पलामू बाउंडिंग बॉक्स लागू किया गया।

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
| 6.13 | **Rollup Manual Vendor Chunk Splitting** | `vite.config.js` | प्रोडक्शन बंडल ऑप्टिमाइज़ेशन एवं कोड स्प्लिटिंग | `rollupOptions.output.manualChunks` द्वारा 6 स्वतंत्र वेंडर चंक्स (`vendor-react`, `vendor-leaflet`, `vendor-jszip`, `vendor-confetti`, `vendor-lucide`, `data-case-studies`) बनाता है और `chunkSizeWarningLimit: 600` सेट करता है। |
| 6.14 | **Expanded 70-Script Automated Verification Suite** | `package.json`, `scripts/` | 70 स्वतंत्र वेरिफिकेशन एवं एडवर्सैरियल टेस्ट्स | 70 नोड/बैश टेस्ट सूट्स जो व्यू मोड, ऑडियंस फ़िल्टर, एआई चैट, केस स्टडीज, टर्मिनल सीएलआई, एफएक्यू, पोलरॉइड जेएसज़िप, और जीआईएस लेज़ी लोडिंग की 100% सटीकता प्रमाणित करते हैं। |
| 6.15 | **Resilient Dynamic Import & Offline Auto-Retry Engine** | `src/utils/lazyWithRetry.js` | नेटवर्क फेलियर पर एक्सपोनेंशियल बैकऑफ़ एवं ऑटो-रीट्राई | चंक लोडिंग एरर्स पर एक्सपोनेंशियल बैकऑफ़ (`maxRetries = 1`) के साथ स्वतः रीट्राई करता है, `navigator.onLine` व `online` इवेंट से डिवाइस के ऑनलाइन आते ही ऑटोमैटिक पुनः लोड करता है, और शुद्ध React इनलाइन फ़ॉलबैक एरर UI ("पुनः प्रयास करें / Retry") प्रदान करता है। |
| 6.16 | **Zero-CLS Glassmorphic Section Skeleton Loaders** | `src/components/SectionSkeleton.jsx` | Cumulative Layout Shift (CLS = 0) सुरक्षा एवं सुलभ लोडिंग इंडिकेटर | 5 विशिष्ट विजुअल वैरिएंट्स (`section`, `card`, `modal`, `accordion`, `terminal`) में डार्क ग्लासमॉर्फिक व शिमर एनिमेशन (`animate-pulse`) प्रदान करता है। प्री-रिजर्व्ड हाइट्स (`min-h-[...]`) से लेआउट शिफ्ट को शून्य रखता है और `role="status"` व `aria-busy="true"` के साथ स्क्रीन रीडर्स को स्थिति सूचित करता है। |
| 6.17 | **Application-Layer Dynamic Splitting & Suspense Boundaries** | `src/App.jsx`, `src/components/Navbar.jsx` | कोर बंडल में 63.2% की भारी कमी (1,254 kB से घट कर 462 kB) | 16 भारी गैर-महत्वपूर्ण मॉड्यूल्स (`TerminalCLI`, `CaseStudyDrawer`, `AboutSection`, `ProjectsSection`, `FAQSection`, `ContactSection`, `CommandPalette` आदि) को `lazyWithRetry` और `<Suspense>` बाउंड्रीज में अलग किया, जबकि Above-the-fold क्रिटिकल पाथ 0ms FCP हेतु स्टैटिक रखा। |
| 6.18 | **On-Demand Dynamic JSZip Archival Compression Engine** | `src/utils/polaroidExport.js`, `scripts/verify_polaroid_jszip_dynamic.mjs` | पोलरॉइड एक्सपोर्ट ट्रिगर पर ऑन-डिमांड JSZip लोड करना | पोलरॉइड फोटो एक्सपोर्टर से स्टैटिक JSZip आयात को हटाकर `exportAllPolaroidsZip` के भीतर `await import('jszip')` के जरिए लोड किया, जिससे इनिशियल पेज लोड पर 95.93 kB का `vendor-jszip` चंक पूरी तरह अलग हो गया जबकि पोलरॉइड कैनवस, एम्बर LED और ZIP आर्काइव की 100% कार्यप्रणाली अक्षुण्ण रही। |
| 6.19 | **Leaflet GIS Cartographic Dynamic Splitting & Cyber/HUD Skeleton Fallback** | `src/components/ContactSection.jsx`, `src/components/GISMapSkeleton.jsx`, `scripts/verify_leaflet_map.mjs`, `scripts/verify_gis_lazy_load.mjs` | 148 kB लीफलेट मैपिंग इंजन को ऑन-डिमांड लोड करना और साइबर HUD राडार फ़ॉलबैक दिखाना | `ContactSection` में `LeafletOfflineMap` को `lazy(() => import(...))` और `<Suspense>` बाउंड्री में विभाजित किया, जिससे 148.61 kB का `vendor-leaflet` चंक मुख्य पेज से अलग हो गया। लोडिंग के दौरान मेदिनीनगर HQ निर्देशांक (`24.0416° N`, `84.0700° E`), कार्टोग्राफिक ग्रिड, राडार पल्स और कंपास रेटिकल वाला साइबर HUD स्केलेटन (`GISMapSkeleton.jsx`) प्रदर्शित होता है। |
| 6.20 | **Intelligent Progressive Loading & Idle Cache Warm-up for Hero Character Poses** | `src/components/HeroSection.jsx`, `scripts/verify_hero_poses_progressive_loading.mjs` | इनिशियल माउंट पर प्रीलोड स्टॉर्म और जीपीयू फ्रीज को समाप्त करना | माउंट पर सभी 10 पोज़ को एक साथ डिकोड करने के बजाय केवल T=0 पोज़ तुरंत लोड करता है, और बाकी 9 पोज़ (01-09) को FCP के बाद `requestIdleCallback` (800ms फ़ॉलबैक) तथा `decoding="async"` के साथ बैकग्राउंड में कैश करता है। |
| 6.21 | **High-Priority Viewport Asset Preload & Non-Render-Blocking Google Fonts Loading** | `index.html` | फर्स्ट कंटेंटफुल पेंट (FCP) एवं LCP में क्रांतिकारी सुधार | `<head>` से 9 गैर-महत्वपूर्ण इमेज प्रीलोड्स हटाकर केवल तत्काल दिखने वाली T=0 पोज़ और बैकड्रॉप को `fetchpriority="high"` के साथ प्रीलोड करता है, तथा गूगल फ़ॉन्ट्स को `preload as="style"` और `media="print" onload="this.media='all'"` के साथ नॉन-रेंडर-ब्लॉकिंग बनाता है। |
| 6.22 | **Interactive Case Study Dossier Deep Code-Splitting & Suspense Decoupling** | `src/components/CaseStudyDrawer.jsx`, `src/components/CaseStudyDrawerContent.jsx` | 163+ kB केस स्टडी डेटा एवं टेलीमेट्री इंजन का ऑन-डिमांड लोड | `CaseStudyDrawer.jsx` को एक अल्ट्रा-लाइटवेट लेज़ी रैपर में तब्दील किया जो `CaseStudyDrawerContent` को केवल मोडल ओपन होने पर `<Suspense fallback={null}>` में लोड करता है, जिससे इनिशियल पेज लोड पर भारी डेटासेट पूरी तरह अलग रहता है। |
| 6.23 | **Automated 30-Script Continuous Verification & Adversarial Test Pipeline** | `package.json`, `scripts/` | 30 स्वतंत्र वेरिफिकेशन एवं एडवर्सैरियल टेस्ट सूट्स | टेस्ट पाइपलाइन का विस्तार कर `verify_polaroid_jszip_dynamic.mjs`, `verify_gis_lazy_load.mjs`, और `verify_hero_poses_progressive_loading.mjs` को जोड़ा गया, जिससे कोडबेस की अखंडता 100% स्वचालित रूप से प्रमाणित होती है। |
| 6.24 | **Terminal CLI Event Listener Lifecycle Guard & Inactive Thread Throttling** | `src/components/TerminalCLI.jsx` | निष्क्रिय टर्मिनल के समय बैकग्राउंड लिसनर्स को रोकना | `if (!isOpen && !isMatrixActive) return;` और `if (!isOpen) return;` गार्ड्स जोड़कर ESC की और विंडो रीसाइज/ड्रैग इवेंट लिसनर्स को केवल टर्मिनल सक्रिय होने पर बाइंड करता है, जिससे गैर-जरूरी सीपीयू यूसेज शून्य हो जाता है। |
| 6.25 | **Web Audio Master Gain Clamping & Linear Parameter Normalization** | `src/utils/audio.js` | ऑडियो नोड डिस्टॉर्शन सुरक्षा एवं क्लीन गेन कंट्रोल | `setMasterVolume` से अनावश्यक प्रतिशत री-स्केलिंग को हटाकर Web Audio API `masterGain.gain.setValueAtTime` में शुद्ध `[0.0, 1.0]` क्लैम्प्ड लीनियर वैल्यू पास करता है, जिससे वॉल्यूम पैरामीटर कभी क्लैंप रेंज से बाहर नहीं जाता। |
| 6.26 | **Draggable Character Kinematics & 120 FPS Spring Animation Optimization** | `src/hooks/useDraggableCharacter.js`, `src/components/HeroSection.jsx` | 120 FPS स्प्रिंग फिजिक्स एवं डायरेक्ट हार्डवेयर-एक्सेलरेटेड म्यूटेशन | स्प्रिंग स्नैपबैक (`animateSpring`) और लिफ्ट प्रोग्रेस में प्रति-फ्रेम React स्टेट सेटर्स (`setPosition`, `setLiftProgress`) को हटाकर डायरेक्ट `posRef.current` और `onPositionChange` से अपडेट करता है, जिससे 120Hz डिस्प्ले पर VDOM रिकॉन्सिलिएशन ओवरहेड शून्य हो जाता है। |
| 6.27 | **Zero-Reflow Pointer & Drag Clamping (Forced Synchronous Layout Elimination)** | `src/hooks/useDraggableCharacter.js`, `src/components/HeroSection.jsx` | लेआउट थ्रैशिंग और प्रति-फ्रेम `getBoundingClientRect()` का उन्मूलन | माउस/टच ड्रैगिंग और कर्सर गेज ट्रैकिंग के दौरान प्रति-इवेंट `getBoundingClientRect()` और `offsetWidth` कॉल्स को लूप से बाहर कैश करता है, जिससे 60/120 FPS पर forced synchronous reflows पूरी तरह खत्म हो जाते हैं। |
| 6.28 | **Instantaneous Drag Activation & Post-Drop Photo Click Suppression Architecture** | `src/hooks/useDraggableCharacter.js`, `src/components/HeroSection.jsx` | तात्कालिक ड्रैग रिस्पॉन्स एवं ड्रैग रिलीज पर अनपेक्षित फोटो क्लिक से सुरक्षा | कठोर 250ms होल्ड ब्लॉकर को हटाकर >5px मूवमेंट पर तुरंत ड्रैग शुरू करता है, और ड्रैग खत्म होने पर `hasDraggedRef` फ्लैग द्वारा ट्रेलिंग सिंथेटिक क्लिक को ब्लॉक करता है ताकि कैरेक्टर छोड़ने पर अनचाहा फोटो कैप्चर या मोडल न खुले। |
| 6.29 | **Custom Cursors Garbage Collection Churn & Particle Memory Pooling Optimization** | `src/components/ButterflyCursor.jsx`, `src/components/cursors/FireflyCursor.jsx`, `src/components/cursors/ModularKinematicCursor.jsx` | फिक्स्ड पार्टिकल ऑब्जेक्ट पूल एवं शून्य-एलोकेशन कैनवस रेंडरिंग | 35 कर्सर्स में प्रति-फ्रेम ऑब्जेक्ट निर्माण और `Array.splice` को प्री-एलोकेटेड फिक्स्ड ऑब्जेक्ट पूल्स (`MAX_PARTICLES=70/60`) से बदलकर O(1) इन-प्लेस स्लॉट एक्टिवेशन और `ctx.globalAlpha` रेंडरिंग लागू करता है, जिससे GC पॉज़ और माइक्रो-स्टटर्स शून्य हो जाते हैं। |
| 6.30 | **Idle Full-Screen Canvas Clear Overdraw Optimization via Dirty Flag Architecture** | `src/components/cursors/ModularKinematicCursor.jsx`, `src/components/ButterflyCursor.jsx` | स्थिर कर्सर पर पूर्ण-स्क्रीन `ctx.clearRect()` ओवरड्रॉ की रोकथाम | `isCanvasDirty` डर्टी-फ्लैग आर्किटेक्चर लागू करता है; जब कर्सर स्थिर हो और कोई पार्टिकल सक्रिय न हो, तो अनावश्यक `ctx.clearRect()` कॉल नहीं होती, जिससे निष्क्रिय स्थिति में GPU और CPU ओवरड्रॉ शून्य हो जाता है। |
| 6.31 | **Global Command Palette Modal Dynamic Code-Splitting with Retry Safety** | `src/components/Navbar.jsx`, `src/utils/lazyWithRetry.js` | कमांड पैलेट मोडल (⌘K) का ऑन-डिमांड लेज़ी लोड एवं CLS-मुक्त सस्पेंस | `CommandPalette.jsx` (67+ kB) को इनिशियल बंडल से अलग करके `lazyWithRetry` और `<Suspense fallback={null}>` के साथ केवल यूज़र द्वारा खोज बटन या कीबोर्ड शॉर्टकट दबाने पर ऑन-डिमांड लोड करता है। |
| 6.32 | **Hero Section Non-Passive Wheel & Touchmove Scroll-Blocking Elimination** | `src/components/HeroSection.jsx` | स्क्रॉल-ब्लॉकिंग इवेंट लिसनर्स का उन्मूलन एवं नेटिव कंपोजिटर स्क्रॉलिंग | व्हील और टच लिसनर्स को पैसिव (`{ passive: true }`) में तब्दील किया और 2-फिंगर पिंच जेस्चर को केवल मल्टी-टच पहचान पर डायनामिक रूप से माउंट/अनमाउंट (`attachTouchMove`/`detachTouchMove`) किया, जिससे सिंगल-फिंगर मोबाइल स्क्रॉलिंग बिना मेन-थ्रेड ब्लॉकिंग के स्मूथली चलती है और लाइटहाउस परफॉर्मेंस पेनल्टी शून्य हो जाती है। |
| 6.33 | **Navbar ScrollSpy Layout Reflow Elimination via rAF Ticking Guard & Node Cache** | `src/components/Navbar.jsx` | 1,300+ जबरन सिंक्रोनस रिफ्लो और लेआउट थ्रैशिंग का उन्मूलन | अनथ्रॉटल्ड `scroll` लिसनर को `requestAnimationFrame` टिकिंग गार्ड (`ticking` फ्लैग + `rafId`), लेज़ी कैश्ड DOM एलिमेंट रेफरेंसेस (`getCachedElements` जो रीसाइज़ पर अमान्य होता है), और स्टेट कंपैरिजन गार्ड (`prev !== current ? current : prev`) से सुसज्जित किया, जिससे पेज स्क्रॉल के दौरान 1,300+ रिफ्लो कॉल्स और गैर-जरूरी नेवबार री-रेंडर्स खत्म हो जाते हैं। |
| 6.34 | **Sound Toggle RoleContext Cascading Re-render Elimination & Referential Stability** | `src/context/RoleContext.jsx`, `scripts/test_sound_toggle_role_context.mjs` | ऑडियो म्यूट/अनम्यूट पर 13 सेक्शंस के अनावश्यक री-रेंडर का उन्मूलन | `soundEnabled` प्रॉप को म्यूटेबल रिएक्ट रेफ़ (`soundEnabledRef`) के माध्यम से `selectRole` क्लोजर से अलग किया और `selectRole` की डिपेंडेंसी ऐरे को रिक्त `[]` रखा, जिससे ऑडियो म्यूट/अनम्यूट टॉगल करने पर `selectRole` और कॉन्टेक्स्ट वैल्यू की रेफरेंशियल आइडेंटिटी स्थिर रहती है और 13 प्रमुख सेक्शंस में 50ms–150ms का यूआई लैग समाप्त हो जाता है। |
| 6.35 | **TechMarqueeBanner 348 Cards Re-render Thrashing Elimination & Memoized Bailout** | `src/components/TechMarqueeBanner.jsx`, `scripts/test_marquee_render_optimization.mjs` | होवर/टूलपिप पर 348 कार्ड्स के री-रेंडर को घटाकर शुद्ध 2 कार्ड्स तक सीमित करना | डुअल इन्फिनिट रिबन एरेज़ (168 टॉप + 156 बॉटम = 324 DOM कार्ड्स) को कंपोनेंट से बाहर मॉड्यूल स्कोप (`TOP_SEQUENCE`, `BOTTOM_SEQUENCE`) पर होस्ट किया, कार्ड्स को `React.memo` और कस्टम इक्वैलिटी कंपैरेटर (`areMarqueeCardPropsEqual`) वाले `MarqueeCard` सब-कंपोनेंट में विभाजित किया, और सभी इवेंट हैंडलर्स को `useCallback` से स्थिर किया, जिससे टूलपिप टॉगल पर 346 कार्ड्स का 100% बेलआउट होता है और ~1,400 इनलाइन क्लोजर्स का GC लोड शून्य हो जाता है। |
| 6.36 | **Hero Section Viewport Culling & rAF Offscreen Overdraw Elimination** | `src/components/HeroSection.jsx`, `scripts/test_hero_viewport_culling.mjs` | ऑफस्क्रीन स्थिति में 120 FPS rAF लूप को रोकना और DOM ओपेसिटी डर्टी-चेक लागू करना | हीरो सेक्शन पर `IntersectionObserver` (थ्रेशोल्ड 0.05) बाइंड कर स्क्रॉल आउट होने पर 60/120 FPS rAF लूप को पॉज़ और व्यूपोर्ट में लौटने पर सुरक्षित रिज़्यूम करता है (`isHeroVisibleRef`), साथ ही 10 कैरेक्टर पोज़ इमेजेस के लिए `prevOpsRef` डर्टी-चेक थ्रेशोल्ड (`Math.abs(op - prevOps[p]) > 0.005`) लागू करता है जिससे ऑफस्क्रीन GPU/CPU ओवरड्रॉ और पंखे की आवाज़ पूरी तरह समाप्त हो जाती है। |
| 6.37 | **Navbar Action Group Icon Standardization, Pure SVG Vector Flags & Uniform Capsule Buttons** | `src/components/Navbar.jsx`, `scripts/verify_navbar_icons_styling.mjs`, `package.json` | 32x32px समरूप सर्कुलर एक्शन बटन्स और हैंडक्राफ्टेड SVG तिरंगा व यूनियन जैक ध्वज | नेवबार एक्शन ग्रुप के विभिन्न बटनों (Search, Language Switcher, Theme, Audio) को 32x32px (`w-8 h-8 rounded-full`) सर्कुलर कैप्सूल स्टाइल में मानकीकृत किया, शुद्ध वेक्टर SVG कम्पोनेंट्स `IndiaFlag` (24-स्पोक अशोक चक्र व सर्कुलर क्लिप-पाथ) एवं `UkFlag` (प्रामाणिक क्रॉस व साल्टायर्स) बनाए, कॉम्पैक्ट सर्च बटन लागू किया, और मोबाइल ड्रॉअर के साथ विजुअल फ्लैग्स को 100% सिंक्रनाइज़ किया। |
| 6.38 | **Offline-by-Default Hybrid Map Architecture, Layered Zero-Flicker Crossfade & Zoom Floor 10-15 Expansion** | `src/components/ContactSection.jsx`, `src/components/LeafletOfflineMap.jsx`, `scripts/verify_leaflet_map.mjs`, `scripts/verify_map_hybrid_system.mjs`, `scripts/test_challenger_map_bounds.mjs` | ऑटो-अपग्रेड टाइमर का विलोपन, 0ms तत्काल ऑफलाइन मैप डिफ़ॉल्ट, शून्य-फ्लिकर लेयर्ड क्रॉसफ़ेड एवं ज़ूम 10-15 विस्तार | बैकग्राउंड `AUTO_UPGRADE_DELAY` टाइमर को पूरी तरह हटाकर 0ms तत्काल ऑफलाइन लीफलेट OSM को डिफ़ॉल्ट बनाया, लाइव गूगल मैप्स को विशुद्ध रूप से यूजर के टॉगल क्लिक पर ऑन-डिमांड किया, 300ms डिबाउंस्ड लेयर्ड क्रॉसफ़ेड (`iframeHydrationTimerRef`) व स्पिनर (`<Loader2 className="animate-spin" />`) लागू किया, ऑफलाइन मैप ज़ूम फ्लोर को लेवल 10 तक विस्तारित किया (`minNativeZoom: 12` रास्टर डाउनस्केलिंग के साथ), और पलामू रीजनल बाउंडिंग बॉक्स को `[[23.7646, 83.6455], [24.3186, 84.4945]]` तक विस्तृत किया। |
| 6.39 | **Universal Accessible Navbar Floating Pill Tooltip System** | `src/components/NavbarTooltip.jsx`, `src/components/Navbar.jsx`, `scripts/verify_navbar_cursor_scrollspy_tooltips.mjs` | सुलभ फ्लोटिंग पिल टूलपिप, 120ms डिबाउंस, 400ms टच-एंड-होल्ड एवं कीबोर्ड सपोर्ट | ब्राउज़र के डिफ़ॉल्ट विलंबित टूलटिप्स को हटाकर एक एकीकृत, सुलभ और सौंदर्यपरक डार्क/लाइट फ्लोटिंग कैप्सूल टूलपिप कंपोनेंट प्रदान करता है। डेस्कटॉप पर 120ms होवर डिबाउंस, कीबोर्ड फोकस, और ब्लर/एस्केप/क्लिक पर ऑटो-डिसमिस की सुविधा देता है; टच स्क्रीन्स पर 400ms टच-एंड-होल्ड (लॉन्ग प्रेस) हैप्टिक सपोर्ट और 3.5s ऑटो-डिसमिस प्रदान करता है; इसमें हॉरिजॉन्टल अलाइनमेंट (left/center/right), केयरट पॉइंटर, टाइटल, सबटेक्स्ट और कीबोर्ड शॉर्टकट बैज (जैसे ⌘K) शामिल हैं। |
| 6.40 | **Universal Interactive Pointer Cursor Enforcement & SVG Pointer Events Non-Interception** | `src/index.css`, `scripts/verify_navbar_cursor_scrollspy_tooltips.mjs` | सभी बटनों, लिंक्स और इंटरएक्टिव रोल्स पर पॉइंटर कर्सर का 100% प्रवर्तन | `src/index.css` में वैश्विक नियम लागू किए गए जिससे सभी लिंक्स, बटन्स, `[role="button"]`, टैब्स, रेडियो, रेंज इनपुट्स और उनके आंतरिक चाइल्ड एलिमेंट्स पर `cursor: pointer !important;` लागू होता है (कस्टम कर्सर सक्रिय होने या बंद होने दोनों स्थितियों में), तथा आंतरिक SVG आइकन्स को `pointer-events: none` दिया गया ताकि वे माउस इवेंट्स को बाधित न करें और कर्सर कभी डिफ़ॉल्ट एरो पर रिवर्ट न हो। |
| 6.41 | **Multi-Tier Global React ErrorBoundary Fault Isolation Subsystem** | `src/components/ErrorBoundary.jsx`, `src/main.jsx`, `src/App.jsx` | संपूर्ण ऐप की क्रैश सुरक्षा व फ़ॉल्ट आइसोलेशन | पूरे एप्लिकेशन रूट (`AppRoot`) पर मुख्य बाउंड्री तथा भारी स्लाइड-आउट मॉड्यूल्स (`LabStudioDrawer`, `TerminalCLI`, `CaseStudyDrawer`, `CredentialLightboxModal`, `AIChatWidget`, `Footer`) पर स्वतंत्र घटक-स्तरीय बाउंड्रीज लागू करता है; रनटाइम एरर पर शांत डायग्नोस्टिक एरर स्टैक लॉगिंग और "Reload Application" / "Try Again" बटन्स देता है। |
| 6.42 | **Navbar Instant Selection Lock on First Click & Intermediate Hover Hijack Immunity** | `src/components/Navbar.jsx`, `scripts/verify_navbar_instant_selection_lock.mjs` | नेवबार क्लिक पर तात्कालिक सिलेक्शन लॉक | शीर्ष नेवबार या मोबाइल मेनू लिंक पर क्लिक करते ही `isClickNavigatingRef` (1,400ms सुरक्षा टाइमआउट) द्वारा एक्टिव सेक्शन स्टेट को लॉक कर देता है, जिससे स्मूथ स्क्रॉल के दौरान बीच के सेक्शन्स द्वारा स्क्रॉल-स्पाई हाईजैक या बटन फ़्लिकरिंग पूरी तरह समाप्त हो जाती है। |
| 6.43 | **Navbar Horizontal Sub-Bars Strict Mutual Exclusivity Architecture** | `src/components/Navbar.jsx`, `scripts/verify_scroll_restore_and_navbar_exclusivity.mjs` | सब-बार्स के परस्पर टकराव का विलोपन | एकल `activeSubBar` स्टेट (`'role' / 'explore' / 'audience' / 'viewmode' / 'cursor' / null`) द्वारा सभी 5 क्षैतिज सब-बार्स के परस्पर ओवरलैप को गणितीय रूप से असंभव बनाता है; सर्च ट्रिगर, मोबाइल हैमबर्गर, आउटसाइड क्लिक या ESC की दबाते ही सक्रिय सब-बार को तत्काल डिसमिस करता है। |
| 6.44 | **Suspense Section Skeleton Layout Anchor & Scroll Offset Synchronization** | `src/components/SectionSkeleton.jsx`, `src/App.jsx` | सस्पेंस स्केलेटन लेआउट एंकर एवं ऑफसेट | सभी लेज़ी-लोडेड सस्पेंस फ़ॉलबैक स्केलेटन्स (`SectionSkeleton`) में सटीक `id` एंकर और `scroll-mt-28` ऑफसेट इंजेक्ट करता है, जिससे इनिशियल पेज लोड और स्क्रॉल रीस्टोरेशन के दौरान नेवबार के पीछे सेक्शन हेडर कभी न छिपे और सीएलएस (CLS) शून्य रहे। |
| 6.45 | **Headless Chrome CDP Page Refresh & Blank Screen Zero-Crash Resilient Pipeline** | `scripts/test_refresh_resilience.mjs`, `package.json` | ब्राउज़र रिफ्रेश रेजिलिएंस सीआई ऑटोमेशन | हेडलेस माइक्रोसॉफ्ट एज / क्रोम को Chrome DevTools Protocol (CDP WebSocket) से जोड़कर पेज रिलोड, रनटाइम अपवाद निगरानी (`Runtime.exceptionThrown`), और 3,000ms पोस्ट-रिफ्रेश DOM हेल्थ चेक करने वाली स्वचालित सीआई एडवर्सैरियल टेस्ट पाइपलाइन। |
| 6.46 | **Expanded 42-Suite Continuous Automated Verification & Adversarial Pipeline** | `package.json`, `scripts/` | 42 स्वतंत्र वेरिफिकेशन एवं टेस्ट सूट्स | टेस्ट पाइपलाइन का विस्तार कर 42 स्वतंत्र वेरिफिकेशन व एडवर्सैरियल टेस्ट सूट्स (99+ वैलिडेटेड टेस्ट इन्वेरिएंट्स) स्थापित किए, जो 3D कंट्रोल्स, रिफ्रेश रेजिलिएंस, स्क्रॉल रीस्टोरेशन, नेवबार एक्सक्लूसिविटी, और एआई चैट डिसीजन ट्री की 100% शुद्धता प्रमाणित करते हैं। |
| 6.47 | **On-Device AI Engine & Conservative Tiering Verification Suite** | `scripts/verify_on_device_ai.mjs`, `package.json` | ऑन-डिवाइस एआई एवं मॉडल टियरिंग टेस्ट | ट्रांसफॉर्मर्स.जेएस पैकेज, वेब वर्कर, हार्डवेयर प्रोफाइलर, कंजर्वेटिव टियरिंग (4B->1.5B, 1B->0.5B, Mobile->135M), 50ms माइक्रो-बेंचमार्क और मॉडल एट्रिब्यूशन बैज की 100% अखंडता जांचने वाला स्वचालित टेस्ट सूट। |
| 6.48 | **Phase 1 Certified: 360° Circular Compass Dial & Solar Lighting Verification Suite (10/10 PASS)** | `scripts/verify_gap1_orbital_sun_compass.mjs` | 360° कंपास डायल व शैडो स्फीयर टेस्ट (Phase 1 Certified) | WAI-ARIA `role="slider"`, कार्डिनल दिशा संकेत (N, E, S, W), त्रिकोणमितीय सौर कक्षा स्थिति, केंद्रीय 36px लाइव शैडो स्फीयर, 4 क्वाड्रेंट बटन्स, और कीबोर्ड नेविगेशन की 10/10 शुद्धता जांचने वाला स्वचालित टेस्ट सूट। |
| 6.49 | **Phase 2 Certified: 3D Material Shader Orbs & Bevel Chamfer Verification Suite (11/11 PASS)** | `scripts/verify_gap2_material_shader_orbs.mjs` | 4 मटीरियल शेडर्स व बेवेल डायग्राम टेस्ट (Phase 2 Certified) | 4 फोटो-यथार्थवादी मटीरियल शेडर ओर्ब्स (Glass, Metallic, Clay, Cyber Wireframe), टैक्टाइल ग्रिड रेडियो-ग्रुप, शीन एनीमेशन, और रियल-टाइम एसवीजी बेवेल शैंफर डायग्राम की 11/11 शुद्धता प्रमाणित करने वाला स्वचालित टेस्ट सूट। |
| 6.50 | **Multi-Tab Anti-Echo & Reference Stability Verification Suite** | `scripts/verify_multi_tab_anti_echo.mjs` | मल्टी-टैब एंटी-इको व स्थिरता टेस्ट | `isIncomingSyncRef` इको बाईपास गार्ड, `lastSavedPayloadRef` पेलोड डिडुपलिकेशन, और सबसिस्टम्स में रेफरेंस स्टेबिलिटी चेक्स की 100% कार्यक्षमता प्रमाणित करने वाला टेस्ट सूट। |
| 6.51 | **Control Center Standalone View Specification Suite** | `scripts/verify_control_center_standalone_view.mjs` | स्टैंडअलोन स्टूडियो आर्किटेक्चर टेस्ट | DOM आइसोलेशन, `?view=control` व `?panel=control` यूआरएल डिटेक्शन, टू-टियर मोड (`all` vs `single`), टैब नॉर्मलाइजेशन, और लाइव स्टोरेज सिंक इंडिकेटर की जांच करने वाला टेस्ट सूट। |
| 6.52 | **Stream A URL Parameter & Popout Single Tab Panel Suite** | `scripts/verify_stream_a_url_panel.mjs` | यूआरएल पैरामीटर्स व सिंगल टैब पॉपआउट टेस्ट | ThemeContext, LanguageContext, InteractivePlayground, और ControlCenterPanel में `mode=single` पॉपआउट यूआरएल कंस्ट्रक्शन व हेडर छुपाव की स्वचालित जांच। |
| 6.53 | **Theme & Language Preservation Two-Tier Control Audit Suite** | `scripts/test_theme_lang_two_tier_control.mjs` | थीम, भाषा व टू-टियर कंट्रोल का 24-पॉइंट ऑडिट | यूआरएल पैरामीटर प्रसार, सिंगल मोड आइसोलेशन, लाइट/डार्क थीम प्रिजर्वेशन, और द्विभाषी (EN/HI) स्थानीयकरण का 24-बिंदु विस्तृत ऑडिट सूट। |
| 6.54 | **Independent Subagent Quality & Verification Audit Suite** | `scripts/verify_subagent_fixes_audit.mjs` | स्वतंत्र सब-एजेंट गुणवत्ता व फिक्स ऑडिट | डायनामिक कर्सर मैनेजर वायरिंग्स, लैब कॉन्टेक्स्ट वॉयस सेटिंग्स पर्सिस्टेंस, और सिबलिंग कॉन्टेक्स्ट्स के क्रॉस-टैब स्टोरेज इवेंट सिंक्रोनाइज़ेशन का 10-पॉइंट स्वतंत्र ऑडिट। |
| 6.55 | **3D Sandbox Viewport Gizmo, Perspective Grid & 2D Compare Verification Suite** | `scripts/verify_gap3_sandbox_hud.mjs` | 3D व्यूफ़ोर्ट गिज़्मों, ग्रिड व 2D तुलना टेस्ट | 3D ओरिएंटेशन गिज़्मों (300px पर्सपेक्टिव, 3 कलर्ड आर्म्स, 4 क्विक स्नैप्स), 600px पर्सपेक्टिव ग्राउंड ग्रिड, डायनामिक सॉफ्ट कॉन्टैक्ट शैडो, और "Hold to Compare 2D" लेयर फ़्लैटनिंग की स्वचालित जांच करने वाला टेस्ट सूट। |
| 6.56 | **Phase 3 Certified: 3D Blueprint Wireframe & Batch HUD Verification Suite (15/15 PASS)** | `scripts/verify_gap4_blueprint_wireframe.mjs`, `package.json` | 3D ब्लूप्रिंट वायरफ्रेम व बैच टॉगल टेस्ट (Phase 3 Certified) | ब्लूप्रिंट हेडर बार, शो/हाइड मैप टॉगल, ग्लासमोर्फिक कंटेनर min-h-[200px], 10 आर्किटेक्चरल वेक्टर एलिमेंट्स, एमराल्ड पल्सिंग डॉट्स (`animate-ping`), 3 ग्रुप बैच टॉगल चिप्स (स्मार्ट सिंक्रोनस लॉजिक व लाइव काउंटर्स X/4, X/2), 2-वे सिंक्रोनाइज़्ड होवर हाइलाइटिंग (`ring-2 ring-[#FF4D6D]/40`), WAI-ARIA रीज़न, तथा `set3DElementGroup` की 15/15 शुद्धता प्रमाणित करने वाला स्वचालित टेस्ट सूट। |
| 6.57 | **Phase 4 Certified: Isometric Layer Strata Stack & CAD Callouts Verification Suite (13/13 PASS)** | `scripts/verify_phase4_exploded_strata.mjs`, `package.json` | 3D स्ट्रैटा स्टैक व सीएडी कॉलआउट्स टेस्ट (Phase 4 Certified) | LabContext स्कीमा व `soloStrata` नॉर्मलाइजेशन, सेक्शन 6 में ~160px आइसोमेट्रिक कंटेनर, 3 स्ट्रैटा स्लैब्स, डायनामिक Z-सेपरेशन व लेयर स्टैगर, 4 कॉर्नर सीएडी प्रोजेक्शन लाइन्स (`strokeDasharray="3 3"`), लाइव डायमेंशन व स्टैगर कॉलआउट्स, ब्लूप्रिंट मोड स्विचिंग, होवर इन्वेंटरी टूलटिप, क्लिक-टू-सोलो स्ट्रैटम व 3D सैंडबॉक्स डिम/हाइलाइट रिफ्लेक्शन, कीबोर्ड WAI-ARIA एक्सेसिबिलिटी, और हैप्टिक ऑडियो की 13/13 शुद्धता प्रमाणित करने वाला स्वचालित टेस्ट सूट। |
| 6.58 | **Phase 5 Certified: Spring Elasticity Oscillation Graph & Physics Test Pad Verification Suite (13/13 PASS)** | `scripts/verify_phase5_physics_pad.mjs`, `package.json` | स्प्रिंग ऑसिलेशन वेवफॉर्म व टेस्ट पैड टेस्ट (Phase 5 Certified) | `LabContext` में `PHYSICS_PROFILES` एक्सपोर्ट (Rigid, Snappy, Bouncy स्पेक्स), `normalize3DPhysics` वैलिडेशन, सेक्शन 5 में `SpringOscillationWaveform` व `PhysicsTestPad` की सटीक प्लेसमेंट, SVG हार्मोनिक डिके कर्व्स, `y=30` डैश्ड सेटलिंग लाइन, `<animateMotion>` पल्स डॉट, 3D पर्सपेक्टिव व डायनामिक `hoverPop` एलिवेशन, मैकेनिकल `clickDepression` व क्यूबिक-बेजियर रिकॉइल, `soundFX.playHapticClick()`, रियल-टाइम टेलीमेट्री बैज, WAI-ARIA एक्सेसिबिलिटी, और Vite SSR कंपाइलेशन की 13/13 शुद्धता प्रमाणित करने वाला स्वचालित टेस्ट सूट। |
| 6.59 | **Phase 6 Certified: 3D Spatial Audio Soundfield Radar & Test Ping Verification Suite (17/17 PASS)** | `scripts/verify_phase6_spatial_radar.mjs`, `package.json` | स्थानिक ऑडियो रडार व टेस्ट पिंग टेस्ट (Phase 6 Certified) | `LabContext` में `ACOUSTIC_PROFILES` एक्सपोर्ट (Booth, Studio, Cathedral स्पेक्स, reflectionCount, decayMultiplier), `useLab` में `acousticProfiles`, `soundFX.playSpatialPing` ड्यूल हार्मोनिक (880Hz + 1320Hz), `StereoPannerNode` रूटिंग, रूम-स्केल्ड डिके एनवेलप, म्यूट सेफगार्ड, सेक्शन 8 में `SpatialAudioRadarVisualizer` (130px पोलर डिस्प्ले, 3 रिंग्स, 360° स्वीपिंग बीम, रिफ्लेक्शन वेक्टर्स, पिंग रिपल एनीमेशन, प्रिव्यू पिंग ट्रिगर, 3 टेलीमेट्री बैज), WAI-ARIA एक्सेसिबिलिटी, और Vite SSR कंपाइलेशन की 17/17 शुद्धता प्रमाणित करने वाला स्वचालित टेस्ट सूट। |
| 6.60 | **Phase 7 Certified: 380px Drawer Ergonomics, Touch Stepper Buttons & Compact Action Toolbar Verification Suite (17/17 PASS)** | `scripts/verify_gap5_drawer_ergonomics.mjs`, `package.json` | ड्रॉअर एर्गोनॉमिक्स, टच स्टेपर्स व टूलबार टेस्ट (Phase 7 Certified) | Master 3D Themes 2x2 कॉम्पैक्ट ग्रिड, 4 सिग्नेचर थीम्स (Apple Glass, Cyber Neon, Studio Matte, Floating Hologram), एक्टिव स्टेट रिंग व चेकमार्क बैज, `SliderWithSteppers` 36px/44px टच टारगेट्स (WCAG 2.5.5/2.5.8), 7 मुख्य स्लाइडर रेंजेस व स्टेप्स, बॉटम 2x2 सेगमेंटेड ग्लास एक्शन टूलबार (Export JSON, Import JSON, Copy CSS, Reset Defaults + क्रिस्टल चाइम), ड्रॉअर व्यूपोर्ट हाइट `h-48 sm:h-56`, फ्लोटिंग-पॉइंट व इंटीजर स्टेप क्लैम्पिंग प्रिसिजन, और Vite SSR कंपाइलेशन की 17/17 शुद्धता प्रमाणित करने वाला स्वचालित टेस्ट सूट। |
| 6.61 | **Phase 4 Performance Certified: Asset, Font, CSS, Marquee DOM & Leaflet Tile Engine Optimization Suite (23/23 PASS)** | `src/components/TechMarqueeBanner.jsx`, `src/components/LeafletOfflineMap.jsx`, `src/styles/simple-mode.css`, `src/styles/high-contrast.css`, `src/App.css`, `scripts/verify_leaflet_map.mjs`, `scripts/test_challenger_map_ui.mjs` | मारकी DOM, लीफ़लेट टाइल व सीएसएस ऑप्टिमाइज़ेशन (Phase 4 Certified) | `TechMarqueeBanner` में 12x से 4x (~100 कार्ड्स) और `IntersectionObserver` ऑफस्क्रीन एनीमेशन पॉज, `LeafletOfflineMap` में `keepBuffer: 2`, `updateWhenIdle: true` व जीपीयू डार्क फ़िल्टर (`invert(0.92) hue-rotate(180deg) contrast(1.1)` + `will-change: transform`), `scripts/verify_leaflet_map.mjs` व `scripts/test_challenger_map_ui.mjs` में `keepBuffer: 2` असर्शन सपोर्ट, `simple-mode.css` से यूनिवर्सल वाइल्डकार्ड `*` सेलेक्टर उन्मूलन, `high-contrast.css` एट्रिब्यूट सेलेक्टर अनुकूलन, और `App.css` से 185 लाइन डेड बॉयलरप्लेट हटाने का 23/23 शुद्धता के साथ संपूर्ण प्रमाणीकरण। |
| 6.62 | **Master 3D Phase 1: State Isolation & Scoped CSS 3D Architecture Verification Suite** | `scripts/verify_phase1_state_isolation.mjs` | 13-एसर्शन 3D स्टेट आइसोलेशन टेस्ट हार्नेस | सैंडबॉक्स व्यूपोर्ट कंटेनर, स्कॉप 3D कस्टम प्रॉपर्टीज, और `isLive3DApplied` टॉगल की शून्य-डीओएम-लीकेज कार्यप्रणाली का 100% ग्रीन सत्यापन। |
| 6.63 | **Master 3D Phase 2: Universal Top Mini-DOM Portfolio 3D Sandbox Verification Suite** | `scripts/verify_phase2_universal_mini_dom.mjs` | 13-एसर्शन मिनिएचर डीओएम 3D टेस्ट हार्नेस | मिनी नेवबार, मिनी हेरो, मिनी स्किल्स व डॉक, स्टारडस्ट पार्टिकल्स, और सीएडी वायरफ्रेम टॉगल की संपूर्ण कार्यप्रणाली का 100% ग्रीन सत्यापन। |
| 6.64 | **Master AI Chat Enhancements Verification Harness (Phases 1 - 7)** | `scripts/verify_chat_enhancements.mjs`, `package.json` | 32-एसर्शन 7-चरणीय एआई चैट टेस्ट हार्नेस | व्यूपोर्ट dvh, सेफ़ एरिया, सेफ़ मार्कडाउन पार्सर, स्लैश पैलेट, WCAG 2.1 AA फोकस ट्रैप, टोकन स्ट्रीमिंग, कॉन्टेक्स्ट मेमोरी, और WebGPU लॉस रिकवरी का 100% ग्रीन सत्यापन। |
| 6.65 | **Phase 8 Capstone: Master System Integration & Verification Harness** | `scripts/verify_phase8_chat_integration.mjs`, `package.json` | 25-एसर्शन मास्टर इंटीग्रेशन टेस्ट हार्नेस | क्रॉस-कंपोनेंट इवेंट कॉन्ट्रैक्ट्स (`portfolio:open-ai-chat`), कॉन्टेक्स्ट सिंक, लाइफसाइकिल टीयरडाउन हाइजीन, और लीन बंडल बजट का 100% ग्रीन सत्यापन। |
| 6.66 | **Phase 9 Master Verification: Session Export, History & Telemetry Suite** | `scripts/verify_phase9_chat_telemetry.mjs`, `package.json` | 19-एसर्शन सेशन एक्सपोर्ट व टेलीमेट्री टेस्ट हार्नेस | 4-फॉर्मेट चैट एक्सपोर्ट (MD, TXT, JSON, HTML), 10-सेशन FIFO कोटा, और ऑफलाइन टेलीमेट्री स्कोरकार्ड का 100% ग्रीन सत्यापन। |
| 6.67 | **Phase 10 Master Verification: Agentic Tour, Search & Action Cards Suite** | `scripts/verify_phase10_chat_agent.mjs`, `package.json` | 17-एसर्शन एजेंटिक टूर्स व सिमेंटिक इंडेक्स टेस्ट हार्नेस | 4 क्यूरेटेड गाइडेड टूर्स, मल्टी-टोकन सिमेंटिक सर्च, चैट एक्शन कार्ड्स, और स्लैश कमांड्स का 100% ग्रीन सत्यापन। |
| 6.68 | **Offline Meta-Prompt Engineering & Autonomous AI Preload Verification Suite** | `scripts/verify_meta_prompt_engine.mjs` | 9-सुइट मेटा-प्रॉम्ट व बैकग्राउंड प्रीलोड टेस्ट हार्नेस | 6 प्री-बिल्ट कैटेगरीज, 5-पार्ट स्ट्रक्चर्ड मेटा-प्रॉम्ट्स, शॉर्ट सीएलआई कमांड्स, और साइलेंट बैकग्राउंड एआई प्रीलोड का 100% ग्रीन सत्यापन। |
| 6.69 | **Meta-Prompt & Interactive Studio Chat Verification Suite** | `scripts/verify_meta_prompt_chat.mjs` | स्लैश कमांड्स व इंटरएक्टिव मेटा-प्रॉम्ट चैट टेस्ट | `/engineer`, `/prompt`, `/metaprompt` कमांड्स और चैट के भीतर डुअल-कार्ड स्पेसिफिकेशन रेंडरिंग का 100% ग्रीन सत्यापन। |



---

<a id="module-7"></a>
## 💻 मॉड्यूल 7: डेवलपर टर्मिनल सीएलआई एवं पावर पैक सिस्टम (Developer Terminal CLI & Power Pack System)

यह मॉड्यूल पोर्टफोलियो के इंटरएक्टिव हैकर/डेवलपर टर्मिनल (`TerminalCLI.jsx`), मल्टी-ओएस स्विचर, टाइफोग्राफी इंजन, और पावर पैक कमांड्स का संपूर्ण विवरण देता है।

### 7.1 घटक विवरण एवं वास्तुकला (Component Details & Architecture)

1. **इंटरएक्टिव टर्मिनल शैल (`TerminalCLI.jsx`):**
   - **ग्लोबल कीबोर्ड शॉर्टकट:** किसी भी समय बैकर्टिक/टिल्ड (`` ` `` / `~`) दबाकर या नेवबार/सब-बार आइकॉन पर क्लिक करके खोला/बंद किया जा सकता है।
   - **मल्टी-ओएस क्रोम स्विचर:** 3 प्रामाणिक डेस्कटॉप थीम्स — **macOS** (रेड/येलो/ग्रीन ट्रैफिक लाइट्स), **Windows 11** (मिनिमाइज/मैक्सिमाइज/क्लोज बटन्स), और **Ubuntu Linux** (ऑरेंज-ऑबर्न विंडो हेडर्स)।
   - **ड्रैग एवं रीसाइज़ इंजन:** टर्मिनल विंडो को व्यूपोर्ट की सीमाओं में कहीं भी ड्रैग किया जा सकता है; बॉटम-राइट कॉर्नर ग्रिप से न्यूनतम 360x260px से लेकर 95vw तक स्वतंत्र रीसाइज़ किया जा सकता है।
   - **सीआरटी एवं मैट्रिक्स सिमुलेशन:** सीआरटी स्कैनलाइन्स और फॉस्फोर ग्लो इफ़ेक्ट; `matrix` कमांड चलाने पर डिजिटल ग्रीन बाइनरी रेन सिमुलेशन।
   - **टाइपोग्राफी एवं बैकग्राउंड कस्टमाइज़ेशन:** 5 फ़ॉन्ट फ़ैमिलीज़, 10-28px डायरेक्ट फ़ॉन्ट साइज, 8 टेक्स्ट कलर्स + हेक्स वैलिडेशन, 15 बैकग्राउंड कलर्स, और 4 ओपेसिटी लेवेल्स (Solid, Default, Glass, Semi)।
   - **पावर पैक कमांड्स (20+ Commands):** `help`, `clear`, `neofetch`, `skills`, `projects`, `exp`, `contact`, `theme`, `role`, `matrix`, `os`, `font`, `size`, `color`, `bgcolor`, `opacity`, `cat`, `ls`, `pwd`, `git log`, `ping`, `cowsay`, `weather`, `fortune`, `sudo hire`, और `reset`।
   - **वेब ऑडियो मैकेनिकल कीक्लिक्स:** टाइपिंग करते समय मैकेनिकल कीबोर्ड के यथार्थवादी क्लिक्स और एरर/सक्सेस बीप्स।

---

### 7.2 मॉड्यूल 7: विस्तृत फ़ीचर एवं फ़ंक्शन तालिका (Detailed Features Table)

| क्र. सं. | फ़ीचर / फ़ंक्शन का नाम | संबंधित फ़ाइल / कंपोनेंट | मुख्य कार्य (Primary Action) | विस्तृत विवरण (Detailed Description) |
| :---: | :--- | :--- | :--- | :--- |
| 7.1 | **Interactive Developer Terminal Shell** | `src/components/TerminalCLI.jsx` | टर्मिनल सीएलआई इंटरफ़ेस प्रस्तुत करना | विंडो कंट्रोल्स (Minimize, Maximize, Close), टास्कबार डॉक पिल और ड्रैगैबल हेडर के साथ टर्मिनल प्रस्तुत करता है। |
| 7.2 | **Backtick / Tilde Global Shortcut** | `src/components/TerminalCLI.jsx`, `App.jsx` | `` ` `` या `~` से टर्मिनल टॉगल करना | जब यूजर किसी टेक्स्ट इनपुट में न हो, तो बैकर्टिक दबाते ही टर्मिनल खुलता है और ऑटो-फोकस होता है। |
| 7.3 | **Multi-OS Desktop Chrome Switcher** | `src/components/TerminalCLI.jsx` | macOS, Windows 11, Ubuntu थीम्स | `os mac`, `os win`, `os ubuntu` कमांड्स से विंडो हेडर, कंट्रोल्स और कमांड प्रॉम्प्ट का रूप बदलता है। |
| 7.4 | **CRT Scanlines & Retro Phosphor Glow** | `src/components/TerminalCLI.jsx` | सीआरटी मॉनिटर विजुअल इफ़ेक्ट | रेट्रो सीआरटी मॉनिटर की तरह स्कैनलाइन्स ओवरले और टेक्स्ट ग्लो प्रदान करता है। |
| 7.5 | **Matrix Digital Rain Simulation** | `src/components/TerminalCLI.jsx` | मैट्रिक्स बाइनरी रेन एनिमेशन | `matrix` कमांड चलाने पर टर्मिनल में 120 FPS ग्रीन डिजिटल कैस्केड शुरू करता है; `Esc` पर बंद होता है। |
| 7.6 | **Viewport-Bounded Window Dragging & Corner Resize** | `src/components/TerminalCLI.jsx` | विंडो को ड्रैग व रीसाइज़ करना | हेडर ड्रैग से स्क्रीन में कहीं भी ले जाएं; बॉटम-राइट ग्रिप से विंडो को छोटा या बड़ा करें। |
| 7.7 | **Terminal Size Presets Engine** | `src/components/TerminalCLI.jsx` | `size sm`, `size md`, `size lg` | 3 मानकीकृत विंडो आकारों (`sm: 480x340`, `md: 680x440`, `lg: 880x560`) में त्वरित रीसाइज़। |
| 7.8 | **Full Typography Engine** | `src/components/TerminalCLI.jsx` | फ़ॉन्ट फ़ैमिली और साइज बदलना | `font jetbrains`, `fira`, `source`, `courier` और `size 10`-`28px` से रीयल-टाइम में टेक्स्ट स्केल करता है। |
| 7.9 | **Terminal Text Color Palette** | `src/components/TerminalCLI.jsx` | 8 कलर्स + कस्टम हेक्स कोड्स | `color green`, `amber`, `cyan`, `matrix`, `rose`, `white`, `purple` या `#hex` से टेक्स्ट कलर बदलना। |
| 7.10 | **Dynamic Background Color Switcher** | `src/components/TerminalCLI.jsx` | 15 बैकग्राउंड कलर्स + हेक्स | `bgcolor dark`, `matrix`, `navy`, `oled`, `carbon` या कस्टम हेक्स से टर्मिनल का बैकग्राउंड बदलना। |
| 7.11 | **Opacity Preset Engine** | `src/components/TerminalCLI.jsx` | सॉलिड, ग्लास व पारदर्शी लेवेल्स | `opacity solid` (1.0), `default` (0.92), `glass` (0.75), `semi` (0.50) या 0.4-1.0 क्लैम्प्ड वैल्यूज। |
| 7.12 | **Neofetch System Information Banner** | `src/components/TerminalCLI.jsx` | सिस्टम व ओएस इंफो प्रदर्शित करना | अतुल वर्मा का ASCII लोगो, ओएस, शेल, रिज़ॉल्यूशन, अपटाइम, और टेक स्टैक का विस्तृत नियोफेच आउटपुट। |
| 7.13 | **Virtual Filesystem Navigation** | `src/components/TerminalCLI.jsx` | `ls`, `cat`, `pwd` कमांड्स | 6 वर्चुअल फाइल्स (`about.txt`, `skills.json`, `projects.md`, `experience.log`, `contact.vcf`, `resume.pdf`) पढ़ना। |
| 7.14 | **Developer Utility Suite** | `src/components/TerminalCLI.jsx` | `git log`, `ping`, `cowsay`, `weather` | रियल गिट कमिट हिस्ट्री, लेटेंसी पिंग सिमुलेशन, काउसै बैलून मैसेज, और लोकल वेदर प्रदर्शित करना। |
| 7.15 | **Autonomous Hiring Protocol** | `src/components/TerminalCLI.jsx` | `sudo hire` कमांड एग्जीक्यूशन | हायरिंग प्रपोजल सक्रिय करता है, संपर्क फ़ॉर्म पर ऑटो-स्क्रॉल करता है और कंफ़ेटी ब्लास्ट उड़ाता है। |
| 7.16 | **Contextual Command Autocomplete & History** | `src/components/TerminalCLI.jsx` | `Tab` ऑटो-कम्प्लीट व हिस्ट्री | `Tab` दबाने पर कमांड्स का स्वतः पूर्ण होना; `ArrowUp`/`ArrowDown` से पिछली कमांड्स को रिकॉल करना। |
| 7.17 | **Procedural Mechanical Keyclick Synthesizer** | `src/components/TerminalCLI.jsx`, `src/utils/audio.js` | कीबोर्ड टाइपिंग ऑडियो फ़ीडबैक | प्रत्येक कीस्ट्रोक पर वेब ऑडियो ऑसिलेटर से क्लिक्स और बैकस्पेस/एंटर पर विशिष्ट साउंड बजाता है। |
| 7.18 | **Minimized Taskbar Pill & Auto-Restore Sync** | `src/components/TerminalCLI.jsx` | टास्कबार में मिनिमाइज करना | टर्मिनल को बॉटम स्क्रीन पर छोटे पिल के रूप में मिनिमाइज करता है और क्लिक पर ऑटो-फोकस के साथ रीस्टोर करता है। |
| 7.19 | **Standalone Fullview Terminal Workspace** | `src/components/TerminalFullView.jsx` | आइसोलेटेड फुलस्क्रीन डेवलपर कंसोल | जब यूजर `viewMode === 'terminal'` चुनता है, तो यह संपूर्ण व्यूपोर्ट को एक डेडिकेटेड डेवलपर टर्मिनल वर्कस्पेस में बदल देता है, जिसमें ज़ीरो डिस्ट्रेक्शन, इनबिल्ट एग्जीक्यूटर और डायरेक्ट पोर्टफोलियो कंट्रोल शामिल हैं। |

---

<a id="module-8"></a>
## 📂 मॉड्यूल 8: केस स्टडीज आर्किटेक्चर एवं लाइव टेलीमेट्री सिमुलेटर (Interactive Case Studies & Telemetry Simulators)

यह मॉड्यूल पोर्टफोलियो के सभी 9 प्रोजेक्ट्स के विस्तृत केस स्टडी डॉसियर्स (`caseStudiesData.js`), स्लाइड-ओवर ड्रॉअर (`CaseStudyDrawer.jsx`), लाइव टेलीमेट्री सिमुलेटर (`CaseStudySimulator.jsx`), और 4-टियर सिस्टम फ्लोचार्ट्स (`CaseStudyArchitecture.jsx`) का विवरण देता है।

### 8.1 घटक विवरण एवं वास्तुकला (Component Details & Architecture)

1. **5-स्टेज केस स्टडी स्टोरीटेलिंग फ्रेमवर्क:**
   - प्रत्येक केस स्टडी को 5 संरचित चरणों में प्रस्तुत किया गया है:
     1. **The Executive Summary & Challenge:** व्यावसायिक संदर्भ, परिचालन बाधाएं और उद्देश्य।
     2. **The Architectural Solution:** तकनीकी रणनीति, मॉड्यूलर रूपरेखा और डेटा पाइपलाइन।
     3. **Tech Stack & Technical Obstacles Overcome:** प्रयुक्त टूल्स, लाइब्रेरीज़ और हल की गई चुनौतियाँ।
     4. **Measurable Production Impact & Metrics:** मात्रात्मक परिणाम (उदा. 99.8% ITC रिकवरी, ₹25Cr+ वॉल्यूम)।
     5. **Retrospective & Lessons Learned:** इंजीनियरिंग और एकाउंटिंग अंतर्दृष्टि।

2. **लाइव टेलीमेट्री सिमुलेटर (`CaseStudySimulator.jsx`):**
   - प्रत्येक प्रोजेक्ट के लिए समर्पित रीयल-टाइम सिमुलेटर इंजन।
   - यूजर 'Run Simulation', 'Process Batch', 'Reconcile ITC' आदि बटन्स दबाकर लाइव स्टेट मशीन ट्रांज़िशन्स, प्रोग्रेस बार्स, और ऑडिट लॉग्स देख सकते हैं।

3. **4-टियर विजुअल सिस्टम आर्किटेक्चर फ्लोचार्ट (`CaseStudyArchitecture.jsx`):**
   - प्रत्येक प्रोजेक्ट की 4-लेयर संरचना — Data Ingestion -> Processing Core -> Business Rules Engine -> Output & Client Interfaces — का इंटरएक्टिव विजुअल फ्लोचार्ट।

4. **यूआरएल डीप-लिंकिंग:** `?project=<id>` पैरामीटर द्वारा किसी भी केस स्टडी को सीधे शेयर या बुकमार्क करने की सुविधा।

---

### 8.2 मॉड्यूल 8: विस्तृत फ़ीचर एवं फ़ंक्शन तालिका (Detailed Features Table)

| क्र. सं. | फ़ीचर / फ़ंक्शन का नाम | संबंधित फ़ाइल / कंपोनेंट | मुख्य कार्य (Primary Action) | विस्तृत विवरण (Detailed Description) |
| :---: | :--- | :--- | :--- | :--- |
| 8.1 | **Complete 9-Project Case Study Dossiers** | `src/data/caseStudiesData.js` | 9 प्रमुख परियोजनाओं का डॉसियर डेटाबेस | PolicyGuard AI, ApexPay, DAY-NULM, Smart Card Ops, Power BI, Financial Controls, SaaS Generator, Multi-Agent Engine, Document Synthesizer का संपूर्ण डेटा। |
| 8.2 | **5-Stage Storytelling Architectural Framework** | `src/data/caseStudiesData.js`, `CaseStudyDrawer.jsx` | मानकीकृत 5-चरणीय केस स्टडी विवरण | Executive Challenge -> Architectural Solution -> Tech Stack -> Measurable Impact -> Lessons Learned के आधार पर प्रस्तुतीकरण। |
| 8.3 | **Live Interactive Telemetry Simulators** | `src/components/CaseStudySimulator.jsx` | रीयल-टाइम प्रोजेक्ट टेलीमेट्री सिमुलेशन | लाइव एग्जीक्यूशन बटन्स, स्टेट मशीन ट्रांज़िशन्स, कलर्ड लॉग्स, और प्रोग्रेस बार्स के साथ प्रोजेक्ट का लाइव टेस्ट। |
| 8.4 | **4-Tier Visual System Architecture Flowcharts** | `src/components/CaseStudyArchitecture.jsx` | 4-स्तरीय तकनीकी फ्लोचार्ट दिखाना | Data Source -> Processing Core -> Business Rules -> Presentation Layer का इंटरएक्टिव विजुअल सिस्टम मैप। |
| 8.5 | **Slide-Over Case Study Drawer Shell** | `src/components/CaseStudyDrawer.jsx` | फुल-हाइट स्मूथ ड्रॉअर प्रस्तुतीकरण | बैकड्रॉप ब्लर, WAI-ARIA डायलॉग, कीबोर्ड ट्रैपिंग (`useFocusTrap`) और बॉडी स्क्रॉल लॉक के साथ दाईं ओर से ड्रॉअर खुलता है। |
| 8.6 | **Bi-Directional URL Deep Linking** | `src/components/CaseStudyDrawer.jsx`, `App.jsx` | `?project=<id>` शेयर करने योग्य लिंक्स | किसी भी केस स्टडी को खोलने पर URL अपडेट करता है; लिंक खोलने पर सीधे वही केस स्टडी ड्रॉअर खुलता है। |
| 8.7 | **PolicyGuard AI Tax Compliance Dossier** | `src/data/caseStudiesData.js` | जीएसटी एवं आईटीसी ऑडिट केस स्टडी | 500+ जीएसटी फाइलिंंग्स, शून्य डिफ़ॉल्ट पेनल्टी, और GSTR-2B ऑटो-मैचिंग की विस्तृत केस स्टडी और सिमुलेटर। |
| 8.8 | **ApexPay Financial Accounting Dossier** | `src/data/caseStudiesData.js` | दोहरा लेखा एवं बीआरएस मिलान केस स्टडी | ₹25Cr+ वार्षिक टर्नओवर, 100% बीआरएस सटीकता, और टैली प्राइम वाउचर ऑटोमेशन का संपूर्ण आर्किटेक्चर। |
| 8.9 | **DAY-NULM Skill India MIS Portal Dossier** | `src/data/caseStudiesData.js` | राष्ट्रीय शहरी आजीविका मिशन डॉसियर | 1,200+ उम्मीदवारों का ट्रैकिंग पोर्टल, सरकारी डायरेक्ट बेनिफिट ट्रांसफर (DBT) और आधार बायोमेट्रिक इंटीग्रेशन। |
| 8.10 | **Multi-District Smart Card Operations Dossier** | `src/data/caseStudiesData.js` | बहु-जिला स्मार्ट कार्ड एवं पीवीसी डॉसियर | 50,000+ पीवीसी स्मार्ट कार्ड्स का सुरक्षित एन्क्रिप्शन, बारकोड मैपिंग और जिला-स्तरीय आपूर्ति श्रृंखला का विवरण। |
| 8.11 | **Executive Power BI Fiscal Intelligence Dossier**| `src/data/caseStudiesData.js` | कार्यकारी वित्तीय एनालिटिक्स डैशबोर्ड | DAX फॉर्मूलास, बैलेंस शीट वेरियंस मॉडल्स, और कार्यकारी निर्णय समर्थन प्रणाली का गहन तकनीकी डॉसियर। |
| 8.12 | **Corporate Financial Controls Governance Dossier**| `src/data/caseStudiesData.js`| आंतरिक वित्तीय नियंत्रण एवं ऑडिट डॉसियर | आईसीओएफआर अनुपालन, सोक्स-शैली नियंत्रण, आंतरिक ऑडिट चेकलिस्ट और जोखिम न्यूनीकरण का डॉसियर। |
| 8.13 | **AI Prompt-to-Fullstack SaaS Generator Dossier** | `src/data/caseStudiesData.js` | स्वायत्त वेब ऐप निर्माण इंजन डॉसियर | प्राकृतिक भाषा प्रॉम्प्ट से संपूर्ण रिएक्ट व नोड स्टैक तैयार करने वाले स्वायत्त इंजन का विस्तृत विश्लेषण। |
| 8.14 | **Autonomous Multi-Agent Workflow Engine Dossier**| `src/data/caseStudiesData.js` | बहु-एजेंट आर्केस्ट्रेशन सिस्टम डॉसियर | सीलिंग-रहित सब-एजेंट डेलिगेशन, पैरेलल डिस्पैच और स्वचालित वेरिफिकेशन लूप्स का तकनीकी केस स्टडी। |
| 8.15 | **Real-Time AI Document Synthesizer Dossier** | `src/data/caseStudiesData.js` | रीयल-टाइम डॉक्युमेंट एवं कोड इंजन | पीडीएफ, मार्कडाउन और स्प्रेडशीट डेटा को स्वायत्त रूप से विश्लेषित करके सारांशित करने वाले टूल का डॉसियर। |

---

<a id="module-9"></a>
## 🌐 मॉड्यूल 9: बहुभाषी स्थानीयकरण एवं वॉइस कोऑर्डिनेशन (Multilingual Localization & Translation System)

यह मॉड्यूल पोर्टफोलियो के संपूर्ण द्विभाषी स्थानीयकरण (English ⇄ Hindi), ट्रांसलेशन डिक्शनरी (`translations.js`), लैंग्वेज प्रोवाइडर (`LanguageContext.jsx`), और स्क्रीन रीडर वॉयस कोऑर्डिनेशन का विवरण प्रस्तुत करता है।

### 9.1 घटक विवरण एवं वास्तुकला (Component Details & Architecture)

1. **लैंग्वेज कॉन्टेक्स्ट प्रोवाइडर (`LanguageContext.jsx`):**
   - संपूर्ण पोर्टफोलियो में भाषा की स्थिति ('en' vs 'hi') का केंद्रीय प्रबंधन।
   - `localStorage` की `'portfolio_language'` में सुरक्षित और रीलोड पर रीस्टोर।
   - `document.documentElement.lang` को 'en' या 'hi' में तत्काल सिंक्रनाइज़ करता है।
   - भाषा बदलने पर स्क्रीन रीडर्स के लिए द्विभाषी घोषणा ("Language switched to Hindi" / "भाषा बदलकर अंग्रेज़ी कर दी गई है") प्रसारित करता है।

2. **450+ कीज का व्यापक अनुवाद शब्दकोश (`translations.js`):**
   - **हाइब्रिड ब्रांड प्रिजर्वेशन:** तकनीकी और अंतर्राष्ट्रीय शब्दों (उदा. React, Tally Prime, GST, API, GitHub, Lucide) को अंग्रेजी लिपि में सुरक्षित रखते हुए उनके विवरणों, लेबल्स और व्याख्याओं को शुद्ध, स्पष्ट हिंदी में प्रस्तुत करता है।
   - सेक्शन्स, नेवबार, हेरो, स्किल्स, एक्सपीरियंस, प्रोजेक्ट्स, अचीवमेंट्स, कांटेक्ट (सभी 4 टैब्स), एफएक्यू, और कमांड पैलेट का संपूर्ण 100% अनुवाद।

---

### 9.2 मॉड्यूल 9: विस्तृत फ़ीचर एवं फ़ंक्शन तालिका (Detailed Features Table)

| क्र. सं. | फ़ीचर / फ़ंक्शन का नाम | संबंधित फ़ाइल / कंपोनेंट | मुख्य कार्य (Primary Action) | विस्तृत विवरण (Detailed Description) |
| :---: | :--- | :--- | :--- | :--- |
| 9.1 | **Language Context Provider & Global State** | `src/context/LanguageContext.jsx` | द्विभाषी अवस्था ('en' ⇄ 'hi') का प्रबंधन | पूरे रिएक्ट ट्री को `language`, `setLanguage`, `toggleLanguage`, और अनुवाद हेल्पर `t()` प्रदान करता है। |
| 9.2 | **450+ Key Bilingual Translation Registry** | `src/data/translations.js` | संपूर्ण पोर्टफोलियो का ट्रांसलेशन डेटा | सभी नेविगेशन, शीर्षकों, उप-शीर्षकों, बटनों, फ़ॉर्म लेबल्स और एरर संदेशों का मानकीकृत अंग्रेजी-हिंदी शब्दकोश। |
| 9.3 | **Hybrid Technical Term Preservation** | `src/data/translations.js` | तकनीकी शब्दों की अखंडता सुरक्षित रखना | Tally, GST, React, Vite, BRS, API जैसे तकनीकी और वित्तीय शब्दों को अंग्रेजी लिपि में रखते हुए हिंदी अनुवाद करता है। |
| 9.4 | **Navbar & Drawer 1-Click Language Switcher** | `src/components/Navbar.jsx` | नेवबार में भाषा बदलने का पिल बटन | डेस्कटॉप और मोबाइल नेवबार में 1-क्लिक 'EN ⇄ HI' बटन; क्लिक करने पर स्पार्कल साउंड और तत्काल री-रेंडर। |
| 9.5 | **HTML Root Attribute Synchronization** | `src/context/LanguageContext.jsx` | `<html lang="...">` टैग को अपडेट करना | भाषा बदलने पर तत्काल DOM के रूट पर `lang="hi"` या `lang="en"` सेट करता है ताकि ब्राउज़र और ट्रांसलेटर्स सही व्यवहार करें। |
| 9.6 | **WAI-ARIA Bilingual Voice Coordination** | `src/context/LanguageContext.jsx`, `AnnouncerContext.jsx` | स्क्रीन रीडर पर भाषा घोषणा | भाषा बदलने पर दृष्टिबाधित उपयोगकर्ताओं को दोनों भाषाओं में ऑडियो घोषणा सुनाता है। |
| 9.7 | **Full-Spectrum Section Localization** | All Section Components | मुख्य पृष्ठ के सभी सेक्शन्स का अनुवाद | Hero, About, Skills, Experience, Projects, Achievements, और Footer के प्रत्येक टेक्स्ट एलिमेंट का गतिशील अनुवाद। |
| 9.8 | **Contact 4-Tab & Estimator Full Bilingual Support**| `src/components/ContactSection.jsx` | संपर्क व कोटेशन का पूर्ण अनुवाद | पूछताछ फ़ॉर्म, कोटेशन स्लाइडर्स, डायरेक्ट कार्ड, और मेदिनीनगर लोकेशन पैनल का संपूर्ण हिंदी रूपांतरण। |
| 9.9 | **FAQ Section Bilingual Dynamic Rendering** | `src/components/FAQSection.jsx` | एफएक्यू प्रश्नों का द्विभाषी प्रदर्शन | सभी 40 प्रश्नों, उत्तरों, ऑडियंस टैग्स और कैटेगरी चिप्स को सक्रिय भाषा के अनुसार प्रस्तुत करता है। |
| 9.10 | **LocalStorage Language Persistence** | `src/context/LanguageContext.jsx` | उपयोगकर्ता की भाषा पसंद को याद रखना | `'portfolio_language'` कुंजी के माध्यम से यूजर की चुनी गई भाषा को ब्राउज़र में सुरक्षित रखता है। |
| 9.11 | **Master Bilingual Skills Data Registry** | `src/data/skillsData.js` | 37+ दक्षताओं का द्विभाषी कॉन्फ़िगरेशन | अकाउंटिंग (Tally Prime, GST, BRS), वेब डेवलपमेंट (React, Node, Vite), ऑफिस टूल्स (Advanced Excel, Word) और एआई टूल्स की सभी 37+ दक्षताओं का श्रेणीबद्ध, विस्तृत विवरण, प्रोफिशिएंसी स्कोर और द्विभाषी मेटाडेटा। |

---

<a id="module-10"></a>
## 👥 मॉड्यूल 10: ऑडियंस व्यक्तित्व फ़िल्टर एवं व्यू मोड सिस्टम (Audience Persona Filter & View Mode Engine)

यह मॉड्यूल आगंतुक व्यक्तित्व फ़िल्टर (Audience Persona View Filter) और 4-स्तरीय व्यू मोड सिस्टम (View Mode 4-Tier Switcher) का पूर्ण तकनीकी विवरण देता है।

### 10.1 घटक विवरण एवं वास्तुकला (Component Details & Architecture)

1. **ऑडियंस व्यक्तित्व फ़िल्टर (`AudienceContext.jsx`, `AudienceFloatingPill.jsx`, `AudienceSubBar.jsx`):**
   - **4 आगंतुक व्यक्तित्व:**
     1. **All (No Filter):** संपूर्ण पोर्टफोलियो का समग्र प्रदर्शन।
     2. **Recruiter / Job:** एचआर और रिक्रूटर्स के लिए सीवी डाउनलोड, अकादमिक क्रेडेंशियल्स और अनुभव को प्राथमिकता।
     3. **Freelance Client / SME Owner:** फ्रीलांस ग्राहकों के लिए केस स्टडीज, कोटेशन कैलकुलेटर और टेस्टिमोनियल्स को प्राथमिकता।
     4. **Marriage / Matrimonial:** वैवाहिक प्रस्तावों के लिए परिवार, पृष्ठभूमि, मूल्यों और बायो-डेटा का गरिमापूर्ण प्रदर्शन।
   - **पोर्टल-माउंटेड ड्रैगैबल कार्ड (`AudienceFloatingPill.jsx`):** `document.body` में रेंडर होता है, 12px स्क्रीन बाउंड्री क्लैंपिंग, रीयल-टाइम कर्सर स्पॉटलाइट चमक, और रीसेट बटन।
   - **यूआरएल सिंक:** `?audience=recruiter` आदि के साथ पूर्ण सिंक्रनाइज़ेशन।

2. **4-स्तरीय व्यू मोड सिस्टम (`ViewModeContext.jsx`, `ViewModeFloatingPill.jsx`, `ViewModeSubBar.jsx`):**
   - **4 व्यू मोड्स:**
     1. **Basic / PDF Mode (`basic` / `बेसिक / PDF`):** अति-सरल, उच्च-घनत्व प्रिंट और एटीएस-अनुकूल लेआउट।
     2. **Simple / Classic Mode (`simple` / `सिंपल / क्लासिक`):** बिना 3D या पार्टिकल्स का पठन-अनुकूल क्लासिक लेआउट।
     3. **Modern / Interactive Mode (`modern` / `मॉडर्न / इंटरैक्टिव`):** 120 FPS कर्सर काइनेमैटिक्स, 2.5D हेरो ट्रैकिंग और फुल ऑडियो।
     4. **Terminal / Developer Mode (`terminal` / `टर्मिनल / डेवलपर`):** सीएलआई डेवलपर्स के लिए सीधे टर्मिनल लॉन्च।
   - **ड्यूल-डिस्क्रिप्टर लेबल्स:** अंग्रेजी और हिंदी दोनों में मानकीकृत ड्यूल लेबल्स।
   - **यूआरएल सिंक:** `?view=modern` आदि के साथ सिंक्रनाइज़ेशन।

---

### 10.2 मॉड्यूल 10: विस्तृत फ़ीचर एवं फ़ंक्शन तालिका (Detailed Features Table)

| क्र. सं. | फ़ीचर / फ़ंक्शन का नाम | संबंधित फ़ाइल / कंपोनेंट | मुख्य कार्य (Primary Action) | विस्तृत विवरण (Detailed Description) |
| :---: | :--- | :--- | :--- | :--- |
| 10.1 | **4-Persona Audience Filter State** | `src/context/AudienceContext.jsx` | आगंतुक के अनुसार सामग्री छांटना | All, Recruiter, Client, और Matrimonial व्यक्तित्वों का प्रबंधन करता है; URL और लोकल स्टोरेज सिंक रखता है। |
| 10.2 | **Draggable Glassmorphic Audience Floating Pill** | `src/components/AudienceFloatingPill.jsx` | फ्लोटिंग ऑडियंस सेलेक्टर कार्ड | स्क्रीन के बॉटम-राइट में ड्रैगैबल ग्लास कार्ड; 4 विकल्पों के सीधे चयन बटन और एक्टिव चेकमार्क्स दिखाता है। |
| 10.3 | **React Portal Body Mounting** | `src/components/AudienceFloatingPill.jsx` | कंटेनिंग ब्लॉक इश्यू को हल करना | `createPortal(..., document.body)` का उपयोग करता है ताकि पैरेंट CSS ट्रांसफ़ॉर्म से कार्ड की पोज़ीशन विकृत न हो। |
| 10.4 | **Pointer Capture Drag Engine & 12px Clamping** | `src/components/AudienceFloatingPill.jsx` | सुरक्षित ड्रैग और स्क्रीन सीमा सुरक्षा | `setPointerCapture` द्वारा स्मूथ ड्रैगिंग; स्क्रीन के किनारों से 12px की सुरक्षित दूरी बनाए रखता है। |
| 10.5 | **Cursor-Tracking Spotlight Shine & Row Animation**| `src/components/AudienceFloatingPill.jsx`, `src/index.css` | इंटरएक्टिव लाइट और स्टैगर एनीमेशन | माउस कर्सर की दिशा में लाइट/डार्क रेडियल ग्रेडिएंट चमक और खुलते समय `.animate-pill-row` स्टैगर एनीमेशन। |
| 10.6 | **Matrimonial Persona Biodata Presentation** | `src/context/AudienceContext.jsx`, `src/data/faqConfig.js` | वैवाहिक प्रोफाइल जानकारी | पारिवारिक पृष्ठभूमि, सांस्कृतिक मूल्य, और सत्यापित बायो-डेटा को प्राथमिकता से प्रस्तुत करता है। |
| 10.7 | **Audience Persona URL Synchronization** | `src/context/AudienceContext.jsx` | `?audience=...` पैरामीटर सिंक | व्यक्तित्व बदलने पर पेज रीलोड किए बिना URL अपडेट करता है; शेयरेबल लिंक्स बनाने में सक्षम। |
| 10.8 | **View Mode 4-Tier State Management** | `src/context/ViewModeContext.jsx` | 4 व्यू मोड्स का केंद्रीय प्रबंधन | Basic, Simple, Modern, और Terminal मोड्स का नियंत्रण, SimpleModeContext और Terminal इवेंट्स के साथ समन्वय। |
| 10.9 | **Dual-Descriptor Aligned Bilingual Labels** | `src/context/ViewModeContext.jsx` | मानकीकृत दोहरे लेबल्स | Basic / PDF, Simple / Classic, Modern / Interactive, Terminal / Developer के स्पष्ट द्विभाषी लेबल्स। |
| 10.10 | **Draggable View Mode Floating Pill** | `src/components/ViewModeFloatingPill.jsx` | ड्रैगैबल व्यू मोड फ्लोटिंग कार्ड | पोर्टल-माउंटेड, ड्रैगैबल हैंडल, रोटेट-रीसेट बटन, और कर्सर-ट्रैकिंग स्पॉटलाइट चमक युक्त सेलेक्टर कार्ड। |
| 10.11 | **View Mode Sub-Bar & Drawer Variant** | `src/components/ViewModeSubBar.jsx` | नेवबार के नीचे व्यू मोड रिबन | नेवबार कैप्सूल के नीचे फ्लोटिंग बार और मोबाइल ड्रॉअर के अंदर 4-बटन कार्ड के रूप में प्रस्तुत होता है। |
| 10.12 | **View Mode URL Synchronization** | `src/context/ViewModeContext.jsx` | `?view=...` पैरामीटर सिंक | व्यू मोड बदलने पर बिना रीफ्रेश के URL अपडेट करता है; सीधे व्यू मोड में वेबसाइट खोलने की सुविधा देता है। |
| 10.13 | **Drawer & Floating Pills Mutual Exclusivity** | `FloatingActionHub.jsx`, `LabStudioDrawer.jsx` | पैनल्स के टकराव को रोकना | लैब ड्रॉअर खुलने पर फ्लोटिंग पिल्स बंद हो जाती हैं; पिल्स पर क्लिक करने पर लैब ड्रॉअर बंद हो जाता है। |
| 10.14 | **Zero-Tooltip Clean UI Policy** | `AudienceFloatingPill.jsx`, `ViewModeFloatingPill.jsx` | क्लटर-मुक्त ड्रैग अनुभव | फ्लोटिंग पिल्स पर नेटिव टाइटल और होवर टूलटिप्स को पूरी तरह हटाकर एक स्वच्छ, पेशेवर स्पर्श अनुभव देता है। |
| 10.15 | **Draggable Career Track Floating Pill** | `src/components/RoleFloatingPill.jsx` | फ्लोटिंग करियर ट्रैक / रोल स्विचर | स्क्रीन पर कहीं भी ड्रैग करने योग्य ग्लास कार्ड, जिसके माध्यम से यूजर त्वरित रूप से अपने पसंदीदा करियर ट्रैक ('Accountant & GST Specialist' vs 'Full-Stack Developer') को स्विच या फ़िल्टर कर सकता है। |
| 10.16 | **Isolated Zero-Distraction Paginated Document/PDF Viewer Mode** | `src/components/BasicPDFViewer.jsx` | बेसिक / पीडीएफ व्यू मोड डिस्प्ले | जब यूजर `viewMode === 'basic'` चुनता है, तो यह संपूर्ण वेबसाइट को एक उच्च-घनत्व, प्रिंट-रेडी, एटीएस-अनुकूल पजिनेटेड डॉक्यूमेंट/पीडीएफ लेआउट में बदल देता है, जिसमें से सभी 3D और मोशन लेयर्स सुरक्षित रूप से बाईपास हो जाती हैं। |

---

<a id="module-11"></a>
## ⚡ मॉड्यूल 11: सेंट्रलाइज्ड मास्टर फ्लोटिंग एक्शन हब एवं एआई चैट असिस्टेंट (Floating Action Hub & AI Chat Widget)

यह मॉड्यूल पोर्टफोलियो के सेंट्रलाइज्ड मास्टर स्पीड-डायल फ्लोटिंग एक्शन हब (`FloatingActionHub.jsx`) और ग्लोबल एआई चैट असिस्टेंट (`AIChatWidget.jsx`) का विवरण देता है।

### 11.1 घटक विवरण एवं वास्तुकला (Component Details & Architecture)

1. **सेंट्रलाइज्ड मास्टर फ्लोटिंग एक्शन हब (`FloatingActionHub.jsx`):**
   - **स्पीड-डायल मास्टर FAB:** पुराने अलग-अलग बिखरे हुए फ्लोटिंग बटनों को एक सुरुचिपूर्ण मास्टर बटन में समेटता है।
   - **आइसोलेटेड आइकॉन रोटेशन:** मास्टर बटन का बेस कंटेनर स्थिर रहता है, केवल आइकॉन 45° घूमता है (`Layers` -> `X`), जिससे द्विभाषी क्षैतिज टूलटिप्स कभी टेढ़ी नहीं होतीं।
   - **रिवर्स-फ्लेक्स वर्टिकल स्टैक (`flex-col-reverse`):** मास्टर बटन के ऊपर क्रमबद्ध रूप से एक्शन बटन्स खुलते हैं: WhatsApp -> View Mode -> Audience Filter -> AI Chat -> Control Center FAB।
   - **डायनामिक स्पेसियल ग्लाइड:** जब लैब ड्रॉअर खुलता है, तो यह बटन स्वतः स्मूथली बाईं ओर खिसक जाता है (`sm:right-[460px]`) ताकि कोई ओवरलैप न हो।

2. **ग्लोबल एआई चैट असिस्टेंट (`AIChatWidget.jsx`):**
   - **बॉटम-डॉक्ड स्टेशन आर्किटेक्चर:** स्क्रीन के बॉटम पर शून्य-गैप डॉक्ड स्टेशन (`bottom-0`, `rounded-t-2xl`, offset `sm:right-28`)।
   - **मिनिमाइज्ड डॉक टैब:** मिनिमाइज करने पर बॉटम में 13px की स्लीक टैब बन जाता है; 1-क्लिक में रीस्टोर होता है।
   - **तत्काल ज्ञानकोश:** अतुल वर्मा के 7+ वर्षों के एकाउंटिंग, टैक्स, एमआईएस और कोडिंग प्रोजेक्ट्स का विस्तृत ज्ञान।
   - **प्रॉम्प्ट चिप्स एवं स्ट्रीमिंग टाइपिंग:** सुझाए गए प्रश्न चिप्स, टाइपिंग एनीमेशन, और Lucide `BotMessageSquare` ब्रांडिंग।
   - **ड्रॉअर क्लीयरेंस ऑफसेट:** लैब ड्रॉअर खुलने पर स्वतः `sm:right-[540px]` पर खिसक कर 24px का सुरक्षित गैप बनाता है।

---

### 11.2 मॉड्यूल 11: विस्तृत फ़ीचर एवं फ़ंक्शन तालिका (Detailed Features Table)

| क्र. सं. | फ़ीचर / फ़ंक्शन का नाम | संबंधित फ़ाइल / कंपोनेंट | मुख्य कार्य (Primary Action) | विस्तृत विवरण (Detailed Description) |
| :---: | :--- | :--- | :--- | :--- |
| 11.1 | **Unified Speed-Dial Master FAB Engine** | `src/components/FloatingActionHub.jsx` | सभी फ्लोटिंग टूल्स का एकीकरण | स्क्रीन के बॉटम-राइट में एक मास्टर बटन जो क्लिक करने पर सभी टूल्स का स्पीड-डायल मेनू खोलता है। |
| 11.2 | **Unrotated Base Geometry & Isolated Icon Spin** | `src/components/FloatingActionHub.jsx` | टूलटिप के झुकाव को रोकना | मास्टर बटन का आउटर कंटेनर सीधा रहता है; केवल अंदर का आइकॉन स्मूथली घूमता है, जिससे टूलटिप्स हमेशा क्षैतिज रहती हैं। |
| 11.3 | **Horizontal Tooltip Orientation & Bilingual Text**| `src/components/FloatingActionHub.jsx` | स्पष्ट क्षैतिज टेक्स्ट टूलटिप्स | प्रत्येक बटन के बाईं ओर अंग्रेजी और हिंदी में हॉरिजॉन्टल टूलटिप दिखाता है (`right-full mr-3.5`)। |
| 11.4 | **Reverse-Flex Vertical Speed-Dial Stacking** | `src/components/FloatingActionHub.jsx` | बटनों का लंबवत ऊपर की ओर खुलना | `flex-col-reverse` लेआउट के साथ बटनों को नीचे से ऊपर की दिशा में करीने से प्रदर्शित करता है। |
| 11.5 | **Drawer-Synchronized Spatial Gliding** | `src/components/FloatingActionHub.jsx` | ड्रॉअर खुलने पर ऑटो-ग्लाइडिंग | लैब कंट्रोल सेंटर ड्रॉअर खुलते ही यह बटन स्वतः `sm:right-[460px]` पर सरक जाता है ताकि ड्रॉअर के पीछे न छिपे। |
| 11.6 | **Explicit User-Initiated Toggle Discipline** | `src/components/FloatingActionHub.jsx` | अनपेक्षित ऑटो-क्लोज से सुरक्षा | केवल उपयोगकर्ता के जानबूझकर क्लिक करने पर ही हब बंद होता है; स्क्रॉल या पेज क्लिक से बंद नहीं होता। |
| 11.7 | **Conversational AI Portfolio Assistant Engine** | `src/components/AIChatWidget.jsx` | बुद्धिमान संवादात्मक एआई चैट | अतुल वर्मा के करियर, टैक्स नियमों, टैली, और प्रोजेक्ट्स के बारे में किसी भी सवाल का तत्काल जवाब देता है। |
| 11.8 | **Zero-Gap Bottom-Docked Station Architecture** | `src/components/AIChatWidget.jsx` | नीचे डॉक की गई आधुनिक खिड़की | स्क्रीन के नीचे `bottom-0` पर स्थित आधुनिक डॉक्ड स्टेशन (`rounded-t-2xl`, `sm:right-28`); मोबाइल पर पूर्ण बॉटम शीट। |
| 11.9 | **Minimized Dock Station Tab & One-Click Restore** | `src/components/AIChatWidget.jsx` | 1-क्लिक में मिनिमाइज व रीस्टोर | मिनिमाइज करने पर बॉटम में स्लीक टैब बन जाता है; क्लिक करने पर तुरंत पूरी चैट हिस्ट्री के साथ खुलता है। |
| 11.10 | **Interactive Suggested Prompt Chips & Streamer** | `src/components/AIChatWidget.jsx` | त्वरित प्रश्न चिप्स व टाइपिंग सिमुलेशन | "Tell me about Tax experience", "Calculate project quote" जैसे चिप्स और रीयल-टाइम टाइपिंग का आभास देता है। |
| 11.11 | **Lucide BotMessageSquare Consistent Branding** | `src/components/AIChatWidget.jsx`, `FloatingActionHub.jsx` | मानकीकृत बॉट आइकॉन | हेडर अवतार, फ्लोटिंग बटन, डॉक्ड टैब और चैट बबल में मानकीकृत `BotMessageSquare` आइकॉन प्रस्तुत करता है। |
| 11.12 | **AIChatWidget Drawer Clearance Offset Safeguard** | `src/components/AIChatWidget.jsx` | ड्रॉअर के साथ शून्य-ओवरलैप सुरक्षा | लैब ड्रॉअर खुला होने पर यह विजेट स्वतः `sm:right-[540px]` पर शिफ्ट होकर 24px का सुरक्षित क्लीयरेंस गैप बनाए रखता है। |
| 11.13 | **Multi-Stage Onboarding & Contextual Response Decision Tree Engine** | `src/components/AIChatWidget.jsx`, `src/utils/portfolioAssistantEngine.js` | इंटरएक्टिव ऑनबोर्डिंग एवं डिसीजन ट्री | चैट विंडो में इंटरएक्टिव डिसीजन ट्री रेंडरिंग — विज़िटर के आते ही रोल और ऑडियंस व्यक्तित्व (Recruiter, Client, Marriage, Explorer) के 1-क्लिक क्विक चिप्स प्रस्तुत करता है और फॉलो-अप प्रश्नों पर प्रासंगिक नेक्स्ट-स्टेप विकल्प प्रदान करता है। |
| 11.14 | **Persona-Tuned Dynamic Emoji Customizer & Clean Mode Strip Engine** | `src/components/AIChatWidget.jsx`, `src/utils/portfolioAssistantEngine.js` | आगंतुक व्यक्तित्व-अनुकूलित इमोजी इंजन | शीर्ष हेडर में 1-क्लिक इमोजी टॉगल बटन (`Sparkles`/`SparklesOff`), जो ऑडियंस व्यक्तित्व के अनुसार इमोजी घनत्व को अनुकूलित करता है (रिक्रूटर हेतु न्यूट्रल मिनिमल, वाइब कोडर हेतु वाइब्रेंट), तथा बंद करने पर सभी इमोजी यूनिकोड वर्णों को स्वच्छ रूप से स्ट्रिप करता है। |
| 11.15 | **Multiline Clean Paragraph Parsing & Asterisk / Bullet Stripper** | `src/components/AIChatWidget.jsx`, `src/utils/portfolioAssistantEngine.js` | स्वच्छ बहु-पंक्ति पैराग्राफ रेंडरिंग | एआई प्रतिक्रियाओं को मल्टी-पैराग्राफ `<p className="leading-relaxed">` ब्लॉक्स में विभाजित करता है, तथा `cleanMarkdownAsterisks` द्वारा कच्चे मार्कडाउन एस्टरिस्क (`***`, `**`, `*`), बुलेट पॉइंट्स (`•`, `*`, `-`) और अतिरिक्त लाइन-ब्रेक्स को स्वतः हटाकर सुरुचिपूर्ण टाइपोग्राफी प्रदान करता है। |
| 11.16 | **Collapsible Quick Prompts Carousel Drawer with Chevron Toggle** | `src/components/AIChatWidget.jsx` | त्वरित प्रश्न चिप्स का कोलैप्सेबल ड्रॉअर | 10 त्वरित प्रश्न चिप्स वाले पैनल को आवश्यकतानुसार दिखाने या छिपाने हेतु समर्पित `ChevronUp`/`ChevronDown` टॉगल बटन, जिससे पढ़ने हेतु संदेश क्षेत्र स्वतः विस्तृत हो जाता है और उपयोगकर्ता को अधिकतम स्पेस मिलता है। |
| 11.17 | **Horizontal Draggable & Scrollable Prompt Chips Carousel** | `src/components/AIChatWidget.jsx` | माउस ड्रैग व स्क्रॉल प्रॉम्प्ट चिप्स | माउस ड्रैग (`handleChipsMouseDown`, `handleChipsMouseMove`, `handleChipsMouseUp`) और बाएँ/दाएँ तीरों (`ChevronLeft`/`ChevronRight`) के साथ 10 प्रॉम्प्ट चिप्स का अत्यंत सहज और स्पर्श-सुलभ क्षैतिज कैरोसेल। |
| 11.18 | **Inline Custom Prompt Input Form ("Other") with Dynamic Query Dispatch** | `src/components/AIChatWidget.jsx` | डिसीजन ट्री में इनलाइन कस्टम क्वेरी इनपुट | डिसीजन ट्री में "✏️ Other" चुनने पर चैट बबल के भीतर ही इनलाइन टेक्स्ट इनपुट फ़ॉर्म खोलता है, जिसमें यूजर अपनी इच्छित कस्टम क्वेरी लिखकर सीधे सबमिट कर सकता है। |
| 11.19 | **Dedicated Full-Width Single-Column Decision Tree Skip Action** | `src/components/AIChatWidget.jsx` | समर्पित पूर्ण-चौड़ाई स्किप बटन | डिसीजन ट्री चिप्स के नीचे समर्पित पूर्ण-चौड़ाई 1-कॉलम "⏩ Skip" बटन (`msg.decisionTree.options?.some(chip => chip.isSkip)`), जो बिना किसी बाधा के डिसीजन ट्री को बंद करके इनपुट बॉक्स पर फोकस वापस ले आता है। |
| 11.20 | **Bi-Directional Persona & Role Synchronization with Instant Chat Action Handlers** | `src/components/AIChatWidget.jsx`, `src/context/RoleContext.jsx`, `src/context/AudienceContext.jsx` | चैट से सीधे रोल, ऑडियंस व केस स्टडी खोलना | चैट बबल में दिए गए बटन्स पर क्लिक करके सीधे पोर्टफोलियो का सक्रिय रोल (`selectRole`), ऑडियंस मोड (`setAudience`), केस स्टडी डॉसियर (`openProjectCaseStudy`), या कोटेशन एस्टीमेटर तुरंत सक्रिय करता है। |

---

<a id="module-12"></a>
## ❓ मॉड्यूल 12: 40-आइटम FAQ सूचना प्रणाली एवं एसईओ स्ट्रक्चर्ड डेटा (FAQ System & Schema.org JSON-LD)

यह मॉड्यूल 40-आइटम द्विभाषी ज्ञानकोश (`faqConfig.js`), 2-स्तरीय फ़िल्टरिंग एकॉर्डियन (`FAQSection.jsx`), और सर्च इंजन ऑप्टिमाइज़ेशन हेतु Schema.org स्ट्रक्चर्ड डेटा का विवरण देता है।

### 12.1 घटक विवरण एवं वास्तुकला (Component Details & Architecture)

1. **40-आइटम द्विभाषी ज्ञानकोश डेटासेट (`faqConfig.js`):**
   - 4 ऑडियंस व्यक्तित्वों (All, Recruiter, Client, Matrimonial) और 3 व्यावसायिक रोल्स (Senior Accountant, MIS Executive, Vibe Coder) में फैले 40 अत्यधिक व्यावहारिक प्रश्न-उत्तर।
   - प्रत्येक आइटम में अंग्रेजी और हिंदी में पूर्ण प्रश्न व उत्तर, ऑडियंस टैग, रोल टैग, और श्रेणी (Taxation, Compliance, Analytics, Development, Marriage) शामिल है।

2. **2-स्तरीय फ़िल्टरिंग एवं लाइव सर्च (`FAQSection.jsx`):**
   - **लेवल 1:** ऑडियंस व्यक्तित्व टैब्स (All, Recruiter, Client, Matrimonial)।
   - **लेवल 2:** रोल सब-टैब्स (Senior Accountant, MIS Executive, Vibe Coder)।
   - **लाइव कीवर्ड सर्च:** टाइप करते ही तत्काल प्रश्नों और उत्तरों में रियल-टाइम फ़िल्टरिंग।
   - **डायनामिक टेलीमेट्री काउंटर:** वर्तमान फ़िल्टर के तहत उपलब्ध प्रश्नों की संख्या प्रदर्शित करता है।
   - **Schema.org FAQPage JSON-LD:** गूगल और अन्य सर्च इंजनों द्वारा समृद्ध परिणाम (Rich Snippets) दिखाने हेतु वैध JSON-LD स्ट्रक्चर्ड डेटा इंजेक्ट करता है।

---

### 12.2 मॉड्यूल 12: विस्तृत फ़ीचर एवं फ़ंक्शन तालिका (Detailed Features Table)

| क्र. सं. | फ़ीचर / फ़ंक्शन का नाम | संबंधित फ़ाइल / कंपोनेंट | मुख्य कार्य (Primary Action) | विस्तृत विवरण (Detailed Description) |
| :---: | :--- | :--- | :--- | :--- |
| 12.1 | **40-Item Bilingual Knowledge Base Dataset** | `src/data/faqConfig.js` | 40 व्यावहारिक प्रश्नों का डेटाबेस | टैक्स, एकाउंटिंग, एमआईएस, कोडिंग, और पारिवारिक पृष्ठभूमि से जुड़े 40 अत्यधिक प्रासंगिक प्रश्नों का द्विभाषी संग्रह। |
| 12.2 | **2-Layer Matrix Filtering (Audience & Role)** | `src/components/FAQSection.jsx` | दोहरे स्तर पर प्रश्नों की छंटनी | लेवल 1 में आगंतुक का उद्देश्य (रिक्रूटर, क्लाइंट, मैट्रिमोनियल) और लेवल 2 में रोल चुनकर सटीक उत्तर देखना। |
| 12.3 | **Live Real-Time Keyword Search & Counter** | `src/components/FAQSection.jsx` | टाइप करते ही प्रश्नों को खोजना | सर्च बॉक्स में टाइप करते ही तत्काल प्रश्नों में सर्च करता है और "Showing X of Y questions" लाइव काउंटर दिखाता है। |
| 12.4 | **Dynamic Topic Category Filtering Chips** | `src/components/FAQSection.jsx` | विषय के अनुसार त्वरित फ़िल्टर | Taxation, Auditing, Power BI, Web AI आदि श्रेणी चिप्स पर क्लिक करके एक झटके में संबंधित प्रश्न देखना। |
| 12.5 | **Accessible Single-Expand Accordion** | `src/components/FAQSection.jsx` | एक समय में एक प्रश्न का सुगम विस्तार | एक प्रश्न खोलने पर दूसरा स्वतः संकुचित होता है; WAI-ARIA `aria-expanded` और कीबोर्ड फोकस के साथ सुरक्षित। |
| 12.6 | **Acoustic Web Audio API Interaction Feedback** | `src/components/FAQSection.jsx`, `src/utils/audio.js` | प्रश्न खोलने/बंद करने पर साउंड | एकॉर्डियन का प्रश्न खोलते समय हल्का मैकेनिकल क्लिक और बंद करते समय सूक्ष्म ऑसिलेटर डैम्पिंग साउंड बजाता है। |
| 12.7 | **Schema.org FAQPage JSON-LD SEO Metadata** | `src/components/FAQSection.jsx` | सर्च इंजन रिच स्निपेट्स बनाना | गूगल सर्च में अक्सर पूछे जाने वाले प्रश्नों को सीधे खोज परिणामों में दिखाने हेतु `<script type="application/ld+json">` इंजेक्ट करता है। |
| 12.8 | **Actionable Contextual CTAs per FAQ Item** | `src/components/FAQSection.jsx` | प्रश्न के आधार पर त्वरित कार्रवाई | उत्तर के नीचे "Calculate Quote", "Download Resume", "Open Case Study" जैसे सीधे नेविगेशन बटन्स प्रदान करता है। |
| 12.9 | **Clean Zero-Result Empty State with Reset** | `src/components/FAQSection.jsx` | कोई परिणाम न मिलने पर सहायता | सर्च में कोई प्रश्न न मिलने पर "No questions found" कार्ड और 1-क्लिक "Reset All Filters" बटन प्रस्तुत करता है। |
| 12.10 | **Bi-directional Sync with Active Persona & Role**| `src/components/FAQSection.jsx` | ग्लोबल रोल व ऑडियंस से सिंक | जब यूजर नेवबार से रोल या ऑडियंस बदलता है, तो एफएक्यू सेक्शन स्वतः संबंधित टैब पर स्विच हो जाता है। |

---

<a id="module-13"></a>
## 💼 मॉड्यूल 13: डिजिटल बिजनेस कार्ड, प्योर SVG डायनामिक QR एवं कोटेशन कैलकुलेटर (Digital Business Card, vCard, QR & Quotation Estimator)

यह मॉड्यूल डिजिटल बिजनेस कार्ड, प्योर SVG डायनामिक QR कोड जनरेटर, RFC 6350 मानकीकृत vCard 3.0 इंजन, और 3-ट्रैक इन-टैब कोटेशन कैलकुलेटर का विवरण देता है।

### 13.1 घटक विवरण एवं वास्तुकला (Component Details & Architecture)

1. **डिजिटल बिजनेस कार्ड एवं डायनामिक SVG QR कोड (`vcardGenerator.js`, Tab 3 `ContactSection.jsx`):**
   - **प्योर SVG डायनामिक QR इंजन:** बिना किसी बाहरी API या लाइब्रेरी के, सीधे गणितीय मैट्रिक्स से शुद्ध SVG QR कोड जनरेट करता है।
   - **RFC 6350 / vCard 3.0 मानकीकृत जनरेटर:** अतुल वर्मा का पूरा नाम, पदनाम, फोन नंबर, ईमेल, वेबसाइट, और पता युक्त `.vcf` फ़ाइल बनाता है।
   - **मोबाइल 1-क्लिक कांटेक्ट सेवर:** फोन के कैमरे से QR स्कैन करते ही iOS/Android में 'Add to Contacts' का प्रॉम्प्ट खुलता है।
   - **वेब शेयर एपीआई:** मोबाइल पर 1-क्लिक नेटिव शेयर शीट खोलता है; डेस्कटॉप पर क्लिपबोर्ड में लिंक कॉपी करता है।

2. **इंटरएक्टिव कोटेशन एवं फीस एस्टीमेटर (Tab 2 `ContactSection.jsx`):**
   - **3 विशेष सेवा ट्रैक्स:**
     1. **Accounting & Taxation:** वाउचर वॉल्यूम, जीएसटी रिटर्न्स, टीडीएस, और बीआरएस।
     2. **MIS & Fiscal Intelligence:** स्प्रेडशीट ऑटोमेशन, पावर बीआई डैशबोर्ड्स, और डेटा पाइपलाइन्स।
     3. **Full-Stack & Vibe Coding:** रिएक्ट वेब ऐप्स, स्वायत्त एआई एजेंट्स, और ऑटोमेशन बॉट्स।
   - **तात्कालिकता एवं जुड़ाव मॉडल:** Standard Delivery vs Express Rush (1.35x), One-Time Project vs Monthly Retainer (15% छूट)।
   - **दोहरी त्वरित कार्रवाई:** 1-क्लिक में कोटेशन का विस्तृत ब्योरा व्हाट्सएप पर भेजना या सीधे संपर्क फ़ॉर्म में प्री-फिल करना।

3. **सत्यापित अकादमिक क्रेडेंशियल एवं सर्टिफिकेट लाइटबॉक्स (`CredentialLightboxModal.jsx`):**
   - ADCA (इन्फोसिटी), बी.कॉम, इंटरमीडिएट, और मैट्रिकुलेशन के मूल क्रेडेंशियल्स का पूर्ण-स्क्रीन लाइटबॉक्स।
   - स्वर्ण मुहर (Golden Official Seal), जारीकर्ता मेटाडेटा, और 1-क्लिक वेरिफिकेशन आईडी कॉपी।

---

### 13.2 मॉड्यूल 13: विस्तृत फ़ीचर एवं फ़ंक्शन तालिका (Detailed Features Table)

| क्र. सं. | फ़ीचर / फ़ंक्शन का नाम | संबंधित फ़ाइल / कंपोनेंट | मुख्य कार्य (Primary Action) | विस्तृत विवरण (Detailed Description) |
| :---: | :--- | :--- | :--- | :--- |
| 13.1 | **Pure SVG Dynamic QR Code Generator Engine** | `src/utils/vcardGenerator.js`, `ContactSection.jsx` | शुद्ध क्लाइंट-साइड क्यूआर कोड बनाना | बिना किसी बाहरी थर्ड-पार्टी सर्वर के, ब्राउज़र के भीतर शुद्ध गणितीय SVG एलिमेंट्स से डायनामिक QR कोड रेंडर करता है। |
| 13.2 | **RFC 6350 / vCard 3.0 Standardized Generator** | `src/utils/vcardGenerator.js` | अंतर्राष्ट्रीय मानकीकृत vCard बनाना | नाम, पदनाम, मोबाइल, ईमेल, वेबसाइट, और पते को RFC 6350 विनिर्देश के अनुसार टेक्स्ट बफ़र में एनकोड करता है। |
| 13.3 | **One-Click Instant Mobile vCard Contact Saver** | `src/utils/vcardGenerator.js` | मोबाइल में संपर्क सीधे सुरक्षित करना | 1-क्लिक में `Atul_Verma_Tax_and_Developer.vcf` डाउनलोड कराता है, जिससे फोन में तुरंत 'Save to Contacts' खुलता है। |
| 13.4 | **Web Share API with Clipboard Fallback** | `src/components/ContactSection.jsx` | डिजिटल प्रोफाइल साझा करना | मोबाइल पर नेटिव शेयर डायलॉग खोलता है; डेस्कटॉप पर सीधे प्रोफ़ाइल यूआरएल को क्लिपबोर्ड में कॉपी करके चेक बैज दिखाता है। |
| 13.5 | **3-Track Dynamic Quotation Fee Calculator** | `src/components/ContactSection.jsx` (Tab 2) | रीयल-टाइम सेवा शुल्क की गणना | Accounting & Tax, MIS & Analytics, और Full-Stack ट्रैक्स में वॉल्यूम स्लाइडर्स के आधार पर वास्तविक शुल्क की गणना। |
| 13.6 | **Complexity Sliders & Add-On Multipliers** | `src/components/ContactSection.jsx` (Tab 2) | तात्कालिकता व जुड़ाव मॉडल चुनना | Standard vs Express Delivery (+35%) और One-Time vs Monthly Retainer (-15%) के आधार पर रीयल-टाइम मूल्य और दिन तय करना। |
| 13.7 | **Instant WhatsApp Scope Quote Dispatcher** | `src/components/ContactSection.jsx` (Tab 2) | व्हाट्सएप पर कोटेशन भेजना | चुने गए ट्रैक, वॉल्यूम, अनुमानित शुल्क (₹) और डिलीवरी दिनों का संरचित संदेश बनाकर सीधे व्हाट्सएप पर भेजता है। |
| 13.8 | **One-Click Quotation Pre-fill into Form** | `src/components/ContactSection.jsx` (Tab 2) | संपर्क फ़ॉर्म में कोटेशन भरना | 1-क्लिक में Tab 1 ('Get in Touch') पर स्विच करता है और बजट व मैसेज फ़ील्ड्स में कोटेशन का ब्योरा स्वतः भर देता है। |
| 13.9 | **Verified Academic Credential Lightbox** | `src/components/CredentialLightboxModal.jsx` | प्रमाणपत्रों का फुलस्क्रीन मुआयना | ADCA, B.Com, I.Com, और 10th के प्रमाणपत्रों का हाई-रेजोल्यूशन प्रीव्यू, जारीकर्ता विवरण और दिनांक प्रदर्शित करता है। |
| 13.10 | **Golden Official Accreditation Seal** | `src/components/CredentialLightboxModal.jsx` | आधिकारिक प्रमाणीकरण मुहर | प्रत्येक क्रेडेंशियल पर चमकती हुई स्वर्ण मुहर (Gold Stamp Seal) और '100% Verified Production Benchmark' बैज। |
| 13.11 | **1-Click Verification ID Copy with Toast** | `src/components/CredentialLightboxModal.jsx` | सत्यापन आईडी क्लिपबोर्ड में कॉपी | आधिकारिक रजिस्ट्रेशन/सत्यापन आईडी को 1-क्लिक में कॉपी करता है और 2 सेकंड के लिए चेक मार्क व टोस्ट दिखाता है। |
| 13.12 | **WCAG 2.1 AAA Modal Dialog Trapping** | `src/components/CredentialLightboxModal.jsx` | सुलभ कीबोर्ड फोकस ट्रैप | मोडल खुलने पर बैकग्राउंड स्क्रॉल लॉक (`useBodyScrollLock`), `Tab` की ट्रैप, और `Esc` दबाने पर बंद होने की पूर्ण सुविधा। |
| 13.13 | **Standalone Quotation Estimator Modal with Interactive Checkbox Add-ons** | `src/components/QuotationEstimatorModal.jsx`, `src/context/LanguageContext.jsx` | स्टैंडअलोन कोटेशन एस्टीमेटर मोडल | 3 सेवा ट्रैक्स (Accounting & Tax Advisory, MIS & Data Operations, AI & Web Engineering) का स्टैंडअलोन मोडल — व्यक्तिगत चेकबॉक्स सर्विसेज (GST, ITR, Tally, BRS, Macros, DBT Portals, Power BI, React/Node), बेस प्राइसिंग, एक्सप्रेस रश (+35%), और डायरेक्ट व्हाट्सएप कोटेशन डिस्पैच। |
| 13.14 | **Standalone Digital Business Card Modal with Dynamic SVG QR Code** | `src/components/DigitalBusinessCardModal.jsx`, `src/utils/vcardGenerator.js` | स्टैंडअलोन डिजिटल बिजनेस कार्ड मोडल | डिजिटल बिजनेस कार्ड का समर्पित स्टैंडअलोन मोडल डायलॉग — शुद्ध गणितीय 25x25 SVG क्यूआर कोड, 1-क्लिक vCard 3.0 डाउनलोड, क्लिपबोर्ड कॉपी, वेब शेयर API, और WCAG सुलभ `useFocusTrap` डायलॉग। |

---

<a id="module-14"></a>
## 🎛️ मॉड्यूल 14: स्टैंडअलोन फुलस्क्रीन कंट्रोल सेंटर स्टूडियो एवं डीप-लिंकिंग आर्किटेक्चर (Standalone Fullscreen Control Center Studio & Deep Linking)

यह मॉड्यूल स्टैंडअलोन कंट्रोल सेंटर फुलस्क्रीन स्टूडियो (`ControlCenterFullView.jsx`), DOM-आइसोलेटेड बूट, टू-टियर मोड आर्किटेक्चर (`mode=all` vs `mode=single`), यूआरएल डीप लिंकिंग और मल्टी-टैब लोकलस्टोरेज सिंक्रोनाइज़ेशन का संपूर्ण विवरण देता है।

### 14.1 घटक विवरण एवं वास्तुकला (Component Details & Architecture)

1. **DOM-आइसोलेटेड स्टैंडअलोन स्टूडियो बूट (`App.jsx` & `ControlCenterFullView.jsx`):**
   - **शून्य बैकग्राउंड क्लटर:** जब URL में `?view=control` या `?panel=control` डिटेक्ट होता है, तो `App.jsx` मुख्य पोर्टफोलियो के भारी डोम तत्वों (Hero, 3D Canvas, Particles, Projects, Marquee) को पूरी तरह बायपास करके सीधे `ControlCenterFullView` को रेंडर करता है, जिससे स्टूडियो का बूट टाइम मिलीसेकंड्स में हो जाता है।
   - **टू-टियर मोड आर्किटेक्चर (`mode=all` बनाम `mode=single`):**
     - `mode=all`: पूर्ण इंटरएक्टिव स्टूडियो जिसमें सभी 6 सबसिस्टम्स (Audio, Cursor, Hero, 3D Spatial, Preferences, Visuals) का क्षैतिज नेविगेशन पिल स्ट्रिप उपलब्ध रहता है।
     - `mode=single`: किसी एक विशिष्ट सबसिस्टम (जैसे `?mode=single&tab=cursor`) को लॉक रखता है, शीर्ष नेविगेशन बार को पूरी तरह छुपाता है, एरो कीज़ ट्रैवर्सल को रोकता है, और शीर्ष पर एनिमेटेड पल्सिंग बैज ("Isolated Tab: ...") तथा "Open Full Control Panel" एलिवेशन बटन प्रस्तुत करता है।
   - **द्वि-दिशात्मक यूआरएल डीप लिंकिंग:** सक्रिय टैब, मोड, थीम (`theme=light|dark`), और भाषा (`lang=en|hi`) को URL सर्च पैरामीटर्स में स्वतः सिंक्रनाइज़ रखता है और `history.replaceState` से शेयरेबल लिंक्स बनाता है।

2. **इंटरएक्टिव प्लेग्राउंड एवं पैनल पॉपआउट ट्रिगर्स:**
   - **प्लेग्राउंड एक्सटर्नल लॉन्चर:** इनलाइन प्लेग्राउंड (`InteractivePlayground.jsx`) में एक समर्पित "Open in New Tab" बटन जो सक्रिय थीम और भाषा के साथ सीधे `_blank` में पूर्ण स्टूडियो खोलता है।
   - **पैनल एक्टिव टैब हेडर पॉपआउट:** `ControlCenterPanel.jsx` के हेडर में 1-क्लिक पॉपआउट बटन जो लक्षित सबसिस्टम को सिंगल-मोड में अलग विंडो में लॉन्च करता है।
   - **लाइव स्टोरेज सिंक्रोनाइज़ेशन पल्स:** "🟢 Live Synced with Main Window via LocalStorage" स्टेटस इंडिकेटर, जो किसी अन्य विंडो या टैब से सेटिंग्स बदलने पर हरे रंग में ब्लिंक होकर ऑपरेटर को रीयल-टाइम सिंक की पुष्टि देता है।

---

### 14.2 मॉड्यूल 14: विस्तृत फ़ीचर एवं फ़ंक्शन तालिका (Detailed Features Table)

| क्र. सं. | फ़ीचर / फ़ंक्शन का नाम | संबंधित फ़ाइल / कंपोनेंट | मुख्य कार्य (Primary Action) | विस्तृत विवरण (Detailed Description) |
| :---: | :--- | :--- | :--- | :--- |
| 14.1 | **DOM-Isolated Standalone Studio Boot via URL Query Routing** | `src/App.jsx`, `src/components/ControlCenterFullView.jsx` | 0ms पोर्टफोलियो बर्डन के साथ स्टूडियो लोड | `?view=control` और `?panel=control` डिटेक्ट होते ही मुख्य पेज के भारी 3D कैनवस, हेरो ट्रैकिंग व प्रोजेक्ट्स को अनमाउंट रखकर सीधे कंट्रोल स्टूडियो लोड करता है। |
| 14.2 | **Two-Tier Mode Architecture (mode=all vs mode=single)** | `src/components/ControlCenterFullView.jsx`, `src/components/ControlCenterPanel.jsx` | पूर्ण स्टूडियो बनाम पृथक सबसिस्टम दृश्य | `mode=all` में पूरा नेविगेशन बार देता है; `mode=single` में टैब लिस्ट छुपाकर केवल एक सबसिस्टम पर फोकस लॉक करता है और एरो कीज़ नेविगेशन रोकता है। |
| 14.3 | **Isolated Single Mode "Open Full Control Panel" CTA Elevation** | `src/components/ControlCenterFullView.jsx` | सिंगल मोड से पूर्ण स्टूडियो में अपग्रेड | सिंगल मोड में हेडर में एक प्रमुख CTA बटन देता है, जिस पर क्लिक करते ही बिना पेज रीलोड किए मोड 'all' में बदलकर सभी सबसिस्टम टैब्स अनलॉक हो जाते हैं। |
| 14.4 | **Bi-Directional URL Deep Linking & History State Synchronization** | `src/components/ControlCenterFullView.jsx` | सेटिंग्स, थीम व भाषा का यूआरएल सिंक | टैब बदलते ही URL में `?view=control&mode=all&tab=...&theme=...&lang=...` को `history.replaceState` से सुरक्षित रखता है ताकि लिंक सीधे साझा किए जा सकें। |
| 14.5 | **Interactive Playground Dedicated "Open in New Tab" Launcher** | `src/components/InteractivePlayground.jsx` | प्लेग्राउंड से स्वतंत्र विंडो में खोलना | प्लेग्राउंड सेक्शन में नया एक्सटर्नल लिंक बटन, जो यूजर की वर्तमान थीम और भाषा के साथ सीधे नए ब्राउज़र टैब में स्टैंडअलोन स्टूडियो लॉन्च करता है। |
| 14.6 | **Active Tab Header 1-Click Popout Trigger** | `src/components/ControlCenterPanel.jsx` | सक्रिय टैब को सिंगल मोड में पॉपआउट करना | कंट्रोल पैनल के टैब हेडर में समर्पित पॉपआउट बटन, जो उस विशिष्ट टैब को `mode=single` में नई विंडो में खोलकर साइड-बाय-साइड प्रीव्यू की सुविधा देता है। |
| 14.7 | **Live Storage Synchronization Blinking Indicator with Debounce Pulse** | `src/components/ControlCenterFullView.jsx` | मुख्य विंडो के साथ लाइव सिंक इंडिकेटर | जब मुख्य पोर्टफोलियो विंडो में कोई स्लाइडर या सेटिंग बदली जाती है, तो यह इंडिकेटर `syncPulse` डेबउंस के साथ ब्लिंक होकर रीयल-टाइम स्टोरेज सिंक प्रमाणित करता है। |
| 14.8 | **Full Bilingual (EN/HI) Studio Localization & Factory Reset Guard** | `src/components/ControlCenterFullView.jsx` | संपूर्ण स्टूडियो का हिंदी व अंग्रेजी स्थानीयकरण | सभी 6 टैब्स के टाइटल्स, बैज, नेविगेशन बटन्स और फैक्टरी रीसेट कन्फर्मेशन डायलॉग को अंग्रेजी और शुद्ध हिंदी में प्रस्तुत करता है। |

---

<a id="module-15"></a>
## 🧠 मॉड्यूल 15: ऑन-डिवाइस लोकल LLM न्यूरल एआई इंजन एवं हार्डवेयर प्रोफाइलर (On-Device Local LLM AI Engine & Hardware Profiler)

यह मॉड्यूल ब्राउज़र में सीधे क्लाइंट-साइड चलने वाले ऑन-डिवाइस न्यूरल LLM आर्किटेक्चर (`Transformers.js`), शून्य-अनुमति हार्डवेयर प्रोफाइलर (`deviceProfiler.js`), बैकग्राउंड वेब वर्कर (`aiModelWorker.js`), और लोकल एआई सर्विस (`localAIService.js`) का संपूर्ण विवरण देता है।

### 15.1 घटक विवरण एवं वास्तुकला (Component Details & Architecture)

1. **शून्य-अनुमति क्लाइंट-साइड हार्डवेयर प्रोफाइलर (`deviceProfiler.js`):**
   - **हार्डवेयर क्षमता मापन:** बिना किसी यूजर परमिशन के सीपीयू कोर्स (`navigator.hardwareConcurrency`), डिवाइस फॉर्म फैक्टर (Mobile/Tablet/Desktop), ब्राउज़र स्टोरेज कोटा (`navigator.storage.estimate()`), और वेबजीपीयू एडाप्टर व बफ़र सीमाएं (`navigator.gpu`) आंकता है।
   - **50ms डिटरमिनिस्टिक माइक्रो-बेंचमार्क:** ब्राउज़र के सिंगल-कोर कंप्यूटेशन स्पीड की रीयल-टाइम गणना (ops/ms) करके सीपीयू को `budget`, `medium`, `high`, या `flagship` टियर में वर्गीकृत करता है।
   - **गोपनीयता-सुरक्षित सिटी-लेवल आईपी जियोलोकेशन:** शून्य जीपीएस और शून्य अनुमतियों के साथ `ipapi.co` से आगंतुक का शहर और क्षेत्र प्राप्त करता है तथा सत्र हेतु `sessionStorage` में कैश करता है।

2. **कंजर्वेटिव टियरिंग लॉजिक एवं क्रैश प्रिवेंशन इंजन (`deviceProfiler.js`):**
   - **कठोर सुरक्षा नियम:** यदि कोई हाई-एंड डेस्कटॉप सैद्धांतिक रूप से 3B-4B मॉडल चलाने में सक्षम है, तो सिस्टम ब्राउज़र क्रैश और OOM से बचने हेतु कंजर्वेटिव रूप से 1.5B/Medium मॉडल (`Qwen2.5-1.5B-Instruct`) चुनता है; मध्यम डिवाइसेज पर 0.5B/Light मॉडल (`Qwen2.5-0.5B-Instruct`); और मोबाइल, टैबलेट या सीमित स्टोरेज पर अल्ट्रा-लाइटवेट बेयर-मिनिमम मॉडल (`SmolLM2-135M-Instruct`, <100MB) चुनता है।

3. **जीरो-मेन-थ्रेड-ब्लॉकिंग एआई वेब वर्कर (`aiModelWorker.js`):**
   - **स्वतंत्र बैकग्राउंड थ्रेड:** ट्रांसफॉर्मर्स.जेएस (`@huggingface/transformers`) को एक अलग वेब वर्कर थ्रेड में निष्पादित करता है, जिससे पोर्टफोलियो के 120 FPS काइनेमैटिक्स और यूआई एनिमेशन्स में शून्य मिलीसेकंड का फ्रेम ड्राप होता है।
   - **वेबजीपीयू से वास्म ऑटोमैटिक फ़ॉलबैक:** पहले हाई-स्पीड WebGPU एक्सेलेरेशन का प्रयास करता है; यदि अनुपलब्ध या विफल हो तो बिना क्रैश हुए स्वतः WASM बैकएंड पर फ़ॉलबैक करता है।

4. **लोकल एआई सर्विस एवं चैट एट्रिब्यूशन (`localAIService.js` & `AIChatWidget.jsx`):**
   - **साइलेंट बैकग्राउंड वॉर्म-अप:** चैट विजेट खुलते ही बैकग्राउंड में लो-प्रायोरिटी के साथ बेयर-मिनिमम मॉडल का प्री-डाउनलोड शुरू करता है।
   - **मॉडल एट्रिब्यूशन बैज:** चैट प्रतिक्रिया के नीचे रीयल-टाइम बैज (`[SmolLM-135M]`, `[Qwen-0.5B]`, `[Qwen-1.5B]`, `[Qwen-3B]`, या `[Portfolio-Engine]`) प्रदर्शित करता है, और मॉडल तैयार होने पर लाइव टोस्ट नोटिफिकेशन व ARIA घोषणा प्रस्तुत करता है।

---

### 15.2 मॉड्यूल 15: विस्तृत फ़ीचर एवं फ़ंक्शन तालिका (Detailed Features Table)

| क्र. सं. | फ़ीचर / फ़ंक्शन का नाम | संबंधित फ़ाइल / कंपोनेंट | मुख्य कार्य (Primary Action) | विस्तृत विवरण (Detailed Description) |
| :---: | :--- | :--- | :--- | :--- |
| 15.1 | **Zero-Permission Client-Side Hardware Profiler** | `src/utils/deviceProfiler.js` | डिवाइस क्षमता का शून्य-अनुमति मापन | सीपीयू कोर्स, टच पॉइंट्स, व्यूपोर्ट, स्टोरेज कोटा, और WebGPU बफ़र क्षमता को बिना किसी पॉपअप या यूजर परमिशन के सुरक्षित रूप से मापता है। |
| 15.2 | **Deterministic 50ms JS Micro-Benchmark Engine** | `src/utils/deviceProfiler.js` | सिंगल-कोर कंप्यूटेशन स्पीड की गणना | 50ms का गणितीय लूप चलाकर प्रति मिलीसेकंड ऑपरेशन्स (ops/ms) की गणना करता है और डिवाइस को बजट, मीडियम, हाई या फ्लैगशिप स्कोर देता है। |
| 15.3 | **Zero-Permission Privacy-Preserving City-Level IP Geolocation** | `src/utils/deviceProfiler.js` | आगंतुक का शहर व क्षेत्र जानना | शून्य-जीपीएस और बिना परमिशन के आईपी जियोलोकेशन द्वारा आगंतुक का शहर प्राप्त करता है और नेटवर्क लोड बचाने हेतु `sessionStorage` में कैश करता है। |
| 15.4 | **Conservative Model Tiering & Safety Clamp Engine** | `src/utils/deviceProfiler.js` | ब्राउज़र क्रैश रोकने हेतु सुरक्षित मॉडल चयन | 4B-सक्षम डिवाइसेज को 1.5B/Medium, 1B-सक्षम को 0.5B/Light, और मोबाइल/टैबलेट को अनिवार्य रूप से बेयर-मिनिमम 135M मॉडल पर कंजर्वेटिव रूप से क्लैंप करता है। |
| 15.5 | **Zero-Main-Thread Blocking AI Web Worker Thread** | `src/workers/aiModelWorker.js` | 120 FPS यूआई को फ्रीज से बचाना | Transformers.js इनफेरेंस को एक अलग वेब वर्कर थ्रेड में चलाता है, जिससे मॉडल लोडिंग और टेक्स्ट जनरेशन के दौरान 0ms मेन-थ्रेड ब्लॉकिंग रहती है। |
| 15.6 | **Automated WebGPU-to-WASM Fallback Pipeline** | `src/workers/aiModelWorker.js` | हार्डवेयर एक्सेलेरेशन विफलता पर रिकवरी | पहले अत्याधुनिक WebGPU पर मॉडल लोड करने का प्रयास करता है; ड्राइवर विफलता या अनुपलब्धता पर स्वतः WASM और q4 क्वांटाइजेशन पर फ़ॉलबैक करता है। |
| 15.7 | **Streamable Download Progress Normalization** | `src/workers/aiModelWorker.js` | मॉडल डाउनलोड प्रतिशत की रीयल-टाइम रिपोर्ट | Transformers.js प्रोग्रेस कॉलबैक्स को नॉर्मलाइज करके फ़ाइल नाम, लोडेड बाइट्स, टोटल बाइट्स और राउंडेड प्रोग्रेस प्रतिशत UI को भेजता है। |
| 15.8 | **Local AI Singleton Service & Consent Lifecycle Manager** | `src/services/localAIService.js` | मॉडल लाइफसाइकिल व टाइमआउट गार्ड | वर्कर थ्रेड को नियंत्रित करता है, 8-सेकंड का इनफेरेंस टाइमआउट गार्ड लागू करता है, और यूजर कंसेंट (`portfolio_ai_model_consent`) को प्रबंधित करता है। |
| 15.9 | **Silent Low-Priority Background Model Pre-warming** | `src/services/localAIService.js`, `src/components/AIChatWidget.jsx` | चैट खुलते ही बैकग्राउंड में मॉडल वॉर्म-अप | चैट विजेट ओपन होते ही यूजर के बिना रुके बैकग्राउंड में अल्ट्रा-लाइटवेट 135M मॉडल का साइलेंट डाउनलोड शुरू करता है ताकि सवाल पूछते समय AI तैयार रहे। |
| 15.10 | **Action Bar Response Model Attribution Badge & Notification Toast** | `src/components/AIChatWidget.jsx` | मॉडल स्रोत बैज व ऑन-डिवाइस अलर्ट | चैट में प्रत्येक उत्तर के साथ सक्रिय मॉडल का बैज (`[SmolLM-135M]`, `[Qwen-0.5B]`, `[Portfolio-Engine]`) दिखाता है और मॉडल तैयार होने पर एनिमेटेड टोस्ट जारी करता है। |

---

<a id="module-16"></a>
## 🤖 मॉड्यूल 16: एआई चैट संपूर्ण 11-चरणीय एन्हांसमेंट, एजेंटिक एवं वॉइस स्टूडियो सुइट (Master AI Chat Enhancement, Agentic & Voice Studio Suite - Phases 1 to 11)

### 16.1 सिस्टम सारांश एवं आर्किटेक्चरल ओवरव्यू (System Summary & Architectural Overview)
यह मॉड्यूल पोर्टफोलियो के फ्लोटिंग एआई चैट को एक एंटरप्राइज-ग्रेड, 100% ऑफलाइन-सक्षम तथा ऑन-डिवाइस न्यूरल हाइब्रिड असिस्टेंट में परिणत करने वाले 8 चरणों का संपूर्ण दस्तावेजीकरण करता है:
1. **प्रेजेंटेशन एवं व्यूपोर्ट एर्गोनॉमिक्स (UI Phases 1–4):** डायनामिक `100dvh` व्यूपोर्ट अडैप्टेबिलिटी, सेफ़-एरिया पैडिंग, रिच मार्कडाउन पार्सर (`FormattedMessage.jsx`), 1-क्लिक कोड कॉपी, 2-पंक्ति कैटेगराइज्ड प्रॉम्ट चिप्स (`SuggestionChipsDrawer.jsx`), स्लैश कमांड पैलेट (`SlashCommandPalette.jsx`), WCAG 2.1 AA फोकस ट्रैप (`useFocusTrap.js`), कन्वर्सेशनल ARIA लॉग्स, और रिड्यूस्ड-मोशन सपोर्ट।
2. **बैकएंड एवं न्यूरल स्ट्रीमिंग (Backend Phases 5–7):** Transformers.js `TextStreamer` द्वारा रीयल-टाइम टोकन स्ट्रीमिंग, एबॉर्टेबल जनरेशन इंजन स्टॉप बटन, 100% ऑफलाइन मल्टी-टर्न कॉन्टेक्स्ट मेमोरी (`portfolioContextMemory.js`), सर्वनाम/एनाफोरा समाधान, WebGPU डिवाइस लॉस व OOM ऑटो-रिकवरी, और कैस्केडिंग मॉडल फ़ॉलबैक लैडर (`Qwen-3B` -> `Qwen-1.5B` -> `Qwen-0.5B` -> `SmolLM-135M` -> `Portfolio-Engine`)।
3. **कैपस्टोन इंटीग्रेशन एवं ऑटोमेटेड साइन-ऑफ (Capstone Phase 8):** `portfolio:open-ai-chat` कस्टम इवेंट कॉन्ट्रैक्ट्स (वैकल्पिक पेलोड्स `initialMessage`, `targetRole`, `targetAudience`, `targetViewMode` सहित), लाइफसाइकिल टीयरडाउन हाइजीन (`clearTimeout`, `clearInterval`, `cancelGeneration`, `speechSynthesis.cancel()`), और 25-एसर्शन ऑटोमेटेड वेरिफिकेशन हार्नेस (`scripts/verify_phase8_chat_integration.mjs`)।

---

### 16.2 विस्तृत फीचर्स एवं कंपोनेंट्स तालिका (Detailed Features Table)

| क्र. सं. | फ़ीचर / फ़ंक्शन का नाम | संबंधित फ़ाइल / कंपोनेंट | मुख्य कार्य (Primary Action) | विस्तृत विवरण (Detailed Description) |
| :---: | :--- | :--- | :--- | :--- |
| 16.1 | **Dynamic dvh & Safe-Area Sizing Ergonomics** | `src/components/AIChatWidget.jsx` | मोबाइल वर्चुअल कीबोर्ड व नौच सुरक्षा | मोबाइल पर `100dvh` और `env(safe-area-inset-bottom)` का उपयोग कर विजेट को क्लिपिंग से बचाता है और कीबोर्ड खुलने पर इनपुट बार को दृश्यमान रखता है। |
| 16.2 | **Accessible 44px Header Controls & Layout Reset** | `src/components/AIChatWidget.jsx` | टच-फ्रेंडली हेडर एवं रीसेट सुविधा | हेडर बटन्स को 44px मोबाइल टच टारगेट में अपग्रेड करता है, डबल-क्लिक रीसेट लेआउट संकेत देता है और डेस्कटॉप पर 8-पॉइंट रिसाइज़िंग प्रदान करता है। |
| 16.3 | **Safe Rich Markdown Parser with Code Snippet UX** | `src/components/chat/FormattedMessage.jsx` | ट्रू मार्कडाउन एवं कोड ब्लॉक स्टाइलिंग | XSS-सुरक्षित शुद्ध पार्सर द्वारा बोल्ड, इटैलिक, बुलेट्स, लिंक्स और सिंटैक्स-हाईलाइटेड कोड ब्लॉक्स को डार्क/लाइट कॉन्ट्रास्ट के साथ रेंडर करता है। |
| 16.4 | **1-Click Code Copy Feedback & Speech Sanitizer** | `src/components/chat/FormattedMessage.jsx`, `src/components/AIChatWidget.jsx` | कोड कॉपी और स्पीच सिंथेसिस सैनिटाइजेशन | कोड ब्लॉक्स पर 1-क्लिक कॉपी बटन और टेक्स्ट-टू-स्पीच के लिए मार्कडाउन सिंबल्स/इमोजिस को स्वतः हटाने वाला सैनिटाइजर प्रदान करता है। |
| 16.5 | **Categorized 2-Row Suggestion Grid & Badges** | `src/components/chat/SuggestionChipsDrawer.jsx` | कॉम्पैक्ट 2-पंक्ति प्रॉम्ट ग्रिड | 10+ प्रॉम्ट चिप्स को 2 पंक्तियों में व्यवस्थित करता है और Tax, Tech, MIS, Career डोमेन बैज के साथ क्षैतिज स्क्रॉलिंग को सुगम बनाता है। |
| 16.6 | **Keyboard-Driven Slash Command Palette with Clamping** | `src/components/chat/SlashCommandPalette.jsx` | ऑटो-कम्प्लीट और व्यूपोर्ट क्लैंपिंग | 40+ स्लैश कमांड्स को कीबोर्ड ऐरो कीज से नेविगेट करने, सबस्ट्रिंग हाईलाइटिंग, और मोबाइल व्यूपोर्ट पर `max-h-48` क्लैंपिंग प्रदान करता है। |
| 16.7 | **WCAG 2.1 AA Focus Trap & Conversational ARIA Log** | `src/hooks/useFocusTrap.js`, `src/components/AIChatWidget.jsx` | स्क्रीन रीडर और कीबोर्ड एक्सेसिबिलिटी | डायलॉग के अंदर कीबोर्ड टैब ट्रैपिंग, `role="log"`, `role="article"`, और टाइमस्टैम्प ARIA लेबल्स प्रदान कर एक्सेसिबिलिटी मानकों को पूरा करता है। |
| 16.8 | **Accessible Haptic Vibration & Prefers-Reduced-Motion** | `src/components/AIChatWidget.jsx` | मोशन व हैप्टिक सिंक्रोनाइज़ेशन | सिस्टम मोशन प्रेफरेंस (`prefers-reduced-motion`) को पहचानकर एनिमेशन्स को डिसेबल करता है और मोबाइल पर सूक्ष्म 15-20ms हैप्टिक टैप देता है। |
| 16.9 | **Transformers.js TextStreamer Real-Time Token Streaming** | `src/workers/aiModelWorker.js` | चंक-बाई-चंक लाइव टोकन उत्सर्जन | इनफेरेंस के दौरान `TextStreamer` कॉलबैक्स से प्रत्येक टोकन को तुरंत एमिट करता है, जिससे यूजर को टाइपराइटर जैसा सजीव अनुभव मिलता है। |
| 16.10 | **Abortable Generation Engine & Emergency Stop Button** | `src/services/localAIService.js`, `src/components/AIChatWidget.jsx` | इन-फ्लाइट जनरेशन को तुरंत रोकना | स्ट्रीमिंग के दौरान लाइव 'Stop' बटन दिखाता है, जो `localAIService.cancelGeneration(id)` कॉल कर वर्कर इनफेरेंस को तुरंत रद्द करता है। |
| 16.11 | **Multi-Turn Conversational Topic & Entity Memory** | `src/utils/portfolioContextMemory.js` | संवादात्मक संदर्भ एवं स्टैक ट्रैकिंग | 100% ऑफलाइन रहते हुए पिछले 20 संवादात्मक टर्न्स, विषय, केस स्टडी आईडी और इंटेंट को LIFO स्टैक में रिकॉर्ड करता है। |
| 16.12 | **Anaphora & Coreference Resolution Engine** | `src/utils/portfolioContextMemory.js`, `src/utils/portfolioAssistantEngine.js` | सर्वनाम व संदर्भ का सटीक समाधान | 'Tell me about the second one' या 'How much does that cost?' जैसे संदर्भ-निर्भर वाक्यों को सक्रिय टॉपिक से जोड़कर सटीक जवाब देता है। |
| 16.13 | **WebGPU Context Loss & Out-of-Memory Watchdog** | `src/workers/aiModelWorker.js` | डिवाइस डिस्कनेक्ट व OOM रिकवरी | WebGPU डिवाइस खोने या मेमोरी ओवरलोड होने पर स्वतः पहचानकर बिना हैंग हुए सुरक्षित WASM बैकएंड पर ट्रांज़िशन करता है। |
| 16.14 | **Cascading Model Fallback Ladder** | `src/services/localAIService.js` | 5-स्तरीय स्वचालित डिग्रेडेशन सीढ़ी | विफलता पर Qwen-3B -> Qwen-1.5B -> Qwen-0.5B -> SmolLM-135M -> Portfolio-Engine तक स्वतः नीचे उतरकर शत-प्रतिशत अपटाइम सुनिश्चित करता है। |
| 16.15 | **Cross-Component Event API Contracts** | `src/components/AIChatWidget.jsx`, `src/components/FloatingActionHub.jsx`, `src/components/Navbar.jsx` | डिकपल्ड कस्टम इवेंट बस | `portfolio:open-ai-chat` को वैकल्पिक पेलोड्स (`initialMessage`, `targetRole`, आदि) के साथ सुनता है और `portfolio:ai-chat-state` ब्रॉडकास्ट करता है। |
| 16.16 | **Production Bundle Budget, Teardown Hygiene & Capstone Harness** | `scripts/verify_phase8_chat_integration.mjs`, `package.json` | 25-एसर्शन ऑटोमेटेड वेरिफिकेशन हार्नेस | अनमाउंट पर टाइमआउट्स/इंटरवाल्स/स्पीच रद्दीकरण, लीन बंडल बजट, और संपूर्ण 8-चरणीय सिस्टम के 100% ग्रीन पास की पुष्टि करता है। |
| 16.17 | **Multi-Format Session Export & Clipboard Engine** | `src/utils/chatExportEngine.js` | 4-फॉर्मेट एक्सपोर्ट एवं क्लिपबोर्ड कॉपी | बातचीत को Markdown, TXT, JSON और HTML5 प्रिंट-रेडी प्रारूप में डाउनलोड एवं 1-क्लिक क्लिपबोर्ड कॉपी की सुविधा देता है। |
| 16.18 | **Multi-Session Storage & 10-Session FIFO Quota** | `src/utils/chatSessionStorage.js` | मल्टी-सेशन इतिहास एवं स्वतः कोटा प्रबंधन | स्थानीय स्टोरेज में सत्रों को सुरक्षित रखता है, प्रथम प्रश्न से शीर्षक व्युत्पन्न करता है और 10-सत्र सीमा लागू करता है। |
| 16.19 | **Zero-Cloud Performance Telemetry & Feedback** | `src/utils/chatAnalytics.js` | इन-मेमोरी लेटेंसी, थ्रूपुट व फीडबैक रेटिंग | प्रति सेकंड टोकन गति, औसत लेटेंसी, विषय वितरण और थम्स अप/डाउन रेटिंग को 100% ऑफलाइन रिकॉर्ड व स्कोरकार्ड बनाता है। |
| 16.20 | **Curated Guided Tour Engine & DOM Autoscroll** | `src/utils/chatTourEngine.js` | 4 क्यूरेटेड गाइडेड टूर्स व लाइफसाइकिल API | रिक्रूटर, जीएसटी टैक्स, एआई वाइब कोडिंग और एग्जीक्यूटिव टूर्स का ऑटोमेटेड स्क्रॉलिंग व स्पॉटलाइट वॉकथ्रू प्रदान करता है। |
| 16.21 | **Multi-Token Semantic Search Index & Relevance Ranker** | `src/utils/portfolioSemanticIndex.js` | केस स्टडीज, स्किल्स व टूल्स में डीप सर्च | फजी टोकनाइजेशन, वेटेज स्कोरिंग और 1-क्लिक एक्शन ट्रिगर्स के साथ संपूर्ण पोर्टफोलियो में तेज सर्च निष्पादित करता है। |
| 16.22 | **Interactive In-Chat Action Cards & Tour HUD Banner** | `src/components/chat/ChatActionCard.jsx`, `src/components/AIChatWidget.jsx` | रिच कार्ड्स एवं लाइव टूर बैनर | चैट के भीतर टूर कंट्रोलर, कोटेशन एस्टीमेटर, सर्च रिजल्ट्स व बेंचमार्क कार्ड्स रेंडर करता है और हेडर पर लाइव टूर HUD दिखाता है। |
| 16.23 | **Phase 10 Agentic Capstone Verification Harness** | `scripts/verify_phase10_chat_agent.mjs`, `package.json` | 5-सुइट 17-एसर्शन एजेंटिक टेस्ट हार्नेस | टूर लाइफसाइकिल, सिमेंटिक इंडेक्सिंग, एक्शन कार्ड्स, स्लैश कमांड्स और असिस्टेंट इंटीग्रेशन का 100% ग्रीन सत्यापन। |
| 16.24 | **Multilingual Voice Synthesis Engine & Bounded Clamping** | `src/utils/voiceAgentEngine.js` | बहुभाषी प्राकृतिक स्पीच सिंथेसिस व सीमा क्लैम्पिंग | Rate (0.75-1.5x), Pitch (0.8-1.2x), Volume (0-1) को सुरक्षित सीमा में रखते हुए देवनागरी के लिए hi-IN और अंग्रेजी के लिए en-IN/en-US स्वतः मैप करता है। |
| 16.25 | **Chrome SpeechSynthesis Keep-Alive Watchdog** | `src/utils/voiceAgentEngine.js` | क्रोमियम 14-सेकंड ऑडियो फ्रीज वॉचडॉग | क्रोमियम ब्राउज़रों के 14-सेकंड ऑडियो GC फ्रीज बग को रोकने के लिए प्रत्येक 10 सेकंड पर साइलेंट साइकिल चलाता है। |
| 16.26 | **Procedural Multi-Sine Canvas Waveform Visualizer** | `src/components/chat/VoiceVisualizerWaveform.jsx` | बहु-हार्मोनिक कैनवस ऑडियो वेवफॉर्म | लिसनिंग (cyan), स्पीकिंग (emerald), और पॉज़्ड (amber) अवस्थाओं में मल्टी-साइन तरंगें रेंडर करता है तथा reduced-motion के लिए स्टेटिक बार्स दिखाता है। |
| 16.27 | **Voice Settings Studio & Hands-Free Auto-Speak** | `src/components/AIChatWidget.jsx`, `src/data/chatSlashCommands.js` | वॉइस स्टूडियो मोडल व हैंड्स-फ्री ऑटो-स्पीक | वॉइस प्रोफाइल, स्पीड, पिच व हैंड्स-फ्री ऑटो-स्पीक का संपूर्ण कंट्रोल पैनल तथा `/voice`, `/speak`, `/voicesettings`, `/voiceconfig` कमांड्स। |
| 16.28 | **Phase 11 Voice Agent Master Verification Harness** | `scripts/verify_phase11_voice_agent.mjs`, `package.json` | 5-सुइट वॉइस एजेंट सत्यापन हार्नेस | स्टेट मशीन, क्लैम्पिंग, वॉचडॉग, वेवफॉर्म रेंडरिंग, स्लैश कमांड्स व विजेट इंटीग्रेशन का 100% ग्रीन सत्यापन। |
| 16.29 | **40+ Interactive Slash Commands Catalog & Execution Directory** | `src/data/chatSlashCommands.js` | 40+ इंटरैक्टिव स्लैश कमांड्स का डायरेक्टरी कैटलॉग | पोर्टफोलियो, रोल्स, केस स्टडीज, टूल्स, नेविगेशन, थीम, और वॉइस सेटिंग्स को सीधे चैट से ट्रिगर करने वाले 40+ स्लैश कमांड्स का मानकीकृत कैटलॉग। |
| 16.30 | **Offline Client-Side Meta-Prompt Synthesis & Engineering Engine** | `src/utils/metaPromptEngine.js`, `src/services/metaPromptEngine.js` | क्लाइंट-साइड 4-स्टेज प्रॉम्ट ऑप्टिमाइज़र | यूजर के कच्चे प्रॉम्ट्स को 4 चरणों (Core Intent Extraction, Domain Anchoring, Audience Framing, Optimization Polish) में परिष्कृत करके अत्याधुनिक प्रोडक्शन प्रॉम्ट्स में बदलने वाला ऑफलाइन इंजन। |
| 16.31 | **Meta-Prompt & Interactive Studio Chat Integration Suite** | `scripts/verify_meta_prompt_chat.mjs`, `package.json` | मेटा-प्रॉम्ट और चैट एकीकरण सुइट | मेटा-प्रॉम्ट जनरेशन, स्लैश कमांड्स एकीकरण, और चैट विजेट के साथ रीयल-टाइम इंटरैक्शन का 100% ग्रीन ऑटोमेटेड सत्यापन। |
| 16.32 | **AI & Chat Studio 7th Settings Tab & Download Consent Engine** | `src/context/LabContext.jsx`, `src/components/ControlCenterPanel.jsx`, `src/components/AIChatWidget.jsx`, `src/services/localAIService.js`, `scripts/verify_chat_settings_tab.mjs` | 7वां सेटिंग्स टैब, 5 क्लस्टर्स, गियर शॉर्टकट व सहमति डायलॉग | Control Center में 7वां टैब (`id: 'chat'`), 5 क्लस्टर्स (मॉडल इंजन, जेनरेशन, वॉइस, प्राइवेसी, UI), चैट हेडर से 1-क्लिक गियर शॉर्टकट, ऑन-डिवाइस मॉडल डाउनलोड सहमति मोडल (`role="dialog"`), तथा 0MB डिटरमिनिस्टिक इंजन फ़ॉलबैक। |
| 16.33 | **Chat UI Resilience, Error Boundary Recovery & Unified Deduplicated Suggestion Chips** | `src/components/AIChatWidget.jsx`, `src/components/ErrorBoundary.jsx`, `src/components/chat/SuggestionChipsDrawer.jsx`, `scripts/verify_chat_crash_fix.mjs`, `scripts/verify_chat_bubble_cleanup.mjs` | चैट UI रेजिलिएंस, फ्लोटिंग रिकवरी कार्ड व चिप डिडुप्लिकेशन | streaming idx स्कोप फिक्स (0 ReferenceErrors), ErrorBoundary द्वारा non-destructive फ्लोटिंग रिकवरी कार्ड (`role="alert"`) व 1-क्लिक "Reset / Reopen Chat" सपोर्ट, मैसेज बबल्स से इन-बबल वर्टिकल ऑप्शन स्टैक्स का विलोपन, कंपोजिट सेट (`id || label`) द्वारा `<SuggestionChipsDrawer>` में ऑप्शन चिप्स का एकीकरण व डिडुप्लिकेशन, और pb-5 एंटी-क्लिपिंग क्लीयरेंस। |
| 16.34 | **Clean, Minimal & Informative Chat Redesign, Quick Tools Popover & Single-Row Flex Carousel** | `src/components/AIChatWidget.jsx`, `src/components/chat/SuggestionChipsDrawer.jsx`, `scripts/verify_clean_minimal_chat.mjs` | मिनिमलिस्ट चैट आर्किटेक्चर, क्विक टूल्स पॉपओवर व सिंगल-रो कैरोसेल | हेडर से 8 बटनों को समेटकर सिंगल `•••` Quick Tools पॉपओवर मेन्यू (`showQuickTools`), 3 आवश्यक सब-हेडर पिल्स (Audience, Role Track, AI Model), मैसेज बबल्स में सिंगल-रो इनलाइन माइक्रो-टूलबार (टाइमस्टैम्प, कॉपी, TTS, थम्ब्स अप/डाउन, मॉडल बैज), `<SuggestionChipsDrawer>` को कैटेगरी टैब्स व कंपोजिट सेट डिडुप्लिकेशन के साथ सिंगल-रो फ्लेक्स कैरोसेल में रूपांतरण, और WCAG 2.1 AA 44px मिनिमम टच टार्गेट्स। |
| 16.35 | **Pure Icon-Only Sub-Header Strip & Pure Single-Row Chips Carousel** | `src/components/AIChatWidget.jsx`, `src/components/chat/SuggestionChipsDrawer.jsx`, `scripts/verify_icon_only_chat.mjs` | प्योर आइकन-ओनली सब-हेडर व प्योर सिंगल-रो कैरोसेल | सब-हेडर से सभी टेक्स्ट लेबल्स हटाकर 10 प्योर आइकन-ओनली बटन्स (28px स्क्वायर फुटप्रिंट, रिच टूलटिप्स, एक्टिव हॉलो, overflow-x-auto) लेफ्ट पर्सपेक्टिव (4 बटन्स) व राइट क्विक टूल्स (6 बटन्स), तथा `<SuggestionChipsDrawer>` से CATEGORY_TABS हटाकर प्योर सिंगल-रो फ्लेक्स कैरोसेल व 100% कंपोजिट सेट डिडुप्लिकेशन। |
| 16.36 | **In-Bubble Interactive Decision Tree Restoration & SmolLM2 On-Device Reliability** | `src/components/AIChatWidget.jsx`, `src/utils/deviceProfiler.js`, `src/services/localAIService.js`, `scripts/verify_decision_tree_and_smollm.mjs` | इन-बबल डिसीजन ट्री व SmolLM2 रिलायबिलिटी | मैसेज बबल्स के अंदर रिच डिसीजन ट्री कार्ड्स (`preferences_prompt`, `audience`, `role`, `viewMode`, `ai_model_switch`), परसिस्टेंट वेलकम प्रॉम्प्ट (हाँ, बदलें / नहीं, रहने दें), `onnx-community` मॉडल रिपॉजिटरीज़ (`SmolLM2-135M/360M`), तथा 45s डाउनलोड व 30s शेडर कंपाइलेशन वॉचडॉग्स। |
| 16.37 | **SmolLM2-135M Bare-Minimum Permanent Fix & Pure Percentage Badge Architecture** | `src/services/localAIService.js`, `src/workers/aiModelWorker.js`, `src/components/AIChatWidget.jsx`, `scripts/verify_smollm_permanent_fix.mjs` | बेयर-मिनिमम 135M मॉडल परमानेंट फिक्स, किल-स्विच एक्सेप्शन व प्योर % बैज | 950MB ओवरराइड्स (target = MODEL_CATALOG.MEDIUM) का स्थायी निष्कासन, SmolLM2-135M (~90MB) को स्लो परफॉरमेंस किल-स्विच से पूर्ण छूट, सहमति मोडल व ⚡ टॉगल को सीधे loadModel(bareModel) से वायरिंग, isOpen डाउनलोड ट्रिगर से अंतर्विरोधी isAiOn गेट का विलोपन, और सब-हेडर डाउनलोड बैज को बिना शब्द लेबल्स के प्योर प्रतिशत (${progress}%) में सुसज्जित करना। |
| 16.38 | **Model Selection Restructuring & Universal Browser Load Fix** | `src/components/AIChatWidget.jsx`, `src/workers/aiModelWorker.js`, `src/services/localAIService.js`, `scripts/verify_model_list_and_browser_load.mjs` | डिसीजन ट्री में SmolLM2-135M #1 पोज़िशन, AI Off कार्ड विलोपन, सिंगल-थ्रेडेड WASM व बाइडायरेक्शनल फ़ॉलबैक | AI मॉडल डिसीजन ट्री में SmolLM2-135M को पोजीशन #1 पर डिफ़ॉल्ट व अनुशंसित मॉडल (`🛡️ डिफ़ॉल्ट व अनुशंसित मॉडल [SmolLM-135M]`) के रूप में स्थापित करना, डुप्लिकेट 'AI ऑफ करें' कार्ड को हटाकर सब-हेडर ⚡ बटन पर सौंपना, `aiModelWorker.js` में `env.backends.onnx.wasm.numThreads = 1` द्वारा सभी ब्राउज़रों में `SharedArrayBuffer` क्रैश का पूर्ण निवारण, WebGPU <-> WASM बाइडायरेक्शनल फ़ॉलबैक, और `localAIService.js` में `navigator.gpu` की सीधी जांच से WebGPU को तत्काल प्राथमिकता। |

---

<a id="summary-matrix"></a>
## 📊 संपूर्ण फीचर्स सारांश एवं गणना मैट्रिक्स (Comprehensive Summary Matrix)

| मॉड्यूल (Module) | मुख्य डोमेन (Core Domain) | शामिल कंपोनेंट्स / फ़ाइलें (Files Involved) | कुल प्रलेखित फीचर्स (Total Documented Features) |
| :---: | :--- | :--- | :---: |
| **Module 1** | कोर लेआउट और UI सेक्शन्स (Core Layout & UI Sections) | `Navbar`, `HeroSection`, `TechMarqueeBanner`, `AboutSection`, `SkillsSection`, `ExperienceSection`, `ProjectsSection`, `CodingAchievementsSection`, `SocialProofSection`, `ContactSection`, `Footer`, `ScrollProgressBar`, `BackToTopButton`, `FloatingWhatsAppButton`, `FloatingSimpleModeToggle`, `AnimatedCounter`, `AriaLiveAnnouncer` | **65 Features** |
| **Module 2** | कस्टम कर्सर सिस्टम और डायनामिक एनिमेशन्स (Custom Cursors & Kinematics) | `DynamicCursorManager`, `ButterflyCursor`, `FireflyCursor`, `StardustCursor`, `AirplaneCursor`, `LaserCursor`, `CameraCursor`, `MinimalCursor`, `ModularKinematicCursor`, `kinematicProfiles.js`, `cursorConstants.js`, `CursorSelectorRibbon`, `CursorIcon` + **All 35 Cursors** | **35 Cursors + 20 Core Engine Features (= 55 Features)** |
| **Module 3** | लैब स्टूडियो, डेमो मोड्स और स्पेशल फीचर्स (Lab Studio, Demo Modes & Special Features) | `LabStudioDrawer`, `ControlCenterPanel`, `InteractivePlayground`, `CameraRollGallery`, `polaroidExport.js`, `LeafletOfflineMap`, `OfflineMapSnapshot`, `ResumeDropdown`, `resumeConfig.js`, `RoleEmptyState`, `RoleTabsBar`, `ExploreSubBar` | **75 Features (54 Base + 18 3D Spatial Studio & Navigation Features + 3 Modular Sandbox Viewport Components)** |
| **Module 4** | एक्सेसिबिलिटी, थीम और यूजर कंट्रोल्स (Accessibility, Theme & User Controls) | `CommandPalette`, `fuzzySearch.js`, `searchCatalog.js`, `ThemeContext`, `HighContrastContext`, `high-contrast.css`, `SimpleModeContext`, `simple-mode.css`, `useFocusTrap`, `useBodyScrollLock`, `useDesktopCursorSupport`, `AnnouncerContext`, `LanguageContext` | **30 Core Controls + 12 Keyboard Shortcuts (= 42 Features)** |
| **Module 5** | स्टेट मैनेजमेंट, हुक्स, ऑडियो इंजन और कोर यूटिलिटीज (State Management, Hooks, Audio Engine & Core Utilities) | `RoleContext`, `LabContext`, `useDraggableCharacter`, `useGyroscopeTracking`, `audio.js` (Web Audio Synthesizer), `cursorConstants.js`, `fuzzySearch.js`, `searchCatalog.js`, `resumeConfig.js`, `testimonialsConfig.js`, `polaroidExport.js`, `soundFX.js`, `useScrollRestoration.js`, `portfolioAssistantEngine.js` | **52 Core Utilities & Engine Features** |
| **Module 6** | बिल्ड, परफॉरमेंस, डेव टूल्स और कॉन्फ़िगरेशन सिस्टम (Build, Performance, Dev Tools & Configuration System) | `vite.config.js`, `package.json`, `.oxlintrc.json`, `index.html`, `start-server.bat`, `download_osm_tiles.mjs`, `generate_real_maps.mjs`, `generate_resume.js`, `public/.nojekyll`, `scripts/` (105+ Verification Suites & 50 CI Tests), `lazyWithRetry.js`, `SectionSkeleton.jsx`, `GISMapSkeleton.jsx`, `CaseStudyDrawerContent.jsx`, `verify_hero_poses_progressive_loading.mjs`, `useDraggableCharacter.js`, `HeroSection.jsx`, `ButterflyCursor.jsx`, `FireflyCursor.jsx`, `ModularKinematicCursor.jsx`, `RoleContext.jsx`, `TechMarqueeBanner.jsx`, `Navbar.jsx`, `NavbarTooltip.jsx`, `src/index.css`, `LeafletOfflineMap.jsx`, `ContactSection.jsx`, `ErrorBoundary.jsx`, `scripts/test_refresh_resilience.mjs`, `scripts/verify_gap4_blueprint_wireframe.mjs`, `scripts/verify_phase4_exploded_strata.mjs`, `scripts/verify_phase5_physics_pad.mjs`, `scripts/verify_gap5_drawer_ergonomics.mjs`, `scripts/verify_leaflet_map.mjs`, `scripts/test_challenger_map_ui.mjs` | **69 Build, Test, Fault Isolation, Scroll Lock, Exclusivity & Resilience Features** |
| **Module 7** | डेवलपर टर्मिनल सीएलआई एवं पावर पैक सिस्टम (Developer Terminal CLI & Power Pack System) | `TerminalCLI.jsx`, `audio.js`, `Navbar.jsx`, `ExploreSubBar.jsx`, `App.jsx`, `test_terminal_cli_adversarial.mjs`, `verify_terminal_cli.mjs` | **19 Terminal CLI & Power Pack Features** |
| **Module 8** | केस स्टडीज आर्किटेक्चर एवं लाइव टेलीमेट्री सिमुलेटर (Interactive Case Studies & Telemetry Simulators) | `caseStudiesData.js`, `CaseStudyDrawer.jsx`, `CaseStudySimulator.jsx`, `CaseStudyArchitecture.jsx`, `ProjectsSection.jsx`, `verify_case_studies.mjs` | **15 Case Study Dossier & Telemetry Features** |
| **Module 9** | बहुभाषी स्थानीयकरण एवं वॉइस कोऑर्डिनेशन (Multilingual Localization & Translation System) | `LanguageContext.jsx`, `translations.js`, `Navbar.jsx`, `ContactSection.jsx`, `SkillsSection.jsx`, `ExperienceSection.jsx`, `ProjectsSection.jsx`, `FAQSection.jsx` | **11 Multilingual Localization Features** |
| **Module 10** | ऑडियंस व्यक्तित्व फ़िल्टर एवं व्यू मोड सिस्टम (Audience Persona Filter & View Mode Engine) | `AudienceContext.jsx`, `AudienceFloatingPill.jsx`, `AudienceSubBar.jsx`, `ViewModeContext.jsx`, `ViewModeFloatingPill.jsx`, `ViewModeSubBar.jsx`, `verify_audience_filter.mjs`, `verify_view_mode.mjs` | **16 Audience Filter & View Mode Features** |
| **Module 11** | सेंट्रलाइज्ड मास्टर फ्लोटिंग एक्शन हब एवं एआई चैट असिस्टेंट (Floating Action Hub & AI Chat Widget) | `FloatingActionHub.jsx`, `AIChatWidget.jsx`, `soundFX.js`, `portfolioAssistantEngine.js`, `verify_floating_action_hub.mjs`, `verify_ai_chat_feature.mjs`, `verify_decision_tree_ai_chat.mjs` | **20 Centralized FAB, AI Chat, Decision Tree & Tone Features** |
| **Module 12** | 40-आइटम FAQ सूचना प्रणाली एवं एसईओ स्ट्रक्चर्ड डेटा (FAQ System & Schema.org JSON-LD) | `FAQSection.jsx`, `faqConfig.js`, `verify_faq_section.mjs` | **10 FAQ System & SEO Structured Features** |
| **Module 13** | डिजिटल बिजनेस कार्ड, प्योर SVG डायनामिक QR एवं कोटेशन कैलकुलेटर (Digital Business Card, vCard, QR & Quotation Estimator) | `DigitalBusinessCardModal.jsx`, `vcardGenerator.js`, `QuotationEstimatorModal.jsx`, `CredentialLightboxModal.jsx`, `ContactSection.jsx`, `verify_fresh_features.mjs` | **14 Digital Card, QR, vCard & Estimator Features** |
| **Module 14** | स्टैंडअलोन फुलस्क्रीन कंट्रोल सेंटर स्टूडियो एवं डीप-लिंकिंग आर्किटेक्चर (Standalone Fullscreen Control Center Studio & Deep Linking) | `ControlCenterFullView.jsx`, `App.jsx`, `InteractivePlayground.jsx`, `ControlCenterPanel.jsx`, `verify_control_center_standalone_view.mjs`, `verify_stream_a_url_panel.mjs`, `test_theme_lang_two_tier_control.mjs` | **8 Standalone Studio & Deep Linking Features** |
| **Module 15** | ऑन-डिवाइस लोकल LLM न्यूरल एआई इंजन एवं हार्डवेयर प्रोफाइलर (On-Device Local LLM AI Engine & Hardware Profiler) | `localAIService.js`, `aiModelWorker.js`, `deviceProfiler.js`, `AIChatWidget.jsx`, `package.json`, `verify_on_device_ai.mjs` | **10 On-Device Neural LLM & Hardware Profiler Features** |
| **Module 16** | एआई चैट संपूर्ण 12-चरणीय एन्हांसमेंट, एजेंटिक एवं वॉइस स्टूडियो सुइट (Master AI Chat Enhancement, Agentic & Voice Studio Suite - Phases 1 to 12) | `AIChatWidget.jsx`, `FormattedMessage.jsx`, `SuggestionChipsDrawer.jsx`, `SlashCommandPalette.jsx`, `portfolioContextMemory.js`, `portfolioAssistantEngine.js`, `localAIService.js`, `aiModelWorker.js`, `chatExportEngine.js`, `chatSessionStorage.js`, `chatAnalytics.js`, `chatTourEngine.js`, `portfolioSemanticIndex.js`, `ChatActionCard.jsx`, `voiceAgentEngine.js`, `VoiceVisualizerWaveform.jsx`, `ControlCenterPanel.jsx`, `LabContext.jsx`, `verify_phase10_chat_agent.mjs`, `verify_phase11_voice_agent.mjs`, `verify_chat_settings_tab.mjs`, `verify_clean_minimal_chat.mjs`, `verify_icon_only_chat.mjs`, `verify_decision_tree_and_smollm.mjs`, `verify_smollm_permanent_fix.mjs` | **36 Master AI Chat Full-Stack, Agentic, Voice, Meta-Prompt, Tab 7 Settings, Clean Redesign, Icon-Only, In-Bubble Decision Tree & Bare-Minimum SmolLM2 Features** |
| **Total** | **Interactive Cursor-Tracking Portfolio Suite** | **Entire Codebase (225+ Files Analyzed & Documented Across 16 Modules)** | **517 Granular Production Features Documented (530+ with Micro-Interactions)** |

---

> **प्रमाणन एवं अखंडता नोट (Certification & Integrity):**  
> यह दस्तावेज़ 'Interactive Cursor-Tracking Portfolio' की संपूर्ण कार्यप्रणाली, कोड आर्किटेक्चर, माइक्रो-इंटरैक्शंस और स्टेट फ्लो को 100% सटीकता के साथ प्रमाणित करता है। भविष्य के किसी भी संशोधन या फीचर विस्तार के समय यह दस्तावेज़ मास्टर मेमोरी के रूप में संदर्भ हेतु उपयोग किया जाएगा।
