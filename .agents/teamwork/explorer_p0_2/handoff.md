# Handoff Report: Explorer 2 — Command Palette Architecture & Search Catalog

**Agent**: explorer_p0_2  
**Date**: 2026-10-15T19:35:00Z  
**Milestone**: Milestone 1 — Navbar All-in-One Power Pack  
**Scope**: Section ID verification, search item compilation, and Command Palette component architecture design.

---

## 1. Observation

Direct code observations from the project workspace:

### 1.1 Section IDs & Layout Hierarchy (`src/App.jsx`)
In `src/App.jsx` (lines 103–161), the main document structure renders components in the following chronological sequence, each having a matching DOM ID and `scroll-mt-28` anchor offset:

| Component | Target File & Exact Line | Rendered ID | Offset Class |
|---|---|---|---|
| `HeroSection` | `src/components/HeroSection.jsx:518` | `id="hero"` | Default hero padding |
| `AboutSection` | `src/components/AboutSection.jsx:6` | `id="about"` | `scroll-mt-28` |
| `SkillsSection` | `src/components/SkillsSection.jsx:182` | `id="skills"` | `scroll-mt-28` |
| `ExperienceSection` | `src/components/ExperienceSection.jsx:68` | `id="experience"` | `scroll-mt-28` |
| `ProjectsSection` | `src/components/ProjectsSection.jsx:66` | `id="projects"` | `scroll-mt-28` |
| `CodingAchievementsSection` | `src/components/CodingAchievementsSection.jsx:51` | `id="achievements"` | `scroll-mt-28` |
| `CameraRollGallery` | `src/components/CameraRollGallery.jsx:71` | `id="gallery"` | `scroll-mt-28` |
| `InteractivePlayground` | `src/components/InteractivePlayground.jsx:20` | `id="playground"` | `scroll-mt-28` |
| `ContactSection` | `src/components/ContactSection.jsx:87` | `id="contact"` | `scroll-mt-28` |

In `src/components/Navbar.jsx` (lines 51–61), `navLinks` defines these exact targets:
```javascript
const navLinks = [
  { label: 'Home', href: '#hero', id: 'hero' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Experience', href: '#experience', id: 'experience' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Achievements', href: '#achievements', id: 'achievements' },
  { label: 'Gallery', href: '#gallery', id: 'gallery' },
  { label: 'Lab', href: '#playground', id: 'playground' },
  { label: 'Contact', href: '#contact', id: 'contact' }
];
```

### 1.2 Featured Projects Data (`src/components/ProjectsSection.jsx`)
Direct inspection of `src/components/ProjectsSection.jsx`:
- **Project 01 (Flagship, lines 95–254)**:
  - Title: `PolicyGuard AI`
  - Subtitle: `Enterprise Regulatory & Compliance Audit Engine`
  - Tags: `React 19`, `FastAPI / Python`, `LangChain`, `PostgreSQL`, `Docker`, `AWS Bedrock`
  - Resume mapping alias: `GST & Income Tax Compliance & Verification Engine` (interactive audit simulator)
- **Project 02 (Flagship, lines 257–413)**:
  - Title: `Payment Gateway System`
  - Subtitle: `Full-Stack Distributed Transaction Architecture`
  - Tags: `Node.js`, `PostgreSQL`, `Redis`, `Docker`, `Stripe API`, `RabbitMQ`
  - Resume mapping alias: `Tally Financial Accounting & Inventory Management` (state machine)
- **Project 03 (Companion, lines 6–21)**:
  - Title: `ChromaCanvas Studio`
  - Subtitle: `GPU-Accelerated WebGL Shader & Particle Playground`
  - Category: `Creative Tech & Shaders`
  - Tags: `WebGL`, `Three.js`, `GLSL`, `Web Audio API`, `React 19`
- **Project 04 (Companion, lines 23–36)**:
  - Title: `Aetheria Design System`
  - Subtitle: `High-Performance Minimalist Component Library`
  - Category: `Design Systems & Core UI`
  - Tags: `Tailwind CSS v4`, `TypeScript`, `Radix UI`, `Framer Motion`

### 1.3 Skills Data (`src/components/SkillsSection.jsx`)
In `src/components/SkillsSection.jsx` (lines 4–175), skills are categorized into 4 groups:
- **Languages**: `Java` (95%), `Python` (92%), `C` (88%), `C++` (90%)
- **Frontend**: `React` (96%), `HTML` (98%), `CSS` (96%), `JavaScript` (96%), `Tailwind CSS` (98%)
- **Backend**: `Node.js` (92%), `PostgreSQL` (94%)
- **Tools & Cloud**: `AWS` (88%), `Docker` (90%), `Git` (95%)
- Plus authentic domain skills from user profile: `Tally ERP/Prime`, `GST E-Filing & Compliance`, `Income Tax E-Filing`, `Advanced MS Excel / MIS`.

### 1.4 Navbar Right Actions Current Layout (`src/components/Navbar.jsx`)
In `src/components/Navbar.jsx` (lines 142–213), the right action group currently contains:
1. Dynamic Cursor Variant Toggle Button (`lines 144–168`)
2. Audio Toggle Button (`lines 171–188`)
3. Coral Resume Pill Button (`lines 191–198`)
4. Mobile Menu Hamburger Toggle (`lines 200–212`)

Inserting the Search Button immediately before the Cursor button establishes the strict order required by specification R1:
`[🔍 Search] -> [🦋 Cursor] -> [🔊 Sound] -> [📄 Resume]`.

---

## 2. Logic Chain

1. **Section Reachability**:
   - Because all target sections have distinct `id` attributes and `scroll-mt-28` offsets (Obs 1.1), calling `document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })` smoothly navigates to the section without obscuring section titles beneath the floating navbar.
   - Because smooth scrolling must not trigger a full browser reload or hash collision that interrupts WebGL/audio state, handling navigation through DOM `scrollIntoView` and programmatic event dismissal is the safest implementation.

2. **Search Recall & UX**:
   - Users might search by generic intent ("about", "contact", "pricing"), specific technology ("react", "python", "tally", "postgres"), or project name ("policyguard", "payment", "canvas").
   - By creating a normalized search catalog containing `title`, `description`, `category`, and multi-token `keywords`, a single filter pass can match any relevant keyword with instant (<2ms) execution.

3. **Accessibility & Keyboard Ergonomics**:
   - `Cmd+K` (macOS) and `Ctrl+K` (Windows/Linux) are the established standard for Command Palettes across developer applications.
   - Capturing `(e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'` on `window` guarantees discovery from anywhere on the page.
   - Auto-focusing the search input on open and managing ArrowUp / ArrowDown index cycling ensures keyboard-first navigation.
   - Pressing `Escape` or clicking the backdrop gracefully restores normal page interaction.

---

## 3. Caveats

1. **Body Scroll Lock**:
   - When the modal opens, disabling page scroll (`document.body.style.overflow = 'hidden'`) prevents background scrolling while navigating results. The cleanup function must restore the previous overflow value on unmount/close to avoid locking the page.
2. **Audio Feedback**:
   - Audio clicks (`soundFX.playFocusBeep()`) should only fire if `soundEnabled` is true (which is internally checked by `soundFX.enabled` in `src/utils/audio.js`).
3. **No Caveats** for section ID availability: All 9 sections exist and are mounted in `src/App.jsx`.

---

## 4. Conclusion & Proposed Architecture

### 4.1 Search Catalog (`src/utils/searchCatalog.js` or inline in `CommandPalette.jsx`)

```javascript
export const SEARCH_ITEMS = [
  // --- SECTIONS ---
  {
    id: 'sec-hero',
    title: 'Home / Hero',
    category: 'Sections',
    targetId: 'hero',
    badge: 'Section',
    description: 'Interactive 2.5D cursor-tracking character hero with photo capture',
    keywords: 'hero home top header cursor tracking 2.5d avatar camera photo'
  },
  {
    id: 'sec-about',
    title: 'About / Who I Am',
    category: 'Sections',
    targetId: 'about',
    badge: 'Section',
    description: 'Personal narrative, professional background & education in Daltonganj',
    keywords: 'about me story education who i am background biography adca'
  },
  {
    id: 'sec-skills',
    title: 'Skills & Technologies',
    category: 'Sections',
    targetId: 'skills',
    badge: 'Section',
    description: 'Categorized technology stack, proficiency metrics & certifications',
    keywords: 'skills tech languages frontend backend tools stack proficiency'
  },
  {
    id: 'sec-experience',
    title: 'Journey & Experience',
    category: 'Sections',
    targetId: 'experience',
    badge: 'Section',
    description: 'Career trajectory, accounting roles, MIS operations & deliverables',
    keywords: 'experience work jobs career history timeline trajectory roles gst tally mis'
  },
  {
    id: 'sec-projects',
    title: 'Selected Work / Projects',
    category: 'Sections',
    targetId: 'projects',
    badge: 'Section',
    description: 'Curated engineering case studies, interactive mockups & architecture',
    keywords: 'projects work case studies policyguard payment gateway state machine'
  },
  {
    id: 'sec-achievements',
    title: 'Coding Records & Milestones',
    category: 'Sections',
    targetId: 'achievements',
    badge: 'Section',
    description: 'Competitive programming records, problem solving stats & milestones',
    keywords: 'achievements leetcode codechef hackerrank geeksforgeeks coding milestones stats'
  },
  {
    id: 'sec-gallery',
    title: 'Polaroid Studio / Gallery',
    category: 'Sections',
    targetId: 'gallery',
    badge: 'Section',
    description: 'Camera roll memories, snapshot cards & interactive stickers',
    keywords: 'gallery polaroid photos camera roll memories snapshots studio pictures'
  },
  {
    id: 'sec-playground',
    title: 'Physics Lab / Cursor Tuner',
    category: 'Sections',
    targetId: 'playground',
    badge: 'Section',
    description: 'Real-time cursor kinematics, particle speed & spring physics tuner',
    keywords: 'lab playground physics tuner butterfly speed trail scale controls'
  },
  {
    id: 'sec-contact',
    title: 'Get In Touch / Contact',
    category: 'Sections',
    targetId: 'contact',
    badge: 'Section',
    description: 'Direct inquiry form, phone (+91-7004149900), email & location',
    keywords: 'contact get in touch email phone location message hire form inquiry'
  },

  // --- PROJECTS ---
  {
    id: 'proj-01',
    title: 'PolicyGuard AI / Compliance Engine',
    category: 'Projects',
    targetId: 'projects',
    badge: '01 Flagship',
    description: 'Enterprise regulatory compliance & audit verification engine with live scanner',
    keywords: 'policyguard ai regulatory compliance audit engine nlp tax gst verification claude'
  },
  {
    id: 'proj-02',
    title: 'Payment Gateway / State Machine',
    category: 'Projects',
    targetId: 'projects',
    badge: '02 Flagship',
    description: 'Distributed transaction architecture with interactive state machine & idempotency',
    keywords: 'payment gateway state machine idempotency transactions stripe tally financial inventory'
  },
  {
    id: 'proj-03',
    title: 'ChromaCanvas Studio',
    category: 'Projects',
    targetId: 'projects',
    badge: '03 Creative Tech',
    description: 'GPU-accelerated WebGL shader & 250k particle playground with audio reactivity',
    keywords: 'chromacanvas webgl three.js glsl shaders particles audio reactive'
  },
  {
    id: 'proj-04',
    title: 'Aetheria Design System',
    category: 'Projects',
    targetId: 'projects',
    badge: '04 Design System',
    description: 'High-performance minimalist component library with Tailwind v4 & spring physics',
    keywords: 'aetheria design system radix ui components tailwind framer motion'
  },

  // --- SKILLS & TOOLS ---
  {
    id: 'skill-react',
    title: 'React 19',
    category: 'Skills',
    targetId: 'skills',
    badge: 'Frontend (96%)',
    description: 'Modern UI, Server Components, Actions & 120 FPS cursor kinematics',
    keywords: 'react react19 frontend hooks jsx web components virtual dom'
  },
  {
    id: 'skill-python',
    title: 'Python',
    category: 'Skills',
    targetId: 'skills',
    badge: 'AI & Backend (92%)',
    description: 'FastAPI microservices, LangChain, Document Intelligence & data pipelines',
    keywords: 'python fastapi ml ai langchain pandas microservices'
  },
  {
    id: 'skill-java',
    title: 'Java',
    category: 'Skills',
    targetId: 'skills',
    badge: 'Languages (95%)',
    description: 'OOP, multithreading, concurrent architectures & JVM performance tuning',
    keywords: 'java oop backend dsa algorithms spring jvm multithreading'
  },
  {
    id: 'skill-cplusplus',
    title: 'C / C++',
    category: 'Skills',
    targetId: 'skills',
    badge: 'Languages (90%)',
    description: 'Systems programming, STL containers, low-level memory & competitive coding',
    keywords: 'c c++ stl memory systems competitive programming pointers'
  },
  {
    id: 'skill-tailwind',
    title: 'Tailwind CSS v4',
    category: 'Skills',
    targetId: 'skills',
    badge: 'Frontend (98%)',
    description: 'Zero-runtime design tokens, responsive layouts & modern styling',
    keywords: 'tailwind css styling responsive design tokens glassmorphism'
  },
  {
    id: 'skill-node',
    title: 'Node.js',
    category: 'Skills',
    targetId: 'skills',
    badge: 'Backend (92%)',
    description: 'Event-driven server microservices, Express, WebSockets & streams',
    keywords: 'node nodejs backend express server api event loop'
  },
  {
    id: 'skill-postgres',
    title: 'PostgreSQL',
    category: 'Skills',
    targetId: 'skills',
    badge: 'Backend (94%)',
    description: 'ACID relational database, row-level locks & b-tree indexing',
    keywords: 'postgresql postgres sql db database acid relational'
  },
  {
    id: 'skill-aws',
    title: 'AWS & Cloud',
    category: 'Skills',
    targetId: 'skills',
    badge: 'Cloud (88%)',
    description: 'EC2, S3, RDS PostgreSQL & AWS Bedrock foundation model integrations',
    keywords: 'aws cloud amazon bedrock s3 ec2 devops lambda'
  },
  {
    id: 'skill-docker',
    title: 'Docker',
    category: 'Skills',
    targetId: 'skills',
    badge: 'DevOps (90%)',
    description: 'Multi-stage container builds & Docker Compose microservices orchestration',
    keywords: 'docker containers devops compose images virtualization'
  },
  {
    id: 'skill-git',
    title: 'Git & GitHub',
    category: 'Skills',
    targetId: 'skills',
    badge: 'DevOps (95%)',
    description: 'Version control, interactive rebasing & GitHub Actions CI/CD workflows',
    keywords: 'git github actions version control vcs ci cd workflow'
  },
  {
    id: 'skill-tally',
    title: 'Tally ERP / Prime',
    category: 'Skills',
    targetId: 'skills',
    badge: 'Accounting',
    description: 'Comprehensive financial accounting, inventory ledgers & balance sheets',
    keywords: 'tally prime erp accounting vouchers balance sheet ledgers finance'
  },
  {
    id: 'skill-gst',
    title: 'GST & Income Tax E-Filing',
    category: 'Skills',
    targetId: 'skills',
    badge: 'Compliance',
    description: 'GST compliance, reconciliation, ITR e-filing & regulatory audit verification',
    keywords: 'gst income tax e-filing itr returns reconciliation audit compliance'
  },
  {
    id: 'skill-excel',
    title: 'Advanced MS Excel & MIS',
    category: 'Skills',
    targetId: 'skills',
    badge: 'Productivity',
    description: 'VLOOKUP, Pivot Tables, MIS trainee analytics & DAY-NULM reporting',
    keywords: 'excel ms office word powerpoint mis reporting analytics vlookup'
  }
];
```

### 4.2 Component Specification: `CommandPalette.jsx`

```jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ArrowRight, CornerDownLeft, FileText, Layers, FolderGit2, Compass, SearchX } from 'lucide-react';
import { soundFX } from '../utils/audio';
import { SEARCH_ITEMS } from '../utils/searchCatalog'; // or inline

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const itemRefs = useRef([]);

  // Auto-focus and reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 40);

      // Lock body scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_ITEMS;
    const tokens = q.split(/\s+/).filter(Boolean);
    return SEARCH_ITEMS.filter((item) => {
      const searchTarget = `${item.title} ${item.description} ${item.category} ${item.keywords}`.toLowerCase();
      return tokens.every((token) => searchTarget.includes(token));
    });
  }, [query]);

  // Reset selectedIndex if bounds change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll active item into view within modal
  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex].scrollIntoView({
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [selectedIndex]);

  // Select target handler
  const handleSelect = (item) => {
    if (!item) return;
    onClose();
    soundFX.playFocusBeep();
    const target = document.getElementById(item.targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Keyboard navigation within modal
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredItems.length === 0 ? 0 : (prev + 1) % filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredItems.length === 0 ? 0 : (prev - 1 + filteredItems.length) % filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette Search"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#FAF8F5] rounded-2xl border border-[#E7E2D8] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E7E2D8] bg-white gap-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, section, project, or skill..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-[#18181B] placeholder-stone-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-[#18181B] hover:bg-stone-100 transition-colors"
            aria-label="Close command palette"
          >
            <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200">ESC</span>
          </button>
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2 space-y-1 divide-y divide-stone-100/50">
          {filteredItems.length === 0 ? (
            <div className="py-12 px-6 text-center text-stone-500">
              <SearchX className="w-10 h-10 mx-auto text-stone-300 mb-2" />
              <p className="text-sm font-bold text-stone-700">No results found for "{query}"</p>
              <p className="text-xs text-stone-400 mt-1">Try searching for "Projects", "React", "Tally", "About", or "Contact"</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  ref={(el) => (itemRefs.current[idx] = el)}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer select-none ${
                    isSelected
                      ? 'bg-[#18181B] text-white shadow-xs scale-[1.01]'
                      : 'hover:bg-white text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                        isSelected
                          ? 'bg-stone-800 border-stone-700 text-[#FF4D6D]'
                          : 'bg-white border-[#E7E2D8] text-stone-500 group-hover:text-[#FF4D6D]'
                      }`}
                    >
                      {item.category === 'Sections' && <Compass className="w-4 h-4" />}
                      {item.category === 'Projects' && <FolderGit2 className="w-4 h-4" />}
                      {item.category === 'Skills' && <Layers className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold tracking-tight truncate">
                          {item.title}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                            isSelected
                              ? 'bg-[#FF4D6D] text-white'
                              : 'bg-stone-200/70 text-stone-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <p
                        className={`text-[11px] truncate mt-0.5 ${
                          isSelected ? 'text-stone-300' : 'text-stone-500'
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-3">
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-stone-300 bg-stone-800 px-2 py-0.5 rounded-md">
                        <span>Go</span>
                        <CornerDownLeft className="w-3 h-3 text-[#FF4D6D]" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Keyboard Hints */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#E7E2D8] bg-[#FAF8F5] text-[11px] font-mono text-stone-500 select-none">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-200 shadow-2xs">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-200 shadow-2xs">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-200 shadow-2xs">↵</kbd> Select
            </span>
          </div>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-200 shadow-2xs">esc</kbd> Dismiss
          </span>
        </div>
      </div>
    </div>
  );
}
```

### 4.3 Navbar Integration Blueprint (`src/components/Navbar.jsx`)

1. **Global Keyboard Listener in `Navbar.jsx`**:
```javascript
const [isSearchOpen, setIsSearchOpen] = useState(false);

useEffect(() => {
  const handleGlobalKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      setIsSearchOpen((prev) => !prev);
      soundFX.playFocusBeep();
    }
  };
  window.addEventListener('keydown', handleGlobalKeyDown);
  return () => window.removeEventListener('keydown', handleGlobalKeyDown);
}, []);
```

2. **Dedicated Search Button in Right Actions**:
Immediately before the Cursor selector button in `Navbar.jsx`:
```jsx
{/* Search Button with ⌘K Badge */}
<button
  type="button"
  onClick={() => {
    setIsSearchOpen(true);
    soundFX.playFocusBeep();
  }}
  aria-label="Open Search Command Palette (Cmd+K)"
  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-[#18181B] border border-[#E7E2D8] hover:border-stone-300 shadow-2xs hover:scale-105 transition-all duration-200 cursor-pointer"
  title="Quick Search (⌘K / Ctrl+K)"
>
  <Search className="w-3.5 h-3.5 text-stone-600" />
  <span className="hidden md:inline text-xs font-semibold text-stone-600">Search</span>
  <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#FAF8F5] text-stone-500 rounded border border-[#E7E2D8]">
    ⌘K
  </kbd>
</button>
```

3. **Strict Right Action Group Ordering**:
`[🔍 Search] -> [🦋 Cursor] -> [🔊 Sound] -> [📄 Resume]`.

---

## 5. Verification Method

To verify these specifications and the future implementation:

1. **Verify Section IDs exist**:
   Execute grep search for each anchor ID across `src/components/`:
   - `id="hero"` in `HeroSection.jsx`
   - `id="about"` in `AboutSection.jsx`
   - `id="skills"` in `SkillsSection.jsx`
   - `id="experience"` in `ExperienceSection.jsx`
   - `id="projects"` in `ProjectsSection.jsx`
   - `id="achievements"` in `CodingAchievementsSection.jsx`
   - `id="gallery"` in `CameraRollGallery.jsx`
   - `id="playground"` in `InteractivePlayground.jsx`
   - `id="contact"` in `ContactSection.jsx`

2. **Check build & lint compatibility**:
   - `npm run build`
   - `npx oxlint`
   Ensure no unused imports or syntax issues arise.

3. **Runtime Interactive Checks**:
   - Press `Cmd+K` or `Ctrl+K`: Command Palette modal appears with auto-focused input.
   - Type "policyguard" -> ArrowDown -> Enter: Window smoothly scrolls to `#projects` without reload.
   - Type "tally" -> Enter: Window smoothly scrolls to `#skills` or `#projects`.
   - Press `Escape`: Modal dismisses smoothly and keyboard focus returns to page.
   - Click backdrop: Modal closes.
