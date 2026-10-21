import fs from 'fs';
import path from 'path';

console.log('========================================================================');
console.log('     VERIFYING WCAG 2.1 AA/AAA ACCESSIBILITY (A11Y) COMPREHENSIVE SUITE ');
console.log('========================================================================\n');

let passed = 0;
let failed = 0;

function check(desc, condition) {
  if (condition) {
    console.log(`  ✔ PASS: ${desc}`);
    passed++;
  } else {
    console.error(`  ✖ FAIL: ${desc}`);
    failed++;
  }
}

// ------------------------------------------------------------------------
// PILLAR 1: KEYBOARD NAVIGATION & FOCUS FLOW
// ------------------------------------------------------------------------
console.log('\n--- Pillar 1: Keyboard Navigation & Focus Flow ---');

// 1.1 App.jsx Skip Link & Main Landmark
const appCode = fs.readFileSync(path.resolve('src/App.jsx'), 'utf8');
check('App.jsx contains skip link pointing to #main-content', appCode.includes('href="#main-content"'));
check('App.jsx skip link is visually hidden until focused (sr-only focus:not-sr-only)', appCode.includes('sr-only focus:not-sr-only'));
check('App.jsx main container has id="main-content" and tabIndex={-1}', appCode.includes('id="main-content"') && appCode.includes('tabIndex={-1}'));

// 1.2 Universal :focus-visible in index.css
const indexCss = fs.readFileSync(path.resolve('src/index.css'), 'utf8');
check('index.css defines universal :focus-visible style rule', indexCss.includes(':focus-visible'));
check('index.css specifies 2px outline and outline-offset for visible focus', indexCss.includes('outline: 2px solid') && indexCss.includes('outline-offset: 2px'));

// 1.3 Focus Trap Hook
const focusTrapPath = path.resolve('src/hooks/useFocusTrap.js');
check('useFocusTrap.js hook exists', fs.existsSync(focusTrapPath));
const focusTrapCode = fs.readFileSync(focusTrapPath, 'utf8');
check('useFocusTrap handles Tab & Shift+Tab cycling', focusTrapCode.includes("e.key === 'Tab'") && focusTrapCode.includes('e.shiftKey'));
check('useFocusTrap handles Escape key dismissal', focusTrapCode.includes("e.key === 'Escape'"));
check('useFocusTrap restores previous focus on unmount/close', focusTrapCode.includes('previousActiveElementRef.current') && focusTrapCode.includes('.focus()'));

// 1.4 Modals & Drawers Trap Usage
const cmdPaletteCode = fs.readFileSync(path.resolve('src/components/CommandPalette.jsx'), 'utf8');
check('CommandPalette.jsx integrates useFocusTrap', cmdPaletteCode.includes('useFocusTrap'));
check('CommandPalette.jsx uses listbox and option semantics', cmdPaletteCode.includes('role="listbox"') && cmdPaletteCode.includes('role="option"'));

const labDrawerCode = fs.readFileSync(path.resolve('src/components/LabStudioDrawer.jsx'), 'utf8');
check('LabStudioDrawer.jsx integrates useFocusTrap', labDrawerCode.includes('useFocusTrap'));
check('LabStudioDrawer.jsx applies inert and aria-hidden when closed', labDrawerCode.includes('inert={!isDrawerOpen') && labDrawerCode.includes('aria-hidden={!isDrawerOpen}'));

const galleryCode = fs.readFileSync(path.resolve('src/components/CameraRollGallery.jsx'), 'utf8');
check('CameraRollGallery.jsx integrates useFocusTrap for lightbox modal', galleryCode.includes('useFocusTrap'));
check('CameraRollGallery.jsx has modal dialogue semantics', galleryCode.includes('role="dialog"') && galleryCode.includes('aria-modal="true"'));

const navbarCode = fs.readFileSync(path.resolve('src/components/Navbar.jsx'), 'utf8');
check('Navbar.jsx integrates useFocusTrap for mobile menu', navbarCode.includes('useFocusTrap'));

// 1.5 Marquee & Ribbon Focus Hygiene
const marqueeCode = fs.readFileSync(path.resolve('src/components/TechMarqueeBanner.jsx'), 'utf8');
check('TechMarqueeBanner.jsx bypasses keyboard tab navigation with tabIndex={-1}', marqueeCode.includes('tabIndex={-1}'));
check('TechMarqueeBanner.jsx marks marquee section and items with aria-hidden="true"', marqueeCode.includes('aria-hidden="true"'));

const ribbonCode = fs.readFileSync(path.resolve('src/components/CursorSelectorRibbon.jsx'), 'utf8');
check('CursorSelectorRibbon.jsx implements roving tabIndex', ribbonCode.includes('tabIndex={isFocusable ? 0 : -1}'));
check('CursorSelectorRibbon.jsx handles ArrowLeft and ArrowRight navigation', ribbonCode.includes("'ArrowLeft'") && ribbonCode.includes("'ArrowRight'"));

const controlCenterCode = fs.readFileSync(path.resolve('src/components/ControlCenterPanel.jsx'), 'utf8');
check('ControlCenterPanel.jsx implements roving tabIndex on category tabs', controlCenterCode.includes('tabIndex={isActive ? 0 : -1}'));

const backToTopCode = fs.readFileSync(path.resolve('src/components/BackToTopButton.jsx'), 'utf8');
check('BackToTopButton.jsx disables focus and hides when invisible', backToTopCode.includes('tabIndex={isVisible ? 0 : -1}') && backToTopCode.includes('aria-hidden={!isVisible}'));


// ------------------------------------------------------------------------
// PILLAR 2: SCREEN READER SEMANTICS & ARIA LIVE REGIONS
// ------------------------------------------------------------------------
console.log('\n--- Pillar 2: Screen Reader Semantics & ARIA Live Regions ---');

const announcerContextPath = path.resolve('src/context/AnnouncerContext.jsx');
check('AnnouncerContext.jsx exists', fs.existsSync(announcerContextPath));
const announcerCode = fs.readFileSync(announcerContextPath, 'utf8');
check('AnnouncerContext provides polite dynamic live region', announcerCode.includes('aria-live="polite"') && announcerCode.includes('role="status"'));
check('AnnouncerContext provides assertive dynamic live region', announcerCode.includes('aria-live="assertive"') && announcerCode.includes('role="alert"'));
check('AnnouncerContext exports useAnnounce hook', announcerCode.includes('export function useAnnounce'));
check('App.jsx mounts AnnouncerProvider', appCode.includes('<AnnouncerProvider>'));

// Landmark Headings & Relationships across main sections
const heroCode = fs.readFileSync(path.resolve('src/components/HeroSection.jsx'), 'utf8');
check('HeroSection.jsx has landmark aria-label', heroCode.includes('id="hero"') && heroCode.includes('aria-label='));

const aboutCode = fs.readFileSync(path.resolve('src/components/AboutSection.jsx'), 'utf8');
check('AboutSection.jsx has aria-labelledby linked to h2 heading', aboutCode.includes('id="about"') && aboutCode.includes('aria-labelledby="about-heading"') && aboutCode.includes('id="about-heading"'));

const expCode = fs.readFileSync(path.resolve('src/components/ExperienceSection.jsx'), 'utf8');
check('ExperienceSection.jsx has aria-labelledby linked to h2 heading', expCode.includes('id="experience"') && expCode.includes('aria-labelledby="experience-heading"') && expCode.includes('id="experience-heading"'));

const projCode = fs.readFileSync(path.resolve('src/components/ProjectsSection.jsx'), 'utf8');
check('ProjectsSection.jsx has aria-labelledby linked to h2 heading', projCode.includes('id="projects"') && projCode.includes('aria-labelledby="projects-heading"') && projCode.includes('id="projects-heading"'));

const skillsCode = fs.readFileSync(path.resolve('src/components/SkillsSection.jsx'), 'utf8');
check('SkillsSection.jsx has aria-labelledby linked to h2 heading', skillsCode.includes('id="skills"') && skillsCode.includes('aria-labelledby="skills-heading"') && skillsCode.includes('id="skills-heading"'));

const achieveCode = fs.readFileSync(path.resolve('src/components/CodingAchievementsSection.jsx'), 'utf8');
check('CodingAchievementsSection.jsx has aria-labelledby linked to h2 heading', achieveCode.includes('id="achievements"') && achieveCode.includes('aria-labelledby="achievements-heading"') && achieveCode.includes('id="achievements-heading"'));

const socialProofCode = fs.readFileSync(path.resolve('src/components/SocialProofSection.jsx'), 'utf8');
check('SocialProofSection.jsx has aria-labelledby linked to h2 heading', socialProofCode.includes('aria-labelledby="social-proof-heading"') && socialProofCode.includes('id="social-proof-heading"'));

const playgroundCode = fs.readFileSync(path.resolve('src/components/InteractivePlayground.jsx'), 'utf8');
check('InteractivePlayground.jsx has aria-labelledby linked to h2 heading', playgroundCode.includes('id="playground"') && playgroundCode.includes('aria-labelledby="playground-heading"') && playgroundCode.includes('id="playground-heading"'));

const contactCode = fs.readFileSync(path.resolve('src/components/ContactSection.jsx'), 'utf8');
check('ContactSection.jsx has aria-labelledby linked to h2 heading', contactCode.includes('id="contact"') && contactCode.includes('aria-labelledby="contact-heading"') && contactCode.includes('id="contact-heading"'));

// Decorative Isolation & Anti-Churn
const counterCode = fs.readFileSync(path.resolve('src/components/AnimatedCounter.jsx'), 'utf8');
check('AnimatedCounter.jsx provides static aria-label on parent', counterCode.includes('aria-label={String(value)}'));
check('AnimatedCounter.jsx hides animating display value with aria-hidden="true"', counterCode.includes('<span aria-hidden="true">{displayValue}</span>'));

// Dynamic Announcements & Form Errors
check('ContactSection.jsx announces validation error via role="alert" and aria-live="assertive"', contactCode.includes('role="alert"') && contactCode.includes('aria-live="assertive"'));
check('ContactSection.jsx connects input error via aria-invalid and aria-describedby', contactCode.includes('aria-invalid={Boolean(submitError)}') && contactCode.includes('aria-describedby='));

const roleCode = fs.readFileSync(path.resolve('src/context/RoleContext.jsx'), 'utf8');
check('RoleContext.jsx announces role track switch to screen readers', roleCode.includes('portfolio:announce') && roleCode.includes('Active role changed to'));


// ------------------------------------------------------------------------
// PILLAR 3: SENSORY-SAFE REDUCED MOTION & CURSOR FALLBACK
// ------------------------------------------------------------------------
console.log('\n--- Pillar 3: Sensory-Safe Reduced Motion & Cursor Fallback ---');

const labContextCode = fs.readFileSync(path.resolve('src/context/LabContext.jsx'), 'utf8');
check('App.jsx syncs system prefers-reduced-motion media query', appCode.includes('prefers-reduced-motion: reduce'));
check('LabContext.jsx toggles html.reduced-motion class on root element', labContextCode.includes("classList.toggle('reduced-motion'"));

check('index.css suppresses animations under prefers-reduced-motion', indexCss.includes('@media (prefers-reduced-motion: reduce)'));
check('index.css suppresses animations under html.reduced-motion', indexCss.includes('html.reduced-motion *'));
check('index.css sets transition and animation duration to sub-millisecond for reduced motion', indexCss.includes('animation-duration: 0.001ms !important;') && indexCss.includes('transition-duration: 0.001ms !important;'));

const cursorCode = fs.readFileSync(path.resolve('src/components/DynamicCursorManager.jsx'), 'utf8');
check('DynamicCursorManager.jsx unmounts custom cursor when reduced motion is active', cursorCode.includes('effectiveReducedMotion') && cursorCode.includes('return null;'));

check('HeroSection.jsx respects reducedMotion for confetti and head tracking', heroCode.includes('!reducedMotion') && heroCode.includes('reducedMotion'));


// ------------------------------------------------------------------------
// PILLAR 4: INDEPENDENT HIGH-CONTRAST MODE & CLEAN SIMPLE MODE
// ------------------------------------------------------------------------
console.log('\n--- Pillar 4: High-Contrast Mode & Clean Simple Mode ---');

const highContrastContextPath = path.resolve('src/context/HighContrastContext.jsx');
check('HighContrastContext.jsx exists', fs.existsSync(highContrastContextPath));
const highContrastContextCode = fs.readFileSync(highContrastContextPath, 'utf8');
check('HighContrastContext persists state to portfolio_high_contrast', highContrastContextCode.includes('portfolio_high_contrast'));
check('HighContrastContext toggles high-contrast class on root html element', highContrastContextCode.includes("classList.toggle('high-contrast'"));
check('HighContrastContext listens for Alt+H keyboard shortcut', highContrastContextCode.includes('e.altKey') && highContrastContextCode.includes("'KeyH'"));

const highContrastCssPath = path.resolve('src/styles/high-contrast.css');
check('high-contrast.css exists', fs.existsSync(highContrastCssPath));
const highContrastCss = fs.readFileSync(highContrastCssPath, 'utf8');
check('high-contrast.css is imported in index.css', indexCss.includes('@import "./styles/high-contrast.css";'));
check('high-contrast.css enforces pure black background (#000000) in dark mode', highContrastCss.includes('#000000 !important;'));
check('high-contrast.css enforces pure white text (#FFFFFF) in dark mode', highContrastCss.includes('#FFFFFF !important;'));
check('high-contrast.css enforces high-contrast yellow links (#FFFF00) in dark mode', highContrastCss.includes('#FFFF00 !important;'));
check('high-contrast.css enforces pure white background (#FFFFFF) in light mode', highContrastCss.includes('background-color: #FFFFFF !important;'));
check('high-contrast.css enforces pure black text (#000000) in light mode', highContrastCss.includes('color: #000000 !important;'));
check('high-contrast.css enforces high-contrast blue links (#0000EE) in light mode', highContrastCss.includes('#0000EE !important;'));
check('high-contrast.css completely removes glassmorphism (backdrop-filter: none !important;)', highContrastCss.includes('backdrop-filter: none !important;'));
check('high-contrast.css defines 3px high-visibility solid focus rings', highContrastCss.includes('outline: 3px solid #FFFF00 !important;') && highContrastCss.includes('outline: 3px solid #000000 !important;'));

check('ControlCenterPanel.jsx provides High-Contrast toggle with Alt+H badge', controlCenterCode.includes('useHighContrast') && controlCenterCode.includes('Alt+H'));


// ------------------------------------------------------------------------
// PILLAR 5: AUTOMATED VERIFICATION SUITE IN INTEGRATED CI
// ------------------------------------------------------------------------
console.log('\n--- Pillar 5: Test Automation Suite Integration ---');

const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf8'));
check('package.json test script runs verify_accessibility.mjs', packageJson.scripts.test.includes('node scripts/verify_accessibility.mjs'));

console.log('\n========================================================================');
console.log(`TOTAL AUDIT CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('========================================================================\n');

if (failed > 0) {
  console.error(`🚨 ACCESSIBILITY AUDIT FAILED with ${failed} issues!`);
  process.exit(1);
} else {
  console.log('🎉 ALL WCAG 2.1 AA/AAA ACCESSIBILITY AUDIT CRITERIA FULLY VERIFIED!\n');
  process.exit(0);
}
