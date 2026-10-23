import React, { useState, useEffect, useRef, useCallback } from 'react';
import { soundFX } from '../utils/audio';
import { useRoleTab } from '../context/RoleContext';
import { useLab } from '../context/LabContext';

const TOP_ITEMS = [
  'Tally Prime',
  'GST Portal',
  'Income Tax E-Filing',
  'Cursor IDE',
  'Claude Code',
  'Next.js 14',
  'MS Excel (Advanced)',
  'Path Solution ERP',
  'Adobe Photoshop',
  'Supabase',
  'CorelDraw',
  'PageMaker',
  'Windows 11 OS',
  'ADCA Infocity',
];

const BOTTOM_ITEMS = [
  'Tax Advisory & Filing',
  'Financial Accounting',
  'GST Compliance & ITC',
  'Windsurf',
  'v0.dev',
  'Tailwind CSS',
  'LLM Prompt APIs',
  'MIS Executive Analytics',
  'Inventory & Stock Control',
  'DAY-NULM Skill Mission',
  'Smart Card Operations',
  'Office Administration',
  'Business Development',
];

const TECH_DETAILS = {
  // Vibe Coding & AI Software Engineering Items
  'Cursor IDE': {
    title: 'Cursor AI Code Editor',
    categoryBadge: 'AI Coding Environments',
    experienceMetric: 'Production Mastery • 98% Velocity',
    role: 'vibe_coding',
    roleLabel: 'Vibe Coding Track',
    targetId: 'skill-cursor-windsurf-ides',
    skillKey: 'Cursor & Windsurf IDEs',
    hint: 'Click to inspect skill →'
  },
  'Claude Code': {
    title: 'Claude Code Agent Loops',
    categoryBadge: 'Autonomous Dev Loops',
    experienceMetric: 'Multi-Agent DAGs • 96% Mastery',
    role: 'vibe_coding',
    roleLabel: 'Vibe Coding Track',
    targetId: 'skill-claude-code-agent-loops',
    skillKey: 'Claude Code & Agent Loops',
    hint: 'Click to inspect skill →'
  },
  'Windsurf': {
    title: 'Windsurf Cascade AI Flow',
    categoryBadge: 'AI-Native IDEs',
    experienceMetric: 'Cascade Architecture • 96% Flow',
    role: 'vibe_coding',
    roleLabel: 'Vibe Coding Track',
    targetId: 'skill-cursor-windsurf-ides',
    skillKey: 'Cursor & Windsurf IDEs',
    hint: 'Click to inspect skill →'
  },
  'v0.dev': {
    title: 'v0.dev Generative UI',
    categoryBadge: 'Prompt-to-Component',
    experienceMetric: 'React & Tailwind • 95% Precision',
    role: 'vibe_coding',
    roleLabel: 'Vibe Coding Track',
    targetId: 'skill-v0-dev-generative-ui',
    skillKey: 'v0.dev & Generative UI',
    hint: 'Click to inspect skill →'
  },
  'Next.js 14': {
    title: 'Next.js 14 (App Router & SSR)',
    categoryBadge: 'Full-Stack SaaS',
    experienceMetric: 'App Router & SSR • 97% Mastery',
    role: 'vibe_coding',
    roleLabel: 'Vibe Coding Track',
    targetId: 'skill-next-js-14-react-ecosystem',
    skillKey: 'Next.js 14 & React Ecosystem',
    hint: 'Click to inspect skill →'
  },
  'Supabase': {
    title: 'Supabase Cloud Backend & RLS',
    categoryBadge: 'PostgreSQL & Realtime',
    experienceMetric: 'Auth, RLS & Edge • 95% Mastery',
    role: 'vibe_coding',
    roleLabel: 'Vibe Coding Track',
    targetId: 'skill-supabase-cloud-backend',
    skillKey: 'Supabase & Cloud Backend',
    hint: 'Click to inspect skill →'
  },
  'Tailwind CSS': {
    title: 'Tailwind CSS (Modern UI)',
    categoryBadge: 'Utility-First Styling',
    experienceMetric: 'Modern Dark UI • 98% Polish',
    role: 'vibe_coding',
    roleLabel: 'Vibe Coding Track',
    targetId: 'skill-tailwind-css-modern-ui',
    skillKey: 'Tailwind CSS & Modern UI',
    hint: 'Click to inspect skill →'
  },
  'LLM Prompt APIs': {
    title: 'LLM APIs & Prompt Architecture',
    categoryBadge: 'Generative AI Systems',
    experienceMetric: 'Claude & GPT APIs • 96% Mastery',
    role: 'vibe_coding',
    roleLabel: 'Vibe Coding Track',
    targetId: 'skill-llm-apis-prompt-architecture',
    skillKey: 'LLM APIs & Prompt Architecture',
    hint: 'Click to inspect skill →'
  },
  // Top Ribbon Items
  'Tally Prime': {
    title: 'Tally Prime & ERP 9',
    categoryBadge: 'Statutory Accounting & Tax',
    experienceMetric: '7+ Years Experience • 98% Mastery',
    role: 'accountant',
    roleLabel: 'Accountant Track',
    targetId: 'skill-tally-prime-erp-9',
    skillKey: 'Tally Prime & ERP 9',
    hint: 'Click to inspect skill →'
  },
  'GST Portal': {
    title: 'GST Portal & Return Filing',
    categoryBadge: 'Indirect Taxation & Portal Filing',
    experienceMetric: '7+ Years Experience • 96% Mastery',
    role: 'accountant',
    roleLabel: 'Accountant Track',
    targetId: 'skill-gst-filing-compliance',
    skillKey: 'GST Filing & Compliance',
    hint: 'Click to inspect skill →'
  },
  'Income Tax E-Filing': {
    title: 'Income Tax E-Filing & Audit',
    categoryBadge: 'Direct Taxation & ITR Returns',
    experienceMetric: '7+ Years Experience • 94% Mastery',
    role: 'accountant',
    roleLabel: 'Accountant Track',
    targetId: 'skill-income-tax-e-filing',
    skillKey: 'Income Tax E-Filing',
    hint: 'Click to inspect skill →'
  },
  'MS Excel (Advanced)': {
    title: 'MS Excel (Advanced Modeling)',
    categoryBadge: 'Financial Modeling & Analytics',
    experienceMetric: '7+ Years Experience • 97% Mastery',
    roles: ['accountant', 'mis'],
    roleLabel: 'Dual Track',
    targetId: 'skill-ms-excel-advanced',
    skillKey: 'MS Excel (Advanced)',
    hint: 'Click to inspect skill →'
  },
  'Path Solution ERP': {
    title: 'Path Solution ERP (Billing & POS)',
    categoryBadge: 'Commercial Operations',
    experienceMetric: '4+ Years Experience • 94% Mastery',
    role: 'accountant',
    roleLabel: 'Accountant Track',
    targetId: 'skill-path-solution-erp',
    skillKey: 'Path Solution ERP',
    hint: 'Click to inspect skill →'
  },
  'Adobe Photoshop': {
    title: 'Adobe Photoshop 7.0',
    categoryBadge: 'Commercial Layouts & Graphics',
    experienceMetric: '5+ Years Experience • 92% Mastery',
    role: 'mis',
    roleLabel: 'MIS & IT Track',
    targetId: 'skill-dtp-design-suite',
    skillKey: 'DTP Design Suite',
    hint: 'Click to inspect skill →'
  },
  'CorelDraw': {
    title: 'CorelDraw X7 (Vector Design)',
    categoryBadge: 'Commercial Layouts & Graphics',
    experienceMetric: '5+ Years Experience • 92% Mastery',
    role: 'mis',
    roleLabel: 'MIS & IT Track',
    targetId: 'skill-dtp-design-suite',
    skillKey: 'DTP Design Suite',
    hint: 'Click to inspect skill →'
  },
  'PageMaker': {
    title: 'Adobe PageMaker 7.0',
    categoryBadge: 'Desktop Publishing (DTP)',
    experienceMetric: '5+ Years Experience • 92% Mastery',
    role: 'mis',
    roleLabel: 'MIS & IT Track',
    targetId: 'skill-dtp-design-suite',
    skillKey: 'DTP Design Suite',
    hint: 'Click to inspect skill →'
  },
  'Windows 11 OS': {
    title: 'Windows 11 OS Administration',
    categoryBadge: 'IT Systems & Workstations',
    experienceMetric: '6+ Years Experience • 95% Mastery',
    role: 'mis',
    roleLabel: 'MIS & IT Track',
    targetId: 'skill-windows-os-administration',
    skillKey: 'Windows OS Administration',
    hint: 'Click to inspect skill →'
  },
  'ADCA Infocity': {
    title: 'ADCA (Infocity Daltonganj)',
    categoryBadge: 'Commercial Computing & IT Suite',
    experienceMetric: 'Infocity Certified • 96% Mastery',
    role: 'mis',
    roleLabel: 'MIS & IT Track',
    targetId: 'skill-commercial-computing-office-it-suite',
    skillKey: 'Commercial Computing & Office IT Suite',
    hint: 'Click to inspect skill →'
  },

  // Bottom Ribbon Items
  'Tax Advisory & Filing': {
    title: 'Tax Advisory & ITR Filing',
    categoryBadge: 'Statutory Accounting & Tax',
    experienceMetric: '7+ Years Experience • 94% Mastery',
    role: 'accountant',
    roleLabel: 'Accountant Track',
    targetId: 'skill-income-tax-e-filing',
    skillKey: 'Income Tax E-Filing',
    hint: 'Click to inspect skill →'
  },
  'Financial Accounting': {
    title: 'Financial Accounting & Ledger Audit',
    categoryBadge: 'Statutory Accounting & Tax',
    experienceMetric: '7+ Years Experience • 98% Mastery',
    role: 'accountant',
    roleLabel: 'Accountant Track',
    targetId: 'skill-tally-prime-erp-9',
    skillKey: 'Tally Prime & ERP 9',
    hint: 'Click to inspect skill →'
  },
  'GST Compliance & ITC': {
    title: 'GST Compliance & ITC 2B',
    categoryBadge: 'Indirect Taxation & Portal Filing',
    experienceMetric: '7+ Years Experience • 96% Mastery',
    role: 'accountant',
    roleLabel: 'Accountant Track',
    targetId: 'skill-gst-filing-compliance',
    skillKey: 'GST Filing & Compliance',
    hint: 'Click to inspect skill →'
  },
  'MIS Executive Analytics': {
    title: 'MIS Executive Analytics',
    categoryBadge: 'MIS Analytics & Dashboards',
    experienceMetric: '5+ Years Experience • 96% Mastery',
    role: 'mis',
    roleLabel: 'MIS Track',
    targetId: 'skill-mis-reporting-analytics',
    skillKey: 'MIS Reporting & Analytics',
    hint: 'Click to inspect skill →'
  },
  'Inventory & Stock Control': {
    title: 'Stock Handling & Logistics',
    categoryBadge: 'Warehousing & Physical Audits',
    experienceMetric: '6+ Years Experience • 94% Mastery',
    role: 'mis',
    roleLabel: 'MIS Track',
    targetId: 'skill-stock-handling-logistics',
    skillKey: 'Stock Handling & Logistics',
    hint: 'Click to inspect skill →'
  },
  'DAY-NULM Skill Mission': {
    title: 'DAY-NULM Skill Mission Portal',
    categoryBadge: 'Government Operations & Analytics',
    experienceMetric: '50+ Batches • 2,500+ Trainees',
    role: 'mis',
    roleLabel: 'Featured Project',
    targetId: 'proj-day-nulm',
    isProject: true,
    hint: 'Click to inspect project →'
  },
  'Smart Card Operations': {
    title: 'Smart Card Operations & Biometrics',
    categoryBadge: 'Field Operations & Data Systems',
    experienceMetric: '4 Districts • 50,000+ Enrollments',
    role: 'mis',
    roleLabel: 'Featured Project',
    targetId: 'proj-smart-card',
    isProject: true,
    hint: 'Click to inspect project →'
  },
  'Office Administration': {
    title: 'Office Administration & Governance',
    categoryBadge: 'Commercial Operations',
    experienceMetric: '7+ Years Experience • 95% Mastery',
    role: 'accountant',
    roleLabel: 'Accountant Track',
    targetId: 'skill-office-administration',
    skillKey: 'Office Administration',
    hint: 'Click to inspect skill →'
  },
  'Business Development': {
    title: 'Business Development & Client Relations',
    categoryBadge: 'Commercial Operations',
    experienceMetric: '7+ Years Experience • 91% Mastery',
    role: 'accountant',
    roleLabel: 'Accountant Track',
    targetId: 'skill-business-development',
    skillKey: 'Business Development',
    hint: 'Click to inspect skill →'
  }
};

// Hoist sequences outside component to avoid re-allocation on every render
const TOP_SEQUENCE = Array(12).fill(TOP_ITEMS).flat();
const BOTTOM_SEQUENCE = Array(12).fill(BOTTOM_ITEMS).flat();

function areMarqueeCardPropsEqual(prevProps, nextProps) {
  return (
    prevProps.isTooltipOpen === nextProps.isTooltipOpen &&
    prevProps.itemKey === nextProps.itemKey &&
    prevProps.tech === nextProps.tech &&
    prevProps.isBottom === nextProps.isBottom &&
    prevProps.isDuplicate === nextProps.isDuplicate
  );
}

export const MarqueeCard = React.memo(function MarqueeCard({
  itemKey,
  tech,
  isBottom = false,
  isDuplicate = false,
  isTooltipOpen = false,
  handleMouseEnter,
  handleMouseLeave,
  handleBlur,
  handleItemClick,
  handleItemNavigation,
  setActiveTooltipKey,
}) {
  const details = TECH_DETAILS[tech] || {
    title: tech,
    categoryBadge: isBottom ? 'Core Competency' : 'Technical Skill',
    experienceMetric: isBottom ? '7+ Years Experience' : 'Verified Expertise',
    hint: 'Click to inspect skill →'
  };

  return (
    <div
      key={itemKey}
      id={`marquee-item-${itemKey}`}
      className="relative flex items-center gap-6 sm:gap-8 px-3 sm:px-4 shrink-0 text-white font-extrabold text-sm sm:text-base md:text-lg tracking-widest uppercase font-['Outfit',sans-serif] cursor-pointer group transition-transform duration-200 hover:scale-105 active:scale-95"
      onMouseEnter={() => handleMouseEnter(itemKey)}
      onMouseLeave={() => handleMouseLeave(itemKey)}
      onFocus={() => {
        if (!isDuplicate) setActiveTooltipKey(itemKey);
      }}
      onBlur={() => handleBlur(itemKey)}
      onClick={(e) => handleItemClick(e, tech, itemKey)}
      role="button"
      tabIndex={-1}
      aria-hidden="true"
      aria-haspopup="true"
      aria-expanded={isTooltipOpen}
      aria-label={`Inspect ${tech}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleItemNavigation(details);
        }
      }}
    >
      <span className={isBottom ? "hover:text-rose-100 transition-colors drop-shadow-xs" : "hover:text-rose-200 transition-colors drop-shadow-xs"}>
        {tech}
      </span>
      <span
        className={isBottom ? "text-white text-sm sm:text-base opacity-80 group-hover:scale-125 transition-transform duration-200" : "text-sm sm:text-base opacity-80 group-hover:scale-125 transition-transform duration-200"}
        aria-hidden="true"
      >
        🦋
      </span>

      {/* Rich Glassmorphism Tooltip (Counter-rotated to remain horizontal 0deg) */}
      {isTooltipOpen && (
        <div
          role="tooltip"
          onClick={(e) => {
            e.stopPropagation();
            handleItemNavigation(details);
            setActiveTooltipKey(null);
          }}
          className={`absolute ${isBottom ? 'top-full mt-3' : 'bottom-full mb-3'} left-1/2 z-50 w-64 sm:w-72 max-w-[85vw] bg-slate-900/95 backdrop-blur-md border border-[#FF4D6D]/40 shadow-2xl rounded-xl supports-[not(backdrop-filter)]:bg-slate-950 p-3 sm:p-3.5 text-left cursor-pointer normal-case tracking-normal font-sans select-none animate-in fade-in zoom-in-95 duration-150`}
          style={
            isBottom
              ? {
                  transform: 'translateX(-50%) rotate(-2.8deg)',
                  transformOrigin: 'top center'
                }
              : {
                  transform: 'translateX(-50%) rotate(3.5deg)',
                  transformOrigin: 'bottom center'
                }
          }
        >
          {/* Domain / Category Badge & Role Label */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-[#FF4D6D] bg-[#FF4D6D]/15 px-2 py-0.5 rounded-full border border-[#FF4D6D]/30 truncate">
              {details.categoryBadge}
            </span>
            {details.roleLabel && (
              <span className="text-[10px] font-mono text-stone-400 bg-stone-800/80 px-2 py-0.5 rounded-md border border-stone-700/60 shrink-0">
                {details.roleLabel}
              </span>
            )}
          </div>

          {/* Technology / Item Title */}
          <div className="text-sm sm:text-base font-extrabold text-white tracking-tight font-['Outfit',sans-serif] leading-tight mb-1">
            {details.title}
          </div>

          {/* Experience / Mastery Metric */}
          <div className="text-xs font-semibold text-rose-200/90 flex items-center gap-1.5 mb-2.5">
            <span className="text-[#FF4D6D]">✦</span>
            <span>{details.experienceMetric}</span>
          </div>

          {/* Subtle Interaction Hint */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-stone-400 group-hover:text-stone-200">
            <span>{details.hint || 'Click to inspect skill →'}</span>
            <span className="text-xs font-bold text-[#FF4D6D]">↗</span>
          </div>

          {/* Directional pointer arrow */}
          {isBottom ? (
            <div
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900/95 border-l border-t border-[#FF4D6D]/40 supports-[not(backdrop-filter)]:bg-slate-950 rotate-45 pointer-events-none"
              aria-hidden="true"
            />
          ) : (
            <div
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900/95 border-r border-b border-[#FF4D6D]/40 supports-[not(backdrop-filter)]:bg-slate-950 rotate-45 pointer-events-none"
              aria-hidden="true"
            />
          )}
        </div>
      )}
    </div>
  );
}, areMarqueeCardPropsEqual);

export default function TechMarqueeBanner() {
  const bannerRef = useRef(null);
  const [activeTooltipKey, setActiveTooltipKey] = useState(null);

  let roleContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    roleContext = useRoleTab();
  } catch {
    // Graceful fallback if rendered outside RoleProvider
  }

  const activeRole = roleContext?.activeRole || 'accountant';
  const selectRole = roleContext?.selectRole;

  const activeRoleRef = useRef(activeRole);
  activeRoleRef.current = activeRole;
  const selectRoleRef = useRef(selectRole);
  selectRoleRef.current = selectRole;
  const activeTooltipKeyRef = useRef(activeTooltipKey);
  activeTooltipKeyRef.current = activeTooltipKey;

  // Dismiss tooltip when tapping/clicking outside active item, pressing Escape, or window resize/orientationchange
  useEffect(() => {
    if (!activeTooltipKey) return;

    const handlePointerDown = (e) => {
      const activeEl = document.getElementById(`marquee-item-${activeTooltipKey}`);
      if (!activeEl || !activeEl.contains(e.target)) {
        setActiveTooltipKey(null);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveTooltipKey(null);
      }
    };

    const handleWindowChange = () => {
      setActiveTooltipKey(null);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleWindowChange);
    window.addEventListener('orientationchange', handleWindowChange);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('orientationchange', handleWindowChange);
    };
  }, [activeTooltipKey]);

  // Execute smart contextual click and jump navigation
  const handleItemNavigation = useCallback((details) => {
    if (!details) return;

    soundFX.playFocusBeep();

    const currentRole = activeRoleRef.current || 'accountant';
    const currentSelectRole = selectRoleRef.current;

    // 1. Check if role tab needs switching
    let targetRole = details.role;
    if (details.roles) {
      targetRole = details.roles.includes(currentRole) ? currentRole : details.roles[0];
    }

    const roleChanged = targetRole && targetRole !== currentRole;

    if (roleChanged) {
      if (currentSelectRole) {
        currentSelectRole(targetRole);
      } else if (selectRole) {
        selectRole(targetRole);
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('switch-role-tab', { detail: { role: targetRole } }));
      }
    }

    // 2. Dispatch skill selection event if target is a skill
    if (details.skillKey && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('select-skill', { detail: { skill: details.skillKey } }));
    }

    // 3. Smooth scroll and apply 2.5s glowing pulse highlight with retry resilience and reduced-motion support
    const scrollAndHighlight = (attemptsRemaining = 8) => {
      if (!details.targetId || typeof document === 'undefined') return;

      const targetEl = document.getElementById(details.targetId);
      if (targetEl) {
        const prefersReducedMotion =
          typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        targetEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });

        const pulseClasses = [
          'ring-4',
          'ring-[#FF4D6D]',
          'ring-offset-4',
          'ring-offset-white',
          'dark:ring-offset-stone-900',
          'shadow-2xl',
          'shadow-[#FF4D6D]/40',
          'animate-pulse'
        ];

        if (targetEl._pulseTimeout) {
          clearTimeout(targetEl._pulseTimeout);
        }

        targetEl.classList.add(...pulseClasses);
        targetEl._pulseTimeout = setTimeout(() => {
          targetEl.classList.remove(...pulseClasses);
          targetEl._pulseTimeout = null;
        }, 2500);
      } else if (attemptsRemaining > 0) {
        setTimeout(() => scrollAndHighlight(attemptsRemaining - 1), 60);
      }
    };

    // Delay scroll slightly to allow React to finish mounting the newly activated role tabpanel
    if (roleChanged) {
      setTimeout(scrollAndHighlight, 180);
    } else {
      setTimeout(scrollAndHighlight, 50);
    }
  }, [selectRole]);

  // Hover handlers for mouse devices
  const handleMouseEnter = useCallback((itemKey) => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setActiveTooltipKey(itemKey);
    }
  }, []);

  const handleMouseLeave = useCallback((itemKey) => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setActiveTooltipKey((current) => (itemKey ? (current === itemKey ? null : current) : null));
    }
  }, []);

  // Blur handler for keyboard accessibility (independent of hover media query)
  const handleBlur = useCallback((itemKey) => {
    setActiveTooltipKey((current) => (itemKey ? (current === itemKey ? null : current) : null));
  }, []);

  // Touch and click handler supporting mobile two-step tap
  const handleItemClick = useCallback((e, techName, itemKey) => {
    const isMouse = e.nativeEvent?.pointerType === 'mouse';
    const isTouchDevice =
      !isMouse &&
      (e.nativeEvent?.pointerType === 'touch' ||
        e.nativeEvent?.pointerType === 'pen' ||
        (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches));

    const details = TECH_DETAILS[techName] || { title: techName };

    if (isTouchDevice) {
      if (activeTooltipKeyRef.current === itemKey || activeTooltipKey === itemKey) {
        // Second tap on the same item -> navigate immediately
        e.preventDefault();
        handleItemNavigation(details);
        setActiveTooltipKey(null);
      } else {
        // First tap on item -> show tooltip and pause marquee
        e.preventDefault();
        e.stopPropagation();
        setActiveTooltipKey(itemKey);
      }
    } else {
      // Desktop mouse click -> navigate immediately
      handleItemNavigation(details);
      setActiveTooltipKey(null);
    }
  }, [handleItemNavigation, activeTooltipKey]);

  const isPaused = Boolean(activeTooltipKey);
  const isTopActive = activeTooltipKey?.startsWith('top-');
  const isBottomActive = activeTooltipKey?.startsWith('bottom-');

  // Dynamic ribbon z-index ensures the active tooltip ribbon always renders above the crossed ribbon
  const topZIndex = isTopActive ? 'z-30' : (isBottomActive ? 'z-10' : 'z-10');
  const bottomZIndex = isBottomActive ? 'z-30' : (isTopActive ? 'z-10' : 'z-20');

  return (
    <section
      id="tech-marquee"
      aria-label="Technology and Core Skills Marquee"
      aria-hidden="true"
      ref={bannerRef}
      className="relative py-28 sm:py-32 overflow-hidden select-none my-6 pointer-events-none"
    >
      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" aria-hidden="true" />

      {/* TOP RIBBON: Dark Charcoal #18181B at -3.5 degrees (Reel t=7.85s) */}
      <div
        className={`w-[150%] -ml-[25%] bg-[#18181B] py-3.5 sm:py-4.5 shadow-xl shadow-stone-950/25 border-y border-stone-800/80 relative overflow-visible transition-colors ${topZIndex}`}
        style={{
          transform: 'rotate(-3.5deg)',
          transformOrigin: 'center center'
        }}
      >
        <div
          className="flex w-max animate-marquee-left items-center pointer-events-auto"
          style={{ animationPlayState: isPaused ? 'paused' : undefined }}
        >
          {TOP_SEQUENCE.map((tech, idx) => {
            const isDuplicate = idx >= TOP_ITEMS.length;
            const itemKey = `top-${idx}`;
            const isTooltipOpen = activeTooltipKey === itemKey;

            return (
              <MarqueeCard
                key={itemKey}
                itemKey={itemKey}
                tech={tech}
                isBottom={false}
                isDuplicate={isDuplicate}
                isTooltipOpen={isTooltipOpen}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handleBlur={handleBlur}
                handleItemClick={handleItemClick}
                handleItemNavigation={handleItemNavigation}
                setActiveTooltipKey={setActiveTooltipKey}
              />
            );
          })}
        </div>
      </div>

      {/* BOTTOM RIBBON: Coral Pink #FF4D6D at +2.8 degrees (Crosses over top ribbon - Reel t=8.0s) */}
      <div
        className={`w-[150%] -ml-[25%] bg-[#FF4D6D] py-3.5 sm:py-4.5 shadow-2xl shadow-pink-600/35 border-y border-[#FF2B55] relative overflow-visible -mt-2 sm:-mt-3 transition-colors ${bottomZIndex}`}
        style={{
          transform: 'rotate(2.8deg)',
          transformOrigin: 'center center'
        }}
      >
        <div
          className="flex w-max animate-marquee-right items-center pointer-events-auto"
          style={{ animationPlayState: isPaused ? 'paused' : undefined }}
        >
          {BOTTOM_SEQUENCE.map((skill, idx) => {
            const isDuplicate = idx >= BOTTOM_ITEMS.length;
            const itemKey = `bottom-${idx}`;
            const isTooltipOpen = activeTooltipKey === itemKey;

            return (
              <MarqueeCard
                key={itemKey}
                itemKey={itemKey}
                tech={skill}
                isBottom={true}
                isDuplicate={isDuplicate}
                isTooltipOpen={isTooltipOpen}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handleBlur={handleBlur}
                handleItemClick={handleItemClick}
                handleItemNavigation={handleItemNavigation}
                setActiveTooltipKey={setActiveTooltipKey}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
