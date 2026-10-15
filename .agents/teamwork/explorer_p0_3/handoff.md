# Investigation & Architecture Report: Resume Dropdown, Confetti, Audio & Scroll Progress

**Explorer**: Explorer 3  
**Working Directory**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_p0_3`  
**Milestone**: Milestone 1 — Navbar All-in-One Power Pack  
**Date**: 2026-10-15T19:38:00Z  

---

## 1. Observation

### Observation 1.1: `package.json` and `canvas-confetti`
- **File**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\package.json`
- **Lines 14–19**:
  ```json
  "dependencies": {
    "canvas-confetti": "^1.9.4",
    "lucide-react": "^1.54.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8"
  }
  ```
- **Finding**: `canvas-confetti` version `^1.9.4` is **already installed** in `dependencies`. No `npm install` command is required.
- **Existing Usage in Project**:
  - In `src/components/HeroSection.jsx:5`: `import confetti from 'canvas-confetti';`
  - In `src/components/HeroSection.jsx:463–468`:
    ```javascript
    confetti({
      particleCount: 32,
      spread: 65,
      origin: { y: 0.55 },
      colors: ['#FF3F6C', '#FFAA00', '#FFF0F3', '#FFD1DC', '#FFE4E8']
    });
    ```
  - This demonstrates that `canvas-confetti` works with Vite and React 19 in production without bundler issues.

### Observation 1.2: Audio Sound System in `src/`
- **File**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\src\utils\audio.js`
- **Lines 1–9**:
  ```javascript
  // Web Audio API Synthesizer for Camera Shutter and Micro-interactions
  // Requires no external audio files and loads instantly with zero latency.
  class SoundFX {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.enabled = true;
    }
  ```
- **Lines 127–148 (`playSparkle()`)**:
  ```javascript
  playSparkle() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    this.triggerHaptic([5, 20, 10]);

    const t = this.ctx.currentTime;
    [1046, 1318, 1567, 2093].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = t + idx * 0.04;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.05, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(startTime);
      osc.stop(startTime + 0.12);
    });
  }
  ```
- **Lines 243**: `export const soundFX = new SoundFX();`
- **Finding**: The audio sound system is entirely synthesized via Web Audio API. Zero external `.mp3` or `.wav` files are required. `soundFX.playSparkle()` already provides an ascending 4-tone sparkle chime (`C6 = 1046Hz, E6 = 1318Hz, G6 = 1567Hz, C7 = 2093Hz`) synchronized with haptic feedback (`[5, 20, 10]`). It respects `this.enabled`.

### Observation 1.3: Audio State in `App.jsx` and `Navbar.jsx`
- In `src/App.jsx:21`: `const [soundEnabled, setSoundEnabled] = useState(true);`
- In `src/App.jsx:96–97`: Passed into `<Navbar soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} ... />`
- In `src/components/Navbar.jsx:170–188`:
  ```jsx
  <button
    type="button"
    onClick={() => {
      const next = !soundEnabled;
      setSoundEnabled(next);
      soundFX.setEnabled(next);
      if (next) soundFX.playSparkle();
    }} ...>
  ```
- **Finding**: Calling `if (soundEnabled) soundFX.playSparkle();` (or `soundFX.playSparkle()`) in any child component will automatically play the chime when unmuted and remain silent when muted.

### Observation 1.4: Existing Coral Resume Button in `Navbar.jsx`
- **File**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\src\components\Navbar.jsx`
- **Lines 191–197**:
  ```jsx
  {/* Reel element: Coral Resume Pill Button */}
  <a
    href="#contact"
    className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF4D6D] hover:bg-[#E03554] text-white text-xs font-bold shadow-xs transition-all duration-200 active:scale-95 whitespace-nowrap shrink-0"
  >
    <FileText className="w-3.5 h-3.5" />
    Resume
  </a>
  ```
- **Finding**: The current Resume button is a static anchor tag (`<a href="#contact">`) hidden on viewports smaller than `lg:` (`hidden lg:flex`). It needs to be replaced with a component (`ResumeDropdown.jsx`) that supports desktop dropdown toggling and mobile menu drawer integration.

### Observation 1.5: Floating Navbar Container in `Navbar.jsx`
- **File**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\src\components\Navbar.jsx`
- **Lines 103–104**:
  ```jsx
  <header ref={navContainerRef} className="fixed top-0 left-0 right-0 z-40 px-3 md:px-8 py-3.5">
    <div className="max-w-6xl mx-auto bg-[#FAF8F5]/90 backdrop-blur-md rounded-full border border-[#E7E2D8] px-3 sm:px-4 md:px-5 py-2 shadow-xs flex items-center justify-between">
  ```
- **Finding**: The visible navbar is a floating pill container (`max-w-6xl mx-auto rounded-full`). By adding `relative overflow-hidden` to this inner pill, the `ScrollProgressBar.jsx` can sit at `absolute bottom-0 left-0 right-0 h-[2.5px]` and smoothly trace the bottom edge of the navbar pill.

### Observation 1.6: Build and Lint Validation
- **Command**: `npx oxlint`
  - Result: `Found 0 warnings and 0 errors. Finished in 67ms on 31 files with 104 rules using 6 threads.`
- **Command**: `npm run build`
  - Result: `✓ built in 598ms (dist/index.html 2.65 kB, dist/assets/index-*.js 489.93 kB). Exit code 0.`

---

## 2. Logic Chain

```
[Observation 1.1: canvas-confetti ^1.9.4 installed & used in HeroSection]
       │
       ▼
(Step 1: Can directly import `confetti from 'canvas-confetti'` in ResumeDropdown.jsx; no new package or dynamic CDN script needed.)

[Observation 1.2 & 1.3: soundFX.playSparkle() ready in audio.js + soundEnabled state in Navbar]
       │
       ▼
(Step 2: When "Download PDF" is clicked, invoke `soundFX.playSparkle()` directly. If soundEnabled is true, audio chime plays with synchronized haptics.)

[Observation 1.4: Navbar.jsx lines 191-197 static anchor <a href="#contact">]
       │
       ▼
(Step 3: Extract Resume trigger into `src/components/ResumeDropdown.jsx`. Maintain the coral pill visual identity [#FF4D6D], add ChevronDown, and provide a toggleable menu with 3 discrete actions: View Online, Download PDF, Copy Resume Link.)

[Observation 1.5: Floating Navbar pill structure with max-w-6xl rounded-full]
       │
       ▼
(Step 4: Create `src/components/ScrollProgressBar.jsx`. Compute window scroll percentage via requestAnimationFrame listener with passive: true. Place bar at absolute bottom-0 left-0 right-0 of navbar container.)

[Observation 1.6: Build & Oxlint 100% clean]
       │
       ▼
(Step 5: Ensure strict type hygiene, no unused variables, clean event cleanup in useEffect return callbacks, and full accessibility attributes.)
```

---

## 3. Caveats

1. **Resume PDF File Location**:
   - Currently, there is no physical `resume.pdf` file in `public/`.
   - The Download action should initiate a download of `/resume.pdf` (or `public/assets/Atul_Verma_Resume.pdf`). The implementer should ensure a clean, authentic `resume.pdf` is placed in `public/`.
   - In `ResumeDropdown.jsx`, we will also implement a graceful fallback: if the file is downloaded or opened in a new tab, it points to `/resume.pdf` with ATS-friendly filename `Atul_Kant_Verma_Resume.pdf`. Additionally, an optional online preview modal or tab target (`_blank`) is provided.
2. **Confetti Origin on Different Viewports**:
   - The confetti burst looks best when originating near the Resume button. On desktop viewports (`>= 1024px`), the button sits around `x: 0.82, y: 0.2`. Using the button's `getBoundingClientRect()` provides pixel-perfect origin coordinates, falling back to `{ x: 0.82, y: 0.2 }` if unmeasured.
3. **Accessibility (Reduced Motion)**:
   - For users with `prefers-reduced-motion: reduce`, confetti bursts should be suppressed or simplified (`disableForReducedMotion: true` in `canvas-confetti`).
4. **macOS / iOS Rubber-Banding**:
   - On iOS or macOS Safari, negative scroll offsets (`scrollY < 0`) or bounce past document bottom can cause scroll percentages `< 0%` or `> 100%`. The calculation must strictly clamp values: `Math.min(100, Math.max(0, calculated))`.

---

## 4. Conclusion & Technical Blueprints

### Blueprint A: `src/components/ResumeDropdown.jsx`

```jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FileText, Eye, Download, Copy, Check, ChevronDown, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/audio';

export default function ResumeDropdown({ soundEnabled = true, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Resume configuration
  const RESUME_FILE_PATH = '/resume.pdf';
  const DOWNLOAD_FILENAME = 'Atul_Kant_Verma_Resume.pdf';

  // Outside click & Escape key listeners
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Trigger celebratory confetti burst
  const triggerConfetti = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let originX = 0.82;
    let originY = 0.2;

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      originX = (rect.left + rect.width / 2) / window.innerWidth;
      originY = rect.bottom / window.innerHeight;
    }

    confetti({
      particleCount: 45,
      spread: 60,
      origin: { x: originX, y: originY },
      colors: ['#FF4D6D', '#FFAA00', '#2EC4B6', '#FF85A1', '#FFD166'],
      ticks: 180,
      gravity: 1.1,
      scalar: 0.9,
      disableForReducedMotion: true
    });
  }, []);

  // Action 1: View Online / Preview
  const handleViewOnline = (e) => {
    e.stopPropagation();
    if (soundEnabled) soundFX.playFocusBeep();
    setIsOpen(false);
    window.open(RESUME_FILE_PATH, '_blank', 'noopener,noreferrer');
  };

  // Action 2: Download PDF with confetti burst & sparkle chime
  const handleDownloadPdf = (e) => {
    e.stopPropagation();
    // Confetti celebration
    triggerConfetti();

    // Sparkle chime
    if (soundEnabled) {
      soundFX.playSparkle();
    }

    // Trigger download
    const link = document.createElement('a');
    link.href = RESUME_FILE_PATH;
    link.download = DOWNLOAD_FILENAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsOpen(false);
  };

  // Action 3: Copy Resume Link with 'Copied!' toast
  const handleCopyLink = async (e) => {
    e.stopPropagation();
    const fullResumeUrl = `${window.location.origin}${RESUME_FILE_PATH}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullResumeUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = fullResumeUrl;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setCopied(true);
      if (soundEnabled) soundFX.playFocusBeep();

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Coral Resume Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          const next = !isOpen;
          setIsOpen(next);
          if (soundEnabled) soundFX.playFocusBeep();
        }}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Resume actions"
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF4D6D] hover:bg-[#E03554] text-white text-xs font-bold shadow-xs transition-all duration-200 active:scale-95 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2"
      >
        <FileText className="w-3.5 h-3.5" />
        <span>Resume</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>

      {/* Dropdown Menu Card */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2.5 w-60 origin-top-right bg-[#FAF8F5]/98 backdrop-blur-xl rounded-2xl border border-[#E7E2D8] p-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 focus:outline-hidden"
        >
          {/* Header Label */}
          <div className="px-3 py-1.5 text-[10px] font-bold text-stone-600 uppercase tracking-wider border-b border-[#E7E2D8]/60 mb-1">
            Atul Kant Verma &bull; Resume
          </div>

          {/* Action 1: View Online */}
          <button
            type="button"
            role="menuitem"
            onClick={handleViewOnline}
            className="w-full flex items-center justify-between px-3 py-2 text-left rounded-xl text-xs font-semibold text-stone-700 hover:text-[#18181B] hover:bg-white transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded-lg bg-stone-100 text-stone-600 group-hover:bg-[#FF4D6D]/10 group-hover:text-[#FF4D6D] transition-colors">
                <Eye className="w-3.5 h-3.5" />
              </span>
              <div>
                <p className="font-bold text-[#18181B]">View Online</p>
                <p className="text-[10px] text-stone-600">Open in new tab</p>
              </div>
            </div>
            <ExternalLink className="w-3 h-3 text-stone-600 group-hover:text-stone-600 transition-colors" />
          </button>

          {/* Action 2: Download PDF (Confetti + Chime) */}
          <button
            type="button"
            role="menuitem"
            onClick={handleDownloadPdf}
            className="w-full flex items-center justify-between px-3 py-2 text-left rounded-xl text-xs font-semibold text-stone-700 hover:text-[#18181B] hover:bg-white transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded-lg bg-rose-50 text-[#FF4D6D] group-hover:bg-[#FF4D6D] group-hover:text-white transition-colors">
                <Download className="w-3.5 h-3.5" />
              </span>
              <div>
                <p className="font-bold text-[#18181B]">Download PDF</p>
                <p className="text-[10px] text-stone-600">Confetti celebration</p>
              </div>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-rose-100 text-[#FF4D6D] font-bold">
              PDF
            </span>
          </button>

          {/* Action 3: Copy Resume Link */}
          <button
            type="button"
            role="menuitem"
            onClick={handleCopyLink}
            className="w-full flex items-center justify-between px-3 py-2 text-left rounded-xl text-xs font-semibold text-stone-700 hover:text-[#18181B] hover:bg-white transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`p-1 rounded-lg transition-colors ${
                  copied
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-stone-100 text-stone-600 group-hover:bg-[#FF4D6D]/10 group-hover:text-[#FF4D6D]'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </span>
              <div>
                <p className="font-bold text-[#18181B]">
                  {copied ? 'Link Copied!' : 'Copy Link'}
                </p>
                <p className="text-[10px] text-stone-600">
                  {copied ? 'Ready to share' : 'Direct link to clipboard'}
                </p>
              </div>
            </div>
            {copied && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 animate-in fade-in">
                Copied!
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
```

---

### Blueprint B: `src/components/ScrollProgressBar.jsx`

```jsx
import React, { useState, useEffect } from 'react';

export default function ScrollProgressBar({ className = '' }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const calculateScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
      const innerHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      const maxScroll = scrollHeight - innerHeight;

      if (maxScroll <= 0) {
        setScrollProgress(0);
      } else {
        const percentage = (scrollY / maxScroll) * 100;
        // Strictly clamp between 0% and 100% to handle rubber-banding / bounce
        const clamped = Math.min(100, Math.max(0, percentage));
        setScrollProgress(clamped);
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(calculateScroll);
        ticking = true;
      }
    };

    // Initial calculation
    calculateScroll();

    // Passive event listeners for optimal 60-120fps scrolling performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`absolute bottom-0 left-0 right-0 h-[2.5px] pointer-events-none overflow-hidden z-20 ${className}`}
    >
      <div
        className="h-full bg-gradient-to-r from-[#FF4D6D] to-[#FFAA00] transition-[width] duration-75 ease-out will-change-[width]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
```

---

### Blueprint C: Integration into `src/components/Navbar.jsx`

#### 1. Import statements:
```javascript
import ResumeDropdown from './ResumeDropdown';
import ScrollProgressBar from './ScrollProgressBar';
import { Search } from 'lucide-react'; // For the Search button
```

#### 2. Navbar Inner Floating Container Update:
Add `relative overflow-hidden` to the inner pill `div`:
```jsx
<div className="relative max-w-6xl mx-auto bg-[#FAF8F5]/90 backdrop-blur-md rounded-full border border-[#E7E2D8] px-3 sm:px-4 md:px-5 py-2 shadow-xs flex items-center justify-between overflow-hidden">
  {/* Brand Logo */}
  ...
  {/* Desktop Nav Links */}
  ...
  {/* Right Action Buttons */}
  <div className="flex items-center gap-1.5 sm:gap-2.5">
    {/* 1. [🔍 Search] Button */}
    <button
      type="button"
      onClick={() => onOpenCommandPalette?.()}
      aria-label="Search portfolio (Cmd+K)"
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-[#18181B] border border-[#E7E2D8] hover:border-stone-300 shadow-2xs hover:scale-105 transition-all text-xs font-semibold cursor-pointer"
      title="Search (⌘K)"
    >
      <Search className="w-3.5 h-3.5 text-stone-600" />
      <span className="hidden sm:inline text-[11px] text-stone-500 font-mono bg-stone-100 border border-stone-200 px-1 py-0.5 rounded">
        ⌘K
      </span>
    </button>

    {/* 2. [🦋 Cursor] Variant Selector Button */}
    ... existing cursor button ...

    {/* 3. [🔊 Sound] Audio Toggle Button */}
    ... existing sound button ...

    {/* 4. [📄 Resume] Dropdown Menu Component */}
    <div className="hidden lg:block">
      <ResumeDropdown soundEnabled={soundEnabled} />
    </div>

    {/* Mobile Menu Toggle */}
    ... existing hamburger button ...
  </div>

  {/* Micro Scroll Progress Bar along bottom edge of floating navbar */}
  <ScrollProgressBar />
</div>
```

#### 3. Mobile Menu Drawer Integration:
In `mobileMenuOpen && ( ... )`:
Provide easy access to Resume actions inside the drawer:
```jsx
{/* Resume actions in mobile drawer */}
<div className="pt-2 border-t border-[#E7E2D8] flex flex-col gap-1.5">
  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-2">
    Resume Actions
  </div>
  <ResumeDropdown soundEnabled={soundEnabled} className="w-full" />
</div>
```

---

## 5. Verification Method

To independently verify the implementation, follow these steps:

### 5.1 Static Analysis & Lint Verification
Run oxlint across the entire repository:
```bash
npx oxlint
```
- **Expected Result**: 0 errors, 0 warnings.
- **Invalidation Condition**: Any syntax errors, unresolved imports, or unhandled variables.

### 5.2 Build Verification
Run Vite production build:
```bash
npm run build
```
- **Expected Result**: Clean build exit code 0; chunks output under `dist/`.

### 5.3 Interactive Functional Verification
1. **Resume Dropdown**:
   - Click "Resume" coral button in navbar -> Dropdown appears with 3 items ("View Online", "Download PDF", "Copy Link").
   - Click outside dropdown or press `Escape` -> Dropdown smoothly closes.
   - Click "View Online" -> Opens `/resume.pdf` in a new tab.
   - Click "Download PDF" ->
     - High-frequency confetti particles shoot upward/outward from the button.
     - Sparkle chime sounds (4 ascending tones: C6 -> E6 -> G6 -> C7) when audio is enabled; muted when audio is toggled off.
     - Browser prompts to download `Atul_Kant_Verma_Resume.pdf`.
   - Click "Copy Link" ->
     - Text changes to "Link Copied!" with checkmark for 2 seconds.
     - Clipboard contains `http://<host>/resume.pdf`.
2. **Scroll Progress Indicator Bar**:
   - At page top (`scrollY = 0`), progress bar width is 0%.
   - Slowly scroll down the page -> Bar smoothly scales with gradient `#FF4D6D` to `#FFAA00`.
   - At page bottom (Contact section), progress bar reaches exactly 100% width across the navbar bottom edge.
   - Resize browser window -> Progress recalculates accurately without jumping.
