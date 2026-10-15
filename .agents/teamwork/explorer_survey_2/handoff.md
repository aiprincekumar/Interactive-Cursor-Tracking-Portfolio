# Survey & Implementation Mapping: Skills & Experience Sections

## 1. Observation

Direct examination of target files in `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio` revealed the following current states:

### A. `src/components/SkillsSection.jsx`
- **Lines 4–156 (`SKILL_DATA`)**: Contains 14 technical software development skills (`Java`, `Python`, `C`, `C++`, `React`, `HTML`, `CSS`, `JavaScript`, `Tailwind CSS`, `Node.js`, `PostgreSQL`, `AWS`, `Docker`, `Git`).
  - Verbatim line 14: `'Oracle Certified Foundation Associate & HackerRank 5-Star Problem Solver.'`
  - Verbatim line 178: `const [selectedSkill, setSelectedSkill] = useState('Java');`
  - Verbatim line 179: `const activeData = SKILL_DATA[selectedSkill] || SKILL_DATA['Java'];`
- **Lines 158–175 (`CATEGORIES`)**:
  - `Languages`: `['Java', 'Python', 'C', 'C++']`
  - `Frontend`: `['React', 'HTML', 'CSS', 'JavaScript', 'Tailwind CSS']`
  - `Backend`: `['Node.js', 'PostgreSQL']`
  - `Tools & Cloud`: `['AWS', 'Docker', 'Git']`
- **Line 195**: Subtitle refers to *"inspect architectural focus, certifications, and production applications."*

### B. `src/components/TechMarqueeBanner.jsx`
- **Lines 3–10 (`TOP_ITEMS`)**: `['React', 'Node.js', 'PostgreSQL', 'Docker', 'Python', 'AWS']`
- **Lines 12–18 (`BOTTOM_ITEMS`)**: `['Services', 'System design', 'Cloud computing (AWS)', 'Web Development', 'Applied AI & ML']`
- **Lines 42 & 63**: Upper & lower marquee loops display butterfly icon `🦋` between tokens with -3.5° and +2.8° rotations.

### C. `src/components/ExperienceSection.jsx`
- **Lines 5–57 (`EXPERIENCES`)**: Currently contains only 3 items:
  1. `exp-01`: `'Lead Creative Developer'`, `'Independent & Studio Works'` (2024 — PRESENT)
  2. `exp-02`: `'AI Systems Engineer'`, `'Enterprise Legal & FinTech'` (2023 — 2024)
  3. `exp-03`: `'Creative Coding & WebGL'`, `'Frontend Innovations'`, `'Aditya & Labs'` (2022 — 2023)
  - Verbatim line 51: `'Trained in full-stack enterprise engineering and algorithms at Technical Hub'` (*Target legacy string for zero-tolerance removal*)
- **Lines 86–88**: Subtitle states: *"Production engineering milestones bridging interactive frontend mechanics with high-assurance AI backend systems."*
- **Lines 94–96**: Timeline badge shows: `2022 — 2026 • 4 Years of Creative Engineering`
- **Line 101**: Grid layout is `<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">`. With 6 cards, this requires responsive updating to `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`.

### D. Build & Lint Baseline Status
- `npm run build`: Exited code 0 (`vite v8.3.4 building client environment... built in 1.33s`).
- `npx oxlint`: Exited code 0 (`Found 0 warnings and 0 errors. Finished in 67ms on 31 files`).

---

## 2. Logic Chain

### Step 1: Mapping Atul Kant Verma's Skills into `SkillsSection.jsx`
The authoritative resume requirements (`ORIGINAL_REQUEST.md`) mandate 4 distinct operational and technical skill categories:
1. **Accounting & Tax** (4 skills): Tally ERP/Prime, GST Filing & Compliance, Income Tax E-Filing, Financial Auditing & Ledgers.
2. **Software & Applications** (4 skills): MS Excel (Advanced), MS Office (Word & PowerPoint), DTP Suite (Photoshop / Corel / PageMaker), Path Solution.
3. **IT Systems & Hardware** (4 skills): Windows OS Administration, Computer Applications (ADCA), Hardware Diagnosis & Maintenance, Network & Software Support.
4. **Management & Operations** (4 skills): Office Administration, Stock Handling & Logistics, MIS Reporting & Analytics, Business Development.

Default selected skill in `useState`: Update from `'Java'` to `'Tally Prime & ERP 9'` (or `'Tally Prime'`).

### Step 2: Mapping `TechMarqueeBanner.jsx`
The dual-ribbon marquee requires replacement of legacy full-stack / AWS tokens while maintaining visual energy and the `🦋` cursor separator motif:
- `TOP_ITEMS` (Tools, Software & Operating Platforms):
  `['Tally Prime', 'GST Portal', 'Income Tax E-Filing', 'MS Excel (Advanced)', 'Path Solution ERP', 'Adobe Photoshop', 'CorelDraw', 'PageMaker', 'Windows 11 OS', 'ADCA Infocity']`
- `BOTTOM_ITEMS` (Professional Services, Mission Domains & Specializations):
  `['Tax Advisory & Filing', 'Financial Accounting', 'GST Compliance & ITC', 'MIS Executive Analytics', 'Inventory & Stock Control', 'DAY-NULM Skill Mission', 'Smart Card Operations', 'Office Administration', 'Business Development']`

### Step 3: Expanding `ExperienceSection.jsx` to All 6 Authentic Roles
To properly represent Atul's career history:
- Grid container: Update to `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` to display a clean, responsive 2-row x 3-column card grid.
- Subtitle: `"Comprehensive career journey spanning financial accounting, statutory GST/Income Tax compliance, government skill mission MIS, and regional field operations."`
- Timeline Period Badge: `"2019 — 2026 • 7+ Years of Multifaceted Operations & Accounting"`
- The 6 roles structured with authentic deliverables:
  1. **GST & Income Tax Consultant / Filer** (2023 — PRESENT, 3+ Years) — Active Practice
  2. **Senior Tally Accountant** (2022 — PRESENT, 4+ Years) — Core Accounting
  3. **MIS Executive — DAY-NULM Skill India** (2021 — 2023) — Government Skill Mission
  4. **Accountant & Inventory Controller — Junks Food Agency (Path Solution)** (2020 — 2022) — FMCG Distribution
  5. **Smart Card Operations Specialist** (2019 — 2021) — 4 Districts in Bihar & Jharkhand
  6. **Computer Instructor & Academic Tutor** (2018 — 2020) — Academic & IT Training

### Step 4: Cleansing Legacy Strings
- Remove all references to `"Technical Hub"`, `"Aditya & Labs"`, `"Creative Developer"`, `"Lead Creative Developer"`, and software-only stacks from these sections.

---

## 3. Concrete Implementation Blueprint

### A. Exact Replacement Schema for `SkillsSection.jsx`

```javascript
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
  'Computer Applications (ADCA)': {
    category: 'IT Systems & Hardware',
    title: 'Computer Applications (ADCA)',
    level: '96%',
    tag: 'Diploma Certified Computing Foundations',
    points: [
      'Advance Diploma in Computer Application (ADCA) credential from Infocity Daltonganj.',
      'Comprehensive curriculum mastery: database basics, spreadsheet computing, and desktop publishing.',
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
  }
};

const CATEGORIES = [
  {
    name: 'Accounting & Tax',
    skills: ['Tally Prime & ERP 9', 'GST Filing & Compliance', 'Income Tax E-Filing', 'Financial Auditing & Ledgers']
  },
  {
    name: 'Software & Applications',
    skills: ['MS Excel (Advanced)', 'MS Office (Word & PPT)', 'DTP Design Suite', 'Path Solution ERP']
  },
  {
    name: 'IT Systems & Hardware',
    skills: ['Windows OS Administration', 'Computer Applications (ADCA)', 'Hardware Diagnosis & Maintenance', 'Network & Software Support']
  },
  {
    name: 'Management & Operations',
    skills: ['Office Administration', 'Stock Handling & Logistics', 'MIS Reporting & Analytics', 'Business Development']
  }
];
```

In `SkillsSection.jsx` state initialization:
```javascript
const [selectedSkill, setSelectedSkill] = useState('Tally Prime & ERP 9');
const activeData = SKILL_DATA[selectedSkill] || SKILL_DATA['Tally Prime & ERP 9'];
```

---

### B. Exact Replacement Schema for `TechMarqueeBanner.jsx`

```javascript
const TOP_ITEMS = [
  'Tally Prime',
  'GST Portal',
  'Income Tax E-Filing',
  'MS Excel (Advanced)',
  'Path Solution ERP',
  'Adobe Photoshop',
  'CorelDraw',
  'PageMaker',
  'Windows 11 OS',
  'ADCA Infocity',
];

const BOTTOM_ITEMS = [
  'Tax Advisory & Filing',
  'Financial Accounting',
  'GST Compliance & ITC',
  'MIS Executive Analytics',
  'Inventory & Stock Control',
  'DAY-NULM Skill Mission',
  'Smart Card Operations',
  'Office Administration',
  'Business Development',
];
```

---

### C. Exact Replacement Schema for `ExperienceSection.jsx`

```javascript
const EXPERIENCES = [
  {
    id: 'exp-01',
    period: '2023 — PRESENT',
    status: 'Active Practice (3+ Yrs)',
    role: 'GST & Income Tax Consultant',
    company: 'Independent Tax Consultancy Practice',
    location: 'Daltonganj, Jharkhand',
    description: 'Managing end-to-end statutory taxation, monthly GSTR compliance, individual and business income tax returns, and client tax advisory.',
    deliverables: [
      'Filed 100+ monthly/quarterly GSTR-1 and GSTR-3B returns with zero late-fee compliance records',
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
    period: '2022 — PRESENT',
    status: 'Core Accounting (4+ Yrs)',
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
  }
];
```

Grid container update in `ExperienceSection.jsx`:
```jsx
{/* Header period pill */}
<div className="flex items-center gap-3 bg-[#FAF8F5] px-4 py-2.5 rounded-2xl border border-[#ECE7DF] shadow-2xs self-start md:self-end">
  <Calendar className="w-4 h-4 text-[#FF4D6D]" />
  <span className="text-xs sm:text-sm font-mono font-bold text-[#18181B]">
    2018 — 2026 • 7+ Years of Multifaceted Operations &amp; Accounting
  </span>
</div>

{/* Subhead text */}
<p className="mt-3 text-stone-600 text-sm md:text-base max-w-xl font-normal leading-relaxed">
  Comprehensive career journey spanning financial accounting, statutory GST/Income Tax compliance, government skill mission MIS, and regional field operations.
</p>

{/* Responsive 2x3 Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
  {EXPERIENCES.map((exp) => { ... })}
</div>
```

---

## 4. Caveats

1. **Read-Only Explorer Mandate**: Per Explorer 2 instructions and universal rules, no source files were modified directly. All proposed code changes are detailed as drop-in ready schemas.
2. **Visual & Physics Invariance**: The interactive cursor tracking, audio sound effects (`soundFX.playPop()`, `soundFX.playFocusBeep()`), butterfly emojis `🦋`, card hover effects, and progress bars remain 100% preserved.
3. **Icons & Dependencies**: All required icons (`Briefcase`, `Calendar`, `Sparkles`, `CheckCircle2`) are already imported from `lucide-react` in `ExperienceSection.jsx`. No new external npm dependencies are required.

---

## 5. Conclusion

- The survey of `SkillsSection.jsx`, `TechMarqueeBanner.jsx`, and `ExperienceSection.jsx` is complete.
- All 16 skills across 4 domain categories are fully articulated with specific, professional, and authentic deliverables reflecting Atul Kant Verma's career.
- All 6 professional roles are fully articulated with dates, locations, organizations, deliverables, and tech stacks, fitting cleanly into a responsive 2x3 card grid.
- All legacy strings and tech mismatch (e.g., "Technical Hub") are identified with zero-tolerance elimination plans.
- The project is fully buildable and passes oxlint cleanly.

---

## 6. Verification Method

To independently verify these findings and proposed structures:

1. **Build verification**:
   ```bash
   npm run build
   ```
   Expect exit code 0 and successful chunk generation.

2. **Lint verification**:
   ```bash
   npx oxlint
   ```
   Expect 0 warnings and 0 errors across all 31 files.

3. **Legacy String Verification**:
   ```bash
   git grep -i "Technical Hub" src/
   git grep -i "Sushmita" src/
   git grep -i "Dasari" src/
   ```
   After applying the proposed changes to `ExperienceSection.jsx`, `SkillsSection.jsx`, and `TechMarqueeBanner.jsx`, no hits will originate from these files.

4. **DOM & Layout Invalidation Conditions**:
   - If `SKILL_DATA` does not contain a key present in `CATEGORIES`, a runtime TypeError will occur on selection. The proposed schema guarantees 100% key parity (16 keys).
   - If `EXPERIENCES` does not have 6 items with unique `id`s (`exp-01` to `exp-06`), card expansion or rendering will fail. The proposed schema guarantees unique IDs and complete metadata for all 6 roles.
