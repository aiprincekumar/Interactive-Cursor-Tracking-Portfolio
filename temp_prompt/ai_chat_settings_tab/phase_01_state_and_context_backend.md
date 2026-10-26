# Phase 01: State, Context & Service Integration
## चरण ०१: स्टेट, कॉन्टेक्स्ट और सर्विस इंटीग्रेशन

> **Phase Identifier:** `phase_01_state_and_context_backend`  
> **Master Board:** [`INDEX.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/temp_prompt/ai_chat_settings_tab/INDEX.md)  
> **Governing Protocol:** Universal Rule 22  
> **Specialized Subagent:** `javascript_language_specialist`  
> **Target Files:**  
> - [`src/context/LabContext.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/context/LabContext.jsx)  
> - [`src/services/localAIService.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/services/localAIService.js)  
> **Verification Command:** `node scripts/verify_chat_settings_tab.mjs --phase 1`  
> **Status:** `[ ] PENDING`

---

## 1. Phase Objectives & Technical Scope (उद्देश्य एवं दायरा)

The goal of Phase 1 is to establish the centralized reactive data foundation for the **AI & Chat Studio** settings. This ensures all chat-related preferences are persistent, safe against corrupt storage, accessible throughout the component tree via a dedicated `useLabChat()` hook, synchronized across browser tabs via `storage` events, and connected to [`localAIService.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/services/localAIService.js).

### What Must Be Created / Modified:
1. Define `DEFAULT_AI_CHAT_SETTINGS` schema covering all 5 feature clusters.
2. Initialize `chatSettings` state in [`LabContext.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/context/LabContext.jsx) with safe hydration from `localStorage.getItem('portfolio_ai_chat_settings')`.
3. Implement `updateChatSettings(patch)` and `resetChatSettings()` actions.
4. Dispatch `'ai-chat-settings-changed'` custom window event on updates for non-React service listeners.
5. Provide `LabChatContext` and export `useLabChat()` alongside the main `useLab()` context.
6. Enhance [`localAIService.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/services/localAIService.js) to subscribe to settings changes, respect `loadTrigger`, `consentMode`, and `executionBackend`.

### What Must NOT Be Modified:
- Existing cursor dynamics, 3D controls, audio synthesizers, or visual theme state.
- Existing `resetDefaults()` functionality must be preserved and augmented (reverting `chatSettings` to factory defaults).

---

## 2. Complete Schema Definition: `DEFAULT_AI_CHAT_SETTINGS`

Add this constant at the top level of [`src/context/LabContext.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/context/LabContext.jsx):

```javascript
export const DEFAULT_AI_CHAT_SETTINGS = Object.freeze({
  // Cluster 1: Model & Execution Engine
  modelId: 'auto', // 'auto' | 'offline_rag' | 'HuggingFaceTB/SmolLM2-135M-Instruct' | 'onnx-community/Qwen2.5-0.5B-Instruct' | 'onnx-community/Qwen2.5-1.5B-Instruct'
  loadTrigger: 'on_demand', // 'on_demand' (Default) | 'on_page_load' | 'on_open' | 'manual'
  consentMode: 'always_ask', // 'always_ask' (Default) | 'auto_confirm' | 'wifi_only'
  executionBackend: 'webgpu', // 'webgpu' (Default) | 'wasm'
  cacheRetentionDays: 30, // Retention period in days

  // Cluster 2: Generation & Personality Controls
  streamResponse: true, // Token streaming typewriter effect
  temperature: 0.7, // 0.0 (Strict/Deterministic) to 1.2 (Creative)
  maxTokens: 512, // Maximum output tokens (128 - 2048)
  personaTone: 'helpful_pro', // 'helpful_pro' | 'concise_technical' | 'creative_mentor' | 'casual_peer'

  // Cluster 3: Voice & Sound Studio
  ttsEnabled: false, // Speech synthesis enabled
  voicePitch: 1.0, // 0.5 to 1.5
  voiceRate: 1.0, // 0.7 to 1.5
  voiceId: 'default', // System speech voice URI or 'default'
  chatSoundEffects: true, // Zero-audio-asset procedural sound effects

  // Cluster 4: Privacy & Storage Tools
  sessionRetention: 'until_closed', // 'ephemeral' | 'until_closed' | 'persistent_7d' | 'persistent_30d'
  anonymizeTelemetry: true, // Keep telemetry anonymized

  // Cluster 5: UI & Ergonomics
  defaultWindowSize: 'normal', // 'compact' | 'normal' | 'expanded' | 'fullscreen'
  autoGreetOnOpen: true, // Greet on chat panel open
  suggestionChipsEnabled: true, // Display interactive quick suggestion chips
  slashCommandsEnabled: true // Display slash '/' command autocomplete palette
});
```

---

## 3. Step-by-Step Implementation Instructions

### Step 3.1: State Initialization in `LabContext.jsx`

Inside `LabProvider`:
```javascript
// LocalStorage key contract
const STORAGE_KEY_AI_CHAT = 'portfolio_ai_chat_settings';

// Helper to sanitize and hydrate chat settings
const getInitialChatSettings = () => {
  if (typeof window === 'undefined') return DEFAULT_AI_CHAT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AI_CHAT);
    if (!raw) return DEFAULT_AI_CHAT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_AI_CHAT_SETTINGS, ...parsed };
  } catch (err) {
    console.warn('[LabContext] Failed to parse chat settings, falling back to defaults:', err);
    return DEFAULT_AI_CHAT_SETTINGS;
  }
};

const [chatSettings, setChatSettings] = useState(getInitialChatSettings);
```

### Step 3.2: Update and Reset Actions

```javascript
const updateChatSettings = useCallback((patch) => {
  setChatSettings((prev) => {
    const updated = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_AI_CHAT, JSON.stringify(updated));
        window.dispatchEvent(
          new CustomEvent('ai-chat-settings-changed', {
            detail: { settings: updated, source: 'lab-context' }
          })
        );
      } catch (err) {
        console.error('[LabContext] Failed to persist chat settings:', err);
      }
    }
    return updated;
  });
}, []);

const resetChatSettings = useCallback(() => {
  updateChatSettings(DEFAULT_AI_CHAT_SETTINGS);
}, [updateChatSettings]);
```

Augment the existing `resetDefaults` function to also invoke:
```javascript
updateChatSettings(DEFAULT_AI_CHAT_SETTINGS);
```

### Step 3.3: Storage Event Listener for Cross-Tab Sync
Inside the existing `window.addEventListener('storage', ...)` block in `LabContext.jsx`:
```javascript
if (e.key === STORAGE_KEY_AI_CHAT) {
  try {
    const newSettings = e.newValue ? JSON.parse(e.newValue) : DEFAULT_AI_CHAT_SETTINGS;
    setChatSettings({ ...DEFAULT_AI_CHAT_SETTINGS, ...newSettings });
  } catch {
    // Graceful fallback
  }
}
```

### Step 3.4: Create Sub-Context and Custom Hook `useLabChat`

Create `LabChatContext`:
```javascript
export const LabChatContext = createContext(null);
```

Wrap children in `LabChatContext.Provider`:
```javascript
const chatValue = useMemo(() => ({
  chatSettings,
  updateChatSettings,
  resetChatSettings
}), [chatSettings, updateChatSettings, resetChatSettings]);

// In the Provider JSX tree:
<LabChatContext.Provider value={chatValue}>
  {/* nested providers */}
</LabChatContext.Provider>
```

Also expose `chatSettings`, `updateChatSettings`, and `resetChatSettings` in the master `labValue` returned by `useLab()`.

Export hook at bottom of `LabContext.jsx`:
```javascript
export function useLabChat() {
  const context = useContext(LabChatContext);
  if (!context) {
    throw new Error('useLabChat must be used within a LabProvider');
  }
  return context;
}
```

### Step 3.5: Integration into `src/services/localAIService.js`

In `localAIService.js`:
1. Add a method `syncWithChatSettings(settings)`:
   - Updates internal execution backend preference (`webgpu` vs `wasm`).
   - Updates consent preference.
   - If `settings.loadTrigger === 'on_page_load'` and `settings.consentMode === 'auto_confirm'`, triggers background prewarm.
   - If `settings.modelId === 'offline_rag'`, immediately bypasses neural worker and sets offline mode.
2. In the `localAIService` constructor:
   ```javascript
   if (typeof window !== 'undefined') {
     // Initial read
     try {
       const raw = localStorage.getItem('portfolio_ai_chat_settings');
       if (raw) this.syncWithChatSettings(JSON.parse(raw));
     } catch {}

     // Listen for live updates
     window.addEventListener('ai-chat-settings-changed', (e) => {
       if (e?.detail?.settings) {
         this.syncWithChatSettings(e.detail.settings);
       }
     });
   }
   ```

---

## 4. Edge Cases & Invariants (विशेष स्थितियाँ एवं सुरक्षा)

1. **Storage Quota Exceeded:** If `localStorage` write fails (e.g. Safari Private Browsing quota), wrap in `try/catch` without breaking application runtime.
2. **Invalid Enum Values:** Sanitizer must guard against unknown string values for `modelId`, `loadTrigger`, or `consentMode` by falling back to defaults.
3. **Number Range Clamping:**
   - `temperature`: clamped between `0.0` and `1.2`.
   - `maxTokens`: clamped between `128` and `2048`.
   - `voicePitch` & `voiceRate`: clamped between `0.5` and `1.5`.

---

## 5. Automated Verification Harness (स्वचालित सत्यापन)

Run the verification harness for Phase 1:
```bash
node scripts/verify_chat_settings_tab.mjs --phase 1
```

Verification assertions include:
- `DEFAULT_AI_CHAT_SETTINGS` is exported and contains all 5 cluster keys.
- `useLabChat` is exported as a function.
- `STORAGE_KEY_AI_CHAT` (`portfolio_ai_chat_settings`) is defined and handled in `LabContext.jsx`.
- `localAIService.js` listens to `'ai-chat-settings-changed'`.

---

## 6. Rollback Procedure (वापसी प्रक्रिया)

If any regression occurs during Phase 1:
1. Revert changes to `src/context/LabContext.jsx` and `src/services/localAIService.js` via `git checkout src/context/LabContext.jsx src/services/localAIService.js`.
2. Clear localStorage test key: `localStorage.removeItem('portfolio_ai_chat_settings')`.
3. Confirm unit test baseline: `npm test`.
