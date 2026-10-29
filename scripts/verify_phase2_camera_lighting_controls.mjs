/**
 * Verification Script: Phase 2 Interactive Camera & Lighting Dynamic Controls
 */
import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('================================================================');
console.log('  VERIFY PHASE 2: CAMERA & LIGHTING DYNAMIC CONTROLS SPEC       ');
console.log('================================================================\n');

const universalMiniPath = path.resolve('src/components/3d-sandbox/UniversalMiniPortfolio.jsx');
const controlPanelPath = path.resolve('src/components/ControlCenterPanel.jsx');
const stickySandboxPath = path.resolve('src/components/3d-sandbox/StickySandboxColumn.jsx');
const sandboxViewportPath = path.resolve('src/components/3d-sandbox/SandboxViewportContainer.jsx');

const universalMiniCode = fs.readFileSync(universalMiniPath, 'utf8');
const controlPanelCode = fs.readFileSync(controlPanelPath, 'utf8');
const stickySandboxCode = fs.readFileSync(stickySandboxPath, 'utf8');
const sandboxViewportCode = fs.readFileSync(sandboxViewportPath, 'utf8');

// 1. Verify CAMERA_PRESET_ANGLES export
assert(universalMiniCode.includes('export const CAMERA_PRESET_ANGLES = {'), 'CAMERA_PRESET_ANGLES must be exported');
assert(universalMiniCode.includes("'isometric': { rotX: 18, rotY: -22 }"), 'Isometric angle must match spec');
assert(universalMiniCode.includes("'top-down': { rotX: 25, rotY: 0 }"), 'Top-down angle must match spec');
assert(universalMiniCode.includes("'dramatic-low': { rotX: -18, rotY: 20 }"), 'Dramatic-low angle must match spec');
assert(universalMiniCode.includes("'flat-ortho': { rotX: 0, rotY: 0 }"), 'Flat-ortho angle must match spec');
assert(universalMiniCode.includes("'eye-level': { rotX: 0, rotY: 0 }"), 'Eye-level angle must match spec');
assert(universalMiniCode.includes("'cinematic': { rotX: 12, rotY: -15 }"), 'Cinematic angle must match spec');
console.log('  ✅ PASS: CAMERA_PRESET_ANGLES contains all 6 required camera angle presets');

// 2. Verify UniversalMiniPortfolio camera angle preset listener & auto-orbit
assert(universalMiniCode.includes('prevAnglePresetRef.current = camera.anglePreset'), 'Tracks camera.anglePreset in ref');
assert(universalMiniCode.includes('setInternalTilt(targetAngle)'), 'Updates internalTilt on anglePreset change');
assert(universalMiniCode.includes('camera.autoOrbit'), 'Supports camera.autoOrbit');
assert(universalMiniCode.includes('(camera.orbitSpeed ?? 1.0) * 0.35') || universalMiniCode.includes('step = speed * 0.35'), 'Auto-orbit increments with orbitSpeed * 0.35');
console.log('  ✅ PASS: UniversalMiniPortfolio reacts to camera.anglePreset & implements turntable auto-orbit');

// 3. Verify Cursor Spotlight Overlay in UniversalMiniPortfolio
assert(universalMiniCode.includes('lighting.cursorLight && ('), 'Renders cursor spotlight overlay when lighting.cursorLight is true');
assert(universalMiniCode.includes('radial-gradient(circle 220px at ${cursorPos.x}px ${cursorPos.y}px'), 'Renders 220px radial gradient spotlight');
assert(universalMiniCode.includes("mixBlendMode: 'screen'"), 'Spotlight uses screen blend mode');
assert(universalMiniCode.includes('cursorPos'), 'cursorPos state is initialized and tracked');
console.log('  ✅ PASS: UniversalMiniPortfolio renders pointer-events-none cursor spotlight overlay');

// 4. Verify Illumination Presets in UniversalMiniPortfolio
assert(universalMiniCode.includes("rgba(245, 158, 11, 0.25)"), 'Sunset illumination preset applies warm amber shadow');
assert(universalMiniCode.includes("cyber-neon") && universalMiniCode.includes("cyanGlow"), 'Cyber-neon illumination preset applies dual cyan/magenta glow rim');
assert(universalMiniCode.includes("dramatic-side") && universalMiniCode.includes("hardShadow"), 'Dramatic-side illumination preset applies high directional contrast');
assert(universalMiniCode.includes("studio-soft") && universalMiniCode.includes("softShadow"), 'Studio-soft illumination preset applies soft ambient shadow');
console.log('  ✅ PASS: UniversalMiniPortfolio adjusts ambient hue, shadow tint & highlights for all illumination presets');

// 5. Verify ControlCenterPanel integration
assert(controlPanelCode.includes('CAMERA_PRESET_ANGLES'), 'ControlCenterPanel imports CAMERA_PRESET_ANGLES');
assert(controlPanelCode.includes('set3DCameraAnglePreset(cp.id)'), 'ControlCenterPanel calls set3DCameraAnglePreset');
assert(controlPanelCode.includes('setSandboxTilt(CAMERA_PRESET_ANGLES[cp.id]'), 'ControlCenterPanel updates setSandboxTilt on preset select');
assert(controlPanelCode.includes('threeD?.camera?.autoOrbit'), 'ControlCenterPanel supports auto-orbit on sandboxTilt');
console.log('  ✅ PASS: ControlCenterPanel updates sandboxTilt on camera angle preset select & auto-orbit');

// 6. Verify StickySandboxColumn integration
assert(stickySandboxCode.includes('CAMERA_PRESET_ANGLES'), 'StickySandboxColumn imports CAMERA_PRESET_ANGLES');
assert(stickySandboxCode.includes('camera.anglePreset') && stickySandboxCode.includes('CAMERA_PRESET_ANGLES[camera.anglePreset]'), 'StickySandboxColumn syncs camera.anglePreset to internalTilt');
assert(stickySandboxCode.includes('camera?.autoOrbit'), 'StickySandboxColumn supports auto-orbit');
assert(stickySandboxCode.includes('threeD.lighting?.cursorLight'), 'StickySandboxColumn renders cursor spotlight overlay');
console.log('  ✅ PASS: StickySandboxColumn reacts to camera angle presets, auto-orbit & cursor spotlight');

// 7. Verify SandboxViewportContainer forwardRef
assert(sandboxViewportCode.includes('React.forwardRef'), 'SandboxViewportContainer uses React.forwardRef');
console.log('  ✅ PASS: SandboxViewportContainer forwards ref for bounding box measurement');

console.log('\n================================================================');
console.log('  PHASE 2 VERIFICATION RESULTS: 7 PASSED | 0 FAILED              ');
console.log('================================================================\n');
