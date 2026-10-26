# Phase 02: Control Center 7th Tab UI Implementation
## चरण ०२: कंट्रोल सेंटर ७वां टैब यूआई कार्यान्वयन

> **Phase Identifier:** `phase_02_control_center_tab_ui`  
> **Master Board:** [`INDEX.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/temp_prompt/ai_chat_settings_tab/INDEX.md)  
> **Governing Protocol:** Universal Rule 22  
> **Specialized Subagent:** `css_styling_specialist`  
> **Target Files:**  
> - [`src/components/ControlCenterPanel.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/ControlCenterPanel.jsx)  
> - [`src/components/LabStudioDrawer.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/LabStudioDrawer.jsx)  
> **Verification Command:** `node scripts/verify_chat_settings_tab.mjs --phase 2`  
> **Status:** `[ ] PENDING`

---

## 1. Phase Objectives & Technical Scope (उद्देश्य एवं दायरा)

Phase 2 builds the dedicated visual user interface for the **AI & Chat Studio (`id: 'chat'`)** as the 7th top-level tab inside [`ControlCenterPanel.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/ControlCenterPanel.jsx). The tab organizes complex on-device AI parameters into 5 clear, visually cohesive, and responsive setting clusters.

### What Must Be Created / Modified:
1. **Tabs Navigation Array:** Append `{ id: 'chat', label: 'AI & Chat Studio', icon: BotMessageSquare, tag: ... }` to `tabs` in `ControlCenterPanel.jsx`.
2. **Tab Header Badge:** Dynamically display active engine mode (`"0MB RAG"`, `"Auto Tier"`, or model shortcut).
3. **Tab Content Panel:** Render `{(effectiveActiveTab === 'chat' || activeTab === 'chat') && ( ... )}` with the 5 interactive clusters.
4. **Interactive Controls:** Sliders for temperature/tokens/voice, segmented buttons for trigger/consent/tone, switches for toggles, and action buttons for cache purge & transcript export.
5. **Auditory Feedback:** Trigger procedural soundFX (`soundFX.playToggle()`, `soundFX.playClick()`, `soundFX.playSliderTick()`) when audio is enabled.
6. **Accessibility & Keyboard Navigation:** Full ARIA roles, labels, tab navigation, and focus rings.

### What Must NOT Be Modified:
- Existing 6 tabs (`audio`, `cursor`, `hero`, `threed`, `preferences`, `visuals`) logic and styling must remain untouched.
- Drawer layout, backdrop, and focus trap in `LabStudioDrawer.jsx` must remain intact.

---

## 2. Tab Navigation & Header Integration

### Step 2.1: Lucide Icon Import
In [`src/components/ControlCenterPanel.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/ControlCenterPanel.jsx), import `BotMessageSquare` (or `Bot`, `Sparkles`, `Cpu`, `Database`, `BrainCircuit`):
```javascript
import {
  // Existing icons...
  BotMessageSquare,
  Cpu,
  BrainCircuit,
  MessageSquare,
  Mic,
  ShieldCheck,
  Trash2,
  Download,
  Flame,
  Volume2
} from 'lucide-react';
```

### Step 2.2: Add 7th Tab Entry in `tabs` Array
In `ControlCenterPanel.jsx` around line 810:
```javascript
// Retrieve chat state from context
const { chatSettings, updateChatSettings, resetChatSettings } = useLabChat();

// Compute active model tag
const getModelTag = () => {
  if (chatSettings.modelId === 'offline_rag') return '0MB RAG';
  if (chatSettings.modelId === 'auto') return 'Auto Tier';
  if (chatSettings.modelId.includes('SmolLM2-135M')) return '135M';
  if (chatSettings.modelId.includes('Qwen2.5-0.5B')) return '0.5B';
  if (chatSettings.modelId.includes('Qwen2.5-1.5B')) return '1.5B';
  return 'Neural';
};

const tabs = [
  { id: 'audio', label: 'Audio Studio', icon: Volume2, tag: soundEnabled ? `${Math.round(masterVolume * 100)}%` : 'Muted' },
  { id: 'cursor', label: 'Cursor & Dynamics', icon: Sparkles, tag: customCursorEnabled ? `${cursorScale.toFixed(1)}x` : 'Native' },
  { id: 'hero', label: 'Hero & Character', icon: User, tag: gazeMode === 'fixed' ? 'Fixed' : 'Auto' },
  { id: 'threed', label: '3D Controls', icon: Box, tag: isMaster3DOn ? `${active3DCount}/10 On` : '2D Mode' },
  { id: 'preferences', label: 'Startup & Preferences', icon: Settings, tag: defaultStartupRole },
  { id: 'visuals', label: 'Display & Visuals', icon: Palette, tag: getAccentName(accentColor) },
  // 7th Dedicated Tab
  { id: 'chat', label: 'AI & Chat Studio', icon: BotMessageSquare, tag: getModelTag() }
];
```

---

## 3. The 5 Interactive Feature Clusters Specifications

Render the tab panel inside `ControlCenterPanel.jsx`:
```jsx
{(effectiveActiveTab === 'chat' || activeTab === 'chat') && (
  <div
    role="tabpanel"
    id="panel-chat"
    aria-labelledby="tab-chat"
    className="space-y-6 animate-fadeIn focus:outline-none"
    tabIndex={0}
  >
    {/* Tab Title & Reset Button */}
    <div className="flex items-center justify-between pb-3 border-b border-white/10 dark:border-white/10">
      <div>
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <BotMessageSquare className="w-5 h-5 text-indigo-400" />
          AI & On-Device Chat Studio
        </h3>
        <p className="text-xs text-white/60">
          Configure local neural models, trigger strategies, generation parameters, and voice studio.
        </p>
      </div>
      <button
        onClick={() => {
          if (soundEnabled) soundFX.playReset();
          resetChatSettings();
        }}
        className="px-2.5 py-1 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-1.5 border border-white/10"
        title="Reset Chat Settings to Default"
        aria-label="Reset AI Chat Settings to Default"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset
      </button>
    </div>

    {/* Cluster 1: Model & Execution Engine */}
    {/* Cluster 2: Generation & Personality Controls */}
    {/* Cluster 3: Voice & Sound Studio */}
    {/* Cluster 4: Privacy & Storage Tools */}
    {/* Cluster 5: UI & Ergonomics */}
  </div>
)}
```

### 3.1 Cluster 1: Model & Execution Engine (मॉडल और निष्पादन इंजन)
- **Model Selector Grid:**
  - 5 interactive cards / option tiles:
    1. `Auto-Detect Hardware Tier` (SmolLM-135M / Qwen-0.5B / Qwen-1.5B based on WebGPU & RAM).
    2. `Deterministic Offline RAG Only` (0 MB download, instant pattern matcher).
    3. `SmolLM-135M Instruct` (~90MB, low memory footprint).
    4. `Qwen-0.5B Instruct` (~350MB, balanced precision).
    5. `Qwen-1.5B Instruct` (~950MB, high-precision reasoning).
- **Load Trigger Strategy (Segmented Radio Bar):**
  - Options: `On-Demand (Smart Fallback)` [Default], `On Page Load`, `On Chat Window Open`, `Manual Only`.
  - Explanatory subtitle for selected mode.
- **Download Consent Policy (Segmented Radio Bar):**
  - Options: `Always Ask [Default]`, `Auto-Confirm (Silent)`, `Wi-Fi Only`.
- **Hardware Acceleration Switch:**
  - WebGPU (Recommended) vs WASM Fallback toggle.
- **Cache Management Info:**
  - Cache size display with 1-click `Clear Model Cache` button invoking browser CacheStorage purge.

### 3.2 Cluster 2: Generation & Personality Controls (जेनरेशन और व्यक्तित्व नियंत्रण)
- **Response Streaming Toggle:**
  - Toggle switch for token-by-token typewriter effect vs immediate block output.
- **Creativity / Temperature Slider:**
  - Range: `0.0` to `1.2` (step: `0.05`, default: `0.7`).
  - Visual badges: `0.0 Deterministic / Code`, `0.7 Balanced`, `1.2 Highly Creative`.
- **Max Output Tokens Slider:**
  - Range: `128` to `1024` (step: `64`, default: `512 tokens`).
- **Tone & Persona Selector:**
  - Segmented pills: `Helpful Pro`, `Concise Technical`, `Creative Mentor`, `Casual Peer`.

### 3.3 Cluster 3: Voice & Sound Studio (आवाज और ऑडियो स्टूडियो)
- **Speech Synthesis (TTS) Toggle:**
  - Switch to read assistant responses aloud.
- **Voice Selection Dropdown:**
  - Populated dynamically with available browser voices (`window.speechSynthesis.getVoices()`).
- **Voice Pitch & Speed Sliders:**
  - Pitch: `0.5x` to `1.5x` (default `1.0x`).
  - Speed: `0.7x` to `1.5x` (default `1.0x`).
  - "Test Voice" button to play sample sentence: *"Hello! I am Atul's AI portfolio assistant."*
- **Procedural Chat Sound Effects:**
  - Toggle switch for synthesizer blips on send, receive, and slash suggestions.

### 3.4 Cluster 4: Privacy & Storage Tools (गोपनीयता और स्टोरेज टूल्स)
- **Session History Retention:**
  - Segmented selector: `Ephemeral (None)`, `Until Tab Closed [Default]`, `Persistent 7 Days`, `Persistent 30 Days`.
- **1-Click "Purge All Chat Memory":**
  - Destructive action button with modal confirmation to wipe all chat transcripts and temporary embeddings.
- **Export Chat History:**
  - Action button to download the current conversation as Markdown (`.md`) or JSON (`.json`).

### 3.5 Cluster 5: UI & Ergonomics (यूजर इंटरफेस और एर्गोनॉमिक्स)
- **Default Window Size Selector:**
  - Options: `Compact (360px)`, `Normal (420px) [Default]`, `Expanded 2-Col (640px)`, `Fullscreen`.
- **Auto-Greet on Open:**
  - Switch to greet the visitor with contextual welcome chips when opened.
- **Interactive Suggestion Chips:**
  - Switch to show quick prompt pills (`Projects`, `Resume`, `Tech Stack`, `Hire`).
- **Slash Commands Autocomplete:**
  - Switch to enable `/help`, `/skills`, `/contact` command palette.

---

## 4. Visual Tokens & Scoped Tailwind Classes

All elements must use the established glassmorphic control center tokens:
- **Card Background:** `bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-xl p-3.5 transition-all`
- **Active Card Ring:** `ring-2 ring-indigo-500/80 bg-indigo-500/10 border-indigo-500/40`
- **Segmented Toggle Group:** `grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-black/40 rounded-xl border border-white/10`
- **Segmented Button Active:** `bg-indigo-600 text-white shadow-sm font-medium`
- **Segmented Button Inactive:** `text-white/60 hover:text-white hover:bg-white/5`
- **Slider Track:** `accent-indigo-500 h-1.5 w-full bg-white/20 rounded-lg cursor-pointer`

---

## 5. Automated Verification Harness (स्वचालित सत्यापन)

Run the verification harness for Phase 2:
```bash
node scripts/verify_chat_settings_tab.mjs --phase 2
```

Verification assertions include:
- `tabs` array in `ControlCenterPanel.jsx` contains an item with `id: 'chat'`.
- Tab panel `panel-chat` exists and references `aria-labelledby="tab-chat"`.
- All 5 cluster headers are present in the markup.
- `useLabChat` is called and hooked into state inputs.

---

## 6. Rollback Procedure (वापसी प्रक्रिया)

If any regression occurs during Phase 2:
1. Revert changes to `src/components/ControlCenterPanel.jsx` via `git checkout src/components/ControlCenterPanel.jsx`.
2. Confirm existing 6 tabs render cleanly and without console warnings.
