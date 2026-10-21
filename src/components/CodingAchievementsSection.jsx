import React from 'react';
import { Trophy, Zap, ShieldCheck, Award, Database, Server } from 'lucide-react';
import { useRoleTab } from '../context/RoleContext';
import { useAnnounce } from '../context/AnnouncerContext';
import AnimatedCounter from './AnimatedCounter';

const ACCOUNTANT_STATS = [
  {
    platform: 'Client Retention',
    stat: '99.8%',
    label: 'Long-Term Advisory Trust',
    sublabel: 'Consistent Multi-Year Fiscal Retainers',
    icon: ShieldCheck,
  },
  {
    platform: 'Compliance Record',
    stat: '0',
    label: 'Penalty & Notice Incidence',
    sublabel: 'Flawless GST & Income Tax Advisory',
    icon: Award,
  },
  {
    platform: 'Statutory Filings',
    stat: '500+',
    label: 'Cumulative Returns Reconciled',
    sublabel: 'GSTR-1, 3B, ITR & Section 115BAC',
    icon: Database,
  },
  {
    platform: 'Audit Precision',
    stat: '100%',
    label: 'Double-Entry Reconciliation Rate',
    sublabel: 'Zero Discrepancy Books & BRS Audits',
    icon: Server,
  },
];

const ACCOUNTANT_TICKER_ITEMS = [
  '7+ Years Tally Accounting',
  '7+ Years GST & Tax Filing',
  '500+ Tax Returns Processed',
  'GSTR-1, 3B & ITR Reconciliation',
  '100% Statutory Compliance Adherence',
  'Zero Penalty Incidence',
  'Commercial Ledger Governance',
  'Corporate Audit Readiness'
];

const MIS_STATS = [
  {
    platform: 'Database Scale',
    stat: '10,000+',
    label: 'Records Analyzed',
    sublabel: 'Multi-Source Operations & Trainee Databases',
    icon: Database,
  },
  {
    platform: 'Domain Tenure',
    stat: '5+ Years',
    label: 'MIS Experience',
    sublabel: 'End-to-End Portal & Reporting Systems',
    icon: Award,
  },
  {
    platform: 'Reporting Automation',
    stat: '100+',
    label: 'Automated Reports Generated',
    sublabel: 'Executive Dashboards & Cross-District MIS',
    icon: Server,
  },
  {
    platform: 'Quality Benchmark',
    stat: '99.5%',
    label: 'Data Integrity Rate',
    sublabel: 'High-Precision Audit & Validation Pipelines',
    icon: ShieldCheck,
  },
];

const MIS_TICKER_ITEMS = [
  '10,000+ Records Analyzed',
  '5+ Years MIS Experience',
  '100+ Automated Reports Generated',
  '99.5% Data Integrity Rate',
  'Advanced Excel & Pivot Modeling',
  'DAY-NULM Skill India MIS',
  'ADCA Certified (Infocity Daltonganj)',
  'Cross-District Biometric Validation'
];

const OVERVIEW_STATS = [
  {
    platform: 'Tax & Compliance',
    stat: '500+',
    label: 'Cumulative Returns Reconciled',
    sublabel: 'GSTR-1, 3B, ITR & Section 115BAC',
    icon: Database,
  },
  {
    platform: 'Books & Ledger Audit',
    stat: '100%',
    label: 'Double-Entry Reconciliation Rate',
    sublabel: 'Zero Discrepancy Books & BRS Audits',
    icon: Server,
  },
  {
    platform: 'MIS & Operations',
    stat: '10,000+',
    label: 'Records Analyzed & Governed',
    sublabel: 'Multi-District Trainee & Citizen Registries',
    icon: Database,
  },
  {
    platform: 'Reporting Systems',
    stat: '100+',
    label: 'Automated Reports Generated',
    sublabel: 'Executive Dashboards & DUDA Progress MIS',
    icon: ShieldCheck,
  },
];

const OVERVIEW_TICKER_ITEMS = [
  '7+ Years Dual Executive Track',
  '500+ Statutory Tax Returns Processed',
  '10,000+ MIS Records Analyzed',
  '100% Statutory Adherence Rate',
  'Zero Penalty or Notice Incidence',
  'DAY-NULM Skill India Mission MIS',
  '4-District Biometric Validation',
  'Corporate Ledger & Audit Governance'
];

const OTHER_STATS = [
  {
    platform: 'Advisory Governance',
    stat: '100%',
    label: 'Executive Operations & Compliance Oversight',
    sublabel: 'Multidisciplinary Management & Policy Integrity',
    icon: ShieldCheck,
  },
  {
    platform: 'Cross-Functional Engagements',
    stat: '15+',
    label: 'Commercial & Institutional Initiatives Managed',
    sublabel: 'Cross-Discipline Project & Enterprise Leadership',
    icon: Award,
  },
  {
    platform: 'Quality & Execution Rate',
    stat: '99.5%',
    label: 'Seamless Project Lifecycle Delivery',
    sublabel: 'High-Precision Multi-Department SLA Delivery',
    icon: Database,
  },
  {
    platform: 'Total Industry Experience',
    stat: '7+ Years',
    label: 'Unified Finance, MIS & Administration Tenure',
    sublabel: 'End-to-End Strategic, Financial & Operational Leadership',
    icon: Server,
  },
];

const OTHER_TICKER_ITEMS = [
  '7+ Years Multidisciplinary Leadership',
  'Executive Operations & Governance',
  'Corporate Finance & MIS Synergy',
  'Cross-Functional Project Management',
  '100% Statutory & Advisory Compliance',
  '99.5% Execution & Quality Delivery',
  'Enterprise Resource Optimization',
  'Cross-Sector Institutional Impact'
];

const VIBE_CODING_STATS = [
  {
    platform: 'Shipping Velocity',
    stat: '10x',
    label: 'Rapid Development Velocity',
    sublabel: 'Zero-to-Production SaaS Scaffolding',
    icon: Zap,
  },
  {
    platform: 'MVPs & Prototypes',
    stat: '50+',
    label: 'Full-Stack Apps Deployed',
    sublabel: 'Next.js 14, Tailwind CSS & Supabase',
    icon: Award,
  },
  {
    platform: 'Autonomous Loops',
    stat: '100%',
    label: 'Agentic Verification Pass Rate',
    sublabel: 'Autonomous Testing, Oxlint & Self-Healing',
    icon: ShieldCheck,
  },
  {
    platform: 'LLM Architecture',
    stat: '98%',
    label: 'Prompt Token Efficiency',
    sublabel: 'Claude 3.5 Sonnet, GPT-4o & Gemini APIs',
    icon: Server,
  },
];

const VIBE_CODING_TICKER_ITEMS = [
  '10x Shipping Velocity',
  '50+ Rapid Prototypes & MVPs',
  '100% Autonomous Code Loops',
  'Cursor & Windsurf Flow Mastery',
  'Claude Code Terminal Harnesses',
  'Next.js 14 & Supabase Cloud SaaS',
  'Zero-to-One Fullstack App Engineering',
  'Edge Compute & LLM Streaming'
];

export default function CodingAchievementsSection() {
  const { isAccountant, isMIS, isOther, isVibeCoding } = useRoleTab();
  const roleTabContext = useRoleTab();
  const activeRole = roleTabContext?.activeRole || (isOther ? 'other' : isMIS ? 'mis' : isVibeCoding ? 'vibe_coding' : 'accountant');
  const isVibe = Boolean(isVibeCoding || roleTabContext?.isVibe || activeRole === 'vibe_coding');
  const isOverview = Boolean(roleTabContext?.isOverview || activeRole === 'overview');
  const currentRole = activeRole;

  const activeStats = isVibe ? VIBE_CODING_STATS : (isOther ? OTHER_STATS : (isMIS ? MIS_STATS : ACCOUNTANT_STATS));
  const activeTickerItems = isVibe ? VIBE_CODING_TICKER_ITEMS : (isOther ? OTHER_TICKER_ITEMS : (isMIS ? MIS_TICKER_ITEMS : ACCOUNTANT_TICKER_ITEMS));

  const displayStats = isOverview ? OVERVIEW_STATS : activeStats;
  const displayTickerItems = isOverview ? OVERVIEW_TICKER_ITEMS : activeTickerItems;
  const tickerSequence = Array(8).fill(displayTickerItems).flat();

  const accentColor = isOverview ? '#6366F1' : isVibe ? '#10B981' : isOther ? '#8B5CF6' : (isMIS ? '#3B82F6' : '#FF4D6D');

  let announce = null;
  try {
    const announcer = useAnnounce();
    announce = announcer?.announce;
  } catch {
    // fallback
  }

  return (
    <section id="achievements" aria-labelledby="achievements-heading" className="py-24 bg-[#FAF8F5] dark:bg-[#0B0813] text-[#18181B] dark:text-[#F5F2F8] relative overflow-hidden select-none my-12 scroll-mt-28 border-y border-[#E7E2D8] dark:border-[#2D2340]">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{
          background: isOverview
            ? 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)'
            : isVibe
            ? 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)'
            : isOther
            ? 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)'
            : isMIS
            ? 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255,77,109,0.1) 0%, transparent 70%)'
        }}
      />
      <div aria-hidden="true" className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Scrolling Platform Marquee */}
      <div aria-hidden="true" className="w-[120%] -ml-[10%] bg-white dark:bg-[#161122] border-y border-[#E7E2D8] dark:border-[#2D2340] shadow-xs py-3.5 mb-16 overflow-hidden transition-all duration-300">
        <div className="flex w-max animate-marquee-left items-center">
          {tickerSequence.map((item, idx) => (
            <div
              key={`ticker-${idx}`}
              className="flex items-center gap-6 px-4 shrink-0 text-[#18181B] dark:text-[#A99EBA] font-extrabold text-xs sm:text-sm tracking-wider uppercase font-['Outfit',sans-serif]"
            >
              <span>{item}</span>
              <span className="text-sm" style={{ color: accentColor }}>✦</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div
              tabIndex={0}
              data-tts="Section 5: Achievements"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#161122] border border-[#E7E2D8] dark:border-[#2D2340] text-[#18181B] dark:text-[#F5F2F8] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs whitespace-nowrap max-w-full overflow-x-auto focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
              <span className="truncate sm:overflow-visible">05 ✦ Professional Milestones &bull; {isOverview ? 'Executive Overview' : isVibe ? 'AI & Vibe Coding' : isOther ? 'Corporate Controller & BI' : isMIS ? 'Data & MIS' : 'Accounting & Tax'}</span>
            </div>
            <h2
              id="achievements-heading"
              tabIndex={0}
              data-tts="Professional Milestones and Certifications"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] xl:text-5xl font-black text-[#18181B] dark:text-white tracking-tight font-['Outfit',sans-serif] leading-[1.08] mb-3 whitespace-normal sm:whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg"
            >
              Professional <span className="text-[#FF4D6D]" style={{ color: accentColor }}>Milestones</span> &amp; Certifications.
            </h2>
            <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: accentColor || '#FF4D6D' }} />
            <p
              tabIndex={0}
              data-tts={
                isOverview ? "Synthesized career milestones bridging statutory tax practice, audited ledger reconciliation, and autonomous AI vibe coding." :
                isVibe ? "Proven speed and engineering precision in AI prompt-to-app synthesis, autonomous multi-agent coding loops, and modern full-stack SaaS architecture." :
                isAccountant ? "Proven domain excellence in corporate bookkeeping, GST and Income Tax statutory compliance, and BRS audit precision." :
                isMIS ? "Demonstrated leadership in executive reporting, database reconciliation, automated dashboards, and cross-district operational analytics." :
                "Proven multidisciplinary leadership uniting financial management, institutional MIS systems, and strategic enterprise administration."
              }
              className="text-stone-600 dark:text-stone-400 text-sm md:text-base max-w-xl font-normal leading-relaxed focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg"
            >
              {isOverview && "Synthesized career milestones bridging statutory tax practice, audited ledger reconciliation, and autonomous AI vibe coding."}
              {!isOverview && isVibe && "Proven speed and engineering precision in AI prompt-to-app synthesis, autonomous multi-agent coding loops, and modern full-stack SaaS architecture."}
              {!isOverview && isAccountant && "Proven domain excellence in corporate bookkeeping, GST & Income Tax statutory compliance, and BRS audit precision."}
              {!isOverview && isMIS && "Demonstrated leadership in executive reporting, database reconciliation, automated dashboards, and cross-district operational analytics."}
              {!isOverview && isOther && "Proven multidisciplinary leadership uniting financial management, institutional MIS systems, and strategic enterprise administration."}
            </p>
          </div>

          {/* Aggregate Badge */}
          <div
            tabIndex={0}
            data-tts={`${isOverview ? 'Multi-Track Verified' : isVibe ? 'AI Software Engineering' : isOther ? 'Multidisciplinary Professional' : isMIS ? 'Data and Operations Analytics' : 'Statutory Tax Practice'}: ${isVibe ? '10x Speed' : isMIS ? '5+ Years Verified' : '7+ Years Verified'}`}
            className="flex items-center gap-3 bg-white dark:bg-[#161122] px-5 py-3 rounded-2xl border border-[#E7E2D8] dark:border-[#2D2340] shadow-sm shadow-stone-900/5 dark:shadow-none shrink-0 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
          >
            <Trophy className="w-5 h-5" style={{ color: accentColor }} />
            <div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono uppercase">
                {isOverview ? 'Multi-Track Verified' : isVibe ? 'AI Software Engineering' : isOther ? 'Multidisciplinary Professional' : isMIS ? 'Data & Operations Analytics' : 'Statutory Tax Practice'}
              </div>
              <div className="text-lg font-black text-[#18181B] dark:text-white font-mono">
                <AnimatedCounter
                  value={isVibe ? '10x Speed' : isMIS ? '5+ Years Verified' : '7+ Years Verified'}
                  resetKey={currentRole}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI-Synthesized Role Banner */}
        {Boolean(isOther || activeRole === 'other') && (
          <div
            tabIndex={0}
            data-tts="AI Synthesized Role: This specialized profile was synthesized by AI from verified Accountant and MIS competencies."
            className="mb-8 p-4 rounded-2xl bg-purple-50/90 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 shadow-xs flex items-center gap-3.5 text-purple-900 dark:text-purple-200 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0 text-lg">
              🤖
            </div>
            <div className="text-xs sm:text-sm font-medium leading-relaxed">
              <span className="font-bold text-purple-700 dark:text-purple-300">🤖 AI-Synthesized Role (Derived from Verified Tracks):</span>{' '}
              This specialized profile was synthesized by AI from verified Accountant (Statutory Finance) and MIS (Data Analytics &amp; Operations) competencies.
            </div>
          </div>
        )}

        {/* Platform Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {displayStats.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.label}
                tabIndex={0}
                data-card="true"
                data-tts={`${p.platform}: ${p.stat}, ${p.label}. ${p.sublabel}`}
                onClick={() => {
                  if (announce) announce(`Achievement metric: ${p.platform}, ${p.stat} ${p.label}. ${p.sublabel}`, 'polite');
                }}
                className="bg-white dark:bg-[#161122] hover:bg-stone-50 dark:hover:bg-[#201830] rounded-3xl p-6 border border-[#E7E2D8] dark:border-[#2D2340] hover:border-[#FF4D6D]/40 dark:hover:border-[#3D3055] shadow-sm shadow-stone-900/5 dark:shadow-none transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase font-mono tracking-wider text-stone-500 dark:text-stone-400 group-hover:text-[#18181B] dark:group-hover:text-white transition-colors">
                      {p.platform}
                    </span>
                    {Icon ? (
                      <Icon className="w-5 h-5 text-[#FF4D6D]" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D6D]" />
                    )}
                  </div>
                  <div className="text-4xl font-black text-[#18181B] dark:text-[#F5F2F8] font-mono tracking-tight mb-1">
                    <AnimatedCounter value={p.stat} resetKey={currentRole} />
                  </div>
                  <div className="text-xs font-semibold text-stone-700 dark:text-stone-200">
                    {p.label}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#ECE7DF] dark:border-[#2D2340] text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                  {p.sublabel}
                </div>
              </div>
            );
          })}
        </div>

        {/* Role-Specific Impact Highlight Banner */}
        {isOverview ? (
          <div
            tabIndex={0}
            data-tts="Impact Highlight: Dual Domain Mastery: Certified Statutory Accounting and Government MIS Systems. Synthesizing 7+ years of double-entry bookkeeping, GSTR compliance, and audited financial statements with large-scale public sector database management."
            className="bg-gradient-to-r from-white to-[#FAF8F5] dark:from-[#161122] dark:to-[#161122] rounded-3xl p-6 sm:p-8 border border-[#E7E2D8] dark:border-[#2D2340] shadow-sm shadow-stone-900/5 dark:shadow-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold">
                  <Zap className="w-3 h-3 text-indigo-600 dark:text-indigo-400" /> DUAL EXECUTIVE TRACK &bull; FINANCE &amp; OPERATIONS
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#18181B] dark:text-[#F5F2F8] font-['Outfit',sans-serif] mt-0.5">
                  Dual Domain Mastery: Certified Statutory Accounting &amp; Government MIS Systems
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
                  Synthesizing 7+ years of rigorous double-entry bookkeeping, GSTR compliance, and audited financial statements with large-scale public sector database management across 4 administrative districts.
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-300">
                Dual Track Lead
              </span>
            </div>
          </div>
        ) : isVibe ? (
          <div
            tabIndex={0}
            data-tts="Impact Highlight: 10x Shipping Velocity: Prompt-Driven Full-Stack SaaS Engineering. Deploying resilient production web architectures using Next.js 14, Supabase, and Tailwind CSS while orchestrating autonomous Claude Code and Cursor Composer multi-agent loops."
            className="bg-gradient-to-r from-white to-[#FAF8F5] dark:from-[#161122] dark:to-[#161122] rounded-3xl p-6 sm:p-8 border border-[#E7E2D8] dark:border-[#2D2340] shadow-sm shadow-stone-900/5 dark:shadow-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#10B981] flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 shrink-0">
                <span className="text-xl">⚡</span>
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#10B981] dark:text-emerald-400 font-bold">
                  <Zap className="w-3 h-3 text-[#10B981]" /> AI-NATIVE PROTOTYPING &amp; AUTONOMOUS CODING
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#18181B] dark:text-[#F5F2F8] font-['Outfit',sans-serif] mt-0.5">
                  10x Shipping Velocity: Prompt-Driven Full-Stack SaaS Engineering
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
                  Deploying resilient production web architectures using Next.js 14, Supabase, and Tailwind CSS while orchestrating autonomous Claude Code and Cursor Composer multi-agent loops that write, verify, and self-heal software.
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-300">
                10x Vibe Coder
              </span>
            </div>
          </div>
        ) : isOther ? (
          <div
            tabIndex={0}
            data-tts="Impact Highlight: Cross-Functional Executive Management, Statutory Oversight and Enterprise Operations. Delivering unified operational governance by seamlessly bridging corporate finance, data-driven MIS architectures, and strategic administrative execution."
            className="bg-gradient-to-r from-white to-[#FAF8F5] dark:from-[#161122] dark:to-[#161122] rounded-3xl p-6 sm:p-8 border border-[#E7E2D8] dark:border-[#2D2340] shadow-sm shadow-stone-900/5 dark:shadow-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF4D6D] flex items-center justify-center text-white shadow-lg shadow-pink-600/30 shrink-0">
                <span className="text-xl">🦋</span>
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#FF4D6D] dark:text-[#FFA4B6] font-bold">
                  <Zap className="w-3 h-3 text-[#FF4D6D]" /> MULTIDISCIPLINARY LEADERSHIP &amp; EXECUTIVE IMPACT
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#18181B] dark:text-[#F5F2F8] font-['Outfit',sans-serif] mt-0.5">
                  Cross-Functional Executive Management, Statutory Oversight &amp; Enterprise Operations
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
                  Delivering unified operational governance by seamlessly bridging corporate finance, data-driven MIS architectures, and strategic administrative execution across commercial and institutional initiatives.
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF8F5] dark:bg-[#100C1A] border border-[#E7E2D8] dark:border-[#2D2340] text-xs font-mono font-bold text-[#FF4D6D] dark:text-[#FFA4B6]">
                Multidisciplinary Lead
              </span>
            </div>
          </div>
        ) : isMIS ? (
          <div
            tabIndex={0}
            data-tts="Impact Highlight: Government Initiative and Operational Analytics. DAY-NULM Skill India Mission and Cross-District Biometric Systems. Administered candidate verification databases, monitored AEBAS attendance tracking across 4 districts, and automated weekly governance MIS reports."
            className="bg-gradient-to-r from-white to-[#FAF8F5] dark:from-[#161122] dark:to-[#161122] rounded-3xl p-6 sm:p-8 border border-[#E7E2D8] dark:border-[#2D2340] shadow-sm shadow-stone-900/5 dark:shadow-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF4D6D] flex items-center justify-center text-white shadow-lg shadow-pink-600/30 shrink-0">
                <span className="text-xl">🦋</span>
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#FF4D6D] dark:text-[#FFA4B6] font-bold">
                  <Zap className="w-3 h-3 text-[#FF4D6D]" /> GOVERNMENT INITIATIVE &amp; OPERATIONAL ANALYTICS
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#18181B] dark:text-[#F5F2F8] font-['Outfit',sans-serif] mt-0.5">
                  DAY-NULM Skill India Mission &amp; Cross-District Biometric Systems
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
                  Administered statewide candidate verification databases, monitored AEBAS attendance tracking across 4 districts, and automated weekly governance MIS reports for state mission directors.
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF8F5] dark:bg-[#100C1A] border border-[#E7E2D8] dark:border-[#2D2340] text-xs font-mono font-bold text-[#FF4D6D] dark:text-[#FFA4B6]">
                Verified MIS Lead
              </span>
            </div>
          </div>
        ) : (
          <div
            tabIndex={0}
            data-tts="Impact Highlight: Commercial Audit and Statutory Compliance. Commercial Enterprise Accounting Finalization and Corporate Statutory Governance. Spearheaded year-end financial finalization, ledger scrubdowns, multi-branch BRS reconciliations, and timely GST and TDS tax return filings."
            className="bg-gradient-to-r from-white to-[#FAF8F5] dark:from-[#161122] dark:to-[#161122] rounded-3xl p-6 sm:p-8 border border-[#E7E2D8] dark:border-[#2D2340] shadow-sm shadow-stone-900/5 dark:shadow-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF4D6D] flex items-center justify-center text-white shadow-lg shadow-pink-600/30 shrink-0">
                <span className="text-xl">🦋</span>
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#FF4D6D] dark:text-[#FFA4B6] font-bold">
                  <Zap className="w-3 h-3 text-[#FF4D6D]" /> COMMERCIAL AUDIT &amp; STATUTORY COMPLIANCE
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#18181B] dark:text-[#F5F2F8] font-['Outfit',sans-serif] mt-0.5">
                  Commercial Enterprise Accounting Finalization &amp; Corporate Statutory Governance
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
                  Spearheaded year-end financial finalization, ledger scrubdowns, multi-branch BRS reconciliations, and timely GST/TDS tax return filings with zero statutory notice or penalty history.
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF8F5] dark:bg-[#100C1A] border border-[#E7E2D8] dark:border-[#2D2340] text-xs font-mono font-bold text-[#FF4D6D] dark:text-[#FFA4B6]">
                Certified Tax Practitioner
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
