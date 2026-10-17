import React from 'react';
import { Trophy, Zap, ShieldCheck, Award, Database, Server } from 'lucide-react';
import { useRoleTab } from '../context/RoleContext';
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

export default function CodingAchievementsSection() {
  const { activeRole, isAccountant, isMIS, isOther } = useRoleTab();
  const currentRole = activeRole || (isOther ? 'other' : isMIS ? 'mis' : 'accountant');

  const activeStats = isOther ? OTHER_STATS : isMIS ? MIS_STATS : ACCOUNTANT_STATS;
  const activeTickerItems = isOther ? OTHER_TICKER_ITEMS : isMIS ? MIS_TICKER_ITEMS : ACCOUNTANT_TICKER_ITEMS;
  const tickerSequence = Array(8).fill(activeTickerItems).flat();

  return (
    <section id="achievements" className="py-24 bg-[#FAF8F5] dark:bg-[#0B0813] text-[#18181B] dark:text-[#F5F2F8] relative overflow-hidden select-none my-12 scroll-mt-28 border-y border-[#E7E2D8] dark:border-[#2D2340]">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF4D6D]/5 dark:bg-[#FF4D6D]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Scrolling Platform Marquee */}
      <div className="w-[120%] -ml-[10%] bg-white dark:bg-[#161122] border-y border-[#E7E2D8] dark:border-[#2D2340] shadow-xs py-3.5 mb-16 overflow-hidden transition-all duration-300">
        <div className="flex w-max animate-marquee-left items-center">
          {tickerSequence.map((item, idx) => (
            <div
              key={`ticker-${idx}`}
              className="flex items-center gap-6 px-4 shrink-0 text-[#18181B] dark:text-[#A99EBA] font-extrabold text-xs sm:text-sm tracking-wider uppercase font-['Outfit',sans-serif]"
            >
              <span>{item}</span>
              <span className="text-[#FF4D6D] text-sm">🦋</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#161122] border border-[#E7E2D8] dark:border-[#2D2340] text-[#18181B] dark:text-[#FFA4B6] text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />
              05 ✦ Professional Milestones
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#18181B] dark:text-[#F5F2F8] tracking-tight font-['Outfit',sans-serif]">
              Professional Milestones &amp; Certifications
            </h2>
            <p className="mt-2 text-stone-600 dark:text-stone-400 text-sm md:text-base max-w-xl font-normal leading-relaxed">
              {isAccountant && "Proven domain excellence in corporate bookkeeping, GST & Income Tax statutory compliance, and BRS audit precision."}
              {isMIS && "Demonstrated leadership in executive reporting, database reconciliation, automated dashboards, and cross-district operational analytics."}
              {isOther && "Proven multidisciplinary leadership uniting financial management, institutional MIS systems, and strategic enterprise administration."}
            </p>
          </div>

          {/* Aggregate Badge */}
          <div className="flex items-center gap-3 bg-white dark:bg-[#161122] px-5 py-3 rounded-2xl border border-[#E7E2D8] dark:border-[#2D2340] shadow-sm shadow-stone-900/5 dark:shadow-none shrink-0">
            <Trophy className="w-5 h-5 text-[#FF4D6D]" />
            <div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 font-mono uppercase">
                {isOther ? 'Multidisciplinary Professional' : isMIS ? 'Data & Operations Analytics' : 'Statutory Tax Practice'}
              </div>
              <div className="text-lg font-black text-[#18181B] dark:text-white font-mono">
                <AnimatedCounter
                  value={isMIS ? '5+ Years Verified' : '7+ Years Verified'}
                  resetKey={currentRole}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Platform Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {activeStats.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.label}
                className="bg-white dark:bg-[#161122] hover:bg-stone-50 dark:hover:bg-[#201830] rounded-3xl p-6 border border-[#E7E2D8] dark:border-[#2D2340] hover:border-[#FF4D6D]/40 dark:hover:border-[#3D3055] shadow-sm shadow-stone-900/5 dark:shadow-none transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
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
        {isOther ? (
          <div className="bg-gradient-to-r from-white to-[#FAF8F5] dark:from-[#161122] dark:to-[#161122] rounded-3xl p-6 sm:p-8 border border-[#E7E2D8] dark:border-[#2D2340] shadow-sm shadow-stone-900/5 dark:shadow-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
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
          <div className="bg-gradient-to-r from-white to-[#FAF8F5] dark:from-[#161122] dark:to-[#161122] rounded-3xl p-6 sm:p-8 border border-[#E7E2D8] dark:border-[#2D2340] shadow-sm shadow-stone-900/5 dark:shadow-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
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
          <div className="bg-gradient-to-r from-white to-[#FAF8F5] dark:from-[#161122] dark:to-[#161122] rounded-3xl p-6 sm:p-8 border border-[#E7E2D8] dark:border-[#2D2340] shadow-sm shadow-stone-900/5 dark:shadow-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
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
