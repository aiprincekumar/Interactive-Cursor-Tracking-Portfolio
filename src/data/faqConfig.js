/**
 * Master FAQ Configuration & Bilingual Knowledge Base
 * Structured across 4 Audience perspectives and 4 Role Specializations
 * Includes actionable deep-linking CTAs (Case Studies, Credentials, Fee Estimator, AI Chat, Contact)
 */

export const FAQ_CONFIG = {
  sectionId: 'faq',
  eyebrowNumber: '09',
  eyebrowText: 'FAQ & Knowledge Base',
  eyebrowText_hi: 'सामान्य प्रश्न व ज्ञानकोश',
  titlePrefix: 'Frequently Asked',
  titlePrefix_hi: 'अक्सर पूछे जाने वाले',
  titleHighlight: 'Questions',
  titleHighlight_hi: 'प्रश्न (FAQ)',
  titleSuffix: '& Direct Answers.',
  titleSuffix_hi: 'एवं स्पष्ट उत्तर।',
  subtitle: 'Clear, transparent answers on technical architecture, statutory tax compliance, hiring availability, freelancing scope, and matrimonial background.',
  subtitle_hi: 'तकनीकी आर्किटेक्चर, वैधानिक कर अनुपालन, करियर उपलब्धता, फ्रीलांसिंग स्कोप और पारिवारिक पृष्ठभूमि पर पारदर्शी एवं प्रामाणिक उत्तर।'
};

export const FAQ_AUDIENCE_TABS = [
  {
    id: 'all',
    label: 'All Queries',
    label_hi: 'सभी प्रश्न',
    icon: 'Globe',
    badge: 'Full Directory',
    badge_hi: 'संपूर्ण निर्देशिका'
  },
  {
    id: 'recruiter',
    label: 'Recruiter / Job',
    label_hi: 'रिक्रूटर / करियर',
    icon: 'Briefcase',
    badge: 'Hiring Focus',
    badge_hi: 'हायरिंग फोकस'
  },
  {
    id: 'client',
    label: 'Freelancer / Client',
    label_hi: 'फ्रीलांसर / क्लाइंट',
    icon: 'Handshake',
    badge: 'Services & Scope',
    badge_hi: 'सेवाएं एवं डिलीवरी'
  },
  {
    id: 'general',
    label: 'General / Polymath',
    label_hi: 'सामान्य / पॉलीमैथ',
    icon: 'Sparkles',
    badge: 'Philosophy & Tracks',
    badge_hi: 'विचारधारा व ट्रैक्स'
  },
  {
    id: 'marriage',
    label: 'Marriage / Matrimonial',
    label_hi: 'विवाह / मैट्रिमोनियल',
    icon: 'Heart',
    badge: 'Personal & Family',
    badge_hi: 'पारिवारिक व व्यक्तिगत'
  }
];

export const FAQ_ROLE_TABS = [
  {
    id: 'all',
    label: 'All Roles',
    label_hi: 'सभी भूमिकाएं',
    icon: 'LayoutGrid',
    accent: '#6366F1'
  },
  {
    id: 'accountant',
    label: 'Accountant & Tax',
    label_hi: 'अकाउंटेंट एवं टैक्स',
    icon: 'Briefcase',
    accent: '#FF4D6D'
  },
  {
    id: 'mis',
    label: 'MIS & Operations',
    label_hi: 'MIS एवं ऑपरेशंस',
    icon: 'BarChart2',
    accent: '#3B82F6'
  },
  {
    id: 'vibe_coding',
    label: 'Vibe Coding & AI',
    label_hi: 'Vibe Coding एवं AI',
    icon: 'Terminal',
    accent: '#10B981'
  }
];

export const FAQ_ITEMS = [
  // =========================================================================
  // 1. RECRUITER / JOB PERSPECTIVE (15 Total Items)
  // =========================================================================

  // --- Recruiter + Vibe Coding (6 Items) ---
  {
    id: 'rec-vibe-autonomous-stack',
    question: 'What is your autonomous coding stack and AI agent development workflow?',
    question_hi: 'आपका ऑटोनॉमस कोडिंग स्टैक और AI एजेंट विकास वर्कफ़्लो क्या है?',
    answer: 'I implement an advanced AI-native engineering loop combining Antigravity SDK, Claude Code, and Cursor. Rather than basic line-by-line copilot completion, I architect spec-driven systems, manage autonomous subagent teams (parallelizing research, code generation, and adversary verification passes), and enforce strict test-driven feedback loops. This delivers production-ready features with high velocity while maintaining zero-defect standards.',
    answer_hi: 'मैं एंटीग्रेविटी SDK, क्लॉड कोड और कर्सर को मिलाकर एक उन्नत AI-नेगेटिव इंजीनियरिंग लूप संचालित करता हूँ। केवल बुनियादी लाइन-दर-लाइन ऑटो-कम्प्लीशन के बजाय, मैं विनिर्देश-आधारित (spec-driven) सिस्टम्स डिज़ाइन करता हूँ, स्वायत्त सब-एजेंट टीमों का समन्वय करता हूँ (रिसर्च, कोड निर्माण और एडवर्सरी सत्यापन को समानांतर चलाते हुए), और सख्त टेस्ट-ड्रिवेन फीडबैक लूप लागू करता हूँ। यह शून्य-दोष मानकों के साथ उच्च गति से डिलीवरी सुनिश्चित करता है।',
    audience: ['recruiter'],
    role: ['vibe_coding'],
    categoryTag: 'Autonomous AI',
    categoryTag_hi: 'स्वायत्त AI',
    actionCTA: {
      type: 'case_study',
      target: '08',
      label: 'Inspect Autonomous Workflow #08',
      label_hi: 'ऑटोनॉमस वर्कफ़्लो #08 देखें'
    }
  },
  {
    id: 'rec-vibe-react19-vite',
    question: 'How do you leverage React 19, Tailwind CSS v4, and Vite in high-performance production apps?',
    question_hi: 'आप उच्च-प्रदर्शन प्रोडक्शन ऐप्स में React 19, Tailwind CSS v4 और Vite का उपयोग कैसे करते हैं?',
    answer: 'I utilize React 19 modern hooks, Compiler optimizations, and suspense boundaries alongside Tailwind CSS v4 for zero-runtime CSS overhead. The Vite build pipeline is configured with sub-second HMR, tree-shaking, and asset minification. I enforce strict typing, WAI-ARIA accessibility compliance, and oxlint validation, consistently scoring 98+ on Lighthouse across performance, SEO, and accessibility metrics.',
    answer_hi: 'मैं React 19 के आधुनिक हुक्स, कंपाइलर ऑप्टिमाइज़ेशन्स और सस्पेंस बाउंड्रीज़ का उपयोग शून्य रनटाइम ओवरहेड वाले Tailwind CSS v4 के साथ करता हूँ। Vite बिल्ड पाइपलाइन को सब-सेकंड HMR, ट्री-शेकिंग और एसेट मिनिमाइज़ेशन के साथ कॉन्फ़िगर किया गया है। मैं सख्त टाइपिंग, WAI-ARIA एक्सेसिबिलिटी अनुपालन और oxlint सत्यापन लागू करता हूँ, जिससे परफॉरमेंस, SEO और एक्सेसिबिलिटी में लगातार 98+ लाइटहाउस स्कोर मिलते हैं।',
    audience: ['recruiter'],
    role: ['vibe_coding'],
    categoryTag: 'Web Architecture',
    categoryTag_hi: 'वेब आर्किटेक्चर',
    actionCTA: {
      type: 'case_study',
      target: '07',
      label: 'Inspect SaaS Generator #07',
      label_hi: 'SaaS जनरेटर #07 देखें'
    }
  },
  {
    id: 'rec-vibe-notice-period-remote',
    question: 'What is your notice period, and are you open to remote or hybrid relocation?',
    question_hi: 'आपका नोटिस पीरियड क्या है, और क्या आप रिमोट या हाइब्रिड रीलोकेशन के लिए तैयार हैं?',
    answer: 'I am available immediately (0 to 15 days notice) for full-time engineering or consulting roles. My home engineering station features redundant 1 Gbps fiber broadband and industrial UPS power backup for 100% remote continuity. I am also completely flexible to relocate for high-impact hybrid or onsite opportunities in Bangalore, Hyderabad, NCR, Pune, or other metropolitan tech hubs.',
    answer_hi: 'मैं पूर्णकालिक इंजीनियरिंग या कंसल्टिंग पदों के लिए तत्काल (0 से 15 दिन का नोटिस) उपलब्ध हूँ। मेरा होम इंजीनियरिंग स्टेशन 100% रिमोट निरंतरता के लिए 1 Gbps फाइबर ब्रॉडबैंड और औद्योगिक UPS बैकअप से सुसज्जित है। मैं बैंगलोर, हैदराबाद, एनसीआर, पुणे या अन्य प्रमुख तकनीकी केंद्रों में हाई-इम्पैक्ट हाइब्रिड या ऑनसाइट भूमिकाओं के लिए रीलोकेट होने हेतु भी पूरी तरह तैयार हूँ।',
    audience: ['recruiter'],
    role: ['vibe_coding'],
    categoryTag: 'Career & Availability',
    categoryTag_hi: 'करियर एवं उपलब्धता',
    actionCTA: {
      type: 'contact',
      target: '#contact',
      label: 'Initiate Hiring Discussion',
      label_hi: 'हायरिंग वार्ता शुरू करें'
    }
  },
  {
    id: 'rec-vibe-github-repos',
    question: 'Where can I inspect your GitHub repositories, code discipline, and CLI tooling?',
    question_hi: 'मैं आपकी GitHub रिपॉजिटरीज़, कोड अनुशासन और CLI टूलींग का निरीक्षण कहाँ कर सकता हूँ?',
    answer: 'You can explore my GitHub profile featuring production-grade repositories with conventional commit histories, comprehensive test suites, and clean modular structures. You can also press the tilde key (~) right now inside this portfolio to launch the embedded Developer Terminal CLI, inspecting system environment variables, memory status, and git telemetry.',
    answer_hi: 'आप मेरे GitHub प्रोफाइल का अन्वेषण कर सकते हैं, जिसमें कन्वेंशनल कमिट हिस्ट्री, व्यापक टेस्ट सूट्स और साफ मॉड्यूलर संरचना वाले प्रोडक्शन-ग्रेड कोड शामिल हैं। आप सिस्टम पर्यावरण चर, मेमोरी स्थिति और गिट टेलीमेट्री का निरीक्षण करने के लिए इस पोर्टफोलियो में अभी टिल्ड कुंजी (~) दबाकर एम्बेडेड डेवलपर टर्मिनल CLI भी लॉन्च कर सकते हैं।',
    audience: ['recruiter'],
    role: ['vibe_coding'],
    categoryTag: 'Engineering Proof',
    categoryTag_hi: 'इंजीनियरिंग साक्ष्य',
    actionCTA: {
      type: 'ai_chat',
      target: 'ai_chat',
      label: 'Ask AI Copilot for Code Tour',
      label_hi: 'AI कोपायलट से कोड टूर मांगें'
    }
  },
  {
    id: 'rec-vibe-code-quality-testing',
    question: 'What are your testing standards, linting rules, and code verification benchmarks?',
    question_hi: 'आपके टेस्टिंग मानक, लिंटिंग नियम और कोड सत्यापन बेंचमार्क क्या हैं?',
    answer: 'I treat testing and static analysis as non-negotiable verification gates. I implement automated test suites using Vitest, maintain zero-defect oxlint standards with zero compiler warnings, and enforce strict TypeScript/ESLint discipline. Every feature undergoes automated unit testing, end-to-end integration validation, and accessibility (a11y) audits before merging, preventing regression bugs and ensuring long-term maintainability.',
    answer_hi: 'मैं टेस्टिंग और स्टैटिक एनालिसिस को गैर-परक्राम्य सत्यापन गेट मानता हूँ। मैं Vitest का उपयोग करके स्वचालित टेस्ट सूट लागू करता हूँ, शून्य कंपाइलर चेतावनियों के साथ शून्य-दोष oxlint मानकों को बनाए रखता हूँ, और सख्त TypeScript/ESLint अनुशासन का पालन करता हूँ। प्रत्येक फीचर मर्ज होने से पहले स्वचालित यूनिट टेस्टिंग, एंड-टू-एंड इंटीग्रेशन सत्यापन और एक्सेसिबिलिटी (a11y) ऑडिट से गुजरता है, जिससे रीग्रेशन बग्स रुकते हैं।',
    audience: ['recruiter'],
    role: ['vibe_coding'],
    categoryTag: 'Quality Assurance',
    categoryTag_hi: 'गुणवत्ता आश्वासन',
    actionCTA: {
      type: 'case_study',
      target: '08',
      label: 'Inspect Agent Workflow #08',
      label_hi: 'एजेंट वर्कफ़्लो #08 देखें'
    }
  },
  {
    id: 'rec-vibe-system-design-mvp',
    question: 'How do you approach full-stack system architecture and end-to-end MVP delivery?',
    question_hi: 'आप फुल-स्टैक सिस्टम आर्किटेक्चर और एंड-टू-एंड MVP डिलीवरी को कैसे क्रियान्वित करते हैं?',
    answer: 'I follow a spec-first, component-driven approach. I begin by defining normalized data models, API schemas, and state contracts, followed by clean modular UI component hierarchies. Leveraging modern build tooling like Vite with sub-second HMR, defensive boundary handling, and optimized asset chunking, I convert high-level requirements into scalable, production-ready web platforms with extreme speed and zero technical debt.',
    answer_hi: 'मैं एक स्पेक-फर्स्ट, कंपोनेंट-संचालित दृष्टिकोण का पालन करता हूँ। मैं सामान्यीकृत डेटा मॉडल, API स्कीमा और स्टेट अनुबंधों को परिभाषित करने से शुरुआत करता हूँ, जिसके बाद स्वच्छ मॉड्यूलर UI कंपोनेंट पदानुक्रम आता है। सब-सेकंड HMR, रक्षात्मक बाउंड्री हैंडलिंग और अनुकूलित एसेट चंकिंग के साथ Vite जैसे आधुनिक बिल्ड टूलींग का लाभ उठाते हुए, मैं उच्च-स्तरीय आवश्यकताओं को बिना किसी तकनीकी ऋण के स्केलेबल, प्रोडक्शन-रेडी वेब प्लेटफॉर्म में बदल देता हूँ।',
    audience: ['recruiter'],
    role: ['vibe_coding'],
    categoryTag: 'System Architecture',
    categoryTag_hi: 'सिस्टम आर्किटेक्चर',
    actionCTA: {
      type: 'case_study',
      target: '07',
      label: 'Inspect Architecture in Case Study #07',
      label_hi: 'केस स्टडी #07 में आर्किटेक्चर देखें'
    }
  },

  // --- Recruiter + Accountant & Tax (5 Items) ---
  {
    id: 'rec-acc-gst-statutory-filing',
    question: 'What is your volume of experience with GSTR-1, GSTR-3B, GSTR-9/9C, and TDS/TCS filings?',
    question_hi: 'GSTR-1, GSTR-3B, GSTR-9/9C और TDS/TCS फाइलिंग में आपका प्रत्यक्ष अनुभव कितना है?',
    answer: 'Over 7+ years of active practice, I have personally filed and verified 500+ statutory returns across trading, manufacturing, and service entities with a 100% on-time record and zero departmental penalty notices. I implement automated multi-point reconciliation between GSTR-2B and purchase ledgers under Section 16(2)(aa), securing over ₹2.5 Crore in verified Input Tax Credits.',
    answer_hi: '7+ वर्षों के सक्रिय अभ्यास में, मैंने 100% समय पर रिकॉर्ड और शून्य विभागीय जुर्माना नोटिस के साथ व्यापार, विनिर्माण और सेवा क्षेत्रों में 500+ वैधानिक रिटर्न दाखिल और सत्यापित किए हैं। मैं धारा 16(2)(aa) के तहत GSTR-2B और खरीद बहीखातों के बीच स्वचालित समाधान लागू करता हूँ, जिससे ₹2.5 करोड़ से अधिक का सत्यापित इनपुट टैक्स क्रेडिट सुरक्षित हुआ है।',
    audience: ['recruiter'],
    role: ['accountant'],
    categoryTag: 'Statutory Taxation',
    categoryTag_hi: 'वैधानिक कराधान',
    actionCTA: {
      type: 'case_study',
      target: '01',
      label: 'Inspect GST Engine Case Study #01',
      label_hi: 'GST इंजन केस स्टडी #01 देखें'
    }
  },
  {
    id: 'rec-acc-tally-prime-audit',
    question: 'How do you handle balance sheet finalization and statutory audit liaisons in Tally Prime ERP?',
    question_hi: 'Tally Prime ERP में आप बैलेंस शीट फाइनलाइजेशन और वैधानिक ऑडिट समन्वय कैसे संभालते हैं?',
    answer: 'I oversee complete trial balance sanitization, ledger scrutiny, bank reconciliations (BRS), and inventory valuations. During annual statutory and tax audits, I liaise directly with Chartered Accountants, preparing structured audit workpapers, Form 26AS/AIS/TIS reconciliations, and Section 44AB tax audit schedules, reducing audit closure turnaround by over 50%.',
    answer_hi: 'मैं संपूर्ण ट्रायल बैलेंस शुद्धिकरण, लेजर जांच, बैंक समाधान (BRS) और इन्वेंटरी मूल्यांकन की देखरेख करता हूँ। वार्षिक वैधानिक और टैक्स ऑडिट के दौरान, मैं चार्टर्ड अकाउंटेंट्स के साथ सीधे समन्वय करता हूँ, संरचित ऑडिट वर्कपेपर्स, फॉर्म 26AS/AIS/TIS समाधान और धारा 44AB टैक्स ऑडिट शेड्यूल तैयार करता हूँ, जिससे ऑडिट क्लोजर का समय 50% से अधिक कम हो जाता है।',
    audience: ['recruiter'],
    role: ['accountant'],
    categoryTag: 'Audit & Accounting',
    categoryTag_hi: 'ऑडिट एवं लेखांकन',
    actionCTA: {
      type: 'credentials',
      target: 'edu-adca',
      label: 'View Verified ADCA Credential',
      label_hi: 'सत्यापित ADCA प्रमाणपत्र देखें'
    }
  },
  {
    id: 'rec-acc-location-jharkhand',
    question: 'Are you based in Medininagar/Palamu, and can you manage multi-branch or relocated corporate accounts?',
    question_hi: 'क्या आप मेदिनीनगर/पलामू में स्थित हैं, और क्या आप बहु-शाखा या रीलोकेटेड कॉर्पोरेट खाते संभाल सकते हैं?',
    answer: 'Yes, while headquartered in Medininagar (Palamu, Jharkhand), I have managed accounts across multi-branch distribution networks in Jharkhand, Bihar, and West Bengal. I am proficient with cloud-hosted Tally on AWS, remote portal filings, and ready to relocate for corporate accounting, controller, or financial operations roles in major commercial centers.',
    answer_hi: 'हाँ, हालाँकि मेरा मुख्यालय मेदिनीनगर (पलामू, झारखंड) में है, मैंने झारखंड, बिहार और पश्चिम बंगाल में बहु-शाखा वितरण नेटवर्क के खातों का प्रबंधन किया है। मैं AWS पर क्लाउड-होस्टेड Tally और रिमोट पोर्टल फाइलिंग में दक्ष हूँ तथा प्रमुख वाणिज्यिक केंद्रों में कॉर्पोरेट अकाउंटिंग, कंट्रोलर या वित्तीय परिचालन भूमिकाओं के लिए रीलोकेट होने हेतु तैयार हूँ।',
    audience: ['recruiter'],
    role: ['accountant'],
    categoryTag: 'Mobility & Relocation',
    categoryTag_hi: 'गतिशीलता एवं रीलोकेशन',
    actionCTA: {
      type: 'contact',
      target: '#contact',
      label: 'Inquire About Corporate Relocation',
      label_hi: 'कॉर्पोरेट रीलोकेशन पर चर्चा करें'
    }
  },
  {
    id: 'rec-acc-tds-tcs-compliance',
    question: 'How do you ensure zero-defect TDS and TCS compliance under Sections 194C, 194J, and 194Q?',
    question_hi: 'आप धारा 194C, 194J और 194Q के तहत शून्य-दोष TDS एवं TCS अनुपालन कैसे सुनिश्चित करते हैं?',
    answer: 'I manage end-to-end withholding tax compliance, from vendor rate categorization and threshold monitoring (such as ₹50 Lakh limits under 194Q/206C(1H)) to quarterly e-filing of Form 24Q and 26Q. I execute automated cross-reconciliation against TRACES portals, Form 26AS, and AIS/TIS data, eliminating short-deduction notices and ensuring timely issuance of Form 16/16A certificates.',
    answer_hi: 'मैं वेंडर दर वर्गीकरण और थ्रेशोल्ड निगरानी (जैसे 194Q/206C(1H) के तहत ₹50 लाख की सीमा) से लेकर फॉर्म 24Q और 26Q के त्रैमासिक ई-फाइलिंग तक एंड-टू-एंड विदहोल्डिंग टैक्स अनुपालन का प्रबंधन करता हूँ। मैं TRACES पोर्टल, फॉर्म 26AS और AIS/TIS डेटा के खिलाफ स्वचालित समाधान निष्पादित करता हूँ, जिससे शॉर्ट-डिडक्शन नोटिस समाप्त होते हैं और फॉर्म 16/16A प्रमाणपत्र समय पर जारी होते हैं।',
    audience: ['recruiter'],
    role: ['accountant'],
    categoryTag: 'TDS & Direct Tax',
    categoryTag_hi: 'TDS एवं प्रत्यक्ष कर',
    actionCTA: {
      type: 'case_study',
      target: '01',
      label: 'Inspect Tax Compliance Engine #01',
      label_hi: 'टैक्स अनुपालन इंजन #01 देखें'
    }
  },
  {
    id: 'rec-acc-internal-controls-audit',
    question: 'What methodologies do you implement for internal financial controls and cash flow audits?',
    question_hi: 'आप आंतरिक वित्तीय नियंत्रण और नकदी प्रवाह (कैश फ्लो) ऑडिट के लिए कौन सी कार्यप्रणाली लागू करते हैं?',
    answer: 'I establish multi-tiered internal verification matrices: voucher authorization rules, perpetual stock verification routines, maker-checker authorization protocols, and daily 3-way cash-to-ledger cross-checks. By instituting periodic variance analysis between projected operating expenses and actual bank debits, I ensure maximum liquidity transparency and prevent financial leakage across multi-department operations.',
    answer_hi: 'मैं बहुस्तरीय आंतरिक सत्यापन मेट्रिक्स स्थापित करता हूँ: वाउचर प्राधिकरण नियम, सतत स्टॉक सत्यापन दिनचर्या, मेकर-चेकर प्रोटोकॉल, और दैनिक 3-वे कैश-टू-लेजर जांच। अनुमानित परिचालन व्यय और वास्तविक बैंक निकासी के बीच आवधिक विचरण विश्लेषण (variance analysis) स्थापित करके, मैं अधिकतम तरलता पारदर्शिता सुनिश्चित करता हूँ और वित्तीय रिसाव को रोकता हूँ।',
    audience: ['recruiter'],
    role: ['accountant'],
    categoryTag: 'Financial Controls',
    categoryTag_hi: 'वित्तीय नियंत्रण',
    actionCTA: {
      type: 'case_study',
      target: '02',
      label: 'Inspect Audit Trail Case Study #02',
      label_hi: 'ऑडिट ट्रेल केस स्टडी #02 देखें'
    }
  },

  // --- Recruiter + MIS & Operations (4 Items) ---
  {
    id: 'rec-mis-day-nulm-portal',
    question: 'What was your operational scope with the DAY-NULM Skill India government mission portal?',
    question_hi: 'DAY-NULM Skill India सरकारी मिशन पोर्टल पर आपका परिचालन दायरा क्या था?',
    answer: 'As Senior MIS Executive, I orchestrated the end-to-end data lifecycle for the Deendayal Antyodaya Yojana - National Urban Livelihoods Mission (DAY-NULM). This involved enrolling 5,000+ candidates, monitoring biometric AEBAS attendance across multi-district training centers, producing batch milestone analytics for state authorities, and ensuring 100% compliance during departmental audit inspections.',
    answer_hi: 'वरिष्ठ MIS अधिशासी के रूप में, मैंने दीनदयाल अंत्योदय योजना - राष्ट्रीय शहरी आजीविका मिशन (DAY-NULM) के संपूर्ण डेटा जीवनचक्र का संचालन किया। इसमें 5,000+ उम्मीदवारों का नामांकन, बहु-जिला प्रशिक्षण केंद्रों में बायोमेट्रिक AEBAS उपस्थिति की निगरानी, राज्य अधिकारियों के लिए बैच माइलस्टोन विश्लेषण और विभागीय ऑडिट निरीक्षणों के दौरान 100% अनुपालन सुनिश्चित करना शामिल था।',
    audience: ['recruiter'],
    role: ['mis'],
    categoryTag: 'Government MIS',
    categoryTag_hi: 'सरकारी MIS',
    actionCTA: {
      type: 'case_study',
      target: '03',
      label: 'Inspect DAY-NULM Case Study #03',
      label_hi: 'DAY-NULM केस स्टडी #03 देखें'
    }
  },
  {
    id: 'rec-mis-biometric-integrity',
    question: 'How do you safeguard biometric data integrity and automate reporting in Excel?',
    question_hi: 'आप बायोमेट्रिक डेटा की सटीकता कैसे सुरक्षित रखते हैं और Excel में रिपोर्टिंग को कैसे स्वचालित करते हैं?',
    answer: 'I engineered automated data pipelines combining Power Query, VBA macros, and array formulas to ingest raw fingerprint/facial biometric logs. The system detects anomalous duplicate punches, reconciles attendance against Aadhaar enrollment rosters, and auto-generates executive dashboards in minutes, eliminating administrative fraud and manual entry errors.',
    answer_hi: 'मैंने कच्चे फिंगरप्रिंट/फेशियल बायोमेट्रिक लॉग्स को प्रोसेस करने के लिए पावर क्वेरी, VBA मैक्रोज़ और ऐरे फॉर्मूलों को मिलाकर स्वचालित डेटा पाइपलाइन बनाई। यह सिस्टम विसंगतिपूर्ण डुप्लिकेट पंचों का पता लगाता है, आधार नामांकन सूचियों के खिलाफ उपस्थिति का समाधान करता है, और कुछ ही मिनटों में कार्यकारी डैशबोर्ड बनाता है, जिससे प्रशासनिक त्रुटियां समाप्त हो जाती हैं।',
    audience: ['recruiter'],
    role: ['mis'],
    categoryTag: 'Data Telemetry',
    categoryTag_hi: 'डेटा टेलीमेट्री',
    actionCTA: {
      type: 'case_study',
      target: '04',
      label: 'Inspect Smart Card Enrollment #04',
      label_hi: 'स्मार्ट कार्ड नामांकन #04 देखें'
    }
  },
  {
    id: 'rec-mis-kpi-dashboards',
    question: 'How do you design and maintain operational KPI dashboards for executive leadership?',
    question_hi: 'आप वरिष्ठ प्रबंधन के लिए परिचालन KPI डैशबोर्ड कैसे डिज़ाइन और बनाए रखते हैं?',
    answer: 'I construct dynamic, high-density executive dashboards in Excel and Power BI, translating complex tabular data into actionable operational metrics. Key visual indicators include trainee attendance trends, batch completion rates, government fund disbursement milestones, and municipal inspection status. These automated dashboards update with single-click refresh pipelines, empowering directors to make immediate data-driven decisions.',
    answer_hi: 'मैं जटिल डेटा को कार्रवाई योग्य परिचालन मेट्रिक्स में बदलने के लिए Excel और Power BI में गतिशील कार्यकारी डैशबोर्ड बनाता हूँ। मुख्य संकेतकों में उपस्थिति रुझान, बैच समापन दरें, सरकारी धन वितरण मील के पत्थर और नगर निगम निरीक्षण स्थिति शामिल हैं। ये स्वचालित डैशबोर्ड सिंगल-क्लिक रिफ्रेश पाइपलाइन से अपडेट होते हैं, जिससे निदेशक तुरंत डेटा-आधारित निर्णय ले सकते हैं।',
    audience: ['recruiter'],
    role: ['mis'],
    categoryTag: 'Operational Analytics',
    categoryTag_hi: 'परिचालन एनालिटिक्स',
    actionCTA: {
      type: 'case_study',
      target: '03',
      label: 'Inspect DAY-NULM Analytics #03',
      label_hi: 'DAY-NULM एनालिटिक्स #03 देखें'
    }
  },
  {
    id: 'rec-mis-database-sanitization',
    question: 'How do you handle high-volume data deduplication, roster sanitization, and state audit readiness?',
    question_hi: 'आप उच्च-मात्रा डेटा डिडुप्लीकेशन, रोस्टर शुद्धिकरण और राज्य ऑडिट तत्परता को कैसे संभालते हैं?',
    answer: 'When dealing with rosters of 10,000+ citizens, I deploy automated validation algorithms combining fuzzy matching, regex syntax verification, and unique Aadhaar/Phone hashing. This purges duplicate entries, detects malformed record fields, and standardizes demographic data into audit-ready schemas, guaranteeing 100% adherence to state and central government compliance frameworks.',
    answer_hi: 'जब 10,000+ नागरिकों के रोस्टर से निपटना होता है, तो मैं फजी मैचिंग, रिगेक्स सिंटैक्स सत्यापन और विशिष्ट आधार/फोन हैशिंग को मिलाकर स्वचालित सत्यापन एल्गोरिदम तैनात करता हूँ। यह डुप्लिकेट प्रविष्टियों को हटाता है, विकृत रिकॉर्ड फ़ील्ड्स का पता लगाता है, और जनसांख्यिकीय डेटा को ऑडिट-रेडी स्कीमा में मानकीकृत करता है, जिससे 100% सरकारी अनुपालन की गारंटी मिलती है।',
    audience: ['recruiter'],
    role: ['mis'],
    categoryTag: 'Data Governance',
    categoryTag_hi: 'डेटा गवर्नेंस',
    actionCTA: {
      type: 'case_study',
      target: '04',
      label: 'Inspect Data Sanitization #04',
      label_hi: 'डेटा शुद्धिकरण #04 देखें'
    }
  },

  // =========================================================================
  // 2. FREELANCER / CLIENT PERSPECTIVE (12 Total Items)
  // =========================================================================

  // --- Client + Vibe Coding (5 Items) ---
  {
    id: 'cli-vibe-mvp-turnaround',
    question: 'What is your turnaround time for building and deploying a production MVP?',
    question_hi: 'एक प्रोडक्शन MVP बनाने और डिप्लॉय करने के लिए आपका टर्नअराउंड समय क्या है?',
    answer: 'Standard interactive web apps, SaaS MVPs, and business dashboards are typically architected, tested, and deployed live in 7 to 14 business days. By utilizing AI-augmented agentic scaffolds alongside battle-tested component architectures, I eliminate weeks of agency bureaucracy while delivering fully responsive, performant, and secure software.',
    answer_hi: 'मानक इंटरैक्टिव वेब ऐप्स, SaaS MVPs और व्यावसायिक डैशबोर्ड आमतौर पर 7 से 14 कार्यदिवसों में आर्किटेक्ट, टेस्ट और लाइव डिप्लॉय किए जाते हैं। सिद्ध कंपोनेंट आर्किटेक्चर के साथ AI-संवर्धित एजेंटिक स्कैफोल्ड्स का उपयोग करके, मैं पूरी तरह से रेस्पॉन्सिव, उच्च प्रदर्शन और सुरक्षित सॉफ़्टवेयर डिलीवर करता हूँ।',
    audience: ['client'],
    role: ['vibe_coding'],
    categoryTag: 'Project Delivery',
    categoryTag_hi: 'प्रोजेक्ट डिलीवरी',
    actionCTA: {
      type: 'quote',
      target: 'quote',
      label: 'Open Instant Fee Estimator',
      label_hi: 'तुरंत लागत आगणक खोलें'
    }
  },
  {
    id: 'cli-vibe-source-code-ownership',
    question: 'Do I get 100% intellectual property (IP) and repository ownership upon completion?',
    question_hi: 'क्या काम पूरा होने पर मुझे 100% बौद्धिक संपदा (IP) और रिपॉजिटरी का पूर्ण स्वामित्व मिलता है?',
    answer: 'Yes, absolutely. Once final milestone payment is completed, 100% of the GitHub repository, clean source code, configuration files, and design assets are permanently transferred to your company. There are zero proprietary lock-ins, zero hidden royalties, and zero licensing fees.',
    answer_hi: 'जी हाँ, बिल्कुल। अंतिम माइलस्टोन भुगतान पूरा होने पर, GitHub रिपॉजिटरी, स्वच्छ सोर्स कोड, कॉन्फ़िगरेशन फ़ाइलों और डिज़ाइन संपत्तियों का 100% स्वामित्व स्थायी रूप से आपकी कंपनी को स्थानांतरित कर दिया जाता है। कोई मालिकाना लॉक-इन, कोई छिपी हुई रॉयल्टी और कोई लाइसेंस शुल्क नहीं है।',
    audience: ['client'],
    role: ['vibe_coding'],
    categoryTag: 'IP & Contracts',
    categoryTag_hi: 'IP एवं अनुबंध',
    actionCTA: {
      type: 'contact',
      target: '#contact',
      label: 'Discuss Scope with Atul',
      label_hi: 'अतुल के साथ स्कोप पर चर्चा करें'
    }
  },
  {
    id: 'cli-vibe-post-launch-sla',
    question: 'What post-launch maintenance, hosting support, and bug-fix warranty do you provide?',
    question_hi: 'आप लॉन्च के बाद क्या रखरखाव, होस्टिंग सहायता और बग-फिक्स वारंटी प्रदान करते हैं?',
    answer: 'Every custom software engagement includes a complimentary 30-day zero-defect warranty covering any unexpected runtime errors. I also manage turnkey deployment onto Vercel, AWS, or custom VPS with SSL security certificates, and provide transparent monthly retainer options for continuous enhancements.',
    answer_hi: 'प्रत्येक कस्टम सॉफ़्टवेयर अनुबंध में 30 दिनों की निःशुल्क वारंटी शामिल होती है, जिसमें किसी भी अप्रत्याशित रनटाइम त्रुटि को तुरंत ठीक किया जाता है। मैं SSL सुरक्षा प्रमाणपत्रों के साथ Vercel, AWS या कस्टम VPS पर टर्नकी डिप्लॉयमेंट भी प्रबंधित करता हूँ और निरंतर संवर्द्धन के लिए पारदर्शी मासिक रिटेनर विकल्प प्रदान करता हूँ।',
    audience: ['client'],
    role: ['vibe_coding'],
    categoryTag: 'Support & SLA',
    categoryTag_hi: 'सहायता एवं SLA',
    actionCTA: {
      type: 'quote',
      target: 'quote',
      label: 'Estimate Maintenance Retainer',
      label_hi: 'मेंटेनेंस रिटेनर का आकलन करें'
    }
  },
  {
    id: 'cli-vibe-pricing-models',
    question: 'What are your pricing structures for software development and consulting services?',
    question_hi: 'सॉफ़्टवेयर विकास और कंसल्टिंग सेवाओं के लिए आपकी मूल्य निर्धारण संरचना क्या है?',
    answer: 'I maintain simple, transparent pricing: Fixed-Price Milestone Contracts for clearly defined MVP projects, Dedicated Monthly Retainers for recurring engineering sprints, and Hourly Advisory for architectural audits and technical guidance. You can simulate your project pricing in real time using the built-in Fee Estimator.',
    answer_hi: 'मैं पारदर्शी मूल्य निर्धारण रखता हूँ: स्पष्ट रूप से परिभाषित MVP परियोजनाओं के लिए फिक्स्ड-प्राइस माइलस्टोन अनुबंध, आवर्ती इंजीनियरिंग स्प्रिंट्स के लिए मासिक रिटेनर, और आर्किटेक्चरल ऑडिट के लिए प्रति घंटा सलाहकार सेवा। आप संपर्क अनुभाग में दिए गए लागत आगणक का उपयोग करके तुरंत अनुमान लगा सकते हैं।',
    audience: ['client'],
    role: ['vibe_coding'],
    categoryTag: 'Pricing & Terms',
    categoryTag_hi: 'मूल्य निर्धारण एवं शर्तें',
    actionCTA: {
      type: 'quote',
      target: 'quote',
      label: 'Simulate Project Fee in Estimator',
      label_hi: 'आगणक में प्रोजेक्ट शुल्क का आकलन करें'
    }
  },
  {
    id: 'cli-vibe-custom-features-integrations',
    question: 'Can you integrate third-party payment gateways, auth systems, and external REST APIs?',
    question_hi: 'क्या आप थर्ड-पार्टी पेमेंट गेटवे, प्रमाणीकरण सिस्टम और बाहरी REST APIs को एकीकृत कर सकते हैं?',
    answer: 'Yes, seamlessly. I regularly engineer secure integrations with Razorpay, Stripe, Cashfree, Supabase, Firebase, OAuth2 social logins, and custom backend REST/GraphQL microservices. All API communications utilize encrypted payloads, robust webhook verification, defensive retry logic, and comprehensive error handling so your transactions run with 99.99% reliability.',
    answer_hi: 'जी हाँ, बिल्कुल सहजता से। मैं Razorpay, Stripe, Cashfree, Supabase, Firebase, OAuth2 सोशल लॉगिन और कस्टम बैकएंड REST/GraphQL माइक्रोसर्विसेज के साथ सुरक्षित एकीकरण तैयार करता हूँ। सभी API संचार एन्क्रिप्टेड पेलोड, मजबूत वेबहुक सत्यापन, रक्षात्मक पुनप्र्रयास तर्क और व्यापक त्रुटि प्रबंधन का उपयोग करते हैं ताकि आपके लेनदेन 99.99% विश्वसनीयता के साथ चलें।',
    audience: ['client'],
    role: ['vibe_coding'],
    categoryTag: 'API & Integrations',
    categoryTag_hi: 'API एवं एकीकरण',
    actionCTA: {
      type: 'quote',
      target: 'quote',
      label: 'Estimate Integration Scope',
      label_hi: 'एकीकरण लागत का आकलन करें'
    }
  },

  // --- Client + Accountant & Tax (4 Items) ---
  {
    id: 'cli-acc-gst-notice-resolution',
    question: 'Can you help resolve GST ASMT-10 scrutiny notices or departmental mismatch queries?',
    question_hi: 'क्या आप GST ASMT-10 स्क्रूटनी नोटिस या विभागीय विसंगति प्रश्नों को हल करने में मदद कर सकते हैं?',
    answer: 'Yes. I specialize in resolving Section 61 scrutiny notices (Form ASMT-10), DRC-01A intimations, and GSTR-3B vs 2B credit mismatch disputes. I analyze transactional audit trails, prepare supplier e-way bill corroboration dossiers, draft legally grounded point-by-point replies, and represent your data cleanly to tax officers.',
    answer_hi: 'जी हाँ। मैं धारा 61 संवीक्षा नोटिस (फॉर्म ASMT-10), DRC-01A सूचनाओं और GSTR-3B बनाम 2B क्रेडिट विसंगति विवादों को हल करने में विशेषज्ञता रखता हूँ। मैं लेनदेन ऑडिट ट्रेल्स का विश्लेषण करता हूँ, आपूर्तिकर्ता ई-वे बिल साक्ष्य तैयार करता हूँ, बिंदुवार कानूनी जवाब तैयार करता हूँ और अधिकारियों के समक्ष पारदर्शी समाधान प्रस्तुत करता हूँ।',
    audience: ['client'],
    role: ['accountant'],
    categoryTag: 'Tax Notice Defense',
    categoryTag_hi: 'टैक्स नोटिस समाधान',
    actionCTA: {
      type: 'contact',
      target: '#contact',
      label: 'Request Notice Review',
      label_hi: 'नोटिस समीक्षा का अनुरोध करें'
    }
  },
  {
    id: 'cli-acc-retainer-package',
    question: 'What does your monthly or annual bookkeeping retainer package include for businesses?',
    question_hi: 'व्यवसायों के लिए आपके मासिक या वार्षिक बहीखाता रिटेनर पैकेज में क्या शामिल है?',
    answer: 'My comprehensive business retainer includes daily double-entry bookkeeping in Tally Prime, monthly bank reconciliations (BRS), sales/purchase ledger verification, monthly GSTR-1 & 3B return e-filing, quarterly TDS computations (Form 24Q/26Q), and monthly executive P&L and Balance Sheet financial health briefings.',
    answer_hi: 'मेरे व्यापक व्यापार रिटेनर में Tally Prime में दैनिक डबल-एंट्री बहीखाता, मासिक बैंक समाधान (BRS), बिक्री/खरीद लेजर सत्यापन, मासिक GSTR-1 एवं 3B रिटर्न ई-फाइलिंग, त्रैमासिक TDS गणना (फॉर्म 24Q/26Q), और मासिक वित्तीय स्वास्थ्य (लाभ-हानि एवं बैलेंस शीट) रिपोर्ट शामिल हैं।',
    audience: ['client'],
    role: ['accountant'],
    categoryTag: 'Accounting Retainer',
    categoryTag_hi: 'लेखांकन रिटेनर',
    actionCTA: {
      type: 'quote',
      target: 'quote',
      label: 'Calculate Monthly Retainer',
      label_hi: 'मासिक रिटेनर का हिसाब लगाएं'
    }
  },
  {
    id: 'cli-acc-financial-modeling-advisory',
    question: 'Do you provide cash flow forecasting, budgeting, and financial advisory for small businesses?',
    question_hi: 'क्या आप छोटे व्यवसायों के लिए कैश फ्लो पूर्वानुमान, बजट निर्माण और वित्तीय सलाहकार सेवाएं प्रदान करते हैं?',
    answer: 'Yes. Beyond routine record-keeping, I build custom financial models, dynamic break-even analyses, and 12-month rolling cash flow projections. I help business founders understand unit economics, control overhead creep, optimize working capital cycles, and plan debt vs. equity capital allocation with absolute financial clarity.',
    answer_hi: 'जी हाँ। नियमित बहीखाता पद्धति से परे, मैं कस्टम वित्तीय मॉडल, ब्रेक-ईवन विश्लेषण और 12 महीने के रोलिंग कैश फ्लो अनुमान तैयार करता हूँ। मैं व्यवसाय संस्थापकों को यूनिट इकोनॉमिक्स समझने, खर्चों पर नियंत्रण रखने, वर्किंग कैपिटल चक्र को अनुकूलित करने और पूर्ण वित्तीय स्पष्टता के साथ पूंजी आवंटन की योजना बनाने में मदद करता हूँ।',
    audience: ['client'],
    role: ['accountant'],
    categoryTag: 'Financial Advisory',
    categoryTag_hi: 'वित्तीय सलाह',
    actionCTA: {
      type: 'contact',
      target: '#contact',
      label: 'Request Financial Advisory',
      label_hi: 'वित्तीय परामर्श का अनुरोध करें'
    }
  },
  {
    id: 'cli-acc-tax-saving-entity-setup',
    question: 'Can you assist with business entity structuring, GST registration, and MSME Udyam setup?',
    question_hi: 'क्या आप बिजनेस एंटिटी संरचना, GST पंजीकरण और MSME उद्यम सेटअप में सहायता कर सकते हैं?',
    answer: 'Absolutely. I advise clients on selecting the optimal legal structure—Sole Proprietorship, Partnership Firm, or Private Limited Company—based on revenue projections, liability, and tax efficiency. I manage the complete setup pipeline including PAN/TAN, GSTIN registration, MSME Udyam certification, and initial Tally ERP chart of accounts structuring.',
    answer_hi: 'बिल्कुल। मैं ग्राहकों को राजस्व अनुमान, देनदारी और कर दक्षता के आधार पर इष्टतम कानूनी संरचना—एकल स्वामित्व (प्रोपराइटरशिप), साझेदारी फर्म, या प्राइवेट लिमिटेड—चुनने में सलाह देता हूँ। मैं पैन/टैन, GSTIN पंजीकरण, MSME उद्यम प्रमाणन और प्रारंभिक Tally ERP चार्ट ऑफ अकाउंट्स संरचना सहित संपूर्ण सेटअप पाइपलाइन का प्रबंधन करता हूँ।',
    audience: ['client'],
    role: ['accountant'],
    categoryTag: 'Business Incorporation',
    categoryTag_hi: 'व्यवसाय निगमन',
    actionCTA: {
      type: 'quote',
      target: 'quote',
      label: 'Estimate Incorporation Package',
      label_hi: 'सेटअप पैकेज का आकलन करें'
    }
  },

  // --- Client + MIS & Operations (3 Items) ---
  {
    id: 'cli-mis-custom-sheets-automation',
    question: 'Can you build custom Excel or Google Sheets automation pipelines with Apps Script and Macros?',
    question_hi: 'क्या आप Apps Script और मैक्रोज़ के साथ कस्टम Excel या Google Sheets ऑटोमेशन पाइपलाइन बना सकते हैं?',
    answer: 'Yes. I transform slow, repetitive manual spreadsheet workflows into fast, automated systems. Using Google Apps Script, Excel VBA, and modern dynamic array functions, I build automated quote generators, customer billing sheets, automated PDF invoice dispatchers via email, and cloud-synced spreadsheets that save businesses dozens of hours every week.',
    answer_hi: 'जी हाँ। मैं धीमी, बार-बार की जाने वाली मैन्युअल स्प्रेडशीट प्रक्रियाओं को तेज, स्वचालित प्रणालियों में बदल देता हूँ। Google Apps Script, Excel VBA और आधुनिक डायनामिक ऐरे फ़ंक्शन्स का उपयोग करके, मैं स्वचालित कोटेशन जनरेटर, ग्राहक बिलिंग शीट्स, ईमेल के माध्यम से स्वचालित PDF इनवॉइस प्रेषक और क्लाउड-सिंक स्प्रेडशीट बनाता हूँ जो व्यवसायों के दर्जनों घंटे बचाते हैं।',
    audience: ['client'],
    role: ['mis'],
    categoryTag: 'Spreadsheet Automation',
    categoryTag_hi: 'स्प्रेडशीट ऑटोमेशन',
    actionCTA: {
      type: 'quote',
      target: 'quote',
      label: 'Estimate Automation Scope',
      label_hi: 'ऑटोमेशन लागत का आकलन करें'
    }
  },
  {
    id: 'cli-mis-data-cleaning-pipeline',
    question: 'How can you help clean, deduplicate, and merge messy sales or customer databases?',
    question_hi: 'आप अव्यवस्थित बिक्री या ग्राहक डेटाबेस को साफ, डुप्लिकेट-मुक्त और मर्ज करने में कैसे मदद कर सकते हैं?',
    answer: 'I specialize in data sanitization pipelines for businesses migrating to new CRMs or ERPs. I extract fragmented data across varied Excel, CSV, or legacy software formats, resolve duplicate entries, fix corrupt phone/email formats, normalize product SKUs, and produce clean, reconciled master databases ready for instant import without data loss.',
    answer_hi: 'मैं नए CRM या ERP में माइग्रेट करने वाले व्यवसायों के लिए डेटा शुद्धिकरण पाइपलाइनों में विशेषज्ञता रखता हूँ। मैं विभिन्न Excel, CSV या पुराने सॉफ़्टवेयर प्रारूपों से खंडित डेटा निकालता हूँ, डुप्लिकेट प्रविष्टियों को हल करता हूँ, फोन/ईमेल प्रारूपों को ठीक करता हूँ, उत्पाद SKU को मानकीकृत करता हूँ, और बिना किसी डेटा हानि के आयात के लिए तैयार स्वच्छ मास्टर डेटाबेस बनाता हूँ।',
    audience: ['client'],
    role: ['mis'],
    categoryTag: 'Data Pipeline',
    categoryTag_hi: 'डेटा पाइपलाइन',
    actionCTA: {
      type: 'case_study',
      target: '04',
      label: 'Inspect Data Cleaning Study #04',
      label_hi: 'डेटा क्लीनिंग केस स्टडी #04 देखें'
    }
  },
  {
    id: 'cli-mis-inventory-sales-tracker',
    question: 'Can you create a real-time inventory management and sales tracking system for our business?',
    question_hi: 'क्या आप हमारे व्यवसाय के लिए एक रियल-टाइम इन्वेंट्री प्रबंधन और बिक्री ट्रैकिंग सिस्टम बना सकते हैं?',
    answer: 'Yes. I develop intuitive, robust inventory tracking systems customized to your exact operational workflow. Key capabilities include barcode/SKU scanning support, automated low-stock and reorder notifications, gross margin calculations per product category, daily sales summaries, and supplier lead-time analytics—all running on accessible cloud spreadsheets or lightweight web interfaces.',
    answer_hi: 'जी हाँ। मैं आपके सटीक परिचालन वर्कफ़्लो के अनुकूल सहज और मजबूत इन्वेंट्री ट्रैकिंग सिस्टम विकसित करता हूँ। मुख्य क्षमताओं में बारकोड/SKU स्कैनिंग सहायता, स्वचालित लो-स्टॉक और रीऑर्डर सूचनाएं, उत्पाद श्रेणी के अनुसार सकल मार्जिन गणना, दैनिक बिक्री सारांश और आपूर्तिकर्ता लीड-टाइम एनालिटिक्स शामिल हैं—जो क्लाउड स्प्रेडशीट या हल्के वेब इंटरफेस पर चलते हैं।',
    audience: ['client'],
    role: ['mis'],
    categoryTag: 'Inventory Systems',
    categoryTag_hi: 'इन्वेंटरी सिस्टम',
    actionCTA: {
      type: 'quote',
      target: 'quote',
      label: 'Estimate Inventory Tracker',
      label_hi: 'इन्वेंटरी ट्रैकर का आकलन करें'
    }
  },

  // =========================================================================
  // 3. GENERAL / POLYMATH PERSPECTIVE (7 Total Items)
  // =========================================================================
  {
    id: 'gen-polymath-dual-discipline',
    question: 'How do you manage being both a Senior Accountant and an AI Software Engineer?',
    question_hi: 'आप एक वरिष्ठ अकाउंटेंट और एक AI सॉफ्टवेयर इंजीनियर दोनों होने का समन्वय कैसे करते हैं?',
    answer: 'Accounting and software engineering are natural partners: both demand uncompromising logical precision, zero-tolerance for data corruption, and structured problem solving. My financial foundation gives me deep empathy for commercial operations and statutory reality, while my AI software engineering skills allow me to build automations that eliminate the tedious manual toil that financial professionals endure.',
    answer_hi: 'लेखांकन और सॉफ्टवेयर इंजीनियरिंग स्वाभाविक साथी हैं: दोनों में अटूट तार्किक सटीकता, डेटा अखंडता और संरचित समस्या समाधान की आवश्यकता होती है। मेरी वित्तीय नींव मुझे वाणिज्यिक संचालन और वैधानिक वास्तविकता की गहरी समझ देती है, जबकि मेरी AI इंजीनियरिंग क्षमताएं मुझे ऐसे ऑटोमेशन बनाने में सक्षम बनाती हैं जो लेखांकन पेशेवरों के थकाऊ काम को समाप्त करते हैं।',
    audience: ['general'],
    role: ['all'],
    categoryTag: 'Polymath Synergy',
    categoryTag_hi: 'पॉलीमैथ समन्वय',
    actionCTA: {
      type: 'ai_chat',
      target: 'ai_chat',
      label: 'Discuss Dual Career with AI Assistant',
      label_hi: 'AI सहायक से दोहरे करियर पर चर्चा करें'
    }
  },
  {
    id: 'gen-vibe-coding-philosophy',
    question: 'What is your core philosophy on "Vibe Coding" and AI-assisted engineering?',
    question_hi: '"Vibe Coding" और AI-सहायता प्राप्त इंजीनियरिंग पर आपका मूल दर्शन क्या है?',
    answer: 'Vibe coding is not haphazard prompting or sloppy code generation. To me, it is the highest form of systems architecture: treating the engineer as the CEO of a multi-agent team. By defining rigorous task contracts, strict schemas, and automated adversarial testing suites, I let AI subagents execute code at light speed while I focus entirely on architecture, performance, security, and human UX.',
    answer_hi: 'Vibe Coding कोई लापरवाही से प्रॉम्प्ट देना या घटिया कोड बनाना नहीं है। मेरे लिए, यह सिस्टम्स आर्किटेक्चर का उच्चतम रूप है: जहां इंजीनियर एक मल्टी-एजेंट टीम के CEO के रूप में काम करता है। सख्त विनिर्देश, स्कीमा और स्वचालित एडवर्सरी परीक्षण लागू करके, मैं AI एजेंट्स से तीव्र गति से कोड लिखवाता हूँ जबकि मेरा पूरा ध्यान आर्किटेक्चर, प्रदर्शन, सुरक्षा और उपयोगकर्ता अनुभव पर रहता है।',
    audience: ['general'],
    role: ['vibe_coding'],
    categoryTag: 'Engineering Philosophy',
    categoryTag_hi: 'इंजीनियरिंग दर्शन',
    actionCTA: {
      type: 'case_study',
      target: '08',
      label: 'Inspect Agent Workflow Case Study #08',
      label_hi: 'एजेंट वर्कफ़्लो केस स्टडी #08 देखें'
    }
  },
  {
    id: 'gen-mis-operations-mindset',
    question: 'How does your operational background in government MIS influence your software design?',
    question_hi: 'सरकारी MIS में आपकी परिचालन पृष्ठभूमि आपके सॉफ़्टवेयर डिज़ाइन को कैसे प्रभावित करती है?',
    answer: 'Managing statewide government data taught me that real users operate on diverse hardware, flaky internet connections, and tight deadlines. Because of this, I design software with defensive error boundaries, offline fallbacks, high-contrast accessible color tokens, and instant feedback cues—ensuring tools remain usable under demanding real-world conditions.',
    answer_hi: 'राज्यव्यापी सरकारी डेटा के प्रबंधन ने मुझे सिखाया कि वास्तविक उपयोगकर्ता विभिन्न हार्डवेयर, अस्थिर इंटरनेट और समय-सीमा के दबाव में काम करते हैं। इसलिए, मैं रक्षात्मक त्रुटि सीमाओं, ऑफ़लाइन फॉलबैक, उच्च-कंट्रास्ट सुलभ रंगों और त्वरित प्रतिक्रिया संकेतों के साथ सॉफ़्टवेयर डिज़ाइन करता हूँ—ताकि कठिन वास्तविक परिस्थितियों में भी सब कुछ सहजता से काम करे।',
    audience: ['general'],
    role: ['mis'],
    categoryTag: 'Operational Design',
    categoryTag_hi: 'परिचालन डिज़ाइन',
    actionCTA: {
      type: 'case_study',
      target: '03',
      label: 'Inspect DAY-NULM Portal Architecture',
      label_hi: 'DAY-NULM पोर्टल आर्किटेक्चर देखें'
    }
  },
  {
    id: 'gen-daily-routine-focus',
    question: 'What does your daily routine and deep-work schedule look like across dual disciplines?',
    question_hi: 'दोहरे विषयों में आपकी दैनिक दिनचर्या और डीप-वर्क शेड्यूल कैसा दिखता है?',
    answer: 'I structure my workday into high-intensity time blocks. Morning hours (8 AM - 12 PM) are reserved for deep architectural thinking, AI agent system design, and active code engineering when mental clarity is peaked. Afternoon blocks focus on financial ledger reviews, statutory filings, and client communications. Evenings are dedicated to continuous technical reading, algorithmic research, and physical well-being.',
    answer_hi: 'मैं अपने कार्यदिवस को उच्च-तीव्रता वाले टाइम ब्लॉक्स में विभाजित करता हूँ। सुबह के घंटे (8 AM - 12 PM) गहरे आर्किटेक्चरल विचार, AI एजेंट सिस्टम डिज़ाइन और सक्रिय कोडिंग के लिए आरक्षित होते हैं जब मानसिक स्पष्टता चरम पर होती है। दोपहर का समय वित्तीय लेजर समीक्षा, वैधानिक फाइलिंग और क्लाइंट संवाद पर केंद्रित होता है। शाम का समय तकनीकी अध्ययन, एल्गोरिदम अनुसंधान और स्वास्थ्य के लिए समर्पित है।',
    audience: ['general'],
    role: ['all'],
    categoryTag: 'Work Routine',
    categoryTag_hi: 'कार्य दिनचर्या',
    actionCTA: {
      type: 'ai_chat',
      target: 'ai_chat',
      label: 'Ask AI Copilot About Daily Flow',
      label_hi: 'AI कोपायलट से दैनिक दिनचर्या पूछें'
    }
  },
  {
    id: 'gen-continuous-learning-tech',
    question: 'How do you stay ahead in the rapidly evolving landscape of AI agents and modern frameworks?',
    question_hi: 'आप AI एजेंट्स और आधुनिक फ्रेमवर्क के तेजी से बदलते परिदृश्य में खुद को हमेशा आगे कैसे रखते हैं?',
    answer: 'I practice active, project-driven learning rather than passive reading. Whenever Anthropic, OpenAI, or the open-source community releases a breakthrough paper or agentic paradigm (such as Model Context Protocol, tool use patterns, or multimodal reasoning), I immediately build practical prototypes and stress-test them against edge cases. This hands-on experimentation keeps my skills permanently at the cutting edge.',
    answer_hi: 'मैं निष्क्रिय पठन के बजाय सक्रिय, प्रोजेक्ट-संचालित सीखने का अभ्यास करता हूँ। जब भी Anthropic, OpenAI, या ओपन-सोर्स समुदाय कोई नया रिसर्च पेपर या एजेंटिक प्रतिमान (जैसे मॉडल संदर्भ प्रोटोकॉल, टूल यूज़ पैटर्न, या मल्टीमॉडल रीजनिंग) जारी करता है, मैं तुरंत प्रोटोटाइप बनाता हूँ और उनका परीक्षण करता हूँ। यह व्यावहारिक प्रयोग मेरे कौशल को हमेशा अत्याधुनिक रखता है।',
    audience: ['general'],
    role: ['vibe_coding'],
    categoryTag: 'Continuous Learning',
    categoryTag_hi: 'सतत सीखना',
    actionCTA: {
      type: 'ai_chat',
      target: 'ai_chat',
      label: 'Explore AI Tech Stack with Copilot',
      label_hi: 'कोपायलट के साथ AI स्टैक देखें'
    }
  },
  {
    id: 'gen-open-source-contribution',
    question: 'What is your approach toward open-source contributions and community knowledge sharing?',
    question_hi: 'ओपन-सोर्स योगदान और सामुदायिक ज्ञान साझाकरण के प्रति आपका क्या दृष्टिकोण है?',
    answer: 'I strongly believe that shared knowledge elevates the entire engineering craft. I actively open-source reusable UI components, CLI utilities, and workflow automation scaffolds on GitHub under permissive MIT licenses. By documenting architectural decisions transparently and writing clear developer guides, I contribute to empowering indie creators, students, and engineers globally.',
    answer_hi: 'मेरा दृढ़ विश्वास है कि साझा ज्ञान संपूर्ण इंजीनियरिंग समुदाय को समृद्ध बनाता है। मैं GitHub पर अनुमति योग्य MIT लाइसेंस के तहत पुन: प्रयोज्य UI कंपोनेंट्स, CLI उपयोगिताओं और वर्कफ़्लो ऑटोमेशन स्कैफोल्ड्स को सक्रिय रूप से ओपन-सोर्स करता हूँ। आर्किटेक्चरल निर्णयों को पारदर्शी रूप से प्रलेखित करके और स्पष्ट डेवलपर गाइड लिखकर, मैं दुनिया भर के डेवलपर्स और छात्रों को सशक्त बनाने में योगदान देता हूँ।',
    audience: ['general'],
    role: ['vibe_coding'],
    categoryTag: 'Open Source',
    categoryTag_hi: 'ओपन सोर्स',
    actionCTA: {
      type: 'ai_chat',
      target: 'ai_chat',
      label: 'Ask AI Copilot for Repos',
      label_hi: 'AI कोपायलट से रिपॉजिटरीज़ पूछें'
    }
  },
  {
    id: 'gen-commercial-tax-software-vision',
    question: 'What is your vision for next-generation accounting software and AI-native tax engines?',
    question_hi: 'अगली पीढ़ी के लेखांकन सॉफ्टवेयर और AI-नेगेटिव टैक्स इंजनों के लिए आपका क्या दृष्टिकोण है?',
    answer: 'Traditional ERP systems like Tally and SAP are built on rigid, decades-old transaction paradigms that require tedious human data entry. My vision is an AI-native accounting engine where autonomous multimodal agents ingest raw invoices via vision models, reconcile bank feeds continuously in real time, auto-detect GST Section 16(2)(aa) mismatches instantly, and prepare audit-ready trial balances autonomously.',
    answer_hi: 'Tally और SAP जैसे पारंपरिक ERP सिस्टम दशकों पुराने कठोर प्रतिमानों पर बने हैं जिनमें थकाऊ मानवीय डेटा प्रविष्टि की आवश्यकता होती है। मेरा दृष्टिकोण एक AI-नेगेटिव अकाउंटिंग इंजन का है जहां स्वायत्त मल्टीमॉडल एजेंट्स विज़न मॉडल के माध्यम से कच्चे इनवॉइस प्रोसेस करते हैं, वास्तविक समय में बैंक फीड्स का समाधान करते हैं, GST विसंगतियों का तुरंत पता लगाते हैं और ऑडिट-रेडी ट्रायल बैलेंस स्वतः तैयार करते हैं।',
    audience: ['general'],
    role: ['accountant'],
    categoryTag: 'Future of FinTech',
    categoryTag_hi: 'फिनटेक का भविष्य',
    actionCTA: {
      type: 'case_study',
      target: '01',
      label: 'Inspect GST Reconciliation Engine #01',
      label_hi: 'GST समाधान इंजन #01 देखें'
    }
  },

  // =========================================================================
  // 4. MARRIAGE / MATRIMONIAL PERSPECTIVE (6 Total Items)
  // =========================================================================
  {
    id: 'mat-education-credentials',
    question: 'What are your educational qualifications and verified academic credentials?',
    question_hi: 'आपकी शैक्षणिक योग्यताएं और सत्यापित अकादमिक प्रमाणपत्र क्या हैं?',
    answer: 'I hold an Advance Diploma in Computer Application (ADCA) with Honors certification (Grade A+, 91% aggregate), alongside formal schooling credentials in Intermediate and Secondary examinations from recognized State and Central (CBSE) Boards. All credentials are fully documented, verified, and accessible for direct inspection in the portfolio credential inspector.',
    answer_hi: 'मेरे पास ऑनर्स प्रमाणन के साथ एडवांस डिप्लोमा इन कंप्यूटर एप्लीकेशन (ADCA) (ग्रेड A+, 91% कुल अंक) है, साथ ही मान्यता प्राप्त राज्य और केंद्रीय (CBSE) बोर्डों से इंटरमीडिएट और माध्यमिक की औपचारिक शिक्षा है। सभी प्रमाणपत्र पूर्ण रूप से प्रलेखित, सत्यापित और इस पोर्टफोलियो के क्रेडेंशियल इंस्पेक्टर में उपलब्ध हैं।',
    audience: ['marriage'],
    role: ['all'],
    categoryTag: 'Education & Credentials',
    categoryTag_hi: 'शिक्षा एवं प्रमाणपत्र',
    actionCTA: {
      type: 'credentials',
      target: 'edu-adca',
      label: 'Inspect Verified ADCA Certificate',
      label_hi: 'सत्यापित ADCA प्रमाणपत्र देखें'
    }
  },
  {
    id: 'mat-family-background-values',
    question: 'What is your family background, cultural roots, and personal values?',
    question_hi: 'आपकी पारिवारिक पृष्ठभूमि, सांस्कृतिक जड़ें और व्यक्तिगत मूल्य क्या हैं?',
    answer: 'Born and raised in Medininagar (Daltonganj, Palamu, Jharkhand), son of Late Niranjan Prasad, belonging to a respectable, cultured Hindu family. I practice grounded virtues: integrity, mutual respect, lifelong dedication to family harmony, and continuous self-improvement. I maintain a healthy, teetotaler, disciplined lifestyle balancing Indian cultural traditions with a forward-looking mindset.',
    answer_hi: 'मेदिनीनगर (डाल्टनगंज, पलामू, झारखंड) में एक संभ्रांत, सुसंस्कृत हिंदू परिवार में जन्म, स्व. निरंजन प्रसाद का सुपुत्र। मैं मध्यम वर्गीय संस्कारों, ईमानदारी, आपसी सम्मान, पारिवारिक समरसता और निरंतर आत्म-विकास के मूल्यों का पालन करता हूँ। मेरा जीवन पूर्णतः व्यसनमुक्त, शाकाहारी एवं अनुशासित है, जिसमें भारतीय सांस्कृतिक परंपराओं और प्रगतिशील सोच का सुंदर समन्वय है।',
    audience: ['marriage'],
    role: ['all'],
    categoryTag: 'Family & Heritage',
    categoryTag_hi: 'परिवार एवं संस्कार',
    actionCTA: {
      type: 'contact',
      target: '#contact',
      label: 'Send Respectful Matrimonial Inquiry',
      label_hi: 'सम्मानजनक वैवाहिक संदेश भेजें'
    }
  },
  {
    id: 'mat-lifestyle-future-vision',
    question: 'What are your lifestyle habits, hobbies, and vision for personal and family life?',
    question_hi: 'आपकी जीवनशैली की आदतें, शौक और व्यक्तिगत व पारिवारिक जीवन के लिए क्या दृष्टिकोण है?',
    answer: 'My daily lifestyle centers on continuous intellectual learning, reading, technology research, and mindful physical health. My vision is to nurture a peaceful, loving, and supportive home environment founded on mutual trust, financial prudence, shared aspirations, and respect for elders.',
    answer_hi: 'मेरी दैनिक जीवनशैली निरंतर बौद्धिक अध्ययन, तकनीकी अनुसंधान और स्वास्थ्य के प्रति सचेत रहने पर केंद्रित है। मेरा दृष्टिकोण आपसी विश्वास, वित्तीय अनुशासन, साझा सपनों और बड़ों के प्रति सम्मान पर आधारित एक शांत, सुखद और सहयोगी पारिवारिक जीवन का निर्माण करना है।',
    audience: ['marriage'],
    role: ['all'],
    categoryTag: 'Lifestyle & Vision',
    categoryTag_hi: 'जीवनशैली एवं दृष्टिकोण',
    actionCTA: {
      type: 'contact',
      target: '#contact',
      label: 'Connect Directly with Family',
      label_hi: 'सीधे परिवार से संपर्क करें'
    }
  },
  {
    id: 'mat-career-financial-stability',
    question: 'How do you view your financial stability, career security, and long-term professional roadmap?',
    question_hi: 'आप अपनी वित्तीय स्थिरता, करियर सुरक्षा और दीर्घकालिक व्यावसायिक रोडमैप को कैसे देखते हैं?',
    answer: 'I maintain a highly resilient, diversified professional profile. With 7+ years of established consulting practice in corporate accounting and tax compliance, combined with high-growth software engineering and AI capabilities, I possess multiple reliable income streams. I practice disciplined financial planning, consistent savings, zero unhedged debt, and a future-proof career trajectory built on perpetual market demand.',
    answer_hi: 'मैं एक अत्यधिक लचीला और विविधतापूर्ण व्यावसायिक प्रोफाइल रखता हूँ। कॉर्पोरेट अकाउंटिंग और टैक्स अनुपालन में 7+ वर्षों के स्थापित परामर्श अभ्यास के साथ-साथ उच्च-विकास सॉफ्टवेयर इंजीनियरिंग और AI क्षमताओं के साथ, मेरे पास कई विश्वसनीय आय स्रोत हैं। मैं अनुशासित वित्तीय योजना, निरंतर बचत, शून्य ऋण और स्थायी बाजार मांग पर निर्मित भविष्य-सुरक्षित करियर पथ का पालन करता हूँ।',
    audience: ['marriage'],
    role: ['all'],
    categoryTag: 'Career & Stability',
    categoryTag_hi: 'करियर एवं स्थिरता',
    actionCTA: {
      type: 'contact',
      target: '#contact',
      label: 'Inquire About Career Roadmap',
      label_hi: 'करियर रोडमैप पर चर्चा करें'
    }
  },
  {
    id: 'mat-partner-expectations-compatibility',
    question: 'What are your expectations regarding mutual compatibility, life values, and partnership?',
    question_hi: 'आपसी अनुकूलता, जीवन मूल्यों और वैवाहिक साझेदारी के संबंध में आपकी क्या अपेक्षाएं हैं?',
    answer: 'I believe marriage is an equal, lifelong partnership built on mutual respect, intellectual companionship, open communication, and shared values. I value a life partner who is educated, understanding, culturally grounded yet progressive in outlook. I wholeheartedly support my partner’s career ambitions, educational pursuits, and personal independence, fostering an empowering home environment.',
    answer_hi: 'मेरा मानना है कि विवाह आपसी सम्मान, बौद्धिक साहचर्य, खुले संवाद और साझा मूल्यों पर आधारित एक समान, आजीवन साझेदारी है। मैं एक ऐसी जीवनसंगिनी को महत्व देता हूँ जो सुशिक्षित, समझदार, सांस्कृतिक रूप से जुड़ी हुई और प्रगतिशील सोच वाली हो। मैं अपनी जीवनसाथी की करियर आकांक्षाओं, शिक्षा और व्यक्तिगत स्वतंत्रता का पूरा समर्थन करता हूँ, जिससे एक प्रेरणादायक और सुखद गृह वातावरण बने।',
    audience: ['marriage'],
    role: ['all'],
    categoryTag: 'Mutual Compatibility',
    categoryTag_hi: 'आपसी अनुकूलता',
    actionCTA: {
      type: 'contact',
      target: '#contact',
      label: 'Share Matrimonial Profile',
      label_hi: 'वैवाहिक प्रोफाइल साझा करें'
    }
  },
  {
    id: 'mat-location-settlement-plans',
    question: 'What are your preferences regarding location, residence, and future settlement?',
    question_hi: 'स्थान, निवास और भविष्य में बसने (सेटलमेंट) के संबंध में आपकी क्या प्राथमिकताएं हैं?',
    answer: 'My family roots and ancestral residence are situated in Medininagar (Palamu, Jharkhand), where we enjoy a comfortable, established home base. At the same time, due to the global nature of my software engineering and consulting work, I am open to relocating or establishing a secondary base in tier-1 metropolitan cities (such as NCR, Bengaluru, Hyderabad, or Pune) based on mutual family consensus and career opportunities.',
    answer_hi: 'मेरी पारिवारिक जड़ें और पैतृक निवास मेदिनीनगर (पलामू, झारखंड) में स्थित हैं, जहाँ हमारा एक व्यवस्थित और शांतिपूर्ण घर है। साथ ही, मेरे सॉफ्टवेयर इंजीनियरिंग और कंसल्टिंग कार्य की आधुनिक प्रकृति के कारण, मैं आपसी पारिवारिक सहमति और करियर अवसरों के आधार पर प्रमुख महानगरों (जैसे NCR, बेंगलुरु, हैदराबाद, या पुणे) में रहने या बसने के लिए पूरी तरह खुला हूँ।',
    audience: ['marriage'],
    role: ['all'],
    categoryTag: 'Residence & Settlement',
    categoryTag_hi: 'निवास एवं सेटलमेंट',
    actionCTA: {
      type: 'contact',
      target: '#contact',
      label: 'Discuss Settlement & Plans',
      label_hi: 'निवास व योजनाओं पर चर्चा करें'
    }
  },
  {
    id: 'gen-location-office',
    question: 'Where are you located in India?',
    question_hi: 'आप भारत में कहाँ स्थित हैं?',
    aliases: [
      'Kaha rehte ho? Office location kya hai?',
      'Where are you located in India?',
      'आप भारत में कहाँ स्थित हैं?',
      'kaha rehte ho',
      'office location kya hai',
      'where are you located',
      'office location'
    ],
    answer: 'Atul Verma is permanently based in Daltonganj (Medininagar), Palamau District, Jharkhand - 822101, India. He operates an industrial-grade remote engineering workstation (1 Gbps fiber + UPS power redundancy) and is fully flexible to relocate for onsite/hybrid roles in tech metropolitan hubs (Bangalore, NCR, Hyderabad, Pune).',
    answer_hi: 'अतुल वर्मा डाल्टनगंज (मेदिनीनगर), पलामू जिला, झारखंड - 822101, भारत में स्थित हैं। वे 1 Gbps फाइबर ब्रॉडबैंड और औद्योगिक UPS पावर बैकअप से सुसज्जित एक आधुनिक रिमोट वर्कस्टेशन संचालित करते हैं तथा प्रमुख मेट्रो टेक हब्स (बैंगलोर, एनसीआर, हैदराबाद, पुणे) में ऑनसाइट/हाइब्रिड भूमिकाओं हेतु रीलोकेट होने के लिए पूरी तरह तैयार हैं।',
    audience: ['general'],
    role: ['all'],
    categoryTag: 'Location & Headquarters',
    categoryTag_hi: 'स्थान एवं मुख्यालय',
    actionCTA: {
      type: 'contact',
      target: '#contact',
      label: 'View Location on Map & Contact',
      label_hi: 'मानचित्र पर स्थान देखें एवं संपर्क करें'
    }
  }
];

/**
 * Filter helper to retrieve FAQ items based on selected audience, role, and search query
 */
export function filterFAQItems({
  items = FAQ_ITEMS,
  audience = 'all',
  role = 'all',
  category = 'all',
  searchQuery = ''
}) {
  const cleanSearch = (searchQuery || '').trim().toLowerCase();

  return items.filter((item) => {
    // 1. Audience Match
    if (audience !== 'all') {
      const matchAudience = Array.isArray(item.audience)
        ? item.audience.includes(audience) || item.audience.includes('all')
        : item.audience === audience || item.audience === 'all';
      if (!matchAudience) return false;
    }

    // 2. Role Match
    if (role !== 'all') {
      const isUniversal = Array.isArray(item.role)
        ? item.role.includes('all') && (item.audience.includes('all') || item.audience.includes(audience))
        : item.role === 'all' && (item.audience.includes('all') || item.audience.includes(audience));
      const matchRole = Array.isArray(item.role)
        ? item.role.includes(role) || isUniversal
        : item.role === role || isUniversal;
      if (!matchRole) return false;
    }

    // 3. Category Tag Match
    if (category !== 'all') {
      const tagMatch = item.categoryTag === category || item.categoryTag_hi === category;
      if (!tagMatch) return false;
    }

    // 4. Live Search Match
    if (cleanSearch) {
      const audienceStr = Array.isArray(item.audience) ? item.audience.join(' ') : item.audience || '';
      const roleStr = Array.isArray(item.role) ? item.role.join(' ') : item.role || '';

      const textToSearch = [
        item.question,
        item.question_hi,
        item.answer,
        item.answer_hi,
        item.categoryTag,
        item.categoryTag_hi,
        audienceStr,
        roleStr
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (!textToSearch.includes(cleanSearch)) {
        return false;
      }
    }

    return true;
  });
}
