import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Mapping dictionary between accordion sections / element keys
 * and their corresponding 3D sandbox preview tabs.
 */
export const ACCORDION_TO_PREVIEW_MAP = {
  // 9 Core 3D Settings Accordions
  elements: 'showcase',
  lighting: 'hero',
  camera: 'universal',
  materials: 'hero',
  physics: 'dock',
  exploded: 'hero',
  environment: 'universal',
  spatialAudio: 'hero',
  performance: 'universal',

  // Direct element toggles & aliases
  hero: 'hero',
  card3d: 'hero',
  navbar: 'navbar',
  nav: 'navbar',
  dock: 'dock',
  floatingDock: 'dock',
  footer: 'footer',
  cards: 'showcase',
  showcase: 'showcase',
  universal: 'universal',
  portfolio: 'universal'
};

/**
 * Resolves the target preview tab ID for a given accordion section key.
 * Normalizes tab names so 'card3d' resolves to 'hero', and 'nav' resolves to 'navbar'.
 *
 * @param {string} accordionKey - Section key (e.g. 'lighting', 'physics', 'nav')
 * @returns {string|null} Resolved preview tab ID or null if unrecognized
 */
export function getPreviewTabForAccordion(accordionKey) {
  if (!accordionKey) return null;
  const normalizedKey = String(accordionKey).toLowerCase().trim();
  return ACCORDION_TO_PREVIEW_MAP[normalizedKey] || null;
}

/**
 * Normalizes preview tab IDs to standard canonical IDs
 * ('card3d' -> 'hero', 'nav' -> 'navbar').
 */
export function normalizePreviewTab(tabId) {
  if (!tabId) return 'universal';
  const cleanId = String(tabId).toLowerCase().trim();
  if (cleanId === 'card3d') return 'hero';
  if (cleanId === 'nav') return 'navbar';
  if (cleanId === 'floatingdock') return 'dock';
  return cleanId;
}

/**
 * Normalizes component keys for bi-directional visual linking
 * ('nav' -> 'navbar', 'hero'/'header' -> 'hero', 'cards'/'containers' -> 'showcase')
 */
export function normalizeComponentKey(key) {
  if (!key) return null;
  const k = String(key).toLowerCase().trim();
  if (k === 'nav' || k === 'navbar' || k === 'navigation') return 'navbar';
  if (k === 'hero' || k === 'header' || k === 'card3d' || k === 'avatar' || k === 'profilepic') return 'hero';
  if (k === 'footer') return 'footer';
  if (k === 'dock' || k === 'floatingbutton') return 'dock';
  if (k === 'showcase' || k === 'cards' || k === 'grid' || k === 'container' || k === 'containercontent' || k === 'containers') return 'showcase';
  if (k === 'universal') return 'universal';
  return k;
}

/**
 * useSandboxAutoSwitch
 *
 * Phase 4: Contextual Multi-Sandbox Previews & Hybrid Auto-Switch Engine
 *
 * Automatically aligns the sticky 3D sandbox preview on the left with the active
 * settings accordion being adjusted on the right, while granting users manual
 * tab override with an automatic 25-30 second grace period.
 *
 * @param {Object} options
 * @param {string} [options.initialTab='universal'] - Initial active preview tab
 * @param {number} [options.gracePeriodMs=25000] - Duration to pause auto-switch on manual user selection
 * @param {boolean} [options.autoSwitchEnabled=true] - Master toggle for auto-switching
 */
export function useSandboxAutoSwitch({
  initialTab = 'universal',
  gracePeriodMs = 25000,
  autoSwitchEnabled = true
} = {}) {
  const [activePreviewTab, setActivePreviewTabState] = useState(() => normalizePreviewTab(initialTab));
  const [isAutoSwitchPaused, setIsAutoSwitchPaused] = useState(false);
  const pauseTimerRef = useRef(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };
  }, []);

  /**
   * Directly sets active preview tab without triggering or changing pause state.
   */
  const setActivePreviewTab = useCallback((tabId) => {
    setActivePreviewTabState(normalizePreviewTab(tabId));
  }, []);

  /**
   * Resumes auto-switch immediately and clears any active grace period timer.
   */
  const resumeAutoSwitch = useCallback(() => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    setIsAutoSwitchPaused(false);
  }, []);

  /**
   * Pauses auto-switch for a custom duration (or default grace period).
   */
  const pauseAutoSwitch = useCallback((durationMs = gracePeriodMs) => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }
    setIsAutoSwitchPaused(true);
    pauseTimerRef.current = setTimeout(() => {
      setIsAutoSwitchPaused(false);
      pauseTimerRef.current = null;
    }, durationMs);
  }, [gracePeriodMs]);

  /**
   * Handle user manual tab click from the Tab Bar.
   * Updates active tab and engages the grace period freeze (25-30s).
   */
  const handleManualTabSelect = useCallback((tabId) => {
    const normalized = normalizePreviewTab(tabId);
    setActivePreviewTabState(normalized);
    pauseAutoSwitch(gracePeriodMs);
  }, [gracePeriodMs, pauseAutoSwitch]);

  /**
   * Notifies the auto-switch engine when an accordion is expanded or focused in the right column.
   * If autoSwitchEnabled is true, smoothly switches to the corresponding component preview.
   * If auto-switch was paused by manual click, an explicit accordion interaction overrides the pause.
   */
  const notifyAccordionChange = useCallback((accordionKey) => {
    if (!autoSwitchEnabled || !accordionKey) return;

    const targetTab = getPreviewTabForAccordion(accordionKey);
    if (targetTab) {
      // Explicit accordion interaction breaks manual pause
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
        pauseTimerRef.current = null;
      }
      setIsAutoSwitchPaused(false);
      setActivePreviewTabState(targetTab);
    }
  }, [autoSwitchEnabled]);

  return {
    activePreviewTab,
    setActivePreviewTab,
    handleManualTabSelect,
    isAutoSwitchPaused,
    resumeAutoSwitch,
    pauseAutoSwitch,
    notifyAccordionChange,
    // Ergonomic aliases
    isPaused: isAutoSwitchPaused,
    setPreviewTab: setActivePreviewTab
  };
}

export default useSandboxAutoSwitch;
