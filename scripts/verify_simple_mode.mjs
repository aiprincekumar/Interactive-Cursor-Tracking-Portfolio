import fs from 'fs';
import path from 'path';

console.log('========================================================================');
console.log('             VERIFYING ONE-CLICK SIMPLE MODE PORTFOLIO FEATURE          ');
console.log('========================================================================\n');

let failed = 0;
let passed = 0;

function check(desc, condition) {
  if (condition) {
    console.log(`  ✔ PASS: ${desc}`);
    passed++;
  } else {
    console.error(`  ✖ FAIL: ${desc}`);
    failed++;
  }
}

// 1. Inspect SimpleModeContext.jsx
const simpleContextPath = path.resolve('src/context/SimpleModeContext.jsx');
const simpleContextCode = fs.readFileSync(simpleContextPath, 'utf8');

check('SimpleModeContext exists and is readable', fs.existsSync(simpleContextPath));
check('SimpleModeContext manages isSimpleMode state', simpleContextCode.includes('useState'));
check('SimpleModeContext persists to localStorage with key portfolio_simple_mode', simpleContextCode.includes('portfolio_simple_mode'));
check('SimpleModeContext toggles body class simple-mode on document.body', simpleContextCode.includes("classList.add('simple-mode')") && simpleContextCode.includes("classList.remove('simple-mode')"));
check('SimpleModeContext exports useSimpleMode hook', simpleContextCode.includes('export function useSimpleMode'));

// 2. Inspect App.jsx
const appPath = path.resolve('src/App.jsx');
const appCode = fs.readFileSync(appPath, 'utf8');

check('App.jsx imports useSimpleMode', appCode.includes("import { useSimpleMode } from './context/SimpleModeContext';"));
check('App.jsx retrieves isSimpleMode from hook', appCode.includes('const { isSimpleMode } = useSimpleMode();'));
check('App.jsx mutes/disables soundFX when isSimpleMode is true', appCode.includes('soundFX.setEnabled(false)'));
check('App.jsx hides DynamicCursorManager when isSimpleMode is true', appCode.includes('!isSimpleMode && !reducedMotion && (') && appCode.includes('<DynamicCursorManager'));
check('App.jsx hides LabStudioDrawer when isSimpleMode is true', appCode.includes('!isSimpleMode && <LabStudioDrawer />'));
check('App.jsx hides TechMarqueeBanner when isSimpleMode is true', appCode.includes('!isSimpleMode && <TechMarqueeBanner />'));
check('App.jsx hides CameraRollGallery when isSimpleMode is true', appCode.includes('!isSimpleMode && (') && appCode.includes('<CameraRollGallery'));
check('App.jsx hides InteractivePlayground when isSimpleMode is true', appCode.includes('!isSimpleMode && <InteractivePlayground />'));

// 3. Inspect HeroSection.jsx
const heroPath = path.resolve('src/components/HeroSection.jsx');
const heroCode = fs.readFileSync(heroPath, 'utf8');

check('HeroSection.jsx imports useSimpleMode', heroCode.includes("import { useSimpleMode } from '../context/SimpleModeContext';"));
check('HeroSection.jsx retrieves isSimpleMode', heroCode.includes('const { isSimpleMode } = useSimpleMode();'));
check('HeroSection.jsx disables Gyroscope when isSimpleMode is true', heroCode.includes('enabled: !reducedMotion && !isSimpleMode'));
check('HeroSection.jsx disables DraggableCharacter when isSimpleMode is true', heroCode.includes('enabled: dragEnabled && !isSimpleMode'));
check('HeroSection.jsx disables rAF tracking loop when isSimpleMode is true', heroCode.includes('if (isSimpleMode) {') && heroCode.includes("animStateRef.current.activePose = 'center';") && heroCode.includes('return () => {') && heroCode.includes('active = false;'));
check('HeroSection.jsx disables window pointer tracking when isSimpleMode is true', heroCode.includes('if (reducedMotion || isSimpleMode) return;'));
check('HeroSection.jsx disables wheel & pinch gestures when isSimpleMode is true', heroCode.includes('if (isSimpleMode) return;'));
check('HeroSection.jsx renders ONLY ONE single image (IMG_CENTER_FRONT) in Simple Mode', heroCode.includes('{isSimpleMode ? (') && heroCode.includes('src={IMG_CENTER_FRONT}'));
check('HeroSection.jsx hides shutter flash overlay in Simple Mode', heroCode.includes('{!isSimpleMode && (') && heroCode.includes('bg-white z-50'));
check('HeroSection.jsx hides HUD badge in Simple Mode', heroCode.includes('{!isSimpleMode && showHudBadge && ('));
check('HeroSection.jsx hides camera focus reticle in Simple Mode', heroCode.includes('{!isSimpleMode && (') && heroCode.includes('ref={reticleRef}'));
check('HeroSection.jsx hides row 2 bottom controls (zoom, gyro, shoot look, moments) in Simple Mode', heroCode.includes('{!isSimpleMode && (') && heroCode.includes('Row 2 on Mobile / Right Column on Desktop: Camera Controls'));
check('HeroSection.jsx preserves hero title, subtitle, and social links', heroCode.includes('activeTrack?.heroTitle') && heroCode.includes('TwitterIcon'));

// 4. Inspect Navbar.jsx
const navbarPath = path.resolve('src/components/Navbar.jsx');
const navbarCode = fs.readFileSync(navbarPath, 'utf8');

check('Navbar.jsx imports useSimpleMode', navbarCode.includes("import { useSimpleMode } from '../context/SimpleModeContext"));
check('Navbar.jsx hides Search button in Simple Mode', navbarCode.includes('{!isSimpleMode && (') && navbarCode.includes('Search portfolio (Cmd+K)'));
check('Navbar.jsx hides Explore button in Simple Mode', navbarCode.includes('{!isSimpleMode && (') && navbarCode.includes('Explore Showcase & Lab'));
check('Navbar.jsx hides Cursor ribbon button in Simple Mode', navbarCode.includes('{!isSimpleMode && isDesktopCursor && ('));
check('Navbar.jsx hides Audio toggle button in Simple Mode', navbarCode.includes('{!isSimpleMode && (') && navbarCode.includes('soundFX.setEnabled(next)'));
check('Navbar.jsx disables Cmd+K shortcut in Simple Mode', navbarCode.includes('if (isSimpleMode) return;') && navbarCode.includes("e.key.toLowerCase() === 'k'"));
check('Navbar.jsx auto-closes drawers and ribbons on Simple Mode activation', navbarCode.includes('if (isSimpleMode) {') && navbarCode.includes('setIsSearchOpen(false);'));
check('Navbar.jsx preserves logo/avatar, nav links, theme toggle, and resume dropdown', navbarCode.includes('toggleTheme') && navbarCode.includes('<ResumeDropdown') && navbarCode.includes('navLinks.map'));

// 5. Inspect ExploreSubBar.jsx
const explorePath = path.resolve('src/components/ExploreSubBar.jsx');
const exploreCode = fs.readFileSync(explorePath, 'utf8');

check('ExploreSubBar.jsx imports useSimpleMode', exploreCode.includes("import { useSimpleMode } from '../context/SimpleModeContext'"));
check('ExploreSubBar.jsx places Simple Mode toggle before Gallery without icon', exploreCode.includes("id: 'simple-mode-toggle'") && exploreCode.indexOf("id: 'simple-mode-toggle'") < exploreCode.indexOf("id: 'gallery'") && exploreCode.includes("item.id === 'simple-mode-toggle'"));

// 6. Inspect Floating Action Buttons (Centralized Master FloatingActionHub & Strict Right-Rail Alignment)
const hubPath = path.resolve('src/components/FloatingActionHub.jsx');
const hubExists = fs.existsSync(hubPath);
const hubCode = hubExists ? fs.readFileSync(hubPath, 'utf8') : '';

const floatingPath = path.resolve('src/components/FloatingSimpleModeToggle.jsx');
const floatingExists = fs.existsSync(floatingPath);
const floatingCode = floatingExists ? fs.readFileSync(floatingPath, 'utf8') : '';

const backToTopPath = path.resolve('src/components/BackToTopButton.jsx');
const backToTopExists = fs.existsSync(backToTopPath);
const backToTopCode = backToTopExists ? fs.readFileSync(backToTopPath, 'utf8') : '';

check('FloatingActionHub unifies Simple Mode toggle and imports useSimpleMode', (hubExists && hubCode.includes('useSimpleMode')) || (floatingExists && floatingCode.includes('useSimpleMode')));
check('App.jsx mounts FloatingActionHub', appCode.includes('<FloatingActionHub') && appCode.includes('FloatingActionHub from'));
check('FloatingActionHub enforces strict vertical right rail (bottom-6 right-6 sm:bottom-8 sm:right-8)', hubCode.includes('bottom-6 right-6 sm:bottom-8 sm:right-8'));
check('FloatingActionHub houses Simple Mode toggle with smooth speed-dial actions', hubExists && hubCode.includes('simple-mode-toggle') && hubCode.includes('toggleSimpleMode'));
check('BackToTopButton enforces strict vertical right rail (right-6 sm:right-8)', backToTopExists && backToTopCode.includes('fixed right-6 sm:right-8'));
check('BackToTopButton dynamically stacks above FloatingActionHub (bottom-22 collapsed, bottom-56/72 expanded)', backToTopCode.includes("'bottom-22 sm:bottom-25'") && backToTopCode.includes('isHubOpen'));
check('Master FloatingActionHub FAB sits at bottom-6 right-6 sm:bottom-8 sm:right-8', hubExists && hubCode.includes('bottom-6 right-6 sm:bottom-8 sm:right-8'));

// 7. Inspect ResumeDropdown.jsx
const resumePath = path.resolve('src/components/ResumeDropdown.jsx');
const resumeCode = fs.readFileSync(resumePath, 'utf8');

check('ResumeDropdown.jsx accesses isSimpleMode and toggleSimpleMode', resumeCode.includes('isSimpleMode') && resumeCode.includes('toggleSimpleMode'));
check('ResumeDropdown.jsx contains Basic Overview item toggling simple mode', resumeCode.includes('toggleSimpleMode()') && resumeCode.includes('Basic Overview'));

// 8. Inspect simple-mode.css
const cssPath = path.resolve('src/styles/simple-mode.css');
const cssCode = fs.readFileSync(cssPath, 'utf8');

check('simple-mode.css enforces standard system cursor on body and all elements', cssCode.includes('body.simple-mode') && cssCode.includes('cursor: auto !important'));
check('simple-mode.css sets pointer cursor on interactive elements', cssCode.includes('cursor: pointer !important'));
check('simple-mode.css defines clean compact hero layout', cssCode.includes('body.simple-mode #hero'));

console.log('\n========================================================================');
console.log(`TOTAL AUDIT CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('========================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('\n🎉 ALL SIMPLE MODE AUDIT CRITERIA FULLY VERIFIED!\n');
}
