/**
 * verify_new_phase1_pbr_strata_telemetry.mjs
 *
 * Verification suite for NEW PHASE 1 features:
 * 1. Feature 1: Granular PBR Material Surface Customizer
 * 2. Feature 3: Stratum Isolation & Solo Mode in Exploded CAD
 * 3. Feature 8: Real-Time Performance & GPU Telemetry HUD
 */

import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    console.log(`  ✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${msg}`);
    failed++;
  }
}

console.log('================================================================');
console.log('  VERIFY NEW PHASE 1: PBR, STRATUM ISOLATION & TELEMETRY HUD     ');
console.log('================================================================\n');

// Load module dynamically via Vite SSR loader to resolve JSX
const { createServer } = await import('vite');
const vite = await createServer({
  root: rootDir,
  server: { middlewareMode: true }
});

const labContextModule = await vite.ssrLoadModule('./src/context/LabContext.jsx');
const {
  FACTORY_DEFAULTS,
  normalize3DMaterials,
  normalize3DExploded,
  normalize3DPerformance,
  computeScopedSandboxStyles
} = labContextModule;

// -------------------------------------------------------------------------
// 1. LAB CONTEXT DEFAULTS & NORMALIZERS
// -------------------------------------------------------------------------
console.log('--- 1. LabContext Defaults & Normalizers ---');

assert(
  FACTORY_DEFAULTS.threeD.materials.roughness === 0.25 &&
  FACTORY_DEFAULTS.threeD.materials.metalness === 0.20 &&
  FACTORY_DEFAULTS.threeD.materials.ior === 1.50 &&
  FACTORY_DEFAULTS.threeD.materials.clearcoat === 0.40,
  'FACTORY_DEFAULTS.threeD.materials includes PBR defaults (roughness: 0.25, metalness: 0.20, ior: 1.50, clearcoat: 0.40)'
);

assert(
  FACTORY_DEFAULTS.threeD.exploded.soloStrata === null,
  'FACTORY_DEFAULTS.threeD.exploded defaults soloStrata to null'
);

assert(
  FACTORY_DEFAULTS.threeD.performance.showTelemetryHud === true,
  'FACTORY_DEFAULTS.threeD.performance defaults showTelemetryHud to true'
);

// Test normalize3DMaterials
const normalizedPbr = normalize3DMaterials({
  roughness: 0.85,
  metalness: 0.95,
  ior: 2.1,
  clearcoat: 0.75
});
assert(
  normalizedPbr.roughness === 0.85 &&
  normalizedPbr.metalness === 0.95 &&
  normalizedPbr.ior === 2.1 &&
  normalizedPbr.clearcoat === 0.75,
  'normalize3DMaterials correctly preserves valid PBR values'
);

const clampedPbr = normalize3DMaterials({
  roughness: 1.5,
  metalness: -0.5,
  ior: 4.0,
  clearcoat: -0.2
});
assert(
  clampedPbr.roughness === 1.0 &&
  clampedPbr.metalness === 0.0 &&
  clampedPbr.ior === 2.5 &&
  clampedPbr.clearcoat === 0.0,
  'normalize3DMaterials strictly clamps PBR properties within physical ranges'
);

// Test normalize3DExploded soloStrata
const soloChassis = normalize3DExploded({ soloStrata: 'chassis' });
const soloContent = normalize3DExploded({ soloStrata: 'content' });
const soloDock = normalize3DExploded({ soloStrata: 'dock' });
const soloInvalid = normalize3DExploded({ soloStrata: 'unknown_strata' });

assert(
  soloChassis.soloStrata === 'chassis' &&
  soloContent.soloStrata === 'content' &&
  soloDock.soloStrata === 'dock' &&
  soloInvalid.soloStrata === null,
  'normalize3DExploded supports soloStrata: chassis, content, dock (and null for invalid)'
);

// Test normalize3DPerformance showTelemetryHud
const perfOn = normalize3DPerformance({ showTelemetryHud: true });
const perfOff = normalize3DPerformance({ showTelemetryHud: false });
assert(
  perfOn.showTelemetryHud === true && perfOff.showTelemetryHud === false,
  'normalize3DPerformance supports boolean showTelemetryHud'
);

// Test computeScopedSandboxStyles
const styles = computeScopedSandboxStyles({
  ...FACTORY_DEFAULTS.threeD,
  materials: {
    ...FACTORY_DEFAULTS.threeD.materials,
    roughness: 0.65,
    metalness: 0.80,
    ior: 1.75,
    clearcoat: 0.50
  }
});
assert(
  styles['--3d-roughness'] === '0.65' &&
  styles['--3d-metalness'] === '0.8' &&
  styles['--3d-ior'] === '1.75' &&
  styles['--3d-clearcoat'] === '0.5',
  'computeScopedSandboxStyles correctly outputs CSS variables for PBR parameters'
);

// -------------------------------------------------------------------------
// 2. HELPER ACTIONS IN LAB CONTEXT
// -------------------------------------------------------------------------
console.log('\n--- 2. Helper Actions in LabContext.jsx ---');
const labContextSrc = readFileSync(path.join(rootDir, 'src/context/LabContext.jsx'), 'utf8');

assert(
  labContextSrc.includes('set3DMaterialRoughness') &&
  labContextSrc.includes('set3DMaterialMetalness') &&
  labContextSrc.includes('set3DMaterialIOR') &&
  labContextSrc.includes('set3DMaterialClearcoat'),
  'LabContext provides PBR helper actions: set3DMaterialRoughness, set3DMaterialMetalness, set3DMaterialIOR, set3DMaterialClearcoat'
);

assert(
  labContextSrc.includes('set3DSoloStrata'),
  'LabContext provides set3DSoloStrata action'
);

// -------------------------------------------------------------------------
// 3. CONTROL CENTER ACCORDION 4 (PBR SLIDERS), ACCORDION 6 & 9
// -------------------------------------------------------------------------
console.log('\n--- 3. ControlCenterPanel Controls ---');
const ccpSrc = readFileSync(path.join(rootDir, 'src/components/ControlCenterPanel.jsx'), 'utf8');

assert(
  ccpSrc.includes('Surface Roughness') &&
  ccpSrc.includes('set3DMaterialRoughness') &&
  ccpSrc.includes('Metallic Conductance') &&
  ccpSrc.includes('set3DMaterialMetalness') &&
  ccpSrc.includes('Refraction Index (IOR)') &&
  ccpSrc.includes('set3DMaterialIOR'),
  'Accordion 4 renders tactile PBR sliders: Surface Roughness, Metallic Conductance, Refraction Index (IOR)'
);

assert(
  ccpSrc.includes('Stratum Isolation &amp; Solo Lens') &&
  ccpSrc.includes('set3DSoloStrata') &&
  ccpSrc.includes('All Strata') &&
  ccpSrc.includes('Chassis -01') &&
  ccpSrc.includes('Content 00') &&
  ccpSrc.includes('Dock +01'),
  'Accordion 6 renders tactile 4-button pill strip: [All Strata | Chassis -01 | Content 00 | Dock +01]'
);

assert(
  ccpSrc.includes('Show Real-Time Telemetry HUD') &&
  ccpSrc.includes('showTelemetryHud'),
  'Accordion 9 renders toggle switch for Show Real-Time Telemetry HUD'
);

// -------------------------------------------------------------------------
// 4. UNIVERSAL MINI PORTFOLIO & HERO CARD PREVIEW CONSUMPTION
// -------------------------------------------------------------------------
console.log('\n--- 4. 3D Viewports & Surface Shader Integration ---');
const miniPortfolioSrc = readFileSync(path.join(rootDir, 'src/components/3d-sandbox/UniversalMiniPortfolio.jsx'), 'utf8');
const heroPreviewSrc = readFileSync(path.join(rootDir, 'src/components/3d-sandbox/previews/HeroCardPreview.jsx'), 'utf8');

assert(
  miniPortfolioSrc.includes("'--3d-roughness': roughness") &&
  miniPortfolioSrc.includes("'--3d-metalness': metalness") &&
  miniPortfolioSrc.includes("'--3d-ior': ior"),
  'UniversalMiniPortfolio injects --3d-roughness, --3d-metalness, --3d-ior CSS variables'
);

assert(
  heroPreviewSrc.includes("'--3d-roughness': roughness") &&
  heroPreviewSrc.includes("'--3d-metalness': metalness") &&
  heroPreviewSrc.includes("'--3d-ior': ior"),
  'HeroCardPreview injects --3d-roughness, --3d-metalness, --3d-ior CSS variables'
);

assert(
  miniPortfolioSrc.includes('getStrataDimStyle') &&
  miniPortfolioSrc.includes('isChassisSolo') &&
  miniPortfolioSrc.includes('isContentSolo') &&
  miniPortfolioSrc.includes('isDockSolo'),
  'UniversalMiniPortfolio implements Stratum Isolation dimming & luminous focus logic'
);

assert(
  miniPortfolioSrc.includes('data-testid="telemetry-hud"') &&
  miniPortfolioSrc.includes('FPS') &&
  miniPortfolioSrc.includes('ms') &&
  miniPortfolioSrc.includes('performanceConfig.showTelemetryHud'),
  'UniversalMiniPortfolio renders real-time Telemetry HUD pill with rolling FPS & frame latency'
);

await vite.close();

console.log('\n================================================================');
console.log(`  VERIFICATION RESULTS: ${passed} PASSED | ${failed} FAILED`);
console.log('================================================================\n');

if (failed > 0) {
  process.exit(1);
}
