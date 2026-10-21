# Scope Specification: Production-Ready P1 Case Studies for 9 Projects

## Architecture Overview
The P1 Case Studies feature provides an interactive, accessible digital dossier for all 9 projects in the portfolio, accessible via a slide-over drawer that anchors the portfolio in the background.

```
Portfolio Page (ProjectsSection / App.jsx)
  │
  ├── Trigger: "Inspect Case Study ↗" on each of the 9 Project Cards
  ├── Deep link: URL query param (?casestudy=01)
  └── Global event: 'portfolio:open-case-study'
        │
        ▼
  [CaseStudyDrawer.jsx] (Accessible Slide-Over Drawer)
        │
        ├── Header: Project ID, Role Badge, Title, Category, Close Button (Esc / Click)
        ├── Focus Trap & Scroll Lock (`useFocusTrap`, `document.body.style.overflow`)
        ├── 5-Stage Storytelling Tabs (WAI-ARIA Tablist, Arrow Navigation, Audio Cues):
        │     1. The Challenge (Context, Pain Points)
        │     2. The Solution (Architecture, Strategic Engineering, Key Pillars)
        │     3. Tech Stack & Obstacles (Stack Roles, Concrete Obstacles & Resolutions)
        │     4. Measurable Results & Metrics (Before vs After, Metric Highlights)
        │     5. Key Lessons Learned (Durable Principles & Takeaways)
        ├── [CaseStudySimulator.jsx] (Live Interactive Telemetry Simulation Widget)
        │     - Type A: Pipeline Telemetry Runner (Projects 01, 03, 04, 05, 07, 09)
        │     - Type B: Multi-Node State Machine (Projects 02, 06, 08)
        │     - Tactile Web Audio cues, ARIA live announcements, telemetry HUD
        ├── [CaseStudyArchitecture.jsx] (Visual System Architecture Blueprint)
        │     - 4-tier responsive flow: Ingestion -> Controller -> Engine -> Output
        │     - Responsive SVG / CSS flowcharts with high-contrast WCAG AAA compliance
        └── Footer: Key verified badges, live repo / demo references, navigation cycle
```

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Case Studies Master Data | Authentic, comprehensive 5-stage storytelling data, metrics, simulators, and architecture specs for all 9 projects in `src/data/caseStudiesData.js` | M1 | Survey (`explorer_cs_projects`) |
| 2 | Accessible Slide-Over Drawer | Right-sliding drawer with backdrop blur, focus trapping, Escape dismissal, background scroll-locking, and ARIA attributes in `src/components/CaseStudyDrawer.jsx` | M2 | Survey (`explorer_cs_drawer_ui`) |
| 3 | Interactive Telemetry Simulators | Calibrated latency, step-by-step progress, tactile Web Audio, and live telemetry for both pipeline runners and state machines in `src/components/CaseStudySimulator.jsx` | M3 | Survey (`explorer_cs_sim_arch`) |
| 4 | Visual System Architecture Blueprints | Responsive 4-tier system flowcharts with directional indicators, SVG connectors, and theme adaptability in `src/components/CaseStudyArchitecture.jsx` | M3 | Survey (`explorer_cs_sim_arch`) |
| 5 | ProjectsSection Trigger Integration | Accessible "Inspect Case Study" buttons on all 9 project cards across all views (flagship cards and MIS 2-column grid) in `src/components/ProjectsSection.jsx` | M2 | Survey (`explorer_cs_projects`) |
| 6 | App Mount & URL Deep Linking | Mounting drawer at `App.jsx`, query string synchronization (`?casestudy=...`), and global event dispatching | M2 | Survey (`explorer_cs_drawer_ui`) |
| 7 | Multi-Theme & A11y Polish | Full support for Linen Light, Obsidian Dark, High-Contrast mode, Simple mode, and reduced motion | M4 | Survey (`explorer_cs_drawer_ui`) |
| 8 | Automated Verification Test Suite | Dedicated script `scripts/verify_case_studies.mjs` verifying all 9 dossiers render, contain valid 5-stage content, simulator configs, and architecture flows | M4 | Orchestrator Spec |
| 9 | Rule 6 Audit Trail | Complete changes logging in `changes_log/` complying with Universal Rule 6 | M4 | Universal Rule 6 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Data & Storytelling | `src/data/caseStudiesData.js` complete 9-project dataset | None | IN_PROGRESS |
| 2 | Components & UI | `CaseStudyDrawer.jsx`, `CaseStudySimulator.jsx`, `CaseStudyArchitecture.jsx` | M1 | PLANNED |
| 3 | Integration & Triggers | `ProjectsSection.jsx`, `App.jsx`, global events, URL sync | M2 | PLANNED |
| 4 | Verification & Quality Gate | `verify_case_studies.mjs`, `npm run build`, multi-agent review/challenge/audit | M1, M2, M3 | PLANNED |

## Interface Contracts

### 1. `src/data/caseStudiesData.js`
Exports:
- `CASE_STUDIES`: Array of 9 case study objects.
- `getCaseStudyById(id)`: Helper function returning single case study.
Schema per object:
```javascript
{
  id: '01', // '01' through '09'
  targetId: 'proj-gst-tax', // matches project anchor
  role: 'accountant' | 'mis' | 'other' | 'vibe_coding',
  trackBadge: string,
  title: string,
  subtitle: string,
  category: string,
  accentColor: string,
  summary: string,
  metrics: [{ label: string, val: string, desc: string }],
  techStack: string[],
  story: {
    challenge: { title: string, context: string, painPoints: string[] },
    solution: { title: string, approach: string, keyPillars: [{ title: string, desc: string }] },
    techAndObstacles: { title: string, stack: [{ name: string, role: string }], obstacles: [{ hurdle: string, resolution: string }] },
    resultsAndMetrics: { title: string, beforeVsAfter: [{ metric: string, before: string, after: string, delta: string }], highlights: string[] },
    lessonsLearned: { title: string, takeaways: [{ principle: string, detail: string }] }
  },
  simulator: {
    archetype: 'pipeline' | 'state-machine',
    title: string,
    description: string,
    initialLatency: number,
    steps: [{ id: string, label: string, duration: number, details: string }],
    nodes?: [{ id: string, label: string, status: string, desc: string }],
    telemetryKeys: [{ key: string, label: string, initialValue: string, successValue: string }]
  },
  architecture: {
    title: string,
    description: string,
    tiers: [
      { name: 'Tier 1: Ingestion / Client Layer', nodes: [{ name: string, tech: string, detail: string }] },
      { name: 'Tier 2: Gateway & Validation Layer', nodes: [{ name: string, tech: string, detail: string }] },
      { name: 'Tier 3: Core Processing Engine', nodes: [{ name: string, tech: string, detail: string }] },
      { name: 'Tier 4: Storage, Output & E-Filing', nodes: [{ name: string, tech: string, detail: string }] }
    ]
  }
}
```

### 2. `CaseStudyDrawer.jsx`
Props:
```javascript
{
  isOpen: boolean,
  caseStudyId: string | null,
  onClose: () => void,
  onSelectProject?: (id: string) => void
}
```
Behaviors:
- Listens for Escape key.
- Closes on backdrop overlay click.
- Locks `document.body` scroll while open.
- Traps keyboard focus (`Tab`, `Shift+Tab`) inside the dialog.
- Returns focus to previous `activeElement` upon close.
- Web Audio sound triggers for open, close, and tab selection.
- Screen reader announcements on open/close and tab switch.

### 3. `CaseStudySimulator.jsx`
Props:
```javascript
{
  simulatorData: object,
  accentColor: string,
  isHighContrast?: boolean
}
```

### 4. `CaseStudyArchitecture.jsx`
Props:
```javascript
{
  architectureData: object,
  accentColor: string,
  isHighContrast?: boolean
}
```

## Code Layout
- `src/data/caseStudiesData.js`: Master data for all 9 projects.
- `src/components/CaseStudyDrawer.jsx`: Slide-over drawer container with tabs, header, footer.
- `src/components/CaseStudySimulator.jsx`: Telemetry simulation component.
- `src/components/CaseStudyArchitecture.jsx`: System architecture flowchart component.
- `src/components/ProjectsSection.jsx`: Trigger buttons on project cards.
- `src/App.jsx`: Root mounting and URL synchronization.
- `scripts/verify_case_studies.mjs`: Node.js automated verification test suite.
- `changes_log/`: Universal Rule 6 changes log entries.
