# Dispatch: Worker 1 (Navbar All-in-One Power Pack Implementation)

- **Role**: Software Engineer / Frontend Worker
- **Working Directory**: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_1
- **Project Root**: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio
- **Specification**: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md
- **Explorer Reports**:
  - `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_p0_1\handoff.md`
  - `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_p0_2\handoff.md`
  - `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_p0_3\handoff.md`

## Mandatory Integrity Warning:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Task Requirements:
1. **Search Catalog & Command Palette Modal (`src/components/CommandPalette.jsx`)**:
   - Implement Command Palette with `Cmd+K` / `Ctrl+K` global keyboard shortcut.
   - Include 27 searchable items (Sections: #hero, #about, #skills, #experience, #projects, #achievements, #gallery, #playground, #contact; Featured Projects: PolicyGuard AI, Payment Gateway State Machine, ChromaCanvas Studio, Aetheria Design System; Skills & Tools: React 19, Python, Java, C++, Tailwind CSS v4, Node.js, PostgreSQL, AWS, Docker, Git, Tally Prime, GST & Income Tax, Advanced Excel).
   - Keyboard navigation with `ArrowUp`/`ArrowDown`, `Enter` to scroll to target anchor smoothly without page reload, and `Escape`/backdrop click to close.
   - Body scroll locking while modal is open.
   - Clear query button and empty search state.
2. **Dedicated Search Button in Navbar (`src/components/Navbar.jsx`)**:
   - Add Search button with magnifying glass icon and `⌘K` badge to the navbar right action group.
   - Strict rendering order: `[🔍 Search] -> [🦋 Cursor] -> [🔊 Sound] -> [📄 Resume]`.
   - Responsive sizing: mobile (<640px) compact 32px icon button; tablet/desktop (>=640px) icon + `⌘K` badge.
3. **Smart Resume Action Dropdown (`src/components/ResumeDropdown.jsx`)**:
   - Replace static `#contact` anchor on the coral Resume button with a toggleable dropdown menu.
   - 3 discrete actions:
     a) View Online / Preview: Opens/previews resume in a new tab (`/resume.pdf`).
     b) Download PDF: Downloads resume file (`Atul_Kant_Verma_Resume.pdf`), triggers celebratory canvas confetti (`canvas-confetti`), and plays sparkle audio chime (`soundFX.playSparkle()`) if audio is unmuted.
     c) Copy Resume Link: Copies URL to clipboard with 2-second "Copied!" visual feedback.
   - Outside-click and `Escape` key to dismiss.
   - Also provide resume actions inside the mobile drawer.
4. **Resume Asset in `public/`**:
   - Ensure an authentic resume file `public/resume.pdf` exists. If not present, create a clean professional PDF file for Atul Kant Verma (with his profile data, certifications, 6 roles, and contact details).
5. **Scroll Progress Indicator Bar (`src/components/ScrollProgressBar.jsx`)**:
   - 2.5px micro gradient progress bar (`#FF4D6D` to `#FFAA00`) integrated along the bottom edge of the floating navbar capsule pill.
   - Dynamically and accurately tracks window scroll progress from 0% to 100% of the document using `requestAnimationFrame`, passive scroll listeners, and clamping between 0 and 100.
6. **Mobile Responsiveness & Overlay Management**:
   - Mobile drawer preserved with touch targets >= 32px-44px.
   - Mutual exclusivity of overlays (opening Search closes ribbon/drawer/dropdown; opening drawer closes search/ribbon).
7. **Verification**:
   - Run `npm run build` and `npx oxlint` to ensure 0 errors and 0 warnings.
8. **Changes Log Management**:
   - Update `changes_log/` per project standards (summary, entries, recent_10).
9. Report completion with exact build/lint output to `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_1\handoff.md`.


## 2026-10-15T19:37:19Z
[Message from 9522b3bb-6098-4f5c-958c-6c76dd567f20]
You are Worker 1 for Milestone 1 of the Navbar All-in-One Power Pack.
Your working directory is: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_1
Project root: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

You MUST read these files before starting:
1. ORIGINAL_REQUEST: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md (specifically Follow-up — 2026-10-15T19:22:48Z)
2. DISPATCH: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_1\DISPATCH.md
3. EXPLORER REPORTS:
   - Explorer 1 (Layout & Ordering): c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_p0_1\handoff.md
   - Explorer 2 (Command Palette & Search Catalog): c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_p0_2\handoff.md
   - Explorer 3 (Resume Dropdown, Confetti, Audio & Scroll Progress): c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_p0_3\handoff.md

Your tasks:
1. Implement `src/components/CommandPalette.jsx` with Cmd+K / Ctrl+K global keyboard shortcut, search catalog across sections, featured projects, and skills, ArrowUp/Down navigation, Enter smooth scroll without reload, Escape & backdrop click dismiss, and body scroll lock.
2. Update `src/components/Navbar.jsx` with dedicated Search button placed immediately before the cursor selector icon, ensuring strict rendering order:
   `[🔍 Search] -> [🦋 Cursor] -> [🔊 Sound] -> [📄 Resume]`.
3. Implement `src/components/ResumeDropdown.jsx` replacing the static `#contact` anchor on the coral Resume button, with 3 actions: View Online, Download PDF (with canvas-confetti burst & soundFX.playSparkle() chime), and Copy Resume Link with 'Copied!' feedback.
4. Ensure an authentic PDF file exists at `public/resume.pdf` for Atul Kant Verma (create one if missing).
5. Implement `src/components/ScrollProgressBar.jsx` (2.5px micro gradient #FF4D6D to #FFAA00) along the bottom edge of the floating navbar capsule pill tracking 0-100% window scroll.
6. Verify mobile drawer navigation and touch targets (>32-44px), including in-drawer search launchpad and resume actions.
7. Run `npm run build` and `npx oxlint` to ensure 0 errors and 0 warnings.
8. Update `changes_log/` per project standards.
9. Write complete handoff report to `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\worker_1\handoff.md` and notify parent via send_message.
