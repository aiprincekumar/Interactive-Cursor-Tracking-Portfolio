import React, { useState } from 'react';
import { Sparkles, ArrowUpRight, Check, X, RefreshCw } from 'lucide-react';
import { GithubIcon } from './Icons';
import { soundFX } from '../utils/audio';
import { useRoleTab } from '../context/RoleContext';

const OTHER_PROJECTS = [
  {
    id: '05',
    targetId: 'proj-enterprise-transformation',
    title: 'Executive Power BI Fiscal Intelligence & Reconciliation Engine',
    category: 'Corporate Controller & BI',
    subtitle: 'Enterprise Workflow Transformation Initiative & Multi-Entity General Ledger Analytics',
    description: 'Engineered an executive business intelligence architecture unifying multi-company accounting ledgers, automated bank feeds, and statutory GST compliance pipelines into real-time Power BI fiscal dashboards. Automated multi-ledger variance detection, cash flow projections, and margin analytics for executive leadership.',
    tags: ['Power BI', 'Corporate Controls', 'ERP Automation', 'Financial Analytics', 'Variance Intelligence', 'Executive Reporting'],
    metrics: [
      { label: 'Ledger Volume Tracked', val: '₹25Cr+' },
      { label: 'Reconciliation Speed', val: '99.9%' },
      { label: 'Reporting Latency', val: '-80%' },
      { label: 'Entities Consolidated', val: '6 Entities' }
    ],
    github: '#',
    live: '#contact'
  },
  {
    id: '06',
    targetId: 'proj-business-advisory',
    title: 'Corporate Financial Controls & Internal Audit Governance',
    category: 'Statutory Strategy & Governance',
    subtitle: 'Statutory Tax Strategy, Working Capital Modeling & Internal Audit Controls',
    description: 'Designed and deployed an institutional internal financial control framework across commercial branches. Automated GSTR-2B vs ERP purchase matching, advance tax liability forecasting, vendor withholding tax governance, and institutional audit trails, eliminating non-compliance risks and tax penalties.',
    tags: ['Statutory Strategy', 'Internal Financial Controls', 'Audit Automation', 'Working Capital', 'Audit Trails', 'Risk Governance'],
    metrics: [
      { label: 'Statutory Adherence', val: '100%' },
      { label: 'Tax Variance Prevented', val: '₹45L+' },
      { label: 'Audit Readiness', val: '100%' },
      { label: 'Control Pipeline', val: 'Zero Notice' }
    ],
    github: '#',
    live: '#contact'
  }
];

const COMPANION_PROJECTS = [
  {
    id: '03',
    targetId: 'proj-day-nulm',
    title: 'DAY-NULM Skill India MIS Reporting Portal',
    category: 'Govt Operations & Analytics',
    subtitle: 'Deendayal Antyodaya Yojana - National Urban Livelihoods Mission',
    description: 'Centralized MIS database management and candidate tracking system for Skill India mission batches. Orchestrated trainee enrolment data, biometric attendance logs, assessment scheduling, certification progress, and government compliance analytics.',
    tags: ['Government MIS Portal', 'Skill India (DAY-NULM)', 'Candidate Lifecycle Analytics', 'Batch Certification', 'Advanced Excel', 'Data Auditing'],
    metrics: [
      { label: 'Batches Tracked', val: '50+' },
      { label: 'Trainees Managed', val: '2,500+' },
      { label: 'Reporting Accuracy', val: '99.8%' }
    ],
    github: '#',
    live: '#contact'
  },
  {
    id: '04',
    targetId: 'proj-smart-card',
    title: 'Multi-District Smart Card Operations & Enrollment Engine',
    category: 'Field Operations & Data Systems',
    subtitle: 'Cross-State Field Data Collection, Biometric Verification & Citizen Rollout',
    description: 'Large-scale identity and smart card logistics pipeline across 4 key districts in Bihar & Jharkhand. Handled citizen field verification, biometric data capture workflows, secure upload synchronization, hardware diagnostics, and prompt multi-tier issue resolution.',
    tags: ['Smart Card Deployment', 'Biometric Enrollment', '4 District Operations', 'Bihar & Jharkhand', 'Hardware Troubleshooting', 'Identity Verification'],
    metrics: [
      { label: 'Districts Covered', val: '4 Districts' },
      { label: 'Cards Issued', val: '50,000+' },
      { label: 'Turnaround Time', val: '-35%' }
    ],
    github: '#',
    live: '#contact'
  }
];

const VIBE_CODING_PROJECTS = [
  {
    id: '07',
    targetId: 'proj-ai-saas-generator',
    title: 'AI Prompt-to-Fullstack SaaS Generator',
    category: 'Autonomous SaaS & Prototyping',
    subtitle: 'Zero-to-One Fullstack App Synthesis with Next.js 14, Tailwind & Supabase',
    description: 'Engineered a rapid fullstack software generation engine powered by Claude 3.5 Sonnet, Cursor AI, and modern web frameworks. Translates natural language application briefs into production-grade multi-tenant Next.js web applications with responsive Tailwind UI, PostgreSQL schemas, Row-Level Security, and automated Stripe checkout flows in minutes.',
    tags: ['Next.js 14', 'Cursor AI', 'Claude 3.5 Sonnet', 'Supabase', 'Tailwind CSS', 'Stripe API', 'TypeScript'],
    metrics: [
      { label: 'Scaffolding Speed', val: '< 3 Mins' },
      { label: 'Code Velocity', val: '10x Faster' },
      { label: 'Generated SaaS MVPs', val: '25+ Deployed' },
      { label: 'Test Pass Rate', val: '99.4%' }
    ],
    github: '#',
    live: '#contact'
  },
  {
    id: '08',
    targetId: 'proj-agent-workflow-engine',
    title: 'Autonomous Multi-Agent Workflow Engine',
    category: 'Agentic AI Architecture',
    subtitle: 'Autonomous Multi-Agent Loop, Dynamic Tool Orchestration & Self-Healing Code',
    description: 'Architected a decentralized multi-agent system coordinating specialized LLM subagents (Researcher, Architect, Coder, Evaluator). Implemented dynamic tool-calling harnesses, persistent context windows, and automated git pull requests with Oxlint and Vitest regression guardrails.',
    tags: ['Multi-Agent DAG', 'Agentic Workflows', 'Claude Code', 'Tool Calling', 'Self-Healing Loops', 'Git Ops'],
    metrics: [
      { label: 'Autonomous Tasks', val: '100+' },
      { label: 'Self-Healing Rate', val: '94.2%' },
      { label: 'Dev Hours Saved', val: '350+ Hrs' },
      { label: 'Loop Latency', val: '< 1.2s' }
    ],
    github: '#',
    live: '#contact'
  },
  {
    id: '09',
    targetId: 'proj-doc-code-synthesizer',
    title: 'Real-Time AI Document & Code Synthesizer',
    category: 'Enterprise Generative AI',
    subtitle: 'Streaming LLM Parsing, Vector Indexing & Bi-Directional Artifact Generation',
    description: 'Engineered a real-time reactive canvas bridging complex document and ledger parsing with automated code, formula, and visual dashboard generation. Integrates streaming LLM completions, client-side vector search, KaTeX mathematical typesetting, and responsive generative UI components.',
    tags: ['Generative UI', 'Streaming LLM', 'Vector Embeddings', 'React 19', 'Zod Validation', 'Edge Functions', 'Tailwind CSS'],
    metrics: [
      { label: 'Parsing Throughput', val: '50 Pgs/sec' },
      { label: 'Streaming Latency', val: '85ms' },
      { label: 'Token Efficiency', val: '+45%' },
      { label: 'User Rating', val: '4.9 / 5.0' }
    ],
    github: '#',
    live: '#contact'
  }
];

export default function ProjectsSection() {
  let roleContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    roleContext = useRoleTab();
  } catch {
    // fallback
  }
  const activeRole = roleContext?.activeRole ?? 'accountant';
  const isOverview = roleContext?.isOverview ?? (activeRole === 'overview');
  const isOther = roleContext?.isOther ?? (activeRole === 'other');
  const isVibe = Boolean(roleContext?.isVibeCoding || activeRole === 'vibe_coding');
  const accentColor = isOverview ? '#6366F1' : isVibe ? '#10B981' : isOther ? '#8B5CF6' : activeRole === 'mis' ? '#3B82F6' : '#FF4D6D';

  // State for Project 01 PolicyGuard Interactive Mockup
  const [isAuditing, setIsAuditing] = useState(false);
  const [scanLatency, setScanLatency] = useState(210);

  // State for Project 02 Payment Gateway State Machine
  const [paymentState, setPaymentState] = useState('processing'); // 'processing' | 'success' | 'failed'

  // State for Project 03 Registry Sync Simulation
  const [isRegistryAuditing, setIsRegistryAuditing] = useState(false);
  const [registryLatency, setRegistryLatency] = useState(165);

  // State for Other Project 05 Enterprise Workflow Interactive Mockup
  const [isWorkflowAuditing, setIsWorkflowAuditing] = useState(false);
  const [workflowLatency, setWorkflowLatency] = useState(145);

  // State for Other Project 06 Governance State Machine
  const [governanceState, setGovernanceState] = useState('governed'); // 'governed' | 'optimized' | 'auditing'

  // State for Vibe Coding Project 07 Generator Simulation
  const [isGeneratingApp, setIsGeneratingApp] = useState(false);
  const [generationLatency, setGenerationLatency] = useState(140);

  // State for Vibe Coding Project 08 Multi-Agent DAG State Machine
  const [agentState, setAgentState] = useState('executing'); // 'planning' | 'executing' | 'verified'

  // State for Vibe Coding Project 09 Synthesizer Simulation
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [streamLatency, setStreamLatency] = useState(85);

  const runGeneratorSimulation = () => {
    if (isGeneratingApp) return;
    setIsGeneratingApp(true);
    soundFX.playFocusBeep();

    setTimeout(() => {
      setGenerationLatency(Math.floor(Math.random() * 35) + 120);
      setIsGeneratingApp(false);
      soundFX.playSparkle();
    }, 650);
  };

  const cycleAgentState = (nextState) => {
    setAgentState(nextState);
    if (nextState === 'verified') soundFX.playSparkle();
    else soundFX.playFocusBeep();
  };

  const runSynthesizerSimulation = () => {
    if (isSynthesizing) return;
    setIsSynthesizing(true);
    soundFX.playFocusBeep();

    setTimeout(() => {
      setStreamLatency(Math.floor(Math.random() * 20) + 75);
      setIsSynthesizing(false);
      soundFX.playSparkle();
    }, 650);
  };

  const runAuditSimulation = () => {
    if (isAuditing) return;
    setIsAuditing(true);
    soundFX.playFocusBeep();
    
    setTimeout(() => {
      setScanLatency(Math.floor(Math.random() * 40) + 180);
      setIsAuditing(false);
      soundFX.playSparkle();
    }, 650);
  };

  const cyclePaymentState = (nextState) => {
    setPaymentState(nextState);
    if (nextState === 'success') soundFX.playSparkle();
    else soundFX.playFocusBeep();
  };

  const runRegistrySimulation = () => {
    if (isRegistryAuditing) return;
    setIsRegistryAuditing(true);
    soundFX.playFocusBeep();

    setTimeout(() => {
      setRegistryLatency(Math.floor(Math.random() * 25) + 150);
      setIsRegistryAuditing(false);
      soundFX.playSparkle();
    }, 650);
  };

  const runWorkflowSimulation = () => {
    if (isWorkflowAuditing) return;
    setIsWorkflowAuditing(true);
    soundFX.playFocusBeep();

    setTimeout(() => {
      setWorkflowLatency(Math.floor(Math.random() * 30) + 120);
      setIsWorkflowAuditing(false);
      soundFX.playSparkle();
    }, 650);
  };

  const cycleGovernanceState = (nextState) => {
    setGovernanceState(nextState);
    if (nextState === 'optimized') soundFX.playSparkle();
    else soundFX.playFocusBeep();
  };

  const renderProject01 = (trackBadge = null) => (
    <div id="proj-gst-tax" className="scroll-mt-28 bg-white dark:bg-[#161122] rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xl shadow-stone-900/5 mb-14 transition-all duration-300 hover:border-[#18181B]/20 dark:hover:border-[#3D3055]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Side: Document Preview with Highlighted Clauses & Tooltip Card */}
        <div className="lg:col-span-7 bg-[#FAF8F5] dark:bg-[#100C1A] rounded-2xl border border-[#E4DFD5] dark:border-[#2D2340] p-5 sm:p-7 shadow-inner relative overflow-hidden">
          {/* Top Mockup Header Bar */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E3DA] dark:border-stone-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF4D6D]" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-3 text-xs font-mono font-bold text-stone-600 dark:text-stone-400">gstr2b-reconciliation-fy2324.pdf</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={runAuditSimulation}
                disabled={isAuditing}
                aria-label="Run live statutory ITC reconciliation audit"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-[#18181B] dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-[10px] font-bold font-mono transition-all active:scale-95 shadow-2xs cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 text-[#FF4D6D] ${isAuditing ? 'animate-spin' : ''}`} />
                <span>{isAuditing ? 'Auditing...' : 'Re-verify ITC'}</span>
              </button>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                STATUS: 100% RECONCILED
              </div>
            </div>
          </div>

          {/* Document Text Mockup with Highlighted Clauses */}
          <div className="bg-white dark:bg-stone-900/90 rounded-xl p-5 border border-[#ECE7DF] dark:border-stone-800 shadow-xs mb-4 space-y-3 relative">
            <div className="h-3 w-1/3 bg-stone-300 dark:bg-stone-700 rounded-sm" />
            <div className="space-y-1.5">
              <div className="h-2.5 w-full bg-stone-100 dark:bg-stone-800 rounded-xs" />
              <div className="h-2.5 w-5/6 bg-[#FF4D6D]/15 border border-[#FF4D6D]/30 rounded-xs flex items-center px-1">
                <span className="text-[8px] font-mono font-bold text-[#FF4D6D]">SECTION 16(2): Input Tax Credit (ITC) 2B Auto-Reconciliation Verified</span>
              </div>
              <div className="h-2.5 w-full bg-stone-100 dark:bg-stone-800 rounded-xs" />
              <div className="h-2.5 w-4/5 bg-[#FF4D6D]/15 border border-[#FF4D6D]/30 rounded-xs flex items-center px-1">
                <span className="text-[8px] font-mono font-bold text-[#FF4D6D]">SECTION 194C / 194J: TDS Withholding &amp; Challan 281 Verified</span>
              </div>
              <div className="h-2.5 w-3/4 bg-stone-100 dark:bg-stone-800 rounded-xs" />
            </div>

            {/* Floating Dark Tooltip Card */}
            <div className="mt-3 p-3 rounded-xl bg-[#18181B] text-white shadow-lg border border-stone-800 text-xs">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#FF4D6D] font-bold mb-1">
                <span>STATUTORY TAX AUDIT ENGINE</span>
                <span>ITC RECONCILIATION: 100%</span>
              </div>
              <p className="text-[11px] text-stone-300 font-normal leading-relaxed">
                "GSTR-2B vs Purchase Register automated audit matching invoices, supplier GSTINs, and tax liability ledgers without mismatch penalties."
              </p>
            </div>
          </div>

          {/* Live Telemetry Bar */}
          <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 dark:text-stone-400 px-1">
            <span>AUDIT ENGINE: Portal API &amp; Tally Prime Sync</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">RECONCILIATION SPEED: {scanLatency}ms</span>
          </div>
        </div>

        {/* Right Side: Editorial Metadata */}
        <div className="lg:col-span-5">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-[#FF4D6D] font-mono tracking-tight">
                01
              </span>
              {trackBadge && (
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {trackBadge}
                </span>
              )}
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] dark:text-white tracking-tight font-['Outfit',sans-serif] mt-1">
              GST &amp; Income Tax Compliance &amp; Verification Engine
            </h3>
            <p className="text-xs sm:text-sm font-bold text-[#FF4D6D] uppercase tracking-wider mt-1 mb-4">
              Statutory E-Filing, ITC 2B Reconciliation &amp; Tax Audit Verification
            </p>

            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal mb-6">
              Comprehensive taxation and statutory compliance system covering GSTR-1, GSTR-3B, GSTR-9, and Income Tax (ITR-1 to ITR-4) e-filing. Features automated Input Tax Credit (ITC) ledger reconciliation, 26AS/AIS/TIS variance verification, and TDS deduction auditing with 100% statutory adherence.
            </p>

            {/* Clean Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 py-5 border-y border-[#ECE7DF] dark:border-stone-800 mb-6 font-['Outfit',sans-serif]">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] dark:text-stone-100 font-mono">
                  500+
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                  Tax Returns &amp; Audits Filed
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#FF4D6D] font-mono">
                  100%
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                  Statutory Compliance Rate
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] dark:text-stone-100 font-mono">
                  ₹2.5Cr+
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                  Reconciled ITC Ledger Volume
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] dark:text-stone-100 font-mono">
                  0%
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                  Notice / Penalty Record
                </div>
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-1.5 mb-8">
              {['GST Portal', 'ITR E-Filing', 'Tally Prime', 'Advanced Excel', 'Challan 280/281', 'Form 26AS / AIS'].map((t) => (
                <span
                  key={t}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FAF8F5] dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-[#E7E2D8] dark:border-stone-800"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18181B] hover:bg-[#FF4D6D] dark:bg-white dark:text-[#18181B] dark:hover:bg-[#FF4D6D] dark:hover:text-white text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              <span>Tax Compliance Advisory</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href="#experience"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-[#18181B] dark:text-stone-200 border border-[#D5CFCE] dark:border-stone-800 font-bold text-xs uppercase tracking-wider transition-colors"
              title="View Practice History"
            >
              <span>Experience Details</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProject02 = () => (
    <div id="proj-tally-accounting" className="scroll-mt-28 bg-white dark:bg-[#161122] rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xl shadow-stone-900/5 mb-14 transition-all duration-300 hover:border-[#18181B]/20 dark:hover:border-[#3D3055]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Side: Circular State Machine Diagram */}
        <div className="lg:col-span-7 bg-[#FAF8F5] dark:bg-[#100C1A] rounded-2xl border border-[#E4DFD5] dark:border-[#2D2340] p-6 sm:p-10 shadow-inner flex flex-col items-center justify-center relative overflow-hidden min-h-[340px]">
          {/* Top Bar */}
          <div className="absolute top-4 left-5 right-5 flex items-center justify-between text-[11px] font-mono text-stone-500 dark:text-stone-400">
            <span className="font-bold text-[#18181B] dark:text-stone-200">LEDGER TRANSACTION &amp; AUDIT PIPELINE</span>
            <span className="text-[#FF4D6D] font-bold">SETTLEMENT: REAL-TIME</span>
          </div>

          {/* Circular Connected Diagram */}
          <div className="relative flex items-center justify-center w-full max-w-sm mt-4">
            {/* Central Dark Node: 'processing' -> POSTING */}
            <div
              onClick={() => cyclePaymentState('processing')}
              className={`w-24 h-24 rounded-full bg-[#18181B] text-white flex flex-col items-center justify-center shadow-xl border-4 transition-all duration-300 cursor-pointer z-10 ${
                paymentState === 'processing' ? 'border-[#FF4D6D] scale-110 shadow-pink-500/25' : 'border-stone-700'
              }`}
            >
              <RefreshCw className={`w-4 h-4 text-[#FF4D6D] mb-1 ${paymentState === 'processing' ? 'animate-spin' : ''}`} />
              <span className="font-mono text-[11px] font-bold tracking-wider uppercase">POSTING</span>
            </div>

            {/* Right Branch Node: RECONCILED (Pink Badge) */}
            <div
              onClick={() => cyclePaymentState('success')}
              className={`absolute -right-2 sm:right-2 flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs font-bold transition-all duration-300 cursor-pointer shadow-md ${
                paymentState === 'success'
                  ? 'bg-[#FF4D6D] text-white scale-110 shadow-pink-500/35 border-2 border-white'
                  : 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>RECONCILED</span>
            </div>

            {/* Connecting line to RECONCILED */}
            <div className="absolute right-12 w-16 h-0.5 bg-gradient-to-r from-stone-400 to-[#FF4D6D] pointer-events-none" />

            {/* Lower Branch Node: VARIANCE (Subtle Pill) */}
            <div
              onClick={() => cyclePaymentState('failed')}
              className={`absolute bottom-[-45px] flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-[11px] font-bold transition-all duration-300 cursor-pointer shadow-sm ${
                paymentState === 'failed'
                  ? 'bg-rose-900 text-white scale-110 border-2 border-rose-500'
                  : 'bg-white dark:bg-stone-900 text-stone-500 dark:text-stone-400 border border-stone-300 dark:border-stone-700'
              }`}
            >
              <X className="w-3 h-3" />
              <span>VARIANCE</span>
            </div>
          </div>

          {/* Interactive hint */}
          <div className="mt-14 text-center">
            <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500">
              Click nodes to simulate double-entry voucher lifecycle &amp; ledger balancing
            </span>
          </div>
        </div>

        {/* Right Side: Editorial Metadata */}
        <div className="lg:col-span-5">
          <div>
            <span className="text-3xl font-black text-[#FF4D6D] font-mono tracking-tight">
              02
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] dark:text-white tracking-tight font-['Outfit',sans-serif] mt-1">
              Tally Financial Accounting &amp; Inventory Management
            </h3>
            <p className="text-xs sm:text-sm font-bold text-[#FF4D6D] uppercase tracking-wider mt-1 mb-4">
              Double-Entry Ledger Pipeline, Voucher Auditing &amp; Multi-Location Stock Control
            </p>

            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal mb-6">
              End-to-end financial accounting and inventory management architecture deployed across commercial operations. Manages automated journal vouchers, ledger balancing, multi-godown stock valuations, aging analyses, and real-time Profit &amp; Loss and Balance Sheet generation with zero duplicate ledger entries.
            </p>

            {/* Clean Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 py-5 border-y border-[#ECE7DF] dark:border-stone-800 mb-6 font-['Outfit',sans-serif]">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] dark:text-stone-100 font-mono">
                  ₹10Cr+
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                  Annual Transactions Managed
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#FF4D6D] font-mono">
                  100%
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                  Double-Entry Balance Accuracy
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] dark:text-stone-100 font-mono">
                  7+ Years
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                  Continuous Ledger Maintenance
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] dark:text-stone-100 font-mono">
                  0
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                  Unreconciled Variances
                </div>
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-1.5 mb-8">
              {['Tally ERP 9 / Prime', 'Double-Entry Ledgers', 'Bank Reconciliation (BRS)', 'Inventory Godown Control', 'P&L / Balance Sheet', 'MS Excel MIS'].map((t) => (
                <span
                  key={t}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FAF8F5] dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-[#E7E2D8] dark:border-stone-800"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18181B] hover:bg-[#FF4D6D] dark:bg-white dark:text-[#18181B] dark:hover:bg-[#FF4D6D] dark:hover:text-white text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              <span>Accounting Operations</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href="#experience"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-[#18181B] dark:text-stone-200 border border-[#D5CFCE] dark:border-stone-800 font-bold text-xs uppercase tracking-wider transition-colors"
              title="View Practice History"
            >
              <span>Work History</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProject03Flagship = (trackBadge = null) => {
    const proj = COMPANION_PROJECTS[0];
    return (
      <div id={proj.targetId} className="scroll-mt-28 bg-white dark:bg-[#161122] rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xl shadow-stone-900/5 mb-14 transition-all duration-300 hover:border-[#18181B]/20 dark:hover:border-[#3D3055]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Side: Mockup */}
          <div className="lg:col-span-7 bg-[#FAF8F5] dark:bg-[#100C1A] rounded-2xl border border-[#E4DFD5] dark:border-[#2D2340] p-5 sm:p-7 shadow-inner relative overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E3DA] dark:border-stone-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF4D6D]" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-3 text-xs font-mono font-bold text-stone-600 dark:text-stone-400">day-nulm-candidate-registry-v3.csv</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={runRegistrySimulation}
                  disabled={isRegistryAuditing}
                  aria-label="Run live candidate registry sync"
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-[#18181B] dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-[10px] font-bold font-mono transition-all active:scale-95 shadow-2xs cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 text-[#FF4D6D] ${isRegistryAuditing ? 'animate-spin' : ''}`} />
                  <span>{isRegistryAuditing ? 'Syncing...' : 'Simulate Sync'}</span>
                </button>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  STATUS: 100% SYNCHRONIZED
                </div>
              </div>
            </div>

            {/* Flow Stages Mockup */}
            <div className="bg-white dark:bg-stone-900/90 rounded-xl p-5 border border-[#ECE7DF] dark:border-stone-800 shadow-xs mb-4 space-y-3 relative">
              <div className="h-3 w-1/3 bg-stone-300 dark:bg-stone-700 rounded-sm" />
              <div className="space-y-1.5">
                <div className="h-2.5 w-full bg-stone-100 dark:bg-stone-800 rounded-xs" />
                <div className="h-2.5 w-5/6 bg-[#FF4D6D]/15 border border-[#FF4D6D]/30 rounded-xs flex items-center px-1">
                  <span className="text-[8px] font-mono font-bold text-[#FF4D6D]">BATCH 2022-JH-04: 250 Trainees Mobilized &amp; Biometric Enrolled</span>
                </div>
                <div className="h-2.5 w-full bg-stone-100 dark:bg-stone-800 rounded-xs" />
                <div className="h-2.5 w-4/5 bg-[#FF4D6D]/15 border border-[#FF4D6D]/30 rounded-xs flex items-center px-1">
                  <span className="text-[8px] font-mono font-bold text-[#FF4D6D]">PORTAL SYNC: Skill India SDMS &amp; Jharkhand DUDA Verified</span>
                </div>
                <div className="h-2.5 w-3/4 bg-stone-100 dark:bg-stone-800 rounded-xs" />
              </div>

              {/* Floating Dark Tooltip Card */}
              <div className="mt-3 p-3 rounded-xl bg-[#18181B] text-white shadow-lg border border-stone-800 text-xs">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#FF4D6D] font-bold mb-1">
                  <span>DAY-NULM CENTRALIZED MIS ENGINE</span>
                  <span>ACCURACY: 99.8%</span>
                </div>
                <p className="text-[11px] text-stone-300 font-normal leading-relaxed">
                  "Centralized government MIS platform tracking candidate lifecycle across enrollment, attendance, assessment, and placement certification with zero data discrepancies."
                </p>
              </div>
            </div>

            {/* Live Telemetry Bar */}
            <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 dark:text-stone-400 px-1">
              <span>DATA ENGINE: SDMS &amp; DUDA Portal Synchronization</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">INTEGRITY SPEED: {registryLatency}ms</span>
            </div>
          </div>

          {/* Right Side: Editorial Metadata */}
          <div className="lg:col-span-5">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-[#FF4D6D] font-mono tracking-tight">
                  {proj.id}
                </span>
                {trackBadge && (
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {trackBadge}
                  </span>
                )}
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] dark:text-white tracking-tight font-['Outfit',sans-serif] mt-1">
                {proj.title}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-[#FF4D6D] uppercase tracking-wider mt-1 mb-4">
                {proj.subtitle}
              </p>

              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal mb-6">
                {proj.description}
              </p>

              {/* Clean Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 py-5 border-y border-[#ECE7DF] dark:border-stone-800 mb-6 font-['Outfit',sans-serif]">
                {proj.metrics.map((m, idx) => (
                  <div key={m.label}>
                    <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${idx === 2 ? 'text-[#FF4D6D]' : 'text-[#18181B] dark:text-stone-100'}`}>
                      {m.val}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                      {m.label}
                    </div>
                  </div>
                ))}
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] dark:text-stone-100 font-mono">
                    100%
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                    Portal Synchronization
                  </div>
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 mb-8">
                {proj.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FAF8F5] dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-[#E7E2D8] dark:border-stone-800"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3">
              <a
                href={proj.live}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18181B] hover:bg-[#FF4D6D] dark:bg-white dark:text-[#18181B] dark:hover:bg-[#FF4D6D] dark:hover:text-white text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                <span>MIS Operations</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href="#experience"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-[#18181B] dark:text-stone-200 border border-[#D5CFCE] dark:border-stone-800 font-bold text-xs uppercase tracking-wider transition-colors"
                title="View Practice History"
              >
                <span>Experience Details</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVibeProject01 = (trackBadge = null) => {
    const proj = VIBE_CODING_PROJECTS[0];
    return (
      <div id={proj.targetId} className="scroll-mt-28 bg-white dark:bg-[#161122] rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xl shadow-stone-900/5 mb-14 transition-all duration-300 hover:border-[#10B981]/30 dark:hover:border-[#10B981]/30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Side: Mockup */}
          <div className="lg:col-span-7 bg-[#FAF8F5] dark:bg-[#100C1A] rounded-2xl border border-[#E4DFD5] dark:border-[#2D2340] p-5 sm:p-7 shadow-inner relative overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E3DA] dark:border-stone-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="ml-3 text-xs font-mono font-bold text-stone-600 dark:text-stone-400">ai-saas-generator-workflow.tsx</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={runGeneratorSimulation}
                  disabled={isGeneratingApp}
                  aria-label="Simulate AI fullstack app generation"
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-[#18181B] dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-[10px] font-bold font-mono transition-all active:scale-95 shadow-2xs cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 text-[#10B981] ${isGeneratingApp ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingApp ? 'Scaffolding...' : 'Simulate Synthesis'}</span>
                </button>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  STATUS: 100% DEPLOYED
                </div>
              </div>
            </div>

            {/* Code / Generation Stage Mockup */}
            <div className="bg-white dark:bg-stone-900/90 rounded-xl p-5 border border-[#ECE7DF] dark:border-stone-800 shadow-xs mb-4 space-y-3 relative">
              <div className="h-3 w-1/3 bg-stone-300 dark:bg-stone-700 rounded-sm" />
              <div className="space-y-1.5 font-mono text-[9px] leading-relaxed">
                <div className="p-2 rounded-md bg-[#10B981]/10 border border-[#10B981]/30 text-emerald-800 dark:text-emerald-300">
                  <span className="font-bold text-[#10B981]">PROMPT:</span> "Generate multi-tenant SaaS with Next.js 14 App Router, Supabase Auth, Row-Level Security, and Stripe checkout."
                </div>
                <div className="p-2 rounded-md bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300">
                  <span className="font-bold text-indigo-500 dark:text-indigo-400">OUTPUT:</span> 12 production files generated • 100% TypeScript typed • Edge runtime validated
                </div>
              </div>

              {/* Floating Dark Tooltip Card */}
              <div className="mt-3 p-3 rounded-xl bg-[#18181B] text-white shadow-lg border border-stone-800 text-xs">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#10B981] font-bold mb-1">
                  <span>PROMPT-TO-SAAS SYNTHESIS ENGINE</span>
                  <span>VELOCITY: 10x ACCELERATION</span>
                </div>
                <p className="text-[11px] text-stone-300 font-normal leading-relaxed">
                  "Translates high-level natural language application briefs into fully responsive Next.js 14 web applications with Supabase database schemas and Stripe integration."
                </p>
              </div>
            </div>

            {/* Live Telemetry Bar */}
            <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 dark:text-stone-400 px-1">
              <span>STACK: Next.js 14 • Supabase • Claude 3.5 Sonnet</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">SYNTHESIS SPEED: {generationLatency}ms</span>
            </div>
          </div>

          {/* Right Side: Editorial Metadata */}
          <div className="lg:col-span-5">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-[#10B981] font-mono tracking-tight">
                  {proj.id}
                </span>
                {trackBadge && (
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {trackBadge}
                  </span>
                )}
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] dark:text-white tracking-tight font-['Outfit',sans-serif] mt-1">
                {proj.title}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-[#10B981] uppercase tracking-wider mt-1 mb-4">
                {proj.subtitle}
              </p>

              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal mb-6">
                {proj.description}
              </p>

              {/* Clean Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 py-5 border-y border-[#ECE7DF] dark:border-stone-800 mb-6 font-['Outfit',sans-serif]">
                {proj.metrics.map((m, idx) => (
                  <div key={m.label}>
                    <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${idx === 1 ? 'text-[#10B981]' : 'text-[#18181B] dark:text-stone-100'}`}>
                      {m.val}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 mb-8">
                {proj.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FAF8F5] dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-[#E7E2D8] dark:border-stone-800"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3">
              <a
                href={proj.live}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18181B] hover:bg-[#10B981] dark:bg-white dark:text-[#18181B] dark:hover:bg-[#10B981] dark:hover:text-white text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                <span>Inquire AI SaaS Architecture</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href="#experience"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-[#18181B] dark:text-stone-200 border border-[#D5CFCE] dark:border-stone-800 font-bold text-xs uppercase tracking-wider transition-colors"
                title="View Practice History"
              >
                <span>Experience Details</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVibeProject02 = () => {
    const proj = VIBE_CODING_PROJECTS[1];
    return (
      <div id={proj.targetId} className="scroll-mt-28 bg-white dark:bg-[#161122] rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xl shadow-stone-900/5 mb-14 transition-all duration-300 hover:border-[#10B981]/30 dark:hover:border-[#10B981]/30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Side: Circular State Machine Diagram */}
          <div className="lg:col-span-7 bg-[#FAF8F5] dark:bg-[#100C1A] rounded-2xl border border-[#E4DFD5] dark:border-[#2D2340] p-6 sm:p-10 shadow-inner flex flex-col items-center justify-center relative overflow-hidden min-h-[340px]">
            {/* Top Bar */}
            <div className="absolute top-4 left-5 right-5 flex items-center justify-between text-[11px] font-mono text-stone-500 dark:text-stone-400">
              <span className="font-bold text-[#18181B] dark:text-stone-200">AUTONOMOUS MULTI-AGENT ORCHESTRATION PIPELINE</span>
              <span className="text-[#10B981] font-bold">STATE: AUTONOMOUS</span>
            </div>

            {/* Circular Connected Diagram */}
            <div className="relative flex items-center justify-center w-full max-w-sm mt-4">
              {/* Central Dark Node: 'executing' -> CODER */}
              <div
                onClick={() => cycleAgentState('executing')}
                className={`w-24 h-24 rounded-full bg-[#18181B] text-white flex flex-col items-center justify-center shadow-xl border-4 transition-all duration-300 cursor-pointer z-10 ${
                  agentState === 'executing' ? 'border-[#10B981] scale-110 shadow-emerald-500/25' : 'border-stone-700'
                }`}
              >
                <RefreshCw className={`w-4 h-4 text-[#10B981] mb-1 ${agentState === 'executing' ? 'animate-spin' : ''}`} />
                <span className="font-mono text-[10px] font-bold tracking-wider uppercase">CODER</span>
              </div>

              {/* Right Branch Node: VERIFIED (Green Badge) */}
              <div
                onClick={() => cycleAgentState('verified')}
                className={`absolute -right-2 sm:right-2 flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs font-bold transition-all duration-300 cursor-pointer shadow-md ${
                  agentState === 'verified'
                    ? 'bg-[#10B981] text-white scale-110 shadow-emerald-500/35 border-2 border-white'
                    : 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>VERIFIED (100%)</span>
              </div>

              {/* Connecting line to VERIFIED */}
              <div className="absolute right-12 w-16 h-0.5 bg-gradient-to-r from-stone-400 to-[#10B981] pointer-events-none" />

              {/* Lower Branch Node: PLANNER (DAG) */}
              <div
                onClick={() => cycleAgentState('planning')}
                className={`absolute bottom-[-45px] flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-[11px] font-bold transition-all duration-300 cursor-pointer shadow-sm ${
                  agentState === 'planning'
                    ? 'bg-indigo-900 text-white scale-110 border-2 border-indigo-400'
                    : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-300 dark:border-stone-700'
                }`}
              >
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>PLANNER (DAG)</span>
              </div>
            </div>

            {/* Interactive hint */}
            <div className="mt-14 text-center">
              <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500">
                Click nodes to simulate autonomous multi-agent task dispatch &amp; verification
              </span>
            </div>
          </div>

          {/* Right Side: Editorial Metadata */}
          <div className="lg:col-span-5">
            <div>
              <span className="text-3xl font-black text-[#10B981] font-mono tracking-tight">
                {proj.id}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] dark:text-white tracking-tight font-['Outfit',sans-serif] mt-1">
                {proj.title}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-[#10B981] uppercase tracking-wider mt-1 mb-4">
                {proj.subtitle}
              </p>

              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal mb-6">
                {proj.description}
              </p>

              {/* Clean Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 py-5 border-y border-[#ECE7DF] dark:border-stone-800 mb-6 font-['Outfit',sans-serif]">
                {proj.metrics.map((m, idx) => (
                  <div key={m.label}>
                    <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${idx === 1 ? 'text-[#10B981]' : 'text-[#18181B] dark:text-stone-100'}`}>
                      {m.val}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 mb-8">
                {proj.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FAF8F5] dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-[#E7E2D8] dark:border-stone-800"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3">
              <a
                href={proj.live}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18181B] hover:bg-[#10B981] dark:bg-white dark:text-[#18181B] dark:hover:bg-[#10B981] dark:hover:text-white text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                <span>Explore Agent Architecture</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href="#experience"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-[#18181B] dark:text-stone-200 border border-[#D5CFCE] dark:border-stone-800 font-bold text-xs uppercase tracking-wider transition-colors"
                title="View Practice History"
              >
                <span>Work History</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVibeProject03 = () => {
    const proj = VIBE_CODING_PROJECTS[2];
    return (
      <div id={proj.targetId} className="scroll-mt-28 bg-white dark:bg-[#161122] rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xl shadow-stone-900/5 mb-14 transition-all duration-300 hover:border-[#10B981]/30 dark:hover:border-[#10B981]/30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Side: Mockup */}
          <div className="lg:col-span-7 bg-[#FAF8F5] dark:bg-[#100C1A] rounded-2xl border border-[#E4DFD5] dark:border-[#2D2340] p-5 sm:p-7 shadow-inner relative overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E3DA] dark:border-stone-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-3 text-xs font-mono font-bold text-stone-600 dark:text-stone-400">realtime-doc-code-synthesizer.tsx</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={runSynthesizerSimulation}
                  disabled={isSynthesizing}
                  aria-label="Simulate real-time streaming synthesis"
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-[#18181B] dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-[10px] font-bold font-mono transition-all active:scale-95 shadow-2xs cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 text-[#10B981] ${isSynthesizing ? 'animate-spin' : ''}`} />
                  <span>{isSynthesizing ? 'Streaming...' : 'Simulate Stream'}</span>
                </button>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  STATUS: STREAMING ACTIVE
                </div>
              </div>
            </div>

            {/* Content Mockup */}
            <div className="bg-white dark:bg-stone-900/90 rounded-xl p-5 border border-[#ECE7DF] dark:border-stone-800 shadow-xs mb-4 space-y-3 relative">
              <div className="h-3 w-1/3 bg-stone-300 dark:bg-stone-700 rounded-sm" />
              <div className="space-y-1.5 font-mono text-[9px] leading-relaxed">
                <div className="p-2 rounded-md bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300">
                  <span className="font-bold text-[#10B981]">VECTOR EMBEDDINGS:</span> 50-chunk document index cached • Cosine similarity search @ 12ms
                </div>
                <div className="p-2 rounded-md bg-[#10B981]/10 border border-[#10B981]/30 text-emerald-800 dark:text-emerald-300">
                  <span className="font-bold text-[#10B981]">GENERATIVE ARTIFACT:</span> Dynamic KaTeX math formulas + reactive telemetry charts synthesized
                </div>
              </div>

              {/* Floating Dark Tooltip Card */}
              <div className="mt-3 p-3 rounded-xl bg-[#18181B] text-white shadow-lg border border-stone-800 text-xs">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#10B981] font-bold mb-1">
                  <span>REAL-TIME GENERATIVE UI CANVAS</span>
                  <span>STREAMING LATENCY: 85ms</span>
                </div>
                <p className="text-[11px] text-stone-300 font-normal leading-relaxed">
                  "Bi-directional reactive canvas translating dense PDF documents and ledger sheets into interactive TypeScript components, KaTeX formulas, and chart widgets."
                </p>
              </div>
            </div>

            {/* Live Telemetry Bar */}
            <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 dark:text-stone-400 px-1">
              <span>PIPELINE: Edge Functions • Vector Store • React 19</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">STREAM SPEED: {streamLatency}ms</span>
            </div>
          </div>

          {/* Right Side: Editorial Metadata */}
          <div className="lg:col-span-5">
            <div>
              <span className="text-3xl font-black text-[#10B981] font-mono tracking-tight">
                {proj.id}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] dark:text-white tracking-tight font-['Outfit',sans-serif] mt-1">
                {proj.title}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-[#10B981] uppercase tracking-wider mt-1 mb-4">
                {proj.subtitle}
              </p>

              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal mb-6">
                {proj.description}
              </p>

              {/* Clean Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 py-5 border-y border-[#ECE7DF] dark:border-stone-800 mb-6 font-['Outfit',sans-serif]">
                {proj.metrics.map((m, idx) => (
                  <div key={m.label}>
                    <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${idx === 1 ? 'text-[#10B981]' : 'text-[#18181B] dark:text-stone-100'}`}>
                      {m.val}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 mb-8">
                {proj.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FAF8F5] dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-[#E7E2D8] dark:border-stone-800"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3">
              <a
                href={proj.live}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18181B] hover:bg-[#10B981] dark:bg-white dark:text-[#18181B] dark:hover:bg-[#10B981] dark:hover:text-white text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                <span>Explore Synthesizer</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href="#experience"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-[#18181B] dark:text-stone-200 border border-[#D5CFCE] dark:border-stone-800 font-bold text-xs uppercase tracking-wider transition-colors"
                title="View Practice History"
              >
                <span>Work History</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="projects" className="relative w-full py-24 px-4 sm:px-6 lg:px-8 scroll-mt-28">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#161122] border border-[#E7E2D8] dark:border-[#2D2340] text-[#18181B] dark:text-[#F5F2F8] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs whitespace-nowrap max-w-full overflow-x-auto">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: accentColor || '#FF4D6D' }}
            />
            <span className="truncate sm:overflow-visible">04 ✦ Selected Work &bull; {activeRole === 'overview' ? 'Executive Overview' : isVibe ? 'AI & Vibe Coding' : (isOther || activeRole === 'other') ? 'Corporate Controller & BI' : activeRole === 'mis' ? 'Data & MIS' : 'Accounting & Tax'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#18181B] dark:text-white tracking-tight font-['Outfit',sans-serif] leading-[1.08] mb-3 whitespace-normal sm:whitespace-nowrap">
            Selected <span className="text-[#FF4D6D]" style={{ color: accentColor }}>work</span>.
          </h2>
          <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: accentColor || '#FF4D6D' }} />
          <p className="text-stone-600 dark:text-stone-400 text-sm md:text-base max-w-xl font-normal leading-relaxed">
            {isOverview || activeRole === 'overview'
              ? 'Curated multi-domain flagship initiatives combining statutory tax compliance automation, public sector MIS data systems, and autonomous AI vibe coding.'
              : isVibe
              ? 'Rapid full-stack SaaS prototypes, autonomous multi-agent developer workflows, and streaming AI generative document synthesizers.'
              : isOther || activeRole === 'other'
              ? 'Enterprise financial controls, automated ERP reconciliation pipelines, and executive Power BI business intelligence dashboards.'
              : activeRole === 'mis'
              ? 'Large-scale government MIS databases, biometric enrollment operations, and regional administrative analytics.'
              : 'Curated accounting, statutory tax audit, and enterprise data operations balancing high accuracy with rigorous compliance.'}
          </p>
        </div>

        {/* Quality Standard Card */}
        <div className="flex items-center gap-4 bg-white dark:bg-[#161122] p-3.5 rounded-2xl border border-[#E7E2D8] dark:border-[#2D2340] shadow-xs">
          <div
            className="w-10 h-10 rounded-xl bg-[#FAF8F5] dark:bg-[#100C1A] border border-[#E7E2D8] dark:border-[#2D2340] flex items-center justify-center"
            style={{
              color: isOverview
                ? '#6366F1'
                : isVibe
                ? '#10B981'
                : isOther
                ? '#8B5CF6'
                : activeRole === 'mis'
                ? '#3B82F6'
                : '#FF4D6D'
            }}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-stone-500 dark:text-stone-400 font-semibold uppercase tracking-wider">Operational Standard</div>
            <div className="text-sm font-extrabold text-[#18181B] dark:text-stone-200">
              {isOverview || activeRole === 'overview'
                ? 'Multi-Track • 100% Compliance & 10x AI Shipping Velocity'
                : isVibe
                ? '10x Shipping Velocity • Autonomous Agent Loops'
                : activeRole === 'accountant'
                ? '100% Statutory Adherence • Audit Ready'
                : activeRole === 'mis'
                ? '99.8% Data Accuracy • 4-District Verification'
                : 'Corporate Controls • 100% Governance'}
            </div>
          </div>
        </div>
      </div>

      {/* Role-Specific Tabpanel Container */}
      <div
        role="tabpanel"
        id={`projects-role-panel-${activeRole}`}
        aria-labelledby={`projects-role-tab-${activeRole}`}
        tabIndex={0}
        key={activeRole}
        className="animate-tab-fade focus:outline-none"
      >
        {isOverview || activeRole === 'overview' ? (
          <>
            {renderProject01('Financial Track')}
            {renderProject03Flagship('Data & Operations Track')}
            {renderVibeProject01('AI & Vibe Coding Track')}
          </>
        ) : isOther || activeRole === 'other' ? (
          <>
            {/* AI-Synthesized Role Banner */}
            <div className="mb-8 p-4 rounded-2xl bg-purple-50/90 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 shadow-xs flex items-center gap-3.5 text-purple-900 dark:text-purple-200">
              <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0 text-lg">
                🤖
              </div>
              <div className="text-xs sm:text-sm font-medium leading-relaxed">
                <span className="font-bold text-purple-700 dark:text-purple-300">🤖 AI-Synthesized Role (Derived from Verified Tracks):</span>{' '}
                This specialized profile was synthesized by AI from verified Accountant (Statutory Finance) and MIS (Data Analytics &amp; Operations) competencies.
              </div>
            </div>

            {/* FLAGSHIP PROJECT 05: Executive Power BI Fiscal Intelligence & Reconciliation Engine */}
            <div id="proj-enterprise-transformation" className="scroll-mt-28 bg-white dark:bg-[#161122] rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xl shadow-stone-900/5 mb-14 transition-all duration-300 hover:border-[#18181B]/20 dark:hover:border-[#3D3055]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Side: Mockup */}
                <div className="lg:col-span-7 bg-[#FAF8F5] dark:bg-[#100C1A] rounded-2xl border border-[#E4DFD5] dark:border-[#2D2340] p-5 sm:p-7 shadow-inner relative overflow-hidden">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E3DA] dark:border-stone-800">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#FF4D6D]" />
                      <span className="w-3 h-3 rounded-full bg-amber-400" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="ml-3 text-xs font-mono font-bold text-stone-600 dark:text-stone-400">power-bi-corporate-fiscal-matrix.pbix</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={runWorkflowSimulation}
                        disabled={isWorkflowAuditing}
                        aria-label="Run live workflow optimization audit"
                        className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-[#18181B] dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-[10px] font-bold font-mono transition-all active:scale-95 shadow-2xs cursor-pointer"
                      >
                        <RefreshCw className={`w-3 h-3 text-[#FF4D6D] ${isWorkflowAuditing ? 'animate-spin' : ''}`} />
                        <span>{isWorkflowAuditing ? 'Syncing...' : 'Simulate Sync'}</span>
                      </button>
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        STATUS: 100% SYNCHRONIZED
                      </div>
                    </div>
                  </div>

                  {/* Flow Stages Mockup */}
                  <div className="bg-white dark:bg-stone-900/90 rounded-xl p-5 border border-[#ECE7DF] dark:border-stone-800 shadow-xs mb-4 space-y-3 relative">
                    <div className="h-3 w-1/3 bg-stone-300 dark:bg-stone-700 rounded-sm" />
                    <div className="space-y-1.5">
                      <div className="h-2.5 w-full bg-stone-100 dark:bg-stone-800 rounded-xs" />
                      <div className="h-2.5 w-5/6 bg-[#FF4D6D]/15 border border-[#FF4D6D]/30 rounded-xs flex items-center px-1">
                        <span className="text-[8px] font-mono font-bold text-[#FF4D6D]">STAGE 01: Multi-Entity Ledger Ingestion &amp; ERP Data Synchronization</span>
                      </div>
                      <div className="h-2.5 w-full bg-stone-100 dark:bg-stone-800 rounded-xs" />
                      <div className="h-2.5 w-4/5 bg-[#FF4D6D]/15 border border-[#FF4D6D]/30 rounded-xs flex items-center px-1">
                        <span className="text-[8px] font-mono font-bold text-[#FF4D6D]">STAGE 02: Automated Variance Detection &amp; Statutory Audit Gatekeeper</span>
                      </div>
                      <div className="h-2.5 w-3/4 bg-stone-100 dark:bg-stone-800 rounded-xs" />
                    </div>

                    {/* Floating Dark Tooltip Card */}
                    <div className="mt-3 p-3 rounded-xl bg-[#18181B] text-white shadow-lg border border-stone-800 text-xs">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#FF4D6D] font-bold mb-1">
                        <span>POWER BI FISCAL CONTROLLER ENGINE</span>
                        <span>RECONCILIATION: 99.9%</span>
                      </div>
                      <p className="text-[11px] text-stone-300 font-normal leading-relaxed">
                        "Automated multi-entity financial intelligence pipeline synchronizing Tally ledgers, banking APIs, and statutory tax filings into real-time executive decision matrices."
                      </p>
                    </div>
                  </div>

                  {/* Live Telemetry Bar */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 dark:text-stone-400 px-1">
                    <span>ORCHESTRATION: Power BI &amp; ERP Integration Bus</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">SYNC SPEED: {workflowLatency}ms</span>
                  </div>
                </div>

                {/* Right Side: Editorial Metadata */}
                <div className="lg:col-span-5">
                  <div>
                    <span className="text-3xl font-black text-[#FF4D6D] font-mono tracking-tight">
                      {OTHER_PROJECTS[0].id}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] dark:text-white tracking-tight font-['Outfit',sans-serif] mt-1">
                      {OTHER_PROJECTS[0].title}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-[#FF4D6D] uppercase tracking-wider mt-1 mb-4">
                      {OTHER_PROJECTS[0].subtitle}
                    </p>

                    <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal mb-6">
                      {OTHER_PROJECTS[0].description}
                    </p>

                    {/* Clean Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4 py-5 border-y border-[#ECE7DF] dark:border-stone-800 mb-6 font-['Outfit',sans-serif]">
                      {OTHER_PROJECTS[0].metrics.map((m, idx) => (
                        <div key={m.label}>
                          <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${idx === 1 ? 'text-[#FF4D6D]' : 'text-[#18181B] dark:text-stone-100'}`}>
                            {m.val}
                          </div>
                          <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-8">
                      {OTHER_PROJECTS[0].tags.map((t) => (
                        <span
                          key={t}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FAF8F5] dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-[#E7E2D8] dark:border-stone-800"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex items-center gap-3">
                    <a
                      href={OTHER_PROJECTS[0].live}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18181B] hover:bg-[#FF4D6D] dark:bg-white dark:text-[#18181B] dark:hover:bg-[#FF4D6D] dark:hover:text-white text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                    >
                      <span>Fiscal Analytics Advisory</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>

                    <a
                      href="#experience"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-[#18181B] dark:text-stone-200 border border-[#D5CFCE] dark:border-stone-800 font-bold text-xs uppercase tracking-wider transition-colors"
                      title="View Practice History"
                    >
                      <span>Experience Details</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* FLAGSHIP PROJECT 06: Corporate Financial Controls & Internal Audit Governance */}
            <div id="proj-business-advisory" className="scroll-mt-28 bg-white dark:bg-[#161122] rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E7E2D8] dark:border-[#2D2340] shadow-xl shadow-stone-900/5 mb-14 transition-all duration-300 hover:border-[#18181B]/20 dark:hover:border-[#3D3055]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Side: Circular State Machine Diagram */}
                <div className="lg:col-span-7 bg-[#FAF8F5] dark:bg-[#100C1A] rounded-2xl border border-[#E4DFD5] dark:border-[#2D2340] p-6 sm:p-10 shadow-inner flex flex-col items-center justify-center relative overflow-hidden min-h-[340px]">
                  {/* Top Bar */}
                  <div className="absolute top-4 left-5 right-5 flex items-center justify-between text-[11px] font-mono text-stone-500 dark:text-stone-400">
                    <span className="font-bold text-[#18181B] dark:text-stone-200">ORGANIZATIONAL GOVERNANCE &amp; CONTROL PIPELINE</span>
                    <span className="text-[#FF4D6D] font-bold">CONTROL: ACTIVE</span>
                  </div>

                  {/* Circular Connected Diagram */}
                  <div className="relative flex items-center justify-center w-full max-w-sm mt-4">
                    {/* Central Dark Node: 'governed' */}
                    <div
                      onClick={() => cycleGovernanceState('governed')}
                      className={`w-24 h-24 rounded-full bg-[#18181B] text-white flex flex-col items-center justify-center shadow-xl border-4 transition-all duration-300 cursor-pointer z-10 ${
                        governanceState === 'governed' ? 'border-[#FF4D6D] scale-110 shadow-pink-500/25' : 'border-stone-700'
                      }`}
                    >
                      <RefreshCw className={`w-4 h-4 text-[#FF4D6D] mb-1 ${governanceState === 'governed' ? 'animate-spin' : ''}`} />
                      <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-center leading-tight">CONTROL</span>
                    </div>

                    {/* Right Branch Node: OPTIMIZED (Pink Badge) */}
                    <div
                      onClick={() => cycleGovernanceState('optimized')}
                      className={`absolute -right-2 sm:right-2 flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs font-bold transition-all duration-300 cursor-pointer shadow-md ${
                        governanceState === 'optimized'
                          ? 'bg-[#FF4D6D] text-white scale-110 shadow-pink-500/35 border-2 border-white'
                          : 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>OPTIMIZED (₹45L+)</span>
                    </div>

                    {/* Connecting line to OPTIMIZED */}
                    <div className="absolute right-12 w-16 h-0.5 bg-gradient-to-r from-stone-400 to-[#FF4D6D] pointer-events-none" />

                    {/* Lower Branch Node: AUDIT READY (Pill) */}
                    <div
                      onClick={() => cycleGovernanceState('auditing')}
                      className={`absolute bottom-[-45px] flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-[11px] font-bold transition-all duration-300 cursor-pointer shadow-sm ${
                        governanceState === 'auditing'
                          ? 'bg-emerald-800 text-white scale-110 border-2 border-emerald-400'
                          : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-300 dark:border-stone-700'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>AUDIT READY (100%)</span>
                    </div>
                  </div>

                  {/* Interactive hint */}
                  <div className="mt-14 text-center">
                    <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500">
                      Click nodes to simulate strategic corporate controls &amp; audit governance
                    </span>
                  </div>
                </div>

                {/* Right Side: Editorial Metadata */}
                <div className="lg:col-span-5">
                  <div>
                    <span className="text-3xl font-black text-[#FF4D6D] font-mono tracking-tight">
                      {OTHER_PROJECTS[1].id}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] dark:text-white tracking-tight font-['Outfit',sans-serif] mt-1">
                      {OTHER_PROJECTS[1].title}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-[#FF4D6D] uppercase tracking-wider mt-1 mb-4">
                      {OTHER_PROJECTS[1].subtitle}
                    </p>

                    <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal mb-6">
                      {OTHER_PROJECTS[1].description}
                    </p>

                    {/* Clean Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4 py-5 border-y border-[#ECE7DF] dark:border-stone-800 mb-6 font-['Outfit',sans-serif]">
                      {OTHER_PROJECTS[1].metrics.map((m, idx) => (
                        <div key={m.label}>
                          <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${idx === 1 ? 'text-[#FF4D6D]' : 'text-[#18181B] dark:text-stone-100'}`}>
                            {m.val}
                          </div>
                          <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-8">
                      {OTHER_PROJECTS[1].tags.map((t) => (
                        <span
                          key={t}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FAF8F5] dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-[#E7E2D8] dark:border-stone-800"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex items-center gap-3">
                    <a
                      href={OTHER_PROJECTS[1].live}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18181B] hover:bg-[#FF4D6D] dark:bg-white dark:text-[#18181B] dark:hover:bg-[#FF4D6D] dark:hover:text-white text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                    >
                      <span>Corporate Controls Advisory</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>

                    <a
                      href="#experience"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-[#18181B] dark:text-stone-200 border border-[#D5CFCE] dark:border-stone-800 font-bold text-xs uppercase tracking-wider transition-colors"
                      title="View Practice History"
                    >
                      <span>Work History</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : isVibe || activeRole === 'vibe_coding' ? (
          <>
            {renderVibeProject01(null)}
            {renderVibeProject02()}
            {renderVibeProject03()}
          </>
        ) : activeRole === 'accountant' ? (
          <>
            {renderProject01(null)}
            {renderProject02()}
          </>
        ) : (
          /* MIS & ANALYTICS PROJECTS (03, 04) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {COMPANION_PROJECTS.map((proj) => (
              <div
                key={proj.id}
                id={proj.targetId}
                className="scroll-mt-28 group relative bg-white dark:bg-[#161122] rounded-3xl p-7 border border-[#E7E2D8] dark:border-[#2D2340] shadow-md shadow-stone-900/5 hover:border-[#18181B]/20 dark:hover:border-[#3D3055] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-[#FF4D6D] font-mono tracking-tight">
                      {proj.id}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF8F5] dark:bg-[#100C1A] border border-[#E7E2D8] dark:border-[#2D2340] text-stone-600 dark:text-stone-300">
                      {proj.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#18181B] dark:text-white group-hover:text-[#FF4D6D] transition-colors font-['Outfit',sans-serif]">
                    {proj.title}
                  </h3>
                  <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-1 mb-3">
                    {proj.subtitle}
                  </p>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-normal mb-6">
                    {proj.description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#ECE7DF] dark:border-stone-800 mb-4 text-center">
                    {proj.metrics.map((m) => (
                      <div key={m.label}>
                        <div className="text-[10px] text-stone-400 dark:text-stone-500 uppercase font-mono">{m.label}</div>
                        <div className="text-xs font-bold text-[#18181B] dark:text-stone-200 font-mono mt-0.5">{m.val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Tag Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {proj.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#FAF8F5] dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-[#E7E2D8] dark:border-stone-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#ECE7DF] dark:border-stone-800">
                    <a
                      href={proj.github}
                      className="text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-[#18181B] dark:hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      Documentation
                    </a>
                    <a
                      href={proj.live}
                      className="text-xs font-bold text-[#18181B] dark:text-stone-200 hover:text-[#FF4D6D] dark:hover:text-[#FF4D6D] flex items-center gap-1 transition-colors"
                    >
                      Inquire Details
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </section>
  );
}
