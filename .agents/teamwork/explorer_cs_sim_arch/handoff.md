# Handoff Report — explorer_cs_sim_arch

**Milestone**: Interactive Live Telemetry Simulation Widgets & Visual System Architecture Blueprints for all 9 Project Case Studies  
**Author**: `explorer_cs_sim_arch` (Explorer / Synthesizer)  
**Date**: 2026-10-20  
**Target Recipient**: `e8f40eea-0ae9-4a99-8c5a-d7a6fdea04db` (Parent Orchestrator) & Implementation Team

---

## 1. Observation

### 1.1 Existing Simulator Components in `ProjectsSection.jsx`
Direct examination of `src/components/ProjectsSection.jsx` (lines 168–287, 288–622, 624–772, 774–1174, 1308–1585) revealed two established simulation archetypes in the current codebase:

1. **Document / Ledger Telemetry Run Engine** (Used in Projects 01, 03, 05, 07, 09):
   - **State Hooks**:
     - Project 01: `const [isAuditing, setIsAuditing] = useState(false); const [scanLatency, setScanLatency] = useState(210);` (line 169–170).
     - Project 03: `const [isRegistryAuditing, setIsRegistryAuditing] = useState(false); const [registryLatency, setRegistryLatency] = useState(165);` (line 176–177).
     - Project 05: `const [isWorkflowAuditing, setIsWorkflowAuditing] = useState(false); const [workflowLatency, setWorkflowLatency] = useState(145);` (line 180–181).
     - Project 07: `const [isGeneratingApp, setIsGeneratingApp] = useState(false); const [generationLatency, setGenerationLatency] = useState(140);` (line 186–187).
     - Project 09: `const [isSynthesizing, setIsSynthesizing] = useState(false); const [streamLatency, setStreamLatency] = useState(85);` (line 194–195).
   - **Trigger Pattern**:
     - Action button with `RefreshCw` icon (`${isAuditing ? 'animate-spin' : ''}`).
     - Calls `soundFX.playFocusBeep()` on click.
     - Calls `announce('Running ... simulation', 'polite')` via `useAnnounce()`.
     - Simulates network/computation duration via `setTimeout(..., 650)`.
     - Injects randomized jitter: e.g., `setScanLatency(Math.floor(Math.random() * 40) + 180)`.
     - On completion: resets running boolean, triggers `soundFX.playSparkle()`, and announces completion status.
   - **DOM Structure**:
     - Mockup window bar with colored window control dots (`#FF4D6D`, `amber-400`, `emerald-500`) and monospace document name (e.g., `gstr2b-reconciliation-fy2324.pdf`).
     - Document preview text card with highlighted statutory clauses or stage milestones.
     - Floating dark tooltip card (`bg-[#18181B] text-white`).
     - Monospace live telemetry footer (`AUDIT ENGINE: ... | RECONCILED SPEED: 180ms`).

2. **Circular State Machine Diagram** (Used in Projects 02, 06, 08):
   - **State Hooks**:
     - Project 02: `const [paymentState, setPaymentState] = useState('processing');` (line 173, `'processing' | 'success' | 'failed'`).
     - Project 06: `const [governanceState, setGovernanceState] = useState('governed');` (line 184, `'governed' | 'optimized' | 'auditing'`).
     - Project 08: `const [agentState, setAgentState] = useState('executing');` (line 191, `'planning' | 'executing' | 'verified'`).
   - **Trigger & Transition Pattern**:
     - Interactive circular node graph with a central dark hub node (96px diameter, pulsing/spinning `RefreshCw`) and branching nodes connected via CSS gradient lines (`h-0.5 bg-gradient-to-r`).
     - Clicking any node calls cycle handler (e.g., `cyclePaymentState(nextState)`).
     - Success/verified node transitions trigger `soundFX.playSparkle()`; other transitions trigger `soundFX.playFocusBeep()`.
     - Screen reader announcement: `announce(\`... state changed to \${nextState}\`, 'polite')`.

3. **Missing Telemetry in Project 04 (`proj-smart-card`)**:
   - `COMPANION_PROJECTS[1]` in `ProjectsSection.jsx` lines 63–78 defines "Multi-District Smart Card Operations & Enrollment Engine".
   - In lines 1599–1693, Project 04 is rendered only as a static summary card inside a 2-column grid without any interactive simulation widget or visual architecture diagram.

### 1.2 Web Audio Synthesizer in `src/utils/audio.js`
Inspection of `src/utils/audio.js` (lines 1–777) verified the following existing zero-latency Web Audio methods:
- `soundFX.playFocusBeep()` / `playLaserFocus()`: Fast frequency sweep (1200Hz -> 800Hz), ideal for simulation start / scan trigger.
- `soundFX.playSparkle()` / `playCosmicSparkle()`: Harmonic pentatonic chime, ideal for 100% reconciliation / compilation complete.
- `soundFX.playHapticClick()`: 40Hz micro-click impulse, ideal for node selection and option toggling.
- `soundFX.playTerminalSuccess()`: Dual ascending major chime (523Hz -> 659Hz).
- `soundFX.playTerminalError()`: Sawtooth dissonance (180Hz / 170Hz), ideal for variance / test regression simulation.
- `soundFX.playCrystalChime()`: Pure sine bell tone (2093Hz).
- `soundFX.playSnapSound()` & `playDropSound()`: Crisp mechanical tactile audio.
- Master controls: `soundFX.isEnabled()`, respects master volume and user mute state.

### 1.3 Accessibility Announcer in `src/context/AnnouncerContext.jsx`
- `const { announce } = useAnnounce();` provides live ARIA announcements via `announce(message, 'polite' | 'assertive')`.
- Global custom event fallback: `window.dispatchEvent(new CustomEvent('portfolio:announce', { detail: { message, priority } }))`.

### 1.4 Theming & Styling Constraints
- Obsidian Dark (`.dark`, `bg-[#100C1A]`, `border-[#2D2340]`, text `#F5F2F8`).
- Linen Light (`bg-[#FAF8F5]`, `border-[#E4DFD5]`, text `#18181B`).
- High-Contrast Mode (`html.high-contrast`, `src/styles/high-contrast.css`): Requires solid 2px borders, zero low-contrast translucent gradients, ≥ 7:1 contrast ratio for text and ≥ 4.5:1 for UI borders/icons.
- Simple Mode (`body.simple-mode`, `src/context/SimpleModeContext.jsx`): Flat presentation, no heavy canvas animations, standard accessible DOM elements.

---

## 2. Logic Chain

1. **Premise 1**: The user request (`ORIGINAL_REQUEST.md` header `## 2026-10-20T21:51:13Z`, Requirement R3) specifies:
   > "Inside each drawer: Embed an interactive live simulation widget (e.g. 180ms reconciliation runner, prompt synthesis visualizer) with tactile feedback. Render clear visual system architecture flowcharts for each project."
2. **Premise 2**: Projects 01, 02, 03, 05, 06, 07, 08, 09 have prototype simulators embedded inside in-page cards in `ProjectsSection.jsx`, but they are tied to in-page section state and do not provide deep drawer-level telemetry or comprehensive architecture diagrams. Project 04 has no simulator at all.
3. **Premise 3**: Duplicating 9 separate custom monolithic simulator components inside `CaseStudyDrawer` would cause massive code bloat, high maintenance overhead, and brittle styling.
4. **Premise 4**: The 9 projects naturally divide into two primary simulation archetypes:
   - **Type A: Pipeline / Ledger Telemetry Stream Engine** (Projects 01, 03, 04, 05, 07, 09).
   - **Type B: Multi-Node State Machine & Self-Healing Loop** (Projects 02, 06, 08).
5. **Premise 5**: System architecture diagrams for all 9 projects require consistent 4-tier structural layers (Tier 1: Ingestion/Client -> Tier 2: Gateway/Controller -> Tier 3: Core Engine/Ledger -> Tier 4: Output/Compliance/UI) rendered with responsive SVG/CSS flex/grid layouts.
6. **Inference**: Creating two modular, reusable components (`CaseStudySimulator.jsx` and `CaseStudyArchitecture.jsx`) configured by structured declarative schemas in `src/data/caseStudiesData.js` will deliver production-ready, accessible, 100% tested simulations and flowcharts across all 9 projects while strictly adhering to WCAG AAA contrast, tactile Web Audio, and zero-layout-shift principles.

---

## 3. Caveats

1. **Read-Only Exploration Constraint**: As `explorer_cs_sim_arch`, no direct edits to `src/` have been made. Concrete code blueprints and data contracts are documented in this report for implementation agents.
2. **Simulated vs. Live External APIs**: All telemetric latencies (e.g., 185ms GSTR-2B reconciliation, 142ms cryptographic chip personalization, 85ms streaming LLM token latency) are simulated in-browser via timed asynchronous state pipelines. No external network requests to actual government or commercial APIs are made, ensuring 100% offline reliability.
3. **Audio Autoplay Policy**: Web Audio API requires a user gesture before playing sound. Because users open the case study drawer via a click or keyboard press, `AudioContext` is cleanly initialized and active without browser autoplay blocks.

---

## 4. Conclusion & Detailed Design Specifications

### 4.1 Concrete Interactive Simulation Design for All 9 Projects

Each simulation widget incorporates:
- **Interactive Controls**: Run trigger, option toggles (e.g., "Simulate Variance / Anomaly"), and reset actions.
- **Calibrated Latency**: Domain-accurate execution timers (e.g., 185ms, 142ms, 85ms).
- **Tactile Sound FX**: Integrated with `src/utils/audio.js`.
- **Screen Reader Announcements**: Integrated with `AnnouncerContext.jsx`.
- **Telemetry HUD**: Live latency counter, records processed, status badges, and animated data feeds.

---

#### Project 01: GST & Income Tax Compliance & Verification Engine (`proj-gst-tax`)
- **Track**: Accountant & Tax (Financial Track)
- **Simulation Archetype**: Pipeline Telemetry Runner — *Statutory ITC 2B Cross-Match & Audit Engine*
- **Starting State**:
  - Unreconciled ERP Inward Invoices: 1,420 records totaling ₹2,48,50,000.
  - GSTR-2B Portal Feed: Loaded (JSON payload cached).
  - Status: `AWAITING AUDIT RUN`.
  - Latency: `210ms (Initial Estimate)`.
- **Interactive Controls**:
  - Primary Button: `[⚡ Run Statutory ITC Audit]` (Icon: `RefreshCw`).
  - Toggle Switch: `[Include 180-Day Rule 37 Check]` (Checked by default).
  - Simulation Toggle: `[Inject Vendor Mismatch (1 Invoice)]` (Allows testing variance detection).
- **Telemetry Execution Pipeline (Total Time: ~200ms)**:
  1. *Step 1 (0ms)*: `soundFX.playLaserFocus()`; announce: *"Starting statutory ITC 2B reconciliation audit..."*. Step 1 lights up: `ERP Ledger Ingestion (1,420 Invoices)`.
  2. *Step 2 (75ms)*: Step 2 lights up: `GSTR-2B GSTIN & Taxable Value Cross-Matching`.
  3. *Step 3 (140ms)*: Step 3 lights up: `Section 16(2) Compliance & Rule 37 Reverse Charge Check`.
  4. *Step 4 (185ms)*: Finalize. If clean: Latency updates to `185ms`, Status: `100% RECONCILED (₹0 Notice Risk)`. `soundFX.playSparkle()`; announce: *"Statutory ITC reconciliation complete. 1,420 invoices reconciled in 185ms. Status: 100% matched."*.
  5. *If Mismatch Injected*: Status: `FLAGGED: 1 Variance Detected (₹14,500 mismatch on GSTIN 20AAACH1234F1Z5)`. `soundFX.playTerminalError()`.
- **Telemetry HUD Indicators**:
  - `Scanned Invoices`: 1,420
  - `Reconciled Volume`: ₹2.48 Cr
  - `Statutory Compliance`: 100% (Section 16(2) verified)
  - `Audit Latency`: Dynamic (180ms – 215ms)

---

#### Project 02: Tally Financial Accounting & Inventory Management (`proj-tally-accounting`)
- **Track**: Accountant & Tax (Financial Track)
- **Simulation Archetype**: Multi-Node State Machine — *Double-Entry Ledger Balancing & BRS Engine*
- **Starting State**:
  - Active Node: `POSTING` (central dark hub).
  - Debit/Credit Delta: ₹0.00 (Balanced).
  - Active Ledger: `Sundry Debtors vs Sales Ledger`.
- **Interactive Controls**:
  - Node 1: `[POSTING]` (Simulate Journal Voucher Entry).
  - Node 2: `[RECONCILED]` (Simulate BRS Bank Matching & Zero Variance).
  - Node 3: `[VARIANCE SIMULATION]` (Simulate ₹4,250 Bank Fee Timing Difference).
  - Action Button: `[Post Multi-Godown Transfer Voucher]`.
- **Telemetry Execution Pipeline**:
  - *Click Node 1 (`POSTING`)*:
    - Central hub pulses with spinning `RefreshCw`.
    - `soundFX.playKeyClick()`; announce: *"Journal voucher posting to General Ledger: Debits equal Credits."*.
    - Telemetry displays: `Voucher #JV-2024-8842 Posted • Ledger Integrity: 100%`.
  - *Click Node 2 (`RECONCILED`)*:
    - Node turns emerald green with checkmark badge.
    - `soundFX.playSparkle()`; announce: *"Bank Reconciliation Statement balanced. Zero unreconciled entries."*.
    - Telemetry displays: `Bank Statement vs Tally Book: ₹12,45,800.00 (Variance: ₹0.00)`.
  - *Click Node 3 (`VARIANCE`)*:
    - Node turns rose-red with alert icon.
    - `soundFX.playTerminalError()`; announce: *"Unreconciled bank charge detected: ₹4,250. Auto-audit recommendation generated."*.
    - Telemetry displays: `Variance Detected: ₹4,250.00 (Bank Charges pending debit note)`.
- **Telemetry HUD Indicators**:
  - `Annual Volume`: ₹10Cr+
  - `Ledger Accuracy`: 100% (Double-entry balanced)
  - `Active Godowns`: 3 Warehouses (Main, Palamau Hub, Ranchi Transit)
  - `Unreconciled Delta`: ₹0.00

---

#### Project 03: DAY-NULM Skill India MIS Reporting Portal (`proj-day-nulm`)
- **Track**: MIS & Analytics (Data & Operations Track)
- **Simulation Archetype**: Pipeline Telemetry Runner — *Government Candidate Registry & SDMS Portal Sync*
- **Starting State**:
  - Selected Batch: `JH-PAL-2023-B04 (ADCA / Computer Operations)`.
  - Enrolled Candidates: 250 Trainees.
  - AEBAS Biometric Attendance: 88.4% Average.
  - Status: `STANDBY FOR PORTAL SYNC`.
- **Interactive Controls**:
  - Batch Selector Dropdown: `[JH-PAL-2023-B04 (250 Trainees)]` / `[JH-GAR-2023-B02 (180 Trainees)]`.
  - Primary Button: `[🚀 Run Biometric Registry Sync]` (Icon: `RefreshCw`).
  - Checkbox: `[Validate Aadhaar Seed Encryption]`.
- **Telemetry Execution Pipeline (Total Time: ~165ms)**:
  1. *Step 1 (0ms)*: `soundFX.playLaserFocus()`; announce: *"Syncing candidate registry with Skill India SDMS portal..."*. Step 1 lights up: `AEBAS Biometric Attendance Log Ingestion (250 Trainees)`.
  2. *Step 2 (60ms)*: Step 2 lights up: `Aadhaar Vault Validation & De-duplication`.
  3. *Step 3 (120ms)*: Step 3 lights up: `Jharkhand DUDA / SDMS API Payload Encrypted & Transmitted`.
  4. *Step 4 (165ms)*: Finalize. Status badge: `100% SYNCHRONIZED`. Latency: `165ms`. `soundFX.playSparkle()`; announce: *"DAY-NULM candidate registry synchronized. 250 candidates verified with 99.8% reporting accuracy."*.
- **Telemetry HUD Indicators**:
  - `Active Trainees`: 2,500+ across 50 batches
  - `Biometric Validation`: 99.8% Match Rate
  - `Portal Response`: HTTP 200 OK (DUDA Gateway)
  - `Sync Latency`: Dynamic (150ms – 175ms)

---

#### Project 04: Multi-District Smart Card Operations & Enrollment Engine (`proj-smart-card`)
- **Track**: MIS & Analytics (Data & Operations Track)
- **Simulation Archetype**: Pipeline Telemetry Runner — *Multi-District Field Enrollment & Cryptographic Card Chip Provisioning*
- **Starting State**:
  - Selected District: `Palamau (HQ), Jharkhand`.
  - Cards in Dispatch Queue: 1,250 Citizen Cards.
  - Chip Cryptographic Spec: ISO 7816 / PKI 2048-bit.
  - Status: `READY TO PROVISION`.
- **Interactive Controls**:
  - District Switcher Pills: `[Palamau, JH]` | `[Garhwa, JH]` | `[Gaya, BR]` | `[Aurangabad, BR]`.
  - Quantity Slider: `100 to 2,500 cards (Default: 1,250)`.
  - Primary Action Button: `[💳 Simulate Chip Personalization & Sync]` (Icon: `RefreshCw`).
- **Telemetry Execution Pipeline (Total Time: ~142ms)**:
  1. *Step 1 (0ms)*: `soundFX.playLaserFocus()`; announce: *"Initiating smart card chip personalization for selected district..."*. Step 1 lights up: `Biometric Hash Verification & Duplicate Scrub`.
  2. *Step 2 (50ms)*: Step 2 lights up: `Cryptographic PKI Personalization (ISO 7816 Chip Burn)`.
  3. *Step 3 (100ms)*: Step 3 lights up: `District Logistics Speed Post Manifest Generated`.
  4. *Step 4 (142ms)*: Finalize. Status: `PROVISIONED & DISPATCHED`. Latency: `142ms`. `soundFX.playTerminalSuccess()`; announce: *"Smart card batch provisioned. 1,250 cards verified for Palamau District. Zero cryptographic errors."*.
- **Telemetry HUD Indicators**:
  - `Districts Covered`: 4 (Palamau, Garhwa, Gaya, Aurangabad)
  - `Cards Issued`: 50,000+
  - `Chip Personalization Throughput`: 88 Cards / Min
  - `Field Sync Speed`: 142ms

---

#### Project 05: Executive Power BI Fiscal Intelligence & Reconciliation Engine (`proj-enterprise-transformation`)
- **Track**: Corporate Controller & BI (Other ✨ AI Track)
- **Simulation Archetype**: Pipeline Telemetry Runner — *Multi-Entity ERP Ingestion & Fiscal Variance Radar*
- **Starting State**:
  - Monitored Entities: 6 Consolidated Operating Companies.
  - Aggregated Ledger Flow: ₹25.40 Cr.
  - Status: `IDLE / LISTENING TO DATA BUS`.
  - Reporting Latency: `145ms`.
- **Interactive Controls**:
  - Entity Filter: `[All 6 Entities (Consolidated)]` / `[Entity 01: Retail Trading]` / `[Entity 02: Distribution]`.
  - Metric View Toggle: `[EBITDA & Margins]` | `[Inter-Company Debtor Balances]`.
  - Action Button: `[📊 Refresh Executive Fiscal Matrix]` (Icon: `RefreshCw`).
- **Telemetry Execution Pipeline (Total Time: ~135ms)**:
  1. *Step 1 (0ms)*: `soundFX.playLaserFocus()`; announce: *"Ingesting multi-company ERP ledgers into Power BI semantic model..."*. Step 1 lights up: `Tally Prime & Banking API Ledger Polling`.
  2. *Step 2 (55ms)*: Step 2 lights up: `DAX Model Calculation (EBITDA, Margin, Working Capital Days)`.
  3. *Step 3 (105ms)*: Step 3 lights up: `Inter-Company Balance Elimination & Variance Radar`.
  4. *Step 4 (135ms)*: Finalize. Status: `EXECUTIVE MATRIX SYNCHRONIZED`. Latency: `135ms`. `soundFX.playCrystalChime()`; announce: *"Executive fiscal matrix refreshed. Consolidated 6 entities across ₹25.4 Cr with 99.9% reconciliation accuracy."*.
- **Telemetry HUD Indicators**:
  - `Consolidated Ledgers`: ₹25Cr+ across 6 entities
  - `Reconciliation Rate`: 99.9%
  - `Reporting Latency Delta`: -80% faster than manual audit
  - `Inter-Company Elimination`: ₹0.00 Variance

---

#### Project 06: Corporate Financial Controls & Internal Audit Governance (`proj-business-advisory`)
- **Track**: Corporate Controller & BI (Other ✨ AI Track)
- **Simulation Archetype**: Multi-Node State Machine — *Internal Financial Controls (IFC) Governance Engine*
- **Starting State**:
  - Active Governance Node: `CONTROL` (Active Statutory Monitoring).
  - Statutory Adherence: 100%.
  - Tax Variance Prevented: ₹45,20,000.
- **Interactive Controls**:
  - Node 1: `[CONTROL]` (Segregation of Duties & Withholding Tax Gatekeeper).
  - Node 2: `[OPTIMIZED (₹45L+)]` (Working Capital Modeling & Tax Leakage Prevention).
  - Node 3: `[AUDIT READY (100%)]` (Zero-Notice Statutory Audit Dossier).
  - Action Button: `[🛡️ Run Statutory Compliance Vulnerability Scan]`.
- **Telemetry Execution Pipeline**:
  - *Click Node 1 (`CONTROL`)*:
    - `soundFX.playHapticClick()`; announce: *"Corporate control pipeline active: Withholding tax 194C/194J gatekeeper verified."*.
    - Telemetry displays: `Withholding Tax Governance: 100% Compliant • Zero Late Deductions`.
  - *Click Node 2 (`OPTIMIZED`)*:
    - Node glows pink/violet.
    - `soundFX.playSparkle()`; announce: *"Working capital tax optimization active. ₹45 Lakhs tax leakage prevented through automated 2B matching."*.
    - Telemetry displays: `Tax Leakage Prevented: ₹45,20,000 • Working Capital Velocity: +28%`.
  - *Click Node 3 (`AUDIT READY`)*:
    - Node lights up emerald green.
    - `soundFX.playLaserFocus()`; announce: *"Audit readiness status: 100% compliant. Immutable audit trail compiled for tax assessment."*.
    - Telemetry displays: `Statutory Board Packet: 100% Audit Ready • Notice Risk: Zero`.
- **Telemetry HUD Indicators**:
  - `Statutory Adherence`: 100%
  - `Leakage Prevented`: ₹45L+
  - `Audit Preparedness`: 100%
  - `Penalty Assessment`: ₹0 (Zero notice)

---

#### Project 07: AI Prompt-to-Fullstack SaaS Generator (`proj-ai-saas-generator`)
- **Track**: Vibe Coding & AI Software Engineer (Vibe Coding Track)
- **Simulation Archetype**: Pipeline Telemetry Runner — *Autonomous Fullstack App Scaffolding Engine*
- **Starting State**:
  - Selected Spec Prompt: `"Multi-tenant B2B Invoice & Client Portal with Stripe Billing & Supabase RLS"`.
  - Target Framework: Next.js 14 (App Router) + Tailwind CSS + Supabase.
  - Status: `STANDBY FOR CODE GENERATION`.
- **Interactive Controls**:
  - Prompt Quick-Selector Chips:
    - `[B2B Invoicing SaaS]`
    - `[AI Document RAG Portal]`
    - `[Multi-Vendor E-Commerce]`
  - Primary Button: `[⚡ Synthesize Fullstack App]` (Icon: `RefreshCw`).
  - Checkbox: `[Include Oxlint & Vitest Guardrails]`.
- **Telemetry Execution Pipeline (Total Time: ~140ms simulated compilation)**:
  1. *Step 1 (0ms)*: `soundFX.playFocusBeep()`; announce: *"Decomposing specification prompt into architectural AST..."*. Step 1 lights up: `Natural Language Prompt Parsing (Claude 3.5 Sonnet)`.
  2. *Step 2 (45ms)*: Step 2 lights up: `PostgreSQL Schema & Row-Level Security (RLS) DDL Generated`.
  3. *Step 3 (95ms)*: Step 3 lights up: `Next.js 14 Server Actions, Tailwind UI & Stripe Routes Assembled`.
  4. *Step 4 (140ms)*: Finalize. Status: `100% COMPILED & DEPLOYED`. Latency: `140ms`. `soundFX.playTerminalSuccess()`; `soundFX.playSparkle()`; announce: *"AI SaaS application synthesized. 18 files generated with 100% test pass rate in 140ms."*.
- **Telemetry HUD Indicators**:
  - `Files Scaffolded`: 18 production files (2,450 LOC)
  - `Scaffolding Velocity`: < 3 Minutes End-to-End (10x faster)
  - `Test Pass Rate`: 99.4% (Oxlint 0 errors, Vitest 100% green)
  - `Deployment Target`: Vercel Edge + Supabase DB

---

#### Project 08: Autonomous Multi-Agent Workflow Engine (`proj-agent-workflow-engine`)
- **Track**: Vibe Coding & AI Software Engineer (Vibe Coding Track)
- **Simulation Archetype**: Multi-Node State Machine & Self-Healing Loop — *Decentralized Agentic DAG Orchestrator*
- **Starting State**:
  - Active Node: `CODER` (subagent code generation).
  - Coordinated Agents: 4 Specialized LLM Subagents (Planner, Coder, Evaluator, Healer).
  - Status: `ORCHESTRATING SUBAGENTS`.
- **Interactive Controls**:
  - Node 1: `[PLANNER (DAG)]` (Task Decomposition & Dependency Graph).
  - Node 2: `[CODER]` (Parallel Isolated Worktree Execution).
  - Node 3: `[VERIFIED (100%)]` (Oxlint / Vitest Quality Gate).
  - Action Button: `[🔧 Trigger Self-Healing Recovery Loop]`.
- **Telemetry Execution Pipeline**:
  - *Click Node 1 (`PLANNER`)*:
    - `soundFX.playLaserFocus()`; announce: *"Planner subagent decomposed task into 5 parallel execution sub-tasks."*.
    - Telemetry displays: `DAG Tasks Queued: 5 • Dependency Graph: Clean Directed Acyclic Graph`.
  - *Click Node 2 (`CODER`)*:
    - Central hub spins with emerald glow.
    - `soundFX.playKeyClick()`; announce: *"Coder subagents executing parallel diffs in isolated worktrees."*.
    - Telemetry displays: `Parallel Subagents: 4 Active • Tool Calls: 18 tool executions`.
  - *Click Button (`Trigger Self-Healing Loop`)*:
    - *Simulated fault*: Vitest detects regression in unit test suite. `soundFX.playTerminalError()`.
    - *Healer subagent activates*: Inspects traceback, edits AST, re-runs test.
    - *Recovery*: All tests pass green! `soundFX.playTerminalSuccess()`; `soundFX.playSparkle()`; announce: *"Self-healing loop triggered: Agent repaired regression in 1.1s. All 42 tests passing."*.
    - Telemetry displays: `Self-Healing Rate: 94.2% • Recovery Duration: 1.1s • Status: GREEN`.
  - *Click Node 3 (`VERIFIED`)*:
    - Node glows solid emerald.
    - `soundFX.playSparkle()`; announce: *"Autonomous task verified and gated for pull request merge."*.
- **Telemetry HUD Indicators**:
  - `Autonomous Tasks`: 100+ executed
  - `Self-Healing Success`: 94.2%
  - `Engineering Hours Saved`: 350+ Dev Hours
  - `Loop Latency`: < 1.2s

---

#### Project 09: Real-Time AI Document & Code Synthesizer (`proj-doc-code-synthesizer`)
- **Track**: Vibe Coding & AI Software Engineer (Vibe Coding Track)
- **Simulation Archetype**: Pipeline Telemetry Runner — *Streaming LLM Token Parsing & Generative UI Canvas*
- **Starting State**:
  - Document Source: `FY2023-24 Comprehensive Tax & Financial Statement.pdf (50 Pages)`.
  - Client-Side Vector Cache: 50 Chunks indexed.
  - Streaming Latency: `85ms`.
  - Status: `STREAMING ENGINE READY`.
- **Interactive Controls**:
  - Document Selector: `[Financial Statement PDF]` | `[GST Purchase Register CSV]` | `[Corporate Bylaws DOCX]`.
  - Output Mode Toggle: `[KaTeX Math & Charts]` | `[React 19 Generative Components]`.
  - Action Button: `[⚡ Start Streaming Synthesis]` (Icon: `RefreshCw`).
- **Telemetry Execution Pipeline (Total Time: ~85ms token latency)**:
  1. *Step 1 (0ms)*: `soundFX.playLaserFocus()`; announce: *"Starting streaming AI document synthesis..."*. Step 1 lights up: `Client-Side Cosine Vector Search (12ms similarity lookup)`.
  2. *Step 2 (30ms)*: Step 2 lights up: `Streaming SSE Token Pipe Active (50 pages/sec throughput)`.
  3. *Step 3 (60ms)*: Step 3 lights up: `Generative UI Assembly: KaTeX Formulas & Telemetry Graphs Rendered`.
  4. *Step 4 (85ms)*: Finalize. Status: `STREAMING COMPLETE`. Latency: `85ms`. `soundFX.playCrystalChime()`; announce: *"Streaming synthesis complete. 50 document pages vectorized and rendered into reactive components in 85ms."*.
- **Telemetry HUD Indicators**:
  - `Streaming Latency`: 85ms
  - `Throughput`: 50 Pages / Sec
  - `Vector Precision`: 0.96 Cosine Similarity
  - `Token Efficiency`: +45% (Cached embeddings)

---

### 4.2 Visual System Architecture Blueprints for All 9 Projects

Each architecture blueprint employs a standardized 4-tier pipeline designed for responsive SVG / CSS rendering. It features:
- **Tier 1: Client & Data Ingestion**
- **Tier 2: Gateway & Validation Controller**
- **Tier 3: Core Processing & Ledger / KMS / AI Engine**
- **Tier 4: Output, Regulatory Filing & Presentation Layer**
- **Responsive Layout**: Horizontal 4-tier flow on desktop (`md:grid-cols-4` or flex row with horizontal SVG arrows); stacked vertical cascade on mobile (`grid-cols-1` with vertical down arrows `↓`).
- **High Contrast Compliance**: Solid 2px borders, WCAG AAA compliant colors, distinct iconography, text contrast ratio ≥ 7:1.

---

#### Architecture 01: GST & Tax Compliance Engine
```
┌─────────────────────┐       ┌──────────────────────┐       ┌───────────────────────┐       ┌──────────────────────┐
│  Tier 1: Ingestion  │  ──>  │  Tier 2: Validation  │  ──>  │  Tier 3: Core Engine  │  ──>  │   Tier 4: Outputs    │
│  • Tally Ledgers    │       │  • GSTR-2B API Match │       │  • Sec 16(2) Rule Set │       │  • Auto GSTR-3B Tax  │
│  • Supplier Invoices│       │  • 26AS/AIS Matcher  │       │  • TDS 194C/J Audit   │       │  • Challan 280/281   │
│  • Bank Feeds (PDF) │       │  • Schema Validator  │       │  • Rule 37 Recapture  │       │  • Audit Trail PDF   │
└─────────────────────┘       └──────────────────────┘       └───────────────────────┘       └──────────────────────┘
```
- **Tier 1 Nodes**:
  - Node 1.1: `Tally Purchase Ledgers` (XML / ODBC feed).
  - Node 1.2: `Vendor Invoices & E-Way Bills` (JSON / PDF parsing).
  - Node 1.3: `Bank Statement Feeds` (CSV / MT940).
- **Tier 2 Nodes**:
  - Node 2.1: `GSTN Portal Gateway` (Direct API GSTR-2B ingestion).
  - Node 2.2: `Form 26AS / AIS / TIS Harmonizer` (Income tax variance detection).
  - Node 2.3: `GSTIN Syntax & Active Status Validator` (Checksum verification).
- **Tier 3 Nodes**:
  - Node 3.1: `Section 16(2) ITC Reconciliation Engine` (Automated invoice-to-portal matching).
  - Node 3.2: `Withholding Tax (TDS) Computation Core` (Sections 194C, 194J, 194Q).
  - Node 3.3: `Rule 37 180-Day Reversal Monitor` (Aged supplier balance tracker).
- **Tier 4 Nodes**:
  - Node 4.1: `GSTR-3B Tax Liability & Offset Formatter` (Auto-balanced cash/credit ledgers).
  - Node 4.2: `Challan 280 / 281 E-Payment Dispatcher` (Online tax clearance).
  - Node 4.3: `Immutable Statutory Audit Trail` (Zero-penalty audit archive).

---

#### Architecture 02: Tally Financial Accounting & Inventory
```
┌─────────────────────┐       ┌──────────────────────┐       ┌───────────────────────┐       ┌──────────────────────┐
│  Tier 1: Sources    │  ──>  │  Tier 2: Double-Entry│  ──>  │   Tier 3: Valuation   │  ──>  │  Tier 4: Statements  │
│  • Sales Vouchers   │       │  • Journal Daemon    │       │  • Multi-Godown FIFO  │       │  • Balance Sheet     │
│  • Purchase Inward  │       │  • Ledger Balancer   │       │  • BRS Auto-Matcher   │       │  • Profit & Loss     │
│  • Cash Disbursements│      │  • Voucher Numbering │       │  • Stock Ageing Matrix│       │  • Trial Balance     │
└─────────────────────┘       └──────────────────────┘       └───────────────────────┘       └──────────────────────┘
```
- **Tier 1 Nodes**: `Sales Vouchers`, `Purchase Inward Notes`, `Cash & Bank Counter Books`.
- **Tier 2 Nodes**: `Journal Posting Daemon`, `Real-Time Ledger Balancer` ($\sum Dr = \sum Cr$), `Voucher Serialization Controller`.
- **Tier 3 Nodes**: `Multi-Godown Stock Valuation Engine` (FIFO / Weighted Average across 3 Godowns), `BRS Bank Statement Auto-Matcher`, `Stock Ageing Analyzer`.
- **Tier 4 Nodes**: `Real-Time Balance Sheet Generator`, `Comprehensive P&L Statement`, `Trial Balance & Ledger Extract Export`.

---

#### Architecture 03: DAY-NULM Skill India MIS Portal
```
┌─────────────────────┐       ┌──────────────────────┐       ┌───────────────────────┐       ┌──────────────────────┐
│  Tier 1: Centers    │  ──>  │  Tier 2: Aggregation │  ──>  │   Tier 3: Database    │  ──>  │  Tier 4: Govt Sync   │
│  • Trainee Terminal │       │  • AEBAS Cleanse     │       │  • Candidate Lifecycle│       │  • Skill India SDMS  │
│  • Biometric Reader │       │  • Aadhaar Hash Check│       │  • Batch Milestone DB │       │  • Jharkhand DUDA    │
│  • Attendance Logs  │       │  • Attendance Thresh │       │  • Assessment Matrix  │       │  • Ministry Reports  │
└─────────────────────┘       └──────────────────────┘       └───────────────────────┘       └──────────────────────┘
```
- **Tier 1 Nodes**: `Trainee Registration Mobile Desk`, `AEBAS Biometric Fingerprint Terminals`, `Daily Classroom Attendance Logs`.
- **Tier 2 Nodes**: `Biometric Scrubbing & Deduplication Engine`, `Aadhaar Vault One-Way Hash Validator`, `80% Attendance Threshold Filter`.
- **Tier 3 Nodes**: `Candidate Lifecycle Store`, `Batch Milestone & Assessment DB`, `Placement & Certification Verification Matrix`.
- **Tier 4 Nodes**: `Skill India SDMS REST Gateway`, `Jharkhand DUDA Administrative Portal Interface`, `Ministry MIS Compliance Dashboard`.

---

#### Architecture 04: Multi-District Smart Card Operations
```
┌─────────────────────┐       ┌──────────────────────┐       ┌───────────────────────┐       ┌──────────────────────┐
│  Tier 1: Field Kits │  ──>  │  Tier 2: Regional Hub│  ──>  │  Tier 3: Central KMS  │  ──>  │ Tier 4: Personalize  │
│  • 4 District Vans  │       │  • Offline Store-Fwd │       │  • PKI 2048-bit Issuer│       │  • ISO 7816 Chip Burn│
│  • Biometric Optical│       │  • SQLite Local Cache│       │  • Citizen De-dup Core│       │  • Thermal Embossing │
│  • Citizen Intake   │       │  • Tamper Detection  │       │  • Master Record Sync │       │  • Speed Post Courier│
└─────────────────────┘       └──────────────────────┘       └───────────────────────┘       └──────────────────────┘
```
- **Tier 1 Nodes**: `Field Enrollment Kits (Palamau, Garhwa, Gaya, Aurangabad)`, `Optical Biometric Scanner`, `Citizen Demographic Intake Form`.
- **Tier 2 Nodes**: `Regional District Data Hub`, `Offline Store-and-Forward SQLite Cache`, `Hardware Tamper Detection Guard`.
- **Tier 3 Nodes**: `State Identity KMS (PKI 2048-bit Key Authority)`, `Citizen Biometric Deduplication Core`, `Master Citizen Registry Sync`.
- **Tier 4 Nodes**: `High-Throughput ISO 7816 Chip Encoder`, `Thermal Embossing & Hologram Stamper`, `Speed Post Barcode & Logistics Dispatcher`.

---

#### Architecture 05: Executive Power BI Fiscal Intelligence
```
┌─────────────────────┐       ┌──────────────────────┐       ┌───────────────────────┐       ┌──────────────────────┐
│  Tier 1: Multi-ERP  │  ──>  │  Tier 2: ETL Fabric  │  ──>  │  Tier 3: Tabular Model│  ──>  │ Tier 4: Executive UI │
│  • 6 Entity Tally   │       │  • Power Query M     │       │  • Star Schema Mart   │       │  • Power BI Service  │
│  • Core Bank APIs   │       │  • Normalizer Pipeline│      │  • DAX Fiscal Metrics │       │  • Executive Tiles   │
│  • GST Portal Feeds │       │  • Inter-Company Elim│       │  • Row-Level Security │       │  • Mobile KPI Radar  │
└─────────────────────┘       └──────────────────────┘       └───────────────────────┘       └──────────────────────┘
```
- **Tier 1 Nodes**: `Multi-Entity Tally Prime Instances (6 Companies)`, `Core Banking Open APIs (Bank Statements)`, `GST Portal Tax Ledgers`.
- **Tier 2 Nodes**: `Power Query Automated ETL Engine`, `Multi-Ledger Standardized Normalizer`, `Inter-Company Transaction Matcher & Eliminator`.
- **Tier 3 Nodes**: `Consolidated Star Schema Data Mart`, `DAX Fiscal Calculation Engine (EBITDA, Margins, DTO)`, `Row-Level Security (RLS) Vault`.
- **Tier 4 Nodes**: `Power BI Executive Cloud Service`, `Real-Time Executive KPI Dashboard`, `C-Suite Mobile Fiscal Radar`.

---

#### Architecture 06: Corporate Financial Controls & Internal Audit Governance
```
┌─────────────────────┐       ┌──────────────────────┐       ┌───────────────────────┐       ┌──────────────────────┐
│  Tier 1: AP / AR    │  ──>  │  Tier 2: Gatekeeper  │  ──>  │   Tier 3: Tax Engine  │  ──>  │  Tier 4: Governance  │
│  • Vendor Invoices  │       │  • Segregation Duties│       │  • Advance Tax Forecast│      │  • Immutable Log     │
│  • Purchase Orders  │       │  • 194Q TDS Rule Set │       │  • 26AS Real-Time Sync│       │  • Board Dossier     │
│  • Payment Reqs     │       │  • Approval Threshold│       │  • Working Capital Opt│       │  • Zero Notice Audit │
└─────────────────────┘       └──────────────────────┘       └───────────────────────┘       └──────────────────────┘
```
- **Tier 1 Nodes**: `Accounts Payable / Receivable Ledger`, `Purchase Orders & Vendor Agreements`, `Treasury Payment Requisitions`.
- **Tier 2 Nodes**: `Segregation of Duties (SoD) Enforcer`, `Statutory TDS Withholding Threshold Validator (Section 194Q)`, `Multi-Tier Approval Hierarchy`.
- **Tier 3 Nodes**: `Advance Corporate Tax Forecasting Engine`, `Form 26AS Continuous Audit Daemon`, `Working Capital Optimization Pipeline`.
- **Tier 4 Nodes**: `Immutable Compliance Audit Trail`, `Quarterly Board Review Packets`, `Zero-Notice Statutory Defense Dossier`.

---

#### Architecture 07: AI Prompt-to-Fullstack SaaS Generator
```
┌─────────────────────┐       ┌──────────────────────┐       ┌───────────────────────┐       ┌──────────────────────┐
│   Tier 1: Prompt    │  ──>  │  Tier 2: AI Synthesizer  ──> │  Tier 3: Guardrails   │  ──>  │   Tier 4: Deploy     │
│  • Natural Lang Spec│       │  • Claude 3.5 Sonnet │       │  • Oxlint Linter      │       │  • Next.js 14 App    │
│  • Token Presets    │       │  • AST Code Generator│       │  • TypeScript Check   │       │  • Supabase Postgres │
│  • Schema Config    │       │  • Tailwind Synthesizer      │  • Vitest Test Runner │       │  • Vercel Edge Infra │
└─────────────────────┘       └──────────────────────┘       └───────────────────────┘       └──────────────────────┘
```
- **Tier 1 Nodes**: `Natural Language Application Specification`, `Design System Token Library`, `Domain Schema Archetypes`.
- **Tier 2 Nodes**: `Claude 3.5 Sonnet / Cursor Orchestrator`, `Abstract Syntax Tree (AST) Code Generator`, `Next.js Server Action & Tailwind Synthesizer`.
- **Tier 3 Nodes**: `Oxlint High-Speed Syntax Linter`, `TypeScript Strict Compiler Check`, `Vitest Unit Test Suite Runner`.
- **Tier 4 Nodes**: `Next.js 14 Production Bundle (Vercel Edge)`, `Supabase PostgreSQL (Automated RLS)`, `Stripe Checkout Webhook Engine`.

---

#### Architecture 08: Autonomous Multi-Agent Workflow Engine
```
┌─────────────────────┐       ┌──────────────────────┐       ┌───────────────────────┐       ┌──────────────────────┐
│   Tier 1: Planner   │  ──>  │   Tier 2: Agent Pool │  ──>  │   Tier 3: Execution   │  ──>  │  Tier 4: Evaluation  │
│  • Spec Ingestion   │       │  • Researcher Agent  │       │  • AST File Edits     │       │  • Test Suite Gate   │
│  • DAG Decomposer   │       │  • Coder Agent       │       │  • CLI Sandbox        │       │  • Self-Healing Loop │
│  • Context Manager  │       │  • Evaluator Agent   │       │  • Worktree Git Commits│      │  • Automated PR Merge│
└─────────────────────┘       └──────────────────────┘       └───────────────────────┘       └──────────────────────┘
```
- **Tier 1 Nodes**: `Task Spec Ingestion Engine`, `DAG Task Decomposer & Dependency Resolver`, `Persistent Context Window Manager`.
- **Tier 2 Nodes**: `Researcher Subagent (Docs/Code Search)`, `Coder Subagent (Parallel Worktree Diff)`, `Evaluator Subagent (Test Verification)`.
- **Tier 3 Nodes**: `AST Filesystem Manipulator`, `Terminal Execution Sandbox`, `Git Worktree Branch Manager`.
- **Tier 4 Nodes**: `Automated Test Quality Gate`, `Self-Healing Regression Repair Loop`, `Gated PR Merge & Deployment Pipeline`.

---

#### Architecture 09: Real-Time AI Document & Code Synthesizer
```
┌─────────────────────┐       ┌──────────────────────┐       ┌───────────────────────┐       ┌──────────────────────┐
│  Tier 1: Multimodal │  ──>  │  Tier 2: Vector Store│  ──>  │   Tier 3: Stream LLM  │  ──>  │  Tier 4: Gen UI      │
│  • PDF / CSV Upload │       │  • 50-Chunk Embeddings│      │  • SSE Streaming Pipe │       │  • KaTeX Math Engine │
│  • OCR Extraction   │       │  • Cosine Similarity │       │  • Zod Schema Validator│      │  • Reactive Charts   │
│  • Tokenizer Chunks │       │  • Client-Side Cache │       │  • JSON Formatter     │       │  • Exportable Artifact│
└─────────────────────┘       └──────────────────────┘       └───────────────────────┘       └──────────────────────┘
```
- **Tier 1 Nodes**: `Multimodal Document Uploader (PDF, CSV, Excel)`, `High-Accuracy OCR & Table Extractor`, `Semantic Chunking Tokenizer`.
- **Tier 2 Nodes**: `Client-Side Vector Embedding Cache`, `Cosine Similarity Search Index (12ms)`, `Hybrid Dense-Sparse Query Router`.
- **Tier 3 Nodes**: `Streaming Server-Sent Events (SSE) Pipe`, `Zod Strict Schema Validator`, `Bi-Directional JSON Artifact Formatter`.
- **Tier 4 Nodes**: `KaTeX Mathematical Formula Renderer`, `Tailwind Reactive Component Canvas`, `Exportable TypeScript & Chart Artifacts`.

---

### 4.3 Component Architecture Recommendation

To guarantee maintainability, zero code duplication, and seamless integration with `CaseStudyDrawer.jsx`, the following modular component hierarchy is recommended:

```
src/
├── components/
│   └── case-study/
│       ├── CaseStudyDrawer.jsx        # Slide-over Drawer host (backdrop, focus trap, escape, ARIA modal)
│       ├── CaseStudySimulator.jsx     # Reusable simulator host with live telemetry, audio, a11y
│       ├── CaseStudyArchitecture.jsx  # Responsive 4-tier SVG/CSS architecture blueprint
│       ├── StoryStageViewer.jsx       # 5-stage storytelling renderer (Challenge, Solution, Tech, Results, Lessons)
│       └── MetricHighlights.jsx       # Interactive before-and-after KPI cards
└── data/
    └── caseStudiesData.js             # Single source of truth containing all 9 projects data & configs
```

#### 4.3.1 Component Specifications

1. **`CaseStudySimulator.jsx` Props & State Contract**:
   ```jsx
   // Props:
   // - project: Object (from caseStudiesData[projectId])
   // - isDrawerOpen: Boolean
   // - onClose: Function
   
   // Responsibilities:
   // 1. Render top terminal/mockup bar with macOS-style dots and file name.
   // 2. Render Type A (Pipeline) or Type B (State Machine) depending on project.simType.
   // 3. Bind execution to soundFX and useAnnounce().
   // 4. Render live telemetry bar with calibrated latency counter and status badge.
   // 5. Ensure WCAG AAA contrast in high-contrast mode (solid borders, no subtle opacity text).
   ```

2. **`CaseStudyArchitecture.jsx` Props & Layout Contract**:
   ```jsx
   // Props:
   // - architecture: Object (tiers: Array of 4 tiers with title, icon, and nodes)
   // - accentColor: String (hex color matching project track)
   
   // Responsibilities:
   // 1. Desktop: Renders a 4-column horizontal pipeline connected with sleek SVG directional arrows.
   // 2. Mobile (< 640px): Automatically converts to a vertical sequential stack with down arrows (↓).
   // 3. Node rendering: Icon + Monospace Title + Crisp Description.
   // 4. Active data pulse animation: When simulator runs, animated pulse dots travel along SVG connector lines.
   // 5. High-contrast mode: Injects 2px solid border and high-contrast text tags.
   ```

3. **`caseStudiesData.js` Central Data Schema**:
   ```javascript
   export const CASE_STUDIES = {
     'proj-gst-tax': {
       id: '01',
       targetId: 'proj-gst-tax',
       title: 'GST & Income Tax Compliance & Verification Engine',
       track: 'Accountant & Tax',
       trackBadge: 'Financial Track',
       accentColor: '#FF4D6D',
       metrics: [...],
       story: {
         challenge: '...',
         solution: '...',
         techStack: '...',
         measurableResults: '...',
         lessonsLearned: '...'
       },
       simulation: {
         type: 'pipeline', // 'pipeline' | 'state-machine'
         docName: 'gstr2b-reconciliation-fy2324.pdf',
         initialLatency: 210,
         calibratedLatency: 185,
         buttonLabel: 'Run Statutory ITC Audit',
         statusLabel: '100% RECONCILED',
         steps: [
           { label: 'ERP Ledger Ingestion', desc: '1,420 Invoices' },
           { label: 'GSTR-2B GSTIN Matching', desc: 'Portal Cross-Check' },
           { label: 'Section 16(2) Compliance', desc: '180-Day Rule Verified' }
         ],
         telemetryLabels: {
           engine: 'Portal API & Tally Prime Sync',
           throughput: '1,420 Invoices / 185ms',
           compliance: '100% Statutory Adherence'
         }
       },
       architecture: {
         topology: 'Statutory Verification Pipeline',
         tiers: [
           { name: 'Tier 1: Ingestion', nodes: [...] },
           { name: 'Tier 2: Validation', nodes: [...] },
           { name: 'Tier 3: Core Engine', nodes: [...] },
           { name: 'Tier 4: Outputs', nodes: [...] }
         ]
       }
     },
     // ... Projects 02 through 09
   };
   ```

---

## 5. Verification Method

To independently verify the designs and ensure zero regressions when implemented:

### 5.1 Verification Commands
1. **Linter Inspection**:
   ```powershell
   npx oxlint src/
   ```
   *Expected Result*: 0 warnings, 0 errors.

2. **Full Production Build**:
   ```powershell
   npm run build
   ```
   *Expected Result*: Vite production bundle compiles cleanly with exit code 0.

3. **Automated Test Suite**:
   ```powershell
   npm test
   ```
   *Expected Result*: All existing verification scripts pass cleanly.

### 5.2 Independent Architectural Sanity Tests
Create an automated test script (e.g. `scripts/verify_case_study_sim_arch.mjs`) to verify:
1. All 9 project case study records in `caseStudiesData.js` possess:
   - Complete 5-stage storytelling (`challenge`, `solution`, `techStack`, `measurableResults`, `lessonsLearned`).
   - Valid simulation configuration (`type`, `docName` / `stateNodes`, `calibratedLatency`, `steps` / `nodes`, `statusLabel`).
   - Valid 4-tier architecture definition (`tiers` array with 4 items, non-empty `nodes`).
2. Accessibility conformance:
   - All interactive controls feature explicit `aria-label` or `aria-labelledby`.
   - Simulation regions feature `role="region"` and `aria-live="polite"`.
   - Sound hooks call established `soundFX` methods without throwing exceptions.
3. Responsiveness:
   - Flowcharts adapt between desktop grid and mobile stacked layouts without horizontal overflow.

### 5.3 Invalidation Conditions
- Any of the 9 projects lacking either an interactive simulation widget or a visual system architecture blueprint.
- High-contrast mode displaying unreadable low-contrast text or missing node borders.
- Broken audio cues or unhandled `AudioContext` errors.
- Any TypeScript, Vite, or Oxlint compile errors.

---
*End of Report — explorer_cs_sim_arch*
