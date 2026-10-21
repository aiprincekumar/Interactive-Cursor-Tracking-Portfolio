import React, { useState, useEffect, useRef } from 'react';
import {
  RefreshCw,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Terminal,
  Cpu,
  Zap,
  Sliders
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { useAnnounce } from '../context/AnnouncerContext';
import { useLanguage } from '../context/LanguageContext';

/**
 * CaseStudySimulator
 * Interactive live telemetry simulation widget supporting:
 * - Archetype A: Pipeline Telemetry Runner (Projects 01, 03, 04, 05, 07, 09)
 * - Archetype B: Multi-Node State Machine (Projects 02, 06, 08)
 * Features live execution timers, step animation, tactile audio feedback,
 * ARIA live screen reader announcements, and telemetry HUD indicators.
 */
export default function CaseStudySimulator({
  simulatorData,
  accentColor = '#FF4D6D',
  projectTitle = ''
}) {
  const { announce } = useAnnounce();
  const { isHindi } = useLanguage();

  if (!simulatorData) {
    return null;
  }

  const {
    archetype = 'pipeline',
    title,
    description,
    initialLatency = 180,
    steps = [],
    nodes = [],
    telemetryKeys = []
  } = simulatorData;

  const isStateMachine = archetype === 'state-machine' || archetype === 'stateMachine';
  const isPipeline = !isStateMachine;

  // Simulator Runtime State
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [latency, setLatency] = useState(initialLatency);
  const [hasAnomaly, setHasAnomaly] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState(() => (nodes[0]?.id || ''));

  const stepTimeoutRef = useRef(null);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (stepTimeoutRef.current) {
        clearTimeout(stepTimeoutRef.current);
      }
    };
  }, []);

  // Reset simulator
  const handleReset = () => {
    if (stepTimeoutRef.current) {
      clearTimeout(stepTimeoutRef.current);
    }
    setIsRunning(false);
    setCurrentStepIdx(-1);
    setIsCompleted(false);
    setLatency(initialLatency);
    setActiveNodeId(nodes[0]?.id || '');

    soundFX.playCrystalChime?.();
    announce('Simulation reset to initial state.', 'polite');
  };

  // Run Pipeline Execution
  const runPipelineSimulation = () => {
    if (isRunning) return;

    soundFX.init?.();
    soundFX.playLaserFocus?.();
    setIsRunning(true);
    setIsCompleted(false);
    setCurrentStepIdx(0);

    announce(`Starting ${title || projectTitle} simulation...`, 'polite');

    const totalSteps = steps.length;
    let step = 0;

    const executeNextStep = () => {
      if (step < totalSteps - 1) {
        step += 1;
        setCurrentStepIdx(step);
        soundFX.playHapticClick?.();

        const stepDuration = steps[step]?.duration ? steps[step].duration * 6 : 220;
        stepTimeoutRef.current = setTimeout(executeNextStep, stepDuration);
      } else {
        // Finalize
        setIsRunning(false);
        setIsCompleted(true);
        setCurrentStepIdx(totalSteps - 1);

        const jitter = Math.floor(Math.random() * 24) - 12;
        const finalLatency = Math.max(45, initialLatency + jitter);
        setLatency(finalLatency);

        if (hasAnomaly) {
          soundFX.playTerminalError?.();
          announce(
            `Simulation finished with variance flag in ${finalLatency}ms. Anomaly detected for audit review.`,
            'assertive'
          );
        } else {
          soundFX.playTerminalSuccess?.();
          soundFX.playSparkle?.();
          announce(
            `Simulation complete. Successfully executed all ${totalSteps} stages in ${finalLatency}ms with 100% verification.`,
            'polite'
          );
        }
      }
    };

    const firstDuration = steps[0]?.duration ? steps[0].duration * 6 : 220;
    stepTimeoutRef.current = setTimeout(executeNextStep, firstDuration);
  };

  // Handle State Machine Node Click
  const handleNodeClick = (node) => {
    soundFX.init?.();
    soundFX.playHapticClick?.();
    setActiveNodeId(node.id);

    if (node.status === 'success' || node.status === 'verified') {
      soundFX.playSparkle?.();
    } else if (node.status === 'warning') {
      soundFX.playTerminalError?.();
    } else {
      soundFX.playKeyClick?.();
    }

    announce(`State changed to: ${node.label}. ${node.desc}`, 'polite');
  };

  return (
    <div className="case-study-simulator space-y-5 rounded-2xl p-4 sm:p-6 bg-stone-50/80 dark:bg-[#120D1D]/90 border border-[#E7E2D8] dark:border-[#2D2340] shadow-sm">
      {/* Simulator Header & Window Dots */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ECE7DF] dark:border-[#251C36]">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-1" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D6D]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <Terminal className="w-4 h-4 text-stone-500" aria-hidden="true" />
            <h3 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white font-mono tracking-tight">
              {title || 'Interactive Telemetry Simulation'}
            </h3>
          </div>
          {description && (
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 pl-6">
              {description}
            </p>
          )}
        </div>

        {/* Runtime Status Badge */}
        <div className="flex items-center gap-2 pl-6 sm:pl-0">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold border transition-colors ${
              isRunning
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800 animate-pulse'
                : isCompleted
                ? hasAnomaly
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                : 'bg-stone-100 dark:bg-[#1A1429] text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700'
            }`}
          >
            <Activity className="w-3 h-3" aria-hidden="true" />
            <span>
              {isRunning
                ? (isHindi ? `निष्पादन जारी (${currentStepIdx + 1}/${steps.length})` : `EXECUTING (${currentStepIdx + 1}/${steps.length})`)
                : isCompleted
                ? hasAnomaly
                  ? (isHindi ? 'विसंगति चिह्नित' : 'VARIANCE FLAGGED')
                  : (isHindi ? '100% सत्यापित' : '100% VERIFIED')
                : (isHindi ? 'स्टैंडबाय' : 'STANDBY')}
            </span>
          </span>
        </div>
      </div>

      {/* Archetype A: Pipeline Telemetry Runner */}
      {isPipeline && (
        <div className="space-y-4">
          {/* Execution Progress Bar */}
          <div className="w-full bg-stone-200 dark:bg-[#1F1830] rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full transition-all duration-300 ease-out rounded-full"
              style={{
                width: isCompleted
                  ? '100%'
                  : currentStepIdx >= 0
                  ? `${((currentStepIdx + 1) / steps.length) * 100}%`
                  : '0%',
                backgroundColor: hasAnomaly && isCompleted ? '#E11D48' : accentColor
              }}
            />
          </div>

          {/* Steps Timeline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {steps.map((st, idx) => {
              const isCurrent = currentStepIdx === idx;
              const isPassed = currentStepIdx > idx || (isCompleted && !isCurrent);

              return (
                <div
                  key={st.id || idx}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                    isCurrent
                      ? 'bg-white dark:bg-[#1A1429] shadow-md scale-[1.02]'
                      : isPassed
                      ? 'bg-white/80 dark:bg-[#140E22]/80 opacity-90'
                      : 'bg-stone-100/60 dark:bg-[#0D0917]/60 opacity-60'
                  }`}
                  style={{
                    borderColor: isCurrent
                      ? accentColor
                      : isPassed
                      ? `${accentColor}50`
                      : 'transparent'
                  }}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">
                      Stage 0{idx + 1}
                    </span>
                    {isPassed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                    ) : isCurrent ? (
                      <RefreshCw
                        className="w-3 h-3 animate-spin"
                        style={{ color: accentColor }}
                        aria-hidden="true"
                      />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-stone-300 dark:bg-stone-700" />
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-[#18181B] dark:text-stone-200 mb-1 leading-snug">
                    {st.label}
                  </h4>
                  <p className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-400">
                    {st.details}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Archetype B: Multi-Node State Machine */}
      {isStateMachine && (
        <div className="space-y-4">
          <div className="text-xs text-stone-600 dark:text-stone-400">
            Interactive state nodes: select any node or execute a cycle to verify transition telemetry.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {nodes.map((node) => {
              const isActive = activeNodeId === node.id;
              const isSuccess = node.status === 'success' || node.status === 'verified';
              const isWarning = node.status === 'warning';

              return (
                <button
                  type="button"
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  aria-pressed={isActive}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                    isActive
                      ? 'bg-white dark:bg-[#1A1429] shadow-md ring-2 scale-[1.02]'
                      : 'bg-white/70 dark:bg-[#140E22]/70 hover:bg-white dark:hover:bg-[#181226]'
                  }`}
                  style={{
                    borderColor: isActive ? accentColor : undefined,
                    boxShadow: isActive ? `0 4px 14px ${accentColor}25` : undefined
                  }}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span
                      className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: isActive ? `${accentColor}20` : undefined,
                        color: isActive ? accentColor : undefined
                      }}
                    >
                      {node.label}
                    </span>
                    {isSuccess ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : isWarning ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Cpu className="w-4 h-4 text-stone-400" />
                    )}
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {node.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Telemetry HUD Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-[#ECE7DF] dark:border-[#251C36]">
        {telemetryKeys.map((item) => {
          const displayVal = isCompleted
            ? item.successValue
            : isRunning
            ? 'Processing...'
            : item.initialValue;

          return (
            <div
              key={item.key}
              className="p-2.5 rounded-lg bg-white/90 dark:bg-[#161122]/90 border border-stone-200/70 dark:border-[#2D2340]"
            >
              <span className="text-[10px] font-mono uppercase text-stone-500 dark:text-stone-400 block truncate">
                {item.label}
              </span>
              <span className="text-xs font-mono font-bold text-[#18181B] dark:text-stone-200 mt-0.5 block truncate">
                {displayVal}
              </span>
            </div>
          );
        })}
      </div>

      {/* Interactive Controls & Telemetry Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#ECE7DF] dark:border-[#251C36]">
        {/* Anomaly Simulation Toggle Switch */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hasAnomaly}
            onChange={(e) => setHasAnomaly(e.target.checked)}
            className="w-4 h-4 rounded text-[#FF4D6D] focus:ring-[#FF4D6D] cursor-pointer"
          />
          <span className="text-xs text-stone-600 dark:text-stone-400 font-medium flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
            <span>{isHindi ? 'विसंगति / ऑडिट विचलन अनुकरण करें' : 'Simulate Anomaly / Audit Variance'}</span>
          </span>
        </label>

        {/* Action Buttons & Latency Counter */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono font-bold text-stone-500 dark:text-stone-400 mr-1">
            {isHindi ? 'विलंबता: ' : 'Latency: '}<span className="text-[#18181B] dark:text-white">{latency}ms</span>
          </span>

          {archetype === 'pipeline' ? (
            <button
              type="button"
              onClick={runPipelineSimulation}
              disabled={isRunning}
              aria-label={`Execute simulation for ${title || projectTitle}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              style={{ backgroundColor: accentColor }}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span>{isRunning ? (isHindi ? 'ऑडिट जारी...' : 'Auditing...') : isCompleted ? (isHindi ? 'पुनः ऑडिट चलाएं' : 'Re-run Audit') : (isHindi ? 'ऑडिट चलाएं' : 'Run Audit')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                const nextIdx = (nodes.findIndex((n) => n.id === activeNodeId) + 1) % nodes.length;
                handleNodeClick(nodes[nextIdx]);
              }}
              aria-label="Cycle state machine"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xs transition-all active:scale-95 cursor-pointer"
              style={{ backgroundColor: accentColor }}
            >
              <Zap className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isHindi ? 'साइकिल स्टेट' : 'Cycle State'}</span>
            </button>
          )}

          {(isCompleted || currentStepIdx >= 0) && (
            <button
              type="button"
              onClick={handleReset}
              aria-label="Reset simulation"
              className="p-2 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-[#18181B] dark:hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
