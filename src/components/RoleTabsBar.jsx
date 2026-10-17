/* oxlint-disable react/only-export-components */
import React, { useRef } from 'react';
import { Briefcase, BarChart2, Sparkles, X } from 'lucide-react';
import { useRoleTab, ROLE_TRACKS } from '../context/RoleContext';
import { soundFX } from '../utils/audio';

export { ROLE_TRACKS };

/**
 * Dynamically resolves icon component for a given track or role ID.
 * Supports 'accountant' (Briefcase), 'mis' (BarChart2), 'other' (Sparkles),
 * custom track.icon, and fallback (Sparkles or Layers).
 */
export function getRoleIcon(trackOrId) {
  if (trackOrId && typeof trackOrId === 'object') {
    if (trackOrId.icon && typeof trackOrId.icon !== 'string') return trackOrId.icon;
    trackOrId = trackOrId.id;
  }
  const id = String(trackOrId || '').toLowerCase();
  switch (id) {
    case 'accountant':
      return Briefcase;
    case 'mis':
      return BarChart2;
    case 'other':
      return Sparkles;
    default:
      return Sparkles;
  }
}

export default function RoleTabsBar({
  activeRole: propActiveRole,
  onSelectRole: propOnSelectRole,
  soundEnabled = true,
  sectionId = 'global',
  className = '',
  variant = 'section', // 'section' | 'navbar' | 'mobile-header' | 'drawer' | 'floating-bar' | 'sub-bar'
  isOpen = false,
  onToggle,
  onClose
}) {
  let context = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    context = useRoleTab();
  } catch {
    // Graceful fallback if mounted outside RoleProvider in tests
  }

  const activeRole = propActiveRole ?? context?.activeRole ?? 'accountant';
  const roleList = context?.ROLE_TRACKS || ROLE_TRACKS;

  const selectRole = (roleId) => {
    if (propOnSelectRole) {
      propOnSelectRole(roleId);
    } else if (context?.selectRole) {
      context.selectRole(roleId);
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('switch-role-tab', { detail: { role: roleId } }));
    }
  };

  const tabButtonRefs = useRef({});

  const handleTabClick = (roleId) => {
    if (soundEnabled) soundFX.playFocusBeep();
    if (roleId !== activeRole) {
      selectRole(roleId);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && onClose) {
      e.preventDefault();
      onClose();
      return;
    }
    const currentIndex = roleList.findIndex((t) => t.id === activeRole);
    let nextIndex = -1;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % roleList.length;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + roleList.length) % roleList.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = roleList.length - 1;
    }

    if (nextIndex !== -1) {
      const nextRole = roleList[nextIndex].id;
      handleTabClick(nextRole);
      requestAnimationFrame(() => {
        tabButtonRefs.current[nextRole]?.focus();
      });
    }
  };

  // ----------------------------------------------------
  // VARIANT 1: Mobile Drawer Single Compact Row
  // ----------------------------------------------------
  if (variant === 'drawer') {
    return (
      <div className={`w-full bg-white dark:bg-stone-800 rounded-2xl border border-[#E7E2D8] dark:border-stone-700 p-2.5 shadow-2xs ${className}`}>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Career Track
          </span>
          <span className="text-[10px] font-mono font-bold text-[#FF4D6D] bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 px-2 py-0.5 rounded-full border border-[#FFD1DC] dark:border-[#FF4D6D]/30">
            Instant Sync
          </span>
        </div>

        <div
          role="tablist"
          aria-label="Mobile drawer career track selection"
          aria-orientation="horizontal"
          onKeyDown={handleKeyDown}
          className="flex items-center gap-1.5 select-none overflow-x-auto no-scrollbar scroll-smooth px-0.5"
        >
          {roleList.map((track) => {
            const isActive = activeRole === track.id;
            const Icon = getRoleIcon(track);
            const accent = track.accent || (track.id === 'mis' ? '#3B82F6' : '#FF4D6D');

            return (
              <button
                key={track.id}
                ref={(el) => { tabButtonRefs.current[track.id] = el; }}
                type="button"
                role="tab"
                id={`drawer-tab-${track.id}`}
                aria-selected={isActive}
                aria-controls={`drawer-panel-${track.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleTabClick(track.id)}
                className={`flex-1 shrink-0 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold font-mono transition-all duration-200 cursor-pointer whitespace-nowrap select-none ${
                  isActive
                    ? 'bg-[#FAF8F5] dark:bg-stone-900 border-[#FF4D6D] text-[#18181B] dark:text-white shadow-xs ring-1 ring-[#FF4D6D]/20'
                    : 'bg-white dark:bg-stone-800/80 border-[#E7E2D8] dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 text-stone-600 dark:text-stone-300 hover:text-[#18181B] dark:hover:text-white'
                }`}
                title={`Switch career track to ${track.label}`}
              >
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                    isActive ? '' : 'text-stone-400 dark:text-stone-500'
                  }`}
                  style={{ color: isActive ? accent : undefined }}
                />
                <span className="whitespace-nowrap">{track.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VARIANT 2 & 3: Single-Icon Trigger ('navbar' | 'mobile-header')
  // ----------------------------------------------------
  if (variant === 'navbar' || variant === 'mobile-header') {
    const isAccountant = activeRole === 'accountant';
    const activeTrack = roleList.find((t) => t.id === activeRole) || roleList[0];
    const Icon = getRoleIcon(activeTrack);
    const accentColor = activeTrack?.accent || (isAccountant ? '#FF4D6D' : '#3B82F6');
    const roleLabel = activeTrack?.label || (isAccountant ? 'Accountant & Tax' : 'MIS & Analytics');
    const trackBadge = activeTrack?.badge || '';

    const handleClick = () => {
      if (onToggle) {
        onToggle();
      } else {
        const currentIndex = roleList.findIndex((t) => t.id === activeRole);
        const nextIndex = (currentIndex + 1) % roleList.length;
        const nextRole = roleList[nextIndex]?.id || 'accountant';
        handleTabClick(nextRole);
      }
    };

    return (
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => {
          if (soundEnabled) soundFX.playChipHover();
        }}
        aria-label={isOpen ? 'Close Career Track Switcher' : `Career Track: ${roleLabel}${trackBadge ? ` (${trackBadge})` : ''}`}
        aria-expanded={Boolean(isOpen)}
        aria-haspopup="dialog"
        title={`Active Career Track: ${roleLabel} - Click to switch`}
        className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden ${
          isOpen
            ? 'bg-[#18181B] dark:bg-stone-100 text-white dark:text-stone-900 border-[#18181B] dark:border-white shadow-xs scale-105'
            : 'bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 hover:text-[#18181B] dark:hover:text-white border-[#E7E2D8] dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 shadow-2xs hover:scale-105 active:scale-95'
        } ${className}`}
      >
        <Icon
          className="w-4 h-4 transition-transform duration-200"
          style={{ color: isOpen ? (document.documentElement.classList.contains('dark') ? '#18181B' : '#FFFFFF') : accentColor }}
        />
        {/* Dynamic Indicator Dot */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 pointer-events-none">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: accentColor }}
          />
          <span
            className="relative inline-flex rounded-full h-2 w-2 ring-2 ring-white dark:ring-stone-900"
            style={{ backgroundColor: accentColor }}
          />
        </span>
      </button>
    );
  }

  // ----------------------------------------------------
  // VARIANT: Floating Secondary Horizontal Sub-Bar ('floating-bar' | 'sub-bar')
  // ----------------------------------------------------
  if (variant === 'floating-bar' || variant === 'sub-bar') {
    return (
      <div
        className={`mt-2 max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-4 py-1.5 sm:py-2 bg-[#FAF8F5]/95 dark:bg-[#161122]/95 backdrop-blur-md rounded-full border border-[#E7E2D8] dark:border-[#2D2340] shadow-md animate-in fade-in slide-in-from-top-2 duration-200 gap-2 sm:gap-4 select-none ${className}`}
        role="region"
        aria-label="Career Track Switcher Bar"
      >
        {/* Left Side Label / Badge */}
        <div className="hidden sm:flex items-center gap-1.5 pl-1 shrink-0">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Career Track
          </span>
          <span className="text-[10px] font-mono font-bold text-[#FF4D6D] bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 px-2 py-0.5 rounded-full border border-[#FFD1DC] dark:border-[#FF4D6D]/30">
            Live Sync
          </span>
        </div>

        {/* Center: Single Compact Row of Role Buttons */}
        <div
          role="tablist"
          aria-label="Portfolio Career Track Selection"
          aria-orientation="horizontal"
          onKeyDown={handleKeyDown}
          className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-start sm:justify-center overflow-x-auto no-scrollbar scroll-smooth px-1 sm:px-2"
        >
          {roleList.map((track) => {
            const isActive = activeRole === track.id;
            const Icon = getRoleIcon(track);
            const accent = track.accent || (track.id === 'mis' ? '#3B82F6' : '#FF4D6D');

            return (
              <button
                key={track.id}
                ref={(el) => { tabButtonRefs.current[track.id] = el; }}
                type="button"
                role="tab"
                id={`floating-role-tab-${track.id}`}
                aria-selected={isActive}
                aria-controls={`floating-role-panel-${track.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => {
                  handleTabClick(track.id);
                  if (onClose) onClose();
                }}
                onMouseEnter={() => {
                  if (soundEnabled) soundFX.playChipHover();
                }}
                className={`group relative flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer select-none shrink-0 whitespace-nowrap text-xs font-bold font-mono ${
                  isActive
                    ? 'bg-white dark:bg-stone-800 border-[#18181B] dark:border-white text-[#18181B] dark:text-white shadow-xs ring-1 ring-[#18181B]/10 dark:ring-white/20 scale-[1.02]'
                    : 'bg-white/60 dark:bg-stone-800/60 hover:bg-white dark:hover:bg-stone-800 border-[#E7E2D8] dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 text-stone-600 dark:text-stone-300 hover:text-[#18181B] dark:hover:text-white'
                }`}
                title={`Switch portfolio to ${track.label}`}
              >
                <div
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                    isActive
                      ? 'bg-[#18181B] dark:bg-stone-700 text-white shadow-2xs'
                      : 'bg-[#F0EBE1] dark:bg-stone-900 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  <Icon
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                    style={{ color: isActive ? accent : undefined }}
                  />
                </div>

                <span className="tracking-tight whitespace-nowrap">
                  {track.label}
                </span>

                {isActive && (
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0 ml-0.5 animate-pulse"
                    style={{ backgroundColor: accent }}
                  />
                )}
              </button>
            );
          })}
          {/* Spacer to guarantee the last role button has clearance before the sticky/fixed close button on mobile */}
          <div className="w-2 shrink-0 sm:hidden" aria-hidden="true" />
        </div>

        {/* Right Close Button [×] */}
        <div className="flex items-center shrink-0 pl-1 pr-1 border-l border-stone-200/50 dark:border-stone-700 sm:border-transparent">
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
            }}
            onMouseEnter={() => {
              if (soundEnabled) soundFX.playChipHover();
            }}
            aria-label="Close Career Track Selection Bar"
            title="Close (Esc)"
            className="w-7 h-7 rounded-full flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-[#18181B] dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-800 border border-transparent hover:border-stone-300 dark:hover:border-stone-600 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VARIANT 4: Section-Level Horizontal Tabs Bar (Default)
  // ----------------------------------------------------
  return (
    <div
      role="tablist"
      aria-label={`${sectionId} career track selection`}
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
      className={`inline-flex items-center p-1 sm:p-1.5 bg-[#FAF8F5] dark:bg-stone-900 rounded-2xl border border-[#ECE7DF] dark:border-stone-800 gap-1 sm:gap-1.5 shadow-2xs select-none max-w-full overflow-x-auto no-scrollbar ${className}`}
    >
      {roleList.map((track) => {
        const isActive = activeRole === track.id;
        const Icon = getRoleIcon(track);
        const accent = track.accent || (track.id === 'mis' ? '#3B82F6' : '#FF4D6D');

        return (
          <button
            key={track.id}
            ref={(el) => { tabButtonRefs.current[track.id] = el; }}
            role="tab"
            id={`${sectionId}-role-tab-${track.id}`}
            aria-selected={isActive}
            aria-controls={`${sectionId}-role-panel-${track.id}`}
            tabIndex={isActive ? 0 : -1}
            type="button"
            onClick={() => handleTabClick(track.id)}
            onMouseEnter={() => {
              if (soundEnabled) soundFX.playChipHover();
            }}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-1 whitespace-nowrap ${
              isActive
                ? 'bg-white dark:bg-stone-800 text-[#18181B] dark:text-white shadow-sm border border-[#E7E2D8] dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-300 hover:text-[#18181B] dark:hover:text-white hover:bg-white/60 dark:hover:bg-stone-800/50'
            }`}
            title={`Select ${track.label}`}
          >
            <Icon
              className={`w-3.5 sm:w-4 h-3.5 sm:h-4 shrink-0 transition-colors ${
                isActive ? '' : 'text-stone-400 dark:text-stone-500'
              }`}
              style={{ color: isActive ? accent : undefined }}
            />
            <span>{track.label}</span>
          </button>
        );
      })}
    </div>
  );
}
