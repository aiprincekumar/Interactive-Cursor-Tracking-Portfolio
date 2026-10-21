import React, { useState, useRef, useEffect } from 'react';
import { 
  Mail, 
  MapPin, 
  Check, 
  Info,
  Send, 
  ArrowUpRight, 
  ArrowRight,
  Copy, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Navigation,
  Sparkles,
  Lock,
  MessageCircle,
  Building2,
  Clock,
  Briefcase,
  DollarSign,
  AlertCircle,
  Loader2,
  Phone,
  Layers,
  ShieldCheck,
  Zap,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  GithubIcon,
  LinkedinIcon,
  NotionIcon,
  InstagramIcon,
  YoutubeIcon,
  TwitterIcon,
  FacebookIcon
} from './Icons';
import { soundFX } from '../utils/audio';
import { useAnnounce } from '../context/AnnouncerContext';
import LeafletOfflineMap from './LeafletOfflineMap';
import { useSimpleMode } from '../context/SimpleModeContext';

const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    url: '#',
    icon: GithubIcon,
    ariaLabel: 'Visit GitHub Profile',
    hoverClass: 'hover:bg-[#18181B] hover:text-white hover:border-[#18181B]'
  },
  {
    name: 'LinkedIn',
    url: '#',
    icon: LinkedinIcon,
    ariaLabel: 'Visit LinkedIn Profile',
    hoverClass: 'hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]'
  },
  {
    name: 'Notion',
    url: '#',
    icon: NotionIcon,
    ariaLabel: 'Visit Notion Workspace',
    hoverClass: 'hover:bg-[#2F3437] hover:text-white hover:border-[#2F3437]'
  },
  {
    name: 'Instagram',
    url: '#',
    icon: InstagramIcon,
    ariaLabel: 'Visit Instagram Profile',
    hoverClass: 'hover:bg-gradient-to-r hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#FCB045] hover:text-white hover:border-transparent'
  },
  {
    name: 'YouTube',
    url: '#',
    icon: YoutubeIcon,
    ariaLabel: 'Visit YouTube Channel',
    hoverClass: 'hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]'
  },
  {
    name: 'X (Twitter)',
    url: '#',
    icon: TwitterIcon,
    ariaLabel: 'Visit X (formerly Twitter) Profile',
    hoverClass: 'hover:bg-[#000000] hover:text-white hover:border-black'
  },
  {
    name: 'Facebook',
    url: '#',
    icon: FacebookIcon,
    ariaLabel: 'Visit Facebook Profile',
    hoverClass: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]'
  }
];

const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  whatsapp: '',
  company: '',
  role: 'Taxation & Accounting',
  budget: 'Flexible / Open to Discuss',
  urgency: 'Normal (Within 1-2 weeks)',
  message: ''
};

const UNLOCK_STORAGE_KEY = 'portfolio_contact_unlocked';
const UNLOCK_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export default function ContactSection() {
  const { isSimpleMode } = useSimpleMode();
  let announce = null;
  try {
    const announcer = useAnnounce();
    announce = announcer?.announce;
  } catch {
    // fallback
  }
  const [activeTab, setActiveTab] = useState('touch');
  const [emailCopied, setEmailCopied] = useState(false);
  const [whatsappCopied, setWhatsappCopied] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  
  // Gated unlock state (initialized lazily from localStorage)
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem(UNLOCK_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.unlocked && parsed?.expiry && Date.now() < parsed.expiry) {
          return true;
        }
        localStorage.removeItem(UNLOCK_STORAGE_KEY);
      }
    } catch {
      // Ignored
    }
    return false;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [lastSubmittedData, setLastSubmittedData] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(UNLOCK_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.unlocked && parsed?.expiry && Date.now() < parsed.expiry) {
          return parsed.userData || null;
        }
      }
    } catch {
      // Ignored
    }
    return null;
  });

  const CONTACT_TABS = [
    {
      id: 'touch',
      label: 'Get in Touch',
      badge: 'Inquiry Form',
      icon: Mail
    },
    {
      id: 'direct',
      label: 'Direct Details',
      badge: isUnlocked ? '✓ Unlocked' : '🔒 Gated',
      icon: MessageCircle
    },
    {
      id: 'location',
      label: 'Location & Office',
      badge: 'Medininagar HQ',
      icon: MapPin
    }
  ];

  // Map state
  const [zoom, setZoom] = useState(13);
  const [mapMode, setMapMode] = useState('osm'); // 'osm' | 'google'
  const [manuallyToggled, setManuallyToggled] = useState(false);
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });
  const [showIframe, setShowIframe] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const tabButtonRefs = useRef({});
  const emailTimeoutRef = useRef(null);
  const whatsappTimeoutRef = useRef(null);
  const addressTimeoutRef = useRef(null);
  const upgradeTimerRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  const directEmail = 'Atulravi2015@gmail.com';
  const formattedWhatsApp = '+91 7992383804';
  const fullAddress = 'Daltonganj (Medininagar), Dist: Palamau, Pin: 822101, Jharkhand, India';

  // Defensive clipboard fallback for strict environment safety
  const fallbackCopyText = (text) => {
    if (typeof document === 'undefined' || !document.body) return;
    let textarea = null;
    try {
      textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      textarea.style.opacity = '0';
      textarea.setAttribute('readonly', '');
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      if (textarea.setSelectionRange) {
        textarea.setSelectionRange(0, text.length);
      }
      document.execCommand('copy');
    } catch {
      // Ignored if blocked
    } finally {
      if (textarea && textarea.parentNode) {
        textarea.parentNode.removeChild(textarea);
      }
    }
  };

  // Listen for external tab switch events (e.g. from CommandPalette)
  useEffect(() => {
    const validTabs = ['touch', 'direct', 'location'];
    const handleSwitchTab = (e) => {
      const targetTab = e.detail?.tab;
      if (targetTab && validTabs.includes(targetTab)) {
        setActiveTab(targetTab);
      }
    };
    window.addEventListener('switch-contact-tab', handleSwitchTab);
    return () => window.removeEventListener('switch-contact-tab', handleSwitchTab);
  }, []);

  // Monitor network connectivity status & offline resilience
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setMapMode('osm');
      setShowIframe(false);
      setIframeLoaded(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Simple Mode guard: ensure showIframe remains false and map stays offline when simple mode is active and iframe not preloaded
  useEffect(() => {
    if (isSimpleMode && !iframeLoaded) {
      setShowIframe(false);
      if (mapMode === 'google') {
        setMapMode('osm');
      }
    }
  }, [isSimpleMode, iframeLoaded, mapMode]);

  // Hybrid map auto-upgrade engine: after 2.5s auto-upgrades if online and not manually toggled
  const AUTO_UPGRADE_DELAY = 2500;
  useEffect(() => {
    if (isSimpleMode) {
      if (upgradeTimerRef.current) {
        clearTimeout(upgradeTimerRef.current);
        upgradeTimerRef.current = null;
      }
      return;
    }

    if (activeTab !== 'location') {
      if (upgradeTimerRef.current) {
        clearTimeout(upgradeTimerRef.current);
        upgradeTimerRef.current = null;
      }
      return;
    }

    if (!isOnline || manuallyToggled) {
      if (upgradeTimerRef.current) {
        clearTimeout(upgradeTimerRef.current);
        upgradeTimerRef.current = null;
      }
      return;
    }

    if (mapMode === 'google') return;

    upgradeTimerRef.current = setTimeout(() => {
      if (typeof navigator !== 'undefined' && navigator.onLine && !manuallyToggled) {
        setMapMode('google');
        setShowIframe(true);
      }
      upgradeTimerRef.current = null;
    }, AUTO_UPGRADE_DELAY);

    return () => {
      if (upgradeTimerRef.current) {
        clearTimeout(upgradeTimerRef.current);
        upgradeTimerRef.current = null;
      }
    };
  }, [activeTab, isOnline, manuallyToggled, mapMode, isSimpleMode]);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      if (emailTimeoutRef.current) clearTimeout(emailTimeoutRef.current);
      if (whatsappTimeoutRef.current) clearTimeout(whatsappTimeoutRef.current);
      if (addressTimeoutRef.current) clearTimeout(addressTimeoutRef.current);
      if (upgradeTimerRef.current) clearTimeout(upgradeTimerRef.current);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const dismissToast = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
    setShowToast(false);
  };

  const handleTabChange = (tabId, moveFocus = false) => {
    if (moveFocus) {
      requestAnimationFrame(() => {
        const btn = tabButtonRefs.current[tabId];
        if (btn) {
          btn.focus();
          btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
      });
    }
    if (tabId === activeTab) return;
    setActiveTab(tabId);
    soundFX.playFocusBeep();
  };

  const handleKeyDown = (e) => {
    const currentIndex = CONTACT_TABS.findIndex((t) => t.id === activeTab);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % CONTACT_TABS.length;
      handleTabChange(CONTACT_TABS[nextIndex].id, true);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + CONTACT_TABS.length) % CONTACT_TABS.length;
      handleTabChange(CONTACT_TABS[prevIndex].id, true);
    } else if (e.key === 'Home') {
      e.preventDefault();
      handleTabChange(CONTACT_TABS[0].id, true);
    } else if (e.key === 'End') {
      e.preventDefault();
      handleTabChange(CONTACT_TABS[CONTACT_TABS.length - 1].id, true);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const panel = document.getElementById(`contact-panel-${activeTab}`);
      if (panel) {
        panel.focus();
      }
    }
  };

  const handlePanelKeyDown = (e) => {
    if (e.key === 'ArrowUp' && e.target === e.currentTarget) {
      e.preventDefault();
      const btn = tabButtonRefs.current[activeTab];
      if (btn) {
        btn.focus();
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    }
  };

  const copyEmail = () => {
    const notifySuccess = () => {
      if (emailTimeoutRef.current) clearTimeout(emailTimeoutRef.current);
      setEmailCopied(true);
      soundFX.playSparkle();
      if (announce) announce('Email address copied to clipboard', 'polite');
      emailTimeoutRef.current = setTimeout(() => {
        setEmailCopied(false);
        emailTimeoutRef.current = null;
      }, 2400);
    };

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(directEmail).then(notifySuccess).catch(() => {
        fallbackCopyText(directEmail);
        notifySuccess();
      });
    } else {
      fallbackCopyText(directEmail);
      notifySuccess();
    }
  };

  const copyWhatsApp = () => {
    const notifySuccess = () => {
      if (whatsappTimeoutRef.current) clearTimeout(whatsappTimeoutRef.current);
      setWhatsappCopied(true);
      soundFX.playSparkle();
      whatsappTimeoutRef.current = setTimeout(() => {
        setWhatsappCopied(false);
        whatsappTimeoutRef.current = null;
      }, 2400);
    };

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(formattedWhatsApp).then(notifySuccess).catch(() => {
        fallbackCopyText(formattedWhatsApp);
        notifySuccess();
      });
    } else {
      fallbackCopyText(formattedWhatsApp);
      notifySuccess();
    }
  };

  const copyAddress = () => {
    const notifySuccess = () => {
      if (addressTimeoutRef.current) clearTimeout(addressTimeoutRef.current);
      setAddressCopied(true);
      soundFX.playPop();
      addressTimeoutRef.current = setTimeout(() => {
        setAddressCopied(false);
        addressTimeoutRef.current = null;
      }, 2200);
    };

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(fullAddress).then(notifySuccess).catch(() => {
        fallbackCopyText(fullAddress);
        notifySuccess();
      });
    } else {
      fallbackCopyText(fullAddress);
      notifySuccess();
    }
  };

  const handleZoomIn = () => {
    const maxZ = mapMode === 'osm' ? 15 : 18;
    setZoom((prev) => {
      const next = Math.min(maxZ, prev + 1);
      soundFX.playChipHover();
      return next;
    });
  };

  const handleZoomOut = () => {
    const minZ = mapMode === 'osm' ? 12 : 11;
    setZoom((prev) => {
      const next = Math.max(minZ, prev - 1);
      soundFX.playChipHover();
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoom(13);
    soundFX.playFocusBeep();
  };

  const handleToggleMapMode = () => {
    if (isSimpleMode && !iframeLoaded) {
      soundFX.playPop();
      setToastMessage('Simple Mode सक्रिय है, केवल ऑफलाइन मैप उपलब्ध है');
      setShowToast(true);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => {
        setShowToast(false);
        toastTimeoutRef.current = null;
      }, 4000);
      return;
    }

    soundFX.playFocusBeep();
    setManuallyToggled(true);
    if (mapMode === 'google') {
      setMapMode('osm');
      setShowIframe(false);
      setZoom((z) => Math.min(15, Math.max(12, z)));
    } else {
      setMapMode('google');
      if (isOnline) {
        setShowIframe(true);
      }
    }
  };

  const handleRetryLive = () => {
    if (isSimpleMode && !iframeLoaded) {
      soundFX.playPop();
      setToastMessage('Simple Mode सक्रिय है, केवल ऑफलाइन मैप उपलब्ध है');
      setShowToast(true);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => {
        setShowToast(false);
        toastTimeoutRef.current = null;
      }, 4000);
      return;
    }

    soundFX.playFocusBeep();
    const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
    setIsOnline(online);
    if (online) {
      setMapMode('google');
      setShowIframe(true);
    }
  };

  const triggerCelebration = () => {
    soundFX.playSparkle();
    try {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF4D6D', '#25D366', '#0A66C2', '#FFD166', '#06D6A0', '#9333EA']
      });
    } catch {
      // Confetti fallback if script blocked
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Phone validation: country code optional, 10 to 17 digits/formatting chars
    const phoneRegex = /^\+?[0-9\s-]{10,17}$/;
    if (!phoneRegex.test(formData.whatsapp.trim())) {
      setSubmitError('Please enter a valid WhatsApp phone number with country code (e.g. +91 9876543210).');
      soundFX.playPop();
      if (announce) announce('Please enter a valid WhatsApp phone number', 'assertive');
      return;
    }

    setIsSubmitting(true);
    soundFX.playHapticClick();

    const submissionPayload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      whatsapp: formData.whatsapp.trim(),
      company: formData.company.trim() || 'N/A',
      role: formData.role,
      budget: formData.budget || 'N/A',
      urgency: formData.urgency || 'Normal',
      message: formData.message.trim(),
      _subject: `New Portfolio Inquiry from ${formData.name.trim()} [${formData.role}]`,
      _captcha: 'false',
      _template: 'table'
    };

    try {
      const res = await fetch('https://formsubmit.co/ajax/Atulravi2015@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(submissionPayload)
      });
      const result = await res.json().catch(() => null);

      // Even if API returns non-200, we gracefully process fallback unlock
      if (!res.ok) {
        console.warn('FormSubmit returned status:', res?.status, result);
      }
    } catch (err) {
      console.warn('FormSubmit fetch encountered network error, activating fallback:', err);
    } finally {
      setIsSubmitting(false);
      setIsUnlocked(true);
      setLastSubmittedData({ ...formData });
      if (announce) announce('Message sent successfully! Thank you for reaching out.', 'polite');

      // Save unlock state for 24 hours
      try {
        const unlockData = {
          unlocked: true,
          expiry: Date.now() + UNLOCK_DURATION_MS,
          userData: { ...formData }
        };
        localStorage.setItem(UNLOCK_STORAGE_KEY, JSON.stringify(unlockData));
        window.dispatchEvent(
          new CustomEvent('contact_channel_unlocked', {
            detail: { unlocked: true, userData: unlockData.userData }
          })
        );
      } catch (e) {
        console.warn('Failed to persist unlock state:', e);
      }

      // Show Floating Toast notification for 5 seconds
      setToastMessage('Inquiry Sent Successfully! Direct WhatsApp & Email are now unlocked.');
      setShowToast(true);
      soundFX.playSparkle();
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => {
        setShowToast(false);
        toastTimeoutRef.current = null;
      }, 5000);

      triggerCelebration();

      // Automatically switch active tab to 'direct'
      setActiveTab('direct');
      requestAnimationFrame(() => {
        const directTabBtn = tabButtonRefs.current['direct'];
        if (directTabBtn) {
          directTabBtn.focus();
        }
      });
    }
  };

  const handleResetInquiry = () => {
    soundFX.playFocusBeep();
    setFormData(INITIAL_FORM_STATE);
    setIsUnlocked(false);
    try {
      localStorage.removeItem(UNLOCK_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('contact_channel_locked'));
    } catch {
      // Ignore
    }
  };

  const mapEmbedUrl = `https://maps.google.com/maps?q=Daltonganj%2C%20Medininagar%2C%20Palamau%2C%20Jharkhand%20822101&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;

  // WhatsApp personalized greeting link
  const whatsAppInquiryText = lastSubmittedData 
    ? `Hello Atul ji, I just submitted an inquiry for "${lastSubmittedData.role}".\nName: ${lastSubmittedData.name}\nWhatsApp: ${lastSubmittedData.whatsapp}\nInquiry: ${lastSubmittedData.message}`
    : `Hello Atul ji, I visited your portfolio and would like to connect directly regarding consultation/projects.`;
  const whatsAppLink = `https://wa.me/917992383804?text=${encodeURIComponent(whatsAppInquiryText)}`;

  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative w-full py-24 px-4 sm:px-6 lg:px-8 scroll-mt-28">
      {/* Floating Toast Notification */}
      {showToast && (() => {
        const isSimpleNotice = Boolean(toastMessage && toastMessage.includes('Simple Mode'));
        return (
          <div 
            role="status" 
            aria-live="polite"
            className={`fixed bottom-6 sm:bottom-8 z-50 flex items-center gap-3 px-4 sm:px-5 py-3 rounded-full bg-white/95 dark:bg-[#161122]/95 backdrop-blur-md text-[#18181B] dark:text-[#F5F2F8] transition-all duration-300 ${
              isSimpleNotice
                ? 'left-6 sm:left-8 max-w-[calc(100vw-5.5rem)] sm:max-w-md animate-toast-in-left border border-amber-500/80 dark:border-amber-400/80 shadow-2xl shadow-amber-500/20'
                : 'left-1/2 -translate-x-1/2 max-w-[94vw] sm:max-w-xl animate-toast-in border border-emerald-500 dark:border-emerald-500 shadow-2xl shadow-emerald-500/20'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              isSimpleNotice
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
            }`}>
              {isSimpleNotice ? (
                <Info className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : (
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#18181B] dark:text-white leading-tight">
              {toastMessage || 'Inquiry Sent Successfully! Direct WhatsApp & Email are now unlocked.'}
            </span>
            <button
              type="button"
              onClick={dismissToast}
              aria-label="Dismiss notification"
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#201830] transition-colors shrink-0 ml-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })()}

      <div className="max-w-7xl mx-auto">
        {/* Section Pill Badge */}
        <div
          tabIndex={0}
          data-tts="Section 9: Contact"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#161122] border border-[#E7E2D8] dark:border-[#2D2340] text-[#18181B] dark:text-[#F5F2F8] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs whitespace-nowrap max-w-full overflow-x-auto focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
        >
          <span className="w-2 h-2 rounded-full bg-[#FF4D6D] shrink-0" />
          <span className="truncate sm:overflow-visible">06 ✦ Contact &bull; Inquiries &amp; HQ</span>
        </div>

        {/* Section Heading & Subtitle */}
        <div className="mb-6">
          <h2
            id="contact-heading"
            tabIndex={0}
            data-tts="Let's build something meaningful."
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#18181B] dark:text-white tracking-tight font-['Outfit',sans-serif] leading-[1.08] mb-3 whitespace-normal sm:whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg"
          >
            Let's build something <span className="text-[#FF4D6D]">meaningful</span>.
          </h2>
          <div className="w-12 h-1 rounded-full bg-[#FF4D6D] mb-4" />
          <p
            tabIndex={0}
            data-tts="Have a role, a project, or a question about my work? Submit your inquiry below to instantly unlock direct WhatsApp and email channels."
            className="text-stone-600 dark:text-stone-400 text-sm sm:text-base max-w-xl font-normal leading-relaxed focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg"
          >
            Have a role, a project, or a question about my work? Submit your inquiry below to instantly unlock direct WhatsApp &amp; email channels.
          </p>
        </div>

        {/* Horizontal 3-Tab Switcher Ribbon */}
        <div 
          role="tablist" 
          aria-label="Contact and location tabs"
          aria-orientation="horizontal"
          onKeyDown={handleKeyDown}
          className="flex p-1.5 bg-[#FAF8F5] dark:bg-[#100C1A]/80 rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] gap-1.5 mb-8 overflow-x-auto no-scrollbar"
        >
          {CONTACT_TABS.map((tab, idx) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                ref={(el) => { tabButtonRefs.current[tab.id] = el; }}
                role="tab"
                id={`contact-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`contact-panel-${tab.id}`}
                tabIndex={0}
                data-tts={`Tab ${idx + 1} of 3: ${tab.label}, ${isActive ? 'Selected' : 'Unselected'}. Press Enter to view or Tab to move forward`}
                type="button"
                onClick={() => handleTabChange(tab.id, false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveTab(tab.id);
                  }
                }}
                onMouseEnter={() => soundFX.playChipHover()}
                className={`flex-1 min-w-[140px] sm:min-w-0 min-h-[44px] flex items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all duration-200 cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-xl whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-[#201830] text-[#18181B] dark:text-[#F5F2F8] shadow-sm border border-[#E7E2D8] dark:border-[#2D2340]'
                    : 'text-stone-600 dark:text-[#A99EBA] hover:text-[#18181B] dark:hover:text-[#F5F2F8] hover:bg-white/60 dark:hover:bg-[#201830]/60'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors shrink-0 ${isActive ? 'text-[#FF4D6D]' : 'text-stone-400'}`} />
                <span className="truncate whitespace-nowrap">{tab.label}</span>
                {isActive && (
                  <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 ${
                    tab.id === 'direct' && isUnlocked
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 border border-[#FFD1DC] dark:border-[#FF4D6D]/30 text-[#FF4D6D]'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Content Card Container enclosing tabpanels */}
        <div className="bg-white dark:bg-[#161122] rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xl shadow-stone-900/5 relative overflow-hidden">
          {/* Soft background ambient light */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FF4D6D]/8 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* ======================================================== */}
          {/* TAB 1: GET IN TOUCH (Full-Width Responsive Contact Form)  */}
          {/* ======================================================== */}
          {activeTab === 'touch' && (
            <div
              role="tabpanel"
              id="contact-panel-touch"
              aria-labelledby="contact-tab-touch"
              tabIndex={0}
              onKeyDown={handlePanelKeyDown}
              className="animate-tab-fade focus:outline-none w-full"
            >
              <div className="w-full">
                {/* Form Sub-header */}
                <div
                  tabIndex={0}
                  data-tts="Sub-header: Direct Communication Form"
                  className="mb-8 p-2 -ml-2 rounded-xl focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 text-[#FF4D6D] border border-[#FFD1DC] dark:border-[#FF4D6D]/30 flex items-center justify-center shrink-0">
                      <Send className="w-4 h-4" />
                    </div>
                    <h3 className="font-['Outfit',sans-serif] text-xl sm:text-2xl font-bold text-[#18181B] dark:text-[#F5F2F8]">
                      Send a Note / Project Inquiry
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-2xl">
                    Fill in the details below to submit your project or consultation inquiry. Completing this form instantly unlocks direct WhatsApp priority access and personal email.
                  </p>
                </div>

                {submitError && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    id="contact-form-error"
                    className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5 shadow-2xs"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                    <span className="font-medium">{submitError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {/* Row 1 - Col 1: Your Name */}
                    <div>
                      <label htmlFor="field-name" className="block text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
                        YOUR NAME <span className="text-[#FF4D6D]">*</span>
                      </label>
                      <input
                        id="field-name"
                        type="text"
                        required
                        data-tts="Input field: Your Name"
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#DCD5CB] dark:border-stone-700 bg-[#FAF8F5] dark:bg-[#100C1A]/80 focus:bg-white dark:focus:bg-stone-900 focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 text-xs outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden transition-all text-[#18181B] dark:text-white dark:placeholder-stone-500 shadow-2xs"
                      />
                    </div>

                    {/* Row 1 - Col 2: Email Address */}
                    <div>
                      <label htmlFor="field-email" className="block text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
                        EMAIL ADDRESS <span className="text-[#FF4D6D]">*</span>
                      </label>
                      <input
                        id="field-email"
                        type="email"
                        required
                        data-tts="Input field: Email Address"
                        placeholder="rahul@enterprise.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#DCD5CB] dark:border-stone-700 bg-[#FAF8F5] dark:bg-[#100C1A]/80 focus:bg-white dark:focus:bg-stone-900 focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 text-xs outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden transition-all text-[#18181B] dark:text-white dark:placeholder-stone-500 shadow-2xs"
                      />
                    </div>

                    {/* Row 1 - Col 3: WhatsApp Number */}
                    <div>
                      <label htmlFor="field-whatsapp" className="block text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300 mb-1.5 flex items-center justify-between uppercase tracking-wider">
                        <span>WHATSAPP NUMBER <span className="text-[#FF4D6D]">*</span></span>
                        <span className="text-[10px] text-stone-400 font-normal lowercase">incl. country code</span>
                      </label>
                      <div className="relative">
                        <input
                          id="field-whatsapp"
                          type="tel"
                          required
                          data-tts="Input field: WhatsApp Phone Number with Country Code"
                          placeholder="+91 98765 43210"
                          value={formData.whatsapp}
                          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                          aria-invalid={Boolean(submitError)}
                          aria-describedby={submitError ? "contact-form-error" : undefined}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DCD5CB] dark:border-stone-700 bg-[#FAF8F5] dark:bg-[#100C1A]/80 focus:bg-white dark:focus:bg-stone-900 focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 text-xs outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden transition-all text-[#18181B] dark:text-white dark:placeholder-stone-500 font-mono shadow-2xs"
                        />
                        <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Row 2 - Col 1: Company / Organization */}
                    <div>
                      <label htmlFor="field-company" className="block text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
                        COMPANY / ORGANIZATION <span className="text-stone-400 font-normal lowercase">(Optional)</span>
                      </label>
                      <div className="relative">
                        <input
                          id="field-company"
                          type="text"
                          data-tts="Input field: Company or Organization"
                          placeholder="FinCorp Pvt Ltd / Self"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DCD5CB] dark:border-stone-700 bg-[#FAF8F5] dark:bg-[#100C1A]/80 focus:bg-white dark:focus:bg-stone-900 focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 text-xs outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden transition-all text-[#18181B] dark:text-white dark:placeholder-stone-500 shadow-2xs"
                        />
                        <Building2 className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Row 2 - Col 2: Inquiry Category / Role */}
                    <div>
                      <label htmlFor="field-role" className="block text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                        <Briefcase className="w-3.5 h-3.5 text-[#FF4D6D]" />
                        <span>ROLE / INQUIRY CATEGORY <span className="text-[#FF4D6D]">*</span></span>
                      </label>
                      <select
                        id="field-role"
                        required
                        data-tts="Select dropdown: Inquiry Category or Role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3.5 py-3 rounded-xl border border-[#DCD5CB] dark:border-stone-700 bg-[#FAF8F5] dark:bg-[#100C1A]/80 focus:bg-white dark:focus:bg-stone-900 text-xs outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden text-[#18181B] dark:text-white cursor-pointer shadow-2xs"
                      >
                        <option value="Taxation & Accounting">Taxation &amp; Accounting</option>
                        <option value="MIS & Data Analytics">MIS &amp; Data Analytics</option>
                        <option value="AI Software / Vibe Coding">AI Software / Vibe Coding</option>
                        <option value="Office Admin & Management">Office Admin &amp; Management</option>
                        <option value="Other / Custom">Other / Custom</option>
                      </select>
                    </div>

                    {/* Row 2 - Col 3: Estimated Budget */}
                    <div>
                      <label htmlFor="field-budget" className="block text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                        <span>ESTIMATED BUDGET <span className="text-stone-400 font-normal lowercase">(Optional)</span></span>
                      </label>
                      <select
                        id="field-budget"
                        data-tts="Select dropdown: Estimated Budget"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-3.5 py-3 rounded-xl border border-[#DCD5CB] dark:border-stone-700 bg-[#FAF8F5] dark:bg-[#100C1A]/80 focus:bg-white dark:focus:bg-stone-900 text-xs outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden text-[#18181B] dark:text-white cursor-pointer shadow-2xs"
                      >
                        <option value="Flexible / Open to Discuss">Flexible / Open to Discuss</option>
                        <option value="Under ₹25,000">Under ₹25,000</option>
                        <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                        <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                        <option value="₹1,00,000+ / Enterprise">₹1,00,000+ / Enterprise</option>
                        <option value="Hourly / Retainer">Hourly / Retainer</option>
                      </select>
                    </div>

                    {/* Row 3 - Col 1: Project Urgency / Timeline */}
                    <div className="lg:col-span-1">
                      <label htmlFor="field-urgency" className="block text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>PROJECT TIMELINE / URGENCY <span className="text-stone-400 font-normal lowercase">(Optional)</span></span>
                      </label>
                      <select
                        id="field-urgency"
                        data-tts="Select dropdown: Project Timeline or Urgency"
                        value={formData.urgency}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                        className="w-full px-3.5 py-3 rounded-xl border border-[#DCD5CB] dark:border-stone-700 bg-[#FAF8F5] dark:bg-[#100C1A]/80 focus:bg-white dark:focus:bg-stone-900 text-xs outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden text-[#18181B] dark:text-white cursor-pointer shadow-2xs"
                      >
                        <option value="Normal (Within 1-2 weeks)">Normal (Within 1-2 weeks)</option>
                        <option value="Urgent / Immediate (1-3 days)">Urgent / Immediate (1-3 days)</option>
                        <option value="Flexible / Exploratory">Flexible / Exploratory</option>
                      </select>
                    </div>

                    {/* Row 4 - Full 100% Width: Message / Inquiry Details */}
                    <div className="col-span-full">
                      <label htmlFor="field-message" className="block text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
                        INQUIRY DETAILS / MESSAGE <span className="text-[#FF4D6D]">*</span>
                      </label>
                      <textarea
                        id="field-message"
                        required
                        data-tts="Textarea field: Inquiry Details and Message"
                        rows={4}
                        placeholder="Please outline the deliverables, current bottleneck, tools used, or specific goals..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#DCD5CB] dark:border-stone-700 bg-[#FAF8F5] dark:bg-[#100C1A]/80 focus:bg-white dark:focus:bg-stone-900 focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 text-xs outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden transition-all text-[#18181B] dark:text-white dark:placeholder-stone-500 resize-none shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Bottom Row: Privacy / Guarantee and Submit Action */}
                  <div className="mt-6 pt-5 border-t border-[#ECE7DF] dark:border-[#2D2340] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="text-xs text-stone-600 dark:text-stone-400">
                        <span className="font-bold text-[#18181B] dark:text-[#F5F2F8]">100% Privacy Guarantee:</span> Submitting immediately activates a 24-hr unlock token for WhatsApp &amp; Email.
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      data-tts="Button: Submit Inquiry and Unlock Direct Channel"
                      className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-[#18181B] hover:bg-black dark:bg-white dark:text-[#18181B] dark:hover:bg-stone-200 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-70 disabled:pointer-events-none shrink-0 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#FF4D6D]" />
                          <span>Submitting Inquiry &amp; Unlocking Direct Channel...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-[#FF4D6D]" />
                          <span>Submit Inquiry &amp; Unlock Direct Channel</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: DIRECT CHANNEL (Dedicated Panel: Unlocked / Locked)*/}
          {/* ======================================================== */}
          {activeTab === 'direct' && (
            <div
              role="tabpanel"
              id="contact-panel-direct"
              aria-labelledby="contact-tab-direct"
              tabIndex={0}
              onKeyDown={handlePanelKeyDown}
              className="animate-tab-fade space-y-6 focus:outline-none"
            >
              {/* Direct Channels Sub-header */}
              <div
                tabIndex={0}
                data-tts="Sub-header: Verified Direct Communication Channels"
                className="flex items-center gap-2.5 p-2 -ml-2 rounded-xl focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
              >
                <div className="w-8 h-8 rounded-xl bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 text-[#FF4D6D] border border-[#FFD1DC] dark:border-[#FF4D6D]/30 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-['Outfit',sans-serif] text-xl sm:text-2xl font-bold text-[#18181B] dark:text-[#F5F2F8]">
                    Verified Direct Communication Channels
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                    {isUnlocked 
                      ? 'Priority access channels active for direct inquiry, voice call, and instant messaging'
                      : 'Protected channels to maintain focused, spam-free communication'}
                  </p>
                </div>
              </div>

              {isUnlocked ? (
                /* UNLOCKED STANDALONE PANEL */
                <div className="space-y-6 animate-in zoom-in-95 duration-300">
                  {/* Top 24-Hour Celebration Banner */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-teal-500/15 border border-emerald-300/80 dark:border-emerald-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-[11px] font-mono font-bold mb-1 border border-emerald-200 dark:border-emerald-800">
                          <Check className="w-3 h-3 text-emerald-600" /> Verified Access Active
                        </div>
                        <h4 className="text-lg sm:text-xl font-black font-['Outfit',sans-serif] text-[#18181B] dark:text-white">
                          🎉 Direct Channels Unlocked for 24 Hours!
                        </h4>
                        <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                          Direct Contact Unlocked! Priority WhatsApp direct messaging and personal email are active for fast turnaround{lastSubmittedData?.name ? ` for ${lastSubmittedData.name}` : ''}.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetInquiry}
                      className="px-3.5 py-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-[#18181B] dark:hover:text-white hover:bg-white/80 dark:hover:bg-stone-800 transition-colors font-mono text-xs font-bold border border-stone-200 dark:border-stone-700 shrink-0 cursor-pointer"
                    >
                      Reset / Re-lock
                    </button>
                  </div>

                  {/* Priority Channel Cards (WhatsApp & Direct Email) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Priority WhatsApp Card */}
                    <div
                      tabIndex={0}
                      data-card="true"
                      data-tts={`WhatsApp Priority Channel: ${formattedWhatsApp}. Direct chat with Atul Verma for project briefing, quotations, and timeline alignment.`}
                      className="p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 flex flex-col justify-between space-y-4 shadow-xs focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-2xl"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                            <MessageCircle className="w-4 h-4 text-[#25D366]" />
                            <span>WhatsApp (Priority Channel)</span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-700">
                            Instant Turnaround
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-[#18181B] dark:text-white font-mono">
                          {formattedWhatsApp}
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                          Direct chat with Atul Verma for project briefing, quotations &amp; timeline alignment.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
                        <a
                          href={whatsAppLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => soundFX.playSparkle()}
                          className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Chat on WhatsApp</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>

                        <button
                          type="button"
                          onClick={copyWhatsApp}
                          aria-label="Copy WhatsApp Number"
                          className="py-3 px-4 rounded-xl bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold font-mono transition-colors cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
                          title="Copy WhatsApp"
                        >
                          {whatsappCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          <span>{whatsappCopied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Direct Email Card */}
                    <div
                      tabIndex={0}
                      data-card="true"
                      data-tts={`Direct Email Inbox: ${directEmail}. Direct personal email for formal proposals, contract reviews, and enterprise paperwork.`}
                      className="p-6 rounded-2xl bg-pink-50/60 dark:bg-[#FF4D6D]/10 border border-[#FFD1DC] dark:border-[#FF4D6D]/30 flex flex-col justify-between space-y-4 shadow-xs focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-2xl"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FF4D6D] uppercase tracking-wider">
                            <Mail className="w-4 h-4" />
                            <span>Direct Email Inbox</span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-100 dark:bg-[#FF4D6D]/20 text-[#FF4D6D] font-bold border border-[#FFD1DC] dark:border-[#FF4D6D]/30">
                            Personal Inbox
                          </span>
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-[#18181B] dark:text-white font-mono truncate" title={directEmail}>
                          {directEmail}
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                          Direct personal email for formal proposals, contract reviews, and enterprise paperwork.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
                        <a
                          href={`mailto:${directEmail}`}
                          onClick={() => soundFX.playSparkle()}
                          className="flex-1 py-3 px-4 rounded-xl bg-[#18181B] hover:bg-black dark:bg-white dark:text-[#18181B] dark:hover:bg-stone-200 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
                        >
                          <Mail className="w-4 h-4" />
                          <span>Compose Email</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>

                        <button
                          type="button"
                          onClick={copyEmail}
                          aria-label="Copy Email address"
                          className="py-3 px-4 rounded-xl bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-[#FFD1DC] dark:border-[#FF4D6D]/30 text-xs font-bold font-mono transition-colors cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
                          title="Copy Email"
                        >
                          {emailCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          <span>{emailCopied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Professional Social Profiles */}
                  <div className="p-6 rounded-2xl bg-[#FAF8F5] dark:bg-[#100C1A] border border-[#ECE7DF] dark:border-[#2D2340] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-mono text-stone-500 dark:text-stone-400 uppercase tracking-wider font-bold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D]" />
                        Professional Profiles &amp; Networks
                      </div>
                      <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500">
                        7 Networks Active
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {SOCIAL_LINKS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <a
                            key={item.name}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={item.ariaLabel}
                            title={item.name}
                            onClick={() => soundFX.playSparkle()}
                            className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 border border-[#E7E2D8] dark:border-stone-800 text-xs font-bold transition-all duration-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 ${item.hoverClass}`}
                          >
                            <Icon className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
                            <span className="text-[11px]">{item.name}</span>
                            <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200" />
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reset and Switch Options */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <span className="text-stone-500 dark:text-stone-400 font-mono text-[11px]">
                      Access token expires in 24 hours. Submit another inquiry at any time.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleTabChange('touch')}
                      className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:text-[#18181B] dark:hover:text-white transition-colors font-mono text-xs font-bold cursor-pointer border border-stone-200 dark:border-stone-800"
                    >
                      Submit Another Inquiry &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                /* LOCKED/GATED STANDALONE PANEL */
                <div className="space-y-6">
                  {/* Gated Header Card */}
                  <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                        <Lock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 text-[11px] font-mono font-bold mb-1 border border-amber-300 dark:border-amber-800">
                          <Lock className="w-3 h-3 text-amber-600" /> Gated Channel
                        </div>
                        <h4 className="text-xl sm:text-2xl font-black font-['Outfit',sans-serif] text-[#18181B] dark:text-white">
                          Direct Channels
                        </h4>
                        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-xl">
                          Direct contact info is gated to protect against automated spam &amp; scrapers. Complete the inquiry form in the first tab to instantly unlock 1-click WhatsApp messaging and direct personal email.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTabChange('touch')}
                      className="px-5 py-3 rounded-xl bg-[#18181B] hover:bg-black dark:bg-white dark:text-[#18181B] dark:hover:bg-stone-200 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 shrink-0 cursor-pointer"
                    >
                      <span>Fill Inquiry Form to Unlock Direct Access</span>
                      <ArrowRight className="w-4 h-4 text-[#FF4D6D]" />
                    </button>
                  </div>

                  {/* "How Access Works" & Consultation Highlights Section */}
                  <div className="p-6 sm:p-7 rounded-2xl bg-[#FAF8F5] dark:bg-[#100C1A] border border-[#ECE7DF] dark:border-[#2D2340] space-y-5">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FF4D6D]/10 text-[#FF4D6D] text-[11px] font-mono font-bold uppercase tracking-wider mb-2 border border-[#FF4D6D]/20">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>How Access Works</span>
                      </div>
                      <h4 className="text-lg sm:text-xl font-bold font-['Outfit',sans-serif] text-[#18181B] dark:text-white">
                        3-Step Consultation &amp; Direct Connection
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
                        We respect your time. Follow our straightforward process to get in touch:
                      </p>
                    </div>

                    {/* 3-Step Process Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      {/* Step 1 */}
                      <div className="p-4 rounded-xl bg-white dark:bg-stone-900/70 border border-[#E7E2D8] dark:border-[#2D2340] flex items-start gap-3 transition-all hover:border-[#FF4D6D]/40">
                        <div className="w-8 h-8 rounded-xl bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 text-[#FF4D6D] border border-[#FFD1DC] dark:border-[#FF4D6D]/30 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                          01
                        </div>
                        <div>
                          <h5 className="text-xs sm:text-sm font-bold text-[#18181B] dark:text-white font-['Outfit',sans-serif]">
                            Submit Inquiry
                          </h5>
                          <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 leading-relaxed">
                            Fill the simple contact form in the first tab with your requirements.
                          </p>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="p-4 rounded-xl bg-white dark:bg-stone-900/70 border border-[#E7E2D8] dark:border-[#2D2340] flex items-start gap-3 transition-all hover:border-[#FF4D6D]/40">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                          02
                        </div>
                        <div>
                          <h5 className="text-xs sm:text-sm font-bold text-[#18181B] dark:text-white font-['Outfit',sans-serif]">
                            Instant Unlock
                          </h5>
                          <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 leading-relaxed">
                            Automatically unlock direct WhatsApp priority channel and personal email for 24 hours.
                          </p>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="p-4 rounded-xl bg-white dark:bg-stone-900/70 border border-[#E7E2D8] dark:border-[#2D2340] flex items-start gap-3 transition-all hover:border-[#FF4D6D]/40">
                        <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                          03
                        </div>
                        <div>
                          <h5 className="text-xs sm:text-sm font-bold text-[#18181B] dark:text-white font-['Outfit',sans-serif]">
                            Direct Collaboration
                          </h5>
                          <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 leading-relaxed">
                            Connect via WhatsApp for immediate turnaround.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Guarantees Row: Response Time & Privacy */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                      {/* Rapid Response Badge Card */}
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                          <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <div className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
                            &lt; 2 Hours Guaranteed Response Time
                          </div>
                          <div className="text-[11px] text-amber-700/80 dark:text-amber-400/80">
                            Active during business hours (9 AM – 8 PM IST)
                          </div>
                        </div>
                      </div>

                      {/* Privacy & Confidentiality Guarantee Card */}
                      <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900/70 border border-[#E7E2D8] dark:border-stone-800 flex items-start gap-3">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <div className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                          <strong className="text-stone-800 dark:text-stone-200 font-semibold">Privacy Guaranteed:</strong> Your contact information and project requirements remain strictly confidential and are never shared.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Masked / Blurred Channel Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* WhatsApp Card (Masked) */}
                    <div
                      tabIndex={0}
                      data-card="true"
                      data-tts="WhatsApp Priority Channel: Gated. Direct WhatsApp number unlocks immediately upon submitting your project requirements."
                      className="p-6 rounded-2xl bg-[#FAF8F5] dark:bg-[#100C1A] border border-[#E7E2D8] dark:border-[#2D2340] relative overflow-hidden flex flex-col justify-between space-y-4 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-2xl"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                            <MessageCircle className="w-4 h-4 text-[#25D366]" />
                            <span>WhatsApp Priority</span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 font-bold">
                            <Lock className="w-2.5 h-2.5" /> Gated
                          </span>
                        </div>
                        <div className="flex items-center gap-2 select-none filter blur-xs text-2xl font-mono font-bold text-stone-700 dark:text-stone-300">
                          <span>+91 79923 ••••••</span>
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
                          Direct WhatsApp number unlocks immediately upon submitting your project requirements.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleTabChange('touch')}
                        className="w-full py-2.5 px-4 rounded-xl bg-stone-200/70 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 font-bold text-xs font-mono flex items-center justify-center gap-2 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Unlock WhatsApp via Inquiry Form</span>
                      </button>
                    </div>

                    {/* Email Card (Masked) */}
                    <div
                      tabIndex={0}
                      data-card="true"
                      data-tts="Official Email Inbox: Gated. Personal inbox address unlocks immediately upon submitting your project requirements."
                      className="p-6 rounded-2xl bg-[#FAF8F5] dark:bg-[#100C1A] border border-[#E7E2D8] dark:border-[#2D2340] relative overflow-hidden flex flex-col justify-between space-y-4 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-2xl"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                            <Mail className="w-4 h-4 text-[#FF4D6D]" />
                            <span>Official Email</span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 font-bold">
                            <Lock className="w-2.5 h-2.5" /> Gated
                          </span>
                        </div>
                        <div className="flex items-center gap-2 select-none filter blur-xs text-2xl font-mono font-bold text-stone-700 dark:text-stone-300">
                          <span>Atulravi••••@gmail.com</span>
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
                          Personal inbox address unlocks immediately upon submitting your project requirements.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleTabChange('touch')}
                        className="w-full py-2.5 px-4 rounded-xl bg-stone-200/70 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 font-bold text-xs font-mono flex items-center justify-center gap-2 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Unlock Email via Inquiry Form</span>
                      </button>
                    </div>
                  </div>

                  {/* Professional Profiles (Clickable and active even when locked) */}
                  <div className="p-6 rounded-2xl bg-[#FAF8F5] dark:bg-[#100C1A] border border-[#ECE7DF] dark:border-[#2D2340] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-mono text-stone-500 dark:text-stone-400 uppercase tracking-wider font-bold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D]" />
                        Professional Profiles &amp; Social Links
                      </div>
                      <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500">
                        7 Networks &bull; Always Accessible
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {SOCIAL_LINKS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <a
                            key={item.name}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={item.ariaLabel}
                            title={item.name}
                            onClick={() => soundFX.playSparkle()}
                            className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 border border-[#E7E2D8] dark:border-stone-800 text-xs font-bold transition-all duration-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 ${item.hoverClass}`}
                          >
                            <Icon className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
                            <span className="text-[11px]">{item.name}</span>
                            <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}


          {/* ======================================================== */}
          {/* TAB 3: LOCATION & OFFICE MAP (Full-width Interactive)    */}
          {/* ======================================================== */}
          {activeTab === 'location' && (
            <div
              role="tabpanel"
              id="contact-panel-location"
              aria-labelledby="contact-tab-location"
              tabIndex={0}
              onKeyDown={handlePanelKeyDown}
              className="animate-tab-fade space-y-6 focus:outline-none"
            >
              {/* Location Sub-header */}
              <div
                tabIndex={0}
                data-tts="Sub-header: Corporate Headquarters and Geographic Presence"
                className="flex items-center gap-2.5 p-2 -ml-2 rounded-xl focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
              >
                <div className="w-8 h-8 rounded-xl bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 text-[#FF4D6D] border border-[#FFD1DC] dark:border-[#FF4D6D]/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-['Outfit',sans-serif] text-xl sm:text-2xl font-bold text-[#18181B] dark:text-[#F5F2F8]">
                    Corporate Headquarters &amp; Geographic Presence
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                    Medininagar, Palamu, Jharkhand &bull; In-person consultations &amp; regional operations
                  </p>
                </div>
              </div>

              {/* Header Address Card with 1-Click Copy & Google Maps Action */}
              <div
                tabIndex={0}
                data-card="true"
                data-tts="Corporate Headquarters: Medininagar, Palamu, Jharkhand"
                className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F5] dark:bg-[#100C1A] border border-[#E7E2D8] dark:border-[#2D2340] flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-2xs focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-2xl"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 border border-[#FFD1DC] dark:border-[#FF4D6D]/30 flex items-center justify-center text-[#FF4D6D] shrink-0 shadow-2xs">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400 uppercase tracking-wider font-bold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D]" />
                      Location &amp; Headquarters
                    </div>
                    <p className="text-sm sm:text-base font-bold text-[#18181B] dark:text-[#F5F2F8] mt-0.5 leading-snug">
                      {fullAddress}
                    </p>
                  </div>
                </div>

                {/* Action Buttons: 1-Click Copy Address & External Google Maps */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={copyAddress}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold font-mono transition-all duration-200 cursor-pointer shadow-2xs active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden ${
                      addressCopied
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                        : 'bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border-[#E7E2D8] dark:border-stone-700'
                    }`}
                    title="Copy full office address"
                  >
                    {addressCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-stone-500" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>

                  <a
                    href="https://maps.google.com/?q=Daltonganj%2C+Medininagar%2C+Palamau%2C+Jharkhand+822101"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#18181B] hover:bg-black dark:bg-white dark:text-[#18181B] dark:hover:bg-stone-200 text-white text-xs font-bold font-mono transition-all duration-200 shadow-2xs hover:shadow-sm active:scale-95 group focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
                  >
                    <span>View in Google Maps</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Interactive Map Box with Floating Controls Toolbar */}
              <div
                tabIndex={0}
                data-card="true"
                data-tts="Interactive Map: Medininagar Headquarters Geographic Coordinates"
                className="relative rounded-2xl overflow-hidden border border-[#E7E2D8] dark:border-stone-800 shadow-sm bg-stone-100 dark:bg-stone-900 group/map focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-2xl"
              >
                {/* Header Floating Status Pill & Map Controls Toolbar */}
                <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                  {/* Status Indicator Pill */}
                  <div className="pointer-events-auto">
                    {mapMode === 'google' && iframeLoaded && isOnline ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#18181B]/95 backdrop-blur-md border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold shadow-md select-none transition-all">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 animate-pulse" />
                        </span>
                        <span>Live Google Map</span>
                      </div>
                    ) : mapMode === 'google' && isOnline ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#18181B]/95 backdrop-blur-md border border-sky-200 dark:border-sky-800/80 text-sky-700 dark:text-sky-400 text-xs font-mono font-bold shadow-md select-none transition-all">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500 animate-pulse" />
                        </span>
                        <span>Loading Live Map...</span>
                      </div>
                    ) : isSimpleMode && mapMode !== 'google' ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#18181B]/95 backdrop-blur-md border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-bold shadow-md select-none transition-all">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Offline Cache Map • Simple Mode</span>
                      </div>
                    ) : !isOnline ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#18181B]/95 backdrop-blur-md border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-400 text-xs font-mono font-bold shadow-md select-none transition-all">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>Offline Mode • Medininagar OSM</span>
                        <button
                          type="button"
                          onClick={handleRetryLive}
                          className="ml-1 text-[11px] font-sans underline hover:text-amber-800 dark:hover:text-amber-200 cursor-pointer active:scale-95 transition-transform"
                          title="Retry loading Live Google Map"
                        >
                          Retry Live
                        </button>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#18181B]/95 backdrop-blur-md border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-bold shadow-md select-none transition-all">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span>Offline Leaflet OSM • 0ms Cache</span>
                      </div>
                    )}
                  </div>

                  {/* Floating Map Controls Toolbar (Top-Right) */}
                  <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 bg-white/95 dark:bg-[#18181B]/95 backdrop-blur-md rounded-xl border border-[#E7E2D8] dark:border-stone-800 shadow-md transition-all">
                    {/* Toggle Button: Google Maps / Offline OSM */}
                    <button
                      type="button"
                      onClick={handleToggleMapMode}
                      aria-label="Toggle Google Maps or Offline OSM"
                      title={mapMode === 'google' ? 'Switch to Offline Leaflet OSM map' : 'Switch to Live Google Maps'}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer active:scale-95 border ${
                        mapMode === 'google'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 shadow-2xs'
                          : 'bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 text-[#FF4D6D] dark:text-[#FF4D6D] border-[#FFD1DC] dark:border-[#FF4D6D]/30 shadow-2xs'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden sm:inline">Google Maps / Offline OSM</span>
                      <span className="sm:hidden">{mapMode === 'google' ? 'Google' : 'OSM'}</span>
                      <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/10 ml-0.5">
                        {mapMode === 'google' ? 'Live' : 'Offline'}
                      </span>
                    </button>

                    {/* Current Zoom Level Badge */}
                    <div className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] dark:bg-stone-900 border border-[#ECE7DF] dark:border-stone-700 text-[11px] font-mono font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1 select-none">
                      <span className="text-stone-400">Zoom</span>
                      <span className="text-[#FF4D6D]">{zoom}x</span>
                    </div>

                    {/* Zoom In Button */}
                    <button
                      type="button"
                      onClick={handleZoomIn}
                      disabled={mapMode === 'osm' ? zoom >= 15 : zoom >= 18}
                      aria-label="Zoom in map"
                      title="Zoom In"
                      className="p-1.5 rounded-lg text-stone-700 dark:text-stone-300 hover:text-[#18181B] dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 active:scale-90 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>

                    {/* Zoom Out Button */}
                    <button
                      type="button"
                      onClick={handleZoomOut}
                      disabled={mapMode === 'osm' ? zoom <= 12 : zoom <= 11}
                      aria-label="Zoom out map"
                      title="Zoom Out"
                      className="p-1.5 rounded-lg text-stone-700 dark:text-stone-300 hover:text-[#18181B] dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 active:scale-90 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>

                    {/* Reset Zoom Button */}
                    <button
                      type="button"
                      onClick={handleResetZoom}
                      aria-label="Reset map zoom"
                      title="Reset Zoom to 13x"
                      className="p-1.5 rounded-lg text-stone-700 dark:text-stone-300 hover:text-[#FF4D6D] dark:hover:text-[#FF4D6D] hover:bg-pink-50 dark:hover:bg-pink-950/30 active:scale-90 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Instant 0ms Cached Leaflet OSM Map Layer */}
                <LeafletOfflineMap
                  zoom={zoom}
                  onZoomChange={setZoom}
                  className={`w-full min-h-[460px] sm:min-h-[500px] rounded-2xl block transition-opacity duration-700 ease-in-out ${
                    mapMode === 'google' && iframeLoaded && isOnline
                      ? 'opacity-0 pointer-events-none'
                      : 'opacity-100 pointer-events-auto'
                  }`}
                />

                {/* Live Interactive Google Maps Iframe (Crossfaded Layer) */}
                {showIframe && (!isSimpleMode || iframeLoaded) && (
                  <iframe
                    title="Office Location Map - Daltonganj, Medininagar, Jharkhand"
                    src={mapEmbedUrl}
                    key={`map-zoom-${zoom}`}
                    onLoad={() => setIframeLoaded(true)}
                    className={`absolute inset-0 w-full h-full rounded-2xl block border-0 transition-opacity duration-700 ease-in-out ${
                      mapMode === 'google' && iframeLoaded && isOnline
                        ? 'opacity-100 pointer-events-auto z-10'
                        : 'opacity-0 pointer-events-none z-0'
                    }`}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                )}
              </div>

              {/* Travel / Directions Highlight Note */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#100C1A] border border-[#ECE7DF] dark:border-[#2D2340] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600 dark:text-stone-400">
                <div className="flex items-center gap-2.5 font-medium">
                  <Navigation className="w-4 h-4 text-[#FF4D6D] shrink-0" />
                  <span>Palamu District Hub &bull; 5 mins from Medininagar Railway Station (DTO)</span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-stone-500 dark:text-stone-400 font-mono text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Open for in-person consultation by appointment</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
