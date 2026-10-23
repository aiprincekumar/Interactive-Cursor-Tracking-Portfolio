import React from 'react';

/**
 * SectionSkeleton
 * 
 * Lightweight glassmorphic skeleton loader for React.Suspense fallbacks.
 * Designed specifically to prevent Cumulative Layout Shift (CLS = 0)
 * while matching the dark/futuristic glassmorphism aesthetic of the portfolio.
 * 
 * @param {string} [props.id] - Optional DOM anchor id for scroll targeting
 * @param {'section' | 'card' | 'modal' | 'accordion' | 'terminal'} [props.variant='section']
 * @param {string} [props.minHeight] - Custom min-height class or style
 * @param {string} [props.className] - Additional custom CSS classes
 * @param {string} [props.ariaLabel] - Accessible label for screen readers
 */
export default function SectionSkeleton({
  id,
  variant = 'section',
  minHeight,
  className = '',
  ariaLabel = 'Loading content / सामग्री लोड हो रही है...'
}) {
  const shimmerClass =
    'bg-gradient-to-r from-stone-200/50 via-stone-300/60 to-stone-200/50 dark:from-stone-800/40 dark:via-stone-700/50 dark:to-stone-800/40 animate-pulse';

  if (variant === 'modal') {
    return (
      <div
        id={id}
        role="status"
        aria-busy="true"
        aria-label={ariaLabel}
        className={`fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm ${className}`}
      >
        <span className="sr-only">{ariaLabel}</span>
        <div className="w-full max-w-2xl min-h-[380px] rounded-2xl bg-white/90 dark:bg-[#120E1F]/90 backdrop-blur-xl border border-stone-200/60 dark:border-stone-800/60 shadow-2xl p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200/40 dark:border-stone-800/40">
            <div className={`h-6 w-48 rounded-lg ${shimmerClass}`} />
            <div className={`h-8 w-8 rounded-full ${shimmerClass}`} />
          </div>
          <div className={`h-4 w-3/4 rounded-md ${shimmerClass}`} />
          <div className={`h-32 w-full rounded-xl ${shimmerClass}`} />
          <div className="grid grid-cols-2 gap-4 mt-auto">
            <div className={`h-10 rounded-xl ${shimmerClass}`} />
            <div className={`h-10 rounded-xl ${shimmerClass}`} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'terminal') {
    return (
      <div
        id={id}
        role="status"
        aria-busy="true"
        aria-label={ariaLabel}
        className={`w-full max-w-4xl mx-auto min-h-[360px] rounded-2xl bg-[#0F0B1E]/90 border border-stone-800/80 shadow-2xl p-4 flex flex-col gap-4 font-mono text-xs ${className}`}
      >
        <span className="sr-only">{ariaLabel}</span>
        {/* Terminal Header */}
        <div className="flex items-center gap-2 pb-3 border-b border-stone-800">
          <div className="w-3 h-3 rounded-full bg-red-500/40" />
          <div className="w-3 h-3 rounded-full bg-amber-500/40" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
          <div className={`h-3 w-40 ml-4 rounded ${shimmerClass}`} />
        </div>
        {/* Terminal Body */}
        <div className="flex flex-col gap-3 py-4">
          <div className={`h-3 w-64 rounded ${shimmerClass}`} />
          <div className={`h-3 w-96 rounded ${shimmerClass}`} />
          <div className={`h-3 w-80 rounded ${shimmerClass}`} />
          <div className={`h-3 w-48 rounded ${shimmerClass}`} />
          <div className="flex items-center gap-2 mt-4">
            <div className={`h-4 w-4 rounded-full ${shimmerClass}`} />
            <div className={`h-3 w-32 rounded ${shimmerClass}`} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'accordion') {
    return (
      <div
        id={id}
        role="status"
        aria-busy="true"
        aria-label={ariaLabel}
        className={`w-full max-w-4xl mx-auto min-h-[360px] flex flex-col gap-4 py-8 px-4 scroll-mt-28 ${className}`}
      >
        <span className="sr-only">{ariaLabel}</span>
        {/* Accordion header placeholder */}
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className={`h-6 w-32 rounded-full ${shimmerClass}`} />
          <div className={`h-8 w-72 rounded-xl ${shimmerClass}`} />
        </div>
        {/* Accordion items */}
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="w-full h-16 rounded-xl bg-white/70 dark:bg-stone-900/50 backdrop-blur-md border border-stone-200/50 dark:border-stone-800/50 p-4 flex items-center justify-between"
          >
            <div className={`h-4 w-2/3 rounded-md ${shimmerClass}`} />
            <div className={`h-6 w-6 rounded-full ${shimmerClass}`} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        id={id}
        role="status"
        aria-busy="true"
        aria-label={ariaLabel}
        className={`w-full rounded-2xl bg-white/70 dark:bg-stone-900/50 backdrop-blur-md border border-stone-200/50 dark:border-stone-800/50 shadow-sm p-6 flex flex-col gap-4 scroll-mt-28 ${minHeight || 'min-h-[280px]'} ${className}`}
      >
        <span className="sr-only">{ariaLabel}</span>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${shimmerClass}`} />
          <div className="flex flex-col gap-2 flex-1">
            <div className={`h-4 w-32 rounded ${shimmerClass}`} />
            <div className={`h-3 w-20 rounded ${shimmerClass}`} />
          </div>
        </div>
        <div className={`h-3 w-full rounded ${shimmerClass}`} />
        <div className={`h-3 w-5/6 rounded ${shimmerClass}`} />
        <div className={`h-3 w-2/3 rounded ${shimmerClass}`} />
        <div className="flex gap-2 mt-auto pt-3">
          <div className={`h-6 w-16 rounded-full ${shimmerClass}`} />
          <div className={`h-6 w-16 rounded-full ${shimmerClass}`} />
        </div>
      </div>
    );
  }

  // Default 'section' variant with zero layout shift
  return (
    <section
      id={id}
      role="status"
      aria-busy="true"
      aria-label={ariaLabel}
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-8 transition-opacity duration-300 scroll-mt-28 ${minHeight || 'min-h-[460px]'} ${className}`}
    >
      <span className="sr-only">{ariaLabel}</span>
      {/* Section Header Skeleton */}
      <div className="flex flex-col items-center text-center gap-3">
        <div className={`h-6 w-28 rounded-full ${shimmerClass}`} />
        <div className={`h-8 sm:h-10 w-72 sm:w-96 rounded-xl ${shimmerClass}`} />
        <div className={`h-4 w-60 sm:w-80 rounded-md ${shimmerClass}`} />
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4">
        {[1, 2, 3].map((card) => (
          <div
            key={card}
            className="h-64 rounded-2xl bg-white/60 dark:bg-stone-900/40 backdrop-blur-md border border-stone-200/50 dark:border-stone-800/50 p-6 flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${shimmerClass}`} />
              <div className={`h-4 w-28 rounded ${shimmerClass}`} />
            </div>
            <div className={`h-3 w-full rounded ${shimmerClass}`} />
            <div className={`h-3 w-4/5 rounded ${shimmerClass}`} />
            <div className={`h-3 w-3/5 rounded ${shimmerClass}`} />
            <div className={`h-8 w-24 rounded-xl mt-auto ${shimmerClass}`} />
          </div>
        ))}
      </div>
    </section>
  );
}
