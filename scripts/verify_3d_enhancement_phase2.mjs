import fs from 'fs';
import path from 'path';
import {
  calibrateDepthByDeviceProfile,
  export3DPresetPackage,
  generate3DSceneShareLink,
  parse3DSceneShareLink
} from '../src/utils/mediaExport.js';

console.log('========================================================================');
console.log('  VERIFY 3D ENHANCEMENT PHASE 2: NEW RULES, FUNCTIONS & FEATURES AUDIT  ');
console.log('========================================================================\n');

let passedChecks = 0;
let totalChecks = 0;

function check(desc, condition) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`✅ PASS: ${desc}`);
  } else {
    console.error(`❌ FAIL: ${desc}`);
  }
}

// 1. Check calibrateDepthByDeviceProfile()
console.log('\n--- 1. Testing calibrateDepthByDeviceProfile() ---');
const defaultProfile = calibrateDepthByDeviceProfile();

check(
  'calibrateDepthByDeviceProfile() returns numeric depthIntensity > 0',
  typeof defaultProfile.depthIntensity === 'number' && defaultProfile.depthIntensity > 0
);

check(
  'calibrateDepthByDeviceProfile() returns numeric tiltSensitivity > 0',
  typeof defaultProfile.tiltSensitivity === 'number' && defaultProfile.tiltSensitivity > 0
);

check(
  'calibrateDepthByDeviceProfile() returns boolean isMobile and numeric dpr',
  typeof defaultProfile.isMobile === 'boolean' && typeof defaultProfile.dpr === 'number'
);

// 2. Check export3DPresetPackage()
console.log('\n--- 2. Testing export3DPresetPackage() ---');
const sample3DState = {
  master3D: true,
  masterTheme: 'cyber-neon',
  depthIntensity: 1.25,
  stylePreset: 'isometric',
  lighting: { angle: 135, preset: 'cyber-neon', cursorLight: true, shadowSoftness: 0.6 },
  camera: { anglePreset: 'cinematic', perspectiveFOV: 1100, tiltSensitivity: 20 },
  materials: { preset: 'glass-acrylic', roughness: 0.15, metalness: 0.8 },
  physics: { hoverPop: 16, clickDepression: true, elasticity: 'snappy' },
  exploded: { enabled: true, separationDistance: 50, blueprintMode: true, soloStrata: 'chassis' },
  customMesh: {
    type: 'custom',
    customName: 'CyberOrb',
    scale: 1.5,
    fileUrl: 'blob:http://localhost:5173/f81d4fae-7dec-11d0-a765-00a0c91e6bf6'
  }
};

const packageJsonStr = export3DPresetPackage(sample3DState);
let parsedPackage = null;
try {
  parsedPackage = JSON.parse(packageJsonStr);
} catch {
  parsedPackage = null;
}

check('export3DPresetPackage() outputs valid serialized JSON', parsedPackage !== null);
check('export3DPresetPackage() manifestVersion equals "1.0.0"', parsedPackage?.manifestVersion === '1.0.0');
check('export3DPresetPackage() includes generator identifier', parsedPackage?.generator === 'Antigravity 3D Spatial Engine');
check('export3DPresetPackage() includes author attribution (Atul Verma / aiprincekumar)', parsedPackage?.author?.includes('Atul Verma'));
check(
  'export3DPresetPackage() sanitizes and strips temporary blob URLs from customMesh',
  parsedPackage?.config?.customMesh?.fileUrl === undefined
);

// 3. Check generate3DSceneShareLink() & 4. Check parse3DSceneShareLink()
console.log('\n--- 3 & 4. Testing generate3DSceneShareLink() & parse3DSceneShareLink() ---');
const baseUrl = 'https://aiprincekumar.github.io/portfolio/';
const shareLink = generate3DSceneShareLink(sample3DState, baseUrl);

check(
  'generate3DSceneShareLink() produces a valid URL containing threed_config search parameter',
  typeof shareLink === 'string' && shareLink.includes('threed_config=')
);

const parsedShareConfig = parse3DSceneShareLink(shareLink);
check('parse3DSceneShareLink() decodes URL string back to object', parsedShareConfig !== null && typeof parsedShareConfig === 'object');
check('parse3DSceneShareLink() restored master3D accurately', parsedShareConfig?.master3D === true);
check('parse3DSceneShareLink() restored masterTheme accurately', parsedShareConfig?.masterTheme === 'cyber-neon');
check('parse3DSceneShareLink() restored depthIntensity accurately', parsedShareConfig?.depthIntensity === 1.25);
check('parse3DSceneShareLink() restored lighting angle and preset', parsedShareConfig?.lighting?.angle === 135 && parsedShareConfig?.lighting?.preset === 'cyber-neon');
check('parse3DSceneShareLink() restored camera angle and FOV', parsedShareConfig?.camera?.anglePreset === 'cinematic' && parsedShareConfig?.camera?.perspectiveFOV === 1100);
check('parse3DSceneShareLink() restored materials roughness and metalness', parsedShareConfig?.materials?.roughness === 0.15 && parsedShareConfig?.materials?.metalness === 0.8);
check('parse3DSceneShareLink() restored exploded configuration', parsedShareConfig?.exploded?.separationDistance === 50 && parsedShareConfig?.exploded?.blueprintMode === true);

// Graceful fallback on corrupt parameter
const corruptResult = parse3DSceneShareLink('https://example.com/?threed_config=%%%corrupt_base64%%%');
check('parse3DSceneShareLink() gracefully handles corrupt parameter without crashing', corruptResult === null);

// 5. Check toggle3DExplodedStrataSolo() and LabContext integration
console.log('\n--- 5. Testing toggle3DExplodedStrataSolo() in LabContext.jsx ---');
const labContextSource = fs.readFileSync('src/context/LabContext.jsx', 'utf8');

check(
  'LabContext defines toggle3DExplodedStrataSolo function',
  labContextSource.includes('toggle3DExplodedStrataSolo')
);

check(
  'LabContext exposes toggle3DExplodedStrataSolo in context value',
  labContextSource.includes('toggle3DExplodedStrataSolo,')
);

check(
  'LabContext exposes calibrateDepthByDeviceProfile in context value',
  labContextSource.includes('calibrateDepthByDeviceProfile,')
);

check(
  'LabContext re-exports export3DPresetPackage, generate3DSceneShareLink, parse3DSceneShareLink',
  labContextSource.includes('export3DPresetPackage') &&
  labContextSource.includes('generate3DSceneShareLink') &&
  labContextSource.includes('parse3DSceneShareLink')
);

check(
  'LabContext checks URL search for threed_config on mount and auto-detects',
  labContextSource.includes("window.location.search.includes('threed_config')")
);

// 6. Check ControlCenterPanel.jsx triggers & integration
console.log('\n--- 6. Testing ControlCenterPanel.jsx integration ---');
const controlCenterSource = fs.readFileSync('src/components/ControlCenterPanel.jsx', 'utf8');

check(
  'ControlCenterPanel destructures Phase 2 helpers from lab context',
  controlCenterSource.includes('calibrateDepthByDeviceProfile') &&
  controlCenterSource.includes('export3DPresetPackage') &&
  controlCenterSource.includes('generate3DSceneShareLink')
);

check(
  'ControlCenterPanel implements handleShare3DSceneLink with clipboard copy',
  controlCenterSource.includes('handleShare3DSceneLink') &&
  controlCenterSource.includes('Share 3D Scene Link')
);

check(
  'ControlCenterPanel implements handleAutoCalibrateDevice with calibrateDepthByDeviceProfile',
  controlCenterSource.includes('handleAutoCalibrateDevice') &&
  controlCenterSource.includes('Auto-Calibrate for Device')
);

check(
  'ControlCenterPanel wires export3DPresetPackage into JSON export action',
  controlCenterSource.includes('export3DPresetPackage(threeDConfig)')
);

console.log('\n========================================================================');
console.log(`  PHASE 2 VERIFICATION SUMMARY: ${passedChecks}/${totalChecks} CHECKS PASSED`);
console.log('========================================================================\n');

if (passedChecks === totalChecks) {
  process.exit(0);
} else {
  process.exit(1);
}
