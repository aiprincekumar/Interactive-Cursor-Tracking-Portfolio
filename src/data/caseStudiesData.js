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
    title_hi: 'GST एवं इनकम टैक्स वैधानिक अनुपालन व सत्यापन प्रणाली',
    subtitle: 'Statutory E-Filing, ITC 2B Reconciliation & Tax Audit Verification',
    subtitle_hi: 'वैधानिक ई-फाइलिंग, ITC 2B मिलान एवं टैक्स ऑडिट सत्यापन',
    category: 'Statutory Tax & Compliance',
    category_hi: 'वैधानिक कर एवं अनुपालन (Statutory Tax & Compliance)',
    accentColor: '#FF4D6D',
    summary: 'Automated taxation and statutory compliance system covering GSTR-1, GSTR-3B, GSTR-9, and Income Tax e-filing with automated Input Tax Credit ledger reconciliation, Section 16(2)(aa) verification, and zero penalty notices over 7+ years of active practice.',
    summary_hi: '7+ वर्षों के सक्रिय अभ्यास में GSTR-1, GSTR-3B, GSTR-9 और Income Tax ई-फाइलिंग, स्वचालित Input Tax Credit बहीखाता समाधान, Section 16(2)(aa) सत्यापन और शून्य पेनल्टी नोटिस का रिकॉर्ड।',
    executiveSummary_hi: '7+ वर्षों के सक्रिय अभ्यास में GSTR-1, GSTR-3B, GSTR-9 और Income Tax ई-फाइलिंग, स्वचालित Input Tax Credit बहीखाता समाधान, Section 16(2)(aa) सत्यापन और शून्य पेनल्टी नोटिस का रिकॉर्ड।',
    metrics: [
      { label: 'Returns Filed', label_hi: 'दाखिल रिटर्न', val: '500+', desc: 'Statutory returns & audits e-filed', desc_hi: 'ई-फाइल किए गए वैधानिक रिटर्न' },
      { label: 'Compliance Rate', label_hi: 'अनुपालन दर', val: '100%', desc: 'On-time statutory submission accuracy', desc_hi: 'समय पर वैधानिक प्रस्तुति सटीकता' },
      { label: 'Reconciled ITC', label_hi: 'समाधानित ITC', val: '₹2.5Cr+', desc: 'Eligible tax credits verified', desc_hi: 'पात्र टैक्स क्रेडिट सत्यापित' },
      { label: 'Notice Record', label_hi: 'नोटिस रिकॉर्ड', val: '0%', desc: 'Zero penalty / scrutiny notices', desc_hi: 'शून्य जुर्माना / संवीक्षा नोटिस' }
    ],
    techStack: ['GST Portal', 'ITR E-Filing', 'Tally Prime', 'Advanced Excel', 'Challan 280/281', 'Form 26AS / AIS'],
    challenge_hi: {
      title_hi: 'Input Tax Credit रिसाव एवं जटिल पोर्टल समाधान',
      context_hi: 'झारखंड के व्यापारिक प्रतिष्ठानों को CGST Act की धारा 16(2)(aa) के तहत आपूर्तिकर्ता द्वारा दाखिल GSTR-1 और खरीदार के स्वतः जनरेट GSTR-2B में विसंगतियों के कारण कार्यशील पूंजी का अवरोध और वैधानिक नोटिसों का सामना करना पड़ता था।',
      painPoints_hi: [
        'पोर्टल लेजर्स के विरुद्ध सैकड़ों मासिक आपूर्तिकर्ता इनवॉइस का मैन्युअल मिलान करने में 20+ कार्यदिवस खर्च होते थे।',
        'अमान्य ITC के कारण दोहरे कर का भुगतान हुआ और क्षेत्रीय SME ग्राहकों के लिए तत्काल नकदी प्रवाह बाधित हुआ।',
        'Form 26AS, AIS और TIS में असत्यापित विसंगतियों के कारण Income Tax रिटर्न Section 143(1) के तहत संवीक्षा नोटिसों के प्रति संवेदनशील थे।'
      ]
    },
    solution_hi: {
      title_hi: 'स्वचालित बहु-पैरामीटर मिलान एवं निरंतर ऑडिट पाइपलाइन',
      approach_hi: 'Tally Prime खरीद बहीखाते, GST पोर्टल API डेटा निर्यात और Income Tax पोर्टल AIS रिपोर्टों को एकीकृत करने वाला स्वचालित समाधान ढांचा विकसित किया।',
      keyHighlights_hi: [
        { title_hi: 'सामान्यीकृत फ़ज़ी मैचर (Normalized Fuzzy Matcher)', desc_hi: 'GSTIN, सामान्यीकृत चालान संख्या (स्लैश, हाइफ़न और शून्य अनदेखा करते हुए) और तारीखों का ₹1 राउंडिंग सहनशीलता के साथ मिलान करता है।' },
        { title_hi: 'विक्रेता विसंगति बहीखाता (Vendor Discrepancy Ledger)', desc_hi: 'लापरवाह या गायब आपूर्तिकर्ता फाइलिंग को वर्गीकृत करता है और स्वचालित विक्रेता भुगतान रोक सलाह जारी करता है।' },
        { title_hi: 'AIS/TIS क्रॉस-रेफरेंसिंग', desc_hi: 'XML/JSON रिटर्न अपलोड से पहले Section 194C, 194J और 194H के तहत TDS का पूर्ण समाधान करता है।' }
      ],
      keyPillars_hi: [
        { title_hi: 'सामान्यीकृत फ़ज़ी मैचर', desc_hi: 'GSTIN, इनवॉइस अनुक्रम और तारीखों का ₹1 राउंडिंग के साथ मिलान।' },
        { title_hi: 'विक्रेता विसंगति बहीखाता', desc_hi: 'लापरवाह सप्लायर्स की पहचान और भुगतान रोकने की सलाह।' },
        { title_hi: 'AIS/TIS क्रॉस-वेरिफिकेशन', desc_hi: 'रिटर्न फाइलिंग से पूर्व TDS विसंगतियों का 100% समाधान।' }
      ]
    },
    hurdles_hi: [
      {
        hurdle_hi: 'आपूर्तिकर्ता विक्रेता अक्सर GSTR-1 दाखिल करने में देरी करते थे या गलत GSTIN के तहत इनवॉइस अपलोड करते थे।',
        issue_hi: 'आपूर्तिकर्ता विक्रेता अक्सर GSTR-1 दाखिल करने में देरी करते थे या गलत GSTIN के तहत इनवॉइस अपलोड करते थे।',
        resolution_hi: 'एक सप्लायर अनुपालन स्कोरिंग ढांचा स्थापित किया, जब तक क्रेडिट GSTR-2B में प्रतिबिंबित न हो, विक्रेता भुगतानों पर टैक्स घटक को रोके रखा गया।'
      },
      {
        hurdle_hi: 'आपूर्तिकर्ता और खरीदार प्रणालियों के बीच अलग-अलग दिनांक प्रारूप और इनवॉइस उपसर्ग।',
        issue_hi: 'आपूर्तिकर्ता और खरीदार प्रणालियों के बीच अलग-अलग दिनांक प्रारूप और इनवॉइस उपसर्ग।',
        resolution_hi: 'Power Query में रेगेक्स-आधारित स्ट्रिंग सामान्यीकरण मैक्रोज़ तैयार किए जो अल्फ़ान्यूमेरिक अनुक्रमों को मानकीकृत करते हैं।'
      }
    ],
    impact_hi: {
      title_hi: 'सत्यापनीय अनुपालन एवं वित्तीय सुरक्षा',
      beforeAfter_hi: [
        { metric_hi: 'समाधान टर्नअराउंड समय', before_hi: '18–25 दिन', after_hi: '< 48 घंटे', delta_hi: '-90%' },
        { metric_hi: 'ITC रिकवरी दर', before_hi: '92% (8% नुकसान)', after_hi: '100% सुरक्षित', delta_hi: '+8%' },
        { metric_hi: 'वैधानिक पेनल्टी नोटिस', before_hi: 'बारंबार आपत्तियां', after_hi: 'शून्य (0%)', delta_hi: 'पूरी तरह समाप्त' }
      ],
      highlights_hi: [
        '100% समय पर फाइलिंग दर के साथ 500+ वैधानिक रिटर्न ई-फाइल किए गए।',
        '₹2.5Cr+ से अधिक वैध ITC दावे बिना किसी अस्वीकृति के सुरक्षित किए गए।',
        '7+ वर्षों के सक्रिय कार्य में बेदाग शून्य-नोटिस, शून्य-पेनल्टी अनुपालन रिकॉर्ड कायम रखा।'
      ]
    },
    takeaways_hi: [
      { principle_hi: 'निरंतर साप्ताहिक समाधान', detail_hi: 'ITC मिलान को साप्ताहिक प्रक्रिया बनाने से तिमाही के अंत की अव्यवस्था और नकदी प्रवाह रुकावट समाप्त होती है।' },
      { principle_hi: 'वित्तीय रक्षा के रूप में विक्रेता प्रशासन', detail_hi: 'आपूर्तिकर्ताओं को समय पर फाइलिंग के लिए उत्तरदायी बनाना शुद्ध परिचालन मार्जिन की सीधे सुरक्षा करता है।' },
      { principle_hi: 'वार्षिक AIS/TIS प्री-ऑडिटिंग', detail_hi: 'सरकारी टैक्स विवरणों का पूरे वर्ष नियमित मिलान करने से Section 234A/B/C ब्याज दंड समाप्त हो जाता है।' }
    ],
    story: {
      challenge: {
        title: 'Input Tax Credit Leakage & Complex Portal Reconciliations',
        title_hi: 'Input Tax Credit रिसाव एवं जटिल पोर्टल समाधान',
        context: 'Commercial enterprises in Jharkhand suffered cash flow lockups and statutory notices due to discrepancies between supplier-filed GSTR-1 returns and buyer auto-populated GSTR-2B ledgers under Section 16(2)(aa) of the CGST Act.',
        context_hi: 'झारखंड के व्यापारिक प्रतिष्ठानों को CGST Act की धारा 16(2)(aa) के तहत आपूर्तिकर्ता द्वारा दाखिल GSTR-1 और खरीदार के स्वतः जनरेट GSTR-2B में विसंगतियों के कारण कार्यशील पूंजी का अवरोध और वैधानिक नोटिसों का सामना करना पड़ता था।',
        painPoints: [
          'Manual cross-checking of hundreds of monthly supplier invoices against portal ledgers consumed 20+ business days.',
          'Disallowed ITC resulted in double tax outflows and immediate cash flow constriction for regional SME clients.',
          'Income tax return filings were vulnerable to scrutiny notices under Section 143(1) due to unverified variances in Form 26AS, AIS, and TIS.'
        ],
        painPoints_hi: [
          'पोर्टल लेजर्स के विरुद्ध सैकड़ों मासिक आपूर्तिकर्ता इनवॉइस का मैन्युअल मिलान करने में 20+ कार्यदिवस खर्च होते थे।',
          'अमान्य ITC के कारण दोहरे कर का भुगतान हुआ और क्षेत्रीय SME ग्राहकों के लिए तत्काल नकदी प्रवाह बाधित हुआ।',
          'Form 26AS, AIS और TIS में असत्यापित विसंगतियों के कारण Income Tax रिटर्न Section 143(1) के तहत संवीक्षा नोटिसों के प्रति संवेदनशील थे।'
        ]
      },
      solution: {
        title: 'Automated Multi-Parameter Matching & Continuous Audit Pipeline',
        title_hi: 'स्वचालित बहु-पैरामीटर मिलान एवं निरंतर ऑडिट पाइपलाइन',
        approach: 'Engineered an automated reconciliation architecture bridging Tally Prime purchase ledgers, GST portal API data exports, and Income Tax portal AIS reports.',
        approach_hi: 'Tally Prime खरीद बहीखाते, GST पोर्टल API डेटा निर्यात और Income Tax पोर्टल AIS रिपोर्टों को एकीकृत करने वाला स्वचालित समाधान ढांचा विकसित किया।',
        keyPillars: [
          { title: 'Normalized Fuzzy Matcher', title_hi: 'सामान्यीकृत फ़ज़ी मैचर', desc: 'Compares GSTINs, normalized invoice sequences (ignoring slashes, hyphens, and leading zeros), and dates with ₹1 rounding tolerance.', desc_hi: 'GSTIN, इनवॉइस अनुक्रम और तारीखों का ₹1 राउंडिंग के साथ मिलान।' },
          { title: 'Vendor Discrepancy Ledger', title_hi: 'विक्रेता विसंगति बहीखाता', desc: 'Categorizes missing or delinquent supplier filings and generates automated vendor payment holdback advisories.', desc_hi: 'लापरवाह सप्लायर्स की पहचान और भुगतान रोकने की सलाह।' },
          { title: 'AIS/TIS Cross-Referencing', title_hi: 'AIS/TIS क्रॉस-वेरिफिकेशन', desc: 'Reconciles TDS under Section 194C, 194J, and 194H before XML/JSON return payload compilation.', desc_hi: 'रिटर्न फाइलिंग से पूर्व TDS विसंगतियों का 100% समाधान।' }
        ]
      },
      techAndObstacles: {
        title: 'Overcoming Data Inconsistencies & Portal Format Shifts',
        title_hi: 'डेटा विसंगतियों एवं पोर्टल प्रारूप परिवर्तनों पर विजय',
        stack: [
          { name: 'Tally Prime ERP', role: 'Purchase register extraction and general ledger double-entry accounting', role_hi: 'खरीद रजिस्टर निष्कर्षण एवं सामान्य बहीखाता दोहरी प्रविष्टि लेखांकन' },
          { name: 'Advanced Excel & Power Query', role: 'Multi-source data normalization and fuzzy matching algorithms', role_hi: 'बहु-स्रोत डेटा सामान्यीकरण और फ़ज़ी मिलान एल्गोरिदम' },
          { name: 'GST & Income Tax Portals', role: 'API JSON extraction, AIS/TIS cross-verification, and XML e-filing', role_hi: 'API JSON निष्कर्षण, AIS/TIS क्रॉस-सत्यापन और XML ई-फाइलिंग' }
        ],
        obstacles: [
          {
            hurdle: 'Counterparty vendors frequently delayed GSTR-1 filings or uploaded under incorrect GSTINs.',
            hurdle_hi: 'आपूर्तिकर्ता विक्रेता अक्सर GSTR-1 दाखिल करने में देरी करते थे या गलत GSTIN के तहत इनवॉइस अपलोड करते थे।',
            issue_hi: 'आपूर्तिकर्ता विक्रेता अक्सर GSTR-1 दाखिल करने में देरी करते थे या गलत GSTIN के तहत इनवॉइस अपलोड करते थे।',
            resolution: 'Instituted a supplier compliance scoring framework, retaining tax components on vendor payments until credits reflected in GSTR-2B.',
            resolution_hi: 'एक सप्लायर अनुपालन स्कोरिंग ढांचा स्थापित किया, जब तक क्रेडिट GSTR-2B में प्रतिबिंबित न हो, विक्रेता भुगतानों पर टैक्स घटक को रोके रखा गया।'
          },
          {
            hurdle: 'Differing date formats and invoice prefixes between supplier and buyer systems.',
            hurdle_hi: 'आपूर्तिकर्ता और खरीदार प्रणालियों के बीच अलग-अलग दिनांक प्रारूप और इनवॉइस उपसर्ग।',
            issue_hi: 'आपूर्तिकर्ता और खरीदार प्रणालियों के बीच अलग-अलग दिनांक प्रारूप और इनवॉइस उपसर्ग।',
            resolution: 'Engineered regex-based string normalization macros in Power Query standardizing alphanumeric sequences.',
            resolution_hi: 'Power Query में रेगेक्स-आधारित स्ट्रिंग सामान्यीकरण मैक्रोज़ तैयार किए जो अल्फ़ान्यूमेरिक अनुक्रमों को मानकीकृत करते हैं।'
          }
        ]
      },
      resultsAndMetrics: {
        title: 'Verifiable Compliance & Financial Preservation',
        title_hi: 'सत्यापनीय अनुपालन एवं वित्तीय सुरक्षा',
        beforeVsAfter: [
          { metric: 'Reconciliation Turnaround', metric_hi: 'समाधान टर्नअराउंड समय', before: '18–25 Days', before_hi: '18–25 दिन', after: '< 48 Hours', after_hi: '< 48 घंटे', delta: '-90%', delta_hi: '-90%' },
          { metric: 'ITC Recovery Rate', metric_hi: 'ITC रिकवरी दर', before: '92% (8% Lost)', before_hi: '92% (8% नुकसान)', after: '100% Captured', after_hi: '100% सुरक्षित', delta: '+8%', delta_hi: '+8%' },
          { metric: 'Statutory Penalty Notices', metric_hi: 'वैधानिक पेनल्टी नोटिस', before: 'Frequent Queries', before_hi: 'बारंबार आपत्तियां', after: 'Zero (0%)', after_hi: 'शून्य (0%)', delta: 'Eliminated', delta_hi: 'पूरी तरह समाप्त' }
        ],
        highlights: [
          '500+ statutory returns e-filed with 100% on-time submission rate.',
          '₹2.5Cr+ in verified ITC claims preserved without disallowance.',
          'Maintained a spotless zero-notice, zero-penalty compliance record across 7+ years of active practice.'
        ],
        highlights_hi: [
          '100% समय पर फाइलिंग दर के साथ 500+ वैधानिक रिटर्न ई-फाइल किए गए।',
          '₹2.5Cr+ से अधिक वैध ITC दावे बिना किसी अस्वीकृति के सुरक्षित किए गए।',
          '7+ वर्षों के सक्रिय कार्य में बेदाग शून्य-नोटिस, शून्य-पेनल्टी अनुपालन रिकॉर्ड कायम रखा।'
        ]
      },
      lessonsLearned: {
        title: 'Durable Principles of Statutory Fiscal Governance',
        title_hi: 'वैधानिक राजकोषीय प्रशासन के स्थायी सिद्धांत',
        takeaways: [
          { principle: 'Continuous Weekly Reconciliation', principle_hi: 'निरंतर साप्ताहिक समाधान', detail: 'Treating ITC matching as a weekly operational gate eliminates end-of-quarter chaos and prevents cash lockups.', detail_hi: 'ITC मिलान को साप्ताहिक प्रक्रिया बनाने से तिमाही के अंत की अव्यवस्था और नकदी प्रवाह रुकावट समाप्त होती है।' },
          { principle: 'Vendor Governance as Financial Defense', principle_hi: 'वित्तीय रक्षा के रूप में विक्रेता प्रशासन', detail: 'Holding suppliers accountable to statutory filing schedules directly protects net operating margins.', detail_hi: 'आपूर्तिकर्ताओं को समय पर फाइलिंग के लिए उत्तरदायी बनाना शुद्ध परिचालन मार्जिन की सीधे सुरक्षा करता है।' },
          { principle: 'Annual AIS/TIS Pre-Auditing', principle_hi: 'वार्षिक AIS/TIS प्री-ऑडिटिंग', detail: 'Reconciling government tax statements continuously through the fiscal year eliminates Section 234A/B/C interest penalties.', detail_hi: 'सरकारी टैक्स विवरणों का पूरे वर्ष नियमित मिलान करने से Section 234A/B/C ब्याज दंड समाप्त हो जाता है।' }
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
    title_hi: 'Tally वित्तीय लेखांकन एवं इन्वेंटरी प्रबंधन प्रणाली',
    subtitle: 'Double-Entry Ledger Integrity, Multi-Godown Control & Bank Reconciliation',
    subtitle_hi: 'दोहरी प्रविष्टि बहीखाता अखंडता, मल्टी-गोदाम नियंत्रण व बैंक समाधान (BRS)',
    category: 'Corporate Accounting & ERP',
    category_hi: 'कॉर्पोरेट अकाउंटिंग एवं ERP',
    accentColor: '#FF4D6D',
    summary: 'Comprehensive double-entry general ledger architecture in Tally Prime, governing multi-location inventory godowns, electronic Bank Reconciliation Statements (BRS), and instant financial statement generation with zero unreconciled variances across ₹10Cr+ in transaction volume.',
    summary_hi: 'Tally Prime में व्यापक दोहरी प्रविष्टि सामान्य बहीखाता आर्किटेक्चर, बहु-स्थान इन्वेंटरी गोदामों, इलेक्ट्रॉनिक Bank Reconciliation Statements (BRS) और ₹10Cr+ वार्षिक लेन-देन में शून्य विसंगति के साथ त्वरित वित्तीय विवरण तैयार करने की प्रणाली।',
    executiveSummary_hi: 'Tally Prime में व्यापक दोहरी प्रविष्टि सामान्य बहीखाता आर्किटेक्चर, बहु-स्थान इन्वेंटरी गोदामों, इलेक्ट्रॉनिक Bank Reconciliation Statements (BRS) और ₹10Cr+ वार्षिक लेन-देन में शून्य विसंगति के साथ त्वरित वित्तीय विवरण तैयार करने की प्रणाली।',
    metrics: [
      { label: 'Ledger Accuracy', label_hi: 'बहीखाता सटीकता', val: '100%', desc: 'Double-entry balance verification', desc_hi: 'दोहरी प्रविष्टि शेष सत्यापन' },
      { label: 'Managed Volume', label_hi: 'प्रबंधित टर्नओवर', val: '₹10Cr+', desc: 'Annual commercial turnover tracked', desc_hi: 'वार्षिक व्यावसायिक टर्नओवर' },
      { label: 'Variance Record', label_hi: 'बैंक विसंगति', val: '0', desc: 'Unreconciled bank discrepancies', desc_hi: 'असमाधानित बैंक अंतर' },
      { label: 'Warehouse Hubs', label_hi: 'गोदाम केंद्र', val: '3', desc: 'Multi-godown inventory locations', desc_hi: 'मल्टी-गोदाम इन्वेंटरी हब' }
    ],
    techStack: ['Tally Prime', 'Tally.ERP 9', 'BRS Automation', 'Multi-Godown Valuation', 'MS Excel MIS', 'Audit Trails'],
    challenge_hi: {
      title_hi: 'बहु-डिपो इन्वेंटरी अंतर एवं वित्तीय क्लोजिंग में देरी',
      context_hi: 'क्षेत्रीय शाखाओं में तेज गति वाले वाणिज्यिक वितरण कार्यों में स्टॉक की कमी, पारगमन नुकसान और असंतुलित दोहरी प्रविष्टि खातों की गंभीर समस्या थी।',
      painPoints_hi: [
        'विभिन्न व्यावसायिक बैंक खातों में दर्जनों दैनिक RTGS, NEFT और चेक से निकासी होती थी, जिससे नियमित क्लीयरेंस विलंब होता था।',
        'अवर्गीकृत सस्पेंस खातों के कारण मासिक वित्तीय विवरण (Trading, P&L, Balance Sheet) क्लोजिंग 25 दिनों तक विलंबित होती थी।',
        'अदर्ज गोदाम स्थानांतरण के कारण भौतिक स्टॉक की मात्रा Tally बहीखाते से 4–6% तक भिन्न हो जाती थी।'
      ]
    },
    solution_hi: {
      title_hi: 'मानकीकृत चार्ट ऑफ अकाउंट्स एवं स्वचालित BRS पाइपलाइन',
      approach_hi: 'Tally Prime में चार्ट ऑफ अकाउंट्स को पुनर्गठित किया, मानकीकृत बहीखाता पदानुक्रम, सख्त वाउचर क्रमांकन और दैनिक इलेक्ट्रॉनिक बैंक विवरण समाधान स्थापित किया।',
      keyHighlights_hi: [
        { title_hi: 'इलेक्ट्रॉनिक BRS वर्कफ़्लो', desc_hi: 'स्वचालित बैंक विवरण पार्सिंग जो चेक नंबर, UTR संदर्भ कोड और राशि का त्वरित मिलान करती है।' },
        { title_hi: 'मल्टी-गोदाम FIFO नियंत्रण', desc_hi: 'डिस्पैच से पहले अनिवार्य गेट-पास सत्यापन के साथ बैच-वार FIFO इन्वेंटरी लागत नियंत्रण।' },
        { title_hi: 'सस्पेंस खातों का पूर्ण उन्मूलन', desc_hi: 'सभी जर्नल वाउचर पर सख्त सहायक दस्तावेज अनिवार्य कर सस्पेंस बैलेंस को स्थायी रूप से समाप्त किया।' }
      ],
      keyPillars_hi: [
        { title_hi: 'इलेक्ट्रॉनिक BRS वर्कफ़्लो', desc_hi: 'स्वचालित बैंक स्टेटमेंट मिलान एवं UTR ट्रैकिंग।' },
        { title_hi: 'मल्टी-गोदाम FIFO नियंत्रण', desc_hi: 'बैच-वार इन्वेंटरी मूल्यांकन और गेट-पास नियंत्रण।' },
        { title_hi: 'सस्पेंस खातों का उन्मूलन', desc_hi: 'सहायक दस्तावेजों के साथ वाउचर सत्यापन।' }
      ]
    },
    hurdles_hi: [
      {
        hurdle_hi: 'पीक लोडिंग घंटों के दौरान वेयरहाउस कर्मचारियों ने सख्त गेट-पास वाउचर प्रविष्टि का विरोध किया।',
        issue_hi: 'पीक लोडिंग घंटों के दौरान वेयरहाउस कर्मचारियों ने सख्त गेट-पास वाउचर प्रविष्टि का विरोध किया।',
        resolution_hi: 'सुव्यवस्थित बारकोडेड पिकिंग स्लिप्स और पूर्व-अधिकृत क्रेडिट डिस्पैच मैट्रिक्स लागू किए।'
      },
      {
        hurdle_hi: 'समवर्ती वाउचर प्रविष्टि के दौरान क्षेत्रीय शाखा में बिजली कटौती से डेटा भ्रष्टाचार का जोखिम था।',
        issue_hi: 'समवर्ती वाउचर प्रविष्टि के दौरान क्षेत्रीय शाखा में बिजली कटौती से डेटा भ्रष्टाचार का जोखिम था।',
        resolution_hi: 'चेकसम अखंडता सत्यापन के साथ प्रति घंटा स्वचालित स्थानीय और क्लाउड बैकअप मिरर कॉन्फ़िगर किए।'
      }
    ],
    impact_hi: {
      title_hi: 'तात्कालिक वित्तीय दृश्यता एवं त्रुटिहीन ऑडिट ट्रेल',
      beforeAfter_hi: [
        { metric_hi: 'महीने के अंत में क्लोजिंग समय', before_hi: '25 दिन', after_hi: 'रियल-टाइम (T+1)', delta_hi: '-96%' },
        { metric_hi: 'भौतिक बनाम बहीखाता स्टॉक अंतर', before_hi: '4–6% विसंगति', after_hi: '< 0.1% अंतर', delta_hi: '-98%' },
        { metric_hi: 'बैंक स्टेटमेंट क्लीयरेंस', before_hi: '10–15 दिन लंबित', after_hi: 'दैनिक (Same-Day)', delta_hi: '100% अद्यतन' }
      ],
      highlights_hi: [
        'शून्य दोहरी प्रविष्टि त्रुटि के साथ ₹10Cr+ वार्षिक लेन-देन का निर्बाध प्रबंधन।',
        '7+ वर्षों तक शून्य असमाधानित बैंक विसंगति का रिकॉर्ड बनाए रखा।',
        'ऑडिट-तैयार बैलेंस शीट और लाभ-हानि विवरण का त्वरित उत्पादन संभव बनाया।'
      ]
    },
    takeaways_hi: [
      { principle_hi: 'बहीखाता ही अंतिम सत्य है', detail_hi: 'त्रुटिहीन दोहरी प्रविष्टि अनुशासन वरिष्ठ प्रबंधन के निर्णयों के लिए तत्काल स्पष्टता प्रदान करता है।' },
      { principle_hi: 'दैनिक BRS आपातकालीन स्थिति को रोकता है', detail_hi: 'दैनिक इलेक्ट्रॉनिक समाधान बैंक शुल्क, विसंगति और चेक बाउंस को तुरंत पकड़ लेता है।' },
      { principle_hi: 'इन्वेंटरी सत्यता लोडिंग डॉक पर बनती है', detail_hi: 'वेयरहाउस डॉक सत्यापन प्रोटोकॉल लेखांकन मूल्यांकन में आगे आने वाली विसंगतियों को रोकता है।' }
    ],
    story: {
      challenge: {
        title: 'Multi-Depot Inventory Drift & Delayed Financial Closures',
        title_hi: 'बहु-डिपो इन्वेंटरी अंतर एवं वित्तीय क्लोजिंग में देरी',
        context: 'High-velocity commercial distribution operations across regional branches struggled with inventory stockouts, unaccounted transit damages, and desynchronized double-entry ledgers.',
        context_hi: 'क्षेत्रीय शाखाओं में तेज गति वाले वाणिज्यिक वितरण कार्यों में स्टॉक की कमी, पारगमन नुकसान और असंतुलित दोहरी प्रविष्टि खातों की गंभीर समस्या थी।',
        painPoints: [
          'Multiple commercial bank accounts handled dozens of daily RTGS, NEFT, and cheque transactions, resulting in chronic clearance delays.',
          'Monthly financial statement closures (Trading Account, P&L, Balance Sheet) were delayed by up to 25 days due to unclassified suspense accounts.',
          'Physical stock quantities diverged from Tally book values by 4–6% due to unrecorded godown transfers.'
        ],
        painPoints_hi: [
          'विभिन्न व्यावसायिक बैंक खातों में दर्जनों दैनिक RTGS, NEFT और चेक से निकासी होती थी, जिससे नियमित क्लीयरेंस विलंब होता था।',
          'अवर्गीकृत सस्पेंस खातों के कारण मासिक वित्तीय विवरण (Trading, P&L, Balance Sheet) क्लोजिंग 25 दिनों तक विलंबित होती थी।',
          'अदर्ज गोदाम स्थानांतरण के कारण भौतिक स्टॉक की मात्रा Tally बहीखाते से 4–6% तक भिन्न हो जाती थी।'
        ]
      },
      solution: {
        title: 'Standardized Chart of Accounts & Automated BRS Pipeline',
        title_hi: 'मानकीकृत चार्ट ऑफ अकाउंट्स एवं स्वचालित BRS पाइपलाइन',
        approach: 'Re-architected the institutional Chart of Accounts in Tally Prime, establishing standardized ledger hierarchies, strict voucher numbering, and daily electronic bank statement reconciliation.',
        approach_hi: 'Tally Prime में चार्ट ऑफ अकाउंट्स को पुनर्गठित किया, मानकीकृत बहीखाता पदानुक्रम, सख्त वाउचर क्रमांकन और दैनिक इलेक्ट्रॉनिक बैंक विवरण समाधान स्थापित किया।',
        keyPillars: [
          { title: 'Electronic BRS Workflow', title_hi: 'इलेक्ट्रॉनिक BRS वर्कफ़्लो', desc: 'Automated bank statement parsing that cross-matches cheque numbers, UTR reference codes, and values.', desc_hi: 'स्वचालित बैंक स्टेटमेंट मिलान एवं UTR संदर्भ कोड ट्रैकिंग।' },
          { title: 'Multi-Godown FIFO Controls', title_hi: 'मल्टी-गोदाम FIFO नियंत्रण', desc: 'Enforced batch-wise FIFO inventory costing with mandatory gate-pass voucher verification before dispatch.', desc_hi: 'बैच-वार FIFO इन्वेंटरी लागत और गेट-पास वाउचर सत्यापन।' },
          { title: 'Suspense Account Eradication', title_hi: 'सस्पेंस खातों का उन्मूलन', desc: 'Mandated strict supporting document attachments on all journal vouchers, permanently eliminating suspense balances.', desc_hi: 'सख्त सहायक दस्तावेजों के साथ वाउचर सत्यापन।' }
        ]
      },
      techAndObstacles: {
        title: 'Field Resistance & Data Synchronization Challenges',
        title_hi: 'फ़ील्ड प्रतिरोध एवं डेटा समन्वयन चुनौतियां',
        stack: [
          { name: 'Tally Prime & Tally.ERP 9', role: 'Core financial accounting and inventory management engine', role_hi: 'कोर वित्तीय लेखांकन एवं इन्वेंटरी प्रबंधन इंजन' },
          { name: 'TDL Customizations', role: 'Custom field validations and mandatory voucher approval workflows', role_hi: 'कस्टम फील्ड सत्यापन और अनिवार्य वाउचर अनुमोदन वर्कफ़्लो' },
          { name: 'MS Excel MIS Models', role: 'Daily ledger aging dashboards and cash runway forecasting', role_hi: 'दैनिक बहीखाता आयु डैशबोर्ड और नकदी प्रवाह पूर्वानुमान' }
        ],
        obstacles: [
          {
            hurdle: 'Warehouse personnel resisted strict dispatch gate-pass voucher entry during peak loading hours.',
            hurdle_hi: 'पीक लोडिंग घंटों के दौरान वेयरहाउस कर्मचारियों ने सख्त गेट-पास वाउचर प्रविष्टि का विरोध किया।',
            issue_hi: 'पीक लोडिंग घंटों के दौरान वेयरहाउस कर्मचारियों ने सख्त गेट-पास वाउचर प्रविष्टि का विरोध किया।',
            resolution: 'Implemented streamlined barcoded picking slips and pre-authorized credit dispatch matrices.',
            resolution_hi: 'सुव्यवस्थित बारकोडेड पिकिंग स्लिप्स और पूर्व-अधिकृत क्रेडिट डिस्पैच मैट्रिक्स लागू किए।'
          },
          {
            hurdle: 'Regional branch power outages during concurrent voucher entry risked ledger data corruption.',
            hurdle_hi: 'समवर्ती वाउचर प्रविष्टि के दौरान क्षेत्रीय शाखा में बिजली कटौती से डेटा भ्रष्टाचार का जोखिम था।',
            issue_hi: 'समवर्ती वाउचर प्रविष्टि के दौरान क्षेत्रीय शाखा में बिजली कटौती से डेटा भ्रष्टाचार का जोखिम था।',
            resolution: 'Configured automated hourly local and cloud backup mirrors with checksum integrity validation.',
            resolution_hi: 'चेकसम अखंडता सत्यापन के साथ प्रति घंटा स्वचालित स्थानीय और क्लाउड बैकअप मिरर कॉन्फ़िगर किए।'
          }
        ]
      },
      resultsAndMetrics: {
        title: 'Instant Financial Visibility & Perfect Audit Trail',
        title_hi: 'तात्कालिक वित्तीय दृश्यता एवं त्रुटिहीन ऑडिट ट्रेल',
        beforeVsAfter: [
          { metric: 'Month-End Closure Lag', metric_hi: 'महीने के अंत में क्लोजिंग समय', before: '25 Days', before_hi: '25 दिन', after: 'Real-Time (T+1)', after_hi: 'रियल-टाइम (T+1)', delta: '-96%', delta_hi: '-96%' },
          { metric: 'Physical vs Book Stock Variance', metric_hi: 'भौतिक बनाम बहीखाता स्टॉक अंतर', before: '4–6% Discrepancy', before_hi: '4–6% विसंगति', after: '< 0.1% Variance', after_hi: '< 0.1% अंतर', delta: '-98%', delta_hi: '-98%' },
          { metric: 'Bank Statement Clearance', metric_hi: 'बैंक स्टेटमेंट क्लीयरेंस', before: '10–15 Days Backlog', before_hi: '10–15 दिन लंबित', after: 'Daily Same-Day', after_hi: 'दैनिक (Same-Day)', delta: '100% Current', delta_hi: '100% अद्यतन' }
        ],
        highlights: [
          '₹10Cr+ in annual transaction volume seamlessly managed with zero double-entry errors.',
          'Maintained zero unreconciled bank discrepancies over 7+ consecutive years.',
          'Enabled instantaneous generation of audit-ready Balance Sheets and Profit & Loss statements.'
        ],
        highlights_hi: [
          'शून्य दोहरी प्रविष्टि त्रुटि के साथ ₹10Cr+ वार्षिक लेन-देन का निर्बाध प्रबंधन।',
          '7+ वर्षों तक शून्य असमाधानित बैंक विसंगति का रिकॉर्ड बनाए रखा।',
          'ऑडिट-तैयार बैलेंस शीट और लाभ-हानि विवरण का त्वरित उत्पादन संभव बनाया।'
        ]
      },
      lessonsLearned: {
        title: 'Core Tenets of Disciplined Financial Accounting',
        title_hi: 'अनुशासित वित्तीय लेखांकन के मूल सिद्धांत',
        takeaways: [
          { principle: 'The Ledger is the Single Truth', principle_hi: 'बहीखाता ही अंतिम सत्य है', detail: 'Impeccable double-entry discipline provides immediate clarity for senior management decision-making.', detail_hi: 'त्रुटिहीन दोहरी प्रविष्टि अनुशासन वरिष्ठ प्रबंधन के निर्णयों के लिए तत्काल स्पष्टता प्रदान करता है।' },
          { principle: 'Daily BRS Eliminates Firefighting', principle_hi: 'दैनिक BRS आपातकालीन स्थिति को रोकता है', detail: 'Daily electronic reconciliation catches bank fees, fraud, and bounce charges instantly.', detail_hi: 'दैनिक इलेक्ट्रॉनिक समाधान बैंक शुल्क, विसंगति और चेक बाउंस को तुरंत पकड़ लेता है।' },
          { principle: 'Inventory Truth is Built at the Dock', principle_hi: 'इन्वेंटरी सत्यता लोडिंग डॉक पर बनती है', detail: 'Warehouse dock verification protocols prevent accounting valuation discrepancies downstream.', detail_hi: 'वेयरहाउस डॉक सत्यापन प्रोटोकॉल लेखांकन मूल्यांकन में आगे आने वाली विसंगतियों को रोकता है।' }
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
    title_hi: 'DAY-NULM स्किल इंडिया MIS रिपोर्टिंग पोर्टल',
    subtitle: 'National Livelihoods Mission Candidate Lifecycle & Biometric Sync',
    subtitle_hi: 'राष्ट्रीय आजीविका मिशन उम्मीदवार जीवन-चक्र एवं बायोमेट्रिक समन्वयन',
    category: 'Public Sector MIS & Analytics',
    category_hi: 'सार्वजनिक क्षेत्र MIS एवं एनालिटिक्स',
    accentColor: '#3B82F6',
    summary: 'Public sector operational MIS database and candidate tracking portal for the Deendayal Antyodaya Yojana - National Urban Livelihoods Mission, managing 2,500+ candidates across 50+ batches with 99.8% reporting accuracy and 100% portal synchronization.',
    summary_hi: 'दीनदयाल अंत्योदय योजना - राष्ट्रीय शहरी आजीविका मिशन (DAY-NULM) के लिए सार्वजनिक क्षेत्र का परिचालन MIS डेटाबेस एवं ट्रैकिंग पोर्टल, जिसमें 50+ बैचों में 2,500+ उम्मीदवारों का 99.8% रिपोर्टिंग सटीकता और 100% पोर्टल सिंक्रनाइज़ेशन के साथ प्रबंधन किया गया।',
    executiveSummary_hi: 'दीनदयाल अंत्योदय योजना - राष्ट्रीय शहरी आजीविका मिशन (DAY-NULM) के लिए सार्वजनिक क्षेत्र का परिचालन MIS डेटाबेस एवं ट्रैकिंग पोर्टल, जिसमें 50+ बैचों में 2,500+ उम्मीदवारों का 99.8% रिपोर्टिंग सटीकता और 100% पोर्टल सिंक्रनाइज़ेशन के साथ प्रबंधन किया गया।',
    metrics: [
      { label: 'Batches Managed', label_hi: 'प्रबंधित बैच', val: '50+', desc: 'Government training batches tracked', desc_hi: 'ट्रैक किए गए सरकारी प्रशिक्षण बैच' },
      { label: 'Trainees Certified', label_hi: 'प्रमाणित प्रशिक्षु', val: '2,500+', desc: 'Candidates trained & certified', desc_hi: 'प्रशिक्षित एवं प्रमाणित उम्मीदवार' },
      { label: 'Reporting Accuracy', label_hi: 'रिपोर्टिंग सटीकता', val: '99.8%', desc: 'SDMS portal audit pass rate', desc_hi: 'SDMS पोर्टल ऑडिट उत्तीर्ण दर' },
      { label: 'Funding Approval', label_hi: 'अनुदान स्वीकृति', val: '100%', desc: 'Zero batch disbursement rejections', desc_hi: 'शून्य बैच भुगतान अस्वीकृति' }
    ],
    techStack: ['Skill India SDMS', 'DAY-NULM Portal', 'AEBAS Biometric System', 'Advanced Excel VBA', 'DUDA Schemas', 'Aadhaar Vault'],
    challenge_hi: {
      title_hi: 'सख्त सार्वजनिक क्षेत्र अनुपालन एवं डेटा विखंडन',
      context_hi: 'आवासन और शहरी कार्य मंत्रालय के अंतर्गत, DAY-NULM मिशन ने शहरी गरीब युवाओं के नामांकन, दैनिक बायोमेट्रिक उपस्थिति, मूल्यांकन और 12 महीने के प्लेसमेंट-उपरांत सख्त जीवन-चक्र ट्रैकिंग अनिवार्य की।',
      painPoints_hi: [
        'प्रशिक्षण केंद्र की फंडिंग का भुगतान राष्ट्रीय SDMS पोर्टल पर >70% बायोमेट्रिक उपस्थिति बनाए रखने से सीधे जुड़ा था।',
        'मैन्युअल कागजी उपस्थिति से डेटा प्रविष्टि त्रुटियां हुईं, जिससे जिला शहरी विकास एजेंसियों (DUDAs) द्वारा बैच अस्वीकार हो जाते थे।',
        'अनियमित उपस्थिति वाले उम्मीदवारों को आधिकारिक सेक्टर स्किल काउंसिल मूल्यांकन से ठीक पहले अयोग्य घोषित होने का जोखिम था।'
      ]
    },
    solution_hi: {
      title_hi: 'केंद्रीकृत प्रशिक्षु पाइपलाइन एवं स्वचालित उपस्थिति रडार',
      approach_hi: 'उम्मीदवार पंजीकरण, दैनिक बायोमेट्रिक लॉग और सरकारी पोर्टल अपलोड को एकीकृत करने वाला एक केंद्रीकृत परिचालन MIS डेटाबेस और स्वचालित उपस्थिति अलर्ट इंजन तैयार किया।',
      keyHighlights_hi: [
        { title_hi: 'उपस्थिति सीमा रडार (Threshold Radar)', desc_hi: 'आधिकारिक मूल्यांकन से दो सप्ताह पहले 70% से कम उपस्थिति वाले प्रशिक्षुओं को स्वचालित रूप से चिह्नित करता है।' },
        { title_hi: 'पोर्टल XML/CSV जेनरेटर', desc_hi: 'DUDA और SDMS सर्वर सत्यापन नियमों से 100% मेल खाने वाले पूर्व-प्रारूपित स्कीमा निर्यात उपकरण।' },
        { title_hi: '12-माह प्लेसमेंट डॉजियर', desc_hi: 'नियुक्ति पत्र, वेतन पर्ची और बैंक खाते के क्रेडिट को ट्रैक करने वाला डिजिटल सत्यापन भंडार।' }
      ],
      keyPillars_hi: [
        { title_hi: 'उपस्थिति सीमा रडार', desc_hi: '70% से कम उपस्थिति वाले छात्रों की समय पूर्व पहचान।' },
        { title_hi: 'पोर्टल स्कीमा जेनरेटर', desc_hi: 'DUDA और SDMS सत्यापन से मेल खाने वाले डेटा एक्सपोर्ट।' },
        { title_hi: '12-माह प्लेसमेंट डॉजियर', desc_hi: 'वेतन पर्चियों और बैंक क्रेडिट का डिजिटल सत्यापन।' }
      ]
    },
    hurdles_hi: [
      {
        hurdle_hi: 'शारीरिक श्रम करने वाले उम्मीदवारों की घिसी हुई उंगलियों के कारण बायोमेट्रिक स्कैनर बार-बार विफल होते थे।',
        issue_hi: 'शारीरिक श्रम करने वाले उम्मीदवारों की घिसी हुई उंगलियों के कारण बायोमेट्रिक स्कैनर बार-बार विफल होते थे।',
        resolution_hi: 'UIDAI दिशानिर्देशों के अनुरूप द्वितीयक आधार-लिंक्ड OTP और आईरिस स्कैनिंग सत्यापन प्रोटोकॉल पेश किया।'
      },
      {
        hurdle_hi: 'क्षेत्रीय इंटरनेट कनेक्टिविटी में आवधिक व्यवधान से दैनिक उपस्थिति अपलोड में देरी होती थी।',
        issue_hi: 'क्षेत्रीय इंटरनेट कनेक्टिविटी में आवधिक व्यवधान से दैनिक उपस्थिति अपलोड में देरी होती थी।',
        resolution_hi: 'एक ऑफलाइन-फर्स्ट SQLite स्टेजिंग कैश तैयार किया जिसने क्रिप्टोग्राफ़िक टाइमस्टैम्प के साथ लॉग को कतारबद्ध किया और पुनः कनेक्शन पर स्वतः समन्वयित किया।'
      }
    ],
    impact_hi: {
      title_hi: 'शून्य मील का पत्थर अस्वीकृति एवं रिकॉर्ड उम्मीदवार प्रमाणन',
      beforeAfter_hi: [
        { metric_hi: 'बैच डेटा प्रोसेसिंग विलंब', before_hi: '15–20 दिन', after_hi: '< 24 घंटे', delta_hi: '-93%' },
        { metric_hi: 'उम्मीदवार अयोग्यता दर', before_hi: '6–8% प्रति बैच', after_hi: '< 0.2%', delta_hi: '-97%' },
        { metric_hi: 'सरकारी पोर्टल ऑडिट आपत्तियां', before_hi: 'बारंबार आपत्तियां', after_hi: 'शून्य अस्वीकृति', delta_hi: '100% स्वीकृति' }
      ],
      highlights_hi: [
        '2,500+ प्रमाणित प्रशिक्षुओं के साथ 50+ प्रशिक्षण बैचों का सफलतापूर्वक प्रबंधन।',
        'सभी राज्य DUDA प्रस्तुतियों में 99.8% रिपोर्टिंग सटीकता हासिल की।',
        'शून्य सरकारी फंडिंग कटौती के साथ 100% अनुदान संवितरण सुरक्षित किया।'
      ]
    },
    takeaways_hi: [
      { principle_hi: 'डेटा गुणवत्ता लाभार्थियों को सशक्त बनाती है', detail_hi: 'सटीक डेटा ट्रैकिंग सीधे सुनिश्चित करती है कि वंचित युवाओं को वजीफा और प्रमाणित रोजगार मिले।' },
      { principle_hi: 'प्रारंभिक विसंगति पहचान बैचों को बचाती है', detail_hi: 'दैनिक उपस्थिति की निगरानी उम्मीदवारों को गैर-परक्राम्य वैधानिक सीमा से नीचे जाने से रोकती है।' },
      { principle_hi: 'ऑफलाइन-फर्स्ट आर्किटेक्चर अनिवार्य है', detail_hi: 'अर्ध-शहरी भारत में तैनात सिस्टम क्लाउड कनेक्टिविटी पर निर्भर होने से पहले स्थानीय स्तर पर मजबूती से काम करने चाहिए।' }
    ],
    story: {
      challenge: {
        title: 'Rigorous Public Sector Compliance & Data Fragmentation',
        title_hi: 'सख्त सार्वजनिक क्षेत्र अनुपालन एवं डेटा विखंडन',
        context: 'Under the Ministry of Housing and Urban Affairs, the DAY-NULM mission mandated strict lifecycle tracking of urban poor youth across mobilization, daily biometric attendance, assessment, and 12-month post-placement.',
        context_hi: 'आवासन और शहरी कार्य मंत्रालय के अंतर्गत, DAY-NULM मिशन ने शहरी गरीब युवाओं के नामांकन, दैनिक बायोमेट्रिक उपस्थिति, मूल्यांकन और 12 महीने के प्लेसमेंट-उपरांत सख्त जीवन-चक्र ट्रैकिंग अनिवार्य की।',
        painPoints: [
          'Center funding disbursements were strictly tied to maintaining >70% biometric attendance on the national SDMS portal.',
          'Manual paper attendance caused transcription errors, resulting in batch rejections from District Urban Development Agencies (DUDAs).',
          'Candidates with irregular attendance risked disqualification right before official Sector Skill Council assessments.'
        ],
        painPoints_hi: [
          'प्रशिक्षण केंद्र की फंडिंग का भुगतान राष्ट्रीय SDMS पोर्टल पर >70% बायोमेट्रिक उपस्थिति बनाए रखने से सीधे जुड़ा था।',
          'मैन्युअल कागजी उपस्थिति से डेटा प्रविष्टि त्रुटियां हुईं, जिससे जिला शहरी विकास एजेंसियों (DUDAs) द्वारा बैच अस्वीकार हो जाते थे।',
          'अनियमित उपस्थिति वाले उम्मीदवारों को आधिकारिक सेक्टर स्किल काउंसिल मूल्यांकन से ठीक पहले अयोग्य घोषित होने का जोखिम था।'
        ]
      },
      solution: {
        title: 'Centralized Trainee Pipeline & Automated Threshold Radar',
        title_hi: 'केंद्रीकृत प्रशिक्षु पाइपलाइन एवं स्वचालित उपस्थिति रडार',
        approach: 'Architected a centralized operational MIS database and automated attendance alert engine integrating candidate registration, daily biometric logs, and government portal uploads.',
        approach_hi: 'उम्मीदवार पंजीकरण, दैनिक बायोमेट्रिक लॉग और सरकारी पोर्टल अपलोड को एकीकृत करने वाला एक केंद्रीकृत परिचालन MIS डेटाबेस और स्वचालित उपस्थिति अलर्ट इंजन तैयार किया।',
        keyPillars: [
          { title: 'Attendance Threshold Radar', title_hi: 'उपस्थिति सीमा रडार', desc: 'Automated algorithms flagging trainees below 70% attendance two weeks prior to official assessment lock-ins.', desc_hi: '70% से कम उपस्थिति वाले छात्रों की समय पूर्व पहचान।' },
          { title: 'Portal XML/CSV Generators', title_hi: 'पोर्टल स्कीमा जेनरेटर', desc: 'Pre-formatted schema export utilities matching exact DUDA and SDMS server validation rules.', desc_hi: 'DUDA और SDMS सत्यापन से मेल खाने वाले डेटा एक्सपोर्ट।' },
          { title: '12-Month Placement Dossier', title_hi: '12-माह प्लेसमेंट डॉजियर', desc: 'Digital verification repository tracking appointment letters, salary slips, and bank account credits.', desc_hi: 'वेतन पर्चियों और बैंक क्रेडिट का डिजिटल सत्यापन।' }
        ]
      },
      techAndObstacles: {
        title: 'Biometric Scanner Failures & Rural Internet Outages',
        title_hi: 'बायोमेट्रिक स्कैनर विफलता एवं ग्रामीण इंटरनेट व्यवधान',
        stack: [
          { name: 'Central Government SDMS', role: 'National candidate registration and certification portal', role_hi: 'राष्ट्रीय उम्मीदवार पंजीकरण एवं प्रमाणन पोर्टल' },
          { name: 'DAY-NULM State MIS', role: 'Jharkhand State urban livelihood monitoring portal', role_hi: 'झारखंड राज्य शहरी आजीविका निगरानी पोर्टल' },
          { name: 'AEBAS Hardware & Excel VBA', role: 'Biometric fingerprint capture and automated batch processing macros', role_hi: 'बायोमेट्रिक फिंगरप्रिंट कैप्चर और स्वचालित बैच प्रोसेसिंग मैक्रोज़' }
        ],
        obstacles: [
          {
            hurdle: 'Biometric fingerprint scanners failed on manual-labor candidates with worn fingerprint ridges.',
            hurdle_hi: 'शारीरिक श्रम करने वाले उम्मीदवारों की घिसी हुई उंगलियों के कारण बायोमेट्रिक स्कैनर बार-बार विफल होते थे।',
            issue_hi: 'शारीरिक श्रम करने वाले उम्मीदवारों की घिसी हुई उंगलियों के कारण बायोमेट्रिक स्कैनर बार-बार विफल होते थे।',
            resolution: 'Introduced secondary Aadhaar-linked OTP and iris scanning verification protocols compliant with UIDAI guidelines.',
            resolution_hi: 'UIDAI दिशानिर्देशों के अनुरूप द्वितीयक आधार-लिंक्ड OTP और आईरिस स्कैनिंग सत्यापन प्रोटोकॉल पेश किया।'
          },
          {
            hurdle: 'Periodic regional internet connectivity outages delayed daily attendance uploads.',
            hurdle_hi: 'क्षेत्रीय इंटरनेट कनेक्टिविटी में आवधिक व्यवधान से दैनिक उपस्थिति अपलोड में देरी होती थी।',
            issue_hi: 'क्षेत्रीय इंटरनेट कनेक्टिविटी में आवधिक व्यवधान से दैनिक उपस्थिति अपलोड में देरी होती थी।',
            resolution: 'Engineered an offline-first SQLite staging cache that queued attendance logs with cryptographic timestamps and auto-synced upon reconnection.',
            resolution_hi: 'एक ऑफलाइन-फर्स्ट SQLite स्टेजिंग कैश तैयार किया जिसने क्रिप्टोग्राफ़िक टाइमस्टैम्प के साथ लॉग को कतारबद्ध किया और पुनः कनेक्शन पर स्वतः समन्वयित किया।'
          }
        ]
      },
      resultsAndMetrics: {
        title: 'Zero Milestone Rejections & Record Candidate Certification',
        title_hi: 'शून्य मील का पत्थर अस्वीकृति एवं रिकॉर्ड उम्मीदवार प्रमाणन',
        beforeVsAfter: [
          { metric: 'Batch Data Processing Lag', metric_hi: 'बैच डेटा प्रोसेसिंग विलंब', before: '15–20 Days', before_hi: '15–20 दिन', after: '< 24 Hours', after_hi: '< 24 घंटे', delta: '-93%', delta_hi: '-93%' },
          { metric: 'Candidate Disqualification Rate', metric_hi: 'उम्मीदवार अयोग्यता दर', before: '6–8% per Batch', before_hi: '6–8% प्रति बैच', after: '< 0.2%', after_hi: '< 0.2%', delta: '-97%', delta_hi: '-97%' },
          { metric: 'Government Portal Audit Queries', metric_hi: 'सरकारी पोर्टल ऑडिट आपत्तियां', before: 'Frequent Objections', before_hi: 'बारंबार आपत्तियां', after: 'Zero Rejections', after_hi: 'शून्य अस्वीकृति', delta: '100% Approval', delta_hi: '100% स्वीकृति' }
        ],
        highlights: [
          '50+ training batches successfully managed with 2,500+ trainees certified.',
          'Achieved 99.8% reporting accuracy across all state DUDA submissions.',
          'Secured 100% milestone grant disbursements with zero government funding clawbacks.'
        ],
        highlights_hi: [
          '2,500+ प्रमाणित प्रशिक्षुओं के साथ 50+ प्रशिक्षण बैचों का सफलतापूर्वक प्रबंधन।',
          'सभी राज्य DUDA प्रस्तुतियों में 99.8% रिपोर्टिंग सटीकता हासिल की।',
          'शून्य सरकारी फंडिंग कटौती के साथ 100% अनुदान संवितरण सुरक्षित किया।'
        ]
      },
      lessonsLearned: {
        title: 'Strategic Takeaways from Grassroots Public Sector MIS',
        title_hi: 'सार्वजनिक क्षेत्र MIS से रणनीतिक सीख',
        takeaways: [
          { principle: 'Data Quality Empowers Beneficiaries', principle_hi: 'डेटा गुणवत्ता लाभार्थियों को सशक्त बनाती है', detail: 'Accurate data tracking directly ensures that underprivileged youth receive stipends and certified placements.', detail_hi: 'सटीक डेटा ट्रैकिंग सीधे सुनिश्चित करती है कि वंचित युवाओं को वजीफा और प्रमाणित रोजगार मिले।' },
          { principle: 'Early Anomaly Detection Saves Batches', principle_hi: 'प्रारंभिक विसंगति पहचान बैचों को बचाती है', detail: 'Monitoring attendance daily prevents candidates from slipping below non-negotiable statutory thresholds.', detail_hi: 'दैनिक उपस्थिति की निगरानी उम्मीदवारों को गैर-परक्राम्य वैधानिक सीमा से नीचे जाने से रोकती है।' },
          { principle: 'Offline-First Architecture is Vital', principle_hi: 'ऑफलाइन-फर्स्ट आर्किटेक्चर अनिवार्य है', detail: 'Systems deployed in semi-urban India must function reliably offline before relying on cloud connectivity.', detail_hi: 'अर्ध-शहरी भारत में तैनात सिस्टम क्लाउड कनेक्टिविटी पर निर्भर होने से पहले स्थानीय स्तर पर मजबूती से काम करने चाहिए।' }
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
    title_hi: 'बहु-जिला स्मार्ट कार्ड संचालन एवं नागरिक नामांकन प्रणाली',
    subtitle: 'Biometric Enrollment, PKI Chip Personalization & Field Logistics',
    subtitle_hi: 'बायोमेट्रिक नामांकन, PKI चिप पर्सनलाइजेशन एवं फ़ील्ड लॉजिस्टिक्स',
    category: 'Citizen Identity & Field Ops',
    category_hi: 'नागरिक पहचान एवं फ़ील्ड ऑपरेशंस',
    accentColor: '#3B82F6',
    summary: 'High-throughput citizen smart card enrollment, cryptographic personalization, and field logistics system across 4 high-terrain administrative districts in Bihar and Jharkhand, issuing 50,000+ verified cards with a 35% reduction in turnaround time and zero data loss.',
    summary_hi: 'बिहार और झारखंड के 4 कठिन भौगोलिक जिलों में उच्च-गति नागरिक स्मार्ट कार्ड नामांकन, चिप पर्सनलाइजेशन और फील्ड लॉजिस्टिक्स प्रणाली, जिसके तहत 35% कम समय में शून्य डेटा हानि के साथ 50,000+ सत्यापित स्मार्ट कार्ड जारी किए गए।',
    executiveSummary_hi: 'बिहार और झारखंड के 4 कठिन भौगोलिक जिलों में उच्च-गति नागरिक स्मार्ट कार्ड नामांकन, चिप पर्सनलाइजेशन और फील्ड लॉजिस्टिक्स प्रणाली, जिसके तहत 35% कम समय में शून्य डेटा हानि के साथ 50,000+ सत्यापित स्मार्ट कार्ड जारी किए गए।',
    metrics: [
      { label: 'Cards Issued', label_hi: 'जारी स्मार्ट कार्ड', val: '50,000+', desc: 'Verified citizen smart cards', desc_hi: 'सत्यापित नागरिक स्मार्ट कार्ड' },
      { label: 'Districts Covered', label_hi: 'प्रशासित जिले', val: '4', desc: 'Palamau, Garhwa, Gaya, Aurangabad', desc_hi: 'पलामू, गढ़वा, गया, औरंगाबाद' },
      { label: 'Cycle Time', label_hi: 'समय चक्र में कमी', val: '-35%', desc: 'Turnaround time accelerated', desc_hi: 'टर्नअराउंड समय में त्वरित कमी' },
      { label: 'Defect Rate', label_hi: 'कार्ड दोष दर', val: '< 0.2%', desc: 'Card encoding defect rate', desc_hi: 'कार्ड एन्कोडिंग दोष दर' }
    ],
    techStack: ['ISO 7816 / JavaCard', 'STQC Biometric Scanners', 'Thermal Dye Printers', 'Hardware Diagnostics', 'Encrypted Batch Sync', 'Field Operations'],
    challenge_hi: {
      title_hi: 'जमीनी लॉजिस्टिक्स एवं विषम पर्यावरणीय बाधाएं',
      context_hi: 'बिहार और झारखंड के 4 प्रशासनिक जिलों में स्वास्थ्य बीमा और नागरिक पहचान स्मार्ट कार्ड जारी करने के लिए शून्य इंटरनेट कनेक्टिविटी वाले सुदूर ग्रामीण पंचायतों में मोबाइल फील्ड कैंप स्थापित करने की आवश्यकता थी।',
      painPoints_hi: [
        'कैंप स्थानांतरण के दौरान दोहरे नागरिक पंजीकरण और जनसांख्यिकीय डेटा भ्रष्ट होने का उच्च जोखिम था।',
        'ग्रामीण धूल, अत्यधिक गर्मी और बिजली की भारी कमी के कारण थर्मल कार्ड प्रिंटर और ऑप्टिकल स्कैनर बार-बार खराब होते थे।',
        'पारंपरिक कागजी कार्ड जारी करने में 45 दिन तक का समय लगता था, जिससे नागरिक असंतोष और सरकारी योजना में देरी होती थी।'
      ]
    },
    solution_hi: {
      title_hi: 'ऑफलाइन-फर्स्ट वितरित पाइपलाइन एवं हार्डवेयर ट्राइएज मानक',
      approach_hi: 'क्रिप्टोग्राफ़िक स्थानीय डेटाबेस, स्वचालित डुप्लीकेशन रोकथाम और फ़ील्ड हार्डवेयर रखरखाव प्रोटोकॉल का उपयोग करते हुए एक मजबूत ऑफलाइन-फर्स्ट फील्ड ऑपरेशंस पाइपलाइन तैयार की।',
      keyHighlights_hi: [
        { title_hi: 'ऑफलाइन क्रिप्टोग्राफ़िक स्टेजिंग', desc_hi: 'SHA-256 फिंगरप्रिंट सत्यापन के साथ एन्क्रिप्टेड स्थानीय SQLite स्टोरेज जो स्थानीय दोहरे पंजीकरण को रोकता है।' },
        { title_hi: 'हार्डवेयर रखरखाव मानक (SOP)', desc_hi: 'मोबाइल कैंप ऑपरेटरों को 10 मिनट के भीतर थर्मल प्रिंट हेड को कैलिब्रेट करने और ऑप्टिकल प्रिज्म साफ करने का प्रशिक्षण।' },
        { title_hi: 'फ़ील्ड पर ही कार्ड पर्सनलाइजेशन', desc_hi: 'स्मार्ट कार्ड माइक्रोचिप्स (ISO 7816) की कोडिंग और थर्मल प्रिंटिंग को एक ही पास में पूरा करने वाला एकीकृत वर्कफ़्लो।' }
      ],
      keyPillars_hi: [
        { title_hi: 'ऑफलाइन क्रिप्टोग्राफ़िक स्टेजिंग', desc_hi: 'SHA-256 सत्यापन युक्त स्थानीय डेटाबेस।' },
        { title_hi: 'हार्डवेयर रखरखाव मानक (SOP)', desc_hi: '10 मिनट में थर्मल प्रिंटर और स्कैनर ट्राइएज।' },
        { title_hi: 'ऑन-फ़ील्ड पर्सनलाइजेशन', desc_hi: 'एक ही पास में चिप कोडिंग और थर्मल प्रिंटिंग।' }
      ]
    },
    hurdles_hi: [
      {
        hurdle_hi: 'ग्रामीण धूल के जमाव के कारण थर्मल प्रिंट हेड बार-बार अत्यधिक गर्म होकर जाम हो जाते थे।',
        issue_hi: 'ग्रामीण धूल के जमाव के कारण थर्मल प्रिंट हेड बार-बार अत्यधिक गर्म होकर जाम हो जाते थे।',
        resolution_hi: 'मोबाइल टीमों को डेसिकेंट सुरक्षा युक्त सीलबंद डस्ट-प्रूफ ट्रांजिट बॉक्स और पोर्टेबल सोलर-इन्वर्टर बैटरी सिस्टम से लैस किया।'
      },
      {
        hurdle_hi: 'सरकारी पहचान पत्र न होने वाले ग्रामीणों को जनसांख्यिकीय क्रेडेंशियल साबित करने में कठिनाई हुई।',
        issue_hi: 'सरकारी पहचान पत्र न होने वाले ग्रामीणों को जनसांख्यिकीय क्रेडेंशियल साबित करने में कठिनाई हुई।',
        resolution_hi: 'राज्य सरकार के दिशा-निर्देशों के अनुरूप ग्राम पंचायत मुखिया/प्रधान सत्यापन प्रोटोकॉल स्थापित किया।'
      }
    ],
    impact_hi: {
      title_hi: '50,000+ नागरिकों को सुरक्षित डिजिटल पहचान से सशक्त बनाया',
      beforeAfter_hi: [
        { metric_hi: 'पंजीकरण से कार्ड डिलीवरी', before_hi: '45 दिन', after_hi: '< 29 दिन', delta_hi: '-35%' },
        { metric_hi: 'कार्ड एन्कोडिंग दोष दर', before_hi: '5.2%', after_hi: '< 0.2%', delta_hi: '-96%' },
        { metric_hi: 'डेटा विसंगति / नुकसान घटनाएं', before_hi: 'बारंबार पुनः स्कैन', after_hi: 'शून्य (0%)', delta_hi: 'पूरी तरह समाप्त' }
      ],
      highlights_hi: [
        'पलामू, गढ़वा, गया और औरंगाबाद में 50,000+ सत्यापित स्मार्ट कार्ड जारी किए गए।',
        '12 महीने के गहन फील्ड ऑपरेशंस में शून्य डेटा हानि की उपलब्धि दर्ज की।',
        'पीक पंचायत कैंपों के दौरान 88 कार्ड प्रति मिनट की उच्च एन्कोडिंग गति बनाए रखी।'
      ]
    },
    takeaways_hi: [
      { principle_hi: 'हार्डवेयर रखरखाव भी सॉफ्टवेयर इंजीनियरिंग है', detail_hi: 'निवारक फील्ड हार्डवेयर रखरखाव प्रोटोकॉल सॉफ्टवेयर कोड स्थिरता जितना ही महत्वपूर्ण है।' },
      { principle_hi: 'टैम्पर-प्रूफ बैच मैनिफेस्ट', detail_hi: 'क्रिप्टोग्राफ़िक बैच साइनिंग कैंप से जिला मुख्यालय तक ट्रांजिट के दौरान डेटा से छेड़छाड़ रोकती है।' },
      { principle_hi: 'ऑपरेटर सहानुभूति सफलता की कुंजी है', detail_hi: 'सरल दृश्य त्रुटि संकेत फील्ड ऑपरेटरों को स्वतंत्र रूप से तकनीकी समस्याओं को हल करने में सक्षम बनाते हैं।' }
    ],
    story: {
      challenge: {
        title: 'Grassroots Logistics & Severe Environmental Obstacles',
        title_hi: 'जमीनी लॉजिस्टिक्स एवं विषम पर्यावरणीय बाधाएं',
        context: 'Rolling out citizen smart cards (health insurance and public identity cards) across 4 administrative districts in Bihar and Jharkhand required setting up mobile field camps in remote panchayats with zero network connectivity.',
        context_hi: 'बिहार और झारखंड के 4 प्रशासनिक जिलों में स्वास्थ्य बीमा और नागरिक पहचान स्मार्ट कार्ड जारी करने के लिए शून्य इंटरनेट कनेक्टिविटी वाले सुदूर ग्रामीण पंचायतों में मोबाइल फील्ड कैंप स्थापित करने की आवश्यकता थी।',
        painPoints: [
          'High risk of duplicate citizen registrations and corrupted demographic data during camp transfers.',
          'Severe rural dust, extreme heat, and power blackouts caused frequent thermal card printer breakdowns and optical scanner failures.',
          'Traditional paper-to-card issuance cycles took up to 45 days, causing citizen unrest and delayed government program rollouts.'
        ],
        painPoints_hi: [
          'कैंप स्थानांतरण के दौरान दोहरे नागरिक पंजीकरण और जनसांख्यिकीय डेटा भ्रष्ट होने का उच्च जोखिम था।',
          'ग्रामीण धूल, अत्यधिक गर्मी और बिजली की भारी कमी के कारण थर्मल कार्ड प्रिंटर और ऑप्टिकल स्कैनर बार-बार खराब होते थे।',
          'पारंपरिक कागजी कार्ड जारी करने में 45 दिन तक का समय लगता था, जिससे नागरिक असंतोष और सरकारी योजना में देरी होती थी।'
        ]
      },
      solution: {
        title: 'Offline-First Distributed Pipeline & Hardware Triage Standard',
        title_hi: 'ऑफलाइन-फर्स्ट वितरित पाइपलाइन एवं हार्डवेयर ट्राइएज मानक',
        approach: 'Formulated an offline-first distributed field operations pipeline utilizing cryptographic local databases, automated de-duplication, and field hardware maintenance protocols.',
        approach_hi: 'क्रिप्टोग्राफ़िक स्थानीय डेटाबेस, स्वचालित डुप्लीकेशन रोकथाम और फ़ील्ड हार्डवेयर रखरखाव प्रोटोकॉल का उपयोग करते हुए एक मजबूत ऑफलाइन-फर्स्ट फील्ड ऑपरेशंस पाइपलाइन तैयार की।',
        keyPillars: [
          { title: 'Offline Cryptographic Staging', title_hi: 'ऑफलाइन क्रिप्टोग्राफ़िक स्टेजिंग', desc: 'Encrypted local SQLite storage with SHA-256 fingerprint verification preventing local duplicate registrations.', desc_hi: 'SHA-256 सत्यापन युक्त स्थानीय डेटाबेस।' },
          { title: 'Standard Hardware Triage SOP', title_hi: 'हार्डवेयर रखरखाव मानक (SOP)', desc: 'Trained mobile camp operators to calibrate thermal print heads and clean optical prisms within 10 minutes.', desc_hi: '10 मिनट में थर्मल प्रिंटर और स्कैनर ट्राइएज।' },
          { title: 'On-Field Card Personalization', title_hi: 'ऑन-फ़ील्ड पर्सनलाइजेशन', desc: 'Unified workflow encoding smart card microchips (ISO 7816) and thermal surface printing in a single pass.', desc_hi: 'एक ही पास में चिप कोडिंग और थर्मल प्रिंटिंग।' }
        ]
      },
      techAndObstacles: {
        title: 'Power Disruptions & Dust-Induced Equipment Wear',
        title_hi: 'बिजली व्यवधान एवं धूल-जनित उपकरण टूट-फूट',
        stack: [
          { name: 'ISO 7816 Smart Card Protocol', role: 'PKI chip encoding and biometric template storage', role_hi: 'PKI चिप एन्कोडिंग और बायोमेट्रिक टेम्पलेट संग्रहण' },
          { name: 'STQC Biometric Scanners', role: 'Government-certified optical fingerprint capture', role_hi: 'सरकार द्वारा प्रमाणित ऑप्टिकल फिंगरप्रिंट कैप्चर' },
          { name: 'Thermal Dye-Sublimation Printers', role: 'Edge-to-edge photo and demographic citizen card printing', role_hi: 'एज-टू-एज फोटो और जनसांख्यिकीय नागरिक कार्ड प्रिंटिंग' }
        ],
        obstacles: [
          {
            hurdle: 'Thermal print heads frequently overheated and jammed due to rural dust accumulation.',
            hurdle_hi: 'ग्रामीण धूल के जमाव के कारण थर्मल प्रिंट हेड बार-बार अत्यधिक गर्म होकर जाम हो जाते थे।',
            issue_hi: 'ग्रामीण धूल के जमाव के कारण थर्मल प्रिंट हेड बार-बार अत्यधिक गर्म होकर जाम हो जाते थे।',
            resolution: 'Equipped mobile teams with sealed dust-proof transit cases with desiccant protection and portable solar-inverter battery systems.',
            resolution_hi: 'मोबाइल टीमों को डेसिकेंट सुरक्षा युक्त सीलबंद डस्ट-प्रूफ ट्रांजिट बॉक्स और पोर्टेबल सोलर-इन्वर्टर बैटरी सिस्टम से लैस किया।'
          },
          {
            hurdle: 'Villagers without government ID struggled to prove demographic credentials.',
            hurdle_hi: 'सरकारी पहचान पत्र न होने वाले ग्रामीणों को जनसांख्यिकीय क्रेडेंशियल साबित करने में कठिनाई हुई।',
            issue_hi: 'सरकारी पहचान पत्र न होने वाले ग्रामीणों को जनसांख्यिकीय क्रेडेंशियल साबित करने में कठिनाई हुई।',
            resolution: 'Established a village panchayat elder attestation protocol adhering to state government notification guidelines.',
            resolution_hi: 'राज्य सरकार के दिशा-निर्देशों के अनुरूप ग्राम पंचायत मुखिया/प्रधान सत्यापन प्रोटोकॉल स्थापित किया।'
          }
        ]
      },
      resultsAndMetrics: {
        title: '50,000+ Citizens Empowered with Secure Digital Identity',
        title_hi: '50,000+ नागरिकों को सुरक्षित डिजिटल पहचान से सशक्त बनाया',
        beforeVsAfter: [
          { metric: 'Registration-to-Card Delivery', metric_hi: 'पंजीकरण से कार्ड डिलीवरी', before: '45 Days', before_hi: '45 दिन', after: '< 29 Days', after_hi: '< 29 दिन', delta: '-35%', delta_hi: '-35%' },
          { metric: 'Card Encoding Defect Rate', metric_hi: 'कार्ड एन्कोडिंग दोष दर', before: '5.2%', before_hi: '5.2%', after: '< 0.2%', after_hi: '< 0.2%', delta: '-96%', delta_hi: '-96%' },
          { metric: 'Data Corruption Incidents', metric_hi: 'डेटा विसंगति / नुकसान घटनाएं', before: 'Frequent Rescans', before_hi: 'बारंबार पुनः स्कैन', after: 'Zero (0%)', after_hi: 'शून्य (0%)', delta: 'Eliminated', delta_hi: 'पूरी तरह समाप्त' }
        ],
        highlights: [
          '50,000+ verified smart cards issued across Palamau, Garhwa, Gaya, and Aurangabad.',
          'Achieved zero data loss incidents across 12 months of high-intensity field operations.',
          'Maintained high encoding throughput of 88 cards per minute during peak panchayat camps.'
        ],
        highlights_hi: [
          'पलामू, गढ़वा, गया और औरंगाबाद में 50,000+ सत्यापित स्मार्ट कार्ड जारी किए गए।',
          '12 महीने के गहन फील्ड ऑपरेशंस में शून्य डेटा हानि की उपलब्धि दर्ज की।',
          'पीक पंचायत कैंपों के दौरान 88 कार्ड प्रति मिनट की उच्च एन्कोडिंग गति बनाए रखी।'
        ]
      },
      lessonsLearned: {
        title: 'Operational Realities of Grassroots Identity Infrastructure',
        title_hi: 'जमीनी पहचान बुनियादी ढांचे की परिचालन वास्तविकताएं',
        takeaways: [
          { principle: 'Hardware Maintenance is Software Engineering', principle_hi: 'हार्डवेयर रखरखाव भी सॉफ्टवेयर इंजीनियरिंग है', detail: 'Preventative field hardware maintenance protocols are just as critical as software code stability.', detail_hi: 'निवारक फील्ड हार्डवेयर रखरखाव प्रोटोकॉल सॉफ्टवेयर कोड स्थिरता जितना ही महत्वपूर्ण है।' },
          { principle: 'Tamper-Evident Batch Manifests', principle_hi: 'टैम्पर-प्रूफ बैच मैनिफेस्ट', detail: 'Cryptographic batch signing prevents packet tampering during transit from village camps to district headquarters.', detail_hi: 'क्रिप्टोग्राफ़िक बैच साइनिंग कैंप से जिला मुख्यालय तक ट्रांजिट के दौरान डेटा से छेड़छाड़ रोकती है।' },
          { principle: 'Operator Empathy Drives Success', principle_hi: 'ऑपरेटर सहानुभूति सफलता की कुंजी है', detail: 'Simple visual error prompts empower field operators to resolve technical issues independently.', detail_hi: 'सरल दृश्य त्रुटि संकेत फील्ड ऑपरेटरों को स्वतंत्र रूप से तकनीकी समस्याओं को हल करने में सक्षम बनाते हैं।' }
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
    title_hi: 'एग्जीक्यूटिव Power BI राजकोषीय बुद्धिमत्ता एवं समाधान प्रणाली',
    subtitle: 'Multi-Entity ERP Consolidation, DAX Fiscal Modeling & Variance Radar',
    subtitle_hi: 'बहु-इकाई ERP समेकन, DAX वित्तीय मॉडलिंग एवं विसंगति रडार',
    category: 'Corporate Controller & BI',
    category_hi: 'कॉर्पोरेट कंट्रोलर एवं BI (Corporate Controller & BI)',
    accentColor: '#8B5CF6',
    summary: 'Executive business intelligence and fiscal governance architecture consolidating 6 commercial operating entities in Microsoft Power BI, reducing month-end reporting latency by 80% and governing ₹25Cr+ in transaction volume with 99.9% reconciliation accuracy.',
    summary_hi: 'Microsoft Power BI में 6 वाणिज्यिक परिचालन संस्थाओं का समेकन करने वाली एग्जीक्यूटिव BI एवं राजकोषीय प्रशासन वास्तुकला, जिसने महीने के अंत की रिपोर्टिंग विलंबता को 80% कम किया और 99.9% समाधान सटीकता के साथ ₹25Cr+ लेन-देन की निगरानी की।',
    executiveSummary_hi: 'Microsoft Power BI में 6 वाणिज्यिक परिचालन संस्थाओं का समेकन करने वाली एग्जीक्यूटिव BI एवं राजकोषीय प्रशासन वास्तुकला, जिसने महीने के अंत की रिपोर्टिंग विलंबता को 80% कम किया और 99.9% समाधान सटीकता के साथ ₹25Cr+ लेन-देन की निगरानी की।',
    metrics: [
      { label: 'Managed Volume', label_hi: 'समेकित वॉल्यूम', val: '₹25Cr+', desc: 'Consolidated commercial volume', desc_hi: 'समेकित व्यावसायिक लेन-देन' },
      { label: 'Reporting Latency', label_hi: 'रिपोर्टिंग गति', val: '-80%', desc: 'Month-end reporting acceleration', desc_hi: 'मासिक रिपोर्टिंग में तेजी' },
      { label: 'Entities Unified', label_hi: 'एकीकृत संस्थाएं', val: '6', desc: 'Commercial operating subsidiaries', desc_hi: 'व्यावसायिक परिचालन सहायक कंपनियां' },
      { label: 'Reconciliation Rate', label_hi: 'समाधान सटीकता', val: '99.9%', desc: 'Automated balance alignment', desc_hi: 'स्वचालित वित्तीय समाधान दर' }
    ],
    techStack: ['Microsoft Power BI', 'Power Query (M)', 'DAX Financial Modeling', 'SQL / ODBC Connectors', 'Tally XML Server', 'Star Schema'],
    challenge_hi: {
      title_hi: 'विखंडित सहायक पुस्तकें एवं वरिष्ठ प्रबंधन दृश्यता में विलंब',
      context_hi: 'खुदरा, थोक और खाद्य एजेंसी वितरण में तेजी से विस्तार करने वाली कॉर्पोरेट संस्थाओं के पास अपनी 6 परिचालन सहायक कंपनियों में एकीकृत वित्तीय दृश्यता का अभाव था।',
      painPoints_hi: [
        'वरिष्ठ प्रबंधन को समेकित बैलेंस शीट और डिवीजन-स्तरीय सकल मार्जिन प्राप्त करने के लिए महीने के अंत के बाद 15–20 दिन प्रतीक्षा करनी पड़ती थी।',
        'मैन्युअल स्प्रेडशीट समेकन से फॉर्मूला लिंक टूटना, अंतर-कंपनी बिक्री की दोहरी गिनती और नकदी प्रवाह अस्पष्ट होने की समस्याएं थीं।',
        'कार्यशील पूंजी पुराने प्राप्य खातों (Accounts Receivable) और धीमी गति से बिकने वाले वितरक स्टॉक में फंसी हुई थी।'
      ]
    },
    solution_hi: {
      title_hi: 'स्वचालित Power Query निष्कर्षण एवं DAX सारणीबद्ध मॉडलिंग',
      approach_hi: 'मल्टी-कंपनी ERP फाइलों से सीधे जुड़ने वाली Power BI, Power Query (M Language) ETL पाइपलाइनों और DAX मॉडलिंग का उपयोग करके एंटरप्राइज BI आर्किटेक्चर तैयार किया।',
      keyHighlights_hi: [
        { title_hi: 'स्टार स्कीमा फाइनेंशियल डेटा मार्ट', desc_hi: 'मानकीकृत आयामों (Dim_Date, Dim_Entity, Dim_Ledger, Dim_SKU) और सामान्यीकृत तथ्यों के साथ संरचित आयामी मॉडल।' },
        { title_hi: 'अंतर-कंपनी विलोपन इंजन (Inter-Company Elimination)', desc_hi: 'स्वचालित नियम जो सहयोगी संस्थाओं के बीच कॉन्ट्रा बिक्री और खरीद प्रविष्टियों की पहचान कर उन्हें समाप्त करते हैं।' },
        { title_hi: 'एग्जीक्यूटिव विसंगति रडार', desc_hi: 'रियल-टाइम डैशबोर्ड विज़ुअलाइज़र जो ₹50,000 से अधिक के बजट बनाम वास्तविक विसंगतियों को तुरंत हाइलाइट करता है।' }
      ],
      keyPillars_hi: [
        { title_hi: 'स्टार स्कीमा फाइनेंशियल मार्ट', desc_hi: 'मानकीकृत आयामों के साथ संगठित डेटा मॉडल।' },
        { title_hi: 'अंतर-कंपनी विलोपन इंजन', desc_hi: 'कॉन्ट्रा बिक्री प्रविष्टियों की दोहरी गिनती की रोकथाम।' },
        { title_hi: 'एग्जीक्यूटिव विसंगति रडार', desc_hi: 'बजट बनाम वास्तविक विसंगतियों का त्वरित विश्लेषण।' }
      ]
    },
    hurdles_hi: [
      {
        hurdle_hi: 'विभिन्न सहायक कंपनियां सामान्य खर्चों के लिए असंगत चार्ट-ऑफ-अकाउंट्स शब्दावली का उपयोग करती थीं।',
        issue_hi: 'विभिन्न सहायक कंपनियां सामान्य खर्चों के लिए असंगत चार्ट-ऑफ-अकाउंट्स शब्दावली का उपयोग करती थीं।',
        resolution_hi: 'एक मास्टर चार्ट-ऑफ-अकाउंट्स क्रॉस-रेफरेंस डिक्शनरी तैयार की जो स्थानीय बहीखातों को एकीकृत कॉर्पोरेट रिपोर्टिंग समूहों में मैप करती है।'
      },
      {
        hurdle_hi: 'लाखों ऐतिहासिक बहीखाता रिकॉर्डों पर रनिंग बैलेंस की गणना करते समय अत्यधिक क्वेरी विलंबता (Latency)।',
        issue_hi: 'लाखों ऐतिहासिक बहीखाता रिकॉर्डों पर रनिंग बैलेंस की गणना करते समय अत्यधिक क्वेरी विलंबता (Latency)।',
        resolution_hi: 'पूर्व-एकत्रित मासिक बैलेंस टेबल तैयार किए और CALCULATE व KEEPFILTERS का उपयोग करके DAX उपायों को अत्यधिक अनुकूलित किया।'
      }
    ],
    impact_hi: {
      title_hi: 'T+1 समेकित वित्तीय दृश्यता एवं कार्यशील पूंजी अनुकूलन',
      beforeAfter_hi: [
        { metric_hi: 'समेकित रिपोर्टिंग विलंब', before_hi: '15–20 दिन', after_hi: 'तत्काल (T+1)', delta_hi: '-80%' },
        { metric_hi: 'मैन्युअल संकलन मानव-घंटे', before_hi: '60+ घंटे / माह', after_hi: '< 2 घंटे', delta_hi: '-96%' },
        { metric_hi: 'अंतर-कंपनी बैलेंस बेमेल', before_hi: 'बारंबार विसंगतियां', after_hi: 'शून्य (0%)', delta_hi: '100% समाधानित' }
      ],
      highlights_hi: [
        '6 विशिष्ट वाणिज्यिक संस्थाओं में ₹25Cr+ वित्तीय वॉल्यूम का सफल समेकन।',
        'अंतर-कंपनी बैलेंस शीट में 99.9% समाधान सटीकता हासिल की।',
        'कार्यकारी नेतृत्व को नकदी प्रवाह और EBITDA मार्जिन तक लाइव मोबाइल एक्सेस प्रदान किया।'
      ]
    },
    takeaways_hi: [
      { principle_hi: 'मास्टर डेटा प्रबंधन एनालिटिक्स से पहले आता है', detail_hi: 'संस्थाओं में आयामी शब्दकोशों का मानकीकरण भरोसेमंद डैशबोर्ड के लिए पूर्व-शर्त है।' },
      { principle_hi: 'कच्ची पंक्तियों का नहीं, व्यवसाय का मॉडल बनाएं', detail_hi: 'कार्यकारी KPI के अनुरूप स्वच्छ स्टार स्कीमा डिजाइन करना कच्चे डेटाबेस की तुलना में बेहतर परिणाम देता है।' },
      { principle_hi: 'स्वचालित विलोपन दोहरी गिनती को रोकता है', detail_hi: 'राजकोषीय रिपोर्टिंग की विश्वसनीयता बनाए रखने के लिए कठोर अंतर-कंपनी विलोपन नियम अत्यंत आवश्यक हैं।' }
    ],
    story: {
      challenge: {
        title: 'Fragmented Subsidiary Books & Delayed Executive Visibility',
        title_hi: 'विखंडित सहायक पुस्तकें एवं वरिष्ठ प्रबंधन दृश्यता में विलंब',
        context: 'Rapidly expanding commercial corporate entities in retail, wholesale, and food agency distribution lacked unified financial visibility across their 6 operating subsidiaries.',
        context_hi: 'खुदरा, थोक और खाद्य एजेंसी वितरण में तेजी से विस्तार करने वाली कॉर्पोरेट संस्थाओं के पास अपनी 6 परिचालन सहायक कंपनियों में एकीकृत वित्तीय दृश्यता का अभाव था।',
        painPoints: [
          'Senior executive leadership waited 15–20 days post month-end to receive consolidated balance sheets and division-level gross margins.',
          'Manual spreadsheet consolidation resulted in broken formula links, duplicate counting of inter-company sales, and obscured cash runway.',
          'Working capital was tied up in undetected aging accounts receivable and slow-moving distributor stock.'
        ],
        painPoints_hi: [
          'वरिष्ठ प्रबंधन को समेकित बैलेंस शीट और डिवीजन-स्तरीय सकल मार्जिन प्राप्त करने के लिए महीने के अंत के बाद 15–20 दिन प्रतीक्षा करनी पड़ती थी।',
          'मैन्युअल स्प्रेडशीट समेकन से फॉर्मूला लिंक टूटना, अंतर-कंपनी बिक्री की दोहरी गिनती और नकदी प्रवाह अस्पष्ट होने की समस्याएं थीं।',
          'कार्यशील पूंजी पुराने प्राप्य खातों (Accounts Receivable) और धीमी गति से बिकने वाले वितरक स्टॉक में फंसी हुई थी।'
        ]
      },
      solution: {
        title: 'Automated Power Query Extraction & DAX Tabular Modeling',
        title_hi: 'स्वचालित Power Query निष्कर्षण एवं DAX सारणीबद्ध मॉडलिंग',
        approach: 'Engineered an enterprise business intelligence architecture utilizing Power BI, Power Query (M Language) ETL pipelines, and DAX modeling connecting directly to multi-company ERP files.',
        approach_hi: 'मल्टी-कंपनी ERP फाइलों से सीधे जुड़ने वाली Power BI, Power Query (M Language) ETL पाइपलाइनों और DAX मॉडलिंग का उपयोग करके एंटरप्राइज BI आर्किटेक्चर तैयार किया।',
        keyPillars: [
          { title: 'Star Schema Financial Mart', title_hi: 'स्टार स्कीमा फाइनेंशियल मार्ट', desc: 'Structured dimensional model featuring standardized dimensions (Dim_Date, Dim_Entity, Dim_Ledger, Dim_SKU) and normalized facts.', desc_hi: 'मानकीकृत आयामों के साथ संगठित डेटा मॉडल।' },
          { title: 'Inter-Company Elimination Engine', title_hi: 'अंतर-कंपनी विलोपन इंजन', desc: 'Automated rules that identify and eliminate contra sales and purchase entries across sister entities.', desc_hi: 'कॉन्ट्रा बिक्री प्रविष्टियों की दोहरी गिनती की रोकथाम।' },
          { title: 'Executive Variance Radar', title_hi: 'एग्जीक्यूटिव विसंगति रडार', desc: 'Real-time dashboard visualizer highlighting budget vs. actual discrepancies exceeding ₹50,000.', desc_hi: 'बजट बनाम वास्तविक विसंगतियों का त्वरित विश्लेषण।' }
        ]
      },
      techAndObstacles: {
        title: 'Disparate Ledger Structures & High Query Latency',
        title_hi: 'असमान बहीखाता संरचनाएं एवं उच्च क्वेरी विलंबता',
        stack: [
          { name: 'Power BI Desktop & Service', role: 'Tabular modeling, DAX measures, and cloud executive workspace', role_hi: 'टैबुलर मॉडलिंग, DAX मेजर्स और क्लाउड एग्जीक्यूटिव वर्कस्पेस' },
          { name: 'Power Query (M Language)', role: 'Automated extraction, ledger normalization, and schema mapping', role_hi: 'स्वचालित निष्कर्षण, बहीखाता सामान्यीकरण और स्कीमा मैपिंग' },
          { name: 'Tally XML / ODBC Gateway', role: 'Real-time multi-company data polling and journal extraction', role_hi: 'रियल-टाइम मल्टी-कंपनी डेटा पोलिंग और जर्नल निष्कर्षण' }
        ],
        obstacles: [
          {
            hurdle: 'Different subsidiaries utilized inconsistent chart-of-accounts nomenclature for common expense heads.',
            hurdle_hi: 'विभिन्न सहायक कंपनियां सामान्य खर्चों के लिए असंगत चार्ट-ऑफ-अकाउंट्स शब्दावली का उपयोग करती थीं।',
            issue_hi: 'विभिन्न सहायक कंपनियां सामान्य खर्चों के लिए असंगत चार्ट-ऑफ-अकाउंट्स शब्दावली का उपयोग करती थीं।',
            resolution: 'Built a master chart-of-accounts cross-reference dictionary mapping disparate local ledgers to unified corporate reporting groups.',
            resolution_hi: 'एक मास्टर चार्ट-ऑफ-अकाउंट्स क्रॉस-रेफरेंस डिक्शनरी तैयार की जो स्थानीय बहीखातों को एकीकृत कॉर्पोरेट रिपोर्टिंग समूहों में मैप करती है।'
          },
          {
            hurdle: 'High query latency when calculating running balances across millions of historical ledger records.',
            hurdle_hi: 'लाखों ऐतिहासिक बहीखाता रिकॉर्डों पर रनिंग बैलेंस की गणना करते समय अत्यधिक क्वेरी विलंबता (Latency)।',
            issue_hi: 'लाखों ऐतिहासिक बहीखाता रिकॉर्डों पर रनिंग बैलेंस की गणना करते समय अत्यधिक क्वेरी विलंबता (Latency)।',
            resolution: 'Engineered pre-aggregated monthly balance tables and optimized DAX measures using CALCULATE and KEEPFILTERS.',
            resolution_hi: 'पूर्व-एकत्रित मासिक बैलेंस टेबल तैयार किए और CALCULATE व KEEPFILTERS का उपयोग करके DAX उपायों को अत्यधिक अनुकूलित किया।'
          }
        ]
      },
      resultsAndMetrics: {
        title: 'T+1 Consolidated Visibility & Working Capital Optimization',
        title_hi: 'T+1 समेकित वित्तीय दृश्यता एवं कार्यशील पूंजी अनुकूलन',
        beforeVsAfter: [
          { metric: 'Consolidated Reporting Delay', metric_hi: 'समेकित रिपोर्टिंग विलंब', before: '15–20 Days', before_hi: '15–20 दिन', after: 'Instantaneous (T+1)', after_hi: 'तत्काल (T+1)', delta: '-80%', delta_hi: '-80%' },
          { metric: 'Manual Compilation Man-Hours', metric_hi: 'मैन्युअल संकलन मानव-घंटे', before: '60+ Hours / Month', before_hi: '60+ घंटे / माह', after: '< 2 Hours', after_hi: '< 2 घंटे', delta: '-96%', delta_hi: '-96%' },
          { metric: 'Inter-Company Balance Mismatches', metric_hi: 'अंतर-कंपनी बैलेंस बेमेल', before: 'Frequent Discrepancies', before_hi: 'बारंबार विसंगतियां', after: 'Zero (0%)', after_hi: 'शून्य (0%)', delta: '100% Reconciled', delta_hi: '100% समाधानित' }
        ],
        highlights: [
          'Consolidated ₹25Cr+ in financial volume across 6 distinct commercial entities.',
          'Achieved 99.9% reconciliation accuracy across inter-company balance sheets.',
          'Empowered executive leadership with live mobile access to cash runway and EBITDA margins.'
        ],
        highlights_hi: [
          '6 विशिष्ट वाणिज्यिक संस्थाओं में ₹25Cr+ वित्तीय वॉल्यूम का सफल समेकन।',
          'अंतर-कंपनी बैलेंस शीट में 99.9% समाधान सटीकता हासिल की।',
          'कार्यकारी नेतृत्व को नकदी प्रवाह और EBITDA मार्जिन तक लाइव मोबाइल एक्सेस प्रदान किया।'
        ]
      },
      lessonsLearned: {
        title: 'Foundational Principles of Corporate BI Architecture',
        title_hi: 'कॉर्पोरेट BI आर्किटेक्चर के मूलभूत सिद्धांत',
        takeaways: [
          { principle: 'Master Data Management Precedes Analytics', principle_hi: 'मास्टर डेटा प्रबंधन एनालिटिक्स से पहले आता है', detail: 'Standardizing dimensional dictionaries across entities is the prerequisite for trustworthy dashboards.', detail_hi: 'संस्थाओं में आयामी शब्दकोशों का मानकीकरण भरोसेमंद डैशबोर्ड के लिए पूर्व-शर्त है।' },
          { principle: 'Model the Business, Not Raw Rows', principle_hi: 'कच्ची पंक्तियों का नहीं, व्यवसाय का मॉडल बनाएं', detail: 'Designing clean Star Schemas aligned with executive KPIs outperforms querying raw transactional dumps.', detail_hi: 'कार्यकारी KPI के अनुरूप स्वच्छ स्टार स्कीमा डिजाइन करना कच्चे डेटाबेस की तुलना में बेहतर परिणाम देता है।' },
          { principle: 'Automated Elimination Prevents Double Counting', principle_hi: 'स्वचालित विलोपन दोहरी गिनती को रोकता है', detail: 'Rigorous inter-company elimination rules are vital to preserve fiscal reporting credibility.', detail_hi: 'राजकोषीय रिपोर्टिंग की विश्वसनीयता बनाए रखने के लिए कठोर अंतर-कंपनी विलोपन नियम अत्यंत आवश्यक हैं।' }
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
    title_hi: 'कॉर्पोरेट वित्तीय नियंत्रण एवं आंतरिक ऑडिट प्रशासन',
    subtitle: 'Internal Financial Controls (IFC), Withholding Tax Gatekeeper & Audit Dossier',
    subtitle_hi: 'आंतरिक वित्तीय नियंत्रण (IFC), TDS अनुपालन द्वारपाल एवं ऑडिट डॉजियर',
    category: 'Statutory Strategy & Governance',
    category_hi: 'वैधानिक रणनीति एवं प्रशासन (Statutory Strategy & Governance)',
    accentColor: '#8B5CF6',
    summary: 'Institutional Internal Financial Controls (IFC) and statutory governance framework deploying automated 3-way matching, withholding tax (TDS) compliance gates, and continuous digital audit trails, preventing ₹45L+ in tax leakages with 100% audit readiness.',
    summary_hi: 'संस्थागत आंतरिक वित्तीय नियंत्रण (IFC) एवं वैधानिक शासन ढांचा, जिसमें स्वचालित 3-वे मिलान, स्रोत पर कर कटौती (TDS) अनुपालन गेट्स और निरंतर डिजिटल ऑडिट ट्रेल्स लागू कर ₹45L+ के टैक्स रिसाव को रोका गया और 100% ऑडिट तत्परता हासिल की गई।',
    executiveSummary_hi: 'संस्थागत आंतरिक वित्तीय नियंत्रण (IFC) एवं वैधानिक शासन ढांचा, जिसमें स्वचालित 3-वे मिलान, स्रोत पर कर कटौती (TDS) अनुपालन गेट्स और निरंतर डिजिटल ऑडिट ट्रेल्स लागू कर ₹45L+ के टैक्स रिसाव को रोका गया और 100% ऑडिट तत्परता हासिल की गई।',
    metrics: [
      { label: 'Audit Readiness', label_hi: 'ऑडिट तत्परता', val: '100%', desc: 'Statutory audit preparedness', desc_hi: 'वैधानिक ऑडिट तैयारी' },
      { label: 'Leakage Prevented', label_hi: 'रोका गया टैक्स रिसाव', val: '₹45L+', desc: 'Tax variance & leakage stopped', desc_hi: 'अस्वीकृत खर्चों व पेनल्टी की रोकथाम' },
      { label: 'Disallowance Risk', label_hi: 'अस्वीकृति जोखिम', val: '0%', desc: 'Section 40(a)(ia) expenditure risk', desc_hi: 'Section 40(a)(ia) व्यय जोखिम' },
      { label: 'Penalty Record', label_hi: 'पेनल्टी रिकॉर्ड', val: '₹0', desc: 'Zero penalty / scrutiny assessment', desc_hi: 'शून्य पेनल्टी व संवीक्षा आदेश' }
    ],
    techStack: ['Internal Financial Controls (IFC)', 'Tally Security Features', 'Statutory Tax Matrix', 'Section 194Q Automation', 'Continuous Audit Trails', 'Vendor Ledger Auditing'],
    challenge_hi: {
      title_hi: 'असमन्वित शाखा व्यय एवं वैधानिक असुरक्षा',
      context_hi: 'क्षेत्रीय वाणिज्यिक शाखा नेटवर्क असमन्वित परिचालन खर्चों से जूझ रहे थे: विक्रेता कर कटौती रसीदों का संग्रह न होना, अनियंत्रित नकद खरीद और अनुपलब्ध e-Way Bills।',
      painPoints_hi: [
        'आसन्न वैधानिक टैक्स ऑडिट और GST विभाग के सत्यापन से भारी अफरातफरी और व्यावसायिक व्यवधान उत्पन्न होता था।',
        'Section 194C, 194J, 194Q के तहत TDS कटौती का अनुपालन न होने पर Section 40(a)(ia) के तहत 30% तक खर्च अस्वीकृत होने का गंभीर जोखिम था।',
        'औपचारिक 3-वे मिलान प्रक्रिया के अभाव में बिना सत्यापित Goods Receipt Notes (GRN) के आपूर्तिकर्ता चालानों का भुगतान हो जाता था।'
      ]
    },
    solution_hi: {
      title_hi: 'संस्थागत IFC ढांचा एवं स्वचालित 3-वे मैच द्वारपाल',
      approach_hi: 'अनिवार्य डिजिटल प्राधिकरण सीमाओं के साथ सभी शाखाओं में एक संस्थागत आंतरिक वित्तीय नियंत्रण (IFC) ढांचा तैयार और परिनियोजित किया।',
      keyHighlights_hi: [
        { title_hi: 'स्वचालित 3-वे मैचिंग गेट', desc_hi: 'भुगतान वाउचर जारी करने से पहले Purchase Order, GRN और विक्रेता टैक्स इनवॉइस के बीच स्वचालित मिलान आवश्यक है।' },
        { title_hi: 'TDS कटौती मैट्रिक्स', desc_hi: 'पूर्व-भरे Form 26Q रजिस्टरों के साथ Section 194C/194J/194Q के तहत TDS देनदारियों की स्वचालित गणना।' },
        { title_hi: 'निरंतर डिजिटल ऑडिट डॉजियर', desc_hi: '₹50,000 से अधिक के प्रत्येक लेन-देन को अनुबंध, अनुमोदन और बैंक भुगतान प्रमाण के साथ पूर्व-इंडेक्स करता है।' }
      ],
      keyPillars_hi: [
        { title_hi: 'स्वचालित 3-वे मैचिंग गेट', desc_hi: 'PO, GRN और चालान का तीन-स्तरीय मिलान।' },
        { title_hi: 'TDS कटौती मैट्रिक्स', desc_hi: 'Section 194C/194J/194Q का स्वचालित अनुपालन।' },
        { title_hi: 'डिजिटल ऑडिट डॉजियर', desc_hi: 'अनुबंधों और बैंक प्रमाणों का पूर्व-इंडेक्सिंग।' }
      ]
    },
    hurdles_hi: [
      {
        hurdle_hi: 'शाखा प्रबंधक बिना खरीद आदेश (Purchase Order) के अनौपचारिक स्थानीय खरीद के आदी थे।',
        issue_hi: 'शाखा प्रबंधक बिना खरीद आदेश (Purchase Order) के अनौपचारिक स्थानीय खरीद के आदी थे।',
        resolution_hi: 'एक औपचारिक अधिकार प्रत्यायोजन (Delegation of Authority) मैट्रिक्स और डिजिटल खरीद मांग वर्कफ़्लो स्थापित किया।'
      },
      {
        hurdle_hi: 'आपूर्तिकर्ताओं ने उच्च-मात्रा वाले सामानों पर नए लागू Section 194Q के तहत टैक्स कटौती पर आपत्ति जताई।',
        issue_hi: 'आपूर्तिकर्ताओं ने उच्च-मात्रा वाले सामानों पर नए लागू Section 194Q के तहत टैक्स कटौती पर आपत्ति जताई।',
        resolution_hi: 'वैधानिक प्रावधानों की व्याख्या करने वाले स्वचालित विक्रेता परामर्श जारी किए और स्वतः Form 16A प्रमाण पत्र समय पर प्रदान किए।'
      }
    ],
    impact_hi: {
      title_hi: 'शून्य-पेनल्टी ऑडिट रिकॉर्ड एवं सुदृढ़ बैलेंस शीट',
      beforeAfter_hi: [
        { metric_hi: 'वैधानिक ऑडिट तैयारी समय', before_hi: '30–45 दिन', after_hi: '< 48 घंटे', delta_hi: '-95%' },
        { metric_hi: 'रोका गया टैक्स रिसाव', before_hi: 'अस्वीकृति के प्रति संवेदनशील', after_hi: '₹45L+ सुरक्षित', delta_hi: 'पूर्णतः सुरक्षित' },
        { metric_hi: 'अस्वीकृत शाखा व्यय', before_hi: 'कुल Opex का 12%', after_hi: '0%', delta_hi: 'पूरी तरह समाप्त' }
      ],
      highlights_hi: [
        'शून्य टैक्स नोटिस या वैधानिक अस्वीकृति के साथ 100% ऑडिट तत्परता बनाए रखी।',
        'Section 40(a)(ia) के तहत ₹45L+ का टैक्स रिसाव और अस्वीकृत व्यय रोका।',
        'एक अपरिवर्तनीय डिजिटल ऑडिट संग्रह स्थापित किया जिसे वैधानिक ऑडिट के दौरान सीधे प्रस्तुत किया गया।'
      ]
    },
    takeaways_hi: [
      { principle_hi: 'नियंत्रणों को सुविधाजनक होना चाहिए, अवरोधक नहीं', detail_hi: 'सर्वोत्तम वित्तीय नियंत्रण प्रशासनिक बाधा बनने के बजाय दैनिक कार्यप्रणाली में स्वतः समाहित होते हैं।' },
      { principle_hi: 'ऑडिट तत्परता एक दैनिक आदत है', detail_hi: 'भुगतान के क्षण ही साक्ष्य को सूचीबद्ध करने से वर्ष के अंत की ऑडिट अफरातफरी स्थायी रूप से समाप्त हो जाती है।' },
      { principle_hi: 'खरीद प्रशासन मुनाफे की रक्षा करता है', detail_hi: 'सख्त 3-वे मिलान लागू करना आपूर्तिकर्ता के अधिक बिलिंग के विरुद्ध कंपनी के शुद्ध मार्जिन की सीधे रक्षा करता है।' }
    ],
    story: {
      challenge: {
        title: 'Uncoordinated Branch Expenditures & Statutory Vulnerability',
        title_hi: 'असमन्वित शाखा व्यय एवं वैधानिक असुरक्षा',
        context: 'Regional commercial branch networks suffered from uncoordinated operational expenditures: uncollected vendor tax deduction receipts, unmonitored cash purchases, and missing e-Way Bills.',
        context_hi: 'क्षेत्रीय वाणिज्यिक शाखा नेटवर्क असमन्वित परिचालन खर्चों से जूझ रहे थे: विक्रेता कर कटौती रसीदों का संग्रह न होना, अनियंत्रित नकद खरीद और अनुपलब्ध e-Way Bills।',
        painPoints: [
          'Impending statutory tax audits and GST department verifications caused severe panic and operational disruption.',
          'Non-compliance with tax withholding (TDS under Sections 194C, 194J, 194Q) risked 30% expense disallowances under Section 40(a)(ia).',
          'Absence of a formal 3-way matching process led to paying supplier invoices without verified Goods Receipt Notes (GRN).'
        ],
        painPoints_hi: [
          'आसन्न वैधानिक टैक्स ऑडिट और GST विभाग के सत्यापन से भारी अफरातफरी और व्यावसायिक व्यवधान उत्पन्न होता था।',
          'Section 194C, 194J, 194Q के तहत TDS कटौती का अनुपालन न होने पर Section 40(a)(ia) के तहत 30% तक खर्च अस्वीकृत होने का गंभीर जोखिम था।',
          'औपचारिक 3-वे मिलान प्रक्रिया के अभाव में बिना सत्यापित Goods Receipt Notes (GRN) के आपूर्तिकर्ता चालानों का भुगतान हो जाता था।'
        ]
      },
      solution: {
        title: 'Institutional IFC Framework & Automated 3-Way Match Gatekeeper',
        title_hi: 'संस्थागत IFC ढांचा एवं स्वचालित 3-वे मैच द्वारपाल',
        approach: 'Designed and deployed an institutional Internal Financial Control (IFC) framework across all enterprise branches with mandatory digital authorization thresholds.',
        approach_hi: 'अनिवार्य डिजिटल प्राधिकरण सीमाओं के साथ सभी शाखाओं में एक संस्थागत आंतरिक वित्तीय नियंत्रण (IFC) ढांचा तैयार और परिनियोजित किया।',
        keyPillars: [
          { title: 'Automated 3-Way Matching Gate', title_hi: 'स्वचालित 3-वे मैचिंग गेट', desc: 'Requires cryptographic match between Purchase Order, GRN, and Vendor Tax Invoice before payment voucher release.', desc_hi: 'PO, GRN और चालान का तीन-स्तरीय मिलान।' },
          { title: 'Withholding Tax (TDS) Matrix', title_hi: 'TDS कटौती मैट्रिक्स', desc: 'Automated calculation of TDS liabilities under Section 194C/194J/194Q with pre-filled Form 26Q registers.', desc_hi: 'Section 194C/194J/194Q का स्वचालित अनुपालन।' },
          { title: 'Continuous Digital Audit Dossier', title_hi: 'डिजिटल ऑडिट डॉजियर', desc: 'Pre-indexes every transaction >₹50,000 with contracts, approvals, and bank clearance proof.', desc_hi: 'अनुबंधों और बैंक प्रमाणों का पूर्व-इंडेक्सिंग।' }
        ]
      },
      techAndObstacles: {
        title: 'Branch Manager Friction & Vendor Pushback',
        title_hi: 'शाखा प्रबंधक प्रतिरोध एवं आपूर्तिकर्ता हिचकिचाहट',
        stack: [
          { name: 'Internal Financial Controls Matrix', role: 'Delegation of Authority and statutory approval rules', role_hi: 'अधिकार प्रत्यायोजन (DoA) एवं वैधानिक अनुमोदन नियम' },
          { name: 'Tally Prime Security & Audit Module', role: 'Voucher alteration tracking and mandatory user authentication', role_hi: 'वाउचर परिवर्तन ट्रैकिंग और अनिवार्य उपयोगकर्ता प्रमाणीकरण' },
          { name: 'Statutory Withholding Engine', role: 'Automated Challan 281 tax clearance and Form 16A generation', role_hi: 'स्वचालित चालान 281 टैक्स क्लीयरेंस और Form 16A निर्माण' }
        ],
        obstacles: [
          {
            hurdle: 'Branch managers were accustomed to informal local purchasing without purchase orders.',
            hurdle_hi: 'शाखा प्रबंधक बिना खरीद आदेश (Purchase Order) के अनौपचारिक स्थानीय खरीद के आदी थे।',
            issue_hi: 'शाखा प्रबंधक बिना खरीद आदेश (Purchase Order) के अनौपचारिक स्थानीय खरीद के आदी थे।',
            resolution: 'Instituted a formal Delegation of Authority (DoA) matrix and automated digital purchase requisition workflows.',
            resolution_hi: 'एक औपचारिक अधिकार प्रत्यायोजन (Delegation of Authority) मैट्रिक्स और डिजिटल खरीद मांग वर्कफ़्लो स्थापित किया।'
          },
          {
            hurdle: 'Suppliers objected to tax deductions under newly enacted Section 194Q on high-volume goods.',
            hurdle_hi: 'आपूर्तिकर्ताओं ने उच्च-मात्रा वाले सामानों पर नए लागू Section 194Q के तहत टैक्स कटौती पर आपत्ति जताई।',
            issue_hi: 'आपूर्तिकर्ताओं ने उच्च-मात्रा वाले सामानों पर नए लागू Section 194Q के तहत टैक्स कटौती पर आपत्ति जताई।',
            resolution: 'Automated vendor communication advisories explaining statutory compliance and auto-issued Form 16A certificates.',
            resolution_hi: 'वैधानिक प्रावधानों की व्याख्या करने वाले स्वचालित विक्रेता परामर्श जारी किए और स्वतः Form 16A प्रमाण पत्र समय पर प्रदान किए।'
          }
        ]
      },
      resultsAndMetrics: {
        title: 'Zero-Penalty Audit Record & Fortified Balance Sheets',
        title_hi: 'शून्य-पेनल्टी ऑडिट रिकॉर्ड एवं सुदृढ़ बैलेंस शीट',
        beforeVsAfter: [
          { metric: 'Statutory Audit Preparation Time', metric_hi: 'वैधानिक ऑडिट तैयारी समय', before: '30–45 Days', before_hi: '30–45 दिन', after: '< 48 Hours', after_hi: '< 48 घंटे', delta: '-95%', delta_hi: '-95%' },
          { metric: 'Prevented Tax Leakages', metric_hi: 'रोका गया टैक्स रिसाव', before: 'Vulnerable to Disallowance', before_hi: 'अस्वीकृति के प्रति संवेदनशील', after: '₹45L+ Preserved', after_hi: '₹45L+ सुरक्षित', delta: 'Protected', delta_hi: 'पूर्णतः सुरक्षित' },
          { metric: 'Unapproved Branch Expenditures', metric_hi: 'अस्वीकृत शाखा व्यय', before: '12% of Total Opex', before_hi: 'कुल Opex का 12%', after: '0%', after_hi: '0%', delta: 'Eliminated', delta_hi: 'पूरी तरह समाप्त' }
        ],
        highlights: [
          'Maintained 100% audit readiness with zero tax notices or statutory disallowances.',
          'Prevented ₹45L+ in tax leakage and disallowed expenditures under Section 40(a)(ia).',
          'Established an immutable digital audit archive referenced during statutory audits.'
        ],
        highlights_hi: [
          'शून्य टैक्स नोटिस या वैधानिक अस्वीकृति के साथ 100% ऑडिट तत्परता बनाए रखी।',
          'Section 40(a)(ia) के तहत ₹45L+ का टैक्स रिसाव और अस्वीकृत व्यय रोका।',
          'एक अपरिवर्तनीय डिजिटल ऑडिट संग्रह स्थापित किया जिसे वैधानिक ऑडिट के दौरान सीधे प्रस्तुत किया गया।'
        ]
      },
      lessonsLearned: {
        title: 'Enduring Rules of Enterprise Corporate Governance',
        title_hi: 'एंटरप्राइज कॉर्पोरेट गवर्नेंस के स्थायी नियम',
        takeaways: [
          { principle: 'Controls Must Facilitate, Not Paralyze', principle_hi: 'नियंत्रणों को सुविधाजनक होना चाहिए, अवरोधक नहीं', detail: 'The best financial controls are automated into daily workflows rather than acting as administrative roadblocks.', detail_hi: 'सर्वोत्तम वित्तीय नियंत्रण प्रशासनिक बाधा बनने के बजाय दैनिक कार्यप्रणाली में स्वतः समाहित होते हैं।' },
          { principle: 'Audit Readiness is an Everyday Stance', principle_hi: 'ऑडिट तत्परता एक दैनिक आदत है', detail: 'Indexing supporting evidence at the moment of payment permanently eliminates year-end audit scrambles.', detail_hi: 'भुगतान के क्षण ही साक्ष्य को सूचीबद्ध करने से वर्ष के अंत की ऑडिट अफरातफरी स्थायी रूप से समाप्त हो जाती है।' },
          { principle: 'Purchasing Governance Protects Profit', principle_hi: 'खरीद प्रशासन मुनाफे की रक्षा करता है', detail: 'Enforcing strict 3-way matching directly defends company bottom-line margins against supplier overbilling.', detail_hi: 'सख्त 3-वे मिलान लागू करना आपूर्तिकर्ता के अधिक बिलिंग के विरुद्ध कंपनी के शुद्ध मार्जिन की सीधे रक्षा करता है।' }
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
    title_hi: 'AI प्रॉम्प्ट-टू-फुलस्टैक SaaS जनरेटर प्रणाली',
    subtitle: 'Autonomous Next.js 14, Supabase RLS & Stripe Billing Scaffolding Engine',
    subtitle_hi: 'स्वायत्त Next.js 14, Supabase RLS एवं Stripe बिलिंग निर्माण इंजन',
    category: 'Autonomous SaaS & Prototyping',
    category_hi: 'स्वायत्त SaaS एवं प्रोटोटाइपिंग (Autonomous SaaS)',
    accentColor: '#10B981',
    summary: 'Autonomous prompt-driven SaaS scaffolding engine leveraging Claude 3.5 Sonnet and Cursor AI to generate production-ready Next.js 14 web applications, Supabase PostgreSQL schemas with Row-Level Security, and Stripe monetization in < 3 minutes with a 10x velocity acceleration.',
    summary_hi: 'Claude 3.5 Sonnet और Cursor AI का लाभ उठाने वाला स्वायत्त प्रॉम्प्ट-संचालित SaaS जनरेटर, जो 3 मिनट से भी कम समय में 10x तीव्र गति से उत्पादन-तैयार Next.js 14 वेब ऐप्स, Supabase PostgreSQL स्कीमा (Row-Level Security) और Stripe बिलिंग तैयार करता है।',
    executiveSummary_hi: 'Claude 3.5 Sonnet और Cursor AI का लाभ उठाने वाला स्वायत्त प्रॉम्प्ट-संचालित SaaS जनरेटर, जो 3 मिनट से भी कम समय में 10x तीव्र गति से उत्पादन-तैयार Next.js 14 वेब ऐप्स, Supabase PostgreSQL स्कीमा (Row-Level Security) और Stripe बिलिंग तैयार करता है।',
    metrics: [
      { label: 'Scaffolding Speed', label_hi: 'निर्माण गति', val: '< 3 Mins', desc: 'Zero-to-deploy generation time', desc_hi: 'शून्य से परिनियोजन समय' },
      { label: 'Velocity Increase', label_hi: 'गति में वृद्धि', val: '10x', desc: 'Engineering shipping acceleration', desc_hi: 'सॉफ्टवेयर शिपिंग त्वरण' },
      { label: 'MVPs Deployed', label_hi: 'तैनात MVPs', val: '25+', desc: 'Fullstack production applications', desc_hi: 'फुल-स्टैक प्रोडक्शन अनुप्रयोग' },
      { label: 'Test Pass Rate', label_hi: 'टेस्ट उत्तीर्ण दर', val: '99.4%', desc: 'Generated codebase test pass rate', desc_hi: 'कोडबेस टेस्ट पास दर' }
    ],
    techStack: ['Next.js 14 (App Router)', 'Claude 3.5 Sonnet', 'Cursor AI Composer', 'Supabase (PostgreSQL & RLS)', 'Tailwind CSS', 'Stripe Billing API', 'TypeScript'],
    challenge_hi: {
      title_hi: 'भारी बॉयलरप्लेट ओवरहेड एवं धीमी जीरो-टू-वन चक्र गति',
      context_hi: 'उत्पादन-स्तरीय वेब अनुप्रयोगों के निर्माण में पारंपरिक रूप से हफ्तों का बॉयलरप्लेट सेटअप लगता है: प्रमाणीकरण, Row-Level Security के साथ मल्टी-टेनेंट डेटाबेस स्कीमा, Stripe बिलिंग, API रूट हैंडलर और रेस्पॉन्सिव UI घटक।',
      painPoints_hi: [
        'प्रारंभिक MVPs पर उच्च इंजीनियरिंग लागत और धीमी फीडबैक लूप के कारण उत्पाद टीमें गति खो देती हैं।',
        'मानक AI कोड जनरेशन टूटे हुए टाइप, गैर-मौजूद आयात और गैर-कार्यात्मक डेटाबेस क्वेरी वाले असंबद्ध स्निपेट्स बनाता है।',
        'प्रथम ग्राहक सत्यापन से पहले ऑथेंटिकेशन, डेटाबेस और बिलिंग के मैन्युअल सेटअप में 4–6 सप्ताह का समय लग जाता है।'
      ]
    },
    solution_hi: {
      title_hi: 'मल्टी-स्टेज प्रॉम्प्ट आर्किटेक्चर एवं सख्त स्कीमा सीमाएं',
      approach_hi: 'सख्त सॉफ्टवेयर डिज़ाइन पैटर्न से बंधी Claude 3.5 Sonnet, Cursor AI Composer और Next.js 14 App Router का लाभ उठाते हुए एक स्वायत्त प्रॉम्प्ट-संचालित SaaS निर्माण इंजन तैयार किया।',
      keyHighlights_hi: [
        { title_hi: 'स्कीमा-प्रथम जनरेशन (Schema-First)', desc_hi: 'UI जनरेशन से पहले Supabase Row-Level Security (RLS) नीतियों के साथ सामान्यीकृत PostgreSQL तालिकाओं को संश्लेषित करता है।' },
        { title_hi: 'Zod सत्यापन युक्त Server Actions', desc_hi: 'सख्त स्कीमा सत्यापन और रनटाइम प्रकार सुरक्षा के साथ एंड-टू-एंड टाइप्ड म्यूटेशन उत्पन्न करता है।' },
        { title_hi: 'प्री-कमिट सत्यापन गेट्स', desc_hi: 'Oxlint और TypeScript कंपाइलर सत्यापन के साथ स्वचालित परीक्षण और लिंटिंग।' }
      ],
      keyPillars_hi: [
        { title_hi: 'स्कीमा-प्रथम जनरेशन', desc_hi: 'Supabase RLS नीतियों के साथ मजबूत डेटाबेस स्कीमा।' },
        { title_hi: 'Zod युक्त Server Actions', desc_hi: 'सख्त प्रकार सुरक्षा और रनटाइम सत्यापन।' },
        { title_hi: 'प्री-कमिट सत्यापन गेट्स', desc_hi: 'Oxlint और TypeScript द्वारा 0-त्रुटि परीक्षण।' }
      ]
    },
    hurdles_hi: [
      {
        hurdle_hi: 'AI कोड जनरेटर जटिल मल्टी-टेनेंट मॉडल में विदेशी कुंजी (Foreign Key) संबंधों की गलत कल्पना करते थे।',
        issue_hi: 'AI कोड जनरेटर जटिल मल्टी-टेनेंट मॉडल में विदेशी कुंजी (Foreign Key) संबंधों की गलत कल्पना करते थे।',
        resolution_hi: 'मानकीकृत स्कीमा अनुबंधों और पूर्व-कॉन्फ़िगर किए गए Zod सत्यापनकर्ताओं के साथ एक मॉड्यूलर टेम्पलेट रिपॉजिटरी बनाई।'
      },
      {
        hurdle_hi: 'LLM प्रशिक्षण डेटा में पुराने API SDK सिंटैक्स के कारण Stripe वेबहुक लिसनर सत्यापन विफल हो जाता था।',
        issue_hi: 'LLM प्रशिक्षण डेटा में पुराने API SDK सिंटैक्स के कारण Stripe वेबहुक लिसनर सत्यापन विफल हो जाता था।',
        resolution_hi: 'स्पष्ट TypeScript प्रकार अनुबंध अनिवार्य किए और टेम्पलेट प्रीसेट में नवीनतम सत्यापित Stripe SDK संस्करण पिन किए।'
      }
    ],
    impact_hi: {
      title_hi: '10x शिपिंग गति एवं 25+ प्रोडक्शन वेब अनुप्रयोग',
      beforeAfter_hi: [
        { metric_hi: 'फुल-स्टैक MVP निर्माण समय', before_hi: '4–6 सप्ताह', after_hi: '< 3 मिनट', delta_hi: '-99%' },
        { metric_hi: 'प्रारंभिक इंजीनियरिंग लागत', before_hi: '$5,000–$15,000', after_hi: '< $5 टोकन खर्च', delta_hi: '-99.9%' },
        { metric_hi: 'कोडबेस लिंट व प्रकार पास दर', before_hi: 'मैन्युअल डिबगिंग', after_hi: '99.4% प्रथम प्रयास', delta_hi: 'स्वचालित' }
      ],
      highlights_hi: [
        'प्रमाणीकरण, डेटाबेस और बिलिंग के साथ 3 मिनट से भी कम समय में फुल-स्टैक वेब ऐप्स तैयार किए।',
        '25+ प्रोडक्शन-ग्रेड वेब MVPs तैनात करते हुए शिपिंग गति को 10x तेज किया।',
        'Oxlint और Vitest का उपयोग करके उत्पन्न कोडबेस में 99.4% टेस्ट पास दर प्राप्त की।'
      ]
    },
    takeaways_hi: [
      { principle_hi: 'बाधाएं रचनात्मकता को सक्षम बनाती हैं', detail_hi: 'सख्त स्कीमा परिभाषाओं और टाइप्ड सीमाओं के साथ AI मॉडल को नियंत्रित करने से मतिभ्रम (Hallucinations) समाप्त हो जाते हैं।' },
      { principle_hi: 'कोड से पहले आर्किटेक्चर', detail_hi: 'सॉफ्टवेयर आवश्यकताओं को स्पष्ट वास्तुकला विवरणों में विभाजित करने से बेहतर कोड गुणवत्ता उत्पन्न होती है।' },
      { principle_hi: 'तीव्र सत्यापन चक्र', detail_hi: 'उच्च-गति लिंटर्स और टाइप चेकर स्वायत्त कोडिंग गति के लिए आवश्यक त्वरित प्रतिक्रिया प्रदान करते हैं।' }
    ],
    story: {
      challenge: {
        title: 'High Scaffolding Overhead & Slow Zero-to-One Cycles',
        title_hi: 'भारी बॉयलरप्लेट ओवरहेड एवं धीमी जीरो-टू-वन चक्र गति',
        context: 'Building production-grade web applications traditionally demands weeks of boilerplate setup: authentication providers, multi-tenant database schemas with Row-Level Security, Stripe billing integration, API route handlers, and responsive UI components.',
        context_hi: 'उत्पादन-स्तरीय वेब अनुप्रयोगों के निर्माण में पारंपरिक रूप से हफ्तों का बॉयलरप्लेट सेटअप लगता है: प्रमाणीकरण, Row-Level Security के साथ मल्टी-टेनेंट डेटाबेस स्कीमा, Stripe बिलिंग, API रूट हैंडलर और रेस्पॉन्सिव UI घटक।',
        painPoints: [
          'Founders and product teams lose momentum due to high engineering costs, agency overhead, and slow feedback loops on initial MVPs.',
          'Standard AI code generation produces disconnected code snippets with hallucinated imports, broken types, and non-functional database queries.',
          'Manual setup of authentication, database schemas, and billing takes 4–6 weeks before first customer validation.'
        ],
        painPoints_hi: [
          'प्रारंभिक MVPs पर उच्च इंजीनियरिंग लागत और धीमी फीडबैक लूप के कारण उत्पाद टीमें गति खो देती हैं।',
          'मानक AI कोड जनरेशन टूटे हुए टाइप, गैर-मौजूद आयात और गैर-कार्यात्मक डेटाबेस क्वेरी वाले असंबद्ध स्निपेट्स बनाता है।',
          'प्रथम ग्राहक सत्यापन से पहले ऑथेंटिकेशन, डेटाबेस और बिलिंग के मैन्युअल सेटअप में 4–6 सप्ताह का समय लग जाता है।'
        ]
      },
      solution: {
        title: 'Multi-Stage Prompt Architecture & Strict Schema Constraints',
        title_hi: 'मल्टी-स्टेज प्रॉम्प्ट आर्किटेक्चर एवं सख्त स्कीमा सीमाएं',
        approach: 'Architected an autonomous prompt-driven SaaS scaffolding engine leveraging Claude 3.5 Sonnet, Cursor AI Composer, and Next.js 14 App Router constrained by strict software design patterns.',
        approach_hi: 'सख्त सॉफ्टवेयर डिज़ाइन पैटर्न से बंधी Claude 3.5 Sonnet, Cursor AI Composer और Next.js 14 App Router का लाभ उठाते हुए एक स्वायत्त प्रॉम्प्ट-संचालित SaaS निर्माण इंजन तैयार किया।',
        keyPillars: [
          { title: 'Schema-First Generation', title_hi: 'स्कीमा-प्रथम जनरेशन', desc: 'Synthesizes normalized PostgreSQL tables with Supabase Row-Level Security (RLS) policies before UI generation.', desc_hi: 'Supabase RLS नीतियों के साथ मजबूत डेटाबेस स्कीमा।' },
          { title: 'Server Actions with Zod', title_hi: 'Zod युक्त Server Actions', desc: 'Generates end-to-end typed mutations with strict schema validation and runtime type safety.', desc_hi: 'सख्त प्रकार सुरक्षा और रनटाइम सत्यापन।' },
          { title: 'Pre-Commit Verification Gates', title_hi: 'प्री-कमिट सत्यापन गेट्स', desc: 'Automated test generation and linting with Oxlint and TypeScript compiler verification.', desc_hi: 'Oxlint और TypeScript द्वारा 0-त्रुटि परीक्षण।' }
        ]
      },
      techAndObstacles: {
        title: 'Context Drift & Third-Party SDK Type Incompatibilities',
        title_hi: 'कंटेक्स्ट विचलन एवं तृतीय-पक्ष SDK असंगति',
        stack: [
          { name: 'Next.js 14 App Router', role: 'React Server Components, Server Actions, and edge-rendered routing', role_hi: 'React Server Components, Server Actions और एज-रेंडर्ड रूटिंग' },
          { name: 'Claude 3.5 Sonnet / Cursor', role: 'High-speed autonomous code synthesis and architectural refactoring', role_hi: 'उच्च-गति स्वायत्त कोड संश्लेषण और वास्तुकला रिफैक्टरिंग' },
          { name: 'Supabase PostgreSQL', role: 'Managed relational database with Row-Level Security (RLS) policies', role_hi: 'Row-Level Security (RLS) नीतियों के साथ प्रबंधित रिलेशनल डेटाबेस' }
        ],
        obstacles: [
          {
            hurdle: 'AI code generators frequently hallucinated database foreign key relations in complex multi-tenant models.',
            hurdle_hi: 'AI कोड जनरेटर जटिल मल्टी-टेनेंट मॉडल में विदेशी कुंजी (Foreign Key) संबंधों की गलत कल्पना करते थे।',
            issue_hi: 'AI कोड जनरेटर जटिल मल्टी-टेनेंट मॉडल में विदेशी कुंजी (Foreign Key) संबंधों की गलत कल्पना करते थे।',
            resolution: 'Created a modular template repository with standardized schema contracts and pre-configured Zod validators.',
            resolution_hi: 'मानकीकृत स्कीमा अनुबंधों और पूर्व-कॉन्फ़िगर किए गए Zod सत्यापनकर्ताओं के साथ एक मॉड्यूलर टेम्पलेट रिपॉजिटरी बनाई।'
          },
          {
            hurdle: 'Stripe webhook listener payloads failed validation due to outdated API SDK syntax in LLM training data.',
            hurdle_hi: 'LLM प्रशिक्षण डेटा में पुराने API SDK सिंटैक्स के कारण Stripe वेबहुक लिसनर सत्यापन विफल हो जाता था।',
            issue_hi: 'LLM प्रशिक्षण डेटा में पुराने API SDK सिंटैक्स के कारण Stripe वेबहुक लिसनर सत्यापन विफल हो जाता था।',
            resolution: 'Enforced explicit TypeScript type boundary contracts and pin latest verified Stripe SDK versions in template presets.',
            resolution_hi: 'स्पष्ट TypeScript प्रकार अनुबंध अनिवार्य किए और टेम्पलेट प्रीसेट में नवीनतम सत्यापित Stripe SDK संस्करण पिन किए।'
          }
        ]
      },
      resultsAndMetrics: {
        title: '10x Shipping Velocity & 25+ Production Applications',
        title_hi: '10x शिपिंग गति एवं 25+ प्रोडक्शन वेब अनुप्रयोग',
        beforeVsAfter: [
          { metric: 'Fullstack MVP Build Time', metric_hi: 'फुल-स्टैक MVP निर्माण समय', before: '4–6 Weeks', before_hi: '4–6 सप्ताह', after: '< 3 Minutes', after_hi: '< 3 मिनट', delta: '-99%', delta_hi: '-99%' },
          { metric: 'Initial Engineering Cost', metric_hi: 'प्रारंभिक इंजीनियरिंग लागत', before: '$5,000–$15,000', before_hi: '$5,000–$15,000', after: '< $5 Token Spend', after_hi: '< $5 टोकन खर्च', delta: '-99.9%', delta_hi: '-99.9%' },
          { metric: 'Codebase Lint & Type Pass Rate', metric_hi: 'कोडबेस लिंट व प्रकार पास दर', before: 'Manual Debugging', before_hi: 'मैन्युअल डिबगिंग', after: '99.4% First Pass', after_hi: '99.4% प्रथम प्रयास', delta: 'Automated', delta_hi: 'स्वचालित' }
        ],
        highlights: [
          'Synthesized fullstack web applications with authentication, database, and billing in under 3 minutes.',
          'Accelerated shipping velocity by 10x, deploying 25+ production-grade web MVPs.',
          'Achieved 99.4% test pass rate across generated codebases using Oxlint and Vitest.'
        ],
        highlights_hi: [
          'प्रमाणीकरण, डेटाबेस और बिलिंग के साथ 3 मिनट से भी कम समय में फुल-स्टैक वेब ऐप्स तैयार किए।',
          '25+ प्रोडक्शन-ग्रेड वेब MVPs तैनात करते हुए शिपिंग गति को 10x तेज किया।',
          'Oxlint और Vitest का उपयोग करके उत्पन्न कोडबेस में 99.4% टेस्ट पास दर प्राप्त की।'
        ]
      },
      lessonsLearned: {
        title: 'Durable Principles of AI-Native Software Engineering',
        title_hi: 'AI-मूल सॉफ्टवेयर इंजीनियरिंग के स्थायी सिद्धांत',
        takeaways: [
          { principle: 'Constraints Enable Creativity', principle_hi: 'बाधाएं रचनात्मकता को सक्षम बनाती हैं', detail: 'Constraining AI models with strict schema definitions and typed boundaries eliminates hallucinations.', detail_hi: 'सख्त स्कीमा परिभाषाओं और टाइप्ड सीमाओं के साथ AI मॉडल को नियंत्रित करने से मतिभ्रम (Hallucinations) समाप्त हो जाते हैं।' },
          { principle: 'Architecture Before Code', principle_hi: 'कोड से पहले आर्किटेक्चर', detail: 'Decomposing software requirements into clear architectural briefs produces superior code quality.', detail_hi: 'सॉफ्टवेयर आवश्यकताओं को स्पष्ट वास्तुकला विवरणों में विभाजित करने से बेहतर कोड गुणवत्ता उत्पन्न होती है।' },
          { principle: 'Fast Verification Loops', principle_hi: 'तीव्र सत्यापन चक्र', detail: 'High-speed linters and type checkers provide the immediate feedback necessary for autonomous coding velocity.', detail_hi: 'उच्च-गति लिंटर्स और टाइप चेकर स्वायत्त कोडिंग गति के लिए आवश्यक त्वरित प्रतिक्रिया प्रदान करते हैं।' }
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
    title_hi: 'स्वायत्त मल्टी-एजेंट वर्कफ़्लो इंजन प्रणाली',
    subtitle: 'Directed Acyclic Graph (DAG) Orchestration, Self-Healing Loops & Git Ops',
    subtitle_hi: 'DAG आर्केस्ट्रेशन, सेल्फ-हीलिंग लूप्स एवं Git Ops स्वचालन',
    category: 'Agentic AI Architecture',
    category_hi: 'एजेंटिक AI वास्तुकला (Agentic AI Architecture)',
    accentColor: '#10B981',
    summary: 'Decentralized multi-agent development orchestration loop coordinating specialized LLM agents (Planner, Coder, Evaluator) across a Directed Acyclic Graph (DAG) with automated self-healing error recovery, achieving a 94.2% self-healing rate and saving 350+ developer hours.',
    summary_hi: 'विकेंद्रीकृत मल्टी-एजेंट विकास ऑर्केस्ट्रेशन लूप जो विशेष LLM एजेंट्स (प्लानर, कोडर, इवैल्यूएटर) को स्वचालित सेल्फ-हीलिंग रिकवरी के साथ समन्वयित करता है, जिसने 94.2% सेल्फ-हीलिंग सफलता दर हासिल कर 350+ डेवलपर घंटे बचाए।',
    executiveSummary_hi: 'विकेंद्रीकृत मल्टी-एजेंट विकास ऑर्केस्ट्रेशन लूप जो विशेष LLM एजेंट्स (प्लानर, कोडर, इवैल्यूएटर) को स्वचालित सेल्फ-हीलिंग रिकवरी के साथ समन्वयित करता है, जिसने 94.2% सेल्फ-हीलिंग सफलता दर हासिल कर 350+ डेवलपर घंटे बचाए।',
    metrics: [
      { label: 'Autonomous Tasks', label_hi: 'स्वायत्त कार्य', val: '100+', desc: 'Complex programming tasks run', desc_hi: 'निष्पादित जटिल प्रोग्रामिंग कार्य' },
      { label: 'Self-Healing Rate', label_hi: 'सेल्फ-हीलिंग दर', val: '94.2%', desc: 'Automatic error recovery success', desc_hi: 'स्वचालित त्रुटि सुधार सफलता दर' },
      { label: 'Hours Saved', label_hi: 'बचाए गए घंटे', val: '350+', desc: 'Developer engineering hours saved', desc_hi: 'डेवलपर इंजीनियरिंग समय की बचत' },
      { label: 'Task Loop Latency', label_hi: 'लूप विलंबता', val: '< 1.2s', desc: 'Subagent orchestration latency', desc_hi: 'सब-एजेंट ऑर्केस्ट्रेशन विलंबता' }
    ],
    techStack: ['Multi-Agent DAG', 'Claude Code CLI', 'Dynamic Tool Calling', 'Oxlint / Vitest', 'Git Worktrees', 'Self-Healing Feedback', 'State Persistence'],
    challenge_hi: {
      title_hi: 'जटिल कोडबेस पर सिंगल-प्रॉम्प्ट विफलता',
      context_hi: 'कंटेक्स्ट विचलन, टर्मिनल कमांड चलाने में अक्षमता, स्वचालित परीक्षण के अभाव और अपूरणीय सिंटैक्स बग्स के कारण बड़े प्रोग्रामिंग कार्यों पर सिंगल-प्रॉम्प्ट LLM कोड जनरेशन विफल हो जाता है।',
      painPoints_hi: [
        'डेवलपर्स ने दोहराव वाले रखरखाव में भारी समय बर्बाद किया: लिंटिंग त्रुटियां ठीक करना, बड़े फ़ंक्शंस को रिफैक्टर करना और रिग्रेशन टेस्ट लिखना।',
        'जब AI मॉडल टूटा हुआ कोड उत्पन्न करता था, तो उसके पास टेस्ट सुइट चलाने, स्टैक ट्रेस देखने और सुधारात्मक सुधार लागू करने के टूल्स का अभाव था।',
        'अनियंत्रित AI फ़ाइल संपादन से मर्ज टकराव हुए और साझा शाखाओं में कार्यशील कोड ओवरराइट हो गया।'
      ]
    },
    solution_hi: {
      title_hi: 'सेल्फ-हीलिंग फीडबैक युक्त विकेंद्रीकृत मल्टी-एजेंट DAG',
      approach_hi: 'स्वचालित परीक्षण-संचालित फीडबैक के साथ एक डायरेक्टेड एसाइक्लिक ग्राफ (DAG) के माध्यम से विशेष LLM सब-एजेंट्स का समन्वय करने वाला एक स्वायत्त मल्टी-एजेंट डेवलपर लूप तैयार किया।',
      keyHighlights_hi: [
        { title_hi: 'भूमिका विशेषज्ञता (Role Specialization)', desc_hi: 'प्लानर (आर्किटेक्चर), कोडर (कार्यान्वयन), इवैल्यूएटर (परीक्षण) और हीलर (रिकवरी) के बीच जिम्मेदारियों का स्पष्ट विभाजन।' },
        { title_hi: 'पृथक Git वर्क-ट्री (Git Worktrees)', desc_hi: 'सब-एजेंट्स को अलग-अलग वर्क-ट्री में चलाता है, जिससे समवर्ती निष्पादन के दौरान मर्ज विरोध पूरी तरह टल जाता है।' },
        { title_hi: 'सेल्फ-हीलिंग फीडबैक लूप', desc_hi: 'टर्मिनल त्रुटि स्टैक ट्रेस को कोडर एजेंट्स को वापस भेजता है जब तक कि सभी गुणवत्ता गेट्स सफलतापूर्वक पास न हो जाएं।' }
      ],
      keyPillars_hi: [
        { title_hi: 'भूमिका विशेषज्ञता', desc_hi: 'प्लानर, कोडर, इवैल्यूएटर और हीलर का विभाजन।' },
        { title_hi: 'पृथक Git वर्क-ट्री', desc_hi: 'मर्ज विरोध से मुक्त समवर्ती कोड निष्पादन।' },
        { title_hi: 'सेल्फ-हीलिंग लूप', desc_hi: 'स्टैक ट्रेस के आधार पर स्वचालित कोड मरम्मत।' }
      ]
    },
    hurdles_hi: [
      {
        hurdle_hi: 'जब टेस्ट अभिकथन लगातार विफल होते थे तो सब-एजेंट अनंत मरम्मत लूप (Infinite Repair Loops) में फंस जाते थे।',
        issue_hi: 'जब टेस्ट अभिकथन लगातार विफल होते थे तो सब-एजेंट अनंत मरम्मत लूप (Infinite Repair Loops) में फंस जाते थे।',
        resolution_hi: 'घातीय बैकऑफ के साथ अधिकतम 3 सेल्फ-हीलिंग प्रयासों पर सीमित मैक्स-रीट्राई सर्किट ब्रेकर लागू किए।'
      },
      {
        hurdle_hi: 'टर्मिनल लॉग की अत्यधिक लंबाई के कारण टोकन सीमा पार हो जाती थी और संदर्भ में भारी गिरावट आती थी।',
        issue_hi: 'टर्मिनल लॉग की अत्यधिक लंबाई के कारण टोकन सीमा पार हो जाती थी और संदर्भ में भारी गिरावट आती थी।',
        resolution_hi: 'एक बुद्धिमान त्रुटि निष्कर्षण उपकरण बनाया जो स्टैक ट्रेस को पार्स करता है, प्रासंगिक कोड पंक्तियों को अलग करता है और शोर वाले आउटपुट को हटा देता है।'
      }
    ],
    impact_hi: {
      title_hi: '350+ घंटे की बचत एवं भरोसेमंद स्वायत्त इंजीनियरिंग',
      beforeAfter_hi: [
        { metric_hi: 'मैन्युअल डिबगिंग हस्तक्षेप', before_hi: '100% मानवीय निगरानी', after_hi: '94.2% स्वायत्त सुधार', delta_hi: '+94.2%' },
        { metric_hi: 'औसत बग समाधान चक्र', before_hi: '45–90 मिनट', after_hi: '< 3 मिनट', delta_hi: '-96%' },
        { metric_hi: 'फीचर डिलीवरी टर्नअराउंड', before_hi: '3–5 दिन', after_hi: 'उसी दिन (घंटों में)', delta_hi: '4x तेज' }
      ],
      highlights_hi: [
        '100+ एंड-टू-एंड स्वायत्त इंजीनियरिंग वर्कफ़्लो को सफलतापूर्वक निष्पादित किया।',
        'वास्तविक कोड रिग्रेशन पर 94.2% सेल्फ-हीलिंग त्रुटि सुधार दर हासिल की।',
        'नियमित रिफैक्टरिंग, लिंटिंग और टेस्टिंग पर 350+ वरिष्ठ डेवलपर घंटे बचाए।'
      ]
    },
    takeaways_hi: [
      { principle_hi: 'तेज़ फीडबैक एजेंट्स की खुराक है', detail_hi: 'स्वायत्त एजेंट तब उत्कृष्ट प्रदर्शन करते हैं जब उन्हें स्पष्ट त्रुटि संकेत देने वाले हाई-स्पीड लिंटर्स और यूनिट टेस्ट से जोड़ा जाता है।' },
      { principle_hi: 'विशेषज्ञता मोनोलिथिक मॉडल से बेहतर है', detail_hi: 'जिम्मेदारियों को प्लानर, कोडर और इवैल्यूएटर में विभाजित करने से संज्ञानात्मक अधिभार रुकता है।' },
      { principle_hi: 'सर्किट ब्रेकर अनियंत्रित लूप्स को रोकते हैं', detail_hi: 'विश्वसनीय प्रोडक्शन एजेंट्स के लिए कठोर पुनः प्रयास सीमाएं और टोकन बजट सीमा अनिवार्य हैं।' }
    ],
    story: {
      challenge: {
        title: 'Single-Prompt Failure on Complex Codebases',
        title_hi: 'जटिल कोडबेस पर सिंगल-प्रॉम्प्ट विफलता',
        context: 'Single-prompt LLM code generation fails on large or complex programming tasks due to context drift, inability to run terminal commands, absence of automated testing, and unrecoverable syntax bugs.',
        context_hi: 'कंटेक्स्ट विचलन, टर्मिनल कमांड चलाने में अक्षमता, स्वचालित परीक्षण के अभाव और अपूरणीय सिंटैक्स बग्स के कारण बड़े प्रोग्रामिंग कार्यों पर सिंगल-प्रॉम्प्ट LLM कोड जनरेशन विफल हो जाता है।',
        painPoints: [
          'Developers spent immense time on repetitive maintenance: fixing linting errors, refactoring large functions, and writing regression tests.',
          'When an AI model generated broken code, it lacked the tools to run the test suite, observe the stack trace, and apply corrective fixes.',
          'Unconstrained AI file edits caused merge collisions and overwrote working code in shared branches.'
        ],
        painPoints_hi: [
          'डेवलपर्स ने दोहराव वाले रखरखाव में भारी समय बर्बाद किया: लिंटिंग त्रुटियां ठीक करना, बड़े फ़ंक्शंस को रिफैक्टर करना और रिग्रेशन टेस्ट लिखना।',
          'जब AI मॉडल टूटा हुआ कोड उत्पन्न करता था, तो उसके पास टेस्ट सुइट चलाने, स्टैक ट्रेस देखने और सुधारात्मक सुधार लागू करने के टूल्स का अभाव था।',
          'अनियंत्रित AI फ़ाइल संपादन से मर्ज टकराव हुए और साझा शाखाओं में कार्यशील कोड ओवरराइट हो गया।'
        ]
      },
      solution: {
        title: 'Decentralized Multi-Agent DAG with Self-Healing Feedback',
        title_hi: 'सेल्फ-हीलिंग फीडबैक युक्त विकेंद्रीकृत मल्टी-एजेंट DAG',
        approach: 'Architected an autonomous multi-agent developer loop coordinating specialized LLM subagents through a Directed Acyclic Graph (DAG) with automated test-driven feedback.',
        approach_hi: 'स्वचालित परीक्षण-संचालित फीडबैक के साथ एक डायरेक्टेड एसाइक्लिक ग्राफ (DAG) के माध्यम से विशेष LLM सब-एजेंट्स का समन्वय करने वाला एक स्वायत्त मल्टी-एजेंट डेवलपर लूप तैयार किया।',
        keyPillars: [
          { title: 'Role Specialization', title_hi: 'भूमिका विशेषज्ञता', desc: 'Separated concerns between Planner (architecture), Coder (implementation), Evaluator (testing), and Healer (recovery).', desc_hi: 'प्लानर, कोडर, इवैल्यूएटर और हीलर का विभाजन।' },
          { title: 'Isolated Git Worktrees', title_hi: 'पृथक Git वर्क-ट्री', desc: 'Runs subagents in isolated git worktrees, preventing merge conflicts during concurrent execution.', desc_hi: 'मर्ज विरोध से मुक्त समवर्ती कोड निष्पादन।' },
          { title: 'Self-Healing Feedback Loop', title_hi: 'सेल्फ-हीलिंग लूप', desc: 'Feeds terminal error stack traces back to coder agents for iterative repair until all quality gates pass.', desc_hi: 'स्टैक ट्रेस के आधार पर स्वचालित कोड मरम्मत।' }
        ]
      },
      techAndObstacles: {
        title: 'Infinite Repair Loops & Token Budget Explosions',
        title_hi: 'अनंत मरम्मत लूप एवं टोकन बजट विस्फोट',
        stack: [
          { name: 'Multi-Agent DAG Orchestrator', role: 'Task decomposition, dependency scheduling, and state persistence', role_hi: 'कार्य अपघटन, निर्भरता शेड्यूलिंग और स्थिति दृढ़ता' },
          { name: 'Dynamic Tool Calling Harness', role: 'Safe terminal execution, file system modification, and AST querying', role_hi: 'सुरक्षित टर्मिनल निष्पादन, फ़ाइल सिस्टम संशोधन और AST क्वेरी' },
          { name: 'Git Worktree Engine', role: 'Isolated worktree creation, branch switching, and atomic PR commits', role_hi: 'पृथक वर्क-ट्री निर्माण, शाखा स्विचिंग और कमिट्स' }
        ],
        obstacles: [
          {
            hurdle: 'Subagents got stuck in infinite repair loops when test assertions continuously failed.',
            hurdle_hi: 'जब टेस्ट अभिकथन लगातार विफल होते थे तो सब-एजेंट अनंत मरम्मत लूप (Infinite Repair Loops) में फंस जाते थे।',
            issue_hi: 'जब टेस्ट अभिकथन लगातार विफल होते थे तो सब-एजेंट अनंत मरम्मत लूप (Infinite Repair Loops) में फंस जाते थे।',
            resolution: 'Implemented max-retry circuit breakers capped at 3 self-healing attempts with exponential backoff.',
            resolution_hi: 'घातीय बैकऑफ के साथ अधिकतम 3 सेल्फ-हीलिंग प्रयासों पर सीमित मैक्स-रीट्राई सर्किट ब्रेकर लागू किए।'
          },
          {
            hurdle: 'Terminal log verbosity caused token limit overflow and massive context degradation.',
            hurdle_hi: 'टर्मिनल लॉग की अत्यधिक लंबाई के कारण टोकन सीमा पार हो जाती थी और संदर्भ में भारी गिरावट आती थी।',
            issue_hi: 'टर्मिनल लॉग की अत्यधिक लंबाई के कारण टोकन सीमा पार हो जाती थी और संदर्भ में भारी गिरावट आती थी।',
            resolution: 'Built an intelligent error extractor that parses stack traces, isolates relevant file lines, and strips noisy terminal output.',
            resolution_hi: 'एक बुद्धिमान त्रुटि निष्कर्षण उपकरण बनाया जो स्टैक ट्रेस को पार्स करता है, प्रासंगिक कोड पंक्तियों को अलग करता है और शोर वाले आउटपुट को हटा देता है।'
          }
        ]
      },
      resultsAndMetrics: {
        title: '350+ Hours Saved & Dependable Autonomous Engineering',
        title_hi: '350+ घंटे की बचत एवं भरोसेमंद स्वायत्त इंजीनियरिंग',
        beforeVsAfter: [
          { metric: 'Manual Debugging Intervention', metric_hi: 'मैन्युअल डिबगिंग हस्तक्षेप', before: '100% Human Oversight', before_hi: '100% मानवीय निगरानी', after: '94.2% Autonomous Fix', after_hi: '94.2% स्वायत्त सुधार', delta: '+94.2%', delta_hi: '+94.2%' },
          { metric: 'Average Bug Resolution Cycle', metric_hi: 'औसत बग समाधान चक्र', before: '45–90 Minutes', before_hi: '45–90 मिनट', after: '< 3 Minutes', after_hi: '< 3 मिनट', delta: '-96%', delta_hi: '-96%' },
          { metric: 'Feature Delivery Turnaround', metric_hi: 'फीचर डिलीवरी टर्नअराउंड', before: '3–5 Days', before_hi: '3–5 दिन', after: 'Same-Day (Hours)', after_hi: 'उसी दिन (घंटों में)', delta: '4x Faster', delta_hi: '4x तेज' }
        ],
        highlights: [
          'Successfully executed 100+ end-to-end autonomous engineering workflows.',
          'Achieved 94.2% self-healing error recovery rate on real-world regressions.',
          'Saved over 350+ senior developer hours on routine refactoring, linting, and testing.'
        ],
        highlights_hi: [
          '100+ एंड-टू-एंड स्वायत्त इंजीनियरिंग वर्कफ़्लो को सफलतापूर्वक निष्पादित किया।',
          'वास्तविक कोड रिग्रेशन पर 94.2% सेल्फ-हीलिंग त्रुटि सुधार दर हासिल की।',
          'नियमित रिफैक्टरिंग, लिंटिंग और टेस्टिंग पर 350+ वरिष्ठ डेवलपर घंटे बचाए।'
        ]
      },
      lessonsLearned: {
        title: 'Core Insights in Autonomous Multi-Agent Design',
        title_hi: 'स्वायत्त मल्टी-एजेंट डिज़ाइन के मुख्य अंतर्दृष्टि',
        takeaways: [
          { principle: 'Fast Feedback is Food for Agents', principle_hi: 'तेज़ फीडबैक एजेंट्स की खुराक है', detail: 'Autonomous agents excel when paired with lightning-fast linters and unit tests providing clear error signals.', detail_hi: 'स्वायत्त एजेंट तब उत्कृष्ट प्रदर्शन करते हैं जब उन्हें स्पष्ट त्रुटि संकेत देने वाले हाई-स्पीड लिंटर्स और यूनिट टेस्ट से जोड़ा जाता है।' },
          { principle: 'Specialization Beats Monolithic Models', principle_hi: 'विशेषज्ञता मोनोलिथिक मॉडल से बेहतर है', detail: 'Dividing responsibilities into Planner, Coder, and Evaluator prevents cognitive overload.', detail_hi: 'जिम्मेदारियों को प्लानर, कोडर और इवैल्यूएटर में विभाजित करने से संज्ञानात्मक अधिभार रुकता है।' },
          { principle: 'Circuit Breakers Prevent Runaways', principle_hi: 'सर्किट ब्रेकर अनियंत्रित लूप्स को रोकते हैं', detail: 'Rigorous retry limits and token budget caps are mandatory for dependable production agents.', detail_hi: 'विश्वसनीय प्रोडक्शन एजेंट्स के लिए कठोर पुनः प्रयास सीमाएं और टोकन बजट सीमा अनिवार्य हैं।' }
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
    title_hi: 'रियल-टाइम AI दस्तावेज़ एवं कोड संश्लेषक प्रणाली',
    subtitle: 'Multimodal OCR, Vector Chunking, Streaming LLM & Generative UI Canvas',
    subtitle_hi: 'मल्टीमॉडल OCR, वेक्टर चंकिंग, स्ट्रीमिंग LLM एवं जेनरेटिव UI कैनवास',
    category: 'Enterprise Generative AI',
    category_hi: 'एंटरप्राइज जेनरेटिव AI (Enterprise Generative AI)',
    accentColor: '#10B981',
    summary: 'Real-time reactive generative canvas powered by multimodal LLMs, client-side vector search, and Server-Sent Events (SSE) streaming, parsing dense financial statements and PDFs at 50 pages/second with 85ms streaming token latency and strict Zod validation.',
    summary_hi: 'मल्टीमॉडल LLMs, क्लाइंट-साइड वेक्टर खोज और Server-Sent Events (SSE) स्ट्रीमिंग द्वारा संचालित रियल-टाइम जेनरेटिव कैनवास, जो 85ms टोकन विलंबता और सख्त Zod सत्यापन के साथ 50 पेज/सेकंड की गति से जटिल वित्तीय विवरणों और PDFs का विश्लेषण करता है।',
    executiveSummary_hi: 'मल्टीमॉडल LLMs, क्लाइंट-साइड वेक्टर खोज और Server-Sent Events (SSE) स्ट्रीमिंग द्वारा संचालित रियल-टाइम जेनरेटिव कैनवास, जो 85ms टोकन विलंबता और सख्त Zod सत्यापन के साथ 50 पेज/सेकंड की गति से जटिल वित्तीय विवरणों और PDFs का विश्लेषण करता है।',
    metrics: [
      { label: 'Parse Throughput', label_hi: 'पार्स थ्रूपुट', val: '50 Pgs/s', desc: 'Document ingestion velocity', desc_hi: 'दस्तावेज़ पार्सिंग गति' },
      { label: 'Streaming Latency', label_hi: 'स्ट्रीमिंग विलंबता', val: '85ms', desc: 'Real-time token latency', desc_hi: 'रियल-टाइम टोकन प्रतिक्रिया' },
      { label: 'Token Efficiency', label_hi: 'टोकन दक्षता', val: '+45%', desc: 'Optimized via vector chunking', desc_hi: 'वेक्टर चंकिंग द्वारा अनुकूलित' },
      { label: 'User Satisfaction', label_hi: 'संतुष्टि रेटिंग', val: '4.9/5', desc: 'Auditor & accountant rating', desc_hi: 'ऑडिटर व अकाउंटेंट रेटिंग' }
    ],
    techStack: ['React 19', 'Streaming LLM (SSE)', 'Vector Embeddings & Cosine Search', 'Zod Schema Validation', 'KaTeX Typesetting', 'Edge Functions', 'Tailwind CSS'],
    challenge_hi: {
      title_hi: 'मैन्युअल प्रतिलेखन बाधाएं एवं असंरचित OCR अव्यवस्था',
      context_hi: 'अकाउंटिंग, वित्तीय और कानूनी पेशेवर स्कैन की गई रसीदों, चालानों, जटिल टैक्स फॉर्म और वित्तीय पीडीएफ से स्प्रेडशीट में सारणीबद्ध डेटा टाइप करने में हजारों घंटे बर्बाद करते हैं।',
      painPoints_hi: [
        'पारंपरिक OCR उपकरण असंरचित टेक्स्ट ब्लॉक आउटपुट करते हैं जो तालिका की पंक्ति/स्तंभ सीमाओं को खो देते हैं और दशमलव बिंदुओं को गलत पढ़ते हैं।',
        '50-पृष्ठ के वित्तीय विवरण के मैन्युअल प्रतिलेखन में उच्च विसंगति त्रुटियों के साथ 25–30 घंटे का समय लगता था।',
        'उपयोगकर्ताओं के पास AI निष्कर्षण प्रगति की कोई वास्तविक समय दृश्यता नहीं थी, जिससे ब्राउज़र टाइमआउट और परिणामों में अविश्वास पैदा हुआ।'
      ]
    },
    solution_hi: {
      title_hi: 'स्ट्रीमिंग मल्टीमॉडल वेक्टर कैनवास एवं सख्त स्कीमा सुरक्षा उपाय',
      approach_hi: 'मल्टीमॉडल फ्रंटियर LLMs, क्लाइंट-साइड वेक्टर खोज और गणितीय सत्यापन के साथ Server-Sent Events (SSE) स्ट्रीमिंग द्वारा संचालित एक रियल-टाइम प्रतिक्रियाशील कैनवास विकसित किया।',
      keyHighlights_hi: [
        { title_hi: 'सिमेंटिक वेक्टर चंकिंग (Semantic Vector Chunking)', desc_hi: '15ms से कम कोसाइन समानता खोज के साथ बहु-पृष्ठ दस्तावेजों को क्लाइंट-साइड वेक्टर चंक्स में अनुक्रमित करता है।' },
        { title_hi: 'जेनरेटिव UI संश्लेषण', desc_hi: 'टोकन स्ट्रीम होते ही प्रतिक्रियाशील TypeScript घटकों, KaTeX सूत्रों और चार्ट टेलीमेट्री को गतिशील रूप से संश्लेषित करता है।' },
        { title_hi: 'दोहरी प्रविष्टि Zod सत्यापन', desc_hi: 'स्क्रीन पर रेंडर करने से पहले निकाले गए डेबिट और क्रेडिट के बराबर होने को सुनिश्चित करने वाले गणितीय नियमों को लागू करता है।' }
      ],
      keyPillars_hi: [
        { title_hi: 'सिमेंटिक वेक्टर चंकिंग', desc_hi: 'क्लाइंट-साइड तेज़ कोसाइन वेक्टर खोज।' },
        { title_hi: 'जेनरेटिव UI संश्लेषण', desc_hi: 'स्ट्रीमिंग टोकन के साथ लाइव KaTeX और चार्ट रेंडरिंग।' },
        { title_hi: 'दोहरी प्रविष्टि Zod सत्यापन', desc_hi: 'डेबिट-क्रेडिट समानता का सख्त गणितीय परीक्षण।' }
      ]
    },
    hurdles_hi: [
      {
        hurdle_hi: 'जटिल वित्तीय समीकरणों और बड़े गणितीय पेड़ों को रेंडर करने से React में फ़्रेम ड्रॉप्स होते थे।',
        issue_hi: 'जटिल वित्तीय समीकरणों और बड़े गणितीय पेड़ों को रेंडर करने से React में फ़्रेम ड्रॉप्स होते थे।',
        resolution_hi: 'प्रोग्रेसिव स्ट्रीमिंग कंपोनेंट वर्चुअलाइजेशन लागू किया जो केवल दृश्य व्यूपोर्ट में प्रवेश करने पर ही तत्वों को माउंट करता है।'
      },
      {
        hurdle_hi: 'मल्टीमॉडल विज़न मॉडल कभी-कभी घने बैलेंस शीट तालिकाओं में अल्पविराम की गलत कल्पना करते थे या दशमलव को गलत जगह रख देते थे।',
        issue_hi: 'मल्टीमॉडल विज़न मॉडल कभी-कभी घने बैलेंस शीट तालिकाओं में अल्पविराम की गलत कल्पना करते थे या दशमलव को गलत जगह रख देते थे।',
        resolution_hi: 'दोहरी प्रविष्टि सत्यापन स्क्रिप्ट लागू की जो संख्याओं को स्वीकार करने से पहले पंक्ति योगों को घोषित स्तंभ योगों से सत्यापित करती है।'
      }
    ],
    impact_hi: {
      title_hi: '50 पेज/सेकंड थ्रूपुट एवं 85ms स्ट्रीमिंग टोकन गति',
      beforeAfter_hi: [
        { metric_hi: 'दस्तावेज़ प्रतिलेखन समय', before_hi: '25–30 मिनट', after_hi: '< 10 सेकंड', delta_hi: '-99%' },
        { metric_hi: 'सारणीबद्ध निष्कर्षण त्रुटि दर', before_hi: '8–12% त्रुटि', after_hi: '< 0.1%', delta_hi: '-98%' },
        { metric_hi: 'अनुभूत जनरेशन विलंबता', before_hi: '45s स्पिनर प्रतीक्षा', after_hi: '85ms प्रथम टोकन', delta_hi: 'तत्काल' }
      ],
      highlights_hi: [
        'जटिल वित्तीय विवरणों के लिए 50 पृष्ठ/सेकंड पार्सिंग थ्रूपुट विकसित किया।',
        'शून्य ब्राउज़र फ्रीजिंग के साथ 85ms स्ट्रीमिंग टोकन विलंबता प्राप्त की।',
        'क्लाइंट-साइड वेक्टर चंकिंग का उपयोग करके LLM टोकन दक्षता में 45% की वृद्धि की।'
      ]
    },
    takeaways_hi: [
      { principle_hi: 'स्ट्रीमिंग उपयोगकर्ता का भरोसा बनाती है', detail_hi: 'टोकन और सूत्रों को वास्तविक समय में हल होते देखना प्रतीक्षा को एक पारदर्शी अनुभव में बदल देता है।' },
      { principle_hi: 'शुद्ध AI पर स्कीमा सत्यापन को प्राथमिकता दें', detail_hi: 'जेनरेटिव LLM को नियतात्मक गणितीय सत्यापन नियमों के साथ जोड़ना संस्थागत सटीकता की गारंटी देता है।' },
      { principle_hi: 'वेक्टर पुनर्प्राप्ति टोकन बर्बादी को रोकती है', detail_hi: 'कोसाइन खोज के साथ प्रासंगिक दस्तावेज़ चंक्स को पूर्व-फ़िल्टर करना अनावश्यक टोकन खर्च में 45%+ की बचत करता है।' }
    ],
    story: {
      challenge: {
        title: 'Manual Transcription Bottlenecks & Unstructured OCR Chaos',
        title_hi: 'मैन्युअल प्रतिलेखन बाधाएं एवं असंरचित OCR अव्यवस्था',
        context: 'Accounting, financial, and legal professionals waste thousands of hours transcribing tabular data from scanned receipts, invoices, complex tax forms, and financial PDFs into spreadsheets and software systems.',
        context_hi: 'अकाउंटिंग, वित्तीय और कानूनी पेशेवर स्कैन की गई रसीदों, चालानों, जटिल टैक्स फॉर्म और वित्तीय पीडीएफ से स्प्रेडशीट में सारणीबद्ध डेटा टाइप करने में हजारों घंटे बर्बाद करते हैं।',
        painPoints: [
          'Traditional OCR tools output unstructured text blobs that lose table row/column boundaries and misread decimal points.',
          'Manual transcription of a 50-page financial statement consumed 25–30 hours with high transposition error rates.',
          'Users lacked real-time visibility into AI extraction progress, leading to browser timeouts and lack of trust in results.'
        ],
        painPoints_hi: [
          'पारंपरिक OCR उपकरण असंरचित टेक्स्ट ब्लॉक आउटपुट करते हैं जो तालिका की पंक्ति/स्तंभ सीमाओं को खो देते हैं और दशमलव बिंदुओं को गलत पढ़ते हैं।',
          '50-पृष्ठ के वित्तीय विवरण के मैन्युअल प्रतिलेखन में उच्च विसंगति त्रुटियों के साथ 25–30 घंटे का समय लगता था।',
          'उपयोगकर्ताओं के पास AI निष्कर्षण प्रगति की कोई वास्तविक समय दृश्यता नहीं थी, जिससे ब्राउज़र टाइमआउट और परिणामों में अविश्वास पैदा हुआ।'
        ]
      },
      solution: {
        title: 'Streaming Multimodal Vector Canvas with Strict Schema Guardrails',
        title_hi: 'स्ट्रीमिंग मल्टीमॉडल वेक्टर कैनवास एवं सख्त स्कीमा सुरक्षा उपाय',
        approach: 'Developed a real-time reactive canvas powered by multimodal frontier LLMs, client-side vector search, and Server-Sent Events (SSE) streaming with mathematical validation.',
        approach_hi: 'मल्टीमॉडल फ्रंटियर LLMs, क्लाइंट-साइड वेक्टर खोज और गणितीय सत्यापन के साथ Server-Sent Events (SSE) स्ट्रीमिंग द्वारा संचालित एक रियल-टाइम प्रतिक्रियाशील कैनवास विकसित किया।',
        keyPillars: [
          { title: 'Semantic Vector Chunking', title_hi: 'सिमेंटिक वेक्टर चंकिंग', desc: 'Indexes dense multi-page documents into client-side vector chunks with sub-15ms cosine similarity lookup.', desc_hi: 'क्लाइंट-साइड तेज़ कोसाइन वेक्टर खोज।' },
          { title: 'Generative UI Synthesis', title_hi: 'जेनरेटिव UI संश्लेषण', desc: 'Dynamically synthesizes reactive TypeScript components, KaTeX formulas, and chart telemetry as tokens stream in.', desc_hi: 'स्ट्रीमिंग टोकन के साथ लाइव KaTeX और चार्ट रेंडरिंग।' },
          { title: 'Double-Entry Zod Validation', title_hi: 'दोहरी प्रविष्टि Zod सत्यापन', desc: 'Enforces mathematical rules ensuring that extracted debits equal credits before rendering on screen.', desc_hi: 'डेबिट-क्रेडिट समानता का सख्त गणितीय परीक्षण।' }
        ]
      },
      techAndObstacles: {
        title: 'High Token Latency & DOM Freezes on Large Mathematical Trees',
        title_hi: 'उच्च टोकन विलंबता एवं बड़े गणितीय ट्री पर DOM फ्रीज',
        stack: [
          { name: 'React 19 Reactive Canvas', role: 'High-speed component rendering, concurrent transitions, and virtual DOM', role_hi: 'उच्च-गति कंपोनेंट रेंडरिंग, समवर्ती ट्रांजिशन और वर्चुअल DOM' },
          { name: 'Server-Sent Events (SSE) Stream', role: 'Real-time progressive token streaming directly from edge functions', role_hi: 'एज फ़ंक्शंस से सीधे रीयल-टाइम प्रोग्रेसिव टोकन स्ट्रीमिंग' },
          { name: 'KaTeX & Zod Validator', role: 'Mathematical typesetting and strict schema validation of extracted figures', role_hi: 'गणितीय टाइपसेटिंग और निकाले गए आंकड़ों का सख्त स्कीमा सत्यापन' }
        ],
        obstacles: [
          {
            hurdle: 'Rendering complex financial equations and large mathematical trees caused frame drops in React.',
            hurdle_hi: 'जटिल वित्तीय समीकरणों और बड़े गणितीय पेड़ों को रेंडर करने से React में फ़्रेम ड्रॉप्स होते थे।',
            issue_hi: 'जटिल वित्तीय समीकरणों और बड़े गणितीय पेड़ों को रेंडर करने से React में फ़्रेम ड्रॉप्स होते थे।',
            resolution: 'Implemented progressive streaming component virtualization that mounts elements only as they enter the visible viewport.',
            resolution_hi: 'प्रोग्रेसिव स्ट्रीमिंग कंपोनेंट वर्चुअलाइजेशन लागू किया जो केवल दृश्य व्यूपोर्ट में प्रवेश करने पर ही तत्वों को माउंट करता है।'
          },
          {
            hurdle: 'Multimodal vision models occasionally hallucinated commas or misplaced decimals in dense balance sheet tables.',
            hurdle_hi: 'मल्टीमॉडल विज़न मॉडल कभी-कभी घने बैलेंस शीट तालिकाओं में अल्पविराम की गलत कल्पना करते थे या दशमलव को गलत जगह रख देते थे।',
            issue_hi: 'मल्टीमॉडल विज़न मॉडल कभी-कभी घने बैलेंस शीट तालिकाओं में अल्पविराम की गलत कल्पना करते थे या दशमलव को गलत जगह रख देते थे।',
            resolution: 'Enforced double-entry verification scripts that cross-check row totals against stated column sums before accepting numbers.',
            resolution_hi: 'दोहरी प्रविष्टि सत्यापन स्क्रिप्ट लागू की जो संख्याओं को स्वीकार करने से पहले पंक्ति योगों को घोषित स्तंभ योगों से सत्यापित करती है।'
          }
        ]
      },
      resultsAndMetrics: {
        title: '50 Pages/Sec Throughput & Sub-100ms Streaming Latency',
        title_hi: '50 पेज/सेकंड थ्रूपुट एवं 85ms स्ट्रीमिंग टोकन गति',
        beforeVsAfter: [
          { metric: 'Document Transcription Time', metric_hi: 'दस्तावेज़ प्रतिलेखन समय', before: '25–30 Minutes', before_hi: '25–30 मिनट', after: '< 10 Seconds', after_hi: '< 10 सेकंड', delta: '-99%', delta_hi: '-99%' },
          { metric: 'Tabular Extraction Error Rate', metric_hi: 'सारणीबद्ध निष्कर्षण त्रुटि दर', before: '8–12% Transposition', before_hi: '8–12% त्रुटि', after: '< 0.1%', after_hi: '< 0.1%', delta: '-98%', delta_hi: '-98%' },
          { metric: 'Perceived Generation Latency', metric_hi: 'अनुभूत जनरेशन विलंबता', before: '45s Spinner Wait', before_hi: '45s स्पिनर प्रतीक्षा', after: '85ms First Token', after_hi: '85ms प्रथम टोकन', delta: 'Instant', delta_hi: 'तत्काल' }
        ],
        highlights: [
          'Engineered 50 pages/second parsing throughput for dense financial statements.',
          'Achieved 85ms streaming token latency with zero browser freezing.',
          'Increased LLM token efficiency by 45% using client-side vector chunking.'
        ],
        highlights_hi: [
          'जटिल वित्तीय विवरणों के लिए 50 पृष्ठ/सेकंड पार्सिंग थ्रूपुट विकसित किया।',
          'शून्य ब्राउज़र फ्रीजिंग के साथ 85ms स्ट्रीमिंग टोकन विलंबता प्राप्त की।',
          'क्लाइंट-साइड वेक्टर चंकिंग का उपयोग करके LLM टोकन दक्षता में 45% की वृद्धि की।'
        ]
      },
      lessonsLearned: {
        title: 'Essential Insights in Multimodal Generative Systems',
        title_hi: 'मल्टीमॉडल जेनरेटिव सिस्टम में आवश्यक अंतर्दृष्टि',
        takeaways: [
          { principle: 'Streaming Builds User Trust', principle_hi: 'स्ट्रीमिंग उपयोगकर्ता का भरोसा बनाती है', detail: 'Showing tokens and formulas resolve in real time transforms waiting into an engaging, transparent experience.', detail_hi: 'टोकन और सूत्रों को वास्तविक समय में हल होते देखना प्रतीक्षा को एक पारदर्शी अनुभव में बदल देता है।' },
          { principle: 'Schema Validation Over Pure AI', principle_hi: 'शुद्ध AI पर स्कीमा सत्यापन को प्राथमिकता दें', detail: 'Pairing generative LLMs with deterministic mathematical validation rules guarantees institutional accuracy.', detail_hi: 'जेनरेटिव LLM को नियतात्मक गणितीय सत्यापन नियमों के साथ जोड़ना संस्थागत सटीकता की गारंटी देता है।' },
          { principle: 'Vector Retrieval Cuts Token Waste', principle_hi: 'वेक्टर पुनर्प्राप्ति टोकन बर्बादी को रोकती है', detail: 'Pre-filtering relevant document chunks with cosine search saves 45%+ in unnecessary token spend.', detail_hi: 'कोसाइन खोज के साथ प्रासंगिक दस्तावेज़ चंक्स को पूर्व-फ़िल्टर करना अनावश्यक टोकन खर्च में 45%+ की बचत करता है।' }
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
