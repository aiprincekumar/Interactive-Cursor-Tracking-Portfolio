import React, { useState } from 'react';
import { Sparkles, ArrowUpRight, Check, X, RefreshCw } from 'lucide-react';
import { GithubIcon } from './Icons';
import { soundFX } from '../utils/audio';

const COMPANION_PROJECTS = [
  {
    id: '03',
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

export default function ProjectsSection() {
  // State for Project 01 PolicyGuard Interactive Mockup
  const [isAuditing, setIsAuditing] = useState(false);
  const [scanLatency, setScanLatency] = useState(210);

  // State for Project 02 Payment Gateway State Machine
  const [paymentState, setPaymentState] = useState('processing'); // 'processing' | 'success' | 'failed'

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

  return (
    <section id="projects" className="py-24 px-4 md:px-8 max-w-6xl mx-auto scroll-mt-28">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E7E2D8] text-[#18181B] text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />
            04 ✦ Selected Work
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#18181B] tracking-tight font-['Outfit',sans-serif]">
            Selected work
          </h2>
          <p className="mt-3 text-stone-600 text-sm md:text-base max-w-xl font-normal leading-relaxed">
            Curated accounting, statutory tax audit, and enterprise data operations balancing high accuracy with rigorous compliance.
          </p>
        </div>

        {/* Quality Standard Card */}
        <div className="flex items-center gap-4 bg-white p-3.5 rounded-2xl border border-[#E7E2D8] shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E7E2D8] flex items-center justify-center text-[#FF4D6D]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Operational Standard</div>
            <div className="text-sm font-extrabold text-[#18181B]">100% Statutory Adherence • Audit Ready</div>
          </div>
        </div>
      </div>

      {/* FLAGSHIP PROJECT 01: GST & Income Tax Compliance & Verification Engine */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E7E2D8] shadow-xl shadow-stone-900/5 mb-14 transition-all duration-300 hover:border-[#18181B]/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Side: Document Preview with Highlighted Clauses & Tooltip Card */}
          <div className="lg:col-span-7 bg-[#FAF8F5] rounded-2xl border border-[#E4DFD5] p-5 sm:p-7 shadow-inner relative overflow-hidden">
            {/* Top Mockup Header Bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E3DA]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF4D6D]" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-3 text-xs font-mono font-bold text-stone-600">gstr2b-reconciliation-fy2324.pdf</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={runAuditSimulation}
                  disabled={isAuditing}
                  aria-label="Run live statutory ITC reconciliation audit"
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white hover:bg-stone-100 text-[#18181B] border border-stone-200 text-[10px] font-bold font-mono transition-all active:scale-95 shadow-2xs cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 text-[#FF4D6D] ${isAuditing ? 'animate-spin' : ''}`} />
                  <span>{isAuditing ? 'Auditing...' : 'Re-verify ITC'}</span>
                </button>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  STATUS: 100% RECONCILED
                </div>
              </div>
            </div>

            {/* Document Text Mockup with Highlighted Clauses */}
            <div className="bg-white rounded-xl p-5 border border-[#ECE7DF] shadow-xs mb-4 space-y-3 relative">
              <div className="h-3 w-1/3 bg-stone-300 rounded-sm" />
              <div className="space-y-1.5">
                <div className="h-2.5 w-full bg-stone-100 rounded-xs" />
                <div className="h-2.5 w-5/6 bg-[#FF4D6D]/15 border border-[#FF4D6D]/30 rounded-xs flex items-center px-1">
                  <span className="text-[8px] font-mono font-bold text-[#FF4D6D]">SECTION 16(2): Input Tax Credit (ITC) 2B Auto-Reconciliation Verified</span>
                </div>
                <div className="h-2.5 w-full bg-stone-100 rounded-xs" />
                <div className="h-2.5 w-4/5 bg-[#FF4D6D]/15 border border-[#FF4D6D]/30 rounded-xs flex items-center px-1">
                  <span className="text-[8px] font-mono font-bold text-[#FF4D6D]">SECTION 194C / 194J: TDS Withholding &amp; Challan 281 Verified</span>
                </div>
                <div className="h-2.5 w-3/4 bg-stone-100 rounded-xs" />
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
            <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 px-1">
              <span>AUDIT ENGINE: Portal API &amp; Tally Prime Sync</span>
              <span className="text-emerald-700 font-bold">RECONCILIATION SPEED: {scanLatency}ms</span>
            </div>
          </div>

          {/* Right Side: Editorial Metadata */}
          <div className="lg:col-span-5">
            <div>
              <span className="text-3xl font-black text-[#FF4D6D] font-mono tracking-tight">
                01
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] tracking-tight font-['Outfit',sans-serif] mt-1">
                GST &amp; Income Tax Compliance &amp; Verification Engine
              </h3>
              <p className="text-xs sm:text-sm font-bold text-[#FF4D6D] uppercase tracking-wider mt-1 mb-4">
                Statutory E-Filing, ITC 2B Reconciliation &amp; Tax Audit Verification
              </p>

              <p className="text-sm text-stone-600 leading-relaxed font-normal mb-6">
                Comprehensive taxation and statutory compliance system covering GSTR-1, GSTR-3B, GSTR-9, and Income Tax (ITR-1 to ITR-4) e-filing. Features automated Input Tax Credit (ITC) ledger reconciliation, 26AS/AIS/TIS variance verification, and TDS deduction auditing with 100% statutory adherence.
              </p>

              {/* Clean Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 py-5 border-y border-[#ECE7DF] mb-6 font-['Outfit',sans-serif]">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] font-mono">
                    500+
                  </div>
                  <div className="text-xs text-stone-500 font-medium mt-0.5">
                    Tax Returns &amp; Audits Filed
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#FF4D6D] font-mono">
                    100%
                  </div>
                  <div className="text-xs text-stone-500 font-medium mt-0.5">
                    Statutory Compliance Rate
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] font-mono">
                    ₹2.5Cr+
                  </div>
                  <div className="text-xs text-stone-500 font-medium mt-0.5">
                    Reconciled ITC Ledger Volume
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] font-mono">
                    0%
                  </div>
                  <div className="text-xs text-stone-500 font-medium mt-0.5">
                    Notice / Penalty Record
                  </div>
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 mb-8">
                {['GST Portal', 'ITR E-Filing', 'Tally Prime', 'Advanced Excel', 'Challan 280/281', 'Form 26AS / AIS'].map((t) => (
                  <span
                    key={t}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FAF8F5] text-stone-700 border border-[#E7E2D8]"
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
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18181B] hover:bg-[#FF4D6D] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                <span>Tax Compliance Advisory</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href="#experience"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-stone-100 text-[#18181B] border border-[#D5CFCE] font-bold text-xs uppercase tracking-wider transition-colors"
                title="View Practice History"
              >
                <span>Experience Details</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FLAGSHIP PROJECT 02: Tally Financial Accounting & Inventory Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E7E2D8] shadow-xl shadow-stone-900/5 mb-14 transition-all duration-300 hover:border-[#18181B]/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Side: Circular State Machine Diagram */}
          <div className="lg:col-span-7 bg-[#FAF8F5] rounded-2xl border border-[#E4DFD5] p-6 sm:p-10 shadow-inner flex flex-col items-center justify-center relative overflow-hidden min-h-[340px]">
            {/* Top Bar */}
            <div className="absolute top-4 left-5 right-5 flex items-center justify-between text-[11px] font-mono text-stone-500">
              <span className="font-bold text-[#18181B]">LEDGER TRANSACTION &amp; AUDIT PIPELINE</span>
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
                    : 'bg-white text-emerald-700 border border-emerald-300'
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
                    : 'bg-white text-stone-500 border border-stone-300'
                }`}
              >
                <X className="w-3 h-3" />
                <span>VARIANCE</span>
              </div>
            </div>

            {/* Interactive hint */}
            <div className="mt-14 text-center">
              <span className="text-[11px] font-mono text-stone-400">
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
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] tracking-tight font-['Outfit',sans-serif] mt-1">
                Tally Financial Accounting &amp; Inventory Management
              </h3>
              <p className="text-xs sm:text-sm font-bold text-[#FF4D6D] uppercase tracking-wider mt-1 mb-4">
                Double-Entry Ledger Pipeline, Voucher Auditing &amp; Multi-Location Stock Control
              </p>

              <p className="text-sm text-stone-600 leading-relaxed font-normal mb-6">
                End-to-end financial accounting and inventory management architecture deployed across commercial operations. Manages automated journal vouchers, ledger balancing, multi-godown stock valuations, aging analyses, and real-time Profit &amp; Loss and Balance Sheet generation with zero duplicate ledger entries.
              </p>

              {/* Clean Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 py-5 border-y border-[#ECE7DF] mb-6 font-['Outfit',sans-serif]">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] font-mono">
                    ₹10Cr+
                  </div>
                  <div className="text-xs text-stone-500 font-medium mt-0.5">
                    Annual Transactions Managed
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#FF4D6D] font-mono">
                    100%
                  </div>
                  <div className="text-xs text-stone-500 font-medium mt-0.5">
                    Double-Entry Balance Accuracy
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] font-mono">
                    4+ Years
                  </div>
                  <div className="text-xs text-stone-500 font-medium mt-0.5">
                    Continuous Ledger Maintenance
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] font-mono">
                    0
                  </div>
                  <div className="text-xs text-stone-500 font-medium mt-0.5">
                    Unreconciled Variances
                  </div>
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 mb-8">
                {['Tally ERP 9 / Prime', 'Double-Entry Ledgers', 'Bank Reconciliation (BRS)', 'Inventory Godown Control', 'P&L / Balance Sheet', 'MS Excel MIS'].map((t) => (
                  <span
                    key={t}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FAF8F5] text-stone-700 border border-[#E7E2D8]"
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
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18181B] hover:bg-[#FF4D6D] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                <span>Accounting Operations</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href="#experience"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-stone-100 text-[#18181B] border border-[#D5CFCE] font-bold text-xs uppercase tracking-wider transition-colors"
                title="View Practice History"
              >
                <span>Work History</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* COMPLEMENTARY CURATED CREATIONS (03, 04) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {COMPANION_PROJECTS.map((proj) => (
          <div
            key={proj.id}
            className="group relative bg-white rounded-3xl p-7 border border-[#E7E2D8] shadow-md shadow-stone-900/5 hover:border-[#18181B]/20 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-black text-[#FF4D6D] font-mono tracking-tight">
                  {proj.id}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E7E2D8] text-stone-600">
                  {proj.category}
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#18181B] group-hover:text-[#FF4D6D] transition-colors font-['Outfit',sans-serif]">
                {proj.title}
              </h3>
              <p className="text-xs font-semibold text-stone-500 mt-1 mb-3">
                {proj.subtitle}
              </p>
              <p className="text-xs text-stone-600 leading-relaxed font-normal mb-6">
                {proj.description}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#ECE7DF] mb-4 text-center">
                {proj.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="text-[10px] text-stone-400 uppercase font-mono">{m.label}</div>
                    <div className="text-xs font-bold text-[#18181B] font-mono mt-0.5">{m.val}</div>
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
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#FAF8F5] text-stone-600 border border-[#E7E2D8]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex items-center justify-between pt-3 border-t border-[#ECE7DF]">
                <a
                  href={proj.github}
                  className="text-xs font-semibold text-stone-600 hover:text-[#18181B] flex items-center gap-1.5 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  Documentation
                </a>
                <a
                  href={proj.live}
                  className="text-xs font-bold text-[#18181B] hover:text-[#FF4D6D] flex items-center gap-1 transition-colors"
                >
                  Inquire Details
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
