import React, { useState } from 'react';
import { Briefcase, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundFX } from '../utils/audio';
import { useRoleTab } from '../context/RoleContext';

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
    status: 'Active Practice (7+ Years)',
    role: 'GST & Income Tax Consultant',
    company: 'Independent Tax Consultancy Practice',
    location: 'Daltonganj, Jharkhand',
    description: 'Managing end-to-end statutory taxation, monthly GSTR compliance, individual and business income tax returns, and client tax advisory.',
    deliverables: [
      'Directly managed 500+ statutory GST & Income Tax filings across active practice, maintaining a 100% on-time submission rate with zero penalty notices.',
      'Conducted rigorous GSTR-2B vs purchase ledger ITC reconciliations, identifying duplicate or ineligible claims',
      'Prepared and e-filed ITR-1, ITR-2, and ITR-4 returns for diverse salary and commercial business clients',
      'Advised clients on tax planning, Section 115BAC regime comparison, and advance tax computations'
    ],
    techStack: ['GST Portal', 'Income Tax E-Filing', 'Tally Prime', 'MS Excel', 'Form 26AS / AIS', 'E-Way Bill'],
    accentColor: '#FF4D6D',
    activeHighlight: true,
    trackBadge: 'Financial Track'
  },
  {
    id: 'exp-02',
    targetId: 'exp-senior-accountant',
    period: '2022 — PRESENT',
    status: 'Core Accounting (7+ Years)',
    role: 'Senior Tally Accountant',
    company: 'Commercial & Retail Enterprises',
    location: 'Medininagar (Palamau), Jharkhand',
    description: 'Directing full-cycle double-entry bookkeeping, daily vouchers, inventory accounting, bank reconciliations, and year-end balance sheet finalization.',
    deliverables: [
      'Maintained multi-company accounts with comprehensive ledger hierarchy, cash book, and day book governance',
      'Processed automated Bank Reconciliation Statements (BRS) across multiple commercial banking accounts',
      'Administered inventory batches, purchase orders, sales invoices, and stock valuation in Tally Prime & ERP 9',
      'Generated accurate monthly Trial Balances, P&L statements, and audit-ready final Balance Sheets'
    ],
    techStack: ['Tally Prime', 'Tally.ERP 9', 'Financial Auditing', 'BRS', 'Advanced Excel', 'Voucher Control'],
    accentColor: '#10B981',
    activeHighlight: true
  },
  {
    id: 'exp-03',
    targetId: 'exp-mis-executive',
    period: '2021 — 2023',
    status: 'Government Skill Mission',
    role: 'MIS Executive',
    company: 'DAY-NULM (National Urban Livelihoods Mission)',
    location: 'Jharkhand Region',
    description: 'Spearheaded database administration, candidate enrollment tracking, biometric attendance, and analytical reporting for Skill India urban training initiatives.',
    deliverables: [
      'Maintained real-time trainee lifecycle databases across batch mobilization, classroom attendance, and certification',
      'Compiled daily, weekly, and monthly MIS progress analytics for district urban development agencies (DUDAs)',
      'Managed official central/state portal data synchronization with 100% data integrity and zero error margins',
      'Coordinated assessment scheduling, placement documentation, and post-placement tracking dashboards'
    ],
    techStack: ['DAY-NULM Portal', 'Skill India SDMS', 'Advanced Excel', 'MIS Reporting', 'Data Analytics', 'Biometric Systems'],
    accentColor: '#8B5CF6',
    activeHighlight: false,
    trackBadge: 'Data & Operations Track'
  },
  {
    id: 'exp-04',
    targetId: 'exp-junks-food',
    period: '2020 — 2022',
    status: 'FMCG Distribution',
    role: 'Accountant & Inventory Controller',
    company: 'Junks Food Agency',
    location: 'Medininagar, Jharkhand',
    description: 'Executed commercial point-of-sale billing, inventory flow, franchise settlements, and vendor accounts using Path Solution ERP software.',
    deliverables: [
      'Operated Path Solution software for high-frequency distributor billing, stock entry, and daily sales closing',
      'Tracked warehouse stock intake, FIFO batch rotations, breakage claims, and transit loss reconciliations',
      'Managed vendor ledger accounts, distributor credit terms, and daily route-van collection settlements',
      'Prepared weekly sales velocity reports and stock replenishment requisitions for brand principals'
    ],
    techStack: ['Path Solution ERP', 'Inventory Control', 'Wholesale Billing', 'Vendor Ledger', 'Cash Reconciliation', 'Stock Auditing'],
    accentColor: '#F59E0B',
    activeHighlight: false
  },
  {
    id: 'exp-05',
    targetId: 'exp-smart-card',
    period: '2019 — 2021',
    status: 'Field Operations',
    role: 'Smart Card Operations Specialist',
    company: 'Regional E-Governance & Citizen ID Project',
    location: '4 Districts (Palamau, Garhwa, Chatra, Rohtas)',
    description: 'Supervised biometric enrollment, card personalization, secure chip encoding, and citizen distribution workflows across 4 administrative districts.',
    deliverables: [
      'Orchestrated mobile field enrollment camps and district headquarters card distribution across Bihar & Jharkhand',
      'Validated citizen demographic databases and KYC identity credentials against statutory guidelines',
      'Maintained hardware peripherals: fingerprint scanners, digital signature pads, and thermal card printers',
      'Trained local operator teams on secure field data capture, backup protocols, and grievance resolution'
    ],
    techStack: ['Smart Card Encoding', 'Biometric Enrollment', 'District Logistics', 'KYC Verification', 'Field Ops', 'Hardware Maintenance'],
    accentColor: '#3B82F6',
    activeHighlight: false
  },
  {
    id: 'exp-06',
    targetId: 'exp-instructor',
    period: '2018 — 2020',
    status: 'Academic & IT Training',
    role: 'Computer Instructor & Academic Tutor',
    company: 'Computer Training Institute & Private Academy',
    location: 'Daltonganj, Jharkhand',
    description: 'Instructed diploma students in computer applications, office productivity suites, desktop publishing, and foundational hardware troubleshooting.',
    deliverables: [
      'Delivered structured lectures and hands-on laboratory sessions on MS Office (Word, Excel, PowerPoint)',
      'Taught Desktop Publishing (DTP) workflows covering Adobe Photoshop, CorelDraw, and Adobe PageMaker',
      'Guided students through practical accounting entries and voucher fundamentals in Tally ERP 9',
      'Provided private tutoring in academic subjects and practical computer literacy for aspiring professionals'
    ],
    techStack: ['MS Office Suite', 'Adobe Photoshop', 'CorelDraw', 'Adobe PageMaker', 'Tally Fundamentals', 'Teaching & Mentoring'],
    accentColor: '#EC4899',
    activeHighlight: false
  },
  {
    id: 'exp-other-01',
    targetId: 'exp-other-controller',
    period: '2023 — PRESENT',
    status: 'Corporate Financial Controls & Strategy',
    role: 'Corporate Financial Controller & Tax Strategy Lead',
    company: 'Strategic Corporate Advisory & Enterprise Accounts',
    location: 'Daltonganj & Regional Jharkhand',
    description: 'Directing end-to-end corporate financial controls, statutory tax architecture, internal audit workflows, and multi-entity balance sheet finalization.',
    deliverables: [
      'Enforced strict corporate internal financial controls and risk governance policies across multi-entity commercial accounts.',
      'Directed corporate tax optimization under Section 115BAC, direct/indirect tax compliance, and automated GSTR-9 reconciliations.',
      'Established multi-tier purchase-sales matching protocols and variance thresholds preventing fiscal leakages and penalty notices.',
      'Supervised annual balance sheet finalization, trial balance audits, and statutory audit readiness dossiers with 100% compliance.'
    ],
    techStack: ['Corporate Controls', 'Statutory Auditing', 'Tally Prime ERP', 'Section 115BAC', 'GSTR-9 Audit', 'Financial Governance'],
    accentColor: '#8B5CF6',
    activeHighlight: true
  },
  {
    id: 'exp-other-02',
    targetId: 'exp-other-bi-systems',
    period: '2021 — PRESENT',
    status: 'BI Systems & ERP Automation',
    role: 'BI Systems Architect & Financial Operations Lead',
    company: 'Enterprise Systems & Commercial Distribution',
    location: 'Medininagar (Palamau), Jharkhand',
    description: 'Architecting Power BI fiscal dashboards, automated ERP reconciliation pipelines, and real-time operational KPI telemetry.',
    deliverables: [
      'Engineered executive Power BI fiscal dashboards connecting ERP databases with live revenue, gross margin, and working capital telemetry.',
      'Automated multi-depot Bank Reconciliation Statements (BRS) and stock variance detection routines in Path Solution ERP.',
      'Built automated data normalization pipelines bridging disparate operational databases with zero manual transcription latency.',
      'Mentored senior leadership on interactive financial modeling, variance decomposition, and data-driven resource allocation.'
    ],
    techStack: ['Power BI Dashboards', 'DAX Financial Modeling', 'Path Solution ERP', 'Automated BRS', 'ETL Pipelines', 'Inventory Analytics'],
    accentColor: '#10B981',
    activeHighlight: true
  },
  {
    id: 'exp-other-03',
    targetId: 'exp-other-compliance',
    period: '2018 — 2023',
    status: 'Enterprise Data & Compliance Oversight',
    role: 'Executive Data & Enterprise Compliance Director',
    company: 'Regional Operations & Institutional Governance',
    location: 'Palamau, Garhwa, Chatra, Rohtas Districts',
    description: 'Directing inter-departmental statutory governance, multi-district database systems, and institutional audit verification across 4 administrative districts.',
    deliverables: [
      'Governed large-scale citizen biometric enrollment databases and smart card personalization pipelines across 4 administrative districts.',
      'Formulated executive compliance dossiers, institutional audit trails, and multi-tier statutory verification frameworks.',
      'Supervised regional technical teams, hardware infrastructure reliability, and state/central government portal synchronizations.',
      'Conducted systematic internal audits of public program expenditures, maintaining zero compliance defects and complete transparency.'
    ],
    techStack: ['Enterprise Data Systems', 'Statutory Auditing', 'Biometric Databases', 'District Operations', 'Audit Trails', 'Public Governance'],
    accentColor: '#6366F1',
    activeHighlight: false
  },
  {
    id: 'exp-vibe-01',
    targetId: 'exp-vibe-coder',
    period: '2026 (6 MONTHS)',
    status: 'Active AI Practice (Recent / 2026)',
    role: 'Independent AI Builder / Freelance Vibe Coder',
    company: 'Self-Employed / Stealth SaaS Studio',
    location: 'Remote / Global',
    description: 'Rapid prototype deployment, end-to-end fullstack AI SaaS applications, prompt architecture, autonomous coding agent loops, Supabase & Next.js backend, Stripe webhooks, and client delivery.',
    deliverables: [
      'Rapid prototype deployment of 25+ responsive full-stack SaaS MVPs using Cursor Composer, Windsurf Cascade, and Claude Code with 10x faster shipping velocity.',
      'Architected multi-agent autonomous dev loops with Oxlint static analysis, Vitest automated testing, and self-healing error recovery routines.',
      'Integrated Supabase PostgreSQL databases with Row-Level Security (RLS) policies, edge functions, and real-time WebSocket state synchronization.',
      'Deployed production Stripe payment webhooks, subscription billing workflows, and frontier LLM streaming APIs (Claude 3.5 Sonnet, GPT-4o).'
    ],
    techStack: ['Next.js 14', 'Cursor AI', 'Claude Code', 'Supabase', 'Tailwind CSS', 'Stripe API', 'TypeScript', 'Autonomous Loops'],
    accentColor: '#10B981',
    activeHighlight: true,
    trackBadge: 'AI & SaaS Track'
  }
];

export default function ExperienceSection() {
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

  const handleCardClick = (id) => {
    setActiveCard(id === activeCard ? null : id);
    soundFX.playPop();
  };

  return (
    <section id="experience" className="relative w-full py-24 px-4 sm:px-6 lg:px-8 scroll-mt-28">
      <div className="max-w-7xl mx-auto">
        {/* Section Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#161122] border border-[#E7E2D8] dark:border-[#2D2340] text-[#18181B] dark:text-[#F5F2F8] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs transition-colors whitespace-nowrap max-w-full overflow-x-auto">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
          <span className="truncate sm:overflow-visible">03 ✦ Experience &bull; {activeRole === 'overview' ? 'Executive Overview' : isVibe ? 'AI & Vibe Coding' : (isOther || activeRole === 'other') ? 'Corporate Controller & BI' : activeRole === 'mis' ? 'Data & MIS' : 'Accounting & Tax'}</span>
        </div>

        {/* Header with Title, Period Pill, and Coral Accent Line */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#18181B] dark:text-white tracking-tight font-['Outfit',sans-serif] leading-[1.08] mb-3 transition-colors whitespace-normal sm:whitespace-nowrap">
              Journey &amp; <span className="text-[#FF4D6D]" style={{ color: accentColor }}>Experience</span>.
            </h2>
            <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: accentColor || '#FF4D6D' }} />
            <p className="text-stone-600 dark:text-stone-300 text-sm md:text-base max-w-xl font-normal leading-relaxed transition-colors">
              {activeRole === 'overview'
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
          <div className="flex items-center gap-3 bg-white dark:bg-[#161122] px-4 py-2.5 rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] shadow-2xs self-start md:self-end transition-colors">
            <Calendar className="w-4 h-4" style={{ color: accentColor }} />
            <span className="text-xs sm:text-sm font-mono font-bold text-[#18181B] dark:text-stone-200">
              {activeRole === 'overview'
                ? '2018 — 2026 • 7+ Years Finance & MIS + AI Vibe Coding'
                : isVibe
                ? '2026 (6 Months) • Rapid AI Prototyping & SaaS Engineering'
                : activeRole === 'accountant'
                ? '2020 — 2026 • 4+ Years Core Accounting & 3+ Years Tax Practice'
                : activeRole === 'mis'
                ? '2018 — 2023 • 5+ Years Public Sector MIS & Field Operations'
                : '2018 — PRESENT • 7+ Years Corporate Control & BI Systems'}
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
                onClick={() => handleCardClick(exp.id)}
                className={`scroll-mt-28 group cursor-pointer rounded-2xl p-6 sm:p-7 border transition-all duration-300 relative flex flex-col justify-between hover:-translate-y-1 hover:border-[#FF4D6D]/30 dark:hover:border-[#D946EF]/50 hover:shadow-lg hover:shadow-[#D946EF]/5 ${
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
                          {exp.trackBadge}
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
                    <h3 className="text-xl font-extrabold text-[#18181B] dark:text-[#F4F4F5] font-['Outfit',sans-serif] group-hover:text-[#FF4D6D] dark:group-hover:text-[#FF4D6D] transition-colors flex items-center gap-2">
                      {exp.role}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-medium mt-1">
                      <Briefcase className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                      <span>{exp.company}</span>
                      <span>•</span>
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  {/* Summary Description */}
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-normal leading-relaxed mb-5">
                    {exp.description}
                  </p>

                  {/* Bullet Deliverables */}
                  <div className="space-y-2 mb-6 pt-4 border-t border-[#ECE7DF] dark:border-[#2D2340]">
                    {exp.deliverables.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4D6D] shrink-0 mt-0.5" />
                        <span>{bullet}</span>
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
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white dark:bg-[#201830] border border-[#E7E2D8] dark:border-[#2D2340] text-stone-700 dark:text-[#A99EBA] shadow-2xs group-hover:border-[#FF4D6D]/20 dark:group-hover:border-[#FF4D6D]/40 transition-colors"
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
