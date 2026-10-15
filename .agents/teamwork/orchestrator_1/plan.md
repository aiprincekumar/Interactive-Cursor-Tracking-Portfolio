# Master Plan: Atul Kant Verma Portfolio Overhaul

## Objective
Comprehensively update the interactive portfolio website with the complete and authentic resume data of Atul Kant Verma, strictly preserving 100% of all visual assets, 2.5D character poses, hero background, camera roll gallery photos, and interactive physics, ensuring clean `npm run build`.

## Phases

### Phase 0: Parallel Codebase Survey & Audit (3 Explorers)
- **Explorer 1 (Survey: Identity & Layout)**: Examine `index.html`, `Navbar.jsx`, `HeroSection.jsx`, `AboutSection.jsx`, `Footer.jsx`. Inventory all legacy strings ("Sushmita", "Dasari", "srii_tech_", "Technical Hub"), asset references, and layout structures.
- **Explorer 2 (Survey: Skills & Experience)**: Examine `SkillsSection.jsx`, `TechMarqueeBanner.jsx`, `ExperienceSection.jsx`. Map current structures to Atul's 6 professional roles and technical/operational skills.
- **Explorer 3 (Survey: Projects, Interactive Systems & Contact)**: Examine `ProjectsSection.jsx`, `CodingAchievementsSection.jsx`, `ContactSection.jsx`, interactive simulator logic, state machines, sound FX, and contact endpoints.

### Phase 1: Implementation (Worker)
- Dispatch Worker with consolidated survey findings and instructions:
  - R1: Overhaul `index.html`, `Navbar.jsx`, `HeroSection.jsx`, `Footer.jsx` with Atul Kant Verma ("AV", "Accountant & Tax Consultant.", "Business Development & Office Administrator.").
  - R2: Rewrite `AboutSection.jsx` editorial narrative.
  - R3: Align `SkillsSection.jsx` & `TechMarqueeBanner.jsx` with Tally Prime, GST, IT, Excel, DTP, ADCA, MIS, Hardware.
  - R4: Transform `ExperienceSection.jsx` across all 6 roles.
  - R5: Repurpose `ProjectsSection.jsx` & `CodingAchievementsSection.jsx` while preserving interactive simulators and mechanics.
  - R6: Update `ContactSection.jsx` with direct contact info and functional triggers.
  - Verify `npm run build` succeeds cleanly.
  - Document changes and changes_log per user requirements.

### Phase 2: Quality & Functional Verification (Reviewers & Challengers)
- **2 Reviewers**: Inspect all modified files against requirements R1-R6, check for syntax, styling, responsiveness, and clean build.
- **2 Challengers**:
  - Challenger 1: Rigorously search codebase for any residual legacy tokens ("Sushmita", "Dasari", "srii_tech_", "Technical Hub").
  - Challenger 2: Verify visual asset preservation (2.5D character poses `00-rear-view.png` through `09-lower-right.png`, `BgHero.jpg`, camera roll photos) and interactive physics/simulators.

### Phase 3: Forensic Integrity Audit (teamwork_preview_auditor)
- Independent auditor validates authentic implementation, zero cheating/facades, and complete compliance.

### Phase 4: Final Gate & Handoff
- Evaluate all verdicts in `GATE_STATUS.md`.
- Formulate executive handoff report and notify parent agent.
