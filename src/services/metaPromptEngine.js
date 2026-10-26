/**
 * Meta-Prompt Engineering Engine (MetaPromptStudio)
 * Transforms user intents and rough task ideas into:
 * 1. A concise, executable command (Short Command)
 * 2. A production-ready, structured LLM Meta-Prompt
 * 3. Actionable prompt engineering suggestions & refinement tips
 */

export const META_PROMPT_TEMPLATES = [
  {
    id: 'gst-recon',
    title: '📊 GST 2B vs Purchase Register Reconciliation',
    domain: 'Accounting & Tax',
    description: 'Automate high-volume GSTR-2B matching, ITC classification & vendor follow-up',
    query: 'build automated GST 2B vs purchase register reconciliation tool with variance flags',
    shortCommand: 'python scripts/reconcile_gst_2b.py --ledger purchase.xlsx --portal gstr2b.json --threshold 0.05 --export delta.xlsx',
    category: 'tax'
  },
  {
    id: 'react-component',
    title: '⚛️ React 19 Accessible Virtualized Table',
    domain: 'Frontend Engineering',
    description: 'Zero-lag data grid with keyboard navigation, sorting, and dark mode support',
    query: 'create accessible virtualized data table in React 19 with Tailwind v4 and keyboard navigation',
    shortCommand: 'npx degit atul-portfolio/templates/react19-data-grid src/components/DataGrid --force',
    category: 'dev'
  },
  {
    id: 'multi-agent-dag',
    title: '🤖 Multi-Agent Autonomous Workflow DAG',
    domain: 'AI & Multi-Agent',
    description: 'Task planner, validator, and executor loop with Antigravity / Claude Code',
    query: 'orchestrate multi-agent task planner with self-healing tools and step verification',
    shortCommand: 'antigravity run --pipeline multi_agent_planner.json --max-iterations 12 --telemetry true',
    category: 'ai'
  },
  {
    id: 'tally-erp-sync',
    title: '📈 Tally Prime XML/ODBC Sync Pipeline',
    domain: 'Corporate ERP',
    description: 'Extract multi-branch daybook and ledger balances into real-time BI warehouse',
    query: 'build Tally Prime XML server export script to extract daybook into PostgreSQL',
    shortCommand: 'node scripts/tally_prime_export.mjs --port 9000 --company "ATUL_CORP" --days 30 --dest db',
    category: 'accounting'
  },
  {
    id: 'excel-mis-vba',
    title: '📉 Excel Power Query & Macro Automation',
    domain: 'MIS Operations',
    description: 'Clean government portal raw data and generate formatted executive scorecard',
    query: 'create Power Query M-code to clean multi-district portal CSVs and generate KPI summary',
    shortCommand: 'excel-cli run-macro --sheet DAY_NULM_Data.xlsx --macro Module1.ProcessDistrictBatches',
    category: 'mis'
  }
];

/**
 * Domain categorization helper
 */
function classifyDomain(text = '') {
  const lower = text.toLowerCase();
  if (lower.includes('gst') || lower.includes('tax') || lower.includes('itc') || lower.includes('itr') || lower.includes('tds')) {
    return 'tax';
  }
  if (lower.includes('account') || lower.includes('tally') || lower.includes('ledger') || lower.includes('brs') || lower.includes('voucher') || lower.includes('balance sheet')) {
    return 'accounting';
  }
  if (lower.includes('mis') || lower.includes('excel') || lower.includes('power query') || lower.includes('vba') || lower.includes('power bi') || lower.includes('dashboard')) {
    return 'mis';
  }
  if (lower.includes('agent') || lower.includes('llm') || lower.includes('ai') || lower.includes('claude') || lower.includes('model') || lower.includes('antigravity') || lower.includes('prompt')) {
    return 'ai';
  }
  if (lower.includes('react') || lower.includes('component') || lower.includes('frontend') || lower.includes('ui') || lower.includes('tailwind') || lower.includes('css') || lower.includes('vite') || lower.includes('javascript') || lower.includes('typescript') || lower.includes('node') || lower.includes('api')) {
    return 'dev';
  }
  return 'general';
}

/**
 * Generates an engineered short command, structured meta-prompt, and refinement suggestions
 */
export function generateMetaPrompt(rawInput = '', context = {}) {
  const cleanInput = String(rawInput || '')
    .replace(/^(\/engineer|\/prompt|\/metaprompt)\s*/i, '')
    .trim();

  // If no task specified, return interactive studio guide with templates
  if (!cleanInput) {
    return {
      isStudioGuide: true,
      task: 'Meta-Prompt Engineer & Command Studio',
      title: '🎯 Prompt Studio & Meta-Prompt Engineer',
      domain: 'Prompt Architecture',
      category: 'ai',
      shortCommand: 'claude-code "Initialize meta-prompt engineering workflow with domain constraints"',
      metaPrompt: `## Role & Persona
You are a Principal AI Systems Architect and Prompt Engineer specializing in high-reliability software, statutory compliance, and agentic workflows.

## Mission
Transform open-ended business objectives into deterministic, testable, and robust specifications.

## Standard Engineering Protocol
1. Clarify ambiguous requirements before writing implementation code.
2. Define explicit input/output schemas with typed fields and boundary constraints.
3. Apply defensive programming: validate edge cases, nullability, and security contracts.
4. Provide verifiable unit test cases alongside deliverables.

## How to use this Studio
Type: \`/engineer <your task or project goal>\`
Example: \`/engineer Build an automated GST 2B reconciliation tool in Python\``,
      suggestions: [
        'Be specific about target technologies (e.g. React 19, Python 3.12, PostgreSQL).',
        'Specify concrete latency or performance requirements (e.g. < 50ms, sub-second execution).',
        'State input format (e.g. JSON, Excel .xlsx, PDF, REST payload) and required output schema.',
        'Include negative constraints: "Do NOT use external UI libraries", "Zero cloud telemetry".'
      ],
      summaryText: `⚡ **Welcome to Atul's Meta-Prompt Engineering Studio**\n\nI can transform any technical task, accounting problem, or software concept into:\n1. ⚡ **Concise Executable Command** (Single-line CLI/terminal command)\n2. 🎯 **Structured Meta-Prompt** (Role, Context, Constraints, Step-by-Step execution)\n3. 💡 **Engineering Suggestions** (Specific prompt optimization levers)\n\n*Choose a preset recipe below or type \`/engineer <your task>\` to get started:*`,
      templates: META_PROMPT_TEMPLATES
    };
  }

  const domain = classifyDomain(cleanInput);
  let shortCommand = '';
  let metaPrompt = '';
  let suggestions = [];
  let roleTitle = 'Principal Systems Engineer & Domain Architect';

  switch (domain) {
    case 'tax':
    case 'accounting': {
      roleTitle = 'Chief Financial Controller & Statutory Tax Architect';
      const cleanTask = cleanInput.replace(/^(build|create|make|write|generate)\s+/i, '');
      shortCommand = `python -m tax_engine.cli --task "${cleanTask.slice(0, 48)}" --strict-mode --audit-trail --output ./reports`;
      
      metaPrompt = `## Role & Persona
You are a Senior Corporate Accountant & Statutory Tax Architect with 10+ years of audit and compliance experience (specialized in Indian GST Act, Income Tax Rules, and Tally Prime ERP).

## Objective
Execute the following mission with 100% accounting accuracy and zero-tolerance for calculation errors:
"${cleanInput}"

## Context & Statutory Constraints
- **Regulatory Framework**: Compliance with statutory GST rules (Section 16(2), GSTR-2B matching, Rule 36(4)).
- **Financial Hygiene**: Double-entry ledger integrity, rounded to 2 decimal places, precise debit/credit symmetry.
- **Audit Defense**: All variance calculations must generate an indelible audit timestamp and reason code.
- **Data Privacy**: Client PAN, GSTIN, and financial turnover must be handled without third-party cloud leakage.

## Step-by-Step Methodology
1. **Input Validation**: Validate ledger column headers, GSTIN checksums, and date range formats.
2. **Reconciliation & Matching Engine**:
   - Level 1: Exact GSTIN + Invoice Number + Date match.
   - Level 2: Fuzzy Invoice Number matching with exact Taxable Value & Tax Amount.
   - Level 3: Variance flag (< ₹1 rounding vs material mismatch > ₹1).
3. **ITC Action Matrix**: Clearly categorize invoices into: Eligible ITC, Ineligible / Blocked (Sec 17(5)), Pending in 2B, and Inward Not in Purchase.
4. **Summary Scorecard**: Produce executive summary table with counts, taxable total, CGST, SGST, IGST, and net impact.

## Expected Output Format
- Clean, documented Python / Excel macro code with detailed inline comments.
- Formatted markdown summary tables with monospace numerical alignments.
- Verifiable test case with dummy invoice records showing edge cases (reverse charge, debit notes).`;

      suggestions = [
        'Specify threshold variance tolerances (e.g. allowable invoice rounding discrepancy ≤ ₹1.00).',
        'State whether debit/credit notes and reverse charge (RCM) invoices should be handled in separate bins.',
        'Request output export formats: styled Excel (.xlsx with color-coded status) or JSON for ERP sync.',
        'Specify if vendor notification emails or WhatsApp reminder drafts should be generated for missing invoices.'
      ];
      break;
    }

    case 'dev': {
      roleTitle = 'Principal Full-Stack Architect & React 19 Specialist';
      const cleanTask = cleanInput.replace(/^(build|create|make|write|generate)\s+/i, '');
      shortCommand = `npx vite create-app --template react-ts && cd react-ts && npm i tailwindcss lucide-react`;
      
      metaPrompt = `## Role & Persona
You are a Principal Frontend Architect and Web Performance Specialist specializing in React 19, modern Tailwind CSS, and ultra-responsive UI ergonomics.

## Objective
Engineer a modular, accessible, and high-performance solution for:
"${cleanInput}"

## Technical Architecture & Constraints
- **Framework & Runtime**: React 19, Vite, clean ESM architecture, TypeScript/Modern ES.
- **Styling & Design System**: Tailwind CSS, mobile-first responsive layout (320px to 4K), accessible high-contrast colors.
- **Ergonomics & A11y**: WAI-ARIA 1.2 compliance, keyboard roving tabindex, screen reader live regions, touch target ≥ 44px.
- **Performance Budget**: Sub-16ms render loops (60fps), React.memo/useCallback optimizations, zero memory leaks.
- **Strict Guidelines**: No bloated external heavyweight libraries; prefer native Web APIs (Intl, Canvas, Web Audio).

## Step-by-Step Execution Plan
1. **State & Architecture Design**: Define clean reactive props interface and minimal single source of truth state.
2. **Component Implementation**:
   - Structured JSX with semantic HTML5 elements (\`<main>\`, \`<section>\`, \`<article>\`, \`<button>\`).
   - Clean accessibility hooks (\`useFocusTrap\`, \`useReducedMotion\`, \`aria-live\`).
3. **Interactive Polish**: Subtle micro-interactions, spring physics or smooth transitions respecting \`prefers-reduced-motion\`.
4. **Error Boundaries & Fallbacks**: Graceful degradation when data is empty, loading, or network is interrupted.

## Deliverable Specifications
- Self-contained, copy-pasteable production-ready component code with zero missing imports.
- TypeScript interfaces or PropTypes defining all configuration options.
- 3 representative test cases (Happy Path, Empty State, Large Dataset stress test).`;

      suggestions = [
        'Specify whether state should be local (useState), URL-synced (search params), or context-driven.',
        'Mention mobile viewport requirements: sheet drawer on < 640px vs floating modal on desktop.',
        'Ask for keyboard shortcut bindings (e.g. Escape to dismiss, Arrow keys for cell navigation).',
        'Specify whether light/dark mode theme switches should be automatic via CSS class or system preference.'
      ];
      break;
    }

    case 'ai': {
      roleTitle = 'Lead Multi-Agent Systems Engineer & LLM Orchestrator';
      const cleanTask = cleanInput.replace(/^(build|create|make|write|generate)\s+/i, '');
      shortCommand = `antigravity run --task "${cleanTask.slice(0, 48)}" --agent-loop --verify-step --max-retries 3`;
      
      metaPrompt = `## Role & Persona
You are a Lead AI Architect and Multi-Agent Orchestration Specialist proficient with Google Antigravity SDK, Claude Code loops, and Model Context Protocol (MCP).

## Objective
Design and implement an autonomous, self-healing agentic pipeline for:
"${cleanInput}"

## System Constraints & Guardrails
- **Deterministic Execution**: Zero unchecked hallucinations; each agent step must produce structured, validated tool calls.
- **Self-Healing Loop**: If a tool or execution step errors, the agent must inspect stderr, formulate a targeted patch, and re-verify without looping infinitely.
- **Context Hygiene**: Prune conversation context after each milestone to preserve token throughput and avoid needle-in-haystack degradation.
- **Telemetry & Safety**: Maintain structured execution traces with timestamps, input tokens, output tokens, and human-in-the-loop escalation triggers.

## Orchestration DAG (Directed Acyclic Graph)
1. **Planner Agent**: Decomposes goal into atomic sub-tasks with unambiguous completion criteria.
2. **Worker Agents**: Specialized subagents equipped with scoped tools (read_file, edit_file, run_command).
3. **Verifier / QA Agent**: Adversarial tester that validates correctness against synthetic stress tests before signing off.
4. **Synthesizer**: Compiles artifacts, release changelog, and handoff documentation.

## Expected Deliverables
- Declarative JSON/YAML agent workflow manifest.
- Robust controller loop in TypeScript/Node or Python with exponential backoff retry.
- Explicit schema contracts for all MCP tool declarations.`;

      suggestions = [
        'Define clear stop conditions (e.g. max 5 iterations, execution cost cap, human approval for file deletion).',
        'Specify which tools the agents have access to (e.g. filesystem read/write, bash CLI, web search, MCP server).',
        'Request an adversarial test suite to verify how the agent recovers from broken code or invalid inputs.',
        'Set inference temperature to 0.0 - 0.2 for strict code/schema generation, and 0.7 for creative exploration.'
      ];
      break;
    }

    case 'mis': {
      roleTitle = 'Senior MIS Systems & Business Intelligence Lead';
      const cleanTask = cleanInput.replace(/^(build|create|make|write|generate)\s+/i, '');
      shortCommand = `excel-pipeline --input ./data/*.csv --clean --transform mis_rules.json --export executive_kpi.xlsx`;

      metaPrompt = `## Role & Persona
You are a Senior MIS Operations Lead and Business Intelligence Architect with deep expertise in enterprise data pipelines, government portal analytics (DAY-NULM, Skill India), and Power Query/VBA automation.

## Objective
Architect an automated, zero-error data transformation pipeline for:
"${cleanInput}"

## Operational Standards & Data Rules
- **Volume & Scale**: Capable of processing 50,000+ rows across multi-branch or multi-district datasets without Excel freezing.
- **Data Hygiene**: Automatic deduplication (Aadhaar/PAN/Registration IDs), null-value sanitization, date normalization (DD/MM/YYYY).
- **Executive Telemetry**: Drill-down KPI metrics (Target vs Achieved %, Variance, Month-over-Month run rates).
- **No-Break Architecture**: Automated error-handling so missing columns or trailing whitespace do not abort execution.

## Pipeline Methodology
1. **Ingestion & Profiling**: Parse raw CSV/XLSX extracts; log row counts, null occurrences, and schema anomalies.
2. **Data Transformation (Power Query M / Python)**:
   - Trim whitespace, cast types strictly, remove duplicates on primary key.
   - Compute calculated columns: Age brackets, Completion %, Fiscal Quarters.
3. **Automated Reconciliation**: Cross-verify summary totals with source registers to ensure zero record drop.
4. **Presentation Layer**: Dynamic Power BI / Excel dashboard with KPI summary cards, trend sparklines, and slicers.

## Deliverables
- Clean Power Query (M-Code) or Python script with step-by-step documentation.
- Ready-to-paste Excel VBA macro code with progress bar update.
- KPI definitions table and data dictionary.`;

      suggestions = [
        'Specify source file format: single workbook, folder of varying CSVs, or web portal download.',
        'List key dimensions required: Date (Month/Year), Geography (District/State), Category, Status.',
        'Mention target audience for the output: Operational field staff vs Executive C-Suite summary.',
        'Request automated email dispatch or PDF scorecard generation upon completion.'
      ];
      break;
    }

    default: {
      roleTitle = 'Senior Solutions Architect & Technical Consultant';
      const cleanTask = cleanInput.replace(/^(build|create|make|write|generate)\s+/i, '');
      shortCommand = `npx task-runner --goal "${cleanTask.slice(0, 48)}" --optimize --trace`;

      metaPrompt = `## Role & Persona
You are a Senior Solutions Architect and Technical Consultant renowned for translating abstract concepts into structured, bulletproof execution blueprints.

## Objective
Provide an end-to-end, production-ready solution for:
"${cleanInput}"

## Guiding Principles & Requirements
- **Simplicity First**: Deliver the most maintainable, lightweight architecture that solves the problem completely.
- **Robustness**: Anticipate edge cases, failure points, and data boundaries.
- **Actionable Steps**: Break implementation into logical phases with clear verification checkpoints.
- **Zero Ambiguity**: Use concrete examples, precise terminology, and complete code snippets rather than placeholders.

## Execution Blueprint
1. **Requirements Deconstruction**: Key functional needs, constraints, and success criteria.
2. **Core Implementation**: Production-grade code/workflow with complete syntax and zero missing components.
3. **Verification & Testing**: Concrete test scenarios covering both happy paths and edge failures.
4. **Optimization Levers**: Suggestions for future scaling, speed enhancements, and maintenance.`;

      suggestions = [
        'Add specific constraints on execution environment (e.g. Windows Powershell, Docker, Browser runtime).',
        'State desired coding language, framework version, and dependency preferences.',
        'Provide 1-2 examples of ideal input and expected output (Few-Shot prompting).',
        'Ask the model to explain architectural trade-offs between speed, complexity, and maintainability.'
      ];
      break;
    }
  }

  const summaryText = `⚡ **Engineered Prompt & Executable Command Ready!**\n\nI analyzed your task **"${cleanInput}"** and engineered a dual-card specification:\n\n• **Command**: Concise, ready-to-execute single line CLI command.\n• **Meta-Prompt**: Comprehensive structured prompt with Persona, Constraints, and Step-by-Step methodology.\n• **Engineering Suggestions**: 4 specific levers to optimize the prompt further.\n\n*Review the cards below and use the 1-click copy buttons:*`;

  return {
    isStudioGuide: false,
    task: cleanInput,
    title: `⚡ Meta-Prompt: ${cleanInput.slice(0, 42)}${cleanInput.length > 42 ? '...' : ''}`,
    domain,
    roleTitle,
    shortCommand,
    metaPrompt,
    suggestions,
    summaryText,
    templates: META_PROMPT_TEMPLATES
  };
}

export default {
  META_PROMPT_TEMPLATES,
  generateMetaPrompt
};
