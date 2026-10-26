import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORY_TABS = [
  { id: 'all', label: 'All' },
  { id: 'projects', label: '🚀 Projects' },
  { id: 'tax', label: '📊 Tax & MIS' },
  { id: 'tech', label: '⚡ Tech & AI' },
  { id: 'experience', label: '💼 Experience' },
  { id: 'hire', label: '📬 Hire' }
];

/**
 * SuggestionChipsDrawer
 * 2-row sliding grid with category filter tabs, smooth mouse drag & touch scroll,
 * visible scroll arrows, and roving keyboard navigation.
 */
export default function SuggestionChipsDrawer({
  chips = [],
  onSelectChip,
  isTyping = false
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const scrollRef = useRef(null);
  const chipRefs = useRef([]);
  const dragStartRef = useRef({ x: 0, scrollLeft: 0, hasMoved: false });

  // Filter chips based on active category
  const visibleChips = useMemo(() => {
    if (!Array.isArray(chips) || chips.length === 0) return [];
    if (activeCategory === 'all') return chips;
    const filtered = chips.filter((c) => c.category === activeCategory);
    return filtered.length > 0 ? filtered : chips;
  }, [chips, activeCategory]);

  const updateScrollBoundaries = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollBoundaries();
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => updateScrollBoundaries();
    el.addEventListener('scroll', handleScroll, { passive: true });

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updateScrollBoundaries());
      resizeObserver.observe(el);
    }

    return () => {
      el.removeEventListener('scroll', handleScroll);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [updateScrollBoundaries, visibleChips]);

  const handleScrollClick = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const delta = direction === 'left' ? -200 : 200;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const handleMouseDown = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
      hasMoved: false
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragStartRef.current.x) * 1.5;
    if (Math.abs(x - dragStartRef.current.x) > 4) {
      dragStartRef.current.hasMoved = true;
    }
    el.scrollLeft = dragStartRef.current.scrollLeft - walk;
    updateScrollBoundaries();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    updateScrollBoundaries();
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    updateScrollBoundaries();
  };

  const handleChipKeyDown = (e, idx) => {
    const total = visibleChips.length;
    if (total === 0) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (idx + 1) % total;
      setFocusedIndex(next);
      chipRefs.current[next]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (idx - 1 + total) % total;
      setFocusedIndex(prev);
      chipRefs.current[prev]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      setFocusedIndex(0);
      chipRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      setFocusedIndex(total - 1);
      chipRefs.current[total - 1]?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isTyping && onSelectChip) {
        onSelectChip(visibleChips[idx]);
      }
    }
  };

  const handleChipClick = (chip) => {
    if (dragStartRef.current.hasMoved) return;
    if (isTyping) return;
    if (onSelectChip) {
      onSelectChip(chip);
    }
  };

  if (!chips || chips.length === 0) {
    return null;
  }

  return (
    <div className="px-2.5 py-1.5 border-t border-[#E7E2D8]/60 dark:border-[#2D2340]/60 bg-stone-50/70 dark:bg-[#120D1D]/60 shrink-0 select-none">
      {/* Category Tabs Header */}
      <div className="flex items-center justify-between gap-1 mb-1 px-1">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveCategory(tab.id);
                  setFocusedIndex(0);
                  if (scrollRef.current) {
                    scrollRef.current.scrollLeft = 0;
                  }
                }}
                className={`text-[9.5px] px-2 py-0.5 rounded-full font-medium transition-all duration-150 cursor-pointer whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-[#FF4D6D] text-white shadow-2xs font-semibold'
                    : 'bg-stone-200/60 dark:bg-stone-800/60 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-700/80'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <span className="text-[9px] font-mono uppercase tracking-wider text-stone-400 dark:text-stone-500 shrink-0 hidden sm:inline">
          {visibleChips.length} Chips
        </span>
      </div>

      {/* 2-Row Sliding Grid Track with Left/Right Arrows */}
      <div className="relative flex items-center w-full">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => handleScrollClick('left')}
          disabled={!canScrollLeft}
          aria-label="Scroll suggestions left"
          className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 z-10 mr-1 cursor-pointer bg-white dark:bg-[#251B38] border border-[#FF4D6D]/40 text-[#FF4D6D] shadow-xs active:scale-90 ${
            canScrollLeft ? 'opacity-100 hover:bg-[#FF4D6D] hover:text-white' : 'opacity-25 pointer-events-none'
          }`}
        >
          <ChevronLeft size={14} />
        </button>

        {/* 2-Row Horizontal Sliding Grid */}
        <div
          ref={scrollRef}
          role="toolbar"
          aria-label="Suggested prompt chips"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className={`grid grid-rows-2 grid-flow-col auto-cols-max gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1 w-full touch-pan-x ${
            isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
          }`}
        >
          {visibleChips.map((chip, idx) => {
            const isFocused = focusedIndex === idx;
            return (
              <button
                key={chip.id || idx}
                ref={(el) => {
                  chipRefs.current[idx] = el;
                }}
                type="button"
                tabIndex={isFocused ? 0 : -1}
                disabled={isTyping}
                onClick={() => handleChipClick(chip)}
                onKeyDown={(e) => handleChipKeyDown(e, idx)}
                className={`shrink-0 h-[26px] min-h-[26px] px-2.5 py-0.5 rounded-lg text-[10.5px] font-sans font-medium inline-flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer shadow-2xs whitespace-nowrap active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden ${
                  isTyping
                    ? 'opacity-40 pointer-events-none'
                    : 'bg-white/90 dark:bg-[#1E162B]/90 backdrop-blur-xs border border-[#E7E2D8] dark:border-[#2D2340] text-stone-700 dark:text-stone-300 hover:text-[#FF4D6D] dark:hover:text-[#FF758F] hover:bg-[#FF4D6D]/10 dark:hover:bg-[#FF4D6D]/20 hover:border-[#FF4D6D]/60'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => handleScrollClick('right')}
          disabled={!canScrollRight}
          aria-label="Scroll suggestions right"
          className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 z-10 ml-1 cursor-pointer bg-white dark:bg-[#251B38] border border-[#FF4D6D]/40 text-[#FF4D6D] shadow-xs active:scale-90 ${
            canScrollRight ? 'opacity-100 hover:bg-[#FF4D6D] hover:text-white' : 'opacity-25 pointer-events-none'
          }`}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
