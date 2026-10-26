/**
 * Portfolio Interactive Tour Engine (Phase 10 Capstone)
 * Orchestrates guided multi-step interactive walkthroughs across portfolio sections
 * with smooth scrolling, audience/role coordination, and tactile event dispatching.
 */

export const PORTFOLIO_TOURS = {
  'recruiter-fast-track': {
    id: 'recruiter-fast-track',
    title: 'Recruiter Fast Track',
    badge: '💼 Recruiter',
    description: '4-step high-yield walkthrough for talent scouts, hiring leads, and technical recruiters.',
    audience: 'recruiter',
    role: 'overview',
    steps: [
      {
        selector: '#hero',
        headline: "Welcome to Atul's Professional Portfolio",
        commentary: 'Atul Verma is a Senior Tally Accountant & Tax Consultant with 10+ years of enterprise experience in statutory compliance, MIS governance, and modern AI engineering.',
        role: 'overview',
        audience: 'recruiter'
      },
      {
        selector: '#experience',
        headline: 'Key Impact Metrics & Track Record',
        commentary: 'Demonstrated 100% on-time statutory compliance, ₹2.5Cr+ ITC reconciled, 50,000+ biometric enrollments, and zero penalty notices over a decade of active practice.',
        role: 'overview',
        audience: 'recruiter'
      },
      {
        selector: '#projects',
        headline: 'Flagship Case Studies & Architecture',
        commentary: 'Deep dive into 9 verified production dossiers spanning GST automated reconciliation, Tally Prime ERP pipelines, and full-stack AI SaaS systems.',
        role: 'overview',
        audience: 'recruiter'
      },
      {
        selector: '#contact',
        headline: 'Verified Resume & Direct Contact',
        commentary: 'Instant 1-click ATS-optimized resume download (PDF), direct email, and phone consultation to fast-track hiring or interview scheduling.',
        role: 'overview',
        audience: 'recruiter'
      }
    ]
  },
  'corporate-tax-gst': {
    id: 'corporate-tax-gst',
    title: 'Corporate Tax & GST Compliance',
    badge: '📊 Tax & Audit',
    description: '4-step specialized walkthrough for business owners, CFOs, and statutory auditors.',
    audience: 'client',
    role: 'accountant',
    steps: [
      {
        selector: '#skills',
        headline: 'Statutory Tax & Accounting Competency',
        commentary: 'Specialized in CGST/SGST/IGST returns, GSTR-1, 3B, 9, Income Tax ITR-1 through 4, Form 26AS/AIS verification, and Section 16(2)(aa) compliance.',
        role: 'accountant',
        audience: 'client'
      },
      {
        selector: '#projects',
        headline: 'Case Study 01: GST & Tax Verification Engine',
        commentary: 'Automated GST ledger reconciliation preventing Input Tax Credit leakages and protecting enterprise clients from Section 143(1) scrutiny notices.',
        role: 'accountant',
        audience: 'client',
        action: { type: 'open-case-study', id: '01' }
      },
      {
        selector: '#experience',
        headline: 'Case Study 02: MIS Automation & ERP Ledgers',
        commentary: 'Multi-company Tally Prime operations, high-volume Bank Reconciliation (BRS), and real-time P&L / Balance Sheet controls.',
        role: 'accountant',
        audience: 'client'
      },
      {
        selector: '#contact',
        headline: 'Statutory Audit & Quotation Calculator',
        commentary: 'Interactive quotation fee estimator to configure customized statutory filing, corporate audit defense, and ledger sanitation contracts.',
        role: 'accountant',
        audience: 'client',
        action: { type: 'open-estimator' }
      }
    ]
  },
  'ai-vibe-coding': {
    id: 'ai-vibe-coding',
    title: 'AI Vibe Coding & SaaS Architecture',
    badge: '⚡ AI Engineering',
    description: '4-step journey exploring autonomous agent loops, React 19 UI, and on-device WebGPU neural inference.',
    audience: 'explorer',
    role: 'vibe_coding',
    steps: [
      {
        selector: '#projects',
        headline: 'Case Study 07: Prompt-to-SaaS AI Engine',
        commentary: 'Full-stack AI SaaS generation using modern React 19, Tailwind v4, Vite, and LLM orchestration with zero cloud server requirements.',
        role: 'vibe_coding',
        audience: 'explorer',
        action: { type: 'open-case-study', id: '07' }
      },
      {
        selector: '#skills',
        headline: 'Modern AI Stack & Architecture',
        commentary: 'Autonomous agent loops, Claude Code CLI, MCP tool-use protocol, Transformers.js client streaming, and WebGPU/WASM on-device neural inference.',
        role: 'vibe_coding',
        audience: 'explorer'
      },
      {
        selector: '#playground',
        headline: 'Interactive Spatial Physics & Audio Lab',
        commentary: 'Experience real-time interactive physics simulations, particle visualizers, 3D sun compass shaders, and binaural spatial acoustic cues.',
        role: 'vibe_coding',
        audience: 'explorer'
      },
      {
        selector: '#contact',
        headline: 'Hire Atul for Next-Gen Engineering',
        commentary: 'Available for full-stack AI vibe coding, workflow automation pipelines, MCP server tool building, and custom software prototypes.',
        role: 'vibe_coding',
        audience: 'explorer'
      }
    ]
  },
  'executive-flash-tour': {
    id: 'executive-flash-tour',
    title: 'Executive Flash Tour',
    badge: '👔 Executive',
    description: '3-step high-velocity executive summary of career impact, live interactive demos, and engagement.',
    audience: 'recruiter',
    role: 'overview',
    steps: [
      {
        selector: '#achievements',
        headline: 'Executive Accomplishments & Impact',
        commentary: 'Over a decade of fiscal integrity, biometric project governance for DAY-NULM, 100% compliance record, and modern software leadership.',
        role: 'overview',
        audience: 'recruiter'
      },
      {
        selector: '#projects',
        headline: 'Live Case Study Demos & Verified Systems',
        commentary: 'Explore 9 verified production case studies with interactive telemetric simulations, visual flowchart topologies, and audit logs.',
        role: 'overview',
        audience: 'recruiter'
      },
      {
        selector: '#contact',
        headline: 'Get in Touch / Retain Services',
        commentary: 'Direct executive channels for strategic tax consulting, financial systems automation, and technology retained advisory.',
        role: 'overview',
        audience: 'recruiter'
      }
    ]
  }
};

// Internal active tour state
let activeTourState = {
  isActive: false,
  isPaused: false,
  tourId: null,
  tourTitle: null,
  currentStepIndex: 0,
  totalSteps: 0,
  currentStep: null
};

const listeners = new Set();

function notifyListeners() {
  const snapshot = getActiveTourState();
  listeners.forEach((fn) => {
    try {
      fn(snapshot);
    } catch {
      // safe fallback
    }
  });
}

/**
 * Subscribes to tour state changes
 * @param {Function} callback
 * @returns {Function} unsubscribe
 */
export function subscribeTourState(callback) {
  if (typeof callback !== 'function') return () => {};
  listeners.add(callback);
  callback(getActiveTourState());
  return () => {
    listeners.delete(callback);
  };
}

/**
 * Returns a defensive snapshot of the active tour state
 */
export function getActiveTourState() {
  return {
    ...activeTourState,
    currentStep: activeTourState.currentStep ? { ...activeTourState.currentStep } : null
  };
}

/**
 * Smoothly scrolls to the element specified by the CSS selector, respecting reduced-motion preferences.
 * @param {string} selector
 */
export function scrollToStepElement(selector) {
  if (typeof document === 'undefined' || !selector) return false;
  try {
    const el = document.querySelector(selector);
    if (!el) return false;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    el.scrollIntoView({
      behavior: prefersReduced ? 'auto' : 'smooth',
      block: 'center'
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Dispatches step change events across window and coordinates audience/role
 */
function dispatchStepEvents(tour, stepIndex) {
  const step = tour.steps[stepIndex];
  if (!step) return;

  activeTourState = {
    isActive: true,
    isPaused: false,
    tourId: tour.id,
    tourTitle: tour.title,
    currentStepIndex: stepIndex,
    totalSteps: tour.steps.length,
    currentStep: step
  };

  scrollToStepElement(step.selector);

  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    // 1. Dispatch tour step event
    const eventDetail = {
      tourId: tour.id,
      tourTitle: tour.title,
      stepIndex,
      totalSteps: tour.steps.length,
      step: { ...step },
      selector: step.selector,
      headline: step.headline,
      commentary: step.commentary,
      role: step.role,
      audience: step.audience
    };

    try {
      window.dispatchEvent(new CustomEvent('portfolio:tour-step', { detail: eventDetail }));
      window.dispatchEvent(new CustomEvent('portfolio:tour-state', { detail: getActiveTourState() }));
    } catch {
      // safe fallback
    }

    // 2. Dispatch role/audience switch if specified in step
    if (step.role) {
      try {
        window.dispatchEvent(new CustomEvent('portfolio:set-role', { detail: { role: step.role } }));
      } catch {
        // safe fallback
      }
    }
    if (step.audience) {
      try {
        window.dispatchEvent(new CustomEvent('portfolio:audience-change', { detail: { audience: step.audience } }));
      } catch {
        // safe fallback
      }
    }

    // 3. Dispatch specific step action if provided (e.g. open case study or open estimator)
    if (step.action && step.action.type) {
      try {
        if (step.action.type === 'open-case-study') {
          window.dispatchEvent(
            new CustomEvent('portfolio:open-case-study', { detail: { id: String(step.action.id || '01') } })
          );
        } else if (step.action.type === 'open-estimator') {
          window.dispatchEvent(new CustomEvent('portfolio:switch-contact-tab', { detail: { tab: 'quote' } }));
          window.dispatchEvent(new CustomEvent('portfolio:open-estimator'));
        }
      } catch {
        // safe fallback
      }
    }
  }

  notifyListeners();
}

/**
 * Starts a guided interactive tour by ID
 * @param {string} tourId
 * @returns {boolean} whether the tour successfully started
 */
export function startTour(tourId = 'recruiter-fast-track') {
  const safeId = String(tourId || 'recruiter-fast-track').trim();
  const tour = PORTFOLIO_TOURS[safeId] || PORTFOLIO_TOURS['recruiter-fast-track'];

  if (!tour || !Array.isArray(tour.steps) || tour.steps.length === 0) {
    return false;
  }

  dispatchStepEvents(tour, 0);
  return true;
}

/**
 * Advances to the next step of the active tour
 * @returns {boolean} true if advanced, false if tour ended or inactive
 */
export function nextTourStep() {
  if (!activeTourState.isActive || !activeTourState.tourId) return false;
  const tour = PORTFOLIO_TOURS[activeTourState.tourId];
  if (!tour) {
    endTour();
    return false;
  }

  const nextIdx = activeTourState.currentStepIndex + 1;
  if (nextIdx >= tour.steps.length) {
    endTour();
    return false;
  }

  dispatchStepEvents(tour, nextIdx);
  return true;
}

/**
 * Returns to the previous step of the active tour
 * @returns {boolean} true if stepped back, false if already at first step or inactive
 */
export function prevTourStep() {
  if (!activeTourState.isActive || !activeTourState.tourId) return false;
  const tour = PORTFOLIO_TOURS[activeTourState.tourId];
  if (!tour) {
    endTour();
    return false;
  }

  const prevIdx = activeTourState.currentStepIndex - 1;
  if (prevIdx < 0) return false;

  dispatchStepEvents(tour, prevIdx);
  return true;
}

/**
 * Pauses the active tour
 */
export function pauseTour() {
  if (!activeTourState.isActive) return;
  activeTourState = {
    ...activeTourState,
    isPaused: true
  };
  notifyListeners();
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('portfolio:tour-pause', { detail: getActiveTourState() }));
  }
}

/**
 * Resumes a paused tour
 */
export function resumeTour() {
  if (!activeTourState.isActive) return;
  activeTourState = {
    ...activeTourState,
    isPaused: false
  };
  notifyListeners();
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('portfolio:tour-resume', { detail: getActiveTourState() }));
  }
}

/**
 * Ends the active tour, clears state, and dispatches portfolio:tour-end event
 */
export function endTour() {
  const finishedTourId = activeTourState.tourId;
  activeTourState = {
    isActive: false,
    isPaused: false,
    tourId: null,
    tourTitle: null,
    currentStepIndex: 0,
    totalSteps: 0,
    currentStep: null
  };

  notifyListeners();

  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    try {
      window.dispatchEvent(
        new CustomEvent('portfolio:tour-end', {
          detail: { tourId: finishedTourId }
        })
      );
      window.dispatchEvent(new CustomEvent('portfolio:tour-state', { detail: getActiveTourState() }));
    } catch {
      // safe fallback
    }
  }

  return true;
}

/**
 * Returns list of all available tours
 */
export function listTours() {
  return Object.values(PORTFOLIO_TOURS);
}
