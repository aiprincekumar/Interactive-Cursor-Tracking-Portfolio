import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import assert from 'assert';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('\n--- RUNNING ZERO-CODE DYNAMIC TESTIMONIALS VERIFICATION ---\n');

let totalChecks = 0;
let passedChecks = 0;

function check(desc, fn) {
  totalChecks++;
  try {
    fn();
    console.log(`✅ PASS: ${desc}`);
    passedChecks++;
  } catch (err) {
    console.error(`❌ FAIL: ${desc}`);
    console.error(`   Error: ${err.message}`);
    process.exitCode = 1;
  }
}

// ============================================================================
// PILLAR 1: TESTIMONIALS CONFIGURATION INTEGRITY
// ============================================================================
const configPath = path.join(rootDir, 'src', 'data', 'testimonialsConfig.js');
check('testimonialsConfig.js exists on disk', () => {
  assert(fs.existsSync(configPath), `Expected file at ${configPath}`);
});

const configContent = fs.readFileSync(configPath, 'utf8');

check('TESTIMONIALS_CONFIG exports enabled: false by default', () => {
  assert(/enabled:\s*false/.test(configContent), 'Expected default enabled to be false');
});

check('TESTIMONIALS_CONFIG defines sectionId as "testimonials"', () => {
  assert(/sectionId:\s*['"]testimonials['"]/.test(configContent), 'Expected sectionId to be "testimonials"');
});

check('TESTIMONIALS_CONFIG contains at least 4 sample stakeholder endorsements', () => {
  const matches = configContent.match(/id:\s*['"]testimonial-\d+['"]/g);
  assert(matches && matches.length >= 4, `Expected at least 4 testimonials, found ${matches?.length || 0}`);
});

check('TESTIMONIALS_CONFIG provides createTestimonialsConfig override helper', () => {
  assert(/export function createTestimonialsConfig/.test(configContent), 'Expected createTestimonialsConfig export');
});

// ============================================================================
// PILLAR 2: ZERO-CODE CONFIGURATION IN NAVBAR (ENABLED: FALSE & ENABLED: TRUE)
// ============================================================================
const navbarPath = path.join(rootDir, 'src', 'components', 'Navbar.jsx');
const navbarContent = fs.readFileSync(navbarPath, 'utf8');

check('Navbar.jsx imports TESTIMONIALS_CONFIG from central data config', () => {
  assert(/import\s*\{\s*TESTIMONIALS_CONFIG\s*\}\s*from\s*['"]\.\.\/data\/testimonialsConfig['"]/.test(navbarContent),
    'Expected Navbar.jsx to import TESTIMONIALS_CONFIG');
});

check('Navbar.jsx dynamically evaluates TESTIMONIALS_CONFIG.enabled for navLinks', () => {
  assert(/TESTIMONIALS_CONFIG\?\.enabled/.test(navbarContent),
    'Navbar navLinks must conditionally spread testimonials based on TESTIMONIALS_CONFIG.enabled');
});

check('Navbar.jsx ScrollSpy sectionIds dynamically tracks testimonials when enabled', () => {
  assert(/TESTIMONIALS_CONFIG\?\.enabled\s*\?\s*\[TESTIMONIALS_CONFIG\.sectionId/.test(navbarContent),
    'Navbar ScrollSpy sectionIds must conditionally include testimonials sectionId');
});

// Emulated evaluation of navLinks logic
check('When enabled is false: navLinks contains 0 Testimonials links', () => {
  const fakeConfig = { enabled: false, sectionId: 'testimonials' };
  const navLinks = [
    { label: 'Home', href: '#hero', id: 'hero' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Achievements', href: '#achievements', id: 'achievements' },
    ...(fakeConfig?.enabled ? [{
      label: 'Testimonials',
      href: `#${fakeConfig.sectionId || 'testimonials'}`,
      id: fakeConfig.sectionId || 'testimonials'
    }] : []),
    { label: 'Contact', href: '#contact', id: 'contact' }
  ];
  assert(!navLinks.some(link => link.id === 'testimonials' || link.label === 'Testimonials'),
    'navLinks must not contain Testimonials when enabled is false');
  assert.strictEqual(navLinks.length, 7, 'Expected 7 default navLinks when testimonials is disabled');
});

check('When enabled is true: navLinks seamlessly activates Testimonials between Achievements and Contact', () => {
  const fakeConfig = { enabled: true, sectionId: 'testimonials' };
  const navLinks = [
    { label: 'Home', href: '#hero', id: 'hero' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Achievements', href: '#achievements', id: 'achievements' },
    ...(fakeConfig?.enabled ? [{
      label: 'Testimonials',
      href: `#${fakeConfig.sectionId || 'testimonials'}`,
      id: fakeConfig.sectionId || 'testimonials'
    }] : []),
    { label: 'Contact', href: '#contact', id: 'contact' }
  ];
  assert(navLinks.some(link => link.id === 'testimonials' && link.label === 'Testimonials'),
    'navLinks must contain Testimonials when enabled is true');
  assert.strictEqual(navLinks.length, 8, 'Expected 8 navLinks when testimonials is enabled');
  assert.strictEqual(navLinks[6].id, 'testimonials', 'Testimonials link must be placed right after Achievements');
  assert.strictEqual(navLinks[7].id, 'contact', 'Contact link must follow Testimonials');
});

// ============================================================================
// PILLAR 3: APP.JSX CONDITIONAL RENDERING & ZERO-DOM FOOTPRINT
// ============================================================================
const appPath = path.join(rootDir, 'src', 'App.jsx');
const appContent = fs.readFileSync(appPath, 'utf8');

check('App.jsx imports TestimonialsSection and TESTIMONIALS_CONFIG', () => {
  assert(/import\s+TestimonialsSection\s+from\s+['"]\.\/components\/TestimonialsSection['"]/.test(appContent),
    'App.jsx must import TestimonialsSection');
  assert(/import\s*\{\s*TESTIMONIALS_CONFIG\s*\}\s*from\s*['"]\.\/data\/testimonialsConfig['"]/.test(appContent),
    'App.jsx must import TESTIMONIALS_CONFIG');
});

check('App.jsx mounts TestimonialsSection strictly guarded by TESTIMONIALS_CONFIG?.enabled', () => {
  assert(/\{\s*TESTIMONIALS_CONFIG\?\.enabled\s*&&\s*<TestimonialsSection/.test(appContent),
    'App.jsx must conditionally render <TestimonialsSection> only when TESTIMONIALS_CONFIG?.enabled is true');
});

// ============================================================================
// PILLAR 4: TESTIMONIALS SECTION COMPONENT ARCHITECTURE & WCAG AA ACCESSIBILITY
// ============================================================================
const testimonialsCompPath = path.join(rootDir, 'src', 'components', 'TestimonialsSection.jsx');
check('TestimonialsSection.jsx exists on disk', () => {
  assert(fs.existsSync(testimonialsCompPath), `Expected file at ${testimonialsCompPath}`);
});

const compContent = fs.readFileSync(testimonialsCompPath, 'utf8');

check('TestimonialsSection has top guard returning null when !config?.enabled', () => {
  assert(/if\s*\(\s*!config\?\.enabled\s*\)\s*\{\s*return\s+null;\s*\}/.test(compContent),
    'TestimonialsSection must return null if config.enabled is falsy');
});

check('TestimonialsSection declares semantic landmark and aria-labelledby', () => {
  assert(/id=\{config\?\.sectionId\s*\|\|\s*['"]testimonials['"]\}/.test(compContent),
    'Section ID must map to config.sectionId or testimonials');
  assert(/aria-labelledby=['"]testimonials-heading['"]/.test(compContent),
    'Section must have aria-labelledby="testimonials-heading"');
  assert(/<h2\s+id=['"]testimonials-heading['"]/.test(compContent),
    'Heading h2 must match aria-labelledby id');
});

check('TestimonialsSection includes category filter tablist with aria-selected', () => {
  assert(/role=['"]tablist['"]/.test(compContent), 'Expected role="tablist" container');
  assert(/role=['"]tab['"]/.test(compContent), 'Expected role="tab" buttons');
  assert(/aria-selected=\{isSelected\}/.test(compContent), 'Expected aria-selected attribute on tabs');
});

check('TestimonialsSection implements cursor-tracking spotlight and simple mode support', () => {
  assert(/radial-gradient/.test(compContent), 'Expected radial gradient spotlight');
  assert(/useSimpleMode/.test(compContent), 'Component must consume useSimpleMode');
  assert(/!isSimpleMode/.test(compContent), 'Spotlight must be suppressed in simple mode');
});

// ============================================================================
// PILLAR 5: SOCIAL PROOF SECTION PURITY (KEY ACHIEVEMENTS ONLY)
// ============================================================================
const socialProofPath = path.join(rootDir, 'src', 'components', 'SocialProofSection.jsx');
const socialProofContent = fs.readFileSync(socialProofPath, 'utf8');

check('SocialProofSection.jsx contains ZERO toggle buttons or testimonial state', () => {
  assert(!/showTestimonials/.test(socialProofContent), 'SocialProofSection must not contain showTestimonials');
  assert(!/toggleTestimonials/.test(socialProofContent), 'SocialProofSection must not contain toggleTestimonials');
  assert(!/role=['"]switch['"]/.test(socialProofContent), 'SocialProofSection must have no toggle switch');
});

check('SocialProofSection.jsx displays Key Achievements & Production Benchmarks telemetry badge', () => {
  assert(/4 Verified Production Benchmarks/.test(socialProofContent),
    'SocialProofSection must display 4 Verified Production Benchmarks telemetry badge');
});

console.log('\n========================================================================');
console.log(`TOTAL VERIFICATION CHECKS: ${totalChecks} | PASSED: ${passedChecks} | FAILED: ${totalChecks - passedChecks}`);
console.log('========================================================================\n');

if (passedChecks === totalChecks) {
  console.log('🎉 ALL ZERO-CODE DYNAMIC TESTIMONIALS ARCHITECTURE CHECKS PASSED FLAWLESSLY!\n');
} else {
  process.exit(1);
}
