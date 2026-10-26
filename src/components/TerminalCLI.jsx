import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Terminal,
  X,
  Minus,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Tv,
  CornerDownLeft,
  Sparkles,
  ExternalLink,
  Flame,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FolderGit2,
  Cpu,
  Mail,
  FileText,
  Monitor,
  Palette,
  Type,
  RotateCcw,
  CloudRain,
  MessageSquare
} from 'lucide-react';
import { soundFX } from '../utils/audio.js';
import { CURSOR_LIST } from '../utils/cursorConstants.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { useRoleTab, ROLE_DATA } from '../context/RoleContext.jsx';

const SUGGESTION_CHIPS = [
  { label: 'help', desc: 'All commands', icon: HelpCircle },
  { label: 'neofetch', desc: 'System info art', icon: Cpu },
  { label: 'os win', desc: 'Windows look', icon: Monitor },
  { label: 'os mac', desc: 'macOS look', icon: Monitor },
  { label: 'os linux', desc: 'Linux look', icon: Monitor },
  { label: 'color cyan', desc: 'Cyberpunk cyan', icon: Palette },
  { label: 'ls', desc: 'List files', icon: FolderGit2 },
  { label: 'cat about.md', desc: 'Read bio file', icon: FileText },
  { label: 'weather', desc: 'Medininagar forecast', icon: Sparkles },
  { label: 'cowsay hire atul', desc: 'Talking cow', icon: MessageSquare },
  { label: 'fortune', desc: 'Tech quote', icon: Sparkles },
  { label: 'confetti', desc: 'Confetti burst', icon: Flame },
  { label: 'about', desc: 'Origin & bio', icon: Sparkles },
  { label: 'skills', desc: 'Technical matrix', icon: Cpu },
  { label: 'projects', desc: 'Featured works', icon: FolderGit2 },
  { label: 'matrix', desc: 'Digital rain', icon: Terminal },
  { label: 'resume', desc: 'Download PDF', icon: FileText },
  { label: 'sudo hire', desc: 'Hire protocol', icon: CheckCircle2 }
];

const AUTOCOMPLETE_LIST = [
  'help',
  'about',
  'whoami',
  'skills',
  'projects',
  'contact',
  'resume',
  'os',
  'os mac',
  'os win',
  'os linux',
  'style',
  'theme-os',
  'color',
  'color matrix',
  'color amber',
  'color cyan',
  'color pink',
  'color synthwave',
  'color white',
  'color red',
  'color purple',
  'bgcolor',
  'bgcolor obsidian',
  'bgcolor navy',
  'bgcolor aubergine',
  'bgcolor matrix-black',
  'bgcolor slate',
  'bgcolor cyber-purple',
  'bgcolor pure-black',
  'bgcolor default',
  'bg',
  'background',
  'color-bg',
  'opacity',
  'opacity solid',
  'opacity default',
  'opacity glass',
  'opacity semi',
  'transparent',
  'transparency',
  'glass',
  'font-size',
  'font-size small',
  'font-size medium',
  'font-size large',
  'font-size xl',
  'zoom in',
  'zoom out',
  'zoom reset',
  'font-family mono',
  'font-family pixel',
  'font-family retro',
  'font-family fira',
  'font-family matrix',
  'reset',
  'reset all',
  'neofetch',
  'fastfetch',
  'ls',
  'cat',
  'cat about.md',
  'cat skills.json',
  'cat projects.ts',
  'cat resume.pdf',
  'cat contact.sh',
  'cat secrets.env',
  'pwd',
  'git',
  'git log',
  'ping',
  'ping google.com',
  'history',
  'cowsay',
  'fortune',
  'confetti',
  'weather',
  'cursor',
  'cursor laser',
  'cursor butterfly',
  'cursor matrix',
  'cursor circuit',
  'cursor synthwave',
  'cursor list',
  'theme dark',
  'theme light',
  'theme toggle',
  'matrix',
  'maximize',
  'max',
  'fullscreen',
  'fs',
  'minimize',
  'min',
  'restore',
  'size small',
  'size medium',
  'size large',
  'size default',
  'resize sm',
  'resize md',
  'resize lg',
  'resize default',
  'sudo hire',
  'sudo rm -rf /',
  'clear',
  'crt',
  'sound',
  'date',
  'exit'
];

const COLOR_PRESETS = {
  matrix: { name: 'Matrix Green', hex: '#10b981' },
  amber: { name: 'Retro Amber', hex: '#f59e0b' },
  cyan: { name: 'Cyberpunk Cyan', hex: '#06b6d4' },
  pink: { name: 'Synthwave Pink', hex: '#ec4899' },
  synthwave: { name: 'Synthwave Pink', hex: '#ec4899' },
  white: { name: 'Pure White', hex: '#f8fafc' },
  red: { name: 'Hacker Red', hex: '#ef4444' },
  purple: { name: 'Deep Purple', hex: '#a855f7' }
};

const DEFAULT_OS_BG = {
  mac: '#0A0F18',
  win: '#012456',
  linux: '#2c001e'
};

const BG_COLOR_PRESETS = {
  obsidian: { name: 'Obsidian Mac', hex: '#0a0f18' },
  mac: { name: 'Obsidian Mac', hex: '#0a0f18' },
  navy: { name: 'PowerShell Navy', hex: '#012456' },
  powershell: { name: 'PowerShell Navy', hex: '#012456' },
  win: { name: 'PowerShell Navy', hex: '#012456' },
  aubergine: { name: 'Ubuntu Aubergine', hex: '#2c001e' },
  ubuntu: { name: 'Ubuntu Aubergine', hex: '#2c001e' },
  linux: { name: 'Ubuntu Aubergine', hex: '#2c001e' },
  'matrix-black': { name: 'Matrix Black', hex: '#081208' },
  matrix: { name: 'Matrix Black', hex: '#081208' },
  slate: { name: 'Deep Slate', hex: '#0f172a' },
  'cyber-purple': { name: 'Cyber Purple', hex: '#180828' },
  purple: { name: 'Cyber Purple', hex: '#180828' },
  'pure-black': { name: 'Pure Pitch Black', hex: '#000000' },
  black: { name: 'Pure Pitch Black', hex: '#000000' }
};

const OPACITY_PRESETS = {
  solid: 1.0,
  default: 0.95,
  glass: 0.85,
  semi: 0.70
};

const hexToRgba = (hex, alpha = 1) => {
  if (!hex) return `rgba(10, 15, 24, ${alpha})`;
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (clean.length !== 6) return `rgba(10, 15, 24, ${alpha})`;
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const FONT_SIZE_PRESETS = {
  sm: 11,
  small: 11,
  md: 13,
  medium: 13,
  lg: 16,
  large: 16,
  xl: 18
};

const FONT_FAMILIES = {
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  pixel: '"Courier New", Courier, monospace',
  retro: '"Courier New", Courier, monospace',
  fira: '"Fira Code", "Cascadia Code", Consolas, monospace',
  matrix: '"Lucida Console", Monaco, monospace'
};

const SIZE_PRESETS = {
  sm: { width: 520, height: 360, label: 'Small' },
  small: { width: 520, height: 360, label: 'Small' },
  md: { width: 720, height: 480, label: 'Medium' },
  medium: { width: 720, height: 480, label: 'Medium' },
  lg: { width: 960, height: 620, label: 'Large' },
  large: { width: 960, height: 620, label: 'Large' },
  default: { width: 720, height: 480, label: 'Default' }
};

const VIRTUAL_FILES = {
  'about.md': `# Atul Verma
Executive Profile & Technical Summary
----------------------------------------
Identity   : Financial & Operations Executive & AI Engineer
Location   : Medininagar (Daltonganj), Jharkhand, India
Focus      : Statutory Accounting, GST Audit, Corporate MIS,
             Full-Stack Engineering & Autonomous AI Agents
Philosophy : Data integrity, zero-latency workflows, and
             high-performance user experiences.

Bridging commercial finance governance and AI-augmented software synthesis.`,

  'skills.json': `{
  "statutory_accounting": {
    "tally_prime_erp": "98% (Multi-Company Ledger)",
    "gst_compliance": "96% (GSTR-1, 2B, 3B, 9C)",
    "income_tax_efiling": "94% (ITR-1 to 6 & Compliance)",
    "financial_auditing": "95% (Internal Controls & GL)"
  },
  "enterprise_mis": {
    "advanced_excel": "97% (VBA, Power Query, Financial Models)",
    "day_nulm_mis": "96% (Skill India Portal & Biometrics)",
    "cross_district_ops": "94% (Smart Card Logistics)",
    "office_administration": "94% (Commercial Systems)"
  },
  "ai_engineering": {
    "react_19_vite_tailwind": "92% (High-Speed Interfaces)",
    "ai_prompt_agents": "95% (Claude 3.5, Cursor AI, Autonomous Agents)",
    "nextjs_supabase_engine": "88% (PostgreSQL, Vector APIs)"
  }
}`,

  'projects.ts': `// Featured Production Systems & Enterprise Portals
export interface PortfolioProject {
  id: string;
  title: string;
  track: string;
  desc: string;
}

export const FEATURED_PROJECTS: PortfolioProject[] = [
  {
    id: "powerbi-fiscal",
    title: "Executive Power BI Fiscal Intelligence & Reconciliation Engine",
    track: "Corporate Controller & BI Analytics",
    desc: "Unified multi-entity accounting ledgers, bank feeds & GST pipelines."
  },
  {
    id: "fin-controls",
    title: "Corporate Financial Controls & Internal Audit Governance",
    track: "Statutory Strategy & Governance",
    desc: "Automated GSTR-2B matching, advance tax forecasting & audit trails."
  },
  {
    id: "day-nulm-mis",
    title: "DAY-NULM Skill India MIS Reporting Portal",
    track: "Govt Operations & Citizen Analytics",
    desc: "Centralized trainee tracking, biometric logs & statutory reporting."
  },
  {
    id: "smart-card",
    title: "Multi-District Smart Card Operations & Enrollment Engine",
    track: "Field Operations & Biometrics",
    desc: "4-district rollout in Bihar & Jharkhand with biometric sync."
  },
  {
    id: "ai-generator",
    title: "AI Prompt-to-Fullstack SaaS Generator",
    track: "Autonomous AI & Prototyping",
    desc: "Natural language synthesis to Next.js + Tailwind + Supabase."
  }
];`,

  'resume.pdf': `[Binary File: Adobe PDF Document (184 KB)]
Filename    : Atul_Verma_Executive_Resume.pdf
Author      : Atul Verma
Type        : Multi-Disciplinary Career Portfolio
Status      : Verified & Print-Ready

Triggering browser download / document tab view...`,

  'contact.sh': `#!/usr/bin/env bash
# Quick Outreach Dispatcher for Atul Verma

EMAIL="Atulravi2015@gmail.com"
WHATSAPP="+91 79035 12399"
LOCATION="Medininagar (Daltonganj), Jharkhand, India"
LINKEDIN="https://www.linkedin.com (Atul Verma)"
GITHUB="https://github.com"

echo "📧 Direct Email : $EMAIL"
echo "💬 WhatsApp     : $WHATSAPP"
echo "🌐 Location     : $LOCATION"
echo "💼 LinkedIn     : $LINKEDIN"
echo "🐙 GitHub       : $GITHUB"
echo ""
echo "Tip: Type 'sudo hire' for instant email dispatch!"`,

  'secrets.env': `# TOP SECRET ENVIRONMENT CONFIGURATION - ATUL VERMA
ATUL_SUPERPOWER="GST_AUDIT_PLUS_AI_VIBE_CODING"
COFFEE_CONSUMPTION="OVER_9000"
BUG_TOLERANCE="0.0000%"
SYSTEM_STATUS="100%_OPERATIONAL"
DEPLOYMENT_TARGET="PLANET_EARTH"
MISSION="Building zero-latency financial and AI computing systems"
EASTER_EGG="Congratulations, secret explorer! You uncovered the secret env variables! 🚀"`
};

const GIT_LOG_OUTPUT = [
  'commit 9f4a8b2 (HEAD -> main, origin/main)',
  'Author: Atul Verma <Atulravi2015@gmail.com>',
  'Date:   Wed Oct 21 04:00:00 2026 +0530',
  '',
  '    feat: implement Multi-OS switcher, customizable typography & power tools',
  '    - Multi-OS switcher (macOS, Windows PowerShell, Ubuntu Linux)',
  '    - Font color presets (matrix, amber, cyan, pink, white, red, purple, hex)',
  '    - Font size presets & zoom in/out controls',
  '    - Font family switcher (mono, pixel, retro, fira, matrix)',
  '    - Power pack commands: neofetch, ls, cat, pwd, git log, ping, cowsay, weather',
  '',
  'commit 4d1e2c8',
  'Author: Atul Verma <Atulravi2015@gmail.com>',
  'Date:   Tue Oct 20 22:30:00 2026 +0530',
  '',
  '    feat: interactive developer CLI with drag-resize engine & autocomplete',
  '    - Floating movable draggable modal window with sensible min constraints',
  '    - Interactive suggestions, CRT scanlines & matrix digital rain',
  '',
  'commit 7b3a1d0',
  'Author: Atul Verma <Atulravi2015@gmail.com>',
  'Date:   Mon Oct 19 18:15:00 2026 +0530',
  '',
  '    feat: dynamic avatar role switcher & interactive Leaflet multi-district map',
  '    - Career track role switcher (Accountant, MIS, AI Vibe Coder)',
  '    - Offline and hybrid tile map of Bihar & Jharkhand',
  '',
  'commit 1a0e4f5',
  'Author: Atul Verma <Atulravi2015@gmail.com>',
  'Date:   Sun Oct 18 12:00:00 2026 +0530',
  '',
  '    init: core portfolio architecture with React 19, Tailwind CSS & audio engine'
].join('\n');

const FORTUNES = [
  '"Code is like humor. When you have to explain it, it’s bad." – Cory House',
  '"First, solve the problem. Then, write the code." – John Johnson',
  '"Simplicity is prerequisite for reliability." – Edsger W. Dijkstra',
  '"Make it work, make it right, make it fast." – Kent Beck',
  '"There are two ways to write error-free programs; only the third one works." – Alan J. Perlis',
  '"Zero-latency financial data governance meets autonomous AI synthesis." – Atul Verma',
  '"The best error message is the one that never showed up." – Thomas Fuchs',
  '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." – Martin Fowler',
  '"Talk is cheap. Show me the code." – Linus Torvalds',
  '"Experience is the name everyone gives to their mistakes." – Oscar Wilde',
  '"A debit is always equal to a credit, just as an input must match an output." – Ancient Accountant Wisdom',
  '"Automate everything that can be automated, so humans can build what cannot be imagined." – Atul Verma'
];

const WEATHER_REPORT = [
  '┌─────────────────────────────────────────────────────────────┐',
  '│ WEATHER REPORT: MEDININAGAR (DALTONGANJ), JHARKHAND         │',
  '├─────────────────────────────────────────────────────────────┤',
  '│      \\   /      Condition  : Clear Skies & Radiant Sunshine │',
  '│       .-.       Temperature: 28°C / 82.4°F (Feels like 29°C)│',
  '│    ― (   ) ―    Humidity   : 48%                            │',
  '│       `-’       Wind       : 7 km/h NE                      │',
  '│      /   \\      Air Quality: Good (AQI: 52)                 │',
  '│                 Forecast   : Optimal for Coding & Accounting│',
  '└─────────────────────────────────────────────────────────────┘'
].join('\n');

const HELP_MANUAL = [
  '═══════════════════════════════════════════════════════════════════',
  '                 ATUL VERMA TERMINAL COMMAND MANUAL                ',
  '═══════════════════════════════════════════════════════════════════',
  '',
  '[OS & Window Management]',
  '  os <mac|win|linux>   : Switch macOS, Windows, or Linux desktop styling',
  '  size <sm|md|lg>      : Window presets (sm: 520x360, md: 720x480, lg: 960x620)',
  '  maximize, max        : Maximize window to full viewport',
  '  minimize, min        : Minimize window to bottom dock pill',
  '  restore              : Restore window to standard floating state',
  '  clear                : Clear terminal screen output buffer',
  '  crt                  : Toggle retro CRT scanline overlay effect',
  '  sound                : Toggle mechanical keyboard sound effects',
  '  exit                 : Terminate CLI session and close window',
  '',
  '[Color & Typography]',
  '  color <preset|#hex>  : matrix, amber, cyan, pink, white, red, purple, or #hex',
  '  bgcolor <preset|#hex>: obsidian, navy, aubergine, matrix-black, slate, cyber-purple, pure-black, default, or #hex',
  '  opacity <val|preset> : solid (1.0), default (0.95), glass (0.85), semi (0.70), or 40%-100%',
  '  font-size <preset|px>: Set font size (small: 11px, medium: 13px, large: 16px, xl: 18px)',
  '  zoom <in|out|reset>  : Scale font size up (+2px), down (-2px), or reset',
  '  font-family <name>   : Select typography: mono, pixel, retro, fira, matrix',
  '  reset                : Reset OS style, colors, fonts, and window to defaults',
  '',
  '[Portfolio & Bio]',
  '  about, whoami        : Developer bio, origin story & executive overview',
  '  skills               : Technical competencies & ASCII mastery bars',
  '  projects             : Production systems & client portals with links',
  '  contact              : Direct email, WhatsApp, GitHub & LinkedIn info',
  '  resume               : Download official multi-disciplinary PDF resume',
  '  neofetch, fastfetch  : Display system info art, specs & telemetry',
  '',
  '[Live Site Controls]',
  '  cursor <type>        : Switch interactive cursor (e.g. "cursor laser")',
  '  cursor list          : List all available cursor variants',
  '  theme <dark|light>   : Switch website theme mode',
  '  matrix               : Toggle fullscreen Matrix digital rain simulation',
  '  confetti             : Trigger celebratory confetti shower across screen',
  '',
  '[Dev & Shell Tools]',
  '  ls                   : List virtual portfolio project files',
  '  cat <filename>       : Inspect virtual file (e.g. "cat about.md", "cat skills.json")',
  '  pwd                  : Print current working directory path',
  '  git log              : Formatted git commit history of repository',
  '  ping <host>          : Ping host with latency and packet loss telemetry',
  '  history              : List all executed commands in current session',
  '  date                 : Display current IST timestamp and uptime',
  '',
  '[Fun & Easter Eggs]',
  '  cowsay <text>        : ASCII cow with custom speech bubble',
  '  fortune              : Random tech/developer wisdom and hacker quotes',
  '  weather              : Retro ASCII weather forecast for Medininagar',
  '  sudo hire            : Execute direct executive hiring sequence 🎉',
  '  sudo rm -rf /        : Critical system purge (Easter egg)'
].join('\n');

const renderNeofetch = (os) => {
  const osName =
    os === 'win'
      ? 'Windows 11 PowerShell'
      : os === 'linux'
      ? 'Ubuntu Linux 24.04 LTS'
      : 'macOS Sequoia (zsh)';
  const shellName =
    os === 'win'
      ? 'powershell.exe 7.4.5'
      : os === 'linux'
      ? 'bash 5.2.21'
      : 'zsh 5.9 (x86_64-apple-darwin)';
  const resolution =
    typeof window !== 'undefined'
      ? `${window.innerWidth}x${window.innerHeight}`
      : '1920x1080';

  if (os === 'win') {
    return [
      '  ██████  ██████    guest@atul-windows',
      '  ██████  ██████    ------------------',
      '  ██████  ██████    OS: ' + osName,
      '                    Host: Executive Portfolio x86_64',
      '  ██████  ██████    Kernel: React 19.2.8 + Vite 8.3.0',
      '  ██████  ██████    Uptime: 4 hours, 28 mins',
      '  ██████  ██████    Shell: ' + shellName,
      '                    Resolution: ' + resolution,
      '                    DE: Fluent Cyberpunk Glass',
      '                    WM: React Floating Window Manager',
      '                    Terminal: Windows PowerShell CLI',
      '                    CPU: Neural Vibe Engine (8 Cores @ 4.2GHz)',
      '                    Memory: 512MB / 1024MB (Synthetic)',
      '                    Palette: [███][███][███][███][███][███]'
    ].join('\n');
  }

  if (os === 'linux') {
    return [
      '         _          guest@atul-linux',
      '        ---         ----------------',
      '       /   \\        OS: ' + osName,
      '      |  o  |       Host: Executive Portfolio x86_64',
      '       \\___/        Kernel: React 19.2.8 + Vite 8.3.0',
      '      /     \\       Uptime: 5 hours, 14 mins',
      '     | |   | |      Shell: ' + shellName,
      '    /  |   |  \\     Resolution: ' + resolution,
      '    |  |   |  |     DE: GNOME Aubergine Glass',
      '    \\__\\___/__/     WM: React Floating Window Manager',
      '                    Terminal: Ubuntu Terminal v3.0',
      '                    CPU: Neural Vibe Engine (8 Cores @ 4.2GHz)',
      '                    Memory: 512MB / 1024MB (Synthetic)',
      '                    Palette: [███][███][███][███][███][███]'
    ].join('\n');
  }

  // Default mac
  return [
    '                    guest@atul-mac',
    '       .:\'          --------------',
    '    __ :\'__         OS: ' + osName,
    ' .\'`__`-\'__``.      Host: Executive Portfolio x86_64',
    ':__________.-:      Kernel: React 19.2.8 + Vite 8.3.0',
    ':_________:         Uptime: 3 hours, 45 mins',
    ' :________`-;       Shell: ' + shellName,
    '  `._____\'.\'        Resolution: ' + resolution,
    '                    DE: Aqua Cyberpunk Glass',
    '                    WM: React Floating Window Manager',
    '                    Terminal: macOS Terminal (zsh)',
    '                    CPU: Apple Silicon Neural Vibe (M3 Pro)',
    '                    Memory: 512MB / 1024MB (Synthetic)',
    '                    Palette: [███][███][███][███][███][███]'
  ].join('\n');
};

const renderCowsay = (text) => {
  const msg =
    text && text.trim()
      ? text.trim()
      : 'Hire Atul Verma! Zero-latency finance & AI engineering.';
  const len = msg.length;
  const border = '-'.repeat(len + 2);
  const topBorder = '_'.repeat(len + 2);

  return [
    ` ${topBorder}`,
    `< ${msg} >`,
    ` ${border}`,
    '        \\   ^__^',
    '         \\  (oo)\\_______',
    '            (__)\\       )\\/\\',
    '                ||----w |',
    '                ||     ||'
  ].join('\n');
};

const renderPing = (hostArg) => {
  const host = hostArg && hostArg.trim() ? hostArg.trim() : 'atulverma.dev';
  return [
    `PING ${host} (104.21.75.192): 56 data bytes`,
    '64 bytes from 104.21.75.192: icmp_seq=0 ttl=116 time=13.4 ms',
    '64 bytes from 104.21.75.192: icmp_seq=1 ttl=116 time=11.8 ms',
    '64 bytes from 104.21.75.192: icmp_seq=2 ttl=116 time=12.5 ms',
    '64 bytes from 104.21.75.192: icmp_seq=3 ttl=116 time=12.1 ms',
    '',
    `--- ${host} ping statistics ---`,
    '4 packets transmitted, 4 packets received, 0.0% packet loss',
    'round-trip min/avg/max/stddev = 11.8/12.45/13.4/0.60 ms'
  ].join('\n');
};

const getPwd = (os) => {
  if (os === 'win') {
    return 'C:\\Users\\Atul\\Portfolio';
  }
  return '/home/atul/portfolio';
};

const renderHistory = (cmdList) => {
  if (!cmdList || cmdList.length === 0) {
    return 'No commands in history yet.';
  }
  return cmdList
    .map((cmd, idx) => `  ${String(idx + 1).padStart(3, ' ')}  ${cmd}`)
    .join('\n');
};

const getPromptString = (os) => {
  if (os === 'win') return 'PS C:\\Users\\Atul> ';
  if (os === 'linux') return 'guest@atul-linux:~$ ';
  if (os === 'default' || os === 'os') return 'guest@atul-os:~$ ';
  return 'guest@atul-mac:~ % ';
};

function TerminalCLI({
  isOpen,
  onClose,
  soundEnabled = true,
  onToggleSound,
  activeCursor = 'butterfly',
  onSelectCursor,
  fullView = false,
  isMaximized: isMaximizedProp,
  onMaximizeChange,
  onMinimize,
  onRestore
}) {
  const { theme, setTheme, toggleTheme } = useTheme();
  let roleContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    roleContext = useRoleTab();
  } catch {
    // Safe fallback if outside provider
  }

  // Persistent OS style: 'mac' | 'win' | 'linux'
  const [osStyle, setOsStyle] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('terminal_os_style') || 'mac';
    }
    return 'mac';
  });

  // Persistent font color: preset hex or custom #hex
  const [fontColor, setFontColor] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('terminal_font_color') || '#10b981';
    }
    return '#10b981';
  });

  // Persistent font size: 11, 13, 16, 18 or direct number
  const [fontSize, setFontSize] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('terminal_font_size');
      if (saved && !isNaN(Number(saved))) return Number(saved);
    }
    return 13;
  });

  // Persistent font family: 'mono' | 'pixel' | 'retro' | 'fira' | 'matrix'
  const [fontFamily, setFontFamily] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('terminal_font_family') || 'mono';
    }
    return 'mono';
  });

  // Persistent background color: preset hex or custom #hex or null (tracks OS default)
  const [customBgColor, setCustomBgColor] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('terminal_bg_color') || null;
    }
    return null;
  });

  // Persistent background opacity: 0.40 to 1.0 (default 0.95)
  const [bgOpacity, setBgOpacity] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('terminal_bg_opacity');
      if (saved && !isNaN(Number(saved))) return Number(saved);
    }
    return 0.95;
  });

  const effectiveBgHex = customBgColor || DEFAULT_OS_BG[osStyle] || '#0A0F18';
  const effectiveBgRgba = hexToRgba(effectiveBgHex, bgOpacity);

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState(() => [
    {
      id: 'welcome-banner',
      type: 'system',
      content: [
        '╔═══════════════════════════════════════════════════════════════╗',
        '║       ATUL VERMA - INTERACTIVE DEVELOPER CLI (v3.0)          ║',
        '║       Type "help" for commands or click quick action chips    ║',
        '╚═══════════════════════════════════════════════════════════════╝',
        'Connected to: atul-os (x86_64-pc-portfolio) • Status: 🟢 OPERATIONAL'
      ].join('\n')
    }
  ]);

  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(() => Boolean(isMaximizedProp));

  useEffect(() => {
    if (isMaximizedProp !== undefined) {
      setIsMaximized(isMaximizedProp);
    }
  }, [isMaximizedProp]);

  const toggleMaximize = useCallback(() => {
    setIsMaximized((prev) => {
      const next = !prev;
      onMaximizeChange?.(next);
      return next;
    });
  }, [onMaximizeChange]);

  const handleMinimize = useCallback(() => {
    if (fullView && onMinimize) {
      onMinimize();
    } else {
      setIsMinimized(true);
    }
  }, [fullView, onMinimize]);
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [isMatrixActive, setIsMatrixActive] = useState(false);

  // Window sizing & position state (Sensible constraints: min 360x260, bounded by viewport)
  const DEFAULT_SIZE = { width: 720, height: 480 };
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });

  const isResizingRef = useRef(false);
  const resizeStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    startW: 720,
    startH: 480,
    startPosX: 0,
    startPosY: 0,
    handle: 'se'
  });

  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const bottomAnchorRef = useRef(null);

  // Auto-focus input on open, maximize, or restore from minimized
  useEffect(() => {
    if (isOpen && !isMinimized) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMinimized, isMaximized]);

  // Auto-restore from minimized when isOpen becomes true or terminal is reopened
  useEffect(() => {
    if (isOpen && isMinimized) {
      setIsMinimized(false);
    }
  }, [isOpen]);

  // Listen to portfolio:open-terminal custom event to auto-restore from minimized and auto-focus
  useEffect(() => {
    const handleOpenEvent = () => {
      setIsMinimized(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    };
    window.addEventListener('portfolio:open-terminal', handleOpenEvent);
    return () => window.removeEventListener('portfolio:open-terminal', handleOpenEvent);
  }, []);

  // Scroll to bottom on new output
  useEffect(() => {
    if (isOpen && !isMinimized) {
      bottomAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isOpen, isMinimized]);

  // Global ESC key listener (closes matrix first, or closes terminal)
  useEffect(() => {
    if (!isOpen && !isMatrixActive) return;

    const handleKeyDown = (e) => {
      // 1. Fullscreen / Maximize toggle via F11 or Alt+M
      if (e.key === 'F11' || (e.altKey && (e.key === 'm' || e.key === 'M'))) {
        e.preventDefault();
        toggleMaximize();
        return;
      }

      // 2. Alt+Down minimizes to bottom-left dock
      if (e.altKey && (e.key === 'ArrowDown' || e.key === 'Down')) {
        e.preventDefault();
        handleMinimize();
        return;
      }

      // 3. Escape key: closes matrix first, or minimizes if fullView, or closes terminal
      if (e.key === 'Escape') {
        if (isMatrixActive) {
          setIsMatrixActive(false);
          e.stopPropagation();
          e.preventDefault();
          return;
        }
        if (isOpen) {
          if (fullView && onMinimize) {
            e.stopPropagation();
            e.preventDefault();
            onMinimize();
          } else {
            onClose();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMatrixActive, isOpen, onClose, fullView, onMinimize, toggleMaximize, handleMinimize]);

  // Handle Dragging
  const handleMouseDown = (e) => {
    if (isMaximized || isResizingRef.current) return;
    // Don't drag if clicking buttons or inputs
    if (e.target.closest('button') || e.target.closest('input')) return;
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: pos.x,
      posY: pos.y
    };
    e.preventDefault();
  };

  const handleTouchStart = (e) => {
    if (isMaximized || isResizingRef.current) return;
    if (e.target.closest('button') || e.target.closest('input')) return;
    const touch = e.touches[0];
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: touch.clientX,
      mouseY: touch.clientY,
      posX: pos.x,
      posY: pos.y
    };
  };

  // Handle manual drag resize handles (mouse & touch)
  const handleResizeStart = (e, handle = 'se') => {
    if (isMaximized) return;
    e.stopPropagation();
    e.preventDefault();
    isResizingRef.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    resizeStartRef.current = {
      mouseX: clientX,
      mouseY: clientY,
      startW: size.width,
      startH: size.height,
      startPosX: pos.x,
      startPosY: pos.y,
      handle
    };
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleMove = (clientX, clientY) => {
      // 1. Resizing listener with sensible constraints
      if (isResizingRef.current) {
        const { mouseX, mouseY, startW, startH, startPosX, startPosY, handle } =
          resizeStartRef.current;
        const dx = clientX - mouseX;
        const dy = clientY - mouseY;

        const minW = 360;
        const minH = 260;
        const maxW =
          typeof window !== 'undefined'
            ? Math.max(minW, window.innerWidth - 32)
            : 1200;
        const maxH =
          typeof window !== 'undefined'
            ? Math.max(minH, window.innerHeight - 32)
            : 900;

        let newW = startW;
        let newH = startH;
        let newPosX = startPosX;
        let newPosY = startPosY;

        if (handle === 'se' || handle === 'e') {
          newW = Math.max(minW, Math.min(maxW, startW + dx));
          const actualDx = newW - startW;
          newPosX = startPosX + actualDx / 2;
        }

        if (handle === 'se' || handle === 's') {
          newH = Math.max(minH, Math.min(maxH, startH + dy));
          const actualDy = newH - startH;
          newPosY = startPosY + actualDy / 2;
        }

        setSize({ width: Math.round(newW), height: Math.round(newH) });
        setPos({ x: Math.round(newPosX), y: Math.round(newPosY) });
        return;
      }

      // 2. Dragging listener
      if (isDraggingRef.current) {
        const dx = clientX - dragStartRef.current.mouseX;
        const dy = clientY - dragStartRef.current.mouseY;
        setPos({
          x: dragStartRef.current.posX + dx,
          y: dragStartRef.current.posY + dy
        });
      }
    };

    const handleMouseMove = (e) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (e.touches?.[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnd = () => {
      isDraggingRef.current = false;
      isResizingRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isOpen]);

  // Center window on initial open or screen resize
  useEffect(() => {
    if (isOpen) {
      setPos({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // Command Execution Engine
  const executeCommand = useCallback(
    (rawCmd) => {
      const clean = rawCmd.trim();
      if (!clean) return;

      // Add to history
      setCommandHistory((prev) => [...prev, clean]);
      setHistoryIndex(-1);

      const parts = clean.split(' ').filter(Boolean);
      const mainCmd = parts[0]?.toLowerCase();
      const arg = parts.slice(1).join(' ').trim();

      let outputResult = null;
      let isError = false;

      switch (mainCmd) {
        case 'help': {
          outputResult = HELP_MANUAL;
          soundFX.playTerminalSuccess?.();
          break;
        }

        case 'about':
        case 'whoami': {
          outputResult = [
            '┌─────────────────────────────────────────────────────────────┐',
            '│ USER PROFILE: ATUL VERMA                                    │',
            '├─────────────────────────────────────────────────────────────┤',
            '│ Identity   : Financial & Operations Executive & AI Engineer │',
            '│ Location   : Medininagar (Daltonganj), Jharkhand, India     │',
            '│ Focus      : Statutory Accounting, GST Audit, Corporate MIS,│',
            '│              Full-Stack Engineering & Autonomous AI Agents  │',
            '│ Philosophy : Data integrity, zero-latency workflows, and   │',
            '│              high-performance user experiences.             │',
            '└─────────────────────────────────────────────────────────────┘',
            'Bridging commercial finance governance and AI-augmented software synthesis.'
          ].join('\n');
          soundFX.playTerminalSuccess?.();
          break;
        }

        case 'skills': {
          outputResult = [
            '════════════ TECHNICAL COMPETENCY MATRIX ════════════',
            '[1] STATUTORY ACCOUNTING & TAXATION:',
            '  Tally Prime & ERP 9       [██████████] 98% (Multi-Company Ledger)',
            '  GST Filing & E-Way        [██████████] 96% (GSTR-1, 2B, 3B, 9C)',
            '  Income Tax E-Filing       [█████████░] 94% (ITR-1 to 6 & Compliance)',
            '  Financial Auditing        [█████████░] 95% (Internal Controls & GL)',
            '',
            '[2] ENTERPRISE SYSTEMS & MIS:',
            '  Advanced MS Excel         [██████████] 97% (VBA, Power Query, Models)',
            '  DAY-NULM Skill India MIS  [██████████] 96% (Portal & Biometrics)',
            '  Cross-District Operations [█████████░] 94% (Smart Card Logistics)',
            '  Commercial Computing      [█████████░] 94% (Office IT Administration)',
            '',
            '[3] AI ENGINEERING & VIBE CODING:',
            '  React 19 / Vite / Tailwind[█████████░] 92% (High-Speed Interfaces)',
            '  AI Prompt & Agent Systems [██████████] 95% (Claude 3.5, Cursor AI)',
            '  Next.js & Supabase Engine [████████░░] 88% (PostgreSQL, Vector APIs)'
          ].join('\n');
          soundFX.playTerminalSuccess?.();
          break;
        }

        case 'projects': {
          outputResult = [
            '════════════ FEATURED ENTERPRISE PROJECTS ════════════',
            '1. Executive Power BI Fiscal Intelligence & Reconciliation Engine',
            '   • Track: Corporate Controller & BI Analytics',
            '   • Desc : Unified multi-entity accounting ledgers, bank feeds & GST pipelines.',
            '   • Link : View in #projects',
            '',
            '2. Corporate Financial Controls & Internal Audit Governance',
            '   • Track: Statutory Strategy & Governance',
            '   • Desc : Automated GSTR-2B matching, advance tax forecasting & audit trails.',
            '   • Link : View in #projects',
            '',
            '3. DAY-NULM Skill India MIS Reporting Portal',
            '   • Track: Govt Operations & Citizen Analytics',
            '   • Desc : Centralized trainee tracking, biometric logs & statutory reporting.',
            '   • Link : View in #projects',
            '',
            '4. Multi-District Smart Card Operations & Enrollment Engine',
            '   • Track: Field Operations & Biometrics',
            '   • Desc : 4-district rollout in Bihar & Jharkhand with biometric sync.',
            '   • Link : View in #projects',
            '',
            '5. AI Prompt-to-Fullstack SaaS Generator',
            '   • Track: Autonomous AI & Prototyping',
            '   • Desc : Natural language synthesis to Next.js + Tailwind + Supabase.',
            '   • Link : View in #projects',
            '',
            'Tip: Type "contact" or "sudo hire" to initiate collaboration!'
          ].join('\n');
          soundFX.playTerminalSuccess?.();
          break;
        }

        case 'contact': {
          outputResult = [
            '════════════ REACH OUT & CONNECT ════════════',
            '📧 Direct Email : Atulravi2015@gmail.com',
            '💬 WhatsApp     : +91 79035 12399',
            '🌐 Location     : Medininagar, Jharkhand, India',
            '💼 LinkedIn     : https://www.linkedin.com (Atul Verma)',
            '🐙 GitHub       : https://github.com',
            '',
            'Tip: Type "sudo hire" for instant email outreach & celebration!'
          ].join('\n');
          soundFX.playTerminalSuccess?.();
          break;
        }

        case 'resume': {
          try {
            confetti({
              particleCount: 60,
              spread: 60,
              origin: { y: 0.6 }
            });
          } catch {
            // Ignore
          }
          outputResult = [
            '✨ Initiating download of Atul Verma\'s Comprehensive Resume...',
            '📄 File: /resume.pdf (Executive Multi-Role Overview)',
            '🚀 Opening document in a new window/download tab.'
          ].join('\n');
          if (typeof window !== 'undefined') {
            window.open('/resume.pdf', '_blank', 'noopener,noreferrer');
          }
          soundFX.playTerminalSuccess?.();
          break;
        }

        case 'cursor': {
          if (!arg || arg.toLowerCase() === 'list') {
            const names = CURSOR_LIST.map((c) => `${c.id} (${c.name})`).join(', ');
            outputResult = [
              `Total Available Cursors (${CURSOR_LIST.length}):`,
              names,
              '',
              'Usage: cursor <type> (e.g., "cursor laser", "cursor butterfly", "cursor matrix")'
            ].join('\n');
            soundFX.playTerminalSuccess?.();
          } else {
            const targetId = arg.toLowerCase().trim();
            const match = CURSOR_LIST.find(
              (c) => c.id.toLowerCase() === targetId || c.name.toLowerCase() === targetId
            );
            if (match) {
              onSelectCursor?.(match.id);
              outputResult = `[✔] Interactive cursor changed to: ${match.name} ${match.emoji} [${match.id}]`;
              soundFX.playTerminalSuccess?.();
            } else {
              isError = true;
              outputResult = `[✘] Unknown cursor "${arg}". Type "cursor list" to view all ${CURSOR_LIST.length} cursor themes.`;
              soundFX.playTerminalError?.();
            }
          }
          break;
        }

        case 'theme': {
          const mode = arg.toLowerCase().trim();
          if (mode === 'dark') {
            setTheme?.('dark');
            outputResult = '[✔] Website theme switched to DARK mode.';
            soundFX.playTerminalSuccess?.();
          } else if (mode === 'light') {
            setTheme?.('light');
            outputResult = '[✔] Website theme switched to LIGHT mode.';
            soundFX.playTerminalSuccess?.();
          } else if (mode === 'toggle' || !mode) {
            toggleTheme?.();
            outputResult = `[✔] Website theme toggled (currently ${theme === 'dark' ? 'light' : 'dark'}).`;
            soundFX.playTerminalSuccess?.();
          } else {
            isError = true;
            outputResult = `[✘] Invalid theme "${arg}". Usage: theme dark | theme light | theme toggle`;
            soundFX.playTerminalError?.();
          }
          break;
        }

        case 'matrix': {
          setIsMatrixActive((prev) => !prev);
          outputResult = '[⚡] Matrix digital rain mode toggled! Press ESC or type "matrix" to exit.';
          soundFX.playTerminalSuccess?.();
          break;
        }

        case 'maximize':
        case 'max':
        case 'fullscreen':
        case 'fs': {
          setIsMaximized(true);
          onMaximizeChange?.(true);
          setIsMinimized(false);
          outputResult = '[✔] Window state set to FULLSCREEN MAXIMIZED.';
          soundFX.playTerminalSuccess?.();
          break;
        }

        case 'minimize':
        case 'min': {
          setIsMinimized(true);
          outputResult = '[✔] Window minimized to dock pill.';
          soundFX.playTerminalSuccess?.();
          break;
        }

        case 'restore': {
          setIsMaximized(false);
          setIsMinimized(false);
          outputResult = '[✔] Window restored to normal floating state.';
          soundFX.playTerminalSuccess?.();
          break;
        }

        case 'size':
        case 'resize': {
          const sizeArg = arg.toLowerCase().trim();
          if (SIZE_PRESETS[sizeArg]) {
            const preset = SIZE_PRESETS[sizeArg];
            setIsMaximized(false);
            setIsMinimized(false);
            setSize({ width: preset.width, height: preset.height });
            outputResult = `[✔] Window resized to ${preset.label} (${preset.width}px x ${preset.height}px).`;
            soundFX.playTerminalSuccess?.();
          } else {
            isError = true;
            outputResult = [
              `[✘] Unknown size preset "${arg}".`,
              'Available size presets:',
              '  size small   / sm  : 520px x 360px',
              '  size medium  / md  : 720px x 480px',
              '  size large   / lg  : 960px x 620px',
              '  size default       : 720px x 480px (Default)',
              '',
              'Tip: You can also freely drag the bottom-right corner grip handle to resize to any dimension!'
            ].join('\n');
            soundFX.playTerminalError?.();
          }
          break;
        }

        // Multi-OS Look & Feel Switcher
        case 'os':
        case 'style':
        case 'theme-os': {
          const target = arg.toLowerCase().trim();
          if (
            target === 'mac' ||
            target === 'macos' ||
            target === 'osx' ||
            target === 'darwin' ||
            target === 'apple'
          ) {
            setOsStyle('mac');
            if (typeof window !== 'undefined') localStorage.setItem('terminal_os_style', 'mac');
            outputResult = '[✔] OS Look & Feel switched to macOS (zsh) with Glassmorphism and traffic-light controls.';
            soundFX.playTerminalSuccess?.();
          } else if (
            target === 'win' ||
            target === 'windows' ||
            target === 'powershell' ||
            target === 'cmd'
          ) {
            setOsStyle('win');
            if (typeof window !== 'undefined') localStorage.setItem('terminal_os_style', 'win');
            outputResult = '[✔] OS Look & Feel switched to Windows PowerShell with deep navy chrome and square window controls.';
            soundFX.playTerminalSuccess?.();
          } else if (
            target === 'linux' ||
            target === 'ubuntu' ||
            target === 'kali' ||
            target === 'debian' ||
            target === 'bash'
          ) {
            setOsStyle('linux');
            if (typeof window !== 'undefined') localStorage.setItem('terminal_os_style', 'linux');
            outputResult = '[✔] OS Look & Feel switched to Ubuntu Linux (bash) with aubergine chrome and rounded controls.';
            soundFX.playTerminalSuccess?.();
          } else {
            isError = true;
            outputResult = [
              `[✘] Unknown OS style "${arg}".`,
              `Current OS style: ${osStyle}`,
              'Available OS styles:',
              '  os mac   : macOS with glassmorphism, traffic light dots, and zsh prompt',
              '  os win   : Windows PowerShell with deep navy chrome & square controls',
              '  os linux : Ubuntu Linux with aubergine palette & rounded controls'
            ].join('\n');
            soundFX.playTerminalError?.();
          }
          break;
        }

        // Font & Text Color Customization
        case 'color':
        case 'font-color':
        case 'text-color': {
          const colorArg = arg.toLowerCase().trim();
          if (!colorArg) {
            outputResult = [
              `Current terminal text color: ${fontColor}`,
              'Available color presets:',
              '  color matrix    : Neon matrix green (#10b981)',
              '  color amber     : Retro terminal amber (#f59e0b)',
              '  color cyan      : Cyberpunk cyan (#06b6d4)',
              '  color pink      : Synthwave pink (#ec4899)',
              '  color white     : Pure crisp white (#f8fafc)',
              '  color red       : Hacker alert red (#ef4444)',
              '  color purple    : Deep royal purple (#a855f7)',
              '',
              'Custom hex colors are also supported: e.g. "color #00ffcc"'
            ].join('\n');
            soundFX.playTerminalSuccess?.();
            break;
          }
          if (COLOR_PRESETS[colorArg]) {
            const selected = COLOR_PRESETS[colorArg];
            setFontColor(selected.hex);
            if (typeof window !== 'undefined') localStorage.setItem('terminal_font_color', selected.hex);
            outputResult = `[✔] Terminal text color set to ${selected.name} (${selected.hex}).`;
            soundFX.playTerminalSuccess?.();
          } else if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(colorArg)) {
            setFontColor(colorArg);
            if (typeof window !== 'undefined') localStorage.setItem('terminal_font_color', colorArg);
            outputResult = `[✔] Custom hex color applied: ${colorArg}.`;
            soundFX.playTerminalSuccess?.();
          } else {
            isError = true;
            outputResult = `[✘] Invalid color "${arg}". Choose a preset (matrix, amber, cyan, pink, white, red, purple) or enter a valid hex code (e.g. #00ffcc).`;
            soundFX.playTerminalError?.();
          }
          break;
        }

        // Font Size & Direct Scale
        case 'font-size':
        case 'font':
        case 'text-size': {
          const sizeArg = arg.toLowerCase().trim();
          if (FONT_SIZE_PRESETS[sizeArg]) {
            const px = FONT_SIZE_PRESETS[sizeArg];
            setFontSize(px);
            if (typeof window !== 'undefined') localStorage.setItem('terminal_font_size', String(px));
            outputResult = `[✔] Terminal font size set to ${sizeArg} (${px}px).`;
            soundFX.playTerminalSuccess?.();
          } else {
            const directNum = parseInt(sizeArg, 10);
            if (!isNaN(directNum) && directNum >= 10 && directNum <= 28) {
              setFontSize(directNum);
              if (typeof window !== 'undefined') localStorage.setItem('terminal_font_size', String(directNum));
              outputResult = `[✔] Terminal font size set to ${directNum}px.`;
              soundFX.playTerminalSuccess?.();
            } else {
              isError = true;
              outputResult = [
                `[✘] Invalid font size "${arg}".`,
                `Current font size: ${fontSize}px`,
                'Available presets:',
                '  font-size small  / sm : 11px',
                '  font-size medium / md : 13px (Default)',
                '  font-size large  / lg : 16px',
                '  font-size xl          : 18px',
                '',
                'You can also specify a direct number between 10 and 28 (e.g. "font-size 15").'
              ].join('\n');
              soundFX.playTerminalError?.();
            }
          }
          break;
        }

        // Font Zoom
        case 'zoom': {
          const zoomArg = arg.toLowerCase().trim();
          if (zoomArg === 'in' || zoomArg === '+') {
            const next = Math.min(28, fontSize + 2);
            setFontSize(next);
            if (typeof window !== 'undefined') localStorage.setItem('terminal_font_size', String(next));
            outputResult = `[✔] Zoom in: font size increased to ${next}px.`;
            soundFX.playTerminalSuccess?.();
          } else if (zoomArg === 'out' || zoomArg === '-') {
            const next = Math.max(10, fontSize - 2);
            setFontSize(next);
            if (typeof window !== 'undefined') localStorage.setItem('terminal_font_size', String(next));
            outputResult = `[✔] Zoom out: font size decreased to ${next}px.`;
            soundFX.playTerminalSuccess?.();
          } else if (zoomArg === 'reset' || zoomArg === '0') {
            setFontSize(13);
            if (typeof window !== 'undefined') localStorage.setItem('terminal_font_size', '13');
            outputResult = '[✔] Zoom reset: font size restored to medium (13px).';
            soundFX.playTerminalSuccess?.();
          } else {
            isError = true;
            outputResult = `[✘] Invalid zoom option "${arg}". Usage: zoom in | zoom out | zoom reset`;
            soundFX.playTerminalError?.();
          }
          break;
        }

        // Font Family Selection
        case 'font-family':
        case 'font-face':
        case 'typeface': {
          const famArg = arg.toLowerCase().trim();
          if (FONT_FAMILIES[famArg]) {
            setFontFamily(famArg);
            if (typeof window !== 'undefined') localStorage.setItem('terminal_font_family', famArg);
            outputResult = `[✔] Terminal font family set to "${famArg}".`;
            soundFX.playTerminalSuccess?.();
          } else {
            isError = true;
            outputResult = [
              `[✘] Unknown font family "${arg}".`,
              `Current font family: ${fontFamily}`,
              'Available font families:',
              '  font-family mono   : Standard clean monospace',
              '  font-family pixel  : Vintage arcade / typewriter font',
              '  font-family retro  : Retro Courier arcade font',
              '  font-family fira   : Fira Code programmer typography',
              '  font-family matrix : Cyberpunk console font'
            ].join('\n');
            soundFX.playTerminalError?.();
          }
          break;
        }

        // Terminal Background Color Customization
        case 'bgcolor':
        case 'bg':
        case 'background':
        case 'color-bg': {
          const bgArg = arg.toLowerCase().trim();
          if (!bgArg) {
            outputResult = [
              `Current terminal background: ${customBgColor ? customBgColor : `Default OS (${DEFAULT_OS_BG[osStyle] || '#0A0F18'})`}`,
              `Current opacity: ${Math.round(bgOpacity * 100)}% (${bgOpacity})`,
              '',
              'Available background presets:',
              '  bgcolor obsidian     (#0a0f18) - Sleek macOS obsidian dark',
              '  bgcolor navy         (#012456) - Windows PowerShell deep navy',
              '  bgcolor aubergine    (#2c001e) - Ubuntu Linux aubergine',
              '  bgcolor matrix-black (#081208) - Deep matrix terminal green-black',
              '  bgcolor slate        (#0f172a) - Modern developer slate',
              '  bgcolor cyber-purple (#180828) - Neon synthwave dark purple',
              '  bgcolor pure-black   (#000000) - High-contrast pitch black',
              '  bgcolor default      - Reset to track active OS styling',
              '',
              'Custom hex colors are also supported: e.g. "bgcolor #0d1117" or "bgcolor #1e1e2e"'
            ].join('\n');
            soundFX.playTerminalSuccess?.();
            break;
          }

          if (bgArg === 'default' || bgArg === 'auto' || bgArg === 'reset') {
            setCustomBgColor(null);
            if (typeof window !== 'undefined') localStorage.removeItem('terminal_bg_color');
            outputResult = `[✔] Terminal background reset to follow active OS style (${DEFAULT_OS_BG[osStyle] || '#0A0F18'}).`;
            soundFX.playTerminalSuccess?.();
          } else if (BG_COLOR_PRESETS[bgArg]) {
            const selected = BG_COLOR_PRESETS[bgArg];
            setCustomBgColor(selected.hex);
            if (typeof window !== 'undefined') localStorage.setItem('terminal_bg_color', selected.hex);
            outputResult = `[✔] Terminal background color set to ${selected.name} (${selected.hex}).`;
            soundFX.playTerminalSuccess?.();
          } else if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(bgArg)) {
            setCustomBgColor(bgArg);
            if (typeof window !== 'undefined') localStorage.setItem('terminal_bg_color', bgArg);
            outputResult = `[✔] Custom background hex color applied: ${bgArg}.`;
            soundFX.playTerminalSuccess?.();
          } else {
            isError = true;
            outputResult = [
              `[✘] Invalid background color "${arg}".`,
              'Available presets:',
              '  bgcolor obsidian / mac        : #0a0f18',
              '  bgcolor navy / win            : #012456',
              '  bgcolor aubergine / linux     : #2c001e',
              '  bgcolor matrix-black / matrix : #081208',
              '  bgcolor slate                 : #0f172a',
              '  bgcolor cyber-purple / purple : #180828',
              '  bgcolor pure-black / black    : #000000',
              '  bgcolor default / auto / reset: Follow active OS style',
              '',
              'Custom hex colors are also supported: e.g. "bgcolor #0d1117" or "bgcolor #1e1e2e"'
            ].join('\n');
            soundFX.playTerminalError?.();
          }
          break;
        }

        // Terminal Background Opacity Customization
        case 'opacity':
        case 'transparent':
        case 'transparency':
        case 'glass': {
          const opArg = arg.toLowerCase().trim();
          if (!opArg) {
            outputResult = [
              `Current background opacity: ${Math.round(bgOpacity * 100)}% (${bgOpacity})`,
              'Available opacity presets:',
              '  opacity solid   : 100% (1.0) - Completely opaque background',
              '  opacity default : 95% (0.95) - Standard balanced opacity',
              '  opacity glass   : 85% (0.85) - Frosted glassmorphism look',
              '  opacity semi    : 70% (0.70) - High transparency translucency',
              '',
              'Direct numbers/percentages supported: e.g. "opacity 90", "opacity 75%", "opacity 0.8" (clamped between 0.4 and 1.0).'
            ].join('\n');
            soundFX.playTerminalSuccess?.();
            break;
          }

          let targetVal = null;
          if (OPACITY_PRESETS[opArg] !== undefined) {
            targetVal = OPACITY_PRESETS[opArg];
          } else {
            const cleanNum = opArg.replace('%', '').trim();
            const parsed = parseFloat(cleanNum);
            if (!isNaN(parsed)) {
              if (opArg.includes('%') || parsed > 1.0) {
                targetVal = parsed / 100;
              } else {
                targetVal = parsed;
              }
            }
          }

          if (targetVal !== null) {
            const clamped = Math.min(1.0, Math.max(0.4, Math.round(targetVal * 100) / 100));
            setBgOpacity(clamped);
            if (typeof window !== 'undefined') {
              localStorage.setItem('terminal_bg_opacity', String(clamped));
            }
            outputResult = `[✔] Terminal background opacity set to ${Math.round(clamped * 100)}% (${clamped}).`;
            soundFX.playTerminalSuccess?.();
          } else {
            isError = true;
            outputResult = [
              `[✘] Invalid opacity value "${arg}".`,
              `Current opacity: ${Math.round(bgOpacity * 100)}% (${bgOpacity})`,
              'Available presets:',
              '  opacity solid   : 100% (1.0)',
              '  opacity default : 95% (0.95)',
              '  opacity glass   : 85% (0.85)',
              '  opacity semi    : 70% (0.70)',
              '',
              'Direct values supported: e.g. "opacity 90", "opacity 75%", "opacity 0.8" (clamped between 0.4 and 1.0).'
            ].join('\n');
            soundFX.playTerminalError?.();
          }
          break;
        }

        // Reset All Defaults
        case 'reset': {
          setOsStyle('mac');
          setFontColor('#10b981');
          setCustomBgColor(null);
          setBgOpacity(0.95);
          setFontSize(13);
          setFontFamily('mono');
          setSize(DEFAULT_SIZE);
          setPos({ x: 0, y: 0 });
          setIsMaximized(false);
          setIsMinimized(false);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('terminal_os_style');
            localStorage.removeItem('terminal_font_color');
            localStorage.removeItem('terminal_bg_color');
            localStorage.removeItem('terminal_bg_opacity');
            localStorage.removeItem('terminal_font_size');
            localStorage.removeItem('terminal_font_family');
          }
          outputResult =
            '[✔] Terminal settings restored to defaults: macOS Look & Feel, Matrix Green, 13px font, Monospace, default OS background (95% opacity), 720x480 floating window.';
          soundFX.playTerminalSuccess?.();
          break;
        }

        // Ultimate Power Pack Commands
        case 'neofetch':
        case 'fastfetch': {
          outputResult = renderNeofetch(osStyle);
          soundFX.playTerminalSuccess?.();
          break;
        }

        case 'ls': {
          outputResult = [
            'MODE         SIZE    LAST_MODIFIED    NAME',
            '-rw-r--r--   842 B   Oct 21 04:00     about.md',
            '-rw-r--r--   1.2 KB  Oct 21 04:00     skills.json',
            '-rw-r--r--   1.8 KB  Oct 21 04:00     projects.ts',
            '-rwxr-xr-x   184 KB  Oct 21 04:00     resume.pdf',
            '-rwxr-xr-x   620 B   Oct 21 04:00     contact.sh',
            '-rw-------   480 B   Oct 21 04:00     secrets.env',
            '',
            'Tip: Type "cat <filename>" to view any virtual file (e.g. "cat about.md")'
          ].join('\n');
          soundFX.playTerminalSuccess?.();
          break;
        }

        case 'cat': {
          const filename = arg.trim();
          if (!filename) {
            isError = true;
            outputResult = 'cat: missing file operand. Type "ls" to list available virtual files.';
            soundFX.playTerminalError?.();
          } else if (VIRTUAL_FILES[filename]) {
            outputResult = VIRTUAL_FILES[filename];
            if (filename === 'resume.pdf') {
              try {
                confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
              } catch {
                // Ignore
              }
              if (typeof window !== 'undefined') {
                window.open('/resume.pdf', '_blank', 'noopener,noreferrer');
              }
            }
            soundFX.playTerminalSuccess?.();
          } else {
            isError = true;
            outputResult = `cat: ${filename}: No such file or directory. Type "ls" to view available files.`;
            soundFX.playTerminalError?.();
          }
          break;
        }

        case 'pwd': {
          outputResult = getPwd(osStyle);
          soundFX.playTerminalSuccess?.();
          break;
        }

        case 'git': {
          const sub = arg.toLowerCase().trim();
          if (sub === 'log' || !sub) {
            outputResult = GIT_LOG_OUTPUT;
            soundFX.playTerminalSuccess?.();
          } else if (sub === 'status') {
            outputResult =
              "On branch main\nYour branch is up to date with 'origin/main'.\nnothing to commit, working tree clean";
            soundFX.playTerminalSuccess?.();
          } else {
            outputResult = `git: '${sub}' is not a valid git command in this demo. Try "git log".`;
            soundFX.playTerminalSuccess?.();
          }
          break;
        }

        case 'ping': {
          outputResult = renderPing(arg);
          soundFX.playTerminalSuccess?.();
          break;
        }

        case 'history': {
          outputResult = renderHistory(commandHistory);
          soundFX.playTerminalSuccess?.();
          break;
        }

        case 'cowsay': {
          outputResult = renderCowsay(arg);
          soundFX.playTerminalSuccess?.();
          break;
        }

        case 'fortune': {
          const quote = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
          outputResult = quote;
          soundFX.playTerminalSuccess?.();
          break;
        }

        case 'confetti': {
          try {
            confetti({
              particleCount: 120,
              spread: 90,
              origin: { y: 0.6 }
            });
          } catch {
            // Ignore
          }
          outputResult = '🎉 Confetti exploded across your viewport! High vibes active!';
          soundFX.playTerminalSuccess?.();
          break;
        }

        case 'weather': {
          outputResult = WEATHER_REPORT;
          soundFX.playTerminalSuccess?.();
          break;
        }

        case 'sudo': {
          const sub = arg.toLowerCase().trim();
          if (sub === 'hire') {
            try {
              confetti({
                particleCount: 100,
                spread: 80,
                origin: { y: 0.6 }
              });
            } catch {
              // Ignore
            }
            outputResult = [
              '🎉 [EXECUTIVE PROTOCOL ACTIVATED]',
              'Congratulations on taking the initiative to work with Atul Verma!',
              'Bridging Financial Leadership, Executive MIS & Modern Autonomous AI Engineering.',
              'Launching direct email dispatch to Atulravi2015@gmail.com...'
            ].join('\n');
            soundFX.playTerminalSuccess?.();
            setTimeout(() => {
              if (typeof window !== 'undefined') {
                window.location.href =
                  'mailto:Atulravi2015@gmail.com?subject=Job%20Opportunity%20-%20Portfolio%20Inquiry&body=Hi%20Atul,%0D%0A%0D%0AI%20reviewed%20your%20interactive%20portfolio%20and%20CLI%20terminal.%20We%20would%20love%20to%20discuss%20an%20opportunity%20with%20you.';
              }
            }, 800);
          } else if (sub.startsWith('rm -rf') || sub.startsWith('rm')) {
            isError = true;
            outputResult =
              "[💥 PERMISSION DENIED] Nice try, hacker! 😉 Atul's codebase is protected by immutable snapshots. You cannot delete Atul's hard work! 😂";
            soundFX.playTerminalError?.();
          } else {
            isError = true;
            outputResult = `sudo: ${sub || 'command'}: permission granted, but command unrecognized. Try "sudo hire"!`;
            soundFX.playTerminalError?.();
          }
          break;
        }

        case 'rm': {
          isError = true;
          outputResult =
            "[💥 PERMISSION DENIED] Nice try, hacker! 😉 Atul's codebase is protected by immutable snapshots. You cannot delete Atul's hard work! 😂";
          soundFX.playTerminalError?.();
          break;
        }

        case 'clear': {
          setHistory([]);
          soundFX.playTerminalSuccess?.();
          return;
        }

        case 'crt': {
          setCrtEnabled((prev) => {
            const next = !prev;
            outputResult = `[✔] Retro CRT scanline effect: ${next ? 'ENABLED' : 'DISABLED'}`;
            return next;
          });
          soundFX.playTerminalSuccess?.();
          break;
        }

        case 'sound': {
          onToggleSound?.();
          const nextState = !soundEnabled;
          outputResult = `[✔] Mechanical sound effects: ${nextState ? 'ENABLED' : 'MUTED'}`;
          soundFX.playTerminalSuccess?.();
          break;
        }

        case 'date': {
          const now = new Date();
          outputResult = `Current System Time: ${now.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'full',
            timeStyle: 'long'
          })} (IST)\nSystem Uptime: 99.98% • All systems nominal`;
          soundFX.playTerminalSuccess?.();
          break;
        }

        case 'exit': {
          outputResult = '[Session closed] Terminating CLI session... Goodbye!';
          soundFX.playTerminalSuccess?.();
          setTimeout(() => {
            onClose();
          }, 300);
          break;
        }

        default: {
          isError = true;
          const shellName =
            osStyle === 'win' ? 'powershell' : osStyle === 'linux' ? 'bash' : 'zsh';
          outputResult = `${shellName}: command not found: "${clean}". Type "help" for a list of available commands.`;
          soundFX.playTerminalError?.();
          break;
        }
      }

      setHistory((prev) => [
        ...prev,
        {
          id: `cmd-${Date.now()}-${Math.random()}`,
          type: 'user',
          prompt: getPromptString(osStyle),
          command: clean,
          output: outputResult,
          isError
        }
      ]);
    },
    [
      setTheme,
      toggleTheme,
      theme,
      onSelectCursor,
      soundEnabled,
      onToggleSound,
      onClose,
      osStyle,
      fontColor,
      customBgColor,
      bgOpacity,
      fontSize,
      fontFamily,
      commandHistory
    ]
  );

  // Handle Key Down on Input
  const handleInputKeyDown = (e) => {
    // Mechanical click sound on printable characters
    if (
      e.key.length === 1 &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      soundEnabled
    ) {
      soundFX.playKeyClick?.();
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = inputVal;
      setInputVal('');
      executeCommand(cmd);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex =
        historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(commandHistory[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex] || '');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = inputVal.trim().toLowerCase();
      if (!current) return;
      const matches = AUTOCOMPLETE_LIST.filter((cmd) => cmd.startsWith(current));
      if (matches.length === 1) {
        setInputVal(matches[0]);
      } else if (matches.length > 1) {
        setHistory((prev) => [
          ...prev,
          {
            id: `tab-${Date.now()}`,
            type: 'system',
            content: `Possible completions: ${matches.join('  ')}`
          }
        ]);
      }
    }
  };

  if (!isOpen) return null;

  // OS-specific window theme classes
  const getContainerStyles = () => {
    if (osStyle === 'win') {
      return {
        bg: 'bg-[#012456]/95 border-sky-500/40 text-sky-200',
        headerBg: 'bg-[#011C40] border-sky-500/30',
        subHeaderBg: 'bg-[#011633]/90 border-sky-500/20',
        footerBg: 'bg-[#011633]/90 border-sky-500/20'
      };
    }
    if (osStyle === 'linux') {
      return {
        bg: 'bg-[#2c001e]/95 border-[#E95420]/35 text-orange-200',
        headerBg: 'bg-[#1e0015] border-[#E95420]/30',
        subHeaderBg: 'bg-[#180011]/90 border-[#E95420]/20',
        footerBg: 'bg-[#180011]/90 border-[#E95420]/20'
      };
    }
    // Mac default
    return {
      bg: 'bg-[#0A0F18]/95 dark:bg-[#060911]/95 border-emerald-500/30 text-emerald-300',
      headerBg: 'bg-[#05080E]/90 border-emerald-500/20',
      subHeaderBg: 'bg-[#080C14]/80 border-emerald-500/15',
      footerBg: 'bg-[#05080E]/90 border-emerald-500/15'
    };
  };

  const osStyles = getContainerStyles();

  return (
    <>
      {/* 1. Fullscreen Matrix Digital Rain Overlay */}
      {isMatrixActive && (
        <MatrixDigitalRain onClose={() => setIsMatrixActive(false)} />
      )}

      {/* 2. Floating Terminal Window */}
      {isMinimized ? (
        /* Minimized Dock Pill (Bottom-Left) */
        <div
          role="region"
          aria-label="Minimized Terminal Window"
          className="fixed bottom-5 left-5 z-[9995] flex items-center gap-2.5 px-3.5 py-2 rounded-xl shadow-2xl backdrop-blur-md cursor-pointer transition-all duration-200 select-none border group hover:scale-[1.02] active:scale-[0.98]"
          style={{
            backgroundColor: hexToRgba(effectiveBgHex, Math.max(bgOpacity, 0.9)),
            borderColor: `${fontColor}60`
          }}
          onClick={() => {
            setIsMinimized(false);
            if (onRestore) onRestore();
          }}
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 animate-pulse" style={{ color: fontColor }} />
            <span
              className="font-mono text-xs font-semibold tracking-wide"
              style={{ color: fontColor }}
            >
              guest@atul-mac:~
            </span>
          </div>

          <div className="flex items-center gap-1 ml-1 pl-2 border-l border-white/20">
            <button
              type="button"
              className="p-1 rounded hover:bg-white/10 transition-colors"
              style={{ color: fontColor }}
              title="Restore Terminal"
              aria-label="Restore Terminal"
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(false);
                if (onRestore) onRestore();
              }}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1 rounded hover:bg-white/10 transition-colors text-stone-400 hover:text-white"
              title="Close Terminal"
              aria-label="Close Terminal"
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(false);
                onClose();
              }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          ref={terminalRef}
          role="dialog"
          aria-label="Developer Terminal CLI"
          aria-modal="false"
          style={{
            transform: isMaximized
              ? 'none'
              : `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
            fontFamily: FONT_FAMILIES[fontFamily] || FONT_FAMILIES.mono,
            borderColor: `${fontColor}45`,
            boxShadow: `0 20px 60px ${fontColor}18`,
            backgroundColor: hexToRgba(effectiveBgHex, bgOpacity),
            ...(isMaximized
              ? {}
              : {
                  width: `${size.width}px`,
                  height: `${size.height}px`,
                  maxWidth: 'calc(100vw - 24px)',
                  maxHeight: 'calc(100vh - 24px)'
                })
          }}
          className={`fixed z-[9990] transition-shadow duration-200 flex flex-col font-mono text-xs sm:text-sm select-text overflow-hidden ${
            isMaximized
              ? 'fixed inset-0 z-[9995] w-screen h-screen max-w-none max-h-none rounded-none border-0'
              : 'top-1/2 left-1/2 rounded-xl shadow-2xl'
          } ${osStyles.bg} border backdrop-blur-xl`}
          onClick={() => inputRef.current?.focus()}
        >
          {/* CRT Scanline Overlay Effect */}
          {crtEnabled && (
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none z-30"
              style={{
                background:
                  'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.22) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.02))',
                backgroundSize: '100% 3px, 6px 100%'
              }}
            />
          )}

          {/* Window Header / Titlebar */}
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className={`flex items-center justify-between px-3.5 py-2.5 ${osStyles.headerBg} border-b select-none ${
              isMaximized ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
            }`}
          >
            {/* MAC OS HEADER CONTROLS */}
            {osStyle === 'mac' && (
              <>
                {/* Traffic Light Dots */}
                <div className="flex items-center gap-2">
                  {/* Red Close Dot */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    className="w-3 h-3 rounded-full bg-[#FF5F56] hover:bg-[#FF453A] border border-[#E0443E] transition-colors focus:outline-none"
                    title="Close terminal (Esc or `)"
                    aria-label="Close terminal"
                  />
                  {/* Yellow Minimize Dot */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMinimize();
                    }}
                    className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:bg-[#FFAC1C] border border-[#DEA123] transition-colors focus:outline-none"
                    title="Minimize terminal"
                    aria-label="Minimize terminal"
                  />
                  {/* Green Maximize Dot */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMaximize();
                    }}
                    className="w-3 h-3 rounded-full bg-[#27C93F] hover:bg-[#1EAE34] border border-[#1AAB29] transition-colors focus:outline-none"
                    title={isMaximized ? 'Restore size' : 'Maximize window'}
                    aria-label={isMaximized ? 'Restore size' : 'Maximize window'}
                  />
                </div>

                {/* Centered Window Title */}
                <div
                  className="flex items-center gap-2 text-xs font-semibold"
                  style={{ color: fontColor }}
                >
                  <Terminal className="w-3.5 h-3.5" style={{ color: fontColor }} />
                  <span>guest@atul-mac:~ (zsh)</span>
                  <span
                    className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] border"
                    style={{
                      borderColor: `${fontColor}40`,
                      backgroundColor: `${fontColor}15`
                    }}
                  >
                    ACTIVE
                  </span>
                </div>

                {/* Quick Utility Toggles (CRT, Sound, Close Icon) */}
                <div className="flex items-center gap-1.5 text-stone-400">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCrtEnabled((prev) => !prev);
                      if (soundEnabled) soundFX.playKeyClick?.();
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                      crtEnabled
                        ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 shadow-2xs'
                        : 'bg-stone-900/60 text-stone-500 border-stone-800'
                    }`}
                    title={`Toggle CRT Scanlines (${crtEnabled ? 'ON' : 'OFF'})`}
                    aria-label="Toggle CRT Scanline Effect"
                  >
                    CRT {crtEnabled ? 'ON' : 'OFF'}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSound?.();
                      if (!soundEnabled) soundFX.playKeyClick?.();
                    }}
                    className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
                    style={{ color: soundEnabled ? fontColor : '#78716c' }}
                    title={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
                    aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-3.5 h-3.5" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    className="p-1 rounded hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Close window"
                    aria-label="Close terminal"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}

            {/* WINDOWS OS HEADER CONTROLS */}
            {osStyle === 'win' && (
              <>
                {/* Left Title & Windows Terminal Icon */}
                <div className="flex items-center gap-2 text-xs font-semibold text-sky-200">
                  <div className="w-4 h-4 bg-sky-500 flex items-center justify-center rounded-xs text-[10px] font-black text-black">
                    &gt;_
                  </div>
                  <span>Windows PowerShell</span>
                  <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] bg-sky-950/80 text-sky-300 border border-sky-500/30">
                    ACTIVE
                  </span>
                </div>

                <div className="hidden md:flex items-center text-xs text-sky-400/60">
                  C:\Users\Atul\Portfolio
                </div>

                {/* Right Utilities & Windows Square Window Controls */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCrtEnabled((prev) => !prev);
                      if (soundEnabled) soundFX.playKeyClick?.();
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border mr-1 transition-all cursor-pointer ${
                      crtEnabled
                        ? 'bg-sky-950/70 text-sky-300 border-sky-500/40'
                        : 'bg-stone-900/60 text-stone-500 border-stone-800'
                    }`}
                    title={`Toggle CRT Scanlines (${crtEnabled ? 'ON' : 'OFF'})`}
                    aria-label="Toggle CRT Scanline Effect"
                  >
                    CRT {crtEnabled ? 'ON' : 'OFF'}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSound?.();
                      if (!soundEnabled) soundFX.playKeyClick?.();
                    }}
                    className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer mr-2"
                    style={{ color: soundEnabled ? fontColor : '#78716c' }}
                    title={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
                    aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-3.5 h-3.5" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Square Windows Minimize Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMinimize();
                    }}
                    className="w-8 h-6 flex items-center justify-center hover:bg-white/10 text-stone-300 text-xs transition-colors"
                    title="Minimize"
                    aria-label="Minimize terminal"
                  >
                    <span>—</span>
                  </button>

                  {/* Square Windows Maximize / Restore Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMaximize();
                    }}
                    className="w-8 h-6 flex items-center justify-center hover:bg-white/10 text-stone-300 text-xs transition-colors"
                    title={isMaximized ? 'Restore size' : 'Maximize window'}
                    aria-label={isMaximized ? 'Restore size' : 'Maximize window'}
                  >
                    <span>{isMaximized ? '❐' : '▢'}</span>
                  </button>

                  {/* Square Windows Close Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    className="w-8 h-6 flex items-center justify-center hover:bg-red-600 hover:text-white text-stone-300 text-xs transition-colors"
                    title="Close"
                    aria-label="Close terminal"
                  >
                    <span>✕</span>
                  </button>
                </div>
              </>
            )}

            {/* LINUX OS HEADER CONTROLS */}
            {osStyle === 'linux' && (
              <>
                {/* Left Title & Linux Terminal Icon */}
                <div className="flex items-center gap-2 text-xs font-semibold text-orange-200">
                  <Terminal className="w-3.5 h-3.5 text-[#E95420]" />
                  <span>guest@atul-linux: ~</span>
                  <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] bg-orange-950/80 text-orange-300 border border-orange-500/30">
                    ACTIVE
                  </span>
                </div>

                <div className="hidden md:flex items-center text-xs text-orange-300/60">
                  bash 5.2.21
                </div>

                {/* Right Utilities & Rounded Linux Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCrtEnabled((prev) => !prev);
                      if (soundEnabled) soundFX.playKeyClick?.();
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                      crtEnabled
                        ? 'bg-orange-950/70 text-orange-300 border-orange-500/40'
                        : 'bg-stone-900/60 text-stone-500 border-stone-800'
                    }`}
                    title={`Toggle CRT Scanlines (${crtEnabled ? 'ON' : 'OFF'})`}
                    aria-label="Toggle CRT Scanline Effect"
                  >
                    CRT {crtEnabled ? 'ON' : 'OFF'}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSound?.();
                      if (!soundEnabled) soundFX.playKeyClick?.();
                    }}
                    className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer mr-1"
                    style={{ color: soundEnabled ? fontColor : '#78716c' }}
                    title={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
                    aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-3.5 h-3.5" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Rounded Linux Minimize Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMinimize();
                    }}
                    className="w-5 h-5 rounded-full bg-stone-700/80 hover:bg-stone-600 flex items-center justify-center text-[10px] text-stone-300 transition-colors"
                    title="Minimize"
                    aria-label="Minimize terminal"
                  >
                    <span>—</span>
                  </button>

                  {/* Rounded Linux Maximize / Restore Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMaximize();
                    }}
                    className="w-5 h-5 rounded-full bg-stone-700/80 hover:bg-stone-600 flex items-center justify-center text-[9px] text-stone-300 transition-colors"
                    title={isMaximized ? 'Restore size' : 'Maximize window'}
                    aria-label={isMaximized ? 'Restore size' : 'Maximize window'}
                  >
                    <span>{isMaximized ? '❐' : '▢'}</span>
                  </button>

                  {/* Rounded Linux Close Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    className="w-5 h-5 rounded-full bg-[#E95420] hover:bg-[#d44817] flex items-center justify-center text-[10px] text-white transition-colors"
                    title="Close"
                    aria-label="Close terminal"
                  >
                    <span>✕</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Quick Command Suggestion Chips / Pills */}
          <div
            className={`flex items-center gap-1.5 px-3 py-2 ${osStyles.subHeaderBg} border-b overflow-x-auto no-scrollbar shrink-0`}
          >
            <span className="text-[10px] uppercase font-bold text-stone-400 shrink-0">
              Quick:
            </span>
            {SUGGESTION_CHIPS.map((chip) => {
              const Icon = chip.icon;
              return (
                <button
                  key={chip.label}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (soundEnabled) soundFX.playKeyClick?.();
                    executeCommand(chip.label);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono hover:scale-105 border transition-all duration-150 shrink-0 cursor-pointer shadow-2xs"
                  style={{
                    backgroundColor: `${fontColor}15`,
                    borderColor: `${fontColor}40`,
                    color: fontColor
                  }}
                  title={chip.desc}
                >
                  <Icon className="w-3 h-3" />
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>

          {/* Terminal Screen Body / Output Area */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 font-mono leading-relaxed"
            style={{
              fontSize: `${fontSize}px`,
              scrollbarWidth: 'thin',
              scrollbarColor: `${fontColor}60 transparent`
            }}
          >
            {history.map((entry) => (
              <div key={entry.id} className="space-y-1">
                {entry.type === 'user' && (
                  <div
                    className="flex items-center gap-1.5 flex-wrap font-semibold"
                    style={{ color: fontColor }}
                  >
                    <span className="select-none">
                      {entry.prompt || getPromptString(osStyle)}
                    </span>
                    <span className="text-stone-100 font-bold">{entry.command}</span>
                  </div>
                )}
                {entry.output && (
                  <pre
                    className={`whitespace-pre-wrap leading-relaxed ${
                      entry.isError ? 'text-rose-400 font-semibold' : ''
                    }`}
                    style={{
                      color: entry.isError ? '#ef4444' : fontColor,
                      fontSize: `${fontSize}px`
                    }}
                  >
                    {entry.output}
                  </pre>
                )}
                {entry.content && (
                  <pre
                    className="whitespace-pre-wrap leading-relaxed font-medium"
                    style={{ color: fontColor, fontSize: `${fontSize}px` }}
                  >
                    {entry.content}
                  </pre>
                )}
              </div>
            ))}

            {/* Active Input Line with Blinking Cursor */}
            <div
              className="flex items-center gap-1.5 pt-1 font-semibold shrink-0"
              style={{ color: fontColor }}
            >
              <span className="select-none shrink-0">
                {getPromptString(osStyle)}
              </span>
              <div className="relative flex-1 flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  style={{
                    color: '#f8fafc',
                    caretColor: fontColor,
                    fontSize: `${fontSize}px`,
                    fontFamily: FONT_FAMILIES[fontFamily] || FONT_FAMILIES.mono
                  }}
                  className="w-full bg-transparent font-mono focus:outline-none border-none p-0 tracking-wide"
                  spellCheck="false"
                  autoComplete="off"
                  autoCapitalize="off"
                  aria-label="Terminal command line input"
                />
              </div>
            </div>

            {/* Scroll Anchor */}
            <div ref={bottomAnchorRef} className="h-1" />
          </div>

          {/* Bottom Status Footer */}
          <div
            className={`flex items-center justify-between px-3.5 py-1.5 ${osStyles.footerBg} border-t text-[10px] text-stone-400 select-none`}
            style={{ borderColor: `${fontColor}20` }}
          >
            <div className="flex items-center gap-3">
              <span>Tab: Complete</span>
              <span className="hidden sm:inline">↑↓: History</span>
              <span className="hidden sm:inline">Esc or `: Close</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: fontColor }}>
                {osStyle === 'win'
                  ? 'PowerShell 7'
                  : osStyle === 'linux'
                  ? 'bash 5.2'
                  : 'zsh 5.9'}
              </span>
              <span>•</span>
              <span>{fontSize}px</span>
              <span>•</span>
              <span className="uppercase">{fontFamily}</span>
            </div>
          </div>

          {/* Manual Drag Resize Handles (Active only in floating non-maximized mode) */}
          {!isMaximized && (
            <>
              {/* Right Edge Resize Handle */}
              <div
                onMouseDown={(e) => handleResizeStart(e, 'e')}
                onTouchStart={(e) => handleResizeStart(e, 'e')}
                className="absolute top-10 right-0 bottom-4 w-2 cursor-ew-resize z-40 hover:bg-emerald-500/20 active:bg-emerald-500/40 transition-colors"
                title="Drag to resize width"
                aria-label="Resize width"
              />
              {/* Bottom Edge Resize Handle */}
              <div
                onMouseDown={(e) => handleResizeStart(e, 's')}
                onTouchStart={(e) => handleResizeStart(e, 's')}
                className="absolute bottom-0 left-4 right-6 h-2 cursor-ns-resize z-40 hover:bg-emerald-500/20 active:bg-emerald-500/40 transition-colors"
                title="Drag to resize height"
                aria-label="Resize height"
              />
              {/* Prominent Bottom-Right Corner Resize Grip Handle */}
              <div
                data-testid="terminal-resize-handle"
                onMouseDown={(e) => handleResizeStart(e, 'se')}
                onTouchStart={(e) => handleResizeStart(e, 'se')}
                className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-50 flex items-end justify-end p-1 group select-none hover:bg-emerald-500/15 rounded-br-xl transition-colors"
                title="Drag to resize window (min 360x260)"
                aria-label="Drag to resize window"
              >
                <svg
                  className="w-3.5 h-3.5 transition-colors pointer-events-none"
                  style={{ color: fontColor }}
                  viewBox="0 0 10 10"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <circle cx="8" cy="2" r="1" />
                  <circle cx="8" cy="5" r="1" />
                  <circle cx="5" cy="5" r="1" />
                  <circle cx="8" cy="8" r="1" />
                  <circle cx="5" cy="8" r="1" />
                  <circle cx="2" cy="8" r="1" />
                </svg>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

// Fullscreen Matrix Digital Rain Component
function MatrixDigitalRain({ onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    const chars =
      'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*+-=';

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    const draw = () => {
      // Semi-transparent black rect creates falling fade trail
      ctx.fillStyle = 'rgba(6, 10, 18, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00FF66';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Draw bright white head character
        ctx.fillStyle = '#E6FFFA';
        ctx.fillText(char, x, y);

        // Subsequent stream in emerald matrix green
        ctx.fillStyle = '#00FF66';

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-label="Matrix Digital Rain Simulation"
      className="fixed inset-0 z-[9999] bg-black cursor-pointer select-none"
      onClick={onClose}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-5 right-5 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-emerald-500/50 text-emerald-400 font-mono text-xs backdrop-blur-md shadow-lg pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>MATRIX ACTIVE • Click anywhere or press ESC to exit</span>
      </div>
    </div>
  );
}

export default React.memo(TerminalCLI);
