import React, { memo, useState } from 'react';
import { Briefcase, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundFX } from '../utils/audio';
import { useRoleTab } from '../context/RoleContext';
import { useAnnounce } from '../context/AnnouncerContext';
import { useLanguage } from '../context/LanguageContext';

const ACCOUNTANT_ROLES = ['exp-01', 'exp-02', 'exp-04'];
const MIS_ROLES = ['exp-03', 'exp-05', 'exp-06'];
const VIBE_CODING_ROLES = ['exp-vibe-01'];
const OTHER_ROLES = ['exp-other-01', 'exp-other-02', 'exp-other-03'];
const OVERVIEW_ROLES = ['exp-01', 'exp-03', 'exp-vibe-01']; // GST Consultant (Accountant) + MIS Executive (MIS) + Vibe Coder (AI SaaS)

const EXPERIENCES = [
  {
    id: 'exp-01',
    targetId: 'exp-tax-consultant',
    period: '2023 — PRESENT',
    period_hi: '2023 — वर्तमान',
    status: 'Active Practice (7+ Years)',
    status_hi: 'सक्रिय प्रैक्टिस (7+ वर्ष)',
    role: 'GST & Income Tax Consultant',
    role_hi: 'GST एवं आयकर सलाहकार',
    company: 'Independent Tax Consultancy Practice',
    company_hi: 'स्वतंत्र कर परामर्श प्रैक्टिस',
    location: 'Daltonganj, Jharkhand',
    location_hi: 'डालटनगंज, झारखंड',
    description: 'Managing end-to-end statutory taxation, monthly GSTR compliance, individual and business income tax returns, and client tax advisory.',
    description_hi: 'एंड-टू-एंड वैधानिक कराधान, मासिक GSTR अनुपालन, व्यक्तिगत व व्यावसायिक आयकर रिटर्न और ग्राहक कर परामर्श का प्रबंधन।',
    deliverables: [
      'Directly managed 500+ statutory GST & Income Tax filings across active practice, maintaining a 100% on-time submission rate with zero penalty notices.',
      'Conducted rigorous GSTR-2B vs purchase ledger ITC reconciliations, identifying duplicate or ineligible claims',
      'Prepared and e-filed ITR-1, ITR-2, and ITR-4 returns for diverse salary and commercial business clients',
      'Advised clients on tax planning, Section 115BAC regime comparison, and advance tax computations'
    ],
    deliverables_hi: [
      'सक्रिय प्रैक्टिस में 500+ वैधानिक GST एवं आयकर फाइलिंग का सीधा प्रबंधन, शून्य पेनल्टी नोटिस के साथ 100% समय पर प्रस्तुति दर बनाए रखी।',
      'डुप्लिकेट या अपात्र दावों की पहचान करते हुए कठोर GSTR-2B बनाम परचेज लेजर ITC समाधान संचालित किया।',
      'विविध वेतनभोगी और वाणिज्यिक व्यावसायिक ग्राहकों के लिए ITR-1, ITR-2 और ITR-4 रिटर्न तैयार और ई-फाइल किए।',
      'कर योजना, धारा 115BAC व्यवस्था तुलना और अग्रिम कर गणना पर ग्राहकों को रणनीतिक परामर्श दिया।'
    ],
    techStack: ['GST Portal', 'Income Tax E-Filing', 'Tally Prime', 'MS Excel', 'Form 26AS / AIS', 'E-Way Bill'],
    accentColor: '#FF4D6D',
    activeHighlight: true,
    trackBadge: 'Financial Track',
    trackBadge_hi: 'वित्तीय ट्रैक'
  },
  {
    id: 'exp-02',
    targetId: 'exp-senior-accountant',
    period: '2022 — PRESENT',
    period_hi: '2022 — वर्तमान',
    status: 'Core Accounting (7+ Years)',
    status_hi: 'कोर अकाउंटिंग (7+ वर्ष)',
    role: 'Senior Tally Accountant',
    role_hi: 'सीनियर Tally अकाउंटेंट',
    company: 'Commercial & Retail Enterprises',
    company_hi: 'वाणिज्यिक एवं खुदरा उद्यम',
    location: 'Medininagar (Palamau), Jharkhand',
    location_hi: 'मेदिनीनगर (पलामू), झारखंड',
    description: 'Directing full-cycle double-entry bookkeeping, daily vouchers, inventory accounting, bank reconciliations, and year-end balance sheet finalization.',
    description_hi: 'पूर्ण चक्र डबल-एंट्री बहीखाता, दैनिक वाउचर, इन्वेंट्री लेखांकन, बैंक समाधान और वर्ष-अंत बैलेंस शीट फाइनलाइजेशन का संचालन।',
    deliverables: [
      'Maintained multi-company accounts with comprehensive ledger hierarchy, cash book, and day book governance',
      'Processed automated Bank Reconciliation Statements (BRS) across multiple commercial banking accounts',
      'Administered inventory batches, purchase orders, sales invoices, and stock valuation in Tally Prime & ERP 9',
      'Generated accurate monthly Trial Balances, P&L statements, and audit-ready final Balance Sheets'
    ],
    deliverables_hi: [
      'व्यापक लेजर पदानुक्रम, कैश बुक और डे बुक प्रशासन के साथ बहु-कंपनी खातों का प्रबंधन किया।',
      'कई वाणिज्यिक बैंकिंग खातों में स्वचालित बैंक समाधान विवरण (BRS) संसाधित किए।',
      'Tally Prime और ERP 9 में इन्वेंट्री बैच, खरीद आदेश, बिक्री चालान और स्टॉक मूल्यांकन का प्रशासन किया।',
      'सटीक मासिक ट्रायल बैलेंस, लाभ-हानि विवरण और ऑडिट-तैयार अंतिम बैलेंस शीट तैयार की।'
    ],
    techStack: ['Tally Prime', 'Tally.ERP 9', 'Financial Auditing', 'BRS', 'Advanced Excel', 'Voucher Control'],
    accentColor: '#10B981',
    activeHighlight: true
  },
  {
    id: 'exp-03',
    targetId: 'exp-mis-executive',
    period: '2021 — 2023',
    period_hi: '2021 — 2023',
    status: 'Government Skill Mission',
    status_hi: 'सरकारी कौशल मिशन',
    role: 'MIS Executive',
    role_hi: 'MIS एग्जीक्यूटिव',
    company: 'DAY-NULM (National Urban Livelihoods Mission)',
    company_hi: 'DAY-NULM (राष्ट्रीय शहरी आजीविका मिशन)',
    location: 'Jharkhand Region',
    location_hi: 'झारखंड क्षेत्र',
    description: 'Spearheaded database administration, candidate enrollment tracking, biometric attendance, and analytical reporting for Skill India urban training initiatives.',
    description_hi: 'स्किल इंडिया शहरी प्रशिक्षण पहलों के लिए डेटाबेस प्रशासन, उम्मीदवार नामांकन ट्रैकिंग, बायोमेट्रिक उपस्थिति और विश्लेषणात्मक रिपोर्टिंग का नेतृत्व किया।',
    deliverables: [
      'Maintained real-time trainee lifecycle databases across batch mobilization, classroom attendance, and certification',
      'Compiled daily, weekly, and monthly MIS progress analytics for district urban development agencies (DUDAs)',
      'Managed official central/state portal data synchronization with 100% data integrity and zero error margins',
      'Coordinated assessment scheduling, placement documentation, and post-placement tracking dashboards'
    ],
    deliverables_hi: [
      'बैच लामबंदी, कक्षा उपस्थिति और प्रमाणन में वास्तविक समय प्रशिक्षु जीवनचक्र डेटाबेस बनाए रखा।',
      'जिला शहरी विकास एजेंसियों (DUDAs) के लिए दैनिक, साप्ताहिक और मासिक MIS प्रगति एनालिटिक्स संकलित किए।',
      '100% डेटा अखंडता और शून्य त्रुटि मार्जिन के साथ आधिकारिक केंद्रीय/राज्य पोर्टल डेटा सिंक्रोनाइज़ेशन प्रबंधित किया।',
      'मूल्यांकन शेड्यूलिंग, प्लेसमेंट दस्तावेज़ीकरण और प्लेसमेंट के बाद ट्रैकिंग डैशबोर्ड का समन्वय किया।'
    ],
    techStack: ['DAY-NULM Portal', 'Skill India SDMS', 'Advanced Excel', 'MIS Reporting', 'Data Analytics', 'Biometric Systems'],
    accentColor: '#8B5CF6',
    activeHighlight: false,
    trackBadge: 'Data & Operations Track',
    trackBadge_hi: 'डेटा एवं परिचालन ट्रैक'
  },
  {
    id: 'exp-04',
    targetId: 'exp-junks-food',
    period: '2020 — 2022',
    period_hi: '2020 — 2022',
    status: 'FMCG Distribution',
    status_hi: 'FMCG वितरण',
    role: 'Accountant & Inventory Controller',
    role_hi: 'अकाउंटेंट एवं इन्वेंट्री कंट्रोलर',
    company: 'Junks Food Agency',
    company_hi: 'जंक्स फूड एजेंसी',
    location: 'Medininagar, Jharkhand',
    location_hi: 'मेदिनीनगर, झारखंड',
    description: 'Executed commercial point-of-sale billing, inventory flow, franchise settlements, and vendor accounts using Path Solution ERP software.',
    description_hi: 'Path Solution ERP सॉफ्टवेयर का उपयोग करके वाणिज्यिक बिक्री-बिंदु बिलिंग, इन्वेंट्री प्रवाह, फ्रैंचाइज़ी निपटान और विक्रेता खातों का निष्पादन।',
    deliverables: [
      'Operated Path Solution software for high-frequency distributor billing, stock entry, and daily sales closing',
      'Tracked warehouse stock intake, FIFO batch rotations, breakage claims, and transit loss reconciliations',
      'Managed vendor ledger accounts, distributor credit terms, and daily route-van collection settlements',
      'Prepared weekly sales velocity reports and stock replenishment requisitions for brand principals'
    ],
    deliverables_hi: [
      'उच्च-आवृत्ति वितरक बिलिंग, स्टॉक प्रविष्टि और दैनिक बिक्री समापन के लिए Path Solution सॉफ्टवेयर का संचालन किया।',
      'वेयरहाउस स्टॉक इनटेक, FIFO बैच रोटेशन, टूट-फूट दावों और पारगमन नुकसान समाधान को ट्रैक किया।',
      'विक्रेता लेजर खातों, वितरक क्रेडिट शर्तों और दैनिक रूट-वैन संग्रह बस्तियों का प्रबंधन किया।',
      'ब्रांड प्रिंसिपलों के लिए साप्ताहिक बिक्री वेग रिपोर्ट और स्टॉक पुनःपूर्ति मांग तैयार की।'
    ],
    techStack: ['Path Solution ERP', 'Inventory Control', 'Wholesale Billing', 'Vendor Ledger', 'Cash Reconciliation', 'Stock Auditing'],
    accentColor: '#F59E0B',
    activeHighlight: false
  },
  {
    id: 'exp-05',
    targetId: 'exp-smart-card',
    period: '2019 — 2021',
    period_hi: '2019 — 2021',
    status: 'Field Operations',
    status_hi: 'फील्ड ऑपरेशंस',
    role: 'Smart Card Operations Specialist',
    role_hi: 'स्मार्ट कार्ड ऑपरेशंस विशेषज्ञ',
    company: 'Regional E-Governance & Citizen ID Project',
    company_hi: 'क्षेत्रीय ई-गवर्नेंस एवं नागरिक पहचान परियोजना',
    location: '4 Districts (Palamau, Garhwa, Chatra, Rohtas)',
    location_hi: '4 जिले (पलामू, गढ़वा, चतरा, रोहतास)',
    description: 'Supervised biometric enrollment, card personalization, secure chip encoding, and citizen distribution workflows across 4 administrative districts.',
    description_hi: '4 प्रशासनिक जिलों में बायोमेट्रिक नामांकन, कार्ड वैयक्तिकरण, सुरक्षित चिप एन्कोडिंग और नागरिक वितरण वर्कफ़्लो का पर्यवेक्षण किया।',
    deliverables: [
      'Orchestrated mobile field enrollment camps and district headquarters card distribution across Bihar & Jharkhand',
      'Validated citizen demographic databases and KYC identity credentials against statutory guidelines',
      'Maintained hardware peripherals: fingerprint scanners, digital signature pads, and thermal card printers',
      'Trained local operator teams on secure field data capture, backup protocols, and grievance resolution'
    ],
    deliverables_hi: [
      'बिहार और झारखंड में मोबाइल फील्ड नामांकन शिविर और जिला मुख्यालय कार्ड वितरण का आयोजन किया।',
      'वैधानिक दिशानिर्देशों के अनुसार नागरिक जनसांख्यिकीय डेटाबेस और KYC पहचान क्रेडेंशियल्स को सत्यापित किया।',
      'हार्डवेयर बाह्य उपकरणों का रखरखाव: फ़िंगरप्रिंट स्कैनर, डिजिटल सिग्नेचर पैड और थर्मल कार्ड प्रिंटर।',
      'सुरक्षित फील्ड डेटा कैप्चर, बैकअप प्रोटोकॉल और शिकायत निवारण पर स्थानीय ऑपरेटर टीमों को प्रशिक्षित किया।'
    ],
    techStack: ['Smart Card Encoding', 'Biometric Enrollment', 'District Logistics', 'KYC Verification', 'Field Ops', 'Hardware Maintenance'],
    accentColor: '#3B82F6',
    activeHighlight: false
  },
  {
    id: 'exp-06',
    targetId: 'exp-instructor',
    period: '2018 — 2020',
    period_hi: '2018 — 2020',
    status: 'Academic & IT Training',
    status_hi: 'शैक्षणिक एवं IT प्रशिक्षण',
    role: 'Computer Instructor & Academic Tutor',
    role_hi: 'कंप्यूटर प्रशिक्षक एवं शैक्षणिक शिक्षक',
    company: 'Computer Training Institute & Private Academy',
    company_hi: 'कंप्यूटर प्रशिक्षण संस्थान एवं निजी अकादमी',
    location: 'Daltonganj, Jharkhand',
    location_hi: 'डालटनगंज, झारखंड',
    description: 'Instructed diploma students in computer applications, office productivity suites, desktop publishing, and foundational hardware troubleshooting.',
    description_hi: 'डिप्लोमा छात्रों को कंप्यूटर अनुप्रयोगों, कार्यालय उत्पादकता सुइट्स, डेस्कटॉप प्रकाशन और मूलभूत हार्डवेयर समस्या निवारण का प्रशिक्षण दिया।',
    deliverables: [
      'Delivered structured lectures and hands-on laboratory sessions on MS Office (Word, Excel, PowerPoint)',
      'Taught Desktop Publishing (DTP) workflows covering Adobe Photoshop, CorelDraw, and Adobe PageMaker',
      'Guided students through practical accounting entries and voucher fundamentals in Tally ERP 9',
      'Provided private tutoring in academic subjects and practical computer literacy for aspiring professionals'
    ],
    deliverables_hi: [
      'MS Office (Word, Excel, PowerPoint) पर संरचित व्याख्यान और व्यावहारिक प्रयोगशाला सत्र वितरित किए।',
      'Adobe Photoshop, CorelDraw और Adobe PageMaker को कवर करते हुए डेस्कटॉप पब्लिशिंग (DTP) वर्कफ़्लो सिखाया।',
      'Tally ERP 9 में व्यावहारिक लेखा प्रविष्टियों और वाउचर बुनियादी बातों के माध्यम से छात्रों का मार्गदर्शन किया।',
      'उभरते पेशेवरों के लिए शैक्षणिक विषयों और व्यावहारिक कंप्यूटर साक्षरता में निजी शिक्षण प्रदान किया।'
    ],
    techStack: ['MS Office Suite', 'Adobe Photoshop', 'CorelDraw', 'Adobe PageMaker', 'Tally Fundamentals', 'Teaching & Mentoring'],
    accentColor: '#EC4899',
    activeHighlight: false
  },
  {
    id: 'exp-other-01',
    targetId: 'exp-other-controller',
    period: '2023 — PRESENT',
    period_hi: '2023 — वर्तमान',
    status: 'Corporate Financial Controls & Strategy',
    status_hi: 'कॉर्पोरेट वित्तीय नियंत्रण एवं रणनीति',
    role: 'Corporate Financial Controller & Tax Strategy Lead',
    role_hi: 'कॉर्पोरेट वित्तीय नियंत्रक एवं कर रणनीति प्रमुख',
    company: 'Strategic Corporate Advisory & Enterprise Accounts',
    company_hi: 'रणनीतिक कॉर्पोरेट सलाहकार एवं उद्यम खाते',
    location: 'Daltonganj & Regional Jharkhand',
    location_hi: 'डालटनगंज एवं क्षेत्रीय झारखंड',
    description: 'Directing end-to-end corporate financial controls, statutory tax architecture, internal audit workflows, and multi-entity balance sheet finalization.',
    description_hi: 'एंड-टू-एंड कॉर्पोरेट वित्तीय नियंत्रण, वैधानिक कर संरचना, आंतरिक ऑडिट वर्कफ़्लो और बहु-इकाई बैलेंस शीट फाइनलाइजेशन का निर्देशन।',
    deliverables: [
      'Enforced strict corporate internal financial controls and risk governance policies across multi-entity commercial accounts.',
      'Directed corporate tax optimization under Section 115BAC, direct/indirect tax compliance, and automated GSTR-9 reconciliations.',
      'Established multi-tier purchase-sales matching protocols and variance thresholds preventing fiscal leakages and penalty notices.',
      'Supervised annual balance sheet finalization, trial balance audits, and statutory audit readiness dossiers with 100% compliance.'
    ],
    deliverables_hi: [
      'मल्टी-इकाई वाणिज्यिक खातों में सख्त कॉर्पोरेट आंतरिक वित्तीय नियंत्रण और जोखिम प्रशासन नीतियों को लागू किया।',
      'धारा 115BAC के तहत कॉर्पोरेट कर अनुकूलन, प्रत्यक्ष/अप्रत्यक्ष कर अनुपालन और स्वचालित GSTR-9 समाधान का निर्देशन किया।',
      'वित्तीय रिसाव और पेनल्टी नोटिस को रोकने के लिए बहु-स्तरीय खरीद-बिक्री मिलान प्रोटोकॉल और विचरण सीमाएं स्थापित कीं।',
      '100% अनुपालन के साथ वार्षिक बैलेंस शीट फाइनलाइजेशन, ट्रायल बैलेंस ऑडिट और वैधानिक ऑडिट तत्परता फाइलों का पर्यवेक्षण किया।'
    ],
    techStack: ['Corporate Controls', 'Statutory Auditing', 'Tally Prime ERP', 'Section 115BAC', 'GSTR-9 Audit', 'Financial Governance'],
    accentColor: '#8B5CF6',
    activeHighlight: true
  },
  {
    id: 'exp-other-02',
    targetId: 'exp-other-bi-systems',
    period: '2021 — PRESENT',
    period_hi: '2021 — वर्तमान',
    status: 'BI Systems & ERP Automation',
    status_hi: 'BI सिस्टम एवं ERP ऑटोमेशन',
    role: 'BI Systems Architect & Financial Operations Lead',
    role_hi: 'BI सिस्टम आर्किटेक्ट एवं वित्तीय संचालन प्रमुख',
    company: 'Enterprise Systems & Commercial Distribution',
    company_hi: 'एंटरप्राइज सिस्टम एवं वाणिज्यिक वितरण',
    location: 'Medininagar (Palamau), Jharkhand',
    location_hi: 'मेदिनीनगर (पलामू), झारखंड',
    description: 'Architecting Power BI fiscal dashboards, automated ERP reconciliation pipelines, and real-time operational KPI telemetry.',
    description_hi: 'Power BI वित्तीय डैशबोर्ड, स्वचालित ERP समाधान पाइपलाइन और वास्तविक समय परिचालन KPI टेलीमेट्री का निर्माण।',
    deliverables: [
      'Engineered executive Power BI fiscal dashboards connecting ERP databases with live revenue, gross margin, and working capital telemetry.',
      'Automated multi-depot Bank Reconciliation Statements (BRS) and stock variance detection routines in Path Solution ERP.',
      'Built automated data normalization pipelines bridging disparate operational databases with zero manual transcription latency.',
      'Mentored senior leadership on interactive financial modeling, variance decomposition, and data-driven resource allocation.'
    ],
    deliverables_hi: [
      'लाइव राजस्व, सकल मार्जिन और कार्यशील पूंजी टेलीमेट्री के साथ ERP डेटाबेस को जोड़ने वाले कार्यकारी Power BI वित्तीय डैशबोर्ड तैयार किए।',
      'Path Solution ERP में स्वचालित मल्टी-डिपो बैंक समाधान विवरण (BRS) और स्टॉक विचरण का पता लगाने वाले रूटीन बनाए।',
      'शून्य मैनुअल ट्रांसक्रिप्शन विलंबता के साथ असमान परिचालन डेटाबेस को जोड़ने वाली स्वचालित डेटा सामान्यीकरण पाइपलाइन बनाई।',
      'इंटरैक्टिव वित्तीय मॉडलिंग, विचरण अपघटन और डेटा-संचालित संसाधन आवंटन पर वरिष्ठ नेतृत्व का मार्गदर्शन किया।'
    ],
    techStack: ['Power BI Dashboards', 'DAX Financial Modeling', 'Path Solution ERP', 'Automated BRS', 'ETL Pipelines', 'Inventory Analytics'],
    accentColor: '#10B981',
    activeHighlight: true
  },
  {
    id: 'exp-other-03',
    targetId: 'exp-other-compliance',
    period: '2018 — 2023',
    period_hi: '2018 — 2023',
    status: 'Enterprise Data & Compliance Oversight',
    status_hi: 'एंटरप्राइज डेटा एवं अनुपालन निगरानी',
    role: 'Executive Data & Enterprise Compliance Director',
    role_hi: 'कार्यकारी डेटा एवं एंटरप्राइज अनुपालन निदेशक',
    company: 'Regional Operations & Institutional Governance',
    company_hi: 'क्षेत्रीय संचालन एवं संस्थागत प्रशासन',
    location: 'Palamau, Garhwa, Chatra, Rohtas Districts',
    location_hi: 'पलामू, गढ़वा, चतरा, रोहतास जिले',
    description: 'Directing inter-departmental statutory governance, multi-district database systems, and institutional audit verification across 4 administrative districts.',
    description_hi: '4 प्रशासनिक जिलों में अंतर-विभागीय वैधानिक प्रशासन, बहु-जिला डेटाबेस सिस्टम और संस्थागत ऑडिट सत्यापन का निर्देशन।',
    deliverables: [
      'Governed large-scale citizen biometric enrollment databases and smart card personalization pipelines across 4 administrative districts.',
      'Formulated executive compliance dossiers, institutional audit trails, and multi-tier statutory verification frameworks.',
      'Supervised regional technical teams, hardware infrastructure reliability, and state/central government portal synchronizations.',
      'Conducted systematic internal audits of public program expenditures, maintaining zero compliance defects and complete transparency.'
    ],
    deliverables_hi: [
      '4 प्रशासनिक जिलों में बड़े पैमाने पर नागरिक बायोमेट्रिक नामांकन डेटाबेस और स्मार्ट कार्ड वैयक्तिकरण पाइपलाइनों का संचालन किया।',
      'कार्यकारी अनुपालन डोजियर, संस्थागत ऑडिट ट्रेल्स और बहु-स्तरीय वैधानिक सत्यापन ढांचे तैयार किए।',
      'क्षेत्रीय तकनीकी टीमों, हार्डवेयर बुनियादी ढांचे की विश्वसनीयता और राज्य/केंद्र सरकार के पोर्टल सिंक्रोनाइज़ेशन का पर्यवेक्षण किया।',
      'सार्वजनिक कार्यक्रम व्यय के व्यवस्थित आंतरिक ऑडिट का संचालन किया, शून्य अनुपालन दोष और पूर्ण पारदर्शिता बनाए रखी।'
    ],
    techStack: ['Enterprise Data Systems', 'Statutory Auditing', 'Biometric Databases', 'District Operations', 'Audit Trails', 'Public Governance'],
    accentColor: '#6366F1',
    activeHighlight: false
  },
  {
    id: 'exp-vibe-01',
    targetId: 'exp-vibe-coder',
    period: '2026 (6 MONTHS)',
    period_hi: '2026 (6 महीने)',
    status: 'Active AI Practice (Recent / 2026)',
    status_hi: 'सक्रिय AI प्रैक्टिस (हालिया / 2026)',
    role: 'Independent AI Builder / Freelance Vibe Coder',
    role_hi: 'स्वतंत्र AI निर्माता / फ्रीलांस Vibe Coder',
    company: 'Self-Employed / Stealth SaaS Studio',
    company_hi: 'स्व-नियोजित / स्टेल्थ SaaS स्टूडियो',
    location: 'Remote / Global',
    location_hi: 'रिमोट / वैश्विक',
    description: 'Rapid prototype deployment, end-to-end fullstack AI SaaS applications, prompt architecture, autonomous coding agent loops, Supabase & Next.js backend, Stripe webhooks, and client delivery.',
    description_hi: 'रैपिड प्रोटोटाइप डिप्लॉयमेंट, एंड-टू-एंड फुलस्टैक AI SaaS ऐप्लिकेशन्स, प्रॉम्प्ट आर्किटेक्चर, ऑटोनॉमस कोडिंग एजेंट लूप्स, Supabase व Next.js बैकएंड और क्लाइंट डिलीवरी।',
    deliverables: [
      'Rapid prototype deployment of 25+ responsive full-stack SaaS MVPs using Cursor Composer, Windsurf Cascade, and Claude Code with 10x faster shipping velocity.',
      'Architected multi-agent autonomous dev loops with Oxlint static analysis, Vitest automated testing, and self-healing error recovery routines.',
      'Integrated Supabase PostgreSQL databases with Row-Level Security (RLS) policies, edge functions, and real-time WebSocket state synchronization.',
      'Deployed production Stripe payment webhooks, subscription billing workflows, and frontier LLM streaming APIs (Claude 3.5 Sonnet, GPT-4o).'
    ],
    deliverables_hi: [
      'Cursor Composer, Windsurf Cascade और Claude Code का उपयोग करके 10 गुना तेज शिपिंग गति के साथ 25+ रिस्पॉन्सिव फुल-स्टैक SaaS MVPs का तेजी से प्रोटोटाइप डिप्लॉयमेंट।',
      'Oxlint स्थैतिक विश्लेषण, Vitest स्वचालित परीक्षण और सेल्फ-हीलिंग त्रुटि सुधार रूटीन के साथ मल्टी-एजेंट स्वायत्त विकास लूप्स का निर्माण।',
      'पंक्ति-स्तरीय सुरक्षा (RLS) नीतियों, एज फ़ंक्शंस और रीयल-टाइम WebSocket स्थिति सिंक्रनाइज़ेशन के साथ Supabase PostgreSQL डेटाबेस को एकीकृत किया।',
      'उत्पादन स्ट्राइप भुगतान वेबहुक, सदस्यता बिलिंग वर्कफ़्लो और फ्रंटियर LLM स्ट्रीमिंग APIs (Claude 3.5 Sonnet, GPT-4o) को तैनात किया।'
    ],
    techStack: ['Next.js 14', 'Cursor AI', 'Claude Code', 'Supabase', 'Tailwind CSS', 'Stripe API', 'TypeScript', 'Autonomous Loops'],
    accentColor: '#10B981',
    activeHighlight: true,
    trackBadge: 'AI & SaaS Track',
    trackBadge_hi: 'AI एवं SaaS ट्रैक'
  }
];

function ExperienceSection() {
  const [activeCard, setActiveCard] = useState(null);
  let roleContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    roleContext = useRoleTab();
  } catch {
    // fallback
  }
  const activeRole = roleContext?.activeRole ?? 'accountant';
  const isOverview = roleContext?.isOverview ?? (activeRole === 'overview');
  const isOther = roleContext?.isOther ?? (activeRole === 'other');
  const isVibe = Boolean(roleContext?.isVibeCoding || activeRole === 'vibe_coding');

  let languageContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    languageContext = useLanguage();
  } catch {
    // fallback
  }
  const t = languageContext?.t ?? ((key, fallback) => fallback || key);
  const isHindi = languageContext?.isHindi ?? false;

  const accentColor = isOverview ? '#6366F1' : isVibe ? '#10B981' : isOther ? '#8B5CF6' : (activeRole === 'mis' ? '#3B82F6' : '#FF4D6D');

  const filteredExperiences = EXPERIENCES.filter((exp) => {
    if (isOverview || activeRole === 'overview') {
      return OVERVIEW_ROLES.includes(exp.id);
    }
    if (isVibe || activeRole === 'vibe_coding') {
      return VIBE_CODING_ROLES.includes(exp.id);
    }
    if (isOther || activeRole === 'other') {
      return OTHER_ROLES.includes(exp.id);
    }
    return activeRole === 'mis' ? MIS_ROLES.includes(exp.id) : ACCOUNTANT_ROLES.includes(exp.id);
  });

  let announce = null;
  try {
    const announcer = useAnnounce();
    announce = announcer?.announce;
  } catch {
    // fallback
  }

  const handleCardClick = (id) => {
    const isExpanding = id !== activeCard;
    setActiveCard(id === activeCard ? null : id);
    soundFX.playPop();
    const exp = filteredExperiences.find((e) => e.id === id);
    if (exp && announce) {
      announce(
        isExpanding
          ? `Expanded milestone: ${(isHindi && exp.role_hi) ? exp.role_hi : exp.role} at ${exp.company}. ${(isHindi && exp.period_hi) ? exp.period_hi : exp.period}.`
          : `Collapsed milestone: ${exp.role}`,
        'polite'
      );
    }
  };

  return (
    <section id="experience" aria-labelledby="experience-heading" className="relative w-full py-24 px-4 sm:px-6 lg:px-8 scroll-mt-28">
      <div className="max-w-7xl mx-auto">
        {/* Section Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#161122] border border-[#E7E2D8] dark:border-[#2D2340] text-[#18181B] dark:text-[#F5F2F8] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs transition-colors whitespace-nowrap max-w-full overflow-x-auto">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
          <span className="truncate sm:overflow-visible">03 ✦ {t('experience.badge', 'Experience')} &bull; {activeRole === 'overview' ? (isHindi ? 'कार्यकारी अवलोकन' : 'Executive Overview') : isVibe ? (isHindi ? 'एआई व वाइब कोडिंग' : 'AI & Vibe Coding') : (isOther || activeRole === 'other') ? (isHindi ? 'कॉर्पोरेट कंट्रोलर व बीआई' : 'Corporate Controller & BI') : activeRole === 'mis' ? (isHindi ? 'डेटा व एमआईएस' : 'Data & MIS') : (isHindi ? 'अकाउंटिंग व टैक्स' : 'Accounting & Tax')}</span>
        </div>

        {/* Header with Title, Period Pill, and Coral Accent Line */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <h2
              id="experience-heading"
              tabIndex={0}
              data-tts={isHindi ? t('experience.title', 'Experience') : "Journey & Experience."}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#18181B] dark:text-white tracking-tight font-['Outfit',sans-serif] leading-[1.08] mb-3 whitespace-normal sm:whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden rounded-xl"
            >
              {isHindi ? (
                <span>व्यावसायिक यात्रा एवं <span className="text-[#FF4D6D]" style={{ color: accentColor }}>अनुभव</span></span>
              ) : (
                <span>Journey &amp; <span className="text-[#FF4D6D]" style={{ color: accentColor }}>Experience</span>.</span>
              )}
            </h2>
            <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: accentColor || '#FF4D6D' }} />
            <p
              tabIndex={0}
              data-tts={
                isHindi
                  ? t('experience.subtitle')
                  : activeRole === 'overview'
                  ? 'Curated flagship highlights synthesized from Financial, Data & Operations, and AI Vibe Coding tracks, showcasing multi-domain mastery.'
                  : isVibe
                  ? 'Independent AI SaaS engineering, rapid prototype deployment, autonomous coding agent loops, and prompt-driven full-stack development.'
                  : isOther || activeRole === 'other'
                  ? 'Advanced specialization in corporate financial controls, automated ERP reconciliation pipelines, Power BI fiscal dashboards, and statutory audit strategy.'
                  : activeRole === 'mis'
                  ? 'Public sector MIS database administration, high-stakes biometric field operations across 4 districts, and automated reporting systems.'
                  : 'Comprehensive career journey spanning financial accounting, statutory GST/Income Tax compliance, government skill mission MIS, and regional field operations.'
              }
              className="text-stone-600 dark:text-stone-300 text-sm md:text-base max-w-xl font-normal leading-relaxed transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-xl p-1 -m-1"
            >
              {isHindi
                ? t('experience.subtitle')
                : activeRole === 'overview'
                ? 'Curated flagship highlights synthesized from Financial, Data & Operations, and AI Vibe Coding tracks, showcasing multi-domain mastery.'
                : isVibe
                ? 'Independent AI SaaS engineering, rapid prototype deployment, autonomous coding agent loops, and prompt-driven full-stack development.'
                : isOther || activeRole === 'other'
                ? 'Advanced specialization in corporate financial controls, automated ERP reconciliation pipelines, Power BI fiscal dashboards, and statutory audit strategy.'
                : activeRole === 'mis'
                ? 'Public sector MIS database administration, high-stakes biometric field operations across 4 districts, and automated reporting systems.'
                : 'Comprehensive career journey spanning financial accounting, statutory GST/Income Tax compliance, government skill mission MIS, and regional field operations.'}
            </p>
          </div>

          {/* Subtitle / Period Pill Badge */}
          <div
            tabIndex={0}
            data-tts={`Timeline: ${
              activeRole === 'overview'
                ? '2018 to 2026, 7+ Years Finance and MIS plus AI Vibe Coding'
                : isVibe
                ? '2026, Rapid AI Prototyping and SaaS Engineering'
                : activeRole === 'accountant'
                ? '2020 to 2026, 4+ Years Core Accounting and 3+ Years Tax Practice'
                : activeRole === 'mis'
                ? '2018 to 2023, 5+ Years Public Sector MIS and Field Operations'
                : '2018 to PRESENT, 7+ Years Corporate Control and BI Systems'
            }`}
            className="flex items-center gap-3 bg-white dark:bg-[#161122] px-4 py-2.5 rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] shadow-2xs self-start md:self-end transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
          >
            <Calendar className="w-4 h-4" style={{ color: accentColor }} />
            <span className="text-xs sm:text-sm font-mono font-bold text-[#18181B] dark:text-stone-200">
              {isHindi ? (
                activeRole === 'overview'
                  ? '2018 — 2026 • 7+ वर्ष वित्त व MIS + AI Vibe Coding'
                  : isVibe
                  ? '2026 (6 महीने) • त्वरित AI प्रोटोटाइपिंग एवं SaaS'
                  : activeRole === 'accountant'
                  ? '2020 — 2026 • 4+ वर्ष कोर लेखांकन एवं 3+ वर्ष कर प्रैक्टिस'
                  : activeRole === 'mis'
                  ? '2018 — 2023 • 5+ वर्ष सरकारी MIS एवं फील्ड ऑपरेशंस'
                  : '2018 — वर्तमान • 7+ वर्ष कॉर्पोरेट कंट्रोल एवं BI सिस्टम'
              ) : (
                activeRole === 'overview'
                  ? '2018 — 2026 • 7+ Years Finance & MIS + AI Vibe Coding'
                  : isVibe
                  ? '2026 (6 Months) • Rapid AI Prototyping & SaaS Engineering'
                  : activeRole === 'accountant'
                  ? '2020 — 2026 • 4+ Years Core Accounting & 3+ Years Tax Practice'
                  : activeRole === 'mis'
                  ? '2018 — 2023 • 5+ Years Public Sector MIS & Field Operations'
                  : '2018 — PRESENT • 7+ Years Corporate Control & BI Systems'
              )}
            </span>
          </div>
        </div>

        {/* AI-Synthesized Role Banner */}
        {Boolean(isOther || activeRole === 'other') && (
          <div className="mb-8 p-4 rounded-2xl bg-purple-50/90 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 shadow-xs flex items-center gap-3.5 text-purple-900 dark:text-purple-200">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0 text-lg">
              🤖
            </div>
            <div className="text-xs sm:text-sm font-medium leading-relaxed">
              <span className="font-bold text-purple-700 dark:text-purple-300">🤖 AI-Synthesized Role (Derived from Verified Tracks):</span>{' '}
              This specialized profile was synthesized by AI from verified Accountant (Statutory Finance) and MIS (Data Analytics &amp; Operations) competencies.
            </div>
          </div>
        )}

        {/* Main Content Card Container */}
        <div className="bg-white dark:bg-[#161122] rounded-3xl border border-[#E7E2D8] dark:border-[#2D2340] p-6 sm:p-10 md:p-12 shadow-xl shadow-stone-900/5 dark:shadow-black/50 relative overflow-hidden transition-colors duration-300">
        {/* Soft subtle background glow */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{
            background: isOverview
              ? 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)'
              : isVibe
              ? 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)'
              : isOther
              ? 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)'
              : activeRole === 'mis'
              ? 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(255,77,109,0.15) 0%, transparent 70%)'
          }}
        />

        {/* Interactive Milestone Cards Grid wrapped in tabpanel */}
        <div
          role="tabpanel"
          id={`experience-role-panel-${activeRole}`}
          aria-labelledby={`experience-role-tab-${activeRole}`}
          tabIndex={0}
          key={activeRole}
          className="animate-tab-fade grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative focus:outline-none"
        >
          {filteredExperiences.map((exp) => {
            const isSelected = activeCard === exp.id;
            return (
              <div
                key={exp.id}
                id={exp.targetId || exp.id}
                role="button"
                tabIndex={0}
                data-card="true"
                data-tts={`Experience Milestone: ${exp.role} at ${exp.company}, ${exp.period}. Status: ${(isHindi && exp.status_hi) ? exp.status_hi : exp.status}. Summary: ${(isHindi && exp.description_hi) ? exp.description_hi : exp.description}`}
                aria-expanded={isSelected}
                aria-label={`${exp.role} at ${exp.company}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(exp.id);
                  }
                }}
                onClick={() => handleCardClick(exp.id)}
                className={`scroll-mt-28 group cursor-pointer rounded-2xl p-6 sm:p-7 border transition-all duration-300 relative flex flex-col justify-between hover:-translate-y-1 hover:border-[#FF4D6D]/30 dark:hover:border-[#D946EF]/50 hover:shadow-lg hover:shadow-[#D946EF]/5 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden ${
                  isSelected
                    ? 'bg-[#FAF8F5] dark:bg-[#100C1A] border-[#FF4D6D] ring-2 ring-[#FF4D6D]/20 shadow-md'
                    : 'bg-[#FAF8F5]/80 dark:bg-[#100C1A]/90 border-[#ECE7DF] dark:border-[#2D2340]'
                }`}
              >
                <div>
                  {/* Top Bar with Period and Status Node */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-mono font-bold px-3 py-1 rounded-full border transition-colors ${
                          exp.activeHighlight
                            ? 'text-[#FF4D6D] dark:text-pink-300 bg-[#FFF0F3] dark:bg-pink-950/40 border-[#FFD1DC] dark:border-pink-900/60'
                            : 'text-stone-600 dark:text-stone-300 bg-white dark:bg-[#201830] border-[#ECE7DF] dark:border-[#2D2340]'
                        }`}
                      >
                        {exp.period}
                      </span>
                      {Boolean((isOverview || activeRole === 'overview') && exp.trackBadge) && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          {(isHindi && exp.trackBadge_hi) ? exp.trackBadge_hi : exp.trackBadge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-500 dark:text-stone-400 font-medium">
                      <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: exp.accentColor }}
                      />
                      {exp.status}
                    </div>
                  </div>

                  {/* Role Title and Company */}
                  <div className="mb-4">
                    <h3
                      tabIndex={0}
                      data-tts={`Role: ${exp.role}`}
                      className="text-xl font-extrabold text-[#18181B] dark:text-[#F4F4F5] font-['Outfit',sans-serif] group-hover:text-[#FF4D6D] dark:group-hover:text-[#FF4D6D] transition-colors flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg px-1 -mx-1"
                    >
                      {exp.role}
                    </h3>
                    <div
                      tabIndex={0}
                      data-tts={`Company: ${exp.company}, Location: ${exp.location}`}
                      className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-medium mt-1 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg px-1 -mx-1"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                      <span>{(isHindi && exp.company_hi) ? exp.company_hi : exp.company}</span>
                      <span>•</span>
                      <span>{(isHindi && exp.location_hi) ? exp.location_hi : exp.location}</span>
                    </div>
                  </div>

                  {/* Summary Description */}
                  <p
                    tabIndex={0}
                    data-tts={`Overview: ${exp.description}`}
                    className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-normal leading-relaxed mb-5 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg p-1 -m-1"
                  >
                    {exp.description}
                  </p>

                  {/* Bullet Deliverables */}
                  <div className="space-y-2 mb-6 pt-4 border-t border-[#ECE7DF] dark:border-[#2D2340]">
                    {exp.deliverables.map((bullet, bIdx) => (
                      <div
                        key={bIdx}
                        tabIndex={0}
                        data-tts={`Deliverable: ${bullet}`}
                        className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300 font-medium leading-relaxed focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg p-1 -m-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4D6D] shrink-0 mt-0.5" />
                        <span>{(isHindi && exp.deliverables_hi && exp.deliverables_hi[bIdx]) ? exp.deliverables_hi[bIdx] : bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Pills */}
                <div className="pt-4 border-t border-[#ECE7DF] dark:border-[#2D2340]">
                  <div className="flex flex-wrap gap-1.5">
                    {exp.techStack.map((tech) => (
                      <span
                        key={tech}
                        tabIndex={0}
                        data-tts={`Technology: ${tech}`}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white dark:bg-[#201830] border border-[#E7E2D8] dark:border-[#2D2340] text-stone-700 dark:text-[#A99EBA] shadow-2xs group-hover:border-[#FF4D6D]/20 dark:group-hover:border-[#FF4D6D]/40 transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Corner Indicator */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-4 h-4 text-[#FF4D6D]/60" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </section>
  );
}

ExperienceSection.displayName = 'ExperienceSection';
export default memo(ExperienceSection);
