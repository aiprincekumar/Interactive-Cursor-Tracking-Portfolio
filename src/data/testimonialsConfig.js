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
  eyebrowText_hi: 'ग्राहक एवं सहयोगी अनुशंसाएं',
  titlePrefix: 'Verified',
  titlePrefix_hi: 'सत्यापित',
  titleHighlight: 'Testimonials',
  titleHighlight_hi: 'प्रशंसापत्र',
  titleSuffix: '& Recommendations.',
  titleSuffix_hi: 'एवं अनुशंसाएं।',
  description: 'Authentic feedback and recommendations from colleagues, technical leads, and business stakeholders highlighting delivery reliability, domain precision, and problem-solving.',
  description_hi: 'सहकर्मियों, तकनीकी प्रमुखों और व्यावसायिक हितधारकों द्वारा कार्य विश्वसनीयता, डोमेन सटीकता और त्वरित समस्या समाधान पर वास्तविक अनुशंसाएं।',
  categories: ['All', 'Accounting & Tax', 'MIS & Analytics', 'Full-Stack & Vibe'],
  categories_hi: ['सभी', 'अकाउंटिंग व टैक्स', 'MIS व एनालिटिक्स', 'फुल-स्टैक व Vibe'],
  testimonials: [
    {
      id: 'testimonial-1',
      author: 'Rajesh K. Sharma',
      author_hi: 'राजेश के. शर्मा',
      role: 'Chartered Accountant & Audit Partner',
      role_hi: 'चार्टर्ड अकाउंटेंट एवं ऑडिट पार्टनर',
      company: 'Sharma & Associates',
      avatar: 'RS',
      quote: 'Atul demonstrated exceptional precision in managing complex GST reconciliations and Tally Prime ledgers. His mastery over automated Excel macros cut our monthly closing turnaround by more than 40%.',
      quote_hi: 'अतुल ने जटिल GST समाधानों और Tally Prime खातों के प्रबंधन में असाधारण सटीकता प्रदर्शित की। स्वचालित Excel मैक्रोज़ पर उनकी महारत ने हमारे मासिक क्लोजिंग समय को 40% से अधिक कम कर दिया।',
      label: 'GST & Tally Prime Ledger Precision',
      label_hi: 'GST एवं Tally Prime बहीखाता सटीकता',
      sublabel: 'Sharma & Associates • Audit & Compliance',
      sublabel_hi: 'शर्मा एंड एसोसिएट्स • ऑडिट व अनुपालन',
      description: 'Handled high-volume statutory filing and monthly ledger reconciliation with zero discrepancy notices.',
      description_hi: 'शून्य विसंगति नोटिस के साथ उच्च-मात्रा वैधानिक फाइलिंग और मासिक बहीखाता समाधान संभाला।',
      category: 'Accounting & Tax',
      rating: 5,
      tag: 'Audit & Compliance',
      tag_hi: 'ऑडिट एवं अनुपालन',
      verified: true
    },
    {
      id: 'testimonial-2',
      author: 'Priya Sundaram',
      author_hi: 'प्रिया सुंदरम',
      role: 'VP of Technology & Operations',
      role_hi: 'वी.पी. टेक्नोलॉजी एवं ऑपरेशंस',
      company: 'FinPulse Systems',
      avatar: 'PS',
      quote: 'Working with Atul on full-stack interactive portals was effortless. His attention to accessible UI details, responsive kinematics, and reliable edge caching ensured a rock-solid production release.',
      quote_hi: 'फुल-स्टैक इंटरएक्टिव पोर्टल्स पर अतुल के साथ काम करना बेहद सहज रहा। सुलभ UI बारीकियों, रेस्पॉन्सिव काइनेमैटिक्स और विश्वसनीय एज कैशिंग पर उनके ध्यान ने एक मजबूत प्रोडक्शन रिलीज सुनिश्चित की।',
      label: 'Full-Stack Portal & UI Kinematics',
      label_hi: 'फुल-स्टैक पोर्टल एवं UI काइनेमैटिक्स',
      sublabel: 'FinPulse Systems • Full-Stack Engineering',
      sublabel_hi: 'फिनपल्स सिस्टम्स • फुल-स्टैक इंजीनियरिंग',
      description: 'Delivered accessible 60fps responsive interfaces with zero layout shifts and seamless state management.',
      description_hi: 'शून्य लेआउट शिफ्ट और निर्बाध स्टेट मैनेजमेंट के साथ सुलभ 60fps रेस्पॉन्सिव इंटरफेस डिलीवर किए।',
      category: 'Full-Stack & Vibe',
      rating: 5,
      tag: 'Full-Stack Engineering',
      tag_hi: 'फुल-स्टैक इंजीनियरिंग',
      verified: true
    },
    {
      id: 'testimonial-3',
      author: 'Amit Verma',
      author_hi: 'अमित वर्मा',
      role: 'Operations Director',
      role_hi: 'परिचालन निदेशक (Operations Director)',
      company: 'Infocity Solutions',
      avatar: 'AV',
      quote: 'Atul streamlined our state-level MIS dashboards and reporting workflows for DAY-NULM and Smart Card programs. Clear communication, dependable milestones, and zero critical issues.',
      quote_hi: 'अतुल ने DAY-NULM और Smart Card कार्यक्रमों के लिए हमारे राज्य-स्तरीय MIS डैशबोर्ड्स और रिपोर्टिंग वर्कफ़्लो को सुव्यवस्थित किया। स्पष्ट संवाद, भरोसेमंद समय-सीमा और शून्य महत्वपूर्ण समस्याएं।',
      label: 'State MIS Operations & Biometric Governance',
      label_hi: 'राज्य MIS परिचालन एवं बायोमेट्रिक प्रशासन',
      sublabel: 'Infocity Solutions • MIS & Operations',
      sublabel_hi: 'इन्फोसिटी सॉल्यूशंस • MIS व ऑपरेशंस',
      description: 'Architected multi-district trainee database pipeline tracking thousands of candidate records with 99.8% reporting accuracy.',
      description_hi: '99.8% रिपोर्टिंग सटीकता के साथ हजारों उम्मीदवार रिकॉर्ड ट्रैक करने वाली बहु-जिला डेटाबेस पाइपलाइन तैयार की।',
      category: 'MIS & Analytics',
      rating: 5,
      tag: 'MIS & Operations',
      tag_hi: 'MIS एवं ऑपरेशंस',
      verified: true
    },
    {
      id: 'testimonial-4',
      author: 'Vikramaditya Mehta',
      author_hi: 'विक्रमादित्य मेहता',
      role: 'Senior Product Manager',
      role_hi: 'वरिष्ठ उत्पाद प्रबंधक (Sr. Product Manager)',
      company: 'VibeScale Labs',
      avatar: 'VM',
      quote: 'Atul has a rare hybrid skill set: deep accounting logic combined with autonomous agentic software development. He built rapid, bug-free prototypes that exceeded all benchmark expectations.',
      quote_hi: 'अतुल के पास एक दुर्लभ हाइब्रिड कौशल है: गहरा अकाउंटिंग लॉजिक और स्वायत्त एजेंटिक सॉफ्टवेयर विकास का बेहतरीन तालमेल। उन्होंने त्वरित, बग-मुक्त प्रोटोटाइप बनाए जो सभी बेंचमार्क अपेक्षाओं से आगे निकल गए।',
      label: 'Autonomous Coding & SaaS Synthesis',
      label_hi: 'स्वायत्त कोडिंग एवं SaaS संश्लेषण',
      sublabel: 'VibeScale Labs • Rapid Prototyping',
      sublabel_hi: 'वाइबस्केल लैब्स • रैपिड प्रोटोटाइपिंग',
      description: 'Rapid zero-to-one SaaS prototype deployment combining LLM tool harnesses, clean architecture, and modern TypeScript.',
      description_hi: 'LLM टूल हार्नेस, क्लीन आर्किटेक्चर और आधुनिक TypeScript को जोड़ते हुए त्वरित जीरो-टू-वन SaaS प्रोटोटाइप परिनियोजन।',
      category: 'Full-Stack & Vibe',
      rating: 5,
      tag: 'Rapid Prototyping',
      tag_hi: 'रैपिड प्रोटोटाइपिंग',
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
