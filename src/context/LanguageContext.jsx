/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TRANSLATIONS } from '../data/translations';

const LANGUAGE_STORAGE_KEY = 'portfolio_language';

const LanguageContext = createContext(null);

/**
 * Universal helper to retrieve localized property from an object.
 * When isHindi is true, checks for `item[field + '_hi']`.
 * If present and non-empty, returns it; otherwise falls back to `item[field]`.
 *
 * @param {Object} item - Data item containing fields
 * @param {string} field - Base field name (e.g. 'description', 'title', 'quote')
 * @param {boolean} isHindi - Whether Hindi localization is active
 * @returns {any} Localized string or fallback value
 */
export function getLocalized(item, field = 'description', isHindi = false) {
  if (!item || typeof item !== 'object') return '';
  if (isHindi) {
    const hiKey = `${field}_hi`;
    const hiVal = item[hiKey];
    if (hiVal !== undefined && hiVal !== null && hiVal !== '') {
      return hiVal;
    }
  }
  const defaultVal = item[field];
  return defaultVal !== undefined && defaultVal !== null ? defaultVal : '';
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored === 'en' || stored === 'hi') {
          return stored;
        }
      } catch {
        // Fallback on restricted storage
      }
    }
    return 'en';
  });

  const setLanguage = useCallback((action) => {
    setLanguageState((prev) => {
      const target = typeof action === 'function' ? action(prev) : action;
      const lang = target === 'hi' ? 'hi' : 'en';
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
        } catch {
          // Ignore storage write error
        }
      }
      return lang;
    });
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  }, [setLanguage]);

  // Sync to html lang attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  /**
   * Translate key with optional fallback
   * Supports dot-notation paths, e.g. t('nav.home', 'Home')
   */
  const t = useCallback((key, fallback) => {
    if (!key) return fallback || '';
    
    const langDict = TRANSLATIONS[language] || TRANSLATIONS['en'];
    
    // Direct key lookup
    if (langDict && langDict[key] !== undefined) {
      return langDict[key];
    }

    // Dot-notation lookup (e.g., 'nav.home')
    if (typeof key === 'string' && key.includes('.')) {
      const parts = key.split('.');
      let current = langDict;
      for (const part of parts) {
        if (current && typeof current === 'object' && current[part] !== undefined) {
          current = current[part];
        } else {
          current = undefined;
          break;
        }
      }
      if (current !== undefined && typeof current === 'string') {
        return current;
      }
    }

    // Fallback to English dictionary if Hindi missing
    if (language !== 'en' && TRANSLATIONS['en']) {
      if (TRANSLATIONS['en'][key] !== undefined) {
        return TRANSLATIONS['en'][key];
      }
      if (typeof key === 'string' && key.includes('.')) {
        const parts = key.split('.');
        let current = TRANSLATIONS['en'];
        for (const part of parts) {
          if (current && typeof current === 'object' && current[part] !== undefined) {
            current = current[part];
          } else {
            current = undefined;
            break;
          }
        }
        if (current !== undefined && typeof current === 'string') {
          return current;
        }
      }
    }

    return fallback !== undefined ? fallback : key;
  }, [language]);

  const getLocalizedBound = useCallback(
    (item, field = 'description') => getLocalized(item, field, language === 'hi'),
    [language]
  );

  const value = {
    language,
    isHindi: language === 'hi',
    setLanguage,
    toggleLanguage,
    t,
    getLocalized: getLocalizedBound
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback if rendered outside provider
    return {
      language: 'en',
      isHindi: false,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key, fallback) => fallback || key,
      getLocalized: (item, field = 'description') => getLocalized(item, field, false)
    };
  }
  return context;
}
