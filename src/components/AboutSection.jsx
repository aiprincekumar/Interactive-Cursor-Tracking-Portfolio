import React, { useState, useRef, useEffect } from 'react';
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
    category: 'Direct & Indirect Tax',
    icon: ShieldCheck,
    accent: '#FF4D6D',
    bgLight: 'bg-[#FFF0F3]',
    borderLight: 'border-[#FFD1DC]',
    tag: '100% Timely Filing',
    description: 'End-to-end management of monthly/quarterly GSTR-1 & GSTR-3B filings, automated GSTR-2B vs purchase register ITC reconciliations, and direct tax preparation for ITR-1, ITR-2, and ITR-4 with zero late-fee penalty track record.'
  },
  {
    title: 'Audit Readiness & Financial Reporting',
    category: 'Fiscal Governance',
    icon: TrendingUp,
    accent: '#10B981',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-100',
    tag: 'Zero-Discrepancy Audits',
    description: 'Trial Balance governance, monthly P&L formulation, and zero-discrepancy year-end Balance Sheet finalization. Rigorous ledger verification, day book governance, and audit trail preparation meeting statutory standards.'
  },
  {
    title: 'Tally Prime & ERP Architecture',
    category: 'Accounting Tech & Systems',
    icon: Cpu,
    accent: '#8B5CF6',
    bgLight: 'bg-purple-50',
    borderLight: 'border-purple-100',
    tag: 'Multi-Company Master',
    description: 'Advanced multi-company chart of accounts hierarchy, automated Bank Reconciliation Statements (BRS), FIFO & batch inventory valuation, and synchronized billing workflow administration across enterprise software.'
  },
  {
    title: 'Commercial Ledger Governance',
    category: 'Scale & Commercial Control',
    icon: Briefcase,
    accent: '#F59E0B',
    bgLight: 'bg-amber-50',
    borderLight: 'border-amber-100',
    tag: 'FMCG & Agency Control',
    description: 'Debtor and creditor aging analysis, cash book scrutiny, supplier payment reconciliation, and Path Solution ERP agency operations ensuring zero shrinkage and tight working capital control.'
  }
];

const MIS_COMPETENCIES = [
  {
    title: 'Executive MIS & BI Dashboards',
    category: 'Telemetry & Analytics',
    icon: TrendingUp,
    accent: '#3B82F6',
    bgLight: 'bg-blue-50',
    borderLight: 'border-blue-100',
    tag: 'Daily Telemetry',
    description: 'Designing high-impact management telemetry, cross-category revenue trends, KPI scorecard monitoring, and advanced Excel modeling (Pivot Tables, dynamic arrays, nested lookups) for senior leadership.'
  },
  {
    title: 'Multi-District Operations & Enrollment',
    category: 'Scale Field Execution',
    icon: Terminal,
    accent: '#10B981',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-100',
    tag: '50,000+ Enrolled',
    description: 'Supervision of RSBY Smart Card field biometric camps across 4 districts (Palamu, Garhwa, Latehar, Chatra), hardware reliability governance, and UIDAI/Aadhaar data verification with zero data loss.'
  },
  {
    title: 'Enterprise Database & Portal Admin',
    category: 'Government MIS Systems',
    icon: ShieldCheck,
    accent: '#8B5CF6',
    bgLight: 'bg-purple-50',
    borderLight: 'border-purple-100',
    tag: '100% Portal Sync',
    description: 'Candidate lifecycle tracking on national DAY-NULM Skill India portal, biometric attendance synchronization, assessment certification records, and compliance auditing with municipal bodies.'
  },
  {
    title: 'IT Infrastructure & Hardware Architecture',
    category: 'Systems & Diagnostics',
    icon: Cpu,
    accent: '#F59E0B',
    bgLight: 'bg-amber-50',
    borderLight: 'border-amber-100',
    tag: 'Enterprise Deployments',
    description: 'Windows 10/11 Pro workstation staging, local group policy hardening, LAN router/switch network cabling, thermal paste diagnostics, and remote branch support via AnyDesk/TeamViewer.'
  }
];

const VIBE_CODING_COMPETENCIES = [
  {
    title: 'AI-Native Prototyping & Flow',
    category: 'Rapid Development',
    icon: Terminal,
    accent: '#10B981',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-100',
    tag: '10x Speed',
    description: 'Compressing product development cycles from months into hours using prompt-driven workflows, Cursor, Windsurf, and Claude Code to deliver fully functional full-stack web applications.'
  },
  {
    title: 'Autonomous Multi-Agent Systems',
    category: 'Agentic Engineering',
    icon: Cpu,
    accent: '#10B981',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-100',
    tag: 'Multi-Agent Loops',
    description: 'Architecting autonomous agent loops, tool harnesses, and continuous verification pipelines that research, write, test, and self-heal complex codebases without manual intervention.'
  },
  {
    title: 'Full-Stack SaaS Architecture',
    category: 'Modern Web Engineering',
    icon: ShieldCheck,
    accent: '#10B981',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-100',
    tag: 'Production Ready',
    description: 'Building reactive, scalable full-stack applications with Next.js 14 App Router, React 19, Tailwind CSS, Supabase backend, PostgreSQL relational modeling, and Edge API deployment.'
  },
  {
    title: 'LLM Orchestration & Prompting',
    category: 'Generative AI Systems',
    icon: Sparkles,
    accent: '#10B981',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-100',
    tag: 'Claude & GPT APIs',
    description: 'Deep context window engineering, structured JSON outputs, function calling, streaming responses, and prompt chaining across frontier models (Claude 3.5 Sonnet, GPT-4o, Gemini 1.5 Pro).'
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
  p1: (
    <>
      I am a <strong className="text-[#10B981] font-bold">Vibe Coder &amp; AI Software Engineer</strong> specializing in prompt-driven software architecture, autonomous agent workflows, and rapid full-stack SaaS engineering.
    </>
  ),
  p2: 'I leverage cutting-edge AI coding environments (Cursor, Windsurf, Claude Code, and v0.dev) to compress development timelines from months into hours—translating product ideas into production-ready software with unmatched velocity.',
  p3: 'Rooted in hands-on modern full-stack development with Next.js, React, Tailwind CSS, and Supabase, I build resilient, reactive web architectures while orchestrating intelligent multi-agent loops and automated QA verification gates.',
  visionTitle: 'Engineering Vision & Strategic Objective',
  visionQuote: (
    <>
      "AI Software Engineer &amp; Vibe Coder seeking high-impact assignments in <strong className="text-[#10B981] font-bold">Rapid Full-Stack Prototyping, Autonomous Coding &amp; SaaS Engineering</strong> within ambitious product teams. Dedicated to architecting prompt-driven systems, accelerating feature delivery cycles by 10x, and pioneering autonomous software development loops that transform ambitious concepts into scalable products."
    </>
  )
};

const OVERVIEW_STORY = {
  alignmentBadge: 'Executive Alignment',
  p1: (
    <>
      I am a <strong className="text-[#6366F1] font-bold">Financial, Operations &amp; AI Software Executive</strong> with unified expertise synthesizing statutory accounting, corporate taxation, enterprise MIS data intelligence, and rapid AI vibe coding.
    </>
  ),
  p2: 'I bridge fiscal discipline with enterprise data intelligence and autonomous software prototyping—unifying double-entry ledger rigor, zero-penalty GST/ITR compliance, automated Power BI/Excel dashboards, and 10x AI development velocity.',
  p3: 'Having directed statutory tax practices, managed nationwide government portal databases (DAY-NULM Skill India), orchestrated multi-district biometric field rollouts, and engineered full-stack AI apps, I deliver end-to-end executive leadership that combines audit readiness with operational velocity.',
  visionTitle: 'Executive Vision & Strategic Objective',
  visionQuote: (
    <>
      "Multi-Domain Executive seeking senior leadership roles bridging <strong className="text-[#6366F1] font-bold">Statutory Accounting, Taxation, Advanced Data Intelligence &amp; Autonomous AI Engineering</strong> within dynamic organizations of repute. Dedicated to architecting audit-ready financial frameworks, automated operational telemetry, and resilient software pipelines that drive sustainable commercial growth."
    </>
  )
};

const ACCOUNTANT_STORY = {
  alignmentBadge: 'Leadership Alignment',
  p1: (
    <>
      I am an experienced <strong className="text-[#FF4D6D] font-bold">Senior Accountant &amp; Tax Consultant</strong> with over 7+ years of expertise in comprehensive financial accounting via Tally ERP/Prime, statutory compliance, and GST &amp; Income Tax advisory.
    </>
  ),
  p2: 'I specialize in precision accounting, audit readiness, and statutory tax reconciliation—ensuring 100% compliance, zero-discrepancy balance sheets, and streamlined business operations for enterprises and agencies.',
  p3: 'With a career rooted in double-entry fiscal discipline, voucher entry governance, and commercial ledger reconciliations across FMCG, agency distribution, and client portfolios, I guarantee verifiable audit trails and robust compliance posture.',
  visionTitle: 'Career Vision & Strategic Objective',
  visionQuote: (
    <>
      "Senior Financial Accounting &amp; Tax Compliance professional seeking leadership assignments in <strong className="text-[#FF4D6D] font-bold">Financial Accounting &amp; Statutory Tax Governance</strong>, coupled with <strong className="text-[#FF4D6D] font-bold">Business Development &amp; Distribution Operations</strong> within a growth-oriented organization of repute. Dedicated to leveraging 7+ years of rigorous statutory compliance, double-entry fiscal precision, and multi-district operational acumen to build audit-ready financial frameworks and drive sustainable enterprise growth."
    </>
  )
};

const MIS_STORY = {
  alignmentBadge: 'Analytics Alignment',
  p1: (
    <>
      I am a seasoned <strong className="text-[#3B82F6] font-bold">MIS Executive &amp; Data Operations Specialist</strong> with proven expertise in enterprise telemetry, government portal administration (DAY-NULM Skill India), advanced spreadsheet modeling, and multi-district operational deployments.
    </>
  ),
  p2: 'I specialize in transforming raw operational and financial data into executive BI dashboards, automated reconciliation models, and reliable reporting pipelines that empower leadership to make decisive, data-backed commercial decisions.',
  p3: 'Having spearheaded multi-district biometric enrollment campaigns for 50,000+ citizens and administered Windows/LAN IT infrastructure across enterprise and field offices, I combine analytical rigor with hands-on systems reliability.',
  visionTitle: 'Career Vision & Strategic Objective',
  visionQuote: (
    <>
      "MIS &amp; Data Operations professional seeking leadership assignments in <strong className="text-[#3B82F6] font-bold">Management Information Systems (MIS), Business Analytics &amp; Operations Governance</strong> within a data-driven organization of repute. Dedicated to architecting robust reporting telemetry, streamlining cross-departmental data workflows, and optimizing enterprise IT infrastructure to scale operations with accuracy and speed."
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
    targetId: 'edu-adca',
    title: 'Advance Diploma in Computer Application (ADCA)',
    institution: 'Infocity Daltonganj',
    location: 'Medininagar (Daltonganj), Jharkhand',
    boardBadge: 'Advanced Computing',
    domainBadge: 'IT & Professional Diploma',
    status: 'Certified Honors',
    accentColor: '#FF4D6D',
    highlights: [
      'Advanced financial modeling, spreadsheet automation & data analytics with MS Excel',
      'Computerized double-entry accounting & voucher entry lifecycle in Tally ERP 9 / Prime',
      'Desktop Publishing (DTP) workflows: Adobe Photoshop, CorelDraw, and Adobe PageMaker',
      'Fundamental hardware diagnostics, OS maintenance & enterprise computer applications'
    ]
  },
  {
    level: '02',
    targetId: 'edu-intermediate',
    title: 'Intermediate of Arts (I.A.)',
    institution: 'Baba Nawbat Choudhry Surtapur Kundesar Ghazipur',
    location: 'Ghazipur, Uttar Pradesh',
    boardBadge: 'UP Board',
    domainBadge: 'Higher Secondary (10+2)',
    status: 'State Board Verified',
    accentColor: '#8B5CF6',
    highlights: [
      'Comprehensive curriculum under Uttar Pradesh State Board of High School and Intermediate Education',
      'Core studies in Humanities, Social Sciences, Logic & Civic Foundations',
      'Developed strong written communication, critical thinking, and structured analysis'
    ]
  },
  {
    level: '03',
    targetId: 'edu-matriculation',
    title: 'Matriculation (10th Standard)',
    institution: 'Radha Govind Public School Ramgarh Cant',
    location: 'Ramgarh Cant, Jharkhand',
    boardBadge: 'CBSE Board',
    domainBadge: 'Secondary School (10th)',
    status: 'Central Board Verified',
    accentColor: '#10B981',
    highlights: [
      'Central Board of Secondary Education (CBSE) standard academic curriculum',
      'Strong foundational grounding in Mathematics, General Science, Social Studies & English',
      'Active participation in academic disciplines and collaborative co-curricular activities'
    ]
  }
];

// Official Bio-Data Demographics
const BIO_DATA_FIELDS = [
  {
    label: "Father's Name",
    value: 'Late Niranjan Prasad',
    icon: User,
    badge: 'Legal Record'
  },
  {
    label: 'Year of Birth',
    value: '1991',
    icon: Calendar,
    badge: 'Demographic'
  },
  {
    label: 'Marital Status & Nationality',
    value: 'Indian • Single',
    icon: Award,
    badge: 'Demographic'
  },
  {
    label: 'Languages Known',
    value: 'Hindi, Soft English',
    icon: Languages,
    badge: 'Bilingual'
  },
  {
    label: 'Professional Role',
    value: 'Senior Accountant & Tax Consultant',
    icon: BadgeCheck,
    badge: 'Practice Lead'
  },
  {
    label: 'Operational Coverage',
    value: 'Jharkhand & Bihar (Palamau, Garhwa, Chatra, Rohtas)',
    icon: Building2,
    badge: 'Multi-District'
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

function getA11yText(node) {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getA11yText).join('');
  if (node.props && node.props.children) return getA11yText(node.props.children);
  return '';
}

export default function AboutSection({ soundEnabled = true }) {
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

  const fullAddress = 'Daltonganj (Medininagar), Dist: Palamau, Pin: 822101, Jharkhand, India';
  const accentColor = isOverview ? '#6366F1' : isOther ? '#8B5CF6' : isVibe ? '#10B981' : (isMIS ? '#3B82F6' : '#FF4D6D');
  const competencies = isOverview ? OVERVIEW_COMPETENCIES : isOther ? OTHER_COMPETENCIES : isVibe ? VIBE_CODING_COMPETENCIES : (isMIS ? MIS_COMPETENCIES : ACCOUNTANT_COMPETENCIES);
  const story = isOverview ? OVERVIEW_STORY : isOther ? OTHER_STORY : isVibe ? VIBE_CODING_STORY : (isMIS ? MIS_STORY : ACCOUNTANT_STORY);
  const aboutDescription = ROLE_ABOUT_DESCRIPTIONS[activeRole] || ROLE_ABOUT_DESCRIPTIONS.overview;

  const bioDataFields = BIO_DATA_FIELDS.map((f) => (
    f.label === 'Professional Role'
      ? { ...f, value: isOverview ? 'Financial & Operations Executive' : isOther ? 'Business Intelligence & Corporate Controller' : isVibe ? 'Vibe Coder & AI Software Engineer' : (isMIS ? 'MIS Executive & Analytics Specialist' : 'Senior Accountant & Tax Consultant') }
      : f
  ));


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
            <span className="truncate sm:overflow-visible">01 ✦ About &bull; {isOverview ? 'Executive Overview' : isOther ? 'Business Intelligence & Controller' : isVibe ? 'Vibe Coding & AI Software' : (isMIS ? 'Data & MIS Profile' : 'Accounting & Tax Profile')}</span>
          </div>

          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 font-mono text-xs shrink-0 whitespace-nowrap">
            <BadgeCheck className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
            <span>Verified Professional Dossier</span>
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
            Who I <span className="text-[#FF4D6D]" style={{ color: accentColor }}>am</span>.
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
              <span className="font-bold text-purple-700 dark:text-purple-300">🤖 AI-Synthesized Role (Derived from Verified Tracks):</span>{' '}
              This executive specialization was synthesized by AI through the intersection of verified Accountant (Statutory Finance) and MIS (Data Analytics &amp; Operations) competencies.
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
                <span className="truncate whitespace-nowrap">{tab.label}</span>
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
                    {tab.badge}
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
                  {story.p1}
                </p>

                <p
                  tabIndex={0}
                  data-tts={getA11yText(story.p2)}
                  className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-normal transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg p-1 -m-1"
                >
                  {story.p2}
                </p>

                <p
                  tabIndex={0}
                  data-tts={getA11yText(story.p3)}
                  className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-normal transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg p-1 -m-1"
                >
                  {story.p3}
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
                  data-tts={`Sub-header: Career Vision & Strategic Objective, ${story.alignmentBadge || 'Executive Alignment'}`}
                  className="flex items-center justify-between mb-3 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg p-1 -m-1"
                >
                  <div
                    className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider"
                    style={{ color: accentColor }}
                  >
                    <Target className="w-4 h-4" style={{ color: accentColor }} />
                    <span>{story.visionTitle}</span>
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
                    {story.visionQuote}
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
                    <span>{isOverview ? 'Executive Competency Pillars' : isOther ? 'Strategic Competency Pillars' : (isMIS ? 'Data & MIS Competency Pillars' : 'Core Competency Pillars')}</span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 font-medium">
                    4 Strategic Domains
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {competencies.map((comp) => {
                    const Icon = comp.icon;
                    return (
                      <div 
                        key={comp.title}
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
                              {comp.tag}
                            </span>
                          </div>

                          <h3 className="text-sm sm:text-base font-extrabold text-[#18181B] dark:text-[#F5F2F8] font-['Outfit',sans-serif] group-hover:text-stone-900 dark:group-hover:text-white transition-colors mb-2">
                            {comp.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                            {comp.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#ECE7DF]/70 dark:border-[#2D2340] flex items-center justify-between text-[11px] font-mono text-stone-500 dark:text-stone-400">
                          <span>Pillar Domain</span>
                          <span className="font-semibold text-stone-700 dark:text-stone-300">{comp.category}</span>
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
                  Academic &amp; Technical Qualifications
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-mono mt-1">
                  3-Tier Educational Breakdown • Board Certified &amp; Institution Verified
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#FFF0F3] dark:bg-pink-950/40 border border-[#FFD1DC] dark:border-pink-900/60 text-[#FF4D6D] dark:text-pink-300 self-start sm:self-auto">
                3 Milestones
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
                  data-tts={`Credential: ${cred.title} at ${cred.institution}, ${cred.location}. Status: ${cred.status}. Highlights: ${cred.highlights.join('; ')}`}
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
                        Tier {cred.level}
                      </span>
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white dark:bg-[#201830] border border-[#ECE7DF] dark:border-[#2D2340] text-stone-700 dark:text-[#A99EBA]">
                        {cred.boardBadge}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono font-bold text-stone-500 dark:text-[#A99EBA] bg-[#ECE7DF]/50 dark:bg-[#201830] px-2.5 py-0.5 rounded-full">
                      {cred.domainBadge}
                    </span>
                  </div>

                  {/* Title & Institution */}
                  <h4 className="text-base sm:text-lg md:text-xl font-extrabold text-[#18181B] dark:text-[#F5F2F8] font-['Outfit',sans-serif] group-hover:text-[#FF4D6D] dark:group-hover:text-[#FF4D6D] transition-colors">
                    {cred.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 dark:text-stone-400 font-medium mt-1.5 mb-4">
                    <Building2 className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                    <span>{cred.institution}</span>
                    <span>•</span>
                    <MapPin className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                    <span>{cred.location}</span>
                  </div>

                  {/* Syllabus / Credential Highlights */}
                  <div className="space-y-2 pt-3 border-t border-[#ECE7DF] dark:border-[#2D2340]">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-bold mb-1">
                      Key Highlights &amp; Scope
                    </div>
                    {cred.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300 font-normal leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4D6D] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Academic Accreditation Footer Pill */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] dark:from-[#18181B] dark:via-[#1E1E24] dark:to-[#18181B] border border-[#ECE7DF] dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600 dark:text-stone-400 font-mono transition-colors">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#FF4D6D]" />
                <span>All certificates, mark sheets &amp; diplomas are verified with state and central boards.</span>
              </div>
              <span className="font-bold text-[#18181B] dark:text-stone-200 bg-white dark:bg-[#27272A] px-3 py-1 rounded-lg border border-[#ECE7DF] dark:border-stone-700">
                Originals Available Upon Request
              </span>
            </div>
          </div>
        )}

          {/* Tab 3: Official Bio-Data Dossier */}
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
                  Verified Personal Demographics &amp; Administrative Identity Record
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
                <span>Verified Candidate Record</span>
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
                    Indian Citizen
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
                      data-tts={`${field.label}: ${field.value}`}
                      className="p-4 rounded-xl bg-white dark:bg-[#100C1A] border border-[#E7E2D8] dark:border-[#2D2340] flex flex-col justify-between space-y-2 hover:border-[#FF4D6D]/30 dark:hover:border-[#D946EF]/50 transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
                    >
                      <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
                        <span className="text-xs font-mono flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-[#FF4D6D]" />
                          <span>{field.label}</span>
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#FAF8F5] dark:bg-[#201830] border border-[#ECE7DF] dark:border-[#2D2340] text-stone-500 dark:text-[#A99EBA]">
                          {field.badge}
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
                    <span>Permanent / Residential Address</span>
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
                        <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Address</span>
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
                    <span>Verified Postal PIN: 822101</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Authentication Note */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#161122] border border-[#ECE7DF] dark:border-[#2D2340] flex items-start gap-3 transition-colors">
              <Briefcase className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
                This Bio-Data Dossier constitutes an authenticated executive profile for commercial engagements, senior accounting roles, tax advisory retainers, and distribution leadership opportunities.
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
