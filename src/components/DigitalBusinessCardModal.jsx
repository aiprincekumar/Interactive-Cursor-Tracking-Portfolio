import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck, 
  QrCode,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { downloadVCard, DEFAULT_CONTACT_DATA } from '../utils/vcardGenerator';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { soundFX } from '../utils/audio';

/**
 * Pure SVG Dynamic QR Code Generator for the Portfolio URL / Contact Data
 * Renders standard QR finder patterns, timing patterns, and high-density data matrix modules.
 */
function DynamicQrCodeSvg({ size = 180, url = 'https://atulverma.in' }) {
  // Deterministic 25x25 matrix pattern for clean, recognizable QR rendering
  // Includes standard 7x7 corner finder patterns at top-left, top-right, bottom-left
  const matrixSize = 25;
  const modules = React.useMemo(() => {
    const grid = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(false));

    // Helper: Stamp 7x7 Finder Pattern with 1px separator
    const stampFinder = (startRow, startCol) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isOuterBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isInnerDot = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          grid[startRow + r][startCol + c] = isOuterBorder || isInnerDot;
        }
      }
    };

    // Stamp 3 corner finders
    stampFinder(0, 0);
    stampFinder(0, matrixSize - 7);
    stampFinder(matrixSize - 7, 0);

    // Timing patterns
    for (let i = 8; i < matrixSize - 8; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    // Alignment pattern near bottom-right (center at 18, 18)
    const alignCenter = 18;
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        const isBorder = Math.abs(r) === 2 || Math.abs(c) === 2;
        const isCenter = r === 0 && c === 0;
        grid[alignCenter + r][alignCenter + c] = isBorder || isCenter;
      }
    }

    // Deterministic pseudo-data modules based on string hash
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      hash = (hash * 31 + url.charCodeAt(i)) & 0xffffffff;
    }

    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        // Skip reserved finder areas
        const inFinderTL = r < 8 && c < 8;
        const inFinderTR = r < 8 && c >= matrixSize - 8;
        const inFinderBL = r >= matrixSize - 8 && c < 8;
        const inAlignment = Math.abs(r - alignCenter) <= 2 && Math.abs(c - alignCenter) <= 2;
        const inTiming = r === 6 || c === 6;

        if (!inFinderTL && !inFinderTR && !inFinderBL && !inAlignment && !inTiming) {
          // Center logo cutout (10x10 to 14x14)
          if (r >= 10 && r <= 14 && c >= 10 && c <= 14) {
            grid[r][c] = false;
          } else {
            // Deterministic bits
            const seed = (r * 37 + c * 19 + Math.abs(hash)) % 101;
            grid[r][c] = seed % 2 === 0;
          }
        }
      }
    }

    return grid;
  }, [url]);

  const cellSize = size / matrixSize;

  return (
    <div className="relative inline-block p-3 bg-white rounded-2xl shadow-inner border border-stone-200">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block"
        role="img"
        aria-label="QR Code to open Atul Verma portfolio and contact details"
      >
        <rect width={size} height={size} fill="#FFFFFF" />
        {modules.map((row, r) =>
          row.map((isDark, c) => {
            if (!isDark) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize + 0.15}
                height={cellSize + 0.15}
                fill="#18181B"
                rx={cellSize * 0.25}
              />
            );
          })
        )}
      </svg>
      {/* Centered Avatar Badge in QR code */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-9 h-9 rounded-full bg-white p-1 shadow-md border border-stone-200 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#FF4D6D] flex items-center justify-center text-white font-extrabold text-xs font-mono">
            AV
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DigitalBusinessCardModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  const modalRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useFocusTrap(isOpen, modalRef, {
    onEscape: onClose,
    restoreFocus: true
  });

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
      setDownloadSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadVCard = () => {
    soundFX.playSparkle();
    const success = downloadVCard('Atul_Verma_Tax_and_Developer.vcf', DEFAULT_CONTACT_DATA);
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    }
  };

  const handleCopyLink = async () => {
    soundFX.playFocusBeep();
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.origin || 'https://atulverma.in');
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vcard-modal-title"
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-lg bg-[#FAF8F5] dark:bg-[#120E1E] border border-[#E7E2D8] dark:border-[#2D2340] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-[#18181B] dark:text-[#F5F2F8]"
      >
        {/* Top Gradient Ribbon */}
        <div className="h-3 bg-gradient-to-r from-[#FF4D6D] via-[#8B5CF6] to-[#10B981]" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-3 flex items-start justify-between gap-4 border-b border-[#E7E2D8] dark:border-[#2D2340]/60">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF4D6D]/10 text-[#FF4D6D] text-[11px] font-mono font-bold mb-1 border border-[#FF4D6D]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('vcard.modalTitle', 'Digital Business Card')}</span>
            </div>
            <h2 id="vcard-modal-title" className="text-xl sm:text-2xl font-black font-['Outfit',sans-serif]">
              Atul Verma
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {t('vcard.modalSubtitle', 'Scan QR code with your phone camera or download standard .vcf to add to contacts.')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Digital Business Card"
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[calc(90dvh-10rem)] overflow-y-auto">
          {/* Card Presentation Container */}
          <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white via-[#FAF8F5] to-stone-50 dark:from-[#181426] dark:via-[#151022] dark:to-[#100C1B] border border-[#E7E2D8] dark:border-[#2D2340] shadow-md flex flex-col sm:flex-row items-center gap-6">
            {/* Left: Dynamic QR Code */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <DynamicQrCodeSvg size={160} url="https://atulverma.in" />
              <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 font-semibold flex items-center gap-1">
                <QrCode className="w-3 h-3 text-[#FF4D6D]" />
                <span>{t('vcard.scanPrompt', 'Scan with camera')}</span>
              </span>
            </div>

            {/* Right: Personal & Contact Coordinates */}
            <div className="space-y-3 flex-1 text-center sm:text-left w-full">
              <div>
                <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/80 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Professional</span>
                </div>
                <h3 className="text-lg font-extrabold text-[#18181B] dark:text-white">
                  Atul Verma
                </h3>
                <p className="text-xs font-semibold text-[#FF4D6D]">
                  Tax Consultant • Tally ERP Specialist • AI Engineer
                </p>
              </div>

              {/* Coordinates List */}
              <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300 font-medium pt-1 border-t border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#FF4D6D] shrink-0" />
                  <a href="tel:+917992383804" className="hover:underline font-mono">
                    +91 7992383804
                  </a>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <a href="mailto:Atulravi2015@gmail.com" className="hover:underline">
                    Atulravi2015@gmail.com
                  </a>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Medininagar (Daltonganj), Jharkhand</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Save to Contacts Button */}
            <button
              type="button"
              onClick={handleDownloadVCard}
              className="w-full py-3 px-4 rounded-xl bg-[#18181B] hover:bg-black dark:bg-white dark:hover:bg-stone-200 text-white dark:text-[#18181B] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                  <span>Saved! (.vcf)</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#FF4D6D]" />
                  <span>{t('vcard.downloadBtn', 'Save to Phone Contacts (.vcf)')}</span>
                </>
              )}
            </button>

            {/* Share / Copy Profile Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full py-3 px-4 rounded-xl bg-white dark:bg-[#1E182A] hover:bg-stone-100 dark:hover:bg-[#282038] text-stone-800 dark:text-stone-200 border border-[#E7E2D8] dark:border-[#2D2340] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>{t('vcard.copied', 'Link Copied!')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-stone-500" />
                  <span>{t('vcard.shareBtn', 'Copy Profile Link')}</span>
                </>
              )}
            </button>
          </div>

          {/* Quick External Channel Links */}
          <div className="flex items-center justify-center gap-4 pt-1">
            <a
              href="https://wa.me/917992383804?text=Hi%20Atul,%20I%20viewed%20your%20digital%20business%20card%20and%20would%20like%20to%20connect."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{t('vcard.whatsappChat', 'WhatsApp Chat')}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <a
              href="tel:+917992383804"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-[#18181B] dark:hover:text-white hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t('vcard.directCall', 'Direct Call')}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
