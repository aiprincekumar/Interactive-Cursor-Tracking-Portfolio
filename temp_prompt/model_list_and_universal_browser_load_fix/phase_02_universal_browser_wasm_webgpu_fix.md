# Phase 2: Universal Browser WASM & WebGPU Load Fix (`phase_02_universal_browser_wasm_webgpu_fix.md`)

> **Governing Protocol:** [Universal Rule 22](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/.agents/skills/phase-prompt-architect/SKILL.md)  
> **Target Files:**  
> - [`src/workers/aiModelWorker.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/workers/aiModelWorker.js)  
> - [`src/services/localAIService.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/services/localAIService.js)  
> **Specialized Subagent:** `javascript_language_specialist`  
> **Execution Status:** `PENDING`

---

## 1. Objectives & Scope

### 1.1 The Objective
Ensure **100% crash-free model compilation across all web browsers** (Chrome, Safari, Firefox, Edge) and hosting environments:
1. **Single-Threaded WASM Configuration (`numThreads = 1`):**
   - In `src/workers/aiModelWorker.js`, lock `env.backends.onnx.wasm.numThreads = 1;` at top-level initialization and backend setup.
   - Eliminates the fatal `ReferenceError: SharedArrayBuffer is not defined` crash in non-cross-origin-isolated tabs (standard for GitHub Pages, static sites, and localhost).
2. **Direct WebGPU Detection in `localAIService.js`:**
   - In `loadModelInWorker()`, check `navigator.gpu` directly (`(typeof navigator !== 'undefined' && !!navigator.gpu) || !!this.deviceProfile?.webgpu?.supported`) so WebGPU is chosen even before `profileDevice()` completes.
3. **True Bidirectional Fallback in `initPipeline()`:**
   - If `device === 'webgpu'` fails -> seamlessly fall back to single-threaded `device = 'wasm'`.
   - If `device === 'wasm'` fails -> check for WebGPU capability and attempt fallback to `device = 'webgpu'`.
   - If both backends fail -> safely hand off to the deterministic offline knowledge engine.

---

## 2. Target Files & Code Locations

- **File 1:** [`src/workers/aiModelWorker.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/workers/aiModelWorker.js)
  - Lines ~13–18: Set `env.backends.onnx.wasm.numThreads = 1` and `proxy = false`.
  - Lines ~326–390: In `initPipeline()`, implement bidirectional fallback (WebGPU <-> WASM).
- **File 2:** [`src/services/localAIService.js`](file:///c:/Users/Atul%20Verma/Desktop/AI%20Document/Interactive%20Cursor-Tracking%20Portfolio/src/services/localAIService.js)
  - Lines ~864–866: Update `device` resolution to check `navigator.gpu` directly.

---

## 3. Step-by-Step Implementation Instructions

### Step 1: Configure Single-Threaded WASM in `aiModelWorker.js`

In `src/workers/aiModelWorker.js`, update the top-level environment configuration (lines ~9–18):

```javascript
// Optimize transformers environment for browser Web Worker
env.allowLocalModels = false;
env.useBrowserCache = true;

// Universal Browser Stability: Enforce single-threaded WASM to eliminate SharedArrayBuffer crash in non-isolated browsers
if (env.backends?.onnx?.wasm) {
  env.backends.onnx.wasm.proxy = false;
  env.backends.onnx.wasm.numThreads = 1;
}
```

---

### Step 2: Implement Bidirectional Fallback in `initPipeline()` in `aiModelWorker.js`

In `src/workers/aiModelWorker.js`, update the catch block of `initPipeline()` (around lines 326–395):

```javascript
  } catch (primaryErr) {
    console.warn(`[AI Worker] Failed to load ${modelId} with device=${device}:`, primaryErr);
    const errMsg = String(primaryErr?.message || '').toLowerCase();
    const isContextLost = errMsg.includes('context lost') || errMsg.includes('device lost');

    if (isContextLost && typeof self !== 'undefined' && self.postMessage) {
      self.postMessage({
        type: 'DEVICE_LOST',
        payload: {
          sessionId: currentSessionId,
          modelId,
          reason: 'device_lost',
          message: primaryErr.message
        }
      });
    }

    // Bidirectional Fallback: WebGPU -> WASM or WASM -> WebGPU
    const secondaryDevice = device === 'webgpu' ? 'wasm' : 'webgpu';
    const canAttemptFallback = device === 'webgpu'
      ? true // WASM is always available as fallback
      : (typeof navigator !== 'undefined' && !!navigator.gpu); // WebGPU fallback only if hardware supported

    if (canAttemptFallback) {
      if (typeof self !== 'undefined' && self.postMessage) {
        self.postMessage({
          type: 'LOG',
          payload: {
            sessionId: currentSessionId,
            message: `${device.toUpperCase()} backend failed. Attempting fallback to ${secondaryDevice.toUpperCase()} backend...`
          }
        });
      }

      try {
        await cleanupActivePipeline();
        isLoading = true;
        currentLoadingModelId = modelId;

        // Ensure single-threaded WASM if falling back to wasm
        if (secondaryDevice === 'wasm' && env.backends?.onnx?.wasm) {
          env.backends.onnx.wasm.proxy = false;
          env.backends.onnx.wasm.numThreads = 1;
        }

        activeGenerator = await pipeline('text-generation', modelId, {
          device: secondaryDevice,
          dtype: 'q4',
          progress_callback: handleProgress
        });

        const fallbackHealthCheck = await probeModelPerformance(activeGenerator, modelId, secondaryDevice);

        if (fallbackHealthCheck.isOOM) {
          await cleanupActivePipeline();
          if (typeof self !== 'undefined' && self.postMessage) {
            self.postMessage({
              type: 'ERROR',
              payload: {
                sessionId: currentSessionId,
                error: fallbackHealthCheck.error || `${secondaryDevice.toUpperCase()} OOM during warm-up probe`,
                reason: fallbackHealthCheck.reason || 'oom_allocation_failed',
                modelId,
                isOOM: true,
                healthCheck: fallbackHealthCheck
              }
            });
          }
          return;
        }

        activeModelId = modelId;
        currentLoadingModelId = null;
        activeDevice = secondaryDevice;
        isLoading = false;

        if (typeof self !== 'undefined' && self.postMessage) {
          self.postMessage({
            type: 'MODEL_READY',
            payload: {
              sessionId: currentSessionId,
              modelId,
              device: secondaryDevice,
              dtype: 'q4',
              timestamp: Date.now(),
              healthCheck: fallbackHealthCheck
            }
          });
        }
        return; // Fallback succeeded!
      } catch (fallbackErr) {
        console.warn(`[AI Worker] Secondary ${secondaryDevice} backend also failed for ${modelId}:`, fallbackErr);
      }
    }

    // Both primary and secondary backends failed -> emit ERROR
    isLoading = false;
    currentLoadingModelId = null;
    await cleanupActivePipeline();

    if (typeof self !== 'undefined' && self.postMessage) {
      self.postMessage({
        type: 'ERROR',
        payload: {
          sessionId: currentSessionId,
          error: primaryErr?.message || 'Model initialization failed on all backends',
          modelId,
          reason: 'backend_failure'
        }
      });
    }
  }
```

---

### Step 3: Prioritize WebGPU via `navigator.gpu` in `localAIService.js`

In `src/services/localAIService.js`, find `loadModelInWorker()` (around lines 864–865):

```javascript
    // Immediate WebGPU capability detection: check navigator.gpu directly if deviceProfile is pending
    const hasWebGpu = (typeof navigator !== 'undefined' && !!navigator.gpu) || !!this.deviceProfile?.webgpu?.supported;
    const devicePreference = this.executionBackend || 'webgpu';
    const device = devicePreference === 'wasm' ? 'wasm' : (hasWebGpu ? 'webgpu' : 'wasm');
```

*Key change:* When `this.deviceProfile` is null at startup, `typeof navigator !== 'undefined' && !!navigator.gpu` evaluates directly to true in modern browsers, ensuring WebGPU is prioritized instead of erroneously defaulting to WASM.

---

## 4. Edge Cases & Invariants

1. **`SharedArrayBuffer` Freedom:** With `numThreads = 1`, ONNX Runtime WASM does NOT invoke `SharedArrayBuffer` or spin up internal WASM threads. It runs deterministically inside the existing Web Worker.
2. **Bidirectional Fallback Symmetry:** Whether WebGPU is attempted first or WASM is attempted first, failure in one automatically triggers an attempt in the other before failing over to offline RAG.
3. **Session ID Mutex:** All fallback attempts verify and carry forward `currentSessionId`, preventing race conditions with newer user load requests.

---

## 5. Automated Verification Harness

Run the Phase 2 automated contract test:
```bash
node scripts/verify_model_list_and_browser_load.mjs --phase=2
```

Verification assertions check:
- `aiModelWorker.js` contains `env.backends.onnx.wasm.numThreads = 1;`.
- `initPipeline()` contains bidirectional fallback logic for both `webgpu` and `wasm`.
- `localAIService.js` checks `navigator.gpu` directly when selecting `device`.

---

## 6. Rollback Procedure

If worker compilation or device resolution fails:
1. Revert `src/workers/aiModelWorker.js` and `src/services/localAIService.js` to previous git commit.
2. Verify with `git diff src/workers/aiModelWorker.js src/services/localAIService.js`.
