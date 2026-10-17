# DISPATCH — teamwork_preview_swe_3

## Task Assignment
Add an 'Overview' role track and synthesize an AI-derived 'Other ✨ AI' role track into the interactive cursor-tracking portfolio, establishing a 4-tab role navigation hierarchy with Accountant as default.

## Working Directory
`c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\swe_3`

## Project Root
`c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio`

## Reference Documents
- `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md` (Refer to entry `## 2026-10-17T21:04:04Z`)

## Requirements

### R1. Four-Tab Role Hierarchy & Navigation
Establish a fixed role track sequence: `Overview`, `Accountant`, `MIS`, and `Other ✨ AI`.
- The `Overview` button must permanently occupy the first position in all role selection bars, ribbons, drawers, and command palettes.
- The default initial active role upon first visit must remain `Accountant` (`DEFAULT_ROLE = 'accountant'`).
- Support bidirectional URL query parameter synchronization (`?role=overview`, `?role=accountant`, `?role=mis`, `?role=other`), local storage persistence, sound effects, and keyboard navigation across all 4 roles.

### R2. 'Overview' Executive Highlights & Summary Track
Implement the `Overview` track (`LayoutDashboard` icon, Indigo `#6366F1` accent) aggregating and curating top highlights exclusively from the two verified tracks (`Accountant` and `MIS`).
- Exclude 'Other' entirely from Overview synthesis.
- Curate and display flagship experiences and projects tagged with their respective track badges (`Financial Track` vs `Data & Operations Track`).
- Hero copy: Title "Financial & Operations Executive.", Subtitle "Bridging Statutory Accounting, Taxation & Advanced Data Intelligence.".
- Resume action triggers the master comprehensive resume (`Atul_Verma_Overview_Resume.pdf` / `resume.pdf`).

### R3. 'Other ✨ AI' Synthesized Distinct Role Track
Define and implement the `Other ✨ AI` track as an emergent distinct specialization: Business Intelligence & Corporate Controller (Statutory Financial Strategy & Executive Data Systems).
- Tab label must display `Other ✨ AI` with an AI sparkles indicator.
- Inside sections, display a prominent badge/banner: `🤖 AI-Synthesized Role (Derived from Verified Tracks)` informing visitors that this role was synthesized by AI from accounting + MIS competencies.
- Replace all demo/random data with authentic, mature experience items, projects, and skills covering corporate financial controls, ERP automation, Power BI fiscal dashboards, and statutory auditing.
- Resume action triggers specialized controller resume (`Atul_Verma_BI_Corporate_Controller_Resume.pdf`).

## Verification Resources
- Project build script: `npm run build` (Vite production build)
- Project linter: `npm run lint` (Oxlint)

## Acceptance Criteria

### Navigation & State
- [ ] Tab order is strictly `Overview`, `Accountant`, `MIS`, `Other ✨ AI`.
- [ ] Initial page load without query params defaults to `Accountant`.
- [ ] Selecting each tab smoothly updates the active role state, URL parameter (`?role=...`), and UI components without runtime errors.

### Content & Data Segregation
- [ ] `Overview` displays curated flagship highlights exclusively from `Accountant` and `MIS`, with clear visual track badges.
- [ ] `Other ✨ AI` displays the complete 'Business Intelligence & Corporate Controller' profile with zero generic demo strings and a visible AI disclaimer banner.
- [ ] `npm run lint` and `npm run build` complete with zero errors.

## Instructions
Execute the SWE Light protocol: deploy implementer and reviewer rounds. Maintain `progress.md` in your directory.
When complete, write your handoff report and notify Sentinel (conversation ID: 6f46301d-e609-41ea-bf54-6145ed3e08e6) via `send_message`.
