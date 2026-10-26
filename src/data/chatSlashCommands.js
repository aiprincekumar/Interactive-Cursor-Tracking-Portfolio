/**
 * Portfolio Assistant Chat Slash Commands (40+ Commands)
 * Comprehensive directory & response catalog for instant navigation, profile details, domain expertise, and utilities.
 */

import { formatAnalyticsScorecard } from '../utils/chatAnalytics.js';
import { searchPortfolio } from '../utils/portfolioSemanticIndex.js';
import { PORTFOLIO_TOURS } from '../utils/chatTourEngine.js';
import { generateMetaPrompt, META_PROMPT_TEMPLATES } from '../services/metaPromptEngine.js';


export const CHAT_SLASH_COMMANDS = [
  // --- Navigation & Modes ---
  {
    command: '/help',
    label: 'Command Guide & Capabilities',
    category: 'Navigation',
    badge: '🧭 Navigation',
    icon: 'HelpCircle',
    description: 'View full guide to all 40+ slash commands and features'
  },
  {
    command: '/clear',
    label: 'Clear Chat History',
    category: 'Navigation',
    badge: '🧭 Navigation',
    icon: 'RotateCcw',
    description: 'Reset conversation and re-initialize session memory'
  },
  {
    command: '/view',
    label: 'Switch Portfolio View Mode',
    category: 'Navigation',
    badge: '🧭 Navigation',
    icon: 'Monitor',
    description: 'Switch between Modern, Simple, Basic, and Terminal'
  },
  {
    command: '/audience',
    label: 'Switch Audience Perspective',
    category: 'Navigation',
    badge: '🧭 Navigation',
    icon: 'Users',
    description: 'Tailor view for Recruiter, Client, Matrimonial, or Explorer'
  },
  {
    command: '/role',
    label: 'Switch Career Track',
    category: 'Navigation',
    badge: '🧭 Navigation',
    icon: 'Briefcase',
    description: 'Filter for Accountant, MIS, Vibe Coder, Controller, or Overview'
  },
  {
    command: '/model',
    label: 'Switch AI Model (On-Device LLM)',
    category: 'Navigation',
    badge: '🤖 AI Model',
    icon: 'Bot',
    description: 'Select local On-Device AI neural model or offline engine'
  },
  {
    command: '/terminal',
    label: 'Switch to Terminal Mode',
    category: 'Navigation',
    badge: '🧭 Navigation',
    icon: 'Terminal',
    description: 'Open full-featured retro developer CLI terminal mode'
  },
  {
    command: '/pdf',
    label: 'Switch to Basic / PDF View',
    category: 'Navigation',
    badge: '🧭 Navigation',
    icon: 'FileText',
    description: 'Clean zero-distraction paginated PDF reader mode'
  },
  {
    command: '/basic',
    label: 'Switch to Basic Layout',
    category: 'Navigation',
    badge: '🧭 Navigation',
    icon: 'FileText',
    description: 'Minimalist accessible document-style portfolio layout'
  },
  {
    command: '/simple',
    label: 'Switch to Simple Layout',
    category: 'Navigation',
    badge: '🧭 Navigation',
    icon: 'Layers',
    description: 'Clean, distraction-free classic portfolio view'
  },
  {
    command: '/fullscreen',
    label: 'Maximize Chat Window',
    category: 'Navigation',
    badge: '🧭 Navigation',
    icon: 'Maximize2',
    description: 'Toggle expanded full-screen assistant dialog'
  },
  {
    command: '/reset',
    label: 'Reset Chat Layout & Position',
    category: 'Navigation',
    badge: '🧭 Navigation',
    icon: 'RotateCcw',
    description: 'Dock assistant back to bottom-right corner'
  },
  {
    command: '/tour',
    label: 'Interactive Guided Tours',
    category: 'Navigation',
    badge: '🧭 Navigation',
    icon: 'Compass',
    description: 'Launch guided interactive tours for recruiters, clients, or engineers'
  },

  // --- Profile & Competencies ---
  {
    command: '/about',
    label: 'About Atul Verma',
    category: 'Profile',
    badge: '👤 Profile',
    icon: 'User',
    description: 'Background summary, professional ethos, and journey'
  },
  {
    command: '/bio',
    label: 'Matrimonial & Personal Biodata',
    category: 'Profile',
    badge: '👤 Profile',
    icon: 'Heart',
    description: 'Family background, values, personal interests, and biodata'
  },
  {
    command: '/skills',
    label: 'Core Skills & Tech Matrix',
    category: 'Profile',
    badge: '👤 Profile',
    icon: 'Zap',
    description: 'Accounting, tax, MIS operations, and modern AI stack'
  },
  {
    command: '/experience',
    label: 'Career Experience (10+ Years)',
    category: 'Profile',
    badge: '👤 Profile',
    icon: 'Clock',
    description: 'Senior Accountant, MIS Lead, Biometrics & AI Coder'
  },
  {
    command: '/projects',
    label: 'Flagship Case Studies (1-9)',
    category: 'Profile',
    badge: '👤 Profile',
    icon: 'FolderGit2',
    description: 'Explore all 9 verified project dossiers and live demos'
  },
  {
    command: '/certifications',
    label: 'Credentials & Certifications',
    category: 'Profile',
    badge: '👤 Profile',
    icon: 'Award',
    description: 'Accounting certifications, ERP credentials, and honors'
  },
  {
    command: '/education',
    label: 'Academic Education',
    category: 'Profile',
    badge: '👤 Profile',
    icon: 'GraduationCap',
    description: 'Formal academic degrees, coursework, and qualifications'
  },
  {
    command: '/stats',
    label: 'Key Metrics & Track Record',
    category: 'Profile',
    badge: '👤 Profile',
    icon: 'TrendingUp',
    description: '500+ returns, ₹2.5Cr+ ITC, 50k+ biometric records'
  },

  // --- Domain Specialties ---
  {
    command: '/accounting',
    label: 'Corporate Accounting & ERP',
    category: 'Domain',
    badge: '📊 Domain',
    icon: 'BookOpen',
    description: 'P&L, balance sheets, ledger hygiene, and financial controls'
  },
  {
    command: '/gst',
    label: 'GST & Statutory Compliance',
    category: 'Domain',
    badge: '📊 Domain',
    icon: 'CheckCircle2',
    description: 'GSTR-1, 3B, 2B ITC matching, and tax audit preparedness'
  },
  {
    command: '/tax',
    label: 'Income Tax E-Filing & Advisory',
    category: 'Domain',
    badge: '📊 Domain',
    icon: 'Percent',
    description: 'ITR-1 to 4 e-filing, AIS/TIS review, and tax planning'
  },
  {
    command: '/tally',
    label: 'Tally Prime & ERP 9',
    category: 'Domain',
    badge: '📊 Domain',
    icon: 'Database',
    description: 'Multi-company accounting, BRS, inventory, and voucher audits'
  },
  {
    command: '/mis',
    label: 'MIS Operations & Government Portals',
    category: 'Domain',
    badge: '📊 Domain',
    icon: 'Activity',
    description: 'DAY-NULM Skill India reporting and biometric systems'
  },
  {
    command: '/audit',
    label: 'Audit Defense & Ledger Hygiene',
    category: 'Domain',
    badge: '📊 Domain',
    icon: 'ShieldCheck',
    description: 'Statutory audit preparation, variance analysis, and internal controls'
  },
  {
    command: '/reconciliation',
    label: 'ITC & Bank Reconciliation',
    category: 'Domain',
    badge: '📊 Domain',
    icon: 'GitCompare',
    description: 'High-volume GSTR-2B matching, vendor ledger & BRS controls'
  },
  {
    command: '/excel',
    label: 'Advanced Excel & Power Query',
    category: 'Domain',
    badge: '📊 Domain',
    icon: 'Table',
    description: 'Macros, VBA, automated pipelines, and nested analytics'
  },
  {
    command: '/vibecoding',
    label: 'AI Vibe Coding & Web Apps',
    category: 'Domain',
    badge: '📊 Domain',
    icon: 'Sparkles',
    description: 'Prompt-to-SaaS generation, React 19, Tailwind v4, Vite'
  },
  {
    command: '/ai-tools',
    label: 'Multi-Agent Frameworks & LLMs',
    category: 'Domain',
    badge: '📊 Domain',
    icon: 'Cpu',
    description: 'Claude Code, Google Antigravity SDK, and MCP tool calling'
  },
  {
    command: '/grill-me',
    label: 'Architectural & System Design Grill Mode',
    category: 'AI & Intelligence',
    badge: '🔥 Interview',
    icon: 'Flame',
    description: 'Interactive architectural & system design interview mode'
  },
  {
    command: '/engineer',
    label: 'Meta-Prompt Engineer & Studio',
    category: 'AI & Intelligence',
    badge: '⚡ Meta-Prompt',
    icon: 'Sparkles',
    description: 'Transform goals into executable commands, structured meta-prompts & engineering suggestions'
  },
  {
    command: '/prompt',
    label: 'Prompt Studio & Architect',
    category: 'AI & Intelligence',
    badge: '⚡ Meta-Prompt',
    icon: 'Zap',
    description: 'Generate production-ready structured LLM meta-prompts with refinement tips'
  },
  {
    command: '/metaprompt',
    label: 'Engineered Meta-Prompt Generator',
    category: 'AI & Intelligence',
    badge: '⚡ Meta-Prompt',
    icon: 'Cpu',
    description: 'Create dual-card command + meta-prompt specifications for any technical task'
  },
  {
    command: '/automation',
    label: 'Financial & Workflow Automation',
    category: 'Domain',
    badge: '📊 Domain',
    icon: 'Sliders',
    description: 'Scripts, reconciliation bots, and batch processing'
  },
  {
    command: '/tools',
    label: 'Tools & Technology Stack',
    category: 'Domain',
    badge: '📊 Domain',
    icon: 'Cpu',
    description: 'Accounting ERPs, AI IDEs, agentic frameworks, and dev tools'
  },

  // --- Commercial & Engagement ---
  {
    command: '/quote',
    label: 'Fee Quotation Estimator',
    category: 'Commercial',
    badge: '💰 Commercial',
    icon: 'Calculator',
    description: 'Interactive calculator for accounting & tech project fees'
  },
  {
    command: '/pricing',
    label: 'Transparent Rate Cards',
    category: 'Commercial',
    badge: '💰 Commercial',
    icon: 'DollarSign',
    description: 'Pricing ranges for GST, tax, MIS, and full-stack software'
  },
  {
    command: '/hire',
    label: 'Hire Atul (Full-time / Contract)',
    category: 'Commercial',
    badge: '💰 Commercial',
    icon: 'CheckSquare',
    description: 'Availability, notice period, and engagement models'
  },
  {
    command: '/contact',
    label: 'Contact Information & Channels',
    category: 'Commercial',
    badge: '💰 Commercial',
    icon: 'Mail',
    description: 'Phone, WhatsApp, email, and meeting booking options'
  },
  {
    command: '/whatsapp',
    label: 'Instant WhatsApp Direct Chat',
    category: 'Commercial',
    badge: '💰 Commercial',
    icon: 'MessageSquare',
    description: 'Direct WhatsApp link to +91 7992383804'
  },
  {
    command: '/email',
    label: 'Send Direct Email',
    category: 'Commercial',
    badge: '💰 Commercial',
    icon: 'Send',
    description: 'Mail to atulverma7992@gmail.com'
  },
  {
    command: '/linkedin',
    label: 'LinkedIn Profile',
    category: 'Commercial',
    badge: '💰 Commercial',
    icon: 'ExternalLink',
    description: 'Connect professionally on LinkedIn'
  },
  {
    command: '/github',
    label: 'GitHub Code Repositories',
    category: 'Commercial',
    badge: '💰 Commercial',
    icon: 'Code2',
    description: 'View open-source projects, repos, and code contributions'
  },

  // --- Utility & Extras ---
  {
    command: '/resume',
    label: 'Download Verified Resume (PDF)',
    category: 'Utility',
    badge: '⚡ Utility',
    icon: 'Download',
    description: 'ATS-optimized PDF resume tailored to your active track'
  },
  {
    command: '/download',
    label: 'Download Portfolio Assets',
    category: 'Utility',
    badge: '⚡ Utility',
    icon: 'FileDown',
    description: 'Quick links to download PDF resumes, case summaries, and decks'
  },
  {
    command: '/transcript',
    label: 'Export Chat Transcript (JSON)',
    category: 'Utility',
    badge: '⚡ Utility',
    icon: 'FileJson',
    description: 'Download the current conversation history as a JSON file'
  },
  {
    command: '/faq',
    label: 'Frequently Asked Questions',
    category: 'Utility',
    badge: '⚡ Utility',
    icon: 'HelpCircle',
    description: 'Answers to the top 20+ questions across accounting and tech'
  },
  {
    command: '/shortcuts',
    label: 'Keyboard Shortcuts Reference',
    category: 'Utility',
    badge: '⚡ Utility',
    icon: 'Command',
    description: 'Ctrl+K / Alt+C, Escape to minimize, Tab/Enter autocomplete'
  },
  {
    command: '/tips',
    label: 'Portfolio Exploration Tips',
    category: 'Utility',
    badge: '⚡ Utility',
    icon: 'Lightbulb',
    description: 'Best ways to navigate based on recruiter, client, or hiring needs'
  },
  {
    command: '/export',
    label: 'Export Chat Transcript',
    category: 'Utility',
    badge: '⚡ Utility',
    icon: 'Download',
    description: 'Export chat transcript in Markdown, Plain Text, JSON, or HTML format'
  },
  {
    command: '/history',
    label: 'Conversation Session Archive',
    category: 'Utility',
    badge: '⚡ Utility',
    icon: 'History',
    description: 'Manage and switch between up to 10 stored local conversation sessions'
  },
  {
    command: '/analytics',
    label: 'AI Performance Telemetry',
    category: 'Utility',
    badge: '⚡ Utility',
    icon: 'BarChart2',
    description: 'View zero-cloud on-device latency, token throughput, and satisfaction metrics'
  },
  {
    command: '/telemetry',
    label: 'Local Hardware & AI Metrics',
    category: 'Utility',
    badge: '⚡ Utility',
    icon: 'Activity',
    description: 'Detailed client telemetry for WebGPU/WASM model inference'
  },
  {
    command: '/benchmark',
    label: 'On-Device AI Benchmarks',
    category: 'Utility',
    badge: '⚡ Utility',
    icon: 'Cpu',
    description: 'Real-time tokens/sec, average latency, and memory throughput score'
  },
  {
    command: '/search',
    label: 'Semantic Portfolio Search',
    category: 'Utility',
    badge: '⚡ Utility',
    icon: 'Search',
    description: 'Deep multi-faceted semantic search across case studies, skills, and tools'
  },
  {
    command: '/voice',
    label: 'Voice Agent Controller',
    category: 'Utility',
    badge: '🎙️ Voice',
    icon: 'Mic',
    description: 'Toggle voice agent, view audio waveforms, and configure speech dubbing'
  },
  {
    command: '/speak',
    label: 'Text-to-Speech Read Aloud',
    category: 'Utility',
    badge: '🎙️ Voice',
    icon: 'Volume2',
    description: 'Read the latest response or custom text aloud using browser neural voice synthesis'
  },
  {
    command: '/voicesettings',
    label: 'Voice Pitch, Rate & Language',
    category: 'Utility',
    badge: '🎙️ Voice',
    icon: 'Settings',
    description: 'Adjust speech playback rate (0.8x-1.5x), pitch, hands-free auto-speak, and language profiles'
  },
  {
    command: '/voiceconfig',
    label: 'Voice Studio Configuration',
    category: 'Utility',
    badge: '🎙️ Voice',
    icon: 'Sliders',
    description: 'Direct alias to configure speech rate, pitch modulator, auto-speak, and voice profiles'
  }
];

export function handleSlashCommand(rawQuery, context = { role: 'overview', audience: 'all' }, responseId) {
  const q = String(rawQuery).trim().toLowerCase();
  const cmdKey = q.split(/\s+/)[0];
  const rid = responseId || `resp_cmd_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  const defaultChips = [
    { id: 'c-help', label: '🧭 /help', query: '/help' },
    { id: 'c-projects', label: '🚀 /projects', query: '/projects' },
    { id: 'c-skills', label: '⚡ /skills', query: '/skills' },
    { id: 'c-quote', label: '💰 /quote', query: '/quote' }
  ];

  switch (cmdKey) {
    case '/help':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/help',
        language: 'en',
        text: `🧭 **Atul AI Assistant — Slash Command Directory**\n\nYou can use any of these **40+ slash commands** for instant shortcuts:\n\n` +
          `• **Navigation & Modes**: \`/view\`, \`/audience\`, \`/role\`, \`/terminal\`, \`/pdf\`, \`/basic\`, \`/simple\`, \`/fullscreen\`, \`/reset\`, \`/clear\`\n` +
          `• **Profile & Background**: \`/about\`, \`/bio\`, \`/skills\`, \`/experience\`, \`/projects\`, \`/certifications\`, \`/education\`, \`/stats\`\n` +
          `• **Domain Specialties**: \`/accounting\`, \`/gst\`, \`/tax\`, \`/tally\`, \`/mis\`, \`/audit\`, \`/reconciliation\`, \`/excel\`, \`/vibecoding\`, \`/ai-tools\`, \`/automation\`\n` +
          `• **Interactive & Interview**: \`/grill-me\` (Architectural & system design drill session)\n` +
          `• **Meta-Prompt Studio**: \`/engineer\`, \`/prompt\`, \`/metaprompt\` (Craft executable commands + structured LLM prompts)\n` +
          `• **Voice & Speech Dubbing**: \`/voice\`, \`/speak\`, \`/voicesettings\` (Multilingual natural TTS, Chrome watchdog & procedural waveform)\n` +
          `• **Commercial & Hire**: \`/quote\`, \`/pricing\`, \`/hire\`, \`/contact\`, \`/whatsapp\`, \`/email\`, \`/linkedin\`, \`/github\`\n` +
          `• **Utility & Resources**: \`/resume\`, \`/download\`, \`/transcript\`, \`/faq\`, \`/shortcuts\`, \`/tips\`\n\n` +
          `✨ *Tip: Start typing \`/\` in the chat input to see autocomplete suggestions with category badges and instant descriptions!*`,
        chips: [
          { id: 'c-eng', label: '⚡ /engineer', query: '/engineer' },
          { id: 'c-proj', label: '🚀 Projects', query: '/projects' },
          { id: 'c-skills', label: '⚡ Skills', query: '/skills' },
          { id: 'c-gst', label: '📊 GST & Tax', query: '/gst' },
          { id: 'c-quote', label: '💰 Quote', query: '/quote' },
          { id: 'c-resume', label: '📄 Resume', query: '/resume' }
        ],
        actions: [
          { type: 'open-estimator', label: '💰 Open Fee Estimator' },
          { type: 'download-resume', label: '📄 Download Resume (PDF)' },
          { type: 'scroll', target: '#projects', payload: { selector: '#projects' }, label: '🚀 View Case Studies' },
          { type: 'scroll', target: '#contact', payload: { selector: '#contact' }, label: '📬 Contact Info' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/clear':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/clear',
        language: 'en',
        text: `🔄 **Chat History Cleared**\n\nYour session transcript and conversation memory have been reset to default. You can start a fresh conversation or explore using the suggestion chips below!`,
        chips: defaultChips,
        actions: [{ type: 'clear-chat', label: '🔄 Reset Messages' }],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/view':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/view',
        language: 'en',
        text: `🖥️ **Portfolio View Modes**\n\nSelect your preferred viewing experience for Atul Verma's portfolio:\n\n• **Modern (Default)**: Full interactive experience with 3D tilts, motion physics, and sound FX.\n• **Simple**: Streamlined, minimalist, distraction-free reading experience.\n• **Basic / PDF**: Paginated document-style presentation with instant print & PDF export.\n• **Terminal**: Retro developer CLI environment with interactive UNIX commands.`,
        chips: [
          { id: 'c-term', label: '💻 /terminal', query: '/terminal' },
          { id: 'c-pdf', label: '📄 /pdf', query: '/pdf' },
          { id: 'c-simp', label: '🍃 /simple', query: '/simple' }
        ],
        actions: [
          { type: 'switch-view-mode', viewMode: 'modern', payload: { viewMode: 'modern' }, label: '⚡ Modern View' },
          { type: 'switch-view-mode', viewMode: 'simple', payload: { viewMode: 'simple' }, label: '🍃 Simple View' },
          { type: 'switch-view-mode', viewMode: 'basic', payload: { viewMode: 'basic' }, label: '📄 Basic / PDF' },
          { type: 'switch-view-mode', viewMode: 'terminal', payload: { viewMode: 'terminal' }, label: '💻 Terminal CLI' }
        ],
        decisionTree: {
          step: 'viewMode',
          title: 'Select Portfolio View Mode:',
          options: [
            { id: 'modern', label: '⚡ Modern / Interactive', viewMode: 'modern' },
            { id: 'simple', label: '🍃 Simple / Classic', viewMode: 'simple' },
            { id: 'basic', label: '📄 Basic / PDF', viewMode: 'basic' },
            { id: 'terminal', label: '💻 Terminal / Developer', viewMode: 'terminal' }
          ]
        },
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/audience':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/audience',
        language: 'en',
        text: `👥 **Audience Perspective Alignment**\n\nTailor the entire portfolio content to your specific background:\n\n• **Recruiter / Hiring Manager**: Highlights verified skills, tenure, metrics, and 1-click ATS resume download.\n• **Client / Business Owner**: Focuses on deliverables, business ROI, transparent pricing, and case studies.\n• **Matrimonial Biodata**: Displays authentic personal background, values, horoscope, and family details.\n• **General Explorer**: Comprehensive balanced overview across all tracks.`,
        chips: [
          { id: 'c-rec', label: '💼 Recruiter', query: '/role' },
          { id: 'c-cli', label: '🤝 Client', query: '/quote' },
          { id: 'c-bio', label: '💍 Biodata', query: '/bio' }
        ],
        decisionTree: {
          step: 'audience',
          title: 'Select Audience Perspective:',
          options: [
            { id: 'recruiter', label: '💼 Recruiter / Hiring', audience: 'recruiter' },
            { id: 'client', label: '🤝 Client / Projects', audience: 'client' },
            { id: 'marriage', label: '💍 Matrimonial Biodata', audience: 'marriage' },
            { id: 'all', label: '🚀 General Explorer', audience: 'all' }
          ]
        },
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/role':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/role',
        language: 'en',
        text: `💼 **Professional Career Track Filter**\n\nSwitch active portfolio track to highlight relevant domain expertise:\n\n• **Corporate Accountant**: 10+ yrs in Tally Prime ERP, GST compliance, ITR filings & BRS.\n• **MIS Operations Lead**: DAY-NULM Skill India portal leadership & 50k+ biometric systems.\n• **AI Vibe Coder & Engineer**: Prompt-to-SaaS generation, modern React/Node web apps & agentic workflows.\n• **BI & Financial Controller**: Advanced Excel, Power BI dashboards & corporate internal controls.\n• **Executive Overview**: Holistic synthesis of multidisciplinary achievements.`,
        chips: [
          { id: 'c-acc', label: '📊 Accountant', query: '/accounting' },
          { id: 'c-mis', label: '📑 MIS Lead', query: '/mis' },
          { id: 'c-vc', label: '💻 AI Vibe Coder', query: '/vibecoding' }
        ],
        decisionTree: {
          step: 'role',
          title: 'Select Career Track:',
          options: [
            { id: 'accountant', label: '📊 Corporate Accountant', role: 'accountant' },
            { id: 'mis', label: '📑 MIS Operations Lead', role: 'mis' },
            { id: 'vibe_coding', label: '💻 AI Vibe Coder & Engineer', role: 'vibe_coding' },
            { id: 'other', label: '✨ BI & Controller', role: 'other' },
            { id: 'overview', label: '🎯 Executive Overview', role: 'overview' }
          ]
        },
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/terminal':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/terminal',
        language: 'en',
        text: `💻 **Switching to Terminal Mode**\n\nActivating retro UNIX developer CLI environment. You can explore the portfolio using commands like \`help\`, \`cat\`, \`skills\`, \`projects\`, \`whoami\`, and \`contact\`.`,
        chips: [
          { id: 'c-mod', label: '⚡ /view', query: '/view' },
          { id: 'c-hlp', label: '🧭 /help', query: '/help' }
        ],
        actions: [
          { type: 'switch-view-mode', viewMode: 'terminal', payload: { viewMode: 'terminal' }, label: '💻 Launch Terminal Mode' },
          { type: 'switch-view-mode', viewMode: 'modern', payload: { viewMode: 'modern' }, label: '⚡ Back to Modern' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/pdf':
    case '/basic':
      return {
        id: rid,
        intent: 'slash_command',
        command: cmdKey,
        language: 'en',
        text: `📄 **Switching to Basic / PDF View Mode**\n\nActivating clean, document-style reader with verified paginated sections, high-contrast typography, and 1-click print/PDF export.`,
        chips: [
          { id: 'c-res', label: '📥 /resume', query: '/resume' },
          { id: 'c-mod', label: '⚡ /view', query: '/view' }
        ],
        actions: [
          { type: 'switch-view-mode', viewMode: 'basic', payload: { viewMode: 'basic' }, label: '📄 Open Basic View' },
          { type: 'download-resume', label: '📥 Download PDF Resume' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/simple':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/simple',
        language: 'en',
        text: `🍃 **Switching to Simple / Classic Mode**\n\nActivating distraction-free clean layout with minimal animations for fast and accessible browsing.`,
        chips: [
          { id: 'c-mod', label: '⚡ /view', query: '/view' },
          { id: 'c-exp', label: '💼 /experience', query: '/experience' }
        ],
        actions: [
          { type: 'switch-view-mode', viewMode: 'simple', payload: { viewMode: 'simple' }, label: '🍃 Activate Simple Mode' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/fullscreen':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/fullscreen',
        language: 'en',
        text: `⛶ **Assistant Fullscreen Mode**\n\nToggling maximized view for deep reading, code review, and multi-turn exploration.`,
        chips: defaultChips,
        actions: [
          { type: 'toggle-maximize', label: '⛶ Toggle Fullscreen' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/reset':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/reset',
        language: 'en',
        text: `🔄 **Chat Widget Layout Reset**\n\nResetting assistant position, dimensions, and docking back to bottom-right corner.`,
        chips: defaultChips,
        actions: [
          { type: 'reset-layout', label: '🔄 Reset Layout' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/about':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/about',
        language: 'en',
        text: `👤 **About Atul Verma — Multidisciplinary Profile**\n\n• **10+ Years Professional Journey**: Seamlessly blending statutory accounting rigor with high-volume data operations and cutting-edge AI engineering.\n• **Senior Accountant & Tax Consultant**: Managed 500+ GST/ITR filings, ₹2.5Cr+ reconciled ITC, and 100% clean audit compliance.\n• **MIS Operations Lead**: Led multi-district data pipelines for DAY-NULM Skill India and 50,000+ RSBY smart card biometrics.\n• **Modern AI Vibe Coder**: Building full-stack prompt-driven applications, multi-agent LLM harnesses, and financial workflow automations.\n• **Location & Languages**: Sasaram, Bihar (Open to Pan-India remote & on-site engagements). Fluent in English & Hindi.`,
        chips: [
          { id: 'c-exp', label: '💼 /experience', query: '/experience' },
          { id: 'c-skills', label: '⚡ /skills', query: '/skills' },
          { id: 'c-proj', label: '🚀 /projects', query: '/projects' }
        ],
        actions: [
          { type: 'download-resume', label: '📄 Download Resume (PDF)' },
          { type: 'open-case-study', payload: { id: '01' }, label: '📊 Case Study: GST Engine' },
          { type: 'scroll', target: '#about', payload: { selector: '#about' }, label: '📍 About Section' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/bio':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/bio',
        language: 'en',
        text: `💍 **Personal & Matrimonial Biodata — Atul Verma**\n\n• **Personal Details**: Born 1993, Sasaram, Bihar, India. Non-smoker, teetotaler, vegetarian values.\n• **Education**: Bachelor of Commerce (B.Com) + Certified Advanced Financial Accounting & MIS Systems.\n• **Profession**: Senior Tax Consultant, Corporate Accountant & AI Engineering Practitioner.\n• **Family Background**: Reputed respectable family in Sasaram, Bihar with strong cultural roots and traditional values.\n• **Personality & Interests**: Tech enthusiast, analytical problem solver, chess lover, respectful and family-oriented.\n\n*Click below for formal matrimonial view or family contact:*`,
        chips: [
          { id: 'c-mat', label: '💍 Matrimonial View', query: '/audience' },
          { id: 'c-con', label: '📬 /contact', query: '/contact' }
        ],
        actions: [
          { type: 'set-audience', audience: 'marriage', payload: { audience: 'marriage' }, label: '💍 Switch to Matrimonial View' },
          { type: 'link', url: 'https://wa.me/917992383804?text=Namaste%20Atul%20ji,%20regarding%20matrimonial%20biodata', label: '💬 WhatsApp Family Contact' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/skills':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/skills',
        language: 'en',
        text: `⚡ **Core Skills & Technical Competencies Matrix**\n\n1. **Accounting & Tax Advisory**:\n   • Tally Prime ERP, GSTR-1, 3B, 2B ITC Matching, ITR-1 to 4, BRS, Balance Sheet Audit, TDS/TCS.\n2. **MIS & Data Intelligence**:\n   • Advanced Excel (Power Query, VBA/Macros, nested lookups), Power BI Dashboards, SQL, Portal Analytics.\n3. **Modern AI & Web Engineering**:\n   • React 18/19, Vite, Tailwind CSS v4, Node.js, Web Audio API, Google Antigravity SDK, Claude Code loops, Cursor IDE.\n4. **Operations & Governance**:\n   • Multi-district data validation, biometric deduplication, zero-penalty audit defense, client consulting.`,
        chips: [
          { id: 'c-acc', label: '📊 /accounting', query: '/accounting' },
          { id: 'c-gst', label: '📑 /gst', query: '/gst' },
          { id: 'c-vc', label: '✨ /vibecoding', query: '/vibecoding' },
          { id: 'c-ai', label: '🤖 /ai-tools', query: '/ai-tools' }
        ],
        actions: [
          { type: 'scroll', target: '#skills', payload: { selector: '#skills' }, label: '📍 View Skills Section' },
          { type: 'download-resume', label: '📄 Download ATS Resume' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/experience':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/experience',
        language: 'en',
        text: `💼 **Career Journey & Professional Experience (10+ Years)**\n\n• **Senior Accountant & Tax Advisory Consultant** (2018 – Present)\n  *500+ GST & Income Tax returns, ₹2.5Cr+ ITC reconciled, zero penalty notices, corporate audit readiness.*\n• **MIS Executive Lead — DAY-NULM Skill India** (2016 – 2018)\n  *Managed central government portal reporting, multi-district batch validation & candidate tracking.*\n• **Biometric Operations Lead — RSBY Smart Card** (2012 – 2016)\n  *Enrolled 50,000+ citizens across 12+ districts with 99.8% biometric data integrity.*\n• **AI Vibe Coder & Systems Engineer** (2024 – Present)\n  *Autonomous multi-agent pipelines, prompt-to-SaaS generators & full-stack web applications.*`,
        chips: [
          { id: 'c-stats', label: '📈 /stats', query: '/stats' },
          { id: 'c-proj', label: '🚀 /projects', query: '/projects' },
          { id: 'c-res', label: '📄 /resume', query: '/resume' }
        ],
        actions: [
          { type: 'scroll', target: '#experience', payload: { selector: '#experience' }, label: '📍 Full Experience Timeline' },
          { type: 'download-resume', label: '📄 Download Verified CV' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/projects':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/projects',
        language: 'en',
        text: `🚀 **Flagship Projects & Case Studies (1 – 9)**\n\n• **01. GST & Income Tax Verification Engine**: Automated GSTR-2B matching, ITC optimization & audit trails.\n• **02. Tally Prime Multi-Branch Financial ERP**: BRS reconciliation, inventory control & ledger governance.\n• **03. DAY-NULM Skill India MIS Reporting**: Multi-district portal reporting & batch tracking.\n• **04. RSBY Smart Card Biometric Operations**: 50,000+ biometric enrollments with 99.8% integrity.\n• **05. Enterprise Executive Power BI Dashboard**: Fiscal intelligence, cashflow telemetry & KPI tracking.\n• **06. Corporate Balance Sheet & Audit Defense**: Internal controls, statutory compliance & zero-notice audit.\n• **07. AI Prompt-to-Fullstack SaaS Generator**: Rapid scaffolding with React, Tailwind, and Node.js.\n• **08. Autonomous Multi-Agent Workflow Engine**: Claude Code & Antigravity task DAGs with self-healing tools.\n• **09. AI Document & Code Synthesizer**: Unified markdown-to-code synthesis engine.\n\n*Click below to launch an interactive dossier:*`,
        chips: [
          { id: 'c-p1', label: '📊 Case Study 01', query: '/gst' },
          { id: 'c-p2', label: '📈 Case Study 02', query: '/tally' },
          { id: 'c-p7', label: '⚡ Case Study 07', query: '/vibecoding' },
          { id: 'c-p8', label: '🤖 Case Study 08', query: '/ai-tools' }
        ],
        actions: [
          { type: 'open-case-study', payload: { id: '01' }, label: '📊 Case Study 01 (GST)' },
          { type: 'open-case-study', payload: { id: '02' }, label: '📈 Case Study 02 (Tally)' },
          { type: 'open-case-study', payload: { id: '07' }, label: '⚡ Case Study 07 (AI SaaS)' },
          { type: 'open-case-study', payload: { id: '08' }, label: '🤖 Case Study 08 (Agents)' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/certifications':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/certifications',
        language: 'en',
        text: `📜 **Verified Credentials & Professional Certifications**\n\n• **Advanced Financial Accounting & ERP**: Certified Tally Prime & ERP 9 Specialist (Ledgers, BRS, Inventory, Audit).\n• **Statutory Tax Practitioner**: Certified in GST Return Filing, Input Tax Credit (ITC) Rules & Income Tax E-Filing.\n• **Government MIS Operations**: Certified Portal Specialist for DAY-NULM & National Biometric Systems.\n• **Data Analytics & BI**: Advanced Microsoft Excel (Power Query, VBA/Macros) & Power BI Desktop.\n• **AI Engineering & Prompt Architecture**: Google Antigravity & Agentic Framework Specialist.`,
        chips: [
          { id: 'c-edu', label: '🎓 /education', query: '/education' },
          { id: 'c-res', label: '📄 /resume', query: '/resume' }
        ],
        actions: [
          { type: 'scroll', target: '#about', payload: { selector: '#about' }, label: '📍 View Credentials Lightbox' },
          { type: 'download-resume', label: '📄 Download Verified CV' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/education':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/education',
        language: 'en',
        text: `🎓 **Academic Qualifications & Education**\n\n• **Bachelor of Commerce (B.Com)** — Financial Accounting, Corporate Law, Auditing & Taxation.\n• **Higher Secondary (10+2)** — Commerce & Business Mathematics with High Distinction.\n• **Continuous Professional Education**: Ongoing mastery of statutory GST amendments, Income Tax e-filing portals, and AI-driven fullstack development.`,
        chips: [
          { id: 'c-cert', label: '📜 /certifications', query: '/certifications' },
          { id: 'c-res', label: '📄 /resume', query: '/resume' }
        ],
        actions: [
          { type: 'download-resume', label: '📄 Download Education Details' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/stats':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/stats',
        language: 'en',
        text: `📈 **Key Professional Metrics & Track Record**\n\n• **10+ Years** Cumulative Professional Experience\n• **500+** GST & Income Tax Returns filed with zero notice rate\n• **₹2.5Cr+** Input Tax Credit (ITC) reconciled & verified\n• **50,000+** Citizen Biometric Enrollments handled\n• **100%** Clean Audit Compliance across corporate clients\n• **9 Flagship Case Studies** engineered with live interactive dossiers\n• **Zero** Penalty Notices on all statutory tax advisory clients`,
        chips: [
          { id: 'c-proj', label: '🚀 /projects', query: '/projects' },
          { id: 'c-gst', label: '📑 /gst', query: '/gst' },
          { id: 'c-quote', label: '💰 /quote', query: '/quote' }
        ],
        actions: [
          { type: 'open-case-study', payload: { id: '01' }, label: '📊 View Tax Verification Engine' },
          { type: 'open-estimator', label: '💰 Calculate Project Quote' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/accounting':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/accounting',
        language: 'en',
        text: `📊 **Corporate Accounting & ERP Expertise**\n\n• End-to-end accounting lifecycle from source vouchers to Balance Sheet & Profit & Loss statements.\n• Multi-company, multi-currency ledger structures in **Tally Prime & ERP 9**.\n• Strict ledger hygiene, trial balance balancing, and monthly accruals/depreciation adjustments.\n• Bank Reconciliation Statements (BRS) with automated clearing of uncleared cheques.\n• Inventory valuation, batch tracking, and multi-godown stock controls.`,
        chips: [
          { id: 'c-gst', label: '📑 /gst', query: '/gst' },
          { id: 'c-tally', label: '📈 /tally', query: '/tally' },
          { id: 'c-audit', label: '🔍 /audit', query: '/audit' }
        ],
        actions: [
          { type: 'open-case-study', payload: { id: '02' }, label: '📈 Case Study: Tally Prime ERP' },
          { type: 'open-estimator', label: '💰 Accounting Quotation' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/gst':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/gst',
        language: 'en',
        text: `📑 **GST Statutory Compliance & ITC Optimization**\n\n• Monthly & quarterly filing of **GSTR-1** (Outward Supplies) and **GSTR-3B** (Summary Return).\n• Automated 3-way matching of Purchase Register vs **GSTR-2B / 2A** to prevent ITC leakage.\n• **Rule 36(4)** compliance, blocked credits under Section 17(5), and reverse charge (RCM).\n• E-Way Bill generation, E-Invoicing integration, and Annual Returns (**GSTR-9 / 9C**).\n• Audit defense against Section 61 scrutiny notices and DRC-01 demand responses.`,
        chips: [
          { id: 'c-tax', label: '💰 /tax', query: '/tax' },
          { id: 'c-rec', label: '⚖️ /reconciliation', query: '/reconciliation' },
          { id: 'c-quote', label: '💰 /quote', query: '/quote' }
        ],
        actions: [
          { type: 'open-case-study', payload: { id: '01' }, label: '📊 Case Study: GST Verification' },
          { type: 'open-estimator', label: '💰 Estimate GST Filing Fees' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/tax':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/tax',
        language: 'en',
        text: `💰 **Income Tax E-Filing & Advisory**\n\n• Preparation and filing of **ITR-1, 2, 3, and 4 (Sugam)** for individuals, professionals, and proprietorships.\n• Comprehensive reconciliation with **AIS (Annual Information Statement)**, **TIS**, and **Form 26AS**.\n• Advance tax calculations, TDS/TCS quarterly return matching, and refund processing.\n• Tax planning under Old vs New Tax Regime to legitimately minimize tax liability.`,
        chips: [
          { id: 'c-gst', label: '📑 /gst', query: '/gst' },
          { id: 'c-acc', label: '📊 /accounting', query: '/accounting' },
          { id: 'c-quote', label: '💰 /quote', query: '/quote' }
        ],
        actions: [
          { type: 'open-case-study', payload: { id: '01' }, label: '📊 Case Study 01 (Tax Engine)' },
          { type: 'open-estimator', label: '💰 Estimate Tax Return Fees' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/tally':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/tally',
        language: 'en',
        text: `📈 **Tally Prime & ERP 9 Multi-Branch Financial Architecture**\n\n• Setup of chart of accounts, cost centres, and multi-branch company hierarchies.\n• Automated bank reconciliation (BRS) importing bank statements (.xlsx / .csv).\n• Ledger audit and voucher verification to ensure zero unclassified entries.\n• Stock journals, production entries, and purchase order/sales order fulfillment workflows.`,
        chips: [
          { id: 'c-acc', label: '📊 /accounting', query: '/accounting' },
          { id: 'c-audit', label: '🔍 /audit', query: '/audit' }
        ],
        actions: [
          { type: 'open-case-study', payload: { id: '02' }, label: '📈 Case Study: Tally Prime ERP' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/mis':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/mis',
        language: 'en',
        text: `📑 **Government Portal Operations & MIS Leadership**\n\n• Operational leadership on **DAY-NULM Skill India** portal across multiple training centres and districts.\n• Biometric attendance system synchronization, batch certification, and placement tracking.\n• Large-scale biometric enrollment for **RSBY Smart Card** (50,000+ beneficiaries across 12+ districts).\n• Data cleaning, duplicate elimination, and automated Excel reporting for government stakeholders.`,
        chips: [
          { id: 'c-excel', label: '📗 /excel', query: '/excel' },
          { id: 'c-exp', label: '💼 /experience', query: '/experience' }
        ],
        actions: [
          { type: 'open-case-study', payload: { id: '03' }, label: '📑 Case Study: DAY-NULM MIS' },
          { type: 'open-case-study', payload: { id: '04' }, label: '💳 Case Study: RSBY Smart Card' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/audit':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/audit',
        language: 'en',
        text: `🔍 **Internal Controls & Audit Readiness**\n\n• Structuring comprehensive balance sheet audit dossiers for Statutory and Tax Auditors.\n• Verification of fixed asset registers, physical stock reconciliations, and creditor/debtor agings.\n• Internal variance analysis, ratio telemetry (Current ratio, Quick ratio, Debt-Equity), and fraud prevention.\n• Zero-penalty track record across 10+ years of corporate tax audits.`,
        chips: [
          { id: 'c-acc', label: '📊 /accounting', query: '/accounting' },
          { id: 'c-gst', label: '📑 /gst', query: '/gst' }
        ],
        actions: [
          { type: 'open-case-study', payload: { id: '06' }, label: '🔍 Case Study: Audit Defense' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/reconciliation':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/reconciliation',
        language: 'en',
        text: `⚖️ **Reconciliation Master — ITC, BRS & Vendor Ledgers**\n\n• High-velocity reconciliation engine matching thousands of purchase line items against **GSTR-2B**.\n• Bank Reconciliation Statements (BRS) resolving timing differences, bank charges, and dishonoured cheques.\n• Debtor & Creditor ledger balance confirmation, dispute resolution, and interest computations.`,
        chips: [
          { id: 'c-gst', label: '📑 /gst', query: '/gst' },
          { id: 'c-tally', label: '📈 /tally', query: '/tally' }
        ],
        actions: [
          { type: 'open-case-study', payload: { id: '01' }, label: '📊 Case Study: GST Engine' },
          { type: 'open-case-study', payload: { id: '02' }, label: '📈 Case Study: Tally BRS' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/excel':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/excel',
        language: 'en',
        text: `📗 **Advanced Microsoft Excel & Power Query**\n\n• High-volume data ETL with **Power Query** (unpivoting, merging multi-million rows, clean transformations).\n• Advanced modeling using **XLOOKUP, INDEX/MATCH, SUMIFS, dynamic arrays**, and LET/LAMBDA functions.\n• Custom VBA automation & Macros for 1-click ledger formatting and report generation.\n• Interactive Pivot Tables, Slicers, and financial executive summaries.`,
        chips: [
          { id: 'c-mis', label: '📑 /mis', query: '/mis' },
          { id: 'c-skills', label: '⚡ /skills', query: '/skills' }
        ],
        actions: [
          { type: 'open-case-study', payload: { id: '03' }, label: '📑 Case Study: MIS Operations' },
          { type: 'open-case-study', payload: { id: '05' }, label: '📊 Case Study: Power BI' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/vibecoding':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/vibecoding',
        language: 'en',
        text: `✨ **AI Vibe Coding & Modern Web Applications**\n\n• Rapid idea-to-production prototyping using modern LLMs, Cursor, and Windsurf IDEs.\n• Modern frontend stack: **React 18/19, Vite, Tailwind CSS v4, Lucide Icons, and Web Audio API**.\n• Clean component architecture, accessible keyboard navigation, and responsive touch-first design.\n• Case Study 07 demonstrates a full prompt-to-SaaS generator built with zero fluff.`,
        chips: [
          { id: 'c-ai', label: '🤖 /ai-tools', query: '/ai-tools' },
          { id: 'c-auto', label: '⚙️ /automation', query: '/automation' }
        ],
        actions: [
          { type: 'open-case-study', payload: { id: '07' }, label: '⚡ Case Study: AI SaaS Generator' },
          { type: 'switch-role-tab', role: 'vibe_coding', payload: { role: 'vibe_coding' }, label: '💻 Switch to AI Vibe Coder' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/ai-tools':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/ai-tools',
        language: 'en',
        text: `🤖 **Multi-Agent Systems & LLM Architecture**\n\n• Production pipelines using **Google Antigravity SDK**, **Claude Code**, and **Agentic MCP** tools.\n• Tool-use workflows, deterministic verification gates, and evaluation harnesses.\n• Local vector search, hybrid fuzzy text retrieval, and 100% offline-first deterministic engines (like this chat assistant!).`,
        chips: [
          { id: 'c-vc', label: '✨ /vibecoding', query: '/vibecoding' },
          { id: 'c-auto', label: '⚙️ /automation', query: '/automation' }
        ],
        actions: [
          { type: 'open-case-study', payload: { id: '08' }, label: '🤖 Case Study: Multi-Agent Engine' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/automation':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/automation',
        language: 'en',
        text: `⚙️ **Financial & Operations Automation**\n\n• Automated reconciliation scripts connecting Excel, CSV bank feeds, and GST portal data.\n• Batch PDF report generation, invoice numbering, and statement dispatches.\n• Self-healing multi-agent DAGs executing complex data transformations with zero manual intervention.`,
        chips: [
          { id: 'c-ai', label: '🤖 /ai-tools', query: '/ai-tools' },
          { id: 'c-p8', label: '🚀 Case Study 08', query: '/projects' }
        ],
        actions: [
          { type: 'open-case-study', payload: { id: '08' }, label: '🤖 Case Study: Agent Workflows' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/quote':
    case '/pricing':
      return {
        id: rid,
        intent: 'slash_command',
        command: cmdKey,
        language: 'en',
        text: `💰 **Interactive Quotation & Transparent Fee Estimator**\n\n• **Accounting & Statutory GST**: ₹2,500 – ₹8,000 / month\n• **Income Tax E-Filing (ITR)**: ₹1,500 – ₹5,000 / filing\n• **Tally Prime ERP Setup & BRS**: ₹3,000 – ₹7,500 one-time\n• **MIS Reporting & Custom Excel Pipelines**: ₹5,000 – ₹15,000\n• **AI Full-stack Web Apps & Prototypes**: ₹20,000 – ₹60,000\n\n*Use our interactive estimator to calculate a customized project quote with instant turnaround:*`,
        card: {
          type: 'quotation-estimator'
        },
        chips: [
          { id: 'c-hire', label: '🤝 /hire', query: '/hire' },
          { id: 'c-wa', label: '💬 /whatsapp', query: '/whatsapp' }
        ],
        actions: [
          { type: 'open-estimator', label: '💰 Open Interactive Fee Estimator' },
          { type: 'link', url: 'https://wa.me/917992383804?text=Hi%20Atul,%20I%20would%20like%20a%20service%20quote', label: '💬 WhatsApp Direct Quote' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/hire':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/hire',
        language: 'en',
        text: `🤝 **Hire Atul Verma — Engagement Options**\n\n• **Notice Period & Availability**: Immediate to 15 Days (Full-time Pan-India / Remote).\n• **Corporate Accounting Roles**: Senior Accountant, Tax Manager, Finance Controller, MIS Lead.\n• **Freelance & Consulting**: Monthly GST compliance, tax returns, ERP setup, and Excel/Power BI automation.\n• **Contract AI Engineering**: Prompt-to-SaaS development, agentic workflow automation, and custom web apps.`,
        chips: [
          { id: 'c-res', label: '📄 /resume', query: '/resume' },
          { id: 'c-con', label: '📬 /contact', query: '/contact' }
        ],
        actions: [
          { type: 'download-resume', label: '📄 Download Verified Resume' },
          { type: 'link', url: 'https://wa.me/917992383804?text=Hi%20Atul,%20let%27s%20discuss%20a%20job%20opportunity', label: '💬 Direct WhatsApp Chat' },
          { type: 'link', url: 'mailto:atulverma7992@gmail.com?subject=Job%20Opportunity', label: '✉️ Send Hiring Email' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/contact':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/contact',
        language: 'en',
        text: `📬 **Direct Contact Information — Atul Verma**\n\n• **Phone / WhatsApp**: +91 7992383804 (Fastest response)\n• **Email**: atulverma7992@gmail.com\n• **Location**: Sasaram, Bihar, India (Available for remote & Pan-India relocation)\n• **LinkedIn**: [linkedin.com/in/atul-verma-029ba7145](https://www.linkedin.com/in/atul-verma-029ba7145/)\n• **GitHub**: [github.com/atulverma5](https://github.com/atulverma5)`,
        chips: [
          { id: 'c-wa', label: '💬 /whatsapp', query: '/whatsapp' },
          { id: 'c-em', label: '✉️ /email', query: '/email' },
          { id: 'c-li', label: '🔗 /linkedin', query: '/linkedin' }
        ],
        actions: [
          { type: 'link', url: 'https://wa.me/917992383804?text=Hello%20Atul,%20contacting%20you%20via%20portfolio', label: '💬 WhatsApp Chat' },
          { type: 'link', url: 'mailto:atulverma7992@gmail.com?subject=Portfolio%20Inquiry', label: '✉️ Email Directly' },
          { type: 'link', url: 'https://www.linkedin.com/in/atul-verma-029ba7145/', label: '🔗 LinkedIn Profile' },
          { type: 'link', url: 'https://github.com/atulverma5', label: '🐙 GitHub Profile' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/whatsapp':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/whatsapp',
        language: 'en',
        text: `💬 **WhatsApp Direct Chat**\n\nConnect directly with Atul on WhatsApp (+91 7992383804) for quick queries, project discussions, or tax consultations.`,
        chips: defaultChips,
        actions: [
          { type: 'link', url: 'https://wa.me/917992383804?text=Hi%20Atul,%20I%20am%20reaching%20out%20from%20your%20portfolio', label: '💬 Open WhatsApp' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/email':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/email',
        language: 'en',
        text: `✉️ **Email Communication**\n\nSend a direct message to **atulverma7992@gmail.com**. Responses are typically provided within 12-24 hours.`,
        chips: defaultChips,
        actions: [
          { type: 'link', url: 'mailto:atulverma7992@gmail.com?subject=Portfolio%20Inquiry%20-%20Atul%20Verma', label: '✉️ Compose Email' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/linkedin':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/linkedin',
        language: 'en',
        text: `🔗 **LinkedIn Profile**\n\nView Atul Verma's verified career recommendations, network, and professional updates on LinkedIn.`,
        chips: defaultChips,
        actions: [
          { type: 'link', url: 'https://www.linkedin.com/in/atul-verma-029ba7145/', label: '🔗 Open LinkedIn' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/github':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/github',
        language: 'en',
        text: `🐙 **GitHub Repositories & Code Portfolio**\n\nExplore source code, interactive web applications, and autonomous multi-agent tooling created by Atul Verma.`,
        chips: defaultChips,
        actions: [
          { type: 'link', url: 'https://github.com/atulverma5', label: '🐙 Open GitHub' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/resume':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/resume',
        language: 'en',
        text: `📄 **Download Verified ATS-Optimized Resume**\n\nDownload Atul Verma's comprehensive PDF resume tailored with verified achievements, metrics, and domain skill matrices.`,
        chips: [
          { id: 'c-basic', label: '📄 Basic View', query: '/basic' },
          { id: 'c-exp', label: '💼 /experience', query: '/experience' }
        ],
        actions: [
          { type: 'download-resume', label: '📥 Download ATS Resume (PDF)' },
          { type: 'switch-view-mode', viewMode: 'basic', payload: { viewMode: 'basic' }, label: '📄 Read in Basic PDF View' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/download':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/download',
        language: 'en',
        text: `📥 **Portfolio Downloads & Assets**\n\n• **Verified PDF Resume**: ATS-formatted CV with contact details and verified experience.\n• **Case Study Dossiers**: In-depth architecture overviews and system designs.\n• **Chat Transcript**: Export the current assistant discussion as JSON.`,
        chips: [
          { id: 'c-res', label: '📄 /resume', query: '/resume' },
          { id: 'c-tra', label: '📥 /transcript', query: '/transcript' }
        ],
        actions: [
          { type: 'download-resume', label: '📄 Download Resume (PDF)' },
          { type: 'export-transcript', label: '📥 Export Chat (JSON)' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/faq':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/faq',
        language: 'en',
        text: `❓ **Frequently Asked Questions (FAQ)**\n\n• **Q: How many years of experience does Atul have?**\n  *A: 10+ years across corporate accounting, government MIS operations, and modern AI engineering.*\n• **Q: Where is Atul located?**\n  *A: Sasaram, Bihar, India (Open to Pan-India remote & on-site engagements).*\n• **Q: What is the turnaround time for a project quote?**\n  *A: Instant via our Fee Estimator tool, or within 24 hours on WhatsApp.*\n• **Q: Can Atul handle corporate tax audits?**\n  *A: Yes, with a 100% clean audit compliance record across 500+ filings.*`,
        chips: [
          { id: 'c-quote', label: '💰 /quote', query: '/quote' },
          { id: 'c-skills', label: '⚡ /skills', query: '/skills' }
        ],
        actions: [
          { type: 'open-estimator', label: '💰 Fee Estimator' },
          { type: 'scroll', target: '#faq', payload: { selector: '#faq' }, label: '📍 View All FAQs' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/shortcuts':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/shortcuts',
        language: 'en',
        text: `⌨️ **Keyboard Shortcuts Reference**\n\n• \`Ctrl + K\` or \`Alt + C\`: Toggle AI Chat Assistant dialog\n• \`Escape\`: Minimize or close the chat window from anywhere\n• \`Tab\` / \`Enter\`: Autocomplete slash commands from the popup\n• \`Enter\`: Send your message\n• \`Shift + Enter\`: Insert a new line in input\n• \`←\` / \`→\` arrow keys: Navigate quick suggestion chips\n• \`Drag Header\`: Reposition the chat window anywhere on screen\n• \`Bottom-Right Grip (◢)\`: Resize the assistant window`,
        chips: defaultChips,
        actions: [
          { type: 'toggle-maximize', label: '⛶ Toggle Fullscreen' },
          { type: 'reset-layout', label: '🔄 Reset Layout' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/tips':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/tips',
        language: 'en',
        text: `💡 **Tips for Exploring Atul's Portfolio**\n\n• **For Recruiters**: Switch to the *Recruiter* audience perspective and click \`/resume\` for instant ATS CV.\n• **For Business Owners**: Check out Case Study 01 (GST Engine) and click \`/quote\` to calculate service pricing.\n• **For Developers**: Try switching to \`/terminal\` view mode to browse via interactive CLI terminal.\n• **For Audio Lovers**: Click the speaker icon on any assistant reply for high-quality text-to-speech read-aloud!`,
        chips: [
          { id: 'c-aud', label: '👥 /audience', query: '/audience' },
          { id: 'c-term', label: '💻 /terminal', query: '/terminal' },
          { id: 'c-quote', label: '💰 /quote', query: '/quote' }
        ],
        actions: [
          { type: 'set-audience', audience: 'recruiter', payload: { audience: 'recruiter' }, label: '💼 Recruiter Mode' },
          { type: 'switch-view-mode', viewMode: 'terminal', payload: { viewMode: 'terminal' }, label: '💻 Terminal View' },
          { type: 'open-estimator', label: '💰 Fee Estimator' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/export':
    case '/transcript':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/export',
        language: 'en',
        text: `📥 **Export Conversation Transcript**\n\nYou can download the full conversation transcript securely formatted for your needs. Zero data leaves your device.\n\nChoose an export format below:`,
        chips: [
          { id: 'c-export-md', label: '📄 Markdown (.md)', query: '/export md' },
          { id: 'c-export-json', label: '📊 JSON (.json)', query: '/export json' },
          { id: 'c-export-txt', label: '📝 Text (.txt)', query: '/export txt' },
          { id: 'c-export-html', label: '🌐 HTML Print', query: '/export html' }
        ],
        actions: [
          { type: 'export-transcript-md', label: '📄 Download Markdown (.md)' },
          { type: 'export-transcript-json', label: '📊 Download JSON' },
          { type: 'export-transcript-txt', label: '📝 Download Text (.txt)' },
          { type: 'export-transcript-html', label: '🌐 Download HTML' },
          { type: 'copy-transcript', label: '📋 Copy to Clipboard' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/history':
    case '/sessions':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/history',
        language: 'en',
        text: `🗂️ **Multi-Session Conversation History**\n\nThe assistant stores your last **10 conversation sessions** securely in browser local storage with zero cloud tracking.\n\nYou can switch sessions, archive discussions, or start fresh at any time using the Session Archive Drawer.`,
        chips: [
          { id: 'c-new-session', label: '✨ New Session', query: '/clear' },
          { id: 'c-export-sess', label: '📥 Export Current', query: '/export' },
          { id: 'c-telemetry', label: '📊 View Analytics', query: '/analytics' }
        ],
        actions: [
          { type: 'open-session-drawer', label: '🗂️ Open Session Archive' },
          { type: 'new-session', label: '✨ Start New Session' },
          { type: 'clear-chat', label: '🗑️ Clear Active Chat' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/analytics':
    case '/telemetry':
    case '/benchmark':
      return {
        id: rid,
        intent: 'slash_command',
        command: cmdKey,
        language: 'en',
        text: formatAnalyticsScorecard(),
        card: {
          type: 'hardware-benchmark'
        },
        chips: [
          { id: 'c-model', label: '🤖 /model Switcher', query: '/model' },
          { id: 'c-export', label: '📥 /export Chat', query: '/export' },
          { id: 'c-perf', label: '⚡ /benchmark', query: '/benchmark' }
        ],
        actions: [
          { type: 'benchmark', label: '⚡ Run Hardware Benchmark' },
          { type: 'switch-model-drawer', label: '🤖 Select AI Model' },
          { type: 'export-transcript-json', label: '📥 Export JSON Log' },
          { type: 'reset-telemetry', label: '🔄 Reset Telemetry' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/tour':
    case '/walkthrough': {
      const tourArg = rawQuery.replace(/^\/(?:tour|walkthrough)\s*/i, '').trim().toLowerCase();
      let selectedTourId = null;
      if (tourArg.includes('recruiter') || tourArg.includes('fast')) {
        selectedTourId = 'recruiter-fast-track';
      } else if (tourArg.includes('gst') || tourArg.includes('tax') || tourArg.includes('corporate')) {
        selectedTourId = 'corporate-tax-gst';
      } else if (tourArg.includes('ai') || tourArg.includes('vibe') || tourArg.includes('code') || tourArg.includes('saas')) {
        selectedTourId = 'ai-vibe-coding';
      } else if (tourArg.includes('exec') || tourArg.includes('flash')) {
        selectedTourId = 'executive-flash-tour';
      }

      if (selectedTourId && PORTFOLIO_TOURS[selectedTourId]) {
        const tour = PORTFOLIO_TOURS[selectedTourId];
        return {
          id: rid,
          intent: 'slash_command',
          command: '/tour',
          language: 'en',
          text: `🧭 **Guided Walkthrough: ${tour.title}**\n\n${tour.description}\n\n*Interactive navigation is active. Follow step-by-step guidance below:*`,
          card: {
            type: 'tour-controller',
            tourId: tour.id,
            tourTitle: tour.title
          },
          chips: [
            { id: 'c-tour-recruiter', label: '💼 Recruiter Tour', query: '/tour recruiter' },
            { id: 'c-tour-tax', label: '📊 GST Tour', query: '/tour gst' },
            { id: 'c-tour-ai', label: '⚡ AI Tour', query: '/tour ai' }
          ],
          actions: [
            { type: 'start-tour', tourId: tour.id, label: `🚀 Launch ${tour.title}` },
            { type: 'next-tour-step', label: '➡️ Next Step' },
            { type: 'end-tour', label: '⏹️ End Tour' }
          ],
          confidence: 1.0,
          isRelaxed: false,
          isFallback: false
        };
      }

      return {
        id: rid,
        intent: 'slash_command',
        command: '/tour',
        language: 'en',
        text: `🧭 **Interactive Guided Portfolio Tours**\n\nExperience structured multi-step walkthroughs with smooth scrolling and role-tailored focus:\n\n1. 💼 **Recruiter Fast Track** (4 steps: Bio, Metrics, Case Studies, Resume)\n2. 📊 **Corporate Tax & GST** (4 steps: Tax Domain, GSTR-2B, ERP Ledgers, Audit Quote)\n3. ⚡ **AI Vibe Coding & SaaS** (4 steps: AI SaaS Engine, Tech Stack, Physics Lab, Hire)\n4. 👔 **Executive Flash Tour** (3 steps: Career Milestones, Live Demos, Get In Touch)\n\n*Select a tour below to begin:*`,
        card: {
          type: 'tour-controller',
          tourId: 'recruiter-fast-track',
          tourTitle: 'Recruiter Fast Track'
        },
        chips: [
          { id: 'c-tour-recruiter', label: '💼 Recruiter Tour', query: '/tour recruiter' },
          { id: 'c-tour-tax', label: '📊 GST & Tax Tour', query: '/tour gst' },
          { id: 'c-tour-ai', label: '⚡ AI Vibe Tour', query: '/tour ai' },
          { id: 'c-tour-exec', label: '👔 Executive Tour', query: '/tour executive' }
        ],
        actions: [
          { type: 'start-tour', tourId: 'recruiter-fast-track', label: '💼 Recruiter Tour' },
          { type: 'start-tour', tourId: 'corporate-tax-gst', label: '📊 GST & Tax Tour' },
          { type: 'start-tour', tourId: 'ai-vibe-coding', label: '⚡ AI Vibe Tour' },
          { type: 'start-tour', tourId: 'executive-flash-tour', label: '👔 Executive Tour' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };
    }

    case '/search':
    case '/find': {
      const searchTerm = rawQuery.replace(/^\/(?:search|find)\s*/i, '').trim();
      if (searchTerm) {
        const results = searchPortfolio(searchTerm, { limit: 5 });
        const summaryText = results.length > 0
          ? `🔍 **Search Results for "${searchTerm}"**\n\nFound **${results.length}** matching items across Case Studies, Skills, Actions, and FAQs:`
          : `🔍 **Search Results for "${searchTerm}"**\n\nNo exact matches found. Try keywords like \`gst\`, \`tally\`, \`react\`, \`excel\`, or \`resume\`.`;

        return {
          id: rid,
          intent: 'slash_command',
          command: '/search',
          language: 'en',
          text: summaryText,
          card: {
            type: 'search-results',
            query: searchTerm,
            results
          },
          chips: [
            { id: 'c-s-gst', label: '🔍 /search gst', query: '/search gst' },
            { id: 'c-s-tally', label: '🔍 /search tally', query: '/search tally' },
            { id: 'c-s-ai', label: '🔍 /search ai', query: '/search ai' }
          ],
          actions: results.length > 0
            ? results.slice(0, 3).map(r => r.action || { type: 'scroll', target: r.targetId, label: r.title })
            : [
                { type: 'scroll', target: '#projects', payload: { selector: '#projects' }, label: '🚀 Explore Case Studies' },
                { type: 'scroll', target: '#skills', payload: { selector: '#skills' }, label: '⚡ View Skills' }
              ],
          confidence: 1.0,
          isRelaxed: false,
          isFallback: false
        };
      }

      return {
        id: rid,
        intent: 'slash_command',
        command: '/search',
        language: 'en',
        text: `🔍 **Semantic Portfolio Search**\n\nSearch any technology, case study, statutory regulation, or capability. Type \`/search <keyword>\` or click a quick search topic below:`,
        chips: [
          { id: 'c-s-gst', label: '🔍 GST Engine', query: '/search gst' },
          { id: 'c-s-tally', label: '🔍 Tally Prime', query: '/search tally' },
          { id: 'c-s-powerbi', label: '🔍 Power BI', query: '/search power bi' },
          { id: 'c-s-react', label: '🔍 React & AI', query: '/search react' }
        ],
        actions: [
          { type: 'scroll', target: '#projects', payload: { selector: '#projects' }, label: '🚀 Browse All Projects' },
          { type: 'scroll', target: '#skills', payload: { selector: '#skills' }, label: '⚡ Skills Matrix' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };
    }

    case '/engineer':
    case '/prompt':
    case '/metaprompt': {
      const promptResult = generateMetaPrompt(rawQuery, context);
      return {
        id: rid,
        intent: 'slash_command',
        command: cmdKey,
        language: 'en',
        text: promptResult.summaryText,
        card: {
          type: 'meta-prompt',
          isStudioGuide: promptResult.isStudioGuide,
          task: promptResult.task,
          title: promptResult.title,
          domain: promptResult.domain,
          roleTitle: promptResult.roleTitle,
          shortCommand: promptResult.shortCommand,
          metaPrompt: promptResult.metaPrompt,
          suggestions: promptResult.suggestions,
          templates: promptResult.templates
        },
        chips: promptResult.isStudioGuide ? [
          { id: 'c-gst', label: '📊 GST Recon Prompt', query: '/engineer GST 2B vs purchase register reconciliation in python' },
          { id: 'c-react', label: '⚛️ React 19 UI Prompt', query: '/engineer Accessible virtualized table in React 19 with Tailwind' },
          { id: 'c-agent', label: '🤖 Multi-Agent DAG Prompt', query: '/engineer Multi-agent workflow planner with Claude Code' },
          { id: 'c-mis', label: '📉 MIS Power Query Prompt', query: '/engineer Power Query M-code for multi-district portal CSVs' }
        ] : [
          { id: 'c-copy-cmd', label: '📋 Copy Command', query: '/copy-command' },
          { id: 'c-copy-prompt', label: '🎯 Copy Meta-Prompt', query: '/copy-prompt' },
          { id: 'c-studio', label: '⚡ Prompt Studio', query: '/engineer' },
          { id: 'c-help', label: '🧭 /help', query: '/help' }
        ],
        actions: [
          { type: 'copy-command', payload: { command: promptResult.shortCommand }, label: '⚡ Copy Command' },
          { type: 'copy-metaprompt', payload: { prompt: promptResult.metaPrompt }, label: '🎯 Copy Meta-Prompt' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };
    }

    case '/grill-me': {
      const grillArg = rawQuery.replace(/^\/grill-me\s*/i, '').trim().toLowerCase();

      // Track 1: System Design & Real-Time On-Device AI
      if (grillArg.includes('system') || grillArg.includes('arch') || grillArg.includes('webgpu')) {
        return {
          id: rid,
          intent: 'slash_command',
          command: '/grill-me',
          language: 'en',
          text: `🔥 **Architectural Grill: Real-Time On-Device AI & 60FPS Micro-Frontends**\n\n` +
            `**Problem Statement:**\n` +
            `You are building a client-side AI application running quantized transformer LLMs (WebGPU/WASM) alongside a 60fps cursor-tracking 3D physics canvas.\n\n` +
            `**Hard Constraints:**\n` +
            `1. **Frame Budget:** Main thread execution slice strictly < 16.6ms to prevent 60fps frame drops.\n` +
            `2. **Memory Cap:** Low-tier mobile browsers enforce a strict ~1.2GB heap threshold before killing the tab with \`Out of Memory\`.\n` +
            `3. **Asynchronous Concurrency:** LLM token generation must stream continuously without freezing user input, tactile gestures, or audio dubbing.\n\n` +
            `**Probing Drill Questions:**\n` +
            `• *How do you isolate heavy tensor operations off the UI thread without incurring expensive serialization/deserialization penalties across Web Worker postMessage boundaries?*\n` +
            `• *When a WebGPU \`device_lost\` event triggers mid-generation due to GPU driver resets, what exact deterministic recovery ladder do you execute to avoid crash loops?*\n` +
            `• *How does your architecture budget memory between model weights, KV caches, and audio waveform FFT buffers?*`,
          chips: [
            { id: 'c-g-sol-sys', label: '💡 WebGPU Blueprint', query: 'Explain Atul\'s WebGPU and Web Worker architecture with heartbeat watchdog' },
            { id: 'c-g-gst', label: '📊 /grill-me gst', query: '/grill-me gst' },
            { id: 'c-g-ai', label: '🤖 /grill-me ai', query: '/grill-me ai' },
            { id: 'c-g-all', label: '🔥 All Grill Tracks', query: '/grill-me' }
          ],
          actions: [
            { type: 'scroll', target: '#projects', payload: { selector: '#projects' }, label: '🚀 Inspect Project 9 (AI Architecture)' }
          ],
          confidence: 1.0,
          isRelaxed: false,
          isFallback: false
        };
      }

      // Track 2: High-Volume Statutory GST Reconciliation Engine
      if (grillArg.includes('gst') || grillArg.includes('tax') || grillArg.includes('fintech') || grillArg.includes('recon')) {
        return {
          id: rid,
          intent: 'slash_command',
          command: '/grill-me',
          language: 'en',
          text: `🔥 **Architectural Grill: 500k+ Monthly Invoice Statutory GST Reconciliation Engine**\n\n` +
            `**Problem Statement:**\n` +
            `Design a resilient data pipeline that reconciles 500,000+ monthly GSTR-2B government invoices with purchase ledgers across multi-state GSTINs under Indian statutory compliance.\n\n` +
            `**Hard Constraints:**\n` +
            `1. **Statutory Precision:** Zero tolerated deviation in ITC eligibility (Section 16(2)(aa) & Rule 36(4)). Sub-penny rounding edge cases.\n` +
            `2. **Fuzzy Invariants:** Asymmetric invoice number formatting (e.g., \`INV/2024-25/001\` vs \`INV-1\` vs \`001\`) with multi-pass matching.\n` +
            `3. **Audit Trail:** Every auto-matched or flagged ITC claim must have 100% deterministic cryptographic hash traceability for GST statutory audit defense.\n\n` +
            `**Probing Drill Questions:**\n` +
            `• *How do you structure your composite key matching algorithm to prevent false positives when vendors submit amended credit notes (CDN) in later tax periods?*\n` +
            `• *How do you handle retroactive vendor cancellation notices without invalidating historical ledger periods?*\n` +
            `• *What data structures ensure sub-second search and diffing over half a million line-items directly in memory or indexed stores?*`,
          chips: [
            { id: 'c-g-sol-gst', label: '💡 2B Recon Solution', query: 'Explain Atul\'s GSTR-2B reconciliation engine algorithm with ₹2.5Cr+ ITC optimization' },
            { id: 'c-g-sys', label: '🏛️ /grill-me system', query: '/grill-me system' },
            { id: 'c-g-ai', label: '🤖 /grill-me ai', query: '/grill-me ai' },
            { id: 'c-g-all', label: '🔥 All Grill Tracks', query: '/grill-me' }
          ],
          actions: [
            { type: 'scroll', target: '#projects', payload: { selector: '#projects' }, label: '🚀 Inspect Project 1 (GST Automation)' }
          ],
          confidence: 1.0,
          isRelaxed: false,
          isFallback: false
        };
      }

      // Track 3: Autonomous Multi-Agent Orchestration & Tool Calling Resilience
      if (grillArg.includes('ai') || grillArg.includes('agent') || grillArg.includes('llm') || grillArg.includes('mcp')) {
        return {
          id: rid,
          intent: 'slash_command',
          command: '/grill-me',
          language: 'en',
          text: `🔥 **Architectural Grill: Autonomous Multi-Agent Orchestration & Tool Calling Resilience**\n\n` +
            `**Problem Statement:**\n` +
            `Architect a multi-agent system (using Claude Code / Google Antigravity SDK / MCP servers) executing multi-step autonomous tasks (file mutations, shell execution, testing) with strict reliability guarantees.\n\n` +
            `**Hard Constraints:**\n` +
            `1. **Loop Prevention:** Agents must never enter infinite tool-calling or hallucination retry cycles.\n` +
            `2. **State Hygiene:** Subagents running in parallel must not produce race conditions on shared filesystem or git index state.\n` +
            `3. **Fallback SLA:** If remote LLM providers experience outages or 429 rate limits, system must failover to deterministic on-device engines in < 50ms.\n\n` +
            `**Probing Drill Questions:**\n` +
            `• *How do you implement progressive confidence scoring and monotonic execution session IDs to detect stale subagent responses?*\n` +
            `• *What schema validation and guardrail checks protect destructive operations (rm, git reset, ledger overwrites) from prompt injection?*\n` +
            `• *How do you coordinate reactive wakeup without wasteful polling loops across background worker tasks?*`,
          chips: [
            { id: 'c-g-sol-ai', label: '💡 Multi-Agent Engine', query: 'Explain Atul\'s multi-agent Claude Code and Antigravity framework design' },
            { id: 'c-g-perf', label: '⚡ /grill-me perf', query: '/grill-me perf' },
            { id: 'c-g-sys', label: '🏛️ /grill-me system', query: '/grill-me system' },
            { id: 'c-g-all', label: '🔥 All Grill Tracks', query: '/grill-me' }
          ],
          actions: [
            { type: 'scroll', target: '#skills', payload: { selector: '#skills' }, label: '⚡ View AI Skills Matrix' }
          ],
          confidence: 1.0,
          isRelaxed: false,
          isFallback: false
        };
      }

      // Track 4: 60FPS Web Performance, Virtualization & Bundle Budgeting
      if (grillArg.includes('perf') || grillArg.includes('performance') || grillArg.includes('speed') || grillArg.includes('bundle')) {
        return {
          id: rid,
          intent: 'slash_command',
          command: '/grill-me',
          language: 'en',
          text: `🔥 **Architectural Grill: 60FPS Web Performance, Virtualization & Bundle Budgeting**\n\n` +
            `**Problem Statement:**\n` +
            `Deliver a rich interactive portfolio with 3D cursor tracking, live audio waveforms, local AI inference, and 100+ case studies while achieving 100/100 Lighthouse performance on low-end 4G mobile devices.\n\n` +
            `**Hard Constraints:**\n` +
            `1. **LCP & FCP:** First Contentful Paint < 0.8s, Largest Contentful Paint < 1.5s.\n` +
            `2. **CLS:** Cumulative Layout Shift strictly 0.000.\n` +
            `3. **Bundle Overhead:** Critical JS payload < 65KB gzipped on initial route load.\n\n` +
            `**Probing Drill Questions:**\n` +
            `• *How do you decouple heavy WebGL / Canvas physics loops from React component re-renders to ensure steady 60FPS?*\n` +
            `• *How is dynamic code splitting configured so on-device neural weights, audio synthesizers, and PDF renderers load strictly on demand?*\n` +
            `• *What layout isolation, CSS \`content-visibility: auto\`, and virtualization strategies prevent DOM bloat over 4,000+ nodes?*`,
          chips: [
            { id: 'c-g-sol-perf', label: '💡 60FPS Blueprint', query: 'Explain how Atul achieves 60fps and zero CLS with React 19 and Tailwind v4' },
            { id: 'c-g-sys', label: '🏛️ /grill-me system', query: '/grill-me system' },
            { id: 'c-g-gst', label: '📊 /grill-me gst', query: '/grill-me gst' },
            { id: 'c-g-all', label: '🔥 All Grill Tracks', query: '/grill-me' }
          ],
          confidence: 1.0,
          isRelaxed: false,
          isFallback: false
        };
      }

      // Track 5: Solutions & Blueprints
      if (grillArg.includes('solution') || grillArg.includes('answer') || grillArg.includes('blueprint')) {
        return {
          id: rid,
          intent: 'slash_command',
          command: '/grill-me',
          language: 'en',
          text: `💡 **Atul Verma's Architectural Blueprints & Production Solutions**\n\n` +
            `Here are the battle-tested patterns Atul has implemented across production systems:\n\n` +
            `1. **Dual-Tier AI Architecture (Offline-First + WebGPU)**:\n` +
            `   • *Primary:* Dedicated Web Worker running Transformers.js with WebGPU quantized models (Q4/FP16).\n` +
            `   • *Watchdog Heartbeat:* 20s stall monitor with monotonic session IDs; auto-downgrades to WASM or instant deterministic knowledge engine on failure.\n` +
            `   • *Zero Latency:* 100% offline keyword & semantic router answers queries in < 15ms while background models compile.\n\n` +
            `2. **High-Scale GST & Financial Reconciliation Engine**:\n` +
            `   • 4-stage fuzzy matching algorithm (Exact GSTIN+Inv# ➔ Fuzzy Date/Amount within ±₹1 tolerance ➔ Multi-line aggregation ➔ Credit note adjustment).\n` +
            `   • Result: ₹2.5Cr+ reconciled ITC claims, zero audit disallowances over 500+ filings.\n\n` +
            `3. **Autonomous Agent Harness**:\n` +
            `   • Declarative task planning with MCP tool safety invariants, dry-run previews, and single-source git commit traceability.\n\n` +
            `4. **60FPS UI & Zero CLS**:\n` +
            `   • React 19 concurrent features, offscreen canvas rendering, virtualized prompt/command palettes, and Tailwind v4 zero-runtime stylesheets.`,
          chips: [
            { id: 'c-g-sys', label: '🏛️ /grill-me system', query: '/grill-me system' },
            { id: 'c-g-gst', label: '📊 /grill-me gst', query: '/grill-me gst' },
            { id: 'c-g-ai', label: '🤖 /grill-me ai', query: '/grill-me ai' },
            { id: 'c-engineer', label: '⚡ /engineer', query: '/engineer' }
          ],
          confidence: 1.0,
          isRelaxed: false,
          isFallback: false
        };
      }

      // Default Grill Overview Menu
      return {
        id: rid,
        intent: 'slash_command',
        command: '/grill-me',
        language: 'en',
        text: `🔥 **Architectural & System Design Grill Session — Interview Mode Active**\n\n` +
          `Welcome to the **Deep-Dive Engineering & Architectural Grill Session**! Choose your challenge track to test production-grade system design, concurrency constraints, statutory compliance algorithms, and multi-agent workflows:\n\n` +
          `• 🏛️ **Track 1: Real-Time On-Device AI & 60FPS Micro-Frontends**\n` +
          `  *WebGPU vs WASM fallbacks, watchdog heartbeats, worker memory budgets, and 60fps render pipelines.*\n\n` +
          `• 📊 **Track 2: High-Volume Statutory GST Reconciliation Engine**\n` +
          `  *500k+ monthly invoices, fuzzy multi-pass matching, ₹2.5Cr+ ITC optimization, and zero-deviation audit trails.*\n\n` +
          `• 🤖 **Track 3: Autonomous Multi-Agent Orchestration & Tool Calling Resilience**\n` +
          `  *Claude Code & Antigravity MCP workflows, cycle prevention, guardrails, and deterministic fallbacks.*\n\n` +
          `• ⚡ **Track 4: 60FPS Web Performance, Virtualization & Bundle Budgeting**\n` +
          `  *Zero CLS, sub-16ms main thread budgets, and aggressive code splitting on mobile devices.*\n\n` +
          `👉 *Select a track below or type \`/grill-me <track>\` (e.g. \`/grill-me system\`, \`/grill-me gst\`, \`/grill-me ai\`, \`/grill-me perf\`) to begin grilling!*`,
        chips: [
          { id: 'c-g-sys', label: '🏛️ /grill-me system', query: '/grill-me system' },
          { id: 'c-g-gst', label: '📊 /grill-me gst', query: '/grill-me gst' },
          { id: 'c-g-ai', label: '🤖 /grill-me ai', query: '/grill-me ai' },
          { id: 'c-g-perf', label: '⚡ /grill-me perf', query: '/grill-me perf' },
          { id: 'c-g-sol', label: '💡 Solutions & Blueprints', query: '/grill-me solution' },
          { id: 'c-help', label: '🧭 /help', query: '/help' }
        ],
        decisionTree: {
          step: 'grill_mode',
          title: '🔥 Select Architectural Grill Track:',
          options: [
            { id: 'grill_sys', label: '🏛️ Track 1: 60FPS On-Device AI Pipeline', query: '/grill-me system' },
            { id: 'grill_gst', label: '📊 Track 2: 500k Invoice GST Reconciliation Engine', query: '/grill-me gst' },
            { id: 'grill_ai', label: '🤖 Track 3: Multi-Agent DAG & Tool Calling Resilience', query: '/grill-me ai' },
            { id: 'grill_perf', label: '⚡ Track 4: Web Performance, Memory & WASM Fallbacks', query: '/grill-me perf' },
            { id: 'grill_sol', label: '💡 View Atul\'s Architectural Solutions & Blueprints', query: '/grill-me solution' }
          ]
        },
        actions: [
          { type: 'scroll', target: '#projects', payload: { selector: '#projects' }, label: '🚀 Explore Case Studies' },
          { type: 'scroll', target: '#skills', payload: { selector: '#skills' }, label: '⚡ View Skills Matrix' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };
    }

    case '/voice':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/voice',
        language: 'en',
        text: `🎙️ **Atul AI Voice Agent & Waveform Visualizer**\n\n` +
          `• **Natural SpeechDub**: Neural multilingual speech synthesis supporting Indian English, Hindi, and US English.\n` +
          `• **Chrome Keep-Alive Watchdog**: Eliminates Chromium's 14-second audio garbage collection freeze.\n` +
          `• **Interactive Sine Waveform**: Real-time multi-harmonic procedural audio visualizer with reduced-motion fallback.\n` +
          `• **Hands-Free Mode**: Automatically speaks responses as they stream in without manual clicks.\n\n` +
          `Try saying or typing commands like *"speak response"*, *"voice settings"*, or click below:`,
        chips: [
          { id: 'c-v-speak', label: '🔊 /speak', query: '/speak' },
          { id: 'c-v-settings', label: '⚙️ /voicesettings', query: '/voicesettings' },
          { id: 'c-v-hi', label: '🇮🇳 Hindi Voice', query: '/voice hindi' },
          { id: 'c-help', label: '🧭 /help', query: '/help' }
        ],
        actions: [
          { type: 'open-voice-settings', label: '⚙️ Voice Settings' },
          { type: 'speak-last', label: '🔊 Read Aloud Last Response' },
          { type: 'toggle-auto-speak', label: '🎙️ Toggle Auto-Speak' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/speak':
    case '/read':
    case '/readaloud': {
      const speakText = rawQuery.replace(/^\/(?:speak|read|readaloud)\s*/i, '').trim();
      return {
        id: rid,
        intent: 'slash_command',
        command: '/speak',
        language: 'en',
        text: speakText
          ? `🔊 **Dubbing Text**: "${speakText.length > 80 ? speakText.slice(0, 80) + '...' : speakText}"\n\nStarting speech synthesis with live audio waveform...`
          : `🔊 **Text-to-Speech Engine Ready**\n\nClick below to read aloud the last response, or type \`/speak <your text>\` to vocalize custom text:`,
        chips: [
          { id: 'c-v-settings', label: '⚙️ Voice Settings', query: '/voicesettings' },
          { id: 'c-v-voice', label: '🎙️ /voice', query: '/voice' },
          { id: 'c-help', label: '🧭 /help', query: '/help' }
        ],
        actions: [
          { type: 'speak-last', payload: { customText: speakText }, label: speakText ? '🔊 Vocalize Now' : '🔊 Read Aloud Last Response' },
          { type: 'open-voice-settings', label: '⚙️ Configure Speed / Voice' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };
    }

    case '/voicesettings':
    case '/voiceconfig':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/voicesettings',
        language: 'en',
        text: `⚙️ **Voice Synthesis & Dubbing Settings**\n\n` +
          `• **Playback Speed**: 0.8x (Deliberate), 1.0x (Normal), 1.2x (Brisk), 1.5x (Fast)\n` +
          `• **Pitch Modulator**: 0.8 to 1.2 (Natural frequency tone)\n` +
          `• **Voice Profiles**: Auto (Devanagari / English auto-detect), en-IN (Indian English), hi-IN (Hindi), en-US (US English)\n` +
          `• **Hands-Free Auto-Speak**: Automatically narrates incoming responses\n\n` +
          `Open the voice settings panel or select a quick preset below:`,
        chips: [
          { id: 'c-vs-1x', label: '⚡ Normal Speed (1.0x)', query: '/voice rate 1.0' },
          { id: 'c-vs-12x', label: '🚀 Brisk Speed (1.2x)', query: '/voice rate 1.2' },
          { id: 'c-vs-auto', label: '🎙️ Toggle Auto-Speak', query: '/voice autospeak' },
          { id: 'c-v-voice', label: '🎙️ Voice Overview', query: '/voice' }
        ],
        actions: [
          { type: 'open-voice-settings', label: '⚙️ Open Voice Settings Modal' },
          { type: 'toggle-auto-speak', label: '🎙️ Toggle Hands-Free Auto-Speak' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    case '/tools':
    case '/tech':
    case '/stack':
      return {
        id: rid,
        intent: 'slash_command',
        command: '/tools',
        language: 'en',
        text: `🛠️ **Tools & Technology Stack Matrix**\n\n• **Accounting & ERP**: Tally Prime, Tally.ERP 9, Busy, Marg ERP, BRS automation.\n• **Statutory Tax Portals**: GST Portal, Income Tax E-Filing, TRACES (TDS), Challan 280/281, Form 26AS, AIS/TIS.\n• **Data & Analytics**: Advanced Excel (VBA / Macros / Power Query), Power BI (DAX), Google Sheets API.\n• **Modern AI & Frontend**: React 19, Tailwind CSS v4, Vite, Transformers.js (WebGPU/WASM), Claude Code, MCP Servers.\n• **Government MIS**: DAY-NULM Portal, Skill India Biometric MIS, UIDAI Smart Card SDK.`,
        chips: [
          { id: 'c-skills', label: '⚡ /skills', query: '/skills' },
          { id: 'c-ai-tools', label: '🤖 /ai-tools', query: '/ai-tools' },
          { id: 'c-tally', label: '📊 /tally', query: '/tally' }
        ],
        actions: [
          { type: 'scroll', target: '#skills', payload: { selector: '#skills' }, label: '⚡ View Skills Matrix' },
          { type: 'scroll', target: '#projects', payload: { selector: '#projects' }, label: '🚀 View Project Stacks' }
        ],
        confidence: 1.0,
        isRelaxed: false,
        isFallback: false
      };

    default:
      return {
        id: rid,
        intent: 'slash_command',
        command: cmdKey,
        language: 'en',
        text: `❓ **Unknown Command: \`${cmdKey}\`**\n\nType \`/help\` to browse all **40+ available slash commands**, or explore the quick shortcuts below:`,
        chips: defaultChips,
        actions: [
          { type: 'scroll', target: '#projects', payload: { selector: '#projects' }, label: '🚀 View Projects' },
          { type: 'download-resume', label: '📄 Download Resume' }
        ],
        confidence: 0.9,
        isRelaxed: false,
        isFallback: false
      };
  }
}
