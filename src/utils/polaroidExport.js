import JSZip from 'jszip';

/**
 * Formats a Date object, timestamp string, or epoch into:
 * "ATUL VERMA • DD MMM YYYY hh:mm A" (e.g. "ATUL VERMA • 17 OCT 2026 10:42 PM")
 * 
 * @param {Date|string|number} [dateInput]
 * @returns {string}
 */
export function formatVintageTimestamp(dateInput) {
  if (typeof dateInput === 'string' && dateInput.startsWith('ATUL VERMA •')) {
    return dateInput;
  }
  let date;
  if (!dateInput) {
    date = new Date();
  } else if (dateInput instanceof Date) {
    date = isNaN(dateInput.getTime()) ? new Date() : dateInput;
  } else if (typeof dateInput === 'number') {
    date = new Date(dateInput);
  } else if (typeof dateInput === 'string') {
    // If it's a raw time string like "10:42 AM" or "10:42:15 PM" without full date, parse smartly
    const parsed = new Date(dateInput);
    if (!isNaN(parsed.getTime())) {
      date = parsed;
    } else {
      // Fallback: Check if it's "hh:mm AM/PM" or similar, use current date with that time
      const match = dateInput.match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?/i);
      if (match) {
        date = new Date();
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const meridian = match[3] ? match[3].toUpperCase() : null;
        if (meridian === 'PM' && hours < 12) hours += 12;
        if (meridian === 'AM' && hours === 12) hours = 0;
        date.setHours(hours, minutes, 0, 0);
      } else {
        date = new Date();
      }
    }
  } else {
    date = new Date();
  }

  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  const formattedHours = String(hours).padStart(2, '0');

  return `ATUL VERMA • ${day} ${month} ${year} ${formattedHours}:${minutes} ${ampm}`;
}

/**
 * Loads an image from a given source URL into an HTMLImageElement
 * @param {string} src 
 * @returns {Promise<HTMLImageElement>}
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // In case crossOrigin fails with local file or relative path, retry without crossOrigin
      const retryImg = new Image();
      retryImg.onload = () => resolve(retryImg);
      retryImg.onerror = (err) => reject(new Error(`Failed to load image from ${src}: ${err}`));
      retryImg.src = src;
    };
    img.src = src;
  });
}

/**
 * Helper to ensure WebFonts like Caveat are loaded before canvas text rendering
 */
async function ensureFontsReady() {
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Ignore font loading errors, canvas will fallback gracefully
    }
  }
}

/**
 * Helper to truncate text with an ellipsis if it exceeds maxWidth
 */
function truncateText(ctx, text, maxWidth) {
  if (!text) return '';
  if (ctx.measureText(text).width <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 0 && ctx.measureText(truncated + '…').width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + '…';
}

/**
 * Renders a high-resolution authentic Polaroid photograph onto an HTML5 Canvas.
 * Dimensions: 800 x 1000px high-res canvas.
 * - Off-white Polaroid cardstock background (#FAF8F5 / #F5F1EB gradient)
 * - Subtle paper grain / soft inner drop shadow
 * - Framed inner photo container (700 x 700px or 4:3 / 1:1)
 * - Luminous Vintage Amber LED Timestamp (e.g. ATUL VERMA • 17 OCT 2026 10:42 PM)
 * - Handwritten cursive title / caption at the bottom frame ("Caveat", cursive)
 * 
 * @param {Object} photo
 * @param {string} photo.imageSrc
 * @param {string} [photo.title]
 * @param {string|number|Date} [photo.timestamp]
 * @param {string} [photo.note]
 * @param {number} [photo.scale]
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function renderPolaroidCanvas(photo) {
  await ensureFontsReady();

  const canvasWidth = 800;
  const canvasHeight = 1000;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }

  // 1. Draw Polaroid Cardstock Body with realistic subtle tone
  const cardGradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
  cardGradient.addColorStop(0, '#FFFFFF');
  cardGradient.addColorStop(0.3, '#FAF8F5');
  cardGradient.addColorStop(1, '#F2EFEB');
  ctx.fillStyle = cardGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Subtle Card Border / Bevel
  ctx.strokeStyle = 'rgba(215, 205, 195, 0.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, canvasWidth - 2, canvasHeight - 2);

  // 2. Compute Inner Photo Viewport
  // Standard Polaroid framing: Equal margins left, top, right (~50px), larger margin at bottom (~250px)
  const photoMarginX = 50;
  const photoMarginTop = 50;
  const photoWidth = canvasWidth - (photoMarginX * 2); // 700px
  const photoHeight = 700; // 700px (1:1 square classic aspect)

  // Photo Container Outer Subtle Inset Shadow / Border
  ctx.save();
  ctx.fillStyle = '#1A1A1A';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;
  ctx.fillRect(photoMarginX, photoMarginTop, photoWidth, photoHeight);
  ctx.restore();

  // Draw Photo Inner Bevel
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(photoMarginX, photoMarginTop, photoWidth, photoHeight);

  // 3. Load and Draw Character/Scene Image
  ctx.save();
  // Clip strictly to photo viewport
  ctx.beginPath();
  ctx.rect(photoMarginX, photoMarginTop, photoWidth, photoHeight);
  ctx.clip();

  // Photo background gradient (matching studio sky backdrop)
  const photoBgGrad = ctx.createLinearGradient(photoMarginX, photoMarginTop, photoMarginX, photoMarginTop + photoHeight);
  photoBgGrad.addColorStop(0, '#8C9EB2');
  photoBgGrad.addColorStop(0.5, '#B8C8D8');
  photoBgGrad.addColorStop(1, '#DCE4ED');
  ctx.fillStyle = photoBgGrad;
  ctx.fillRect(photoMarginX, photoMarginTop, photoWidth, photoHeight);

  try {
    const img = await loadImage(photo.imageSrc);
    const userScale = photo.scale || 1.0;

    // Center crop / cover math
    const imgAspect = img.width / img.height;
    const boxAspect = photoWidth / photoHeight;
    let renderW, renderH, offsetX, offsetY;

    if (imgAspect > boxAspect) {
      renderH = photoHeight * userScale;
      renderW = renderH * imgAspect;
    } else {
      renderW = photoWidth * userScale;
      renderH = renderW / imgAspect;
    }

    // Align center with 32% vertical bias (focus on hero face/torso)
    offsetX = photoMarginX + (photoWidth - renderW) / 2;
    offsetY = photoMarginTop + (photoHeight - renderH) * 0.32;

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
  } catch (err) {
    console.warn('Could not draw image to polaroid canvas:', err);
    // Draw placeholder pattern if image could not load
    ctx.fillStyle = '#4B5563';
    ctx.font = '24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Interactive Snapshot Frame', photoMarginX + photoWidth / 2, photoMarginTop + photoHeight / 2);
  }

  // Subtle inner vignette on the photo itself
  const vignette = ctx.createRadialGradient(
    photoMarginX + photoWidth / 2, photoMarginTop + photoHeight / 2, photoWidth * 0.3,
    photoMarginX + photoWidth / 2, photoMarginTop + photoHeight / 2, photoWidth * 0.72
  );
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.22)');
  ctx.fillStyle = vignette;
  ctx.fillRect(photoMarginX, photoMarginTop, photoWidth, photoHeight);

  // End clipping - photo viewport is completely clean and unobstructed
  ctx.restore();

  // 4. Bottom Paper Margin (Chin): Left-Aligned Authentic Polaroid Layout
  const leftX = photoMarginX; // 50px from left
  const maxContentWidth = photoWidth; // 700px

  ctx.save();
  ctx.textAlign = 'left';

  // --- Line 1: Handwritten Title in Caveat cursive font at leftX ---
  const rawTitle = photo.title || 'Polaroid Memory Snap';
  ctx.font = '700 42px "Caveat", "Brush Script MT", "Segoe Script", cursive';
  ctx.fillStyle = '#1A1817';
  ctx.textBaseline = 'alphabetic';
  ctx.shadowColor = 'rgba(24, 24, 27, 0.15)';
  ctx.shadowBlur = 2;
  const titleY = 810;
  ctx.fillText(truncateText(ctx, rawTitle, maxContentWidth), leftX, titleY);

  // --- Line 2: Vintage Amber LED Timestamp with stylish dark enclosure badge at leftX ---
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  const ledText = formatVintageTimestamp(photo.timestamp || photo.date || new Date());
  const ledFont = 'bold 14px "Courier New", Courier, "SF Mono", "VT323", monospace';
  ctx.font = ledFont;

  const textMetrics = ctx.measureText(ledText);
  const badgePadX = 12;
  const badgeH = 26;
  const badgeW = textMetrics.width + (badgePadX * 2);
  const badgeY = 835;
  const ledCenterY = badgeY + (badgeH / 2);

  // Dark enclosure badge backing
  ctx.save();
  ctx.fillStyle = '#121110';
  ctx.strokeStyle = 'rgba(255, 122, 0, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(leftX, badgeY, badgeW, badgeH, 4);
  } else {
    ctx.rect(leftX, badgeY, badgeW, badgeH);
  }
  ctx.fill();
  ctx.stroke();

  // Luminous amber glow pass
  ctx.shadowColor = 'rgba(255, 106, 0, 0.8)';
  ctx.shadowBlur = 8;
  ctx.fillStyle = '#FF7A00';
  ctx.font = ledFont;
  ctx.textBaseline = 'middle';
  ctx.fillText(ledText, leftX + badgePadX, ledCenterY);

  // Crisp foreground pass
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#FFA24D';
  ctx.fillText(ledText, leftX + badgePadX, ledCenterY);
  ctx.restore();

  // --- Line 3: Photo Note in subtle dark gray (#6B7280) at leftX ---
  ctx.save();
  const rawNote = photo.note || 'Captured in real-time • Interactive 35mm f/1.8 Shutter Studio';
  ctx.font = '500 16px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#6B7280';
  ctx.textBaseline = 'alphabetic';
  const noteY = 890;
  ctx.fillText(truncateText(ctx, rawNote, maxContentWidth), leftX, noteY);
  ctx.restore();

  // --- Line 4: Archival Brandmark at leftX in bottom margin ---
  ctx.save();
  ctx.font = '700 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#9CA3AF';
  if (ctx.letterSpacing !== undefined) {
    ctx.letterSpacing = '2px';
  }
  ctx.textBaseline = 'alphabetic';
  const brandmarkY = 940;
  ctx.fillText('ATUL VERMA PORTFOLIO • ARCHIVAL POLAROID EDITION', leftX, brandmarkY);
  ctx.restore();

  ctx.restore(); // Restore outer save

  return canvas;
}

/**
 * Triggers a direct browser file download for a Blob
 * @param {Blob} blob 
 * @param {string} filename 
 */
export function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * Renders a single photo to high-res Polaroid Canvas, converts to PNG blob,
 * and triggers a browser download.
 * 
 * @param {Object} photo
 * @returns {Promise<void>}
 */
export async function downloadSinglePolaroid(photo) {
  const canvas = await renderPolaroidCanvas(photo);
  
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to create Polaroid image blob'));
        return;
      }
      const safeId = photo.id || Date.now();
      triggerBlobDownload(blob, `polaroid-atul-verma-${safeId}.png`);
      resolve();
    }, 'image/png', 0.95);
  });
}

/**
 * Exports all photos into a packaged ZIP archive:
 * - Renders each photo through renderPolaroidCanvas
 * - Invokes onProgress(current, total)
 * - Bundles all PNGs into JSZip
 * - Adds a metadata manifest.txt
 * - Triggers download named 'atul-verma-polaroids.zip'
 * 
 * @param {Array<Object>} photos
 * @param {Function} [onProgress] Callback receiving (current, total)
 * @returns {Promise<void>}
 */
export async function exportAllPolaroidsZip(photos, onProgress) {
  if (!photos || photos.length === 0) {
    throw new Error('No polaroid photos to export');
  }

  const zip = new JSZip();
  const folder = zip.folder('atul-verma-polaroids');
  const total = photos.length;

  let manifestContent = `========================================================\n`;
  manifestContent += `ATUL VERMA • INTERACTIVE POLAROID GALLERY ARCHIVE\n`;
  manifestContent += `Generated: ${new Date().toISOString()}\n`;
  manifestContent += `Total Photographs: ${total}\n`;
  manifestContent += `========================================================\n\n`;

  for (let i = 0; i < total; i++) {
    const photo = photos[i];
    if (typeof onProgress === 'function') {
      onProgress(i + 1, total);
    }

    try {
      const canvas = await renderPolaroidCanvas(photo);
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png', 0.95);
      });

      if (blob) {
        const fileIndex = String(i + 1).padStart(2, '0');
        const filename = `polaroid-${fileIndex}-${photo.id || 'snap'}.png`;
        folder.file(filename, blob);

        manifestContent += `[#${fileIndex}] ${filename}\n`;
        manifestContent += `Title: ${photo.title || 'Untitled Snapshot'}\n`;
        manifestContent += `Timestamp: ${formatVintageTimestamp(photo.timestamp || photo.date || new Date())}\n`;
        manifestContent += `State/Pose: ${photo.state || 'N/A'}\n`;
        manifestContent += `Note: ${photo.note || 'None'}\n\n`;
      }
    } catch (err) {
      console.error(`Error rendering polaroid for photo index ${i}:`, err);
    }
  }

  // Include metadata manifest
  zip.file('manifest.txt', manifestContent);

  // Generate ZIP
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  triggerBlobDownload(zipBlob, 'atul-verma-polaroids.zip');
}
