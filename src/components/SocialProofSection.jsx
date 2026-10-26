import React, { memo, useState, useMemo, useCallback, useContext } from 'react';
import {
  Zap,
  Layers,
  ShieldCheck,
  Activity,
  Award,
  TrendingUp,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { RoleContext } from '../context/RoleContext';
import { useSimpleMode } from '../context/SimpleModeContext';
import { useLanguage } from '../context/LanguageContext';
import AnimatedCounter from './AnimatedCounter';
import { DEFAULT_SOCIAL_PROOF_CONFIG } from '../data/socialProofConfig';

// Map icon names from configuration to Lucide components
const ICON_MAP = {
  Zap,
  Layers,
  ShieldCheck,
  Activity,
  Award,
  TrendingUp,
  Sparkles,
  CheckCircle2
};

/**
 * Interactive Metric Card with cursor-tracking spotlight and magnetic lift
 */
function ImpactMetricCard({ metric, accentColor, isSimpleMode, currentRole, isHindi = false }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const IconComponent = (metric && ICON_MAP[metric.icon]) || Zap;

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

  if (!metric) return null;

  const categoryText = (isHindi && metric.category_hi) ? metric.category_hi : (metric.category || 'Benchmark');
  const labelText = (isHindi && metric.label_hi) ? metric.label_hi : (metric.label || '');
  const sublabelText = (isHindi && metric.sublabel_hi) ? metric.sublabel_hi : (metric.sublabel || '');
  const statusText = (isHindi && metric.status_hi) ? metric.status_hi : (metric.status || 'Active');
  const trendText = (isHindi && metric.trend_hi) ? metric.trend_hi : (metric.trend || '');

  return (
    <div
      tabIndex={0}
      data-card="true"
      data-tts={`Benchmark: ${labelText}, ${metric.value || ''}. ${sublabelText}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid={`metric-card-${metric.id || 'stat'}`}
      className="group relative bg-white dark:bg-[#161122] rounded-3xl p-5 sm:p-7 border border-[#E7E2D8] dark:border-[#2D2340] hover:border-[#FF4D6D]/40 dark:hover:border-[#FF4D6D]/40 shadow-sm shadow-stone-900/5 dark:shadow-none transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden cursor-default select-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
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

      {/* Card Content Top */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-[11px] font-bold uppercase font-mono tracking-wider px-2.5 py-1 rounded-full bg-stone-100 dark:bg-[#201830] text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white transition-colors"
          >
            {categoryText}
          </span>
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundColor: `${accentColor}15`,
              color: accentColor
            }}
          >
            <IconComponent className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>

        {/* Quantifiable Stat with Animated Counter */}
        <div className="flex items-baseline gap-1 mb-2">
          <div className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-[#18181B] dark:text-[#F5F2F8] font-mono tracking-tight">
            <AnimatedCounter
              value={metric.value || '0'}
              resetKey={`${metric.id || 'metric'}-${currentRole}`}
            />
          </div>
        </div>

        <h3 className="text-sm font-bold text-stone-800 dark:text-stone-100 mb-1 group-hover:text-[#FF4D6D] dark:group-hover:text-white transition-colors">
          {labelText}
        </h3>

        <p className="text-xs text-stone-600 dark:text-stone-300 font-medium leading-relaxed mb-3">
          {sublabelText}
        </p>
      </div>

      {/* Card Content Bottom / Telemetry Strip */}
      <div className="relative z-10 pt-4 mt-2 border-t border-[#ECE7DF] dark:border-[#2D2340] flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-400 font-mono">
        <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
          {statusText}
        </span>
        <span className="truncate max-w-[140px] text-right" title={trendText}>
          {trendText}
        </span>
      </div>
    </div>
  );
}

/**
 * Key Achievements & Production Impact Metrics Section
 */
function SocialProofSection({
  config = DEFAULT_SOCIAL_PROOF_CONFIG
}) {
  const { isSimpleMode } = useSimpleMode();
  const roleContext = useContext(RoleContext);
  const { isHindi } = useLanguage();

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

  // Safe fallback to default arrays if empty, null, or undefined
  const impactMetricsList = useMemo(() => {
    if (Array.isArray(config?.impactMetrics) && config.impactMetrics.length > 0) {
      return config.impactMetrics;
    }
    return DEFAULT_SOCIAL_PROOF_CONFIG.impactMetrics;
  }, [config?.impactMetrics]);

  const eyebrowText = (isHindi && config?.eyebrowText_hi) ? config.eyebrowText_hi : (config?.eyebrowText || 'Key Achievements & Production Impact');
  const titlePrefix = (isHindi && config?.titlePrefix_hi) ? config.titlePrefix_hi : (config?.titlePrefix || 'Proof-First');
  const titleHighlight = (isHindi && config?.titleHighlight_hi) ? config.titleHighlight_hi : (config?.titleHighlight || 'Technical Impact');
  const titleSuffix = (isHindi && config?.titleSuffix_hi) ? config.titleSuffix_hi : (config?.titleSuffix || '& Achievements.');
  const descriptionText = (isHindi && config?.description_hi) ? config.description_hi : (config?.description || 'Key achievements and production impact metrics.');
  const metricsHeading = (isHindi && config?.metricsHeading_hi) ? config.metricsHeading_hi : (config?.metricsHeading || 'Production Benchmarks & Technical Impact');

  return (
    <section
      id={config?.sectionId || 'social-proof'}
      aria-labelledby="social-proof-heading"
      data-testid="social-proof-section"
      className="py-24 bg-[#FAF8F5] dark:bg-[#0B0813] text-[#18181B] dark:text-[#F5F2F8] relative overflow-hidden select-none my-12 scroll-mt-28 border-y border-[#E7E2D8] dark:border-[#2D2340]"
    >
      {/* Ambient background glow */}
      <div
        className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-500"
        style={{
          background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)`
        }}
      />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header - Conforming to standard portfolio section header specifications */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            {/* Standard Eyebrow Badge Pill */}
            <div
              tabIndex={0}
              data-tts="Section 6: Technical Impact"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#161122] border border-[#E7E2D8] dark:border-[#2D2340] text-[#18181B] dark:text-[#F5F2F8] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs whitespace-nowrap max-w-full overflow-x-auto focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
              <span className="truncate sm:overflow-visible">
                {config?.eyebrowNumber || '06'} ✦ {eyebrowText}
              </span>
            </div>

            {/* Standard Heading <h2> and Accent Underline Bar */}
            <h2
              id="social-proof-heading"
              tabIndex={0}
              data-tts={`${titlePrefix} ${titleHighlight} ${titleSuffix}`}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] xl:text-5xl font-black text-[#18181B] dark:text-white tracking-tight font-['Outfit',sans-serif] leading-[1.08] mb-3 whitespace-normal sm:whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg"
            >
              {titlePrefix} <span className="text-[#FF4D6D]" style={{ color: accentColor }}>{titleHighlight}</span> {titleSuffix}
            </h2>
            <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: accentColor || '#FF4D6D' }} />

            <p
              tabIndex={0}
              data-tts={descriptionText}
              className="text-stone-600 dark:text-stone-400 text-sm md:text-base max-w-2xl font-normal leading-relaxed focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg"
            >
              {descriptionText}
            </p>
          </div>

          {/* Clean Telemetry Badge (Read-only status, no toggle button) */}
          <div
            tabIndex={0}
            data-tts={`Telemetry Status: ${isHindi ? '4 सत्यापित उत्पादन बेंचमार्क' : '4 Verified Production Benchmarks'}`}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#161122] border border-[#E7E2D8] dark:border-[#2D2340] shadow-sm shadow-stone-900/5 dark:shadow-none self-start md:self-auto shrink-0 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs sm:text-sm font-mono font-bold text-stone-700 dark:text-stone-300">
              {isHindi ? '4 सत्यापित उत्पादन बेंचमार्क' : '4 Verified Production Benchmarks'}
            </span>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* KEY ACHIEVEMENTS & QUANTIFIABLE IMPACT METRICS GRID */}
        {/* ==================================================================== */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: accentColor }} aria-hidden="true" />
              <h3 className="text-sm font-extrabold font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {metricsHeading}
              </h3>
            </div>
            <span className="text-xs font-mono text-stone-400 dark:text-stone-500 hidden sm:inline-block">
              {isHindi ? '✦ रीयल-टाइम कर्सर प्रतिक्रियाशीलता एवं होवर स्पॉटलाइट सक्षम' : '✦ Real-time cursor reactivity & hover spotlight enabled'}
            </span>
          </div>

          {/* Dynamic Metrics Grid */}
          <div
            data-testid="impact-metrics-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {impactMetricsList.map((metric) => (
              <ImpactMetricCard
                key={metric.id}
                metric={metric}
                accentColor={accentColor}
                isSimpleMode={isSimpleMode}
                currentRole={activeRole}
                isHindi={isHindi}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

SocialProofSection.displayName = 'SocialProofSection';
export default memo(SocialProofSection);
