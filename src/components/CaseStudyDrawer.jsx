import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Lightbulb,
  Cpu,
  TrendingUp,
  BookOpen,
  ArrowUpRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CASE_STUDIES, getCaseStudyById } from '../data/caseStudiesData';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { soundFX } from '../utils/audio';
import { useAnnounce } from '../context/AnnouncerContext';
import CaseStudySimulator from './CaseStudySimulator';
import CaseStudyArchitecture from './CaseStudyArchitecture';

const STORY_STAGES = [
  { id: 'challenge', number: '1', title: 'The Challenge', icon: AlertCircle },
  { id: 'solution', number: '2', title: 'The Solution', icon: Lightbulb },
  { id: 'tech', number: '3', title: 'Tech Stack & Obstacles', icon: Cpu },
  { id: 'results', number: '4', title: 'Results & Metrics', icon: TrendingUp },
  { id: 'lessons', number: '5', title: 'Lessons Learned', icon: BookOpen }
];

/**
 * CaseStudyDrawer
 * Slide-over drawer anchored to the right viewport edge for in-depth 5-stage case study dossiers.
 * Complete with keyboard focus trapping, Escape dismissal, background scroll-locking,
 * WAI-ARIA tablist semantics, interactive telemetry simulator, 4-tier visual architecture,
 * and high-contrast / dark / light / simple mode compatibility.
 */
export default function CaseStudyDrawer({
  isOpen = false,
  caseStudyId = null,
  onClose,
  onSelectProject
}) {
  const { announce } = useAnnounce();
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const tabRefs = useRef([]);

  const [activeStage, setActiveStage] = useState('challenge');

  // Resolve active case study record
  const currentCaseStudy = getCaseStudyById(caseStudyId) || CASE_STUDIES[0];
  const accentColor = currentCaseStudy.accentColor || '#FF4D6D';

  const currentIndex = CASE_STUDIES.findIndex((cs) => cs.id === currentCaseStudy.id);
  const prevProject = CASE_STUDIES[(currentIndex - 1 + CASE_STUDIES.length) % CASE_STUDIES.length];
  const nextProject = CASE_STUDIES[(currentIndex + 1) % CASE_STUDIES.length];

  // Focus trap integration
  useFocusTrap(isOpen, drawerRef, {
    initialFocusRef: closeButtonRef,
    onEscape: onClose,
    restoreFocus: true
  });

  // Universal Body Scroll Lock with Scrollbar Width Compensation
  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalDocOverflow = document.documentElement.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Audio cue and live announcement on open
    soundFX.init?.();
    soundFX.playRibbonSweep?.('up');
    announce(
      `Opened case study: ${currentCaseStudy.title}. Showing Stage 1: The Challenge.`,
      'polite'
    );

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalDocOverflow;
      document.body.style.paddingRight = '';
    };
  }, [isOpen, currentCaseStudy.title, announce]);

  // Reset to first stage on project change
  useEffect(() => {
    setActiveStage('challenge');
  }, [caseStudyId]);

  // Handle stage tab keyboard navigation (ArrowLeft, ArrowRight, Home, End)
  const handleTabKeyDown = (e, index) => {
    let targetIndex = null;
    if (e.key === 'ArrowRight') {
      targetIndex = (index + 1) % STORY_STAGES.length;
    } else if (e.key === 'ArrowLeft') {
      targetIndex = (index - 1 + STORY_STAGES.length) % STORY_STAGES.length;
    } else if (e.key === 'Home') {
      targetIndex = 0;
    } else if (e.key === 'End') {
      targetIndex = STORY_STAGES.length - 1;
    }

    if (targetIndex !== null) {
      e.preventDefault();
      const nextStage = STORY_STAGES[targetIndex];
      handleSelectStage(nextStage.id);
      tabRefs.current[targetIndex]?.focus();
    }
  };

  const handleSelectStage = (stageId) => {
    soundFX.init?.();
    soundFX.playHapticClick?.();
    setActiveStage(stageId);
    const stageObj = STORY_STAGES.find((s) => s.id === stageId);
    if (stageObj) {
      announce(`Viewing Stage ${stageObj.number}: ${stageObj.title}`, 'polite');
    }
  };

  const handleNavigateProject = (targetId) => {
    soundFX.init?.();
    soundFX.playKeyClick?.();
    if (typeof onSelectProject === 'function') {
      onSelectProject(targetId);
    }
  };

  const handleClose = () => {
    soundFX.init?.();
    soundFX.playRibbonSweep?.('down');
    announce('Closed case study drawer', 'polite');
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          role="button"
          tabIndex={-1}
          aria-label="Close Case Study Drawer"
          onClick={handleClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[55] transition-opacity duration-300 cursor-pointer animate-in fade-in"
        />
      )}

      {/* Slide-Over Drawer Container */}
      <aside
        ref={drawerRef}
        id="case-study-slide-over-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="casestudy-drawer-title"
        aria-describedby="casestudy-drawer-subtitle"
        aria-hidden={!isOpen}
        inert={!isOpen ? '' : undefined}
        className={`fixed top-0 right-0 h-full w-full sm:w-[560px] md:w-[680px] lg:w-[780px] max-w-[100vw] sm:max-w-[95vw] z-[56] bg-[#FAF8F5]/98 dark:bg-[#120D1D]/98 text-[#18181B] dark:text-[#F5F2F8] backdrop-blur-2xl border-l border-[#E7E2D8] dark:border-[#2D2340] shadow-2xl flex flex-col transition-transform duration-300 ease-out will-change-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Sticky Header */}
        <header className="px-5 py-4 border-b border-[#ECE7DF] dark:border-[#2D2340] bg-white/80 dark:bg-[#161122]/90 backdrop-blur-md shrink-0 flex items-center justify-between gap-3">
          <div className="min-w-0 flex items-center gap-2.5">
            <span
              className="px-2.5 py-0.5 rounded-full font-mono font-bold text-[11px] shrink-0 border"
              style={{
                borderColor: `${accentColor}40`,
                backgroundColor: `${accentColor}15`,
                color: accentColor
              }}
            >
              Case Study {currentCaseStudy.id}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 dark:bg-[#251C36] text-stone-600 dark:text-stone-300 truncate">
              {currentCaseStudy.trackBadge}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Cycle Prev / Next */}
            <button
              type="button"
              onClick={() => handleNavigateProject(prevProject.id)}
              aria-label={`Previous Case Study: ${prevProject.title}`}
              title={`Previous: ${prevProject.title}`}
              className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleNavigateProject(nextProject.id)}
              aria-label={`Next Case Study: ${nextProject.title}`}
              title={`Next: ${nextProject.title}`}
              className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              aria-label="Close Case Study Drawer"
              className="ml-2 p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 sm:p-7 space-y-6">
          {/* Hero Header Area */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {currentCaseStudy.category}
              </span>
            </div>
            <h2
              id="casestudy-drawer-title"
              className="text-xl sm:text-2xl font-bold tracking-tight text-[#18181B] dark:text-white leading-tight"
            >
              {currentCaseStudy.title}
            </h2>
            <p
              id="casestudy-drawer-subtitle"
              className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed font-medium"
            >
              {currentCaseStudy.subtitle}
            </p>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              {currentCaseStudy.summary}
            </p>
          </section>

          {/* Metric Highlights Grid */}
          <section aria-label="Key Performance Indicators" className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {currentCaseStudy.metrics.map((m, idx) => (
              <div
                key={m.label || idx}
                className="p-3 rounded-xl bg-white dark:bg-[#161122] border border-[#ECE7DF] dark:border-[#2D2340] shadow-2xs"
              >
                <span className="text-[11px] font-mono uppercase font-bold text-stone-500 dark:text-stone-400 block truncate">
                  {m.label}
                </span>
                <span
                  className="text-base sm:text-lg font-bold font-mono tracking-tight mt-0.5 block truncate"
                  style={{ color: accentColor }}
                >
                  {m.val}
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 block truncate mt-0.5">
                  {m.desc}
                </span>
              </div>
            ))}
          </section>

          {/* 5-Stage Storytelling Tabs Navigation (WAI-ARIA Tablist) */}
          <div className="pt-2">
            <div
              role="tablist"
              aria-label="Case Study 5-Stage Storytelling Tabs"
              className="flex items-center gap-1.5 overflow-x-auto pb-1.5 border-b border-[#ECE7DF] dark:border-[#2D2340] scrollbar-none"
            >
              {STORY_STAGES.map((stage, idx) => {
                const isActive = activeStage === stage.id;
                const IconComponent = stage.icon;

                return (
                  <button
                    key={stage.id}
                    ref={(el) => (tabRefs.current[idx] = el)}
                    id={`stage-tab-${stage.id}`}
                    role="tab"
                    type="button"
                    tabIndex={isActive ? 0 : -1}
                    aria-selected={isActive}
                    aria-controls={`stage-panel-${stage.id}`}
                    onClick={() => handleSelectStage(stage.id)}
                    onKeyDown={(e) => handleTabKeyDown(e, idx)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#18181B] text-white dark:bg-white dark:text-[#18181B] shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-[#18181B] dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      {stage.number}. {stage.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 5 Storytelling Stage Tabpanels */}
            <div className="mt-5">
              {/* STAGE 1: THE CHALLENGE */}
              {activeStage === 'challenge' && (
                <div
                  id="stage-panel-challenge"
                  role="tabpanel"
                  tabIndex={0}
                  aria-labelledby="stage-tab-challenge"
                  className="space-y-4 focus:outline-hidden"
                >
                  <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161122] border border-[#ECE7DF] dark:border-[#2D2340] space-y-3 shadow-xs">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500" aria-hidden="true" />
                      <h3 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white">
                        {currentCaseStudy.story.challenge.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                      {currentCaseStudy.story.challenge.context}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-stone-500 dark:text-stone-400">
                      Core Enterprise Pain Points
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      {currentCaseStudy.story.challenge.painPoints.map((point, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50/80 dark:bg-[#100C1A] border border-stone-200/80 dark:border-[#251C36]"
                        >
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-mono text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900"
                            aria-hidden="true"
                          >
                            !
                          </span>
                          <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 2: THE SOLUTION */}
              {activeStage === 'solution' && (
                <div
                  id="stage-panel-solution"
                  role="tabpanel"
                  tabIndex={0}
                  aria-labelledby="stage-tab-solution"
                  className="space-y-5 focus:outline-hidden"
                >
                  <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161122] border border-[#ECE7DF] dark:border-[#2D2340] space-y-3 shadow-xs">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-500" aria-hidden="true" />
                      <h3 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white">
                        {currentCaseStudy.story.solution.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                      {currentCaseStudy.story.solution.approach}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-stone-500 dark:text-stone-400">
                      Strategic Engineering Pillars
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {currentCaseStudy.story.solution.keyPillars.map((pillar, idx) => (
                        <div
                          key={pillar.title || idx}
                          className="p-3.5 rounded-xl bg-white dark:bg-[#161122] border border-[#ECE7DF] dark:border-[#2D2340] shadow-xs"
                        >
                          <span
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border inline-block mb-1.5"
                            style={{
                              borderColor: `${accentColor}40`,
                              backgroundColor: `${accentColor}12`,
                              color: accentColor
                            }}
                          >
                            Pillar 0{idx + 1}
                          </span>
                          <h5 className="text-xs font-bold text-[#18181B] dark:text-stone-200 mb-1">
                            {pillar.title}
                          </h5>
                          <p className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-400">
                            {pillar.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4-Tier Visual Architecture Blueprint */}
                  <div className="pt-2">
                    <CaseStudyArchitecture
                      architectureData={currentCaseStudy.architecture}
                      accentColor={accentColor}
                    />
                  </div>
                </div>
              )}

              {/* STAGE 3: TECH STACK & OBSTACLES */}
              {activeStage === 'tech' && (
                <div
                  id="stage-panel-tech"
                  role="tabpanel"
                  tabIndex={0}
                  aria-labelledby="stage-tab-tech"
                  className="space-y-5 focus:outline-hidden"
                >
                  {/* Tech Stack Roles */}
                  <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161122] border border-[#ECE7DF] dark:border-[#2D2340] space-y-3 shadow-xs">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4" style={{ color: accentColor }} aria-hidden="true" />
                      <h3 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white">
                        {currentCaseStudy.story.techAndObstacles.title}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      {currentCaseStudy.story.techAndObstacles.stack.map((item, idx) => (
                        <div
                          key={item.name || idx}
                          className="p-2.5 rounded-lg bg-stone-50 dark:bg-[#100C1A] border border-stone-200/80 dark:border-[#251C36]"
                        >
                          <span className="text-xs font-bold text-[#18181B] dark:text-white block">
                            {item.name}
                          </span>
                          <span className="text-[11px] text-stone-500 dark:text-stone-400 block mt-0.5 leading-relaxed">
                            {item.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Obstacles & Resolutions */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-stone-500 dark:text-stone-400">
                      Technical Hurdles & Engineering Resolutions
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {currentCaseStudy.story.techAndObstacles.obstacles.map((obs, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-white dark:bg-[#161122] border border-[#ECE7DF] dark:border-[#2D2340] shadow-xs space-y-2"
                        >
                          <div className="flex items-start gap-2 text-rose-600 dark:text-rose-400">
                            <span className="text-xs font-bold font-mono uppercase tracking-wider shrink-0 mt-0.5">
                              Hurdle:
                            </span>
                            <p className="text-xs text-[#18181B] dark:text-stone-200 font-medium">
                              {obs.hurdle}
                            </p>
                          </div>
                          <div className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400 pl-4 border-l-2 border-emerald-500">
                            <span className="text-xs font-bold font-mono uppercase tracking-wider shrink-0 mt-0.5">
                              Resolution:
                            </span>
                            <p className="text-xs text-stone-700 dark:text-stone-300">
                              {obs.resolution}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Telemetry Simulator Widget */}
                  <div className="pt-2">
                    <CaseStudySimulator
                      simulatorData={currentCaseStudy.simulator}
                      accentColor={accentColor}
                      projectTitle={currentCaseStudy.title}
                    />
                  </div>
                </div>
              )}

              {/* STAGE 4: RESULTS & METRICS */}
              {activeStage === 'results' && (
                <div
                  id="stage-panel-results"
                  role="tabpanel"
                  tabIndex={0}
                  aria-labelledby="stage-tab-results"
                  className="space-y-5 focus:outline-hidden"
                >
                  <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161122] border border-[#ECE7DF] dark:border-[#2D2340] space-y-3 shadow-xs">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                      <h3 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white">
                        {currentCaseStudy.story.resultsAndMetrics.title}
                      </h3>
                    </div>

                    {/* Before vs After Table / Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      {currentCaseStudy.story.resultsAndMetrics.beforeVsAfter.map((comp, idx) => (
                        <div
                          key={comp.metric || idx}
                          className="p-3.5 rounded-xl bg-stone-50/80 dark:bg-[#100C1A] border border-stone-200/80 dark:border-[#251C36] space-y-1.5"
                        >
                          <span className="text-xs font-bold text-[#18181B] dark:text-white block">
                            {comp.metric}
                          </span>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400">
                            Before: <span className="line-through">{comp.before}</span>
                          </div>
                          <div className="text-xs font-bold font-mono text-[#18181B] dark:text-stone-200">
                            After: <span>{comp.after}</span>
                          </div>
                          <span
                            className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${accentColor}18`,
                              color: accentColor
                            }}
                          >
                            Delta: {comp.delta}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-stone-500 dark:text-stone-400">
                      Verified Impact Highlights
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {currentCaseStudy.story.resultsAndMetrics.highlights.map((high, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-lg bg-white dark:bg-[#161122] border border-stone-200/80 dark:border-[#2D2340]"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                            {high}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 5: LESSONS LEARNED */}
              {activeStage === 'lessons' && (
                <div
                  id="stage-panel-lessons"
                  role="tabpanel"
                  tabIndex={0}
                  aria-labelledby="stage-tab-lessons"
                  className="space-y-4 focus:outline-hidden"
                >
                  <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161122] border border-[#ECE7DF] dark:border-[#2D2340] space-y-2 shadow-xs">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-500" aria-hidden="true" />
                      <h3 className="text-sm sm:text-base font-bold text-[#18181B] dark:text-white">
                        {currentCaseStudy.story.lessonsLearned.title}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {currentCaseStudy.story.lessonsLearned.takeaways.map((item, idx) => (
                      <div
                        key={item.principle || idx}
                        className="p-4 rounded-xl bg-white dark:bg-[#161122] border border-[#ECE7DF] dark:border-[#2D2340] shadow-xs space-y-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold"
                            style={{
                              backgroundColor: `${accentColor}18`,
                              color: accentColor
                            }}
                          >
                            0{idx + 1}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-[#18181B] dark:text-white">
                            {item.principle}
                          </h4>
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed pl-7">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tech Stack Pills List */}
          <section className="pt-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-2 font-bold">
              Production Tech Stack & Tools
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentCaseStudy.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-stone-100 dark:bg-[#1A1429] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky Footer Action Bar */}
        <footer className="px-5 py-4 border-t border-[#ECE7DF] dark:border-[#2D2340] bg-white/80 dark:bg-[#161122]/90 backdrop-blur-md shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Quick Prev / Next Labeling */}
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 dark:text-stone-400">
            <span>Project {currentCaseStudy.id} of 09</span>
          </div>

          {/* Action Button Links */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href="#contact"
              onClick={handleClose}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white shadow-xs transition-all active:scale-95 cursor-pointer"
              style={{ backgroundColor: accentColor }}
            >
              <span>Discuss Architecture</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-full text-xs font-bold border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </footer>
      </aside>
    </>
  );
}
