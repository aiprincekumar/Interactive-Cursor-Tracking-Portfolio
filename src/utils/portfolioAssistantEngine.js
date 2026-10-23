/**
 * Portfolio Assistant Engine: 100% Offline Deterministic Knowledge Engine
 */

import { SEARCH_ITEMS } from './searchCatalog.js';
import { CASE_STUDIES } from '../data/caseStudiesData.js';
import { FAQ_ITEMS } from '../data/faqConfig.js';
import { RESUME_ROLE_CONFIG, getResumeConfig } from './resumeConfig.js';
import { SKILLS_DATA } from '../data/skillsData.js';


export const PROJECT_KEYWORD_MAP = [
  { id: '01', regex: /\b(gst|gstr|itc|tax compliance|tax verification|income tax|itr)\b/i },
  { id: '02', regex: /\b(tally|tally prime|erp 9|brs|inventory management)\b/i },
  { id: '03', regex: /\b(day-nulm|nulm|skill india|puda|biometric portal)\b/i },
  { id: '04', regex: /\b(smart card|enrollment engine|biometric enrollment|smart card operations)\b/i },
  { id: '05', regex: /\b(power bi|powerbi|pbi|fiscal intelligence|kpi dashboard|bi dashboard)\b/i },
  { id: '06', regex: /\b(corporate audit|internal audit|financial controls|audit governance|audit)\b/i },
  { id: '07', regex: /\b(saas generator|prompt-to-fullstack|mvp generator|prompt to fullstack|ai saas|saas)\b/i },
  { id: '08', regex: /\b(multi-agent|agent workflow|autonomous agent|agentic engine|multi agent)\b/i },
  { id: '09', regex: /\b(synthesizer|ai document|code synthesizer|document synthesizer)\b/i }
];

export function matchProjectKeyword(query) {
  if (!query) return null;
  const q = String(query).toLowerCase();
  for (const item of PROJECT_KEYWORD_MAP) {
    if (item.regex.test(q)) return item.id;
  }
  try {
    const norm = typeof normalizeQuery === 'function' ? normalizeQuery(query).normalized : '';
    if (norm && norm !== q) {
      for (const item of PROJECT_KEYWORD_MAP) {
        if (item.regex.test(norm)) return item.id;
      }
    }
  } catch {
    // safe fallback
  }
  return null;
}

export function getCaseStudyId(item) {
  if (!item) return null;
  if (item.caseStudyId) return item.caseStudyId;
  const target = item.targetId || item.id || '';
  const map = {
    'proj-gst-tax': '01',
    'proj-tally-accounting': '02',
    'proj-day-nulm': '03',
    'proj-smart-card': '04',
    'proj-enterprise-transformation': '05',
    'proj-business-advisory': '06',
    'proj-ai-saas-generator': '07',
    'proj-agent-workflow-engine': '08',
    'proj-doc-code-synthesizer': '09'
  };
  if (map[target]) return map[target];
  return matchProjectKeyword(item.title || item.keywords || '');
}

export const SKILL_LOOKUP_MAP = [
  { key: 'Power BI & Fiscal Dashboards', regex: /\b(power bi|powerbi|pbi|fiscal dashboard|dax)\b/i, relatedCaseStudy: '05' },
  { key: 'MS Excel (Advanced)', regex: /\b(excel|vba|macro|macros|spreadsheet|spreadsheets)\b/i, relatedCaseStudy: '03' },
  { key: 'GST Filing & Compliance', regex: /\b(gst|gstr|itc|gstr-1|gstr-3b|gstr-9|2b)\b/i, relatedCaseStudy: '01' },
  { key: 'Income Tax E-Filing', regex: /\b(income tax|itr|incometax|26as|ais|tis)\b/i, relatedCaseStudy: '01' },
  { key: 'Tally Prime & ERP 9', regex: /\b(tally|tally prime|erp 9|brs|ledger|voucher)\b/i, relatedCaseStudy: '02' },
  { key: 'Financial Auditing & Ledgers', regex: /\b(audit|auditing|balance sheet|p&l|financial audit)\b/i, relatedCaseStudy: '06' },
  { key: 'Corporate Financial Controls', regex: /\b(corporate financial controls|internal audit|variance analytics)\b/i, relatedCaseStudy: '06' },
  { key: 'Claude Code & Agent Loops', regex: /\b(multi-agent|multi agent|agent loops|claude code|agentic|autonomous agent)\b/i, relatedCaseStudy: '08' },
  { key: 'Next.js 14 & React Ecosystem', regex: /\b(next\.js|nextjs|react|react 19|frontend|web app)\b/i, relatedCaseStudy: '07' },
  { key: 'Tailwind CSS & Modern UI', regex: /\b(tailwind|tailwind css|modern ui|css)\b/i, relatedCaseStudy: '07' },
  { key: 'Cursor & Windsurf IDEs', regex: /\b(cursor|windsurf|vibe coding|vibe code)\b/i, relatedCaseStudy: '07' },
  { key: 'LLM APIs & Prompt Architecture', regex: /\b(llm|prompt|prompt architecture|synthesizer)\b/i, relatedCaseStudy: '09' },
  { key: 'DAY-NULM & Skill India MIS Portal Operations', regex: /\b(day-nulm|nulm|skill india|puda)\b/i, relatedCaseStudy: '03' },
  { key: 'RSBY & Smart Card Biometric Enrollment', regex: /\b(smart card|rsby|biometric enrollment)\b/i, relatedCaseStudy: '04' }
];

export function findMatchedSkill(query, searchResults = []) {
  if (!query) return null;
  const q = String(query).toLowerCase();
  for (const entry of SKILL_LOOKUP_MAP) {
    if (entry.regex.test(q)) {
      const data = SKILLS_DATA[entry.key];
      if (data) return { ...data, key: entry.key, relatedCaseStudy: entry.relatedCaseStudy };
    }
  }
  try {
    const norm = typeof normalizeQuery === 'function' ? normalizeQuery(query).normalized : '';
    if (norm && norm !== q) {
      for (const entry of SKILL_LOOKUP_MAP) {
        if (entry.regex.test(norm)) {
          const data = SKILLS_DATA[entry.key];
          if (data) return { ...data, key: entry.key, relatedCaseStudy: entry.relatedCaseStudy };
        }
      }
    }
  } catch {
    // safe fallback
  }
  if (Array.isArray(searchResults)) {
    for (const res of searchResults) {
      if (res.item && res.item.category === 'Skills') {
        const itemTitle = res.item.title || '';
        for (const [key, data] of Object.entries(SKILLS_DATA)) {
          if (itemTitle.toLowerCase().includes(data.title.toLowerCase()) || data.title.toLowerCase().includes(itemTitle.toLowerCase())) {
            const entry = SKILL_LOOKUP_MAP.find(m => m.key === key);
            return { ...data, key, relatedCaseStudy: entry?.relatedCaseStudy || null };
          }
        }
      }
    }
  }
  return null;
}

// 1. AUTHENTIC KNOWLEDGE CONSTANTS & TAXONOMY

export const CORE_INTENTS = [
  'roles',
  'projects',
  'skills',
  'experience',
  'services',
  'achievements',
  'recruiter_info',
  'client_info',
  'marriage_bio',
  'contact',
  'availability',
  'navigation',
  'filter_toggles',
  'suggestions',
  'ambiguous',
  'fallback'
];

export const QUOTATION_DATA = {
  accounting: {
    trackName: 'Accounting & Statutory Tax Advisory',
    trackName_hi: 'अकाउंटिंग एवं वैधानिक कर परामर्श',
    minBase: 4500,
    maxBase: 8000,
    services: [
      { id: 'gst', label: 'GST Return Filing (GSTR-1, 3B, 2B Reconciliation)', cost: 2500 },
      { id: 'itr', label: 'Income Tax E-Filing (ITR-1 to 4 & Tax Planning)', cost: 2000 },
      { id: 'tally', label: 'Tally Prime / ERP Multi-Company Setup & BRS', cost: 3000 },
      { id: 'audit', label: 'Balance Sheet, P&L & Audit Readiness Dossier', cost: 4500 }
    ]
  },
  mis: {
    trackName: 'MIS & Operations Data Systems',
    trackName_hi: 'MIS एवं ऑपरेशंस डेटा सिस्टम्स',
    minBase: 5000,
    maxBase: 9000,
    services: [
      { id: 'macro', label: 'MS Excel VBA / Macro Automation & Pipelines', cost: 3500 },
      { id: 'govt', label: 'DAY-NULM / Government Skill Portal Reporting', cost: 3000 },
      { id: 'cleaning', label: 'Large Dataset Reconciliation & Cleaning (10k+ rows)', cost: 2500 },
      { id: 'powerbi', label: 'Power BI Executive KPI Dashboard & Telemetry', cost: 4000 }
    ]
  },
  ai_web: {
    trackName: 'AI & Web Engineering / Vibe Coding',
    trackName_hi: 'AI एवं वेब इंजीनियरिंग / Vibe Coding',
    minBase: 22000,
    maxBase: 35000,
    services: [
      { id: 'mvp', label: 'Full-Stack Next.js / React SaaS MVP Prototype', cost: 18000 },
      { id: 'agents', label: 'Autonomous Multi-Agent LLM Workflow Engine', cost: 14000 },
      { id: 'api', label: 'Production REST API, Auth & PostgreSQL DB Integration', cost: 8000 },
      { id: 'design', label: 'High-Fidelity Tailwind CSS & UI/UX Interactions', cost: 6000 }
    ]
  }
};

export const DEMOGRAPHIC_BIO = {
  fullName: 'Atul Verma',
  fullName_hi: 'अतुल वर्मा',
  fatherName: 'Late Niranjan Prasad',
  fatherName_hi: 'स्व. निरंजन प्रसाद',
  yearOfBirth: '1991',
  maritalStatus: 'Indian • Single (Unmarried)',
  maritalStatus_hi: 'भारतीय • अविवाहित',
  languages: 'Hindi, Soft English',
  languages_hi: 'हिंदी, सरल अंग्रेजी',
  rolePractice: 'Senior Accountant, Tax Consultant & MIS Operations Lead',
  rolePractice_hi: 'सीनियर अकाउंटेंट, टैक्स कंसल्टेंट एवं MIS ऑपरेशंस लीड',
  coverage: 'Jharkhand & Bihar (Palamau, Garhwa, Chatra, Rohtas)',
  coverage_hi: 'झारखंड एवं बिहार (पलामू, गढ़वा, चतरा, रोहतास)',
  nativePlace: 'Daltonganj (Medininagar), Palamau District, Jharkhand - 822101',
  nativePlace_hi: 'डाल्टनगंज (मेदिनीनगर), पलामू, झारखंड - 822101'
};

export const CONTACT_INFO = {
  phone: '+91 7992383804',
  whatsappUrl: 'https://wa.me/917992383804?text=Hello%20Atul%20ji%2C%20I%20would%20like%20to%20connect%20regarding%20your%20portfolio.',
  email: 'atulravi2015@gmail.com',
  mailtoUrl: 'mailto:atulravi2015@gmail.com?subject=Portfolio%20Inquiry%20-%20Atul%20Verma',
  location: 'Daltonganj, Palamau, Jharkhand, India - 822101',
  hours: 'Monday – Saturday: 10:00 AM – 7:00 PM IST',
  availabilityStatus: 'Immediate (0 to 15 days notice) for full-time / consulting roles; 100% remote continuity with fiber & industrial UPS.'
};

export const ROLE_PROFILES = {
  overview: {
    title: 'Multi-Track Polymath & Executive Practitioner',
    title_hi: 'बहु-विषयक पॉलीमैथ एवं एग्जीक्यूटिव प्रैक्टिशनर',
    summary: 'Atul Verma bridges statutory financial compliance, high-volume government MIS systems, and modern autonomous AI vibe coding into unified operational excellence.',
    summary_hi: 'अतुल वर्मा वैधानिक वित्तीय अनुपालन, उच्च-मात्रा वाले सरकारी MIS सिस्टम्स और आधुनिक स्वायत्त AI Vibe Coding को एकीकृत परिचालन उत्कृष्टता में जोड़ते हैं।'
  },
  accountant: {
    title: 'Senior Tally Accountant & Statutory Tax Consultant',
    title_hi: 'सीनियर टैली अकाउंटेंट एवं वैधानिक कर सलाहकार',
    summary: '7+ years active practice, 500+ statutory returns filed (GSTR-1, 3B, 9, ITR 1-4), ₹2.5Cr+ reconciled ITC with 0% scrutiny notices.',
    summary_hi: '7+ वर्षों का सक्रिय अभ्यास, 500+ दाखिल वैधानिक रिटर्न (GSTR-1, 3B, 9, ITR 1-4), ₹2.5Cr+ सत्यापित ITC और शून्य पेनल्टी नोटिस रिकॉर्ड।'
  },
  mis: {
    title: 'MIS & Analytics Specialist / Operations Lead',
    title_hi: 'MIS एवं एनालिटिक्स स्पेशलिस्ट / ऑपरेशंस लीड',
    summary: '10+ years career, 50,000+ candidate biometric enrollments across 12+ districts, DAY-NULM Skill India portal governance, Advanced Excel VBA/Macros.',
    summary_hi: '10+ वर्षों का अनुभव, 12+ जिलों में 50,000+ बायोमेट्रिक नामांकन, DAY-NULM स्किल इंडिया पोर्टल संचालन और उन्नत Excel VBA ऑटोमेशन।'
  },
  vibe_coding: {
    title: 'AI Vibe Coder & Full-Stack Systems Engineer',
    title_hi: 'AI Vibe Coder एवं फुल-स्टैक सिस्टम्स इंजीनियर',
    summary: 'Rapid prototyping via Google Antigravity SDK, Claude Code, Cursor, React 19, Vite, Tailwind v4, and autonomous multi-agent pipelines.',
    summary_hi: 'एंटीग्रेविटी SDK, क्लॉड कोड, कर्सर, React 19, Vite और स्वायत्त मल्टी-एजेंट पाइपलाइन्स के माध्यम से रैपिड फुल-स्टैक प्रोटोटाइपिंग।'
  },
  other: {
    title: 'Executive Corporate Controller & BI Strategist',
    title_hi: 'एग्जीक्यूटिव कॉर्पोरेट कंट्रोलर एवं BI रणनीतिकार',
    summary: 'Synthesizing rigorous statutory financial controls with automated ERP pipelines and dynamic Power BI executive telemetry.',
    summary_hi: 'स्वचालित ERP पाइपलाइनों और गतिशील Power BI एग्जीक्यूटिव टेलीमेट्री के साथ सख्त वैधानिक वित्तीय नियंत्रण।'
  }
};

// 2. LAYER B: MULTILINGUAL DETECTION & TYPO DICTIONARY

const DEVANAGARI_REGEX = /[\u0900-\u097F]/;

const HINGLISH_STOPWORDS = new Set([
  'kya', 'kaise', 'kitna', 'kitne', 'kitni', 'kahan', 'kaha', 'karo', 'karna',
  'karein', 'chahiye', 'batao', 'bataye', 'shadi', 'vivah', 'kaam', 'paisa',
  'paise', 'kharcha', 'fees', 'kis', 'kyu', 'kyun', 'mujhe', 'tum', 'aap',
  'hai', 'hain', 'ho', 'tha', 'the', 'thi', 'hoga', 'hogi', 'hoge', 'bolo',
  'dikhaye', 'dikhao', 'dena', 'dekhna', 'dekhne', 'mil', 'sakta', 'sakte',
  'jana', 'jao', 'karenge', 'karoge', 'chalta', 'bhi', 'aur', 'se', 'ko', 'me', 'mein', 'liye'
]);

const CANONICAL_VOCABULARY = [
  'tally', 'prime', 'excel', 'accounting', 'accountant', 'income', 'tax', 'incometax',
  'gst', 'gstr', 'return', 'returns', 'filing', 'resume', 'whatsapp', 'contact',
  'contract', 'contracts', 'terms', 'timeline', 'turnaround',
  'projects', 'project', 'skills', 'skill', 'experience', 'services', 'service',
  'quotation', 'pricing', 'price', 'daltonganj', 'palamau', 'cursor', 'powerbi',
  'audit', 'compliance', 'biodata', 'matrimonial', 'marriage', 'consulting',
  'biometrics', 'voucher', 'reconciliation', 'availability', 'notice', 'freelance',
  'recruiter', 'client', 'overview', 'vibe', 'coding', 'antigravity', 'agent',
  'react', 'tailwind', 'python', 'vite', 'javascript', 'atul', 'verma'
];

const TECHNICAL_ALIASES = {
  brs: 'bank reconciliation statement brs tally',
  itc: 'input tax credit itc 2b reconciliation',
  itc2b: 'input tax credit itc 2b reconciliation',
  'itc-2b': 'input tax credit itc 2b reconciliation',
  gstr: 'gst return compliance gstr-1 gstr-3b gstr-9',
  gstr1: 'gstr-1 outward supplies return gst',
  gstr3b: 'gstr-3b monthly summary return gst',
  gstr9: 'gstr-9 annual tax return gst audit',
  tds: 'tax deducted at source tds e-tds 26q',
  tcs: 'tax collected at source tcs 27eq',
  pbi: 'power bi',
  powerbi: 'power bi',
  nulm: 'day-nulm',
  daynulm: 'day-nulm',
  rsby: 'rsby smart card biometric field operations',
  vba: 'ms excel vba macro automated pipelines',
  macro: 'ms excel vba macro automated pipelines',
  pnl: 'profit and loss balance sheet finalization',
  'p&l': 'profit and loss balance sheet finalization',
  itr: 'income tax e-filing itr-1 itr-4 tax planning',
  cv: 'resume cv download official verified pdf',
  biodata: 'matrimonial marriage personal family biodata',
  shadi: 'matrimonial marriage personal family biodata',
  vivah: 'matrimonial marriage personal family biodata',
  fee: 'quotation pricing fees charge cost estimate',
  fees: 'quotation pricing fees charge cost estimate',
  cost: 'quotation pricing fees charge cost estimate',
  price: 'quotation pricing fees charge cost estimate',
  pricing: 'quotation pricing fees charge cost estimate',
  charge: 'quotation pricing fees charge cost estimate',
  kharcha: 'quotation pricing fees charge cost estimate'
};

const HINDI_KEYWORD_MAP = {
  भूमिकाएं: 'roles profile', भूमिका: 'roles profile', प्रोफाइल: 'roles profile atul', परिचय: 'roles atul', अतुल: 'atul verma',
  बायोग्राफी: 'roles bio atul', प्रोजेक्ट्स: 'projects work', प्रोजेक्ट: 'projects work', 'केस स्टडी': 'case study projects',
  'केस स्टडीज': 'case studies projects', फ्लैगशिप: 'flagship projects', 'काम दिखाओ': 'projects case study',
  कौशल: 'skills tools stack', हुनर: 'skills technical competencies', तकनीकी: 'technical skills tools', तकनीक: 'tech stack skills',
  टूल्स: 'tools skills stack', टैली: 'tally prime erp', एक्सेल: 'excel vba macro', मैक्रो: 'macro excel vba',
  'पॉवर बीआई': 'power bi telemetry', 'पावर बीआई': 'power bi telemetry', 'स्मार्ट कार्ड': 'smart card operations',
  'मल्टी-एजेंट': 'multi-agent workflow', 'स्किल इंडिया': 'day-nulm', एनयूएलएम: 'day-nulm', प्राइम: 'prime erp',
  रिएक्ट: 'react 19 vite', पायथन: 'python scripts', अनुभव: 'experience career tenure',
  कार्यकाल: 'tenure experience career', 'कार्य इतिहास': 'work history experience', करियर: 'career experience jobs',
  नौकरी: 'job recruiter resume', काम: 'work projects', सेवाएं: 'services consulting advisory', सेवा: 'services consulting advisory',
  परामर्श: 'consulting services', कंसल्टेंसी: 'consultancy services', खर्च: 'quotation pricing fees cost', खर्चा: 'quotation pricing fees cost',
  कीमत: 'quotation pricing cost', शुल्क: 'quotation pricing fees', फीस: 'quotation fees pricing', कोटेशन: 'quotation fees pricing',
  दरें: 'rates pricing quotation', लागत: 'cost pricing estimate', आयकर: 'income tax itr', 'इनकम टैक्स': 'income tax itr',
  जीएसटी: 'gst return compliance itc', ऑडिट: 'audit compliance balance sheet', 'बैलेंस शीट': 'balance sheet audit',
  रिटर्न: 'return filing gst itr', उपलब्धियां: 'achievements metrics records', उपलब्धि: 'achievements metrics records',
  रिकॉर्ड्स: 'records achievements metrics', रिकॉर्ड: 'records achievements stats', आंकड़े: 'metrics stats records',
  रिज्यूमे: 'resume cv download', सीवी: 'resume cv download', डाउनलोड: 'download resume pdf', हायरिंग: 'hiring recruiter job',
  वेतन: 'salary ctc compensation', बायोडाटा: 'matrimonial marriage biodata', विवाह: 'matrimonial marriage biodata',
  शादी: 'matrimonial marriage biodata', पारिवारिक: 'family background parents', परिवार: 'family background parents',
  'माता-पिता': 'parents father mother family', 'पिता का नाम': 'father late niranjan prasad', पिता: 'father late niranjan prasad',
  कुंडली: 'kundali matrimonial biodata', गोत्र: 'gotra caste matrimonial biodata', संपर्क: 'contact whatsapp phone email',
  फोन: 'contact phone whatsapp call', व्हाट्सएप: 'whatsapp message contact', ईमेल: 'email contact mailto', पता: 'address location',
  स्थान: 'location address', कार्यालय: 'office location', कहाँ: 'location where', कहा: 'location where',
  स्थित: 'located location daltonganj', डाल्टनगंज: 'daltonganj location', पलामू: 'palamau location', झारखंड: 'jharkhand location',
  मेदिनीनगर: 'medininagar location', उपलब्धता: 'availability working hours notice', उपलब्ध: 'available availability immediate',
  समय: 'timing working hours availability', 'वर्किंग आवर्स': 'working hours timing', नेविगेशन: 'navigate scroll section',
  जाएं: 'navigate scroll jump', जाओ: 'navigate scroll jump', 'ले चलो': 'navigate scroll jump', अनुभाग: 'section jump scroll',
  सेक्शन: 'section jump scroll', मोड: 'mode switch filter track', ट्रैक: 'track switch filter role',
  बदलो: 'switch change toggle track', चालू: 'enable switch activate on', अकाउंटेंट: 'accountant role tax',
  सुझाव: 'suggestions help options menu', मदद: 'help assistance suggestions', सहायता: 'help assistance suggestions',
  गाइड: 'guide help suggestions', हेल्प: 'help assistance suggestions', पूछ: 'ask suggestions menu', पूछें: 'ask suggestions menu',
  विकल्प: 'options suggestions menu'
};

export function detectLanguage(text) {
  if (!text || typeof text !== 'string') return 'en';
  if (DEVANAGARI_REGEX.test(text)) return 'hi';

  const lower = text.toLowerCase();
  const tokens = lower.split(/[^a-z0-9]+/i).filter(Boolean);
  let hinglishCount = 0;

  for (const token of tokens) {
    if (HINGLISH_STOPWORDS.has(token)) {
      hinglishCount++;
    }
  }

  // If query contains 2+ Hinglish words or >20% Hinglish markers
  if (hinglishCount >= 2 || (tokens.length > 0 && hinglishCount / tokens.length >= 0.25)) {
    return 'hinglish';
  }

  return 'en';
}

export function levenshteinDistance(a, b) {
  if (!a || !b) return (a || b).length;
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 2) return Math.max(a.length, b.length);

  const m = a.length;
  const n = b.length;
  let prevRow = new Array(n + 1);
  let currRow = new Array(n + 1);

  for (let j = 0; j <= n; j++) prevRow[j] = j;

  for (let i = 1; i <= m; i++) {
    currRow[0] = i;
    const aChar = a.charCodeAt(i - 1);
    for (let j = 1; j <= n; j++) {
      const bChar = b.charCodeAt(j - 1);
      const cost = aChar === bChar ? 0 : 1;
      currRow[j] = Math.min(
      currRow[j - 1] + 1,
      prevRow[j] + 1,
      prevRow[j - 1] + cost
      );
    }
    const temp = prevRow;
    prevRow = currRow;
    currRow = temp;
  }

  return prevRow[n];
}

const COMMON_ENGLISH_WORDS = new Set([
  'tell', 'call', 'with', 'from', 'have', 'this', 'that', 'what', 'when', 'where',
  'which', 'who', 'how', 'your', 'work', 'more', 'some', 'than', 'them', 'then',
  'they', 'were', 'will', 'been', 'each', 'make', 'like', 'time', 'just', 'know',
  'take', 'into', 'year', 'good', 'could', 'look', 'only', 'come', 'over',
  'also', 'back', 'after', 'used', 'our', 'out', 'all', 'any', 'can', 'has', 'had',
  'not', 'for', 'and', 'the', 'about', 'role', 'roles', 'profile', 'profiles',
  'show', 'give', 'need', 'want', 'view', 'read', 'find', 'done', 'open', 'send',
  'contract', 'contracts', 'terms', 'timeline', 'turnaround', 'drive', 'prime', 'atul', 'verma',
  'file', 'files', 'filed', 'filing', 'live', 'line', 'list', 'past', 'post', 'rate', 'real',
  'site', 'size', 'stat', 'stay', 'team', 'test', 'text', 'user', 'went', 'wide', 'wire',
  'city', 'date', 'edit', 'fast', 'host', 'item', 'last', 'life', 'lite', 'mine', 'most', 'must'
]);

function repairTypo(word) {
  if (!word || word.length < 4 || word.length > 18) return word;
  const lower = word.toLowerCase();
  if (COMMON_ENGLISH_WORDS.has(lower) || HINGLISH_STOPWORDS.has(lower)) return lower;
  if (CANONICAL_VOCABULARY.includes(lower)) return lower;

  let bestMatch = lower;
  let minDistance = 3;

  for (const candidate of CANONICAL_VOCABULARY) {
    if (Math.abs(candidate.length - lower.length) > 2) continue;
    // For short words (<= 5 chars), require first letter to match to avoid cross-word false collisions
    if (lower.length <= 5 && candidate[0] !== lower[0]) continue;
    const dist = levenshteinDistance(lower, candidate);
    if (dist <= 2 && dist < minDistance) {
      minDistance = dist;
      bestMatch = candidate;
      if (dist === 1) break;
    }
  }

  return bestMatch;
}

export function normalizeQuery(query) {
  if (!query || typeof query !== 'string') {
    return { normalized: '', rawTokens: [], tokens: [], aliasesApplied: [], lang: 'en' };
  }

  const lang = detectLanguage(query);
  const aliasesApplied = [];
  let processed = query.trim().toLowerCase().replace(/[०-९]/g, (d) => String('०१२३४५६७८९'.indexOf(d))).replace(/--+/g, ' ');

  // 1. Expand Hindi Devanagari mappings (Length-Descending to Prevent Substring Truncation)
  if (lang === 'hi') {
    const sortedHindiKeys = Object.keys(HINDI_KEYWORD_MAP).sort((a, b) => b.length - a.length);
    for (const hindiWord of sortedHindiKeys) {
      if (processed.includes(hindiWord)) {
      processed = processed.replace(new RegExp(hindiWord, 'g'), ` ${HINDI_KEYWORD_MAP[hindiWord]} `);
      aliasesApplied.push(hindiWord);
      }
    }
  }

  // 2. Tokenize
  const rawTokens = processed.split(/[\s,?.!/:;()[\]{}'"#`~]+/).filter((t) => t.length > 0);
  const repairedTokens = [];

  for (const token of rawTokens) {
    // 3. Technical Alias Lookup (hardened against prototype property collision)
    if (Object.prototype.hasOwnProperty.call(TECHNICAL_ALIASES, token) && typeof TECHNICAL_ALIASES[token] === 'string') {
      const expansion = TECHNICAL_ALIASES[token];
      repairedTokens.push(...expansion.split(' '));
      aliasesApplied.push(token);
    } else {
      // 4. Typo Correction
      const repaired = repairTypo(token);
      repairedTokens.push(repaired);
    }
  }
  const tokens = Array.from(new Set(repairedTokens)).filter(
    (t) => t.length > 1 || t === 'ai' || t === 'bi' || t === '3b' || t === '2b' || /^[1-9]$/.test(t)
  );

  return {
    normalized: tokens.join(' '),
    rawTokens,
    tokens,
    aliasesApplied,
    lang
  };
}

// 3. LAYER A: 16 CORE INTENT CLASSIFICATION & ENTITY EXTRACTION

const makeBoundaryRegex = (patternStr) =>
  new RegExp(`(?<![\\p{L}\\p{N}\\p{M}])(?:${patternStr})(?![\\p{L}\\p{N}\\p{M}])`, 'iu');

const INTENT_PATTERNS = {
  faq: makeBoundaryRegex(
    'where are you located|located in india|office location|kaha rehte ho|headquartered|location kya hai|' +
    'कहाँ स्थित|कहाँ रहते|कहाँ का'
  ),
  navigation: makeBoundaryRegex(
    'navigate|navigate to|go to|scroll|scroll to|scroll down to|scroll karo|jump to|take me to|open section|le chalo|section|' +
    'ले चलो|सेक्शन खोलो|जाओ|जाएं|अनुभाग पर जाएं|अनुभाग खोलो|स्क्रॉल करो'
  ),
  filter_toggles: makeBoundaryRegex(
    'switch role|change track|switch track|track badal|role badal|track change|role change|track badlo|role badlo|' +
    'switch to corporate accountant view|switch to accountant|switch to mis|switch to vibe|switch to other|switch to overview|' +
    'recruiter mode|client mode|marriage mode|accountant mode|mis mode|vibe mode|mode on karo|filter lagao|' +
    'मोड बदलो|ट्रैक बदलो|चेंज रोल|मोड चालू|अकाउंटेंट मोड'
  ),
  marriage_bio: makeBoundaryRegex(
    'marriage|matrimonial|biodata|family|father|birth year|shadi|vivah|kundali|gotra|caste|parents|' +
    'शादी|विवाह|पारिवारिक|परिवार|माता-पिता|पिता का नाम|पिता|बायोडाटा|कुंडली|गोत्र'
  ),
  availability: makeBoundaryRegex(
    'available|availability|working hours|timings|timing|open for work|freelance available|when can you start|kab baat karein|office hours|immediate hire|immediate join|available for immediate hire|immediate join kar sakte ho|' +
    'उपलब्धता|उपलब्ध|समय|कब बात करें|वर्किंग आवर्स|काम के लिए उपलब्ध'
  ),
  recruiter_info: makeBoundaryRegex(
    'resume|cv|biodata download|download resume|hire|recruiter|notice period|job offer|full time|interview|salary|ctc|compensation|hiring|' +
    'रिज्यूमे|सीवी|हायरिंग|नौकरी|डाउनलोड करें|रिज्यूमे डाउनलोड'
  ),
  client_info: makeBoundaryRegex(
    'client|contract|sla|timeline|turnaround|delivery time|client work|terms|project cost|cost|pricing|price|quotation|quotation estimator|quote|how much|fee|fees|kharcha|kitna aayega|kitna kharch|kitna kharcha|estimator|freelance|' +
    'खर्च|खर्चा|कीमत|कोटेशन|शुल्क|दरें|फ्रीलांस|क्लाइंट|डिलीवरी|प्रोजेक्ट का कितना खर्च'
  ),
  services: makeBoundaryRegex(
    'services|service|offerings|consulting|consultation|advisory|tax filing karwana|kya services provide|work provided|app banwana|banwana|saas app|ek saas|mvp banwana|' +
    'सेवाएं|सेवा|कंसल्टेंसी|परामर्श'
  ),
  contact: makeBoundaryRegex(
    'contact|phone|email|whatsapp|call|address|location|reach out|office|kaise contact karein|sampark|' +
    'संपर्क|फोन|व्हाट्सएप|ईमेल|पता|नंबर|स्थान|कार्यालय'
  ),
  achievements: makeBoundaryRegex(
    'achievements|metrics|stats|records|50000|enrolled|500\\+|reconciled|awards|milestones|numbers|volume|' +
    'उपलब्धियां|उपलब्धि|रिकॉर्ड|रिकॉर्ड्स|आंकड़े|उपलब्धियों'
  ),
  experience: makeBoundaryRegex(
    'experience|work history|career|jobs|past companies|tenure|kahan kaam kiya|kitne saal ka experience|' +
    'अनुभव|करियर|कार्य इतिहास|कार्यकाल'
  ),
  skills: makeBoundaryRegex(
    'skills?|tech stack|tools|tally|excel|gst|react|python|cursor|powerbi|claude|agent loops|proficiencies|competencies|kya skills hai|' +
    'कौशल|टूल्स|तकनीक|तकनीकी|हुनर|स्टैक'
  ),
  projects: makeBoundaryRegex(
    'projects|case study|case studies|portfolio work|kaun se project|kya banaya hai|project 01|project 02|case study 08|featured projects|' +
    'प्रोजेक्ट्स|प्रोजेक्ट|केस स्टडी|काम दिखाओ|फ्लैगशिप प्रोजेक्ट्स|केस स्टडीज'
  ),
  roles: makeBoundaryRegex(
    'who is atul|who are you|about atul|tell me about yourself|roles|background|profiles|kaun hai atul|kya kaam karte ho|roles batao|core professional roles|' +
    'कौन है अतुल|प्रोफाइल|परिचय|भूमिकाएं|भूमिका|अतुल की भूमिकाएं'
  ),
  suggestions: makeBoundaryRegex(
    'help|what can you do|what can i ask|kya pooch sakte hain|menu|options|suggestions|guide|options dikhao|' +
    'madad|मदद|सुझाव|गाइड|हेल्प|पूछ सकता|पूछ सकते|क्या पूछ|पूछें|क्या सहायता|विकल्प'
  ),
  ambiguous: /^(hi|hello|hey|namaste|namaskar|ok|okay|test|greetings|good morning|good afternoon|good evening|hey there|नमस्ते|नमस्कार|हैलो|प्रणाम)$|^(?:kuch bhi|ulta seedha|asdfghjkl|random gibberish|कुछ भी अटपटा)(?:.*)?$/iu
};

export function classifyIntent(query, context = {}) {
  const { normalized, tokens, lang } = normalizeQuery(query);
  const lowerRaw = (query || '').trim().toLowerCase();
  const lowerNormalized = lowerRaw.replace(/[०-९]/g, (d) => String('०१२३४५६७८९'.indexOf(d)));
  const combinedText = `${lowerNormalized} ${normalized}`;

  const entities = {
    role: null,
    audience: null,
    section: null,
    projectId: null,
    serviceId: null,
    language: lang
  };

  // Multilingual Entity extraction: Role
  if (/(?<![\p{L}\p{N}\p{M}])(accountant|accounting|tax|gst|tally|अकाउंटेंट|टैक्स|लेखाकार)(?![\p{L}\p{N}\p{M}])/iu.test(combinedText)) entities.role = 'accountant';
  else if (/(?<![\p{L}\p{N}\p{M}])(mis|excel|data|nulm|macro|एमआईएस|एक्सेल|डेटा)(?![\p{L}\p{N}\p{M}])/iu.test(combinedText)) entities.role = 'mis';
  else if (/(?<![\p{L}\p{N}\p{M}])(vibe|vibe coding|ai|agent|prototype|saas|वाइब|एआई)(?![\p{L}\p{N}\p{M}])/iu.test(combinedText)) entities.role = 'vibe_coding';
  else if (/(?<![\p{L}\p{N}\p{M}])(controller|bi|governance|audit|other|ऑडिट|कंट्रोलर)(?![\p{L}\p{N}\p{M}])/iu.test(combinedText)) entities.role = 'other';
  else if (/(?<![\p{L}\p{N}\p{M}])(overview|polymath|all|ओवरव्यू|सभी|पॉलीमैथ)(?![\p{L}\p{N}\p{M}])/iu.test(combinedText)) entities.role = 'overview';

  // Multilingual Entity extraction: Audience
  if (/(?<![\p{L}\p{N}\p{M}])(recruiter|job|hiring|cv|resume|नौकरी|भर्ती|हायरिंग)(?![\p{L}\p{N}\p{M}])/iu.test(combinedText)) entities.audience = 'recruiter';
  else if (/(?<![\p{L}\p{N}\p{M}])(client|freelance|quote|pricing|cost|शुल्क|कोटेशन|क्लाइंट|फ्रीलांस)(?![\p{L}\p{N}\p{M}])/iu.test(combinedText)) entities.audience = 'client';
  else if (/(?<![\p{L}\p{N}\p{M}])(marriage|matrimonial|biodata|family|विवाह|शादी|बायोडाटा|परिवार)(?![\p{L}\p{N}\p{M}])/iu.test(combinedText)) entities.audience = 'marriage';

  // Entity extraction: Case Study ID
  const projMatch = lowerNormalized.match(/(?:(?:case\s*study|projects?|proj|cs|केस\s*स्टडी|प्रोजेक्ट)\s*#?\s*0?([1-9])(?!\d)|#\s*0?([1-9])(?!\d)|\b0([1-9])\b(?!\d))/iu);
  if (projMatch) {
    const digit = projMatch[1] || projMatch[2] || projMatch[3];
    if (digit) entities.projectId = digit.padStart(2, '0');
  }
  if (!entities.projectId) {
    entities.projectId = matchProjectKeyword(lowerNormalized);
  }

  // Multilingual Entity extraction: Section
  if (/(?<![\p{L}\p{N}\p{M}])(skills?|tech|stack|कौशल|टूल्स)(?![\p{L}\p{N}\p{M}])/iu.test(combinedText)) entities.section = 'skills';
  else if (/(?<![\p{L}\p{N}\p{M}])(projects?|work|case stud\w*|प्रोजेक्ट्स?|काम|केस स्टडी)(?![\p{L}\p{N}\p{M}])/iu.test(combinedText)) entities.section = 'projects';
  else if (/(?<![\p{L}\p{N}\p{M}])(experience|history|career|tenure|अनुभव|करियर|कार्य)(?![\p{L}\p{N}\p{M}])/iu.test(combinedText)) entities.section = 'experience';
  else if (/(?<![\p{L}\p{N}\p{M}])(contact|email|phone|whatsapp|संपर्क|व्हाट्सएप|फोन)(?![\p{L}\p{N}\p{M}])/iu.test(combinedText)) entities.section = 'contact';
  else if (/(?<![\p{L}\p{N}\p{M}])(faq|questions?|सामान्य प्रश्न)(?![\p{L}\p{N}\p{M}])/iu.test(combinedText)) entities.section = 'faq';
  else if (/(?<![\p{L}\p{N}\p{M}])(about|bio|background|बायोडाटा|परिचय)(?![\p{L}\p{N}\p{M}])/iu.test(combinedText)) entities.section = 'about';
  else if (/(?<![\p{L}\p{N}\p{M}])(achievements?|metrics?|records?|उपलब्धियां?|रिकॉर्ड्स?)(?![\p{L}\p{N}\p{M}])/iu.test(combinedText)) entities.section = 'achievements';

  const hasProjectContext = /(?<![\p{L}\p{N}\p{M}])(projects?|proj|case stud\w*|dossiers?|cs|काम|प्रोजेक्ट्स?|केस स्टडी|#\s*0?[1-9])(?![\p{L}\p{N}\p{M}])/iu.test(combinedText);
  if (entities.projectId && hasProjectContext) {
    return { intent: 'projects', confidence: 0.95, entities };
  }

  // 1. Check exact ambiguous greetings first
  if (INTENT_PATTERNS.ambiguous.test(lowerRaw)) {
    return { intent: 'ambiguous', confidence: 0.95, entities };
  }

  // 2. Check prioritized intent patterns
  const intentPrecedence = [
    'faq',
    'navigation',
    'filter_toggles',
    'marriage_bio',
    'roles',
    'availability',
    'services',
    'recruiter_info',
    'client_info',
    'contact',
    'achievements',
    'experience',
    'skills',
    'projects',
    'suggestions'
  ];

  for (const intentName of intentPrecedence) {
    const regex = INTENT_PATTERNS[intentName];
    if (regex && (regex.test(lowerRaw) || regex.test(normalized))) {
      return { intent: intentName, confidence: 0.90, entities };
    }
  }

  // 3. Token-based secondary heuristic
  if (tokens.some((t) => ['available', 'availability', 'timing', 'timings'].includes(t))) {
    return { intent: 'availability', confidence: 0.85, entities };
  }
  if (tokens.some((t) => ['resume', 'cv', 'hire', 'notice'].includes(t))) {
    return { intent: 'recruiter_info', confidence: 0.85, entities };
  }
  if (tokens.some((t) => ['price', 'pricing', 'cost', 'quotation', 'fees'].includes(t))) {
    return { intent: 'client_info', confidence: 0.85, entities };
  }
  if (tokens.some((t) => ['services', 'service', 'consulting', 'advisory'].includes(t))) {
    return { intent: 'services', confidence: 0.85, entities };
  }
  if (tokens.some((t) => ['marriage', 'biodata', 'father', 'vivah', 'shadi'].includes(t))) {
    return { intent: 'marriage_bio', confidence: 0.85, entities };
  }
  if (tokens.some((t) => ['whatsapp', 'email', 'phone', 'contact', 'call'].includes(t))) {
    return { intent: 'contact', confidence: 0.85, entities };
  }
  if (tokens.some((t) => ['tally', 'excel', 'gst', 'python', 'react', 'skill', 'skills', 'tools', 'claude', 'agent'].includes(t))) {
    return { intent: 'skills', confidence: 0.80, entities };
  }
  if (tokens.some((t) => ['project', 'projects', 'study', 'case'].includes(t))) {
    return { intent: 'projects', confidence: 0.80, entities };
  }

  // 4. Default fallback if query is unrecognizable
  if (tokens.length === 0) {
    return { intent: 'ambiguous', confidence: 0.50, entities };
  }

  return { intent: 'fallback', confidence: 0.30, entities };
}

// 4. LAYER F: AUTHORITATIVE FAQ MATCHER

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchDistinctToken(text, token) {
  if (!text || !token) return false;
  const escaped = escapeRegExp(token);
  const regex = new RegExp(`(?<![\\p{L}\\p{N}\\p{M}])${escaped}(?![\\p{L}\\p{N}\\p{M}])`, 'iu');
  return regex.test(text);
}

function scoreFaqMatch(queryTokens, queryRaw, faq) {
  const qEn = (faq.question || '').toLowerCase();
  const qHi = (faq.question_hi || '').toLowerCase();
  const lowerRaw = queryRaw.toLowerCase().trim();
  if (lowerRaw === qEn || lowerRaw === qHi) return 100;
  if (lowerRaw.length >= 25 && (qEn.includes(lowerRaw) || qHi.includes(lowerRaw))) return 92;
  if (Array.isArray(faq.aliases)) {
    for (const alias of faq.aliases) {
      const aLower = alias.toLowerCase().trim();
      if (lowerRaw === aLower || (lowerRaw.length >= 20 && (aLower.includes(lowerRaw) || lowerRaw.includes(aLower)))) return 100;
    }
  }

  const validTokens = queryTokens.filter((t) => t.length >= 3);
  if (validTokens.length < 2) return 0;

  let questionHits = 0;
  let answerHits = 0;
  let tagHits = 0;

  const aEn = (faq.answer || '').toLowerCase();
  const aHi = (faq.answer_hi || '').toLowerCase();
  const tagEn = (faq.categoryTag || '').toLowerCase();
  const tagHi = (faq.categoryTag_hi || '').toLowerCase();

  for (const token of validTokens) {
    if (matchDistinctToken(qEn, token) || matchDistinctToken(qHi, token)) questionHits++;
    if (matchDistinctToken(aEn, token) || matchDistinctToken(aHi, token)) answerHits++;
    if (matchDistinctToken(tagEn, token) || matchDistinctToken(tagHi, token)) tagHits++;
  }

  if (questionHits < 2) return 0;
  const qRatio = questionHits / validTokens.length;
  if (qRatio < 0.50) return 0;

  const aRatio = answerHits / validTokens.length;
  const tagRatio = tagHits / validTokens.length;

  const compositeScore = (qRatio * 60) + (aRatio * 25) + (tagRatio * 15);
  return Math.min(100, Math.round(compositeScore));
}

export function matchAuthoritativeFAQ(query, context = {}) {
  const { tokens } = normalizeQuery(query);
  if (!tokens || tokens.length === 0) return null;

  let bestFaq = null;
  let maxScore = 0;

  for (const faq of FAQ_ITEMS) {
    const score = scoreFaqMatch(tokens, query, faq);

    // Apply active role / audience subtle boost
    let contextualScore = score;
    if (context.role && faq.role && (faq.role.includes(context.role) || faq.role.includes('all'))) {
      contextualScore += 5;
    }
    if (context.audience && faq.audience && (faq.audience.includes(context.audience) || faq.audience.includes('all'))) {
      contextualScore += 5;
    }

    if (contextualScore > maxScore) {
      maxScore = contextualScore;
      bestFaq = faq;
    }
  }

  if (maxScore >= 75 && bestFaq) {
    return { faq: bestFaq, score: maxScore };
  }

  return null;
}

// 5. LAYER C, D, E: WEIGHTED SEARCH INDEX & 4-PHASE DYNAMIC RELAXATION

function buildCompositeCorpus() {
  const corpus = SEARCH_ITEMS.map((item) => ({
    ...item,
    title_hi: item.title_hi || item.title,
    description_hi: item.description_hi || item.description,
    role: item.role || 'both',
    audience: item.audience || ['all'],
    keywords: item.keywords || '',
    type: 'catalog_item'
  }));

  // 2. Add 9 Flagship Case Studies
  for (const cs of CASE_STUDIES) {
    corpus.push({
      id: `case-study-${cs.id}`,
      caseStudyId: cs.id,
      title: cs.title,
      title_hi: cs.title_hi,
      category: 'Projects',
      role: cs.role,
      audience: ['recruiter', 'client', 'all'],
      targetId: cs.targetId,
      actionType: 'open-case-study',
      badge: cs.trackBadge,
      description: cs.summary,
      description_hi: cs.summary_hi,
      keywords: `${cs.techStack?.join(' ')} ${cs.category} case study ${cs.subtitle}`,
      type: 'case_study'
    });
  }

  return corpus;
}

const GLOBAL_SEARCH_CORPUS = buildCompositeCorpus();

function scoreItem(item, queryLower, tokens, context = {}) {
  let score = 0;

  const titleEn = (item.title || '').toLowerCase();
  const titleHi = (item.title_hi || '').toLowerCase();
  const descEn = (item.description || '').toLowerCase();
  const descHi = (item.description_hi || '').toLowerCase();
  const keywords = (item.keywords || '').toLowerCase();
  const category = (item.category || '').toLowerCase();

  // 1. Exact phrase boost (+50)
  if (titleEn.includes(queryLower) || titleHi.includes(queryLower)) {
    score += 60;
    score += 50;
  } else if (keywords.includes(queryLower)) {
    score += 40;
    score += 50;
  } else if (descEn.includes(queryLower) || descHi.includes(queryLower)) {
    score += 10;
    score += 25;
  }

  const GENERIC_CATEGORY_TOKENS = new Set(['case', 'study', 'project', 'projects', 'item', 'items', 'work']);
  const substantiveTokens = tokens.filter((t) => !GENERIC_CATEGORY_TOKENS.has(t));
  let substantiveMatches = 0;

  // 2. Token match scoring with word-boundary safety
  for (const token of tokens) {
    if (token.length < 2) continue;
    let matched = false;

    if (matchDistinctToken(titleEn, token) || matchDistinctToken(titleHi, token)) {
      score += 20;
      matched = true;
    }
    if (matchDistinctToken(keywords, token)) {
      score += 15;
      matched = true;
    }
    if (matchDistinctToken(descEn, token) || matchDistinctToken(descHi, token)) {
      score += 8;
      matched = true;
    }
    if (category.toLowerCase() === token.toLowerCase()) {
      score += 25;
      matched = true;
    }

    // Prefix match (len >= 3)
    if (token.length >= 3 && (titleEn.startsWith(token) || keywords.includes(` ${token}`))) {
      score += 10;
      matched = true;
    }

    if (matched && !GENERIC_CATEGORY_TOKENS.has(token)) {
      substantiveMatches++;
    }
  }
  if (substantiveTokens.length > 0 && substantiveMatches === 0) {
    return 0;
  }

  // 3. Context Alignment Boost (only if query content matched!)
  if (score > 0) {
    const activeRole = context.role || 'overview';
    const activeAudience = context.audience || 'all';

    if (activeRole !== 'overview' && (item.role === activeRole || item.role === 'both' || item.role === 'all')) {
      score += 25;
    }
    if (activeAudience !== 'all' && (item.audience.includes(activeAudience) || item.audience.includes('all'))) {
      score += 20;
    }
  } else {
    return 0;
  }

  // 4. Category Multiplier
  let multiplier = 1.0;
  if (item.category === 'Actions' && /\b(download|contact|call|email|resume|open)\b/i.test(queryLower)) {
    multiplier = 1.30;
  } else if (item.category === 'Projects' && /\b(project|projects|case study|work)\b/i.test(queryLower)) {
    multiplier = 1.25;
  } else if (item.category === 'Skills' && /\b(skills?|tools?|stack|proficien)\b/i.test(queryLower)) {
    multiplier = 1.20;
  }

  return Math.round(score * multiplier);
}

function matchesFilters(item, role, audience, ignoreRole = false, ignoreAudience = false) {
  const rolePass = ignoreRole
    || !role
    || role === 'overview'
    || item.role === 'both'
    || item.role === 'all'
    || item.role === role;

  const audiencePass = ignoreAudience
    || !audience
    || audience === 'all'
    || !item.audience
    || item.audience.includes('all')
    || item.audience.includes(audience);

  return rolePass && audiencePass;
}

export function searchPortfolioIndex(query, context = {}) {
  const { normalized, tokens } = normalizeQuery(query);
  const queryLower = (query || '').toLowerCase().trim();

  if (!queryLower && tokens.length === 0) {
    return { results: [], relaxed: false, relaxationLevel: 'none' };
  }

  const activeRole = context.role || 'overview';
  const activeAudience = context.audience || 'all';
  const runSearch = (ignoreRole, ignoreAudience) => {
    const scored = [];
    for (const item of GLOBAL_SEARCH_CORPUS) {
      if (matchesFilters(item, activeRole, activeAudience, ignoreRole, ignoreAudience)) {
      const score = scoreItem(item, queryLower, tokens, context);
      if (score > 15) {
      scored.push({ item, score });
      }
      }
    }
    return scored.sort((a, b) => b.score - a.score);
  };

  // Phase 1: Strict Match
  let results = runSearch(false, false);
  if (results.length > 0) {
    return { results: results.slice(0, 5), relaxed: false, relaxationLevel: 'phase_1_strict' };
  }

  // Phase 2: Relax Role Filter
  if (activeRole !== 'overview') {
    results = runSearch(true, false);
    if (results.length > 0) {
      return { results: results.slice(0, 5), relaxed: true, relaxationLevel: 'phase_2_relax_role' };
    }
  }

  // Phase 3: Relax Audience Filter (Global search)
  results = runSearch(true, true);
  if (results.length > 0) {
    return { results: results.slice(0, 5), relaxed: true, relaxationLevel: 'phase_3_relax_audience' };
  }

  // Phase 4: Zero matches -> Fallback
  return { results: [], relaxed: true, relaxationLevel: 'phase_4_fallback' };
}

// 6. RESPONSE SYNTHESIS & LAYER G / H ACTION TRIGGERS



const ROLE_FLAGSHIP_PROJECTS = {
  accountant: [{ id: '01', n: 'GST Engine', hi: 'GST इंजन' }, { id: '02', n: 'Tally Prime', hi: 'टैली प्राइम' }, { id: '06', n: 'Corporate Audit', hi: 'कॉर्पोरेट ऑडिट' }],
  mis: [{ id: '03', n: 'DAY-NULM', hi: 'DAY-NULM' }, { id: '04', n: 'Smart Card', hi: 'स्मार्ट कार्ड' }, { id: '05', n: 'Power BI', hi: 'पावर बीआई' }],
  vibe_coding: [{ id: '07', n: 'AI SaaS', hi: 'AI SaaS' }, { id: '08', n: 'Multi-Agent', hi: 'मल्टी-एजेंट' }, { id: '09', n: 'Synthesizer', hi: 'सिंथेसाइज़र' }],
  other: [{ id: '05', n: 'Power BI', hi: 'पावर बीआई' }, { id: '06', n: 'Corporate Audit', hi: 'कॉर्पोरेट ऑडिट' }, { id: '01', n: 'GST Engine', hi: 'GST इंजन' }],
  overview: [{ id: '01', n: 'GST Engine', hi: 'GST इंजन' }, { id: '03', n: 'DAY-NULM', hi: 'DAY-NULM' }, { id: '07', n: 'AI SaaS', hi: 'AI SaaS' }]
};

function createActionButtons(intent, entities, context, lang, searchResults = [], query = '') {
  const actions = [];
  const activeRole = entities.role || context.role || 'overview';
  const resumeCfg = getResumeConfig(activeRole);
  const isHi = lang === 'hi';
  const add = (type, label, label_hi, target, payload) => {
    actions.push({ type, label: isHi ? label_hi : label, label_hi, ...(target ? { target } : {}), ...(payload ? { payload } : {}) });
  };

  switch (intent) {
    case 'recruiter_info':
      add('download-resume', '📄 Download Verified Resume (PDF)', '📄 आधिकारिक रिज्यूमे डाउनलोड करें', resumeCfg.fileName, { role: activeRole, fileName: resumeCfg.fileName });
      add('scroll', '💼 View Career History', '💼 करियर इतिहास देखें', '#experience', { selector: '#experience' });
      break;
    case 'projects':
      if (entities.projectId) {
        add('open-case-study', `🔍 Inspect Case Study #${entities.projectId}`, `🔍 केस स्टडी #${entities.projectId} खोलें`, entities.projectId, { id: entities.projectId });
        add('scroll', '🚀 Browse All 9 Projects', '🚀 सभी 9 प्रोजेक्ट्स देखें', '#projects', { selector: '#projects' });
      } else {
        const topProjects = ROLE_FLAGSHIP_PROJECTS[activeRole] || ROLE_FLAGSHIP_PROJECTS.overview;
        for (const p of topProjects) {
          add('open-case-study', `🔍 Case Study #${p.id} (${p.n})`, `🔍 केस स्टडी #${p.id} (${p.hi || p.n})`, p.id, { id: p.id });
        }
        add('scroll', '🚀 Browse All 9 Projects', '🚀 सभी 9 प्रोजेक्ट्स देखें', '#projects', { selector: '#projects' });
      }
      break;
    case 'services':
    case 'client_info':
      add('switch-contact-tab', '💰 View Fee Estimator', '💰 कोटेशन व शुल्क देखें', 'quote', { tab: 'quote' });
      add('open-estimator', '⚡ Open Quotation Calculator', '⚡ शुल्क कैलकुलेटर खोलें', undefined, { track: activeRole === 'vibe_coding' ? 'ai_web' : activeRole });
      break;
    case 'faq':
      add('scroll', '📍 View Location & Contact', '📍 स्थान व संपर्क देखें', '#contact', { selector: '#contact' });
      add('link', '💬 WhatsApp Direct Chat', '💬 व्हाट्सएप पर संपर्क करें', CONTACT_INFO.whatsappUrl, { url: CONTACT_INFO.whatsappUrl });
      break;
    case 'skills': {
      const matchedSkill = findMatchedSkill(query, searchResults);
      if (matchedSkill?.relatedCaseStudy) {
        add('open-case-study', isHi ? `🔍 केस स्टडी #${matchedSkill.relatedCaseStudy} खोलें` : `🔍 Inspect Case Study #${matchedSkill.relatedCaseStudy}`, `🔍 केस स्टडी #${matchedSkill.relatedCaseStudy} खोलें`, matchedSkill.relatedCaseStudy, { id: matchedSkill.relatedCaseStudy });
      }
      add('scroll', '⚡ View Skills Matrix', '⚡ कौशल अनुभाग देखें', '#skills', { selector: '#skills' });
      add('download-resume', '📄 Download Verified Resume (PDF)', '📄 आधिकारिक रिज्यूमे डाउनलोड करें', resumeCfg.fileName, { role: activeRole, fileName: resumeCfg.fileName });
      break;
    }
    case 'experience':
      add('scroll', '💼 Explore Experience Timeline', '💼 करियर टाइमलाइन देखें', '#experience', { selector: '#experience' });
      break;
    case 'contact':
      add('link', '💬 WhatsApp Direct Chat', '💬 व्हाट्सएप पर बात करें', CONTACT_INFO.whatsappUrl, { url: CONTACT_INFO.whatsappUrl });
      add('scroll', '✉️ Open Contact Form', '✉️ संपर्क फॉर्म खोलें', '#contact', { selector: '#contact' });
      break;
    case 'marriage_bio':
      add('scroll', '❤️ View Personal Bio-Data', '❤️ पारिवारिक विवरण देखें', '#about', { selector: '#about' });
      add('link', '💬 WhatsApp Family Connect', '💬 व्हाट्सएप पर संपर्क करें', CONTACT_INFO.whatsappUrl, { url: CONTACT_INFO.whatsappUrl });
      break;
    case 'achievements':
      add('scroll', '🏆 View Verified Metrics', '🏆 सत्यापित उपलब्धियां देखें', '#achievements', { selector: '#achievements' });
      break;
    case 'fallback':
      add('link', '💬 Ask on WhatsApp', '💬 व्हाट्सएप पर पूछें', CONTACT_INFO.whatsappUrl, { url: CONTACT_INFO.whatsappUrl });
      add('download-resume', '📄 View Verified Resume', '📄 रिज्यूमे डाउनलोड करें', resumeCfg.fileName, { role: activeRole, fileName: resumeCfg.fileName });
      add('scroll', '🔍 Browse All Sections', '🔍 सभी अनुभाग देखें', '#hero', { selector: '#hero' });
      break;
    default:
      add('scroll', '🔍 Explore Portfolio', '🔍 पोर्टफोलियो देखें', '#about', { selector: '#about' });
      break;
  }

  return actions;
}

function buildIntentText(intent, entities, context, lang, searchResults = [], query = '') {
  const activeRole = entities.role || context.role || 'overview';
  const profile = ROLE_PROFILES[activeRole] || ROLE_PROFILES.overview;
  const isHi = lang === 'hi';
  const isHinglish = lang === 'hinglish';

  const pricingBody = '• **Accounting & Statutory Tax**: Base ₹4,500 – ₹8,000 (GST, ITR, BRS, audit dossier)\n• **MIS & Data Operations**: Base ₹5,000 – ₹9,000 (Excel VBA macros, portals, ETL)\n• **AI & Web Engineering**: Base ₹22,000 – ₹35,000 (Next.js SaaS MVP, multi-agent workflows)';
  const srvBody = pricingBody;
  const clientBody = pricingBody;
  const recBody = '• **Availability**: Immediate (0 to 15 days notice period)\n• **Work Modes**: 100% remote readiness (1 Gbps fiber + UPS) or onsite relocation to tech hubs\n• **Resume / CV**: Official role-specific verified PDF resume dossier available below for instant hire download';
  const expBody = '• **Senior Accountant & Tax Consultant** (2018–Present): 500+ returns, ₹2.5Cr+ ITC, zero notices\n• **MIS Executive** — DAY-NULM Skill India (2016–2018): Multi-district portal reporting\n• **Smart Card Operations Lead** (2012–2016): 50,000+ biometric enrollments across 12+ districts\n• **AI Vibe Coder & Systems Engineer** (2024–Present): Autonomous multi-agent pipelines';
  const achBody = '• **500+** Statutory returns e-filed (100% on-time compliance rate)\n• **₹2.5Cr+** Reconciled eligible Input Tax Credit (ITC)\n• **0%** Scrutiny notices or penalty assessments across 7+ years\n• **50,000+** Biometric registrations across 12+ districts\n• **9** Comprehensive production flagship case studies';
  const availBody = '• **Working Hours & Timings**: Monday – Saturday, 10:00 AM – 7:00 PM IST (वर्किंग समय)\n• **Available for Immediate Hire**: 0 to 15 days notice period\n• **Remote Station**: Dual-redundant 1 Gbps broadband with industrial UPS power backup';
  const contactBody = `• **WhatsApp**: [+91 7992383804](${CONTACT_INFO.whatsappUrl})\n• **Email**: [${CONTACT_INFO.email}](${CONTACT_INFO.mailtoUrl})\n• **Phone**: +91 7992383804\n• **Location / Office**: Daltonganj, Palamau, Jharkhand - 822101`;
  const bioBody = '• **Full Name**: Atul Verma (अतुल वर्मा)\n• **Father\'s Name**: Late Niranjan Prasad (स्व. निरंजन प्रसाद)\n• **Year of Birth**: 1991\n• **Marital Status**: Indian • Single (Unmarried)\n• **Profession**: Senior Accountant, Tax Consultant & MIS Lead\n• **Location / मूल निवास**: Daltonganj (Medininagar), Palamau District, Jharkhand - 822101';
  const faqBody = '• **Location / स्थान**: Daltonganj (Medininagar), Palamau District, Jharkhand - 822101, India (डाल्टनगंज, पलामू, झारखंड)\n• **Operation**: Pan-India remote consulting with primary presence across Jharkhand & Bihar (100% remote ready / onsite relocation)\n• **Timings**: Monday to Saturday, 10:00 AM – 7:00 PM IST';
  const sugBody = '• **Resume**: Download verified role-specific resume PDFs\n• **Case Studies / Projects**: Inspect 9 production case studies with live telemetry\n• **Tech Stack / Skills**: Tally, Excel macros, React, Python, Power BI skills\n• **Pricing / Quotation**: Transparent fee quotations\n• **Contact / Help**: Connect directly via WhatsApp (+91 7992383804) or email';

  switch (intent) {
    case 'roles':
      if (isHi) return `👨‍💼 **अतुल वर्मा — ${profile.title_hi || profile.title}**\n\n${profile.summary_hi || profile.summary}\n\n• **भूमिका**: सीनियर अकाउंटेंट एवं टैक्स कंसल्टेंट, MIS स्पेशलिस्ट, AI Vibe Coder।\n• **प्रोफाइल**: सक्रिय ट्रैक ${activeRole.toUpperCase()}`;
      if (isHinglish) return `👨‍💼 **Atul Verma — ${profile.title}**\n\n${profile.summary}\n\n• **Core Roles & Kaam**: Accounting & Statutory Tax, MIS Data Operations, AI Vibe Coding.\n• **Active Mode**: ${activeRole.toUpperCase()}`;
      return `👨‍💼 **Atul Verma — ${profile.title}**\n\n${profile.summary}\n\n• **Core Specializations**: Multi-Track Polymath & Specialist (Statutory Tax & Tally, Government MIS, AI Vibe Coding & SaaS Prototyping, Corporate Controller).\n• **Active Track**: ${activeRole.toUpperCase()}`;

    case 'projects': {
      if (entities.projectId) {
        const cs = CASE_STUDIES.find((c) => c.id === entities.projectId);
        if (cs) {
          const m = cs.metrics?.map((x) => `**${x.val}** ${isHi ? (x.label_hi || x.label) : x.label}`).join(' • ') || '';
          const t = isHi ? (cs.title_hi || cs.title) : cs.title;
          const cat = isHi ? (cs.category_hi || cs.category) : (cs.trackBadge || cs.category);
          const s = isHi ? (cs.summary_hi || cs.summary) : cs.summary;
          const cta = isHi ? 'विस्तृत 5-स्टेज केस स्टडी देखने के लिए नीचे दिए बटन पर क्लिक करें।' : (isHinglish ? 'Full 5-stage case study aur live simulation open karne ke liye niche click karein!' : 'Click below to open the complete 5-stage case study drawer with live telemetry simulation.');
          return `🚀 **${isHi ? 'केस स्टडी' : 'Case Study'} #${cs.id}: ${t}**\n\n• **${isHi ? 'श्रेणी' : (isHinglish ? 'Category' : 'Track')}**: ${cat}\n• **${isHi ? 'सार' : 'Summary'}**: ${s}\n` + (m ? `• **${isHi ? 'सत्यापित मेट्रिक्स' : (isHinglish ? 'Key Metrics' : 'Verified Metrics')}**: ${m}\n` : '') + `• **${isHi ? 'तकनीकी स्टैक' : 'Tech Stack'}**: ${cs.techStack?.join(', ')}\n\n${cta}`;
        }
      }
      if (isHi) return '🚀 **अतुल वर्मा के प्रमुख फ्लैगशिप प्रोजेक्ट्स (9 केस स्टडीज):**\n\n1. **#01**: GST एवं Income Tax वैधानिक अनुपालन व सत्यापन इंजन\n2. **#02**: Tally Prime वित्तीय लेखांकन एवं इन्वेंटरी प्रबंधन\n3. **#03**: DAY-NULM स्किल इंडिया सरकारी MIS पोर्टल\n4. **#07**: AI Prompt-to-Fullstack SaaS प्रोटोटाइपिंग जनरेटर\n5. **#08**: स्वायत्त मल्टी-एजेंट LLM वर्कफ़्लो इंजन\n\nविस्तृत विश्लेषण के लिए किसी भी प्रोजेक्ट पर क्लिक करें।';
      if (isHinglish) return '🚀 **Atul Verma ke Top Featured Flagship Projects (9 Case Studies):**\n\n1. **#01**: GST & Income Tax Verification Engine (500+ Returns, ₹2.5Cr+ ITC)\n2. **#02**: Tally Prime Multi-Company Inventory & BRS\n3. **#03**: DAY-NULM Skill India Government MIS Portal\n4. **#07**: AI Prompt-to-Fullstack SaaS Generator\n5. **#08**: Autonomous Multi-Agent LLM Workflow Engine\n\nKisi bhi project ko detail me dekhne ke liye niche click karein.';
      return '🚀 **Featured Flagship Case Studies (9 Dossiers):**\n\n1. **#01**: GST & Income Tax Verification Engine (500+ returns, ₹2.5Cr+ ITC)\n2. **#02**: Tally Financial Accounting & Inventory Management\n3. **#03**: DAY-NULM Skill India MIS Reporting Portal\n4. **#07**: AI Prompt-to-Fullstack SaaS Generator\n5. **#08**: Autonomous Multi-Agent LLM Workflow Engine\n\nClick any project button below to inspect the full case study.';
    }

    case 'skills': {
      const matched = findMatchedSkill(query, searchResults);
      if (matched) {
        const pts = ((isHi && matched.points_hi) ? matched.points_hi : matched.points)?.map((p) => `  - ${p}`).join('\n') || '';
        const title = isHi ? (matched.title_hi || matched.title) : matched.title;
        const cat = isHi ? (matched.category_hi || matched.category) : matched.category;
        const tag = isHi ? (matched.tag_hi || matched.tag) : matched.tag;
        const related = matched.relatedCaseStudy ? (isHi ? `\n\n📌 **संबंधित फ्लैगशिप केस स्टडी**: #${matched.relatedCaseStudy}` : `\n\n📌 **Related Flagship Project**: Case Study #${matched.relatedCaseStudy}`) : '';
        return `⚡ **${title} (${matched.level} ${isHi ? 'प्रमाणित कौशल व स्टैक' : 'Verified Skills & Tech Stack'})` + `**\n\n• **${isHi ? 'श्रेणी' : 'Category'}**: ${cat}\n• **${isHi ? 'विशेषज्ञता' : 'Focus Area'}**: ${tag}\n• **${isHi ? 'मुख्य क्षमताएं' : 'Key Core Capabilities'}**:\n${pts}${related}\n\n${isHi ? 'सभी 37 प्रमाणित दक्षताओं और टूल्स को देखने के लिए नीचे स्क्रॉल करें।' : 'Scroll to the Skills section below to explore all 37 indexed competencies and tools.'}`;
      }
      if (isHi) return '⚡ **प्रमाणित तकनीकी कौशल एवं क्षमताएं:**\n\n• **अकाउंटिंग एवं टैक्स**: Tally Prime (98%), GST & ITR E-Filing (96%), BRS Reconciliations (95%), 26AS/AIS (94%)\n• **डेटा एवं MIS**: Advanced MS Excel & VBA Macros (95%), DAY-NULM Portal (98%), Power BI (90%)\n• **AI एवं वेब**: Cursor, Antigravity SDK, Claude Code, React 19, Vite, Tailwind CSS v4\n\nसभी 37 प्रमाणित दक्षताओं और टूल्स को देखने के लिए नीचे स्क्रॉल करें।';
      if (isHinglish) return '⚡ **Verified Skills & Tech Stack:**\n\n• **Accounting & Tax**: Tally Prime (98%), GST Return Filing (96%), ITR (95%), BRS Reconciliations (95%)\n• **MIS & Data**: Advanced Excel & VBA Macros (95%), DAY-NULM Portal (98%), Power BI (90%)\n• **AI & Vibe Coding**: Cursor, Antigravity SDK, Claude Code, React 19, Vite, Tailwind CSS v4\n\nDetailed skills dekhne ke liye Skills section par scroll karein.';
      return '⚡ **Core Skills & Technical Proficiencies:**\n\n• **Accounting & Tax**: Tally Prime ERP (98%), GST E-Filing (96%), Income Tax ITR (95%), BRS Reconciliation (95%), 26AS/AIS (94%)\n• **MIS & Analytics**: Advanced MS Excel & VBA Macros (95%), DAY-NULM Portal (98%), Power BI Dashboards (90%)\n• **AI Vibe Coding**: Antigravity SDK, Claude Code, Cursor, React 19, Vite, Tailwind CSS v4\n\nScroll to the Skills section below to explore all 37 indexed competencies and tools.';
    }

    case 'experience':
      return (isHi ? '💼 **कार्य अनुभव एवं करियर इतिहास (10+ वर्ष):**\n\n' : (isHinglish ? '💼 **Career Experience & Tenure (10+ Saal):**\n\n' : '💼 **Career Experience & Proven Track Record (10+ Years):**\n\n')) + expBody + (isHi || isHinglish ? '' : '\n\nExplore the tenure and career timeline below.');

    case 'services':
      return (isHi ? '💰 **सेवाएं, कंसल्टेंसी एवं परामर्श शुल्क:**\n\n' : (isHinglish ? '💰 **Services, Offerings & Consulting Rates:**\n\n' : '💰 **Consulting Services, Offerings & Advisory:**\n\n')) + srvBody;

    case 'client_info':
      return isHi
        ? '💰 **प्रोजेक्ट लागत, शुल्क, कीमत एवं कोटेशन (खर्च):**\n\n' + clientBody + '\n\nसटीक कोटेशन व लागत अनुमान हेतु कैलकुलेटर बटन का उपयोग करें।'
        : (isHinglish
          ? '💰 **Project Cost, Pricing, Kharcha & Quotation Estimator:**\n\n' + clientBody + '\n\nCustom quote aur pricing estimate calculate karne ke liye niche click karein!'
          : '💰 **Project Cost, Pricing, Fee Rates & Quotation Estimates:**\n\n' + clientBody + '\n\nClick below to open the interactive quotation estimator for a customized price breakdown.');

    case 'recruiter_info':
      return (isHi ? '📄 **रिक्रूटर एवं हायरिंग सूचना (रिज्यूमे डाउनलोड करें):**\n\n' : (isHinglish ? '📄 **Recruiter & Job Information (Download Resume / CV):**\n\n' : '📄 **Recruiter & Employment Information (Download Verified Resume PDF):**\n\n')) + recBody;

    case 'marriage_bio':
      return (isHi ? '❤️ **व्यक्तिगत एवं पारिवारिक विवरण (वैवाहिक बायोडाटा):**\n\n' : (isHinglish ? '❤️ **Personal & Family Background (Shaadi Biodata):**\n\n' : '❤️ **Personal & Matrimonial Bio-Data Demographics (Family Background):**\n\n')) + bioBody;

    case 'contact':
      return (isHi ? '📬 **सीधा संपर्क एवं परामर्श:**\n\n' : (isHinglish ? '📬 **Direct Contact & Sampark:**\n\n' : '📬 **Direct Contact & Consultation:**\n\n')) + contactBody;

    case 'availability':
      return (isHi ? '🕒 **कार्य उपलब्धता, वर्किंग समय एवं तत्काल नोटिस:**\n\n' : (isHinglish ? '🕒 **Working Hours & Immediate Availability:**\n\n' : '🕒 **Consultation Availability, Working Hours & Immediate Notice:**\n\n')) + availBody;

    case 'achievements':
      return (isHi ? '🏆 **सत्यापित उपलब्धियां, आंकड़े एवं रिकॉर्ड:**\n\n' : (isHinglish ? '🏆 **Key Achievements, Metrics & Records:**\n\n' : '🏆 **Verified Performance Achievements, Metrics & Volume Records:**\n\n')) + achBody;

    case 'suggestions':
      return (isHi ? '💡 **मैं क्या पूछ सकता हूँ? (विकल्प, सुझाव एवं मदद):**\n\n' : (isHinglish ? '💡 **Aap kya pooch sakte hain? (Guide, Options & Suggestions):**\n\n' : '💡 **How Can I Assist You Today? (Explore Options, Ask & Menu):**\n\n')) + sugBody;

    case 'ambiguous':
      return isHi
        ? '👋 **नमस्ते! मैं अतुल वर्मा का AI असिस्टेंट हूँ।**\n\nमैं टैक्स, अकाउंटिंग, सरकारी MIS, AI Vibe Coding और वैवाहिक बायोडाटा के प्रमाणित रिकॉर्ड्स में आपकी सहायता कर सकता हूँ। संपर्क या एक्सप्लोर करने के लिए नीचे चुनें:'
        : (isHinglish
          ? '👋 **Hello! Main Atul Verma ka AI Assistant hoon.**\n\nAap Atul ke verified records explore kar sakte hain, direct connect kar sakte hain, ya options pooch sakte hain:'
          : "👋 **Welcome! I am Atul's AI Assistant.**\n\nI can assist you with verified records across Tax, MIS, AI Vibe Coding, and Matrimonial Bio-Data. Please select a topic below to explore or connect directly:");

    case 'faq':
      return (isHi ? '📍 **कार्यालय एवं स्थान (Headquarters - स्थित):**\n\n' : (isHinglish ? '📍 **Office Location & Headquarters:**\n\n' : '📍 **Office Location & Headquarters (Where Located):**\n\n')) + faqBody;

    case 'fallback':
    default: {
      if (searchResults.length > 0) {
        const topItem = searchResults[0].item;
        return `🔍 **Found Relevant Information in Atul's Verified Portfolio:**\n\n• **${topItem.title}** (${topItem.category})\n${topItem.description}\n\nYou can jump directly to this item or explore more details below.`;
      }
      const noRecord = isHi ? `मुझे अतुल वर्मा के प्रमाणित पोर्टफोलियो इंडेक्स में "${query}" के लिए कोई सीधा रिकॉर्ड नहीं मिला।` : (isHinglish ? `Mujhe Atul Verma ke verified portfolio index me "${query}" ke liye direct certified record nahi mila.` : `I couldn't find a direct certified record for "${query}" in Atul's verified portfolio index. I only share authentic facts from Atul's certified records.`);
      const exploreMore = isHi ? 'आप उनके सत्यापित कार्य देख सकते हैं या सीधे संपर्क कर सकते हैं:' : (isHinglish ? 'Aap niche diye verified work explore kar sakte hain ya directly contact kar sakte hain:' : 'You can explore his verified work or connect with him directly:');
      return `${noRecord}\n\n${exploreMore}`;
    }
  }
}

function createFollowupChips(intent, context) {
  const c = (id, label, query) => ({ id, label, query });
  const activeRole = context.role || 'overview';
  const activeAudience = context.audience || 'all';

  if (activeAudience === 'recruiter') {
    return [
      c('dl-resume', '📄 Download Resume', 'download resume'),
      c('notice-period', '⏱️ Notice Period', 'what is your notice period'),
      c('view-skills', '⚡ Core Tech Stack', 'what skills and tools do you use'),
      c('view-experience', '💼 Career Timeline', 'tell me about your work experience')
    ];
  }

  if (activeAudience === 'client') {
    return [
      c('fee-quote', '💰 Fee Estimates', 'what are your service charges'),
      c('view-projects', '🚀 Case Studies', 'show me your project case studies'),
      c('consult-wa', '💬 WhatsApp Chat', 'how can i contact atul on whatsapp'),
      c('turnaround', '⏱️ Turnaround Time', 'what is your freelance turnaround time')
    ];
  }

  if (activeAudience === 'marriage') {
    return [
      c('biodata-details', '❤️ Full Bio-Data', 'marriage biodata details'),
      c('family-info', '👨‍👩‍👦 Family Background', 'family background details'),
      c('contact-wa', '💬 WhatsApp Connect', 'whatsapp contact number')
    ];
  }

  switch (activeRole) {
    case 'accountant':
      return [
      c('gst-compliance', '📊 GST Filing & ITC', 'gst return filing and itc'),
      c('tally-accounting', '📑 Tally ERP & BRS', 'tally prime and bank reconciliation'),
      c('acc-fees', '💰 Tax & Tally Fees', 'tax filing fees and pricing'),
      c('dl-acc-resume', '📄 Accountant Resume', 'download accountant resume')
      ];

    case 'mis':
      return [
      c('day-nulm', '🏛️ DAY-NULM Portal', 'day-nulm government reporting'),
      c('excel-vba', '⚡ Excel VBA & Macros', 'excel automation and macros'),
      c('smart-cards', '💳 Smart Card Biometrics', 'smart card biometric enrollments'),
      c('dl-mis-resume', '📄 MIS Resume', 'download mis resume')
      ];

    case 'vibe_coding':
      return [
      c('ai-saas-mvp', '🤖 AI SaaS Generator #07', 'ai saas prototype case study'),
      c('agent-workflows', '⚡ Multi-Agent Workflows', 'autonomous llm agent workflows'),
      c('ai-pricing', '💰 AI MVP Pricing', 'how much does an ai mvp prototype cost'),
      c('dl-vibe-resume', '📄 Vibe Coder Resume', 'download vibe coder resume')
      ];

    case 'overview':
    default:
      return [
      c('projects', '🚀 Featured Projects', 'featured case studies and projects'),
      c('tech', '💻 Core Tech Stack', 'what tools and skills do you use'),
      c('experience', '💼 Experience Summary', 'career history and experience'),
      c('contact', '📬 How to Contact', 'how can i contact atul')
      ];
  }
}


export const AUDIENCE_EMOJI_PRESETS = {
  recruiter: {
    primary: '💼',
    document: '📄',
    target: '🎯',
    action: '🚀',
    emojis: ['💼', '📄', '🎯', '🚀']
  },
  client: {
    primary: '💡',
    chart: '📊',
    speed: '⚡',
    partnership: '🤝',
    emojis: ['💡', '📊', '⚡', '🤝']
  },
  marriage: {
    primary: '🌸',
    document: '📜',
    blessing: '✨',
    traditional: '🌿',
    emojis: ['🌸', '📜', '✨', '🌿']
  },
  all: {
    primary: '💻',
    speed: '⚡',
    tools: '🛠️',
    global: '🌐',
    emojis: ['💻', '⚡', '🛠️', '🌐']
  },
  explorer: {
    primary: '💻',
    speed: '⚡',
    tools: '🛠️',
    global: '🌐',
    emojis: ['💻', '⚡', '🛠️', '🌐']
  }
};

export function getAudienceEmojiPreset(audience = 'all') {
  const key = String(audience || 'all').toLowerCase();
  return AUDIENCE_EMOJI_PRESETS[key] || AUDIENCE_EMOJI_PRESETS.all;
}

export function cleanMarkdownAsterisks(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/^(\s*)\*\s+/gm, '$1• ')
    .replace(/\*{3}(.*?)\*{3}/g, '$1')
    .replace(/\*{2}(.*?)\*{2}/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\*/g, '')
    .trim();
}

export function tuneResponseEmojis(text, audience = 'all', options = { enabled: true }) {
  if (typeof text !== 'string') return '';
  const enabled = options?.enabled !== false && options?.emojis !== false;
  if (!enabled) {
    return text
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '')
      .replace(/[ ]{2,}/g, ' ')
      .trim();
  }
  const key = String(audience || 'all').toLowerCase();
  const preset = getAudienceEmojiPreset(key);
  if (!preset) return text;

  if (key === 'marriage') return text.replace(/^[💼💰⚡🤖💻📬🔍]/u, preset.primary);
  if (key === 'recruiter') return text.replace(/^[🌸❤️💰💡🤖💻]/u, preset.primary);
  if (key === 'client') return text.replace(/^[🌸❤️🤖💻]/u, preset.primary);
  return text;
}

export const ONBOARDING_DECISION_TREE = {
  step1: {
    id: 'step_audience',
    step: 1,
    title: 'Select Your Audience Context',
    title_hi: 'अपना दर्शक संदर्भ चुनें',
    options: [
      { id: 'recruiter', label: '💼 Recruiter / Hiring', label_hi: '💼 रिक्रूटर / हायरिंग', value: 'recruiter' },
      { id: 'client', label: '💡 Client / Consulting', label_hi: '💡 क्लाइंट / कंसल्टिंग', value: 'client' },
      { id: 'all', label: '🌐 General Explorer', label_hi: '🌐 सामान्य एक्सप्लोरर', value: 'all' },
      { id: 'marriage', label: '🌸 Matrimonial Inquiry', label_hi: '🌸 वैवाहिक पूछताछ', value: 'marriage' },
      { id: 'skip', label: '⏭️ Skip', label_hi: '⏭️ स्किप करें', isSkip: true },
      { id: 'other', label: '✏️ Other / Specify', label_hi: '✏️ अन्य / निर्दिष्ट करें', isOther: true }
    ]
  },
  step2: {
    id: 'step_role',
    step: 2,
    title: 'Select Track or Specialization',
    title_hi: 'ट्रैक या विशेषज्ञता चुनें',
    options: [
      { id: 'accountant', label: '📊 Senior Accountant & Tax', label_hi: '📊 सीनियर अकाउंटेंट एवं टैक्स', value: 'accountant' },
      { id: 'mis', label: '⚡ MIS & Operations Lead', label_hi: '⚡ MIS एवं ऑपरेशंस लीड', value: 'mis' },
      { id: 'vibe_coding', label: '🤖 AI Vibe Coder & Full-Stack', label_hi: '🤖 AI Vibe Coder एवं फुल-स्टैक', value: 'vibe_coding' },
      { id: 'other', label: '📈 BI & Corporate Controller', label_hi: '📈 BI एवं कॉर्पोरेट कंट्रोलर', value: 'other' },
      { id: 'overview', label: '🧭 All-Track Overview', label_hi: '🧭 संपूर्ण ओवरव्यू', value: 'overview' },
      { id: 'skip', label: '⏭️ Skip', label_hi: '⏭️ स्किप करें', isSkip: true },
      { id: 'other_custom', label: '✏️ Other / Specify', label_hi: '✏️ अन्य / निर्दिष्ट करें', isOther: true }
    ]
  }
};

export function getOnboardingDecisionTree(context = {}) {
  const currentAudience = (context?.audience || 'all').toLowerCase();
  const currentRole = (context?.role || 'overview').toLowerCase();

  return {
    currentAudience,
    currentRole,
    step1: {
      ...ONBOARDING_DECISION_TREE.step1,
      options: ONBOARDING_DECISION_TREE.step1.options.map((opt) => ({
        ...opt,
        isHighlighted: opt.value === currentAudience || (opt.id === 'all' && currentAudience === 'all')
      }))
    },
    step2: {
      ...ONBOARDING_DECISION_TREE.step2,
      options: ONBOARDING_DECISION_TREE.step2.options.map((opt) => ({
        ...opt,
        isHighlighted: opt.value === currentRole || (opt.id === 'overview' && currentRole === 'overview')
      }))
    }
  };
}

export function generateResponseDecisionTree(intent, context = {}, lang = 'en') {
  const isHi = lang === 'hi';
  const chips = createFollowupChips(intent, context);
  const baseItems = chips.slice(0, 4).map((c) => ({
    id: c.id,
    label: c.label,
    query: c.query || c.label
  }));

  return [
    ...baseItems,
    { id: 'skip', label: isHi ? '⏭️ छोड़ें' : '⏭️ Skip', isSkip: true },
    { id: 'other', label: isHi ? '✏️ अन्य / विवरण' : '✏️ Other / Specify', isOther: true }
  ];
}

function formatAssistantResponse(data, safeContext, rawContext) {
  const cleanedText = cleanMarkdownAsterisks(data.text);
  const finalEmojiText = tuneResponseEmojis(cleanedText, safeContext.audience, {
    enabled: rawContext?.enableEmojis !== false && rawContext?.emojis !== false
  });
  const decisionTree = generateResponseDecisionTree(data.intent, safeContext, data.language);

  return {
    id: data.id,
    intent: data.intent,
    language: data.language,
    text: finalEmojiText,
    chips: data.chips,
    suggestionChips: data.chips,
    actions: data.actions,
    confidence: data.confidence,
    isRelaxed: !!data.isRelaxed,
    isFallback: !!data.isFallback,
    ...(data.relaxationBanner ? { relaxationBanner: cleanMarkdownAsterisks(data.relaxationBanner) } : {}),
    decisionTree,
    followUps: decisionTree
  };
}

// 7. PUBLIC EXPORTED ASSISTANT API CONTRACTS

export function queryAssistant(query, context = { role: 'overview', audience: 'all' }) {
  const safeQuery = typeof query === 'string' ? query.trim() : '';
  const safeContext = {
    role: context?.role || 'overview',
    audience: context?.audience || 'all'
  };

  const responseId = `resp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  // Handle empty query: return prompt chips and welcome message
  if (!safeQuery) {
    const chips = getInitialSuggestions(safeContext);
    return {
      id: responseId,
      intent: 'suggestions',
      language: 'en',
      text: "Hi there! 👋 I am Atul's AI Assistant. Feel free to ask about Atul's projects, experience, tech stack, tax consulting, or matrimonial bio-data!",
      chips,
      suggestionChips: chips,
      actions: createActionButtons('suggestions', {}, safeContext, 'en'),
      confidence: 1.0,
      isRelaxed: false,
      isFallback: false
    };
  }
      const { lang, normalized } = normalizeQuery(safeQuery);
  const isHi = lang === 'hi';
      const faqHit = matchAuthoritativeFAQ(safeQuery, safeContext);
  if (faqHit && faqHit.score >= 75) {
    const faq = faqHit.faq;
    const answerText = isHi || lang === 'hinglish' ? (faq.answer_hi || faq.answer) : faq.answer;
    const actions = [];
    if (faq.actionCTA) {
      const cta = faq.actionCTA;
      if (cta.type === 'case_study') {
      actions.push({
      type: 'open-case-study',
      label: isHi ? cta.label_hi : cta.label,
      label_hi: cta.label_hi,
      target: cta.target,
      payload: { id: cta.target }
      });
      } else if (cta.type === 'quote') {
      actions.push({
      type: 'switch-contact-tab',
      label: isHi ? cta.label_hi : cta.label,
      label_hi: cta.label_hi,
      target: 'quote',
      payload: { tab: 'quote' }
      });
      } else if (cta.type === 'contact') {
      actions.push({
      type: 'scroll',
      label: isHi ? cta.label_hi : cta.label,
      label_hi: cta.label_hi,
      target: '#contact',
      payload: { selector: '#contact' }
      });
      } else if (cta.type === 'credentials') {
      actions.push({
      type: 'scroll',
      label: isHi ? cta.label_hi : cta.label,
      label_hi: cta.label_hi,
      target: '#about',
      payload: { selector: '#about' }
      });
      }
    }

    const chips = createFollowupChips('faq_hit', safeContext);

    return {
      id: responseId,
      intent: 'faq',
      language: lang,
      text: answerText,
      chips,
      suggestionChips: chips,
      actions,
      confidence: Math.round(faqHit.score) / 100,
      isRelaxed: false,
      isFallback: false
    };
  }
      const classification = classifyIntent(safeQuery, safeContext);
  const { intent, confidence, entities } = classification;

  // 4. Handle Specific Functional Intents
  if (intent === 'filter_toggles') {
    const targetRole = entities.role || 'overview';
    const actions = [
      {
      type: 'switch-role-tab',
      label: isHi ? `🔄 ${targetRole.toUpperCase()} ट्रैक पर जाएं` : `🔄 Switch to ${targetRole.toUpperCase()} Track`,
      label_hi: `🔄 ${targetRole.toUpperCase()} ट्रैक पर जाएं`,
      target: targetRole,
      payload: { role: targetRole }
      }
    ];
    const text = isHi
      ? `✅ ट्रैक अपडेट: मैंने आपका सक्रिय संदर्भ **${targetRole.toUpperCase()}** पर सेट कर दिया है।`
      : `✅ Active Track Updated: Successfully aligned your session to the **${targetRole.toUpperCase()}** track.`;

    const chips = createFollowupChips('roles', { role: targetRole });
    return {
      id: responseId,
      intent,
      language: lang,
      text,
      chips,
      suggestionChips: chips,
      actions,
      confidence: 0.95,
      isRelaxed: false,
      isFallback: false
    };
  }

  if (intent === 'navigation' && entities.section) {
    const targetSelector = `#${entities.section}`;
    const actions = [
      {
      type: 'scroll',
      label: isHi ? `📍 #${entities.section} पर जाएं` : `📍 Jump to #${entities.section}`,
      label_hi: `📍 #${entities.section} पर जाएं`,
      target: targetSelector,
      payload: { selector: targetSelector }
      }
    ];
    const text = isHi
      ? `📍 नेविगेशन: आपको **#${entities.section}** अनुभाग पर ले जाया जा रहा है।`
      : `📍 Navigation: Smoothly scrolling down to the **#${entities.section}** section.`;

    const chips = createFollowupChips(intent, safeContext);
    return {
      id: responseId,
      intent,
      language: lang,
      text,
      chips,
      suggestionChips: chips,
      actions,
      confidence: 0.95,
      isRelaxed: false,
      isFallback: false
    };
  }

  // 5. Layer C, D, E: Search Catalog with Dynamic Relaxation Pre-Check
  const searchResult = searchPortfolioIndex(safeQuery, safeContext);
  const isRelaxedSearchMatch = searchResult.relaxed && searchResult.results.length > 0;

  // If High-Confidence Core Intent recognized (>= 0.75) and NOT a relaxed cross-track match, synthesize authoritative response
  if (confidence >= 0.75 && intent !== 'fallback' && !isRelaxedSearchMatch) {
    const text = buildIntentText(intent, entities, safeContext, lang, searchResult.results, safeQuery);
    const actions = createActionButtons(intent, entities, safeContext, lang, searchResult.results, safeQuery);
    const chips = createFollowupChips(intent, safeContext);

    return {
      id: responseId,
      intent,
      language: lang,
      text,
      chips,
      suggestionChips: chips,
      actions,
      confidence,
      isRelaxed: false,
      isFallback: false
    };
  }

  // 6. Handle Search Results (Strict or Relaxed)
  const { results, relaxed, relaxationLevel } = searchResult;

  if (results.length > 0) {
    let relaxationBanner = '';
    if (relaxed) {
      if (relaxationLevel === 'phase_2_relax_role') {
      relaxationBanner = isHi
      ? '*(सक्रिय रोल में कोई सीधा मिलान नहीं मिला; सभी पोर्टफोलियो ट्रैक्स से परिणाम दिखाए जा रहे हैं)*'
      : '*(Note: Expanded search across all professional tracks — relaxed role filter)*';
      } else if (relaxationLevel === 'phase_3_relax_audience') {
      relaxationBanner = isHi
      ? '*(संपूर्ण प्रमाणित पोर्टफोलियो निर्देशिका में खोज विस्तारित की गई)*'
      : '*(Note: Expanded search across the entire verified portfolio directory)*';
      }
    }

    const topItem = results[0].item;
    let caseId = getCaseStudyId(topItem);
    const resolvedIntent = topItem.category === 'Projects' ? 'projects' : (topItem.category === 'Skills' ? 'skills' : 'services');
    if (!caseId && resolvedIntent === 'skills') {
      const matched = findMatchedSkill(safeQuery, results);
      if (matched?.relatedCaseStudy) {
        caseId = matched.relatedCaseStudy;
      }
    }
    let text = buildIntentText(resolvedIntent, { ...entities, projectId: caseId || entities.projectId }, safeContext, lang, results, safeQuery);
    if (relaxationBanner) {
      text = `${relaxationBanner}\n\n${text}`;
    }

    const actions = [];
    if (caseId) {
      actions.push({
        type: 'open-case-study',
        label: isHi ? `🔍 केस स्टडी #${caseId} खोलें` : `🔍 Inspect Case Study #${caseId}`,
        label_hi: `🔍 केस स्टडी #${caseId} खोलें`,
        target: caseId,
        payload: { id: caseId }
      });
    }
    if (topItem.targetId) {
      actions.push({
        type: 'scroll',
        label: isHi ? `📍 ${topItem.title_hi || topItem.title}` : `📍 View ${topItem.title}`,
        label_hi: `📍 ${topItem.title_hi || topItem.title}`,
        target: `#${topItem.targetId}`,
        payload: { selector: `#${topItem.targetId}` }
      });
    }

    const chips = createFollowupChips(resolvedIntent, safeContext);

    return {
      id: responseId,
      intent: resolvedIntent,
      language: lang,
      text,
      chips,
      suggestionChips: chips,
      actions,
      confidence: Math.min(0.85, Math.max(0.60, results[0].score / 100)),
      isRelaxed: relaxed,
      isFallback: false,
      relaxationBanner
    };
  }
      const finalIntent = intent === 'ambiguous' ? 'ambiguous' : 'fallback';
  const fallbackText = buildIntentText(finalIntent, entities, safeContext, lang, [], safeQuery);
  const fallbackActions = createActionButtons(finalIntent, entities, safeContext, lang);
  const fallbackChips = [
    { id: 'view-roles', label: isHi ? '👨‍💼 भूमिकाएं देखें' : '👨‍💼 View Roles', query: 'who is atul' },
    { id: 'view-skills', label: isHi ? '⚡ कौशल देखें' : '⚡ View Skills', query: 'skills' },
    { id: 'view-projects', label: isHi ? '🚀 प्रोजेक्ट्स देखें' : '🚀 View Projects', query: 'projects' },
    { id: 'view-contact', label: isHi ? '📬 संपर्क करें' : '📬 Contact Details', query: 'contact' }
  ];

  return {
    id: responseId,
    intent: finalIntent,
    language: lang,
    text: fallbackText,
    chips: fallbackChips,
    suggestionChips: fallbackChips,
    actions: fallbackActions,
    confidence: finalIntent === 'ambiguous' ? 0.95 : 0.20,
    isRelaxed: false,
    isFallback: true
  };
}

export function getInitialSuggestions(context = { role: 'overview', audience: 'all' }) {
  return createFollowupChips('initial', context || {});
}

export function clearSessionMemory() {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      window.sessionStorage.removeItem('portfolio_assistant_messages');
      window.sessionStorage.removeItem('portfolio_assistant_session');
      window.sessionStorage.removeItem('portfolio_ai_chat_state');
    } catch {
      // Safe no-op on restricted environments
    }
  }
  return true;
}

export const generateAssistantResponse = queryAssistant;
export const getContextualPromptChips = getInitialSuggestions;

export default {
  cleanMarkdownAsterisks,
  tuneResponseEmojis,
  getOnboardingDecisionTree,
  queryAssistant,
  getInitialSuggestions,
  clearSessionMemory,
  detectLanguage,
  normalizeQuery,
  classifyIntent,
  matchAuthoritativeFAQ,
  searchPortfolioIndex,
  generateAssistantResponse,
  getContextualPromptChips,
  CORE_INTENTS,
  QUOTATION_DATA,
  DEMOGRAPHIC_BIO,
  CONTACT_INFO,
  ROLE_PROFILES,
  PROJECT_KEYWORD_MAP,
  matchProjectKeyword,
  getCaseStudyId,
  SKILL_LOOKUP_MAP,
  findMatchedSkill
};
