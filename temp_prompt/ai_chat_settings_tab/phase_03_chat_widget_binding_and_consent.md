# Phase 03: AIChatWidget Binding & Consent Modal
## चरण ०३: एआई चैट विजेट बाइंडिंग एवं कंसेंट मोडल

> **Phase Identifier:** `phase_03_chat_widget_binding_and_consent`  
> **Master Board:** [`INDEX.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/temp_prompt/ai_chat_settings_tab/INDEX.md)  
> **Governing Protocol:** Universal Rule 22  
> **Specialized Subagent:** `javascript_language_specialist`  
> **Target Files:**  
> - [`src/components/AIChatWidget.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/AIChatWidget.jsx)  
> **Verification Command:** `node scripts/verify_chat_settings_tab.mjs --phase 3`  
> **Status:** `[ ] PENDING`

---

## 1. Phase Objectives & Technical Scope (उद्देश्य एवं दायरा)

Phase 3 connects the active chat interface in [`AIChatWidget.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/AIChatWidget.jsx) to the new `chatSettings` context, provides a direct gear shortcut in the chat header, implements an accessible "Model Download Confirmation Dialog", and guarantees zero unconsented data downloads.

### What Must Be Created / Modified:
1. **Access Lab Context:** Consume `chatSettings`, `updateChatSettings`, `setActiveTab`, and `openDrawer` via `useLabChat()` and `useLab()`.
2. **Chat Header Quick-Launch Button:** Insert a gear icon (`Settings`) button in the chat header bar immediately preceding the minimize button. Clicking it sets `activeTab` to `'chat'` and opens `LabStudioDrawer`.
3. **Model Download Confirmation Modal:**
   - Appears whenever a query triggers an on-device neural model download and `chatSettings.consentMode === 'always_ask'`.
   - Displays exact model name (e.g. `SmolLM2-135M-Instruct` or `Qwen2.5-0.5B-Instruct`), file download size (~90MB - 950MB), RAM requirement, WebGPU/WASM engine status, and offline guarantee.
   - User actions:
     - **Accept & Download:** Initiates download with progress bar and auto-switches to neural mode upon completion.
     - **Decline / Keep 0MB RAG:** Gracefully processes query with the instant deterministic offline engine.
     - **Remember Choice Checkbox:** Updates `consentMode` to `'auto_confirm'` in `chatSettings`.
4. **Wire Generation & Ergonomics Settings:**
   - Pass `chatSettings.temperature` and `chatSettings.maxTokens` to `localAIService.generate()`.
   - Toggle token streaming based on `chatSettings.streamResponse`.
   - Toggle speech synthesis (TTS) based on `chatSettings.ttsEnabled`, passing `voicePitch`, `voiceRate`, and `voiceId`.
   - Render suggestion chips conditionally based on `chatSettings.suggestionChipsEnabled`.
   - Render slash commands conditionally based on `chatSettings.slashCommandsEnabled`.

### What Must NOT Be Modified:
- Existing message rendering, role tabs, copy button, speech-to-text mic recording, or drag-and-resize physics.

---

## 2. Header Gear Shortcut Button Implementation

In [`src/components/AIChatWidget.jsx`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/components/AIChatWidget.jsx):
1. Import `Settings` from `'lucide-react'`.
2. Retrieve drawer and chat actions:
   ```javascript
   const { chatSettings, updateChatSettings } = useLabChat();
   const { openDrawer, setActiveTab } = useLab();
   ```
3. In the header action button group (around lines 2850-2865, alongside Minimize, Maximize, and Close):
   ```jsx
   {/* Quick Shortcut to AI & Chat Studio Settings */}
   <button
     type="button"
     onClick={(e) => {
       e.stopPropagation();
       if (soundEnabled) soundFX.playClick();
       if (typeof setActiveTab === 'function') setActiveTab('chat');
       if (typeof openDrawer === 'function') openDrawer('chat');
     }}
     aria-label="Open AI & Chat Studio Settings"
     title="AI & Chat Studio Settings (Tab 7)"
     className="min-w-[36px] min-h-[36px] sm:min-w-[28px] sm:min-h-[28px] sm:w-7 sm:h-7 rounded-md flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-hidden"
   >
     <Settings className="w-3.5 h-3.5" />
   </button>
   ```

---

## 3. Dynamic "Model Download Confirmation Dialog"

### Step 3.1: Confirmation Modal State
Define modal state inside `AIChatWidget`:
```javascript
const [pendingModelDownload, setPendingModelDownload] = useState(null);
// Structure of pendingModelDownload:
// {
//   model: MODEL_CATALOG.BARE_MINIMUM | MODEL_CATALOG.LIGHT,
//   query: string,
//   onConfirm: () => void,
//   onDecline: () => void
// }
```

### Step 3.2: Trigger Interception
When an unhandled complex query arrives:
```javascript
const handleRequestNeuralModel = (targetModel, query) => {
  // If user disabled neural or chose 0MB RAG
  if (chatSettings.modelId === 'offline_rag') {
    return runDeterministicRag(query);
  }

  // If consent policy is auto_confirm
  if (chatSettings.consentMode === 'auto_confirm') {
    return localAIService.loadModel(targetModel.id, { triggerQuery: query });
  }

  // If Wi-Fi only and user is on cellular/metered connection
  if (chatSettings.consentMode === 'wifi_only' && navigator.connection?.saveData) {
    showToast('Cellular data saver detected. Using 0MB Offline RAG.');
    return runDeterministicRag(query);
  }

  // Otherwise, present interactive consent modal
  setPendingModelDownload({
    model: targetModel,
    query: query,
    onConfirm: (rememberChoice) => {
      if (rememberChoice) {
        updateChatSettings({ consentMode: 'auto_confirm' });
      }
      setPendingModelDownload(null);
      localAIService.loadModel(targetModel.id, { triggerQuery: query });
    },
    onDecline: () => {
      setPendingModelDownload(null);
      runDeterministicRag(query);
    }
  });
};
```

### Step 3.3: Accessible Modal JSX
Render the dialog with backdrop and full keyboard accessibility:
```jsx
{pendingModelDownload && (
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="consent-modal-title"
    className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
  >
    <div className="w-full max-w-sm p-5 bg-stone-900 border border-white/10 rounded-2xl shadow-2xl text-white space-y-4">
      {/* Icon & Title */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
          <DownloadCloud className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h4 id="consent-modal-title" className="text-sm font-semibold text-white">
            Download On-Device AI Model?
          </h4>
          <p className="text-xs text-white/60">
            100% Client-Side Neural LLM
          </p>
        </div>
      </div>

      {/* Model Spec Card */}
      <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-white/60">Model:</span>
          <span className="font-mono font-medium text-indigo-300">
            {pendingModelDownload.model.name || 'SmolLM2-135M'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Download Size:</span>
          <span className="font-medium text-emerald-400">
            ~{pendingModelDownload.model.approxSizeMB || 90} MB
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Execution:</span>
          <span className="font-medium text-white/80">WebGPU / WASM</span>
        </div>
        <p className="text-[11px] text-white/50 pt-1 border-t border-white/5">
          Downloads directly to browser cache. No server API calls or data tracking.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          onClick={() => pendingModelDownload.onConfirm(false)}
          className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-indigo-600/30"
        >
          <Sparkles className="w-4 h-4" />
          Download & Enable AI Engine
        </button>
        <button
          onClick={() => pendingModelDownload.onDecline()}
          className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs transition-colors cursor-pointer"
        >
          Use Instant 0MB Offline Engine
        </button>
      </div>
    </div>
  </div>
)}
```

---

## 4. Voice & Sound Studio Binding

Inside assistant message completion callback:
```javascript
if (chatSettings.ttsEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
  const utterance = new SpeechSynthesisUtterance(cleanPlainText(assistantResponseText));
  utterance.pitch = chatSettings.voicePitch || 1.0;
  utterance.rate = chatSettings.voiceRate || 1.0;

  if (chatSettings.voiceId && chatSettings.voiceId !== 'default') {
    const availableVoices = window.speechSynthesis.getVoices();
    const chosen = availableVoices.find((v) => v.voiceURI === chatSettings.voiceId || v.name === chatSettings.voiceId);
    if (chosen) utterance.voice = chosen;
  }

  window.speechSynthesis.speak(utterance);
}
```

---

## 5. Automated Verification Harness (स्वचालित सत्यापन)

Run the verification harness for Phase 3:
```bash
node scripts/verify_chat_settings_tab.mjs --phase 3
```

Verification assertions include:
- Gear button with `aria-label="Open AI & Chat Studio Settings"` exists in `AIChatWidget.jsx`.
- Gear click triggers `openDrawer('chat')` or `setActiveTab('chat')`.
- Consent modal exists with role `"dialog"` and `aria-modal="true"`.
- `chatSettings.temperature` and `chatSettings.maxTokens` are wired to AI service invocation.

---

## 6. Rollback Procedure (वापसी प्रक्रिया)

If any regression occurs during Phase 3:
1. Revert changes to `src/components/AIChatWidget.jsx` via `git checkout src/components/AIChatWidget.jsx`.
2. Confirm chat window opens, sends messages, and displays offline fallback without error.
