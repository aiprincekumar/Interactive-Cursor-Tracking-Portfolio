/* oxlint-disable react/no-danger */
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Globe,
  Briefcase,
  Handshake,
  Sparkles,
  Heart,
  LayoutGrid,
  BarChart2,
  Terminal,
  Search,
  X,
  ChevronDown,
  ArrowUpRight,
  HelpCircle,
  CheckCircle2,
  Calculator,
  BotMessageSquare,
  Send,
  FileText,
  RotateCcw,
  Filter
} from 'lucide-react';
import {
  FAQ_CONFIG,
  FAQ_AUDIENCE_TABS,
  FAQ_ROLE_TABS,
  FAQ_ITEMS,
  filterFAQItems
} from '../data/faqConfig';
import { useAudience } from '../context/AudienceContext';
import { useRoleTab } from '../context/RoleContext';
import { useLanguage } from '../context/LanguageContext';
import { useSimpleMode } from '../context/SimpleModeContext';
import { soundFX } from '../utils/audio';

const ICON_MAP = {
  Globe,
  Briefcase,
  Handshake,
  Sparkles,
  Heart,
  LayoutGrid,
  BarChart2,
  Terminal
};

export default function FAQSection() {
  const { isSimpleMode } = useSimpleMode();
  let audienceContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    audienceContext = useAudience();
  } catch {
    // Fallback if mounted outside AudienceProvider
  }

  let roleContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    roleContext = useRoleTab();
  } catch {
    // Fallback if mounted outside RoleProvider
  }

  let languageContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    languageContext = useLanguage();
  } catch {
    // Fallback if mounted outside LanguageProvider
  }
  const isHindi = languageContext?.isHindi ?? false;

  // Global state values
  const globalAudience = audienceContext?.audience || 'all';
  const globalRole = roleContext?.activeRole || 'accountant';

  // Local state initialized with global state, allowing independent local exploration
  const [selectedAudience, setSelectedAudience] = useState(globalAudience);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // Sync with global audience mode when it changes from outside
  useEffect(() => {
    if (globalAudience) {
      setSelectedAudience(globalAudience);
      setExpandedId(null);
    }
  }, [globalAudience]);

  // Sync with global role tab when it changes from outside
  const isInitialRoleSync = useRef(true);
  useEffect(() => {
    if (isInitialRoleSync.current) {
      isInitialRoleSync.current = false;
      return;
    }
    if (globalRole) {
      const mappedRole = globalRole === 'overview' || globalRole === 'other' ? 'all' : globalRole;
      setSelectedRole(mappedRole);
      setExpandedId(null);
    }
  }, [globalRole]);

  // Accent color calculation based on active selection
  const accentColor = useMemo(() => {
    if (selectedRole === 'vibe_coding') return '#10B981';
    if (selectedRole === 'mis') return '#3B82F6';
    if (selectedRole === 'accountant') return '#FF4D6D';
    if (selectedAudience === 'marriage') return '#F43F5E';
    if (selectedAudience === 'client') return '#10B981';
    if (selectedAudience === 'recruiter') return '#3B82F6';
    return '#6366F1';
  }, [selectedRole, selectedAudience]);

  // Filter items based on active criteria
  const filteredItems = useMemo(() => {
    return filterFAQItems({
      items: FAQ_ITEMS,
      audience: selectedAudience,
      role: selectedRole,
      category: selectedCategory,
      searchQuery
    });
  }, [selectedAudience, selectedRole, selectedCategory, searchQuery]);

  // Extract unique category tags from the items matching the audience & role for chip filters
  const availableCategories = useMemo(() => {
    const relevantItems = filterFAQItems({
      items: FAQ_ITEMS,
      audience: selectedAudience,
      role: selectedRole,
      category: 'all',
      searchQuery: ''
    });

    const tagsMap = new Map();
    relevantItems.forEach((item) => {
      const tagEn = item.categoryTag;
      const tagHi = item.categoryTag_hi || tagEn;
      if (tagEn && !tagsMap.has(tagEn)) {
        tagsMap.set(tagEn, { en: tagEn, hi: tagHi });
      }
    });

    return Array.from(tagsMap.entries()).map(([en, names]) => ({
      id: en,
      label: names.en,
      label_hi: names.hi
    }));
  }, [selectedAudience, selectedRole]);

  // Reset category filter if it no longer exists in available categories
  useEffect(() => {
    if (selectedCategory !== 'all') {
      const exists = availableCategories.some((c) => c.id === selectedCategory);
      if (!exists) {
        setSelectedCategory('all');
      }
    }
  }, [availableCategories, selectedCategory]);

  // Interactive handler for single-expand accordion
  const handleToggleAccordion = useCallback((id) => {
    try {
      soundFX?.playFocusBeep?.();
    } catch {
      // Audio fallback
    }
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  // Audience tab select handler
  const handleSelectAudience = useCallback((audId) => {
    try {
      soundFX?.playFocusBeep?.();
    } catch {
      // Audio fallback
    }
    setSelectedAudience(audId);
    setSelectedCategory('all');
    setExpandedId(null);
  }, []);

  // Role sub-tab select handler
  const handleSelectRole = useCallback((roleId) => {
    try {
      soundFX?.playFocusBeep?.();
    } catch {
      // Audio fallback
    }
    setSelectedRole(roleId);
    setSelectedCategory('all');
    setExpandedId(null);
  }, []);

  // Category chip filter click handler
  const handleSelectCategory = useCallback((catId) => {
    try {
      soundFX?.playTap?.();
    } catch {
      // Audio fallback
    }
    setSelectedCategory(catId);
    setExpandedId(null);
  }, []);

  // Reset all filters handler
  const handleResetFilters = useCallback(() => {
    try {
      soundFX?.playFocusBeep?.();
    } catch {
      // Audio fallback
    }
    setSelectedAudience('all');
    setSelectedRole('all');
    setSelectedCategory('all');
    setSearchQuery('');
    setExpandedId(null);
  }, []);

  // Action CTA dispatcher
  const handleActionCTA = useCallback((cta) => {
    if (!cta) return;
    try {
      soundFX?.playFocusBeep?.();
    } catch {
      // Audio fallback
    }

    if (cta.type === 'case_study') {
      window.dispatchEvent(
        new CustomEvent('portfolio:open-case-study', {
          detail: { id: cta.target || '01' }
        })
      );
    } else if (cta.type === 'credentials') {
      window.dispatchEvent(
        new CustomEvent('portfolio:open-credential', {
          detail: { id: cta.target || 'edu-adca' }
        })
      );
    } else if (cta.type === 'quote') {
      window.dispatchEvent(
        new CustomEvent('portfolio:switch-contact-tab', {
          detail: { tab: 'quote' }
        })
      );
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (cta.type === 'contact') {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (cta.type === 'ai_chat') {
      window.dispatchEvent(new CustomEvent('portfolio:open-ai-chat'));
    }
  }, []);

  // Generate Schema.org FAQPage JSON-LD structure
  const faqSchemaJsonLd = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: isHindi ? item.question_hi : item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: isHindi ? item.answer_hi : item.answer
        }
      }))
    };
  }, [isHindi]);

  const searchInputRef = useRef(null);

  const eyebrow = isHindi ? FAQ_CONFIG.eyebrowText_hi : FAQ_CONFIG.eyebrowText;
  const titlePrefix = isHindi ? FAQ_CONFIG.titlePrefix_hi : FAQ_CONFIG.titlePrefix;
  const titleHighlight = isHindi ? FAQ_CONFIG.titleHighlight_hi : FAQ_CONFIG.titleHighlight;
  const titleSuffix = isHindi ? FAQ_CONFIG.titleSuffix_hi : FAQ_CONFIG.titleSuffix;
  const subtitle = isHindi ? FAQ_CONFIG.subtitle_hi : FAQ_CONFIG.subtitle;

  return (
    <section
      id={FAQ_CONFIG.sectionId}
      aria-labelledby="faq-heading"
      data-testid="faq-section"
      className="py-24 bg-[#FAF8F5] dark:bg-[#0B0813] text-[#18181B] dark:text-[#F5F2F8] relative overflow-hidden select-none my-12 scroll-mt-28 border-y border-[#E7E2D8] dark:border-[#2D2340]"
    >
      {/* Schema.org FAQPage JSON-LD Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaJsonLd) }}
      />

      {/* Ambient background glow (hidden in simple mode) */}
      {!isSimpleMode && (
        <>
          <div
            className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-30 dark:opacity-20"
            style={{
              background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`
            }}
          />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ================================================================= */}
        {/* SECTION HEADER                                                    */}
        {/* ================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            {/* Eyebrow Badge Pill */}
            <div
              tabIndex={0}
              data-tts={`Section 9: ${eyebrow}`}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#161122] border border-[#E7E2D8] dark:border-[#2D2340] text-[#18181B] dark:text-[#F5F2F8] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs whitespace-nowrap max-w-full overflow-x-auto focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
              <span className="truncate sm:overflow-visible">
                {FAQ_CONFIG.eyebrowNumber} ✦ {eyebrow}
              </span>
            </div>

            {/* Standard Heading <h2> and Accent Underline Bar */}
            <h2
              id="faq-heading"
              tabIndex={0}
              data-tts={`${titlePrefix} ${titleHighlight} ${titleSuffix}`}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] xl:text-5xl font-black text-[#18181B] dark:text-white tracking-tight font-['Outfit',sans-serif] leading-[1.08] mb-3 whitespace-normal sm:whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg"
            >
              {titlePrefix} <span style={{ color: accentColor }}>{titleHighlight}</span> {titleSuffix}
            </h2>
            <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: accentColor }} />

            <p
              tabIndex={0}
              data-tts={subtitle}
              className="text-stone-600 dark:text-stone-400 text-sm md:text-base max-w-2xl font-normal leading-relaxed focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg"
            >
              {subtitle}
            </p>
          </div>

          {/* Telemetry Counter Badge */}
          <div
            tabIndex={0}
            data-tts={
              isHindi
                ? searchQuery.trim()
                  ? `${filteredItems.length} परिणाम मिले (${FAQ_ITEMS.length} में से ${filteredItems.length})`
                  : `${filteredItems.length} प्रश्न उपलब्ध (${FAQ_ITEMS.length} में से ${filteredItems.length})`
                : searchQuery.trim()
                  ? `${filteredItems.length} Matches Found (${filteredItems.length} of ${FAQ_ITEMS.length})`
                  : `${filteredItems.length} FAQs Available (${filteredItems.length} of ${FAQ_ITEMS.length})`
            }
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#161122] border border-[#E7E2D8] dark:border-[#2D2340] shadow-sm shadow-stone-900/5 dark:shadow-none self-start md:self-auto shrink-0 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
          >
            <HelpCircle className="w-4 h-4" style={{ color: accentColor }} aria-hidden="true" />
            <span className="text-xs sm:text-sm font-mono font-bold text-stone-700 dark:text-stone-300">
              {isHindi
                ? searchQuery.trim()
                  ? `${filteredItems.length} परिणाम मिले (${FAQ_ITEMS.length} में से ${filteredItems.length})`
                  : `${filteredItems.length} प्रश्न उपलब्ध (${FAQ_ITEMS.length} में से ${filteredItems.length})`
                : searchQuery.trim()
                  ? `${filteredItems.length} Matches Found (${filteredItems.length} of ${FAQ_ITEMS.length})`
                  : `${filteredItems.length} FAQs Available (${filteredItems.length} of ${FAQ_ITEMS.length})`}
            </span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* LAYER 1: AUDIENCE SELECTOR TABS                                   */}
        {/* ================================================================= */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" aria-hidden="true" />
              {isHindi ? 'लेयर 1: दर्शक श्रेणी (Audience)' : 'Layer 1: Audience Perspective'}
            </span>
            {selectedAudience !== 'all' && (
              <span className="text-[11px] font-semibold text-stone-400 dark:text-stone-500">
                {isHindi ? 'फ़िल्टर सक्रिय' : 'Audience filter active'}
              </span>
            )}
          </div>

          <div
            role="tablist"
            aria-label={isHindi ? 'दर्शक श्रेणियां' : 'Audience Perspectives'}
            className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
          >
            {FAQ_AUDIENCE_TABS.map((tab) => {
              const IconComp = ICON_MAP[tab.icon] || Globe;
              const isActive = selectedAudience === tab.id;
              const label = isHindi ? tab.label_hi : tab.label;
              const badge = isHindi ? tab.badge_hi : tab.badge;

              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  data-testid={`faq-audience-tab-${tab.id}`}
                  onClick={() => handleSelectAudience(tab.id)}
                  className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 border cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden ${
                    isActive
                      ? 'bg-white dark:bg-[#1C162E] text-stone-900 dark:text-white border-stone-300 dark:border-stone-700 shadow-sm'
                      : 'bg-white/60 dark:bg-[#161122]/60 text-stone-600 dark:text-stone-400 border-[#E7E2D8] dark:border-[#2D2340] hover:bg-white dark:hover:bg-[#161122] hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  <IconComp
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-stone-400'
                    }`}
                    style={isActive ? { color: accentColor } : undefined}
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono transition-colors ${
                      isActive
                        ? 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold'
                        : 'bg-stone-100/70 dark:bg-stone-800/50 text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    {badge}
                  </span>
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================================================================= */}
        {/* LAYER 2: ROLE SPECIALIZATION SUB-TABS                             */}
        {/* ================================================================= */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" aria-hidden="true" />
              {isHindi ? 'लेयर 2: भूमिका विशेषज्ञता (Role Track)' : 'Layer 2: Role Specialization'}
            </span>
          </div>

          <div
            role="tablist"
            aria-label={isHindi ? 'भूमिका ट्रैक्स' : 'Role Specialization Tracks'}
            className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
          >
            {FAQ_ROLE_TABS.map((roleTab) => {
              const IconComp = ICON_MAP[roleTab.icon] || LayoutGrid;
              const isActive = selectedRole === roleTab.id;
              const label = isHindi ? roleTab.label_hi : roleTab.label;

              return (
                <button
                  key={roleTab.id}
                  role="tab"
                  aria-selected={isActive}
                  data-testid={`faq-role-tab-${roleTab.id}`}
                  onClick={() => handleSelectRole(roleTab.id)}
                  className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 shrink-0 border cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden ${
                    isActive
                      ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 border-transparent shadow-xs font-semibold'
                      : 'bg-white/50 dark:bg-[#161122]/40 text-stone-600 dark:text-stone-400 border-[#E7E2D8] dark:border-[#2D2340] hover:bg-white dark:hover:bg-[#161122]'
                  }`}
                >
                  <IconComp
                    className="w-3.5 h-3.5"
                    style={isActive ? undefined : { color: roleTab.accent }}
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                  {roleTab.id !== 'all' && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: roleTab.accent }}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================================================================= */}
        {/* LIVE SEARCH & CATEGORY CHIPS BAR                                 */}
        {/* ================================================================= */}
        <div className="bg-white dark:bg-[#161122] rounded-3xl p-4 sm:p-5 border border-[#E7E2D8] dark:border-[#2D2340] shadow-sm shadow-stone-900/5 dark:shadow-none mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
            {/* Live Search Input */}
            <div className="relative flex-1">
              <Search
                className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isHindi
                    ? 'प्रश्न या कीवर्ड खोजें (जैसे GST, React 19, नोटिस, टर्नअराउंड, बायोडाटा)...'
                    : 'Search questions, keywords (e.g. GST, React 19, notice period, MVP, ADCA)...'
                }
                aria-label={isHindi ? 'प्रश्न खोजें' : 'Search FAQ questions'}
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-stone-50 dark:bg-[#1F1733] border border-[#E7E2D8] dark:border-[#2D2340] text-sm text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] dark:focus:ring-[#FF4D6D] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label={isHindi ? 'सर्च साफ़ करें' : 'Clear search'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Results Pill */}
            <div className="flex items-center gap-2 shrink-0 justify-between sm:justify-end">
              <span className="text-xs font-mono font-medium text-stone-500 dark:text-stone-400 px-3 py-2 rounded-xl bg-stone-100 dark:bg-[#1F1733] border border-[#E7E2D8] dark:border-[#2D2340]">
                {filteredItems.length} {isHindi ? 'मैच' : 'matched'}
              </span>

              {(searchQuery || selectedCategory !== 'all' || selectedAudience !== 'all' || selectedRole !== 'all') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  aria-label={isHindi ? 'सभी फ़िल्टर रीसेट करें' : 'Reset all filters'}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline px-2.5 py-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{isHindi ? 'रीसेट' : 'Reset'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Category Chips */}
          {availableCategories.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
                {isHindi ? 'विषय:' : 'Topics:'}
              </span>
              <button
                type="button"
                onClick={() => handleSelectCategory('all')}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 font-semibold'
                    : 'bg-stone-100 dark:bg-[#1F1733] text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-[#281E40]'
                }`}
              >
                {isHindi ? 'सभी विषय' : 'All Topics'}
              </button>

              {availableCategories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const label = isHindi ? cat.label_hi : cat.label;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 font-semibold'
                        : 'bg-stone-100 dark:bg-[#1F1733] text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-[#281E40]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* ACCORDION LIST / EMPTY STATE                                      */}
        {/* ================================================================= */}
        {filteredItems.length === 0 ? (
          <div
            data-testid="faq-empty-state"
            className="text-center py-16 bg-white dark:bg-[#161122] rounded-3xl border border-dashed border-[#E7E2D8] dark:border-[#2D2340] px-4"
          >
            <HelpCircle className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-2">
              {isHindi ? 'कोई प्रश्न नहीं मिला' : 'No matching FAQs found'}
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto mb-6">
              {isHindi
                ? 'इस फ़िल्टर संयोजन से कोई प्रश्न मेल नहीं खाता।'
                : 'No FAQs match this filter combination.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                data-testid="faq-reset-filters-btn"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white dark:bg-white dark:text-stone-900 text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isHindi ? 'फ़िल्टर रीसेट करें' : 'Reset Filters'}</span>
              </button>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('portfolio:open-ai-chat'))}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs sm:text-sm font-semibold hover:bg-purple-700 transition-colors cursor-pointer shadow-sm"
              >
                <BotMessageSquare className="w-3.5 h-3.5" />
                <span>{isHindi ? 'AI असिस्टेंट से पूछें' : 'Ask AI Copilot'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredItems.map((item, index) => {
              const isExpanded = expandedId === item.id;
              const question = isHindi ? item.question_hi : item.question;
              const answer = isHindi ? item.answer_hi : item.answer;
              const categoryTag = isHindi ? item.categoryTag_hi : item.categoryTag;
              const cta = item.actionCTA;
              const ctaLabel = cta ? (isHindi ? cta.label_hi : cta.label) : '';

              // Role tag display
              const roleId = Array.isArray(item.role) && item.role.length > 0 ? item.role[0] : 'all';
              const roleTab = FAQ_ROLE_TABS.find((r) => r.id === roleId);

              return (
                <div
                  key={item.id}
                  data-testid={`faq-item-${item.id}`}
                  className={`group rounded-3xl transition-all duration-300 border overflow-hidden ${
                    isExpanded
                      ? 'bg-white dark:bg-[#161122] border-stone-400 dark:border-stone-600 shadow-md shadow-stone-900/5 dark:shadow-none ring-1 ring-stone-300 dark:ring-stone-700'
                      : 'bg-white/80 dark:bg-[#161122]/70 border-[#E7E2D8] dark:border-[#2D2340] hover:border-stone-300 dark:hover:border-stone-700 hover:bg-white dark:hover:bg-[#161122]'
                  }`}
                >
                  {/* Accordion Trigger Header */}
                  <button
                    type="button"
                    id={`faq-question-${item.id}`}
                    aria-expanded={isExpanded}
                    aria-controls={`faq-answer-${item.id}`}
                    onClick={() => handleToggleAccordion(item.id)}
                    className="w-full text-left px-5 sm:px-7 py-5 flex items-start justify-between gap-4 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
                  >
                    <div className="flex-1 pr-2">
                      {/* Meta Pill Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[11px] font-mono font-bold text-stone-400">
                          #{String(index + 1).padStart(2, '0')}
                        </span>
                        {categoryTag && (
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-[#1F1733] text-stone-600 dark:text-stone-300 border border-[#E7E2D8] dark:border-[#2D2340]">
                            {categoryTag}
                          </span>
                        )}
                        {roleTab && roleTab.id !== 'all' && (
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${roleTab.accent}15`,
                              color: roleTab.accent
                            }}
                          >
                            {isHindi ? roleTab.label_hi : roleTab.label}
                          </span>
                        )}
                      </div>

                      {/* Question Heading */}
                      <h3
                        className={`text-base sm:text-lg font-bold leading-snug transition-colors ${
                          isExpanded
                            ? 'text-stone-900 dark:text-white'
                            : 'text-stone-800 dark:text-stone-200 group-hover:text-stone-900 dark:group-hover:text-white'
                        }`}
                      >
                        {question}
                      </h3>
                    </div>

                    {/* Chevron Toggle Icon */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                        isExpanded
                          ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 border-transparent rotate-180'
                          : 'bg-stone-100 dark:bg-[#1F1733] text-stone-500 dark:text-stone-400 border-[#E7E2D8] dark:border-[#2D2340] group-hover:text-stone-800 dark:group-hover:text-white'
                      }`}
                      aria-hidden="true"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Accordion Expandable Content */}
                  {isExpanded && (
                    <div
                      id={`faq-answer-${item.id}`}
                      role="region"
                      aria-labelledby={`faq-question-${item.id}`}
                      className="px-5 sm:px-7 pb-6 pt-1 text-sm sm:text-[15px] leading-relaxed text-stone-600 dark:text-stone-300 border-t border-stone-100 dark:border-[#1F1733] animate-fadeIn"
                    >
                      <p className="font-normal mb-4 whitespace-pre-line">{answer}</p>

                      {/* Actionable Deep-Linking CTA */}
                      {cta && (
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleActionCTA(cta)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-xs transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                            style={{
                              backgroundColor:
                                cta.type === 'case_study'
                                  ? '#FF4D6D'
                                  : cta.type === 'credentials'
                                  ? '#8B5CF6'
                                  : cta.type === 'quote'
                                  ? '#10B981'
                                  : cta.type === 'ai_chat'
                                  ? '#6366F1'
                                  : '#3B82F6'
                            }}
                          >
                            {cta.type === 'case_study' && <FileText className="w-3.5 h-3.5" />}
                            {cta.type === 'credentials' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {cta.type === 'quote' && <Calculator className="w-3.5 h-3.5" />}
                            {cta.type === 'contact' && <Send className="w-3.5 h-3.5" />}
                            {cta.type === 'ai_chat' && <BotMessageSquare className="w-3.5 h-3.5" />}
                            <span>{ctaLabel}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>

                          <span className="text-[11px] text-stone-400 dark:text-stone-500 font-mono">
                            {cta.type === 'case_study' && (isHindi ? 'केस स्टडी डॉसियर' : 'Interactive dossier')}
                            {cta.type === 'credentials' && (isHindi ? 'सत्यापित प्रमाणपत्र' : 'Verified certificate')}
                            {cta.type === 'quote' && (isHindi ? 'तत्काल लागत आगणक' : 'Live cost estimator')}
                            {cta.type === 'contact' && (isHindi ? 'डायरेक्ट संपर्क' : 'Direct contact form')}
                            {cta.type === 'ai_chat' && (isHindi ? 'इंटरैक्टिव AI कोपायलट' : 'Live conversational agent')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
