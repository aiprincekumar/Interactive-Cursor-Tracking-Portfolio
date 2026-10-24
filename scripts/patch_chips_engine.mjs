import fs from 'fs';

const filePath = 'src/utils/portfolioAssistantEngine.js';
let content = fs.readFileSync(filePath, 'utf8');

const newFunction = `function createFollowupChips(intent, context = {}, query = '', entities = {}) {
  const c = (id, label, query) => ({ id, label, query: query || label });
  const r = context?.role || 'overview';
  const a = context?.audience || 'all';
  const q = String(query || '').toLowerCase();
  const ent = entities || {};

  const commonActions = (roleKey = 'all') => [
    c('wa-chat', '💬 WhatsApp Contact', 'how can i contact atul on whatsapp'),
    c('avail-now', '🟢 Immediate Availability', 'are you available for immediate hire'),
    c('notice-p', '⏱️ Notice: Immediate', 'what is your notice period'),
    c('dl-cv', roleKey === 'accountant' ? '📄 Accountant Resume' : (roleKey === 'mis' ? '📄 MIS Resume' : (roleKey === 'vibe_coding' ? '📄 Vibe Resume' : '📄 Download Resume')), 'download resume'),
    c('fee-est', '💰 Quotation & Fees', 'estimate quotation and service fees'),
    c('all-proj', '🚀 9 Case Studies', 'show me your project case studies')
  ];

  const fillTo12 = (primaryChips, roleKey = 'all') => {
    const list = [...primaryChips];
    const actions = commonActions(roleKey);
    for (const act of actions) {
      if (list.length >= 12) break;
      if (!list.some((item) => item.id === act.id)) {
        list.push(act);
      }
    }
    return list.slice(0, 12);
  };

  // 1. Matrimonial
  if (a === 'marriage' || intent === 'marriage_bio' || /\\b(shadi|shaadi|vivah|biodata|family|kundli|gotra|lifestyle)\\b/i.test(q)) {
    return [
      c('bio-full', '❤️ Full Bio-Data', 'marriage biodata details'),
      c('bio-family', '👨‍👩‍👦 Family & Father', 'family background details'),
      c('bio-life', '🕊️ Lifestyle & Values', 'lifestyle personal values'),
      c('bio-edu', '🎓 Education Details', 'educational qualifications and schooling'),
      c('bio-career', '💼 Career & Stability', 'tell me about your professional career'),
      c('bio-loc', '📍 Native: Daltonganj', 'native place and home location'),
      c('bio-wa', '💬 WhatsApp for PDF', 'whatsapp contact number for biodata'),
      c('bio-kundli', '🪐 Kundli & Horoscope', 'horoscope and kundli details'),
      c('bio-pref', '🤝 Partner Preferences', 'partner preferences and expectations'),
      c('bio-call', '📞 Call Family / Atul', 'what is atul phone number'),
      c('bio-photo', '📸 Portfolio & Photos', 'who is atul verma'),
      c('bio-res', '📄 Professional Resume', 'download verified professional resume')
    ];
  }

  // 2. Specific Project Case Study
  const caseId = ent.projectId || matchProjectKeyword(q);
  if (caseId) {
    const csNames = {
      '01': 'GST Tax Engine', '02': 'Tally Prime & BRS', '03': 'DAY-NULM MIS',
      '04': 'Smart Card 50k+', '05': 'Power BI Analytics', '06': 'Corporate Audit',
      '07': 'AI SaaS MVP', '08': 'Multi-Agent Loops', '09': 'Doc Synthesizer'
    };
    const cName = csNames[caseId] || (\`Case #\` + caseId);
    const nextId = String((parseInt(caseId, 10) % 9) + 1).padStart(2, '0');
    const nextName = csNames[nextId] || (\`Case #\` + nextId);
    const roleKey = ['01', '02', '06'].includes(caseId) ? 'accountant' : (['03', '04', '05'].includes(caseId) ? 'mis' : 'vibe_coding');
    return fillTo12([
      c(\`cs-\${caseId}-deep\`, \`🧮 \${cName} Deep Dive\`, \`tell me about case study \${caseId} \${cName}\`),
      c(\`cs-\${caseId}-tools\`, \`⚙️ Tools & Stack\`, \`what tools were used in case study \${caseId}\`),
      c(\`cs-\${caseId}-impact\`, \`📈 Business Impact & ROI\`, \`business outcomes and impact of case study \${caseId}\`),
      c(\`cs-\${caseId}-next\`, \`📑 Next: \${nextName}\`, \`case study \${nextId} \${nextName}\`),
      c(\`cs-\${caseId}-live\`, \`🚀 Live Telemetry & Demo\`, \`show case study \${caseId} simulation\`),
      c(\`cs-\${caseId}-stack\`, \`🛠️ Core Architecture\`, 'what is your core tech stack and skills'),
      c(\`cs-\${caseId}-time\`, \`⏱️ Turnaround & Delivery\`, 'what is turnaround time for projects')
    ], roleKey);
  }

  // 3. Tax / GST / Accounting
  if ((intent === 'services' && /\\b(gst|tax|tally|accounting|audit|itc|itr|brs)\\b/i.test(q)) || /\\b(gst|gstr|itc|tax|income tax|itr|tally|accounting|audit|balance sheet|brs|ledger)\\b/i.test(q)) {
    return fillTo12([
      c('gst-itc', '📊 GSTR-2B & ITC', 'tell me about gstr-2b and itc reconciliation'),
      c('gst-tally', '📑 Tally Prime & BRS', 'tally prime bank reconciliation'),
      c('gst-audit', '💼 Balance Sheet & Audit', 'corporate audit readiness and balance sheet'),
      c('gst-fee', '💰 Tax Filing Fees', 'what are your tax filing fees and charges'),
      c('gst-cs01', '🧮 GST Case Study #01', 'case study 01 gst engine'),
      c('gst-itr', '📝 ITR Filing Process', 'income tax e-filing itr-1 to 4'),
      c('gst-vba', '⚡ Excel Macro Cleaning', 'ms excel vba macro data cleaning'),
      c('gst-pbi', '📈 Power BI Dashboards', 'power bi fiscal dashboards')
    ], 'accountant');
  }

  // 4. Projects & Case Studies
  if (intent === 'projects' || /\\b(project|projects|case study|case studies|portfolio|work|kaam)\\b/i.test(q)) {
    return [
      c('p-cs01', '🧮 Case #01: GST Tax Engine', 'case study 01 gst engine'),
      c('p-cs02', '📑 Case #02: Tally & BRS', 'case study 02 tally accounting'),
      c('p-cs03', '🏛️ Case #03: DAY-NULM MIS', 'case study 03 day-nulm mis'),
      c('p-cs04', '💳 Case #04: Smart Card 50k+', 'case study 04 smart card'),
      c('p-cs05', '📈 Case #05: Power BI Analytics', 'case study 05 power bi'),
      c('p-cs06', '💼 Case #06: Corporate Audit', 'case study 06 corporate audit'),
      c('p-cs07', '🤖 Case #07: AI SaaS MVP Gen', 'case study 07 ai saas generator'),
      c('p-cs08', '⚡ Case #08: Multi-Agent Loops', 'case study 08 agent workflow engine'),
      c('p-cs09', '📄 Case #09: Doc Synthesizer', 'case study 09 doc code synthesizer'),
      c('p-stack', '🛠️ Full Tech Stack & Tools', 'what is your core tech stack and skills'),
      c('p-quote', '💰 Quotation & Timelines', 'estimate quotation and service fees'),
      c('p-wa', '💬 WhatsApp Project Inquiry', 'how can i contact atul on whatsapp')
    ];
  }

  // 5. Skills & Tech Stack
  if (intent === 'skills' || /\\b(skill|skills|tech|stack|tools|python|react|excel|power bi|tally|hunar)\\b/i.test(q)) {
    return fillTo12([
      c('s-pbi', '📈 Power BI Dashboards', 'power bi dashboards and kpis'),
      c('s-vba', '⚡ MS Excel VBA & Macros', 'excel automation and macros'),
      c('s-tally', '📑 Tally Prime & ERP 9', 'tally prime and erp 9'),
      c('s-gst', '🧮 GST & ITC Compliance', 'gst filing and itc reconciliation'),
      c('s-agent', '🤖 Claude Code & Agents', 'claude code agent workflows'),
      c('s-react', '⚛️ React 19 & Next.js SaaS', 'nextjs and react development'),
      c('s-proj', '🚀 Projects Using Skills', 'tell me about your featured projects'),
      c('s-exp', '⏱️ 10+ Years Breakdown', 'summarize your professional experience')
    ], r);
  }

  // 6. Pricing & Quotation
  if (intent === 'services' || intent === 'pricing' || /\\b(pricing|price|quote|quotation|cost|fees|fee|charge|charges|kharcha|paisa|paise)\\b/i.test(q)) {
    return fillTo12([
      c('pr-gst', '📊 GST Filing (₹2.5k)', 'gst return filing charges'),
      c('pr-tally', '📑 Tally Retainer (₹3k)', 'tally prime accounting monthly charges'),
      c('pr-saas', '🤖 AI SaaS MVP (₹18k+)', 'ai mvp prototype cost'),
      c('pr-pbi', '📈 Power BI Dashboard (₹4k)', 'power bi executive kpi dashboard cost'),
      c('pr-vba', '⚡ Excel VBA Macro (₹3.5k)', 'excel vba macro automation cost'),
      c('pr-audit', '💼 Audit Dossier Prep (₹4.5k)', 'balance sheet p&l audit readiness fee'),
      c('pr-neg', '🤝 Rates Negotiable?', 'are service rates negotiable for retainers'),
      c('pr-time', '📅 Delivery Milestones', 'project delivery timelines and milestones')
    ], r);
  }

  // 7. Experience
  if (intent === 'experience' || /\\b(experience|history|career|tenure|anubhav|background|journey)\\b/i.test(q)) {
    return fillTo12([
      c('exp-acc', '🏛️ Senior Accountant (2018–Pres)', 'senior accountant experience and returns'),
      c('exp-mis', '🏛️ DAY-NULM MIS Lead (2016–18)', 'day-nulm mis experience'),
      c('exp-sc', '💳 50,000+ Smart Cards (2012–16)', 'smart card operations lead experience'),
      c('exp-ai', '🤖 AI Vibe Coder (2024–Pres)', 'ai vibe coding experience and agents'),
      c('exp-loc', '📍 Location & Remote Terms', 'current location and remote availability'),
      c('exp-ref', '🏢 Client & CA References', 'client references and testimonials'),
      c('exp-ctc', '💰 Expected CTC', 'salary and ctc expectations')
    ], r);
  }

  // 8. Contact & Hire
  if (intent === 'contact' || intent === 'recruiter_info' || intent === 'client_info' || intent === 'availability' || /\\b(contact|hire|email|phone|whatsapp|call|reach|talk|interview|notice|available|availability)\\b/i.test(q)) {
    return [
      c('c-wa', '💬 WhatsApp Atul Directly', 'how can i contact atul on whatsapp'),
      c('c-phone', '📞 Call (+91 7992383804)', 'what is atul phone number'),
      c('c-email', '📧 Email (atulravi2015@gmail.com)', 'what is atul email address'),
      c('c-resume', '📄 Download Resume PDF', 'download verified professional resume'),
      c('c-notice', '🟢 Notice: Immediate Joiner', 'what is your notice period'),
      c('c-exp', '💼 10+ Years Summary', 'summarize your professional experience'),
      c('c-cs', '🚀 9 Live Case Studies', 'show me your project case studies'),
      c('c-quote', '💰 Project Quotation', 'estimate quotation and service fees'),
      c('c-remote', '📍 Remote / Relocation Terms', 'remote or on-site work availability'),
      c('c-call', '🤝 Schedule Discovery Call', 'schedule interview or call'),
      c('c-bio', '💍 Matrimonial Bio-Data', 'view family background and matrimonial biodata'),
      c('c-tech', '⚡ Tech Stack & Tools', 'what is your core tech stack and skills')
    ];
  }

  // 9. Audience Defaults
  if (a === 'recruiter') {
    return [
      c('rec-resume', '📄 Download Resume', 'download resume'),
      c('rec-notice', '⏱️ Notice: Immediate Joiner', 'what is your notice period'),
      c('rec-skills', '⚡ Tech Stack & Tools', 'what skills and tools do you use'),
      c('rec-exp', '💼 10+ Years Experience', 'tell me about your work experience'),
      c('rec-avail', '🟢 Immediate Availability', 'are you available for immediate hire'),
      c('rec-cs', '🚀 Featured Case Studies', 'tell me about your featured projects'),
      c('rec-acc', '🧮 Tax & Accounting Tenure', 'senior accountant experience'),
      c('rec-gov', '🏛️ Govt Portal Operations', 'day-nulm mis experience'),
      c('rec-ai', '🤖 AI Vibe Coding Stack', 'ai vibe coding experience'),
      c('rec-wa', '💬 WhatsApp Recruiter Chat', 'how can i contact atul on whatsapp'),
      c('rec-ctc', '💰 CTC & Compensation', 'salary and ctc expectations'),
      c('rec-loc', '📍 Location & Remote Terms', 'current location and remote availability')
    ];
  }

  if (a === 'client') {
    return [
      c('cli-quote', '💰 Quotation & Fees', 'what are your service charges'),
      c('cli-cs', '🚀 Verified Case Studies', 'show me your project case studies'),
      c('cli-wa', '💬 WhatsApp Consultation', 'how can i contact atul on whatsapp'),
      c('cli-gst', '📊 GST Return & ITC Advisory', 'tell me about gst and tax consulting'),
      c('cli-tally', '📑 Tally Prime & BRS Retainer', 'tally prime and bank reconciliation'),
      c('cli-pbi', '📈 Power BI KPI Dashboards', 'tell me about power bi dashboards'),
      c('cli-saas', '🤖 AI SaaS MVP Prototype Build', 'ai mvp prototype cost'),
      c('cli-macro', '⚡ Excel VBA Automation', 'excel automation and macros'),
      c('cli-audit', '💼 Corporate Audit Dossier', 'balance sheet and p&l audit dossier'),
      c('cli-res', '📄 Consultant Profile', 'download verified professional resume'),
      c('cli-time', '⏱️ Turnaround & Milestones', 'what is turnaround time for projects'),
      c('cli-call', '📞 Direct Call (+91 7992383804)', 'what is atul phone number')
    ];
  }

  // 10. Role Defaults
  switch (r) {
    case 'accountant':
      return [
        c('r-gst', '📊 GST Filing & GSTR-2B', 'gst return filing and itc'),
        c('r-tally', '📑 Tally ERP & BRS', 'tally prime and bank reconciliation'),
        c('r-itr', '📝 Income Tax Returns (ITR 1-4)', 'income tax e-filing itr-1 to 4'),
        c('r-audit', '💼 Balance Sheet & Audit Dossier', 'balance sheet and audit governance'),
        c('r-fee', '💰 Tax & Tally Retainer Rates', 'tax filing fees and pricing'),
        c('r-cs01', '🧮 GST Case Study #01', 'case study 01 gst engine'),
        c('r-cs02', '📑 Tally Case Study #02', 'case study 02 tally accounting'),
        c('r-dl', '📄 Accountant Resume', 'download accountant resume'),
        c('r-wa', '💬 WhatsApp Tax Chat', 'how can i contact atul on whatsapp'),
        c('r-pbi', '📈 Power BI Fiscal Telemetry', 'power bi fiscal dashboards'),
        c('r-avail', '🟢 Immediate Availability', 'are you available for immediate hire'),
        c('r-ref', '🏢 Zero Penalty Track Record', 'client references and audit track record')
      ];

    case 'mis':
      return [
        c('m-nulm', '🏛️ DAY-NULM Portal MIS', 'day-nulm government reporting'),
        c('m-vba', '⚡ Excel VBA Macro Pipelines', 'excel automation and macros'),
        c('m-sc', '💳 50k+ Biometric Smart Cards', 'smart card biometric enrollments'),
        c('m-pbi', '📈 Power BI Analytics Dashboard', 'power bi executive kpi dashboard'),
        c('m-cs03', '📊 MIS Case Study #03', 'case study 03 day-nulm mis'),
        c('m-cs04', '💳 Smart Card Case #04', 'case study 04 smart card'),
        c('m-dl', '📄 MIS Operations Resume', 'download mis resume'),
        c('m-fee', '💰 MIS Project Quotation', 'what are your service charges'),
        c('m-wa', '💬 WhatsApp Operations Chat', 'how can i contact atul on whatsapp'),
        c('m-exp', '💼 10+ Years Operations Tenure', 'summarize your professional experience'),
        c('m-clean', '🧹 Large Data Cleaning (10k+ Rows)', 'large dataset reconciliation and cleaning'),
        c('m-avail', '⏱️ Notice & Immediate Hire', 'what is your notice period')
      ];

    case 'vibe_coding':
      return [
        c('v-saas', '🤖 AI SaaS MVP Prototype #07', 'ai saas prototype case study'),
        c('v-agent', '⚡ Autonomous Multi-Agent Loops', 'autonomous llm agent workflows'),
        c('v-sdk', '🚀 Google Antigravity SDK', 'google antigravity sdk agents'),
        c('v-claude', '🧠 Claude Code & Cursor Flows', 'claude code agent workflows'),
        c('v-cs07', '🤖 Case Study #07: AI SaaS MVP', 'case study 07 ai saas generator'),
        c('v-cs08', '⚡ Case Study #08: Multi-Agent Engine', 'case study 08 agent workflow engine'),
        c('v-cs09', '📄 Case Study #09: Doc Synthesizer', 'case study 09 doc code synthesizer'),
        c('v-fee', '💰 AI MVP Prototype Pricing', 'how much does an ai mvp prototype cost'),
        c('v-dl', '📄 Vibe Coder Resume', 'download vibe coder resume'),
        c('v-stack', '🛠️ React 19, Vite & Tailwind v4', 'what is your core tech stack and skills'),
        c('v-wa', '💬 WhatsApp Tech Discussion', 'how can i contact atul on whatsapp'),
        c('v-avail', '🟢 Ready for Full-Stack Roles', 'are you available for immediate hire')
      ];

    case 'overview':
    default:
      return [
        c('o-proj', '🚀 Featured Projects (9 Studies)', 'tell me about your featured projects'),
        c('o-tech', '⚡ Tech Stack & Skills', 'what is your core tech stack and skills?'),
        c('o-exp', '💼 10+ Years Career Experience', 'summarize your professional experience'),
        c('o-pricing', '💰 Quotation & Service Fees', 'estimate quotation and service fees'),
        c('o-resume', '📄 Download Verified Resume', 'download verified professional resume'),
        c('o-gst', '📊 GST, ITR & Tax Advisory', 'tell me about gst and tax consulting'),
        c('o-pbi', '📈 Power BI & Excel Automation', 'tell me about power bi dashboards'),
        c('o-ai', '🤖 AI SaaS & Agent Workflows', 'tell me about ai prompt-to-saas and multi-agent workflows'),
        c('o-contact', '📬 How to Contact & Hire', 'how can i get in touch or hire you?'),
        c('o-avail', '🟢 Immediate Joining Availability', 'what is your notice period and joining availability'),
        c('o-wa', '💬 WhatsApp Atul Directly', 'how can i contact atul on whatsapp'),
        c('o-bio', '💍 Family & Matrimonial Bio', 'view family background and matrimonial biodata')
      ];
  }
}`;

const startMarker = 'function createFollowupChips(intent, context) {';
const endMarker = 'export const AUDIENCE_EMOJI_PRESETS = {';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found!', { startIndex, endIndex });
  process.exit(1);
}

const before = content.slice(0, startIndex);
const after = content.slice(endIndex);

content = before + newFunction + '\n\n' + after;

// Update callers
content = content.replace("const chips = createFollowupChips('faq_hit', safeContext);", "const chips = createFollowupChips('faq_hit', safeContext, safeQuery, { faq: faqHit.faq });");
content = content.replace("const chips = createFollowupChips('roles', { role: targetRole });", "const chips = createFollowupChips('roles', { role: targetRole }, safeQuery, { role: targetRole });");
content = content.replace(/const chips = createFollowupChips\(intent, safeContext\);/g, "const chips = createFollowupChips(intent, safeContext, safeQuery, entities);");
content = content.replace("const chips = createFollowupChips(resolvedIntent, safeContext);", "const chips = createFollowupChips(resolvedIntent, safeContext, safeQuery, { ...entities, projectId: caseId });");

// Update fallback chips
const fallbackTarget = `  const fallbackChips = [
    { id: 'view-roles', label: isHi ? '👨‍💼 भूमिकाएं देखें' : '👨‍💼 View Roles', query: 'who is atul' },
    { id: 'view-skills', label: isHi ? '⚡ कौशल देखें' : '⚡ View Skills', query: 'skills' },
    { id: 'view-projects', label: isHi ? '🚀 प्रोजेक्ट्स देखें' : '🚀 View Projects', query: 'projects' },
    { id: 'view-contact', label: isHi ? '📬 संपर्क करें' : '📬 Contact Details', query: 'contact' }
  ];`;

if (content.includes(fallbackTarget)) {
  content = content.replace(fallbackTarget, "  const fallbackChips = createFollowupChips(finalIntent, safeContext, safeQuery, entities);");
} else {
  // Try with \r\n
  const fallbackTargetCRLF = fallbackTarget.replace(/\n/g, '\r\n');
  if (content.includes(fallbackTargetCRLF)) {
    content = content.replace(fallbackTargetCRLF, "  const fallbackChips = createFollowupChips(finalIntent, safeContext, safeQuery, entities);");
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated portfolioAssistantEngine.js! Total bytes:', content.length);
