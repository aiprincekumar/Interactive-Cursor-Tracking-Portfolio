/**
 * Local AI Service
 * Robust Singleton managing On-Device LLM Worker, device profiling,
 * background downloads, graceful fallbacks, and reactive notifications.
 */

import { profileDevice, getBareMinimumModel, getNextDowngradeModel, getAutonomousTierModel, MODEL_CATALOG } from '../utils/deviceProfiler.js';

class LocalAIService {
  constructor() {
    this.worker = null;
    this.status = 'idle'; // 'idle' | 'profiling' | 'downloading' | 'loading_cache' | 'switching' | 'ready' | 'generating' | 'error'
    this.deviceProfile = null;
    this.activeModel = null;
    this.activeDtype = null;
    this.downloadingModel = null;
    this.downloadProgress = 0;
    this.downloadFile = '';
    this.downloadLoaded = 0;
    this.downloadTotal = 0;
    this.listeners = new Set();
    this.pendingRequests = new Map();
    this.silentDownloadInitiated = false;
    this.isSilentLoad = false;
    this.hasUserConsented = false;
    this.isAiEnabled = true;
    this.isCurrentModelCached = false;
    this.lastNotification = null;
    this.pendingActivationModel = null;
    this.isOnline = typeof navigator !== 'undefined' ? (navigator.onLine ?? true) : true;
    this.modelLoadWatchdog = null;
    this.lastProgressTimestamp = 0;
    this.lastLoadedBytes = 0;
    this.lastProgressPercent = 0;
    this.lastHeartbeatTime = 0;
    this.lastHeartbeatLoadedBytes = 0;
    this.lastHeartbeatProgress = 0;
    this.watchdogDurationMs = 60000;      // 60s network chunk stall threshold
    this.compilationWatchdogMs = 120000;  // 120s budget for WebGPU/WASM graph and shader compilation
    this.currentLoadSessionId = 0;
    this.isModelLoading = false;
    this.chatSettings = null;
    this.executionBackend = 'webgpu';
    this.consentMode = 'always_ask';
    this.loadTrigger = 'on_demand';

    // Listen for network online/offline events for zero-delay offline fallback
    if (typeof window !== 'undefined') {
      window.addEventListener('offline', () => this.handleOfflineEvent());
      window.addEventListener('online', () => this.handleOnlineEvent());
    }

    // Check existing stored consent
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('portfolio_ai_model_consent');
        if (stored === 'enabled') {
          this.hasUserConsented = true;
          this.isAiEnabled = true;
        } else if (stored === 'disabled' || stored === 'declined') {
          this.isAiEnabled = false;
        }
      } catch {
        // ignore
      }

      // Initial read of AI & Chat settings
      try {
        const raw = localStorage.getItem('portfolio_ai_chat_settings');
        if (raw) this.syncWithChatSettings(JSON.parse(raw));
      } catch {
        // ignore
      }

      // Listen for live updates
      window.addEventListener('ai-chat-settings-changed', (e) => {
        if (e?.detail?.settings) {
          this.syncWithChatSettings(e.detail.settings);
        }
      });
    }
  }

  /**
   * Subscribe to state and event changes
   */
  subscribe(listener) {
    this.listeners.add(listener);
    // Send immediate initial state
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  notifyListeners(notification = null) {
    if (notification) {
      this.lastNotification = notification;
    }
    const state = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.error('Error in LocalAIService listener:', err);
      }
    });
  }

  getState() {
    return {
      status: this.status,
      activeModel: this.activeModel,
      activeDtype: this.activeDtype,
      downloadingModel: this.downloadingModel,
      downloadProgress: this.downloadProgress,
      downloadFile: this.downloadFile,
      downloadLoaded: this.downloadLoaded,
      downloadTotal: this.downloadTotal,
      deviceProfile: this.deviceProfile,
      lastNotification: this.lastNotification,
      hasUserConsented: this.hasUserConsented,
      isAiEnabled: this.isAiEnabled,
      isCurrentModelCached: this.isCurrentModelCached,
      isOnline: this.isOnline,
      currentLoadSessionId: this.currentLoadSessionId,
      isModelLoading: this.isModelLoading,
      lastProgressTimestamp: this.lastProgressTimestamp,
      lastLoadedBytes: this.lastLoadedBytes,
      lastProgressPercent: this.lastProgressPercent,
      lastHeartbeatTime: this.lastHeartbeatTime,
      lastHeartbeatProgress: this.lastHeartbeatProgress,
      lastHeartbeatLoadedBytes: this.lastHeartbeatLoadedBytes
    };
  }

  /**
   * Synchronize service runtime options with LabContext chat settings
   */
  syncWithChatSettings(settings) {
    if (!settings || typeof settings !== 'object') return;

    this.chatSettings = settings;

    // 1. Execution backend preference (webgpu vs wasm)
    if (settings.executionBackend === 'wasm' || settings.executionBackend === 'webgpu') {
      this.executionBackend = settings.executionBackend;
    }

    // 2. Consent mode preference
    if (settings.consentMode) {
      this.consentMode = settings.consentMode;
      if (settings.consentMode === 'auto_confirm') {
        this.hasUserConsented = true;
      }
    }

    // 3. Model ID / Offline RAG
    if (settings.modelId === 'offline_rag') {
      this.isAiEnabled = false;
      this.unloadCurrentModel();
      return;
    } else {
      this.isAiEnabled = true;
    }

    // 4. Background prewarm if loadTrigger is 'on_page_load' and consentMode is 'auto_confirm'
    if (settings.loadTrigger === 'on_page_load' && settings.consentMode === 'auto_confirm') {
      if (this.status === 'idle' && !this.activeModel && !this.isModelLoading) {
        this.initSilentDownload();
      }
    }
  }

  /**
   * Clears any active model loading watchdog timer
   */
  clearWatchdog() {
    if (this.modelLoadWatchdog) {
      clearTimeout(this.modelLoadWatchdog);
      this.modelLoadWatchdog = null;
    }
  }

  /**
   * Arms or resets the progress-aware heartbeat watchdog.
   * Automatically rescheduled as long as download bytes or progress increase.
   */
  armProgressWatchdog(modelId, durationMs = this.watchdogDurationMs, reason = 'timeout_watchdog_stalled') {
    this.clearWatchdog();
    this.modelLoadWatchdog = setTimeout(() => {
      console.warn(`[LocalAIService] Watchdog: Model download/compilation for ${modelId} stalled (> ${durationMs / 1000}s without progress). Triggering fallback ladder...`);
      this.isModelLoading = false;
      this.handleModelDowngrade(modelId, reason);
    }, durationMs);
  }

  /**
   * Resets the progress-aware heartbeat watchdog during active chunk downloads.
   */
  resetWatchdogHeartbeat(modelId, durationMs = this.watchdogDurationMs, reason = 'timeout_watchdog_stalled') {
    this.armProgressWatchdog(modelId, durationMs, reason);
  }

  /**
   * Network offline event handler: seamless fallback to deterministic [Portfolio-Engine]
   */
  handleOfflineEvent() {
    this.isOnline = false;
    console.log('[LocalAIService] Network offline detected. Seamlessly routing requests to deterministic [Portfolio-Engine].');
    if (this.status === 'downloading') {
      this.clearWatchdog();
      this.isModelLoading = false;
      this.status = 'idle';
      this.downloadingModel = null;
      this.downloadProgress = 0;
      this.notifyListeners({
        type: 'offline_fallback',
        notice: '🌐 Network offline. Deterministic [Portfolio-Engine] is active with zero delay.',
        message: '🌐 Network offline. Deterministic [Portfolio-Engine] is active with zero delay.'
      });
    }
  }

  /**
   * Network online event handler
   */
  handleOnlineEvent() {
    this.isOnline = true;
    console.log('[LocalAIService] Network connectivity restored.');
  }

  /**
   * Helper to fetch rich catalog metadata for any model identifier
   */
  getModelDetails(modelId) {
    if (!modelId) {
      return {
        id: 'portfolio-engine',
        name: 'Offline Knowledge Engine',
        shortcut: '[Portfolio-Engine]',
        sizeMB: 0,
        description: 'Deterministic Portfolio Intelligence'
      };
    }
    for (const key of Object.keys(MODEL_CATALOG)) {
      const entry = MODEL_CATALOG[key];
      if (entry.id === modelId || modelId.includes(entry.name) || modelId.includes(entry.shortcut)) {
        return {
          id: entry.id,
          name: entry.name,
          shortcut: entry.shortcut,
          sizeMB: entry.approxSizeMB,
          params: entry.params,
          description: entry.description
        };
      }
    }
    return {
      id: modelId,
      name: modelId.split('/').pop(),
      shortcut: this.getShortcutForModelId(modelId),
      sizeMB: 90,
      description: 'On-device neural model'
    };
  }

  /**
   * Strict Cache Verification:
   * 1. CacheStorage ('transformers-cache') MUST contain actual ONNX model weights (.onnx or .onnx_data)
   * 2. Do not blindly trust localStorage; if weight files are missing in CacheStorage, purge stale localStorage key
   */
  async isModelCached(modelId) {
    if (!modelId) return false;

    // CacheStorage API ('transformers-cache') check
    try {
      const cacheStorage =
        typeof window !== 'undefined' && window.caches
          ? window.caches
          : typeof self !== 'undefined' && self.caches
          ? self.caches
          : null;

      if (cacheStorage && typeof cacheStorage.has === 'function') {
        const hasCache = await cacheStorage.has('transformers-cache');
        if (hasCache && typeof cacheStorage.open === 'function') {
          const cache = await cacheStorage.open('transformers-cache');
          const keys = await cache.keys();
          if (keys && keys.length > 0) {
            const cleanModelId = modelId.toLowerCase();
            const modelShortName = (modelId.split('/').pop() || modelId).toLowerCase();

            // Strict weight verification: must contain actual ONNX weights, not just metadata
            const hasWeightFiles = keys.some((req) => {
              const url = (req?.url || '').toLowerCase();
              const matchesModel = (
                url.includes(cleanModelId) ||
                url.includes(encodeURIComponent(cleanModelId)) ||
                url.includes(modelShortName)
              );
              const isWeight = url.includes('.onnx') || url.includes('.onnx_data');
              return matchesModel && isWeight;
            });

            if (hasWeightFiles) {
              if (typeof window !== 'undefined' && window.localStorage) {
                try {
                  localStorage.setItem('portfolio_ai_cached_' + modelId, 'true');
                } catch {
                  // ignore
                }
              }
              return true;
            } else {
              // Purge stale or corrupted localStorage flag when weight files are missing
              if (typeof window !== 'undefined' && window.localStorage) {
                try {
                  localStorage.removeItem('portfolio_ai_cached_' + modelId);
                } catch {
                  // ignore
                }
              }
              return false;
            }
          } else {
            if (typeof window !== 'undefined' && window.localStorage) {
              try {
                localStorage.removeItem('portfolio_ai_cached_' + modelId);
              } catch {
                // ignore
              }
            }
            return false;
          }
        }
      } else if (typeof window !== 'undefined' && window.localStorage) {
        // Fallback for non-browser/test environments without CacheStorage
        try {
          return localStorage.getItem('portfolio_ai_cached_' + modelId) === 'true';
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.warn('[LocalAIService] CacheStorage verification warning:', err);
    }

    return false;
  }

  /**
   * Initializes or returns the active Web Worker instance
   */
  initWorker() {
    return this.ensureWorker();
  }

  /**
   * Initializes the Web Worker if not already spawned
   */
  ensureWorker() {
    if (this.worker) return this.worker;

    if (typeof window === 'undefined' || typeof Worker === 'undefined') {
      return null;
    }

    try {
      this.worker = new Worker(
        new URL('../workers/aiModelWorker.js', import.meta.url),
        { type: 'module' }
      );

      this.worker.onmessage = (e) => this.handleWorkerMessage(e);
      this.worker.onerror = (err) => {
        console.error('[LocalAIService] Worker uncaught error:', err);
        this.status = 'error';
        this.downloadingModel = null;
        this.notifyListeners({
          type: 'error',
          message: 'Worker error encountered. Falling back to Portfolio-Engine.'
        });
      };

      return this.worker;
    } catch (err) {
      console.warn('[LocalAIService] Web Worker spawn failed:', err);
      return null;
    }
  }

  /**
   * Safe Model Unload & RAM Freeing Protocol:
   * Completely unloads active model, rejects all pending requests,
   * terminates the Web Worker to free 100% RAM & WebGPU buffers, and resets service state to zero.
   */
  unloadCurrentModel() {
    this.clearWatchdog();
    this.isModelLoading = false;
    this.currentLoadSessionId++;

    if (this.worker) {
      try {
        this.worker.terminate();
      } catch (err) {
        console.warn('[LocalAIService] Worker termination error on unload:', err);
      }
      this.worker = null;
    }

    this.pendingRequests.forEach((req) => {
      try {
        if (req.timeoutId) clearTimeout(req.timeoutId);
        req.reject(new Error('Model unloaded: worker terminated to free memory'));
      } catch {}
    });
    this.pendingRequests.clear();

    this.activeModel = null;
    this.activeDtype = null;
    this.downloadingModel = null;
    this.downloadProgress = 0;
    this.downloadFile = '';
    this.downloadLoaded = 0;
    this.downloadTotal = 0;
    this.isCurrentModelCached = false;
    this.pendingActivationModel = null;
    this.status = 'idle';

    this.notifyListeners({
      type: 'unloaded',
      message: 'Active model unloaded and worker terminated. Memory freed.'
    });

    return true;
  }

  /**
   * Terminates current worker thread to guarantee 100% RAM / WebGPU buffer deallocation.
   * Ensures STRICT single active model in RAM at any given moment.
   * Respawns a clean worker ready for the next task.
   */
  terminateAndRespawnWorker() {
    this.clearWatchdog();
    if (this.worker) {
      try {
        this.worker.terminate();
      } catch (err) {
        console.warn('[LocalAIService] Worker termination error:', err);
      }
      this.worker = null;
    }

    // Safely reject any pending requests
    this.pendingRequests.forEach((req) => {
      try {
        if (req.timeoutId) clearTimeout(req.timeoutId);
        req.reject(new Error('Worker terminated to purge previous model from memory'));
      } catch {}
    });
    this.pendingRequests.clear();

    return this.initWorker();
  }

  /**
   * Handles incoming worker messages
   */
  handleWorkerMessage(e) {
    const { type, payload } = e.data || {};
    const msgSessionId = payload?.sessionId;

    // Discard stale messages originating from earlier superseded loading sessions
    if (msgSessionId && msgSessionId !== this.currentLoadSessionId) {
      console.log(`[LocalAIService] Discarding stale message ${type} from session #${msgSessionId} (current: #${this.currentLoadSessionId})`);
      return;
    }

    switch (type) {
      case 'PROGRESS': {
        const loaded = payload.loaded || 0;
        const progress = payload.progress || 0;

        // If actual bytes are downloading or progress is in-flight, it's NOT purely cached
        if (loaded > 0 || (progress > 0 && progress < 100)) {
          this.isCurrentModelCached = false;
          this.status = 'downloading';
        }

        // Only break/drop progress if genuinely loading from cache with no network download bytes
        if (this.isCurrentModelCached && (!loaded || loaded === 0) && progress >= 100) {
          break;
        }

        this.status = 'downloading';
        this.downloadProgress = progress;
        this.downloadFile = payload.file || '';
        this.downloadLoaded = loaded;
        this.downloadTotal = payload.total || 0;
        if (payload.modelId && (!this.downloadingModel || this.downloadingModel.id !== payload.modelId)) {
          this.downloadingModel = this.getModelDetails(payload.modelId);
        }

        // Check if progress or bytes have actually advanced
        const hasAdvanced = loaded > this.lastLoadedBytes || progress > this.lastProgressPercent || (payload.file && payload.file !== this.downloadFile);
        if (hasAdvanced) {
          this.lastLoadedBytes = loaded;
          this.lastProgressPercent = progress;
          this.lastProgressTimestamp = Date.now();
          this.lastHeartbeatLoadedBytes = loaded;
          this.lastHeartbeatProgress = progress;
          this.lastHeartbeatTime = this.lastProgressTimestamp;

          // If download reached 100%, switch to compilation grace window
          if (progress >= 100) {
            this.armProgressWatchdog(payload.modelId || this.downloadingModel?.id, this.compilationWatchdogMs, 'compilation_timeout');
          } else {
            // Reset stall watchdog so download never aborts as long as bytes or progress advance
            this.resetWatchdogHeartbeat(payload.modelId || this.downloadingModel?.id, this.watchdogDurationMs, 'timeout_watchdog_stalled');
          }
        }

        this.notifyListeners({
          type: 'downloading',
          model: this.downloadingModel,
          silent: this.isSilentLoad
        });
        break;
      }

      case 'MODEL_READY': {
        this.clearWatchdog();
        this.isModelLoading = false;
        this.isSilentLoad = false;
        const { modelId, healthCheck } = payload;

        // Health-Check evaluation: Log warm-up latency without triggering downgrades
        if (healthCheck && healthCheck.isSlow) {
          console.warn(`[LocalAIService] Model ${modelId} warm-up latency: TTFT ${healthCheck.ttftMs}ms, TPS ${healthCheck.tps}. Model ready.`);
        }

        const wasCached = this.status === 'loading_cache' || this.isCurrentModelCached;
        this.downloadProgress = 100;
        const details = this.getModelDetails(payload.modelId);
        this.isCurrentModelCached = true;
        this.downloadingModel = null;

        // Persist cached flag in localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            localStorage.setItem('portfolio_ai_cached_' + payload.modelId, 'true');
          } catch {
            // ignore
          }
        }

        const notificationMsg = `⚡ ऑन-डिवाइस AI तैयार है! Model ${details.shortcut} is loaded & running 100% locally.`;

        // Autonomous Always-On activation: directly become ready without asking for confirmation or reboot
        this.status = 'ready';
        this.activeDtype = payload.dtype || 'q4';
        this.activeModel = {
          id: payload.modelId,
          name: details.name,
          shortcut: details.shortcut,
          sizeMB: details.sizeMB,
          device: payload.device,
          dtype: payload.dtype || this.activeDtype,
          healthCheck: healthCheck || null
        };
        this.pendingActivationModel = null;

        // Zero Irritation: 100% silent (no popup/toast)
        this.notifyListeners({
          type: 'ready',
          model: this.activeModel,
          message: notificationMsg,
          silent: true
        });

        // Broadcast global custom event for portfolio integration
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('portfolio:ai-model-ready', {
              detail: { model: this.activeModel, message: notificationMsg, wasCached }
            })
          );
        }
        break;
      }

      case 'TOKEN_STREAM': {
        const { requestId, chunk } = payload || {};
        const req = this.pendingRequests.get(requestId);
        if (req) {
          req.accumulatedText = (req.accumulatedText || '') + (chunk || '');
          if (typeof req.onToken === 'function') {
            try {
              req.onToken(chunk, req.accumulatedText);
            } catch (cbErr) {
              console.warn('[LocalAIService] onToken callback error:', cbErr);
            }
          }
        }
        break;
      }

      case 'GENERATION_CANCELLED': {
        this.status = 'ready';
        const { requestId, text } = payload || {};
        const resolver = this.pendingRequests.get(requestId);
        if (resolver) {
          if (resolver.timeoutId) clearTimeout(resolver.timeoutId);
          resolver.resolve({
            text: text || resolver.accumulatedText || '',
            modelShortcut: this.getShortcutForModelId(this.activeModel?.id),
            cancelled: true
          });
          this.pendingRequests.delete(requestId);
        }
        this.notifyListeners();
        break;
      }

      case 'GENERATION_COMPLETE': {
        this.status = 'ready';
        const { text, requestId, modelId } = payload;
        const resolver = this.pendingRequests.get(requestId);
        if (resolver) {
          if (resolver.timeoutId) clearTimeout(resolver.timeoutId);
          const finalText = text || resolver.accumulatedText || '';
          resolver.resolve({
            text: finalText,
            modelShortcut: this.getShortcutForModelId(modelId || this.activeModel?.id)
          });
          this.pendingRequests.delete(requestId);
        }
        this.notifyListeners();
        break;
      }

      case 'GENERATION_ERROR': {
        this.status = 'ready';
        const { error, requestId } = payload;
        const resolver = this.pendingRequests.get(requestId);
        if (resolver) {
          if (resolver.timeoutId) clearTimeout(resolver.timeoutId);
          resolver.reject(new Error(error));
          this.pendingRequests.delete(requestId);
        }
        this.notifyListeners();
        break;
      }

      case 'DEVICE_LOST': {
        this.clearWatchdog();
        this.isModelLoading = false;
        const failedModelId = payload?.modelId || this.activeModel?.id || this.downloadingModel?.id;
        console.warn(`[LocalAIService] Worker reported WebGPU context loss (DEVICE_LOST) for ${failedModelId}. Triggering downgrade cascade...`);
        this.handleModelDowngrade(failedModelId, 'device_lost');
        break;
      }

      case 'ERROR': {
        this.clearWatchdog();
        this.isModelLoading = false;
        console.warn('[LocalAIService] Worker reported error:', payload);
        const failedModelId = payload?.modelId || this.activeModel?.id;
        const reason = payload?.reason || (payload?.isOOM ? 'oom_allocation_failed' : 'load_error');
        this.handleModelDowngrade(failedModelId, reason);
        break;
      }

      case 'LOAD_ABORTED': {
        this.clearWatchdog();
        this.isModelLoading = false;
        console.log(`[LocalAIService] Worker acknowledged load abort for session #${payload?.sessionId}`);
        break;
      }

      default:
        break;
    }
  }

  /**
   * Cascading Model Ladder & RAM Purge:
   * Recommended -> Mid (Qwen-0.5B) -> Bare-Minimum (SmolLM-135M) -> [Portfolio-Engine]
   * Guarantees that at any point, exactly 1 model remains active in memory.
   */
  async handleModelDowngrade(failedModelId, reason = 'slow_performance') {
    const nextModel = getNextDowngradeModel(failedModelId);

    // Strict single active model in RAM: terminate old worker thread to purge all WebGPU/WASM buffers
    this.terminateAndRespawnWorker();

    if (nextModel) {
      console.warn(`[LocalAIService] Cascading downgrade from ${failedModelId} to ${nextModel.shortcut} (Reason: ${reason})`);
      const noticeMessage = `⚡ आपके डिवाइस की स्मूथनेस और तेज़ गति बनाए रखने के लिए अनुकूलित ${nextModel.shortcut} मॉडल सक्रिय कर दिया गया है।`;

      this.status = 'downloading';
      this.downloadingModel = this.getModelDetails(nextModel.id);

      this.notifyListeners({
        type: 'auto_downgrade',
        model: nextModel,
        previousModelId: failedModelId,
        reason,
        notice: noticeMessage,
        message: noticeMessage
      });

      const isCached = await this.isModelCached(nextModel.id);
      await this.loadModelInWorker(nextModel.id, nextModel.dtype || 'q4', isCached);
    } else {
      console.warn(`[LocalAIService] Lowest model tier reached or failed. Falling back to deterministic Portfolio-Engine.`);
      this.status = 'idle';
      this.activeModel = null;
      this.downloadingModel = null;
      this.isAiEnabled = false;
      this.isModelLoading = false;

      const noticeMessage = `⚡ आपके डिवाइस की स्मूथनेस और तेज़ गति बनाए रखने के लिए अनुकूलित [Portfolio-Engine] मॉडल सक्रिय कर दिया गया है।`;

      this.notifyListeners({
        type: 'auto_downgrade',
        model: { id: 'portfolio-engine', shortcut: '[Portfolio-Engine]', name: 'Offline Knowledge Engine' },
        previousModelId: failedModelId,
        reason: 'fallback_to_engine',
        notice: noticeMessage,
        message: noticeMessage
      });
    }
  }

  /**
   * Helper to resolve shortcut names
   */
  getShortcutForModelId(id) {
    if (!id) return '[Portfolio-Engine]';
    if (id.includes('SmolLM2-135M')) return '[SmolLM-135M]';
    if (id.includes('SmolLM2-360M')) return '[SmolLM-360M]';
    if (id.includes('Qwen2.5-0.5B')) return '[Qwen-0.5B]';
    if (id.includes('Qwen2.5-1.5B')) return '[Qwen-1.5B]';
    if (id.includes('Coder-3B') || id.includes('Qwen2.5-3B')) return '[Qwen-3B]';
    return `[${id.split('/').pop()}]`;
  }

  /**
   * Always-On AI: Autonomous Silent Background Preload
   * 1. Profiles device hardware capabilities in the background
   * 2. Defaults to MODEL_CATALOG.BARE_MINIMUM (SmolLM2-135M-Instruct) for ultra-fast, 100% crash-proof load
   * 3. Warms up the model silently in Web Worker with zero intrusive UI popups (silent: true strictly enforced)
   */
  async initSilentDownload() {
    if (this.status === 'ready' || this.status === 'downloading' || this.status === 'loading_cache' || this.status === 'compiling' || this.status === 'switching' || this.activeModel) {
      return;
    }
    if (this.silentDownloadInitiated && (this.worker || this.status === 'profiling')) {
      return;
    }

    this.silentDownloadInitiated = true;
    this.isAiEnabled = true;
    this.hasUserConsented = true;

    const worker = this.initWorker();
    if (!worker) return;

    try {
      this.status = 'profiling';
      this.notifyListeners({ type: 'profiling', silent: true });

      const preloadSessionToken = this.currentLoadSessionId;

      if (!this.deviceProfile) {
        this.deviceProfile = await profileDevice();
      }

      // Check if another load or upgrade took precedence while profiling
      if (this.currentLoadSessionId !== preloadSessionToken || !this.isAiEnabled) {
        return;
      }

      // Default silent load: ALWAYS MODEL_CATALOG.BARE_MINIMUM (SmolLM2-135M-Instruct)
      const targetModel = MODEL_CATALOG.BARE_MINIMUM || getBareMinimumModel();
      const targetModelId = targetModel.id;

      const isCached = await this.isModelCached(targetModelId);

      // Check again if an upgrade or switch superseded during cache check
      if (this.currentLoadSessionId !== preloadSessionToken || !this.isAiEnabled) {
        return;
      }

      await this.loadModelInWorker(targetModelId, targetModel.dtype || 'q4', isCached, { silent: true });
    } catch (err) {
      console.warn('[LocalAIService] Silent initialization warning:', err);
      this.status = 'idle';
      this.notifyListeners({ type: 'idle', silent: true });
    }
  }

  /**
   * Upgrades to recommended model when user gives consent in chat
   */
  async upgradeToRecommendedModel() {
    this.hasUserConsented = true;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('portfolio_ai_model_consent', 'enabled');
      } catch {
        // ignore
      }
    }

    if (!this.deviceProfile) {
      this.deviceProfile = await profileDevice();
    }

    // Default strictly to MODEL_CATALOG.BARE_MINIMUM (SmolLM2-135M, ~90MB) for ultra-fast, zero-friction load
    let targetModel = MODEL_CATALOG.BARE_MINIMUM || getBareMinimumModel();

    // If target model is already loaded and ready, skip redundant reload
    if (this.activeModel && this.activeModel.id === targetModel.id && this.status === 'ready') {
      return;
    }

    // If target model is already downloading/compiling, skip redundant reload
    if (this.downloadingModel && this.downloadingModel.id === targetModel.id && (this.status === 'downloading' || this.status === 'compiling' || this.status === 'loading_cache')) {
      return;
    }

    const isCached = await this.isModelCached(targetModel.id);
    await this.loadModelInWorker(targetModel.id, targetModel.dtype || 'q4', isCached);
  }

  /**
   * Sends model load command to Web Worker with Strict Mutex Lock & Monotonic Session ID
   */
  async loadModelInWorker(modelId, dtype = 'q4', forceCached = null, options = {}) {
    this.currentLoadSessionId++;
    const sessionId = this.currentLoadSessionId;
    const isSilent = typeof options === 'boolean' ? options : !!options?.silent;
    this.isSilentLoad = isSilent;

    // Strict Mutex & Immediate Abort: If a load/download is already active, abort immediately to purge GPU/WASM buffers
    if (this.status === 'downloading' || this.status === 'loading_cache' || this.isModelLoading) {
      console.log(`[LocalAIService] Preempting active model load for new session #${sessionId} (target: ${modelId})`);
      this.clearWatchdog();
      this.terminateAndRespawnWorker();
    }

    const worker = this.initWorker();
    if (!worker) {
      this.isModelLoading = false;
      return;
    }

    this.isModelLoading = true;
    this.clearWatchdog();

    this.lastProgressTimestamp = Date.now();
    this.lastLoadedBytes = 0;
    this.lastProgressPercent = 0;
    this.lastHeartbeatTime = this.lastProgressTimestamp;
    this.lastHeartbeatLoadedBytes = 0;
    this.lastHeartbeatProgress = 0;

    // Arm initial watchdog synchronously
    this.armProgressWatchdog(modelId, this.watchdogDurationMs, 'timeout_watchdog_stalled');

    const isCached = forceCached !== null ? forceCached : await this.isModelCached(modelId);
    if (sessionId !== this.currentLoadSessionId) {
      console.log(`[LocalAIService] Session #${sessionId} superseded during cache check (current: #${this.currentLoadSessionId})`);
      return;
    }

    this.isCurrentModelCached = isCached;

    // If loading from cache, allow compilation budget; otherwise standard stall budget
    const initialTimeout = isCached ? this.compilationWatchdogMs : this.watchdogDurationMs;
    this.armProgressWatchdog(modelId, initialTimeout, isCached ? 'compilation_timeout' : 'timeout_watchdog_stalled');

    // Immediate WebGPU capability detection: check navigator.gpu directly if deviceProfile is pending
    const hasWebGpu = (typeof navigator !== 'undefined' && !!navigator.gpu) || !!this.deviceProfile?.webgpu?.supported;
    const devicePreference = this.executionBackend || 'webgpu';
    const device = devicePreference === 'wasm' ? 'wasm' : (hasWebGpu ? 'webgpu' : 'wasm');

    if (isCached) {
      // Silent cache loading: internal status 'loading_cache', no download progress, no UI download event
      this.status = 'loading_cache';
      this.downloadingModel = null;
      this.downloadProgress = 100;
      this.downloadFile = '';
      this.notifyListeners({
        type: 'loading_cache',
        silent: true
      });
    } else {
      // True network download: status 'downloading', show progress bar
      this.status = 'downloading';
      this.downloadProgress = 0;
      this.downloadFile = '';
      this.downloadingModel = this.getModelDetails(modelId);
      this.notifyListeners({
        type: 'downloading',
        model: this.downloadingModel,
        message: `Downloading on-device model: ${this.downloadingModel.name} (~${this.downloadingModel.sizeMB}MB)`,
        silent: isSilent
      });
    }

    worker.postMessage({
      type: 'LOAD_MODEL',
      payload: { modelId, device, dtype, isCached, sessionId }
    });
  }

  /**
   * Disables On-Device AI and switches completely to deterministic offline knowledge engine
   */
  turnOffAI() {
    this.clearWatchdog();
    this.isAiEnabled = false;
    this.isModelLoading = false;
    this.status = 'idle';
    this.activeModel = null;
    this.downloadingModel = null;
    this.isCurrentModelCached = false;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('portfolio_ai_model_consent', 'disabled');
      } catch {
        // ignore
      }
    }
    // Strict single active model in RAM: terminate worker thread completely on turnOff
    if (this.worker) {
      try {
        this.worker.terminate();
      } catch (err) {
        console.warn('[LocalAIService] Worker termination error:', err);
      }
      this.worker = null;
    }
    this.pendingRequests.clear();

    this.notifyListeners({
      type: 'off',
      message: '🔌 On-Device AI Turned Off. Running 100% on Offline Knowledge Engine.'
    });
  }

  /**
   * Turns On On-Device AI, restoring target model or recommended model
   */
  async turnOnAI(targetModelId = null) {
    this.isAiEnabled = true;
    this.hasUserConsented = true;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('portfolio_ai_model_consent', 'enabled');
      } catch {
        // ignore
      }
    }
    if (!this.deviceProfile) {
      this.deviceProfile = await profileDevice();
    }
    let target = targetModelId
      ? this.getModelDetails(targetModelId)
      : (MODEL_CATALOG.BARE_MINIMUM || getBareMinimumModel());
    const isCached = await this.isModelCached(target.id);
    await this.loadModelInWorker(target.id, target.dtype || 'q4', isCached);
  }

  /**
   * 1-Click quick toggle between On-Device AI and Offline Engine
   */
  toggleAI() {
    if (this.status === 'ready' || this.status === 'downloading' || this.status === 'loading_cache' || this.activeModel) {
      this.turnOffAI();
      return false;
    } else {
      this.turnOnAI();
      return true;
    }
  }

  /**
   * Activates a model (either freshly downloaded or cached) and syncs state
   */
  async activateModel(modelId) {
    const targetId = modelId || this.pendingActivationModel?.id || this.activeModel?.id;
    if (!targetId || targetId === 'portfolio-engine') {
      this.turnOffAI();
      return;
    }
    const details = this.getModelDetails(targetId);
    this.isAiEnabled = true;
    this.hasUserConsented = true;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('portfolio_ai_model_consent', 'enabled');
        localStorage.setItem('portfolio_ai_cached_' + details.id, 'true');
      } catch {}
    }

    const hasWebGpuDirect = (typeof navigator !== 'undefined' && !!navigator.gpu) || !!this.deviceProfile?.webgpu?.supported;
    this.status = 'ready';
    this.activeModel = {
      id: details.id,
      name: details.name,
      shortcut: details.shortcut,
      sizeMB: details.sizeMB,
      device: this.executionBackend === 'wasm' ? 'wasm' : (hasWebGpuDirect ? 'webgpu' : 'wasm'),
      dtype: 'q4',
      ...(this.pendingActivationModel?.id === details.id ? this.pendingActivationModel : {})
    };
    this.isCurrentModelCached = true;
    this.downloadingModel = null;
    this.pendingActivationModel = null;

    if (!this.worker) {
      this.ensureWorker();
      const isCached = await this.isModelCached(details.id);
      await this.loadModelInWorker(details.id, 'q4', isCached);
    }

    const notificationMsg = `⚡ ऑन-डिवाइस AI तैयार है! Model ${this.activeModel?.shortcut || details.shortcut} is loaded & running 100% locally.`;
    this.notifyListeners({
      type: 'ready',
      model: this.activeModel,
      message: notificationMsg,
      silent: false
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('portfolio:ai-model-ready', {
          detail: { model: this.activeModel, message: notificationMsg, wasCached: false }
        })
      );
    }
  }

  /**
   * Switches model to specified ID from catalog or offlines if portfolio-engine
   * Implements Safe Unload & RAM Freeing Protocol:
   * 1. यदि वर्कर सक्रिय है, तो this.worker.terminate() चलाएं।
   * 2. सभी पेंडिंग इन्फरेंस रिक्वेस्ट्स और प्रॉमिस रिजेक्ट करें।
   * 3. this.worker = null; this.activeModel = null; this.activeDtype = null;
   * 4. this.status = 'switching'; ब्रॉडकास्ट करें (ताकि UI ऑरेंज हो सके और "Your new model is loading in chat box..." दिखे)।
   * 5. 300ms एसिंक्रोनस कूलडाउन: await new Promise((r) => setTimeout(r, 300));
   * 6. नया वर्कर स्पॉन करें: this.initWorker();
   * 7. नया मॉडल लोड करें: await this.loadModelInWorker(modelId, dtype);
   */
  async switchModel(modelId, dtype = 'q4') {
    const id = (typeof modelId === 'object' && modelId !== null) ? modelId.id : modelId;
    if (!id || id === 'portfolio-engine' || id === 'off') {
      this.turnOffAI();
      return;
    }
    const details = this.getModelDetails(id);

    // Guard: If requested model is already active and ready, no-op
    if (this.activeModel && this.activeModel.id === details.id && this.status === 'ready') {
      return;
    }
    // Guard: If requested model is already downloading/compiling/switching, no-op
    if (this.downloadingModel && this.downloadingModel.id === details.id && (this.status === 'downloading' || this.status === 'compiling' || this.status === 'loading_cache' || this.status === 'switching')) {
      return;
    }

    this.isAiEnabled = true;
    this.hasUserConsented = true;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('portfolio_ai_model_consent', 'enabled');
      } catch {
        // ignore
      }
    }

    this.clearWatchdog();

    // 1. यदि वर्कर सक्रिय है, तो this.worker.terminate() चलाएं।
    if (this.worker) {
      try {
        this.worker.terminate();
      } catch (err) {
        console.warn('[LocalAIService] Worker termination error during switchModel:', err);
      }
    }

    // 2. सभी पेंडिंग इन्फरेंस रिक्वेस्ट्स और प्रॉमिस रिजेक्ट करें।
    this.pendingRequests.forEach((req) => {
      try {
        if (req.timeoutId) clearTimeout(req.timeoutId);
        req.reject(new Error('Model switch: pending request cancelled'));
      } catch {}
    });
    this.pendingRequests.clear();

    // 3. this.worker = null; this.activeModel = null; this.activeDtype = null;
    this.worker = null;
    this.activeModel = null;
    this.activeDtype = null;

    // 4. this.status = 'switching'; ब्रॉडकास्ट करें (ताकि UI ऑरेंज हो सके और "Your new model is loading in chat box..." दिखे)।
    this.status = 'switching';
    this.notifyListeners({
      type: 'switching',
      message: 'Your new model is loading in chat box...',
      notice: 'Your new model is loading in chat box...'
    });

    // 5. 300ms एसिंक्रोनस कूलडाउन: await new Promise((r) => setTimeout(r, 300));
    await new Promise((r) => setTimeout(r, 300));

    // 6. नया वर्कर स्पॉन करें: this.initWorker();
    this.initWorker();

    // 7. नया मॉडल लोड करें: await this.loadModelInWorker(modelId, dtype);
    await this.loadModelInWorker(details?.id || modelId, dtype);
  }

  /**
   * Alias for switchModel with options support
   */
  async loadModel(modelId, options = {}) {
    const id = (typeof modelId === 'object' && modelId !== null) ? modelId.id : modelId;
    return this.switchModel(id, options.dtype || 'q4');
  }

  /**
   * Alias for generateText
   */
  async generate(input) {
    return this.generateText(input);
  }

  /**
   * Generates text response using local model if ready;
   * Accepts string query or options object { prompt, systemPrompt, maxTokens, temperature, onToken, requestId }
   * Dispatches incremental token events via onToken callback.
   * Otherwise returns null so caller can instantly use deterministic queryAssistant.
   */
  async generateText(input) {
    if (!this.isOnline && (!this.activeModel || this.status !== 'ready')) {
      return null;
    }

    if (!this.isAiEnabled || this.status !== 'ready' || !this.activeModel || !this.worker) {
      return null;
    }

    const prompt = typeof input === 'string' ? input : (input?.prompt || '');
    const systemPrompt = typeof input === 'object' ? (input?.systemPrompt || '') : '';
    const maxTokens = (typeof input === 'object' && input?.maxTokens) ? input.maxTokens : 120;
    const temperature = (typeof input === 'object' && input?.temperature !== undefined) ? input.temperature : 0.7;
    const onToken = (typeof input === 'object' && typeof input?.onToken === 'function') ? input.onToken : null;
    const requestedId = (typeof input === 'object' && input?.requestId) ? input.requestId : null;

    const requestId = requestedId || `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    return new Promise((resolve, reject) => {
      // Timeout guard: 8 seconds maximum for local inference
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        this.status = 'ready';
        this.notifyListeners();
        reject(new Error('Local inference timeout'));
      }, 8000);

      this.pendingRequests.set(requestId, {
        resolve: (val) => {
          clearTimeout(timeoutId);
          resolve(val);
        },
        reject: (err) => {
          clearTimeout(timeoutId);
          reject(err);
        },
        onToken,
        accumulatedText: '',
        timeoutId,
        requestId
      });

      this.status = 'generating';
      this.notifyListeners();

      this.worker.postMessage({
        type: 'GENERATE',
        payload: {
          prompt,
          systemPrompt,
          maxTokens,
          temperature,
          requestId
        }
      });
    });
  }

  /**
   * Cancels in-flight generation cleanly and dispatches CANCEL_GENERATION to worker
   */
  cancelGeneration(requestId = null) {
    if (!this.worker) return;

    if (requestId) {
      const req = this.pendingRequests.get(requestId);
      if (req) {
        if (req.timeoutId) clearTimeout(req.timeoutId);
        req.resolve({
          text: req.accumulatedText || '',
          modelShortcut: this.getShortcutForModelId(this.activeModel?.id),
          cancelled: true
        });
        this.pendingRequests.delete(requestId);
      }
      this.worker.postMessage({
        type: 'CANCEL_GENERATION',
        payload: { requestId }
      });
    } else {
      for (const [id, req] of this.pendingRequests.entries()) {
        if (req.timeoutId) clearTimeout(req.timeoutId);
        req.resolve({
          text: req.accumulatedText || '',
          modelShortcut: this.getShortcutForModelId(this.activeModel?.id),
          cancelled: true
        });
      }
      this.pendingRequests.clear();
      this.worker.postMessage({
        type: 'CANCEL_GENERATION',
        payload: {}
      });
    }

    this.status = 'ready';
    this.notifyListeners();
  }
}

// Global Singleton Instance
export const localAIService = new LocalAIService();
export default localAIService;
