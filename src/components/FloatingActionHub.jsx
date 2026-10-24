import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Layers, X, Sliders, Eye, BotMessageSquare, Filter, Briefcase } from 'lucide-react';
import { useLab } from '../context/LabContext';
import { useSimpleMode } from '../context/SimpleModeContext';
import { useAudience } from '../context/AudienceContext';
import { useViewMode } from '../context/ViewModeContext';
import { useLanguage } from '../context/LanguageContext';
import { useRoleTab } from '../context/RoleContext';
import AudienceFloatingPill from './AudienceFloatingPill';
import ViewModeFloatingPill from './ViewModeFloatingPill';
import RoleFloatingPill from './RoleFloatingPill';
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
 *   2. View Mode / Simple Mode Toggle (Eye icon, switches mode)
 *   3. WhatsApp Direct Channel (Authentic WhatsApp icon, visible when contact unlocked)
 * - Highly extensible architecture for future action buttons
 * - Emits 'floating_hub_state' custom events to keep BackToTopButton perfectly synchronized
 */
export default function FloatingActionHub() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAudiencePillOpen, setIsAudiencePillOpen] = useState(false);
  const [isViewModePillOpen, setIsViewModePillOpen] = useState(false);
  const [isRolePillOpen, setIsRolePillOpen] = useState(false);
  const filterOpenTimerRef = useRef(null);
  const { isSimpleMode, toggleSimpleMode } = useSimpleMode();
  const { isHindi } = useLanguage();

  // Role Context (safe access)
  let roleContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    roleContext = useRoleTab();
  } catch {
    // safe fallback
  }
  const activeRole = roleContext?.activeRole ?? 'accountant';
  const activeRoleData = roleContext?.roleData;

  // View Mode Context (safe access)
  let viewModeContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    viewModeContext = useViewMode();
  } catch {
    // safe fallback
  }
  const { viewMode: hookViewMode } = useViewMode?.() || {};
  const viewMode = viewModeContext?.viewMode ?? hookViewMode ?? 'modern';
  const activeViewModeData = viewModeContext?.activeModeData;
  const isBasicView = viewMode === 'basic';

  // Audience Context (safe access)
  let audienceContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    audienceContext = useAudience();
  } catch {
    // safe fallback
  }
  const audience = audienceContext?.audience ?? 'all';
  const isFilterActive = audienceContext?.isFilterActive ?? (audience !== 'all');
  const activeAudienceData = audienceContext?.activeModeData;

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
  const closeDrawer = labContext?.closeDrawer;
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

  // Clean up any pending sequential open timer on unmount
  useEffect(() => {
    return () => {
      if (filterOpenTimerRef.current) {
        clearTimeout(filterOpenTimerRef.current);
      }
    };
  }, []);

  // Handle Master Toggle click
  const handleToggle = useCallback(() => {
    if (filterOpenTimerRef.current) {
      clearTimeout(filterOpenTimerRef.current);
      filterOpenTimerRef.current = null;
    }
    setIsOpen((prev) => {
      const next = !prev;
      if (!next) {
        setIsAudiencePillOpen(false);
        setIsViewModePillOpen(false);
        setIsRolePillOpen(false);
      }
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

  // Action: Toggle Audience Filter Pill (Mutually Exclusive with Control Center Drawer, View Mode & Role Filter)
  const handleToggleAudienceFilter = useCallback((e) => {
    if (e && e.stopPropagation) e.stopPropagation();

    // Clear any pending sequential transition timer
    if (filterOpenTimerRef.current) {
      clearTimeout(filterOpenTimerRef.current);
      filterOpenTimerRef.current = null;
    }

    // Audio feedback
    if (soundEnabled) {
      if (soundFX?.playFocusBeep) {
        soundFX.playFocusBeep();
      } else if (soundFX?.playHapticClick) {
        soundFX.playHapticClick();
      }
    }

    // Mutually exclusive with View Mode & Role Filter pills
    setIsViewModePillOpen(false);
    setIsRolePillOpen(false);

    // Sequential Transition: If sidebar/drawer is open, smoothly close drawer and wait ~320ms for drawer close + hub glide
    if (isDrawerOpen && closeDrawer) {
      closeDrawer();
      filterOpenTimerRef.current = setTimeout(() => {
        setIsAudiencePillOpen(true);
        filterOpenTimerRef.current = null;
      }, 320);
      return;
    }

    // When drawer is not open, toggle immediately
    setIsAudiencePillOpen((prev) => !prev);
  }, [soundEnabled, isDrawerOpen, closeDrawer]);

  // Action: Toggle View Mode Pill (Mutually Exclusive with Control Center Drawer, Audience Filter & Role Filter)
  const handleToggleViewMode = useCallback((e) => {
    if (e && e.stopPropagation) e.stopPropagation();

    if (filterOpenTimerRef.current) {
      clearTimeout(filterOpenTimerRef.current);
      filterOpenTimerRef.current = null;
    }

    if (soundEnabled) {
      if (soundFX?.playFocusBeep) {
        soundFX.playFocusBeep();
      } else if (soundFX?.playHapticClick) {
        soundFX.playHapticClick();
      }
    }

    // Mutually exclusive with Audience Filter & Role Filter pills
    setIsAudiencePillOpen(false);
    setIsRolePillOpen(false);

    if (isDrawerOpen && closeDrawer) {
      closeDrawer();
      filterOpenTimerRef.current = setTimeout(() => {
        setIsViewModePillOpen(true);
        filterOpenTimerRef.current = null;
      }, 320);
      return;
    }

    setIsViewModePillOpen((prev) => !prev);
  }, [soundEnabled, isDrawerOpen, closeDrawer]);

  // Action: Toggle Job Role Filter Pill (Mutually Exclusive with Control Center Drawer, Audience Filter & View Mode)
  const handleToggleRoleFilter = useCallback((e) => {
    if (e && e.stopPropagation) e.stopPropagation();

    if (filterOpenTimerRef.current) {
      clearTimeout(filterOpenTimerRef.current);
      filterOpenTimerRef.current = null;
    }

    if (soundEnabled) {
      if (soundFX?.playFocusBeep) {
        soundFX.playFocusBeep();
      } else if (soundFX?.playHapticClick) {
        soundFX.playHapticClick();
      }
    }

    setIsAudiencePillOpen(false);
    setIsViewModePillOpen(false);

    if (isDrawerOpen && closeDrawer) {
      closeDrawer();
      filterOpenTimerRef.current = setTimeout(() => {
        setIsRolePillOpen(true);
        filterOpenTimerRef.current = null;
      }, 320);
      return;
    }

    setIsRolePillOpen((prev) => !prev);
  }, [soundEnabled, isDrawerOpen, closeDrawer]);

  // Action: Open/Toggle Lab Studio Control Center (Mutually Exclusive with Audience Filter & View Mode, Hub remains open)
  const handleOpenLabStudio = useCallback(() => {
    if (filterOpenTimerRef.current) {
      clearTimeout(filterOpenTimerRef.current);
      filterOpenTimerRef.current = null;
    }
    if (soundEnabled && soundFX?.playFocusBeep) {
      soundFX.playFocusBeep();
    }
    // Mutually exclusive: Close Audience Filter & View Mode flyouts if open
    setIsAudiencePillOpen(false);
    setIsViewModePillOpen(false);

    if (toggleDrawer) {
      toggleDrawer();
    } else if (openDrawer) {
      openDrawer();
    }
    // Keep FloatingActionHub speed-dial open so Filter and other buttons remain visible and clickable!
  }, [soundEnabled, toggleDrawer, openDrawer]);

  // Action: Toggle Simple Mode
  const handleToggleSimpleMode = useCallback(() => {
    if (soundEnabled && soundFX?.playFocusBeep) {
      soundFX.playFocusBeep();
    }
    toggleSimpleMode();
  }, [soundEnabled, toggleSimpleMode]);

  // Action: Open AI Chat Assistant
  const handleOpenAIChat = useCallback(() => {
    if (soundEnabled) {
      if (soundFX?.playSparkle) {
        soundFX.playSparkle();
      } else if (soundFX?.playFocusBeep) {
        soundFX.playFocusBeep();
      }
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('portfolio:open-ai-chat'));
    }
  }, [soundEnabled]);

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

    // Item 1: AI Chat Assistant FAB (Directly above Master Show/Hide button)
    items.push({
      id: 'ai-chat',
      label: 'AI Chat (असिस्टेंट)',
      ariaLabel: 'AI Chat Assistant - Portfolio Copilot Preview (असिस्टेंट)',
      icon: (
        <BotMessageSquare className="w-5 h-5 text-purple-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
      ),
      onClick: handleOpenAIChat,
      badge: (
        <span aria-hidden="true" className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#FF4D6D]" />
          <span className="relative inline-flex rounded-full h-3 w-3 border-2 border-white dark:border-[#120D1D] bg-purple-500" />
        </span>
      ),
      buttonClass: 'bg-linear-to-tr from-[#FF4D6D]/40 via-[#9333EA]/60 to-[#6366F1]/50 border border-purple-300/40 dark:border-purple-400/50 text-white shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.7),inset_0_-3.5px_6px_0_rgba(0,0,0,0.4),0_6px_16px_-1px_rgba(147,51,234,0.45),0_3px_6px_rgba(0,0,0,0.25)] hover:-translate-y-1 hover:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.85),inset_0_-3.5px_6px_0_rgba(0,0,0,0.4),0_10px_24px_-1px_rgba(168,85,247,0.6)] active:translate-y-0.5 active:scale-95'
    });

    // Item 2: WhatsApp Direct Channel (Visible when unlocked, directly above AI Chat)
    if (isWhatsAppUnlocked) {
      items.push({
        id: 'whatsapp-direct',
        label: 'Chat on WhatsApp (+91 7992383804)',
        ariaLabel: 'Chat directly on WhatsApp with Atul Verma (+91 7992383804) - Direct Channel Active',
        isLink: true,
        href: whatsAppLink,
        icon: (
          <svg
            className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-current drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] group-hover:scale-110 transition-transform duration-300"
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
        buttonClass: 'bg-linear-to-tr from-[#128C7E] to-[#25D366] text-white border border-emerald-300/40 dark:border-emerald-200/50 shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.7),inset_0_-3.5px_6px_0_rgba(0,0,0,0.4),0_6px_16px_-1px_rgba(37,211,102,0.45),0_3px_6px_rgba(0,0,0,0.25)] hover:-translate-y-1 hover:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.85),inset_0_-3.5px_6px_0_rgba(0,0,0,0.4),0_10px_24px_-1px_rgba(37,211,102,0.6)] active:translate-y-0.5 active:scale-95'
      });
    }

    // Item 3: Lab Studio / Control Center (Hidden in Simple Mode, directly above WhatsApp)
    if (!isSimpleMode) {
      items.push({
        id: 'lab-studio',
        label: 'Control Center (Audio, Cursors, Hero)',
        ariaLabel: isDrawerOpen ? 'Close Control Center Drawer' : 'Open Control Center Drawer',
        icon: (
          <Sliders className={`w-5 h-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] transition-transform duration-300 ${
            isDrawerOpen ? 'rotate-90 scale-110 text-white' : 'text-[#FF4D6D] group-hover:rotate-12'
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
        buttonClass: isDrawerOpen
          ? 'bg-linear-to-tr from-[#FF4D6D] to-[#FF758F] text-white border border-white/50 shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.7),inset_0_-3.5px_6px_0_rgba(0,0,0,0.4),0_8px_20px_-1px_rgba(255,77,109,0.5),0_3px_6px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.85),inset_0_-3.5px_6px_0_rgba(0,0,0,0.4),0_12px_28px_-1px_rgba(255,77,109,0.65)] active:translate-y-0.5 active:scale-95'
          : 'bg-linear-to-tr from-[#161122]/95 via-[#231A35]/95 to-[#382650]/95 border border-[#FF4D6D]/40 text-[#FF4D6D] shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.6),inset_0_-3.5px_6px_0_rgba(0,0,0,0.5),0_6px_16px_-1px_rgba(255,77,109,0.3),0_3px_6px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:border-[#FF4D6D] hover:text-white hover:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.75),inset_0_-3.5px_6px_0_rgba(0,0,0,0.5),0_10px_24px_-1px_rgba(255,77,109,0.5)] active:translate-y-0.5 active:scale-95'
      });
    }

    // Item 4: Audience Filter (All / Recruiter / Client / Marriage) - Hidden in Basic View
    if (!isBasicView) {
      items.push({
        id: 'audience-filter',
        label: `Audience View: ${activeAudienceData?.label || 'All'}`,
        ariaLabel: `Audience Filter Mode: currently ${activeAudienceData?.label || 'All'}. Click to choose All, Recruiter, Client, or Marriage.`,
        icon: (
          <Filter className={`w-5 h-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] group-hover:scale-110 transition-transform duration-300 ${
            isFilterActive ? 'text-white' : 'text-[#FF4D6D]'
          }`} />
        ),
        onClick: handleToggleAudienceFilter,
        active: isFilterActive,
        badge: isFilterActive ? (
          <span aria-hidden="true" className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#FF4D6D]" />
            <span className="relative inline-flex rounded-full h-3 w-3 border-2 border-white dark:border-[#120D1D] bg-[#FF4D6D]" />
          </span>
        ) : null,
        buttonClass: isFilterActive
        ? 'bg-linear-to-tr from-[#FF4D6D] to-[#FF758F] text-white border border-white/40 shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.7),inset_0_-3px_5px_0_rgba(0,0,0,0.35),0_6px_18px_-1px_rgba(255,77,109,0.5),0_3px_6px_rgba(0,0,0,0.25)] hover:-translate-y-1 hover:shadow-[0_10px_24px_-1px_rgba(255,77,109,0.65)] active:translate-y-0.5 active:scale-95'
          : isAudiencePillOpen
          ? 'bg-linear-to-tr from-[#FAF8F5]/95 to-[#EDE8E1]/95 dark:from-[#161122]/95 dark:to-[#251A38]/95 border border-[#FF4D6D] ring-2 ring-[#FF4D6D]/40 text-[#FF4D6D] shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.6),inset_0_-3px_5px_0_rgba(0,0,0,0.35),0_6px_16px_-1px_rgba(255,77,109,0.35)] hover:-translate-y-1 active:translate-y-0.5 active:scale-95'
          : 'bg-linear-to-tr from-[#FAF8F5]/95 to-[#EDE8E1]/95 dark:from-[#161122]/95 dark:to-[#221832]/95 border border-[#E7E2D8] dark:border-[#2D2340] text-stone-700 dark:text-stone-200 hover:text-[#18181B] dark:hover:text-white hover:border-[#FF4D6D]/60 shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.6),inset_0_-3px_5px_0_rgba(0,0,0,0.35),0_5px_14px_-1px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.45),inset_0_-3px_5px_0_rgba(0,0,0,0.5),0_6px_16px_-1px_rgba(0,0,0,0.5)] hover:-translate-y-1 hover:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.7),inset_0_-3px_5px_0_rgba(0,0,0,0.35),0_8px_20px_-1px_rgba(0,0,0,0.2)] dark:hover:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.55),inset_0_-3px_5px_0_rgba(0,0,0,0.5),0_8px_20px_-1px_rgba(255,77,109,0.3)] active:translate-y-0.5 active:scale-95',
        pill: isAudiencePillOpen ? (
          <AudienceFloatingPill
            isOpen={isAudiencePillOpen}
            onClose={() => setIsAudiencePillOpen(false)}
            soundEnabled={soundEnabled}
            isDrawerOpen={isDrawerOpen}
          />
        ) : null
      });
    }

    // Item 4.5: Job Role Floating Button (Directly below Audience Type)
    const isRoleActive = activeRole && activeRole !== 'overview';
    items.push({
      id: 'job-role-filter',
      triggerId: 'job-role-trigger',
      dataAttribute: 'data-job-role-trigger',
      label: `${isHindi ? 'जॉब रोल' : 'Job Role'}: ${activeRoleData?.label || 'Accountant'}`,
      ariaLabel: isHindi ? 'जॉब रोल बदलें' : 'Change Job Role',
      icon: <Briefcase className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform duration-300" />,
      onClick: handleToggleRoleFilter,
      active: isRolePillOpen,
      pill: isRolePillOpen ? (
        <RoleFloatingPill
          isOpen={isRolePillOpen}
          onClose={() => setIsRolePillOpen(false)}
          soundEnabled={soundEnabled}
          isDrawerOpen={isDrawerOpen}
        />
      ) : null,
      buttonClass: isRolePillOpen
        ? 'bg-linear-to-tr from-[#FAF8F5]/95 to-[#EDE8E1]/95 dark:from-[#161122]/95 dark:to-[#251A38]/95 border border-emerald-500 ring-2 ring-emerald-500/40 text-emerald-500 shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.6),inset_0_-3px_5px_0_rgba(0,0,0,0.35),0_6px_16px_-1px_rgba(16,185,129,0.35)] hover:-translate-y-1 active:translate-y-0.5 active:scale-95'
        : 'bg-linear-to-tr from-[#FAF8F5]/95 to-[#EDE8E1]/95 dark:from-[#161122]/95 dark:to-[#221832]/95 border border-[#E7E2D8] dark:border-[#2D2340] text-stone-700 dark:text-stone-200 hover:text-[#18181B] dark:hover:text-white hover:border-emerald-500/60 shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.6),inset_0_-3px_5px_0_rgba(0,0,0,0.35),0_5px_14px_-1px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.45),inset_0_-3px_5px_0_rgba(0,0,0,0.5),0_6px_16px_-1px_rgba(0,0,0,0.5)] hover:-translate-y-1 hover:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.7),inset_0_-3px_5px_0_rgba(0,0,0,0.35),0_8px_20px_-1px_rgba(0,0,0,0.2)] dark:hover:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.55),inset_0_-3px_5px_0_rgba(0,0,0,0.5),0_8px_20px_-1px_rgba(16,185,129,0.3)] active:translate-y-0.5 active:scale-95'
    });

    // Item 5: View Mode (Basic / Simple / Modern / Terminal)
    const isViewModeActive = viewMode !== 'modern';
    items.push({
      id: 'view-mode',
      label: `View Mode: ${activeViewModeData?.label || 'Modern'}`,
      ariaLabel: `View Mode: currently ${activeViewModeData?.label || 'Modern'}. Click to choose Basic, Simple, Modern, or Terminal.`,
      icon: (
        <Eye className={`w-5 h-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] group-hover:scale-110 transition-transform duration-300 ${
          isViewModeActive ? 'text-white' : 'text-[#FF4D6D]'
        }`} />
      ),
      onClick: handleToggleViewMode,
      active: isViewModeActive,
      badge: isViewModeActive ? (
        <span aria-hidden="true" className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#FF4D6D]" />
          <span className="relative inline-flex rounded-full h-3 w-3 border-2 border-white dark:border-[#120D1D] bg-[#FF4D6D]" />
        </span>
      ) : null,
      buttonClass: isViewModeActive
        ? 'bg-linear-to-tr from-[#FF4D6D] to-[#FF758F] text-white border border-white/40 shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.7),inset_0_-3px_5px_0_rgba(0,0,0,0.35),0_6px_18px_-1px_rgba(255,77,109,0.5),0_3px_6px_rgba(0,0,0,0.25)] hover:-translate-y-1 hover:shadow-[0_10px_24px_-1px_rgba(255,77,109,0.65)] active:translate-y-0.5 active:scale-95'
        : isViewModePillOpen
        ? 'bg-linear-to-tr from-[#FAF8F5]/95 to-[#EDE8E1]/95 dark:from-[#161122]/95 dark:to-[#251A38]/95 border border-[#FF4D6D] ring-2 ring-[#FF4D6D]/40 text-[#FF4D6D] shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.6),inset_0_-3px_5px_0_rgba(0,0,0,0.35),0_6px_16px_-1px_rgba(255,77,109,0.35)] hover:-translate-y-1 active:translate-y-0.5 active:scale-95'
        : 'bg-linear-to-tr from-[#FAF8F5]/95 to-[#EDE8E1]/95 dark:from-[#161122]/95 dark:to-[#221832]/95 border border-[#E7E2D8] dark:border-[#2D2340] text-stone-700 dark:text-stone-200 hover:text-[#18181B] dark:hover:text-white hover:border-[#FF4D6D]/60 shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.6),inset_0_-3px_5px_0_rgba(0,0,0,0.35),0_5px_14px_-1px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.45),inset_0_-3px_5px_0_rgba(0,0,0,0.5),0_6px_16px_-1px_rgba(0,0,0,0.5)] hover:-translate-y-1 hover:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.7),inset_0_-3px_5px_0_rgba(0,0,0,0.35),0_8px_20px_-1px_rgba(0,0,0,0.2)] dark:hover:shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.55),inset_0_-3px_5px_0_rgba(0,0,0,0.5),0_8px_20px_-1px_rgba(255,77,109,0.3)] active:translate-y-0.5 active:scale-95',
      pill: isViewModePillOpen ? (
        <ViewModeFloatingPill
          isOpen={isViewModePillOpen}
          onClose={() => setIsViewModePillOpen(false)}
          soundEnabled={soundEnabled}
          isDrawerOpen={isDrawerOpen}
        />
      ) : null
    });

    return items;
  }, [
    handleOpenAIChat,
    isSimpleMode,
    isDrawerOpen,
    handleOpenLabStudio,
    isBasicView,
    activeAudienceData,
    handleToggleAudienceFilter,
    isAudiencePillOpen,
    isFilterActive,
    activeRole,
    activeRoleData,
    handleToggleRoleFilter,
    isRolePillOpen,
    isHindi,
    viewMode,
    activeViewModeData,
    handleToggleViewMode,
    isViewModePillOpen,
    soundEnabled,
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

  // Elevated above chat box (z-[45]) with z-[60] (satisfies z-[50] minimum overlay specification)
  return (
    <div
      className={`fixed bottom-6 sm:bottom-8 z-[60] select-none flex flex-col-reverse items-center gap-3 transition-all duration-300 ease-out ${
        isDrawerOpen ? 'sm:right-[460px] right-6' : 'right-6 sm:right-8'
      }`}
      role="region"
      aria-label="Floating Action Hub"
      data-floating-action-hub="true"
    >
      {/* 1. Master Toggle FAB */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isOpen ? 'सभी बटन छुपाएं (Hide All Buttons)' : 'सभी बटन दिखाएं (Show All Buttons)'}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={isOpen ? 'सभी बटन छुपाएं (Hide All Buttons)' : 'सभी बटन दिखाएं (Show All Buttons)'}
        className={`group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full transition-all duration-300 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#FF4D6D] border backdrop-blur-md hover:-translate-y-1 active:translate-y-0.5 active:scale-95 ${
          isOpen
            ? 'bg-linear-to-tr from-[#FF4D6D] to-[#FF758F] text-white border-[#FF4D6D] shadow-[inset_0_2.5px_4px_0_rgba(255,255,255,0.75),inset_0_-4px_8px_0_rgba(0,0,0,0.4),0_8px_20px_-2px_rgba(255,77,109,0.5),0_4px_8px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_2.5px_4px_0_rgba(255,255,255,0.85),inset_0_-4px_8px_0_rgba(0,0,0,0.4),0_12px_28px_-2px_rgba(255,77,109,0.65),0_6px_10px_rgba(0,0,0,0.35)]'
            : 'bg-linear-to-tr from-[#120D1D]/95 via-[#1E1229]/95 to-[#2E1838]/95 dark:from-[#120D1D]/95 dark:via-[#1E1229]/95 dark:to-[#2E1838]/95 text-[#FF4D6D] border-[#FF4D6D]/50 hover:border-[#FF4D6D] shadow-[inset_0_2.5px_4px_0_rgba(255,255,255,0.75),inset_0_-4px_8px_0_rgba(0,0,0,0.4),0_8px_20px_-2px_rgba(255,77,109,0.35),0_4px_8px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_2.5px_4px_0_rgba(255,255,255,0.85),inset_0_-4px_8px_0_rgba(0,0,0,0.4),0_12px_28px_-2px_rgba(255,77,109,0.55),0_6px_10px_rgba(0,0,0,0.35)]'
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
          className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl bg-stone-900/95 dark:bg-stone-950/95 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 hidden sm:block border border-stone-700/60 z-[70]"
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
          const isAudienceTrigger = item.id === 'audience-filter';
          const isViewModeTrigger = item.id === 'view-mode';
          const isJobRoleTrigger = item.id === 'job-role-filter';

          const commonProps = {
            id: isAudienceTrigger
              ? 'audience-filter-trigger'
              : isViewModeTrigger
              ? 'view-mode-trigger'
              : isJobRoleTrigger
              ? 'job-role-trigger'
              : undefined,
            'data-audience-filter-trigger': isAudienceTrigger ? 'true' : undefined,
            'data-view-mode-trigger': isViewModeTrigger ? 'true' : undefined,
            'data-job-role-trigger': isJobRoleTrigger ? 'true' : undefined,
            role: 'menuitem',
            tabIndex: isOpen ? 0 : -1,
            'aria-label': item.ariaLabel || item.label,
            title: item.pill ? undefined : item.label,
            style: { transitionDelay },
            className: `group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full backdrop-blur-md transition-all duration-300 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#FF4D6D] ${item.buttonClass}`
          };

          const innerContent = (
            <>
              {item.badge}
              {item.icon}
              {/* Speed-dial Accessible Tooltip (hidden when flyout pill is active) */}
              {!item.pill && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl bg-stone-900/95 dark:bg-stone-950/95 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 hidden sm:block border border-stone-700/60 z-[70]"
                >
                  {item.label}
                </span>
              )}
            </>
          );

          return (
            <div key={item.id} className="relative flex items-center justify-center">
              {item.pill}
              {item.isLink ? (
                <a
                  {...commonProps}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={item.onClick}
                >
                  {innerContent}
                </a>
              ) : (
                <button
                  {...commonProps}
                  type="button"
                  onClick={item.onClick}
                >
                  {innerContent}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
