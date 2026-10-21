import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { soundFX } from '../utils/audio';
import { CATEGORIES, CURSOR_LIST } from '../utils/cursorConstants';
import CursorIcon from './CursorIcon';
import { useAnnounce } from '../context/AnnouncerContext';

export default function CursorSelectorRibbon({
  activeCursor = 'butterfly',
  onSelectCursor,
  defaultExpanded = true,
  onClose,
  className = ''
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef(null);

  // Filter cursors according to selected category
  const filteredCursors = CURSOR_LIST.filter((cursor) => {
    if (selectedCategory === 'All') return true;
    return cursor.category === selectedCategory;
  });

  const activeCursorData = CURSOR_LIST.find((c) => c.id === activeCursor) || CURSOR_LIST[0];

  // Check scroll boundary to toggle scroll indicator arrows
  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [filteredCursors, isExpanded]);

  const handleScroll = (direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    soundFX.playChipHover();
    const scrollAmount = direction === 'left' ? -220 : 220;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScroll, 200);
  };

  const handleToggleExpand = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    soundFX.playRibbonToggle(nextState);
  };

  let announce = null;
  try {
    const announcer = useAnnounce();
    announce = announcer?.announce;
  } catch {
    // fallback
  }

  const handleSelectCursor = (cursorId) => {
    soundFX.playCursorSelect(cursorId);
    if (onSelectCursor) {
      onSelectCursor(cursorId);
    }
    if (announce) {
      const cData = CURSOR_LIST.find((c) => c.id === cursorId);
      const cName = cData ? cData.name : cursorId;
      announce(`Equipped cursor: ${cName}`, 'polite');
    }
  };

  const handleCategoryChange = (category) => {
    soundFX.playChipHover();
    setSelectedCategory(category);
    if (announce) {
      announce(`Cursor category: ${category}`, 'polite');
    }
    // Smooth scroll back to start when switching tabs
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const handleCursorKeyDown = (e, currentIndex) => {
    let nextIndex = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % filteredCursors.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + filteredCursors.length) % filteredCursors.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = filteredCursors.length - 1;
    }

    if (nextIndex !== null) {
      const nextCursor = filteredCursors[nextIndex];
      handleSelectCursor(nextCursor.id);
      const nextBtn = scrollContainerRef.current?.children[nextIndex];
      nextBtn?.focus();
    }
  };

  return (
    <div
      className={`w-full max-w-7xl mx-auto px-4 md:px-8 transition-all duration-300 ${className}`}
      data-testid="cursor-selector-ribbon"
    >
      <div className="bg-[#FAF8F5]/90 backdrop-blur-xl border border-[#E7E2D8] rounded-2xl md:rounded-3xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        {/* Top Control Bar: Category Tabs & Expansion Toggle - Ultra-Compact */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 px-3 sm:px-4 py-1.5 border-b border-[#E7E2D8]/80 bg-[#F4EFE6]/50">
          {/* Active Status Badge & Title */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FF4D6D] to-[#FF758F] text-white shadow-2xs">
              <Sparkles className="w-3 h-3 animate-pulse" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-800 font-['Outfit',sans-serif]">
              Cursors
            </span>
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-[#FAF8F5] text-stone-500 border border-[#E7E2D8]">
              {filteredCursors.length}
            </span>
          </div>

          {/* Category Tabs Pill - Exactly matched to Navbar Menu Bar */}
          <div
            className="order-3 sm:order-2 w-full sm:w-auto flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar scroll-smooth gap-1 bg-[#F0EBE1]/60 px-2 sm:px-3 py-1 rounded-full border border-[#E5DFD5]"
            role="tablist"
            aria-label="Cursor Categories"
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  onClick={() => handleCategoryChange(cat)}
                  onMouseEnter={() => soundFX.playChipHover()}
                  aria-selected={isSelected}
                  title={`Filter: ${cat}`}
                  className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#18181B] text-white shadow-2xs'
                      : 'text-stone-700 hover:text-[#18181B] hover:bg-white/80'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Right Action: Icon-only Active Tag & Minimize/Expand/Close */}
          <div className="order-2 sm:order-3 flex items-center gap-1 ml-auto sm:ml-0">
            <button
              type="button"
              onClick={handleToggleExpand}
              className="flex items-center gap-1 p-1 sm:px-2 sm:py-0.5 rounded-full text-xs font-medium text-stone-700 bg-white/80 hover:bg-white border border-[#E7E2D8] hover:border-stone-300 transition-all cursor-pointer shadow-2xs"
              aria-label={isExpanded ? 'Collapse Cursor Ribbon' : 'Expand Cursor Ribbon'}
              title={`Active: ${activeCursorData.name} (${isExpanded ? 'Collapse' : 'Expand'})`}
            >
              <span className="text-sm leading-none flex items-center justify-center" aria-label={activeCursorData.name}>
                <CursorIcon cursorId={activeCursorData.id} size={15} />
              </span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-stone-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              )}
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full text-stone-500 hover:text-[#18181B] hover:bg-stone-200/50 transition-colors cursor-pointer"
                aria-label="Close Cursor Selector Ribbon"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Expandable Horizontal Scrollable Chip Deck - Ultra-Compact Icon-Only */}
        {isExpanded && (
          <div className="relative px-2 py-2 sm:px-4 sm:py-2.5 transition-all duration-300">
            {/* Scroll Navigation Arrows for desktop/overflow */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white/95 border border-[#E7E2D8] shadow-md flex items-center justify-center text-stone-700 hover:text-[#FF4D6D] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}

            {canScrollRight && (
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white/95 border border-[#E7E2D8] shadow-md flex items-center justify-center text-stone-700 hover:text-[#FF4D6D] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Scrollable Container of Icon-Only Cursor Chips */}
            <div
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-1 py-1"
              role="radiogroup"
              aria-label="Interactive Cursor Selection"
            >
              {filteredCursors.map((cursor, idx) => {
                const isActive = activeCursor === cursor.id;
                const isFocusable = isActive || (!filteredCursors.some(c => c.id === activeCursor) && idx === 0);
                return (
                  <button
                    key={cursor.id}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    tabIndex={isFocusable ? 0 : -1}
                    onKeyDown={(e) => handleCursorKeyDown(e, idx)}
                    onClick={() => handleSelectCursor(cursor.id)}
                    onMouseEnter={() => soundFX.playChipHover()}
                    className={`group relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-lg sm:text-xl transition-all duration-200 shrink-0 cursor-pointer focus:outline-hidden ${
                      isActive
                        ? `${cursor.borderColor} ${cursor.activeBg} ring-2 ${cursor.ringColor} shadow-xs scale-105`
                        : 'border border-[#E7E2D8] bg-white/80 hover:bg-white hover:border-stone-300 hover:scale-105 hover:shadow-2xs'
                    }`}
                    title={`${cursor.name} • ${cursor.tagline}`}
                    aria-label={cursor.name}
                  >
                    {/* Visual Vector Icon */}
                    <span className="transition-transform duration-200 group-hover:scale-115 select-none leading-none flex items-center justify-center">
                      <CursorIcon cursorId={cursor.id} size={22} />
                    </span>

                    {/* Active Corner Indicator Check/Dot */}
                    {isActive && (
                      <span
                        className="absolute -top-1 -right-1 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-white bg-[#18181B] shadow-xs"
                        title="Active Mode"
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}

                    {/* Active Bottom Glow Line Indicator */}
                    {isActive && (
                      <span
                        className="absolute bottom-1 left-2.5 right-2.5 h-[2px] rounded-full"
                        style={{ backgroundColor: cursor.accentColor }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
