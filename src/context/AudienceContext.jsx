/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Globe, Briefcase, Handshake, Heart } from 'lucide-react';

export const AUDIENCE_STORAGE_KEY = 'portfolio_audience_mode';
export const DEFAULT_AUDIENCE = 'all';

export const AUDIENCE_MODES = {
  all: {
    id: 'all',
    label: 'All (No Filter)',
    shortLabel: 'All',
    label_hi: 'सभी (कोई फ़िल्टर नहीं)',
    shortLabel_hi: 'सभी',
    icon: Globe,
    emoji: '🌐',
    badge: 'Full View',
    badge_hi: 'पूर्ण दृश्य',
    description: 'Default full portfolio view',
    description_hi: 'डिफ़ॉल्ट संपूर्ण पोर्टफोलियो दृश्य',
    accent: '#6366F1'
  },
  recruiter: {
    id: 'recruiter',
    label: 'Recruiter / Job',
    shortLabel: 'Recruiter / Job',
    label_hi: 'रिक्रूटर / जॉब',
    shortLabel_hi: 'रिक्रूटर / जॉब',
    icon: Briefcase,
    emoji: '💼',
    badge: 'Hiring Focus',
    badge_hi: 'हायरिंग फोकस',
    description: 'Hiring, HR & career oriented',
    description_hi: 'हायरिंग, एचआर एवं करियर उन्मुख दृश्य',
    accent: '#3B82F6'
  },
  client: {
    id: 'client',
    label: 'Freelancer / Client',
    shortLabel: 'Freelancer / Client',
    label_hi: 'फ्रीलांसर / क्लाइंट',
    shortLabel_hi: 'फ्रीलांसर / क्लाइंट',
    icon: Handshake,
    emoji: '🤝',
    badge: 'Services & Delivery',
    badge_hi: 'सेवाएं एवं डिलीवरी',
    description: 'Freelance services & client work',
    description_hi: 'फ्रीलांस सेवाएं एवं क्लाइंट कार्य दृश्य',
    accent: '#10B981'
  },
  marriage: {
    id: 'marriage',
    label: 'Marriage / Matrimonial',
    shortLabel: 'Marriage',
    label_hi: 'विवाह / मैट्रिमोनियल',
    shortLabel_hi: 'विवाह',
    icon: Heart,
    emoji: '💍',
    badge: 'Personal & Family',
    badge_hi: 'व्यक्तिगत एवं पारिवारिक',
    description: 'Personal background, values & family biodata',
    description_hi: 'व्यक्तिगत पृष्ठभूमि, संस्कार एवं पारिवारिक बायोडाटा',
    accent: '#F43F5E'
  }
};

export const AUDIENCE_LIST = [
  AUDIENCE_MODES.all,
  AUDIENCE_MODES.recruiter,
  AUDIENCE_MODES.client,
  AUDIENCE_MODES.marriage
];

const VALID_AUDIENCE_IDS = ['all', 'recruiter', 'client', 'marriage'];

const AudienceContext = createContext({
  audience: DEFAULT_AUDIENCE,
  setAudience: () => {},
  activeModeData: AUDIENCE_MODES.all,
  modes: AUDIENCE_MODES,
  modesList: AUDIENCE_LIST,
  isFilterActive: false
});

export function AudienceProvider({ children }) {
  // Read initial audience state from URL param (?audience=...) or localStorage
  const [audience, setAudienceState] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_AUDIENCE;

    try {
      const params = new URLSearchParams(window.location.search);
      const urlAudience = params.get('audience')?.toLowerCase();
      if (urlAudience && VALID_AUDIENCE_IDS.includes(urlAudience)) {
        return urlAudience;
      }

      const stored = localStorage.getItem(AUDIENCE_STORAGE_KEY);
      if (stored && VALID_AUDIENCE_IDS.includes(stored)) {
        return stored;
      }
    } catch {
      // Fallback silently if storage or URL parsing fails
    }

    return DEFAULT_AUDIENCE;
  });

  // Sync state changes with localStorage and URL query params
  const setAudience = useCallback((newMode) => {
    const cleanMode = String(newMode || '').toLowerCase();
    const targetMode = VALID_AUDIENCE_IDS.includes(cleanMode) ? cleanMode : DEFAULT_AUDIENCE;

    setAudienceState(targetMode);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(AUDIENCE_STORAGE_KEY, targetMode);

        const url = new URL(window.location.href);
        if (targetMode === DEFAULT_AUDIENCE) {
          url.searchParams.delete('audience');
        } else {
          url.searchParams.set('audience', targetMode);
        }
        window.history.replaceState(null, '', url);
      } catch {
        // Safe fallback
      }

      // Notify external listeners
      window.dispatchEvent(
        new CustomEvent('portfolio:audience-change', {
          detail: { audience: targetMode }
        })
      );
    }
  }, []);

  // Listen for browser popstate and storage events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlAudience = params.get('audience')?.toLowerCase();
        if (urlAudience && VALID_AUDIENCE_IDS.includes(urlAudience)) {
          setAudienceState(urlAudience);
        } else {
          setAudienceState(DEFAULT_AUDIENCE);
        }
      } catch {
        // Fallback
      }
    };

    const handleStorage = (e) => {
      if (e.key === AUDIENCE_STORAGE_KEY && e.newValue && VALID_AUDIENCE_IDS.includes(e.newValue)) {
        setAudienceState(e.newValue);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const activeModeData = useMemo(() => {
    return AUDIENCE_MODES[audience] || AUDIENCE_MODES.all;
  }, [audience]);

  const isFilterActive = audience !== DEFAULT_AUDIENCE;

  const value = useMemo(
    () => ({
      audience,
      setAudience,
      selectAudience: setAudience,
      activeModeData,
      modes: AUDIENCE_MODES,
      modesList: AUDIENCE_LIST,
      isFilterActive
    }),
    [audience, setAudience, activeModeData, isFilterActive]
  );

  return <AudienceContext.Provider value={value}>{children}</AudienceContext.Provider>;
}

export function useAudience() {
  const context = useContext(AudienceContext);
  return context;
}

export default AudienceContext;
