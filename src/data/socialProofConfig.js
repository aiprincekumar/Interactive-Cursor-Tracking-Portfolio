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
  eyebrowText_hi: 'प्रमुख उपलब्धियां एवं प्रोडक्शन प्रभाव',
  titlePrefix: 'Proof-First',
  titlePrefix_hi: 'प्रमाण-प्रथम',
  titleHighlight: 'Technical Impact',
  titleHighlight_hi: 'तकनीकी प्रभाव',
  titleSuffix: '& Achievements.',
  titleSuffix_hi: 'एवं उपलब्धियां।',
  description: 'Empirically verified delivery benchmarks across high-concurrency systems, mission-critical pipelines, and enterprise-grade production engineering.',
  description_hi: 'उच्च-सटीकता प्रणालियों, मिशन-क्रिटिकल डेटा पाइपलाइनों और एंटरप्राइज-स्तरीय वित्तीय प्रणालियों में सिद्ध एवं प्रमाणित परिणाम।',
  metricsHeading: 'Production Benchmarks & Technical Impact',
  metricsHeading_hi: 'प्रोडक्शन मानक एवं तकनीकी प्रभाव',
  
  // Quantifiable Engineering Metrics (R1)
  impactMetrics: [
    {
      id: 'latency-reduction',
      value: '-42%',
      prefix: '',
      suffix: '',
      label: 'Latency Reduction',
      label_hi: 'विलंबता में कमी (Latency Reduction)',
      sublabel: 'Edge caching & bundle splitting optimization',
      sublabel_hi: 'Edge caching एवं बंडल स्प्लिटिंग अनुकूलन',
      description: 'Optimized p99 server responses to sub-50ms with zero cache invalidation race conditions.',
      description_hi: 'शून्य कैश अमान्यता विसंगति के साथ p99 सर्वर प्रतिक्रिया को 50ms से नीचे अनुकूलित किया।',
      icon: 'Zap',
      trend: '+18% vs industry SLA',
      trend_hi: 'उद्योग SLA से +18% बेहतर',
      status: 'Verified Benchmark',
      status_hi: 'सत्यापित बेंचमार्क',
      category: 'Performance',
      category_hi: 'प्रदर्शन'
    },
    {
      id: 'features-delivered',
      value: '35+',
      prefix: '',
      suffix: '',
      label: 'Full-Stack Features Delivered',
      label_hi: 'फुल-स्टैक फीचर्स व मॉड्यूल्स',
      sublabel: 'Autonomous multi-agent loops to SaaS platforms',
      sublabel_hi: 'स्वायत्त मल्टी-एजेंट लूप्स से लेकर SaaS प्लेटफॉर्म्स तक',
      description: 'End-to-end fullstack production modules with comprehensive test suites and zero critical regressions.',
      description_hi: 'व्यापक टेस्ट सुइट्स और शून्य महत्वपूर्ण बग्स के साथ एंड-टू-एंड फुल-स्टैक प्रोडक्शन मॉड्यूल्स।',
      icon: 'Layers',
      trend: '10x Dev Velocity',
      trend_hi: '10x विकास गति',
      status: 'Production Live',
      status_hi: 'प्रोडक्शन लाइव',
      category: 'Velocity',
      category_hi: 'गति'
    },
    {
      id: 'system-uptime',
      value: '99.99%',
      prefix: '',
      suffix: '',
      label: 'System Uptime SLA',
      label_hi: 'सिस्टम अपटाइम उपलब्धता (SLA)',
      sublabel: 'Zero unplanned downtime across active deployments',
      sublabel_hi: 'सक्रिय परिनियोजन में शून्य अनियोजित डाउनटाइम',
      description: 'Fault-tolerant multi-zone infrastructure with automated health-check failover protection.',
      description_hi: 'स्वचालित हेल्थ-चेक फेलओवर सुरक्षा के साथ फॉल्ट-टॉलरेंट मल्टी-ज़ोन इन्फ्रास्ट्रक्चर।',
      icon: 'ShieldCheck',
      trend: 'High Availability',
      trend_hi: 'उच्च उपलब्धता',
      status: 'Enterprise Resilient',
      status_hi: 'एंटरप्राइज लचीलापन',
      category: 'Reliability',
      category_hi: 'विश्वसनीयता'
    },
    {
      id: 'responsive-standards',
      value: '<100ms',
      prefix: '',
      suffix: '',
      label: 'Responsive Standards',
      label_hi: 'रेस्पॉन्सिव एवं स्मूथ परफॉर्मेंस',
      sublabel: 'Strict INP & Total Blocking Time',
      sublabel_hi: 'कड़ा INP एवं न्यूनतम Total Blocking Time',
      description: 'Flawless 60fps cursor animation frame stability, 0 layout shifts (CLS), and 98+ Lighthouse score.',
      description_hi: 'उत्कृष्ट 60fps कर्सर एनीमेशन फ्रेम स्थिरता, 0 लेआउट शिफ्ट्स (CLS) और 98+ Lighthouse स्कोर।',
      icon: 'Activity',
      trend: 'Web Vitals Green',
      trend_hi: 'Web Vitals ग्रीन',
      status: 'Green Tier',
      status_hi: 'ग्रीन टियर',
      category: 'UX Precision',
      category_hi: 'UX सटीकता'
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
