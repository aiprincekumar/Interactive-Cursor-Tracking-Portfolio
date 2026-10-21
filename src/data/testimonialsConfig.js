/**
 * Central Data Configuration: Verified Testimonials & Client Endorsements Module
 * Zero-Code Pure Configuration Architecture
 * 
 * Set `enabled: true` to seamlessly display Testimonials in the portfolio
 * and automatically expose the 'Testimonials' link in the top navigation bar.
 * When `enabled: false` (default), all testimonial elements and navigation links
 * are 100% suppressed with zero layout shift and zero residual footprint.
 */

export const TESTIMONIALS_CONFIG = {
  enabled: false, // Default is false per user directive
  sectionId: 'testimonials',
  eyebrowNumber: '07',
  eyebrowText: 'Client & Peer Endorsements',
  titlePrefix: 'Verified',
  titleHighlight: 'Testimonials',
  titleSuffix: '& Recommendations.',
  description: 'Authentic feedback and recommendations from colleagues, technical leads, and business stakeholders highlighting delivery reliability, domain precision, and problem-solving.',
  categories: ['All', 'Accounting & Tax', 'MIS & Analytics', 'Full-Stack & Vibe'],
  testimonials: [
    {
      id: 'testimonial-1',
      author: 'Rajesh K. Sharma',
      role: 'Chartered Accountant & Audit Partner',
      company: 'Sharma & Associates',
      avatar: 'RS',
      quote: 'Atul demonstrated exceptional precision in managing complex GST reconciliations and Tally Prime ledgers. His mastery over automated Excel macros cut our monthly closing turnaround by more than 40%.',
      category: 'Accounting & Tax',
      rating: 5,
      tag: 'Audit & Compliance',
      verified: true
    },
    {
      id: 'testimonial-2',
      author: 'Priya Sundaram',
      role: 'VP of Technology & Operations',
      company: 'FinPulse Systems',
      avatar: 'PS',
      quote: 'Working with Atul on full-stack interactive portals was effortless. His attention to accessible UI details, responsive kinematics, and reliable edge caching ensured a rock-solid production release.',
      category: 'Full-Stack & Vibe',
      rating: 5,
      tag: 'Full-Stack Engineering',
      verified: true
    },
    {
      id: 'testimonial-3',
      author: 'Amit Verma',
      role: 'Operations Director',
      company: 'Infocity Solutions',
      avatar: 'AV',
      quote: 'Atul streamlined our state-level MIS dashboards and reporting workflows for DAY-NULM and Smart Card programs. Clear communication, dependable milestones, and zero critical issues.',
      category: 'MIS & Analytics',
      rating: 5,
      tag: 'MIS & Operations',
      verified: true
    },
    {
      id: 'testimonial-4',
      author: 'Vikramaditya Mehta',
      role: 'Senior Product Manager',
      company: 'VibeScale Labs',
      avatar: 'VM',
      quote: 'Atul has a rare hybrid skill set: deep accounting logic combined with autonomous agentic software development. He built rapid, bug-free prototypes that exceeded all benchmark expectations.',
      category: 'Full-Stack & Vibe',
      rating: 5,
      tag: 'Rapid Prototyping',
      verified: true
    }
  ]
};

export const testimonialsConfig = TESTIMONIALS_CONFIG;

/**
 * Creates a customized testimonials configuration merged with defaults.
 * @param {Partial<typeof TESTIMONIALS_CONFIG>} overrides 
 */
export function createTestimonialsConfig(overrides = {}) {
  const safeOverrides = overrides || {};
  return {
    ...TESTIMONIALS_CONFIG,
    ...safeOverrides,
    categories: (Array.isArray(safeOverrides.categories) && safeOverrides.categories.length > 0)
      ? safeOverrides.categories
      : [...TESTIMONIALS_CONFIG.categories],
    testimonials: (Array.isArray(safeOverrides.testimonials) && safeOverrides.testimonials.length > 0)
      ? safeOverrides.testimonials
      : [...TESTIMONIALS_CONFIG.testimonials]
  };
}
