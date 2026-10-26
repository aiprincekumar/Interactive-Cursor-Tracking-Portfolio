import React, { useState, useRef, useEffect, memo } from 'react';
import { 
  User, 
  Calendar, 
  Languages, 
  MapPin, 
  GraduationCap, 
  Target, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Terminal, 
  Cpu, 
  Sparkles, 
  Copy, 
  Check, 
  Award, 
  Building2, 
  BadgeCheck,
  FileCheck2,
  Briefcase
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { useRoleTab } from '../context/RoleContext';
import { useAnnounce } from '../context/AnnouncerContext';
import { useLanguage } from '../context/LanguageContext';

// Tab Definitions
const TABS = [
  {
    id: 'story',
    label: 'Story & Vision',
    badge: 'Executive Narrative',
    icon: Sparkles
  },
  {
    id: 'qualifications',
    label: 'Qualifications',
    badge: 'Academic Timeline',
    icon: GraduationCap
  },
  {
    id: 'biodata',
    label: 'Official Bio-Data',
    badge: 'Verified Dossier',
    icon: User
  }
];

// Role-Specific Core Competency Pillars
const ACCOUNTANT_COMPETENCIES = [
  {
    title: 'Statutory Compliance & GST/ITR',
    title_hi: 'वैधानिक अनुपालन एवं GST/ITR',
    category: 'Direct & Indirect Tax',
    category_hi: 'प्रत्यक्ष एवं अप्रत्यक्ष कर',
    icon: ShieldCheck,
    accent: '#FF4D6D',
    bgLight: 'bg-[#FFF0F3]',
    borderLight: 'border-[#FFD1DC]',
    tag: '100% Timely Filing',
    tag_hi: '100% समय पर फाइलिंग',
    description: 'End-to-end management of monthly/quarterly GSTR-1 & GSTR-3B filings, automated GSTR-2B vs purchase register ITC reconciliations, and direct tax preparation for ITR-1, ITR-2, and ITR-4 with zero late-fee penalty track record.',
    description_hi: 'मासिक/त्रैमासिक GSTR-1 और GSTR-3B फाइलिंग का संपूर्ण प्रबंधन, स्वचालित GSTR-2B बनाम परचेज रजिस्टर ITC मिलान, तथा शून्य पेनल्टी रिकॉर्ड के साथ ITR-1, ITR-2 एवं ITR-4 डायरेक्ट टैक्स फाइलिंग।'
  },
  {
    title: 'Audit Readiness & Financial Reporting',
    title_hi: 'ऑडिट तत्परता एवं वित्तीय रिपोर्टिंग',
    category: 'Fiscal Governance',
    category_hi: 'वित्तीय प्रशासन',
    icon: TrendingUp,
    accent: '#10B981',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-100',
    tag: 'Zero-Discrepancy Audits',
    tag_hi: 'शून्य-विसंगति ऑडिट',
    description: 'Trial Balance governance, monthly P&L formulation, and zero-discrepancy year-end Balance Sheet finalization. Rigorous ledger verification, day book governance, and audit trail preparation meeting statutory standards.',
    description_hi: 'ट्रायल बैलेंस प्रशासन, मासिक P&L फॉर्मूलेशन और शून्य-विसंगति वर्ष-अंत बैलेंस शीट फाइनलाइजेशन। वैधानिक मानकों के अनुरूप कठोर लेजर सत्यापन, डे बुक और ऑडिट ट्रेल प्रबंधन।'
  },
  {
    title: 'Tally Prime & ERP Architecture',
    title_hi: 'Tally Prime एवं ERP आर्किटेक्चर',
    category: 'Accounting Tech & Systems',
    category_hi: 'अकाउंटिंग टेक एवं सिस्टम',
    icon: Cpu,
    accent: '#8B5CF6',
    bgLight: 'bg-purple-50',
    borderLight: 'border-purple-100',
    tag: 'Multi-Company Master',
    tag_hi: 'मल्टी-कंपनी मास्टर',
    description: 'Advanced multi-company chart of accounts hierarchy, automated Bank Reconciliation Statements (BRS), FIFO & batch inventory valuation, and synchronized billing workflow administration across enterprise software.',
    description_hi: 'उन्नत मल्टी-कंपनी चार्ट ऑफ अकाउंट्स, स्वचालित बैंक समाधान विवरण (BRS), FIFO एवं बैच इन्वेंट्री मूल्यांकन, तथा एंटरप्राइज सॉफ्टवेयर पर सिंक्रोनाइज्ड बिलिंग वर्कफ़्लो प्रशासन।'
  },
  {
    title: 'Commercial Ledger Governance',
    title_hi: 'वाणिज्यिक लेजर प्रशासन',
    category: 'Scale & Commercial Control',
    category_hi: 'व्यावसायिक नियंत्रण',
    icon: Briefcase,
    accent: '#F59E0B',
    bgLight: 'bg-amber-50',
    borderLight: 'border-amber-100',
    tag: 'FMCG & Agency Control',
    tag_hi: 'FMCG एवं एजेंसी नियंत्रण',
    description: 'Debtor and creditor aging analysis, cash book scrutiny, supplier payment reconciliation, and Path Solution ERP agency operations ensuring zero shrinkage and tight working capital control.',
    description_hi: 'देनदार और लेनदार आयु विश्लेषण, कैश बुक जांच, आपूर्तिकर्ता भुगतान समाधान, और Path Solution ERP एजेंसी संचालन जिससे शून्य विसंगति और कार्यशील पूंजी पर कड़ा नियंत्रण बना रहे।'
  }
];

const MIS_COMPETENCIES = [
  {
    title: 'Executive MIS & BI Dashboards',
    title_hi: 'कार्यकारी MIS एवं BI डैशबोर्ड',
    category: 'Telemetry & Analytics',
    category_hi: 'टेलीमेट्री एवं एनालिटिक्स',
    icon: TrendingUp,
    accent: '#3B82F6',
    bgLight: 'bg-blue-50',
    borderLight: 'border-blue-100',
    tag: 'Daily Telemetry',
    tag_hi: 'दैनिक टेलीमेट्री',
    description: 'Designing high-impact management telemetry, cross-category revenue trends, KPI scorecard monitoring, and advanced Excel modeling (Pivot Tables, dynamic arrays, nested lookups) for senior leadership.',
    description_hi: 'वरिष्ठ नेतृत्व के लिए उच्च प्रभाव प्रबंधन टेलीमेट्री, राजस्व रुझान, KPI स्कोरकार्ड और उन्नत Excel मॉडलिंग (Pivot Tables, डायनामिक एरे, नेस्टेड लुकअप) का डिजाइन।'
  },
  {
    title: 'Multi-District Operations & Enrollment',
    title_hi: 'बहु-जिला संचालन एवं नामांकन',
    category: 'Scale Field Execution',
    category_hi: 'फील्ड कार्यान्वयन',
    icon: Terminal,
    accent: '#10B981',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-100',
    tag: '50,000+ Enrolled',
    tag_hi: '50,000+ नामांकित',
    description: 'Supervision of RSBY Smart Card field biometric camps across 4 districts (Palamu, Garhwa, Latehar, Chatra), hardware reliability governance, and UIDAI/Aadhaar data verification with zero data loss.',
    description_hi: '4 जिलों (पलामू, गढ़वा, लातेहार, चतरा) में RSBY स्मार्ट कार्ड फील्ड बायोमेट्रिक कैंपों का पर्यवेक्षण, हार्डवेयर विश्वसनीयता और शून्य डेटा हानि के साथ UIDAI सत्यापन।'
  },
  {
    title: 'Enterprise Database & Portal Admin',
    title_hi: 'एंटरप्राइज डेटाबेस एवं पोर्टल प्रशासन',
    category: 'Government MIS Systems',
    category_hi: 'सरकारी MIS सिस्टम',
    icon: ShieldCheck,
    accent: '#8B5CF6',
    bgLight: 'bg-purple-50',
    borderLight: 'border-purple-100',
    tag: '100% Portal Sync',
    tag_hi: '100% पोर्टल सिंक',
    description: 'Candidate lifecycle tracking on national DAY-NULM Skill India portal, biometric attendance synchronization, assessment certification records, and compliance auditing with municipal bodies.',
    description_hi: 'राष्ट्रीय DAY-NULM Skill India पोर्टल पर उम्मीदवार जीवनचक्र ट्रैकिंग, बायोमेट्रिक उपस्थिति सिंक्रोनाइज़ेशन, मूल्यांकन प्रमाणन और नगर निकायों के साथ अनुपालन ऑडिट।'
  },
  {
    title: 'IT Infrastructure & Hardware Architecture',
    title_hi: 'IT इन्फ्रास्ट्रक्चर एवं हार्डवेयर आर्किटेक्चर',
    category: 'Systems & Diagnostics',
    category_hi: 'सिस्टम्स एवं डायग्नोस्टिक्स',
    icon: Cpu,
    accent: '#F59E0B',
    bgLight: 'bg-amber-50',
    borderLight: 'border-amber-100',
    tag: 'Enterprise Deployments',
    tag_hi: 'एंटरप्राइज डिप्लॉयमेंट',
    description: 'Windows 10/11 Pro workstation staging, local group policy hardening, LAN router/switch network cabling, thermal paste diagnostics, and remote branch support via AnyDesk/TeamViewer.',
    description_hi: 'Windows 10/11 Pro वर्कस्टेशन स्टेजिंग, ग्रुप पॉलिसी हार्डनिंग, LAN राउटर/स्विच नेटवर्क केबलिंग, हार्डवेयर डायग्नोस्टिक्स, और AnyDesk/TeamViewer द्वारा रिमोट ब्रांच सपोर्ट।'
  }
];

const VIBE_CODING_COMPETENCIES = [
  {
    title: 'AI-Native Prototyping & Flow',
    title_hi: 'AI-नेnative प्रोटोटाइपिंग एवं फ्लो',
    category: 'Rapid Development',
    category_hi: 'त्वरित विकास',
    icon: Terminal,
    accent: '#10B981',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-100',
    tag: '10x Speed',
    tag_hi: '10x गति',
    description: 'Compressing product development cycles from months into hours using prompt-driven workflows, Cursor, Windsurf, and Claude Code to deliver fully functional full-stack web applications.',
    description_hi: 'Cursor, Windsurf और Claude Code द्वारा प्रॉम्प्ट-आधारित विकास से महीनों के उत्पाद विकास चक्र को घंटों में बदलकर पूर्णतः कार्यशील वेब ऐप्लिकेशन तैयार करना।'
  },
  {
    title: 'Autonomous Multi-Agent Systems',
    title_hi: 'स्वायत्त मल्टी-एजेंट सिस्टम',
    category: 'Agentic Engineering',
    category_hi: 'एजेंटिक इंजीनियरिंग',
    icon: Cpu,
    accent: '#10B981',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-100',
    tag: 'Multi-Agent Loops',
    tag_hi: 'मल्टी-एजेंट लूप्स',
    description: 'Architecting autonomous agent loops, tool harnesses, and continuous verification pipelines that research, write, test, and self-heal complex codebases without manual intervention.',
    description_hi: 'स्वायत्त एजेंट लूप्स, टूल हार्नेस और निरंतर सत्यापन पाइपलाइनों की रचना जो बिना मानवीय हस्तक्षेप के कोडबेस पर रिसर्च, राइटिंग, टेस्टिंग और सेल्फ-हीलिंग करते हैं।'
  },
  {
    title: 'Full-Stack SaaS Architecture',
    title_hi: 'फुल-स्टैक SaaS आर्किटेक्चर',
    category: 'Modern Web Engineering',
    category_hi: 'आधुनिक वेब इंजीनियरिंग',
    icon: ShieldCheck,
    accent: '#10B981',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-100',
    tag: 'Production Ready',
    tag_hi: 'प्रोडक्शन रेडी',
    description: 'Building reactive, scalable full-stack applications with Next.js 14 App Router, React 19, Tailwind CSS, Supabase backend, PostgreSQL relational modeling, and Edge API deployment.',
    description_hi: 'Next.js 14 App Router, React 19, Tailwind CSS, Supabase बैकएंड और PostgreSQL रिलेशनल मॉडलिंग के साथ स्केलेबल फुल-स्टैक ऐप्लिकेशन्स का निर्माण।'
  },
  {
    title: 'LLM Orchestration & Prompting',
    title_hi: 'LLM ऑर्केस्ट्रेशन एवं प्रॉम्प्टिंग',
    category: 'Generative AI Systems',
    category_hi: 'जनरेटिव AI सिस्टम',
    icon: Sparkles,
    accent: '#10B981',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-100',
    tag: 'Claude & GPT APIs',
    tag_hi: 'Claude एवं GPT APIs',
    description: 'Deep context window engineering, structured JSON outputs, function calling, streaming responses, and prompt chaining across frontier models (Claude 3.5 Sonnet, GPT-4o, Gemini 1.5 Pro).',
    description_hi: 'फ्रंटियर मॉडल्स (Claude 3.5 Sonnet, GPT-4o, Gemini 1.5 Pro) के लिए डीप कॉन्टेक्स्ट विंडो इंजीनियरिंग, स्ट्रक्चर्ड JSON आउटपुट, फंक्शन कॉलिंग और प्रॉम्प्ट चेनिंग।'
  }
];

const OVERVIEW_COMPETENCIES = [
  {
    title: 'Statutory Compliance & GST/ITR',
    category: 'Financial Track',
    icon: ShieldCheck,
    accent: '#FF4D6D',
    bgLight: 'bg-[#FFF0F3]',
    borderLight: 'border-[#FFD1DC]',
    tag: 'Financial Track',
    description: 'End-to-end statutory taxation across GSTR-1, GSTR-3B, GSTR-9, and ITR-1 to ITR-4 filings with automated 2B ITC reconciliations and zero late-fee penalty track record.'
  },
  {
    title: 'Executive MIS & Enterprise Data Systems',
    category: 'Data & Operations Track',
    icon: TrendingUp,
    accent: '#3B82F6',
    bgLight: 'bg-blue-50',
    borderLight: 'border-blue-100',
    tag: 'Data & Operations Track',
    description: 'Designing high-impact management telemetry, cross-category operational trends, advanced Excel modeling, and DAY-NULM government portal administration.'
  },
  {
    title: 'Autonomous AI Engineering & Vibe Coding',
    category: 'AI & Autonomous Track',
    icon: Terminal,
    accent: '#10B981',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-100',
    tag: 'AI & Autonomous Track',
    description: 'Prompt-driven fullstack SaaS prototyping, agentic engineering with Cursor & Windsurf, autonomous dev loops, and rapid deployment velocity.'
  },
  {
    title: 'Audit Readiness & Financial Reporting',
    category: 'Financial Track',
    icon: Award,
    accent: '#FF4D6D',
    bgLight: 'bg-[#FFF0F3]',
    borderLight: 'border-[#FFD1DC]',
    tag: 'Financial Track',
    description: 'Trial Balance governance, monthly P&L formulation, and zero-discrepancy year-end Balance Sheet finalization with rigorous double-entry ledger verification.'
  },
  {
    title: 'Multi-District Operations & Biometric Systems',
    category: 'Data & Operations Track',
    icon: Terminal,
    accent: '#3B82F6',
    bgLight: 'bg-blue-50',
    borderLight: 'border-blue-100',
    tag: 'Data & Operations Track',
    description: 'Supervision of RSBY Smart Card field biometric camps across 4 districts (Palamu, Garhwa, Latehar, Chatra), hardware reliability governance, and UIDAI data verification.'
  }
];

const OTHER_COMPETENCIES = [
  {
    title: 'Corporate Financial Controls',
    category: 'Corporate Governance',
    icon: ShieldCheck,
    accent: '#8B5CF6',
    bgLight: 'bg-purple-50',
    borderLight: 'border-purple-100',
    tag: 'Internal Controls',
    description: 'Enforcing robust corporate internal financial controls, multi-entity accounting policies, variance threshold governance, and continuous audit trails ensuring zero compliance leakage.'
  },
  {
    title: 'Power BI Fiscal Dashboards',
    category: 'Business Intelligence',
    icon: TrendingUp,
    accent: '#8B5CF6',
    bgLight: 'bg-purple-50',
    borderLight: 'border-purple-100',
    tag: 'BI & DAX Models',
    description: 'Architecting executive Power BI telemetry connecting ERP ledgers to dynamic revenue analytics, gross margin breakdown, automated variance tracking, and real-time cash flow metrics.'
  },
  {
    title: 'ERP Automation & Reconciliation',
    category: 'Systems Automation',
    icon: Cpu,
    accent: '#8B5CF6',
    bgLight: 'bg-purple-50',
    borderLight: 'border-purple-100',
    tag: 'ERP Integration',
    description: 'Building automated data pipelines between Tally Prime, Path Solution ERP, and banking systems for instantaneous bank reconciliations (BRS) and supplier ledger verification.'
  },
  {
    title: 'Statutory Auditing & Tax Strategy',
    category: 'Statutory Optimization',
    icon: FileCheck2,
    accent: '#8B5CF6',
    bgLight: 'bg-purple-50',
    borderLight: 'border-purple-100',
    tag: 'Statutory Audit',
    description: 'Strategic direct and indirect tax planning, Section 115BAC tax optimization, GSTR-9 annual filing reviews, and comprehensive statutory audit defense with zero penalty notices.'
  }
];

const VIBE_CODING_STORY = {
  alignmentBadge: 'AI Alignment',
  alignmentBadge_hi: 'AI संरेखण',
  p1: (
    <>
      I am a <strong className="text-[#10B981] font-bold">Vibe Coder &amp; AI Software Engineer</strong> specializing in prompt-driven software architecture, autonomous agent workflows, and rapid full-stack SaaS engineering.
    </>
  ),
  p1_hi: (
    <>
      मैं प्रॉम्प्ट-संचालित सॉफ्टवेयर आर्किटेक्चर, स्वायत्त एजेंट वर्कफ़्लो और रैपिड फुल-स्टैक SaaS इंजीनियरिंग में विशेषज्ञता रखने वाला एक <strong className="text-[#10B981] font-bold">Vibe Coder एवं AI सॉफ्टवेयर इंजीनियर</strong> हूँ।
    </>
  ),
  p2: 'I leverage cutting-edge AI coding environments (Cursor, Windsurf, Claude Code, and v0.dev) to compress development timelines from months into hours—translating product ideas into production-ready software with unmatched velocity.',
  p2_hi: 'मैं आधुनिक AI कोडिंग वातावरण (Cursor, Windsurf, Claude Code, और v0.dev) का उपयोग करके विकास समय-सीमा को महीनों से घंटों में संपीड़ित करता हूँ—उत्पाद विचारों को अद्वितीय गति से प्रोडक्शन-रेडी सॉफ्टवेयर में बदलता हूँ।',
  p3: 'Rooted in hands-on modern full-stack development with Next.js, React, Tailwind CSS, and Supabase, I build resilient, reactive web architectures while orchestrating intelligent multi-agent loops and automated QA verification gates.',
  p3_hi: 'Next.js, React, Tailwind CSS, और Supabase के साथ आधुनिक फुल-स्टैक विकास में स्थित, मैं लचीले रिएक्टिव वेब आर्किटेक्चर का निर्माण करता हूँ और बुद्धिमान मल्टी-एजेंट लूप्स व स्वचालित QA सत्यापन गेट्स को संचालित करता हूँ।',
  visionTitle: 'Engineering Vision & Strategic Objective',
  visionTitle_hi: 'इंजीनियरिंग विज़न एवं रणनीतिक उद्देश्य',
  visionQuote: (
    <>
      "AI Software Engineer &amp; Vibe Coder seeking high-impact assignments in <strong className="text-[#10B981] font-bold">Rapid Full-Stack Prototyping, Autonomous Coding &amp; SaaS Engineering</strong> within ambitious product teams. Dedicated to architecting prompt-driven systems, accelerating feature delivery cycles by 10x, and pioneering autonomous software development loops that transform ambitious concepts into scalable products."
    </>
  ),
  visionQuote_hi: (
    <>
      "महत्वाकांक्षी उत्पाद टीमों के भीतर <strong className="text-[#10B981] font-bold">रैपिड फुल-स्टैक प्रोटोटाइपिंग, स्वायत्त कोडिंग एवं SaaS इंजीनियरिंग</strong> में उच्च-प्रभाव भूमिकाओं की तलाश में AI सॉफ्टवेयर इंजीनियर। प्रॉम्प्ट-संचालित सिस्टम तैयार करने, फीचर डिलीवरी चक्र को 10 गुना तेज करने और स्वायत्त सॉफ्टवेयर विकास लूप्स का नेतृत्व करने के लिए समर्पित।"
    </>
  )
};

const OVERVIEW_STORY = {
  alignmentBadge: 'Executive Alignment',
  alignmentBadge_hi: 'कार्यकारी संरेखण',
  p1: (
    <>
      I am a <strong className="text-[#6366F1] font-bold">Financial, Operations &amp; AI Software Executive</strong> with unified expertise synthesizing statutory accounting, corporate taxation, enterprise MIS data intelligence, and rapid AI vibe coding.
    </>
  ),
  p1_hi: (
    <>
      मैं वैधानिक लेखांकन, कॉर्पोरेट कराधान, एंटरप्राइज MIS डेटा इंटेलिजेंस और तीव्र AI Vibe Coding को संश्लेषित करने वाला एक <strong className="text-[#6366F1] font-bold">वित्तीय, परिचालन एवं AI सॉफ्टवेयर कार्यकारी</strong> हूँ।
    </>
  ),
  p2: 'I bridge fiscal discipline with enterprise data intelligence and autonomous software prototyping—unifying double-entry ledger rigor, zero-penalty GST/ITR compliance, automated Power BI/Excel dashboards, and 10x AI development velocity.',
  p2_hi: 'मैं राजकोषीय अनुशासन को एंटरप्राइज डेटा इंटेलिजेंस और स्वायत्त सॉफ्टवेयर प्रोटोटाइपिंग के साथ जोड़ता हूँ—डबल-एंट्री लेजर अनुशासन, शून्य-पेनल्टी GST/ITR अनुपालन, स्वचालित Power BI/Excel डैशबोर्ड और 10x AI विकास गति को एकीकृत करता हूँ।',
  p3: 'Having directed statutory tax practices, managed nationwide government portal databases (DAY-NULM Skill India), orchestrated multi-district biometric field rollouts, and engineered full-stack AI apps, I deliver end-to-end executive leadership that combines audit readiness with operational velocity.',
  p3_hi: 'वैधानिक कर प्रक्रियाओं के संचालन, DAY-NULM Skill India सरकारी पोर्टल डेटाबेस प्रबंधन, बहु-जिला बायोमेट्रिक फील्ड रोलआउट और फुल-स्टैक AI ऐप्स के निर्माण के अनुभव के साथ, मैं संपूर्ण कार्यकारी नेतृत्व प्रदान करता हूँ।',
  visionTitle: 'Executive Vision & Strategic Objective',
  visionTitle_hi: 'कार्यकारी विज़न एवं रणनीतिक उद्देश्य',
  visionQuote: (
    <>
      "Multi-Domain Executive seeking senior leadership roles bridging <strong className="text-[#6366F1] font-bold">Statutory Accounting, Taxation, Advanced Data Intelligence &amp; Autonomous AI Engineering</strong> within dynamic organizations of repute. Dedicated to architecting audit-ready financial frameworks, automated operational telemetry, and resilient software pipelines that drive sustainable commercial growth."
    </>
  ),
  visionQuote_hi: (
    <>
      "प्रतिष्ठित गतिशील संगठनों के भीतर <strong className="text-[#6366F1] font-bold">वैधानिक लेखांकन, कराधान, उन्नत डेटा इंटेलिजेंस और स्वायत्त AI इंजीनियरिंग</strong> को जोड़ने वाली वरिष्ठ नेतृत्व भूमिकाओं की तलाश में बहु-क्षेत्रीय कार्यकारी। ऑडिट-तैयार वित्तीय प्रणाली, स्वचालित रिपोर्टिंग और लचीली सॉफ्टवेयर पाइपलाइन तैयार करने के लिए समर्पित।"
    </>
  )
};

const ACCOUNTANT_STORY = {
  alignmentBadge: 'Leadership Alignment',
  alignmentBadge_hi: 'नेतृत्व संरेखण',
  p1: (
    <>
      I am an experienced <strong className="text-[#FF4D6D] font-bold">Senior Accountant &amp; Tax Consultant</strong> with over 7+ years of expertise in comprehensive financial accounting via Tally ERP/Prime, statutory compliance, and GST &amp; Income Tax advisory.
    </>
  ),
  p1_hi: (
    <>
      मैं Tally ERP/Prime के माध्यम से व्यापक वित्तीय लेखांकन, वैधानिक अनुपालन और GST एवं आयकर परामर्श में 7+ वर्षों के अनुभव वाला एक अनुभवी <strong className="text-[#FF4D6D] font-bold">सीनियर अकाउंटेंट एवं टैक्स कंसल्टेंट</strong> हूँ।
    </>
  ),
  p2: 'I specialize in precision accounting, audit readiness, and statutory tax reconciliation—ensuring 100% compliance, zero-discrepancy balance sheets, and streamlined business operations for enterprises and agencies.',
  p2_hi: 'मैं सटीक लेखांकन, ऑडिट तत्परता और वैधानिक कर समाधान में विशेषज्ञता रखता हूँ—जो उद्यमों और एजेंसियों के लिए 100% अनुपालन, शून्य-विसंगति बैलेंस शीट और सुगम व्यावसायिक संचालन सुनिश्चित करता है।',
  p3: 'With a career rooted in double-entry fiscal discipline, voucher entry governance, and commercial ledger reconciliations across FMCG, agency distribution, and client portfolios, I guarantee verifiable audit trails and robust compliance posture.',
  p3_hi: 'FMCG, एजेंसी वितरण और क्लाइंट पोर्टफोलियो में डबल-एंट्री वित्तीय अनुशासन, वाउचर प्रविष्टि और वाणिज्यिक लेजर समाधान पर आधारित करियर के साथ, मैं सत्यापन योग्य ऑडिट ट्रेल्स और मजबूत अनुपालन की गारंटी देता हूँ।',
  visionTitle: 'Career Vision & Strategic Objective',
  visionTitle_hi: 'करियर विज़न एवं रणनीतिक उद्देश्य',
  visionQuote: (
    <>
      "Senior Financial Accounting &amp; Tax Compliance professional seeking leadership assignments in <strong className="text-[#FF4D6D] font-bold">Financial Accounting &amp; Statutory Tax Governance</strong>, coupled with <strong className="text-[#FF4D6D] font-bold">Business Development &amp; Distribution Operations</strong> within a growth-oriented organization of repute. Dedicated to leveraging 7+ years of rigorous statutory compliance, double-entry fiscal precision, and multi-district operational acumen to build audit-ready financial frameworks and drive sustainable enterprise growth."
    </>
  ),
  visionQuote_hi: (
    <>
      "एक प्रतिष्ठित विकासोन्मुख संगठन में <strong className="text-[#FF4D6D] font-bold">वित्तीय लेखांकन एवं वैधानिक कर प्रशासन</strong> तथा <strong className="text-[#FF4D6D] font-bold">बिजनेस डेवलपमेंट एवं वितरण संचालन</strong> में नेतृत्व की भूमिकाओं हेतु तत्पर वरिष्ठ वित्तीय पेशेवर। 7+ वर्षों के वैधानिक अनुपालन, डबल-एंट्री वित्तीय सटीकता और बहु-जिला परिचालन कौशल का लाभ उठाकर ऑडिट-तैयार वित्तीय प्रणाली बनाने और सतत विकास को गति देने के लिए समर्पित।"
    </>
  )
};

const MIS_STORY = {
  alignmentBadge: 'Analytics Alignment',
  alignmentBadge_hi: 'एनालिटिक्स संरेखण',
  p1: (
    <>
      I am a seasoned <strong className="text-[#3B82F6] font-bold">MIS Executive &amp; Data Operations Specialist</strong> with proven expertise in enterprise telemetry, government portal administration (DAY-NULM Skill India), advanced spreadsheet modeling, and multi-district operational deployments.
    </>
  ),
  p1_hi: (
    <>
      मैं एंटरप्राइज टेलीमेट्री, सरकारी पोर्टल प्रशासन (DAY-NULM Skill India), उन्नत स्प्रेडशीट मॉडलिंग और बहु-जिला परिचालन में सिद्ध विशेषज्ञता रखने वाला एक अनुभवी <strong className="text-[#3B82F6] font-bold">MIS एग्जीक्यूटिव एवं डेटा ऑपरेशंस विशेषज्ञ</strong> हूँ।
    </>
  ),
  p2: 'I specialize in transforming raw operational and financial data into executive BI dashboards, automated reconciliation models, and reliable reporting pipelines that empower leadership to make decisive, data-backed commercial decisions.',
  p2_hi: 'मैं कच्चे परिचालन और वित्तीय डेटा को कार्यकारी BI डैशबोर्ड, स्वचालित समाधान मॉडल और विश्वसनीय रिपोर्टिंग पाइपलाइनों में बदलने में विशेषज्ञ हूँ जो नेतृत्व को डेटा-आधारित निर्णय लेने में सक्षम बनाती हैं।',
  p3: 'Having spearheaded multi-district biometric enrollment campaigns for 50,000+ citizens and administered Windows/LAN IT infrastructure across enterprise and field offices, I combine analytical rigor with hands-on systems reliability.',
  p3_hi: '50,000+ नागरिकों के लिए बहु-जिला बायोमेट्रिक नामांकन अभियानों का नेतृत्व करने और एंटरप्राइज एवं फील्ड कार्यालयों में Windows/LAN IT अवसंरचना का प्रबंधन करने के बाद, मैं विश्लेषणात्मक कठोरता के साथ सिस्टम विश्वसनीयता को जोड़ता हूँ।',
  visionTitle: 'Career Vision & Strategic Objective',
  visionTitle_hi: 'करियर विज़न एवं रणनीतिक उद्देश्य',
  visionQuote: (
    <>
      "MIS &amp; Data Operations professional seeking leadership assignments in <strong className="text-[#3B82F6] font-bold">Management Information Systems (MIS), Business Analytics &amp; Operations Governance</strong> within a data-driven organization of repute. Dedicated to architecting robust reporting telemetry, streamlining cross-departmental data workflows, and optimizing enterprise IT infrastructure to scale operations with accuracy and speed."
    </>
  ),
  visionQuote_hi: (
    <>
      "एक डेटा-संचालित प्रतिष्ठित संगठन में <strong className="text-[#3B82F6] font-bold">प्रबंधन सूचना प्रणाली (MIS), बिजनेस एनालिटिक्स एवं संचालन प्रशासन</strong> में नेतृत्व भूमिकाओं की तलाश में MIS एवं डेटा ऑपरेशंस पेशेवर। सटीक और गति के साथ रिपोर्टिंग टेलीमेट्री और डेटा वर्कफ़्लो को अनुकूलित करने के लिए समर्पित।"
    </>
  )
};

const OTHER_STORY = {
  alignmentBadge: 'Strategic Alignment',
  p1: (
    <>
      I am a <strong className="text-[#8B5CF6] font-bold">Business Intelligence &amp; Corporate Controller</strong> practitioner synthesized by AI from verified dual competencies in statutory accounting and executive MIS analytics.
    </>
  ),
  p2: 'I specialize in corporate financial controls, automated multi-entity ERP reconciliation pipelines (Tally Prime & Path Solution), statutory auditing, and executive Power BI fiscal dashboards that provide real-time decision telemetry for leadership.',
  p3: 'With extensive experience unifying balance sheet governance, automated internal audit trails, Section 115BAC tax strategy, and enterprise database integrations, I ensure zero compliance defects and tight working capital governance.',
  visionTitle: 'Career Vision & Strategic Objective',
  visionQuote: (
    <>
      "Business Intelligence &amp; Corporate Controller professional seeking senior leadership assignments in <strong className="text-[#8B5CF6] font-bold">Corporate Financial Control, BI Systems &amp; Statutory Strategy</strong> within forward-looking enterprises. Dedicated to deploying automated financial controls, high-impact fiscal dashboards, and scalable ERP data architectures that ensure flawless audit readiness and operational excellence."
    </>
  )
};


// Academic & Technical Credentials
const CREDENTIALS = [
  {
    level: '01',
    id: 'edu-adca',
    targetId: 'edu-adca',
    title: 'Advance Diploma in Computer Application (ADCA)',
    institution: 'Infocity Daltonganj',
    location: 'Medininagar (Daltonganj), Jharkhand',
    boardBadge: 'Advanced Computing',
    domainBadge: 'IT & Professional Diploma',
    status: 'Certified Honors',
    accentColor: '#FF4D6D',
    verificationId: 'INF-ADCA-2017-0842',
    rollCode: 'INF-DTO',
    rollNo: '2017/ADCA/042',
    serialNo: 'CERT/JH/2017/09842',
    issueYear: '2017',
    title_hi: 'कंप्यूटर एप्लीकेशन में एडवांस डिप्लोमा (ADCA)',
    institution_hi: 'इन्फोसिटी डालटनगंज',
    location_hi: 'मेदिनीनगर (डालटनगंज), झारखंड',
    boardBadge_hi: 'उन्नत कंप्यूटिंग',
    domainBadge_hi: 'IT एवं व्यावसायिक डिप्लोमा',
    status_hi: 'प्रमाणित ऑनर्स',
    highlights: [
      'Advanced financial modeling, spreadsheet automation & data analytics with MS Excel',
      'Computerized double-entry accounting & voucher entry lifecycle in Tally ERP 9 / Prime',
      'Desktop Publishing (DTP) workflows: Adobe Photoshop, CorelDraw, and Adobe PageMaker',
      'Fundamental hardware diagnostics, OS maintenance & enterprise computer applications'
    ],
    highlights_hi: [
      'MS Excel के साथ उन्नत वित्तीय मॉडलिंग, स्प्रेडशीट स्वचालन और डेटा एनालिटिक्स',
      'Tally ERP 9 / Prime में कंप्यूटरीकृत डबल-एंट्री अकाउंटिंग और वाउचर प्रविष्टि जीवनचक्र',
      'डेस्कटॉप पब्लिशिंग (DTP) वर्कफ़्लो: Adobe Photoshop, CorelDraw और Adobe PageMaker',
      'हार्डवेयर डायग्नोस्टिक्स, OS रखरखाव और एंटरप्राइज कंप्यूटर अनुप्रयोग'
    ]
  },
  {
    level: '02',
    id: 'edu-intermediate',
    targetId: 'edu-intermediate',
    title: 'Intermediate of Arts (I.A.)',
    institution: 'Baba Nawbat Choudhry Surtapur Kundesar Ghazipur',
    location: 'Ghazipur, Uttar Pradesh',
    boardBadge: 'UP Board',
    domainBadge: 'Higher Secondary (10+2)',
    status: 'State Board Verified',
    accentColor: '#8B5CF6',
    verificationId: 'UPB-HSC-2010-1042',
    rollCode: '3204',
    rollNo: '1042891',
    serialNo: 'UP-HS-2010-884102',
    issueYear: '2010',
    title_hi: 'इंटरमीडिएट ऑफ आर्ट्स (I.A.)',
    institution_hi: 'बाबा नौबत चौधरी सुरतापुर कुंडेसर गाजीपुर',
    location_hi: 'गाजीपुर, उत्तर प्रदेश',
    boardBadge_hi: 'UP बोर्ड',
    domainBadge_hi: 'उच्चतर माध्यमिक (10+2)',
    status_hi: 'राज्य बोर्ड सत्यापित',
    highlights: [
      'Comprehensive curriculum under Uttar Pradesh State Board of High School and Intermediate Education',
      'Core studies in Humanities, Social Sciences, Logic & Civic Foundations',
      'Developed strong written communication, critical thinking, and structured analysis'
    ],
    highlights_hi: [
      'उत्तर प्रदेश हाई स्कूल और इंटरमीडिएट शिक्षा बोर्ड के तहत व्यापक पाठ्यक्रम',
      'मानविकी, सामाजिक विज्ञान, तर्कशास्त्र और नागरिक शास्त्र का मुख्य अध्ययन',
      'मजबूत लिखित संचार, आलोचनात्मक सोच और संरचित विश्लेषण का विकास'
    ]
  },
  {
    level: '03',
    id: 'edu-matriculation',
    targetId: 'edu-matriculation',
    title: 'Matriculation (10th Standard)',
    institution: 'Radha Govind Public School Ramgarh Cant',
    location: 'Ramgarh Cant, Jharkhand',
    boardBadge: 'CBSE Board',
    domainBadge: 'Secondary School (10th)',
    status: 'Central Board Verified',
    accentColor: '#10B981',
    verificationId: 'CBSE-SSE-2008-5129',
    rollCode: '08124',
    rollNo: '5129840',
    serialNo: 'CBSE-SEC-2008-049182',
    issueYear: '2008',
    title_hi: 'मैट्रिकुलेशन (10वीं कक्षा)',
    institution_hi: 'राधा गोविंद पब्लिक स्कूल रामगढ़ कैंट',
    location_hi: 'रामगढ़ कैंट, झारखंड',
    boardBadge_hi: 'CBSE बोर्ड',
    domainBadge_hi: 'माध्यमिक विद्यालय (10वीं)',
    status_hi: 'केंद्रीय बोर्ड सत्यापित',
    highlights: [
      'Central Board of Secondary Education (CBSE) standard academic curriculum',
      'Strong foundational grounding in Mathematics, General Science, Social Studies & English',
      'Active participation in academic disciplines and collaborative co-curricular activities'
    ],
    highlights_hi: [
      'केंद्रीय माध्यमिक शिक्षा बोर्ड (CBSE) मानक शैक्षणिक पाठ्यक्रम',
      'गणित, सामान्य विज्ञान, सामाजिक अध्ययन और अंग्रेजी में मजबूत बुनियादी समझ',
      'शैक्षणिक विषयों और सह-पाठ्यचर्या गतिविधियों में सक्रिय भागीदारी'
    ]
  }
];

// Official Bio-Data Demographics
const BIO_DATA_FIELDS = [
  {
    label: "Father's Name",
    label_hi: 'पिता का नाम',
    value: 'Late Niranjan Prasad',
    value_hi: 'स्व. निरंजन प्रसाद',
    icon: User,
    badge: 'Legal Record',
    badge_hi: 'कानूनी रिकॉर्ड'
  },
  {
    label: 'Year of Birth',
    label_hi: 'जन्म वर्ष',
    value: '1991',
    value_hi: '1991',
    icon: Calendar,
    badge: 'Demographic',
    badge_hi: 'जनसांख्यिकी'
  },
  {
    label: 'Marital Status & Nationality',
    label_hi: 'वैवाहिक स्थिति एवं राष्ट्रीयता',
    value: 'Indian • Single',
    value_hi: 'भारतीय • अविवाहित',
    icon: Award,
    badge: 'Demographic',
    badge_hi: 'जनसांख्यिकी'
  },
  {
    label: 'Languages Known',
    label_hi: 'ज्ञात भाषाएं',
    value: 'Hindi, Soft English',
    value_hi: 'हिंदी, सरल अंग्रेजी',
    icon: Languages,
    badge: 'Bilingual',
    badge_hi: 'द्विभाषी'
  },
  {
    label: 'Professional Role',
    label_hi: 'व्यावसायिक भूमिका',
    value: 'Senior Accountant & Tax Consultant',
    value_hi: 'सीनियर अकाउंटेंट एवं टैक्स कंसल्टेंट',
    icon: BadgeCheck,
    badge: 'Practice Lead',
    badge_hi: 'प्रैक्टिस लीड'
  },
  {
    label: 'Operational Coverage',
    label_hi: 'परिचालन क्षेत्र',
    value: 'Jharkhand & Bihar (Palamau, Garhwa, Chatra, Rohtas)',
    value_hi: 'झारखंड एवं बिहार (पलामू, गढ़वा, चतरा, रोहतास)',
    icon: Building2,
    badge: 'Multi-District',
    badge_hi: 'बहु-जिला'
  }
];

// Role-Specific Section Heading Descriptions
const ROLE_ABOUT_DESCRIPTIONS = {
  overview:
    'A multidisciplinary professional bridging statutory financial compliance, high-volume government MIS systems, and modern autonomous AI vibe coding into unified operational excellence.',
  accountant:
    'A seasoned accounting and tax specialist with deep expertise in Tally Prime ERP, GST & ITR compliance, audit-ready balance sheet finalization, and corporate fiscal governance.',
  mis:
    'A data operations and MIS executive experienced in large-scale government portals (DAY-NULM Skill India), multi-district biometric systems, and executive dashboard analytics.',
  vibe_coding:
    'An AI-native software engineer and rapid full-stack prototyper leveraging autonomous agent workflows, Cursor, LLM APIs, and prompt-driven architecture to build modern digital products.',
  other:
    'An executive corporate controller and BI strategist synthesizing rigorous statutory financial controls with automated ERP pipelines and dynamic Power BI telemetry.'
};


const ROLE_ABOUT_DESCRIPTIONS_HI = {
  overview:
    'एक बहु-विषयक पेशेवर जो वैधानिक वित्तीय अनुपालन, उच्च-मात्रा वाले सरकारी MIS सिस्टम और आधुनिक स्वायत्त AI Vibe Coding को एकीकृत परिचालन उत्कृष्टता में जोड़ता है।',
  accountant:
    'Tally Prime ERP, GST एवं ITR अनुपालन, ऑडिट-तैयार बैलेंस शीट फाइनलाइजेशन और कॉर्पोरेट वित्तीय प्रशासन में गहन विशेषज्ञता रखने वाले एक अनुभवी लेखा एवं कर विशेषज्ञ।',
  mis:
    'बड़े पैमाने पर सरकारी पोर्टलों (DAY-NULM Skill India), बहु-जिला बायोमेट्रिक सिस्टम और कार्यकारी डैशबोर्ड एनालिटिक्स में अनुभवी डेटा ऑपरेशंस और MIS विशेषज्ञ।',
  vibe_coding:
    'एक AI-native सॉफ्टवेयर इंजीनियर और त्वरित फुल-स्टैक प्रोटोटाइपर जो स्वायत्त एजेंट वर्कफ़्लो, Cursor, LLM APIs और प्रॉम्प्ट-ड्रिवन आर्किटेक्चर से आधुनिक डिजिटल उत्पाद बनाते हैं।',
  other:
    'एक कार्यकारी कॉर्पोरेट कंट्रोलर और BI रणनीतिकार जो स्वचालित ERP पाइपलाइनों और गतिशील Power BI टेलीमेट्री के साथ कठोर वैधानिक वित्तीय नियंत्रणों को एकीकृत करते हैं।'
};

function getA11yText(node) {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getA11yText).join('');
  if (node.props && node.props.children) return getA11yText(node.props.children);
  return '';
}

function AboutSection({ soundEnabled = true }) {
  const { activeRole, isOverview, isMIS, isOther, isVibeCoding } = useRoleTab();
  const isVibe = Boolean(isVibeCoding || activeRole === 'vibe_coding');
  const [activeTab, setActiveTab] = useState('story');
  const [addressCopied, setAddressCopied] = useState(false);
  const tabButtonRefs = useRef({});
  const copyTimeoutRef = useRef(null);

  let announce = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const announcer = useAnnounce();
    announce = announcer?.announce;
  } catch {
    // Graceful fallback
  }

  let languageContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    languageContext = useLanguage();
  } catch {
    // Graceful fallback
  }
  const t = languageContext?.t ?? ((key, fallback) => fallback || key);
  const isHindi = languageContext?.isHindi ?? false;

  const fullAddress = 'Daltonganj (Medininagar), Dist: Palamau, Pin: 822101, Jharkhand, India';
  const accentColor = isOverview ? '#6366F1' : isOther ? '#8B5CF6' : isVibe ? '#10B981' : (isMIS ? '#3B82F6' : '#FF4D6D');
  const competencies = isOverview ? OVERVIEW_COMPETENCIES : isOther ? OTHER_COMPETENCIES : isVibe ? VIBE_CODING_COMPETENCIES : (isMIS ? MIS_COMPETENCIES : ACCOUNTANT_COMPETENCIES);
  const story = isOverview ? OVERVIEW_STORY : isOther ? OTHER_STORY : isVibe ? VIBE_CODING_STORY : (isMIS ? MIS_STORY : ACCOUNTANT_STORY);
  const aboutDescription = isHindi ? (ROLE_ABOUT_DESCRIPTIONS_HI[activeRole] || ROLE_ABOUT_DESCRIPTIONS_HI.overview) : (ROLE_ABOUT_DESCRIPTIONS[activeRole] || ROLE_ABOUT_DESCRIPTIONS.overview);

  const bioDataFields = BIO_DATA_FIELDS.map((f) => {
    if (f.label === 'Professional Role') {
      const enVal = isOverview ? 'Financial & Operations Executive' : isOther ? 'Business Intelligence & Corporate Controller' : isVibe ? 'Vibe Coder & AI Software Engineer' : (isMIS ? 'MIS Executive & Analytics Specialist' : 'Senior Accountant & Tax Consultant');
      const hiVal = isOverview ? 'वित्तीय एवं परिचालन कार्यकारी' : isOther ? 'बिजनेस इंटेलिजेंस एवं कॉर्पोरेट कंट्रोलर' : isVibe ? 'वाइब कोडर एवं AI सॉफ्टवेयर इंजीनियर' : (isMIS ? 'MIS एग्जीक्यूटिव एवं एनालिटिक्स विशेषज्ञ' : 'सीनियर अकाउंटेंट एवं टैक्स कंसल्टेंट');
      return { ...f, value: enVal, value_hi: hiVal };
    }
    return f;
  });


  // Clean up pending copy feedback timer on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  // Listen for external tab switch events (e.g. from CommandPalette)
  useEffect(() => {
    const handleSwitchTab = (e) => {
      const targetTab = e.detail?.tab;
      if (targetTab && TABS.some((t) => t.id === targetTab)) {
        setActiveTab(targetTab);
      }
    };
    window.addEventListener('switch-about-tab', handleSwitchTab);
    return () => window.removeEventListener('switch-about-tab', handleSwitchTab);
  }, []);

  const handleTabChange = (tabId, moveFocus = false) => {
    if (moveFocus) {
      requestAnimationFrame(() => {
        const btn = tabButtonRefs.current[tabId];
        if (btn) {
          btn.focus();
          btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
      });
    }
    if (tabId === activeTab) return;
    setActiveTab(tabId);
    if (announce) {
      const tabObj = TABS.find((t) => t.id === tabId);
      if (tabObj) announce(`Switched to About tab: ${tabObj.label}`);
    }
    if (soundEnabled) {
      soundFX.playFocusBeep();
    }
  };

  const handleTabKeyDown = (e, idx) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (idx + 1) % TABS.length;
      handleTabChange(TABS[nextIndex].id, true);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (idx - 1 + TABS.length) % TABS.length;
      handleTabChange(TABS[prevIndex].id, true);
    } else if (e.key === 'Home') {
      e.preventDefault();
      handleTabChange(TABS[0].id, true);
    } else if (e.key === 'End') {
      e.preventDefault();
      handleTabChange(TABS[TABS.length - 1].id, true);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const panel = document.getElementById(`about-panel-${TABS[idx].id}`);
      if (panel) {
        panel.focus();
      }
    }
  };

  const handleKeyDown = (e) => {
    const currentIndex = TABS.findIndex((t) => t.id === activeTab);
    handleTabKeyDown(e, currentIndex >= 0 ? currentIndex : 0);
  };

  const handlePanelKeyDown = (e) => {
    if (e.key === 'ArrowUp' && e.target === e.currentTarget) {
      e.preventDefault();
      const btn = tabButtonRefs.current[activeTab];
      if (btn) {
        btn.focus();
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    }
  };

  const fallbackCopyText = (text) => {
    if (typeof document === 'undefined' || !document.body) return;
    let textarea = null;
    try {
      textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      textarea.style.opacity = '0';
      textarea.setAttribute('readonly', '');
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      if (textarea.setSelectionRange) {
        textarea.setSelectionRange(0, text.length);
      }
      document.execCommand('copy');
    } catch {
      // Ignored if blocked
    } finally {
      if (textarea && textarea.parentNode) {
        textarea.parentNode.removeChild(textarea);
      }
    }
  };

  const copyAddressToClipboard = () => {
    const notifySuccess = () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      setAddressCopied(true);
      if (soundEnabled) soundFX.playPop();
      copyTimeoutRef.current = setTimeout(() => {
        setAddressCopied(false);
        copyTimeoutRef.current = null;
      }, 2200);
    };

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(fullAddress).then(notifySuccess).catch(() => {
        fallbackCopyText(fullAddress);
        notifySuccess();
      });
    } else {
      fallbackCopyText(fullAddress);
      notifySuccess();
    }
  };

  return (
    <section id="about" aria-labelledby="about-heading" className="relative w-full py-24 px-4 sm:px-6 lg:px-8 scroll-mt-28">
      <div className="max-w-7xl mx-auto">
        {/* Top Header Row with Section Badge and Subtitle Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div
            tabIndex={0}
            data-tts="Section 1: About"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#161122] border border-[#E7E2D8] dark:border-[#2D2340] text-[#18181B] dark:text-[#F5F2F8] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs w-fit transition-colors whitespace-nowrap max-w-full overflow-x-auto focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-full cursor-pointer select-none"
          >
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accentColor || '#FF4D6D' }} />
            <span className="truncate sm:overflow-visible">{isHindi ? '01 ✦ परिचय • ' : '01 ✦ About • '}{isHindi ? (isOverview ? 'कार्यकारी विवरण' : isOther ? 'बिजनेस इंटेलिजेंस एवं कंट्रोलर' : isVibe ? 'वाइब कोडिंग एवं AI सॉफ्टवेयर' : (isMIS ? 'डेटा एवं MIS प्रोफ़ाइल' : 'अकाउंटिंग एवं टैक्स प्रोफ़ाइल')) : (isOverview ? 'Executive Overview' : isOther ? 'Business Intelligence & Controller' : isVibe ? 'Vibe Coding & AI Software' : (isMIS ? 'Data & MIS Profile' : 'Accounting & Tax Profile'))}</span>
          </div>

          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 font-mono text-xs shrink-0 whitespace-nowrap">
            <BadgeCheck className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
            <span>{isHindi ? 'सत्यापित पेशेवर प्रोफ़ाइल' : 'Verified Professional Dossier'}</span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="mb-6">
          <h2
            id="about-heading"
            tabIndex={0}
            data-tts="Heading: Who I am."
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#18181B] dark:text-white tracking-tight font-['Outfit',sans-serif] leading-[1.08] mb-3 transition-colors duration-300 whitespace-normal sm:whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-xl px-1 -mx-1"
          >
            {isHindi ? (<>मैं कौन <span className="text-[#FF4D6D]" style={{ color: accentColor }}>हूँ</span>.</>) : (<>Who I <span className="text-[#FF4D6D]" style={{ color: accentColor }}>am</span>.</>)}
          </h2>
          <div className="w-12 h-1 rounded-full mb-4 transition-all duration-300" style={{ backgroundColor: accentColor || '#FF4D6D' }} />
          <p
            key={activeRole}
            tabIndex={0}
            data-tts={aboutDescription}
            className="animate-tab-fade text-stone-600 dark:text-stone-400 text-sm md:text-base max-w-2xl font-normal leading-relaxed focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-xl p-1 -m-1"
          >
            {aboutDescription}
          </p>
        </div>

        {/* AI-Synthesized Role Banner */}
        {Boolean(isOther || activeRole === 'other') && (
          <div className="mb-6 p-4 rounded-2xl bg-purple-50/90 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 shadow-xs flex items-center gap-3.5 text-purple-900 dark:text-purple-200">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0 text-lg">
              🤖
            </div>
            <div className="text-xs sm:text-sm font-medium leading-relaxed">
              {isHindi ? (
                <>
                  <span className="font-bold text-purple-700 dark:text-purple-300">🤖 AI-संश्लेषित भूमिका (सत्यापित ट्रैक्स से व्युत्पन्न):</span>{' '}
                  यह कार्यकारी विशेषज्ञता सत्यापित Accountant (वैधानिक वित्त) और MIS (डेटा एनालिटिक्स व संचालन) क्षमताओं के समन्वय से AI द्वारा तैयार की गई है।
                </>
              ) : (
                <>
                  <span className="font-bold text-purple-700 dark:text-purple-300">🤖 AI-Synthesized Role (Derived from Verified Tracks):</span>{' '}
                  This executive specialization was synthesized by AI through the intersection of verified Accountant (Statutory Finance) and MIS (Data Analytics &amp; Operations) competencies.
                </>
              )}
            </div>
          </div>
        )}

        {/* 3-Tab Interactive Switcher Ribbon */}
        <div 
          role="tablist" 
          aria-label="About section tabs"
          aria-orientation="horizontal"
          className="flex p-1.5 bg-[#FAF8F5] dark:bg-[#18181B] rounded-2xl border border-[#ECE7DF] dark:border-stone-800 gap-1.5 mb-8 overflow-x-auto no-scrollbar transition-colors"
        >
          {TABS.map((tab, idx) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                ref={(el) => { tabButtonRefs.current[tab.id] = el; }}
                role="tab"
                id={`about-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`about-panel-${tab.id}`}
                tabIndex={0}
                type="button"
                data-tts={`Tab ${idx + 1} of ${TABS.length}: ${tab.label} (${tab.badge}), ${isActive ? 'Selected' : 'Unselected'}. Press Enter to view or Tab to move forward`}
                onClick={() => handleTabChange(tab.id, false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveTab(tab.id);
                  }
                  handleTabKeyDown(e, idx);
                }}
                onMouseEnter={() => {
                  if (soundEnabled) soundFX.playChipHover();
                }}
                className={`flex-1 min-w-[150px] sm:min-w-0 min-h-[44px] flex items-center justify-center gap-2.5 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all duration-200 cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-[#27272A] text-[#18181B] dark:text-[#F4F4F5] shadow-sm border border-[#E7E2D8] dark:border-stone-700'
                    : 'text-stone-600 dark:text-stone-400 hover:text-[#18181B] dark:hover:text-stone-200 hover:bg-white/60 dark:hover:bg-stone-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors shrink-0 ${isActive ? (isOverview ? 'text-[#6366F1]' : (isOther ? 'text-[#8B5CF6]' : (isMIS ? 'text-[#3B82F6]' : 'text-[#FF4D6D]'))) : 'text-stone-400 dark:text-stone-500'}`} />
                <span className="truncate whitespace-nowrap">
                  {tab.id === 'story' ? t('about.tabStory', tab.label) : tab.id === 'qualifications' ? t('about.tabQualifications', tab.label) : t('about.tabBiodata', tab.label)}
                </span>
                {isActive && (
                  <span className={`hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 ${
                    isOverview
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-[#6366F1] dark:text-indigo-300'
                      : isOther
                        ? 'bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-[#8B5CF6] dark:text-purple-300'
                        : isMIS
                          ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-[#3B82F6] dark:text-blue-300'
                          : 'bg-[#FFF0F3] dark:bg-pink-950/40 border border-[#FFD1DC] dark:border-pink-900/60 text-[#FF4D6D] dark:text-pink-300'
                  }`}>
                    {tab.id === 'story' ? t('about.subStory', tab.badge) : tab.id === 'qualifications' ? t('about.subQualifications', tab.badge) : t('about.subBiodata', tab.badge)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Content Card Container enclosing tabpanels */}
        <div className="bg-white dark:bg-[#121216] rounded-3xl p-6 sm:p-10 md:p-14 border border-[#E7E2D8] dark:border-stone-800 shadow-xl shadow-stone-900/5 dark:shadow-black/40 relative overflow-hidden transition-colors duration-300">
        {/* Soft subtle background glow */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-colors duration-500 dark:opacity-40"
          style={{
            background: isVibe
              ? 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)'
              : isMIS
              ? 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(255, 77, 109, 0.08) 0%, transparent 70%)'
          }}
        />

        {/* Tab Panels Container with baseline min-height to eliminate layout shifts */}
        <div className="min-h-[560px] md:min-h-[600px] relative">
          {/* Tab 1: Executive Story & Vision */}
          {activeTab === 'story' && (
            <div 
              role="tabpanel" 
              id="about-panel-story" 
              aria-labelledby="about-tab-story"
              tabIndex={0}
              key={`about-story-${activeRole}`}
              onKeyDown={handlePanelKeyDown}
              className={`animate-tab-fade space-y-8 focus:outline-none ${
                isOverview
                  ? 'focus-visible:ring-2 focus-visible:ring-[#6366F1]'
                  : isOther
                    ? 'focus-visible:ring-2 focus-visible:ring-[#8B5CF6]'
                    : isMIS
                      ? 'focus-visible:ring-2 focus-visible:ring-[#3B82F6]'
                      : 'focus-visible:ring-2 focus-visible:ring-[#FF4D6D]'
              } focus-visible:ring-offset-2 rounded-2xl`}
            >
              {/* Executive 3-Paragraph Narrative */}
              <div className="space-y-4">
                <p
                  tabIndex={0}
                  data-tts={getA11yText(story.p1)}
                  className="text-base sm:text-lg md:text-xl text-[#18181B] dark:text-[#F4F4F5] font-medium leading-relaxed font-['Outfit',sans-serif] transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg p-1 -m-1"
                >
                  {(isHindi && story.p1_hi) ? story.p1_hi : story.p1}
                </p>

                <p
                  tabIndex={0}
                  data-tts={getA11yText(story.p2)}
                  className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-normal transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg p-1 -m-1"
                >
                  {(isHindi && story.p2_hi) ? story.p2_hi : story.p2}
                </p>

                <p
                  tabIndex={0}
                  data-tts={getA11yText(story.p3)}
                  className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-normal transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg p-1 -m-1"
                >
                  {(isHindi && story.p3_hi) ? story.p3_hi : story.p3}
                </p>
              </div>

              {/* Prominent Career Vision & Strategic Objective (Aligned) */}
              <div
                className={`rounded-2xl p-6 sm:p-7 bg-gradient-to-br ${
                isOverview
                  ? 'from-[#EEF2FF] via-white to-[#FAF8F5] dark:from-indigo-950/20 dark:via-[#161122] dark:to-[#161122] border-[#6366F1]/25 dark:border-[#6366F1]/30'
                  : isOther
                    ? 'from-[#F5F3FF] via-white to-[#FAF8F5] dark:from-purple-950/20 dark:via-[#161122] dark:to-[#161122] border-[#8B5CF6]/25 dark:border-[#8B5CF6]/30'
                    : isMIS
                      ? 'from-[#EFF6FF] via-white to-[#FAF8F5] dark:from-blue-950/20 dark:via-[#161122] dark:to-[#161122] border-[#3B82F6]/30 dark:border-[#3B82F6]/30'
                      : 'from-[#FFF5F7] via-white to-[#FAF8F5] dark:from-pink-950/20 dark:via-[#161122] dark:to-[#161122] border-[#FF4D6D]/20 dark:border-[#FF4D6D]/30'
              } border-2 shadow-xs relative overflow-hidden transition-all duration-300`}>
                <div 
                  tabIndex={0}
                  data-tts={`Sub-header: Career Vision & Strategic Objective, ${(isHindi && story.alignmentBadge_hi) ? story.alignmentBadge_hi : (story.alignmentBadge || (isHindi ? 'कार्यकारी संरेखण' : 'Executive Alignment'))}`}
                  className="flex items-center justify-between mb-3 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg p-1 -m-1"
                >
                  <div
                    className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider"
                    style={{ color: accentColor }}
                  >
                    <Target className="w-4 h-4" style={{ color: accentColor }} />
                    <span>{(isHindi && story.visionTitle_hi) ? story.visionTitle_hi : story.visionTitle}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white dark:bg-[#201830] border font-bold ${
                      isOverview
                        ? 'border-indigo-200 dark:border-indigo-800/60 text-[#6366F1] dark:text-indigo-300'
                        : isOther
                          ? 'border-purple-200 dark:border-purple-800/60 text-[#8B5CF6] dark:text-purple-300'
                          : isMIS
                            ? 'border-blue-200 dark:border-blue-800/60 text-[#3B82F6] dark:text-blue-300'
                            : 'border-[#FFD1DC] dark:border-pink-900/60 text-[#FF4D6D] dark:text-pink-300'
                    }`}
                  >
                    {story.alignmentBadge || 'Executive Alignment'}
                  </span>
                </div>
                <div
                  tabIndex={0}
                  data-card="true"
                  data-tts={`Vision Quote: ${getA11yText(story.visionQuote)}`}
                  className="focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg p-1 -m-1"
                >
                  <p className="text-[#18181B] dark:text-stone-100 text-sm sm:text-base font-semibold leading-relaxed font-['Outfit',sans-serif] transition-colors">
                    {(isHindi && story.visionQuote_hi) ? story.visionQuote_hi : story.visionQuote}
                  </p>
                </div>
              </div>

              {/* 4 High-Level Core Competency Pillars */}
              <div className="pt-2">
                <div 
                  tabIndex={0}
                  data-tts="Sub-header: Executive Competency Pillars, 4 Strategic Domains"
                  className="flex items-center justify-between mb-4 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg p-1 -m-1"
                >
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#18181B] dark:text-stone-200 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" style={{ color: accentColor }} />
                    <span>{isHindi ? (isOverview ? 'कार्यकारी क्षमता स्तंभ' : isOther ? 'रणनीतिक क्षमता स्तंभ' : (isMIS ? 'डेटा एवं MIS क्षमता स्तंभ' : 'मुख्य क्षमता स्तंभ')) : (isOverview ? 'Executive Competency Pillars' : isOther ? 'Strategic Competency Pillars' : (isMIS ? 'Data & MIS Competency Pillars' : 'Core Competency Pillars'))}</span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 font-medium">
                    {isHindi ? '4 रणनीतिक क्षेत्र' : '4 Strategic Domains'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {competencies.map((comp) => {
                    const Icon = comp.icon;
                    return (
                      <div 
                        key={(isHindi && comp.title_hi) ? comp.title_hi : comp.title}
                        tabIndex={0}
                        data-card="true"
                        data-tts={`Competency: ${comp.title}. Description: ${comp.desc || comp.description}. Domain: ${comp.domain || comp.category}`}
                        className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F5] dark:bg-[#161122] border border-[#ECE7DF] dark:border-[#2D2340] hover:border-stone-400/50 dark:hover:border-[#3D3055] transition-all duration-200 flex flex-col justify-between group focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3.5">
                            <div className={`w-9 h-9 rounded-xl ${comp.bgLight} dark:bg-stone-800/80 border ${comp.borderLight} dark:border-stone-700 flex items-center justify-center shrink-0`}>
                              <Icon className="w-4 h-4" style={{ color: comp.accent }} />
                            </div>
                            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white dark:bg-[#201830] border border-[#ECE7DF] dark:border-[#2D2340] text-stone-600 dark:text-[#A99EBA]">
                              {(isHindi && comp.tag_hi) ? comp.tag_hi : comp.tag}
                            </span>
                          </div>

                          <h3 className="text-sm sm:text-base font-extrabold text-[#18181B] dark:text-[#F5F2F8] font-['Outfit',sans-serif] group-hover:text-stone-900 dark:group-hover:text-white transition-colors mb-2">
                            {comp.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                            {(isHindi && comp.description_hi) ? comp.description_hi : comp.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#ECE7DF]/70 dark:border-[#2D2340] flex items-center justify-between text-[11px] font-mono text-stone-500 dark:text-stone-400">
                          <span>{isHindi ? 'स्तंभ डोमेन' : 'Pillar Domain'}</span>
                          <span className="font-semibold text-stone-700 dark:text-stone-300">{(isHindi && comp.category_hi) ? comp.category_hi : comp.category}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Academic & Technical Qualifications */}
          {activeTab === 'qualifications' && (
            <div 
              role="tabpanel" 
              id="about-panel-qualifications" 
              aria-labelledby="about-tab-qualifications"
              tabIndex={0}
              onKeyDown={handlePanelKeyDown}
              className={`animate-tab-fade space-y-6 focus:outline-none focus-visible:ring-2 ${
                isOverview ? 'focus-visible:ring-[#6366F1]' : (isOther ? 'focus-visible:ring-[#8B5CF6]' : (isMIS ? 'focus-visible:ring-[#3B82F6]' : 'focus-visible:ring-[#FF4D6D]'))
              } focus-visible:ring-offset-2 rounded-2xl`}
            >
            {/* Header intro */}
            <div 
              tabIndex={0}
              data-tts="Sub-header: Academic & Technical Credentials"
              className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#ECE7DF] dark:border-stone-800 gap-2 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-xl p-1 -m-1"
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#18181B] dark:text-[#F4F4F5] font-['Outfit',sans-serif] transition-colors">
                  {isHindi ? 'शैक्षणिक एवं तकनीकी योग्यताएं' : 'Academic & Technical Qualifications'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-mono mt-1">
                  {isHindi ? '3-स्तरीय शैक्षणिक विवरण • बोर्ड प्रमाणित एवं संस्थान सत्यापित' : '3-Tier Educational Breakdown • Board Certified & Institution Verified'}
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#FFF0F3] dark:bg-pink-950/40 border border-[#FFD1DC] dark:border-pink-900/60 text-[#FF4D6D] dark:text-pink-300 self-start sm:self-auto">
                {isHindi ? '3 मील के पत्थर' : '3 Milestones'}
              </span>
            </div>

            {/* Visual Timeline Cards */}
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E7E2D8] dark:before:bg-[#2D2340]">
              {CREDENTIALS.map((cred) => (
                <div 
                  key={cred.level}
                  id={cred.targetId || ('edu-' + cred.level)}
                  tabIndex={0}
                  data-card="true"
                  data-tts={`Credential: ${(isHindi && cred.title_hi) ? cred.title_hi : cred.title} at ${cred.institution}, ${cred.location}. Status: ${cred.status}. Highlights: ${cred.highlights.join('; ')}`}
                  className="scroll-mt-28 relative p-6 sm:p-7 rounded-2xl bg-[#FAF8F5] dark:bg-[#161122] border border-[#ECE7DF] dark:border-[#2D2340] hover:border-[#FF4D6D]/30 dark:hover:border-[#D946EF]/50 transition-all duration-200 group focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
                >
                  {/* Timeline Node Dot */}
                  <div 
                    className="absolute -left-[30px] sm:-left-[39px] top-6 w-4 h-4 rounded-full bg-white dark:bg-[#161122] border-3 transition-transform duration-200 group-hover:scale-125"
                    style={{ borderColor: cred.accentColor }}
                  />

                  {/* Top Bar with Badges and Milestones */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span 
                        className="text-[11px] font-mono font-extrabold px-2.5 py-0.5 rounded-md text-white"
                        style={{ backgroundColor: cred.accentColor }}
                      >
                        {isHindi ? 'स्तर ' : 'Tier '}{cred.level}
                      </span>
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white dark:bg-[#201830] border border-[#ECE7DF] dark:border-[#2D2340] text-stone-700 dark:text-[#A99EBA]">
                        {(isHindi && cred.boardBadge_hi) ? cred.boardBadge_hi : cred.boardBadge}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono font-bold text-stone-500 dark:text-[#A99EBA] bg-[#ECE7DF]/50 dark:bg-[#201830] px-2.5 py-0.5 rounded-full">
                      {(isHindi && cred.domainBadge_hi) ? cred.domainBadge_hi : cred.domainBadge}
                    </span>
                  </div>

                  {/* Title & Institution */}
                  <h4 className="text-base sm:text-lg md:text-xl font-extrabold text-[#18181B] dark:text-[#F5F2F8] font-['Outfit',sans-serif] group-hover:text-[#FF4D6D] dark:group-hover:text-[#FF4D6D] transition-colors">
                    {cred.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 dark:text-stone-400 font-medium mt-1.5 mb-4">
                    <Building2 className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                    <span>{(isHindi && cred.institution_hi) ? cred.institution_hi : cred.institution}</span>
                    <span>•</span>
                    <MapPin className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                    <span>{(isHindi && cred.location_hi) ? cred.location_hi : cred.location}</span>
                  </div>

                  {/* Syllabus / Credential Highlights */}
                  <div className="space-y-2 pt-3 border-t border-[#ECE7DF] dark:border-[#2D2340]">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-bold mb-1">
                      {isHindi ? 'प्रमुख मुख्य विशेषताएं एवं दायरा' : 'Key Highlights & Scope'}
                    </div>
                    {cred.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300 font-normal leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4D6D] shrink-0 mt-0.5" />
                        <span>{(isHindi && cred.highlights_hi && cred.highlights_hi[idx]) ? cred.highlights_hi[idx] : item}</span>
                      </div>
                    ))}
                  </div>

                  {/* 1-Click Official Certificate & Credential Inspector Action */}
                  <div className="pt-3 mt-3 border-t border-[#ECE7DF] dark:border-[#2D2340] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                      ID: <span className="font-bold text-[#18181B] dark:text-white">{cred.verificationId}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playSparkle();
                        if (typeof window !== 'undefined') {
                          window.dispatchEvent(
                            new CustomEvent('portfolio:open-credential', {
                              detail: { id: cred.id || cred.targetId }
                            })
                          );
                        }
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#201830] hover:bg-[#FF4D6D] hover:text-white dark:hover:bg-[#FF4D6D] text-[#18181B] dark:text-[#F5F2F8] border border-[#ECE7DF] dark:border-[#2D2340] hover:border-transparent text-xs font-bold transition-all shadow-2xs hover:scale-102 active:scale-98 cursor-pointer"
                    >
                      <span>{t('about.inspectCred', 'Inspect Credential & Certificate 🔍')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Academic Accreditation Footer Pill */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] dark:from-[#18181B] dark:via-[#1E1E24] dark:to-[#18181B] border border-[#ECE7DF] dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600 dark:text-stone-400 font-mono transition-colors">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#FF4D6D]" />
                <span>{isHindi ? 'सभी प्रमाण पत्र, अंक पत्र और डिप्लोमा राज्य और केंद्रीय बोर्डों द्वारा सत्यापित हैं।' : 'All certificates, mark sheets & diplomas are verified with state and central boards.'}</span>
              </div>
              <span className="font-bold text-[#18181B] dark:text-stone-200 bg-white dark:bg-[#27272A] px-3 py-1 rounded-lg border border-[#ECE7DF] dark:border-stone-700">
                {isHindi ? 'अनुरोध पर मूल प्रतियां उपलब्ध हैं' : 'Originals Available Upon Request'}
              </span>
            </div>
          </div>
        )}

          {/* Tab 3: {isHindi ? 'आधिकारिक बायो-डेटा प्रोफ़ाइल' : 'Official Bio-Data Dossier'} */}
          {activeTab === 'biodata' && (
            <div 
              role="tabpanel" 
              id="about-panel-biodata" 
              aria-labelledby="about-tab-biodata"
              tabIndex={0}
              onKeyDown={handlePanelKeyDown}
              className={`animate-tab-fade space-y-6 focus:outline-none focus-visible:ring-2 ${
                isOverview ? 'focus-visible:ring-[#6366F1]' : (isOther ? 'focus-visible:ring-[#8B5CF6]' : (isMIS ? 'focus-visible:ring-[#3B82F6]' : 'focus-visible:ring-[#FF4D6D]'))
              } focus-visible:ring-offset-2 rounded-2xl`}
            >
            {/* Header intro with verified seal */}
            <div 
              tabIndex={0}
              data-tts="Sub-header: Official Bio-Data and Personal Dossier"
              className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#ECE7DF] dark:border-stone-800 gap-3 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-xl p-1 -m-1"
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#18181B] dark:text-[#F4F4F5] font-['Outfit',sans-serif] transition-colors">
                  Official Bio-Data Dossier
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-mono mt-1">
                  {isHindi ? 'सत्यापित व्यक्तिगत जनसांख्यिकी और प्रशासनिक पहचान रिकॉर्ड' : 'Verified Personal Demographics & Administrative Identity Record'}
                </p>
              </div>

              <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold self-start sm:self-auto shadow-2xs ${
                isOverview
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-[#6366F1] dark:text-indigo-300'
                  : isOther
                    ? 'bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-[#8B5CF6] dark:text-purple-300'
                    : isMIS
                      ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-[#3B82F6] dark:text-blue-300'
                      : 'bg-[#FFF0F3] dark:bg-pink-950/40 border border-[#FFD1DC] dark:border-pink-900/60 text-[#FF4D6D] dark:text-pink-300'
              }`}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                <span>{isHindi ? 'सत्यापित उम्मीदवार रिकॉर्ड' : 'Verified Candidate Record'}</span>
              </div>
            </div>

            {/* Main Credential Card */}
            <div 
              tabIndex={0}
              data-card="true"
              data-tts={`Primary Details Dossier for Atul Verma: ${bioDataFields.map((f) => `${f.label}: ${f.value}`).join('. ')}. Permanent location: Daltonganj, Jharkhand.`}
              className="bg-[#FAF8F5] dark:bg-[#161122] rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] p-6 sm:p-8 space-y-6 shadow-2xs transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
            >
              {/* Profile Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E7E2D8] dark:border-[#2D2340]">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-2xl bg-white dark:bg-[#201830] border border-[#E7E2D8] dark:border-[#2D2340] flex items-center justify-center font-bold text-lg font-mono shadow-2xs transition-colors"
                    style={{ color: accentColor }}
                  >
                    AV
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-extrabold text-[#18181B] dark:text-[#F5F2F8] font-['Outfit',sans-serif] transition-colors">
                      Atul Verma
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-mono">
                      {isOverview ? 'Financial & Operations Executive' : isOther ? 'Business Intelligence & Corporate Controller' : (isMIS ? 'MIS Executive & Analytics Specialist' : 'Accountant & Tax Consultant')} • Daltonganj, Jharkhand
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-white dark:bg-[#201830] border border-[#E7E2D8] dark:border-[#2D2340] text-stone-700 dark:text-[#A99EBA] font-semibold">
                    YOB: 1991
                  </span>
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold">
                    {isHindi ? 'भारतीय नागरिक' : 'Indian Citizen'}
                  </span>
                </div>
              </div>

              {/* Demographic Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bioDataFields.map((field) => {
                  const Icon = field.icon;
                  return (
                    <div 
                      key={field.label}
                      tabIndex={0}
                      data-tts={`${field.label}: ${(isHindi && field.value_hi) ? field.value_hi : field.value}`}
                      className="p-4 rounded-xl bg-white dark:bg-[#100C1A] border border-[#E7E2D8] dark:border-[#2D2340] flex flex-col justify-between space-y-2 hover:border-[#FF4D6D]/30 dark:hover:border-[#D946EF]/50 transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
                    >
                      <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
                        <span className="text-xs font-mono flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-[#FF4D6D]" />
                          <span>{(isHindi && field.label_hi) ? field.label_hi : field.label}</span>
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#FAF8F5] dark:bg-[#201830] border border-[#ECE7DF] dark:border-[#2D2340] text-stone-500 dark:text-[#A99EBA]">
                          {(isHindi && field.badge_hi) ? field.badge_hi : field.badge}
                        </span>
                      </div>

                      <div className="font-bold text-[#18181B] dark:text-stone-100 text-xs sm:text-sm">
                        {field.value}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Full Address Card with One-Click Copy */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-stone-600 dark:text-stone-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-[#FF4D6D]" />
                    <span>{isHindi ? 'स्थायी / आवासीय पता' : 'Permanent / Residential Address'}</span>
                  </span>

                  <button
                    type="button"
                    onClick={copyAddressToClipboard}
                    onMouseEnter={() => {
                      if (soundEnabled) soundFX.playChipHover();
                    }}
                    aria-label={addressCopied ? "Address copied to clipboard" : "Copy permanent address to clipboard"}
                    aria-live="polite"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF4D6D] bg-white dark:bg-[#201830] hover:bg-[#FFF0F3] dark:hover:bg-pink-950/30 border border-[#FFD1DC] dark:border-pink-900/60 px-3 py-1.5 rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D]"
                  >
                    {addressCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400">{isHindi ? 'कॉपी हुआ!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isHindi ? 'पता कॉपी करें' : 'Copy Address'}</span>
                      </>
                    )}
                  </button>
                </div>

                <div
                  tabIndex={0}
                  data-card="true"
                  data-tts="Permanent Address and Headquarters: Medininagar, Palamu, Jharkhand"
                  className="bg-white dark:bg-[#100C1A] p-4 rounded-xl border border-[#E7E2D8] dark:border-[#2D2340] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
                >
                  <div className="font-medium text-[#18181B] dark:text-stone-200 text-xs sm:text-sm leading-relaxed">
                    {fullAddress}
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 font-mono text-[11px] text-stone-500 dark:text-stone-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{isHindi ? 'सत्यापित पोस्टल पिन: 822101' : 'Verified Postal PIN: 822101'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Authentication Note */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#161122] border border-[#ECE7DF] dark:border-[#2D2340] flex items-start gap-3 transition-colors">
              <Briefcase className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
                {isHindi ? 'यह बायो-डेटा प्रोफ़ाइल वाणिज्यिक अनुबंधों, वरिष्ठ लेखांकन भूमिकाओं, कर सलाहकार अनुबंधों और वितरण नेतृत्व के अवसरों के लिए एक प्रमाणित कार्यकारी प्रोफ़ाइल है।' : 'This Bio-Data Dossier constitutes an authenticated executive profile for commercial engagements, senior accounting roles, tax advisory retainers, and distribution leadership opportunities.'}
              </p>
            </div>
          </div>
        )}
        </div>
      </div>
      </div>
    </section>
  );
}

AboutSection.displayName = 'AboutSection';
export default memo(AboutSection);
