import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Layers, X, Sliders, Eye, Sparkles } from 'lucide-react';
import { useLab } from '../context/LabContext';
import { useSimpleMode } from '../context/SimpleModeContext';
import { soundFX } from '../utils/audio';

const UNLOCK_STORAGE_KEY = 'portfolio_contact_unlocked';

/**
 * FloatingActionHub
 * 
 * Centralized Master Floating Action Hub (Speed-Dial FAB Architecture)
 * 
 * Unifies all floating page actions into a single elegant, expandable hub:
 * - Master Toggle FAB (Layers <-> X with rotation & sound effects)
 * - Strict explicit toggle only: does NOT close on outside clicks or page scrolling
 * - Speed-dial child items expanding vertically upwards with smooth stagger/fade:
 *   1. Lab Studio / Control Center (Sliders icon, hidden in Simple Mode)
 *   2. Simple Mode Toggle (Eye / Sparkles icon, switches mode)
 *   3. WhatsApp Direct Channel (Authentic WhatsApp icon, visible when contact unlocked)
 * - Highly extensible architecture for future action buttons
 * - Emits 'floating_hub_state' custom events to keep BackToTopButton perfectly synchronized
 */
export default function FloatingActionHub() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSimpleMode, toggleSimpleMode } = useSimpleMode();

  // Lab Context (safe access)
  let labContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    labContext = useLab();
  } catch {
    // safe fallback
  }

  const isDrawerOpen = labContext?.isDrawerOpen ?? false;
  const toggleDrawer = labContext?.toggleDrawer;
  const openDrawer = labContext?.openDrawer;
  const soundEnabled = labContext?.soundEnabled ?? true;

  // WhatsApp unlocked contact state
  const [unlockedData, setUnlockedData] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(UNLOCK_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.unlocked && parsed?.expiry && Date.now() < parsed.expiry) {
          return parsed;
        }
        localStorage.removeItem(UNLOCK_STORAGE_KEY);
      }
    } catch {
      // Ignored
    }
    return null;
  });

  const isWhatsAppUnlocked = Boolean(unlockedData?.unlocked);

  // Sync WhatsApp unlock state with events and storage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkStorage = () => {
      try {
        const stored = localStorage.getItem(UNLOCK_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.unlocked && parsed?.expiry && Date.now() < parsed.expiry) {
            setUnlockedData(parsed);
            return;
          }
          localStorage.removeItem(UNLOCK_STORAGE_KEY);
        }
      } catch {
        // Ignored
      }
      setUnlockedData(null);
    };

    const handleUnlockedEvent = (e) => {
      if (e?.detail?.userData) {
        setUnlockedData({
          unlocked: true,
          userData: e.detail.userData
        });
      } else {
        checkStorage();
      }
    };

    const handleLockedEvent = () => setUnlockedData(null);

    window.addEventListener('storage', checkStorage);
    window.addEventListener('contact_channel_unlocked', handleUnlockedEvent);
    window.addEventListener('contact_channel_locked', handleLockedEvent);

    return () => {
      window.removeEventListener('storage', checkStorage);
      window.removeEventListener('contact_channel_unlocked', handleUnlockedEvent);
      window.removeEventListener('contact_channel_locked', handleLockedEvent);
    };
  }, []);

  // Handle Master Toggle click
  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (soundEnabled) {
        if (soundFX?.playTap) {
          soundFX.playTap();
        } else if (soundFX?.playHapticClick) {
          soundFX.playHapticClick();
        }
      }
      return next;
    });
  }, [soundEnabled]);

  // Action: Open Lab Studio Control Center
  const handleOpenLabStudio = useCallback(() => {
    if (soundEnabled && soundFX?.playFocusBeep) {
      soundFX.playFocusBeep();
    }
    if (toggleDrawer) {
      toggleDrawer();
    } else if (openDrawer) {
      openDrawer();
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open_lab_studio'));
      window.dispatchEvent(new CustomEvent('toggle_lab_studio'));
    }
  }, [soundEnabled, toggleDrawer, openDrawer]);

  // Action: Toggle Simple Mode
  const handleToggleSimpleMode = useCallback(() => {
    if (soundEnabled && soundFX?.playFocusBeep) {
      soundFX.playFocusBeep();
    }
    toggleSimpleMode();
  }, [soundEnabled, toggleSimpleMode]);

  // Action: WhatsApp click
  const handleWhatsAppClick = useCallback(() => {
    if (soundEnabled) {
      if (soundFX?.playSparkle) {
        soundFX.playSparkle();
      } else if (soundFX?.playFocusBeep) {
        soundFX.playFocusBeep();
      }
    }
  }, [soundEnabled]);

  // Formulate WhatsApp Link
  const userData = unlockedData?.userData;
  const whatsAppInquiryText = userData
    ? `Hello Atul ji, I just submitted an inquiry for "${userData.role || 'Consultation'}".\nName: ${userData.name}\nWhatsApp: ${userData.whatsapp}\nInquiry: ${userData.message || 'Direct channel connection'}`
    : `Hello Atul ji, I visited your portfolio and would like to connect directly on WhatsApp regarding consultation/projects.`;
  const whatsAppLink = `https://wa.me/917992383804?text=${encodeURIComponent(whatsAppInquiryText)}`;

  // Extensible Speed-Dial Child Items Definition
  const hubItems = useMemo(() => {
    const items = [];

    // Item 1: Lab Studio / Control Center (Hidden in Simple Mode)
    if (!isSimpleMode) {
      items.push({
        id: 'lab-studio',
        label: 'Control Center (Audio, Cursors, Hero)',
        ariaLabel: isDrawerOpen ? 'Close Control Center Drawer' : 'Open Control Center Drawer',
        icon: (
          <Sliders className={`w-5 h-5 text-[#FF4D6D] transition-transform duration-300 ${
            isDrawerOpen ? 'rotate-90 scale-110 text-white' : 'group-hover:rotate-12'
          }`} />
        ),
        onClick: handleOpenLabStudio,
        active: isDrawerOpen,
        badge: (
          <span aria-hidden="true" className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#FF4D6D]" />
            <span className="relative inline-flex rounded-full h-3 w-3 border-2 border-white dark:border-[#120D1D] bg-[#FF4D6D]" />
          </span>
        ),
        buttonClass: 'bg-[#18181B]/95 dark:bg-[#120D1D]/95 border-[#FF4D6D]/40 text-[#FF4D6D] hover:border-[#FF4D6D] hover:text-white hover:bg-[#FF4D6D]/20 shadow-lg shadow-[#FF4D6D]/15'
      });
    }

    // Item 2: Simple Mode Toggle (Always available)
    items.push({
      id: 'simple-mode-toggle',
      label: isSimpleMode ? 'Exit Simple Mode (Interactive 🚀)' : 'Simple Mode (Clean 👁️)',
      ariaLabel: isSimpleMode ? 'Exit Simple Mode (Switch to Full Interactive View)' : 'Enable Simple Mode (Clean & Fast View)',
      icon: isSimpleMode ? (
        <Sparkles className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
      ) : (
        <Eye className="w-5 h-5 text-[#FF4D6D] group-hover:scale-110 transition-transform duration-300" />
      ),
      onClick: handleToggleSimpleMode,
      active: isSimpleMode,
      badge: isSimpleMode ? (
        <span aria-hidden="true" className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#FF4D6D]" />
          <span className="relative inline-flex rounded-full h-3 w-3 border-2 border-white dark:border-[#120D1D] bg-emerald-400" />
        </span>
      ) : null,
      buttonClass: isSimpleMode
        ? 'bg-linear-to-tr from-[#FF4D6D] to-[#FF758F] text-white border-[#FF4D6D] shadow-lg shadow-[#FF4D6D]/30'
        : 'bg-[#FAF8F5]/95 dark:bg-[#161122]/95 border-[#E7E2D8] dark:border-[#2D2340] text-stone-700 dark:text-stone-200 hover:text-[#18181B] dark:hover:text-white hover:border-[#FF4D6D]/60 shadow-lg shadow-black/10 dark:shadow-purple-950/30'
    });

    // Item 3: WhatsApp Direct Channel (Visible when unlocked)
    if (isWhatsAppUnlocked) {
      items.push({
        id: 'whatsapp-direct',
        label: 'Chat on WhatsApp (+91 7992383804)',
        ariaLabel: 'Chat directly on WhatsApp with Atul Verma (+91 7992383804) - Direct Channel Active',
        isLink: true,
        href: whatsAppLink,
        icon: (
          <svg
            className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-current group-hover:scale-110 transition-transform duration-300"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        ),
        onClick: handleWhatsAppClick,
        badge: (
          <span aria-hidden="true" className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#25D366]" />
            <span className="relative inline-flex rounded-full h-3 w-3 border-2 border-white dark:border-[#120D1D] bg-[#25D366]" />
          </span>
        ),
        buttonClass: 'bg-linear-to-tr from-[#25D366] to-[#128C7E] text-white border-[#25D366] shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/50'
      });
    }

    return items;
  }, [
    isSimpleMode,
    isDrawerOpen,
    handleOpenLabStudio,
    handleToggleSimpleMode,
    isWhatsAppUnlocked,
    whatsAppLink,
    handleWhatsAppClick
  ]);

  // Synchronize Hub state with BackToTopButton via window CustomEvent
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(
      new CustomEvent('floating_hub_state', {
        detail: {
          isOpen,
          itemCount: hubItems.length
        }
      })
    );
  }, [isOpen, hubItems.length]);

  return (
    <div
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 select-none flex flex-col-reverse items-center gap-3"
      role="region"
      aria-label="Floating Action Hub"
    >
      {/* 1. Master Toggle FAB */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isOpen ? 'सभी बटन छुपाएं (Hide All Buttons)' : 'सभी बटन दिखाएं (Show All Buttons)'}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={isOpen ? 'सभी बटन छुपाएं (Hide All Buttons)' : 'सभी बटन दिखाएं (Show All Buttons)'}
        className={`group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full transition-all duration-300 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#FF4D6D] active:scale-95 hover:scale-105 border ${
          isOpen
            ? 'bg-linear-to-tr from-[#FF4D6D] to-[#FF758F] text-white border-[#FF4D6D] shadow-2xl shadow-[#FF4D6D]/40'
            : 'bg-[#18181B]/95 dark:bg-[#120D1D]/95 text-[#FF4D6D] border-[#FF4D6D]/40 shadow-2xl shadow-[#FF4D6D]/25 hover:border-[#FF4D6D]'
        }`}
      >
        {/* Subtle Pulse Beacon indicator when collapsed to signal interactivity */}
        {!isOpen && (
          <span aria-hidden="true" className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#FF4D6D]" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-white dark:border-[#120D1D] bg-[#FF4D6D]" />
          </span>
        )}

        {/* Dynamic Icon Transition: Layers (closed) <-> X (open) with isolated rotation */}
        <span
          className={`inline-flex items-center justify-center transition-transform duration-300 ${
            isOpen ? 'rotate-90' : 'rotate-0'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-300 text-white" aria-hidden="true" />
          ) : (
            <Layers
              className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12"
              aria-hidden="true"
            />
          )}
        </span>

        {/* Accessible Floating Tooltip (strictly horizontal to the left in both collapsed & expanded states) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl bg-stone-900/95 dark:bg-stone-950/95 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 hidden sm:block border border-stone-700/60 z-50"
        >
          {isOpen ? 'सभी बटन छुपाएं (Hide All Buttons)' : 'सभी बटन दिखाएं (Show All Buttons)'}
        </span>
      </button>

      {/* 2. Speed-Dial Child Items (Stack vertically upwards above Master FAB) */}
      <div
        className={`flex flex-col-reverse items-center gap-3 transition-all duration-300 ease-out ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        role="menu"
        aria-orientation="vertical"
        aria-hidden={!isOpen}
      >
        {hubItems.map((item, index) => {
          // Stagger animation timing for fluid visual hierarchy
          const transitionDelay = isOpen ? `${index * 45}ms` : '0ms';

          const commonProps = {
            key: item.id,
            role: 'menuitem',
            tabIndex: isOpen ? 0 : -1,
            'aria-label': item.ariaLabel || item.label,
            title: item.label,
            style: { transitionDelay },
            className: `group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border backdrop-blur-md transition-all duration-200 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#FF4D6D] active:scale-95 hover:scale-105 ${item.buttonClass}`
          };

          const innerContent = (
            <>
              {item.badge}
              {item.icon}
              {/* Speed-dial Accessible Tooltip */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl bg-stone-900/95 dark:bg-stone-950/95 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 hidden sm:block border border-stone-700/60 z-50"
              >
                {item.label}
              </span>
            </>
          );

          if (item.isLink) {
            return (
              <a
                {...commonProps}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={item.onClick}
              >
                {innerContent}
              </a>
            );
          }

          return (
            <button
              {...commonProps}
              type="button"
              onClick={item.onClick}
            >
              {innerContent}
            </button>
          );
        })}
      </div>
    </div>
  );
}
