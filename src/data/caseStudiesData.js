/**
 * Master Case Studies Data Configuration
 * 100% Authentic Production-Grade Dossiers for All 9 Projects
 * Structured for 5-Stage Storytelling, Live Telemetry Simulations & 4-Tier Architecture Diagrams
 */

export const CASE_STUDIES = [
  // =========================================================================
  // PROJECT 01: GST & Income Tax Compliance & Verification Engine
  // =========================================================================
  {
    id: '01',
    targetId: 'proj-gst-tax',
    role: 'accountant',
    trackBadge: 'Financial Track',
    title: 'GST & Income Tax Compliance & Verification Engine',
    subtitle: 'Statutory E-Filing, ITC 2B Reconciliation & Tax Audit Verification',
    category: 'Statutory Tax & Compliance',
    accentColor: '#FF4D6D',
    summary: 'Automated taxation and statutory compliance system covering GSTR-1, GSTR-3B, GSTR-9, and Income Tax e-filing with automated Input Tax Credit ledger reconciliation, Section 16(2)(aa) verification, and zero penalty notices over 7+ years of active practice.',
    metrics: [
      { label: 'Returns Filed', val: '500+', desc: 'Statutory returns & audits e-filed' },
      { label: 'Compliance Rate', val: '100%', desc: 'On-time statutory submission accuracy' },
      { label: 'Reconciled ITC', val: '₹2.5Cr+', desc: 'Eligible tax credits verified' },
      { label: 'Notice Record', val: '0%', desc: 'Zero penalty / scrutiny notices' }
    ],
    techStack: ['GST Portal', 'ITR E-Filing', 'Tally Prime', 'Advanced Excel', 'Challan 280/281', 'Form 26AS / AIS'],
    story: {
      challenge: {
        title: 'Input Tax Credit Leakage & Complex Portal Reconciliations',
        context: 'Commercial enterprises in Jharkhand suffered cash flow lockups and statutory notices due to discrepancies between supplier-filed GSTR-1 returns and buyer auto-populated GSTR-2B ledgers under Section 16(2)(aa) of the CGST Act.',
        painPoints: [
          'Manual cross-checking of hundreds of monthly supplier invoices against portal ledgers consumed 20+ business days.',
          'Disallowed ITC resulted in double tax outflows and immediate cash flow constriction for regional SME clients.',
          'Income tax return filings were vulnerable to scrutiny notices under Section 143(1) due to unverified variances in Form 26AS, AIS, and TIS.'
        ]
      },
      solution: {
        title: 'Automated Multi-Parameter Matching & Continuous Audit Pipeline',
        approach: 'Engineered an automated reconciliation architecture bridging Tally Prime purchase ledgers, GST portal API data exports, and Income Tax portal AIS reports.',
        keyPillars: [
          { title: 'Normalized Fuzzy Matcher', desc: 'Compares GSTINs, normalized invoice sequences (ignoring slashes, hyphens, and leading zeros), and dates with ₹1 rounding tolerance.' },
          { title: 'Vendor Discrepancy Ledger', desc: 'Categorizes missing or delinquent supplier filings and generates automated vendor payment holdback advisories.' },
          { title: 'AIS/TIS Cross-Referencing', desc: 'Reconciles TDS under Section 194C, 194J, and 194H before XML/JSON return payload compilation.' }
        ]
      },
      techAndObstacles: {
        title: 'Overcoming Data Inconsistencies & Portal Format Shifts',
        stack: [
          { name: 'Tally Prime ERP', role: 'Purchase register extraction and general ledger double-entry accounting' },
          { name: 'Advanced Excel & Power Query', role: 'Multi-source data normalization and fuzzy matching algorithms' },
          { name: 'GST & Income Tax Portals', role: 'API JSON extraction, AIS/TIS cross-verification, and XML e-filing' }
        ],
        obstacles: [
          { hurdle: 'Counterparty vendors frequently delayed GSTR-1 filings or uploaded under incorrect GSTINs.', resolution: 'Instituted a supplier compliance scoring framework, retaining tax components on vendor payments until credits reflected in GSTR-2B.' },
          { hurdle: 'Differing date formats and invoice prefixes between supplier and buyer systems.', resolution: 'Engineered regex-based string normalization macros in Power Query standardizing alphanumeric sequences.' }
        ]
      },
      resultsAndMetrics: {
        title: 'Verifiable Compliance & Financial Preservation',
        beforeVsAfter: [
          { metric: 'Reconciliation Turnaround', before: '18–25 Days', after: '< 48 Hours', delta: '-90%' },
          { metric: 'ITC Recovery Rate', before: '92% (8% Lost)', after: '100% Captured', delta: '+8%' },
          { metric: 'Statutory Penalty Notices', before: 'Frequent Queries', after: 'Zero (0%)', delta: 'Eliminated' }
        ],
        highlights: [
          '500+ statutory returns e-filed with 100% on-time submission rate.',
          '₹2.5Cr+ in verified ITC claims preserved without disallowance.',
          'Maintained a spotless zero-notice, zero-penalty compliance record across 7+ years of active practice.'
        ]
      },
      lessonsLearned: {
        title: 'Durable Principles of Statutory Fiscal Governance',
        takeaways: [
          { principle: 'Continuous Weekly Reconciliation', detail: 'Treating ITC matching as a weekly operational gate eliminates end-of-quarter chaos and prevents cash lockups.' },
          { principle: 'Vendor Governance as Financial Defense', detail: 'Holding suppliers accountable to statutory filing schedules directly protects net operating margins.' },
          { principle: 'Annual AIS/TIS Pre-Auditing', detail: 'Reconciling government tax statements continuously through the fiscal year eliminates Section 234A/B/C interest penalties.' }
        ]
      }
    },
    simulator: {
      archetype: 'pipeline',
      title: 'Statutory ITC 2B Cross-Match & Audit Engine',
      description: 'Simulates high-speed batch reconciliation of inward ERP purchase registers against government GSTR-2B JSON payloads with Section 16(2) compliance verification.',
      initialLatency: 210,
      steps: [
        { id: 's1', label: 'ERP Ledger Ingestion', duration: 45, details: '1,420 inward purchase vouchers parsed from Tally Prime XML feed.' },
        { id: 's2', label: 'GSTR-2B API Matching', duration: 55, details: 'Normalized GSTIN & alphanumeric invoice matching with ₹1 rounding tolerance.' },
        { id: 's3', label: 'Section 16(2) Verification', duration: 40, details: 'Checking supplier active tax status, Rule 37 180-day aging, and reverse charge liability.' },
        { id: 's4', label: 'Audit Dossier Finalization', duration: 45, details: 'Zero-variance compliance verification approved for GSTR-3B monthly offset.' }
      ],
      telemetryKeys: [
        { key: 'invoices', label: 'Scanned Invoices', initialValue: '1,420 Vouchers', successValue: '1,420 Verified' },
        { key: 'reconciled', label: 'Matched Volume', initialValue: '₹2,48,50,000', successValue: '₹2,48,50,000 (100%)' },
        { key: 'statutory', label: 'Statutory Adherence', initialValue: 'Calculating...', successValue: '100% Section 16(2) Compliant' },
        { key: 'noticeRisk', label: 'Penalty / Notice Risk', initialValue: 'Evaluating...', successValue: '0% (Zero Variance)' }
      ]
    },
    architecture: {
      title: 'GST & Income Tax Statutory Compliance Architecture',
      description: '4-tier automated reconciliation and filing pipeline linking enterprise accounting ledgers to sovereign tax authority gateways.',
      tiers: [
        {
          name: 'Tier 1: Client & Data Ingestion',
          nodes: [
            { name: 'Tally Prime Ledgers', tech: 'XML / ODBC Export', detail: 'Inward purchase registers and general double-entry ledgers.' },
            { name: 'Supplier Invoices & Bills', tech: 'PDF / JSON Ingestion', detail: 'Standardized vendor invoices and e-Way Bill records.' },
            { name: 'Banking Feeds', tech: 'CSV / MT940 Bank Feeds', detail: 'Automated bank clearance statement feeds for tax challan matching.' }
          ]
        },
        {
          name: 'Tier 2: Gateway & Validation Controller',
          nodes: [
            { name: 'GSTN Portal Gateway', tech: 'API / Offline JSON', detail: 'Direct GSTR-2B inward credit statement ingestion.' },
            { name: 'Form 26AS / AIS Harmonizer', tech: 'Income Tax Portal', detail: 'Automated annual tax statement variance detection.' },
            { name: 'GSTIN Syntax Validator', tech: 'Checksum Engine', detail: 'State code, PAN, and entity checksum validation.' }
          ]
        },
        {
          name: 'Tier 3: Core Reconciliation Engine',
          nodes: [
            { name: 'Section 16(2) Matcher', tech: 'Fuzzy Matching Core', detail: 'Automated invoice sequence, date window, and value cross-matching.' },
            { name: 'TDS Computation Core', tech: 'Sections 194C / 194J / 194Q', detail: 'Withholding tax calculation and deduction ledger tracking.' },
            { name: 'Rule 37 Recapture Monitor', tech: '180-Day Aging', detail: 'Tracks unpaid vendor dues to enforce reverse tax credit recapture.' }
          ]
        },
        {
          name: 'Tier 4: Output & E-Filing Layer',
          nodes: [
            { name: 'GSTR-3B Tax Liability Engine', tech: 'Auto Offset Matrix', detail: 'Balances electronic cash and credit ledgers for monthly filing.' },
            { name: 'Challan 280 / 281 Dispatcher', tech: 'E-Payment Utility', detail: 'Generates government challans for direct bank payment.' },
            { name: 'Immutable Audit Dossier', tech: 'Statutory Archive', detail: 'Produces zero-notice audit trail packets for annual scrutiny.' }
          ]
        }
      ]
    }
  },

  // =========================================================================
  // PROJECT 02: Tally Financial Accounting & Inventory Management
  // =========================================================================
  {
    id: '02',
    targetId: 'proj-tally-accounting',
    role: 'accountant',
    trackBadge: 'Financial Track',
    title: 'Tally Financial Accounting & Inventory Management',
    subtitle: 'Double-Entry Ledger Integrity, Multi-Godown Control & Bank Reconciliation',
    category: 'Corporate Accounting & ERP',
    accentColor: '#FF4D6D',
    summary: 'Comprehensive double-entry general ledger architecture in Tally Prime, governing multi-location inventory godowns, electronic Bank Reconciliation Statements (BRS), and instant financial statement generation with zero unreconciled variances across ₹10Cr+ in transaction volume.',
    metrics: [
      { label: 'Ledger Accuracy', val: '100%', desc: 'Double-entry balance verification' },
      { label: 'Managed Volume', val: '₹10Cr+', desc: 'Annual commercial turnover tracked' },
      { label: 'Variance Record', val: '0', desc: 'Unreconciled bank discrepancies' },
      { label: 'Warehouse Hubs', val: '3', desc: 'Multi-godown inventory locations' }
    ],
    techStack: ['Tally Prime', 'Tally.ERP 9', 'BRS Automation', 'Multi-Godown Valuation', 'MS Excel MIS', 'Audit Trails'],
    story: {
      challenge: {
        title: 'Multi-Depot Inventory Drift & Delayed Financial Closures',
        context: 'High-velocity commercial distribution operations across regional branches struggled with inventory stockouts, unaccounted transit damages, and desynchronized double-entry ledgers.',
        painPoints: [
          'Multiple commercial bank accounts handled dozens of daily RTGS, NEFT, and cheque transactions, resulting in chronic clearance delays.',
          'Monthly financial statement closures (Trading Account, P&L, Balance Sheet) were delayed by up to 25 days due to unclassified suspense accounts.',
          'Physical stock quantities diverged from Tally book values by 4–6% due to unrecorded godown transfers.'
        ]
      },
      solution: {
        title: 'Standardized Chart of Accounts & Automated BRS Pipeline',
        approach: 'Re-architected the institutional Chart of Accounts in Tally Prime, establishing standardized ledger hierarchies, strict voucher numbering, and daily electronic bank statement reconciliation.',
        keyPillars: [
          { title: 'Electronic BRS Workflow', desc: 'Automated bank statement parsing that cross-matches cheque numbers, UTR reference codes, and values.' },
          { title: 'Multi-Godown FIFO Controls', desc: 'Enforced batch-wise FIFO inventory costing with mandatory gate-pass voucher verification before dispatch.' },
          { title: 'Suspense Account Eradication', desc: 'Mandated strict supporting document attachments on all journal vouchers, permanently eliminating suspense balances.' }
        ]
      },
      techAndObstacles: {
        title: 'Field Resistance & Data Synchronization Challenges',
        stack: [
          { name: 'Tally Prime & Tally.ERP 9', role: 'Core financial accounting and inventory management engine' },
          { name: 'TDL Customizations', role: 'Custom field validations and mandatory voucher approval workflows' },
          { name: 'MS Excel MIS Models', role: 'Daily ledger aging dashboards and cash runway forecasting' }
        ],
        obstacles: [
          { hurdle: 'Warehouse personnel resisted strict dispatch gate-pass voucher entry during peak loading hours.', resolution: 'Implemented streamlined barcoded picking slips and pre-authorized credit dispatch matrices.' },
          { hurdle: 'Regional branch power outages during concurrent voucher entry risked ledger data corruption.', resolution: 'Configured automated hourly local and cloud backup mirrors with checksum integrity validation.' }
        ]
      },
      resultsAndMetrics: {
        title: 'Instant Financial Visibility & Perfect Audit Trail',
        beforeVsAfter: [
          { metric: 'Month-End Closure Lag', before: '25 Days', after: 'Real-Time (T+1)', delta: '-96%' },
          { metric: 'Physical vs Book Stock Variance', before: '4–6% Discrepancy', after: '< 0.1% Variance', delta: '-98%' },
          { metric: 'Bank Statement Clearance', before: '10–15 Days Backlog', after: 'Daily Same-Day', delta: '100% Current' }
        ],
        highlights: [
          '₹10Cr+ in annual transaction volume seamlessly managed with zero double-entry errors.',
          'Maintained zero unreconciled bank discrepancies over 7+ consecutive years.',
          'Enabled instantaneous generation of audit-ready Balance Sheets and Profit & Loss statements.'
        ]
      },
      lessonsLearned: {
        title: 'Core Tenets of Disciplined Financial Accounting',
        takeaways: [
          { principle: 'The Ledger is the Single Truth', detail: 'Impeccable double-entry discipline provides immediate clarity for senior management decision-making.' },
          { principle: 'Daily BRS Eliminates Firefighting', detail: 'Daily electronic reconciliation catches bank fees, fraud, and bounce charges instantly.' },
          { principle: 'Inventory Truth is Built at the Dock', detail: 'Warehouse dock verification protocols prevent accounting valuation discrepancies downstream.' }
        ]
      }
    },
    simulator: {
      archetype: 'state-machine',
      title: 'Double-Entry Ledger Balancing & BRS State Machine',
      description: 'Interactive state visualizer tracing journal vouchers from initial transaction entry through automated BRS matching to verified balance sheet integration.',
      initialLatency: 150,
      steps: [
        { id: 'st1', label: 'Voucher Ingestion', duration: 40, details: 'Debits & Credits balanced for Journal Voucher #JV-2024-8842.' },
        { id: 'st2', label: 'Bank Statement Auto-Match', duration: 40, details: 'Matching UTR and cheque clearances against bank RTGS stream.' },
        { id: 'st3', label: 'Ledger Post & Balance Check', duration: 35, details: 'Trial balance integrity verified with zero delta.' },
        { id: 'st4', label: 'Statement Integration', duration: 35, details: 'Real-time P&L and Balance Sheet accounts updated.' }
      ],
      nodes: [
        { id: 'posting', label: 'POSTING', status: 'active', desc: 'Voucher entry in progress: Debits equal Credits.' },
        { id: 'reconciled', label: 'RECONCILED', status: 'success', desc: 'BRS statement matched: Zero bank variance.' },
        { id: 'variance', label: 'VARIANCE AUDIT', status: 'warning', desc: 'Variance detected: Auto-audit recommendation generated.' }
      ],
      telemetryKeys: [
        { key: 'annualVolume', label: 'Turnover Volume', initialValue: '₹10Cr+', successValue: '₹10Cr+ Governed' },
        { key: 'ledgerIntegrity', label: 'Ledger Balance', initialValue: '100% Balanced', successValue: '100% (Dr = Cr)' },
        { key: 'godowns', label: 'Active Godowns', initialValue: '3 Warehouses', successValue: '3 Warehouses (Synced)' },
        { key: 'unreconciled', label: 'Unreconciled Variance', initialValue: '₹0.00', successValue: '₹0.00 (Zero Drift)' }
      ]
    },
    architecture: {
      title: 'Tally Enterprise Double-Entry & Inventory Architecture',
      description: '4-tier financial accounting architecture enforcing rigorous double-entry integrity from transactional entry to statutory financial statements.',
      tiers: [
        {
          name: 'Tier 1: Transactional Sources',
          nodes: [
            { name: 'Sales & Invoicing', tech: 'Sales Register', detail: 'Multi-tax GST sales invoices and credit notes.' },
            { name: 'Purchase & Inward', tech: 'Purchase Register', detail: 'Goods Receipt Notes (GRN) and vendor bill vouchers.' },
            { name: 'Cash & Bank Books', tech: 'Counter Books', detail: 'Cash payment counter books and RTGS/NEFT transaction feeds.' }
          ]
        },
        {
          name: 'Tier 2: Double-Entry Validation',
          nodes: [
            { name: 'Journal Posting Daemon', tech: 'Tally Core Engine', detail: 'Enforces fundamental accounting axiom: Total Debits equal Total Credits.' },
            { name: 'Ledger Balancer', tech: 'Chart of Accounts', detail: 'Categorizes entries into assets, liabilities, income, and expenses.' },
            { name: 'Voucher Serializer', tech: 'Audit Trail Enforcer', detail: 'Enforces tamper-evident sequential voucher numbering.' }
          ]
        },
        {
          name: 'Tier 3: Valuation & Reconciliation',
          nodes: [
            { name: 'Multi-Godown Stock Engine', tech: 'FIFO Valuation', detail: 'Batch-wise inventory valuation across 3 regional warehouse depots.' },
            { name: 'BRS Auto-Matcher', tech: 'Electronic Bank Sync', detail: 'Daily comparison of bank statement feeds against book ledger balances.' },
            { name: 'Stock Aging Analyzer', tech: 'Slow-Moving Alert', detail: 'Identifies inventory holding periods exceeding 90 days.' }
          ]
        },
        {
          name: 'Tier 4: Statutory Financial Statements',
          nodes: [
            { name: 'Real-Time Balance Sheet', tech: 'Financial Statement', detail: 'Dynamic presentation of assets and liabilities without closure delay.' },
            { name: 'Profit & Loss Statement', tech: 'Operating Margins', detail: 'Gross profit and net margin calculations with cost-center breakdown.' },
            { name: 'Trial Balance & Audit Dossier', tech: 'Statutory Verification', detail: 'Audit-ready trial balance extracts for external statutory chartered accountants.' }
          ]
        }
      ]
    }
  },

  // =========================================================================
  // PROJECT 03: DAY-NULM Skill India MIS Reporting Portal
  // =========================================================================
  {
    id: '03',
    targetId: 'proj-day-nulm',
    role: 'mis',
    trackBadge: 'Data & Operations Track',
    title: 'DAY-NULM Skill India MIS Reporting Portal',
    subtitle: 'National Livelihoods Mission Candidate Lifecycle & Biometric Sync',
    category: 'Public Sector MIS & Analytics',
    accentColor: '#3B82F6',
    summary: 'Public sector operational MIS database and candidate tracking portal for the Deendayal Antyodaya Yojana - National Urban Livelihoods Mission, managing 2,500+ candidates across 50+ batches with 99.8% reporting accuracy and 100% portal synchronization.',
    metrics: [
      { label: 'Batches Managed', val: '50+', desc: 'Government training batches tracked' },
      { label: 'Trainees Certified', val: '2,500+', desc: 'Candidates trained & certified' },
      { label: 'Reporting Accuracy', val: '99.8%', desc: 'SDMS portal audit pass rate' },
      { label: 'Funding Approval', val: '100%', desc: 'Zero batch disbursement rejections' }
    ],
    techStack: ['Skill India SDMS', 'DAY-NULM Portal', 'AEBAS Biometric System', 'Advanced Excel VBA', 'DUDA Schemas', 'Aadhaar Vault'],
    story: {
      challenge: {
        title: 'Rigorous Public Sector Compliance & Data Fragmentation',
        context: 'Under the Ministry of Housing and Urban Affairs, the DAY-NULM mission mandated strict lifecycle tracking of urban poor youth across mobilization, daily biometric attendance, assessment, and 12-month post-placement.',
        painPoints: [
          'Center funding disbursements were strictly tied to maintaining >70% biometric attendance on the national SDMS portal.',
          'Manual paper attendance caused transcription errors, resulting in batch rejections from District Urban Development Agencies (DUDAs).',
          'Candidates with irregular attendance risked disqualification right before official Sector Skill Council assessments.'
        ]
      },
      solution: {
        title: 'Centralized Trainee Pipeline & Automated Threshold Radar',
        approach: 'Architected a centralized operational MIS database and automated attendance alert engine integrating candidate registration, daily biometric logs, and government portal uploads.',
        keyPillars: [
          { title: 'Attendance Threshold Radar', desc: 'Automated algorithms flagging trainees below 70% attendance two weeks prior to official assessment lock-ins.' },
          { title: 'Portal XML/CSV Generators', desc: 'Pre-formatted schema export utilities matching exact DUDA and SDMS server validation rules.' },
          { title: '12-Month Placement Dossier', desc: 'Digital verification repository tracking appointment letters, salary slips, and bank account credits.' }
        ]
      },
      techAndObstacles: {
        title: 'Biometric Scanner Failures & Rural Internet Outages',
        stack: [
          { name: 'Central Government SDMS', role: 'National candidate registration and certification portal' },
          { name: 'DAY-NULM State MIS', role: 'Jharkhand State urban livelihood monitoring portal' },
          { name: 'AEBAS Hardware & Excel VBA', role: 'Biometric fingerprint capture and automated batch processing macros' }
        ],
        obstacles: [
          { hurdle: 'Biometric fingerprint scanners failed on manual-labor candidates with worn fingerprint ridges.', resolution: 'Introduced secondary Aadhaar-linked OTP and iris scanning verification protocols compliant with UIDAI guidelines.' },
          { hurdle: 'Periodic regional internet connectivity outages delayed daily attendance uploads.', resolution: 'Engineered an offline-first SQLite staging cache that queued attendance logs with cryptographic timestamps and auto-synced upon reconnection.' }
        ]
      },
      resultsAndMetrics: {
        title: 'Zero Milestone Rejections & Record Candidate Certification',
        beforeVsAfter: [
          { metric: 'Batch Data Processing Lag', before: '15–20 Days', after: '< 24 Hours', delta: '-93%' },
          { metric: 'Candidate Disqualification Rate', before: '6–8% per Batch', after: '< 0.2%', delta: '-97%' },
          { metric: 'Government Portal Audit Queries', before: 'Frequent Objections', after: 'Zero Rejections', delta: '100% Approval' }
        ],
        highlights: [
          '50+ training batches successfully managed with 2,500+ trainees certified.',
          'Achieved 99.8% reporting accuracy across all state DUDA submissions.',
          'Secured 100% milestone grant disbursements with zero government funding clawbacks.'
        ]
      },
      lessonsLearned: {
        title: 'Strategic Takeaways from Grassroots Public Sector MIS',
        takeaways: [
          { principle: 'Data Quality Empowers Beneficiaries', detail: 'Accurate data tracking directly ensures that underprivileged youth receive stipends and certified placements.' },
          { principle: 'Early Anomaly Detection Saves Batches', detail: 'Monitoring attendance daily prevents candidates from slipping below non-negotiable statutory thresholds.' },
          { principle: 'Offline-First Architecture is Vital', detail: 'Systems deployed in semi-urban India must function reliably offline before relying on cloud connectivity.' }
        ]
      }
    },
    simulator: {
      archetype: 'pipeline',
      title: 'Biometric Candidate Registry & SDMS Portal Sync',
      description: 'Simulates high-velocity candidate registration, AEBAS biometric verification, threshold enforcement (>70%), and government SDMS portal synchronization.',
      initialLatency: 165,
      steps: [
        { id: 'step1', label: 'AEBAS Biometric Ingestion', duration: 40, details: 'Ingesting 250 trainee attendance logs for Batch JH-PAL-2023-B04.' },
        { id: 'step2', label: 'Aadhaar Vault Validation', duration: 45, details: 'One-way cryptographic hash matching and duplicate check against state registry.' },
        { id: 'step3', label: 'Threshold Calculation', duration: 40, details: 'Verifying that trainee attendance exceeds 70% mandatory threshold.' },
        { id: 'step4', label: 'SDMS / DUDA Server Sync', duration: 40, details: 'Transmitting encrypted XML payload to Ministry of Housing and Urban Affairs gateway.' }
      ],
      telemetryKeys: [
        { key: 'trainees', label: 'Active Trainees', initialValue: '250 Trainees', successValue: '2,500+ Governed' },
        { key: 'validation', label: 'Biometric Validation', initialValue: 'Verifying...', successValue: '99.8% Match Rate' },
        { key: 'portalStatus', label: 'Portal Gateway', initialValue: 'Connecting...', successValue: 'HTTP 200 OK (DUDA Synced)' },
        { key: 'accuracy', label: 'Reporting Accuracy', initialValue: 'Auditing...', successValue: '99.8% Accuracy' }
      ]
    },
    architecture: {
      title: 'DAY-NULM Skill India MIS Enterprise Architecture',
      description: '4-tier public sector data pipeline connecting grassroots training centers to state and central government portals.',
      tiers: [
        {
          name: 'Tier 1: Training Center Ingestion',
          nodes: [
            { name: 'Trainee Intake Desk', tech: 'Registration Terminal', detail: 'Candidate demographic intake and educational document capture.' },
            { name: 'AEBAS Biometric Scanners', tech: 'STQC Fingerprint', detail: 'Real-time morning and evening biometric classroom attendance.' },
            { name: 'Local Offline Buffer', tech: 'SQLite Local Cache', detail: 'Encrypted local cache ensuring continuous operation during network blackouts.' }
          ]
        },
        {
          name: 'Tier 2: Aggregation & Validation Controller',
          nodes: [
            { name: 'Attendance Scrubbing Engine', tech: 'VBA / Python Core', detail: 'De-duplicates attendance logs and flags duplicate fingerprint entries.' },
            { name: 'Aadhaar Vault Validator', tech: 'UIDAI Compliance', detail: 'One-way SHA-256 tokenization preserving citizen privacy.' },
            { name: '70% Threshold Radar', tech: 'Automated Alerting', detail: 'Proactively identifies students at risk of disqualification.' }
          ]
        },
        {
          name: 'Tier 3: Core Database & Lifecycle Store',
          nodes: [
            { name: 'Candidate Lifecycle DB', tech: 'Relational Store', detail: 'Central repository tracking registration, training, assessment, and placement.' },
            { name: 'Batch Assessment Matrix', tech: 'Sector Skill Council', detail: 'Evaluates theoretical and practical examination readiness.' },
            { name: 'Placement Audit Vault', tech: 'Appointment Ledger', detail: 'Secures 12-month post-training employment proof and salary slips.' }
          ]
        },
        {
          name: 'Tier 4: Government Portal Synchronization',
          nodes: [
            { name: 'Skill India SDMS REST Gateway', tech: 'Central Ministry API', detail: 'Direct synchronization with National Skill Development Corporation.' },
            { name: 'Jharkhand DUDA Interface', tech: 'State Urban Mission', detail: 'Official district milestone reporting for grant clearance.' },
            { name: 'Public Analytics Dashboard', tech: 'Executive Reports', detail: 'Real-time visibility into placement rates and gender inclusion metrics.' }
          ]
        }
      ]
    }
  },

  // =========================================================================
  // PROJECT 04: Multi-District Smart Card Operations & Enrollment Engine
  // =========================================================================
  {
    id: '04',
    targetId: 'proj-smart-card',
    role: 'mis',
    trackBadge: 'Data & Operations Track',
    title: 'Multi-District Smart Card Operations & Enrollment Engine',
    subtitle: 'Biometric Enrollment, PKI Chip Personalization & Field Logistics',
    category: 'Citizen Identity & Field Ops',
    accentColor: '#3B82F6',
    summary: 'High-throughput citizen smart card enrollment, cryptographic personalization, and field logistics system across 4 high-terrain administrative districts in Bihar and Jharkhand, issuing 50,000+ verified cards with a 35% reduction in turnaround time and zero data loss.',
    metrics: [
      { label: 'Cards Issued', val: '50,000+', desc: 'Verified citizen smart cards' },
      { label: 'Districts Covered', val: '4', desc: 'Palamau, Garhwa, Gaya, Aurangabad' },
      { label: 'Cycle Time', val: '-35%', desc: 'Turnaround time accelerated' },
      { label: 'Defect Rate', val: '< 0.2%', desc: 'Card encoding defect rate' }
    ],
    techStack: ['ISO 7816 / JavaCard', 'STQC Biometric Scanners', 'Thermal Dye Printers', 'Hardware Diagnostics', 'Encrypted Batch Sync', 'Field Operations'],
    story: {
      challenge: {
        title: 'Grassroots Logistics & Severe Environmental Obstacles',
        context: 'Rolling out citizen smart cards (health insurance and public identity cards) across 4 administrative districts in Bihar and Jharkhand required setting up mobile field camps in remote panchayats with zero network connectivity.',
        painPoints: [
          'High risk of duplicate citizen registrations and corrupted demographic data during camp transfers.',
          'Severe rural dust, extreme heat, and power blackouts caused frequent thermal card printer breakdowns and optical scanner failures.',
          'Traditional paper-to-card issuance cycles took up to 45 days, causing citizen unrest and delayed government program rollouts.'
        ]
      },
      solution: {
        title: 'Offline-First Distributed Pipeline & Hardware Triage Standard',
        approach: 'Formulated an offline-first distributed field operations pipeline utilizing cryptographic local databases, automated de-duplication, and field hardware maintenance protocols.',
        keyPillars: [
          { title: 'Offline Cryptographic Staging', desc: 'Encrypted local SQLite storage with SHA-256 fingerprint verification preventing local duplicate registrations.' },
          { title: 'Standard Hardware Triage SOP', desc: 'Trained mobile camp operators to calibrate thermal print heads and clean optical prisms within 10 minutes.' },
          { title: 'On-Field Card Personalization', desc: 'Unified workflow encoding smart card microchips (ISO 7816) and thermal surface printing in a single pass.' }
        ]
      },
      techAndObstacles: {
        title: 'Power Disruptions & Dust-Induced Equipment Wear',
        stack: [
          { name: 'ISO 7816 Smart Card Protocol', role: 'PKI chip encoding and biometric template storage' },
          { name: 'STQC Biometric Scanners', role: 'Government-certified optical fingerprint capture' },
          { name: 'Thermal Dye-Sublimation Printers', role: 'Edge-to-edge photo and demographic citizen card printing' }
        ],
        obstacles: [
          { hurdle: 'Thermal print heads frequently overheated and jammed due to rural dust accumulation.', resolution: 'Equipped mobile teams with sealed dust-proof transit cases with desiccant protection and portable solar-inverter battery systems.' },
          { hurdle: 'Villagers without government ID struggled to prove demographic credentials.', resolution: 'Established a village panchayat elder attestation protocol adhering to state government notification guidelines.' }
        ]
      },
      resultsAndMetrics: {
        title: '50,000+ Citizens Empowered with Secure Digital Identity',
        beforeVsAfter: [
          { metric: 'Registration-to-Card Delivery', before: '45 Days', after: '< 29 Days', delta: '-35%' },
          { metric: 'Card Encoding Defect Rate', before: '5.2%', after: '< 0.2%', delta: '-96%' },
          { metric: 'Data Corruption Incidents', before: 'Frequent Rescans', after: 'Zero (0%)', delta: 'Eliminated' }
        ],
        highlights: [
          '50,000+ verified smart cards issued across Palamau, Garhwa, Gaya, and Aurangabad.',
          'Achieved zero data loss incidents across 12 months of high-intensity field operations.',
          'Maintained high encoding throughput of 88 cards per minute during peak panchayat camps.'
        ]
      },
      lessonsLearned: {
        title: 'Operational Realities of Grassroots Identity Infrastructure',
        takeaways: [
          { principle: 'Hardware Maintenance is Software Engineering', detail: 'Preventative field hardware maintenance protocols are just as critical as software code stability.' },
          { principle: 'Tamper-Evident Batch Manifests', detail: 'Cryptographic batch signing prevents packet tampering during transit from village camps to district headquarters.' },
          { principle: 'Operator Empathy Drives Success', detail: 'Simple visual error prompts empower field operators to resolve technical issues independently.' }
        ]
      }
    },
    simulator: {
      archetype: 'pipeline',
      title: 'Field Biometric Enrollment & Card Provisioning Engine',
      description: 'Simulates citizen identity enrollment, optical biometric capture, cryptographic PKI chip burning (ISO 7816), and district dispatch manifest generation.',
      initialLatency: 142,
      steps: [
        { id: 'st1', label: 'Biometric Hash Ingestion', duration: 35, details: 'Verifying STQC optical biometric capture against local offline duplicate ledger.' },
        { id: 'st2', label: 'Cryptographic Chip Burn', duration: 40, details: 'Encoding citizen identity key into ISO 7816 smart card microchip.' },
        { id: 'st3', label: 'Thermal Surface Printing', duration: 35, details: 'Thermal dye-sublimation printing of citizen photograph and QR barcode.' },
        { id: 'st4', label: 'District Batch Manifest', duration: 32, details: 'Generating encrypted dispatch manifest for district administration hub.' }
      ],
      telemetryKeys: [
        { key: 'districts', label: 'Districts Covered', initialValue: '4 Districts', successValue: '4 Districts Active' },
        { key: 'totalCards', label: 'Cards Issued', initialValue: '1,250 Batch', successValue: '50,000+ Governed' },
        { key: 'throughput', label: 'Personalization Rate', initialValue: 'Processing...', successValue: '88 Cards / Min' },
        { key: 'fieldLatency', label: 'Sync Latency', initialValue: 'Connecting...', successValue: '142ms Encrypted' }
      ]
    },
    architecture: {
      title: 'Multi-District Smart Card Operational Architecture',
      description: '4-tier distributed biometric enrollment and smart card chip encoding architecture operating across disconnected rural environments.',
      tiers: [
        {
          name: 'Tier 1: Field Mobile Kits',
          nodes: [
            { name: '4 District Mobile Vans', tech: 'Field Deployment Units', detail: 'Self-sufficient mobile enrollment stations equipped with solar inverters.' },
            { name: 'Optical Biometric Scanners', tech: 'STQC Certified', detail: 'Government-certified live fingerprint capture prisms.' },
            { name: 'Citizen Intake Terminals', tech: 'Ruggedized Windows OS', detail: 'Touch-optimized demographic data entry application.' }
          ]
        },
        {
          name: 'Tier 2: Regional District Hub Controller',
          nodes: [
            { name: 'Store-and-Forward Daemon', tech: 'SQLite Encrypted Store', detail: 'Local caching ensuring uninterrupted operation without cellular connectivity.' },
            { name: 'De-duplication Matcher', tech: 'Local Hash Index', detail: 'Instant local biometric hash check preventing duplicate card creation.' },
            { name: 'Hardware Tamper Monitor', tech: 'Security Daemon', detail: 'Monitors smart card reader firmware and cryptographic key integrity.' }
          ]
        },
        {
          name: 'Tier 3: Central KMS & State Registry',
          nodes: [
            { name: 'State Identity KMS', tech: 'PKI 2048-bit Core', detail: 'Generates secure cryptographic certificate keys for smart card microchips.' },
            { name: 'State Registry Sync Gateway', tech: 'HTTPS Encrypted Pipe', detail: 'Nightly batch synchronization connecting district hubs to state servers.' },
            { name: 'Master Citizen Database', tech: 'Enterprise RDBMS', detail: 'Permanent archive of enrolled citizen demographic and biometric records.' }
          ]
        },
        {
          name: 'Tier 4: Personalization & Dispatch Layer',
          nodes: [
            { name: 'ISO 7816 Chip Burner', tech: 'High-Throughput Encoder', detail: 'Direct microchip encoding of citizen rights, biometric hash, and entitlements.' },
            { name: 'Thermal Dye Printer', tech: 'Sublimation Unit', detail: 'High-resolution edge-to-edge printing with UV anti-counterfeit overlay.' },
            { name: 'Logistics Manifest Generator', tech: 'Speed Post Barcode', detail: 'Automated barcoding and envelope packaging for direct citizen delivery.' }
          ]
        }
      ]
    }
  },

  // =========================================================================
  // PROJECT 05: Executive Power BI Fiscal Intelligence & Reconciliation Engine
  // =========================================================================
  {
    id: '05',
    targetId: 'proj-enterprise-transformation',
    role: 'other',
    trackBadge: 'Corporate Controller & BI Track',
    title: 'Executive Power BI Fiscal Intelligence & Reconciliation Engine',
    subtitle: 'Multi-Entity ERP Consolidation, DAX Fiscal Modeling & Variance Radar',
    category: 'Corporate Controller & BI',
    accentColor: '#8B5CF6',
    summary: 'Executive business intelligence and fiscal governance architecture consolidating 6 commercial operating entities in Microsoft Power BI, reducing month-end reporting latency by 80% and governing ₹25Cr+ in transaction volume with 99.9% reconciliation accuracy.',
    metrics: [
      { label: 'Managed Volume', val: '₹25Cr+', desc: 'Consolidated commercial volume' },
      { label: 'Reporting Latency', val: '-80%', desc: 'Month-end reporting acceleration' },
      { label: 'Entities Unified', val: '6', desc: 'Commercial operating subsidiaries' },
      { label: 'Reconciliation Rate', val: '99.9%', desc: 'Automated balance alignment' }
    ],
    techStack: ['Microsoft Power BI', 'Power Query (M)', 'DAX Financial Modeling', 'SQL / ODBC Connectors', 'Tally XML Server', 'Star Schema'],
    story: {
      challenge: {
        title: 'Fragmented Subsidiary Books & Delayed Executive Visibility',
        context: 'Rapidly expanding commercial corporate entities in retail, wholesale, and food agency distribution lacked unified financial visibility across their 6 operating subsidiaries.',
        painPoints: [
          'Senior executive leadership waited 15–20 days post month-end to receive consolidated balance sheets and division-level gross margins.',
          'Manual spreadsheet consolidation resulted in broken formula links, duplicate counting of inter-company sales, and obscured cash runway.',
          'Working capital was tied up in undetected aging accounts receivable and slow-moving distributor stock.'
        ]
      },
      solution: {
        title: 'Automated Power Query Extraction & DAX Tabular Modeling',
        approach: 'Engineered an enterprise business intelligence architecture utilizing Power BI, Power Query (M Language) ETL pipelines, and DAX modeling connecting directly to multi-company ERP files.',
        keyPillars: [
          { title: 'Star Schema Financial Mart', desc: 'Structured dimensional model featuring standardized dimensions (Dim_Date, Dim_Entity, Dim_Ledger, Dim_SKU) and normalized facts.' },
          { title: 'Inter-Company Elimination Engine', desc: 'Automated rules that identify and eliminate contra sales and purchase entries across sister entities.' },
          { title: 'Executive Variance Radar', desc: 'Real-time dashboard visualizer highlighting budget vs. actual discrepancies exceeding ₹50,000.' }
        ]
      },
      techAndObstacles: {
        title: 'Disparate Ledger Structures & High Query Latency',
        stack: [
          { name: 'Power BI Desktop & Service', role: 'Tabular modeling, DAX measures, and cloud executive workspace' },
          { name: 'Power Query (M Language)', role: 'Automated extraction, ledger normalization, and schema mapping' },
          { name: 'Tally XML / ODBC Gateway', role: 'Real-time multi-company data polling and journal extraction' }
        ],
        obstacles: [
          { hurdle: 'Different subsidiaries utilized inconsistent chart-of-accounts nomenclature for common expense heads.', resolution: 'Built a master chart-of-accounts cross-reference dictionary mapping disparate local ledgers to unified corporate reporting groups.' },
          { hurdle: 'High query latency when calculating running balances across millions of historical ledger records.', resolution: 'Engineered pre-aggregated monthly balance tables and optimized DAX measures using CALCULATE and KEEPFILTERS.' }
        ]
      },
      resultsAndMetrics: {
        title: 'T+1 Consolidated Visibility & Working Capital Optimization',
        beforeVsAfter: [
          { metric: 'Consolidated Reporting Delay', before: '15–20 Days', after: 'Instantaneous (T+1)', delta: '-80%' },
          { metric: 'Manual Compilation Man-Hours', before: '60+ Hours / Month', after: '< 2 Hours', delta: '-96%' },
          { metric: 'Inter-Company Balance Mismatches', before: 'Frequent Discrepancies', after: 'Zero (0%)', delta: '100% Reconciled' }
        ],
        highlights: [
          'Consolidated ₹25Cr+ in financial volume across 6 distinct commercial entities.',
          'Achieved 99.9% reconciliation accuracy across inter-company balance sheets.',
          'Empowered executive leadership with live mobile access to cash runway and EBITDA margins.'
        ]
      },
      lessonsLearned: {
        title: 'Foundational Principles of Corporate BI Architecture',
        takeaways: [
          { principle: 'Master Data Management Precedes Analytics', detail: 'Standardizing dimensional dictionaries across entities is the prerequisite for trustworthy dashboards.' },
          { principle: 'Model the Business, Not Raw Rows', detail: 'Designing clean Star Schemas aligned with executive KPIs outperforms querying raw transactional dumps.' },
          { principle: 'Automated Elimination Prevents Double Counting', detail: 'Rigorous inter-company elimination rules are vital to preserve fiscal reporting credibility.' }
        ]
      }
    },
    simulator: {
      archetype: 'pipeline',
      title: 'Multi-Entity ERP Ingestion & Fiscal Variance Radar',
      description: 'Simulates automated Power Query ingestion of multi-company Tally ledgers, DAX model computation (EBITDA, Working Capital), and inter-company balance elimination.',
      initialLatency: 145,
      steps: [
        { id: 'st1', label: 'Multi-Entity ERP Polling', duration: 35, details: 'Ingesting ledger streams from 6 distinct commercial operating company files.' },
        { id: 'st2', label: 'DAX Tabular Model Computation', duration: 40, details: 'Computing EBITDA, Gross Margin, and Working Capital Days across entities.' },
        { id: 'st3', label: 'Inter-Company Elimination', duration: 35, details: 'Eliminating contra trade entries and intra-group management fees.' },
        { id: 'st4', label: 'Executive Dashboard Refresh', duration: 35, details: 'Broadcasting refreshed KPI metrics to executive cloud service workspace.' }
      ],
      telemetryKeys: [
        { key: 'consolidatedLedger', label: 'Consolidated Ledgers', initialValue: '₹25.40 Cr', successValue: '₹25Cr+ Governed' },
        { key: 'reconciliationRate', label: 'Reconciliation Accuracy', initialValue: 'Calculating...', successValue: '99.9% Reconciled' },
        { key: 'reportingDelta', label: 'Reporting Latency', initialValue: 'Evaluating...', successValue: '-80% vs Manual' },
        { key: 'interCompany', label: 'Inter-Company Delta', initialValue: 'Aligning...', successValue: '₹0.00 Variance' }
      ]
    },
    architecture: {
      title: 'Power BI Corporate Fiscal Intelligence Architecture',
      description: '4-tier automated business intelligence architecture transforming raw multi-entity accounting books into interactive executive dashboards.',
      tiers: [
        {
          name: 'Tier 1: Multi-Entity ERP Ingestion',
          nodes: [
            { name: '6 Commercial Tally Files', tech: 'Tally XML / ODBC', detail: 'Direct ledger extracts from 6 independent corporate subsidiaries.' },
            { name: 'Core Banking Statements', tech: 'Bank API Feeds', detail: 'Daily automated bank clearance and overdraft limit monitoring.' },
            { name: 'GST Portal Return Extracts', tech: 'GSTR-1 & 3B Feeds', detail: 'Direct statutory tax filings cross-checked against sales ledgers.' }
          ]
        },
        {
          name: 'Tier 2: Power Query Automated ETL',
          nodes: [
            { name: 'Power Query M Ingestion', tech: 'ETL Pipeline Core', detail: 'Standardized extraction, transformation, and ledger data cleansing.' },
            { name: 'Ledger Group Harmonizer', tech: 'MDM Dictionary', detail: 'Standardizes disparate accounting head names into unified groups.' },
            { name: 'Inter-Company Contra Matcher', tech: 'Elimination Engine', detail: 'Identifies matching buyer-seller transactions between sister companies.' }
          ]
        },
        {
          name: 'Tier 3: Tabular Semantic Data Mart',
          nodes: [
            { name: 'Star Schema Model Mart', tech: 'Tabular Engine', detail: 'High-speed relational data mart with Dim_Date and Dim_Entity tables.' },
            { name: 'DAX Fiscal Metric Library', tech: 'Calculation Core', detail: 'Computes EBITDA, DSO, Gross Margin, and cash burn runway.' },
            { name: 'Row-Level Security (RLS)', tech: 'Permission Matrix', detail: 'Restricts division managers to their respective entity data.' }
          ]
        },
        {
          name: 'Tier 4: Executive Presentation Layer',
          nodes: [
            { name: 'Power BI Cloud Service', tech: 'Cloud Telemetry Host', detail: 'Scheduled hourly workspace refresh and secure cloud hosting.' },
            { name: 'Executive KPI Dashboard', tech: 'Interactive Canvas', detail: 'Live drill-down tiles for C-suite and managing directors.' },
            { name: 'Mobile Fiscal Radar', tech: 'Responsive Mobile UI', detail: 'Real-time push alerts on abnormal variances and liquidity milestones.' }
          ]
        }
      ]
    }
  },

  // =========================================================================
  // PROJECT 06: Corporate Financial Controls & Internal Audit Governance
  // =========================================================================
  {
    id: '06',
    targetId: 'proj-business-advisory',
    role: 'other',
    trackBadge: 'Corporate Controller & BI Track',
    title: 'Corporate Financial Controls & Internal Audit Governance',
    subtitle: 'Internal Financial Controls (IFC), Withholding Tax Gatekeeper & Audit Dossier',
    category: 'Statutory Strategy & Governance',
    accentColor: '#8B5CF6',
    summary: 'Institutional Internal Financial Controls (IFC) and statutory governance framework deploying automated 3-way matching, withholding tax (TDS) compliance gates, and continuous digital audit trails, preventing ₹45L+ in tax leakages with 100% audit readiness.',
    metrics: [
      { label: 'Audit Readiness', val: '100%', desc: 'Statutory audit preparedness' },
      { label: 'Leakage Prevented', val: '₹45L+', desc: 'Tax variance & leakage stopped' },
      { label: 'Disallowance Risk', val: '0%', desc: 'Section 40(a)(ia) expenditure risk' },
      { label: 'Penalty Record', val: '₹0', desc: 'Zero penalty / scrutiny assessment' }
    ],
    techStack: ['Internal Financial Controls (IFC)', 'Tally Security Features', 'Statutory Tax Matrix', 'Section 194Q Automation', 'Continuous Audit Trails', 'Vendor Ledger Auditing'],
    story: {
      challenge: {
        title: 'Uncoordinated Branch Expenditures & Statutory Vulnerability',
        context: 'Regional commercial branch networks suffered from uncoordinated operational expenditures: uncollected vendor tax deduction receipts, unmonitored cash purchases, and missing e-Way Bills.',
        painPoints: [
          'Impending statutory tax audits and GST department verifications caused severe panic and operational disruption.',
          'Non-compliance with tax withholding (TDS under Sections 194C, 194J, 194Q) risked 30% expense disallowances under Section 40(a)(ia).',
          'Absence of a formal 3-way matching process led to paying supplier invoices without verified Goods Receipt Notes (GRN).'
        ]
      },
      solution: {
        title: 'Institutional IFC Framework & Automated 3-Way Match Gatekeeper',
        approach: 'Designed and deployed an institutional Internal Financial Control (IFC) framework across all enterprise branches with mandatory digital authorization thresholds.',
        keyPillars: [
          { title: 'Automated 3-Way Matching Gate', desc: 'Requires cryptographic match between Purchase Order, GRN, and Vendor Tax Invoice before payment voucher release.' },
          { title: 'Withholding Tax (TDS) Matrix', desc: 'Automated calculation of TDS liabilities under Section 194C/194J/194Q with pre-filled Form 26Q registers.' },
          { title: 'Continuous Digital Audit Dossier', desc: 'Pre-indexes every transaction >₹50,000 with contracts, approvals, and bank clearance proof.' }
        ]
      },
      techAndObstacles: {
        title: 'Branch Manager Friction & Vendor Pushback',
        stack: [
          { name: 'Internal Financial Controls Matrix', role: 'Delegation of Authority and statutory approval rules' },
          { name: 'Tally Prime Security & Audit Module', role: 'Voucher alteration tracking and mandatory user authentication' },
          { name: 'Statutory Withholding Engine', role: 'Automated Challan 281 tax clearance and Form 16A generation' }
        ],
        obstacles: [
          { hurdle: 'Branch managers were accustomed to informal local purchasing without purchase orders.', resolution: 'Instituted a formal Delegation of Authority (DoA) matrix and automated digital purchase requisition workflows.' },
          { hurdle: 'Suppliers objected to tax deductions under newly enacted Section 194Q on high-volume goods.', resolution: 'Automated vendor communication advisories explaining statutory compliance and auto-issued Form 16A certificates.' }
        ]
      },
      resultsAndMetrics: {
        title: 'Zero-Penalty Audit Record & Fortified Balance Sheets',
        beforeVsAfter: [
          { metric: 'Statutory Audit Preparation Time', before: '30–45 Days', after: '< 48 Hours', delta: '-95%' },
          { metric: 'Prevented Tax Leakages', before: 'Vulnerable to Disallowance', after: '₹45L+ Preserved', delta: 'Protected' },
          { metric: 'Unapproved Branch Expenditures', before: '12% of Total Opex', after: '0%', delta: 'Eliminated' }
        ],
        highlights: [
          'Maintained 100% audit readiness with zero tax notices or statutory disallowances.',
          'Prevented ₹45L+ in tax leakage and disallowed expenditures under Section 40(a)(ia).',
          'Established an immutable digital audit archive referenced during statutory audits.'
        ]
      },
      lessonsLearned: {
        title: 'Enduring Rules of Enterprise Corporate Governance',
        takeaways: [
          { principle: 'Controls Must Facilitate, Not Paralyze', detail: 'The best financial controls are automated into daily workflows rather than acting as administrative roadblocks.' },
          { principle: 'Audit Readiness is an Everyday Stance', detail: 'Indexing supporting evidence at the moment of payment permanently eliminates year-end audit scrambles.' },
          { principle: 'Purchasing Governance Protects Profit', detail: 'Enforcing strict 3-way matching directly defends company bottom-line margins against supplier overbilling.' }
        ]
      }
    },
    simulator: {
      archetype: 'state-machine',
      title: 'Corporate Governance & Internal Control State Machine',
      description: 'Interactive state visualizer showing the progression of expenditure vouchers through automated 3-way matching, withholding tax verification, and audit dossier indexing.',
      initialLatency: 120,
      steps: [
        { id: 'st1', label: '3-Way Match Verification', duration: 30, details: 'Validating PO, Goods Receipt Note, and Tax Invoice values.' },
        { id: 'st2', label: 'Withholding Tax Check', duration: 30, details: 'Verifying Section 194C/194Q withholding tax deduction.' },
        { id: 'st3', label: 'Approval Hierarchy', duration: 30, details: 'Checking authorization thresholds according to DoA matrix.' },
        { id: 'st4', label: 'Audit Trail Indexing', duration: 30, details: 'Indexing transaction proof in the immutable compliance archive.' }
      ],
      nodes: [
        { id: 'control', label: 'CONTROL ACTIVE', status: 'active', desc: 'Active statutory monitoring: Withholding tax gatekeeper verified.' },
        { id: 'optimized', label: 'OPTIMIZED (₹45L+)', status: 'success', desc: 'Working capital optimized: Tax leakage prevented via automated 2B checks.' },
        { id: 'audit_ready', label: 'AUDIT READY (100%)', status: 'verified', desc: 'Zero-notice audit readiness: Immutable audit trail compiled.' }
      ],
      telemetryKeys: [
        { key: 'adherence', label: 'Statutory Adherence', initialValue: '100% Compliant', successValue: '100% (Zero Notice)' },
        { key: 'leakage', label: 'Leakage Prevented', initialValue: '₹45,20,000', successValue: '₹45L+ Preserved' },
        { key: 'auditPreparedness', label: 'Audit Preparedness', initialValue: '100% Ready', successValue: '100% Audit Ready' },
        { key: 'penaltyAssessment', label: 'Penalty Assessment', initialValue: '₹0.00', successValue: '₹0 (Zero Risk)' }
      ]
    },
    architecture: {
      title: 'Corporate Financial Controls & Internal Audit Architecture',
      description: '4-tier corporate governance architecture enforcing segregation of duties, withholding tax gates, and immutable audit trails.',
      tiers: [
        {
          name: 'Tier 1: AP / AR Transaction Ingestion',
          nodes: [
            { name: 'Accounts Payable Ledgers', tech: 'Voucher Ingestion', detail: 'Vendor bills, expense claims, and sub-contractor debit notes.' },
            { name: 'Purchase Orders & Contracts', tech: 'Procurement Master', detail: 'Approved purchase orders with pre-set payment milestones.' },
            { name: 'Treasury Payment Requests', tech: 'Payment Queue', detail: 'Payment requisitions queued for electronic clearance.' }
          ]
        },
        {
          name: 'Tier 2: Governance & Matching Gatekeeper',
          nodes: [
            { name: '3-Way Match Enforcer', tech: 'Tolerance Engine', detail: 'Validates PO vs GRN vs Tax Invoice within strict ₹50 tolerance.' },
            { name: 'Segregation of Duties Core', tech: 'RBAC Enforcer', detail: 'Ensures that voucher creators cannot authorize payment vouchers.' },
            { name: 'Delegation of Authority (DoA)', tech: 'Approval Hierarchy', detail: 'Routes payments above ₹1,00,000 to executive director approval.' }
          ]
        },
        {
          name: 'Tier 3: Statutory Tax & Optimization Engine',
          nodes: [
            { name: 'Withholding Tax Matrix', tech: 'Section 194C / 194Q', detail: 'Automated tax withholding calculation and Form 26Q staging.' },
            { name: 'Form 26AS Continuous Monitor', tech: 'Real-Time Sync', detail: 'Cross-checks vendor TDS deposits against sovereign tax portal records.' },
            { name: 'Working Capital Optimizer', tech: 'Cash Velocity Core', detail: 'Models vendor payment timing to maximize cash discount capture.' }
          ]
        },
        {
          name: 'Tier 4: Statutory Audit Defense Layer',
          nodes: [
            { name: 'Immutable Audit Archive', tech: 'WORM Digital Vault', detail: 'Tamper-evident archive of transaction proof, contracts, and approvals.' },
            { name: 'Quarterly Board Packets', tech: 'Executive Summary', detail: 'Standardized internal audit governance reports for company directors.' },
            { name: 'Statutory Defense Dossier', tech: 'Tax Audit Ready', detail: 'Instant pre-packaged evidence dossiers for government scrutiny verifications.' }
          ]
        }
      ]
    }
  },

  // =========================================================================
  // PROJECT 07: AI Prompt-to-Fullstack SaaS Generator
  // =========================================================================
  {
    id: '07',
    targetId: 'proj-ai-saas-generator',
    role: 'vibe_coding',
    trackBadge: 'AI & Vibe Coding Track',
    title: 'AI Prompt-to-Fullstack SaaS Generator',
    subtitle: 'Autonomous Next.js 14, Supabase RLS & Stripe Billing Scaffolding Engine',
    category: 'Autonomous SaaS & Prototyping',
    accentColor: '#10B981',
    summary: 'Autonomous prompt-driven SaaS scaffolding engine leveraging Claude 3.5 Sonnet and Cursor AI to generate production-ready Next.js 14 web applications, Supabase PostgreSQL schemas with Row-Level Security, and Stripe monetization in < 3 minutes with a 10x velocity acceleration.',
    metrics: [
      { label: 'Scaffolding Speed', val: '< 3 Mins', desc: 'Zero-to-deploy generation time' },
      { label: 'Velocity Increase', val: '10x', desc: 'Engineering shipping acceleration' },
      { label: 'MVPs Deployed', val: '25+', desc: 'Fullstack production applications' },
      { label: 'Test Pass Rate', val: '99.4%', desc: 'Generated codebase test pass rate' }
    ],
    techStack: ['Next.js 14 (App Router)', 'Claude 3.5 Sonnet', 'Cursor AI Composer', 'Supabase (PostgreSQL & RLS)', 'Tailwind CSS', 'Stripe Billing API', 'TypeScript'],
    story: {
      challenge: {
        title: 'High Scaffolding Overhead & Slow Zero-to-One Cycles',
        context: 'Building production-grade web applications traditionally demands weeks of boilerplate setup: authentication providers, multi-tenant database schemas with Row-Level Security, Stripe billing integration, API route handlers, and responsive UI components.',
        painPoints: [
          'Founders and product teams lose momentum due to high engineering costs, agency overhead, and slow feedback loops on initial MVPs.',
          'Standard AI code generation produces disconnected code snippets with hallucinated imports, broken types, and non-functional database queries.',
          'Manual setup of authentication, database schemas, and billing takes 4–6 weeks before first customer validation.'
        ]
      },
      solution: {
        title: 'Multi-Stage Prompt Architecture & Strict Schema Constraints',
        approach: 'Architected an autonomous prompt-driven SaaS scaffolding engine leveraging Claude 3.5 Sonnet, Cursor AI Composer, and Next.js 14 App Router constrained by strict software design patterns.',
        keyPillars: [
          { title: 'Schema-First Generation', desc: 'Synthesizes normalized PostgreSQL tables with Supabase Row-Level Security (RLS) policies before UI generation.' },
          { title: 'Server Actions with Zod', desc: 'Generates end-to-end typed mutations with strict schema validation and runtime type safety.' },
          { title: 'Pre-Commit Verification Gates', desc: 'Automated test generation and linting with Oxlint and TypeScript compiler verification.' }
        ]
      },
      techAndObstacles: {
        title: 'Context Drift & Third-Party SDK Type Incompatibilities',
        stack: [
          { name: 'Next.js 14 App Router', role: 'React Server Components, Server Actions, and edge-rendered routing' },
          { name: 'Claude 3.5 Sonnet / Cursor', role: 'High-speed autonomous code synthesis and architectural refactoring' },
          { name: 'Supabase PostgreSQL', role: 'Managed relational database with Row-Level Security (RLS) policies' }
        ],
        obstacles: [
          { hurdle: 'AI code generators frequently hallucinated database foreign key relations in complex multi-tenant models.', resolution: 'Created a modular template repository with standardized schema contracts and pre-configured Zod validators.' },
          { hurdle: 'Stripe webhook listener payloads failed validation due to outdated API SDK syntax in LLM training data.', resolution: 'Enforced explicit TypeScript type boundary contracts and pin latest verified Stripe SDK versions in template presets.' }
        ]
      },
      resultsAndMetrics: {
        title: '10x Shipping Velocity & 25+ Production Applications',
        beforeVsAfter: [
          { metric: 'Fullstack MVP Build Time', before: '4–6 Weeks', after: '< 3 Minutes', delta: '-99%' },
          { metric: 'Initial Engineering Cost', before: '$5,000–$15,000', after: '< $5 Token Spend', delta: '-99.9%' },
          { metric: 'Codebase Lint & Type Pass Rate', before: 'Manual Debugging', after: '99.4% First Pass', delta: 'Automated' }
        ],
        highlights: [
          'Synthesized fullstack web applications with authentication, database, and billing in under 3 minutes.',
          'Accelerated shipping velocity by 10x, deploying 25+ production-grade web MVPs.',
          'Achieved 99.4% test pass rate across generated codebases using Oxlint and Vitest.'
        ]
      },
      lessonsLearned: {
        title: 'Durable Principles of AI-Native Software Engineering',
        takeaways: [
          { principle: 'Constraints Enable Creativity', detail: 'Constraining AI models with strict schema definitions and typed boundaries eliminates hallucinations.' },
          { principle: 'Architecture Before Code', detail: 'Decomposing software requirements into clear architectural briefs produces superior code quality.' },
          { principle: 'Fast Verification Loops', detail: 'High-speed linters and type checkers provide the immediate feedback necessary for autonomous coding velocity.' }
        ]
      }
    },
    simulator: {
      archetype: 'pipeline',
      title: 'Autonomous Fullstack App Scaffolding Engine',
      description: 'Simulates natural language prompt parsing, database DDL synthesis with Supabase RLS, Next.js Server Action assembly, and edge deployment.',
      initialLatency: 140,
      steps: [
        { id: 'st1', label: 'Prompt Architecture Parsing', duration: 35, details: 'Decomposing specification prompt into architectural AST using Claude 3.5 Sonnet.' },
        { id: 'st2', label: 'PostgreSQL DDL & RLS Policies', duration: 40, details: 'Synthesizing normalized multi-tenant database tables with Row-Level Security.' },
        { id: 'st3', label: 'Next.js 14 UI & Stripe Routes', duration: 35, details: 'Generating responsive Tailwind components, Server Actions, and Stripe billing.' },
        { id: 'st4', label: 'Oxlint & Edge Deployment', duration: 30, details: 'Passing Oxlint 0-error gate and deploying production bundle to Vercel Edge.' }
      ],
      telemetryKeys: [
        { key: 'filesGenerated', label: 'Scaffolded Files', initialValue: '18 Files', successValue: '18 Files (2,450 LOC)' },
        { key: 'velocity', label: 'Shipping Velocity', initialValue: 'Calculating...', successValue: '< 3 Mins (< 10x Velocity)' },
        { key: 'testPass', label: 'Test Pass Rate', initialValue: 'Running...', successValue: '99.4% (Oxlint 0 Errors)' },
        { key: 'deployment', label: 'Deployment Target', initialValue: 'Deploying...', successValue: 'Vercel Edge + Supabase' }
      ]
    },
    architecture: {
      title: 'AI Prompt-to-Fullstack SaaS Architecture',
      description: '4-tier autonomous generation pipeline converting natural language specifications into verified production web applications.',
      tiers: [
        {
          name: 'Tier 1: Specification Ingestion',
          nodes: [
            { name: 'Natural Language Spec', tech: 'User Prompt', detail: 'Comprehensive product requirement brief and feature checklist.' },
            { name: 'Design System Tokens', tech: 'Tailwind Config', detail: 'Pre-set color palettes, typography scales, and component tokens.' },
            { name: 'Schema Archetypes', tech: 'Database Blueprints', detail: 'Standardized SaaS relational data patterns (Users, Teams, Subscriptions).' }
          ]
        },
        {
          name: 'Tier 2: AI Code Synthesis Core',
          nodes: [
            { name: 'Claude 3.5 Sonnet / Cursor', tech: 'LLM Orchestrator', detail: 'High-speed generative AI code synthesis with multi-file reasoning.' },
            { name: 'AST Code Generator', tech: 'Abstract Syntax Tree', detail: 'Synthesizes clean TypeScript code conforming to project style rules.' },
            { name: 'Tailwind UI Synthesizer', tech: 'Component Core', detail: 'Assembles responsive, accessible UI components with ARIA landmarks.' }
          ]
        },
        {
          name: 'Tier 3: Quality Gates & Verification',
          nodes: [
            { name: 'Oxlint High-Speed Linter', tech: 'Rust-Based Linter', detail: 'Sub-50ms static analysis verifying syntax, imports, and hooks rules.' },
            { name: 'TypeScript Strict Compiler', tech: 'Type Boundary Check', detail: 'Guarantees end-to-end type safety between server and client.' },
            { name: 'Vitest Automated Tests', tech: 'Unit Test Runner', detail: 'Executes generated unit tests ensuring functional business logic.' }
          ]
        },
        {
          name: 'Tier 4: Production Deployment Layer',
          nodes: [
            { name: 'Next.js 14 App Bundle', tech: 'Vercel Edge Runtime', detail: 'Server-side rendered production bundle with edge caching.' },
            { name: 'Supabase PostgreSQL', tech: 'Managed Cloud DB', detail: 'Multi-tenant database with Row-Level Security (RLS) enforcement.' },
            { name: 'Stripe Billing Webhooks', tech: 'Monetization Engine', detail: 'Automated checkout sessions, subscription tiers, and webhook listeners.' }
          ]
        }
      ]
    }
  },

  // =========================================================================
  // PROJECT 08: Autonomous Multi-Agent Workflow Engine
  // =========================================================================
  {
    id: '08',
    targetId: 'proj-agent-workflow-engine',
    role: 'vibe_coding',
    trackBadge: 'AI & Vibe Coding Track',
    title: 'Autonomous Multi-Agent Workflow Engine',
    subtitle: 'Directed Acyclic Graph (DAG) Orchestration, Self-Healing Loops & Git Ops',
    category: 'Agentic AI Architecture',
    accentColor: '#10B981',
    summary: 'Decentralized multi-agent development orchestration loop coordinating specialized LLM agents (Planner, Coder, Evaluator) across a Directed Acyclic Graph (DAG) with automated self-healing error recovery, achieving a 94.2% self-healing rate and saving 350+ developer hours.',
    metrics: [
      { label: 'Autonomous Tasks', val: '100+', desc: 'Complex programming tasks run' },
      { label: 'Self-Healing Rate', val: '94.2%', desc: 'Automatic error recovery success' },
      { label: 'Hours Saved', val: '350+', desc: 'Developer engineering hours saved' },
      { label: 'Task Loop Latency', val: '< 1.2s', desc: 'Subagent orchestration latency' }
    ],
    techStack: ['Multi-Agent DAG', 'Claude Code CLI', 'Dynamic Tool Calling', 'Oxlint / Vitest', 'Git Worktrees', 'Self-Healing Feedback', 'State Persistence'],
    story: {
      challenge: {
        title: 'Single-Prompt Failure on Complex Codebases',
        context: 'Single-prompt LLM code generation fails on large or complex programming tasks due to context drift, inability to run terminal commands, absence of automated testing, and unrecoverable syntax bugs.',
        painPoints: [
          'Developers spent immense time on repetitive maintenance: fixing linting errors, refactoring large functions, and writing regression tests.',
          'When an AI model generated broken code, it lacked the tools to run the test suite, observe the stack trace, and apply corrective fixes.',
          'Unconstrained AI file edits caused merge collisions and overwrote working code in shared branches.'
        ]
      },
      solution: {
        title: 'Decentralized Multi-Agent DAG with Self-Healing Feedback',
        approach: 'Architected an autonomous multi-agent developer loop coordinating specialized LLM subagents through a Directed Acyclic Graph (DAG) with automated test-driven feedback.',
        keyPillars: [
          { title: 'Role Specialization', desc: 'Separated concerns between Planner (architecture), Coder (implementation), Evaluator (testing), and Healer (recovery).' },
          { title: 'Isolated Git Worktrees', desc: 'Runs subagents in isolated git worktrees, preventing merge conflicts during concurrent execution.' },
          { title: 'Self-Healing Feedback Loop', desc: 'Feeds terminal error stack traces back to coder agents for iterative repair until all quality gates pass.' }
        ]
      },
      techAndObstacles: {
        title: 'Infinite Repair Loops & Token Budget Explosions',
        stack: [
          { name: 'Multi-Agent DAG Orchestrator', role: 'Task decomposition, dependency scheduling, and state persistence' },
          { name: 'Dynamic Tool Calling Harness', role: 'Safe terminal execution, file system modification, and AST querying' },
          { name: 'Git Worktree Engine', role: 'Isolated worktree creation, branch switching, and atomic PR commits' }
        ],
        obstacles: [
          { hurdle: 'Subagents got stuck in infinite repair loops when test assertions continuously failed.', resolution: 'Implemented max-retry circuit breakers capped at 3 self-healing attempts with exponential backoff.' },
          { hurdle: 'Terminal log verbosity caused token limit overflow and massive context degradation.', resolution: 'Built an intelligent error extractor that parses stack traces, isolates relevant file lines, and strips noisy terminal output.' }
        ]
      },
      resultsAndMetrics: {
        title: '350+ Hours Saved & Dependable Autonomous Engineering',
        beforeVsAfter: [
          { metric: 'Manual Debugging Intervention', before: '100% Human Oversight', after: '94.2% Autonomous Fix', delta: '+94.2%' },
          { metric: 'Average Bug Resolution Cycle', before: '45–90 Minutes', after: '< 3 Minutes', delta: '-96%' },
          { metric: 'Feature Delivery Turnaround', before: '3–5 Days', after: 'Same-Day (Hours)', delta: '4x Faster' }
        ],
        highlights: [
          'Successfully executed 100+ end-to-end autonomous engineering workflows.',
          'Achieved 94.2% self-healing error recovery rate on real-world regressions.',
          'Saved over 350+ senior developer hours on routine refactoring, linting, and testing.'
        ]
      },
      lessonsLearned: {
        title: 'Core Insights in Autonomous Multi-Agent Design',
        takeaways: [
          { principle: 'Fast Feedback is Food for Agents', detail: 'Autonomous agents excel when paired with lightning-fast linters and unit tests providing clear error signals.' },
          { principle: 'Specialization Beats Monolithic Models', detail: 'Dividing responsibilities into Planner, Coder, and Evaluator prevents cognitive overload.' },
          { principle: 'Circuit Breakers Prevent Runaways', detail: 'Rigorous retry limits and token budget caps are mandatory for dependable production agents.' }
        ]
      }
    },
    simulator: {
      archetype: 'state-machine',
      title: 'Autonomous Multi-Agent DAG State Machine',
      description: 'Interactive state visualizer showing task decomposition by the Planner, implementation by the Coder, and automated recovery by the Self-Healing Loop.',
      initialLatency: 110,
      steps: [
        { id: 'st1', label: 'Planner Decomposition', duration: 28, details: 'Decomposing task specification into 5 DAG execution sub-tasks.' },
        { id: 'st2', label: 'Coder Execution', duration: 30, details: 'Parallel subagents implementing AST modifications in isolated git worktrees.' },
        { id: 'st3', label: 'Evaluator Quality Gate', duration: 25, details: 'Running Oxlint static analysis and Vitest automated test suite.' },
        { id: 'st4', label: 'Self-Healing Recovery', duration: 27, details: 'Automated traceback extraction and patch application (< 1.1s).' }
      ],
      nodes: [
        { id: 'planner', label: 'PLANNER (DAG)', status: 'active', desc: 'Task spec decomposed into 5 parallel sub-tasks.' },
        { id: 'coder', label: 'CODER', status: 'executing', desc: 'Parallel subagents executing code edits in git worktrees.' },
        { id: 'verified', label: 'VERIFIED (100%)', status: 'verified', desc: 'All tests green: Quality gate passed and ready for PR merge.' }
      ],
      telemetryKeys: [
        { key: 'tasksRun', label: 'Autonomous Tasks', initialValue: '100+ Executed', successValue: '100+ Tasks Done' },
        { key: 'selfHealing', label: 'Self-Healing Rate', initialValue: '94.2%', successValue: '94.2% Recovery' },
        { key: 'devHours', label: 'Engineering Hours Saved', initialValue: '350+ Hours', successValue: '350+ Dev Hours' },
        { key: 'loopLatency', label: 'Loop Latency', initialValue: '< 1.2s', successValue: '< 1.2s Fast Loop' }
      ]
    },
    architecture: {
      title: 'Autonomous Multi-Agent DAG Architecture',
      description: '4-tier decentralized agentic architecture orchestrating specialized LLM subagents through task decomposition, execution, and self-healing.',
      tiers: [
        {
          name: 'Tier 1: Planning & DAG Scheduling',
          nodes: [
            { name: 'Task Spec Ingestion', tech: 'Requirement Parser', detail: 'Decomposes feature specs or bug tickets into atomic technical deliverables.' },
            { name: 'DAG Task Scheduler', tech: 'Dependency Graph', detail: 'Determines task prerequisites and schedules parallel execution branches.' },
            { name: 'Persistent Context Manager', tech: 'Memory Store', detail: 'Maintains state, decisions, and file boundary context across subagents.' }
          ]
        },
        {
          name: 'Tier 2: Specialized Agent Pool',
          nodes: [
            { name: 'Planner / Architect Agent', tech: 'High-Reasoning LLM', detail: 'Designs software architecture, defines file contracts, and creates test plans.' },
            { name: 'Coder / Implementer Agent', tech: 'Targeted Code Mod', detail: 'Executes minimal, precise edits adhering to codebase style conventions.' },
            { name: 'Evaluator / Auditor Agent', tech: 'Quality Gatekeeper', detail: 'Independently inspects code changes against verification requirements.' }
          ]
        },
        {
          name: 'Tier 3: Execution & Sandbox Engine',
          nodes: [
            { name: 'AST Filesystem Manipulator', tech: 'Precise Edits', detail: 'Modifies code files via Abstract Syntax Tree manipulation tools.' },
            { name: 'Terminal Execution Sandbox', tech: 'Bash / CLI Runner', detail: 'Executes build tools, test runners, and package managers safely.' },
            { name: 'Git Worktree Isolator', tech: 'Branch Isolation', detail: 'Runs concurrent agents in isolated worktrees without merge conflicts.' }
          ]
        },
        {
          name: 'Tier 4: Evaluation & Self-Healing Layer',
          nodes: [
            { name: 'Automated Test Quality Gate', tech: 'Oxlint & Vitest', detail: 'Enforces 0-lint errors and 100% unit/integration test pass rates.' },
            { name: 'Self-Healing Recovery Loop', tech: 'Traceback Repair', detail: 'Extracts terminal error traces and iteratively applies fixes until green.' },
            { name: 'Gated PR & Commit Engine', tech: 'Git Ops Automation', detail: 'Assembles clean conventional commits and automated pull requests.' }
          ]
        }
      ]
    }
  },

  // =========================================================================
  // PROJECT 09: Real-Time AI Document & Code Synthesizer
  // =========================================================================
  {
    id: '09',
    targetId: 'proj-doc-code-synthesizer',
    role: 'vibe_coding',
    trackBadge: 'AI & Vibe Coding Track',
    title: 'Real-Time AI Document & Code Synthesizer',
    subtitle: 'Multimodal OCR, Vector Chunking, Streaming LLM & Generative UI Canvas',
    category: 'Enterprise Generative AI',
    accentColor: '#10B981',
    summary: 'Real-time reactive generative canvas powered by multimodal LLMs, client-side vector search, and Server-Sent Events (SSE) streaming, parsing dense financial statements and PDFs at 50 pages/second with 85ms streaming token latency and strict Zod validation.',
    metrics: [
      { label: 'Parse Throughput', val: '50 Pgs/s', desc: 'Document ingestion velocity' },
      { label: 'Streaming Latency', val: '85ms', desc: 'Real-time token latency' },
      { label: 'Token Efficiency', val: '+45%', desc: 'Optimized via vector chunking' },
      { label: 'User Satisfaction', val: '4.9/5', desc: 'Auditor & accountant rating' }
    ],
    techStack: ['React 19', 'Streaming LLM (SSE)', 'Vector Embeddings & Cosine Search', 'Zod Schema Validation', 'KaTeX Typesetting', 'Edge Functions', 'Tailwind CSS'],
    story: {
      challenge: {
        title: 'Manual Transcription Bottlenecks & Unstructured OCR Chaos',
        context: 'Accounting, financial, and legal professionals waste thousands of hours transcribing tabular data from scanned receipts, invoices, complex tax forms, and financial PDFs into spreadsheets and software systems.',
        painPoints: [
          'Traditional OCR tools output unstructured text blobs that lose table row/column boundaries and misread decimal points.',
          'Manual transcription of a 50-page financial statement consumed 25–30 hours with high transposition error rates.',
          'Users lacked real-time visibility into AI extraction progress, leading to browser timeouts and lack of trust in results.'
        ]
      },
      solution: {
        title: 'Streaming Multimodal Vector Canvas with Strict Schema Guardrails',
        approach: 'Developed a real-time reactive canvas powered by multimodal frontier LLMs, client-side vector search, and Server-Sent Events (SSE) streaming with mathematical validation.',
        keyPillars: [
          { title: 'Semantic Vector Chunking', desc: 'Indexes dense multi-page documents into client-side vector chunks with sub-15ms cosine similarity lookup.' },
          { title: 'Generative UI Synthesis', desc: 'Dynamically synthesizes reactive TypeScript components, KaTeX formulas, and chart telemetry as tokens stream in.' },
          { title: 'Double-Entry Zod Validation', desc: 'Enforces mathematical rules ensuring that extracted debits equal credits before rendering on screen.' }
        ]
      },
      techAndObstacles: {
        title: 'High Token Latency & DOM Freezes on Large Mathematical Trees',
        stack: [
          { name: 'React 19 Reactive Canvas', role: 'High-speed component rendering, concurrent transitions, and virtual DOM' },
          { name: 'Server-Sent Events (SSE) Stream', role: 'Real-time progressive token streaming directly from edge functions' },
          { name: 'KaTeX & Zod Validator', role: 'Mathematical typesetting and strict schema validation of extracted figures' }
        ],
        obstacles: [
          { hurdle: 'Rendering complex financial equations and large mathematical trees caused frame drops in React.', resolution: 'Implemented progressive streaming component virtualization that mounts elements only as they enter the visible viewport.' },
          { hurdle: 'Multimodal vision models occasionally hallucinated commas or misplaced decimals in dense balance sheet tables.', resolution: 'Enforced double-entry verification scripts that cross-check row totals against stated column sums before accepting numbers.' }
        ]
      },
      resultsAndMetrics: {
        title: '50 Pages/Sec Throughput & Sub-100ms Streaming Latency',
        beforeVsAfter: [
          { metric: 'Document Transcription Time', before: '25–30 Minutes', after: '< 10 Seconds', delta: '-99%' },
          { metric: 'Tabular Extraction Error Rate', before: '8–12% Transposition', after: '< 0.1%', delta: '-98%' },
          { metric: 'Perceived Generation Latency', before: '45s Spinner Wait', after: '85ms First Token', delta: 'Instant' }
        ],
        highlights: [
          'Engineered 50 pages/second parsing throughput for dense financial statements.',
          'Achieved 85ms streaming token latency with zero browser freezing.',
          'Increased LLM token efficiency by 45% using client-side vector chunking.'
        ]
      },
      lessonsLearned: {
        title: 'Essential Insights in Multimodal Generative Systems',
        takeaways: [
          { principle: 'Streaming Builds User Trust', detail: 'Showing tokens and formulas resolve in real time transforms waiting into an engaging, transparent experience.' },
          { principle: 'Schema Validation Over Pure AI', detail: 'Pairing generative LLMs with deterministic mathematical validation rules guarantees institutional accuracy.' },
          { principle: 'Vector Retrieval Cuts Token Waste', detail: 'Pre-filtering relevant document chunks with cosine search saves 45%+ in unnecessary token spend.' }
        ]
      }
    },
    simulator: {
      archetype: 'pipeline',
      title: 'Streaming AI Document Synthesis Visualizer',
      description: 'Simulates real-time multimodal OCR ingestion, vector embedding chunking, Server-Sent Events (SSE) streaming, and generative KaTeX UI rendering.',
      initialLatency: 85,
      steps: [
        { id: 'st1', label: 'Multimodal PDF Ingestion', duration: 20, details: 'Extracting 50 pages of financial statements and tabular ledger data.' },
        { id: 'st2', label: 'Client Vector Chunking', duration: 25, details: 'Generating embeddings with 12ms cosine similarity search lookup.' },
        { id: 'st3', label: 'Streaming SSE Token Pipe', duration: 20, details: 'Progressive token streaming at 50 pages/second throughput.' },
        { id: 'st4', label: 'Generative UI & KaTeX Render', duration: 20, details: 'Synthesizing reactive components and rendering validated KaTeX formulas.' }
      ],
      telemetryKeys: [
        { key: 'streamLatency', label: 'Streaming Latency', initialValue: '85ms', successValue: '85ms Real-Time' },
        { key: 'throughput', label: 'Parse Throughput', initialValue: '50 Pgs/s', successValue: '50 Pages / Sec' },
        { key: 'vectorPrecision', label: 'Vector Precision', initialValue: '0.96 Cosine', successValue: '0.96 Precision' },
        { key: 'tokenEfficiency', label: 'Token Efficiency', initialValue: '+45%', successValue: '+45% Cached' }
      ]
    },
    architecture: {
      title: 'Real-Time AI Document & Code Synthesizer Architecture',
      description: '4-tier multimodal streaming architecture transforming unstructured documents into interactive, validated generative UI applications.',
      tiers: [
        {
          name: 'Tier 1: Multimodal Ingestion Layer',
          nodes: [
            { name: 'Multimodal File Uploader', tech: 'PDF / CSV / Image', detail: 'High-speed ingestion of multi-page PDF statements, scans, and spreadsheets.' },
            { name: 'High-Accuracy OCR Parser', tech: 'Vision AI Core', detail: 'Extracts tabular grids, cell coordinates, and typography formatting.' },
            { name: 'Semantic Tokenizer', tech: 'Text Chunking Core', detail: 'Decomposes documents into overlapping semantic paragraph and table chunks.' }
          ]
        },
        {
          name: 'Tier 2: Vector Embedding & Search Index',
          nodes: [
            { name: 'Client-Side Vector Cache', tech: 'In-Memory Embeddings', detail: 'Caches 50-chunk document embeddings in local browser memory.' },
            { name: 'Cosine Similarity Index', tech: 'Sub-15ms Search', detail: 'Ranks relevant document clauses based on natural language queries.' },
            { name: 'Dense-Sparse Query Router', tech: 'Hybrid Retrieval', detail: 'Combines exact keyword matching with deep semantic vector search.' }
          ]
        },
        {
          name: 'Tier 3: Streaming LLM & Schema Engine',
          nodes: [
            { name: 'Streaming SSE Token Pipe', tech: 'Server-Sent Events', detail: 'Streams extracted tokens progressively from edge functions without buffering.' },
            { name: 'Zod Strict Schema Validator', tech: 'Runtime Type Guard', detail: 'Validates that extracted financial values conform to double-entry equations.' },
            { name: 'Bi-Directional JSON Formatter', tech: 'Data Transformer', detail: 'Formats extracted tables into structured, exportable JSON payloads.' }
          ]
        },
        {
          name: 'Tier 4: Generative UI & Presentation Layer',
          nodes: [
            { name: 'KaTeX Mathematical Typesetter', tech: 'Formula Engine', detail: 'Renders verified balance sheet ratios and mathematical formulas cleanly.' },
            { name: 'Reactive Tailwind Canvas', tech: 'React 19 Generative UI', detail: 'Renders dynamic tables, telemetry meters, and interactive charts.' },
            { name: 'Exportable TypeScript Artifacts', tech: 'Code Generator', detail: 'Allows one-click export of synthesized data into clean TypeScript components.' }
          ]
        }
      ]
    }
  }
];

/**
 * Canonical 5-Stage Storytelling Stages
 */
export const CASE_STUDY_STAGES = [
  { id: 'challenge', number: '1', label: 'The Challenge' },
  { id: 'solution', number: '2', label: 'The Solution' },
  { id: 'tech', number: '3', label: 'Tech Stack & Obstacles' },
  { id: 'results', number: '4', label: 'Results & Metrics' },
  { id: 'lessons', number: '5', label: 'Lessons Learned' }
];

export const CASE_STUDIES_DATA = CASE_STUDIES;

/**
 * Case study lookup helper by numeric ID ('01' - '09') or target anchor ID ('proj-gst-tax', etc.)
 * Gracefully falls back to Project 01 if identifier is not found or empty.
 */
export function getCaseStudyById(identifier) {
  if (!identifier) return CASE_STUDIES[0];
  const cleanId = String(identifier).trim().toLowerCase();
  return (
    CASE_STUDIES.find(
      (cs) => cs.id.toLowerCase() === cleanId || cs.targetId.toLowerCase() === cleanId
    ) || CASE_STUDIES[0]
  );
}

export default CASE_STUDIES;
