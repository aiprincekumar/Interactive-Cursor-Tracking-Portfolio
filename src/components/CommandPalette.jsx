import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  CornerDownLeft, 
  Layers, 
  FolderGit2, 
  Compass, 
  SearchX, 
  Clock, 
  GraduationCap, 
  Briefcase, 
  Sparkles,
  Zap,
  FileDown,
  Mail,
  MessageCircle,
  MapPin,
  Sliders
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { SEARCH_ITEMS } from '../utils/searchCatalog';
import { searchCatalogItems, ALIAS_MAP } from '../utils/fuzzySearch';

const CATEGORIES = ['All', 'Actions', 'Sections', 'Projects', 'Skills', 'Experience', 'Education'];

const CATEGORY_META = {
  Actions: { label: 'Quick Actions', icon: Zap, color: 'text-amber-500' },
  Sections: { label: 'Portfolio Navigation', icon: Compass, color: 'text-sky-600' },
  Projects: { label: 'Featured Projects', icon: FolderGit2, color: 'text-[#FF4D6D]' },
  Skills: { label: 'Core Expertise & Stacks', icon: Layers, color: 'text-emerald-600' },
  Experience: { label: 'Professional Journey', icon: Briefcase, color: 'text-amber-600' },
  Education: { label: 'Education & Credentials', icon: GraduationCap, color: 'text-purple-600' }
};

const SUGGESTIONS = ['GST', 'Tally', 'ITR', 'Resume', 'Excel', 'DAY-NULM', 'Smart Card', 'Contact'];
const RECENT_SEARCHES_KEY = 'portfolio_recent_searches';

// Helper to highlight matching text queries cleanly with alias support
function HighlightedText({ text, query }) {
  if (!text) return null;
  if (!query || !query.trim()) return <span>{text}</span>;

  const rawTokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (rawTokens.length === 0) return <span>{text}</span>;

  // Include mapped aliases for smart highlighting (e.g., 'taly' -> 'tally')
  const allTokens = new Set(rawTokens);
  rawTokens.forEach((t) => {
    if (ALIAS_MAP[t]) {
      allTokens.add(ALIAS_MAP[t]);
    }
  });

  const tokenArray = Array.from(allTokens).filter((t) => t.length >= 2);
  if (tokenArray.length === 0) return <span>{text}</span>;

  const pattern = new RegExp(`(${tokenArray.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(pattern);

  return (
    <span>
      {parts.map((part, i) => {
        const isMatch = tokenArray.some((t) => t.toLowerCase() === part.toLowerCase());
        return isMatch ? (
          <mark key={i} className="bg-[#FF4D6D]/20 text-[#FF4D6D] font-bold rounded-xs px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </span>
  );
}

// Helper to resolve specific icon per item
function getItemIcon(item, defaultIcon) {
  if (item.actionType === 'download-resume') return FileDown;
  if (item.actionType === 'mailto') return Mail;
  if (item.actionType === 'external' && item.id === 'act-whatsapp') return MessageCircle;
  if (item.actionType === 'external' && item.id === 'act-maps') return MapPin;
  if (item.actionType === 'scroll' && item.targetId === 'playground') return Sliders;
  if (item.category === 'Actions') return Zap;
  return defaultIcon;
}

// Verification badge color generator
function getVerificationBadgeClass(matchType, isSelected) {
  if (isSelected) {
    return 'bg-white/20 text-white border border-white/30';
  }
  switch (matchType) {
    case 'Statutory Compliance':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'Software Tool':
      return 'bg-violet-50 text-violet-700 border border-violet-200';
    case 'Quick Action':
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'Project Deliverable':
      return 'bg-rose-50 text-[#FF4D6D] border border-rose-200';
    case 'Field Location':
      return 'bg-orange-50 text-orange-700 border border-orange-200';
    case 'Academic Record':
      return 'bg-purple-50 text-purple-700 border border-purple-200';
    case 'Verified Skill':
      return 'bg-sky-50 text-sky-700 border border-sky-200';
    default:
      return 'bg-stone-100 text-stone-600 border border-stone-200';
  }
}

export default function CommandPalette({ 
  isOpen, 
  onClose, 
  soundEnabled = true, 
  initialQuery = '' 
}) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const itemRefs = useRef([]);

  // Listen for global custom open event
  useEffect(() => {
    const handleCustomOpen = (e) => {
      const q = e.detail?.query || '';
      if (q) setQuery(q);
      setSelectedCategory('All');
      setSelectedIndex(0);
    };
    window.addEventListener('open-search-palette', handleCustomOpen);
    return () => window.removeEventListener('open-search-palette', handleCustomOpen);
  }, []);

  // Reset or populate state when modal opens
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      if (initialQuery && initialQuery.trim()) {
        setQuery(initialQuery.trim());
      } else if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const urlQ = urlParams.get('q') || urlParams.get('search');
        if (urlQ && urlQ.trim()) {
          setQuery(urlQ.trim());
        } else {
          setQuery('');
        }
      }
      setSelectedCategory('All');
      setSelectedIndex(0);
    }
  }

  // Save a search term to recent searches
  const saveRecentSearch = (term) => {
    const clean = term.trim();
    if (!clean || clean.length < 2) return;
    try {
      const filtered = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
      setRecentSearches(filtered);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(filtered));
    } catch {
      // Ignore storage errors
    }
  };

  const removeRecentSearch = (e, termToRemove) => {
    e.stopPropagation();
    try {
      const updated = recentSearches.filter((s) => s !== termToRemove);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const clearAllRecent = (e) => {
    e.stopPropagation();
    try {
      setRecentSearches([]);
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // Ignore
    }
  };

  // Auto-focus input and lock body scroll on open
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 60);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Execute smart fuzzy search with Levenshtein tolerance and multi-token matching
  const filteredItems = useMemo(() => {
    return searchCatalogItems(SEARCH_ITEMS, query, selectedCategory);
  }, [query, selectedCategory]);

  // Group items by category for grouped view presentation
  const groupedItems = useMemo(() => {
    const groups = {};
    let runningIndex = 0;

    const order = selectedCategory === 'All' 
      ? ['Actions', 'Projects', 'Skills', 'Experience', 'Education', 'Sections'] 
      : [selectedCategory];

    order.forEach((cat) => {
      const catItems = filteredItems.filter((i) => i.category === cat);
      if (catItems.length > 0) {
        groups[cat] = {
          category: cat,
          meta: CATEGORY_META[cat] || { label: cat, icon: Layers, color: 'text-stone-500' },
          items: catItems.map((item) => {
            const indexedItem = { ...item, flatIndex: runningIndex };
            runningIndex += 1;
            return indexedItem;
          })
        };
      }
    });

    return groups;
  }, [filteredItems, selectedCategory]);

  // Ensure active index is bounded
  const totalCount = filteredItems.length;
  const activeIndex = totalCount === 0 ? 0 : Math.min(selectedIndex, totalCount - 1);

  // Ensure active highlighted item is visible within the scrollable container
  useEffect(() => {
    if (itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex].scrollIntoView({
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [activeIndex]);

  // Handle item selection (Quick actions vs in-page navigation)
  const handleSelect = (item) => {
    if (!item) return;

    if (query.trim()) {
      saveRecentSearch(query.trim());
    }

    onClose();
    if (soundEnabled) soundFX.playFocusBeep();

    // 1. Quick Action: Download Verified Resume PDF
    if (item.actionType === 'download-resume') {
      const link = document.createElement('a');
      link.href = '/resume.pdf';
      link.download = 'Atul_Verma_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (soundEnabled) soundFX.playSparkle();
      return;
    }

    // 2. Quick Action: Direct Email mailto
    if (item.actionType === 'mailto') {
      window.location.href = item.actionUrl || 'mailto:atulravi2015@gmail.com';
      return;
    }

    // 3. Quick Action: External Link (WhatsApp / Google Maps)
    if (item.actionType === 'external' && item.actionUrl) {
      window.open(item.actionUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // 4. Tab dispatch for Qualifications & Education
    if (item.tab === 'qualifications' || item.targetId?.startsWith('edu-')) {
      window.dispatchEvent(new CustomEvent('switch-about-tab', { detail: { tab: 'qualifications' } }));
    }

    // 5. Skill selection dispatch
    if (item.skillKey) {
      window.dispatchEvent(new CustomEvent('select-skill', { detail: { skill: item.skillKey } }));
    }

    // 6. Smooth scroll to target element with 2.5s glowing pulse
    if (item.targetId) {
      setTimeout(() => {
        const target = document.getElementById(item.targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });

          const pulseClasses = [
            'ring-4',
            'ring-[#FF4D6D]',
            'ring-offset-4',
            'ring-offset-white',
            'shadow-2xl',
            'shadow-[#FF4D6D]/40',
            'animate-pulse'
          ];

          target.classList.add(...pulseClasses);
          setTimeout(() => {
            target.classList.remove(...pulseClasses);
          }, 2500);
        }
      }, 120);
    }
  };

  // Keyboard navigation within the modal
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (totalCount === 0 ? 0 : (prev + 1) % totalCount));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (totalCount === 0 ? 0 : (prev - 1 + totalCount) % totalCount));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[activeIndex]) {
        handleSelect(filteredItems[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette Search"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 pb-6 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#FAF8F5] rounded-3xl border border-[#E7E2D8] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 sm:px-5 py-4 border-b border-[#E7E2D8] bg-white gap-3 shrink-0">
          <Search className="w-5 h-5 text-[#FF4D6D] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder='Search GST, Tally, ITR, Resume, Excel, MIS, Skills, or Actions...'
            className="w-full bg-transparent text-sm sm:text-base font-medium text-[#18181B] placeholder-stone-400 focus:outline-none"
            aria-label="Search portfolio catalog"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-[#18181B] hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close command palette"
          >
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200">
              ESC
            </span>
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="px-4 py-2.5 bg-[#FAF8F5] border-b border-[#E7E2D8] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedIndex(0);
                  if (soundEnabled) soundFX.playFocusBeep();
                }}
                className={`text-xs font-semibold px-3 py-1 rounded-full transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#18181B] text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:text-[#18181B] hover:bg-stone-100 border border-[#E7E2D8]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Recent Searches Row (when query is empty and recent searches exist) */}
        {!query && recentSearches.length > 0 && (
          <div className="px-4 py-2 bg-white/70 border-b border-[#E7E2D8] flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] uppercase font-mono font-bold text-stone-400 flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3" /> Recent:
              </span>
              {recentSearches.map((term) => (
                <span
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    setSelectedIndex(0);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 hover:bg-[#FFF0F3] hover:text-[#FF4D6D] border border-stone-200 text-stone-600 text-xs font-medium cursor-pointer transition-colors"
                >
                  <span>{term}</span>
                  <button
                    type="button"
                    onClick={(e) => removeRecentSearch(e, term)}
                    className="hover:text-red-500 rounded-full"
                    title="Remove"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={clearAllRecent}
              className="text-[10px] font-mono text-stone-400 hover:text-red-500 shrink-0 cursor-pointer transition-colors"
              title="Clear all recent searches"
            >
              Clear
            </button>
          </div>
        )}

        {/* Results List (Grouped by Category) */}
        <div ref={listRef} className="overflow-y-auto p-3 space-y-4">
          {totalCount === 0 ? (
            <div className="py-12 px-6 text-center text-stone-500">
              <SearchX className="w-10 h-10 mx-auto text-stone-300 mb-2" />
              <p className="text-sm font-bold text-stone-700">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-stone-400 mt-1 mb-4">
                Spelling tolerance active. Try typing &ldquo;GST&rdquo;, &ldquo;taly&rdquo;, &ldquo;excl&rdquo;, &ldquo;ITR&rdquo;, &ldquo;Resume&rdquo;, or &ldquo;Actions&rdquo;
              </p>
              <div className="flex flex-wrap justify-center gap-1.5 max-w-md mx-auto">
                {SUGGESTIONS.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => {
                      setQuery(sug);
                      setSelectedIndex(0);
                      inputRef.current?.focus();
                    }}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-[#E7E2D8] hover:border-[#FF4D6D] hover:text-[#FF4D6D] text-stone-600 transition-colors cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            Object.values(groupedItems).map((group) => {
              const { category, meta, items } = group;
              const DefaultIcon = meta.icon;

              return (
                <div key={category} className="space-y-1">
                  {/* Category Header */}
                  <div className="flex items-center justify-between px-2 pt-1 pb-1 text-[11px] font-mono font-bold uppercase tracking-wider text-stone-400">
                    <span className="flex items-center gap-1.5">
                      <DefaultIcon className={`w-3.5 h-3.5 ${meta.color}`} />
                      <span>{meta.label}</span>
                    </span>
                    <span className="text-[10px] bg-stone-200/60 text-stone-600 px-2 py-0.2 rounded-full font-mono">
                      {items.length}
                    </span>
                  </div>

                  {/* Category Items */}
                  <div className="space-y-1">
                    {items.map((item) => {
                      const isSelected = item.flatIndex === activeIndex;
                      const ItemIcon = getItemIcon(item, DefaultIcon);

                      return (
                        <div
                          key={item.id}
                          ref={(el) => {
                            itemRefs.current[item.flatIndex] = el;
                          }}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(item.flatIndex)}
                          className={`group flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all duration-150 cursor-pointer select-none ${
                            isSelected
                              ? 'bg-[#18181B] text-white shadow-md scale-[1.008]'
                              : 'hover:bg-white text-stone-800'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                                isSelected
                                  ? 'bg-stone-800 border-stone-700 text-[#FF4D6D]'
                                  : 'bg-white border-[#E7E2D8] text-stone-500 group-hover:text-[#FF4D6D]'
                              }`}
                            >
                              <ItemIcon className="w-4 h-4" />
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-xs sm:text-sm font-bold tracking-tight truncate">
                                  <HighlightedText text={item.title} query={query} />
                                </span>

                                {/* Smart Verification Match Badge 1: Exact Match Indicator */}
                                {item.isExactMatch && query.trim() && (
                                  <span
                                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 flex items-center gap-1 ${
                                      isSelected
                                        ? 'bg-emerald-400 text-stone-950 shadow-xs'
                                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    }`}
                                  >
                                    <Sparkles className="w-2.5 h-2.5" />
                                    Exact Match
                                  </span>
                                )}

                                {/* Smart Verification Match Badge 2: Specific Verification Type */}
                                <span
                                  className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                                    getVerificationBadgeClass(item.matchType || item.badge, isSelected)
                                  }`}
                                >
                                  {item.matchType || item.badge}
                                </span>
                              </div>

                              <p
                                className={`text-[11px] truncate mt-0.5 ${
                                  isSelected ? 'text-stone-300' : 'text-stone-500'
                                }`}
                              >
                                <HighlightedText text={item.description} query={query} />
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 ml-3">
                            {isSelected && (
                              <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-stone-300 bg-stone-800 px-2 py-0.5 rounded-md">
                                <span>Go</span>
                                <CornerDownLeft className="w-3 h-3 text-[#FF4D6D]" />
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Keyboard Hints & Context */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#E7E2D8] bg-[#FAF8F5] text-[11px] font-mono text-stone-500 select-none shrink-0">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-200 shadow-2xs">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-200 shadow-2xs">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-200 shadow-2xs">↵</kbd> Select
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-stone-400 font-sans text-[11px]">
              {totalCount} results
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-200 shadow-2xs">esc</kbd> Dismiss
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
