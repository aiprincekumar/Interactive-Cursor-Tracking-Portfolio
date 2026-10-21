/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const HIGH_CONTRAST_STORAGE_KEY = 'portfolio_high_contrast';

const HighContrastContext = createContext(null);

export function HighContrastProvider({ children }) {
  const [isHighContrast, setIsHighContrast] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem(HIGH_CONTRAST_STORAGE_KEY);
      if (stored !== null) return stored === 'true';
      if (
        (window.matchMedia && window.matchMedia('(forced-colors: active)').matches) ||
        (window.matchMedia && window.matchMedia('(prefers-contrast: more)').matches)
      ) {
        return true;
      }
    } catch {
      return false;
    }
    return false;
  });

  // Synchronize high-contrast class on root elements
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.toggle('high-contrast', isHighContrast);
    if (document.body) {
      document.body.classList.toggle('high-contrast', isHighContrast);
    }

    try {
      localStorage.setItem(HIGH_CONTRAST_STORAGE_KEY, String(isHighContrast));
    } catch {}

    try {
      window.dispatchEvent(
        new CustomEvent('portfolio:high-contrast-change', { detail: { isHighContrast } })
      );
    } catch {}
  }, [isHighContrast]);

  const toggleHighContrast = useCallback(() => {
    setIsHighContrast((prev) => !prev);
  }, []);

  // Global accessible keyboard shortcut: Alt+H (or Option+H on Mac)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e) => {
      // Check Alt+H (ignoring inside text inputs / textareas to prevent interfering with typing if any)
      if (e.altKey && (e.key === 'h' || e.key === 'H' || e.code === 'KeyH')) {
        e.preventDefault();
        toggleHighContrast();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleHighContrast]);

  const value = {
    isHighContrast,
    setIsHighContrast,
    toggleHighContrast,
  };

  return (
    <HighContrastContext.Provider value={value}>
      {children}
    </HighContrastContext.Provider>
  );
}

export function useHighContrast() {
  const context = useContext(HighContrastContext);
  if (!context) {
    throw new Error('useHighContrast must be used within HighContrastProvider');
  }
  return context;
}
