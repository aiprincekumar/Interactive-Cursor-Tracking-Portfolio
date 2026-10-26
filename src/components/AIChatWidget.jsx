/* oxlint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  BotMessageSquare,
  X,
  Minus,
  Maximize2,
  Minimize2,
  GripHorizontal,
  ChevronUp,
  ChevronDown,
  Send,
  RotateCcw,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Briefcase,
  FileText,
  MessageCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  Monitor,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Download,
  DownloadCloud,
  Cpu,
  Bot,
  Square,
  ThumbsUp,
  ThumbsDown,
  History,
  Trash2,
  Plus,
  Compass,
  Zap,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { useFocusTrap } from '../hooks/useFocusTrap.js';
import { useLab, useLabChat, useLabAudio, useLabDrawer, DEFAULT_AI_CHAT_SETTINGS } from '../context/LabContext';
import { useRole } from '../context/RoleContext';
import { useAudience } from '../context/AudienceContext';
import { useViewMode, VIEW_MODES } from '../context/ViewModeContext';
import { useAnnounce } from '../context/AnnouncerContext';
import { localAIService } from '../services/localAIService.js';
import { MODEL_CATALOG, getBareMinimumModel } from '../utils/deviceProfiler.js';
import {
  queryAssistant,
  getInitialSuggestions,
  clearSessionMemory,
  resetConversationalContext,
  cleanMarkdownAsterisks,
  tuneResponseEmojis,
  getOnboardingDecisionTree,
  CHAT_SLASH_COMMANDS
} from '../utils/portfolioAssistantEngine.js';
import { exportTranscript, copyTranscriptToClipboard } from '../utils/chatExportEngine.js';
import {
  listSessions,
  saveSession,
  loadSession,
  deleteSession,
  clearAllSessions,
  getCurrentSessionId,
  setCurrentSessionId
} from '../utils/chatSessionStorage.js';
import {
  recordMessageLatency,
  recordMessageFeedback,
  recordDomainInteraction,
  resetAnalytics
} from '../utils/chatAnalytics.js';
import FormattedMessage from './chat/FormattedMessage.jsx';
import SuggestionChipsDrawer from './chat/SuggestionChipsDrawer.jsx';
import SlashCommandPalette from './chat/SlashCommandPalette.jsx';
import ChatActionCard from './chat/ChatActionCard.jsx';
import {
  startTour,
  nextTourStep,
  prevTourStep,
  endTour,
  getActiveTourState,
  subscribeTourState
} from '../utils/chatTourEngine.js';
import { searchPortfolio } from '../utils/portfolioSemanticIndex.js';
import VoiceVisualizerWaveform from './chat/VoiceVisualizerWaveform.jsx';
import {
  VOICE_STATES,
  getVoiceConfig,
  setVoiceConfig,
  getVoiceState,
  setVoiceState,
  subscribeVoiceState,
  speakText,
  stopSpeaking,
  pauseSpeech,
  resumeSpeech
} from '../utils/voiceAgentEngine.js';

const cleanPlainText = (text) => cleanTextForSpeech(text);

/**
 * Detects domain classification from query text for zero-cloud telemetry
 */
export function detectDomainFromQuery(text = '') {
  const lower = String(text || '').toLowerCase();
  if (lower.includes('tax') || lower.includes('gst') || lower.includes('tds') || lower.includes('itr')) return 'tax';
  if (lower.includes('account') || lower.includes('ledger') || lower.includes('tally') || lower.includes('audit')) return 'accounting';
  if (lower.includes('mis') || lower.includes('excel') || lower.includes('power bi') || lower.includes('dashboard') || lower.includes('vba')) return 'mis';
  if (lower.includes('ai') || lower.includes('llm') || lower.includes('gpu') || lower.includes('model') || lower.includes('quant')) return 'ai';
  if (lower.includes('project') || lower.includes('case study') || lower.includes('work')) return 'projects';
  if (lower.includes('salary') || lower.includes('hire') || lower.includes('resume') || lower.includes('cv') || lower.includes('career')) return 'career';
  if (lower.startsWith('/')) return 'navigation';
  return 'general';
}

/**
 * Strips markdown symbols, URLs, and emojis for clean speech synthesis read-aloud
 */
export function cleanTextForSpeech(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*#_~`>]/g, ' ')
    .replace(/[•●▪■◆★☆✓✔✕✖]/g, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]|\u{FE0F}/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Formats a message timestamp into a friendly human-readable time string
 */
export function formatTime(timestamp) {
  if (!timestamp) return 'just now';
  if (typeof timestamp === 'string') return timestamp;
  try {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return String(timestamp);
  }
}
import { getResumeConfig } from '../utils/resumeConfig.js';

export const UNIFIED_AUDIENCE_OPTIONS = [
  { id: 'recruiter', label: '💼 Recruiter / Hiring', audience: 'recruiter' },
  { id: 'client', label: '🤝 Client / Projects', audience: 'client' },
  { id: 'marriage', label: '💍 Matrimonial Biodata', audience: 'marriage' },
  { id: 'all', label: '🚀 General Explorer', audience: 'all' },
  { id: 'skip', label: '⏩ Skip', isSkip: true },
  { id: 'other', label: '✏️ Other / Specify', isOther: true }
];

export const UNIFIED_ROLE_OPTIONS = [
  { id: 'accountant', label: '📊 Corporate Accountant', role: 'accountant' },
  { id: 'mis', label: '📑 MIS Operations Lead', role: 'mis' },
  { id: 'vibe_coding', label: '💻 AI Vibe Coder & Engineer', role: 'vibe_coding' },
  { id: 'other', label: '✨ BI & Controller', role: 'other' },
  { id: 'overview', label: '🎯 Executive Overview', role: 'overview' },
  { id: 'skip', label: '⏩ Skip', isSkip: true },
  { id: 'other', label: '✏️ Other / Specify', isOther: true }
];

export const UNIFIED_VIEW_MODE_OPTIONS = [
  { id: 'modern', label: '⚡ Modern / Interactive', viewMode: 'modern' },
  { id: 'simple', label: '🍃 Simple / Classic', viewMode: 'simple' },
  { id: 'basic', label: '📄 Basic / PDF', viewMode: 'basic' },
  { id: 'terminal', label: '💻 Terminal / Developer', viewMode: 'terminal' },
  { id: 'skip', label: '⏩ Skip', isSkip: true },
  { id: 'other', label: '✏️ Other / Specify', isOther: true }
];

export const DEFAULT_PREFERENCES_PROMPT_OPTIONS = [
  { id: 'customize_yes', label: '✨ हाँ, प्राथमिकताएं बदलें / Yes, Customize', action: 'customize_yes' },
  { id: 'customize_no', label: '✓ नहीं, यही रहने दें / No, Keep Current', action: 'customize_no' }
];

export const AI_MODEL_CONSENT_OPTIONS = [
  { id: 'ai_model_download_yes', label: '⚡ हाँ, डाउनलोड करो', isAiConsent: true, consent: 'enabled' },
  { id: 'ai_model_download_no', label: 'नहीं, रहने दो', isAiConsent: true, consent: 'declined' }
];

export function getAudienceLabel(aud) {
  const match = UNIFIED_AUDIENCE_OPTIONS.find((o) => o.audience === aud || o.id === aud);
  return match ? match.label : '🌐 All (No Filter)';
}

export function getRoleLabel(r) {
  const match = UNIFIED_ROLE_OPTIONS.find((o) => o.role === r || o.id === r);
  return match ? match.label : '🎯 Executive Overview';
}

export function getViewModeLabel(vm) {
  const match = UNIFIED_VIEW_MODE_OPTIONS.find((o) => o.viewMode === vm || o.id === vm);
  return match ? match.label : '⚡ Modern / Interactive';
}

/**
 * Dynamic state coloring for header action icons
 */
export function getAudienceColorStyle(aud) {
  switch (aud) {
    case 'recruiter':
      return 'text-[#FF4D6D] bg-[#FF4D6D]/15 ring-1 ring-[#FF4D6D]/40';
    case 'client':
      return 'text-[#9333EA] bg-[#9333EA]/15 ring-1 ring-[#9333EA]/40';
    case 'marriage':
      return 'text-fuchsia-500 bg-fuchsia-500/15 ring-1 ring-fuchsia-500/40';
    case 'all':
    default:
      return 'text-indigo-500 bg-indigo-500/15 ring-1 ring-indigo-500/40';
  }
}

export function getRoleColorStyle(r) {
  switch (r) {
    case 'accountant':
      return 'text-emerald-500 bg-emerald-500/15 ring-1 ring-emerald-500/40';
    case 'mis':
      return 'text-blue-500 bg-blue-500/15 ring-1 ring-blue-500/40';
    case 'vibe_coding':
      return 'text-purple-500 bg-purple-500/15 ring-1 ring-purple-500/40';
    case 'other':
      return 'text-amber-500 bg-amber-500/15 ring-1 ring-amber-500/40';
    case 'overview':
    default:
      return 'text-indigo-500 bg-indigo-500/15 ring-1 ring-indigo-500/40';
  }
}

export function getViewModeColorStyle(vm) {
  switch (vm) {
    case 'modern':
      return 'text-cyan-500 bg-cyan-500/15 ring-1 ring-cyan-500/40';
    case 'terminal':
      return 'text-green-500 bg-green-500/15 ring-1 ring-green-500/40';
    case 'simple':
      return 'text-amber-500 bg-amber-500/15 ring-1 ring-amber-500/40';
    case 'basic':
    default:
      return 'text-slate-500 bg-slate-500/15 ring-1 ring-slate-500/40';
  }
}

export function getAIModelColorStyle(localAiState) {
  if (localAiState?.status === 'ready' && localAiState?.activeModel) {
    return 'text-emerald-500 bg-emerald-500/15 ring-1 ring-emerald-500/40';
  }
  if (
    localAiState?.status === 'switching' ||
    localAiState?.status === 'downloading' ||
    localAiState?.status === 'loading_cache'
  ) {
    return 'text-amber-500 bg-amber-500/15 ring-1 ring-amber-500/40 animate-pulse';
  }
  return 'text-stone-400 bg-stone-100 dark:bg-stone-800';
}

/**
 * Session storage key and module memory cache for session-scoped persistence
 */
const SESSION_STORAGE_KEY = 'portfolio_ai_chat_session';
let inMemoryMessagesCache = null;

/**
 * Verified default suggested prompt chips (10 rich compact suggestions in 2-row grid)
 */
const PROMPT_CHIPS = [
  { id: 'projects', label: '🚀 Projects', query: 'Tell me about your featured projects', category: 'projects' },
  { id: 'tech', label: '⚡ Tech Stack', query: 'What is your core tech stack and skills?', category: 'tech' },
  { id: 'experience', label: '💼 Experience', query: 'Summarize your professional experience', category: 'experience' },
  { id: 'pricing', label: '💰 Pricing', query: 'Estimate quotation and service fees', category: 'hire' },
  { id: 'resume', label: '📄 Resume', query: 'Download verified professional resume', category: 'hire' },
  { id: 'gst', label: '📊 GST & Tax', query: 'Tell me about GST, ITR, and accounting practice', category: 'tax' },
  { id: 'itc', label: '📑 ITC & GSTR-2B', query: 'Explain GST ITC matching and GSTR-2B reconciliation', category: 'tax' },
  { id: 'tally', label: '📈 Tally Prime & BRS', query: 'Tell me about Tally Prime and bank reconciliation', category: 'tax' },
  { id: 'audit', label: '🔍 Audit & Ledgers', query: 'Tell me about balance sheet audit and financial controls', category: 'tax' },
  { id: 'powerbi', label: '📉 Power BI', query: 'Tell me about Power BI and Excel automation', category: 'tech' },
  { id: 'ai', label: '🤖 AI & SaaS', query: 'Tell me about AI prompt-to-SaaS and multi-agent workflows', category: 'tech' },
  { id: 'engineer', label: '⚡ /engineer', query: '/engineer', category: 'tech' },
  { id: 'contact', label: '📬 Contact', query: 'How can I get in touch or hire you?', category: 'hire' }
];

/**
 * Standard welcome message template with verified preview greeting string
 */
const DEFAULT_WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  sender: 'assistant',
  modelShortcut: '[Portfolio-Engine]',
  text: "Hi there! 👋 Welcome to Atul's Portfolio Assistant.\n\nक्या आप इन प्राथमिकताओं को बदलना चाहते हैं? / Would you like to customize your preferences?",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  chips: PROMPT_CHIPS,
  summaryCard: {
    audience: '🌐 General Explorer',
    role: '🎯 Executive Overview',
    viewMode: '⚡ Modern / Interactive'
  },
  decisionTree: {
    step: 'preferences_prompt',
    title: 'क्या आप इन प्राथमिकताओं को बदलना चाहते हैं? / Would you like to customize your preferences?',
    options: DEFAULT_PREFERENCES_PROMPT_OPTIONS
  }
};

/**
 * Curated authentic knowledge base for Atul AI Assistant local responses
 */
const KNOWLEDGE_RESPONSES = {
  projects: `🚀 **Featured Flagship Projects:**\n\n• **GST & Income Tax Verification Engine (Case Study 01)**: Comprehensive tax automation for GSTR-1, 3B, 2B matching & audit preparation.\n• **Tally Prime Financial ERP (Case Study 02)**: Multi-branch inventory, BRS reconciliation, and ledger hygiene.\n• **DAY-NULM Skill India MIS Reporting (Case Study 03)**: Multi-district government skill training tracking and beneficiary monitoring.\n• **AI Prompt-to-Fullstack SaaS Generator (Case Study 07)**: Full-stack prompt-driven scaffolding platform with React, Node, and Tailwind.\n• **Autonomous Multi-Agent Workflow Engine (Case Study 08)**: Self-healing task execution pipelines and tool calling.\n\n✨ Use the direct action buttons below to open interactive case study dossiers!`,
  tech: `💻 **Core Tech Stack & Architectures:**\n\n• **Accounting & Finance**: Tally Prime ERP 9, GST Portal, Income Tax E-Filing, BRS, Balance Sheet Audit.\n• **Data Intelligence & MIS**: Advanced Excel (VBA/Macros, Power Query), Power BI Dashboards, SQL, Data Cleaning.\n• **AI & Web Engineering**: React 18/19, Vite, Tailwind CSS v4, Node.js, Web Audio API, Google Antigravity SDK, Claude Code harnesses, Agentic MCP.\n• **Deployment & Tooling**: Docker, Git, CI/CD pipelines, GitHub Pages, Vercel, Supabase.`,
  experience: `💼 **Career Experience & Proven Track Record (10+ Years):**\n\n• **Senior Accountant & Tax Consultant** (2018–Present): 500+ returns, ₹2.5Cr+ ITC verified, zero penalty notices.\n• **MIS Executive** — DAY-NULM Skill India (2016–2018): Multi-district portal reporting and attendance tracking.\n• **Smart Card Operations Lead** (2012–2016): 50,000+ biometric enrollments across 12+ districts.\n• **AI Vibe Coder & Systems Engineer** (2024–Present): Autonomous multi-agent pipelines and rapid SaaS prototyping.\n\nCheck the **Journey & Experience** section for the complete timeline!`,
  contact: `📬 **Let's Connect Directly:**\n\n• **WhatsApp Direct**: +91 7992383804 (instant response).\n• **Fee Estimator**: Click the button below to calculate project quote.\n• **Direct Email & Socials**: Check the footer links for GitHub and LinkedIn!`,
  default: `Thanks for asking! 👋 I am Atul's AI Assistant preview. Feel free to ask about Atul's projects, skills, experience, quotation services, or use the quick suggestion chips below!`
};

/**
 * Local fallback bot response generator
 */
function generateBotReply(userText) {
  const lower = userText.toLowerCase();
  if (lower.includes('project') || lower.includes('work') || lower.includes('app') || lower.includes('policy') || lower.includes('case study')) {
    return KNOWLEDGE_RESPONSES.projects;
  }
  if (lower.includes('stack') || lower.includes('tech') || lower.includes('react') || lower.includes('node') || lower.includes('skill') || lower.includes('tally') || lower.includes('excel')) {
    return KNOWLEDGE_RESPONSES.tech;
  }
  if (lower.includes('exp') || lower.includes('about') || lower.includes('background') || lower.includes('who is') || lower.includes('journey')) {
    return KNOWLEDGE_RESPONSES.experience;
  }
  if (lower.includes('contact') || lower.includes('hire') || lower.includes('whatsapp') || lower.includes('email') || lower.includes('reach') || lower.includes('quote') || lower.includes('price')) {
    return KNOWLEDGE_RESPONSES.contact;
  }
  return KNOWLEDGE_RESPONSES.default;
}

function AIChatWidget() {
  // Safe access to Lab Context for drawer offset, sound settings, and AI chat settings
  let soundEnabled = true;
  let isDrawerOpen = false;
  let openDrawer = null;
  let setActiveTab = null;
  let chatSettings = DEFAULT_AI_CHAT_SETTINGS;
  let updateChatSettings = () => {};

  try {
    const labContext = useLab();
    if (labContext?.openDrawer) openDrawer = labContext.openDrawer;
    if (labContext?.setActiveTab) setActiveTab = labContext.setActiveTab;
  } catch {
    // safe fallback
  }

  try {
    const labDrawer = useLabDrawer();
    isDrawerOpen = labDrawer?.isDrawerOpen ?? false;
    if (!openDrawer && labDrawer?.openDrawer) openDrawer = labDrawer.openDrawer;
    if (!setActiveTab && labDrawer?.setActiveTab) setActiveTab = labDrawer.setActiveTab;
  } catch {
    // safe fallback
  }

  try {
    const labAudio = useLabAudio();
    soundEnabled = labAudio?.soundEnabled ?? true;
  } catch {
    // safe fallback
  }

  try {
    const labChat = useLabChat();
    if (labChat?.chatSettings) chatSettings = labChat.chatSettings;
    if (labChat?.updateChatSettings) updateChatSettings = labChat.updateChatSettings;
  } catch {
    // safe fallback
  }

  // Safe access to Role Context
  let roleContext = null;
  try {
    roleContext = useRole();
  } catch {
    // safe fallback
  }
  const activeRole = roleContext?.activeRole || 'overview';
  const roleData = roleContext?.roleData || roleContext?.activeTrack || {
    id: 'overview',
    label: 'Overview',
    shortLabel: 'Overview',
    accent: '#6366F1'
  };
  const selectRole = roleContext?.selectRole || roleContext?.setActiveRole;

  // Safe access to Audience Context
  let audienceContext = null;
  try {
    audienceContext = useAudience();
  } catch {
    // safe fallback
  }
  const audience = audienceContext?.audience || 'all';
  const activeAudienceData = audienceContext?.activeModeData || {
    id: 'all',
    label: 'All (No Filter)',
    shortLabel: 'All',
    emoji: '🌐',
    accent: '#6366F1'
  };
  const setAudience = audienceContext?.setAudience;

  // Safe access to View Mode Context
  let viewModeContext = null;
  try {
    viewModeContext = useViewMode();
  } catch {
    // safe fallback
  }
  const viewMode = viewModeContext?.viewMode || 'modern';
  const selectViewMode = viewModeContext?.selectViewMode || (() => {});
  const activeViewModeData = VIEW_MODES[viewMode] || VIEW_MODES.modern;

  // Safe access to Announcer Context
  let announcerContext = null;
  try {
    announcerContext = useAnnounce();
  } catch {
    // safe fallback
  }
  const announceFromContext = announcerContext?.announce;
  const announce = useCallback((msg, p) => {
    if (typeof announceFromContext === 'function') {
      announceFromContext(msg, p);
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('portfolio:announce', { detail: { message: msg, priority: p || 'polite' } })
      );
    }
  }, [announceFromContext]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState(null); // { x: number, y: number } | null
  const [dimensions, setDimensions] = useState(null); // { width: number, height: number } | null
  const [preMaximizeState, setPreMaximizeState] = useState(null);

  // Mobile viewport detection reactive to resizing
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth < 640;
  });

  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isOpen]);

  // Reduced motion preference detection (system preference)
  const [systemReducedMotion, setSystemReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (!isOpen || typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setSystemReducedMotion(e.matches);
    if (mql.addEventListener) {
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    } else if (mql.addListener) {
      mql.addListener(handler);
      return () => mql.removeListener(handler);
    }
  }, [isOpen]);

  const prefersReducedMotion = Boolean(systemReducedMotion);

  // Phase 10: Interactive Tour Engine state & subscriptions
  const [activeTour, setActiveTour] = useState(() => getActiveTourState());

  useEffect(() => {
    const unsub = subscribeTourState((state) => {
      setActiveTour(state);
    });
    const handleTourStep = () => {
      setActiveTour(getActiveTourState());
    };
    const handleTourEnd = () => {
      setActiveTour(getActiveTourState());
    };
    window.addEventListener('portfolio:tour-step', handleTourStep);
    window.addEventListener('portfolio:tour-end', handleTourEnd);
    return () => {
      unsub();
      window.removeEventListener('portfolio:tour-step', handleTourStep);
      window.removeEventListener('portfolio:tour-end', handleTourEnd);
    };
  }, []);

  const [inputValue, setInputValue] = useState('');
  const inputValueRef = useRef('');
  inputValueRef.current = inputValue;
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const activeRequestIdRef = useRef(null);
  const streamIntervalRef = useRef(null);

  const handleStopGenerating = useCallback(() => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    if (activeRequestIdRef.current) {
      localAIService.cancelGeneration(activeRequestIdRef.current);
      activeRequestIdRef.current = null;
    }
    setIsStreaming(false);
    setIsTyping(false);
    soundFX.triggerHaptic(20);
  }, []);

  const [emojiEnabled, setEmojiEnabled] = useState(true);
  const [inlineSpecifyMsgId, setInlineSpecifyMsgId] = useState(null);
  const [inlineSpecifyText, setInlineSpecifyText] = useState('');
  const [skippedDecisionTreeMsgIds, setSkippedDecisionTreeMsgIds] = useState(new Set());
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [activeSlashIndex, setActiveSlashIndex] = useState(0);
  const [localAiState, setLocalAiState] = useState(() => localAIService.getState());
  const [modelToast, setModelToast] = useState(null);
  const [isDownloadCollapsed, setIsDownloadCollapsed] = useState(false);
  const isAiOn = (localAiState?.status === 'ready' && localAiState?.activeModel !== null) || localAiState?.status === 'downloading' || localAiState?.status === 'loading_cache';

  // Phase 9: Multi-session and Export UI states
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [savedSessions, setSavedSessions] = useState(() => listSessions());
  const [activeSessionId, setActiveSessionId] = useState(() => {
    return getCurrentSessionId() || `session_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  });

  // Phase 11: Voice Agent state & configuration
  const [voiceEngineState, setVoiceEngineState] = useState(() => getVoiceState());
  const [voiceConfig, setVoiceConfigState] = useState(() => getVoiceConfig());
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  // Phase 1: Quick Tools Popover State & Ref
  const [showQuickTools, setShowQuickTools] = useState(false);
  const quickToolsRef = useRef(null);

  // Close Quick Tools popover & Export menu on outside click or Escape
  useEffect(() => {
    if (!showQuickTools && !showExportMenu) return;
    const handleClickOutside = (e) => {
      if (quickToolsRef.current && !quickToolsRef.current.contains(e.target)) {
        setShowQuickTools(false);
        setShowExportMenu(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowQuickTools(false);
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showQuickTools, showExportMenu]);

  // Phase 3: Model Download Confirmation Dialog & Consent State
  const [pendingModelDownload, setPendingModelDownload] = useState(null);
  const [rememberConsentChoice, setRememberConsentChoice] = useState(false);

  useEffect(() => {
    const unsub = subscribeVoiceState(({ state, config }) => {
      setVoiceEngineState(state);
      setVoiceConfigState(config);
      if (state === VOICE_STATES.IDLE && speakingMsgId !== null) {
        setSpeakingMsgId(null);
      }
    });
    return unsub;
  }, [speakingMsgId]);

  // Whenever History Drawer opens, refresh saved sessions
  useEffect(() => {
    if (showHistoryDrawer) {
      setSavedSessions(listSessions());
    }
  }, [showHistoryDrawer]);

  // Trigger silent on-device model background download when chat opens (guarded against duplicate triggers & unconsented downloads)
  useEffect(() => {
    if (isOpen) {
      try {
        const currentState = localAIService.getState();
        let isConsentDeclined = false;
        try {
          const consent = typeof window !== 'undefined' ? localStorage.getItem('portfolio_ai_model_consent') : null;
          if (consent === 'disabled' || consent === 'declined') {
            isConsentDeclined = true;
          }
        } catch {
          // ignore
        }

        const shouldLoadOnOpen = (chatSettings?.loadTrigger === 'on_open') && (chatSettings?.consentMode === 'auto_confirm');

        if (
          shouldLoadOnOpen &&
          currentState.status === 'idle' &&
          !currentState.activeModel &&
          !currentState.downloadingModel &&
          !currentState.isModelLoading &&
          currentState.isAiEnabled !== false &&
          !isConsentDeclined
        ) {
          localAIService.initSilentDownload();
        }
      } catch (err) {
        console.warn('[AIChatWidget] Silent preload on open warning:', err);
      }
    }
  }, [isOpen, chatSettings?.loadTrigger, chatSettings?.consentMode]);

  // Subscribe to On-Device AI events and notifications (deferred until chat opened)
  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = localAIService.subscribe((state) => {
      setLocalAiState(state);
      if (state.lastNotification) {
        const notif = state.lastNotification;
        if (notif.type === 'ready') {
          // Zero Irritation: do not show toast on cache load (silent: true)
          if (!notif.silent) {
            setModelToast(notif.message);
            if (typeof announce === 'function') {
              announce(notif.message, 'polite');
            }
            setTimeout(() => setModelToast(null), 6000);
          }
        } else if (notif.type === 'switching') {
          const noticeMsg = notif.notice || notif.message || 'Your new model is loading in chat box...';
          setModelToast(noticeMsg);
          if (typeof announce === 'function') {
            announce(noticeMsg, 'polite');
          }
          setTimeout(() => setModelToast(null), 5000);
        } else if (notif.type === 'auto_downgrade' || notif.type === 'downgrade' || notif.type === 'offline_fallback' || notif.type === 'device_lost') {
          const noticeMsg = notif.notice || notif.message || '⚡ आपके डिवाइस की स्मूथनेस और तेज़ गति बनाए रखने के लिए अनुकूलित मॉडल सक्रिय कर दिया गया है।';
          setModelToast(noticeMsg);
          if (typeof announce === 'function') {
            announce(noticeMsg, 'polite');
          }
          setTimeout(() => setModelToast(null), 6000);
        }
      }
    });
    return () => unsubscribe();
  }, [isOpen, announce]);

  const lastDowngradedRef = useRef(null);
  const lastSwitchingNoticeRef = useRef(null);
  const availableVoicesRef = useRef([]);
  const recognitionRef = useRef(null);
  const toggleMaximizeRef = useRef(null);
  const modelSwitchDebounceTimerRef = useRef(null);

  // Clean up model switcher debounce timer on unmount
  useEffect(() => {
    return () => {
      if (modelSwitchDebounceTimerRef.current) {
        clearTimeout(modelSwitchDebounceTimerRef.current);
      }
    };
  }, []);

  // Pre-load and synchronize SpeechSynthesis voices for Chromium / Windows (deferred until chat opened)
  useEffect(() => {
    if (!isOpen) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      try {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          availableVoicesRef.current = voices;
        }
      } catch (err) {
        console.warn('SpeechSynthesis voice loading error:', err);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
        } catch {}
      }
    };
  }, [isOpen]);

  // Global Keyboard Shortcuts (Ctrl+K, Alt+C to toggle; Escape to minimize; Ctrl+M to maximize)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleGlobalKeydown = (e) => {
      // Toggle chat shortcut: Ctrl+K or Alt+C
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.altKey && e.key.toLowerCase() === 'c')) {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) {
            setIsMinimized(false);
            return true;
          }
          return false;
        });
        return;
      }

      // Maximize / Restore shortcut: Ctrl+M / Cmd+M
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm' && isOpen && !isMinimized) {
        const isMobileScreen = typeof window !== 'undefined' && window.innerWidth < 640;
        if (!isMobileScreen && toggleMaximizeRef.current) {
          e.preventDefault();
          toggleMaximizeRef.current();
          return;
        }
      }

      // Escape key minimizes/closes chat from anywhere in the window
      if (e.key === 'Escape') {
        if (inputValueRef.current.startsWith('/')) {
          e.preventDefault();
          e.stopPropagation();
          setInputValue('');
          return;
        }
        if (isOpen && !isMinimized) {
          e.preventDefault();
          setIsMinimized(true);
        } else if (isOpen && isMinimized) {
          e.preventDefault();
          if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
          }
          setIsOpen(false);
        }
      }
    };

    // Use capture phase so Escape is captured even inside active inputs, buttons, or child dialogs
    window.addEventListener('keydown', handleGlobalKeydown, true);
    return () => window.removeEventListener('keydown', handleGlobalKeydown, true);
  }, [isOpen, isMinimized]);

  const handleCopyMessage = (msgId, text) => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMsgId(msgId);
      setTimeout(() => setCopiedMsgId(null), 2000);
    }).catch(() => {});
  };

  /**
   * Resilient Read-Aloud / TTS implementation using Phase 11 Voice Agent Engine & LabChatContext
   */
  const handleToggleSpeech = (msgId, text) => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speakingMsgId === msgId && (voiceEngineState === VOICE_STATES.SPEAKING || voiceEngineState === VOICE_STATES.PAUSED)) {
      stopSpeaking();
      setSpeakingMsgId(null);
      return;
    }

    const activeRate = chatSettings?.voiceRate ?? voiceConfig.rate ?? 1.0;
    const activePitch = chatSettings?.voicePitch ?? voiceConfig.pitch ?? 1.0;
    const activeVoiceId = chatSettings?.voiceId;

    let targetVoice = null;
    if (activeVoiceId && activeVoiceId !== 'default') {
      const availableVoices = availableVoicesRef.current?.length ? availableVoicesRef.current : window.speechSynthesis.getVoices();
      targetVoice = availableVoices.find((v) => v.voiceURI === activeVoiceId || v.name === activeVoiceId);
    }

    setSpeakingMsgId(msgId);
    const success = speakText(text, {
      voices: availableVoicesRef.current,
      selectedVoice: targetVoice,
      voiceId: activeVoiceId,
      rate: activeRate,
      pitch: activePitch,
      volume: voiceConfig.volume,
      voiceProfile: targetVoice ? undefined : voiceConfig.voiceProfile,
      onStart: () => setSpeakingMsgId(msgId),
      onEnd: () => setSpeakingMsgId(null),
      onError: () => setSpeakingMsgId(null)
    });

    if (!success) {
      setSpeakingMsgId(null);
    }
  };

  /**
   * Hands-Free Auto-Speak trigger when an assistant message finishes streaming/generating
   */
  const triggerAutoSpeak = (msgId, text) => {
    const cfg = getVoiceConfig();
    const shouldSpeak = Boolean(chatSettings?.ttsEnabled || cfg.autoSpeakResponses);
    if (shouldSpeak && text) {
      if (chatSettings?.ttsEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
        const assistantResponseText = text;
        const utterance = new SpeechSynthesisUtterance(cleanPlainText(assistantResponseText));
        utterance.pitch = chatSettings.voicePitch || 1.0;
        utterance.rate = chatSettings.voiceRate || 1.0;

        if (chatSettings.voiceId && chatSettings.voiceId !== 'default') {
          const availableVoices = window.speechSynthesis.getVoices();
          const chosen = availableVoices.find((v) => v.voiceURI === chatSettings.voiceId || v.name === chatSettings.voiceId);
          if (chosen) utterance.voice = chosen;
        }

        utterance.onstart = () => setSpeakingMsgId(msgId);
        utterance.onend = () => setSpeakingMsgId(null);
        utterance.onerror = () => setSpeakingMsgId(null);
        window.speechSynthesis.speak(utterance);
      } else {
        handleToggleSpeech(msgId, text);
      }
    }
  };

  /**
   * Voice Input (Speech to Text): Transcribes into inputText WITHOUT auto-sending!
   */
  const handleToggleVoiceInput = () => {
    soundFX.triggerHaptic([20, 30, 20]);
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
      setVoiceState(VOICE_STATES.IDLE);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceState(VOICE_STATES.LISTENING);
        announce('Listening for voice input. Speak now.', 'polite');
        setLiveAnnouncement('Listening for voice input. Speak now.');
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            interimTranscript += item[0].transcript;
          }
        }
        const speechChunk = (finalTranscript || interimTranscript).trim();
        if (speechChunk) {
          setInputValue((prev) => {
            if (!prev) return speechChunk;
            if (prev.endsWith(speechChunk)) return prev;
            return `${prev.trim()} ${speechChunk}`;
          });
          inputRef.current?.focus();
        }
        // CRITICAL FIX: NEVER call handleSendMessage! Voice dictation ONLY transcribes into input.
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
        setVoiceState(VOICE_STATES.IDLE);
      };

      recognition.onend = () => {
        setIsListening(false);
        setVoiceState(VOICE_STATES.IDLE);
        inputRef.current?.focus();
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
      setIsListening(false);
      setVoiceState(VOICE_STATES.IDLE);
    }
  };

  const handleExportFormat = (format = 'markdown') => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    const metadata = {
      role: activeRole,
      audience,
      viewMode,
      activeModel: localAiState?.activeModel?.name || 'Portfolio Knowledge Engine',
      sessionId: activeSessionId
    };
    exportTranscript(messages, format, metadata);
    setShowExportMenu(false);
    announce(`Chat transcript exported as ${format.toUpperCase()}`, 'polite');
  };

  const handleExportTranscript = () => {
    handleExportFormat('json');
  };

  const handleCopyAllTranscript = async () => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    const metadata = {
      role: activeRole,
      audience,
      viewMode,
      activeModel: localAiState?.activeModel?.name || 'Portfolio Knowledge Engine',
      sessionId: activeSessionId
    };
    const res = await copyTranscriptToClipboard(messages, metadata);
    setShowExportMenu(false);
    if (res.success) {
      announce('Full transcript copied to clipboard as Markdown', 'polite');
    }
  };

  const handleRateMessage = (messageId, rating) => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          const nextRating = m.feedback === rating ? null : rating;
          return { ...m, feedback: nextRating };
        }
        return m;
      })
    );
    recordMessageFeedback(messageId, rating);
    announce(rating === 'up' ? 'Marked response as helpful. Thank you!' : 'Feedback noted. Thank you!', 'polite');
  };

  const handleLoadSession = (sessionId) => {
    const session = loadSession(sessionId);
    if (session && Array.isArray(session.messages)) {
      setActiveSessionId(sessionId);
      setMessages(session.messages);
      inMemoryMessagesCache = session.messages;
      announce(`Loaded session: ${session.title || 'Conversation'}`, 'polite');
      setShowHistoryDrawer(false);
      if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    }
  };

  const handleStartNewSession = () => {
    const newId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setActiveSessionId(newId);
    handleClearChat();
    setShowHistoryDrawer(false);
    announce('Started new conversation session', 'polite');
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
  };

  const handleDeleteSession = (sessionId, e) => {
    if (e) e.stopPropagation();
    deleteSession(sessionId);
    if (sessionId === activeSessionId) {
      handleStartNewSession();
    } else {
      setSavedSessions(listSessions());
    }
    announce('Session removed from history', 'polite');
  };

  // Filtered slash commands derived from full engine catalog (40+ commands)
  const slashFilter = inputValue.startsWith('/') ? inputValue.slice(1).toLowerCase().trim() : '';
  const filteredSlashCommands = inputValue.startsWith('/')
    ? (CHAT_SLASH_COMMANDS || []).filter((cmd) => {
        if (!slashFilter) return true;
        return (
          cmd.command.slice(1).toLowerCase().includes(slashFilter) ||
          cmd.label.toLowerCase().includes(slashFilter) ||
          cmd.category.toLowerCase().includes(slashFilter) ||
          (cmd.description && cmd.description.toLowerCase().includes(slashFilter))
        );
      })
    : [];

  // Reset active slash command selection when input text changes
  useEffect(() => {
    setActiveSlashIndex(0);
  }, [inputValue]);

  // Execute or dispatch a slash command
  const executeSlashCommand = (cmd) => {
    if (!cmd) return;
    const cmdStr = cmd.command;
    setInputValue('');

    if (cmdStr === '/clear') {
      handleClearChat();
    } else if (cmdStr === '/export' || cmdStr === '/transcript') {
      setShowExportMenu((prev) => !prev);
      handleSendMessage(cmdStr);
    } else if (cmdStr === '/history' || cmdStr === '/sessions') {
      setShowHistoryDrawer(true);
      handleSendMessage(cmdStr);
    } else if (cmdStr === '/analytics' || cmdStr === '/telemetry' || cmdStr === '/benchmark') {
      handleSendMessage(cmdStr);
    } else if (cmdStr === '/fullscreen') {
      handleToggleMaximize();
    } else if (cmdStr === '/reset') {
      handleResetLayout();
    } else if (cmdStr === '/view') {
      handleTriggerViewModeDecisionTree();
    } else if (cmdStr === '/audience') {
      handleTriggerAudienceDecisionTree();
    } else if (cmdStr === '/role') {
      handleTriggerRoleDecisionTree();
    } else if (cmdStr === '/model' || cmdStr === '/ai') {
      handleTriggerAIModelDecisionTree();
    } else if (cmdStr === '/terminal') {
      selectViewMode('terminal');
      handleSendMessage(cmdStr);
    } else if (cmdStr === '/pdf' || cmdStr === '/basic') {
      selectViewMode('basic');
      handleSendMessage(cmdStr);
    } else if (cmdStr === '/simple') {
      selectViewMode('simple');
      handleSendMessage(cmdStr);
    } else if (cmdStr === '/quote' || cmdStr === '/pricing') {
      handleExecuteAction({ type: 'open-estimator' });
      handleSendMessage(cmdStr);
    } else if (cmdStr === '/resume') {
      handleExecuteAction({ type: 'download-resume' });
      handleSendMessage(cmdStr);
    } else {
      handleSendMessage(cmdStr);
    }
  };

  // Launch or prefill Meta-Prompt Engineer Studio
  const handleOpenPromptStudio = useCallback(() => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    if (inputValueRef.current && inputValueRef.current.trim()) {
      const cur = inputValueRef.current.trim();
      if (!cur.startsWith('/engineer') && !cur.startsWith('/prompt') && !cur.startsWith('/metaprompt')) {
        setInputValue(`/engineer ${cur}`);
      }
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      handleSendMessage('/engineer');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [soundEnabled]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const lastFocusedElementRef = useRef(null);
  const widgetRef = useRef(null);

  // Wire focus trap strictly within chat window when open, not minimized, and not mobile
  useFocusTrap(isOpen && !isMinimized && !isMobile, widgetRef, {
    initialFocusRef: inputRef,
    onEscape: () => setIsMinimized(true),
    restoreFocus: true
  });

  // Programmatically focus text input on window open
  useEffect(() => {
    if (isOpen && !isMinimized) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMinimized]);

  // Drag & drop window repositioning refs & states
  const [isDraggingWindow, setIsDraggingWindow] = useState(false);
  const windowDragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });

  // Resizing state
  const [isResizing, setIsResizing] = useState(null); // 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null
  const resizeStartRef = useRef({ mouseX: 0, mouseY: 0, width: 0, height: 0, posX: 0, posY: 0 });

  // Context hooks hoisted to top of component

  // Session-scoped messages state initialized from sessionStorage or memory cache
  const [messages, setMessages] = useState(() => {
    if (inMemoryMessagesCache && Array.isArray(inMemoryMessagesCache) && inMemoryMessagesCache.length > 0) {
      return inMemoryMessagesCache;
    }
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const stored = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            inMemoryMessagesCache = parsed;
            return parsed;
          }
        }
      } catch {
        // Fallback to default
      }
    }
    let initialChips = PROMPT_CHIPS;
    try {
      if (typeof getInitialSuggestions === 'function') {
        const suggestions = getInitialSuggestions({ role: activeRole, audience });
        if (Array.isArray(suggestions) && suggestions.length > 0) {
          initialChips = suggestions;
        }
      }
    } catch {
      // keep fallback
    }
    const audLabel = getAudienceLabel(audience);
    const rLabel = getRoleLabel(activeRole);
    const vmLabel = getViewModeLabel(viewMode);

    const baseWelcome = {
      ...DEFAULT_WELCOME_MESSAGE,
      modelShortcut: localAiState?.activeModel?.shortcut || '[Portfolio-Engine]',
      chips: initialChips,
      summaryCard: {
        audience: audLabel,
        role: rLabel,
        viewMode: vmLabel
      },
      decisionTree: {
        step: 'preferences_prompt',
        title: 'क्या आप इन प्राथमिकताओं को बदलना चाहते हैं? / Would you like to customize your preferences?',
        options: DEFAULT_PREFERENCES_PROMPT_OPTIONS
      }
    };
    const initial = [baseWelcome];
    inMemoryMessagesCache = initial;
    return initial;
  });

  // Sync messages to window.sessionStorage and memory cache
  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(messages));
        inMemoryMessagesCache = messages;
      } catch {
        // Storage quota safeguard
      }
    }
  }, [messages]);

  // Phase 9: Auto-persist current session to chatSessionStorage with FIFO 10-session quota guard
  useEffect(() => {
    if (activeSessionId && Array.isArray(messages) && messages.length > 0) {
      setCurrentSessionId(activeSessionId);
      saveSession({
        id: activeSessionId,
        messages,
        metadata: {
          role: activeRole,
          audience,
          viewMode,
          activeModel: localAiState?.activeModel?.name || 'Portfolio Knowledge Engine'
        }
      });
    }
  }, [messages, activeSessionId, activeRole, audience, viewMode, localAiState?.activeModel?.name]);

  // Current active suggestion chips derived from latest assistant message or defaults
  const currentChips = useMemo(() => {
    // Find latest assistant message
    const latestAssistant = [...messages].reverse().find(
      (m) => m.role === 'assistant' || m.sender === 'assistant'
    );

    let rawChips = [];

    // If latest message has an active decision tree, feed its options to the suggestion drawer!
    if (
      latestAssistant?.decisionTree?.options &&
      !skippedDecisionTreeMsgIds.has(latestAssistant.id)
    ) {
      const isSequential = Boolean(latestAssistant.decisionTree.isSequential);
      const step = latestAssistant.decisionTree.step;

      rawChips = latestAssistant.decisionTree.options.map((opt) => ({
        ...opt,
        category: 'all',
        isDecisionOption: true,
        decisionStep: step,
        isSequential,
        messageId: latestAssistant.id
      }));
    } else if (
      Array.isArray(latestAssistant?.chips) &&
      latestAssistant.chips.length > 0
    ) {
      rawChips = latestAssistant.chips;
    } else {
      rawChips = PROMPT_CHIPS;
    }

    // Deduplicate by unique ID or normalized label
    const seen = new Set();
    return rawChips.filter((chip) => {
      const key = (chip.id || chip.label || chip.query || '').trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [messages, skippedDecisionTreeMsgIds]);

  // Scroll to bottom of message list smoothly (respects prefers-reduced-motion)
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen, isMinimized, scrollToBottom]);

  const lastPostDownloadRef = useRef(null);

  // Post-download activation decision tree prompt when user-selected model finishes downloading
  useEffect(() => {
    if (!isOpen) return;
    if (localAiState?.lastNotification?.type === 'download_complete') {
      const notif = localAiState.lastNotification;
      const modelId = notif.modelId || notif.model?.id;
      if (lastPostDownloadRef.current !== modelId) {
        lastPostDownloadRef.current = modelId;
        const modelName = notif.shortcut || notif.model?.shortcut || notif.model?.name || 'AI Model';

        const activationDecisionMsg = {
          id: `assistant-post-download-${Date.now()}`,
          sender: 'assistant',
          modelShortcut: notif.shortcut || '[Portfolio-Engine]',
          text: `🎉 **AI मॉडल ${modelName} सफलतापूर्वक डाउनलोड हो गया है!**\n\nयह आपके ब्राउज़र कैशे में 100% सुरक्षित और तैयार है। क्या आप इसे अभी एक्टिवेट करना चाहते हैं?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          decisionTree: {
            step: 'model_activation',
            modelId: modelId,
            modelShortcut: modelName,
            title: `क्या आप ${modelName} को अभी एक्टिवेट करना चाहते हैं?`,
            options: [
              {
                id: 'activate_yes',
                action: 'activate',
                modelId: modelId,
                shortcut: modelName,
                label: '⚡ हाँ, एक्टिवेट करो / Yes, Activate Now',
                sublabel: 'तुरंत ऑन-डिवाइस AI सक्रिय करें और सीधे अपने डिवाइस पर प्रोसेस करें'
              },
              {
                id: 'activate_no',
                action: 'later',
                modelId: modelId,
                shortcut: modelName,
                label: '⏳ नहीं, अभी रहने दो / No, Later',
                sublabel: 'मॉडल ब्राउज़र कैशे में सुरक्षित रहेगा, वर्तमान मोड जारी रहेगा'
              }
            ]
          }
        };

        setMessages((prev) => [...prev, activationDecisionMsg]);
        if (soundEnabled && soundFX?.playSuccess) soundFX.playSuccess();
        setTimeout(scrollToBottom, 50);
      }
    }
  }, [isOpen, localAiState?.lastNotification, scrollToBottom, soundEnabled, soundFX]);

  // Subtle in-chat notice when local AI auto-downgrades or encounters device_lost / offline_fallback
  useEffect(() => {
    if (!isOpen) return;
    const notifType = localAiState?.lastNotification?.type;
    if (notifType === 'auto_downgrade' || notifType === 'offline_fallback' || notifType === 'device_lost') {
      const notif = localAiState.lastNotification;
      const key = `${notif.type}-${notif.previousModelId || 'active'}->${notif.model?.shortcut || notif.model?.id || 'engine'}`;
      if (lastDowngradedRef.current !== key) {
        lastDowngradedRef.current = key;
        const targetShortcut = notif.model?.shortcut || '[Portfolio-Engine]';
        const inChatNotice = notif.notice || notif.message || `⚡ आपके डिवाइस की स्मूथनेस और तेज़ गति बनाए रखने के लिए अनुकूलित ${targetShortcut} मॉडल सक्रिय कर दिया गया है।`;

        const downgradeAssistantMsg = {
          id: `assistant-auto-downgrade-${Date.now()}`,
          sender: 'assistant',
          modelShortcut: targetShortcut,
          text: inChatNotice,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          chips: PROMPT_CHIPS
        };

        setMessages((prev) => [...prev, downgradeAssistantMsg]);
        setTimeout(scrollToBottom, 50);
      }
    }
  }, [isOpen, localAiState?.lastNotification, scrollToBottom]);

  // In-chat switching notice when model is switching or in orange loading state
  useEffect(() => {
    if (!isOpen) return;
    const isSwitching =
      localAiState?.status === 'switching' ||
      localAiState?.lastNotification?.type === 'switching' ||
      localAiState?.lastNotification?.type === 'model_switching';

    if (isSwitching) {
      const notif = localAiState?.lastNotification;
      const targetModelKey = notif?.modelId || notif?.shortcut || localAiState?.activeModel?.id || `switch_${Date.now()}`;
      if (lastSwitchingNoticeRef.current !== targetModelKey) {
        lastSwitchingNoticeRef.current = targetModelKey;
        const targetShortcut = notif?.shortcut || localAiState?.activeModel?.shortcut || '[System]';
        const noticeText = notif?.notice || notif?.message || 'Your new model is loading in chat box...';

        const switchingAssistantMsg = {
          id: `assistant-model-switching-${Date.now()}`,
          sender: 'assistant',
          modelShortcut: targetShortcut,
          text: noticeText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          chips: PROMPT_CHIPS
        };

        setMessages((prev) => [...prev, switchingAssistantMsg]);
        setTimeout(scrollToBottom, 50);
      }
    }
  }, [isOpen, localAiState?.status, localAiState?.lastNotification, scrollToBottom]);

  // Decoupled window event listener: 'portfolio:open-ai-chat'
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOpenChat = (e) => {
      // Store trigger focus element for accessible focus return on Escape
      if (document.activeElement && document.activeElement !== document.body) {
        lastFocusedElementRef.current = document.activeElement;
      }
      setIsOpen(true);
      // Tablet safeguard: on narrow tablet viewports (< 960px) when drawer is open, launch docked minimized to prevent left truncation
      const shouldMinimize = Boolean(isDrawerOpen && typeof window !== 'undefined' && window.innerWidth < 960);
      setIsMinimized(shouldMinimize);
      if (soundEnabled) {
        if (soundFX?.playSparkle) soundFX.playSparkle();
        else if (soundFX?.playFocusBeep) soundFX.playFocusBeep();
      }

      // Gracefully handle optional payload properties from event detail
      const detail = e?.detail;
      if (detail) {
        if (detail.targetRole && typeof selectRole === 'function') {
          selectRole(detail.targetRole);
        }
        if (detail.targetAudience && typeof setAudience === 'function') {
          setAudience(detail.targetAudience);
        }
        if (detail.targetViewMode && typeof selectViewMode === 'function') {
          selectViewMode(detail.targetViewMode);
        }
        if (detail.initialMessage && typeof detail.initialMessage === 'string') {
          setInputValue(detail.initialMessage);
        }
      }

      if (!shouldMinimize) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 150);
      }
    };

    window.addEventListener('portfolio:open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('portfolio:open-ai-chat', handleOpenChat);
  }, [soundEnabled, isDrawerOpen, selectRole, setAudience, selectViewMode]);

  // Synchronize state with custom event
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(
      new CustomEvent('portfolio:ai-chat-state', {
        detail: { isOpen, isMinimized }
      })
    );
  }, [isOpen, isMinimized]);

  // Tablet safeguard: auto-minimize when drawer opens on narrower tablet screens (< 960px) to prevent viewport truncation
  useEffect(() => {
    if (!isOpen) return;
    if (typeof window === 'undefined') return;

    if (isDrawerOpen && window.innerWidth < 960) {
      setIsMinimized(true);
    }
  }, [isOpen, isDrawerOpen]);

  // Window resize handler: auto-minimize if resized below 960px while drawer is open
  useEffect(() => {
    if (!isOpen) return;
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      if (isDrawerOpen && window.innerWidth < 960) {
        setIsMinimized(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, isDrawerOpen]);

  // Clean up any pending typing timeouts, speech synthesis, and streams on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }
      if (activeRequestIdRef.current) {
        localAIService.cancelGeneration(activeRequestIdRef.current);
        activeRequestIdRef.current = null;
      }
      stopSpeaking();
    };
  }, []);

  // Handle Close with focus return
  const handleClose = (e) => {
    e?.stopPropagation?.();
    stopSpeaking();
    setSpeakingMsgId(null);
    if (soundEnabled && soundFX?.playTap) {
      soundFX.playTap();
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    handleStopGenerating();
    setIsTyping(false);
    setIsOpen(false);
    if (lastFocusedElementRef.current && typeof lastFocusedElementRef.current.focus === 'function') {
      setTimeout(() => {
        lastFocusedElementRef.current?.focus();
      }, 50);
    }
  };

  const handleDismiss = (e) => {
    stopSpeaking();
    handleClose(e);
  };

  // Handle layout reset (position, dimensions, maximized state)
  const handleResetLayout = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setPosition(null);
    setDimensions(null);
    setIsMaximized(false);
    setPreMaximizeState(null);
  };

  // Handle Minimize / Maximize toggle
  const handleToggleMinimize = (e) => {
    e?.stopPropagation?.();
    if (soundEnabled && soundFX?.playFocusBeep) {
      soundFX.playFocusBeep();
    }
    setIsMinimized((prev) => !prev);
  };

  // Handle Maximize / Restore toggle
  const handleToggleMaximize = (e) => {
    e?.stopPropagation?.();
    if (soundEnabled && soundFX?.playFocusBeep) {
      soundFX.playFocusBeep();
    }
    if (isMaximized) {
      // Restore
      setIsMaximized(false);
      if (preMaximizeState) {
        setPosition(preMaximizeState.position);
        setDimensions(preMaximizeState.dimensions);
      }
    } else {
      // Maximize
      setPreMaximizeState({
        position: position ? { ...position } : null,
        dimensions: dimensions ? { ...dimensions } : null
      });
      setIsMaximized(true);
      setIsMinimized(false);
    }
  };
  toggleMaximizeRef.current = handleToggleMaximize;

  // Window Drag & Drop handlers
  const handleWindowPointerDown = (e) => {
    // Only drag from header, ignore buttons or interactive interactive targets
    if (
      e.target.closest('button') ||
      e.target.closest('input') ||
      isMaximized ||
      isMinimized ||
      (typeof window !== 'undefined' && window.innerWidth < 640)
    ) {
      return;
    }
    setIsDraggingWindow(e.pointerId);
    const rect = widgetRef.current?.getBoundingClientRect();
    const currentX = position ? position.x : (rect ? rect.left : window.innerWidth - 420);
    const currentY = position ? position.y : (rect ? rect.top : window.innerHeight - 560);
    windowDragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: currentX,
      posY: currentY
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleWindowPointerMove = (e) => {
    if (isDraggingWindow === false) return;
    const dx = e.clientX - windowDragStartRef.current.mouseX;
    const dy = e.clientY - windowDragStartRef.current.mouseY;

    const w = dimensions?.width || 380;
    const h = dimensions?.height || 520;

    const newX = Math.max(12, Math.min(window.innerWidth - w - 12, windowDragStartRef.current.posX + dx));
    const newY = Math.max(12, Math.min(window.innerHeight - h - 12, windowDragStartRef.current.posY + dy));

    setPosition({ x: newX, y: newY });
  };

  const handleWindowPointerUp = (e) => {
    if (isDraggingWindow !== false) {
      setIsDraggingWindow(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // safe
      }
    }
  };

  // Multi-directional Resize Handlers
  const handleResizePointerDown = (direction, e) => {
    if (isMaximized || isMinimized || (typeof window !== 'undefined' && window.innerWidth < 640)) return;
    e.stopPropagation();
    setIsResizing(direction);
    const rect = widgetRef.current?.getBoundingClientRect();
    const currentW = dimensions?.width || (rect ? rect.width : 380);
    const currentH = dimensions?.height || (rect ? rect.height : 520);
    const currentX = position ? position.x : (rect ? rect.left : window.innerWidth - 420);
    const currentY = position ? position.y : (rect ? rect.top : window.innerHeight - 560);

    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      width: currentW,
      height: currentH,
      posX: currentX,
      posY: currentY
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleResizePointerMove = (e) => {
    if (!isResizing) return;
    const dx = e.clientX - resizeStartRef.current.mouseX;
    const dy = e.clientY - resizeStartRef.current.mouseY;

    let { width, height, posX, posY } = resizeStartRef.current;
    const minW = 320;
    const minH = 380;
    const maxW = window.innerWidth - 24;
    const maxH = window.innerHeight - 24;

    if (isResizing.includes('right')) {
      width = Math.max(minW, Math.min(maxW, resizeStartRef.current.width + dx));
    }
    if (isResizing.includes('left')) {
      const newW = Math.max(minW, Math.min(maxW, resizeStartRef.current.width - dx));
      const deltaW = newW - resizeStartRef.current.width;
      const newX = resizeStartRef.current.posX - deltaW;
      if (newX >= 12 && newX + newW <= window.innerWidth - 12) {
        width = newW;
        posX = newX;
      }
    }
    if (isResizing.includes('bottom')) {
      height = Math.max(minH, Math.min(maxH, resizeStartRef.current.height + dy));
    }
    if (isResizing.includes('top')) {
      const newH = Math.max(minH, Math.min(maxH, resizeStartRef.current.height - dy));
      const deltaH = newH - resizeStartRef.current.height;
      const newY = resizeStartRef.current.posY - deltaH;
      if (newY >= 12 && newY + newH <= window.innerHeight - 12) {
        height = newH;
        posY = newY;
      }
    }

    setDimensions({ width, height });
    setPosition({ x: posX, y: posY });
  };

  const handleResizePointerUp = (e) => {
    if (isResizing) {
      setIsResizing(null);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // safe
      }
    }
  };

  // Smooth Section Scroll with accessible programmatic focus without closing chat
  const handleScrollToSection = (sectionId) => {
    if (typeof document === 'undefined') return;
    const cleanId = String(sectionId).replace(/^#/, '');
    const el = document.getElementById(cleanId);
    if (el) {
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    }
  };

  // Direct action execution handler
  const handleExecuteAction = (action) => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    if (!action) return;

    const type = action.type;
    const payload = action.payload || action;

    if (type === 'open-case-study' || type === 'case-study') {
      const rawId = payload.id || action.target || (action.payload && action.payload.target) || payload.caseStudyId || action.caseStudyId || '01';
      const projectTargetMap = {
        'proj-gst-tax': '01',
        'proj-tally-accounting': '02',
        'proj-day-nulm': '03',
        'proj-smart-card': '04',
        'proj-enterprise-transformation': '05',
        'proj-business-advisory': '06',
        'proj-ai-saas-generator': '07',
        'proj-agent-workflow-engine': '08',
        'proj-doc-code-synthesizer': '09'
      };
      const mappedId = projectTargetMap[rawId];
      const match = String(rawId).match(/\d+/);
      const caseId = mappedId || (match ? match[0].padStart(2, '0') : String(rawId).replace(/^#/, ''));
      window.dispatchEvent(
        new CustomEvent('portfolio:open-case-study', { detail: { id: String(caseId) } })
      );
      setIsMinimized(true);
    } else if (type === 'open-estimator') {
      handleScrollToSection('contact');
      window.dispatchEvent(
        new CustomEvent('portfolio:switch-contact-tab', { detail: { tab: 'quote' } })
      );
      window.dispatchEvent(
        new CustomEvent('portfolio:open-estimator')
      );
    } else if (type === 'switch-contact-tab' || type === 'quote-tab') {
      const targetTab = payload.tab || 'quote';
      handleScrollToSection('contact');
      window.dispatchEvent(
        new CustomEvent('portfolio:switch-contact-tab', { detail: { tab: targetTab } })
      );
      if (targetTab === 'quote') {
        window.dispatchEvent(new CustomEvent('portfolio:open-estimator'));
      }
    } else if (type === 'download-resume') {
      let targetRole = payload.role || action.role;
      if (!targetRole && (action.target || payload.fileName)) {
        const fileStr = String(action.target || payload.fileName).toLowerCase();
        if (fileStr.includes('accountant')) targetRole = 'accountant';
        else if (fileStr.includes('mis')) targetRole = 'mis';
        else if (fileStr.includes('vibe') || fileStr.includes('coder')) targetRole = 'vibe_coding';
        else if (fileStr.includes('controller')) targetRole = 'other';
        else if (fileStr.includes('overview') || fileStr === 'resume.pdf') targetRole = 'overview';
      }
      if (!targetRole) targetRole = activeRole;
      const resumeConfig = getResumeConfig(targetRole);
      if (typeof document !== 'undefined') {
        const link = document.createElement('a');
        const downloadUrl = payload.url
          ? (payload.url.startsWith('http') || payload.url.startsWith('/')
              ? payload.url
              : `${resumeConfig.pdfPath.substring(0, resumeConfig.pdfPath.lastIndexOf('/') + 1)}${payload.url}`)
          : resumeConfig.pdfPath;
        link.href = downloadUrl;
        link.download = resumeConfig.downloadFilename;
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else if (type === 'scroll') {
      const rawSec = action.target || payload.selector || payload.target || payload.sectionId || action.sectionId || payload.id;
      if (rawSec) {
        const cleanId = String(rawSec).replace(/^#/, '');
        handleScrollToSection(cleanId);
      }
    } else if (type === 'switch-role-tab' || type === 'set-role') {
      const r = payload.role || action.target || action.role;
      if (selectRole && r) selectRole(r);
    } else if (type === 'set-audience') {
      const a = payload.audience || action.audience;
      if (setAudience && a) setAudience(a);
    } else if (type === 'link') {
      const url = payload.url || action.url || action.target;
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } else if (type === 'switch-view-mode') {
      const mode = payload.viewMode || action.viewMode;
      if (selectViewMode && mode) selectViewMode(mode);
    } else if (type === 'toggle-maximize') {
      handleToggleMaximize();
    } else if (type === 'reset-layout') {
      handleResetLayout();
    } else if (type === 'clear-chat') {
      handleClearChat();
    } else if (type === 'export-transcript' || type === 'export-transcript-json') {
      handleExportFormat('json');
    } else if (type === 'export-transcript-md') {
      handleExportFormat('markdown');
    } else if (type === 'export-transcript-txt') {
      handleExportFormat('txt');
    } else if (type === 'export-transcript-html') {
      handleExportFormat('html');
    } else if (type === 'copy-transcript') {
      handleCopyAllTranscript();
    } else if (type === 'open-session-drawer') {
      setShowHistoryDrawer(true);
    } else if (type === 'new-session') {
      handleStartNewSession();
    } else if (type === 'reset-telemetry') {
      resetAnalytics();
      announce('Local AI telemetry reset', 'polite');
    } else if (type === 'start-tour') {
      const targetTour = action.tourId || payload.tourId || 'recruiter-fast-track';
      startTour(targetTour);
      if (soundEnabled && soundFX?.playSpatialPing) soundFX.playSpatialPing();
      if (announce) announce(`Started guided tour: ${targetTour}`, 'polite');
    } else if (type === 'next-tour-step') {
      nextTourStep();
      if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    } else if (type === 'prev-tour-step') {
      prevTourStep();
      if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    } else if (type === 'end-tour') {
      endTour();
      if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    } else if (type === 'open-quote') {
      handleScrollToSection('contact');
      window.dispatchEvent(new CustomEvent('portfolio:switch-contact-tab', { detail: { tab: 'quote' } }));
      window.dispatchEvent(new CustomEvent('portfolio:open-estimator'));
    } else if (type === 'select-role') {
      const r = payload.role || action.role || action.target;
      if (selectRole && r) selectRole(r);
    } else if (type === 'copy-command') {
      const cmdText = payload.command || action.command || '';
      if (cmdText) {
        navigator.clipboard.writeText(cmdText).catch(() => {});
        announce('Executable command copied to clipboard', 'polite');
      }
    } else if (type === 'copy-metaprompt') {
      const pText = payload.prompt || action.prompt || '';
      if (pText) {
        navigator.clipboard.writeText(pText).catch(() => {});
        announce('Structured meta-prompt copied to clipboard', 'polite');
      }
    } else if (type === 'set-input') {
      const val = payload.value || action.value || '/engineer ';
      setInputValue(val);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else if (type === 'set-input-and-send') {
      const q = payload.query || action.query || payload.command || action.command;
      if (q) {
        handleSendMessage(q);
      }
    } else if (type === 'open-voice-settings') {
      setShowVoiceSettings(true);
      setShowHistoryDrawer(false);
      setShowExportMenu(false);
      if (announce) announce('Opened Voice Settings Studio', 'polite');
    } else if (type === 'speak-last') {
      const custom = payload?.customText || action.customText;
      let textToRead = custom;
      if (!textToRead) {
        const lastMsg = [...messages].reverse().find((m) => m.sender === 'assistant' && m.text);
        if (lastMsg) textToRead = lastMsg.text;
      }
      if (textToRead) {
        handleToggleSpeech('last', textToRead);
      }
    } else if (type === 'toggle-auto-speak') {
      const nextVal = !voiceConfig.autoSpeakResponses;
      const updated = setVoiceConfig({ autoSpeakResponses: nextVal });
      setVoiceConfigState(updated);
      if (announce) announce(`Hands-free auto-speak ${nextVal ? 'enabled' : 'disabled'}`, 'polite');
    } else if (type === 'stop-speech') {
      stopSpeaking();
      setSpeakingMsgId(null);
    } else if (type === 'pause-speech') {
      pauseSpeech();
    } else if (type === 'resume-speech') {
      resumeSpeech();
    }
  };

  // Decision Tree & Customization Handlers
  const handlePreferencesPromptSelect = (actionId, label) => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: label,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (actionId === 'customize_no') {
      const step4Msg = {
        id: `assistant-step4-${Date.now()}`,
        sender: 'assistant',
        text: "बढ़िया! आपकी वर्तमान सेटिंग्स सुरक्षित हैं। एक अंतिम सवाल: बेहतर और अधिक सटीक रिस्पॉन्स के लिए क्या आप ऑन-डिवाइस AI का उपयोग करना चाहेंगे? (इसके लिए आपके डिवाइस में एक बहुत ही लाइटवेट AI मॉडल लोड किया जाएगा)",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        decisionTree: {
          step: 'ai_consent',
          title: "ऑन-डिवाइस AI मॉडल सहमति / On-Device AI Consent:",
          options: AI_MODEL_CONSENT_OPTIONS
        }
      };
      setMessages((prev) => [...prev, userMsg, step4Msg]);
    } else {
      const step1Msg = {
        id: `assistant-step1-${Date.now()}`,
        sender: 'assistant',
        text: "Welcome! Who are you viewing Atul's portfolio as? / कृपया अपनी ऑडियंस प्राथमिकता चुनें:",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        decisionTree: {
          step: 'audience',
          isSequential: true,
          title: "Select Audience Perspective:",
          options: UNIFIED_AUDIENCE_OPTIONS
        }
      };
      setMessages((prev) => [...prev, userMsg, step1Msg]);
    }
    setTimeout(scrollToBottom, 50);
  };

  const handleAiModelConsentSelect = (consent, label) => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('portfolio_ai_model_consent', consent);
        window.dispatchEvent(
          new CustomEvent('portfolio:ai-consent-change', { detail: { consent } })
        );
      }
    } catch (err) {
      console.warn('LocalStorage error saving AI consent:', err);
    }

    const userMsg = {
      id: `user-ai-consent-${Date.now()}`,
      sender: 'user',
      text: label,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const audLabel = getAudienceLabel(audience);
    const rLabel = getRoleLabel(activeRole);
    const vmLabel = getViewModeLabel(viewMode);
    const isConsentEnabled = consent === 'enabled';
    if (isConsentEnabled) {
      const currentState = localAIService.getState();
      const recModelId = currentState.deviceProfile?.recommendedModel?.id;
      const isAlreadyActive = recModelId && currentState.activeModel?.id === recModelId && currentState.status === 'ready';
      const isAlreadyDownloading = recModelId && currentState.downloadingModel?.id === recModelId && (currentState.status === 'downloading' || currentState.status === 'compiling' || currentState.status === 'loading_cache');

      if (!isAlreadyActive && !isAlreadyDownloading) {
        localAIService.upgradeToRecommendedModel();
      }
    }

    const assistantMsg = {
      id: `assistant-ai-consent-ack-${Date.now()}`,
      sender: 'assistant',
      text: isConsentEnabled
        ? "✅ बहुत बढ़िया! ऑन-डिवाइस AI प्राथमिकताओं को सेव कर लिया गया है।\n\nआपकी सभी प्राथमिकताएं सफलतापूर्वक सेट हो चुकी हैं। अब आप नीचे दिए गए सुझावों में से कुछ भी पूछ सकते हैं!"
        : "✅ ठीक है! ऑन-डिवाइस AI को स्किप कर दिया गया है।\n\nआपकी सभी प्राथमिकताएं सुरक्षित हैं। अब आप नीचे दिए गए सुझावों में से कुछ भी पूछ सकते हैं!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      summaryCard: {
        audience: audLabel,
        role: rLabel,
        viewMode: vmLabel,
        aiConsent: isConsentEnabled ? '⚡ Enabled' : 'Off'
      },
      chips: PROMPT_CHIPS
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    if (soundEnabled && soundFX?.playSuccess) soundFX.playSuccess();
    announce(
      isConsentEnabled ? 'On-device AI consent enabled' : 'On-device AI consent declined',
      'polite'
    );
    setTimeout(scrollToBottom, 50);
  };

  const handleAudienceDecisionSelect = (aud, label, isSequential = true) => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    if (setAudience && aud) {
      setAudience(aud);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('portfolio:audience-change', { detail: { audience: aud } }));
      }
    }
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: `Selected Audience: ${label}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const followUpMsg = {
      id: `assistant-role-${Date.now()}`,
      sender: 'assistant',
      text: "Great! Next, which professional track / role would you like to explore? / बढ़िया! अब अपनी पसंदीदा जॉब रोल / ट्रैक चुनें:",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      decisionTree: {
        step: 'role',
        isSequential: true,
        title: "Select Job Role / Professional Track:",
        options: UNIFIED_ROLE_OPTIONS
      }
    };
    setMessages((prev) => [...prev, userMsg, followUpMsg]);
    setTimeout(scrollToBottom, 50);
  };

  const handleAudienceDecisionSkip = (isSequential = true) => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    const userMsg = {
      id: `user-skip-aud-${Date.now()}`,
      sender: 'user',
      text: "⏩ Skipped Audience Selection",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const followUpMsg = {
      id: `assistant-role-${Date.now()}`,
      sender: 'assistant',
      text: "Understood! Next, which professional track / role would you like to explore? / अब अपनी पसंदीदा जॉब रोल / ट्रैक चुनें:",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      decisionTree: {
        step: 'role',
        isSequential: true,
        title: "Select Job Role / Professional Track:",
        options: UNIFIED_ROLE_OPTIONS
      }
    };
    setMessages((prev) => [...prev, userMsg, followUpMsg]);
    setTimeout(scrollToBottom, 50);
  };

  const handleRoleDecisionSelect = (r, label, isSequential = true) => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    if (typeof selectRole === 'function' && r) selectRole(r, { force: true });
    if (typeof window !== 'undefined' && r) {
      window.dispatchEvent(new CustomEvent('portfolio-role-change', { detail: { role: r } }));
    }
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: `Selected Role: ${label}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (isSequential) {
      const nextStepMsg = {
        id: `assistant-viewmode-${Date.now()}`,
        sender: 'assistant',
        text: `Switched track to ${label}. Next, which portfolio view mode would you like to switch to? / शानदार! आप पोर्टफोलियो को किस व्यू मोड में देखना चाहते हैं?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        decisionTree: {
          step: 'viewMode',
          isSequential: true,
          title: "Select Portfolio View Mode:",
          options: UNIFIED_VIEW_MODE_OPTIONS
        }
      };
      setMessages((prev) => [...prev, userMsg, nextStepMsg]);
    } else {
      const ackMsg = {
        id: `assistant-role-ack-${Date.now()}`,
        sender: 'assistant',
        text: `Switched track to ${label}. Feel free to ask about Atul's ${label} experience, featured projects, or key skills!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chips: PROMPT_CHIPS.slice(0, 4)
      };
      setMessages((prev) => [...prev, userMsg, ackMsg]);
    }
    setTimeout(scrollToBottom, 50);
  };

  const handleRoleDecisionSkip = (isSequential = true) => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    const userMsg = {
      id: `user-skip-role-${Date.now()}`,
      sender: 'user',
      text: "⏩ Skipped Role Selection",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    if (isSequential) {
      const nextStepMsg = {
        id: `assistant-viewmode-${Date.now()}`,
        sender: 'assistant',
        text: "Understood! Next, which portfolio view mode would you like to switch to? / अब पोर्टफोलियो व्यू मोड चुनें:",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        decisionTree: {
          step: 'viewMode',
          isSequential: true,
          title: "Select Portfolio View Mode:",
          options: UNIFIED_VIEW_MODE_OPTIONS
        }
      };
      setMessages((prev) => [...prev, userMsg, nextStepMsg]);
    }
    setTimeout(scrollToBottom, 50);
  };

  const handleTriggerAudienceDecisionTree = () => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    const newMsg = {
      id: `assistant-audience-trigger-${Date.now()}`,
      sender: 'assistant',
      text: "Welcome! Who are you viewing Atul's portfolio as? / कृपया अपनी ऑडियंस प्राथमिकता चुनें:",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      decisionTree: {
        step: 'audience',
        isSequential: true,
        title: "Select Audience Perspective:",
        options: UNIFIED_AUDIENCE_OPTIONS
      }
    };
    setMessages((prev) => [...prev, newMsg]);
    if (soundEnabled && soundFX?.playFocusBeep) soundFX.playFocusBeep();
    setTimeout(scrollToBottom, 50);
  };

  const handleTriggerRoleDecisionTree = () => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    const newMsg = {
      id: `assistant-role-trigger-${Date.now()}`,
      sender: 'assistant',
      text: "Which professional track / role would you like to explore? / अपनी पसंदीदा जॉब रोल / ट्रैक चुनें:",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      decisionTree: {
        step: 'role',
        isSequential: true,
        title: "Select Job Role / Professional Track:",
        options: UNIFIED_ROLE_OPTIONS
      }
    };
    setMessages((prev) => [...prev, newMsg]);
    if (soundEnabled && soundFX?.playFocusBeep) soundFX.playFocusBeep();
    setTimeout(scrollToBottom, 50);
  };

  const handleTriggerViewModeDecisionTree = () => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    const newMsg = {
      id: `assistant-viewmode-trigger-${Date.now()}`,
      sender: 'assistant',
      text: "Which portfolio view mode would you like to switch to? / पोर्टफोलियो व्यू मोड चुनें:",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      decisionTree: {
        step: 'viewMode',
        isSequential: false,
        title: "Select Portfolio View Mode:",
        options: UNIFIED_VIEW_MODE_OPTIONS
      }
    };
    setMessages((prev) => [...prev, newMsg]);
    if (soundEnabled && soundFX?.playFocusBeep) soundFX.playFocusBeep();
    setTimeout(scrollToBottom, 50);
  };

  const handleViewModeDecisionSelect = (mode, label, isSequential = false) => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    selectViewMode(mode);
    const userMsg = {
      id: `user-viewmode-${Date.now()}`,
      sender: 'user',
      text: label,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    if (isSequential) {
      const step4Msg = {
        id: `assistant-step4-${Date.now()}`,
        sender: 'assistant',
        text: `Switched portfolio view mode to ${label}. एक अंतिम सवाल: बेहतर और अधिक सटीक रिस्पॉन्स के लिए क्या आप ऑन-डिवाइस AI का उपयोग करना चाहेंगे? (इसके लिए आपके डिवाइस में एक बहुत ही लाइटवेट AI मॉडल लोड किया जाएगा)`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        decisionTree: {
          step: 'ai_consent',
          title: "ऑन-डिवाइस AI मॉडल सहमति / On-Device AI Consent:",
          options: AI_MODEL_CONSENT_OPTIONS
        }
      };
      setMessages((prev) => [...prev, userMsg, step4Msg]);
    } else {
      const activeData = VIEW_MODES[mode] || {};
      const assistantMsg = {
        id: `assistant-viewmode-ack-${Date.now()}`,
        sender: 'assistant',
        text: `Switched portfolio view mode to ${activeData.label || label} ${activeData.emoji || '⚡'}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      if (soundEnabled && soundFX?.playSuccess) soundFX.playSuccess();
    }
    setTimeout(scrollToBottom, 50);
  };

  const handleViewModeDecisionSkip = (isSequential = true) => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    const userMsg = {
      id: `user-skip-vm-${Date.now()}`,
      sender: 'user',
      text: "⏩ Skipped View Mode Selection",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    if (isSequential) {
      const step4Msg = {
        id: `assistant-step4-${Date.now()}`,
        sender: 'assistant',
        text: "शानदार सेटिंग्स! एक अंतिम सवाल: बेहतर और अधिक सटीक रिस्पॉन्स के लिए क्या आप ऑन-डिवाइस AI का उपयोग करना चाहेंगे? (इसके लिए आपके डिवाइस में एक बहुत ही लाइटवेट AI मॉडल लोड किया जाएगा)",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        decisionTree: {
          step: 'ai_consent',
          title: "ऑन-डिवाइस AI मॉडल सहमति / On-Device AI Consent:",
          options: AI_MODEL_CONSENT_OPTIONS
        }
      };
      setMessages((prev) => [...prev, userMsg, step4Msg]);
    }
    setTimeout(scrollToBottom, 50);
  };

  /**
   * Triggers in-chat AI Model Decision Tree with 4 dynamic cards
   */
  const handleTriggerAIModelDecisionTree = () => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();

    const deviceProfile = localAiState?.deviceProfile;
    // Default to MEDIUM (Qwen-1.5B) or HIGH (Qwen-3B) for capable device
    let recommended = deviceProfile?.recommendedModel;
    if (!recommended || recommended.id === MODEL_CATALOG.BARE_MINIMUM.id) {
      recommended = MODEL_CATALOG.MEDIUM;
    }

    // Note: '🛡️ बेयर-मिनिमम बेस मॉडल' (SmolLM-135M) is excluded from user choice and reserved purely as internal baseline fallback.
    const options = [
      {
        id: recommended.id,
        modelId: recommended.id,
        shortcut: recommended.shortcut,
        label: `🚀 डिवाइस-अनुशंसित मॉडल (${recommended.shortcut})`,
        sublabel: `${recommended.name} • ~${recommended.approxSizeMB || 950}MB • डिवाइस के लिए अनुशंसित सटीकता`,
        isRecommended: true
      }
    ];

    // ⚖️ बैलेंस्ड मिड मॉडल / बैलेंस्ड लाइट मॉडल: Add Balanced Light Model (Qwen-0.5B)
    if (recommended.id !== MODEL_CATALOG.LIGHT.id) {
      options.push({
        id: MODEL_CATALOG.LIGHT.id,
        modelId: MODEL_CATALOG.LIGHT.id,
        shortcut: MODEL_CATALOG.LIGHT.shortcut,
        label: `⚖️ बैलेंस्ड लाइट मॉडल (${MODEL_CATALOG.LIGHT.shortcut})`,
        sublabel: `${MODEL_CATALOG.LIGHT.name} • ~${MODEL_CATALOG.LIGHT.approxSizeMB}MB • तेज़ गति व संतुलित रिस्पॉन्स`,
        isMid: true
      });
    } else {
      options.push({
        id: MODEL_CATALOG.MEDIUM.id,
        modelId: MODEL_CATALOG.MEDIUM.id,
        shortcut: MODEL_CATALOG.MEDIUM.shortcut,
        label: `⚖️ बैलेंस्ड मीडियम मॉडल (${MODEL_CATALOG.MEDIUM.shortcut})`,
        sublabel: `${MODEL_CATALOG.MEDIUM.name} • ~${MODEL_CATALOG.MEDIUM.approxSizeMB}MB • उच्च सटीकता`,
        isMid: true
      });
    }

    // 🔌 AI ऑफ करें / Turn Off AI ([Portfolio-Engine])
    options.push({
      id: 'portfolio-engine',
      modelId: 'portfolio-engine',
      shortcut: '[Portfolio-Engine]',
      label: '🔌 AI ऑफ करें / Turn Off AI',
      sublabel: '100% ऑफलाइन डिटर्मिनिस्टिक नॉलेज इंजन [Portfolio-Engine] • 0MB',
      isTurnOff: true
    });

    const newMsg = {
      id: `assistant-ai-model-trigger-${Date.now()}`,
      sender: 'assistant',
      text: "🤖 **Select AI Model / AI मॉडल चुनें**\n\nअपनी डिवाइस क्षमता और नेटवर्क स्पीड के अनुसार उपयुक्त AI मॉडल चुनें या AI को ऑफ करके 100% ऑफलाइन इंजन इस्तेमाल करें:",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      decisionTree: {
        step: 'ai_model_switch',
        title: "🤖 Select AI Model / AI मॉडल चुनें:",
        options
      }
    };
    setMessages((prev) => [...prev, newMsg]);
    if (soundEnabled && soundFX?.playFocusBeep) soundFX.playFocusBeep();
    setTimeout(scrollToBottom, 50);
  };

  /**
   * Handles user selection from Post-Download Model Activation Decision Tree
   */
  const handleModelActivationSelect = (chip) => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();

    if (chip.action === 'activate') {
      localAIService.activateModel(chip.modelId);
      const userMsg = {
        id: `user-activate-${Date.now()}`,
        sender: 'user',
        text: '⚡ हाँ, एक्टिवेट करो / Yes, Activate Now',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const assistantMsg = {
        id: `assistant-activate-ack-${Date.now()}`,
        sender: 'assistant',
        modelShortcut: chip.shortcut || '[On-Device AI]',
        text: `✅ **AI मॉडल ${chip.shortcut || ''} सक्रिय कर दिया गया है!**\n\nअब आपके सभी प्रश्न सीधे आपके डिवाइस पर 100% प्राइवेट और ऑन-डिवाइस AI द्वारा प्रोसेस किए जाएंगे।`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chips: PROMPT_CHIPS
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      if (soundEnabled && soundFX?.playSuccess) soundFX.playSuccess();
      announce(`AI model ${chip.shortcut} activated successfully.`, 'polite');
    } else {
      const userMsg = {
        id: `user-activate-later-${Date.now()}`,
        sender: 'user',
        text: '⏳ नहीं, अभी रहने दो / No, Later',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const assistantMsg = {
        id: `assistant-activate-later-ack-${Date.now()}`,
        sender: 'assistant',
        modelShortcut: localAiState?.activeModel?.shortcut || '[Portfolio-Engine]',
        text: "👌 **ठीक है!** मॉडल आपके ब्राउज़र कैशे में 100% सुरक्षित सहेजा गया है।\n\nवर्तमान मोड जारी है। आप जब चाहें AI मॉडल मेन्यू से इसे कभी भी एक्टिवेट कर सकते हैं!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chips: PROMPT_CHIPS
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      if (soundEnabled && soundFX?.playTap) soundFX.playTap();
      announce('Model remains saved in cache. Current mode continued.', 'polite');
    }
    setTimeout(scrollToBottom, 50);
  };

  /**
   * Phase 3: Fallback to 0MB Deterministic Engine
   */
  const runDeterministicRag = useCallback((query) => {
    let res = null;
    try {
      if (typeof queryAssistant === 'function') {
        res = queryAssistant(query, { role: activeRole, audience });
      }
    } catch (err) {
      console.warn('runDeterministicRag queryAssistant error:', err);
    }
    const replyText = (res && res.text) ? res.text : generateBotReply(query);
    const assistantMsgId = (res && res.id) || `assistant-${Date.now()}`;
    const assistantMessage = {
      id: assistantMsgId,
      role: 'assistant',
      sender: 'assistant',
      modelShortcut: '[Portfolio-Engine]',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chips: (res && res.chips) || PROMPT_CHIPS,
      actions: (res && res.actions) || [],
      decisionTree: (res && res.decisionTree) || null,
      card: (res && res.card) || null,
      intent: (res && res.intent) || null
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
    setIsStreaming(false);
    triggerAutoSpeak(assistantMsgId, replyText);
    scrollToBottom();
  }, [activeRole, audience]);

  /**
   * Phase 3: Neural Model Request & Consent Interception
   */
  const handleRequestNeuralModel = useCallback((targetModel, query) => {
    // If user disabled neural or chose 0MB RAG
    if (chatSettings?.modelId === 'offline_rag') {
      return runDeterministicRag(query);
    }

    // If consent policy is auto_confirm
    if (chatSettings?.consentMode === 'auto_confirm') {
      if (typeof localAIService.loadModel === 'function') {
        return localAIService.loadModel(targetModel?.id, { triggerQuery: query });
      }
      return localAIService.switchModel(targetModel?.id);
    }

    // If Wi-Fi only and user is on cellular/metered connection
    if (chatSettings?.consentMode === 'wifi_only' && typeof navigator !== 'undefined' && navigator.connection?.saveData) {
      if (typeof announce === 'function') {
        announce('Cellular data saver detected. Using 0MB Offline RAG.', 'polite');
      }
      return runDeterministicRag(query);
    }

    // Otherwise, present interactive consent modal
    setPendingModelDownload({
      model: targetModel,
      query: query,
      onConfirm: (rememberChoice) => {
        if (rememberChoice && typeof updateChatSettings === 'function') {
          updateChatSettings({ consentMode: 'auto_confirm' });
        }
        setPendingModelDownload(null);
        if (typeof localAIService.loadModel === 'function') {
          localAIService.loadModel(targetModel?.id, { triggerQuery: query });
        } else {
          localAIService.switchModel(targetModel?.id);
        }
      },
      onDecline: () => {
        setPendingModelDownload(null);
        runDeterministicRag(query);
      }
    });
  }, [chatSettings, updateChatSettings, runDeterministicRag, announce]);

  const handleAiModelSwitchSelect = (chip) => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();

    const currentState = localAIService.getState();
    const isAlreadyActive = currentState.activeModel?.id === chip.modelId && currentState.status === 'ready';
    const isAlreadyDownloading = !chip.isTurnOff && chip.modelId !== 'portfolio-engine' &&
      (currentState.downloadingModel?.id === chip.modelId || currentState.activeModel?.id === chip.modelId) &&
      (currentState.status === 'downloading' || currentState.status === 'compiling' || currentState.status === 'loading_cache' || currentState.status === 'profiling');

    if (isAlreadyActive || isAlreadyDownloading) {
      return;
    }

    if (modelSwitchDebounceTimerRef.current) {
      clearTimeout(modelSwitchDebounceTimerRef.current);
      modelSwitchDebounceTimerRef.current = null;
    }

    if (chip.isTurnOff || chip.modelId === 'portfolio-engine') {
      localAIService.turnOffAI();
      const userMsg = {
        id: `user-ai-turnoff-${Date.now()}`,
        sender: 'user',
        text: '🔌 Turn Off AI / [Portfolio-Engine]',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const assistantMsg = {
        id: `assistant-ai-off-ack-${Date.now()}`,
        sender: 'assistant',
        modelShortcut: '[Portfolio-Engine]',
        text: "✅ ऑन-डिवाइस AI बंद कर दिया गया है।\n\nअसिस्टेंट अब 100% ऑफलाइन नॉलेज इंजन `[Portfolio-Engine]` पर काम कर रहा है। तेज़ और सटीक पोर्टफोलियो नेविगेशन के लिए आप कोई भी प्रश्न पूछ सकते हैं!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chips: PROMPT_CHIPS
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      if (soundEnabled && soundFX?.playSuccess) soundFX.playSuccess();
      announce('On-Device AI turned off. Running on offline knowledge engine.', 'polite');
    } else {
      // Check consent before model switch download if consentMode === 'always_ask'
      const isAlreadyCached = localAiState?.cachedModels?.includes(chip.modelId);
      if (!isAlreadyCached && chatSettings?.consentMode === 'always_ask') {
        const targetModel = MODEL_CATALOG[chip.modelId] || { id: chip.modelId, name: chip.label, approxSizeMB: chip.sizeMB || 90 };
        handleRequestNeuralModel(targetModel, '');
        return;
      }

      // Debounce rapid model switcher clicks (250ms window) to safely cancel prior requests
      modelSwitchDebounceTimerRef.current = setTimeout(() => {
        localAIService.switchModel(chip.modelId);
        modelSwitchDebounceTimerRef.current = null;
      }, 250);

      // Set ref so the background switching listener doesn't duplicate the message
      lastSwitchingNoticeRef.current = chip.modelId;

      const userMsg = {
        id: `user-ai-model-${Date.now()}`,
        sender: 'user',
        text: chip.label,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const assistantMsg = {
        id: `assistant-ai-model-ack-${Date.now()}`,
        sender: 'assistant',
        modelShortcut: chip.shortcut,
        text: `Your new model is loading in chat box...\n\n⚡ AI मॉडल **${chip.shortcut}** लोड किया जा रहा है...\n\nयह मॉडल आपके ब्राउज़र में 100% प्राइवेट और ऑन-डिवाइस चलेगा। डाउनलोड पूरा होते ही एक्टिव स्टेटस बार अपडेट हो जाएगा! (आप बिना किसी रुकावट के ऑफलाइन नॉलेज इंजन से तुरंत चैट जारी रख सकते हैं)`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chips: PROMPT_CHIPS
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      if (soundEnabled && soundFX?.playSuccess) soundFX.playSuccess();
      announce(`Switching to model ${chip.shortcut}`, 'polite');
    }
    setTimeout(scrollToBottom, 50);
  };

  /**
   * 1-Click quick toggle between On-Device AI and Offline Engine
   */
  const handleToggleAIQuick = () => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    const isCurrentlyOn = (localAiState?.status === 'ready' && localAiState?.activeModel !== null) || localAiState?.status === 'downloading';

    if (isCurrentlyOn) {
      localAIService.turnOffAI();
      const userMsg = {
        id: `user-ai-toggle-off-${Date.now()}`,
        sender: 'user',
        text: '🔌 Turn Off AI (Quick Toggle)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const assistantMsg = {
        id: `assistant-ai-toggle-off-ack-${Date.now()}`,
        sender: 'assistant',
        modelShortcut: '[Portfolio-Engine]',
        text: "✅ ऑन-डिवाइस AI बंद कर दिया गया है।\n\nअसिस्टेंट अब 100% ऑफलाइन नॉलेज इंजन `[Portfolio-Engine]` पर चल रहा है।",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chips: PROMPT_CHIPS
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      announce('On-Device AI turned off', 'polite');
    } else {
      if (chatSettings?.consentMode === 'always_ask') {
        const targetModel = localAiState?.deviceProfile?.recommendedModel || getBareMinimumModel();
        handleRequestNeuralModel(targetModel, '');
        return;
      }
      localAIService.turnOnAI();
      const userMsg = {
        id: `user-ai-toggle-on-${Date.now()}`,
        sender: 'user',
        text: '⚡ Turn On AI (Quick Toggle)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const assistantMsg = {
        id: `assistant-ai-toggle-on-ack-${Date.now()}`,
        sender: 'assistant',
        text: "⚡ ऑन-डिवाइस AI शुरू किया जा रहा है... मॉडल डाउनलोड होकर सक्रिय हो जाएगा।",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chips: PROMPT_CHIPS
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      announce('On-Device AI turned on', 'polite');
    }
    setTimeout(scrollToBottom, 50);
  };

  const handleClearChat = () => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    try {
      if (typeof clearSessionMemory === 'function') {
        clearSessionMemory();
      }
      if (typeof resetConversationalContext === 'function') {
        resetConversationalContext();
      }
    } catch {
      // safe fallback
    }
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {
        // safe fallback
      }
    }
    let initialChips = PROMPT_CHIPS;
    try {
      if (typeof getInitialSuggestions === 'function') {
        const suggestions = getInitialSuggestions({ role: activeRole, audience });
        if (Array.isArray(suggestions) && suggestions.length > 0) {
          initialChips = suggestions;
        }
      }
    } catch {
      // safe fallback
    }
    const audLabel = getAudienceLabel(audience);
    const rLabel = getRoleLabel(activeRole);
    const vmLabel = getViewModeLabel(viewMode);

    const welcomeMsg = {
      ...DEFAULT_WELCOME_MESSAGE,
      id: `welcome-${Date.now()}`,
      modelShortcut: localAiState?.activeModel?.shortcut || '[Portfolio-Engine]',
      chips: initialChips,
      summaryCard: {
        audience: audLabel,
        role: rLabel,
        viewMode: vmLabel
      },
      decisionTree: {
        step: 'preferences_prompt',
        title: 'क्या आप इन प्राथमिकताओं को बदलना चाहते हैं? / Would you like to customize your preferences?',
        options: DEFAULT_PREFERENCES_PROMPT_OPTIONS
      }
    };
    const resetMessages = [welcomeMsg];
    inMemoryMessagesCache = resetMessages;
    handleStopGenerating();
    setMessages(resetMessages);
    setInputValue('');
    setIsTyping(false);
    announce('Chat conversation reset to initial welcome message', 'polite');
    setLiveAnnouncement('Chat conversation reset to initial welcome message');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Handle message submission with real-time streaming and typewriter effect
  const handleSendMessage = (textToSend) => {
    const trimmed = (textToSend || inputValue).trim();
    if (!trimmed || isTyping || isStreaming) return;

    const sendStartTime = Date.now();
    soundFX.triggerHaptic(20);

    if (soundEnabled && soundFX?.playTap) {
      soundFX.playTap();
    }

    const newMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue('');
    setIsTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Process message with natural delay and hybrid inference
    typingTimeoutRef.current = setTimeout(async () => {
      try {
        let response = null;
        let botReplyText = '';
        let botChips = null;
        let botActions = null;
        let botDecisionTree = null;
        let isFallbackQuery = false;

        try {
          if (typeof queryAssistant === 'function') {
            response = queryAssistant(trimmed, { role: activeRole, audience });
            if (response) {
              botReplyText = response.text || '';
              botChips = response.chips || null;
              botActions = response.actions || null;
              botDecisionTree = response.decisionTree || null;
              isFallbackQuery = Boolean(response.isFallback || response.intent === 'fallback');
            }
          }
        } catch (err) {
          console.warn('queryAssistant exception:', err);
        }

        // Active model shortcut: reflects active local model or offline engine
        const isOnDeviceReady = (localAiState?.status === 'ready' || localAiState?.status === 'generating') && localAiState?.activeModel && localAiState?.isAiEnabled !== false;
        const activeShortcut = isOnDeviceReady ? localAiState.activeModel.shortcut : '[Portfolio-Engine]';

        // Hybrid Smart Inference:
        // 1. If unmatched / general query (isFallbackQuery || !botReplyText) and On-Device AI is active:
        //    call localAIService.generateText(query) with real-time token streaming!
        if (isOnDeviceReady && (isFallbackQuery || !botReplyText)) {
          const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          activeRequestIdRef.current = requestId;

          const assistantMsgId = (response && response.id) || `assistant-${Date.now()}`;
          const assistantMessage = {
            id: assistantMsgId,
            role: 'assistant',
            sender: 'assistant',
            modelShortcut: activeShortcut,
            text: '',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            chips: (response && response.chips) || botChips || PROMPT_CHIPS,
            actions: (response && response.actions) || botActions || [],
            decisionTree: (response && response.decisionTree) || botDecisionTree || null,
            card: (response && response.card) || null,
            intent: (response && response.intent) || null
          };

          setMessages((prev) => [...prev, assistantMessage]);
          setIsTyping(false);
          setIsStreaming(true);

          try {
            const systemPrompt = "You are Atul's AI Assistant for Atul Verma's portfolio. Provide helpful, accurate, concise answers.";
            const genFn = typeof localAIService.generate === 'function' ? localAIService.generate.bind(localAIService) : localAIService.generateText.bind(localAIService);
            const genResult = await genFn({
              prompt: trimmed,
              systemPrompt,
              maxTokens: chatSettings?.maxTokens || 512,
              temperature: chatSettings?.temperature ?? 0.7,
              requestId,
              onToken: (chunk, accumulatedText) => {
                if (chatSettings?.streamResponse !== false) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId
                        ? { ...m, text: accumulatedText }
                        : m
                    )
                  );
                  scrollToBottom();
                }
              }
            });

            activeRequestIdRef.current = null;
            setIsStreaming(false);

            const finalAiText = (genResult && genResult.text && genResult.text.trim()) ? genResult.text.trim() : generateBotReply(trimmed);
            if (genResult && genResult.text && genResult.text.trim()) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId
                    ? { ...m, text: finalAiText }
                    : m
                )
              );
            } else {
              setMessages((prev) =>
                prev.map((m) => {
                  if (m.id === assistantMsgId) {
                    return { ...m, text: m.text ? m.text : finalAiText };
                  }
                  return m;
                })
              );
            }

            // Phase 11: Hands-Free Auto-Speak
            triggerAutoSpeak(assistantMsgId, finalAiText);

            // Phase 9: Telemetry record for on-device generation
            const latencyMs = Date.now() - sendStartTime;
            const approxTokens = Math.max(1, Math.round(((genResult?.text || '').length || 40) / 4));
            recordMessageLatency(latencyMs, localAiState?.activeModel?.id || 'on-device-ai', approxTokens);
            recordDomainInteraction(detectDomainFromQuery(trimmed));
          } catch (genErr) {
            console.warn('[AIChatWidget] On-Device AI generateText fallback:', genErr);
            activeRequestIdRef.current = null;
            setIsStreaming(false);
            const fallbackReply = generateBotReply(trimmed);
            setMessages((prev) =>
              prev.map((m) => {
                if (m.id === assistantMsgId) {
                  return { ...m, text: m.text ? m.text : fallbackReply };
                }
                return m;
              })
            );
            triggerAutoSpeak(assistantMsgId, fallbackReply);
            const latencyMs = Date.now() - sendStartTime;
            recordMessageLatency(latencyMs, 'portfolio-engine', Math.max(1, Math.round(fallbackReply.length / 4)));
            recordDomainInteraction(detectDomainFromQuery(trimmed));
          }

          if (soundEnabled && soundFX?.playFocusBeep) {
            soundFX.playFocusBeep();
          }
          scrollToBottom();
          return;
        }

        // Phase 3: Check if on-device model should be requested with consent when offline engine is not forced
        if (!isOnDeviceReady && (isFallbackQuery || !botReplyText) && chatSettings?.modelId !== 'offline_rag' && localAiState?.status === 'idle' && chatSettings?.consentMode === 'always_ask') {
          const recModel = localAiState?.deviceProfile?.recommendedModel || getBareMinimumModel();
          handleRequestNeuralModel(recModel, trimmed);
          return;
        }

        // 2. Offline knowledge engine (queryAssistant) with typewriter stream
        if (!botReplyText) {
          botReplyText = generateBotReply(trimmed);
          botChips = PROMPT_CHIPS;
        }

        const fullText = (response && response.text && !isFallbackQuery) ? response.text : botReplyText;
        const assistantMsgId = (response && response.id) || `assistant-${Date.now()}`;

        const assistantMessage = {
          id: assistantMsgId,
          role: 'assistant',
          sender: 'assistant',
          modelShortcut: activeShortcut,
          text: (prefersReducedMotion || chatSettings?.streamResponse === false) ? fullText : '',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          chips: (response && response.chips) || botChips || PROMPT_CHIPS,
          actions: (response && response.actions) || botActions || [],
          decisionTree: (response && response.decisionTree) || botDecisionTree || null,
          card: (response && response.card) || null,
          intent: (response && response.intent) || null
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);

        if (prefersReducedMotion || chatSettings?.streamResponse === false) {
          const latencyMs = Date.now() - sendStartTime;
          recordMessageLatency(latencyMs, 'portfolio-engine', Math.max(1, Math.round(fullText.length / 4)));
          recordDomainInteraction(detectDomainFromQuery(trimmed));
          if (soundEnabled && soundFX?.playFocusBeep) {
            soundFX.playFocusBeep();
          }
          scrollToBottom();
          triggerAutoSpeak(assistantMsgId, fullText);
          return;
        }

        setIsStreaming(true);
        const words = fullText.split(/(\s+)/);
        let currentIndex = 0;
        let accumulated = '';

        if (streamIntervalRef.current) {
          clearInterval(streamIntervalRef.current);
        }

        streamIntervalRef.current = setInterval(() => {
          if (currentIndex >= words.length) {
            if (streamIntervalRef.current) {
              clearInterval(streamIntervalRef.current);
              streamIntervalRef.current = null;
            }
            setIsStreaming(false);
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantMsgId ? { ...m, text: fullText } : m))
            );
            const latencyMs = Date.now() - sendStartTime;
            recordMessageLatency(latencyMs, 'portfolio-engine', Math.max(1, Math.round(fullText.length / 4)));
            recordDomainInteraction(detectDomainFromQuery(trimmed));
            if (soundEnabled && soundFX?.playFocusBeep) {
              soundFX.playFocusBeep();
            }
            scrollToBottom();
            triggerAutoSpeak(assistantMsgId, fullText);
            return;
          }

          const chunk1 = words[currentIndex] || '';
          const chunk2 = words[currentIndex + 1] || '';
          currentIndex += 2;
          accumulated += chunk1 + chunk2;

          setMessages((prev) =>
            prev.map((m) => (m.id === assistantMsgId ? { ...m, text: accumulated } : m))
          );
          scrollToBottom();
        }, 22);
      } finally {
        setIsTyping(false);
      }
    }, 350);
  };

    // Handle keyboard submission, slash autocomplete navigation & Escape minimization
  const handleKeyDown = (e) => {
    if (chatSettings?.slashCommandsEnabled !== false && inputValue.startsWith('/') && filteredSlashCommands.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSlashIndex((prev) => (prev + 1) % filteredSlashCommands.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSlashIndex((prev) => (prev - 1 + filteredSlashCommands.length) % filteredSlashCommands.length);
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        const chosen = filteredSlashCommands[activeSlashIndex] || filteredSlashCommands[0];
        if (chosen) {
          setInputValue(chosen.command);
        }
        return;
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const chosen = filteredSlashCommands[activeSlashIndex] || filteredSlashCommands[0];
        if (chosen) {
          executeSlashCommand(chosen);
        } else {
          handleSendMessage();
        }
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (inputValue.startsWith('/')) {
        setInputValue('');
        return;
      }
      setIsMinimized(true);
    }
  };

  if (!isOpen) return null;

  // Determine container positioning & sizing classes / inline styles
  // (isMobile state is reactively tracked at top of component)
  
  let containerStyle = {};
  // Specification reference: fixed bottom-0 z-[55] rounded-t-2xl rounded-b-none border-t border-x border-b-0
  let containerClasses = "fixed z-[55] select-none flex flex-col overflow-hidden bg-[#FAF8F5]/98 dark:bg-[#161122]/98 backdrop-blur-md shadow-2xl border border-[#E7E2D8] dark:border-[#2D2340]";

  if (isMobile) {
    containerClasses += " bottom-0 left-0 right-0 w-full rounded-t-2xl rounded-b-none border-x-0 border-b-0";
    containerStyle = {
      height: isMinimized ? '52px' : 'min(88dvh, 680px)',
      paddingBottom: 'env(safe-area-inset-bottom, 12px)'
    };
  } else if (isMaximized) {
    containerClasses += " rounded-2xl shadow-2xl";
    containerStyle = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '92vw',
      maxWidth: '1200px',
      height: '90vh',
      zIndex: 55,
      transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)'
    };
  } else if (position) {
    containerClasses += " rounded-2xl shadow-2xl";
    containerStyle = {
      position: 'fixed',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: `${dimensions?.width || 380}px`,
      height: isMinimized ? '52px' : `${dimensions?.height || 520}px`,
      transition: (isDraggingWindow || isResizing) ? 'none' : 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)'
    };
  } else {
    // Default docked bottom-right
    containerClasses += ` bottom-0 rounded-t-2xl rounded-b-none border-x border-t border-b-0 ${
      isDrawerOpen ? 'right-[540px]' : 'right-28'
    }`;
    containerStyle = {
      width: `${dimensions?.width || 380}px`,
      height: isMinimized ? '52px' : `${dimensions?.height || 520}px`,
      transition: (isDraggingWindow || isResizing) ? 'none' : 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)'
    };
  }

  return (
    <div
      ref={widgetRef}
      role="dialog"
      aria-label="Atul AI Assistant"
      aria-modal="false"
      style={containerStyle}
      className={containerClasses}
    >
      {/* Visually hidden live region for screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="false"
        className="sr-only"
      >
        {liveAnnouncement}
      </div>

      {/* Mobile top sheet pull indicator bar */}
      {isMobile && !isMinimized && (
        <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-stone-600 mx-auto mt-2 mb-1 shrink-0" aria-hidden="true" />
      )}

      {/* Model Download Confirmation Dialog (Phase 3) */}
      {pendingModelDownload && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-modal-title"
          className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
        >
          <div className="w-full max-w-sm p-5 bg-stone-900 border border-white/10 rounded-2xl shadow-2xl text-white space-y-4">
            {/* Icon & Title */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <DownloadCloud className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 id="consent-modal-title" className="text-sm font-semibold text-white">
                  Download On-Device AI Model?
                </h4>
                <p className="text-xs text-white/60">
                  100% Client-Side Neural LLM
                </p>
              </div>
            </div>

            {/* Model Spec Card */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/60">Model:</span>
                <span className="font-mono font-medium text-indigo-300">
                  {pendingModelDownload.model?.name || pendingModelDownload.model?.id || 'SmolLM2-135M'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Download Size:</span>
                <span className="font-medium text-emerald-400">
                  ~{pendingModelDownload.model?.approxSizeMB || pendingModelDownload.model?.sizeMB || 90} MB
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">RAM Requirement:</span>
                <span className="font-medium text-amber-300">
                  ~{pendingModelDownload.model?.ramMB || 500} MB
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Execution:</span>
                <span className="font-medium text-white/80">WebGPU / WASM</span>
              </div>
              <p className="text-[11px] text-white/50 pt-1 border-t border-white/5">
                Downloads directly to browser cache. No server API calls or data tracking.
              </p>
            </div>

            {/* Remember Choice Toggle */}
            <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberConsentChoice}
                onChange={(e) => setRememberConsentChoice(e.target.checked)}
                className="rounded border-white/20 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Remember choice (Auto-confirm future downloads)</span>
            </label>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => pendingModelDownload.onConfirm(rememberConsentChoice)}
                className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-indigo-600/30"
              >
                <Sparkles className="w-4 h-4" />
                Download & Enable AI Engine
              </button>
              <button
                type="button"
                onClick={() => pendingModelDownload.onDecline()}
                className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs transition-colors cursor-pointer"
              >
                Keep 0MB Offline RAG
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Header with Avatar, Title, Status & Controls */}
      <div
        onPointerDown={handleWindowPointerDown}
        onPointerMove={handleWindowPointerMove}
        onPointerUp={handleWindowPointerUp}
        onDoubleClick={handleResetLayout}
        onClick={isMinimized ? handleToggleMinimize : undefined}
        title={isMinimized ? "Click to expand" : "Double-click to reset position & size • Drag header to move"}
        className={`flex items-center justify-between px-3.5 bg-white/70 dark:bg-[#120D1D]/80 shrink-0 ${
          isMinimized
            ? 'h-full cursor-pointer hover:bg-white/90 dark:hover:bg-[#120D1D] transition-colors'
            : `h-14 border-b border-[#E7E2D8]/80 dark:border-[#2D2340]/80 ${
                isMaximized || isMobile ? 'cursor-default' : isDraggingWindow !== false ? 'cursor-grabbing' : 'cursor-grab'
              }`
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 pointer-events-none">
          {/* Avatar with pulsating online badge */}
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-linear-to-tr from-[#FF4D6D] to-[#9333EA] text-white shadow-xs shrink-0">
            <BotMessageSquare className="w-4 h-4 animate-pulse" />
            <span
              aria-hidden="true"
              className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5"
            >
              {localAiState?.status === 'switching' || localAiState?.status === 'downloading' || localAiState?.status === 'loading_cache' ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-amber-400" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 border-2 border-white dark:border-[#161122] bg-amber-500" />
                </>
              ) : localAiState?.status === 'ready' && localAiState?.activeModel ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 border-2 border-white dark:border-[#161122] bg-emerald-500" />
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 border-2 border-white dark:border-[#161122] bg-stone-400" />
              )}
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs font-bold font-mono tracking-tight text-[#18181B] dark:text-white truncate">
                Atul AI Assistant
              </span>
              {localAiState?.status === 'switching' || localAiState?.status === 'downloading' || localAiState?.status === 'loading_cache' ? (
                <span
                  title="Your new model is loading in chat box..."
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded-full text-amber-500 bg-amber-500/15 ring-1 ring-amber-500/40 animate-pulse shrink-0 font-semibold"
                >
                  {localAiState?.status === 'downloading' && localAiState.downloadProgress
                    ? `⬇ ${localAiState.downloadProgress}%`
                    : '⏳ Loading...'}
                </span>
              ) : localAiState?.status === 'ready' && localAiState?.activeModel ? (
                <span
                  title={`Active On-Device Model: ${localAiState.activeModel.shortcut} (${localAiState.activeModel.name || ''})`}
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded-full text-emerald-500 bg-emerald-500/15 ring-1 ring-emerald-500/40 shrink-0 font-semibold"
                >
                  ⚡ {localAiState.activeModel.shortcut}
                </span>
              ) : (
                <span
                  title="Offline Knowledge Engine Active (Instant deterministic responses)"
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded-full text-stone-400 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shrink-0 font-semibold"
                >
                  📚 Offline Engine
                </span>
              )}
            </div>
            {/* 2nd Line Subtitle: Role • Audience • View Mode */}
            <div className="flex items-center min-w-0 leading-tight mt-0.5">
              <span className="text-[10px] font-medium text-stone-600 dark:text-stone-300 truncate">
                💼 {roleData.shortLabel || roleData.label} • {activeAudienceData?.emoji || '👥'} {activeAudienceData?.shortLabel || 'All'} • {activeViewModeData?.emoji || '⚡'} {activeViewModeData?.shortLabel || 'Modern'}
              </span>
            </div>
          </div>
        </div>

        {/* Windows 11 Style Window Controls: Dock/Reset, Minimize/Expand, Maximize/Restore, and Close */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* Quick Shortcut to AI & Chat Studio Settings */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (soundEnabled && soundFX?.playClick) soundFX.playClick();
              if (typeof setActiveTab === 'function') setActiveTab('chat');
              if (typeof openDrawer === 'function') openDrawer('chat');
            }}
            aria-label="Open AI & Chat Studio Settings"
            title="AI & Chat Studio Settings (Tab 7)"
            className="min-w-[36px] min-h-[36px] sm:min-w-[28px] sm:min-h-[28px] sm:w-7 sm:h-7 rounded-md flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-hidden"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleResetLayout(e);
            }}
            aria-label="Reset (Double-click Header)"
            title="Reset (Double-click Header)"
            className="min-w-[36px] min-h-[36px] sm:min-w-[28px] sm:min-h-[28px] sm:w-7 sm:h-7 rounded-md flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleMinimize(e);
            }}
            aria-label={isMinimized ? 'Expand Chat' : 'Minimize (-)'}
            title={isMinimized ? 'Expand' : 'Minimize (-)'}
            className="min-w-[36px] min-h-[36px] sm:min-w-[28px] sm:min-h-[28px] sm:w-7 sm:h-7 rounded-md flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
          >
            {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
          </button>
          {!isMobile && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleMaximize(e);
              }}
              aria-label={isMaximized ? 'Restore chat window' : 'Maximize (Ctrl+M)'}
              title={isMaximized ? 'Restore' : 'Maximize (Ctrl+M)'}
              className="min-w-[36px] min-h-[36px] sm:min-w-[28px] sm:min-h-[28px] sm:w-7 sm:h-7 rounded-md flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClose(e);
            }}
            aria-label="Close (Esc)"
            title="Close (Esc)"
            className="min-w-[36px] min-h-[36px] sm:min-w-[28px] sm:min-h-[28px] sm:w-7 sm:h-7 rounded-md flex items-center justify-center text-stone-500 dark:text-stone-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-colors cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Multi-Directional Resize Handles & Corner Grip */}
      {!isMinimized && !isMaximized && !isMobile && (
        <>
          {/* Edges */}
          <div onPointerDown={(e) => handleResizePointerDown('top', e)} onPointerMove={handleResizePointerMove} onPointerUp={handleResizePointerUp} className="absolute top-0 left-2 right-2 h-1.5 cursor-ns-resize z-20" />
          <div onPointerDown={(e) => handleResizePointerDown('bottom', e)} onPointerMove={handleResizePointerMove} onPointerUp={handleResizePointerUp} className="absolute bottom-0 left-2 right-2 h-1.5 cursor-ns-resize z-20" />
          <div onPointerDown={(e) => handleResizePointerDown('left', e)} onPointerMove={handleResizePointerMove} onPointerUp={handleResizePointerUp} className="absolute top-2 bottom-2 left-0 w-1.5 cursor-ew-resize z-20" />
          <div onPointerDown={(e) => handleResizePointerDown('right', e)} onPointerMove={handleResizePointerMove} onPointerUp={handleResizePointerUp} className="absolute top-2 bottom-2 right-0 w-1.5 cursor-ew-resize z-20" />
          
          {/* Corners */}
          <div onPointerDown={(e) => handleResizePointerDown('top-left', e)} onPointerMove={handleResizePointerMove} onPointerUp={handleResizePointerUp} className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-30" />
          <div onPointerDown={(e) => handleResizePointerDown('top-right', e)} onPointerMove={handleResizePointerMove} onPointerUp={handleResizePointerUp} className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-30" />
          <div onPointerDown={(e) => handleResizePointerDown('bottom-left', e)} onPointerMove={handleResizePointerMove} onPointerUp={handleResizePointerUp} className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-30" />
          
          {/* Bottom-Right corner with visible diagonal resize grip '◢' */}
          <div
            onPointerDown={(e) => handleResizePointerDown('bottom-right', e)}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            title="Drag to resize window"
            className="absolute bottom-1 right-1 w-4 h-4 cursor-nwse-resize z-30 flex items-center justify-center text-stone-400 dark:text-stone-500 hover:text-[#FF4D6D]"
          >
            <span className="text-[10px] leading-none select-none font-bold">◢</span>
          </div>
        </>
      )}

      {/* When Minimized, hide the body */}
      {!isMinimized && (
        <>
          {/* On-Device AI Model Notification Banner */}
          {modelToast && (
            <div
              role="status"
              className="mx-2.5 my-1.5 px-3 py-1.5 rounded-xl bg-linear-to-r from-emerald-500/15 to-teal-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-[11px] font-medium flex items-center justify-between gap-2 shadow-2xs shrink-0 animate-in fade-in slide-in-from-top-1"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">{modelToast}</span>
              </div>
              <button
                type="button"
                onClick={() => setModelToast(null)}
                className="p-0.5 text-emerald-600 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-white cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {/* Streamlined Sub-Header: Clean Primary Toggles + Quick Tools Popover */}
          <div className="px-2.5 py-1.5 bg-stone-100/90 dark:bg-[#150F22]/90 border-b border-[#E7E2D8]/60 dark:border-[#2D2340]/60 flex items-center justify-between gap-1.5 shrink-0">
            {/* Left Action Buttons: Primary Perspective & AI Model Pills */}
            <div className="flex items-center gap-1 shrink-0 overflow-x-auto no-scrollbar">
              {/* Audience Trigger */}
              <button
                type="button"
                onClick={handleTriggerAudienceDecisionTree}
                aria-label="Select Audience Perspective"
                title={`Audience: ${getAudienceLabel(audience)}`}
                className={`px-2 py-1 rounded-lg text-[11px] font-sans font-medium flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 border ${getAudienceColorStyle(audience)}`}
              >
                <Users className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-semibold">{activeAudienceData?.shortLabel || 'Audience'}</span>
              </button>

              {/* Role Trigger */}
              <button
                type="button"
                onClick={handleTriggerRoleDecisionTree}
                aria-label="Select Job Role Track"
                title={`Role: ${getRoleLabel(activeRole)}`}
                className={`px-2 py-1 rounded-lg text-[11px] font-sans font-medium flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 border ${getRoleColorStyle(activeRole)}`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-semibold">{roleData.shortLabel || 'Role'}</span>
              </button>

              {/* AI Model Trigger Pill */}
              <button
                type="button"
                onClick={handleTriggerAIModelDecisionTree}
                aria-label="Select AI Model"
                title={`AI Model: ${
                  localAiState?.status === 'ready' && localAiState?.activeModel
                    ? localAiState.activeModel.shortcut
                    : (localAiState?.status === 'switching' || localAiState?.status === 'downloading' || localAiState?.status === 'loading_cache')
                    ? 'Loading Model...'
                    : 'Offline Engine'
                }`}
                className={`px-2 py-1 rounded-lg text-[11px] font-sans font-medium flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 border ${getAIModelColorStyle(localAiState)}`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono font-semibold">
                  {localAiState?.status === 'ready' && localAiState?.activeModel
                    ? `⚡ ${localAiState.activeModel.shortcut}`
                    : localAiState?.status === 'switching' || localAiState?.status === 'downloading'
                    ? '⏳ Loading'
                    : '📚 Offline'}
                </span>
              </button>
            </div>

            {/* Right Action: Sleek AI Status Pill & Quick Tools Popover Menu */}
            <div className="flex items-center gap-1.5 shrink-0 relative" ref={quickToolsRef}>
              {/* Sleek AI On/Off Pill Badge */}
              <button
                type="button"
                onClick={handleToggleAIQuick}
                aria-label="Toggle On-Device AI On or Off"
                title={
                  localAiState?.status === 'switching' || localAiState?.status === 'downloading' || localAiState?.status === 'loading_cache'
                    ? "Your new model is loading in chat box... Click to switch back to Offline Engine"
                    : isAiOn
                    ? "Click to Turn Off On-Device AI (Switch to Offline Knowledge Engine)"
                    : "Click to Turn On On-Device AI"
                }
                className={`px-1.5 sm:px-2 py-1 rounded-lg text-[10px] font-sans font-medium flex items-center gap-1 border transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden ${
                  localAiState?.status === 'ready' && localAiState?.activeModel
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border-emerald-500/30 hover:bg-emerald-500/25'
                    : localAiState?.status === 'switching' || localAiState?.status === 'downloading' || localAiState?.status === 'loading_cache'
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-500/15 border-amber-500/30 animate-pulse'
                    : 'text-stone-500 dark:text-stone-400 bg-stone-200/50 dark:bg-stone-800/50 border-stone-300/50 dark:border-stone-700/50 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {localAiState?.status === 'ready' && localAiState?.activeModel
                  ? '⚡ AI On'
                  : localAiState?.status === 'switching' || localAiState?.status === 'downloading' || localAiState?.status === 'loading_cache'
                  ? '⏳ AI Loading'
                  : '🔌 AI Off'}
              </button>

              {/* Unified ••• Quick Tools Menu Button */}
              <button
                type="button"
                onClick={() => {
                  setShowQuickTools((prev) => !prev);
                  setShowExportMenu(false);
                }}
                aria-label="Quick Tools Menu"
                aria-haspopup="menu"
                aria-expanded={showQuickTools}
                title="Quick Tools (History, Export, Voice, Emojis, Clear)"
                className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer active:scale-95 border ${
                  showQuickTools
                    ? 'bg-[#FF4D6D] text-white border-[#FF4D6D] shadow-xs'
                    : 'bg-white/80 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:text-stone-900 dark:hover:text-white hover:border-[#FF4D6D]/40'
                }`}
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
                <span className="tracking-widest text-[11px] font-bold">•••</span>
                <span className="text-[11px] hidden sm:inline">Tools</span>
              </button>

              {/* Quick Tools Popover Dropdown */}
              {showQuickTools && (
                <div
                  role="menu"
                  aria-label="Quick tools menu"
                  className="absolute right-0 top-full mt-1.5 w-56 py-1.5 bg-white/95 dark:bg-[#181124]/95 border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xl z-50 text-xs backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-stone-400 dark:text-stone-500 border-b border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
                    <span>Quick Tools</span>
                    <span className="text-[9px]">Esc to close</span>
                  </div>

                  {/* 1. Meta-Prompt Studio */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setShowQuickTools(false);
                      handleOpenPromptStudio();
                    }}
                    className="w-full text-left px-3 py-2 text-stone-700 dark:text-stone-200 hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <div className="flex-1">
                      <span className="font-medium">Meta-Prompt Studio</span>
                      <span className="block text-[10px] text-stone-400 font-mono">/engineer</span>
                    </div>
                  </button>

                  {/* 2. Voice Synthesis Studio */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setShowQuickTools(false);
                      setShowVoiceSettings(true);
                    }}
                    className="w-full text-left px-3 py-2 text-stone-700 dark:text-stone-200 hover:bg-[#FF4D6D]/10 hover:text-[#FF4D6D] flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[#FF4D6D] shrink-0" />
                    <div className="flex-1">
                      <span className="font-medium">Voice Synthesis Studio</span>
                      <span className="block text-[10px] text-stone-400 font-mono">/voicesettings</span>
                    </div>
                  </button>

                  {/* 3. Session History Drawer */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setShowQuickTools(false);
                      setShowHistoryDrawer(true);
                    }}
                    className="w-full text-left px-3 py-2 text-stone-700 dark:text-stone-200 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <History className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <div className="flex-1">
                      <span className="font-medium">Conversation History</span>
                      <span className="block text-[10px] text-stone-400 font-mono">Session History & Archive</span>
                    </div>
                  </button>

                  {/* 4. Emoji Toggle */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setEmojiEnabled((prev) => !prev);
                    }}
                    className="w-full text-left px-3 py-2 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>😊</span>
                      <span className="font-medium">Expressive Emojis</span>
                    </div>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                      emojiEnabled ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
                    }`}>
                      {emojiEnabled ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  {/* 5. Switch View Mode */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setShowQuickTools(false);
                      handleTriggerViewModeDecisionTree();
                    }}
                    aria-label="Switch View Mode (Modern, Terminal, Simple, Basic)"
                    title={`Switch View Mode: ${getViewModeLabel(viewMode)}`}
                    className="w-full text-left px-3 py-2 text-stone-700 dark:text-stone-200 hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Monitor className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <div className="flex-1">
                      <span className="font-medium">Switch View Mode</span>
                      <span className="block text-[10px] text-stone-400 font-mono">{getViewModeLabel(viewMode)}</span>
                    </div>
                  </button>

                  <div className="my-1 border-t border-stone-100 dark:border-stone-800" />

                  {/* 5. Export Transcript Popover / Modal trigger */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setShowQuickTools(false);
                      setShowExportMenu(true);
                    }}
                    className="w-full text-left px-3 py-2 text-stone-700 dark:text-stone-200 hover:bg-[#FF4D6D]/10 hover:text-[#FF4D6D] flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#FF4D6D] shrink-0" />
                    <div className="flex-1">
                      <span className="font-medium">Export Transcript</span>
                      <span className="block text-[10px] text-stone-400 font-mono">MD, TXT, JSON, HTML</span>
                    </div>
                  </button>

                  {/* 6. Clear Chat */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setShowQuickTools(false);
                      handleClearChat();
                    }}
                    className="w-full text-left px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-500/10 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                    <div className="flex-1">
                      <span className="font-semibold">Clear Conversation</span>
                      <span className="block text-[10px] text-stone-400 font-mono">Reset memory</span>
                    </div>
                  </button>
                </div>
              )}

              {/* Export Transcript Popover */}
              {showExportMenu && (
                <div
                  role="menu"
                  aria-label="Export format options"
                  className="absolute right-0 top-full mt-1.5 w-52 py-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xl z-50 text-xs animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
                >
                  <div className="px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-stone-500 dark:text-stone-400 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <span>Export Transcript</span>
                    <button
                      type="button"
                      onClick={() => setShowExportMenu(false)}
                      className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-0.5 cursor-pointer"
                      aria-label="Close export menu"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleExportFormat('markdown');
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-stone-700 dark:text-stone-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-[#FF4D6D] flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium">📄 Markdown (.md)</span>
                    <span className="text-[10px] text-stone-400">GH Flavored</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleExportFormat('txt');
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-stone-700 dark:text-stone-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-[#FF4D6D] flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium">📝 Plain Text (.txt)</span>
                    <span className="text-[10px] text-stone-400">ASCII Log</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleExportFormat('json');
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-stone-700 dark:text-stone-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-[#FF4D6D] flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium">📊 JSON Transcript</span>
                    <span className="text-[10px] text-stone-400">Raw Data</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleExportFormat('html');
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-stone-700 dark:text-stone-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-[#FF4D6D] flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium">🌐 HTML Print Page</span>
                    <span className="text-[10px] text-stone-400">Self-Contained</span>
                  </button>
                  <div className="my-1 border-t border-stone-100 dark:border-stone-800" />
                  <button
                    type="button"
                    onClick={() => {
                      handleCopyAllTranscript();
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-[#FF4D6D] hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-between font-bold cursor-pointer"
                  >
                    <span>📋 Copy All to Clipboard</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Voice Settings Studio Modal / Popover */}
          {showVoiceSettings && (
            <div
              role="dialog"
              aria-label="Voice Synthesis Studio Settings"
              className="mx-2.5 my-1.5 p-3.5 rounded-2xl bg-white/95 dark:bg-stone-900/95 border border-stone-200 dark:border-stone-800 shadow-xl backdrop-blur-md z-40 animate-in fade-in slide-in-from-top-2 duration-200 shrink-0 text-xs"
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-white">
                  <Volume2 className="w-3.5 h-3.5 text-[#FF4D6D]" />
                  <span>Voice Synthesis Studio (Phase 11)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVoiceSettings(false)}
                  aria-label="Close voice settings"
                  className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Voice Profile Dropdown */}
                <div>
                  <label htmlFor="voice-profile-select" className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Voice Profile
                  </label>
                  <select
                    id="voice-profile-select"
                    value={voiceConfig.voiceProfile || 'auto'}
                    onChange={(e) => {
                      const updated = setVoiceConfig({ voiceProfile: e.target.value });
                      setVoiceConfigState(updated);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-hidden focus:border-[#FF4D6D]"
                  >
                    <option value="auto">Standard Assistant (Auto-detect Language)</option>
                    <option value="en-IN">Natural Indian English (en-IN)</option>
                    <option value="hi-IN">Natural Hindi (hi-IN / हिंदी)</option>
                    <option value="en-US">US Professional (en-US)</option>
                  </select>
                </div>

                {/* Speed (Rate) Slider */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    <span>Speaking Rate</span>
                    <span className="font-mono text-[10px] text-stone-500">{voiceConfig.rate.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="1.5"
                    step="0.05"
                    value={voiceConfig.rate}
                    aria-label="Speaking rate slider"
                    onChange={(e) => {
                      const updated = setVoiceConfig({ rate: parseFloat(e.target.value) });
                      setVoiceConfigState(updated);
                    }}
                    className="w-full accent-[#FF4D6D] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                    <span>0.75x Deliberate</span>
                    <span>1.0x Normal</span>
                    <span>1.5x Fast</span>
                  </div>
                </div>

                {/* Pitch Slider */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    <span>Pitch Modulator</span>
                    <span className="font-mono text-[10px] text-stone-500">{voiceConfig.pitch.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.2"
                    step="0.05"
                    value={voiceConfig.pitch}
                    aria-label="Pitch modulator slider"
                    onChange={(e) => {
                      const updated = setVoiceConfig({ pitch: parseFloat(e.target.value) });
                      setVoiceConfigState(updated);
                    }}
                    className="w-full accent-[#FF4D6D] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                    <span>0.8x Deeper</span>
                    <span>1.0x Natural</span>
                    <span>1.2x Higher</span>
                  </div>
                </div>

                {/* Hands-Free Auto-Speak Toggle */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[11px] font-semibold text-stone-800 dark:text-stone-200 block">
                      Hands-Free Auto-Speak
                    </span>
                    <span className="text-[9.5px] text-stone-500 dark:text-stone-400 block">
                      Automatically reads incoming assistant messages aloud
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={Boolean(voiceConfig.autoSpeakResponses)}
                    aria-label="Toggle Hands-Free Auto-Speak"
                    onClick={() => {
                      const nextVal = !voiceConfig.autoSpeakResponses;
                      const updated = setVoiceConfig({ autoSpeakResponses: nextVal });
                      setVoiceConfigState(updated);
                    }}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      voiceConfig.autoSpeakResponses ? 'bg-[#FF4D6D]' : 'bg-stone-300 dark:bg-stone-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        voiceConfig.autoSpeakResponses ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Buttons: Test Sample & Reset */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={() => {
                      const sampleText = voiceConfig.voiceProfile === 'hi-IN'
                        ? 'नमस्ते! मैं अतुल का AI वॉइस असिस्टेंट हूँ। मैं आपकी क्या सहायता कर सकता हूँ?'
                        : "Hello! I am Atul's voice agent. Natural speech synthesis is active and ready.";
                      speakText(sampleText, {
                        voices: availableVoicesRef.current,
                        rate: voiceConfig.rate,
                        pitch: voiceConfig.pitch,
                        volume: voiceConfig.volume,
                        voiceProfile: voiceConfig.voiceProfile
                      });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Test Voice Sample</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const resetCfg = resetVoiceConfig();
                      setVoiceConfigState(resetCfg);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 text-[11px] font-medium cursor-pointer transition-colors"
                  >
                    Reset to Default
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Session Archive & History Drawer Overlay */}
          {showHistoryDrawer && (
            <div className="mx-2.5 my-1.5 p-3 rounded-2xl bg-white/95 dark:bg-stone-900/95 border border-stone-200 dark:border-stone-800 shadow-xl backdrop-blur-md z-40 animate-in fade-in slide-in-from-top-2 duration-200 shrink-0">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 dark:text-white">
                  <History className="w-3.5 h-3.5 text-[#FF4D6D]" />
                  <span>Session Archive ({savedSessions.length}/10)</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleStartNewSession}
                    title="Start fresh conversation"
                    className="px-2 py-0.5 text-[10px] font-semibold bg-[#FF4D6D] text-white rounded-md hover:bg-[#ff3358] flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>New Session</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowHistoryDrawer(false)}
                    aria-label="Close session archive"
                    className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="max-h-44 overflow-y-auto space-y-1.5 pr-0.5 text-xs">
                {savedSessions.length === 0 ? (
                  <p className="text-center py-4 text-stone-500 text-[11px]">No stored conversation history yet.</p>
                ) : (
                  savedSessions.map((sess) => {
                    const isActive = sess.id === activeSessionId;
                    return (
                      <div
                        key={sess.id}
                        onClick={() => handleLoadSession(sess.id)}
                        className={`p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                          isActive
                            ? 'bg-rose-50/80 dark:bg-rose-950/30 border-[#FF4D6D]/40 text-stone-900 dark:text-white'
                            : 'bg-stone-50/60 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold truncate text-[11.5px]">{sess.title || 'Conversation'}</span>
                            {isActive && (
                              <span className="text-[9px] px-1.5 py-0.2 bg-[#FF4D6D] text-white rounded-full font-bold uppercase shrink-0">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-stone-500 dark:text-stone-400 flex items-center gap-2 mt-0.5">
                            <span>{sess.messages?.length || 0} msgs</span>
                            <span>•</span>
                            <span>{sess.updatedAt ? new Date(sess.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'recently'}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSession(sess.id, e)}
                          title="Delete session"
                          className="p-1 rounded text-stone-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {savedSessions.length > 0 && (
                <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center text-[10px]">
                  <span className="text-stone-500 dark:text-stone-400">FIFO Quota: auto-pruned past 10 sessions</span>
                  <button
                    type="button"
                    onClick={() => {
                      clearAllSessions();
                      setSavedSessions([]);
                      announce('Cleared all saved sessions', 'polite');
                    }}
                    className="text-stone-500 dark:text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Model Switching Orange Status Card */}
          {localAiState?.status === 'switching' && (
            <div
              role="status"
              aria-live="polite"
              className="mx-3 my-1.5 px-3 py-2 rounded-xl bg-orange-500/15 border border-orange-400/50 dark:border-orange-500/40 flex items-center justify-between gap-2 text-xs shrink-0 backdrop-blur-xs animate-in fade-in"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping shrink-0" />
                <span className="text-[11px] font-bold text-orange-900 dark:text-orange-200 truncate">
                  🔄 Your new model is loading in chat box...
                </span>
              </div>
            </div>
          )}

          {/* Prominent Live Download Card & Real Progress Bar (Subtle & Always-On Status) */}
          {localAiState?.status === 'downloading' && (
            isDownloadCollapsed ? (
              <div
                role="status"
                aria-live="polite"
                className="mx-3 my-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-400/40 dark:border-amber-500/30 flex items-center justify-between gap-2 text-xs shrink-0 backdrop-blur-xs animate-in fade-in"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                  <span className="text-[10.5px] font-semibold text-amber-900 dark:text-amber-200 truncate">
                    Downloading AI: {localAiState.downloadProgress}% • Instant Offline Chat Active
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-16 bg-stone-200 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-linear-to-r from-amber-500 to-[#FF4D6D] h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(localAiState.downloadProgress, 4))}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDownloadCollapsed(false)}
                    className="p-0.5 rounded text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer text-[10px] font-mono"
                    title="Expand download card"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                role="status"
                aria-live="polite"
                className="mx-3 my-2 p-3 rounded-2xl bg-linear-to-br from-amber-500/15 via-rose-500/10 to-purple-500/15 border border-amber-400/50 dark:border-amber-500/40 shadow-md backdrop-blur-md shrink-0 animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <div className="flex items-start justify-between gap-2.5 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-linear-to-tr from-amber-500 to-[#FF4D6D] text-white flex items-center justify-center shrink-0 shadow-2xs animate-pulse">
                      <DownloadCloud className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-stone-900 dark:text-white tracking-tight">
                          Downloading On-Device AI:
                        </span>
                        <span className="text-[10.5px] font-mono font-bold text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 truncate shadow-2xs">
                          {localAiState.downloadingModel?.name || 'SmolLM2-135M-Instruct'}
                        </span>
                        <span className="text-[9.5px] font-mono font-semibold text-stone-700 dark:text-stone-300 px-1.5 py-0.5 rounded-md bg-stone-200/80 dark:bg-stone-800 border border-stone-300/60 dark:border-stone-700">
                          ~{localAiState.downloadingModel?.sizeMB || 90} MB
                        </span>
                      </div>
                      <p className="text-[9.5px] text-stone-600 dark:text-stone-300 truncate mt-0.5 font-medium">
                        {localAiState.downloadFile ? `Fetching file: ${localAiState.downloadFile}` : 'Streaming quantized neural weights to browser cache...'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                      {localAiState.downloadProgress}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsDownloadCollapsed(true)}
                      className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
                      title="Minimize download view"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Real Progress Bar with loading animation & glow */}
                <div className="w-full bg-stone-200/90 dark:bg-stone-800/90 rounded-full h-2 overflow-hidden shadow-inner relative border border-stone-300/40 dark:border-stone-700/50">
                  <div
                    className="bg-linear-to-r from-amber-500 via-[#FF4D6D] to-[#9333EA] h-2 rounded-full transition-all duration-300 ease-out relative shadow-[0_0_12px_rgba(255,77,109,0.5)]"
                    style={{ width: `${Math.min(100, Math.max(localAiState.downloadProgress, 4))}%` }}
                  >
                    <span className="absolute inset-0 bg-white/25 animate-pulse" />
                  </div>
                </div>

                {/* Always-On Status Notice: Chat continues without blocking */}
                <div className="flex items-center justify-between text-[9.5px] text-stone-600 dark:text-stone-300 mt-2 font-medium pt-1 border-t border-amber-300/30 dark:border-amber-700/30">
                  <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block shrink-0" />
                    <span>Instant offline chat active — ask anything freely while downloading!</span>
                  </span>
                  <span className="font-mono text-stone-500 dark:text-stone-400 font-semibold shrink-0">
                    {localAiState.downloadProgress}% of 100%
                  </span>
                </div>
              </div>
            )
          )}

          {/* Phase 10: Active Tour HUD Banner */}
          {activeTour && activeTour.isActive && (
            <div className="px-3.5 py-2 bg-gradient-to-r from-[#FF4D6D]/15 via-[#FF758F]/10 to-[#FF4D6D]/20 border-b border-[#FF4D6D]/30 flex items-center justify-between gap-2 text-xs backdrop-blur-md shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 rounded-full bg-[#FF4D6D] animate-ping shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-stone-900 dark:text-white truncate text-[11.5px]">
                      {activeTour.tourTitle || 'Active Guided Tour'}
                    </span>
                    <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded-full bg-[#FF4D6D]/20 text-[#FF4D6D] font-bold">
                      {activeTour.currentStepIndex + 1}/{activeTour.totalSteps}
                    </span>
                  </div>
                  {activeTour.currentStep?.headline && (
                    <p className="text-[10px] text-stone-600 dark:text-stone-300 truncate">
                      {activeTour.currentStep.headline}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  disabled={activeTour.currentStepIndex === 0}
                  onClick={() => handleExecuteAction({ type: 'prev-tour-step' })}
                  className="p-1 rounded-md text-stone-600 dark:text-stone-300 hover:bg-white/60 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Previous Step"
                  aria-label="Previous Tour Step"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleExecuteAction({ type: 'next-tour-step' })}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#FF4D6D] hover:bg-[#e03b5b] text-white flex items-center gap-0.5 shadow-xs"
                  title={activeTour.currentStepIndex === activeTour.totalSteps - 1 ? 'Finish Tour' : 'Next Step'}
                >
                  <span>{activeTour.currentStepIndex === activeTour.totalSteps - 1 ? 'Finish' : 'Next'}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleExecuteAction({ type: 'end-tour' })}
                  className="p-1 rounded-md text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-white/60 dark:hover:bg-stone-800"
                  title="End Tour"
                  aria-label="End Tour"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Phase 11: Active Voice Visualizer Waveform HUD */}
          {(speakingMsgId !== null || voiceEngineState === VOICE_STATES.SPEAKING || voiceEngineState === VOICE_STATES.PAUSED) && (
            <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-emerald-500/15 border-b border-emerald-500/30 flex items-center justify-between gap-2 backdrop-blur-md shrink-0">
              <VoiceVisualizerWaveform
                state={voiceEngineState}
                onStop={() => {
                  stopSpeaking();
                  setSpeakingMsgId(null);
                }}
                onPauseResume={() => {
                  if (voiceEngineState === VOICE_STATES.SPEAKING) pauseSpeech();
                  else if (voiceEngineState === VOICE_STATES.PAUSED) resumeSpeech();
                }}
                label={voiceEngineState === VOICE_STATES.PAUSED ? 'Speech Paused' : 'Voice Assistant Speaking...'}
              />
            </div>
          )}

          {/* 2. Messages Scroll Container */}
          <div
            tabIndex={0}
            role="log"
            aria-label="Conversation history"
            aria-live="polite"
            aria-relevant="additions text"
            onPointerDown={() => {
              if (inputValue.startsWith('/')) setInputValue('');
            }}
            className="flex-1 min-h-0 p-3 pb-5 overflow-y-auto space-y-3 overscroll-contain focus-visible:outline-hidden"
          >
            {messages.map((msg, idx) => {
              const isAssistant = msg.role === 'assistant' || msg.sender === 'assistant';
              const messageRoleLabel = (msg.role === 'assistant' || msg.sender === 'assistant') ? 'Assistant' : 'You';
              const formattedTime = formatTime(msg.timestamp);
              const messageAriaLabel = `Message from ${messageRoleLabel} at ${formattedTime}`;

              return (
                <div
                  key={msg.id}
                  role="article"
                  aria-label={messageAriaLabel}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`flex items-start gap-1.5 ${
                      isAssistant && Array.isArray(msg.actions) && msg.actions.length > 0
                        ? 'w-full max-w-[96%]'
                        : 'max-w-[90%]'
                    } ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    {isAssistant && (
                      <div className="w-5 h-5 rounded-full bg-linear-to-tr from-[#FF4D6D] to-[#9333EA] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <BotMessageSquare className="w-3 h-3" />
                      </div>
                    )}
                    <div
                      role="article"
                      aria-label={messageAriaLabel}
                      className={`px-3.5 py-2.5 text-xs leading-relaxed shadow-xs transition-all duration-200 ${
                        isAssistant && Array.isArray(msg.actions) && msg.actions.length > 0
                          ? 'w-full'
                          : ''
                      } ${
                        isAssistant
                          ? 'bg-white/90 dark:bg-[#1A1326]/90 text-stone-800 dark:text-stone-100 border border-stone-200/70 dark:border-stone-800/80 rounded-2xl rounded-tl-xs backdrop-blur-sm'
                          : 'bg-linear-to-tr from-[#FF4D6D] to-[#FF758F] text-white rounded-2xl rounded-tr-xs shadow-sm font-normal'
                      }`}
                    >
                      <FormattedMessage
                        text={!emojiEnabled ? tuneResponseEmojis(msg.text, audience, { enabled: false }) : msg.text}
                        isUser={!isAssistant}
                      />
                      {isStreaming && isAssistant && idx === messages.length - 1 && (
                        <span className="inline-block w-1.5 h-3.5 ml-1 bg-[#FF4D6D] animate-pulse align-middle rounded-xs" aria-hidden="true" />
                      )}

                      {/* 3-Row Preferences Summary Card */}
                      {isAssistant && msg.summaryCard && (
                        <div className="my-2.5 p-2.5 rounded-xl bg-stone-50/90 dark:bg-[#181124]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-2xs space-y-1.5 w-full">
                          <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1 flex items-center justify-between">
                            <span>⚙️ Current Preferences / वर्तमान प्राथमिकताएं</span>
                          </div>
                          <div className="flex items-center justify-between gap-2 py-1 px-2 rounded-lg bg-white/70 dark:bg-[#201730]/70 border border-stone-200/50 dark:border-stone-800">
                            <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 shrink-0">👥 Audience</span>
                            <span className="text-[11px] font-semibold text-stone-800 dark:text-stone-100 truncate text-right">{msg.summaryCard.audience}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2 py-1 px-2 rounded-lg bg-white/70 dark:bg-[#201730]/70 border border-stone-200/50 dark:border-stone-800">
                            <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 shrink-0">💼 Job Role</span>
                            <span className="text-[11px] font-semibold text-stone-800 dark:text-stone-100 truncate text-right">{msg.summaryCard.role}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2 py-1 px-2 rounded-lg bg-white/70 dark:bg-[#201730]/70 border border-stone-200/50 dark:border-stone-800">
                            <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 shrink-0">⚡ View Mode</span>
                            <span className="text-[11px] font-semibold text-stone-800 dark:text-stone-100 truncate text-right">{msg.summaryCard.viewMode}</span>
                          </div>
                          {msg.summaryCard.aiConsent && (
                            <div className="flex items-center justify-between gap-2 py-1 px-2 rounded-lg bg-white/70 dark:bg-[#201730]/70 border border-stone-200/50 dark:border-stone-800">
                              <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 shrink-0">🤖 On-Device AI</span>
                              <span className="text-[11px] font-semibold text-[#FF4D6D] dark:text-[#FF758F] truncate text-right">{msg.summaryCard.aiConsent}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* In-Bubble Decision Tree Context Hint (Buttons moved to bottom Suggestion Bar) */}
                      {isAssistant && msg.decisionTree && !skippedDecisionTreeMsgIds.has(msg.id) && msg.decisionTree.title && (
                        <div className="mt-2 pt-1.5 border-t border-stone-200/50 dark:border-stone-700/50 flex items-center justify-between text-[11px] font-medium text-stone-500 dark:text-stone-400">
                          <span className="italic">{msg.decisionTree.title}</span>
                          <span className="text-[10px] font-mono opacity-80">👇 Choose below</span>
                        </div>
                      )}

                      {/* Phase 10: In-Chat Action Card */}
                      {isAssistant && (msg.card || (Array.isArray(msg.actions) && msg.actions.some(a => a.type === 'start-tour'))) && (
                        <ChatActionCard
                          card={msg.card || (msg.actions.some(a => a.type === 'start-tour') ? { type: 'tour-controller', tourId: msg.actions.find(a => a.type === 'start-tour')?.tourId } : null)}
                          onExecuteAction={handleExecuteAction}
                          activeTourState={activeTour}
                        />
                      )}

                      {/* Direct Interactive Action Buttons */}
                      {isAssistant && Array.isArray(msg.actions) && msg.actions.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-stone-200/60 dark:border-stone-700/60 grid grid-cols-2 gap-1.5 w-full">
                          {msg.actions.map((act, idx) => {
                            const isFullWidth =
                              msg.actions.length === 1 ||
                              (idx === msg.actions.length - 1 && msg.actions.length % 2 === 1);
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleExecuteAction(act)}
                                className={`w-full min-h-[38px] px-2 py-1.5 rounded-xl text-[11px] font-sans font-medium flex items-center justify-center text-center gap-1.5 transition-all duration-200 cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden ${
                                  isFullWidth ? 'col-span-2' : 'col-span-1'
                                } bg-white/80 dark:bg-[#1E162B]/80 backdrop-blur-md border border-[#FF4D6D]/30 dark:border-[#FF4D6D]/35 text-stone-800 dark:text-stone-100 hover:text-[#FF4D6D] dark:hover:text-[#FF758F] hover:bg-[#FF4D6D]/10 dark:hover:bg-[#FF4D6D]/20 hover:border-[#FF4D6D] shadow-xs hover:shadow-[0_0_10px_rgba(255,77,109,0.2)]`}
                              >
                                {act.type === 'open-case-study' || act.type === 'case-study' ? (
                                  <FileText className="w-3.5 h-3.5 shrink-0 text-[#FF4D6D] dark:text-[#FF758F]" />
                                ) : act.type === 'switch-contact-tab' || act.type === 'quote-tab' || act.type === 'open-estimator' || act.type === 'open-quote' ? (
                                  <Briefcase className="w-3.5 h-3.5 shrink-0 text-[#FF4D6D] dark:text-[#FF758F]" />
                                ) : act.type === 'download-resume' ? (
                                  <FileText className="w-3.5 h-3.5 shrink-0 text-[#FF4D6D] dark:text-[#FF758F]" />
                                ) : act.type === 'scroll' ? (
                                  <ArrowRight className="w-3.5 h-3.5 shrink-0 text-[#FF4D6D] dark:text-[#FF758F]" />
                                ) : act.type === 'link' ? (
                                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#FF4D6D] dark:text-[#FF758F]" />
                                ) : act.type === 'start-tour' || act.type === 'next-tour-step' || act.type === 'prev-tour-step' || act.type === 'end-tour' ? (
                                  <Compass className="w-3.5 h-3.5 shrink-0 text-[#FF4D6D] dark:text-[#FF758F]" />
                                ) : (
                                  <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#FF4D6D] dark:text-[#FF758F]" />
                                )}
                                <span className="text-center font-medium leading-tight line-clamp-2 break-words">{act.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Unified Single-Row Micro-Toolbar */}
                  {isAssistant ? (
                    <div className="flex items-center justify-between w-full mt-1.5 px-1 pl-6.5 text-[10px] text-stone-400 select-none">
                      {/* Left Sub-Group: Dynamic Model Pill + Monospace Timestamp */}
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded font-mono text-[9px] font-semibold border transition-all ${
                            (msg.modelShortcut || '[Portfolio-Engine]').includes('SmolLM') ||
                            (msg.modelShortcut || '[Portfolio-Engine]').includes('Qwen')
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                              : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25'
                          }`}
                          title={`Inference Engine: ${msg.modelShortcut || '[Portfolio-Engine]'}`}
                        >
                          {(msg.modelShortcut || '[Portfolio-Engine]').includes('SmolLM') ||
                          (msg.modelShortcut || '[Portfolio-Engine]').includes('Qwen')
                            ? '⚡'
                            : '📚'}
                          <span>{msg.modelShortcut || '[Portfolio-Engine]'}</span>
                        </span>

                        <span className="font-mono text-[9px] text-stone-400 dark:text-stone-500">
                          {formattedTime}
                        </span>
                      </div>

                      {/* Right Sub-Group: Micro-Action Buttons (Copy, TTS, Feedback) */}
                      <div className="flex items-center gap-0.5 opacity-80 hover:opacity-100 transition-opacity">
                        {/* Copy Message Button */}
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          aria-label="Copy message text"
                          title="Copy text"
                          className="p-1 rounded hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer active:scale-95 focus-visible:ring-1 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
                        >
                          {copiedMsgId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>

                        {/* Speech TTS Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleSpeech(msg.id, msg.text)}
                          aria-label={speakingMsgId === msg.id ? "Stop reading" : "Read aloud"}
                          title={speakingMsgId === msg.id ? "Stop TTS" : "Read Aloud (TTS)"}
                          className="p-1 rounded hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer active:scale-95 focus-visible:ring-1 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
                        >
                          {speakingMsgId === msg.id ? (
                            <VolumeX className="w-3 h-3 text-[#FF4D6D] animate-pulse" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                        </button>

                        {/* Thumbs Up Rating */}
                        <button
                          type="button"
                          onClick={() => handleRateMessage(msg.id, 'up')}
                          aria-label="Rate response helpful"
                          title="Helpful"
                          className={`p-1 rounded transition-colors cursor-pointer active:scale-95 focus-visible:ring-1 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden ${
                            msg.feedback === 'up'
                              ? 'text-emerald-500 bg-emerald-500/15'
                              : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>

                        {/* Thumbs Down Rating */}
                        <button
                          type="button"
                          onClick={() => handleRateMessage(msg.id, 'down')}
                          aria-label="Rate response unhelpful"
                          title="Unhelpful"
                          className={`p-1 rounded transition-colors cursor-pointer active:scale-95 focus-visible:ring-1 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden ${
                            msg.feedback === 'down'
                              ? 'text-rose-500 bg-rose-500/15'
                              : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800'
                          }`}
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* User Message Timestamp */
                    <div className="mt-1 px-1 text-right">
                      <span className="font-mono text-[9px] text-stone-400 dark:text-stone-500">
                        {formattedTime}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && !isStreaming && (
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-linear-to-tr from-[#FF4D6D] to-[#9333EA] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <BotMessageSquare className="w-3 h-3" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-[#1F172E] border border-[#E7E2D8] dark:border-[#2D2340] rounded-2xl rounded-tl-xs shadow-2xs">
                    <span className={`w-1.5 h-1.5 rounded-full bg-[#FF4D6D] ${prefersReducedMotion ? 'animate-pulse' : 'animate-bounce [animation-delay:-0.3s]'}`} />
                    <span className={`w-1.5 h-1.5 rounded-full bg-[#9333EA] ${prefersReducedMotion ? 'animate-pulse' : 'animate-bounce [animation-delay:-0.15s]'}`} />
                    <span className={`w-1.5 h-1.5 rounded-full bg-[#6366F1] ${prefersReducedMotion ? 'animate-pulse' : 'animate-bounce'}`} />
                    <span className="text-[10px] font-mono text-stone-400 dark:text-stone-400 ml-1">
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 3. Suggestion Chips Drawer (Fixed Single-Row Carousel + Category Filtering) */}
          {chatSettings?.suggestionChipsEnabled !== false && (
            <SuggestionChipsDrawer
              chips={currentChips}
              onSelectChip={(chip) => {
                soundFX.triggerHaptic(20);

                // 1. Handle Decision Tree Skip
                if (chip.isSkip) {
                  if (chip.decisionStep === 'audience') {
                    handleAudienceDecisionSkip(chip.isSequential);
                  } else if (chip.decisionStep === 'role') {
                    handleRoleDecisionSkip(chip.isSequential);
                  } else if (chip.decisionStep === 'viewMode') {
                    handleViewModeDecisionSkip(chip.isSequential);
                  } else if (chip.messageId) {
                    setSkippedDecisionTreeMsgIds((prev) => new Set([...prev, chip.messageId]));
                    inputRef.current?.focus();
                  }
                  return;
                }

                // 2. Handle Decision Tree Options
                if (
                  chip.decisionStep === 'preferences_prompt' ||
                  chip.action === 'customize_yes' ||
                  chip.action === 'customize_no'
                ) {
                  handlePreferencesPromptSelect(chip.id, chip.label);
                  return;
                }

                if (chip.isAiConsent) {
                  handleAiModelConsentSelect(chip.consent, chip.label);
                  return;
                }

                if (chip.audience) {
                  handleAudienceDecisionSelect(chip.audience, chip.label, chip.isSequential);
                  return;
                }

                if (chip.role) {
                  handleRoleDecisionSelect(chip.role, chip.label, chip.isSequential);
                  return;
                }

                if (chip.viewMode) {
                  handleViewModeDecisionSelect(chip.viewMode, chip.label, chip.isSequential);
                  return;
                }

                if (chip.decisionStep === 'model_activation') {
                  handleModelActivationSelect(chip);
                  return;
                }

                if (chip.decisionStep === 'ai_model_switch') {
                  handleAiModelSwitchSelect(chip);
                  return;
                }

                // 3. Standard prompt chips send query
                handleSendMessage(chip.query || chip.label);
              }}
              isTyping={isTyping || isStreaming}
            />
          )}

          {/* Voice Waveform Visualizer HUD Banner (Phase 11) */}
          {voiceEngineState !== VOICE_STATES.IDLE && (
            <div className="px-2.5 py-1.5 border-t border-[#E7E2D8]/80 dark:border-[#2D2340]/80 bg-white/90 dark:bg-[#120D1D]/90 z-20">
              <VoiceVisualizerWaveform
                state={voiceEngineState}
                onStop={() => {
                  stopSpeaking();
                  setSpeakingMsgId(null);
                }}
                onPauseResume={() => {
                  if (voiceEngineState === VOICE_STATES.PAUSED) {
                    resumeSpeech();
                  } else {
                    pauseSpeech();
                  }
                }}
              />
            </div>
          )}

          {/* Polished Input Bar & Symmetrical Action Cluster */}
          <div className="relative p-2.5 border-t border-[#E7E2D8]/80 dark:border-[#2D2340]/80 bg-white/90 dark:bg-[#120D1D]/90 flex items-center gap-1.5 shrink-0 transition-all focus-within:ring-1 focus-within:ring-[#FF4D6D]/30">
            {chatSettings?.slashCommandsEnabled !== false && inputValue.startsWith('/') && (
              <SlashCommandPalette
                commands={filteredSlashCommands}
                activeCommandIndex={activeSlashIndex}
                onSelectCommand={executeSlashCommand}
                onHoverIndex={setActiveSlashIndex}
                searchQuery={inputValue.slice(1)}
                onClose={() => setInputValue('')}
              />
            )}

            {/* Main Text Input */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping || isStreaming}
              placeholder="Ask about Atul's work, skills or type '/'..."
              aria-label="Ask Atul AI Assistant"
              className="flex-1 bg-stone-100 dark:bg-[#1F172E] text-stone-900 dark:text-white placeholder-stone-400 text-xs rounded-xl px-3 py-2 border border-transparent focus:border-[#FF4D6D]/60 focus:bg-white dark:focus:bg-[#181224] focus:outline-hidden transition-all min-h-[44px]"
            />

            {/* Sparkles Prompt Studio Trigger */}
            <button
              type="button"
              onClick={handleOpenPromptStudio}
              aria-label="Meta-Prompt Studio (/engineer)"
              title="Prompt Studio (/engineer)"
              className="min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px] rounded-xl flex items-center justify-center transition-all cursor-pointer bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-300/40 dark:border-purple-800/50 active:scale-95 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-hidden shrink-0"
            >
              <Sparkles className="w-4 h-4 text-purple-500" />
            </button>

            {/* Voice Microphone Input */}
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              aria-label={isListening ? "Stop voice input" : "Start voice input"}
              aria-pressed={isListening}
              title={isListening ? "Listening... Click to stop" : "Voice Input (Speech to Text)"}
              className={`min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px] rounded-xl flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden shrink-0 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-stone-100 dark:bg-[#1F172E] text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send or Stop Generation Button */}
            {isStreaming ? (
              <button
                type="button"
                onClick={handleStopGenerating}
                aria-label="Stop generating response"
                className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center bg-rose-500 hover:bg-rose-600 active:scale-95 text-white transition-all shadow-2xs cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-hidden shrink-0"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                disabled={!inputValue.trim() || isTyping}
                onClick={() => handleSendMessage()}
                aria-label="Send message"
                className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center bg-linear-to-tr from-[#FF4D6D] to-[#9333EA] text-white hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default React.memo(AIChatWidget);
