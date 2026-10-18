# Orchestrator 6 Plan: Vibe Coding Profile Track

## Objective
Add "Vibe Coding" (`vibe_coding`) as a primary portfolio profile track positioned between "MIS & Analytics" (`mis`) and "Other ✨ AI" (`other`), with comprehensive auto-generated section data and complete UI integration.

## Architecture & Touchpoint Scope
1. **Asset Layer**:
   - Duplicate `public/assets/Profile_Pic/Others.jpg` to `public/assets/Profile_Pic/VibeCoder.jpg`.
2. **Context & Theme Layer (`src/context/RoleContext.jsx`)**:
   - Role key: `vibe_coding`
   - Position: after `mis`, before `other`
   - Label: "Vibe Coding", shortLabel: "Vibe Coder", mobileLabel: "Vibe"
   - Theme: Emerald / Cyber Green (`#10B981`), `bgLight: 'bg-emerald-50'`, `borderLight: 'border-emerald-200'`, icon `Terminal` / `Cpu`
   - Hero Title: "Vibe Coder & AI Software Engineer."
   - Hero Subtitle: "Rapid Full-Stack Prototyping, Autonomous Coding & SaaS Engineering."
   - Avatar: `${cleanBase}/assets/Profile_Pic/VibeCoder.jpg`
3. **Section Content Layer**:
   - `AboutSection.jsx`: AI-native builder mindset, rapid prototyping philosophy, prompt-driven architecture.
   - `SkillsSection.jsx`: AI coding environments (Cursor, Windsurf, Claude Code, GitHub Copilot, v0.dev), Fullstack SaaS frameworks (Next.js, React, Tailwind CSS, Supabase, Node.js), LLM APIs, Autonomous Debugging.
   - `ProjectsSection.jsx`: 3 realistic AI & SaaS projects:
     1. AI Prompt-to-Fullstack SaaS Generator
     2. Autonomous Multi-Agent Workflow Engine
     3. Real-Time AI Document & Code Synthesizer
   - `ExperienceSection.jsx`: 6 months practical experience entry:
     - Role: "Independent AI Builder / Freelance Vibe Coder"
     - Organization: "Self-Employed / Stealth SaaS Studio"
     - Duration: 6 months
     - Focus: Rapid prototype deployment, end-to-end fullstack AI apps, prompt architecture, automated dev loops.
   - `TechMarqueeBanner.jsx`: Tailored tech tags (Cursor, Next.js, Claude, Tailwind, Supabase, v0).
   - `CodingAchievementsSection.jsx`: Productivity metrics (10x Shipping Velocity, 50+ Rapid Prototypes, 100% AI-Assisted Workflows).
4. **Navigation & System Coherence**:
   - `resumeConfig.js`: Resume track for Vibe Coding.
   - `searchCatalog.js`: Search indexing for Vibe Coding role, skills, projects, and keywords.
   - `CommandPalette.jsx`: Quick jump and commands for Vibe Coding.
   - `ResumeDropdown.jsx`: Dropdown option for Vibe Coding.
   - `Overview` summaries: Integrate Vibe Coding highlights into multi-track executive view.
5. **Quality & Audit Trail**:
   - `npx oxlint src/` reports 0 errors and 0 warnings.
   - `npm run build` succeeds cleanly.
   - `changes_log/` updated according to Rule 6 and Rule 8.

## Execution Sequence
- **Step 1: Exploration**
  - Spawn 3 parallel Explorers:
    - Explorer 1: Inspect `RoleContext.jsx`, asset handling, and navigation components (`CommandPalette.jsx`, `ResumeDropdown.jsx`, `resumeConfig.js`, `searchCatalog.js`).
    - Explorer 2: Inspect section components (`AboutSection.jsx`, `SkillsSection.jsx`, `ProjectsSection.jsx`, `ExperienceSection.jsx`, `TechMarqueeBanner.jsx`, `CodingAchievementsSection.jsx`).
    - Explorer 3: Inspect existing role definitions, Overview multi-track integration, and test/build setup.
- **Step 2: Implementation**
  - Spawn Worker (`worker_vibe_1`) to execute all code modifications, file duplications, test runs, and audit logging.
- **Step 3: Verification & Challenge**
  - Spawn 2 Reviewers independently checking code standards, complete coverage, and build checks.
  - Spawn 2 Challengers to test edge cases, role-switching reactivity, and content rendering.
  - Spawn 1 Forensic Auditor to verify integrity and authentic implementation.
- **Step 4: Gate Evaluation & Completion**
  - Synthesize reports into `GATE_STATUS.md`.
  - Report back to Sentinel upon unanimous pass.
