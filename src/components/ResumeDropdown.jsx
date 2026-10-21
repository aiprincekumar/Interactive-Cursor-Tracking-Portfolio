import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { FileText, Eye, Download, Copy, Check, ChevronDown, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/audio';
import { useRoleTab } from '../context/RoleContext.jsx';
import { useSimpleMode } from '../context/SimpleModeContext.jsx';
import { getResumeConfig } from '../utils/resumeConfig.js';
import { useAnnounce } from '../context/AnnouncerContext';
import { useLanguage } from '../context/LanguageContext';

export default function ResumeDropdown({
  soundEnabled = true,
  className = '',
  inDrawer = false,
  onActionComplete
}) {
  const { isHindi } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);
  const primaryButtonRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const itemRefs = useRef([]);

  let simpleContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    simpleContext = useSimpleMode();
  } catch {
    // In case ResumeDropdown is mounted outside SimpleModeProvider
  }
  const isSimpleMode = simpleContext?.isSimpleMode ?? false;
  const toggleSimpleMode = simpleContext?.toggleSimpleMode ?? (() => {});

  // Connect active role unconditionally from RoleContext
  const roleCtx = useRoleTab();
  const activeRole = roleCtx?.activeRole || 'accountant';

  let announce = null;
  try {
    const announcer = useAnnounce();
    announce = announcer?.announce;
  } catch {
    // fallback
  }

  // Active role-specific resume configuration
  const resumeConfig = useMemo(() => getResumeConfig(activeRole), [activeRole]);

  // Dynamic base URL handling for Vite GitHub Pages deployment
  const _BASE = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL ? import.meta.env.BASE_URL : '/';
  const _RESUME_FILE_PATH = resumeConfig.pdfPath;
  void _BASE;
  void _RESUME_FILE_PATH;

  const {
    pdfPath,
    downloadFilename,
    label,
    badge,
    accent,
    accentHover,
    accentActive,
    glowColor,
    confettiColors,
    getShareUrl
  } = resumeConfig;

  // Outside click & Escape key listeners
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        toggleButtonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus the first menu item when dropdown opens via keyboard/click
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        itemRefs.current[0]?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Roving ArrowUp / ArrowDown navigation for menuitems
  const handleMenuKeyDown = (e) => {
    const totalItems = 4;
    const currentIndex = itemRefs.current.indexOf(document.activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % totalItems;
      itemRefs.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = currentIndex < 0 ? totalItems - 1 : (currentIndex - 1 + totalItems) % totalItems;
      itemRefs.current[prevIndex]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      itemRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      itemRefs.current[totalItems - 1]?.focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      toggleButtonRef.current?.focus();
    } else if (e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  // Celebratory confetti burst originating from the primary button with role-specific colors
  const triggerConfetti = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let originX = 0.82;
    let originY = 0.15;

    const targetEl = primaryButtonRef.current || toggleButtonRef.current;
    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      originX = (rect.left + rect.width / 2) / window.innerWidth;
      originY = rect.bottom / window.innerHeight;
    }

    confetti({
      particleCount: 48,
      spread: 60,
      origin: { x: originX, y: originY },
      colors: confettiColors || [accent, '#FFAA00', '#2EC4B6', '#FFFFFF'],
      ticks: 180,
      gravity: 1.1,
      scalar: 0.9,
      disableForReducedMotion: true
    });
  }, [accent, confettiColors]);

  // Primary Action: Download PDF with confetti burst & chime
  const handleDownloadPdf = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    triggerConfetti();

    if (soundEnabled) {
      soundFX.playSparkle();
    }

    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (announce) {
      announce(`Downloading ${label} PDF resume`, 'polite');
    }

    setIsOpen(false);
    onActionComplete?.();
  };

  // Option 1: View Online in new tab
  const handleViewOnline = (e) => {
    e.stopPropagation();
    if (soundEnabled) soundFX.playFocusBeep();
    setIsOpen(false);
    onActionComplete?.();
    window.open(pdfPath, '_blank', 'noopener,noreferrer');
  };

  // Option 3: Copy Portfolio Link with Active Role query param or Native Share
  const handleCopyOrShare = async (e) => {
    e.stopPropagation();
    const shareUrl = getShareUrl();

    if (soundEnabled) soundFX.playFocusBeep();

    // Check if navigator.share is available and mobile friendly
    if (navigator.share && inDrawer) {
      try {
        await navigator.share({
          title: `Atul Verma - ${label}`,
          text: `Check out Atul Verma's ${label} (${badge})`,
          url: shareUrl
        });
        setIsOpen(false);
        onActionComplete?.();
        return;
      } catch {
        // Fall back to clipboard if user dismissed or share failed
      }
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Fallback silent fail
    }
  };

  // Option 4: Print Resume
  const handlePrintResume = (e) => {
    e.stopPropagation();
    if (soundEnabled) soundFX.playFocusBeep();
    setIsOpen(false);
    onActionComplete?.();

    try {
      // Create hidden iframe to trigger clean print dialog with active role PDF
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.src = pdfPath;

      let printTriggered = false;
      const doPrint = () => {
        if (printTriggered) return;
        printTriggered = true;
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch {
          // If cross-origin or PDF plugin restriction prevents iframe print, open window and print
          const printWindow = window.open(pdfPath, '_blank');
          printWindow?.focus();
          printWindow?.print?.();
        } finally {
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 60000);
        }
      };

      iframe.onload = doPrint;
      // Fallback timer: if iframe loading a binary PDF doesn't fire onload within 1200ms
      setTimeout(() => {
        if (!printTriggered) {
          doPrint();
        }
      }, 1200);

      document.body.appendChild(iframe);
    } catch {
      window.open(pdfPath, '_blank');
    }
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Split Button Container */}
      <div
        className={`inline-flex items-stretch shadow-xs transition-transform duration-150 ${
          inDrawer ? 'w-full' : ''
        }`}
        style={{
          boxShadow: `0 2px 10px -2px ${glowColor}`
        }}
      >
        {/* Left Primary Button: Direct Download PDF with dynamic label & role accent */}
        <button
          ref={primaryButtonRef}
          type="button"
          onClick={handleDownloadPdf}
          aria-label={`Download Atul Verma's ${label}`}
          title={`Download ${label} (${badge})`}
          style={{
            backgroundColor: accent
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = accentHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = accent;
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.backgroundColor = accentActive;
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.backgroundColor = accentHover;
          }}
          className={`flex items-center justify-center gap-1.5 text-white text-xs font-bold transition-all duration-150 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-1 select-none whitespace-nowrap ${
            inDrawer
              ? 'flex-1 py-2.5 px-4 rounded-l-xl text-sm'
              : 'px-3 py-1.5 rounded-l-full'
          }`}
        >
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span>{inDrawer ? label : (isHindi ? 'रिज्यूमे' : 'Resume')}</span>
        </button>

        {/* Vertical Divider */}
        <div className="w-[1px] bg-white/25 self-stretch shrink-0" aria-hidden="true" />

        {/* Right Arrow Button: Toggle Dropdown Options */}
        <button
          ref={toggleButtonRef}
          type="button"
          onClick={() => {
            const next = !isOpen;
            setIsOpen(next);
            if (soundEnabled) soundFX.playFocusBeep();
          }}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-label={`Toggle options for ${label}`}
          title={`More options for ${label}`}
          style={{
            backgroundColor: accent
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = accentHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = accent;
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.backgroundColor = accentActive;
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.backgroundColor = accentHover;
          }}
          className={`flex items-center justify-center text-white transition-all duration-150 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-1 shrink-0 ${
            inDrawer
              ? 'px-3.5 py-2.5 rounded-r-xl'
              : 'px-2 py-1.5 rounded-r-full'
          }`}
        >
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </button>
      </div>

      {/* Dropdown Menu Card with Dynamic Theming & 4 Role-Specific Options */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          onKeyDown={handleMenuKeyDown}
          style={{
            borderColor: `${accent}33`
          }}
          className={`absolute ${
            inDrawer
              ? 'left-0 right-0 top-full mt-2 w-full'
              : 'right-0 mt-2.5 w-68 origin-top-right'
          } bg-[#FAF8F5]/98 dark:bg-[#161122] backdrop-blur-xl rounded-2xl border dark:border-[#2D2340] p-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 focus:outline-hidden text-stone-200`}
        >
          {/* Header Label: Displays active role badge, tailored title, and PDF tag */}
          <div className="px-3 py-2 border-b border-[#E7E2D8]/70 dark:border-[#2D2340] mb-1 select-none flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: accent }}
                  aria-hidden="true"
                />
                <p className="text-[11px] font-bold text-[#18181B] dark:text-white truncate">{label}</p>
              </div>
              <p className="text-[9.5px] font-medium text-stone-500 dark:text-stone-400 pl-3.5 truncate">{badge}</p>
            </div>
            <span
              className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md border shrink-0"
              style={{
                backgroundColor: `${accent}15`,
                color: accent,
                borderColor: `${accent}30`
              }}
            >
              1 PAGE
            </span>
          </div>

          {/* Option 1: View in New Tab */}
          <button
            ref={(el) => {
              itemRefs.current[0] = el;
            }}
            type="button"
            role="menuitem"
            onClick={handleViewOnline}
            className="w-full flex items-center justify-between px-2.5 py-2 text-left rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-[#18181B] dark:hover:text-white hover:bg-white dark:hover:bg-stone-800/80 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors shrink-0 group-hover:text-white"
                style={{
                  '--hover-bg': accent
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = accent;
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                  e.currentTarget.style.color = '';
                }}
              >
                <Eye className="w-3.5 h-3.5" />
              </span>
              <div className="truncate">
                <p className="font-bold text-[#18181B] dark:text-white leading-tight">
                  {isHindi ? 'ऑनलाइन देखें' : 'View Online'}
                </p>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 font-normal leading-tight">
                  {isHindi ? 'सक्रिय PDF नए टैब में खोलें' : 'Open active PDF in new tab'}
                </p>
              </div>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold shrink-0 ml-2">
              {isHindi ? 'पूर्वावलोकन' : 'PREVIEW'}
            </span>
          </button>

          {/* Option 2: Download PDF (Role-tailored file + Confetti + Sparkle) */}
          <button
            ref={(el) => {
              itemRefs.current[1] = el;
            }}
            type="button"
            role="menuitem"
            onClick={handleDownloadPdf}
            className="w-full flex items-center justify-between px-2.5 py-2 text-left rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-[#18181B] dark:hover:text-white hover:bg-white dark:hover:bg-stone-800/80 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="p-1.5 rounded-lg text-white transition-colors shrink-0"
                style={{
                  backgroundColor: accent
                }}
              >
                <Download className="w-3.5 h-3.5" />
              </span>
              <div className="truncate">
                <p className="font-bold text-[#18181B] dark:text-white leading-tight">
                  {isHindi ? 'PDF डाउनलोड करें' : 'Download PDF'}
                </p>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 font-normal leading-tight">
                  {isHindi ? 'रोल-अनुरूप डॉसियर' : 'Role-tailored dossier'}
                </p>
              </div>
            </div>
            <span
              className="text-[9px] font-mono px-1.5 py-0.5 rounded-md font-bold shrink-0 ml-2"
              style={{
                backgroundColor: `${accent}20`,
                color: accent
              }}
            >
              PDF
            </span>
          </button>

          {/* Option 3: Copy Role Link / Share */}
          <button
            ref={(el) => {
              itemRefs.current[2] = el;
            }}
            type="button"
            role="menuitem"
            onClick={handleCopyOrShare}
            className="w-full flex items-center justify-between px-2.5 py-2 text-left rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-[#18181B] dark:hover:text-white hover:bg-white dark:hover:bg-stone-800/80 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                  copied
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </span>
              <div className="truncate">
                <p className="font-bold text-[#18181B] dark:text-white leading-tight">
                  {copied ? (isHindi ? 'लिंक कॉपी हुआ!' : 'Link Copied!') : (isHindi ? 'शेयर / लिंक कॉपी करें' : 'Share / Copy Link')}
                </p>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 font-normal leading-tight">
                  {copied ? (isHindi ? 'सक्रिय रोल के साथ तैयार' : 'Ready with active role') : `Share link with ?role=${activeRole}`}
                </p>
              </div>
            </div>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md font-bold shrink-0 ml-2 transition-colors ${
                copied
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 animate-in fade-in'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              {copied ? (isHindi ? 'कॉपी हुआ!' : 'COPIED!') : (isHindi ? 'शेयर' : 'SHARE')}
            </span>
          </button>

          {/* Option 5: Basic Overview (Simple Mode Toggle) */}
          <button
            ref={(el) => {
              itemRefs.current[3] = el;
            }}
            type="button"
            role="menuitem"
            onClick={() => {
              toggleSimpleMode();
              setIsOpen(false);
              if (soundEnabled) soundFX.playFocusBeep();
            }}
            className="w-full flex items-center justify-between px-2.5 py-2 text-left rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-[#18181B] dark:hover:text-white hover:bg-white dark:hover:bg-stone-800/80 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                  isSimpleMode
                    ? 'bg-[#FF4D6D] text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
              </span>
              <div className="truncate">
                <p className="font-bold text-[#18181B] dark:text-white leading-tight">
                  {isSimpleMode ? (isHindi ? 'इंटरएक्टिव मोड' : 'Interactive Mode') : (isHindi ? 'बेसिक अवलोकन (Basic Overview)' : 'Basic Overview')}
                </p>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 font-normal leading-tight">
                  {isSimpleMode ? (isHindi ? '3D/काइनेमैटिक्स दृश्य पर लौटें' : 'Switch to interactive 3D/kinematics') : (isHindi ? 'स्वच्छ और सरल दृश्य पर स्विच करें' : 'Toggle clean simple view')}
                </p>
              </div>
            </div>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md font-bold shrink-0 ml-2 transition-colors ${
                isSimpleMode
                  ? 'bg-[#FF4D6D]/15 text-[#FF4D6D] dark:bg-[#FF4D6D]/25'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              {isSimpleMode ? (isHindi ? 'सक्रिय' : 'ACTIVE') : (isHindi ? 'सरल' : 'SIMPLE')}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
