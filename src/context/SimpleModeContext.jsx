/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SIMPLE_MODE_STORAGE_KEY = 'portfolio_simple_mode';

const SimpleModeContext = createContext(null);

export function SimpleModeProvider({ children }) {
  const [isSimpleMode, setIsSimpleMode] = useState(() => {
    try {
      const stored = localStorage.getItem(SIMPLE_MODE_STORAGE_KEY);
      return stored === 'true';
    } catch {
      return false;
    }
  });

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(SIMPLE_MODE_STORAGE_KEY, isSimpleMode);
    } catch {}
  }, [isSimpleMode]);

  // Apply or remove body class for simple mode
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isSimpleMode) {
        document.body.classList.add('simple-mode');
      } else {
        document.body.classList.remove('simple-mode');
      }
    }
  }, [isSimpleMode]);

  const toggleSimpleMode = useCallback(() => setIsSimpleMode(prev => !prev), []);

  const value = { isSimpleMode, setIsSimpleMode, toggleSimpleMode };

  return (
    <SimpleModeContext.Provider value={value}>
      {children}
    </SimpleModeContext.Provider>
  );
}

export function useSimpleMode() {
  const context = useContext(SimpleModeContext);
  if (!context) {
    throw new Error('useSimpleMode must be used within a SimpleModeProvider');
  }
  return context;
}
