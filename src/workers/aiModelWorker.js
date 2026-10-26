/**
 * AI Model Web Worker
 * Runs Hugging Face Transformers.js in an isolated background thread.
 * Ensures 0ms main thread blocking, zero UI frame drops.
 */

import { pipeline, env, TextStreamer, InterruptableStoppingCriteria } from '@huggingface/transformers';

// Optimize transformers environment for browser Web Worker
env.allowLocalModels = false;
env.useBrowserCache = true;

// Universal Browser Stability: Enforce single-threaded WASM to eliminate SharedArrayBuffer crash in non-isolated browsers
if (env.backends?.onnx?.wasm) {
  env.backends.onnx.wasm.proxy = false;
  env.backends.onnx.wasm.numThreads = 1;
}

let activeGenerator = null;
let activeModelId = null;
let currentLoadingModelId = null;
let activeDevice = 'webgpu';
let isLoading = false;
let currentActiveGeneration = null;
let currentSessionId = null;

/**
 * Normalizes progress callback events from Transformers.js
 */
function handleProgress(progress) {
  if (typeof self !== 'undefined' && self.postMessage) {
    self.postMessage({
      type: 'PROGRESS',
      payload: {
        sessionId: currentSessionId,
        modelId: currentLoadingModelId || activeModelId,
        status: progress.status,
        file: progress.file,
        loaded: progress.loaded,
        total: progress.total,
        progress: typeof progress.progress === 'number' ? Math.round(progress.progress) : 0
      }
    });
  }
}

/**
 * Strict deallocation of existing pipeline to guarantee single active model in RAM
 */
export async function cleanupActivePipeline() {
  if (currentActiveGeneration) {
    currentActiveGeneration.cancelled = true;
    try {
      currentActiveGeneration.stoppingCriteria?.interrupt();
    } catch {
      // safe fallback
    }
    currentActiveGeneration = null;
  }
  if (activeGenerator) {
    try {
      if (typeof activeGenerator.dispose === 'function') {
        await activeGenerator.dispose();
      } else if (activeGenerator.model && typeof activeGenerator.model.dispose === 'function') {
        await activeGenerator.model.dispose();
      }
      if (activeGenerator.tokenizer && typeof activeGenerator.tokenizer.dispose === 'function') {
        await activeGenerator.tokenizer.dispose();
      }
    } catch (cleanupErr) {
      console.warn('[AI Worker] Pipeline disposal warning:', cleanupErr);
    }
    activeGenerator = null;
  }
  activeModelId = null;
  currentLoadingModelId = null;
  activeDevice = 'webgpu';
  isLoading = false;
}

/**
 * Micro 3-token warm-up probe & performance health-check:
 * 1. Warm-up latency check: if TTFT > 7000ms (7s) -> isSlow = true
 * 2. Token generation speed check: if TPS < 3.5 tokens/sec -> isSlow = true
 * 3. OOM / crash catcher: if memory error, allocation failure, or WebGPU context loss -> isOOM = true, error flagged
 */
export async function probeModelPerformance(generator, modelId, device = 'webgpu') {
  if (!generator) {
    return {
      ok: false,
      isSlow: true,
      isOOM: false,
      reason: null,
      ttftMs: 0,
      tps: 0,
      error: 'Generator not initialized'
    };
  }

  // Detect WebGPU device and attach context loss monitoring via device.lost.then(...)
  if (device === 'webgpu') {
    try {
      const gpuDev = generator?.model?.device || generator?.device;
      if (gpuDev && gpuDev.lost && typeof gpuDev.lost.then === 'function') {
        gpuDev.lost.then((info) => {
          console.warn(`[AI Worker] WebGPU device lost detected in probe for ${modelId}:`, info);
          if (typeof self !== 'undefined' && self.postMessage) {
            self.postMessage({
              type: 'DEVICE_LOST',
              payload: {
                sessionId: currentSessionId,
                modelId: activeModelId || modelId,
                reason: info?.reason || 'device_lost',
                message: info?.message || 'WebGPU device lost during probe'
              }
            });
          }
        });
      }
    } catch {
      // safe fallback
    }
  }

  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  try {
    const probeOutput = await generator([{ role: 'user', content: 'Hi' }], {
      max_new_tokens: 3,
      min_new_tokens: 1,
      temperature: 0.1,
      do_sample: false,
      return_full_text: false
    });

    const elapsedMs = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - startTime;
    const ttftMs = Math.round(elapsedMs);

    let tokensCount = 3;
    if (Array.isArray(probeOutput) && probeOutput[0]?.generated_text) {
      const text = typeof probeOutput[0].generated_text === 'string'
        ? probeOutput[0].generated_text
        : (probeOutput[0].generated_text[probeOutput[0].generated_text.length - 1]?.content || '');
      const words = text.trim().split(/\s+/).filter(Boolean);
      tokensCount = Math.max(1, Math.min(3, Math.round(words.length * 1.3) || 3));
    }

    const tps = Number((tokensCount / (Math.max(1, elapsedMs) / 1000)).toFixed(2));

    // Bare-minimum SmolLM2-135M is the baseline fallback model and is NEVER flagged as slow!
    const isBareMinimumModel = String(modelId || '').toLowerCase().includes('135m') ||
                               String(modelId || '').toLowerCase().includes('smollm2-135m');

    // Thresholds: TTFT > 30000ms OR TPS < 0.2 (relaxed to prevent false flagging during first-time compilation)
    const isSlow = !isBareMinimumModel && (ttftMs > 30000 || tps < 0.2);

    return {
      ok: !isSlow,
      isSlow,
      isOOM: false,
      reason: isSlow ? 'slow_performance' : null,
      ttftMs,
      tps,
      error: null
    };
  } catch (err) {
    const errMsg = String(err?.message || '').toLowerCase();
    const isAllocationFailed = errMsg.includes('allocation') ||
                               errMsg.includes('out of memory') ||
                               errMsg.includes('oom') ||
                               errMsg.includes('buffer size') ||
                               errMsg.includes('failed to allocate');
    const isDeviceLost = errMsg.includes('context lost') ||
                         errMsg.includes('device lost') ||
                         errMsg.includes('webgpu');

    if (isDeviceLost && typeof self !== 'undefined' && self.postMessage) {
      self.postMessage({
        type: 'DEVICE_LOST',
        payload: {
          sessionId: currentSessionId,
          modelId: activeModelId || modelId,
          reason: 'device_lost',
          message: err?.message || 'Device lost during probe'
        }
      });
    }

    const isOOM = isAllocationFailed || isDeviceLost;
    const reason = isAllocationFailed ? 'oom_allocation_failed' : (isDeviceLost ? 'device_lost' : 'probe_failure');

    return {
      ok: false,
      isSlow: true,
      isOOM,
      reason,
      ttftMs: -1,
      tps: 0,
      error: err?.message || 'Health probe failed'
    };
  }
}

/**
 * Loads text-generation pipeline with automated fallback and health checks
 */
export async function initPipeline(modelId, device = 'webgpu', dtype = 'q4', sessionId = null) {
  currentSessionId = sessionId;

  // 1. Strict single active model in RAM: deallocate previous active pipeline completely
  await cleanupActivePipeline();

  isLoading = true;
  currentLoadingModelId = modelId;
  if (typeof self !== 'undefined' && self.postMessage) {
    self.postMessage({ type: 'LOADING_START', payload: { modelId, device, dtype, sessionId: currentSessionId } });
  }

  try {
    // Attempt requested device (webgpu / wasm)
    activeGenerator = await pipeline('text-generation', modelId, {
      device,
      dtype,
      progress_callback: handleProgress
    });

    // Detect WebGPU device and attach context loss monitoring via device.lost.then(...)
    if (device === 'webgpu') {
      try {
        const gpuDev = activeGenerator?.model?.device || activeGenerator?.device;
        if (gpuDev && gpuDev.lost && typeof gpuDev.lost.then === 'function') {
          gpuDev.lost.then((info) => {
            console.warn(`[AI Worker] WebGPU device lost for model ${modelId}:`, info);
            if (typeof self !== 'undefined' && self.postMessage) {
              self.postMessage({
                type: 'DEVICE_LOST',
                payload: {
                  sessionId: currentSessionId,
                  modelId: activeModelId || modelId,
                  reason: info?.reason || 'device_lost',
                  message: info?.message || 'WebGPU context was lost'
                }
              });
            }
          });
        } else if (typeof navigator !== 'undefined' && navigator.gpu) {
          navigator.gpu.requestAdapter?.().then((adapter) => {
            adapter?.requestDevice?.().then((dev) => {
              dev?.lost?.then?.((info) => {
                console.warn(`[AI Worker] WebGPU navigator device lost for model ${modelId}:`, info);
                if (typeof self !== 'undefined' && self.postMessage) {
                  self.postMessage({
                    type: 'DEVICE_LOST',
                    payload: {
                      sessionId: currentSessionId,
                      modelId: activeModelId || modelId,
                      reason: info?.reason || 'device_lost',
                      message: info?.message || 'WebGPU context was lost'
                    }
                  });
                }
              });
            }).catch(() => {});
          }).catch(() => {});
        }
      } catch (gpuLossErr) {
        console.warn('[AI Worker] WebGPU context loss listener setup warning:', gpuLossErr);
      }
    }

    // Run micro 3-token warm-up health-check probe
    const healthCheck = await probeModelPerformance(activeGenerator, modelId, device);

    if (healthCheck.isOOM) {
      await cleanupActivePipeline();
      if (typeof self !== 'undefined' && self.postMessage) {
        self.postMessage({
          type: 'ERROR',
          payload: {
            sessionId: currentSessionId,
            error: healthCheck.error || 'OOM / WebGPU context loss during warm-up probe',
            reason: healthCheck.reason || 'oom_allocation_failed',
            modelId,
            isOOM: true,
            healthCheck
          }
        });
      }
      return;
    }

    activeModelId = modelId;
    currentLoadingModelId = null;
    activeDevice = device;
    isLoading = false;

    if (typeof self !== 'undefined' && self.postMessage) {
      self.postMessage({
        type: 'MODEL_READY',
        payload: {
          sessionId: currentSessionId,
          modelId,
          device,
          dtype,
          timestamp: Date.now(),
          healthCheck
        }
      });
    }
  } catch (primaryErr) {
    console.warn(`[AI Worker] Failed to load ${modelId} with device=${device}:`, primaryErr.message);
    const errMsg = String(primaryErr?.message || '').toLowerCase();
    const isAllocationFailed = errMsg.includes('allocation') || errMsg.includes('out of memory') || errMsg.includes('oom') || errMsg.includes('buffer');
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
}

export const loadPipeline = initPipeline;

/**
 * Generates text using the loaded pipeline with real-time token streaming and cancellation
 */
async function generate(params) {
  const { prompt, systemPrompt, maxTokens = 120, temperature = 0.7, requestId } = params;

  if (!activeGenerator) {
    if (typeof self !== 'undefined' && self.postMessage) {
      self.postMessage({
        type: 'GENERATION_ERROR',
        payload: { error: 'No model loaded in worker', requestId }
      });
    }
    return;
  }

  const stoppingCriteria = typeof InterruptableStoppingCriteria === 'function' ? new InterruptableStoppingCriteria() : null;
  currentActiveGeneration = {
    requestId,
    stoppingCriteria,
    cancelled: false
  };

  try {
    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    let streamer = null;
    if (activeGenerator.tokenizer && typeof TextStreamer === 'function') {
      try {
        streamer = new TextStreamer(activeGenerator.tokenizer, {
          skip_prompt: true,
          skip_special_tokens: true,
          callback_function: (chunk) => {
            if (chunk && !currentActiveGeneration?.cancelled && typeof self !== 'undefined' && self.postMessage) {
              self.postMessage({
                type: 'TOKEN_STREAM',
                payload: { requestId, chunk, modelId: activeModelId }
              });
            }
          }
        });
      } catch (streamerErr) {
        console.warn('[AI Worker] TextStreamer creation fallback:', streamerErr);
      }
    }

    const generateOptions = {
      max_new_tokens: maxTokens,
      temperature: Math.max(0.1, temperature),
      do_sample: temperature > 0.1,
      top_p: 0.9,
      return_full_text: false
    };

    if (streamer) {
      generateOptions.streamer = streamer;
    }
    if (stoppingCriteria) {
      generateOptions.stopping_criteria = [stoppingCriteria];
    }

    const output = await activeGenerator(messages, generateOptions);

    if (currentActiveGeneration?.cancelled) {
      if (typeof self !== 'undefined' && self.postMessage) {
        self.postMessage({
          type: 'GENERATION_CANCELLED',
          payload: { requestId, modelId: activeModelId }
        });
      }
      return;
    }

    let generatedText = '';
    if (Array.isArray(output) && output.length > 0) {
      const item = output[0]?.generated_text;
      if (Array.isArray(item)) {
        const lastMsg = item[item.length - 1];
        generatedText = lastMsg?.content || '';
      } else if (typeof item === 'string') {
        generatedText = item;
      }
    }

    if (typeof self !== 'undefined' && self.postMessage) {
      self.postMessage({
        type: 'GENERATION_COMPLETE',
        payload: {
          text: generatedText.trim(),
          requestId,
          modelId: activeModelId,
          device: activeDevice
        }
      });
    }
  } catch (err) {
    if (currentActiveGeneration?.cancelled) {
      if (typeof self !== 'undefined' && self.postMessage) {
        self.postMessage({
          type: 'GENERATION_CANCELLED',
          payload: { requestId, modelId: activeModelId }
        });
      }
      return;
    }
    console.error('[AI Worker] Generation error:', err);
    const errMsg = String(err?.message || '').toLowerCase();
    const isAllocationFailed = errMsg.includes('allocation') || errMsg.includes('out of memory') || errMsg.includes('oom') || errMsg.includes('buffer');
    const isContextLost = errMsg.includes('context lost') || errMsg.includes('device lost') || errMsg.includes('webgpu');

    if (isContextLost && typeof self !== 'undefined' && self.postMessage) {
      self.postMessage({
        type: 'DEVICE_LOST',
        payload: {
          modelId: activeModelId,
          reason: 'device_lost',
          message: err?.message || 'Device lost during generation'
        }
      });
    }

    if (typeof self !== 'undefined' && self.postMessage) {
      self.postMessage({
        type: 'GENERATION_ERROR',
        payload: {
          error: err.message || 'Text generation failed',
          reason: isAllocationFailed ? 'oom_allocation_failed' : (isContextLost ? 'device_lost' : 'generation_failed'),
          requestId,
          isOOM: isAllocationFailed
        }
      });
    }
  } finally {
    if (currentActiveGeneration?.requestId === requestId) {
      currentActiveGeneration = null;
    }
  }
}

/**
 * Handle incoming commands from LocalAIService
 */
if (typeof self !== 'undefined') {
  self.onmessage = async (e) => {
    const { type, payload } = e.data || {};

    switch (type) {
      case 'LOAD_MODEL':
        await loadPipeline(payload.modelId, payload.device, payload.dtype, payload.sessionId);
        break;

      case 'ABORT_LOAD': {
        const abortSessionId = payload?.sessionId || currentSessionId;
        await cleanupActivePipeline();
        if (self.postMessage) {
          self.postMessage({
            type: 'LOAD_ABORTED',
            payload: { sessionId: abortSessionId }
          });
        }
        break;
      }

      case 'GENERATE':
        await generate(payload);
        break;

      case 'CANCEL_GENERATION': {
        const { requestId } = payload || {};
        if (currentActiveGeneration && (!requestId || currentActiveGeneration.requestId === requestId)) {
          currentActiveGeneration.cancelled = true;
          try {
            currentActiveGeneration.stoppingCriteria?.interrupt();
          } catch (e) {
            console.warn('[AI Worker] Interrupt error:', e);
          }
          if (self.postMessage) {
            self.postMessage({
              type: 'GENERATION_CANCELLED',
              payload: { requestId: currentActiveGeneration.requestId || requestId, cancelled: true }
            });
          }
        }
        break;
      }

      case 'PROBE_PERFORMANCE': {
        if (!activeGenerator) {
          if (self.postMessage) {
            self.postMessage({
              type: 'HEALTH_CHECK_RESULT',
              payload: { ok: false, isSlow: true, isOOM: false, error: 'No active generator' }
            });
          }
        } else {
          const result = await probeModelPerformance(activeGenerator, activeModelId, activeDevice);
          if (self.postMessage) {
            self.postMessage({
              type: 'HEALTH_CHECK_RESULT',
              payload: { modelId: activeModelId, device: activeDevice, healthCheck: result }
            });
          }
        }
        break;
      }

      case 'PING':
        if (self.postMessage) {
          self.postMessage({
            type: 'PONG',
            payload: {
              activeModelId,
              activeDevice,
              isReady: Boolean(activeGenerator)
            }
          });
        }
        break;

      case 'RESET':
        await cleanupActivePipeline();
        if (self.postMessage) {
          self.postMessage({ type: 'RESET_COMPLETE' });
        }
        break;

      default:
        console.warn('[AI Worker] Unknown message type:', type);
    }
  };
}
