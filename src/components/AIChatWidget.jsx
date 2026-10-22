import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BotMessageSquare, X, Minus, ChevronUp, Maximize2, Send, Bot, User, CheckCircle2 } from 'lucide-react';
import { soundFX } from '../utils/audio';
import { useLab } from '../context/LabContext';

/**
 * Curated knowledge base for Atul AI Assistant simulated responses
 */
const KNOWLEDGE_RESPONSES = {
  projects: `🚀 **Featured Flagship Projects:**\n\n• **PolicyGuard AI**: Real-time enterprise AI policy compliance engine with automated threat audit workflows.\n• **Dynamic Cursor Portfolio & Lab Studio**: Interactive React portfolio featuring Web Audio API synthesizers, physics particles, and custom accessibility modes.\n• **Modern Payment Gateway**: Secure multi-method transaction pipeline with end-to-end encryption & webhook reconciliation.\n\n✨ Scroll down to the **Selected Work** section for interactive case study dossiers!`,
  tech: `💻 **Core Tech Stack & Architectures:**\n\n• **Frontend**: React 18/19, Next.js, Vite, Tailwind CSS, Web Audio API, Framer Motion.\n• **Backend & APIs**: Node.js, Express, Python, RESTful & GraphQL architecture.\n• **Agentic AI & Systems**: Google Antigravity SDK, Claude Code harnesses, MCP protocols, Prompt engineering.\n• **Tooling & Cloud**: Docker, Git, CI/CD pipelines, Vercel, Supabase.`,
  experience: `💼 **Experience & Engineering Leadership:**\n\nAtul has extensive experience building scalable full-stack web applications, interactive enterprise platforms, and agentic workflows. He is known for high-velocity execution, micro-interaction craftsmanship, and rock-solid system reliability. Check the **Journey & Experience** section for detailed milestones!`,
  contact: `📬 **Let's Connect Directly:**\n\n• **WhatsApp**: Click the WhatsApp FAB in the bottom right corner (+91 7992383804).\n• **Instant Inquiry**: Scroll to the **Contact** section for fee estimation & project quotes.\n• **Direct Email & Profiles**: Check the footer links for GitHub and LinkedIn!`,
  default: `Thanks for asking! 👋 I am Atul's AI Assistant preview. While full multi-modal backend LLM inference is currently being connected, feel free to use the prompt chips below or jump to any section on the page to explore Atul's work!`
};

const PROMPT_CHIPS = [
  { id: 'projects', label: '🚀 Featured Projects' },
  { id: 'tech', label: '💻 Core Tech Stack' },
  { id: 'experience', label: '💼 Experience Summary' },
  { id: 'contact', label: '📬 How to Contact' }
];

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hi there! 👋 I am Atul's AI Assistant preview. Feel free to ask about Atul's projects, experience, or tech stack!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Safe access to Lab Context for drawer offset and sound settings
  let labContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    labContext = useLab();
  } catch {
    // safe fallback
  }
  const soundEnabled = labContext?.soundEnabled ?? true;
  const isDrawerOpen = labContext?.isDrawerOpen ?? false;

  // Scroll to bottom of message list smoothly
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  // Handle Close
  const handleClose = () => {
    if (soundEnabled && soundFX?.playTap) {
      soundFX.playTap();
    }
    setIsOpen(false);
  };

  // Handle Minimize / Maximize toggle
  const handleToggleMinimize = () => {
    if (soundEnabled && soundFX?.playFocusBeep) {
      soundFX.playFocusBeep();
    }
    setIsMinimized((prev) => !prev);
  };

  // Bot response generation
  const generateBotReply = (userText) => {
    const lower = userText.toLowerCase();
    if (lower.includes('project') || lower.includes('work') || lower.includes('app') || lower.includes('policy')) {
      return KNOWLEDGE_RESPONSES.projects;
    }
    if (lower.includes('stack') || lower.includes('tech') || lower.includes('react') || lower.includes('node') || lower.includes('skill')) {
      return KNOWLEDGE_RESPONSES.tech;
    }
    if (lower.includes('exp') || lower.includes('about') || lower.includes('background') || lower.includes('who is')) {
      return KNOWLEDGE_RESPONSES.experience;
    }
    if (lower.includes('contact') || lower.includes('hire') || lower.includes('whatsapp') || lower.includes('email') || lower.includes('reach')) {
      return KNOWLEDGE_RESPONSES.contact;
    }
    return KNOWLEDGE_RESPONSES.default;
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

    // 600ms simulated AI thinking/typing delay
    typingTimeoutRef.current = setTimeout(() => {
      const replyText = generateBotReply(trimmed);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      if (soundEnabled && soundFX?.playFocusBeep) {
        soundFX.playFocusBeep();
      }
    }, 600);
  };

  // Handle keyboard submission
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    }
  };

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
              {isMinimized ? 'Copilot Ready' : 'Portfolio Copilot • Preview'}
            </span>
          </div>
        </div>

        {/* Header Controls: Minimize/Maximize and Close */}
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={handleToggleMinimize}
            aria-label={isMinimized ? 'Expand Chat' : 'Minimize Chat'}
            title={isMinimized ? 'Expand' : 'Minimize'}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-[#18181B] dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
          >
            {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close Chat"
            title="Close (Esc)"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-[#FF4D6D] dark:hover:text-[#FF4D6D] hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* When Minimized, hide the rest of the body */}
      {!isMinimized && (
        <>
          {/* 2. Messages Scroll Container */}
          <div className="flex-1 min-h-0 p-3 overflow-y-auto space-y-3 overscroll-contain">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div className={`flex items-start gap-1.5 max-w-[88%] ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
                    {isAssistant && (
                      <div className="w-5 h-5 rounded-full bg-linear-to-tr from-[#FF4D6D] to-[#9333EA] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <BotMessageSquare className="w-3 h-3" />
                      </div>
                    )}
                    <div
                      className={`px-3 py-2 text-xs leading-relaxed shadow-2xs whitespace-pre-line ${
                        isAssistant
                          ? 'bg-white dark:bg-[#1F172E] text-stone-800 dark:text-stone-100 border border-[#E7E2D8] dark:border-[#2D2340] rounded-2xl rounded-tl-xs'
                          : 'bg-linear-to-tr from-[#FF4D6D] to-[#FF758F] text-white rounded-2xl rounded-tr-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                  <span className={`text-[9px] font-mono text-stone-400 dark:text-stone-500 mt-1 px-1 ${isAssistant ? 'ml-6.5' : ''}`}>
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

          {/* 3. Suggested Prompt Chips */}
          <div className="px-3 py-2 border-t border-[#E7E2D8]/60 dark:border-[#2D2340]/60 bg-stone-50/50 dark:bg-[#120D1D]/40 shrink-0">
            <span className="text-[9px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5 block">
              Quick Suggestions
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth pb-0.5">
              {PROMPT_CHIPS.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  disabled={isTyping}
                  onClick={() => handleSendMessage(chip.label)}
                  className="shrink-0 text-[11px] font-medium font-mono px-2.5 py-1 rounded-full bg-white dark:bg-[#1F172E] hover:bg-purple-50 dark:hover:bg-purple-900/30 text-stone-700 dark:text-stone-300 hover:text-purple-600 dark:hover:text-purple-300 border border-[#E7E2D8] dark:border-[#2D2340] hover:border-purple-400 transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Input Bar & Send Action */}
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
              className="flex-1 bg-stone-100 dark:bg-[#1F172E] text-stone-900 dark:text-white placeholder-stone-400 text-xs rounded-xl px-3 py-2 border border-transparent focus:border-[#FF4D6D]/60 focus:bg-white dark:focus:bg-[#181224] focus:outline-hidden transition-all"
            />
            <button
              type="button"
              disabled={!inputValue.trim() || isTyping}
              onClick={() => handleSendMessage()}
              aria-label="Send message"
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-linear-to-tr from-[#FF4D6D] to-[#9333EA] text-white hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
