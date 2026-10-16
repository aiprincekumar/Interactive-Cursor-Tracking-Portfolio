/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { soundFX } from '../utils/audio';

export const STORAGE_KEY = 'portfolio_selected_role';
export const DEFAULT_ROLE = 'accountant';

export const PRIMARY_ROLES = [
  {
    id: 'accountant',
    label: 'Accountant & Tax',
    shortLabel: 'Accountant',
    mobileLabel: 'Acc',
    badge: 'Financial Track',
    description: 'Statutory compliance, Tally Prime ERP, GST & ITR e-filing, and audit readiness.',
    accent: '#FF4D6D',
    bgLight: 'bg-[#FFF0F3]',
    borderLight: 'border-[#FFD1DC]',
    tag: 'Finance & Compliance',
    icon: 'Briefcase',
    heroTitle: 'Accountant & Tax Consultant.',
    heroSubtitle: 'Business Development & Office Administrator.'
  },
  {
    id: 'mis',
    label: 'MIS & Analytics',
    shortLabel: 'MIS',
    mobileLabel: 'MIS',
    badge: 'Data & Operations Track',
    description: 'Executive database reporting, DAY-NULM Skill India, cross-district biometric ops, and data analytics.',
    accent: '#3B82F6',
    bgLight: 'bg-blue-50',
    borderLight: 'border-blue-200',
    tag: 'Data & Operations',
    icon: 'BarChart2',
    heroTitle: 'MIS & Data Analyst.',
    heroSubtitle: 'Business Intelligence, Automation & Operations Specialist.'
  }
];

export const OTHER_ROLE = {
  id: 'other',
  label: 'Other',
  shortLabel: 'Other',
  mobileLabel: 'Other',
  badge: 'Multidisciplinary Track',
  description: 'Versatile skills across accounting, operations, business intelligence, and custom workflows.',
  accent: '#8B5CF6',
  bgLight: 'bg-purple-50',
  borderLight: 'border-purple-200',
  tag: 'Multidisciplinary',
  icon: 'Sparkles',
  heroTitle: '',
  heroSubtitle: '',
  isOther: true
};

export const ROLE_TRACKS = [...PRIMARY_ROLES, OTHER_ROLE];

export const ROLE_DATA = Object.fromEntries(ROLE_TRACKS.map(r => [r.id, r]));

export const ROLE_TABS = ROLE_TRACKS;

export function isValidRole(role) {
  return Boolean(role && ROLE_DATA[role.toLowerCase()]);
}

export const RoleContext = createContext(null);

export function RoleProvider({ children, soundEnabled = true }) {
  // 1. Initial State Resolution: URL query param -> localStorage -> default ('accountant')
  const [activeRole, setActiveRoleState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlRole = params.get('role')?.toLowerCase();
        if (isValidRole(urlRole)) {
          return urlRole;
        }
      } catch {
        // Fallback to localStorage
      }

      try {
        const saved = localStorage.getItem(STORAGE_KEY)?.toLowerCase();
        if (isValidRole(saved)) {
          return saved;
        }
      } catch {
        // Fallback to default
      }
    }
    return DEFAULT_ROLE;
  });

  // 2. Core selectRole Handler with Synchronization
  const selectRole = useCallback((newRole, options = {}) => {
    const opts = typeof options === 'string' ? { source: options } : options || {};
    const { playSound = true, updateUrl = true, force = false } = opts;

    if (!isValidRole(newRole)) return;

    setActiveRoleState((currentRole) => {
      if (currentRole === newRole && !force) {
        return currentRole;
      }

      // Persist to localStorage safely
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, newRole);
        }
      } catch {
        // Ignore sandbox / quota errors
      }

      // Update URL query parameter without page reload via window.history.replaceState
      if (updateUrl && typeof window !== 'undefined') {
        try {
          const url = new URL(window.location.href);
          url.searchParams.set('role', newRole);
          window.history.replaceState({ ...window.history.state, role: newRole }, '', url.toString());
        } catch {
          // Ignore
        }
      }

      // Audio feedback
      if (playSound && soundEnabled) {
        soundFX.playFocusBeep();
      }

      // Outbound custom window event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('portfolio-role-change', { detail: { role: newRole } }));
      }

      return newRole;
    });
  }, [soundEnabled]);

  // 3. Browser History Navigation: Listen to popstate events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = (e) => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlRole = params.get('role')?.toLowerCase();
        if (isValidRole(urlRole)) {
          selectRole(urlRole, { playSound: false, updateUrl: false, force: true });
        } else if (e.state?.role && isValidRole(e.state.role)) {
          selectRole(e.state.role, { playSound: false, updateUrl: false, force: true });
        }
      } catch {
        // Ignore
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectRole]);

  // 4. Inbound Custom Event: Listen to 'switch-role-tab'
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleInboundSwitch = (e) => {
      const targetRole = e.detail?.role?.toLowerCase();
      if (isValidRole(targetRole)) {
        selectRole(targetRole, { playSound: e.detail?.playSound ?? true });
      }
    };

    window.addEventListener('switch-role-tab', handleInboundSwitch);
    return () => window.removeEventListener('switch-role-tab', handleInboundSwitch);
  }, [selectRole]);

  // 5. Memoized Context Value
  const value = useMemo(() => ({
    activeRole,
    setActiveRole: (role) => selectRole(role),
    selectRole,
    activeTrack: ROLE_DATA[activeRole] || ROLE_TRACKS[0],
    roleData: ROLE_DATA[activeRole] || ROLE_TRACKS[0],
    allRoles: ROLE_TRACKS,
    ROLE_TRACKS,
    ROLE_DATA,
    isAccountant: activeRole === 'accountant',
    isMIS: activeRole === 'mis',
    isMis: activeRole === 'mis',
    isOther: activeRole === 'other'
  }), [activeRole, selectRole]);

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRoleTab() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRoleTab must be used within a RoleProvider');
  }
  return context;
}

export const useRole = useRoleTab;

export default RoleProvider;
