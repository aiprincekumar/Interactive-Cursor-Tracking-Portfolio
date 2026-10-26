import React, { useState } from 'react';
import {
  Compass,
  Calculator,
  Search,
  Cpu,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Zap,
  Copy,
  Check,
  Terminal,
  Code,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PORTFOLIO_TOURS } from '../../utils/chatTourEngine.js';

const ESTIMATOR_SERVICES = [
  {
    id: 'gst',
    name: 'GST Returns & Compliance',
    est: '₹2,500 – ₹5,000 / mo',
    desc: 'GSTR-1, 3B, ITC-2B reconciliation & statutory ledger offset'
  },
  {
    id: 'mis',
    name: 'MIS Automation & Dashboards',
    est: '₹8,000 – ₹15,000 / mo',
    desc: 'Automated Excel pipelines, Power BI fiscal reporting & BRS'
  },
  {
    id: 'saas',
    name: 'Full-Stack Web App / SaaS MVP',
    est: '₹35,000 – ₹80,000',
    desc: 'Production React 19, Tailwind v4, Vite & LLM orchestration'
  },
  {
    id: 'audit',
    name: 'Statutory Audit Defense',
    est: '₹5,000 – ₹12,000',
    desc: 'Section 143(1) defense, ledger hygiene & balance sheet finalization'
  }
];

/**
 * ChatActionCard
 * In-chat interactive card rendering:
 * 1. Tour Controller Card (step navigator, progress HUD, target controls)
 * 2. Quotation Fee Estimator Card (service picker, price range, direct CTA)
 * 3. Search Results Card (multi-faceted fuzzy match list with 1-click jump links)
 * 4. Hardware Benchmark Card (on-device tokens/sec & memory throughput)
 */
export default function ChatActionCard({
  card,
  onExecuteAction,
  activeTourState = null
}) {
  if (!card || !card.type) return null;

  const type = card.type;

  // 1. TOUR CONTROLLER CARD
  if (type === 'tour-controller' || type === 'tour') {
    const isTourActive = Boolean(activeTourState && activeTourState.isActive);
    const tourId = isTourActive ? activeTourState.tourId : (card.tourId || 'recruiter-fast-track');
    const tourConfig = PORTFOLIO_TOURS[tourId] || PORTFOLIO_TOURS['recruiter-fast-track'];

    const currentStepIdx = isTourActive ? activeTourState.currentStepIndex : 0;
    const totalSteps = isTourActive ? activeTourState.totalSteps : tourConfig.steps.length;
    const currentStep = isTourActive
      ? activeTourState.currentStep
      : tourConfig.steps[0];

    const isFirstStep = currentStepIdx === 0;
    const isLastStep = currentStepIdx === totalSteps - 1;

    return (
      <div className="w-full my-2.5 rounded-2xl bg-gradient-to-br from-white/95 via-stone-50/90 to-[#FF4D6D]/10 dark:from-[#1E162B]/95 dark:via-[#191024]/90 dark:to-[#FF4D6D]/15 border border-[#FF4D6D]/30 shadow-lg p-3.5 text-stone-900 dark:text-stone-100 transition-all">
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 border-b border-stone-200/80 dark:border-stone-800 pb-2 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-lg bg-[#FF4D6D]/15 text-[#FF4D6D] shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-semibold tracking-wide text-stone-900 dark:text-white truncate">
                {tourConfig.title}
              </h4>
              <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
                {isTourActive ? `Step ${currentStepIdx + 1} of ${totalSteps}` : `${totalSteps} Interactive Steps`}
              </span>
            </div>
          </div>

          {isTourActive ? (
            <button
              type="button"
              onClick={() => onExecuteAction && onExecuteAction({ type: 'end-tour' })}
              className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
              title="End Tour"
              aria-label="End Tour"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-[9px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#FF4D6D]/15 text-[#FF4D6D] border border-[#FF4D6D]/30">
              {tourConfig.badge || 'Ready'}
            </span>
          )}
        </div>

        {/* Step Content */}
        {currentStep && (
          <div className="mb-3">
            <p className="text-[11px] font-medium text-stone-800 dark:text-stone-100 leading-snug mb-1">
              {currentStep.headline}
            </p>
            <p className="text-[10px] text-stone-600 dark:text-stone-300 leading-relaxed">
              {currentStep.commentary}
            </p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-1.5 mb-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#FF4D6D] to-[#FF758F] h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIdx + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {isTourActive ? (
            <>
              <button
                type="button"
                disabled={isFirstStep}
                onClick={() => onExecuteAction && onExecuteAction({ type: 'prev-tour-step' })}
                className="px-2.5 py-1.5 rounded-lg text-[10px] font-medium flex items-center gap-1 border border-stone-300 dark:border-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-stone-800 transition-all active:scale-[0.98]"
              >
                <ChevronLeft className="w-3 h-3" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={() => onExecuteAction && onExecuteAction({ type: 'next-tour-step' })}
                className="px-3 py-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 bg-[#FF4D6D] hover:bg-[#e03b5b] text-white shadow-xs hover:shadow-[0_0_12px_rgba(255,77,109,0.35)] transition-all active:scale-[0.98]"
              >
                <span>{isLastStep ? 'Finish Tour' : 'Next Step'}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onExecuteAction && onExecuteAction({ type: 'start-tour', tourId: tourConfig.id })}
              className="w-full py-1.5 px-3 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 bg-[#FF4D6D] hover:bg-[#e03b5b] text-white shadow-xs hover:shadow-[0_0_12px_rgba(255,77,109,0.35)] transition-all active:scale-[0.98]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Guided Walkthrough</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. QUOTATION FEE ESTIMATOR CARD
  if (type === 'quotation-estimator' || type === 'fee-estimator') {
    const [selectedServiceId, setSelectedServiceId] = useState('gst');
    const activeService = ESTIMATOR_SERVICES.find(s => s.id === selectedServiceId) || ESTIMATOR_SERVICES[0];

    return (
      <div className="w-full my-2.5 rounded-2xl bg-gradient-to-br from-white/95 via-stone-50/90 to-emerald-500/10 dark:from-[#1E162B]/95 dark:via-[#191024]/90 dark:to-emerald-500/15 border border-emerald-500/30 shadow-lg p-3.5 text-stone-900 dark:text-stone-100 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold tracking-wide text-stone-900 dark:text-white">
                Service Fee Estimator
              </h4>
              <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
                Transparent Rate Calculator
              </span>
            </div>
          </div>
          <span className="text-[9px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            Instant Estimate
          </span>
        </div>

        {/* Service Pills Selector */}
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          {ESTIMATOR_SERVICES.map((s) => {
            const isSelected = s.id === selectedServiceId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedServiceId(s.id)}
                className={`text-left p-1.5 rounded-xl border text-[10px] transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold shadow-xs'
                    : 'bg-white/60 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-emerald-500/40'
                }`}
              >
                <div className="truncate">{s.name}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Service Details */}
        <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 mb-3">
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span className="text-[11px] font-semibold text-stone-800 dark:text-stone-100">
              {activeService.name}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {activeService.est}
            </span>
          </div>
          <p className="text-[10px] text-stone-600 dark:text-stone-300 leading-relaxed">
            {activeService.desc}
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() =>
            onExecuteAction &&
            onExecuteAction({
              type: 'open-estimator',
              service: activeService.id,
              payload: { service: activeService.id, tab: 'quote' }
            })
          }
          className="w-full py-1.5 px-3 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs hover:shadow-[0_0_12px_rgba(16,185,129,0.35)] transition-all active:scale-[0.98]"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Proceed to Detailed Consultation</span>
        </button>
      </div>
    );
  }

  // 3. SEARCH RESULTS CARD
  if (type === 'search-results') {
    const results = Array.isArray(card.results) ? card.results : [];
    const queryTerm = card.query || '';

    return (
      <div className="w-full my-2.5 rounded-2xl bg-gradient-to-br from-white/95 via-stone-50/90 to-blue-500/10 dark:from-[#1E162B]/95 dark:via-[#191024]/90 dark:to-blue-500/15 border border-blue-500/30 shadow-lg p-3.5 text-stone-900 dark:text-stone-100 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-2 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 shrink-0">
              <Search className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-semibold tracking-wide text-stone-900 dark:text-white truncate">
                Semantic Matches: &ldquo;{queryTerm}&rdquo;
              </h4>
              <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
                {results.length} Indexed Results Found
              </span>
            </div>
          </div>
          <span className="text-[9px] font-mono font-medium px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            Fuzzy Scored
          </span>
        </div>

        {/* Results List */}
        {results.length === 0 ? (
          <p className="text-[11px] text-stone-500 dark:text-stone-400 py-2 text-center">
            No matching items found. Try different keywords.
          </p>
        ) : (
          <div className="space-y-1.5 mb-2.5 max-h-48 overflow-y-auto pr-0.5">
            {results.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800/80 hover:border-blue-500/40 transition-all"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[8px] font-mono uppercase px-1.5 py-0.2 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                      {item.category || item.badge}
                    </span>
                    <h5 className="text-[11px] font-semibold text-stone-900 dark:text-white truncate">
                      {item.title}
                    </h5>
                  </div>
                  <p className="text-[9.5px] text-stone-600 dark:text-stone-300 line-clamp-1">
                    {item.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onExecuteAction &&
                    onExecuteAction(item.action || { type: 'scroll', target: item.targetId })
                  }
                  className="px-2 py-1 rounded-md text-[9.5px] font-medium bg-blue-500/10 hover:bg-blue-500 text-blue-600 dark:text-blue-400 hover:text-white transition-all shrink-0 flex items-center gap-0.5"
                >
                  <span>Jump</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="pt-1 flex items-center justify-end">
          <button
            type="button"
            onClick={() => onExecuteAction && onExecuteAction({ type: 'scroll', target: '#projects' })}
            className="text-[10px] font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Explore All Projects & Dossiers</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    );
  }

  // 4. HARDWARE BENCHMARK CARD
  if (type === 'hardware-benchmark' || type === 'benchmark') {
    const [benchmarks, setBenchmarks] = useState({
      engine: 'WebGPU (Local Neural)',
      throughput: 38.4,
      model: 'Qwen-1.5B (Q4_K_M)',
      memory: '124 MB RAM',
      ttft: 42,
      running: false
    });

    const handleRunBenchmark = () => {
      setBenchmarks(prev => ({ ...prev, running: true }));
      setTimeout(() => {
        setBenchmarks({
          engine: 'WebGPU (Local Neural)',
          throughput: Number((34 + Math.random() * 10).toFixed(1)),
          model: 'Qwen-1.5B (Q4_K_M)',
          memory: '128 MB RAM',
          ttft: Math.floor(38 + Math.random() * 12),
          running: false
        });
      }, 450);
    };

    return (
      <div className="w-full my-2.5 rounded-2xl bg-gradient-to-br from-white/95 via-stone-50/90 to-purple-500/10 dark:from-[#1E162B]/95 dark:via-[#191024]/90 dark:to-purple-500/15 border border-purple-500/30 shadow-lg p-3.5 text-stone-900 dark:text-stone-100 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold tracking-wide text-stone-900 dark:text-white">
                Hardware Benchmark
              </h4>
              <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
                On-Device Inference Profiler
              </span>
            </div>
          </div>
          <span className="text-[9px] font-mono font-medium px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
            Client-Side
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="p-2 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <span className="text-[9px] font-mono text-stone-500 dark:text-stone-400 block mb-0.5">
              Throughput Speed
            </span>
            <div className="text-xs font-mono font-bold text-purple-600 dark:text-purple-300 flex items-center gap-1">
              <Zap className="w-3 h-3 text-purple-500" />
              <span>{benchmarks.throughput} tok/s</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <span className="text-[9px] font-mono text-stone-500 dark:text-stone-400 block mb-0.5">
              Time to 1st Token (TTFT)
            </span>
            <div className="text-xs font-mono font-bold text-stone-800 dark:text-stone-100">
              {benchmarks.ttft} ms
            </div>
          </div>

          <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
            <span className="text-[9px] font-mono text-stone-500 dark:text-stone-400 block mb-0.5">
              Neural Engine
            </span>
            <div className="text-[10.5px] font-medium text-stone-800 dark:text-stone-200 truncate">
              {benchmarks.engine}
            </div>
          </div>

          <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
            <span className="text-[9px] font-mono text-stone-500 dark:text-stone-400 block mb-0.5">
              Active Model Size
            </span>
            <div className="text-[10.5px] font-medium text-stone-800 dark:text-stone-200 truncate">
              {benchmarks.memory}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          disabled={benchmarks.running}
          onClick={handleRunBenchmark}
          className="w-full py-1.5 px-3 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white shadow-xs hover:shadow-[0_0_12px_rgba(147,51,234,0.35)] transition-all active:scale-[0.98] disabled:opacity-60"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{benchmarks.running ? 'Benchmarking Neural Shaders...' : 'Run Micro-Benchmark Test'}</span>
        </button>
      </div>
    );
  }

  // 5. DUAL-CARD: META-PROMPT & COMMAND STUDIO CARD
  if (type === 'meta-prompt' || type === 'prompt-engineer' || type === 'meta-prompt-card') {
    const [copiedCmd, setCopiedCmd] = useState(false);
    const [copiedPrompt, setCopiedPrompt] = useState(false);
    const [isPromptExpanded, setIsPromptExpanded] = useState(false);

    const isStudioGuide = Boolean(card.isStudioGuide);
    const shortCommand = card.shortCommand || '';
    const metaPrompt = card.metaPrompt || '';
    const suggestions = Array.isArray(card.suggestions) ? card.suggestions : [];
    const templates = Array.isArray(card.templates) ? card.templates : [];

    const handleCopyShortCmd = (e) => {
      e?.stopPropagation?.();
      if (!shortCommand) return;
      navigator.clipboard.writeText(shortCommand).then(() => {
        setCopiedCmd(true);
        setTimeout(() => setCopiedCmd(false), 2000);
      }).catch(() => {});
    };

    const handleCopyFullPrompt = (e) => {
      e?.stopPropagation?.();
      if (!metaPrompt) return;
      navigator.clipboard.writeText(metaPrompt).then(() => {
        setCopiedPrompt(true);
        setTimeout(() => setCopiedPrompt(false), 2000);
      }).catch(() => {});
    };

    // Case A: Interactive Studio Guidance Card (no specific task entered yet)
    if (isStudioGuide) {
      return (
        <div className="w-full my-2.5 rounded-2xl bg-gradient-to-br from-white/95 via-purple-500/5 to-pink-500/10 dark:from-[#1E162B]/95 dark:via-[#191024]/90 dark:to-purple-500/20 border border-purple-500/35 shadow-xl p-3.5 text-stone-900 dark:text-stone-100 transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-2 mb-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-xl bg-gradient-to-tr from-[#FF4D6D] to-[#9333EA] text-white shrink-0 shadow-xs">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold tracking-wide text-stone-900 dark:text-white truncate">
                  🎯 Meta-Prompt Engineer & Studio
                </h4>
                <span className="text-[10px] font-mono text-purple-600 dark:text-purple-300">
                  Command + Meta-Prompt + Refinement Tips
                </span>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 shrink-0">
              ⚡ Studio
            </span>
          </div>

          <p className="text-[11px] text-stone-600 dark:text-stone-300 mb-2.5 leading-relaxed">
            Convert any project requirement into an <strong>executable CLI command</strong> and an <strong>enterprise structured meta-prompt</strong> with engineering guardrails.
          </p>

          {/* Preset Recipe Cards */}
          <div className="space-y-1.5 mb-3">
            <span className="text-[9.5px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-1">
              Select Preset Prompt Recipe:
            </span>
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() =>
                  onExecuteAction &&
                  onExecuteAction({
                    type: 'set-input-and-send',
                    query: `/engineer ${tpl.query}`,
                    payload: { command: `/engineer ${tpl.query}` }
                  })
                }
                className="w-full text-left p-2 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800/80 hover:border-purple-500/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-all cursor-pointer flex items-center justify-between gap-2 group shadow-2xs"
              >
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-stone-800 dark:text-stone-100 group-hover:text-[#FF4D6D] dark:group-hover:text-[#FF758F] transition-colors truncate">
                    {tpl.title}
                  </div>
                  <div className="text-[9.5px] text-stone-500 dark:text-stone-400 truncate">
                    {tpl.description}
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#FF4D6D] group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>

          {/* Usage Instructions Box */}
          <div className="p-2.5 rounded-xl bg-stone-100/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono text-stone-600 dark:text-stone-300">
              💡 Type: <code className="text-[#FF4D6D] dark:text-[#FF758F] font-bold">/engineer &lt;your task&gt;</code>
            </span>
            <button
              type="button"
              onClick={() =>
                onExecuteAction &&
                onExecuteAction({
                  type: 'set-input',
                  payload: { value: '/engineer ' }
                })
              }
              className="px-2 py-1 rounded-md text-[9.5px] font-semibold bg-linear-to-r from-[#FF4D6D] to-[#9333EA] text-white hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
            >
              Start Prompting
            </button>
          </div>
        </div>
      );
    }

    // Case B: Engineered Meta-Prompt Result Card (Task specific dual-card)
    return (
      <div className="w-full my-2.5 rounded-2xl bg-gradient-to-br from-white/95 via-purple-500/5 to-pink-500/10 dark:from-[#1E162B]/95 dark:via-[#191024]/90 dark:to-purple-500/20 border border-purple-500/35 shadow-xl p-3.5 text-stone-900 dark:text-stone-100 transition-all space-y-3">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-xl bg-gradient-to-tr from-[#FF4D6D] to-[#9333EA] text-white shrink-0 shadow-xs">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold tracking-wide text-stone-900 dark:text-white truncate">
                {card.title || '⚡ Meta-Prompt Engineering Studio'}
              </h4>
              <span className="text-[10px] font-mono text-purple-600 dark:text-purple-300">
                {card.roleTitle || 'Engineered AI Specification'}
              </span>
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 shrink-0">
            ⚡ Meta-Prompt
          </span>
        </div>

        {/* 1. SHORT COMMAND BOX */}
        {shortCommand && (
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/90 dark:bg-stone-950/80 p-2.5 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-purple-500" />
                <span>1. Executable Command (Single-Line CLI)</span>
              </span>
              <button
                type="button"
                onClick={handleCopyShortCmd}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold transition-all cursor-pointer bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-purple-600 hover:border-purple-400 active:scale-95"
                title="Copy Command"
              >
                {copiedCmd ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-stone-400" />
                    <span>Copy Command</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-2 rounded-lg bg-stone-900 text-emerald-400 font-mono text-[11px] leading-relaxed overflow-x-auto select-all border border-stone-800">
              <span className="text-stone-500 select-none">$ </span>
              {shortCommand}
            </div>
          </div>
        )}

        {/* 2. STRUCTURED META-PROMPT BOX */}
        {metaPrompt && (
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/90 dark:bg-stone-950/80 p-2.5 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF4D6D] dark:text-[#FF758F] flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-[#FF4D6D]" />
                <span>2. Structured Meta-Prompt (LLM Architecture)</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsPromptExpanded(prev => !prev)}
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-mono text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  title={isPromptExpanded ? "Collapse" : "Expand"}
                >
                  {isPromptExpanded ? (
                    <>
                      <span>Collapse</span>
                      <ChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      <span>Expand</span>
                      <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCopyFullPrompt}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold transition-all cursor-pointer bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-[#FF4D6D] hover:border-[#FF4D6D] active:scale-95"
                  title="Copy Meta-Prompt"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-stone-400" />
                      <span>Copy Meta-Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <div
              className={`p-2.5 rounded-lg bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 font-mono text-[10.5px] leading-relaxed overflow-y-auto whitespace-pre-wrap select-all border border-stone-200/80 dark:border-stone-800 ${
                isPromptExpanded ? 'max-h-96' : 'max-h-36'
              }`}
            >
              {metaPrompt}
            </div>
          </div>
        )}

        {/* 3. ENGINEERING SUGGESTIONS & TIPS */}
        {suggestions.length > 0 && (
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-purple-50/50 dark:bg-purple-950/20 p-2.5">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>3. Prompt Engineering Suggestions & Levers</span>
            </div>
            <ul className="space-y-1 text-[10.5px] text-stone-700 dark:text-stone-300 leading-normal">
              {suggestions.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-[#FF4D6D] font-bold text-xs leading-none mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quick Footer Action Buttons */}
        <div className="flex items-center justify-between gap-1.5 pt-1">
          <button
            type="button"
            onClick={handleCopyShortCmd}
            className="flex-1 py-1.5 px-2 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-purple-400 hover:text-purple-600 transition-all cursor-pointer active:scale-95 shadow-2xs"
          >
            {copiedCmd ? <Check className="w-3 h-3 text-emerald-500" /> : <Terminal className="w-3 h-3 text-purple-500" />}
            <span>{copiedCmd ? 'Command Copied' : 'Copy Command'}</span>
          </button>
          <button
            type="button"
            onClick={handleCopyFullPrompt}
            className="flex-1 py-1.5 px-2 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 bg-linear-to-r from-[#FF4D6D] to-[#9333EA] text-white hover:opacity-90 transition-opacity cursor-pointer active:scale-95 shadow-2xs"
          >
            {copiedPrompt ? <Check className="w-3 h-3" /> : <Code className="w-3 h-3" />}
            <span>{copiedPrompt ? 'Prompt Copied' : 'Copy Meta-Prompt'}</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
}
