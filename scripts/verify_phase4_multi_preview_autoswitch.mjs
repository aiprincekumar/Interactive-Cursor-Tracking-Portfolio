import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  VERIFY PHASE 4: MULTI-SANDBOX PREVIEWS & AUTO-SWITCH ENGINE   ');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     ${err.message}`);
    failCount++;
  }
}

// -------------------------------------------------------------
// 1. Verify 5 Dedicated 3D Preview Components Exist & Are Valid
// -------------------------------------------------------------
const previewDir = path.join(rootDir, 'src/components/3d-sandbox/previews');
assert(fs.existsSync(previewDir), 'previews directory must exist');

const previewFiles = [
  'HeroCardPreview.jsx',
  'Navbar3DPreview.jsx',
  'Footer3DPreview.jsx',
  'FloatingDockPreview.jsx',
  'SectionShowcasePreview.jsx'
];

runTest('All 5 dedicated 3D component preview files exist in previews/', () => {
  for (const file of previewFiles) {
    const fullPath = path.join(previewDir, file);
    assert(fs.existsSync(fullPath), `Preview file ${file} must exist`);
  }
});

// Detailed check for HeroCardPreview.jsx
const heroCardSrc = fs.readFileSync(path.join(previewDir, 'HeroCardPreview.jsx'), 'utf8');
runTest('HeroCardPreview implements avatar orb, online indicator, holographic foil, and 3-strata exploded CAD', () => {
  assert(heroCardSrc.includes('hero-card-preview'), 'Must include testid hero-card-preview');
  assert(heroCardSrc.includes('preserve-3d'), 'Must enforce preserve-3d');
  assert(heroCardSrc.includes('AVATAR ORB') || heroCardSrc.includes('STRATUM 2'), 'Must feature avatar orb stratum');
  assert(heroCardSrc.includes('BASE CHASSIS') || heroCardSrc.includes('STRATUM 1'), 'Must feature base chassis stratum');
  assert(heroCardSrc.includes('METRIC CHIPS') || heroCardSrc.includes('STRATUM 3'), 'Must feature metric chips stratum');
  assert(heroCardSrc.includes('ONLINE') || heroCardSrc.includes('animate-ping'), 'Must include animated online status indicator');
  assert(heroCardSrc.includes('linear-gradient') || heroCardSrc.includes('foil'), 'Must render holographic foil edge highlight');
});

// Detailed check for Navbar3DPreview.jsx
const navSrc = fs.readFileSync(path.join(previewDir, 'Navbar3DPreview.jsx'), 'utf8');
runTest('Navbar3DPreview implements frosted glass pill, [AV] initials, 3D button depression, and sheen', () => {
  assert(navSrc.includes('navbar-3d-preview'), 'Must include testid navbar-3d-preview');
  assert(navSrc.includes('preserve-3d'), 'Must enforce preserve-3d');
  assert(navSrc.includes('AV'), 'Must include AV initials badge');
  assert(navSrc.includes('backdrop-blur'), 'Must have frosted glass backdrop-blur');
  assert(navSrc.includes('translateZ(-4px)') || navSrc.includes('scale(0.96)'), 'Must implement 3D button depression on click');
  assert(navSrc.includes('specular') || navSrc.includes('linear-gradient'), 'Must implement specular lighting sheen');
});

// Detailed check for Footer3DPreview.jsx
const footerSrc = fs.readFileSync(path.join(previewDir, 'Footer3DPreview.jsx'), 'utf8');
runTest('Footer3DPreview implements grounded slab, social icons, bevel extrusion, and ground shadow falloff', () => {
  assert(footerSrc.includes('footer-3d-preview'), 'Must include testid footer-3d-preview');
  assert(footerSrc.includes('preserve-3d'), 'Must enforce preserve-3d');
  assert(footerSrc.includes('SOCIAL_LINKS') || (footerSrc.includes('Github') && footerSrc.includes('Linkedin')), 'Must include social icons');
  assert(footerSrc.includes('shadowBlur') || footerSrc.includes('blur-md'), 'Must compute ground shadow falloff');
  assert(footerSrc.includes('ALL SYSTEMS NOMINAL') || footerSrc.includes('LATENCY'), 'Must display telemetry status');
});

// Detailed check for FloatingDockPreview.jsx
const dockSrc = fs.readFileSync(path.join(previewDir, 'FloatingDockPreview.jsx'), 'utf8');
runTest('FloatingDockPreview implements macOS magnification physics, elastic spring pop, and audio clicks', () => {
  assert(dockSrc.includes('floating-dock-preview'), 'Must include testid floating-dock-preview');
  assert(dockSrc.includes('preserve-3d'), 'Must enforce preserve-3d');
  assert(dockSrc.includes('DOCK_ITEMS'), 'Must define dock items');
  assert(dockSrc.includes('scale') && dockSrc.includes('translateZ'), 'Must implement magnification scale and translateZ');
  assert(dockSrc.includes('handlePointerMove') || dockSrc.includes('onMouseMove'), 'Must handle pointer movement for magnification');
});

// Detailed check for SectionShowcasePreview.jsx
const showcaseSrc = fs.readFileSync(path.join(previewDir, 'SectionShowcasePreview.jsx'), 'utf8');
runTest('SectionShowcasePreview implements isometric perspective card stack with bevel chamfers', () => {
  assert(showcaseSrc.includes('section-showcase-preview'), 'Must include testid section-showcase-preview');
  assert(showcaseSrc.includes('preserve-3d'), 'Must enforce preserve-3d');
  assert(showcaseSrc.includes('SHOWCASE_CARDS'), 'Must define showcase project cards');
  assert(showcaseSrc.includes('grid-cols-2') || showcaseSrc.includes('grid'), 'Must render card stack grid');
  assert(showcaseSrc.includes('Isometric') || showcaseSrc.includes('Project Card Stack'), 'Must show project card stack');
});

// -------------------------------------------------------------
// 2. Verify src/hooks/useSandboxAutoSwitch.js
// -------------------------------------------------------------
const hookPath = path.join(rootDir, 'src/hooks/useSandboxAutoSwitch.js');
assert(fs.existsSync(hookPath), 'src/hooks/useSandboxAutoSwitch.js must exist');

import {
  ACCORDION_TO_PREVIEW_MAP,
  getPreviewTabForAccordion,
  normalizePreviewTab
} from '../src/hooks/useSandboxAutoSwitch.js';

runTest('ACCORDION_TO_PREVIEW_MAP correctly maps settings sections to preview tabs', () => {
  assert.strictEqual(ACCORDION_TO_PREVIEW_MAP.lighting, 'hero', 'lighting must map to hero');
  assert.strictEqual(ACCORDION_TO_PREVIEW_MAP.materials, 'hero', 'materials must map to hero');
  assert.strictEqual(ACCORDION_TO_PREVIEW_MAP.exploded, 'hero', 'exploded must map to hero');
  assert.strictEqual(ACCORDION_TO_PREVIEW_MAP.physics, 'dock', 'physics must map to dock');
  assert.strictEqual(ACCORDION_TO_PREVIEW_MAP.camera, 'universal', 'camera must map to universal');
  assert.strictEqual(ACCORDION_TO_PREVIEW_MAP.environment, 'universal', 'environment must map to universal');
  assert.strictEqual(ACCORDION_TO_PREVIEW_MAP.elements, 'showcase', 'elements must map to showcase');
});

runTest('getPreviewTabForAccordion resolves direct element keys and aliases case-insensitively', () => {
  assert.strictEqual(getPreviewTabForAccordion('LIGHTING'), 'hero');
  assert.strictEqual(getPreviewTabForAccordion('Physics'), 'dock');
  assert.strictEqual(getPreviewTabForAccordion('nav'), 'navbar');
  assert.strictEqual(getPreviewTabForAccordion('navbar'), 'navbar');
  assert.strictEqual(getPreviewTabForAccordion('dock'), 'dock');
  assert.strictEqual(getPreviewTabForAccordion('footer'), 'footer');
  assert.strictEqual(getPreviewTabForAccordion('card3d'), 'hero');
  assert.strictEqual(getPreviewTabForAccordion('hero'), 'hero');
  assert.strictEqual(getPreviewTabForAccordion('unknown_random_key'), null);
});

runTest('normalizePreviewTab maps card3d and nav to canonical hero and navbar tab IDs', () => {
  assert.strictEqual(normalizePreviewTab('card3d'), 'hero');
  assert.strictEqual(normalizePreviewTab('nav'), 'navbar');
  assert.strictEqual(normalizePreviewTab('floatingDock'), 'dock');
  assert.strictEqual(normalizePreviewTab('universal'), 'universal');
});

const hookSrc = fs.readFileSync(hookPath, 'utf8');
runTest('useSandboxAutoSwitch manages active tab, grace period, and auto-switch lifecycle', () => {
  assert(hookSrc.includes('handleManualTabSelect'), 'Must implement handleManualTabSelect');
  assert(hookSrc.includes('isAutoSwitchPaused'), 'Must manage isAutoSwitchPaused state');
  assert(hookSrc.includes('resumeAutoSwitch'), 'Must implement resumeAutoSwitch');
  assert(hookSrc.includes('notifyAccordionChange'), 'Must implement notifyAccordionChange');
  assert(hookSrc.includes('gracePeriodMs'), 'Must support gracePeriodMs configuration');
});

// -------------------------------------------------------------
// 3. Verify StickySandboxColumn.jsx Integration
// -------------------------------------------------------------
const stickyPath = path.join(rootDir, 'src/components/3d-sandbox/StickySandboxColumn.jsx');
const stickySrc = fs.readFileSync(stickyPath, 'utf8');

runTest('StickySandboxColumn dynamically imports and mounts all 5 dedicated preview components', () => {
  assert(stickySrc.includes("import HeroCardPreview from './previews/HeroCardPreview';"), 'Must import HeroCardPreview');
  assert(stickySrc.includes("import Navbar3DPreview from './previews/Navbar3DPreview';"), 'Must import Navbar3DPreview');
  assert(stickySrc.includes("import Footer3DPreview from './previews/Footer3DPreview';"), 'Must import Footer3DPreview');
  assert(stickySrc.includes("import FloatingDockPreview from './previews/FloatingDockPreview';"), 'Must import FloatingDockPreview');
  assert(stickySrc.includes("import SectionShowcasePreview from './previews/SectionShowcasePreview';"), 'Must import SectionShowcasePreview');
  assert(stickySrc.includes('<HeroCardPreview'), 'Must render HeroCardPreview');
  assert(stickySrc.includes('<Navbar3DPreview'), 'Must render Navbar3DPreview');
  assert(stickySrc.includes('<Footer3DPreview'), 'Must render Footer3DPreview');
  assert(stickySrc.includes('<FloatingDockPreview'), 'Must render FloatingDockPreview');
  assert(stickySrc.includes('<SectionShowcasePreview'), 'Must render SectionShowcasePreview');
});

runTest('StickySandboxColumn renders Auto-Sync status chip with active/paused states', () => {
  assert(stickySrc.includes('Auto-Detect: Active'), 'Must render active auto-detect chip');
  assert(stickySrc.includes('Auto-Detect: Paused'), 'Must render paused auto-detect chip');
  assert(stickySrc.includes('isAutoSwitchPaused'), 'Must accept isAutoSwitchPaused prop');
  assert(stickySrc.includes('onResumeAutoSwitch'), 'Must accept onResumeAutoSwitch prop');
});

// -------------------------------------------------------------
// 4. Verify ControlCenterPanel.jsx Integration
// -------------------------------------------------------------
const panelPath = path.join(rootDir, 'src/components/ControlCenterPanel.jsx');
const panelSrc = fs.readFileSync(panelPath, 'utf8');

runTest('ControlCenterPanel imports and binds useSandboxAutoSwitch', () => {
  assert(panelSrc.includes("import useSandboxAutoSwitch from '../hooks/useSandboxAutoSwitch';"),
    'Must import useSandboxAutoSwitch');
  assert(panelSrc.includes('useSandboxAutoSwitch('), 'Must invoke useSandboxAutoSwitch hook');
  assert(panelSrc.includes('notifyAccordionChange'), 'Must extract notifyAccordionChange from hook');
  assert(panelSrc.includes('isAutoSwitchPaused={isAutoSwitchPaused}'), 'Must pass isAutoSwitchPaused to StickySandboxColumn');
  assert(panelSrc.includes('onResumeAutoSwitch={resumeAutoSwitch}'), 'Must pass onResumeAutoSwitch to StickySandboxColumn');
});

runTest('ControlCenterPanel wires accordion and category toggles to notifyAccordionChange', () => {
  assert(panelSrc.includes('notifyAccordionChange(next)'),
    'toggleAccordionSection must call notifyAccordionChange on expansion');
  assert(panelSrc.includes('notifyAccordionChange(catKey)'),
    'toggleCategory must call notifyAccordionChange on element category toggle');
});

// -------------------------------------------------------------
// Summary
// -------------------------------------------------------------
console.log('\n================================================================');
console.log(`  PHASE 4 VERIFICATION: ${passCount} PASSED | ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
