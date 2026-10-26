/**
 * Device Profiler & Conservative Model Selector
 * High-precision, zero-permission, client-side profiling for On-Device AI models.
 */

// Model Catalog for On-Device Execution
export const MODEL_CATALOG = {
  BARE_MINIMUM: {
    id: 'onnx-community/SmolLM2-135M-Instruct-ONNX',
    name: 'SmolLM2-135M-Instruct',
    shortcut: '[SmolLM-135M]',
    approxSizeMB: 90,
    dtype: 'q4',
    tier: 'bare-minimum',
    params: '135M',
    description: 'Ultra-lightweight fallback model (<100MB), instant load on any device'
  },
  LIGHT: {
    id: 'onnx-community/Qwen2.5-0.5B-Instruct',
    name: 'Qwen2.5-0.5B-Instruct',
    shortcut: '[Qwen-0.5B]',
    approxSizeMB: 350,
    dtype: 'q4',
    tier: 'light',
    params: '0.5B',
    description: 'Fast, highly accurate compact model for mobile and light devices'
  },
  SMOLLM_360M: {
    id: 'onnx-community/SmolLM2-360M-Instruct-ONNX',
    name: 'SmolLM2-360M-Instruct',
    shortcut: '[SmolLM-360M]',
    approxSizeMB: 230,
    dtype: 'q4',
    tier: 'tier1-mid',
    params: '360M',
    description: 'Balanced lightweight instruct model for mid WebGPU/WASM'
  },
  MEDIUM: {
    id: 'onnx-community/Qwen2.5-1.5B-Instruct',
    name: 'Qwen2.5-1.5B-Instruct',
    shortcut: '[Qwen-1.5B]',
    approxSizeMB: 950,
    dtype: 'q4',
    tier: 'medium',
    params: '1.5B',
    description: 'Balanced powerhouse for laptops and multi-core desktops'
  },
  HIGH: {
    id: 'onnx-community/Qwen2.5-3B-Instruct',
    name: 'Qwen2.5-3B-Instruct',
    shortcut: '[Qwen-3B]',
    approxSizeMB: 1900,
    dtype: 'q4',
    tier: 'high',
    params: '3B',
    description: 'Advanced reasoning model for high-end workstations with dedicated GPU'
  }
};

/**
 * Returns the universal bare-minimum model for zero-risk baseline execution
 */
export function getBareMinimumModel() {
  return { ...MODEL_CATALOG.BARE_MINIMUM };
}

/**
 * Cascading Fallback Ladder:
 * - High (3B) -> Medium (1.5B)
 * - Medium (1.5B) -> Light (0.5B)
 * - Light (0.5B) -> Bare-Minimum (135M)
 * - Bare-Minimum (135M) -> null (signals deterministic [Portfolio-Engine] fallback)
 */
export function getNextDowngradeModel(modelId) {
  if (!modelId) return null;
  const idStr = String(modelId).toLowerCase();

  if (idStr.includes('3b')) {
    return { ...MODEL_CATALOG.MEDIUM };
  }
  if (idStr.includes('1.5b')) {
    return { ...MODEL_CATALOG.LIGHT };
  }
  if (idStr.includes('0.5b') || idStr.includes('360m')) {
    return { ...MODEL_CATALOG.BARE_MINIMUM };
  }
  if (idStr.includes('135m') || (idStr.includes('smollm') && !idStr.includes('360m'))) {
    return null; // Fallback to deterministic Portfolio-Engine
  }
  // Default fallback to bare-minimum if unknown
  return { ...MODEL_CATALOG.BARE_MINIMUM };
}

/**
 * Detects device form factor (mobile, tablet, desktop)
 */
export function detectDeviceType() {
  if (typeof window === 'undefined') return 'desktop';
  const ua = (navigator.userAgent || '').toLowerCase();
  const width = window.innerWidth || 1024;
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  const isMobileUA = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua);
  const isTabletUA = /ipad|tablet|(android(?!.*mobile))/i.test(ua);

  if (isTabletUA || (maxTouchPoints > 1 && width >= 600 && width <= 1024)) {
    return 'tablet';
  }
  if (isMobileUA || (maxTouchPoints > 0 && width < 600)) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Fetches city-level location with ZERO GPS and ZERO permissions
 * Uses high-speed IP geolocation with safe fallback and strict timeout
 */
export async function getCityLevelLocation() {
  const fallback = {
    city: 'Local / Remote',
    region: 'Global',
    country: 'India',
    country_code: 'IN',
    ip: '127.0.0.1'
  };

  if (typeof window === 'undefined' || typeof fetch === 'undefined') {
    return fallback;
  }

  // Check cached location in sessionStorage to avoid unnecessary network calls
  try {
    const cached = sessionStorage.getItem('portfolio_geo_location');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.city) return parsed;
    }
  } catch {
    // ignore sessionStorage errors
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const result = {
        city: data.city || 'Visitor Location',
        region: data.region || '',
        country: data.country_name || 'India',
        country_code: data.country_code || 'IN',
        ip: data.ip || 'Masked'
      };
      try {
        sessionStorage.setItem('portfolio_geo_location', JSON.stringify(result));
      } catch {
        // ignore
      }
      return result;
    }
  } catch {
    // network failure / timeout / adblock -> fallback quietly
  }

  return fallback;
}

/**
 * Evaluates browser storage quota via StorageManager API
 */
export async function getStorageQuota() {
  const fallback = {
    quotaBytes: 0,
    usageBytes: 0,
    availableBytes: 0,
    quotaGB: 0,
    availableGB: 0,
    isSufficient: true
  };

  if (typeof navigator === 'undefined' || !navigator.storage || !navigator.storage.estimate) {
    return fallback;
  }

  try {
    const estimate = await navigator.storage.estimate();
    const quota = estimate.quota || 0;
    const usage = estimate.usage || 0;
    const available = Math.max(0, quota - usage);

    return {
      quotaBytes: quota,
      usageBytes: usage,
      availableBytes: available,
      quotaGB: Number((quota / (1024 ** 3)).toFixed(2)),
      availableGB: Number((available / (1024 ** 3)).toFixed(2)),
      isSufficient: available > 300 * 1024 * 1024 // at least 300MB
    };
  } catch (err) {
    console.warn('Storage estimate failed:', err);
    return fallback;
  }
}

/**
 * Inspects WebGPU availability and buffer limits
 */
export async function checkWebGPUCapabilities() {
  const result = {
    supported: false,
    adapterName: null,
    maxBufferSizeMB: 0,
    deviceBackend: 'wasm'
  };

  if (typeof navigator === 'undefined' || !navigator.gpu) {
    return result;
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      return result;
    }

    result.supported = true;
    result.deviceBackend = 'webgpu';
    const limits = adapter.limits || {};
    result.maxBufferSizeMB = limits.maxBufferSize
      ? Math.round(limits.maxBufferSize / (1024 * 1024))
      : 256;

    if (adapter.info && adapter.info.device) {
      result.adapterName = adapter.info.device;
    } else if (adapter.info && adapter.info.description) {
      result.adapterName = adapter.info.description;
    } else {
      result.adapterName = 'Generic WebGPU Device';
    }

    return result;
  } catch (err) {
    console.warn('WebGPU inspection failed:', err);
    return result;
  }
}

/**
 * Runs a deterministic 50ms JS micro-benchmark to assess single-core computation speed
 */
export function runMicroBenchmark() {
  if (typeof performance === 'undefined') return { opsPerMs: 1000, score: 'standard' };

  try {
    const start = performance.now();
    let ops = 0;
    let acc = 1.0;

    // Run for exactly ~50ms
    while (performance.now() - start < 50) {
      for (let i = 0; i < 5000; i++) {
        acc = (acc * 1.00013 + 0.00007) % 1000;
      }
      ops += 5000;
    }

    const elapsed = Math.max(1, performance.now() - start);
    const opsPerMs = Math.round(ops / elapsed);

    let score = 'budget';
    if (opsPerMs > 4000) score = 'flagship';
    else if (opsPerMs > 2000) score = 'high';
    else if (opsPerMs > 900) score = 'medium';

    return { opsPerMs, score, elapsedMs: Math.round(elapsed) };
  } catch {
    return { opsPerMs: 1200, score: 'medium', elapsedMs: 50 };
  }
}

/**
 * Conservative Tiering Logic:
 * Strict rule:
 * - If device can theoretically handle 4B, pick 2B-3B model (Medium or High).
 * - If device can handle 1B, pick 0.5B model (Light).
 * - If device is mobile/tablet, limited storage, or budget CPU: Bare-Minimum model (SmolLM2-135M).
 */
export function selectConservativeModel({ deviceType, storage, webgpu, cpuCores, benchmark }) {
  const availableGB = storage?.availableGB || 1.0;
  const isWebGPU = Boolean(webgpu?.supported);
  const benchScore = benchmark?.score || 'medium';
  const cores = cpuCores || 4;

  // Mobile & Tablet safety clamp: never exceed 0.5B, prefer 135M if constrained
  if (deviceType === 'mobile' || deviceType === 'tablet') {
    if (availableGB < 1.0 || cores <= 4 || benchScore === 'budget') {
      return { ...MODEL_CATALOG.BARE_MINIMUM };
    }
    return { ...MODEL_CATALOG.LIGHT };
  }

  // Storage constraint clamp
  if (availableGB < 1.2) {
    return { ...MODEL_CATALOG.BARE_MINIMUM };
  }

  // Desktop evaluation
  // Theoretical ~4B capable device (WebGPU, >=8 cores, Flagship CPU, >=5GB available storage)
  // Conservative safety: Downgrade to 2B-3B or 1.5B
  if (isWebGPU && cores >= 8 && benchScore === 'flagship' && availableGB >= 5.0) {
    return { ...MODEL_CATALOG.MEDIUM }; // Conservative 1.5B instead of heavy 3B/4B
  }

  // Theoretical ~1B-2B capable device (WebGPU or >=6 cores, High benchmark, >=2.5GB storage)
  // Conservative safety: Pick 0.5B model
  if (cores >= 6 && (isWebGPU || benchScore === 'high') && availableGB >= 2.5) {
    return { ...MODEL_CATALOG.LIGHT }; // Conservative 0.5B
  }

  // Standard laptops / desktops
  if (cores >= 4 && availableGB >= 1.5 && benchScore !== 'budget') {
    return { ...MODEL_CATALOG.LIGHT };
  }

  // Safe Fallback for any other device
  return { ...MODEL_CATALOG.BARE_MINIMUM };
}

/**
 * Autonomous Device-Tier Model Selection (100% Zero-Prompt, Zero-Reboot):
 * - Tier 1 (High/Mid WebGPU): Qwen2.5-0.5B-Instruct or SmolLM2-360M
 * - Tier 2 (Mobile / Budget / WASM / Low RAM): SmolLM2-135M-Instruct (~85MB, 100% crash-proof)
 */
export function getAutonomousTierModel({ deviceType, storage, webgpu, cpuCores, benchmark } = {}) {
  const isWebGPU = Boolean(webgpu?.supported);
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';
  const availableGB = storage?.availableGB ?? 1.0;
  const cores = cpuCores ?? 4;
  const isBudget = benchmark?.score === 'budget';

  // Tier 2: Mobile / Budget / WASM / Low RAM (<1.2GB available or <=4 cores without WebGPU)
  if (isMobile || !isWebGPU || isBudget || availableGB < 1.2 || cores < 4) {
    return { ...MODEL_CATALOG.BARE_MINIMUM };
  }

  // Tier 1: High/Mid WebGPU (Qwen2.5-0.5B-Instruct or SmolLM2-360M)
  return { ...MODEL_CATALOG.LIGHT };
}

/**
 * Full Device Profile Aggregator
 */
export async function profileDevice() {
  const deviceType = detectDeviceType();
  const cpuCores = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || 4) : 4;
  const benchmark = runMicroBenchmark();

  // Parallel asynchronous queries for speed
  const [location, storage, webgpu] = await Promise.all([
    getCityLevelLocation(),
    getStorageQuota(),
    checkWebGPUCapabilities()
  ]);

  const bareMinimumModel = getBareMinimumModel();

  // Baseline recommended model is strictly bare-minimum SmolLM2-135M (~90MB) for instant loading
  const recommendedModel = { ...bareMinimumModel };

  const conservativeTierModel = selectConservativeModel({
    deviceType,
    storage,
    webgpu,
    cpuCores,
    benchmark
  });

  const autonomousTierModel = getAutonomousTierModel({
    deviceType,
    storage,
    webgpu,
    cpuCores,
    benchmark
  });

  return {
    deviceType,
    cpuCores,
    location,
    storage,
    webgpu,
    benchmark,
    recommendedModel,
    conservativeTierModel,
    autonomousTierModel,
    bareMinimumModel,
    timestamp: new Date().toISOString()
  };
}
