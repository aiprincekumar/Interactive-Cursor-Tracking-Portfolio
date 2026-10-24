/* oxlint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Download
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { useLab } from '../context/LabContext';
import { useRole } from '../context/RoleContext';
import { useAudience } from '../context/AudienceContext';
import { useViewMode, VIEW_MODES } from '../context/ViewModeContext';
import { useAnnounce } from '../context/AnnouncerContext';
import {
  queryAssistant,
  getInitialSuggestions,
  clearSessionMemory,
  cleanMarkdownAsterisks,
  tuneResponseEmojis,
  getOnboardingDecisionTree,
  CHAT_SLASH_COMMANDS
} from '../utils/portfolioAssistantEngine.js';

/**
 * Strips markdown symbols, URLs, and emojis for clean speech synthesis read-aloud
 */
export function cleanTextForSpeech(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\x60\x60\x60[\s\S]*?\x60\x60\x60/g, ' ')
    .replace(/\x60([^\x60]+)\x60/g, '$1')
    .replace(/[*#_~\x60>]/g, ' ')
    .replace(/[•●▪■◆★☆✓✔✕✖]/g, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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
 * Session storage key and module memory cache for session-scoped persistence
 */
const SESSION_STORAGE_KEY = 'portfolio_ai_chat_session';
let inMemoryMessagesCache = null;

/**
 * Verified default suggested prompt chips (10 rich compact suggestions in 2-row grid)
 */
const PROMPT_CHIPS = [
  { id: 'projects', label: '🚀 Projects', query: 'Tell me about your featured projects' },
  { id: 'tech', label: '⚡ Tech Stack', query: 'What is your core tech stack and skills?' },
  { id: 'experience', label: '💼 Experience', query: 'Summarize your professional experience' },
  { id: 'pricing', label: '💰 Pricing', query: 'Estimate quotation and service fees' },
  { id: 'resume', label: '📄 Resume', query: 'Download verified professional resume' },
  { id: 'gst', label: '📊 GST & Tax', query: 'Tell me about GST, ITR, and accounting practice' },
  { id: 'itc', label: '📑 ITC & GSTR-2B', query: 'Explain GST ITC matching and GSTR-2B reconciliation' },
  { id: 'tally', label: '📈 Tally Prime & BRS', query: 'Tell me about Tally Prime and bank reconciliation' },
  { id: 'audit', label: '🔍 Audit & Ledgers', query: 'Tell me about balance sheet audit and financial controls' },
  { id: 'powerbi', label: '📉 Power BI', query: 'Tell me about Power BI and Excel automation' },
  { id: 'ai', label: '🤖 AI & SaaS', query: 'Tell me about AI prompt-to-SaaS and multi-agent workflows' },
  { id: 'contact', label: '📬 Contact', query: 'How can I get in touch or hire you?' }
];

/**
 * Standard welcome message template with verified preview greeting string
 */
const DEFAULT_WELCOME_MESSAGE = {
  id: 'welcome',
  sender: 'assistant',
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

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState(null); // { x: number, y: number } | null
  const [dimensions, setDimensions] = useState(null); // { width: number, height: number } | null
  const [preMaximizeState, setPreMaximizeState] = useState(null);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [emojiEnabled, setEmojiEnabled] = useState(true);
  const [inlineSpecifyMsgId, setInlineSpecifyMsgId] = useState(null);
  const [inlineSpecifyText, setInlineSpecifyText] = useState('');
  const [skippedDecisionTreeMsgIds, setSkippedDecisionTreeMsgIds] = useState(new Set());
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const [focusedChipIndex, setFocusedChipIndex] = useState(0);

  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [activeSlashIndex, setActiveSlashIndex] = useState(0);

  const availableVoicesRef = useRef([]);
  const recognitionRef = useRef(null);

  // Pre-load and synchronize SpeechSynthesis voices for Chromium / Windows
  useEffect(() => {
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
  }, []);

  // Global Keyboard Shortcuts (Ctrl+K, Alt+C to toggle; Escape to minimize)
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

      // Escape key minimizes/closes chat from anywhere in the window
      if (e.key === 'Escape') {
        if (isOpen && !isMinimized) {
          e.preventDefault();
          setIsMinimized(true);
        } else if (isOpen && isMinimized) {
          e.preventDefault();
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
   * Resilient Read-Aloud / TTS implementation solving Chromium audio freeze & empty voice bugs
   */
  const handleToggleSpeech = (msgId, text) => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speakingMsgId === msgId) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
      setSpeakingMsgId(null);
      return;
    }

    try {
      // 1. Cancel previous utterances
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);

      // 2. Clean markdown symbols, links & emojis
      const cleanText = cleanTextForSpeech(text);
      if (!cleanText) {
        console.warn('Read aloud aborted: text is empty after cleaning');
        return;
      }

      // 3. Chromium bug: resume speech synthesis before speak() if paused
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch {}

      // 4. Create and configure Utterance
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.volume = 1;
      utterance.rate = 1;
      utterance.pitch = 1;

      // 5. Select natural/system English voice or fallback
      let voices = availableVoicesRef.current;
      if (!voices || voices.length === 0) {
        voices = window.speechSynthesis.getVoices() || [];
        availableVoicesRef.current = voices;
      }

      if (voices && voices.length > 0) {
        const preferredVoice =
          voices.find((v) => (v.lang === 'en-IN' || v.lang === 'en_IN') && !v.name.includes('Google') === false) ||
          voices.find((v) => v.lang === 'en-IN' || v.lang === 'en_IN') ||
          voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Online'))) ||
          voices.find((v) => v.lang.startsWith('en')) ||
          voices.find((v) => v.default) ||
          voices[0];

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      utterance.onstart = () => {
        setSpeakingMsgId(msgId);
      };

      utterance.onend = () => {
        setSpeakingMsgId(null);
      };

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('SpeechSynthesisUtterance error:', e.error);
        }
        setSpeakingMsgId(null);
      };

      setSpeakingMsgId(msgId);
      window.speechSynthesis.speak(utterance);

      // 6. Secondary resume to ensure audio context playback on Chromium/Windows
      setTimeout(() => {
        try {
          if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        } catch {}
      }, 50);
    } catch (err) {
      console.warn('Speech synthesis execution failed:', err);
      setSpeakingMsgId(null);
    }
  };

  /**
   * Voice Input (Speech to Text): Transcribes into inputText WITHOUT auto-sending!
   */
  const handleToggleVoiceInput = () => {
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
        announce('Voice listening active. Speak your question.', 'polite');
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
      };

      recognition.onend = () => {
        setIsListening(false);
        inputRef.current?.focus();
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
      setIsListening(false);
    }
  };

  const handleExportTranscript = () => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    const transcriptData = JSON.stringify(messages, null, 2);
    const blob = new Blob([transcriptData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atul-verma-chat-transcript-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    announce('Chat transcript exported successfully as JSON', 'polite');
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
    } else if (cmdStr === '/transcript') {
      handleExportTranscript();
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

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const chipRefs = useRef([]);
  const lastFocusedElementRef = useRef(null);
  const chipsScrollRef = useRef(null);
  const widgetRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDraggingChips, setIsDraggingChips] = useState(false);
  const dragStartRef = useRef({ x: 0, scrollLeft: 0, hasMoved: false });

  // Drag & drop window repositioning refs & states
  const [isDraggingWindow, setIsDraggingWindow] = useState(false);
  const windowDragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });

  // Resizing state
  const [isResizing, setIsResizing] = useState(null); // 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null
  const resizeStartRef = useRef({ mouseX: 0, mouseY: 0, width: 0, height: 0, posX: 0, posY: 0 });

  const updateScrollBoundaries = useCallback(() => {
    const el = chipsScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  const handleScrollChips = (direction) => {
    const el = chipsScrollRef.current;
    if (!el) return;
    const delta = direction === 'left' ? -180 : 180;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const handleChipsMouseDown = (e) => {
    const el = chipsScrollRef.current;
    if (!el) return;
    setIsDraggingChips(true);
    dragStartRef.current = {
      x: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
      hasMoved: false
    };
  };

  const handleChipsMouseMove = (e) => {
    if (!isDraggingChips) return;
    const el = chipsScrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragStartRef.current.x) * 1.5;
    if (Math.abs(x - dragStartRef.current.x) > 5) {
      dragStartRef.current.hasMoved = true;
    }
    el.scrollLeft = dragStartRef.current.scrollLeft - walk;
    updateScrollBoundaries();
  };

  const handleChipsMouseUp = () => {
    setIsDraggingChips(false);
    updateScrollBoundaries();
  };

  const handleChipsMouseLeave = () => {
    setIsDraggingChips(false);
    updateScrollBoundaries();
  };

  // Safe access to Lab Context for drawer offset and sound settings
  let labContext = null;
  try {
    labContext = useLab();
  } catch {
    // safe fallback
  }
  const soundEnabled = labContext?.soundEnabled ?? true;
  const isDrawerOpen = labContext?.isDrawerOpen ?? false;

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
  const announce = announcerContext?.announce || ((msg, p) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('portfolio:announce', { detail: { message: msg, priority: p || 'polite' } })
      );
    }
  });

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

  // Current active suggestion chips derived from latest assistant message or defaults
  const currentChips = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === 'assistant' && Array.isArray(messages[i].chips) && messages[i].chips.length > 0) {
        return messages[i].chips;
      }
    }
    return PROMPT_CHIPS;
  })();

  // Scroll to bottom of message list smoothly (respects prefers-reduced-motion)
  const scrollToBottom = useCallback(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    messagesEndRef.current?.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen, isMinimized, scrollToBottom]);

  // Decoupled window event listener: 'portfolio:open-ai-chat'
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOpenChat = () => {
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
      if (!shouldMinimize) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 150);
      }
    };

    window.addEventListener('portfolio:open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('portfolio:open-ai-chat', handleOpenChat);
  }, [soundEnabled, isDrawerOpen]);

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
    if (typeof window === 'undefined') return;

    if (isDrawerOpen && window.innerWidth < 960) {
      setIsMinimized(true);
    }
  }, [isDrawerOpen]);

  // Window resize handler: auto-minimize if resized below 960px while drawer is open
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      if (isDrawerOpen && window.innerWidth < 960) {
        setIsMinimized(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDrawerOpen]);

  // Clean up any pending typing timeouts
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Handle Close with focus return
  const handleClose = (e) => {
    e?.stopPropagation?.();
    if (soundEnabled && soundFX?.playTap) {
      soundFX.playTap();
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsTyping(false);
    setIsOpen(false);
    if (lastFocusedElementRef.current && typeof lastFocusedElementRef.current.focus === 'function') {
      setTimeout(() => {
        lastFocusedElementRef.current?.focus();
      }, 50);
    }
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
    } else if (type === 'export-transcript') {
      handleExportTranscript();
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

  const handleClearChat = () => {
    if (soundEnabled && soundFX?.playTap) soundFX.playTap();
    try {
      if (typeof clearSessionMemory === 'function') {
        clearSessionMemory();
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
    setMessages(resetMessages);
    setInputValue('');
    setIsTyping(false);
    announce('Chat conversation reset to initial welcome message', 'polite');
    setLiveAnnouncement('Chat conversation reset to initial welcome message');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Handle message submission
  const handleSendMessage = (textToSend) => {
    const trimmed = (textToSend || inputValue).trim();
    if (!trimmed || isTyping) return;

    if (soundEnabled && soundFX?.playTap) {
      soundFX.playTap();
    }

    const newMsg = {
      id: `user-${Date.now()}`,
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

    // 400ms simulated natural AI thinking delay
    typingTimeoutRef.current = setTimeout(() => {
      try {
        let response = null;
        let botReplyText = '';
        let botChips = null;
        let botActions = null;
        try {
          if (typeof queryAssistant === 'function') {
            response = queryAssistant(trimmed, { role: activeRole, audience });
            if (response) {
              botReplyText = response.text || '';
              botChips = response.chips || null;
              botActions = response.actions || null;
            }
          }
        } catch (err) {
          console.warn('queryAssistant exception:', err);
        }

        if (!botReplyText) {
          botReplyText = generateBotReply(trimmed);
          botChips = PROMPT_CHIPS;
        }

        const assistantMessage = {
          id: (response && response.id) || `assistant-${Date.now()}`,
          sender: 'assistant',
          text: (response && response.text) || botReplyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          chips: (response && response.chips) || botChips || PROMPT_CHIPS,
          actions: (response && response.actions) || botActions || [],
          decisionTree: (response && response.decisionTree) || null
        };

        setMessages((prev) => [...prev, assistantMessage]);
        const cleanForA11y = (str) =>
          typeof str === 'string'
            ? str.replace(/[*#_~•`]/g, ' ').replace(/\s+/g, ' ').trim()
            : '';
        setLiveAnnouncement(cleanForA11y(botReplyText));
        announce(botReplyText, 'polite');

        if (soundEnabled && soundFX?.playFocusBeep) {
          soundFX.playFocusBeep();
        }
      } finally {
        setIsTyping(false);
      }
    }, 400);
  };

  // Handle keyboard submission, slash autocomplete navigation & Escape minimization
  const handleKeyDown = (e) => {
    if (inputValue.startsWith('/') && filteredSlashCommands.length > 0) {
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
      setIsMinimized(true);
    }
  };

  // Accessible roving tabindex navigation for suggestion chips
  const handleChipKeyDown = (e, index, total) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (index + 1) % total;
      setFocusedChipIndex(next);
      chipRefs.current[next]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (index - 1 + total) % total;
      setFocusedChipIndex(prev);
      chipRefs.current[prev]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      setFocusedChipIndex(0);
      chipRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      setFocusedChipIndex(total - 1);
      chipRefs.current[total - 1]?.focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    }
  };

  // Update suggestions scroll boundaries
  useEffect(() => {
    updateScrollBoundaries();
    const el = chipsScrollRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollBoundaries, { passive: true });
      return () => el.removeEventListener('scroll', updateScrollBoundaries);
    }
  }, [currentChips, updateScrollBoundaries]);

  if (!isOpen) return null;

  // Determine container positioning & sizing classes / inline styles
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  
  let containerStyle = {};
  // Specification reference: fixed bottom-0 z-[55] rounded-t-2xl rounded-b-none border-t border-x border-b-0
  let containerClasses = "fixed z-[45] select-none flex flex-col overflow-hidden bg-[#FAF8F5]/98 dark:bg-[#161122]/98 backdrop-blur-md shadow-2xl border border-[#E7E2D8] dark:border-[#2D2340]";

  if (isMobile) {
    containerClasses += " bottom-0 left-0 right-0 w-full rounded-t-2xl rounded-b-none border-x-0 border-b-0";
    containerStyle = {
      height: isMinimized ? '52px' : (dimensions?.height ? `${dimensions.height}px` : '480px')
    };
  } else if (isMaximized) {
    containerClasses += " rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200";
    containerStyle = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '92vw',
      maxWidth: '1200px',
      height: '90vh',
      zIndex: 45
    };
  } else if (position) {
    containerClasses += " rounded-2xl shadow-2xl transition-none";
    containerStyle = {
      position: 'fixed',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: `${dimensions?.width || 380}px`,
      height: isMinimized ? '52px' : `${dimensions?.height || 520}px`
    };
  } else {
    // Default docked bottom-right
    containerClasses += ` bottom-0 rounded-t-2xl rounded-b-none border-x border-t border-b-0 ${
      isDrawerOpen ? 'right-[540px]' : 'right-28'
    }`;
    containerStyle = {
      width: `${dimensions?.width || 380}px`,
      height: isMinimized ? '52px' : `${dimensions?.height || 520}px`
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
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 border-2 border-white dark:border-[#161122] bg-emerald-500" />
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold font-mono tracking-tight text-[#18181B] dark:text-white truncate">
                Atul AI Assistant
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shrink-0">
                AI
              </span>
            </div>
            {/* Single Compact Details Line: Role, Audience, View Mode */}
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="text-[9.5px] font-medium text-stone-700 dark:text-stone-300 truncate">
                💼 {roleData.shortLabel || roleData.label} • {activeAudienceData?.emoji || '👥'} {activeAudienceData?.shortLabel || 'All'} • {activeViewModeData?.emoji || '⚡'} {activeViewModeData?.shortLabel || 'Modern'}
              </span>
            </div>
          </div>
        </div>

        {/* Header Controls: Maximize/Restore, Minimize, Reset Position & Size, and Close (Strict >= 44px touch targets) */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleResetLayout(e);
            }}
            aria-label="Reset Position & Size (Dock to Bottom-Right)"
            title="Reset Position & Size (Dock to Bottom-Right)"
            className="min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-[#18181B] dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          {!isMobile && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleMaximize(e);
              }}
              aria-label={isMaximized ? 'Restore chat window' : 'Maximize chat window'}
              title={isMaximized ? 'Restore' : 'Maximize'}
              className="min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-[#18181B] dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleMinimize(e);
            }}
            aria-label={isMinimized ? 'Expand Chat' : 'Minimize Chat'}
            title={isMinimized ? 'Expand' : 'Minimize'}
            className="min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-[#18181B] dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
          >
            {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClose(e);
            }}
            aria-label="Close Chat"
            title="Close (Esc)"
            className="min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-[#FF4D6D] dark:hover:text-[#FF4D6D] hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
          >
            <X className="w-4 h-4" />
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
          {/* Dynamic Island Sub-Header: Clean Left-to-Right Action Strip */}
          <div className="px-3 py-1.5 bg-stone-100/80 dark:bg-[#150F22]/80 border-b border-[#E7E2D8]/60 dark:border-[#2D2340]/60 flex items-center justify-between gap-2 shrink-0">
            {/* Left Action Buttons: Audience, Role, View Mode */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleTriggerAudienceDecisionTree}
                aria-label="Select Audience Perspective"
                title="Select Audience Perspective"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-[#FF4D6D] hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleTriggerRoleDecisionTree}
                aria-label="Select Job Role Track"
                title="Select Job Role Track"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-emerald-500 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <Briefcase className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleTriggerViewModeDecisionTree}
                aria-label="Switch View Mode (Basic, Simple, Modern, Terminal)"
                title="Switch View Mode (Basic, Simple, Modern, Terminal)"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-cyan-500 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right Action Controls: Emoji Toggle & Reset */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setEmojiEnabled((prev) => !prev)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-medium flex items-center gap-1 border transition-colors cursor-pointer ${
                  emojiEnabled
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400'
                    : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-500'
                }`}
                title="Toggle Emojis (On/Off)"
              >
                😊 {emojiEnabled ? 'On' : 'Off'}
              </button>
              <button
                type="button"
                onClick={handleExportTranscript}
                aria-label="Download Chat Transcript"
                title="Download Chat Transcript (JSON)"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/60 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleClearChat}
                aria-label="Clear chat history"
                title="Clear chat history"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/60 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2. Messages Scroll Container */}
          <div
            tabIndex={0}
            role="region"
            aria-label="Conversation messages"
            className="flex-1 min-h-0 p-3 overflow-y-auto space-y-3 overscroll-contain focus-visible:outline-hidden"
          >
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
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
                      className={`px-3 py-2 text-xs leading-relaxed shadow-2xs whitespace-pre-line ${
                        isAssistant && Array.isArray(msg.actions) && msg.actions.length > 0
                          ? 'w-full'
                          : ''
                      } ${
                        isAssistant
                          ? 'bg-white dark:bg-[#1F172E] text-stone-800 dark:text-stone-100 border border-[#E7E2D8] dark:border-[#2D2340] rounded-2xl rounded-tl-xs'
                          : 'bg-linear-to-tr from-[#FF4D6D] to-[#FF758F] text-white rounded-2xl rounded-tr-xs'
                      }`}
                    >
                      {cleanMarkdownAsterisks(!emojiEnabled ? tuneResponseEmojis(msg.text, audience, { enabled: false }) : msg.text)}

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

                      {/* Decision Tree Rendering */}
                      {isAssistant && msg.decisionTree && !skippedDecisionTreeMsgIds.has(msg.id) && (() => {
                        const allOptions = msg.decisionTree.options || [];
                        const regularOptions = allOptions.filter((chip) => !chip.isSkip);
                        const skipOption = allOptions.find((chip) => chip.isSkip);

                        const handleSkipClick = () => {
                          if (msg.decisionTree.step === 'audience') {
                            handleAudienceDecisionSkip(msg.decisionTree.isSequential);
                          } else if (msg.decisionTree.step === 'role') {
                            handleRoleDecisionSkip(msg.decisionTree.isSequential);
                          } else if (msg.decisionTree.step === 'viewMode') {
                            handleViewModeDecisionSkip(msg.decisionTree.isSequential);
                          } else {
                            setSkippedDecisionTreeMsgIds((prev) => new Set([...prev, msg.id]));
                            inputRef.current?.focus();
                          }
                        };

                        return (
                          <div className="mt-2.5 pt-2 border-t border-stone-200/60 dark:border-stone-700/60 w-full flex flex-col gap-2">
                            {msg.decisionTree.title && (
                              <p className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                                {msg.decisionTree.title}
                              </p>
                            )}

                            {/* 1-Column Vertical Stack for Decision Options */}
                            <div className="flex flex-col gap-2 w-full">
                              {regularOptions.map((chip) => {
                                if (
                                  msg.decisionTree.step === 'preferences_prompt' ||
                                  chip.action === 'customize_yes' ||
                                  chip.action === 'customize_no'
                                ) {
                                  const isYes = chip.id === 'customize_yes' || chip.action === 'customize_yes';
                                  return (
                                    <button
                                      key={chip.id}
                                      type="button"
                                      onClick={() => handlePreferencesPromptSelect(chip.id, chip.label)}
                                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer text-left flex items-center justify-between shadow-2xs border ${
                                        isYes
                                          ? 'bg-linear-to-r from-[#FF4D6D] to-[#9333EA] text-white border-transparent hover:opacity-95'
                                          : 'bg-white dark:bg-[#1E162B] text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:border-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                                      }`}
                                    >
                                      <span>{chip.label}</span>
                                      <ArrowRight className="w-3.5 h-3.5 opacity-80 shrink-0" />
                                    </button>
                                  );
                                }

                                if (chip.isAiConsent) {
                                  const isYes = chip.consent === 'enabled';
                                  return (
                                    <button
                                      key={chip.id}
                                      type="button"
                                      onClick={() => handleAiModelConsentSelect(chip.consent, chip.label)}
                                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer text-left flex items-center justify-between shadow-2xs border ${
                                        isYes
                                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                                          : 'bg-white dark:bg-[#1E162B] text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:border-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                                      }`}
                                    >
                                      <span>{chip.label}</span>
                                      <Sparkles className="w-3.5 h-3.5 opacity-80 shrink-0" />
                                    </button>
                                  );
                                }

                                if (chip.isOther) {
                                  return (
                                    <button
                                      key={chip.id || 'other'}
                                      type="button"
                                      onClick={() => {
                                        setInlineSpecifyMsgId((prev) => (prev === msg.id ? null : msg.id));
                                      }}
                                      className={`w-full py-2 px-3 rounded-xl text-[11px] font-medium transition-colors cursor-pointer border text-left flex items-center justify-between ${
                                        inlineSpecifyMsgId === msg.id
                                          ? 'bg-blue-600 text-white border-blue-600'
                                          : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border-stone-300/80 dark:border-stone-700'
                                      }`}
                                    >
                                      <span>✏️ Other / Specify</span>
                                      <span className="text-[10px] opacity-75 font-mono">Custom Input</span>
                                    </button>
                                  );
                                }

                                if (chip.audience) {
                                  const isSelected = chip.audience === audience;
                                  return (
                                    <button
                                      key={chip.id}
                                      type="button"
                                      onClick={() => handleAudienceDecisionSelect(chip.audience, chip.label, msg.decisionTree?.isSequential)}
                                      className={`w-full py-2 px-3 rounded-xl text-[11px] font-medium transition-all cursor-pointer border text-left flex items-center justify-between ${
                                        isSelected
                                          ? 'bg-[#FF4D6D] text-white border-[#FF4D6D] shadow-xs font-semibold'
                                          : 'bg-white dark:bg-[#1E162B] text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:border-[#FF4D6D] hover:text-[#FF4D6D]'
                                      }`}
                                    >
                                      <span>{chip.label}</span>
                                      {isSelected && <span className="text-[10px] font-mono bg-white/20 px-1.5 py-0.5 rounded">Current</span>}
                                    </button>
                                  );
                                }

                                if (chip.role) {
                                  const isSelected = chip.role === activeRole;
                                  return (
                                    <button
                                      key={chip.id}
                                      type="button"
                                      onClick={() => handleRoleDecisionSelect(chip.role, chip.label, msg.decisionTree?.isSequential)}
                                      className={`w-full py-2 px-3 rounded-xl text-[11px] font-medium transition-all cursor-pointer border text-left flex items-center justify-between ${
                                        isSelected
                                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-semibold'
                                          : 'bg-white dark:bg-[#1E162B] text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:border-emerald-500 hover:text-emerald-500'
                                      }`}
                                    >
                                      <span>{chip.label}</span>
                                      {isSelected && <span className="text-[10px] font-mono bg-white/20 px-1.5 py-0.5 rounded">Current</span>}
                                    </button>
                                  );
                                }

                                if (chip.viewMode) {
                                  const isViewModeCurrent = chip.viewMode === viewMode;
                                  return (
                                    <button
                                      key={chip.id}
                                      type="button"
                                      onClick={() => handleViewModeDecisionSelect(chip.viewMode, chip.label, msg.decisionTree?.isSequential)}
                                      className={`w-full py-2 px-3 rounded-xl text-[11px] font-medium transition-all cursor-pointer border text-left flex items-center justify-between ${
                                        isViewModeCurrent
                                          ? 'bg-cyan-600 text-white border-cyan-500 shadow-xs ring-1 ring-cyan-400 font-semibold'
                                          : 'bg-white dark:bg-[#1E162B] text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:border-cyan-500 hover:text-cyan-500'
                                      }`}
                                    >
                                      <span>{chip.label}</span>
                                      {isViewModeCurrent && <span className="text-[10px] font-mono bg-white/20 px-1.5 py-0.5 rounded">Current</span>}
                                    </button>
                                  );
                                }

                                return (
                                  <button
                                    key={chip.id || chip.label}
                                    type="button"
                                    onClick={() => handleSendMessage(chip.query || chip.label)}
                                    className="w-full py-2 px-3 rounded-xl text-[11px] font-medium bg-white dark:bg-[#1E162B] text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 hover:border-[#FF4D6D] hover:text-[#FF4D6D] transition-all cursor-pointer text-left flex items-center justify-between"
                                  >
                                    <span>{chip.label}</span>
                                    <ArrowRight className="w-3 h-3 opacity-60 shrink-0" />
                                  </button>
                                );
                              })}
                            </div>

                            {/* Dedicated Full-Width Bottom Skip Button Container */}
                            {skipOption && (
                              <div className="pt-1.5 border-t border-stone-200/50 dark:border-stone-700/50 w-full">
                                <button
                                  key={skipOption.id || 'skip'}
                                  type="button"
                                  onClick={handleSkipClick}
                                  className="w-full py-2 px-3 rounded-xl text-[11px] font-medium bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 border border-stone-300/80 dark:border-stone-700 transition-colors cursor-pointer text-center flex items-center justify-center gap-1 shadow-2xs"
                                >
                                  <span>{skipOption.label || '⏩ Skip'}</span>
                                </button>
                              </div>
                            )}

                            {/* Inline Specify Text Form */}
                            {inlineSpecifyMsgId === msg.id && (
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (inlineSpecifyText.trim()) {
                                    handleSendMessage(inlineSpecifyText.trim());
                                    setInlineSpecifyText('');
                                    setInlineSpecifyMsgId(null);
                                  }
                                }}
                                className="mt-1 flex items-center gap-1.5 p-1.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-[#FF4D6D]/40 w-full"
                              >
                                <input
                                  type="text"
                                  value={inlineSpecifyText}
                                  onChange={(e) => setInlineSpecifyText(e.target.value)}
                                  placeholder="Type your query here..."
                                  className="flex-1 bg-transparent text-xs text-stone-800 dark:text-stone-100 placeholder-stone-400 px-2 py-1 outline-hidden"
                                  autoFocus
                                />
                                <button
                                  type="submit"
                                  className="px-2.5 py-1 bg-linear-to-r from-[#FF4D6D] to-[#9333EA] text-white rounded-lg text-xs font-medium flex items-center gap-1 shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
                                >
                                  <Send className="w-3 h-3" /> Send
                                </button>
                              </form>
                            )}
                          </div>
                        );
                      })()}

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
                                ) : act.type === 'switch-contact-tab' || act.type === 'quote-tab' || act.type === 'open-estimator' ? (
                                  <Briefcase className="w-3.5 h-3.5 shrink-0 text-[#FF4D6D] dark:text-[#FF758F]" />
                                ) : act.type === 'download-resume' ? (
                                  <FileText className="w-3.5 h-3.5 shrink-0 text-[#FF4D6D] dark:text-[#FF758F]" />
                                ) : act.type === 'scroll' ? (
                                  <ArrowRight className="w-3.5 h-3.5 shrink-0 text-[#FF4D6D] dark:text-[#FF758F]" />
                                ) : act.type === 'link' ? (
                                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#FF4D6D] dark:text-[#FF758F]" />
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
                  <div className={`flex items-center gap-2 mt-1 px-1 ${isAssistant ? 'ml-6.5' : ''}`}>
                    <span className="text-[9px] font-mono text-stone-400 dark:text-stone-500">
                      {msg.timestamp}
                    </span>
                    {isAssistant && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          aria-label="Copy message text"
                          title="Copy message"
                          className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
                        >
                          {copiedMsgId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleSpeech(msg.id, msg.text)}
                          aria-label={speakingMsgId === msg.id ? "Stop reading" : "Read aloud"}
                          title={speakingMsgId === msg.id ? "Stop TTS" : "Read Aloud (TTS)"}
                          className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
                        >
                          {speakingMsgId === msg.id ? <VolumeX className="w-3 h-3 text-[#FF4D6D] animate-pulse" /> : <Volume2 className="w-3 h-3" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-linear-to-tr from-[#FF4D6D] to-[#9333EA] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <BotMessageSquare className="w-3 h-3" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-[#1F172E] border border-[#E7E2D8] dark:border-[#2D2340] rounded-2xl rounded-tl-xs shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9333EA] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] animate-bounce" />
                    <span className="text-[10px] font-mono text-stone-400 dark:text-stone-400 ml-1">
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 3. Suggested Prompt Chips with Visible Arrow Keys & Hold-and-Drag */}
          <div className="px-2.5 py-1.5 border-t border-[#E7E2D8]/60 dark:border-[#2D2340]/60 bg-stone-50/70 dark:bg-[#120D1D]/60 shrink-0 select-none">
            <span className="text-[9px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1 px-1 block">
              Quick Suggestions
            </span>
            <div className="relative flex items-center w-full">
              {/* Visible Left Arrow Button */}
              <button
                type="button"
                onClick={() => handleScrollChips('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll suggestions left"
                className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 z-10 mr-1 cursor-pointer bg-white dark:bg-[#251B38] border border-[#FF4D6D]/40 text-[#FF4D6D] shadow-xs active:scale-90 ${
                  canScrollLeft ? 'opacity-100 hover:bg-[#FF4D6D] hover:text-white' : 'opacity-25 pointer-events-none'
                }`}
              >
                <ChevronLeft size={14} />
              </button>

              {/* Draggable & Horizontally Scrollable Suggestions Track */}
              <div
                ref={chipsScrollRef}
                role="toolbar"
                aria-label="Suggested questions"
                onMouseDown={handleChipsMouseDown}
                onMouseMove={handleChipsMouseMove}
                onMouseUp={handleChipsMouseUp}
                onMouseLeave={handleChipsMouseLeave}
                className={`flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1 w-full ${
                  isDraggingChips ? 'cursor-grabbing select-none' : 'cursor-grab'
                }`}
              >
                {currentChips.map((chip, idx) => {
                  const isSelected = focusedChipIndex === idx;
                  return (
                    <button
                      key={chip.id || idx}
                      ref={(el) => {
                        chipRefs.current[idx] = el;
                      }}
                      type="button"
                      tabIndex={isSelected ? 0 : -1}
                      disabled={isTyping}
                      onClick={() => {
                        if (dragStartRef.current.hasMoved) return; // Prevent click while dragging
                        handleSendMessage(chip.query || chip.label);
                      }}
                      onKeyDown={(e) => handleChipKeyDown(e, idx, currentChips.length)}
                      className={`shrink-0 h-[26px] min-h-[26px] px-2.5 py-0.5 rounded-lg text-[10.5px] font-sans font-medium inline-flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer shadow-2xs whitespace-nowrap active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden ${
                        isTyping
                          ? 'opacity-40 pointer-events-none'
                          : 'bg-white/90 dark:bg-[#1E162B]/90 backdrop-blur-xs border border-[#E7E2D8] dark:border-[#2D2340] text-stone-700 dark:text-stone-300 hover:text-[#FF4D6D] dark:hover:text-[#FF758F] hover:bg-[#FF4D6D]/10 dark:hover:bg-[#FF4D6D]/20 hover:border-[#FF4D6D]/60'
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>

              {/* Visible Right Arrow Button */}
              <button
                type="button"
                onClick={() => handleScrollChips('right')}
                disabled={!canScrollRight}
                aria-label="Scroll suggestions right"
                className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 z-10 ml-1 cursor-pointer bg-white dark:bg-[#251B38] border border-[#FF4D6D]/40 text-[#FF4D6D] shadow-xs active:scale-90 ${
                  canScrollRight ? 'opacity-100 hover:bg-[#FF4D6D] hover:text-white' : 'opacity-25 pointer-events-none'
                }`}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* 4. Input Bar & Send Action (Touch target >= 44px) */}
          <div className="relative p-2.5 border-t border-[#E7E2D8]/80 dark:border-[#2D2340]/80 bg-white/80 dark:bg-[#120D1D]/80 flex items-center gap-2 shrink-0">
            {inputValue.startsWith('/') && (
              <div className="absolute bottom-full left-2 right-2 mb-2 bg-white/95 dark:bg-[#1A1325]/95 backdrop-blur-md border border-[#E7E2D8] dark:border-[#2D2340] rounded-xl shadow-2xl overflow-hidden z-40 max-h-72 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="px-3 py-1.5 bg-stone-100/90 dark:bg-[#150F22]/90 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between text-[10px] font-mono text-stone-500 uppercase tracking-wider shrink-0">
                  <span>Slash Commands ({filteredSlashCommands.length})</span>
                  <span className="text-[9px] text-stone-400 font-sans">↑↓ Navigate • Tab auto-fill • Enter run</span>
                </div>
                <div className="overflow-y-auto max-h-64 overscroll-contain divide-y divide-stone-100 dark:divide-stone-800/40">
                  {filteredSlashCommands.length === 0 ? (
                    <div className="px-3 py-4 text-center text-xs text-stone-400">
                      No matching slash commands found. Type <span className="font-mono text-[#FF4D6D]">/help</span> for list.
                    </div>
                  ) : (
                    filteredSlashCommands.map((cmd, idx) => {
                      const isActive = idx === activeSlashIndex;
                      const badgeColor =
                        cmd.category === 'Navigation'
                          ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                          : cmd.category === 'Profile'
                          ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                          : cmd.category === 'Domain'
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : cmd.category === 'Commercial'
                          ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          : 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';

                      return (
                        <button
                          key={cmd.command}
                          type="button"
                          onMouseEnter={() => setActiveSlashIndex(idx)}
                          onClick={() => executeSlashCommand(cmd)}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                            isActive
                              ? 'bg-[#FF4D6D]/15 dark:bg-[#FF4D6D]/20 text-[#FF4D6D] dark:text-[#FF758F]'
                              : 'hover:bg-stone-100/60 dark:hover:bg-stone-800/60 text-stone-800 dark:text-stone-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono font-bold text-[#FF4D6D] dark:text-[#FF758F] shrink-0">
                              {cmd.command}
                            </span>
                            <span className="font-medium text-stone-800 dark:text-stone-200 truncate">
                              {cmd.label}
                            </span>
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border shrink-0 hidden sm:inline-block ${badgeColor}`}>
                              {cmd.badge || cmd.category}
                            </span>
                          </div>
                          <span className="text-[10.5px] text-stone-400 dark:text-stone-500 truncate max-w-[45%] text-right font-sans">
                            {cmd.description}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              placeholder="Ask about Atul's work, skills or type '/'..."
              aria-label="Ask Atul AI Assistant"
              className="flex-1 bg-stone-100 dark:bg-[#1F172E] text-stone-900 dark:text-white placeholder-stone-400 text-xs rounded-xl px-3 py-2 border border-transparent focus:border-[#FF4D6D]/60 focus:bg-white dark:focus:bg-[#181224] focus:outline-hidden transition-all min-h-[44px]"
            />
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              aria-label={isListening ? "Stop voice input" : "Start voice input"}
              title={isListening ? "Listening... Click to stop" : "Voice Input (Speech to Text)"}
              className={`min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-stone-100 dark:bg-[#1F172E] text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              type="button"
              disabled={!inputValue.trim() || isTyping}
              onClick={() => handleSendMessage()}
              aria-label="Send message"
              className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center bg-linear-to-tr from-[#FF4D6D] to-[#9333EA] text-white hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
