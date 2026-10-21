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
  Sliders,
  Sun
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { SEARCH_ITEMS } from '../utils/searchCatalog';
import { searchCatalogItems, ALIAS_MAP } from '../utils/fuzzySearch';
import { useRoleTab } from '../context/RoleContext';
import { useDesktopCursorSupport } from '../hooks/useDesktopCursorSupport';
import { getResumeConfig } from '../utils/resumeConfig';
import { useTheme } from '../context/ThemeContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useLanguage } from '../context/LanguageContext';

const CATEGORIES = ['All', 'Actions', 'Sections', 'Projects', 'Skills', 'Experience', 'Education'];

const CATEGORY_LABELS_HI = {
  All: 'सभी (All)',
  Actions: 'त्वरित कार्य (Actions)',
  Sections: 'नेविगेशन (Sections)',
  Projects: 'प्रोजेक्ट्स (Projects)',
  Skills: 'कौशल (Skills)',
  Experience: 'अनुभव (Experience)',
  Education: 'शिक्षा (Education)'
};

const CATEGORY_META = {
  Actions: { label: 'Quick Actions', label_hi: 'त्वरित कार्य (Quick Actions)', icon: Zap, color: 'text-amber-500' },
  Sections: { label: 'Portfolio Navigation', label_hi: 'पोर्टफोलियो नेविगेशन (Navigation)', icon: Compass, color: 'text-sky-600' },
  Projects: { label: 'Featured Projects', label_hi: 'प्रमुख प्रोजेक्ट्स (Featured Projects)', icon: FolderGit2, color: 'text-[#FF4D6D]' },
  Skills: { label: 'Core Expertise & Stacks', label_hi: 'मुख्य विशेषज्ञता एवं तकनीकी स्टैक (Skills)', icon: Layers, color: 'text-emerald-600' },
  Experience: { label: 'Professional Journey', label_hi: 'पेशेवर कार्य यात्रा (Experience)', icon: Briefcase, color: 'text-amber-600' },
  Education: { label: 'Education & Credentials', label_hi: 'शिक्षा एवं प्रमाण-पत्र (Education & Credentials)', icon: GraduationCap, color: 'text-purple-600' }
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
  if (item.actionType === 'toggle-theme' || item.id === 'act-theme') return Sun;
  if (item.actionType === 'switch-role') return Compass;
  if (item.category === 'Actions') return Zap;
  return defaultIcon;
}

// Verification badge color generator
function getVerificationBadgeClass(matchType, isSelected) {
  if (isSelected) {
    return 'bg-white/20 text-white border border-white/30';
  }
  switch (matchType) {
    case 'Theme Setting':
      return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
    case 'Statutory Compliance':
      return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
    case 'Software Tool':
      return 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800';
    case 'Quick Action':
      return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
    case 'Project Deliverable':
      return 'bg-rose-50 dark:bg-rose-950/60 text-[#FF4D6D] border border-rose-200 dark:border-rose-900';
    case 'Field Location':
      return 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800';
    case 'Academic Record':
      return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800';
    case 'Verified Skill':
      return 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800';
    default:
      return 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700';
  }
}

export default function CommandPalette({ 
  isOpen, 
  onClose, 
  soundEnabled = true, 
  initialQuery = '',
  activeRole: _activeRole,
  onSelectRole: propOnSelectRole,
  isDesktopCursor: propIsDesktopCursor
}) {
  const detectedDesktopCursor = useDesktopCursorSupport();
  const isDesktopCursor = propIsDesktopCursor !== undefined ? propIsDesktopCursor : detectedDesktopCursor;

  let roleContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    roleContext = useRoleTab();
  } catch {
    // In case CommandPalette is mounted outside RoleProvider
  }
  const onSelectRole = propOnSelectRole ?? roleContext?.selectRole;

  let themeContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    themeContext = useTheme();
  } catch {
    // In case CommandPalette is mounted outside ThemeProvider
  }
  const toggleTheme = themeContext?.toggleTheme;

  let langContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    langContext = useLanguage();
  } catch {
    // In case CommandPalette is mounted outside LanguageProvider
  }
  const isHindi = langContext?.isHindi ?? false;

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
  const modalContainerRef = useRef(null);

  // Accessible focus trapping & restoration
  useFocusTrap(isOpen, modalContainerRef, {
    initialFocusRef: inputRef,
    onEscape: onClose,
    restoreFocus: true
  });

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
    let items = searchCatalogItems(SEARCH_ITEMS, query, selectedCategory);
    // On touch/mobile devices, filter out cursor customization actions while keeping sections
    if (!isDesktopCursor) {
      items = items.filter(
        (item) => item.id !== 'act-cursor-playground' && !item.desktopOnly && !item.desktopCursorOnly
      );
    }
    return items;
  }, [query, selectedCategory, isDesktopCursor]);

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

    // 1. Role Deep-Linking & Switching: Synchronize role state if item is role-specific
    if (item.actionType === 'switch-role' && item.role) {
      if (onSelectRole) {
        onSelectRole(item.role);
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('switch-role-tab', { detail: { role: item.role } }));
      }
      return;
    }

    if (item.role && ['overview', 'accountant', 'mis', 'vibe_coding', 'other'].includes(item.role)) {
      if (onSelectRole) {
        onSelectRole(item.role);
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('switch-role-tab', { detail: { role: item.role } }));
      }
    }

    // 2. Quick Action: Toggle Theme (Light / Dark Mode)
    if (item.actionType === 'toggle-theme' || item.id === 'act-theme') {
      if (toggleTheme) {
        toggleTheme();
      } else if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('toggle-theme'));
      }
      return;
    }

    // 2b. Quick Action: Open Quick Lab Studio Drawer
    if (item.actionType === 'open-lab-drawer' || item.id === 'act-lab-drawer') {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('portfolio:open-lab-drawer'));
        window.dispatchEvent(new CustomEvent('open-lab-drawer'));
      }
      return;
    }

    // 3. Quick Action: Download Verified Resume PDF (Active Role)
    if (item.actionType === 'download-resume') {
      const activeRole = roleContext?.activeRole || 'accountant';
      const resumeConfig = getResumeConfig(activeRole);
      const link = document.createElement('a');
      link.href = resumeConfig.pdfPath;
      link.download = resumeConfig.downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (soundEnabled) soundFX.playSparkle();
      return;
    }

    // 4. Quick Action: Direct Email mailto
    if (item.actionType === 'mailto') {
      window.location.href = item.actionUrl || 'mailto:atulravi2015@gmail.com';
      return;
    }

    // 5. Quick Action: External Link (WhatsApp / Google Maps)
    if (item.actionType === 'external' && item.actionUrl) {
      window.open(item.actionUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // 6. Tab dispatch for Qualifications, Bio-Data & Education
    if (item.tab === 'qualifications' || item.targetId?.startsWith('edu-')) {
      window.dispatchEvent(new CustomEvent('switch-about-tab', { detail: { tab: 'qualifications' } }));
    } else if (item.tab === 'biodata') {
      window.dispatchEvent(new CustomEvent('switch-about-tab', { detail: { tab: 'biodata' } }));
    } else if (item.tab === 'location' || item.tab === 'touch' || item.tab === 'direct' || item.tab === 'quote') {
      window.dispatchEvent(new CustomEvent('switch-contact-tab', { detail: { tab: item.tab } }));
      window.dispatchEvent(new CustomEvent('portfolio:switch-contact-tab', { detail: { tab: item.tab } }));
    }

    // 6. Skill selection dispatch
    if (item.skillKey) {
      window.dispatchEvent(new CustomEvent('select-skill', { detail: { skill: item.skillKey } }));
    }

    // 7. Smooth scroll to target element with 2.5s glowing pulse
    // 160ms delay ensures React finishes re-rendering the section with active role tabpanel mounted!
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
      }, 160);
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
        ref={modalContainerRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#FAF8F5] dark:bg-[#18181B] rounded-3xl border border-[#E7E2D8] dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150 transition-colors"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 sm:px-5 py-4 border-b border-[#E7E2D8] dark:border-stone-800 bg-white dark:bg-stone-900 gap-3 shrink-0">
          <Search className="w-5 h-5 text-[#FF4D6D] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            aria-controls="command-palette-results"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={isHindi ? 'GST, Tally, ITR, रिज्यूमे, Excel, MIS, कौशल या त्वरित कार्य खोजें...' : 'Search GST, Tally, ITR, Resume, Excel, MIS, Skills, or Actions...'}
            className="w-full bg-transparent text-sm sm:text-base font-medium text-[#18181B] dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none"
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
              className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-[#18181B] dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Close command palette"
          >
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300">
              ESC
            </span>
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="px-4 py-2.5 bg-[#FAF8F5] dark:bg-stone-900/60 border-b border-[#E7E2D8] dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
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
                    ? 'bg-[#18181B] dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-[#18181B] dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-700 border border-[#E7E2D8] dark:border-stone-700'
                }`}
              >
                {isHindi ? CATEGORY_LABELS_HI[cat] : cat}
              </button>
            );
          })}
        </div>

        {/* Recent Searches Row (when query is empty and recent searches exist) */}
        {!query && recentSearches.length > 0 && (
          <div className="px-4 py-2 bg-white/70 dark:bg-stone-900/40 border-b border-[#E7E2D8] dark:border-stone-800 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] uppercase font-mono font-bold text-stone-400 dark:text-stone-500 flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3" /> {isHindi ? 'हालिया:' : 'Recent:'}
              </span>
              {recentSearches.map((term) => (
                <span
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    setSelectedIndex(0);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-[#FFF0F3] dark:hover:bg-[#FF4D6D]/15 hover:text-[#FF4D6D] border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-xs font-medium cursor-pointer transition-colors"
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
              className="text-[10px] font-mono text-stone-400 dark:text-stone-500 hover:text-red-500 shrink-0 cursor-pointer transition-colors"
              title="Clear all recent searches"
            >
              {isHindi ? 'हटाएं' : 'Clear'}
            </button>
          </div>
        )}

        {/* Results List (Grouped by Category) */}
        <div id="command-palette-results" role="listbox" aria-label="Search results" ref={listRef} className="overflow-y-auto p-3 space-y-4">
          {totalCount === 0 ? (
            <div className="py-12 px-6 text-center text-stone-500 dark:text-stone-400">
              <SearchX className="w-10 h-10 mx-auto text-stone-300 dark:text-stone-600 mb-2" />
              <p className="text-sm font-bold text-stone-700 dark:text-stone-200">
                {isHindi ? `"${query}" के लिए कोई परिणाम नहीं मिला` : `No results found for “${query}”`}
              </p>
              <p className="text-xs text-stone-400 dark:text-stone-500 mt-1 mb-4">
                {isHindi ? 'वर्तनी सहिष्णुता सक्रिय। "GST", "taly", "excl", "ITR", "Resume", या "Actions" टाइप करने का प्रयास करें' : 'Spelling tolerance active. Try typing “GST”, “taly”, “excl”, “ITR”, “Resume”, or “Actions”'}
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
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-[#E7E2D8] dark:border-stone-700 hover:border-[#FF4D6D] hover:text-[#FF4D6D] dark:hover:text-[#FF4D6D] text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
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
                  <div className="flex items-center justify-between px-2 pt-1 pb-1 text-[11px] font-mono font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    <span className="flex items-center gap-1.5">
                      <DefaultIcon className={`w-3.5 h-3.5 ${meta.color}`} />
                      <span>{isHindi ? (meta.label_hi || meta.label) : meta.label}</span>
                    </span>
                    <span className="text-[10px] bg-stone-200/60 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-2 py-0.2 rounded-full font-mono">
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
                          id={`search-result-${item.id}`}
                          role="option"
                          aria-selected={isSelected}
                          ref={(el) => {
                            itemRefs.current[item.flatIndex] = el;
                          }}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(item.flatIndex)}
                          className={`group flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all duration-150 cursor-pointer select-none ${
                            isSelected
                              ? 'bg-[#18181B] dark:bg-stone-800 text-white shadow-md scale-[1.008]'
                              : 'hover:bg-white dark:hover:bg-stone-850/80 text-stone-800 dark:text-stone-200'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                                isSelected
                                  ? 'bg-stone-800 dark:bg-stone-700 border-stone-700 dark:border-stone-600 text-[#FF4D6D]'
                                  : 'bg-white dark:bg-stone-800 border-[#E7E2D8] dark:border-stone-700 text-stone-500 dark:text-stone-400 group-hover:text-[#FF4D6D]'
                              }`}
                            >
                              <ItemIcon className="w-4 h-4" />
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-xs sm:text-sm font-bold tracking-tight truncate">
                                  <HighlightedText text={(isHindi && item.title_hi) ? item.title_hi : item.title} query={query} />
                                </span>

                                {/* Smart Verification Match Badge 1: Exact Match Indicator */}
                                {item.isExactMatch && query.trim() && (
                                  <span
                                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 flex items-center gap-1 ${
                                      isSelected
                                        ? 'bg-emerald-400 text-stone-950 shadow-xs'
                                        : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                                    }`}
                                  >
                                    <Sparkles className="w-2.5 h-2.5" />
                                    {isHindi ? 'सटीक मेल (Exact Match)' : 'Exact Match'}
                                  </span>
                                )}

                                {/* Smart Verification Match Badge 2: Specific Verification Type */}
                                <span
                                  className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                                    getVerificationBadgeClass(item.matchType || item.badge, isSelected)
                                  }`}
                                >
                                  {(isHindi && item.badge_hi) ? item.badge_hi : (item.matchType || item.badge)}
                                </span>

                                {/* Track Affinity Role Badge */}
                                {item.role === 'overview' && (
                                  <span
                                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                                      isSelected
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                                    }`}
                                  >
                                    {isHindi ? '🧭 अवलोकन (Overview)' : '🧭 Overview'}
                                  </span>
                                )}
                                {item.role === 'accountant' && (
                                  <span
                                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                                      isSelected
                                        ? 'bg-[#FF4D6D] text-white shadow-xs'
                                        : 'bg-rose-50 dark:bg-rose-950/60 text-[#FF4D6D] border border-rose-200 dark:border-rose-900'
                                    }`}
                                  >
                                    {isHindi ? '💼 अकाउंटेंट (Accountant)' : '💼 Accountant'}
                                  </span>
                                )}
                                {item.role === 'mis' && (
                                  <span
                                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                                      isSelected
                                        ? 'bg-blue-500 text-white shadow-xs'
                                        : 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                                    }`}
                                  >
                                    {isHindi ? '📊 एमआईएस (MIS)' : '📊 MIS'}
                                  </span>
                                )}
                                {item.role === 'vibe_coding' && (
                                  <span
                                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                                      isSelected
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                    }`}
                                  >
                                    {isHindi ? '⚡ वाइब कोडर (⚡ Vibe Coder)' : '⚡ Vibe Coder'}
                                  </span>
                                )}
                                {item.role === 'other' && (
                                  <span
                                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                                      isSelected
                                        ? 'bg-purple-600 text-white shadow-xs'
                                        : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                    }`}
                                  >
                                    {isHindi ? '🤖 अन्य ✨ एआई (Other ✨ AI)' : '🤖 Other ✨ AI'}
                                  </span>
                                )}
                              </div>

                              <p
                                className={`text-[11px] truncate mt-0.5 ${
                                  isSelected ? 'text-stone-300 dark:text-stone-300' : 'text-stone-500 dark:text-stone-400'
                                }`}
                              >
                                <HighlightedText text={(isHindi && item.description_hi) ? item.description_hi : item.description} query={query} />
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 ml-3">
                            {isSelected && (
                              <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-stone-300 bg-stone-800 dark:bg-stone-700 px-2 py-0.5 rounded-md">
                                <span>{isHindi ? 'जाएं' : 'Go'}</span>
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
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#E7E2D8] dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-900 text-[11px] font-mono text-stone-500 dark:text-stone-400 select-none shrink-0">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs text-stone-700 dark:text-stone-300">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs text-stone-700 dark:text-stone-300">↓</kbd> {isHindi ? 'नेविगेट' : 'Navigate'}
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs text-stone-700 dark:text-stone-300">↵</kbd> {isHindi ? 'चुनें' : 'Select'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-stone-400 dark:text-stone-500 font-sans text-[11px]">
              {totalCount} {isHindi ? 'परिणाम' : 'results'}
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs text-stone-700 dark:text-stone-300">esc</kbd> {isHindi ? 'बंद करें' : 'Dismiss'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
