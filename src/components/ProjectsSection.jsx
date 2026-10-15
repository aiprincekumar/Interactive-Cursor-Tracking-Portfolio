import React, { useState } from 'react';
import { Sparkles, ArrowUpRight, Check, X, RefreshCw } from 'lucide-react';
import { GithubIcon } from './Icons';
import { soundFX } from '../utils/audio';

const COMPANION_PROJECTS = [
  {
    id: '03',
    title: 'ChromaCanvas Studio',
    category: 'Creative Tech & Shaders',
    subtitle: 'GPU-Accelerated WebGL Shader & Particle Playground',
    description: 'An in-browser creative coding suite utilizing custom GLSL fragment shaders and 250,000 GPU particles with real-time audio reactivity and 120 FPS render loops.',
    tags: ['WebGL', 'Three.js', 'GLSL', 'Web Audio API', 'React 19'],
    metrics: [
      { label: 'Framerate', val: '120 FPS' },
      { label: 'Audio Latency', val: '1.2ms' },
      { label: 'Particles', val: '250k' }
    ],
    github: 'https://github.com',
    live: 'https://example.com'
  },
  {
    id: '04',
    title: 'Aetheria Design System',
    category: 'Design Systems & Core UI',
    subtitle: 'High-Performance Minimalist Component Library',
    description: 'Ergonomic, accessible React UI library with zero-runtime CSS tokens, spring-physics micro-interactions, fluid container queries, and full screen-reader compliance.',
    tags: ['Tailwind CSS v4', 'TypeScript', 'Radix UI', 'Framer Motion'],
    metrics: [
      { label: 'Stars', val: '1.4k' },
      { label: 'Test Coverage', val: '99.4%' },
      { label: 'A11y Score', val: '100/100' }
    ],
    github: 'https://github.com',
    live: 'https://example.com'
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
            Curated engineering case studies balancing mission-critical reliability with cinematic visual interactions.
          </p>
        </div>

        {/* Quality Standard Card */}
        <div className="flex items-center gap-4 bg-white p-3.5 rounded-2xl border border-[#E7E2D8] shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E7E2D8] flex items-center justify-center text-[#FF4D6D]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Engineering Standard</div>
            <div className="text-sm font-extrabold text-[#18181B]">60–120 FPS • 100 Lighthouse</div>
          </div>
        </div>
      </div>

      {/* FLAGSHIP PROJECT 01: PolicyGuard AI (Reel t=12.5s) */}
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
                <span className="ml-3 text-xs font-mono font-bold text-stone-600">policy-audit-v2.4.pdf</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={runAuditSimulation}
                  disabled={isAuditing}
                  aria-label="Run live policy verification scan"
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white hover:bg-stone-100 text-[#18181B] border border-stone-200 text-[10px] font-bold font-mono transition-all active:scale-95 shadow-2xs cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 text-[#FF4D6D] ${isAuditing ? 'animate-spin' : ''}`} />
                  <span>{isAuditing ? 'Verifying...' : 'Re-scan'}</span>
                </button>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  STATUS: COMPLIANT
                </div>
              </div>
            </div>

            {/* Document Text Mockup with Highlighted Clauses (Reel t=12.5s) */}
            <div className="bg-white rounded-xl p-5 border border-[#ECE7DF] shadow-xs mb-4 space-y-3 relative">
              <div className="h-3 w-1/3 bg-stone-300 rounded-sm" />
              <div className="space-y-1.5">
                <div className="h-2.5 w-full bg-stone-100 rounded-xs" />
                <div className="h-2.5 w-5/6 bg-[#FF4D6D]/15 border border-[#FF4D6D]/30 rounded-xs flex items-center px-1">
                  <span className="text-[8px] font-mono font-bold text-[#FF4D6D]">CLAUSE 14.2: Data Sovereign Storage Verified</span>
                </div>
                <div className="h-2.5 w-full bg-stone-100 rounded-xs" />
                <div className="h-2.5 w-4/5 bg-[#FF4D6D]/15 border border-[#FF4D6D]/30 rounded-xs flex items-center px-1">
                  <span className="text-[8px] font-mono font-bold text-[#FF4D6D]">CLAUSE 08.1: Sub-Second Audit Trail Retention</span>
                </div>
                <div className="h-2.5 w-3/4 bg-stone-100 rounded-xs" />
              </div>

              {/* Floating Dark Tooltip Card matching Reel t=12.5s */}
              <div className="mt-3 p-3 rounded-xl bg-[#18181B] text-white shadow-lg border border-stone-800 text-xs">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#FF4D6D] font-bold mb-1">
                  <span>AI POLICY ENGINE</span>
                  <span>CONFIDENCE: 99.4%</span>
                </div>
                <p className="text-[11px] text-stone-300 font-normal leading-relaxed">
                  "A policy document with key clauses highlighted and risk telemetry extracted in sub-second inference passes."
                </p>
              </div>
            </div>

            {/* Live Telemetry Bar */}
            <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 px-1">
              <span>MODEL: AWS Bedrock Claude 3.5</span>
              <span className="text-emerald-700 font-bold">SCAN LATENCY: {scanLatency}ms</span>
            </div>
          </div>

          {/* Right Side: Editorial Metadata */}
          <div className="lg:col-span-5">
            <div>
              <span className="text-3xl font-black text-[#FF4D6D] font-mono tracking-tight">
                01
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] tracking-tight font-['Outfit',sans-serif] mt-1">
                PolicyGuard AI
              </h3>
              <p className="text-xs sm:text-sm font-bold text-[#FF4D6D] uppercase tracking-wider mt-1 mb-4">
                Enterprise Regulatory &amp; Compliance Audit Engine
              </p>

              <p className="text-sm text-stone-600 leading-relaxed font-normal mb-6">
                An AI-policy analysis that runs on the web, on the server, on mobile and on desktop. Helps documents processing and reduces contract review times. Uses modern NLP models to extract and analyze clauses.
              </p>

              {/* Clean Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 py-5 border-y border-[#ECE7DF] mb-6 font-['Outfit',sans-serif]">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] font-mono">
                    500+
                  </div>
                  <div className="text-xs text-stone-500 font-medium mt-0.5">
                    Enterprise Policies Processed
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#FF4D6D] font-mono">
                    92%
                  </div>
                  <div className="text-xs text-stone-500 font-medium mt-0.5">
                    Review Cycle Acceleration
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] font-mono">
                    0.2s
                  </div>
                  <div className="text-xs text-stone-500 font-medium mt-0.5">
                    Real-Time Inference Latency
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] font-mono">
                    99.4%
                  </div>
                  <div className="text-xs text-stone-500 font-medium mt-0.5">
                    Verification Accuracy
                  </div>
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 mb-8">
                {['React 19', 'FastAPI / Python', 'LangChain', 'PostgreSQL', 'Docker', 'AWS Bedrock'].map((t) => (
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
                href="https://example.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18181B] hover:bg-[#FF4D6D] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                <span>Live Case Study</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-stone-100 text-[#18181B] border border-[#D5CFCE] font-bold text-xs uppercase tracking-wider transition-colors"
                title="View Source on GitHub"
              >
                <GithubIcon className="w-4 h-4" />
                <span>Source</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FLAGSHIP PROJECT 02: Payment Gateway System (Reel t=14.0s) */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E7E2D8] shadow-xl shadow-stone-900/5 mb-14 transition-all duration-300 hover:border-[#18181B]/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Side: Circular State Machine Diagram matching Reel t=14.0s */}
          <div className="lg:col-span-7 bg-[#FAF8F5] rounded-2xl border border-[#E4DFD5] p-6 sm:p-10 shadow-inner flex flex-col items-center justify-center relative overflow-hidden min-h-[340px]">
            {/* Top Bar */}
            <div className="absolute top-4 left-5 right-5 flex items-center justify-between text-[11px] font-mono text-stone-500">
              <span className="font-bold text-[#18181B]">IDEMPOTENCY STATE MACHINE</span>
              <span className="text-[#FF4D6D] font-bold">LATENCY: 12ms</span>
            </div>

            {/* Circular Connected Diagram */}
            <div className="relative flex items-center justify-center w-full max-w-sm mt-4">
              {/* Central Dark Node: 'processing' */}
              <div
                onClick={() => cyclePaymentState('processing')}
                className={`w-24 h-24 rounded-full bg-[#18181B] text-white flex flex-col items-center justify-center shadow-xl border-4 transition-all duration-300 cursor-pointer z-10 ${
                  paymentState === 'processing' ? 'border-[#FF4D6D] scale-110 shadow-pink-500/25' : 'border-stone-700'
                }`}
              >
                <RefreshCw className={`w-4 h-4 text-[#FF4D6D] mb-1 ${paymentState === 'processing' ? 'animate-spin' : ''}`} />
                <span className="font-mono text-[11px] font-bold tracking-wider uppercase">processing</span>
              </div>

              {/* Left Branch Node: SUCCESS (Pink Badge) */}
              <div
                onClick={() => cyclePaymentState('success')}
                className={`absolute -right-2 sm:right-2 flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs font-bold transition-all duration-300 cursor-pointer shadow-md ${
                  paymentState === 'success'
                    ? 'bg-[#FF4D6D] text-white scale-110 shadow-pink-500/35 border-2 border-white'
                    : 'bg-white text-emerald-700 border border-emerald-300'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>SUCCESS</span>
              </div>

              {/* Connecting line to SUCCESS */}
              <div className="absolute right-12 w-16 h-0.5 bg-gradient-to-r from-stone-400 to-[#FF4D6D] pointer-events-none" />

              {/* Lower Branch Node: FAILED (Subtle Pill) */}
              <div
                onClick={() => cyclePaymentState('failed')}
                className={`absolute bottom-[-45px] flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-[11px] font-bold transition-all duration-300 cursor-pointer shadow-sm ${
                  paymentState === 'failed'
                    ? 'bg-rose-900 text-white scale-110 border-2 border-rose-500'
                    : 'bg-white text-stone-500 border border-stone-300'
                }`}
              >
                <X className="w-3 h-3" />
                <span>FAILED</span>
              </div>
            </div>

            {/* Interactive hint */}
            <div className="mt-14 text-center">
              <span className="text-[11px] font-mono text-stone-400">
                Click nodes to simulate state transitions &amp; webhook emission
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
                Payment Gateway System
              </h3>
              <p className="text-xs sm:text-sm font-bold text-[#FF4D6D] uppercase tracking-wider mt-1 mb-4">
                Full-Stack Distributed Transaction Architecture
              </p>

              <p className="text-sm text-stone-600 leading-relaxed font-normal mb-6">
                A full-stack resilient microservice payment gateway with idempotency keys and state machines. Distributed architecture for financial transactions with row-level locks, zero duplicate billing, and asynchronous event streaming.
              </p>

              {/* Clean Metrics Grid matching Reel t=14.0s */}
              <div className="grid grid-cols-2 gap-4 py-5 border-y border-[#ECE7DF] mb-6 font-['Outfit',sans-serif]">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] font-mono">
                    10,000+
                  </div>
                  <div className="text-xs text-stone-500 font-medium mt-0.5">
                    Tx / Sec Throughput
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#FF4D6D] font-mono">
                    99.9%
                  </div>
                  <div className="text-xs text-stone-500 font-medium mt-0.5">
                    High-Availability Uptime
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] font-mono">
                    40%
                  </div>
                  <div className="text-xs text-stone-500 font-medium mt-0.5">
                    P99 Latency Reduction
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] font-mono">
                    0ms
                  </div>
                  <div className="text-xs text-stone-500 font-medium mt-0.5">
                    Duplicate Charge Rate
                  </div>
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 mb-8">
                {['Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Stripe API', 'RabbitMQ'].map((t) => (
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
                href="https://example.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#18181B] hover:bg-[#FF4D6D] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                <span>Live Demo</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-stone-100 text-[#18181B] border border-[#D5CFCE] font-bold text-xs uppercase tracking-wider transition-colors"
                title="View Source on GitHub"
              >
                <GithubIcon className="w-4 h-4" />
                <span>Source</span>
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
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-stone-600 hover:text-[#18181B] flex items-center gap-1.5 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  Code
                </a>
                <a
                  href={proj.live}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#18181B] hover:text-[#FF4D6D] flex items-center gap-1 transition-colors"
                >
                  Live Preview
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
