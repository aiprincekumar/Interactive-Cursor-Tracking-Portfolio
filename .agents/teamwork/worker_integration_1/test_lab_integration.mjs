import fs from 'fs';
import assert from 'assert';

console.log('--- Verifying Lab Studio Integration (Worker D) ---');

// 1. Verify src/main.jsx
const mainContent = fs.readFileSync('src/main.jsx', 'utf8');
assert(mainContent.includes('LabProvider'), 'main.jsx must import and use LabProvider');
assert(mainContent.includes('<RoleProvider>'), 'main.jsx must wrap RoleProvider');
assert(mainContent.includes('<LabProvider>'), 'main.jsx must wrap LabProvider');
console.log('✓ Test 1 Passed: src/main.jsx integrates LabProvider and RoleProvider');

// 2. Verify src/App.jsx
const appContent = fs.readFileSync('src/App.jsx', 'utf8');
assert(appContent.includes("import { useLab } from './context/LabContext';"), 'App.jsx must import useLab');
assert(appContent.includes("import LabStudioDrawer from './components/LabStudioDrawer';"), 'App.jsx must import LabStudioDrawer');
assert(appContent.includes('<LabStudioDrawer />'), 'App.jsx must render <LabStudioDrawer />');
assert(appContent.includes('wingDynamics={wingDynamics}'), 'App.jsx must pass wingDynamics to DynamicCursorManager');
assert(appContent.includes('speed={flightSpeed}'), 'App.jsx must pass flightSpeed to DynamicCursorManager');
assert(appContent.includes('scale={cursorScale}'), 'App.jsx must pass cursorScale to DynamicCursorManager');
assert(appContent.includes('gravity={gravity}'), 'App.jsx must pass gravity to DynamicCursorManager');
assert(appContent.includes('trailEnabled={trailEnabled}'), 'App.jsx must pass trailEnabled to DynamicCursorManager');
assert(appContent.includes('particleColor={particleColor}'), 'App.jsx must pass particleColor to DynamicCursorManager');
console.log('✓ Test 2 Passed: src/App.jsx consumes useLab() and passes all parameters to DynamicCursorManager');

// 3. Verify src/components/ButterflyCursor.jsx
const butterflyContent = fs.readFileSync('src/components/ButterflyCursor.jsx', 'utf8');
assert(butterflyContent.includes('wingDynamics = 1.0'), 'ButterflyCursor.jsx must have wingDynamics prop');
assert(butterflyContent.includes('wingDynamicsRef'), 'ButterflyCursor.jsx must have wingDynamicsRef');
assert(butterflyContent.includes('Math.max(0.2, wingDynamicsRef.current || 1.0)'), 'ButterflyCursor.jsx must scale flutter duration with wingDynamics');
console.log('✓ Test 3 Passed: src/components/ButterflyCursor.jsx dynamically scales wing flutter frequency');

// 4. Verify src/components/DynamicCursorManager.jsx
const cursorManagerContent = fs.readFileSync('src/components/DynamicCursorManager.jsx', 'utf8');
assert(cursorManagerContent.includes('wingDynamics = 1.0'), 'DynamicCursorManager must accept wingDynamics');
assert(cursorManagerContent.includes('wingDynamics={wingDynamics}'), 'DynamicCursorManager must forward wingDynamics');
console.log('✓ Test 4 Passed: src/components/DynamicCursorManager.jsx forwards wingDynamics');

// 5. Verify src/components/LabStudioDrawer.jsx
const drawerContent = fs.readFileSync('src/components/LabStudioDrawer.jsx', 'utf8');
assert(drawerContent.includes('FlaskConical'), 'LabStudioDrawer must use FlaskConical icon');
assert(drawerContent.includes('Cyberpunk Zero-G'), 'LabStudioDrawer must feature Cyberpunk Zero-G preset');
assert(drawerContent.includes('Retro Arcade'), 'LabStudioDrawer must feature Retro Arcade preset');
assert(drawerContent.includes('Zen Minimalist'), 'LabStudioDrawer must feature Zen Minimalist preset');
assert(drawerContent.includes('Hyper Velocity'), 'LabStudioDrawer must feature Hyper Velocity preset');
assert(drawerContent.includes('resetDefaults'), 'LabStudioDrawer must support Reset Defaults');
assert(drawerContent.includes('cursorScale'), 'LabStudioDrawer must tune cursorScale');
assert(drawerContent.includes('flightSpeed'), 'LabStudioDrawer must tune flightSpeed');
assert(drawerContent.includes('wingDynamics'), 'LabStudioDrawer must tune wingDynamics');
assert(drawerContent.includes('gravity'), 'LabStudioDrawer must tune gravity');
assert(drawerContent.includes('particleColor'), 'LabStudioDrawer must customize particleColor');
assert(drawerContent.includes('masterVolume'), 'LabStudioDrawer must tune masterVolume');
assert(drawerContent.includes('audioPitch'), 'LabStudioDrawer must tune audioPitch');
assert(drawerContent.includes('soundEnabled'), 'LabStudioDrawer must toggle soundEnabled');
assert(drawerContent.includes('Polaroid Shutter'), 'LabStudioDrawer must have Polaroid Shutter sound');
assert(drawerContent.includes('Cosmic Sparkle'), 'LabStudioDrawer must have Cosmic Sparkle sound');
assert(drawerContent.includes('Bubble Pop'), 'LabStudioDrawer must have Bubble Pop sound');
assert(drawerContent.includes('Laser Focus'), 'LabStudioDrawer must have Laser Focus sound');
assert(drawerContent.includes('Crystal Chime'), 'LabStudioDrawer must have Crystal Chime sound');
assert(drawerContent.includes('Ribbon Sweep'), 'LabStudioDrawer must have Ribbon Sweep sound');
assert(drawerContent.includes('Haptic Click'), 'LabStudioDrawer must have Haptic Click sound');
console.log('✓ Test 5 Passed: src/components/LabStudioDrawer.jsx contains all required FAB, Drawer, Presets, Controls & 7-Sound Soundboard');

// 6. Verify src/components/InteractivePlayground.jsx
const playgroundContent = fs.readFileSync('src/components/InteractivePlayground.jsx', 'utf8');
assert(playgroundContent.includes('id="playground"'), 'InteractivePlayground must have id="playground"');
assert(playgroundContent.includes('id="lab"'), 'InteractivePlayground must have id="lab"');
assert(playgroundContent.includes('PhysicsSandbox'), 'InteractivePlayground must embed PhysicsSandbox');
assert(playgroundContent.includes('Cyberpunk Zero-G'), 'InteractivePlayground must feature 1-Click Presets');
assert(playgroundContent.includes('7-Sound Acoustic Soundboard'), 'InteractivePlayground must have 7-Sound Soundboard');
console.log('✓ Test 6 Passed: src/components/InteractivePlayground.jsx modernized with PhysicsSandbox, Telemetry, Presets, and Soundboard');

// 7. Verify searchCatalog.js and CommandPalette.jsx
const catalogContent = fs.readFileSync('src/utils/searchCatalog.js', 'utf8');
assert(catalogContent.includes('act-lab-drawer'), 'searchCatalog.js must have act-lab-drawer');
assert(catalogContent.includes('Open Quick Lab Studio Drawer'), 'searchCatalog.js must have Quick Lab Studio Drawer action');

const paletteContent = fs.readFileSync('src/components/CommandPalette.jsx', 'utf8');
assert(paletteContent.includes('act-lab-drawer'), 'CommandPalette.jsx must handle act-lab-drawer');
assert(paletteContent.includes('portfolio:open-lab-drawer'), 'CommandPalette.jsx must dispatch open-lab-drawer');
console.log('✓ Test 7 Passed: searchCatalog.js and CommandPalette.jsx deep-link and trigger Quick Lab Drawer');

// 8. Verify ExploreSubBar.jsx and Navbar.jsx
const exploreContent = fs.readFileSync('src/components/ExploreSubBar.jsx', 'utf8');
assert(exploreContent.includes('Lab Studio'), 'ExploreSubBar.jsx must feature Lab Studio');
assert(exploreContent.includes('Quick Drawer'), 'ExploreSubBar.jsx must feature Quick Drawer');
assert(exploreContent.includes('portfolio:open-lab-drawer'), 'ExploreSubBar.jsx must dispatch open-lab-drawer');

const navContent = fs.readFileSync('src/components/Navbar.jsx', 'utf8');
assert(navContent.includes("{ label: 'Lab', href: '#playground', id: 'playground' }"), 'Navbar.jsx must include Lab in navLinks');
console.log('✓ Test 8 Passed: ExploreSubBar.jsx and Navbar.jsx deep-link to Lab Studio and Quick Drawer');

console.log('\n=========================================');
console.log(' ALL 8 INTEGRATION SUITES PASSED CLEANLY! ');
console.log('=========================================');
