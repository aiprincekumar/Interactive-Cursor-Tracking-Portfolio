import React, { useEffect, useRef, useMemo } from 'react';

const CATEGORY_ORDER = ['AI & Intelligence', 'Interactive', 'Navigation', 'Profile', 'Domain', 'Commercial', 'Utility'];

const CATEGORY_METADATA = {
  'AI & Intelligence': {
    title: '🤖 AI & Intelligence',
    badgeClass: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
  },
  Interactive: {
    title: '🔥 Interactive & Interview',
    badgeClass: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
  },
  Navigation: {
    title: '🧭 Navigation & Views',
    badgeClass: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
  },
  Profile: {
    title: '👤 Profile & Bio',
    badgeClass: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
  },
  Domain: {
    title: '💼 Domain Practice',
    badgeClass: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
  },
  Commercial: {
    title: '💰 Commercial & Actions',
    badgeClass: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
  },
  Utility: {
    title: '⚡ Utilities',
    badgeClass: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
  }
};

/**
 * Highlight matched search query in text
 */
function highlightMatch(text, query) {
  if (!text) return '';
  if (!query || typeof query !== 'string') return text;
  const q = query.trim().toLowerCase();
  if (!q) return text;

  const lower = text.toLowerCase();
  const index = lower.indexOf(q);
  if (index === -1) return text;

  const before = text.slice(0, index);
  const match = text.slice(index, index + q.length);
  const after = text.slice(index + q.length);

  return (
    <>
      {before}
      <span className="bg-[#FF4D6D]/20 text-[#FF4D6D] dark:text-[#FF758F] font-semibold underline decoration-[#FF4D6D]/60 rounded-xs px-0.5">
        {match}
      </span>
      {after}
    </>
  );
}

/**
 * SlashCommandPalette
 * Grouped categorized sections, mobile-viewport height clamping (max-h-48 sm:max-h-72),
 * substring query highlighting, keyboard helper bar, and click-outside dismissal.
 */
export default function SlashCommandPalette({
  commands = [],
  activeCommandIndex = 0,
  onSelectCommand,
  onHoverIndex,
  searchQuery = '',
  onClose
}) {
  const paletteRef = useRef(null);
  const activeItemRef = useRef(null);

  // Group commands by category while retaining flatIndex for keyboard navigation
  const groupedSections = useMemo(() => {
    const groups = {};
    CATEGORY_ORDER.forEach((cat) => {
      groups[cat] = [];
    });

    commands.forEach((cmd, flatIndex) => {
      const cat = cmd.category || 'Utility';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push({ cmd, flatIndex });
    });

    // Include defined order plus any unexpected categories dynamically
    const allCategories = [
      ...CATEGORY_ORDER,
      ...Object.keys(groups).filter((c) => !CATEGORY_ORDER.includes(c))
    ];

    return allCategories
      .map((cat) => ({
        category: cat,
        meta: CATEGORY_METADATA[cat] || { title: cat, badgeClass: 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300' },
        items: groups[cat] || []
      }))
      .filter((section) => section.items.length > 0);
  }, [commands]);

  // Outside click dismissal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target)) {
        if (e.target && e.target.tagName === 'INPUT') return;
        if (onClose) onClose();
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [onClose]);

  // Keep active item in view inside clamped scroll container
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [activeCommandIndex]);

  return (
    <div
      ref={paletteRef}
      className="absolute bottom-full left-2 right-2 mb-2 bg-white/95 dark:bg-[#1A1325]/95 backdrop-blur-md border border-[#E7E2D8] dark:border-[#2D2340] rounded-xl shadow-2xl overflow-hidden z-40 max-h-48 sm:max-h-72 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-150"
    >
      {/* Palette Header */}
      <div className="px-3 py-1.5 bg-stone-100/90 dark:bg-[#150F22]/90 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between text-[10px] font-mono text-stone-500 uppercase tracking-wider shrink-0">
        <span>Slash Commands ({commands.length})</span>
        <span className="text-[9px] text-stone-400 font-sans hidden sm:inline">
          ↑↓ Navigate • Tab auto-fill • Enter run
        </span>
      </div>

      {/* Grouped Commands Scroll Area (Clamped to viewport) */}
      <div className="overflow-y-auto flex-1 overscroll-contain divide-y divide-stone-100 dark:divide-stone-800/40">
        {commands.length === 0 ? (
          <div className="px-3 py-4 text-center text-xs text-stone-400">
            No matching slash commands found. Type <span className="font-mono text-[#FF4D6D]">/help</span> for list.
          </div>
        ) : (
          groupedSections.map((section) => (
            <div key={section.category}>
              {/* Category Section Header */}
              <div className="px-3 py-1 bg-stone-50/90 dark:bg-[#150F22]/80 text-[9.5px] font-mono font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 sticky top-0 backdrop-blur-xs z-10 border-b border-stone-200/50 dark:border-stone-800/50">
                {section.meta.title}
              </div>

              {/* Category Items */}
              <div className="divide-y divide-stone-100/60 dark:divide-stone-800/30">
                {section.items.map(({ cmd, flatIndex }) => {
                  const isActive = flatIndex === activeCommandIndex;
                  return (
                    <button
                      key={cmd.command}
                      ref={isActive ? activeItemRef : null}
                      type="button"
                      onMouseEnter={() => onHoverIndex && onHoverIndex(flatIndex)}
                      onClick={() => onSelectCommand && onSelectCommand(cmd)}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-[#FF4D6D]/15 dark:bg-[#FF4D6D]/20 text-[#FF4D6D] dark:text-[#FF758F]'
                          : 'hover:bg-stone-100/60 dark:hover:bg-stone-800/60 text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono font-bold text-[#FF4D6D] dark:text-[#FF758F] shrink-0">
                          {highlightMatch(cmd.command, searchQuery)}
                        </span>
                        <span className="font-medium text-stone-800 dark:text-stone-200 truncate">
                          {highlightMatch(cmd.label, searchQuery)}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border shrink-0 hidden sm:inline-block ${section.meta.badgeClass}`}
                        >
                          {cmd.badge || cmd.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 dark:text-stone-500 truncate max-w-[45%] text-right font-sans">
                        {highlightMatch(cmd.description, searchQuery)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Keyboard Helper Bar Footer */}
      <div className="px-3 py-1.5 bg-stone-50/90 dark:bg-[#150F22]/90 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400 font-mono shrink-0">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-[9px] font-mono font-semibold">
              Tab
            </kbd>{' '}
            Auto
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-[9px] font-mono font-semibold">
              Enter
            </kbd>{' '}
            Run
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-[9px] font-mono font-semibold">
              Esc
            </kbd>{' '}
            Dismiss
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-[9.5px] text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
