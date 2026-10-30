import fs from 'fs';
import path from 'path';

console.log('========================================================================');
console.log('  VERIFY 3D ENHANCEMENT PHASE 1: BACKEND REPAIR & BROKEN LINKS AUDIT    ');
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

// 1. Audit src/components/ControlCenterPanel.jsx for #panel-threed CSS custom properties
const controlCenterContent = fs.readFileSync('src/components/ControlCenterPanel.jsx', 'utf8');

check(
  'ControlCenterPanel injects canonical --3d-light-angle and legacy --3d-lighting-angle',
  controlCenterContent.includes("'--3d-light-angle': `${lighting?.angle ?? 45}deg`") &&
  controlCenterContent.includes("'--3d-lighting-angle': `${lighting?.angle ?? 45}deg`")
);

check(
  'ControlCenterPanel injects canonical --3d-bevel-extrusion and legacy --3d-materials-bevel',
  controlCenterContent.includes("'--3d-bevel-extrusion': `${materials?.bevelExtrusion ?? 3}px`") &&
  controlCenterContent.includes("'--3d-materials-bevel': `${materials?.bevelExtrusion ?? 3}px`")
);

check(
  'ControlCenterPanel injects --3d-roughness and --3d-metalness on #panel-threed',
  controlCenterContent.includes("'--3d-roughness': `${materials?.roughness ?? 0.25}`") &&
  controlCenterContent.includes("'--3d-metalness': `${materials?.metalness ?? 0.20}`")
);

// 2. Audit src/context/LabContext.jsx for neutral baseline PBR resets
const labContextContent = fs.readFileSync('src/context/LabContext.jsx', 'utf8');

check(
  'LabContext resets --3d-roughness to 0 in neutral baseline branch',
  labContextContent.includes("root.style.setProperty('--3d-roughness', '0');")
);

check(
  'LabContext resets --3d-metalness to 0 in neutral baseline branch',
  labContextContent.includes("root.style.setProperty('--3d-metalness', '0');")
);

check(
  'LabContext resets --3d-ior to 1 in neutral baseline branch',
  labContextContent.includes("root.style.setProperty('--3d-ior', '1');")
);

check(
  'LabContext resets --3d-clearcoat to 0 in neutral baseline branch',
  labContextContent.includes("root.style.setProperty('--3d-clearcoat', '0');")
);

// 3. Audit ControlCenterPanel.jsx component-level reset payloads
check(
  'Lighting reset payload strictly matches FACTORY_DEFAULTS (no intensity/shadowBlur ghost keys)',
  controlCenterContent.includes("set3DLighting({ preset: 'studio-soft', angle: 45, cursorLight: true, shadowSoftness: 0.7, showSunGizmo: true })")
);

check(
  'Materials reset payload has full PBR keys (specularGlow, bevelExtrusion, roughness, metalness, ior, clearcoat)',
  controlCenterContent.includes("set3DMaterials({ preset: 'glass-acrylic', specularGlow: 0.6, bevelExtrusion: 3, roughness: 0.25, metalness: 0.20, ior: 1.50, clearcoat: 0.40 })")
);

check(
  'Camera reset payload sets orbitSpeed to 1.0 (not out-of-range 30)',
  controlCenterContent.includes("set3DCamera({ anglePreset: 'isometric', perspectiveFOV: 1000, tiltSensitivity: 15, autoOrbit: false, orbitSpeed: 1.0 })")
);

check(
  'Physics reset payload uses boolean clickDepression (true) and magneticPull (false)',
  controlCenterContent.includes("set3DPhysics({ elasticity: 'snappy', hoverPop: 12, clickDepression: true, magneticPull: false, gravityDrop: false })")
);

// 4. Audit StickySandboxColumn.jsx for boolean rendering fix
const stickySandboxContent = fs.readFileSync('src/components/3d-sandbox/StickySandboxColumn.jsx', 'utf8');

check(
  'StickySandboxColumn does NOT have broken boolean render {threeD.physics?.clickDepression ?? 6}px',
  !stickySandboxContent.includes('{threeD.physics?.clickDepression ?? 6}px')
);

check(
  'StickySandboxColumn renders active state or tactile displacement for clickDepression',
  stickySandboxContent.includes("<span>Depress: {threeD.physics?.clickDepression ? 'Active (6px)' : 'Off'}</span>")
);

// 5. Audit mediaExport.js
const mediaExportContent = fs.readFileSync('src/utils/mediaExport.js', 'utf8');

check(
  'mediaExport.js does NOT force dark mode with || true',
  !mediaExportContent.includes("classList.contains('dark') || true") &&
  mediaExportContent.includes("const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');")
);

check(
  'mediaExport.js capture3DStageSnapshot queries multi-tab preview containers',
  mediaExportContent.includes('[data-testid="materials-stage-preview"]') &&
  mediaExportContent.includes('[data-testid="lighting-studio-preview"]') &&
  mediaExportContent.includes('[data-testid="camera-viewport-preview"]') &&
  mediaExportContent.includes('[data-testid="physics-spring-preview"]') &&
  mediaExportContent.includes('[data-testid="exploded-cad-preview"]')
);

check(
  'mediaExport.js uses 2000ms safe revocation window for blob downloads',
  mediaExportContent.includes('setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);')
);

// 6. Audit ControlCenterPanel.jsx for Object URL revocation and cleanup on unmount
check(
  'ControlCenterPanel implements activeMeshUrlRef and cleanup on unmount',
  controlCenterContent.includes('const activeMeshUrlRef = useRef(null);') &&
  controlCenterContent.includes('URL.revokeObjectURL(activeMeshUrlRef.current);')
);

// 7. Audit ControlCenterPanel.jsx accordion numbering comments
const accordionComments = controlCenterContent.match(/PRESET ACCORDION \d/g) || [];
check(
  'ControlCenterPanel has 5 sequentially numbered Preset Accordions (1 to 5) with zero duplicate numbers',
  accordionComments.length === 5 &&
  accordionComments[0] === 'PRESET ACCORDION 1' &&
  accordionComments[1] === 'PRESET ACCORDION 2' &&
  accordionComments[2] === 'PRESET ACCORDION 3' &&
  accordionComments[3] === 'PRESET ACCORDION 4' &&
  accordionComments[4] === 'PRESET ACCORDION 5'
);

console.log('\n========================================================================');
console.log(`TOTAL PHASE 1 CHECKS: ${totalChecks} | PASSED: ${passedChecks} | FAILED: ${totalChecks - passedChecks}`);
console.log('========================================================================\n');

if (passedChecks === totalChecks) {
  console.log('🎉 ALL PHASE 1 BACKEND REPAIR & LINK AUDIT CHECKS PASSED WITH 100%! 🎉\n');
  process.exit(0);
} else {
  console.error('❌ PHASE 1 VERIFICATION FAILED!\n');
  process.exit(1);
}
