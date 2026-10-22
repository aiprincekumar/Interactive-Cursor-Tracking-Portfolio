/**
 * Search Catalog for Global Command Palette (Cmd+K)
 * 100% Authentic Portfolio Index for Atul Verma
 * Senior Tally Accountant & Statutory Tax Consultant | MIS & Analytics Specialist
 * 
 * Features:
 * - Dual-Track Role Tagging (role: 'accountant' | 'mis' | 'both')
 * - Ultra-Deep Micro Keyword Indexing (GST, ITR, Tally, Tools, Field Operations)
 * - Quick Actions Category (Resume, Email, WhatsApp, Maps, Physics Lab)
 * - Explicit matchType / Verification Attributes
 */

export const SEARCH_ITEMS = [
  // ==========================================
  // --- 1. QUICK ACTIONS (5 Items) ---
  // ==========================================
  {
    id: 'act-resume',
    title: '📄 Download Verified Resume (PDF)',
    category: 'Actions',
    targetId: 'hero',
    badge: 'Quick Action',
    matchType: 'Quick Action',
    role: 'both',
    actionType: 'download-resume',
    description: 'Instant 1-click download of Atul Verma\'s official verified resume dossier (PDF) with full credentials.',
    keywords: 'download resume cv biodata pdf official profile verified credentials atul verma quick actions documents print'
  },
  {
    id: 'act-email',
    title: '✉️ Send Direct Email / Contact',
    category: 'Actions',
    targetId: 'contact',
    badge: 'Quick Action',
    matchType: 'Quick Action',
    role: 'both',
    actionType: 'mailto',
    actionUrl: 'mailto:atulravi2015@gmail.com?subject=Tax%20%26%20Accounting%20Inquiry%20-%20Atul%20Verma',
    description: 'Compose an instant email to atulravi2015@gmail.com or scroll to the direct consultation inquiry form.',
    keywords: 'send email mailto atulravi2015@gmail.com contact message hire consultation write inquiry quick actions'
  },
  {
    id: 'act-whatsapp',
    title: '💬 WhatsApp Business Inquiry',
    category: 'Actions',
    targetId: 'contact',
    badge: 'Quick Action',
    matchType: 'Quick Action',
    role: 'accountant',
    actionType: 'external',
    actionUrl: 'https://wa.me/917992383804?text=Hello%20Atul%20ji%2C%20I%20would%20like%20to%20consult%20regarding%20Taxation%20%26%20Accounting%20services.',
    description: 'Open direct WhatsApp conversation (+91 7992383804) for statutory GST returns, Tally bookkeeping and tax advice.',
    keywords: 'whatsapp chat message 7992383804 phone call inquiry gst tally tax consult direct quick actions'
  },
  {
    id: 'act-maps',
    title: '📍 View Office Location on Google Maps',
    category: 'Actions',
    targetId: 'contact',
    badge: 'Quick Action',
    matchType: 'Field Location',
    role: 'both',
    actionType: 'external',
    actionUrl: 'https://maps.google.com/?q=Medininagar+Daltonganj+Palamu+Jharkhand',
    description: 'Open live Google Maps navigation directions to Atul Verma\'s office in Medininagar (Daltonganj), Palamu, Jharkhand.',
    keywords: 'office location google maps navigation directions medininagar daltonganj palamu jharkhand address map gps quick actions'
  },
  {
    id: 'act-cursor-playground',
    title: '🎯 Change Cursor Style / Physics Lab',
    category: 'Actions',
    targetId: 'playground',
    badge: 'Quick Action',
    matchType: 'Interactive Tool',
    role: 'both',
    actionType: 'scroll',
    desktopOnly: true,
    description: 'Jump to the real-time Physics Lab & Cursor Tuner to customize flight speed, spring dynamics and trail particles.',
    keywords: 'change cursor style butterfly spark trail physics lab interactive tuner playground flight speed quick actions'
  },
  {
    id: 'act-lab-drawer',
    title: '🧪 Open Quick Lab Studio Drawer',
    category: 'Actions',
    targetId: 'playground',
    badge: 'Studio Drawer',
    matchType: 'Interactive Tool',
    role: 'both',
    actionType: 'open-lab-drawer',
    description: 'Slide out the Quick Lab Studio Drawer to tune cursor scale, flight dynamics, physics gravity, presets, and 7-sound soundboard anywhere on the page.',
    keywords: 'open lab drawer quick studio controls sliders physics cursor tuning telemetry presets soundboard fab flask lab'
  },
  {
    id: 'act-theme',
    title: '🌓 Toggle Theme (Light / Dark Mode)',
    category: 'Actions',
    targetId: 'hero',
    badge: 'Quick Action',
    matchType: 'Theme Setting',
    role: 'both',
    actionType: 'toggle-theme',
    description: 'Switch between warm parchment light mode and deep luxury dark mode instantly with audio feedback.',
    keywords: 'toggle theme light dark mode night day switch color scheme appearance display'
  },
  {
    id: 'act-role-overview',
    title: '🧭 Switch Track: Executive Overview',
    category: 'Actions',
    targetId: 'hero',
    badge: 'Role Track',
    matchType: 'Track Switcher',
    role: 'overview',
    actionType: 'switch-role',
    description: 'Switch portfolio view to the Executive Overview track combining curated Accountant and MIS highlights.',
    keywords: 'switch role overview track executive dual domain finance data operations portfolio summary'
  },
  {
    id: 'act-role-accountant',
    title: '💼 Switch Track: Accountant & Tax Consultant',
    category: 'Actions',
    targetId: 'hero',
    badge: 'Role Track',
    matchType: 'Track Switcher',
    role: 'accountant',
    actionType: 'switch-role',
    description: 'Switch portfolio view to Statutory Accounting, Tally Prime, GST, ITR and BRS reconciliations.',
    keywords: 'switch role accountant tax tally gst itr statutory compliance double entry bookkeeping'
  },
  {
    id: 'act-role-mis',
    title: '📊 Switch Track: MIS & Data Analytics',
    category: 'Actions',
    targetId: 'hero',
    badge: 'Role Track',
    matchType: 'Track Switcher',
    role: 'mis',
    actionType: 'switch-role',
    description: 'Switch portfolio view to MIS reporting, Advanced Excel, DAY-NULM government mission and biometric analytics.',
    keywords: 'switch role mis data analytics excel reporting operations day-nulm biometric database'
  },
  {
    id: 'act-role-vibe',
    title: '⚡ Switch Track: Vibe Coding (AI-Native Prototyping)',
    category: 'Actions',
    targetId: 'hero',
    badge: 'Role Track',
    matchType: 'Track Switcher',
    role: 'vibe_coding',
    actionType: 'switch-role',
    description: 'Switch portfolio view to AI Prompt-to-Code architecture, Cursor, Windsurf, Claude Code, autonomous agents & rapid MVP engineering.',
    keywords: 'switch role vibe coding vibe coder ai rapid prototyping cursor windsurf claude code llm autonomous agents fullstack saas'
  },
  {
    id: 'act-role-other',
    title: '🤖 Switch Track: Other ✨ AI (Controller & BI)',
    category: 'Actions',
    targetId: 'hero',
    badge: 'Role Track',
    matchType: 'Track Switcher',
    role: 'other',
    actionType: 'switch-role',
    description: 'Switch portfolio view to AI-synthesized Business Intelligence & Corporate Controller specialization.',
    keywords: 'switch role other ai corporate controller bi power bi statutory strategy financial controls'
  },

  // ==========================================
  // --- 2. SECTIONS / NAVIGATION (10 Items) ---
  // ==========================================
  {
    id: 'sec-hero',
    title: 'Home / Hero',
    category: 'Sections',
    targetId: 'hero',
    badge: 'Section',
    matchType: 'Portfolio Section',
    role: 'both',
    description: 'Interactive cursor-tracking character hero with photo capture, physics and professional overview',
    keywords: 'hero home top header cursor tracking avatar camera photo atul verma senior accountant daltonganj'
  },
  {
    id: 'sec-about',
    title: 'About Me / Who I Am',
    category: 'Sections',
    targetId: 'about',
    badge: 'Section',
    matchType: 'Portfolio Section',
    role: 'both',
    description: 'Executive story, official bio-data dossier, qualifications & core fiscal competencies in Daltonganj, Palamu',
    keywords: 'about me story education who i am background biography adca infocity daltonganj biodata bio-data qualifications vision competencies'
  },
  {
    id: 'sec-biodata',
    title: 'Official Bio-Data / Personal Dossier',
    category: 'Sections',
    targetId: 'about',
    tab: 'biodata',
    badge: 'Verified Dossier',
    matchType: 'Demographics',
    role: 'both',
    description: 'Verified candidate demographics, father\'s name, permanent address in Medininagar, year of birth (1991), date of birth and languages.',
    keywords: 'biodata personal dossier demographics address father name year of birth yob 1991 date of birth dob marital status languages hindi english about'
  },
  {
    id: 'sec-skills',
    title: 'Core Expertise / Skills Matrix',
    category: 'Sections',
    targetId: 'skills',
    badge: 'Section',
    matchType: 'Portfolio Section',
    role: 'both',
    description: 'Categorized technical stacks: Accounting & Tax, Software & Applications, IT Systems & Operations',
    keywords: 'skills core expertise tech stack proficiency accounting tally gst itr excel dtp erp hardware networking'
  },
  {
    id: 'sec-projects',
    title: 'Featured Projects / Selected Work',
    category: 'Sections',
    targetId: 'projects',
    badge: 'Section',
    matchType: 'Portfolio Section',
    role: 'both',
    description: 'Curated compliance verification engine, Tally accounting architecture & government MIS systems',
    keywords: 'projects selected work case studies compliance gst tax tally mis smart card rsby'
  },
  {
    id: 'sec-experience',
    title: 'Professional Journey / Experience',
    category: 'Sections',
    targetId: 'experience',
    badge: 'Section',
    matchType: 'Portfolio Section',
    role: 'both',
    description: '7+ years career milestones: Tax consultancy, senior accountant, DAY-NULM MIS & field operations',
    keywords: 'experience work jobs career history timeline trajectory roles gst tally mis smart card instructor'
  },
  {
    id: 'sec-achievements',
    title: 'Milestones & Professional Records',
    category: 'Sections',
    targetId: 'achievements',
    badge: 'Section',
    matchType: 'Portfolio Section',
    role: 'both',
    description: '7+ years audit records, 500+ tax filings, ₹2.5Cr+ reconciled ITC and 50k+ citizen card rollouts',
    keywords: 'achievements milestones records certifications tally gst tax smart card credentials numbers records'
  },
  {
    id: 'sec-gallery',
    title: 'Polaroid Studio / Gallery',
    category: 'Sections',
    targetId: 'gallery',
    badge: 'Section',
    matchType: 'Portfolio Section',
    role: 'both',
    description: 'Camera roll memories, snapshot cards & interactive stickers studio',
    keywords: 'gallery polaroid photos camera roll memories snapshots studio pictures camera memories'
  },
  {
    id: 'sec-playground',
    title: 'Physics Lab / Cursor Tuner',
    category: 'Sections',
    targetId: 'playground',
    badge: 'Section',
    matchType: 'Portfolio Section',
    role: 'both',
    description: 'Real-time cursor kinematics, particle speed & spring physics tuner playground',
    keywords: 'lab playground physics tuner butterfly speed trail scale controls kinematics physics'
  },
  {
    id: 'sec-faq',
    title: 'FAQ / Frequently Asked Questions',
    category: 'Sections',
    targetId: 'faq',
    badge: 'Section',
    matchType: 'Portfolio Section',
    role: 'both',
    description: 'Bilingual knowledge base: Hiring notice, GST compliance, remote setup, MVP turnaround & matrimonial queries',
    keywords: 'faq questions answers help knowledge base gst notice turnaround mvp recruiter client marriage polymath'
  },
  {
    id: 'sec-contact',
    title: 'Contact / Office Inquiry',
    category: 'Sections',
    targetId: 'contact',
    tab: 'touch',
    badge: 'Section',
    matchType: 'Portfolio Section',
    role: 'both',
    description: 'Direct consultation inquiry form, email (atulravi2015@gmail.com) & Daltonganj office location',
    keywords: 'contact get in touch email atulravi2015@gmail.com location message hire form inquiry address medininagar daltonganj phone'
  },
  {
    id: 'sec-direct',
    title: 'Direct Channel / WhatsApp & Email',
    category: 'Sections',
    targetId: 'contact',
    tab: 'direct',
    badge: 'Direct Channel',
    matchType: 'Contact Channel',
    role: 'both',
    description: 'Direct priority WhatsApp (+91 7992383804), email, and professional social profiles.',
    keywords: 'direct channel whatsapp chat email phone call priority atulravi2015@gmail.com 7992383804 instant connect'
  },
  {
    id: 'sec-location',
    title: 'Location & Office Map / Medininagar HQ',
    category: 'Sections',
    targetId: 'contact',
    tab: 'location',
    badge: 'Medininagar HQ',
    matchType: 'Office Location',
    role: 'both',
    description: 'Interactive map, headquarters address in Daltonganj (Medininagar), Jharkhand, with zoom controls and directions.',
    keywords: 'location office map medininagar daltonganj palamau jharkhand directions address zoom map interactive gps headquarters'
  },

  // ==========================================
  // --- 3. FEATURED PROJECTS (4 Items) ---
  // ==========================================
  {
    id: 'proj-gst-tax',
    title: 'GST & Income Tax Compliance & Verification Engine',
    category: 'Projects',
    targetId: 'proj-gst-tax',
    badge: '01 Flagship',
    matchType: 'Project Deliverable',
    role: 'accountant',
    description: 'Comprehensive taxation & statutory compliance system covering GSTR-1, 3B, 9, ITC-2B, GSTR-2A & ITR-1 to 4 with automated reconciliation.',
    keywords: 'gst income tax compliance verification engine gstr-1 gstr-3b gstr-9 itc-2b gstr-2a section 80c tds advance tax audit report cash book trial balance balance sheet e-way bill hsn code statutory'
  },
  {
    id: 'proj-tally-accounting',
    title: 'Tally Financial Accounting & Inventory Management',
    category: 'Projects',
    targetId: 'proj-tally-accounting',
    badge: '02 Flagship',
    matchType: 'Project Deliverable',
    role: 'accountant',
    description: 'Complete double-entry accounting architecture in Tally Prime & ERP 9, multi-company ledger hierarchies, BRS, inventory FIFO batches & Balance Sheet.',
    keywords: 'tally financial accounting inventory management tally prime erp 9 balance sheet profit and loss p&l trial balance brs bank reconciliation ledgers stock valuation cash book audit report'
  },
  {
    id: 'proj-day-nulm',
    title: 'DAY-NULM Skill India MIS Reporting Portal',
    category: 'Projects',
    targetId: 'proj-day-nulm',
    badge: '03 Operations',
    matchType: 'Project Deliverable',
    role: 'mis',
    description: 'Centralized government MIS database & candidate tracking system for Skill India urban training mission batches, biometric logs & certification.',
    keywords: 'day-nulm skill india mis reporting portal database candidate tracking biometric attendance batch certification government analytics daltonganj palamu'
  },
  {
    id: 'proj-smart-card',
    title: 'Multi-District Smart Card Operations & Enrollment Engine',
    category: 'Projects',
    targetId: 'proj-smart-card',
    badge: '04 Field Ops',
    matchType: 'Project Deliverable',
    role: 'mis',
    description: 'Identity and smart card deployment across 4 districts (Palamu, Garhwa, Latehar, Chatra) with citizen biometric workflows and RSBY / UIDAI sync.',
    keywords: 'multi-district smart card operations enrollment engine 4 districts palamu garhwa latehar chatra rsby uidai aadhaar sync kyc identity field operations hardware'
  },
  {
    id: 'proj-enterprise-transformation',
    title: 'Executive Power BI Fiscal Intelligence & Reconciliation Engine',
    category: 'Projects',
    targetId: 'proj-enterprise-transformation',
    badge: '05 Controller',
    matchType: 'Project Deliverable',
    role: 'other',
    description: 'Executive business intelligence architecture unifying multi-company accounting ledgers, automated bank feeds, and statutory GST compliance pipelines into real-time Power BI fiscal dashboards.',
    keywords: 'executive power bi fiscal intelligence reconciliation engine enterprise workflow transformation multi-entity general ledger variance detection cash flow margin analytics corporate controller other ai'
  },
  {
    id: 'proj-business-advisory',
    title: 'Corporate Financial Controls & Internal Audit Governance',
    category: 'Projects',
    targetId: 'proj-business-advisory',
    badge: '06 Governance',
    matchType: 'Project Deliverable',
    role: 'other',
    description: 'Institutional internal financial control framework automating GSTR-2B vs ERP purchase matching, advance tax liability forecasting, vendor withholding tax governance, and institutional audit trails.',
    keywords: 'corporate financial controls internal audit governance statutory tax strategy working capital modeling audit trails risk governance zero notice corporate controller other ai'
  },

  {
    id: 'proj-ai-saas-generator',
    title: 'AI Prompt-to-Fullstack SaaS Generator',
    category: 'Projects',
    targetId: 'proj-ai-saas-generator',
    badge: '07 AI Builder',
    matchType: 'Project Deliverable',
    role: 'vibe_coding',
    description: 'Autonomous zero-to-one code generation pipeline turning natural language specs into production-ready fullstack web applications with authentication, DB schemas, and responsive UI.',
    keywords: 'ai prompt fullstack saas generator vibe coding cursor windsurf claude 3.7 nextjs supabase fast prototyping mvp autonomous coding'
  },
  {
    id: 'proj-agent-workflow-engine',
    title: 'Autonomous Multi-Agent Workflow Engine',
    category: 'Projects',
    targetId: 'proj-agent-workflow-engine',
    badge: '08 Agent Loops',
    matchType: 'Project Deliverable',
    role: 'vibe_coding',
    description: 'Multi-agent orchestration harness running iterative feedback loops, autonomous self-debugging, code quality gates, and automated test execution.',
    keywords: 'autonomous multi-agent workflow engine agentic loops self debugging verification quality gates devfleet langchain tool calling vibe coding'
  },
  {
    id: 'proj-doc-code-synthesizer',
    title: 'Real-Time AI Document & Code Synthesizer',
    category: 'Projects',
    targetId: 'proj-doc-code-synthesizer',
    badge: '09 Synthesizer',
    matchType: 'Project Deliverable',
    role: 'vibe_coding',
    description: 'Hybrid multimodal document reasoning & instant code synthesis tool parsing PDFs, spreadsheets, and bank statements into validated schemas and API endpoints.',
    keywords: 'real-time ai document code synthesizer multimodal reasoning parsing ocr schemas api endpoints streaming vibe coder llm fast engineering'
  },

  // ==========================================
  // --- 4. CORE EXPERTISE & MICRO-INDEXED SKILLS (23 Items) ---
  // ==========================================
  // Category 1: Accounting & Tax (Statutory Compliance & Micro-Records)
  {
    id: 'skill-tally-prime-erp-9',
    title: 'Tally Prime & Tally ERP 9',
    category: 'Skills',
    targetId: 'skill-tally-prime-erp-9',
    skillKey: 'Tally Prime & ERP 9',
    badge: 'Accounting (98%)',
    matchType: 'Software Tool',
    role: 'accountant',
    description: 'Company creation, chart of accounts, multi-ledger hierarchy, voucher entry, inventory FIFO tracking & Balance Sheet finalization.',
    keywords: 'tally prime tally erp 9 accounting ledgers vouchers inventory balance sheet trial balance profit & loss double entry cash book audit report'
  },
  {
    id: 'skill-gst-filing-compliance',
    title: 'GST Return Filing (GSTR-1, GSTR-3B, GSTR-9)',
    category: 'Skills',
    targetId: 'skill-gst-filing-compliance',
    skillKey: 'GST Filing & Compliance',
    badge: 'Taxation (96%)',
    matchType: 'Statutory Compliance',
    role: 'accountant',
    description: 'Monthly/quarterly GSTR-1 outward returns, GSTR-3B tax computation, cash ledger offset, GSTR-9 annual returns, e-way bills & e-invoicing.',
    keywords: 'gst return filing gstr-1 gstr-3b gstr-9 gstr-2a itc-2b indirect tax returns tax computation cash ledger e-way bill e-invoicing itc reconciliation hsn code'
  },
  {
    id: 'skill-itc-2b-reconciliation',
    title: 'ITC-2B & GSTR-2A Automated Tax Reconciliation',
    category: 'Skills',
    targetId: 'skill-gst-filing-compliance',
    skillKey: 'GST Filing & Compliance',
    badge: 'Taxation (97%)',
    matchType: 'Statutory Compliance',
    role: 'accountant',
    description: 'Algorithmic matching of purchase register ledgers against auto-drafted ITC-2B and GSTR-2A statements, identifying invoice mismatches & ineligible credits.',
    keywords: 'itc-2b itc 2b gstr-2a gstr 2a input tax credit reconciliation purchase register mismatch ineligible itc 2b reverse charge gst portal'
  },
  {
    id: 'skill-income-tax-e-filing',
    title: 'Income Tax E-Filing (ITR-1 to ITR-4) & AIS/26AS',
    category: 'Skills',
    targetId: 'skill-income-tax-e-filing',
    skillKey: 'Income Tax E-Filing',
    badge: 'Taxation (94%)',
    matchType: 'Statutory Compliance',
    role: 'accountant',
    description: 'ITR-1 (Sahaj), ITR-2, ITR-4 (Sugam), Form 26AS/AIS reconciliation, Section 80C deductions, Section 115BAC regime comparison & advance tax computations.',
    keywords: 'income tax e-filing itr-1 itr-2 itr-3 itr-4 direct tax ais 26as advance tax tax audit deduction section 80c 115bac returns challan 280'
  },
  {
    id: 'skill-tds-tcs-advance-tax',
    title: 'TDS, TCS & Advance Tax Computations (Section 80C)',
    category: 'Skills',
    targetId: 'skill-income-tax-e-filing',
    skillKey: 'Income Tax E-Filing',
    badge: 'Tax Compliance',
    matchType: 'Statutory Compliance',
    role: 'accountant',
    description: 'Tax Deducted at Source (TDS), TCS, quarterly Advance Tax estimation under Section 208/209, Challan 280/281 payment and Section 80C fiscal deductions.',
    keywords: 'tds tcs advance tax computation section 80c 80d challan 280 challan 281 form 16 form 16a tax deduction at source fiscal planning'
  },
  {
    id: 'skill-financial-auditing-ledgers',
    title: 'Financial Auditing & Ledgers (BRS & Cash Book)',
    category: 'Skills',
    targetId: 'skill-financial-auditing-ledgers',
    skillKey: 'Financial Auditing & Ledgers',
    badge: 'Auditing (95%)',
    matchType: 'Statutory Compliance',
    role: 'accountant',
    description: 'General ledgers, cash book & day book scrutiny, Bank Reconciliation Statements (BRS), debtor aging & year-end provisions.',
    keywords: 'financial auditing ledgers brs bank reconciliation statement day book cash book debtors creditors statutory audit balance sheet verification audit report'
  },
  {
    id: 'skill-trial-balance-finalization',
    title: 'Trial Balance, Profit & Loss and Balance Sheet',
    category: 'Skills',
    targetId: 'skill-financial-auditing-ledgers',
    skillKey: 'Financial Auditing & Ledgers',
    badge: 'Auditing (96%)',
    matchType: 'Statutory Compliance',
    role: 'accountant',
    description: 'Complete year-end financial finalization: balancing Trial Balance, preparing Profit & Loss (P&L) statements, depreciation schedules and audited Balance Sheets.',
    keywords: 'trial balance profit & loss profit and loss p&l balance sheet financial statements depreciation schedule closing entries year-end audit report'
  },
  {
    id: 'skill-stock-valuation-eway-hsn',
    title: 'Stock Valuation, E-Way Bill & HSN Code Compliance',
    category: 'Skills',
    targetId: 'skill-stock-handling-logistics',
    skillKey: 'Stock Handling & Logistics',
    badge: 'Trade Compliance',
    matchType: 'Statutory Compliance',
    role: 'accountant',
    description: 'FIFO inventory valuation, generating multi-vehicle E-Way Bills, assigning accurate 4/6/8-digit HSN codes and managing interstate logistics compliance.',
    keywords: 'stock valuation e-way bill eway bill hsn code hsn codes sac code fifo dispatch inventory valuation interstate dispatch logistics'
  },

  // Category 2: Software & Applications (Tools & Digital Stacks)
  {
    id: 'skill-ms-excel-advanced',
    title: 'Microsoft Excel (VLOOKUP, HLOOKUP, Pivot Table, Dashboards)',
    category: 'Skills',
    targetId: 'skill-ms-excel-advanced',
    skillKey: 'MS Excel (Advanced)',
    badge: 'Analytics (97%)',
    matchType: 'Software Tool',
    role: 'mis',
    description: 'XLOOKUP, VLOOKUP, HLOOKUP, INDEX/MATCH, Pivot Tables, conditional formulas, financial modeling, dynamic slicers & data analytics.',
    keywords: 'microsoft excel ms excel vlookup hlookup pivot table pivot tables dashboards financial modeling data analysis formulas index match what-if'
  },
  {
    id: 'skill-ms-office-word-ppt',
    title: 'MS Office Suite (Word, PowerPoint & Outlook)',
    category: 'Skills',
    targetId: 'skill-ms-office-word-ppt',
    skillKey: 'MS Office (Word & PPT)',
    badge: 'Office (96%)',
    matchType: 'Software Tool',
    role: 'mis',
    description: 'Official memos, executive correspondence, mail merge in Word, corporate pitch presentations & visual decks in PowerPoint.',
    keywords: 'ms office word powerpoint documentation presentations memo mail merge pitch deck reporting outlook typing'
  },
  {
    id: 'skill-dtp-design-suite',
    title: 'DTP Suite (Photoshop 7.0, PageMaker 7.0, CorelDraw X7)',
    category: 'Skills',
    targetId: 'skill-dtp-design-suite',
    skillKey: 'DTP Design Suite',
    badge: 'Publishing (92%)',
    matchType: 'Software Tool',
    role: 'mis',
    description: 'Commercial layout design in Photoshop 7.0, vector graphics & logos in CorelDraw X7, publication formatting & Hindi/English typesetting in PageMaker 7.0.',
    keywords: 'dtp desktop publishing photoshop 7.0 coreldraw x7 pagemaker 7.0 graphic design printing typesetting brochures banners book layout'
  },
  {
    id: 'skill-path-solution-erp',
    title: 'Path Solution ERP (Wholesale Billing & POS)',
    category: 'Skills',
    targetId: 'skill-path-solution-erp',
    skillKey: 'Path Solution ERP',
    badge: 'ERP Tech (94%)',
    matchType: 'Software Tool',
    role: 'accountant',
    description: 'High-frequency wholesale invoicing, retail POS billing, distributor inventory control, batch expiry tracking & vendor ledger settlement.',
    keywords: 'path solution erp fmcg inventory wholesale billing retail pos billing distributor accounts settlement pos terminal'
  },

  // Category 3: IT Systems & Hardware
  {
    id: 'skill-windows-os-administration',
    title: 'Windows 10 / 11 OS Administration',
    category: 'Skills',
    targetId: 'skill-windows-os-administration',
    skillKey: 'Windows OS Administration',
    badge: 'Systems (95%)',
    matchType: 'Software Tool',
    role: 'mis',
    description: 'Clean deployment of Windows 10/11 Pro, user account policies, backup routines, disk partitioning & security hardening.',
    keywords: 'windows 10 windows 11 windows os administration windows pro user accounts policies disk partitioning drivers security maintenance'
  },
  {
    id: 'skill-computer-applications-adca',
    title: 'Commercial Computing & Office IT Suite (ADCA Certified)',
    category: 'Skills',
    targetId: 'skill-computer-applications-adca',
    skillKey: 'Commercial Computing & Office IT Suite',
    badge: 'Diploma (96%)',
    matchType: 'Verified Skill',
    role: 'mis',
    description: 'Advance Diploma certified computing, bilingual data processing (Hindi & English typing), e-governance & digital workflows.',
    keywords: 'computer applications adca infocity daltonganj diploma hindi english typing e-governance computing diploma certified commercial computing'
  },
  {
    id: 'skill-hardware-diagnosis-maintenance',
    title: 'Hardware Diagnostics & Maintenance',
    category: 'Skills',
    targetId: 'skill-hardware-diagnosis-maintenance',
    skillKey: 'Hardware Diagnosis & Maintenance',
    badge: 'Hardware (92%)',
    matchType: 'Verified Skill',
    role: 'mis',
    description: 'Workstation assembly, SMPS power testing, motherboard triage, RAM/SSD upgrades, thermal paste & BIOS/UEFI setup.',
    keywords: 'hardware diagnosis maintenance workstation assembly smps ram ssd motherboard bios repair troubleshooting pc build'
  },
  {
    id: 'skill-network-software-support',
    title: 'Network & Software Support (LAN & Multi-User Tally)',
    category: 'Skills',
    targetId: 'skill-network-software-support',
    skillKey: 'Network & Software Support',
    badge: 'Networking (90%)',
    matchType: 'Verified Skill',
    role: 'mis',
    description: 'LAN setup, Ethernet crimping, router/switch configuration, network printer sharing, multi-user Tally Prime & AnyDesk support.',
    keywords: 'network software support lan ethernet router switch printer sharing tally multi-user anydesk teamviewer troubleshooting wifi'
  },

  // Category 4: Government Operations & Field Deployments
  {
    id: 'skill-day-nulm-portal',
    title: 'DAY-NULM & Skill India MIS Portal Operations',
    category: 'Skills',
    targetId: 'skill-mis-reporting-analytics',
    skillKey: 'MIS Reporting & Analytics',
    badge: 'Government MIS',
    matchType: 'Project Deliverable',
    role: 'mis',
    description: 'Direct entry, verification and syncing on National Urban Livelihoods Mission (DAY-NULM) & Skill India central MIS databases.',
    keywords: 'day-nulm skill india mis portal government database candidate tracking biometric log urban livelihoods mission palamu daltonganj'
  },
  {
    id: 'skill-smart-card-rsby-biometric',
    title: 'RSBY & Smart Card Biometric Enrollment (UIDAI / Aadhaar)',
    category: 'Skills',
    targetId: 'skill-office-administration',
    skillKey: 'Office Administration',
    badge: 'Field Operations',
    matchType: 'Project Deliverable',
    role: 'mis',
    description: 'Rashtriya Swasthya Bima Yojana (RSBY) smart card programming, fingerprint optical scanning, UIDAI / Aadhaar biometric authentication.',
    keywords: 'smart card rsby biometric enrollment uidai aadhaar sync rashtriya swasthya bima yojana fingerprint scanner card issuance'
  },
  {
    id: 'skill-regional-field-locations',
    title: 'Regional Field Operations (Daltonganj, Garhwa, Latehar, Chatra, Palamu)',
    category: 'Skills',
    targetId: 'skill-office-administration',
    skillKey: 'Office Administration',
    badge: 'Field Network',
    matchType: 'Field Location',
    role: 'both',
    description: 'Extensive on-ground field execution, government mission deployments and tax consultancy across Palamu, Garhwa, Latehar, Chatra & Daltonganj.',
    keywords: 'daltonganj garhwa latehar chatra palamu bihar jharkhand medininagar rohtas field operations regional network locations district'
  },
  {
    id: 'skill-office-administration',
    title: 'Office Administration & Clerical Protocols',
    category: 'Skills',
    targetId: 'skill-office-administration',
    skillKey: 'Office Administration',
    badge: 'Operations (95%)',
    matchType: 'Verified Skill',
    role: 'mis',
    description: 'Supervision of day-to-day office workflows, document registry, petty cash, utility budgeting & vendor liaison.',
    keywords: 'office administration protocols document registry petty cash budgeting attendance vendor management clerical supervision'
  },
  {
    id: 'skill-stock-handling-logistics',
    title: 'Stock Handling & Store Inventory (FIFO)',
    category: 'Skills',
    targetId: 'skill-stock-handling-logistics',
    skillKey: 'Stock Handling & Logistics',
    badge: 'Logistics (94%)',
    matchType: 'Verified Skill',
    role: 'accountant',
    description: 'Physical inventory verification, warehouse stock layout for FIFO dispatch, damaged stock claim filing & zero-stockout management.',
    keywords: 'stock handling store inventory warehousing physical audits fifo dispatch logistics shrinkage control reorder stock valuation'
  },
  {
    id: 'skill-mis-reporting-analytics',
    title: 'MIS Reporting & Executive Analytics',
    category: 'Skills',
    targetId: 'skill-mis-reporting-analytics',
    skillKey: 'MIS Reporting & Analytics',
    badge: 'Analytics (96%)',
    matchType: 'Verified Skill',
    role: 'mis',
    description: 'Executive MIS reports, sales trend analysis, product category margins, debtor aging & government skill mission KPIs.',
    keywords: 'mis reporting executive analytics kpi dashboards sales trends margins debtor aging data analytics reports'
  },
  {
    id: 'skill-business-development',
    title: 'Business Development & Client Relations',
    category: 'Skills',
    targetId: 'skill-business-development',
    skillKey: 'Business Development',
    badge: 'Growth (91%)',
    matchType: 'Verified Skill',
    role: 'both',
    description: 'Client onboarding for accounting & tax services, commercial fee negotiations, retail network relations & ethical advisory.',
    keywords: 'business development client relations client acquisition tax consultancy customer retention commercial negotiation growth'
  },

  // Category 4: Corporate Controller & Executive BI (Other ✨ AI Track)
  {
    id: 'skill-power-bi-fiscal-dashboards',
    title: 'Power BI & Fiscal Dashboards (DAX Modeling & Telemetry)',
    category: 'Skills',
    targetId: 'skill-power-bi-fiscal-dashboards',
    skillKey: 'Power BI & Fiscal Dashboards',
    badge: 'BI & Analytics (98%)',
    matchType: 'Software Tool',
    role: 'other',
    description: 'Interactive executive dashboards in Power BI connecting live ERP databases with real-time financial metrics, DAX measures, variance analysis, and cash flow forecasting.',
    keywords: 'power bi fiscal dashboards dax measures financial modeling business intelligence live erp data variance analysis cash flow forecasting executive telemetry other ai'
  },
  {
    id: 'skill-multi-entity-ledger-consolidation',
    title: 'Multi-Entity Ledger Consolidation & Group Trial Balance',
    category: 'Skills',
    targetId: 'skill-multi-entity-ledger-consolidation',
    skillKey: 'Multi-Entity Ledger Consolidation',
    badge: 'Consolidation (97%)',
    matchType: 'Statutory Compliance',
    role: 'other',
    description: 'Inter-company transaction netting, elimination of duplicate balances, unified chart of accounts, and group-level Trial Balance and Balance Sheet finalization.',
    keywords: 'multi-entity ledger consolidation group trial balance inter-company transaction netting unified chart of accounts consolidated balance sheet statutory compliance other ai'
  },
  {
    id: 'skill-automated-erp-banking-pipelines',
    title: 'Automated ERP & Banking Pipelines (Real-Time Ingestion)',
    category: 'Skills',
    targetId: 'skill-automated-erp-banking-pipelines',
    skillKey: 'Automated ERP & Banking Pipelines',
    badge: 'Automation (96%)',
    matchType: 'Software Tool',
    role: 'other',
    description: 'Automated Bank Reconciliation Statement (BRS) pipelines reconciling corporate accounts daily, POS-to-Tally ledger scripts, and zero-error voucher batches.',
    keywords: 'automated erp banking pipelines api integration automated brs bank reconciliation pos invoicing tally ledgers journal voucher batches cash ledger other ai'
  },
  {
    id: 'skill-statutory-tax-strategy-audits',
    title: 'Statutory Tax Strategy & Audits (Section 115BAC & 44AB)',
    category: 'Skills',
    targetId: 'skill-statutory-tax-strategy-audits',
    skillKey: 'Statutory Tax Strategy & Audits',
    badge: 'Tax Strategy (98%)',
    matchType: 'Statutory Compliance',
    role: 'other',
    description: 'Strategic corporate income tax and GST optimization, automated GSTR-2B ITC recovery, Section 44AB audit dossiers, and advance tax scheduling.',
    keywords: 'statutory tax strategy audits corporate tax 115bac gstr-2b itc audits tax audit section 44ab advance tax tds optimization compliance risk mitigation other ai'
  },
  {
    id: 'skill-working-capital-liquidity-modeling',
    title: 'Working Capital & Liquidity Modeling (13-Week Cash Flow)',
    category: 'Skills',
    targetId: 'skill-working-capital-liquidity-modeling',
    skillKey: 'Working Capital & Liquidity Modeling',
    badge: 'Treasury (94%)',
    matchType: 'Verified Skill',
    role: 'other',
    description: 'Rolling 13-week cash flow forecasts, debtor days (DSO) reduction, inventory turnover optimization, and credit facility monitoring.',
    keywords: 'working capital liquidity modeling 13-week cash flow treasury debtor collections dso reduction credit facilities cash runway stress testing other ai'
  },
  {
    id: 'skill-executive-kpi-variance-analytics',
    title: 'Executive KPI & Variance Analytics (EBITDA & Margins)',
    category: 'Skills',
    targetId: 'skill-executive-kpi-variance-analytics',
    skillKey: 'Executive KPI & Variance Analytics',
    badge: 'Executive Analytics (96%)',
    matchType: 'Verified Skill',
    role: 'other',
    description: 'Continuous cost variance analysis against budgeted standards, executive EBITDA and contribution margin dashboards, and board presentations.',
    keywords: 'executive kpi variance analytics ebitda contribution margin overhead ratios cost overruns operational metrics board presentations strategic guidance other ai'
  },
  {
    id: 'skill-internal-audit-trail-engineering',
    title: 'Internal Audit Trail Engineering (MCA Governance Compliance)',
    category: 'Skills',
    targetId: 'skill-internal-audit-trail-engineering',
    skillKey: 'Internal Audit Trail Engineering',
    badge: 'Governance (95%)',
    matchType: 'Statutory Compliance',
    role: 'other',
    description: 'Immutable audit trail architecture complying with MCA mandates, transaction modification logging, authorization timestamps, and forensic ledger scrutiny.',
    keywords: 'internal audit trail engineering mca corporate governance immutable audit trails transaction modification logs forensic ledger scrutiny statutory inspections other ai'
  },
  {
    id: 'skill-corporate-financial-controls',
    title: 'Corporate Financial Controls & Risk Governance',
    category: 'Skills',
    targetId: 'skill-corporate-financial-controls',
    skillKey: 'Corporate Financial Controls',
    badge: 'Governance (97%)',
    matchType: 'Statutory Compliance',
    role: 'other',
    description: 'Internal financial controls, multi-level authorization workflows, compliance risk matrices, and enterprise fiscal governance.',
    keywords: 'corporate financial controls risk governance authorization workflows compliance risk matrices enterprise fiscal governance internal control framework other ai'
  },

  // Category 5: Vibe Coding & AI-Native Prototyping (Vibe Coder Track)
  {
    id: 'skill-cursor-windsurf-ides',
    title: 'Cursor & Windsurf IDEs (Agentic Workflows)',
    category: 'Skills',
    targetId: 'skill-cursor-windsurf-ides',
    skillKey: 'Cursor & Windsurf IDEs',
    badge: 'AI IDE (98%)',
    matchType: 'Software Tool',
    role: 'vibe_coding',
    description: 'Autonomous composer mode, multi-file agentic code generation, context indexing (.cursorrules), and real-time prompt-driven iteration.',
    keywords: 'cursor windsurf ides composer mode agentic prompt to code ai pair programming context rules vibe coding'
  },
  {
    id: 'skill-claude-code-agent-loops',
    title: 'Claude Code & Autonomous Loops (CLI Agentics)',
    category: 'Skills',
    targetId: 'skill-claude-code-agent-loops',
    skillKey: 'Claude Code & Agent Loops',
    badge: 'Autonomous (96%)',
    matchType: 'Software Tool',
    role: 'vibe_coding',
    description: 'Terminal agent harnessing, autonomous self-debugging loops, subagent delegation, quality gates, and automated test-driven fixes.',
    keywords: 'claude code autonomous loops cli agentics terminal subagents self debugging anthropic tdd vibe coding'
  },
  {
    id: 'skill-next-js-14-react-ecosystem',
    title: 'Next.js 14 & React Modern Ecosystem (App Router)',
    category: 'Skills',
    targetId: 'skill-next-js-14-react-ecosystem',
    skillKey: 'Next.js 14 & Modern React',
    badge: 'Fullstack (94%)',
    matchType: 'Software Tool',
    role: 'vibe_coding',
    description: 'App Router architecture, Server Actions, modern Tailwind styling, dynamic streaming, and fullstack reactive frontend systems.',
    keywords: 'nextjs 14 react modern app router server actions tailwind css typescript fullstack ui vibe coding'
  },
  {
    id: 'skill-supabase-cloud-backend',
    title: 'Supabase & Rapid Cloud Backends (Postgres & Auth)',
    category: 'Skills',
    targetId: 'skill-supabase-cloud-backend',
    skillKey: 'Supabase & Rapid Backends',
    badge: 'Backend (95%)',
    matchType: 'Software Tool',
    role: 'vibe_coding',
    description: 'Instant Postgres schema design, Row-Level Security (RLS), edge functions, authentication pipelines, and real-time subscriptions.',
    keywords: 'supabase rapid cloud backend postgres rls row level security auth edge functions sql database vibe coding'
  },
  {
    id: 'skill-v0-dev-shadcn-ui-scaffolding',
    title: 'v0.dev & Modern Component Scaffolding (Shadcn UI)',
    category: 'Skills',
    targetId: 'skill-v0-dev-shadcn-ui-scaffolding',
    skillKey: 'v0.dev & Component Scaffolding',
    badge: 'Generative UI (96%)',
    matchType: 'Software Tool',
    role: 'vibe_coding',
    description: 'Generative AI UI prototyping, accessible Radix-based Tailwind primitives, instant wireframe-to-production JSX transformation.',
    keywords: 'v0 dev shadcn ui component scaffolding generative ui wireframe vercel tailwind radix vibe coding'
  },
  {
    id: 'skill-prompt-engineering-context-mcp',
    title: 'Prompt Architecture, Context Pruning & MCP Tools',
    category: 'Skills',
    targetId: 'skill-prompt-engineering-context-mcp',
    skillKey: 'Prompt Architecture & MCP Tools',
    badge: 'LLM Systems (97%)',
    matchType: 'Verified Skill',
    role: 'vibe_coding',
    description: 'Chain-of-thought system prompts, Model Context Protocol (MCP) tool integration, token efficiency, and deterministic output structuring.',
    keywords: 'prompt architecture context pruning mcp tools model context protocol system prompts token budget llm vibe coding'
  },

  // ==========================================
  // --- 5. PROFESSIONAL JOURNEY / EXPERIENCE (6 Items) ---
  // ==========================================
  {
    id: 'exp-tax-consultant',
    title: 'GST & Income Tax Consultant (Independent Practice)',
    category: 'Experience',
    targetId: 'exp-tax-consultant',
    badge: '2023 — Present',
    matchType: 'Statutory Compliance',
    role: 'accountant',
    description: 'Managing statutory tax compliance, monthly GSTR-1 & 3B, ITR-1 to 4 filing, ITC 2B reconciliations & client advisory in Daltonganj, Palamu.',
    keywords: 'gst income tax consultant independent practice daltonganj palamu 2023 present gstr-1 gstr-3b itr 1 2 4 itc reconciliation tds advance tax'
  },
  {
    id: 'exp-senior-accountant',
    title: 'Senior Tally Accountant (Commercial & Retail)',
    category: 'Experience',
    targetId: 'exp-senior-accountant',
    badge: '2022 — Present',
    matchType: 'Software Tool',
    role: 'accountant',
    description: 'Full-cycle double-entry bookkeeping, daily vouchers, inventory accounting, multi-bank BRS & Balance Sheet finalization in Medininagar.',
    keywords: 'senior tally accountant commercial retail medininagar palamau 2022 present brs balance sheet trial balance profit & loss stock valuation'
  },
  {
    id: 'exp-mis-executive',
    title: 'MIS Executive (DAY-NULM Government Project)',
    category: 'Experience',
    targetId: 'exp-mis-executive',
    badge: '2021 — 2023',
    matchType: 'Project Deliverable',
    role: 'mis',
    description: 'Candidate enrollment tracking, biometric attendance, portal data synchronization & district progress analytics for Skill India in Daltonganj.',
    keywords: 'mis executive day-nulm skill india government project 2021 2023 trainee database biometric attendance daltonganj palamu'
  },
  {
    id: 'exp-junks-food',
    title: 'Accountant & Inventory Controller (Junks Food Agency)',
    category: 'Experience',
    targetId: 'exp-junks-food',
    badge: '2020 — 2022',
    matchType: 'Software Tool',
    role: 'accountant',
    description: 'Commercial wholesale billing, FIFO inventory flow, franchise settlements & vendor accounts using Path Solution ERP.',
    keywords: 'accountant inventory controller junks food agency path solution erp 2020 2022 wholesale billing fmcg pos terminal'
  },
  {
    id: 'exp-smart-card',
    title: 'Smart Card Operations Specialist (4 Districts Rollout)',
    category: 'Experience',
    targetId: 'exp-smart-card',
    badge: '2019 — 2021',
    matchType: 'Field Location',
    role: 'mis',
    description: 'Supervised biometric enrollment, card personalization & citizen distribution workflows across Palamu, Garhwa, Chatra, and Latehar.',
    keywords: 'smart card operations specialist 4 districts palamu garhwa chatra latehar rohtas rsby biometric enrollment citizen id 2019 2021 uidai aadhaar'
  },
  {
    id: 'exp-instructor',
    title: 'Computer Applications Instructor & Academic Tutor',
    category: 'Experience',
    targetId: 'exp-instructor',
    badge: '2018 — 2020',
    matchType: 'Verified Skill',
    role: 'mis',
    description: 'Instructed diploma students in MS Office, Desktop Publishing (DTP Photoshop, CorelDraw, PageMaker), foundational Tally ERP 9 & computer hardware troubleshooting.',
    keywords: 'computer instructor academic tutor teaching coaching ms office dtp photoshop coreldraw pagemaker tally fundamentals daltonganj 2018 2020'
  },
  {
    id: 'exp-other-controller',
    title: 'Corporate Financial Controller & Tax Strategy Lead',
    category: 'Experience',
    targetId: 'exp-other-controller',
    badge: '2023 — Present',
    matchType: 'Statutory Compliance',
    role: 'other',
    description: 'Directing corporate financial controls, statutory tax architecture, internal audit workflows, and multi-entity balance sheet finalization in Daltonganj & Regional Jharkhand.',
    keywords: 'corporate financial controller tax strategy lead strategic corporate advisory enterprise accounts internal financial controls section 115bac gstr-9 audit readiness balance sheet finalization other ai'
  },
  {
    id: 'exp-other-bi-systems',
    title: 'BI Systems Architect & Financial Operations Lead',
    category: 'Experience',
    targetId: 'exp-other-bi-systems',
    badge: '2021 — Present',
    matchType: 'Software Tool',
    role: 'other',
    description: 'Architecting Power BI fiscal dashboards, automated ERP reconciliation pipelines, and real-time operational KPI telemetry connecting ERP databases with live revenue and margins.',
    keywords: 'bi systems architect financial operations lead power bi fiscal dashboards dax financial modeling path solution erp automated brs etl pipelines inventory analytics other ai'
  },
  {
    id: 'exp-other-compliance',
    title: 'Executive Data & Enterprise Compliance Director',
    category: 'Experience',
    targetId: 'exp-other-compliance',
    badge: '2018 — 2023',
    matchType: 'Field Location',
    role: 'other',
    description: 'Directing inter-departmental statutory governance, multi-district database systems, and institutional audit verification across 4 administrative districts.',
    keywords: 'executive data enterprise compliance director regional operations institutional governance citizen biometric enrollment institutional audit trails statutory verification other ai'
  },

  {
    id: 'exp-vibe-coder',
    title: 'Independent AI Builder / Freelance Vibe Coder',
    category: 'Experience',
    targetId: 'exp-vibe-01',
    badge: '2026 (6 Mos)',
    matchType: 'Software Tool',
    role: 'vibe_coding',
    description: 'Autonomous zero-to-one SaaS generation, multi-agent workflow harness engineering, Claude Code / Cursor agent loops, and AI fullstack prototyping.',
    keywords: 'vibe coder ai builder freelance autonomous multi-agent devfleet nextjs supabase cursor windsurf claude code prompt engineering rapid mvp stealth saas studio'
  },

  // ==========================================
  // --- 6. ACADEMIC CREDENTIALS / EDUCATION (3 Items) ---
  // ==========================================
  {
    id: 'edu-adca',
    title: 'Advance Diploma in Computer Application (ADCA)',
    category: 'Education',
    targetId: 'edu-adca',
    tab: 'qualifications',
    badge: 'Diploma',
    matchType: 'Academic Record',
    role: 'both',
    description: 'Infocity Daltonganj certified. Advanced Excel modeling, Tally accounting, DTP suite & fundamental computer hardware diagnostics.',
    keywords: 'adca advance diploma computer application infocity daltonganj qualification education cert computing diploma'
  },
  {
    id: 'edu-intermediate',
    title: 'Intermediate of Arts (I.A. / 10+2)',
    category: 'Education',
    targetId: 'edu-intermediate',
    tab: 'qualifications',
    badge: 'UP Board',
    matchType: 'Academic Record',
    role: 'both',
    description: 'Higher Secondary education under UP Board from Baba Nawbat Choudhry Surtapur Kundesar Ghazipur.',
    keywords: 'intermediate arts ia 10+2 ghazipur up board higher secondary qualification education intermediate'
  },
  {
    id: 'edu-matriculation',
    title: 'Matriculation (10th Standard - CBSE)',
    category: 'Education',
    targetId: 'edu-matriculation',
    tab: 'qualifications',
    badge: 'CBSE Board',
    matchType: 'Academic Record',
    role: 'both',
    description: 'Secondary school examination under CBSE board from Radha Govind Public School Ramgarh Cant, Jharkhand.',
    keywords: 'matriculation 10th standard cbse radha govind ramgarh cant secondary education qualification high school'
  }
];
