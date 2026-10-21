/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { soundFX } from '../utils/audio';

export const STORAGE_KEY = 'portfolio_selected_role';
export const DEFAULT_ROLE = 'accountant';

const cleanBase = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');

export const OVERVIEW_ROLE = {
  id: 'overview',
  label: 'Overview',
  shortLabel: 'Overview',
  mobileLabel: 'Overview',
  badge: 'Executive Summary',
  description: 'Curated highlights from Financial, Data & Operations, and AI Vibe Coding tracks — a combined executive portfolio view.',
  accent: '#6366F1',
  bgLight: 'bg-indigo-50',
  borderLight: 'border-indigo-200',
  tag: 'Executive Overview',
  icon: 'LayoutDashboard',
  heroTitle: 'Financial & Operations Executive.',
  heroSubtitle: 'Bridging Statutory Accounting, Taxation, Data Intelligence & AI Software Engineering.',
  avatar: `${cleanBase}/assets/Profile_Pic/Overview.jpg`,
  isOverview: true
};

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
    heroSubtitle: 'Business Development & Office Administrator.',
    avatar: `${cleanBase}/assets/Profile_Pic/Accountant.jpg`
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
    heroSubtitle: 'Business Intelligence, Automation & Operations Specialist.',
    avatar: `${cleanBase}/assets/Profile_Pic/MIS.jpg`
  },
  {
    id: 'vibe_coding',
    label: 'Vibe Coding',
    shortLabel: 'Vibe Coder',
    mobileLabel: 'Vibe',
    badge: 'AI & SaaS Track',
    description: 'Rapid full-stack prototyping, autonomous coding agents, LLM APIs, and prompt-driven software architecture.',
    accent: '#10B981',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-200',
    tag: 'AI Engineering & SaaS',
    icon: 'Terminal',
    heroTitle: 'Vibe Coder & AI Software Engineer.',
    heroSubtitle: 'Rapid Full-Stack Prototyping, Autonomous Coding & SaaS Engineering.',
    avatar: `${cleanBase}/assets/Profile_Pic/VibeCoder.jpg`
  }
];

export const OTHER_ROLE = {
  id: 'other',
  label: 'Other ✨ AI',
  shortLabel: 'Other ✨ AI',
  mobileLabel: 'Other ✨ AI',
  badge: '🤖 AI-Synthesized Role (Derived from Verified Tracks)',
  description: 'Business Intelligence & Corporate Controller — an AI-synthesized role derived from verified Accountant and MIS competency tracks.',
  accent: '#8B5CF6',
  bgLight: 'bg-purple-50',
  borderLight: 'border-purple-200',
  tag: 'BI & Corporate Control',
  icon: 'Sparkles',
  heroTitle: '',
  heroSubtitle: '',
  specializationTitle: 'Business Intelligence & Corporate Controller.',
  specializationSubtitle: 'Statutory Financial Strategy & Executive Data Systems.',
  avatar: `${cleanBase}/assets/Profile_Pic/Others.jpg`,
  isOther: true,
  isAISynthesized: true
};

export const ROLE_TRACKS = [OVERVIEW_ROLE, ...PRIMARY_ROLES, OTHER_ROLE];

export const ROLE_DATA = Object.fromEntries(ROLE_TRACKS.map(r => [r.id, r]));

export const ROLE_TABS = ROLE_TRACKS;

export function normalizeRole(role) {
  if (!role || typeof role !== 'string') return null;
  const cleaned = role.trim().toLowerCase().replace(/-/g, '_');
  if (cleaned === 'vibe' || cleaned === 'vibecoding' || cleaned === 'vibecoder') {
    return 'vibe_coding';
  }
  return ROLE_DATA[cleaned] ? cleaned : null;
}

export function isValidRole(role) {
  return Boolean(normalizeRole(role));
}

export const RoleContext = createContext(null);

export function RoleProvider({ children, soundEnabled = true }) {
  // 1. Initial State Resolution: URL query param -> localStorage -> default ('accountant')
  const [activeRole, setActiveRoleState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlRole = normalizeRole(params.get('role'));
        if (urlRole) {
          return urlRole;
        }
      } catch {
        // Fallback to localStorage
      }

      try {
        const saved = normalizeRole(localStorage.getItem(STORAGE_KEY));
        if (saved) {
          return saved;
        }
      } catch {
        // Fallback to control center preferences
      }

      try {
        const rawCC = localStorage.getItem('portfolio_control_center');
        if (rawCC) {
          const parsedCC = JSON.parse(rawCC);
          const startupRole = normalizeRole(parsedCC?.preferences?.defaultStartupRole);
          if (startupRole) {
            return startupRole;
          }
        }
      } catch {
        // Fallback to default
      }
    }
    return DEFAULT_ROLE;
  });

  const activeRoleRef = useRef(activeRole);
  useEffect(() => {
    activeRoleRef.current = activeRole;
  }, [activeRole]);

  // 2. Core selectRole Handler with Synchronization
  const selectRole = useCallback((newRole, options = {}) => {
    const opts = typeof options === 'string' ? { source: options } : options || {};
    const { playSound = true, updateUrl = true, force = false } = opts;

    const normalizedRole = normalizeRole(newRole);
    if (!normalizedRole) return;

    const currentRole = activeRoleRef.current;
    if (currentRole === normalizedRole && !force) {
      return;
    }

    // Persist to localStorage safely
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, normalizedRole);
      }
    } catch {
      // Ignore sandbox / quota errors
    }

    // Update URL query parameter without page reload via window.history.replaceState
    if (updateUrl && typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('role', normalizedRole);
        const safeState = (typeof window.history.state === 'object' && window.history.state !== null)
          ? { ...window.history.state, role: normalizedRole }
          : { role: normalizedRole };
        try {
          window.history.replaceState(safeState, '', url.toString());
        } catch {
          // Fallback: If safeState contains non-serializable properties, replace with minimal clean state
          window.history.replaceState({ role: normalizedRole }, '', url.toString());
        }
      } catch {
        // Ignore
      }
    }

    // Audio feedback
    if (playSound && soundEnabled) {
      soundFX.playFocusBeep();
    }

    // Update state
    setActiveRoleState(normalizedRole);
    activeRoleRef.current = normalizedRole;

    // Outbound custom window event and screen reader announcement - dispatched ONCE outside state updater
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('portfolio-role-change', { detail: { role: normalizedRole } }));
      if (currentRole !== normalizedRole) {
        const roleTrack = ROLE_DATA[normalizedRole];
        const roleName = roleTrack?.label || normalizedRole;
        window.dispatchEvent(
          new CustomEvent('portfolio:announce', {
            detail: { message: `Active role changed to ${roleName}`, priority: 'polite' }
          })
        );
      }
    }
  }, [soundEnabled]);

  // 3. Browser History Navigation: Listen to popstate events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = (e) => {
      try {
        const params = new URLSearchParams(window.location.search);
        const roleParam = params.get('role');
        // Only switch role if an explicit ?role= param is present in URL and is different from current role
        if (roleParam) {
          const urlRole = normalizeRole(roleParam);
          if (urlRole && urlRole !== activeRoleRef.current) {
            selectRole(urlRole, { playSound: false, updateUrl: false });
          }
        } else if (e.state?.role) {
          const stateRole = normalizeRole(e.state.role);
          if (stateRole && stateRole !== activeRoleRef.current) {
            selectRole(stateRole, { playSound: false, updateUrl: false });
          }
        }
        // NEVER fall back to DEFAULT_ROLE on hash navigation (#skills, #about, etc.) or history state without ?role
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
      const targetRole = normalizeRole(e.detail?.role);
      if (targetRole) {
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
    activeTrack: ROLE_DATA[activeRole] || ROLE_DATA[DEFAULT_ROLE] || ROLE_TRACKS[0],
    roleData: ROLE_DATA[activeRole] || ROLE_DATA[DEFAULT_ROLE] || ROLE_TRACKS[0],
    allRoles: ROLE_TRACKS,
    ROLE_TRACKS,
    ROLE_DATA,
    isOverview: activeRole === 'overview',
    isAccountant: activeRole === 'accountant',
    isMIS: activeRole === 'mis',
    isMis: activeRole === 'mis',
    isOther: activeRole === 'other',
    isVibeCoding: activeRole === 'vibe_coding',
    isVibe: activeRole === 'vibe_coding'
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
