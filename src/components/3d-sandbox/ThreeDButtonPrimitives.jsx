/* oxlint-disable react/only-export-components */
import React from 'react';
import { Check } from 'lucide-react';
import { use3DMicroTilt } from '../../hooks/use3DMicroTilt';

/**
 * ThreeDPresetCard
 * Self-explanatory tactile 3D preset button card with live 3D visual preview slot,
 * hardware-accelerated micro-tilt, and authentic physical press depth.
 * - 3D Mode (isVisualOnly = true): Pure 3D visual preview stage, zero-text, exactly as in CHG-115.
 * - 2D Mode (isVisualOnly = false): Text with prominent Icon, Title, Badge, Description, and Status,
 *   sharing the exact same bounding box and height to guarantee 0px layout shift.
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
  isVisualOnly = true,
  lightingAngle = 45,
  depthIntensity = 1.0,
  bevelExtrusion = 3,
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

  const tooltipText = desc ? `${title}: ${desc}` : title;
  const extrusionPx = Math.max(3, Math.min(8, Math.round(4 * depthIntensity + (bevelExtrusion * 0.4))));

  // Dynamic tactile keycap styles responding live to Lighting Angle & Depth
  const keycapStyle = isVisualOnly
    ? {
        ...tiltStyle,
        boxShadow: isSelected
          ? `0 0 24px rgba(255,77,109,0.5), 0 ${extrusionPx}px 0 0 #D93856, 0 ${extrusionPx + 8}px 20px rgba(255,77,109,0.3)`
          : `0 ${extrusionPx}px 0 0 #C9C2B6, 0 ${extrusionPx + 6}px 18px rgba(0,0,0,0.07)`,
        background: isSelected
          ? `linear-gradient(${lightingAngle}deg, rgba(255,77,109,0.22) 0%, rgba(255,77,109,0.06) 100%)`
          : undefined
      }
    : tiltStyle;

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={isSelected}
      aria-label={ariaLabel || tooltipText}
      title={tooltipText}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={keycapStyle}
      className={`group relative min-h-[115px] sm:min-h-[128px] h-[115px] sm:h-[128px] w-full max-h-[115px] sm:max-h-[128px] overflow-hidden ${
        isVisualOnly
          ? 'p-2 flex items-center justify-center'
          : 'p-3 sm:p-3.5 flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2'
      } rounded-2xl text-left transition-all duration-150 select-none cursor-pointer outline-none threed-preserve ${
        disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
      } ${
        isSelected
          ? isVisualOnly
            ? 'border-2 border-[#FF4D6D] ring-2 ring-[#FF4D6D]/40 shadow-[0_0_24px_rgba(255,77,109,0.45)] text-[#18181B] dark:text-white'
            : 'bg-gradient-to-b from-[#FF4D6D]/15 to-[#FF4D6D]/5 dark:from-[#FF4D6D]/25 dark:to-[#FF4D6D]/10 border-2 border-[#FF4D6D] text-[#18181B] dark:text-white ring-1 ring-[#FF4D6D]/30 shadow-[0_2.5px_0_0_#D93856,0_8px_16px_rgba(255,77,109,0.2)]'
          : isVisualOnly
            ? 'bg-gradient-to-b from-white/95 to-stone-50/85 dark:from-[#211833]/90 dark:to-[#171124]/90 border border-[#E7E2D8] dark:border-[#2D2340] text-stone-700 dark:text-stone-300 hover:border-[#FF4D6D]/40'
            : 'bg-gradient-to-b from-white to-stone-50/90 dark:from-[#211833] dark:to-[#171124] border border-[#E7E2D8] dark:border-[#2D2340] text-stone-700 dark:text-stone-300 shadow-[0_2.5px_0_0_#D1CBC1] dark:shadow-[0_2.5px_0_0_#140D20] hover:border-[#FF4D6D]/50 hover:bg-white dark:hover:bg-[#281F38]'
      } ${
        isPressed
          ? 'translate-y-[1.5px]'
          : 'active:translate-y-[1.5px]'
      } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#181226] ${className}`}
    >
      {/* 2D Mode: High-Craft Tactile Button with Centered Icon Box, Bold Title, Badge & Active Check */}
      {!isVisualOnly && (
        <>
          {/* Top-Right Active Indicator Check */}
          {isSelected && (
            <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#FF4D6D] text-white flex items-center justify-center shadow-xs">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          )}

          {/* Prominent Centered Icon Box */}
          {Icon && (
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-150 ${
                isSelected
                  ? 'bg-[#FF4D6D] text-white shadow-[0_0_12px_rgba(255,77,109,0.45)] scale-105'
                  : 'bg-stone-100 dark:bg-[#281F38] text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700/80 group-hover:scale-105 group-hover:bg-white dark:group-hover:bg-[#322746]'
              }`}
            >
              <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
          )}

          {/* Title and Badge/Sublabel */}
          <div className="flex flex-col items-center justify-center min-w-0 max-w-full px-1">
            <span className={`text-xs sm:text-[13px] font-bold tracking-tight truncate max-w-full transition-colors ${
              isSelected ? 'text-[#FF4D6D] dark:text-white' : 'text-stone-800 dark:text-stone-100 group-hover:text-stone-900 dark:group-hover:text-white'
            }`}>
              {title}
            </span>

            {badge ? (
              <span
                className={`mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md border leading-none transition-colors ${
                  isSelected
                    ? 'bg-[#FF4D6D]/15 text-[#FF4D6D] border-[#FF4D6D]/30'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                }`}
              >
                {badge}
              </span>
            ) : (!isVisualOnly && desc && (
              <span className="mt-0.5 text-[9.5px] sm:text-[10px] text-stone-400 dark:text-stone-400 truncate max-w-full font-medium">
                {desc}
              </span>
            ))}
          </div>
        </>
      )}

      {/* 3D Visual Center Stage:
          In 3D Mode (isVisualOnly): Fills the stage with tactile physical preview (pure 3D visual preview, no text overlay).
          In 2D Mode: Replaced with 2D Icon + Title + Description layout with exact matching bounding box. */}
      {visualPreview && (
        isVisualOnly ? (
          <div className="w-full h-full flex items-center justify-center overflow-hidden relative threed-preserve pointer-events-none select-none">
            {visualPreview}
          </div>
        ) : null
      )}

      {/* Accessible Tooltip Indicator Pill for Visual Mode (visible on hover / focus) */}
      {isVisualOnly && (
        <div className="absolute bottom-2 inset-x-2 flex justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 pointer-events-none z-20">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#181226]/90 text-white backdrop-blur-md border border-white/20 shadow-md truncate max-w-[90%]">
            {title}
          </span>
        </div>
      )}

      {/* Supplementary children slot */}
      {children}

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
 * - 3D Mode (isVisualOnly = true): Pure 3D Keycap Icon, zero-text, exactly as in CHG-115.
 * - 2D Mode (isVisualOnly = false): Text with Icon, sharing identical height (h-8 sm:h-8.5).
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
  disabled = false,
  isVisualOnly = false
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
      className={`inline-flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 h-11 sm:h-8.5 ${
        isVisualOnly
          ? 'w-11 sm:w-8.5 p-0 rounded-xl'
          : 'px-3.5 sm:px-3 py-2 sm:py-1.5 rounded-xl text-xs font-semibold'
      } border transition-all duration-100 cursor-pointer select-none active:translate-y-[1.5px] active:shadow-[0_1px_0_0_rgba(0,0,0,0.2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#181226] ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${variantStyles[variant] || variantStyles.default} ${className}`}
    >
      {Icon && <Icon className={isVisualOnly ? 'w-5 h-5 sm:w-4.5 sm:h-4.5 shrink-0' : 'w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0'} />}
      {!isVisualOnly && label && <span>{label}</span>}
    </button>
  );
}

/**
 * ThreeDToggleKey
 * Tactile 3D selectable button card with physical bevel and active vibrant status pill.
 * - 3D Mode (isVisualOnly = true): Pure 3D Keycap Icon, zero-text, exactly as in CHG-115.
 * - 2D Mode (isVisualOnly = false): Text with Icon, sharing identical height (h-[58px] sm:h-[62px]).
 */
export function ThreeDToggleKey({
  checked = false,
  onChange,
  label,
  sublabel,
  icon: Icon,
  className = '',
  disabled = false,
  isVisualOnly = true
}) {
  const tooltipText = sublabel ? `${label}: ${sublabel}` : label;

  return (
    <button
      type="button"
      role="button"
      aria-pressed={checked}
      aria-label={tooltipText}
      title={tooltipText}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : () => onChange?.(!checked)}
      className={`p-2.5 sm:p-3 min-h-[58px] sm:min-h-[62px] h-[58px] sm:h-[62px] w-full rounded-xl border text-left flex items-center justify-between gap-3 transition-all duration-150 cursor-pointer select-none outline-none ${
        disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
      } ${
        checked
          ? 'bg-white dark:bg-[#201833] border-2 border-[#FF4D6D] shadow-[0_2.5px_0_0_#D93856,0_0_16px_rgba(255,77,109,0.2)] text-stone-900 dark:text-white'
          : 'bg-white hover:bg-stone-50/90 dark:bg-[#1E1730] dark:hover:bg-[#261E3B] border border-stone-200/90 dark:border-stone-700/80 shadow-[0_2.5px_0_0_#D1CBC1] dark:shadow-[0_2.5px_0_0_#140D20] text-stone-700 dark:text-stone-300'
      } active:translate-y-[1.5px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#181226] ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && (
          <div
            className={`${
              isVisualOnly ? 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl ring-1 ring-black/5 dark:ring-white/10' : 'w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-lg'
            } flex items-center justify-center shrink-0 transition-transform ${
              checked
                ? 'bg-[#FF4D6D] text-white shadow-[0_0_12px_rgba(255,77,109,0.45)]'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200/70 dark:border-stone-700/70'
            }`}
          >
            <Icon className={isVisualOnly ? 'w-5 h-5' : 'w-4 h-4'} />
          </div>
        )}
        {!isVisualOnly && (
          <div className="min-w-0">
            <div className={`text-xs font-bold truncate ${checked ? 'text-[#FF4D6D] dark:text-white' : 'text-stone-800 dark:text-stone-100'}`}>
              {label}
            </div>
            {sublabel && (
              <div className="text-[10px] truncate text-stone-400 dark:text-stone-400 font-medium">
                {sublabel}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {checked ? (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF4D6D]/15 text-[#FF4D6D] border border-[#FF4D6D]/30 tracking-wide">
            {isVisualOnly ? '3D' : 'Active'}
          </span>
        ) : (
          <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700/60 rounded-full px-2 py-0.5 uppercase tracking-wider">
            {isVisualOnly ? '2D' : 'Off'}
          </span>
        )}
      </div>
    </button>
  );
}

export default ThreeDPresetCard;
