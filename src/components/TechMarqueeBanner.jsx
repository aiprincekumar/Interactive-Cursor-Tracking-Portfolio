import React from 'react';

const TOP_ITEMS = [
  'Tally Prime',
  'GST Portal',
  'Income Tax E-Filing',
  'MS Excel (Advanced)',
  'Path Solution ERP',
  'Adobe Photoshop',
  'CorelDraw',
  'PageMaker',
  'Windows 11 OS',
  'ADCA Infocity',
];

const BOTTOM_ITEMS = [
  'Tax Advisory & Filing',
  'Financial Accounting',
  'GST Compliance & ITC',
  'MIS Executive Analytics',
  'Inventory & Stock Control',
  'DAY-NULM Skill Mission',
  'Smart Card Operations',
  'Office Administration',
  'Business Development',
];

export default function TechMarqueeBanner() {
  // Multiply items to ensure seamless infinite looping on ultra-wide screens
  const topSequence = Array(12).fill(TOP_ITEMS).flat();
  const bottomSequence = Array(12).fill(BOTTOM_ITEMS).flat();

  return (
    <div className="relative py-20 sm:py-28 overflow-hidden select-none pointer-events-none my-8">
      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />

      {/* TOP RIBBON: Dark Charcoal #18181B at -3.5 degrees (Reel t=7.85s) */}
      <div
        className="w-[150%] -ml-[25%] bg-[#18181B] py-3.5 sm:py-4.5 shadow-xl shadow-stone-950/25 border-y border-stone-800/80 z-10 relative overflow-hidden"
        style={{
          transform: 'rotate(-3.5deg)',
          transformOrigin: 'center center'
        }}
      >
        <div className="flex w-max animate-marquee-left items-center pointer-events-auto">
          {topSequence.map((tech, idx) => (
            <div
              key={`top-${idx}`}
              className="flex items-center gap-6 sm:gap-8 px-3 sm:px-4 shrink-0 text-white font-extrabold text-sm sm:text-base md:text-lg tracking-widest uppercase font-['Outfit',sans-serif]"
            >
              <span>{tech}</span>
              <span className="text-sm sm:text-base">🦋</span>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM RIBBON: Coral Pink #FF4D6D at +3 degrees (Crosses over top ribbon - Reel t=8.0s) */}
      <div
        className="w-[150%] -ml-[25%] bg-[#FF4D6D] py-3.5 sm:py-4.5 shadow-2xl shadow-pink-600/35 border-y border-[#FF2B55] z-20 relative overflow-hidden -mt-2 sm:-mt-3"
        style={{
          transform: 'rotate(2.8deg)',
          transformOrigin: 'center center'
        }}
      >
        <div className="flex w-max animate-marquee-right items-center pointer-events-auto">
          {bottomSequence.map((skill, idx) => (
            <div
              key={`bottom-${idx}`}
              className="flex items-center gap-6 sm:gap-8 px-3 sm:px-4 shrink-0 text-white font-extrabold text-sm sm:text-base md:text-lg tracking-widest uppercase font-['Outfit',sans-serif]"
            >
              <span>{skill}</span>
              <span className="text-white text-sm sm:text-base">🦋</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
