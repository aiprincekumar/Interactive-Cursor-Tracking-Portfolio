/* oxlint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BotMessageSquare,
  X,
  Minus,
  ChevronUp,
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
  ChevronRight
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { useLab } from '../context/LabContext';
import { useRole } from '../context/RoleContext';
import { useAudience } from '../context/AudienceContext';
import { useAnnounce } from '../context/AnnouncerContext';
import {
  queryAssistant,
  getInitialSuggestions,
  clearSessionMemory,
  cleanMarkdownAsterisks,
  tuneResponseEmojis,
  getOnboardingDecisionTree
} from '../utils/portfolioAssistantEngine.js';
import { getResumeConfig } from '../utils/resumeConfig.js';

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
  text: "Hi there! 👋 I am Atul's AI Assistant preview. Feel free to ask about Atul's projects, experience, or tech stack!",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  chips: PROMPT_CHIPS,
  decisionTree: {
    step: 'audience',
    title: "Welcome! Who are you viewing Atul's portfolio as?",
    options: [
      { id: 'recruiter', label: '💼 Recruiter / Hiring', audience: 'recruiter' },
      { id: 'client', label: '🤝 Client / Projects', audience: 'client' },
      { id: 'marriage', label: '💍 Matrimonial Biodata', audience: 'marriage' },
      { id: 'all', label: '🚀 General Explorer', audience: 'all' },
      { id: 'skip', label: '⏩ Skip', isSkip: true },
      { id: 'other', label: '✏️ Other / Specify', isOther: true }
    ]
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
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [emojiEnabled, setEmojiEnabled] = useState(true);
  const [inlineSpecifyMsgId, setInlineSpecifyMsgId] = useState(null);
  const [inlineSpecifyText, setInlineSpecifyText] = useState('');
  const [skippedDecisionTreeMsgIds, setSkippedDecisionTreeMsgIds] = useState(new Set());
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const [focusedChipIndex, setFocusedChipIndex] = useState(0);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const chipRefs = useRef([]);
  const lastFocusedElementRef = useRef(null);
  const chipsScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDraggingChips, setIsDraggingChips] = useState(false);
  const dragStartRef = useRef({ x: 0, scrollLeft: 0, hasMoved: false });

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
    const baseWelcome = { ...DEFAULT_WELCOME_MESSAGE, chips: initialChips };
    if (!baseWelcome.decisionTree && typeof getOnboardingDecisionTree === 'function') {
      const dt = getOnboardingDecisionTree(audience, activeRole);
      if (dt && dt.audienceStep) {
        baseWelcome.decisionTree = dt.audienceStep;
      }
    }
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
  const handleClose = () => {
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

  // Handle Minimize / Maximize toggle
  const handleToggleMinimize = () => {
    if (soundEnabled && soundFX?.playFocusBeep) {
      soundFX.playFocusBeep();
    }
    setIsMinimized((prev) => !prev);
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
    }
  };

  // 1-Click Clear Chat reset handler
  const handleAudienceDecisionSelect = (aud, label) => {
    setAudience(aud);
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: `Selected Audience: ${label}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const followUpMsg = {
      id: `assistant-role-${Date.now()}`,
      sender: 'assistant',
      text: "Great! Next, which professional track / role would you like to explore?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      decisionTree: {
        step: 'role',
        title: "Select Job Role / Professional Track:",
        options: [
          { id: 'accountant', label: '📊 Corporate Accountant', role: 'accountant' },
          { id: 'mis', label: '📑 MIS Operations Lead', role: 'mis' },
          { id: 'vibe_coding', label: '💻 AI Vibe Coder & Engineer', role: 'vibe_coding' },
          { id: 'other', label: '✨ BI & Controller', role: 'other' },
          { id: 'overview', label: '🎯 Executive Overview', role: 'overview' },
          { id: 'skip', label: '⏩ Skip', isSkip: true },
          { id: 'other', label: '✏️ Other / Specify', isOther: true }
        ]
      }
    };
    setMessages((prev) => [...prev, userMsg, followUpMsg]);
  };

  const handleRoleDecisionSelect = (r, label) => {
    if (typeof selectRole === 'function') selectRole(r);
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: `Selected Role: ${label}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    handleSendMessage(`Tell me about your ${label} background and experience`);
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
    const welcomeMsg = { ...DEFAULT_WELCOME_MESSAGE, id: `welcome-${Date.now()}`, chips: initialChips };
    if (!welcomeMsg.decisionTree && typeof getOnboardingDecisionTree === 'function') {
      const dt = getOnboardingDecisionTree(audience, activeRole);
      if (dt && dt.audienceStep) {
        welcomeMsg.decisionTree = dt.audienceStep;
      }
    }
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

  // Handle keyboard submission & Escape dismiss
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
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

  return (
    <div
      role="dialog"
      aria-label="Atul AI Assistant"
      aria-modal="false"
      className={`fixed bottom-0 z-[55] select-none transition-all duration-300 ease-out flex flex-col overflow-hidden bg-[#FAF8F5]/95 dark:bg-[#161122]/95 backdrop-blur-md shadow-2xl border-[#E7E2D8] dark:border-[#2D2340] left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 ${
        isDrawerOpen ? 'sm:right-[540px]' : 'sm:right-28'
      } ${
        isMinimized
          ? `w-[280px] sm:w-[320px] ${isDrawerOpen ? 'sm:max-w-[calc(100vw-560px)]' : ''} h-13 rounded-t-xl rounded-b-none border-t border-x border-b-0`
          : `w-[95vw] sm:w-[380px] max-w-[400px] ${
              isDrawerOpen ? 'sm:max-w-[calc(100vw-560px)] sm:min-w-[260px]' : ''
            } h-[500px] max-h-[82vh] rounded-t-2xl rounded-b-none border-t border-x border-b-0`
      }`}
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
        onClick={isMinimized ? handleToggleMinimize : undefined}
        className={`flex items-center justify-between px-3.5 bg-white/60 dark:bg-[#120D1D]/70 shrink-0 ${
          isMinimized
            ? 'h-full cursor-pointer hover:bg-white/80 dark:hover:bg-[#120D1D]/90 transition-colors'
            : 'h-14 border-b border-[#E7E2D8]/80 dark:border-[#2D2340]/80'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
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
            <span className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
              {isMinimized ? 'Copilot Ready' : 'Portfolio Copilot • Hybrid'}
            </span>
          </div>
        </div>

        {/* Header Controls: Minimize/Maximize and Close (Strict >= 44px touch targets) */}
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={handleToggleMinimize}
            aria-label={isMinimized ? 'Expand Chat' : 'Minimize Chat'}
            title={isMinimized ? 'Expand' : 'Minimize'}
            className="min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-[#18181B] dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
          >
            {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close Chat"
            title="Close (Esc)"
            className="min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-[#FF4D6D] dark:hover:text-[#FF4D6D] hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* When Minimized, hide the body */}
      {!isMinimized && (
        <>
          {/* Dynamic Island Sub-Header: Active Role Capsule + Active Audience Pill + Clear Chat */}
          <div className="px-3 py-1 bg-stone-100/80 dark:bg-[#150F22]/80 border-b border-[#E7E2D8]/60 dark:border-[#2D2340]/60 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {/* Active Role Capsule */}
              <span
                className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border transition-colors shrink-0"
                style={{
                  borderColor: `${roleData.accent || '#FF4D6D'}40`,
                  backgroundColor: `${roleData.accent || '#FF4D6D'}15`,
                  color: roleData.accent || '#FF4D6D'
                }}
                title={`Active Role: ${roleData.label || roleData.shortLabel}`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: roleData.accent || '#FF4D6D' }}
                />
                <span className="truncate max-w-[90px]">{roleData.shortLabel || roleData.label}</span>
              </span>

              {/* Active Audience Capsule */}
              <span
                className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-800/70 text-stone-700 dark:text-stone-300 transition-colors shrink-0"
                title={`Audience Mode: ${activeAudienceData?.label || 'All'}`}
              >
                <span className="text-[11px]">{activeAudienceData?.emoji || '🌐'}</span>
                <span className="truncate max-w-[80px]">{activeAudienceData?.shortLabel || 'All'}</span>
              </span>
            </div>

            {/* Clear Chat 1-Click Action & Emoji Toggle Button */}
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

                      {/* Decision Tree Rendering */}
                      {isAssistant && msg.decisionTree && !skippedDecisionTreeMsgIds.has(msg.id) && (
                        <div className="mt-2.5 pt-2 border-t border-stone-200/60 dark:border-stone-700/60 w-full">
                          {msg.decisionTree.title && (
                            <p className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-2">
                              {msg.decisionTree.title}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1.5 w-full">
                            {msg.decisionTree.options?.map((chip) => {
                              const isAudienceCurrent = chip.audience && chip.audience === audience;
                              const isRoleCurrent = chip.role && chip.role === activeRole;
                              const isSelected = isAudienceCurrent || isRoleCurrent;

                              if (chip.isSkip) {
                                return (
                                  <button
                                    key={chip.id || 'skip'}
                                    type="button"
                                    onClick={() => {
                                      setSkippedDecisionTreeMsgIds((prev) => new Set([...prev, msg.id]));
                                      inputRef.current?.focus();
                                    }}
                                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 border border-stone-300/80 dark:border-stone-700 transition-colors cursor-pointer"
                                  >
                                    ⏩ Skip
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
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer border ${
                                      inlineSpecifyMsgId === msg.id
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border-stone-300/80 dark:border-stone-700'
                                    }`}
                                  >
                                    ✏️ Other / Specify
                                  </button>
                                );
                              }

                              if (chip.audience) {
                                return (
                                  <button
                                    key={chip.id}
                                    type="button"
                                    onClick={() => handleAudienceDecisionSelect(chip.audience, chip.label)}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer border ${
                                      isSelected
                                        ? 'bg-[#FF4D6D] text-white border-[#FF4D6D] shadow-xs'
                                        : 'bg-white dark:bg-[#1E162B] text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:border-[#FF4D6D] hover:text-[#FF4D6D]'
                                    }`}
                                  >
                                    {chip.label} {isSelected ? '✓ (Current)' : ''}
                                  </button>
                                );
                              }

                              if (chip.role) {
                                return (
                                  <button
                                    key={chip.id}
                                    type="button"
                                    onClick={() => handleRoleDecisionSelect(chip.role, chip.label)}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer border ${
                                      isSelected
                                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                        : 'bg-white dark:bg-[#1E162B] text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:border-emerald-500 hover:text-emerald-500'
                                    }`}
                                  >
                                    {chip.label} {isSelected ? '✓ (Current)' : ''}
                                  </button>
                                );
                              }

                              return (
                                <button
                                  key={chip.id || chip.label}
                                  type="button"
                                  onClick={() => handleSendMessage(chip.query || chip.label)}
                                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-[#1E162B] text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 hover:border-[#FF4D6D] hover:text-[#FF4D6D] transition-all cursor-pointer"
                                >
                                  {chip.label}
                                </button>
                              );
                            })}
                          </div>

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
                              className="mt-2.5 flex items-center gap-1.5 p-1.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-[#FF4D6D]/40"
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
                  <span
                    className={`text-[9px] font-mono text-stone-400 dark:text-stone-500 mt-1 px-1 ${
                      isAssistant ? 'ml-6.5' : ''
                    }`}
                  >
                    {msg.timestamp}
                  </span>
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
          <div className="p-2.5 border-t border-[#E7E2D8]/80 dark:border-[#2D2340]/80 bg-white/80 dark:bg-[#120D1D]/80 flex items-center gap-2 shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              placeholder="Ask about Atul's work, skills..."
              aria-label="Ask Atul AI Assistant"
              className="flex-1 bg-stone-100 dark:bg-[#1F172E] text-stone-900 dark:text-white placeholder-stone-400 text-xs rounded-xl px-3 py-2 border border-transparent focus:border-[#FF4D6D]/60 focus:bg-white dark:focus:bg-[#181224] focus:outline-hidden transition-all min-h-[44px]"
            />
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
