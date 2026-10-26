import fs from 'fs';

const text = fs.readFileSync('docs/FEATURES_MEMORY.md', 'utf8');

const checks = [
  // Module 14: 14.1 - 14.8
  { id: '14.1', title: 'DOM-Isolated Standalone Studio Boot', file: 'src/App.jsx' },
  { id: '14.2', title: 'Two-Tier Mode Architecture', file: 'src/components/ControlCenterFullView.jsx' },
  { id: '14.3', title: 'Isolated Single Mode', file: 'src/components/ControlCenterFullView.jsx' },
  { id: '14.4', title: 'Bi-Directional URL Deep Linking', file: 'src/components/ControlCenterFullView.jsx' },
  { id: '14.5', title: 'Interactive Playground Dedicated', file: 'src/components/InteractivePlayground.jsx' },
  { id: '14.6', title: 'Active Tab Header 1-Click Popout Trigger', file: 'src/components/ControlCenterPanel.jsx' },
  { id: '14.7', title: 'Live Storage Synchronization Blinking Indicator', file: 'src/components/ControlCenterFullView.jsx' },
  { id: '14.8', title: 'Full Bilingual (EN/HI) Studio Localization', file: 'src/components/ControlCenterFullView.jsx' },

  // Module 15: 15.1 - 15.10
  { id: '15.1', title: 'Zero-Permission Client-Side Hardware Profiler', file: 'src/utils/deviceProfiler.js' },
  { id: '15.2', title: 'Deterministic 50ms JS Micro-Benchmark Engine', file: 'src/utils/deviceProfiler.js' },
  { id: '15.3', title: 'Zero-Permission Privacy-Preserving City-Level IP Geolocation', file: 'src/utils/deviceProfiler.js' },
  { id: '15.4', title: 'Conservative Model Tiering & Safety Clamp Engine', file: 'src/utils/deviceProfiler.js' },
  { id: '15.5', title: 'Zero-Main-Thread Blocking AI Web Worker Thread', file: 'src/workers/aiModelWorker.js' },
  { id: '15.6', title: 'Automated WebGPU-to-WASM Fallback Pipeline', file: 'src/workers/aiModelWorker.js' },
  { id: '15.7', title: 'Streamable Download Progress Normalization', file: 'src/workers/aiModelWorker.js' },
  { id: '15.8', title: 'Local AI Singleton Service & Consent Lifecycle Manager', file: 'src/services/localAIService.js' },
  { id: '15.9', title: 'Silent Low-Priority Background Model Pre-warming', file: 'src/services/localAIService.js' },
  { id: '15.10', title: 'Action Bar Response Model Attribution Badge', file: 'src/components/AIChatWidget.jsx' },

  // Module 3 Gaps: 3.61 - 3.68
  { id: '3.61', title: '360° Interactive Orbital Sun Compass Dial', file: 'src/components/ControlCenterPanel.jsx' },
  { id: '3.62', title: 'Central Live Shadow Sphere', file: 'src/components/ControlCenterPanel.jsx' },
  { id: '3.63', title: '4 Quick Quadrant Buttons', file: 'src/components/ControlCenterPanel.jsx' },
  { id: '3.64', title: '3D Material Shader Orbs', file: 'src/components/ControlCenterPanel.jsx' },
  { id: '3.65', title: 'Real-Time Visual Bevel Chamfer Cross-Section Diagram', file: 'src/components/ControlCenterPanel.jsx' },
  { id: '3.66', title: 'Interactive 3D XYZ Orientation Viewport Gizmo', file: 'src/components/ControlCenterPanel.jsx' },
  { id: '3.67', title: 'Perspective Ground Grid Floor', file: 'src/components/ControlCenterPanel.jsx' },
  { id: '3.68', title: 'Hold to Compare 2D vs 3D', file: 'src/components/ControlCenterPanel.jsx' },

  // Module 5 Gaps: 5.48 - 5.52
  { id: '5.48', title: 'Multi-Tab Anti-Echo Guard & Infinite Loop Shield', file: 'src/context/LabContext.jsx' },
  { id: '5.49', title: 'Serialized Payload Deduplication Shield', file: 'src/context/LabContext.jsx' },
  { id: '5.50', title: 'Reference Stability Setter Verification across Subsystems', file: 'src/context/LabContext.jsx' },
  { id: '5.51', title: 'Voice Announcement Settings Storage Persistence', file: 'src/context/LabContext.jsx' },
  { id: '5.52', title: 'Cross-Tab Role Context Storage Event Synchronization', file: 'src/context/RoleContext.jsx' },

  // Module 6 Gaps: 6.47 - 6.55
  { id: '6.47', title: 'On-Device AI Engine & Conservative Tiering Verification Suite', file: 'scripts/verify_on_device_ai.mjs' },
  { id: '6.48', title: '360° Circular Compass Dial & Solar Lighting Verification Suite', file: 'scripts/verify_gap1_orbital_sun_compass.mjs' },
  { id: '6.49', title: '3D Material Shader Orbs & Bevel Chamfer Verification Suite', file: 'scripts/verify_gap2_material_shader_orbs.mjs' },
  { id: '6.50', title: 'Multi-Tab Anti-Echo & Reference Stability Verification Suite', file: 'scripts/verify_multi_tab_anti_echo.mjs' },
  { id: '6.51', title: 'Control Center Standalone View Specification Suite', file: 'scripts/verify_control_center_standalone_view.mjs' },
  { id: '6.52', title: 'Stream A URL Parameter & Popout Single Tab Panel Suite', file: 'scripts/verify_stream_a_url_panel.mjs' },
  { id: '6.53', title: 'Theme & Language Preservation Two-Tier Control Audit Suite', file: 'scripts/test_theme_lang_two_tier_control.mjs' },
  { id: '6.54', title: 'Independent Subagent Quality & Verification Audit Suite', file: 'scripts/verify_subagent_fixes_audit.mjs' },
  { id: '6.55', title: '3D Sandbox Viewport Gizmo, Perspective Grid & 2D Compare Verification Suite', file: 'scripts/verify_gap3_sandbox_hud.mjs' },
];

let allPassed = true;
for (const check of checks) {
  const line = text.split('\n').find(l => l.startsWith('| ' + check.id + ' |'));
  if (!line) {
    console.error(`❌ Missing feature row for ID: ${check.id}`);
    allPassed = false;
    continue;
  }
  if (!line.includes(check.title)) {
    console.error(`❌ Title mismatch for ID: ${check.id} -> ${line.substring(0, 60)}`);
    allPassed = false;
  }
  if (!line.includes(check.file)) {
    console.error(`❌ File mismatch for ID: ${check.id} -> ${line.substring(0, 80)}`);
    allPassed = false;
  }
  // Check that the referenced file exists on disk
  const filePath = check.file.split(',')[0].trim();
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File referenced does not exist on disk: ${filePath}`);
    allPassed = false;
  }
}

if (allPassed) {
  console.log(`✅ ALL ${checks.length} NEWLY ADDED FEATURES & REFERENCED FILES EXIST AND PASS VERIFICATION!`);
}
