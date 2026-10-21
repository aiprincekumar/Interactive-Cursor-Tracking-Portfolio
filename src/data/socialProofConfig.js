/**
 * Central Data Configuration: Key Achievements & Production Impact Metrics Module
 * Interactive Cursor-Tracking Portfolio
 * 
 * Provides active quantifiable impact metrics and verified engineering benchmarks.
 */

export const DEFAULT_SOCIAL_PROOF_CONFIG = {
  sectionId: 'social-proof',
  eyebrowNumber: '06',
  eyebrowText: 'Key Achievements & Production Impact',
  titlePrefix: 'Proof-First',
  titleHighlight: 'Technical Impact',
  titleSuffix: '& Achievements.',
  description: 'Empirically verified delivery benchmarks across high-concurrency systems, mission-critical pipelines, and enterprise-grade production engineering.',
  metricsHeading: 'Production Benchmarks & Technical Impact',
  
  // Quantifiable Engineering Metrics (R1)
  impactMetrics: [
    {
      id: 'latency-reduction',
      value: '-42%',
      prefix: '',
      suffix: '',
      label: 'Latency Reduction',
      sublabel: 'Edge caching & bundle splitting optimization',
      description: 'Optimized p99 server responses to sub-50ms with zero cache invalidation race conditions.',
      icon: 'Zap',
      trend: '+18% vs industry SLA',
      status: 'Verified Benchmark',
      category: 'Performance'
    },
    {
      id: 'features-delivered',
      value: '35+',
      prefix: '',
      suffix: '',
      label: 'Full-Stack Features Delivered',
      sublabel: 'Autonomous multi-agent loops to SaaS platforms',
      description: 'End-to-end fullstack production modules with comprehensive test suites and zero critical regressions.',
      icon: 'Layers',
      trend: '10x Dev Velocity',
      status: 'Production Live',
      category: 'Velocity'
    },
    {
      id: 'system-uptime',
      value: '99.99%',
      prefix: '',
      suffix: '',
      label: 'System Uptime SLA',
      sublabel: 'Zero unplanned downtime across active deployments',
      description: 'Fault-tolerant multi-zone infrastructure with automated health-check failover protection.',
      icon: 'ShieldCheck',
      trend: 'High Availability',
      status: 'Enterprise Resilient',
      category: 'Reliability'
    },
    {
      id: 'responsive-standards',
      value: '<100ms',
      prefix: '',
      suffix: '',
      label: 'Responsive Standards',
      sublabel: 'Strict INP & Total Blocking Time',
      description: 'Flawless 60fps cursor animation frame stability, 0 layout shifts (CLS), and 98+ Lighthouse score.',
      icon: 'Activity',
      trend: 'Web Vitals Green',
      status: 'Green Tier',
      category: 'UX Precision'
    }
  ]
};

export const socialProofConfig = DEFAULT_SOCIAL_PROOF_CONFIG;

/**
 * Creates a customized impact metrics configuration merged with defaults.
 * Automatically falls back to default impactMetrics if empty or malformed arrays are provided.
 * @param {Partial<typeof DEFAULT_SOCIAL_PROOF_CONFIG>} overrides 
 */
export function createSocialProofConfig(overrides = {}) {
  const safeOverrides = overrides || {};
  return {
    ...DEFAULT_SOCIAL_PROOF_CONFIG,
    ...safeOverrides,
    impactMetrics: (Array.isArray(safeOverrides.impactMetrics) && safeOverrides.impactMetrics.length > 0)
      ? safeOverrides.impactMetrics
      : [...DEFAULT_SOCIAL_PROOF_CONFIG.impactMetrics]
  };
}
