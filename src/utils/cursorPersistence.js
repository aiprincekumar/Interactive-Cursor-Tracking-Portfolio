/**
 * Centralized Cursor Coordinate Persistence Utility
 * 
 * Manages cross-refresh and cross-navigation cursor coordinate persistence:
 * - Saves last known (clientX, clientY) to sessionStorage and localStorage with 24h TTL.
 * - Storage key: 'portfolio_last_cursor_pos'.
 * - Throttles continuous pointermove events (~100ms) to ensure zero main-thread lag.
 * - Instantly saves on 'beforeunload' and 'pagehide'.
 * - Provides immediate retrieval so custom cursors and Hero gaze tracking start exactly
 *   at the last position without jumping to screen center on page load / refresh.
 */

export const CURSOR_POS_STORAGE_KEY = 'portfolio_last_cursor_pos';
export const CURSOR_POS_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours TTL

let lastSaveTime = 0;
let lastKnownPos = null;

/**
 * Validates and retrieves the last saved cursor position from sessionStorage or localStorage.
 * Respects 24-hour TTL and safe numeric coordinate bounds.
 * @returns {{ clientX: number, clientY: number } | null}
 */
export function getSavedCursorPosition() {
  if (typeof window === 'undefined') return null;

  // 1. Try sessionStorage first (fastest, active tab session)
  try {
    if (window.sessionStorage) {
      const raw = sessionStorage.getItem(CURSOR_POS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          parsed &&
          typeof parsed === 'object' &&
          typeof parsed.clientX === 'number' &&
          typeof parsed.clientY === 'number' &&
          Number.isFinite(parsed.clientX) &&
          Number.isFinite(parsed.clientY)
        ) {
          const timestamp = typeof parsed.timestamp === 'number' ? parsed.timestamp : Date.now();
          if (Date.now() - timestamp < CURSOR_POS_TTL_MS) {
            return {
              clientX: Math.round(parsed.clientX),
              clientY: Math.round(parsed.clientY)
            };
          }
        }
      }
    }
  } catch {}

  // 2. Fallback to localStorage (survives tab reopen / refresh within 24h)
  try {
    if (window.localStorage) {
      const raw = localStorage.getItem(CURSOR_POS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          parsed &&
          typeof parsed === 'object' &&
          typeof parsed.clientX === 'number' &&
          typeof parsed.clientY === 'number' &&
          Number.isFinite(parsed.clientX) &&
          Number.isFinite(parsed.clientY)
        ) {
          const timestamp = typeof parsed.timestamp === 'number' ? parsed.timestamp : 0;
          if (Date.now() - timestamp < CURSOR_POS_TTL_MS) {
            return {
              clientX: Math.round(parsed.clientX),
              clientY: Math.round(parsed.clientY)
            };
          }
        }
      }
    }
  } catch {}

  return null;
}

/**
 * Returns either the restored position or safe screen-centered coordinates.
 * @param {number} [fallbackX]
 * @param {number} [fallbackY]
 * @returns {{ clientX: number, clientY: number }}
 */
export function getInitialCursorPosition(fallbackX, fallbackY) {
  const saved = getSavedCursorPosition();
  if (saved) return saved;

  const defaultX = typeof window !== 'undefined'
    ? Math.round(window.innerWidth / 2)
    : (fallbackX ?? 500);
  const defaultY = typeof window !== 'undefined'
    ? Math.round(window.innerHeight / 2)
    : (fallbackY ?? 300);

  return { clientX: defaultX, clientY: defaultY };
}

/**
 * Persists cursor position to sessionStorage and localStorage.
 * Throttled to ~100ms during continuous movement to avoid storage overhead.
 * Can be forced immediately on unload/pagehide.
 * 
 * @param {number} clientX
 * @param {number} clientY
 * @param {boolean} [immediate=false]
 */
export function saveCursorPosition(clientX, clientY, immediate = false) {
  if (typeof window === 'undefined') return;
  if (clientX === undefined || clientY === undefined) return;
  if (typeof clientX !== 'number' || typeof clientY !== 'number') return;
  if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) return;

  lastKnownPos = { clientX, clientY };

  const now = Date.now();
  if (!immediate && now - lastSaveTime < 100) {
    return;
  }
  lastSaveTime = now;

  const payload = JSON.stringify({
    clientX: Math.round(clientX),
    clientY: Math.round(clientY),
    timestamp: now
  });

  try {
    if (window.sessionStorage) {
      sessionStorage.setItem(CURSOR_POS_STORAGE_KEY, payload);
    }
  } catch {}

  try {
    if (window.localStorage) {
      localStorage.setItem(CURSOR_POS_STORAGE_KEY, payload);
    }
  } catch {}
}

/**
 * Initializes passive pointer listeners and unload handlers for cursor persistence.
 * @returns {() => void} Cleanup function to remove listeners
 */
export function initCursorPersistenceTracker() {
  if (typeof window === 'undefined') return () => {};

  const handlePointer = (e) => {
    const cx = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    const cy = e.clientY ?? (e.touches && e.touches[0]?.clientY);
    if (cx !== undefined && cy !== undefined) {
      saveCursorPosition(cx, cy, false);
    }
  };

  const handleUnload = () => {
    if (lastKnownPos) {
      saveCursorPosition(lastKnownPos.clientX, lastKnownPos.clientY, true);
    }
  };

  window.addEventListener('pointermove', handlePointer, { passive: true });
  window.addEventListener('touchmove', handlePointer, { passive: true });
  window.addEventListener('beforeunload', handleUnload);
  window.addEventListener('pagehide', handleUnload);

  return () => {
    window.removeEventListener('pointermove', handlePointer);
    window.removeEventListener('touchmove', handlePointer);
    window.removeEventListener('beforeunload', handleUnload);
    window.removeEventListener('pagehide', handleUnload);
  };
}
