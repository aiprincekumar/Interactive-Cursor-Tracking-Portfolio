/**
 * Multi-Session Persistence Manager for Chat Assistant (Pure ESM Utility)
 * Manages conversation history in localStorage with 10-session FIFO quota enforcement,
 * readable title auto-derivation, and Node/SSR fallback memory store.
 */

const SESSIONS_STORAGE_KEY = 'atul_portfolio_ai_sessions_v1';
const CURRENT_SESSION_KEY = 'atul_portfolio_ai_current_session_id_v1';
const MAX_SESSIONS = 10;

// Memory fallback for headless / SSR / test environments
let memoryStore = {
  sessions: {},
  currentSessionId: null
};

/**
 * Check if localStorage is usable in current runtime
 */
function isStorageAvailable() {
  try {
    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined' &&
      window.localStorage !== null
    );
  } catch {
    return false;
  }
}

/**
 * Reads raw session map from storage
 * @returns {Record<string, Object>}
 */
function getRawSessions() {
  if (isStorageAvailable()) {
    try {
      const data = window.localStorage.getItem(SESSIONS_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return memoryStore.sessions;
    }
  }
  return memoryStore.sessions;
}

/**
 * Writes raw session map to storage
 * @param {Record<string, Object>} sessionsMap 
 */
function setRawSessions(sessionsMap) {
  memoryStore.sessions = { ...sessionsMap };
  if (isStorageAvailable()) {
    try {
      window.localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessionsMap));
    } catch {
      // In case of quota errors or storage disabled, in-memory state is preserved
    }
  }
}

/**
 * Auto-derives a readable session title from the first user query
 * @param {Array} messages 
 * @param {string} fallbackTitle 
 * @returns {string}
 */
export function deriveSessionTitle(messages = [], fallbackTitle = 'New Conversation') {
  if (!Array.isArray(messages) || messages.length === 0) return fallbackTitle;
  const firstUserMsg = messages.find((m) => m.sender === 'user' && m.text && m.text.trim().length > 0);
  if (!firstUserMsg) return fallbackTitle;
  
  const text = firstUserMsg.text.trim().replace(/\s+/g, ' ');
  return text.length > 36 ? `${text.slice(0, 36)}…` : text;
}

/**
 * Lists all saved sessions sorted by updatedAt descending
 * @returns {Array<Object>}
 */
export function listSessions() {
  const map = getRawSessions();
  return Object.values(map).sort((a, b) => {
    const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return timeB - timeA;
  });
}

/**
 * Loads a specific session by ID
 * @param {string} sessionId 
 * @returns {Object|null}
 */
export function loadSession(sessionId) {
  if (!sessionId) return null;
  const map = getRawSessions();
  return map[sessionId] || null;
}

/**
 * Saves or updates a session with FIFO 10-session quota guard
 * @param {Object} sessionData 
 * @returns {Object}
 */
export function saveSession(sessionData = {}) {
  const map = getRawSessions();
  const now = new Date().toISOString();
  const id = sessionData.id || `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const existing = map[id] || {};

  const messages = Array.isArray(sessionData.messages) ? sessionData.messages : existing.messages || [];
  const title =
    sessionData.title && sessionData.title !== 'New Conversation'
      ? sessionData.title
      : existing.title && existing.title !== 'New Conversation'
      ? existing.title
      : deriveSessionTitle(messages, 'New Conversation');

  const updatedSession = {
    ...existing,
    ...sessionData,
    id,
    title,
    messages,
    metadata: {
      ...existing.metadata,
      ...sessionData.metadata
    },
    createdAt: existing.createdAt || sessionData.createdAt || now,
    updatedAt: sessionData.updatedAt || now
  };

  map[id] = updatedSession;

  // FIFO Quota Guard: ensure max 10 sessions.
  // Sort oldest first and prune until size <= MAX_SESSIONS
  const sessionList = Object.values(map);
  if (sessionList.length > MAX_SESSIONS) {
    sessionList.sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return timeA - timeB; // ascending -> oldest first
    });

    const excessCount = sessionList.length - MAX_SESSIONS;
    for (let i = 0; i < excessCount; i++) {
      const oldestId = sessionList[i].id;
      delete map[oldestId];
    }
  }

  setRawSessions(map);
  return updatedSession;
}

/**
 * Deletes a session by ID
 * @param {string} sessionId 
 * @returns {boolean}
 */
export function deleteSession(sessionId) {
  if (!sessionId) return false;
  const map = getRawSessions();
  if (map[sessionId]) {
    delete map[sessionId];
    setRawSessions(map);
    if (getCurrentSessionId() === sessionId) {
      setCurrentSessionId(null);
    }
    return true;
  }
  return false;
}

/**
 * Clears all saved sessions
 */
export function clearAllSessions() {
  memoryStore.sessions = {};
  memoryStore.currentSessionId = null;
  if (isStorageAvailable()) {
    try {
      window.localStorage.removeItem(SESSIONS_STORAGE_KEY);
      window.localStorage.removeItem(CURRENT_SESSION_KEY);
    } catch {
      // Ignore
    }
  }
}

/**
 * Gets currently active session ID
 * @returns {string|null}
 */
export function getCurrentSessionId() {
  if (isStorageAvailable()) {
    try {
      return window.localStorage.getItem(CURRENT_SESSION_KEY) || memoryStore.currentSessionId;
    } catch {
      return memoryStore.currentSessionId;
    }
  }
  return memoryStore.currentSessionId;
}

/**
 * Sets currently active session ID
 * @param {string|null} sessionId 
 */
export function setCurrentSessionId(sessionId) {
  memoryStore.currentSessionId = sessionId;
  if (isStorageAvailable()) {
    try {
      if (sessionId) {
        window.localStorage.setItem(CURRENT_SESSION_KEY, sessionId);
      } else {
        window.localStorage.removeItem(CURRENT_SESSION_KEY);
      }
    } catch {
      // Ignore
    }
  }
}

export default {
  listSessions,
  saveSession,
  loadSession,
  deleteSession,
  clearAllSessions,
  getCurrentSessionId,
  setCurrentSessionId,
  deriveSessionTitle
};
