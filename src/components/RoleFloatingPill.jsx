import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { GripHorizontal, RotateCcw, Check, Briefcase, BarChart2, Terminal, LayoutDashboard, Sparkles } from 'lucide-react';
import { useRoleTab } from '../context/RoleContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { soundFX } from '../utils/audio';

export const ROLE_CARD_POS_STORAGE_KEY = 'portfolio_role_card_pos';

export const isValidCardPosition = (x, y, cardWidth = 320, cardHeight = 380) => {
  if (typeof window === 'undefined') return false;
  if (typeof x !== 'number' || typeof y !== 'number') return false;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
  const minPadding = 12;
  const maxX = window.innerWidth - cardWidth - minPadding;
  const maxY = window.innerHeight - cardHeight - minPadding;
  if (x < minPadding || x > maxX || y < minPadding || y > maxY) {
    return false;
  }
  return true;
};

export const clampCardPosition = (x, y, cardWidth = 320, cardHeight = 380) => {
  if (typeof window === 'undefined') return { x, y };
  const minPadding = 12;
  const maxX = Math.max(minPadding, window.innerWidth - cardWidth - 12);
  const maxY = Math.max(minPadding, window.innerHeight - cardHeight - 12);
  const clampedX = Math.min(Math.max(minPadding, x), maxX);
  const clampedY = Math.min(Math.max(minPadding, y), maxY);
  return { x: clampedX, y: clampedY };
};

export default function RoleFloatingPill({
  isOpen = true,
  onClose,
  soundEnabled = true,
  isDrawerOpen = false,
  className = ''
}) {
  const { activeRole, setActiveRole, allRoles } = useRoleTab();
  const { isHindi } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cardRef = useRef(null);

  const [customPos, setCustomPos] = useState(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleCardMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setSpotlightPos({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top)
    });
  }, []);

  const handleCardMouseEnter = useCallback((e) => {
    setIsHovered(true);
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setSpotlightPos({
        x: Math.round(e.clientX - rect.left),
        y: Math.round(e.clientY - rect.top)
      });
    }
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const [anchoredPos, setAnchoredPos] = useState(() => {
    if (typeof window !== 'undefined') {
      const defaultW = 320;
      const defaultH = 380;
      return {
        left: Math.max(12, window.innerWidth - defaultW - 70),
        top: Math.max(20, window.innerHeight - defaultH - 24)
      };
    }
    return { left: 0, top: 0 };
  });

  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ pointerX: 0, pointerY: 0, cardX: 0, cardY: 0, cardWidth: 320, cardHeight: 380 });
  const hasDraggedRef = useRef(false);
  const wasOpenRef = useRef(false);

  const updateAnchoredPosition = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const triggerEl =
        document.getElementById('job-role-trigger') ||
        document.querySelector('[data-job-role-trigger]');
      if (!triggerEl) return;

      const triggerRect = triggerEl.getBoundingClientRect();
      const cardEl = cardRef.current;
      const cardWidth = cardEl?.offsetWidth || 320;
      const cardHeight = cardEl?.offsetHeight || 380;
      const buttonHeight = triggerRect.height || 48;

      const targetShift = Math.max(0, cardHeight - buttonHeight);
      const minBottomSpacing = 20;
      const minTopSpacing = 20;
      const viewportHeight = window.innerHeight || 800;

      const maxShiftAllowed = Math.max(0, viewportHeight - minBottomSpacing - triggerRect.bottom);
      let safeShift = Math.min(targetShift, maxShiftAllowed);

      let cardTop = triggerRect.bottom - cardHeight + safeShift;
      if (cardTop < minTopSpacing) {
        const extraShift = minTopSpacing - cardTop;
        safeShift = Math.min(maxShiftAllowed, safeShift + extraShift);
        cardTop = triggerRect.bottom - cardHeight + safeShift;
      }
      cardTop = Math.max(minTopSpacing, Math.min(cardTop, viewportHeight - cardHeight - minBottomSpacing));

      let cardLeft = triggerRect.left - cardWidth - 14;
      cardLeft = Math.max(12, Math.min(cardLeft, window.innerWidth - cardWidth - 12));

      setAnchoredPos({
        left: Math.round(cardLeft),
        top: Math.round(cardTop)
      });
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      wasOpenRef.current = false;
      return;
    }

    if (!wasOpenRef.current) {
      wasOpenRef.current = true;
      setCustomPos(null);
      updateAnchoredPosition();

      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem(ROLE_CARD_POS_STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (!isValidCardPosition(parsed?.x, parsed?.y)) {
              localStorage.removeItem(ROLE_CARD_POS_STORAGE_KEY);
            }
          }
        } catch {
          // ignore
        }
      }
    }
  }, [isOpen, updateAnchoredPosition]);

  useEffect(() => {
    if (!isOpen || customPos) return;
    updateAnchoredPosition();

    const triggerEl =
      document.getElementById('job-role-trigger') ||
      document.querySelector('[data-job-role-trigger]');
    const hubEl = document.querySelector('[data-floating-action-hub]');

    const handleTransition = () => {
      updateAnchoredPosition();
    };

    triggerEl?.addEventListener('transitionend', handleTransition);
    triggerEl?.addEventListener('transitionrun', handleTransition);
    hubEl?.addEventListener('transitionend', handleTransition);
    hubEl?.addEventListener('transitionrun', handleTransition);

    window.addEventListener('resize', updateAnchoredPosition);
    window.addEventListener('scroll', updateAnchoredPosition, true);

    let rafId = null;
    const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const trackShift = (now) => {
      updateAnchoredPosition();
      const current = now || (typeof performance !== 'undefined' ? performance.now() : Date.now());
      if (current - startTime < 450) {
        rafId = requestAnimationFrame(trackShift);
      }
    };
    rafId = requestAnimationFrame(trackShift);

    const timer1 = setTimeout(updateAnchoredPosition, 100);
    const timer2 = setTimeout(updateAnchoredPosition, 320);
    const timer3 = setTimeout(updateAnchoredPosition, 400);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      triggerEl?.removeEventListener('transitionend', handleTransition);
      triggerEl?.removeEventListener('transitionrun', handleTransition);
      hubEl?.removeEventListener('transitionend', handleTransition);
      hubEl?.removeEventListener('transitionrun', handleTransition);
      window.removeEventListener('resize', updateAnchoredPosition);
      window.removeEventListener('scroll', updateAnchoredPosition, true);
    };
  }, [isOpen, customPos, isDrawerOpen, updateAnchoredPosition]);

  useEffect(() => {
    if (!isOpen || !customPos) return;

    const handleResize = () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setCustomPos((prevPos) => {
          if (!prevPos) return null;
          const clamped = clampCardPosition(prevPos.x, prevPos.y, rect.width, rect.height);
          if (clamped.x !== prevPos.x || clamped.y !== prevPos.y) {
            try {
              localStorage.setItem(ROLE_CARD_POS_STORAGE_KEY, JSON.stringify(clamped));
            } catch {
              // ignore
            }
            return clamped;
          }
          return prevPos;
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, customPos !== null]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (hasDraggedRef.current || isDraggingRef.current) return;
      if (e.target?.closest) {
        if (
          e.target.closest('#job-role-trigger') ||
          e.target.closest('[data-job-role-trigger]') ||
          e.target.closest('[data-floating-action-hub]')
        ) {
          return;
        }
      }
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        if (onClose) onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (soundEnabled && soundFX?.playTap) soundFX.playTap();
        if (onClose) onClose();
      }
    };

    const timerId = setTimeout(() => {
      document.addEventListener('pointerdown', handleClickOutside, true);
    }, 150);

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timerId);
      document.removeEventListener('pointerdown', handleClickOutside, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, soundEnabled]);

  const handleResetPosition = useCallback((e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (soundEnabled) {
      if (soundFX?.playTap) {
        soundFX.playTap();
      } else if (soundFX?.playHapticClick) {
        soundFX.playHapticClick();
      }
    }
    setCustomPos(null);
    try {
      localStorage.removeItem(ROLE_CARD_POS_STORAGE_KEY);
    } catch {
      // ignore
    }
    updateAnchoredPosition();
  }, [soundEnabled, updateAnchoredPosition]);

  const handlePointerDown = (e) => {
    if (e.target.closest('button')) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    e.preventDefault();
    if (!cardRef.current) return;

    const cardEl = cardRef.current;
    const dragHandle = e.currentTarget;
    const pointerId = e.pointerId;

    window.getSelection()?.removeAllRanges();
    if (typeof document !== 'undefined') {
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
    }

    if (dragHandle?.setPointerCapture && pointerId !== undefined) {
      try {
        dragHandle.setPointerCapture(pointerId);
      } catch {
        // ignore
      }
    }

    const rect = cardEl.getBoundingClientRect();
    const currentX = customPos ? customPos.x : rect.left;
    const currentY = customPos ? customPos.y : rect.top;
    const cardW = rect.width || 320;
    const cardH = rect.height || 380;

    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      cardX: currentX,
      cardY: currentY,
      cardWidth: cardW,
      cardHeight: cardH
    };

    let latestClamped = { x: currentX, y: currentY };

    const onPointerMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      moveEvent.preventDefault();

      const deltaX = moveEvent.clientX - dragStartRef.current.pointerX;
      const deltaY = moveEvent.clientY - dragStartRef.current.pointerY;

      if (!hasDraggedRef.current) {
        if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
          hasDraggedRef.current = true;
          setIsDragging(true);
        } else {
          return;
        }
      }

      const rawX = dragStartRef.current.cardX + deltaX;
      const rawY = dragStartRef.current.cardY + deltaY;

      latestClamped = clampCardPosition(
        rawX,
        rawY,
        dragStartRef.current.cardWidth,
        dragStartRef.current.cardHeight
      );

      if (cardEl) {
        cardEl.style.left = `${latestClamped.x}px`;
        cardEl.style.top = `${latestClamped.y}px`;
      }

      setCustomPos(latestClamped);
    };

    const onPointerUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);

      if (typeof document !== 'undefined') {
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
      }

      if (dragHandle?.releasePointerCapture && pointerId !== undefined) {
        try {
          dragHandle.releasePointerCapture(pointerId);
        } catch {
          // ignore
        }
      }

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      if (hasDraggedRef.current) {
        if (soundEnabled && soundFX?.playHapticClick) {
          soundFX.playHapticClick();
        }
        try {
          localStorage.setItem(ROLE_CARD_POS_STORAGE_KEY, JSON.stringify(latestClamped));
        } catch {
          // ignore
        }
        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 150);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  const handleSelect = (roleId, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (soundEnabled && soundFX?.playFocusBeep) {
      soundFX.playFocusBeep();
    }
    setActiveRole(roleId);
    if (onClose) onClose();
  };

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const isCustomDragged = customPos !== null;
  const activeLeft = isCustomDragged ? customPos.x : anchoredPos.left;
  const activeTop = isCustomDragged ? customPos.y : anchoredPos.top;

  const inlineStyle = {
    position: 'fixed',
    zIndex: 70,
    left: `${activeLeft}px`,
    top: `${activeTop}px`,
    touchAction: 'none',
    width: '320px',
    maxWidth: 'calc(100vw - 24px)'
  };

  const renderRoleIcon = (iconName, accent) => {
    const iconProps = { className: "w-4 h-4 shrink-0", style: { color: accent || 'currentColor' } };
    switch (iconName) {
      case 'Briefcase': return <Briefcase {...iconProps} />;
      case 'BarChart2': return <BarChart2 {...iconProps} />;
      case 'Terminal': return <Terminal {...iconProps} />;
      case 'LayoutDashboard': return <LayoutDashboard {...iconProps} />;
      case 'Sparkles': return <Sparkles {...iconProps} />;
      default: return <Briefcase {...iconProps} />;
    }
  };

  const rolesList = allRoles || [];

  return createPortal(
    <div
      ref={cardRef}
      style={inlineStyle}
      onMouseMove={handleCardMouseMove}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
      className={`rounded-2xl border shadow-2xl backdrop-blur-xl overflow-hidden transition-[box-shadow,transform] duration-200 ${
        isDark
          ? 'bg-[#140F22]/95 border-emerald-500/30 text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_25px_rgba(16,185,129,0.15)]'
          : 'bg-white/95 border-emerald-500/30 text-stone-800 shadow-[0_20px_50px_rgba(0,0,0,0.18),0_0_25px_rgba(16,185,129,0.12)]'
      } ${isDragging ? 'cursor-grabbing scale-[1.01] shadow-[0_25px_60px_rgba(0,0,0,0.3)]' : ''} ${className}`}
      role="dialog"
      aria-modal="true"
      aria-label={isHindi ? 'जॉब रोल ट्रैक चुनें' : 'Select Job Role Track'}
    >
      {/* Spotlight highlight overlay */}
      {isHovered && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 rounded-2xl"
          style={{
            background: `radial-gradient(280px circle at ${spotlightPos.x}px ${spotlightPos.y}px, ${
              isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.06)'
            }, transparent 80%)`
          }}
        />
      )}

      {/* Header / Drag Handle */}
      <div
        onPointerDown={handlePointerDown}
        onDoubleClick={handleResetPosition}
        title={isHindi ? 'रीसेट स्थिति (डबल-क्लिक)' : 'Reset Position (Double-Click)'}
        className={`relative z-10 flex items-center justify-between px-4 py-3 border-b select-none cursor-grab active:cursor-grabbing ${
          isDark
            ? 'bg-stone-900/60 border-stone-800 text-stone-200'
            : 'bg-stone-50/80 border-stone-200/80 text-stone-700'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
            <Briefcase className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold tracking-wider uppercase truncate">
              {isHindi ? 'जॉब रोल ट्रैक चुनें' : 'Select Job Role Track'}
            </h3>
            <p className="text-[10px] opacity-70 truncate">
              {isHindi ? 'पसंदीदा प्रोफेशनल ट्रैक स्विच करें' : 'Switch professional track'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleResetPosition}
            aria-label={isHindi ? 'डिफ़ॉल्ट स्थिति पर रीसेट करें' : 'Reset position'}
            title={isHindi ? 'रीसेट स्थिति' : 'Reset position'}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'hover:bg-stone-800 text-stone-400 hover:text-stone-200'
                : 'hover:bg-stone-200/80 text-stone-500 hover:text-stone-800'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div
            aria-hidden="true"
            className={`p-1 rounded-md ${isDark ? 'text-stone-600' : 'text-stone-400'}`}
          >
            <GripHorizontal className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Roles List */}
      <div className="relative z-10 max-h-[360px] overflow-y-auto p-2.5 space-y-2 custom-scrollbar">
        {rolesList.map((role) => {
          const isActive = activeRole === role.id;
          const roleLabel = isHindi ? (role.label_hi || role.label) : role.label;
          const roleBadge = isHindi ? (role.badge_hi || role.badge) : role.badge;
          const roleDesc = isHindi ? (role.description_hi || role.description) : role.description;

          return (
            <button
              key={role.id}
              type="button"
              onClick={(e) => handleSelect(role.id, e)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-200 cursor-pointer border relative group flex flex-col gap-1.5 ${
                isActive
                  ? isDark
                    ? 'bg-emerald-500/15 border-emerald-500/60 shadow-[0_4px_12px_rgba(16,185,129,0.25)]'
                    : 'bg-emerald-50 border-emerald-500/50 shadow-[0_4px_12px_rgba(16,185,129,0.15)]'
                  : isDark
                  ? 'bg-stone-900/40 border-stone-800/80 hover:bg-stone-900/80 hover:border-emerald-500/30'
                  : 'bg-stone-50/60 border-stone-200/70 hover:bg-white hover:border-emerald-500/30 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="p-1.5 rounded-lg shrink-0"
                    style={{ backgroundColor: `${role.accent || '#10B981'}15` }}
                  >
                    {renderRoleIcon(role.icon, role.accent)}
                  </div>
                  <span className="text-xs font-bold truncate">
                    {roleLabel}
                  </span>
                </div>
                {isActive ? (
                  <div className="p-1 rounded-full bg-emerald-500 text-white shrink-0 shadow-xs">
                    <Check className="w-3 h-3" />
                  </div>
                ) : (
                  <div className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                    isDark ? 'bg-stone-800 text-stone-400' : 'bg-stone-200/70 text-stone-600'
                  }`}>
                    {roleBadge}
                  </div>
                )}
              </div>

              {roleDesc && (
                <p className={`text-[11px] line-clamp-2 leading-relaxed ${
                  isDark ? 'text-stone-400' : 'text-stone-600'
                }`}>
                  {roleDesc}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>,
    document.body
  );
}
