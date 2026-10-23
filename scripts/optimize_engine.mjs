import fs from 'fs';
import path from 'path';

const file = path.resolve('src/utils/portfolioAssistantEngine.js');
let src = fs.readFileSync(file, 'utf8');

// 1. Remove comments that are not necessary (preserve JSDoc for exports if any)
src = src.replace(/\/\*[\s\S]*?\*\//g, ''); // remove block comments
src = src.split('\n')
  .filter(line => !line.trim().startsWith('//'))
  .join('\n');

// 2. Remove redundant blank lines
src = src.replace(/\n\s*\n\s*\n/g, '\n\n');

// 3. Compact createActionButtons
src = src.replace(
  `      add('download-resume', '📄 Download Verified Resume (PDF)', '📄 आधिकारिक रिज्यूमे डाउनलोड करें', resumeCfg.fileName, { role: activeRole, fileName: resumeCfg.fileName });
      add('scroll', '💼 View Career History', '💼 करियर इतिहास देखें', '#experience', { selector: '#experience' });`,
  `      add('download-resume', '📄 Download Verified Resume (PDF)', '📄 आधिकारिक रिज्यूमे डाउनलोड करें', resumeCfg.fileName, { role: activeRole, fileName: resumeCfg.fileName });
      add('scroll', '💼 View Career History', '💼 करियर इतिहास देखें', '#experience', { selector: '#experience' });`
);

// 4. In buildIntentText, remove raw ** from the static bodies
src = src.replace(
  `  const pricingBody = '• **Accounting & Statutory Tax**: Base ₹4,500 – ₹8,000 (GST, ITR, BRS, audit dossier)\\n• **MIS & Data Operations**: Base ₹5,000 – ₹9,000 (Excel VBA macros, portals, ETL)\\n• **AI & Web Engineering**: Base ₹22,000 – ₹35,000 (Next.js SaaS MVP, multi-agent workflows)';
  const srvBody = pricingBody;
  const clientBody = pricingBody;
  const recBody = '• **Availability**: Immediate (0 to 15 days notice period)\\n• **Work Modes**: 100% remote readiness (1 Gbps fiber + UPS) or onsite relocation to tech hubs\\n• **Resume / CV**: Official role-specific verified PDF resume dossier available below for instant hire download';
  const expBody = '• **Senior Accountant & Tax Consultant** (2018–Present): 500+ returns, ₹2.5Cr+ ITC, zero notices\\n• **MIS Executive** — DAY-NULM Skill India (2016–2018): Multi-district portal reporting\\n• **Smart Card Operations Lead** (2012–2016): 50,000+ biometric enrollments across 12+ districts\\n• **AI Vibe Coder & Systems Engineer** (2024–Present): Autonomous multi-agent pipelines';
  const achBody = '• **500+** Statutory returns e-filed (100% on-time compliance rate)\\n• **₹2.5Cr+** Reconciled eligible Input Tax Credit (ITC)\\n• **0%** Scrutiny notices or penalty assessments across 7+ years\\n• **50,000+** Biometric registrations across 12+ districts\\n• **9** Comprehensive production flagship case studies';
  const availBody = '• **Working Hours & Timings**: Monday – Saturday, 10:00 AM – 7:00 PM IST (वर्किंग समय)\\n• **Available for Immediate Hire**: 0 to 15 days notice period\\n• **Remote Station**: Dual-redundant 1 Gbps broadband with industrial UPS power backup';`,
  `  const pricingBody = '• Accounting & Statutory Tax: Base ₹4,500 – ₹8,000 (GST, ITR, BRS, audit dossier)\\n• MIS & Data Operations: Base ₹5,000 – ₹9,000 (Excel VBA macros, portals, ETL)\\n• AI & Web Engineering: Base ₹22,000 – ₹35,000 (Next.js SaaS MVP, multi-agent workflows)';
  const srvBody = pricingBody;
  const clientBody = pricingBody;
  const recBody = '• Availability: Immediate (0 to 15 days notice period)\\n• Work Modes: 100% remote readiness (1 Gbps fiber + UPS) or onsite relocation to tech hubs\\n• Resume / CV: Official role-specific verified PDF resume dossier available below for instant hire download';
  const expBody = '• Senior Accountant & Tax Consultant (2018–Present): 500+ returns, ₹2.5Cr+ ITC, zero notices\\n• MIS Executive — DAY-NULM Skill India (2016–2018): Multi-district portal reporting\\n• Smart Card Operations Lead (2012–2016): 50,000+ biometric enrollments across 12+ districts\\n• AI Vibe Coder & Systems Engineer (2024–Present): Autonomous multi-agent pipelines';
  const achBody = '• 500+ Statutory returns e-filed (100% on-time compliance rate)\\n• ₹2.5Cr+ Reconciled eligible Input Tax Credit (ITC)\\n• 0% Scrutiny notices or penalty assessments across 7+ years\\n• 50,000+ Biometric registrations across 12+ districts\\n• 9 Comprehensive production flagship case studies';
  const availBody = '• Working Hours & Timings: Monday – Saturday, 10:00 AM – 7:00 PM IST (वर्किंग समय)\\n• Available for Immediate Hire: 0 to 15 days notice period\\n• Remote Station: Dual-redundant 1 Gbps broadband with industrial UPS power backup';`
);

fs.writeFileSync(file, src);
console.log('Optimized! New Byte Size:', Buffer.byteLength(src, 'utf8'));
