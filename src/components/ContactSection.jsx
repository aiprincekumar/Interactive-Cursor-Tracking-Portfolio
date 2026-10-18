import React, { useState, useRef, useEffect } from 'react';
import { 
  Mail, 
  MapPin, 
  Check, 
  Send, 
  ArrowUpRight, 
  Copy, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Navigation,
  Sparkles,
  Lock,
  Unlock,
  MessageCircle,
  Building2,
  Clock,
  Briefcase,
  DollarSign,
  AlertCircle,
  Loader2,
  Phone,
  Layers
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
import LeafletOfflineMap from './LeafletOfflineMap';

const CONTACT_TABS = [
  {
    id: 'touch',
    label: 'Get in Touch',
    badge: 'Direct Note',
    icon: Mail
  },
  {
    id: 'location',
    label: 'Location & Office Map',
    badge: 'Medininagar HQ',
    icon: MapPin
  }
];

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
    const handleSwitchTab = (e) => {
      const targetTab = e.detail?.tab;
      if (targetTab && CONTACT_TABS.some((t) => t.id === targetTab)) {
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

  // Hybrid map auto-upgrade engine: after 2.5s auto-upgrades if online and not manually toggled
  const AUTO_UPGRADE_DELAY = 2500;
  useEffect(() => {
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
  }, [activeTab, isOnline, manuallyToggled, mapMode]);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      if (emailTimeoutRef.current) clearTimeout(emailTimeoutRef.current);
      if (whatsappTimeoutRef.current) clearTimeout(whatsappTimeoutRef.current);
      if (addressTimeoutRef.current) clearTimeout(addressTimeoutRef.current);
      if (upgradeTimerRef.current) clearTimeout(upgradeTimerRef.current);
    };
  }, []);

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
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF4D6D', '#25D366', '#0A66C2', '#FFD166', '#06D6A0']
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

      // Even if API returns non-200, we gracefully process fallback unlock
      if (!res.ok) {
        console.warn('FormSubmit returned status:', res.status);
      }
    } catch (err) {
      console.warn('FormSubmit fetch encountered network error, activating fallback:', err);
    } finally {
      setIsSubmitting(false);
      setIsUnlocked(true);
      setLastSubmittedData({ ...formData });

      // Save unlock state for 24 hours
      try {
        const unlockData = {
          unlocked: true,
          expiry: Date.now() + UNLOCK_DURATION_MS,
          userData: { ...formData }
        };
        localStorage.setItem(UNLOCK_STORAGE_KEY, JSON.stringify(unlockData));
      } catch (e) {
        console.warn('Failed to persist unlock state:', e);
      }

      triggerCelebration();
    }
  };

  const handleResetInquiry = () => {
    soundFX.playFocusBeep();
    setFormData(INITIAL_FORM_STATE);
    setIsUnlocked(false);
    try {
      localStorage.removeItem(UNLOCK_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const mapEmbedUrl = `https://maps.google.com/maps?q=Daltonganj%2C%20Medininagar%2C%20Palamau%2C%20Jharkhand%20822101&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;

  // WhatsApp personalized greeting link
  const whatsAppInquiryText = lastSubmittedData 
    ? `Hello Atul ji, I just submitted an inquiry for "${lastSubmittedData.role}".\nName: ${lastSubmittedData.name}\nWhatsApp: ${lastSubmittedData.whatsapp}\nInquiry: ${lastSubmittedData.message}`
    : `Hello Atul ji, I visited your portfolio and would like to discuss a project.`;
  const whatsAppLink = `https://wa.me/917992383804?text=${encodeURIComponent(whatsAppInquiryText)}`;

  return (
    <section id="contact" className="relative w-full py-24 px-4 sm:px-6 lg:px-8 scroll-mt-28">
      <div className="max-w-7xl mx-auto">
        {/* Section Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#161122] border border-[#E7E2D8] dark:border-[#2D2340] text-[#18181B] dark:text-[#F5F2F8] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs whitespace-nowrap max-w-full overflow-x-auto">
          <span className="w-2 h-2 rounded-full bg-[#FF4D6D] shrink-0" />
          <span className="truncate sm:overflow-visible">06 ✦ Contact &bull; Inquiries &amp; HQ</span>
        </div>

        {/* Section Heading & Subtitle */}
        <div className="mb-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#18181B] dark:text-white tracking-tight font-['Outfit',sans-serif] leading-[1.08] mb-3 whitespace-normal sm:whitespace-nowrap">
            Let's build something <span className="text-[#FF4D6D]">meaningful</span>.
          </h2>
          <div className="w-12 h-1 rounded-full bg-[#FF4D6D] mb-4" />
          <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
            Have a role, a project, or a question about my work? Submit your inquiry below to instantly unlock direct WhatsApp &amp; email channels.
          </p>
        </div>

        {/* Horizontal 2-Tab Switcher Ribbon */}
        <div 
          role="tablist" 
          aria-label="Contact and location tabs"
          aria-orientation="horizontal"
          onKeyDown={handleKeyDown}
          className="flex p-1.5 bg-[#FAF8F5] dark:bg-[#100C1A]/80 rounded-2xl border border-[#ECE7DF] dark:border-[#2D2340] gap-1.5 mb-8 overflow-x-auto no-scrollbar"
        >
          {CONTACT_TABS.map((tab) => {
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
                tabIndex={isActive ? 0 : -1}
                type="button"
                onClick={() => handleTabChange(tab.id, false)}
                onMouseEnter={() => soundFX.playChipHover()}
                className={`flex-1 min-w-[150px] sm:min-w-0 min-h-[44px] flex items-center justify-center gap-2.5 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-[#201830] text-[#18181B] dark:text-[#F5F2F8] shadow-sm border border-[#E7E2D8] dark:border-[#2D2340]'
                    : 'text-stone-600 dark:text-[#A99EBA] hover:text-[#18181B] dark:hover:text-[#F5F2F8] hover:bg-white/60 dark:hover:bg-[#201830]/60'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors shrink-0 ${isActive ? 'text-[#FF4D6D]' : 'text-stone-400'}`} />
                <span className="truncate whitespace-nowrap">{tab.label}</span>
                {isActive && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 border border-[#FFD1DC] dark:border-[#FF4D6D]/30 text-[#FF4D6D]">
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
          {/* TAB 1: GET IN TOUCH (Gated Channels & 8-Field Form)      */}
          {/* ======================================================== */}
          {activeTab === 'touch' && (
            <div
              role="tabpanel"
              id="contact-panel-touch"
              aria-labelledby="contact-tab-touch"
              tabIndex={0}
              onKeyDown={handlePanelKeyDown}
              className="animate-tab-fade focus:outline-none"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* Left Column: Direct Connect & Gated Channels */}
                <div className="lg:col-span-5 space-y-6">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] dark:text-white tracking-tight font-['Outfit',sans-serif] mb-2 flex items-center gap-2.5">
                      <span>Direct Channels</span>
                      {isUnlocked ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          <Unlock className="w-3 h-3" /> Unlocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          <Lock className="w-3 h-3" /> Gated
                        </span>
                      )}
                    </h3>
                    <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm font-normal leading-relaxed">
                      {isUnlocked 
                        ? 'Direct contact channels are unlocked. Feel free to initiate an immediate WhatsApp chat or dispatch an email.'
                        : 'Direct contact info is gated to protect against spam & automated scrapers. Complete the inquiry form on the right to unlock direct WhatsApp & email instantly.'
                      }
                    </p>
                  </div>

                  {/* Channel Cards (Email & WhatsApp) */}
                  <div className="space-y-3.5">
                    
                    {/* WhatsApp Channel Card */}
                    {isUnlocked ? (
                      <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 transition-all shadow-xs">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                            <MessageCircle className="w-4 h-4 text-[#25D366]" />
                            <span>WhatsApp (Priority)</span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold">
                            Active
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <a
                            href={whatsAppLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => soundFX.playSparkle()}
                            className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#18181B] dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 font-mono transition-colors group"
                          >
                            <span>{formattedWhatsApp}</span>
                            <ArrowUpRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </a>
                          <button
                            type="button"
                            onClick={copyWhatsApp}
                            aria-label="Copy WhatsApp Number"
                            className="p-2.5 rounded-xl bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
                            title="Copy WhatsApp"
                          >
                            {whatsappCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#100C1A] border border-[#E7E2D8] dark:border-[#2D2340] relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                            <MessageCircle className="w-4 h-4 text-[#25D366]" />
                            <span>WhatsApp Channel</span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 font-bold">
                            <Lock className="w-2.5 h-2.5" /> Gated
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 select-none filter blur-xs text-sm sm:text-base font-mono font-bold text-stone-700 dark:text-stone-300">
                            <span>+91 79923 ••••••</span>
                          </div>
                          <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500 italic">
                            Inquiry required
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Email Channel Card */}
                    {isUnlocked ? (
                      <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-[#FF4D6D]/10 border border-[#FFD1DC] dark:border-[#FF4D6D]/30 transition-all shadow-xs">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FF4D6D] uppercase tracking-wider">
                            <Mail className="w-4 h-4" />
                            <span>Direct Email</span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-100 dark:bg-[#FF4D6D]/20 text-[#FF4D6D] font-bold">
                            Unlocked
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <a
                            href={`mailto:${directEmail}`}
                            onClick={() => soundFX.playSparkle()}
                            className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#18181B] dark:text-white hover:text-[#FF4D6D] dark:hover:text-[#FF4D6D] font-mono transition-colors group"
                          >
                            <span>{directEmail}</span>
                            <ArrowUpRight className="w-4 h-4 text-[#FF4D6D] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </a>
                          <button
                            type="button"
                            onClick={copyEmail}
                            aria-label="Copy Email address"
                            className="p-2.5 rounded-xl bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-[#FFD1DC] dark:border-[#FF4D6D]/30 transition-colors cursor-pointer"
                            title="Copy Email"
                          >
                            {emailCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#100C1A] border border-[#E7E2D8] dark:border-[#2D2340] relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                            <Mail className="w-4 h-4 text-[#FF4D6D]" />
                            <span>Official Email</span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 font-bold">
                            <Lock className="w-2.5 h-2.5" /> Gated
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 select-none filter blur-xs text-sm sm:text-base font-mono font-bold text-stone-700 dark:text-stone-300">
                            <span>Atulravi••••@gmail.com</span>
                          </div>
                          <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500 italic">
                            Inquiry required
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Anti-spam Gating Notice */}
                  {!isUnlocked && (
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                      <div className="leading-relaxed">
                        <strong className="font-semibold">Privacy &amp; Anti-Spam Gate:</strong> Submit the project inquiry form with valid details to unlock 1-click WhatsApp messaging and direct email access for 24 hours.
                      </div>
                    </div>
                  )}

                  {/* Social Channels */}
                  <div className="space-y-3 pt-6 border-t border-[#ECE7DF] dark:border-[#2D2340]">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-mono text-stone-500 dark:text-stone-400 uppercase tracking-wider font-bold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D]" />
                        Professional Profiles
                      </div>
                      <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500">
                        7 Networks
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
                            className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF8F5] dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 border border-[#E7E2D8] dark:border-stone-800 text-xs font-bold transition-all duration-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 ${item.hoverClass}`}
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

                {/* Right Column: 8-Field Inquiry Form OR Unlocked Celebration View */}
                <div className="lg:col-span-7 bg-[#FAF8F5] dark:bg-[#100C1A] p-6 sm:p-8 rounded-3xl border border-[#E4DFD5] dark:border-[#2D2340] relative">
                  
                  {isUnlocked ? (
                    /* UNLOCKED CELEBRATION VIEW */
                    <div className="space-y-6 text-center sm:text-left animate-in zoom-in-95 duration-300">
                      <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto sm:mx-0 mb-3 shadow-xs">
                          <Sparkles className="w-6 h-6 animate-pulse" />
                        </div>
                        <h4 className="text-xl sm:text-2xl font-black font-['Outfit',sans-serif] text-emerald-900 dark:text-emerald-100 mb-1">
                          Direct Contact Unlocked! 🎉
                        </h4>
                        <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
                          Thank you for submitting your project details{lastSubmittedData?.name ? `, ${lastSubmittedData.name}` : ''}. You now have full access to reach Atul directly on WhatsApp and personal email.
                        </p>
                      </div>

                      {/* Prominent Action Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* WhatsApp Action Card */}
                        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-800 flex flex-col justify-between space-y-3 shadow-xs">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                            <MessageCircle className="w-4 h-4 text-[#25D366]" />
                            <span>WhatsApp Priority</span>
                          </div>
                          <div>
                            <div className="text-base font-bold text-[#18181B] dark:text-white font-mono">
                              {formattedWhatsApp}
                            </div>
                            <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                              Pre-filled with your inquiry
                            </div>
                          </div>
                          <a
                            href={whatsAppLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => soundFX.playSparkle()}
                            className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Chat on WhatsApp</span>
                          </a>
                        </div>

                        {/* Email Action Card */}
                        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-pink-200 dark:border-[#FF4D6D]/30 flex flex-col justify-between space-y-3 shadow-xs">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FF4D6D] uppercase">
                            <Mail className="w-4 h-4" />
                            <span>Direct Email</span>
                          </div>
                          <div>
                            <div className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white font-mono truncate" title={directEmail}>
                              {directEmail}
                            </div>
                            <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                              Replies within 24 hours
                            </div>
                          </div>
                          <a
                            href={`mailto:${directEmail}`}
                            onClick={() => soundFX.playSparkle()}
                            className="w-full py-2.5 px-4 rounded-xl bg-[#18181B] hover:bg-black dark:bg-white dark:text-[#18181B] dark:hover:bg-stone-200 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
                          >
                            <Mail className="w-4 h-4" />
                            <span>Send Email</span>
                          </a>
                        </div>
                      </div>

                      {/* Reset / Submit Another Inquiry */}
                      <div className="pt-4 border-t border-[#ECE7DF] dark:border-[#2D2340] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <span className="text-stone-500 dark:text-stone-400 font-mono text-[11px]">
                          Direct access valid for 24 hours on this browser.
                        </span>
                        <button
                          type="button"
                          onClick={handleResetInquiry}
                          className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-[#18181B] dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors font-mono text-xs font-bold cursor-pointer"
                        >
                          Submit Another Inquiry
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* 8-FIELD COMPREHENSIVE INQUIRY FORM */
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-['Outfit',sans-serif] text-xl font-bold text-[#18181B] dark:text-[#F5F2F8]">
                          Project Inquiry Form
                        </h3>
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#FF4D6D]/10 text-[#FF4D6D] font-bold border border-[#FF4D6D]/20">
                          8 Fields &bull; Unlocks Direct Contact
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mb-5 leading-relaxed">
                        Fill out your project requirements. Upon submitting, direct WhatsApp &amp; email will unlock instantly.
                      </p>

                      {submitError && (
                        <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{submitError}</span>
                        </div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-3.5">
                        {/* Row 1: Name & Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label htmlFor="field-name" className="block text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300 mb-1">
                              YOUR NAME <span className="text-[#FF4D6D]">*</span>
                            </label>
                            <input
                              id="field-name"
                              type="text"
                              required
                              placeholder="e.g. Rahul Sharma"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5CB] dark:border-stone-700 bg-white dark:bg-stone-900/80 focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 text-xs outline-none transition-all text-[#18181B] dark:text-white dark:placeholder-stone-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="field-email" className="block text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300 mb-1">
                              EMAIL ADDRESS <span className="text-[#FF4D6D]">*</span>
                            </label>
                            <input
                              id="field-email"
                              type="email"
                              required
                              placeholder="rahul@enterprise.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5CB] dark:border-stone-700 bg-white dark:bg-stone-900/80 focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 text-xs outline-none transition-all text-[#18181B] dark:text-white dark:placeholder-stone-500"
                            />
                          </div>
                        </div>

                        {/* Row 2: WhatsApp Number & Company */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label htmlFor="field-whatsapp" className="block text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300 mb-1 flex items-center justify-between">
                              <span>WHATSAPP NUMBER <span className="text-[#FF4D6D]">*</span></span>
                              <span className="text-[10px] text-stone-400 font-normal">incl. country code</span>
                            </label>
                            <div className="relative">
                              <input
                                id="field-whatsapp"
                                type="tel"
                                required
                                placeholder="+91 98765 43210"
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#DCD5CB] dark:border-stone-700 bg-white dark:bg-stone-900/80 focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 text-xs outline-none transition-all text-[#18181B] dark:text-white dark:placeholder-stone-500 font-mono"
                              />
                              <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="field-company" className="block text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300 mb-1">
                              COMPANY / ORGANIZATION <span className="text-stone-400 font-normal">(Optional)</span>
                            </label>
                            <div className="relative">
                              <input
                                id="field-company"
                                type="text"
                                placeholder="FinCorp Pvt Ltd / Self"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#DCD5CB] dark:border-stone-700 bg-white dark:bg-stone-900/80 focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 text-xs outline-none transition-all text-[#18181B] dark:text-white dark:placeholder-stone-500"
                              />
                              <Building2 className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                            </div>
                          </div>
                        </div>

                        {/* Row 3: Role / Category & Budget */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label htmlFor="field-role" className="block text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300 mb-1 flex items-center gap-1.5">
                              <Briefcase className="w-3 h-3 text-[#FF4D6D]" />
                              <span>INQUIRY CATEGORY <span className="text-[#FF4D6D]">*</span></span>
                            </label>
                            <select
                              id="field-role"
                              required
                              value={formData.role}
                              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-xl border border-[#DCD5CB] dark:border-stone-700 bg-white dark:bg-stone-900 text-xs outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 text-[#18181B] dark:text-white cursor-pointer"
                            >
                              <option value="Taxation & Accounting">Taxation &amp; Accounting</option>
                              <option value="MIS & Data Analytics">MIS &amp; Data Analytics</option>
                              <option value="AI Software / Vibe Coding">AI Software / Vibe Coding</option>
                              <option value="Office Admin & Management">Office Admin &amp; Management</option>
                              <option value="Other / Custom">Other / Custom</option>
                            </select>
                          </div>

                          <div>
                            <label htmlFor="field-budget" className="block text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300 mb-1 flex items-center gap-1.5">
                              <DollarSign className="w-3 h-3 text-emerald-500" />
                              <span>ESTIMATED BUDGET <span className="text-stone-400 font-normal">(Optional)</span></span>
                            </label>
                            <select
                              id="field-budget"
                              value={formData.budget}
                              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-xl border border-[#DCD5CB] dark:border-stone-700 bg-white dark:bg-stone-900 text-xs outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 text-[#18181B] dark:text-white cursor-pointer"
                            >
                              <option value="Flexible / Open to Discuss">Flexible / Open to Discuss</option>
                              <option value="Under ₹25,000">Under ₹25,000</option>
                              <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                              <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                              <option value="₹1,00,000+ / Enterprise">₹1,00,000+ / Enterprise</option>
                              <option value="Hourly / Retainer">Hourly / Retainer</option>
                            </select>
                          </div>
                        </div>

                        {/* Row 4: Project Urgency */}
                        <div>
                          <label htmlFor="field-urgency" className="block text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300 mb-1 flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span>PROJECT TIMELINE / URGENCY <span className="text-stone-400 font-normal">(Optional)</span></span>
                          </label>
                          <select
                            id="field-urgency"
                            value={formData.urgency}
                            onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl border border-[#DCD5CB] dark:border-stone-700 bg-white dark:bg-stone-900 text-xs outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 text-[#18181B] dark:text-white cursor-pointer"
                          >
                            <option value="Normal (Within 1-2 weeks)">Normal (Within 1-2 weeks)</option>
                            <option value="Urgent / Immediate (1-3 days)">Urgent / Immediate (1-3 days)</option>
                            <option value="Flexible / Exploratory">Flexible / Exploratory</option>
                          </select>
                        </div>

                        {/* Row 5: Detailed Project Description */}
                        <div>
                          <label htmlFor="field-message" className="block text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300 mb-1">
                            PROJECT / WORK DETAILS <span className="text-[#FF4D6D]">*</span>
                          </label>
                          <textarea
                            id="field-message"
                            required
                            rows={3}
                            placeholder="Please outline the deliverables, current bottleneck, tools used, or specific goals..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5CB] dark:border-stone-700 bg-white dark:bg-stone-900/80 focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 text-xs outline-none transition-all text-[#18181B] dark:text-white dark:placeholder-stone-500 resize-none"
                          />
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3.5 rounded-xl bg-[#18181B] hover:bg-black dark:bg-white dark:text-[#18181B] dark:hover:bg-stone-200 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-70 disabled:pointer-events-none"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-[#FF4D6D]" />
                              <span>Submitting Inquiry &amp; Unlocking...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 text-[#FF4D6D]" />
                              <span>Submit Inquiry &amp; Unlock Direct WhatsApp</span>
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: LOCATION & OFFICE MAP (Full-width Interactive)    */}
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
              {/* Header Address Card with 1-Click Copy & Google Maps Action */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F5] dark:bg-[#100C1A] border border-[#E7E2D8] dark:border-[#2D2340] flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-2xs">
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
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold font-mono transition-all duration-200 cursor-pointer shadow-2xs active:scale-95 ${
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
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#18181B] hover:bg-black dark:bg-white dark:text-[#18181B] dark:hover:bg-stone-200 text-white text-xs font-bold font-mono transition-all duration-200 shadow-2xs hover:shadow-sm active:scale-95 group"
                  >
                    <span>View in Google Maps</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Interactive Map Box with Floating Controls Toolbar */}
              <div className="relative rounded-2xl overflow-hidden border border-[#E7E2D8] dark:border-stone-800 shadow-sm bg-stone-100 dark:bg-stone-900 group/map">
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
                {showIframe && (
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
