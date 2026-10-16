import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FileText, Eye, Download, Copy, Check, ChevronDown, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/audio';

export default function ResumeDropdown({ soundEnabled = true, className = '', inDrawer = false, onActionComplete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const RESUME_FILE_PATH = '/resume.pdf';
  const DOWNLOAD_FILENAME = 'Atul_Verma_Resume.pdf';

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
        buttonRef.current?.focus();
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

  // Celebratory confetti burst originating from the button
  const triggerConfetti = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let originX = 0.82;
    let originY = 0.15;

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      originX = (rect.left + rect.width / 2) / window.innerWidth;
      originY = rect.bottom / window.innerHeight;
    }

    confetti({
      particleCount: 48,
      spread: 60,
      origin: { x: originX, y: originY },
      colors: ['#FF4D6D', '#FFAA00', '#2EC4B6', '#FF85A1', '#FFD166'],
      ticks: 180,
      gravity: 1.1,
      scalar: 0.9,
      disableForReducedMotion: true
    });
  }, []);

  // Action 1: View Online in new tab
  const handleViewOnline = (e) => {
    e.stopPropagation();
    if (soundEnabled) soundFX.playFocusBeep();
    setIsOpen(false);
    onActionComplete?.();
    window.open(RESUME_FILE_PATH, '_blank', 'noopener,noreferrer');
  };

  // Action 2: Download PDF with confetti burst & sparkle chime
  const handleDownloadPdf = (e) => {
    e.stopPropagation();
    triggerConfetti();

    if (soundEnabled) {
      soundFX.playSparkle();
    }

    const link = document.createElement('a');
    link.href = RESUME_FILE_PATH;
    link.download = DOWNLOAD_FILENAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsOpen(false);
    onActionComplete?.();
  };

  // Action 3: Copy Resume Link to clipboard
  const handleCopyLink = async (e) => {
    e.stopPropagation();
    const fullResumeUrl = `${window.location.origin}${RESUME_FILE_PATH}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullResumeUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = fullResumeUrl;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setCopied(true);
      if (soundEnabled) soundFX.playFocusBeep();

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Fallback silent fail
    }
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Coral Resume Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          const next = !isOpen;
          setIsOpen(next);
          if (soundEnabled) soundFX.playFocusBeep();
        }}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Resume options menu"
        className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF4D6D] hover:bg-[#E03554] text-white text-xs font-bold shadow-xs transition-all duration-200 active:scale-95 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 ${
          inDrawer ? 'w-full py-2.5 text-sm rounded-xl' : ''
        }`}
      >
        <FileText className="w-3.5 h-3.5 shrink-0" />
        <span>Resume</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>

      {/* Dropdown Menu Card */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={`absolute ${
            inDrawer ? 'left-0 right-0 top-full mt-2 w-full' : 'right-0 mt-2.5 w-60 origin-top-right'
          } bg-[#FAF8F5]/98 backdrop-blur-xl rounded-2xl border border-[#E7E2D8] p-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 focus:outline-hidden`}
        >
          {/* Header Label */}
          <div className="px-3 py-1.5 text-[10px] font-bold text-stone-500 uppercase tracking-wider border-b border-[#E7E2D8]/70 mb-1 select-none">
            Atul Verma &bull; Resume
          </div>

          {/* Action 1: View Online */}
          <button
            type="button"
            role="menuitem"
            onClick={handleViewOnline}
            className="w-full flex items-center justify-between px-3 py-2 text-left rounded-xl text-xs font-semibold text-stone-700 hover:text-[#18181B] hover:bg-white transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded-lg bg-stone-100 text-stone-600 group-hover:bg-[#FF4D6D]/10 group-hover:text-[#FF4D6D] transition-colors">
                <Eye className="w-3.5 h-3.5" />
              </span>
              <div>
                <p className="font-bold text-[#18181B]">View Online</p>
                <p className="text-[10px] text-stone-500 font-normal">Open in new tab</p>
              </div>
            </div>
            <ExternalLink className="w-3 h-3 text-stone-400 group-hover:text-stone-700 transition-colors" />
          </button>

          {/* Action 2: Download PDF (Confetti + Chime) */}
          <button
            type="button"
            role="menuitem"
            onClick={handleDownloadPdf}
            className="w-full flex items-center justify-between px-3 py-2 text-left rounded-xl text-xs font-semibold text-stone-700 hover:text-[#18181B] hover:bg-white transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded-lg bg-rose-50 text-[#FF4D6D] group-hover:bg-[#FF4D6D] group-hover:text-white transition-colors">
                <Download className="w-3.5 h-3.5" />
              </span>
              <div>
                <p className="font-bold text-[#18181B]">Download PDF</p>
                <p className="text-[10px] text-stone-500 font-normal">Confetti & chime celebration</p>
              </div>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-rose-100 text-[#FF4D6D] font-bold">
              PDF
            </span>
          </button>

          {/* Action 3: Copy Resume Link */}
          <button
            type="button"
            role="menuitem"
            onClick={handleCopyLink}
            className="w-full flex items-center justify-between px-3 py-2 text-left rounded-xl text-xs font-semibold text-stone-700 hover:text-[#18181B] hover:bg-white transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`p-1 rounded-lg transition-colors ${
                  copied
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-stone-100 text-stone-600 group-hover:bg-[#FF4D6D]/10 group-hover:text-[#FF4D6D]'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </span>
              <div>
                <p className="font-bold text-[#18181B]">
                  {copied ? 'Link Copied!' : 'Copy Link'}
                </p>
                <p className="text-[10px] text-stone-500 font-normal">
                  {copied ? 'Ready to share' : 'Direct link to clipboard'}
                </p>
              </div>
            </div>
            {copied && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 animate-in fade-in">
                Copied!
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
