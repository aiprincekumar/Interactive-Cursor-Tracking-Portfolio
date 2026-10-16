import React, { useState } from 'react';
import { Briefcase, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundFX } from '../utils/audio';
import { useRoleTab } from '../context/RoleContext';

const ACCOUNTANT_ROLES = ['exp-01', 'exp-02', 'exp-04'];
const MIS_ROLES = ['exp-03', 'exp-05', 'exp-06'];
const OTHER_ROLES = ['exp-other-01', 'exp-other-02', 'exp-other-03'];

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
    activeHighlight: true
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
    activeHighlight: false
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
    targetId: 'exp-other-consultant',
    period: '2023 — PRESENT',
    status: 'Strategic Advisory & Operations',
    role: 'Multidisciplinary Business & Tax Consultant',
    company: 'Independent Advisory Practice',
    location: 'Daltonganj & Regional Jharkhand',
    description: 'Delivering integrated enterprise advisory, financial governance, statutory tax architecture, and digitized business operations for commercial ventures.',
    deliverables: [
      'Formulated unified financial-operational frameworks harmonizing bookkeeping, direct/indirect tax filings, and banking compliance.',
      'Directed tax planning, business registration advisory, and Section 115BAC statutory assessments for retail & MSME clients.',
      'Executed internal accounting reviews and ledger reconciliations to uncover structural cost leakages and uncredited inputs.',
      'Facilitated cross-agency documentation, compliance readiness, and digital submission workflows with 100% turnaround reliability.'
    ],
    techStack: ['Enterprise Advisory', 'GST Compliance', 'Income Tax E-Filing', 'Financial Governance', 'Tally Prime', 'MS Excel'],
    accentColor: '#FF4D6D',
    activeHighlight: true
  },
  {
    id: 'exp-other-02',
    targetId: 'exp-other-operations',
    period: '2021 — PRESENT',
    status: 'Operations Leadership',
    role: 'Operations & Workflow Management Lead',
    company: 'Commercial Distribution & Program Initiatives',
    location: 'Medininagar (Palamau), Jharkhand',
    description: 'Managing end-to-end commercial operations, multi-facility logistics, inventory velocity control, and standard operating procedures (SOPs).',
    deliverables: [
      'Administered distributor ERP pipelines and high-volume billing operations with strict daily cash & inventory reconciliations.',
      'Instituted structured operational controls across stock warehousing, batch tracking (FIFO), and transit settlement reconciliations.',
      'Designed operational checklists and verification workflows that reduced administrative errors and delivery cycle delays.',
      'Mentored field and office teams on software utilization, statutory protocol adherence, and customer dispute management.'
    ],
    techStack: ['Operations Leadership', 'Inventory Control', 'ERP Systems', 'Process Optimization', 'Logistics Management', 'Team Mentorship'],
    accentColor: '#10B981',
    activeHighlight: true
  },
  {
    id: 'exp-other-03',
    targetId: 'exp-other-admin',
    period: '2018 — 2023',
    status: 'Executive Administration',
    role: 'Executive Administrator & Public Programs Lead',
    company: 'Government Mission & Regional Projects',
    location: 'Palamau, Garhwa, Chatra, Rohtas Districts',
    description: 'Directing inter-departmental liaison, citizen demographic registration campaigns, secure database administration, and regional administrative reporting.',
    deliverables: [
      'Spearheaded multi-district biometric enrollment and smart card issuance operations across 4 administrative territories.',
      'Coordinated government stakeholder liaison, public program reporting, and official state/central portal synchronization.',
      'Maintained confidential databases, institutional audit trails, and strict statutory KYC documentation standards.',
      'Supervised regional field personnel, hardware deployment logistics, and citizen grievance resolution mechanisms.'
    ],
    techStack: ['Public Administration', 'Stakeholder Liaison', 'Database Governance', 'Field Operations', 'KYC & Audit Compliance', 'MIS Systems'],
    accentColor: '#8B5CF6',
    activeHighlight: false
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
  const isOther = roleContext?.isOther ?? (activeRole === 'other');

  const filteredExperiences = EXPERIENCES.filter((exp) => {
    if (isOther) {
      return OTHER_ROLES.includes(exp.id);
    }
    return activeRole === 'mis' ? MIS_ROLES.includes(exp.id) : ACCOUNTANT_ROLES.includes(exp.id);
  });

  const handleCardClick = (id) => {
    setActiveCard(id === activeCard ? null : id);
    soundFX.playPop();
  };

  return (
    <section id="experience" className="py-24 px-4 md:px-8 max-w-6xl mx-auto scroll-mt-28">
      <div className="bg-white rounded-3xl border border-[#E7E2D8] p-8 md:p-12 shadow-xl shadow-stone-900/5 relative overflow-hidden">
        {/* Soft subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FF4D6D]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Section Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E7E2D8] text-[#18181B] text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />
          03 ✦ Experience
        </div>

        {/* Header with Title, Period Pill, and Coral Accent Line */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#18181B] tracking-tight font-['Outfit',sans-serif]">
              Journey &amp; Experience
            </h2>
            <div className="w-12 h-1 bg-[#FF4D6D] rounded-full mt-4" />
            <p className="mt-3 text-stone-600 text-sm md:text-base max-w-xl font-normal leading-relaxed">
              {isOther
                ? 'Versatile career trajectory across multidisciplinary consulting, commercial operations leadership, executive administration, and strategic execution.'
                : 'Comprehensive career journey spanning financial accounting, statutory GST/Income Tax compliance, government skill mission MIS, and regional field operations.'}
            </p>
          </div>

          {/* Subtitle / Period Pill Badge */}
          <div className="flex items-center gap-3 bg-[#FAF8F5] px-4 py-2.5 rounded-2xl border border-[#ECE7DF] shadow-2xs self-start md:self-end">
            <Calendar className="w-4 h-4 text-[#FF4D6D]" />
            <span className="text-xs sm:text-sm font-mono font-bold text-[#18181B]">
              {activeRole === 'accountant'
                ? '2020 — 2026 • 4+ Years Core Accounting & 3+ Years Tax Practice'
                : activeRole === 'mis'
                ? '2018 — 2023 • 5+ Years Public Sector MIS & Field Operations'
                : '2018 — PRESENT • 7+ Years Multidisciplinary Consulting & Operations'}
            </span>
          </div>
        </div>

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
                className={`scroll-mt-28 group cursor-pointer rounded-2xl p-6 sm:p-7 border transition-all duration-300 relative flex flex-col justify-between hover:-translate-y-1 hover:border-[#FF4D6D]/30 hover:shadow-lg hover:shadow-[#FF4D6D]/5 ${
                  isSelected
                    ? 'bg-[#FAF8F5] border-[#FF4D6D] ring-2 ring-[#FF4D6D]/10 shadow-md'
                    : 'bg-[#FAF8F5]/80 border-[#ECE7DF]'
                }`}
              >
                <div>
                  {/* Top Bar with Period and Status Node */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                        exp.activeHighlight
                          ? 'text-[#FF4D6D] bg-[#FFF0F3] border-[#FFD1DC]'
                          : 'text-stone-600 bg-white border-[#ECE7DF]'
                      }`}
                    >
                      {exp.period}
                    </span>

                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-500 font-medium">
                      <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: exp.accentColor }}
                      />
                      {exp.status}
                    </div>
                  </div>

                  {/* Role Title and Company */}
                  <div className="mb-4">
                    <h3 className="text-xl font-extrabold text-[#18181B] font-['Outfit',sans-serif] group-hover:text-[#FF4D6D] transition-colors flex items-center gap-2">
                      {exp.role}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mt-1">
                      <Briefcase className="w-3.5 h-3.5 text-stone-400" />
                      <span>{exp.company}</span>
                      <span>•</span>
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  {/* Summary Description */}
                  <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed mb-5">
                    {exp.description}
                  </p>

                  {/* Bullet Deliverables */}
                  <div className="space-y-2 mb-6 pt-4 border-t border-[#ECE7DF]">
                    {exp.deliverables.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-xs text-stone-700 font-medium leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4D6D] shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Pills */}
                <div className="pt-4 border-t border-[#ECE7DF]">
                  <div className="flex flex-wrap gap-1.5">
                    {exp.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white border border-[#E7E2D8] text-stone-700 shadow-2xs group-hover:border-[#FF4D6D]/20 transition-colors"
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
    </section>
  );
}
