import fs from 'fs';
import path from 'path';

function createPdf() {
  // Page Dimensions: Standard A4 (595.28 x 841.89 pt)
  const pageWidth = 595.28;
  const pageHeight = 841.89;

  // PDF content stream lines
  const streamLines = [];

  // Helper: Text Escaping for standard PDF literal strings (Strict ASCII)
  function escapePdf(text) {
    if (!text) return '';
    return text
      .replace(/—/g, '-') // em-dash to ASCII hyphen
      .replace(/–/g, '-') // en-dash to ASCII hyphen
      .replace(/[\u2018\u2019]/g, "'") // curly single quotes
      .replace(/[\u201C\u201D]/g, '"') // curly double quotes
      .replace(/•/g, '-') // bullet to dash
      .replace(/[^\x20-\x7E]/g, '') // strip any non-ASCII characters
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
  }

  // Helper: Draw Text
  function drawText(font, size, x, y, text, r = 0.1, g = 0.1, b = 0.1) {
    const escaped = escapePdf(text);
    streamLines.push(
      'BT',
      `/${font} ${size.toFixed(2)} Tf`,
      `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`,
      `1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm`,
      `(${escaped}) Tj`,
      'ET'
    );
  }

  // Helper: Draw Line (Strictly x1 y1 m x2 y2 l S)
  function drawLine(x1, y1, x2, y2, r = 0.85, g = 0.85, b = 0.85, w = 1) {
    streamLines.push(
      'q',
      `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG`,
      `${w.toFixed(2)} w`,
      `${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`,
      'Q'
    );
  }

  // Helper: Draw Filled Rectangle
  function drawRect(x, y, w, h, r = 0.96, g = 0.96, b = 0.97) {
    streamLines.push(
      'q',
      `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`,
      `${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f`,
      'Q'
    );
  }

  // Helper: Draw Stroked Rectangle
  function drawStrokeRect(x, y, w, h, r = 0.88, g = 0.90, b = 0.93, strokeW = 1) {
    streamLines.push(
      'q',
      `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG`,
      `${strokeW.toFixed(2)} w`,
      `${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re S`,
      'Q'
    );
  }

  // Helper: Draw Filled & Stroked Card
  function drawCard(x, y, w, h, fillR = 0.973, fillG = 0.980, fillB = 0.988, strokeR = 0.886, strokeG = 0.910, strokeB = 0.941, strokeW = 1) {
    drawRect(x, y, w, h, fillR, fillG, fillB);
    drawStrokeRect(x, y, w, h, strokeR, strokeG, strokeB, strokeW);
  }

  // Helper: Draw Visual Pill Badge
  function drawPillBadge(x, y, w, h, label, isFull = false) {
    // Pill background (#EEF2F6) & border (#CBD5E1)
    drawRect(x, y, w, h, 0.933, 0.949, 0.965);
    drawStrokeRect(x, y, w, h, 0.796, 0.835, 0.882, 0.75);

    // Accent mini dot on left
    drawRect(x + 5, y + (h / 2) - 1.5, 3, 3, 1.000, 0.302, 0.427);

    // Text in Dark Slate (#1E293B)
    const fontSize = isFull ? 7.4 : 7.0;
    drawText('F2', fontSize, x + 12, y + (h / 2) - 2.5, label, 0.118, 0.161, 0.231);
  }

  // Helper: Simple Word Wrapping
  function wrapText(text, maxChars) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    for (const word of words) {
      if (!currentLine) {
        currentLine = word;
      } else if ((currentLine + ' ' + word).length <= maxChars) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  }

  // =========================================================================
  // 1. TOP FULL-BLEED HEADER BANNER (y = 755 to 841.89 pt, height = 86.89 pt)
  // =========================================================================
  const headerHeight = 86.89;
  const headerBottom = pageHeight - headerHeight; // 755.00 pt

  // Navy banner background (#0F172A)
  drawRect(0, headerBottom, pageWidth, headerHeight, 0.059, 0.090, 0.165);

  // Bottom coral accent bar (height: 3 pt, from 752 to 755)
  drawRect(0, headerBottom - 3.0, pageWidth, 3.0, 1.000, 0.302, 0.427);

  // Candidate Name (Helvetica-Bold, 21 pt, White #FFFFFF)
  drawText('F2', 21.0, 28, headerBottom + 50, 'ATUL KANT VERMA', 1.0, 1.0, 1.0);

  // Subtitle (Helvetica-Bold, 9.5 pt, Coral #FF4D6D)
  drawText('F2', 9.5, 28, headerBottom + 32, 'MIS Executive  |  Financial Accounting Specialist  |  Digital Applications', 1.000, 0.302, 0.427);

  // Core Value Proposition (Helvetica-Oblique, 7.8 pt, #94A3B8)
  drawText('F3', 7.8, 28, headerBottom + 16, 'Statutory Compliance (GST & ITR)  *  Tally Prime & ERP 9  *  Enterprise MIS Analytics', 0.580, 0.639, 0.722);

  // Tag Pill Badge at Right: 'VERIFIED PORTFOLIO RESUME'
  const badgeW = 160;
  const badgeH = 22;
  const badgeX = pageWidth - 28 - badgeW;
  const badgeY = headerBottom + 46;

  // Dark slate pill container
  drawRect(badgeX, badgeY, badgeW, badgeH, 0.118, 0.161, 0.231);
  drawStrokeRect(badgeX, badgeY, badgeW, badgeH, 0.200, 0.255, 0.333, 1.0);

  // Coral indicator dot
  drawRect(badgeX + 8, badgeY + (badgeH / 2) - 2.0, 4.0, 4.0, 1.000, 0.302, 0.427);

  // Badge text (7.5 pt, Helvetica-Bold, #F8FAFC)
  drawText('F2', 7.5, badgeX + 17, badgeY + 6.5, 'VERIFIED PORTFOLIO RESUME', 0.973, 0.980, 0.988);

  // Badge subtext
  drawText('F3', 7.0, badgeX + 17, headerBottom + 30, 'Executive 1-Page Summary', 0.580, 0.639, 0.722);
  drawText('F1', 6.8, badgeX + 17, headerBottom + 16, 'Confidential Career Dossier', 0.450, 0.500, 0.580);

  // =========================================================================
  // 2. LEFT SIDEBAR (x = 24 pt, width = 170 pt, spanning y = 46 to 740 pt)
  // =========================================================================
  const sidebarX = 24;
  const sidebarW = 170;
  const sidebarY = 46;
  const sidebarH = 694;

  // Subtle background card (#F8FAFC) with light border (#E2E8F0)
  drawCard(sidebarX, sidebarY, sidebarW, sidebarH, 0.973, 0.980, 0.988, 0.886, 0.910, 0.941, 1.0);

  // Helper: Section Heading in Sidebar
  function drawSidebarHeading(title, y) {
    // Coral bar
    drawRect(sidebarX + 10, y - 1.0, 3.0, 10.5, 1.000, 0.302, 0.427);
    // Heading title
    drawText('F2', 8.2, sidebarX + 17, y, title.toUpperCase(), 0.059, 0.090, 0.165);
    // Divider rule
    drawLine(sidebarX + 17 + (title.length * 5.4), y + 3.5, sidebarX + sidebarW - 10, y + 3.5, 0.886, 0.910, 0.941, 0.75);
    return y - 13;
  }

  // --- 2.1 CONTACT & WEB (Privacy rule: NO phone number) ---
  let sY = 724;
  sY = drawSidebarHeading('Contact & Web', sY);

  const contactItems = [
    { label: 'EMAIL ADDRESS', val: 'Atulravi2015@gmail.com' },
    { label: 'LOCATION', val: 'Jharkhand, India' },
    { label: 'WEB PORTFOLIO', val: 'Interactive Web Portfolio' },
    { label: 'PORTFOLIO ACCESS', val: 'Verified Live Application' }
  ];

  contactItems.forEach(item => {
    drawText('F2', 6.5, sidebarX + 12, sY, item.label, 0.450, 0.500, 0.580);
    sY -= 9.0;
    drawText('F1', 7.5, sidebarX + 12, sY, item.val, 0.118, 0.161, 0.231);
    sY -= 11.5;
  });

  sY -= 2;

  // --- 2.2 TECHNICAL & CORE SKILLS (Visual Pill Badges) ---
  sY = drawSidebarHeading('Technical Skills', sY);

  // 10 Visual Pill Badges arranged in neat grid
  const badgeLeft = sidebarX + 10; // 34 pt
  const colW = 72;
  const gapCol = 6;
  const pillH = 15.5;

  // Row 1: Tally Prime & ERP 9 (Full Width)
  drawPillBadge(badgeLeft, sY - pillH, 150, pillH, 'Tally Prime & ERP 9', true);
  sY -= (pillH + 4.0);

  // Row 2: GST E-Filing & ITR 1 to 4
  drawPillBadge(badgeLeft, sY - pillH, colW, pillH, 'GST E-Filing');
  drawPillBadge(badgeLeft + colW + gapCol, sY - pillH, colW, pillH, 'ITR 1 to 4');
  sY -= (pillH + 4.0);

  // Row 3: Advanced Excel & MIS Reporting
  drawPillBadge(badgeLeft, sY - pillH, colW, pillH, 'Advanced Excel');
  drawPillBadge(badgeLeft + colW + gapCol, sY - pillH, colW, pillH, 'MIS Reporting');
  sY -= (pillH + 4.0);

  // Row 4: Pivot & XLOOKUP (Full Width)
  drawPillBadge(badgeLeft, sY - pillH, 150, pillH, 'Pivot & XLOOKUP Analysis', true);
  sY -= (pillH + 4.0);

  // Row 5: ADCA Diploma & Path Solution ERP
  drawPillBadge(badgeLeft, sY - pillH, colW, pillH, 'ADCA Diploma');
  drawPillBadge(badgeLeft + colW + gapCol, sY - pillH, colW, pillH, 'Path Solution ERP');
  sY -= (pillH + 4.0);

  // Row 6: DTP / Photoshop & PC Diagnostics
  drawPillBadge(badgeLeft, sY - pillH, colW, pillH, 'DTP / Photoshop');
  drawPillBadge(badgeLeft + colW + gapCol, sY - pillH, colW, pillH, 'PC Diagnostics');
  sY -= (pillH + 7.0);

  // --- 2.3 EDUCATION & CREDENTIALS ---
  sY = drawSidebarHeading('Education', sY);

  const educationItems = [
    {
      degree: 'ADCA (Distinction)',
      inst: 'Infocity Computer Education',
      detail: 'Grade A Distinction | Daltonganj'
    },
    {
      degree: 'Intermediate of Arts (I.A.)',
      inst: 'Baba Nawbat Choudhry College',
      detail: 'UP Board Allahabad'
    },
    {
      degree: 'Matriculation (10th)',
      inst: 'Radha Govind Public School',
      detail: 'CBSE Board'
    }
  ];

  educationItems.forEach(edu => {
    drawText('F2', 7.5, sidebarX + 12, sY, edu.degree, 0.059, 0.090, 0.165);
    sY -= 8.5;
    drawText('F1', 7.0, sidebarX + 12, sY, edu.inst, 0.250, 0.300, 0.360);
    sY -= 8.0;
    drawText('F3', 6.6, sidebarX + 12, sY, edu.detail, 0.450, 0.500, 0.580);
    sY -= 10.5;
  });

  sY -= 1;

  // --- 2.4 CORE STRENGTHS & HIGHLIGHTS ---
  sY = drawSidebarHeading('Core Strengths', sY);

  const coreStrengths = [
    { title: 'Statutory Compliance', desc: 'Zero penalty GST & ITR filings' },
    { title: 'Multi-District Operations', desc: 'DAY-NULM & 4-district rollout' },
    { title: 'Audit & Reconciliation', desc: 'ITC audit, ledger & bank balance' },
    { title: 'MIS Dashboarding', desc: 'Complex Excel, Pivot & metrics' }
  ];

  coreStrengths.forEach(str => {
    // Mini coral bullet
    drawRect(sidebarX + 12, sY + 1.0, 2.5, 2.5, 1.000, 0.302, 0.427);
    drawText('F2', 7.4, sidebarX + 18, sY, str.title, 0.059, 0.090, 0.165);
    sY -= 8.5;
    drawText('F1', 6.8, sidebarX + 18, sY, str.desc, 0.350, 0.400, 0.470);
    sY -= 10.0;
  });

  // --- 2.5 EXECUTIVE HIGHLIGHTS CARD AT SIDEBAR BASE ---
  const highCardY = sidebarY + 8;
  const highCardH = sY - highCardY - 4;
  drawCard(sidebarX + 8, highCardY, sidebarW - 16, highCardH, 0.945, 0.960, 0.975, 0.820, 0.860, 0.900, 0.75);

  let hcY = highCardY + highCardH - 12;
  drawText('F2', 7.2, sidebarX + 14, hcY, 'EXECUTIVE SUMMARY METRICS', 0.059, 0.090, 0.165);
  hcY -= 11.5;

  const summaryPills = [
    '4+ Years Practical Experience',
    '100% On-Time Tax Compliance',
    '150+ Candidates Mentored',
    'Dual-State Field Operations',
    'Full Audit Readiness Record'
  ];

  summaryPills.forEach(p => {
    drawRect(sidebarX + 14, hcY + 1.5, 2.5, 2.5, 1.000, 0.302, 0.427);
    drawText('F1', 6.8, sidebarX + 20, hcY, p, 0.200, 0.250, 0.320);
    hcY -= 9.5;
  });

  // =========================================================================
  // 3. RIGHT MAIN COLUMN (x = 206 pt, width = 365.28 pt, to x = 571.28 pt)
  // =========================================================================
  const mainX = 206;
  const mainW = 365.28;

  // Helper: Section Heading in Main Column
  function drawMainHeading(title, y) {
    // Coral bar
    drawRect(mainX, y - 1.5, 3.5, 12.0, 1.000, 0.302, 0.427);
    // Heading title
    drawText('F2', 9.5, mainX + 8, y, title.toUpperCase(), 0.059, 0.090, 0.165);
    // Divider rule across remaining width
    const ruleStart = mainX + 12 + (title.length * 6.0);
    if (ruleStart < mainX + mainW) {
      drawLine(ruleStart, y + 3.5, mainX + mainW, y + 3.5, 0.886, 0.910, 0.941, 0.75);
    }
    return y - 13;
  }

  // --- 3.1 PROFESSIONAL SUMMARY CARD ---
  let mY = 738;
  mY = drawMainHeading('Professional Summary', mY);

  const summaryCardH = 58;
  const summaryCardY = mY - summaryCardH + 3;

  // Card Background (#F8FAFC) with Border (#E2E8F0)
  drawRect(mainX, summaryCardY, mainW, summaryCardH, 0.973, 0.980, 0.988);
  drawStrokeRect(mainX, summaryCardY, mainW, summaryCardH, 0.886, 0.910, 0.941, 1.0);

  // Left Accent Coral Border (width: 3.5 pt)
  drawRect(mainX, summaryCardY, 3.5, summaryCardH, 1.000, 0.302, 0.427);

  // High-Readability Summary Text (9.0 pt font, 12.0 pt line height)
  const summaryLines = [
    'Analytical, compliance-driven MIS Executive & Financial Accounting Specialist with 4+ years of hands-on expertise',
    'in Tally Prime, ERP 9, statutory taxation (GST & ITR), and digital database administration. Proven track record',
    'executing multi-district operations (DAY-NULM), input tax credit audits, purchase-sales reconciliations, and enterprise',
    'inventory workflows with zero statutory penalty records, strict governance, and 100% audit readiness.'
  ];

  let smTextY = summaryCardY + summaryCardH - 13.5;
  summaryLines.forEach(line => {
    drawText('F1', 8.2, mainX + 11, smTextY, line, 0.150, 0.180, 0.230);
    smTextY -= 11.5;
  });

  mY = summaryCardY - 14;

  // --- 3.2 WORK EXPERIENCE (Vertical Connected Timeline) ---
  mY = drawMainHeading('Work Experience (6 Verified Roles)', mY);

  const experienceList = [
    {
      title: '1. GST & Income Tax Compliance Consultant',
      org: 'Independent Tax Advisory Practice',
      period: '3+ Years Practice',
      bullets: [
        'Administered end-to-end statutory compliance, filing GSTR-1, GSTR-3B, and annual reconciliations (GSTR-9) alongside ITR-1 to ITR-4.',
        'Executed GSTR-2A/2B input tax credit (ITC) audits, purchase-sales register reconciliations, taxpayer advisory, and dispute resolution.'
      ],
      coreFocus: 'Statutory Taxation  *  GSTR-1, 3B, 9  *  ITR 1-4  *  ITC Verification & Reconciliation'
    },
    {
      title: '2. Senior Accountant & Tally Specialist',
      org: 'Commercial Enterprise & Accounting Practice',
      period: '4+ Years Experience',
      bullets: [
        'Maintained complete double-entry financial accounting in Tally Prime & ERP 9, multi-ledger postings, and bank reconciliations.',
        'Supervised periodic inventory stock valuations, trial balance audits, vendor credit aging, and finalization of P&L and Balance Sheets.'
      ],
      coreFocus: 'Tally Prime & ERP 9  *  Double-Entry Ledgers  *  Trial Balance  *  Balance Sheets'
    },
    {
      title: '3. MIS Executive - DAY-NULM Skill India Project',
      org: 'National Urban Livelihoods Mission',
      period: 'Govt. Contract',
      bullets: [
        'Spearheaded centralized MIS portal administration, candidate registration pipelines, and biometric verification data integrity.',
        'Formulated weekly and monthly quantitative monitoring dossiers, compliance analytics, and district progress reports for executives.'
      ],
      coreFocus: 'Govt. MIS Portal  *  DAY-NULM Skill India  *  Biometric Verification  *  District Reports'
    },
    {
      title: '4. Lead Accountant - Junks Food Agency (Path Solution ERP)',
      org: 'FMCG & Food Distribution Agency',
      period: 'Commercial Agency',
      bullets: [
        'Supervised agency sales counter balancing, daily franchisee commercial billing, and vendor payment disbursement cycles.',
        'Operated Path Solution ERP for real-time stock register maintenance, distribution tracking, and supplier settlements.'
      ],
      coreFocus: 'Path Solution ERP  *  FMCG Inventory  *  Franchisee Billing  *  Vendor Settlements'
    },
    {
      title: '5. Smart Card & Data Operations Specialist - 4 Districts',
      org: 'Multi-District E-Governance Rollout',
      period: 'Bihar & Jharkhand',
      bullets: [
        'Directed field data enrollment teams across 4 districts for smart card operations, biometric records, and registry validation.',
        'Resolved on-site hardware and software technical bottlenecks, coordinated secure card issuance, and compiled administrative audit logs.'
      ],
      coreFocus: 'Multi-District Operations  *  Biometric Systems  *  Hardware Support  *  Audit Logs'
    },
    {
      title: '6. Computer Applications Instructor & Mentor',
      org: 'Vocational Training & IT Education Institute',
      period: 'Vocational IT Education',
      bullets: [
        'Delivered structured courses in Advanced MS Excel (Pivot Tables, Nested Formulas, MIS Analytics) and MS Office Suite.',
        'Instructed students in Desktop Publishing (Photoshop, PageMaker) and certified ADCA core curriculum, mentoring 150+ candidates.'
      ],
      coreFocus: 'Advanced Excel & Pivot  *  ADCA Mentorship  *  DTP & Photoshop  *  150+ Students'
    }
  ];

  // Timeline geometry:
  // Node dots at x = 214 pt.
  // Continuous vertical timeline track line from top node to bottom node at x = 214 pt.
  // Role text begins at x = 226 pt.
  const timelineNodeX = 214;
  const roleTextX = 226;
  const maxBulletChars = 75;

  // Total available vertical space from mY (around 648 pt) down to y = 52 pt (bottom margin)
  // 6 roles across 5 intervals:
  // Start role at y = 644 pt, end role at y = 124 pt (step = 104 pt)
  // Role 6 ends neatly at y = 52 pt!
  const roleCoordinates = [];
  const startTimelineY = mY - 2;
  const step = 104.0;

  experienceList.forEach((role, idx) => {
    const rY = startTimelineY - (idx * step);
    roleCoordinates.push({ role, y: rY });
  });

  const lastRoleY = roleCoordinates[roleCoordinates.length - 1].y;

  // 1. Draw Continuous Vertical Timeline Track Line
  drawLine(timelineNodeX, startTimelineY, timelineNodeX, lastRoleY + 2, 0.796, 0.835, 0.882, 1.5);

  // 2. Render Each Role
  roleCoordinates.forEach(({ role, y: rY }) => {
    // Timeline Node Dot (Coral outer 5x5 pt, White inner 2x2 pt)
    drawRect(timelineNodeX - 2.5, rY - 2.0, 5.0, 5.0, 1.000, 0.302, 0.427);
    drawRect(timelineNodeX - 1.0, rY - 0.5, 2.0, 2.0, 1.000, 1.000, 1.000);

    // Role Title in Navy Bold (8.8 pt)
    drawText('F2', 8.8, roleTextX, rY, role.title, 0.059, 0.090, 0.165);

    // Organization & Period in Slate Oblique (7.6 pt)
    const metaText = `${role.org}  |  ${role.period}`;
    drawText('F3', 7.5, roleTextX, rY - 11.0, metaText, 0.392, 0.455, 0.545);

    // Bullets (Helvetica 8.0 pt, 10.5 pt line height, Slate #334155)
    let bY = rY - 23.5;
    role.bullets.forEach(bullet => {
      // Mini coral bullet dot
      drawRect(roleTextX + 1, bY + 1.5, 2.5, 2.5, 1.000, 0.302, 0.427);

      const wrapped = wrapText(bullet, maxBulletChars);
      wrapped.forEach((line) => {
        drawText('F1', 7.9, roleTextX + 8, bY, line, 0.200, 0.250, 0.320);
        bY -= 10.0;
      });
      bY -= 1.5;
    });

    // Core Focus Tag Pill (Subtle slate badge)
    drawRect(roleTextX, bY - 0.5, mainW - (roleTextX - mainX), 11.0, 0.945, 0.960, 0.975);
    drawText('F2', 6.6, roleTextX + 6, bY + 1.5, 'KEY COMPETENCIES:', 0.059, 0.090, 0.165);
    drawText('F1', 6.6, roleTextX + 86, bY + 1.5, role.coreFocus, 0.350, 0.400, 0.470);
  });

  // =========================================================================
  // 4. FOOTER BAR (At y = 18 to 36 pt)
  // =========================================================================
  const footerLineY = 36;
  const footerTextY = 23;

  // Subtle separator line across entire printable canvas
  drawLine(sidebarX, footerLineY, pageWidth - 24, footerLineY, 0.886, 0.910, 0.941, 0.75);

  // Left footer text
  drawText('F1', 7.2, sidebarX, footerTextY, 'Atul Kant Verma  |  Verified Executive CV  |  Generated from Interactive Portfolio', 0.580, 0.639, 0.722);

  // Right footer text
  drawText('F2', 7.2, pageWidth - 24 - 55, footerTextY, 'Page 1 of 1', 0.450, 0.500, 0.580);

  // =========================================================================
  // 5. PDF OBJECTS CREATION & SERIALIZATION
  // =========================================================================
  const contentStream = streamLines.join('\n');
  const streamLength = Buffer.byteLength(contentStream, 'ascii');

  // Object 1: Catalog
  const catalogObj = `1 0 obj\n<<\n  /Type /Catalog\n  /Pages 2 0 R\n>>\nendobj\n`;
  // Object 2: Pages Root
  const pagesObj = `2 0 obj\n<<\n  /Type /Pages\n  /Kids [3 0 R]\n  /Count 1\n>>\nendobj\n`;
  // Object 3: Page Definition
  const pageObj = `3 0 obj\n<<\n  /Type /Page\n  /Parent 2 0 R\n  /MediaBox [0 0 ${pageWidth.toFixed(2)} ${pageHeight.toFixed(2)}]\n  /Resources <<\n    /Font <<\n      /F1 4 0 R\n      /F2 5 0 R\n      /F3 6 0 R\n    >>\n  >>\n  /Contents 7 0 R\n>>\nendobj\n`;
  // Object 4: Font F1 (Helvetica Regular)
  const f1Obj = `4 0 obj\n<<\n  /Type /Font\n  /Subtype /Type1\n  /BaseFont /Helvetica\n  /Encoding /WinAnsiEncoding\n>>\nendobj\n`;
  // Object 5: Font F2 (Helvetica-Bold)
  const f2Obj = `5 0 obj\n<<\n  /Type /Font\n  /Subtype /Type1\n  /BaseFont /Helvetica-Bold\n  /Encoding /WinAnsiEncoding\n>>\nendobj\n`;
  // Object 6: Font F3 (Helvetica-Oblique)
  const f3Obj = `6 0 obj\n<<\n  /Type /Font\n  /Subtype /Type1\n  /BaseFont /Helvetica-Oblique\n  /Encoding /WinAnsiEncoding\n>>\nendobj\n`;
  // Object 7: Content Stream
  const contentsObj = `7 0 obj\n<<\n  /Length ${streamLength}\n>>\nstream\n${contentStream}\nendstream\nendobj\n`;

  // Standard PDF 1.4 Binary Header
  const header = `%PDF-1.4\n%\xE2\xE3\xCF\xD3\n`;

  let currentOffset = Buffer.byteLength(header, 'binary');
  const offsets = [0]; // Index 0 is the special null entry

  const objList = [catalogObj, pagesObj, pageObj, f1Obj, f2Obj, f3Obj, contentsObj];
  for (const objStr of objList) {
    offsets.push(currentOffset);
    currentOffset += Buffer.byteLength(objStr, 'ascii');
  }

  const startXref = currentOffset;
  let xref = `xref\n0 ${offsets.length}\n0000000000 65535 f \r\n`;
  for (let i = 1; i < offsets.length; i++) {
    xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \r\n';
  }

  const trailer = `trailer\n<<\n  /Size ${offsets.length}\n  /Root 1 0 R\n>>\nstartxref\n${startXref}\n%%EOF\n`;

  const finalPdf = Buffer.concat([
    Buffer.from(header, 'binary'),
    Buffer.from(objList.join(''), 'ascii'),
    Buffer.from(xref, 'ascii'),
    Buffer.from(trailer, 'ascii')
  ]);

  const targetPath = path.resolve('public/resume.pdf');
  try {
    if (fs.existsSync(targetPath)) {
      const existing = fs.readFileSync(targetPath);
      if (existing.equals(finalPdf)) {
        console.log('public/resume.pdf is already up-to-date (' + finalPdf.length + ' bytes).');
        return;
      }
    }
    fs.writeFileSync(targetPath, finalPdf);
    console.log('Successfully wrote', finalPdf.length, 'bytes to', targetPath);
  } catch (err) {
    if (err.code === 'EBUSY') {
      console.warn('Notice: public/resume.pdf is currently open in an active viewer. Existing file retained.');
    } else {
      throw err;
    }
  }
}

createPdf();
