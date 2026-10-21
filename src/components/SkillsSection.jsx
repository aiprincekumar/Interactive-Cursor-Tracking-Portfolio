import React, { useState, useEffect } from 'react';
import { soundFX } from '../utils/audio';
import { useRoleTab } from '../context/RoleContext';
import { useAnnounce } from '../context/AnnouncerContext';
import { useLanguage } from '../context/LanguageContext';


const SKILL_DATA = {
  // --- Category 1: Accounting & Tax ---
  'Tally Prime & ERP 9': {
    category: 'Accounting & Tax',
    category_hi: 'लेखांकन एवं कर',
    title: 'Tally Prime & ERP 9',
    title_hi: 'Tally Prime एवं ERP 9',
    level: '98%',
    tag: 'Comprehensive Financial Accounting',
    tag_hi: 'व्यापक वित्तीय लेखांकन',
    points: [
      'End-to-end company creation, chart of accounts setup, and multi-ledger hierarchy structuring.',
      'Voucher entry lifecycle: sales, purchase, payment, receipt, debit/credit notes, and journal adjustments.',
      'Real-time inventory management, stock valuation (FIFO/weighted average), and batch-wise tracking.',
      'Trial Balance reconciliation, Profit & Loss statement generation, and final Balance Sheet finalization.'
    ],
    points_hi: [
      'कंपनी निर्माण, चार्ट ऑफ अकाउंट्स सेटअप और मल्टी-लेजर पदानुक्रम संरचना का संपूर्ण प्रबंधन।',
      'वाउचर प्रविष्टि चक्र: बिक्री, खरीद, भुगतान, रसीद, डेबिट/क्रेडिट नोट और जर्नल समायोजन।',
      'वास्तविक समय इन्वेंट्री प्रबंधन, स्टॉक मूल्यांकन (FIFO/भारित औसत) और बैच-वार ट्रैकिंग।',
      'ट्रायल बैलेंस समाधान, लाभ-हानि विवरण और अंतिम बैलेंस शीट फाइनलाइजेशन।'
    ]
  },
  'GST Filing & Compliance': {
    category: 'Accounting & Tax',
    category_hi: 'लेखांकन एवं कर',
    title: 'GST Filing & Compliance',
    title_hi: 'GST फाइलिंग एवं अनुपालन',
    level: '96%',
    tag: 'Indirect Taxation & Portal Filing',
    tag_hi: 'अप्रत्यक्ष कराधान एवं पोर्टल फाइलिंग',
    points: [
      'Monthly and quarterly GSTR-1 outward supplies return preparation and online JSON submission.',
      'GSTR-3B monthly summary tax computation, input tax credit (ITC) netting, and cash ledger offset.',
      'GSTR-2B vs purchase ledger reconciliation to detect missing ITC and supplier mismatch.',
      'E-way bill generation, GST e-invoicing compliance, and notice response advisory.'
    ],
    points_hi: [
      'मासिक और त्रैमासिक GSTR-1 जावक आपूर्ति रिटर्न तैयारी और ऑनलाइन JSON सबमिशन।',
      'GSTR-3B मासिक सारांश कर गणना, इनपुट टैक्स क्रेडिट (ITC) नेटिंग और कैश लेजर ऑफसेट।',
      'अनुपलब्ध ITC और आपूर्तिकर्ता बेमेल का पता लगाने के लिए GSTR-2B बनाम परचेज लेजर समाधान।',
      'ई-वे बिल जनरेशन, GST ई-इनवॉइसिंग अनुपालन और नोटिस प्रतिक्रिया परामर्श।'
    ]
  },
  'Income Tax E-Filing': {
    category: 'Accounting & Tax',
    category_hi: 'लेखांकन एवं कर',
    title: 'Income Tax E-Filing',
    title_hi: 'आयकर ई-फाइलिंग',
    level: '94%',
    tag: 'Direct Taxation & ITR Returns',
    tag_hi: 'प्रत्यक्ष कराधान एवं ITR रिटर्न',
    points: [
      'Preparation and e-filing of ITR-1 (Sahaj), ITR-2, and ITR-4 (Sugam) on the Income Tax portal.',
      'Reconciliation of Annual Information Statement (AIS) and Form 26AS with books of account.',
      'Tax computation under both Old and New Tax Regimes (Section 115BAC) for optimal tax saving.',
      'Advance tax calculations, self-assessment tax challan generation, and refund status tracking.'
    ],
    points_hi: [
      'आयकर पोर्टल पर ITR-1 (सहज), ITR-2 और ITR-4 (सुगम) की तैयारी और ई-फाइलिंग।',
      'वार्षिक सूचना विवरण (AIS) और फॉर्म 26AS का खातों की पुस्तकों के साथ मिलान।',
      'इष्टतम कर बचत के लिए पुरानी और नई कर व्यवस्था (धारा 115BAC) दोनों के तहत कर गणना।',
      'अग्रिम कर गणना, स्व-मूल्यांकन कर चालान निर्माण और रिफंड स्थिति ट्रैकिंग।'
    ]
  },
  'Financial Auditing & Ledgers': {
    category: 'Accounting & Tax',
    category_hi: 'लेखांकन एवं कर',
    title: 'Financial Auditing & Ledgers',
    title_hi: 'वित्तीय ऑडिटिंग एवं लेजर',
    level: '95%',
    tag: 'Statutory Books & Verification',
    tag_hi: 'वैधानिक पुस्तकें एवं सत्यापन',
    points: [
      'In-depth scrutiny of general ledgers, subsidiary books, cash book, and day book records.',
      'Bank reconciliation statements (BRS) with automated clearing and uncredited cheque adjustment.',
      'Sundry debtors and creditors aging analysis with physical voucher verification.',
      'Year-end provision creation, depreciation scheduling, and audit trail preparation.'
    ],
    points_hi: [
      'सामान्य लेजर, सहायक पुस्तकों, रोकड़ बही (Cash Book) और डे बुक रिकॉर्ड की गहन जांच।',
      'स्वचालित समाशोधन और गैर-जमा चेक समायोजन के साथ बैंक समाधान विवरण (BRS)।',
      'भौतिक वाउचर सत्यापन के साथ विविध देनदारों और लेनदारों का आयु विश्लेषण।',
      'वर्ष-अंत प्रावधान निर्माण, मूल्यह्रास शेड्यूलिंग और ऑडिट ट्रेल की तैयारी।'
    ]
  },

  // --- Category 2: Software & Applications ---
  'MS Excel (Advanced)': {
    category: 'Software & Applications',
    category_hi: 'सॉफ्टवेयर एवं अनुप्रयोग',
    title: 'MS Excel (Advanced)',
    title_hi: 'MS Excel (उन्नत)',
    level: '97%',
    tag: 'Financial Modeling & Analysis',
    tag_hi: 'वित्तीय मॉडलिंग एवं विश्लेषण',
    points: [
      'Advanced lookup formulas: XLOOKUP, VLOOKUP, INDEX/MATCH, and dynamic array functions.',
      'Pivot Tables, slicers, calculated fields, and multi-source financial dashboards.',
      'Data validation rules, conditional formatting alerts, and nested logical statements (IFS/AND/OR).',
      'What-If analysis, goal seek, and structured financial summary consolidation.'
    ],
    points_hi: [
      'उन्नत लुकअप सूत्र: XLOOKUP, VLOOKUP, INDEX/MATCH और डायनेमिक एरे फ़ंक्शंस।',
      'पिवट टेबल्स, स्लाइसर्स, परिकलित फ़ील्ड और बहु-स्रोत वित्तीय डैशबोर्ड।',
      'डेटा सत्यापन नियम, सशर्त स्वरूपण अलर्ट और नेस्टेड लॉजिकल स्टेटमेंट।',
      'व्हॉट-इफ विश्लेषण, गोल सीक और संरचित वित्तीय सारांश समेकन।'
    ]
  },
  'MS Office (Word & PPT)': {
    category: 'Software & Applications',
    category_hi: 'सॉफ्टवेयर एवं अनुप्रयोग',
    title: 'MS Office (Word & PowerPoint)',
    title_hi: 'MS Office (Word एवं PowerPoint)',
    level: '96%',
    tag: 'Documentation & Presentations',
    tag_hi: 'दस्तावेज़ीकरण एवं प्रस्तुतियाँ',
    points: [
      'Official memorandum drafting, executive letters, and mail merge documentation in MS Word.',
      'Corporate review presentations, stakeholder pitch decks, and visual infographics in MS PowerPoint.',
      'Template standardization, formatting governance, and professional business stationery.',
      'PDF publication, digital signing readiness, and collaborative document review.'
    ],
    points_hi: [
      'MS Word में आधिकारिक ज्ञापन प्रारूपण, कार्यकारी पत्र और मेल मर्ज दस्तावेज़ीकरण।',
      'MS PowerPoint में कॉर्पोरेट समीक्षा प्रस्तुतियाँ, हितधारक पिच डेक और दृश्य इन्फोग्राफिक्स।',
      'टेम्पलेट मानकीकरण, स्वरूपण शासन और पेशेवर व्यावसायिक स्टेशनरी।',
      'PDF प्रकाशन, डिजिटल हस्ताक्षर तत्परता और सहयोगात्मक दस्तावेज़ समीक्षा।'
    ]
  },
  'DTP Design Suite': {
    category: 'Software & Applications',
    category_hi: 'सॉफ्टवेयर एवं अनुप्रयोग',
    title: 'Desktop Publishing (DTP Suite)',
    title_hi: 'डेस्कटॉप पब्लिशिंग (DTP सुइट)',
    level: '92%',
    tag: 'Commercial Layouts & Graphics',
    tag_hi: 'वाणिज्यिक लेआउट एवं ग्राफिक्स',
    points: [
      'Commercial brochure, bill book, banner, and stationery layout design in Adobe Photoshop.',
      'Vector graphics, certificate borders, logos, and publication artwork in CorelDraw.',
      'Page composition, book formatting, newspaper layouts, and typesetting in Adobe PageMaker.',
      'Print production setup: CMYK color separation, resolution scaling, and prepress alignment.'
    ],
    points_hi: [
      'Adobe Photoshop में वाणिज्यिक ब्रोशर, बिल बुक, बैनर और स्टेशनरी लेआउट डिजाइन।',
      'CorelDraw में वेक्टर ग्राफिक्स, प्रमाण पत्र बॉर्डर, लोगो और प्रकाशन कलाकृति।',
      'Adobe PageMaker में पृष्ठ संरचना, पुस्तक स्वरूपण, समाचार पत्र लेआउट और टाइपसेटिंग।',
      'प्रिंट उत्पादन सेटअप: CMYK रंग पृथक्करण, रिज़ॉल्यूशन स्केलिंग और प्रीप्रेस संरेखण।'
    ]
  },
  'Path Solution ERP': {
    category: 'Software & Applications',
    category_hi: 'सॉफ्टवेयर एवं अनुप्रयोग',
    title: 'Path Solution ERP',
    title_hi: 'Path Solution ERP',
    level: '94%',
    tag: 'FMCG & Agency Management',
    tag_hi: 'FMCG एवं एजेंसी प्रबंधन',
    points: [
      'High-frequency wholesale invoicing, retail point-of-sale billing, and barcode integration.',
      'Distributor inventory control, batch expiry alerts, and purchase order tracking.',
      'Franchise vendor settlement, commission calculations, and path database reconciliations.',
      'Daily sales collection summaries and agency logistics dispatch reports.'
    ],
    points_hi: [
      'उच्च-आवृत्ति थोक चालान, खुदरा पीओएस बिलिंग और बारकोड एकीकरण।',
      'वितरक इन्वेंट्री नियंत्रण, बैच समाप्ति अलर्ट और खरीद आदेश ट्रैकिंग।',
      'फ्रैंचाइज़ी विक्रेता निपटान, कमीशन गणना और डेटाबेस समाधान।',
      'दैनिक बिक्री संग्रह सारांश और एजेंसी रसद प्रेषण रिपोर्ट।'
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
    category_hi: 'प्रबंधन एवं संचालन',
    title: 'MIS Reporting & Analytics',
    title_hi: 'MIS रिपोर्टिंग एवं एनालिटिक्स',
    level: '96%',
    tag: 'Executive Telemetry & KPI Dashboards',
    tag_hi: 'कार्यकारी टेलीमेट्री एवं KPI डैशबोर्ड',
    points: [
      'Daily, weekly, and monthly Management Information System (MIS) reports for senior management.',
      'Sales trend analysis, margin breakdown per product category, and debtor aging reports.',
      'Performance metrics monitoring for government skill mission candidates and field teams.',
      'Standardized data visualization charts enabling data-driven commercial decisions.'
    ],
    points_hi: [
      'वरिष्ठ प्रबंधन के लिए दैनिक, साप्ताहिक और मासिक MIS रिपोर्ट तैयार करना।',
      'बिक्री रुझान विश्लेषण, उत्पाद श्रेणी वार मार्जिन विभाजन और देनदार आयु रिपोर्ट।',
      'सरकारी कौशल मिशन उम्मीदवारों और फील्ड टीमों के लिए प्रदर्शन मेट्रिक्स निगरानी।',
      'डेटा-संचालित वाणिज्यिक निर्णयों को सक्षम करने वाले मानकीकृत डेटा विज़ुअलाइज़ेशन चार्ट।'
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

  // --- Category 5: Business Intelligence & Corporate Controller (Other Track) ---
  'Power BI & Fiscal Dashboards': {
    category: 'Corporate Controller & BI',
    title: 'Power BI & Fiscal Dashboards',
    level: '97%',
    tag: 'Executive Financial Intelligence',
    points: [
      'Design of interactive executive Power BI dashboards with DAX measures, time-intelligence formulas, and fiscal KPIs.',
      'Automated data model pipelines connecting multi-company accounting ledgers, ERP exports, and bank feeds.',
      'Margin leakage alerts, cash runway forecasting, and dynamic division-level profit & loss visualizations.',
      'Scheduled cloud gateway refresh synchronization ensuring sub-second executive access to fresh fiscal telemetry.'
    ]
  },
  'Corporate Financial Controls': {
    category: 'Corporate Controller & BI',
    title: 'Corporate Financial Controls',
    level: '96%',
    tag: 'Statutory Strategy & Internal Audits',
    points: [
      'Establishment of rigorous internal financial control (IFC) protocols across accounts payable, receivable, and treasury.',
      'Segregation of duties (SoD) design, dual-authorization payment workflows, and automated discrepancy flags.',
      'Comprehensive vendor aging schedules, debit balance reconciliation, and credit risk mitigation frameworks.',
      'Zero-defect internal audit verification protecting organizational balance sheets against variance exposure.'
    ]
  },
  'Multi-Entity Ledger Consolidation': {
    category: 'Corporate Controller & BI',
    title: 'Multi-Entity Ledger Consolidation',
    level: '95%',
    tag: 'Inter-Company Accounting & Group P&L',
    points: [
      'Consolidation of general ledgers across multiple corporate branches, trading entities, and franchise networks.',
      'Inter-company transaction netting, elimination of duplicate ledger balances, and transfer pricing audit trails.',
      'Unified chart of accounts structuring ensuring uniform reporting across diverse commercial operations.',
      'Group-level Trial Balance synthesis, consolidated Balance Sheet finalization, and statutory audit compliance.'
    ]
  },
  'Automated ERP & Banking Pipelines': {
    category: 'Corporate Controller & BI',
    title: 'Automated ERP & Banking Pipelines',
    level: '96%',
    tag: 'API Integration & Real-Time Sync',
    points: [
      'Automated Bank Reconciliation Statement (BRS) pipelines reconciling high-volume corporate accounts daily.',
      'ERP data ingestion scripts connecting point-of-sale invoicing, distributor portals, and central Tally ledgers.',
      'Automated journal voucher batch generation reducing manual transcription errors to absolute zero.',
      'Real-time cash ledger positioning providing accurate working capital visibility for strategic treasury management.'
    ]
  },
  'Statutory Tax Strategy & Audits': {
    category: 'Corporate Controller & BI',
    title: 'Statutory Tax Strategy & Audits',
    level: '98%',
    tag: 'Tax Optimization & Risk Mitigation',
    points: [
      'Strategic tax planning under Corporate Income Tax and GST legislation to legally minimize effective tax rates.',
      'Automated GSTR-2B Input Tax Credit (ITC) audits recovering 100% eligible credits without mismatch notices.',
      'Comprehensive preparation for statutory tax audits, Section 44AB tax audit reports, and departmental assessments.',
      'Advance tax scheduling, withholding tax (TDS) optimization, and statutory compliance risk mitigation.'
    ]
  },
  'Working Capital & Liquidity Modeling': {
    category: 'Corporate Controller & BI',
    title: 'Working Capital & Liquidity Modeling',
    level: '94%',
    tag: 'Treasury & Cash Runway Management',
    points: [
      'Dynamic rolling cash flow forecasts modeling 13-week liquidity, debtor collections, and creditor disbursements.',
      'Inventory turnover optimization and days sales outstanding (DSO) reduction strategies improving cash velocity.',
      'Working capital financing optimization, credit facility monitoring, and interest expense containment.',
      'Stress testing financial liquidity against macroeconomic supply chain disruptions and margin pressures.'
    ]
  },
  'Executive KPI & Variance Analytics': {
    category: 'Corporate Controller & BI',
    title: 'Executive KPI & Variance Analytics',
    level: '96%',
    tag: 'Strategic Telemetry & Operational Metrics',
    points: [
      'Continuous variance analysis identifying cost overruns between budgeted standards and actual operational expenses.',
      'Executive dashboard delivery tracking EBITDA, gross contribution margins, overhead ratios, and return on capital.',
      'Cross-departmental productivity benchmarking combining financial output metrics with operational manpower data.',
      'Empirical board-level presentations translating complex ledger data into decisive strategic business guidance.'
    ]
  },
  'Internal Audit Trail Engineering': {
    category: 'Corporate Controller & BI',
    title: 'Internal Audit Trail Engineering',
    level: '95%',
    tag: 'Regulatory Traceability & Forensic Rigor',
    points: [
      'Implementation of immutable audit trails complying with MCA and statutory corporate governance mandates.',
      'Systematic transaction tracking verifying voucher creation, modification logs, and authorization timestamps.',
      'Forensic ledger scrutiny detecting irregular accounting entries, unapproved write-offs, and compliance deviations.',
      'Audit-ready electronic documentation archives ensuring rapid turnaround during statutory inspections.'
    ]
  },

  // --- Category 6: Vibe Coding & AI Software Engineering ---
  'Cursor & Windsurf IDEs': {
    category: 'AI Coding Environments',
    title: 'Cursor & Windsurf IDEs',
    level: '98%',
    tag: 'AI-Native Code Generation & Composer',
    points: [
      'Deep mastery of Cursor Composer, multi-file code editing, and contextual codebase indexing via .cursorrules.',
      'Windsurf Cascade flow utilization for real-time collaborative human-in-the-loop AI programming.',
      'Autonomous refactoring, semantic code search, and instant context retrieval across large repositories.',
      '10x developer throughput converting natural language specs into production-ready implementations.'
    ]
  },
  'Claude Code & Agent Loops': {
    category: 'AI Coding Environments',
    title: 'Claude Code & Agent Loops',
    level: '96%',
    tag: 'Autonomous Terminal CLI & Multi-Agent Loops',
    points: [
      'Orchestrating Claude Code CLI for autonomous feature construction, test writing, and bug hunting.',
      'Designing robust subagent DAGs, task delegation architectures, and persistent state management.',
      'Continuous verification gates running automated builds and linters to validate generated code.',
      'Automated pull request creation, git commit hygiene, and multi-file architectural refactoring.'
    ]
  },
  'v0.dev & Generative UI': {
    category: 'AI Coding Environments',
    title: 'v0.dev & Generative UI',
    level: '95%',
    tag: 'Prompt-to-Component Rapid Prototyping',
    points: [
      'Rapid scaffolding of modern React component trees, responsive layouts, and animations from natural language.',
      'Clean translation of design mockups into semantic Tailwind CSS and shadcn/ui component architectures.',
      'Zero-layout-shift component composition, accessibility attributes (ARIA), and micro-animations.',
      'Instant component iteration, variant generation, and production codebase integration.'
    ]
  },
  'Autonomous Debugging & Verification': {
    category: 'AI Coding Environments',
    title: 'Autonomous Debugging & Verification',
    level: '94%',
    tag: 'Self-Healing Code & Quality Gates',
    points: [
      'Automated root-cause diagnosis using agent introspection and recursive error-trace evaluation.',
      'Automated test generation with Vitest/Jest, Playwright, and Oxlint static analysis integration.',
      'Self-healing code routines that inspect build failure outputs and patch defects automatically.',
      'Zero-regression deployment readiness checks adhering to strict safety and architectural guidelines.'
    ]
  },
  'Next.js 14 & React Ecosystem': {
    category: 'Full-Stack SaaS',
    title: 'Next.js 14 & React Ecosystem',
    level: '97%',
    tag: 'App Router, Server Components & SSR',
    points: [
      'Modern App Router architecture, Server and Client Component boundary management, and streaming SSR.',
      'Server Actions for seamless form submissions, database mutations, and optimistic UI updates.',
      'Dynamic routing, parallel and intercepting routes, and layout caching optimization.',
      'Production deployment on Vercel with edge computing, image optimization, and analytics.'
    ]
  },
  'Tailwind CSS & Modern UI': {
    category: 'Full-Stack SaaS',
    title: 'Tailwind CSS & Modern UI',
    level: '98%',
    tag: 'Utility-First Styling & Luxury Polish',
    points: [
      'High-velocity styling using Tailwind CSS, custom design tokens, and fluid typography systems.',
      'Dark mode implementation with CSS variables, smooth transitions, and obsidian luxury aesthetics.',
      'Fluid physics, micro-interactions, responsive breakpoints, and custom animation keyframes.',
      'Elimination of style regressions with rigorous component-level style encapsulation.'
    ]
  },
  'Supabase & Cloud Backend': {
    category: 'Full-Stack SaaS',
    title: 'Supabase & Cloud Backend',
    level: '95%',
    tag: 'PostgreSQL, Row Level Security & Auth',
    points: [
      'Relational schema design, automated migrations, and complex SQL joins in cloud PostgreSQL.',
      'Row Level Security (RLS) policies for multi-tenant SaaS authorization and data privacy.',
      'Instant real-time subscriptions, WebSocket event broadcasting, and file storage bucket management.',
      'Edge Functions in TypeScript for secure webhooks, Stripe billing, and background jobs.'
    ]
  },
  'LLM APIs & Prompt Architecture': {
    category: 'Full-Stack SaaS',
    title: 'LLM APIs & Prompt Architecture',
    level: '96%',
    tag: 'Anthropic Claude, OpenAI & Google Gemini APIs',
    points: [
      'Integration of frontier LLM APIs (Claude 3.5 Sonnet, GPT-4o, Gemini 1.5 Pro) with streaming responses.',
      'Context window engineering, prompt caching strategies, system instruction protection, and few-shot calibration.',
      'Structured schema generation with Zod validation, tool calling, and deterministic JSON outputs.',
      'Cost-aware token budget routing, rate-limit backoff handling, and latency optimization.'
    ]
  }
};

const OVERVIEW_CATEGORIES = [
  {
    name: 'Financial & Statutory Core',
    skills: ['Tally Prime & ERP 9', 'GST Filing & Compliance', 'Income Tax E-Filing', 'Financial Auditing & Ledgers']
  },
  {
    name: 'Data Intelligence & Operations',
    skills: ['MIS Reporting & Analytics', 'MS Excel (Advanced)', 'Commercial Computing & Office IT Suite', 'Windows OS Administration']
  },
  {
    name: 'AI Engineering & Autonomous Development',
    skills: ['Cursor & Windsurf IDEs', 'Claude Code & Agent Loops', 'Next.js 14 & React Ecosystem', 'Supabase & Cloud Backend']
  }
];

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
    skills: ['Windows OS Administration', 'Commercial Computing & Office IT Suite', 'DTP Design Suite', 'Hardware Diagnosis & Maintenance', 'Network & Software Support']
  }
];

const VIBE_CODING_CATEGORIES = [
  {
    name: 'AI Coding Environments & Tooling',
    skills: [
      'Cursor & Windsurf IDEs',
      'Claude Code & Agent Loops',
      'v0.dev & Generative UI',
      'Autonomous Debugging & Verification'
    ]
  },
  {
    name: 'Full-Stack SaaS & Cloud Frameworks',
    skills: [
      'Next.js 14 & React Ecosystem',
      'Tailwind CSS & Modern UI',
      'Supabase & Cloud Backend',
      'LLM APIs & Prompt Architecture'
    ]
  }
];

const OTHER_CATEGORIES = [
  {
    name: 'Executive Business Intelligence & Dashboards',
    skills: ['Power BI & Fiscal Dashboards', 'Multi-Entity Ledger Consolidation', 'Executive KPI & Variance Analytics', 'Automated ERP & Banking Pipelines']
  },
  {
    name: 'Corporate Controls, Strategy & Leadership',
    skills: ['Corporate Financial Controls', 'Statutory Tax Strategy & Audits', 'Working Capital & Liquidity Modeling', 'Internal Audit Trail Engineering']
  }
];

const OVERVIEW_SKILLS_FLAT = OVERVIEW_CATEGORIES.flatMap((c) => c.skills);
const ACCOUNTANT_SKILLS_FLAT = ACCOUNTANT_CATEGORIES.flatMap((c) => c.skills);
const MIS_SKILLS_FLAT = MIS_CATEGORIES.flatMap((c) => c.skills);
const VIBE_CODING_SKILLS_FLAT = VIBE_CODING_CATEGORIES.flatMap((c) => c.skills);
const OTHER_SKILLS_FLAT = OTHER_CATEGORIES.flatMap((c) => c.skills);

// Backward compatibility alias for legacy event dispatches
SKILL_DATA['Computer Applications (ADCA)'] = SKILL_DATA['Commercial Computing & Office IT Suite'];
SKILL_DATA['Strategic Operations & Governance'] = SKILL_DATA['Corporate Financial Controls'];
SKILL_DATA['Process Automation & Workflows'] = SKILL_DATA['Automated ERP & Banking Pipelines'];
SKILL_DATA['Cursor & Windsurf AI IDEs'] = SKILL_DATA['Cursor & Windsurf IDEs'];
SKILL_DATA['LLM APIs & Context Engineering'] = SKILL_DATA['LLM APIs & Prompt Architecture'];

const CATEGORY_NAMES_HI = {
  'Financial & Statutory Core': 'वित्तीय एवं कराधान कोर',
  'Data Intelligence & Operations': 'डेटा इंटेलिजेंस एवं ऑपरेशंस',
  'AI Engineering & Autonomous Development': 'एआई इंजीनियरिंग एवं स्वायत्त विकास',
  'Statutory Accounting & Tax': 'कराधान एवं वैधानिक अकाउंटिंग',
  'Commercial & Financial Operations': 'वाणिज्यिक एवं वित्तीय संचालन',
  'Data Analytics & Reporting': 'डेटा एनालिटिक्स एवं रिपोर्टिंग',
  'IT Systems & Hardware Infrastructure': 'आईटी सिस्टम्स एवं हार्डवेयर इंफ्रास्ट्रक्चर',
  'AI Coding Environments & Tooling': 'एआई कोडिंग टूल्स एवं एनवायरनमेंट',
  'Full-Stack SaaS & Cloud Frameworks': 'फुल-स्टैक सास एवं क्लाउड फ्रेमवर्क्स',
  'Executive Business Intelligence & Dashboards': 'एग्जीक्यूटिव बिजनेस इंटेलिजेंस व डैशबोर्ड्स',
  'Corporate Controls, Strategy & Leadership': 'कॉर्पोरेट कंट्रोल्स, रणनीति व नेतृत्व'
};

export default function SkillsSection() {
  let languageContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    languageContext = useLanguage();
  } catch {
    // fallback
  }
  const t = languageContext?.t ?? ((key, fallback) => fallback || key);
  const isHindi = languageContext?.isHindi ?? false;

  const { activeRole, isOverview, isMIS, isOther, isVibeCoding } = useRoleTab();
  const isVibe = Boolean(isVibeCoding || activeRole === 'vibe_coding');
  const isOverviewRole = Boolean(isOverview || activeRole === 'overview');
  const categories = isOverviewRole
    ? OVERVIEW_CATEGORIES
    : (isVibe ? VIBE_CODING_CATEGORIES : (isOther ? OTHER_CATEGORIES : (isMIS ? MIS_CATEGORIES : ACCOUNTANT_CATEGORIES)));
  const currentSkillsFlat = isOverviewRole
    ? OVERVIEW_SKILLS_FLAT
    : (isVibe ? VIBE_CODING_SKILLS_FLAT : (isOther ? OTHER_SKILLS_FLAT : (isMIS ? MIS_SKILLS_FLAT : ACCOUNTANT_SKILLS_FLAT)));
  const defaultSkill = isOverviewRole
    ? 'Tally Prime & ERP 9'
    : (isVibe ? 'Cursor & Windsurf IDEs' : (isOther ? 'Power BI & Fiscal Dashboards' : (isMIS ? 'MIS Reporting & Analytics' : 'Tally Prime & ERP 9')));

  const [userSelectedSkill, setUserSelectedSkill] = useState(null);

  // Derived selected skill: fallback to track default if current selection is outside active track
  const selectedSkill = (userSelectedSkill && currentSkillsFlat.includes(userSelectedSkill))
    ? userSelectedSkill
    : defaultSkill;

  const activeData = SKILL_DATA[selectedSkill] || SKILL_DATA[defaultSkill];
  const accentColor = isOverviewRole ? '#6366F1' : (isVibe ? '#10B981' : (isOther ? '#8B5CF6' : (isMIS ? '#3B82F6' : '#FF4D6D')));

  let announce = null;
  try {
    const announcer = useAnnounce();
    announce = announcer?.announce;
  } catch {
    // fallback
  }

  // Voice narration for category stack switches
  const lastAnnouncedStackRef = React.useRef(activeRole);
  React.useEffect(() => {
    if (lastAnnouncedStackRef.current !== activeRole) {
      lastAnnouncedStackRef.current = activeRole;
      if (announce) {
        const stackName = isOverviewRole ? 'Executive Overview Stack' : (isVibe ? 'AI & Vibe Coding Stack' : (isOther ? 'Corporate Controller & BI Stack' : (isMIS ? 'Data & MIS Stack' : 'Accounting & Tax Stack')));
        announce(`Switched to ${stackName}`, 'polite');
      }
    }
  }, [activeRole, isOverviewRole, isVibe, isOther, isMIS, announce]);

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
    <section id="skills" aria-labelledby="skills-heading" className="relative w-full py-24 px-4 sm:px-6 lg:px-8 scroll-mt-28">
      <div className="max-w-7xl mx-auto">
        {/* Section Pill Badge - Reel style */}
      <div
          tabIndex={0}
          data-tts="Section 2: Skills"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#161122] border border-[#E7E2D8] dark:border-[#2D2340] text-[#18181B] dark:text-[#F5F2F8] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs whitespace-nowrap max-w-full overflow-x-auto focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-full cursor-pointer select-none"
        >
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
        <span className="truncate sm:overflow-visible">02 ✦ {t('skills.badge', 'Skills')} &bull; {isOverviewRole ? (isHindi ? 'कार्यकारी अवलोकन स्टैक' : 'Executive Overview Stack') : (isVibe ? (isHindi ? 'एआई व वाइब कोडिंग स्टैक' : 'AI & Vibe Coding Stack') : (isOther ? (isHindi ? 'कॉर्पोरेट कंट्रोलर व बीआई स्टैक' : 'Corporate Controller & BI Stack') : (isMIS ? (isHindi ? 'डेटा व एमआईएस स्टैक' : 'Data & MIS Stack') : (isHindi ? 'अकाउंटिंग व टैक्स स्टैक' : 'Accounting & Tax Stack'))))}</span>
      </div>

      {/* Heading matching Reel t=9.5s: "What I work with" */}
      <div className="mb-8">
        <h2
          id="skills-heading"
          tabIndex={0}
          data-tts={isHindi ? t('skills.title', 'तकनीकी उपकरण एवं व्यावसायिक महारत') : "Heading: What I work with."}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#18181B] dark:text-white tracking-tight font-['Outfit',sans-serif] leading-[1.08] mb-3 whitespace-normal sm:whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-xl px-1 -mx-1"
        >
          {isHindi ? (
            <span>तकनीकी उपकरण एवं <span className="text-[#FF4D6D]" style={{ color: accentColor }}>व्यावसायिक महारत</span></span>
          ) : (
            <span>What I <span className="text-[#FF4D6D]" style={{ color: accentColor }}>work with</span>.</span>
          )}
        </h2>
        <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: accentColor || '#FF4D6D' }} />
        <p
          tabIndex={0}
          data-tts={isHindi ? t('skills.subtitle') : (
            isOverviewRole
              ? 'Hover or tap any skill to inspect the curated multi-domain technical matrix synthesizing certified statutory accounting, audited financial ledgers, large-scale government MIS systems, and autonomous AI vibe coding.'
              : isVibe
              ? 'Hover or tap any skill to inspect rapid full-stack SaaS engineering, AI coding environments, autonomous agent loops, and prompt architecture.'
              : isOther
              ? 'Hover or tap any skill to inspect specialized corporate controller competencies: Power BI fiscal intelligence, multi-entity ledger consolidation, automated ERP reconciliation, and statutory risk governance.'
              : isMIS
              ? 'Hover or tap any skill to inspect executive MIS telemetry, advanced data modeling, government database portals, and IT infrastructure administration.'
              : 'Hover or tap any skill to inspect statutory tax compliance, double-entry Tally bookkeeping, audited financial ledgers, and commercial management.'
          )}
          className="text-stone-600 dark:text-stone-400 text-sm md:text-base max-w-xl font-normal leading-relaxed focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-xl p-1 -m-1"
        >
          {isHindi ? t('skills.subtitle') : (
            isOverviewRole
              ? 'Hover or tap any skill to inspect the curated multi-domain technical matrix synthesizing certified statutory accounting, audited financial ledgers, large-scale government MIS systems, and autonomous AI vibe coding.'
              : isVibe
              ? 'Hover or tap any skill to inspect rapid full-stack SaaS engineering, AI coding environments (Cursor, Windsurf, Claude Code), autonomous agent loops, and prompt architecture.'
              : isOther
              ? 'Hover or tap any skill to inspect specialized corporate controller competencies: Power BI fiscal intelligence, multi-entity ledger consolidation, automated ERP reconciliation, and statutory risk governance.'
              : isMIS
              ? 'Hover or tap any skill to inspect executive MIS telemetry, advanced data modeling, government database portals, and IT infrastructure administration.'
              : 'Hover or tap any skill to inspect statutory tax compliance, double-entry Tally bookkeeping, audited financial ledgers, and commercial management.'
          )}
        </p>
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

      <div
        role="tabpanel"
        id="skills-tabpanel"
        aria-labelledby={`role-tab-skills-${activeRole}`}
        key={activeRole}
        className="animate-tab-fade grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Left Column: Categorized Pill Matrix matching Reel t=9.5s */}
        <div className="lg:col-span-7 space-y-6 bg-white dark:bg-[#161122] p-6 sm:p-8 rounded-3xl border border-[#E7E2D8] dark:border-[#2D2340] shadow-md shadow-stone-900/5">
          {categories.map((cat) => (
            <div key={cat.name} className="space-y-2.5 pb-5 border-b border-[#ECE7DF] dark:border-[#2D2340] last:border-b-0 last:pb-0">
              <div
                tabIndex={0}
                data-tts={`Skill Category: ${cat.name}`}
                className="text-xs font-bold uppercase tracking-wider font-mono focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg px-1.5 py-0.5 -mx-1.5 inline-block"
                style={{ color: accentColor }}
              >
                {isHindi ? (CATEGORY_NAMES_HI[cat.name] || cat.name) : cat.name}
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => {
                  const isSelected = selectedSkill === skill;
                  const skillId = 'skill-' + skill.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  return (
                    <button
                      key={(isHindi && SKILL_DATA[skill]?.title_hi) ? SKILL_DATA[skill].title_hi : skill}
                      id={skillId}
                      type="button"
                      data-tts={`Skill: ${skill}`}
                      onClick={() => {
                        setUserSelectedSkill(skill);
                        soundFX.playFocusBeep();
                        if (announce) {
                          const data = SKILL_DATA[skill];
                          announce(`Selected skill: ${skill}. Proficiency: ${data?.level || '95%'}.`, 'polite');
                        }
                      }}
                      onMouseEnter={() => {
                        setUserSelectedSkill(skill);
                      }}
                      className={`scroll-mt-28 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden ${
                        isSelected
                          ? 'bg-[#18181B] dark:bg-white text-white dark:text-[#18181B] shadow-md shadow-black/15 scale-105 border border-black dark:border-white'
                          : 'bg-[#FAF8F5] dark:bg-[#100C1A] text-stone-700 dark:text-[#A99EBA] hover:text-[#18181B] dark:hover:text-[#F5F2F8] hover:bg-[#F2ECE4] dark:hover:bg-[#201830] border border-[#E7E2D8] dark:border-[#2D2340]'
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
        <div
          tabIndex={0}
          data-card="true"
          data-tts={`Detailed Skill: ${(isHindi && activeData.title_hi) ? activeData.title_hi : activeData.title}. Category: ${(isHindi && activeData.category_hi) ? activeData.category_hi : (isHindi && CATEGORY_NAMES_HI[activeData.category] ? CATEGORY_NAMES_HI[activeData.category] : activeData.category)}. Proficiency: ${activeData.level}. Key points: ${activeData.points.join('; ')}`}
          className="lg:col-span-5 bg-[#18181B] text-white p-7 sm:p-9 rounded-3xl border border-stone-800 shadow-2xl relative overflow-hidden transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full blur-2xl pointer-events-none"
            style={{
              backgroundColor: isOverviewRole
                ? 'rgba(99, 102, 241, 0.15)'
                : isVibe
                ? 'rgba(16, 185, 129, 0.15)'
                : isOther
                ? 'rgba(139, 92, 246, 0.15)'
                : (isMIS ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 77, 109, 0.15)')
            }}
          />

          {/* Header */}
          <div
            tabIndex={0}
            data-tts={`Category: ${activeData.category}. Proficiency: ${activeData.level}`}
            className="flex items-center justify-between pb-4 mb-4 border-b border-stone-800 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg px-1.5 py-0.5 -mx-1.5"
          >
            <span
              className="text-xs uppercase tracking-widest font-mono font-bold"
              style={{ color: accentColor }}
            >
              {activeData.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-stone-800 border border-stone-700 text-[10px] font-mono text-stone-300">
              {isHindi ? 'दक्षता' : 'Proficiency'}: {activeData.level}
            </span>
          </div>

          <h3
            tabIndex={0}
            data-tts={`Skill Name: ${activeData.title}`}
            className="text-3xl font-extrabold font-['Outfit',sans-serif] tracking-tight text-white mb-1 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg px-1 -mx-1 inline-block"
          >
            {activeData.title}
          </h3>
          <p
            tabIndex={0}
            data-tts={`Skill Focus: ${(isHindi && activeData.tag_hi) ? activeData.tag_hi : activeData.tag}`}
            className="text-xs text-stone-400 font-medium mb-6 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg px-1 -mx-1"
          >
            {activeData.tag}
          </p>

          {/* Points */}
          <div className="space-y-3 mb-6">
            {activeData.points.map((pt, i) => (
              <div
                key={i}
                tabIndex={0}
                data-tts={`Key Capability: ${pt}`}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-300 leading-relaxed focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg p-1 -m-1"
              >
                <span className="shrink-0 mt-0.5" style={{ color: accentColor }}>✦</span>
                <span>{(isHindi && activeData.points_hi && activeData.points_hi[i]) ? activeData.points_hi[i] : pt}</span>
              </div>
            ))}
          </div>

          {/* Proficiency progress bar */}
          <div
            tabIndex={0}
            data-tts={`Mastery Metric: ${activeData.level} proficiency level`}
            className="pt-4 border-t border-stone-800 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-xl p-1.5 -m-1.5"
          >
            <div className="flex items-center justify-between text-xs text-stone-400 mb-2 font-mono">
              <span>{isHindi ? 'दक्षता मेट्रिक' : 'MASTERY METRIC'}</span>
              <span className="text-white font-bold">{activeData.level}</span>
            </div>
            <div className="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                  isOverviewRole
                    ? 'from-[#6366F1] to-[#A5B4FC]'
                    : isVibe
                    ? 'from-[#10B981] to-[#6EE7B7]'
                    : isOther
                    ? 'from-[#8B5CF6] to-[#C4B5FD]'
                    : (isMIS ? 'from-[#3B82F6] to-[#93C5FD]' : 'from-[#FF4D6D] to-[#FFA4B6]')
                }`}
                style={{ width: activeData.level }}
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

