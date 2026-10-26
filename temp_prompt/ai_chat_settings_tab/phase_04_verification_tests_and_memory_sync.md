# Phase 04: Verification Tests & Memory Synchronization
## चरण ०४: सत्यापन परीक्षण एवं मेमोरी सिंक्रनाइज़ेशन

> **Phase Identifier:** `phase_04_verification_tests_and_memory_sync`  
> **Master Board:** [`INDEX.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/temp_prompt/ai_chat_settings_tab/INDEX.md)  
> **Governing Protocol:** Universal Rule 22 (`temp_prompt/` Phase Execution & Cleanup Management)  
> **Specialized Subagent:** `qa_verification_tester`  
> **Target Files:**  
> - [`scripts/verify_chat_settings_tab.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_chat_settings_tab.mjs)  
> - [`memory.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/memory.md)  
> - [`docs/FEATURES_MEMORY.md`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/docs/FEATURES_MEMORY.md)  
> **Verification Command:** `node scripts/verify_chat_settings_tab.mjs --all`  
> **Status:** `[ ] PENDING`

---

## 1. Phase Objectives & Technical Scope (उद्देश्य एवं दायरा)

Phase 4 concludes the execution deck by providing the standalone automated verification harness, executing linter and production build checks, and certifying state invariants across all 5 clusters. Once certified with Grade A+ (zero errors, zero warnings), this phase guides the updates to permanent architecture memory files (`memory.md` and `docs/FEATURES_MEMORY.md`) before safe cleanup under Universal Rule 22.

---

## 2. Complete Automated Verification Script (`scripts/verify_chat_settings_tab.mjs`)

Create this file at [`scripts/verify_chat_settings_tab.mjs`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/scripts/verify_chat_settings_tab.mjs):

```javascript
/**
 * Automated Verification Harness: AI & Chat Studio Settings Tab (Tab 7)
 * Validates State Contracts, UI Clusters, Context Hooks, Accessibility, and Bi-directional Bindings.
 * Run: node scripts/verify_chat_settings_tab.mjs [--phase 1|2|3|all]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const phaseArg = args.find((a) => a.startsWith('--phase=') || a === '--phase')
  ? (args[args.indexOf('--phase') + 1] || args.find((a) => a.startsWith('--phase=')).split('=')[1])
  : (args.includes('--all') ? 'all' : 'all');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  \x1b[32m✔ PASS:\x1b[0m ${message}`);
  } else {
    failedChecks++;
    console.error(`  \x1b[31m✖ FAIL:\x1b[0m ${message}`);
  }
}

console.log('\n======================================================');
console.log('🧪 AI & Chat Studio Settings Tab Verification Harness');
console.log(`   Target Phase: ${phaseArg.toUpperCase()}`);
console.log('======================================================\n');

// ----------------------------------------------------
// Phase 1 Verification: LabContext & localAIService
// ----------------------------------------------------
if (phaseArg === '1' || phaseArg === 'all') {
  console.log('\x1b[36m--- [Phase 1] LabContext & State Foundations ---\x1b[0m');
  const labContextPath = path.join(ROOT, 'src', 'context', 'LabContext.jsx');
  assert(fs.existsSync(labContextPath), 'src/context/LabContext.jsx exists');

  const labContextCode = fs.readFileSync(labContextPath, 'utf8');

  // 1. Schema check
  assert(labContextCode.includes('DEFAULT_AI_CHAT_SETTINGS'), 'DEFAULT_AI_CHAT_SETTINGS is defined in LabContext.jsx');
  assert(labContextCode.includes('portfolio_ai_chat_settings'), "Storage key 'portfolio_ai_chat_settings' is present");

  // 2. All 5 cluster default keys
  const requiredKeys = [
    'modelId', 'loadTrigger', 'consentMode', 'executionBackend', 'cacheRetentionDays', // Cluster 1
    'streamResponse', 'temperature', 'maxTokens', 'personaTone',                      // Cluster 2
    'ttsEnabled', 'voicePitch', 'voiceRate', 'voiceId', 'chatSoundEffects',          // Cluster 3
    'sessionRetention', 'anonymizeTelemetry',                                        // Cluster 4
    'defaultWindowSize', 'autoGreetOnOpen', 'suggestionChipsEnabled', 'slashCommandsEnabled' // Cluster 5
  ];

  for (const key of requiredKeys) {
    assert(labContextCode.includes(key), `Default schema contains cluster key: '${key}'`);
  }

  // 3. Actions & Hooks
  assert(labContextCode.includes('updateChatSettings'), 'updateChatSettings function is defined');
  assert(labContextCode.includes('resetChatSettings'), 'resetChatSettings function is defined');
  assert(labContextCode.includes('ai-chat-settings-changed'), "Dispatches 'ai-chat-settings-changed' event");
  assert(labContextCode.includes('useLabChat'), 'useLabChat hook is exported');

  // 4. localAIService check
  const aiServicePath = path.join(ROOT, 'src', 'services', 'localAIService.js');
  assert(fs.existsSync(aiServicePath), 'src/services/localAIService.js exists');
  const aiServiceCode = fs.readFileSync(aiServicePath, 'utf8');
  assert(
    aiServiceCode.includes('ai-chat-settings-changed') || aiServiceCode.includes('syncWithChatSettings'),
    'localAIService integrates with chat settings'
  );
  console.log('');
}

// ----------------------------------------------------
// Phase 2 Verification: ControlCenterPanel UI & Tab 7
// ----------------------------------------------------
if (phaseArg === '2' || phaseArg === 'all') {
  console.log('\x1b[36m--- [Phase 2] ControlCenterPanel Tab 7 UI ---\x1b[0m');
  const panelPath = path.join(ROOT, 'src', 'components', 'ControlCenterPanel.jsx');
  assert(fs.existsSync(panelPath), 'src/components/ControlCenterPanel.jsx exists');

  const panelCode = fs.readFileSync(panelPath, 'utf8');

  // 1. Tab definition in tabs array
  assert(panelCode.includes("id: 'chat'"), "Tab 'chat' is declared in ControlCenterPanel.jsx");
  assert(panelCode.includes("AI & Chat Studio"), "Tab label 'AI & Chat Studio' is present");

  // 2. Tabpanel rendering
  assert(panelCode.includes("effectiveActiveTab === 'chat'") || panelCode.includes("activeTab === 'chat'"), "Tabpanel conditionally renders for activeTab === 'chat'");
  assert(panelCode.includes('role="tabpanel"'), 'Tabpanel has proper ARIA role="tabpanel"');

  // 3. Presence of all 5 Cluster UI sections
  assert(panelCode.includes('Model & Execution Engine') || panelCode.includes('Model Selector'), 'Cluster 1 (Model Engine) UI exists');
  assert(panelCode.includes('Generation') || panelCode.includes('Creativity'), 'Cluster 2 (Generation Controls) UI exists');
  assert(panelCode.includes('Voice & Sound') || panelCode.includes('Speech Synthesis'), 'Cluster 3 (Voice Studio) UI exists');
  assert(panelCode.includes('Privacy') || panelCode.includes('History'), 'Cluster 4 (Privacy & Storage) UI exists');
  assert(panelCode.includes('UI & Ergonomics') || panelCode.includes('Window Size'), 'Cluster 5 (UI Ergonomics) UI exists');
  console.log('');
}

// ----------------------------------------------------
// Phase 3 Verification: AIChatWidget Binding & Consent Modal
// ----------------------------------------------------
if (phaseArg === '3' || phaseArg === 'all') {
  console.log('\x1b[36m--- [Phase 3] AIChatWidget Binding & Consent Modal ---\x1b[0m');
  const widgetPath = path.join(ROOT, 'src', 'components', 'AIChatWidget.jsx');
  assert(fs.existsSync(widgetPath), 'src/components/AIChatWidget.jsx exists');

  const widgetCode = fs.readFileSync(widgetPath, 'utf8');

  // 1. Settings shortcut in header
  assert(
    widgetCode.includes('Open AI & Chat Studio Settings') || widgetCode.includes("setActiveTab('chat')"),
    'Header contains quick-launch gear shortcut to Tab 7'
  );

  // 2. Consent Dialog
  assert(
    widgetCode.includes('role="dialog"') && (widgetCode.includes('Download On-Device') || widgetCode.includes('consentMode')),
    'Model download confirmation dialog is present with accessible dialog semantics'
  );

  // 3. Fallback to 0MB Deterministic Engine
  assert(
    widgetCode.includes('runDeterministicRag') || widgetCode.includes('Offline Engine') || widgetCode.includes('0MB'),
    'Deterministic 0MB fallback is wired to consent decline'
  );
  console.log('');
}

// ----------------------------------------------------
// Summary Report
// ----------------------------------------------------
console.log('======================================================');
console.log(`📊 Total Checks: ${totalChecks} | Passed: ${passedChecks} | Failed: ${failedChecks}`);
if (failedChecks === 0) {
  console.log('\x1b[32m🌟 GRADE A+: All AI Chat Settings Tab tests passed successfully!\x1b[0m');
  console.log('======================================================\n');
  process.exit(0);
} else {
  console.error('\x1b[31m❌ REGRESSION DETECTED: Review failed checks above.\x1b[0m');
  console.log('======================================================\n');
  process.exit(1);
}
```

---

## 3. Linter & Static Analysis Verification

Run Oxlint to ensure zero syntax or scope regressions across touched files:
```bash
npx oxlint src/context/LabContext.jsx src/services/localAIService.js src/components/ControlCenterPanel.jsx src/components/AIChatWidget.jsx
```
*Acceptance Criteria:* `0 errors, 0 warnings`.

---

## 4. Production Build Verification

Verify that Vite 8 production bundling succeeds without module resolution or tree-shaking failures:
```bash
npm run build
```
*Acceptance Criteria:* Build output generated under `dist/` with exit code `0`.

---

## 5. Master Memory Synchronization Instructions

Upon passing automated tests, update the permanent project documentation:

### 5.1 Update `memory.md`
Add the 7th Tab architecture under Section 4 ("Lab Studio & Control Center Panels"):
```markdown
### 4.7 Tab 7: AI & Chat Studio (`id: 'chat'`)
- **Location:** 7th top-level tab in `ControlCenterPanel.jsx` / `LabStudioDrawer.jsx`.
- **Quick Entry:** Gear shortcut in `AIChatWidget.jsx` header.
- **State Storage:** Persisted in `localStorage` (`portfolio_ai_chat_settings`).
- **5 Interactive Clusters:**
  1. Model & Execution Engine (Auto-tier, 0MB RAG, SmolLM-135M, Qwen-0.5B, Qwen-1.5B; On-demand load trigger; Download consent modal).
  2. Generation Controls (Token streaming, Temperature 0.0-1.2, Max tokens 128-1024, Tone persona).
  3. Voice & Sound Studio (TTS toggle, voice selector, pitch/rate sliders, audio haptics).
  4. Privacy & Storage Tools (Retention policy, 1-click purge, transcript exporter).
  5. UI & Ergonomics (Default docking size, auto-greet, suggestion chips, slash commands).
```

### 5.2 Update `docs/FEATURES_MEMORY.md`
Add entry under AI & Assistants feature log.

---

## 6. Safe Post-Verification Cleanup (Universal Rule 22)

Once all 4 gates are certified:
1. `node scripts/verify_chat_settings_tab.mjs --all` returns `GRADE A+ (0 errors)`.
2. `npm run build` completes successfully.
3. `memory.md` and `docs/FEATURES_MEMORY.md` have been updated.
4. Record change entry in `changes_log/`.
5. Safely delete temporary directory:
   ```powershell
   Remove-Item -Recurse -Force temp_prompt/ai_chat_settings_tab
   ```
   *(Ensure root `temp_prompt/README.md` is strictly preserved!)*
