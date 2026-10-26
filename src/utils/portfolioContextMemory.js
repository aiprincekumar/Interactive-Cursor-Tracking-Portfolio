/**
 * Portfolio Context Memory & Coreference Resolver
 * Pure ESM, 100% Offline & Deterministic RAG Engine
 * Zero external dependencies, zero network requests.
 */

import { CASE_STUDIES } from '../data/caseStudiesData.js';
import { SKILLS_DATA } from '../data/skillsData.js';

/**
 * Authentic Quotation Data for all 3 professional tracks
 */
export const QUOTATION_DATA = {
  accounting: {
    trackName: 'Accounting & Statutory Tax Advisory',
    trackName_hi: 'लेखांकन और वैधानिक कर परामर्श',
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
    trackName_hi: 'MIS और संचालन डेटा प्रणालियाँ',
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
    trackName_hi: 'AI और वेब इंजीनियरिंग / Vibe Coding',
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

/**
 * Active conversational context state
 */
let sessionMemoryInstance = null;

export function createSessionMemory() {
  return {
    lastIntent: null,
    lastTopic: null,          // e.g. '01', 'gst', 'pricing', 'tally', 'biodata', 'skills'
    lastCaseStudyId: null,    // e.g. '01', '02', '07'
    lastRole: null,           // 'accountant' | 'mis' | 'vibe_coding' | 'overview'
    entityStack: [],          // LIFO stack of discussed topics [{ intent, topic, caseStudyId, role, timestamp }]
    turnsCount: 0
  };
}

export function getConversationalContext() {
  if (!sessionMemoryInstance) {
    sessionMemoryInstance = createSessionMemory();
  }
  return sessionMemoryInstance;
}

export function updateConversationalContext(intentOrObj, topic, caseStudyId, role, entities) {
  let inIntent, inTopic, inCaseStudyId, inRole, inEntities;
  if (intentOrObj && typeof intentOrObj === 'object') {
    inIntent = intentOrObj.intent;
    inTopic = intentOrObj.topic;
    inCaseStudyId = intentOrObj.caseStudyId;
    inRole = intentOrObj.role;
    inEntities = intentOrObj.entities || {};
  } else {
    inIntent = intentOrObj;
    inTopic = topic;
    inCaseStudyId = caseStudyId;
    inRole = role;
    inEntities = entities || {};
  }

  const ctx = getConversationalContext();
  if (inIntent) ctx.lastIntent = inIntent;
  if (inTopic) ctx.lastTopic = inTopic;
  if (inCaseStudyId) ctx.lastCaseStudyId = inCaseStudyId;
  if (inRole) ctx.lastRole = inRole;

  if (!ctx.lastCaseStudyId && inEntities?.projectId) {
    ctx.lastCaseStudyId = inEntities.projectId;
  }

  const newEntry = {
    intent: inIntent || ctx.lastIntent,
    topic: inTopic || ctx.lastTopic,
    caseStudyId: inCaseStudyId || ctx.lastCaseStudyId,
    role: inRole || ctx.lastRole,
    timestamp: Date.now()
  };

  const lastEntry = ctx.entityStack[ctx.entityStack.length - 1];
  if (!lastEntry || lastEntry.caseStudyId !== newEntry.caseStudyId || lastEntry.topic !== newEntry.topic || lastEntry.intent !== newEntry.intent) {
    ctx.entityStack.push(newEntry);
    if (ctx.entityStack.length > 20) {
      ctx.entityStack.shift();
    }
  }

  ctx.turnsCount += 1;
  return ctx;
}

export function resetConversationalContext() {
  sessionMemoryInstance = createSessionMemory();
  return sessionMemoryInstance;
}

/**
 * Mapping of ordinal phrases to Case Study IDs
 */
const ORDINAL_MAP = [
  { regex: /\b(first one|the first one|1st one|first project|1st project)\b/i, id: '01' },
  { regex: /\b(second one|the second one|2nd one|second project|2nd project)\b/i, id: '02' },
  { regex: /\b(third one|the third one|3rd one|third project|3rd project)\b/i, id: '03' },
  { regex: /\b(fourth one|the fourth one|4th one|fourth project|4th project)\b/i, id: '04' },
  { regex: /\b(fifth one|the fifth one|5th one|fifth project|5th project)\b/i, id: '05' },
  { regex: /\b(sixth one|the sixth one|6th one|sixth project|6th project)\b/i, id: '06' },
  { regex: /\b(seventh one|the seventh one|7th one|seventh project|7th project)\b/i, id: '07' },
  { regex: /\b(eighth one|the eighth one|8th one|eighth project|8th project)\b/i, id: '08' },
  { regex: /\b(ninth one|the ninth one|9th one|ninth project|9th project|last one|the last one)\b/i, id: '09' }
];

/**
 * Sub-intent detection patterns for anaphoric references
 */
const SUB_INTENT_PATTERNS = {
  pricing: /\b(cost|pricing|price|quotation|quote|rate|fees|fee|charge|charges|how much|kharcha|kitna charge|kitna kharch|kitne paise|paisa)\b/i,
  outcome: /\b(outcome|outcomes|result|results|impact|metrics|achievement|achieve|success rate|kya result|kya impact)\b/i,
  tech_stack: /\b(tech stack|technologies|technology|stack|tools|tools used|built with|built on|kaunse tools|kaunsa stack)\b/i,
  challenge: /\b(challenge|challenges|hurdle|hurdles|pain point|pain points|obstacle|problem|kya dikkat|kya pareshani)\b/i,
  solution: /\b(solution|solutions|how did you solve|approach|architecture|kaise solve kiya|kya solution)\b/i,
  details: /\b(tell me more|more about|more details|explain further|elaborate|deep dive|details|aur batao|iski jankari)\b/i
};

/**
 * Pronouns and contextual deictic tokens
 */
const PRONOUN_REGEX = /\b(that|it|this|these|those|its|the project|that project|this project|the case study|that case study|this case study|the work|that work|yeh|woh|iska|iski|uske|uski|isme)\b/i;

/**
 * Resolve anaphoric references and pronouns to preceding conversation state
 */
export function resolveAnaphoricReferences(query, context = null) {
  if (!query || typeof query !== 'string') {
    return { isAnaphoric: false, resolvedQuery: query, resolvedEntity: null };
  }

  const q = query.trim().toLowerCase();
  const activeCtx = context || getConversationalContext();

  // 1. Detect Ordinal references (e.g. "tell me about the second one")
  for (const ord of ORDINAL_MAP) {
    if (ord.regex.test(q)) {
      const subIntent = detectSubIntent(q);
      return {
        isAnaphoric: true,
        resolvedQuery: `Case Study ${ord.id} ${subIntent || 'details'}`,
        resolvedEntity: {
          caseStudyId: ord.id,
          topic: getTopicForCaseStudy(ord.id),
          role: getRoleForCaseStudy(ord.id),
          subIntent
        }
      };
    }
  }

  // 2. Detect Pronoun or contextual follow-up phrases
  const hasPronoun = PRONOUN_REGEX.test(q);
  const subIntent = detectSubIntent(q);

  // Anaphoric follow-up phrases explicitly referring to preceding context
  const hasExplicitFollowupPhrase = /\b(for that|for this|of this|of that|about it|about that|about this|in that|in this|for it|on this|on that)\b/i.test(q)
    || /\b(how much do you charge|cost of this|pricing for that|tell me more|what was the outcome|what were the results|tech stack used|tools used in this)\b/i.test(q);

  // Queries that name their own distinct subject are standalone, not anaphoric follow-ups
  const hasOwnSubject = /\b(mvp project|saas generator|power bi|powerbi|day-nulm|nulm|smart card|biometric|matrimonial|biodata|resume|cv|family background|where are you located|how can i contact)\b/i.test(q);

  const isFollowUpPattern = subIntent && !hasOwnSubject && (hasPronoun || hasExplicitFollowupPhrase);

  if (isFollowUpPattern) {
    // Find active entity from LIFO stack or lastCaseStudyId
    let targetCaseStudyId = activeCtx?.lastCaseStudyId || null;
    let targetTopic = activeCtx?.lastTopic || null;
    let targetRole = activeCtx?.lastRole || null;

    if (!targetCaseStudyId && activeCtx?.entityStack?.length > 0) {
      for (let i = activeCtx.entityStack.length - 1; i >= 0; i--) {
        const item = activeCtx.entityStack[i];
        if (item.caseStudyId) {
          targetCaseStudyId = item.caseStudyId;
          targetTopic = item.topic || targetTopic;
          targetRole = item.role || targetRole;
          break;
        }
      }
    }

    if (targetCaseStudyId) {
      const topicName = targetTopic || getTopicForCaseStudy(targetCaseStudyId);
      const roleName = targetRole || getRoleForCaseStudy(targetCaseStudyId);

      return {
        isAnaphoric: true,
        resolvedQuery: `Case Study ${targetCaseStudyId} ${topicName} ${subIntent}`,
        resolvedEntity: {
          caseStudyId: targetCaseStudyId,
          topic: topicName,
          role: roleName,
          subIntent
        }
      };
    }

    // If no caseStudyId but active topic or role exists
    if (targetTopic || targetRole) {
      return {
        isAnaphoric: true,
        resolvedQuery: `${targetTopic || targetRole} ${subIntent}`,
        resolvedEntity: {
          caseStudyId: null,
          topic: targetTopic,
          role: targetRole,
          subIntent
        }
      };
    }
  }

  return { isAnaphoric: false, resolvedQuery: query, resolvedEntity: null };
}

function detectSubIntent(query) {
  if (SUB_INTENT_PATTERNS.pricing.test(query)) return 'pricing';
  if (SUB_INTENT_PATTERNS.outcome.test(query)) return 'outcome';
  if (SUB_INTENT_PATTERNS.tech_stack.test(query)) return 'tech_stack';
  if (SUB_INTENT_PATTERNS.challenge.test(query)) return 'challenge';
  if (SUB_INTENT_PATTERNS.solution.test(query)) return 'solution';
  if (SUB_INTENT_PATTERNS.details.test(query)) return 'details';
  return null;
}

export function getTopicForCaseStudy(id) {
  const map = {
    '01': 'gst',
    '02': 'tally',
    '03': 'day-nulm',
    '04': 'smart-card',
    '05': 'power-bi',
    '06': 'audit',
    '07': 'ai-saas',
    '08': 'multi-agent',
    '09': 'synthesizer'
  };
  return map[id] || 'project';
}

export function getRoleForCaseStudy(id) {
  if (['01', '02', '06'].includes(id)) return 'accountant';
  if (['03', '04', '05'].includes(id)) return 'mis';
  return 'vibe_coding';
}

/**
 * Comparative Query Detector & Disambiguator
 */
export function detectComparativeQuery(query, context = {}) {
  if (!query || typeof query !== 'string') return null;
  const q = query.trim().toLowerCase();

  const isComparative =
    /\b(compare|difference between|vs|versus|antar|behtar|kisme kya)\b/i.test(q);

  if (!isComparative) return null;

  // Check comparison targets:
  // 1. Accountant vs Vibe Coder
  const mentionsAccountant = /\b(accountant|accounting|ca|tax|tally|gst)\b/i.test(q);
  const mentionsVibeCoder = /\b(vibe coder|vibe coding|vibe|ai saas|fullstack|react|web app|coding)\b/i.test(q);
  const mentionsMIS = /\b(mis|excel|data operations|puda|biometric)\b/i.test(q);

  // 2. Specific case study comparisons: Case 01 vs Case 07 / Tally vs AI SaaS
  const mentionsCase01 = /\b(case study 01|project 01|gst engine|gst)\b/i.test(q);
  const mentionsCase07 = /\b(case study 07|project 07|ai saas|saas)\b/i.test(q);

  if (mentionsAccountant && mentionsVibeCoder) {
    return buildRoleComparison('accountant', 'vibe_coding', context);
  }

  if (mentionsAccountant && mentionsMIS) {
    return buildRoleComparison('accountant', 'mis', context);
  }

  if (mentionsMIS && mentionsVibeCoder) {
    return buildRoleComparison('mis', 'vibe_coding', context);
  }

  if (mentionsCase01 && mentionsCase07) {
    return buildCaseStudyComparison('01', '07', context);
  }

  // Generic comparative fallback across Atul's dual tracks
  if (isComparative) {
    return buildRoleComparison('accountant', 'vibe_coding', context);
  }

  return null;
}

function buildRoleComparison(roleA, roleB, context = {}) {
  const roleNames = {
    accountant: {
      title: 'Corporate Accountant & Statutory Tax Advisory',
      philosophy: 'Zero-tolerance accuracy, statutory compliance, audit-proof ledgers',
      tools: 'Tally Prime, Advanced Excel VBA, GST Portal, Form 26AS/AIS, Challan 280/281',
      deliverables: 'GSTR-1/3B/9 e-filings, BRS, Balance Sheet dossiers, ITC 2B reconciliations',
      pricing: '₹2,500 – ₹4,500/filing | ₹4,500 – ₹8,000 monthly retainer'
    },
    mis: {
      title: 'MIS Coordinator & Data Operations Specialist',
      philosophy: 'High-throughput operational fidelity, government telemetry, dataset cleansing',
      tools: 'Advanced Excel macros, Power BI DAX, PUDA/DAY-NULM government portals, RSBY smart card engines',
      deliverables: 'Executive KPI dashboards, 450k+ biometric records, 10k+ row data cleaning',
      pricing: '₹2,500 – ₹4,000/module | ₹5,000 – ₹9,000 monthly retainer'
    },
    vibe_coding: {
      title: 'AI Full-Stack Engineer & Vibe Coder',
      philosophy: 'Rapid prompt-to-production velocity, autonomous agent loops, modern UX elegance',
      tools: 'Next.js 14, React 19, Tailwind CSS, Claude Code, Cursor/Windsurf, PostgreSQL, LLM APIs',
      deliverables: 'Full-stack SaaS MVP prototypes, multi-agent pipelines, generative UI widgets',
      pricing: '₹14,000 – ₹18,000/prototype | ₹22,000 – ₹35,000 MVP package'
    }
  };

  const a = roleNames[roleA] || roleNames.accountant;
  const b = roleNames[roleB] || roleNames.vibe_coding;

  const markdown = `⚖️ **Comparative Analysis: ${a.title} vs ${b.title}**

| Key Aspect | ${a.title} | ${b.title} |
| :--- | :--- | :--- |
| **Core Philosophy** | ${a.philosophy} | ${b.philosophy} |
| **Primary Tooling** | ${a.tools} | ${b.tools} |
| **Key Deliverables** | ${a.deliverables} | ${b.deliverables} |
| **Quotation / Rate** | ${a.pricing} | ${b.pricing} |

💡 **The Atul Verma Advantage**: Atul is not *either/or* — he bridges both worlds. He brings **10+ years of rigorous statutory financial discipline** directly into **modern AI-accelerated software engineering**, ensuring your prototypes are backed by real commercial business logic.`;

  const chips = [
    { id: 'cmp-sw-a', label: `🔄 Switch to ${roleA.toUpperCase()} Track`, query: `switch to ${roleA} track`, category: 'hire' },
    { id: 'cmp-sw-b', label: `🔄 Switch to ${roleB.toUpperCase()} Track`, query: `switch to ${roleB} track`, category: 'hire' },
    { id: 'cmp-quote', label: '💰 Compare Fee Estimates', query: 'estimate quotation and service fees', category: 'hire' },
    { id: 'cmp-cs', label: '🚀 View All 9 Case Studies', query: 'show me your project case studies', category: 'projects' }
  ];

  const actions = [
    {
      type: 'switch-role-tab',
      label: `🔄 Switch to ${roleA.toUpperCase()} Track`,
      target: roleA,
      payload: { role: roleA }
    },
    {
      type: 'switch-role-tab',
      label: `🔄 Switch to ${roleB.toUpperCase()} Track`,
      target: roleB,
      payload: { role: roleB }
    },
    {
      type: 'switch-contact-tab',
      label: '💰 Open Quotation Calculator',
      target: 'quote',
      payload: { tab: 'quote' }
    }
  ];

  return {
    id: `cmp_${Date.now()}`,
    intent: 'compare',
    language: 'en',
    text: markdown,
    chips,
    suggestionChips: chips,
    actions,
    confidence: 0.95,
    isRelaxed: false,
    isFallback: false
  };
}

function buildCaseStudyComparison(idA, idB, context = {}) {
  const csA = CASE_STUDIES.find(c => c.id === idA) || CASE_STUDIES[0];
  const csB = CASE_STUDIES.find(c => c.id === idB) || CASE_STUDIES[6];

  const markdown = `⚖️ **Comparative Project Analysis: Case Study #${csA.id} vs Case Study #${csB.id}**

| Parameter | Case #${csA.id}: ${csA.title} | Case #${csB.id}: ${csB.title} |
| :--- | :--- | :--- |
| **Domain Track** | ${csA.trackBadge || csA.role} | ${csB.trackBadge || csB.role} |
| **Category** | ${csA.category} | ${csB.category} |
| **Core Stack** | ${csA.techStack.slice(0, 4).join(', ')} | ${csB.techStack.slice(0, 4).join(', ')} |
| **Key Metric** | ${csA.metrics[0]?.label}: **${csA.metrics[0]?.val}** (${csA.metrics[0]?.desc}) | ${csB.metrics[0]?.label}: **${csB.metrics[0]?.val}** (${csB.metrics[0]?.desc}) |
| **Accuracy / Outcome** | ${csA.metrics[1]?.label}: **${csA.metrics[1]?.val}** | ${csB.metrics[1]?.label}: **${csB.metrics[1]?.val}** |

Both case studies showcase end-to-end execution: Case #${csA.id} demonstrates statutory governance, while Case #${csB.id} demonstrates modern full-stack velocity.`;

  const chips = [
    { id: `cmp-cs-${idA}`, label: `🔍 Inspect Case Study #${idA}`, query: `tell me about case study ${idA}`, category: 'projects' },
    { id: `cmp-cs-${idB}`, label: `🔍 Inspect Case Study #${idB}`, query: `tell me about case study ${idB}`, category: 'projects' },
    { id: 'cmp-quote', label: '💰 Quotation & Fees', query: 'estimate quotation and service fees', category: 'hire' },
    { id: 'cmp-resume', label: '📄 Download Resume', query: 'download resume', category: 'hire' }
  ];

  const actions = [
    {
      type: 'open-case-study',
      label: `🔍 Open Case Study #${idA}`,
      target: idA,
      payload: { id: idA }
    },
    {
      type: 'open-case-study',
      label: `🔍 Open Case Study #${idB}`,
      target: idB,
      payload: { id: idB }
    }
  ];

  return {
    id: `cmp_${Date.now()}`,
    intent: 'compare',
    language: 'en',
    text: markdown,
    chips,
    suggestionChips: chips,
    actions,
    confidence: 0.95,
    isRelaxed: false,
    isFallback: false
  };
}

/**
 * Compound Query Detector (e.g., "Tell me about Case Study 01 and how much it costs")
 */
export function detectCompoundQuery(query, context = {}) {
  if (!query || typeof query !== 'string') return null;
  const q = query.trim().toLowerCase();

  const hasConjunction = /\b(and|along with|plus|as well as|aur|sath hi)\b/i.test(q);
  if (!hasConjunction) return null;

  // Pattern: (Case Study X / Project X) AND (cost / pricing / quote)
  const caseMatch = q.match(/\b(case study|project)\s*(0?[1-9])\b/i);
  const wantsPricing = /\b(costs?|pricing|prices?|quotations?|quotes?|rates?|fees?|charges?|how much|kharcha|kitna)\b/i.test(q);
  const wantsResume = /\b(resume|cv|download cv|download resume|naukri)\b/i.test(q);

  if (caseMatch && (wantsPricing || wantsResume)) {
    const rawId = caseMatch[2];
    const caseId = rawId.padStart(2, '0');
    const cs = CASE_STUDIES.find(c => c.id === caseId);

    if (cs) {
      if (wantsPricing) {
        return buildCompoundProjectPricingResponse(cs, context);
      }
      if (wantsResume) {
        return buildCompoundProjectResumeResponse(cs, context);
      }
    }
  }

  return null;
}

function buildCompoundProjectPricingResponse(cs, context = {}) {
  const roleKey = getRoleForCaseStudy(cs.id);
  const quoteData = QUOTATION_DATA[roleKey === 'vibe_coding' ? 'ai_web' : (QUOTATION_DATA[roleKey] ? roleKey : 'accounting')] || QUOTATION_DATA.accounting;

  const pricingList = quoteData.services
    .map(s => `- **${s.label}**: ₹${s.cost.toLocaleString('en-IN')}`)
    .join('\n');

  const markdown = `📊 **Case Study #${cs.id}: ${cs.title}**
*${cs.subtitle}*

${cs.summary}

---

💰 **Commercial Pricing & Fee Estimate for this Domain:**
${pricingList}

**Base Engagement**: ₹${quoteData.minBase.toLocaleString('en-IN')} – ₹${quoteData.maxBase.toLocaleString('en-IN')}

Click below to open the interactive quotation estimator or inspect the full case study dossier!`;

  const chips = getDynamicContextualChips(cs.id, context);

  const actions = [
    {
      type: 'open-case-study',
      label: `🔍 Inspect Case Study #${cs.id}`,
      target: cs.id,
      payload: { id: cs.id }
    },
    {
      type: 'open-estimator',
      label: '💰 Open Quotation Calculator',
      target: 'quote',
      payload: { track: roleKey === 'vibe_coding' ? 'ai_web' : roleKey }
    },
    {
      type: 'scroll',
      label: '📍 View Projects Section',
      target: '#projects',
      payload: { selector: '#projects' }
    }
  ];

  return {
    id: `comp_${Date.now()}`,
    intent: 'compound_project_pricing',
    language: 'en',
    text: markdown,
    chips,
    suggestionChips: chips,
    actions,
    confidence: 0.95,
    isRelaxed: false,
    isFallback: false
  };
}

function buildCompoundProjectResumeResponse(cs, context = {}) {
  const roleKey = getRoleForCaseStudy(cs.id);
  const markdown = `📊 **Case Study #${cs.id}: ${cs.title}**
*${cs.subtitle}*

${cs.summary}

---

📄 **Role Resume Download:**
Atul's verified **${roleKey.toUpperCase()}** resume includes full technical methodology, production metrics, and employer endorsements for this project.`;

  const chips = getDynamicContextualChips(cs.id, context);

  const actions = [
    {
      type: 'open-case-study',
      label: `🔍 Inspect Case Study #${cs.id}`,
      target: cs.id,
      payload: { id: cs.id }
    },
    {
      type: 'open-link',
      label: `📄 Download ${roleKey.toUpperCase()} Resume PDF`,
      target: `./assets/Atul_Verma_${roleKey === 'vibe_coding' ? 'Vibe_Coder' : (roleKey === 'mis' ? 'MIS' : 'Accountant')}_Resume.pdf`
    }
  ];

  return {
    id: `comp_${Date.now()}`,
    intent: 'compound_project_resume',
    language: 'en',
    text: markdown,
    chips,
    suggestionChips: chips,
    actions,
    confidence: 0.95,
    isRelaxed: false,
    isFallback: false
  };
}

/**
 * Contextual Dynamic Suggestion Chips Generator
 * Strictly derives chips from active topic / entity with 100% valid category tags
 */
export function getDynamicContextualChips(caseStudyIdOrTopic, context = {}) {
  const c = (id, label, query, category) => ({ id, label, query: query || label, category });
  const rawId = String(caseStudyIdOrTopic || '').replace(/^cs-?/, '');
  const id = rawId.padStart(2, '0');

  const chipMap = {
    '01': [
      c('cs-01-rec', '📊 GSTR-2B Reconciliation', 'explain GST ITC matching and GSTR-2B reconciliation', 'tax'),
      c('cs-01-quote', '💰 Tax Filing Quote', 'what are your tax filing fees and charges', 'tax'),
      c('cs-01-res', '💼 Accountant Resume', 'download verified accountant resume', 'hire'),
      c('cs-01-deep', '🔍 Inspect Case Study #01', 'tell me about case study 01 gst engine', 'projects')
    ],
    '02': [
      c('cs-02-brs', '📊 Tally Prime BRS', 'tell me about tally prime and bank reconciliation', 'tax'),
      c('cs-02-quote', '💰 Multi-Company Retainer', 'tally prime accounting monthly charges', 'tax'),
      c('cs-02-res', '💼 Accountant Resume', 'download verified accountant resume', 'hire'),
      c('cs-02-deep', '🔍 Inspect Case Study #02', 'tell me about case study 02 tally prime', 'projects')
    ],
    '03': [
      c('cs-03-mis', '📈 DAY-NULM Portal MIS', 'tell me about day-nulm government portal operations', 'experience'),
      c('cs-03-vba', '📊 Excel VBA Automation', 'tell me about excel vba macro automation', 'tech'),
      c('cs-03-res', '💼 Operations Resume', 'download mis operations resume', 'hire'),
      c('cs-03-deep', '🔍 Inspect Case Study #03', 'tell me about case study 03 day nulm', 'projects')
    ],
    '04': [
      c('cs-04-ops', '🪪 Smart Card Operations', 'tell me about smart card biometric enrollment', 'experience'),
      c('cs-04-vol', '👥 450k Biometric Enrollments', 'how many biometric records did you process', 'experience'),
      c('cs-04-res', '💼 MIS Resume', 'download mis resume', 'hire'),
      c('cs-04-deep', '🔍 Inspect Case Study #04', 'tell me about case study 04 smart card', 'projects')
    ],
    '05': [
      c('cs-05-dax', '📊 Power BI DAX Dashboards', 'tell me about power bi dashboards', 'tech'),
      c('cs-05-kpi', '📈 Fiscal Telemetry', 'show fiscal intelligence kpi dashboard', 'tech'),
      c('cs-05-res', '💼 Power BI Resume', 'download resume', 'hire'),
      c('cs-05-deep', '🔍 Inspect Case Study #05', 'tell me about case study 05 power bi', 'projects')
    ],
    '06': [
      c('cs-06-audit', '📑 Corporate Financial Audit', 'tell me about corporate audit and internal controls', 'tax'),
      c('cs-06-ctrl', '⚖️ Internal Controls', 'what internal audit governance did you establish', 'tax'),
      c('cs-06-res', '💼 Audit Advisor Resume', 'download verified resume', 'hire'),
      c('cs-06-deep', '🔍 Inspect Case Study #06', 'tell me about case study 06 corporate audit', 'projects')
    ],
    '07': [
      c('cs-07-live', '⚡ Live Prototype Demo', 'show me ai saas mvp generator demo', 'tech'),
      c('cs-07-saas', '🤖 Next.js AI SaaS', 'tell me about full-stack next.js saas generator', 'tech'),
      c('cs-07-quote', '💰 MVP Prototype Quote', 'how much does an mvp prototype cost', 'hire'),
      c('cs-07-res', '💼 Vibe Coder Resume', 'download vibe coder resume', 'hire')
    ],
    '08': [
      c('cs-08-agent', '🤖 Multi-Agent Engine', 'tell me about autonomous multi-agent llm workflow engine', 'tech'),
      c('cs-08-loops', '⚡ Claude Code Loops', 'explain claude code agent loops', 'tech'),
      c('cs-08-quote', '💰 Agentic Workflow Quote', 'what are your fees for multi-agent workflows', 'hire'),
      c('cs-08-res', '💼 AI Engineer Resume', 'download resume', 'hire')
    ],
    '09': [
      c('cs-09-syn', '📄 AI Code Synthesizer', 'tell me about ai document and code synthesizer', 'tech'),
      c('cs-09-prompt', '⚡ Prompt Architecture', 'explain prompt architecture and code synthesis', 'tech'),
      c('cs-09-quote', '💰 Synthesizer Quote', 'how much for ai code synthesizer project', 'hire'),
      c('cs-09-res', '💼 Vibe Coder Resume', 'download resume', 'hire')
    ]
  };

  if (chipMap[id]) {
    return chipMap[id];
  }

  // Fallback default contextual chips
  return [
    c('dyn-cs01', '🧮 GST Compliance #01', 'tell me about case study 01 gst engine', 'projects'),
    c('dyn-cs07', '⚡ AI SaaS MVP #07', 'tell me about case study 07 ai saas generator', 'projects'),
    c('dyn-quote', '💰 Fee Quotation Calculator', 'estimate quotation and service fees', 'hire'),
    c('dyn-res', '📄 Download Verified Resume', 'download resume', 'hire')
  ];
}

/**
 * Synthesize Contextual RAG Response for Anaphoric Follow-ups
 */
export function synthesizeContextualResponse(resolvedEntity, safeContext = {}, lang = 'en') {
  const { caseStudyId, subIntent, role } = resolvedEntity;
  const cs = CASE_STUDIES.find(c => c.id === caseStudyId) || CASE_STUDIES[0];
  const roleKey = role || getRoleForCaseStudy(cs.id);
  const responseId = `ctx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const isHi = lang === 'hi';

  const chips = getDynamicContextualChips(cs.id, safeContext);
  let text = '';
  const actions = [];

  switch (subIntent) {
    case 'pricing': {
      const qData = QUOTATION_DATA[roleKey === 'vibe_coding' ? 'ai_web' : (QUOTATION_DATA[roleKey] ? roleKey : 'accounting')] || QUOTATION_DATA.accounting;
      const serviceBreakdown = qData.services.map(s => `- **${s.label}**: ₹${s.cost.toLocaleString('en-IN')}`).join('\n');
      text = isHi
        ? `💰 **केस स्टडी #${cs.id} (${cs.title_hi || cs.title}) के लिए सेवा शुल्क एवं अनुमानित लागत:**\n\n${serviceBreakdown}\n\n**न्यूनतम मासिक रिटेनर:** ₹${qData.minBase.toLocaleString('en-IN')} – ₹${qData.maxBase.toLocaleString('en-IN')}\n\nकस्टम कोटेशन या प्रोजेक्ट स्कोपिंग के लिए नीचे दिए गए बटन पर क्लिक करें।`
        : `💰 **Quotation & Commercial Fee Breakdown for Case Study #${cs.id}: ${cs.title}**\n\n${serviceBreakdown}\n\n**Base Engagement Tier**: ₹${qData.minBase.toLocaleString('en-IN')} – ₹${qData.maxBase.toLocaleString('en-IN')}\n\nClick below to open the interactive quotation calculator or contact Atul directly on WhatsApp.`;

      actions.push({
        type: 'open-estimator',
        label: isHi ? '💰 कोटेशन कैलकुलेटर खोलें' : '💰 Open Quotation Calculator',
        target: 'quote',
        payload: { track: roleKey === 'vibe_coding' ? 'ai_web' : roleKey }
      });
      actions.push({
        type: 'open-case-study',
        label: isHi ? `🔍 केस स्टडी #${cs.id} खोलें` : `🔍 Inspect Case Study #${cs.id}`,
        target: cs.id,
        payload: { id: cs.id }
      });
      break;
    }

    case 'outcome': {
      const metricList = cs.metrics.map(m => `- **${isHi ? (m.label_hi || m.label) : m.label}**: **${m.val}** (${isHi ? (m.desc_hi || m.desc) : m.desc})`).join('\n');
      text = isHi
        ? `📈 **केस स्टडी #${cs.id} (${cs.title_hi || cs.title}) के मुख्य परिणाम एवं मेट्रिक्स:**\n\n${metricList}\n\n${cs.summary_hi || cs.summary}`
        : `📈 **Key Outcomes & Production Metrics for Case Study #${cs.id}: ${cs.title}**\n\n${metricList}\n\n${cs.summary}`;

      actions.push({
        type: 'open-case-study',
        label: isHi ? `🔍 पूरी केस स्टडी #${cs.id} देखें` : `🔍 View Full Case Study #${cs.id}`,
        target: cs.id,
        payload: { id: cs.id }
      });
      break;
    }

    case 'tech_stack': {
      const stackList = cs.techStack.map(t => `\`${t}\``).join(', ');
      text = isHi
        ? `⚙️ **केस स्टडी #${cs.id} में प्रयुक्त तकनीकी स्टैक (Tech Stack):**\n\n${stackList}\n\nइस प्रोजेक्ट में उत्पादन-ग्रेड विश्वसनीयता के लिए यह स्टैक अनुकूलित किया गया था।`
        : `⚙️ **Technologies & Tooling Used in Case Study #${cs.id}: ${cs.title}**\n\n${stackList}\n\nConfigured and battle-tested for production resilience and compliance.`;

      actions.push({
        type: 'open-case-study',
        label: `🔍 Case Study #${cs.id} Architecture`,
        target: cs.id,
        payload: { id: cs.id }
      });
      break;
    }

    case 'challenge': {
      const ch = cs.challenge_hi || {};
      text = isHi
        ? `⚠️ **केस स्टडी #${cs.id} की मुख्य चुनौती (Challenge):**\n\n**${ch.title_hi || 'मुख्य वैधानिक समस्या'}**\n\n${ch.context_hi || cs.summary_hi || cs.summary}`
        : `⚠️ **Key Architectural Challenge for Case Study #${cs.id}: ${cs.title}**\n\n${cs.summary}\n\nAddressing edge cases, compliance mismatches, and data synchronization hurdles.`;

      actions.push({
        type: 'open-case-study',
        label: `🔍 Inspect Problem & Resolution #${cs.id}`,
        target: cs.id,
        payload: { id: cs.id }
      });
      break;
    }

    case 'solution':
    case 'details':
    default: {
      text = isHi
        ? `🧮 **केस स्टडी #${cs.id}: ${cs.title_hi || cs.title}**\n*${cs.subtitle_hi || cs.subtitle}*\n\n${cs.summary_hi || cs.summary}`
        : `🧮 **Case Study #${cs.id}: ${cs.title}**\n*${cs.subtitle}*\n\n${cs.summary}\n\n**Key Metric**: ${cs.metrics[0]?.label}: **${cs.metrics[0]?.val}** (${cs.metrics[0]?.desc})`;

      actions.push({
        type: 'open-case-study',
        label: isHi ? `🔍 केस स्टडी #${cs.id} खोलें` : `🔍 Inspect Case Study #${cs.id}`,
        target: cs.id,
        payload: { id: cs.id }
      });
      break;
    }
  }

  // Always offer WhatsApp contact option
  actions.push({
    type: 'open-link',
    label: isHi ? '💬 व्हाट्सएप पर चर्चा करें' : '💬 WhatsApp Consultation',
    target: 'https://wa.me/917992383804'
  });

  return {
    id: responseId,
    intent: `followup_${subIntent || 'details'}`,
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

export default {
  createSessionMemory,
  getConversationalContext,
  updateConversationalContext,
  resetConversationalContext,
  resolveAnaphoricReferences,
  detectComparativeQuery,
  detectCompoundQuery,
  getDynamicContextualChips,
  synthesizeContextualResponse,
  getTopicForCaseStudy,
  getRoleForCaseStudy,
  QUOTATION_DATA
};
