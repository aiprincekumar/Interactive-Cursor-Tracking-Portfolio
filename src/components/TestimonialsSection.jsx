import React, { useState, useMemo, useCallback, useContext } from 'react';
import {
  Quote,
  Star,
  CheckCircle2,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { RoleContext } from '../context/RoleContext';
import { useSimpleMode } from '../context/SimpleModeContext';
import { TESTIMONIALS_CONFIG } from '../data/testimonialsConfig';

/**
 * Interactive Testimonial Card with dynamic cursor-tracking radial spotlight
 */
function TestimonialCard({ item, accentColor, isSimpleMode }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (isSimpleMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, [isSimpleMode]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  if (!item) return null;

  return (
    <article
      tabIndex={0}
      data-card="true"
      data-tts={`Testimonial from ${item.author || 'Client'}, ${item.role || 'Partner'}: ${item.quote || ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid={`testimonial-card-${item.id}`}
      className="group relative bg-white dark:bg-[#161122] rounded-3xl p-6 sm:p-7 border border-[#E7E2D8] dark:border-[#2D2340] hover:border-[#FF4D6D]/40 dark:hover:border-[#FF4D6D]/40 shadow-sm shadow-stone-900/5 dark:shadow-none transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden cursor-default select-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
    >
      {/* Dynamic Cursor-Tracking Radial Spotlight */}
      {!isSimpleMode && isHovered && (
        <div
          className="pointer-events-none absolute inset-0 opacity-100 transition-opacity duration-300 rounded-3xl"
          style={{
            background: `radial-gradient(320px circle at ${mousePos.x}px ${mousePos.y}px, ${accentColor}18, transparent 70%)`
          }}
        />
      )}

      {/* Card Header: Category Tag & Star Ratings */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <span
          className="text-[11px] font-bold uppercase font-mono tracking-wider px-2.5 py-1 rounded-full bg-stone-100 dark:bg-[#201830] text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white transition-colors"
        >
          {item.tag || item.category || 'Endorsement'}
        </span>
        <div className="flex items-center gap-1 text-amber-400">
          {[...Array(item.rating || 5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
          ))}
        </div>
      </div>

      {/* Quote Body */}
      <div className="relative z-10 mb-6">
        <Quote
          className="w-8 h-8 opacity-20 mb-2 transition-transform duration-300 group-hover:scale-110"
          style={{ color: accentColor }}
          aria-hidden="true"
        />
        <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 font-medium leading-relaxed italic">
          "{item.quote}"
        </p>
      </div>

      {/* Card Footer: Author Profile & Verification Badge */}
      <div className="relative z-10 pt-4 border-t border-[#ECE7DF] dark:border-[#2D2340] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold font-mono text-xs text-white shrink-0 shadow-xs"
            style={{ backgroundColor: accentColor }}
            aria-hidden="true"
          >
            {item.avatar || 'AV'}
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-white group-hover:text-[#FF4D6D] dark:group-hover:text-white transition-colors leading-tight">
              {item.author}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              {item.role} • <span className="font-semibold text-stone-700 dark:text-stone-300">{item.company}</span>
            </p>
          </div>
        </div>

        {item.verified && (
          <span
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0"
            title="Verified Stakeholder Endorsement"
          >
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Verified</span>
          </span>
        )}
      </div>
    </article>
  );
}

/**
 * Standalone Zero-Code Pure Configuration Testimonials Section
 * Returns null if config.enabled is false (zero DOM footprint).
 */
export default function TestimonialsSection({
  config = TESTIMONIALS_CONFIG
}) {
  const { isSimpleMode } = useSimpleMode();
  const roleContext = useContext(RoleContext);
  const [activeCategory, setActiveCategory] = useState('All');

  const activeRole = roleContext?.activeRole || 'accountant';
  const isVibe = Boolean(roleContext?.isVibeCoding || roleContext?.isVibe || activeRole === 'vibe_coding');
  const isOverview = Boolean(roleContext?.isOverview || activeRole === 'overview');
  const isOther = Boolean(roleContext?.isOther || activeRole === 'other');
  const isMIS = Boolean(roleContext?.isMIS || activeRole === 'mis');

  const accentColor = isOverview
    ? '#6366F1'
    : isVibe
    ? '#10B981'
    : isOther
    ? '#8B5CF6'
    : isMIS
    ? '#3B82F6'
    : '#FF4D6D';

  // Double Protection Guard: Return null immediately if testimonials are not enabled
  if (!config?.enabled) {
    return null;
  }

  const allTestimonials = Array.isArray(config?.testimonials) ? config.testimonials : [];
  const categories = Array.isArray(config?.categories) && config.categories.length > 0
    ? config.categories
    : ['All'];

  // Filtered testimonials by category
  const filteredTestimonials = useMemo(() => {
    if (activeCategory === 'All') return allTestimonials;
    return allTestimonials.filter((item) => item.category === activeCategory);
  }, [allTestimonials, activeCategory]);

  return (
    <section
      id={config?.sectionId || 'testimonials'}
      aria-labelledby="testimonials-heading"
      data-testid="testimonials-section"
      className="py-24 bg-[#FAF8F5] dark:bg-[#0B0813] text-[#18181B] dark:text-[#F5F2F8] relative overflow-hidden select-none my-12 scroll-mt-28 border-y border-[#E7E2D8] dark:border-[#2D2340]"
    >
      {/* Ambient background glow */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-500"
        style={{
          background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)`
        }}
      />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            {/* Standard Eyebrow Badge Pill */}
            <div
              tabIndex={0}
              data-tts="Section 7: Testimonials"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#161122] border border-[#E7E2D8] dark:border-[#2D2340] text-[#18181B] dark:text-[#F5F2F8] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs whitespace-nowrap max-w-full overflow-x-auto focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
              <span className="truncate sm:overflow-visible">
                {config?.eyebrowNumber || '07'} ✦ {config?.eyebrowText || 'Client & Peer Endorsements'}
              </span>
            </div>

            {/* Standard Heading <h2> and Accent Underline Bar */}
            <h2
              id="testimonials-heading"
              tabIndex={0}
              data-tts={`${config?.titlePrefix || 'Verified'} ${config?.titleHighlight || 'Testimonials'} ${config?.titleSuffix || 'and Recommendations.'}`}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] xl:text-5xl font-black text-[#18181B] dark:text-white tracking-tight font-['Outfit',sans-serif] leading-[1.08] mb-3 whitespace-normal sm:whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg"
            >
              {config?.titlePrefix || 'Verified'} <span style={{ color: accentColor }}>{config?.titleHighlight || 'Testimonials'}</span> {config?.titleSuffix || '& Recommendations.'}
            </h2>
            <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: accentColor || '#FF4D6D' }} />

            <p
              tabIndex={0}
              data-tts={config?.description || 'Client and peer endorsements.'}
              className="text-stone-600 dark:text-stone-400 text-sm md:text-base max-w-2xl font-normal leading-relaxed focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg"
            >
              {config?.description}
            </p>
          </div>

          {/* Telemetry Badge */}
          <div
            tabIndex={0}
            data-tts={`${allTestimonials.length} Verified Reviews`}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#161122] border border-[#E7E2D8] dark:border-[#2D2340] shadow-sm shadow-stone-900/5 dark:shadow-none self-start md:self-auto shrink-0 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
          >
            <Sparkles className="w-4 h-4 text-amber-500" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-mono font-bold text-stone-700 dark:text-stone-300">
              {allTestimonials.length} Verified Reviews
            </span>
          </div>
        </div>

        {/* Category Filter Pills (if > 1 category) */}
        {categories.length > 1 && (
          <div
            role="tablist"
            aria-label="Filter testimonials by category"
            className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar"
          >
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#18181B] dark:bg-white text-white dark:text-[#18181B] shadow-xs'
                      : 'bg-white dark:bg-[#161122] text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border border-[#E7E2D8] dark:border-[#2D2340]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Testimonials Grid */}
        <div
          data-testid="testimonials-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
        >
          {filteredTestimonials.map((item) => (
            <TestimonialCard
              key={item.id}
              item={item}
              accentColor={accentColor}
              isSimpleMode={isSimpleMode}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
