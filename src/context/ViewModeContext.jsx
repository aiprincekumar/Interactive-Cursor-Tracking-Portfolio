/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { FileText, Sparkles, Layers, Terminal } from 'lucide-react';
import { useSimpleMode } from './SimpleModeContext';

export const VIEW_MODE_STORAGE_KEY = 'portfolio_view_mode';
export const DEFAULT_VIEW_MODE = 'modern';

export const VIEW_MODES = {
  basic: {
    id: 'basic',
    label: 'Basic / PDF',
    label_hi: 'बेसिक / PDF',
    labelHi: 'बेसिक / PDF',
    shortLabel: 'Basic / PDF',
    shortLabel_hi: 'बेसिक / PDF',
    emoji: '📄',
    icon: FileText,
    badge: 'Document',
    badge_hi: 'दस्तावेज़',
    description: 'Clean document-style reading view without heavy animations',
    description_hi: 'बिना भारी एनिमेशन के स्वच्छ दस्तावेज़-शैली रीडिंग दृश्य',
    accent: '#64748B'
  },
  simple: {
    id: 'simple',
    label: 'Simple / Classic',
    label_hi: 'सिंपल / क्लासिक',
    labelHi: 'सिंपल / क्लासिक',
    shortLabel: 'Simple / Classic',
    shortLabel_hi: 'सिंपल / क्लासिक',
    emoji: '🍃',
    icon: Sparkles,
    badge: 'Minimal',
    badge_hi: 'मिनिमल',
    description: 'Minimalist layout, system cursor & ultra-fast performance',
    description_hi: 'स्वच्छ, तेज़ और न्यूनतम मोशन लेआउट',
    accent: '#10B981'
  },
  modern: {
    id: 'modern',
    label: 'Modern / Interactive',
    label_hi: 'मॉडर्न / इंटरैक्टिव',
    labelHi: 'मॉडर्न / इंटरैक्टिव',
    shortLabel: 'Modern / Interactive',
    shortLabel_hi: 'मॉडर्न / इंटरैक्टिव',
    emoji: '⚡',
    icon: Layers,
    badge: 'Rich 3D',
    badge_hi: 'रिच 3D',
    description: 'Default rich 3D interactive animations & kinematics',
    description_hi: 'डिफ़ॉल्ट संपूर्ण 3D इंटरएक्टिव और डायनामिक FX',
    accent: '#FF4D6D'
  },
  terminal: {
    id: 'terminal',
    label: 'Terminal / Developer',
    label_hi: 'टर्मिनल / डेवलपर',
    labelHi: 'टर्मिनल / डेवलपर',
    shortLabel: 'Terminal / Developer',
    shortLabel_hi: 'टर्मिनल / डेवलपर',
    emoji: '💻',
    icon: Terminal,
    badge: 'CLI',
    badge_hi: 'सी.एल.आई',
    description: 'Interactive developer command-line terminal console (~/_)',
    description_hi: 'इंटरएक्टिव डेवलपर कमांड लाइन कंसोल (~/_)',
    accent: '#06B6D4'
  }
};

export const VIEW_MODE_LIST = [
  VIEW_MODES.basic,
  VIEW_MODES.simple,
  VIEW_MODES.modern,
  VIEW_MODES.terminal
];

export const VALID_VIEW_MODE_IDS = ['basic', 'simple', 'modern', 'terminal'];

const ViewModeContext = createContext({
  viewMode: DEFAULT_VIEW_MODE,
  setViewMode: () => {},
  selectViewMode: () => {},
  activeModeData: VIEW_MODES.modern,
  modes: VIEW_MODES,
  modesList: VIEW_MODE_LIST
});

export function ViewModeProvider({ children }) {
  let simpleModeContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    simpleModeContext = useSimpleMode();
  } catch {
    // Fallback if rendered outside SimpleModeProvider
  }
  const isSimpleMode = simpleModeContext?.isSimpleMode ?? false;
  const setIsSimpleMode = simpleModeContext?.setIsSimpleMode;

  // Initialize viewMode from localStorage
  const [viewMode, setViewModeState] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_VIEW_MODE;
    try {
      const stored = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
      if (stored && VALID_VIEW_MODE_IDS.includes(stored)) {
        return stored;
      }
    } catch {
      // Fallback silently
    }
    return DEFAULT_VIEW_MODE;
  });

  // Keep body class and SimpleModeContext in sync when viewMode changes
  const applyViewMode = useCallback((modeId) => {
    const cleanMode = String(modeId || '').toLowerCase();
    const targetMode = VALID_VIEW_MODE_IDS.includes(cleanMode) ? cleanMode : DEFAULT_VIEW_MODE;

    setViewModeState(targetMode);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(VIEW_MODE_STORAGE_KEY, targetMode);
      } catch {
        // Safe fallback
      }

      // Synchronize body CSS class
      if (typeof document !== 'undefined') {
        document.body.classList.remove(
          'view-mode-basic',
          'view-mode-simple',
          'view-mode-modern',
          'view-mode-terminal'
        );
        document.body.classList.add(`view-mode-${targetMode}`);
      }

      // Handle mode-specific actions
      if (targetMode === 'simple') {
        if (setIsSimpleMode) setIsSimpleMode(true);
      } else if (targetMode === 'basic') {
        // Basic mode also uses lightweight non-3d mode
        if (setIsSimpleMode) setIsSimpleMode(true);
      } else if (targetMode === 'modern') {
        if (setIsSimpleMode) setIsSimpleMode(false);
      } else if (targetMode === 'terminal') {
        // Trigger developer terminal CLI
        window.dispatchEvent(new CustomEvent('portfolio:open-terminal'));
      }

      // Notify external listeners
      window.dispatchEvent(
        new CustomEvent('portfolio:view-mode-change', {
          detail: { viewMode: targetMode }
        })
      );
    }
  }, [setIsSimpleMode]);

  // Public selectViewMode handler
  const selectViewMode = useCallback((modeId) => {
    applyViewMode(modeId);
  }, [applyViewMode]);

  const setViewMode = useCallback((modeId) => {
    applyViewMode(modeId);
  }, [applyViewMode]);

  // Synchronize on external changes to isSimpleMode
  useEffect(() => {
    if (isSimpleMode && (viewMode === 'modern')) {
      setViewModeState('simple');
      try {
        localStorage.setItem(VIEW_MODE_STORAGE_KEY, 'simple');
      } catch {}
    } else if (!isSimpleMode && (viewMode === 'simple' || viewMode === 'basic')) {
      setViewModeState('modern');
      try {
        localStorage.setItem(VIEW_MODE_STORAGE_KEY, 'modern');
      } catch {}
    }
  }, [isSimpleMode, viewMode]);

  // Apply initial body classes on mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.add(`view-mode-${viewMode}`);
      if (viewMode === 'simple' || viewMode === 'basic') {
        if (setIsSimpleMode) setIsSimpleMode(true);
      }
    }
  }, []);

  const activeModeData = useMemo(() => {
    return VIEW_MODES[viewMode] || VIEW_MODES.modern;
  }, [viewMode]);

  const value = useMemo(() => ({
    viewMode,
    setViewMode,
    selectViewMode,
    activeModeData,
    modes: VIEW_MODES,
    modesList: VIEW_MODE_LIST,
    VIEW_MODES,
    VIEW_MODE_LIST
  }), [viewMode, setViewMode, selectViewMode, activeModeData]);

  return (
    <ViewModeContext.Provider value={value}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
}
