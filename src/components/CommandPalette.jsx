import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, CornerDownLeft, Layers, FolderGit2, Compass, SearchX } from 'lucide-react';
import { soundFX } from '../utils/audio';
import { SEARCH_ITEMS } from '../utils/searchCatalog';

export default function CommandPalette({ isOpen, onClose, soundEnabled = true }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const itemRefs = useRef([]);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }

  // Auto-focus input and lock body scroll on open
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Multi-token filter across title, description, category, and keywords
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_ITEMS;
    const tokens = q.split(/\s+/).filter(Boolean);
    return SEARCH_ITEMS.filter((item) => {
      const searchTarget = `${item.title} ${item.description} ${item.category} ${item.keywords}`.toLowerCase();
      return tokens.every((token) => searchTarget.includes(token));
    });
  }, [query]);

  // Ensure active index is bounded
  const activeIndex = filteredItems.length === 0 ? 0 : Math.min(selectedIndex, filteredItems.length - 1);

  // Ensure active highlighted item is visible within the scrollable container
  useEffect(() => {
    if (itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex].scrollIntoView({
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [activeIndex]);

  // Navigate to target anchor smoothly without full page reload
  const handleSelect = (item) => {
    if (!item) return;
    onClose();
    if (soundEnabled) soundFX.playFocusBeep();

    const target = document.getElementById(item.targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Keyboard navigation within the modal
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredItems.length === 0 ? 0 : (prev + 1) % filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredItems.length === 0 ? 0 : (prev - 1 + filteredItems.length) % filteredItems.length));
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
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-3 sm:px-4 pb-6 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#FAF8F5] rounded-2xl border border-[#E7E2D8] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E7E2D8] bg-white gap-3 shrink-0">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, section, project, or skill..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-[#18181B] placeholder-stone-400 focus:outline-none"
            aria-label="Search query"
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

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2 space-y-1 divide-y divide-stone-100/50">
          {filteredItems.length === 0 ? (
            <div className="py-12 px-6 text-center text-stone-500">
              <SearchX className="w-10 h-10 mx-auto text-stone-300 mb-2" />
              <p className="text-sm font-bold text-stone-700">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-stone-400 mt-1">
                Try searching for &ldquo;Projects&rdquo;, &ldquo;React&rdquo;, &ldquo;Tally&rdquo;, &ldquo;About&rdquo;, or &ldquo;Contact&rdquo;
              </p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer select-none ${
                    isSelected
                      ? 'bg-[#18181B] text-white shadow-xs scale-[1.01]'
                      : 'hover:bg-white text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                        isSelected
                          ? 'bg-stone-800 border-stone-700 text-[#FF4D6D]'
                          : 'bg-white border-[#E7E2D8] text-stone-500 group-hover:text-[#FF4D6D]'
                      }`}
                    >
                      {item.category === 'Sections' && <Compass className="w-4 h-4" />}
                      {item.category === 'Projects' && <FolderGit2 className="w-4 h-4" />}
                      {item.category === 'Skills' && <Layers className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold tracking-tight truncate">
                          {item.title}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                            isSelected
                              ? 'bg-[#FF4D6D] text-white'
                              : 'bg-stone-200/70 text-stone-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <p
                        className={`text-[11px] truncate mt-0.5 ${
                          isSelected ? 'text-stone-300' : 'text-stone-500'
                        }`}
                      >
                        {item.description}
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
            })
          )}
        </div>

        {/* Footer Keyboard Hints */}
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
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-200 shadow-2xs">esc</kbd> Dismiss
          </span>
        </div>
      </div>
    </div>
  );
}
