import fs from 'fs';
import path from 'path';

const panelPath = path.resolve('src/components/ControlCenterPanel.jsx');
let src = fs.readFileSync(panelPath, 'utf8');

// 1. Ensure React hooks are imported
src = src.replace(
  "import React from 'react';",
  "import React, { useState, useRef, useEffect, useCallback } from 'react';"
);

// 2. Insert hooks and scroll handlers before return (
const handlersTarget = `  const handleTabKeyDown = (e, currentId) => {`;

const handlersReplacement = `  const tablistRef = useRef(null);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const [, setIsDragging] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollIndicator = useCallback(() => {
    if (!tablistRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = tablistRef.current;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = tablistRef.current;
    if (!el) return;
    updateScrollIndicator();
    const handleScroll = () => updateScrollIndicator();
    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [updateScrollIndicator]);

  useEffect(() => {
    const el = tablistRef.current;
    if (!el) return;
    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Auto-center active tab smoothly on change or mount
  useEffect(() => {
    if (!tablistRef.current) return;
    const activeTabBtn = tablistRef.current.querySelector(\`#tab-\${activeTab}\`);
    if (activeTabBtn) {
      activeTabBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
    const timer = setTimeout(() => {
      updateScrollIndicator();
    }, 350);
    return () => clearTimeout(timer);
  }, [activeTab, updateScrollIndicator]);

  const handleScrollLeft = () => {
    if (tablistRef.current) {
      tablistRef.current.scrollBy({ left: -160, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (tablistRef.current) {
      tablistRef.current.scrollBy({ left: 160, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX;
    scrollStartRef.current = tablistRef.current ? tablistRef.current.scrollLeft : 0;
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !tablistRef.current) return;
    const delta = e.pageX - startXRef.current;
    if (Math.abs(delta) > 5) {
      hasDraggedRef.current = true;
    }
    tablistRef.current.scrollLeft = scrollStartRef.current - delta;
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 50);
    }
  };

  const handleMouseLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 50);
    }
  };

  const handleTabKeyDown = (e, currentId) => {`;

if (!src.includes(handlersTarget)) {
  console.error('handleTabKeyDown not found!');
  process.exit(1);
}
src = src.replace(handlersTarget, handlersReplacement);

// 3. Replace the old tablist with the new one
const oldTablistStart = `{/* 5-Tab Navigation Bar */}`;
const oldTablistEnd = `{/* ========================================================================= */}\n      {/* TAB 1: AUDIO STUDIO`;

const s = src.indexOf(oldTablistStart);
const e = src.indexOf(oldTablistEnd);

if (s === -1 || e === -1) {
  console.error('Tablist bounds not found! s:', s, 'e:', e);
  process.exit(1);
}

const newTablistMarkup = `{/* Tab Navigation Header with Chevrons and Edge Fade Gradients */}
      <div className="relative w-full overflow-hidden rounded-2xl group/tabnav">
        {/* Left Edge Fade Gradient & Button */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pr-6 bg-gradient-to-r from-[#FAF8F5] dark:from-[#181226] to-transparent pointer-events-none">
            <button
              type="button"
              aria-label="Scroll tabs left"
              onClick={handleScrollLeft}
              className="p-1.5 rounded-full bg-white/90 dark:bg-[#1D162E]/90 border border-stone-200 dark:border-stone-700 shadow-md text-stone-700 dark:text-stone-300 pointer-events-auto hover:scale-105 active:scale-95 transition-all cursor-pointer ml-1"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tablist Container */}
        <div
          ref={tablistRef}
          role="tablist"
          aria-label="Control Center Tabs"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="flex items-center gap-1.5 overflow-x-auto scroll-smooth no-scrollbar p-1.5 rounded-2xl bg-stone-100/80 dark:bg-[#150F21]/80 border border-stone-200/80 dark:border-stone-800 backdrop-blur-md"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                id={\`tab-\${tab.id}\`}
                role="tab"
                aria-selected={isActive}
                aria-controls={\`panel-\${tab.id}\`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => {
                  if (!hasDraggedRef.current) {
                    setActiveTab(tab.id);
                    if (soundEnabled) soundFX.playHapticClick();
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(
                        new CustomEvent('portfolio:announce', {
                          detail: { message: \`Switched to Control Center tab: \${tab.label}\`, priority: 'polite' }
                        })
                      );
                    }
                  }
                }}
                onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
                className={\`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 select-none cursor-pointer \${
                  isActive
                    ? 'bg-white dark:bg-[#251B3D] text-[#18181B] dark:text-white shadow-xs border border-stone-200 dark:border-stone-700'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }\`}
              >
                <Icon className={\`w-4 h-4 \${isActive ? 'text-[#FF4D6D]' : 'text-stone-400'}\`} />
                <span>{tab.label}</span>
                {tab.tag && (
                  <span className={\`text-[10px] px-1.5 py-0.5 rounded-md font-mono \${
                    isActive
                      ? 'bg-[#FF4D6D]/15 text-[#FF4D6D]'
                      : 'bg-stone-200/60 dark:bg-stone-800 text-stone-400'
                  } \${isDrawer ? 'max-w-[80px] truncate' : ''}\`}>
                    {tab.tag}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Edge Fade Gradient & Button */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center pl-6 bg-gradient-to-l from-[#FAF8F5] dark:from-[#181226] to-transparent pointer-events-none">
            <button
              type="button"
              aria-label="Scroll tabs right"
              onClick={handleScrollRight}
              className="p-1.5 rounded-full bg-white/90 dark:bg-[#1D162E]/90 border border-stone-200 dark:border-stone-700 shadow-md text-stone-700 dark:text-stone-300 pointer-events-auto hover:scale-105 active:scale-95 transition-all cursor-pointer mr-1"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>\n\n      `;

src = src.slice(0, s) + newTablistMarkup + src.slice(e);

fs.writeFileSync(panelPath, src, 'utf8');
console.log('Successfully patched tab navigation in ControlCenterPanel.jsx!');
