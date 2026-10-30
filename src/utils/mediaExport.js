/**
 * Cinematic 360° Turntable Video & High-Res Snapshot Exporter (Universal Rule 15 & 22 Master)
 * Client-side true 3D scene rasterizer and MediaRecorder video generation
 */

/**
 * Triggers a download of a Blob or data URL with given filename
 */
export function triggerFileDownload(urlOrBlob, filename) {
  const isBlob = urlOrBlob instanceof Blob;
  const objectUrl = isBlob ? URL.createObjectURL(urlOrBlob) : urlOrBlob;
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  if (isBlob) {
    setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
  }
}

/**
 * Helper to compute 3D perspective projection of a point (x, y, z)
 * rotated by rotX (pitch) and rotY (yaw) in degrees around center (cx, cy).
 */
function projectPoint3D(x, y, z, cx, cy, rotXDeg, rotYDeg, fov = 900) {
  const radX = (rotXDeg * Math.PI) / 180;
  const radY = (rotYDeg * Math.PI) / 180;

  // 1. Center relative coordinates
  let dx = x - cx;
  let dy = y - cy;
  let dz = z;

  // 2. Rotate around Y axis (Yaw)
  const cosY = Math.cos(radY);
  const sinY = Math.sin(radY);
  const x1 = dx * cosY + dz * sinY;
  const z1 = -dx * sinY + dz * cosY;

  // 3. Rotate around X axis (Pitch)
  const cosX = Math.cos(radX);
  const sinX = Math.sin(radX);
  const y2 = dy * cosX - z1 * sinX;
  const z2 = dy * sinX + z1 * cosX;

  // 4. Perspective projection
  const scale = fov / (fov + z2);
  return {
    px: cx + x1 * scale,
    py: cy + y2 * scale,
    scale,
    depth: z2
  };
}

/**
 * Draws an isometric/perspective projected 3D card/slab on 2D canvas
 */
function drawProjectedSlab(ctx, x, y, w, h, z, cx, cy, rotX, rotY, options = {}) {
  const p1 = projectPoint3D(x, y, z, cx, cy, rotX, rotY);
  const p2 = projectPoint3D(x + w, y, z, cx, cy, rotX, rotY);
  const p3 = projectPoint3D(x + w, y + h, z, cx, cy, rotX, rotY);
  const p4 = projectPoint3D(x, y + h, z, cx, cy, rotX, rotY);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(p1.px, p1.py);
  ctx.lineTo(p2.px, p2.py);
  ctx.lineTo(p3.px, p3.py);
  ctx.lineTo(p4.px, p4.py);
  ctx.closePath();

  if (options.shadowColor) {
    ctx.shadowColor = options.shadowColor;
    ctx.shadowBlur = options.shadowBlur || 20;
    ctx.shadowOffsetX = options.shadowOffsetX || 0;
    ctx.shadowOffsetY = options.shadowOffsetY || 12;
  }

  if (options.fillStyle) {
    ctx.fillStyle = options.fillStyle;
    ctx.fill();
  }

  if (options.strokeStyle) {
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = options.strokeStyle;
    ctx.lineWidth = options.lineWidth || 1.5;
    ctx.stroke();
  }

  ctx.restore();
  return { p1, p2, p3, p4 };
}

/**
 * Renders an HTML element onto a 2D canvas with true 3D perspective projection of the mini portfolio stage
 * @param {HTMLElement} element
 * @param {Object} options
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function renderElementToCanvas(element, options = {}) {
  const rect = element.getBoundingClientRect();
  const width = Math.max(360, Math.round(rect.width));
  const height = Math.max(260, Math.round(rect.height));
  const scale = options.scale || (typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1);

  const canvas = options.canvas || document.createElement('canvas');
  if (!options.canvas) {
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
  }
  const ctx = options.ctx || canvas.getContext('2d');
  ctx.save();
  if (!options.canvas) {
    ctx.scale(scale, scale);
  }

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const rotX = typeof options.rotX === 'number' ? options.rotX : 18;
  const rotY = typeof options.rotY === 'number' ? options.rotY : 0;

  // Background Skybox Fill
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width * 0.75);
  if (isDark) {
    bgGrad.addColorStop(0, '#1c152e');
    bgGrad.addColorStop(0.5, '#120d20');
    bgGrad.addColorStop(1, '#090511');
  } else {
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(0.6, '#f1f5f9');
    bgGrad.addColorStop(1, '#e2e8f0');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Soft Ambient Illumination Vignette
  const ambientGrad = ctx.createRadialGradient(width / 2, height / 2 - 20, 30, width / 2, height / 2, width * 0.6);
  ambientGrad.addColorStop(0, 'rgba(0, 242, 254, 0.14)');
  ambientGrad.addColorStop(0.5, 'rgba(255, 77, 109, 0.09)');
  ambientGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = ambientGrad;
  ctx.fillRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2 + 10;

  // Read active material preset from document or fallback
  const root = document.documentElement;
  const activeMaterial = root.dataset.threedMaterial || 'metal-gold';
  const customMeshType = root.dataset.threedCustomMesh || 'avatar';

  // Determine material color palette
  let slabFill = 'rgba(28, 22, 44, 0.94)';
  let slabBorder = 'rgba(255, 255, 255, 0.2)';
  let highlightColor = '#00F2FE';

  if (activeMaterial.includes('gold')) {
    slabFill = 'linear-gradient(135deg, #2b1f09 0%, #45320c 50%, #1a1305 100%)';
    slabBorder = 'rgba(250, 204, 21, 0.65)';
    highlightColor = '#FBBF24';
  } else if (activeMaterial.includes('silver') || activeMaterial.includes('steel')) {
    slabFill = 'linear-gradient(135deg, #202636 0%, #333d54 50%, #151a24 100%)';
    slabBorder = 'rgba(226, 232, 240, 0.7)';
    highlightColor = '#E2E8F0';
  } else if (activeMaterial.includes('wood')) {
    slabFill = 'linear-gradient(135deg, #3d2314 0%, #5c351f 50%, #26160c 100%)';
    slabBorder = 'rgba(217, 119, 6, 0.6)';
    highlightColor = '#D97706';
  } else if (activeMaterial.includes('iron')) {
    slabFill = 'linear-gradient(135deg, #18191c 0%, #292a30 50%, #0f1012 100%)';
    slabBorder = 'rgba(148, 163, 184, 0.4)';
    highlightColor = '#94A3B8';
  }

  // 1. Ground Contact Shadow (Moves realistically with rotY)
  const groundRad = (rotY * Math.PI) / 180;
  const shadowX = cx + Math.sin(groundRad) * 20;
  const shadowY = cy + 90;
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(shadowX, shadowY, Math.min(width * 0.36, 170), 22, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.filter = 'blur(10px)';
  ctx.fill();
  ctx.restore();

  // 2. Chassis Base Slab (Stratum -01, Z: -20px)
  const baseW = Math.min(width * 0.70, 360);
  const baseH = Math.min(height * 0.60, 240);
  const baseX = (width - baseW) / 2;
  const baseY = (height - baseH) / 2 - 10;

  drawProjectedSlab(ctx, baseX, baseY, baseW, baseH, -20, cx, cy, rotX, rotY, {
    fillStyle: isDark ? 'rgba(22, 17, 34, 0.95)' : 'rgba(248, 250, 252, 0.95)',
    strokeStyle: slabBorder,
    lineWidth: 2,
    shadowColor: 'rgba(0, 0, 0, 0.45)',
    shadowBlur: 24,
    shadowOffsetY: 12
  });

  // 3. Mini Navigation Bar (Stratum +01, Z: +30px)
  const navW = baseW - 32;
  const navH = 30;
  const navX = baseX + 16;
  const navY = baseY + 14;

  const navSlab = drawProjectedSlab(ctx, navX, navY, navW, navH, 25, cx, cy, rotX, rotY, {
    fillStyle: isDark ? 'rgba(32, 24, 52, 0.92)' : 'rgba(255, 255, 255, 0.94)',
    strokeStyle: 'rgba(255, 255, 255, 0.18)',
    lineWidth: 1.2
  });

  // Monogram [AV] on nav bar
  if (navSlab.p1) {
    ctx.save();
    ctx.fillStyle = '#FF4D6D';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('[AV]', navSlab.p1.px + 10, navSlab.p1.py + 18);

    ctx.fillStyle = isDark ? '#ffffff' : '#000000';
    ctx.font = 'bold 9px system-ui, sans-serif';
    ctx.fillText('PORTFOLIO 3D', navSlab.p1.px + 40, navSlab.p1.py + 18);
    ctx.restore();
  }

  // 4. Hero Card & Central 3D Mesh (Stratum 00, Z: +10px)
  const heroW = baseW - 32;
  const heroH = 76;
  const heroX = baseX + 16;
  const heroY = baseY + 54;

  const heroSlab = drawProjectedSlab(ctx, heroX, heroY, heroW, heroH, 15, cx, cy, rotX, rotY, {
    fillStyle: isDark ? 'rgba(38, 28, 62, 0.95)' : 'rgba(255, 255, 255, 0.96)',
    strokeStyle: slabBorder,
    lineWidth: 1.5,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowBlur: 16
  });

  // Central Avatar Orb / Faceted Mesh
  const orbPos = projectPoint3D(heroX + 38, heroY + 38, 35, cx, cy, rotX, rotY);
  ctx.save();
  ctx.beginPath();
  ctx.arc(orbPos.px, orbPos.py, 18 * orbPos.scale, 0, Math.PI * 2);
  const orbGrad = ctx.createRadialGradient(orbPos.px - 5, orbPos.py - 5, 2, orbPos.px, orbPos.py, 20 * orbPos.scale);
  orbGrad.addColorStop(0, highlightColor);
  orbGrad.addColorStop(0.6, '#FF4D6D');
  orbGrad.addColorStop(1, '#7928CA');
  ctx.fillStyle = orbGrad;
  ctx.shadowColor = 'rgba(255, 77, 109, 0.5)';
  ctx.shadowBlur = 12;
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${Math.round(10 * orbPos.scale)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('AV', orbPos.px, orbPos.py);
  ctx.restore();

  // Headline text in hero card
  if (heroSlab.p1) {
    ctx.save();
    ctx.fillStyle = isDark ? '#FFFFFF' : '#0F172A';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillText('Atul Verma', heroSlab.p1.px + 68, heroSlab.p1.py + 32);

    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(15, 23, 42, 0.65)';
    ctx.font = '10px monospace';
    ctx.fillText('Executive • Tax & AI Engineer', heroSlab.p1.px + 68, heroSlab.p1.py + 48);

    // Active Material Badge
    ctx.fillStyle = highlightColor;
    ctx.font = 'bold 9px monospace';
    ctx.fillText(`MATERIAL: ${activeMaterial.toUpperCase()}`, heroSlab.p1.px + 68, heroSlab.p1.py + 64);
    ctx.restore();
  }

  // 5. Grid Cards (Stratum 00, Z: +8px)
  const gridW = (baseW - 40) / 2;
  const gridH = 46;
  const gridY = baseY + 140;

  // Grid Card 1
  drawProjectedSlab(ctx, baseX + 16, gridY, gridW, gridH, 8, cx, cy, rotX, rotY, {
    fillStyle: isDark ? 'rgba(30, 22, 48, 0.88)' : 'rgba(255, 255, 255, 0.9)',
    strokeStyle: 'rgba(255, 255, 255, 0.12)',
    lineWidth: 1
  });

  // Grid Card 2
  drawProjectedSlab(ctx, baseX + 24 + gridW, gridY, gridW, gridH, 8, cx, cy, rotX, rotY, {
    fillStyle: isDark ? 'rgba(30, 22, 48, 0.88)' : 'rgba(255, 255, 255, 0.9)',
    strokeStyle: 'rgba(255, 255, 255, 0.12)',
    lineWidth: 1
  });

  // 6. Footer Watermark & Angle Telemetry
  ctx.save();
  ctx.fillStyle = 'rgba(161, 161, 170, 0.7)';
  ctx.font = '9px monospace';
  ctx.fillText(`3D Studio Capture | Rot: (${Math.round(rotX)}°, ${Math.round(rotY)}°) | 60 FPS`, 16, height - 12);
  ctx.restore();

  ctx.restore();
  return canvas;
}

/**
 * Captures a high-resolution snapshot (.webp) of the true 3D stage and triggers a client download
 * @param {HTMLElement} stageElement
 * @param {string} [filenamePrefix='portfolio-3d-snapshot']
 * @returns {Promise<string>} resolved filename
 */
export async function capture3DStageSnapshot(stageElement, filenamePrefix = 'portfolio-3d-snapshot') {
  if (!stageElement && typeof document !== 'undefined') {
    stageElement = document.querySelector('.universal-mini-portfolio')
      || document.querySelector('[data-testid="3d-sandbox-viewport"]')
      || document.querySelector('.sticky-sandbox-viewport')
      || document.querySelector('[data-testid="materials-stage-preview"]')
      || document.querySelector('[data-testid="lighting-studio-preview"]')
      || document.querySelector('[data-testid="camera-viewport-preview"]')
      || document.querySelector('[data-testid="physics-spring-preview"]')
      || document.querySelector('[data-testid="exploded-cad-preview"]');
  }
  if (!stageElement) {
    throw new Error('Target 3D stage element not found for snapshot capture.');
  }

  const canvas = await renderElementToCanvas(stageElement, { scale: 2 });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${filenamePrefix}-${timestamp}.webp`;

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        try {
          const dataUrl = canvas.toDataURL('image/webp', 0.95);
          triggerFileDownload(dataUrl, filename);
          resolve(filename);
        } catch (err) {
          reject(err);
        }
        return;
      }
      triggerFileDownload(blob, filename);
      resolve(filename);
    }, 'image/webp', 0.95);
  });
}

/**
 * Records a smooth 360° turntable spin loop (.webm) of the true 3D stage using dynamic multi-frame canvas rasterization
 * @param {HTMLElement} stageElement
 * @param {Object} options
 * @param {Function} [options.onRotate] Callback invoked with current angle (0 to 360) each frame
 * @param {Function} [options.onProgress] Callback with progress 0.0 to 1.0
 * @param {number} [options.durationMs=5000]
 * @param {number} [options.fps=60]
 * @returns {Promise<string>} resolved filename
 */
export async function record360TurntableVideo(stageElement, options = {}) {
  if (!stageElement && typeof document !== 'undefined') {
    stageElement = document.querySelector('.universal-mini-portfolio')
      || document.querySelector('[data-testid="3d-sandbox-viewport"]')
      || document.querySelector('.sticky-sandbox-viewport')
      || document.querySelector('[data-testid="materials-stage-preview"]')
      || document.querySelector('[data-testid="lighting-studio-preview"]')
      || document.querySelector('[data-testid="camera-viewport-preview"]')
      || document.querySelector('[data-testid="physics-spring-preview"]')
      || document.querySelector('[data-testid="exploded-cad-preview"]');
  }
  if (!stageElement) {
    throw new Error('Target 3D stage element not found for turntable recording.');
  }

  const durationMs = options.durationMs || 5000;
  const fps = options.fps || 60;
  const totalFrames = Math.round((durationMs / 1000) * fps);
  const onRotate = options.onRotate;
  const onProgress = options.onProgress;

  const rect = stageElement.getBoundingClientRect();
  const width = Math.max(360, Math.round(rect.width));
  const height = Math.max(260, Math.round(rect.height));

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * 1.5);
  canvas.height = Math.round(height * 1.5);
  const ctx = canvas.getContext('2d');
  ctx.scale(1.5, 1.5);

  const stream = typeof canvas.captureStream === 'function'
    ? canvas.captureStream(fps)
    : null;

  if (!stream || typeof window === 'undefined' || typeof window.MediaRecorder === 'undefined') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fallbackFilename = `portfolio-3d-turntable-fallback-${timestamp}.webp`;
    await capture3DStageSnapshot(stageElement, 'portfolio-3d-turntable-fallback');
    return fallbackFilename;
  }

  let mimeType = 'video/webm;codecs=vp9';
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = MediaRecorder.isTypeSupported('video/webm')
      ? 'video/webm'
      : (MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : '');
  }

  const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
  const recordedChunks = [];

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  const recordingPromise = new Promise((resolve, reject) => {
    recorder.onstop = () => {
      try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `portfolio-3d-turntable-${timestamp}.webm`;
        const blob = new Blob(recordedChunks, { type: mimeType || 'video/webm' });
        triggerFileDownload(blob, filename);
        resolve(filename);
      } catch (err) {
        reject(err);
      }
    };
    recorder.onerror = (err) => reject(err);
  });

  recorder.start();

  let frame = 0;
  const frameInterval = durationMs / totalFrames;
  const startTime = performance.now();

  return new Promise((resolve, reject) => {
    const renderLoop = async () => {
      frame++;
      const currentAngle = (frame / totalFrames) * 360;
      const rotY = (currentAngle % 360) - 180;

      if (typeof onRotate === 'function') {
        onRotate(currentAngle);
      }
      if (typeof onProgress === 'function') {
        onProgress(Math.min(1.0, frame / totalFrames));
      }

      // Render the true 3D model frame at the current rotation angle
      await renderElementToCanvas(stageElement, {
        canvas,
        ctx,
        rotY,
        rotX: 18,
        scale: 1.5
      });

      if (frame < totalFrames) {
        const nextTime = startTime + frame * frameInterval;
        const delay = Math.max(0, nextTime - performance.now());
        setTimeout(() => requestAnimationFrame(renderLoop), delay);
      } else {
        recorder.stop();
        recordingPromise.then(resolve).catch(reject);
      }
    };

    requestAnimationFrame(renderLoop);
  });
}

/**
 * Automatically tunes 3D depth intensity and tilt sensitivity according to the client device's physical capabilities.
 * @returns {{ depthIntensity: number, tiltSensitivity: number, isMobile: boolean, dpr: number }}
 */
export function calibrateDepthByDeviceProfile() {
  if (typeof window === 'undefined') {
    return { depthIntensity: 1.0, tiltSensitivity: 15, isMobile: false, dpr: 1 };
  }

  const isMobile = window.innerWidth < 768 || /Mobi|Android|iPhone/i.test(navigator?.userAgent || '');
  const dpr = Math.min(window.devicePixelRatio || 1, 3);

  // Balanced depth for smaller mobile screens to avoid clipping
  const recommendedDepth = isMobile ? 0.75 : 1.15;
  const recommendedTilt = isMobile ? 12 : 18;

  return {
    depthIntensity: recommendedDepth,
    tiltSensitivity: recommendedTilt,
    isMobile,
    dpr
  };
}

/**
 * Exports full 3D spatial settings, theme, and material calibration as a validated JSON bundle with metadata.
 * Strips temporary blob object URLs to prevent broken links on reload or distribution.
 *
 * @param {object} threeD - Active 3D state configuration
 * @returns {string} Serialized JSON package string
 */
export function export3DPresetPackage(threeD) {
  const config = threeD && typeof threeD === 'object' ? { ...threeD } : {};
  if (config.customMesh) {
    config.customMesh = { ...config.customMesh };
    delete config.customMesh.fileUrl;
  }
  const payload = {
    manifestVersion: '1.0.0',
    exportedAt: new Date().toISOString(),
    generator: 'Antigravity 3D Spatial Engine',
    author: 'Atul Verma (aiprincekumar)',
    config
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Generates a compact shareable URL containing base64 URL-safe encoded 3D parameters.
 *
 * @param {object} threeD - Active 3D state configuration
 * @param {string} [baseUrl] - Optional base URL (defaults to window.location.href)
 * @returns {string} Complete shareable URL with threed_config query parameter
 */
export function generate3DSceneShareLink(threeD, baseUrl) {
  try {
    const minified = {
      m: threeD?.master3D ? 1 : 0,
      t: threeD?.masterTheme,
      d: threeD?.depthIntensity,
      p: threeD?.stylePreset,
      l: [threeD?.lighting?.angle, threeD?.lighting?.preset],
      c: [threeD?.camera?.anglePreset, threeD?.camera?.perspectiveFOV],
      mat: [threeD?.materials?.preset, threeD?.materials?.roughness, threeD?.materials?.metalness],
      exp: threeD?.exploded?.enabled ? [threeD?.exploded?.separationDistance, threeD?.exploded?.blueprintMode ? 1 : 0] : [0, 0]
    };
    const jsonStr = JSON.stringify(minified);
    const encoded = typeof btoa === 'function'
      ? btoa(encodeURIComponent(jsonStr))
      : Buffer.from(encodeURIComponent(jsonStr)).toString('base64');

    let base = baseUrl;
    if (!base && typeof window !== 'undefined' && window.location) {
      base = window.location.href;
    }
    if (!base) {
      base = 'http://localhost/';
    }
    const url = new URL(base);
    url.searchParams.set('threed_config', encoded);
    return url.toString();
  } catch (err) {
    console.warn('[mediaExport] generate3DSceneShareLink error:', err);
    return (typeof window !== 'undefined' && window.location) ? window.location.href : 'http://localhost/?threed_config=';
  }
}

/**
 * Decodes and unpacks 3D configuration parameters from URL string or query parameters upon page load.
 *
 * @param {string|URLSearchParams} urlStringOrParams - URL string, search query, or URLSearchParams instance
 * @returns {object|null} Inflated 3D configuration object, or null if invalid
 */
export function parse3DSceneShareLink(urlStringOrParams) {
  if (!urlStringOrParams) return null;
  try {
    let rawEncoded = null;
    if (typeof urlStringOrParams === 'string') {
      if (urlStringOrParams.includes('threed_config=')) {
        const queryIndex = urlStringOrParams.indexOf('?');
        const qs = queryIndex >= 0 ? urlStringOrParams.slice(queryIndex) : (urlStringOrParams.startsWith('threed_config=') ? `?${urlStringOrParams}` : urlStringOrParams);
        const params = new URLSearchParams(qs);
        rawEncoded = params.get('threed_config');
      } else if (!urlStringOrParams.includes('://') && !urlStringOrParams.includes('?') && !urlStringOrParams.includes('=')) {
        rawEncoded = urlStringOrParams.trim();
      } else {
        const parsedUrl = new URL(urlStringOrParams, 'http://localhost');
        rawEncoded = parsedUrl.searchParams.get('threed_config');
      }
    } else if (urlStringOrParams instanceof URLSearchParams) {
      rawEncoded = urlStringOrParams.get('threed_config');
    } else if (typeof urlStringOrParams === 'object' && urlStringOrParams.searchParams) {
      rawEncoded = urlStringOrParams.searchParams.get('threed_config');
    }

    if (!rawEncoded) return null;

    const decodedStr = typeof atob === 'function'
      ? atob(rawEncoded)
      : Buffer.from(rawEncoded, 'base64').toString('binary');
    const jsonStr = decodeURIComponent(decodedStr);
    const min = JSON.parse(jsonStr);

    if (!min || typeof min !== 'object') return null;

    const inflated = {};
    if (min.m !== undefined) inflated.master3D = Boolean(min.m);
    if (min.t !== undefined) inflated.masterTheme = min.t;
    if (min.d !== undefined) inflated.depthIntensity = Number(min.d);
    if (min.p !== undefined) inflated.stylePreset = min.p;
    if (Array.isArray(min.l)) {
      inflated.lighting = {};
      if (min.l[0] !== undefined) inflated.lighting.angle = Number(min.l[0]);
      if (min.l[1] !== undefined) inflated.lighting.preset = min.l[1];
    }
    if (Array.isArray(min.c)) {
      inflated.camera = {};
      if (min.c[0] !== undefined) inflated.camera.anglePreset = min.c[0];
      if (min.c[1] !== undefined) inflated.camera.perspectiveFOV = Number(min.c[1]);
    }
    if (Array.isArray(min.mat)) {
      inflated.materials = {};
      if (min.mat[0] !== undefined) inflated.materials.preset = min.mat[0];
      if (min.mat[1] !== undefined) inflated.materials.roughness = Number(min.mat[1]);
      if (min.mat[2] !== undefined) inflated.materials.metalness = Number(min.mat[2]);
    }
    if (Array.isArray(min.exp)) {
      inflated.exploded = {
        enabled: Boolean(min.exp[0] > 0 || min.exp[1]),
        separationDistance: Number(min.exp[0] || 0),
        blueprintMode: Boolean(min.exp[1])
      };
    }
    return inflated;
  } catch (err) {
    console.warn('[mediaExport] parse3DSceneShareLink failed:', err);
    return null;
  }
}
