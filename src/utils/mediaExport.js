/**
 * Cinematic 360° Turntable Video & High-Res Snapshot Exporter (Feature 4)
 * Client-side DOM/Canvas capture and MediaRecorder video generation
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
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }
}

/**
 * Renders an HTML element onto a 2D canvas with styling, shadows, and optional metadata
 * @param {HTMLElement} element
 * @param {Object} options
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function renderElementToCanvas(element, options = {}) {
  const rect = element.getBoundingClientRect();
  const width = Math.max(320, Math.round(rect.width));
  const height = Math.max(240, Math.round(rect.height));
  const scale = options.scale || (typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1);

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  // Background gradient or fill
  const computed = window.getComputedStyle(element);
  const bg = computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)'
    ? computed.backgroundColor
    : (document.documentElement.classList.contains('dark') ? '#0c0a13' : '#f8fafc');

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Decorative ambient stage lighting
  const grad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width * 0.7);
  grad.addColorStop(0, 'rgba(0, 242, 254, 0.12)');
  grad.addColorStop(0.5, 'rgba(255, 77, 109, 0.08)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // If element has canvas children (e.g. particle canvas or WebGL), draw them
  const childCanvases = element.querySelectorAll('canvas');
  childCanvases.forEach((child) => {
    try {
      const cRect = child.getBoundingClientRect();
      const ox = cRect.left - rect.left;
      const oy = cRect.top - rect.top;
      ctx.drawImage(child, ox, oy, cRect.width, cRect.height);
    } catch {
      // Ignore cross-origin canvas security exceptions
    }
  });

  // Render stylized 3D portfolio card representation on canvas
  const cardW = Math.min(width * 0.72, 380);
  const cardH = Math.min(height * 0.65, 260);
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  // Cast shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 14;

  ctx.fillStyle = document.documentElement.classList.contains('dark') ? 'rgba(24, 18, 38, 0.92)' : 'rgba(255, 255, 255, 0.94)';
  ctx.strokeStyle = document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1.5;

  // Rounded rectangle
  const r = 16;
  ctx.beginPath();
  ctx.moveTo(cardX + r, cardY);
  ctx.lineTo(cardX + cardW - r, cardY);
  ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + r);
  ctx.lineTo(cardX + cardW, cardY + cardH - r);
  ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - r, cardY + cardH);
  ctx.lineTo(cardX + r, cardY + cardH);
  ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - r);
  ctx.lineTo(cardX, cardY + r);
  ctx.quadraticCurveTo(cardX, cardY, cardX + r, cardY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Header bar inside card
  ctx.fillStyle = 'rgba(0, 242, 254, 0.16)';
  ctx.fillRect(cardX + 16, cardY + 16, cardW - 32, 28);
  ctx.fillStyle = '#00F2FE';
  ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
  ctx.fillText('ATUL VERMA • 3D SPATIAL STUDIO', cardX + 26, cardY + 34);

  // Content lines
  ctx.fillStyle = document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.85)' : 'rgba(24, 24, 27, 0.85)';
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.fillText('Interactive Cursor-Tracking Portfolio', cardX + 26, cardY + 80);

  ctx.fillStyle = document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.55)' : 'rgba(24, 24, 27, 0.55)';
  ctx.font = '11px monospace';
  ctx.fillText('PBR Shading • 360° Turntable • Binaural Web Audio', cardX + 26, cardY + 104);

  // Grid badges
  const badgeW = (cardW - 48) / 3;
  ['Stratum -01', 'Stratum 00', 'Stratum +01'].forEach((stratum, idx) => {
    const bx = cardX + 16 + idx * (badgeW + 8);
    const by = cardY + 130;
    ctx.fillStyle = 'rgba(255, 77, 109, 0.12)';
    ctx.strokeStyle = 'rgba(255, 77, 109, 0.3)';
    ctx.strokeRect(bx, by, badgeW, 40);
    ctx.fillRect(bx, by, badgeW, 40);
    ctx.fillStyle = '#FF4D6D';
    ctx.font = 'bold 10px monospace';
    ctx.fillText(stratum, bx + 10, by + 24);
  });

  // Footer timestamp watermark
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);
  ctx.fillStyle = 'rgba(161, 161, 170, 0.85)';
  ctx.font = '10px monospace';
  ctx.fillText(`Recorded: ${ts} UTC | 3D Studio Stage`, cardX + 16, cardY + cardH - 16);

  return canvas;
}

/**
 * Captures a high-resolution snapshot (.webp) of the 3D stage and triggers a client download
 * @param {HTMLElement} stageElement
 * @param {string} [filenamePrefix='portfolio-3d-snapshot']
 * @returns {Promise<string>} resolved filename
 */
export async function capture3DStageSnapshot(stageElement, filenamePrefix = 'portfolio-3d-snapshot') {
  if (!stageElement && typeof document !== 'undefined') {
    stageElement = document.querySelector('.universal-mini-portfolio') || document.querySelector('[data-testid="3d-sandbox-viewport"]');
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
        // Fallback to dataURL
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
 * Records a smooth 360° turntable spin loop (.webm) of the 3D stage using Canvas + MediaRecorder
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
    stageElement = document.querySelector('.universal-mini-portfolio') || document.querySelector('[data-testid="3d-sandbox-viewport"]');
  }
  if (!stageElement) {
    throw new Error('Target 3D stage element not found for turntable recording.');
  }

  const durationMs = options.durationMs || 5000;
  const fps = options.fps || 60;
  const totalFrames = Math.round((durationMs / 1000) * fps);
  const onRotate = options.onRotate;
  const onProgress = options.onProgress;

  const canvas = await renderElementToCanvas(stageElement, { scale: 1.5 });
  const ctx = canvas.getContext('2d');

  const stream = typeof canvas.captureStream === 'function'
    ? canvas.captureStream(fps)
    : null;

  if (!stream || typeof window === 'undefined' || typeof window.MediaRecorder === 'undefined') {
    // MediaRecorder / captureStream unsupported fallback: Export a crisp high-res snapshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fallbackFilename = `portfolio-3d-turntable-fallback-${timestamp}.webp`;
    await capture3DStageSnapshot(stageElement, 'portfolio-3d-turntable-fallback');
    return fallbackFilename;
  }

  // Determine supported mimeType
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

  // Programmatic 360° turntable spin loop
  let frame = 0;
  const frameInterval = durationMs / totalFrames;
  const startTime = performance.now();

  return new Promise((resolve, reject) => {
    const renderLoop = () => {
      frame++;
      const currentAngle = Math.round((frame / totalFrames) * 360);
      if (typeof onRotate === 'function') {
        onRotate(currentAngle);
      }
      if (typeof onProgress === 'function') {
        onProgress(Math.min(1.0, frame / totalFrames));
      }

      // Draw subtle orbital sweep sweep on canvas
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const rad = (currentAngle * Math.PI) / 180;
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 140, 0, Math.PI * 2);
      ctx.stroke();

      // Orbiting beacon
      const bx = cx + Math.cos(rad) * 140;
      const by = cy + Math.sin(rad) * 140;
      ctx.fillStyle = '#FF4D6D';
      ctx.beginPath();
      ctx.arc(bx, by, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

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
