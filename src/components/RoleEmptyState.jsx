import React from 'react';
import { Compass } from 'lucide-react';

/**
 * RoleEmptyState
 *
 * A subtle, neutral empty-state component displayed when a role track
 * (e.g., custom or 'other') does not have credentials configured for a section.
 *
 * @param {Object} props
 * @param {string} [props.sectionName] - Optional name of the section (e.g. 'Experience', 'Projects')
 * @param {boolean} [props.dark=false] - Whether the empty state is embedded in a dedicated dark section
 * @param {string} [props.className] - Optional extra Tailwind classes
 */
export function RoleEmptyState({ sectionName, dark = false, className = '' }) {
  const containerClasses = dark
    ? 'bg-[#241E33]/60 border border-purple-900/30 text-stone-200'
    : 'bg-stone-50/60 dark:bg-stone-900/40 border border-stone-200/70 dark:border-stone-800/70 text-stone-800 dark:text-stone-200';

  const badgeClasses = dark
    ? 'border-purple-900/40 text-stone-400 bg-[#1A1625]/60'
    : 'border-stone-200/60 dark:border-stone-800/60 text-stone-500 dark:text-stone-400 bg-stone-100/60 dark:bg-stone-800/40';

  const iconContainerClasses = dark
    ? 'w-12 h-12 rounded-2xl bg-[#1A1625]/80 border border-purple-900/40 text-stone-400'
    : 'w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/50 text-stone-500 dark:text-stone-400';

  const headlineClasses = dark
    ? 'text-stone-100'
    : 'text-stone-800 dark:text-stone-100';

  const descriptionClasses = dark
    ? 'text-stone-400'
    : 'text-stone-600 dark:text-stone-400';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`w-full py-8 sm:py-12 px-4 flex flex-col items-center justify-center animate-tab-fade ${className}`}
    >
      <div className={`relative w-full max-w-xl mx-auto rounded-3xl p-8 sm:p-10 text-center overflow-hidden transition-all duration-300 ${containerClasses}`}>
        {/* Section Badge (optional context) */}
        {sectionName && (
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium tracking-wide mb-5 ${badgeClasses}`}>
            <span>{sectionName}</span>
          </div>
        )}

        {/* Quiet Neutral Icon Container with No Glow */}
        <div className="inline-flex items-center justify-center mb-5">
          <div className={`flex items-center justify-center ${iconContainerClasses}`}>
            <Compass className="w-6 h-6" aria-hidden="true" />
          </div>
        </div>

        {/* Headline */}
        <h3 className={`text-xl sm:text-2xl font-bold tracking-tight font-['Outfit',sans-serif] mb-2.5 ${headlineClasses}`}>
          Information Coming Soon
        </h3>

        {/* Subtitle / Description */}
        <p className={`text-sm sm:text-base max-w-md mx-auto font-normal leading-relaxed ${descriptionClasses}`}>
          This custom role profile is currently being curated. Please select a defined role from the top navigation bar to explore detailed credentials.
        </p>
      </div>
    </div>
  );
}

export default RoleEmptyState;
