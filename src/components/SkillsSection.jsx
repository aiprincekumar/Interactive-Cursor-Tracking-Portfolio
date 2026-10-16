import React, { useState, useEffect } from 'react';
import { soundFX } from '../utils/audio';
import { useRoleTab } from '../context/RoleContext';


const SKILL_DATA = {
  // --- Category 1: Accounting & Tax ---
  'Tally Prime & ERP 9': {
    category: 'Accounting & Tax',
    title: 'Tally Prime & ERP 9',
    level: '98%',
    tag: 'Comprehensive Financial Accounting',
    points: [
      'End-to-end company creation, chart of accounts setup, and multi-ledger hierarchy structuring.',
      'Voucher entry lifecycle: sales, purchase, payment, receipt, debit/credit notes, and journal adjustments.',
      'Real-time inventory management, stock valuation (FIFO/weighted average), and batch-wise tracking.',
      'Trial Balance reconciliation, Profit & Loss statement generation, and final Balance Sheet finalization.'
    ]
  },
  'GST Filing & Compliance': {
    category: 'Accounting & Tax',
    title: 'GST Filing & Compliance',
    level: '96%',
    tag: 'Indirect Taxation & Portal Filing',
    points: [
      'Monthly and quarterly GSTR-1 outward supplies return preparation and online JSON submission.',
      'GSTR-3B monthly summary tax computation, input tax credit (ITC) netting, and cash ledger offset.',
      'GSTR-2B vs purchase ledger reconciliation to detect missing ITC and supplier mismatch.',
      'E-way bill generation, GST e-invoicing compliance, and notice response advisory.'
    ]
  },
  'Income Tax E-Filing': {
    category: 'Accounting & Tax',
    title: 'Income Tax E-Filing',
    level: '94%',
    tag: 'Direct Taxation & ITR Returns',
    points: [
      'Preparation and e-filing of ITR-1 (Sahaj), ITR-2, and ITR-4 (Sugam) on the Income Tax portal.',
      'Reconciliation of Annual Information Statement (AIS) and Form 26AS with books of account.',
      'Tax computation under both Old and New Tax Regimes (Section 115BAC) for optimal tax saving.',
      'Advance tax calculations, self-assessment tax challan generation, and refund status tracking.'
    ]
  },
  'Financial Auditing & Ledgers': {
    category: 'Accounting & Tax',
    title: 'Financial Auditing & Ledgers',
    level: '95%',
    tag: 'Statutory Books & Verification',
    points: [
      'In-depth scrutiny of general ledgers, subsidiary books, cash book, and day book records.',
      'Bank reconciliation statements (BRS) with automated clearing and uncredited cheque adjustment.',
      'Sundry debtors and creditors aging analysis with physical voucher verification.',
      'Year-end provision creation, depreciation scheduling, and audit trail preparation.'
    ]
  },

  // --- Category 2: Software & Applications ---
  'MS Excel (Advanced)': {
    category: 'Software & Applications',
    title: 'MS Excel (Advanced)',
    level: '97%',
    tag: 'Financial Modeling & Analysis',
    points: [
      'Advanced lookup formulas: XLOOKUP, VLOOKUP, INDEX/MATCH, and dynamic array functions.',
      'Pivot Tables, slicers, calculated fields, and multi-source financial dashboards.',
      'Data validation rules, conditional formatting alerts, and nested logical statements (IFS/AND/OR).',
      'What-If analysis, goal seek, and structured financial summary consolidation.'
    ]
  },
  'MS Office (Word & PPT)': {
    category: 'Software & Applications',
    title: 'MS Office (Word & PowerPoint)',
    level: '96%',
    tag: 'Documentation & Presentations',
    points: [
      'Official memorandum drafting, executive letters, and mail merge documentation in MS Word.',
      'Corporate review presentations, stakeholder pitch decks, and visual infographics in MS PowerPoint.',
      'Template standardization, formatting governance, and professional business stationery.',
      'PDF publication, digital signing readiness, and collaborative document review.'
    ]
  },
  'DTP Design Suite': {
    category: 'Software & Applications',
    title: 'Desktop Publishing (DTP Suite)',
    level: '92%',
    tag: 'Commercial Layouts & Graphics',
    points: [
      'Commercial brochure, bill book, banner, and stationery layout design in Adobe Photoshop.',
      'Vector graphics, certificate borders, logos, and publication artwork in CorelDraw.',
      'Page composition, book formatting, newspaper layouts, and typesetting in Adobe PageMaker.',
      'Print production setup: CMYK color separation, resolution scaling, and prepress alignment.'
    ]
  },
  'Path Solution ERP': {
    category: 'Software & Applications',
    title: 'Path Solution ERP',
    level: '94%',
    tag: 'FMCG & Agency Management',
    points: [
      'High-frequency wholesale invoicing, retail point-of-sale billing, and barcode integration.',
      'Distributor inventory control, batch expiry alerts, and purchase order tracking.',
      'Franchise vendor settlement, commission calculations, and path database reconciliations.',
      'Daily sales collection summaries and agency logistics dispatch reports.'
    ]
  },

  // --- Category 3: IT Systems & Hardware ---
  'Windows OS Administration': {
    category: 'IT Systems & Hardware',
    title: 'Windows OS Administration',
    level: '95%',
    tag: 'Workstation Deployments & OS Support',
    points: [
      'Installation, clean configuration, and deployment of Windows 10/11 Professional environments.',
      'User account management, local group policies, permissions, and security hardening.',
      'Automated system backup routines, disk partitioning (GPT/MBR), and restore point administration.',
      'Peripheral driver configuration, printer spooling, and USB security policy enforcement.'
    ]
  },
  'Commercial Computing & Office IT Suite': {
    category: 'IT Systems & Hardware',
    title: 'Commercial Computing & Office IT Suite',
    level: '96%',
    desc: 'High-throughput commercial computing covering advanced financial spreadsheets, bilingual documentation, data validation, and IT infrastructure administration.',
    tag: 'Commercial Computing & IT Suite Administration',
    points: [
      'High-throughput commercial computing covering advanced financial spreadsheets, bilingual documentation, data validation, and IT infrastructure administration.',
      'Advance Diploma in Computer Application (ADCA) credential from Infocity Daltonganj.',
      'Internet communications, digital office workflows, and secure browser-based e-governance.',
      'Bilingual data processing, typing fluency in Hindi & English, and rapid clerical throughput.'
    ]
  },
  'Hardware Diagnosis & Maintenance': {
    category: 'IT Systems & Hardware',
    title: 'Hardware Diagnosis & Maintenance',
    level: '92%',
    tag: 'PC Architecture & Component Repair',
    points: [
      'Desktop workstation assembly, SMPS power unit testing, and motherboard diagnostics.',
      'RAM upgrades, thermal paste reapplication, SSD migration, and BIOS/UEFI configuration.',
      'Display troubleshooting, peripheral fault isolation, and hardware failure triage.',
      'Preventive hardware cleaning, dust suppression, and power-surge protection protocols.'
    ]
  },
  'Network & Software Support': {
    category: 'IT Systems & Hardware',
    title: 'Network & Software Support',
    level: '90%',
    tag: 'LAN & Application Support',
    points: [
      'Local Area Network (LAN) setup, Ethernet crimping, IP addressing, and router/switch configuration.',
      'Network printer sharing, multi-user Tally Prime network data access, and firewall rules.',
      'Malware detection, antivirus definition updating, and system crash recovery.',
      'Remote assistance via AnyDesk/TeamViewer for urgent branch office issue resolution.'
    ]
  },

  // --- Category 4: Management & Operations ---
  'Office Administration': {
    category: 'Management & Operations',
    title: 'Office Administration',
    level: '95%',
    tag: 'Operational Governance & Facilities',
    points: [
      'Supervision of day-to-day office workflows, document registry, and clerical protocols.',
      'Petty cash handling, operational expense budgeting, and utility billing reconciliation.',
      'Cross-departmental communication, staff attendance logging, and vendor liaison.',
      'Administrative record archiving, statutory compliance filing, and audit readiness.'
    ]
  },
  'Stock Handling & Logistics': {
    category: 'Management & Operations',
    title: 'Stock Handling & Logistics',
    level: '94%',
    tag: 'Warehousing & Physical Audits',
    points: [
      'Physical inventory verification against digital ERP records to eliminate shrinkage and discrepancies.',
      'Warehouse stock layout optimization for fast FIFO goods inward and outward dispatch.',
      'Damaged stock segregation, replacement claim filings with manufacturers, and credit notes.',
      'Reorder level monitoring to guarantee zero-stockout operation across key FMCG SKUs.'
    ]
  },
  'MIS Reporting & Analytics': {
    category: 'Management & Operations',
    title: 'MIS Reporting & Analytics',
    level: '96%',
    tag: 'Executive Telemetry & KPI Dashboards',
    points: [
      'Daily, weekly, and monthly Management Information System (MIS) reports for senior management.',
      'Sales trend analysis, margin breakdown per product category, and debtor aging reports.',
      'Performance metrics monitoring for government skill mission candidates and field teams.',
      'Standardized data visualization charts enabling data-driven commercial decisions.'
    ]
  },
  'Business Development': {
    category: 'Management & Operations',
    title: 'Business Development & Client Relations',
    level: '91%',
    tag: 'Client Acquisition & Relationship Growth',
    points: [
      'Client onboarding for accounting, tax filing, and digital certification services.',
      'Commercial negotiation, pricing proposals, and client retention management.',
      'Market expansion initiatives across local trading hubs and retail networks.',
      'Stakeholder trust building through ethical compliance advisory and punctual deliverables.'
    ]
  },

  // --- Category 5: Multidisciplinary & Strategy (Other Track) ---
  'Strategic Operations & Governance': {
    category: 'Strategy & Leadership',
    title: 'Strategic Operations & Governance',
    level: '96%',
    tag: 'Enterprise Steering & Policy Alignment',
    points: [
      'Multi-departmental process integration aligning finance, administrative protocols, and IT operations.',
      'Standard Operating Procedure (SOP) formulation ensuring strict statutory and organizational compliance.',
      'Resource allocation modeling, cross-functional milestone tracking, and operational risk mitigation.',
      'Executive governance reporting and strategic KPI alignment across diverse regional initiatives.'
    ]
  },
  'Cross-Functional Consulting': {
    category: 'Strategy & Leadership',
    title: 'Cross-Functional Consulting',
    level: '95%',
    tag: 'Advisory & Systems Integration',
    points: [
      'Bridging domain gaps between commercial accounting, enterprise data analytics, and executive leadership.',
      'Workflow transformation advisory minimizing operational friction and communication silos.',
      'Stakeholder alignment through evidence-backed reviews, fiscal discipline, and delivery milestones.',
      'Custom client advisory combining statutory compliance, operational workflows, and data accuracy.'
    ]
  },
  'Executive Problem Solving': {
    category: 'Strategy & Leadership',
    title: 'Executive Problem Solving',
    level: '94%',
    tag: 'Root-Cause Resolution & Crisis Triage',
    points: [
      'Rapid diagnostic triage of operational bottlenecks, billing bottlenecks, and administrative disruptions.',
      'Data-driven root cause analysis combining ledger audits with operational telemetry logs.',
      'Actionable resolution plans with minimal turnaround time and zero business interruption.',
      'Post-incident retrospectives and preventative control engineering across distributed teams.'
    ]
  },
  'Change Management & Mentorship': {
    category: 'Strategy & Leadership',
    title: 'Change Management & Mentorship',
    level: '93%',
    tag: 'Capability Building & Cultural Transition',
    points: [
      'Leading personnel through software migrations, ERP rollouts, and modernized reporting workflows.',
      'Targeted coaching of junior accountants and data operators on statutory accuracy and best practices.',
      'Change impact analysis, readiness assessments, and continuous feedback loop integration.',
      'Cultivating institutional accountability, meticulous documentation, and operational excellence.'
    ]
  },
  'Process Automation & Workflows': {
    category: 'Operations Optimization',
    title: 'Process Automation & Workflows',
    level: '95%',
    tag: 'Efficiency Engineering & Pipeline Modernization',
    points: [
      'Streamlining recurring office, accounting, and reporting workflows through structured templates and automation.',
      'Elimination of repetitive manual entries via linked spreadsheets, formula logic, and digital checkpoints.',
      'Multi-touchpoint data consolidation pipelines reducing turnaround time and human transcription errors.',
      'Systematic data verification gates ensuring continuous data integrity across platforms.'
    ]
  },
  'Vendor & Stakeholder Relations': {
    category: 'Operations Optimization',
    title: 'Vendor & Stakeholder Relations',
    level: '94%',
    tag: 'Contractual Stewardship & Partner Alignment',
    points: [
      'Strategic negotiation of commercial contracts, supply agreements, and service level commitments.',
      'End-to-end vendor evaluation, dispute mediation, payment term alignment, and reconciliation.',
      'Government liaison, regulatory authority communication, and institutional stakeholder relationship building.',
      'Transparent milestone accounting and high-trust relationship management across regional partners.'
    ]
  },
  'Cost Optimization & Budgeting': {
    category: 'Operations Optimization',
    title: 'Cost Optimization & Budgeting',
    level: '96%',
    tag: 'Fiscal Prudence & Expenditure Control',
    points: [
      'Variance analysis tracking budgeted vs actual departmental expenditures to curb margin leakage.',
      'Identification of operational redundancies, renegotiating logistics overheads, and administrative costs.',
      'Cash flow forecasting, liquidity protection, and return on investment (ROI) evaluation for capital expenses.',
      'Prudent fiscal frameworks ensuring sustainable operational efficiency across commercial ventures.'
    ]
  },
  'Data-Driven Decision Making': {
    category: 'Operations Optimization',
    title: 'Data-Driven Decision Making',
    level: '95%',
    tag: 'Quantitative Synthesis & Strategic Foresight',
    points: [
      'Translating raw multi-source business data into actionable executive insights and strategic forecasts.',
      'Scenario planning, sensitivity modeling, and risk-weighted decision frameworks.',
      'Executive KPI synthesis combining operational velocity with balance sheet health metrics.',
      'Facilitating high-conviction management decisions with verified empirical telemetry.'
    ]
  }
};

const ACCOUNTANT_CATEGORIES = [
  {
    name: 'Statutory Accounting & Tax',
    skills: ['Tally Prime & ERP 9', 'GST Filing & Compliance', 'Income Tax E-Filing', 'Financial Auditing & Ledgers']
  },
  {
    name: 'Commercial & Financial Operations',
    skills: ['MS Excel (Advanced)', 'Path Solution ERP', 'Office Administration', 'Business Development']
  }
];

const MIS_CATEGORIES = [
  {
    name: 'Data Analytics & Reporting',
    skills: ['MIS Reporting & Analytics', 'MS Excel (Advanced)', 'Stock Handling & Logistics', 'MS Office (Word & PPT)']
  },
  {
    name: 'IT Systems & Hardware Infrastructure',
    skills: ['Windows OS Administration', 'Commercial Computing & Office IT Suite', 'Hardware Diagnosis & Maintenance', 'Network & Software Support']
  }
];

const OTHER_CATEGORIES = [
  {
    name: 'Strategy & Leadership',
    skills: ['Strategic Operations & Governance', 'Cross-Functional Consulting', 'Executive Problem Solving', 'Change Management & Mentorship']
  },
  {
    name: 'Operations Optimization',
    skills: ['Process Automation & Workflows', 'Vendor & Stakeholder Relations', 'Cost Optimization & Budgeting', 'Data-Driven Decision Making']
  }
];

const ACCOUNTANT_SKILLS_FLAT = ACCOUNTANT_CATEGORIES.flatMap((c) => c.skills);
const MIS_SKILLS_FLAT = MIS_CATEGORIES.flatMap((c) => c.skills);
const OTHER_SKILLS_FLAT = OTHER_CATEGORIES.flatMap((c) => c.skills);

// Backward compatibility alias for legacy event dispatches
SKILL_DATA['Computer Applications (ADCA)'] = SKILL_DATA['Commercial Computing & Office IT Suite'];

export default function SkillsSection() {
  const { activeRole, isMIS, isOther } = useRoleTab();
  const categories = isOther ? OTHER_CATEGORIES : (isMIS ? MIS_CATEGORIES : ACCOUNTANT_CATEGORIES);
  const currentSkillsFlat = isOther ? OTHER_SKILLS_FLAT : (isMIS ? MIS_SKILLS_FLAT : ACCOUNTANT_SKILLS_FLAT);
  const defaultSkill = isOther ? 'Strategic Operations & Governance' : (isMIS ? 'MIS Reporting & Analytics' : 'Tally Prime & ERP 9');

  const [userSelectedSkill, setUserSelectedSkill] = useState(null);

  // Derived selected skill: fallback to track default if current selection is outside active track
  const selectedSkill = (userSelectedSkill && currentSkillsFlat.includes(userSelectedSkill))
    ? userSelectedSkill
    : defaultSkill;

  const activeData = SKILL_DATA[selectedSkill] || SKILL_DATA[defaultSkill];
  const accentColor = isOther ? '#8B5CF6' : (isMIS ? '#3B82F6' : '#FF4D6D');

  useEffect(() => {
    const handleSelectSkill = (e) => {
      const rawSkill = e.detail?.skill;
      const skillName = rawSkill === 'Computer Applications (ADCA)' ? 'Commercial Computing & Office IT Suite' : rawSkill;
      if (skillName && SKILL_DATA[skillName]) {
        setUserSelectedSkill(skillName);
      }
    };
    window.addEventListener('select-skill', handleSelectSkill);
    return () => window.removeEventListener('select-skill', handleSelectSkill);
  }, []);


  return (
    <section id="skills" className="py-24 px-4 md:px-8 max-w-6xl mx-auto scroll-mt-28">
      {/* Section Pill Badge - Reel style */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E7E2D8] text-[#18181B] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
        02 ✦ Skills &bull; {isOther ? 'Multidisciplinary & Leadership Stack' : (isMIS ? 'Data & MIS Stack' : 'Accounting & Tax Stack')}
      </div>

      {/* Heading matching Reel t=9.5s: "What I work with" */}
      <div className="mb-8">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#18181B] tracking-tight font-['Outfit',sans-serif]">
          What I work with
        </h2>
        <p className="mt-3 text-stone-600 text-sm md:text-base max-w-xl font-normal leading-relaxed">
          {isOther
            ? 'Hover or tap any skill to inspect strategic governance, cross-functional consulting, workflow automation, and operational optimization.'
            : isMIS
            ? 'Hover or tap any skill to inspect executive MIS telemetry, advanced data modeling, government database portals, and IT infrastructure administration.'
            : 'Hover or tap any skill to inspect statutory tax compliance, double-entry Tally bookkeeping, audited financial ledgers, and commercial management.'}
        </p>
      </div>

      <div
        role="tabpanel"
        id="skills-tabpanel"
        aria-labelledby={`role-tab-skills-${activeRole}`}
        key={activeRole}
        className="animate-tab-fade grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Left Column: Categorized Pill Matrix matching Reel t=9.5s */}
        <div className="lg:col-span-7 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E2D8] shadow-md shadow-stone-900/5">
          {categories.map((cat) => (
            <div key={cat.name} className="space-y-2.5 pb-5 border-b border-[#ECE7DF] last:border-b-0 last:pb-0">
              <div
                className="text-xs font-bold uppercase tracking-wider font-mono"
                style={{ color: accentColor }}
              >
                {cat.name}
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => {
                  const isSelected = selectedSkill === skill;
                  const skillId = 'skill-' + skill.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  return (
                    <button
                      key={skill}
                      id={skillId}
                      type="button"
                      onClick={() => {
                        setUserSelectedSkill(skill);
                        soundFX.playFocusBeep();
                      }}
                      onMouseEnter={() => {
                        setUserSelectedSkill(skill);
                      }}
                      className={`scroll-mt-28 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
                        isSelected
                          ? 'bg-[#18181B] text-white shadow-md shadow-black/15 scale-105 border border-black'
                          : 'bg-[#FAF8F5] text-stone-700 hover:text-[#18181B] hover:bg-[#F2ECE4] border border-[#E7E2D8]'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Active Skill Detailed Card matching Reel t=9.5s (Dark Charcoal Card) */}
        <div className="lg:col-span-5 bg-[#18181B] text-white p-7 sm:p-9 rounded-3xl border border-stone-800 shadow-2xl relative overflow-hidden transition-all duration-300">
          {/* Subtle Ambient Glow */}
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full blur-2xl pointer-events-none"
            style={{
              backgroundColor: isOther
                ? 'rgba(139, 92, 246, 0.15)'
                : (isMIS ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 77, 109, 0.15)')
            }}
          />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-800">
            <span
              className="text-xs uppercase tracking-widest font-mono font-bold"
              style={{ color: accentColor }}
            >
              {activeData.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-stone-800 border border-stone-700 text-[10px] font-mono text-stone-300">
              Proficiency: {activeData.level}
            </span>
          </div>

          <h3 className="text-3xl font-extrabold font-['Outfit',sans-serif] tracking-tight text-white mb-1">
            {activeData.title}
          </h3>
          <p className="text-xs text-stone-400 font-medium mb-6">
            {activeData.tag}
          </p>

          {/* Points */}
          <div className="space-y-3 mb-6">
            {activeData.points.map((pt, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-300 leading-relaxed">
                <span className="shrink-0 mt-0.5" style={{ color: accentColor }}>✦</span>
                <span>{pt}</span>
              </div>
            ))}
          </div>

          {/* Proficiency progress bar */}
          <div className="pt-4 border-t border-stone-800">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-2 font-mono">
              <span>MASTERY METRIC</span>
              <span className="text-white font-bold">{activeData.level}</span>
            </div>
            <div className="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                  isOther
                    ? 'from-[#8B5CF6] to-[#C4B5FD]'
                    : (isMIS ? 'from-[#3B82F6] to-[#93C5FD]' : 'from-[#FF4D6D] to-[#FFA4B6]')
                }`}
                style={{ width: activeData.level }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

