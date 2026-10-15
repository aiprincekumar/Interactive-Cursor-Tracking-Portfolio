import React from 'react';
import { Trophy, Zap } from 'lucide-react';

const MILESTONE_STATS = [
  {
    platform: 'Tally Accounting',
    stat: '4+ Yrs',
    label: 'Financial & Inventory Systems',
    sublabel: 'Tally Prime, Ledgers, BRS & Balance Sheets',
    color: '#FFAA00',
    link: '#experience'
  },
  {
    platform: 'Taxation & Filing',
    stat: '3+ Yrs',
    label: 'GST & Income Tax Compliance',
    sublabel: '500+ returns, ITC 2B audit & e-filing',
    color: '#10B981',
    link: '#projects'
  },
  {
    platform: 'Field Operations',
    stat: '4 Dist',
    label: 'Smart Card Logistics Rollout',
    sublabel: 'Bihar & Jharkhand citizen verification & hardware',
    color: '#FF4D6D',
    link: '#experience'
  },
  {
    platform: 'IT Certification',
    stat: 'ADCA',
    label: 'Advance Diploma in Computer App',
    sublabel: 'Infocity Daltonganj • Distinction in Applications & Hardware',
    color: '#A855F7',
    link: '#about'
  }
];

const TICKER_ITEMS = [
  '4+ Years Tally Accounting',
  '3+ Years GST & Tax Filing',
  '4 Districts Smart Card Rollout',
  'ADCA Certified (Infocity Daltonganj)',
  '100% Statutory Compliance Adherence',
  'DAY-NULM Skill India MIS',
  '500+ Tax Returns Processed',
  'Advanced Excel & MIS Modeling'
];

export default function CodingAchievementsSection() {
  const tickerSequence = Array(8).fill(TICKER_ITEMS).flat();

  return (
    <section id="achievements" className="py-24 bg-[#1A1625] text-white relative overflow-hidden select-none my-12 scroll-mt-28">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF4D6D]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Scrolling Platform Marquee matching Reel t=15.0s */}
      <div className="w-[120%] -ml-[10%] bg-[#241E33] border-y border-purple-900/40 py-3.5 mb-16 overflow-hidden">
        <div className="flex w-max animate-marquee-left items-center">
          {tickerSequence.map((item, idx) => (
            <div
              key={`ticker-${idx}`}
              className="flex items-center gap-6 px-4 shrink-0 text-stone-200 font-extrabold text-xs sm:text-sm tracking-wider uppercase font-['Outfit',sans-serif]"
            >
              <span>{item}</span>
              <span className="text-[#FF4D6D] text-sm">🦋</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#241E33] border border-purple-800/50 text-[#FFA4B6] text-xs font-bold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />
              05 ✦ Professional Milestones
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-['Outfit',sans-serif]">
              Professional Milestones &amp; Certifications
            </h2>
            <p className="mt-2 text-stone-400 text-sm md:text-base max-w-xl font-normal leading-relaxed">
              Proven domain excellence in corporate accounting, taxation statutory compliance, regional MIS administration, and technical education.
            </p>
          </div>

          {/* Aggregate Badge */}
          <div className="flex items-center gap-3 bg-[#241E33] px-5 py-3 rounded-2xl border border-purple-800/50">
            <Trophy className="w-5 h-5 text-[#FF4D6D]" />
            <div>
              <div className="text-[11px] text-stone-400 font-mono uppercase">Career Experience</div>
              <div className="text-lg font-black text-white font-mono">4+ Years Verified</div>
            </div>
          </div>
        </div>

        {/* Platform Cards Grid matching Reel t=15.5s */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {MILESTONE_STATS.map((p) => (
            <a
              key={p.platform}
              href={p.link}
              className="bg-[#241E33]/90 hover:bg-[#2C243E] rounded-3xl p-6 border border-purple-900/40 hover:border-[#FF4D6D]/40 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase font-mono tracking-wider text-stone-400 group-hover:text-white transition-colors">
                    {p.platform}
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                </div>
                <div className="text-4xl font-black text-white font-mono tracking-tight mb-1">
                  {p.stat}
                </div>
                <div className="text-xs font-semibold text-stone-300">
                  {p.label}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-purple-900/30 text-[11px] text-stone-400 font-mono">
                {p.sublabel}
              </div>
            </a>
          ))}
        </div>

        {/* Vocational Impact Highlight Card */}
        <div className="bg-gradient-to-r from-[#241E33] to-[#2C243E] rounded-3xl p-6 sm:p-8 border border-purple-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FF4D6D] flex items-center justify-center text-white shadow-lg shadow-pink-600/30 shrink-0">
              <span className="text-xl">🦋</span>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#FFA4B6] font-bold">
                <Zap className="w-3 h-3 text-[#FF4D6D]" /> GOVERNMENT INITIATIVE &amp; VOCATIONAL IMPACT
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif] mt-0.5">
                DAY-NULM Skill India Mission &amp; Regional Computer Education
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl">
                Empowered 2,500+ urban candidates through centralized MIS reporting, digital literacy instruction, and local community IT empowerment in Daltonganj &amp; Palamau region.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1A1625] border border-purple-700/60 text-xs font-mono font-bold text-[#FFA4B6]">
              Certified Impact Track
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
