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

// Core Competencies (Replacing redundant operational bullets)
const CORE_COMPETENCIES = [
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
    title: 'Financial MIS & Operations',
    category: 'Scale & Analytics',
    icon: Terminal,
    accent: '#F59E0B',
    bgLight: 'bg-amber-50',
    borderLight: 'border-amber-100',
    tag: 'Cross-District Execution',
    description: 'Executive MIS analytics, trainee lifecycle governance for DAY-NULM Skill India, and multi-district biometric field data collection & hardware diagnostics across 4 administrative districts in Bihar & Jharkhand.'
  }
];

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
    label: 'Date of Birth',
    value: '10.11.1991 (10 November 1991)',
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

export default function AboutSection({ soundEnabled = true }) {
  const [activeTab, setActiveTab] = useState('story');
  const [addressCopied, setAddressCopied] = useState(false);
  const tabButtonRefs = useRef({});
  const copyTimeoutRef = useRef(null);

  const fullAddress = 'Daltonganj (Medininagar), Dist: Palamau, Pin: 822101, Jharkhand, India';

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
    if (soundEnabled) {
      soundFX.playFocusBeep();
    }
  };

  const handleKeyDown = (e) => {
    const currentIndex = TABS.findIndex((t) => t.id === activeTab);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % TABS.length;
      handleTabChange(TABS[nextIndex].id, true);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + TABS.length) % TABS.length;
      handleTabChange(TABS[prevIndex].id, true);
    } else if (e.key === 'Home') {
      e.preventDefault();
      handleTabChange(TABS[0].id, true);
    } else if (e.key === 'End') {
      e.preventDefault();
      handleTabChange(TABS[TABS.length - 1].id, true);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const panel = document.getElementById(`about-panel-${activeTab}`);
      if (panel) {
        panel.focus();
      }
    }
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
    <section id="about" className="py-24 px-4 md:px-8 max-w-6xl mx-auto scroll-mt-28">
      <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-14 border border-[#E7E2D8] shadow-xl shadow-stone-900/5 relative overflow-hidden">
        {/* Soft subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FF4D6D]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row with Section Badge and Subtitle Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E7E2D8] text-[#18181B] text-xs font-bold uppercase tracking-wider shadow-xs w-fit">
            <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />
            01 ✦ About
          </div>

          <div className="flex items-center gap-2 text-stone-500 font-mono text-xs">
            <BadgeCheck className="w-4 h-4 text-[#FF4D6D]" />
            <span>Verified Professional Dossier</span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="mb-8">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#18181B] tracking-tight font-['Outfit',sans-serif] leading-none">
            Who I am
          </h2>
          <div className="w-12 h-1 bg-[#FF4D6D] rounded-full mt-5" />
        </div>

        {/* 3-Tab Interactive Switcher Ribbon */}
        <div 
          role="tablist" 
          aria-label="About section tabs"
          aria-orientation="horizontal"
          onKeyDown={handleKeyDown}
          className="flex p-1.5 bg-[#FAF8F5] rounded-2xl border border-[#ECE7DF] gap-1.5 mb-10 overflow-x-auto no-scrollbar"
        >
          {TABS.map((tab) => {
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
                tabIndex={isActive ? 0 : -1}
                type="button"
                onClick={() => handleTabChange(tab.id, false)}
                onMouseEnter={() => {
                  if (soundEnabled) soundFX.playChipHover();
                }}
                className={`flex-1 min-w-[150px] sm:min-w-0 min-h-[44px] flex items-center justify-center gap-2.5 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-[#18181B] shadow-sm border border-[#E7E2D8]'
                    : 'text-stone-600 hover:text-[#18181B] hover:bg-white/60'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors shrink-0 ${isActive ? 'text-[#FF4D6D]' : 'text-stone-400'}`} />
                <span className="truncate whitespace-nowrap">{tab.label}</span>
                {isActive && (
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full bg-[#FFF0F3] border border-[#FFD1DC] text-[#FF4D6D] text-[10px] font-bold whitespace-nowrap shrink-0">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Panels Container with baseline min-height to eliminate layout shifts */}
        <div className="min-h-[560px] md:min-h-[600px] relative">
          {/* Tab 1: Executive Story & Vision */}
          {activeTab === 'story' && (
            <div 
              role="tabpanel" 
              id="about-panel-story" 
              aria-labelledby="about-tab-story"
              tabIndex={0}
              onKeyDown={handlePanelKeyDown}
              className="animate-tab-fade space-y-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 rounded-2xl"
            >
            {/* Executive 3-Paragraph Narrative */}
            <div className="space-y-4">
              <p className="text-base sm:text-lg md:text-xl text-[#18181B] font-medium leading-relaxed font-['Outfit',sans-serif]">
                I am an experienced <strong className="text-[#FF4D6D] font-bold">Senior Accountant &amp; Tax Consultant</strong> with over 7+ years of expertise in comprehensive financial accounting via Tally ERP/Prime, statutory compliance, and GST &amp; Income Tax advisory.
              </p>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                I specialize in precision accounting, audit readiness, and statutory tax reconciliation—ensuring 100% compliance, zero-discrepancy balance sheets, and streamlined business operations for enterprises and agencies.
              </p>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                With proven operational leadership as an MIS Executive for DAY-NULM Skill India and Smart Card Operations across 4 districts in Bihar &amp; Jharkhand, I bridge rigorous financial administration with modern computing systems and strategic office management.
              </p>
            </div>

            {/* Prominent Career Vision & Strategic Objective (Aligned) */}
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#FFF5F7] via-white to-[#FAF8F5] border-2 border-[#FF4D6D]/20 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FF4D6D] uppercase tracking-wider">
                  <Target className="w-4 h-4 text-[#FF4D6D]" />
                  <span>Career Vision &amp; Strategic Objective</span>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white border border-[#FFD1DC] text-[#FF4D6D] font-bold">
                  Leadership Alignment
                </span>
              </div>
              <p className="text-[#18181B] text-sm sm:text-base font-semibold leading-relaxed font-['Outfit',sans-serif]">
                "Senior Financial Accounting &amp; Tax Compliance professional seeking leadership assignments in <strong className="text-[#FF4D6D] font-bold">Financial Accounting &amp; Statutory Tax Governance</strong>, coupled with <strong className="text-[#FF4D6D] font-bold">Business Development &amp; Distribution Operations</strong> within a growth-oriented organization of repute. Dedicated to leveraging 7+ years of rigorous statutory compliance, double-entry fiscal precision, and multi-district operational acumen to build audit-ready financial frameworks and drive sustainable enterprise growth."
              </p>
            </div>

            {/* 4 High-Level Core Competency Pillars */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#18181B] uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-[#FF4D6D]" />
                  <span>Core Competency Pillars</span>
                </div>
                <span className="text-[11px] font-mono text-stone-500 font-medium">
                  4 Strategic Domains
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CORE_COMPETENCIES.map((comp) => {
                  const Icon = comp.icon;
                  return (
                    <div 
                      key={comp.title}
                      className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F5] border border-[#ECE7DF] hover:border-[#FF4D6D]/30 transition-all duration-200 flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3.5">
                          <div className={`w-9 h-9 rounded-xl ${comp.bgLight} border ${comp.borderLight} flex items-center justify-center shrink-0`}>
                            <Icon className="w-4 h-4" style={{ color: comp.accent }} />
                          </div>
                          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white border border-[#ECE7DF] text-stone-600">
                            {comp.tag}
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-extrabold text-[#18181B] font-['Outfit',sans-serif] group-hover:text-[#FF4D6D] transition-colors mb-2">
                          {comp.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                          {comp.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#ECE7DF]/70 flex items-center justify-between text-[11px] font-mono text-stone-500">
                        <span>Pillar Domain</span>
                        <span className="font-semibold text-stone-700">{comp.category}</span>
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
              className="animate-tab-fade space-y-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 rounded-2xl"
            >
            {/* Header intro */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#ECE7DF] gap-2">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#18181B] font-['Outfit',sans-serif]">
                  Academic &amp; Technical Qualifications
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 font-mono mt-1">
                  3-Tier Educational Breakdown • Board Certified &amp; Institution Verified
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#FFF0F3] border border-[#FFD1DC] text-[#FF4D6D] self-start sm:self-auto">
                3 Milestones
              </span>
            </div>

            {/* Visual Timeline Cards */}
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E7E2D8]">
              {CREDENTIALS.map((cred) => (
                <div 
                  key={cred.level}
                  id={cred.targetId || ('edu-' + cred.level)}
                  className="scroll-mt-28 relative p-6 sm:p-7 rounded-2xl bg-[#FAF8F5] border border-[#ECE7DF] hover:border-[#FF4D6D]/30 transition-all duration-200 group"
                >
                  {/* Timeline Node Dot */}
                  <div 
                    className="absolute -left-[30px] sm:-left-[39px] top-6 w-4 h-4 rounded-full bg-white border-3 transition-transform duration-200 group-hover:scale-125"
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
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white border border-[#ECE7DF] text-stone-700">
                        {cred.boardBadge}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono font-bold text-stone-500 bg-[#ECE7DF]/50 px-2.5 py-0.5 rounded-full">
                      {cred.domainBadge}
                    </span>
                  </div>

                  {/* Title & Institution */}
                  <h4 className="text-base sm:text-lg md:text-xl font-extrabold text-[#18181B] font-['Outfit',sans-serif] group-hover:text-[#FF4D6D] transition-colors">
                    {cred.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 font-medium mt-1.5 mb-4">
                    <Building2 className="w-3.5 h-3.5 text-stone-400" />
                    <span>{cred.institution}</span>
                    <span>•</span>
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{cred.location}</span>
                  </div>

                  {/* Syllabus / Credential Highlights */}
                  <div className="space-y-2 pt-3 border-t border-[#ECE7DF]">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-bold mb-1">
                      Key Highlights &amp; Scope
                    </div>
                    {cred.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-stone-700 font-normal leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4D6D] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Academic Accreditation Footer Pill */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] border border-[#ECE7DF] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600 font-mono">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#FF4D6D]" />
                <span>All certificates, mark sheets &amp; diplomas are verified with state and central boards.</span>
              </div>
              <span className="font-bold text-[#18181B] bg-white px-3 py-1 rounded-lg border border-[#ECE7DF]">
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
              className="animate-tab-fade space-y-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 rounded-2xl"
            >
            {/* Header intro with verified seal */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#ECE7DF] gap-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#18181B] font-['Outfit',sans-serif]">
                  Official Bio-Data Dossier
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 font-mono mt-1">
                  Verified Personal Demographics &amp; Administrative Identity Record
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#FFF0F3] border border-[#FFD1DC] px-3.5 py-1.5 rounded-full text-[#FF4D6D] text-xs font-mono font-bold self-start sm:self-auto shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#FF4D6D] animate-pulse" />
                <span>Verified Candidate Record</span>
              </div>
            </div>

            {/* Main Credential Card */}
            <div className="bg-[#FAF8F5] rounded-2xl border border-[#ECE7DF] p-6 sm:p-8 space-y-6 shadow-2xs">
              {/* Profile Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E7E2D8]">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#E7E2D8] flex items-center justify-center text-[#FF4D6D] font-bold text-lg font-mono shadow-2xs">
                    AV
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-extrabold text-[#18181B] font-['Outfit',sans-serif]">
                      Atul Verma
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-500 font-mono">
                      Accountant &amp; Tax Consultant • Daltonganj, Jharkhand
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-white border border-[#E7E2D8] text-stone-700 font-semibold">
                    DOB: 10.11.1991
                  </span>
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
                    Indian Citizen
                  </span>
                </div>
              </div>

              {/* Demographic Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {BIO_DATA_FIELDS.map((field) => {
                  const Icon = field.icon;
                  return (
                    <div 
                      key={field.label}
                      className="p-4 rounded-xl bg-white border border-[#E7E2D8] flex flex-col justify-between space-y-2 hover:border-[#FF4D6D]/30 transition-colors"
                    >
                      <div className="flex items-center justify-between text-stone-500">
                        <span className="text-xs font-mono flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-[#FF4D6D]" />
                          <span>{field.label}</span>
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#FAF8F5] border border-[#ECE7DF] text-stone-500">
                          {field.badge}
                        </span>
                      </div>

                      <div className="font-bold text-[#18181B] text-xs sm:text-sm">
                        {field.value}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Full Address Card with One-Click Copy */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-stone-600 flex items-center gap-1.5 uppercase tracking-wider">
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
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF4D6D] bg-white hover:bg-[#FFF0F3] border border-[#FFD1DC] px-3 py-1.5 rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D]"
                  >
                    {addressCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#E7E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="font-medium text-[#18181B] text-xs sm:text-sm leading-relaxed">
                    {fullAddress}
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 font-mono text-[11px] text-stone-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Verified Postal PIN: 822101</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Authentication Note */}
            <div className="p-4 rounded-xl bg-white border border-[#ECE7DF] flex items-start gap-3">
              <Briefcase className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                This Bio-Data Dossier constitutes an authenticated executive profile for commercial engagements, senior accounting roles, tax advisory retainers, and distribution leadership opportunities.
              </p>
            </div>
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
