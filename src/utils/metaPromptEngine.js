/**
 * Meta-Prompt Synthesis Engine
 * Client-Side, 100% Offline, Deterministic AI Prompt Engineering System.
 * 
 * Synthesizes:
 * 1. Short Executable CLI Command (e.g. `/run --task="..." --role=architect`)
 * 2. Full 5-Part Engineered Meta-Prompt ([Role], [Context], [Task Constraints], [Few-Shot / Directives], [Output Format])
 * 3. Actionable Engineering Iteration Suggestions for prompt fine-tuning & optimization.
 */

export const META_PROMPT_CATEGORIES = {
  CODE_ARCHITECTURE: 'code_architecture',
  TECHNICAL_WRITING: 'technical_writing',
  PERFORMANCE_OPTIMIZATION: 'performance_optimization',
  UI_UX_ENGINEERING: 'ui_ux_engineering',
  DATA_TAX_AUDIT: 'data_tax_audit',
  GENERAL_ASSISTANT: 'general_assistant'
};

export const CATEGORY_DEFINITIONS = {
  [META_PROMPT_CATEGORIES.CODE_ARCHITECTURE]: {
    id: 'code_architecture',
    name: 'Code Architecture',
    commandVerb: '/run',
    roleFlag: '--role=architect',
    categoryFlag: '--category=code-architecture',
    extraFlags: ['--strict-types', '--zero-regression', '--solid-principles'],
    role: `Principal Software Architect & Systems Engineer with deep expertise in modular architectures, design patterns (SOLID, Clean Architecture, Hexagonal, Event-Driven), type-safety, interface segregation, and zero-downtime refactoring.`,
    context: `Production-grade software engineering environment. Focus on high cohesion, loose coupling, deterministic state flow, and zero technical debt. Code must be idiomatic, maintainable, and easily testable.`,
    constraints: [
      'Strict Single Responsibility Principle (SRP) per module and function.',
      'Maintain 100% backward compatibility for all existing public APIs and interfaces.',
      'Zero unhandled side-effects; pure functions preferred for domain business logic.',
      'No implicit type coercions or loose typing; include complete type annotations/JSDoc.',
      'All asynchronous operations must include cancellation, error boundaries, and timeouts.'
    ],
    directives: [
      '1. Deconstruct the architecture into bounded contexts, components, and service boundaries.',
      '2. Identify potential anti-patterns, tight coupling, and lifecycle race conditions.',
      '3. Formulate a modular design with clean interfaces, dependency injection, and data contracts.',
      '4. Implement production-grade code with error handling, logging, and defensive validation.',
      '5. Provide anti-regression safeguards and verification unit/integration test vectors.'
    ],
    outputFormat: `### 1. Architectural Blueprint & Component Topology
- High-level design summary, data flow, and separation of concerns.
- Module interaction matrix and state lifecycle.

### 2. Interface Contracts & Data Flow
- Strict input/output schemas, type definitions, and event interfaces.

### 3. Production Implementation
- Complete, runnable, drop-in replacement code with inline architecture documentation.

### 4. Edge Cases, Failure Modes & Test Strategy
- Boundary conditions, race condition mitigation, and validation test vectors.`,
    iterationTips: [
      {
        aspect: 'Framework & Language Target',
        suggestion: 'Specify the exact runtime environment (e.g. Node 20+, React 19, TypeScript 5.5, Web Workers) to eliminate ambiguity.',
        example: '--target="React 19 + TypeScript 5.5 Strict"'
      },
      {
        aspect: 'State & Concurrency Model',
        suggestion: 'Define whether state should be immutable, reactive (RxJS/Zustand), or event-driven to lock down the concurrency model.',
        example: '--concurrency="web-worker-offloaded" --state="immutable-snapshot"'
      },
      {
        aspect: 'Error Boundary Contracts',
        suggestion: 'State explicit recovery mechanisms (e.g. retry with exponential backoff, circuit-breaker, or fallback ladder).',
        example: '--fallback="circuit-breaker" --retry-limit=3'
      }
    ]
  },

  [META_PROMPT_CATEGORIES.TECHNICAL_WRITING]: {
    id: 'technical_writing',
    name: 'Technical Writing',
    commandVerb: '/document',
    roleFlag: '--role=tech-writer',
    categoryFlag: '--category=technical-writing',
    extraFlags: ['--format=markdown', '--style=google-dev', '--clarity=max'],
    role: `Lead Technical Author & Documentation Strategist adhering to Google Developer Documentation Guidelines, Diátaxis framework, and Oxford Technical Style principles.`,
    context: `Developer-facing documentation ecosystem. Audience ranges from junior engineers to senior architects. Clarity, precision, runnable copy-paste examples, and frictionless onboarding are mandatory.`,
    constraints: [
      'Use active voice, present tense, second-person direct address ("you"), and concise sentences.',
      'Every technical term or acronym must be defined on first occurrence.',
      'All code examples must be syntax-highlighted, runnable, and thoroughly annotated.',
      'Tables and diagrams must be used wherever comparative data is presented.',
      'Include explicit prerequisites, environment assumptions, and version requirements.'
    ],
    directives: [
      '1. Define target audience persona, prerequisites, and tangible takeaways.',
      '2. Structure the document following the Diátaxis model (Tutorial, How-To, Reference, Explanation).',
      '3. Break complex mechanisms into numbered, linear, sequential steps.',
      '4. Provide copy-pasteable configuration and code blocks with expected output readouts.',
      '5. Conclude with an FAQ and common troubleshooting resolution matrix.'
    ],
    outputFormat: `### 1. Executive Overview & Learning Objectives
- Purpose of the document, target audience, and key prerequisites.

### 2. Conceptual Architecture / System Model
- Visual or textual diagram explaining core concepts before implementation.

### 3. Step-by-Step Practical Implementation Guide
- Sequential numbered instructions with annotated code blocks.

### 4. API & Parameter Reference Matrix
- Comprehensive table listing all flags, options, default values, and types.

### 5. Troubleshooting & Common Failure Pitfalls
- Problem vs. Solution resolution matrix with diagnostic steps.`,
    iterationTips: [
      {
        aspect: 'Audience Skill Level',
        suggestion: 'Pin down the reader persona (e.g., frontend developer, system admin, API consumer) to tailor vocabulary depth.',
        example: '--audience="Intermediate Fullstack Developers"'
      },
      {
        aspect: 'Document Typology',
        suggestion: 'Specify whether you need a quickstart tutorial, architectural decision record (ADR), or exhaustive API reference.',
        example: '--doc-type="Quickstart Guide + API Reference"'
      },
      {
        aspect: 'Visual Artifacts',
        suggestion: 'Request Mermaid diagrams (flowcharts, sequence diagrams) to visually illustrate system flow.',
        example: '--diagrams="mermaid-sequence-diagram"'
      }
    ]
  },

  [META_PROMPT_CATEGORIES.PERFORMANCE_OPTIMIZATION]: {
    id: 'performance_optimization',
    name: 'Performance Optimization',
    commandVerb: '/optimize',
    roleFlag: '--role=perf-opt',
    categoryFlag: '--category=performance-optimization',
    extraFlags: ['--target=60fps', '--zero-alloc', '--memory-budget=50mb'],
    role: `Principal Performance Engineer specializing in low-latency systems, zero-alloc algorithms, V8 runtime optimization, WebGPU/WASM vectorization, and memory leak profiling.`,
    context: `Performance-critical browser and runtime environment. Strict budgets on Time-to-First-Token (TTFT), Tokens-Per-Second (TPS), Frame Budget (16.6ms for 60fps), and heap memory allocation.`,
    constraints: [
      'Zero main thread blocking: execution slices must remain strictly < 16ms to avoid jank.',
      'Minimize heap garbage collection: avoid frequent allocations within hot loop paths.',
      'Document algorithmic Big-O time and space complexity for both baseline and optimized paths.',
      'Provide deterministic micro-benchmark harnesses to verify before vs. after throughput.',
      'Fallback gracefully if hardware acceleration (WebGPU / SIMD) is unavailable.'
    ],
    directives: [
      '1. Profile the execution bottleneck (CPU hotspot, DOM reflow, memory leak, IPC latency).',
      '2. Calculate per-operation time budget and asymptotic complexity.',
      '3. Apply zero-copy, caching, pooling, debouncing, or background worker offloading.',
      '4. Implement the optimized algorithm with memory cleanup safeguards.',
      '5. Measure and compare throughput, memory delta, and latency metrics.'
    ],
    outputFormat: `### 1. Bottleneck Audit & Root Cause Analysis
- Identified performance choke points, flame-graph indicators, and resource hogs.

### 2. Algorithmic Complexity Comparison
- Time & Space complexity: Baseline vs. Optimized.

### 3. High-Throughput Optimized Implementation
- Production-ready code with memory pooling, caching, or worker parallelization.

### 4. Benchmark Harness & Latency Verification
- Reproducible benchmark code and expected TTFT, TPS, or FPS metrics.`,
    iterationTips: [
      {
        aspect: 'Hardware Tier Constraints',
        suggestion: 'Define exact device constraints (e.g. mobile 4-core 2GB RAM vs 16-core WebGPU workstation).',
        example: '--device-tier="Mobile Low-RAM / WASM only"'
      },
      {
        aspect: 'Quantitative Targets',
        suggestion: 'Specify hard numeric thresholds (e.g. latency < 50ms, heap delta < 5MB, TPS > 30).',
        example: '--metrics="TTFT<200ms, TPS>35, heap<10MB"'
      },
      {
        aspect: 'Profiling Tooling',
        suggestion: 'Mention Chrome DevTools Performance Profiler or Node.js clinic.js for targeted diagnostics.',
        example: '--profiler="Chrome Performance / Memory Heap Snapshot"'
      }
    ]
  },

  [META_PROMPT_CATEGORIES.UI_UX_ENGINEERING]: {
    id: 'ui_ux_engineering',
    name: 'UI/UX Engineering',
    commandVerb: '/design',
    roleFlag: '--role=ui-engineer',
    categoryFlag: '--category=ui-ux-engineering',
    extraFlags: ['--a11y=wcag-aaa', '--responsive', '--reduced-motion'],
    role: `Staff Design Technologist & Accessible Frontend Engineer expert in modern CSS, Tailwind, semantic HTML5, WCAG 2.1 AA/AAA compliance, fluid micro-interactions, and design systems.`,
    context: `Production web application interface. Demands delightful user experience, flawless responsive ergonomics across mobile/tablet/desktop, and strict accessibility for screen readers and keyboard users.`,
    constraints: [
      'Strict WCAG 2.1 AA (or AAA) accessibility: visible focus rings, ARIA labels, semantic roles.',
      'Full responsive adaptivity: smooth layout from 320px mobile viewport to 4K ultra-wide.',
      'Respect prefers-reduced-motion media query for all transitions and physics animations.',
      'Touch targets must be >= 44x44px for touch screens.',
      'Cumulative Layout Shift (CLS) must be 0; image/media elements must have explicit dimensions.'
    ],
    directives: [
      '1. Define visual hierarchy, color palette, contrast ratios, and typography rhythm.',
      '2. Construct semantic HTML markup tree with proper ARIA live regions and keyboard traps.',
      '3. Style using responsive Tailwind CSS / modern CSS grid, flexbox, and container queries.',
      '4. Layer fluid micro-interactions with hardware-accelerated transforms (translate, scale, opacity).',
      '5. Validate keyboard navigation order (Tab, Shift+Tab, Arrow keys, Esc).'
    ],
    outputFormat: `### 1. UX Specification & Accessibility Architecture
- Color contrast scores, ARIA mapping, and keyboard interaction flow.

### 2. Responsive Component Implementation
- Clean, semantic JSX/HTML + Tailwind CSS component code with accessible tags.

### 3. Motion, States & Ergonomics
- Hover, focus-visible, active, disabled, and reduced-motion states.

### 4. Accessibility & Cross-Device Checklist
- Screen-reader verification notes, touch-target audit, and responsive breakpoint matrix.`,
    iterationTips: [
      {
        aspect: 'Design System & Tokens',
        suggestion: 'Specify color tokens, font families, or border-radius system (e.g. Zinc/Emerald palette, Inter font).',
        example: '--palette="emerald-dark" --tokens="tailwind-v3"'
      },
      {
        aspect: 'Interactive State Matrix',
        suggestion: 'Request all interactive states (hover, active, focus-visible, disabled, loading, empty, error).',
        example: '--states="default,hover,active,loading,empty,error"'
      },
      {
        aspect: 'Screen Reader Scenarios',
        suggestion: 'Specify NVDA/VoiceOver announcement scripts for dynamic state changes.',
        example: '--announcements="aria-live-polite on filter change"'
      }
    ]
  },

  [META_PROMPT_CATEGORIES.DATA_TAX_AUDIT]: {
    id: 'data_tax_audit',
    name: 'Data/Tax Audit',
    commandVerb: '/audit',
    roleFlag: '--role=tax-auditor',
    categoryFlag: '--category=data-tax-audit',
    extraFlags: ['--statute=in-tax', '--reconcile-strict', '--audit-trail'],
    role: `Senior Chartered Accountant & Corporate Statutory Auditor with mastery over Indian Tax Statutes (GST Act 2017, Income Tax Act 1961, Companies Act 2013), double-entry accounting, and ledger variance analysis.`,
    context: `Corporate financial audit and statutory tax compliance workspace. Demands absolute mathematical precision (0.00 discrepancy), dual-entry integrity (Debit == Credit), and statutory section citations.`,
    constraints: [
      'Mathematical zero-discrepancy: all reconciliations and balances must reconcile to 2 decimal places.',
      'Statutory compliance: cite exact legal sections, rules, notifications, and circulars (e.g. Sec 16(2), Sec 194C/J/Q, Sec 206AB).',
      'Dual-entry balance: every adjustment journal entry must balance Debits and Credits with narration.',
      'Segregate eligible vs. ineligible input tax credits (ITC) under Section 17(5) and Rule 42/43.',
      'Include a complete audit trail documentation for statutory assessment inspection.'
    ],
    directives: [
      '1. Ingest and verify source vouchers, purchase/sales registers, and bank statements.',
      '2. Reconcile accounting ledger balances against statutory portal data (GSTR-2B, 26AS, AIS/TIS).',
      '3. Quantify variances, timing differences, rate mismatches, and statutory tax liabilities.',
      '4. Formulate corrective double-entry journal entries with statutory narration.',
      '5. Draft compliance audit memorandum with risk assessment and penalty exposure mitigation.'
    ],
    outputFormat: `### 1. Statutory Audit Overview & Legal References
- Scope of audit, applicable Financial Year (FY) / Assessment Year (AY), and relevant tax sections.

### 2. Reconciliation & Variance Matrix
- Side-by-side reconciliation table (Books vs. Statutory Returns/Portals, Delta, Cause).

### 3. Rectification Journal Entries (Double-Entry)
- Formatted Journal entries (Date, Particulars, Ledger, Debit, Credit, Narration).

### 4. Statutory Compliance & Risk Mitigation Roadmap
- Interest calculation (e.g. Sec 50), penalty clauses, and filing rectification actions.`,
    iterationTips: [
      {
        aspect: 'Assessment Year & FY Context',
        suggestion: 'Specify the exact Financial Year (e.g. FY 2024-25 / AY 2025-26) to lock in prevailing tax slabs and rules.',
        example: '--period="FY 2024-25 (AY 2025-26)"'
      },
      {
        aspect: 'Turnover & Business Scale',
        suggestion: 'Specify turnover scale (e.g. MSME vs Corporate > ₹10 Cr) to apply correct e-invoicing and 44AB applicability.',
        example: '--scale="Turnover > 10 Cr (E-Invoice + Tax Audit Mandatory)"'
      },
      {
        aspect: 'Statutory Section Scope',
        suggestion: 'Target specific sections like TDS 194C/194J/194Q or GST Rule 36(4) / Rule 88B.',
        example: '--sections="GST-16(2), TDS-194Q, TCS-206C(1H)"'
      }
    ]
  },

  [META_PROMPT_CATEGORIES.GENERAL_ASSISTANT]: {
    id: 'general_assistant',
    name: 'General Assistant',
    commandVerb: '/run',
    roleFlag: '--role=assistant',
    categoryFlag: '--category=general-assistant',
    extraFlags: ['--depth=comprehensive', '--mode=direct', '--factual'],
    role: `High-Precision AI Polymath & Technical Consultant capable of synthesizing cross-disciplinary knowledge into actionable, verifiable, and structured solutions.`,
    context: `General-purpose engineering, strategic problem solving, and analytical advisory environment. Directness, factual rigor, and clear presentation are prioritized over conversational filler.`,
    constraints: [
      'Provide direct, logically structured answers without unnecessary conversational fluff.',
      'Explicitly validate assumptions before formulating recommendations.',
      'Organize answers using headings, bullet points, and actionable decision frameworks.',
      'Clearly delineate verified facts from theoretical opinions or trade-offs.'
    ],
    directives: [
      '1. Deconstruct the inquiry into underlying objectives and constraints.',
      '2. Synthesize clear, high-signal solutions with logical reasoning.',
      '3. Present implementation steps or comparison frameworks.',
      '4. Highlight key caveats, prerequisites, and alternative paths.'
    ],
    outputFormat: `### 1. Executive Summary & Direct Answer
- Crisp, high-signal synthesis addressing the core question immediately.

### 2. Detailed Technical Breakdown & Analysis
- Core analysis, logic, and operational steps.

### 3. Actionable Implementation / Decision Matrix
- Concrete steps, code snippets, or comparative choices.

### 4. Caveats, Trade-Offs & Next Steps
- Critical nuances, edge conditions, and follow-up recommendations.`,
    iterationTips: [
      {
        aspect: 'Deliverable Format',
        suggestion: 'Specify the desired format (e.g., bulleted executive brief, markdown table, step-by-step checklist).',
        example: '--format="Executive Checklist + Decision Matrix"'
      },
      {
        aspect: 'Depth & Scope',
        suggestion: 'Declare whether you need a high-level 2-minute summary or an exhaustive deep-dive.',
        example: '--depth="Deep-dive with rationale"'
      },
      {
        aspect: 'Key Constraints',
        suggestion: 'List any organizational, budgetary, or technical constraints to ground the response.',
        example: '--budget="Zero-cost open source tools only"'
      }
    ]
  }
};

/**
 * Keyword-based Category Classifier with weighted scoring
 * 100% Client-side, deterministic, zero external API.
 */
export function detectCategory(input = '') {
  if (!input || typeof input !== 'string') {
    return META_PROMPT_CATEGORIES.GENERAL_ASSISTANT;
  }

  const text = input.toLowerCase();

  const scores = {
    [META_PROMPT_CATEGORIES.CODE_ARCHITECTURE]: 0,
    [META_PROMPT_CATEGORIES.TECHNICAL_WRITING]: 0,
    [META_PROMPT_CATEGORIES.PERFORMANCE_OPTIMIZATION]: 0,
    [META_PROMPT_CATEGORIES.UI_UX_ENGINEERING]: 0,
    [META_PROMPT_CATEGORIES.DATA_TAX_AUDIT]: 0,
    [META_PROMPT_CATEGORIES.GENERAL_ASSISTANT]: 1 // baseline
  };

  // Code Architecture keywords
  const archKeywords = [
    'architecture', 'refactor', 'solid', 'design pattern', 'decouple', 'coupling', 'cohesion',
    'module', 'service layer', 'interface', 'repository', 'clean architecture', 'hexagonal',
    'dependency injection', 'singleton', 'factory', 'state machine', 'class', 'domain model',
    'microservice', 'type safe', 'typescript', 'esm', 'backward compatibility', 'api contract'
  ];
  archKeywords.forEach((kw) => {
    if (text.includes(kw)) scores[META_PROMPT_CATEGORIES.CODE_ARCHITECTURE] += 3;
  });

  // Performance Optimization keywords
  const perfKeywords = [
    'optimize', 'performance', 'latency', 'ttft', 'tps', 'fps', 'benchmark', 'profiler',
    'memory leak', 'heap', 'webgpu', 'wasm', 'zero-alloc', 'throughput', 'hot loop',
    'jank', 'frame drop', 'garbage collection', 'worker', 'parallel', 'cache', 'debounce',
    'throttle', 'concurrency', 'simd', 'bundle size', 'lazy load'
  ];
  perfKeywords.forEach((kw) => {
    if (text.includes(kw)) scores[META_PROMPT_CATEGORIES.PERFORMANCE_OPTIMIZATION] += 3;
  });

  // UI/UX Engineering keywords
  const uiKeywords = [
    'ui', 'ux', 'css', 'tailwind', 'component', 'modal', 'drawer', 'responsive', 'animation',
    'motion', 'accessibility', 'a11y', 'wcag', 'aria', 'focus', 'keyboard navigation',
    'color contrast', 'layout', 'grid', 'flexbox', 'figma', 'design system', 'touch target',
    'cursor', 'button', 'card', 'navbar', 'dialog', 'tooltip'
  ];
  uiKeywords.forEach((kw) => {
    if (text.includes(kw)) scores[META_PROMPT_CATEGORIES.UI_UX_ENGINEERING] += 3;
  });

  // Technical Writing keywords
  const docKeywords = [
    'document', 'documentation', 'tech writing', 'readme', 'changelog', 'api reference',
    'tutorial', 'how-to', 'guide', 'manual', 'whitepaper', 'release notes', 'diataxis',
    'adrs', 'architecture decision record', 'user guide', 'handbook', 'specification', 'spec'
  ];
  docKeywords.forEach((kw) => {
    if (text.includes(kw)) scores[META_PROMPT_CATEGORIES.TECHNICAL_WRITING] += 3;
  });

  // Data / Tax Audit keywords
  const taxKeywords = [
    'tax', 'gst', 'tds', 'itr', 'audit', 'tally', 'ledger', 'balance sheet', 'reconciliation',
    'gstr-2b', 'gstr-3b', 'gstr-1', '26as', 'ais', 'tis', 'voucher', 'trial balance',
    'statutory', 'section 194', 'section 16', 'inward', 'outward', 'itc', 'input tax credit',
    'chartered accountant', 'journal entry', 'debit', 'credit', 'financial year'
  ];
  taxKeywords.forEach((kw) => {
    if (text.includes(kw)) scores[META_PROMPT_CATEGORIES.DATA_TAX_AUDIT] += 3;
  });

  // Find category with highest score
  let bestCategory = META_PROMPT_CATEGORIES.GENERAL_ASSISTANT;
  let highestScore = 1;

  for (const [cat, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score;
      bestCategory = cat;
    }
  }

  return bestCategory;
}

/**
 * Clean & sanitize user task for command line flags
 */
export function sanitizeTaskForCommand(task = '') {
  if (!task) return 'execute-task';
  return task
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/"/g, '\\"')
    .trim()
    .slice(0, 160);
}

/**
 * Synthesizes a Short Executable CLI Command
 * Example: `/run --task="..." --role=architect --category=code-architecture`
 */
export function synthesizeExecutableCommand(task, categoryKey, customFlags = []) {
  const cat = CATEGORY_DEFINITIONS[categoryKey] || CATEGORY_DEFINITIONS[META_PROMPT_CATEGORIES.GENERAL_ASSISTANT];
  const verb = cat.commandVerb || '/run';
  const cleanTask = sanitizeTaskForCommand(task);

  const flagList = [
    `--task="${cleanTask}"`,
    cat.roleFlag,
    cat.categoryFlag,
    ...(cat.extraFlags || []),
    ...customFlags
  ];

  return `${verb} ${flagList.join(' ')}`;
}

/**
 * Builds the full 5-part Engineered Meta-Prompt
 * [Role], [Context], [Task Constraints], [Few-Shot / Directives], and [Output Format]
 */
export function buildEngineeredPrompt({
  task,
  categoryKey,
  customContext = '',
  customConstraints = [],
  customDirectives = []
}) {
  const cat = CATEGORY_DEFINITIONS[categoryKey] || CATEGORY_DEFINITIONS[META_PROMPT_CATEGORIES.GENERAL_ASSISTANT];

  const mergedConstraints = [
    ...(cat.constraints || []),
    ...customConstraints
  ];

  const mergedDirectives = [
    ...(cat.directives || []),
    ...customDirectives
  ];

  const fullContext = customContext
    ? `${cat.context}\n${customContext}`
    : cat.context;

  const promptSections = [
    `# META-PROMPT: ${cat.name.toUpperCase()} SPECIFICATION`,
    `Execution Standard: Deterministic, Production-Grade, Zero-Hallucination`,
    ``,
    `## [Role]`,
    cat.role,
    ``,
    `## [Context]`,
    fullContext,
    ``,
    `## [Task Objective]`,
    task.trim(),
    ``,
    `## [Task Constraints]`,
    mergedConstraints.map((c, i) => `${i + 1}. ${c}`).join('\n'),
    ``,
    `## [Few-Shot / Directives]`,
    mergedDirectives.join('\n'),
    ``,
    `## [Output Format]`,
    cat.outputFormat
  ];

  return promptSections.join('\n');
}

/**
 * Generates tailored Engineering Iteration Suggestions
 * Advises the user how to fine-tune and optimize the prompt further
 */
export function generateIterationSuggestions(categoryKey, task = '') {
  const cat = CATEGORY_DEFINITIONS[categoryKey] || CATEGORY_DEFINITIONS[META_PROMPT_CATEGORIES.GENERAL_ASSISTANT];
  const baseTips = cat.iterationTips || [];

  // Tailored dynamic contextual tips based on task content
  const dynamicTips = [...baseTips];

  const taskLower = String(task).toLowerCase();
  if (taskLower.includes('webgpu') || taskLower.includes('wasm') || taskLower.includes('ai')) {
    dynamicTips.push({
      aspect: 'Hardware Tiering',
      suggestion: 'Specify fallback behavior for devices lacking WebGPU (e.g. WASM / CPU fallback).',
      example: '--hardware-fallback="webgpu -> wasm -> deterministic"'
    });
  }

  if (taskLower.includes('test') || taskLower.includes('verify')) {
    dynamicTips.push({
      aspect: 'Test Harness Assertion',
      suggestion: 'Demand explicit test assertions (e.g., assert.strictEqual, pass/fail counts) in output.',
      example: '--test-framework="node-assert" --coverage="100%"'
    });
  }

  return dynamicTips;
}

/**
 * Master Synthesis Function
 * One-call synthesis pipeline delivering:
 * a) Short Executable Command
 * b) 5-Part Engineered Meta-Prompt
 * c) Actionable Engineering Iteration Suggestions
 */
export function synthesizeMetaPrompt(input, options = {}) {
  const task = typeof input === 'string' ? input : (input?.task || input?.prompt || '');
  const chosenCategory = options.category || (typeof input === 'object' && input?.category) || detectCategory(task);
  const categoryKey = CATEGORY_DEFINITIONS[chosenCategory] ? chosenCategory : detectCategory(task);

  const command = synthesizeExecutableCommand(task, categoryKey, options.customFlags || []);
  const metaPrompt = buildEngineeredPrompt({
    task,
    categoryKey,
    customContext: options.customContext || '',
    customConstraints: options.customConstraints || [],
    customDirectives: options.customDirectives || []
  });
  const iterationSuggestions = generateIterationSuggestions(categoryKey, task);

  const catMeta = CATEGORY_DEFINITIONS[categoryKey];

  return {
    command,
    metaPrompt,
    iterationSuggestions,
    category: {
      id: catMeta.id,
      name: catMeta.name,
      verb: catMeta.commandVerb
    },
    metadata: {
      synthesizedAt: new Date().toISOString(),
      offlineReady: true,
      estimatedTokens: Math.round(metaPrompt.length / 4),
      categoryKey
    }
  };
}

/**
 * Returns all available categories for UI dropdowns or command palette selection
 */
export function getAvailableCategories() {
  return Object.values(CATEGORY_DEFINITIONS).map((cat) => ({
    id: cat.id,
    name: cat.name,
    commandVerb: cat.commandVerb,
    roleFlag: cat.roleFlag,
    categoryFlag: cat.categoryFlag
  }));
}

/**
 * Helper to prepare clean copy-ready Markdown text for clipboard
 */
export function formatMetaPromptForClipboard(result) {
  if (!result) return '';
  return `### Executable Command:
\`\`\`bash
${result.command}
\`\`\`

---

### Engineered Meta-Prompt:
\`\`\`markdown
${result.metaPrompt}
\`\`\`

---

### Engineering Iteration Suggestions:
${result.iterationSuggestions.map((tip, idx) => `${idx + 1}. **${tip.aspect}**: ${tip.suggestion}\n   *Example:* \`${tip.example}\``).join('\n\n')}`;
}

export default {
  META_PROMPT_CATEGORIES,
  CATEGORY_DEFINITIONS,
  detectCategory,
  synthesizeExecutableCommand,
  buildEngineeredPrompt,
  generateIterationSuggestions,
  synthesizeMetaPrompt,
  getAvailableCategories,
  formatMetaPromptForClipboard
};
