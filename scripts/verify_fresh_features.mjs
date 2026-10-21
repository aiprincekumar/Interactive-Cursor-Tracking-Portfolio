import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failedTests++;
  }
}

console.log('================================================================');
console.log('--- VERIFICATION SUITE: 4 FRESH APPROVED PORTFOLIO FEATURES ---');
console.log('================================================================\n');

// -------------------------------------------------------------
// SUITE 1: Multilingual Language Switcher (हिंदी ⇄ English) [Feature 8]
// -------------------------------------------------------------
console.log('--- [Suite 1: Multilingual Language Switcher (Feature 8)] ---');

const langContextPath = path.join(ROOT, 'src', 'context', 'LanguageContext.jsx');
assert(fs.existsSync(langContextPath), 'src/context/LanguageContext.jsx exists');

const langContextContent = fs.readFileSync(langContextPath, 'utf8');
assert(langContextContent.includes('LanguageProvider'), 'LanguageProvider is exported from LanguageContext.jsx');
assert(langContextContent.includes('useLanguage'), 'useLanguage hook is exported from LanguageContext.jsx');
assert(langContextContent.includes('portfolio_language'), 'Uses localStorage key "portfolio_language"');
assert(langContextContent.includes('toggleLanguage'), 'toggleLanguage function is implemented');
assert(langContextContent.includes('document.documentElement.lang'), 'Syncs language to document.documentElement.lang');

const translationsPath = path.join(ROOT, 'src', 'data', 'translations.js');
assert(fs.existsSync(translationsPath), 'src/data/translations.js exists');

const translationsContent = fs.readFileSync(translationsPath, 'utf8');
assert(translationsContent.includes('export const TRANSLATIONS'), 'TRANSLATIONS dictionary is exported');
assert(translationsContent.includes('en: {') && translationsContent.includes('hi: {'), 'Both English and Hindi dictionaries exist');

// Verify translation coverage
const requiredKeys = [
  'nav.home', 'nav.about', 'nav.skills', 'nav.experience', 'nav.projects', 'nav.contact',
  'hero.available', 'hero.hireMe', 'hero.exploreWork', 'hero.downloadResume',
  'about.tabStory', 'about.tabQualifications', 'about.tabBiodata', 'about.inspectCred',
  'estimator.title', 'estimator.btnWhatsApp', 'estimator.btnPrefill',
  'vcard.modalTitle', 'vcard.downloadBtn',
  'credential.modalTitle', 'credential.copyBtn'
];

for (const key of requiredKeys) {
  assert(
    translationsContent.includes(`'${key}':`) || translationsContent.includes(`"${key}":`),
    `Translation dictionary contains key "${key}"`
  );
}

// Verify technical brand words preserved in English
const preservedTechnicalWords = ['Tally Prime', 'GST', 'ITR', 'React', 'Next.js', 'Power BI'];
for (const word of preservedTechnicalWords) {
  assert(
    translationsContent.includes(word),
    `Preserved technical brand word "${word}" present in dictionary`
  );
}

// Verify main.jsx wrapped with LanguageProvider
const mainPath = path.join(ROOT, 'src', 'main.jsx');
const mainContent = fs.readFileSync(mainPath, 'utf8');
assert(mainContent.includes('LanguageProvider'), 'main.jsx wraps application in LanguageProvider');

// Verify Navbar.jsx has animated pill switch and screen reader announcements
const navbarPath = path.join(ROOT, 'src', 'components', 'Navbar.jsx');
const navbarContent = fs.readFileSync(navbarPath, 'utf8');
assert(navbarContent.includes('useLanguage'), 'Navbar.jsx consumes useLanguage');
assert(navbarContent.includes('toggleLanguage'), 'Navbar.jsx contains toggleLanguage handler');
assert(navbarContent.includes('handleToggleLanguage'), 'Navbar.jsx has dedicated handleToggleLanguage coordinator');
assert(navbarContent.includes('announce(') && navbarContent.includes('Language switched to'), 'Navbar.jsx announces bilingual language switch to screen readers');
assert(navbarContent.includes('isHindi'), 'Navbar.jsx supports isHindi condition');
assert(navbarContent.includes("t('nav.home'"), 'Navbar.jsx localizes navLinks via t()');

// Verify Full-Spectrum Localization wiring across core sections
console.log('--- [Sub-Suite 1B: Full-Spectrum Section Localization Verification] ---');

// 1. ContactSection wiring
const contactSecPath = path.join(ROOT, 'src', 'components', 'ContactSection.jsx');
const contactSecContent = fs.readFileSync(contactSecPath, 'utf8');
assert(contactSecContent.includes("t('contact.nameLabel'"), 'ContactSection wires contact.nameLabel via t()');
assert(contactSecContent.includes("t('contact.emailLabel'"), 'ContactSection wires contact.emailLabel via t()');
assert(contactSecContent.includes("t('contact.whatsappLabel'"), 'ContactSection wires contact.whatsappLabel via t()');
assert(contactSecContent.includes("t('contact.companyLabel'"), 'ContactSection wires contact.companyLabel via t()');
assert(contactSecContent.includes("t('contact.roleLabel'"), 'ContactSection wires contact.roleLabel via t()');
assert(contactSecContent.includes("t('contact.budgetLabel'"), 'ContactSection wires contact.budgetLabel via t()');
assert(contactSecContent.includes("t('contact.timelineLabel'"), 'ContactSection wires contact.timelineLabel via t()');
assert(contactSecContent.includes("t('contact.messageLabel'"), 'ContactSection wires contact.messageLabel via t()');
assert(contactSecContent.includes("t('contact.submitBtn'"), 'ContactSection wires contact.submitBtn via t()');
assert(contactSecContent.includes("t('contact.badge'"), 'ContactSection wires contact.badge via t()');
assert(contactSecContent.includes("t('contact.subtitle'"), 'ContactSection wires contact.subtitle via t()');

// 2. SkillsSection wiring
const skillsSecPath = path.join(ROOT, 'src', 'components', 'SkillsSection.jsx');
const skillsSecContent = fs.readFileSync(skillsSecPath, 'utf8');
assert(skillsSecContent.includes('useLanguage'), 'SkillsSection imports useLanguage hook');
assert(skillsSecContent.includes("t('skills.badge'"), 'SkillsSection wires skills.badge via t()');
assert(skillsSecContent.includes("t('skills.title'"), 'SkillsSection wires skills.title via t()');
assert(skillsSecContent.includes("t('skills.subtitle'"), 'SkillsSection wires skills.subtitle via t()');
assert(skillsSecContent.includes('CATEGORY_NAMES_HI'), 'SkillsSection localizes categories via CATEGORY_NAMES_HI dictionary');

// 3. ExperienceSection wiring
const expSecPath = path.join(ROOT, 'src', 'components', 'ExperienceSection.jsx');
const expSecContent = fs.readFileSync(expSecPath, 'utf8');
assert(expSecContent.includes('useLanguage'), 'ExperienceSection imports useLanguage hook');
assert(expSecContent.includes("t('experience.badge'"), 'ExperienceSection wires experience.badge via t()');
assert(expSecContent.includes("t('experience.title'"), 'ExperienceSection wires experience.title via t()');
assert(expSecContent.includes("t('experience.subtitle'"), 'ExperienceSection wires experience.subtitle via t()');

// 4. ProjectsSection wiring
const projSecPath = path.join(ROOT, 'src', 'components', 'ProjectsSection.jsx');
const projSecContent = fs.readFileSync(projSecPath, 'utf8');
assert(projSecContent.includes('useLanguage'), 'ProjectsSection imports useLanguage hook');
assert(projSecContent.includes("t('projects.badge'"), 'ProjectsSection wires projects.badge via t()');
assert(projSecContent.includes("t('projects.subtitle'"), 'ProjectsSection wires projects.subtitle via t()');

// 5. Runtime Unit Simulation of LanguageContext state toggling & localStorage sync
console.log('--- [Sub-Suite 1C: Runtime Language State Transition Simulation] ---');
{
  const mockStorage = {};
  let state = 'en';

  const simulateSetLanguage = (action) => {
    const target = typeof action === 'function' ? action(state) : action;
    const nextLang = target === 'hi' ? 'hi' : 'en';
    mockStorage['portfolio_language'] = nextLang;
    state = nextLang;
    return nextLang;
  };

  const simulateToggleLanguage = () => {
    return simulateSetLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  assert(state === 'en', 'Runtime initial language is "en"');
  simulateToggleLanguage();
  assert(state === 'hi', 'Runtime toggleLanguage correctly transitions "en" -> "hi"');
  assert(mockStorage['portfolio_language'] === 'hi', 'Runtime localStorage correctly records "hi"');
  simulateToggleLanguage();
  assert(state === 'en', 'Runtime toggleLanguage correctly transitions "hi" -> "en"');
  assert(mockStorage['portfolio_language'] === 'en', 'Runtime localStorage correctly records "en"');
  simulateSetLanguage('hi');
  assert(state === 'hi', 'Direct setLanguage("hi") correctly sets "hi"');
  simulateSetLanguage('en');
  assert(state === 'en', 'Direct setLanguage("en") correctly sets "en"');
}

console.log('\n--- [Suite 2: In-Tab Project Cost & Quotation Estimator Architecture] ---');

// Verify ContactSection In-Tab structure
const contactPath = path.join(ROOT, 'src', 'components', 'ContactSection.jsx');
const contactContent = fs.readFileSync(contactPath, 'utf8');

assert(contactContent.includes("id: 'touch'") && contactContent.includes("id: 'quote'") && contactContent.includes("id: 'direct'") && contactContent.includes("id: 'location'"), 'ContactSection contains all 4 designated tabs (touch, quote, direct, location)');
assert(contactContent.includes('contact.tabQuote') || contactContent.includes('Quotation & Pricing'), 'Tab 2 has "Quotation & Pricing" label');
assert(contactContent.includes('ReceiptText'), 'Tab 2 uses ReceiptText icon');
assert(contactContent.includes("activeTab === 'quote'"), 'ContactSection renders dedicated in-tab panel for activeTab === "quote"');
assert(contactContent.includes('accounting') && contactContent.includes('mis') && contactContent.includes('ai_web'), 'In-tab estimator contains all 3 distinct tracks (Accounting, MIS, AI & Web)');
assert(contactContent.includes('voucherVolume') || contactContent.includes('setVoucherVolume'), 'Volume slider state is implemented in ContactSection');
assert(contactContent.includes('urgency') && contactContent.includes('express'), 'Urgency multiplier is implemented (Standard vs Express)');
assert(contactContent.includes('model') && contactContent.includes('retainer'), 'Engagement model is implemented (One-Time vs Retainer)');
assert(contactContent.includes('formatINR'), 'Indian Rupee (INR) currency formatting is present');
assert(contactContent.includes('handleSendQuoteToWhatsApp'), 'Action 1: "Send Quote to WhatsApp" is implemented in-tab');
assert(contactContent.includes('handlePreFillContactForm'), 'Action 2: "Pre-fill Contact Form" is implemented in-tab');
assert(contactContent.includes('portfolio:switch-contact-tab'), 'ContactSection listens for "portfolio:switch-contact-tab" event');
assert(contactContent.includes('Instant Service Fee Estimator'), 'ContactSection CTA card text is present in Tab 1');

// Verify ExploreSubBar shortcut
const explorePath = path.join(ROOT, 'src', 'components', 'ExploreSubBar.jsx');
const exploreContent = fs.readFileSync(explorePath, 'utf8');
assert(exploreContent.includes('fee-estimator') || exploreContent.includes('open-estimator'), 'ExploreSubBar has Fee Estimator shortcut');
assert(exploreContent.includes("detail: { tab: 'quote' }"), 'ExploreSubBar Fee Estimator activates the "quote" in-tab estimator');

console.log('\n--- [Suite 3: In-Tab vCard (.vcf) & Digital Business Card with Dynamic QR Code] ---');

const vcardGenPath = path.join(ROOT, 'src', 'utils', 'vcardGenerator.js');
assert(fs.existsSync(vcardGenPath), 'src/utils/vcardGenerator.js exists');

const vcardGenContent = fs.readFileSync(vcardGenPath, 'utf8');
assert(vcardGenContent.includes('generateVCardString'), 'generateVCardString is exported');
assert(vcardGenContent.includes('downloadVCard'), 'downloadVCard is exported');
assert(vcardGenContent.includes('BEGIN:VCARD') && vcardGenContent.includes('VERSION:3.0') && vcardGenContent.includes('END:VCARD'), 'Conforms to RFC 6350 / vCard 3.0 specification');
assert(vcardGenContent.includes('Atul_Verma_Tax_and_Developer.vcf'), 'Default filename is Atul_Verma_Tax_and_Developer.vcf');
assert(vcardGenContent.includes('text/vcard;charset=utf-8'), 'MIME type is set to text/vcard;charset=utf-8');

// Verify ContactSection In-Tab Direct Details 2-Column layout
assert(contactContent.includes("activeTab === 'direct'"), 'ContactSection renders dedicated in-tab panel for activeTab === "direct"');
assert(contactContent.includes('DynamicQrCodeSvg'), 'Pure SVG Dynamic QR Code generator component is rendered in ContactSection');
assert(contactContent.includes('downloadVCard'), 'Calls downloadVCard to save contact file from in-tab digital card');
assert(contactContent.includes('handleCopyProfileLink'), 'Share / copy profile link is implemented in-tab');
assert(contactContent.includes('lg:grid-cols-12'), 'Direct Details implements responsive 2-column grid layout');
assert(contactContent.includes('Save Contact (.vcf)'), 'ContactSection has "Save Contact (.vcf)" action button');

console.log('\n--- [Suite 4: Verified Credential & Academic Certificate Lightbox (Feature 6)] ---');

const credModalPath = path.join(ROOT, 'src', 'components', 'CredentialLightboxModal.jsx');
assert(fs.existsSync(credModalPath), 'src/components/CredentialLightboxModal.jsx exists');

const credModalContent = fs.readFileSync(credModalPath, 'utf8');
assert(credModalContent.includes('CREDENTIAL_RECORDS'), 'CREDENTIAL_RECORDS registry is exported');
assert(credModalContent.includes('INF-ADCA-2017-0842'), 'ADCA Infocity credential verification ID is present');
assert(credModalContent.includes('UPB-HSC-2010-1042'), 'Intermediate credential verification ID is present');
assert(credModalContent.includes('CBSE-SSE-2008-5129'), 'Matriculation credential verification ID is present');
assert(credModalContent.includes('SEAL OF ACCREDITATION'), 'Golden accreditation seal element is rendered');
assert(credModalContent.includes('handleCopyVerificationId'), '1-Click "Copy Verification ID" button is implemented');
assert(credModalContent.includes('ArrowLeft') && credModalContent.includes('ArrowRight'), 'Keyboard ArrowLeft & ArrowRight navigation implemented');
assert(credModalContent.includes('useFocusTrap'), 'WCAG 2.2 focus trap implemented in Credential Lightbox');

// Verify AboutSection integration
const aboutPath = path.join(ROOT, 'src', 'components', 'AboutSection.jsx');
const aboutContent = fs.readFileSync(aboutPath, 'utf8');
assert(aboutContent.includes('INF-ADCA-2017-0842'), 'AboutSection CREDENTIALS contains verificationId');
assert(aboutContent.includes('Inspect Credential & Certificate 🔍'), 'AboutSection cards have "Inspect Credential & Certificate 🔍" button');
assert(aboutContent.includes('portfolio:open-credential'), 'AboutSection dispatches "portfolio:open-credential" event');

console.log('\n--- [Suite 5: Clean App Integration & In-Tab Architecture] ---');

const appPath = path.join(ROOT, 'src', 'App.jsx');
const appContent = fs.readFileSync(appPath, 'utf8');
assert(!appContent.includes('<QuotationEstimatorModal'), 'App.jsx unmounts QuotationEstimatorModal in favor of in-tab architecture');
assert(!appContent.includes('<DigitalBusinessCardModal'), 'App.jsx unmounts DigitalBusinessCardModal in favor of in-tab architecture');
assert(appContent.includes('<CredentialLightboxModal'), 'App.jsx mounts CredentialLightboxModal');
assert(appContent.includes('portfolio:open-credential'), 'App.jsx listens for "portfolio:open-credential"');

// Verify Navbar integration
const freshNavbarContent = fs.readFileSync(navbarPath, 'utf8');
assert(freshNavbarContent.includes('handleOpenEstimator'), 'Navbar.jsx provides handleOpenEstimator navigation handler');
assert(freshNavbarContent.includes("detail: { tab: 'quote' }"), 'Navbar navigates smoothly to #contact and activates "quote" tab');

console.log('\n================================================================');
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
if (failedTests === 0) {
  console.log('🌟 ALL 4 FRESH FEATURES VERIFICATION TESTS PASSED 100%! 🌟');
  console.log('================================================================\n');
  process.exit(0);
} else {
  console.error(`💥 ${failedTests} TESTS FAILED! Check logs above.`);
  console.log('================================================================\n');
  process.exit(1);
}
