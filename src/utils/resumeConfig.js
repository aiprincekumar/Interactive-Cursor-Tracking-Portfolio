/**
 * Centralized Resume Configuration Helper
 * Maps active role ('accountant', 'mis', 'other') to role-specific resume metadata,
 * file paths, download naming, accents, and sharing helpers.
 */

export const RESUME_ROLE_CONFIG = {
  accountant: {
    id: 'accountant',
    fileName: 'resume-accountant.pdf',
    downloadFilename: 'Atul_Verma_Accountant_Resume.pdf',
    label: 'Accountant Resume',
    badge: 'Accounting & Tax',
    subBadge: 'Finance & Tax Specialist',
    accent: '#FF4D6D',
    accentHover: '#E03554',
    accentActive: '#CC2947',
    bgLight: 'bg-rose-50',
    borderLight: 'border-rose-200',
    textAccent: 'text-[#FF4D6D]',
    ringAccent: 'focus-visible:ring-[#FF4D6D]',
    glowColor: 'rgba(255, 77, 109, 0.35)',
    confettiColors: ['#FF4D6D', '#FFAA00', '#FF85A1', '#FFD166', '#FFFFFF']
  },
  mis: {
    id: 'mis',
    fileName: 'resume-mis.pdf',
    downloadFilename: 'Atul_Verma_MIS_Resume.pdf',
    label: 'MIS & Analytics Resume',
    badge: 'Data & Operations',
    subBadge: 'Data & Operations Specialist',
    accent: '#3B82F6',
    accentHover: '#2563EB',
    accentActive: '#1D4ED8',
    bgLight: 'bg-blue-50',
    borderLight: 'border-blue-200',
    textAccent: 'text-[#3B82F6]',
    ringAccent: 'focus-visible:ring-[#3B82F6]',
    glowColor: 'rgba(59, 130, 246, 0.35)',
    confettiColors: ['#3B82F6', '#60A5FA', '#93C5FD', '#38BDF8', '#FFFFFF']
  },
  other: {
    id: 'other',
    fileName: 'resume.pdf',
    downloadFilename: 'Atul_Verma_Resume.pdf',
    label: 'Comprehensive Resume',
    badge: 'Multidisciplinary',
    subBadge: 'Multidisciplinary Career Track',
    accent: '#8B5CF6',
    accentHover: '#7C3AED',
    accentActive: '#6D28D9',
    bgLight: 'bg-purple-50',
    borderLight: 'border-purple-200',
    textAccent: 'text-[#8B5CF6]',
    ringAccent: 'focus-visible:ring-[#8B5CF6]',
    glowColor: 'rgba(139, 92, 246, 0.35)',
    confettiColors: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#EC4899', '#FFFFFF']
  }
};

/**
 * Returns the resume configuration for a given role ID.
 * Falls back to 'other' (comprehensive) if role is unknown or omitted.
 *
 * @param {string} roleId
 * @returns {object} Resume configuration object with resolved paths and share helper
 */
export function getResumeConfig(roleId) {
  const normalizedRole = (roleId || '').toLowerCase();
  const config = RESUME_ROLE_CONFIG[normalizedRole] || RESUME_ROLE_CONFIG.other;

  // Resolve base path safely for Vite environment
  const rawBase = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
    ? import.meta.env.BASE_URL
    : '/';
  const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

  const pdfPath = `${base}${config.fileName}`;

  return {
    ...config,
    pdfPath,
    /**
     * Constructs a shareable portfolio URL with active role query param.
     * @param {string} [customOrigin] Optional custom origin override
     * @returns {string} Fully qualified URL, e.g. "https://example.com/?role=accountant"
     */
    getShareUrl(customOrigin) {
      if (typeof window !== 'undefined') {
        const origin = customOrigin || window.location.origin;
        const pathname = window.location.pathname;
        return `${origin}${pathname}?role=${config.id}`;
      }
      return `/?role=${config.id}`;
    }
  };
}

export default getResumeConfig;
