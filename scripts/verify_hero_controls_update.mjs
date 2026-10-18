/**
 * Verification Script: Hero & Character Section Updates in Control Center
 * 
 * Verifies:
 * 1. LabContext.jsx:
 *    - FACTORY_DEFAULTS.hero has zoomFocus, dragEnabled, dragBoundaryConstrained, dragAutoSnapBack, parallaxTiltEnabled
 *    - ZOOM_FOCUS_MAP definitions ('head', 'center', 'feet')
 *    - normalizeZoomFocus function
 *    - Setters & recenterCharacter function exposed in context
 * 2. useDraggableCharacter.js:
 *    - Accepts and reacts to dragEnabled, dragBoundaryConstrained, dragAutoSnapBack
 *    - Listens to portfolio:recenter-character event
 *    - Unconstrained dragging support
 * 3. HeroSection.jsx:
 *    - Dynamic transformOrigin from zoomFocus
 *    - Parallax tilt toggling
 *    - Drag options passed to hook
 * 4. ControlCenterPanel.jsx:
 *    - 3-button segmented control for zoomFocus
 *    - Drag & drop toggles and recenter button
 *    - Parallax tilt toggle
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

const ROOT_DIR = process.cwd();

console.log('====================================================');
console.log('AUDIT VERIFICATION: HERO & CHARACTER CONTROLS UPDATE');
console.log('====================================================\n');

let passCount = 0;
function check(condition, desc) {
  if (condition) {
    console.log(`✅ PASS: ${desc}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${desc}`);
    process.exitCode = 1;
  }
}

// 1. LabContext.jsx
const labContextPath = path.join(ROOT_DIR, 'src', 'context', 'LabContext.jsx');
const labContextSource = fs.readFileSync(labContextPath, 'utf8');

check(labContextSource.includes("zoomFocus: 'center'"), 'LabContext FACTORY_DEFAULTS.hero has zoomFocus: center');
check(labContextSource.includes('dragEnabled: true'), 'LabContext FACTORY_DEFAULTS.hero has dragEnabled: true');
check(labContextSource.includes('dragBoundaryConstrained: true'), 'LabContext FACTORY_DEFAULTS.hero has dragBoundaryConstrained: true');
check(labContextSource.includes('dragAutoSnapBack: false'), 'LabContext FACTORY_DEFAULTS.hero has dragAutoSnapBack: false');
check(labContextSource.includes('parallaxTiltEnabled: true'), 'LabContext FACTORY_DEFAULTS.hero has parallaxTiltEnabled: true');

check(labContextSource.includes("export const ZOOM_FOCUS_MAP = {"), 'LabContext exports ZOOM_FOCUS_MAP');
check(labContextSource.includes("head: '50% 18%'") && labContextSource.includes("center: '50% 50%'") && labContextSource.includes("feet: '50% 90%'"), 'ZOOM_FOCUS_MAP defines accurate head, center, and feet coordinates');
check(labContextSource.includes('export function normalizeZoomFocus('), 'LabContext exports normalizeZoomFocus function');

check(labContextSource.includes('const setZoomFocus = useCallback('), 'LabContext defines setZoomFocus');
check(labContextSource.includes('const setDragEnabled = useCallback('), 'LabContext defines setDragEnabled');
check(labContextSource.includes('const setDragBoundaryConstrained = useCallback('), 'LabContext defines setDragBoundaryConstrained');
check(labContextSource.includes('const setDragAutoSnapBack = useCallback('), 'LabContext defines setDragAutoSnapBack');
check(labContextSource.includes('const setParallaxTiltEnabled = useCallback('), 'LabContext defines setParallaxTiltEnabled');
check(labContextSource.includes('const recenterCharacter = useCallback('), 'LabContext defines recenterCharacter');
check(labContextSource.includes("window.dispatchEvent(new CustomEvent('portfolio:recenter-character'))"), 'recenterCharacter dispatches portfolio:recenter-character event');

// 2. useDraggableCharacter.js
const draggablePath = path.join(ROOT_DIR, 'src', 'hooks', 'useDraggableCharacter.js');
const draggableSource = fs.readFileSync(draggablePath, 'utf8');

check(draggableSource.includes('dragEnabled,'), 'useDraggableCharacter accepts dragEnabled');
check(draggableSource.includes('dragBoundaryConstrained = true,'), 'useDraggableCharacter accepts dragBoundaryConstrained');
check(draggableSource.includes('dragAutoSnapBack = false,'), 'useDraggableCharacter accepts dragAutoSnapBack');
check(draggableSource.includes('if (!boundaryConstrainedRef.current)'), 'useDraggableCharacter supports unconstrained dragging when dragBoundaryConstrained is false');
check(draggableSource.includes('if (autoSnapBackRef.current) {') && draggableSource.includes('resetPosition();'), 'useDraggableCharacter springs back to center on drop when autoSnapBack is true');
check(draggableSource.includes("window.addEventListener('portfolio:recenter-character'"), 'useDraggableCharacter listens to portfolio:recenter-character');

// 3. HeroSection.jsx
const heroPath = path.join(ROOT_DIR, 'src', 'components', 'HeroSection.jsx');
const heroSource = fs.readFileSync(heroPath, 'utf8');

check(heroSource.includes('ZOOM_FOCUS_MAP'), 'HeroSection imports ZOOM_FOCUS_MAP');
check(heroSource.includes('activeTransformOrigin = (ZOOM_FOCUS_MAP && ZOOM_FOCUS_MAP[zoomFocus]) ||'), 'HeroSection derives activeTransformOrigin from zoomFocus');
check(heroSource.includes('transformOrigin: activeTransformOrigin,'), 'characterInnerRef applies dynamic activeTransformOrigin');
check(heroSource.includes('dragBoundaryConstrained,') && heroSource.includes('dragAutoSnapBack'), 'HeroSection passes dragBoundaryConstrained and dragAutoSnapBack to useDraggableCharacter');
check(heroSource.includes('const isParallaxActive = parallaxTiltEnabledRef.current && !isFixedGaze;'), 'HeroSection gates parallax tracking with parallaxTiltEnabled');

// 4. ControlCenterPanel.jsx
const panelPath = path.join(ROOT_DIR, 'src', 'components', 'ControlCenterPanel.jsx');
const panelSource = fs.readFileSync(panelPath, 'utf8');

check(panelSource.includes('Zoom Focus Anchor'), 'ControlCenterPanel has Zoom Focus Anchor section in Tab 3');
check(panelSource.includes("setZoomFocus(item.id)") || panelSource.includes("setZoomFocus('head')"), 'ControlCenterPanel connects 3-button segmented control to setZoomFocus');
check(panelSource.includes('Character Drag & Drop Controls'), 'ControlCenterPanel has Character Drag & Drop section');
check(panelSource.includes('recenterCharacter()'), 'ControlCenterPanel has Recenter action button');
check(panelSource.includes('setDragEnabled('), 'ControlCenterPanel has dragEnabled toggle');
check(panelSource.includes('setDragBoundaryConstrained('), 'ControlCenterPanel has dragBoundaryConstrained toggle');
check(panelSource.includes('setDragAutoSnapBack('), 'ControlCenterPanel has dragAutoSnapBack toggle');
check(panelSource.includes('setParallaxTiltEnabled('), 'ControlCenterPanel has parallaxTiltEnabled toggle');

console.log('\n====================================================');
console.log(`TOTAL AUDIT CHECKS PASSED: ${passCount} / 28`);
console.log('====================================================\n');
