# Phase 1: Pure Icon-Only Sub-Header Restoration (`phase_01_icon_only_subheader_restoration.md`)

> **Governing Protocol:** [Universal Rule 22](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/.agents/skills/phase-prompt-architect/SKILL.md)  
> **Target Component:** [`src/components/AIChatWidget.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/AIChatWidget.jsx)  
> **Specialized Subagent:** `javascript_language_specialist` & `css_styling_specialist`  
> **Execution Status:** `PENDING`

---

## 1. Objectives & Scope

### 1.1 The Objective
Replace the bloated, text-heavy sub-header with a **100% pure Icon-Only action strip** that gives immediate 1-click access to all 10 controls without hiding them behind popovers or expanding into text labels:
1. **Left Perspective Cluster (4 icons):**
   - 👥 `<Users />` — Select Audience Perspective
   - 💼 `<Briefcase />` — Select Job Role Track
   - 🖥️ `<Monitor />` — Switch View Mode (Modern, Terminal, Simple, Basic)
   - 🤖 `<Bot />` — Select Local AI Neural Model
2. **Right Quick Tools Cluster (6 icons):**
   - ✨ `<Sparkles />` — Launch Meta-Prompt Studio (`/engineer`)
   - ⚡ `<Zap />` — Toggle On-Device AI On/Off (State glow indicator)
   - 😊 `<Smile />` — Expressive Emojis On/Off Toggle
   - 📜 `<History />` — Open Session History Drawer
   - 📥 `<Download />` — Open Multi-Format Export Menu
   - 🔄 `<RotateCcw />` — Clear Conversation History
3. **No-Clip Smooth Horizontal Scrolling:**
   - The strip container enforces `flex items-center justify-between gap-1 sm:gap-1.5 px-2.5 py-1.5 bg-stone-100/90 dark:bg-[#150F22]/90 border-b border-[#E7E2D8]/60 dark:border-[#2D2340]/60 shrink-0 overflow-x-auto no-scrollbar`.
   - On compact viewports (`< 480px`), the strip smoothly scrolls horizontally without truncating or wrapping buttons.

---

## 2. Target Files & Code Locations

- **Primary Target:** [`src/components/AIChatWidget.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/AIChatWidget.jsx)
  - Lines ~1–45: Ensure `Smile` is imported from `lucide-react`.
  - Lines ~3279–3430: Replace the sub-header with the 100% pure Icon-Only layout.

---

## 3. Step-by-Step Implementation Instructions

### Step 1: Verify / Add `Smile` Import
In `src/components/AIChatWidget.jsx`, verify that `Smile` is imported from `lucide-react`. If missing, add `Smile`:

```javascript
import {
  BotMessageSquare,
  X,
  Minus,
  Maximize2,
  Minimize2,
  GripHorizontal,
  ChevronUp,
  ChevronDown,
  Send,
  RotateCcw,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Briefcase,
  FileText,
  MessageCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  Monitor,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Download,
  DownloadCloud,
  Cpu,
  Bot,
  Square,
  ThumbsUp,
  ThumbsDown,
  History,
  Trash2,
  Plus,
  Compass,
  Zap,
  Settings,
  Smile
} from 'lucide-react';
```

---

### Step 2: Replace Sub-Header with 100% Pure Icon-Only Strip

Replace lines ~3279–3435 in `src/components/AIChatWidget.jsx` with the following clean, pure icon-only code block:

```jsx
{/* Pure Icon-Only Sub-Header Strip (10 Direct Tools: 4 Perspective + 6 Quick Tools) */}
<div className="px-2 sm:px-2.5 py-1.5 bg-stone-100/90 dark:bg-[#150F22]/90 border-b border-[#E7E2D8]/60 dark:border-[#2D2340]/60 flex items-center justify-between gap-1 sm:gap-1.5 shrink-0 overflow-x-auto no-scrollbar">
  {/* Left Perspective Group (4 Pure Icons: Audience, Role, View Mode, Model) */}
  <div className="flex items-center gap-0.5 sm:gap-1 p-0.5 rounded-lg bg-stone-200/50 dark:bg-stone-800/50 border border-stone-300/40 dark:border-stone-700/40 shrink-0">
    {/* 1. Audience Perspective Icon */}
    <button
      type="button"
      onClick={handleTriggerAudienceDecisionTree}
      aria-label="Select Audience Perspective"
      title={`Select Audience Perspective: ${getAudienceLabel(audience)}`}
      className={`w-7 h-7 sm:w-7 sm:h-7 min-w-[28px] min-h-[28px] rounded-md flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden ${getAudienceColorStyle(audience)}`}
    >
      <Users className="w-3.5 h-3.5" />
    </button>

    {/* 2. Job Role Perspective Icon */}
    <button
      type="button"
      onClick={handleTriggerRoleDecisionTree}
      aria-label="Select Job Role Track"
      title={`Select Job Role Track: ${getRoleLabel(activeRole)}`}
      className={`w-7 h-7 sm:w-7 sm:h-7 min-w-[28px] min-h-[28px] rounded-md flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden ${getRoleColorStyle(activeRole)}`}
    >
      <Briefcase className="w-3.5 h-3.5" />
    </button>

    {/* 3. View Mode Switcher Icon */}
    <button
      type="button"
      onClick={handleTriggerViewModeDecisionTree}
      aria-label="Switch View Mode (Modern, Terminal, Simple, Basic)"
      title={`Switch View Mode: ${getViewModeLabel(viewMode)}`}
      className={`w-7 h-7 sm:w-7 sm:h-7 min-w-[28px] min-h-[28px] rounded-md flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden ${getViewModeColorStyle(viewMode)}`}
    >
      <Monitor className="w-3.5 h-3.5" />
    </button>

    {/* 4. AI Model Switcher Icon */}
    <button
      type="button"
      onClick={handleTriggerAIModelDecisionTree}
      aria-label="Select AI Model"
      title={`Select AI Model (${
        localAiState?.status === 'ready' && localAiState?.activeModel
          ? localAiState.activeModel.shortcut
          : (localAiState?.status === 'switching' || localAiState?.status === 'downloading' || localAiState?.status === 'loading_cache')
          ? 'Loading Model...'
          : 'Offline Engine'
      })`}
      className={`w-7 h-7 sm:w-7 sm:h-7 min-w-[28px] min-h-[28px] rounded-md flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2 focus-visible:outline-hidden ${getAIModelColorStyle(localAiState)}`}
    >
      <Bot className="w-3.5 h-3.5" />
    </button>
  </div>

  {/* Right Quick Tools Group (6 Pure Icons: Prompt Studio, AI Toggle, Emoji, History, Export, Clear) */}
  <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
    {/* 5. Prompt Studio Icon */}
    <button
      type="button"
      onClick={handleOpenPromptStudio}
      aria-label="Meta-Prompt Studio"
      title="Meta-Prompt Engineer & Studio (/engineer)"
      className="w-7 h-7 sm:w-7 sm:h-7 min-w-[28px] min-h-[28px] rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 bg-purple-500/15 hover:bg-purple-500/25 text-purple-700 dark:text-purple-300 border border-purple-500/30 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-hidden"
    >
      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
    </button>

    {/* 6. AI On/Off Toggle Icon */}
    <button
      type="button"
      onClick={handleToggleAIQuick}
      aria-label="Toggle On-Device AI On or Off"
      title={
        localAiState?.status === 'switching' || localAiState?.status === 'downloading' || localAiState?.status === 'loading_cache'
          ? "Your new model is loading in chat box... Click to switch back to Offline Engine"
          : isAiOn
          ? "Turn Off On-Device AI (Switch to Offline Knowledge Engine)"
          : "Turn On On-Device AI"
      }
      className={`w-7 h-7 sm:w-7 sm:h-7 min-w-[28px] min-h-[28px] rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 border focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden ${
        localAiState?.status === 'ready' && localAiState?.activeModel
          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border-emerald-500/40 hover:bg-emerald-500/25 ring-1 ring-emerald-500/30'
          : localAiState?.status === 'switching' || localAiState?.status === 'downloading' || localAiState?.status === 'loading_cache'
          ? 'text-amber-500 bg-amber-500/15 border-amber-500/40 ring-1 ring-amber-500/40 animate-pulse'
          : 'text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
      }`}
    >
      <Zap className="w-3.5 h-3.5" />
    </button>

    {/* 7. Emoji Toggle Icon */}
    <button
      type="button"
      onClick={() => setEmojiEnabled((prev) => !prev)}
      aria-label={emojiEnabled ? "Disable Emojis" : "Enable Emojis"}
      title={`Expressive Emojis: ${emojiEnabled ? 'Enabled' : 'Disabled'}`}
      className={`w-7 h-7 sm:w-7 sm:h-7 min-w-[28px] min-h-[28px] rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 border focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden ${
        emojiEnabled
          ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25'
          : 'bg-stone-100 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
      }`}
    >
      <Smile className="w-3.5 h-3.5" />
    </button>

    {/* 8. Conversation History Drawer Icon */}
    <button
      type="button"
      onClick={() => {
        setShowHistoryDrawer((prev) => !prev);
        setShowExportMenu(false);
      }}
      aria-label="View conversation history & sessions"
      title="Conversation History (Saved Sessions Archive)"
      className={`w-7 h-7 sm:w-7 sm:h-7 min-w-[28px] min-h-[28px] rounded-lg flex items-center justify-center transition-colors cursor-pointer shrink-0 active:scale-95 border focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden ${
        showHistoryDrawer
          ? 'bg-rose-500/20 text-[#FF4D6D] border-rose-500/40 shadow-xs'
          : 'bg-stone-100 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/60'
      }`}
    >
      <History className="w-3.5 h-3.5" />
    </button>

    {/* 9. Export Transcript Popover Picker */}
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setShowExportMenu((prev) => !prev);
          setShowHistoryDrawer(false);
        }}
        aria-label="Export Chat Transcript"
        title="Export Chat Transcript (Markdown, TXT, JSON, HTML, Copy)"
        className={`w-7 h-7 sm:w-7 sm:h-7 min-w-[28px] min-h-[28px] rounded-lg flex items-center justify-center transition-colors cursor-pointer shrink-0 active:scale-95 border focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden ${
          showExportMenu
            ? 'bg-rose-500/20 text-[#FF4D6D] border-rose-500/40 shadow-xs'
            : 'bg-stone-100 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/60'
        }`}
      >
        <Download className="w-3.5 h-3.5" />
      </button>

      {showExportMenu && (
        <div
          role="menu"
          aria-label="Export format options"
          className="absolute right-0 top-full mt-1.5 w-52 py-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xl z-50 text-xs animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
        >
          <div className="px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-stone-500 dark:text-stone-400 border-b border-stone-100 dark:border-stone-800">
            Export Transcript
          </div>
          <button
            type="button"
            onClick={() => handleExportFormat('markdown')}
            className="w-full text-left px-3 py-1.5 text-stone-700 dark:text-stone-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-[#FF4D6D] flex items-center justify-between cursor-pointer"
          >
            <span className="font-medium">📄 Markdown (.md)</span>
            <span className="text-[10px] text-stone-400">GH Flavored</span>
          </button>
          <button
            type="button"
            onClick={() => handleExportFormat('txt')}
            className="w-full text-left px-3 py-1.5 text-stone-700 dark:text-stone-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-[#FF4D6D] flex items-center justify-between cursor-pointer"
          >
            <span className="font-medium">📝 Plain Text (.txt)</span>
            <span className="text-[10px] text-stone-400">ASCII Log</span>
          </button>
          <button
            type="button"
            onClick={() => handleExportFormat('json')}
            className="w-full text-left px-3 py-1.5 text-stone-700 dark:text-stone-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-[#FF4D6D] flex items-center justify-between cursor-pointer"
          >
            <span className="font-medium">📊 JSON Transcript</span>
            <span className="text-[10px] text-stone-400">Raw Data</span>
          </button>
          <button
            type="button"
            onClick={() => handleExportFormat('html')}
            className="w-full text-left px-3 py-1.5 text-stone-700 dark:text-stone-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-[#FF4D6D] flex items-center justify-between cursor-pointer"
          >
            <span className="font-medium">🌐 HTML Print Page</span>
            <span className="text-[10px] text-stone-400">Self-Contained</span>
          </button>
          <div className="my-1 border-t border-stone-100 dark:border-stone-800" />
          <button
            type="button"
            onClick={handleCopyAllTranscript}
            className="w-full text-left px-3 py-1.5 text-[#FF4D6D] hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-between font-bold cursor-pointer"
          >
            <span>📋 Copy All to Clipboard</span>
          </button>
        </div>
      )}
    </div>

    {/* 10. Clear Chat History Icon */}
    <button
      type="button"
      onClick={handleClearChat}
      aria-label="Clear chat history"
      title="Clear chat history"
      className="w-7 h-7 sm:w-7 sm:h-7 min-w-[28px] min-h-[28px] rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 hover:bg-stone-200/50 dark:hover:bg-stone-800/60 transition-colors cursor-pointer shrink-0 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:outline-hidden"
    >
      <RotateCcw className="w-3.5 h-3.5" />
    </button>
  </div>
</div>
```

---

## 4. Edge Cases & Invariants

1. **Zero Text Invariant:** There must be zero `<span>` text elements inside the sub-header buttons. Each button contains strictly an icon component (`<Users />`, `<Briefcase />`, etc.).
2. **Accessible Tooltips (`title` + `aria-label`):** Because there are no visible text labels, every single button MUST have an accurate and informative `title` attribute for mouse hover and `aria-label` for screen reader navigation.
3. **Square Dimensions & Sizing:** Every button strictly conforms to `w-7 h-7 min-w-[28px] min-h-[28px]` ensuring identical square footprint.
4. **Non-Clipping Overflow:** The sub-header container enforces `overflow-x-auto no-scrollbar` to guarantee that even on narrow screens (e.g. mobile 360px), all buttons can be scrolled horizontally with zero clipping or unwanted line breaks.

---

## 5. Automated Verification Harness

Run the Phase 1 automated contract test:
```bash
node scripts/verify_icon_only_chat.mjs --phase=1
```

Verification assertions check:
- `AIChatWidget.jsx` contains 0 text labels inside sub-header buttons.
- Left group contains `<Users />`, `<Briefcase />`, `<Monitor />`, `<Bot />`.
- Right group contains `<Sparkles />`, `<Zap />`, `<Smile />`, `<History />`, `<Download />`, `<RotateCcw />`.
- Container possesses `overflow-x-auto no-scrollbar` classes.

---

## 6. Rollback Procedure

If sub-header layout experiences any regression:
1. Revert `src/components/AIChatWidget.jsx` to git commit head.
2. Verify with `git diff src/components/AIChatWidget.jsx`.
