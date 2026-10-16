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
  Sparkles
} from 'lucide-react';
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

export default function ContactSection() {
  const [activeTab, setActiveTab] = useState('touch');
  const [emailCopied, setEmailCopied] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [zoom, setZoom] = useState(14);

  const tabButtonRefs = useRef({});
  const emailTimeoutRef = useRef(null);
  const addressTimeoutRef = useRef(null);

  const email = 'Atulravi2015@gmail.com';
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

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (emailTimeoutRef.current) clearTimeout(emailTimeoutRef.current);
      if (addressTimeoutRef.current) clearTimeout(addressTimeoutRef.current);
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
      navigator.clipboard.writeText(email).then(notifySuccess).catch(() => {
        fallbackCopyText(email);
        notifySuccess();
      });
    } else {
      fallbackCopyText(email);
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
    setZoom((prev) => {
      const next = Math.min(18, prev + 1);
      soundFX.playChipHover();
      return next;
    });
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(11, prev - 1);
      soundFX.playChipHover();
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoom(14);
    soundFX.playFocusBeep();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    soundFX.playShutter();
    setFormSubmitted(true);
  };

  const mapEmbedUrl = `https://maps.google.com/maps?q=Daltonganj%2C%20Medininagar%2C%20Palamau%2C%20Jharkhand%20822101&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="contact" className="py-24 px-4 md:px-8 max-w-5xl mx-auto scroll-mt-28">
      <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-14 border border-[#E7E2D8] shadow-xl shadow-stone-900/5 relative overflow-hidden">
        {/* Soft background ambient light */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FF4D6D]/8 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Section Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E7E2D8] text-[#18181B] text-xs font-bold uppercase tracking-wider mb-8 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />
          06 ✦ Contact &bull; Inquiries &amp; HQ
        </div>

        {/* Horizontal 2-Tab Switcher Ribbon */}
        <div 
          role="tablist" 
          aria-label="Contact and location tabs"
          aria-orientation="horizontal"
          onKeyDown={handleKeyDown}
          className="flex p-1.5 bg-[#FAF8F5] rounded-2xl border border-[#ECE7DF] gap-1.5 mb-8 overflow-x-auto no-scrollbar"
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
                    ? 'bg-white text-[#18181B] shadow-sm border border-[#E7E2D8]'
                    : 'text-stone-600 hover:text-[#18181B] hover:bg-white/60'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors shrink-0 ${isActive ? 'text-[#FF4D6D]' : 'text-stone-400'}`} />
                <span className="truncate whitespace-nowrap">{tab.label}</span>
                {isActive && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 bg-[#FFF0F3] border border-[#FFD1DC] text-[#FF4D6D]">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* TAB 1: GET IN TOUCH (Contact Form & Direct Channels)     */}
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
              {/* Left Column: Giant Display Typography & Channels */}
              <div className="lg:col-span-7">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#18181B] tracking-tight font-['Outfit',sans-serif] leading-[1.08] mb-6">
                  Let's build<br />
                  something<br />
                  <span className="text-[#FF4D6D]">meaningful</span>.
                </h2>

                <p className="text-stone-600 text-sm sm:text-base max-w-md font-normal leading-relaxed mb-8">
                  Have a role, a project, or a question about my work? Email is the quickest way to reach me.
                </p>

                {/* Hot Pink Email Pill CTA */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#FF4D6D] hover:bg-[#E03554] text-white font-bold text-xs sm:text-sm tracking-wide shadow-xl shadow-pink-600/30 transition-all duration-200 active:scale-95 group"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{email}</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  <button
                    type="button"
                    onClick={copyEmail}
                    aria-label="Copy email address"
                    className="p-3.5 rounded-full bg-[#FAF8F5] hover:bg-stone-200 text-stone-700 border border-[#E7E2D8] transition-colors cursor-pointer"
                    title="Copy Email"
                  >
                    {emailCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Social Channels */}
                <div className="space-y-3.5 pt-6 border-t border-[#ECE7DF]">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-mono text-stone-500 uppercase tracking-wider font-bold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D]" />
                      Connect Directly
                    </div>
                    <span className="text-[11px] font-mono text-stone-400">
                      7 Channels
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
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
                          className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF8F5] text-stone-700 border border-[#E7E2D8] text-xs font-bold transition-all duration-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 ${item.hoverClass}`}
                        >
                          <Icon className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
                          <span>{item.name}</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Direct Message Box */}
              <div className="lg:col-span-5 bg-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-[#E4DFD5]">
                <h3 className="font-['Outfit',sans-serif] text-xl font-bold text-[#18181B] mb-1">
                  Send a Quick Note
                </h3>
                <p className="text-xs text-stone-500 mb-5">
                  Replies typically dispatched within 24 hours.
                </p>

                {formSubmitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center animate-in zoom-in-95">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2 text-emerald-600">
                      <Check className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-sm">Message Sent!</div>
                    <div className="text-xs text-emerald-700 mt-1">Thank you for reaching out, Atul will respond shortly!</div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div>
                      <label htmlFor="contact-name" className="block text-[11px] font-mono font-bold text-stone-600 mb-1">NAME</label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="Alex Rivera"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5CB] bg-white focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 text-xs outline-none transition-all text-[#18181B]"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-[11px] font-mono font-bold text-stone-600 mb-1">EMAIL</label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="alex@enterprise.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5CB] bg-white focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 text-xs outline-none transition-all text-[#18181B]"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-[11px] font-mono font-bold text-stone-600 mb-1">MESSAGE</label>
                      <textarea
                        id="contact-message"
                        required
                        rows={4}
                        placeholder="Tell me about your idea, role, or challenge..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5CB] bg-white focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 text-xs outline-none transition-all text-[#18181B] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#18181B] hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </button>
                  </form>
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
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F5] border border-[#E7E2D8] flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-2xs">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF0F3] border border-[#FFD1DC] flex items-center justify-center text-[#FF4D6D] shrink-0 shadow-2xs">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-stone-500 uppercase tracking-wider font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D]" />
                    Location &amp; Headquarters
                  </div>
                  <p className="text-sm sm:text-base font-bold text-[#18181B] mt-0.5 leading-snug">
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
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border-[#E7E2D8]'
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
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#18181B] hover:bg-black text-white text-xs font-bold font-mono transition-all duration-200 shadow-2xs hover:shadow-sm active:scale-95 group"
                >
                  <span>View in Google Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Interactive Map Box with Floating Controls Toolbar */}
            <div className="relative rounded-2xl overflow-hidden border border-[#E7E2D8] shadow-sm bg-stone-100 group/map">
              {/* Floating Map Controls Toolbar (Top-Right) */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-md rounded-xl border border-[#E7E2D8] shadow-md transition-all">
                {/* Current Zoom Level Badge */}
                <div className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#ECE7DF] text-[11px] font-mono font-bold text-stone-700 flex items-center gap-1 select-none">
                  <span className="text-stone-400">Zoom</span>
                  <span className="text-[#FF4D6D]">{zoom}x</span>
                </div>

                {/* Zoom In Button */}
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoom >= 18}
                  aria-label="Zoom in map"
                  title="Zoom In"
                  className="p-1.5 rounded-lg text-stone-700 hover:text-[#18181B] hover:bg-stone-100 active:scale-90 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                {/* Zoom Out Button */}
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoom <= 11}
                  aria-label="Zoom out map"
                  title="Zoom Out"
                  className="p-1.5 rounded-lg text-stone-700 hover:text-[#18181B] hover:bg-stone-100 active:scale-90 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                {/* Reset Zoom Button */}
                <button
                  type="button"
                  onClick={handleResetZoom}
                  aria-label="Reset map zoom"
                  title="Reset Zoom to 14x"
                  className="p-1.5 rounded-lg text-stone-700 hover:text-[#FF4D6D] hover:bg-pink-50 active:scale-90 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Map Iframe */}
              <iframe
                title="Office Location Map - Daltonganj, Medininagar, Jharkhand"
                src={mapEmbedUrl}
                key={`map-zoom-${zoom}`}
                className="w-full h-80 sm:h-96 md:h-[450px] rounded-2xl block"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Travel / Directions Highlight Note */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#ECE7DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-2.5 font-medium">
                <Navigation className="w-4 h-4 text-[#FF4D6D] shrink-0" />
                <span>Palamu District Hub &bull; 5 mins from Medininagar Railway Station (DTO)</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-stone-500 font-mono text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Open for in-person consultation by appointment</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
