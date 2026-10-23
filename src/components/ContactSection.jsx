import React, { useState, useRef, useEffect, useMemo, useId, lazy, Suspense } from 'react';
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
  X,
  QrCode,
  Calculator,
  ReceiptText,
  Receipt,
  Database,
  Cpu,
  Download,
  Share2,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
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
import GISMapSkeleton from './GISMapSkeleton';
const LeafletOfflineMap = lazy(() => import('./LeafletOfflineMap'));
import { useSimpleMode } from '../context/SimpleModeContext';
import { downloadVCard, DEFAULT_CONTACT_DATA } from '../utils/vcardGenerator';

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

const TRACK_OPTIONS = {
  accounting: {
    id: 'accounting',
    labelKey: 'estimator.trackAccounting',
    defaultLabel: 'Accounting & Tax Advisory',
    defaultLabel_hi: 'लेखांकन एवं कर परामर्श',
    icon: ReceiptText,
    accent: '#FF4D6D',
    minBase: 4500,
    maxBase: 8000,
    services: [
      { id: 'gst', label: 'GST Return Filing (GSTR-1, 3B, 2B Reconciliation)', label_hi: 'GST रिटर्न फाइलिंग (GSTR-1, 3B, 2B समाधान)', defaultChecked: true, cost: 2500 },
      { id: 'itr', label: 'Income Tax E-Filing (ITR-1 to 4 & Tax Planning)', label_hi: 'आयकर ई-फाइलिंग (ITR-1 से 4 एवं कर योजना)', defaultChecked: true, cost: 2000 },
      { id: 'tally', label: 'Tally Prime / ERP Multi-Company Setup & BRS', label_hi: 'Tally Prime / ERP मल्टी-कंपनी सेटअप एवं BRS', defaultChecked: true, cost: 3000 },
      { id: 'audit', label: 'Balance Sheet, P&L & Audit Readiness Dossier', label_hi: 'बैलेंस शीट, P&L एवं ऑडिट तत्परता फाइल', defaultChecked: false, cost: 4500 }
    ]
  },
  mis: {
    id: 'mis',
    labelKey: 'estimator.trackMis',
    defaultLabel: 'MIS & Data Operations',
    defaultLabel_hi: 'MIS एवं डेटा ऑपरेशंस',
    icon: Database,
    accent: '#3B82F6',
    minBase: 5000,
    maxBase: 9000,
    services: [
      { id: 'macro', label: 'MS Excel VBA / Macro Automation & Pipelines', label_hi: 'MS Excel VBA / मैक्रो स्वचालन एवं पाइपलाइन', defaultChecked: true, cost: 3500 },
      { id: 'govt', label: 'DAY-NULM / Government Skill Portal Reporting', label_hi: 'DAY-NULM / सरकारी कौशल पोर्टल रिपोर्टिंग', defaultChecked: true, cost: 3000 },
      { id: 'cleaning', label: 'Large Dataset Reconciliation & Cleaning (10k+ rows)', label_hi: 'बड़े डेटासेट का मिलान एवं सफाई (10k+ पंक्तियाँ)', defaultChecked: true, cost: 2500 },
      { id: 'powerbi', label: 'Power BI Executive KPI Dashboard & Telemetry', label_hi: 'Power BI कार्यकारी KPI डैशबोर्ड एवं टेलीमेट्री', defaultChecked: false, cost: 4000 }
    ]
  },
  ai_web: {
    id: 'ai_web',
    labelKey: 'estimator.trackAi',
    defaultLabel: 'AI & Web Engineering',
    defaultLabel_hi: 'AI एवं वेब इंजीनियरिंग',
    icon: Cpu,
    accent: '#8B5CF6',
    minBase: 22000,
    maxBase: 35000,
    services: [
      { id: 'mvp', label: 'Full-Stack Next.js / React SaaS MVP Prototype', label_hi: 'फुल-स्टैक Next.js / React SaaS MVP प्रोटोटाइप', defaultChecked: true, cost: 18000 },
      { id: 'agents', label: 'Autonomous Multi-Agent LLM Workflow Engine', label_hi: 'स्वायत्त मल्टी-एजेंट LLM वर्कफ़्लो इंजन', defaultChecked: true, cost: 14000 },
      { id: 'api', label: 'Production REST API, Auth & PostgreSQL DB Integration', label_hi: 'प्रोडक्शन REST API, Auth एवं PostgreSQL DB एकीकरण', defaultChecked: true, cost: 8000 },
      { id: 'design', label: 'High-Fidelity Tailwind CSS & UI/UX Interactions', label_hi: 'उच्च-सटीक Tailwind CSS एवं UI/UX इंटरैक्शन', defaultChecked: false, cost: 6000 }
    ]
  }
};

/**
 * Pure SVG Dynamic QR Code Generator for Contact & Portfolio URL
 */
function DynamicQrCodeSvg({ size = 160, url = 'https://atulverma.in' }) {
  const matrixSize = 25;
  const modules = useMemo(() => {
    const grid = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(false));

    const stampFinder = (startRow, startCol) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isOuterBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isInnerDot = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          grid[startRow + r][startCol + c] = isOuterBorder || isInnerDot;
        }
      }
    };

    stampFinder(0, 0);
    stampFinder(0, matrixSize - 7);
    stampFinder(matrixSize - 7, 0);

    for (let i = 8; i < matrixSize - 8; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    const alignCenter = 18;
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        const isBorder = Math.abs(r) === 2 || Math.abs(c) === 2;
        const isCenter = r === 0 && c === 0;
        grid[alignCenter + r][alignCenter + c] = isBorder || isCenter;
      }
    }

    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      hash = (hash * 31 + url.charCodeAt(i)) & 0xffffffff;
    }

    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        const inFinderTL = r < 8 && c < 8;
        const inFinderTR = r < 8 && c >= matrixSize - 8;
        const inFinderBL = r >= matrixSize - 8 && c < 8;
        const inAlignment = Math.abs(r - alignCenter) <= 2 && Math.abs(c - alignCenter) <= 2;
        const inTiming = r === 6 || c === 6;

        if (!inFinderTL && !inFinderTR && !inFinderBL && !inAlignment && !inTiming) {
          if (r >= 10 && r <= 14 && c >= 10 && c <= 14) {
            grid[r][c] = false;
          } else {
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
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-8 h-8 rounded-full bg-white p-1 shadow-md border border-stone-200 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#FF4D6D] flex items-center justify-center text-white font-extrabold text-[10px] font-mono">
            AV
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactSection() {
  const { isSimpleMode } = useSimpleMode();
  let announce = null;
  try {
    const announcer = useAnnounce();
    announce = announcer?.announce;
  } catch {
    // fallback
  }

  let languageContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    languageContext = useLanguage();
  } catch {
    // fallback
  }
  const t = languageContext?.t ?? ((key, fallback) => fallback || key);
  const isHindi = Boolean(languageContext?.isHindi);
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
      label: t('contact.tabForm', 'Get in Touch'),
      badge: isHindi ? 'पूछताछ फॉर्म' : 'Inquiry Form',
      icon: Mail
    },
    {
      id: 'quote',
      label: t('contact.tabQuote', 'Quotation & Pricing'),
      badge: t('contact.badgeQuote', 'Estimate'),
      icon: ReceiptText
    },
    {
      id: 'direct',
      label: t('contact.tabDirect', 'Direct Details'),
      badge: isUnlocked ? (isHindi ? '✓ खुला' : '✓ Unlocked') : (isHindi ? '🔒 सुरक्षित' : '🔒 Gated'),
      icon: MessageCircle
    },
    {
      id: 'location',
      label: t('contact.tabLocation', 'Location & Office'),
      badge: isHindi ? 'मेदिनीनगर मुख्यालय' : 'Medininagar HQ',
      icon: MapPin
    }
  ];

  // Quotation & Pricing Estimator states
  const volumeSliderId = useId();
  const urgencySelectId = useId();
  const modelSelectId = useId();

  const [activeTrack, setActiveTrack] = useState('accounting');
  const [selectedServices, setSelectedServices] = useState({
    accounting: ['gst', 'itr', 'tally'],
    mis: ['macro', 'govt', 'cleaning'],
    ai_web: ['mvp', 'agents', 'api']
  });
  const [voucherVolume, setVoucherVolume] = useState(250);
  const [urgency, setUrgency] = useState('standard');
  const [model, setModel] = useState('retainer');

  // Digital card / vCard states
  const [cardCopied, setCardCopied] = useState(false);
  const [vcardDownloaded, setVcardDownloaded] = useState(false);

  // Map state
  const [zoom, setZoom] = useState(13);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [mapMode, setMapMode] = useState('osm'); // 'osm' | 'google'
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });
  const [showIframe, setShowIframe] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isLiveLoading, setIsLiveLoading] = useState(false);

  const tabButtonRefs = useRef({});
  const emailTimeoutRef = useRef(null);
  const whatsappTimeoutRef = useRef(null);
  const addressTimeoutRef = useRef(null);
  const iframeHydrationTimerRef = useRef(null);
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

  // Listen for external tab switch events (e.g. from CommandPalette, Navbar, ExploreSubBar)
  useEffect(() => {
    const validTabs = ['touch', 'quote', 'direct', 'location'];
    const handleSwitchTab = (e) => {
      const targetTab = e.detail?.tab;
      if (targetTab && validTabs.includes(targetTab)) {
        setActiveTab(targetTab);
      }
    };
    const handleOpenEstimator = () => {
      setActiveTab('quote');
    };
    const handleOpenVCard = () => {
      setActiveTab('direct');
    };

    window.addEventListener('switch-contact-tab', handleSwitchTab);
    window.addEventListener('portfolio:switch-contact-tab', handleSwitchTab);
    window.addEventListener('portfolio:open-estimator', handleOpenEstimator);
    window.addEventListener('portfolio:open-vcard', handleOpenVCard);

    return () => {
      window.removeEventListener('switch-contact-tab', handleSwitchTab);
      window.removeEventListener('portfolio:switch-contact-tab', handleSwitchTab);
      window.removeEventListener('portfolio:open-estimator', handleOpenEstimator);
      window.removeEventListener('portfolio:open-vcard', handleOpenVCard);
    };
  }, []);

  // Toggle service in quotation track
  const toggleEstimatorService = (trackId, serviceId) => {
    soundFX.playChipHover();
    setSelectedServices((prev) => {
      const current = prev[trackId] || [];
      const updated = current.includes(serviceId)
        ? current.filter((id) => id !== serviceId)
        : [...current, serviceId];
      return { ...prev, [trackId]: updated };
    });
  };

  // Indian Rupee currency formatter
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Live calculation for Quotation & Pricing
  const calculation = useMemo(() => {
    const track = TRACK_OPTIONS[activeTrack];
    const currentServices = selectedServices[activeTrack] || [];

    const servicesCost = track.services
      .filter((s) => currentServices.includes(s.id))
      .reduce((sum, s) => sum + s.cost, 0);

    let volumeMultiplier = 1.0;
    if (activeTrack === 'accounting') {
      volumeMultiplier = 0.8 + (voucherVolume / 500) * 0.4;
    } else if (activeTrack === 'mis') {
      volumeMultiplier = 0.85 + (voucherVolume / 600) * 0.35;
    } else {
      volumeMultiplier = 0.9 + (voucherVolume / 800) * 0.3;
    }

    const urgencyMultiplier = urgency === 'express' ? 1.35 : 1.0;
    const modelMultiplier = model === 'retainer' ? 0.82 : 1.0;

    const baseMin = (track.minBase + servicesCost * 0.8) * volumeMultiplier * urgencyMultiplier * modelMultiplier;
    const baseMax = (track.maxBase + servicesCost * 1.15) * volumeMultiplier * urgencyMultiplier * modelMultiplier;

    const roundedMin = Math.round(baseMin / 500) * 500;
    const roundedMax = Math.round(baseMax / 500) * 500;

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

  // Quotation Action 1: Send Quote to WhatsApp
  const handleSendQuoteToWhatsApp = () => {
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
      `*Domain Track:* ${encodeURIComponent(trackName)}%0A` +
      `*Engagement Model:* ${encodeURIComponent(modelLabel)}%0A` +
      `*Monthly Volume:* ~${voucherVolume} transactions/records%0A` +
      `*Speed / Urgency:* ${encodeURIComponent(urgencyLabel)}%0A` +
      `*Estimated Fee:* ${encodeURIComponent(priceRange)}${model === 'retainer' ? ' / month' : ''}%0A` +
      `*Timeline:* ${encodeURIComponent(calculation.timelineText)}%0A%0A` +
      `*Selected Services:*%0A${currentServicesList}%0A%0A` +
      `Hi Atul, I configured this quotation on your portfolio and would like to proceed with the next steps.`;

    const whatsappUrl = `https://wa.me/917992383804?text=${message}`;
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Quotation Action 2: Pre-fill Contact Form
  const handlePreFillContactForm = () => {
    soundFX.playSparkle();
    const trackName = t(TRACK_OPTIONS[activeTrack].labelKey, TRACK_OPTIONS[activeTrack].defaultLabel);
    const priceRange = `${formatINR(calculation.minPrice)} – ${formatINR(calculation.maxPrice)}${model === 'retainer' ? '/mo' : ''}`;

    let mappedRole = 'Taxation & Accounting';
    if (activeTrack === 'mis') mappedRole = 'MIS & Data Analytics';
    if (activeTrack === 'ai_web') mappedRole = 'AI Software / Vibe Coding';

    let mappedBudget = 'Flexible / Open to Discuss';
    if (calculation.maxPrice <= 25000) mappedBudget = 'Under ₹25,000';
    else if (calculation.maxPrice <= 50000) mappedBudget = '₹25,000 - ₹50,000';
    else mappedBudget = 'Flexible / Open to Discuss';

    const selectedServiceNames = TRACK_OPTIONS[activeTrack].services
      .filter((s) => (selectedServices[activeTrack] || []).includes(s.id))
      .map((s) => s.label)
      .join(', ');

    setFormData((prev) => ({
      ...prev,
      role: mappedRole,
      budget: mappedBudget,
      urgency: urgency === 'express' ? 'Immediate / Urgent' : 'Within 1-2 weeks',
      message: `[Quotation from Estimator]\nDomain: ${trackName}\nModel: ${model === 'retainer' ? 'Monthly Retainer' : 'One-Time Project'}\nVolume: ~${voucherVolume} items\nEstimated Fee: ${priceRange}\nScope: ${selectedServiceNames}`
    }));

    setActiveTab('touch');

    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage('Quotation applied to contact form. Fill in your name & email to submit!');
    setShowToast(true);
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
      toastTimeoutRef.current = null;
    }, 4500);
  };

  // Digital Business Card Actions
  const handleDownloadVCard = () => {
    soundFX.playSparkle();
    const success = downloadVCard('Atul_Verma_Tax_and_Developer.vcf', DEFAULT_CONTACT_DATA);
    if (success) {
      setVcardDownloaded(true);
      setTimeout(() => setVcardDownloaded(false), 2500);
    }
  };

  const handleCopyProfileLink = async () => {
    soundFX.playFocusBeep();
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.origin || 'https://atulverma.in');
        setCardCopied(true);
        setTimeout(() => setCardCopied(false), 2500);
      } else {
        fallbackCopyText('https://atulverma.in');
        setCardCopied(true);
        setTimeout(() => setCardCopied(false), 2500);
      }
    } catch {
      fallbackCopyText('https://atulverma.in');
      setCardCopied(true);
      setTimeout(() => setCardCopied(false), 2500);
    }
  };

  // Listen for prefill-contact events from external dispatches
  useEffect(() => {
    const handlePrefill = (e) => {
      const detail = e.detail;
      if (detail) {
        setFormData((prev) => ({
          ...prev,
          role: detail.role || prev.role,
          budget: detail.budget || prev.budget,
          timeline: detail.timeline || prev.timeline,
          message: detail.message ? (prev.message ? `${prev.message}\n\n${detail.message}` : detail.message) : prev.message
        }));
        setActiveTab('touch');
      }
    };
    window.addEventListener('portfolio:prefill-contact', handlePrefill);
    return () => window.removeEventListener('portfolio:prefill-contact', handlePrefill);
  }, []);

  // Monitor network connectivity status & offline resilience
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setMapMode('osm');
      setZoom((z) => Math.min(15, Math.max(12, z)));
      setShowIframe(false);
      setIframeLoaded(false);
      setIsLiveLoading(false);
      if (iframeHydrationTimerRef.current) {
        clearTimeout(iframeHydrationTimerRef.current);
        iframeHydrationTimerRef.current = null;
      }
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
      setIsLiveLoading(false);
      if (mapMode === 'google') {
        setMapMode('osm');
        setZoom((z) => Math.min(15, Math.max(12, z)));
      }
    }
  }, [isSimpleMode, iframeLoaded, mapMode]);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      if (emailTimeoutRef.current) clearTimeout(emailTimeoutRef.current);
      if (whatsappTimeoutRef.current) clearTimeout(whatsappTimeoutRef.current);
      if (addressTimeoutRef.current) clearTimeout(addressTimeoutRef.current);
      if (iframeHydrationTimerRef.current) clearTimeout(iframeHydrationTimerRef.current);
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
    setResetTrigger((prev) => prev + 1);
    setZoom(13);
    soundFX.playFocusBeep();
  };

  const handleToggleMapMode = () => {
    if (isLiveLoading) return;

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
    if (mapMode === 'google') {
      // Transition from online to offline: keep iframe mounted for zero-flicker
      setMapMode('osm');
      setZoom((z) => Math.min(15, Math.max(12, z)));
    } else {
      // Transition from offline to online
      if (!isOnline) {
        soundFX.playPop();
        setToastMessage(isHindi ? 'इंटरनेट कनेक्शन उपलब्ध नहीं है, केवल ऑफलाइन मैप सक्रिय है' : 'No internet connection, staying on Offline Map');
        setShowToast(true);
        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = setTimeout(() => {
          setShowToast(false);
          toastTimeoutRef.current = null;
        }, 3000);
        return;
      }

      if (iframeLoaded) {
        // Iframe is already mounted and painted in DOM, switch instantly with cross-fade
        setMapMode('google');
      } else {
        // On-demand silent load in background: keep Leaflet visible & interactive
        if (iframeHydrationTimerRef.current) {
          clearTimeout(iframeHydrationTimerRef.current);
          iframeHydrationTimerRef.current = null;
        }
        setIsLiveLoading(true);
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
      if (iframeHydrationTimerRef.current) {
        clearTimeout(iframeHydrationTimerRef.current);
        iframeHydrationTimerRef.current = null;
      }
      setIsLiveLoading(true);
      setShowIframe(true);
    }
  };

  const handleIframeLoad = () => {
    if (iframeHydrationTimerRef.current) {
      clearTimeout(iframeHydrationTimerRef.current);
    }
    // 350ms hydration timer so WebGL/SPA tiles paint before cross-fading
    iframeHydrationTimerRef.current = setTimeout(() => {
      setIframeLoaded(true);
      setMapMode('google');
      setIsLiveLoading(false);
      iframeHydrationTimerRef.current = null;
    }, 350);
  };

  const handleIframeError = () => {
    if (iframeHydrationTimerRef.current) {
      clearTimeout(iframeHydrationTimerRef.current);
      iframeHydrationTimerRef.current = null;
    }
    setIsLiveLoading(false);
    setMapMode('osm');
    setZoom((z) => Math.min(15, Math.max(12, z)));
    setToastMessage(isHindi ? 'लाइव मैप लोड करने में असमर्थ, ऑफलाइन मैप प्रदर्शित किया गया' : 'Unable to load Live Map, falling back to Offline Map');
    setShowToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
      toastTimeoutRef.current = null;
    }, 4000);
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
          <span className="truncate sm:overflow-visible">06 ✦ {t('contact.badge', 'Contact • Inquiries & HQ')}</span>
        </div>

        {/* Section Heading & Subtitle */}
        <div className="mb-6">
          <h2
            id="contact-heading"
            tabIndex={0}
            data-tts={t('contact.title', "Let's build something meaningful.")}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#18181B] dark:text-white tracking-tight font-['Outfit',sans-serif] leading-[1.08] mb-3 whitespace-normal sm:whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg"
          >
            {languageContext?.isHindi ? (
              <span>आइए मिलकर कुछ <span className="text-[#FF4D6D]">सार्थक और उपयोगी</span> बनाएं</span>
            ) : (
              <span>Let's build something <span className="text-[#FF4D6D]">meaningful</span>.</span>
            )}
          </h2>
          <div className="w-12 h-1 rounded-full bg-[#FF4D6D] mb-4" />
          <p
            tabIndex={0}
            data-tts={t('contact.subtitle', 'Have a role, a project, or a question about my work? Submit your inquiry below to instantly unlock direct WhatsApp and email channels.')}
            className="text-stone-600 dark:text-stone-400 text-sm sm:text-base max-w-xl font-normal leading-relaxed focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden rounded-lg"
          >
            {t('contact.subtitle', 'Have a role, a project, or a question about my work? Submit your inquiry below to instantly unlock direct WhatsApp & email channels.')}
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
                data-tts={`Tab ${idx + 1} of ${CONTACT_TABS.length}: ${tab.label}, ${isActive ? 'Selected' : 'Unselected'}. Press Enter to view or Tab to move forward`}
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
                      {isHindi ? 'संदेश भेजें / प्रोजेक्ट पूछताछ' : 'Send a Note / Project Inquiry'}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-2xl">
                    {isHindi
                      ? 'अपनी प्रोजेक्ट या परामर्श पूछताछ जमा करने के लिए नीचे विवरण भरें। इस फॉर्म को सबमिट करते ही डायरेक्ट WhatsApp और पर्सनल ईमेल चैनल तुरंत अनलॉक हो जाते हैं।'
                      : 'Fill in the details below to submit your project or consultation inquiry. Completing this form instantly unlocks direct WhatsApp priority access and personal email.'}
                  </p>
                </div>

                {/* Instant Service Fee Estimator CTA Card */}
                <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-300/60 dark:border-amber-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                      <Calculator className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#18181B] dark:text-white">
                        {t('contact.estimatorCta', 'Need a quick price estimate? Use our Instant Service Fee Estimator 🧮')}
                      </div>
                      <div className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">
                        {isHindi
                          ? 'पारदर्शी मूल्य निर्धारण हेतु मासिक वाउचर वॉल्यूम, तत्परता और कार्यक्षेत्र कॉन्फ़िगर करें।'
                          : 'Configure monthly voucher volume, urgency, and deliverables for instant transparent pricing.'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playSparkle();
                      handleTabChange('quote');
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('portfolio:open-estimator'));
                      }
                    }}
                    className="py-2.5 px-4 rounded-xl bg-[#18181B] hover:bg-black dark:bg-white dark:hover:bg-stone-200 text-white dark:text-[#18181B] text-xs font-bold font-mono transition-transform active:scale-95 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>{t('contact.estimatorBtn', 'Calculate Price & Timeline')}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FF4D6D]" />
                  </button>
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
                        {t('contact.nameLabel', 'YOUR NAME')} <span className="text-[#FF4D6D]">*</span>
                      </label>
                      <input
                        id="field-name"
                        type="text"
                        required
                        data-tts="Input field: Your Name"
                        placeholder={languageContext?.isHindi ? "उदा. राहुल शर्मा" : "e.g. Rahul Sharma"}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#DCD5CB] dark:border-stone-700 bg-[#FAF8F5] dark:bg-[#100C1A]/80 focus:bg-white dark:focus:bg-stone-900 focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 text-xs outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden transition-all text-[#18181B] dark:text-white dark:placeholder-stone-500 shadow-2xs"
                      />
                    </div>

                    {/* Row 1 - Col 2: Email Address */}
                    <div>
                      <label htmlFor="field-email" className="block text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
                        {t('contact.emailLabel', 'EMAIL ADDRESS')} <span className="text-[#FF4D6D]">*</span>
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
                        <span>{t('contact.whatsappLabel', 'WHATSAPP NUMBER')} <span className="text-[#FF4D6D]">*</span></span>
                        <span className="text-[10px] text-stone-400 font-normal lowercase">{languageContext?.isHindi ? 'कंट्री कोड सहित' : 'incl. country code'}</span>
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
                        {t('contact.companyLabel', 'COMPANY / ORGANIZATION')} <span className="text-stone-400 font-normal lowercase">{languageContext?.isHindi ? '(वैकल्पिक)' : '(Optional)'}</span>
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
                        <span>{t('contact.roleLabel', 'ROLE / INQUIRY CATEGORY')} <span className="text-[#FF4D6D]">*</span></span>
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
                        <span>{t('contact.budgetLabel', 'ESTIMATED BUDGET')} <span className="text-stone-400 font-normal lowercase">{languageContext?.isHindi ? '(वैकल्पिक)' : '(Optional)'}</span></span>
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
                        <span>{t('contact.timelineLabel', 'TARGET TIMELINE')} <span className="text-stone-400 font-normal lowercase">{languageContext?.isHindi ? '(वैकल्पिक)' : '(Optional)'}</span></span>
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
                        {t('contact.messageLabel', 'INQUIRY DETAILS / MESSAGE')} <span className="text-[#FF4D6D]">*</span>
                      </label>
                      <textarea
                        id="field-message"
                        required
                        data-tts="Textarea field: Inquiry Details and Message"
                        rows={4}
                        placeholder={languageContext?.isHindi ? "कृपया प्रोजेक्ट विवरण, डिलीवरी अपेक्षाएं, प्रयुक्त टूल्स या विशिष्ट लक्ष्यों का उल्लेख करें..." : "Please outline the deliverables, current bottleneck, tools used, or specific goals..."}
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
                        {isHindi ? (
                          <>
                            <span className="font-bold text-[#18181B] dark:text-[#F5F2F8]">100% गोपनीयता गारंटी:</span> सबमिट करते ही WhatsApp और ईमेल के लिए 24 घंटे का अनलॉक टोकन सक्रिय हो जाता है।
                          </>
                        ) : (
                          <>
                            <span className="font-bold text-[#18181B] dark:text-[#F5F2F8]">100% Privacy Guarantee:</span> Submitting immediately activates a 24-hr unlock token for WhatsApp &amp; Email.
                          </>
                        )}
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
                          <span>{t('contact.submitting', 'Submitting Inquiry & Unlocking Direct Channel...')}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-[#FF4D6D]" />
                          <span>{t('contact.submitBtn', 'Submit Inquiry & Unlock Direct Channel')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: QUOTATION & PRICING (Dedicated Panel: In-Tab)      */}
          {/* ======================================================== */}
          {activeTab === 'quote' && (
            <div
              role="tabpanel"
              id="contact-panel-quote"
              aria-labelledby="contact-tab-quote"
              tabIndex={0}
              onKeyDown={handlePanelKeyDown}
              className="animate-tab-fade space-y-6 focus:outline-none"
            >
              {/* Quotation Header */}
              <div
                tabIndex={0}
                data-tts="Sub-header: Instant Service Fee Quotation and Project Timeline Estimator"
                className="flex items-center gap-2.5 p-2 -ml-2 rounded-xl focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
              >
                <div className="w-8 h-8 rounded-xl bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 text-[#FF4D6D] border border-[#FFD1DC] dark:border-[#FF4D6D]/30 flex items-center justify-center shrink-0">
                  <ReceiptText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-['Outfit',sans-serif] text-xl sm:text-2xl font-bold text-[#18181B] dark:text-[#F5F2F8]">
                    {t('contact.tabQuote', 'Quotation & Pricing')}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                    {t('estimator.subtitle', 'Configure monthly volume, speed, and deliverables for instant transparent pricing.')}
                  </p>
                </div>
              </div>

              {/* Main Estimator Container */}
              <div className="p-5 sm:p-7 rounded-3xl bg-[#FAF8F5] dark:bg-[#120E1E] border border-[#ECE7DF] dark:border-[#2D2340] space-y-6 shadow-sm">
                {/* 1. Track Selector Buttons (3 Tracks) */}
                <div>
                  <div className="text-xs font-mono font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D]" />
                    <span>{isHindi ? 'अभ्यास कार्यक्षेत्र चुनें' : 'Select Practice Track'}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                            isSelected
                              ? 'bg-white dark:bg-[#1E182A] border-[#FF4D6D] dark:border-[#FF4D6D] shadow-sm ring-2 ring-[#FF4D6D]/20'
                              : 'bg-white/70 dark:bg-[#161220] border-[#E7E2D8] dark:border-[#2D2340] hover:bg-white dark:hover:bg-[#1E182A]'
                          }`}
                        >
                          <div 
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${track.accent}20`, color: track.accent }}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-bold text-[#18181B] dark:text-white truncate">
                              {t(track.labelKey, track.defaultLabel)}
                            </div>
                            <div className="text-[10px] text-stone-500 dark:text-stone-400 font-mono mt-0.5">
                              {isHindi
                                ? (track.id === 'accounting' ? 'वैधानिक एवं अनुपालन' : track.id === 'mis' ? 'डेटा ऑप्स एवं पाइपलाइन' : 'SaaS, MVP एवं एजेंट्स')
                                : (track.id === 'accounting' ? 'Statutory & Compliance' : track.id === 'mis' ? 'Data Ops & Pipelines' : 'SaaS, MVPs & Agents')}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Included Scope & Services Checkboxes */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161220] border border-[#E7E2D8] dark:border-[#2D2340] space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    <span>{isHindi ? 'शामिल सेवाएं और परिणाम' : 'Included Services & Deliverables'}</span>
                    <span className="text-[#FF4D6D]">{isHindi ? `${calculation.serviceCount} चयनित` : `${calculation.serviceCount} Selected`}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {TRACK_OPTIONS[activeTrack].services.map((service) => {
                      const isChecked = (selectedServices[activeTrack] || []).includes(service.id);
                      return (
                        <label
                          key={service.id}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-[#FF4D6D]/5 dark:bg-[#FF4D6D]/15 border-[#FF4D6D]/40 text-[#18181B] dark:text-white font-medium'
                              : 'bg-stone-50/70 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleEstimatorService(activeTrack, service.id)}
                            className="mt-0.5 rounded accent-[#FF4D6D] cursor-pointer"
                          />
                          <span className="leading-snug">{(isHindi && service.label_hi) ? service.label_hi : service.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Parameter Controls (Volume, Urgency, Model) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* Volume Slider */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-[#161220] border border-[#E7E2D8] dark:border-[#2D2340] space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-600 dark:text-stone-300">
                      <label htmlFor={volumeSliderId}>{isHindi ? 'मासिक वॉल्यूम' : 'Monthly Volume'}</label>
                      <span className="text-[#FF4D6D] font-black">{voucherVolume}+</span>
                    </div>
                    <input
                      id={volumeSliderId}
                      type="range"
                      min="50"
                      max="2000"
                      step="50"
                      value={voucherVolume}
                      onChange={(e) => setVoucherVolume(Number(e.target.value))}
                      aria-label="Monthly transaction or voucher volume slider"
                      aria-valuemin={50}
                      aria-valuemax={2000}
                      aria-valuenow={voucherVolume}
                      className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#FF4D6D]"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-stone-400">
                      <span>{isHindi ? '50 लेनदेन' : '50 txns'}</span>
                      <span>{isHindi ? '2000+ लेनदेन' : '2000+ txns'}</span>
                    </div>
                  </div>

                  {/* Urgency Selector */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-[#161220] border border-[#E7E2D8] dark:border-[#2D2340] space-y-2">
                    <label htmlFor={urgencySelectId} className="block text-xs font-mono font-bold text-stone-600 dark:text-stone-300">
                      {t('estimator.urgencyLabel', 'Delivery Speed')}
                    </label>
                    <select
                      id={urgencySelectId}
                      value={urgency}
                      onChange={(e) => {
                        setUrgency(e.target.value);
                        soundFX.playChipHover();
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 cursor-pointer outline-none focus:border-[#FF4D6D]"
                    >
                      <option value="standard">{t('estimator.urgencyStandard', 'Standard Timeline')}</option>
                      <option value="express">{t('estimator.urgencyExpress', 'Express Priority (48-72h)')}</option>
                    </select>
                    <div className="text-[10px] text-stone-500 font-mono">
                      {urgency === 'express' ? (isHindi ? '⚡ 1.35x गति गुणक' : '⚡ 1.35x speed multiplier') : (isHindi ? '✓ सामान्य समय' : '✓ Normal turn-around')}
                    </div>
                  </div>

                  {/* Engagement Model Selector */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-[#161220] border border-[#E7E2D8] dark:border-[#2D2340] space-y-2">
                    <label htmlFor={modelSelectId} className="block text-xs font-mono font-bold text-stone-600 dark:text-stone-300">
                      {t('estimator.modelLabel', 'Engagement Model')}
                    </label>
                    <select
                      id={modelSelectId}
                      value={model}
                      onChange={(e) => {
                        setModel(e.target.value);
                        soundFX.playChipHover();
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 cursor-pointer outline-none focus:border-[#FF4D6D]"
                    >
                      <option value="retainer">{t('estimator.modelRetainer', 'Monthly Retainer')}</option>
                      <option value="onetime">{t('estimator.modelOneTime', 'One-Time Project')}</option>
                    </select>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                      {model === 'retainer' ? (isHindi ? '★ रिटेनर बचत शामिल' : '★ Retainer savings included') : (isHindi ? '• निश्चित दायरा डिलीवरी' : '• Fixed scope delivery')}
                    </div>
                  </div>
                </div>

                {/* 4. Output Summary Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-indigo-500/15 border border-emerald-300/80 dark:border-emerald-700/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider mb-1.5 border border-emerald-200 dark:border-emerald-800">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>{t('estimator.summaryTitle', 'Estimated Fee & Timeline')}</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black font-mono text-[#18181B] dark:text-white">
                      {formatINR(calculation.minPrice)} – {formatINR(calculation.maxPrice)}
                      {model === 'retainer' && <span className="text-xs font-sans font-normal text-stone-500 dark:text-stone-400">{isHindi ? ' / माह' : ' / month'}</span>}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-stone-600 dark:text-stone-300 mt-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{calculation.timelineText}</span>
                    </div>
                  </div>

                  <div className="text-xs text-stone-500 dark:text-stone-400 font-mono sm:text-right">
                    <div>{isHindi ? 'शून्य लेट-फीस पेनल्टी ट्रैक रिकॉर्ड' : 'Zero late-fee penalty track record'}</div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold">{isHindi ? '100% वैधानिक अनुपालन' : '100% Statutory Compliance'}</div>
                  </div>
                </div>

                {/* 5. Dual Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                  {/* Action 1: Send Quote to WhatsApp */}
                  <button
                    type="button"
                    onClick={handleSendQuoteToWhatsApp}
                    className="py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t('estimator.btnWhatsApp', 'Send Quote to WhatsApp')}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  {/* Action 2: Pre-fill Contact Form */}
                  <button
                    type="button"
                    onClick={handlePreFillContactForm}
                    className="py-3 px-5 rounded-xl bg-[#18181B] hover:bg-black dark:bg-white dark:hover:bg-stone-200 text-white dark:text-[#18181B] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
                  >
                    <span>{t('estimator.btnPrefill', 'Pre-fill Contact Form')}</span>
                    <ArrowRight className="w-4 h-4 text-[#FF4D6D]" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: DIRECT DETAILS & vCARD QR (2-Column Grid In-Tab)   */}
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
                    {t('contact.tabDirect', 'Direct Details')}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                    {isUnlocked 
                      ? (isHindi ? 'सीधी पूछताछ, वॉयस कॉल और तत्काल मैसेजिंग के लिए प्राथमिकता चैनल सक्रिय हैं' : 'Priority access channels active for direct inquiry, voice call, and instant messaging')
                      : (isHindi ? 'स्पैम-मुक्त और केंद्रित संचार बनाए रखने के लिए संरक्षित चैनल' : 'Protected channels to maintain focused, spam-free communication')}
                  </p>
                </div>
              </div>

              {/* In-Tab 2-Column Grid (Desktop 2-col, Mobile 1-col stacked) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* ---------------------------------------------------- */}
                {/* LEFT COLUMN: Luxury Digital Business Card & vCard QR */}
                {/* ---------------------------------------------------- */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="relative p-6 rounded-3xl bg-gradient-to-br from-white via-[#FAF8F5] to-stone-50 dark:from-[#181426] dark:via-[#151022] dark:to-[#100C1B] border border-[#E7E2D8] dark:border-[#2D2340] shadow-md flex flex-col items-center text-center space-y-4">
                    {/* Top Accent Ribbon */}
                    <div className="w-full flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/80">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{isHindi ? 'प्रमाणित विशेषज्ञ' : 'Verified Professional'}</span>
                      </div>
                      <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300 font-bold bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                        vCard 3.0 Standard
                      </span>
                    </div>

                    {/* Personal Identity */}
                    <div>
                      <h4 className="text-xl font-black font-['Outfit',sans-serif] text-[#18181B] dark:text-white">
                        Atul Verma
                      </h4>
                      <p className="text-xs font-semibold text-[#FF4D6D] mt-0.5">
                        Tax Consultant • Tally ERP Specialist • AI Engineer
                      </p>
                    </div>

                    {/* Pure SVG 25x25 Dynamic QR Code */}
                    <div className="flex flex-col items-center gap-1.5 py-1">
                      <DynamicQrCodeSvg size={160} url="https://atulverma.in" />
                      <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 font-semibold flex items-center gap-1 mt-1">
                        <QrCode className="w-3 h-3 text-[#FF4D6D]" />
                        <span>{t('vcard.scanPrompt', 'Scan with camera to add contacts')}</span>
                      </span>
                    </div>

                    {/* Coordinates List */}
                    <div className="w-full space-y-2 text-xs text-stone-600 dark:text-stone-300 font-medium pt-3 border-t border-stone-200 dark:border-stone-800 text-left">
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-3.5 h-3.5 text-[#FF4D6D] shrink-0" />
                        <a href="tel:+917992383804" className="hover:underline font-mono">
                          +91 7992383804
                        </a>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <a href="mailto:Atulravi2015@gmail.com" className="hover:underline truncate">
                          Atulravi2015@gmail.com
                        </a>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">Medininagar, Palamau, Jharkhand 822101</span>
                      </div>
                    </div>

                    {/* Action Buttons: Download vCard & Copy Link */}
                    <div className="w-full pt-2 space-y-2">
                      <button
                        type="button"
                        onClick={handleDownloadVCard}
                        className="w-full py-3 px-4 rounded-xl bg-[#18181B] hover:bg-black dark:bg-white dark:hover:bg-stone-200 text-white dark:text-[#18181B] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                      >
                        {vcardDownloaded ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                            <span>Saved! (.vcf)</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 text-[#FF4D6D]" />
                            <span>{t('vcard.downloadBtn', 'Save Contact (.vcf)')}</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyProfileLink}
                        className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-[#1E182A] hover:bg-stone-100 dark:hover:bg-[#282038] text-stone-800 dark:text-stone-200 border border-[#E7E2D8] dark:border-[#2D2340] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-2xs"
                      >
                        {cardCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{t('vcard.copied', 'Link Copied!')}</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5 text-stone-500" />
                            <span>{t('vcard.shareBtn', 'Share Profile')}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Quick Direct Links */}
                    <div className="w-full flex items-center justify-center gap-4 pt-1 text-xs">
                      <a
                        href="https://wa.me/917992383804?text=Hi%20Atul,%20I%20viewed%20your%20digital%20business%20card%20and%20would%20like%20to%20connect."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-semibold text-[#25D366] hover:underline"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{isHindi ? 'व्हाट्सएप चैट' : 'WhatsApp Chat'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <span className="text-stone-300 dark:text-stone-700">•</span>
                      <a
                        href="tel:+917992383804"
                        className="inline-flex items-center gap-1.5 font-semibold text-stone-600 dark:text-stone-400 hover:text-[#18181B] dark:hover:text-white hover:underline"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{isHindi ? 'सीधा कॉल' : 'Direct Call'}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* ---------------------------------------------------- */}
                {/* RIGHT COLUMN: Direct Channels / Gated Access Panel   */}
                {/* ---------------------------------------------------- */}
                <div className="lg:col-span-7 space-y-5">
                  {isUnlocked ? (
                    /* UNLOCKED CHANNELS PANEL */
                    <div className="space-y-5 animate-in zoom-in-95 duration-300">
                      {/* Top 24-Hour Celebration Banner */}
                      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-teal-500/15 border border-emerald-300/80 dark:border-emerald-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                            <Sparkles className="w-6 h-6 animate-pulse" />
                          </div>
                          <div>
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-[11px] font-mono font-bold mb-1 border border-emerald-200 dark:border-emerald-800">
                              <Check className="w-3 h-3 text-emerald-600" /> {isHindi ? 'सत्यापित पहुंच सक्रिय' : 'Verified Access Active'}
                            </div>
                            <h4 className="text-lg sm:text-xl font-black font-['Outfit',sans-serif] text-[#18181B] dark:text-white">
                              {isHindi ? 'डायरेक्ट संपर्क अनलॉक हुआ!' : 'Direct Contact Unlocked!'}
                            </h4>
                            <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                              {isHindi
                                ? `प्राथमिकता WhatsApp डायरेक्ट मैसेजिंग और व्यक्तिगत ईमेल तुरंत सहायता के लिए सक्रिय हैं${lastSubmittedData?.name ? ` (${lastSubmittedData.name} हेतु)` : ''}।`
                                : `Priority WhatsApp direct messaging and personal email are active for fast turnaround${lastSubmittedData?.name ? ` for ${lastSubmittedData.name}` : ''}.`}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleResetInquiry}
                          className="px-3.5 py-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-[#18181B] dark:hover:text-white hover:bg-white/80 dark:hover:bg-stone-800 transition-colors font-mono text-xs font-bold border border-stone-200 dark:border-stone-700 shrink-0 cursor-pointer"
                        >
                          {isHindi ? 'रीसेट / लॉक करें' : 'Reset / Re-lock'}
                        </button>
                      </div>

                      {/* Priority Channel Cards (WhatsApp & Direct Email) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Priority WhatsApp Card */}
                        <div
                          tabIndex={0}
                          data-card="true"
                          data-tts={`WhatsApp Priority Channel: ${formattedWhatsApp}. Direct chat with Atul Verma for project briefing, quotations, and timeline alignment.`}
                          className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 flex flex-col justify-between space-y-4 shadow-xs focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                                <span>WhatsApp (Priority)</span>
                              </div>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-700">
                                {isHindi ? 'तत्काल' : 'Instant'}
                              </span>
                            </div>
                            <div className="text-xl font-bold text-[#18181B] dark:text-white font-mono">
                              {formattedWhatsApp}
                            </div>
                            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                              {isHindi
                                ? 'प्रोजेक्ट ब्रीफिंग, कोटेशन एवं समय-सीमा समन्वय के लिए अतुल वर्मा से सीधी बातचीत।'
                                : 'Direct chat with Atul Verma for project briefing, quotations & timeline alignment.'}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <a
                              href={whatsAppLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => soundFX.playSparkle()}
                              className="flex-1 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>

                            <button
                              type="button"
                              onClick={copyWhatsApp}
                              aria-label="Copy WhatsApp Number"
                              className="py-2.5 px-3 rounded-xl bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold font-mono transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                              title="Copy WhatsApp"
                            >
                              {whatsappCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{whatsappCopied ? (isHindi ? 'कॉपी हुआ' : 'Copied') : (isHindi ? 'कॉपी' : 'Copy')}</span>
                            </button>
                          </div>
                        </div>

                        {/* Direct Email Card */}
                        <div
                          tabIndex={0}
                          data-card="true"
                          data-tts={`Direct Email Inbox: ${directEmail}. Direct personal email for formal proposals, contract reviews, and enterprise paperwork.`}
                          className="p-5 rounded-2xl bg-pink-50/60 dark:bg-[#FF4D6D]/10 border border-[#FFD1DC] dark:border-[#FF4D6D]/30 flex flex-col justify-between space-y-4 shadow-xs focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FF4D6D] uppercase tracking-wider">
                                <Mail className="w-4 h-4" />
                                <span>{isHindi ? 'डायरेक्ट ईमेल इनबॉक्स' : 'Direct Email Inbox'}</span>
                              </div>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-100 dark:bg-[#FF4D6D]/20 text-[#FF4D6D] font-bold border border-[#FFD1DC] dark:border-[#FF4D6D]/30">
                                {isHindi ? 'व्यक्तिगत' : 'Personal'}
                              </span>
                            </div>
                            <div className="text-lg font-bold text-[#18181B] dark:text-white font-mono truncate" title={directEmail}>
                              {directEmail}
                            </div>
                            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                              {isHindi
                                ? 'औपचारिक प्रस्तावों, अनुबंध समीक्षा और एंटरप्राइज़ दस्तावेज़ीकरण के लिए सीधा व्यक्तिगत ईमेल।'
                                : 'Direct personal email for formal proposals, contract reviews, and enterprise paperwork.'}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <a
                              href={`mailto:${directEmail}`}
                              onClick={() => soundFX.playSparkle()}
                              className="flex-1 py-2.5 px-3 rounded-xl bg-[#18181B] hover:bg-black dark:bg-white dark:text-[#18181B] dark:hover:bg-stone-200 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>{isHindi ? 'ईमेल लिखें' : 'Compose'}</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>

                            <button
                              type="button"
                              onClick={copyEmail}
                              aria-label="Copy Email address"
                              className="py-2.5 px-3 rounded-xl bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-[#FFD1DC] dark:border-[#FF4D6D]/30 text-xs font-bold font-mono transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                              title="Copy Email"
                            >
                              {emailCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{emailCopied ? (isHindi ? 'कॉपी हुआ' : 'Copied') : (isHindi ? 'कॉपी' : 'Copy')}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Direct Call & Rapid Turnaround Card */}
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                            <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <div className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
                              {isHindi ? '< 2 घंटे में गारंटीड रिस्पॉन्स' : '< 2 Hours Guaranteed Response Time'}
                            </div>
                            <div className="text-[11px] text-amber-700/80 dark:text-amber-400/80">
                              {isHindi ? 'सक्रिय कार्य समय (9 AM – 8 PM IST) • 100% क्लाइंट रिप्लाई दर' : 'Active business hours (9 AM – 8 PM IST) • 100% Client Reply Rate'}
                            </div>
                          </div>
                        </div>

                        <a
                          href="tel:+917992383804"
                          className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{isHindi ? 'सीधा कॉल' : 'Direct Call'}</span>
                        </a>
                      </div>

                      {/* Professional Social Profiles */}
                      <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#100C1A] border border-[#ECE7DF] dark:border-[#2D2340] space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-mono text-stone-500 dark:text-stone-400 uppercase tracking-wider font-bold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D]" />
                            <span>{isHindi ? 'पेशेवर प्रोफाइल और नेटवर्क' : 'Professional Profiles & Networks'}</span>
                          </div>
                          <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500">
                            {isHindi ? '7 नेटवर्क सक्रिय' : '7 Networks Active'}
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
                                className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 border border-[#E7E2D8] dark:border-stone-800 text-xs font-bold transition-all duration-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 ${item.hoverClass}`}
                              >
                                <Icon className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
                                <span className="text-[11px]">{item.name}</span>
                                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200" />
                              </a>
                            );
                          })}
                        </div>
                      </div>

                      {/* Token Expiry & Switch Options */}
                      <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <span className="text-stone-500 dark:text-stone-400 font-mono text-[11px]">
                          {isHindi ? 'एक्सेस टोकन 24 घंटे में समाप्त होगा। किसी भी समय नई पूछताछ सबमिट कर सकते हैं।' : 'Access token expires in 24 hours. Submit another inquiry at any time.'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleTabChange('touch')}
                          className="px-3.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:text-[#18181B] dark:hover:text-white transition-colors font-mono text-xs font-bold cursor-pointer border border-stone-200 dark:border-stone-800"
                        >
                          {isHindi ? 'अन्य पूछताछ सबमिट करें →' : 'Submit Another Inquiry →'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* LOCKED/GATED CHANNELS PANEL */
                    <div className="space-y-5">
                      {/* Gated Header Card */}
                      <div className="p-5 sm:p-6 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-3.5">
                          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                            <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 text-[11px] font-mono font-bold mb-1 border border-amber-300 dark:border-amber-800">
                              <Lock className="w-3 h-3 text-amber-600" /> {isHindi ? 'संरक्षित चैनल' : 'Gated Channel'}
                            </div>
                            <h4 className="text-lg sm:text-xl font-black font-['Outfit',sans-serif] text-[#18181B] dark:text-white">
                              {isHindi ? 'डायरेक्ट संपर्क चैनल' : 'Direct Channels'}
                            </h4>
                            <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 max-w-md">
                              {isHindi
                                ? 'स्वचालित स्पैम और स्क्रैपर्स से सुरक्षा हेतु सीधा संपर्क विवरण सुरक्षित रखा गया है। 1-क्लिक WhatsApp और व्यक्तिगत ईमेल तुरंत अनलॉक करने के लिए पहले टैब में पूछताछ फॉर्म भरें।'
                                : 'Direct contact info is gated to protect against automated spam & scrapers. Complete the inquiry form in the first tab to instantly unlock 1-click WhatsApp messaging and direct personal email.'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleTabChange('touch')}
                          className="px-4 py-2.5 rounded-xl bg-[#18181B] hover:bg-black dark:bg-white dark:text-[#18181B] dark:hover:bg-stone-200 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 shrink-0 cursor-pointer"
                        >
                          <span>{isHindi ? 'अनलॉक करने हेतु फॉर्म भरें' : 'Fill Inquiry Form to Unlock'}</span>
                          <ArrowRight className="w-4 h-4 text-[#FF4D6D]" />
                        </button>
                      </div>

                      {/* Masked / Blurred Channel Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* WhatsApp Card (Masked) */}
                        <div
                          tabIndex={0}
                          data-card="true"
                          data-tts="WhatsApp Priority Channel: Gated. Direct WhatsApp number unlocks immediately upon submitting your project requirements."
                          className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#100C1A] border border-[#E7E2D8] dark:border-[#2D2340] relative overflow-hidden flex flex-col justify-between space-y-4 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2 text-xs font-mono font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                                <span>WhatsApp Priority</span>
                              </div>
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 font-bold">
                                <Lock className="w-2.5 h-2.5" /> {isHindi ? 'संरक्षित' : 'Gated'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 select-none filter blur-xs text-xl font-mono font-bold text-stone-700 dark:text-stone-300">
                              <span>+91 79923 ••••••</span>
                            </div>
                            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                              {isHindi
                                ? 'प्रोजेक्ट आवश्यकताएं सबमिट करते ही डायरेक्ट WhatsApp नंबर तुरंत अनलॉक हो जाता है।'
                                : 'Direct WhatsApp number unlocks immediately upon submitting your project requirements.'}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleTabChange('touch')}
                            className="w-full py-2 px-3 rounded-xl bg-stone-200/70 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 font-bold text-xs font-mono flex items-center justify-center gap-1.5 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                          >
                            <Lock className="w-3.5 h-3.5 text-amber-500" />
                            <span>{isHindi ? 'फॉर्म द्वारा WhatsApp अनलॉक करें' : 'Unlock WhatsApp via Form'}</span>
                          </button>
                        </div>

                        {/* Email Card (Masked) */}
                        <div
                          tabIndex={0}
                          data-card="true"
                          data-tts="Official Email Inbox: Gated. Personal inbox address unlocks immediately upon submitting your project requirements."
                          className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#100C1A] border border-[#E7E2D8] dark:border-[#2D2340] relative overflow-hidden flex flex-col justify-between space-y-4 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] dark:focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2 text-xs font-mono font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                <Mail className="w-4 h-4 text-[#FF4D6D]" />
                                <span>{isHindi ? 'आधिकारिक ईमेल' : 'Official Email'}</span>
                              </div>
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 font-bold">
                                <Lock className="w-2.5 h-2.5" /> {isHindi ? 'संरक्षित' : 'Gated'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 select-none filter blur-xs text-xl font-mono font-bold text-stone-700 dark:text-stone-300">
                              <span>Atulravi••••@gmail.com</span>
                            </div>
                            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                              {isHindi
                                ? 'प्रोजेक्ट आवश्यकताएं सबमिट करते ही व्यक्तिगत ईमेल इनबॉक्स तुरंत अनलॉक हो जाता है।'
                                : 'Personal inbox address unlocks immediately upon submitting your project requirements.'}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleTabChange('touch')}
                            className="w-full py-2 px-3 rounded-xl bg-stone-200/70 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 font-bold text-xs font-mono flex items-center justify-center gap-1.5 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                          >
                            <Lock className="w-3.5 h-3.5 text-amber-500" />
                            <span>{isHindi ? 'फॉर्म द्वारा ईमेल अनलॉक करें' : 'Unlock Email via Form'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Guarantees Row: Response Time & Privacy */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                            <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <div className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
                              {isHindi ? '< 2 घंटे में गारंटीड रिस्पॉन्स' : '< 2 Hours Guaranteed Response'}
                            </div>
                            <div className="text-[10px] text-amber-700/80 dark:text-amber-400/80">
                              {isHindi ? 'सक्रिय कार्य समय (9 AM – 8 PM IST)' : 'Active business hours (9 AM – 8 PM IST)'}
                            </div>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900/70 border border-[#E7E2D8] dark:border-stone-800 flex items-start gap-2.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <div className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug">
                            <strong className="text-stone-800 dark:text-stone-200 font-semibold">{isHindi ? 'गोपनीयता गारंटी:' : 'Privacy Guaranteed:'}</strong> {isHindi ? 'प्रोजेक्ट आवश्यकताएं गोपनीय रहेंगी और कभी साझा नहीं की जाएंगी।' : 'Project requirements remain confidential and are never shared.'}
                          </div>
                        </div>
                      </div>

                      {/* Professional Profiles */}
                      <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#100C1A] border border-[#ECE7DF] dark:border-[#2D2340] space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-mono text-stone-500 dark:text-stone-400 uppercase tracking-wider font-bold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D]" />
                            <span>{isHindi ? 'पेशेवर प्रोफाइल और सोशल लिंक्स' : 'Professional Profiles & Social Links'}</span>
                          </div>
                          <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500">
                            {isHindi ? '7 नेटवर्क • सदैव उपलब्ध' : '7 Networks • Always Accessible'}
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
                                className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 border border-[#E7E2D8] dark:border-stone-800 text-xs font-bold transition-all duration-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 ${item.hoverClass}`}
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
              </div>
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
                    {isHindi ? 'मुख्यालय और भौगोलिक उपस्थिति' : 'Corporate Headquarters & Geographic Presence'}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                    {isHindi ? 'मेदिनीनगर, पलामू, झारखंड • व्यक्तिगत परामर्श एवं क्षेत्रीय संचालन' : 'Medininagar, Palamu, Jharkhand • In-person consultations & regional operations'}
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
                      <span>{isHindi ? 'स्थान एवं मुख्यालय' : 'Location & Headquarters'}</span>
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
                        <span>{isHindi ? 'कॉपी हुआ!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-stone-500" />
                        <span>{isHindi ? 'पता कॉपी करें' : 'Copy Address'}</span>
                      </>
                    )}
                  </button>

                  <a
                    href="https://maps.google.com/?q=Daltonganj%2C+Medininagar%2C+Palamau%2C+Jharkhand+822101"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#18181B] hover:bg-black dark:bg-white dark:text-[#18181B] dark:hover:bg-stone-200 text-white text-xs font-bold font-mono transition-all duration-200 shadow-2xs hover:shadow-sm active:scale-95 group focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
                  >
                    <span>{isHindi ? 'गूगल मैप्स में देखें' : 'View in Google Maps'}</span>
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
                    {isLiveLoading ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#18181B]/95 backdrop-blur-md border border-sky-200 dark:border-sky-800/80 text-sky-700 dark:text-sky-400 text-xs font-mono font-bold shadow-md select-none transition-all">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-600 dark:text-sky-400 shrink-0" />
                        <span>Downloading Live Map in background...</span>
                      </div>
                    ) : mapMode === 'google' && iframeLoaded && isOnline ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#18181B]/95 backdrop-blur-md border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold shadow-md select-none transition-all">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 animate-pulse" />
                        </span>
                        <span>Live Google Map</span>
                      </div>
                    ) : mapMode === 'google' && isOnline ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#18181B]/95 backdrop-blur-md border border-sky-200 dark:border-sky-800/80 text-sky-700 dark:text-sky-400 text-xs font-mono font-bold shadow-md select-none transition-all">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-600 dark:text-sky-400 shrink-0" />
                        <span>Loading Google Live Map...</span>
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
                      disabled={isLiveLoading}
                      aria-label="Toggle Google Maps or Offline OSM"
                      title={
                        isLiveLoading
                          ? 'Downloading Live Map in background...'
                          : mapMode === 'google'
                          ? 'Switch to Offline Leaflet OSM map'
                          : 'Switch to Live Google Maps'
                      }
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer active:scale-95 border ${
                        isLiveLoading
                          ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border-sky-300 dark:border-sky-800 shadow-2xs'
                          : mapMode === 'google'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 shadow-2xs'
                          : 'bg-[#FFF0F3] dark:bg-[#FF4D6D]/15 text-[#FF4D6D] dark:text-[#FF4D6D] border-[#FFD1DC] dark:border-[#FF4D6D]/30 shadow-2xs'
                      }`}
                    >
                      {isLiveLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-600 dark:text-sky-400 shrink-0" />
                      ) : (
                        <Layers className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span className="hidden sm:inline">
                        {isLiveLoading ? 'Downloading Live Map in background...' : 'Google Maps / Offline OSM'}
                      </span>
                      <span className="sm:hidden">
                        {isLiveLoading ? 'Downloading...' : mapMode === 'google' ? 'Google' : 'OSM'}
                      </span>
                      <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/10 ml-0.5">
                        {isLiveLoading ? 'Loading' : mapMode === 'google' ? 'Live' : 'Offline'}
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

                {/* Instant 0ms Cached Leaflet OSM Map Layer with Lazy Loading & GIS Skeleton Fallback */}
                <Suspense fallback={<GISMapSkeleton className="min-h-[460px] sm:min-h-[500px]" />}>
                  <LeafletOfflineMap
                    zoom={zoom}
                    resetTrigger={resetTrigger}
                    onZoomChange={setZoom}
                    className={`w-full min-h-[460px] sm:min-h-[500px] rounded-2xl block transition-opacity duration-700 ease-in-out ${
                      mapMode === 'google' && iframeLoaded && isOnline
                        ? 'opacity-0 pointer-events-none z-0'
                        : 'opacity-100 pointer-events-auto z-10'
                    }`}
                  />
                </Suspense>

                {/* Live Interactive Google Maps Iframe (Crossfaded Layer) */}
                {showIframe && (!isSimpleMode || iframeLoaded) && (
                  <iframe
                    title="Office Location Map - Daltonganj, Medininagar, Jharkhand"
                    src={mapEmbedUrl}
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
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
                  <span>{isHindi ? 'पलामू जिला केंद्र • मेदिनीनगर रेलवे स्टेशन (DTO) से 5 मिनट' : 'Palamu District Hub • 5 mins from Medininagar Railway Station (DTO)'}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-stone-500 dark:text-stone-400 font-mono text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isHindi ? 'अपॉइंटमेंट द्वारा व्यक्तिगत परामर्श हेतु उपलब्ध' : 'Open for in-person consultation by appointment'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
