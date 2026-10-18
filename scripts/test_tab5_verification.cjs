const fs = require('fs');
const assert = require('assert');

console.log('--- Verifying Tab 5: Display & Visuals Implementation ---');

// 1. Verify LabContext.jsx
const labContextSrc = fs.readFileSync('src/context/LabContext.jsx', 'utf8');

assert(labContextSrc.includes("glassBlur: 'balanced'"), 'Default glassBlur should be balanced');
assert(labContextSrc.includes("motionSpeed: 1.0"), 'Default motionSpeed should be 1.0');
assert(labContextSrc.includes("accentColor: '#FF4D6D'"), 'Default accentColor should be #FF4D6D');

assert(labContextSrc.includes('setGlassBlur'), 'Must expose setGlassBlur');
assert(labContextSrc.includes('setMotionSpeed'), 'Must expose setMotionSpeed');
assert(labContextSrc.includes('setAccentColor'), 'Must expose setAccentColor');

assert(labContextSrc.includes("rootStyle.setProperty('--glass-blur'"), 'Must inject --glass-blur');
assert(labContextSrc.includes("rootStyle.setProperty('--motion-speed-mult'"), 'Must inject --motion-speed-mult');
assert(labContextSrc.includes("rootStyle.setProperty('--theme-accent'"), 'Must inject --theme-accent');
assert(labContextSrc.includes("rootStyle.setProperty('--theme-accent-rgb'"), 'Must inject --theme-accent-rgb');

assert(labContextSrc.includes('hexToRgb'), 'Must export hexToRgb');
assert(labContextSrc.includes('normalizeGlassBlur'), 'Must export normalizeGlassBlur');
assert(labContextSrc.includes('normalizeMotionSpeed'), 'Must export normalizeMotionSpeed');
assert(labContextSrc.includes('normalizeAccentColor'), 'Must export normalizeAccentColor');

console.log('✓ LabContext.jsx schema, setters, and CSS injection verified.');

// 2. Verify ControlCenterPanel.jsx
const controlCenterSrc = fs.readFileSync('src/components/ControlCenterPanel.jsx', 'utf8');

assert(controlCenterSrc.includes("id: 'visuals'"), 'Must have tab with id visuals');
assert(controlCenterSrc.includes("label: 'Display & Visuals'"), 'Must have label Display & Visuals');
assert(controlCenterSrc.includes('icon: Palette'), 'Must use Palette icon');
assert(controlCenterSrc.includes("useTheme()"), 'Must call useTheme');
assert(controlCenterSrc.includes("toggleTheme"), 'Must bind toggleTheme');

assert(controlCenterSrc.includes("activeTab === 'visuals'"), 'Must render visuals tabpanel');
assert(controlCenterSrc.includes('Obsidian Dark'), 'Must render Obsidian Dark');
assert(controlCenterSrc.includes('Linen Light'), 'Must render Linen Light');
assert(controlCenterSrc.includes('Subtle'), 'Must render Subtle blur');
assert(controlCenterSrc.includes('Balanced'), 'Must render Balanced blur');
assert(controlCenterSrc.includes('Deep Frosted'), 'Must render Deep Frosted blur');
assert(controlCenterSrc.includes('Snappy'), 'Must render Snappy motion');
assert(controlCenterSrc.includes('Natural'), 'Must render Natural motion');
assert(controlCenterSrc.includes('Cinematic'), 'Must render Cinematic motion');
assert(controlCenterSrc.includes('#FF4D6D'), 'Must include Electric Rose');
assert(controlCenterSrc.includes('#F59E0B'), 'Must include Amber Gold');
assert(controlCenterSrc.includes('#06B6D4'), 'Must include Neon Cyan');
assert(controlCenterSrc.includes('#10B981'), 'Must include Emerald Green');
assert(controlCenterSrc.includes('playLaserFocus'), 'Must playLaserFocus on accent change');

console.log('✓ ControlCenterPanel.jsx 5th tab and 4 control cards verified.');

// 3. Verify InteractivePlayground.jsx & LabStudioDrawer.jsx
const playgroundSrc = fs.readFileSync('src/components/InteractivePlayground.jsx', 'utf8');
const drawerSrc = fs.readFileSync('src/components/LabStudioDrawer.jsx', 'utf8');

assert(playgroundSrc.includes('ControlCenterPanel variant="workbench"'), 'Playground must mount workbench panel');
assert(drawerSrc.includes('ControlCenterPanel variant="drawer"'), 'Drawer must mount drawer panel');

console.log('✓ Both Workbench and Slide-Out Drawer surfaces verified.');
console.log('--- ALL VERIFICATIONS PASSED CLEANLY (100%) ---');
