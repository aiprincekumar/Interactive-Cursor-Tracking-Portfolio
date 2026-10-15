# Project: Atul Kant Verma Portfolio Overhaul

## Architecture
The application is a modern React 19 + Vite interactive portfolio featuring 2.5D head/cursor tracking, real-time physics, audio feedback, interactive compliance & accounting state machines, and responsive layouts.
Visual assets (`public/assets/hero_poses/00-rear-view.png` through `09-lower-right.png`, `BgHero.jpg`) and `CameraRollGallery` photos are strictly preserved.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | R1: Brand Identity & Navbar | Title, initials "AV", brand "Atul Verma", title "Accountant & Tax Consultant.", subtitle "Business Development & Office Administrator.", Cmd+K search trigger, Resume action dropdown with confetti, scroll progress bar. | M1 | ORIGINAL_REQUEST §R1 |
| 2 | R1: Hero Section Overhaul | Hero titles, subtitles, placeholder social links (`#`), strictly preserve 100% of character gaze poses and BgHero.jpg. | M1 | ORIGINAL_REQUEST §R1 |
| 3 | R1: Footer Cleansing | Watermark "ATUL KANT VERMA", brand, attribution, copyright 2026. | M1 | ORIGINAL_REQUEST §R1 |
| 4 | R1: HTML Metadata | index.html title and meta description updated. | M1 | ORIGINAL_REQUEST §R1 |
| 5 | R2: About & Narrative | AboutSection editorial story (4+ yrs Tally, 3+ yrs GST/IT, DAY-NULM MIS, Daltonganj Jharkhand, ADCA, I.A.). | M1 | ORIGINAL_REQUEST §R2 |
| 6 | R3: Skills Section | 16 skills across 4 categories (Accounting & Tax, Software & Applications, IT Systems & Hardware, Management & Operations). | M2 | ORIGINAL_REQUEST §R3 |
| 7 | R3: Tech Marquee Banner | Dual marquee ribbon with Tally, GST, Tax, Excel, DTP, MIS, and butterfly separators. | M2 | ORIGINAL_REQUEST §R3 |
| 8 | R4: Experience Matrix | All 6 authentic professional roles with real deliverables, responsive 2x3 grid, remove legacy "Technical Hub". | M2 | ORIGINAL_REQUEST §R4 |
| 9 | R5: Projects Repurposing | Project 01 (GST/IT Compliance Engine with interactive audit simulator) and Project 02 (Tally Accounting with interactive circular state machine), Project 03 & 04 in companion projects. | M2 | ORIGINAL_REQUEST §R5 |
| 10 | R5: Milestones & Certifications | Re-theme CodingAchievementsSection to Professional Milestones & Certifications (#achievements anchor preserved). | M2 | ORIGINAL_REQUEST §R5 |
| 11 | R6: Contact Section | Email `Atulravi2015@gmail.com`, phone `+91 7004149900`, location `Daltonganj (Medininagar), Jharkhand`, cleansed form responses and placeholder social links. | M2 | ORIGINAL_REQUEST §R6 |
| 12 | Quality & Build Gate | 0 legacy occurrences, 100% asset preservation, `npm run build` exits 0, forensic audit CLEAN. | M3 | ORIGINAL_REQUEST §Acceptance Criteria |

## Code Layout & Ownership
- **Milestone 1 (Worker 1)**:
  - `index.html`
  - `src/components/Navbar.jsx`
  - `src/components/HeroSection.jsx`
  - `src/components/AboutSection.jsx`
  - `src/components/Footer.jsx`
- **Milestone 2 (Worker 2)**:
  - `src/components/SkillsSection.jsx`
  - `src/components/TechMarqueeBanner.jsx`
  - `src/components/ExperienceSection.jsx`
  - `src/components/ProjectsSection.jsx`
  - `src/components/CodingAchievementsSection.jsx`
  - `src/components/ContactSection.jsx`
- **Milestone 3 (Verification & Audit)**:
  - Reviewer 1 & Reviewer 2
  - Challenger 1 & Challenger 2
  - Forensic Auditor (`teamwork_preview_auditor`)

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Identity & Layout Overhaul | index.html, Navbar, HeroSection, AboutSection, Footer | none | IN_PROGRESS |
| M2 | Skills, Experience, Projects & Contact Overhaul | SkillsSection, TechMarqueeBanner, ExperienceSection, ProjectsSection, CodingAchievementsSection, ContactSection | none | IN_PROGRESS |
| M3 | Quality, Testing & Forensic Integrity Gate | Full build verification, Reviewers, Challengers, and Forensic Auditor | M1, M2 | PLANNED |
