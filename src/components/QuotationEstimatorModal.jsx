import React, { useState, useId, useMemo, useRef, useEffect } from 'react';
import { 
  X, 
  Calculator, 
  Clock, 
  CheckCircle2, 
  MessageCircle, 
  ArrowRight, 
  Sparkles, 
  Receipt, 
  Database, 
  Cpu, 
  Layers,
  Zap,
  Calendar
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { soundFX } from '../utils/audio';

// Scope options per track
const TRACK_OPTIONS = {
  accounting: {
    id: 'accounting',
    labelKey: 'estimator.trackAccounting',
    defaultLabel: 'Accounting & Tax Advisory',
    icon: Receipt,
    accent: '#FF4D6D',
    minBase: 4500,
    maxBase: 8000,
    services: [
      { id: 'gst', label: 'GST Return Filing (GSTR-1, 3B, 2B Reconciliation)', defaultChecked: true, cost: 2500 },
      { id: 'itr', label: 'Income Tax E-Filing (ITR-1 to 4 & Tax Planning)', defaultChecked: true, cost: 2000 },
      { id: 'tally', label: 'Tally Prime / ERP Multi-Company Setup & BRS', defaultChecked: true, cost: 3000 },
      { id: 'audit', label: 'Balance Sheet, P&L & Audit Readiness Dossier', defaultChecked: false, cost: 4500 }
    ]
  },
  mis: {
    id: 'mis',
    labelKey: 'estimator.trackMis',
    defaultLabel: 'MIS & Data Operations',
    icon: Database,
    accent: '#3B82F6',
    minBase: 5000,
    maxBase: 9000,
    services: [
      { id: 'macro', label: 'MS Excel VBA / Macro Automation & Pipelines', defaultChecked: true, cost: 3500 },
      { id: 'govt', label: 'DAY-NULM / Government Skill Portal Reporting', defaultChecked: true, cost: 3000 },
      { id: 'cleaning', label: 'Large Dataset Reconciliation & Cleaning (10k+ rows)', defaultChecked: true, cost: 2500 },
      { id: 'powerbi', label: 'Power BI Executive KPI Dashboard & Telemetry', defaultChecked: false, cost: 4000 }
    ]
  },
  ai_web: {
    id: 'ai_web',
    labelKey: 'estimator.trackAi',
    defaultLabel: 'AI & Web Engineering',
    icon: Cpu,
    accent: '#8B5CF6',
    minBase: 22000,
    maxBase: 35000,
    services: [
      { id: 'mvp', label: 'Full-Stack Next.js / React SaaS MVP Prototype', defaultChecked: true, cost: 18000 },
      { id: 'agents', label: 'Autonomous Multi-Agent LLM Workflow Engine', defaultChecked: true, cost: 14000 },
      { id: 'api', label: 'Production REST API, Auth & PostgreSQL DB Integration', defaultChecked: true, cost: 8000 },
      { id: 'design', label: 'High-Fidelity Tailwind CSS & UI/UX Interactions', defaultChecked: false, cost: 6000 }
    ]
  }
};

export default function QuotationEstimatorModal({ isOpen, onClose }) {
  const { t, isHindi } = useLanguage();
  const modalRef = useRef(null);

  const [activeTrack, setActiveTrack] = useState('accounting');
  const [selectedServices, setSelectedServices] = useState({
    accounting: ['gst', 'itr', 'tally'],
    mis: ['macro', 'govt', 'cleaning'],
    ai_web: ['mvp', 'agents', 'api']
  });

  const [voucherVolume, setVoucherVolume] = useState(250); // 50 to 2000+
  const [urgency, setUrgency] = useState('standard'); // 'standard' | 'express'
  const [model, setModel] = useState('retainer'); // 'retainer' | 'onetime'

  const volumeSliderId = useId();
  const urgencySelectId = useId();
  const modelSelectId = useId();

  useFocusTrap(isOpen, modalRef, {
    onEscape: onClose,
    restoreFocus: true
  });

  // Toggle a service inside current track
  const toggleService = (trackId, serviceId) => {
    soundFX.playChipHover();
    setSelectedServices((prev) => {
      const current = prev[trackId] || [];
      const updated = current.includes(serviceId)
        ? current.filter((id) => id !== serviceId)
        : [...current, serviceId];
      return { ...prev, [trackId]: updated };
    });
  };

  // Pricing & Timeline calculation
  const calculation = useMemo(() => {
    const track = TRACK_OPTIONS[activeTrack];
    const currentServices = selectedServices[activeTrack] || [];

    // Sum service costs
    const servicesCost = track.services
      .filter((s) => currentServices.includes(s.id))
      .reduce((sum, s) => sum + s.cost, 0);

    // Volume multiplier
    let volumeMultiplier = 1.0;
    if (activeTrack === 'accounting') {
      volumeMultiplier = 0.8 + (voucherVolume / 500) * 0.4;
    } else if (activeTrack === 'mis') {
      volumeMultiplier = 0.85 + (voucherVolume / 600) * 0.35;
    } else {
      volumeMultiplier = 0.9 + (voucherVolume / 800) * 0.3;
    }

    // Urgency multiplier
    const urgencyMultiplier = urgency === 'express' ? 1.35 : 1.0;

    // Model adjustment: monthly retainer gets ~20% discount on monthly commitment
    const modelMultiplier = model === 'retainer' ? 0.82 : 1.0;

    const baseMin = (track.minBase + servicesCost * 0.8) * volumeMultiplier * urgencyMultiplier * modelMultiplier;
    const baseMax = (track.maxBase + servicesCost * 1.15) * volumeMultiplier * urgencyMultiplier * modelMultiplier;

    // Round to nearest 500
    const roundedMin = Math.round(baseMin / 500) * 500;
    const roundedMax = Math.round(baseMax / 500) * 500;

    // Delivery timeline
    let timelineText = '';
    if (urgency === 'express') {
      timelineText = activeTrack === 'ai_web' ? '5–7 Business Days (Express Sprint)' : '48–72 Hours (Express Priority)';
    } else {
      timelineText = activeTrack === 'ai_web' ? '2–3 Weeks (Standard Iteration)' : '7–10 Business Days (Standard)';
    }

    if (model === 'retainer') {
      timelineText += ' • Ongoing Monthly Support';
    }

    return {
      minPrice: Math.max(roundedMin, 2500),
      maxPrice: Math.max(roundedMax, 4000),
      timelineText,
      serviceCount: currentServices.length
    };
  }, [activeTrack, selectedServices, voucherVolume, urgency, model]);

  if (!isOpen) return null;

  // Format currency in Indian numbering format
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleSendToWhatsApp = () => {
    soundFX.playSparkle();
    const trackName = t(TRACK_OPTIONS[activeTrack].labelKey, TRACK_OPTIONS[activeTrack].defaultLabel);
    const priceRange = `${formatINR(calculation.minPrice)} – ${formatINR(calculation.maxPrice)}`;
    const modelLabel = model === 'retainer' ? 'Monthly Retainer' : 'One-Time Project';
    const urgencyLabel = urgency === 'express' ? 'Express (48-72h)' : 'Standard';

    const currentServicesList = TRACK_OPTIONS[activeTrack].services
      .filter((s) => (selectedServices[activeTrack] || []).includes(s.id))
      .map((s) => `• ${s.label}`)
      .join('%0A');

    const message = `*Service Fee Quotation Request*%0A%0A` +
      `*Domain Track:* ${trackName}%0A` +
      `*Engagement Model:* ${modelLabel}%0A` +
      `*Monthly Volume:* ~${voucherVolume} transactions/records%0A` +
      `*Speed / Urgency:* ${urgencyLabel}%0A` +
      `*Estimated Fee:* ${priceRange}${model === 'retainer' ? ' / month' : ''}%0A` +
      `*Timeline:* ${calculation.timelineText}%0A%0A` +
      `*Selected Services:*%0A${currentServicesList}%0A%0A` +
      `Hi Atul, I configured this quotation on your portfolio and would like to proceed with the next steps.`;

    const whatsappUrl = `https://wa.me/917992383804?text=${message}`;
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handlePrefillContactForm = () => {
    soundFX.playFocusBeep();
    const trackName = t(TRACK_OPTIONS[activeTrack].labelKey, TRACK_OPTIONS[activeTrack].defaultLabel);
    const priceRange = `${formatINR(calculation.minPrice)} – ${formatINR(calculation.maxPrice)}${model === 'retainer' ? '/mo' : ''}`;
    
    // Map track to contact form role dropdown
    let mappedRole = 'Taxation & Accounting';
    if (activeTrack === 'mis') mappedRole = 'MIS & Data Analytics';
    if (activeTrack === 'ai_web') mappedRole = 'AI Software / Vibe Coding';

    // Map price to contact form budget
    let mappedBudget = 'Flexible / Open to Discuss';
    if (calculation.maxPrice <= 25000) mappedBudget = 'Under ₹25,000';
    else if (calculation.maxPrice <= 50000) mappedBudget = '₹25,000 - ₹50,000';
    else mappedBudget = 'Flexible / Open to Discuss';

    const selectedServiceNames = TRACK_OPTIONS[activeTrack].services
      .filter((s) => (selectedServices[activeTrack] || []).includes(s.id))
      .map((s) => s.label)
      .join(', ');

    const prefillData = {
      role: mappedRole,
      budget: mappedBudget,
      timeline: urgency === 'express' ? 'Immediate / Urgent' : 'Within 1-2 Weeks',
      message: `[Quotation from Estimator]\nDomain: ${trackName}\nModel: ${model === 'retainer' ? 'Monthly Retainer' : 'One-Time Project'}\nVolume: ~${voucherVolume} items\nEstimated Fee: ${priceRange}\nScope: ${selectedServiceNames}`
    };

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('portfolio:prefill-contact', { detail: prefillData }));
      window.dispatchEvent(new CustomEvent('switch-contact-tab', { detail: { tab: 'touch' } }));
    }

    onClose();

    // Smooth scroll to contact section
    setTimeout(() => {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="estimator-modal-title"
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-2xl bg-[#FAF8F5] dark:bg-[#120E1E] border border-[#E7E2D8] dark:border-[#2D2340] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-[#18181B] dark:text-[#F5F2F8] max-h-[92dvh] flex flex-col"
      >
        {/* Top Gradient Ribbon */}
        <div className="h-2.5 bg-gradient-to-r from-[#FF4D6D] via-[#3B82F6] to-[#8B5CF6]" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 pb-3 flex items-start justify-between gap-4 border-b border-[#E7E2D8] dark:border-[#2D2340]/60 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF4D6D]/10 text-[#FF4D6D] text-[11px] font-mono font-bold mb-1 border border-[#FF4D6D]/20">
              <Calculator className="w-3.5 h-3.5" />
              <span>{t('estimator.title', 'Service Fee & Project Cost Estimator')}</span>
            </div>
            <h2 id="estimator-modal-title" className="text-lg sm:text-xl font-black font-['Outfit',sans-serif]">
              {isHindi ? 'पारदर्शी सेवा शुल्क एवं समय-सीमा आगणक' : 'Instant Cost & Timeline Calculator'}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {t('estimator.subtitle', 'Get an instant, transparent fee quotation with estimated delivery timelines tailored to your scope.')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('estimator.closeModal', 'Close Estimator')}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-4 sm:p-5 space-y-5 overflow-y-auto flex-1">
          {/* Track Switcher Tabs (3 Tracks) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {Object.values(TRACK_OPTIONS).map((track) => {
              const Icon = track.icon;
              const isSelected = activeTrack === track.id;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => {
                    setActiveTrack(track.id);
                    soundFX.playChipHover();
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-white dark:bg-[#1E182A] border-[#FF4D6D] dark:border-[#FF4D6D] shadow-sm ring-1 ring-[#FF4D6D]/30'
                      : 'bg-white/60 dark:bg-[#161220] border-[#E7E2D8] dark:border-[#2D2340] hover:bg-white dark:hover:bg-[#1E182A]'
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${track.accent}20`, color: track.accent }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">
                      {t(track.labelKey, track.defaultLabel)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Scope Checkboxes for Active Track */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#161220] border border-[#E7E2D8] dark:border-[#2D2340] space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              <span>Included Services &amp; Modules</span>
              <span className="text-[#FF4D6D]">{calculation.serviceCount} Selected</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TRACK_OPTIONS[activeTrack].services.map((service) => {
                const isChecked = (selectedServices[activeTrack] || []).includes(service.id);
                return (
                  <label
                    key={service.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-[#FF4D6D]/5 dark:bg-[#FF4D6D]/15 border-[#FF4D6D]/40 text-[#18181B] dark:text-white font-medium'
                        : 'bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleService(activeTrack, service.id)}
                      className="mt-0.5 rounded accent-[#FF4D6D] cursor-pointer"
                    />
                    <span className="leading-tight">{service.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Sliders & Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Monthly Volume Slider */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#161220] border border-[#E7E2D8] dark:border-[#2D2340] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300">
                <label htmlFor={volumeSliderId}>Monthly Volume</label>
                <span className="text-[#FF4D6D] font-black">{voucherVolume}+</span>
              </div>
              <input
                id={volumeSliderId}
                type="range"
                min="50"
                max="1500"
                step="50"
                value={voucherVolume}
                onChange={(e) => setVoucherVolume(Number(e.target.value))}
                aria-label="Monthly transaction or voucher volume slider"
                aria-valuemin={50}
                aria-valuemax={1500}
                aria-valuenow={voucherVolume}
                className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#FF4D6D]"
              />
              <div className="flex justify-between text-[9px] font-mono text-stone-400">
                <span>50 txns</span>
                <span>1500+ txns</span>
              </div>
            </div>

            {/* 2. Urgency Selector */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#161220] border border-[#E7E2D8] dark:border-[#2D2340] space-y-1.5">
              <label htmlFor={urgencySelectId} className="block text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300">
                {t('estimator.urgencyLabel', 'Delivery Speed')}
              </label>
              <select
                id={urgencySelectId}
                value={urgency}
                onChange={(e) => {
                  setUrgency(e.target.value);
                  soundFX.playChipHover();
                }}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 cursor-pointer outline-none focus:border-[#FF4D6D]"
              >
                <option value="standard">{t('estimator.urgencyStandard', 'Standard Timeline')}</option>
                <option value="express">{t('estimator.urgencyExpress', 'Express Priority (48-72h)')}</option>
              </select>
              <div className="text-[10px] text-stone-500 font-mono">
                {urgency === 'express' ? '⚡ 1.35x speed multiplier' : '✓ Normal turn-around'}
              </div>
            </div>

            {/* 3. Engagement Model Selector */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#161220] border border-[#E7E2D8] dark:border-[#2D2340] space-y-1.5">
              <label htmlFor={modelSelectId} className="block text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300">
                {t('estimator.modelLabel', 'Engagement Model')}
              </label>
              <select
                id={modelSelectId}
                value={model}
                onChange={(e) => {
                  setModel(e.target.value);
                  soundFX.playChipHover();
                }}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 cursor-pointer outline-none focus:border-[#FF4D6D]"
              >
                <option value="retainer">{t('estimator.modelRetainer', 'Monthly Retainer')}</option>
                <option value="onetime">{t('estimator.modelOneTime', 'One-Time Project')}</option>
              </select>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                {model === 'retainer' ? '★ Retainer savings included' : '• Fixed scope delivery'}
              </div>
            </div>
          </div>

          {/* Output Summary Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-300/80 dark:border-emerald-700/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider mb-1 border border-emerald-200 dark:border-emerald-800">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>{t('estimator.summaryTitle', 'Estimated Fee & Timeline')}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-[#18181B] dark:text-white">
                {formatINR(calculation.minPrice)} – {formatINR(calculation.maxPrice)}
                {model === 'retainer' && <span className="text-xs font-sans font-normal text-stone-500 dark:text-stone-400"> / month</span>}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-stone-600 dark:text-stone-300 mt-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{calculation.timelineText}</span>
              </div>
            </div>

            <div className="text-xs text-stone-500 dark:text-stone-400 font-mono sm:text-right">
              <div>Zero late-fee penalty track record</div>
              <div className="text-emerald-600 dark:text-emerald-400 font-bold">100% Statutory Compliance</div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Dual Actions */}
        <div className="p-4 sm:p-5 pt-3 border-t border-[#E7E2D8] dark:border-[#2D2340]/60 bg-white/50 dark:bg-[#161220]/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {t('estimator.closeModal', 'Cancel / Close')}
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Dual Action 1: Send Quote to WhatsApp */}
            <button
              type="button"
              onClick={handleSendToWhatsApp}
              className="py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('estimator.btnWhatsApp', 'Send Quote to WhatsApp')}</span>
            </button>

            {/* Dual Action 2: Pre-fill Contact Form */}
            <button
              type="button"
              onClick={handlePrefillContactForm}
              className="py-2.5 px-4 rounded-xl bg-[#18181B] hover:bg-black dark:bg-white dark:hover:bg-stone-200 text-white dark:text-[#18181B] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <span>{t('estimator.btnPrefill', 'Pre-fill Contact Form')}</span>
              <ArrowRight className="w-4 h-4 text-[#FF4D6D]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
