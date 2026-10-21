import fs from 'fs';
import path from 'path';

// Function to generate a PDF based on configuration
function generatePdfForRole(options) {
  const {
    outputFilename,
    accentRgb = options.themeColor, // [r, g, b] 0..1
    headerSubtitle = options.title,
    headerValueProp,
    badgeText,
    badgeSubtext,
    badgeDossier,
    summaryLines,
    technicalBadges, // array of badges { label, isFull, colW }
    coreStrengths, // array of { title, desc }
    summaryMetrics, // array of strings
    experienceList // array of 6 roles
  } = options;

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
    drawRect(x, y, w, h, 0.933, 0.949, 0.965);
    drawStrokeRect(x, y, w, h, 0.796, 0.835, 0.882, 0.75);

    // Accent mini dot on left
    drawRect(x + 5, y + (h / 2) - 1.5, 3, 3, accentRgb[0], accentRgb[1], accentRgb[2]);

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
  // 1. TOP FULL-BLEED HEADER BANNER
  // =========================================================================
  const headerHeight = 86.89;
  const headerBottom = pageHeight - headerHeight; // 755.00 pt

  // Navy banner background (#0F172A)
  drawRect(0, headerBottom, pageWidth, headerHeight, 0.059, 0.090, 0.165);

  // Bottom role accent bar (height: 3 pt)
  drawRect(0, headerBottom - 3.0, pageWidth, 3.0, accentRgb[0], accentRgb[1], accentRgb[2]);

  // Candidate Name (Helvetica-Bold, 21 pt, White #FFFFFF)
  drawText('F2', 21.0, 28, headerBottom + 50, 'ATUL VERMA', 1.0, 1.0, 1.0);

  // Subtitle (Helvetica-Bold, 9.5 pt, Role Accent)
  drawText('F2', 9.5, 28, headerBottom + 32, headerSubtitle, accentRgb[0], accentRgb[1], accentRgb[2]);

  // Core Value Proposition (Helvetica-Oblique, 7.8 pt, #94A3B8)
  drawText('F3', 7.8, 28, headerBottom + 16, headerValueProp, 0.580, 0.639, 0.722);

  // Tag Pill Badge at Right
  const badgeW = 160;
  const badgeH = 22;
  const badgeX = pageWidth - 28 - badgeW;
  const badgeY = headerBottom + 46;

  // Dark slate pill container
  drawRect(badgeX, badgeY, badgeW, badgeH, 0.118, 0.161, 0.231);
  drawStrokeRect(badgeX, badgeY, badgeW, badgeH, 0.200, 0.255, 0.333, 1.0);

  // Accent indicator dot
  drawRect(badgeX + 8, badgeY + (badgeH / 2) - 2.0, 4.0, 4.0, accentRgb[0], accentRgb[1], accentRgb[2]);

  // Badge text (7.5 pt, Helvetica-Bold, #F8FAFC)
  drawText('F2', 7.5, badgeX + 17, badgeY + 6.5, badgeText, 0.973, 0.980, 0.988);

  // Badge subtext
  drawText('F3', 7.0, badgeX + 17, headerBottom + 30, badgeSubtext, 0.580, 0.639, 0.722);
  drawText('F1', 6.8, badgeX + 17, headerBottom + 16, badgeDossier, 0.450, 0.500, 0.580);

  // =========================================================================
  // 2. LEFT SIDEBAR (x = 24 pt, width = 170 pt, spanning y = 46 to 740 pt)
  // =========================================================================
  const sidebarX = 24;
  const sidebarW = 170;
  const sidebarY = 46;
  const sidebarH = 694;

  drawCard(sidebarX, sidebarY, sidebarW, sidebarH, 0.973, 0.980, 0.988, 0.886, 0.910, 0.941, 1.0);

  // Helper: Section Heading in Sidebar
  function drawSidebarHeading(title, y) {
    drawRect(sidebarX + 10, y - 1.0, 3.0, 10.5, accentRgb[0], accentRgb[1], accentRgb[2]);
    drawText('F2', 8.2, sidebarX + 17, y, title.toUpperCase(), 0.059, 0.090, 0.165);
    drawLine(sidebarX + 17 + (title.length * 5.4), y + 3.5, sidebarX + sidebarW - 10, y + 3.5, 0.886, 0.910, 0.941, 0.75);
    return y - 13;
  }

  // --- 2.1 CONTACT & WEB ---
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

  const badgeLeft = sidebarX + 10;
  const colW = 72;
  const gapCol = 6;
  const pillH = 15.5;

  technicalBadges.forEach(bGroup => {
    if (bGroup.isFull) {
      drawPillBadge(badgeLeft, sY - pillH, 150, pillH, bGroup.label, true);
    } else {
      drawPillBadge(badgeLeft, sY - pillH, colW, pillH, bGroup.left);
      drawPillBadge(badgeLeft + colW + gapCol, sY - pillH, colW, pillH, bGroup.right);
    }
    sY -= (pillH + (bGroup.extraGap || 4.0));
  });

  sY -= 3.0;

  // --- 2.3 EDUCATION & CREDENTIALS ---
  sY = drawSidebarHeading('Education', sY);

  const educationItems = options.educationList || options.education || [
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

  coreStrengths.forEach(str => {
    drawRect(sidebarX + 12, sY + 1.0, 2.5, 2.5, accentRgb[0], accentRgb[1], accentRgb[2]);
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

  summaryMetrics.forEach(p => {
    drawRect(sidebarX + 14, hcY + 1.5, 2.5, 2.5, accentRgb[0], accentRgb[1], accentRgb[2]);
    drawText('F1', 6.8, sidebarX + 20, hcY, p, 0.200, 0.250, 0.320);
    hcY -= 9.5;
  });

  // =========================================================================
  // 3. RIGHT MAIN COLUMN (x = 206 pt, width = 365.28 pt, to x = 571.28 pt)
  // =========================================================================
  const mainX = 206;
  const mainW = 365.28;

  function drawMainHeading(title, y) {
    drawRect(mainX, y - 1.5, 3.5, 12.0, accentRgb[0], accentRgb[1], accentRgb[2]);
    drawText('F2', 9.5, mainX + 8, y, title.toUpperCase(), 0.059, 0.090, 0.165);
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

  drawRect(mainX, summaryCardY, mainW, summaryCardH, 0.973, 0.980, 0.988);
  drawStrokeRect(mainX, summaryCardY, mainW, summaryCardH, 0.886, 0.910, 0.941, 1.0);
  drawRect(mainX, summaryCardY, 3.5, summaryCardH, accentRgb[0], accentRgb[1], accentRgb[2]);

  let smTextY = summaryCardY + summaryCardH - 13.5;
  summaryLines.forEach(line => {
    drawText('F1', 8.2, mainX + 11, smTextY, line, 0.150, 0.180, 0.230);
    smTextY -= 11.5;
  });

  mY = summaryCardY - 14;

  // --- 3.2 WORK EXPERIENCE ---
  mY = drawMainHeading('Work Experience (6 Verified Roles)', mY);

  const timelineNodeX = 214;
  const roleTextX = 226;
  const maxBulletChars = 75;

  const roleCoordinates = [];
  const startTimelineY = mY - 2;
  const step = 104.0;

  experienceList.forEach((role, idx) => {
    const rY = startTimelineY - (idx * step);
    roleCoordinates.push({ role, y: rY });
  });

  const lastRoleY = roleCoordinates[roleCoordinates.length - 1].y;

  // Continuous Vertical Timeline Track Line
  drawLine(timelineNodeX, startTimelineY, timelineNodeX, lastRoleY + 2, 0.796, 0.835, 0.882, 1.5);

  // Render Each Role
  roleCoordinates.forEach(({ role, y: rY }) => {
    // Timeline Node Dot
    drawRect(timelineNodeX - 2.5, rY - 2.0, 5.0, 5.0, accentRgb[0], accentRgb[1], accentRgb[2]);
    drawRect(timelineNodeX - 1.0, rY - 0.5, 2.0, 2.0, 1.000, 1.000, 1.000);

    // Role Title in Navy Bold
    drawText('F2', 8.8, roleTextX, rY, role.title, 0.059, 0.090, 0.165);

    // Organization & Period
    const metaText = `${role.org}  |  ${role.period}`;
    drawText('F3', 7.5, roleTextX, rY - 11.0, metaText, 0.392, 0.455, 0.545);

    let bY = rY - 23.5;
    role.bullets.forEach(bullet => {
      drawRect(roleTextX + 1, bY + 1.5, 2.5, 2.5, accentRgb[0], accentRgb[1], accentRgb[2]);
      const wrapped = wrapText(bullet, maxBulletChars);
      wrapped.forEach((line) => {
        drawText('F1', 7.9, roleTextX + 8, bY, line, 0.200, 0.250, 0.320);
        bY -= 10.0;
      });
      bY -= 1.5;
    });

    // Core Focus Tag Pill
    drawRect(roleTextX, bY - 0.5, mainW - (roleTextX - mainX), 11.0, 0.945, 0.960, 0.975);
    drawText('F2', 6.6, roleTextX + 6, bY + 1.5, 'KEY COMPETENCIES:', 0.059, 0.090, 0.165);
    drawText('F1', 6.6, roleTextX + 86, bY + 1.5, role.coreFocus, 0.350, 0.400, 0.470);
  });

  // =========================================================================
  // 4. FOOTER BAR
  // =========================================================================
  const footerLineY = 36;
  const footerTextY = 23;

  drawLine(sidebarX, footerLineY, pageWidth - 24, footerLineY, 0.886, 0.910, 0.941, 0.75);
  drawText('F1', 7.2, sidebarX, footerTextY, 'Atul Verma  |  Verified Executive CV  |  Generated from Interactive Portfolio', 0.580, 0.639, 0.722);
  drawText('F2', 7.2, pageWidth - 24 - 55, footerTextY, 'Page 1 of 1', 0.450, 0.500, 0.580);

  // =========================================================================
  // 5. PDF OBJECTS CREATION & SERIALIZATION
  // =========================================================================
  const contentStream = streamLines.join('\n');
  const streamLength = Buffer.byteLength(contentStream, 'ascii');

  const catalogObj = `1 0 obj\n<<\n  /Type /Catalog\n  /Pages 2 0 R\n>>\nendobj\n`;
  const pagesObj = `2 0 obj\n<<\n  /Type /Pages\n  /Kids [3 0 R]\n  /Count 1\n>>\nendobj\n`;
  const pageObj = `3 0 obj\n<<\n  /Type /Page\n  /Parent 2 0 R\n  /MediaBox [0 0 ${pageWidth.toFixed(2)} ${pageHeight.toFixed(2)}]\n  /Resources <<\n    /Font <<\n      /F1 4 0 R\n      /F2 5 0 R\n      /F3 6 0 R\n    >>\n  >>\n  /Contents 7 0 R\n>>\nendobj\n`;
  const f1Obj = `4 0 obj\n<<\n  /Type /Font\n  /Subtype /Type1\n  /BaseFont /Helvetica\n  /Encoding /WinAnsiEncoding\n>>\nendobj\n`;
  const f2Obj = `5 0 obj\n<<\n  /Type /Font\n  /Subtype /Type1\n  /BaseFont /Helvetica-Bold\n  /Encoding /WinAnsiEncoding\n>>\nendobj\n`;
  const f3Obj = `6 0 obj\n<<\n  /Type /Font\n  /Subtype /Type1\n  /BaseFont /Helvetica-Oblique\n  /Encoding /WinAnsiEncoding\n>>\nendobj\n`;
  const contentsObj = `7 0 obj\n<<\n  /Length ${streamLength}\n>>\nstream\n${contentStream}\nendstream\nendobj\n`;

  const header = `%PDF-1.4\n%\xE2\xE3\xCF\xD3\n`;

  let currentOffset = Buffer.byteLength(header, 'binary');
  const offsets = [0];

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

  const targetPath = path.resolve('public', outputFilename);
  const distPath = path.resolve('dist', outputFilename);
  try {
    let needsWrite = true;
    if (fs.existsSync(targetPath)) {
      const existing = fs.readFileSync(targetPath);
      if (existing.equals(finalPdf)) {
        console.log(`public/${outputFilename} is already up-to-date (${finalPdf.length} bytes).`);
        needsWrite = false;
      }
    }
    if (needsWrite) {
      fs.writeFileSync(targetPath, finalPdf);
      console.log(`Successfully wrote ${finalPdf.length} bytes to public/${outputFilename}`);
    }
    if (fs.existsSync(path.resolve('dist'))) {
      fs.writeFileSync(distPath, finalPdf);
    }
  } catch (err) {
    if (err.code === 'EBUSY') {
      console.warn(`Notice: ${outputFilename} is currently open in an active viewer. Existing file retained.`);
    } else {
      throw err;
    }
  }
}

// -----------------------------------------------------------------------------
// 1. ACCOUNTANT RESUME (resume-accountant.pdf, Accent #FF4D6D: [1.000, 0.302, 0.427])
// -----------------------------------------------------------------------------
const accountantConfig = {
  outputFilename: 'resume-accountant.pdf',
  accentRgb: [1.000, 0.302, 0.427], // Coral / Rose #FF4D6D
  headerSubtitle: 'Senior Accountant  |  Financial Accounting Specialist  |  Tax Consultant',
  headerValueProp: 'Statutory Compliance (GST & ITR)  *  Tally Prime & ERP 9  *  ITC Auditing & Trial Balance',
  badgeText: 'VERIFIED ACCOUNTING DOSSIER',
  badgeSubtext: 'Finance & Tax Specialist',
  badgeDossier: 'Full Statutory Audit Track',
  summaryLines: [
    'Seasoned, detail-oriented Financial Accountant & Tax Consultant with 7+ years of hands-on expertise in Tally Prime,',
    'ERP 9, double-entry financial bookkeeping, and statutory taxation (GSTR-1, GSTR-3B, GSTR-9 & ITR-1 to 4). Proven',
    'mastery conducting input tax credit (ITC) reconciliations, purchase-sales register audits, balance sheet finalization,',
    'and zero-penalty compliance management across commercial firms and high-volume trading agencies.'
  ],
  technicalBadges: [
    { isFull: true, label: 'Tally Prime & ERP 9' },
    { isFull: false, left: 'GST E-Filing', right: 'ITR 1 to 4' },
    { isFull: false, left: 'ITC Reconciliation', right: 'Tax Auditing' },
    { isFull: true, label: 'Balance Sheets & P&L Analysis' },
    { isFull: false, left: 'Bank Reconciliation', right: 'Path Solution ERP' },
    { isFull: false, left: 'TDS & E-Way Bills', right: 'Inventory Valuation', extraGap: 3.0 }
  ],
  coreStrengths: [
    { title: 'Statutory Tax Filing', desc: 'Zero penalty GST & ITR-1 to 4' },
    { title: 'Double-Entry Ledgers', desc: 'Clean postings, P&L & Balance Sheet' },
    { title: 'Audit & Reconciliation', desc: 'Rigorous ITC (2A/2B) & BRS audit' },
    { title: 'Commercial ERP', desc: 'Tally Prime, ERP 9 & Path Solution' }
  ],
  summaryMetrics: [
    '7+ Years Accounting Practice',
    '100% On-Time Tax Compliance',
    'Zero Statutory Penalties Record',
    'Full Audit Readiness Dossier',
    'Commercial Ledger Finalization'
  ],
  experienceList: [
    {
      title: '1. GST & Income Tax Compliance Consultant',
      org: 'Independent Tax Advisory Practice',
      period: '7+ Years Practice',
      bullets: [
        'Administered end-to-end statutory compliance, filing GSTR-1, GSTR-3B, and annual reconciliations (GSTR-9) alongside ITR-1 to ITR-4.',
        'Executed GSTR-2A/2B input tax credit (ITC) audits, purchase-sales register reconciliations, taxpayer advisory, and dispute resolution.'
      ],
      coreFocus: 'Statutory Taxation  *  GSTR-1, 3B, 9  *  ITR 1-4  *  ITC Verification & Reconciliation'
    },
    {
      title: '2. Senior Accountant & Tally Specialist',
      org: 'Commercial Enterprise & Accounting Practice',
      period: '7+ Years Experience',
      bullets: [
        'Maintained complete double-entry financial accounting in Tally Prime & ERP 9, multi-ledger postings, and bank reconciliations.',
        'Supervised periodic inventory stock valuations, trial balance audits, vendor credit aging, and finalization of P&L and Balance Sheets.'
      ],
      coreFocus: 'Tally Prime & ERP 9  *  Double-Entry Ledgers  *  Trial Balance  *  Balance Sheets'
    },
    {
      title: '3. Lead Accountant - Junks Food Agency (Path Solution ERP)',
      org: 'FMCG & Food Distribution Agency',
      period: 'Commercial Agency',
      bullets: [
        'Supervised agency sales counter balancing, daily franchisee commercial billing, and vendor payment disbursement cycles.',
        'Operated Path Solution ERP for real-time stock register maintenance, distribution tracking, and supplier settlements.'
      ],
      coreFocus: 'Path Solution ERP  *  FMCG Inventory  *  Franchisee Billing  *  Vendor Settlements'
    },
    {
      title: '4. Financial & Computer Accounting Instructor',
      org: 'Vocational Training & IT Education Institute',
      period: 'Vocational IT Education',
      bullets: [
        'Taught computerized accounting and financial recording using Tally Prime, ERP 9, and GST invoicing procedures.',
        'Mentored students in automated voucher creation, statutory compliance workflows, and practical ledger maintenance.'
      ],
      coreFocus: 'Tally Prime  *  Voucher Posting  *  Commercial Accounts  *  Mentorship'
    },
    {
      title: '5. MIS Executive - Central Monitoring & Audits',
      org: 'National Urban Livelihoods Mission (DAY-NULM)',
      period: 'Govt. Contract',
      bullets: [
        'Managed project accounting allocations, milestone expenditure tracking, and stipend disbursement ledger reconciliations.',
        'Maintained financial documentation, compliance audit trails, and transparent record keeping for governmental review.'
      ],
      coreFocus: 'Expenditure Tracking  *  Disbursement Audits  *  Financial Dossiers  *  Compliance'
    },
    {
      title: '6. Field Operations & Financial Verification Specialist',
      org: 'Multi-District E-Governance Rollout',
      period: 'Bihar & Jharkhand',
      bullets: [
        'Audited field logistics expenditure, equipment procurement ledgers, and operational cash handling across 4 districts.',
        'Compiled administrative expenditure summaries, vendor payments, and verified physical disbursement records.'
      ],
      coreFocus: 'Field Expenditure Audits  *  Procurement Ledgers  *  Disbursement Logs  *  Compliance'
    }
  ]
};

// -----------------------------------------------------------------------------
// 2. MIS & ANALYTICS RESUME (resume-mis.pdf, Accent #3B82F6: [0.231, 0.510, 0.965])
// -----------------------------------------------------------------------------
const misConfig = {
  outputFilename: 'resume-mis.pdf',
  accentRgb: [0.231, 0.510, 0.965], // Blue #3B82F6
  headerSubtitle: 'MIS Executive  |  Data & Operations Analyst  |  Business Intelligence',
  headerValueProp: 'Executive MIS Dashboards  *  Advanced Excel & VBA  *  Power BI, SQL & Biometrics',
  badgeText: 'VERIFIED MIS & ANALYTICS',
  badgeSubtext: 'Data & Operations Specialist',
  badgeDossier: 'Executive Business Intelligence',
  summaryLines: [
    'Dynamic, results-focused MIS Executive & Operations Analyst with extensive experience in automated data reporting,',
    'advanced Excel modeling (Nested Formulas, Pivot Tables, XLOOKUP), and enterprise database management. Proven record',
    'leading high-stakes government operations (DAY-NULM Skill India), administering biometrics across 4 districts, building',
    'cross-functional performance dashboards, and automating recurring operational workflows with zero error margin.'
  ],
  technicalBadges: [
    { isFull: true, label: 'Advanced Excel & MIS Dashboards' },
    { isFull: false, left: 'Pivot & XLOOKUP', right: 'VBA / Macros' },
    { isFull: false, left: 'Power BI Analytics', right: 'SQL & Database' },
    { isFull: true, label: 'Central Govt. MIS Portals (DAY-NULM)' },
    { isFull: false, left: 'Biometric Systems', right: 'Multi-District Ops' },
    { isFull: false, left: 'Python Data Tools', right: 'ETL Pipelines', extraGap: 3.0 }
  ],
  coreStrengths: [
    { title: 'Executive MIS Analytics', desc: 'Multi-tiered automated dashboards' },
    { title: 'Multi-District Operations', desc: 'DAY-NULM & 4-district rollout' },
    { title: 'Data Cleaning & ETL', desc: 'Complex cross-source data normalization' },
    { title: 'Process Automation', desc: 'Automated recurring reports & models' }
  ],
  summaryMetrics: [
    '7+ Years Data & MIS Experience',
    '10,000+ Biometric Records Managed',
    '4 Districts Operation Rollout',
    '100% Reporting Accuracy',
    '150+ Candidates Mentored'
  ],
  experienceList: [
    {
      title: '1. MIS Executive - DAY-NULM Skill India Project',
      org: 'National Urban Livelihoods Mission',
      period: 'Govt. Contract',
      bullets: [
        'Spearheaded centralized MIS portal administration, candidate registration pipelines, and biometric verification data integrity.',
        'Formulated weekly and monthly quantitative monitoring dossiers, compliance analytics, and district progress reports for executives.'
      ],
      coreFocus: 'Govt. MIS Portal  *  DAY-NULM Skill India  *  Biometric Verification  *  District Reports'
    },
    {
      title: '2. Smart Card & Data Operations Specialist - 4 Districts',
      org: 'Multi-District E-Governance Rollout',
      period: 'Bihar & Jharkhand',
      bullets: [
        'Directed field data enrollment teams across 4 districts for smart card operations, biometric records, and registry validation.',
        'Resolved on-site hardware and software technical bottlenecks, coordinated secure card issuance, and compiled administrative audit logs.'
      ],
      coreFocus: 'Multi-District Operations  *  Biometric Systems  *  Hardware Support  *  Audit Logs'
    },
    {
      title: '3. Data Analyst & MIS In-Charge - FMCG Distribution',
      org: 'Commercial Distribution Network (Path Solution)',
      period: 'Commercial Operations',
      bullets: [
        'Structured real-time stock registers, inventory turnover metrics, and franchisee order performance in Path Solution ERP.',
        'Designed analytical purchase-to-sales variance reports and automated discrepancy detection routines across multi-hub depots.'
      ],
      coreFocus: 'Path Solution ERP  *  Variance Analysis  *  Stock Velocity  *  MIS Reporting'
    },
    {
      title: '4. Advanced Computer Applications & MIS Instructor',
      org: 'Vocational Training & IT Education Institute',
      period: 'Vocational IT Education',
      bullets: [
        'Delivered structured courses in Advanced MS Excel (Pivot Tables, Nested Formulas, MIS Analytics) and MS Office Suite.',
        'Instructed students in Desktop Publishing (Photoshop, PageMaker) and certified ADCA core curriculum, mentoring 150+ candidates.'
      ],
      coreFocus: 'Advanced Excel & Pivot  *  ADCA Mentorship  *  DTP & Photoshop  *  150+ Students'
    },
    {
      title: '5. Tax Data & Statutory Audit Analyst',
      org: 'Independent Advisory Practice',
      period: 'Statutory Practice',
      bullets: [
        'Engineered Excel reconciliation models for GSTR-2A/2B against inward purchase registers, flagging discrepancies systematically.',
        'Structured automated tax summary sheets, client compliance schedules, and e-filing data preparation templates.'
      ],
      coreFocus: 'Data Reconciliation  *  Tax Datasets  *  Excel Automation  *  Error-Free Audit'
    },
    {
      title: '6. IT Infrastructure & Systems Support Specialist',
      org: 'Infocity Computer Education & Field Units',
      period: 'Technical Operations',
      bullets: [
        'Configured LAN networking, workstation security protocols, OS installations, and PC hardware diagnostics across computer centers.',
        'Maintained 99.8% uptime across biometric enrollment peripherals, specialized card printers, and database terminals.'
      ],
      coreFocus: 'PC Diagnostics  *  Network Administration  *  Hardware Maintenance  *  Terminal Ops'
    }
  ]
};

// -----------------------------------------------------------------------------
// 3. COMPREHENSIVE RESUME (resume.pdf, Accent #8B5CF6: [0.545, 0.361, 0.965])
// -----------------------------------------------------------------------------
const comprehensiveConfig = {
  outputFilename: 'resume.pdf',
  accentRgb: [0.545, 0.361, 0.965], // Purple #8B5CF6
  headerSubtitle: 'MIS Executive  |  Financial Accounting Specialist  |  Digital Applications',
  headerValueProp: 'Statutory Compliance (GST & ITR)  *  Tally Prime & ERP 9  *  Enterprise MIS Analytics',
  badgeText: 'VERIFIED PORTFOLIO RESUME',
  badgeSubtext: 'Executive 1-Page Summary',
  badgeDossier: 'Multidisciplinary Career Track',
  summaryLines: [
    'Analytical, compliance-driven MIS Executive & Financial Accounting Specialist with 7+ years of hands-on expertise',
    'in Tally Prime, ERP 9, statutory taxation (GST & ITR), and digital database administration. Proven track record',
    'executing multi-district operations (DAY-NULM), input tax credit audits, purchase-sales reconciliations, and enterprise',
    'inventory workflows with zero statutory penalty records, strict governance, and 100% audit readiness.'
  ],
  technicalBadges: [
    { isFull: true, label: 'Tally Prime & ERP 9' },
    { isFull: false, left: 'GST E-Filing', right: 'ITR 1 to 4' },
    { isFull: false, left: 'Advanced Excel', right: 'MIS Reporting' },
    { isFull: true, label: 'Pivot & XLOOKUP Analysis' },
    { isFull: false, left: 'ADCA Diploma', right: 'Path Solution ERP' },
    { isFull: false, left: 'DTP / Photoshop', right: 'PC Diagnostics', extraGap: 3.0 }
  ],
  coreStrengths: [
    { title: 'Statutory Compliance', desc: 'Zero penalty GST & ITR filings' },
    { title: 'Multi-District Operations', desc: 'DAY-NULM & 4-district rollout' },
    { title: 'Audit & Reconciliation', desc: 'ITC audit, ledger & bank balance' },
    { title: 'MIS Dashboarding', desc: 'Complex Excel, Pivot & metrics' }
  ],
  summaryMetrics: [
    '7+ Years Practical Experience',
    '100% On-Time Tax Compliance',
    '150+ Candidates Mentored',
    'Dual-State Field Operations',
    'Full Audit Readiness Record'
  ],
  experienceList: [
    {
      title: '1. GST & Income Tax Compliance Consultant',
      org: 'Independent Tax Advisory Practice',
      period: '7+ Years Practice',
      bullets: [
        'Administered end-to-end statutory compliance, filing GSTR-1, GSTR-3B, and annual reconciliations (GSTR-9) alongside ITR-1 to ITR-4.',
        'Executed GSTR-2A/2B input tax credit (ITC) audits, purchase-sales register reconciliations, taxpayer advisory, and dispute resolution.'
      ],
      coreFocus: 'Statutory Taxation  *  GSTR-1, 3B, 9  *  ITR 1-4  *  ITC Verification & Reconciliation'
    },
    {
      title: '2. Senior Accountant & Tally Specialist',
      org: 'Commercial Enterprise & Accounting Practice',
      period: '7+ Years Experience',
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
  ]
};

// -----------------------------------------------------------------------------
// 4. BUSINESS INTELLIGENCE & CORPORATE CONTROLLER RESUME (resume-controller.pdf, Accent #8B5CF6: [0.545, 0.361, 0.965])
// -----------------------------------------------------------------------------
const controllerConfig = {
  outputFilename: 'resume-controller.pdf',
  accentRgb: [0.545, 0.361, 0.965], // Purple #8B5CF6
  headerSubtitle: 'Business Intelligence & Corporate Controller  |  Financial Systems Specialist',
  headerValueProp: 'Corporate Financial Controls  *  Power BI Fiscal Dashboards  *  ERP Automation & Audit',
  badgeText: 'AI-SYNTHESIZED SPECIALIZATION',
  badgeSubtext: 'Corporate Controller & BI Track',
  badgeDossier: 'Financial Strategy & Executive Data Systems',
  summaryLines: [
    'Strategic, systems-driven Corporate Controller & Business Intelligence specialist synthesized from proven dual-domain',
    'competencies in statutory accounting and executive MIS analytics. 7+ years track record designing Power BI fiscal models,',
    'automating multi-entity ERP reconciliation pipelines (Tally Prime & Path Solution), enforcing balance sheet controls,',
    'and executing end-to-end statutory audit readiness with zero compliance defects across public and private sectors.'
  ],
  technicalBadges: [
    { isFull: true, label: 'Power BI Fiscal Dashboards & DAX' },
    { isFull: false, left: 'ERP Automation', right: 'Tally Prime Suite' },
    { isFull: false, left: 'Corporate Controls', right: 'Statutory Auditing' },
    { isFull: true, label: 'Section 115BAC & Tax Optimization' },
    { isFull: false, left: 'Advanced Excel', right: 'Automated BRS / ITC' },
    { isFull: false, left: 'Financial Modeling', right: 'Executive Telemetry', extraGap: 3.0 }
  ],
  coreStrengths: [
    { title: 'Corporate Controls', desc: 'Zero-defect balance sheet & ledger governance' },
    { title: 'BI Fiscal Dashboards', desc: 'Power BI models with automated variance analysis' },
    { title: 'ERP Data Pipelines', desc: 'Seamless multi-entity accounting automation' },
    { title: 'Statutory Tax Strategy', desc: 'End-to-end GST, ITR & audit optimization' }
  ],
  summaryMetrics: [
    '7+ Years Integrated Experience',
    '₹5Cr+ Audited Ledger Volume',
    '50+ Executive BI Dashboards',
    '100% Statutory Audit Readiness',
    'Zero Compliance Defects'
  ],
  experienceList: [
    {
      title: '1. Corporate Financial Controller & Tax Strategy Lead',
      org: 'Strategic Corporate Advisory & Enterprise Accounts',
      period: '2023 - PRESENT',
      bullets: [
        'Formulated corporate fiscal governance frameworks, internal control policies, and automated statutory tax audit pipelines.',
        'Directed corporate direct/indirect tax strategy, Section 115BAC assessments, and multi-ledger reconciliation models.'
      ],
      coreFocus: 'Corporate Financial Controls  *  Tax Strategy  *  Internal Audit  *  Statutory Compliance'
    },
    {
      title: '2. BI Systems Architect & Financial Operations Lead',
      org: 'Enterprise Systems & Commercial Distribution',
      period: '2021 - PRESENT',
      bullets: [
        'Architected real-time Power BI executive dashboards connecting ERP databases with operational gross margin analytics.',
        'Engineered automated BRS and purchase-sales variance detection pipelines reducing monthly reconciliation latency by 80%.'
      ],
      coreFocus: 'Power BI Fiscal Dashboards  *  ERP Data Pipelines  *  Automated BRS  *  Variance Analytics'
    },
    {
      title: '3. Executive Data & Enterprise Compliance Director',
      org: 'Regional Operations & Institutional Governance',
      period: '2018 - 2023',
      bullets: [
        'Governed multi-district compliance monitoring, biometric databases, and institutional audit trail verification across 4 districts.',
        'Established quantitative reporting dossiers, automated risk telemetry, and statutory documentation pipelines.'
      ],
      coreFocus: 'Executive Data Systems  *  Compliance Governance  *  Multi-District Audit  *  SOP Controls'
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
      title: '5. Senior Accountant & Tally Specialist',
      org: 'Commercial Enterprise & Accounting Practice',
      period: '7+ Years Experience',
      bullets: [
        'Maintained complete double-entry financial accounting in Tally Prime & ERP 9, multi-ledger postings, and bank reconciliations.',
        'Supervised periodic inventory stock valuations, trial balance audits, vendor credit aging, and finalization of P&L and Balance Sheets.'
      ],
      coreFocus: 'Tally Prime & ERP 9  *  Double-Entry Ledgers  *  Trial Balance  *  Balance Sheets'
    },
    {
      title: '6. MIS Executive - DAY-NULM Skill India Project',
      org: 'National Urban Livelihoods Mission',
      period: 'Govt. Contract',
      bullets: [
        'Spearheaded centralized MIS portal administration, candidate registration pipelines, and biometric verification data integrity.',
        'Formulated weekly and monthly quantitative monitoring dossiers, compliance analytics, and district progress reports for executives.'
      ],
      coreFocus: 'Govt. MIS Portal  *  DAY-NULM Skill India  *  Biometric Verification  *  District Reports'
    }
  ]
};

// -----------------------------------------------------------------------------
// 5. VIBE CODING & AI SAAS RESUME (resume-vibe-coder.pdf, Accent #10B981: [0.063, 0.725, 0.506])
// -----------------------------------------------------------------------------
const vibeCoderConfig = {
  roleName: 'vibe_coding',
  outputFilename: 'resume-vibe-coder.pdf',
  themeColor: [0.063, 0.725, 0.506], // Emerald #10B981
  secondaryColor: [0.02, 0.59, 0.41], // #059669
  accentRgb: [0.063, 0.725, 0.506],
  secondaryRgb: [0.02, 0.59, 0.41],
  title: 'AI Software Engineer | Full-Stack SaaS Prototyper | Vibe Coder',
  headerSubtitle: 'AI Software Engineer  |  Full-Stack SaaS Prototyper  |  Vibe Coder',
  headerValueProp: 'Cursor IDE & Claude Code  *  Next.js 14 & Supabase Cloud  *  Autonomous Multi-Agent Loops',
  badgeText: 'AI & SAAS SPECIALIZATION',
  badgeSubtext: 'Rapid Prototyping & AI Engineering',
  badgeDossier: 'Full-Stack Autonomous SaaS Track',
  summaryLines: [
    'High-velocity AI Software Engineer and Full-Stack SaaS Prototyper pioneering prompt-driven software architecture,',
    'autonomous agentic developer loops, and modern web application synthesis. Expert in orchestrating Cursor Composer,',
    'Claude Code CLI, and Windsurf Cascade to build production-grade Next.js 14 and Supabase web applications with 10x',
    'faster delivery cycles, robust automated testing (Vitest/Oxlint), streaming LLM APIs, and secure Stripe billing.'
  ],
  technicalBadges: [
    { isFull: true, label: 'Cursor IDE & Windsurf Cascade' },
    { isFull: false, left: 'Claude Code CLI', right: 'v0.dev UI' },
    { isFull: false, left: 'Next.js 14 / React', right: 'Supabase Cloud' },
    { isFull: true, label: 'LLM APIs (Claude, GPT-4o, Gemini)' },
    { isFull: false, left: 'Autonomous Loops', right: 'TypeScript / Zod' },
    { isFull: false, left: 'Tailwind CSS UI', right: 'Stripe Webhooks', extraGap: 3.0 }
  ],
  education: [
    {
      degree: 'AI Engineering & SaaS Track',
      inst: 'Autonomous Agent Architecture',
      detail: 'Cursor, Claude Code, Next.js 14'
    },
    {
      degree: 'ADCA (Distinction)',
      inst: 'Infocity Computer Education',
      detail: 'Grade A Distinction | Daltonganj'
    },
    {
      degree: 'Intermediate of Arts (I.A.)',
      inst: 'Baba Nawbat Choudhry College',
      detail: 'UP Board Allahabad'
    }
  ],
  coreStrengths: [
    { title: 'Rapid AI Prototyping', desc: 'Zero-to-production MVPs built 10x faster' },
    { title: 'Autonomous Dev Loops', desc: 'Self-healing code, testing & Oxlint gates' },
    { title: 'Full-Stack SaaS Stacks', desc: 'Next.js 14, Supabase RLS & Stripe billing' },
    { title: 'Prompt & LLM Systems', desc: 'Claude 3.5, GPT-4o streaming & tool-calling' }
  ],
  summaryMetrics: [
    '10x SaaS Shipping Velocity',
    '25+ Production MVPs Built',
    '100% Autonomous Pass Rate',
    'Multi-Agent System Harnesses',
    'Full-Stack Cloud Deployment'
  ],
  experienceList: [
    {
      title: '1. Lead AI Software Engineer & Autonomous SaaS Prototyper',
      org: 'Stealth AI SaaS Studio & Independent Practice',
      period: '2024 - PRESENT',
      bullets: [
        'Orchestrated autonomous coding loops with Cursor Composer, Claude Code CLI, and Windsurf to scaffold 25+ full-stack SaaS MVPs.',
        'Engineered end-to-end web applications with Next.js 14 App Router, TypeScript, Tailwind CSS, and streaming frontier LLM APIs.'
      ],
      coreFocus: 'Cursor IDE  *  Claude Code  *  Next.js 14  *  Autonomous Loops  *  SaaS MVPs'
    },
    {
      title: '2. Full-Stack Cloud & Backend Engineer (Supabase & APIs)',
      org: 'SaaS Products & Enterprise Systems',
      period: '2023 - PRESENT',
      bullets: [
        'Architected PostgreSQL schemas with Row-Level Security (RLS), real-time WebSocket subscriptions, and edge compute functions.',
        'Integrated secure Stripe subscription billing, webhook listener state machines, and multi-tenant authentication workflows.'
      ],
      coreFocus: 'Supabase Cloud  *  PostgreSQL RLS  *  Stripe API  *  Edge Functions  *  Auth'
    },
    {
      title: '3. Autonomous Multi-Agent Systems Architect',
      org: 'Agentic AI Workflows & Tool-Calling Harnesses',
      period: '2023 - 2024',
      bullets: [
        'Designed directed acyclic graph (DAG) agent architectures coordinating Researcher, Planner, Coder, and Verifier subagents.',
        'Implemented self-healing code loops utilizing Oxlint static analysis, Vitest suites, and automated git branch pull requests.'
      ],
      coreFocus: 'Multi-Agent Systems  *  Tool Calling  *  Self-Healing Loops  *  Oxlint & Vitest'
    },
    {
      title: '4. BI Systems Architect & Financial Operations Lead',
      org: 'Enterprise Systems & Commercial Distribution',
      period: '2021 - 2023',
      bullets: [
        'Architected real-time Power BI executive dashboards connecting ERP databases with operational gross margin analytics.',
        'Engineered automated BRS and purchase-sales variance detection pipelines reducing monthly reconciliation latency by 80%.'
      ],
      coreFocus: 'Power BI Fiscal Dashboards  *  ERP Data Pipelines  *  Automated BRS  *  Variance Analytics'
    },
    {
      title: '5. Central MIS & Operations Executive',
      org: 'National Urban Livelihoods Mission (DAY-NULM)',
      period: 'Govt. Contract',
      bullets: [
        'Spearheaded centralized MIS portal administration, candidate registration pipelines, and biometric verification data integrity.',
        'Formulated weekly and monthly quantitative monitoring dossiers, compliance analytics, and district progress reports for executives.'
      ],
      coreFocus: 'Govt. MIS Portal  *  DAY-NULM Skill India  *  Biometric Verification  *  District Reports'
    },
    {
      title: '6. Advanced Computer Applications & Systems Instructor',
      org: 'Vocational Training & IT Education Institute',
      period: 'Vocational IT Education',
      bullets: [
        'Delivered structured courses in Advanced MS Excel, database management, digital tools, and certified ADCA core curriculum.',
        'Mentored 150+ candidates in software applications, automated voucher postings, and hardware/networking diagnostics.'
      ],
      coreFocus: 'ADCA Mentorship  *  Advanced Excel  *  Database Management  *  150+ Candidates'
    }
  ]
};

// Generate all role-specific PDF files
console.log('--- Generating Role-Specific & Comprehensive PDF Resumes ---');
generatePdfForRole(accountantConfig);
generatePdfForRole(misConfig);
generatePdfForRole(comprehensiveConfig);
generatePdfForRole(controllerConfig);
generatePdfForRole(vibeCoderConfig);
console.log('--- PDF Generation Complete ---\n');
