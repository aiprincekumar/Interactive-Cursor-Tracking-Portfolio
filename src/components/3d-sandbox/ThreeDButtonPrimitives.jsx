/* oxlint-disable react/only-export-components */
import React from 'react';
import { Check } from 'lucide-react';
import { use3DMicroTilt } from '../../hooks/use3DMicroTilt';

/**
 * ThreeDPresetCard
 * Self-explanatory tactile 3D preset button card with live 3D visual preview slot,
 * hardware-accelerated micro-tilt, and authentic physical press depth.
 */
export function ThreeDPresetCard({
  isSelected = false,
  onClick,
  title,
  desc,
  badge,
  icon: Icon,
  visualPreview,
  className = '',
  ariaLabel,
  disabled = false,
  children
}) {
  const {
    tiltStyle,
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
    isHovered,
    isPressed
  } = use3DMicroTilt({
    maxTilt: 8,
    scaleOnHover: 1.02,
    disabled
  });

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={isSelected}
      aria-label={ariaLabel || title}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={tiltStyle}
      className={`group relative p-3 sm:p-3.5 rounded-2xl text-left flex flex-col justify-between transition-all duration-150 select-none cursor-pointer outline-none ${
        disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
      } ${
        isSelected
          ? 'bg-gradient-to-b from-[#FF4D6D]/15 to-[#FF4D6D]/5 dark:from-[#FF4D6D]/25 dark:to-[#FF4D6D]/10 border-2 border-[#FF4D6D] text-[#18181B] dark:text-white ring-2 ring-[#FF4D6D]/30 shadow-[0_4px_0_0_#D93856,0_10px_20px_rgba(255,77,109,0.25)]'
          : 'bg-gradient-to-b from-white/90 to-stone-50/80 dark:from-[#211833]/90 dark:to-[#171124]/90 border border-[#E7E2D8] dark:border-[#2D2340] text-stone-700 dark:text-stone-300 shadow-[0_4px_0_0_#D1CBC1,0_8px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_0_0_#140D20,0_10px_20px_rgba(0,0,0,0.5)] hover:border-[#FF4D6D]/40'
      } ${
        isPressed
          ? 'translate-y-1 shadow-[0_1px_0_0_#D1CBC1,0_2px_4px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_0_0_#140D20,0_2px_4px_rgba(0,0,0,0.4)]'
          : ''
      } focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 ${className}`}
    >
      {/* Top Header Row: Icon, Title & Status */}
      <div className="flex items-center justify-between w-full mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {Icon && (
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-transform ${
                isSelected
                  ? 'bg-[#FF4D6D] text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 group-hover:scale-110'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="text-xs font-bold truncate tracking-tight">{title}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {badge && (
            <span
              className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-md border leading-none ${
                isSelected
                  ? 'bg-[#FF4D6D]/20 text-[#FF4D6D] border-[#FF4D6D]/40'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700'
              }`}
            >
              {badge}
            </span>
          )}
          {isSelected && (
            <div className="w-4 h-4 rounded-full bg-[#FF4D6D] text-white flex items-center justify-center shadow-xs">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          )}
        </div>
      </div>

      {/* 3D Self-Explanatory Visual Preview Center Stage */}
      {visualPreview && (
        <div className="my-2 py-2 flex items-center justify-center bg-stone-100/50 dark:bg-[#150F22]/60 rounded-xl border border-stone-200/50 dark:border-stone-800/60 overflow-hidden relative threed-preserve">
          {visualPreview}
        </div>
      )}

      {/* Supplementary children slot */}
      {children}

      {/* Bottom Description */}
      {desc && (
        <p className="text-[10.5px] text-stone-500 dark:text-stone-400 leading-snug line-clamp-2 mt-1">
          {desc}
        </p>
      )}

      {/* 3D Specular Glare Layer */}
      <div
        className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        } bg-gradient-to-tr from-transparent via-white/5 to-white/15 dark:via-white/3 dark:to-white/10`}
      />
    </div>
  );
}

/**
 * ThreeDActionKeycap
 * Authentically beveled tactile 3D keycap button for action triggers.
 */
export function ThreeDActionKeycap({
  onClick,
  icon: Icon,
  label,
  variant = 'default', // 'default' | 'primary' | 'emerald' | 'amber'
  active = false,
  className = '',
  title,
  ariaLabel,
  disabled = false
}) {
  const variantStyles = {
    default: active
      ? 'bg-stone-200 dark:bg-stone-700 text-[#18181B] dark:text-white border-stone-300 dark:border-stone-600 shadow-[0_3px_0_0_#B8B2A6] dark:shadow-[0_3px_0_0_#140D20]'
      : 'bg-white hover:bg-stone-50 dark:bg-[#201831] dark:hover:bg-[#261E39] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 shadow-[0_3px_0_0_#D1CBC1] dark:shadow-[0_3px_0_0_#110A1C]',
    primary:
      'bg-gradient-to-b from-[#FF4D6D] to-[#E63956] text-white border-[#D93856] shadow-[0_3px_0_0_#B3243F,0_6px_12px_rgba(255,77,109,0.3)] hover:brightness-105',
    emerald: active
      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 shadow-[0_3px_0_0_#059669,0_6px_12px_rgba(16,185,129,0.25)]'
      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 shadow-[0_3px_0_0_#10B981]'
  };

  return (
    <button
      type="button"
      title={title || label}
      aria-label={ariaLabel || label}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-100 cursor-pointer select-none active:translate-y-[2px] active:shadow-[0_1px_0_0_rgba(0,0,0,0.2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${variantStyles[variant] || variantStyles.default} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {label && <span>{label}</span>}
    </button>
  );
}

/**
 * ThreeDToggleKey
 * 3D Rocker keycap switch with physical bevel.
 */
export function ThreeDToggleKey({
  checked = false,
  onChange,
  label,
  sublabel,
  icon: Icon,
  className = '',
  disabled = false
}) {
  return (
    <div
      role="switch"
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : () => onChange?.(!checked)}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onChange?.(!checked);
        }
      }}
      className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-between gap-3 transition-all duration-150 cursor-pointer select-none outline-none ${
        disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
      } ${
        checked
          ? 'bg-gradient-to-b from-[#FF4D6D]/15 to-[#FF4D6D]/5 border-[#FF4D6D]/50 shadow-[0_3px_0_0_#D93856]'
          : 'bg-white/60 dark:bg-[#1E162F]/60 border-stone-200/80 dark:border-stone-800 shadow-[0_3px_0_0_#D1CBC1] dark:shadow-[0_3px_0_0_#140D20]'
      } active:translate-y-[2px] active:shadow-[0_1px_0_0_rgba(0,0,0,0.15)] focus-visible:ring-2 focus-visible:ring-[#FF4D6D] ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && (
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              checked
                ? 'bg-[#FF4D6D] text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-400'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
        <div className="min-w-0">
          <div className="text-xs font-bold truncate text-[#18181B] dark:text-white">
            {label}
          </div>
          {sublabel && (
            <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
              {sublabel}
            </div>
          )}
        </div>
      </div>

      <div
        className={`w-9 h-5 rounded-full transition-colors relative shrink-0 p-0.5 ${
          checked ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
        }`}
      >
        <span
          className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-150 ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </div>
    </div>
  );
}

export default ThreeDPresetCard;
