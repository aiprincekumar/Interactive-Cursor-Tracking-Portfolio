/**
 * Portfolio Assistant Engine: 100% Offline Deterministic Knowledge Engine
 */

import { SEARCH_ITEMS } from './searchCatalog.js';
import { CASE_STUDIES } from '../data/caseStudiesData.js';
import { FAQ_ITEMS } from '../data/faqConfig.js';
import { RESUME_ROLE_CONFIG, getResumeConfig } from './resumeConfig.js';
import { SKILLS_DATA } from '../data/skillsData.js';
import { searchPortfolio } from './portfolioSemanticIndex.js';
import {
  QUOTATION_DATA,
  createSessionMemory,
  getConversationalContext,
  updateConversationalContext,
  resetConversationalContext,
  resolveAnaphoricReferences,
  detectComparativeQuery,
  detectCompoundQuery,
  getDynamicContextualChips,
  synthesizeContextualResponse,
  getTopicForCaseStudy
} from './portfolioContextMemory.js';

export {
  QUOTATION_DATA,
  createSessionMemory,
  getConversationalContext,
  updateConversationalContext,
  resetConversationalContext,
  resolveAnaphoricReferences,
  detectComparativeQuery,
  detectCompoundQuery,
  getDynamicContextualChips
};


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

/**
 * Categorize a chip into one of the 5 canonical UI categories:
 * 'projects' | 'tax' | 'tech' | 'experience' | 'hire'
 */
export function inferChipCategory(id = '', label = '', query = '') {
  const combined = `${id} ${label} ${query}`.toLowerCase();
  if (/\b(cs-|case|project|stud|portfolio|o-proj|rec-cs|cli-cs|p-cs|c-cs|cs01|cs02|cs03|cs04|cs05|cs06|cs07|cs08|cs09)\b/i.test(combined)) return 'projects';
  if (/\b(gst|tax|tally|itc|audit|itr|gstr|ledger|brs)\b/i.test(combined)) return 'tax';
  if (/\b(tech|stack|tool|vba|macro|power bi|pbi|saas|agent|claude|sdk|react|code|clean)\b/i.test(combined)) return 'tech';
  if (/\b(exp|experience|tenure|nulm|smart card|bio-edu|bio-career|track record)\b/i.test(combined)) return 'experience';
  if (/\b(hire|contact|wa|whatsapp|call|phone|email|avail|notice|resume|cv|quote|quotation|fee|pricing|price|ctc|bio|partner|family|horoscope|kundli)\b/i.test(combined)) return 'hire';
  return 'projects';
}

/**
 * Canonical verified default prompt chips tagged by category
 */
export const PROMPT_CHIPS = [
  { id: 'projects', label: '🚀 Projects', query: 'Tell me about your featured projects', category: 'projects' },
  { id: 'tech', label: '⚡ Tech Stack', query: 'What is your core tech stack and skills?', category: 'tech' },
  { id: 'experience', label: '💼 Experience', query: 'Summarize your professional experience', category: 'experience' },
  { id: 'pricing', label: '💰 Pricing', query: 'Estimate quotation and service fees', category: 'hire' },
  { id: 'resume', label: '📄 Resume', query: 'Download verified professional resume', category: 'hire' },
  { id: 'gst', label: '📊 GST & Tax', query: 'Tell me about GST, ITR, and accounting practice', category: 'tax' },
  { id: 'itc', label: '📑 ITC & GSTR-2B', query: 'Explain GST ITC matching and GSTR-2B reconciliation', category: 'tax' },
  { id: 'tally', label: '📈 Tally Prime & BRS', query: 'Tell me about Tally Prime and bank reconciliation', category: 'tax' },
  { id: 'audit', label: '🔍 Audit & Ledgers', query: 'Tell me about balance sheet audit and financial controls', category: 'tax' },
  { id: 'powerbi', label: '📉 Power BI', query: 'Tell me about Power BI and Excel automation', category: 'tech' },
  { id: 'ai', label: '🤖 AI & SaaS', query: 'Tell me about AI prompt-to-SaaS and multi-agent workflows', category: 'tech' },
  { id: 'contact', label: '📬 Contact', query: 'How can I get in touch or hire you?', category: 'hire' }
];

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
  'voice_control',
  'ambiguous',
  'fallback'
];



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

const _qa = 'quotation pricing fees charge cost estimate';
const _ba = 'matrimonial marriage personal family biodata';
const _ia = 'input tax credit itc 2b reconciliation';
const _ma = 'ms excel vba macro automated pipelines';
const _pa = 'profit and loss balance sheet finalization';
const _da = 'day-nulm';

const TECHNICAL_ALIASES = {
  brs: 'bank reconciliation statement brs tally',
  itc: _ia,
  itc2b: _ia,
  'itc-2b': _ia,
  gstr: 'gst return compliance gstr-1 gstr-3b gstr-9',
  gstr1: 'gstr-1 outward supplies return gst',
  gstr3b: 'gstr-3b monthly summary return gst',
  gstr9: 'gstr-9 annual tax return gst audit',
  tds: 'tax deducted at source tds e-tds 26q',
  tcs: 'tax collected at source tcs 27eq',
  pbi: 'power bi',
  powerbi: 'power bi',
  nulm: _da,
  daynulm: _da,
  rsby: 'rsby smart card biometric field operations',
  vba: _ma,
  macro: _ma,
  pnl: _pa,
  'p&l': _pa,
  itr: 'income tax e-filing itr-1 itr-4 tax planning',
  cv: 'resume cv download official verified pdf',
  biodata: _ba,
  shadi: _ba,
  vivah: _ba,
  fee: _qa,
  fees: _qa,
  cost: _qa,
  price: _qa,
  pricing: _qa,
  charge: _qa,
  kharcha: _qa
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

const COMMON_ENGLISH_WORDS = new Set('tell call with from have this that what when where which who how your work more some than them then they were will been each make like time just know take into year good could look only come over also back after used our out all any can has had not for and the about role roles profile profiles show give need want view read find done open send contract contracts terms timeline turnaround drive prime atul verma file files filed filing live line list past post rate real site size stat stay team test text user went wide wire city date edit fast host item last life lite mine most must'.split(' '));

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
  voice_control: makeBoundaryRegex(
  'voice|speak|read that|read aloud|speak response|voice settings|change voice speed|voice dubbing|tts|narrate|' +
  'बोलकर सुनाओ|आवाज़ में बोलो|वॉइस सेटिंग्स|आवाज|बोल के बताओ|आवाज़'
  ),
  tour: makeBoundaryRegex(
  'tour|start tour|give me a tour|guided walkthrough|show me around|take a tour|explore portfolio tour|guided tour|walkthrough|' +
  'टूर|वॉकथ्रू|पोर्टफोलियो दिखाओ|दिखाओ'
  ),
  search: makeBoundaryRegex(
  'search for|search|find|look up|search portfolio|खोजें|ढूंढो|सर्च'
  ),
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

  // Explicit Tour & Search Directives (Phase 10)
  if (INTENT_PATTERNS.tour.test(lowerRaw)) {
  return { intent: 'tour', confidence: 0.95, entities };
  }
  if (INTENT_PATTERNS.search.test(lowerRaw)) {
  return { intent: 'search', confidence: 0.95, entities };
  }
  if (INTENT_PATTERNS.voice_control.test(lowerRaw)) {
  return { intent: 'voice_control', confidence: 0.95, entities };
  }

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
  'tour',
  'search',
  'voice_control',
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
  case 'voice_control':
  add('open-voice-settings', '⚙️ Voice Settings', '⚙️ आवाज़ सेटिंग्स', undefined, {});
  add('speak-last', '🔊 Read Aloud Last Response', '🔊 पिछला उत्तर बोलकर सुनाएं', undefined, {});
  add('toggle-auto-speak', '🎙️ Toggle Auto-Speak', '🎙️ ऑटो-स्पीक टॉगल करें', undefined, {});
  break;
  case 'tour':
  add('start-tour', '💼 Recruiter Tour', '💼 रिक्रूटर टूर', 'recruiter-fast-track', { tourId: 'recruiter-fast-track' });
  add('start-tour', '📊 GST & Tax Tour', '📊 जीएसटी व टैक्स टूर', 'corporate-tax-gst', { tourId: 'corporate-tax-gst' });
  add('start-tour', '⚡ AI Vibe Tour', '⚡ एआई वाइब टूर', 'ai-vibe-coding', { tourId: 'ai-vibe-coding' });
  add('start-tour', '👔 Executive Tour', '👔 एग्जीक्यूटिव टूर', 'executive-flash-tour', { tourId: 'executive-flash-tour' });
  break;
  case 'search':
  add('scroll', '🚀 Browse Projects', '🚀 प्रोजेक्ट्स देखें', '#projects', { selector: '#projects' });
  add('scroll', '⚡ View Skills', '⚡ कौशल देखें', '#skills', { selector: '#skills' });
  break;
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

  const pricingBody = '• **Accounting & Statutory Tax**: Base ₹4,500 – ₹8,000 (GST, ITR, BRS, audit dossier)\n• **MIS & Data Operations**: Base ₹5,000 – ₹9,000 (Excel VBA macros, portals, ETL)\n• **AI & Web Engineering**: Base ₹22,000 – ₹35,000 (Next.js SaaS MVP, multi-agent workflows)';
  const pricingBodyHi = '• **अकाउंटिंग एवं वैधानिक कर**: बेस ₹4,500 – ₹8,000 (GST, ITR, BRS, ऑडिट डॉसियर)\n• **MIS एवं डेटा ऑपरेशंस**: बेस ₹5,000 – ₹9,000 (एक्सेल VBA मैक्रोज़, सरकारी पोर्टल्स, ETL)\n• **AI एवं वेब इंजीनियरिंग**: बेस ₹22,000 – ₹35,000 (Next.js SaaS MVP, मल्टी-एजेंट वर्कफ़्लो)';

  const activePricingBody = isHi ? pricingBodyHi : pricingBody;
  const srvBody = activePricingBody;
  const clientBody = activePricingBody;

  const recBody = '• **Availability**: Immediate (0-15 days notice)\n• **Work Modes**: 100% remote readiness (1 Gbps fiber + UPS) or onsite relocation\n• **Resume / CV**: Official role-specific verified PDF resume dossier available below';
  const recBodyHi = '• **उपलब्धता**: तत्काल (0-15 दिन का नोटिस पीरियड)\n• **कार्य मोड**: 100% रिमोट तत्परता (1 Gbps फाइबर + UPS) या ऑनसाइट स्थानांतरण\n• **रिज्यूमे / CV**: आधिकारिक प्रमाणित रोल-विशिष्ट PDF रिज्यूमे नीचे उपलब्ध';
  const activeRecBody = isHi ? recBodyHi : recBody;

  const expBody = '• **Senior Accountant & Tax Consultant** (2018–Present): 500+ returns, ₹2.5Cr+ ITC, zero notices\n• **MIS Executive** — DAY-NULM Skill India (2016–2018): Multi-district portal reporting\n• **Smart Card Operations Lead** (2012–2016): 50,000+ biometric enrollments across 12+ districts\n• **AI Vibe Coder & Systems Engineer** (2024–Present): Autonomous multi-agent pipelines';
  const expBodyHi = '• **सीनियर अकाउंटेंट एवं टैक्स कंसल्टेंट** (2018–वर्तमान): 500+ रिटर्न, ₹2.5Cr+ ITC, शून्य नोटिस\n• **MIS एग्जीक्यूटिव** — DAY-NULM स्किल इंडिया (2016–2018): बहु-जिला पोर्टल रिपोर्टिंग\n• **स्मार्ट कार्ड ऑपरेशंस लीड** (2012–2016): 12+ जिलों में 50,000+ बायोमेट्रिक नामांकन\n• **AI वाइब कोडर एवं सिस्टम्स इंजीनियर** (2024–वर्तमान): स्वायत्त मल्टी-एजेंट पाइपलाइन्स';
  const activeExpBody = isHi ? expBodyHi : expBody;

  const achBody = '• **500+** Statutory returns e-filed (100% on-time compliance)\n• **₹2.5Cr+** Reconciled eligible Input Tax Credit (ITC)\n• **0%** Scrutiny notices or penalty assessments across 7+ years\n• **50,000+** Biometric registrations across 12+ districts\n• **9** Comprehensive production flagship case studies';
  const achBodyHi = '• **500+** वैधानिक रिटर्न ई-फाइल किए (100% समय पर अनुपालन)\n• **₹2.5Cr+** समाधान योग्य इनपुट टैक्स क्रेडिट (ITC)\n• **0%** स्क्रूटनी नोटिस या पेनल्टी असेसमेंट (7+ वर्षों में शून्य जुर्माना)\n• **50,000+** बायोमेट्रिक पंजीकरण (12+ जिलों में)\n• **9** व्यापक उत्पादन फ्लैगशिप केस स्टडीज';
  const activeAchBody = isHi ? achBodyHi : achBody;

  const availBody = '• **Timings**: Monday – Saturday, 10:00 AM – 7:00 PM IST (वर्किंग समय)\n• **Availability**: Immediate hire (0 to 15 days notice)\n• **Remote Station**: Dual-redundant 1 Gbps broadband with industrial UPS backup';
  const availBodyHi = '• **समय**: सोमवार – शनिवार, सुबह 10:00 – शाम 7:00 IST (भारतीय मानक समय)\n• **उपलब्धता**: तत्काल हायरिंग (0 से 15 दिन का नोटिस)\n• **रिमोट स्टेशन**: ड्यूल-रिडंडेंट 1 Gbps ब्रॉडबैंड और औद्योगिक UPS बैकअप';
  const activeAvailBody = isHi ? availBodyHi : availBody;

  const contactBody = `• **WhatsApp**: [+91 7992383804](${CONTACT_INFO.whatsappUrl})\n• **Email**: [${CONTACT_INFO.email}](${CONTACT_INFO.mailtoUrl})\n• **Phone**: +91 7992383804\n• **Location**: Daltonganj, Palamau, Jharkhand - 822101`;
  const contactBodyHi = `• **व्हाट्सएप**: [+91 7992383804](${CONTACT_INFO.whatsappUrl})\n• **ईमेल**: [${CONTACT_INFO.email}](${CONTACT_INFO.mailtoUrl})\n• **फोन**: +91 7992383804\n• **स्थान**: डाल्टनगंज, पलामू, झारखंड - 822101`;
  const activeContactBody = isHi ? contactBodyHi : contactBody;

  const bioBody = '• **Full Name**: Atul Verma (अतुल वर्मा)\n• **Father\'s Name**: Late Niranjan Prasad (स्व. निरंजन प्रसाद)\n• **Year of Birth**: 1991\n• **Marital Status**: Indian • Single (Unmarried)\n• **Profession**: Senior Accountant, Tax Consultant & MIS Lead\n• **Location**: Daltonganj (Medininagar), Palamau District, Jharkhand - 822101';
  const bioBodyHi = '• **पूरा नाम**: अतुल वर्मा\n• **पिता का नाम**: स्व. निरंजन प्रसाद\n• **जन्म वर्ष**: 1991\n• **वैवाहिक स्थिति**: अविवाहित (Single)\n• **व्यवसाय**: सीनियर अकाउंटेंट, टैक्स कंसल्टेंट एवं MIS लीड\n• **स्थान**: डाल्टनगंज (मेदिनीनगर), पलामू जिला, झारखंड - 822101';
  const activeBioBody = isHi ? bioBodyHi : bioBody;

  const faqBody = '• **Location**: Daltonganj (Medininagar), Palamau, Jharkhand - 822101, India\n• **Operation**: Pan-India remote consulting (100% remote ready / onsite relocation)\n• **Timings**: Monday to Saturday, 10:00 AM – 7:00 PM IST';
  const faqBodyHi = '• **स्थान**: डाल्टनगंज (मेदिनीनगर), पलामू, झारखंड - 822101, भारत\n• **ऑपरेशन**: अखिल भारतीय रिमोट कंसल्टिंग (100% रिमोट रेडी / ऑनसाइट स्थानांतरण)\n• **समय**: सोमवार से शनिवार, सुबह 10:00 – शाम 7:00 IST';
  const activeFaqBody = isHi ? faqBodyHi : faqBody;

  const sugBody = '• **Resume**: Download verified role-specific resume PDFs\n• **Case Studies**: Inspect 9 production case studies with live telemetry\n• **Tech Stack**: Tally, Excel macros, React, Python, Power BI\n• **Pricing**: Transparent fee quotations\n• **Contact**: WhatsApp (+91 7992383804) or email';
  const sugBodyHi = '• **रिज्यूमे**: सत्यापित रोल-विशिष्ट रिज्यूमे PDF डाउनलोड करें\n• **केस स्टडीज**: लाइव टेलीमेट्री के साथ 9 उत्पादन केस स्टडीज देखें\n• **टेक स्टैक**: टैली प्राइम, एक्सेल मैक्रोज़, रिएक्ट, पायथन, पावर BI\n• **मूल्य निर्धारण**: पारदर्शी शुल्क कोटेशन\n• **संपर्क**: व्हाट्सएप (+91 7992383804) या ईमेल';
  const activeSugBody = isHi ? sugBodyHi : sugBody;

  switch (intent) {
  case 'roles':
  if (isHi) return `👨‍💼 **अतुल वर्मा — ${profile.title_hi || profile.title}**\n\n${profile.summary_hi || profile.summary}\n\n• **भूमिका**: सीनियर अकाउंटेंट एवं टैक्स कंसल्टेंट, MIS स्पेशलिस्ट, AI Vibe Coder।\n• **प्रोफाइल**: सक्रिय ट्रैक ${activeRole.toUpperCase()}`;
  return `👨‍💼 **Atul Verma — ${profile.title}**\n\n${profile.summary}\n\n• **Core Specializations**: Multi-Track Polymath & Specialist (Statutory Tax & Tally, Government MIS, AI Vibe Coding & SaaS Prototyping, Corporate Controller).\n• **Active Track**: ${activeRole.toUpperCase()}`;
  case 'projects': {
  if (entities.projectId) {
  const cs = CASE_STUDIES.find((c) => c.id === entities.projectId);
  if (cs) {
  const m = cs.metrics?.map((x) => `**${x.val}** ${isHi ? (x.label_hi || x.label) : x.label}`).join(' • ') || '';
  const t = isHi ? (cs.title_hi || cs.title) : cs.title;
  const cat = isHi ? (cs.category_hi || cs.category) : (cs.trackBadge || cs.category);
  const s = isHi ? (cs.summary_hi || cs.summary) : cs.summary;
  const cta = isHi ? 'विस्तृत 5-स्टेज केस स्टडी देखने के लिए नीचे दिए बटन पर क्लिक करें।' : 'Click below to open the complete 5-stage case study drawer with live telemetry simulation.';
  return `🚀 **${isHi ? 'केस स्टडी' : 'Case Study'} #${cs.id}: ${t}**\n\n• **${isHi ? 'श्रेणी' : 'Track'}**: ${cat}\n• **${isHi ? 'सार' : 'Summary'}**: ${s}\n` + (m ? `• **${isHi ? 'सत्यापित मेट्रिक्स' : 'Verified Metrics'}**: ${m}\n` : '') + `• **${isHi ? 'तकनीकी स्टैक' : 'Tech Stack'}**: ${cs.techStack?.join(', ')}\n\n${cta}`;
  }
  }
  const topCs = ['01', '02', '03', '07', '08'].map((id) => CASE_STUDIES.find((c) => c.id === id)).filter(Boolean);
  const list = topCs.map((cs, i) => `${i + 1}. **#${cs.id}**: ${isHi ? (cs.title_hi || cs.title) : cs.title}`).join('\n');
  if (isHi) return `🚀 **अतुल वर्मा के प्रमुख फ्लैगशिप प्रोजेक्ट्स (9 केस स्टडीज):**\n\n${list}\n\nविस्तृत विश्लेषण के लिए किसी भी प्रोजेक्ट पर क्लिक करें।`;
  return `🚀 **Featured Flagship Case Studies (9 Dossiers):**\n\n${list}\n\nClick any project button below to inspect the full case study.`;
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
  const skBody = isHi
    ? '• **अकाउंटिंग एवं टैक्स**: टैली प्राइम (98%), GST एवं ITR (96%), BRS (95%)\n• **MIS एवं डेटा**: MS एक्सेल एवं VBA मैक्रोज़ (95%), DAY-NULM पोर्टल (98%), पावर BI (90%)\n• **AI एवं वाइब कोडिंग**: कर्सर, एंटीग्रेविटी SDK, क्लॉड कोड, रिएक्ट 19, विट, टेलविंड v4'
    : '• **Accounting & Tax**: Tally Prime (98%), GST & ITR (96%), BRS (95%)\n• **MIS & Data**: MS Excel & VBA Macros (95%), DAY-NULM Portal (98%), Power BI (90%)\n• **AI & Vibe**: Cursor, Antigravity SDK, Claude Code, React 19, Vite, Tailwind v4';
  if (isHi) return `⚡ **प्रमाणित तकनीकी कौशल एवं क्षमताएं:**\n\n${skBody}\n\nसभी 37 प्रमाणित दक्षताओं और टूल्स को देखने के लिए नीचे स्क्रॉल करें।`;
  return `⚡ **Core Skills & Technical Proficiencies:**\n\n${skBody}\n\nScroll to the Skills section below to explore all 37 indexed competencies and tools.`;
  }
  case 'experience':
  return (isHi ? '💼 **कार्य अनुभव एवं करियर इतिहास (10+ वर्ष):**\n\n' : '💼 **Career Experience & Proven Track Record (10+ Years):**\n\n') + activeExpBody + (isHi ? '' : '\n\nExplore the tenure and career timeline below.');
  case 'services':
  return (isHi ? '💰 **सेवाएं, कंसल्टेंसी एवं परामर्श शुल्क:**\n\n' : '💰 **Consulting Services, Offerings & Advisory:**\n\n') + srvBody;
  case 'voice_control':
  return isHi
  ? '🎙️ **अतुल एआई वॉइस एजेंट एवं सेटिंग्स:**\n\n• **नेचुरल वॉइस डबिंग**: ब्राउज़र न्यूरल वॉइस से हिंदी एवं अंग्रेजी वाचन।\n• **क्रोम वॉचडॉग**: 14-सेकंड ऑडियो फ्रीज का स्वतः समाधान।\n• **वेवफॉर्म विज़ुअलाइज़र**: रियल-टाइम मल्टी-साइन वेव।\n\nगति (0.8x-1.5x) या हैंड्स-फ्री ऑटो-स्पीक सेट करने हेतु नीचे बटन चुनें:'
  : '🎙️ **Atul AI Voice Agent & Speech Synthesis:**\n\n• **Multilingual Dubbing**: Indian English, Hindi, and US English.\n• **Chrome Watchdog**: Prevents Chromium 14s audio freeze.\n• **Waveform Visualizer**: Procedural multi-sine audio waves with reduced-motion fallback.\n• **Hands-Free Auto-Speak**: Narrates assistant answers.\n\nConfigure voice settings below:';
  case 'tour':
  return isHi
  ? '🧭 **इंटरएक्टिव गाइडेड टूर (पोर्टफोलियो वॉकथ्रू):**\n\nअतुल वर्मा के पोर्टफोलियो का चरण-दर-चरण अनुभव प्राप्त करें। अपनी भूमिका या आवश्यकता के अनुसार नीचे दिया गया टूर चुनें:'
  : '🧭 **Interactive Guided Portfolio Tours:**\n\nExperience structured, step-by-step walkthroughs across key milestones, verified impact metrics, and production case studies. Select a curated tour below:';
  case 'search':
  return isHi
  ? '🔍 **सत्यापित पोर्टफोलियो सिमेंटिक सर्च:**\n\nकेस स्टडीज, तकनीकी कौशल, ऑडिट एवं टूल्स में खोजें। नीचे परिणाम देखें या सीधा लिंक चुनें:'
  : '🔍 **Semantic Portfolio Search:**\n\nDeep multi-faceted search across case studies, skills, tools, and authoritative FAQs. Browse matching results below:';
  case 'client_info':
  return isHi
  ? '💰 **प्रोजेक्ट लागत, शुल्क, कीमत एवं कोटेशन (खर्च):**\n\n' + clientBody + '\n\nसटीक कोटेशन व लागत अनुमान हेतु कैलकुलेटर बटन का उपयोग करें।'
  : '💰 **Project Cost, Pricing, Fee Rates & Quotation Estimates:**\n\n' + clientBody + '\n\nClick below to open the interactive quotation estimator for a customized price breakdown.';
  case 'recruiter_info':
  return (isHi ? '📄 **रिक्रूटर एवं हायरिंग सूचना (रिज्यूमे डाउनलोड करें):**\n\n' : '📄 **Recruiter & Employment Information (Download Verified Resume PDF):**\n\n') + activeRecBody;
  case 'marriage_bio':
  return (isHi ? '❤️ **व्यक्तिगत एवं पारिवारिक विवरण (वैवाहिक बायोडाटा):**\n\n' : '❤️ **Personal & Matrimonial Bio-Data Demographics (Family Background):**\n\n') + activeBioBody;
  case 'contact':
  return (isHi ? '📬 **सीधा संपर्क एवं परामर्श:**\n\n' : '📬 **Direct Contact & Consultation:**\n\n') + activeContactBody;
  case 'availability':
  return (isHi ? '🕒 **कार्य उपलब्धता, वर्किंग समय एवं तत्काल नोटिस:**\n\n' : '🕒 **Consultation Availability, Working Hours & Immediate Notice:**\n\n') + activeAvailBody;
  case 'achievements':
  return (isHi ? '🏆 **सत्यापित उपलब्धियां, आंकड़े एवं रिकॉर्ड:**\n\n' : '🏆 **Verified Performance Achievements, Metrics & Volume Records:**\n\n') + activeAchBody;
  case 'suggestions':
  return (isHi ? '💡 **मैं क्या पूछ सकता हूँ? (विकल्प, सुझाव एवं मदद):**\n\n' : '💡 **How Can I Assist You Today? (Explore Options, Ask & Menu):**\n\n') + activeSugBody;
  case 'ambiguous':
  return isHi
  ? '👋 **नमस्ते! मैं अतुल वर्मा का AI असिस्टेंट हूँ।**\n\nमैं टैक्स, अकाउंटिंग, सरकारी MIS, AI Vibe Coding और वैवाहिक बायोडाटा के प्रमाणित रिकॉर्ड्स में आपकी सहायता कर सकता हूँ। संपर्क या एक्सप्लोर करने के लिए नीचे चुनें:'
  : "👋 **Welcome! I am Atul's AI Assistant.**\n\nI can assist you with verified records across Tax, MIS, AI Vibe Coding, and Matrimonial Bio-Data. Please select a topic below to explore or connect directly:";
  case 'faq':
  return (isHi ? '📍 **कार्यालय एवं स्थान (Headquarters - स्थित):**\n\n' : '📍 **Office Location & Headquarters (Where Located):**\n\n') + activeFaqBody;
  case 'fallback':
  default: {
  if (searchResults.length > 0) {
  const topItem = searchResults[0].item;
  if (isHi) {
    return `🔍 **अतुल वर्मा के प्रमाणित पोर्टफोलियो में प्रासंगिक जानकारी:**\n\n• **${topItem.title_hi || topItem.title}** (${topItem.category_hi || topItem.category})\n${topItem.description_hi || topItem.description}\n\nआप सीधे इस विषय पर जा सकते हैं या नीचे दिए गए विवरण देख सकते हैं।`;
  }
  return `🔍 **Found Relevant Information in Atul's Verified Portfolio:**\n\n• **${topItem.title}** (${topItem.category})\n${topItem.description}\n\nYou can jump directly to this item or explore more details below.`;
  }
  const noRecord = isHi ? `मुझे अतुल वर्मा के प्रमाणित पोर्टफोलियो इंडेक्स में "${query}" के लिए कोई सीधा रिकॉर्ड नहीं मिला। मैं केवल अतुल के सत्यापित आधिकारिक रिकॉर्ड्स से प्रामाणिक तथ्य साझा करता हूँ।` : `I couldn't find a direct certified record for "${query}" in Atul's verified portfolio index. I only share authentic facts from Atul's certified records.`;
  const exploreMore = isHi ? 'आप उनके सत्यापित कार्य देख सकते हैं या सीधे संपर्क कर सकते हैं:' : 'You can explore his verified work or connect with him directly:';
  return `${noRecord}\n\n${exploreMore}`;
  }
  }
}

function createFollowupChips(intent, context = {}, query = '', entities = {}) {
  const c = (id, label, query, category) => ({ id, label, query: query || label, category: category || inferChipCategory(id, label, query) });
  const r = context?.role || 'overview';
  const a = context?.audience || 'all';
  const q = String(query || '').toLowerCase();
  const ent = entities || {};

  const commonActions = (roleKey = 'all') => [
  c('wa-chat', '💬 WhatsApp Contact'),
  c('avail-now', '🟢 Immediate Availability'),
  c('notice-p', '⏱️ Notice: Immediate'),
  c('dl-cv', roleKey === 'accountant' ? '📄 Accountant Resume' : (roleKey === 'mis' ? '📄 MIS Resume' : (roleKey === 'vibe_coding' ? '📄 Vibe Resume' : '📄 Download Resume')), 'download resume'),
  c('fee-est', '💰 Quotation & Fees'),
  c('all-proj', '🚀 9 Case Studies')
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

  // Phase 11: Voice & Speech Chips
  if (intent === 'voice_control' || /\b(voice|speak|read aloud|voicesettings)\b/i.test(q)) {
  return [
  c('v-speak', '🔊 /speak Response', '/speak'),
  c('v-settings', '⚙️ /voicesettings', '/voicesettings'),
  c('v-hi', '🇮🇳 Hindi Voice Profile', '/voice hindi'),
  c('v-en', '🌐 Indian English Voice', '/voice en-in'),
  c('v-auto', '🎙️ Toggle Auto-Speak', '/voice autospeak'),
  c('v-rate', '⚡ Speech Rate 1.2x', '/voice rate 1.2')
  ];
  }

  // 1. Matrimonial
  if (a === 'marriage' || intent === 'marriage_bio' || /\b(shadi|shaadi|vivah|biodata|family|kundli|gotra|lifestyle)\b/i.test(q)) {
  return [
  c('bio-full', '❤️ Full Bio-Data'),
  c('bio-family', '👨‍👩‍👦 Family & Father'),
  c('bio-life', '🕊️ Lifestyle & Values'),
  c('bio-edu', '🎓 Education Details'),
  c('bio-career', '💼 Career & Stability'),
  c('bio-loc', '📍 Native: Daltonganj'),
  c('bio-wa', '💬 WhatsApp for PDF'),
  c('bio-kundli', '🪐 Kundli & Horoscope'),
  c('bio-pref', '🤝 Partner Preferences'),
  c('bio-call', '📞 Call Family / Atul'),
  c('bio-photo', '📸 Portfolio & Photos'),
  c('bio-res', '📄 Professional Resume')
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
  const cName = csNames[caseId] || (`Case #` + caseId);
  const nextId = String((parseInt(caseId, 10) % 9) + 1).padStart(2, '0');
  const nextName = csNames[nextId] || (`Case #` + nextId);
  const roleKey = ['01', '02', '06'].includes(caseId) ? 'accountant' : (['03', '04', '05'].includes(caseId) ? 'mis' : 'vibe_coding');
  return fillTo12([
  ...getDynamicContextualChips(caseId, context),
  c(`cs-${caseId}-deep`, `🧮 ${cName} Deep Dive`, `tell me about case study ${caseId} ${cName}`),
  c(`cs-${caseId}-tools`, `⚙️ Tools & Stack`, `what tools were used in case study ${caseId}`),
  c(`cs-${caseId}-impact`, `📈 Business Impact & ROI`, `business outcomes and impact of case study ${caseId}`),
  c(`cs-${caseId}-next`, `📑 Next: ${nextName}`, `case study ${nextId} ${nextName}`),
  c(`cs-${caseId}-live`, `🚀 Live Telemetry & Demo`, `show case study ${caseId} simulation`),
  c(`cs-${caseId}-stack`, `🛠️ Core Architecture`, 'what is your core tech stack and skills'),
  c(`cs-${caseId}-time`, `⏱️ Turnaround & Delivery`, 'what is turnaround time for projects')
  ], roleKey);
  }

  // 3. Tax / GST / Accounting
  if ((intent === 'services' && /\b(gst|tax|tally|accounting|audit|itc|itr|brs)\b/i.test(q)) || /\b(gst|gstr|itc|tax|income tax|itr|tally|accounting|audit|balance sheet|brs|ledger)\b/i.test(q)) {
  return fillTo12([
  c('gst-itc', '📊 GSTR-2B & ITC'),
  c('gst-tally', '📑 Tally Prime & BRS'),
  c('gst-audit', '💼 Balance Sheet & Audit'),
  c('gst-fee', '💰 Tax Filing Fees'),
  c('gst-cs01', '🧮 GST Case Study #01'),
  c('gst-itr', '📝 ITR Filing Process'),
  c('gst-vba', '⚡ Excel Macro Cleaning'),
  c('gst-pbi', '📈 Power BI Dashboards')
  ], 'accountant');
  }

  // 4. Projects & Case Studies
  if (intent === 'projects' || /\b(project|projects|case study|case studies|portfolio|work|kaam)\b/i.test(q)) {
  return [
  c('p-cs01', '🧮 Case #01: GST Tax Engine'),
  c('p-cs02', '📑 Case #02: Tally & BRS'),
  c('p-cs03', '🏛️ Case #03: DAY-NULM MIS'),
  c('p-cs04', '💳 Case #04: Smart Card 50k+'),
  c('p-cs05', '📈 Case #05: Power BI Analytics'),
  c('p-cs06', '💼 Case #06: Corporate Audit'),
  c('p-cs07', '🤖 Case #07: AI SaaS MVP Gen'),
  c('p-cs08', '⚡ Case #08: Multi-Agent Loops'),
  c('p-cs09', '📄 Case #09: Doc Synthesizer'),
  c('p-stack', '🛠️ Full Tech Stack & Tools'),
  c('p-quote', '💰 Quotation & Timelines'),
  c('p-wa', '💬 WhatsApp Project Inquiry')
  ];
  }

  // 5. Skills & Tech Stack
  if (intent === 'skills' || /\b(skill|skills|tech|stack|tools|python|react|excel|power bi|tally|hunar)\b/i.test(q)) {
  return fillTo12([
  c('s-pbi', '📈 Power BI Dashboards'),
  c('s-vba', '⚡ MS Excel VBA & Macros'),
  c('s-tally', '📑 Tally Prime & ERP 9'),
  c('s-gst', '🧮 GST & ITC Compliance'),
  c('s-agent', '🤖 Claude Code & Agents'),
  c('s-react', '⚛️ React 19 & Next.js SaaS'),
  c('s-proj', '🚀 Projects Using Skills'),
  c('s-exp', '⏱️ 10+ Years Breakdown')
  ], r);
  }

  // 6. Pricing & Quotation
  if (intent === 'services' || intent === 'pricing' || /\b(pricing|price|quote|quotation|cost|fees|fee|charge|charges|kharcha|paisa|paise)\b/i.test(q)) {
  return fillTo12([
  c('pr-gst', '📊 GST Filing (₹2.5k)'),
  c('pr-tally', '📑 Tally Retainer (₹3k)'),
  c('pr-saas', '🤖 AI SaaS MVP (₹18k+)'),
  c('pr-pbi', '📈 Power BI Dashboard (₹4k)'),
  c('pr-vba', '⚡ Excel VBA Macro (₹3.5k)'),
  c('pr-audit', '💼 Audit Dossier Prep (₹4.5k)'),
  c('pr-neg', '🤝 Rates Negotiable?'),
  c('pr-time', '📅 Delivery Milestones')
  ], r);
  }

  // 7. Experience
  if (intent === 'experience' || /\b(experience|history|career|tenure|anubhav|background|journey)\b/i.test(q)) {
  return fillTo12([
  c('exp-acc', '🏛️ Senior Accountant (2018–Pres)'),
  c('exp-mis', '🏛️ DAY-NULM MIS Lead (2016–18)'),
  c('exp-sc', '💳 50,000+ Smart Cards (2012–16)'),
  c('exp-ai', '🤖 AI Vibe Coder (2024–Pres)'),
  c('exp-loc', '📍 Location & Remote Terms'),
  c('exp-ref', '🏢 Client & CA References'),
  c('exp-ctc', '💰 Expected CTC')
  ], r);
  }

  // 8. Contact & Hire
  if (intent === 'contact' || intent === 'recruiter_info' || intent === 'client_info' || intent === 'availability' || /\b(contact|hire|email|phone|whatsapp|call|reach|talk|interview|notice|available|availability)\b/i.test(q)) {
  return [
  c('c-wa', '💬 WhatsApp Atul Directly'),
  c('c-phone', '📞 Call (+91 7992383804)'),
  c('c-email', '📧 Email (atulravi2015@gmail.com)'),
  c('c-resume', '📄 Download Resume PDF'),
  c('c-notice', '🟢 Notice: Immediate Joiner'),
  c('c-exp', '💼 10+ Years Summary'),
  c('c-cs', '🚀 9 Live Case Studies'),
  c('c-quote', '💰 Project Quotation'),
  c('c-remote', '📍 Remote / Relocation Terms'),
  c('c-call', '🤝 Schedule Discovery Call'),
  c('c-bio', '💍 Matrimonial Bio-Data'),
  c('c-tech', '⚡ Tech Stack & Tools')
  ];
  }

  // 9. Audience Defaults
  if (a === 'recruiter') {
  return [
  c('rec-resume', '📄 Download Resume'),
  c('rec-notice', '⏱️ Notice: Immediate Joiner'),
  c('rec-skills', '⚡ Tech Stack & Tools'),
  c('rec-exp', '💼 10+ Years Experience'),
  c('rec-avail', '🟢 Immediate Availability'),
  c('rec-cs', '🚀 Featured Case Studies'),
  c('rec-acc', '🧮 Tax & Accounting Tenure'),
  c('rec-gov', '🏛️ Govt Portal Operations'),
  c('rec-ai', '🤖 AI Vibe Coding Stack'),
  c('rec-wa', '💬 WhatsApp Recruiter Chat'),
  c('rec-ctc', '💰 CTC & Compensation'),
  c('rec-loc', '📍 Location & Remote Terms')
  ];
  }

  if (a === 'client') {
  return [
  c('cli-quote', '💰 Quotation & Fees'),
  c('cli-cs', '🚀 Verified Case Studies'),
  c('cli-wa', '💬 WhatsApp Consultation'),
  c('cli-gst', '📊 GST Return & ITC Advisory'),
  c('cli-tally', '📑 Tally Prime & BRS Retainer'),
  c('cli-pbi', '📈 Power BI KPI Dashboards'),
  c('cli-saas', '🤖 AI SaaS MVP Prototype Build'),
  c('cli-macro', '⚡ Excel VBA Automation'),
  c('cli-audit', '💼 Corporate Audit Dossier'),
  c('cli-res', '📄 Consultant Profile'),
  c('cli-time', '⏱️ Turnaround & Milestones'),
  c('cli-call', '📞 Direct Call (+91 7992383804)')
  ];
  }

  // 10. Role Defaults
  switch (r) {
  case 'accountant':
  return [
  c('r-gst', '📊 GST Filing & GSTR-2B'),
  c('r-tally', '📑 Tally ERP & BRS'),
  c('r-itr', '📝 Income Tax Returns (ITR 1-4)'),
  c('r-audit', '💼 Balance Sheet & Audit Dossier'),
  c('r-fee', '💰 Tax & Tally Retainer Rates'),
  c('r-cs01', '🧮 GST Case Study #01'),
  c('r-cs02', '📑 Tally Case Study #02'),
  c('r-dl', '📄 Accountant Resume'),
  c('r-wa', '💬 WhatsApp Tax Chat'),
  c('r-pbi', '📈 Power BI Fiscal Telemetry'),
  c('r-avail', '🟢 Immediate Availability'),
  c('r-ref', '🏢 Zero Penalty Track Record')
  ];
  case 'mis':
  return [
  c('m-nulm', '🏛️ DAY-NULM Portal MIS'),
  c('m-vba', '⚡ Excel VBA Macro Pipelines'),
  c('m-sc', '💳 50k+ Biometric Smart Cards'),
  c('m-pbi', '📈 Power BI Analytics Dashboard'),
  c('m-cs03', '📊 MIS Case Study #03'),
  c('m-cs04', '💳 Smart Card Case #04'),
  c('m-dl', '📄 MIS Operations Resume'),
  c('m-fee', '💰 MIS Project Quotation'),
  c('m-wa', '💬 WhatsApp Operations Chat'),
  c('m-exp', '💼 10+ Years Operations Tenure'),
  c('m-clean', '🧹 Large Data Cleaning (10k+ Rows)'),
  c('m-avail', '⏱️ Notice & Immediate Hire')
  ];
  case 'vibe_coding':
  return [
  c('v-saas', '🤖 AI SaaS MVP Prototype #07'),
  c('v-agent', '⚡ Autonomous Multi-Agent Loops'),
  c('v-sdk', '🚀 Google Antigravity SDK'),
  c('v-claude', '🧠 Claude Code & Cursor Flows'),
  c('v-cs07', '🤖 Case Study #07: AI SaaS MVP'),
  c('v-cs08', '⚡ Case Study #08: Multi-Agent Engine'),
  c('v-cs09', '📄 Case Study #09: Doc Synthesizer'),
  c('v-fee', '💰 AI MVP Prototype Pricing'),
  c('v-dl', '📄 Vibe Coder Resume'),
  c('v-stack', '🛠️ React 19, Vite & Tailwind v4'),
  c('v-wa', '💬 WhatsApp Tech Discussion'),
  c('v-avail', '🟢 Ready for Full-Stack Roles')
  ];
  case 'overview':
  default:
  return [
  c('o-proj', '🚀 Featured Projects (9 Studies)'),
  c('o-tech', '⚡ Tech Stack & Skills'),
  c('o-exp', '💼 10+ Years Career Experience'),
  c('o-pricing', '💰 Quotation & Service Fees'),
  c('o-resume', '📄 Download Verified Resume'),
  c('o-gst', '📊 GST, ITR & Tax Advisory'),
  c('o-pbi', '📈 Power BI & Excel Automation'),
  c('o-ai', '🤖 AI SaaS & Agent Workflows'),
  c('o-contact', '📬 How to Contact & Hire'),
  c('o-avail', '🟢 Immediate Joining Availability'),
  c('o-wa', '💬 WhatsApp Atul Directly'),
  c('o-bio', '💍 Family & Matrimonial Bio')
  ];
  }
}

export const AUDIENCE_EMOJI_PRESETS = {
  recruiter: { primary: '💼', document: '📄', target: '🎯', action: '🚀', emojis: ['💼', '📄', '🎯', '🚀'] },
  client: { primary: '💡', chart: '📊', speed: '⚡', partnership: '🤝', emojis: ['💡', '📊', '⚡', '🤝'] },
  marriage: { primary: '🌸', document: '📜', blessing: '✨', traditional: '🌿', emojis: ['🌸', '📜', '✨', '🌿'] },
  all: { primary: '💻', speed: '⚡', tools: '🛠️', global: '🌐', emojis: ['💻', '⚡', '🛠️', '🌐'] }
};
AUDIENCE_EMOJI_PRESETS.explorer = AUDIENCE_EMOJI_PRESETS.all;

export function getAudienceEmojiPreset(audience = 'all') {
  const key = String(audience || 'all').toLowerCase();
  return AUDIENCE_EMOJI_PRESETS[key] || AUDIENCE_EMOJI_PRESETS.all;
}

export function cleanMarkdownAsterisks(text) {
  if (typeof text !== 'string') return '';
  return text
  .replace(/[•\u2022]/g, '')
  .replace(/^[\s]*[-*]\s+/gm, '')
  .replace(/\*{3}(.*?)\*{3}/g, '$1')
  .replace(/\*{2}(.*?)\*{2}/g, '$1')
  .replace(/\*(.*?)\*/g, '$1')
  .replace(/\*/g, '')
  .replace(/\n\s*\n\s*\n/g, '\n\n')
  .trim();
}

export function tuneResponseEmojis(text, audience = 'all', options = { enabled: true }) {
  if (typeof text !== 'string') return '';
  const enabled = options?.enabled !== false && options?.emojis !== false;
  if (!enabled) {
  return text
  .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]|\u{FE0F}/gu, '')
  .replace(/[ ]{2,}/g, ' ')
  .trim();
  }
  const key = String(audience || 'all').toLowerCase();
  const preset = getAudienceEmojiPreset(key);
  if (!preset) return text;

  if (key === 'marriage') return text.replace(/^([💼💰⚡🤖💻📬🔍]|❤️|🌸)/u, preset.primary);
  if (key === 'recruiter') return text.replace(/^([🌸💰💡🤖💻]|❤️)/u, preset.primary);
  if (key === 'client') return text.replace(/^([🌸🤖💻]|❤️)/u, preset.primary);
  return text;
}

export function getDecisionOptionLabel(opt, currentLang = 'hi') {
  if (!opt) return '';
  const isEn = currentLang === 'en';
  if (isEn && opt.label_en) return opt.label_en;
  if (!isEn && opt.label_hi) return opt.label_hi;
  if (opt.label && opt.label.includes(' / ')) {
    const parts = opt.label.split(' / ');
    return isEn ? (parts[1] || parts[0]).trim() : (parts[0] || parts[1]).trim();
  }
  return isEn ? (opt.label_en || opt.label || '') : (opt.label_hi || opt.label || '');
}

export const ONBOARDING_DECISION_TREE = {
  step1: {
    id: 'step_audience',
    step: 1,
    title: 'Select Your Audience Context',
    title_hi: 'अपना दर्शक संदर्भ चुनें',
    title_en: 'Select Your Audience Context',
    options: [
      { id: 'recruiter', label: '💼 Recruiter / Hiring', label_en: '👔 Tech Recruiter', label_hi: '👔 तकनीकी रिक्रूटर', value: 'recruiter' },
      { id: 'client', label: '💡 Client / Consulting', label_en: '🤝 Client / Projects', label_hi: '🤝 क्लाइंट व प्रोजेक्ट्स', value: 'client' },
      { id: 'marriage', label: '💍 Matrimonial Biodata', label_en: '💍 Matrimonial Biodata', label_hi: '💍 वैवाहिक परिचय', value: 'marriage' },
      { id: 'all', label: '🌐 General Explorer', label_en: '🚀 General Explorer', label_hi: '🚀 सामान्य अन्वेषक', value: 'all' },
      { id: 'skip', label: '⏭️ Skip', label_en: '⏩ Skip', label_hi: '⏩ छोड़ें', isSkip: true }
    ]
  },
  step2: {
    id: 'step_role',
    step: 2,
    title: 'Select Track or Specialization',
    title_hi: 'ट्रैक या विशेषज्ञता चुनें',
    title_en: 'Select Track or Specialization',
    options: [
      { id: 'accountant', label: '📊 Corporate Accountant', label_en: '📊 Corporate Accountant', label_hi: '📊 कॉर्पोरेट अकाउंटेंट', value: 'accountant' },
      { id: 'mis', label: '📑 MIS Operations Lead', label_en: '📑 MIS Operations Lead', label_hi: '📑 एमआईएस ऑपरेशन्स', value: 'mis' },
      { id: 'vibe_coding', label: '💻 AI Vibe Coder', label_en: '💻 AI Vibe Coder', label_hi: '💻 एआई वाइब कोडर', value: 'vibe_coding' },
      { id: 'other', label: '✨ BI & Controller', label_en: '✨ BI & Controller', label_hi: '✨ बीआई व कंट्रोलर', value: 'other' },
      { id: 'overview', label: '🎯 Executive Overview', label_en: '🎯 Executive Overview', label_hi: '🎯 कार्यकारी सारांश', value: 'overview' },
      { id: 'skip', label: '⏩ छोड़ें', label_en: '⏩ Skip', label_hi: '⏩ छोड़ें', isSkip: true }
    ]
  }
};

export function getOnboardingDecisionTree(context = {}) {
  const currentAudience = (context?.audience || 'all').toLowerCase();
  const currentRole = (context?.role || 'overview').toLowerCase();
  const currentViewMode = (context?.viewMode || 'modern').toLowerCase();

  const step3 = {
    id: 'step_view_mode',
    step: 3,
    title: 'Select Portfolio View Mode',
    title_hi: 'पोर्टफोलियो व्यू मोड चुनें',
    title_en: 'Select Portfolio View Mode',
    options: [
      { id: 'modern', label: '⚡ Modern / Interactive', label_en: '⚡ Modern / Interactive', label_hi: '⚡ आधुनिक व इंटरैक्टिव', value: 'modern', viewMode: 'modern', emoji: '⚡' },
      { id: 'simple', label: '🍃 Simple / Classic', label_en: '🍃 Simple / Classic', label_hi: '🍃 सरल व क्लासिक', value: 'simple', viewMode: 'simple', emoji: '🍃' },
      { id: 'basic', label: '📄 Basic / PDF', label_en: '📄 Basic / Clean', label_hi: '📄 मूल व पीडीएफ', value: 'basic', viewMode: 'basic', emoji: '📄' },
      { id: 'terminal', label: '💻 Terminal / Developer', label_en: '💻 Terminal / Dev', label_hi: '💻 टर्मिनल डेवलपर', value: 'terminal', viewMode: 'terminal', emoji: '💻' }
    ].map((opt) => ({
      ...opt,
      isHighlighted: opt.value === currentViewMode || opt.viewMode === currentViewMode
    }))
  };

  const step1 = {
    ...ONBOARDING_DECISION_TREE.step1,
    options: ONBOARDING_DECISION_TREE.step1.options.map((opt) => ({
      ...opt,
      isHighlighted: opt.value === currentAudience || (opt.id === 'all' && currentAudience === 'all')
    }))
  };

  const step2 = {
    ...ONBOARDING_DECISION_TREE.step2,
    options: ONBOARDING_DECISION_TREE.step2.options.map((opt) => ({
      ...opt,
      isHighlighted: opt.value === currentRole || (opt.id === 'overview' && currentRole === 'overview')
    }))
  };

  return {
    currentAudience,
    currentRole,
    currentViewMode,
    step1,
    step2,
    step3,
    audienceStep: step1,
    roleStep: step2,
    viewModeStep: step3
  };
}

export function generateResponseDecisionTree(intent, context = {}, lang = 'en') {
  const isHi = lang === 'hi';
  const chips = createFollowupChips(intent, context);
  const baseItems = chips.slice(0, 4).map((c) => ({
    id: c.id,
    label: c.label,
    label_en: c.label,
    label_hi: c.label_hi || c.label,
    query: c.query || c.label,
    category: c.category || inferChipCategory(c.id, c.label, c.query)
  }));

  return [
    ...baseItems,
    { id: 'skip', label: isHi ? '⏭️ छोड़ें' : '⏭️ Skip', label_en: '⏭️ Skip', label_hi: '⏭️ छोड़ें', isSkip: true }
  ];
}

function formatAssistantResponse(data, safeContext, rawContext) {
  const rawText = typeof data.text === 'string' ? data.text : '';
  const finalEmojiText = tuneResponseEmojis(rawText, safeContext.audience, {
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
  ...(data.relaxationBanner ? { relaxationBanner: data.relaxationBanner } : {}),
  decisionTree,
  followUps: decisionTree
  };
}

// 7. PUBLIC EXPORTED ASSISTANT API CONTRACTS & SLASH COMMAND ENGINE

import { CHAT_SLASH_COMMANDS, handleSlashCommand } from '../data/chatSlashCommands.js';
export { CHAT_SLASH_COMMANDS, handleSlashCommand };

export function generateSingleResponse(query, context, lang = 'en') {
  const safeQuery = typeof query === 'string' ? query.trim() : '';
  const safeContext = {
    role: context?.role || 'overview',
    audience: context?.audience || 'all',
    language: lang
  };
  const isHi = lang === 'hi';
  const responseId = `resp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  // Handle empty query: return prompt chips and welcome message
  if (!safeQuery) {
    const chips = getInitialSuggestions(safeContext);
    const text = isHi
      ? "नमस्ते! 👋 मैं अतुल वर्मा का AI असिस्टेंट हूँ। आप अतुल के प्रोजेक्ट्स, कार्य अनुभव, टैक्स कंसल्टेंसी या वैवाहिक बायोडाटा के बारे में पूछ सकते हैं!"
      : "Hi there! 👋 I am Atul's AI Assistant. Feel free to ask about Atul's projects, experience, tech stack, tax consulting, or matrimonial bio-data!";
    return {
      id: responseId,
      intent: 'suggestions',
      language: lang,
      text,
      chips,
      suggestionChips: chips,
      actions: createActionButtons('suggestions', {}, safeContext, lang),
      confidence: 1.0,
      isRelaxed: false,
      isFallback: false
    };
  }
  // Helper to record context and return
  const respond = (res, intentOverride, topicOverride, caseStudyIdOverride) => {
    try {
      const activeIntent = intentOverride || res.intent;
      const activeCaseId = caseStudyIdOverride || (res.actions?.find(a => a.payload?.id)?.payload?.id) || null;
      const activeTopic = topicOverride || (activeCaseId ? getTopicForCaseStudy(activeCaseId) : activeIntent);
      updateConversationalContext(activeIntent, activeTopic, activeCaseId, safeContext.role, {});
    } catch {
      // safe fallback
    }
    return res;
  };

  // Handle Slash Commands (e.g. /help, /projects, /gst, /quote, /resume, etc.)
  if (safeQuery.startsWith('/')) {
    const slashRes = handleSlashCommand(safeQuery, safeContext, responseId);
    if (slashRes) return respond(slashRes);
  }

  // Phase 6: Comparative Queries
  const compRes = detectComparativeQuery(safeQuery, safeContext);
  if (compRes) {
    updateConversationalContext('compare', 'comparative', null, safeContext.role, {});
    return compRes;
  }

  // Phase 6: Compound Queries
  const compoundRes = detectCompoundQuery(safeQuery, safeContext);
  if (compoundRes) {
    updateConversationalContext(compoundRes.intent, 'compound', null, safeContext.role, {});
    return compoundRes;
  }

  // Phase 6: Coreference & Anaphoric Reference Resolution
  const anaphora = resolveAnaphoricReferences(safeQuery, getConversationalContext());
  if (anaphora.isAnaphoric && anaphora.resolvedEntity) {
    const contextualRes = synthesizeContextualResponse(anaphora.resolvedEntity, safeContext, lang);
    updateConversationalContext(contextualRes.intent, anaphora.resolvedEntity.topic, anaphora.resolvedEntity.caseStudyId, anaphora.resolvedEntity.role, {});
    return contextualRes;
  }

  const faqHit = matchAuthoritativeFAQ(safeQuery, safeContext);
  if (faqHit && faqHit.score >= 75) {
    const faq = faqHit.faq;
    const answerText = isHi ? (faq.answer_hi || faq.answer) : faq.answer;
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
    const chips = createFollowupChips('faq_hit', safeContext, safeQuery, { faq: faqHit.faq });
    return respond({
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
    });
  }

  const classification = classifyIntent(safeQuery, safeContext);
  const { intent, confidence, entities } = classification;

  // 4. Handle Specific Functional Intents
  // Phase 10: Guided Tour Intent Handling
  if (intent === 'tour') {
    const qLower = safeQuery.toLowerCase();
    let tourId = 'recruiter-fast-track';
    if (qLower.includes('gst') || qLower.includes('tax') || qLower.includes('corporate')) {
      tourId = 'corporate-tax-gst';
    } else if (qLower.includes('ai') || qLower.includes('vibe') || qLower.includes('code') || qLower.includes('saas')) {
      tourId = 'ai-vibe-coding';
    } else if (qLower.includes('exec') || qLower.includes('flash') || qLower.includes('accomplish')) {
      tourId = 'executive-flash-tour';
    }
    const text = isHi
      ? `🧭 **गाइडेड पोर्टफोलियो टूर:**\n\nअतुल वर्मा के पोर्टफोलियो का निर्देशित इंटरएक्टिव वॉकथ्रू प्रारंभ करने के लिए तैयार है। नीचे दिए गए टूर पर क्लिक करके शुरू करें:`
      : `🧭 **Interactive Guided Portfolio Tour:**\n\nReady to explore Atul's verified expertise, case studies, and career milestones. Click below to start the interactive walkthrough:`;
    const actions = [
      { type: 'start-tour', tourId, label: isHi ? '🚀 गाइडेड टूर शुरू करें' : '🚀 Start Guided Tour' },
      { type: 'next-tour-step', label: isHi ? '➡️ अगला कदम' : '➡️ Next Step' },
      { type: 'end-tour', label: isHi ? '⏹️ टूर समाप्त करें' : '⏹️ End Tour' }
    ];
    const chips = [
      { id: 'c-tour-recruiter', label: isHi ? '💼 रिक्रूटर टूर' : '💼 Recruiter Tour', query: '/tour recruiter' },
      { id: 'c-tour-tax', label: isHi ? '📊 GST एवं टैक्स टूर' : '📊 GST & Tax Tour', query: '/tour gst' },
      { id: 'c-tour-ai', label: isHi ? '⚡ AI वाइब टूर' : '⚡ AI Vibe Tour', query: '/tour ai' },
      { id: 'c-tour-exec', label: isHi ? '👔 एक्जीक्यूटिव टूर' : '👔 Executive Tour', query: '/tour executive' }
    ];
    return respond({
      id: responseId,
      intent: 'tour',
      language: lang,
      text,
      card: {
        type: 'tour-controller',
        tourId
      },
      chips,
      suggestionChips: chips,
      actions,
      confidence: 0.95,
      isRelaxed: false,
      isFallback: false
    }, 'tour', 'tour', null);
  }

  // Phase 10: Deep Semantic Search Intent Handling
  if (intent === 'search') {
    const cleanSearchTerm = safeQuery
      .replace(/^(?:search for|search|find|look up|खोजें|ढूंढो|सर्च)\s+/i, '')
      .trim();
    const queryTerm = cleanSearchTerm || safeQuery;
    const searchResults = searchPortfolio(queryTerm, { limit: 5 });
    const text = searchResults.length > 0
      ? (isHi
        ? `🔍 **"${queryTerm}" के लिए खोज परिणाम:**\n\nअतुल वर्मा के पोर्टफोलियो से **${searchResults.length}** प्रासंगिक परिणाम मिले:`
        : `🔍 **Semantic Search Results for "${queryTerm}":**\n\nFound **${searchResults.length}** matching items across Case Studies, Skills, and Resources:`)
      : (isHi
        ? `🔍 **"${queryTerm}" के लिए कोई सीधा परिणाम नहीं मिला।**\n\nकृपया \`gst\`, \`tally\`, \`excel\`, या \`projects\` जैसे कीवर्ड्स खोजें।`
        : `🔍 **No exact matches found for "${queryTerm}".**\n\nTry searching for keywords like \`gst\`, \`tally\`, \`excel\`, \`power bi\`, or \`ai\`.`);
    const actions = searchResults.length > 0
      ? searchResults.slice(0, 3).map(r => r.action || { type: 'scroll', target: r.targetId, label: isHi ? (r.title_hi || r.title) : r.title })
      : [
        { type: 'scroll', target: '#projects', payload: { selector: '#projects' }, label: isHi ? '🚀 केस स्टडीज देखें' : '🚀 View Case Studies' },
        { type: 'scroll', target: '#skills', payload: { selector: '#skills' }, label: isHi ? '⚡ कौशल देखें' : '⚡ View Skills' }
      ];
    const chips = [
      { id: 'c-s-gst', label: '🔍 GST Engine', query: '/search gst' },
      { id: 'c-s-tally', label: '🔍 Tally Prime', query: '/search tally' },
      { id: 'c-s-ai', label: '🔍 AI SaaS', query: '/search ai' }
    ];
    return respond({
      id: responseId,
      intent: 'search',
      language: lang,
      text,
      card: {
        type: 'search-results',
        query: queryTerm,
        results: searchResults
      },
      chips,
      suggestionChips: chips,
      actions,
      confidence: 0.95,
      isRelaxed: false,
      isFallback: false
    }, 'search', 'search', null);
  }

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
    const chips = createFollowupChips('roles', { role: targetRole }, safeQuery, { role: targetRole });
    return respond({
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
    }, intent, targetRole, null);
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
    const chips = createFollowupChips(intent, safeContext, safeQuery, entities);
    return respond({
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
    }, intent, entities.section, null);
  }

  // 5. Layer C, D, E: Search Catalog with Dynamic Relaxation Pre-Check
  const searchResult = searchPortfolioIndex(safeQuery, safeContext);
  const isRelaxedSearchMatch = searchResult.relaxed && searchResult.results.length > 0;

  // If High-Confidence Core Intent recognized (>= 0.75) and NOT a relaxed cross-track match, synthesize authoritative response
  if (confidence >= 0.75 && intent !== 'fallback' && !isRelaxedSearchMatch) {
    const text = buildIntentText(intent, entities, safeContext, lang, searchResult.results, safeQuery);
    const actions = createActionButtons(intent, entities, safeContext, lang, searchResult.results, safeQuery);
    const chips = createFollowupChips(intent, safeContext, safeQuery, entities);
    return respond({
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
    }, intent, entities?.projectId ? getTopicForCaseStudy(entities.projectId) : intent, entities?.projectId || matchProjectKeyword(safeQuery));
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
    const chips = createFollowupChips(resolvedIntent, safeContext, safeQuery, { ...entities, projectId: caseId });
    return respond({
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
    }, resolvedIntent, caseId ? getTopicForCaseStudy(caseId) : resolvedIntent, caseId);
  }

  const finalIntent = intent === 'ambiguous' ? 'ambiguous' : 'fallback';
  const fallbackText = buildIntentText(finalIntent, entities, safeContext, lang, [], safeQuery);
  const fallbackActions = createActionButtons(finalIntent, entities, safeContext, lang);
  const fallbackChips = createFollowupChips(finalIntent, safeContext, safeQuery, entities);

  return respond({
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
  }, finalIntent, 'fallback', null);
}

export function queryAssistant(query, context = { role: 'overview', audience: 'all' }) {
  const safeQuery = typeof query === 'string' ? query.trim() : '';
  const safeContext = {
    role: context?.role || 'overview',
    audience: context?.audience || 'all',
    language: context?.language || 'auto'
  };

  const detectedLang = detectLanguage(safeQuery);
  const requestedLang = safeContext.language || 'auto';

  // Determine active language mode:
  // - If language is 'bilingual': output both pure English followed by pure Devanagari Hindi.
  // - If language is 'en': output ONLY clean English response.
  // - If language is 'hi' or input is Hinglish: output ONLY clean Devanagari Hindi response.
  let targetLang = requestedLang;
  if (requestedLang === 'bilingual') {
    targetLang = 'bilingual';
  } else if (requestedLang === 'en') {
    targetLang = 'en';
  } else if (requestedLang === 'hi' || detectedLang === 'hinglish' || detectedLang === 'hi') {
    targetLang = 'hi';
  } else {
    targetLang = 'en';
  }

  if (targetLang === 'bilingual') {
    const enRes = generateSingleResponse(safeQuery, { ...safeContext, language: 'en' }, 'en');
    const hiRes = generateSingleResponse(safeQuery, { ...safeContext, language: 'hi' }, 'hi');
    const enText = enRes?.text || '';
    const hiText = hiRes?.text || '';
    const combinedText = (enText && hiText && enText !== hiText)
      ? `${enText}\n\n---\n\n${hiText}`
      : (enText || hiText);

    return {
      ...enRes,
      id: enRes?.id || `resp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      language: 'bilingual',
      text: combinedText,
      chips: enRes?.chips || hiRes?.chips || [],
      suggestionChips: enRes?.suggestionChips || hiRes?.suggestionChips || [],
      actions: enRes?.actions || hiRes?.actions || []
    };
  }

  return generateSingleResponse(safeQuery, safeContext, targetLang);
}

export function getInitialSuggestions(context = { role: 'overview', audience: 'all' }) {
  return createFollowupChips('initial', context || {});
}

export function clearSessionMemory() {
  resetConversationalContext();
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
  CHAT_SLASH_COMMANDS,
  handleSlashCommand,
  cleanMarkdownAsterisks,
  tuneResponseEmojis,
  getOnboardingDecisionTree,
  queryAssistant,
  generateSingleResponse,
  getInitialSuggestions,
  clearSessionMemory,
  createSessionMemory,
  getConversationalContext,
  updateConversationalContext,
  resetConversationalContext,
  resolveAnaphoricReferences,
  detectComparativeQuery,
  detectCompoundQuery,
  getDynamicContextualChips,
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
