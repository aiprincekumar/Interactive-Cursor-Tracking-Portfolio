# Project: Navbar All-in-One Power Pack

## Architecture
- Floating Navbar (`src/components/Navbar.jsx`): Top sticky/fixed navigation bar with logo, desktop links, right actions, and mobile hamburger drawer.
- Search / Command Palette (`src/components/CommandPalette.jsx`): Global modal with search input, category groups (Sections, Projects, Skills), keyboard navigation (Cmd+K / Ctrl+K, Arrow keys, Enter, Esc), backdrop click-to-close.
- Resume Dropdown (`src/components/ResumeDropdown.jsx`): Dropdown button replacing static `#contact` anchor. 3 items: Preview/View Online, Download PDF (with canvas-confetti + sparkle audio chime), and Copy Link.
- Scroll Progress Bar (`src/components/ScrollProgressBar.jsx`): 2.5px micro gradient `#FF4D6D` to `#FFAA00` along bottom edge of navbar tracking `0%` to `100%` scroll progress.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Search Button & Action Ordering | Right action group strictly ordered: `[🔍 Search] -> [🦋 Cursor] -> [🔊 Sound] -> [📄 Resume]` | M1 | ORIGINAL_REQUEST §Follow-up R1 |
| 2 | Command Palette Modal (`Cmd+K`) | Search modal with backdrop blur, searchable index of sections, projects, and skills | M1 | ORIGINAL_REQUEST §Follow-up R1 |
| 3 | Command Palette Keyboard Nav | ArrowUp/Down to navigate, Enter to smooth-scroll without reload, Esc / backdrop click to dismiss | M1 | ORIGINAL_REQUEST §Follow-up R1 |
| 4 | Smart Resume Dropdown Trigger | Coral resume button toggles dropdown with outside-click & Escape dismissal | M1 | ORIGINAL_REQUEST §Follow-up R2 |
| 5 | Resume View Online Action | Opens/previews resume in a new tab or modal | M1 | ORIGINAL_REQUEST §Follow-up R2 |
| 6 | Resume Download PDF Action | Downloads PDF, triggers canvas-confetti burst and sparkle audio chime | M1 | ORIGINAL_REQUEST §Follow-up R2 |
| 7 | Resume Copy Link Action | Copies link to clipboard with brief "Copied!" feedback | M1 | ORIGINAL_REQUEST §Follow-up R2 |
| 8 | Scroll Progress Indicator Bar | 2.5px micro gradient bar (#FF4D6D -> #FFAA00) tracking 0-100% document scroll progress | M1 | ORIGINAL_REQUEST §Follow-up R3 |
| 9 | Mobile Responsiveness & A11y | Preserves mobile drawer, touch targets, and ARIA attributes | M1 | ORIGINAL_REQUEST §Follow-up AC |
| 10 | Build & Lint Cleanliness | `npm run build` and `npx oxlint` pass with zero errors | M1 | ORIGINAL_REQUEST §Follow-up AC |

## Milestones
| 1 | Navbar All-in-One Power Pack | Command Palette, Resume Dropdown, Confetti/Audio, Scroll Progress, Mobile UX, Build & Lint | none | DONE |

### Key Outputs & Verified Artifacts
- `src/utils/searchCatalog.js`: 27 indexed items across Sections, Projects, and Skills.
- `src/components/CommandPalette.jsx`: Global search modal (`Cmd+K`/`Ctrl+K`), ArrowUp/Down navigation, Enter smooth scroll, Escape & backdrop dismiss.
- `src/components/ResumeDropdown.jsx`: Resume dropdown with View Online, Download PDF (with confetti burst & sparkle audio chime), and Copy Link.
- `public/resume.pdf`: Authentic PDF 1.4 resume file for Atul Kant Verma.
- `src/components/ScrollProgressBar.jsx`: 2.5px micro gradient `#FF4D6D` to `#FFAA00` tracking 0-100% window scroll.
- `src/components/Navbar.jsx`: Right actions ordered strictly `[🔍 Search] -> [🦋 Cursor] -> [🔊 Sound] -> [📄 Resume] -> [☰ Menu]`.
- Build & Lint: `npm run build` succeeds (built in ~600ms), `npx oxlint` 0 warnings and 0 errors.


## Interface Contracts
### Navbar ↔ CommandPalette
- `isOpen`: boolean
- `onClose`: () => void
- Global keydown listener for `(e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'`
- Keyboard navigation: ArrowUp, ArrowDown, Enter, Escape

### Navbar ↔ ResumeDropdown
- `isSoundEnabled`: boolean (or sound audio play hook) to fire sparkle chime
- Triggers confetti via `canvas-confetti`
- Actions: Preview, Download, Copy Link

### Navbar ↔ ScrollProgressBar
- Listens to window scroll events (`scroll`, `resize`) with passive listener or requestAnimationFrame
- Updates width from `0%` to `100%` based on `window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)`

## Code Layout
- `src/components/Navbar.jsx`: Main navigation bar
- `src/components/CommandPalette.jsx`: Search modal component
- `src/components/ResumeDropdown.jsx`: Resume dropdown menu component
- `src/components/ScrollProgressBar.jsx`: Progress bar component
- `src/utils/` or `src/context/`: Audio effects or helper utilities if applicable
