import React from 'react';
import {
  Layers,
  ArrowRight,
  ArrowDown,
  Database,
  Cpu,
  ShieldCheck,
  Send,
  Workflow
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TIER_ICONS = [Database, ShieldCheck, Cpu, Send];

/**
 * CaseStudyArchitecture
 * Renders a responsive 4-tier visual system architecture diagram for a case study.
 * Desktop: 4-tier horizontal pipeline with directional connectors.
 * Mobile: Vertical sequential cascade.
 * Fully compatible with Linen Light, Obsidian Dark, High-Contrast, and Simple Mode.
 */
export default function CaseStudyArchitecture({ architectureData, accentColor = '#FF4D6D' }) {
  const { isHindi } = useLanguage();

  if (!architectureData || !architectureData.tiers) {
    return null;
  }

  const { title, description, tiers } = architectureData;

  return (
    <div className="case-study-architecture space-y-6">
      {/* Architecture Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#ECE7DF] dark:border-[#2D2340]">
        <div>
          <div className="flex items-center gap-2">
            <Workflow className="w-4 h-4" style={{ color: accentColor }} aria-hidden="true" />
            <h3 className="text-base sm:text-lg font-bold text-[#18181B] dark:text-white tracking-tight">
              {title || (isHindi ? 'सिस्टम आर्किटेक्चर ब्लूप्रिंट' : 'System Architecture Blueprint')}
            </h3>
          </div>
          {description && (
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              {description}
            </p>
          )}
        </div>
        <span
          className="self-start sm:self-auto text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md border"
          style={{
            borderColor: `${accentColor}40`,
            backgroundColor: `${accentColor}15`,
            color: accentColor
          }}
        >
          {isHindi ? '4-स्तरीय ब्लूप्रिंट' : '4-Tier Blueprint'}
        </span>
      </div>

      {/* 4-Tier Interactive Pipeline Flow */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {tiers.map((tier, tierIdx) => {
          const TierIcon = TIER_ICONS[tierIdx] || Layers;
          const isLastTier = tierIdx === tiers.length - 1;

          return (
            <div key={tier.name || tierIdx} className="flex flex-col relative group">
              {/* Tier Container Card */}
              <div className="flex-1 flex flex-col p-4 rounded-xl bg-white/95 dark:bg-[#161122]/95 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs hover:border-[#18181B] dark:hover:border-stone-500 transition-all duration-200">
                {/* Tier Header */}
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#ECE7DF] dark:border-[#251C36]">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                    style={{
                      borderColor: `${accentColor}40`,
                      backgroundColor: `${accentColor}18`,
                      color: accentColor
                    }}
                  >
                    <TierIcon className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold block text-stone-500 dark:text-stone-400">
                      {isHindi ? `स्तर 0${tierIdx + 1}` : `Tier 0${tierIdx + 1}`}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#18181B] dark:text-white truncate">
                      {tier.name.replace(/^Tier\s*\d+:\s*/i, '')}
                    </h4>
                  </div>
                </div>

                {/* Tier Nodes List */}
                <div className="mt-3 space-y-2.5 flex-1 flex flex-col justify-start">
                  {tier.nodes?.map((node, nodeIdx) => (
                    <div
                      key={node.name || nodeIdx}
                      className="p-2.5 rounded-lg bg-stone-50 dark:bg-[#100C1A] border border-stone-200/80 dark:border-[#2D2340] hover:border-[#18181B] dark:hover:border-stone-500 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-[#18181B] dark:text-stone-200 truncate">
                          {node.name}
                        </span>
                        {node.tech && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-200/80 dark:bg-[#251C36] text-stone-700 dark:text-stone-300 shrink-0 font-medium">
                            {node.tech}
                          </span>
                        )}
                      </div>
                      {node.detail && (
                        <p className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-400">
                          {node.detail}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Connecting Arrows between Tiers */}
              {!isLastTier && (
                <>
                  {/* Desktop Right Arrow */}
                  <div
                    className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white dark:bg-[#1A1429] border border-stone-300 dark:border-stone-700 items-center justify-center shadow-xs text-stone-500 dark:text-stone-400"
                    aria-hidden="true"
                  >
                    <ArrowRight className="w-3.5 h-3.5" style={{ color: accentColor }} />
                  </div>
                  {/* Mobile Down Arrow */}
                  <div
                    className="md:hidden flex justify-center py-2 text-stone-400"
                    aria-hidden="true"
                  >
                    <ArrowDown className="w-4 h-4" style={{ color: accentColor }} />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
