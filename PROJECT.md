# Project: Interactive Cursor-Tracking Portfolio — P1 Case Studies for 9 Projects

## Architecture
- Module boundaries:
  - `src/data/caseStudiesData.js`: Centralized master schema and 5-stage storytelling dataset for all 9 projects across all 4 tracks.
  - `src/components/CaseStudyDrawer.jsx`: Slide-Over Drawer component with focus trapping, Escape dismissal, background scroll-lock, and Web Audio integration.
  - `src/components/CaseStudySimulator.jsx`: Interactive live telemetry simulation widget with calibrated latency and state machine visualization.
  - `src/components/CaseStudyArchitecture.jsx`: Responsive 4-tier visual system architecture blueprints with WCAG AAA contrast compliance.
  - `src/components/ProjectsSection.jsx`: Accessible card trigger integration across flagship and grid views.
  - `src/App.jsx`: Global mounting and URL deep-linking synchronization (`?casestudy=01`).
  - `scripts/verify_case_studies.mjs`: Automated verification test suite.

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

## Code Layout
- `src/data/caseStudiesData.js`
- `src/components/CaseStudyDrawer.jsx`
- `src/components/CaseStudySimulator.jsx`
- `src/components/CaseStudyArchitecture.jsx`
- `src/components/ProjectsSection.jsx`
- `src/App.jsx`
- `scripts/verify_case_studies.mjs`
- `changes_log/`
