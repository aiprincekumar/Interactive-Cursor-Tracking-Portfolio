import fs from 'fs';
import path from 'path';

const file = path.resolve('src/utils/portfolioAssistantEngine.js');
let text = fs.readFileSync(file, 'utf8');

// 1. In buildIntentText, optimize repetitive cases
const buildIntentIndex = text.indexOf('function buildIntentText(');
if (buildIntentIndex === -1) {
  console.error('buildIntentText not found!');
  process.exit(1);
}

const findStart = "case 'experience':";
const findEnd = "case 'fallback':";

const startIndex = text.indexOf(findStart, buildIntentIndex);
const endIndex = text.indexOf(findEnd, startIndex);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

const compactCases = `case 'experience':
      return (isHi ? '💼 **कार्य अनुभव एवं करियर इतिहास (10+ वर्ष):**\\n\\n' : (isHinglish ? '💼 **Career Experience & Tenure (10+ Saal):**\\n\\n' : '💼 **Career Experience & Proven Track Record (10+ Years):**\\n\\n')) + expBody + (isHi || isHinglish ? '' : '\\n\\nExplore the tenure and career timeline below.');

    case 'services':
      return (isHi ? '💰 **सेवाएं, कंसल्टेंसी एवं परामर्श शुल्क:**\\n\\n' : (isHinglish ? '💰 **Services, Offerings & Consulting Rates:**\\n\\n' : '💰 **Consulting Services, Offerings & Advisory:**\\n\\n')) + srvBody;

    case 'client_info':
      return isHi
        ? '💰 **प्रोजेक्ट लागत, शुल्क, कीमत एवं कोटेशन (खर्च):**\\n\\n' + clientBody + '\\n\\nसटीक कोटेशन व लागत अनुमान हेतु कैलकुलेटर बटन का उपयोग करें।'
        : (isHinglish
          ? '💰 **Project Cost, Pricing, Kharcha & Quotation Estimator:**\\n\\n' + clientBody + '\\n\\nCustom quote aur pricing estimate calculate karne ke liye niche click karein!'
          : '💰 **Project Cost, Pricing, Fee Rates & Quotation Estimates:**\\n\\n' + clientBody + '\\n\\nClick below to open the interactive quotation estimator for a customized price breakdown.');

    case 'recruiter_info':
      return (isHi ? '📄 **रिक्रूटर एवं हायरिंग सूचना (रिज्यूमे डाउनलोड करें):**\\n\\n' : (isHinglish ? '📄 **Recruiter & Job Information (Download Resume / CV):**\\n\\n' : '📄 **Recruiter & Employment Information (Download Verified Resume PDF):**\\n\\n')) + recBody;

    case 'marriage_bio':
      return (isHi ? '❤️ **व्यक्तिगत एवं पारिवारिक विवरण (वैवाहिक बायोडाटा):**\\n\\n' : (isHinglish ? '❤️ **Personal & Family Background (Shaadi Biodata):**\\n\\n' : '❤️ **Personal & Matrimonial Bio-Data Demographics (Family Background):**\\n\\n')) + bioBody;

    case 'contact':
      return (isHi ? '📬 **सीधा संपर्क एवं परामर्श:**\\n\\n' : (isHinglish ? '📬 **Direct Contact & Sampark:**\\n\\n' : '📬 **Direct Contact & Consultation:**\\n\\n')) + contactBody;

    case 'availability':
      return (isHi ? '🕒 **कार्य उपलब्धता, वर्किंग समय एवं तत्काल नोटिस:**\\n\\n' : (isHinglish ? '🕒 **Working Hours & Immediate Availability:**\\n\\n' : '🕒 **Consultation Availability, Working Hours & Immediate Notice:**\\n\\n')) + availBody;

    case 'achievements':
      return (isHi ? '🏆 **सत्यापित उपलब्धियां, आंकड़े एवं रिकॉर्ड:**\\n\\n' : (isHinglish ? '🏆 **Key Achievements, Metrics & Records:**\\n\\n' : '🏆 **Verified Performance Achievements, Metrics & Volume Records:**\\n\\n')) + achBody;

    case 'suggestions':
      return (isHi ? '💡 **मैं क्या पूछ सकता हूँ? (विकल्प, सुझाव एवं मदद):**\\n\\n' : (isHinglish ? '💡 **Aap kya pooch sakte hain? (Guide, Options & Suggestions):**\\n\\n' : '💡 **How Can I Assist You Today? (Explore Options, Ask & Menu):**\\n\\n')) + sugBody;

    case 'ambiguous':
      return isHi
        ? '👋 **नमस्ते! मैं अतुल वर्मा का AI असिस्टेंट हूँ।**\\n\\nमैं टैक्स, अकाउंटिंग, सरकारी MIS, AI Vibe Coding और वैवाहिक बायोडाटा के प्रमाणित रिकॉर्ड्स में आपकी सहायता कर सकता हूँ। संपर्क या एक्सप्लोर करने के लिए नीचे चुनें:'
        : (isHinglish
          ? '👋 **Hello! Main Atul Verma ka AI Assistant hoon.**\\n\\nAap Atul ke verified records explore kar sakte hain, direct connect kar sakte hain, ya options pooch sakte hain:'
          : "👋 **Welcome! I am Atul's AI Assistant.**\\n\\nI can assist you with verified records across Tax, MIS, AI Vibe Coding, and Matrimonial Bio-Data. Please select a topic below to explore or connect directly:");

    case 'faq':
      return (isHi ? '📍 **कार्यालय एवं स्थान (Headquarters - स्थित):**\\n\\n' : (isHinglish ? '📍 **Office Location & Headquarters:**\\n\\n' : '📍 **Office Location & Headquarters (Where Located):**\\n\\n')) + faqBody;

    `;

text = text.slice(0, startIndex) + compactCases + text.slice(endIndex);

// 2. Add New Functions and Data Structures
const newAdditions = `
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
    .replace(/^(\\s*)\\*\\s+/gm, '$1• ')
    .replace(/\\*{3}(.*?)\\*{3}/g, '$1')
    .replace(/\\*{2}(.*?)\\*{2}/g, '$1')
    .replace(/\\*(.*?)\\*/g, '$1')
    .replace(/\\*/g, '')
    .trim();
}

export function tuneResponseEmojis(text, audience = 'all', options = { enabled: true }) {
  if (typeof text !== 'string') return '';
  const enabled = options?.enabled !== false && options?.emojis !== false;
  if (!enabled) {
    return text
      .replace(/[\\u{1F300}-\\u{1FAFF}\\u{2600}-\\u{27BF}\\u{FE0F}]/gu, '')
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
`;

const marker = '// 7. PUBLIC EXPORTED ASSISTANT API CONTRACTS';
text = text.replace(marker, newAdditions + '\n' + marker);

// Update queryAssistant returns
text = text.replace(
  `    return {
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
    };`,
  `    return formatAssistantResponse({
      id: responseId,
      intent: 'suggestions',
      language: 'en',
      text: "Hi there! 👋 I am Atul's AI Assistant. Feel free to ask about Atul's projects, experience, tech stack, tax consulting, or matrimonial bio-data!",
      chips,
      actions: createActionButtons('suggestions', {}, safeContext, 'en'),
      confidence: 1.0,
      isRelaxed: false,
      isFallback: false
    }, safeContext, context);`
);

text = text.replace(
  `    return {
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
    };`,
  `    return formatAssistantResponse({
      id: responseId,
      intent: 'faq',
      language: lang,
      text: answerText,
      chips,
      actions,
      confidence: Math.round(faqHit.score) / 100,
      isRelaxed: false,
      isFallback: false
    }, safeContext, context);`
);

text = text.replace(
  `    return {
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

  if (intent === 'navigation'`,
  `    return formatAssistantResponse({
      id: responseId,
      intent,
      language: lang,
      text,
      chips,
      actions,
      confidence: 0.95,
      isRelaxed: false,
      isFallback: false
    }, safeContext, context);
  }

  if (intent === 'navigation'`
);

text = text.replace(
  `    return {
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

  // 5. Layer C, D, E: Search Catalog`,
  `    return formatAssistantResponse({
      id: responseId,
      intent,
      language: lang,
      text,
      chips,
      actions,
      confidence: 0.95,
      isRelaxed: false,
      isFallback: false
    }, safeContext, context);
  }

  // 5. Layer C, D, E: Search Catalog`
);

text = text.replace(
  `    return {
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

  // 6. Handle Search Results`,
  `    return formatAssistantResponse({
      id: responseId,
      intent,
      language: lang,
      text,
      chips,
      actions,
      confidence,
      isRelaxed: false,
      isFallback: false
    }, safeContext, context);
  }

  // 6. Handle Search Results`
);

text = text.replace(
  `    return {
      id: responseId,
      intent: resolvedIntent,
      language: lang,
      text,
      chips,
      suggestionChips: chips,
      actions: actions.slice(0, 4),
      confidence: Math.min(0.85, Math.max(0.60, results[0].score / 100)),
      isRelaxed: relaxed,
      isFallback: false,
      relaxationBanner
    };
  }
      const finalIntent`,
  `    return formatAssistantResponse({
      id: responseId,
      intent: resolvedIntent,
      language: lang,
      text,
      chips,
      actions: actions.slice(0, 4),
      confidence: Math.min(0.85, Math.max(0.60, results[0].score / 100)),
      isRelaxed: relaxed,
      isFallback: false,
      relaxationBanner
    }, safeContext, context);
  }
      const finalIntent`
);

text = text.replace(
  `  return {
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
  };`,
  `  return formatAssistantResponse({
    id: responseId,
    intent: finalIntent,
    language: lang,
    text: fallbackText,
    chips: fallbackChips,
    actions: fallbackActions,
    confidence: finalIntent === 'ambiguous' ? 0.95 : 0.20,
    isRelaxed: false,
    isFallback: true
  }, safeContext, context);`
);

// Update default export
const defaultExportOld = `export default {
  queryAssistant,
  getInitialSuggestions,
  clearSessionMemory,
  detectLanguage,
  normalizeQuery,
  classifyIntent,
  matchAuthoritativeFAQ,
  searchPortfolioIndex,
  generateAssistantResponse,
  getContextualPromptChips,`;

const defaultExportNew = `export default {
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
  cleanMarkdownAsterisks,
  AUDIENCE_EMOJI_PRESETS,
  getAudienceEmojiPreset,
  tuneResponseEmojis,
  ONBOARDING_DECISION_TREE,
  getOnboardingDecisionTree,
  generateResponseDecisionTree,`;

text = text.replace(defaultExportOld, defaultExportNew);

// Remove excessive empty lines
text = text.replace(/\n{3,}/g, '\n\n');

fs.writeFileSync(file, text);
console.log('Successfully written! File byte size:', Buffer.byteLength(text, 'utf8'));
